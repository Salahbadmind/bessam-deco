import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import {
  deleteImageFromStorage,
  deleteMultipleImagesFromStorage,
  extractStorageKey,
} from './r2';
import {
  Project,
  ServiceItem,
  Testimonial,
  Inquiry,
  Consultation,
  SiteSettings,
  MediaItem,
  Property,
} from '../src/types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_PROPERTIES,
} from '../src/data/seedData';

interface StoreData {
  projects: Project[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  consultations: Consultation[];
  siteSettings: SiteSettings;
  media: MediaItem[];
  properties: Property[];
}

const dataDir = path.join(process.cwd(), 'server', 'data');
const storeFilePath = path.join(dataDir, 'store.json');

// Supabase client instance if environment credentials exist
let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY;

  if (url && key && !supabaseClient) {
    try {
      supabaseClient = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
    }
  }
  return supabaseClient;
}

/**
 * Robust adaptive insert: if Supabase returns a schema-cache or column-does-not-exist error,
 * this function automatically strips the unsupported column from the payload and retries until success.
 */
async function supabaseAdaptiveInsert(
  supabase: SupabaseClient,
  table: string,
  initialPayload: Record<string, any>
): Promise<{ data: any; error: any }> {
  let currentPayload = { ...initialPayload };
  const maxAttempts = Object.keys(currentPayload).length + 2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .insert([currentPayload])
      .select()
      .single();

    if (!error) {
      return { data, error: null };
    }

    const errorMsg = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
    // Match missing column patterns from PostgREST / Supabase
    const missingColMatch =
      errorMsg.match(/Could not find the ['"]([^'"]+)['"] column/i) ||
      errorMsg.match(/column ['"]([^'"]+)['"] of relation/i) ||
      errorMsg.match(/column ['"]([^'"]+)['"] does not exist/i);

    if (missingColMatch && missingColMatch[1] && currentPayload.hasOwnProperty(missingColMatch[1])) {
      const missingCol = missingColMatch[1];
      console.warn(`[Supabase ${table} Adaptive Insert] Column '${missingCol}' missing in table. Stripping column and retrying...`);

      // If address is missing, ensure location contains address info if available
      if (missingCol === 'address' && currentPayload.address && currentPayload.location) {
        if (!currentPayload.location.includes(currentPayload.address)) {
          currentPayload.location = `${currentPayload.location}, ${currentPayload.address}`;
        }
      }

      delete currentPayload[missingCol];
      continue;
    }

    // Fallback: If select().single() fails due to RLS read policy on insert, try standard insert
    if (errorMsg.includes('Results contain 0 rows') || errorMsg.includes('multiple (or no) rows returned')) {
      const { error: fallbackErr } = await supabase.from(table).insert([currentPayload]);
      if (!fallbackErr) {
        return { data: currentPayload, error: null };
      }
    }

    return { data, error };
  }

  return { data: null, error: new Error('Exceeded max retry attempts') };
}

/**
 * Robust adaptive update: strips missing columns dynamically upon schema error and retries
 */
async function supabaseAdaptiveUpdate(
  supabase: SupabaseClient,
  table: string,
  orCondition: string,
  initialUpdates: Record<string, any>
): Promise<{ data: any; error: any }> {
  let currentUpdates = { ...initialUpdates };
  const maxAttempts = Object.keys(currentUpdates).length + 2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, error } = await supabase
      .from(table)
      .update(currentUpdates)
      .or(orCondition);

    if (!error) {
      return { data, error: null };
    }

    const errorMsg = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
    const missingColMatch =
      errorMsg.match(/Could not find the ['"]([^'"]+)['"] column/i) ||
      errorMsg.match(/column ['"]([^'"]+)['"] of relation/i) ||
      errorMsg.match(/column ['"]([^'"]+)['"] does not exist/i);

    if (missingColMatch && missingColMatch[1] && currentUpdates.hasOwnProperty(missingColMatch[1])) {
      const missingCol = missingColMatch[1];
      console.warn(`[Supabase ${table} Adaptive Update] Column '${missingCol}' missing in table. Stripping column and retrying...`);

      if (missingCol === 'address' && currentUpdates.address && currentUpdates.location) {
        if (!currentUpdates.location.includes(currentUpdates.address)) {
          currentUpdates.location = `${currentUpdates.location}, ${currentUpdates.address}`;
        }
      }

      delete currentUpdates[missingCol];
      continue;
    }

    return { data, error };
  }

  return { data: null, error: new Error('Exceeded max retry attempts') };
}

function loadLocalStore(): StoreData {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(storeFilePath)) {
    const initial: StoreData = {
      projects: INITIAL_PROJECTS,
      services: INITIAL_SERVICES,
      testimonials: INITIAL_TESTIMONIALS,
      inquiries: [
        {
          id: 'inq-1',
          name: 'Yacine Mansouri',
          phone: '+213 550 12 34 56',
          email: 'yacine.mansouri@outlook.com',
          project_type: 'Villa Full Renovation',
          location: 'Batna',
          space_size: '350 m²',
          budget: 'DZD 15,000,000+',
          message:
            'We recently acquired a multi-level villa and want a total architectural redesign with bespoke travertine works, minimalist kitchen, and smart lighting.',
          status: 'New',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'inq-2',
          name: 'Amel Khelil',
          phone: '+213 661 78 90 12',
          email: 'amel.khelil@gmail.com',
          project_type: 'Kitchen & Living Space',
          location: 'Hydra, Algiers',
          space_size: '180 m²',
          budget: 'DZD 8,000,000 - 12,000,000',
          message:
            'Looking to remodel our penthouse kitchen and salon with monolithic marble finishes and concealed cabinetry.',
          status: 'Contacted',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        },
      ],
      consultations: [
        {
          id: 'cons-1',
          client_name: 'Karim Bouzid',
          email: 'karim.bouzid@enterprise.dz',
          phone: '+213 555 98 76 54',
          consultation_type: 'On-Site Architectural Survey',
          date: '2026-09-18',
          time_slot: '14:00 - 15:30',
          project_scope: 'Complete Villa Interior Renovation & Joinery',
          notes: 'Wants initial spatial measurement and discussion of materials.',
          status: 'Confirmed',
          created_at: new Date().toISOString(),
        },
      ],
      siteSettings: INITIAL_SITE_SETTINGS,
      media: INITIAL_MEDIA_ITEMS,
      properties: INITIAL_PROPERTIES,
    };
    fs.writeFileSync(storeFilePath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(storeFilePath, 'utf-8');
    const parsed: StoreData = JSON.parse(raw);
    if (!parsed.siteSettings) {
      parsed.siteSettings = INITIAL_SITE_SETTINGS;
      saveLocalStore(parsed);
    } else {
      if (!parsed.siteSettings.admin_email) {
        parsed.siteSettings.admin_email = INITIAL_SITE_SETTINGS.admin_email;
      }
      if (!parsed.siteSettings.admin_password) {
        parsed.siteSettings.admin_password = INITIAL_SITE_SETTINGS.admin_password;
      }
    }
    if (!parsed.properties || !Array.isArray(parsed.properties)) {
      parsed.properties = INITIAL_PROPERTIES;
      saveLocalStore(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading store.json, reinitializing:', err);
    return {
      projects: INITIAL_PROJECTS,
      services: INITIAL_SERVICES,
      testimonials: INITIAL_TESTIMONIALS,
      inquiries: [],
      consultations: [],
      siteSettings: INITIAL_SITE_SETTINGS,
      media: INITIAL_MEDIA_ITEMS,
      properties: INITIAL_PROPERTIES,
    };
  }
}

function saveLocalStore(data: StoreData): void {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write store.json:', err);
  }
}

// ----------------- PROJECTS -----------------
export async function dbGetProjects(category?: string, status?: string): Promise<Project[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: Project[] = data.map((p) => ({
          ...p,
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          materials: Array.isArray(p.materials) ? p.materials : [],
          services: Array.isArray(p.services) ? p.services : [],
        }));

        // Keep local store resiliently in sync
        const store = loadLocalStore();
        store.projects = mapped;
        saveLocalStore(store);

        return mapped;
      }
    } catch (e) {
      console.warn('Supabase projects fetch error, falling back to local:', e);
    }
  }

  const store = loadLocalStore();
  let projects = store.projects;
  if (category && category !== 'All') {
    projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (status) {
    projects = projects.filter((p) => p.status === status);
  }
  return projects;
}

export async function dbGetProjectBySlug(slugOrId: string): Promise<Project | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .single();
      if (!error && data) {
        return {
          ...data,
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          materials: Array.isArray(data.materials) ? data.materials : [],
          services: Array.isArray(data.services) ? data.services : [],
        };
      }
    } catch (e) {
      console.warn('Supabase project slug fetch error, falling back:', e);
    }
  }

  const store = loadLocalStore();
  const found = store.projects.find((p) => p.slug === slugOrId || p.id === slugOrId);
  return found || null;
}

export async function dbCreateProject(projectData: Partial<Project>): Promise<Project> {
  const generatedId = projectData.id || 'proj-' + Date.now();
  const generatedSlug =
    projectData.slug ||
    (projectData.title || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(Math.random() * 1000);

  const newProject: Project = {
    id: generatedId,
    title: projectData.title || 'Untitled Project',
    slug: generatedSlug,
    category: projectData.category || 'Residential',
    location: projectData.location || 'Batna, Algeria',
    year: projectData.year || new Date().getFullYear().toString(),
    scope: projectData.scope || 'Complete Interior Renovation',
    description: projectData.description || '',
    vision: projectData.vision || '',
    transformation: projectData.transformation || '',
    featured: Boolean(projectData.featured),
    status: projectData.status || 'Published',
    cover_image_url:
      projectData.cover_image_url ||
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    before_image_url: projectData.before_image_url || null,
    after_image_url: projectData.after_image_url || null,
    materials: projectData.materials || [],
    services: projectData.services || [],
    gallery: projectData.gallery || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const payload = {
        id: newProject.id,
        title: newProject.title,
        slug: newProject.slug,
        category: newProject.category,
        location: newProject.location,
        year: newProject.year,
        scope: newProject.scope,
        description: newProject.description,
        vision: newProject.vision,
        transformation: newProject.transformation,
        featured: newProject.featured,
        status: newProject.status,
        cover_image_url: newProject.cover_image_url,
        before_image_url: newProject.before_image_url,
        after_image_url: newProject.after_image_url,
        materials: newProject.materials,
        services: newProject.services,
        gallery: newProject.gallery,
      };

      const { data, error } = await supabaseAdaptiveInsert(supabase, 'projects', payload);

      if (error) {
        console.warn('Supabase insert error for project:', error.message || error);
      } else if (data && data.id) {
        newProject.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase insert exception, saved locally:', e);
    }
  }

  const store = loadLocalStore();
  store.projects.unshift(newProject);
  saveLocalStore(store);
  return newProject;
}

export async function dbUpdateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const store = loadLocalStore();
  const index = store.projects.findIndex((p) => p.id === id || p.slug === id);

  const cleanUpdates = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  let updated: Project;
  if (index !== -1) {
    updated = {
      ...store.projects[index],
      ...cleanUpdates,
    };
    store.projects[index] = updated;
    saveLocalStore(store);
  } else {
    updated = cleanUpdates as Project;
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabaseAdaptiveUpdate(supabase, 'projects', `id.eq.${id},slug.eq.${id}`, cleanUpdates);
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }

  return updated;
}

export async function dbDeleteProject(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const supabase = getSupabase();

  // 1. Locate project before deletion to extract all images to purge
  let project = store.projects.find((p) => p.id === id || p.slug === id);
  if (!project && supabase) {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();
      if (data) {
        project = data as Project;
      }
    } catch {
      // ignore
    }
  }

  // 2. Collect all images associated with this project
  const imagesToDelete: string[] = [];
  if (project) {
    if (project.cover_image_url) imagesToDelete.push(project.cover_image_url);
    if (project.before_image_url) imagesToDelete.push(project.before_image_url);
    if (project.after_image_url) imagesToDelete.push(project.after_image_url);
    if (Array.isArray(project.gallery)) {
      for (const item of project.gallery) {
        const url = typeof item === 'string' ? item : (item as any)?.image_url;
        if (url) imagesToDelete.push(url);
      }
    }
  }

  // 3. Purge all images permanently from Cloudflare R2 and local CDN
  if (imagesToDelete.length > 0) {
    console.log(`[Purge] Deleting ${imagesToDelete.length} images from Cloudflare R2 & storage for project ${id}`);
    await deleteMultipleImagesFromStorage(imagesToDelete);

    // Also purge corresponding media records from Supabase and local store
    for (const imgUrl of imagesToDelete) {
      const key = extractStorageKey(imgUrl);
      if (key) {
        if (supabase) {
          try {
            await supabase
              .from('media')
              .delete()
              .or(`filename.eq.${key},image_url.ilike.%${key}%`);
          } catch (err) {
            console.warn(`Failed to delete media record for key ${key}:`, err);
          }
        }
        store.media = store.media.filter(
          (m) => m.filename !== key && !m.image_url.includes(key)
        );
      }
    }
  }

  // 4. Delete the project record from Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().or(`id.eq.${id},slug.eq.${id}`);
      if (error) {
        console.warn('Supabase delete error by or condition, trying exact eq:', error);
        await supabase.from('projects').delete().eq('id', id);
      }
      console.log(`[Supabase] Successfully deleted project: ${id}`);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  // 5. Delete project from local store
  const initialLength = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id && p.slug !== id);
  const deleted = store.projects.length < initialLength || Boolean(project);
  saveLocalStore(store);

  return deleted;
}

// ----------------- SERVICES -----------------
export async function dbGetServices(): Promise<ServiceItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped: ServiceItem[] = data.map((s) => ({
          ...s,
          features: Array.isArray(s.features) ? s.features : [],
        }));
        const store = loadLocalStore();
        store.services = mapped;
        saveLocalStore(store);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase services fetch error, falling back:', e);
    }
  }

  const store = loadLocalStore();
  return store.services;
}

export async function dbCreateService(data: Partial<ServiceItem>): Promise<ServiceItem> {
  const store = loadLocalStore();
  const newService: ServiceItem = {
    id: data.id || 'srv-' + Date.now(),
    title: data.title || 'New Service',
    slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'service-' + Date.now()),
    description: data.description || '',
    image_url: data.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: data.features || [],
    sort_order: data.sort_order ?? (store.services.length + 1),
    active: data.active ?? true,
  };
  store.services.push(newService);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase.from('services').insert([newService]).select().single();
      if (error) {
        console.warn('Supabase service insert error:', error);
      } else if (inserted && inserted.id) {
        newService.id = inserted.id;
      }
    } catch (e) {
      console.warn('Supabase service insert error:', e);
    }
  }
  return newService;
}

export async function dbUpdateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  const store = loadLocalStore();
  const idx = store.services.findIndex((s) => s.id === id || s.slug === id);
  if (idx !== -1) {
    store.services[idx] = { ...store.services[idx], ...updates };
    saveLocalStore(store);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('services').update(updates).or(`id.eq.${id},slug.eq.${id}`);
    } catch (e) {
      console.warn('Supabase service update error:', e);
    }
  }
  return idx !== -1 ? store.services[idx] : (updates as ServiceItem);
}

export async function dbDeleteService(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const srv = store.services.find((s) => s.id === id || s.slug === id);

  // Purge service image from Cloudflare R2 and Supabase media table
  if (srv?.image_url) {
    console.log(`[Purge] Deleting service image for ${id}: ${srv.image_url}`);
    await deleteImageFromStorage(srv.image_url);
    const key = extractStorageKey(srv.image_url);
    if (key) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('media').delete().or(`filename.eq.${key},image_url.ilike.%${key}%`);
        } catch {
          // ignore
        }
      }
      store.media = store.media.filter((m) => m.filename !== key && !m.image_url.includes(key));
    }
  }

  const initial = store.services.length;
  store.services = store.services.filter((s) => s.id !== id && s.slug !== id);
  const deleted = store.services.length < initial;
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('services').delete().or(`id.eq.${id},slug.eq.${id}`);
      console.log(`[Supabase] Successfully deleted service: ${id}`);
    } catch (e) {
      console.warn('Supabase service delete error:', e);
    }
  }
  return deleted;
}

// ----------------- INQUIRIES -----------------
export async function dbGetInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const store = loadLocalStore();
        store.inquiries = data as Inquiry[];
        saveLocalStore(store);
        return data as Inquiry[];
      }
    } catch (e) {
      console.warn('Supabase inquiries fetch error, falling back:', e);
    }
  }

  const store = loadLocalStore();
  return store.inquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function dbCreateInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
  const inquiry: Inquiry = {
    id: data.id || 'inq-' + Date.now(),
    name: data.name || 'Anonymous',
    phone: data.phone || '',
    email: data.email || '',
    project_type: data.project_type || 'General Inquiry',
    location: data.location || '',
    space_size: data.space_size || '',
    budget: data.budget || '',
    message: data.message || '',
    attachment_url: data.attachment_url || null,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.inquiries.unshift(inquiry);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: ins, error } = await supabase.from('inquiries').insert([
        {
          id: inquiry.id,
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email,
          project_type: inquiry.project_type,
          location: inquiry.location,
          space_size: inquiry.space_size,
          budget: inquiry.budget,
          message: inquiry.message,
          status: inquiry.status,
        }
      ]).select().single();
      if (!error && ins && ins.id) {
        inquiry.id = ins.id;
      }
    } catch (e) {
      console.warn('Supabase inquiry insert error:', e);
    }
  }

  return inquiry;
}

export async function dbUpdateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Promise<Inquiry | null> {
  const store = loadLocalStore();
  const item = store.inquiries.find((i) => i.id === id);
  if (item) {
    item.status = status;
    saveLocalStore(store);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase inquiry update error:', e);
    }
  }
  return item || null;
}

export async function dbDeleteInquiry(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const initial = store.inquiries.length;
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  const deleted = store.inquiries.length < initial;
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('inquiries').delete().eq('id', id);
      console.log(`[Supabase] Successfully deleted inquiry: ${id}`);
    } catch (e) {
      console.warn('Supabase inquiry delete error:', e);
    }
  }
  return deleted;
}

// ----------------- CONSULTATIONS -----------------
export async function dbGetConsultations(): Promise<Consultation[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const store = loadLocalStore();
        store.consultations = data as Consultation[];
        saveLocalStore(store);
        return data as Consultation[];
      }
    } catch (e) {
      console.warn('Supabase consultations fetch error, falling back:', e);
    }
  }

  const store = loadLocalStore();
  return store.consultations.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function dbCreateConsultation(data: Partial<Consultation>): Promise<Consultation> {
  const item: Consultation = {
    id: data.id || 'cons-' + Date.now(),
    client_name: data.client_name || '',
    email: data.email || '',
    phone: data.phone || '',
    consultation_type: data.consultation_type || 'In-Studio Consultation',
    date: data.date || new Date().toISOString().split('T')[0],
    time_slot: data.time_slot || '10:00 - 11:30',
    project_scope: data.project_scope || '',
    notes: data.notes || '',
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.consultations.unshift(item);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: ins, error } = await supabase.from('consultations').insert([item]).select().single();
      if (!error && ins && ins.id) {
        item.id = ins.id;
      }
    } catch (e) {
      console.warn('Supabase consultation insert error:', e);
    }
  }

  return item;
}

export async function dbUpdateConsultationStatus(
  id: string,
  status: Consultation['status']
): Promise<Consultation | null> {
  const store = loadLocalStore();
  const found = store.consultations.find((c) => c.id === id);
  if (found) {
    found.status = status;
    saveLocalStore(store);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('consultations').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase consultation status error:', e);
    }
  }
  return found || null;
}

export async function dbDeleteConsultation(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const initial = store.consultations.length;
  store.consultations = store.consultations.filter((c) => c.id !== id);
  const deleted = store.consultations.length < initial;
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('consultations').delete().eq('id', id);
      console.log(`[Supabase] Successfully deleted consultation: ${id}`);
    } catch (e) {
      console.warn('Supabase consultation delete error:', e);
    }
  }
  return deleted;
}

// ----------------- TESTIMONIALS -----------------
export async function dbGetTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped: Testimonial[] = data.map((t) => ({
          id: t.id,
          client_name: t.client_name,
          project_name: t.project_name || '',
          content: t.content || '',
          rating: t.rating || 5,
          active: t.active ?? true,
          created_at: t.created_at,
        }));
        const store = loadLocalStore();
        store.testimonials = mapped;
        saveLocalStore(store);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase testimonials fetch error, falling back:', e);
    }
  }

  const store = loadLocalStore();
  return store.testimonials.filter((t) => t.active !== false);
}

export async function dbCreateTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  const item: Testimonial = {
    id: data.id || 'test-' + Date.now(),
    client_name: data.client_name || 'Client',
    project_name: data.project_name || '',
    content: data.content || '',
    rating: data.rating || 5,
    active: data.active ?? true,
    created_at: new Date().toISOString(),
  };
  const store = loadLocalStore();
  store.testimonials.push(item);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: ins, error } = await supabase.from('testimonials').insert([
        {
          id: item.id,
          client_name: item.client_name,
          project_name: item.project_name,
          content: item.content,
          rating: item.rating,
          active: item.active,
        }
      ]).select().single();
      if (!error && ins && ins.id) {
        item.id = ins.id;
      }
    } catch (e) {
      console.warn('Supabase testimonial insert error:', e);
    }
  }

  return item;
}

export async function dbUpdateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  const store = loadLocalStore();
  const idx = store.testimonials.findIndex((t) => t.id === id);
  if (idx !== -1) {
    store.testimonials[idx] = { ...store.testimonials[idx], ...updates };
    saveLocalStore(store);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.client_name !== undefined) dbUpdates.client_name = updates.client_name;
      if (updates.project_name !== undefined) dbUpdates.project_name = updates.project_name;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.active !== undefined) dbUpdates.active = updates.active;

      await supabase.from('testimonials').update(dbUpdates).eq('id', id);
    } catch (e) {
      console.warn('Supabase testimonial update error:', e);
    }
  }
  return idx !== -1 ? store.testimonials[idx] : (updates as Testimonial);
}

export async function dbDeleteTestimonial(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const initial = store.testimonials.length;
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  const deleted = store.testimonials.length < initial;
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('testimonials').delete().eq('id', id);
      console.log(`[Supabase] Successfully deleted testimonial: ${id}`);
    } catch (e) {
      console.warn('Supabase testimonial delete error:', e);
    }
  }
  return deleted;
}

// ----------------- SITE SETTINGS -----------------
export async function dbGetSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        const mapped: SiteSettings = {
          ...data,
          social_links: typeof data.social_links === 'object' && data.social_links ? data.social_links : {},
        };
        const store = loadLocalStore();
        store.siteSettings = mapped;
        saveLocalStore(store);
        return mapped;
      }
    } catch {
      // ignore
    }
  }

  const store = loadLocalStore();
  return store.siteSettings;
}

export async function dbUpdateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = loadLocalStore();
  store.siteSettings = {
    ...store.siteSettings,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert({
        id: store.siteSettings.id || 'settings-default',
        ...store.siteSettings,
      });
    } catch (e) {
      console.warn('Supabase site_settings upsert error:', e);
    }
  }

  return store.siteSettings;
}

// ----------------- MEDIA -----------------
export async function dbGetMedia(): Promise<MediaItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const store = loadLocalStore();
        store.media = data as MediaItem[];
        saveLocalStore(store);
        return data as MediaItem[];
      }
    } catch (e) {
      console.warn('Supabase media fetch error, falling back to local store:', e);
    }
  }

  const store = loadLocalStore();
  return store.media.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function dbCreateMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
  const newItem: MediaItem = {
    ...item,
    id: 'med-' + Date.now(),
    created_at: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.media.unshift(newItem);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('media').insert([newItem]).select().single();
      if (error) {
        console.warn('Supabase media insert error:', error);
      } else if (data && data.id) {
        newItem.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase media insert exception:', e);
    }
  }

  return newItem;
}

export async function dbDeleteMediaItem(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const item = store.media.find((m) => m.id === id || m.filename === id);
  const supabase = getSupabase();

  let targetKey = item?.filename || id;
  let targetUrl = item?.image_url;

  if (!item && supabase) {
    try {
      const { data } = await supabase
        .from('media')
        .select('*')
        .or(`id.eq.${id},filename.eq.${id}`)
        .single();
      if (data) {
        targetKey = data.filename;
        targetUrl = data.image_url;
      }
    } catch {
      // ignore
    }
  }

  // 1. Purge binary object from Cloudflare R2 and local CDN
  console.log(`[Purge] Deleting media file from Cloudflare R2 and storage: ${targetKey}`);
  await deleteImageFromStorage(targetKey);
  if (targetUrl && targetUrl !== targetKey) {
    await deleteImageFromStorage(targetUrl);
  }

  // 2. Delete media record from Supabase
  if (supabase) {
    try {
      await supabase.from('media').delete().or(`id.eq.${id},filename.eq.${targetKey}`);
      console.log(`[Supabase] Successfully deleted media record: ${id} (${targetKey})`);
    } catch (e) {
      console.warn('Supabase media delete error:', e);
    }
  }

  // 3. Delete from local store
  const initial = store.media.length;
  store.media = store.media.filter((m) => m.id !== id && m.filename !== targetKey);
  const deleted = store.media.length < initial;
  saveLocalStore(store);

  return deleted;
}

// -------------------------------------------------------------
// PROPERTIES (HOUSES READY FOR SALE)
// -------------------------------------------------------------
export async function dbGetProperties(
  propertyType?: string,
  status?: string
): Promise<Property[]> {
  const store = loadLocalStore();
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (propertyType && propertyType !== 'all') {
        query = query.eq('property_type', propertyType);
      }
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: Property[] = data.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          property_type: p.property_type || 'Villa',
          status: p.status || 'Available',
          price: Number(p.price) || 0,
          price_formatted: p.price_formatted || `${Number(p.price).toLocaleString()} DZD`,
          location: p.location || '',
          address: p.address || '',
          area_sqm: Number(p.area_sqm) || 0,
          bedrooms: Number(p.bedrooms) || 0,
          bathrooms: Number(p.bathrooms) || 0,
          floors: p.floors ? Number(p.floors) : 1,
          year_built: p.year_built || '',
          description: p.description || '',
          features: Array.isArray(p.features) ? p.features : [],
          cover_image_url: p.cover_image_url || '',
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          featured: Boolean(p.featured),
          ready_to_move: p.ready_to_move ?? true,
          aspect_ratio: p.aspect_ratio || '16:9',
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
        }));

        // Merge any local properties that might not be synced to Supabase yet
        const existingIds = new Set(mapped.map((m) => m.id));
        const existingSlugs = new Set(mapped.map((m) => m.slug));
        for (const localProp of (store.properties || [])) {
          if (!existingIds.has(localProp.id) && !existingSlugs.has(localProp.slug)) {
            mapped.push(localProp);
          }
        }

        store.properties = mapped;
        saveLocalStore(store);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch properties exception:', e);
    }
  }

  let list = store.properties || [];
  if (propertyType && propertyType !== 'all') {
    list = list.filter((p) => p.property_type.toLowerCase() === propertyType.toLowerCase());
  }
  if (status && status !== 'all') {
    list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }
  return list;
}

export async function dbGetPropertyBySlug(slugOrId: string): Promise<Property | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          property_type: data.property_type || 'Villa',
          status: data.status || 'Available',
          price: Number(data.price) || 0,
          price_formatted: data.price_formatted || `${Number(data.price).toLocaleString()} DZD`,
          location: data.location || '',
          address: data.address || '',
          area_sqm: Number(data.area_sqm) || 0,
          bedrooms: Number(data.bedrooms) || 0,
          bathrooms: Number(data.bathrooms) || 0,
          floors: data.floors ? Number(data.floors) : 1,
          year_built: data.year_built || '',
          description: data.description || '',
          features: Array.isArray(data.features) ? data.features : [],
          cover_image_url: data.cover_image_url || '',
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          featured: Boolean(data.featured),
          ready_to_move: data.ready_to_move ?? true,
          aspect_ratio: data.aspect_ratio || '16:9',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('Supabase get property by slug error:', e);
    }
  }

  const store = loadLocalStore();
  return (
    store.properties.find((p) => p.slug === slugOrId || p.id === slugOrId) || null
  );
}

export async function dbCreateProperty(data: Partial<Property>): Promise<Property> {
  const isUuid = data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id);
  const generatedId = isUuid ? data.id! : crypto.randomUUID();

  const slug =
    data.slug ||
    (data.title || 'property')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

  const price = Number(data.price) || 0;
  const price_formatted =
    data.price_formatted ||
    (price > 0 ? `${price.toLocaleString('fr-FR')} DZD` : 'Prix sur demande');

  const newProperty: Property = {
    id: generatedId,
    title: data.title || 'Propriété Sans Titre',
    slug,
    property_type: data.property_type || 'Villa',
    status: data.status || 'Available',
    price,
    price_formatted,
    location: data.location || 'Batna, Algérie',
    address: data.address || '',
    area_sqm: Number(data.area_sqm) || 150,
    bedrooms: Number(data.bedrooms) || 3,
    bathrooms: Number(data.bathrooms) || 2,
    floors: data.floors ? Number(data.floors) : 1,
    year_built: data.year_built || new Date().getFullYear().toString(),
    description: data.description || '',
    features: data.features || [],
    cover_image_url:
      data.cover_image_url ||
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    gallery: data.gallery || [],
    featured: Boolean(data.featured),
    ready_to_move: data.ready_to_move ?? true,
    aspect_ratio: data.aspect_ratio || '16:9',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const store = loadLocalStore();
  store.properties.unshift(newProperty);
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const payload: any = {
        id: newProperty.id,
        title: newProperty.title,
        slug: newProperty.slug,
        property_type: newProperty.property_type,
        status: newProperty.status,
        price: newProperty.price,
        price_formatted: newProperty.price_formatted,
        location: newProperty.location,
        area_sqm: newProperty.area_sqm,
        bedrooms: newProperty.bedrooms,
        bathrooms: newProperty.bathrooms,
        ready_to_move: newProperty.ready_to_move,
        aspect_ratio: newProperty.aspect_ratio,
        description: newProperty.description,
        cover_image_url: newProperty.cover_image_url,
        features: newProperty.features,
        gallery: newProperty.gallery,
      };
      if (newProperty.year_built) payload.year_built = newProperty.year_built;
      if (newProperty.address) payload.address = newProperty.address;
      if (newProperty.floors) payload.floors = newProperty.floors;
      if (newProperty.featured !== undefined) payload.featured = newProperty.featured;

      const { data: dbItem, error } = await supabaseAdaptiveInsert(
        supabase,
        'properties',
        payload
      );

      if (error) {
        console.warn('[Supabase Property Insert Error]:', error.message || error);
      } else if (dbItem && dbItem.id) {
        newProperty.id = dbItem.id;
      }
    } catch (e: any) {
      console.warn('[Supabase Property Insert Exception]:', e.message || e);
    }
  }

  return newProperty;
}

export async function dbUpdateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property | null> {
  const store = loadLocalStore();
  const index = store.properties.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const current = store.properties[index];
  const price = updates.price !== undefined ? Number(updates.price) : current.price;
  const price_formatted =
    updates.price_formatted ||
    (updates.price !== undefined
      ? price > 0
        ? `${price.toLocaleString('fr-FR')} DZD`
        : 'Prix sur demande'
      : current.price_formatted);

  const updated: Property = {
    ...current,
    ...updates,
    price,
    price_formatted,
    updated_at: new Date().toISOString(),
  };

  store.properties[index] = updated;
  saveLocalStore(store);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = {
        updated_at: updated.updated_at,
      };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.property_type !== undefined) dbUpdates.property_type = updates.property_type;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.price !== undefined) dbUpdates.price = price;
      if (updates.price_formatted !== undefined || updates.price !== undefined)
        dbUpdates.price_formatted = price_formatted;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.area_sqm !== undefined) dbUpdates.area_sqm = Number(updates.area_sqm);
      if (updates.bedrooms !== undefined) dbUpdates.bedrooms = Number(updates.bedrooms);
      if (updates.bathrooms !== undefined) dbUpdates.bathrooms = Number(updates.bathrooms);
      if (updates.floors !== undefined) dbUpdates.floors = Number(updates.floors);
      if (updates.year_built !== undefined) dbUpdates.year_built = updates.year_built;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.features !== undefined) dbUpdates.features = updates.features;
      if (updates.cover_image_url !== undefined) dbUpdates.cover_image_url = updates.cover_image_url;
      if (updates.gallery !== undefined) dbUpdates.gallery = updates.gallery;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.ready_to_move !== undefined) dbUpdates.ready_to_move = updates.ready_to_move;
      if (updates.aspect_ratio !== undefined) dbUpdates.aspect_ratio = updates.aspect_ratio;

      const { error } = await supabaseAdaptiveUpdate(
        supabase,
        'properties',
        `id.eq.${id},slug.eq.${id}`,
        dbUpdates
      );
      if (error) {
        console.warn('Supabase property update error:', error);
      }
    } catch (e) {
      console.warn('Supabase property update exception:', e);
    }
  }

  return updated;
}

export async function dbDeleteProperty(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const property = store.properties.find((p) => p.id === id || p.slug === id);
  const supabase = getSupabase();

  // Extract all property media URLs to purge from Cloudflare R2
  const imagesToPurge: string[] = [];
  if (property) {
    if (property.cover_image_url) imagesToPurge.push(property.cover_image_url);
    if (property.gallery && property.gallery.length > 0) {
      imagesToPurge.push(...property.gallery);
    }
  } else if (supabase) {
    try {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();
      if (data) {
        if (data.cover_image_url) imagesToPurge.push(data.cover_image_url);
        if (Array.isArray(data.gallery)) imagesToPurge.push(...data.gallery);
      }
    } catch {
      // ignore
    }
  }

  // 1. Purge from Cloudflare R2 and local CDN
  if (imagesToPurge.length > 0) {
    console.log(`[Purge] Purging ${imagesToPurge.length} images for property ${id} from Cloudflare R2`);
    await deleteMultipleImagesFromStorage(imagesToPurge);
  }

  // 2. Delete from Supabase
  if (supabase) {
    try {
      await supabase.from('properties').delete().or(`id.eq.${id},slug.eq.${id}`);
    } catch (e) {
      console.warn('Supabase property delete error:', e);
    }
  }

  // 3. Delete from local store
  const initialLength = store.properties.length;
  store.properties = store.properties.filter((p) => p.id !== id && p.slug !== id);
  const deleted = store.properties.length < initialLength;
  saveLocalStore(store);

  return deleted;
}

export async function dbCheckSupabaseStatus(): Promise<{
  connected: boolean;
  supabaseConfigured: boolean;
  propertiesTableExists: boolean;
  propertiesCount: number;
  projectsTableExists: boolean;
  projectsCount: number;
  error?: string;
}> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      connected: false,
      supabaseConfigured: false,
      propertiesTableExists: false,
      propertiesCount: 0,
      projectsTableExists: false,
      projectsCount: 0,
      error: 'Supabase URL or Key not configured in environment (VITE_SUPABASE_URL / SUPABASE_URL & SUPABASE_KEY)',
    };
  }

  try {
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .select('id', { count: 'exact' });

    const { data: projData, error: projError } = await supabase
      .from('projects')
      .select('id', { count: 'exact' });

    const propertiesTableExists = !propError;
    const projectsTableExists = !projError;

    return {
      connected: !propError || !projError,
      supabaseConfigured: true,
      propertiesTableExists,
      propertiesCount: Array.isArray(propData) ? propData.length : 0,
      projectsTableExists,
      projectsCount: Array.isArray(projData) ? projData.length : 0,
      error: propError ? propError.message : undefined,
    };
  } catch (err: any) {
    return {
      connected: false,
      supabaseConfigured: true,
      propertiesTableExists: false,
      propertiesCount: 0,
      projectsTableExists: false,
      projectsCount: 0,
      error: err.message || 'Failed to ping Supabase database',
    };
  }
}

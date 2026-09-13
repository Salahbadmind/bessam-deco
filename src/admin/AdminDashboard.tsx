import React, { useState, useRef } from 'react';
import {
  Project,
  Property,
  ServiceItem,
  Testimonial,
  Inquiry,
  Consultation,
  SiteSettings,
  MediaItem,
} from '../types';
import {
  Layers,
  Home,
  Sparkles,
  Inbox,
  Calendar,
  Settings,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  CheckCircle2,
  Copy,
  Code,
  SlidersHorizontal,
  Quote,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Database,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { ProjectEditorModal } from './ProjectEditorModal';
import { PropertyEditorModal } from './PropertyEditorModal';
import { ImageUploadField } from './ImageUploadField';

interface AdminDashboardProps {
  user: { email: string; role: string; token: string };
  projects: Project[];
  properties?: Property[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  consultations: Consultation[];
  siteSettings: SiteSettings;
  media: MediaItem[];
  onRefreshData: () => void;
  onLogout: () => void;
  onViewLiveSite: () => void;
}

export function AdminDashboard({
  user,
  projects,
  properties = [],
  services,
  testimonials,
  inquiries,
  consultations,
  siteSettings,
  media,
  onRefreshData,
  onLogout,
  onViewLiveSite,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'projects' | 'properties' | 'services' | 'testimonials' | 'media' | 'inquiries' | 'consultations' | 'settings'
  >('projects');

  // Project Editor state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);

  // Property Editor state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPropertyEditorOpen, setIsPropertyEditorOpen] = useState(false);
  const [deleteConfirmProperty, setDeleteConfirmProperty] = useState<Property | null>(null);

  // Standalone image test uploader state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const testUploadInputRef = useRef<HTMLInputElement>(null);

  // Service modal state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
    title: '',
    slug: '',
    description: '',
    image_url: '',
    features: [],
    active: true,
  });

  // Testimonial modal state
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    client_name: '',
    content: '',
    project_name: '',
    rating: 5,
    active: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<
    'brand' | 'hero' | 'about' | 'scripts' | 'contact' | 'security' | 'database'
  >('brand');
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  const fetchDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.error('Failed to check DB status', e);
    } finally {
      setIsCheckingDb(false);
    }
  };

  // Dedicated file uploaders for settings images
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const philosophyImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleUploadImageForField = async (file: File, fieldKey: keyof SiteSettings) => {
    setUploadingField(fieldKey);
    try {
      const data = new FormData();
      data.append('image', file);
      data.append('project_title', `CMS Setting: ${fieldKey}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        setSettingsForm((prev) => ({
          ...prev,
          [fieldKey]: json.url,
        }));
      }
    } catch (err) {
      console.error(`Failed to upload image for ${fieldKey}`, err);
    } finally {
      setUploadingField(null);
    }
  };

  // Delete project handler
  const handleDeleteProject = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmProject(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  // Delete property handler (with R2 purge)
  const handleDeleteProperty = async (property: Property) => {
    try {
      const res = await fetch(`/api/properties/${property.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmProperty(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to delete property', err);
    }
  };

  // Inquiry status update
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      onRefreshData();
    } catch (err) {
      console.error('Failed to update inquiry status', err);
    }
  };

  // Consultation status update
  const handleUpdateConsultationStatus = async (id: string, status: Consultation['status']) => {
    try {
      await fetch(`/api/consultations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      onRefreshData();
    } catch (err) {
      console.error('Failed to update consultation status', err);
    }
  };

  // Standalone image optimization upload test
  const handleStandaloneUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    setUploadResult(null);

    try {
      const data = new FormData();
      data.append('image', file);
      data.append('project_title', 'Studio Media Library');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const contentType = res.headers.get('content-type') || '';
      let result: any = {};
      if (contentType.includes('application/json')) {
        result = await res.json().catch(() => ({}));
      }

      if (!res.ok || !result.url) {
        throw new Error(result.error || `Upload failed (${res.status})`);
      }

      setUploadResult(result);
      onRefreshData();
    } catch (err: any) {
      setUploadError(err.message || 'Image processing failed');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Save site settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSavedSuccess(false);

    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });

      if (res.ok) {
        setSettingsSavedSuccess(true);
        onRefreshData();
        setTimeout(() => setSettingsSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings', err);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Service save handler
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });

      if (res.ok) {
        setIsServiceModalOpen(false);
        setEditingService(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  // Testimonial save handler
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      });

      if (res.ok) {
        setIsTestimonialModalOpen(false);
        setEditingTestimonial(null);
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to save testimonial', err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error('Failed to delete testimonial', err);
    }
  };

  const handleDeleteMedia = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from Cloudflare R2 and Supabase?`)) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error('Failed to delete media asset', err);
    }
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from "${name}" from Supabase?`)) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error('Failed to delete inquiry', err);
    }
  };

  const handleDeleteConsultation = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete consultation for "${name}" from Supabase?`)) return;
    try {
      const res = await fetch(`/api/consultations/${id}`, { method: 'DELETE' });
      if (res.ok) onRefreshData();
    } catch (err) {
      console.error('Failed to delete consultation', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f7f6f2] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-[#141416] border-b border-[#26262b] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-2xl tracking-widest text-[#f7f6f2] font-semibold">
              BESSAM.DECO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880]"></span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 bg-[#1a1a1d] text-[#c5a880] text-[10px] uppercase font-mono tracking-widest border border-[#26262b]">
            CMS Studio Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewLiveSite}
            className="px-3 sm:px-4 py-2 bg-[#1a1a1d] hover:bg-[#26262b] text-[#f7f6f2] border border-[#383842] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#0f0f11] border-r border-[#26262b] p-4 flex md:flex-col justify-between overflow-x-auto md:overflow-x-visible shrink-0">
          <div className="flex md:flex-col gap-1 w-full">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Projects ({projects.length})</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Houses for Sale ({properties.length})</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#c5a880]/20 text-[#c5a880]">
                Vente
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Services ({services.length})</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Quote className="w-4 h-4" />
                <span>Testimonials ({testimonials.length})</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>Media ({media.length})</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300">
                WebP
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Inquiries</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#0b0b0c] text-[#d6d4ce]">
                {inquiries.filter((i) => i.status === 'New').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'consultations'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Consultations</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#0b0b0c] text-[#d6d4ce]">
                {consultations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1a1a1d] text-[#c5a880] border-l-2 border-[#c5a880]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#141416]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Studio CMS & Scripts</span>
            </button>
          </div>

          <div className="hidden md:block p-3 bg-[#141416] border border-[#26262b] text-[11px] text-[#8c827a] space-y-1 mt-6">
            <p className="text-[#f7f6f2] font-medium">Logged in as:</p>
            <p className="truncate text-[#c5a880]">{user.email}</p>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262b] pb-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                    Architectural Projects ({projects.length})
                  </h2>
                  <p className="text-xs text-[#a39e93] mt-1">
                    Manage your portfolio case studies, before/after transformations, and image galleries.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectEditorOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {projects.map((project) => {
                  const hasBeforeAfter = Boolean(project.before_image_url && project.after_image_url);

                  return (
                    <div
                      key={project.id}
                      className="bg-[#141416] border border-[#26262b] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#383842] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="w-20 h-16 object-cover border border-[#26262b] bg-[#1a1a1d]"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-editorial text-xl text-[#f7f6f2]">{project.title}</h3>
                            {project.featured && (
                              <span className="px-2 py-0.5 bg-[#c5a880] text-[#0b0b0c] text-[10px] uppercase font-semibold">
                                Featured
                              </span>
                            )}
                            {hasBeforeAfter && (
                              <span className="px-2 py-0.5 bg-[#1a1a1d] text-[#c5a880] border border-[#26262b] text-[10px] uppercase font-mono">
                                Before/After
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#a39e93]">
                            {project.category} • {project.location} ({project.year})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectEditorOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-xs text-[#f7f6f2] border border-[#383842] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmProject(project)}
                          className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 border border-red-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1.5: PROPERTIES (HOUSES FOR SALE) */}
          {activeTab === 'properties' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262b] pb-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                    Maisons & Résidences Prêtes à la Vente ({properties.length})
                  </h2>
                  <p className="text-xs text-[#a39e93] mt-1">
                    Ajoutez et gérez les villas haut standing, penthouses et duplex prêts à être vendus aux clients avec galerie photo et format 9:16 / 16:9.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setIsPropertyEditorOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une Maison à Vendre</span>
                </button>
              </div>

              {/* Properties Cards List */}
              {properties.length === 0 ? (
                <div className="bg-[#141416] border border-[#26262b] p-12 text-center">
                  <Home className="w-12 h-12 mx-auto text-[#c5a880]/50 mb-3" />
                  <p className="text-sm text-[#a39e93] mb-4">
                    Aucune propriété enregistrée pour le moment.
                  </p>
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setIsPropertyEditorOpen(true);
                    }}
                    className="px-4 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase"
                  >
                    Créer la première résidence
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-[#141416] border border-[#26262b] p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-[#383842] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                        <img
                          src={prop.cover_image_url}
                          alt={prop.title}
                          className="w-28 h-20 object-cover border border-[#26262b] bg-[#1a1a1d] shrink-0"
                        />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-editorial text-xl text-[#f7f6f2] truncate">
                              {prop.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-[#c5a880] text-[#0b0b0c] text-[10px] uppercase font-semibold font-mono">
                              {prop.property_type}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] uppercase font-mono font-semibold ${
                                prop.status === 'Available'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : prop.status === 'Under Contract'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : prop.status === 'Coming Soon'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}
                            >
                              {prop.status === 'Available'
                                ? 'Disponible'
                                : prop.status === 'Under Contract'
                                ? 'Sous Compromis'
                                : prop.status === 'Coming Soon'
                                ? 'Bientôt Disponible'
                                : 'Vendu'}
                            </span>
                            {prop.ready_to_move && (
                              <span className="px-2 py-0.5 bg-emerald-900/60 text-white text-[10px] uppercase font-mono">
                                Clé en Main
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-[#1a1a1d] text-[#c5a880] border border-[#26262b] text-[10px] uppercase font-mono">
                              {prop.aspect_ratio}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#a39e93]">
                            <span className="text-[#c5a880] font-semibold text-sm">
                              {prop.price_formatted}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#c5a880]" />
                              {prop.location}
                            </span>
                            <span>•</span>
                            <span>{prop.area_sqm} m²</span>
                            <span>•</span>
                            <span>{prop.bedrooms} ch.</span>
                            <span>•</span>
                            <span>{prop.bathrooms} sdb.</span>
                            <span>•</span>
                            <span>Galerie: {prop.gallery?.length || 0} photos</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-center">
                        <button
                          onClick={() => {
                            setEditingProperty(prop);
                            setIsPropertyEditorOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-xs text-[#f7f6f2] border border-[#383842] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmProperty(prop)}
                          className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 border border-red-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262b] pb-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                    Services & Disciplines ({services.length})
                  </h2>
                  <p className="text-xs text-[#a39e93] mt-1">
                    Manage studio services, descriptions, cover pictures, and deliverables.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService(null);
                    setServiceForm({
                      title: '',
                      slug: '',
                      description: '',
                      image_url: '',
                      features: [],
                      active: true,
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#141416] border border-[#26262b] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-editorial text-2xl text-[#f7f6f2]">{service.title}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 uppercase font-mono ${
                            service.active ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {service.active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-xs text-[#a39e93] line-clamp-3">{service.description}</p>
                      {service.image_url && (
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-32 object-cover border border-[#26262b]"
                        />
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#26262b] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setServiceForm(service);
                          setIsServiceModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-xs text-[#f7f6f2] border border-[#383842] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-3 py-1.5 bg-red-950/40 text-xs text-red-300 border border-red-800/60 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262b] pb-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                    Client Testimonials ({testimonials.length})
                  </h2>
                  <p className="text-xs text-[#a39e93] mt-1">
                    Manage client reviews, project endorsements, and customer feedback.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTestimonial(null);
                    setTestimonialForm({
                      client_name: '',
                      content: '',
                      project_name: '',
                      rating: 5,
                      active: true,
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#141416] border border-[#26262b] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-editorial text-xl text-[#f7f6f2]">{t.client_name}</h3>
                        <span className="text-xs text-[#c5a880] font-mono">
                          {'★'.repeat(t.rating || 5)}
                        </span>
                      </div>
                      <p className="text-xs text-[#c5a880] uppercase tracking-wider font-mono">
                        {t.project_name}
                      </p>
                      <p className="text-xs text-[#a39e93] italic">« {t.content} »</p>
                    </div>

                    <div className="pt-4 border-t border-[#26262b] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTestimonial(t);
                          setTestimonialForm(t);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-xs text-[#f7f6f2] border border-[#383842] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="px-3 py-1.5 bg-red-950/40 text-xs text-red-300 border border-red-800/60 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & PIPELINE */}
          {activeTab === 'media' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-[#26262b] pb-6">
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                  Media Library & WebP Compression Pipeline
                </h2>
                <p className="text-xs text-[#a39e93] mt-1">
                  Upload architectural images. They are automatically converted to optimized WebP format with sharp compression.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="bg-[#141416] border border-dashed border-[#383842] p-8 text-center space-y-4">
                <input
                  type="file"
                  ref={testUploadInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleStandaloneUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1d] border border-[#26262b] flex items-center justify-center text-[#c5a880]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-xl text-[#f7f6f2]">
                    Upload Architectural Photography
                  </h3>
                  <p className="text-xs text-[#a39e93] max-w-sm">
                    Drop high-res JPG/PNG files here. The pipeline compresses them to WebP and generates CDN URLs.
                  </p>
                  <button
                    onClick={() => testUploadInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2.5 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider hover:bg-[#dfc8a8] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? 'Processing & Optimizing...' : 'Select File To Upload'}
                  </button>
                </div>

                {uploadError && (
                  <p className="text-xs text-red-400 bg-red-950/40 p-2 border border-red-800 inline-block">
                    {uploadError}
                  </p>
                )}

                {uploadResult && (
                  <div className="p-4 bg-[#101012] border border-[#26262b] text-left max-w-xl mx-auto space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Optimized successfully!</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={uploadResult.url}
                        className="flex-1 bg-[#0b0b0c] border border-[#26262b] px-3 py-1.5 text-xs text-[#f7f6f2]"
                      />
                      <button
                        onClick={() => copyToClipboard(uploadResult.url)}
                        className="px-3 py-1.5 bg-[#1a1a1d] text-xs text-[#c5a880] border border-[#26262b] flex items-center space-x-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedUrl === uploadResult.url ? 'Copied!' : 'Copy URL'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Gallery */}
              <div className="space-y-4">
                <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                  Stored Media Assets ({media.length})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {media.map((m) => (
                    <div
                      key={m.id}
                      className="group relative aspect-square bg-[#141416] border border-[#26262b] overflow-hidden"
                    >
                      <img
                        src={m.image_url}
                        alt={m.original_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#0b0b0c]/85 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-[10px]">
                        <div>
                          <p className="truncate font-medium text-[#f7f6f2]">{m.original_name}</p>
                          <p className="text-emerald-400 font-mono mt-0.5">
                            {m.file_size_formatted || `${Math.round(m.file_size / 1024)} KB`}
                          </p>
                        </div>
                        <div className="flex gap-1.5 w-full">
                          <button
                            onClick={() => copyToClipboard(m.image_url)}
                            className="flex-1 py-1 bg-[#1a1a1d] hover:bg-[#26262b] text-[#c5a880] text-center border border-[#26262b] text-[10px]"
                          >
                            {copiedUrl === m.image_url ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(m.id, m.original_name)}
                            title="Delete permanently from Cloudflare R2 & Supabase"
                            className="p-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 text-[10px] flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-[#26262b] pb-6">
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                  Project Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-[#a39e93] mt-1">
                  Prospective clients seeking renovations, quotes, and architectural advice.
                </p>
              </div>

              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#141416] border border-[#26262b] p-6 space-y-4 hover:border-[#383842] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262b] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-editorial text-2xl text-[#f7f6f2]">{inq.name}</h3>
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                              inq.status === 'New'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : inq.status === 'Contacted'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#a39e93] mt-0.5">
                          Submitted: {new Date(inq.created_at).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#8c827a]">Status:</span>
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleUpdateInquiryStatus(inq.id, e.target.value as Inquiry['status'])
                          }
                          className="bg-[#0b0b0c] border border-[#26262b] px-3 py-1 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                          title="Delete inquiry from Supabase"
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-800/60 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#b8b3a8]">
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Phone</span>
                        <a href={`tel:${inq.phone}`} className="text-[#c5a880] hover:underline font-mono">
                          {inq.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Email</span>
                        <a href={`mailto:${inq.email}`} className="text-[#f7f6f2] hover:underline">
                          {inq.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Project Type</span>
                        <span className="text-[#f7f6f2]">{inq.project_type || 'Full Renovation'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Location</span>
                        <span className="text-[#f7f6f2]">{inq.location || 'Batna'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#101012] border border-[#26262b] text-xs text-[#d0ccc4] leading-relaxed">
                      <span className="text-[10px] uppercase text-[#8c827a] block mb-1">
                        Client Message:
                      </span>
                      {inq.message}
                    </div>

                    {inq.attachment_url && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#8c827a]">Attached Plan/Photo:</span>
                        <a
                          href={inq.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c5a880] hover:underline flex items-center gap-1"
                        >
                          <span>View Attachment</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-[#26262b] pb-6">
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                  Consultation Bookings ({consultations.length})
                </h2>
                <p className="text-xs text-[#a39e93] mt-1">
                  On-site architectural surveys, in-studio appointments, and virtual 3D sessions.
                </p>
              </div>

              <div className="space-y-4">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#141416] border border-[#26262b] p-6 space-y-4 hover:border-[#383842] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262b] pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-editorial text-2xl text-[#f7f6f2]">{c.client_name}</h3>
                          <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-[#1a1a1d] text-[#c5a880] border border-[#26262b]">
                            {c.consultation_type}
                          </span>
                        </div>
                        <p className="text-xs text-[#a39e93] mt-0.5">
                          Scheduled Date: <strong className="text-[#f7f6f2]">{c.date}</strong> at{' '}
                          <strong className="text-[#f7f6f2]">{c.time_slot}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#8c827a]">Status:</span>
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleUpdateConsultationStatus(c.id, e.target.value as Consultation['status'])
                          }
                          className="bg-[#0b0b0c] border border-[#26262b] px-3 py-1 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteConsultation(c.id, c.client_name)}
                          title="Delete consultation from Supabase"
                          className="px-2 py-1 bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-800/60 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#b8b3a8]">
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Phone</span>
                        <a href={`tel:${c.phone}`} className="text-[#c5a880] hover:underline font-mono">
                          {c.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Email</span>
                        <a href={`mailto:${c.email}`} className="text-[#f7f6f2]">
                          {c.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c827a] block">Project Scope</span>
                        <span className="text-[#f7f6f2]">{c.project_scope || 'General Renovation'}</span>
                      </div>
                    </div>

                    {c.notes && (
                      <div className="p-3 bg-[#101012] border border-[#26262b] text-xs text-[#d0ccc4]">
                        <span className="text-[10px] uppercase text-[#8c827a] block mb-1">
                          Client Notes:
                        </span>
                        {c.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COMPLETE STUDIO CMS & SCRIPTS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn max-w-4xl">
              <div className="border-b border-[#26262b] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#f7f6f2]">
                    Studio CMS & Custom Scripts
                  </h2>
                  <p className="text-xs text-[#a39e93] mt-1">
                    Directly edit all brand logos, photography, copy, and inject custom tracking scripts.
                  </p>
                </div>

                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {settingsSaving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
              </div>

              {settingsSavedSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300">
                  Settings successfully updated and synchronized across all devices!
                </div>
              )}

              {/* Sub-nav for Settings */}
              <div className="flex items-center gap-2 border-b border-[#26262b] pb-3 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('brand')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeSettingsSection === 'brand'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  Brand & Logo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('hero')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeSettingsSection === 'hero'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  Hero Section
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('about')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeSettingsSection === 'about'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  Philosophy & About
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('contact')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeSettingsSection === 'contact'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  Coordinates & Socials
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('security')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeSettingsSection === 'security'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Owner & Security</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSettingsSection('scripts')}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    activeSettingsSection === 'scripts'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  Custom Scripts & Head
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSettingsSection('database');
                    fetchDbStatus();
                  }}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeSettingsSection === 'database'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  <Database className="w-3 h-3" />
                  <span>Supabase & Cloud DB</span>
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* 1. BRAND & LOGO */}
                {activeSettingsSection === 'brand' && (
                  <div className="space-y-6">
                    {/* DEDICATED LOGO CARD REQUIRED BY USER */}
                    <div className="p-6 bg-[#141416] border-2 border-[#c5a880]/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                            BESSAM.DECO
                          </h3>
                          <p className="text-xs font-mono uppercase tracking-widest text-[#c5a880]">
                            Rénovation & Architecture — Logo CMS Setting
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#c5a880] text-[#0b0b0c] font-semibold">
                          Live Brand Logo
                        </span>
                      </div>

                      <div className="pt-2">
                        <ImageUploadField
                          label="Studio Live Brand Logo"
                          value={settingsForm.logo_url || ''}
                          onChange={(url) => setSettingsForm({ ...settingsForm, logo_url: url })}
                          projectTitle="Bessam Deco Brand Logo"
                          mediaList={media}
                          description="SVG, transparent PNG or WebP recommended. Displays in header & footer with BESSAM.DECO Rénovation & Architecture."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Brand Display Name</label>
                        <input
                          type="text"
                          value={settingsForm.brand_name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, brand_name: e.target.value })}
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Brand Subtitle</label>
                        <input
                          type="text"
                          value={settingsForm.brand_subtitle || 'Rénovation & Architecture'}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, brand_subtitle: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Main Tagline</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Supporting Description</label>
                      <textarea
                        rows={3}
                        value={settingsForm.description}
                        onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. HERO SECTION */}
                {activeSettingsSection === 'hero' && (
                  <div className="space-y-6">
                    <h3 className="font-editorial text-2xl text-[#f7f6f2]">Hero Banner Configuration</h3>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Hero Headline</label>
                      <input
                        type="text"
                        value={settingsForm.hero_headline || ''}
                        placeholder="Transform Your Space Into Something Extraordinary."
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, hero_headline: e.target.value })
                        }
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Hero Subheadline</label>
                      <textarea
                        rows={2}
                        value={settingsForm.hero_subheadline || ''}
                        placeholder="Premium renovation services that bring your vision to life..."
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, hero_subheadline: e.target.value })
                        }
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    {/* Hero Background Image Upload */}
                    <div className="pt-2">
                      <ImageUploadField
                        label="Hero Background Photography"
                        value={settingsForm.hero_image_url || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, hero_image_url: url })}
                        projectTitle="Hero Architectural Background"
                        mediaList={media}
                        description="High-resolution architectural photography displayed behind the hero header."
                      />
                    </div>
                  </div>
                )}

                {/* 3. PHILOSOPHY & ABOUT */}
                {activeSettingsSection === 'about' && (
                  <div className="space-y-6">
                    <h3 className="font-editorial text-2xl text-[#f7f6f2]">Philosophy & Studio Narrative</h3>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Philosophy Quote</label>
                      <input
                        type="text"
                        value={settingsForm.philosophy_quote || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, philosophy_quote: e.target.value })
                        }
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Philosophy Main Narrative</label>
                      <textarea
                        rows={3}
                        value={settingsForm.philosophy_p1 || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, philosophy_p1: e.target.value })
                        }
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    {/* Philosophy Image */}
                    <div className="pt-2">
                      <ImageUploadField
                        label="Philosophy Section Architectural Photography"
                        value={settingsForm.philosophy_image_url || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, philosophy_image_url: url })}
                        projectTitle="Philosophy Architectural Image"
                        mediaList={media}
                        description="Architectural photo displaying our philosophy of light, stone, and craftsmanship."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#26262b]">
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Experience Stat</label>
                        <input
                          type="text"
                          value={settingsForm.about_experience_years || '15+'}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, about_experience_years: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Projects Stat</label>
                        <input
                          type="text"
                          value={settingsForm.about_projects_completed || '180+'}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, about_projects_completed: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Satisfaction Rate</label>
                        <input
                          type="text"
                          value={settingsForm.about_satisfaction_rate || '100%'}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, about_satisfaction_rate: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. COORDINATES & SOCIALS */}
                {activeSettingsSection === 'contact' && (
                  <div className="space-y-4">
                    <h3 className="font-editorial text-2xl text-[#f7f6f2]">Coordinates & Social Channels</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Email Address</label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce]">Studio Atelier Physical Address</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">Instagram URL</label>
                        <input
                          type="text"
                          value={settingsForm.instagram_url}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, instagram_url: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-[#d6d4ce]">WhatsApp Direct URL</label>
                        <input
                          type="text"
                          value={settingsForm.whatsapp_url || ''}
                          placeholder="https://wa.me/213550000000"
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, whatsapp_url: e.target.value })
                          }
                          className="w-full bg-[#141416] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. CUSTOM SCRIPTS & ANALYTICS */}
                {activeSettingsSection === 'scripts' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                        Custom Scripts & Tracking Pixels
                      </h3>
                      <p className="text-xs text-[#a39e93] mt-1">
                        Inject custom JavaScript, Google Analytics tags, Meta Pixels, font links, or chat widgets.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce] flex items-center justify-between">
                        <span>Header Scripts (Injected into &lt;head&gt;)</span>
                        <span className="text-[10px] font-mono text-[#c5a880]">Analytics, Pixels, Meta</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="<!-- Google tag (gtag.js) --> or Meta Pixel code..."
                        value={settingsForm.header_scripts || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, header_scripts: e.target.value })
                        }
                        className="w-full bg-[#0b0b0c] font-mono border border-[#26262b] p-3 text-xs text-[#c5a880] focus:border-[#c5a880] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce] flex items-center justify-between">
                        <span>Footer Scripts (Injected before &lt;/body&gt;)</span>
                        <span className="text-[10px] font-mono text-[#c5a880]">Chat widgets, Trackers</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="<!-- Live chat scripts or conversion triggers -->"
                        value={settingsForm.footer_scripts || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, footer_scripts: e.target.value })
                        }
                        className="w-full bg-[#0b0b0c] font-mono border border-[#26262b] p-3 text-xs text-[#c5a880] focus:border-[#c5a880] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-[#d6d4ce] flex items-center justify-between">
                        <span>Custom CSS Overrides</span>
                        <span className="text-[10px] font-mono text-[#c5a880]">Raw CSS</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="/* Custom CSS rules applied globally */"
                        value={settingsForm.custom_css || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, custom_css: e.target.value })
                        }
                        className="w-full bg-[#0b0b0c] font-mono border border-[#26262b] p-3 text-xs text-emerald-400 focus:border-[#c5a880] focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* 5. OWNER & ATELIER SECURITY SETTINGS */}
                {activeSettingsSection === 'security' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-[#141416] border-2 border-[#c5a880]/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                            Studio Owner & Atelier Security
                          </h3>
                          <p className="text-xs font-mono uppercase tracking-widest text-[#c5a880]">
                            Configure Owner Login Email & Master Security Key
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#c5a880] text-[#0b0b0c] font-semibold">
                          Access Control
                        </span>
                      </div>
                      <p className="text-xs text-[#a39e93] leading-relaxed">
                        Customize the credentials used to log in to the BESSAM.DECO CMS Studio.
                        Any updates saved here immediately apply to the login authentication.
                      </p>
                    </div>

                    <div className="p-6 bg-[#141416] border border-[#26262b] space-y-5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#d6d4ce] flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Owner Login Email</span>
                        </label>
                        <input
                          type="email"
                          value={settingsForm.admin_email || ''}
                          placeholder="write ure email or admin@bessamdeco.com"
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, admin_email: e.target.value })
                          }
                          className="w-full bg-[#0b0b0c] border border-[#26262b] px-3.5 py-2.5 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                        />
                        <p className="text-[11px] text-[#8c827a]">
                          Current standard account: <code className="text-[#c5a880]">admin@bessamdeco.com</code>
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#d6d4ce] flex items-center space-x-2">
                          <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                          <span>Master Security Key (Password)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showSettingsPassword ? 'text' : 'password'}
                            value={settingsForm.admin_password || ''}
                            placeholder="bessam2026"
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, admin_password: e.target.value })
                            }
                            className="w-full bg-[#0b0b0c] border border-[#26262b] px-3.5 py-2.5 pr-10 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c827a] hover:text-[#c5a880] transition-colors p-1 cursor-pointer focus:outline-none"
                            title={showSettingsPassword ? 'Hide password' : 'Show password'}
                            aria-label={showSettingsPassword ? 'Hide password' : 'Show password'}
                          >
                            {showSettingsPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4 text-[#8c827a]" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#8c827a]">
                          Default security key: <code className="text-[#c5a880]">bessam2026</code>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SUPABASE & CLOUD DATABASE */}
                {activeSettingsSection === 'database' && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                          Supabase & Cloud Database Status
                        </h3>
                        <p className="text-xs text-[#a39e93] mt-1">
                          Diagnostic information and SQL schema setup for your PostgreSQL database on Supabase.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={fetchDbStatus}
                        disabled={isCheckingDb}
                        className="px-3.5 py-1.5 bg-[#141416] hover:bg-[#1f1f23] text-xs text-[#c5a880] border border-[#383842] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
                        <span>{isCheckingDb ? 'Testing Connection...' : 'Test Connection'}</span>
                      </button>
                    </div>

                    {/* Connection Status Card */}
                    <div className="p-5 bg-[#141416] border border-[#26262b] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#a39e93]">
                          Database Connection
                        </span>
                        {dbStatus ? (
                          <span
                            className={`text-xs px-2.5 py-0.5 font-mono uppercase font-semibold flex items-center gap-1 ${
                              dbStatus.connected
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'
                              }`}
                            />
                            {dbStatus.connected ? 'Supabase Connected' : 'Local Fallback Storage Active'}
                          </span>
                        ) : (
                          <span className="text-xs text-[#8c827a] font-mono">
                            Click 'Test Connection' to verify
                          </span>
                        )}
                      </div>

                      {dbStatus && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-[#0b0b0c] border border-[#26262b]">
                            <div className="text-[10px] font-mono uppercase text-[#8c827a]">
                              properties Table (Houses for Sale)
                            </div>
                            <div className="text-[#f7f6f2] font-semibold mt-1 flex items-center justify-between">
                              <span>
                                {dbStatus.propertiesTableExists
                                  ? 'Table Ready'
                                  : 'Table Missing in Supabase'}
                              </span>
                              <span className="font-mono text-[#c5a880]">
                                {dbStatus.propertiesCount} records
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-[#0b0b0c] border border-[#26262b]">
                            <div className="text-[10px] font-mono uppercase text-[#8c827a]">
                              projects Table (Portfolio)
                            </div>
                            <div className="text-[#f7f6f2] font-semibold mt-1 flex items-center justify-between">
                              <span>
                                {dbStatus.projectsTableExists
                                  ? 'Table Ready'
                                  : 'Table Missing in Supabase'}
                              </span>
                              <span className="font-mono text-[#c5a880]">
                                {dbStatus.projectsCount} records
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {dbStatus?.error && (
                        <div className="p-3 bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          <div className="space-y-1">
                            <p className="font-semibold">Notice from Database Driver:</p>
                            <p className="font-mono text-[11px] text-amber-200/90">{dbStatus.error}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SQL Schema helper */}
                    <div className="space-y-2 p-5 bg-[#141416] border border-[#26262b]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-[#f7f6f2] uppercase tracking-wider">
                            Supabase SQL Editor Schema Setup
                          </h4>
                          <p className="text-[11px] text-[#a39e93]">
                            If your Supabase project does not have the <code className="text-[#c5a880]">properties</code> table yet, paste this script into your Supabase SQL Editor:
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const sql = `-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  property_type TEXT DEFAULT 'Villa',
  status TEXT DEFAULT 'Available',
  price NUMERIC DEFAULT 0,
  price_formatted TEXT,
  location TEXT,
  address TEXT,
  area_sqm NUMERIC,
  bedrooms NUMERIC,
  bathrooms NUMERIC,
  floors NUMERIC DEFAULT 1,
  year_built TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  cover_image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  ready_to_move BOOLEAN DEFAULT true,
  aspect_ratio TEXT DEFAULT '16:9',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add any columns that might be missing if table was created previously
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floors NUMERIC DEFAULT 1;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS year_built TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS ready_to_move BOOLEAN DEFAULT true;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '16:9';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_formatted TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read properties" ON public.properties
  FOR SELECT USING (true);

-- 5. Allow full access for writes
CREATE POLICY IF NOT EXISTS "Allow all for authenticated users" ON public.properties
  FOR ALL USING (true) WITH CHECK (true);`;
                            copyToClipboard(sql);
                          }}
                          className="px-3 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-xs text-[#c5a880] border border-[#383842] flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedUrl?.includes('CREATE TABLE') ? 'Copied!' : 'Copy SQL'}</span>
                        </button>
                      </div>

                      <pre className="p-3 bg-[#0b0b0c] border border-[#26262b] text-[11px] font-mono text-[#c5a880] overflow-x-auto leading-relaxed max-h-56 overflow-y-auto">
{`-- Add any missing columns to existing properties table in Supabase:
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floors NUMERIC DEFAULT 1;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS year_built TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS ready_to_move BOOLEAN DEFAULT true;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '16:9';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_formatted TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;`}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#26262b] flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-8 py-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Project Editor Modal */}
      {isProjectEditorOpen && (
        <ProjectEditorModal
          project={editingProject}
          isOpen={isProjectEditorOpen}
          onClose={() => setIsProjectEditorOpen(false)}
          onSaveSuccess={() => {
            onRefreshData();
          }}
        />
      )}

      {/* Service Editor Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-md">
          <div className="bg-[#141416] border border-[#26262b] p-6 max-w-lg w-full space-y-4">
            <h3 className="font-editorial text-2xl text-[#f7f6f2]">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Service Title</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                />
              </div>

              <ImageUploadField
                label="Service Photography / Feature Image"
                value={serviceForm.image_url || ''}
                onChange={(url) => setServiceForm({ ...serviceForm, image_url: url })}
                projectTitle={serviceForm.title || 'Studio Service'}
                mediaList={media}
                description="Select an image from your device or media library. It is automatically compressed to WebP format (<100KB)."
              />

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-[#1a1a1d] text-xs text-[#a39e93]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Editor Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-md">
          <div className="bg-[#141416] border border-[#26262b] p-6 max-w-lg w-full space-y-4">
            <h3 className="font-editorial text-2xl text-[#f7f6f2]">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Client Name</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.client_name || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, client_name: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Project Name</label>
                <input
                  type="text"
                  value={testimonialForm.project_name || ''}
                  placeholder="Villa Hydra, Algiers"
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, project_name: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Testimonial Content</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.content || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 bg-[#1a1a1d] text-xs text-[#a39e93]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Editor Modal */}
      <PropertyEditorModal
        property={editingProperty}
        isOpen={isPropertyEditorOpen}
        onClose={() => {
          setIsPropertyEditorOpen(false);
          setEditingProperty(null);
        }}
        onSave={onRefreshData}
      />

      {/* Delete Confirmation Modal for Property */}
      {deleteConfirmProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141416] border border-red-900/60 p-6 max-w-md w-full space-y-4">
            <h3 className="font-editorial text-2xl text-red-200">Supprimer la Propriété</h3>
            <p className="text-xs text-[#a39e93] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement{' '}
              <strong className="text-[#f7f6f2]">{deleteConfirmProperty.title}</strong> ?
              Cette action supprimera également toutes les images associées de Cloudflare R2 et de la base de données.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProperty(null)}
                className="px-4 py-2 bg-[#1a1a1d] text-xs text-[#a39e93] hover:text-[#f7f6f2]"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteProperty(deleteConfirmProperty)}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-xs text-white uppercase tracking-wider font-semibold"
              >
                Confirmer la Suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-sm">
          <div className="bg-[#141416] border border-red-900/60 p-6 max-w-md w-full space-y-4">
            <h3 className="font-editorial text-2xl text-red-200">Confirm Project Deletion</h3>
            <p className="text-xs text-[#a39e93] leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#f7f6f2]">{deleteConfirmProject.title}</strong>? This action will
              permanently remove the project record from Supabase and purge all associated project images
              from Cloudflare R2 and the media store.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProject(null)}
                className="px-4 py-2 bg-[#1a1a1d] text-xs text-[#a39e93] hover:text-[#f7f6f2]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmProject)}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-xs text-white uppercase tracking-wider font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

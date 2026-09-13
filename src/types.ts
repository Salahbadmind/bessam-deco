export type ProjectCategory =
  | 'Residential'
  | 'Apartment'
  | 'Villa'
  | 'Kitchen'
  | 'Bathroom'
  | 'Commercial'
  | 'Office'
  | 'Full Renovation'
  | 'Interior Decoration';

export type ProjectStatus = 'Draft' | 'Published' | 'Archived';

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  file_size?: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  location: string;
  year: string;
  scope: string;
  description: string;
  vision: string;
  transformation: string;
  featured: boolean;
  status: ProjectStatus;
  cover_image_url: string;
  before_image_url?: string | null;
  after_image_url?: string | null;
  materials?: string[];
  services?: string[];
  gallery?: ProjectImage[];
  aspect_ratio?: '16:9' | '9:16' | 'contain' | 'auto';
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'Villa' | 'Apartment' | 'Duplex' | 'Penthouse' | 'Commercial' | 'House';
export type PropertyStatus = 'Available' | 'Under Contract' | 'Sold' | 'Coming Soon';

export interface Property {
  id: string;
  title: string;
  slug: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  price_formatted: string;
  location: string;
  address?: string;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  floors?: number;
  year_built?: string;
  description: string;
  features: string[];
  cover_image_url: string;
  gallery: string[];
  featured: boolean;
  ready_to_move: boolean;
  aspect_ratio?: '16:9' | '9:16' | 'contain' | 'auto';
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  features?: string[];
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  content: string;
  project_name: string;
  rating: number;
  active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  project_type: string;
  location: string;
  space_size: string;
  budget: string;
  message: string;
  attachment_url?: string | null;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Archived';
  created_at: string;
}

export interface Consultation {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  consultation_type: 'In-Studio Consultation' | 'On-Site Architectural Survey' | 'Virtual 3D Consultation';
  date: string;
  time_slot: string;
  project_scope: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  created_at: string;
}

export type ThemeMode = 'dark' | 'light';
export type Language = 'fr' | 'en' | 'ar';

export interface CraftsmanshipMaterial {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface ProcessStepItem {
  step: string;
  title: string;
  description: string;
}

export interface WhyUsPointItem {
  title: string;
  description: string;
}

export interface InstagramShowcaseItem {
  image: string;
  title: string;
  tag: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  brand_name: string;
  brand_subtitle?: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_url: string;
  logo_url?: string;
  favicon_url?: string;

  // Editable Homepage Texts & Images
  hero_headline?: string;
  hero_subheadline?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  hero_image_url?: string;

  philosophy_title?: string;
  philosophy_quote?: string;
  philosophy_p1?: string;
  philosophy_p2?: string;
  philosophy_image_url?: string;

  about_title?: string;
  about_p1?: string;
  about_p2?: string;
  about_p3?: string;
  about_founder_name?: string;
  about_founder_title?: string;
  about_experience_years?: string;
  about_projects_completed?: string;
  about_satisfaction_rate?: string;
  about_image_url?: string;

  craftsmanship_title?: string;
  craftsmanship_description?: string;
  craftsmanship_items?: CraftsmanshipMaterial[];

  process_steps?: ProcessStepItem[];
  why_us_points?: WhyUsPointItem[];
  instagram_items?: InstagramShowcaseItem[];

  // Custom Scripts & Analytics
  header_scripts?: string;
  footer_scripts?: string;
  custom_css?: string;

  // Studio Admin Credentials (Configurable by Owner)
  admin_email?: string;
  admin_password?: string;

  updated_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  image_url: string;
  file_size: number;
  file_size_formatted: string;
  original_size: number;
  optimized_size: number;
  width: number;
  height: number;
  format: string;
  project_association?: string | null;
  created_at: string;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  token: string;
}

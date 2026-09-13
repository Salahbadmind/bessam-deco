-- ==============================================================================
-- BESSAM DECORATEUR (BESSAM.DECO) SUPABASE SCHEMA
-- Relational database structure for projects, images, services, inquiries, and settings
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  scope TEXT DEFAULT '',
  description TEXT NOT NULL,
  vision TEXT,
  transformation TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
  cover_image_url TEXT NOT NULL,
  before_image_url TEXT,
  after_image_url TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Project Images Table (Editorial Gallery)
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  file_size TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  content TEXT NOT NULL,
  project_name TEXT,
  rating INTEGER DEFAULT 5,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  location TEXT NOT NULL,
  space_size TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Consultations Table (Interactive Booking)
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  project_scope TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL DEFAULT 'BESSAM DECORATEUR',
  brand_name TEXT NOT NULL DEFAULT 'BESSAM.DECO',
  tagline TEXT NOT NULL DEFAULT 'Transform Your Space Into Something Extraordinary.',
  description TEXT NOT NULL DEFAULT 'Premium renovation services that bring your vision to life with expert craftsmanship, refined design, and attention to detail.',
  phone TEXT DEFAULT '[PHONE NUMBER]',
  email TEXT DEFAULT '[EMAIL]',
  address TEXT DEFAULT '[ADDRESS]',
  instagram_url TEXT DEFAULT 'https://instagram.com/bessam.deco',
  facebook_url TEXT DEFAULT '[FACEBOOK URL]',
  whatsapp_url TEXT DEFAULT '[WHATSAPP]',
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Media Library Table (Cloudflare R2 metadata tracker)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_size_formatted TEXT,
  original_size BIGINT,
  optimized_size BIGINT,
  width INTEGER,
  height INTEGER,
  format TEXT DEFAULT 'webp',
  project_association TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public can READ published projects, active services, active testimonials, site settings
CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (status = 'Published');
CREATE POLICY "Public can view project images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Public can INSERT inquiries and consultations
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can book consultations" ON consultations FOR INSERT WITH CHECK (true);

-- Authenticated Admin has FULL access to all tables
CREATE POLICY "Admin full access projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access project images" ON project_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access inquiries" ON inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access consultations" ON consultations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access site settings" ON site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access media" ON media FOR ALL TO authenticated USING (true);

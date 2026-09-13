-- ==============================================================================
-- BESSAM.DECO (BESSAM DECORATEUR) — SUPABASE POSTGRESQL SCHEMA & INITIAL DATA
-- Copy and paste this script directly into the Supabase SQL Editor and click "RUN".
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings-default',
  company_name TEXT NOT NULL DEFAULT 'BESSAM DECORATEUR',
  brand_name TEXT NOT NULL DEFAULT 'BESSAM.DECO',
  brand_subtitle TEXT DEFAULT 'Rénovation & Architecture',
  tagline TEXT DEFAULT 'Transform Your Space Into Something Extraordinary.',
  description TEXT DEFAULT 'Premium renovation services that bring your vision to life with expert craftsmanship, refined design, and attention to detail.',
  phone TEXT DEFAULT '+213 550 00 00 00',
  email TEXT DEFAULT 'contact@bessamdeco.com',
  address TEXT DEFAULT 'Studio d’Architecture & Rénovation, Batna / Alger',
  instagram_url TEXT DEFAULT 'https://instagram.com/bessam.deco',
  facebook_url TEXT DEFAULT 'https://facebook.com/bessam.deco',
  whatsapp_url TEXT DEFAULT 'https://wa.me/213550000000',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  
  -- Editable Homepage Texts & Images
  hero_headline TEXT DEFAULT 'Transform Your Space Into Something Extraordinary.',
  hero_subheadline TEXT DEFAULT 'Des rénovations d’exception alliant précision architecturale, matériaux nobles et savoir-faire artisanal en Algérie.',
  hero_cta_primary TEXT DEFAULT 'Explore Projects',
  hero_cta_secondary TEXT DEFAULT 'Start Your Project',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
  
  philosophy_title TEXT DEFAULT 'Philosophy & Vision',
  philosophy_quote TEXT DEFAULT '« We do not simply renovate spaces. We redefine the way they feel, function, and live. »',
  philosophy_p1 TEXT DEFAULT 'Every project at BESSAM.DECO begins with attentive listening and rigorous volumetric analysis.',
  philosophy_p2 TEXT DEFAULT 'From Batna to Algiers, our atelier brings together licensed architects, structural engineers, and master artisans.',
  philosophy_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  
  about_title TEXT DEFAULT 'About The Studio',
  about_p1 TEXT DEFAULT 'BESSAM.DECO was founded on a singular conviction: that true luxury in renovation is defined not by excess, but by spatial clarity, tactile honesty, and uncompromising craftsmanship.',
  about_p2 TEXT DEFAULT 'Operating from Batna and serving clients throughout Algeria, the atelier oversees every phase of transformation.',
  about_p3 TEXT DEFAULT 'We deliberately limit our active commissions each season to guarantee principal-led attention on every detail.',
  about_founder_name TEXT DEFAULT 'Bessam Bouzid',
  about_founder_title TEXT DEFAULT 'Founder & Principal Architect',
  about_experience_years TEXT DEFAULT '12+',
  about_projects_completed TEXT DEFAULT '150+',
  about_satisfaction_rate TEXT DEFAULT '100%',
  about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  
  craftsmanship_title TEXT DEFAULT 'Noble Materials & Master Craftsmanship',
  craftsmanship_description TEXT DEFAULT 'We curate authentic architectural materials that age with dignity. Every slab, grain, and patina is selected by hand to create visceral harmony.',
  craftsmanship_items JSONB DEFAULT '[]'::jsonb,
  
  process_steps JSONB DEFAULT '[]'::jsonb,
  why_us_points JSONB DEFAULT '[]'::jsonb,
  instagram_items JSONB DEFAULT '[]'::jsonb,
  
  header_scripts TEXT DEFAULT '<!-- Custom Header Scripts -->',
  footer_scripts TEXT DEFAULT '<!-- Custom Footer Scripts -->',
  custom_css TEXT DEFAULT '/* Custom Studio Stylesheet Overrides */',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE TABLE: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT ('proj-' || replace(gen_random_uuid()::text, '-', '')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Villa',
  location TEXT,
  year TEXT,
  scope TEXT,
  description TEXT,
  vision TEXT,
  transformation TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Published',
  cover_image_url TEXT NOT NULL,
  before_image_url TEXT,
  after_image_url TEXT,
  materials TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  gallery JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE TABLE: services
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT ('srv-' || replace(gen_random_uuid()::text, '-', '')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE TABLE: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY DEFAULT ('test-' || replace(gen_random_uuid()::text, '-', '')),
  client_name TEXT NOT NULL,
  content TEXT NOT NULL,
  project_name TEXT,
  rating INT DEFAULT 5,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE TABLE: inquiries (Client contact requests)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq-' || replace(gen_random_uuid()::text, '-', '')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_type TEXT,
  location TEXT,
  space_size TEXT,
  budget TEXT,
  message TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE TABLE: consultations (Online booking appointments)
CREATE TABLE IF NOT EXISTS public.consultations (
  id TEXT PRIMARY KEY DEFAULT ('cons-' || replace(gen_random_uuid()::text, '-', '')),
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  project_scope TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CREATE TABLE: media (Optimized WebP media storage records)
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY DEFAULT ('med-' || replace(gen_random_uuid()::text, '-', '')),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  file_size BIGINT,
  file_size_formatted TEXT,
  original_size BIGINT,
  optimized_size BIGINT,
  width INT,
  height INT,
  format TEXT DEFAULT 'webp',
  project_association TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public reads on public content
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read media" ON public.media FOR SELECT USING (true);

-- Allow anonymous visitors to submit Inquiries & Consultations
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert consultations" ON public.consultations FOR INSERT WITH CHECK (true);

-- Allow full administrative access for service_role / authenticated admin
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full media" ON public.media FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 10. SEED INITIAL LUXURY DATA (Ensures immediate populated preview)
-- ==============================================================================
INSERT INTO public.site_settings (
  id,
  company_name,
  brand_name,
  brand_subtitle,
  tagline,
  description,
  phone,
  email,
  address,
  hero_headline,
  hero_subheadline,
  hero_image_url,
  philosophy_title,
  philosophy_quote
) VALUES (
  'settings-default',
  'BESSAM DECORATEUR',
  'BESSAM.DECO',
  'Rénovation & Architecture',
  'Transform Your Space Into Something Extraordinary.',
  'Premium renovation services that bring your vision to life with expert craftsmanship, refined design, and attention to detail.',
  '+213 550 00 00 00',
  'contact@bessamdeco.com',
  'Studio d’Architecture & Rénovation, Batna / Alger',
  'Transform Your Space Into Something Extraordinary.',
  'Des rénovations d’exception alliant précision architecturale, matériaux nobles et savoir-faire artisanal en Algérie.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
  'Philosophy & Vision',
  '« We do not simply renovate spaces. We redefine the way they feel, function, and live. »'
) ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 'BESSAM.DECO Database successfully created & configured!' as status;

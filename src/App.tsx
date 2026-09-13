import { useState, useEffect, useCallback } from 'react';
import {
  Project,
  Property,
  ServiceItem,
  Testimonial,
  Inquiry,
  Consultation,
  SiteSettings,
  MediaItem,
} from './types';
import {
  INITIAL_PROJECTS,
  INITIAL_PROPERTIES,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
} from './data/seedData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { HousesForSaleSection } from './components/HousesForSaleSection';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { WhyUs } from './components/WhyUs';
import { ProcessSection } from './components/ProcessSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { InstagramGallery } from './components/InstagramGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ConsultationBooking } from './components/ConsultationBooking';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { useThemeLanguage } from './context/ThemeLanguageContext';

export default function App() {
  const { theme, siteSettings: ctxSettings, updateSiteSettingsState } = useThemeLanguage();

  // Data state with fallback to seed data
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [media, setMedia] = useState<MediaItem[]>([]);

  // Navigation & View State
  const [currentView, setCurrentView] = useState<'website' | 'admin' | 'admin-login'>('website');
  const [activeSection, setActiveSection] = useState('home');

  // Modals
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [activePropertyDetail, setActivePropertyDetail] = useState<Property | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationScope, setConsultationScope] = useState('');
  const [selectedServiceInquiry, setSelectedServiceInquiry] = useState('');

  // Admin session state
  const [adminUser, setAdminUser] = useState<{ email: string; role: string; token: string } | null>(
    () => {
      try {
        const saved = localStorage.getItem('bessam_admin_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
  );

  // Dynamic Custom Scripts & CSS Injector
  useEffect(() => {
    const current = ctxSettings || siteSettings;
    if (!current) return;

    // Custom CSS injection
    let styleEl = document.getElementById('bessam-custom-css') as HTMLStyleElement | null;
    if (current.custom_css) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'bessam-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = current.custom_css;
    } else if (styleEl) {
      styleEl.remove();
    }

    // Custom Head Scripts injection
    let headContainer = document.getElementById('bessam-head-scripts');
    if (current.header_scripts) {
      if (!headContainer) {
        headContainer = document.createElement('div');
        headContainer.id = 'bessam-head-scripts';
        document.head.appendChild(headContainer);
      }
      headContainer.innerHTML = current.header_scripts;
    }

    // Custom Footer Scripts injection
    let footerContainer = document.getElementById('bessam-footer-scripts');
    if (current.footer_scripts) {
      if (!footerContainer) {
        footerContainer = document.createElement('div');
        footerContainer.id = 'bessam-footer-scripts';
        document.body.appendChild(footerContainer);
      }
      footerContainer.innerHTML = current.footer_scripts;
    }
  }, [ctxSettings, siteSettings]);

  // Fetch initial data from server
  const loadData = useCallback(async () => {
    try {
      const [projRes, propRes, servRes, testRes, setRes] = await Promise.allSettled([
        fetch('/api/projects'),
        fetch('/api/properties'),
        fetch('/api/services'),
        fetch('/api/testimonials'),
        fetch('/api/site-settings'),
      ]);

      if (projRes.status === 'fulfilled' && projRes.value.ok) {
        const p = await projRes.value.json();
        if (Array.isArray(p)) setProjects(p);
      }

      if (propRes.status === 'fulfilled' && propRes.value.ok) {
        const props = await propRes.value.json();
        if (Array.isArray(props)) setProperties(props);
      }

      if (servRes.status === 'fulfilled' && servRes.value.ok) {
        const s = await servRes.value.json();
        if (Array.isArray(s)) setServices(s);
      }

      if (testRes.status === 'fulfilled' && testRes.value.ok) {
        const t = await testRes.value.json();
        if (Array.isArray(t)) setTestimonials(t);
      }

      if (setRes.status === 'fulfilled' && setRes.value.ok) {
        const cfg = await setRes.value.json();
        if (cfg && cfg.brand_name) {
          setSiteSettings(cfg);
          updateSiteSettingsState(cfg);
        }
      }

      // If logged in as admin, fetch inquiries, consultations, and media
      if (adminUser) {
        const [inqRes, consRes, medRes] = await Promise.allSettled([
          fetch('/api/inquiries'),
          fetch('/api/consultations'),
          fetch('/api/media'),
        ]);

        if (inqRes.status === 'fulfilled' && inqRes.value.ok) {
          const inqs = await inqRes.value.json();
          setInquiries(inqs);
        }

        if (consRes.status === 'fulfilled' && consRes.value.ok) {
          const c = await consRes.value.json();
          setConsultations(c);
        }

        if (medRes.status === 'fulfilled' && medRes.value.ok) {
          const m = await medRes.value.json();
          setMedia(m);
        }
      }
    } catch (err) {
      console.warn('API data fetch fallback to local store:', err);
    }
  }, [adminUser, updateSiteSettingsState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle URL hash route (e.g., #admin, #property-villa-solarium)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (adminUser) {
          setCurrentView('admin');
        } else {
          setCurrentView('admin-login');
        }
      } else if (hash.startsWith('#project-')) {
        const slug = hash.replace('#project-', '');
        const found = projects.find((p) => p.slug === slug);
        if (found) setActiveProjectDetail(found);
      } else if (hash.startsWith('#property-')) {
        const slug = hash.replace('#property-', '');
        const foundProp = properties.find((p) => p.slug === slug);
        if (foundProp) setActivePropertyDetail(foundProp);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [adminUser, projects, properties]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (currentView !== 'website') {
      setCurrentView('website');
      window.location.hash = '';
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenConsultation = (scope = '') => {
    setConsultationScope(scope);
    setIsConsultationOpen(true);
  };

  const handleOpenAdmin = () => {
    if (adminUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  const handleLoginSuccess = (user: { email: string; role: string; token: string }) => {
    setAdminUser(user);
    try {
      localStorage.setItem('bessam_admin_user', JSON.stringify(user));
    } catch {}
    setCurrentView('admin');
    loadData();
  };

  const handleLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('bessam_admin_user');
    } catch {}
    setCurrentView('website');
    window.location.hash = '';
  };

  // Active settings merged
  const effectiveSettings = ctxSettings || siteSettings;

  // 1. ADMIN LOGIN VIEW
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => {
          setCurrentView('website');
          window.location.hash = '';
        }}
      />
    );
  }

  // 2. ADMIN DASHBOARD VIEW
  if (currentView === 'admin' && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        projects={projects}
        properties={properties}
        services={services}
        testimonials={testimonials}
        inquiries={inquiries}
        consultations={consultations}
        siteSettings={effectiveSettings}
        media={media}
        onRefreshData={loadData}
        onLogout={handleLogout}
        onViewLiveSite={() => {
          setCurrentView('website');
          window.location.hash = '';
        }}
      />
    );
  }

  // 3. MAIN LUXURY PUBLIC WEBSITE
  return (
    <div
      className={`min-h-screen pb-16 md:pb-0 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-[#fcfbf9] text-[#161618] selection:bg-[#c5a880] selection:text-[#0b0b0c]'
          : 'bg-[#0b0b0c] text-[#f7f6f2] selection:bg-[#c5a880] selection:text-[#0b0b0c]'
      }`}
    >
      {/* Sticky Header */}
      <Header
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={handleOpenAdmin}
        currentView={activeSection}
      />

      {/* Hero Section */}
      <Hero
        onExploreProjects={() => handleNavigate('projects')}
        onStartProject={() => handleOpenConsultation()}
      />

      {/* Philosophy & Brand Statement */}
      <Philosophy />

      {/* Services Section */}
      <ServicesSection
        services={services}
        onSelectServiceForInquiry={(serviceTitle) => {
          setSelectedServiceInquiry(serviceTitle);
          handleNavigate('project-inquiry-form');
        }}
        onFilterProjectsByService={() => {
          handleNavigate('projects');
        }}
      />

      {/* Selected Projects Portfolio */}
      <ProjectsSection
        projects={projects}
        onSelectProject={(project) => {
          setActiveProjectDetail(project);
          window.location.hash = `project-${project.slug}`;
        }}
      />

      {/* Dedicated Before & After Transformations Section */}
      <BeforeAfterSection
        projects={projects}
        onOpenProjectDetail={(project) => {
          setActiveProjectDetail(project);
          window.location.hash = `project-${project.slug}`;
        }}
      />

      {/* Ready-to-Move Houses & Turnkey Residences for Sale */}
      <HousesForSaleSection
        properties={properties}
        onSelectProperty={(property) => {
          setActivePropertyDetail(property);
          window.location.hash = `property-${property.slug}`;
        }}
        onBookViewing={(property) => {
          handleOpenConsultation(`Visite Privée: ${property.title} (${property.price_formatted})`);
        }}
      />

      {/* Why Choose BESSAM.DECO */}
      <WhyUs />

      {/* The 6-Step Architectural Process */}
      <ProcessSection />

      {/* Craftsmanship & Materials */}
      <CraftsmanshipSection />

      {/* Instagram Editorial Showcase */}
      <InstagramGallery />

      {/* Client Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* About The Studio */}
      <AboutSection />

      {/* Contact & Inquiry Form */}
      <ContactSection
        siteSettings={effectiveSettings}
        onOpenConsultation={() => handleOpenConsultation()}
        defaultServiceInquiry={selectedServiceInquiry}
      />

      {/* Editorial Footer */}
      <Footer
        siteSettings={effectiveSettings}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Mobile Floating Bottom Navigation Bar */}
      <MobileBottomNav
        currentSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        siteSettings={effectiveSettings}
      />

      {/* Property Detail Modal */}
      {activePropertyDetail && (
        <PropertyDetailModal
          property={activePropertyDetail}
          onClose={() => {
            setActivePropertyDetail(null);
            window.location.hash = '';
          }}
          onBookViewing={(prop) => {
            setActivePropertyDetail(null);
            handleOpenConsultation(`Visite Privée: ${prop.title} (${prop.price_formatted})`);
          }}
        />
      )}

      {/* Project Detail Modal */}
      {activeProjectDetail && (
        <ProjectDetailModal
          project={activeProjectDetail}
          allProjects={projects}
          onClose={() => {
            setActiveProjectDetail(null);
            window.location.hash = '';
          }}
          onSelectProject={(p) => {
            setActiveProjectDetail(p);
            window.location.hash = `project-${p.slug}`;
          }}
          onStartProject={() => {
            setActiveProjectDetail(null);
            handleOpenConsultation(activeProjectDetail.title);
          }}
        />
      )}

      {/* Interactive Consultation Booking Module */}
      {isConsultationOpen && (
        <ConsultationBooking
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
          defaultScope={consultationScope}
        />
      )}
    </div>
  );
}

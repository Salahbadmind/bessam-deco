import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Sun, Moon, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { Language } from '../types';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
  currentView: string;
}

export function Header({ onNavigate, onOpenConsultation, onOpenAdmin, currentView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const { theme, toggleTheme, language, setLanguage, t, siteSettings, dir } = useThemeLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      setMobileLangOpen(false);
      setLangDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { num: '01', label: t.nav.home, target: 'home' },
    { num: '02', label: t.nav.about, target: 'about' },
    { num: '03', label: t.nav.services, target: 'services' },
    { num: '04', label: t.nav.projects, target: 'projects' },
    { num: '05', label: t.nav.transformations, target: 'transformations' },
    { num: '06', label: t.nav.houses, target: 'houses' },
    { num: '07', label: t.nav.process, target: 'process' },
    { num: '08', label: t.nav.craftsmanship, target: 'craftsmanship' },
    { num: '09', label: t.nav.contact, target: 'contact' },
  ];

  const handleLinkClick = (target: string) => {
    setMenuOpen(false);
    onNavigate(target);
  };

  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ar', label: 'العربية', name: 'العربية' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? theme === 'light'
              ? 'py-3.5 bg-[#fcfbf9]/92 backdrop-blur-md border-b border-[#e6e0d6]/90 shadow-md text-[#161618]'
              : 'py-3.5 bg-[#0b0b0c]/90 backdrop-blur-md border-b border-[#26262b]/80 shadow-2xl text-[#f7f6f2]'
            : theme === 'light'
            ? 'py-5 bg-gradient-to-b from-[#fcfbf9]/90 to-transparent text-[#161618]'
            : 'py-6 bg-gradient-to-b from-[#0b0b0c]/80 to-transparent text-[#f7f6f2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5 sm:gap-3.5 transition-transform hover:scale-[1.01] shrink-0"
          >
            <img
              src={siteSettings?.logo_url || '/bessam-logo.svg'}
              alt={siteSettings?.brand_name || 'BESSAM.DECO'}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/bessam-logo.svg';
              }}
              className="h-8 sm:h-11 w-auto max-w-[130px] sm:max-w-[180px] object-contain shrink-0 block"
            />

            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-xl sm:text-2xl lg:text-3xl tracking-widest font-semibold transition-colors duration-300 group-hover:text-[#c5a880]">
                  {siteSettings?.brand_name || 'BESSAM.DECO'}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880] inline-block mb-1"></span>
              </div>
              <p
                className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-medium transition-colors ${
                  theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                }`}
              >
                {siteSettings?.brand_subtitle || t.brand.subtitle}
              </p>
            </div>
          </button>

          {/* Header Controls: Language + Theme + Consolidated Menu Icon + Consultation CTA */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="header-language-toggle-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-none border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#e6e0d6] bg-[#f4f1ea] text-[#161618] hover:border-[#c5a880]'
                    : 'border-[#26262b] bg-[#141416] text-[#f7f6f2] hover:border-[#c5a880]'
                }`}
                title="Select Language / Changer de langue / تغيير اللغة"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute top-full mt-1.5 ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                  } w-32 border shadow-xl z-50 py-1 transition-all ${
                    theme === 'light'
                      ? 'bg-[#ffffff] border-[#e6e0d6] text-[#161618]'
                      : 'bg-[#141416] border-[#26262b] text-[#f7f6f2]'
                  }`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        language === lang.code
                          ? 'text-[#c5a880] font-semibold bg-[#c5a880]/10'
                          : 'hover:bg-[#c5a880]/5'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-[#8c827a]">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-mode-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? t.theme.light : t.theme.dark}
              aria-label="Toggle dark/light theme"
              className={`p-2 border transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'border-[#e6e0d6] bg-[#f4f1ea] text-[#161618] hover:border-[#c5a880] hover:text-[#c5a880]'
                  : 'border-[#26262b] bg-[#141416] text-[#f7f6f2] hover:border-[#c5a880] hover:text-[#c5a880]'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#c5a880] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#9e7d4c] transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* CONSOLIDATED MENU ICON BUTTON (Desktop & Mobile) */}
            <button
              id="header-menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider border transition-all duration-300 cursor-pointer group ${
                menuOpen
                  ? 'bg-[#c5a880] text-[#0b0b0c] border-[#c5a880]'
                  : theme === 'light'
                  ? 'border-[#e6e0d6] bg-[#f4f1ea] text-[#161618] hover:border-[#c5a880] hover:text-[#c5a880]'
                  : 'border-[#26262b] bg-[#141416] text-[#f7f6f2] hover:border-[#c5a880] hover:text-[#c5a880]'
              }`}
              aria-label="Toggle Navigation Menu"
              title="Menu"
            >
              <Menu className="w-4 h-4 text-[#c5a880] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-mono tracking-widest text-[11px]">MENU</span>
            </button>

            {/* Book Consultation Button */}
            <button
              id="header-start-project-btn"
              onClick={onOpenConsultation}
              className="hidden md:flex px-4 lg:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0b0b0c] bg-[#c5a880] hover:bg-[#dfc8a8] transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-[#c5a880]/20 cursor-pointer shrink-0"
            >
              <span>{t.hero.startProject}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </header>

      {/* LUXURY NAVIGATION DRAWER & OVERLAY (HOUSED MENU & ADMIN CMS) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <aside
            id="main-navigation-drawer"
            aria-label="Navigation Menu"
            className={`relative ${
              dir === 'rtl' ? 'mr-auto' : 'ml-auto'
            } w-full max-w-md sm:max-w-lg h-full z-10 flex flex-col justify-between p-6 sm:p-8 md:p-10 shadow-2xl transition-transform duration-300 overflow-y-auto ${
              theme === 'light'
                ? 'bg-[#fcfbf9] text-[#161618] border-l border-[#e6e0d6]'
                : 'bg-[#0e0e10] text-[#f7f6f2] border-l border-[#26262b]'
            }`}
          >
            {/* Top Bar: Brand & Close */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#26262b]/30">
                <div className="flex items-center gap-3">
                  <img
                    src={siteSettings?.logo_url || '/bessam-logo.svg'}
                    alt={siteSettings?.brand_name || 'BESSAM.DECO'}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/bessam-logo.svg';
                    }}
                    className="h-9 w-auto max-w-[130px] object-contain shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-editorial text-lg font-semibold tracking-wider text-[#c5a880]">
                      {siteSettings?.brand_name || 'BESSAM.DECO'}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#a39e93]">
                      {siteSettings?.brand_subtitle || 'Architecture & Intérieur'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className={`p-2 border transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'border-[#e6e0d6] hover:bg-[#f4f1ea] text-[#161618]'
                      : 'border-[#26262b] hover:bg-[#1a1a1d] text-[#f7f6f2]'
                  }`}
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5 text-[#c5a880]" />
                </button>
              </div>

              {/* Navigation Links Grid */}
              <nav className="py-6 flex flex-col space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8c827a] mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => {
                  const isActive = currentView === link.target;
                  return (
                    <button
                      key={link.target}
                      id={`nav-link-${link.target}`}
                      onClick={() => handleLinkClick(link.target)}
                      className={`group w-full text-left rtl:text-right py-2 px-3 flex items-center justify-between transition-all cursor-pointer border-l-2 ${
                        isActive
                          ? 'border-[#c5a880] bg-[#c5a880]/10 text-[#c5a880]'
                          : theme === 'light'
                          ? 'border-transparent hover:border-[#c5a880] hover:bg-[#f4f1ea] text-[#161618]'
                          : 'border-transparent hover:border-[#c5a880] hover:bg-[#141416] text-[#f7f6f2]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#8c827a] group-hover:text-[#c5a880] transition-colors">
                          {link.num}
                        </span>
                        <span className="font-editorial text-xl sm:text-2xl tracking-wide group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 rtl:rotate-180 transition-all ${
                          isActive
                            ? 'text-[#c5a880] opacity-100'
                            : 'opacity-0 group-hover:opacity-100 text-[#c5a880]'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions & Admin Portal */}
            <div
              className={`space-y-4 pt-6 border-t ${
                theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
              }`}
            >
              {/* Start Project CTA in Drawer */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#0b0b0c] bg-[#c5a880] hover:bg-[#dfc8a8] flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <span>{t.hero.startProject}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              {/* Admin Studio CMS Button */}
              <button
                id="admin-login-nav-btn"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAdmin();
                }}
                className={`w-full py-2.5 px-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between border transition-all cursor-pointer group ${
                  theme === 'light'
                    ? 'border-[#e6e0d6] bg-[#f4f1ea] text-[#4a453f] hover:text-[#161618] hover:border-[#c5a880]'
                    : 'border-[#26262b] bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2] hover:border-[#c5a880]'
                }`}
                title="Admin Studio Portal"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#c5a880] group-hover:scale-110 transition-transform" />
                  <span>{t.nav.admin || 'Espace Studio (Admin)'}</span>
                </div>
                <span className="text-[10px] text-[#c5a880] font-mono group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                  Login →
                </span>
              </button>

              {/* Contact Information Snippet */}
              <div className="pt-2 text-[11px] text-[#8c827a] space-y-1 font-mono">
                {siteSettings?.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{siteSettings.contact_phone}</span>
                  </div>
                )}
                {siteSettings?.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>{siteSettings.contact_email}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}


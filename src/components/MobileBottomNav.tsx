import { Home, Layers, Calendar, PhoneCall, Building2 } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { SiteSettings } from '../types';

interface MobileBottomNavProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  siteSettings?: SiteSettings;
}

export function MobileBottomNav({
  currentSection,
  onNavigate,
  onOpenConsultation,
  siteSettings,
}: MobileBottomNavProps) {
  const { theme, t } = useThemeLanguage();

  const isLight = theme === 'light';

  return (
    <aside
      aria-label="Mobile Navigation"
      id="mobile-bottom-navbar"
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
        isLight
          ? 'bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e6e0d6] text-[#4a453f] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#0e0e10]/95 backdrop-blur-xl border-t border-[#26262b]/90 text-[#a39e93] shadow-[0_-8px_25px_rgba(0,0,0,0.5)]'
      } pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-1.5 px-2`}
    >
      <nav className="max-w-md mx-auto grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          id="mobile-nav-home"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative group ${
            currentSection === 'home'
              ? 'text-[#c5a880]'
              : isLight
              ? 'text-[#6b645b] hover:text-[#161618]'
              : 'text-[#a39e93] hover:text-[#f7f6f2]'
          }`}
        >
          {currentSection === 'home' && (
            <span className="absolute -top-1.5 w-5 h-0.5 bg-[#c5a880] rounded-full" />
          )}
          <Home className="w-5 h-5 mb-0.5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-[56px]">
            {t.nav.home}
          </span>
        </button>

        {/* 2. Projects */}
        <button
          id="mobile-nav-projects"
          onClick={() => onNavigate('projects')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative group ${
            currentSection === 'projects'
              ? 'text-[#c5a880]'
              : isLight
              ? 'text-[#6b645b] hover:text-[#161618]'
              : 'text-[#a39e93] hover:text-[#f7f6f2]'
          }`}
        >
          {currentSection === 'projects' && (
            <span className="absolute -top-1.5 w-5 h-0.5 bg-[#c5a880] rounded-full" />
          )}
          <Layers className="w-5 h-5 mb-0.5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-[56px]">
            {t.nav.projects}
          </span>
        </button>

        {/* 3. Center Action: Start Project / Devis */}
        <div className="flex flex-col items-center justify-center -mt-4">
          <button
            id="mobile-nav-consultation"
            onClick={onOpenConsultation}
            className="w-12 h-12 rounded-full bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] flex items-center justify-center shadow-lg hover:shadow-[#c5a880]/30 transition-all duration-300 transform active:scale-95 cursor-pointer border-2 border-[#141416]"
            title={t.hero.startProject}
            aria-label={t.hero.startProject}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#c5a880] mt-0.5 truncate max-w-[62px]">
            Devis
          </span>
        </div>

        {/* 4. Houses for Sale (Maisons à Vendre) */}
        <button
          id="mobile-nav-houses"
          onClick={() => onNavigate('houses')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative group ${
            currentSection === 'houses'
              ? 'text-[#c5a880]'
              : isLight
              ? 'text-[#6b645b] hover:text-[#161618]'
              : 'text-[#a39e93] hover:text-[#f7f6f2]'
          }`}
        >
          {currentSection === 'houses' && (
            <span className="absolute -top-1.5 w-5 h-0.5 bg-[#c5a880] rounded-full" />
          )}
          <Building2 className="w-5 h-5 mb-0.5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-[56px]">
            {t.nav.houses || 'Maisons'}
          </span>
        </button>

        {/* 5. Contact */}
        <button
          id="mobile-nav-contact"
          onClick={() => onNavigate('contact')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative group ${
            currentSection === 'contact'
              ? 'text-[#c5a880]'
              : isLight
              ? 'text-[#6b645b] hover:text-[#161618]'
              : 'text-[#a39e93] hover:text-[#f7f6f2]'
          }`}
        >
          {currentSection === 'contact' && (
            <span className="absolute -top-1.5 w-5 h-0.5 bg-[#c5a880] rounded-full" />
          )}
          <PhoneCall className="w-5 h-5 mb-0.5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-[56px]">
            {t.nav.contact}
          </span>
        </button>
      </nav>
    </aside>
  );
}

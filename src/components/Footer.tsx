import { useState } from 'react';
import { ArrowUp, Instagram, Mail, Phone, MapPin, Shield, X } from 'lucide-react';
import { SiteSettings } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface FooterProps {
  siteSettings: SiteSettings;
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
}

export function Footer({ siteSettings, onNavigate, onOpenConsultation, onOpenAdmin }: FooterProps) {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const { t, theme } = useThemeLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t pt-16 pb-12 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-[#f4f1ea] text-[#161618] border-[#e6e0d6]'
          : 'bg-[#070708] text-[#f7f6f2] border-[#26262b]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand Statement with Logo, Title & Back to Top */}
        <div
          className={`flex flex-col md:flex-row md:items-start justify-between pb-12 border-b gap-8 ${
            theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
          }`}
        >
          <div className="space-y-4 max-w-xl">
            {/* Logo + Brand Heading */}
            <div className="flex items-center gap-3">
              <img
                src={siteSettings.logo_url || '/bessam-logo.svg'}
                alt={siteSettings.brand_name || 'BESSAM.DECO'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/bessam-logo.svg';
                }}
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-editorial text-2xl sm:text-3xl font-semibold tracking-wider ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    BESSAM.DECO
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] inline-block mb-1"></span>
                </div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#c5a880] font-medium">
                  Rénovation & Architecture
                </p>
              </div>
            </div>

            <p
              className={`font-editorial text-xl sm:text-2xl font-normal italic ${
                theme === 'light' ? 'text-[#4a453f]' : 'text-[#d0ccc4]'
              }`}
            >
              « {siteSettings.tagline || 'Transform Your Space Into Something Extraordinary.'} »
            </p>
            <p
              className={`text-xs font-light leading-relaxed ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {siteSettings.description ||
                'Premium renovation services that bring your vision to life with expert craftsmanship, refined design, and attention to detail.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest hover:bg-[#dfc8a8] transition-colors cursor-pointer"
            >
              {t.hero.startProject}
            </button>
            <button
              onClick={scrollToTop}
              className={`p-3 border text-xs transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6] text-[#4a453f] hover:text-[#161618] hover:border-[#c5a880]'
                  : 'bg-[#141416] border-[#26262b] text-[#a39e93] hover:text-[#f7f6f2] hover:border-[#c5a880]'
              }`}
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Tier: Structured Navigation & Contacts */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-12 sm:py-16 border-b text-xs ${
            theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
          }`}
        >
          {/* Navigation */}
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#c5a880]">
              {t.footer.navigation}
            </p>
            <ul
              className={`space-y-2.5 ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transformations')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.transformations}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('houses')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.houses}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('craftsmanship')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  {t.nav.craftsmanship}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Disciplines */}
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#c5a880]">
              {t.footer.disciplines}
            </p>
            <ul
              className={`space-y-2.5 ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              <li>Rénovation Intégrale de Villas</li>
              <li>Appartements de Maître</li>
              <li>Architecture de Cuisines Sur-Mesure</li>
              <li>Sanctuaires de Bain en Pierre & Marbre</li>
              <li>Menuiserie & Ébénisterie Fine</li>
              <li>Lumière & Harmonisation Spatiale</li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#c5a880]">
              {t.footer.coordinates}
            </p>
            <div
              className={`space-y-2.5 ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 shrink-0" />
                <span>{siteSettings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <a href={`tel:${siteSettings.phone}`} className="hover:text-[#c5a880]">
                  {siteSettings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-[#c5a880]">
                  {siteSettings.email}
                </a>
              </p>
            </div>
          </div>

          {/* Social Channels & Credentials */}
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#c5a880]">
              {t.footer.follow}
            </p>
            <div className="space-y-3">
              <a
                href={siteSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 hover:text-[#c5a880] transition-colors ${
                  theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#c5a880]" />
                <span>Instagram: @bessam.deco</span>
              </a>

              <p className="text-[11px] text-[#8c827a] leading-relaxed pt-2">
                Couvrant des projets résidentiels et commerciaux prestigieux en Algérie avec des standards de finition internationaux.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Admin Entry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8c827a] gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} BESSAM.DECO (BESSAM DECORATEUR). {t.footer.rights}</span>
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer"
            >
              {t.footer.terms}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="text-[#8c827a] hover:text-[#c5a880] flex items-center gap-1.5 transition-colors text-[11px] uppercase tracking-wider cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Studio CMS Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Information Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-md">
          <div
            className={`relative w-full max-w-xl border p-6 sm:p-8 space-y-4 ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#e6e0d6] text-[#161618]'
                : 'bg-[#141416] border-[#26262b] text-[#f7f6f2]'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
              }`}
            >
              <h3 className="font-editorial text-2xl">
                {legalModal === 'privacy' ? 'Confidentialité Client' : "Conditions d'Atelier"}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-[#8c827a] hover:text-[#c5a880] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p
              className={`text-xs font-light leading-relaxed ${
                theme === 'light' ? 'text-[#4a453f]' : 'text-[#b8b3a8]'
              }`}
            >
              {legalModal === 'privacy'
                ? "Tous les plans d'architecture, photographies préliminaires et cahiers des charges soumis à BESSAM.DECO sont conservés sous stricte confidentialité d'atelier."
                : "Les esquisses de projets, palettes d'échantillons et modélisations volumétriques créées par BESSAM.DECO constituent des œuvres protégées. L'exécution sur chantier s'effectue selon le contrat validé."}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-medium cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

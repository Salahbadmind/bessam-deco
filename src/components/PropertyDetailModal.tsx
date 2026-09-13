import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Home,
  CheckCircle2,
  Calendar,
  Sparkles,
  PhoneCall,
  Smartphone,
  Monitor,
  ZoomIn,
} from 'lucide-react';
import { Property } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
}

export function PropertyDetailModal({
  property,
  onClose,
  onBookViewing,
}: PropertyDetailModalProps) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [frameMode, setFrameMode] = useState<'16:9' | '9:16' | 'contain'>('16:9');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const { theme, siteSettings, language } = useThemeLanguage();

  const isLight = theme === 'light';

  // Gather all photos: cover image + gallery images
  const allImages = property
    ? [property.cover_image_url, ...(property.gallery || [])].filter(Boolean)
    : [];

  // Auto-detect portrait 9:16
  useEffect(() => {
    if (property?.cover_image_url) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth * 1.15) {
          setFrameMode('9:16');
        } else {
          setFrameMode('16:9');
        }
      };
      img.src = property.cover_image_url;
    }
  }, [property?.cover_image_url]);

  // Lock body scroll
  useEffect(() => {
    if (!property) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeGalleryIndex !== null) {
          setActiveGalleryIndex(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [property, activeGalleryIndex, onClose]);

  if (!property) return null;

  const currentPhoto = allImages[activePhotoIndex] || property.cover_image_url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Floating Close Button */}
      <button
        onClick={onClose}
        aria-label="Fermer la vue détaillée"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-3 bg-[#101012]/90 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer shadow-2xl"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Scrollable Container */}
      <div className="relative z-10 w-full h-full overflow-y-auto pt-16 sm:pt-20 pb-24 px-4 sm:px-8 max-w-5xl mx-auto">
        {/* Main Card */}
        <div
          className={`border shadow-2xl overflow-hidden p-6 sm:p-10 ${
            isLight
              ? 'bg-[#ffffff] border-[#e6e0d6] text-[#161618]'
              : 'bg-[#101012] border-[#26262b] text-[#f7f6f2]'
          }`}
        >
          {/* Top Bar: Category, Status, Price */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#c5a880]/20 mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#c5a880] text-[#0b0b0c] text-xs font-mono tracking-widest uppercase font-semibold">
                {property.property_type}
              </span>
              {property.ready_to_move && (
                <span className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-mono tracking-widest uppercase flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Clé en Main</span>
                </span>
              )}
              <span
                className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase font-semibold ${
                  property.status === 'Available'
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                    : property.status === 'Under Contract'
                    ? 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
                    : property.status === 'Coming Soon'
                    ? 'text-blue-400 bg-blue-950/60 border border-blue-800/40'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                }`}
              >
                {property.status === 'Available'
                  ? 'Disponible à l’Achat'
                  : property.status === 'Under Contract'
                  ? 'Sous Compromis'
                  : property.status === 'Coming Soon'
                  ? 'Bientôt Disponible'
                  : 'Vendu'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#8c827a] font-mono uppercase tracking-widest block mb-0.5">
                Prix de Vente
              </span>
              <span className="text-2xl sm:text-3xl font-serif text-[#c5a880] font-semibold">
                {property.price_formatted}
              </span>
            </div>
          </div>

          {/* Title and Location */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-[#8c827a] font-mono mb-2">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              <span>{property.location}</span>
              {property.address && (
                <>
                  <span>•</span>
                  <span>{property.address}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-light tracking-tight">
              {property.title}
            </h1>
          </div>

          {/* Hero Image Showcase with Frame Controls */}
          <div className="mb-8 space-y-2">
            {/* Aspect Ratio Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#8c827a] px-1 gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#c5a880] font-medium">
                Photo {activePhotoIndex + 1} / {allImages.length}
              </span>
              <div className="flex items-center bg-[#18181c] border border-[#26262b] p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setFrameMode('16:9')}
                  className={`px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                    frameMode === '16:9'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">16:9 Paysage</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFrameMode('9:16')}
                  className={`px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                    frameMode === '9:16'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>9:16 Vertical</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFrameMode('contain')}
                  className={`px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                    frameMode === 'contain'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'text-[#a39e93] hover:text-[#f7f6f2]'
                  }`}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Afficher Tout</span>
                </button>
              </div>
            </div>

            {/* Main Stage */}
            <div
              className={`relative overflow-hidden border shadow-2xl transition-all duration-300 ${
                frameMode === '9:16'
                  ? 'aspect-[9/16] max-w-[420px] mx-auto'
                  : frameMode === 'contain'
                  ? 'aspect-[16/10] sm:aspect-[16/9] w-full max-h-[75vh]'
                  : 'aspect-[16/10] sm:aspect-[16/9] w-full'
              } ${isLight ? 'bg-[#f4f1ea] border-[#e6e0d6]' : 'bg-[#0c0c0e] border-[#26262b]'}`}
            >
              {/* Ambient blur in contain mode */}
              {frameMode === 'contain' && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 pointer-events-none scale-110"
                  style={{ backgroundImage: `url(${currentPhoto})` }}
                />
              )}

              <img
                src={currentPhoto}
                alt={property.title}
                className={`w-full h-full ${
                  frameMode === 'contain' ? 'object-contain' : 'object-cover'
                } object-center transition-all duration-300 cursor-pointer`}
                onClick={() => setActiveGalleryIndex(activePhotoIndex)}
                title="Agrandir en plein écran 100% sans coupure"
              />

              {/* Prev / Next Buttons */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) =>
                        prev === 0 ? allImages.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/75 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) =>
                        prev === allImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/75 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </>
              )}

              {/* Fullscreen indicator badge */}
              <div className="absolute bottom-4 right-4 pointer-events-none">
                <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md text-[11px] text-[#f7f6f2] border border-[#26262b] flex items-center gap-1.5 shadow-lg">
                  <ZoomIn className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Cliquer pour Plein Écran</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-14 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'border-[#c5a880] ring-2 ring-[#c5a880]/30 scale-105'
                        : 'border-[#26262b] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Architectural Specs Highlights Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div
              className={`p-4 border text-center ${
                isLight ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <Maximize className="w-5 h-5 mx-auto text-[#c5a880] mb-2" />
              <span className="text-xl font-serif font-semibold block">
                {property.area_sqm} m²
              </span>
              <span className="text-xs text-[#8c827a]">Surface Habitable</span>
            </div>

            <div
              className={`p-4 border text-center ${
                isLight ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <BedDouble className="w-5 h-5 mx-auto text-[#c5a880] mb-2" />
              <span className="text-xl font-serif font-semibold block">
                {property.bedrooms}
              </span>
              <span className="text-xs text-[#8c827a]">Suites & Chambres</span>
            </div>

            <div
              className={`p-4 border text-center ${
                isLight ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <Bath className="w-5 h-5 mx-auto text-[#c5a880] mb-2" />
              <span className="text-xl font-serif font-semibold block">
                {property.bathrooms}
              </span>
              <span className="text-xs text-[#8c827a]">Salles d’Eau & Bains</span>
            </div>

            <div
              className={`p-4 border text-center ${
                isLight ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <Home className="w-5 h-5 mx-auto text-[#c5a880] mb-2" />
              <span className="text-xl font-serif font-semibold block">
                {property.floors || 1}
              </span>
              <span className="text-xs text-[#8c827a]">Niveaux / Étages</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#c5a880] mb-3">
              Description Architecturale & Prestations
            </h3>
            <p className="text-base text-[#8c827a] leading-relaxed font-light whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features List */}
          {property.features && property.features.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#c5a880] mb-4">
                Équipements & Matériaux Nobles Inclus
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 border text-sm ${
                      isLight
                        ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#4a453f]'
                        : 'bg-[#141416] border-[#26262b] text-[#c5c0b8]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-[#c5a880]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#8c827a] font-mono block">
                Prise de rendez-vous confidentielle
              </span>
              <span className="text-sm font-medium">
                Visites privées 7j/7 avec l’architecte en charge
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`https://wa.me/${(siteSettings?.whatsapp || siteSettings?.phone || '+213550123456').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Bonjour BESSAM.DECO, je suis intéressé par la propriété suivante : ${property.title} (${property.price_formatted}). J'aimerais planifier une visite privée.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-6 py-3.5 bg-[#c5a880] hover:bg-[#d6bc96] text-[#0b0b0c] text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Demander Visite Privée WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-3.5 border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  isLight
                    ? 'border-[#d8d2c7] hover:bg-[#eae6de]'
                    : 'border-[#26262b] hover:bg-[#1a1a1e]'
                }`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {activeGalleryIndex !== null && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          {/* Close */}
          <button
            onClick={() => setActiveGalleryIndex(null)}
            className="absolute top-5 right-5 z-20 p-2.5 bg-[#141416] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              onClick={() =>
                setActiveGalleryIndex((prev) =>
                  prev === 0 ? allImages.length - 1 : (prev || 0) - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#141416]/80 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>
          )}

          {/* Next */}
          {allImages.length > 1 && (
            <button
              onClick={() =>
                setActiveGalleryIndex((prev) =>
                  prev === allImages.length - 1 ? 0 : (prev || 0) + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#141416]/80 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>
          )}

          {/* Uncropped Photo */}
          <div className="relative max-h-[90vh] max-w-[95vw] flex flex-col items-center justify-center">
            <img
              src={allImages[activeGalleryIndex]}
              alt={property.title}
              className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl border border-[#26262b]"
            />
            <div className="mt-3 px-4 py-1.5 bg-[#141416]/90 border border-[#26262b] text-xs text-[#a39e93] font-mono tracking-wider flex items-center gap-3">
              <span className="text-[#c5a880] font-semibold">
                Photo {activeGalleryIndex + 1} / {allImages.length}
              </span>
              <span>•</span>
              <span className="text-[11px] text-[#8c827a]">
                Affichage 100% sans recadrage (Support 9:16 & 16:9)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

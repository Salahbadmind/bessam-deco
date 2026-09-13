import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, Layers, Sparkles, Smartphone, Monitor, Maximize2, ZoomIn } from 'lucide-react';
import { Project } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ProjectDetailModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onStartProject: () => void;
}

export function ProjectDetailModal({
  project,
  allProjects,
  onClose,
  onSelectProject,
  onStartProject,
}: ProjectDetailModalProps) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [heroFrameMode, setHeroFrameMode] = useState<'16:9' | '9:16' | 'contain'>('16:9');
  const { t, theme } = useThemeLanguage();

  // Auto-detect if cover image is 9:16 / vertical
  useEffect(() => {
    if (project?.cover_image_url) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth * 1.15) {
          setHeroFrameMode('9:16');
        } else {
          setHeroFrameMode('16:9');
        }
      };
      img.src = project.cover_image_url;
    }
  }, [project?.cover_image_url]);

  // Keyboard navigation & lock scroll
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateAdjacent('prev');
      if (e.key === 'ArrowRight') navigateAdjacent('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, allProjects]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const navigateAdjacent = (direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? prevProject : nextProject;
    if (target) {
      onSelectProject(target);
      const modalEl = document.getElementById('project-modal-scroll');
      if (modalEl) modalEl.scrollTop = 0;
    }
  };

  const hasBeforeAfter = Boolean(project.before_image_url && project.after_image_url);

  return (
    <div
      id="project-detail-modal"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto animate-fadeIn ${
        theme === 'light'
          ? 'bg-[#fcfbf9]/98 backdrop-blur-xl text-[#161618]'
          : 'bg-[#0b0b0c]/98 backdrop-blur-xl text-[#f7f6f2]'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between border-b ${
          theme === 'light'
            ? 'bg-[#ffffff]/90 border-[#e6e0d6]'
            : 'bg-[#0b0b0c]/90 border-[#26262b]'
        }`}
      >
        {/* Previous / Next Case Study Seamless Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateAdjacent('prev')}
            className={`px-3 py-1.5 border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#161618] hover:border-[#c5a880]'
                : 'bg-[#141416]/80 border-[#26262b] text-[#f7f6f2] hover:border-[#c5a880]'
            }`}
            title={`Previous: ${prevProject?.title}`}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={() => navigateAdjacent('next')}
            className={`px-3 py-1.5 border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#161618] hover:border-[#c5a880]'
                : 'bg-[#141416]/80 border-[#26262b] text-[#f7f6f2] hover:border-[#c5a880]'
            }`}
            title={`Next: ${nextProject?.title}`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Close Button */}
        <button
          id="close-project-modal-btn"
          onClick={onClose}
          className={`p-2 border transition-all duration-200 cursor-pointer ${
            theme === 'light'
              ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#161618] hover:bg-[#c5a880] hover:text-[#0b0b0c]'
              : 'bg-[#141416] border-[#26262b] text-[#f7f6f2] hover:bg-[#c5a880] hover:text-[#0b0b0c]'
          }`}
          aria-label={t.projects.closeModal}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div
        id="project-modal-scroll"
        className="w-full h-full overflow-y-auto pt-24 pb-24 px-4 sm:px-8 max-w-5xl mx-auto"
      >
        {/* Large Cinematic Hero Image with Frame Modes */}
        <div className="mb-8 sm:mb-10 space-y-2">
          {/* Frame Switcher Bar */}
          <div className="flex items-center justify-between text-xs text-[#8c827a] px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#c5a880] font-medium">Vue Principale</span>
            <div className="flex items-center bg-[#101012] border border-[#26262b] p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setHeroFrameMode('16:9')}
                className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                  heroFrameMode === '16:9'
                    ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                    : 'text-[#a39e93] hover:text-[#f7f6f2]'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden sm:inline">16:9 Paysage</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroFrameMode('9:16')}
                className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                  heroFrameMode === '9:16'
                    ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                    : 'text-[#a39e93] hover:text-[#f7f6f2]'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>9:16 Vertical</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroFrameMode('contain')}
                className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                  heroFrameMode === 'contain'
                    ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                    : 'text-[#a39e93] hover:text-[#f7f6f2]'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Afficher Tout</span>
              </button>
            </div>
          </div>

          <div
            className={`relative overflow-hidden border shadow-2xl transition-all duration-300 ${
              heroFrameMode === '9:16'
                ? 'aspect-[9/16] max-w-[420px] mx-auto'
                : heroFrameMode === 'contain'
                ? 'aspect-[16/10] sm:aspect-[16/9] w-full max-h-[80vh]'
                : 'aspect-[16/9] sm:aspect-[21/10] w-full'
            } ${
              theme === 'light'
                ? 'bg-[#f4f1ea] border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            {/* Ambient blur in contain mode */}
            {heroFrameMode === 'contain' && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none scale-110"
                style={{ backgroundImage: `url(${project.cover_image_url})` }}
              />
            )}

            <img
              src={project.cover_image_url}
              alt={project.title}
              className={`w-full h-full ${
                heroFrameMode === 'contain' ? 'object-contain' : 'object-cover'
              } object-center transition-all duration-300 cursor-pointer`}
              onClick={() => setActiveGalleryIndex(-1)} // -1 represents hero cover image in lightbox
              title="Cliquez pour agrandir en plein écran"
            />
            <div
              className={`absolute inset-0 pointer-events-none ${
                theme === 'light'
                  ? 'bg-gradient-to-t from-[#fcfbf9]/90 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-[#0b0b0c]/90 via-transparent to-transparent'
              }`}
            />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 bg-[#c5a880] text-[11px] font-mono tracking-widest text-[#0b0b0c] uppercase font-semibold shadow-md">
                {project.category}
              </span>
              <span className="px-2.5 py-1 bg-[#0b0b0c]/80 backdrop-blur-md text-[10px] text-[#f7f6f2] border border-[#26262b] flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-[#c5a880]" />
                <span>Plein Écran</span>
              </span>
            </div>
          </div>
        </div>

        {/* Project Header Info */}
        <div
          className={`border-b pb-8 sm:pb-10 mb-10 sm:mb-12 space-y-6 ${
            theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
          }`}
        >
          <h1
            className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal leading-tight ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {project.title}
          </h1>

          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs pt-4 border-t ${
              theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-[#c5a880] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.projects.locationLabel}</span>
              </div>
              <p
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {project.location}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#c5a880] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.projects.yearLabel}</span>
              </div>
              <p
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {project.year}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#c5a880] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                <Layers className="w-3.5 h-3.5" />
                <span>Typologie</span>
              </div>
              <p
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {project.category}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#c5a880] mb-1 font-semibold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.projects.scopeLabel}</span>
              </div>
              <p
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {project.scope || 'Full Renovation'}
              </p>
            </div>
          </div>
        </div>

        {/* The Vision & The Transformation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 sm:mb-16">
          <div
            className={`space-y-4 p-6 sm:p-8 border ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.projects.visionTab}
              </span>
            </div>
            <h2
              className={`font-editorial text-2xl sm:text-3xl ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              Vision & Contexte
            </h2>
            <p
              className={`text-sm font-light leading-relaxed ${
                theme === 'light' ? 'text-[#4a453f]' : 'text-[#b8b3a8]'
              }`}
            >
              {project.vision || project.description}
            </p>
          </div>

          <div
            className={`space-y-4 p-6 sm:p-8 border ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.projects.transformationTab}
              </span>
            </div>
            <h2
              className={`font-editorial text-2xl sm:text-3xl ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              Métamorphose Réalisée
            </h2>
            <p
              className={`text-sm font-light leading-relaxed ${
                theme === 'light' ? 'text-[#4a453f]' : 'text-[#b8b3a8]'
              }`}
            >
              {project.transformation ||
                'Grâce à une restructuration volumétrique rigoureuse, une redistribution fluide de la lumière et des agencements sur-mesure, BESSAM.DECO a transfiguré ce lieu.'}
            </p>
          </div>
        </div>

        {/* Materials */}
        {project.materials && project.materials.length > 0 && (
          <div
            className={`p-6 sm:p-8 border mb-12 sm:mb-16 space-y-4 ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.projects.materialsLabel}
              </span>
            </div>
            <h3
              className={`font-editorial text-2xl ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              Matériaux & Éléments Architecturaux
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {project.materials.map((mat, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 text-xs border flex items-center gap-2 ${
                    theme === 'light'
                      ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#161618]'
                      : 'bg-[#1a1a1d] border-[#26262b] text-[#e0ddd5]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]"></span>
                  <span>{mat}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Before / After Comparison Slider if Available */}
        {hasBeforeAfter && (
          <div className="mb-12 sm:mb-16 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.nav.transformations}
              </span>
            </div>
            <h3
              className={`font-editorial text-3xl mb-4 ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              Comparatif Interactif Avant / Après
            </h3>
            <div
              className={`p-3 sm:p-4 border ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <BeforeAfterSlider
                beforeImage={project.before_image_url!}
                afterImage={project.after_image_url!}
                beforeLabel={t.transformations.before}
                afterLabel={t.transformations.after}
                aspectRatio="aspect-[16/9]"
              />
            </div>
          </div>
        )}

        {/* Architectural Photo Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-12 sm:mb-16 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.projects.galleryTab}
              </span>
            </div>
            <h3
              className={`font-editorial text-3xl ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              Galerie Photographique
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {project.gallery.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`relative overflow-hidden border group cursor-pointer ${
                    idx === 0 ? 'md:col-span-2 aspect-[21/10]' : 'aspect-[4/3]'
                  } ${
                    theme === 'light'
                      ? 'bg-[#f4f1ea] border-[#e6e0d6]'
                      : 'bg-[#141416] border-[#26262b]'
                  }`}
                  onClick={() => setActiveGalleryIndex(idx)}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {img.alt_text && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0b0b0c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-[#f7f6f2] font-light">{img.alt_text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div
          className={`p-8 sm:p-12 border text-center space-y-6 my-10 ${
            theme === 'light'
              ? 'bg-[#ffffff] border-[#e6e0d6]'
              : 'bg-[#141416] border-[#26262b]'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-semibold">
            BESSAM.DECO
          </p>
          <h3
            className={`font-editorial text-2xl sm:text-4xl ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {t.contact.title}
          </h3>
          <p
            className={`text-sm max-w-lg mx-auto font-light ${
              theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
            }`}
          >
            {t.contact.subtitle}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="px-8 py-3.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <span>{t.hero.startProject}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Uncropped Lightbox Modal (Shows 100% of 9:16 vertical or landscape photos) */}
      {activeGalleryIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          {/* Close Lightbox */}
          <button
            onClick={() => setActiveGalleryIndex(null)}
            className="absolute top-5 right-5 z-20 p-2.5 bg-[#141416] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Gallery Photo */}
          {project.gallery && project.gallery.length > 0 && (
            <button
              onClick={() => {
                if (activeGalleryIndex === -1) {
                  setActiveGalleryIndex(project.gallery.length - 1);
                } else if (activeGalleryIndex === 0) {
                  setActiveGalleryIndex(-1);
                } else {
                  setActiveGalleryIndex(activeGalleryIndex - 1);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#141416]/80 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>
          )}

          {/* Next Gallery Photo */}
          {project.gallery && project.gallery.length > 0 && (
            <button
              onClick={() => {
                if (activeGalleryIndex === -1) {
                  setActiveGalleryIndex(0);
                } else if (activeGalleryIndex >= project.gallery.length - 1) {
                  setActiveGalleryIndex(-1);
                } else {
                  setActiveGalleryIndex(activeGalleryIndex + 1);
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-[#141416]/80 hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white border border-[#26262b] transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>
          )}

          {/* The Uncropped Full Image */}
          <div className="relative max-h-[90vh] max-w-[95vw] flex flex-col items-center justify-center">
            {activeGalleryIndex === -1 ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl border border-[#26262b]"
              />
            ) : (
              project.gallery && project.gallery[activeGalleryIndex] && (
                <img
                  src={project.gallery[activeGalleryIndex].image_url}
                  alt={project.gallery[activeGalleryIndex].alt_text || project.title}
                  className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl border border-[#26262b]"
                />
              )
            )}

            {/* Photo Caption / Counter */}
            <div className="mt-3 px-4 py-1.5 bg-[#141416]/90 border border-[#26262b] text-xs text-[#a39e93] font-mono tracking-wider flex items-center gap-3">
              <span className="text-[#c5a880] font-semibold">
                {activeGalleryIndex === -1 ? 'Photo Principale' : `Photo ${activeGalleryIndex + 1} / ${project.gallery?.length || 1}`}
              </span>
              <span>•</span>
              <span className="text-[11px] text-[#8c827a]">Format Plein Écran (100% de la photo sans coupure)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

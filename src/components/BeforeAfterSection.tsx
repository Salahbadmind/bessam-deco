import { useState } from 'react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Project } from '../types';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface BeforeAfterSectionProps {
  projects: Project[];
  onOpenProjectDetail: (project: Project) => void;
}

export function BeforeAfterSection({ projects, onOpenProjectDetail }: BeforeAfterSectionProps) {
  const { t, theme } = useThemeLanguage();
  const transformProjects = projects.filter((p) => p.before_image_url && p.after_image_url);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (transformProjects.length === 0) {
    return null;
  }

  const activeProject = transformProjects[selectedIdx] || transformProjects[0];

  return (
    <section
      id="transformations"
      className={`py-20 sm:py-28 lg:py-36 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-10 sm:mb-14 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
              {t.nav.transformations}
            </span>
          </div>
          <h2
            className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal leading-tight ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {t.transformations.title}
          </h2>
          <p
            className={`text-sm sm:text-base font-light leading-relaxed ${
              theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
            }`}
          >
            {t.transformations.subtitle}
          </p>
        </motion.div>

        {/* Project Selector Tabs */}
        {transformProjects.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {transformProjects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-[#c5a880] text-[#0b0b0c] border-[#c5a880] font-semibold'
                    : theme === 'light'
                    ? 'bg-[#ffffff] text-[#4a453f] border-[#e6e0d6] hover:border-[#c5a880]'
                    : 'bg-[#141416] text-[#a39e93] border-[#26262b] hover:text-[#f7f6f2]'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* The Interactive Comparison Slider Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`relative border p-3 sm:p-6 shadow-2xl ${
            theme === 'light'
              ? 'bg-[#ffffff] border-[#e6e0d6]'
              : 'bg-[#141416] border-[#26262b]'
          }`}
        >
          <BeforeAfterSlider
            beforeImage={activeProject.before_image_url!}
            afterImage={activeProject.after_image_url!}
            beforeLabel={t.transformations.before}
            afterLabel={t.transformations.after}
            aspectRatio="aspect-[16/9]"
          />

          {/* Project Details Below Slider */}
          <div
            className={`pt-5 sm:pt-7 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t mt-4 ${
              theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-[#c5a880] uppercase">
                {activeProject.category} — {activeProject.location} ({activeProject.year})
              </span>
              <h3
                className={`font-editorial text-2xl sm:text-3xl ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {activeProject.title}
              </h3>
              <p
                className={`text-xs sm:text-sm max-w-2xl line-clamp-2 ${
                  theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                }`}
              >
                {activeProject.transformation || activeProject.description}
              </p>
            </div>

            <button
              onClick={() => onOpenProjectDetail(activeProject)}
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shrink-0 cursor-pointer border ${
                theme === 'light'
                  ? 'bg-[#f4f1ea] text-[#161618] border-[#e6e0d6] hover:bg-[#c5a880] hover:text-[#0b0b0c] hover:border-[#c5a880]'
                  : 'bg-[#1a1a1d] text-[#f7f6f2] border-[#383842] hover:bg-[#c5a880] hover:text-[#0b0b0c] hover:border-[#c5a880]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.projects.viewDetails}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

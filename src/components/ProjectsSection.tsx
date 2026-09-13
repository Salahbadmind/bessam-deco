import { useState, useMemo } from 'react';
import { Project } from '../types';
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedCategoryFilter?: string;
}

export function ProjectsSection({
  projects,
  onSelectProject,
  selectedCategoryFilter = 'All',
}: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategoryFilter);
  const { t, theme } = useThemeLanguage();

  const filterCategories = [
    { label: t.projects.allCategory, value: 'All' },
    { label: 'Residential', value: 'Residential' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Kitchens', value: 'Kitchen' },
    { label: 'Bathrooms', value: 'Bathroom' },
    { label: 'Full Renovation', value: 'Full Renovation' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    if (activeCategory === 'Kitchen') {
      return projects.filter((p) => p.category === 'Kitchen');
    }
    if (activeCategory === 'Bathroom') {
      return projects.filter((p) => p.category === 'Bathroom');
    }
    if (activeCategory === 'Commercial') {
      return projects.filter((p) => p.category === 'Commercial' || p.category === 'Office');
    }
    if (activeCategory === 'Residential') {
      return projects.filter(
        (p) => p.category === 'Residential' || p.category === 'Villa' || p.category === 'Apartment'
      );
    }
    if (activeCategory === 'Full Renovation') {
      return projects.filter(
        (p) =>
          p.category === 'Full Renovation' ||
          (p.scope && p.scope.toLowerCase().includes('renovation')) ||
          p.category === 'Villa'
      );
    }
    return projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [projects, activeCategory]);

  return (
    <section
      id="projects"
      className={`py-20 sm:py-28 lg:py-36 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-4"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.nav.projects}
              </span>
            </div>
            <h2
              className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {t.projects.title}
            </h2>
            <p
              className={`text-sm sm:text-base font-light ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {t.projects.subtitle}
            </p>
          </div>

          <div
            className={`text-xs font-mono tracking-wider ${
              theme === 'light' ? 'text-[#8c827a]' : 'text-[#8c827a]'
            }`}
          >
            <span>{filteredProjects.length} Realizations</span>
          </div>
        </motion.div>

        {/* Filter Categories Bar */}
        <div
          className={`flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 sm:mb-14 border-b no-scrollbar ${
            theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
          }`}
        >
          {filterCategories.map((cat) => (
            <button
              key={cat.value}
              id={`filter-cat-${cat.value}`}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 font-medium whitespace-nowrap cursor-pointer ${
                activeCategory === cat.value
                  ? 'text-[#0b0b0c] bg-[#c5a880] font-semibold shadow-md'
                  : theme === 'light'
                  ? 'text-[#4a453f] hover:text-[#161618] bg-[#ffffff] hover:bg-[#f4f1ea] border border-[#e6e0d6]'
                  : 'text-[#a39e93] hover:text-[#f7f6f2] bg-[#141416] hover:bg-[#1a1a1d] border border-[#26262b]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid: Editorial Bento/Masonry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => {
            const isFeatured = project.featured && index === 0;
            return (
              <motion.div
                key={project.id}
                id={`project-card-${project.slug}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                onClick={() => onSelectProject(project)}
                className={`group relative border transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                } ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880] shadow-sm hover:shadow-xl'
                    : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]/70 shadow-xl'
                }`}
              >
                {/* Image Container */}
                <div
                  className={`relative w-full overflow-hidden bg-[#1a1a1d] ${
                    isFeatured ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      theme === 'light'
                        ? 'bg-gradient-to-t from-[#ffffff] via-transparent to-transparent'
                        : 'bg-gradient-to-t from-[#141416] via-transparent to-transparent'
                    }`}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 border backdrop-blur-md ${
                        theme === 'light'
                          ? 'bg-[#ffffff]/90 text-[#161618] border-[#e6e0d6]'
                          : 'bg-[#0b0b0c]/85 text-[#f7f6f2] border-[#26262b]'
                      }`}
                    >
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-[#c5a880] text-[#0b0b0c] flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {project.before_image_url && project.after_image_url && (
                    <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-[10px] uppercase tracking-widest font-mono text-[#c5a880] bg-[#0b0b0c]/90 px-2 py-1 border border-[#c5a880]/50 backdrop-blur-md">
                      Before / After
                    </div>
                  )}
                </div>

                {/* Details Container */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 text-xs font-light ${
                        theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>{project.location}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>

                    <h3
                      className={`font-editorial text-2xl group-hover:text-[#c5a880] transition-colors duration-300 font-normal ${
                        theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className={`text-xs line-clamp-2 font-light leading-relaxed ${
                        theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                      }`}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Materials Chips & Link */}
                  <div
                    className={`pt-4 border-t flex items-center justify-between gap-2 ${
                      theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap overflow-hidden h-6">
                      {project.materials.slice(0, 2).map((m, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 border font-mono ${
                            theme === 'light'
                              ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#6b645b]'
                              : 'bg-[#0b0b0c] border-[#26262b] text-[#a39e93]'
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#c5a880] font-medium tracking-wider uppercase shrink-0 group-hover:text-[#dfc8a8]">
                      <span>{t.projects.viewDetails}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

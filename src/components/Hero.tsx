import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface HeroProps {
  onExploreProjects: () => void;
  onStartProject: () => void;
}

export function Hero({ onExploreProjects, onStartProject }: HeroProps) {
  const { t, siteSettings, theme, dir } = useThemeLanguage();

  const heroImage =
    siteSettings?.hero_image_url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85';

  const headline = siteSettings?.hero_headline || t.hero.headline;
  const subheadline = siteSettings?.hero_subheadline || t.hero.subheadline;

  return (
    <section
      id="home"
      className="relative min-h-[95vh] lg:min-h-screen w-full flex items-end justify-start pb-16 sm:pb-24 lg:pb-28 overflow-hidden transition-colors duration-300"
    >
      {/* Cinematic Full-Screen Background Image with subtle architectural movement */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={heroImage}
          alt="BESSAM.DECO luxury interior renovation"
          className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05]"
          loading="eager"
        />
        {/* Editorial Vignette & Gradient Overlays based on theme */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            theme === 'light'
              ? 'bg-gradient-to-t from-[#fcfbf9] via-[#fcfbf9]/40 to-black/20'
              : 'bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/50 to-transparent'
          }`}
        />
        <div
          className={`absolute inset-0 hidden sm:block ${
            dir === 'rtl'
              ? theme === 'light'
                ? 'bg-gradient-to-l from-[#fcfbf9]/90 via-transparent to-transparent'
                : 'bg-gradient-to-l from-[#0b0b0c]/85 via-transparent to-transparent'
              : theme === 'light'
              ? 'bg-gradient-to-r from-[#fcfbf9]/90 via-transparent to-transparent'
              : 'bg-gradient-to-r from-[#0b0b0c]/85 via-transparent to-transparent'
          }`}
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 sm:pt-36 lg:pt-44">
        <div className="max-w-3xl space-y-5 sm:space-y-7">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border backdrop-blur-md ${
              theme === 'light'
                ? 'bg-[#ffffff]/80 border-[#e6e0d6] text-[#161618]'
                : 'bg-[#141416]/70 border-[#26262b] text-[#d6d4ce]'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase">
              {siteSettings?.brand_name || 'BESSAM.DECO'} — {siteSettings?.brand_subtitle || t.brand.subtitle}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className={`font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] font-normal tracking-tight text-balance ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {headline}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed ${
              theme === 'light' ? 'text-[#4a453f]' : 'text-[#d0ccc4]'
            }`}
          >
            {subheadline}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3"
          >
            <button
              id="hero-explore-projects-btn"
              onClick={onExploreProjects}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-[#c5a880]/20 cursor-pointer"
            >
              <span>{siteSettings?.hero_cta_primary || t.hero.exploreProjects}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </button>

            <button
              id="hero-start-project-btn"
              onClick={onStartProject}
              className={`px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer border ${
                theme === 'light'
                  ? 'bg-[#ffffff]/80 text-[#161618] border-[#e6e0d6] hover:border-[#c5a880] hover:bg-[#ffffff]'
                  : 'bg-[#141416]/80 text-[#f7f6f2] border-[#383842] hover:border-[#c5a880] hover:bg-[#1f1f23]'
              }`}
            >
              <span>{siteSettings?.hero_cta_secondary || t.hero.startProject}</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Bar Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`pt-12 sm:pt-16 flex items-center justify-between text-xs tracking-widest border-t mt-10 sm:mt-14 ${
            theme === 'light' ? 'border-[#e6e0d6]/70 text-[#6b645b]' : 'border-[#26262b]/60 text-[#a39e93]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
            <span className="uppercase text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#c5a880]">
              Batna & Algiers Atelier
            </span>
          </div>

          <button
            onClick={onExploreProjects}
            className={`flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-colors group cursor-pointer ${
              theme === 'light' ? 'text-[#161618] hover:text-[#c5a880]' : 'text-[#d6d4ce] hover:text-[#c5a880]'
            }`}
          >
            <span>{t.hero.scrollDown}</span>
            <ArrowDown className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

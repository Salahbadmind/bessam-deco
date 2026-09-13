import { CRAFTSMANSHIP_DETAILS } from '../data/seedData';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function CraftsmanshipSection() {
  const { t, siteSettings, theme } = useThemeLanguage();

  const title = siteSettings?.craftsmanship_title || t.craftsmanship.title;
  const description = siteSettings?.craftsmanship_description || t.craftsmanship.subtitle;
  const items =
    siteSettings?.craftsmanship_items && siteSettings.craftsmanship_items.length > 0
      ? siteSettings.craftsmanship_items
      : CRAFTSMANSHIP_DETAILS;

  return (
    <section
      id="craftsmanship"
      className={`py-20 sm:py-28 lg:py-36 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#f4f1ea] border-[#e6e0d6]' : 'bg-[#0f0f11] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.nav.craftsmanship}
              </span>
            </div>
            <h2
              className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-sm sm:text-base font-light ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {description}
            </p>
          </div>

          <div
            className={`text-xs font-mono uppercase tracking-widest ${
              theme === 'light' ? 'text-[#8c827a]' : 'text-[#8c827a]'
            }`}
          >
            <span>Sourced Worldwide • Artisanal Finish</span>
          </div>
        </motion.div>

        {/* 4 Architectural Material Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative border transition-all duration-500 overflow-hidden ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880] shadow-sm hover:shadow-xl'
                  : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]/60 shadow-xl'
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1d]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 ${
                    theme === 'light'
                      ? 'bg-gradient-to-t from-[#ffffff] via-[#ffffff]/20 to-transparent'
                      : 'bg-gradient-to-t from-[#141416] via-[#141416]/20 to-transparent'
                  }`}
                />
              </div>

              <div className="p-6 sm:p-8 space-y-2.5">
                <span className="text-[11px] font-mono tracking-widest text-[#c5a880] uppercase">
                  {item.subtitle}
                </span>
                <h3
                  className={`font-editorial text-2xl sm:text-3xl ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm font-light leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Editorial Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`mt-14 sm:mt-16 p-6 sm:p-10 border text-center max-w-3xl mx-auto space-y-3 ${
            theme === 'light'
              ? 'bg-[#ffffff] border-[#e6e0d6]'
              : 'bg-[#141416] border-[#26262b]'
          }`}
        >
          <p
            className={`font-editorial italic text-lg sm:text-2xl ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            « Le contact de la pierre adoucie, le silence d’une menuiserie en chêne ajustée au millimètre et la température exacte d’une lumière à 2700 Kelvin transfigurent l’espace en architecture. »
          </p>
          <p className="text-xs font-mono tracking-widest text-[#c5a880] uppercase">
            — {siteSettings?.brand_name || 'BESSAM.DECO'} ATELIER
          </p>
        </motion.div>
      </div>
    </section>
  );
}

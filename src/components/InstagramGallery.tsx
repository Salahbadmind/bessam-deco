import { INSTAGRAM_SHOWCASE } from '../data/seedData';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function InstagramGallery() {
  const { t, siteSettings, theme } = useThemeLanguage();

  const items =
    siteSettings?.instagram_items && siteSettings.instagram_items.length > 0
      ? siteSettings.instagram_items
      : INSTAGRAM_SHOWCASE;

  const instagramUrl = siteSettings?.instagram_url || 'https://instagram.com/bessam.deco';

  return (
    <section
      className={`py-20 sm:py-28 lg:py-32 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.instagram.title}
              </span>
            </div>
            <h2
              className={`font-editorial text-3xl sm:text-5xl font-normal ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              More From BESSAM.DECO
            </h2>
            <p
              className={`text-sm font-light ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {t.instagram.subtitle}
            </p>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 border text-xs uppercase tracking-widest transition-all ${
              theme === 'light'
                ? 'bg-[#ffffff] text-[#161618] hover:text-[#c5a880] border-[#e6e0d6] hover:border-[#c5a880]'
                : 'bg-[#141416] text-[#f7f6f2] hover:text-[#c5a880] border-[#26262b] hover:border-[#c5a880]'
            }`}
          >
            <Instagram className="w-4 h-4 text-[#c5a880]" />
            <span>{t.instagram.followAt}</span>
            <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
          </a>
        </motion.div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`group relative aspect-square overflow-hidden border cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#f4f1ea] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0b0b0c]/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-[11px] font-medium text-[#f7f6f2] leading-tight">{item.title}</p>
                <p className="text-[10px] text-[#c5a880] tracking-wider mt-0.5">{item.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

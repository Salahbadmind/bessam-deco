import { Compass, Sparkles, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function Philosophy() {
  const { t, siteSettings, theme } = useThemeLanguage();

  const title = siteSettings?.philosophy_title || t.philosophy.title;
  const quote = siteSettings?.philosophy_quote || t.philosophy.quote;
  const p1 = siteSettings?.philosophy_p1 || t.philosophy.p1;
  const p2 = siteSettings?.philosophy_p2 || t.philosophy.p2;
  const philosophyImg =
    siteSettings?.philosophy_image_url ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80';

  return (
    <section
      id="about"
      className={`py-20 sm:py-28 lg:py-32 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Editorial Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.philosophy.pretitle}
              </span>
            </div>

            <h2
              className={`font-editorial text-2xl sm:text-4xl md:text-5xl leading-[1.14] text-balance font-normal ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {quote}
            </h2>

            <div
              className={`space-y-4 text-sm sm:text-base font-light leading-relaxed max-w-2xl ${
                theme === 'light' ? 'text-[#4a453f]' : 'text-[#b8b3a8]'
              }`}
            >
              <p>{p1}</p>
              <p>{p2}</p>
            </div>

            {/* Three Pillar Cards */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t ${
                theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
              }`}
            >
              <div
                className={`p-4 border transition-colors ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416]/50 border-[#26262b]'
                }`}
              >
                <div className="flex items-center gap-2 text-[#c5a880] mb-2">
                  <Compass className="w-4 h-4" />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    Proportion
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  Étude volumétrique et équilibre des perspectives lumineuses.
                </p>
              </div>

              <div
                className={`p-4 border transition-colors ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416]/50 border-[#26262b]'
                }`}
              >
                <div className="flex items-center gap-2 text-[#c5a880] mb-2">
                  <Gem className="w-4 h-4" />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    Matière Noble
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  Travertin naturel, chênes sélectionnés et marbres d’exception.
                </p>
              </div>

              <div
                className={`p-4 border transition-colors ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416]/50 border-[#26262b]'
                }`}
              >
                <div className="flex items-center gap-2 text-[#c5a880] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    Excellence
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  Coordination rigoureuse et finitions d’artisanat d’art.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Architectural Photographic Composition with Scroll Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div
              className={`relative aspect-[4/5] overflow-hidden border shadow-2xl ${
                theme === 'light'
                  ? 'bg-[#f4f1ea] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <img
                src={philosophyImg}
                alt="BESSAM.DECO Philosophy and Interior Architecture"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 ${
                  theme === 'light'
                    ? 'bg-gradient-to-t from-[#fcfbf9]/90 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#0b0b0c]/80 via-transparent to-transparent'
                }`}
              />

              {/* Floating Architectural Badge */}
              <div
                className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-4 border backdrop-blur-md flex items-center justify-between ${
                  theme === 'light'
                    ? 'bg-[#ffffff]/90 border-[#e6e0d6]'
                    : 'bg-[#0b0b0c]/90 border-[#26262b]'
                }`}
              >
                <div>
                  <p
                    className={`text-[10px] uppercase tracking-widest ${
                      theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                    }`}
                  >
                    Studio Standards
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    Excellence in Materiality & Light
                  </p>
                </div>
                <span className="text-xs font-editorial italic text-[#c5a880] text-right">
                  {siteSettings?.brand_name || 'BESSAM.DECO'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

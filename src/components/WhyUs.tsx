import { WHY_US_POINTS } from '../data/seedData';
import { Award, Ruler, Sparkles, Layers, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function WhyUs() {
  const { t, siteSettings, theme } = useThemeLanguage();
  const icons = [Ruler, Sparkles, Layers, Award, Eye];

  const points =
    siteSettings?.why_us_points && siteSettings.why_us_points.length > 0
      ? siteSettings.why_us_points
      : WHY_US_POINTS;

  return (
    <section
      className={`py-20 sm:py-28 lg:py-36 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0f0f11] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Heading */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#c5a880]"></span>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                {t.whyUs.title}
              </span>
            </div>
            <h2
              className={`font-editorial text-3xl sm:text-5xl font-normal leading-tight ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {siteSettings?.brand_name || 'BESSAM.DECO'}
            </h2>
            <p
              className={`text-sm font-light leading-relaxed ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {t.whyUs.subtitle}
            </p>

            <div
              className={`pt-6 border-t hidden lg:block ${
                theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
              }`}
            >
              <p className="text-xs text-[#8c827a] uppercase tracking-widest">
                Batna • Alger • Couverture Nationale
              </p>
            </div>
          </motion.div>

          {/* Right Reasons List */}
          <div
            className={`lg:col-span-8 divide-y ${
              theme === 'light' ? 'divide-[#e6e0d6]' : 'divide-[#26262b]'
            }`}
          >
            {points.map((point, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="py-6 sm:py-8 first:pt-0 last:pb-0 group transition-all duration-300"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div
                      className={`p-3 border group-hover:border-[#c5a880] text-[#c5a880] transition-colors duration-300 shrink-0 mt-1 ${
                        theme === 'light'
                          ? 'bg-[#ffffff] border-[#e6e0d6]'
                          : 'bg-[#141416] border-[#26262b]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3
                        className={`font-editorial text-2xl group-hover:text-[#c5a880] transition-colors ${
                          theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                        }`}
                      >
                        {point.title}
                      </h3>
                      <p
                        className={`text-sm font-light leading-relaxed max-w-2xl ${
                          theme === 'light' ? 'text-[#4a453f]' : 'text-[#b8b3a8]'
                        }`}
                      >
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

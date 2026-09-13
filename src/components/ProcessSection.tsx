import { PROCESS_STEPS } from '../data/seedData';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function ProcessSection() {
  const { t, siteSettings, theme } = useThemeLanguage();
  const steps =
    siteSettings?.process_steps && siteSettings.process_steps.length > 0
      ? siteSettings.process_steps
      : PROCESS_STEPS;

  return (
    <section
      id="process"
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
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
              {t.nav.process}
            </span>
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
          </div>
          <h2
            className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {t.process.title}
          </h2>
          <p
            className={`text-sm sm:text-base font-light ${
              theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
            }`}
          >
            {t.process.subtitle}
          </p>
        </motion.div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className={`relative border p-6 sm:p-8 transition-all duration-300 group flex flex-col justify-between ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880] shadow-sm hover:shadow-lg'
                  : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]/60 shadow-xl'
              }`}
            >
              {/* Step Number */}
              <div
                className={`flex items-baseline justify-between border-b pb-5 mb-5 ${
                  theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
                }`}
              >
                <span className="font-mono text-3xl sm:text-4xl text-[#c5a880] font-light">
                  {step.step}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-[#8c827a]' : 'text-[#a39e93]'
                  }`}
                >
                  PHASE
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2.5">
                <h3
                  className={`font-editorial text-2xl group-hover:text-[#c5a880] transition-colors ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm font-light leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#b8b3a8]'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Accent */}
              <div
                className={`pt-5 mt-5 border-t flex items-center justify-between text-[11px] ${
                  theme === 'light'
                    ? 'border-[#e6e0d6] text-[#8c827a]'
                    : 'border-[#26262b]/60 text-[#8c827a]'
                }`}
              >
                <span>BESSAM.DECO Standard</span>
                <span className="w-2 h-2 rounded-full bg-[#c5a880]/40 group-hover:bg-[#c5a880] transition-colors"></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

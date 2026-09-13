import { Testimonial } from '../types';
import { Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t, theme } = useThemeLanguage();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      className={`py-20 sm:py-28 lg:py-32 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#f4f1ea] border-[#e6e0d6]' : 'bg-[#0f0f11] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
              {t.testimonials.title}
            </span>
            <span className="w-8 h-[1px] bg-[#c5a880]"></span>
          </div>
          <h2
            className={`font-editorial text-3xl sm:text-5xl font-normal ${
              theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
            }`}
          >
            {t.testimonials.title}
          </h2>
          <p
            className={`text-sm font-light ${
              theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
            }`}
          >
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`border p-6 sm:p-8 flex flex-col justify-between space-y-5 relative group transition-colors duration-300 ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880] shadow-sm'
                  : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]/60 shadow-xl'
              }`}
            >
              <Quote className="w-8 h-8 text-[#c5a880]/40" />

              <p
                className={`text-sm font-light leading-relaxed italic ${
                  theme === 'light' ? 'text-[#36322d]' : 'text-[#d6d4ce]'
                }`}
              >
                « {item.content} »
              </p>

              <div
                className={`pt-4 border-t space-y-0.5 ${
                  theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]/80'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {item.client_name}
                </p>
                {item.project_name && (
                  <p className="text-xs text-[#c5a880] tracking-wider uppercase">
                    {item.project_name}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

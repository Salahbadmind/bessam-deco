import { useState } from 'react';
import { ArrowUpRight, Check, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';
import { ServiceItem } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForInquiry?: (serviceTitle: string) => void;
  onFilterProjectsByService?: (serviceTitle: string) => void;
}

export function ServicesSection({
  services,
  onSelectServiceForInquiry,
  onFilterProjectsByService,
}: ServicesSectionProps) {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const { t, theme } = useThemeLanguage();

  return (
    <section
      id="services"
      className={`py-20 sm:py-28 lg:py-36 relative transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#f4f1ea]' : 'bg-[#0f0f11]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                {t.nav.services}
              </span>
            </div>
            <h2
              className={`font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {t.services.title}
            </h2>
            <p
              className={`text-sm sm:text-base font-light ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              {t.services.subtitle}
            </p>
          </div>

          <div
            className={`text-xs tracking-widest uppercase ${
              theme === 'light' ? 'text-[#8c827a]' : 'text-[#8c827a]'
            }`}
          >
            <span>{services.length} Disciplines</span>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const stepNumber = String(index + 1).padStart(2, '0');
            return (
              <motion.div
                key={service.id}
                id={`service-card-${service.slug}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                onClick={() => setActiveModalService(service)}
                className={`group relative border transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880] shadow-sm hover:shadow-xl'
                    : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]/60 shadow-xl'
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1d]">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      theme === 'light'
                        ? 'bg-gradient-to-t from-[#ffffff] via-transparent to-transparent'
                        : 'bg-gradient-to-t from-[#141416] via-transparent to-transparent'
                    }`}
                  />
                  <div
                    className={`absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-mono px-2.5 py-1 border ${
                      theme === 'light'
                        ? 'text-[#161618] bg-[#ffffff]/90 border-[#e6e0d6]'
                        : 'text-[#f7f6f2] bg-[#0b0b0c]/80 border-[#26262b]'
                    }`}
                  >
                    {stepNumber}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      className={`font-editorial text-2xl group-hover:text-[#c5a880] transition-colors duration-300 ${
                        theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-xs line-clamp-3 font-light leading-relaxed mt-2.5 ${
                        theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div
                    className={`pt-4 border-t flex items-center justify-between text-xs text-[#c5a880] font-medium tracking-wider uppercase group-hover:text-[#dfc8a8] ${
                      theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]/80'
                    }`}
                  >
                    <span>{t.common.learnMore}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div
          id="service-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <div
            className={`relative w-full max-w-2xl border shadow-2xl overflow-hidden animate-fadeIn ${
              theme === 'light' ? 'bg-[#ffffff] border-[#e6e0d6]' : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            {/* Modal Image Banner */}
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <img
                src={activeModalService.image_url}
                alt={activeModalService.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 ${
                  theme === 'light'
                    ? 'bg-gradient-to-t from-[#ffffff] via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#141416] via-transparent to-transparent'
                }`}
              />
              <button
                onClick={() => setActiveModalService(null)}
                className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#ffffff]/80 text-[#161618] hover:text-[#c5a880]'
                    : 'bg-[#0b0b0c]/80 text-[#f7f6f2] hover:text-[#c5a880]'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c5a880]">
                  Architectural Discipline
                </span>
                <h3
                  className={`font-editorial text-3xl font-normal mt-1 ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {activeModalService.title}
                </h3>
              </div>

              <p
                className={`text-sm font-light leading-relaxed ${
                  theme === 'light' ? 'text-[#4a453f]' : 'text-[#d0ccc4]'
                }`}
              >
                {activeModalService.description}
              </p>

              {/* Key Features */}
              <div className="space-y-3">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {t.services.includedScope}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalService.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 text-xs p-2.5 border ${
                        theme === 'light'
                          ? 'bg-[#f4f1ea] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA footer */}
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t ${
                  theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
                }`}
              >
                {onFilterProjectsByService && (
                  <button
                    onClick={() => {
                      onFilterProjectsByService(activeModalService.title);
                      setActiveModalService(null);
                    }}
                    className={`text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'text-[#6b645b] hover:text-[#161618]'
                        : 'text-[#a39e93] hover:text-[#f7f6f2]'
                    }`}
                  >
                    <span>View associated projects</span>
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onSelectServiceForInquiry) {
                      onSelectServiceForInquiry(activeModalService.title);
                    }
                    setActiveModalService(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.services.requestQuote}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

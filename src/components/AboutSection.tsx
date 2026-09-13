import { Compass, CheckCircle2, Ruler, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export function AboutSection() {
  const { t, siteSettings, theme } = useThemeLanguage();

  const title = siteSettings?.about_title || t.about.title;
  const p1 =
    siteSettings?.about_p1 ||
    'BESSAM.DECO was founded on a singular conviction: that true luxury in renovation is defined not by excess, but by spatial clarity, tactile honesty, and uncompromising craftsmanship.';
  const p2 =
    siteSettings?.about_p2 ||
    'Operating from Batna and serving clients throughout Algeria, the atelier oversees every phase of transformation.';
  const p3 =
    siteSettings?.about_p3 ||
    'We deliberately limit our active commissions each season to guarantee principal-led attention on every detail.';

  const aboutImage =
    siteSettings?.about_image_url ||
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80';

  const founderName = siteSettings?.about_founder_name || 'Bessam Bouzid';
  const founderTitle = siteSettings?.about_founder_title || t.about.founderTitle;
  const expYears = siteSettings?.about_experience_years || '12+';
  const projectsCompleted = siteSettings?.about_projects_completed || '150+';
  const satisfactionRate = siteSettings?.about_satisfaction_rate || '100%';

  const pillars = [
    {
      title: 'Architectural Coherence',
      desc: 'Calculated partitions, alignment of joints, and natural volumetric balance.',
      icon: Ruler,
    },
    {
      title: 'Material Integrity',
      desc: 'Noble stones, French oaks, and hand-applied lime coatings that age with grace.',
      icon: Compass,
    },
    {
      title: 'Discipline on Execution',
      desc: 'Master artisans working under direct studio supervision with millimeter precision.',
      icon: ShieldCheck,
    },
    {
      title: 'Client Partnership',
      desc: 'Transparent progress tracking and dedicated single-point leadership.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      className={`py-20 sm:py-28 lg:py-36 relative border-b transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Dual Visual Composition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            <div
              className={`relative aspect-[4/5] border overflow-hidden shadow-2xl ${
                theme === 'light'
                  ? 'bg-[#f4f1ea] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <img
                src={aboutImage}
                alt="BESSAM DECORATEUR craftsmanship and architectural discipline"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 ${
                  theme === 'light'
                    ? 'bg-gradient-to-t from-[#fcfbf9]/80 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-[#0b0b0c]/70 via-transparent to-transparent'
                }`}
              />
            </div>

            {/* Founder & Studio Stats Badge */}
            <div
              className={`p-5 sm:p-6 border flex items-center justify-between ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider">
                  {founderName}
                </p>
                <p
                  className={`text-xs font-medium ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {founderTitle}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-editorial font-bold text-[#c5a880]">
                  {expYears}
                </span>
                <p
                  className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {t.about.statsYears}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Architectural Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#c5a880]"></span>
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                  {t.nav.about}
                </span>
              </div>
              <h2
                className={`font-editorial text-3xl sm:text-4xl md:text-5xl font-normal leading-tight ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {title}
              </h2>
              <p
                className={`text-base font-light leading-relaxed ${
                  theme === 'light' ? 'text-[#4a453f]' : 'text-[#d0ccc4]'
                }`}
              >
                {p1}
              </p>
              <p
                className={`text-sm font-light leading-relaxed ${
                  theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                }`}
              >
                {p2} {p3}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div
              className={`grid grid-cols-3 gap-3 sm:gap-6 py-4 border-y ${
                theme === 'light' ? 'border-[#e6e0d6]' : 'border-[#26262b]'
              }`}
            >
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#c5a880] font-semibold">
                  {projectsCompleted}
                </p>
                <p
                  className={`text-[10px] sm:text-xs uppercase tracking-wider ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {t.about.statsProjects}
                </p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#c5a880] font-semibold">
                  {expYears}
                </p>
                <p
                  className={`text-[10px] sm:text-xs uppercase tracking-wider ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {t.about.statsYears}
                </p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#c5a880] font-semibold">
                  {satisfactionRate}
                </p>
                <p
                  className={`text-[10px] sm:text-xs uppercase tracking-wider ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  {t.about.statsSatisfaction}
                </p>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 border transition-colors ${
                      theme === 'light'
                        ? 'bg-[#ffffff] border-[#e6e0d6]'
                        : 'bg-[#141416]/50 border-[#26262b]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[#c5a880] mb-1.5">
                      <Icon className="w-4 h-4" />
                      <h4
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                        }`}
                      >
                        {pillar.title}
                      </h4>
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-light ${
                        theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                      }`}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Instagram, Send, CheckCircle2, Upload, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ContactSectionProps {
  siteSettings: SiteSettings;
  onOpenConsultation: () => void;
  defaultServiceInquiry?: string;
}

export function ContactSection({
  siteSettings,
  onOpenConsultation,
  defaultServiceInquiry = '',
}: ContactSectionProps) {
  const { t, theme } = useThemeLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project_type: defaultServiceInquiry || 'Villa Full Renovation',
    location: 'Batna',
    space_size: '200 - 350 m²',
    budget: 'DZD 10,000,000+',
    message: '',
  });

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectTypes = [
    'Villa Full Renovation',
    'Apartment / Penthouse Renovation',
    'Kitchen Transformation',
    'Master Bathroom Sanctuary',
    'Commercial / Corporate Office',
    'Interior Decoration & Styling',
    'Custom Millwork & Space Planning',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let attachment_url: string | null = null;

      if (attachmentFile) {
        const uploadData = new FormData();
        uploadData.append('image', attachmentFile);
        uploadData.append('project_title', `Inquiry Attachment: ${formData.name}`);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          attachment_url = uploadJson.url;
        }
      }

      const inquiryPayload = {
        ...formData,
        attachment_url,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload),
      });

      if (!res.ok) {
        throw new Error('Could not submit inquiry. Please try again or reach out directly.');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        project_type: 'Villa Full Renovation',
        location: 'Batna',
        space_size: '200 - 350 m²',
        budget: 'DZD 10,000,000+',
        message: '',
      });
      setAttachmentFile(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={`relative transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#fcfbf9]' : 'bg-[#0b0b0c]'
      }`}
    >
      {/* 1. Dramatic Full-Width CTA Banner */}
      <div className="relative py-20 sm:py-28 lg:py-36 overflow-hidden border-b border-[#26262b]/60">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85"
            alt="Ready to transform your space with BESSAM.DECO"
            className="w-full h-full object-cover brightness-[0.35]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 bg-[#141416]/80 backdrop-blur-md px-4 py-1.5 border border-[#26262b]"
          >
            <span className="w-2 h-2 rounded-full bg-[#c5a880]"></span>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#d6d4ce] uppercase">
              {siteSettings.brand_name || 'BESSAM.DECO'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-editorial text-3xl sm:text-5xl md:text-7xl text-[#f7f6f2] font-normal leading-tight"
          >
            {t.contact.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-[#d0ccc4] font-light max-w-2xl mx-auto leading-relaxed"
          >
            {t.contact.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
            >
              <span>{t.hero.startProject}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <a
              href="#project-inquiry-form"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#141416]/80 hover:bg-[#1a1a1d] text-[#f7f6f2] border border-[#383842] hover:border-[#c5a880] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>{t.nav.contact}</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* 2. Detailed Contact & Inquiry Form Section */}
      <div id="project-inquiry-form" className="py-20 sm:py-28 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: Contact Info Placeholders & Atelier Identity */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#c5a880]"></span>
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#c5a880]">
                  {t.nav.contact}
                </span>
              </div>
              <h3
                className={`font-editorial text-3xl sm:text-4xl ${
                  theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                }`}
              >
                {t.contact.directAtelier}
              </h3>
              <p
                className={`text-sm font-light leading-relaxed ${
                  theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                }`}
              >
                {t.contact.subtitle}
              </p>
            </div>

            {/* Contact Details */}
            <div
              className={`space-y-3 pt-4 border-t text-xs ${
                theme === 'light'
                  ? 'border-[#e6e0d6] text-[#4a453f]'
                  : 'border-[#26262b] text-[#b8b3a8]'
              }`}
            >
              <div
                className={`flex items-start gap-3 p-3.5 border ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416] border-[#26262b]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8c827a] font-semibold">
                    {t.contact.addressLabel}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    {siteSettings.address}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 p-3.5 border ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416] border-[#26262b]'
                }`}
              >
                <Phone className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8c827a] font-semibold">
                    {t.contact.phoneLabel}
                  </p>
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className={`text-sm mt-0.5 block hover:text-[#c5a880] transition-colors ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 p-3.5 border ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416] border-[#26262b]'
                }`}
              >
                <Mail className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8c827a] font-semibold">
                    {t.contact.emailLabel}
                  </p>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className={`text-sm mt-0.5 block hover:text-[#c5a880] transition-colors ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              <div
                className={`flex items-start gap-3 p-3.5 border ${
                  theme === 'light'
                    ? 'bg-[#ffffff] border-[#e6e0d6]'
                    : 'bg-[#141416] border-[#26262b]'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#c5a880] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8c827a] font-semibold">
                    Instagram
                  </p>
                  <a
                    href={siteSettings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c5a880] hover:underline mt-0.5 block"
                  >
                    @bessam.deco
                  </a>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-[#e6e0d6]'
                  : 'bg-[#141416] border-[#26262b]'
              }`}
            >
              <p className="text-[11px] text-[#8c827a]">
                <strong className={theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'}>
                  Confidentialité :
                </strong>{' '}
                Tous vos plans, photographies et données de projet sont traités avec la plus stricte discrétion architecturale.
              </p>
            </div>
          </motion.div>

          {/* Right: Comprehensive Project Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-7 border p-6 sm:p-10 shadow-2xl ${
              theme === 'light'
                ? 'bg-[#ffffff] border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            {isSuccess ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#c5a880]/10 border border-[#c5a880] flex items-center justify-center mx-auto text-[#c5a880]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4
                  className={`font-editorial text-3xl ${
                    theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                  }`}
                >
                  {t.contact.successMessage}
                </h4>
                <p
                  className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${
                    theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                  }`}
                >
                  Merci de votre confiance. Notre direction d’atelier vous contactera sous 24 à 48 heures ouvrées.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2.5 text-xs uppercase tracking-wider text-[#c5a880] border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0b0b0c] transition-colors cursor-pointer"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h4
                    className={`font-editorial text-2xl sm:text-3xl ${
                      theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
                    }`}
                  >
                    {t.nav.contact}
                  </h4>
                  <p
                    className={`text-xs font-light mt-1 ${
                      theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                    }`}
                  >
                    Renseignez les paramètres essentiels de votre projet architectural.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-900/20 border border-red-800 text-xs text-red-400">
                    {errorMessage}
                  </div>
                )}

                {/* Name, Phone, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      {t.contact.namePlaceholder} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="M. Benali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      {t.contact.phonePlaceholder} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+213 550..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      {t.contact.emailPlaceholder} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>
                </div>

                {/* Project Type & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      {t.contact.projectTypePlaceholder}
                    </label>
                    <select
                      value={formData.project_type}
                      onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    >
                      {projectTypes.map((pt) => (
                        <option key={pt} value={pt} className={theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#141416]'}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      {t.projects.locationLabel}
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Batna, Alger, Oran..."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>
                </div>

                {/* Space Size & Estimated Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      Surface approximative
                    </label>
                    <input
                      type="text"
                      placeholder="ex: 180 m², 350 m²"
                      value={formData.space_size}
                      onChange={(e) => setFormData({ ...formData, space_size: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                      }`}
                    >
                      Budget estimé
                    </label>
                    <input
                      type="text"
                      placeholder="ex: DZD 10M - 15M+"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                        theme === 'light'
                          ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                          : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                      }`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                    }`}
                  >
                    {t.contact.messagePlaceholder} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Décrivez l'état actuel de l'espace, les ambiances souhaitées, vos exigences de calendrier..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full border p-3.5 text-xs focus:border-[#c5a880] focus:outline-none leading-relaxed ${
                      theme === 'light'
                        ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                        : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                    }`}
                  />
                </div>

                {/* Optional Floorplan / Photo Upload */}
                <div className="space-y-2">
                  <label
                    className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${
                      theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                    }`}
                  >
                    <span>Plans ou photos de l'espace existant (Facultatif)</span>
                    <span className="text-[10px] text-[#8c827a] font-normal">JPG, PNG, WebP</span>
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed p-4 text-center cursor-pointer transition-colors ${
                      theme === 'light'
                        ? 'bg-[#f4f1ea]/60 border-[#c5a880]/50 hover:border-[#c5a880]'
                        : 'bg-[#0b0b0c]/60 border-[#383842] hover:border-[#c5a880]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachmentFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-[#8c827a]">
                      <Upload className="w-5 h-5 text-[#c5a880]" />
                      {attachmentFile ? (
                        <p className="text-[#c5a880] font-medium">
                          Sélectionné : {attachmentFile.name} ({Math.round(attachmentFile.size / 1024)} KB)
                        </p>
                      ) : (
                        <p>Cliquez ou déposez vos plans / clichés ici</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    id="submit-inquiry-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmission...' : t.contact.submitButton}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

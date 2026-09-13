import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Consultation } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ConsultationBookingProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScope?: string;
}

export function ConsultationBooking({ isOpen, onClose, defaultScope = '' }: ConsultationBookingProps) {
  const { t, theme } = useThemeLanguage();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone: '',
    consultation_type: 'On-Site Architectural Survey' as Consultation['consultation_type'],
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time_slot: '14:00 - 15:30',
    project_scope: defaultScope || 'Complete Villa / Apartment Interior Renovation',
    notes: '',
  });

  const [bookingResult, setBookingResult] = useState<Consultation | null>(null);

  if (!isOpen) return null;

  const consultationTypes = [
    {
      type: 'On-Site Architectural Survey',
      title: 'Visite & Relevé Architectural sur Site',
      desc: 'Déplacement de notre architecte pour analyse des volumes, contraintes porteuses et potentiel de métamorphose.',
    },
    {
      type: 'In-Studio Consultation',
      title: 'Consultation Privée en Atelier',
      desc: 'Échange immersif autour de nos tissuthèques, nuanciers de pierres naturelles et portfolio de projets réalisés.',
    },
    {
      type: 'Virtual 3D Consultation',
      title: 'Consultation Vidéo & Modélisation 3D',
      desc: 'Session visio haute définition dédiée aux investisseurs distants ou expatriés avant lancement de chantier.',
    },
  ];

  const timeSlots = ['10:00 - 11:30', '14:00 - 15:30', '16:30 - 18:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Impossible de réserver la consultation. Veuillez réessayer.');
      }

      const created: Consultation = await res.json();
      setBookingResult(created);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Erreur de réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="consultation-booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0b0c]/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-2xl border shadow-2xl my-8 overflow-hidden transition-colors ${
          theme === 'light'
            ? 'bg-[#ffffff] border-[#e6e0d6] text-[#161618]'
            : 'bg-[#141416] border-[#26262b] text-[#f7f6f2]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            theme === 'light' ? 'bg-[#f4f1ea] border-[#e6e0d6]' : 'bg-[#1a1a1d] border-[#26262b]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c5a880]"></span>
            <span
              className={`text-xs uppercase tracking-widest font-semibold ${
                theme === 'light' ? 'text-[#161618]' : 'text-[#f7f6f2]'
              }`}
            >
              {t.hero.bookConsultation}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8c827a] hover:text-[#c5a880] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-xs text-red-200">
                {error}
              </div>
            )}

            {/* Consultation Type Selector */}
            <div className="space-y-2">
              <label
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                }`}
              >
                Format de Consultation
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {consultationTypes.map((c) => (
                  <div
                    key={c.type}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        consultation_type: c.type as Consultation['consultation_type'],
                      })
                    }
                    className={`p-3.5 border cursor-pointer transition-all ${
                      formData.consultation_type === c.type
                        ? 'border-[#c5a880] bg-[#c5a880]/10'
                        : theme === 'light'
                        ? 'border-[#e6e0d6] hover:border-[#c5a880]/60 bg-[#fcfbf9]'
                        : 'border-[#26262b] hover:border-[#c5a880]/60 bg-[#0b0b0c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#c5a880]">{c.title}</p>
                      <span className="text-[10px] font-mono uppercase text-[#8c827a]">{c.type}</span>
                    </div>
                    <p
                      className={`text-xs mt-1 font-light ${
                        theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
                      }`}
                    >
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Date Souhaitée</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                    theme === 'light'
                      ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                      : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label
                  className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Créneau Horaire</span>
                </label>
                <select
                  value={formData.time_slot}
                  onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                  className={`w-full border px-3.5 py-2.5 text-xs focus:border-[#c5a880] focus:outline-none ${
                    theme === 'light'
                      ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                      : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                  }`}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} className={theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#141416]'}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Name, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
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

            {/* Scope / Notes */}
            <div className="space-y-1">
              <label
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  theme === 'light' ? 'text-[#4a453f]' : 'text-[#d6d4ce]'
                }`}
              >
                Précisions sur votre espace
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Villa neuve à Batna nécessitant étude complète d'agencement intérieur et menuiserie haut de gamme..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={`w-full border p-3 text-xs focus:border-[#c5a880] focus:outline-none ${
                  theme === 'light'
                    ? 'bg-[#fcfbf9] border-[#e6e0d6] text-[#161618]'
                    : 'bg-[#0b0b0c] border-[#26262b] text-[#f7f6f2]'
                }`}
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#8c827a] hover:text-[#c5a880] transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>{loading ? 'Confirmation...' : 'Confirmer le Rendez-vous'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/10 border border-[#c5a880] flex items-center justify-center mx-auto text-[#c5a880]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="font-editorial text-3xl">Rendez-vous Confirmé</h3>

            <p
              className={`text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed ${
                theme === 'light' ? 'text-[#6b645b]' : 'text-[#a39e93]'
              }`}
            >
              Votre séance de consultation avec notre direction d’atelier est enregistrée pour le{' '}
              <strong className="text-[#c5a880] font-medium">{bookingResult?.date}</strong> sur le créneau{' '}
              <strong className="text-[#c5a880] font-medium">{bookingResult?.time_slot}</strong>.
            </p>

            <div
              className={`p-4 border max-w-md mx-auto text-left text-xs space-y-1.5 ${
                theme === 'light' ? 'bg-[#f4f1ea] border-[#e6e0d6]' : 'bg-[#0b0b0c] border-[#26262b]'
              }`}
            >
              <p>
                <strong>Client :</strong> {bookingResult?.client_name}
              </p>
              <p>
                <strong>Type :</strong> {bookingResult?.consultation_type}
              </p>
              <p>
                <strong>Contact :</strong> {bookingResult?.phone} | {bookingResult?.email}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest hover:bg-[#dfc8a8] transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

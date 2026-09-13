import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Sparkles,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Property } from '../types';

interface PropertyEditorModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const DEFAULT_PROPERTY_DATA: Partial<Property> = {
  title: '',
  slug: '',
  property_type: 'Villa',
  status: 'Available',
  price: 65000000,
  price_formatted: '65 000 000 DZD',
  location: 'Batna, Algérie',
  address: 'Zone Résidentielle Sud',
  area_sqm: 420,
  bedrooms: 5,
  bathrooms: 4,
  floors: 3,
  year_built: '2025',
  ready_to_move: true,
  aspect_ratio: '16:9',
  cover_image_url:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  gallery: [],
  description: '',
  features: [
    'Finitions en Marbre Travertin Italien Navona',
    'Cuisine monolithique sur-mesure équipée',
    'Menuiserie aluminium à rupture thermique Schüco',
    'Suite parentale avec dressing & salle de bain privative',
    'Système de domotique intégrale',
    'Jardin paysager & piscine privative',
  ],
};

export function PropertyEditorModal({
  property,
  isOpen,
  onClose,
  onSave,
}: PropertyEditorModalProps) {
  const isEditing = !!property;

  const [formData, setFormData] = useState<Partial<Property>>(DEFAULT_PROPERTY_DATA);
  const [newFeature, setNewFeature] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Synchronize or reset form data whenever modal opens or property prop changes
  useEffect(() => {
    if (isOpen) {
      if (property) {
        setFormData({
          ...property,
          features: property.features || [],
          gallery: property.gallery || [],
        });
      } else {
        setFormData({ ...DEFAULT_PROPERTY_DATA });
      }
      setError('');
      setNewFeature('');
    }
  }, [isOpen, property]);

  if (!isOpen) return null;

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && isEditing ? prev.slug : slug,
    }));
  };

  // Price formatter helper
  const handlePriceChange = (val: number) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(val) + ' DZD';
    setFormData((prev) => ({
      ...prev,
      price: val,
      price_formatted: formatted,
    }));
  };

  // Upload single cover image
  const handleCoverUpload = async (file: File) => {
    setIsUploadingCover(true);
    setError('');
    try {
      const data = new FormData();
      data.append('image', file);
      data.append('project_title', formData.title || 'Propriété');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const contentType = res.headers.get('content-type') || '';
      let json: any = {};
      if (contentType.includes('application/json')) {
        json = await res.json().catch(() => ({}));
      }

      if (!res.ok || !json.url) {
        throw new Error(json.error || `Upload failed (${res.status})`);
      }

      setFormData((prev) => ({ ...prev, cover_image_url: json.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’upload de l’image de couverture.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload gallery images
  const handleGalleryUpload = async (files: FileList) => {
    setIsUploadingGallery(true);
    setError('');
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('image', file);
        data.append('project_title', formData.title || 'Propriété Galerie');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json().catch(() => ({}));
          if (json.url) {
            uploadedUrls.push(json.url);
          }
        }
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’upload des photos de la galerie.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Add Feature
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()],
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx),
    }));
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== idx),
    }));
  };

  // Save property
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.cover_image_url) {
      setError('Veuillez renseigner le titre et l’image de couverture.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/properties/${property.id}` : '/api/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Erreur lors de l’enregistrement de la propriété.');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Échec de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#141416] border border-[#26262b] text-[#f7f6f2] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#26262b] flex items-center justify-between bg-[#101012]">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#c5a880]" />
            <h2 className="text-base font-medium tracking-wide">
              {isEditing
                ? `Modifier la Propriété : ${property.title}`
                : 'Ajouter une Nouvelle Propriété / Maison Clé en Main'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8c827a] hover:text-[#f7f6f2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Titre de la Résidence / Villa *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Villa Solarium — Haute Couture"
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Identifiant URL (Slug)
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="villa-solarium"
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Type, Status, Ready to Move */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Typologie de Bien
              </label>
              <select
                value={formData.property_type || 'Villa'}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              >
                <option value="Villa">Villa Contemporaine</option>
                <option value="Penthouse">Penthouse Prestige</option>
                <option value="Duplex">Duplex d’Architecte</option>
                <option value="Appartement">Appartement Haut Standing</option>
                <option value="Domaine">Domaine Privé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Statut de Disponibilité
              </label>
              <select
                value={formData.status || 'Available'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Available' | 'Reserved' | 'Sold',
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              >
                <option value="Available">Disponible (Available)</option>
                <option value="Reserved">Réservé (Reserved)</option>
                <option value="Sold">Vendu (Sold)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Prêt à Habiter Clé en Main
              </label>
              <div className="flex items-center h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#a39e93]">
                  <input
                    type="checkbox"
                    checked={formData.ready_to_move || false}
                    onChange={(e) => setFormData({ ...formData, ready_to_move: e.target.checked })}
                    className="w-4 h-4 accent-[#c5a880]"
                  />
                  <span>Livraison immédiate meublée</span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Prix Numérique (DZD)
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Prix Affiché Formaté
              </label>
              <input
                type="text"
                value={formData.price_formatted || ''}
                onChange={(e) => setFormData({ ...formData, price_formatted: e.target.value })}
                placeholder="Ex: 85 000 000 DZD"
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c5a880] mb-1.5">
                Ville / Région
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Batna, Algérie"
                className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Architectural Specs (Surface, Bedrooms, Bathrooms, Floors) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#0e0e10] border border-[#26262b]">
            <div>
              <label className="block text-[11px] font-mono text-[#8c827a] mb-1">
                Surface (m²)
              </label>
              <input
                type="number"
                value={formData.area_sqm || 0}
                onChange={(e) => setFormData({ ...formData, area_sqm: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#141416] border border-[#26262b] text-sm text-[#f7f6f2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8c827a] mb-1">
                Chambres / Suites
              </label>
              <input
                type="number"
                value={formData.bedrooms || 0}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#141416] border border-[#26262b] text-sm text-[#f7f6f2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8c827a] mb-1">
                Salles de Bain
              </label>
              <input
                type="number"
                value={formData.bathrooms || 0}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#141416] border border-[#26262b] text-sm text-[#f7f6f2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8c827a] mb-1">
                Niveaux / Étages
              </label>
              <input
                type="number"
                value={formData.floors || 1}
                onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-[#141416] border border-[#26262b] text-sm text-[#f7f6f2]"
              />
            </div>
          </div>

          {/* Row 5: Cover Image & Aspect Ratio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#c5a880]">
                Photo Principale de Couverture *
              </label>
              {/* Ratio toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8c827a]">Format suggéré :</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, aspect_ratio: '16:9' })}
                  className={`px-2 py-0.5 border text-[10px] ${
                    formData.aspect_ratio === '16:9'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'border-[#26262b] text-[#a39e93]'
                  }`}
                >
                  16:9 Paysage
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, aspect_ratio: '9:16' })}
                  className={`px-2 py-0.5 border text-[10px] ${
                    formData.aspect_ratio === '9:16'
                      ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                      : 'border-[#26262b] text-[#a39e93]'
                  }`}
                >
                  9:16 Smartphone Reel
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Cover Preview */}
              {formData.cover_image_url && (
                <div className="w-36 h-24 sm:w-48 sm:h-32 bg-[#0a0a0c] border border-[#26262b] shrink-0 overflow-hidden relative group">
                  <img
                    src={formData.cover_image_url}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[9px] text-[#c5a880] font-mono">
                    {formData.aspect_ratio}
                  </span>
                </div>
              )}

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={formData.cover_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="URL directe de la photo ou téléversez ci-dessous"
                  className="w-full px-3.5 py-2 bg-[#0e0e10] border border-[#26262b] text-xs text-[#f7f6f2]"
                />

                <div className="flex items-center gap-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#1a1a1e] hover:bg-[#25252b] border border-[#33333d] text-xs text-[#c5a880] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {isUploadingCover ? 'Téléversement WebP...' : 'Uploader Cover Photo (R2)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: Multi-Photo Gallery */}
          <div className="space-y-3 pt-4 border-t border-[#26262b]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#c5a880]">
                Galerie Multi-Photos de la Propriété ({formData.gallery?.length || 0})
              </label>

              <div className="flex items-center gap-2">
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleGalleryUpload(e.target.files);
                  }}
                />
                <button
                  type="button"
                  disabled={isUploadingGallery}
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-3 py-1 bg-[#1a1a1e] hover:bg-[#25252b] border border-[#33333d] text-xs text-[#c5a880] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {isUploadingGallery ? 'Upload en cours...' : 'Ajouter des Photos (R2)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            {formData.gallery && formData.gallery.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {formData.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] bg-[#0e0e10] border border-[#26262b] overflow-hidden"
                  >
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-900 text-rose-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6b645b] italic">
                Aucune photo additionnelle dans la galerie. Vous pouvez en téléverser plusieurs.
              </p>
            )}
          </div>

          {/* Row 7: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#c5a880]">
              Description Architecturale & Prestations
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez les volumes, la luminosité, les finitions intérieures et extérieurs de la villa..."
              className="w-full px-3.5 py-2.5 bg-[#0e0e10] border border-[#26262b] text-sm text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
            />
          </div>

          {/* Row 8: Key Features Checklist */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-[#c5a880]">
              Équipements & Matériaux Nobles (Tags)
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Ex: Marbre Travertin, Piscine à débordement, Ascenseur privatif..."
                className="flex-1 px-3.5 py-2 bg-[#0e0e10] border border-[#26262b] text-xs text-[#f7f6f2]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase"
              >
                Ajouter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#1a1a1e] border border-[#28282e] text-xs text-[#c5c0b8] flex items-center gap-2"
                >
                  <span>• {feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-rose-400 hover:text-rose-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#26262b] bg-[#101012] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase text-[#a39e93] hover:text-[#f7f6f2]"
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d6bc96] text-[#0b0b0c] text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la Propriété'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

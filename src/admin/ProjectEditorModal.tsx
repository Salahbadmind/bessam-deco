import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, Sparkles, SlidersHorizontal, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Project, ProjectImage } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

interface ProjectEditorModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (savedProject: Project) => void;
}

export function ProjectEditorModal({ project, isOpen, onClose, onSaveSuccess }: ProjectEditorModalProps) {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    category: project?.category || 'Residential',
    location: project?.location || 'Batna, Algeria',
    year: project?.year || new Date().getFullYear().toString(),
    scope: project?.scope || 'Interior Renovation & Decoration',
    status: project?.status || ('Published' as const),
    featured: project?.featured ?? true,
    description: project?.description || '',
    vision: project?.vision || '',
    transformation: project?.transformation || '',
    materials: project?.materials?.join(', ') || 'Roman Travertine, Fluted European Oak, Brushed Brass',
    cover_image_url: project?.cover_image_url || '',
    before_image_url: project?.before_image_url || '',
    after_image_url: project?.after_image_url || '',
    gallery: project?.gallery || ([] as ProjectImage[]),
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadStats, setUploadStats] = useState<{ [key: string]: any }>({});

  const coverInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Image Upload helper connecting directly to Sharp Image Optimization Pipeline
  const handleFileUpload = async (file: File, targetField: 'cover' | 'before' | 'after' | 'gallery') => {
    try {
      const data = new FormData();
      data.append('image', file);
      data.append('project_title', formData.title || 'Studio Project');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const contentType = res.headers.get('content-type') || '';
      let result: any = {};
      if (contentType.includes('application/json')) {
        try {
          result = await res.json();
        } catch {
          result = {};
        }
      } else {
        const rawText = await res.text().catch(() => '');
        if (!res.ok) {
          throw new Error(`Upload server error (${res.status}): ${rawText.slice(0, 100)}`);
        }
      }

      if (!res.ok) {
        throw new Error(result.error || `Image upload failed (${res.status})`);
      }

      if (!result.url) {
        throw new Error(result.error || 'No image URL returned from server');
      }

      setUploadStats((prev) => ({
        ...prev,
        [targetField]: result.stats,
      }));

      if (targetField === 'cover') {
        setFormData((prev) => ({ ...prev, cover_image_url: result.url }));
      } else if (targetField === 'before') {
        setFormData((prev) => ({ ...prev, before_image_url: result.url }));
      } else if (targetField === 'after') {
        setFormData((prev) => ({ ...prev, after_image_url: result.url }));
      } else if (targetField === 'gallery') {
        const newImg: ProjectImage = {
          id: 'img_' + Date.now(),
          project_id: project?.id || '',
          image_url: result.url,
          alt_text: formData.title + ' Detail',
          sort_order: formData.gallery.length,
        };
        setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, newImg] }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image optimization/upload error');
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Auto slugify if creating new
      slug: !isEditing
        ? newTitle
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        : prev.slug,
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const materialsArray = formData.materials
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        materials: materialsArray,
      };

      const url = isEditing ? `/api/projects/${project!.id}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to save project');
      }

      const saved = await res.json();
      onSaveSuccess(saved);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0b0b0c]/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#141416] border border-[#26262b] shadow-2xl my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#26262b] flex items-center justify-between bg-[#1a1a1d]">
          <div>
            <h3 className="font-editorial text-2xl text-[#f7f6f2]">
              {isEditing ? `Edit Project: ${project!.title}` : 'Create New Architectural Project'}
            </h3>
            <p className="text-[11px] uppercase tracking-widest text-[#a39e93]">
              BESSAM.DECO Portfolio Management
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#a39e93] hover:text-[#f7f6f2]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          {/* 1. Core Identification */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold border-b border-[#26262b] pb-2">
              1. Project Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Villa Aurès Spatial Reimagining"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="villa-aures-spatial-reimagining"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Full Renovation">Full Renovation</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Batna, Algeria"
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Editorial Narrative */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold border-b border-[#26262b] pb-2">
              2. Editorial Narrative & Specifications
            </h4>

            <div className="space-y-1">
              <label className="text-xs text-[#d6d4ce]">Short Summary / Description *</label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0b0b0c] border border-[#26262b] p-3 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">The Vision (Client's Initial Needs)</label>
                <textarea
                  rows={3}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="Client's initial aspirations, lighting needs..."
                  className="w-full bg-[#0b0b0c] border border-[#26262b] p-3 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d6d4ce]">The Transformation (What Was Changed)</label>
                <textarea
                  rows={3}
                  value={formData.transformation}
                  onChange={(e) => setFormData({ ...formData, transformation: e.target.value })}
                  placeholder="Structural removals, custom joinery, lighting redirection..."
                  className="w-full bg-[#0b0b0c] border border-[#26262b] p-3 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#d6d4ce]">Materials & Elements (Comma-separated)</label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="Roman Travertine, Fluted European Oak, Brushed Brass"
                className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Image Pipeline & WebP Optimization */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#26262b] pb-2">
              <h4 className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Image Pipeline (Sharp WebP Target ≤ 100 KB)</span>
              </h4>
              <span className="text-[10px] text-[#8c827a]">Automatic compression & CDN upload</span>
            </div>

            {/* Cover Image */}
            <div className="p-4 bg-[#101012] border border-[#26262b] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#f7f6f2]">Cover Hero Image *</label>
                {uploadStats.cover && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                    {uploadStats.cover.optimizedSizeFormatted} ({uploadStats.cover.reductionPercent}% saved)
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="flex-1 bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                />
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], 'cover');
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-4 py-2 bg-[#1a1a1d] hover:bg-[#2b2b30] text-[#f7f6f2] text-xs border border-[#26262b] flex items-center space-x-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Upload & Optimize</span>
                </button>
              </div>

              {formData.cover_image_url && (
                <div className="relative aspect-[21/9] w-full max-w-sm overflow-hidden border border-[#26262b]">
                  <img
                    src={formData.cover_image_url}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Before & After Images (for interactive transformation slider) */}
            <div className="p-4 bg-[#101012] border border-[#26262b] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#f7f6f2] flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Interactive Before / After Transformation Pair</span>
                </label>
                <span className="text-[10px] text-[#8c827a]">Powers the comparison slider</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* BEFORE IMAGE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#a39e93]">Before Image (Original state)</span>
                    {uploadStats.before && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {uploadStats.before.optimizedSizeFormatted}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.before_image_url}
                    onChange={(e) => setFormData({ ...formData, before_image_url: e.target.value })}
                    className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-1.5 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                  />
                  <input
                    type="file"
                    ref={beforeInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'before');
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => beforeInputRef.current?.click()}
                    className="w-full py-1.5 bg-[#1a1a1d] text-xs text-[#c5a880] border border-[#26262b] flex items-center justify-center space-x-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Before Photo</span>
                  </button>
                </div>

                {/* AFTER IMAGE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#a39e93]">After Image (Finished renovation)</span>
                    {uploadStats.after && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {uploadStats.after.optimizedSizeFormatted}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.after_image_url}
                    onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value })}
                    className="w-full bg-[#0b0b0c] border border-[#26262b] px-3 py-1.5 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none"
                  />
                  <input
                    type="file"
                    ref={afterInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'after');
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => afterInputRef.current?.click()}
                    className="w-full py-1.5 bg-[#1a1a1d] text-xs text-[#c5a880] border border-[#26262b] flex items-center justify-center space-x-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload After Photo</span>
                  </button>
                </div>
              </div>

              {/* Live Before/After Slider Test */}
              {formData.before_image_url && formData.after_image_url && (
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#a39e93] mb-1">
                    Live Transformation Preview:
                  </p>
                  <BeforeAfterSlider
                    beforeImage={formData.before_image_url}
                    afterImage={formData.after_image_url}
                    aspectRatio="aspect-[16/9]"
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="p-4 bg-[#101012] border border-[#26262b] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#f7f6f2]">
                  Gallery Angles & Architectural Details ({formData.gallery.length})
                </label>
                <input
                  type="file"
                  ref={galleryInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], 'gallery');
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="px-3 py-1 bg-[#1a1a1d] text-xs text-[#c5a880] border border-[#26262b] flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Add Gallery Image</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formData.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] bg-[#0b0b0c] border border-[#26262b] group">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-950/80 text-red-300 hover:text-white rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#26262b] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1a1a1d] text-xs text-[#a39e93] hover:text-[#f7f6f2] border border-[#26262b]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#0b0b0c] text-xs font-semibold uppercase tracking-widest transition-colors flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving Project...' : 'Save & Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  FolderOpen,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  X,
  FileCheck,
} from 'lucide-react';
import { MediaItem } from '../types';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  projectTitle?: string;
  mediaList?: MediaItem[];
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  required?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  description = 'Select an image file from your device. It will be automatically optimized and converted to high-quality WebP format (<100KB).',
  projectTitle = 'Studio Asset',
  mediaList = [],
  aspectRatio = '16:9',
  required = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage('');
    setUploadStats(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('project_title', projectTitle);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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
        throw new Error(result.error || `Upload failed with status ${res.status}`);
      }

      if (result.url) {
        onChange(result.url);
        if (result.stats) {
          setUploadStats(result.stats);
        }
      } else {
        throw new Error(result.error || 'No valid image URL returned from upload server');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'Image upload/optimization failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#d6d4ce] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>

        <div className="flex items-center gap-3">
          {mediaList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="text-[11px] text-[#c5a880] hover:text-[#dfc8a8] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3 h-3" />
              <span>Media Library ({mediaList.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#8c827a] hover:text-[#d6d4ce] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL input' : 'URL input'}</span>
          </button>
        </div>
      </div>

      {description && <p className="text-[11px] text-[#8c827a] leading-relaxed">{description}</p>}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/avif,image/tiff"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Main Upload Box / Preview */}
      {value ? (
        /* Image Preview Box */
        <div className="p-3 bg-[#0b0b0c] border border-[#26262b] space-y-3">
          <div className="relative group overflow-hidden bg-[#141416] border border-[#26262b] max-h-56 flex items-center justify-center">
            <img
              src={value}
              alt="Selected Preview"
              className="max-h-52 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                // If broken image
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            {/* Quick Action Overlay on hover */}
            <div className="absolute inset-0 bg-[#0b0b0c]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-1.5 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer hover:bg-[#dfc8a8]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace File</span>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-1.5 shadow-lg cursor-pointer hover:bg-red-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Details & Controls below preview */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-[#a39e93] text-[11px] truncate max-w-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-mono">{value}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1 bg-[#1a1a1d] hover:bg-[#26262b] text-[#c5a880] text-xs border border-[#383842] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    <span>Change File</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2 py-1 text-xs text-[#8c827a] hover:text-red-400 transition-colors cursor-pointer"
                title="Clear image"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Optimization Stats Badge if available */}
          {uploadStats && (
            <div className="p-2.5 bg-[#141416] border border-[#26262b] text-[11px] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Optimized WebP</span>
                </span>
                <span className="text-[#8c827a]">
                  {uploadStats.originalSizeFormatted} →{' '}
                  <strong className="text-[#f7f6f2]">{uploadStats.optimizedSizeFormatted}</strong>
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-semibold">
                -{uploadStats.reductionPercent}% Compressed
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-6 border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${
            isDragOver
              ? 'border-[#c5a880] bg-[#c5a880]/10'
              : 'border-[#383842] bg-[#0b0b0c] hover:border-[#c5a880]/60 hover:bg-[#141416]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-10 h-10 rounded-full bg-[#1a1a1d] border border-[#26262b] mx-auto flex items-center justify-center text-[#c5a880]">
            {isUploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-[#f7f6f2] uppercase tracking-wider">
              {isUploading ? 'Compressing & Uploading WebP...' : 'Select Image from File'}
            </h4>
            <p className="text-[11px] text-[#8c827a]">
              Click to browse your computer/phone, or drag and drop image here
            </p>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#dfc8a8] transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo / File</span>
            </span>
          </div>

          <p className="text-[10px] text-[#635f59] uppercase font-mono">
            JPG, PNG, WEBP, AVIF • Auto-Optimized with Sharp to &lt;100KB
          </p>
        </div>
      )}

      {/* Optional Manual URL Input Toggle */}
      {showUrlInput && (
        <div className="pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... or paste image URL"
              className="flex-1 bg-[#0b0b0c] border border-[#26262b] px-3 py-2 text-xs text-[#f7f6f2] focus:border-[#c5a880] focus:outline-none font-mono"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-red-400 bg-red-950/40 p-2 border border-red-800">
          {errorMessage}
        </p>
      )}

      {/* Media Library Selector Modal */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0b0b0c]/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141416] border border-[#26262b] p-6 max-w-3xl w-full space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#26262b] pb-4">
              <div>
                <h3 className="font-editorial text-2xl text-[#f7f6f2]">
                  Select from Media Library
                </h3>
                <p className="text-xs text-[#a39e93]">
                  Pick an existing high-resolution optimized asset from your studio storage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1.5 text-[#8c827a] hover:text-[#f7f6f2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {mediaList.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#8c827a]">
                  No images uploaded in media library yet. Upload an image above to populate the library.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.image_url);
                        setIsMediaPickerOpen(false);
                      }}
                      className={`group text-left bg-[#0b0b0c] border p-2 space-y-1.5 transition-all cursor-pointer relative ${
                        value === item.image_url
                          ? 'border-[#c5a880] ring-1 ring-[#c5a880]'
                          : 'border-[#26262b] hover:border-[#383842]'
                      }`}
                    >
                      <div className="aspect-video bg-[#141416] overflow-hidden flex items-center justify-center relative">
                        <img
                          src={item.image_url}
                          alt={item.original_name || item.filename}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {value === item.image_url && (
                          <div className="absolute top-1 right-1 bg-[#c5a880] text-[#0b0b0c] p-0.5 rounded-full">
                            <FileCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-[#f7f6f2] font-mono truncate">
                        {item.original_name || item.filename}
                      </p>
                      <p className="text-[10px] text-[#8c827a]">
                        {item.file_size_formatted || 'WebP'} • {item.width}x{item.height}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#26262b]">
              <button
                type="button"
                onClick={() => {
                  setIsMediaPickerOpen(false);
                  fileInputRef.current?.click();
                }}
                className="px-3.5 py-1.5 bg-[#1a1a1d] hover:bg-[#26262b] text-[#c5a880] text-xs border border-[#383842] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File Instead</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-1.5 bg-[#26262b] text-xs text-[#f7f6f2] hover:bg-[#383842]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

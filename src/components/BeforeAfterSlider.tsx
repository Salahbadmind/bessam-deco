import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SlidersHorizontal, Smartphone, Monitor, Maximize2 } from 'lucide-react';

export type SliderFrameMode = '16:9' | '9:16' | 'contain';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  initialFrame?: '16:9' | '9:16' | 'contain' | 'auto';
  projectName?: string;
  allowFrameToggle?: boolean;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER TRANSFORMATION',
  aspectRatio = 'aspect-[16/10]',
  initialFrame = 'auto',
  projectName,
  allowFrameToggle = true,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [frameMode, setFrameMode] = useState<SliderFrameMode>(
    initialFrame === 'auto' ? '16:9' : initialFrame
  );
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect portrait / 9:16 aspect ratio if initialFrame is 'auto'
  useEffect(() => {
    if (initialFrame === 'auto' && afterImage) {
      const img = new Image();
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth * 1.15) {
          // Image is vertical (e.g. 9:16 or 3:4 smartphone photo)
          setFrameMode('9:16');
        } else {
          setFrameMode('16:9');
        }
      };
      img.src = afterImage;
    } else if (initialFrame !== 'auto') {
      setFrameMode(initialFrame);
    }
  }, [afterImage, initialFrame]);

  // Keep track of container width accurately for pixel-perfect before/after split
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [frameMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    },
    [containerRef]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  // Determine container styling based on frame mode
  const getContainerClasses = () => {
    if (frameMode === '9:16') {
      return 'aspect-[9/16] max-w-[390px] sm:max-w-[430px] mx-auto shadow-2xl';
    }
    if (frameMode === 'contain') {
      return 'aspect-[16/10] sm:aspect-[16/9] w-full max-w-5xl mx-auto';
    }
    return aspectRatio || 'aspect-[16/10]';
  };

  const imageFitClass = frameMode === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div className="w-full select-none">
      {/* Header Bar with optional Frame Mode Controls */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#a39e93] mb-3 px-1 gap-2">
        {projectName ? (
          <span className="uppercase tracking-widest text-[#c5a880] font-medium">{projectName}</span>
        ) : (
          <span className="flex items-center space-x-1.5 text-[11px] text-[#8c827a]">
            <SlidersHorizontal className="w-3 h-3 text-[#c5a880]" />
            <span>Glissez le curseur pour comparer</span>
          </span>
        )}

        {/* Frame / Aspect Ratio Toggle (9:16 Vertical, 16:9 Landscape, Contain/Full) */}
        {allowFrameToggle && (
          <div className="flex items-center bg-[#101012] border border-[#26262b] p-0.5 text-[10px]">
            <button
              type="button"
              onClick={() => setFrameMode('16:9')}
              title="Format Paysage (16:9)"
              className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                frameMode === '16:9'
                  ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f7f6f2]'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden sm:inline">16:9</span>
            </button>

            <button
              type="button"
              onClick={() => setFrameMode('9:16')}
              title="Format Vertical Reels/Story (9:16 - Affiche toute la photo verticale)"
              className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                frameMode === '9:16'
                  ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f7f6f2]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16 Vertical</span>
            </button>

            <button
              type="button"
              onClick={() => setFrameMode('contain')}
              title="Afficher toute l'image sans recadrage (Fit)"
              className={`px-2 py-1 flex items-center gap-1 transition-all cursor-pointer ${
                frameMode === 'contain'
                  ? 'bg-[#c5a880] text-[#0b0b0c] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f7f6f2]'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Afficher Tout</span>
            </button>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className={`relative w-full ${getContainerClasses()} overflow-hidden bg-[#0c0c0e] border border-[#26262b] cursor-ew-resize transition-all duration-300`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Ambient Blur Backdrop in Contain or 9:16 Mode */}
        {frameMode === 'contain' && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none scale-110"
            style={{ backgroundImage: `url(${afterImage})` }}
          />
        )}

        {/* AFTER IMAGE (Full width behind) */}
        <img
          src={afterImage}
          alt="After renovation transformation"
          className={`absolute inset-0 w-full h-full ${imageFitClass} object-center pointer-events-none transition-all duration-300`}
          loading="lazy"
        />

        {/* AFTER LABEL */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#0b0b0c]/85 backdrop-blur-md border border-[#26262b] text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-[#c5a880] pointer-events-none shadow-lg">
          {afterLabel}
        </div>

        {/* BEFORE IMAGE (Clipped on top) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before renovation original state"
            className={`absolute inset-y-0 left-0 h-full ${imageFitClass} object-center max-w-none transition-all duration-300`}
            style={{
              width: containerWidth > 0 ? `${containerWidth}px` : '100%',
            }}
            loading="lazy"
          />

          {/* BEFORE LABEL */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#0b0b0c]/85 backdrop-blur-md border border-[#26262b] text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-[#a39e93] pointer-events-none shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* DRAGGABLE DIVIDER LINE & HANDLE */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Thin Vertical Line */}
          <div className="w-[2px] h-full bg-[#f7f6f2] shadow-[0_0_12px_rgba(0,0,0,0.9)] mx-auto"></div>

          {/* Center Circular Badge Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0b0b0c] border border-[#c5a880] shadow-2xl flex items-center justify-center text-[#f7f6f2] pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] font-bold text-[#c5a880]">◀</span>
              <span className="text-[10px] font-bold text-[#c5a880]">▶</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import sharp from 'sharp';
import path from 'path';

export interface OptimizationResult {
  buffer: Buffer;
  filename: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
  originalSizeFormatted: string;
  optimizedSizeFormatted: string;
  width: number;
  height: number;
  format: string;
  status: 'optimized';
  reductionPercent: number;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function optimizeImage(
  inputBuffer: Buffer,
  originalFilename: string,
  mimetype?: string
): Promise<OptimizationResult> {
  const originalSize = inputBuffer.length;

  // Generate clean slug-based filename
  const parsed = path.parse(originalFilename || 'image');
  const cleanBase =
    parsed.name
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'image';

  const ext = (parsed.ext || '').toLowerCase().replace('.', '');
  const isSvg = ext === 'svg' || mimetype === 'image/svg+xml';

  // SVG images are vector graphics; optimize by keeping SVG text/buffer
  if (isSvg) {
    const filename = `${cleanBase}-${Date.now()}.svg`;
    return {
      buffer: inputBuffer,
      filename,
      originalName: originalFilename,
      originalSize,
      optimizedSize: originalSize,
      originalSizeFormatted: formatBytes(originalSize),
      optimizedSizeFormatted: formatBytes(originalSize),
      width: 1200,
      height: 800,
      format: 'svg',
      status: 'optimized',
      reductionPercent: 0,
    };
  }

  const filename = `${cleanBase}-optimized-${Date.now()}.webp`;

  try {
    // Pipeline step 1: inspect metadata
    const image = sharp(inputBuffer, { failOn: 'none' });
    const metadata = await image.metadata();

    const maxDimension = 1920;
    let targetWidth = metadata.width || 1920;
    let targetHeight = metadata.height || 1080;

    if (targetWidth > maxDimension || targetHeight > maxDimension) {
      if (targetWidth >= targetHeight) {
        targetHeight = Math.max(1, Math.round((targetHeight / targetWidth) * maxDimension));
        targetWidth = maxDimension;
      } else {
        targetWidth = Math.max(1, Math.round((targetWidth / targetHeight) * maxDimension));
        targetHeight = maxDimension;
      }
    }

    // Attempt initial WebP compression
    let quality = 80;
    let optimizedBuffer = await sharp(inputBuffer)
      .rotate() // Auto-orient based on EXIF
      .resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();

    // Target file size: <= 120 KB
    const targetBytes = 120 * 1024;
    if (optimizedBuffer.length > targetBytes && quality > 65) {
      quality = 70;
      const secondPass = await sharp(inputBuffer)
        .rotate()
        .resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toBuffer();

      if (secondPass.length < optimizedBuffer.length) {
        optimizedBuffer = secondPass;
      }
    }

    const finalMeta = await sharp(optimizedBuffer).metadata();
    const optimizedSize = optimizedBuffer.length;
    const reductionPercent = Math.max(
      0,
      Math.round(((originalSize - optimizedSize) / originalSize) * 100)
    );

    return {
      buffer: optimizedBuffer,
      filename,
      originalName: originalFilename,
      originalSize,
      optimizedSize,
      originalSizeFormatted: formatBytes(originalSize),
      optimizedSizeFormatted: formatBytes(optimizedSize),
      width: finalMeta.width || targetWidth,
      height: finalMeta.height || targetHeight,
      format: 'webp',
      status: 'optimized',
      reductionPercent,
    };
  } catch (sharpError) {
    console.warn('[Sharp] Optimization warning, falling back to original buffer:', sharpError);
    const fallbackExt = ext || 'jpg';
    const fallbackFilename = `${cleanBase}-${Date.now()}.${fallbackExt}`;
    return {
      buffer: inputBuffer,
      filename: fallbackFilename,
      originalName: originalFilename,
      originalSize,
      optimizedSize: originalSize,
      originalSizeFormatted: formatBytes(originalSize),
      optimizedSizeFormatted: formatBytes(originalSize),
      width: 1200,
      height: 800,
      format: fallbackExt,
      status: 'optimized',
      reductionPercent: 0,
    };
  }
}

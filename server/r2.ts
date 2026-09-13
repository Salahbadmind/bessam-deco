import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

let s3Client: S3Client | null = null;

function getR2Client(): S3Client | null {
  const accountId =
    process.env.R2_ACCOUNT_ID ||
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    process.env.CLOUDFLARE_R2_ACCOUNT_ID;

  const accessKeyId =
    process.env.R2_ACCESS_KEY_ID ||
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
    process.env.CLOUDFLARE_ACCESS_KEY_ID;

  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY ||
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
    process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

  if (accountId && accessKeyId && secretAccessKey) {
    if (!s3Client) {
      s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
    return s3Client;
  }
  return null;
}

export async function uploadImageToStorage(
  buffer: Buffer,
  filename: string,
  contentType = 'image/webp'
): Promise<{ url: string; storageProvider: 'cloudflare_r2' | 'local_cdn' | 'inline_data' }> {
  const client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_CUSTOM_DOMAIN;
  const accountId = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;

  if (client && bucketName) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      });
      await client.send(command);

      const cdnUrl = publicUrl
        ? `${publicUrl.replace(/\/$/, '')}/${filename}`
        : `https://${bucketName}.${accountId}.r2.dev/${filename}`;

      return {
        url: cdnUrl,
        storageProvider: 'cloudflare_r2',
      };
    } catch (err) {
      console.warn('R2 upload failed, falling back to local storage:', err);
    }
  }

  // Fallback: save to public/uploads directory
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      storageProvider: 'local_cdn',
    };
  } catch (fsErr) {
    console.warn('[Storage] Could not write to /public/uploads, using inline base64 fallback:', fsErr);
    const base64 = buffer.toString('base64');
    return {
      url: `data:${contentType};base64,${base64}`,
      storageProvider: 'inline_data',
    };
  }
}

export function extractStorageKey(urlOrFilename: string): string {
  if (!urlOrFilename) return '';
  const trimmed = urlOrFilename.trim();
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const parsed = new URL(trimmed);
      return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
    }
  } catch {
    // Fallback if URL parsing fails
  }
  if (trimmed.startsWith('/uploads/')) {
    return trimmed.replace(/^\/uploads\//, '');
  }
  // Strip any leading query string or hash
  const clean = trimmed.split('?')[0].split('#')[0];
  const parts = clean.split('/');
  return decodeURIComponent(parts[parts.length - 1]);
}

export function isManagedStorageUrl(urlOrFilename: string): boolean {
  if (!urlOrFilename) return false;
  const str = urlOrFilename.toLowerCase();
  // Check if it belongs to Cloudflare R2, custom public URL, or local uploads
  const publicUrl = (process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_CUSTOM_DOMAIN || '').toLowerCase();
  const bucketName = (process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || '').toLowerCase();

  if (str.startsWith('/uploads/')) return true;
  if (str.includes('.r2.dev')) return true;
  if (str.includes('.r2.cloudflarestorage.com')) return true;
  if (publicUrl && str.startsWith(publicUrl)) return true;
  if (bucketName && str.includes(bucketName)) return true;

  // Unsplash or external third-party images should not be treated as user storage
  if (str.includes('unsplash.com') || str.includes('pexels.com')) {
    return false;
  }

  // If it's a relative filename like 'something-optimized-123.webp'
  if (!str.startsWith('http://') && !str.startsWith('https://') && str.endsWith('.webp')) {
    return true;
  }

  return false;
}

export async function deleteImageFromStorage(urlOrFilename: string): Promise<boolean> {
  if (!urlOrFilename) return false;

  const key = extractStorageKey(urlOrFilename);
  if (!key) return false;

  let deletedAny = false;
  const client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME;

  // 1. Delete from Cloudflare R2 bucket if client is available
  if (client && bucketName) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await client.send(command);
      console.log(`[Cloudflare R2] Successfully purged object: ${key}`);
      deletedAny = true;
    } catch (err) {
      console.warn(`[Cloudflare R2] Failed to delete object ${key}:`, err);
    }
  }

  // 2. Also remove from local public/uploads directory if present
  const localPath = path.join(process.cwd(), 'public', 'uploads', key);
  if (fs.existsSync(localPath)) {
    try {
      fs.unlinkSync(localPath);
      console.log(`[Local Storage] Removed local file: ${localPath}`);
      deletedAny = true;
    } catch (err) {
      console.error(`[Local Storage] Error deleting local file ${localPath}:`, err);
    }
  }

  return deletedAny;
}

export async function deleteMultipleImagesFromStorage(
  urlsOrFilenames: (string | null | undefined)[]
): Promise<number> {
  const uniqueItems = Array.from(
    new Set(
      urlsOrFilenames
        .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
        .map((u) => u.trim())
    )
  );

  let successCount = 0;
  for (const item of uniqueItems) {
    try {
      const ok = await deleteImageFromStorage(item);
      if (ok) successCount++;
    } catch (err) {
      console.warn('Failed to delete image:', item, err);
    }
  }
  return successCount;
}

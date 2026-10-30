import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { ApiError } from './ApiError.js';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

/* ------------------------------------------------------------------ limits */
export const LIMITS = {
  avatar: {
    bucket: 'avatars',
    maxBytes: 2 * 1024 * 1024,            // 2 MB upload
    types: ['jpeg', 'png', 'webp'],       // no GIF avatars
    minSide: 64,                          // reject tiny images
    outSide: 512,                         // stored as a 512x512 square
  },
  post: {
    bucket: 'post-images',
    maxBytes: 5 * 1024 * 1024,            // 5 MB upload
    types: ['jpeg', 'png', 'webp', 'gif'],
    minSide: 16,
    outSide: 1600,                        // longest side after resize
  },
};

// Refuse "decompression bombs": a tiny file that expands to a gigantic bitmap
const MAX_INPUT_PIXELS = 25_000_000;

/* --------------------------------------------------------------- detection */
/** Identify the real image format from the file header; the declared mime type is not trusted. */
export function sniffImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
  return null;
}

/**
 * Validate and normalise an uploaded image.
 *  - real format check (magic bytes) against the allowed list
 *  - must decode as an image, within the pixel budget, at least `minSide` wide/tall
 *  - EXIF orientation applied, then ALL metadata (GPS location, camera, etc.) stripped
 *  - resized (avatars: cropped to a 512px square; posts: longest side 1600px)
 *  - re-encoded as WebP, which is typically 25-60% smaller than the original
 */
export async function processImage(buffer, kind) {
  const cfg = LIMITS[kind];
  if (!buffer || buffer.length === 0) throw ApiError.badRequest('The uploaded file is empty');
  if (buffer.length > cfg.maxBytes) {
    throw ApiError.badRequest(`Image too large. The maximum is ${cfg.maxBytes / (1024 * 1024)} MB.`);
  }

  const type = sniffImageType(buffer);
  if (!type || !cfg.types.includes(type)) {
    throw ApiError.badRequest(`Unsupported image. Please upload a ${cfg.types.map((t) => t.toUpperCase()).join(', ')} file.`);
  }

  try {
    const animated = type === 'gif' && kind === 'post';
    let img = sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error', animated });
    const meta = await img.metadata();
    const width = meta.width || 0;
    const height = (animated ? meta.pageHeight : meta.height) || 0;
    if (width < cfg.minSide || height < cfg.minSide) {
      throw ApiError.badRequest(`Image is too small. It must be at least ${cfg.minSide}x${cfg.minSide} pixels.`);
    }

    img = img.rotate(); // honour EXIF orientation, then output carries no metadata
    img = kind === 'avatar'
      ? img.resize(cfg.outSide, cfg.outSide, { fit: 'cover', position: 'attention' })
      : img.resize({ width: cfg.outSide, height: cfg.outSide, fit: 'inside', withoutEnlargement: true });

    const out = await img.webp({ quality: kind === 'avatar' ? 82 : 80, effort: 4 }).toBuffer();
    return { buffer: out, contentType: 'image/webp', ext: 'webp', bytes: out.length };
  } catch (err) {
    if (err instanceof ApiError || err.statusCode) throw err;
    logger.warn('Image rejected', { message: err.message });
    throw ApiError.badRequest('That file is not a valid image, or it is too large to process.');
  }
}

/* ----------------------------------------------------------------- storage */
const supabaseUrl = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const storageConfigured = () => Boolean(supabaseUrl() && serviceKey());

const publicUrl = (bucket, objectPath) => `${supabaseUrl()}/storage/v1/object/public/${bucket}/${objectPath}`;

/**
 * Store a processed image and return its public URL.
 * Supabase Storage when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set (the
 * service-role key never leaves the server); otherwise the local uploads/ folder,
 * so development works without any account.
 */
export async function storeImage(buffer, { kind, userId, contentType = 'image/webp', ext = 'webp' }) {
  const bucket = LIMITS[kind].bucket;
  const name = `${userId}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

  if (storageConfigured()) {
    const res = await fetch(`${supabaseUrl()}/storage/v1/object/${bucket}/${name}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey()}`,
        apikey: serviceKey(),
        'Content-Type': contentType,
        'Cache-Control': 'max-age=31536000',
        'x-upsert': 'false',
      },
      body: buffer,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      logger.error('Supabase Storage upload failed', { status: res.status, detail: detail.slice(0, 300) });
      throw ApiError.badRequest('Could not store the image. Please try again.');
    }
    return publicUrl(bucket, name);
  }

  const dir = path.join(uploadsDir, bucket, String(userId));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, path.basename(name)), buffer);
  return `/uploads/${bucket}/${name}`;
}

/** Best-effort delete of an image we stored earlier (never throws). */
export async function deleteStoredImage(url) {
  try {
    if (!url) return;
    if (storageConfigured() && url.startsWith(`${supabaseUrl()}/storage/v1/object/public/`)) {
      const rest = url.slice(`${supabaseUrl()}/storage/v1/object/public/`.length); // bucket/obj/path
      await fetch(`${supabaseUrl()}/storage/v1/object/${rest}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${serviceKey()}`, apikey: serviceKey() },
      });
    } else if (url.startsWith('/uploads/')) {
      const abs = path.join(uploadsDir, url.slice('/uploads/'.length));
      if (abs.startsWith(uploadsDir)) await fs.unlink(abs);
    }
  } catch (err) {
    logger.warn('Could not delete old image', { message: err.message });
  }
}

/** Validate -> resize -> store. Returns the public URL. */
export async function saveUpload(file, kind, userId) {
  const processed = await processImage(file.buffer, kind);
  return storeImage(processed.buffer, { kind, userId, contentType: processed.contentType, ext: processed.ext });
}

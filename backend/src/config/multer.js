import multer from 'multer';
import { LIMITS } from '../utils/uploadService.js';

// Memory storage: the buffer is validated, resized and re-encoded by
// utils/uploadService.js before anything is stored.
const storage = multer.memoryStorage();

function imageFilter(allowed) {
  return (req, file, cb) => {
    if (allowed.includes(file.mimetype)) return cb(null, true);
    // First line of defence only: the real format is checked again from the file header
    cb(new Error(`Only image files are allowed (${allowed.map((m) => m.replace('image/', '').toUpperCase()).join(', ')})`), false);
  };
}

/** Post images: one file, 5 MB. */
export const upload = multer({
  storage,
  fileFilter: imageFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: LIMITS.post.maxBytes, files: 1, fields: 20, parts: 25 },
});

/** Profile photos: one file, 2 MB, JPEG/PNG/WebP only. */
export const avatarUpload = multer({
  storage,
  fileFilter: imageFilter(['image/jpeg', 'image/png', 'image/webp']),
  limits: { fileSize: LIMITS.avatar.maxBytes, files: 1, fields: 5, parts: 8 },
});

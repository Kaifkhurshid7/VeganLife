import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

// Cloudinary when configured; otherwise write to the local uploads/ dir so local
// dev keeps working without an account.
const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME
  && process.env.CLOUDINARY_API_KEY
  && process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'veganlife', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

// Returns a public image URL for a multer file.
export async function uploadImage(file) {
  if (isConfigured) {
    const result = await uploadBuffer(file.buffer);
    return result.secure_url;
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  await fs.writeFile(path.join(uploadsDir, filename), file.buffer);
  return `/uploads/${filename}`;
}

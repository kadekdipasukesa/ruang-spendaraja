/* global process */
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'cjt4xpst',
  api_key: process.env.CLOUDINARY_API_KEY || '646749617121989',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Tvd_jQ0prLApU09DlY0OC1XiaEo',
  secure: true,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      status: 'error',
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const { image, userId } = req.body || {};
    if (!image || !userId) {
      return res.status(400).json({
        status: 'error',
        error: 'Data gambar dan userId wajib disertakan.',
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'photo_profile',
      public_id: `profil_${userId}`,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    });

    return res.status(200).json({
      status: 'success',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      version: uploadResult.version,
    });
  } catch (err) {
    console.error('Error uploading profile photo to Cloudinary in Vercel function:', err);
    return res.status(500).json({
      status: 'error',
      error: 'Gagal mengunggah foto profil: ' + (err.message || err.toString()),
    });
  }
}

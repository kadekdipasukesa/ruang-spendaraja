/* global process */
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'cjt4xpst',
  api_key: process.env.CLOUDINARY_API_KEY || '646749617121989',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Tvd_jQ0prLApU09DlY0OC1XiaEo',
  secure: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      status: 'error',
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        error: 'userId wajib disertakan.',
      });
    }

    const publicId = `photo_profile/profil_${userId}`;
    const destroyResult = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    return res.status(200).json({
      status: 'success',
      result: destroyResult.result,
    });
  } catch (err) {
    console.error('Error destroying profile photo in Cloudinary in Vercel function:', err);
    return res.status(500).json({
      status: 'error',
      error: 'Gagal menghapus foto dari Cloudinary: ' + (err.message || err.toString()),
    });
  }
}

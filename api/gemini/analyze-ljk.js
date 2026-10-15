/* global process */
import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API Key Gemini (GEMINI_API_KEY) belum dikonfigurasi di environment server!',
      });
    }

    const { imageBase64, mimeType } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({
        error: 'Gambar LJK tidak ditemukan dalam data request.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
      Analisis Lembar Jawaban Ujian (LJK) dari SMP Negeri 2 Singaraja ini.
      Siswa menjawab pilihan ganda menggunakan tanda silang (X) atau coretan pena di dalam kolom huruf A, B, C, atau D.
      
      Tugasmu adalah mengekstrak data dari gambar dan wajib menghasilkan format JSON murni dengan struktur berikut:
      {
        "jawaban_pilihan_ganda": {
          "1": "D",
          "2": "A",
          "3": "A",
          ... sampai nomor "50"
        },
        "jawaban_essay": {
          "1": "teks jawaban nomor 1",
          "2": "teks jawaban nomor 2"
        }
      }

      PERATURAN PEMBACAAN GAMBAR:
      1. Teliti kolom nomor 1 sampai 50. Cari tahu di huruf mana tanda silang (X) atau coretan pena itu berada, lalu masukkan huruf kapital tersebut (A, B, C, atau D) sebagai value.
      2. Jangan biarkan objek "jawaban_pilihan_ganda" kosong! Kamu harus membaca tanda coretan tangan tersebut secara kontekstual.
      3. Transkripsikan bagian essay nomor 1 dan 2 sebisamu dari tulisan tangan di bawah kertas.
    `;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Tidak ada teks hasil dari model Gemini.');
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error analyzing LJK with Gemini on Vercel:', error);
    return res.status(500).json({
      error: error.message || 'Gagal menganalisis LJK dengan Gemini.',
    });
  }
}

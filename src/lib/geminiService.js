// src/lib/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeLJKWithGemini = async (imageFile) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key Gemini belum dikonfigurasi di file .env!");
  }

  console.log("=== 🔍 [GEMINI DEBUG] SOLUSI TANPA SCHEMA - MODE JSON MURNI ===");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imagePart = await fileToGenerativePart(imageFile);

    // Prompt dibuat super ketat dan memaksa AI mengisi data dari nomor 1-50
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

    // Kita copot responseSchema agar Vision AI tidak mengalami disorientasi spasial,
    // tapi responseMimeType tetap dijaga agar outputnya 100% JSON valid.
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            imagePart,
            { text: promptText }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    console.log("⏳ [GEMINI DEBUG] Menunggu respon dari server...");
    const response = await result.response;
    const jsonText = response.text();
    
    console.log("📥 [GEMINI DEBUG] Teks mentah berhasil keluar:");
    console.log(jsonText);

    return JSON.parse(jsonText);

  } catch (error) {
    console.error("❌ [GEMINI DEBUG ERROR] Gagal mengekstraksi LJK:", error);
    throw error;
  }
};
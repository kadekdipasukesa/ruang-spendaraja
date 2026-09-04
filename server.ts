import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware JSON dengan limit 25MB untuk payload scan LJK
  app.use(express.json({ limit: "25mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Ruang Spendaraja" });
  });

  // Server-side Gemini API endpoint untuk ekstraksi LJK
  app.post("/api/gemini/analyze-ljk", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "API Key Gemini (GEMINI_API_KEY) belum dikonfigurasi di environment server!",
        });
      }

      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) {
        return res.status(400).json({
          error: "Gambar LJK tidak ditemukan dalam data request.",
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
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
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
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Tidak ada teks hasil dari model Gemini.");
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error("❌ [SERVER GEMINI ERROR]:", error);
      res.status(500).json({
        error: error.message || "Gagal menganalisis LJK dengan Gemini.",
      });
    }
  });

  // Vite middleware untuk development vs static files untuk production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express v5 syntax untuk SPA catch-all
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

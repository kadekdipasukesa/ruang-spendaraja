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

  // Endpoint untuk mengambil metadata OpenGraph Link Preview seperti WhatsApp
  app.get("/api/link-preview", async (req, res) => {
    try {
      const rawUrl = req.query.url as string;
      if (!rawUrl || typeof rawUrl !== "string") {
        return res.status(400).json({ error: "Parameter url wajib diisi." });
      }

      let targetUrl = rawUrl.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
      }

      const parsedUrl = new URL(targetUrl);
      const hostname = parsedUrl.hostname.toLowerCase();

      // Keamanan: Tolak private network / loopback
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.endsWith(".internal")
      ) {
        return res.status(400).json({ error: "Alamat URL lokal tidak diizinkan." });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      // Penanganan khusus YouTube melalui oEmbed API resmi
      if (hostname.includes("youtube.com") || hostname === "youtu.be") {
        try {
          const ytRes = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`,
            { signal: controller.signal }
          );
          if (ytRes.ok) {
            const ytData = (await ytRes.json()) as any;
            clearTimeout(timeout);
            return res.json({
              url: targetUrl,
              domain: "youtube.com",
              title: ytData.title || "Video YouTube",
              description: ytData.author_name ? `Channel: ${ytData.author_name}` : "Tonton video di YouTube",
              image: ytData.thumbnail_url || null,
              siteName: "YouTube",
              isVideo: true,
            });
          }
        } catch {
          // Lanjutkan jika oEmbed gagal
        }
      }

      // Deteksi jika link merupakan file gambar langsung
      if (
        /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(targetUrl)
      ) {
        clearTimeout(timeout);
        const fileName = decodeURIComponent(targetUrl.split("/").pop()?.split("?")[0] || "Gambar");
        return res.json({
          url: targetUrl,
          domain,
          title: fileName,
          description: "Pratinjau File Gambar",
          image: targetUrl,
          siteName: domain,
        });
      }

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 WhatsApp/2.24",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });
      clearTimeout(timeout);

      const contentType = response.headers.get("content-type") || "";
      const domain = hostname.replace(/^www\./, "");

      if (contentType.startsWith("image/")) {
        return res.json({
          url: targetUrl,
          domain,
          title: domain,
          description: "File Gambar",
          image: targetUrl,
          siteName: domain,
        });
      }

      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        return res.json({
          url: targetUrl,
          domain,
          title: domain,
          description: targetUrl,
          image: `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=600`,
          siteName: domain,
        });
      }

      // Ambil hingga 300KB HTML untuk efisiensi pembacaan meta tag
      const reader = response.body?.getReader();
      let html = "";
      if (reader) {
        let receivedBytes = 0;
        const maxBytes = 300 * 1024;
        while (receivedBytes < maxBytes) {
          const { done, value } = await reader.read();
          if (done) break;
          html += new TextDecoder("utf-8").decode(value, { stream: true });
          receivedBytes += value.length;
        }
        reader.cancel().catch(() => {});
      } else {
        html = await response.text();
      }

      const getMeta = (propName: string) => {
        const regex1 = new RegExp(
          `<meta[^>]+(?:property|name)=["'](?:og:|twitter:)?${propName}["'][^>]+content=["']([^"']+)["']`,
          "i"
        );
        const regex2 = new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:|twitter:)?${propName}["']`,
          "i"
        );
        const match = html.match(regex1) || html.match(regex2);
        return match ? match[1].trim() : null;
      };

      const getImageMeta = () => {
        const patterns = [
          /<meta[^>]+property=["'](?:og:image|og:image:url|og:image:secure_url|twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:image|og:image:url|og:image:secure_url|twitter:image|twitter:image:src)["']/i,
          /<meta[^>]+name=["'](?:og:image|twitter:image|twitter:image:src|thumbnail)["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+name=["'](?:og:image|twitter:image|twitter:image:src|thumbnail)["']/i,
          /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
        ];
        for (const p of patterns) {
          const m = html.match(p);
          if (m && m[1] && !m[1].startsWith("data:")) return m[1].trim();
        }
        return null;
      };

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

      let title = getMeta("title") || (titleMatch ? titleMatch[1].trim() : domain);
      let description = getMeta("description") || "";
      let image = getImageMeta();
      const siteName = getMeta("site_name") || domain;

      // Jika web tidak menyediakan og:image, gunakan screenshot mShots WordPress
      if (!image) {
        image = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=600`;
      }

      const decodeHtml = (str: string) =>
        str
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&ndash;/g, "–")
          .replace(/&mdash;/g, "—")
          .replace(/&nbsp;/g, " ");

      if (title) title = decodeHtml(title);
      if (description) description = decodeHtml(description);

      if (image && !image.startsWith("http")) {
        try {
          image = new URL(image, targetUrl).toString();
        } catch {
          image = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=600`;
        }
      }

      return res.json({
        url: targetUrl,
        domain,
        title: title || domain,
        description: description
          ? description.length > 150
            ? description.slice(0, 150) + "..."
            : description
          : "",
        image,
        siteName: siteName || domain,
      });
    } catch (err: any) {
      try {
        const rawUrl = req.query.url as string;
        const targetUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
        const parsedUrl = new URL(targetUrl);
        const domain = parsedUrl.hostname.replace(/^www\./, "");
        return res.json({
          url: targetUrl,
          domain,
          title: domain,
          description: targetUrl,
          image: null,
          siteName: domain,
        });
      } catch {
        return res.status(500).json({ error: "Gagal memproses link preview." });
      }
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

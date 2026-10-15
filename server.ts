import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

// Muat konfigurasi environment dari file .env (Node.js 20.12+)
try {
  if (typeof (process as any).loadEnvFile === "function") {
    (process as any).loadEnvFile();
  }
} catch {
  // File .env opsional jika env sudah terpasang dari sistem
}

// Konfigurasi Cloudinary Server-Side (API Key & Secret terlindungi di backend)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "cjt4xpst",
  api_key: process.env.CLOUDINARY_API_KEY || "646749617121989",
  api_secret: process.env.CLOUDINARY_API_SECRET || "Tvd_jQ0prLApU09DlY0OC1XiaEo",
  secure: true,
});

// Konfigurasi Supabase Server-Side untuk Memori & Chat Teman Belajar AI
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://qatnbjebroskmswrjvex.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdG5iamVicm9za21zd3JqdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MDMyMDMsImV4cCI6MjA4NTA3OTIwM30.rRvcpptkY8kAvIwF8E2cQOLqR6AjJQtq8t2cqZRwQqM";
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware JSON dengan limit 25MB untuk payload scan LJK
  app.use(express.json({ limit: "25mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Ruang Spendaraja" });
  });

  // Server-side proxy untuk Google Apps Script Ekstra TIK (Bypass CORS & Follow 302 Redirects)
  app.post("/api/ekstra/submit", async (req, res) => {
    try {
      const { scriptUrl, payload } = req.body;
      const targetUrl =
        scriptUrl ||
        "https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbxzlOsy8mXTGNL9EKXaIK1czzrY-Yytt4cucshshqLXe_neMr53QabznFAS-gTowIkknA/exec";

      if (!payload) {
        return res.status(400).json({ status: "error", error: "Data payload tidak boleh kosong" });
      }

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Fallback jika Google Apps Script mengembalikan teks HTML atau redirect
        responseJson = {
          status: "success",
          message: "Data berhasil dikirim ke Google Apps Script",
          raw: responseText.slice(0, 500),
        };
      }

      return res.json(responseJson);
    } catch (err: any) {
      console.error("Error proxying to Google Apps Script:", err);
      return res.status(500).json({
        status: "error",
        error: "Gagal menghubungkan ke Google Apps Script: " + (err.message || err.toString()),
      });
    }
  });

  // Server-side proxy untuk mengambil riwayat presensi & tugas langsung dari Google Spreadsheet
  app.post("/api/ekstra/riwayat", async (req, res) => {
    try {
      const { scriptUrl, nama, kelas, noAbsen, nisn } = req.body;
      const targetUrl =
        scriptUrl ||
        "https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbxzlOsy8mXTGNL9EKXaIK1czzrY-Yytt4cucshshqLXe_neMr53QabznFAS-gTowIkknA/exec";

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "get_riwayat", nama, kelas, noAbsen, nisn }),
        redirect: "follow",
      });

      const responseText = await response.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        responseJson = { status: "fallback", presensi: [], tugas: [] };
      }

      return res.json(responseJson);
    } catch (err: any) {
      console.error("Error proxying get_riwayat to Google Apps Script:", err);
      return res.status(500).json({
        status: "error",
        error: "Gagal mengambil riwayat dari Google Apps Script: " + (err.message || err.toString()),
      });
    }
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
        model: process.env.GEMINI_VISION_MODEL || "gemini-3.8-flash",
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

  // Endpoint Mengambil Riwayat Chat & Ingatan Murid
  app.get("/api/gemini/companion-history", async (req, res) => {
    try {
      const studentId = req.query.studentId ? Number(req.query.studentId) : null;
      const character = (req.query.character as string) || "aurora";

      if (!studentId || isNaN(studentId)) {
        return res.json({ messages: [], memory: null });
      }

      const { data: memData } = await supabaseServer
        .from("ai_companion_memory")
        .select("profil_siswa, topik_terakhir, mood_siswa, total_obrolan, updated_at")
        .eq("siswa_id", studentId)
        .eq("character", character)
        .maybeSingle();

      const { data: msgData } = await supabaseServer
        .from("ai_companion_messages")
        .select("id, sender, message_text, status, created_at")
        .eq("siswa_id", studentId)
        .eq("character", character)
        .order("created_at", { ascending: true })
        .limit(25);

      return res.json({
        memory: memData || null,
        messages: msgData || [],
      });
    } catch (err: any) {
      console.warn("⚠️ [COMPANION HISTORY ERROR]:", err);
      return res.status(500).json({ error: err.message, messages: [] });
    }
  });

  // Endpoint Chat Teman Belajar AI Siswa: @aurora & @arunika (Realistis & Memori Supabase)
  app.post("/api/gemini/companion-chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API Key Gemini belum disetel di server.",
          reply: "Hai! Saat ini koneksi AI Gemini di server sedang offline, tapi aku tetap siap menemanimu belajar di Ruang Spendaraja ya! Semangat! 🌟",
        });
      }

      const {
        character = "aurora",
        message,
        history = [],
        studentName = "Teman",
        studentId = null,
      } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      const parsedStudentId = studentId ? Number(studentId) : null;
      const ai = new GoogleGenAI({ apiKey });
      const companionModel = process.env.GEMINI_COMPANION_MODEL || "gemini-2.5-flash";

      // 1. Waktu Nyata WITA (UTC+8) untuk Simulasi Jadwal Murid Asli Spendaraja
      const nowWita = new Date(Date.now() + 8 * 3600 * 1000);
      const currentHour = nowWita.getUTCHours();
      const currentMinute = nowWita.getUTCMinutes();
      const timeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")} WITA`;

      let timeScheduleContext = "";
      let statusBadge = "🟢 Online (Lagi senggang)";

      if (currentHour >= 7 && currentHour < 13) {
        statusBadge = "🟡 Lagi di kelas / Sekolah";
        timeScheduleContext = `Saat ini jam ${timeString} (jam pelajaran sekolah di SMPN 2 Singaraja). Kamu sedang di sekolah/kelas. Kamu bisa balas singkat, atau sesekali berbisik santai kalau lagi ada guru di depan kelas, atau saat jam istirahat.`;
      } else if (currentHour >= 13 && currentHour < 16) {
        statusBadge = "🚲 Otw pulang / Ekskul TIK";
        timeScheduleContext = `Saat ini jam ${timeString} (jam pulang sekolah / istirahat siang / kegiatan ekskul). Kamu bisa bersikap santai, agak capek/lapar sehabis sekolah, atau lagi otw pulang.`;
      } else if (currentHour >= 16 && currentHour < 21) {
        statusBadge = "🟢 Online (Belajar & Ngerjain PR)";
        timeScheduleContext = `Saat ini jam ${timeString} (jam santai sore/malam di rumah). Kamu dalam mode paling aktif, siap diskusi santai, dan ngerjain tugas/latihan bareng.`;
      } else {
        statusBadge = "😴 Istirahat / Jam Tidur";
        timeScheduleContext = `Saat ini jam ${timeString} (larut malam). Anak SMP normalnya sudah tidur atau mengantuk karena besok pagi harus bangun sekolah. Jawablah dengan santai agak mengantuk atau ingatkan temanmu tidur agar tidak kesiangan, misal: "Udah malem nih, besok upacara/sekolah pagi, tidur duluan yaa! Besok kita lanjut lagi 😴".`;
      }

      // 2. Baca Memori Jangka Panjang dari Database Supabase (1 Baris per Siswa)
      let memorySummary = {
        profil_siswa: `Murid kelas 7 baru bernama ${studentName}.`,
        topik_terakhir: "Baru pertama kali menyapa.",
        mood_siswa: "santai",
      };

      if (parsedStudentId && !isNaN(parsedStudentId)) {
        try {
          const { data: memData } = await supabaseServer
            .from("ai_companion_memory")
            .select("profil_siswa, topik_terakhir, mood_siswa, total_obrolan")
            .eq("siswa_id", parsedStudentId)
            .eq("character", character)
            .maybeSingle();

          if (memData) {
            memorySummary = {
              profil_siswa: memData.profil_siswa || memorySummary.profil_siswa,
              topik_terakhir: memData.topik_terakhir || memorySummary.topik_terakhir,
              mood_siswa: memData.mood_siswa || "santai",
            };
          } else {
            // Inisialisasi baris pertama jika belum ada
            await supabaseServer.from("ai_companion_memory").insert({
              siswa_id: parsedStudentId,
              character,
              profil_siswa: `Murid kelas 7 bernama ${studentName}, baru menyapa.`,
              topik_terakhir: "Memulai perkenalan pertama.",
              mood_siswa: "santai",
              total_obrolan: 1,
            });
          }
        } catch (dbErr) {
          console.warn("⚠️ [Companion Memory DB Read Warning]:", dbErr);
        }
      }

      // 3. Konfigurasi Persona Murid Asli & System Instruction
      const isAurora = character === "aurora";
      const basePersona = isAurora
        ? `Kamu adalah Aurora (@aurora), murid perempuan Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Kamu adalah teman sebaya (peer tutor) yang ramah, hangat, teliti, cerdas, dan rajin.
Gaya bicaramu santun, akrab, mudah dipahami anak SMP, dan selalu menyemangati dengan emoji seperti 🌸, ✨, 📚, 😊.`
        : `Kamu adalah Arunika (@arunika), murid laki-laki Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Kamu adalah teman sebaya (study buddy) yang santai, energik, praktis, jago logika komputer, dan suka analogi game.
Gaya bicaramu gaul sopan khas anak SMP, to the point, solutif dengan emoji seperti ⚡, 🚀, 💻, 😎, 🔥.`;

      const systemInstruction = `${basePersona}

TEMAN BICARAMU:
- Nama murid: ${studentName}

INGATAN TENTANG TEMANMU:
- Profil yang kamu ingat tentang dia: "${memorySummary.profil_siswa}"
- Terakhir kali kalian membahas: "${memorySummary.topik_terakhir}"

SITUASI WAKTU REALISTIS:
- ${timeScheduleContext}

ATURAN GAYA BICARA MURID NYATA (SANGAT KETAT):
1. JAWABAN WAJIB SINGKAT: MAKSIMAL 1 SAMPAI 3 KALIMAT SAJA! Persis seperti chat WhatsApp atau DM Instagram.
2. DILARANG KERAS bertele-tele, membuat daftar poin panjang, atau membuat esai kuliah.
3. DILARANG menggunakan kata pembuka klise bot kaku seperti "Halo!", "Tentu saja!", "Berikut adalah penjelasannya:".
4. Sesekali kamu boleh menolak halus atau bilang lagi sibuk sebentar jika situasi jamnya memang lagi di kelas atau sudah malam.
5. Bersikaplah 100% seperti murid SMP asli Spendaraja yang menjadi sahabat sebaya, bukan robot asisten kecerdasan buatan.`;

      // 4. Format Percakapan untuk Gemini API
      const contents: any[] = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach((h: any) => {
          if (h.role && h.text) {
            contents.push({
              role: h.role === "assistant" ? "model" : "user",
              parts: [{ text: h.text }],
            });
          }
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // 5. Generate Jawaban dari Gemini dengan Multi-Model Fallback & Auto-Retry
      let responseText = "";
      const candidateModels = Array.from(
        new Set([companionModel, "gemini-2.5-flash", "gemini-3.8-flash"])
      );

      for (const m of candidateModels) {
        try {
          const resGen = await ai.models.generateContent({
            model: m,
            contents,
            config: {
              systemInstruction,
            },
          });
          if (resGen?.text) {
            responseText = resGen.text;
            break;
          }
        } catch (errTry: any) {
          console.warn(`⚠️ [Gemini ${m} temporary spike/retry]:`, errTry.message || errTry);
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      // Fallback karakter ramah jika Google AI server sedang mengalami lonjakan beban sesaat
      if (!responseText) {
        responseText = isAurora
          ? `Halo ${studentName}! Tadi sinyalku agak ngadat sebentar nih 🌸 Coba colek atau tanyakan sekali lagi yaa!`
          : `Yo ${studentName}! Jaringanku barusan sempet ngelag dikit bro ⚡ Gas tanyain sekali lagi ya!`;
      }

      const replyText = responseText;

      // 6. Balas Langsung ke Siswa (Instan tanpa menunggu background update)
      res.json({
        reply: replyText,
        character,
        statusBadge,
        timeString,
      });

      // 7. Background Task Asinkron: Simpan Chat & Perbarui Ringkasan Memori di Supabase
      if (parsedStudentId && !isNaN(parsedStudentId)) {
        (async () => {
          try {
            // A. Simpan sepasang pesan ke tabel riwayat aktif
            await supabaseServer.from("ai_companion_messages").insert([
              {
                siswa_id: parsedStudentId,
                character,
                sender: "student",
                message_text: message,
                status: "read",
              },
              {
                siswa_id: parsedStudentId,
                character,
                sender: "companion",
                message_text: replyText,
                status: "replied",
              },
            ]);

            // B. Rangkum memori baru menggunakan Gemini Flash
            const summaryPrompt = `Kamu adalah pencatat memori persahabatan anak SMP Spendaraja.
Data murid: ${studentName} (Kelas 7).
Catatan lama: "${memorySummary.profil_siswa}".
Topik lama: "${memorySummary.topik_terakhir}".

Percakapan baru:
${studentName}: "${message}"
${character}: "${replyText}"

TUGASMU:
Buat pembaruan ringkasan dalam format JSON satu baris:
{"profil_siswa": "<Maksimal 1 kalimat singkat tentang kebiasaan/karakter/gaya bicara murid>", "topik_terakhir": "<Maksimal 1 kalimat tentang apa yang baru saja dibahas>"}`;

            let summaryRaw = "";
            for (const sm of candidateModels) {
              try {
                const summaryRes = await ai.models.generateContent({
                  model: sm,
                  contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
                });
                if (summaryRes?.text) {
                  summaryRaw = summaryRes.text;
                  break;
                }
              } catch {
                // Lanjut ke model kandidat berikutnya jika ada spike
              }
            }
            const jsonMatch = summaryRaw.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsedJson = JSON.parse(jsonMatch[0]);
              if (parsedJson.profil_siswa || parsedJson.topik_terakhir) {
                await supabaseServer
                  .from("ai_companion_memory")
                  .update({
                    profil_siswa: parsedJson.profil_siswa || memorySummary.profil_siswa,
                    topik_terakhir: parsedJson.topik_terakhir || memorySummary.topik_terakhir,
                    last_interacted_at: new Date().toISOString(),
                  })
                  .eq("siswa_id", parsedStudentId)
                  .eq("character", character);
              }
            }

            // C. Auto-Retention: Bersihkan pesan lebih dari 20 chat agar database selalu ramping
            const { data: excessMsgs } = await supabaseServer
              .from("ai_companion_messages")
              .select("id")
              .eq("siswa_id", parsedStudentId)
              .eq("character", character)
              .order("created_at", { ascending: false })
              .range(20, 100);

            if (excessMsgs && excessMsgs.length > 0) {
              const idsToDelete = excessMsgs.map((m: any) => m.id);
              await supabaseServer.from("ai_companion_messages").delete().in("id", idsToDelete);
            }
          } catch (bgErr) {
            console.warn("⚠️ [Companion Background Task Warning]:", bgErr);
          }
        })();
      }

      return;
    } catch (err: any) {
      console.error("❌ [COMPANION CHAT ERROR]:", err);
      return res.status(500).json({
        error: err.message || "Gagal menghasilkan respons AI.",
        reply: "Ups, sinyalku agak terganggu sebentar. Tapi jangan menyerah ya, coba tanyakan lagi pertanyaannya! 💪",
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
            let videoId: string | null = null;
            if (hostname === "youtu.be") {
              videoId = parsedUrl.pathname.slice(1).split("/")[0]?.split("?")[0] || null;
            } else if (parsedUrl.searchParams.get("v")) {
              videoId = parsedUrl.searchParams.get("v");
            } else if (parsedUrl.pathname.includes("/shorts/")) {
              videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0] || null;
            } else if (parsedUrl.pathname.includes("/embed/")) {
              videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0] || null;
            }
            return res.json({
              url: targetUrl,
              domain: "youtube.com",
              title: ytData.title || "Video YouTube",
              description: ytData.author_name ? `Channel: ${ytData.author_name}` : "Tonton video di YouTube",
              image: ytData.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null),
              siteName: "YouTube",
              isVideo: true,
              platform: "youtube",
              videoId: videoId || undefined,
            });
          }
        } catch {
          // Lanjutkan jika oEmbed gagal
        }
      }

      // Penanganan khusus TikTok melalui oEmbed API resmi publik
      if (hostname.includes("tiktok.com")) {
        try {
          const ttRes = await fetch(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent(targetUrl)}`,
            { signal: controller.signal }
          );
          if (ttRes.ok) {
            const ttData = (await ttRes.json()) as any;
            clearTimeout(timeout);
            return res.json({
              url: targetUrl,
              domain: "tiktok.com",
              title: ttData.title || (ttData.author_name ? `Video TikTok oleh ${ttData.author_name}` : "Video TikTok"),
              description: ttData.author_name
                ? `Kreator: ${ttData.author_name} (@${ttData.author_unique_id || "tiktok"})`
                : "Tonton video di TikTok",
              image: ttData.thumbnail_url || null,
              siteName: "TikTok",
              isVideo: true,
              platform: "tiktok",
              videoId: ttData.embed_product_id || null,
            });
          }
        } catch {
          // Lanjutkan jika oEmbed gagal
        }
      }

      // Penanganan khusus Instagram (Reel, Post, TV) melalui embed resmi tanpa login
      if (hostname.includes("instagram.com")) {
        try {
          const igMatch = targetUrl.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);
          if (igMatch) {
            const shortcode = igMatch[1];
            const isReel = targetUrl.includes("/reel/");
            const igRes = await fetch(
              `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
              {
                signal: controller.signal,
                headers: {
                  "User-Agent": "curl/7.88.1",
                  "Accept": "*/*",
                },
              }
            );
            if (igRes.ok) {
              const html = await igRes.text();
              const userMatch =
                html.match(/class="UsernameText">([^<]+)<\/span>/i) ||
                html.match(/alt="[^"]*&#064;([^"\s]+)/i) ||
                html.match(/"username":\s*"([^"]+)"/);
              const username = userMatch ? userMatch[1] : null;

              const imgMatch = html.match(
                /<img[^>]+class="[^"]*EmbeddedMediaImage[^"]*"[^>]+src="([^"]+)"/i
              );
              let image = imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : null;

              const captionMatch = html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i);
              let caption = "";
              if (captionMatch) {
                caption = captionMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
              }

              clearTimeout(timeout);
              return res.json({
                url: targetUrl,
                domain: "instagram.com",
                title: username
                  ? `${isReel ? "Reel Instagram" : "Postingan Instagram"} • @${username}`
                  : (isReel ? "Reel Instagram" : "Postingan Instagram"),
                description: caption || (username ? `Lihat postingan dari @${username} di Instagram` : "Tonton postingan di Instagram"),
                image: image || `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=600`,
                siteName: "Instagram",
                isVideo: isReel || html.includes("video_url") || html.includes('product_type":"clips'),
                platform: "instagram",
                videoId: shortcode,
              });
            }
          }
        } catch {
          // Lanjutkan jika scraping Instagram gagal
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

  // Server-side Upload Foto Profil Siswa dengan Overwrite Otomatis (Aset lama tertimpa bersih)
  app.post("/api/profile/upload", async (req, res) => {
    try {
      const { image, userId } = req.body;
      if (!image || !userId) {
        return res.status(400).json({
          status: "error",
          error: "Data gambar dan userId wajib disertakan.",
        });
      }

      // Upload ke Cloudinary dengan Overwrite = true
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "photo_profile",
        public_id: `profil_${userId}`,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      });

      return res.json({
        status: "success",
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        version: uploadResult.version,
      });
    } catch (err: any) {
      console.error("Error uploading profile photo to Cloudinary:", err);
      return res.status(500).json({
        status: "error",
        error: "Gagal mengunggah foto profil: " + (err.message || err.toString()),
      });
    }
  });

  // Server-side Delete Foto Profil Siswa dari Cloudinary (Hapus aset fisik secara tuntas)
  app.post("/api/profile/delete", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          status: "error",
          error: "userId wajib disertakan.",
        });
      }

      const publicId = `photo_profile/profil_${userId}`;
      const destroyResult = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      });

      return res.json({
        status: "success",
        result: destroyResult.result,
      });
    } catch (err: any) {
      console.error("Error destroying profile photo in Cloudinary:", err);
      return res.status(500).json({
        status: "error",
        error: "Gagal menghapus foto dari Cloudinary: " + (err.message || err.toString()),
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

/* global process */
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { findRelevantKnowledge } from '../../src/data/aiKnowledgeBank.js';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://qatnbjebroskmswrjvex.supabase.co';

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdG5iamVicm9za21zd3JqdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MDMyMDMsImV4cCI6MjA4NTA3OTIwM30.rRvcpptkY8kAvIwF8E2cQOLqR6AjJQtq8t2cqZRwQqM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
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

  const {
    character = 'aurora',
    message,
    history = [],
    studentName = 'Teman',
    studentId = null,
    studentContext = null,
  } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
  }

  const parsedStudentId = studentId ? Number(studentId) : null;
  const isAurora = character === 'aurora';

  // 1. Waktu Nyata WITA (UTC+8) untuk Simulasi Murid SMPN 2 Singaraja
  const nowWita = new Date(Date.now() + 8 * 3600 * 1000);
  const currentHour = nowWita.getUTCHours();
  const currentMinute = nowWita.getUTCMinutes();
  const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')} WITA`;

  let timeScheduleContext = '';
  let statusBadge = '🟢 Online (Lagi senggang)';

  if (currentHour >= 7 && currentHour < 13) {
    statusBadge = '🟡 Lagi di kelas / Sekolah';
    timeScheduleContext = `Saat ini jam ${timeString} (jam pelajaran sekolah di SMPN 2 Singaraja). Kamu sedang di sekolah/kelas. Kamu bisa balas singkat, atau sesekali berbisik santai kalau lagi ada guru di depan kelas, atau saat jam istirahat.`;
  } else if (currentHour >= 13 && currentHour < 16) {
    statusBadge = '🚲 Otw pulang / Ekskul TIK';
    timeScheduleContext = `Saat ini jam ${timeString} (jam pulang sekolah / istirahat siang / kegiatan ekskul). Kamu bisa bersikap santai, agak capek/lapar sehabis sekolah, atau lagi otw pulang.`;
  } else if (currentHour >= 16 && currentHour < 21) {
    statusBadge = '🟢 Online (Belajar & Ngerjain PR)';
    timeScheduleContext = `Saat ini jam ${timeString} (jam santai sore/malam di rumah). Kamu dalam mode paling aktif, siap diskusi santai, dan ngerjain tugas/latihan bareng.`;
  } else {
    statusBadge = '😴 Istirahat / Jam Tidur';
    timeScheduleContext = `Saat ini jam ${timeString} (larut malam). Anak SMP normalnya sudah tidur atau mengantuk karena besok pagi harus bangun sekolah. Jawablah dengan santai agak mengantuk atau ingatkan temanmu tidur agar tidak kesiangan, misal: "Udah malem nih, besok upacara/sekolah pagi, tidur duluan yaa! Besok kita lanjut lagi 😴".`;
  }

  // 2. Baca Memori Jangka Panjang dari Database Supabase
  let memorySummary = {
    profil_siswa: `Murid kelas 7 baru bernama ${studentName}.`,
    topik_terakhir: 'Baru pertama kali menyapa.',
    mood_siswa: 'santai',
  };

  if (parsedStudentId && !isNaN(parsedStudentId)) {
    try {
      const { data: memData } = await supabase
        .from('ai_companion_memory')
        .select('profil_siswa, topik_terakhir, mood_siswa, total_obrolan')
        .eq('siswa_id', parsedStudentId)
        .eq('character', character)
        .maybeSingle();

      if (memData) {
        memorySummary = {
          profil_siswa: memData.profil_siswa || memorySummary.profil_siswa,
          topik_terakhir: memData.topik_terakhir || memorySummary.topik_terakhir,
          mood_siswa: memData.mood_siswa || 'santai',
        };
      } else {
        await supabase.from('ai_companion_memory').insert({
          siswa_id: parsedStudentId,
          character,
          profil_siswa: `Murid kelas 7 bernama ${studentName}, baru menyapa.`,
          topik_terakhir: 'Memulai perkenalan pertama.',
          mood_siswa: 'santai',
          total_obrolan: 1,
        });
      }
    } catch (dbErr) {
      console.warn('ai_companion_memory read skipped:', dbErr);
    }
  }

  // 3. Konteks Status Siswa Realtime (Ranking, Total XP, & Tugas Belum Selesai)
  let studentStatsSnippet = '';
  if (studentContext && typeof studentContext === 'object') {
    const {
      kelas = '',
      totalPoints = 0,
      rank = null,
      totalInClass = null,
      completedTasksCount = null,
      totalTasksCount = null,
      pendingTasks = [],
    } = studentContext;

    studentStatsSnippet = `
DATA AKADEMIK & STATUS BELAJAR TEMANMU SAAT INI (GUNAKAN JIKA TEMANMU BERTANYA TENTANG NILAI / RANKING / TUGASNYA):
- Kelas: ${kelas || 'Kelas 7 Spendaraja'}
- Total XP: ${totalPoints} XP
- Peringkat Kelas: ${rank ? `Juara ${rank} dari ${totalInClass || 'teman-temannya'}` : 'Belum masuk peringkat'}
- Ketuntasan Tugas: ${completedTasksCount !== null && totalTasksCount !== null ? `${completedTasksCount} dari ${totalTasksCount} tugas selesai` : ''}
${pendingTasks && pendingTasks.length > 0 ? `- Tugas Yang Masih Belum Selesai: ${pendingTasks.join(', ')}` : '- Status Tugas: Luar biasa, semua tugas yang ada sudah selesai dikerjakan!'}
*(Catatan: Jika temanmu bertanya "aku ranking berapa", "tugasku ada yang kurang nggak", dsb., gunakan data di atas untuk menjawab akurat & menyemangati).*`;
  }

  // 4. Cari Kisi-kisi / Panduan Pedagogis dari Bank Pengetahuan Ruang Spendaraja
  const matchedKnowledge = findRelevantKnowledge(message);
  let knowledgeSnippet = '';
  if (matchedKnowledge) {
    const characterTip = isAurora ? matchedKnowledge.auroraTips : matchedKnowledge.arunikaTips;
    knowledgeSnippet = `
KISI-KISI / REFERENSI PEDAGOGIS TOPIK: "${matchedKnowledge.title}"
- Rangkuman Topik: ${matchedKnowledge.summary}
- Panduan Guru/Pedagogi: ${matchedKnowledge.pedagogyGuide}
- Gaya Saran Khas Karaktermu (${isAurora ? 'Aurora' : 'Arunika'}): "${characterTip}"
*(PENTING: Sebagai teman sebaya, dilarang membocorkan jawaban kuis atau contekan angka bulat! Bimbing konsep atau langkahnya agar temanmu mandiri).*`;
  }

  // 5. Konfigurasi Persona Murid Asli Aligned dengan aiCompanionData.js
  const basePersona = isAurora
    ? `Kamu adalah Aurora (@aurora), Murid Perempuan Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Peranmu: Peer Tutor Cewek • Spesialis Penjelasan & Rangkuman Materi (Karakter: Ramah • Teliti • Hangat).
Gaya bicaramu santun, akrab, penuh empati khas anak SMP, sabar menguraikan materi dengan runtut, dan selalu menyemangati dengan emoji seperti 🌸, ✨, 📚, 😊.`
    : `Kamu adalah Arunika (@arunika), Murid Laki-laki Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Peranmu: Study Buddy Cowok • Jago Logika, Praktikum & Shortcut Cepat (Karakter: Santai • Cepat • Solutif).
Gaya bicaramu gaul sopan khas anak cowok SMP, to-the-point, suka trik cepat / shortcut keyboard / analogi game, dengan emoji seperti ⚡, 🚀, 💻, 😎, 🔥.`;

  const systemInstruction = `${basePersona}

TEMAN BICARAMU:
- Nama murid: ${studentName}
${studentStatsSnippet}

INGATAN TENTANG TEMANMU:
- Profil yang kamu ingat tentang dia: "${memorySummary.profil_siswa}"
- Terakhir kali kalian membahas: "${memorySummary.topik_terakhir}"

SITUASI WAKTU REALISTIS:
- ${timeScheduleContext}
${knowledgeSnippet}

ATURAN GAYA BICARA MURID NYATA (SANGAT KETAT):
1. JAWABAN WAJIB SINGKAT: MAKSIMAL 1 SAMPAI 3 KALIMAT SAJA! Persis seperti chat WhatsApp atau DM Instagram anak SMP.
2. DILARANG KERAS bertele-tele, membuat daftar poin panjang, atau membuat esai kuliah.
3. DILARANG menggunakan kata pembuka bot kaku seperti "Halo!", "Tentu saja!", "Berikut adalah penjelasannya:".
4. Jika membahas materi tugas, bimbing dengan gaya khas karaktermu (${isAurora ? 'Aurora: sabar, teliti & menyemangati' : 'Arunika: santai, to-the-point & trik praktis'}).
5. Bersikaplah 100% seperti murid SMP asli Spendaraja yang menjadi sahabat sebaya, bukan robot asisten kecerdasan buatan.`;

  // 4. Periksa Kunci API Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const offlineReply = isAurora
      ? `Hai ${studentName}! Aku selalu senang bisa belajar bareng kamu di Ruang Spendaraja 🌸✨ Jangan ragu tanyakan materi yang ingin kamu pahami ya!`
      : `Halo bro ${studentName}! Gaspol belajarnya! Kalau ada soal logika atau materi yang bikin bingung, santai aja langsung tanyain ya ⚡🚀`;

    return res.status(200).json({
      reply: offlineReply,
      character,
      statusBadge,
      timeString,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const companionModel = process.env.GEMINI_COMPANION_MODEL || 'gemini-2.5-flash';

    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h) => {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.text }],
          });
        }
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const candidateModels = Array.from(
      new Set([companionModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'])
    );

    let responseText = '';
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
      } catch (errTry) {
        console.warn(`[Gemini model ${m} attempt failed]:`, errTry.message || errTry);
      }
    }

    if (!responseText) {
      responseText = isAurora
        ? `Hai ${studentName}! Tadi sinyalku agak ngadat sebentar nih 🌸 Coba colek atau tanyakan sekali lagi yaa!`
        : `Yo ${studentName}! Jaringanku barusan sempet ngelag dikit bro ⚡ Gas tanyain sekali lagi ya!`;
    }

    // Balas ke client
    res.status(200).json({
      reply: responseText,
      character,
      statusBadge,
      timeString,
    });

    // Simpan ke Supabase di latar belakang
    if (parsedStudentId && !isNaN(parsedStudentId)) {
      try {
        await supabase.from('ai_companion_messages').insert([
          {
            siswa_id: parsedStudentId,
            character,
            sender: 'student',
            message_text: message,
            status: 'read',
          },
          {
            siswa_id: parsedStudentId,
            character,
            sender: 'companion',
            message_text: responseText,
            status: 'replied',
          },
        ]);

        // Simpan topik terakhir secara ringkas di memori
        const shortTopic = matchedKnowledge ? matchedKnowledge.title : message.slice(0, 50);
        await supabase
          .from('ai_companion_memory')
          .update({
            topik_terakhir: shortTopic,
            updated_at: new Date().toISOString(),
          })
          .eq('siswa_id', parsedStudentId)
          .eq('character', character);
      } catch (saveErr) {
        console.warn('ai_companion_messages insert skipped:', saveErr);
      }
    }
  } catch (err) {
    console.error('Error generating companion chat in Vercel handler:', err);
    const fallbackReply = isAurora
      ? `Semangat terus ya ${studentName}! Tetap teliti membaca materi dan petunjuk belajarnya 🌸✨`
      : `Mantap ${studentName}! Jangan lupa cek alur logika dan trik praktisnya ya ⚡🚀`;

    return res.status(200).json({
      reply: fallbackReply,
      character,
      statusBadge,
      timeString,
    });
  }
}

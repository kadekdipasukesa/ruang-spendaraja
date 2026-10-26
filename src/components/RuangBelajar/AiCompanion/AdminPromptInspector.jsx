import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Trash2,
  Bot,
  User,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCode
} from 'lucide-react';
import { AI_CHARACTERS } from './aiCompanionData';
import { findRelevantKnowledge } from '../../../data/aiKnowledgeBank';

// Helper waktu WITA (UTC+8)
function getWitaContext() {
  const nowWita = new Date(Date.now() + 8 * 3600 * 1000);
  const hour = nowWita.getUTCHours();
  const minute = nowWita.getUTCMinutes();
  const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} WITA`;

  let timeScheduleContext = '';
  let statusBadge = '🟢 Online (Lagi senggang)';

  if (hour >= 7 && hour < 13) {
    statusBadge = '🟡 Lagi di kelas / Sekolah';
    timeScheduleContext = `Saat ini jam ${timeString} (jam pelajaran sekolah di SMPN 2 Singaraja). Kamu sedang di sekolah/kelas. Kamu bisa balas singkat, atau sesekali berbisik santai kalau lagi ada guru di depan kelas, atau saat jam istirahat.`;
  } else if (hour >= 13 && hour < 16) {
    statusBadge = '🚲 Otw pulang / Ekskul TIK';
    timeScheduleContext = `Saat ini jam ${timeString} (jam pulang sekolah / istirahat siang / kegiatan ekskul). Kamu bisa bersikap santai, agak capek/lapar sehabis sekolah, atau lagi otw pulang.`;
  } else if (hour >= 16 && hour < 21) {
    statusBadge = '🟢 Online (Belajar & Ngerjain PR)';
    timeScheduleContext = `Saat ini jam ${timeString} (jam santai sore/malam di rumah). Kamu dalam mode paling aktif, siap diskusi santai, dan ngerjain tugas/latihan bareng.`;
  } else {
    statusBadge = '😴 Istirahat / Jam Tidur';
    timeScheduleContext = `Saat ini jam ${timeString} (larut malam). Anak SMP normalnya sudah tidur atau mengantuk karena besok pagi harus bangun sekolah. Jawablah dengan santai agak mengantuk atau ingatkan temanmu tidur agar tidak kesiangan, misal: "Udah malem nih, besok upacara/sekolah pagi, tidur duluan yaa! Besok kita lanjut lagi 😴".`;
  }

  return { timeString, timeScheduleContext, statusBadge };
}

// Format default system instruction preview jika belum ada chat
function getPreviewSystemInstruction({
  character,
  studentName,
  studentContext,
  memorySummary,
  userMessage
}) {
  const isAurora = character === 'aurora';
  const basePersona = isAurora
    ? `Kamu adalah Aurora (@aurora), Murid Perempuan Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Peranmu: Peer Tutor Cewek • Spesialis Penjelasan & Rangkuman Materi (Karakter: Ramah • Teliti • Hangat).
Gaya bicaramu santun, akrab, penuh empati khas anak SMP, sabar menguraikan materi dengan runtut, dan selalu menyemangati dengan emoji seperti 🌸, ✨, 📚, 😊.`
    : `Kamu adalah Arunika (@arunika), Murid Laki-laki Kelas 7 di SMP Negeri 2 Singaraja (Spendaraja).
Peranmu: Study Buddy Cowok • Jago Logika, Praktikum & Shortcut Cepat (Karakter: Santai • Cepat • Solutif).
Gaya bicaramu gaul sopan khas anak cowok SMP, to-the-point, suka trik cepat / shortcut keyboard / analogi game, dengan emoji seperti ⚡, 🚀, 💻, 😎, 🔥.`;

  let studentStatsSnippet = '';
  if (studentContext && typeof studentContext === 'object') {
    const {
      kelas = '',
      totalPoints = 0,
      rank = null,
      totalInClass = null,
      completedTasksCount = null,
      totalTasksCount = null,
      pendingTasks = []
    } = studentContext;

    studentStatsSnippet = `
DATA AKADEMIK & STATUS BELAJAR TEMANMU SAAT INI:
- Kelas: ${kelas || 'Kelas 7 Spendaraja'}
- Total XP: ${totalPoints} XP
- Peringkat Kelas: ${rank ? `Juara ${rank} dari ${totalInClass || 'teman-temannya'}` : 'Belum masuk peringkat'}
- Ketuntasan Tugas: ${completedTasksCount !== null && totalTasksCount !== null ? `${completedTasksCount} dari ${totalTasksCount} tugas selesai` : ''}
${pendingTasks && pendingTasks.length > 0 ? `- Tugas Yang Masih Belum Selesai: ${pendingTasks.join(', ')}` : '- Status Tugas: Semua tugas sudah selesai!'}`;
  }

  const matchedKnowledge = findRelevantKnowledge(userMessage || '');
  let knowledgeSnippet = '';
  if (matchedKnowledge) {
    const characterTip = isAurora ? matchedKnowledge.auroraTips : matchedKnowledge.arunikaTips;
    knowledgeSnippet = `
KISI-KISI / REFERENSI PEDAGOGIS TOPIK: "${matchedKnowledge.title}"
- Rangkuman Topik: ${matchedKnowledge.summary}
- Panduan Guru/Pedagogi: ${matchedKnowledge.pedagogyGuide}
- Gaya Saran Khas Karaktermu (${isAurora ? 'Aurora' : 'Arunika'}): "${characterTip}"
*(PENTING: Sebagai teman sebaya, dilarang membocorkan jawaban kuis atau contekan bulat! Bimbing konsep atau langkahnya).*`;
  }

  const wita = getWitaContext();
  const mem = memorySummary?.[character] || {
    profil_siswa: `Murid kelas 7 bernama ${studentName}.`,
    topik_terakhir: 'Memulai percakapan.'
  };

  return `${basePersona}

TEMAN BICARAMU:
- Nama murid: ${studentName}${studentStatsSnippet}

INGATAN TENTANG TEMANMU:
- Profil yang kamu ingat: "${mem.profil_siswa || `Murid kelas 7 bernama ${studentName}`}"
- Terakhir kali kalian membahas: "${mem.topik_terakhir || 'Baru pertama kali menyapa'}"

SITUASI WAKTU REALISTIS:
- ${wita.timeScheduleContext}
${knowledgeSnippet}

ATURAN GAYA BICARA MURID NYATA (SANGAT KETAT):
1. JAWABAN WAJIB SINGKAT: MAKSIMAL 1 SAMPAI 3 KALIMAT SAJA! Persis seperti chat WhatsApp atau DM Instagram anak SMP.
2. DILARANG KERAS bertele-tele, membuat daftar poin panjang, atau membuat esai kuliah.
3. DILARANG menggunakan kata pembuka bot kaku seperti "Halo!", "Tentu saja!", "Berikut adalah penjelasannya:".
4. Jika membahas materi tugas, bimbing dengan gaya khas karaktermu (${isAurora ? 'Aurora: sabar, teliti & menyemangati' : 'Arunika: santai, to-the-point & trik praktis'}).
5. Bersikaplah 100% seperti murid SMP asli Spendaraja yang menjadi sahabat sebaya, bukan robot asisten kecerdasan buatan.`;
}

export default function AdminPromptInspector({
  character = 'aurora',
  onSelectCharacter,
  studentName = 'Teman',
  studentId = null,
  studentContext = null,
  memorySummary = null,
  lastDebugPrompt = null,
  lastUserMessage = '',
  promptLogs = [],
  onClearLogs,
  onBackToChat
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [showFileGuide, setShowFileGuide] = useState(false);

  const wita = useMemo(() => getWitaContext(), []);

  // Salin teks ke clipboard
  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Susun logs yang akan ditampilkan
  // Jika ada promptLogs, tampilkan. Jika kosong tapi ada lastDebugPrompt, tampilkan fallback 1 entri
  const effectiveLogs = useMemo(() => {
    if (Array.isArray(promptLogs) && promptLogs.length > 0) {
      return [...promptLogs].reverse(); // Terbaru di atas
    }
    if (lastDebugPrompt && lastUserMessage) {
      return [
        {
          id: 'last-turn',
          timestamp: wita.timeString,
          character,
          userMessage: lastUserMessage,
          replyText: '(Jawaban aktif di chat)',
          debugPrompt: lastDebugPrompt
        }
      ];
    }
    return [];
  }, [promptLogs, lastDebugPrompt, lastUserMessage, character, wita]);

  // Draf prompt preview jika belum ada chat sama sekali
  const previewPrompt = useMemo(() => {
    return getPreviewSystemInstruction({
      character,
      studentName,
      studentContext,
      memorySummary,
      userMessage: lastUserMessage || ''
    });
  }, [character, studentName, studentContext, memorySummary, lastUserMessage]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 font-mono text-slate-200 min-h-[480px]">
      {/* Terminal Window Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          {/* macOS / Linux style terminal buttons */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block shadow-sm" />
          </div>

          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Console Prompt AI (Admin Debugger)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-black">
              Admin Only
            </span>
          </div>
        </div>

        {/* Character switcher & Action buttons */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => onSelectCharacter && onSelectCharacter('aurora')}
              className={`px-2 py-1 rounded transition cursor-pointer font-bold flex items-center gap-1 ${
                character === 'aurora'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌸</span>
              <span>@aurora</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectCharacter && onSelectCharacter('arunika')}
              className={`px-2 py-1 rounded transition cursor-pointer font-bold flex items-center gap-1 ${
                character === 'arunika'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡</span>
              <span>@arunika</span>
            </button>
          </div>

          {effectiveLogs.length > 0 && onClearLogs && (
            <button
              type="button"
              onClick={onClearLogs}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Bersihkan riwayat log konsol"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {onBackToChat && (
            <button
              type="button"
              onClick={onBackToChat}
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
            >
              <span>Chat</span>
              <Bot className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Status Sub-bar */}
      <div className="px-4 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target: Gemini 2.5 Flash</span>
          </span>
          <span>•</span>
          <span className="text-slate-300">
            Siswa: <strong className="text-white">{studentName}</strong> ({studentContext?.kelas || 'Kelas 7'})
          </span>
          <span>•</span>
          <span className="text-amber-400">
            Waktu: {wita.timeString}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowFileGuide(!showFileGuide)}
          className="text-indigo-400 hover:text-indigo-300 text-[10px] flex items-center gap-1 underline cursor-pointer"
        >
          <FileCode className="w-3 h-3" />
          <span>{showFileGuide ? 'Tutup Petunjuk File' : 'Di mana edit prompt ini?'}</span>
        </button>
      </div>

      {/* Collapsible File Maintenance Helper */}
      {showFileGuide && (
        <div className="px-4 py-2.5 bg-indigo-950/30 border-b border-indigo-500/30 text-[11px] space-y-1 text-slate-300 shrink-0">
          <div className="flex items-center justify-between text-indigo-300 font-bold">
            <span>📁 Lokasi File Pengendali Prompt &amp; AI:</span>
            <span className="text-[10px] font-mono text-slate-400">Klik file untuk perbaikan</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] font-mono text-slate-400">
            <div>• Persona &amp; Greeting: <span className="text-pink-300">src/components/RuangBelajar/AiCompanion/aiCompanionData.js</span></div>
            <div>• Kisi-kisi &amp; Kata Kunci: <span className="text-cyan-300">src/data/aiKnowledgeBank.js</span></div>
            <div>• Perakitan Prompt: <span className="text-amber-300">server.ts</span> &amp; <span className="text-amber-300">api/gemini/companion-chat.js</span></div>
            <div>• Memori Database: <span className="text-purple-300">Supabase: ai_companion_memory</span></div>
          </div>
        </div>
      )}

      {/* Terminal Main Log Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {effectiveLogs.length > 0 ? (
          effectiveLogs.map((log, index) => {
            const systemPrompt = log.debugPrompt?.systemInstruction || previewPrompt;
            const logId = log.id || `log-${index}`;
            const logNum = effectiveLogs.length - index;

            return (
              <div
                key={logId}
                className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg"
              >
                {/* Log Item Header */}
                <div className="px-3.5 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">
                      [LOG #{logNum}]
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {log.timestamp || wita.timeString}
                    </span>
                    <span className="text-purple-300 text-[11px] px-1.5 py-0.2 rounded bg-purple-500/10 border border-purple-500/30">
                      @{log.character || character}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(systemPrompt, logId)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/50 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Salin seluruh system prompt lengkap yang dikirim ke Gemini"
                  >
                    {copiedId === logId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Prompt Ini</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Log Item Body */}
                <div className="p-3.5 space-y-3 text-xs leading-relaxed">
                  {/* 1. Chat Asli Siswa */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-indigo-400 font-bold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>&gt; PESAN CHAT SISWA:</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
                      "{log.userMessage}"
                    </div>
                  </div>

                  {/* 2. Prompt Lengkap yang Sebenarnya Dikirim ke Gemini */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-amber-400 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-amber-400" />
                        <span>&gt; PROMPT LENGKAP YANG DIKIRIM KE AI (SYSTEM INSTRUCTION):</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {systemPrompt.length} karakter
                      </span>
                    </div>
                    <pre className="p-3 rounded-lg bg-black border border-slate-800 text-emerald-400 whitespace-pre-wrap max-h-[260px] overflow-y-auto leading-relaxed text-[11px] selection:bg-purple-900 selection:text-white">
                      {systemPrompt}
                    </pre>
                  </div>

                  {/* 3. Balasan yang Diterima dari AI */}
                  {log.replyText && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-pink-400 font-bold flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        <span>&lt; RESPONS DITERIMA DARI AI:</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                        "{log.replyText}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Tampilan Draf Prompt Jika Belum Ada Chat Dikirim */
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
            <div className="px-3.5 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">
                  [DRAF AKTIF]
                </span>
                <span className="text-slate-400 text-[11px]">
                  Prompt Lengkap yang Disiapkan untuk @{character}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(previewPrompt, 'preview-prompt')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/50 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedId === 'preview-prompt' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 space-y-2 text-xs">
              <div className="text-[11px] text-slate-400">
                &gt; Belum ada obrolan baru pada sesi ini. Berikut adalah teks prompt lengkap yang otomatis dirakit dan dikirim ke server Gemini saat kamu atau siswa mengirim chat:
              </div>
              <pre className="p-3 rounded-lg bg-black border border-slate-800 text-emerald-400 whitespace-pre-wrap max-h-[360px] overflow-y-auto leading-relaxed text-[11px] selection:bg-purple-900 selection:text-white">
                {previewPrompt}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Footer Prompt Cursor */}
      <div className="px-4 py-2 bg-black border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">spendaraja@ai-companion:~$</span>
          <span className="text-slate-400">ready. Kirim chat di tab "Live Chat Teman AI" untuk merekam prompt baru.</span>
          <span className="w-2 h-3.5 bg-emerald-400 inline-block animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
}

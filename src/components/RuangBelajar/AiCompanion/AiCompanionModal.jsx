import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Play,
  MessageSquare,
  Send,
  Sparkles,
  ExternalLink,
  Bot,
  RefreshCw,
  CornerDownLeft,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { AI_COMPANION_CONFIG, AI_CHARACTERS } from './aiCompanionData';

// Realistic Status Badge (Berdasarkan jam WITA)
function getInitialStatusBadge() {
  const nowWita = new Date(Date.now() + 8 * 3600 * 1000);
  const hour = nowWita.getUTCHours();
  if (hour >= 7 && hour < 13) return '🟡 Lagi di kelas / Sekolah';
  if (hour >= 13 && hour < 16) return '🚲 Otw pulang / Ekskul TIK';
  if (hour >= 16 && hour < 21) return '🟢 Online (Belajar & Ngerjain PR)';
  return '😴 Istirahat / Jam Tidur';
}

function createUniqueMsgId() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function getCurrentTimeFormatted() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function AiCompanionModal({
  isOpen,
  onClose,
  initialTab = 'video',
  studentName = 'Teman',
  studentId = null
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'video' | 'chat'
  const [selectedCharacter, setSelectedCharacter] = useState('aurora'); // 'aurora' | 'arunika'

  const [statusBadge, setStatusBadge] = useState(getInitialStatusBadge);
  const [memorySummary, setMemorySummary] = useState({ aurora: null, arunika: null });

  // Dapatkan ID dan Nama Siswa aktif (dengan fallback otomatis ke localStorage user_siswa)
  const getActiveStudent = () => {
    let resolvedId = studentId;
    let resolvedName = studentName;
    try {
      const rawUser = localStorage.getItem('user_siswa') || sessionStorage.getItem('user_siswa');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (!resolvedId) resolvedId = parsed.id || parsed.ID || parsed.siswa_id;
        if (!resolvedName || resolvedName === 'Teman') {
          resolvedName = parsed.NAMA || parsed.nama || parsed.name || 'Teman';
        }
      }
    } catch (e) {
      console.warn('Gagal membaca fallback student session:', e);
    }
    return {
      id: resolvedId ? Number(resolvedId) : null,
      name: resolvedName || 'Teman'
    };
  };

  const activeStudent = getActiveStudent();
  const effectiveStudentId = activeStudent.id;
  const effectiveStudentName = activeStudent.name;

  // Chat States
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState({
    aurora: [
      {
        id: 'init-aurora',
        role: 'assistant',
        text: AI_CHARACTERS.aurora.greeting,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ],
    arunika: [
      {
        id: 'init-arunika',
        role: 'assistant',
        text: AI_CHARACTERS.arunika.greeting,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]
  });
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const chatBottomRef = useRef(null);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setStatusBadge(getInitialStatusBadge());
    }
  }, [isOpen, initialTab]);

  // Muat riwayat chat aktif & ingatan siswa dari Supabase
  useEffect(() => {
    if (!isOpen || !effectiveStudentId) return;

    let isMounted = true;
    const fetchCompanionHistory = async () => {
      try {
        const response = await fetch(
          `/api/gemini/companion-history?studentId=${effectiveStudentId}&character=${selectedCharacter}`
        );
        if (!response.ok) {
          return;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return;
        }
        const data = await response.json();
        if (!isMounted) return;

        if (data.memory) {
          setMemorySummary((prev) => ({
            ...prev,
            [selectedCharacter]: data.memory
          }));
        }

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const loadedMsgs = data.messages.map((m) => ({
            id: m.id,
            role: m.sender === 'student' ? 'user' : 'assistant',
            text: m.message_text,
            timestamp: new Date(m.created_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }));

          setMessages((prev) => ({
            ...prev,
            [selectedCharacter]: loadedMsgs
          }));
        }
      } catch (err) {
        console.warn('Gagal memuat ingatan teman belajar:', err);
      }
    };

    fetchCompanionHistory();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCharacter, effectiveStudentId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedCharacter, activeTab, isLoadingReply]);

  if (!isOpen) return null;

  const currentCharacter = AI_CHARACTERS[selectedCharacter];
  const currentChatHistory = messages[selectedCharacter] || [];

  // Send Chat to Backend Gemini API
  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoadingReply) return;

    const userMsg = {
      id: createUniqueMsgId(),
      role: 'user',
      text: textToSend,
      timestamp: getCurrentTimeFormatted()
    };

    // Update state user message
    setMessages((prev) => ({
      ...prev,
      [selectedCharacter]: [...prev[selectedCharacter], userMsg]
    }));
    setInputMessage('');
    setIsLoadingReply(true);

    try {
      // Panggil backend API Gemini
      const response = await fetch('/api/gemini/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: selectedCharacter,
          message: textToSend,
          studentName: effectiveStudentName,
          studentId: effectiveStudentId,
          history: currentChatHistory.map((m) => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      let data = {};
      if (response.ok) {
        try {
          data = await response.json();
        } catch {
          data = {};
        }
      }
      if (data.statusBadge) {
        setStatusBadge(data.statusBadge);
      }

      const replyText = data.reply || (
        selectedCharacter === 'aurora'
          ? "Tetap semangat belajar ya! Aku yakin kamu pasti bisa menuntaskan materi ini dengan nilai terbaik! 🌸✨"
          : "Gas terus belajarnya! Kalau ada error atau tantangan di kuis, langsung tanyain lagi ke aku ya! ⚡🚀"
      );

      const botMsg = {
        id: createUniqueMsgId(),
        role: 'assistant',
        text: replyText,
        timestamp: getCurrentTimeFormatted()
      };

      setMessages((prev) => ({
        ...prev,
        [selectedCharacter]: [...prev[selectedCharacter], botMsg]
      }));
    } catch (err) {
      console.warn('Gagal terhubung ke Gemini, menggunakan fallback teman belajar:', err);
      // Fallback ramah jika offline
      const fallbackReply = selectedCharacter === 'aurora'
        ? `Wah, pertanyaan yang bagus! Tetap fokus baca panduan langkahnya ya, jangan lupa teliti saat menjawab soal checkpoint. Aku selalu mendukungmu! 🌸`
        : `Mantap pertanyaannya! Triknya adalah perhatikan shortcut keyboard dan urutan logikanya. Coba praktikkan langsung ya! ⚡`;

      const botMsg = {
        id: createUniqueMsgId(),
        role: 'assistant',
        text: fallbackReply,
        timestamp: getCurrentTimeFormatted()
      };

      setMessages((prev) => ({
        ...prev,
        [selectedCharacter]: [...prev[selectedCharacter], botMsg]
      }));
    } finally {
      setIsLoadingReply(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Teman Belajar AI Spendaraja
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  @aurora &amp; @arunika
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Karakter AI Teman Sebaya Murid SMP Negeri 2 Singaraja
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (Video Shorts vs Live Chat) */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-4 pt-2 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-2xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'video'
                ? 'bg-slate-850 text-white border-t-2 border-rose-500 bg-gradient-to-t from-slate-900 to-rose-950/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Video Perkenalan (Shorts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-2xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-slate-850 text-white border-t-2 border-cyan-500 bg-gradient-to-t from-slate-900 to-cyan-950/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Live Chat Teman AI</span>
          </button>
        </div>

        {/* TAB 1: VIDEO PERKENALAN YOUTUBE SHORTS */}
        {activeTab === 'video' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* YouTube Shorts Vertical Player Frame (9:16 aspect ratio) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl ring-4 ring-purple-500/20">
                  <iframe
                    src={AI_COMPANION_CONFIG.youtubeEmbedUrl}
                    title="Video Perkenalan AI Aurora & Arunika SMPN 2 Singaraja"
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Right Side: Description & Character Cards */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    🎬 Official Video Perkenalan
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Bertemu Aurora &amp; Arunika: Murid AI Spendaraja!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Visual kedua karakter dirancang menyerupai murid SMP asli dengan kepribadian teman sebaya. Mereka akan selalu siap membantumu saat belajar TIK di Ruang Spendaraja.
                  </p>
                </div>

                {/* Character Detail Cards */}
                <div className="space-y-3">
                  {/* Aurora Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 to-slate-900 border border-pink-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌸</span>
                        <strong className="text-sm font-bold text-pink-300">Aurora (@aurora)</strong>
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.2 rounded-full">
                          Murid Cewek
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sopan, teliti, dan hangat. Suka merangkum materi TIK agar mudah dipahami langkah demi langkah.
                    </p>
                  </div>

                  {/* Arunika Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <strong className="text-sm font-bold text-cyan-300">Arunika (@arunika)</strong>
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.2 rounded-full">
                          Murid Cowok
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Santai, energik, dan solutif. Jago shortcut keyboard, trik praktikum komputer, dan strategi meraih skor XP maksimal.
                    </p>
                  </div>
                </div>

                {/* Switch to Chat Call To Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="w-full sm:w-auto flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Sudah Kenal? Mulai Ngobrol Sekarang!</span>
                  </button>

                  <a
                    href={AI_COMPANION_CONFIG.youtubeShortsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Buka di YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CHAT DENGAN KARAKTER AI */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-[460px]">
            {/* Character Selector Topbar */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Pilih Teman Ngobrol:</span>
                <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCharacter('aurora')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      selectedCharacter === 'aurora'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🌸</span>
                    <span>@aurora</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCharacter('arunika')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      selectedCharacter === 'arunika'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>⚡</span>
                    <span>@arunika</span>
                  </button>
                </div>
              </div>

              {/* Active Character Status Badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/90 border border-slate-700/80 text-slate-200 flex items-center gap-1.5 shadow-sm">
                  <span>{statusBadge}</span>
                </span>
              </div>
            </div>

            {/* Subtle Memory Indicator from Supabase */}
            {memorySummary[selectedCharacter]?.topik_terakhir && (
              <div className="mx-4 mt-2.5 -mb-1 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-center justify-between gap-2 text-[11px] text-purple-200 shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs">💭</span>
                  <span className="font-bold text-purple-300 shrink-0">Ingatan {currentCharacter.name}:</span>
                  <span className="truncate text-slate-300">
                    "{memorySummary[selectedCharacter].topik_terakhir}"
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono shrink-0">
                  Tersinkron
                </span>
              </div>
            )}

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-900/60">
              {currentChatHistory.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentCharacter.avatarBg} text-white flex items-center justify-center text-sm shrink-0 shadow-md`}
                      >
                        {currentCharacter.icon}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isAssistant
                          ? 'bg-slate-800 border border-slate-700/80 text-slate-200'
                          : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium'
                      }`}
                    >
                      {isAssistant && (
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-bold">
                          <span>{currentCharacter.name}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {!isAssistant && (
                        <div className="text-[10px] text-indigo-200 text-right mt-1">
                          {msg.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoadingReply && (
                <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2">
                  <div
                    className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${currentCharacter.avatarBg} text-white flex items-center justify-center text-xs shadow-md animate-pulse`}
                  >
                    {currentCharacter.icon}
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800/80 px-3 py-2 rounded-2xl border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-400 ml-1.5">
                      {currentCharacter.name} sedang mengetik...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Contoh Tanya:</span>
              {currentCharacter.quickSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoadingReply}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Tanya materi atau minta bantuan ke ${currentCharacter.name}...`}
                disabled={isLoadingReply}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoadingReply}
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

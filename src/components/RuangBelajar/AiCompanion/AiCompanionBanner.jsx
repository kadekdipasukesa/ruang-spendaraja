import React from 'react';
import { Sparkles, Play, MessageSquare, ExternalLink } from 'lucide-react';
import { AI_COMPANION_CONFIG, AI_CHARACTERS } from './aiCompanionData';

export default function AiCompanionBanner({ onOpenModal }) {
  const aurora = AI_CHARACTERS.aurora;
  const arunika = AI_CHARACTERS.arunika;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden transition-all hover:border-slate-300">
      {/* Top Gradient Accent Bar matching Ruang Belajar theme */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 opacity-90" />

      {/* Subtle light background tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/25 via-white to-sky-50/25 pointer-events-none" />

      <div className="relative z-10 p-3.5 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
          
          {/* Sisi Kiri: Avatars + Identitas Ringkas (Sangat Ringkas & Responsif di HP) */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Overlapping Avatars dengan Instagram Story Ring */}
            <div className="relative shrink-0 flex items-center -space-x-3">
              {/* Aurora Avatar */}
              <div
                onClick={() => onOpenModal && onOpenModal('chat')}
                className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-xs cursor-pointer hover:scale-105 transition"
                title="Aurora (@aurora) - Peer Tutor Cewek"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 border border-white">
                  <img
                    src={aurora.avatarUrl}
                    alt={aurora.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Status Dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </div>

              {/* Arunika Avatar */}
              <div
                onClick={() => onOpenModal && onOpenModal('chat')}
                className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 shadow-xs cursor-pointer hover:scale-105 transition"
                title="Arunika (@arunika) - Study Buddy Cowok"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-100 border border-white">
                  <img
                    src={arunika.avatarUrl}
                    alt={arunika.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Status Dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </div>
            </div>

            {/* Info Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                  <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                  Teman Belajar AI
                </span>
                <span className="text-[10px] text-slate-400 font-semibold hidden xs:inline">
                  SMPN 2 Singaraja
                </span>
              </div>

              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug truncate mt-0.5">
                Ada tugas/materi yang bingung? Tanya <span className="text-pink-600 font-black">@aurora</span> &amp; <span className="text-sky-600 font-black">@arunika</span> yuk! 👋
              </h2>

              <p className="text-[11px] text-slate-500 truncate hidden md:block">
                Teman sebaya Kelas 7 yang siap membantumu memahami materi TIK, tips praktikum &amp; trik ngerjain tugas.
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Action Buttons (Sleek, Sat-set & Nyaman di HP) */}
          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
            {/* Tombol Utama: Live Chat */}
            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal('chat')}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Teman AI</span>
            </button>

            {/* Tombol Sekunder: Video Shorts */}
            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal('video')}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 active:scale-95 transition cursor-pointer"
              title="Tonton Video Perkenalan Aurora & Arunika"
            >
              <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="hidden xs:inline">Video Shorts</span>
              <span className="xs:hidden">Shorts</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

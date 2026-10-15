import React from 'react';
import { Sparkles, Play, MessageSquare, ExternalLink, Bot, Heart, Zap } from 'lucide-react';
import { AI_COMPANION_CONFIG, AI_CHARACTERS } from './aiCompanionData';

export default function AiCompanionBanner({ onOpenModal }) {
  const aurora = AI_CHARACTERS.aurora;
  const arunika = AI_CHARACTERS.arunika;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/30 p-5 sm:p-7 shadow-xl shadow-indigo-950/20 text-white">
      {/* Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Information & Highlights */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-purple-400/40 text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Teman Belajar AI Siswa • Peer Tutors
            </span>
            <span className="text-xs text-slate-400 font-medium">
              SMP Negeri 2 Singaraja
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
            Kenalan dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">@aurora</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">@arunika</span>! 👋
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dua teman sebaya berbasis AI dengan visual dan kepribadian seperti murid asli SMP. Siap menemanimu belajar TIK, membedah modul latihan, dan berdiskusi kapan pun kamu butuh bantuan.
          </p>

          {/* 2 Characters Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Aurora */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-pink-500/20 hover:border-pink-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-lg shrink-0 shadow-md shadow-pink-500/20">
                {aurora.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{aurora.name}</span>
                  <span className="text-[10px] text-pink-300 font-semibold">{aurora.handle}</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">{aurora.specialty}</p>
              </div>
            </div>

            {/* Arunika */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-cyan-500/20 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-lg shrink-0 shadow-md shadow-cyan-500/20">
                {arunika.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{arunika.name}</span>
                  <span className="text-[10px] text-cyan-300 font-semibold">{arunika.handle}</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">{arunika.specialty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CTA Actions & Video Thumbnail Preview */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenModal && onOpenModal('video')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
            <span>Tonton Video Perkenalan (Shorts)</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenModal && onOpenModal('chat')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Tanya Aurora &amp; Arunika (Live Chat)</span>
          </button>

          <a
            href={AI_COMPANION_CONFIG.youtubeShortsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-400 hover:text-slate-200 text-center flex items-center justify-center gap-1 transition"
          >
            <span>Buka di YouTube Shorts</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

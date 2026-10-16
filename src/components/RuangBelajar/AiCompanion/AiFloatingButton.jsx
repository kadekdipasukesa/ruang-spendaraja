import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { AI_CHARACTERS } from './aiCompanionData';

export default function AiFloatingButton({ onClick }) {
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto hide tooltip after 8 seconds, but keep floating button
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-24 sm:bottom-20 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none">
      {/* Speech bubble / Tooltip */}
      {showTooltip && (
        <div className="relative animate-bounce bg-slate-900 border border-purple-500/40 text-white px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 max-w-[210px] text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="leading-tight text-[11px]">
            Hai! Butuh bantuan tugas? Tanya <strong>Aurora</strong> &amp; <strong>Arunika</strong> yuk!
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-3 h-3" />
          </button>
          {/* Triangle Pointer */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/40 transform rotate-45" />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Buka Teman Belajar AI Aurora & Arunika"
        className="group relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-900/90 via-indigo-900/95 to-slate-900 hover:from-purple-800 hover:to-indigo-800 border-2 border-purple-400/50 shadow-2xl shadow-purple-900/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        {/* Glowing Aura Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 opacity-60 group-hover:opacity-100 blur-xs transition duration-300 animate-pulse" />

        <div className="relative z-10 flex items-center -space-x-2">
          {/* Aurora Avatar */}
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden shadow-md shrink-0 bg-slate-800">
            <img
              src={AI_CHARACTERS.aurora.avatarUrl}
              alt="Aurora"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Arunika Avatar */}
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden shadow-md shrink-0 bg-slate-800">
            <img
              src={AI_CHARACTERS.arunika.avatarUrl}
              alt="Arunika"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-black text-white leading-tight flex items-center gap-1">
            <span>Teman AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span className="text-[10px] text-purple-200">@aurora &amp; @arunika</span>
        </div>
      </button>
    </div>
  );
}

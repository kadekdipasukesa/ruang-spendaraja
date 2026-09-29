import React, { useState } from 'react';
import {
  FileText,
  Save,
  Undo,
  Redo,
  Minus,
  Square,
  X,
  Plus,
  FolderOpen,
  Clock,
  Layout,
  MousePointer,
  ZoomIn,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function VisualInterfaceWord() {
  const [activeView, setActiveView] = useState('start_screen'); // 'start_screen' | 'editor'
  const [highlightedPart, setHighlightedPart] = useState('ribbon');

  const editorParts = [
    { id: 'quick', label: '1. Quick Access Toolbar', desc: 'Tombol pintas cepat di pojok kiri atas (Save/Disket, Undo, Redo).' },
    { id: 'ribbon', label: '2. Ribbon & Tab Menu', desc: 'Kumpulan tab perintah (File, Home, Insert, Layout) untuk mengedit dokumen.' },
    { id: 'canvas', label: '3. Lembar Kerja (Work Area)', desc: 'Kertas putih di tengah layar tempat kamu mengetik teks dan menaruh gambar.' },
    { id: 'status', label: '4. Status Bar & Zoom', desc: 'Informasi jumlah kata, nomor halaman, dan slider perbesaran lembar kertas.' },
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Antarmuka Microsoft Word
          </h4>
        </div>

        {/* View Switcher: Start Screen vs Editor */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveView('start_screen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'start_screen'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>1. Layar Awal (Start Screen)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('editor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'editor'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Lembar Kerja (Editor A4)</span>
          </button>
        </div>
      </div>

      {/* ─── VIEW 1: START SCREEN (Layar Awal Buka Word) ─── */}
      {activeView === 'start_screen' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs text-blue-200 flex items-start gap-2">
            <MousePointer className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Layar Awal Word:</strong> Saat pertama kali membuka Ms. Word di komputer lab, klik tombol{' '}
              <strong className="text-amber-300 underline">"Blank document"</strong> untuk membuat kertas kosong baru!
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl select-none text-[11px]">
            {/* Title Bar Start Screen */}
            <div className="bg-[#2b579a] text-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center font-black text-[#2b579a] text-[10px]">
                  W
                </div>
                <span className="text-xs font-bold tracking-wide">Word - Start Screen</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="w-3.5 h-3.5 hover:text-slate-300" />
                <Square className="w-3 h-3 hover:text-slate-300" />
                <X className="w-3.5 h-3.5 hover:text-rose-300" />
              </div>
            </div>

            {/* Split Screen: Left Sidebar & Right Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[220px]">
              {/* Left Blue Sidebar */}
              <div className="bg-[#214376] p-4 text-white space-y-2 border-r border-blue-800/50">
                <div className="px-3 py-2 rounded-xl bg-white/20 text-white font-black text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Home / New</span>
                </div>
                <div className="px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 text-xs font-semibold flex items-center gap-2 cursor-pointer">
                  <FolderOpen className="w-4 h-4" />
                  <span>Open</span>
                </div>
                <div className="pt-8 text-[10px] text-white/50 space-y-1 hidden md:block">
                  <p>Account</p>
                  <p>Feedback</p>
                  <p>Options</p>
                </div>
              </div>

              {/* Right Main Area */}
              <div className="md:col-span-3 p-4 sm:p-5 bg-slate-850 space-y-4">
                {/* New Documents Area */}
                <div>
                  <h5 className="text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-2">
                    <span>New (Buat Dokumen Baru):</span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      ★ Klik tombol di bawah ini
                    </span>
                  </h5>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Primary Button: Blank document (Interactive to jump to editor) */}
                    <div
                      onClick={() => setActiveView('editor')}
                      className="p-3.5 rounded-2xl bg-white text-slate-900 border-2 border-amber-400 shadow-lg shadow-amber-500/15 hover:scale-102 transition cursor-pointer group relative overflow-hidden"
                    >
                      <div className="w-full h-16 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center mb-2 group-hover:bg-amber-50 transition">
                        <Plus className="w-7 h-7 text-blue-600 group-hover:scale-110 transition" />
                      </div>
                      <span className="font-black text-xs text-slate-900 block truncate">
                        Blank document
                      </span>
                      <span className="text-[9px] text-blue-700 font-bold block mt-0.5">
                        Klik untuk mulai ➔
                      </span>
                    </div>

                    {/* Dummy Template 1 */}
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 opacity-60">
                      <div className="w-full h-16 rounded-xl bg-slate-700/60 border border-slate-600 flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="font-semibold text-xs text-slate-300 block truncate">
                        Welcome to Word
                      </span>
                      <span className="text-[9px] text-slate-500 block">Template bawaan</span>
                    </div>

                    {/* Dummy Template 2 */}
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 opacity-60 hidden sm:block">
                      <div className="w-full h-16 rounded-xl bg-slate-700/60 border border-slate-600 flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="font-semibold text-xs text-slate-300 block truncate">
                        Single spaced (blank)
                      </span>
                      <span className="text-[9px] text-slate-500 block">Template bawaan</span>
                    </div>
                  </div>
                </div>

                {/* Recent Documents Area */}
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent (Dokumen yang Baru Dibuka Sebelumnya):</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white font-medium">Tugas_TIK_Pengolah_Kata.docx</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">Kemarin, 14.30 WITA</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-300">Latihan_Mengetik_Spendaraja.docx</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">3 hari lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW 2: EDITOR WINDOW (Lembar Kerja Utama A4) ─── */}
      {activeView === 'editor' && (
        <div className="space-y-4">
          {/* Part Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {editorParts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setHighlightedPart(p.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition border ${
                  highlightedPart === p.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="block truncate">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Description Banner */}
          <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-xs text-blue-200 flex items-start gap-2">
            <MousePointer className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{editorParts.find((p) => p.id === highlightedPart)?.desc}</span>
          </div>

          {/* Realistic Microsoft Word UI Mockup */}
          <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl select-none text-[11px]">
            {/* Title Bar (Word Blue) */}
            <div className="bg-[#2b579a] text-white px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center font-black text-[#2b579a] text-[10px] shadow-xs">
                  W
                </div>
                {/* Quick Access Toolbar */}
                <div
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition ${
                    highlightedPart === 'quick' ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-bold' : 'text-white/90'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" title="Save (Ctrl+S)" />
                  <Undo className="w-3.5 h-3.5" title="Undo (Ctrl+Z)" />
                  <Redo className="w-3.5 h-3.5" title="Redo (Ctrl+Y)" />
                  {highlightedPart === 'quick' && (
                    <span className="text-[10px] uppercase tracking-wider ml-1">← Quick Access</span>
                  )}
                </div>
              </div>

              <div className="text-xs font-semibold text-white/95 hidden sm:block">
                Document1 - Microsoft Word
              </div>

              <div className="flex items-center gap-2">
                <Minus className="w-3.5 h-3.5 hover:text-slate-300 cursor-pointer" />
                <Square className="w-3 h-3 hover:text-slate-300 cursor-pointer" />
                <X className="w-3.5 h-3.5 hover:text-rose-300 cursor-pointer" />
              </div>
            </div>

            {/* Tab Menu Bar */}
            <div
              className={`bg-slate-800 text-slate-300 px-3 py-1 flex items-center gap-3 border-b border-slate-700 text-xs overflow-x-auto ${
                highlightedPart === 'ribbon' ? 'ring-2 ring-amber-400 bg-slate-800/90' : ''
              }`}
            >
              <span className="px-2 py-0.5 rounded bg-[#2b579a] text-white font-bold cursor-pointer">File</span>
              <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-bold border-b-2 border-blue-400 cursor-pointer">Home</span>
              <span className="px-2 py-0.5 hover:text-white cursor-pointer">Insert</span>
              <span className="px-2 py-0.5 hover:text-white cursor-pointer">Layout</span>
              <span className="px-2 py-0.5 hover:text-white cursor-pointer">References</span>
              <span className="px-2 py-0.5 hover:text-white cursor-pointer">View</span>
              {highlightedPart === 'ribbon' && (
                <span className="ml-auto text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/60">
                  Tab Menu & Ribbon Perintah Aktif
                </span>
              )}
            </div>

            {/* Ribbon Toolbar Mockup */}
            <div
              className={`bg-slate-850 p-2 border-b border-slate-700 grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px] text-slate-300 ${
                highlightedPart === 'ribbon' ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-800/50'
              }`}
            >
              {/* Clipboard Group */}
              <div className="border-r border-slate-700 pr-2 space-y-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Clipboard</span>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-200">Paste</span>
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-200">Copy</span>
                </div>
              </div>

              {/* Font Group */}
              <div className="border-r border-slate-700 pr-2 space-y-1 col-span-2">
                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block">Grup Font (Huruf)</span>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-700 rounded font-mono text-[10px] text-white">Calibri</span>
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded font-mono text-[10px] text-white">12</span>
                  <span className="w-5 h-5 bg-slate-700 font-black rounded flex items-center justify-center text-white" title="Bold">B</span>
                  <span className="w-5 h-5 bg-slate-700 italic font-serif rounded flex items-center justify-center text-white" title="Italic">I</span>
                  <span className="w-5 h-5 bg-slate-700 underline rounded flex items-center justify-center text-white" title="Underline">U</span>
                </div>
              </div>

              {/* Paragraph Group */}
              <div className="border-r border-slate-700 pr-2 space-y-1 hidden sm:block">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Paragraf</span>
                <div className="flex items-center gap-1">
                  <span className="px-1 py-0.5 bg-slate-700 rounded text-white" title="Align Left">Left</span>
                  <span className="px-1 py-0.5 bg-blue-600 rounded text-white font-bold" title="Center">Center</span>
                  <span className="px-1 py-0.5 bg-slate-700 rounded text-white" title="Align Right">Right</span>
                </div>
              </div>

              {/* Styles */}
              <div className="space-y-1 hidden sm:block">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Gaya Cepat</span>
                <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded font-bold border border-blue-500/40 block text-center">
                  Heading 1
                </span>
              </div>
            </div>

            {/* Work Area (White Paper Simulation) */}
            <div
              className={`p-4 sm:p-6 bg-slate-900/90 min-h-[190px] flex items-center justify-center relative ${
                highlightedPart === 'canvas' ? 'ring-4 ring-amber-400/80 ring-inset' : ''
              }`}
            >
              {/* A4 Paper Sheet */}
              <div className="w-full max-w-md bg-white text-slate-900 rounded-lg shadow-2xl p-4 sm:p-5 text-center space-y-2 border border-slate-300 transform transition">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-sm">
                  SMPN 2
                </div>
                <h5 className="font-black text-xs sm:text-sm text-slate-900 tracking-wide uppercase">
                  Undangan Perayaan HUT Ke-65 SMPN 2 Singaraja
                </h5>
                <p className="text-[10px] text-slate-600 italic">
                  "Mengukir Prestasi Emas, Menyongsong Generasi Berkarakter"
                </p>
                <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-700 text-left space-y-0.5 max-w-xs mx-auto">
                  <p>📅 Hari, Tanggal : Sabtu, 14 November 2026</p>
                  <p>⏰ Waktu : 08.00 WITA - Selesai</p>
                  <p>📍 Tempat : Aula Graha Widya Spendaraja</p>
                </div>
              </div>

              {highlightedPart === 'canvas' && (
                <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-md shadow-md text-[10px]">
                  ★ Lembar Kerja Mengetik (Kertas Putih A4)
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div
              className={`bg-[#2b579a] text-white px-3 py-1 flex items-center justify-between text-[10px] ${
                highlightedPart === 'status' ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span>Page 1 of 1</span>
                <span>48 Words</span>
                <span>Indonesian</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomIn className="w-3 h-3" />
                <div className="w-16 bg-white/40 h-1.5 rounded-full overflow-hidden">
                  <div className="w-3/4 bg-white h-full" />
                </div>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

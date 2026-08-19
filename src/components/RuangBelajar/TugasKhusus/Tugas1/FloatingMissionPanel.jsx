import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  Layers,
  FileText,
  FolderTree,
  Target,
  X,
  Volume2,
  Flame,
  Check
} from 'lucide-react';
import { playMissionSuccessSound, triggerMissionFireworkAnimation } from '../../../../utils/missionCelebration';

// Helper component untuk mendeteksi dan memberi highlight kuning + tebal pada "(Lokasi Target: ...)"
function FormatInstruction({ text }) {
  if (!text) return null;

  const targetRegex = /(\(Lokasi Target:[^)]+\))/g;
  const parts = text.split(targetRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (targetRegex.test(part)) {
          return (
            <mark
              key={index}
              className="bg-yellow-300 text-slate-900 font-extrabold px-1.5 py-0.5 rounded shadow-2xs inline-block my-0.5"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </>
  );
}

export default function FloatingMissionPanel({
  evalResult,
  isOpen,
  setIsOpen,
  activeCategoryFilter,
  setActiveCategoryFilter,
  recentCompletedMission,
  onDismissCelebration
}) {
  const { checklist, totalScore, passedCount, totalCount, percentage } = evalResult;

  // 1. Determine the "Next Default Active Target Mission" in sequential order
  const currentActiveMission = useMemo(() => {
    return checklist.find((m) => !m.passed) || null;
  }, [checklist]);

  // 2. Filter checklist based on selected category
  const filteredChecklist = useMemo(() => {
    if (activeCategoryFilter === 'all') return checklist;
    if (activeCategoryFilter === 'pending') return checklist.filter((c) => !c.passed);
    if (activeCategoryFilter === 'passed') return checklist.filter((c) => c.passed);
    return checklist.filter((c) => c.categoryCode === activeCategoryFilter);
  }, [checklist, activeCategoryFilter]);

  const categories = [
    { id: 'all', label: `Semua (${totalCount})` },
    { id: 'pending', label: `Belum (${totalCount - passedCount})` },
    { id: 'passed', label: `Selesai (${passedCount})` },
    { id: 'folder', label: 'Folder' },
    { id: 'file', label: 'Berkas' },
    { id: 'create', label: 'Buat Baru' },
    { id: 'special', label: 'Proyek' }
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING CELEBRATION TOAST (Sound + Fireworks Alert Banner) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {recentCompletedMission && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto shadow-2xl"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900/95 text-white backdrop-blur-xl border border-emerald-500/50 rounded-2xl ring-4 ring-emerald-500/20 shadow-emerald-900/40">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    🎉 Misi Selesai!
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    +{recentCompletedMission.points}p
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-100 truncate max-w-[240px] sm:max-w-xs">
                  {recentCompletedMission.title}
                </div>
              </div>
              <button
                type="button"
                onClick={onDismissCelebration}
                title="Tutup"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. DOCKED FLOATING MINIMIZED PILL (Pinned to Left Screen - Ultra Compact) */}
      {/* ========================================================================= */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-3 sm:left-4 top-22 sm:top-24 z-40"
        >
          <button
            type="button"
            id="btn-open-floating-misi"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-2.5 py-1.5 bg-white/95 hover:bg-white text-slate-800 backdrop-blur-md rounded-full border border-indigo-200/90 shadow-md hover:shadow-lg hover:border-indigo-400 transition-all text-left select-none"
            title="Buka Daftar Misi"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Target className="w-3 h-3" />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                Misi
              </span>
              <span className="text-xs font-black text-slate-800">
                {passedCount}/{totalCount}
              </span>
            </div>

            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. SLIDING TRANSLUCENT DRAWER (Left Floating Panel) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dimmer on Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
            />

            {/* Sliding Translucent Container */}
            <motion.aside
              initial={{ x: '-100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-20 bottom-4 sm:top-24 sm:bottom-6 z-50 w-[94vw] max-w-[390px] sm:max-w-[420px] bg-white/95 backdrop-blur-2xl border-r border-slate-200/90 shadow-2xl rounded-r-3xl flex flex-col overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-br from-indigo-50/70 via-slate-50/50 to-white/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        Checklist Praktik
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {passedCount}/{totalCount} Selesai
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight mt-0.5">
                      Daftar 25 Target Misi
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playMissionSuccessSound();
                      triggerMissionFireworkAnimation();
                    }}
                    title="Cek Sound & Animasi Petasan"
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="btn-close-floating-misi"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                    title="Sembunyikan Panel"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Score & Progress Status */}
              <div className="px-4 py-3 bg-white/70 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Skor Akumulasi</div>
                  <div className="text-base font-black text-indigo-600 leading-none mt-0.5">
                    {totalScore} <span className="text-xs font-normal text-slate-400">/ 100 Poin</span>
                  </div>
                </div>

                <div className="flex-1 max-w-[170px]">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>Kemajuan</span>
                    <span className="text-indigo-600">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        totalScore === 100
                          ? 'bg-emerald-500'
                          : totalScore >= 60
                          ? 'bg-indigo-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* ========================================================= */}
                {/* PROMINENT SPOTLIGHT: DEFAULT 1 TARGET MISI SESUAI URUTAN */}
                {/* ========================================================= */}
                {currentActiveMission ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-lg border border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                        <Flame className="w-3 h-3 fill-slate-950" />
                        Target Misi Sekarang
                      </span>
                      <span className="text-[11px] font-black text-amber-300">
                        +{currentActiveMission.points} Poin
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 mt-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-800 text-indigo-200 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        #{currentActiveMission.id.replace('m', '')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-white leading-snug">
                          {currentActiveMission.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          <FormatInstruction text={currentActiveMission.instruction} />
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-indigo-300">
                      <span>Kategori: <strong>{currentActiveMission.category}</strong></span>
                      <span className="text-amber-300/90 font-medium">Lakukan di File Explorer &rarr;</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-sm font-black text-emerald-950">Semua Misi Tuntas!</strong>
                      <p className="text-emerald-800 text-[11px] mt-0.5">
                        Anda telah menyelesaikan seluruh 25 target misi (100 Poin). Klik Kumpulkan Tugas!
                      </p>
                    </div>
                  </div>
                )}

                {/* Filter Tabs */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Filter Kategori:
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition select-none ${
                          activeCategoryFilter === cat.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* All 25 Mission Items List */}
                <div className="space-y-2">
                  {filteredChecklist.map((m) => {
                    const isCurrent = currentActiveMission?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-2xl border transition-all text-xs flex items-start gap-2.5 ${
                          m.passed
                            ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950'
                            : isCurrent
                            ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-slate-800'
                            : 'bg-white/90 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {m.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isCurrent ? 'border-indigo-600 bg-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-slate-400">
                              Misi #{m.id.replace('m', '')}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                                m.passed
                                  ? 'bg-emerald-200/80 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              +{m.points}p
                            </span>
                          </div>

                          <div className="font-bold text-slate-800 leading-snug">
                            {m.title}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            <FormatInstruction text={m.instruction} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Klik tanda panah untuk menutup</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition shadow-2xs"
                >
                  Tutup Panel
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
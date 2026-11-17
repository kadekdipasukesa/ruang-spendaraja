import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Check,
  Copy,
  ExternalLink,
  Play,
  StopCircle,
  Zap,
  Trash2,
  Clock,
  Timer,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function AdminRoomControlCard({
  currentSesi,
  pesertaCount = 0,
  newDurasi,
  onChangeDurasi,
  onApplyDurasi,
  onStartExam,
  onForceOngoing,
  onFinishExam,
  onResetPin,
  onOpenDeleteModal,
  onApplyToFront,
  onUpdateJudulRoom,
  actionLoading,
  copiedPin,
  onCopyPin,
}) {
  // State edit nama room inline
  const [isEditingJudul, setIsEditingJudul] = useState(false);
  const [judulInput, setJudulInput] = useState(currentSesi?.judul || '');

  useEffect(() => {
    setJudulInput(currentSesi?.judul || '');
    setIsEditingJudul(false);
  }, [currentSesi?.id, currentSesi?.judul]);

  const handleSaveJudul = async () => {
    if (!judulInput.trim()) return;
    if (onUpdateJudulRoom) {
      await onUpdateJudulRoom(judulInput.trim());
    }
    setIsEditingJudul(false);
  };

  // State sisa waktu realtime room
  const [roomTimeRemaining, setRoomTimeRemaining] = useState(null);

  useEffect(() => {
    if (!currentSesi || currentSesi.status === 'finished' || currentSesi.status === 'archived') {
      setRoomTimeRemaining(null);
      return;
    }

    if (currentSesi.status === 'waiting') {
      setRoomTimeRemaining('Belum Dimulai');
      return;
    }

    const hitungSisa = () => {
      const durasiMenit = parseInt(currentSesi.durasi_menit, 10) || 80;
      const totalDetik = durasiMenit * 60;

      // Ambil waktu mulai resmi, fallback ke created_at
      const startTimestamp = new Date(currentSesi.waktu_mulai || currentSesi.created_at).getTime();
      if (isNaN(startTimestamp)) {
        setRoomTimeRemaining(`${durasiMenit}:00`);
        return;
      }

      const elapsed = Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000));
      const remaining = Math.max(0, totalDetik - elapsed);

      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;

      if (h > 0) {
        setRoomTimeRemaining(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
      } else {
        setRoomTimeRemaining(
          `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
      }
    };

    hitungSisa();
    const timer = setInterval(hitungSisa, 1000);
    return () => clearInterval(timer);
  }, [currentSesi?.id, currentSesi?.status, currentSesi?.durasi_menit, currentSesi?.waktu_mulai, currentSesi?.created_at]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* 1. Card Identitas Room Terpilih */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Room Terpilih</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                currentSesi?.status === 'ongoing'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                  : currentSesi?.status === 'waiting'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : currentSesi?.status === 'starting'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {currentSesi?.status || 'NONAKTIF'}
            </span>
          </div>

          {/* Token PIN Besar & Tombol Copy */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-4xl sm:text-5xl font-mono font-black text-blue-400 tracking-wider">
              {currentSesi?.pin_ujian || '—'}
            </span>
            <button
              type="button"
              onClick={() => onCopyPin(currentSesi?.pin_ujian)}
              disabled={!currentSesi?.pin_ujian}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Salin Token PIN"
            >
              {copiedPin ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Nama Room / Judul */}
          <div className="mt-3">
            {isEditingJudul ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={judulInput}
                  onChange={(e) => setJudulInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveJudul();
                    if (e.key === 'Escape') setIsEditingJudul(false);
                  }}
                  className="flex-1 bg-slate-950 border border-blue-500 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  placeholder="Nama Room..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveJudul}
                  className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                  title="Simpan Nama Room"
                >
                  <Save size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingJudul(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400"
                  title="Batal"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-xs font-bold text-slate-200 truncate" title={currentSesi?.judul}>
                  {currentSesi?.judul || 'Ulangan Harian Informatika'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingJudul(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                  title="Ubah Nama Room"
                >
                  <Edit2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span>Peserta terhubung:</span>
          <strong className="text-white font-mono text-sm">{pesertaCount} Siswa</strong>
        </div>

        {/* Tombol Terapkan ke Layar Depan */}
        <button
          type="button"
          onClick={onApplyToFront}
          className="mt-3 w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ExternalLink size={12} />
          <span>Gunakan Sebagai Sesi Ulangan Depan</span>
        </button>
      </div>

      {/* 2. Card Sisa Waktu & Pengaturan Durasi */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between shadow-xl">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Status Waktu &amp; Durasi Pengerjaan
          </span>

          {/* Sisa Waktu Realtime Room */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Sisa Waktu Room:</span>
              <div className="text-xl sm:text-2xl font-mono font-black text-amber-300 flex items-center gap-2 mt-0.5">
                <Timer size={18} className="text-amber-400 animate-pulse" />
                <span>{roomTimeRemaining || '—'}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 text-right">
              Maks: <strong className="text-white">{currentSesi?.durasi_menit || 80}m</strong>
            </span>
          </div>

          {/* Form Ubah Durasi */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Setel Durasi Ulangan:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={10}
                max={180}
                value={newDurasi}
                onChange={(e) => onChangeDurasi(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onApplyDurasi();
                }}
                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-center font-bold text-amber-300 text-sm outline-none focus:border-amber-400"
              />
              <span className="text-xs text-slate-400 font-semibold">Menit</span>
              <button
                type="button"
                onClick={onApplyDurasi}
                disabled={actionLoading || parseInt(newDurasi, 10) === currentSesi?.durasi_menit}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-xs rounded-lg transition cursor-pointer shadow-sm active:scale-95 shrink-0"
                title="Simpan durasi ini dan sinkronkan ke seluruh siswa detik ini juga"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800">
          Mengubah durasi otomatis memperbarui sisa waktu di seluruh layar siswa secara live.
        </span>
      </div>

      {/* 3. Card Aksi Kontrol Room */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-center gap-2.5 shadow-xl">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Kontrol &amp; Manajemen Sesi
        </span>

        {/* Tombol Mulai Ujian (Waiting) */}
        {currentSesi?.status === 'waiting' && (
          <button
            type="button"
            onClick={onStartExam}
            disabled={actionLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition cursor-pointer active:scale-98"
          >
            {actionLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span>MULAI UJIAN ROOM INI</span>
          </button>
        )}

        {/* Tombol Paksa Ongoing (Starting) */}
        {currentSesi?.status === 'starting' && (
          <button
            type="button"
            onClick={onForceOngoing}
            disabled={actionLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-700/30 transition cursor-pointer active:scale-98"
          >
            <Zap size={16} />
            <span>BUKA SOAL SEKARANG (SET ONGOING)</span>
          </button>
        )}

        {/* Tombol Selesaikan Ujian (Ongoing) */}
        {currentSesi?.status === 'ongoing' && (
          <button
            type="button"
            onClick={onFinishExam}
            disabled={actionLoading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/30 transition cursor-pointer active:scale-98"
          >
            {actionLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <StopCircle size={16} />
            )}
            <span>HENTIKAN / AKHIRI UJIAN ROOM INI</span>
          </button>
        )}

        {/* Tombol Ganti PIN / Reset Token */}
        <button
          type="button"
          onClick={onResetPin}
          disabled={actionLoading}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
        >
          <KeyRound size={14} className="text-amber-400" />
          <span>Ganti PIN / Buka Ulang Ruang Tunggu</span>
        </button>

        {/* Tombol Hapus Room Permanen */}
        {currentSesi?.id && (
          <button
            type="button"
            onClick={onOpenDeleteModal}
            disabled={actionLoading}
            className="w-full py-2 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Trash2 size={13} />
            <span>Hapus Room &amp; Seluruh Datanya</span>
          </button>
        )}
      </div>

    </div>
  );
}


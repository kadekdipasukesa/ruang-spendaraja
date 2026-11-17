import React, { useState, useEffect } from 'react';
import { Users, Search, Unlock, Clock, Timer, CheckCircle2 } from 'lucide-react';

export default function AdminPesertaTable({
  currentSesi,
  peserta = [],
  filteredPeserta = [],
  stats = { ongoingCount: 0, submittedCount: 0, blockedCount: 0 },
  filterStatus = 'all',
  onSelectFilterStatus,
  searchQuery = '',
  onSearchChange,
  onUnblockStudent,
  loadingPeserta = false,
}) {
  // Sisa waktu realtime room di header tabel
  const [liveRemainingTime, setLiveRemainingTime] = useState(null);

  useEffect(() => {
    if (!currentSesi || currentSesi.status === 'finished' || currentSesi.status === 'archived') {
      setLiveRemainingTime(currentSesi?.status === 'finished' ? 'Selesai' : null);
      return;
    }

    if (currentSesi.status === 'waiting') {
      setLiveRemainingTime('Belum Mulai');
      return;
    }

    const updateTimer = () => {
      const durasiMenit = parseInt(currentSesi.durasi_menit, 10) || 80;
      const totalDetik = durasiMenit * 60;
      const startTimestamp = new Date(currentSesi.waktu_mulai || currentSesi.created_at).getTime();

      if (isNaN(startTimestamp)) {
        setLiveRemainingTime(`${durasiMenit}:00`);
        return;
      }

      const elapsed = Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000));
      const remaining = Math.max(0, totalDetik - elapsed);

      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;

      if (h > 0) {
        setLiveRemainingTime(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
      } else {
        setLiveRemainingTime(
          `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentSesi?.id, currentSesi?.status, currentSesi?.durasi_menit, currentSesi?.waktu_mulai, currentSesi?.created_at]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
      
      {/* Header Tabel & Widget Sisa Waktu Room Realtime */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
              <span>Peserta Room [{currentSesi?.pin_ujian || '—'}]</span>
              <span className="text-xs font-normal text-slate-400">({peserta.length} Siswa Terhubung)</span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-sm">
              {currentSesi?.judul || 'Ulangan Harian Informatika'}
            </p>
          </div>
          {loadingPeserta && (
            <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin ml-2" />
          )}
        </div>

        {/* Widget Sisa Waktu Realtime untuk Monitor Guru */}
        {liveRemainingTime && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 flex items-center gap-2 shadow-inner">
            <Timer size={15} className="text-amber-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Sisa Waktu:</span>
            <span className="font-mono text-sm sm:text-base font-black text-amber-300">
              {liveRemainingTime}
            </span>
          </div>
        )}
      </div>

      {/* Baris Filter & Search Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Status Siswa Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelectFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({peserta.length})
          </button>
          <button
            type="button"
            onClick={() => onSelectFilterStatus('ongoing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'ongoing' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mengerjakan ({stats.ongoingCount})
          </button>
          <button
            type="button"
            onClick={() => onSelectFilterStatus('submitted')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'submitted' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Selesai ({stats.submittedCount})
          </button>
          <button
            type="button"
            onClick={() => onSelectFilterStatus('blocked')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              filterStatus === 'blocked' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terblokir ({stats.blockedCount})
          </button>
        </div>

        {/* Kotak Input Pencarian */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama, absen, kelas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Tabel Konten Peserta */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
              <th className="p-3.5">Absen</th>
              <th className="p-3.5">Nama Siswa</th>
              <th className="p-3.5 text-center">Kelas</th>
              <th className="p-3.5 text-center">Status Ujian</th>
              <th className="p-3.5 text-center">Pelanggaran</th>
              <th className="p-3.5 text-right">Skor Akhir</th>
              <th className="p-3.5 text-center">Aksi Pengawas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium bg-slate-900/60">
            {filteredPeserta.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  {peserta.length === 0
                    ? `Belum ada siswa yang masuk ke room PIN ${currentSesi?.pin_ujian || '—'}.`
                    : 'Tidak ada siswa yang cocok dengan filter pencarian.'}
                </td>
              </tr>
            ) : (
              filteredPeserta.map((p) => {
                const siswaInfo = p.master_siswa || {};
                const noAbsen = siswaInfo['No Absen'] || siswaInfo.No_Absen || '—';
                const nama = siswaInfo.NAMA || 'Siswa Tanpa Nama';
                const kelas = siswaInfo.Kelas || '7';

                const isBlocked = p.status_ujian === 'blocked' || p.cheat_count >= 3;
                const hasCheat = p.cheat_count > 0;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isBlocked
                        ? 'bg-red-950/30'
                        : hasCheat
                        ? 'bg-amber-950/20'
                        : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono font-bold text-slate-400">
                      {noAbsen}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {nama}
                    </td>
                    <td className="p-3.5 text-center text-slate-400">
                      {kelas}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          p.status_ujian === 'submitted'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isBlocked
                            ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                            : p.status_ujian === 'ongoing'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isBlocked ? 'TERBLOKIR' : p.status_ujian}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                          p.cheat_count >= 3
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : p.cheat_count > 0
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {p.cheat_count} / 3
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-slate-200">
                      {p.nilai_akhir !== null ? `${p.nilai_akhir} pt` : '—'}
                    </td>
                    <td className="p-3.5 text-center">
                      {isBlocked ? (
                        <button
                          type="button"
                          onClick={() => onUnblockStudent(p.id, nama)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-red-900/30"
                        >
                          <Unlock size={13} /> Buka Blokir
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


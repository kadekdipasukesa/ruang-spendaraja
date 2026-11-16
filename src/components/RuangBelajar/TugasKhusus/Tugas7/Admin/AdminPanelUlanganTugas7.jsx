import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabaseClient';
import {
  ShieldAlert,
  Play,
  StopCircle,
  RefreshCw,
  Users,
  KeyRound,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Unlock,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export default function AdminPanelUlanganTugas7({
  sesi,
  onClose,
  onRefreshSesi,
}) {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDurasi, setNewDurasi] = useState(sesi?.durasi_menit || 90);
  const [actionLoading, setActionLoading] = useState(false);

  // Ambil data peserta live
  useEffect(() => {
    if (!sesi?.id) return;
    fetchPeserta(sesi.id);

    // Realtime listener perubahan tabel ujian_peserta
    const channelId = `admin_peserta_t7_${sesi.id}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ujian_peserta',
          filter: `sesi_id=eq.${sesi.id}`,
        },
        () => fetchPeserta(sesi.id)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sesi?.id]);

  const fetchPeserta = async (sesiId) => {
    try {
      const { data, error } = await supabase
        .from('ujian_peserta')
        .select('*, master_siswa(id, NAMA, Kelas, No_Absen)')
        .eq('sesi_id', sesiId)
        .order('id', { ascending: true });

      if (!error && data) {
        setPeserta(data);
      }
    } catch (err) {
      console.error('Error fetch peserta:', err);
    }
  };

  // Generate PIN Acak 5 Karakter
  const generateNewPin = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pin = '';
    for (let i = 0; i < 5; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  };

  // Mulai Ujian (Set status = 'starting' -> memicu countdown 3..2..1)
  const handleStartExam = async () => {
    if (!sesi?.id) return;
    if (!window.confirm(`Mulai sesi ujian sekarang untuk ${peserta.length} siswa yang terhubung?`)) return;

    setActionLoading(true);
    try {
      // 1. Set status 'starting' agar countdown muncul di seluruh layar siswa
      await supabase
        .from('ujian_sesi')
        .update({ status: 'starting' })
        .eq('id', sesi.id);

      // 2. Setelah 3.5 detik, ubah ke 'ongoing'
      setTimeout(async () => {
        await supabase
          .from('ujian_sesi')
          .update({ status: 'ongoing' })
          .eq('id', sesi.id);

        if (onRefreshSesi) onRefreshSesi();
        setActionLoading(false);
      }, 3500);
    } catch (err) {
      console.error('Gagal memulai ujian:', err);
      setActionLoading(false);
    }
  };

  // Akhiri Ujian
  const handleFinishExam = async () => {
    if (!sesi?.id) return;
    if (!window.confirm('Yakin ingin mengakhiri sesi ujian ini untuk seluruh siswa?')) return;

    setActionLoading(true);
    try {
      await supabase
        .from('ujian_sesi')
        .update({ status: 'finished' })
        .eq('id', sesi.id);

      if (onRefreshSesi) onRefreshSesi();
    } catch (err) {
      console.error('Gagal mengakhiri ujian:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Sesi ke Waiting Room dengan Token Baru
  const handleResetWithNewPin = async () => {
    if (!sesi?.id) return;
    const newPin = generateNewPin();
    if (!window.confirm(`Buat token baru (${newPin}) dan reset sesi ke Ruang Tunggu?`)) return;

    setActionLoading(true);
    try {
      await supabase
        .from('ujian_sesi')
        .update({
          pin_ujian: newPin,
          status: 'waiting',
          durasi_menit: parseInt(newDurasi) || 90,
        })
        .eq('id', sesi.id);

      if (onRefreshSesi) onRefreshSesi();
    } catch (err) {
      console.error('Gagal reset pin:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Pelanggaran & Buka Blokir Siswa
  const handleUnblockStudent = async (pesertaId, namaSiswa) => {
    if (!window.confirm(`Buka blokir dan reset pelanggaran untuk siswa: ${namaSiswa}?`)) return;

    try {
      const { error } = await supabase
        .from('ujian_peserta')
        .update({
          cheat_count: 0,
          status_ujian: 'ongoing',
        })
        .eq('id', pesertaId);

      if (error) throw error;
      fetchPeserta(sesi.id);
    } catch (err) {
      alert('Gagal membuka blokir: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 text-white overflow-y-auto p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Kembali ke Layar Ujian"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                PROCTORING PANEL • GURU / ADMIN
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white">
                Kontrol Ujian &amp; Anti-Cheat Realtime
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchPeserta(sesi?.id)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Segarkan Data</span>
          </button>
        </div>

        {/* Baris Kontrol Sesi & KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card PIN & Status */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Token PIN Sesi Aktif
            </span>
            <div className="flex items-center justify-between">
              <span className="text-4xl sm:text-5xl font-mono font-black text-blue-400 tracking-wider">
                {sesi?.pin_ujian || '—'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                sesi?.status === 'ongoing'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : sesi?.status === 'waiting'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {sesi?.status || 'waiting'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Berikan token ini kepada siswa agar bisa masuk ke ruang tunggu.
            </p>
          </div>

          {/* Card Durasi & Siswa */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Kapasitas &amp; Waktu
              </span>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-xs text-slate-400">Total Siswa Terhubung:</span>
                  <p className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
                    <Users size={20} className="text-blue-400" />
                    <span>{peserta.length} Siswa</span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Durasi Ujian:</span>
                  <p className="text-2xl font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
                    <Clock size={20} className="text-amber-400" />
                    <span>{sesi?.durasi_menit || 90} Mnt</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Tombol Aksi Utama */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-center gap-2.5">
            {sesi?.status === 'waiting' && (
              <button
                type="button"
                onClick={handleStartExam}
                disabled={actionLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition cursor-pointer"
              >
                <Play size={16} fill="currentColor" />
                <span>MULAI UJIAN SERENTAK</span>
              </button>
            )}

            {sesi?.status === 'ongoing' && (
              <button
                type="button"
                onClick={handleFinishExam}
                disabled={actionLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/30 transition cursor-pointer"
              >
                <StopCircle size={16} />
                <span>AKHIRI UJIAN SEKARANG</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetWithNewPin}
              disabled={actionLoading}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <KeyRound size={14} />
              <span>Ganti Token PIN &amp; Buka Ruang Tunggu</span>
            </button>
          </div>

        </div>

        {/* Tabel Live Proctoring Peserta */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h3 className="font-bold text-sm text-white">
                Live Monitoring Peserta ({peserta.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Sinkronisasi realtime via Supabase
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                  <th className="p-3.5">Absen</th>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5 text-center">Kelas</th>
                  <th className="p-3.5 text-center">Status Ujian</th>
                  <th className="p-3.5 text-center">Pelanggaran</th>
                  <th className="p-3.5 text-right">Skor Live</th>
                  <th className="p-3.5 text-center">Tindakan Pengawas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {peserta.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Belum ada siswa yang terhubung ke sesi PIN ini.
                    </td>
                  </tr>
                ) : (
                  peserta.map((p) => {
                    const siswaInfo = p.master_siswa || {};
                    const isBlocked = p.status_ujian === 'blocked' || p.cheat_count >= 3;
                    const hasCheat = p.cheat_count > 0;

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isBlocked
                            ? 'bg-red-950/20'
                            : hasCheat
                            ? 'bg-amber-950/15'
                            : ''
                        }`}
                      >
                        <td className="p-3.5 font-bold text-slate-400">
                          {siswaInfo.No_Absen || '—'}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {siswaInfo.NAMA || 'Siswa Tanpa Nama'}
                        </td>
                        <td className="p-3.5 text-center text-slate-400">
                          {siswaInfo.Kelas || '7'}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              p.status_ujian === 'submitted'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : p.status_ujian === 'blocked'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                                : p.status_ujian === 'ongoing'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {p.status_ujian}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`font-black text-sm px-2 py-0.5 rounded-lg ${
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
                        <td className="p-3.5 text-right font-mono font-black text-slate-300">
                          {p.nilai_akhir !== null ? `${p.nilai_akhir} pt` : '—'}
                        </td>
                        <td className="p-3.5 text-center">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => handleUnblockStudent(p.id, siswaInfo.NAMA)}
                              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer shadow-sm"
                            >
                              <Unlock size={12} /> Buka Blokir
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

      </div>
    </div>
  );
}

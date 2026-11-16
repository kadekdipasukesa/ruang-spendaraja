import React, { useState, useEffect, useCallback } from 'react';
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
  Sparkles,
} from 'lucide-react';

export default function AdminPanelUlanganTugas7({
  sesi: propSesi,
  onClose,
  onRefreshSesi,
}) {
  const [currentSesi, setCurrentSesi] = useState(propSesi || null);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDurasi, setNewDurasi] = useState(propSesi?.durasi_menit || 90);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Helper menampilkan notifikasi banner sementara
  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Ambil sesi aktif terbaru jika propSesi belum ada
  const fetchActiveSession = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setCurrentSesi(data);
        setNewDurasi(data.durasi_menit || 90);
        fetchPeserta(data.id);
        if (onRefreshSesi) onRefreshSesi(data);
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    } finally {
      setLoading(false);
    }
  }, [onRefreshSesi]);

  // Initial load
  useEffect(() => {
    if (propSesi) {
      setCurrentSesi(propSesi);
      setNewDurasi(propSesi.durasi_menit || 90);
      fetchPeserta(propSesi.id);
    } else {
      fetchActiveSession();
    }
  }, [propSesi, fetchActiveSession]);

  // Realtime listener tabel ujian_peserta
  useEffect(() => {
    if (!currentSesi?.id) return;

    const channelId = `admin_peserta_t7_${currentSesi.id}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ujian_peserta',
          filter: `sesi_id=eq.${currentSesi.id}`,
        },
        () => fetchPeserta(currentSesi.id)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentSesi?.id]);

  const fetchPeserta = async (sesiId) => {
    if (!sesiId) return;
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

  // Generate PIN Acak 5 Karakter Unik
  const generateNewPin = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pin = '';
    for (let i = 0; i < 5; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  };

  // Ganti Token PIN & Buka Ruang Tunggu (Bisa Update atau Insert jika belum ada sesi)
  const handleResetWithNewPin = async () => {
    const newPin = generateNewPin();
    const durasiInt = parseInt(newDurasi, 10) || 90;

    if (!window.confirm(`Aktifkan Token Baru: "${newPin}" dan buka Ruang Tunggu ujian (${durasiInt} Menit)?`)) {
      return;
    }

    setActionLoading(true);
    try {
      let updated = null;

      if (currentSesi?.id) {
        // Update sesi yang sedang aktif
        const { data, error } = await supabase
          .from('ujian_sesi')
          .update({
            pin_ujian: newPin,
            status: 'waiting',
            durasi_menit: durasiInt,
          })
          .eq('id', currentSesi.id)
          .select()
          .single();

        if (error) throw error;
        updated = data;
      } else {
        // Belum ada sesi di database -> Buat baru (Insert)
        const { data, error } = await supabase
          .from('ujian_sesi')
          .insert([
            {
              pin_ujian: newPin,
              status: 'waiting',
              judul: 'Ulangan Informatika (Persiapan Tes Sumatif Ganjil)',
              durasi_menit: durasiInt,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        updated = data;
      }

      setCurrentSesi(updated);
      setPeserta([]); // Reset daftar peserta untuk sesi baru
      if (onRefreshSesi) onRefreshSesi(updated);

      showNotif(`Token PIN Baru Berhasil Dibuat: ${newPin}. Ruang Tunggu Siap!`);
    } catch (err) {
      console.error('Gagal reset / buat token:', err);
      alert('Gagal mengaktifkan token baru: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setActionLoading(false);
    }
  };

  // Mulai Ujian Serentak (Status 'starting' -> memicu countdown di semua client)
  const handleStartExam = async () => {
    if (!currentSesi?.id) {
      alert('Belum ada sesi ujian aktif. Silakan klik "Ganti Token PIN & Buka Ruang Tunggu" terlebih dahulu.');
      return;
    }

    if (!window.confirm(`Mulai sesi ujian sekarang untuk ${peserta.length} siswa yang telah terhubung?`)) {
      return;
    }

    setActionLoading(true);
    try {
      // 1. Set status 'starting' agar countdown 3..2..1 muncul di seluruh layar siswa
      await supabase
        .from('ujian_sesi')
        .update({ status: 'starting' })
        .eq('id', currentSesi.id);

      setCurrentSesi((prev) => ({ ...prev, status: 'starting' }));

      // 2. Setelah 3.5 detik, ubah ke 'ongoing'
      setTimeout(async () => {
        const { data: ongoingData } = await supabase
          .from('ujian_sesi')
          .update({ status: 'ongoing' })
          .eq('id', currentSesi.id)
          .select()
          .single();

        if (ongoingData) {
          setCurrentSesi(ongoingData);
          if (onRefreshSesi) onRefreshSesi(ongoingData);
        }
        setActionLoading(false);
        showNotif('Ujian resmi dimulai! Siswa sedang mengerjakan soal.');
      }, 3500);
    } catch (err) {
      console.error('Gagal memulai ujian:', err);
      alert('Gagal memulai ujian: ' + err.message);
      setActionLoading(false);
    }
  };

  // Akhiri Sesi Ujian Sekarang
  const handleFinishExam = async () => {
    if (!currentSesi?.id) return;
    if (!window.confirm('Yakin ingin mengakhiri sesi ujian sekarang? Siswa yang belum submit akan otomatis dinilai.')) {
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .update({ status: 'finished' })
        .eq('id', currentSesi.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSesi(data);
      if (onRefreshSesi) onRefreshSesi(data);
      showNotif('Sesi ujian telah diakhiri.');
    } catch (err) {
      console.error('Gagal mengakhiri ujian:', err);
      alert('Gagal mengakhiri ujian: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Buka Blokir & Reset Pelanggaran Siswa
  const handleUnblockStudent = async (pesertaId, namaSiswa) => {
    if (!window.confirm(`Reset pelanggaran (0) dan buka kembali akses untuk siswa: ${namaSiswa}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ujian_peserta')
        .update({
          cheat_count: 0,
          status_ujian: 'ongoing',
        })
        .eq('id', pesertaId);

      if (error) throw error;
      showNotif(`Akses ujian untuk ${namaSiswa} telah dibuka kembali.`);
      fetchPeserta(currentSesi?.id);
    } catch (err) {
      alert('Gagal membuka blokir: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl text-white overflow-y-auto p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Banner Notifikasi Sukses / Error */}
        {notification && (
          <div
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg ${
              notification.type === 'error'
                ? 'bg-red-950/90 border-red-500 text-red-200'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
            }`}
          >
            <span>{notification.msg}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs uppercase underline cursor-pointer ml-3 opacity-80 hover:opacity-100"
            >
              Tutup
            </button>
          </div>
        )}

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
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                PROCTORING CBT • GURU / ADMIN
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white">
                Kontrol Ujian &amp; Anti-Cheat Realtime
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (currentSesi?.id) fetchPeserta(currentSesi.id);
                else fetchActiveSession();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Segarkan Data</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-blue-600/30"
            >
              Tutup Panel
            </button>
          </div>
        </div>

        {/* Baris Kontrol Sesi & KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card PIN & Status */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Token PIN Sesi Aktif
              </span>
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-mono font-black text-blue-400 tracking-wider">
                  {currentSesi?.pin_ujian || 'BELUM ADA'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    currentSesi?.status === 'ongoing'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                      : currentSesi?.status === 'waiting'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {currentSesi?.status || 'NONAKTIF'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
              Siswa memasukkan kode 5 huruf ini pada form PIN untuk masuk ke ruang tunggu.
            </p>
          </div>

          {/* Card Kapasitas & Durasi Waktu */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Kapasitas &amp; Pengaturan Waktu
              </span>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <span className="text-[11px] text-slate-400">Siswa Terhubung:</span>
                  <p className="text-2xl font-black text-white flex items-center gap-1.5 mt-0.5">
                    <Users size={18} className="text-blue-400" />
                    <span>{peserta.length} Siswa</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Durasi Pengerjaan:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={newDurasi}
                      onChange={(e) => setNewDurasi(e.target.value)}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-amber-300 text-sm outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-slate-400 font-semibold">Menit</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              Default durasi: 90 menit (50 PG &amp; 5 Esai).
            </span>
          </div>

          {/* Card Tombol Aksi Utama */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-center gap-2.5">
            {/* Tombol Mulai Ujian (jika sesi waiting) */}
            {currentSesi?.status === 'waiting' && (
              <button
                type="button"
                onClick={handleStartExam}
                disabled={actionLoading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition cursor-pointer active:scale-98"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                <span>MULAI UJIAN SERENTAK</span>
              </button>
            )}

            {/* Tombol Selesaikan Ujian (jika sesi ongoing) */}
            {currentSesi?.status === 'ongoing' && (
              <button
                type="button"
                onClick={handleFinishExam}
                disabled={actionLoading}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/30 transition cursor-pointer active:scale-98"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <StopCircle size={16} />
                )}
                <span>AKHIRI SESI UJIAN</span>
              </button>
            )}

            {/* Tombol Utama: Ganti Token PIN & Buka Ruang Tunggu */}
            <button
              type="button"
              onClick={handleResetWithNewPin}
              disabled={actionLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/30 active:scale-98"
            >
              {actionLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <KeyRound size={15} />
              )}
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
              Update otomatis realtime per detik
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
                      Belum ada siswa yang masuk dengan token{' '}
                      <span className="font-mono font-bold text-blue-400">
                        {currentSesi?.pin_ujian || '—'}
                      </span>
                      .
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
                            ? 'bg-red-950/30'
                            : hasCheat
                            ? 'bg-amber-950/20'
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
                        <td className="p-3.5 text-right font-mono font-black text-slate-300">
                          {p.nilai_akhir !== null ? `${p.nilai_akhir} pt` : '—'}
                        </td>
                        <td className="p-3.5 text-center">
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => handleUnblockStudent(p.id, siswaInfo.NAMA)}
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

      </div>
    </div>
  );
}

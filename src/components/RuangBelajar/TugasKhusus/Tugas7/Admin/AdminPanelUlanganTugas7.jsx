import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Search,
  Copy,
  Check,
  Archive,
  PlusCircle,
  Radio,
  ExternalLink,
} from 'lucide-react';

export default function AdminPanelUlanganTugas7({
  sesi: propSesi,
  onClose,
  onRefreshSesi,
}) {
  const [daftarSesi, setDaftarSesi] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(propSesi?.id || null);
  const [currentSesi, setCurrentSesi] = useState(propSesi || null);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [newDurasi, setNewDurasi] = useState(propSesi?.durasi_menit || 90);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Ref agar ID room terpilih tidak tertimpa re-render atau loop
  const selectedRoomIdRef = useRef(propSesi?.id || null);
  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  // State pencarian & filter tabel peserta
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'ongoing', 'submitted', 'blocked'

  // Helper banner notifikasi
  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Salin PIN ke Clipboard
  const handleCopyPin = (pin) => {
    if (!pin) return;
    navigator.clipboard.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
    showNotif(`Token PIN "${pin}" disalin ke clipboard!`);
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

  // 1. AMBIL DATA PESERTA DENGAN QUERY AMAN (master_siswa(*))
  const fetchPeserta = useCallback(async (sesiId) => {
    if (!sesiId) return;
    setLoadingPeserta(true);
    try {
      const { data, error } = await supabase
        .from('ujian_peserta')
        .select('*, master_siswa(*)')
        .eq('sesi_id', sesiId)
        .order('id', { ascending: false });

      if (error) throw error;
      setPeserta(data || []);
    } catch (err) {
      console.error('Error fetch peserta:', err);
      showNotif('Gagal memuat peserta: ' + err.message, 'error');
    } finally {
      setLoadingPeserta(false);
    }
  }, []);

  // 2. AMBIL SEMUA DAFTAR ROOM / SESI DARI DATABASE (TANPA MEMICU LOOPING PARENT)
  const fetchAllRooms = useCallback(async (targetRoomId = null) => {
    setLoading(true);
    try {
      const { data: sesiRows, error: sesiErr } = await supabase
        .from('ujian_sesi')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
        .limit(25);

      if (sesiErr) throw sesiErr;

      // Ambil count peserta
      const { data: allPeserta } = await supabase
        .from('ujian_peserta')
        .select('sesi_id');

      const countsMap = {};
      (allPeserta || []).forEach((p) => {
        countsMap[p.sesi_id] = (countsMap[p.sesi_id] || 0) + 1;
      });

      const enriched = (sesiRows || []).map((s) => ({
        ...s,
        peserta_count: countsMap[s.id] || 0,
      }));

      setDaftarSesi(enriched);

      if (enriched.length > 0) {
        let chosen = null;

        // 1) Jika ada targetRoomId eksplisit
        if (targetRoomId) {
          chosen = enriched.find((s) => s.id === targetRoomId);
        }

        // 2) Jika admin sudah memilih room sebelumnya, TETAPKAN pilihan admin! (Jangan pindah-pindah)
        if (!chosen && selectedRoomIdRef.current) {
          chosen = enriched.find((s) => s.id === selectedRoomIdRef.current);
        }

        // 3) Jika belum pernah ada room yang dipilih, tentukan default awal
        if (!chosen) {
          if (propSesi?.id) {
            chosen = enriched.find((s) => s.id === propSesi.id);
          }

          if (!chosen) {
            // Prioritas: ongoing dengan peserta terbanyak
            const ongoingList = enriched.filter((s) => s.status === 'ongoing');
            if (ongoingList.length > 0) {
              ongoingList.sort((a, b) => b.peserta_count - a.peserta_count);
              chosen = ongoingList[0];
            } else {
              const waitingList = enriched.filter((s) => s.status === 'waiting');
              chosen = waitingList.length > 0 ? waitingList[0] : enriched[0];
            }
          }
        }

        if (chosen) {
          setSelectedRoomId(chosen.id);
          selectedRoomIdRef.current = chosen.id;
          setCurrentSesi(chosen);
          setNewDurasi(chosen.durasi_menit || 90);
          fetchPeserta(chosen.id);
        }
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      showNotif('Gagal memuat daftar room: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [propSesi?.id, fetchPeserta]);

  // Initial mount HANYA 1 KALI (tidak re-run saat parent render)
  useEffect(() => {
    fetchAllRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. REALTIME LISTENER PESERTA PADA ROOM YANG SEDANG DIPILIH ADMIN
  useEffect(() => {
    if (!selectedRoomId) return;

    const channelId = `admin_live_${selectedRoomId}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ujian_peserta',
          filter: `sesi_id=eq.${selectedRoomId}`,
        },
        () => fetchPeserta(selectedRoomId)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedRoomId, fetchPeserta]);

  // GANTI ROOM YANG SEDANG DIPANTAU ADMIN (MANDIRI & ANTI-BOUNCE)
  const handleSelectRoom = (sesiItem) => {
    if (!sesiItem?.id) return;
    // Kunci ID room terpilih
    setSelectedRoomId(sesiItem.id);
    selectedRoomIdRef.current = sesiItem.id;
    setCurrentSesi(sesiItem);
    setNewDurasi(sesiItem.durasi_menit || 90);
    fetchPeserta(sesiItem.id);
    showNotif(`Memantau Room PIN: ${sesiItem.pin_ujian} (${sesiItem.status.toUpperCase()})`);
  };

  // TERAPKAN ROOM INI KE HALAMAN UTAMA CBT (SYNC KE PARENT SECARA EKSPLISIT)
  const handleApplyRoomToExamPage = () => {
    if (!currentSesi) return;
    if (onRefreshSesi) {
      onRefreshSesi(currentSesi);
      showNotif(`Room [${currentSesi.pin_ujian}] diterapkan sebagai sesi ujian aktif!`);
    }
  };

  // BUAT ROOM BARU (TOKEN PIN BARU)
  const handleCreateNewRoom = async () => {
    const newPin = generateNewPin();
    const durasiInt = parseInt(newDurasi, 10) || 90;

    if (!window.confirm(`Buat Ruang Ulangan Baru dengan PIN: "${newPin}" (${durasiInt} Menit)?`)) {
      return;
    }

    setActionLoading(true);
    try {
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

      showNotif(`Room Baru Berhasil Dibuat! PIN: ${newPin}`);
      setSelectedRoomId(data.id);
      selectedRoomIdRef.current = data.id;
      setCurrentSesi(data);
      if (onRefreshSesi) onRefreshSesi(data);
      await fetchAllRooms(data.id);
    } catch (err) {
      console.error('Gagal buat room baru:', err);
      alert('Gagal membuat room: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE DURASI ULANGAN KE DATABASE & SINKRONKAN KE SELURUH SISWA
  const handleUpdateDurasi = async () => {
    if (!currentSesi?.id) return;
    const durasiInt = parseInt(newDurasi, 10);
    if (!durasiInt || durasiInt <= 0) {
      alert('Masukkan durasi yang valid dalam menit (misal: 80)!');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .update({ durasi_menit: durasiInt })
        .eq('id', currentSesi.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSesi(data);
      if (onRefreshSesi) onRefreshSesi(data);
      showNotif(`Durasi Room [${data.pin_ujian}] diubah menjadi ${durasiInt} Menit & disinkronkan ke seluruh siswa!`);
      await fetchAllRooms(data.id);
    } catch (err) {
      console.error('Gagal update durasi:', err);
      alert('Gagal update durasi: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // RESET PIN ROOM INI (UPDATE TOKEN)
  const handleResetCurrentRoomPin = async () => {
    if (!currentSesi?.id) return;
    const newPin = generateNewPin();
    const durasiInt = parseInt(newDurasi, 10) || 90;

    if (!window.confirm(`Ganti PIN Room [${currentSesi.pin_ujian}] menjadi "${newPin}" dan buka Ruang Tunggu?`)) {
      return;
    }

    setActionLoading(true);
    try {
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

      setCurrentSesi(data);
      if (onRefreshSesi) onRefreshSesi(data);
      showNotif(`PIN Room berhasil diubah ke: ${newPin}. Ruang Tunggu aktif!`);
      await fetchAllRooms(data.id);
    } catch (err) {
      alert('Gagal update PIN: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // MULAI UJIAN SERENTAK DI ROOM INI
  const handleStartExam = async () => {
    if (!currentSesi?.id) return;
    if (!window.confirm(`Mulai sesi ujian sekarang di Room [${currentSesi.pin_ujian}] untuk ${peserta.length} siswa?`)) {
      return;
    }

    setActionLoading(true);
    try {
      // 1. Set status 'starting' memicu countdown 3..2..1 di client siswa
      await supabase
        .from('ujian_sesi')
        .update({ status: 'starting' })
        .eq('id', currentSesi.id);

      setCurrentSesi((prev) => ({ ...prev, status: 'starting' }));

      // 2. Setelah 3.5 detik set ke 'ongoing'
      setTimeout(async () => {
        const { data: ongoingData } = await supabase
          .from('ujian_sesi')
          .update({ status: 'ongoing', waktu_mulai: new Date().toISOString() })
          .eq('id', currentSesi.id)
          .select()
          .single();

        if (ongoingData) {
          setCurrentSesi(ongoingData);
          if (onRefreshSesi) onRefreshSesi(ongoingData);
        }
        setActionLoading(false);
        showNotif(`Ujian Room [${currentSesi.pin_ujian}] resmi berjalan (ONGOING)!`);
        fetchAllRooms(currentSesi.id);
      }, 3500);
    } catch (err) {
      alert('Gagal memulai ujian: ' + err.message);
      setActionLoading(false);
    }
  };

  // PAKSA STATUS ONGOING JIKA TERTAHAN
  const handleForceOngoing = async () => {
    if (!currentSesi?.id) return;
    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .update({ status: 'ongoing', waktu_mulai: new Date().toISOString() })
        .eq('id', currentSesi.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSesi(data);
      if (onRefreshSesi) onRefreshSesi(data);
      showNotif(`Status Room [${currentSesi.pin_ujian}] diaktifkan ke ONGOING!`);
      fetchAllRooms(currentSesi.id);
    } catch (e) {
      alert('Gagal set ongoing: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // AKHIRI SESI UJIAN
  const handleFinishExam = async () => {
    if (!currentSesi?.id) return;
    if (!window.confirm(`Akhiri sesi Room [${currentSesi.pin_ujian}] sekarang? Siswa yang belum submit akan otomatis dinilai.`)) {
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
      showNotif(`Sesi Room [${currentSesi.pin_ujian}] telah diakhiri.`);
      fetchAllRooms(data.id);
    } catch (err) {
      alert('Gagal mengakhiri ujian: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ARSIPKAN ROOM INI
  const handleArchiveRoom = async () => {
    if (!currentSesi?.id) return;
    if (!window.confirm(`Arsipkan Room [${currentSesi.pin_ujian}]? Room tidak akan muncul lagi di daftar aktif.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await supabase
        .from('ujian_sesi')
        .update({ status: 'archived' })
        .eq('id', currentSesi.id);

      showNotif(`Room [${currentSesi.pin_ujian}] diarsipkan.`);
      selectedRoomIdRef.current = null;
      setSelectedRoomId(null);
      await fetchAllRooms();
    } catch (e) {
      alert('Gagal arsip room: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // BUKA BLOKIR SISWA
  const handleUnblockStudent = async (pesertaId, namaSiswa) => {
    if (!window.confirm(`Buka blokir dan reset pelanggaran (0) untuk siswa: ${namaSiswa}?`)) {
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
      if (selectedRoomId) fetchPeserta(selectedRoomId);
    } catch (err) {
      alert('Gagal membuka blokir: ' + err.message);
    }
  };

  // FILTER DAN PENCARIAN SISWA
  const filteredPeserta = useMemo(() => {
    return peserta.filter((p) => {
      const siswaInfo = p.master_siswa || {};
      const nama = (siswaInfo.NAMA || '').toLowerCase();
      const kelas = (siswaInfo.Kelas || '').toLowerCase();
      const absen = String(siswaInfo['No Absen'] || siswaInfo.No_Absen || '');
      const query = searchQuery.toLowerCase().trim();

      const matchSearch =
        query === '' ||
        nama.includes(query) ||
        kelas.includes(query) ||
        absen.includes(query);

      if (!matchSearch) return false;

      if (filterStatus === 'ongoing') return p.status_ujian === 'ongoing';
      if (filterStatus === 'submitted') return p.status_ujian === 'submitted';
      if (filterStatus === 'blocked') return p.status_ujian === 'blocked' || p.cheat_count >= 3;
      return true;
    });
  }, [peserta, searchQuery, filterStatus]);

  // Statistik Ringkas Peserta
  const stats = useMemo(() => {
    let ongoingCount = 0;
    let submittedCount = 0;
    let blockedCount = 0;
    peserta.forEach((p) => {
      if (p.status_ujian === 'submitted') submittedCount++;
      else if (p.status_ujian === 'blocked' || p.cheat_count >= 3) blockedCount++;
      else ongoingCount++;
    });
    return { ongoingCount, submittedCount, blockedCount };
  }, [peserta]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl text-white overflow-y-auto p-3 sm:p-6 font-sans">
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

        {/* 1. TOP NAVBAR HEADER */}
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
                PROCTORING CBT • GURU &amp; PENGAWAS
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Panel Kontrol &amp; Live Monitoring Ujian</span>
                {loading && <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchAllRooms(selectedRoomId);
                if (selectedRoomId) fetchPeserta(selectedRoomId);
              }}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Segarkan</span>
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

        {/* 2. SECTION DAFTAR ROOM / SESI ULANGAN AKTIF (ROOM SWITCHER) */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-blue-400 animate-pulse" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Daftar Ruang Ulangan CBT ({daftarSesi.length} Room Tersedia)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCreateNewRoom}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 active:scale-98"
            >
              <PlusCircle size={14} />
              <span>+ Buat Room Baru</span>
            </button>
          </div>

          {/* Grid Pilihan Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {daftarSesi.length === 0 ? (
              <div className="col-span-full p-4 text-center text-slate-500 text-xs font-semibold">
                Belum ada room ujian aktif. Klik "+ Buat Room Baru" untuk mengaktifkan room pertama.
              </div>
            ) : (
              daftarSesi.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const isOngoing = room.status === 'ongoing';
                const isWaiting = room.status === 'waiting';
                const isStarting = room.status === 'starting';

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleSelectRoom(room)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-400 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500'
                        : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="font-mono text-base font-black text-white tracking-wider flex items-center gap-1.5">
                        <KeyRound size={13} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                        {room.pin_ujian}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isOngoing
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isWaiting
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : isStarting
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <span className="flex items-center gap-1 font-bold text-slate-300">
                        <Users size={12} className={room.peserta_count > 0 ? 'text-blue-400' : 'text-slate-500'} />
                        {room.peserta_count} Siswa
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {room.durasi_menit || 90} Mnt
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-bl-lg">
                        DIPILIH
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 3. BARIS KONTROL ROOM TERPILIH & AKSI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Room Terpilih */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>Room Terpilih</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    currentSesi?.status === 'ongoing'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : currentSesi?.status === 'waiting'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {currentSesi?.status || 'NONAKTIF'}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-4xl sm:text-5xl font-mono font-black text-blue-400 tracking-wider">
                  {currentSesi?.pin_ujian || '—'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPin(currentSesi?.pin_ujian)}
                  disabled={!currentSesi?.pin_ujian}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Salin Token PIN"
                >
                  {copiedPin ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span>Siswa terhubung di room ini:</span>
              <strong className="text-white font-mono text-sm">{peserta.length} Siswa</strong>
            </div>

            {/* Tombol Terapkan ke Layar Depan */}
            <button
              type="button"
              onClick={handleApplyRoomToExamPage}
              className="mt-3 w-full py-1.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink size={12} />
              <span>Gunakan Sebagai Sesi Ulangan Depan</span>
            </button>
          </div>

          {/* Card Durasi & Pengaturan */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Pengaturan Durasi Waktu
              </span>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Durasi Ulangan:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={newDurasi}
                      onChange={(e) => setNewDurasi(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateDurasi();
                      }}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-amber-300 text-sm outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-slate-400 font-semibold">Mnt</span>
                    <button
                      type="button"
                      onClick={handleUpdateDurasi}
                      disabled={actionLoading || parseInt(newDurasi, 10) === currentSesi?.durasi_menit}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-[11px] rounded-lg transition cursor-pointer shadow-sm active:scale-95 shrink-0"
                      title="Klik untuk menyimpan perubahan durasi ini ke database dan sinkronkan ke seluruh siswa sekarang"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total Soal:</span>
                  <span className="text-sm font-black text-white mt-1 block">50 PG + 5 Esai</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800">
              Durasi otomatis berlaku untuk seluruh siswa di room ini saat ujian dimulai.
            </span>
          </div>

          {/* Card Aksi Kontrol Room */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col justify-center gap-2">
            
            {/* 1. Tombol Mulai Ujian (Waiting) */}
            {currentSesi?.status === 'waiting' && (
              <button
                type="button"
                onClick={handleStartExam}
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

            {/* 2. Tombol Paksa Ongoing (Starting) */}
            {currentSesi?.status === 'starting' && (
              <button
                type="button"
                onClick={handleForceOngoing}
                disabled={actionLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-700/30 transition cursor-pointer active:scale-98"
              >
                <Zap size={16} />
                <span>AKTIFKAN ONGOING SEKARANG</span>
              </button>
            )}

            {/* 3. Tombol Selesaikan Ujian (Ongoing) */}
            {currentSesi?.status === 'ongoing' && (
              <button
                type="button"
                onClick={handleFinishExam}
                disabled={actionLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/30 transition cursor-pointer active:scale-98"
              >
                {actionLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <StopCircle size={16} />
                )}
                <span>AKHIRI UJIAN ROOM INI</span>
              </button>
            )}

            {/* 4. Tombol Reset / Ganti PIN Room Ini */}
            <button
              type="button"
              onClick={handleResetCurrentRoomPin}
              disabled={actionLoading}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <KeyRound size={14} className="text-amber-400" />
              <span>Ganti PIN / Buka Ulang Ruang Tunggu</span>
            </button>

            {/* 5. Tombol Arsipkan Room */}
            {currentSesi?.id && (
              <button
                type="button"
                onClick={handleArchiveRoom}
                disabled={actionLoading}
                className="text-[11px] text-slate-500 hover:text-red-400 text-center transition cursor-pointer pt-1"
              >
                Arsipkan Room Ini (Sembunyikan)
              </button>
            )}
          </div>

        </div>

        {/* 4. TABEL MONITORING PESERTA REALTIME */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
          
          {/* Header Tabel & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h3 className="font-bold text-sm text-white">
                Daftar Peserta di Room [{currentSesi?.pin_ujian || '—'}] ({peserta.length} Siswa)
              </h3>
              {loadingPeserta && (
                <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Filter Status Siswa Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({peserta.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('ongoing')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'ongoing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mengerjakan ({stats.ongoingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('submitted')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'submitted' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Selesai ({stats.submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('blocked')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'blocked' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Terblokir ({stats.blockedCount})
              </button>
            </div>
          </div>

          {/* Kotak Input Pencarian */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama siswa, nomor absen, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Tabel Konten Peserta */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                  <th className="p-3.5">Absen</th>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5 text-center">Kelas</th>
                  <th className="p-3.5 text-center">Status Ujian</th>
                  <th className="p-3.5 text-center">Pelanggaran</th>
                  <th className="p-3.5 text-right">Skor Akhir</th>
                  <th className="p-3.5 text-center">Aksi Pengawas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
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
                              onClick={() => handleUnblockStudent(p.id, nama)}
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

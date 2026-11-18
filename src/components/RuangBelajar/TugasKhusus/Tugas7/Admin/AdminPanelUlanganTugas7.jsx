import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../../../lib/supabaseClient';

// Import Sub-Komponen Modular Admin Panel
import AdminTopBar from './AdminTopBar';
import AdminRoomSelector from './AdminRoomSelector';
import AdminRoomControlCard from './AdminRoomControlCard';
import AdminPesertaTable from './AdminPesertaTable';
import ModalBuatRoomBaru from './ModalBuatRoomBaru';
import ModalKonfirmasiHapusRoom from './ModalKonfirmasiHapusRoom';

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
  const [newDurasi, setNewDurasi] = useState(propSesi?.durasi_menit || 80);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // 2. AMBIL SEMUA DAFTAR ROOM / SESI DARI DATABASE (ANTI-LOOP)
  const fetchAllRooms = useCallback(async (targetRoomId = null) => {
    setLoading(true);
    try {
      const { data: sesiRows, error: sesiErr } = await supabase
        .from('ujian_sesi')
        .select('*')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
        .limit(30);

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

        // 1) Target eksplisit
        if (targetRoomId) {
          chosen = enriched.find((s) => s.id === targetRoomId);
        }

        // 2) Pertahankan room yang sudah dipilih sebelumnya
        if (!chosen && selectedRoomIdRef.current) {
          chosen = enriched.find((s) => s.id === selectedRoomIdRef.current);
        }

        // 3) Default awal jika belum ada pilihan
        if (!chosen) {
          if (propSesi?.id) {
            chosen = enriched.find((s) => s.id === propSesi.id);
          }

          if (!chosen) {
            // Prioritas: ongoing dengan peserta terbanyak -> waiting -> pertama
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
          setNewDurasi(chosen.durasi_menit || 80);
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

  // Initial mount HANYA 1 KALI
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

  // GANTI ROOM YANG SEDANG DIPANTAU ADMIN
  const handleSelectRoom = (sesiItem) => {
    if (!sesiItem?.id) return;
    setSelectedRoomId(sesiItem.id);
    selectedRoomIdRef.current = sesiItem.id;
    setCurrentSesi(sesiItem);
    setNewDurasi(sesiItem.durasi_menit || 80);
    fetchPeserta(sesiItem.id);
    showNotif(`Memantau Room PIN: ${sesiItem.pin_ujian} (${sesiItem.status.toUpperCase()})`);
  };

  // TERAPKAN ROOM INI KE HALAMAN UTAMA CBT (SYNC EKSPLISIT)
  const handleApplyRoomToExamPage = () => {
    if (!currentSesi) return;
    if (onRefreshSesi) {
      onRefreshSesi(currentSesi);
      showNotif(`Room [${currentSesi.pin_ujian}] diterapkan sebagai sesi ujian aktif!`);
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

  // UPDATE NAMA ROOM / JUDUL
  const handleUpdateJudulRoom = async (newJudul) => {
    if (!currentSesi?.id) return;
    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .update({ judul: newJudul })
        .eq('id', currentSesi.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSesi(data);
      showNotif(`Nama room berhasil diubah menjadi: "${newJudul}"`);
      await fetchAllRooms(data.id);
    } catch (err) {
      alert('Gagal ubah nama room: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // BUAT ROOM BARU DARI MODAL
  const handleCreateNewRoom = async (judulRoom, durasiInt) => {
    const newPin = generateNewPin();

    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('ujian_sesi')
        .insert([
          {
            pin_ujian: newPin,
            status: 'waiting',
            judul: judulRoom || 'Ulangan Informatika',
            durasi_menit: durasiInt || 80,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      showNotif(`Room Baru Berhasil Dibuat! PIN: ${newPin} (${durasiInt} Menit)`);
      setShowCreateModal(false);
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

  // RESET PIN ROOM INI (UPDATE TOKEN)
  const handleResetCurrentRoomPin = async () => {
    if (!currentSesi?.id) return;
    const newPin = generateNewPin();
    const durasiInt = parseInt(newDurasi, 10) || 80;

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

  // MULAI UJIAN SERENTAK DI ROOM INI (WAITING -> STARTING -> ONGOING)
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

      // 2. Setelah 3.5 detik set ke 'ongoing' dan perbarui timestamp mulai resmi
      setTimeout(async () => {
        let ongoingData = null;
        const nowIso = new Date().toISOString();
        const { data: resData, error: updateErr } = await supabase
          .from('ujian_sesi')
          .update({
            status: 'ongoing',
            created_at: nowIso,
            waktu_mulai: nowIso,
          })
          .eq('id', currentSesi.id)
          .select()
          .maybeSingle();

        // Fallback jika kolom waktu_mulai belum ada di schema database
        if (updateErr && (updateErr.code === 'PGRST204' || updateErr.message?.includes('waktu_mulai'))) {
          const fallbackRes = await supabase
            .from('ujian_sesi')
            .update({
              status: 'ongoing',
              created_at: nowIso,
            })
            .eq('id', currentSesi.id)
            .select()
            .maybeSingle();
          ongoingData = fallbackRes.data;
        } else {
          ongoingData = resData;
        }

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

  // PAKSA STATUS ONGOING JIKA TERTAHAN DI STARTING
  const handleForceOngoing = async () => {
    if (!currentSesi?.id) return;
    setActionLoading(true);
    try {
      let ongoingData = null;
      const nowIso = new Date().toISOString();
      const { data: resData, error: updateErr } = await supabase
        .from('ujian_sesi')
        .update({
          status: 'ongoing',
          created_at: nowIso,
          waktu_mulai: nowIso,
        })
        .eq('id', currentSesi.id)
        .select()
        .maybeSingle();

      // Fallback jika kolom waktu_mulai belum ada di schema database
      if (updateErr && (updateErr.code === 'PGRST204' || updateErr.message?.includes('waktu_mulai'))) {
        const fallbackRes = await supabase
          .from('ujian_sesi')
          .update({
            status: 'ongoing',
            created_at: nowIso,
          })
          .eq('id', currentSesi.id)
          .select()
          .maybeSingle();
        if (fallbackRes.error) throw fallbackRes.error;
        ongoingData = fallbackRes.data;
      } else {
        if (updateErr) throw updateErr;
        ongoingData = resData;
      }

      if (ongoingData) {
        setCurrentSesi(ongoingData);
        if (onRefreshSesi) onRefreshSesi(ongoingData);
      }
      showNotif(`Status Room [${currentSesi.pin_ujian}] diaktifkan ke ONGOING!`);
      fetchAllRooms(currentSesi.id);
    } catch (e) {
      alert('Gagal set ongoing: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // AKHIRI / HENTIKAN SESI UJIAN SEKARANG
  const handleFinishExam = async () => {
    if (!currentSesi?.id) return;
    if (!window.confirm(`Akhiri sesi Room [${currentSesi.pin_ujian}] sekarang? Siswa yang belum submit akan otomatis disimpan.`)) {
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

  // HAPUS PERMANEN ROOM BESERTA SELURUH DATA PESERTA & JAWABAN
  const handleConfirmDeleteRoom = async () => {
    if (!currentSesi?.id) return;
    setActionLoading(true);
    try {
      // 1. Ambil semua peserta_id di room ini
      const { data: pesertaRows } = await supabase
        .from('ujian_peserta')
        .select('id')
        .eq('sesi_id', currentSesi.id);

      const pesertaIds = (pesertaRows || []).map((p) => p.id);

      // 2. Hapus jawaban siswa di ujian_jawaban jika ada
      if (pesertaIds.length > 0) {
        await supabase
          .from('ujian_jawaban')
          .delete()
          .in('peserta_id', pesertaIds);
      }

      // 3. Hapus peserta di ujian_peserta
      await supabase
        .from('ujian_peserta')
        .delete()
        .eq('sesi_id', currentSesi.id);

      // 4. Hapus room di ujian_sesi
      const { error: delErr } = await supabase
        .from('ujian_sesi')
        .delete()
        .eq('id', currentSesi.id);

      if (delErr) throw delErr;

      showNotif(`Room [${currentSesi.pin_ujian}] beserta seluruh datanya telah berhasil dihapus permanen!`);
      setShowDeleteModal(false);
      selectedRoomIdRef.current = null;
      setSelectedRoomId(null);
      setCurrentSesi(null);
      await fetchAllRooms();
    } catch (err) {
      console.error('Gagal hapus room:', err);
      alert('Gagal menghapus room: ' + err.message);
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
        
        {/* Banner Notifikasi */}
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
        <AdminTopBar
          loading={loading}
          onRefresh={() => {
            fetchAllRooms(selectedRoomId);
            if (selectedRoomId) fetchPeserta(selectedRoomId);
          }}
          onClose={onClose}
        />

        {/* 2. SECTION DAFTAR ROOM / SESI ULANGAN AKTIF (SORTED ROOM SWITCHER) */}
        <AdminRoomSelector
          daftarSesi={daftarSesi}
          selectedRoomId={selectedRoomId}
          onSelectRoom={handleSelectRoom}
          onOpenCreateModal={() => setShowCreateModal(true)}
        />

        {/* 3. BARIS KONTROL ROOM TERPILIH & SISA WAKTU REALTIME */}
        <AdminRoomControlCard
          currentSesi={currentSesi}
          pesertaCount={peserta.length}
          newDurasi={newDurasi}
          onChangeDurasi={setNewDurasi}
          onApplyDurasi={handleUpdateDurasi}
          onStartExam={handleStartExam}
          onForceOngoing={handleForceOngoing}
          onFinishExam={handleFinishExam}
          onResetPin={handleResetCurrentRoomPin}
          onOpenDeleteModal={() => setShowDeleteModal(true)}
          onApplyToFront={handleApplyRoomToExamPage}
          onUpdateJudulRoom={handleUpdateJudulRoom}
          actionLoading={actionLoading}
          copiedPin={copiedPin}
          onCopyPin={handleCopyPin}
        />

        {/* 4. TABEL MONITORING PESERTA REALTIME & WIDGET TIMER SISA WAKTU */}
        <AdminPesertaTable
          currentSesi={currentSesi}
          peserta={peserta}
          filteredPeserta={filteredPeserta}
          stats={stats}
          filterStatus={filterStatus}
          onSelectFilterStatus={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUnblockStudent={handleUnblockStudent}
          loadingPeserta={loadingPeserta}
        />

      </div>

      {/* MODAL 1: BUAT ROOM BARU */}
      <ModalBuatRoomBaru
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateNewRoom}
        loading={actionLoading}
      />

      {/* MODAL 2: KONFIRMASI HAPUS ROOM */}
      <ModalKonfirmasiHapusRoom
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeleteRoom}
        room={currentSesi}
        pesertaCount={peserta.length}
        loading={actionLoading}
      />
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// Import Pool Soal & Helpers
import {
  SOAL_POOL,
  shuffleSoal,
  shuffleOpsi,
  hitungNilaiSiswa,
} from '../../components/RuangBelajar/TugasKhusus/Tugas7/soal_pool';

// Import Helper Schema v2.0
import { buildStandardDetailJawaban } from '../../utils/tugasSchemaHelper';

// Import Audio Quiz Helper
import { useAudioQuiz } from '../../hooks/useAudioQuiz';

// Import Sub-Komponen UI Tugas 7
import TugasUlanganHeader from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganHeader';
import TugasUlanganPinInput from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganPinInput';
import TugasUlanganWaitingRoom from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganWaitingRoom';
import TugasUlanganQuestionCard from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganQuestionCard';
import TugasUlanganNavGrid from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganNavGrid';
import TugasUlanganAsistenPanel from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganAsistenPanel';
import TugasUlanganPauseDialog from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganPauseDialog';
import TugasUlanganSelesaiModal from '../../components/RuangBelajar/TugasKhusus/Tugas7/TugasUlanganSelesaiModal';
import AdminPanelUlanganTugas7 from '../../components/RuangBelajar/TugasKhusus/Tugas7/Admin/AdminPanelUlanganTugas7';

// ID Tugas 7 di tabel tugas_master
const TUGAS_7_ID = '3f888fcc-c4fd-4d48-b159-ec5bae4e03db';
const TUGAS_7_KODE = 'TUGAS-07-ULANGAN-INFORMATIKA';

export default function TugasUlanganInformatika() {
  const navigate = useNavigate();
  const { playBeep } = useAudioQuiz();

  // --- 1. STATE IDENTITAS & AUTENTIKASI ---
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- 2. STATE SESI & REALTIME ---
  const [sesi, setSesi] = useState(null);
  const [peserta, setPeserta] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pesertaCount, setPesertaCount] = useState(1);
  const [countdown, setCountdown] = useState(null);

  // --- 3. STATE PENGERJAAN SOAL ---
  const [soalUjian, setSoalUjian] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawabanSiswa, setJawabanSiswa] = useState({});
  const [raguSiswa, setRaguSiswa] = useState({});

  // --- 4. STATE KEAMANAN / ANTI-CHEAT ---
  const [cheatCount, setCheatCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const cheatCooldownRef = useRef(false);

  // --- 5. STATE UI / PANEL ASISTEN & ADMIN ---
  const [showAsisten, setShowAsisten] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasilSelesai, setHasilSelesai] = useState(null);
  const [showSelesaiModal, setShowSelesaiModal] = useState(false);

  // Waktu mulai pengerjaan untuk telemetri
  const startTimeRef = useRef(Date.now());

  // --- CEK LOGIN & ADMIN ROLE & AUTO FETCH SESI AKTIF ---
  useEffect(() => {
    const rawUser = localStorage.getItem('user_siswa');
    if (!rawUser) {
      alert('Silakan login terlebih dahulu untuk mengakses Ulangan Informatika!');
      navigate('/');
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setUser(parsed);
      if (parsed.role === 'admin' || parsed.role_2 === 'pengurus_lab') {
        setIsAdmin(true);
      }
    } catch (e) {
      navigate('/');
    }

    // Cek apakah ada sesi ujian yang sedang aktif / ruang tunggu
    supabase
      .from('ujian_sesi')
      .select('*')
      .in('status', ['waiting', 'starting', 'ongoing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.pin_ujian) {
          setPinInput(data.pin_ujian);
        }
      })
      .catch((err) => console.warn('Cek sesi aktif:', err));
  }, [navigate]);

  // Handler saat admin memperbarui / membuat token sesi baru di Admin Panel
  const handleSesiUpdatedByAdmin = (updatedSesi) => {
    if (updatedSesi) {
      setSesi(updatedSesi);
      if (updatedSesi.pin_ujian) {
        setPinInput(updatedSesi.pin_ujian);
      }
    }
  };

  // --- LOAD SOAL TERACAK SAAT SESI ONGOING ---
  useEffect(() => {
    if (sesi?.status === 'ongoing' && soalUjian.length === 0) {
      // 1. Acak urutan 50 butir soal dengan Fisher-Yates
      const shuffledQuestions = shuffleSoal(SOAL_POOL);

      // 2. Acak urutan pilihan jawaban A, B, C, D di setiap butir soal
      const randomized = shuffledQuestions.map((s) => ({
        ...s,
        opsi: shuffleOpsi(s.opsi),
      }));

      setSoalUjian(randomized);
      startTimeRef.current = Date.now();

      // Coba masuk fullscreen otomatis saat mulai
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen butuh interaksi pengguna');
          });
        }
      } catch (err) {
        console.warn('Gagal request fullscreen otomatis:', err);
      }
    }
  }, [sesi?.status, soalUjian.length]);

  // --- REALTIME SUBSCRIPTION SESI UJIAN ---
  useEffect(() => {
    if (!sesi?.id) return;

    const channelId = `live_sesi_t7_${sesi.id}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ujian_sesi',
          filter: `id=eq.${sesi.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          setSesi(payload.new);

          if (newStatus === 'starting') {
            // Jalankan countdown 3.. 2.. 1.. GO!
            startCountdownSequence();
          } else if (newStatus === 'ongoing') {
            setCountdown(null);
          } else if (newStatus === 'finished') {
            alert('Sesi ulangan telah diakhiri oleh Guru Pengawas.');
            submitJawabanUjian(true);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sesi?.id]);

  // --- HITUNG JUMLAH PESERTA ONLINE DI SESI ---
  const fetchPesertaCount = useCallback(async (sesiId) => {
    try {
      const { count, error } = await supabase
        .from('ujian_peserta')
        .select('*', { count: 'exact', head: true })
        .eq('sesi_id', sesiId);

      if (!error && count !== null) {
        setPesertaCount(count);
      }
    } catch (e) {
      console.warn('Gagal fetch count peserta:', e);
    }
  }, []);

  useEffect(() => {
    if (sesi?.id) {
      fetchPesertaCount(sesi.id);
      const interval = setInterval(() => fetchPesertaCount(sesi.id), 5000);
      return () => clearInterval(interval);
    }
  }, [sesi?.id, fetchPesertaCount]);

  // --- COUNTDOWN SEQUENCE (3.. 2.. 1.. GO!) ---
  const startCountdownSequence = () => {
    let count = 3;
    setCountdown(count);
    playBeep(440, 0.1);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        playBeep(440, 0.1);
      } else if (count === 0) {
        setCountdown('MULAI!');
        playBeep(880, 0.35);
      } else {
        clearInterval(interval);
        setCountdown(null);
        // Pastikan masuk fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
    }, 1000);
  };

  // --- SISTEM DETEKSI ANTI-CHEAT (FULLSCREEN & TAB SWITCH) ---
  const handleCheatViolation = useCallback(async () => {
    if (sesi?.status !== 'ongoing' || hasilSelesai || isBlocked || isPaused) return;
    if (cheatCooldownRef.current) return;

    cheatCooldownRef.current = true;
    setTimeout(() => {
      cheatCooldownRef.current = false;
    }, 1500); // Debounce 1.5 detik

    playBeep(220, 0.3); // Suara peringatan nada rendah

    const nextCount = cheatCount + 1;
    setCheatCount(nextCount);

    // Sync ke Supabase ujian_peserta
    if (peserta?.id) {
      await supabase
        .from('ujian_peserta')
        .update({
          cheat_count: nextCount,
          status_ujian: nextCount >= 3 ? 'blocked' : 'ongoing',
        })
        .eq('id', peserta.id);
    }

    if (nextCount >= 3) {
      setIsBlocked(true);
      setIsPaused(false);
      alert('Pelanggaran mencapai 3 kali! Ujian terkunci otomatis.');
      submitJawabanUjian(true);
    } else {
      setIsPaused(true);
    }
  }, [sesi?.status, hasilSelesai, isBlocked, isPaused, cheatCount, peserta?.id, playBeep]);

  // Event Listeners: Fullscreen & Visibility
  useEffect(() => {
    if (sesi?.status !== 'ongoing' || hasilSelesai || isBlocked) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleCheatViolation();
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !isBlocked && !hasilSelesai) {
        handleCheatViolation();
      }
    };

    const onWindowBlur = () => {
      handleCheatViolation();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [sesi?.status, hasilSelesai, isBlocked, handleCheatViolation]);

  // --- RESUME FULLSCREEN DARI PAUSE DIALOG ---
  const handleResumeFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {
      console.warn('Gagal resume fullscreen:', e);
    }
    setIsPaused(false);
  };

  // --- JOIN SESI VIA PIN TOKEN ---
  const handleJoinSession = async () => {
    if (!pinInput || pinInput.trim().length === 0) return;

    setPinLoading(true);
    try {
      // 1. Ambil data sesi berdasarkan PIN
      const { data: sesiData, error: sesiError } = await supabase
        .from('ujian_sesi')
        .select('*')
        .eq('pin_ujian', pinInput.trim().toUpperCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sesiError || !sesiData) {
        alert('PIN Ujian salah atau belum diaktifkan oleh Guru Pengawas!');
        setPinLoading(false);
        return;
      }

      // 2. Cek apakah peserta sudah terdaftar di sesi ini
      const { data: existingPeserta } = await supabase
        .from('ujian_peserta')
        .select('*')
        .eq('sesi_id', sesiData.id)
        .eq('siswa_id', user.id)
        .maybeSingle();

      let pesertaAktif = existingPeserta;

      if (!pesertaAktif) {
        // Daftarkan sebagai peserta baru
        const { data: newPeserta, error: insError } = await supabase
          .from('ujian_peserta')
          .insert([
            {
              sesi_id: sesiData.id,
              siswa_id: user.id,
              status_ujian: 'ready',
              cheat_count: 0,
            },
          ])
          .select()
          .single();

        if (insError) throw insError;
        pesertaAktif = newPeserta;
      }

      // Ambil riwayat jawaban autosave jika ada
      const { data: jawabanData } = await supabase
        .from('ujian_jawaban')
        .select('jawaban_map')
        .eq('peserta_id', pesertaAktif.id)
        .maybeSingle();

      if (jawabanData?.jawaban_map) {
        setJawabanSiswa(jawabanData.jawaban_map);
      }

      setSesi(sesiData);
      setPeserta(pesertaAktif);
      setCheatCount(pesertaAktif.cheat_count || 0);
      if (pesertaAktif.status_ujian === 'blocked') {
        setIsBlocked(true);
      }
    } catch (err) {
      console.error('Error join sesi:', err);
      alert('Terjadi kesalahan saat bergabung ke sesi: ' + err.message);
    } finally {
      setPinLoading(false);
    }
  };

  // --- PILIH JAWABAN (DENGAN AUTOSAVE REALTIME) ---
  const handlePilihJawaban = async (soalId, opsiTeks) => {
    if (isBlocked || isPaused) return;

    const newJawaban = { ...jawabanSiswa, [soalId]: opsiTeks };
    setJawabanSiswa(newJawaban);

    // Jika tadinya ditandai ragu, hapus tanda ragunya
    if (raguSiswa[soalId]) {
      const newRagu = { ...raguSiswa };
      delete newRagu[soalId];
      setRaguSiswa(newRagu);
    }

    // Autosave ke Supabase tabel ujian_jawaban
    if (peserta?.id) {
      supabase
        .from('ujian_jawaban')
        .upsert(
          {
            peserta_id: peserta.id,
            jawaban_map: newJawaban,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'peserta_id' }
        )
        .then(({ error }) => {
          if (error) console.warn('Autosave gagal:', error);
        });
    }
  };

  // --- TOGGLE TANDAI RAGU-RAGU ---
  const handleToggleRagu = () => {
    const soal = soalUjian[currentIndex];
    if (!soal) return;

    setRaguSiswa((prev) => {
      const updated = { ...prev };
      if (updated[soal.id]) {
        delete updated[soal.id];
      } else {
        updated[soal.id] = true;
      }
      return updated;
    });
  };

  // --- SUBMIT JAWABAN AKHIR (SCHEMA V2.0 SINKRON KE TUGAS_PENGUMPULAN) ---
  const submitJawabanUjian = async (isAuto = false) => {
    if (isSubmitting) return;

    if (!isAuto) {
      const unanswered = soalUjian.length - Object.keys(jawabanSiswa).length;
      let confirmMsg = 'Apakah Anda yakin ingin menyelesaikan dan mengirim jawaban ujian sekarang?';
      if (unanswered > 0) {
        confirmMsg = `Masih ada ${unanswered} soal yang belum dijawab! Yakin tetap ingin mengirimkan ujian?`;
      }
      if (!window.confirm(confirmMsg)) return;
    }

    setIsSubmitting(true);
    try {
      // 1. Evaluasi Skor dengan Kunci Jawaban Resmi
      const hasil = hitungNilaiSiswa(jawabanSiswa, soalUjian);
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

      // 2. Susun Payload Standar Schema v2.0
      const payloadV2 = buildStandardDetailJawaban({
        kodeTugas: TUGAS_7_KODE,
        judulTugas: 'Tugas 7: Ulangan Informatika (Persiapan Tes Sumatif Ganjil)',
        tipeTugas: 'kuis_murni',
        activeStage: 1,
        totalStages: 1,
        timeSpentSeconds: timeSpent,
        attemptCount: 1,
        skorMaksimal: 100,
        skorDiperoleh: hasil.skor,
        skorTertinggiDisimpan: hasil.skor,
        breakdownSkor: [
          {
            id: 'pilihan_ganda',
            label: 'Soal Pilihan Ganda (50 Butir)',
            skor: hasil.skor,
            skor_maks: 100,
            status: hasil.skor >= 75 ? 'lulus' : 'belum',
          },
        ],
        autoGrading: {
          passed: hasil.skor >= 75,
          kriteria_kktp: 75,
          total_soal: hasil.totalSoal,
          jumlah_benar: hasil.benar,
          jumlah_salah: hasil.salah,
          jumlah_kosong: hasil.kosong,
          persentase: hasil.persentase,
        },
        customState: {
          sesi_id: sesi?.id || null,
          pin_ujian: sesi?.pin_ujian || null,
          shuffled_soal_order: soalUjian.map((s) => s.id),
          jawaban_siswa: jawabanSiswa,
          ragu_siswa: raguSiswa,
          cheat_count: cheatCount,
        },
        isCompleted: true,
      });

      // 3. Simpan ke tabel tugas_pengumpulan (Memicu trigger point_logs & total_points)
      const { error: submitError } = await supabase
        .from('tugas_pengumpulan')
        .upsert(
          {
            tugas_id: TUGAS_7_ID,
            siswa_id: user.id,
            status: 'dinilai',
            skor: hasil.skor,
            persentase_skor: hasil.persentase,
            detail_jawaban: payloadV2,
            submitted_at: new Date().toISOString(),
            graded_at: new Date().toISOString(),
          },
          { onConflict: 'tugas_id,siswa_id' }
        );

      if (submitError) throw submitError;

      // 4. Update status peserta di ujian_peserta
      if (peserta?.id) {
        await supabase
          .from('ujian_peserta')
          .update({
            status_ujian: isBlocked ? 'blocked' : 'submitted',
            nilai_akhir: hasil.skor,
          })
          .eq('id', peserta.id);
      }

      // Keluar dari fullscreen jika selesai
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setHasilSelesai(hasil);
      setShowSelesaiModal(true);
    } catch (err) {
      console.error('Gagal mengirim jawaban:', err);
      alert('Terjadi kendala koneksi saat mengirim jawaban. Silakan coba lagi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER 1: INPUT PIN JIKA BELUM TERHUBUNG ---
  if (!sesi) {
    return (
      <>
        <TugasUlanganPinInput
          value={pinInput}
          onChange={setPinInput}
          onJoin={handleJoinSession}
          loading={pinLoading}
          siswa={user}
          isAdmin={isAdmin}
          onOpenAdminPanel={() => setShowAdminPanel(true)}
        />
        {showAdminPanel && (
          <AdminPanelUlanganTugas7
            sesi={sesi}
            onClose={() => setShowAdminPanel(false)}
            onRefreshSesi={handleSesiUpdatedByAdmin}
          />
        )}
      </>
    );
  }

  // --- RENDER 2: RUANG TUNGGU JIKA STATUS 'WAITING' ---
  if (sesi?.status === 'waiting') {
    return (
      <>
        <TugasUlanganWaitingRoom
          sesi={sesi}
          pesertaCount={pesertaCount}
          siswa={user}
          isAdmin={isAdmin}
          onOpenAdminPanel={() => setShowAdminPanel(true)}
          onStartByAdmin={async () => {
            await supabase.from('ujian_sesi').update({ status: 'starting' }).eq('id', sesi.id);
          }}
        />
        {showAdminPanel && (
          <AdminPanelUlanganTugas7
            sesi={sesi}
            onClose={() => setShowAdminPanel(false)}
            onRefreshSesi={handleSesiUpdatedByAdmin}
          />
        )}
      </>
    );
  }

  // --- RENDER 3: COUNTDOWN OVERLAY ---
  if (countdown !== null) {
    return (
      <div className="fixed inset-0 z-[110] bg-blue-600 flex flex-col items-center justify-center text-white">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <span className="text-xl font-black uppercase tracking-widest block mb-4 text-blue-200">
            Ujian Siap Dimulai
          </span>
          <h1 className="text-8xl sm:text-9xl font-black italic tracking-tighter">
            {countdown}
          </h1>
        </motion.div>
      </div>
    );
  }

  // --- RENDER 4: TAMPILAN CBT ULANGAN ONGOING ---
  const currentSoal = soalUjian[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header CBT */}
      <TugasUlanganHeader
        siswa={user}
        cheatCount={cheatCount}
        currentIndex={currentIndex}
        totalSoal={soalUjian.length}
        durasiMenit={sesi?.durasi_menit || 90}
        onTimeUp={() => submitJawabanUjian(true)}
        showAsisten={showAsisten}
        onToggleAsisten={() => setShowAsisten((v) => !v)}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
      />

      {/* Main Dual-Pane Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Kolom Kiri: Kartu Soal & Kisi Navigasi (7 atau 8 Kolom) */}
        <section className={`${showAsisten ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-5`}>
          <TugasUlanganQuestionCard
            soal={currentSoal}
            currentIndex={currentIndex}
            totalSoal={soalUjian.length}
            selectedJawab={jawabanSiswa[currentSoal?.id]}
            onPilih={handlePilihJawaban}
            isRagu={Boolean(raguSiswa[currentSoal?.id])}
            onToggleRagu={handleToggleRagu}
            isBlocked={isBlocked}
            cheatCount={cheatCount}
          />

          <TugasUlanganNavGrid
            totalSoal={soalUjian.length}
            currentIndex={currentIndex}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
            jawabanMap={jawabanSiswa}
            raguMap={raguSiswa}
            soalList={soalUjian}
            onPrev={() => setCurrentIndex((c) => Math.max(0, c - 1))}
            onNext={() => setCurrentIndex((c) => Math.min(soalUjian.length - 1, c + 1))}
            onSubmit={() => submitJawabanUjian(false)}
            isSubmitting={isSubmitting}
          />
        </section>

        {/* Kolom Kanan: Panel Asisten Materi Belajar (4 Kolom) */}
        {showAsisten && (
          <section className="lg:col-span-4 sticky top-20 self-start">
            <TugasUlanganAsistenPanel
              soal={currentSoal}
              currentIndex={currentIndex}
              isOpen={showAsisten}
              onClose={() => setShowAsisten(false)}
            />
          </section>
        )}
      </main>

      {/* Modal Jeda Peringatan Anti-Cheat */}
      <TugasUlanganPauseDialog
        isOpen={isPaused}
        cheatCount={cheatCount}
        maxCheat={3}
        onResumeFullscreen={handleResumeFullscreen}
      />

      {/* Modal Perayaan Selesai Ujian */}
      {showSelesaiModal && (
        <TugasUlanganSelesaiModal
          isOpen={showSelesaiModal}
          hasil={hasilSelesai}
          siswa={user}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanelUlanganTugas7
          sesi={sesi}
          onClose={() => setShowAdminPanel(false)}
          onRefreshSesi={handleSesiUpdatedByAdmin}
        />
      )}
    </div>
  );
}


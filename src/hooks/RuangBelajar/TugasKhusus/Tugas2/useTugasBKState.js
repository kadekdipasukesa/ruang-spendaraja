import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';

// Helper untuk membatasi skor tiap misi Berpikir Komputasional agar tidak melebihi batas maksimal:
// M1 (Algoritma Labirin): Max 50 Poin
// M2 (Penjadwalan): Max 10 Poin
// M3 (Struktur Data): Max 20 Poin
// M4 (Representasi Data): Max 20 Poin
// Total Max = 100 Poin
const clampBKScores = (raw) => ({
  m1: Math.min(50, Math.max(0, Math.round(Number(raw?.m1) || 0))),
  m2: Math.min(10, Math.max(0, Math.round(Number(raw?.m2) || 0))),
  m3: Math.min(20, Math.max(0, Math.round(Number(raw?.m3) || 0))),
  m4: Math.min(20, Math.max(0, Math.round(Number(raw?.m4) || 0))),
});

export function useTugasBKState() {
  const [user, setUser] = useState(null);
  const [activeMission, setActiveMission] = useState(1);

  // Bobot Poin Tiap Misi:
  // - Algoritma (m1): 50 Poin (50%) -> Lvl 1 (15p) + Lvl 2 (15p) + Lvl 3 (20p)
  // - Penjadwalan (m2): 10 Poin (10%)
  // - Struktur Data (m3): 20 Poin (20%)
  // - Representasi Data (m4): 20 Poin (20%)
  // Total = 100 Poin (100%)
  const [scores, setScores] = useState({
    m1: 0,
    m2: 0,
    m3: 0,
    m4: 0,
  });

  // Status selesai tiap misi
  const [completed, setCompleted] = useState({
    m1: false,
    m2: false,
    m3: false,
    m4: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbTaskId, setDbTaskId] = useState('c2243c08-ce28-4fe7-8ff7-86f9b546ecd0');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionMeta, setSubmissionMeta] = useState({
    savedScore: 0,
    attemptScore: 0,
    previousScore: 0,
    isRetained: false,
    isImproved: false,
  });

  // Storage key spesifik per siswa untuk menyimpan jawaban terakhir
  const storageKey = useMemo(() => {
    return user?.id ? `tugas_bk_state_user_${user.id}` : 'tugas_bk_state_guest';
  }, [user?.id]);

  // Cek apakah sudah pernah kumpul di Supabase & muat progress terakhir
  const checkExistingSubmission = useCallback(async (studentId, currentKey, explicitTaskId) => {
    const numStudentId = parseInt(studentId, 10);
    if (isNaN(numStudentId)) {
      setLoading(false);
      return;
    }

    try {
      // 1. Dapatkan Task ID spesifik untuk Tugas 2 (Berpikir Komputasional)
      const candidateTaskIds = [
        explicitTaskId,
        dbTaskId,
        'c2243c08-ce28-4fe7-8ff7-86f9b546ecd0',
        'TUGAS-02-KUIS-ALGO',
        'TUGAS_BK_01',
        'tugas-inf-02'
      ].filter(Boolean);

      try {
        const { data: masterTasks } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02,custom_route.ilike.%berpikir-komputasional%,custom_route.ilike.%kuis-algoritma%');

        if (masterTasks && masterTasks.length > 0) {
          masterTasks.forEach((m) => {
            if (m?.id && !candidateTaskIds.includes(m.id)) {
              candidateTaskIds.push(m.id);
            }
          });
          const validTask = masterTasks[0];
          if (validTask?.id && !dbTaskId) {
            setDbTaskId(validTask.id);
          }
        }
      } catch (err) {
        console.warn('Cari candidate task master BK:', err);
      }

      // 2. Kueri ke tugas_pengumpulan khusus Tugas 2
      const { data: subDataList } = await supabase
        .from('tugas_pengumpulan')
        .select('*')
        .eq('siswa_id', numStudentId)
        .in('tugas_id', candidateTaskIds)
        .order('submitted_at', { ascending: false })
        .limit(1);

      const subData = subDataList && subDataList.length > 0 ? subDataList[0] : null;

      if (subData) {
        // Parse detail_jawaban dengan aman jika bertipe string
        let parsedDetail = null;
        if (subData.detail_jawaban) {
          if (typeof subData.detail_jawaban === 'string') {
            try {
              parsedDetail = JSON.parse(subData.detail_jawaban);
            } catch (e) {
              console.warn('Gagal JSON.parse detail_jawaban BK:', e);
            }
          } else if (typeof subData.detail_jawaban === 'object') {
            parsedDetail = subData.detail_jawaban;
          }
        }

        const officialScore = Number(subData.nilai_akhir ?? subData.skor) || 0;

        // Pulihkan progres resmi dari snapshot database jika ada (dengan batas aman tiap misi)
        if (parsedDetail?.scores) {
          setScores(clampBKScores(parsedDetail.scores));
        }
        if (parsedDetail?.completed) {
          setCompleted(parsedDetail.completed);
        }

        setExistingSubmission({
          ...subData,
          skor: Math.min(100, Math.max(0, officialScore)),
          nilai_akhir: Math.min(100, Math.max(0, officialScore)),
          detail_jawaban: parsedDetail || subData.detail_jawaban
        });
        setSubmitted(true);

        // Sinkronkan balik snapshot database ke localStorage agar cache lokal ter-update sesuai database
        if (currentKey && parsedDetail?.scores) {
          try {
            localStorage.setItem(currentKey, JSON.stringify({
              scores: clampBKScores(parsedDetail.scores),
              completed: parsedDetail.completed || {}
            }));
          } catch (e) {
            console.warn('Gagal sinkron database ke local storage:', e);
          }
        }
      } else {
        // Database tugas 2 bersih / belum ada pengumpulan resmi
        setExistingSubmission(null);
        setSubmitted(false);
      }
    } catch (err) {
      console.error('Error cek tugas_pengumpulan BK:', err);
    } finally {
      setLoading(false);
    }
  }, [dbTaskId]);

  // Ambil sesi user dari localStorage & pulihkan progress tersimpan
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedSiswa = localStorage.getItem('user_siswa');
        const storedSpenda = localStorage.getItem('user_spenda');
        const storedUser = localStorage.getItem('user');

        let parsed = null;
        if (storedSiswa) parsed = JSON.parse(storedSiswa);
        else if (storedSpenda) parsed = JSON.parse(storedSpenda);
        else if (storedUser) parsed = JSON.parse(storedUser);

        if (parsed) {
          setUser(parsed);
          const currentKey = parsed.id ? `tugas_bk_state_user_${parsed.id}` : 'tugas_bk_state_guest';

          // Muat state lokal siswa jika ada (dengan batas aman tiap misi)
          const localSaved = localStorage.getItem(currentKey);
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(clampBKScores(parsedLocal.scores));
              if (parsedLocal.completed) setCompleted(parsedLocal.completed);
            } catch (e) {
              console.warn('Gagal parse local saved BK state:', e);
            }
          }

          if (parsed.id) checkExistingSubmission(parsed.id, currentKey, dbTaskId);
          else setLoading(false);
        } else {
          // Guest mode
          const localSaved = localStorage.getItem('tugas_bk_state_guest');
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(clampBKScores(parsedLocal.scores));
              if (parsedLocal.completed) setCompleted(parsedLocal.completed);
            } catch (e) {
              console.warn('Gagal parse guest BK state:', e);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Gagal load session user BK:', err);
        setLoading(false);
      }
    };

    loadSession();
    window.addEventListener('storage', loadSession);
    return () => window.removeEventListener('storage', loadSession);
  }, [checkExistingSubmission, dbTaskId]);

  // Cari ID master tugas dari database jika ada
  useEffect(() => {
    const findTask = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul')
          .or('id.eq.c2243c08-ce28-4fe7-8ff7-86f9b546ecd0,kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02')
          .limit(1)
          .maybeSingle();

        if (data?.id) {
          setDbTaskId(data.id);
          if (user?.id) {
            const currentKey = `tugas_bk_state_user_${user.id}`;
            checkExistingSubmission(user.id, currentKey, data.id);
          }
        }
      } catch (err) {
        console.warn('Kueri tugas_master BK:', err);
      }
    };
    findTask();
  }, [user?.id, checkExistingSubmission]);

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  // Simpan progres ke state dan localStorage setiap kali ada misi selesai (dengan batas poin tegas)
  const handleMissionComplete = useCallback((missionKey, score) => {
    let maxCap = 20;
    if (missionKey === 'm1') maxCap = 50;
    else if (missionKey === 'm2') maxCap = 10;
    else if (missionKey === 'm3') maxCap = 20;
    else if (missionKey === 'm4') maxCap = 20;
    const clampedScore = Math.min(maxCap, Math.max(0, Math.round(Number(score) || 0)));

    setScores((prevScores) => {
      const newScores = clampBKScores({ ...prevScores, [missionKey]: clampedScore });
      setCompleted((prevCompleted) => {
        const newCompleted = { ...prevCompleted, [missionKey]: true };
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify({
              scores: newScores,
              completed: newCompleted,
              updated_at: new Date().toISOString()
            }));
          } catch (e) {
            console.warn('Gagal simpan draft tugas bk ke localStorage:', e);
          }
        }
        return newCompleted;
      });
      return newScores;
    });
  }, [storageKey]);

  // Total skor terhitung dengan batas maksimal pasti 100 poin
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      (Math.min(50, Number(scores.m1) || 0)) +
      (Math.min(10, Number(scores.m2) || 0)) +
      (Math.min(20, Number(scores.m3) || 0)) +
      (Math.min(20, Number(scores.m4) || 0))
    )
  );
  const isAllCompleted = completed.m1 && completed.m2 && completed.m3 && completed.m4;

  const handleResetAll = () => {
    setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
    setCompleted({ m1: false, m2: false, m3: false, m4: false });
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  // Submit flexible: Menyimpan jawaban terakhir & menggunakan NILAI TERBESAR (Math.max) jika percobaan berikutnya lebih kecil
  const handleSubmitAll = async () => {
    if (!user) {
      handleOpenLogin();
      return;
    }

    setSubmitting(true);
    const studentIdInt = parseInt(user.id, 10);
    if (isNaN(studentIdInt)) {
      alert('Sesi login tidak valid. Silakan login kembali.');
      setSubmitting(false);
      return;
    }

    let resolvedTaskId = dbTaskId || 'c2243c08-ce28-4fe7-8ff7-86f9b546ecd0';
    if (!resolvedTaskId) {
      try {
        const { data: tData } = await supabase
          .from('tugas_master')
          .select('id')
          .or('id.eq.c2243c08-ce28-4fe7-8ff7-86f9b546ecd0,kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02')
          .limit(1)
          .maybeSingle();

        if (tData?.id) {
          resolvedTaskId = tData.id;
          setDbTaskId(tData.id);
        }
      } catch (e) {
        console.warn('Gagal cari tugas_master BK saat submit:', e);
      }
    }
    if (!resolvedTaskId) {
      resolvedTaskId = 'c2243c08-ce28-4fe7-8ff7-86f9b546ecd0';
    }

    try {
      const clampedScores = clampBKScores(scores);
      const currentAttemptScore = Math.min(
        100,
        Math.max(0, clampedScores.m1 + clampedScores.m2 + clampedScores.m3 + clampedScores.m4)
      );

      // 1. Cek skor terbaik sebelumnya HANYA dari tugas_pengumpulan untuk tugas ini (maksimal 100)
      let previousBestScore = 0;
      if (existingSubmission && (existingSubmission.tugas_id === resolvedTaskId || !existingSubmission.tugas_id)) {
        previousBestScore = Math.min(100, Math.max(0, Number(existingSubmission.skor ?? existingSubmission.nilai_akhir ?? 0) || 0));
      }

      try {
        const { data: dbSub } = await supabase
          .from('tugas_pengumpulan')
          .select('id, skor, nilai_akhir')
          .eq('siswa_id', studentIdInt)
          .eq('tugas_id', resolvedTaskId)
          .maybeSingle();

        if (dbSub) {
          const dbScore = Math.min(100, Math.max(0, Number(dbSub.nilai_akhir ?? dbSub.skor ?? 0) || 0));
          previousBestScore = Math.max(previousBestScore, dbScore);
        }
      } catch (e) {
        console.warn('Kueri previous submission tugas_pengumpulan error:', e);
      }

      // ATURAN UTAMA: Proteksi Database
      // Jika database masih kosong (previousBestScore === 0), SELALU simpan skor percobaan saat ini
      // Jika sudah ada nilai sebelumnya, hanya timpa jika nilainya LEBIH BESAR
      const isImproved = previousBestScore === 0 || currentAttemptScore > previousBestScore;
      const isRetained = previousBestScore > 0 && currentAttemptScore <= previousBestScore;
      const finalScoreToSave = Math.min(100, Math.max(previousBestScore, currentAttemptScore));

      const detailLog = {
        scores: clampedScores,
        completed,
        breakdown: {
          m1_algoritma: clampedScores.m1,
          m2_jadwal: clampedScores.m2,
          m3_struktur_data: clampedScores.m3,
          m4_representasi_data: clampedScores.m4,
        },
        skor_percobaan_saat_ini: currentAttemptScore,
        skor_tertinggi_disimpan: finalScoreToSave,
        skor_sebelumnya: previousBestScore,
        is_retained: isRetained,
        is_improved: isImproved,
        submitted_at: new Date().toISOString()
      };

      let upsertedSub = null;

      // 2. HANYA SIMPAN KE DATABASE (tugas_pengumpulan) JIKA NILAI LEBIH BESAR (atau belum pernah submit)
      if (isImproved) {
        const payload = {
          tugas_id: resolvedTaskId,
          siswa_id: studentIdInt,
          status: 'selesai',
          skor: Math.min(100, Math.max(0, Math.round(finalScoreToSave))),
          persentase_skor: Math.min(100, Math.max(0, finalScoreToSave)),
          detail_jawaban: detailLog,
          catatan_guru: `Skor Praktik Berpikir Komputasional: ${finalScoreToSave}/100 Poin (M1: ${clampedScores.m1}/50, M2: ${clampedScores.m2}/10, M3: ${clampedScores.m3}/20, M4: ${clampedScores.m4}/20).`,
          submitted_at: new Date().toISOString(),
          graded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: resSub, error: upsertErr } = await supabase
          .from('tugas_pengumpulan')
          .upsert(payload, { onConflict: 'tugas_id,siswa_id' })
          .select()
          .maybeSingle();

        upsertedSub = resSub;

        if (upsertErr) {
          console.error('Gagal simpan ke tugas_pengumpulan:', upsertErr);
          throw upsertErr;
        } else {
          console.log('[Tugas 2 BK] Berhasil tersimpan di tugas_pengumpulan (Trigger trg_sync_tugas_to_point_logs otomatis aktif):', resSub);
        }

        // Sinkronisasi total_points ke master_siswa & user session
        setTimeout(async () => {
          try {
            const latestPoints = await syncStudentPointsAfterTask(studentIdInt);
            if (latestPoints !== null && latestPoints !== undefined) {
              const updatedUser = { ...user, total_points: latestPoints };
              setUser(updatedUser);
              localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
              window.dispatchEvent(new Event('storage'));
            }
          } catch (e) {
            console.warn('Sync points after task error:', e);
          }
        }, 300);
      } else {
        console.log(`[Tugas 2 BK] Nilai database (${previousBestScore}) >= percobaan saat ini (${currentAttemptScore}). Data tugas_pengumpulan TIDAK ditimpa.`);
      }

      // Simpan juga state terakhir ke localStorage agar progres siswa tidak hilang secara lokal
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({
          scores: clampedScores,
          completed,
          submitted_at: new Date().toISOString()
        }));
      }

      setSubmitted(true);
      if (isImproved) {
        setExistingSubmission(upsertedSub || {
          tugas_id: resolvedTaskId,
          siswa_id: studentIdInt,
          status: 'selesai',
          skor: finalScoreToSave,
          persentase_skor: finalScoreToSave,
          submitted_at: new Date().toISOString(),
        });
      }
      setSubmissionMeta({
        savedScore: finalScoreToSave,
        attemptScore: currentAttemptScore,
        previousScore: previousBestScore,
        isRetained,
        isImproved,
        skippedDbSave: !isImproved,
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Gagal kumpul tugas BK:', err);
      alert('Terjadi kendala saat menyimpan nilai: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    activeMission,
    setActiveMission,
    scores,
    completed,
    totalScore,
    isAllCompleted,
    submitting,
    submitted,
    existingSubmission,
    loading,
    showSuccessModal,
    setShowSuccessModal,
    submissionMeta,
    handleOpenLogin,
    handleMissionComplete,
    handleResetAll,
    handleSubmitAll,
  };
}


import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';

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
        '595d2d95-d16f-4582-9be5-93d9db451f47',
        'c2243c08-ce28-4fe7-8ff7-86f9b546ecd0',
        'TUGAS-02-BERPIKIR-KOMPUTASIONAL',
        'tugas-inf-02',
        'TUGAS_BK_01'
      ].filter(Boolean);

      try {
        const { data: masterTasks } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-02-BERPIKIR-KOMPUTASIONAL,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02,kode_tugas.eq.TUGAS-02-KUIS-ALGO,custom_route.ilike.%berpikir-komputasional%,custom_route.ilike.%kuis-algoritma%');

        if (masterTasks && masterTasks.length > 0) {
          masterTasks.forEach((m) => {
            if (
              m?.id &&
              m.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
              m.kode_tugas !== 'TUGAS-03-SISTEM-KOMPUTER' &&
              m.kode_tugas !== 'tugas-inf-03' &&
              !candidateTaskIds.includes(m.id)
            ) {
              candidateTaskIds.push(m.id);
            }
          });
          const validTask = masterTasks.find(m => 
            m.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
            m.kode_tugas !== 'TUGAS-03-SISTEM-KOMPUTER' &&
            m.kode_tugas !== 'tugas-inf-03'
          );
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
        .select('id, tugas_id, siswa_id, status, skor, nilai_akhir, persentase_skor, detail_jawaban, catatan_guru, submitted_at, graded_at')
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

        // UTAMAKAN DATABASE: Pulihkan progres resmi dari snapshot database
        if (parsedDetail?.scores) {
          setScores(parsedDetail.scores);
        } else if (officialScore > 0) {
          // Fallback jika tidak ada breakdown objek tapi ada skor resmi
          setScores({
            m1: officialScore,
            m2: 0,
            m3: 0,
            m4: 0
          });
        }

        if (parsedDetail?.completed) {
          setCompleted(parsedDetail.completed);
        }

        setExistingSubmission({
          ...subData,
          skor: officialScore,
          nilai_akhir: officialScore,
          detail_jawaban: parsedDetail || subData.detail_jawaban
        });
        setSubmitted(true);

        // Sinkronkan balik snapshot database ke localStorage agar cache lokal ter-update sesuai database
        if (currentKey) {
          try {
            localStorage.setItem(currentKey, JSON.stringify({
              scores: parsedDetail?.scores || { m1: officialScore, m2: 0, m3: 0, m4: 0 },
              completed: parsedDetail?.completed || {}
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

          // Muat state lokal siswa jika ada
          const localSaved = localStorage.getItem(currentKey);
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(parsedLocal.scores);
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
              if (parsedLocal.scores) setScores(parsedLocal.scores);
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

  // Simpan progres ke state dan localStorage setiap kali ada misi selesai
  const handleMissionComplete = useCallback((missionKey, score) => {
    setScores((prevScores) => {
      const newScores = { ...prevScores, [missionKey]: score };
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

  const totalScore = (scores.m1 || 0) + (scores.m2 || 0) + (scores.m3 || 0) + (scores.m4 || 0);
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
      const currentAttemptScore = totalScore;

      // 1. Cek skor terbaik sebelumnya HANYA dari tugas_pengumpulan untuk tugas ini
      let previousBestScore = 0;
      if (existingSubmission && (existingSubmission.tugas_id === resolvedTaskId || !existingSubmission.tugas_id)) {
        previousBestScore = Number(existingSubmission.skor ?? existingSubmission.nilai_akhir ?? 0) || 0;
      }

      try {
        const { data: dbSub } = await supabase
          .from('tugas_pengumpulan')
          .select('id, skor, nilai_akhir')
          .eq('siswa_id', studentIdInt)
          .eq('tugas_id', resolvedTaskId)
          .maybeSingle();

        if (dbSub) {
          const dbScore = Number(dbSub.nilai_akhir ?? dbSub.skor ?? 0) || 0;
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
      const finalScoreToSave = Math.max(previousBestScore, currentAttemptScore);

      const detailLog = {
        scores,
        completed,
        breakdown: {
          m1_algoritma: scores.m1 || 0,
          m2_jadwal: scores.m2 || 0,
          m3_struktur_data: scores.m3 || 0,
          m4_representasi_data: scores.m4 || 0,
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
          skor: Math.round(finalScoreToSave),
          persentase_skor: Math.min(100, Math.max(0, finalScoreToSave)),
          detail_jawaban: detailLog,
          catatan_guru: `Skor Praktik Berpikir Komputasional: ${finalScoreToSave}/100 Poin (M1: ${scores.m1 || 0}/50, M2: ${scores.m2 || 0}/10, M3: ${scores.m3 || 0}/20, M4: ${scores.m4 || 0}/20).`,
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
          scores,
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


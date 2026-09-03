import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';
import { celebratePointGain } from '../../../../components/RuangBelajar/TugasKhusus/Tugas3/skAssets';

export function useTugasSKState() {
  const [user, setUser] = useState(null);
  const [activeMission, setActiveMission] = useState(1);

  // Bobot Poin Tiap Misi Baru (Total 100 Poin):
  // - Misi 1 (Komponen Sistem Komputer): 35 Poin
  // - Misi 2 (Siklus Data & Aplikasi): 20 Poin
  // - Misi 3 (Perkakas Digital & Software): 30 Poin
  // - Misi 4 (Dampak & Etika Digital TIK): 15 Poin
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
  const [dbTaskId, setDbTaskId] = useState(null);
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
    return user?.id ? `tugas_sk_state_user_${user.id}` : 'tugas_sk_state_guest';
  }, [user?.id]);

  // Cek apakah sudah pernah kumpul di Supabase & muat progress terakhir
  const checkExistingSubmission = useCallback(async (studentId, currentKey, explicitTaskId) => {
    const numStudentId = parseInt(studentId, 10);
    if (isNaN(numStudentId)) {
      setLoading(false);
      return;
    }

    try {
      // 1. Dapatkan Task ID spesifik untuk Tugas 3 (Sistem Komputer & Perkakas Digital)
      const candidateTaskIds = [
        explicitTaskId,
        dbTaskId,
        '489b0d1e-8fd0-4bfa-9759-3996773347f3',
        'TUGAS-03-SISTEM-KOMPUTER',
        'tugas-inf-03',
        'TUGAS_SK_01'
      ].filter(Boolean);

      try {
        const { data: masterTasks } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-03-SISTEM-KOMPUTER,kode_tugas.eq.TUGAS_SK_01,kode_tugas.eq.tugas-inf-03,custom_route.ilike.%sistem-komputer%,judul.ilike.%Sistem Komputer & Perkakas Digital%');

        if (masterTasks && masterTasks.length > 0) {
          masterTasks.forEach((m) => {
            // Lindungi agar ID tugas 1 dan tugas 2 tidak pernah masuk ke Tugas 3
            if (
              m?.id &&
              m.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
              m.kode_tugas !== 'TUGAS-02-BERPIKIR-KOMPUTASIONAL' &&
              m.kode_tugas !== 'TUGAS-02-KUIS-ALGO' &&
              m.kode_tugas !== 'c2243c08-ce28-4fe7-8ff7-86f9b546ecd0' &&
              !candidateTaskIds.includes(m.id)
            ) {
              candidateTaskIds.push(m.id);
            }
          });
          const validMaster = masterTasks.find(m => 
            m.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
            m.kode_tugas !== 'TUGAS-02-BERPIKIR-KOMPUTASIONAL' &&
            m.kode_tugas !== 'TUGAS-02-KUIS-ALGO'
          );
          if (validMaster?.id && !dbTaskId) {
            setDbTaskId(validMaster.id);
          }
        }
      } catch (err) {
        console.warn('Cari candidate task master SK:', err);
      }

      // 2. Kueri ke tugas_pengumpulan khusus Tugas 3
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
              console.warn('Gagal JSON.parse detail_jawaban SK:', e);
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
        // Database tugas 3 bersih / belum ada pengumpulan resmi
        setExistingSubmission(null);
        setSubmitted(false);
      }
    } catch (err) {
      console.error('Error cek tugas_pengumpulan SK:', err);
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
          const currentKey = parsed.id ? `tugas_sk_state_user_${parsed.id}` : 'tugas_sk_state_guest';

          // Muat state lokal siswa jika ada
          const localSaved = localStorage.getItem(currentKey);
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(parsedLocal.scores);
              if (parsedLocal.completed) setCompleted(parsedLocal.completed);
            } catch (e) {
              console.warn('Gagal parse local saved SK state:', e);
            }
          }

          if (parsed.id) checkExistingSubmission(parsed.id, currentKey, dbTaskId);
          else setLoading(false);
        } else {
          // Guest mode
          const localSaved = localStorage.getItem('tugas_sk_state_guest');
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(parsedLocal.scores);
              if (parsedLocal.completed) setCompleted(parsedLocal.completed);
            } catch (e) {
              console.warn('Gagal parse guest SK state:', e);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Gagal load session user SK:', err);
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
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-03-SISTEM-KOMPUTER,kode_tugas.eq.tugas-inf-03,kode_tugas.eq.TUGAS_SK_01,custom_route.ilike.%sistem-komputer%,judul.ilike.%Sistem Komputer & Perkakas Digital%')
          .limit(1)
          .maybeSingle();

        if (
          data?.id &&
          data.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
          data.kode_tugas !== 'TUGAS-02-BERPIKIR-KOMPUTASIONAL' &&
          data.kode_tugas !== 'TUGAS-02-KUIS-ALGO'
        ) {
          setDbTaskId(data.id);
          if (user?.id) {
            const currentKey = `tugas_sk_state_user_${user.id}`;
            checkExistingSubmission(user.id, currentKey, data.id);
          }
        }
      } catch (err) {
        console.warn('Kueri tugas_master SK:', err);
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
      if (prevScores[missionKey] === score) {
        return prevScores;
      }
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
            console.warn('Gagal simpan draft tugas sk ke localStorage:', e);
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

    let resolvedTaskId = dbTaskId;
    if (!resolvedTaskId) {
      try {
        const { data: tData } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas')
          .or('kode_tugas.eq.TUGAS-03-SISTEM-KOMPUTER,kode_tugas.eq.TUGAS_SK_01,kode_tugas.eq.tugas-inf-03,custom_route.ilike.%sistem-komputer%,judul.ilike.%Sistem Komputer & Perkakas Digital%')
          .limit(1)
          .maybeSingle();

        if (
          tData?.id &&
          tData.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
          tData.kode_tugas !== 'TUGAS-02-BERPIKIR-KOMPUTASIONAL' &&
          tData.kode_tugas !== 'TUGAS-02-KUIS-ALGO'
        ) {
          resolvedTaskId = tData.id;
          setDbTaskId(tData.id);
        }
      } catch (e) {
        console.warn('Gagal cari tugas_master SK saat submit:', e);
      }
    }
    if (!resolvedTaskId) {
      resolvedTaskId = '489b0d1e-8fd0-4bfa-9759-3996773347f3';
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
      // Jika tugas_pengumpulan masih kosong (previousBestScore === 0), SELALU simpan skor percobaan saat ini
      // Jika sudah pernah ada nilai sebelumnya, hanya timpa database jika nilainya LEBIH BESAR
      const isImproved = previousBestScore === 0 || currentAttemptScore > previousBestScore;
      const isRetained = previousBestScore > 0 && currentAttemptScore <= previousBestScore;
      const finalScoreToSave = Math.max(previousBestScore, currentAttemptScore);

      const detailLog = {
        scores,
        completed,
        breakdown: {
          m1_komponen_komputer: scores.m1 || 0,
          m2_data_aplikasi: scores.m2 || 0,
          m3_perkakas_digital: scores.m3 || 0,
          m4_etika_dampak_tik: scores.m4 || 0,
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
          catatan_guru: `Skor Praktik Sistem Komputer & Perkakas Digital: ${finalScoreToSave}/100 Poin (M1 Hardware: ${scores.m1 || 0}/35, M2 Data: ${scores.m2 || 0}/20, M3 Software: ${scores.m3 || 0}/30, M4 Etika: ${scores.m4 || 0}/15).`,
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
          console.error('Gagal simpan ke tugas_pengumpulan SK:', upsertErr);
          throw upsertErr;
        } else {
          console.log('[Tugas 3 SK] Berhasil tersimpan di tugas_pengumpulan (Trigger trg_sync_tugas_to_point_logs otomatis aktif):', resSub);
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
        console.log(`[Tugas 3 SK] Nilai database (${previousBestScore}) >= percobaan saat ini (${currentAttemptScore}). Data tugas_pengumpulan TIDAK ditimpa.`);
      }

      // 5. Trigger Grand Fireworks & Sound Effect!
      celebratePointGain(true);

      // 6. Update local state
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
      console.error('Gagal submit tugas SK:', err);
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

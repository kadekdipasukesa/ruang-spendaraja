import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';
import { celebratePointGain } from '../../../../components/RuangBelajar/TugasKhusus/Tugas3/skAssets';

const isValidUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export function useTugasSKState() {
  const location = useLocation();
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
  const DEFAULT_SK_TASK_ID = '595d2d95-d16f-4582-9be5-93d9db451f47';
  const [dbTaskId, setDbTaskId] = useState(DEFAULT_SK_TASK_ID);
  const dbTaskIdRef = useRef(DEFAULT_SK_TASK_ID);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateDbTaskId = useCallback((newId) => {
    if (newId && isValidUUID(newId) && dbTaskIdRef.current !== newId) {
      dbTaskIdRef.current = newId;
      setDbTaskId(newId);
    }
  }, []);

  const [submissionMeta, setSubmissionMeta] = useState({
    savedScore: 0,
    attemptScore: 0,
    previousScore: 0,
    isRetained: false,
    isImproved: false,
    isLower: false,
  });

  // Storage key spesifik per siswa untuk menyimpan jawaban terakhir
  const storageKey = useMemo(() => {
    return user?.id ? `tugas_sk_state_user_${user.id}` : 'tugas_sk_state_guest';
  }, [user?.id]);


  // Cek apakah sudah pernah kumpul di Supabase & muat progress terakhir
  // PRIORITAS UTAMA: Database-First (Muat langsung dari database Supabase jika ada, bukan dari local)
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
        dbTaskIdRef.current,
        DEFAULT_SK_TASK_ID,
      ].filter(isValidUUID);

      try {
        const { data: masterTasks } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-03-SISTEM-KOMPUTER,kode_tugas.eq.TUGAS_SK_01,kode_tugas.eq.tugas-inf-03,custom_route.ilike.%sistem-komputer%,judul.ilike.%Sistem Komputer%');

        if (masterTasks && masterTasks.length > 0) {
          masterTasks.forEach((m) => {
            // Lindungi agar ID tugas 1 dan tugas 2 tidak pernah masuk ke Tugas 3
            if (
              m?.id &&
              isValidUUID(m.id) &&
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
            m.kode_tugas !== 'TUGAS-02-KUIS-ALGO' &&
            isValidUUID(m.id)
          );
          if (validMaster?.id) {
            updateDbTaskId(validMaster.id);
          }
        }
      } catch (err) {
        console.warn('Cari candidate task master SK:', err);
      }

      // 2. Kueri ke tugas_pengumpulan khusus Tugas 3 (hanya kolom nyata, TANPA nilai_akhir)
      const validQueryIds = candidateTaskIds.filter(isValidUUID);
      const { data: subDataList, error: subErr } = await supabase
        .from('tugas_pengumpulan')
        .select('id, tugas_id, siswa_id, status, skor, persentase_skor, detail_jawaban, catatan_guru, submitted_at, graded_at')
        .eq('siswa_id', numStudentId)
        .in('tugas_id', validQueryIds.length > 0 ? validQueryIds : [DEFAULT_SK_TASK_ID])
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (subErr) {
        console.warn('Kueri tugas_pengumpulan SK returned error:', subErr);
      }

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

        const officialScore = Number(subData.skor) || 0;

        // PRIORITAS DATABASE MUTLAK: Pulihkan skor dan status misi dari database
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
          // Bila melanjutkan petualangan, langsung arahkan ke misi yang belum tuntas
          if (!parsedDetail.completed.m1) {
            setActiveMission(1);
          } else if (!parsedDetail.completed.m2) {
            setActiveMission(2);
          } else if (!parsedDetail.completed.m3) {
            setActiveMission(3);
          } else if (!parsedDetail.completed.m4) {
            setActiveMission(4);
          }
        }

        // PRIORITAS DATABASE MUTLAK: Pulihkan seluruh penempatan drag & drop dari database ke localStorage
        if (parsedDetail?.placements || parsedDetail?.missionData) {
          const loadedPlacements = parsedDetail.placements || parsedDetail.missionData;

          // Sinkronkan ke localStorage draft lokal agar langsung tersedia untuk semua komponen misi
          if (loadedPlacements?.m1?.hwPlacements) {
            try {
              localStorage.setItem('tugas_sk_m1_hw_placements', JSON.stringify(loadedPlacements.m1.hwPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m1?.swPlacements) {
            try {
              localStorage.setItem('tugas_sk_m1_sw_placements', JSON.stringify(loadedPlacements.m1.swPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m1?.quizAnswers) {
            try {
              localStorage.setItem('tugas_sk_m1_quiz_answers', JSON.stringify(loadedPlacements.m1.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m2?.pipelineAnswers) {
            try {
              localStorage.setItem('tugas_sk_m2_pipeline_answers', JSON.stringify(loadedPlacements.m2.pipelineAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m2?.quizAnswers) {
            try {
              localStorage.setItem('tugas_sk_m2_quiz_answers', JSON.stringify(loadedPlacements.m2.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m3?.appPlacements) {
            try {
              localStorage.setItem('tugas_sk_m3_app_placements', JSON.stringify(loadedPlacements.m3.appPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m3?.quizAnswers) {
            try {
              localStorage.setItem('tugas_sk_m3_quiz_answers', JSON.stringify(loadedPlacements.m3.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m4?.caseAnswers) {
            try {
              localStorage.setItem('tugas_sk_m4_case_answers', JSON.stringify(loadedPlacements.m4.caseAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m4?.quizAnswers) {
            try {
              localStorage.setItem('tugas_sk_m4_quiz_answers', JSON.stringify(loadedPlacements.m4.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
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
              completed: parsedDetail?.completed || {},
              placements: parsedDetail?.placements || parsedDetail?.missionData || null,
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
  }, [updateDbTaskId]);

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
          setUser((prev) => (prev?.id === parsed.id ? prev : parsed));
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

          const routeTaskId = location?.state?.taskId || new URLSearchParams(location?.search).get('taskId');
          const resolvedTargetTaskId = (routeTaskId && isValidUUID(routeTaskId)) ? routeTaskId : dbTaskIdRef.current;

          if (parsed.id) {
            checkExistingSubmission(parsed.id, currentKey, resolvedTargetTaskId);
          } else {
            setLoading(false);
          }
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
  }, [checkExistingSubmission]);

  // Cari ID master tugas dari database saat pertama kali mount
  useEffect(() => {
    let isMounted = true;
    const findTask = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('kode_tugas.eq.TUGAS-03-SISTEM-KOMPUTER,kode_tugas.eq.tugas-inf-03,kode_tugas.eq.TUGAS_SK_01,custom_route.ilike.%sistem-komputer%,judul.ilike.%Sistem Komputer & Perkakas Digital%')
          .limit(1)
          .maybeSingle();

        if (
          isMounted &&
          data?.id &&
          data.kode_tugas !== 'TUGAS-01-SIMULASI-FOLDER' &&
          data.kode_tugas !== 'TUGAS-02-BERPIKIR-KOMPUTASIONAL' &&
          data.kode_tugas !== 'TUGAS-02-KUIS-ALGO'
        ) {
          updateDbTaskId(data.id);
        }
      } catch (err) {
        console.warn('Kueri tugas_master SK:', err);
      }
    };
    findTask();
    return () => {
      isMounted = false;
    };
  }, [updateDbTaskId]);

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
    try {
      localStorage.removeItem('tugas_sk_m1_hw_placements');
      localStorage.removeItem('tugas_sk_m1_sw_placements');
      localStorage.removeItem('tugas_sk_m1_quiz_answers');
      localStorage.removeItem('tugas_sk_m2_pipeline_answers');
      localStorage.removeItem('tugas_sk_m2_quiz_answers');
      localStorage.removeItem('tugas_sk_m3_app_placements');
      localStorage.removeItem('tugas_sk_m3_quiz_answers');
      localStorage.removeItem('tugas_sk_m4_case_answers');
      localStorage.removeItem('tugas_sk_m4_quiz_answers');
    } catch (e) {
      /* ignore */
    }
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  // Submit: Menyimpan seluruh snapshot penempatan & jawaban ke database.
  // Jika nilai di database sebelumnya lebih tinggi dari percobaan saat ini, NILAI TIDAK DIREPLACE / DITURUNKAN.
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
    if (!resolvedTaskId || !isValidUUID(resolvedTaskId)) {
      resolvedTaskId = DEFAULT_SK_TASK_ID;
    }

    try {
      const currentAttemptScore = totalScore;

      // 1. Cek skor terbaik sebelumnya dari database tugas_pengumpulan
      let previousBestScore = 0;
      if (existingSubmission && (existingSubmission.tugas_id === resolvedTaskId || !existingSubmission.tugas_id)) {
        previousBestScore = Number(existingSubmission.skor ?? 0) || 0;
      }

      try {
        const { data: dbSub } = await supabase
          .from('tugas_pengumpulan')
          .select('id, skor, detail_jawaban')
          .eq('siswa_id', studentIdInt)
          .eq('tugas_id', resolvedTaskId)
          .maybeSingle();

        if (dbSub) {
          const dbScore = Number(dbSub.skor ?? 0) || 0;
          previousBestScore = Math.max(previousBestScore, dbScore);
        }
      } catch (e) {
        console.warn('Kueri previous submission tugas_pengumpulan error:', e);
      }

      // ATURAN PROTEKSI SKOR DATABASE:
      // - isImproved: Skor percobaan saat ini lebih tinggi dari database sebelumnya (atau pertama kali).
      // - isLower: Nilai di database sebelumnya lebih tinggi dari nilai sekarang.
      // Jika isLower = true: NILAI DI DATABASE TIDAK DIREPLACE / DITURUNKAN. Nilai resmi tetap previousBestScore!
      const isImproved = previousBestScore === 0 || currentAttemptScore > previousBestScore;
      const isLower = previousBestScore > 0 && currentAttemptScore < previousBestScore;
      const isEqual = previousBestScore > 0 && currentAttemptScore === previousBestScore;
      const isRetained = isLower || isEqual;
      const finalScoreToSave = Math.max(previousBestScore, currentAttemptScore);

      // Siapkan snapshot detail penempatan komponen langsung dari localStorage
      let currentHwPlacements = null;
      let currentSwPlacements = null;
      let currentM1Quiz = null;
      let currentM2Pipeline = null;
      let currentM2Quiz = null;
      let currentAppPlacements = null;
      let currentM3Quiz = null;
      let currentM4Cases = null;
      let currentM4Quiz = null;

      try {
        const hws = localStorage.getItem('tugas_sk_m1_hw_placements');
        if (hws) currentHwPlacements = JSON.parse(hws);
        const sws = localStorage.getItem('tugas_sk_m1_sw_placements');
        if (sws) currentSwPlacements = JSON.parse(sws);
        const m1q = localStorage.getItem('tugas_sk_m1_quiz_answers');
        if (m1q) currentM1Quiz = JSON.parse(m1q);

        const m2p = localStorage.getItem('tugas_sk_m2_pipeline_answers');
        if (m2p) currentM2Pipeline = JSON.parse(m2p);
        const m2q = localStorage.getItem('tugas_sk_m2_quiz_answers');
        if (m2q) currentM2Quiz = JSON.parse(m2q);

        const apps = localStorage.getItem('tugas_sk_m3_app_placements');
        if (apps) currentAppPlacements = JSON.parse(apps);
        const m3q = localStorage.getItem('tugas_sk_m3_quiz_answers');
        if (m3q) currentM3Quiz = JSON.parse(m3q);

        const m4c = localStorage.getItem('tugas_sk_m4_case_answers');
        if (m4c) currentM4Cases = JSON.parse(m4c);
        const m4q = localStorage.getItem('tugas_sk_m4_quiz_answers');
        if (m4q) currentM4Quiz = JSON.parse(m4q);
      } catch (e) {
        /* ignore */
      }

      const consolidatedPlacements = {
        m1: {
          hwPlacements: currentHwPlacements || null,
          swPlacements: currentSwPlacements || null,
          quizAnswers: currentM1Quiz || null,
        },
        m2: {
          pipelineAnswers: currentM2Pipeline || null,
          quizAnswers: currentM2Quiz || null,
        },
        m3: {
          appPlacements: currentAppPlacements || null,
          quizAnswers: currentM3Quiz || null,
        },
        m4: {
          caseAnswers: currentM4Cases || null,
          quizAnswers: currentM4Quiz || null,
        },
      };

      const detailLog = {
        scores,
        completed,
        placements: consolidatedPlacements,
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
        is_lower: isLower,
        submitted_at: new Date().toISOString()
      };

      // 2. Simpan ke database:
      // Bila isLower: Skor yang disimpan TETAP previousBestScore (nilai tidak di-replace/turun),
      // namun posisi penempatan komponen tetap diperbarui di detail_jawaban agar bisa dilanjutkan di perangkat lain.
      const payload = {
        tugas_id: resolvedTaskId,
        siswa_id: studentIdInt,
        status: 'selesai',
        skor: Math.round(finalScoreToSave),
        persentase_skor: Math.min(100, Math.max(0, finalScoreToSave)),
        detail_jawaban: detailLog,
        catatan_guru: isLower
          ? `Skor Praktik Sistem Komputer: ${finalScoreToSave}/100 Poin (Nilai tertinggi sebelumnya dipertahankan. Percobaan saat ini: ${currentAttemptScore}/100 Poin).`
          : `Skor Praktik Sistem Komputer & Perkakas Digital: ${finalScoreToSave}/100 Poin (M1 Hardware: ${scores.m1 || 0}/35, M2 Data: ${scores.m2 || 0}/20, M3 Software: ${scores.m3 || 0}/30, M4 Etika: ${scores.m4 || 0}/15).`,
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: resSub, error: upsertErr } = await supabase
        .from('tugas_pengumpulan')
        .upsert(payload, { onConflict: 'tugas_id,siswa_id' })
        .select()
        .maybeSingle();

      if (upsertErr) {
        console.error('Gagal simpan ke tugas_pengumpulan SK:', upsertErr);
        throw upsertErr;
      }

      console.log('[Tugas 3 SK] Berhasil tersimpan di tugas_pengumpulan:', resSub);

      // Sinkronisasi total_points ke master_siswa & user session jika ada peningkatan rekor
      if (isImproved) {
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
      }

      // Sinkronisasi local storage
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            scores,
            completed,
            placements: consolidatedPlacements,
            updated_at: new Date().toISOString()
          }));
        } catch (e) {
          /* ignore */
        }
      }

      // 3. Trigger Grand Fireworks
      celebratePointGain(true);

      // 4. Update local submission state
      setSubmitted(true);
      setExistingSubmission(resSub || {
        tugas_id: resolvedTaskId,
        siswa_id: studentIdInt,
        status: 'selesai',
        skor: finalScoreToSave,
        nilai_akhir: finalScoreToSave,
        detail_jawaban: detailLog,
        submitted_at: new Date().toISOString(),
      });

      setSubmissionMeta({
        savedScore: finalScoreToSave,
        attemptScore: currentAttemptScore,
        previousScore: previousBestScore,
        isRetained,
        isImproved,
        isLower,
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

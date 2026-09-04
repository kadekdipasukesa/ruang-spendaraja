import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';
import { celebratePointGain } from '../../../../components/RuangBelajar/TugasKhusus/Tugas3/skAssets';

// Helper pembatas poin tiap misi Sistem Komputer agar tidak pernah melebihi batas maksimal:
// M1 (Komponen Sistem Komputer): Max 35 Poin
// M2 (Siklus Data & Aplikasi): Max 20 Poin
// M3 (Perkakas Digital & Software): Max 30 Poin
// M4 (Dampak & Etika Digital TIK): Max 15 Poin
// Total Max = 100 Poin
const clampSKScores = (raw) => ({
  m1: Math.min(35, Math.max(0, Math.round(Number(raw?.m1) || 0))),
  m2: Math.min(20, Math.max(0, Math.round(Number(raw?.m2) || 0))),
  m3: Math.min(30, Math.max(0, Math.round(Number(raw?.m3) || 0))),
  m4: Math.min(15, Math.max(0, Math.round(Number(raw?.m4) || 0))),
});

export const getSKStorageKey = (name, userId) => {
  const uid = userId ? String(userId) : 'guest';
  return `tugas_sk_${name}_user_${uid}`;
};

export const clearLegacySKStorage = () => {
  try {
    const legacyKeys = [
      'tugas_sk_m1_hw_placements',
      'tugas_sk_m1_sw_placements',
      'tugas_sk_m1_quiz_answers',
      'tugas_sk_m2_pipeline_answers',
      'tugas_sk_m2_quiz_answers',
      'tugas_sk_m3_app_placements',
      'tugas_sk_m3_quiz_answers',
      'tugas_sk_m4_case_answers',
      'tugas_sk_m4_quiz_answers',
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    /* ignore */
  }
};

export const clearUserSKDrafts = (userId) => {
  try {
    const uid = userId ? String(userId) : 'guest';
    const keys = [
      `tugas_sk_m1_hw_placements_user_${uid}`,
      `tugas_sk_m1_sw_placements_user_${uid}`,
      `tugas_sk_m1_quiz_answers_user_${uid}`,
      `tugas_sk_m2_pipeline_answers_user_${uid}`,
      `tugas_sk_m2_quiz_answers_user_${uid}`,
      `tugas_sk_m3_app_placements_user_${uid}`,
      `tugas_sk_m3_quiz_answers_user_${uid}`,
      `tugas_sk_m4_case_answers_user_${uid}`,
      `tugas_sk_m4_quiz_answers_user_${uid}`,
      `tugas_sk_state_user_${uid}`,
    ];
    keys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    /* ignore */
  }
};

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
  const DEFAULT_SK_TASK_ID = '489b0d1e-8fd0-4bfa-9759-3996773347f3';
  const [dbTaskId, setDbTaskId] = useState(DEFAULT_SK_TASK_ID);
  const dbTaskIdRef = useRef(DEFAULT_SK_TASK_ID);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updateDbTaskId = useCallback((newId) => {
    if (newId && dbTaskIdRef.current !== newId) {
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
          if (validMaster?.id) {
            updateDbTaskId(validMaster.id);
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

        // PRIORITAS DATABASE MUTLAK: Pulihkan skor dan status misi dari database
        if (parsedDetail?.scores) {
          setScores(clampSKScores(parsedDetail.scores));
        }

        if (parsedDetail?.completed) {
          setCompleted(parsedDetail.completed);
        }

        // PRIORITAS DATABASE MUTLAK: Pulihkan seluruh penempatan drag & drop dari database ke localStorage khusus user ini
        if (parsedDetail?.placements || parsedDetail?.missionData) {
          const loadedPlacements = parsedDetail.placements || parsedDetail.missionData;

          if (loadedPlacements?.m1?.hwPlacements) {
            try {
              localStorage.setItem(getSKStorageKey('m1_hw_placements', numStudentId), JSON.stringify(loadedPlacements.m1.hwPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m1?.swPlacements) {
            try {
              localStorage.setItem(getSKStorageKey('m1_sw_placements', numStudentId), JSON.stringify(loadedPlacements.m1.swPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m1?.quizAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m1_quiz_answers', numStudentId), JSON.stringify(loadedPlacements.m1.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m2?.pipelineAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m2_pipeline_answers', numStudentId), JSON.stringify(loadedPlacements.m2.pipelineAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m2?.quizAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m2_quiz_answers', numStudentId), JSON.stringify(loadedPlacements.m2.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m3?.appPlacements) {
            try {
              localStorage.setItem(getSKStorageKey('m3_app_placements', numStudentId), JSON.stringify(loadedPlacements.m3.appPlacements));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m3?.quizAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m3_quiz_answers', numStudentId), JSON.stringify(loadedPlacements.m3.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m4?.caseAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m4_case_answers', numStudentId), JSON.stringify(loadedPlacements.m4.caseAnswers));
            } catch (e) {
              /* ignore */
            }
          }
          if (loadedPlacements?.m4?.quizAnswers) {
            try {
              localStorage.setItem(getSKStorageKey('m4_quiz_answers', numStudentId), JSON.stringify(loadedPlacements.m4.quizAnswers));
            } catch (e) {
              /* ignore */
            }
          }
        }

        setExistingSubmission({
          ...subData,
          skor: Math.min(100, Math.max(0, officialScore)),
          nilai_akhir: Math.min(100, Math.max(0, officialScore)),
          detail_jawaban: parsedDetail || subData.detail_jawaban
        });
        setSubmitted(true);

        // Sinkronkan balik snapshot database ke localStorage agar cache lokal ter-update sesuai database
        if (currentKey) {
          try {
            localStorage.setItem(currentKey, JSON.stringify({
              scores: parsedDetail?.scores ? clampSKScores(parsedDetail.scores) : { m1: 0, m2: 0, m3: 0, m4: 0 },
              completed: parsedDetail?.completed || {},
              placements: parsedDetail?.placements || parsedDetail?.missionData || null,
            }));
          } catch (e) {
            console.warn('Gagal sinkron database ke local storage:', e);
          }
        }
      } else {
        // Database tugas 3 bersih / akun siswa ini belum pernah mengumpulkan tugas 3!
        setExistingSubmission(null);
        setSubmitted(false);

        // Periksa apakah ada draft lokal yang tersimpan khusus untuk akun ini
        const localSaved = currentKey ? localStorage.getItem(currentKey) : null;
        if (localSaved) {
          try {
            const parsedLocal = JSON.parse(localSaved);
            if (parsedLocal.scores) setScores(clampSKScores(parsedLocal.scores));
            if (parsedLocal.completed) setCompleted(parsedLocal.completed);
          } catch (e) {
            setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
            setCompleted({ m1: false, m2: false, m3: false, m4: false });
          }
        } else {
          // Akun ini belum pernah mengerjakan: pastikan SEMUA skor dan status selesai bersih 0!
          setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
          setCompleted({ m1: false, m2: false, m3: false, m4: false });
          clearUserSKDrafts(numStudentId);
        }
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
        clearLegacySKStorage();
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

          // Muat state lokal siswa jika ada (dengan batas aman)
          const localSaved = localStorage.getItem(currentKey);
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(clampSKScores(parsedLocal.scores));
              if (parsedLocal.completed) setCompleted(parsedLocal.completed);
            } catch (e) {
              console.warn('Gagal parse local saved SK state:', e);
            }
          } else {
            // User baru belum ada draft: reset ke 0 agar tidak mewarisi sisa akun lain
            setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
            setCompleted({ m1: false, m2: false, m3: false, m4: false });
          }

          if (parsed.id) {
            checkExistingSubmission(parsed.id, currentKey, dbTaskIdRef.current);
          } else {
            setLoading(false);
          }
        } else {
          // Guest mode
          const localSaved = localStorage.getItem('tugas_sk_state_guest');
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal.scores) setScores(clampSKScores(parsedLocal.scores));
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

  // Simpan progres ke state dan localStorage setiap kali ada misi selesai (dengan batas poin tegas)
  const handleMissionComplete = useCallback((missionKey, score) => {
    let maxCap = 15;
    if (missionKey === 'm1') maxCap = 35;
    else if (missionKey === 'm2') maxCap = 20;
    else if (missionKey === 'm3') maxCap = 30;
    else if (missionKey === 'm4') maxCap = 15;
    const clampedScore = Math.min(maxCap, Math.max(0, Math.round(Number(score) || 0)));

    setScores((prevScores) => {
      if (prevScores[missionKey] === clampedScore) {
        return prevScores;
      }
      const newScores = clampSKScores({ ...prevScores, [missionKey]: clampedScore });
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

  // Total skor terhitung dengan batas maksimal pasti 100 poin
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      (Math.min(35, Number(scores.m1) || 0)) +
      (Math.min(20, Number(scores.m2) || 0)) +
      (Math.min(30, Number(scores.m3) || 0)) +
      (Math.min(15, Number(scores.m4) || 0))
    )
  );
  const isAllCompleted = completed.m1 && completed.m2 && completed.m3 && completed.m4;

  const handleResetAll = () => {
    setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
    setCompleted({ m1: false, m2: false, m3: false, m4: false });
    clearLegacySKStorage();
    if (user?.id) {
      clearUserSKDrafts(user.id);
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
    if (!resolvedTaskId) {
      resolvedTaskId = '489b0d1e-8fd0-4bfa-9759-3996773347f3';
    }

    try {
      const clampedScores = clampSKScores(scores);
      const currentAttemptScore = Math.min(
        100,
        Math.max(0, clampedScores.m1 + clampedScores.m2 + clampedScores.m3 + clampedScores.m4)
      );

      // 1. Cek skor terbaik sebelumnya dari database tugas_pengumpulan (maksimal 100)
      let previousBestScore = 0;
      if (existingSubmission && (existingSubmission.tugas_id === resolvedTaskId || !existingSubmission.tugas_id)) {
        previousBestScore = Math.min(100, Math.max(0, Number(existingSubmission.skor ?? existingSubmission.nilai_akhir ?? 0) || 0));
      }

      try {
        const { data: dbSub } = await supabase
          .from('tugas_pengumpulan')
          .select('id, skor, nilai_akhir, detail_jawaban')
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

      // ATURAN PROTEKSI SKOR DATABASE:
      // - isImproved: Skor percobaan saat ini lebih tinggi dari database sebelumnya (atau pertama kali).
      // - isLower: Nilai di database sebelumnya lebih tinggi dari nilai sekarang.
      // Jika isLower = true: NILAI DI DATABASE TIDAK DIREPLACE / DITURUNKAN. Nilai resmi tetap previousBestScore!
      const isImproved = previousBestScore === 0 || currentAttemptScore > previousBestScore;
      const isLower = previousBestScore > 0 && currentAttemptScore < previousBestScore;
      const isEqual = previousBestScore > 0 && currentAttemptScore === previousBestScore;
      const isRetained = isLower || isEqual;
      const finalScoreToSave = Math.min(100, Math.max(previousBestScore, currentAttemptScore));

      // Siapkan snapshot detail penempatan komponen langsung dari localStorage berdasarkan studentId
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
        const hws = localStorage.getItem(getSKStorageKey('m1_hw_placements', studentIdInt));
        if (hws) currentHwPlacements = JSON.parse(hws);
        const sws = localStorage.getItem(getSKStorageKey('m1_sw_placements', studentIdInt));
        if (sws) currentSwPlacements = JSON.parse(sws);
        const m1q = localStorage.getItem(getSKStorageKey('m1_quiz_answers', studentIdInt));
        if (m1q) currentM1Quiz = JSON.parse(m1q);

        const m2p = localStorage.getItem(getSKStorageKey('m2_pipeline_answers', studentIdInt));
        if (m2p) currentM2Pipeline = JSON.parse(m2p);
        const m2q = localStorage.getItem(getSKStorageKey('m2_quiz_answers', studentIdInt));
        if (m2q) currentM2Quiz = JSON.parse(m2q);

        const apps = localStorage.getItem(getSKStorageKey('m3_app_placements', studentIdInt));
        if (apps) currentAppPlacements = JSON.parse(apps);
        const m3q = localStorage.getItem(getSKStorageKey('m3_quiz_answers', studentIdInt));
        if (m3q) currentM3Quiz = JSON.parse(m3q);

        const m4c = localStorage.getItem(getSKStorageKey('m4_case_answers', studentIdInt));
        if (m4c) currentM4Cases = JSON.parse(m4c);
        const m4q = localStorage.getItem(getSKStorageKey('m4_quiz_answers', studentIdInt));
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
        scores: clampedScores,
        completed,
        placements: consolidatedPlacements,
        breakdown: {
          m1_komponen_komputer: clampedScores.m1,
          m2_data_aplikasi: clampedScores.m2,
          m3_perkakas_digital: clampedScores.m3,
          m4_etika_dampak_tik: clampedScores.m4,
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
        skor: Math.min(100, Math.max(0, Math.round(finalScoreToSave))),
        persentase_skor: Math.min(100, Math.max(0, finalScoreToSave)),
        detail_jawaban: detailLog,
        catatan_guru: isLower
          ? `Skor Praktik Sistem Komputer: ${finalScoreToSave}/100 Poin (Nilai tertinggi sebelumnya dipertahankan. Percobaan saat ini: ${currentAttemptScore}/100 Poin).`
          : `Skor Praktik Sistem Komputer & Perkakas Digital: ${finalScoreToSave}/100 Poin (M1 Hardware: ${clampedScores.m1}/35, M2 Data: ${clampedScores.m2}/20, M3 Software: ${clampedScores.m3}/30, M4 Etika: ${clampedScores.m4}/15).`,
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

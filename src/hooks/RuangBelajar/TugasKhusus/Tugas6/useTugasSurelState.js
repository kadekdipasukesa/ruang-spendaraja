/**
 * src/hooks/RuangBelajar/TugasKhusus/Tugas6/useTugasSurelState.js
 * Controller State Tugas 6: Komunikasi Resmi Surel (Gmail)
 * Mendukung persistensi Supabase Schema v2.0 & Penilaian Pending oleh Admin
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { TUGAS_6_CONFIG, TAHAPAN_TUGAS_6 } from '../../../../data/tugas6SurelData';
import { buildStandardDetailJawaban, parseDetailJawaban } from '../../../../utils/tugasSchemaHelper';
import { uploadTugas6ScreenshotToCloudinary } from '../../../../utils/cloudinaryUpload';

function isUUID(str) {
  if (!str || typeof str !== 'string') return false;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
}

export function useTugasSurelState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbTaskId, setDbTaskId] = useState(TUGAS_6_CONFIG.id);
  const dbTaskIdRef = useRef(TUGAS_6_CONFIG.id);

  // Navigasi Tahap
  const [activeStage, setActiveStage] = useState(1);

  // Jawaban Kuis Tiap Tahap: { 1: 'B', 2: 'B', 3: 'C' }
  const [quizAnswers, setQuizAnswers] = useState({});

  // Screenshot Tiap Tahap: { 1: { secureUrl, fileName, fileSize }, 2: ..., 3: ... }
  const [uploadedScreenshots, setUploadedScreenshots] = useState({});

  // Status Upload
  const [uploadingStage, setUploadingStage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Status Database & Submisi
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Cek apakah user adalah admin (berdasarkan role di master_siswa)
  const isAdmin = useMemo(() => {
    if (!user) return false;
    const r1 = (user.role || '').toLowerCase();
    const r2 = (user.role_2 || '').toLowerCase();
    return r1 === 'admin' || r2 === 'admin';
  }, [user]);

  // 1. Ambil Task ID Resmi dari Database tugas_master
  useEffect(() => {
    let isMounted = true;
    const resolveTaskId = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul')
          .or(`id.eq.${TUGAS_6_CONFIG.id},kode_tugas.eq.${TUGAS_6_CONFIG.kode_tugas},judul.ilike.%Surel%,judul.ilike.%Gmail%`)
          .limit(1)
          .maybeSingle();

        if (isMounted && data?.id && isUUID(data.id)) {
          dbTaskIdRef.current = data.id;
          setDbTaskId(data.id);
        }
      } catch (err) {
        console.warn('Kueri tugas_master Tugas 6 Surel:', err);
      }
    };
    resolveTaskId();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load User dan Pulihkan Progres Pengerjaan dari Database
  const checkExistingSubmission = useCallback(async (student) => {
    if (!student) return null;
    const resolvedTaskId = dbTaskIdRef.current || TUGAS_6_CONFIG.id;
    let numStudentId = Number(student.id || student.ID);

    try {
      if ((!numStudentId || isNaN(numStudentId)) && student.NISN) {
        const { data: sRow } = await supabase
          .from('master_siswa')
          .select('id, role')
          .eq('NISN', String(student.NISN))
          .maybeSingle();
        if (sRow?.id) numStudentId = Number(sRow.id);
      }

      if (!numStudentId || isNaN(numStudentId)) return null;

      const { data: sub, error } = await supabase
        .from('tugas_pengumpulan')
        .select('*')
        .eq('tugas_id', resolvedTaskId)
        .eq('siswa_id', numStudentId)
        .maybeSingle();

      if (!error && sub) {
        setExistingSubmission(sub);

        const { isLegacy, data: detail } = parseDetailJawaban(sub.detail_jawaban);

        if (!isLegacy && detail?.stages) {
          // Pulihkan jawaban kuis
          const restoredQuiz = {};
          const restoredSS = {};

          Object.keys(detail.stages).forEach((key) => {
            const st = detail.stages[key];
            const stageNum = key.replace('tahap_', '');
            if (st.quiz_answer) {
              restoredQuiz[stageNum] = st.quiz_answer;
            }
            if (st.screenshot_info?.secureUrl) {
              restoredSS[stageNum] = st.screenshot_info;
            } else if (st.screenshot_url) {
              restoredSS[stageNum] = {
                secureUrl: st.screenshot_url,
                fileName: `screenshot_tahap_${stageNum}.jpg`,
              };
            }
          });

          setQuizAnswers(restoredQuiz);
          setUploadedScreenshots(restoredSS);
        }
      }
    } catch (err) {
      console.warn('Gagal memulihkan progres Tugas 6:', err);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('user_siswa');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        checkExistingSubmission(parsed).finally(() => setLoading(false));
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [checkExistingSubmission]);

  // Handler Jawab Kuis
  const handleAnswerQuiz = useCallback((stageId, optionId) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [stageId]: optionId,
    }));
  }, []);

  // Handler Upload Screenshot per Tahap
  const handleUploadScreenshot = useCallback(async (stageId, file) => {
    if (!file) return;
    setUploadingStage(stageId);
    setUploadProgress(0);

    try {
      const result = await uploadTugas6ScreenshotToCloudinary(
        file,
        user || {},
        stageId,
        (progress) => setUploadProgress(progress)
      );

      setUploadedScreenshots((prev) => ({
        ...prev,
        [stageId]: result,
      }));

      showToast(`Screenshot Tahap ${stageId} berhasil diunggah!`);
    } catch (err) {
      console.error('Upload screenshot gagal:', err);
      showToast(err.message || 'Gagal mengunggah screenshot.');
    } finally {
      setUploadingStage(null);
      setUploadProgress(0);
    }
  }, [user, showToast]);

  // Handler Hapus Screenshot
  const handleDeleteScreenshot = useCallback((stageId) => {
    setUploadedScreenshots((prev) => {
      const copy = { ...prev };
      delete copy[stageId];
      return copy;
    });
    showToast(`Screenshot Tahap ${stageId} dihapus.`);
  }, [showToast]);

  // Evaluasi Kelengkapan (Apakah 3 tahap sudah ada kuis & screenshot)
  const completionStats = useMemo(() => {
    let completedCount = 0;
    TAHAPAN_TUGAS_6.forEach((t) => {
      const hasQuiz = Boolean(quizAnswers[t.id]);
      const hasSS = Boolean(uploadedScreenshots[t.id]?.secureUrl);
      if (hasQuiz && hasSS) completedCount += 1;
    });
    return {
      completedCount,
      totalStages: TAHAPAN_TUGAS_6.length,
      isAllComplete: completedCount === TAHAPAN_TUGAS_6.length,
    };
  }, [quizAnswers, uploadedScreenshots]);

  // Handler Simpan / Kumpulkan Semua Tahap ke Supabase
  const handleSubmitAll = useCallback(async () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu.');
      return;
    }
    if (!completionStats.isAllComplete) {
      showToast('Harap selesaikan kuis dan unggah screenshot untuk semua 3 tahap.');
      return;
    }

    setSubmitting(true);
    const resolvedTaskId = dbTaskIdRef.current || TUGAS_6_CONFIG.id;
    const numStudentId = Number(user.id || user.ID);

    try {
      // Bentuk stagesData sesuai Schema v2.0
      const stagesData = {};
      TAHAPAN_TUGAS_6.forEach((t) => {
        stagesData[`tahap_${t.id}`] = {
          status: 'completed',
          quiz_answer: quizAnswers[t.id] || null,
          screenshot_info: uploadedScreenshots[t.id] || null,
          screenshot_url: uploadedScreenshots[t.id]?.secureUrl || null,
          completed_at: new Date().toISOString(),
        };
      });

      // Kolom detail_jawaban terstandar v2.0
      const detailLog = buildStandardDetailJawaban({
        kodeTugas: TUGAS_6_CONFIG.kode_tugas,
        judulTugas: TUGAS_6_CONFIG.judul,
        tipeTugas: 'multi_stage',
        activeStage,
        totalStages: 3,
        skorMaksimal: 100,
        skorDiperoleh: 0, // Pending penilaian guru!
        skorTertinggiDisimpan: existingSubmission?.skor || 0,
        breakdownSkor: [
          { id: 'tahap_1', label: 'Akun & Inbox Gmail', skor: 0, skor_maks: 30, status: 'sebagian' },
          { id: 'tahap_2', label: 'Alamat To & Cc', skor: 0, skor_maks: 35, status: 'sebagian' },
          { id: 'tahap_3', label: 'Isi Surat Izin Formal', skor: 0, skor_maks: 35, status: 'sebagian' },
        ],
        stagesData,
        berkasInfo: uploadedScreenshots[3] || uploadedScreenshots[1] || null,
        autoGrading: {
          is_auto_graded: false,
          kriteria_terpenuhi: ['3_screenshot_terunggah', 'kuis_terjawab'],
          kriteria_kurang: [],
          catatan_sistem: 'Semua bukti screenshot berhasil dikirim. Menunggu verifikasi nilai oleh Admin.',
        },
        customState: {
          needs_teacher_review: true,
          submitted_screenshots_count: 3,
        },
        isCompleted: true,
      });

      // Payload SQL murni ke tabel tugas_pengumpulan
      // Catatan: skor disetel NULL agar database trigger belum memasukkan poin sampai admin meng-ACC
      const payload = {
        tugas_id: resolvedTaskId,
        siswa_id: numStudentId,
        status: 'menunggu_verifikasi',
        skor: existingSubmission?.skor !== undefined && existingSubmission?.skor !== null ? existingSubmission.skor : null,
        tautan_tugas: uploadedScreenshots[3]?.secureUrl || uploadedScreenshots[1]?.secureUrl || null,
        nama_berkas: uploadedScreenshots[3]?.fileName || uploadedScreenshots[1]?.fileName || null,
        detail_jawaban: detailLog,
        catatan_siswa: 'Tugas 6: 3 tangkapan layar pengerjaan Gmail berhasil dikumpulkan untuk diperiksa.',
        submitted_at: existingSubmission?.submitted_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: saved, error } = await supabase
        .from('tugas_pengumpulan')
        .upsert(payload, { onConflict: 'tugas_id,siswa_id' })
        .select()
        .maybeSingle();

      if (error) throw error;

      setExistingSubmission(saved || { ...existingSubmission, ...payload });
      setShowSuccessModal(true);
      showToast('Tugas 6 berhasil dikumpulkan! Menunggu ACC Admin.');
    } catch (err) {
      console.error('Gagal mengumpulkan Tugas 6:', err);
      showToast('Gagal mengumpulkan tugas: ' + (err.message || 'Error Supabase'));
    } finally {
      setSubmitting(false);
    }
  }, [user, completionStats.isAllComplete, activeStage, quizAnswers, uploadedScreenshots, existingSubmission, showToast]);

  return {
    user,
    loading,
    isAdmin,
    activeStage,
    setActiveStage,
    quizAnswers,
    handleAnswerQuiz,
    uploadedScreenshots,
    uploadingStage,
    uploadProgress,
    handleUploadScreenshot,
    handleDeleteScreenshot,
    completionStats,
    existingSubmission,
    submitting,
    showSuccessModal,
    setShowSuccessModal,
    toastMessage,
    handleSubmitAll,
  };
}

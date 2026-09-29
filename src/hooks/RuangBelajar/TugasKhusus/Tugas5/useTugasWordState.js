import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';
import { uploadTugas5ToCloudinary } from '../../../../utils/cloudinaryUpload';
import {
  TUGAS_5_CONFIG,
  MATERI_TOPIK_WORD,
  KUIS_MS_WORD_QUESTIONS
} from '../../../../data/tugas5WordData';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (str) => typeof str === 'string' && UUID_REGEX.test(str);

export function useTugasWordState() {
  // User Authentication State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Database Task ID
  const [dbTaskId, setDbTaskId] = useState(TUGAS_5_CONFIG.id);
  const dbTaskIdRef = useRef(TUGAS_5_CONFIG.id);

  // Main Tabs Stage: 1 = Literasi Materi, 2 = Kuis Fitur Ms Word, 3 = Proyek & Upload
  const [activeStage, setActiveStage] = useState(1);

  // ─── TAHAP 1: LITERASI MATERI BERTAPAK (Threshold 45s & Checkpoint) ───
  const [activeTopicId, setActiveTopicId] = useState(1);
  const [completedTopicIds, setCompletedTopicIds] = useState([]); // [1, 2, ...]
  const [readingSeconds, setReadingSeconds] = useState({}); // { 1: 45, 2: 30, ... }
  const [checkpointAnswers, setCheckpointAnswers] = useState({}); // { 1: 'A', ... }
  const [checkpointFeedback, setCheckpointFeedback] = useState(null); // { topicId, isCorrect, message }

  // ─── TAHAP 2: KUIS FITUR MS WORD ───
  const [quizAnswers, setQuizAnswers] = useState({}); // { q1: 'B', q2: 'A', ... }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // ─── TAHAP 3: PROYEK NASKAH & UNGGAH CLOUDINARY ───
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null); // { secureUrl, fileName, fileSize, format }

  // Submission Status
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scoreProtectionNotice, setScoreProtectionNotice] = useState(null);

  // In-App Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const clearToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(null);
  }, []);

  // Update Task ID Ref
  const updateDbTaskId = useCallback((newId) => {
    if (newId && isUUID(newId)) {
      dbTaskIdRef.current = newId;
      setDbTaskId(newId);
    }
  }, []);

  // Helper Ambil data user dari localStorage
  const getStoredUser = useCallback(() => {
    try {
      const stored = localStorage.getItem('user_siswa') ||
        localStorage.getItem('student') ||
        localStorage.getItem('user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca storage user:', e);
    }
    return null;
  }, []);

  // 1. Cari ID Tugas 5 di Database tugas_master (Bila ada yang cocok)
  useEffect(() => {
    let isMounted = true;
    const findTask = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('id.eq.6f2a8901-4bc1-4e78-9b55-d1a8e265b489,kode_tugas.eq.TUGAS-05-WORD-BROSUR,kode_tugas.eq.TUGAS-05-WORD-PENGALAMAN-BELAJAR,kode_tugas.eq.TUGAS-05-PENGOLAH-KATA,custom_route.ilike.%pengolah-kata%,judul.ilike.%Pengolah Kata%,judul.ilike.%Word%')
          .limit(1)
          .maybeSingle();

        if (isMounted && data?.id && isUUID(data.id)) {
          updateDbTaskId(data.id);
        }
      } catch (err) {
        console.warn('Kueri tugas_master Tugas 5 Word:', err);
      }
    };
    findTask();
    return () => {
      isMounted = false;
    };
  }, [updateDbTaskId]);

  // 2. Load User dan Pulihkan Progres Pengerjaan dari Database
  const checkExistingSubmission = useCallback(async (student) => {
    if (!student) return null;
    const resolvedTaskId = dbTaskIdRef.current || TUGAS_5_CONFIG.id;
    const numStudentId = Number(student.id || student.ID);
    const studentNisn = student.NISN || student.nisn;

    try {
      const candidateTaskIds = ['6f2a8901-4bc1-4e78-9b55-d1a8e265b489'];
      if (resolvedTaskId && isUUID(resolvedTaskId) && !candidateTaskIds.includes(resolvedTaskId)) {
        candidateTaskIds.push(resolvedTaskId);
      }

      let sub = null;

      // Kueri 1: Berdasarkan siswa_id (jika valid)
      if (Number.isInteger(numStudentId) && numStudentId > 0) {
        const { data: bySiswaId, error: errSiswa } = await supabase
          .from('tugas_pengumpulan')
          .select('*')
          .in('tugas_id', candidateTaskIds)
          .eq('siswa_id', numStudentId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!errSiswa && bySiswaId) {
          sub = bySiswaId;
        }
      }

      // Kueri 2: Fallback berdasarkan nisn_siswa
      if (!sub && studentNisn) {
        const { data: byNisn, error: errNisn } = await supabase
          .from('tugas_pengumpulan')
          .select('*')
          .in('tugas_id', candidateTaskIds)
          .eq('nisn_siswa', String(studentNisn))
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!errNisn && byNisn) {
          sub = byNisn;
        }
      }

      if (sub) {
        setExistingSubmission(sub);

        let detail = sub.detail_jawaban;
        if (typeof detail === 'string') {
          try {
            detail = JSON.parse(detail);
          } catch (e) {
            console.warn('Gagal parse detail_jawaban Word:', e);
            detail = {};
          }
        }
        detail = detail || {};

        // Pulihkan Progres Tahap 1 (Literasi 7 Langkah)
        if (Array.isArray(detail.completedTopicIds) && detail.completedTopicIds.length > 0) {
          setCompletedTopicIds(detail.completedTopicIds);
          const restoredSecs = {};
          detail.completedTopicIds.forEach((id) => {
            restoredSecs[id] = TUGAS_5_CONFIG.readingThresholdSeconds || 45;
          });
          setReadingSeconds((prev) => ({ ...prev, ...restoredSecs }));
        }
        if (detail.checkpointAnswers) {
          setCheckpointAnswers(detail.checkpointAnswers);
        }

        // Pulihkan Progres Tahap 2 (Kuis)
        if (detail.quizAnswers && Object.keys(detail.quizAnswers).length > 0) {
          setQuizAnswers(detail.quizAnswers);
          setQuizSubmitted(Boolean(detail.quizSubmitted || Object.keys(detail.quizAnswers).length >= KUIS_MS_WORD_QUESTIONS.length));
        }

        // Pulihkan Progres Tahap 3 (Upload File Cloudinary)
        if (sub.file_url || detail.uploadedFileInfo?.secureUrl) {
          setUploadedFileInfo({
            secureUrl: sub.file_url || detail.uploadedFileInfo?.secureUrl,
            fileName: detail.uploadedFileInfo?.fileName || 'Tugas5_Pengalaman_Belajar.docx',
            fileSize: detail.uploadedFileInfo?.fileSize || 0,
            format: detail.uploadedFileInfo?.format || 'docx',
          });
        }
        if (detail.studentNotes) {
          setStudentNotes(detail.studentNotes);
        }

        // Pulihkan Tahap Terakhir Aktif
        if (detail.lastActiveStage) {
          setActiveStage(detail.lastActiveStage);
        } else if (sub.file_url || detail.uploadedFileInfo?.secureUrl) {
          setActiveStage(3);
        } else if (detail.quizSubmitted) {
          setActiveStage(3);
        } else if (Array.isArray(detail.completedTopicIds) && detail.completedTopicIds.length >= MATERI_TOPIK_WORD.length) {
          setActiveStage(2);
        }

        setSubmitted(sub.status === 'submitted' || sub.status === 'dinilai');
        return sub;
      }
    } catch (e) {
      console.warn('Error pemulihan state Tugas 5 Word:', e);
    }
    return null;
  }, []);

  // Initialize Session: Pantau login siswa secara realtime
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const stored = getStoredUser();
        if (stored) {
          if (isMounted) setUser(stored);
          await checkExistingSubmission(stored);
        }
      } catch (e) {
        console.error('Inisialisasi auth Tugas 5 Word:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    const handleUserUpdated = (e) => {
      if (e.detail) {
        setUser(e.detail);
        checkExistingSubmission(e.detail);
      }
    };

    window.addEventListener('user-updated', handleUserUpdated);
    window.addEventListener('storage', init);

    return () => {
      isMounted = false;
      window.removeEventListener('user-updated', handleUserUpdated);
      window.removeEventListener('storage', init);
    };
  }, [checkExistingSubmission, getStoredUser]);

  // ─── 3. TIMER MEMBACA AKTIF PER TOPIK (~45 Detik Threshold) ───
  const currentUncompletedTopic = MATERI_TOPIK_WORD.find((t) => !completedTopicIds.includes(t.id));
  const activeWorkingTopicId = currentUncompletedTopic ? currentUncompletedTopic.id : MATERI_TOPIK_WORD[MATERI_TOPIK_WORD.length - 1].id;

  useEffect(() => {
    if (activeStage !== 1) return;
    if (!currentUncompletedTopic) return;

    const topicId = currentUncompletedTopic.id;
    const interval = setInterval(() => {
      setReadingSeconds((prev) => {
        const current = prev[topicId] || 0;
        if (current >= TUGAS_5_CONFIG.readingThresholdSeconds) {
          return prev;
        }
        return {
          ...prev,
          [topicId]: current + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStage, currentUncompletedTopic]);

  const currentTopicSeconds = readingSeconds[activeWorkingTopicId] || 0;
  const isCurrentTopicCompleted = completedTopicIds.includes(activeWorkingTopicId);
  const isReadingThresholdReached = isCurrentTopicCompleted || currentTopicSeconds >= TUGAS_5_CONFIG.readingThresholdSeconds;

  // ─── HITUNG TOTAL SKOR ───
  const scoreTahap1 = completedTopicIds.length * 2; // maks 14 pt (7 langkah)

  const calculateQuizScore = useCallback(() => {
    let score = 0;
    KUIS_MS_WORD_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.jawabanBenar) {
        score += q.poin;
      }
    });
    return score;
  }, [quizAnswers]);

  const scoreTahap2 = calculateQuizScore(); // maks 26 pt (5 soal)
  const scoreTahap3 = uploadedFileInfo?.secureUrl ? TUGAS_5_CONFIG.poin_tahap3_proyek : 0; // 60 pt
  const calculatedTotalScore = scoreTahap1 + scoreTahap2 + scoreTahap3; // 100 pt

  const isFullyComplete = completedTopicIds.length >= MATERI_TOPIK_WORD.length &&
    quizSubmitted &&
    Boolean(uploadedFileInfo?.secureUrl);

  // ─── 4. FUNGSI INTI SIMPAN PROGRES KE DATABASE SUPABASE ───
  const saveProgressToDb = useCallback(async ({
    customCompletedTopicIds = null,
    customCheckpointAnswers = null,
    customQuizAnswers = null,
    customQuizSubmitted = null,
    customUploadedFile = null,
    customNotes = null,
    isManualClick = false,
  } = {}) => {
    // Pastikan user aktif tersedia
    let currentUser = user || getStoredUser();
    if (!currentUser) {
      if (isManualClick) {
        showToast('⚠️ Silakan login siswa terlebih dahulu agar progres pengerjaan tersimpan di database.', 'warning');
        window.dispatchEvent(new CustomEvent('open-login-modal'));
      }
      return false;
    }

    setSubmitting(true);
    try {
      const resolvedTaskId = dbTaskIdRef.current || TUGAS_5_CONFIG.id;
      const studentIdNum = Number(currentUser.id || currentUser.ID);
      const studentNisn = currentUser.NISN || currentUser.nisn ? String(currentUser.NISN || currentUser.nisn) : null;
      const studentName = currentUser.NAMA || currentUser.nama || 'Siswa Spendaraja';
      const studentClass = currentUser.Kelas || currentUser.kelas || '7';

      // Gabungkan data terbaru
      const topicsList = customCompletedTopicIds || completedTopicIds;
      const chkAnswers = customCheckpointAnswers || checkpointAnswers;
      const qzAnswers = customQuizAnswers || quizAnswers;
      const qzSubmitted = customQuizSubmitted !== null ? customQuizSubmitted : quizSubmitted;
      const upFile = customUploadedFile !== null ? customUploadedFile : uploadedFileInfo;
      const notes = customNotes !== null ? customNotes : studentNotes;

      // Hitung skor terkini
      const curScoreTahap1 = topicsList.length * 2;
      let curScoreTahap2 = 0;
      KUIS_MS_WORD_QUESTIONS.forEach((q) => {
        if (qzAnswers[q.id] === q.jawabanBenar) {
          curScoreTahap2 += q.poin;
        }
      });
      const curScoreTahap3 = upFile?.secureUrl ? TUGAS_5_CONFIG.poin_tahap3_proyek : 0;
      const curTotal = curScoreTahap1 + curScoreTahap2 + curScoreTahap3;

      // Proteksi Nilai Database (Math.max)
      const existingScoreInDb = existingSubmission?.nilai_akhir ? Number(existingSubmission.nilai_akhir) : 0;
      const finalScoreToSave = Math.max(existingScoreInDb, curTotal);

      if (existingScoreInDb > curTotal) {
        setScoreProtectionNotice({
          savedScore: existingScoreInDb,
          currentScore: curTotal,
        });
      } else {
        setScoreProtectionNotice(null);
      }

      const completeStatus = topicsList.length >= MATERI_TOPIK_WORD.length &&
        qzSubmitted &&
        Boolean(upFile?.secureUrl);

      const detailJawaban = {
        taskName: 'Tugas 5: Aplikasi Pengolah Kata (Ms. Word) - Pengalaman Belajar di SMPN 2 Singaraja',
        completedTopicIds: topicsList,
        checkpointAnswers: chkAnswers,
        readingSeconds,
        quizAnswers: qzAnswers,
        quizSubmitted: qzSubmitted,
        quizScore: curScoreTahap2,
        uploadedFileInfo: upFile || null,
        studentNotes: (notes || '').trim(),
        scoreTahap1: curScoreTahap1,
        scoreTahap2: curScoreTahap2,
        scoreTahap3: curScoreTahap3,
        totalScore: finalScoreToSave,
        lastActiveStage: activeStage,
        updatedAt: new Date().toISOString(),
      };

      const payload = {
        tugas_id: isUUID(resolvedTaskId) ? resolvedTaskId : TUGAS_5_CONFIG.id,
        nisn_siswa: studentNisn,
        nama_siswa: studentName,
        kelas_siswa: studentClass,
        file_url: upFile?.secureUrl || existingSubmission?.file_url || null,
        nilai_akhir: finalScoreToSave,
        skor: finalScoreToSave,
        status: completeStatus ? 'submitted' : (existingSubmission?.status === 'submitted' ? 'submitted' : 'sedang'),
        submitted_at: new Date().toISOString(),
        detail_jawaban: detailJawaban,
      };

      if (Number.isInteger(studentIdNum) && studentIdNum > 0) {
        payload.siswa_id = studentIdNum;
      }

      let saveErr = null;
      let savedRecord = null;

      if (existingSubmission?.id) {
        const { data: updatedSub, error } = await supabase
          .from('tugas_pengumpulan')
          .update(payload)
          .eq('id', existingSubmission.id)
          .select()
          .maybeSingle();
        saveErr = error;
        savedRecord = updatedSub || { ...existingSubmission, ...payload };
      } else {
        const { data: newSub, error } = await supabase
          .from('tugas_pengumpulan')
          .insert([payload])
          .select()
          .maybeSingle();
        saveErr = error;
        savedRecord = newSub;
      }

      if (saveErr) {
        console.error('Gagal simpan tugas_pengumpulan Tugas 5:', saveErr);
        if (isManualClick) {
          showToast('⚠️ Gagal menyimpan ke database: ' + (saveErr.message || 'Periksa koneksi internet'), 'error');
        }
        return false;
      }

      if (savedRecord) {
        setExistingSubmission(savedRecord);
      }

      // Sinkronisasi total_points ke master_siswa via utilitas trigger
      if (studentIdNum && finalScoreToSave > 0) {
        try {
          await syncStudentPointsAfterTask(studentIdNum);
        } catch (pe) {
          console.warn('Sinkronisasi total_points Tugas 5:', pe);
        }
      }

      if (completeStatus) {
        setSubmitted(true);
        setShowSuccessModal(true);
        triggerGrandConfetti();
        showToast(`🎉 Selamat! Seluruh tahapan Tugas 5 tuntas dengan nilai resmi ${finalScoreToSave} Poin!`, 'success');
      } else {
        if (isManualClick) {
          showToast(`💾 Progres pengerjaan berhasil disimpan di database! (${finalScoreToSave} Poin tersimpan). Kamu dapat keluar dan melanjutkannya kapan saja.`, 'success');
          triggerSmallConfetti();
        }
      }
      return true;
    } catch (e) {
      console.error('Submit error Tugas 5 Word:', e);
      if (isManualClick) {
        showToast('⚠️ Terjadi kendala saat menyimpan: ' + e.message, 'error');
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [
    user,
    getStoredUser,
    completedTopicIds,
    checkpointAnswers,
    readingSeconds,
    quizAnswers,
    quizSubmitted,
    uploadedFileInfo,
    studentNotes,
    activeStage,
    existingSubmission,
    showToast
  ]);

  // ─── 5. JAWAB SOAL CHECKPOINT PEMAHAMAN MATERI ───
  const handleAnswerCheckpoint = (topicId, selectedOptionId) => {
    setCheckpointAnswers((prev) => ({
      ...prev,
      [topicId]: selectedOptionId,
    }));
    setCheckpointFeedback(null);
  };

  const handleVerifyCheckpoint = async (topicId) => {
    const topic = MATERI_TOPIK_WORD.find((t) => t.id === topicId);
    if (!topic) return;

    const selected = checkpointAnswers[topicId];
    if (!selected) {
      setCheckpointFeedback({
        topicId,
        isCorrect: false,
        message: 'Pilih salah satu jawaban terlebih dahulu sebelum melanjutkan.',
      });
      return;
    }

    if (selected === topic.checkpointQuestion.jawabanBenar) {
      // Benar! Tandai topik sebagai selesai
      const updatedTopics = completedTopicIds.includes(topicId)
        ? completedTopicIds
        : [...completedTopicIds, topicId];

      setCompletedTopicIds(updatedTopics);
      setCheckpointFeedback({
        topicId,
        isCorrect: true,
        message: 'Jawaban Benar! Pemahaman fitur pengolah kata sangat baik (+2 Poin).',
      });
      triggerSmallConfetti();

      // Auto-save progres checkpoint ke database di latar belakang
      saveProgressToDb({
        customCompletedTopicIds: updatedTopics,
        customCheckpointAnswers: { ...checkpointAnswers, [topicId]: selected },
        isManualClick: false,
      });
    } else {
      setCheckpointFeedback({
        topicId,
        isCorrect: false,
        message: 'Jawaban belum tepat. Silakan baca materi atau coba simulasi interaktif di atas kembali.',
      });
    }
  };

  // Navigasi ke Topik Berikutnya
  const handleNextTopic = (currentTopicId) => {
    setCheckpointFeedback(null);
    const nextTopicId = (currentTopicId || activeWorkingTopicId) + 1;
    if (nextTopicId <= MATERI_TOPIK_WORD.length) {
      setActiveTopicId(nextTopicId);
      setTimeout(() => {
        const nextElem = document.getElementById(`topik-card-${nextTopicId}`);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Seluruh 7 langkah tuntas! Arahkan ke Tahap 2 (Kuis)
      setActiveStage(2);
      triggerSmallConfetti();
      showToast('🎉 Panduan 7 langkah tuntas! Lanjutkan ke Tahap 2 (Kuis Fitur Word).', 'success');
    }
  };

  // ─── 6. KUIS FITUR MS WORD (TAHAP 2) ───
  const handleAnswerQuiz = (questionId, optionId) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(quizAnswers).length;
    if (answeredCount < KUIS_MS_WORD_QUESTIONS.length) {
      showToast(`⚠️ Kamu baru menjawab ${answeredCount} dari ${KUIS_MS_WORD_QUESTIONS.length} soal kuis. Silakan lengkapi seluruh soal.`, 'warning');
      return;
    }

    setQuizSubmitted(true);
    triggerSmallConfetti();

    // Auto-save hasil kuis ke database
    await saveProgressToDb({
      customQuizAnswers: quizAnswers,
      customQuizSubmitted: true,
      isManualClick: false,
    });

    showToast('✅ Kuis berhasil dikunci & progres tersimpan di database! Lanjutkan ke Tahap 3 (Praktik Proyek).', 'success');
    setActiveStage(3);
  };

  // ─── 7. PENGUNGGAHAN BERKAS KE CLOUDINARY (TAHAP 3) ───
  const handleUploadFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const studentInfo = user || getStoredUser() || { NAMA: 'Siswa', Kelas: '7' };
      const res = await uploadTugas5ToCloudinary(file, studentInfo, (percent) => {
        setUploadProgress(percent);
      });

      setUploadedFileInfo(res);
      setUploadProgress(100);
      triggerSmallConfetti();

      // Auto-save berkas ke database
      await saveProgressToDb({
        customUploadedFile: res,
        isManualClick: false,
      });

      showToast('✅ Berkas dokumen Word berhasil diunggah & tercatat di database! Klik "Kirim Semua Tugas" untuk finalisasi.', 'success');
    } catch (err) {
      console.error('Gagal upload dokumen ke Cloudinary:', err);
      setUploadError(err.message || 'Gagal mengunggah berkas ke Cloudinary. Periksa format berkas dan koneksi internet.');
      showToast('⚠️ Gagal mengunggah berkas: ' + (err.message || 'Coba ulangi'), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFileInfo(null);
    setUploadProgress(0);
    setUploadError(null);
    showToast('Berkas berhasil dihapus dari draf.', 'info');
  };

  // ─── 8. SUBMIT / SIMPAN MANUAL SELURUH TUGAS DARI HEADER / TOMBOL ───
  const handleSubmitAll = async () => {
    await saveProgressToDb({ isManualClick: true });
  };

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  return {
    user,
    loading,
    dbTaskId,
    activeStage,
    setActiveStage,
    // Tahap 1 Literasi
    activeTopicId,
    setActiveTopicId,
    completedTopicIds,
    readingSeconds,
    currentTopicSeconds,
    isReadingThresholdReached,
    checkpointAnswers,
    checkpointFeedback,
    handleAnswerCheckpoint,
    handleVerifyCheckpoint,
    handleNextTopic,
    scoreTahap1,
    // Tahap 2 Kuis
    quizAnswers,
    quizSubmitted,
    handleAnswerQuiz,
    handleSubmitQuiz,
    scoreTahap2,
    // Tahap 3 Proyek & Cloudinary
    uploadedFileInfo,
    uploadProgress,
    isUploading,
    uploadError,
    studentNotes,
    setStudentNotes,
    handleUploadFile,
    handleRemoveUploadedFile,
    scoreTahap3,
    // Keseluruhan & Sinkronisasi
    calculatedTotalScore,
    existingSubmission,
    submitting,
    submitted,
    isFullyComplete,
    showSuccessModal,
    setShowSuccessModal,
    scoreProtectionNotice,
    toastMessage,
    clearToast,
    handleSubmitAll,
    saveProgressToDb,
    handleOpenLogin,
  };
}

// Visual Confetti Helpers
function triggerSmallConfetti() {
  try {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.75 },
    });
  } catch (e) {
    // ignore
  }
}

function triggerGrandConfetti() {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#2563eb', '#38bdf8', '#fbbf24', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // ignore
  }
}

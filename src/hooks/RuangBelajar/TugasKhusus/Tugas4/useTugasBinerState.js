import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask } from '../../../../utils/pointLogger';
import { triggerConfetti, triggerGrandConfetti } from '../../../../utils/confettiHelper';
import {
  generate15UniqueQuestions,
  calculatePointsForAttempt
} from '../../../../components/RuangBelajar/TugasKhusus/Tugas4/binerAsciiData';
import { uploadTugas4ToCloudinary } from '../../../../utils/cloudinaryUpload';

const isUUID = (str) => {
  if (typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
};

const CANONICAL_BINER_TASK_ID = '93e18a4d-71b5-4b0d-9b16-e5c26b9a2c91'; // ID tugas di tugas_master

export function useTugasBinerState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(1); // 1: Materi, 2: Desimal->Biner, 3: Biner->Desimal, 4: ASCII->Biner, 5: Foto Orek-Orek

  // State materi
  const [stage1Completed, setStage1Completed] = useState(false);

  // State 15 Soal Unik
  const [stage2Questions, setStage2Questions] = useState([]);
  const [stage3Questions, setStage3Questions] = useState([]);
  const [stage4Questions, setStage4Questions] = useState([]);

  // State Foto Orek-Orek Buku Tulis (Tahap 5)
  const [uploadedPhotoInfo, setUploadedPhotoInfo] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dbTaskId, setDbTaskId] = useState(CANONICAL_BINER_TASK_ID);
  const dbTaskIdRef = useRef(CANONICAL_BINER_TASK_ID);

  // Toast Notification State
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

  // Hitung Skor Parsial & Total
  const scores = useMemo(() => {
    const s2 = stage2Questions.reduce((sum, q) => sum + (q.earnedPoints || 0), 0);
    const s3 = stage3Questions.reduce((sum, q) => sum + (q.earnedPoints || 0), 0);
    const s4 = stage4Questions.reduce((sum, q) => sum + (q.earnedPoints || 0), 0);
    return {
      stage2: Math.min(15, s2),
      stage3: Math.min(15, s3),
      stage4: Math.min(20, s4)
    };
  }, [stage2Questions, stage3Questions, stage4Questions]);

  const totalScore = useMemo(() => {
    return Math.min(50, scores.stage2 + scores.stage3 + scores.stage4);
  }, [scores]);

  const isAllQuestionsAnswered = useMemo(() => {
    const s2Done = stage2Questions.length === 5 && stage2Questions.every((q) => q.isCorrect);
    const s3Done = stage3Questions.length === 5 && stage3Questions.every((q) => q.isCorrect);
    const s4Done = stage4Questions.length === 5 && stage4Questions.every((q) => q.isCorrect);
    return s2Done && s3Done && s4Done;
  }, [stage2Questions, stage3Questions, stage4Questions]);

  // Update DB Task ID
  const updateDbTaskId = useCallback((newId) => {
    if (newId && dbTaskIdRef.current !== newId) {
      dbTaskIdRef.current = newId;
      setDbTaskId(newId);
    }
  }, []);

  // 1. Cari ID Tugas 4 dari Database tugas_master
  useEffect(() => {
    let isMounted = true;
    const findTask = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, custom_route')
          .or('id.eq.93e18a4d-71b5-4b0d-9b16-e5c26b9a2c91,kode_tugas.eq.TUGAS-04-BINER-ASCII,custom_route.ilike.%biner-ascii%,judul.ilike.%Bilangan Biner%')
          .limit(1)
          .maybeSingle();

        if (isMounted && data?.id && isUUID(data.id)) {
          updateDbTaskId(data.id);
        }
      } catch (err) {
        console.warn('Kueri tugas_master Biner:', err);
      }
    };
    findTask();
    return () => {
      isMounted = false;
    };
  }, [updateDbTaskId]);

  // Helper ambil user siswa terkini
  const getStoredUser = useCallback(() => {
    try {
      const raw = localStorage.getItem('user_siswa');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error parse user_siswa:', e);
    }
    return null;
  }, []);

  // 2. Cek submission tersimpan dari tugas_pengumpulan (strictly matching schema)
  const checkExistingSubmission = useCallback(async (student, taskId) => {
    if (!student) return null;
    const numStudentId = Number(student.id || student.ID);
    if (!Number.isInteger(numStudentId) || numStudentId <= 0) return null;
    const resolvedTaskId = isUUID(taskId) ? taskId : dbTaskIdRef.current;

    try {
      const { data, error } = await supabase
        .from('tugas_pengumpulan')
        .select('*')
        .eq('tugas_id', resolvedTaskId)
        .eq('siswa_id', numStudentId)
        .maybeSingle();

      if (error) {
        console.warn('Gagal cek submission biner:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Gagal cek submission biner:', e);
      return null;
    }
  }, []);

  // 3. Simpan Progres atau Pengumpulan Resmi ke tugas_pengumpulan
  const saveProgressToDb = useCallback(async ({
    isSubmit = false,
    isManual = false,
    overrideStage1,
    overrideStage2,
    overrideStage3,
    overrideStage4,
    overrideActiveStage,
    photoOverride
  } = {}) => {
    if (isSubmit) {
      setSubmitting(true);
    } else if (isManual) {
      setSavingDraft(true);
    }

    try {
      const currentUser = user || getStoredUser();
      const studentIdNum = Number(currentUser?.id || currentUser?.ID);

      if (!Number.isInteger(studentIdNum) || studentIdNum <= 0) {
        if (isManual) {
          showToast('⚠️ Silakan login siswa terlebih dahulu agar progres pengerjaan tersimpan di cloud.', 'warning');
        }
        return false;
      }

      const resolvedTaskId = isUUID(dbTaskIdRef.current) ? dbTaskIdRef.current : CANONICAL_BINER_TASK_ID;

      // Evaluasi data terkini (gunakan override jika dipassing saat event handler dijalankan)
      const curStage1 = overrideStage1 !== undefined ? overrideStage1 : stage1Completed;
      const curStage2 = overrideStage2 || stage2Questions;
      const curStage3 = overrideStage3 || stage3Questions;
      const curStage4 = overrideStage4 || stage4Questions;
      const curActiveStage = overrideActiveStage || activeStage;

      // Evaluasi foto orak-orek buku tulis (Tahap 5)
      const curPhoto = photoOverride !== undefined ? photoOverride : uploadedPhotoInfo;
      const curTautan = curPhoto?.secureUrl || existingSubmission?.tautan_tugas || null;
      const curNamaBerkas = curPhoto?.originalFileName || existingSubmission?.nama_berkas || null;

      // Hitung skor percobaan saat ini
      const s2Score = Math.min(15, curStage2.reduce((sum, q) => sum + (q.earnedPoints || 0), 0));
      const s3Score = Math.min(15, curStage3.reduce((sum, q) => sum + (q.earnedPoints || 0), 0));
      const s4Score = Math.min(20, curStage4.reduce((sum, q) => sum + (q.earnedPoints || 0), 0));
      const currentAttemptScore = Math.min(50, s2Score + s3Score + s4Score);

      // Cek skor terbaik di database sebelumnya
      const previousBestScore = Number(existingSubmission?.skor ?? 0);

      // Proteksi Skor Tertinggi (Math.max)
      const finalScoreToSave = Math.min(50, Math.max(previousBestScore, currentAttemptScore));
      const persentaseSkor = Number(((finalScoreToSave / 50) * 100).toFixed(2));

      // Cek apakah semua 15 soal telah tuntas dijawab
      const allDone =
        curStage2.length === 5 && curStage2.every((q) => q.isCorrect) &&
        curStage3.length === 5 && curStage3.every((q) => q.isCorrect) &&
        curStage4.length === 5 && curStage4.every((q) => q.isCorrect);

      // Tentukan status tugas: 'submitted' jika dikumpulkan/semua tuntas/sebelumnya sudah submitted, atau 'sedang' untuk draft progres
      const isCompleteSubmission = isSubmit || allDone;
      const finalStatus = isCompleteSubmission
        ? 'submitted'
        : (existingSubmission?.status === 'submitted' ? 'submitted' : 'sedang');

      // Objek JSON lengkap untuk kolom detail_jawaban
      const detailLog = {
        taskName: 'Tugas 4: Petualangan Bilangan Biner & Kode ASCII',
        activeStage: curActiveStage,
        stage1Completed: curStage1,
        stage2Questions: curStage2,
        stage3Questions: curStage3,
        stage4Questions: curStage4,
        uploadedPhotoInfo: curPhoto || null,
        scores: {
          stage2: s2Score,
          stage3: s3Score,
          stage4: s4Score
        },
        totalScore: finalScoreToSave,
        currentAttemptScore,
        previousBestScore,
        allAnswered: allDone,
        updatedAt: new Date().toISOString(),
        submittedAt: isCompleteSubmission
          ? (existingSubmission?.submitted_at || new Date().toISOString())
          : null
      };

      // Payload MURNI sesuai skema tabel public.tugas_pengumpulan (tanpa kolom non-skema)
      const payload = {
        tugas_id: resolvedTaskId,
        siswa_id: studentIdNum,
        status: finalStatus,
        skor: finalScoreToSave,
        persentase_skor: persentaseSkor,
        tautan_tugas: curTautan,
        catatan_siswa: existingSubmission?.catatan_siswa || null,
        nama_berkas: curNamaBerkas,
        detail_jawaban: detailLog,
        catatan_guru: isCompleteSubmission
          ? `Tugas 4: Petualangan Bilangan Biner & Kode ASCII selesai dikumpulkan (${finalScoreToSave}/50 Poin).`
          : `Progres pengerjaan tersimpan (${finalScoreToSave}/50 Poin).`,
        submitted_at: isCompleteSubmission
          ? (existingSubmission?.submitted_at || new Date().toISOString())
          : null,
        updated_at: new Date().toISOString()
      };

      // Upsert dengan constraint unique_siswa_per_tugas (tugas_id, siswa_id)
      const { data: savedRecord, error: upsertErr } = await supabase
        .from('tugas_pengumpulan')
        .upsert(payload, { onConflict: 'tugas_id,siswa_id' })
        .select()
        .maybeSingle();

      if (upsertErr) {
        console.error('Gagal simpan ke tugas_pengumpulan Tugas 4:', upsertErr);
        if (isManual) {
          showToast('⚠️ Gagal menyimpan ke cloud: ' + (upsertErr.message || 'Periksa koneksi internet'), 'error');
        }
        return false;
      }

      if (savedRecord) {
        setExistingSubmission(savedRecord);
      }

      // Jika pengumpulan tuntas atau skor bertambah, sinkronkan total_points siswa di master_siswa
      if (finalScoreToSave > 0) {
        try {
          await syncStudentPointsAfterTask(studentIdNum);
        } catch (pe) {
          console.warn('Sinkronisasi total_points Tugas 4:', pe);
        }
      }

      if (isCompleteSubmission && isSubmit) {
        setSubmitted(true);
        setShowSuccessModal(true);
        triggerGrandConfetti();
        showToast(`🎉 Selamat! Tugas 4 berhasil dikumpulkan resmi dengan nilai ${finalScoreToSave}/50 Poin!`, 'success');
      } else if (isManual) {
        showToast(`💾 Progres pengerjaan tersimpan di cloud (${finalScoreToSave}/50 Poin). Kamu dapat melanjutkan kapan saja!`, 'success');
        triggerConfetti();
      }

      return true;
    } catch (e) {
      console.error('Submit error Tugas 4 Biner:', e);
      if (isManual) {
        showToast('⚠️ Terjadi kendala saat menyimpan: ' + (e.message || 'Coba lagi'), 'error');
      }
      return false;
    } finally {
      if (isSubmit) setSubmitting(false);
      if (isManual) setSavingDraft(false);
    }
  }, [
    user,
    getStoredUser,
    stage1Completed,
    stage2Questions,
    stage3Questions,
    stage4Questions,
    activeStage,
    uploadedPhotoInfo,
    existingSubmission,
    showToast
  ]);

  // 4. Load Session dan Pulihkan Progres dari Database Supabase (Database-Only Continuation)
  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = getStoredUser();
      setUser(currentUser);

      const resolvedTaskId = isUUID(dbTaskIdRef.current) ? dbTaskIdRef.current : CANONICAL_BINER_TASK_ID;
      const existingSub = await checkExistingSubmission(currentUser, resolvedTaskId);

      if (existingSub) {
        setExistingSubmission(existingSub);
        if (existingSub.status === 'submitted' || Number(existingSub.skor) >= 50) {
          setSubmitted(true);
        }

        // Pulihkan info foto orak-orek jika ada di kolom tautan_tugas
        if (existingSub.tautan_tugas) {
          setUploadedPhotoInfo({
            secureUrl: existingSub.tautan_tugas,
            originalFileName: existingSub.nama_berkas || 'orak_orek_buku_tulis.jpg',
            uploadedAt: existingSub.updated_at || existingSub.submitted_at
          });
        }

        let parsedDetail = null;
        if (existingSub.detail_jawaban) {
          if (typeof existingSub.detail_jawaban === 'string') {
            try {
              parsedDetail = JSON.parse(existingSub.detail_jawaban);
            } catch (e) {
              console.warn('Parse detail_jawaban Biner error:', e);
            }
          } else if (typeof existingSub.detail_jawaban === 'object') {
            parsedDetail = existingSub.detail_jawaban;
          }
        }

        if (parsedDetail) {
          if (parsedDetail.uploadedPhotoInfo) {
            setUploadedPhotoInfo(parsedDetail.uploadedPhotoInfo);
          }
          if (parsedDetail.stage1Completed) {
            setStage1Completed(true);
          }
          if (Array.isArray(parsedDetail.stage2Questions) && parsedDetail.stage2Questions.length === 5) {
            setStage2Questions(parsedDetail.stage2Questions);
          }
          if (Array.isArray(parsedDetail.stage3Questions) && parsedDetail.stage3Questions.length === 5) {
            setStage3Questions(parsedDetail.stage3Questions);
          }
          if (Array.isArray(parsedDetail.stage4Questions) && parsedDetail.stage4Questions.length === 5) {
            setStage4Questions(parsedDetail.stage4Questions);
          }
          if (parsedDetail.activeStage && [1, 2, 3, 4, 5].includes(parsedDetail.activeStage)) {
            setActiveStage(parsedDetail.activeStage);
          } else if (parsedDetail.stage1Completed) {
            setActiveStage(2);
          }

          setLoading(false);
          return;
        }
      }

      // Jika belum ada di database: Generate 15 soal unik baru
      const freshQuestions = generate15UniqueQuestions();
      setStage2Questions(freshQuestions.stage2);
      setStage3Questions(freshQuestions.stage3);
      setStage4Questions(freshQuestions.stage4);
      setStage1Completed(false);

      // Jika siswa sudah login, inisialisasi draft awal di database agar 15 soal terkunci konsisten
      const studentIdNum = Number(currentUser?.id || currentUser?.ID);
      if (Number.isInteger(studentIdNum) && studentIdNum > 0 && !existingSub) {
        try {
          const initialDetail = {
            taskName: 'Tugas 4: Petualangan Bilangan Biner & Kode ASCII',
            activeStage: 1,
            stage1Completed: false,
            stage2Questions: freshQuestions.stage2,
            stage3Questions: freshQuestions.stage3,
            stage4Questions: freshQuestions.stage4,
            scores: { stage2: 0, stage3: 0, stage4: 0 },
            totalScore: 0,
            allAnswered: false,
            updatedAt: new Date().toISOString()
          };

          const initialPayload = {
            tugas_id: resolvedTaskId,
            siswa_id: studentIdNum,
            status: 'sedang',
            skor: 0,
            persentase_skor: 0,
            tautan_tugas: null,
            catatan_siswa: null,
            nama_berkas: null,
            detail_jawaban: initialDetail,
            catatan_guru: 'Mulai mengerjakan Tugas 4: Bilangan Biner & Kode ASCII',
            submitted_at: null,
            updated_at: new Date().toISOString()
          };

          const { data: initRecord } = await supabase
            .from('tugas_pengumpulan')
            .upsert(initialPayload, { onConflict: 'tugas_id,siswa_id' })
            .select()
            .maybeSingle();

          if (initRecord) {
            setExistingSubmission(initRecord);
          }
        } catch (initErr) {
          console.warn('Inisialisasi draft Tugas 4:', initErr);
        }
      }
    } catch (err) {
      console.error('Error loadSession Biner:', err);
      const fresh = generate15UniqueQuestions();
      setStage2Questions(fresh.stage2);
      setStage3Questions(fresh.stage3);
      setStage4Questions(fresh.stage4);
    } finally {
      setLoading(false);
    }
  }, [checkExistingSubmission, getStoredUser]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Handler Selesai Tahap 1 (Materi) -> Auto-save draft ke DB
  const handleCompleteStage1 = () => {
    setStage1Completed(true);
    setActiveStage(2);
    triggerConfetti();
    showToast('📖 Materi Tahap 1 tuntas! Progres tersimpan, selamat mengerjakan tantangan Tahap 2.', 'info');
    saveProgressToDb({ overrideStage1: true, overrideActiveStage: 2 });
  };

  // Handler Jawab Soal Tahap 2 (Desimal ke Biner) -> Auto-save draft ke DB
  const handleAnswerStage2 = (questionIndex, inputAnswer) => {
    const cleanAnswer = inputAnswer.trim().replace(/^0+/, ''); // Abaikan leading zeros
    const next = [...stage2Questions];
    const q = { ...next[questionIndex] };
    const targetClean = q.targetBiner.replace(/^0+/, '');
    const isCorrect = cleanAnswer === targetClean || inputAnswer.trim() === q.targetBiner;
    const attemptNum = (q.attempts || 0) + 1;

    q.userAnswer = inputAnswer.trim();
    q.attempts = attemptNum;

    if (isCorrect) {
      q.isCorrect = true;
      q.earnedPoints = calculatePointsForAttempt(3, attemptNum);
      q.feedback = `Hebat! Konversi ${q.desimal} adalah ${q.targetBiner}. (+${q.earnedPoints} Poin)`;
      triggerConfetti();
    } else {
      q.isCorrect = false;
      q.feedback = `Kurang tepat. Coba periksa kembali penjumlahan bobotnya (Coba ke-${attemptNum}).`;
    }

    next[questionIndex] = q;
    setStage2Questions(next);
    saveProgressToDb({ overrideStage2: next });
  };

  // Handler Jawab Soal Tahap 3 (Biner ke Desimal) -> Auto-save draft ke DB
  const handleAnswerStage3 = (questionIndex, inputAnswer) => {
    const numAnswer = parseInt(inputAnswer.trim(), 10);
    const next = [...stage3Questions];
    const q = { ...next[questionIndex] };
    const isCorrect = !isNaN(numAnswer) && numAnswer === q.desimal;
    const attemptNum = (q.attempts || 0) + 1;

    q.userAnswer = inputAnswer.trim();
    q.attempts = attemptNum;

    if (isCorrect) {
      q.isCorrect = true;
      q.earnedPoints = calculatePointsForAttempt(3, attemptNum);
      q.feedback = `Benar sekali! Nilai biner ${q.givenBiner} adalah ${q.desimal}. (+${q.earnedPoints} Poin)`;
      triggerConfetti();
    } else {
      q.isCorrect = false;
      q.feedback = `Kurang tepat. Hitung bobot bit yang bernilai 1 (Coba ke-${attemptNum}).`;
    }

    next[questionIndex] = q;
    setStage3Questions(next);
    saveProgressToDb({ overrideStage3: next });
  };

  // Handler Jawab Soal Tahap 4 (Karakter ASCII ke Biner) -> Auto-save draft ke DB
  const handleAnswerStage4 = (questionIndex, inputAnswer) => {
    const cleanAnswer = inputAnswer.trim().replace(/^0+/, '');
    const next = [...stage4Questions];
    const q = { ...next[questionIndex] };
    const targetClean = q.targetBiner.replace(/^0+/, '');
    const isCorrect = cleanAnswer === targetClean || inputAnswer.trim() === q.targetBiner;
    const attemptNum = (q.attempts || 0) + 1;

    q.userAnswer = inputAnswer.trim();
    q.attempts = attemptNum;

    if (isCorrect) {
      q.isCorrect = true;
      q.earnedPoints = calculatePointsForAttempt(4, attemptNum);
      q.feedback = `Luar biasa! Karakter '${q.char}' binernya adalah ${q.targetBiner}. (+${q.earnedPoints} Poin)`;
      triggerConfetti();
    } else {
      q.isCorrect = false;
      q.feedback = `Kurang tepat. Cek kembali nilai desimal karakter '${q.char}' pada tabel ASCII di Tahap 1 (Coba ke-${attemptNum}).`;
    }

    next[questionIndex] = q;
    setStage4Questions(next);
    saveProgressToDb({ overrideStage4: next });
  };

  // Handler Unggah Foto Orak-Orek Buku Tulis ke Cloudinary (Preset Tugas_4)
  const handleUploadPhoto = async (file, onProgress) => {
    try {
      const currentUser = user || getStoredUser();
      const result = await uploadTugas4ToCloudinary(file, currentUser, onProgress);
      const photoData = {
        secureUrl: result.secureUrl,
        originalFileName: result.originalFileName,
        fileSize: result.fileSize,
        format: result.format,
        publicId: result.publicId,
        uploadedAt: new Date().toISOString()
      };

      setUploadedPhotoInfo(photoData);
      showToast('📸 Foto orak-orek buku tulis berhasil diunggah ke Cloudinary!', 'success');
      triggerConfetti();

      // Otomatis simpan ke database tugas_pengumpulan
      await saveProgressToDb({
        isSubmit: false,
        isManual: false,
        photoOverride: photoData
      });

      return photoData;
    } catch (err) {
      console.error('Gagal unggah foto orak-orek:', err);
      showToast('⚠️ ' + (err.message || 'Gagal mengunggah foto.'), 'error');
      throw err;
    }
  };

  // Handler Hapus Foto Orak-Orek
  const handleRemovePhoto = async () => {
    if (!window.confirm('Hapus foto orak-orek yang telah diunggah?')) {
      return;
    }
    setUploadedPhotoInfo(null);
    showToast('Foto orak-orek buku tulis telah dihapus.', 'info');
    await saveProgressToDb({
      isSubmit: false,
      isManual: false,
      photoOverride: null
    });
  };

  // Submit Semua Jawaban / Pengumpulan Final
  const handleSubmitAll = async () => {
    await saveProgressToDb({ isSubmit: true, isManual: true });
  };

  // Reset pengerjaan jika siswa ingin mengulang dari awal dengan set soal baru (nilai database dilindungi)
  const handleResetAll = async () => {
    if (!window.confirm('Ulangi latihan dengan 15 paket soal baru? Nilai terbaikmu di database tetap aman terlindungi.')) {
      return;
    }
    const fresh = generate15UniqueQuestions();
    setStage2Questions(fresh.stage2);
    setStage3Questions(fresh.stage3);
    setStage4Questions(fresh.stage4);
    setActiveStage(1);
    setStage1Completed(false);
    triggerConfetti();
    showToast('🔄 15 paket soal baru disiapkan. Nilai terbaikmu di cloud tetap aman terlindungi!', 'info');

    // Simpan ke database pembaruan soal baru ini
    await saveProgressToDb({
      isSubmit: false,
      isManual: false,
      overrideStage1: false,
      overrideStage2: fresh.stage2,
      overrideStage3: fresh.stage3,
      overrideStage4: fresh.stage4,
      overrideActiveStage: 1
    });
  };

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  return {
    user,
    loading,
    activeStage,
    setActiveStage,
    stage1Completed,
    stage2Questions,
    stage3Questions,
    stage4Questions,
    uploadedPhotoInfo,
    scores,
    totalScore,
    isAllQuestionsAnswered,
    submitting,
    savingDraft,
    submitted,
    existingSubmission,
    showSuccessModal,
    setShowSuccessModal,
    toastMessage,
    showToast,
    clearToast,
    handleOpenLogin,
    handleCompleteStage1,
    handleAnswerStage2,
    handleAnswerStage3,
    handleAnswerStage4,
    handleUploadPhoto,
    handleRemovePhoto,
    handleSaveProgress: (opts) => saveProgressToDb(opts),
    handleSubmitAll,
    handleResetAll
  };
}

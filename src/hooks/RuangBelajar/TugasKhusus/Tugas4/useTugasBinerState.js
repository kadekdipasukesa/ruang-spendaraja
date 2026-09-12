import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { recordTaskPointLog } from '../../../../utils/pointLogger';
import { triggerConfetti, triggerGrandConfetti } from '../../../../utils/confettiHelper';
import {
  generate15UniqueQuestions,
  calculatePointsForAttempt,
  binerToDesimal,
  desimalToBiner8Bit
} from '../../../../components/RuangBelajar/TugasKhusus/Tugas4/binerAsciiData';

const isUUID = (str) => {
  if (typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
};

const CANONICAL_BINER_TASK_ID = '93e18a4d-71b5-4b0d-9b16-e5c26b9a2c91'; // Fallback UUID

export function useTugasBinerState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(1); // 1: Materi, 2: Desimal->Biner, 3: Biner->Desimal, 4: ASCII->Biner
  
  // State materi
  const [stage1Completed, setStage1Completed] = useState(false);

  // State 15 Soal Unik
  const [stage2Questions, setStage2Questions] = useState([]);
  const [stage3Questions, setStage3Questions] = useState([]);
  const [stage4Questions, setStage4Questions] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dbTaskId, setDbTaskId] = useState(CANONICAL_BINER_TASK_ID);
  const dbTaskIdRef = useRef(CANONICAL_BINER_TASK_ID);

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
    const s2Done = stage2Questions.length > 0 && stage2Questions.every((q) => q.isCorrect);
    const s3Done = stage3Questions.length > 0 && stage3Questions.every((q) => q.isCorrect);
    const s4Done = stage4Questions.length > 0 && stage4Questions.every((q) => q.isCorrect);
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
          .or('kode_tugas.eq.TUGAS-04-BINER-ASCII,kode_tugas.eq.tugas-inf-04,custom_route.ilike.%biner-ascii%,judul.ilike.%Bilangan Biner%')
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

  // 2. Load User dan Pulihkan Progres (Database-Only Continuation)
  const checkExistingSubmission = useCallback(async (student) => {
    if (!student) return null;
    const resolvedTaskId = dbTaskIdRef.current;
    const numStudentId = Number(student.id || student.ID);

    try {
      let query = supabase.from('tugas_pengumpulan').select('*');
      if (isUUID(resolvedTaskId)) {
        query = query.eq('tugas_id', resolvedTaskId);
      }
      if (Number.isInteger(numStudentId) && numStudentId > 0) {
        query = query.eq('siswa_id', numStudentId);
      } else if (student.NISN) {
        query = query.eq('nisn_siswa', String(student.NISN));
      } else {
        return null;
      }

      const { data: subDataList } = await query
        .order('submitted_at', { ascending: false })
        .limit(1);

      return subDataList && subDataList.length > 0 ? subDataList[0] : null;
    } catch (e) {
      console.warn('Gagal cek submission biner:', e);
      return null;
    }
  }, []);

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const savedUserStr = localStorage.getItem('user_siswa');
      let currentUser = null;
      if (savedUserStr) {
        currentUser = JSON.parse(savedUserStr);
        setUser(currentUser);
      } else {
        setUser(null);
      }

      const existingSub = await checkExistingSubmission(currentUser);
      if (existingSub) {
        setExistingSubmission(existingSub);
        setSubmitted(true);

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
          if (parsedDetail.stage1Completed) setStage1Completed(true);
          if (Array.isArray(parsedDetail.stage2Questions) && parsedDetail.stage2Questions.length === 5) {
            setStage2Questions(parsedDetail.stage2Questions);
          }
          if (Array.isArray(parsedDetail.stage3Questions) && parsedDetail.stage3Questions.length === 5) {
            setStage3Questions(parsedDetail.stage3Questions);
          }
          if (Array.isArray(parsedDetail.stage4Questions) && parsedDetail.stage4Questions.length === 5) {
            setStage4Questions(parsedDetail.stage4Questions);
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
    } catch (err) {
      console.error('Error loadSession Biner:', err);
      const fresh = generate15UniqueQuestions();
      setStage2Questions(fresh.stage2);
      setStage3Questions(fresh.stage3);
      setStage4Questions(fresh.stage4);
    } finally {
      setLoading(false);
    }
  }, [checkExistingSubmission]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Handler Selesai Tahap 1 (Materi)
  const handleCompleteStage1 = () => {
    setStage1Completed(true);
    setActiveStage(2);
    triggerConfetti();
  };

  // Handler Jawab Soal Tahap 2 (Desimal ke Biner)
  const handleAnswerStage2 = (questionIndex, inputAnswer) => {
    const cleanAnswer = inputAnswer.trim().replace(/^0+/, ''); // Abaikan leading zeros
    setStage2Questions((prev) => {
      const next = [...prev];
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
      return next;
    });
  };

  // Handler Jawab Soal Tahap 3 (Biner ke Desimal)
  const handleAnswerStage3 = (questionIndex, inputAnswer) => {
    const numAnswer = parseInt(inputAnswer.trim(), 10);
    setStage3Questions((prev) => {
      const next = [...prev];
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
      return next;
    });
  };

  // Handler Jawab Soal Tahap 4 (Karakter ASCII ke Biner)
  const handleAnswerStage4 = (questionIndex, inputAnswer) => {
    const cleanAnswer = inputAnswer.trim().replace(/^0+/, '');
    setStage4Questions((prev) => {
      const next = [...prev];
      const q = { ...next[questionIndex] };
      const targetClean = q.targetBiner.replace(/^0+/, '');
      const isCorrect = cleanAnswer === targetClean || inputAnswer.trim() === q.targetBiner;
      const attemptNum = (q.attempts || 0) + 1;

      q.userAnswer = inputAnswer.trim();
      q.attempts = attemptNum;

      if (isCorrect) {
        q.isCorrect = true;
        q.earnedPoints = calculatePointsForAttempt(4, attemptNum);
        q.feedback = `Luar biasa! Karakter '${q.char}' (Desimal ${q.desimal}) binernya adalah ${q.targetBiner}. (+${q.earnedPoints} Poin)`;
        triggerConfetti();
      } else {
        q.isCorrect = false;
        q.feedback = `Kurang tepat. Lihat kembali tabel ASCII untuk nilai desimal karakter '${q.char}'.`;
      }

      next[questionIndex] = q;
      return next;
    });
  };

  // Submit / Simpan Tugas ke Supabase (Database-Only Continuation & Math.max Score Protection)
  const handleSubmitAll = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const resolvedTaskId = dbTaskIdRef.current;
      const studentIdInt = user?.id ? Number(user.id) : null;
      const studentNisn = user?.NISN || null;
      const studentName = user?.NAMA || user?.nama || 'Siswa Spendaraja';
      const studentClass = user?.KELAS || user?.Kelas || user?.kelas || '7A';

      // 1. Cek nilai tertinggi sebelumnya
      let previousBestScore = 0;
      if (existingSubmission) {
        previousBestScore = Number(existingSubmission.nilai_akhir ?? existingSubmission.skor) || 0;
      }

      // 2. Proteksi Skor Database (Math.max)
      const finalScoreToSave = Math.min(50, Math.max(previousBestScore, totalScore));

      const detailLog = {
        scores,
        totalScore,
        stage1Completed,
        stage2Questions,
        stage3Questions,
        stage4Questions,
        submitted_at: new Date().toISOString()
      };

      const payload = {
        tugas_id: isUUID(resolvedTaskId) ? resolvedTaskId : null,
        siswa_id: studentIdInt,
        nisn_siswa: studentNisn,
        nama_siswa: studentName,
        kelas_siswa: studentClass,
        status: 'submitted',
        skor: finalScoreToSave,
        nilai_akhir: finalScoreToSave,
        detail_jawaban: detailLog,
        submitted_at: new Date().toISOString()
      };

      let saveErr = null;
      if (existingSubmission?.id) {
        const { error } = await supabase
          .from('tugas_pengumpulan')
          .update(payload)
          .eq('id', existingSubmission.id);
        saveErr = error;
      } else {
        const { data: newSub, error } = await supabase
          .from('tugas_pengumpulan')
          .insert([payload])
          .select()
          .single();
        saveErr = error;
        if (newSub) setExistingSubmission(newSub);
      }

      if (saveErr) {
        console.error('Gagal simpan ke tugas_pengumpulan Biner:', saveErr);
      }

      // Catat ke point_logs & update master_siswa
      if (studentNisn && finalScoreToSave > 0) {
        try {
          await recordTaskPointLog({
            nisn: studentNisn,
            nama: studentName,
            kelas: studentClass,
            points: finalScoreToSave,
            kodeTugas: 'TUGAS-04-BINER-ASCII',
            judulTugas: 'Tugas 4: Petualangan Bilangan Biner & Kode ASCII'
          });
        } catch (pe) {
          console.warn('Sinkronisasi point_logs biner:', pe);
        }
      }

      setSubmitted(true);
      setShowSuccessModal(true);
      triggerGrandConfetti();
    } catch (e) {
      console.error('Submit error Biner:', e);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset pengerjaan jika siswa ingin mengulang dari awal dengan set soal baru
  const handleResetAll = () => {
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
    scores,
    totalScore,
    isAllQuestionsAnswered,
    submitting,
    submitted,
    existingSubmission,
    showSuccessModal,
    setShowSuccessModal,
    handleOpenLogin,
    handleCompleteStage1,
    handleAnswerStage2,
    handleAnswerStage3,
    handleAnswerStage4,
    handleSubmitAll,
    handleResetAll
  };
}

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
    return user?.id ? `tugas_bk_state_user_${user.id}` : 'tugas_bk_state_guest';
  }, [user?.id]);

  // Cek apakah sudah pernah kumpul di Supabase & muat progress terakhir
  const checkExistingSubmission = useCallback(async (studentId, nisn, currentKey) => {
    if (!studentId && !nisn) {
      setLoading(false);
      return;
    }
    try {
      let query = supabase
        .from('tugas_pengumpulan')
        .select('*');

      if (studentId) {
        query = query.eq('siswa_id', studentId);
      } else {
        query = query.eq('nisn_siswa', nisn);
      }

      const { data } = await query
        .or('id_tugas.eq.TUGAS-02-KUIS-ALGO,tugas_id.eq.TUGAS-02-KUIS-ALGO,tugas_id.eq.c2243c08-ce28-4fe7-8ff7-86f9b546ecd0,id_tugas.eq.TUGAS_BK_01,tugas_id.eq.TUGAS_BK_01,id_tugas.eq.tugas-inf-02,tugas_id.eq.tugas-inf-02')
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setExistingSubmission(data);
        setSubmitted(true);

        // Jika di localStorage belum ada state, pulihkan dari snapshot detail_jawaban database
        const localSaved = currentKey ? localStorage.getItem(currentKey) : null;
        if (!localSaved) {
          if (data.detail_jawaban?.scores) {
            setScores(data.detail_jawaban.scores);
          }
          if (data.detail_jawaban?.completed) {
            setCompleted(data.detail_jawaban.completed);
          }
        }
      }
    } catch (err) {
      console.error('Error cek tugas_pengumpulan BK:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

          const nisn = parsed.nisn || parsed.NISN;
          const studentId = parsed.id;
          if (studentId || nisn) checkExistingSubmission(studentId, nisn, currentKey);
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
  }, [checkExistingSubmission]);

  // Cari ID master tugas dari database jika ada
  useEffect(() => {
    const findTask = async () => {
      try {
        const { data } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul')
          .or('kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02,tipe_tugas.eq.kuis,kategori.ilike.%Berpikir Komputasional%,judul.ilike.%Berpikir Komputasional%,urutan.eq.2')
          .limit(1)
          .maybeSingle();

        if (data?.id) {
          setDbTaskId(data.id);
        }
      } catch (err) {
        console.warn('Kueri tugas_master BK:', err);
      }
    };
    findTask();
  }, []);

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
    const studentId = user.id;
    const nisn = user.nisn || user.NISN || '';
    const nama = user.nama || user.NAMA || 'Siswa Spendaraja';
    const kelas = user.kelas || user.Kelas || user.KELAS || '7A';
    let resolvedTaskId = dbTaskId;
    if (!resolvedTaskId) {
      try {
        const { data: tData } = await supabase
          .from('tugas_master')
          .select('id')
          .or('kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.tugas-inf-02,tipe_tugas.eq.kuis,kategori.ilike.%Berpikir Komputasional%,judul.ilike.%Berpikir Komputasional%,urutan.eq.2')
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

      // 1. Cek skor terbaik sebelumnya dari state dan database
      let previousBestScore = 0;
      if (existingSubmission) {
        previousBestScore = Number(existingSubmission.nilai_akhir ?? existingSubmission.skor ?? 0) || 0;
      }

      try {
        let checkQ = supabase.from('tugas_pengumpulan').select('id, skor, nilai_akhir');
        if (studentId) {
          checkQ = checkQ.eq('siswa_id', studentId);
        } else {
          checkQ = checkQ.eq('nisn_siswa', nisn);
        }
        const { data: dbSub } = await checkQ
          .or(`tugas_id.eq.${resolvedTaskId},id_tugas.eq.${resolvedTaskId},tugas_id.eq.c2243c08-ce28-4fe7-8ff7-86f9b546ecd0,id_tugas.eq.TUGAS-02-KUIS-ALGO,id_tugas.eq.TUGAS_BK_01`)
          .maybeSingle();

        if (dbSub) {
          const dbScore = Number(dbSub.nilai_akhir ?? dbSub.skor ?? 0) || 0;
          previousBestScore = Math.max(previousBestScore, dbScore);
        }
      } catch (e) {
        console.warn('Kueri previous submission error:', e);
      }

      // ATURAN UTAMA: Nilai yang disimpan adalah NILAI TERBESAR (Math.max)
      // Jika nilai percobaan ke-2 lebih kecil, gunakan nilai yang terbesar!
      const finalScoreToSave = Math.max(previousBestScore, currentAttemptScore);
      const isRetained = currentAttemptScore < previousBestScore;
      const isImproved = currentAttemptScore > previousBestScore;

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

      // 2. Simpan ke tugas_pengumpulan (menggunakan finalScoreToSave)
      const payload = {
        tugas_id: resolvedTaskId,
        id_tugas: resolvedTaskId,
        siswa_id: studentId,
        nisn_siswa: nisn,
        nama_siswa: nama,
        kelas_siswa: kelas,
        status: 'selesai',
        skor: finalScoreToSave,
        nilai_akhir: finalScoreToSave,
        detail_jawaban: detailLog,
        catatan_guru: `Skor Praktik Berpikir Komputasional: ${finalScoreToSave}/100 Poin (Percobaan saat ini: ${currentAttemptScore}/100 | M1: ${scores.m1 || 0}/50, M2: ${scores.m2 || 0}/10, M3: ${scores.m3 || 0}/20, M4: ${scores.m4 || 0}/20).`,
        feedback_guru: `Pengerjaan Berpikir Komputasional (Algoritma: ${scores.m1 || 0}/50, Jadwal: ${scores.m2 || 0}/10, Struktur Data: ${scores.m3 || 0}/20, Representasi Data: ${scores.m4 || 0}/20)`,
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString(),
      };

      const { data: upsertedSub, error: upsertErr } = await supabase
        .from('tugas_pengumpulan')
        .upsert(payload, { onConflict: 'tugas_id,siswa_id' })
        .select()
        .maybeSingle();

      if (upsertErr) {
        console.warn('Upsert tugas_pengumpulan warning:', upsertErr);
        // Fallback upsert by id_tugas,nisn_siswa if schema uses old constraint
        await supabase
          .from('tugas_pengumpulan')
          .upsert(payload, { onConflict: 'id_tugas,nisn_siswa' });
      }

      // 3. Pastikan baris log tercatat di point_logs dengan nilai terbesar (finalScoreToSave)
      if (studentId) {
        const descText = `Tugas 2: Petualangan Berpikir Komputasional (Skor: ${finalScoreToSave}/100 Poin)`;
        
        // Cek log yang sudah ada
        const { data: existingLog } = await supabase
          .from('point_logs')
          .select('id')
          .eq('siswa_id', studentId)
          .eq('activity_type', 'tugas')
          .ilike('description', '%Tugas 2%')
          .maybeSingle();

        if (existingLog) {
          await supabase
            .from('point_logs')
            .update({
              amount: finalScoreToSave,
              description: descText,
              tugas_pengumpulan_id: upsertedSub?.id || null,
              created_at: new Date().toISOString()
            })
            .eq('id', existingLog.id);
        } else {
          await supabase.from('point_logs').insert([
            {
              siswa_id: studentId,
              amount: finalScoreToSave,
              activity_type: 'tugas',
              description: descText,
              tugas_pengumpulan_id: upsertedSub?.id || null,
              created_at: new Date().toISOString()
            }
          ]);
        }

        // 4. Sinkronkan total_points ke master_siswa
        const latestPoints = await syncStudentPointsAfterTask(studentId);
        if (latestPoints !== null && latestPoints !== undefined) {
          const updatedUser = { ...user, total_points: latestPoints };
          setUser(updatedUser);
          localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('storage'));
        }
      }

      // Simpan juga state terakhir ke localStorage
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({
          scores,
          completed,
          submitted_at: new Date().toISOString()
        }));
      }

      setSubmitted(true);
      setExistingSubmission(payload);
      setSubmissionMeta({
        savedScore: finalScoreToSave,
        attemptScore: currentAttemptScore,
        previousScore: previousBestScore,
        isRetained,
        isImproved,
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


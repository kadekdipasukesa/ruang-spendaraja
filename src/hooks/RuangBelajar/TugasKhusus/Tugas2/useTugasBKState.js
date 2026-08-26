import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { syncStudentPointsAfterTask, recordTaskPointLog } from '../../../../utils/pointLogger';

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

  // Cek apakah sudah pernah kumpul di Supabase
  const checkExistingSubmission = useCallback(async (studentId, nisn) => {
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
        .or('id_tugas.eq.TUGAS_BK_01,id_tugas.eq.TUGAS-02-KUIS-ALGO,id_tugas.eq.tugas-inf-02')
        .limit(1)
        .maybeSingle();

      if (data) {
        setExistingSubmission(data);
        setSubmitted(true);
        if (data.detail_jawaban?.scores) {
          setScores(data.detail_jawaban.scores);
        }
        if (data.detail_jawaban?.completed) {
          setCompleted(data.detail_jawaban.completed);
        }
      }
    } catch (err) {
      console.error('Error cek tugas_pengumpulan BK:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil sesi user dari localStorage
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
          const nisn = parsed.nisn || parsed.NISN;
          const studentId = parsed.id;
          if (studentId || nisn) checkExistingSubmission(studentId, nisn);
          else setLoading(false);
        } else {
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
          .select('id, kode_tugas')
          .or('kode_tugas.eq.TUGAS_BK_01,kode_tugas.eq.TUGAS-02-KUIS-ALGO,kode_tugas.eq.tugas-inf-02')
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

  const handleMissionComplete = (missionKey, score) => {
    setScores((prev) => ({ ...prev, [missionKey]: score }));
    setCompleted((prev) => ({ ...prev, [missionKey]: true }));
  };

  const totalScore = (scores.m1 || 0) + (scores.m2 || 0) + (scores.m3 || 0) + (scores.m4 || 0);
  const isAllCompleted = completed.m1 && completed.m2 && completed.m3 && completed.m4;

  const handleResetAll = () => {
    setScores({ m1: 0, m2: 0, m3: 0, m4: 0 });
    setCompleted({ m1: false, m2: false, m3: false, m4: false });
  };

  // Submit flexible (bisa kumpul kapan saja, dan bisa perbaiki kapan saja agar jadi 100%)
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
    const resolvedTaskId = dbTaskId || 'TUGAS_BK_01';

    try {
      const detailLog = {
        scores,
        completed,
        breakdown: {
          m1_algoritma: scores.m1 || 0,
          m2_jadwal: scores.m2 || 0,
          m3_struktur_data: scores.m3 || 0,
          m4_representasi_data: scores.m4 || 0,
        },
        submitted_at: new Date().toISOString()
      };

      // 1. Simpan ke tugas_pengumpulan
      const payload = {
        tugas_id: resolvedTaskId,
        id_tugas: resolvedTaskId,
        siswa_id: studentId,
        nisn_siswa: nisn,
        nama_siswa: nama,
        kelas_siswa: kelas,
        status: 'selesai',
        skor: totalScore,
        nilai_akhir: totalScore,
        detail_jawaban: detailLog,
        catatan_guru: `Skor Praktik Berpikir Komputasional: ${totalScore}/100 Poin (M1: ${scores.m1}/50, M2: ${scores.m2}/10, M3: ${scores.m3}/20, M4: ${scores.m4}/20).`,
        feedback_guru: `Pengerjaan Berpikir Komputasional (Algoritma: ${scores.m1}/50, Jadwal: ${scores.m2}/10, Struktur Data: ${scores.m3}/20, Representasi Data: ${scores.m4}/20)`,
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

      // 2. Pastikan baris log tercatat di point_logs
      if (studentId) {
        const descText = `Tugas 2: Petualangan Berpikir Komputasional (Skor: ${totalScore}/100 Poin)`;
        
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
              amount: totalScore,
              description: descText,
              tugas_pengumpulan_id: upsertedSub?.id || null,
              created_at: new Date().toISOString()
            })
            .eq('id', existingLog.id);
        } else {
          await supabase.from('point_logs').insert([
            {
              siswa_id: studentId,
              amount: totalScore,
              activity_type: 'tugas',
              description: descText,
              tugas_pengumpulan_id: upsertedSub?.id || null,
              created_at: new Date().toISOString()
            }
          ]);
        }

        // 3. Sinkronkan total_points ke master_siswa
        const latestPoints = await syncStudentPointsAfterTask(studentId);
        if (latestPoints !== null && latestPoints !== undefined) {
          const updatedUser = { ...user, total_points: latestPoints };
          setUser(updatedUser);
          localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('storage'));
        }
      }

      setSubmitted(true);
      setExistingSubmission(payload);
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
    handleOpenLogin,
    handleMissionComplete,
    handleResetAll,
    handleSubmitAll,
  };
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { DUMMY_TUGAS } from '../../data/dummyTugas';
import { recordTaskPointLog } from '../../utils/pointLogger';

const LOCAL_STORAGE_TASKS_KEY = 'spenda_ruang_belajar_tasks_v2';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'spenda_ruang_belajar_submissions_v2';

export function useRuangBelajarDB() {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('SEMUA');
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'log_score' | 'leaderboard' | 'admin'
  const [selectedTask, setSelectedTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // 1. Identify Student and Role
  useEffect(() => {
    const syncStudent = () => {
      try {
        const savedUser = localStorage.getItem('user_siswa');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setStudent(parsed);
          if (parsed?.Kelas || parsed?.KELAS) {
            setSelectedClass(parsed?.Kelas || parsed?.KELAS);
          }
        } else {
          setStudent(null);
        }
      } catch (e) {
        console.error("Gagal membaca data siswa dari localStorage:", e);
        setStudent(null);
      }
    };

    syncStudent();
    window.addEventListener('storage', syncStudent);
    return () => window.removeEventListener('storage', syncStudent);
  }, []);

  const isAdmin = useMemo(() => {
    if (!student) return false;
    const role = (student.role || '').toLowerCase();
    const role2 = (student.role_2 || '').toLowerCase();
    return role === 'admin' || role === 'guru' || role2 === 'admin' || role2 === 'guru';
  }, [student]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 2. Fetch Tasks from Supabase (with auto-seeding if table is empty)
  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tugas_master')
        .select('*')
        .order('urutan', { ascending: true });

      if (error || !data || data.length === 0) {
        // Try auto-seeding if empty
        if (!error && (!data || data.length === 0)) {
          const seedData = DUMMY_TUGAS.map((d) => ({
            kode_tugas: d.kode_tugas,
            urutan: d.urutan,
            judul: d.judul || d.title,
            deskripsi: d.deskripsi || d.description,
            petunjuk: d.petunjuk || d.instructions,
            kategori: d.kategori || d.category,
            tipe_tugas: d.tipe_tugas,
            custom_route: d.custom_route,
            poin_maksimal: d.poin_maksimal || d.points || 100,
            deadline: d.deadline,
            is_active: d.is_active ?? true,
            target_kelas: d.target_kelas || 'SEMUA'
          }));

          const { data: inserted } = await supabase
            .from('tugas_master')
            .upsert(seedData, { onConflict: 'kode_tugas' })
            .select();

          if (inserted && inserted.length > 0) {
            const mapped = inserted.map((t) => ({
              ...t,
              title: t.judul,
              points: t.poin_maksimal,
              description: t.deskripsi,
              instructions: t.petunjuk,
              deadline: t.deadline
            }));
            setTasks(mapped);
            return;
          }
        }

        // Fallback to local storage or dummy
        const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
        if (saved) {
          setTasks(JSON.parse(saved));
        } else {
          setTasks(DUMMY_TUGAS);
          localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(DUMMY_TUGAS));
        }
      } else {
        // Map database fields to standard schema
        const mapped = data.map((t) => ({
          ...t,
          title: t.judul || t.title,
          points: t.poin_maksimal || t.points || 100,
          description: t.deskripsi || t.description,
          instructions: t.petunjuk || t.instructions || [],
          deadline: t.deadline || new Date().toISOString()
        }));
        setTasks(mapped);
      }
    } catch (err) {
      console.warn("Koneksi Supabase tugas_master fallback ke lokal:", err);
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      setTasks(saved ? JSON.parse(saved) : DUMMY_TUGAS);
    }
  }, []);

  // 3. Fetch Submissions (Log Skor) from Supabase
  const fetchSubmissions = useCallback(async () => {
    // If not admin and not logged in (guest), submissions are strictly empty
    if (!student?.id && !isAdmin) {
      setSubmissions([]);
      return;
    }

    try {
      let query = supabase.from('tugas_pengumpulan').select(`
        *,
        master_siswa:siswa_id (
          id,
          "NAMA",
          "Kelas",
          "No Absen"
        ),
        tugas_master:tugas_id (
          id,
          kode_tugas,
          judul,
          poin_maksimal,
          kategori,
          tipe_tugas,
          urutan
        )
      `);

      // If not admin, only fetch current student's submissions
      if (student?.id && !isAdmin) {
        query = query.eq('siswa_id', student.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error || !data) {
        if (student?.id) {
          const savedSub = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
          setSubmissions(savedSub ? JSON.parse(savedSub) : []);
        } else {
          setSubmissions([]);
        }
      } else {
        setSubmissions(data);
      }
    } catch (err) {
      console.warn("Koneksi Supabase tugas_pengumpulan fallback:", err);
      if (student?.id) {
        const savedSub = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
        setSubmissions(savedSub ? JSON.parse(savedSub) : []);
      } else {
        setSubmissions([]);
      }
    }
  }, [student, isAdmin]);

  // 4. Fetch Leaderboard directly from master_siswa (only total_points > 0)
  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('master_siswa')
        .select('id, "NAMA", "Kelas", "No Absen", "NISN", total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false });

      if (error) {
        console.warn("Koneksi Supabase master_siswa leaderboard error:", error);
      } else {
        setLeaderboard(data || []);
      }
    } catch (err) {
      console.warn("Gagal mengambil leaderboard master_siswa:", err);
    }
  }, []);

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchSubmissions(), fetchLeaderboard()]);
      setLoading(false);
    };
    initData();
  }, [fetchTasks, fetchSubmissions, fetchLeaderboard]);

  // 5. Setup Realtime Listeners
  useEffect(() => {
    const channelId = `ruang_belajar_sync_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tugas_master' }, () => {
        fetchTasks();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tugas_pengumpulan' }, () => {
        fetchSubmissions();
        fetchLeaderboard();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'point_logs' }, () => {
        fetchLeaderboard();
        fetchSubmissions();
        if (student?.id) {
          supabase
            .from('master_siswa')
            .select('total_points')
            .eq('id', student.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data && data.total_points !== undefined) {
                setStudent((prev) => {
                  if (!prev) return prev;
                  const updated = { ...prev, total_points: data.total_points };
                  localStorage.setItem('user_siswa', JSON.stringify(updated));
                  return updated;
                });
              }
            });
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'master_siswa' }, (payload) => {
        fetchLeaderboard();
        if (student?.id && payload?.new?.id === student.id) {
          setStudent((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, total_points: payload.new.total_points };
            localStorage.setItem('user_siswa', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks, fetchSubmissions, fetchLeaderboard, student?.id]);

  // Merge Tasks with Current Student Submission Status
  const mergedTasks = useMemo(() => {
    const studentId = student?.id;

    // If guest (not logged in and not admin), no personal submission is associated
    if (!studentId && !isAdmin) {
      return tasks.map((task) => ({
        ...task,
        status: 'belum',
        earnedScore: null,
        submission: null
      }));
    }

    return tasks.map((task) => {
      // Find submission for this task by this specific student
      const sub = studentId
        ? submissions.find(
            (s) =>
              (s.tugas_id === task.id ||
                s.tugas_id === task.kode_tugas ||
                s.tugas_master?.kode_tugas === task.kode_tugas ||
                (task.tipe_tugas === 'simulasi' && (s.tugas_master?.tipe_tugas === 'simulasi' || s.tugas_id === 'tugas-inf-01')) ||
                (task.tipe_tugas === 'kuis' && (s.tugas_master?.tipe_tugas === 'kuis' || s.tugas_id === 'tugas-inf-02'))) &&
              s.siswa_id === studentId
          )
        : null;

      let status = 'belum';
      let earnedScore = null;
      let submissionData = null;

      if (sub) {
        status = sub.status || (sub.skor !== null ? 'selesai' : 'sedang');
        earnedScore = sub.skor;
        submissionData = {
          id: sub.id,
          submittedAt: sub.submitted_at || sub.created_at,
          link: sub.tautan_tugas,
          notes: sub.catatan_siswa,
          fileName: sub.nama_berkas,
          score: sub.skor,
          feedback: sub.catatan_guru,
          detailJawaban: sub.detail_jawaban
        };
      }

      return {
        ...task,
        status,
        earnedScore,
        submission: submissionData
      };
    });
  }, [tasks, submissions, student?.id, isAdmin]);

  // Visible tasks for current view (if student, respect is_active)
  const visibleTasks = useMemo(() => {
    if (isAdmin) return mergedTasks;
    const studentClass = student?.Kelas || student?.KELAS || 'SEMUA';
    return mergedTasks.filter((t) => {
      if (t.is_active === false) return false;
      if (t.target_kelas && t.target_kelas !== 'SEMUA' && t.target_kelas !== studentClass) {
        return false;
      }
      return true;
    });
  }, [mergedTasks, isAdmin, student]);

  // Overall Statistics for Student
  const stats = useMemo(() => {
    const total = visibleTasks.length;

    let totalMaxPoints = 0;
    visibleTasks.forEach((t) => {
      totalMaxPoints += Number(t.points || t.poin_maksimal || 100);
    });

    if (!student?.id && !isAdmin) {
      return {
        total,
        completed: 0,
        inProgress: 0,
        unstarted: total,
        totalEarnedPoints: 0,
        totalMaxPoints,
        progressPercent: 0
      };
    }

    const completed = visibleTasks.filter((t) => t.status === 'selesai' || t.status === 'dinilai').length;
    const inProgress = visibleTasks.filter((t) => t.status === 'sedang').length;
    const unstarted = visibleTasks.filter((t) => t.status === 'belum').length;

    let totalEarnedPoints = 0;
    visibleTasks.forEach((t) => {
      if (t.earnedScore !== null && t.earnedScore !== undefined) {
        totalEarnedPoints += Number(t.earnedScore);
      }
    });

    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      unstarted,
      totalEarnedPoints,
      totalMaxPoints,
      progressPercent
    };
  }, [visibleTasks, student?.id, isAdmin]);

  // Filter Leaderboard by Selected Class (Strictly Grade 7)
  const filteredLeaderboard = useMemo(() => {
    // Only students in Grade 7
    const grade7List = leaderboard.filter((item) => {
      const k = (item.Kelas || item.KELAS || '').toString().trim();
      return k.startsWith('7') || k.startsWith('VII') || k.startsWith('7.');
    });

    if (selectedClass === 'SEMUA') {
      return grade7List;
    }
    return grade7List.filter((item) => {
      const k = (item.Kelas || item.KELAS || '').toString().trim();
      return k === selectedClass;
    });
  }, [leaderboard, selectedClass]);

  // Distinct Grade 7 Classes for Leaderboard Tabs
  const availableClasses = useMemo(() => {
    const defaultClasses = ['SEMUA', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'];
    const dynamicClasses = leaderboard
      .map((s) => (s.Kelas || s.KELAS || '').trim())
      .filter((k) => k && (k.startsWith('7') || k.startsWith('VII') || k.startsWith('7.')));
    return Array.from(new Set([...defaultClasses, ...dynamicClasses]));
  }, [leaderboard]);

  // --- ACTIONS ---

  // Submit task (from modal or interactive simulator/quiz)
  const handleSubmitTask = async (taskId, payload) => {
    if (!student?.id) {
      showToast("Gagal: Anda belum masuk akun siswa. Silakan login terlebih dahulu!");
      window.dispatchEvent(new CustomEvent('open-login-modal'));
      return { success: false, error: 'Belum login' };
    }

    const { link, notes, fileName, autoScore, detailJawaban } = payload;
    const scoreVal = autoScore !== undefined && autoScore !== null ? Number(autoScore) : null;
    const currentStatus = scoreVal !== null ? 'selesai' : 'sedang';

    // Find real task in state or database
    const matchedTask = tasks.find((t) => t.id === taskId || t.kode_tugas === taskId);
    const targetDbId = matchedTask?.id || taskId;

    const newSubRecord = {
      tugas_id: targetDbId,
      siswa_id: student.id,
      status: currentStatus,
      skor: scoreVal,
      tautan_tugas: link || null,
      catatan_siswa: notes || null,
      nama_berkas: fileName || null,
      detail_jawaban: detailJawaban || null,
      submitted_at: new Date().toISOString(),
      catatan_guru: scoreVal !== null ? 'Penilaian otomatis sistem selesai.' : 'Tugas diterima, menunggu penilaian Guru.'
    };

    // Update local state immediately for responsive feel
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.tugas_id === targetDbId && s.siswa_id === student.id)
      );
      return [newSubRecord, ...filtered];
    });

    try {
      // Ambil riwayat skor sebelumnya untuk menghitung delta jika ada
      const { data: prevSub } = await supabase
        .from('tugas_pengumpulan')
        .select('skor')
        .eq('tugas_id', targetDbId)
        .eq('siswa_id', student.id)
        .maybeSingle();

      const prevScore = prevSub?.skor || 0;

      const { error } = await supabase
        .from('tugas_pengumpulan')
        .upsert(newSubRecord, { onConflict: 'tugas_id,siswa_id' });

      if (error) {
        console.warn("Supabase upsert error, saved locally:", error);
      } else if (scoreVal !== null) {
        // Catat ke point_logs & sinkronkan total_points ke master_siswa
        const taskTitle = matchedTask?.judul || 'Tugas Ruang Belajar';
        const latestTotal = await recordTaskPointLog({
          siswaId: student.id,
          currentScore: scoreVal,
          previousScore: prevScore,
          activityType: 'tugas',
          taskTitle: taskTitle
        });

        if (latestTotal !== null && latestTotal !== undefined) {
          const updatedStudent = { ...student, total_points: latestTotal };
          setStudent(updatedStudent);
          localStorage.setItem('user_siswa', JSON.stringify(updatedStudent));
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.error("Gagal mengirim tugas ke Supabase:", e);
    }

    showToast(scoreVal !== null ? `Tugas tuntas! Anda meraih skor ${scoreVal} Poin 🎉` : 'Tugas berhasil dikirim ke Guru!');
    return { success: true };
  };

  // Admin Action: Toggle Enable/Disable Task
  const handleToggleTaskActive = async (taskId, currentActive) => {
    const newActiveState = !currentActive;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_active: newActiveState } : t))
    );

    try {
      const { error } = await supabase
        .from('tugas_master')
        .update({ is_active: newActiveState })
        .eq('id', taskId);

      if (error) {
        console.warn("Update is_active error:", error);
      }
      showToast(newActiveState ? "Tugas berhasil diaktifkan untuk siswa!" : "Tugas dinonaktifkan (disembunyikan dari siswa).");
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Action: Update Task Point Weight
  const handleUpdateTaskWeight = async (taskId, newWeight) => {
    const pointsNum = Number(newWeight) || 100;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, poin_maksimal: pointsNum, points: pointsNum } : t))
    );

    try {
      const { error } = await supabase
        .from('tugas_master')
        .update({ poin_maksimal: pointsNum })
        .eq('id', taskId);

      if (error) {
        console.warn("Update bobot error:", error);
      }
      showToast(`Bobot nilai tugas berhasil diubah menjadi ${pointsNum} poin!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Action: Update Task Deadline (Batas Pengumpulan)
  const handleUpdateTaskDeadline = async (taskId, newDeadline) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, deadline: newDeadline } : t))
    );

    try {
      const { error } = await supabase
        .from('tugas_master')
        .update({ deadline: newDeadline })
        .eq('id', taskId);

      if (error) {
        console.warn("Update deadline error:", error);
      }
      showToast("Batas waktu pengumpulan tugas berhasil diperbarui!");
    } catch (e) {
      console.error("Gagal update batas waktu:", e);
    }
  };

  // Admin Action: Manual Grading for Submissions
  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    const gradeNum = Number(grade);

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              skor: gradeNum,
              status: 'selesai',
              catatan_guru: feedback || s.catatan_guru
            }
          : s
      )
    );

    try {
      const prevSubItem = submissions.find((s) => s.id === submissionId);
      const prevScore = prevSubItem?.skor || 0;

      const { data: updatedSub, error } = await supabase
        .from('tugas_pengumpulan')
        .update({
          skor: gradeNum,
          status: 'selesai',
          catatan_guru: feedback
        })
        .eq('id', submissionId)
        .select('*, master_siswa(*)')
        .single();

      if (!error && updatedSub?.siswa_id) {
        await recordTaskPointLog({
          siswaId: updatedSub.siswa_id,
          currentScore: gradeNum,
          previousScore: prevScore,
          activityType: 'tugas',
          taskTitle: 'Penilaian Tugas Guru'
        });
      }

      showToast("Nilai tugas dan catatan evaluasi berhasil disimpan!");
    } catch (e) {
      console.error("Gagal update nilai tugas:", e);
    }
  };

  return {
    student,
    isAdmin,
    tasks: visibleTasks,
    allTasks: tasks,
    submissions,
    stats,
    leaderboard: filteredLeaderboard,
    availableClasses,
    selectedClass,
    setSelectedClass,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    loading,
    toastMessage,
    handleSubmitTask,
    handleToggleTaskActive,
    handleUpdateTaskWeight,
    handleUpdateTaskDeadline,
    handleGradeSubmission,
    refreshData: () => {
      fetchTasks();
      fetchSubmissions();
      fetchLeaderboard();
    }
  };
}

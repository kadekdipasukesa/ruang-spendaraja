import { useState, useEffect, useMemo } from 'react';
import { DUMMY_TUGAS } from '../../data/dummyTugas';

const STORAGE_KEY = 'spenda_ruang_belajar_tasks_v1';

export function useRuangBelajar() {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Gagal memuat tugas dari local storage, menggunakan dummy data:", e);
    }
    return DUMMY_TUGAS;
  });

  const [activeTab, setActiveTab] = useState('semua'); // 'semua' | 'belum' | 'selesai'
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'points' | 'priority'
  const [selectedTask, setSelectedTask] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync Student profile from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user_siswa');
      if (savedUser) {
        setStudent(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Gagal membaca user_siswa:", e);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Gagal menyimpan tugas ke local storage:", e);
    }
  }, [tasks]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open & Close Detail Modal
  const handleOpenDetail = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  // Update status (e.g. mark as sedang / selesai / belum)
  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, status: newStatus };
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Status tugas berhasil diubah ke: ${newStatus === 'selesai' ? 'Selesai' : newStatus === 'sedang' ? 'Sedang Dikerjakan' : 'Belum Dikerjakan'}`);
  };

  // Submit task response (notes, link, file name)
  const handleSubmitTask = (taskId, { link, notes, fileName }) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            status: 'selesai',
            submission: {
              submittedAt: new Date().toISOString(),
              link: link || '',
              notes: notes || '',
              fileName: fileName || '',
              grade: null,
              feedback: 'Tugas Anda telah diterima oleh sistem dan siap dinilai oleh Guru Pengampu.'
            }
          };
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
    showToast('Tugas Anda berhasil dikirim! Poin akan segera diperbarui.');
  };

  // Reset to initial dummy tasks
  const handleResetTasks = () => {
    setTasks(DUMMY_TUGAS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_TUGAS));
    if (selectedTask) {
      const match = DUMMY_TUGAS.find((t) => t.id === selectedTask.id);
      setSelectedTask(match || null);
    }
    showToast('Daftar tugas telah di-reset ke data bawaan.');
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Tab filter
        if (activeTab === 'belum' && task.status === 'selesai') return false;
        if (activeTab === 'selesai' && task.status !== 'selesai') return false;

        // Category filter
        if (selectedCategory !== 'Semua' && task.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchCategory = task.category.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchTeacher = task.teacher.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchDesc && !matchTeacher) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'points') {
          return b.points - a.points;
        }
        if (sortBy === 'priority') {
          const rank = { Tinggi: 3, Sedang: 2, Rendah: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        return 0;
      });
  }, [tasks, activeTab, selectedCategory, searchQuery, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'selesai').length;
    const inProgress = tasks.filter((t) => t.status === 'sedang').length;
    const pending = tasks.filter((t) => t.status === 'belum').length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const earnedPoints = tasks
      .filter((t) => t.status === 'selesai')
      .reduce((acc, curr) => acc + (curr.points || 0), 0);
    const totalPoints = tasks.reduce((acc, curr) => acc + (curr.points || 0), 0);

    return {
      total,
      completed,
      inProgress,
      pending,
      progressPercent,
      earnedPoints,
      totalPoints
    };
  }, [tasks]);

  return {
    student,
    tasks: filteredTasks,
    allTasksCount: tasks.length,
    stats,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedTask,
    handleOpenDetail,
    handleCloseDetail,
    handleUpdateStatus,
    handleSubmitTask,
    handleResetTasks,
    toastMessage
  };
}

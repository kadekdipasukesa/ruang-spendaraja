import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { INITIAL_FILES_DATA, evaluateAllMissions } from './missionsConfig';
import { playMissionSuccessSound, triggerMissionFireworkAnimation } from '../../../../utils/missionCelebration';
import { recordTaskPointLog } from '../../../../utils/pointLogger';

const CANONICAL_TUGAS_1_ID = 'cdaa57b1-b206-4a7e-92e8-4e1422c180b0';

const isUUID = (str) => {
  if (typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
};

export function useSimulasiFolder() {
  const [student, setStudent] = useState(null);
  const [dbTaskId, setDbTaskId] = useState(CANONICAL_TUGAS_1_ID);

  // File System State
  const [items, setItems] = useState(INITIAL_FILES_DATA);
  const [currentFolderId, setCurrentFolderId] = useState(null); // null = Drive Utama C:
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Navigation History
  const [history, setHistory] = useState([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals & Forms State
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState('root');

  // Evaluation & Results State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previousSubmission, setPreviousSubmission] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI Helper State & Floating Mission Drawer
  const [isMissionDrawerOpen, setIsMissionDrawerOpen] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [recentCompletedMission, setRecentCompletedMission] = useState(null);

  // Ref to track previously passed mission IDs to detect NEW completions
  const prevPassedMissionIdsRef = useRef(null);
  const hasHydratedRef = useRef(false);

  // Storage key per student for state isolation
  const storageKey = useMemo(() => {
    return student?.id ? `simulasi_folder_user_${student.id}` : null;
  }, [student?.id]);

  const handleOpenLogin = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  }, []);

  // 1. Synchronize student session with localStorage and storage events
  useEffect(() => {
    const syncStudent = () => {
      try {
        const savedUser = localStorage.getItem('user_siswa');
        if (savedUser) {
          setStudent(JSON.parse(savedUser));
        } else {
          setStudent(null);
          setPreviousSubmission(null);
          setItems(INITIAL_FILES_DATA);
          setCurrentFolderId(null);
          setSelectedItem(null);
        }
      } catch (e) {
        console.error(e);
        setStudent(null);
      }
    };

    syncStudent();
    window.addEventListener('storage', syncStudent);
    return () => window.removeEventListener('storage', syncStudent);
  }, []);

  // 2. Fetch or match taskId from Supabase tugas_master
  useEffect(() => {
    const findTask = async () => {
      try {
        const { data: taskRecord } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, tipe_tugas, poin_maksimal')
          .or('kode_tugas.eq.TUGAS-01-SIMULASI-FOLDER,tipe_tugas.eq.simulasi')
          .limit(1)
          .maybeSingle();

        if (taskRecord?.id && isUUID(taskRecord.id)) {
          setDbTaskId(taskRecord.id);
        }
      } catch (err) {
        console.warn("Kueri tugas_master:", err);
      }
    };
    findTask();
  }, []);

  // 3. Load student-specific items & previous submission ONLY from Database tugas_pengumpulan
  useEffect(() => {
    if (!student) {
      setItems(INITIAL_FILES_DATA);
      setPreviousSubmission(null);
      setIsLoaded(true);
      return;
    }

    const loadStudentData = async () => {
      try {
        const numStudentId = parseInt(student.id || student.siswa_id, 10);
        if (!numStudentId) {
          setItems(INITIAL_FILES_DATA);
          setPreviousSubmission(null);
          setIsLoaded(true);
          return;
        }

        // Resolusi ID tugas dari tugas_master jika diperlukan
        let activeTaskId = dbTaskId;
        if (!activeTaskId || !isUUID(activeTaskId)) {
          const { data: taskRecord } = await supabase
            .from('tugas_master')
            .select('id')
            .or('kode_tugas.eq.TUGAS-01-SIMULASI-FOLDER,tipe_tugas.eq.simulasi,urutan.eq.1')
            .limit(1)
            .maybeSingle();
          if (taskRecord?.id && isUUID(taskRecord.id)) {
            activeTaskId = taskRecord.id;
            setDbTaskId(taskRecord.id);
          }
        }

        // HANYA masukkan valid UUID ke kueri Supabase agar tidak memicu error PostgreSQL 22P02
        const candidateTaskIds = [
          activeTaskId,
          CANONICAL_TUGAS_1_ID,
        ].filter(Boolean).filter(isUUID);

        let query = supabase
          .from('tugas_pengumpulan')
          .select('*')
          .eq('siswa_id', numStudentId);

        if (candidateTaskIds.length > 0) {
          query = query.in('tugas_id', candidateTaskIds);
        }

        const { data: subDataList, error: queryErr } = await query
          .order('submitted_at', { ascending: false })
          .limit(1);

        if (queryErr) {
          console.warn("Kueri tugas_pengumpulan error:", queryErr);
        }

        const subData = subDataList && subDataList.length > 0 ? subDataList[0] : null;

        if (subData) {
          let parsedDetail = null;
          if (subData.detail_jawaban) {
            if (typeof subData.detail_jawaban === 'string') {
              try {
                parsedDetail = JSON.parse(subData.detail_jawaban);
              } catch (err) {
                console.warn("Gagal parse detail_jawaban folder:", err);
              }
            } else if (typeof subData.detail_jawaban === 'object') {
              parsedDetail = subData.detail_jawaban;
            }
          }

          setPreviousSubmission({
            ...subData,
            detail_jawaban: parsedDetail || subData.detail_jawaban
          });

          // SINKRON DATABASE: Pulihkan snapshot struktur folder murni dari database tugas_pengumpulan
          if (parsedDetail?.treeSnapshot && Array.isArray(parsedDetail.treeSnapshot) && parsedDetail.treeSnapshot.length > 0) {
            setItems(parsedDetail.treeSnapshot);
            if (storageKey) {
              try {
                localStorage.setItem(storageKey, JSON.stringify(parsedDetail.treeSnapshot));
              } catch (err) {
                console.warn("Gagal update local storage dari db:", err);
              }
            }
          } else {
            // Jika snapshot belum ada di detail_jawaban, fallback ke initial
            setItems(INITIAL_FILES_DATA);
          }
        } else {
          // Belum pernah ada data di tabel tugas_pengumpulan: MULAI DARI AWAL!
          setPreviousSubmission(null);
          setItems(INITIAL_FILES_DATA);
          setCurrentFolderId(null);
          setSelectedItem(null);
          if (storageKey) {
            try {
              localStorage.removeItem(storageKey);
            } catch (e) {
              /* ignore */
            }
          }
        }
      } catch (e) {
        console.warn("Cek pengumpulan sebelumnya error:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadStudentData();
  }, [student, storageKey, dbTaskId]);

  // 4. Save items to student-specific localStorage whenever items change
  useEffect(() => {
    if (isLoaded && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, isLoaded, storageKey]);

  // 5. Navigate to folder with history tracking
  const navigateToFolder = useCallback((folderId) => {
    setCurrentFolderId(folderId);
    setSelectedItem(null);
    setSearchQuery('');
    setHistory((prev) => {
      const newHist = prev.slice(0, historyIndex + 1);
      return [...newHist, folderId];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const navigateBack = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentFolderId(history[prevIndex]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const navigateForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentFolderId(history[nextIndex]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const navigateUp = useCallback(() => {
    if (!currentFolderId) return;
    const currentFolder = items.find((it) => it.id === currentFolderId);
    navigateToFolder(currentFolder?.parentId || null);
  }, [currentFolderId, items, navigateToFolder]);

  // 6. Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ id: null, name: 'Drive Utama (C:)' }];
    if (!currentFolderId) return crumbs;

    let currId = currentFolderId;
    const path = [];
    while (currId) {
      const folder = items.find((it) => it.id === currId && it.type === 'folder');
      if (folder) {
        path.unshift(folder);
        currId = folder.parentId;
      } else {
        break;
      }
    }
    return [...crumbs, ...path];
  }, [items, currentFolderId]);

  // 7. Current folder items with search filter
  const currentItems = useMemo(() => {
    const directChildren = items.filter((it) => it.parentId === currentFolderId);
    if (!searchQuery.trim()) return directChildren;

    const q = searchQuery.toLowerCase().trim();
    return directChildren.filter((it) => it.name.toLowerCase().includes(q));
  }, [items, currentFolderId, searchQuery]);

  // All folders for Sidebar & Move modal
  const allFolders = useMemo(() => items.filter((it) => it.type === 'folder'), [items]);

  // Real-time Mission Evaluation (25 missions)
  const evalResult = useMemo(() => {
    return evaluateAllMissions(items);
  }, [items]);

  // Sound effect & Fireworks animation trigger upon completing any mission
  useEffect(() => {
    if (!isLoaded || !evalResult || !evalResult.checklist) return;

    const currentPassedIds = new Set(
      evalResult.checklist.filter((m) => m.passed).map((m) => m.id)
    );

    // Initial hydration after items are fully loaded from localStorage/Supabase
    if (!hasHydratedRef.current) {
      prevPassedMissionIdsRef.current = currentPassedIds;
      hasHydratedRef.current = true;
      return;
    }

    if (!prevPassedMissionIdsRef.current) {
      prevPassedMissionIdsRef.current = currentPassedIds;
      return;
    }

    // Detect newly passed missions (only when user actively completes during session)
    const newlyPassed = evalResult.checklist.find(
      (m) => m.passed && !prevPassedMissionIdsRef.current.has(m.id)
    );

    if (newlyPassed) {
      // 1. Play sound effect
      playMissionSuccessSound();

      // 2. Trigger Firework (petasan) animation
      triggerMissionFireworkAnimation();

      // 3. Show celebration toast (auto dismiss after 3.5s)
      setRecentCompletedMission(newlyPassed);
      const timer = setTimeout(() => {
        setRecentCompletedMission(null);
      }, 3500);

      prevPassedMissionIdsRef.current = currentPassedIds;
      return () => clearTimeout(timer);
    }

    // Sync ref
    prevPassedMissionIdsRef.current = currentPassedIds;
  }, [evalResult, isLoaded]);

  // 8. Actions
  const handleCreateFolder = useCallback((folderName) => {
    if (!folderName || !folderName.trim()) return;

    const newFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: folderName.trim(),
      type: 'folder',
      parentId: currentFolderId,
      createdAt: new Date().toISOString()
    };

    setItems((prev) => [...prev, newFolder]);
    setShowNewFolderModal(false);
  }, [currentFolderId]);

  const handleCreateFile = useCallback(({ fileName, fileType, ext, size }) => {
    if (!fileName || !fileName.trim()) return;

    let finalName = fileName.trim();
    if (ext && !finalName.toLowerCase().endsWith(ext.toLowerCase())) {
      finalName += ext;
    }

    const newFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      type: 'file',
      fileType: fileType || 'doc',
      ext: ext || (finalName.includes('.') ? `.${finalName.split('.').pop()}` : '.txt'),
      size: size || '15 KB',
      parentId: currentFolderId,
      createdAt: new Date().toISOString()
    };

    setItems((prev) => [...prev, newFile]);
    setShowNewFileModal(false);
  }, [currentFolderId]);

  const handleRename = useCallback((targetItem, newName) => {
    if (!targetItem || !newName || !newName.trim()) return;

    setItems((prev) =>
      prev.map((it) => (it.id === targetItem.id ? { ...it, name: newName.trim() } : it))
    );
    setRenameTarget(null);
    if (selectedItem?.id === targetItem.id) {
      setSelectedItem((prev) => (prev ? { ...prev, name: newName.trim() } : null));
    }
  }, [selectedItem]);

  const handleDelete = useCallback((item) => {
    if (!item) return;

    const idsToDelete = new Set([item.id]);
    if (item.type === 'folder') {
      const collectChildren = (parentId) => {
        items.filter((it) => it.parentId === parentId).forEach((child) => {
          idsToDelete.add(child.id);
          if (child.type === 'folder') collectChildren(child.id);
        });
      };
      collectChildren(item.id);
    }

    setItems((prev) => prev.filter((it) => !idsToDelete.has(it.id)));
    setSelectedItem((prev) => (prev?.id === item.id ? null : prev));
    setDeleteTarget(null);
  }, [items]);

  const handleMove = useCallback((targetItem, destFolderId) => {
    if (!targetItem) return;

    const targetId = destFolderId === 'root' ? null : destFolderId;
    if (targetId === targetItem.id) {
      alert("Tidak bisa memindahkan folder ke dalam dirinya sendiri!");
      return;
    }

    setItems((prev) =>
      prev.map((it) => (it.id === targetItem.id ? { ...it, parentId: targetId } : it))
    );
    setMoveTarget(null);
  }, []);

  const handleResetSimulation = useCallback(() => {
    const freshInitial = JSON.parse(JSON.stringify(INITIAL_FILES_DATA));
    setItems(freshInitial);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(freshInitial));
    }
    prevPassedMissionIdsRef.current = new Set();
    hasHydratedRef.current = true;
    setRecentCompletedMission(null);
    setCurrentFolderId(null);
    setSelectedItem(null);
    setSearchQuery('');
    setHistory([null]);
    setHistoryIndex(0);
  }, [storageKey]);

  // 9. Submit Simulation to Supabase
  const handleSubmitSimulation = useCallback(async () => {
    setIsSubmitting(true);
    const scoreVal = evalResult.totalScore;
    const detailLog = {
      evaluatedAt: new Date().toISOString(),
      score: scoreVal,
      passedCount: evalResult.passedCount,
      totalCount: evalResult.totalCount,
      percentage: evalResult.percentage,
      checklist: evalResult.checklist,
      treeSnapshot: items
    };

    try {
      if (student?.id) {
        let resolvedTaskId = dbTaskId;
        if (!resolvedTaskId || !isUUID(resolvedTaskId)) {
          const { data: tData } = await supabase
            .from('tugas_master')
            .select('id')
            .or('kode_tugas.eq.TUGAS-01-SIMULASI-FOLDER,tipe_tugas.eq.simulasi,urutan.eq.1')
            .limit(1)
            .maybeSingle();

          if (tData?.id && isUUID(tData.id)) {
            resolvedTaskId = tData.id;
            setDbTaskId(tData.id);
          } else {
            resolvedTaskId = CANONICAL_TUGAS_1_ID;
          }
        }

        const numStudentId = parseInt(student.id || student.siswa_id, 10);
        if (resolvedTaskId && numStudentId) {
          // Ambil skor sebelumnya jika ada untuk menghitung delta
          const { data: prevSub } = await supabase
            .from('tugas_pengumpulan')
            .select('skor')
            .eq('tugas_id', resolvedTaskId)
            .eq('siswa_id', numStudentId)
            .maybeSingle();

          const prevScore = prevSub?.skor || 0;
          const finalScoreToSave = Math.max(prevScore, scoreVal);

          // 1. Upsert ke tugas_pengumpulan
          const { error: upsertErr } = await supabase.from('tugas_pengumpulan').upsert(
            {
              tugas_id: resolvedTaskId,
              siswa_id: numStudentId,
              status: 'selesai',
              skor: finalScoreToSave,
              detail_jawaban: detailLog,
              submitted_at: new Date().toISOString(),
              catatan_guru: `Skor Praktik Simulasi Folder: ${scoreVal}/100 (${evalResult.passedCount}/${evalResult.totalCount} Misi Tuntas).`
            },
            { onConflict: 'tugas_id,siswa_id' }
          );

          if (upsertErr) {
            console.error("Gagal simpan ke tugas_pengumpulan:", upsertErr);
          } else {
            // 2. Catat penambahan poin ke point_logs & sinkronkan ke master_siswa
            const latestTotalPoints = await recordTaskPointLog({
              siswaId: numStudentId,
              currentScore: scoreVal,
              previousScore: prevScore,
              activityType: 'tugas',
              taskTitle: 'Tugas 1: Praktik Simulasi Folder'
            });

            if (latestTotalPoints !== null && latestTotalPoints !== undefined) {
              const updatedStudent = { ...student, total_points: latestTotalPoints };
              setStudent(updatedStudent);
              localStorage.setItem('user_siswa', JSON.stringify(updatedStudent));
              window.dispatchEvent(new Event('storage'));
            }
          }
        }

        setPreviousSubmission({
          status: 'selesai',
          skor: scoreVal,
          submitted_at: new Date().toISOString(),
          detail_jawaban: detailLog
        });
      }
    } catch (err) {
      console.warn("Simpan ke Supabase error:", err);
    }

    setIsSubmitting(false);
    setShowSuccessModal(true);
  }, [evalResult, items, student, dbTaskId]);

  return {
    // Session & User
    student,
    handleOpenLogin,
    previousSubmission,

    // File Explorer Core State
    items,
    currentFolderId,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    allFolders,
    currentItems,
    breadcrumbs,

    // History & Navigation
    historyIndex,
    historyLength: history.length,
    navigateToFolder,
    navigateBack,
    navigateForward,
    navigateUp,

    // Mission & Evaluation
    evalResult,
    showAllMissions,
    setShowAllMissions,
    activeCategoryFilter,
    setActiveCategoryFilter,
    isMissionDrawerOpen,
    setIsMissionDrawerOpen,
    recentCompletedMission,
    setRecentCompletedMission,

    // Actions & CRUD
    handleCreateFolder,
    handleCreateFile,
    handleRename,
    handleDelete,
    handleMove,
    handleResetSimulation,
    handleSubmitSimulation,

    // Modals
    showNewFolderModal,
    setShowNewFolderModal,
    showNewFileModal,
    setShowNewFileModal,
    renameTarget,
    setRenameTarget,
    moveTarget,
    setMoveTarget,
    deleteTarget,
    setDeleteTarget,
    targetMoveFolderId,
    setTargetMoveFolderId,
    showSuccessModal,
    setShowSuccessModal,
    isSubmitting
  };
}

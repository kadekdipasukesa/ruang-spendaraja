import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { triggerTop5PetasanCelebration } from '../../utils/petasanCelebration';

/**
 * Custom Hook untuk:
 * 1. Menghitung peringkat siswa di kelasnya secara akurat & realtime (dengan tie-breaker konsisten).
 * 2. Mengambil foto profil resmi langsung dari master_siswa (dengan realtime sync saat foto diubah).
 * 3. Menjalankan animasi petasan & kembang api spektakuler jika siswa masuk peringkat 5 besar.
 */
export function useClassRank(student, leaderboard = []) {
  const [studentPhoto, setStudentPhoto] = useState(student?.foto_profile || null);
  const [photoError, setPhotoError] = useState(false);
  const [livePoints, setLivePoints] = useState(Number(student?.total_points ?? 0));
  const [internalRankList, setInternalRankList] = useState([]);
  const [scoreTimestamps, setScoreTimestamps] = useState({});
  const [totalStudentsInClass, setTotalStudentsInClass] = useState(0);
  const [celebrationToast, setCelebrationToast] = useState(null);

  const hasTriggeredInitialPetasan = useRef(false);

  const studentId = student?.id || student?.ID;
  const rawClass = student?.Kelas || student?.KELAS || '';
  const studentName = student?.NAMA || student?.nama || '';
  const studentNisn = student?.NISN || '';
  const studentAbsen = student?.['No Absen'] || student?.no_absen || '';
  const studentTotalPoints = student?.total_points;

  // Normalisasi string kelas (misal: "Kelas 7.1" -> "7.1", "7.1" -> "7.1", "7A" -> "7A")
  const cleanClass = useCallback((cls) => {
    if (!cls) return '';
    return cls
      .toString()
      .replace(/^Kelas\s+/i, '')
      .trim()
      .toUpperCase();
  }, []);

  const studentClassClean = useMemo(() => cleanClass(rawClass), [cleanClass, rawClass]);

  // Sinkronisasi foto dan poin jika prop student berubah
  useEffect(() => {
    if (student?.foto_profile) {
      setStudentPhoto(student.foto_profile);
      setPhotoError(false);
    }
    if (student?.total_points !== undefined && student?.total_points !== null) {
      setLivePoints(Number(student.total_points));
    }
  }, [student?.foto_profile, student?.total_points]);

  // 1. Sinkronisasi Data Siswa (Foto & Poin) Langsung dari master_siswa
  useEffect(() => {
    if (!studentId) {
      setStudentPhoto(null);
      setLivePoints(0);
      return;
    }

    let isMounted = true;

    // Ambil data profil & poin paling segar dari master_siswa
    const fetchFreshProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('master_siswa')
          .select('id, foto_profile, total_points, "Kelas"')
          .eq('id', studentId)
          .maybeSingle();

        if (isMounted && data && !error) {
          if (data.foto_profile !== undefined) {
            setStudentPhoto(data.foto_profile || null);
            setPhotoError(false);
          }
          if (data.total_points !== undefined && data.total_points !== null) {
            setLivePoints(Number(data.total_points));
          }
        }
      } catch (err) {
        console.warn('Gagal sinkronisasi data master_siswa:', err);
      }
    };

    fetchFreshProfile();

    // Listener Realtime untuk update foto_profile atau total_points di master_siswa
    const channelId = `class_rank_student_${studentId}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'master_siswa',
          filter: `id=eq.${studentId}`
        },
        (payload) => {
          if (isMounted && payload.new) {
            if (payload.new.foto_profile !== undefined) {
              setStudentPhoto(payload.new.foto_profile || null);
              setPhotoError(false);
            }
            if (payload.new.total_points !== undefined) {
              setLivePoints(Number(payload.new.total_points));
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  // 2. Ambil Jumlah Total Siswa dalam Kelas ini dari master_siswa (untuk tampilan #{rank} / {total})
  useEffect(() => {
    if (!studentClassClean) return;
    let isMounted = true;

    const fetchClassTotalCount = async () => {
      try {
        const { count, error } = await supabase
          .from('master_siswa')
          .select('id', { count: 'exact', head: true })
          .ilike('Kelas', `%${studentClassClean}%`);

        if (isMounted && !error && count) {
          setTotalStudentsInClass(count);
        }
      } catch (err) {
        console.warn('Gagal mengambil jumlah siswa kelas:', err);
      }
    };

    fetchClassTotalCount();
    return () => {
      isMounted = false;
    };
  }, [studentClassClean]);

  // 3. Ambil data leaderboard per kelas jika belum dioper via props
  useEffect(() => {
    if (!studentClassClean || (leaderboard && leaderboard.length > 0)) {
      return;
    }

    let isMounted = true;
    const fetchClassLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('master_siswa')
          .select('id, "NAMA", "Kelas", "No Absen", "NISN", total_points, foto_profile')
          .gt('total_points', 0)
          .order('total_points', { ascending: false });

        if (isMounted && data && !error) {
          setInternalRankList(data);
        }
      } catch (err) {
        console.warn('Gagal ambil data rank kelas:', err);
      }
    };

    fetchClassLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [studentClassClean, leaderboard]);

  // 4. Ambil Score Timestamps dari point_logs untuk tie-breaker (siapa lebih dulu mencapai skor)
  useEffect(() => {
    let isMounted = true;
    const fetchTimestamps = async () => {
      try {
        const { data, error } = await supabase
          .from('point_logs')
          .select('siswa_id, created_at')
          .order('created_at', { ascending: true })
          .limit(1000);

        if (isMounted && data && !error) {
          const tMap = {};
          data.forEach((log) => {
            if (!log.siswa_id) return;
            const time = new Date(log.created_at).getTime();
            // Catat waktu pertama kali atau perolehan akumulatif
            if (!tMap[log.siswa_id] || time > tMap[log.siswa_id]) {
              tMap[log.siswa_id] = time;
            }
          });
          setScoreTimestamps(tMap);
        }
      } catch (e) {
        // ignore
      }
    };

    fetchTimestamps();
    return () => {
      isMounted = false;
    };
  }, []);

  // 5. Kalkulasi Peringkat Siswa di Kelasnya
  const rankInfo = useMemo(() => {
    const effectivePoints = Math.max(livePoints, Number(student?.total_points ?? 0));

    if (!studentId || !studentClassClean || effectivePoints <= 0) {
      return {
        rank: null,
        totalInClass: totalStudentsInClass || 0,
        isTop5: false,
        topStudents: []
      };
    }

    const rawSource = (leaderboard && leaderboard.length > 0) ? [...leaderboard] : [...internalRankList];

    // Pastikan siswa saat ini ada dalam daftar dengan poin paling mutakhir
    const meIndexInSource = rawSource.findIndex(
      (item) => Number(item.id) === Number(studentId) || (item.NISN && item.NISN === student?.NISN)
    );

    if (meIndexInSource >= 0) {
      rawSource[meIndexInSource] = {
        ...rawSource[meIndexInSource],
        total_points: effectivePoints,
        foto_profile: studentPhoto || rawSource[meIndexInSource].foto_profile
      };
    } else {
      rawSource.push({
        id: studentId,
        NAMA: student?.NAMA || student?.nama,
        Kelas: student?.Kelas || student?.KELAS,
        'No Absen': student?.['No Absen'] || student?.no_absen,
        NISN: student?.NISN,
        total_points: effectivePoints,
        foto_profile: studentPhoto
      });
    }

    // Filter siswa di kelas yang sama dengan total_points > 0
    const classList = rawSource
      .filter((item) => {
        const itemPts = Number(item.total_points) || 0;
        if (itemPts <= 0) return false;
        return cleanClass(item.Kelas || item.KELAS) === studentClassClean;
      })
      .sort((a, b) => {
        const ptsA = Number(a.total_points) || 0;
        const ptsB = Number(b.total_points) || 0;

        // 1. Poin tertinggi di posisi teratas
        if (ptsB !== ptsA) {
          return ptsB - ptsA;
        }

        // 2. Tie-breaker: waktu perolehan skor lebih awal di peringkat atas
        const timeA = scoreTimestamps[a.id] || Infinity;
        const timeB = scoreTimestamps[b.id] || Infinity;
        if (timeA !== timeB) {
          return timeA - timeB;
        }

        // 3. Tie-breaker terakhir: alfabetis nama
        return (a.NAMA || '').localeCompare(b.NAMA || '');
      });

    // Cari posisi siswa saat ini
    const myIndex = classList.findIndex(
      (item) => Number(item.id) === Number(studentId) || (item.NISN && item.NISN === student?.NISN)
    );

    const rank = myIndex !== -1 ? myIndex + 1 : null;
    const isTop5 = rank !== null && rank <= 5;
    const resolvedTotal = totalStudentsInClass > 0 ? totalStudentsInClass : classList.length;

    return {
      rank,
      totalInClass: resolvedTotal,
      isTop5,
      topStudents: classList.slice(0, 5)
    };
  }, [
    studentId,
    studentClassClean,
    livePoints,
    studentTotalPoints,
    studentNisn,
    studentName,
    studentAbsen,
    studentPhoto,
    leaderboard,
    internalRankList,
    totalStudentsInClass,
    scoreTimestamps,
    cleanClass
  ]);

  // 6. Fungsi Pemicu Animasi Petasan & Selebrasi
  const triggerCelebrationPetasan = useCallback(() => {
    triggerTop5PetasanCelebration();
    if (rankInfo.rank) {
      setCelebrationToast(`🎉 Selamat! Kamu menempati Peringkat #${rankInfo.rank} di Kelas ${studentClassClean}! 👑`);
      setTimeout(() => {
        setCelebrationToast(null);
      }, 4000);
    }
  }, [rankInfo.rank, studentClassClean]);

  // 7. Otomatis nyalakan petasan selebrasi saat siswa pertama kali terdeteksi berada di 5 Besar
  useEffect(() => {
    if (rankInfo.isTop5 && !hasTriggeredInitialPetasan.current) {
      hasTriggeredInitialPetasan.current = true;
      const timer = setTimeout(() => {
        triggerCelebrationPetasan();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [rankInfo.isTop5, triggerCelebrationPetasan]);

  return {
    studentPhoto,
    photoError,
    setPhotoError,
    rank: rankInfo.rank,
    totalInClass: rankInfo.totalInClass,
    isTop5: rankInfo.isTop5,
    livePoints,
    celebrationToast,
    triggerCelebrationPetasan,
    studentClassClean
  };
}

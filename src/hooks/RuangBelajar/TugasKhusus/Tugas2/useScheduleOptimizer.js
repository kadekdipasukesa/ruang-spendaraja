import { useState, useEffect } from 'react';
import { BookOpen, Shirt, FileCode, Utensils, Sparkles } from 'lucide-react';
import { soundEffects } from '../../../../utils/gameAudio';
import { triggerConfetti } from '../../../../utils/confettiHelper';

export const INITIAL_SCHEDULE_TASKS = [
  {
    id: 't1',
    name: 'Belajar Mandiri Informatika',
    duration: 2,
    category: 'Fokus',
    canBeParallel: false,
    icon: FileCode,
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/50',
    bgLight: 'bg-blue-500/10 text-blue-300',
    desc: 'Mempelajari modul Bab 1 Informatika (membutuhkan fokus penuh).',
  },
  {
    id: 't2',
    name: 'Mencuci Baju di Mesin Cuci',
    duration: 2,
    category: 'Otomatis',
    canBeParallel: true,
    icon: Shirt,
    color: 'from-cyan-600 to-teal-600',
    borderColor: 'border-cyan-500/50',
    bgLight: 'bg-cyan-500/10 text-cyan-300',
    desc: 'Mesin cuci berputar sendiri secara otomatis selama 2 jam.',
  },
  {
    id: 't3',
    name: 'Membaca Buku & Rangkuman',
    duration: 1,
    category: 'Paralel',
    parallelWith: 't2',
    icon: BookOpen,
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/50',
    bgLight: 'bg-amber-500/10 text-amber-300',
    desc: 'Bisa dibaca sambil menunggu mesin cuci selesai berputar!',
  },
  {
    id: 't4',
    name: 'Makan Siang & Istirahat',
    duration: 1,
    category: 'Istirahat',
    canBeParallel: false,
    icon: Utensils,
    color: 'from-emerald-600 to-green-600',
    borderColor: 'border-emerald-500/50',
    bgLight: 'bg-emerald-500/10 text-emerald-300',
    desc: 'Makan siang dan menyegarkan pikiran selama 1 jam.',
  },
  {
    id: 't5',
    name: 'Mengerjakan Latihan Soal',
    duration: 1,
    category: 'Evaluasi',
    canBeParallel: false,
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/50',
    bgLight: 'bg-purple-500/10 text-purple-300',
    desc: 'Latihan soal berpikir komputasional di ruang belajar.',
  },
];

export const SCHEDULE_SLOTS = [
  { hour: '07:00 - 08:00', start: '07:00', end: '08:00', idx: 0 },
  { hour: '08:00 - 09:00', start: '08:00', end: '09:00', idx: 1 },
  { hour: '09:00 - 10:00', start: '09:00', end: '10:00', idx: 2 },
  { hour: '10:00 - 11:00', start: '10:00', end: '11:00', idx: 3 },
  { hour: '11:00 - 12:00', start: '11:00', end: '12:00', idx: 4 },
  { hour: '12:00 - 13:00', start: '12:00', end: '13:00', idx: 5 },
];

export function useScheduleOptimizer({ onComplete, currentScore = 0 }) {
  const [schedule, setSchedule] = useState(
    Array(SCHEDULE_SLOTS.length).fill(null).map(() => ({ primary: null, parallel: null }))
  );
  const [placedTaskIds, setPlacedTaskIds] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoverSlotIdx, setHoverSlotIdx] = useState(null);
  const [hoverType, setHoverType] = useState('primary'); // 'primary' | 'parallel'
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(currentScore >= 10);

  useEffect(() => {
    if (currentScore >= 10) {
      setIsSuccess(true);
    }
  }, [currentScore]);

  const handleSelectTask = (task) => {
    if (placedTaskIds.includes(task.id)) return;
    soundEffects.playStep();
    if (selectedTask?.id === task.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
      if (task.id === 't3') {
        setMessage('💡 Tips: Pasang "Membaca Buku" ke kolom [Aktivitas Paralel] pada jam saat Mesin Cuci sedang berjalan!');
      } else {
        setMessage(`Pilih slot jam di kolom [Jalur Utama] untuk memasang "${task.name}" (${task.duration} Jam).`);
      }
    }
  };

  const removeTask = (taskId) => {
    soundEffects.playStep();
    const newSchedule = schedule.map((slot) => {
      const primary = slot.primary?.id === taskId ? null : slot.primary;
      const parallel = slot.parallel?.id === taskId ? null : slot.parallel;
      return { primary, parallel };
    });

    setSchedule(newSchedule);
    setPlacedTaskIds((prev) => prev.filter((id) => id !== taskId));
    setIsSuccess(false);
    setMessage(`Aktivitas berhasil dilepas dari jadwal. Silakan pasang kembali.`);
  };

  const placeTaskInSlot = (slotIdx, isParallel = false) => {
    if (!selectedTask) return;
    const task = selectedTask;

    // Cek batas slot
    if (slotIdx + task.duration > SCHEDULE_SLOTS.length) {
      soundEffects.playFail();
      setMessage(`⚠️ Slot waktu tidak cukup! Durasi "${task.name}" butuh ${task.duration} jam, tetapi waktu berakhir pada jam 13:00.`);
      return;
    }

    // Validasi tabrakan
    for (let i = slotIdx; i < slotIdx + task.duration; i++) {
      if (!isParallel) {
        if (schedule[i].primary) {
          soundEffects.playFail();
          setMessage(`⚠️ Jam ${SCHEDULE_SLOTS[i].hour} sudah terisi aktivitas utama: "${schedule[i].primary.name}".`);
          return;
        }
      } else {
        if (schedule[i].parallel) {
          soundEffects.playFail();
          setMessage(`⚠️ Jam ${SCHEDULE_SLOTS[i].hour} sudah terisi aktivitas paralel lain!`);
          return;
        }
        if (!schedule[i].primary || schedule[i].primary.id !== 't2') {
          soundEffects.playFail();
          setMessage(`⚠️ Aktivitas membaca buku hanya bisa dilakukan bersamaan saat "Mencuci Baju di Mesin Cuci" sedang berlangsung di slot tersebut.`);
          return;
        }
      }
    }

    soundEffects.playStep();

    // Update schedule
    const newSchedule = schedule.map((slot, idx) => {
      if (idx >= slotIdx && idx < slotIdx + task.duration) {
        return isParallel
          ? { ...slot, parallel: task }
          : { ...slot, primary: task };
      }
      return slot;
    });

    const updatedPlaced = [...placedTaskIds, task.id];
    setSchedule(newSchedule);
    setPlacedTaskIds(updatedPlaced);
    setSelectedTask(null);
    setHoverSlotIdx(null);

    // Evaluasi jika semua terpasang
    if (updatedPlaced.length >= INITIAL_SCHEDULE_TASKS.length) {
      const hasParallelOptimal = newSchedule.some(
        (s) => s.primary?.id === 't2' && s.parallel?.id === 't3'
      );
      if (hasParallelOptimal) {
        setIsSuccess(true);
        soundEffects.playSuccess();
        triggerConfetti();
        setMessage('🎉 LUAR BIASA! Kamu berhasil menyusun jadwal optimal dengan teknik paralel multitasking (selesai sebelum 13:00)! Misi Selesai (10 Poin).');
        if (onComplete) onComplete('m2', 10);
      } else {
        soundEffects.playFail();
        setMessage('⚠️ Seluruh aktivitas telah terpasang, namun optimasi paralel belum tepat (6 Poin). Pasang membaca di jalur paralel mesin cuci agar mendapat 10 Poin penuh!');
        if (onComplete) onComplete('m2', 6);
      }
    } else {
      const partialScore = Math.round((updatedPlaced.length / INITIAL_SCHEDULE_TASKS.length) * 5);
      if (onComplete && partialScore > 0) onComplete('m2', partialScore);
      setMessage(`✅ Berhasil menjadwalkan "${task.name}". Sisa ${INITIAL_SCHEDULE_TASKS.length - updatedPlaced.length} aktivitas lagi.`);
    }
  };

  const resetSchedule = () => {
    soundEffects.playStep();
    setSchedule(Array(SCHEDULE_SLOTS.length).fill(null).map(() => ({ primary: null, parallel: null })));
    setPlacedTaskIds([]);
    setSelectedTask(null);
    setHoverSlotIdx(null);
    setMessage('Jadwal telah direset. Silakan susun kembali dari awal.');
    setIsSuccess(false);
  };

  return {
    tasks: INITIAL_SCHEDULE_TASKS,
    slots: SCHEDULE_SLOTS,
    schedule,
    placedTaskIds,
    selectedTask,
    hoverSlotIdx,
    hoverType,
    setHoverSlotIdx,
    setHoverType,
    message,
    isSuccess,
    handleSelectTask,
    placeTaskInSlot,
    removeTask,
    resetSchedule,
  };
}


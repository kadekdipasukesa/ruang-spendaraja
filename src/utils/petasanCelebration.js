import confetti from 'canvas-confetti';
import { soundEffects } from './gameAudio';
import { playMissionSuccessSound } from './missionCelebration';

/**
 * Memicu rangkaian animasi petasan & kembang api (fireworks) spektakuler
 * dengan efek suara Web Audio API saat siswa berhasil meraih peringkat 5 besar di kelasnya.
 */
export function triggerTop5PetasanCelebration() {
  try {
    // 1. Dentuman Petasan Pertama (Sisi Kiri Atas)
    soundEffects.playCelebrationFirework();
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 75,
      origin: { x: 0.15, y: 0.45 },
      colors: ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#3b82f6'],
      ticks: 240,
      gravity: 0.9,
      scalar: 1.15
    });

    // 2. Dentuman Petasan Kedua (Sisi Kanan Atas)
    setTimeout(() => {
      try {
        soundEffects.playCelebrationFirework();
        confetti({
          particleCount: 55,
          angle: 120,
          spread: 75,
          origin: { x: 0.85, y: 0.45 },
          colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981'],
          ticks: 240,
          gravity: 0.9,
          scalar: 1.15
        });
      } catch (e) {
        // ignore
      }
    }, 180);

    // 3. Kembang Api Utama & Nada Kemenangan (Tengah Layar)
    setTimeout(() => {
      try {
        playMissionSuccessSound();
        confetti({
          particleCount: 85,
          spread: 100,
          origin: { x: 0.5, y: 0.35 },
          colors: ['#ffd700', '#f59e0b', '#fbbf24', '#ef4444', '#8b5cf6', '#3b82f6'],
          shapes: ['circle', 'star'],
          ticks: 280,
          gravity: 0.8,
          scalar: 1.3
        });
      } catch (e) {
        // ignore
      }
    }, 380);

    // 4. Taburan Kilauan Emas (Golden Shower Cascade)
    setTimeout(() => {
      try {
        confetti({
          particleCount: 60,
          spread: 120,
          origin: { x: 0.5, y: 0.25 },
          colors: ['#ffd700', '#ffa500', '#fff8dc', '#fef08a'],
          ticks: 320,
          gravity: 0.7,
          scalar: 1.25,
          shapes: ['circle']
        });
      } catch (e) {
        // ignore
      }
    }, 620);
  } catch (err) {
    console.warn('Gagal memainkan animasi petasan:', err);
  }
}

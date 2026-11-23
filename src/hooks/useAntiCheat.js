import { useEffect, useRef } from 'react';

/**
 * Hook Anti-Cheat Komprehensif Ruang Spendaraja
 * Menutup celah:
 * 1. Buka jendela lain / Alt+Tab di Windows (Smart Blur & Focus Tracker dengan toleransi 1 detik / 1000ms)
 * 2. Layar Belah (Split Screen) di Android (Rasio tinggi viewport terhadap screen fisik < 65%)
 * 3. Beralih tab browser (document.visibilityState === 'hidden')
 * 4. Keluar mode layar penuh (document.fullscreenElement === null)
 *
 * @param {Object} options
 * @param {boolean} options.enabled - Status apakah pengawasan aktif
 * @param {boolean} options.isPaused - Jangan trigger jika sedang dijeda (misal dialog jeda sedang terbuka)
 * @param {boolean} options.isBlocked - Jangan trigger jika sudah terblokir
 * @param {function} options.onViolation - Callback saat pelanggaran terdeteksi: (reason: 'window_blur'|'split_screen'|'tab_hidden'|'fullscreen_exit') => void
 * @param {number} options.blurGracePeriodMs - Jeda toleransi hilang fokus (default: 1000ms / 1 detik)
 * @param {number} options.cooldownMs - Jeda debounce anti-spam trigger (default: 1500ms)
 */
export function useAntiCheat({
  enabled = true,
  isPaused = false,
  isBlocked = false,
  onViolation,
  blurGracePeriodMs = 1000, // 1 detik toleransi sesuai keputusan pengawas
  cooldownMs = 1500,
} = {}) {
  const blurTimerRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    if (!enabled || isPaused || isBlocked) {
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
      return;
    }

    // Trigger pelanggaran terproteksi debounce cooldown
    const triggerViolation = (reason) => {
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, cooldownMs);

      if (onViolation) {
        onViolation(reason);
      }
    };

    // 1. Deteksi Beralih Tab Browser
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('tab_hidden');
      }
    };

    // 2. Deteksi Keluar Layar Penuh (Fullscreen Exit)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerViolation('fullscreen_exit');
      }
    };

    // 3. Deteksi Buka Jendela Lain di Windows (Smart Blur dengan Grace Period 1 Detik)
    // CATATAN PENTING: Saat siswa diam membaca soal, blur TIDAK PERNAH terpanggil!
    // Blur hanya dipicu jika fokus OS Windows benar-benar berpindah ke jendela/aplikasi lain.
    const handleWindowBlur = () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);

      blurTimerRef.current = setTimeout(() => {
        // Jika setelah 1 detik dokumen tetap tidak memiliki fokus Windows
        if (!document.hasFocus() && document.activeElement?.tagName !== 'IFRAME') {
          triggerViolation('window_blur');
        }
      }, blurGracePeriodMs);
    };

    const handleWindowFocus = () => {
      // Jika fokus kembali sebelum 1 detik (misal dialog browser sesaat), batalkan timer
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
    };

    // 4. Deteksi Layar Belah (Split Screen) di Android / Tablet
    const checkSplitScreen = () => {
      const isTouchOrMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouchOrMobile) return;

      const screenH = window.screen.height || window.screen.availHeight;
      if (!screenH || screenH <= 0) return;

      // Rasio tinggi area tampilan terhadap tinggi layar fisik
      const ratio = window.innerHeight / screenH;

      // Pada soal pilihan ganda, tidak ada keyboard virtual aktif
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      // Jika rasio tinggi menyusut < 65% di perangkat mobile, pasti Split Screen
      if (!isInput && ratio < 0.65) {
        triggerViolation('split_screen');
      }
    };

    const handleResize = () => {
      checkSplitScreen();
    };

    // Pasang listeners sistem
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('resize', handleResize);

    // Heartbeat berkala per 1.5 detik sebagai pengawas lapis ganda
    const heartbeatInterval = setInterval(() => {
      if (!document.hasFocus()) {
        triggerViolation('window_blur');
      } else {
        checkSplitScreen();
      }
    }, 1500);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('resize', handleResize);
      clearInterval(heartbeatInterval);
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
    };
  }, [enabled, isPaused, isBlocked, onViolation, blurGracePeriodMs, cooldownMs]);
}

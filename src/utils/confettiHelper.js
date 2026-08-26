import confetti from 'canvas-confetti';

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6'],
    });
  } catch {
    // Fallback if canvas-confetti fails
  }
}

export function triggerGrandConfetti() {
  try {
    const end = Date.now() + 1500;
    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Fallback
  }
}

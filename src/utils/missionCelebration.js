import confetti from 'canvas-confetti';

/**
 * Web Audio API synthesized celebration sound effect
 * (Arpeggio chime + harmonic sparkle)
 */
export function playMissionSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Cheerful ascending arpeggio notes (F5 -> A5 -> C6 -> E6 -> G6)
    const notes = [698.46, 880.00, 1046.50, 1318.51, 1567.98];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      // Volume envelope
      gain.gain.setValueAtTime(0.001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.5);
    });

    // Add a gentle sparkle shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(2093.00, now + 0.35); // C7 note
    shimmerGain.gain.setValueAtTime(0.001, now + 0.35);
    shimmerGain.gain.exponentialRampToValueAtTime(0.12, now + 0.37);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmerOsc.start(now + 0.35);
    shimmerOsc.stop(now + 0.95);
  } catch (err) {
    console.warn('Audio celebration error:', err);
  }
}

/**
 * Animasi Petasan / Fireworks Confetti Effect
 */
export function triggerMissionFireworkAnimation() {
  try {
    // 1. Burst from left side (near mission floating panel)
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.05, y: 0.45 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1
    });

    // 2. Burst from center-left with sparkling stars
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { x: 0.25, y: 0.4 },
        colors: ['#fbbf24', '#34d399', '#818cf8', '#f43f5e', '#a855f7'],
        shapes: ['circle', 'square'],
        ticks: 220,
        gravity: 0.85,
        scalar: 1.2
      });
    }, 120);

    // 3. Mini fountain firework pop
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 90,
        spread: 45,
        origin: { x: 0.15, y: 0.55 },
        colors: ['#10b981', '#6366f1', '#fbbf24'],
        ticks: 180,
        gravity: 1,
        scalar: 0.9
      });
    }, 250);
  } catch (err) {
    console.warn('Confetti animation error:', err);
  }
}

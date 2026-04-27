export function useAudioQuiz() {
    const playBeep = (freq, len) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.start();
        osc.stop(audioCtx.currentTime + len);
      } catch (e) {
        console.error("Audio not supported");
      }
    };
  
    return { playBeep };
  }
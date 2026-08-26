import { useState, useCallback, useMemo } from 'react';

// Level 1: Grid 4x4 (Pemula) - 15 Poin
export const LEVEL_1_GRID = [
  ['S', 0, 1, 0],
  [1, 0, 1, 0],
  [0, 0, 0, 0],
  [0, 1, 0, 'F'],
];

// Level 2: Grid 5x5 (Menengah) - 15 Poin
export const LEVEL_2_GRID = [
  ['S', 0, 0, 1, 0],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 'F'],
];

// Level 3: Grid 10x10 (Ahli) - 20 Poin
export const LEVEL_3_GRID = [
  ['S', 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 1, 0, 0, 0, 1, 0, 0, 0, 'F'],
];

// Helper kalkulasi BFS shortest path otomatis
export function calculateShortestPath(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let start = null;
  let finish = null;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'S') start = { r, c };
      if (grid[r][c] === 'F') finish = { r, c };
    }
  }
  if (!start || !finish) return 8;

  const queue = [{ r: start.r, c: start.c, dist: 0 }];
  const visited = new Set([`${start.r},${start.c}`]);

  while (queue.length > 0) {
    const { r, c, dist } = queue.shift();
    if (r === finish.r && c === finish.c) return dist;

    const dirs = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];

    for (const d of dirs) {
      const nr = r + d.r;
      const nc = c + d.c;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] !== 1 &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push({ r: nr, c: nc, dist: dist + 1 });
      }
    }
  }
  return 8;
}

export const LEVEL_CONFIG = {
  1: {
    name: 'Level 1: Pemula',
    size: '4x4',
    grid: LEVEL_1_GRID,
    maxPoints: 15,
    optimalSteps: calculateShortestPath(LEVEL_1_GRID),
    description: 'Labirin dasar 4x4 untuk memahami instruksi gerak robot.'
  },
  2: {
    name: 'Level 2: Menengah',
    size: '5x5',
    grid: LEVEL_2_GRID,
    maxPoints: 15,
    optimalSteps: calculateShortestPath(LEVEL_2_GRID),
    description: 'Labirin 5x5 dengan dinding bata bertingkat.'
  },
  3: {
    name: 'Level 3: Ahli',
    size: '10x10',
    grid: LEVEL_3_GRID,
    maxPoints: 20,
    optimalSteps: calculateShortestPath(LEVEL_3_GRID),
    description: 'Arena 10x10 dengan jalur berlika-liku penuh tantangan.'
  },
};

export const OPTIMAL_STEPS = LEVEL_CONFIG[2].optimalSteps;

export function useAlgorithmMaze({ onComplete, currentScore = 0 }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelScores, setLevelScores] = useState(() => {
    if (currentScore >= 50) return { 1: 15, 2: 15, 3: 20 };
    if (currentScore >= 30) return { 1: 15, 2: 15, 3: 0 };
    if (currentScore >= 15) return { 1: 15, 2: 0, 3: 0 };
    return { 1: 0, 2: 0, 3: 0 };
  });

  const [commands, setCommands] = useState([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'success', 'failed', 'suboptimal'
  const [activeStep, setActiveStep] = useState(-1);
  const [message, setMessage] = useState('');

  const activeGrid = useMemo(() => LEVEL_CONFIG[currentLevel].grid, [currentLevel]);
  const activeOptimalSteps = useMemo(() => LEVEL_CONFIG[currentLevel].optimalSteps, [currentLevel]);
  const activeMaxPoints = useMemo(() => LEVEL_CONFIG[currentLevel].maxPoints, [currentLevel]);

  // Total score across all 3 levels (Max: 15 + 15 + 20 = 50 Poin)
  const totalM1Score = (levelScores[1] || 0) + (levelScores[2] || 0) + (levelScores[3] || 0);

  // Switch Level
  const selectLevel = useCallback((lvl) => {
    if (isRunning) return;
    setCurrentLevel(lvl);
    setPlayerPos({ r: 0, c: 0 });
    setCommands([]);
    setStatus(levelScores[lvl] > 0 ? 'success' : 'idle');
    setActiveStep(-1);
    setMessage('');
  }, [isRunning, levelScores]);

  // Reset robot ke start
  const resetPlayer = useCallback(() => {
    setPlayerPos({ r: 0, c: 0 });
    setIsRunning(false);
    setStatus(levelScores[currentLevel] > 0 ? 'success' : 'idle');
    setActiveStep(-1);
    setMessage('');
  }, [currentLevel, levelScores]);

  const addCommand = useCallback((dir) => {
    if (isRunning) return;
    const maxCmd = currentLevel === 3 ? 35 : 18;
    setCommands((prev) => (prev.length < maxCmd ? [...prev, dir] : prev));
  }, [isRunning, currentLevel]);

  const removeCommand = useCallback((idx) => {
    if (isRunning) return;
    setCommands((prev) => prev.filter((_, i) => i !== idx));
  }, [isRunning]);

  const clearCommands = useCallback(() => {
    if (isRunning) return;
    setCommands([]);
    resetPlayer();
  }, [isRunning, resetPlayer]);

  const runAlgorithm = async () => {
    if (commands.length === 0 || isRunning) return;

    resetPlayer();
    setIsRunning(true);
    setStatus('running');
    setMessage('Robot sedang bergerak mengeksekusi instruksi algoritma...');

    let curR = 0;
    let curC = 0;
    const rows = activeGrid.length;
    const cols = activeGrid[0].length;
    const stepDelay = currentLevel === 3 ? 200 : 350;

    for (let i = 0; i < commands.length; i++) {
      setActiveStep(i);
      const cmd = commands[i];

      if (cmd === 'UP') curR -= 1;
      else if (cmd === 'DOWN') curR += 1;
      else if (cmd === 'LEFT') curC -= 1;
      else if (cmd === 'RIGHT') curC += 1;

      // Tunggu animasi langkah
      await new Promise((r) => setTimeout(r, stepDelay));

      // Cek tabrakan batas luar
      if (curR < 0 || curR >= rows || curC < 0 || curC >= cols) {
        setIsRunning(false);
        setStatus('failed');
        setMessage('💥 Robot keluar dari area lintasan labirin! Perbaiki urutan instruksimu.');
        return;
      }

      // Cek rintangan tembok
      if (activeGrid[curR][curC] === 1) {
        setPlayerPos({ r: curR, c: curC });
        setIsRunning(false);
        setStatus('failed');
        setMessage('💥 Robot menabrak dinding tembok! Periksa kembali jalur algoritma agar tidak menabrak rintangan.');
        return;
      }

      // Update posisi robot
      setPlayerPos({ r: curR, c: curC });

      // Cek apakah sampai tujuan Finish
      if (activeGrid[curR][curC] === 'F') {
        const totalSteps = i + 1;
        setIsRunning(false);

        let earned = activeMaxPoints;
        if (totalSteps === activeOptimalSteps && commands.length === activeOptimalSteps) {
          earned = activeMaxPoints;
          setStatus('success');
          setMessage(`🎉 LUAR BIASA! Robot berhasil menemukan JALUR TERCEPAT & PALING EFISIEN (${activeOptimalSteps} langkah)! (+${earned} Poin).`);
        } else if (commands.length > activeOptimalSteps) {
          earned = Math.max(5, activeMaxPoints - 5);
          setStatus('suboptimal');
          setMessage(`⚠️ Robot sampai di FINISH dengan ${commands.length} langkah (+${earned} Poin). Jalur tercepat membutuhkan tepat ${activeOptimalSteps} langkah untuk poin penuh (+${activeMaxPoints})!`);
        } else {
          earned = activeMaxPoints;
          setStatus('success');
          setMessage(`🎉 Robot berhasil mencapai FINISH! (${totalSteps} langkah).`);
        }

        const updatedScores = {
          ...levelScores,
          [currentLevel]: Math.max(levelScores[currentLevel] || 0, earned)
        };
        setLevelScores(updatedScores);

        const newTotal = (updatedScores[1] || 0) + (updatedScores[2] || 0) + (updatedScores[3] || 0);
        if (onComplete) onComplete('m1', newTotal);
        return;
      }
    }

    setIsRunning(false);
    setStatus('failed');
    setMessage('⚠️ Instruksi habis namun robot belum mencapai bendera FINISH. Tambahkan langkah yang tepat!');
  };

  return {
    currentLevel,
    selectLevel,
    levelScores,
    totalM1Score,
    activeGrid,
    optimalSteps: activeOptimalSteps,
    maxPoints: activeMaxPoints,
    commands,
    playerPos,
    isRunning,
    status,
    activeStep,
    message,
    addCommand,
    removeCommand,
    clearCommands,
    runAlgorithm,
    resetPlayer,
  };
}

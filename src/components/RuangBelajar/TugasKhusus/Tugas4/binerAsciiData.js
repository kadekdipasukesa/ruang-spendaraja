// Data Karakter ASCII Printable (Desimal 33 sampai 126)
// Memenuhi rentang printable standar tanpa whitespace / spasi (32) dan DEL (127)

export const ASCII_PRINTABLE_LIST = [];
for (let code = 33; code <= 126; code++) {
  const char = String.fromCharCode(code);
  let category = 'Simbol';
  if (code >= 48 && code <= 57) category = 'Angka (0-9)';
  else if (code >= 65 && code <= 90) category = 'Huruf Besar (A-Z)';
  else if (code >= 97 && code <= 122) category = 'Huruf Kecil (a-z)';

  ASCII_PRINTABLE_LIST.push({
    code,
    char,
    biner: code.toString(2).padStart(8, '0'),
    category
  });
}

// Map cepat berdasarkan kode desimal
export const ASCII_MAP_BY_CODE = new Map(
  ASCII_PRINTABLE_LIST.map((item) => [item.code, item])
);

// Map cepat berdasarkan karakter
export const ASCII_MAP_BY_CHAR = new Map(
  ASCII_PRINTABLE_LIST.map((item) => [item.char, item])
);

// Helper konversi desimal ke 8-bit biner
export const desimalToBiner8Bit = (num) => {
  return Number(num).toString(2).padStart(8, '0');
};

// Helper konversi biner ke desimal
export const binerToDesimal = (binStr) => {
  if (!binStr || typeof binStr !== 'string') return NaN;
  const clean = binStr.trim().replace(/^0+/, '');
  if (clean === '') return 0;
  return parseInt(clean, 2);
};

// Algoritma Pengacak 15 Soal Unik Tanpa Kembar (Fisher-Yates Shuffle pada rentang 33-126)
export const generate15UniqueQuestions = () => {
  // Pool angka 33 sampai 126 (total 94 angka unik)
  const pool = [];
  for (let i = 33; i <= 126; i++) {
    pool.push(i);
  }

  // Acak pool dengan algoritma Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Ambil 15 angka unik terdepan
  const selectedNumbers = pool.slice(0, 15);

  // Tahap 2: 5 Soal Desimal ke Biner (Indeks 0 - 4) - Bobot 3 poin/soal (Total 15 pt)
  const stage2 = selectedNumbers.slice(0, 5).map((num, idx) => {
    const item = ASCII_MAP_BY_CODE.get(num) || { code: num, char: String.fromCharCode(num), biner: desimalToBiner8Bit(num) };
    return {
      id: `s2_q${idx + 1}`,
      questionNumber: idx + 1,
      desimal: num,
      char: item.char,
      targetBiner: item.biner,
      userAnswer: '',
      isCorrect: false,
      attempts: 0,
      maxPoints: 3,
      earnedPoints: 0,
      feedback: ''
    };
  });

  // Tahap 3: 5 Soal Biner ke Desimal (Indeks 5 - 9) - Bobot 3 poin/soal (Total 15 pt)
  const stage3 = selectedNumbers.slice(5, 10).map((num, idx) => {
    const item = ASCII_MAP_BY_CODE.get(num) || { code: num, char: String.fromCharCode(num), biner: desimalToBiner8Bit(num) };
    return {
      id: `s3_q${idx + 1}`,
      questionNumber: idx + 1,
      desimal: num,
      char: item.char,
      givenBiner: item.biner,
      userAnswer: '',
      isCorrect: false,
      attempts: 0,
      maxPoints: 3,
      earnedPoints: 0,
      feedback: ''
    };
  });

  // Tahap 4: 5 Soal Karakter ASCII ke Biner (Indeks 10 - 14) - Bobot 4 poin/soal (Total 20 pt)
  const stage4 = selectedNumbers.slice(10, 15).map((num, idx) => {
    const item = ASCII_MAP_BY_CODE.get(num) || { code: num, char: String.fromCharCode(num), biner: desimalToBiner8Bit(num) };
    return {
      id: `s4_q${idx + 1}`,
      questionNumber: idx + 1,
      desimal: num,
      char: item.char,
      category: item.category,
      targetBiner: item.biner,
      userAnswer: '',
      isCorrect: false,
      attempts: 0,
      maxPoints: 4,
      earnedPoints: 0,
      feedback: ''
    };
  });

  return { stage2, stage3, stage4 };
};

// Hitung Poin Berdasarkan Percobaan (Skor Bertingkat)
export const calculatePointsForAttempt = (maxPoints, attemptNumber) => {
  if (maxPoints === 3) {
    if (attemptNumber <= 1) return 3;
    if (attemptNumber === 2) return 2;
    return 1; // Percobaan 3 dst tetap diberi apresiasi 1 pt
  }
  if (maxPoints === 4) {
    if (attemptNumber <= 1) return 4;
    if (attemptNumber === 2) return 3;
    if (attemptNumber === 3) return 2;
    return 1;
  }
  return 1;
};

// Daftar Bobot 8-Bit
export const BIT_WEIGHTS_8 = [128, 64, 32, 16, 8, 4, 2, 1];

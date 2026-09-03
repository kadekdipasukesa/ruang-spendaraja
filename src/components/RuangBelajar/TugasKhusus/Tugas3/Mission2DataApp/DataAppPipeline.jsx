import { useState, useEffect, useRef } from 'react';
import {
  Database,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  Layers,
  FileText,
  Check,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  ShoppingCart,
  GraduationCap,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

const PIPELINE_CASES = [
  {
    id: 'case_school',
    icon: GraduationCap,
    title: 'Kasus 1: Pengolahan Nilai & Rapor Sekolah',
    description: 'Sekolah mengolah data mentah kumpulan nilai tugas, ulangan harian, dan absensi kehadiran siswa menjadi lembar rapor resmi semester.',
    correctInput: 'Daftar angka nilai harian & presensi absensi siswa',
    correctApp: 'Aplikasi Spreadsheet / Sistem Informasi Akademik',
    correctOutput: 'Buku Rapor Digital & Rekap Peringkat Prestasi Siswa',
    inputs: [
      'Daftar angka nilai harian & presensi absensi siswa',
      'Daftar buku paket bacaan & denah tata ruang kelas',
      'Jadwal giliran piket harian & menu makanan kantin',
    ],
    apps: [
      'Aplikasi Desain Grafis / Editor Ilustrasi Digital',
      'Aplikasi Spreadsheet / Sistem Informasi Akademik',
      'Aplikasi Peramban Web / Pengunduh Dokumen Online',
    ],
    outputs: [
      'Buku Rapor Digital & Rekap Peringkat Prestasi Siswa',
      'Kuitansi Pembayaran Kain Seragam Olahraga Sekolah',
      'Lembar Denah Jalur Evakuasi Kebakaran Gedung Guru',
    ],
  },
  {
    id: 'case_supermarket',
    icon: ShoppingCart,
    title: 'Kasus 2: Mesin Kasir & Transaksi Minimarket',
    description: 'Kasir memindai kode barcode belanjaan pembeli untuk menghitung total harga pembayaran dan mencetak struk belanja.',
    correctInput: 'Kode barcode produk & kuantitas jumlah belanjaan',
    correctApp: 'Aplikasi Point of Sales / Kasir Komputer Toko',
    correctOutput: 'Struk Total Belanja & Pembaruan Stok Barang Kasir',
    inputs: [
      'Kode barcode produk & kuantitas jumlah belanjaan',
      'Nomor rekening supplier & kuitansi tagihan listrik',
      'Riwayat panggilan nomor toko & jadwal kirim gudang',
    ],
    apps: [
      'Aplikasi Pengolah Kata / Pengetikan Naskah Buku',
      'Aplikasi Point of Sales / Kasir Komputer Toko',
      'Aplikasi Editor Rekaman Suara / Podcast Digital',
    ],
    outputs: [
      'Struk Total Belanja & Pembaruan Stok Barang Kasir',
      'Surat Izin Edar Produk Makanan Dari Badan POM',
      'Buku Panduan Petunjuk Servis Mesin Pendingin Es',
    ],
  },
  {
    id: 'case_smartwatch',
    icon: Activity,
    title: 'Kasus 3: Jam Tangan Pintar (Smartwatch Kesehatan)',
    description: 'Sensor pada smartwatch merekam denyut nadi dan jumlah getaran langkah kaki pengguna sepanjang hari.',
    correctInput: 'Sinyal sensor detak jantung & jumlah langkah kaki',
    correctApp: 'Aplikasi Health Tracker & Pemantau Kebugaran Raga',
    correctOutput: 'Laporan Kalori Terbakar & Ringkasan Kebugaran Tubuh',
    inputs: [
      'Sinyal sensor detak jantung & jumlah langkah kaki',
      'Daftar nama kontak darurat & agenda janji dokter',
      'Rekaman suara perintah memo & nada alarm pengingat',
    ],
    apps: [
      'Aplikasi Health Tracker & Pemantau Kebugaran Raga',
      'Aplikasi Pemutar Musik Digital & Pembuat Nada Dering',
      'Aplikasi Navigasi Maritim & Pengukur Kedalaman Laut',
    ],
    outputs: [
      'Laporan Kalori Terbakar & Ringkasan Kebugaran Tubuh',
      'Sertifikat Kelayakan Garansi Baterai Arloji Pintar',
      'Arsip Berkas Manual Petunjuk Pemakaian Gadget Jam',
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Perbedaan mendasar antara konsep DATA MENTAH dan INFORMASI dalam pemrosesan komputer adalah...',
    options: [
      { id: 'a', text: 'Data mentah berupa file video, sedangkan informasi berupa sinyal suara' },
      { id: 'b', text: 'Data sudah tersusun rapi, sedangkan informasi merupakan catatan acak' },
      { id: 'c', text: 'Data adalah fakta mentah acak, sedangkan Informasi olahan bermakna' },
      { id: 'd', text: 'Data tersimpan di flashdisk, sedangkan informasi ada di layar kaca' },
    ],
    correct: 'c',
  },
  {
    id: 2,
    question: 'Dalam siklus pengolahan data komputer, posisi dan fungsi utama APLIKASI (Software) adalah...',
    options: [
      { id: 'a', text: 'Penyedia daya listrik baterai cadangan penopang motherboard' },
      { id: 'b', text: 'Mesin pengolah yang memproses input menjadi output informasi' },
      { id: 'c', text: 'Perangkat fisik penyambung koneksi kabel layar monitor' },
      { id: 'd', text: 'Penyaring partikel debu halus pada ventilasi kipas prosesor' },
    ],
    correct: 'b',
  },
  {
    id: 3,
    question: 'Siswa memasukkan angka nilai "80, 90, 75, 85" ke program spreadsheet, lalu muncul teks "Rata-rata: 82.5 (Tuntas)". Manakah yang merupakan INFORMASI?',
    options: [
      { id: 'a', text: 'Papan ketik keyboard mekanik yang diketik oleh siswa' },
      { id: 'b', text: 'Kabel stopkontak penghubung arus listrik komputer' },
      { id: 'c', text: 'Kumpulan deretan angka acak nilai mentah 80, 90, 75, 85' },
      { id: 'd', text: 'Teks hasil perhitungan akhir "Rata-rata: 82.5 (Tuntas)"' },
    ],
    correct: 'd',
  },
  {
    id: 4,
    question: 'Manakah ilustrasi yang tepat menggambarkan perubahan dari data mentah menjadi informasi pada aplikasi Navigasi GPS?',
    options: [
      { id: 'a', text: 'Koordinat satelit & volume jalan diolah menjadi petunjuk rute tercepat' },
      { id: 'b', text: 'Suhu baterai ponsel diubah menjadi nada dering musik telepon pemanggil' },
      { id: 'c', text: 'Foto pemandangan kota diubah menjadi kuota data internet berkecepatan' },
      { id: 'd', text: 'Suara klakson kendaraan diubah menjadi saldo uang tunai elektronik' },
    ],
    correct: 'a',
  },
  {
    id: 5,
    question: 'Mengapa dalam pengolahan data sistem informatika berlaku hukum prinsip GIGO (Garbage In, Garbage Out)?',
    options: [
      { id: 'a', text: 'Komputer butuh pembersihan fisik agar tidak menimbun berkas lama' },
      { id: 'b', text: 'Input data yang keliru akan menghasilkan informasi yang salah pula' },
      { id: 'c', text: 'Komputer akan mematikan diri secara otomatis jika data tidak lengkap' },
      { id: 'd', text: 'Program aplikasi hanya dapat bekerja jika memori komputer dikosongkan' },
    ],
    correct: 'b',
  },
];

export default function DataAppPipeline({ currentScore, onComplete, onNextMission }) {
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'pipeline' | 'kuis'
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0));
  const [pipelineAnswers, setPipelineAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('tugas_sk_m2_pipeline_answers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initP = {};
      PIPELINE_CASES.forEach((c) => {
        initP[c.id] = { input: c.correctInput, app: c.correctApp, output: c.correctOutput };
      });
      return initP;
    }
    return {
      case_school: { input: '', app: '', output: '' },
      case_supermarket: { input: '', app: '', output: '' },
      case_smartwatch: { input: '', app: '', output: '' },
    };
  });
  const [pipelineChecked, setPipelineChecked] = useState(() => {
    try {
      return Boolean(localStorage.getItem('tugas_sk_m2_pipeline_answers')) || Number(currentScore) >= 10;
    } catch (e) {
      return Number(currentScore) >= 10;
    }
  });

  const [quizAnswers, setQuizAnswers] = useState(() => {
    try {
      const savedQ = localStorage.getItem('tugas_sk_m2_quiz_answers');
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initQ = {};
      QUIZ_QUESTIONS.forEach((q) => {
        initQ[q.id] = q.correct;
      });
      return initQ;
    }
    return {};
  });
  const [quizChecked, setQuizChecked] = useState(() => {
    try {
      return Boolean(localStorage.getItem('tugas_sk_m2_quiz_answers')) || Number(currentScore) >= 10;
    } catch (e) {
      return Number(currentScore) >= 10;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tugas_sk_m2_pipeline_answers', JSON.stringify(pipelineAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [pipelineAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem('tugas_sk_m2_quiz_answers', JSON.stringify(quizAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [quizAnswers]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 2 (Total 20 Poin):
  // - Lab Pipeline (3 Kasus x ~3.33 Poin): 10 Poin
  // - Kuis Data & Aplikasi (5 Soal x 2 Poin): 10 Poin
  // ====================================================
  let labPointsCalc = 0;
  PIPELINE_CASES.forEach((c) => {
    const userChoice = pipelineAnswers[c.id] || {};
    const isInputOk = userChoice.input === c.correctInput;
    const isAppOk = userChoice.app === c.correctApp;
    const isOutputOk = userChoice.output === c.correctOutput;
    if (isInputOk && isAppOk && isOutputOk) {
      labPointsCalc += 3.334;
    } else {
      if (isInputOk) labPointsCalc += 1;
      if (isAppOk) labPointsCalc += 1.334;
      if (isOutputOk) labPointsCalc += 1;
    }
  });
  const labScore = Math.min(10, Math.round(labPointsCalc));

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin

  const totalM2Score = Math.min(20, Math.max(Number(currentScore) || 0, labScore + quizScore));

  // Sync skor ke controller
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (onCompleteRef.current && totalM2Score > 0) {
      onCompleteRef.current('m2', totalM2Score);
    }
  }, [totalM2Score]);

  const handleSelect = (caseId, field, value) => {
    setPipelineAnswers((prev) => ({
      ...prev,
      [caseId]: {
        ...prev[caseId],
        [field]: value,
      },
    }));
    setPipelineChecked(false);
  };

  const handleCheckPipeline = () => {
    setPipelineChecked(true);
    celebratePointGain(true);
  };

  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Misi 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 2 • Bobot 20 Poin
            </span>
            <span className="text-xs text-slate-400">Siklus Data Mentah, Aplikasi & Informasi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Transformasi Data Mentah Menjadi Informasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari siklus alur data, susun pipa transformasi pada 3 kasus dunia nyata, dan selesaikan kuis logika data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setActiveTab('materi');
              setMateriRead(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi Siklus</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Lab Pipeline (10p)</span>
            {(pipelineChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'pipeline'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{labScore}/10p</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'kuis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Kuis Data (10p)</span>
            {(quizChecked || quizScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'kuis'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{quizScore}/10p</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MATERI SIKLUS TRANSFORMASI DATA */}
      {/* ========================================================= */}
      {activeTab === 'materi' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                🔄
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Siklus Pengolahan Data (Information Processing Cycle)
                </h3>
                <p className="text-xs text-slate-400">
                  Bagaimana data mentah yang tidak bermakna diubah menjadi informasi berharga.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Komputer tidak sekadar menyimpan data, melainkan bekerja sebagai <strong>mesin pengolah cerdas</strong>. Data masukan (input) dialirkan ke dalam perangkat lunak aplikasi yang menerapkan rumus, aturan, dan logika pemrosesan sehingga keluar sebagai informasi terstruktur yang mudah dipahami manusia.
            </p>

            {/* Diagram 3 Tahap Alur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Tahap 1</span>
                  <span className="text-xs font-bold text-slate-400">📥 Masukan</span>
                </div>
                <h4 className="text-xs font-black text-white">DATA MENTAH (INPUT)</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Fakta acak, angka mentah, teks, scan barcode, atau sinyal sensor yang belum memiliki konteks dan belum dihitung.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Tahap 2</span>
                  <span className="text-xs font-bold text-slate-400">⚙️ Pemrosesan</span>
                </div>
                <h4 className="text-xs font-black text-white">APLIKASI & ALGORITMA</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Perangkat lunak menjalankan algoritma komputasi, menjumlahkan, mengelompokkan, dan memfilter data sesuai kebutuhan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Tahap 3</span>
                  <span className="text-xs font-bold text-slate-400">📤 Keluaran</span>
                </div>
                <h4 className="text-xs font-black text-white">INFORMASI (OUTPUT)</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Hasil olahan bermakna berupa grafik visual, angka rekapitulasi, struk belanja, atau rekomendasi tindakan.
                </p>
              </div>
            </div>
          </div>

          {/* Konsep GIGO */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Prinsip Penting: GIGO (Garbage In, Garbage Out)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jika data yang dimasukkan ke dalam komputer keliru, palsu, atau rusak (Garbage In), maka sehebat apapun aplikasi dan komputernya, hasil keluaran informasinya juga akan salah dan menyesatkan (Garbage Out). Oleh karena itu, ketelitian input data adalah kunci utama sistem informasi yang handal!
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setMateriRead(true);
                setActiveTab('pipeline');
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Praktikum 3 Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LAB SIMULATOR 3 PIPELINE */}
      {/* ========================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Simulator 3 Pipeline Transformasi Data Dunia Nyata
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih elemen Data Mentah (Input), Aplikasi Pengolah (Proses), dan Informasi Bermanfaat (Output) untuk setiap skenario.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckPipeline}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cek Hasil ({labScore}/10p)</span>
              </button>
            </div>
          </div>

          {/* 3 Pipeline Cases */}
          <div className="space-y-4">
            {PIPELINE_CASES.map((c, cIdx) => {
              const currentChoice = pipelineAnswers[c.id] || {};
              const isInputCorrect = currentChoice.input === c.correctInput;
              const isAppCorrect = currentChoice.app === c.correctApp;
              const isOutputCorrect = currentChoice.output === c.correctOutput;
              const isAllCorrect = isInputCorrect && isAppCorrect && isOutputCorrect;

              return (
                <div
                  key={c.id}
                  className={`bg-slate-950 border rounded-3xl p-5 space-y-4 transition-all ${
                    pipelineChecked
                      ? isAllCorrect
                        ? 'border-emerald-500/50 bg-emerald-950/10'
                        : 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-slate-800">
                        <c.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white">{c.title}</h4>
                        <p className="text-[11px] text-slate-400">{c.description}</p>
                      </div>
                    </div>

                    {pipelineChecked && (
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                        isAllCorrect
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-rose-950 text-rose-300 border-rose-700'
                      }`}>
                        {isAllCorrect ? '✅ 3.3/3.3p' : 'Perlu Diperbaiki'}
                      </span>
                    )}
                  </div>

                  {/* 3 Dropdown Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 1. Input */}
                    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                      <label className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                        <span>1. Data Mentah (Input)</span>
                        {pipelineChecked && (isInputCorrect ? '✅' : '❌')}
                      </label>
                      <select
                        value={currentChoice.input || ''}
                        onChange={(e) => handleSelect(c.id, 'input', e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="">-- Pilih Data Mentah --</option>
                        {c.inputs.map((inp, idx) => (
                          <option key={idx} value={inp}>{inp}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Process App */}
                    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                      <label className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                        <span>2. Aplikasi Pemroses (Proses)</span>
                        {pipelineChecked && (isAppCorrect ? '✅' : '❌')}
                      </label>
                      <select
                        value={currentChoice.app || ''}
                        onChange={(e) => handleSelect(c.id, 'app', e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="">-- Pilih Aplikasi Pengolah --</option>
                        {c.apps.map((ap, idx) => (
                          <option key={idx} value={ap}>{ap}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Output */}
                    <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                      <label className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                        <span>3. Informasi Keluaran (Output)</span>
                        {pipelineChecked && (isOutputCorrect ? '✅' : '❌')}
                      </label>
                      <select
                        value={currentChoice.output || ''}
                        onChange={(e) => handleSelect(c.id, 'output', e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                      >
                        <option value="">-- Pilih Informasi Hasil --</option>
                        {c.outputs.map((out, idx) => (
                          <option key={idx} value={out}>{out}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('kuis')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Kuis Pemahaman Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: KUIS DATA & APLIKASI */}
      {/* ========================================================= */}
      {activeTab === 'kuis' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Kuis Logika Data & Transformasi Informasi (5 Soal • 10 Poin)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih satu opsi paling tepat. Evaluasi nilai dilakukan sekaligus setelah seluruh soal dijawab.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-xl">
              Skor Kuis: {quizScore} / 10 Poin
            </span>
          </div>

          <div className="space-y-3">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className={`bg-slate-950 border rounded-2xl p-4 transition-all ${
                    selectedOpt ? 'border-slate-700 bg-slate-900/40' : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-2.5 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isOptionSelected = selectedOpt === opt.id;

                          let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';
                          if (isOptionSelected) {
                            btnStyle = 'border-amber-500 bg-amber-500/20 text-amber-200 ring-2 ring-amber-500/40 font-bold';
                          }

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={quizChecked}
                              onClick={() => {
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                              }}
                              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${btnStyle} ${quizChecked ? 'cursor-not-allowed opacity-90' : ''}`}
                            >
                              <span className="uppercase font-extrabold text-[11px] opacity-70 mt-0.5">
                                {opt.id}.
                              </span>
                              <span className="flex-1 leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evaluation Banner / Buttons */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs">
              {quizChecked ? (
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hasil Kuis: Kamu menjawab {quizCorrectCount} dari 5 soal benar ({quizScore}/10 Poin).</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Ingin memperbaiki nilai? Klik tombol Ulangi Kuis di samping untuk mereset dan mencoba lagi dari awal.
                  </p>
                </div>
              ) : (
                <span className="text-slate-400">
                  Terjawab: {Object.keys(quizAnswers).length} / 5 Soal
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {quizChecked ? (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ulangi Kuis dari Awal</span>
                </button>
              ) : (
                <button
                  onClick={handleEvaluateQuiz}
                  disabled={Object.keys(quizAnswers).length < 5}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition active:scale-95 ${
                    Object.keys(quizAnswers).length === 5
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kumpulkan & Cek Nilai Kuis</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Total Poin Misi 2 yang Didapat: {totalM2Score} / 20 Poin</span>
            </div>
            {onNextMission && (
              <button
                type="button"
                onClick={onNextMission}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <span>Lanjut ke Misi 3 (Perkakas Digital)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

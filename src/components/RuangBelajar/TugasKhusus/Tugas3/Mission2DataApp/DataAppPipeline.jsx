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
    correctInput: 'Daftar angka nilai harian & presensi kehadiran siswa',
    correctApp: 'Aplikasi Spreadsheet / Sistem Informasi Akademik',
    correctOutput: 'Buku Rapor Digital & Grafik Peringkat Siswa',
    inputs: [
      'Daftar angka nilai harian & presensi kehadiran siswa',
      'Foto pemandangan pantai saat liburan',
      'Lagu rekaman MP3 paduan suara',
    ],
    apps: [
      'Aplikasi Pemutar Musik MP3',
      'Aplikasi Spreadsheet / Sistem Informasi Akademik',
      'Software Edit Video Animasi 3D',
    ],
    outputs: [
      'Buku Rapor Digital & Grafik Peringkat Siswa',
      'File audio rekaman suara paduan',
      'Suhu udara ruangan laboratorium',
    ],
  },
  {
    id: 'case_supermarket',
    icon: ShoppingCart,
    title: 'Kasus 2: Mesin Kasir & Transaksi Minimarket',
    description: 'Kasir memindai kode barcode belanjaan pembeli untuk menghitung total harga pembayaran dan mencetak struk belanja.',
    correctInput: 'Kode barcode barang & jumlah kuantitas item belanja',
    correctApp: 'Aplikasi Point of Sales / Kasir Komputer',
    correctOutput: 'Struk Total Belanja & Pengurangan Stok Barang Otomatis',
    inputs: [
      'Kode barcode barang & jumlah kuantitas item belanja',
      'Nama-nama planet tata surya',
      'Lukisan kanvas manual',
    ],
    apps: [
      'Game Balap Mobil 3D',
      'Aplikasi Point of Sales / Kasir Komputer',
      'Software Perekam Layar Komputer',
    ],
    outputs: [
      'Struk Total Belanja & Pengurangan Stok Barang Otomatis',
      'File naskah cerpen',
      'Lagu MP3 pop akustik',
    ],
  },
  {
    id: 'case_smartwatch',
    icon: Activity,
    title: 'Kasus 3: Jam Tangan Pintar (Smartwatch Kesehatan)',
    description: 'Sensor pada smartwatch merekam denyut nadi dan jumlah getaran langkah kaki pengguna sepanjang hari.',
    correctInput: 'Sinyal sensor detak jantung & hitungan getaran langkah kaki',
    correctApp: 'Aplikasi Health Tracker & Analisis Kebugaran Tubuh',
    correctOutput: 'Laporan Kalori Terbakar, Kualitas Tidur & Rekomendasi Olahraga',
    inputs: [
      'Sinyal sensor detak jantung & hitungan getaran langkah kaki',
      'Teks naskah drama teater',
      'Daftar resep masakan kue',
    ],
    apps: [
      'Aplikasi Health Tracker & Analisis Kebugaran Tubuh',
      'Software Kompresi Berkas ZIP',
      'Aplikasi Desain Denah Rumah',
    ],
    outputs: [
      'Laporan Kalori Terbakar, Kualitas Tidur & Rekomendasi Olahraga',
      'Video film dokumenter',
      'Berkas sertifikat tanah',
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Perbedaan mendasar antara DATA MENTAH dan INFORMASI dalam ilmu informatika adalah...',
    options: [
      { id: 'a', text: 'Data sudah matang dan siap pakai, sedangkan informasi masih mentah' },
      { id: 'b', text: 'Data adalah fakta/angka mentah yang belum diolah, sedangkan Informasi adalah hasil olahan data yang memiliki makna, konteks, dan bermanfaat untuk pengambilan keputusan' },
      { id: 'c', text: 'Data hanya berupa file gambar, sedangkan informasi hanya berupa suara' },
      { id: 'd', text: 'Data selalu tersimpan di internet, sedangkan informasi hanya di atas kertas' },
    ],
    correct: 'b',
  },
  {
    id: 2,
    question: 'Dalam siklus transformasi data, posisi APLIKASI (Software) berfungsi sebagai...',
    options: [
      { id: 'a', text: 'Penyedia arus listrik baterai' },
      { id: 'b', text: 'Mesin pemroses yang menerima Input Data Mentah, mengolahnya dengan formula/algoritma logika, lalu menghasilkan Output Informasi' },
      { id: 'c', text: 'Kabel penghubung monitor ke stopkontak' },
      { id: 'd', text: 'Pembersih debu fisik pada kipas processor' },
    ],
    correct: 'b',
  },
  {
    id: 3,
    question: 'Budi memasukkan angka: "80, 90, 75, 85, 95" ke aplikasi spreadsheet. Setelah dihitung, muncul teks "Rata-rata: 85 (Predikat: Sangat Baik)". Manakah yang merupakan INFORMASI?',
    options: [
      { id: 'a', text: 'Kumpulan angka mentah 80, 90, 75, 85, 95' },
      { id: 'b', text: 'Papan ketik keyboard yang dipakai Budi' },
      { id: 'c', text: 'Hasil olahan "Rata-rata: 85 (Predikat: Sangat Baik)"' },
      { id: 'd', text: 'Kabel charger laptop' },
    ],
    correct: 'c',
  },
  {
    id: 4,
    question: 'Contoh nyata pemrosesan data menjadi informasi pada aplikasi Navigasi Peta (Google Maps / GPS) adalah...',
    options: [
      { id: 'a', text: 'Sinyal koordinat satelit GPS dan data kepadatan jalan (Data Mentah) diolah menjadi petunjuk rute tercepat dan estimasi waktu sampai (Informasi)' },
      { id: 'b', text: 'Musik radio diubah menjadi lukisan cat minyak' },
      { id: 'c', text: 'Baterai smartphone diubah menjadi kuota data' },
      { id: 'd', text: 'Kamera memotret kertas langsung berubah menjadi uang tunai' },
    ],
    correct: 'a',
  },
  {
    id: 5,
    question: 'Mengapa dalam pengolahan data berlaku prinsip GIGO (Garbage In, Garbage Out)?',
    options: [
      { id: 'a', text: 'Karena jika data masukan (Input) salah atau tidak akurat, aplikasi akan menghasilkan informasi keluaran (Output) yang salah dan menyesatkan juga' },
      { id: 'b', text: 'Komputer akan otomatis meledak jika diberi data salah' },
      { id: 'c', text: 'Supaya komputer tidak memerlukan memori penyimpanan' },
      { id: 'd', text: 'Agar keyboard komputer tidak cepat kotor' },
    ],
    correct: 'a',
  },
];

export default function DataAppPipeline({ currentScore, onComplete }) {
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'pipeline' | 'kuis'
  const [pipelineAnswers, setPipelineAnswers] = useState({
    case_school: { input: '', app: '', output: '' },
    case_supermarket: { input: '', app: '', output: '' },
    case_smartwatch: { input: '', app: '', output: '' },
  });
  const [pipelineChecked, setPipelineChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);

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

  const totalM2Score = Math.min(20, labScore + quizScore);

  // Sync skor ke controller
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (onCompleteRef.current) {
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
    if (labScore > 0) {
      celebratePointGain(labScore >= 9);
    }
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
            onClick={() => setActiveTab('materi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi Siklus</span>
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
              onClick={() => setActiveTab('pipeline')}
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

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Total Poin Misi 2 yang Didapat: {totalM2Score} / 20 Poin</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

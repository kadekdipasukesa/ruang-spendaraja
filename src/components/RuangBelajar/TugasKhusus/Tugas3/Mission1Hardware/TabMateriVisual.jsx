import {
  Sparkles,
  Keyboard,
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  AppWindow,
  Palette,
  ArrowRight
} from 'lucide-react';

export default function TabMateriVisual({ onNextTab }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            💻
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Pengertian Sistem Komputer
            </h3>
            <p className="text-xs text-slate-400">
              Kombinasi harmonis antara Perangkat Keras, Perangkat Lunak, dan Manusia.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>Sistem Komputer</strong> adalah sekumpulan elemen komputasi terpadu yang saling terhubung untuk menerima data masukan (input), memproses data secara matematis & logika (process), menyimpan hasil (storage), dan menyajikannya sebagai informasi bermanfaat (output) bagi pengguna (brainware).
        </p>

        {/* 3 Pilar Utama Sistem Komputer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-blue-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">Pilar 1</span>
            <h4 className="text-xs font-black text-white mt-0.5">Hardware (Perangkat Keras)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Komponen fisik nyata yang dapat dilihat, disentuh, dan dialiri daya listrik (misal: CPU, RAM, Layar).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Pilar 2</span>
            <h4 className="text-xs font-black text-white mt-0.5">Software (Perangkat Lunak)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Kumpulan instruksi kode program digital yang memberi perintah kerja pada perangkat keras (OS & Aplikasi).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Pilar 3</span>
            <h4 className="text-xs font-black text-white mt-0.5">Brainware (Pengguna)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Manusia (siswa, programmer, operator) yang mengoperasikan dan mengendalikan jalannya komputer.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Kelompok Hardware Utama */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          1. Klasifikasi 5 Kategori Perangkat Keras (Hardware)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Input */}
          <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Keyboard className="w-4 h-4" />
              <span>Perangkat Masukan (Input)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alat untuk memasukkan data teks, suara, gambar, atau perintah ke dalam sistem komputer.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Keyboard</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Mouse</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Mikrofon</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Webcam</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Scanner</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Barcode</span>
            </div>
          </div>

          {/* Process */}
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Perangkat Pemrosesan (Process)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pusat komputasi yang mengeksekusi rumus logika, kalkulasi, pengolahan gambar, dan koordinasi lalu lintas data.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Processor (CPU)</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">VGA Card (GPU)</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Motherboard</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Sound Card</span>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <HardDrive className="w-4 h-4" />
              <span>Perangkat Penyimpanan (Storage)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Menyimpan instruksi sementara yang sedang berjalan (RAM) atau berkas dokumen secara permanen (SSD/HDD).
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">RAM (Volatile)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">SSD NVMe</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">Harddisk (HDD)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">Flashdisk USB</span>
            </div>
          </div>

          {/* Output */}
          <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Monitor className="w-4 h-4" />
              <span>Perangkat Keluaran (Output)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Menyajikan hasil proses komputer ke bentuk visual layar, suara speaker, atau lembaran cetak.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Monitor</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Speaker</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Printer</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Proyektor</span>
            </div>
          </div>

          {/* Auxiliary */}
          <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 space-y-2 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Perangkat Pendukung & Daya (Power & Cooler)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Menjamin ketersediaan arus listrik stabil (PSU) dan membuang panas berlebih (Heatsink Fan Cooler) agar komputer tidak rusak / mati mendadak.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded-md font-semibold">Power Supply Unit (PSU)</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded-md font-semibold">Heatsink & Fan Cooler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pembagian Software OS vs Aplikasi */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          2. Pembagian Perangkat Lunak (Software)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AppWindow className="w-4 h-4" />
              <span>Sistem Operasi (OS)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Pondasi utama yang menghubungkan pengguna dengan perangkat keras. Tanpa OS, komputer tidak bisa dinyalakan atau menjalankan aplikasi apapun.
            </p>
            <div className="text-[11px] text-slate-300 font-medium">
              Contoh: <strong>Windows 11, Linux Ubuntu, macOS, Android, iOS, ChromeOS</strong>.
            </div>
          </div>

          <div className="bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
              <Palette className="w-4 h-4" />
              <span>Perangkat Lunak Aplikasi</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Program siap pakai yang dibuat khusus untuk memenuhi kebutuhan tugas manusia (mengetik, mengedit, menggambar, komunikasi, belajar, dan hiburan).
            </p>
            <div className="text-[11px] text-slate-300 font-medium">
              Contoh: <strong>Word, Excel, Photoshop, WhatsApp, Canva, Zoom, Spotify, Scratch, Roblox</strong>.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Praktikum 20 Komponen Hardware</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

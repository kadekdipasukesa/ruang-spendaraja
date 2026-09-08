import {
  MessageSquare,
  Music,
  FileSpreadsheet,
  GraduationCap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function TabMateriToolbox({ onNextTab }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
            🧰
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              5 Kelompok Perkakas Digital (Digital Tools)
            </h3>
            <p className="text-xs text-slate-400">
              Setiap jenis aplikasi diciptakan dengan kegunaan dan ekosistem spesifik.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Di era digital, perangkat lunak terbagi ke dalam berbagai fungsi kerja. Memahami klasifikasi perkakas membantu kita memilih alat yang tepat untuk belajar, berkarya, berkomunikasi, dan menjaga keamanan sistem komputer secara bijak.
        </p>

        {/* 5 Kelompok Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {/* 1. Komunikasi */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>1. Komunikasi & Kolaborasi</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Menghubungkan orang lewat obrolan teks instan, video conference, email, dan kerja kelompok jarak jauh.
            </p>
            <div className="text-[10px] text-blue-300 font-semibold">
              Contoh: WhatsApp, Zoom, Discord, Gmail.
            </div>
          </div>

          {/* 2. Hiburan */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs sm:text-sm">
              <Music className="w-4 h-4" />
              <span>2. Hiburan & Rekreasi Media</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Mengisi waktu senggang dengan memutar musik streaming, menonton film/video kreatif, dan bermain game interaktif.
            </p>
            <div className="text-[10px] text-purple-300 font-semibold">
              Contoh: YouTube, Spotify, Netflix, Roblox.
            </div>
          </div>

          {/* 3. Produktivitas */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>3. Produktivitas & Kerja</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Menyelesaikan tugas sekolah atau kantor: mengetik makalah, kalkulasi rumus tabel angka, dan desain grafis poster.
            </p>
            <div className="text-[10px] text-amber-300 font-semibold">
              Contoh: Google Docs, Excel, Canva, Trello.
            </div>
          </div>

          {/* 4. Edukasi */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>4. Pembelajaran & Edukasi</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Platform kelas maya pengumpulan tugas guru, belajar bahasa asing interaktif, dan pemrograman visual koding.
            </p>
            <div className="text-[10px] text-emerald-300 font-semibold">
              Contoh: Google Classroom, Duolingo, Scratch, Ruangguru.
            </div>
          </div>

          {/* 5. Utilitas */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-2 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>5. Utilitas, Sistem, Navigasi & Keamanan</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Mendukung kinerja sistem operasi: pencadangan file awan (cloud), pemetaan peta jalan GPS, antivirus pembasmi malware, dan kompresi file arsip ZIP.
            </p>
            <div className="text-[10px] text-rose-300 font-semibold">
              Contoh: Google Drive, Google Maps, Antivirus Smadav/Defender, 7-Zip.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Praktikum 20 Aplikasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import {
  Sparkles,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function TabMateriEtika({ onNextTab }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            🛡️
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Dua Sisi Mata Uang Teknologi Informasi (TIK)
            </h3>
            <p className="text-xs text-slate-400">
              Kekuatan besar memerlukan tanggung jawab dan kebijaksanaan moral yang tinggi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Dampak Positif */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Dampak Positif TIK</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Kemudahan mencari sumber belajar dan referensi sains di seluruh dunia.</li>
              <li>Komunikasi instan dengan keluarga dan guru tanpa batas jarak.</li>
              <li>Ruang berkreasi digital: coding, animasi, desain, dan pembuatan konten bermanfaat.</li>
              <li>Efisiensi transaksi perbankan dan administrasi sekolah paperless.</li>
            </ul>
          </div>

          {/* Dampak Negatif & Risiko */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Dampak Negatif & Ancaman</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Penyebaran berita bohong (Hoax) dan penipuan phishing data pribadi.</li>
              <li>Perundungan siber (Cyberbullying) dan ujaran kebencian di media sosial.</li>
              <li>Kecanduan game/layar yang menurunkan kesehatan mata dan fisik.</li>
              <li>Pencurian kata sandi dan pembajakan akun akibat kelalaian keamanan.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3 Pedoman Utama Netiket */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Prinsip 3S Netiket (Sopan, Saring, Simpan)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-300">1. Sopan & Santun</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Ingat bahwa di balik setiap layar ada manusia yang memiliki perasaan. Jangan mengetik kata kasar atau menghina orang lain.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-blue-300">2. Saring Sebelum Sharing</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Cek kebenaran berita dan tautan sebelum membagikannya. Jangan mudah tergiur hadiah kuota gratis atau pesan hoax berantai.
            </p>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300">3. Simpan Rahasia Pribadi</span>
            <p className="text-slate-400 text-[11px] leading-snug">
              Jangan pernah membagikan kata sandi akun, foto dokumen penting, alamat rumah, atau nomor identitas ke publik terbuka.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke 5 Kasus Detektif</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

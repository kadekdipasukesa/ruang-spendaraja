import {
  Zap,
  ArrowRight
} from 'lucide-react';

export default function TabMateriPipeline({ onNextTab }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl">
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
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Praktikum 3 Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

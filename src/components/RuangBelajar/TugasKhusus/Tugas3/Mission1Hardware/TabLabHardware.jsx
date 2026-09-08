import {
  Zap,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { RealAssetThumbnail } from '../skAssets';
import { HARDWARE_20_ITEMS, HW_CATEGORIES } from './hardwareData';

export default function TabLabHardware({
  hwPlacements,
  onAssignHw,
  onClearHw,
  shuffledHwList,
  selectedHwItem,
  setSelectedHwItem,
  hwChecked,
  hwScore,
  hwCorrectCount,
  onCheckHw,
  onNextTab
}) {
  const handleHwDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.setData('type', 'hw');
  };

  const handleHwDrop = (e, categoryId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId && HARDWARE_20_ITEMS.some((h) => h.id === itemId)) {
      onAssignHw(itemId, categoryId);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-5">
      {/* Petunjuk & Progress */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Tantangan Drag & Drop 20 Komponen Hardware (Gambar Asli)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tarik (drag) atau klik kartu komponen berfoto asli, lalu letakkan ke dalam zona kategori perangkat keras yang sesuai.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
            Terpasang: <span className="text-amber-400">{Object.values(hwPlacements).filter(Boolean).length}/20</span>
          </div>
          <button
            onClick={onCheckHw}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cek Hasil ({hwScore}/15p)</span>
          </button>
        </div>
      </div>

      {/* Tata Letak Berdampingan (Side-by-Side): Bank Komponen Kiri & Dropzones Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Kolom Kiri (Bank Komponen Hardware) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Bank Hardware ({HARDWARE_20_ITEMS.filter((h) => !hwPlacements[h.id]).length} Sisa)
            </span>
            <button
              onClick={onClearHw}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Mobile / Tap Selection Banner */}
          {selectedHwItem && (
            <div className="p-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
              <span className="truncate pr-1">👉 Terpilih: <strong>{HARDWARE_20_ITEMS.find((h) => h.id === selectedHwItem)?.name}</strong></span>
              <button
                onClick={() => setSelectedHwItem(null)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:text-white flex-shrink-0"
              >
                Batal
              </button>
            </div>
          )}

          {/* Daftar Scrollable 1 Kolom */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {shuffledHwList.map((item) => {
              const placedCat = hwPlacements[item.id];
              const isSelected = selectedHwItem === item.id;

              if (placedCat) {
                return (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 opacity-30 grayscale cursor-not-allowed select-none text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <RealAssetThumbnail
                        id={item.id}
                        name={item.name}
                        fallbackIcon={item.icon}
                        isSoftware={false}
                        size="sm"
                      />
                      <span className="text-xs font-bold truncate text-slate-500">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/60">✓ Terpasang</span>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleHwDragStart(e, item.id)}
                  onClick={() => setSelectedHwItem(isSelected ? null : item.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-grab active:cursor-grabbing select-none relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40 shadow-lg'
                      : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <RealAssetThumbnail
                      id={item.id}
                      name={item.name}
                      fallbackIcon={item.icon}
                      isSoftware={false}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-tight truncate">{item.name}</span>
                        <span className="text-[10px] text-amber-400/80 font-medium ml-1">Tarik / Klik</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{item.hint}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan (Kotak-Kotak Dropzone Kategori Hardware) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HW_CATEGORIES.map((cat) => {
            const assignedItems = HARDWARE_20_ITEMS.filter(
              (h) => hwPlacements[h.id] === cat.id
            );

            return (
              <div
                key={cat.id}
                onDragOver={allowDrop}
                onDrop={(e) => handleHwDrop(e, cat.id)}
                onClick={() => {
                  if (selectedHwItem) {
                    onAssignHw(selectedHwItem, cat.id);
                    setSelectedHwItem(null);
                  }
                }}
                className={`border rounded-2xl p-3.5 transition-all min-h-[175px] flex flex-col justify-between ${cat.color} ${
                  selectedHwItem ? 'ring-2 ring-amber-400/40 cursor-pointer bg-slate-900/60' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-black text-xs text-white">
                      <cat.icon className="w-4 h-4 text-amber-400" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                      {assignedItems.length} item
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">{cat.desc}</p>

                  {/* Assigned Chips with Real Thumbnails */}
                  <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    {assignedItems.length === 0 ? (
                      <div className="w-full text-center py-4 text-[11px] text-slate-500 italic">
                        Tarik dari daftar kiri atau klik item lalu klik kotak ini
                      </div>
                    ) : (
                      assignedItems.map((item) => (
                        <span
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAssignHw(item.id, cat.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-semibold border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer hover:border-slate-500 hover:bg-slate-800 transition"
                          title="Klik untuk menghapus dari kategori"
                        >
                          <RealAssetThumbnail
                            id={item.id}
                            name={item.name}
                            fallbackIcon={item.icon}
                            isSoftware={false}
                            size="sm"
                          />
                          <span className="truncate max-w-[110px]">{item.name}</span>
                          <span className="text-[10px] text-slate-400 hover:text-white font-bold ml-0.5">×</span>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>💡 Contoh: {cat.examples || 'Periksa fungsi utama komponen'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="text-xs text-slate-400">
          {hwChecked && (
            <div className="font-bold flex items-center gap-2 animate-in fade-in">
              {hwCorrectCount === 20 ? (
                <span className="text-emerald-400">
                  🎉 Luar Biasa! Sempurna 20 / 20 Komponen Hardware Tepat (+{hwScore}/15 Poin)
                </span>
              ) : (
                <span className="text-amber-300">
                  📊 Hasil Evaluasi: {hwCorrectCount} dari 20 komponen tepat pada posisinya (+{hwScore}/15 Poin). Periksa kembali penempatanmu jika ingin menyempurnakan!
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Praktikum 20 Software</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

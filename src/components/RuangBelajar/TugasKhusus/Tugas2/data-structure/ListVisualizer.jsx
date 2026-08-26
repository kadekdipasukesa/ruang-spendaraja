import { ShoppingBag, Users, Plus, Trash2, Key, CheckCircle, Sparkles, HelpCircle, ArrowRight, Layers } from 'lucide-react';

export default function ListVisualizer({
  listType,
  items,
  newItemName,
  setNewItemName,
  newItemCategory,
  setNewItemCategory,
  onSwitchListType,
  onAddItem,
  onDeleteItem,
  actualSecretWord,
  userGuessWord,
  setUserGuessWord,
  guessFeedback,
  onCheckSecretWord,
}) {
  return (
    <div className="space-y-6">
      {/* Selector Tipe Daftar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" /> Pilih Contoh Daftar (List):
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchListType('belanja')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              listType === 'belanja'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> 1. Daftar Belanjaan Ibu
          </button>
          <button
            onClick={() => onSwitchListType('siswa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              listType === 'siswa'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 2. Daftar Presensi Siswa
          </button>
        </div>
      </div>

      {/* Tampilan Visual Daftar Terstruktur */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <span>Struktur Data: [{listType === 'belanja' ? 'Daftar Belanja Pasar' : 'Daftar Siswa Kelas'}]</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            Total Elemen: <strong>{items.length} Data</strong>
          </span>
        </div>

        {/* Tabel / Baris Elemen List */}
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition shadow-xs group"
            >
              <div className="flex items-center gap-3">
                {/* Indeks Nomor Urut */}
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  [{idx + 1}]
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                      {item.category || item.absen || 'Umum'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Indeks Posisi: data[{idx}] • Huruf Awal: &ldquo;<strong className="text-amber-400">{item.secretLetter}</strong>&rdquo;
                  </span>
                </div>
              </div>

              {/* Tombol Hapus Elemen */}
              <button
                onClick={() => onDeleteItem(item.id)}
                title="Hapus elemen ini dari daftar"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition text-xs flex items-center gap-1 opacity-80 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Form Tambah Elemen Baru ke List */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={listType === 'belanja' ? 'Nama barang belanja baru (contoh: Kentang)...' : 'Nama siswa baru...'}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            placeholder="Kategori / Keterangan (opsional)..."
            className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={onAddItem}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Tambah Elemen List
          </button>
        </div>
      </div>

      {/* Aktivitas Kata Rahasia dari Indeks List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-300">
              Aktivitas Tebak Kata Rahasia (Indeks Elemen List)
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Komputer membaca data pada posisi indeks tertentu. Ambil <strong>huruf pertama</strong> dari setiap elemen nomor urut <strong>[1]</strong> sampai <strong>[{items.length}]</strong> pada daftar di atas untuk mengungkap kata rahasianya!
            </p>
          </div>
        </div>

        {/* Petunjuk Huruf per Indeks */}
        <div className="flex items-center gap-2 flex-wrap py-2">
          {items.map((it, idx) => (
            <div key={it.id} className="flex items-center gap-1.5">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center">
                <span className="text-[9px] text-slate-400 block font-mono">[{idx + 1}]</span>
                <span className="text-xs font-bold text-amber-400">{it.secretLetter}</span>
              </div>
              {idx < items.length - 1 && <span className="text-slate-600 font-bold">+</span>}
            </div>
          ))}
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <div className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm tracking-widest">
            {actualSecretWord}
          </div>
        </div>

        {/* Input Tebakan Siswa */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={userGuessWord}
            onChange={(e) => setUserGuessWord(e.target.value)}
            placeholder="Ketik kata rahasia yang tersusun di sini..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={onCheckSecretWord}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Uji Kata Rahasia
          </button>
        </div>

        {guessFeedback && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-300">
            {guessFeedback}
          </div>
        )}
      </div>
    </div>
  );
}

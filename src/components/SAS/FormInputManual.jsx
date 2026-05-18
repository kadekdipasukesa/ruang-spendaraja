import React, { useState } from 'react';
import { useInputNilai } from '../../hooks/SAS/useInputNilai';
import PreviewModal from './PreviewModal';
import { User, CheckCircle2, ClipboardEdit, Search, GraduationCap, Code2, Sparkles, Camera, Loader2, RefreshCw } from 'lucide-react';
import { analyzeLJKWithGemini } from '../../lib/geminiService';

export default function FormInputManual() {
  const {
    searchQuery, setSearchQuery, suggestions, selectedSiswa, mapel,
    jawabanPG, setJawabanPG, jawabanEssay, setJawabanEssay,
    skorEssay, setSkorEssay, selectSiswa, hitungPG, simpanKeSupabase, loading
  } = useInputNilai();

  const [showPreview, setShowPreview] = useState(false);
  const [fastJsonInput, setFastJsonInput] = useState('');
  const [showFastInput, setShowFastInput] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const hasilPG = selectedSiswa ? hitungPG() : { benar: 0, total: 50, nilai: 0 };

  const handlePGChange = (no, val) => {
    setJawabanPG(prev => ({ ...prev, [no]: val }));
  };

  // FUNGSI INPUT IMPOR CEPAT (PARSE JSON)
  const handleProcessFastInput = () => {
    try {
      const parsed = JSON.parse(fastJsonInput);

      if (parsed.jawaban_pilihan_ganda) {
        // Pastikan semua key string (1-50) masuk ke state
        setJawabanPG(prev => ({ ...prev, ...parsed.jawaban_pilihan_ganda }));
      }

      if (parsed.jawaban_essay) {
        setJawabanEssay(prev => ({ ...prev, ...parsed.jawaban_essay }));
      }

      alert("⚡ Mantap! Data pilihan ganda & essay berhasil diimpor sekaligus!");
      setShowFastInput(false);
      setFastJsonInput('');
    } catch (error) {
      alert("❌ Format JSON salah! Pastikan tanda petik dan komanya sudah benar ya.");
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl max-w-5xl mx-auto text-slate-800">

      {/* Bagian Input Saran Dinamis (Auto-Suggest) */}
      <div className="relative mb-8 z-30">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Cari Nama Siswa (Master)
          </label>

          {selectedSiswa && (
            <button
              onClick={() => setShowFastInput(!showFastInput)}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 hover:text-amber-500 transition-colors"
            >
              <Code2 size={14} /> {showFastInput ? 'Tutup Input Cepat' : 'Impor Data Sekaligus (JSON)'}
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full bg-slate-50 pl-12 pr-4 py-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none focus:border-amber-500 focus:bg-white transition-all"
            placeholder="Ketik minimal 2 huruf nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100">
            {suggestions.map(siswa => (
              <button
                key={siswa.id}
                onClick={() => selectSiswa(siswa)}
                className="w-full text-left px-5 py-3.5 hover:bg-amber-50 font-bold text-sm text-slate-700 flex justify-between items-center transition-colors"
              >
                <span>{siswa.NAMA}</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">Kelas {siswa.Kelas}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PANEL INPUT CEPAT JSON & AI VISION (TAMPIL HANYA JIKA DIKLIK) */}
{selectedSiswa && showFastInput && (
  <div className="mb-8 p-6 bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-2xl animate-in slide-in-from-top-5 duration-300">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider text-white">Smart AI LJK Scanner</h4>
          <p className="text-[11px] text-slate-400">Scan otomatis kertas LJK menggunakan Gemini AI Vision</p>
        </div>
      </div>

      {/* Input File dengan opsi capture kamera langsung untuk perangkat Mobile */}
      <label className={`inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-amber-400 transition-all ${isAiLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {isAiLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Camera size={15} />
        )}
        {isAiLoading ? 'Menganalisis Gambar...' : 'Foto LJK / Upload'}
        <input
          type="file"
          accept="image/*"
          capture="environment" /* Memicu kamera belakang otomatis di HP */
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsAiLoading(true);
            try {
              const aiOutput = await analyzeLJKWithGemini(file);
              
              if (aiOutput.jawaban_pilihan_ganda) {
                setJawabanPG(prev => ({ ...prev, ...aiOutput.jawaban_pilihan_ganda }));
              }
              if (aiOutput.jawaban_essay) {
                setJawabanEssay(prev => ({ ...prev, ...aiOutput.jawaban_essay }));
              }
              
              alert("⚡ AI Sukses! Lembar jawaban fisik berhasil diekstrak ke dalam form.");
              setShowFastInput(false);
            } catch (err) {
              alert("❌ Gagal membaca gambar: " + err.message);
            } finally {
              setIsAiLoading(false);
            }
          }}
        />
      </label>
    </div>

    {/* Alternatif Manual JSON (Disediakan sebagai cadangan) */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Atau Input Teks Objek JSON Manual</label>
      <textarea
        rows="4"
        className="w-full bg-slate-900 p-3 font-mono text-xs rounded-xl border border-slate-800 text-emerald-400 outline-none focus:border-amber-500 transition-all"
        placeholder={`{\n  "jawaban_pilihan_ganda": { "1": "D", "2": "A" },\n  "jawaban_essay": { "1": "Hasil Jawaban..." }\n}`}
        value={fastJsonInput}
        onChange={(e) => setFastJsonInput(e.target.value)}
        disabled={isAiLoading}
      />
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setShowFastInput(false)}
          className="px-4 py-2 bg-slate-900 text-slate-400 rounded-xl font-bold text-xs uppercase hover:bg-slate-800"
          disabled={isAiLoading}
        >
          Batal
        </button>
        <button
          onClick={handleProcessFastInput}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-xs uppercase"
          disabled={isAiLoading}
        >
          Proses JSON Teks
        </button>
      </div>
    </div>
  </div>
)}

      {selectedSiswa ? (
        <div className="space-y-8 animate-in fade-in duration-300">

          {/* Badge Informasi Siswa Terpilih */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/70 border border-amber-100 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <User className="text-amber-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Siswa</p>
                <p className="text-sm font-black">{selectedSiswa.NAMA}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-amber-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kelas / Absen</p>
                <p className="text-sm font-black">Kelas {selectedSiswa.Kelas} / No.{selectedSiswa["No Absen"]}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mata Pelajaran</p>
              <span className="inline-block px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black">{mapel}</span>
            </div>
          </div>

          {/* Grid Jawaban Pilihan Ganda */}
<div>
  <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
    <CheckCircle2 size={18} className="text-emerald-500" /> Lembar Pilihan Ganda (50 Soal)
  </h3>

  {/* PENTING: Mengunci Grid Mutlak 2 Kolom di Seluruh Ukuran Layar */}
  <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">

    {/* KOLOM KIRI: Soal Nomor 1 sampai 25 */}
    <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm space-y-1">
      <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 border-b border-slate-100 pb-1 mb-1.5 text-center">
        Soal 1 - 25
      </div>
      <div className="space-y-1">
        {Array.from({ length: 25 }, (_, i) => (i + 1).toString()).map((no) => (
          <div key={no} className="flex items-center justify-between px-2 py-0.5 bg-slate-50/60 rounded-lg border border-slate-100/50">
            <span className="text-[11px] font-black text-slate-500">No. {no}</span>
            <select
              // Mengubah default value menjadi 'Null' jika data state belum ada/kosong
              value={jawabanPG[no] || 'Null'}
              onChange={(e) => handlePGChange(no, e.target.value)}
              // w-10 diubah ke w-11 agar teks "Null" muat dengan rapi di dalam kotak select
              className="w-11 text-[11px] font-black text-center bg-white py-0.5 rounded border border-slate-200 outline-none focus:border-amber-500 cursor-pointer appearance-none"
            >
              {/* Menambahkan opsi "Null" di barisan pilihan */}
              {["", "A", "B", "C", "D"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>

    {/* KOLOM KANAN: Soal Nomor 26 sampai 50 */}
    <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm space-y-1">
      <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 border-b border-slate-100 pb-1 mb-1.5 text-center">
        Soal 26 - 50
      </div>
      <div className="space-y-1">
        {Array.from({ length: 25 }, (_, i) => (i + 26).toString()).map((no) => (
          <div key={no} className="flex items-center justify-between px-2 py-0.5 bg-slate-50/60 rounded-lg border border-slate-100/50">
            <span className="text-[11px] font-black text-slate-500">No. {no}</span>
            <select
              // Mengubah default value menjadi 'Null' jika data state belum ada/kosong
              value={jawabanPG[no] || 'Null'}
              onChange={(e) => handlePGChange(no, e.target.value)}
              // w-10 diubah ke w-11 agar teks "Null" muat dengan rapi di dalam kotak select
              className="w-11 text-[11px] font-black text-center bg-white py-0.5 rounded border border-slate-200 outline-none focus:border-amber-500 cursor-pointer appearance-none"
            >
              {/* Menambahkan opsi "Null" di barisan pilihan */}
              {["", "A", "B", "C", "D"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>

          {/* Input Rubrik Jawaban & Nilai Essay */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <ClipboardEdit size={18} className="text-amber-500" /> Evaluasi Lembar Essay
            </h3>
            <div className="space-y-4">
              {[1, 2].map((no) => (
                <div key={no} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Esai Soal {no}</label>
                    <textarea
                      rows="2"
                      value={jawabanEssay[no.toString()] || ''}
                      onChange={(e) => setJawabanEssay({ ...jawabanEssay, [no.toString()]: e.target.value })}
                      className="w-full bg-white p-3 text-xs font-bold rounded-xl border border-slate-200 outline-none focus:border-amber-500"
                      placeholder={`Salin esai nomor ${no} di sini...`}
                    />
                  </div>
                  <div className="w-full md:w-36">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Skor (0 - 100)</label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={skorEssay[no.toString()] || 0}
                      onChange={(e) => setSkorEssay({ ...skorEssay, [no.toString()]: e.target.value })}
                      className="w-full bg-white px-4 py-2.5 text-sm font-black text-center rounded-xl border border-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Aksi Menuju Preview */}
          <button
            onClick={() => setShowPreview(true)}
            className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl hover:bg-amber-500 transition-colors shadow-lg shadow-slate-950/10"
          >
            Tinjau & Validasi Nilai Siswa
          </button>
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
          <p className="text-slate-400 text-xs font-bold uppercase italic tracking-wider">Silakan pilih nama siswa terlebih dahulu</p>
        </div>
      )}

      {/* Modal Preview */}
      {showPreview && (
        <PreviewModal
          siswa={selectedSiswa}
          mapel={mapel}
          hasilPG={hasilPG}
          skorEssay={skorEssay}
          jawabanEssay={jawabanEssay}
          onClose={() => setShowPreview(false)}
          onConfirm={async () => {
            const res = await simpanKeSupabase();
            alert(res.message);
            if (res.success) {
              setShowPreview(false);
              window.location.reload();
            }
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
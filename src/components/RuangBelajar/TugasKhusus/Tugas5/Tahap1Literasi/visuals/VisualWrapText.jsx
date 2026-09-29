import React, { useState } from 'react';
import { Image as ImageIcon, Move, ShieldCheck, Sparkles } from 'lucide-react';
import komputerImg from '../../../../../../assets/ruang-belajar/komputer_transparan.png';

export default function VisualWrapText() {
  const [selectedWrap, setSelectedWrap] = useState('top_bottom');

  const wrapOptions = [
    {
      id: 'top_bottom',
      title: 'Top and Bottom (Atas & Bawah)',
      tag: '★ Pilihan Resmi Langkah 6',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'Teks otomatis berhenti tepat di atas gambar dan berlanjut kembali tepat di bawah gambar. Paragraf 1 dan Paragraf 2 terpisah rapi dengan gambar komputer transparan berada di tengah-tengah!',
    },
    {
      id: 'in_front',
      title: 'In Front of Text (Di Depan Teks)',
      tag: 'Bebas Mengapung',
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      desc: 'Gambar melayang bebas di atas tulisan. Cocok untuk stiker atau logo yang ingin digeser ke sudut pojok tanpa mengubah aliran baris teks.',
    },
    {
      id: 'square',
      title: 'Square (Bujur Sangkar)',
      tag: 'Teks Mengalir di Sisi',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      desc: 'Teks mengalir dan melipat rapi membungkus sisi kotak gambar. Sangat cocok jika gambar berada di samping teks paragraf.',
    },
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Eksperimen Visual: Sisipkan Gambar Komputer PNG &amp; Wrap Text
          </h4>
        </div>
        <span className="text-[11px] text-blue-300 font-bold">
          Klik mode Wrap Text untuk melihat tata letaknya!
        </span>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {wrapOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelectedWrap(opt.id)}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedWrap === opt.id
                ? 'bg-blue-900/40 border-blue-400 ring-2 ring-blue-500/50 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mb-1.5 ${opt.tagColor}`}>
              {opt.tag}
            </span>
            <h5 className="font-bold text-xs text-white block">{opt.title}</h5>
          </button>
        ))}
      </div>

      {/* Explanation Banner */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>{wrapOptions.find((o) => o.id === selectedWrap)?.desc}</span>
      </div>

      {/* Live Simulation Box (Simulated Ms Word Page with real computer png) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-300 text-slate-800 text-xs relative select-none font-['Calibri',sans-serif]">
        {/* Paper Header */}
        <div className="text-center font-bold text-xs text-blue-950 uppercase border-b pb-2 mb-3">
          Pratinjau Tata Letak Paragraf &amp; Gambar Komputer
        </div>

        {/* Dynamic Layout Based on Wrap Text */}
        {selectedWrap === 'top_bottom' && (
          <div className="space-y-3">
            <p className="text-justify leading-relaxed text-slate-800 indent-6">
              Masuk sebagai siswa baru di <strong>SMPN 2 SINGARAJA</strong> memberikan pengalaman belajar yang sangat
              berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika. Di kelas ini, kami tidak hanya
              belajar teori saja, tetapi juga langsung mempraktikkan cara menggunakan perangkat komputer dan menyusun
              dokumen dengan rapi.
            </p>

            {/* Centered Image with Top and Bottom separation */}
            <div className="py-2 flex flex-col items-center justify-center border-y border-dashed border-emerald-400 bg-emerald-50/50 rounded-xl my-2 transition-all">
              <img
                src={komputerImg}
                alt="Komputer PNG"
                className="max-h-28 object-contain drop-shadow"
                draggable="false"
              />
              <span className="text-[10px] text-emerald-800 font-bold mt-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ Wrap Text: Top and Bottom (Gambar memisahkan antar paragraf dengan rapi)
              </span>
            </div>

            <p className="text-justify leading-relaxed text-slate-800 indent-6">
              Hal yang paling menarik adalah saat guru menggunakan web interaktif <strong>Ruang Spendaraja</strong> untuk
              menyampaikan materi serta memberikan tugas. Melalui <em>platform online</em> ini, suasana belajar menjadi
              lebih <em>flexible</em>, interaktif, dan menyenangkan bagi seluruh siswa.
            </p>
          </div>
        )}

        {selectedWrap === 'in_front' && (
          <div className="relative">
            {/* Free Floating Computer Image */}
            <div className="absolute top-2 right-4 z-20 flex flex-col items-center bg-white/90 p-2 rounded-xl border border-blue-400 shadow-xl animate-pulse">
              <img
                src={komputerImg}
                alt="Komputer PNG"
                className="w-20 object-contain"
                draggable="false"
              />
              <span className="text-[8px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded mt-0.5">
                In Front of Text
              </span>
            </div>

            <div className="space-y-2 text-slate-800 text-justify leading-relaxed">
              <p className="indent-6">
                Masuk sebagai siswa baru di <strong>SMPN 2 SINGARAJA</strong> memberikan pengalaman belajar yang sangat berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika.
              </p>
              <p className="indent-6">
                Hal yang paling menarik adalah saat guru menggunakan web interaktif <strong>Ruang Spendaraja</strong>. Melalui <em>platform online</em> ini, suasana belajar menjadi menyenangkan.
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                ★ Perhatikan: Gambar berada di atas tulisan (melayang). Jika ditaruh di tengah, sebagian kata bisa tertutup!
              </p>
            </div>
          </div>
        )}

        {selectedWrap === 'square' && (
          <div className="overflow-hidden">
            {/* Float Left Image */}
            <div className="float-left mr-3 mb-2 p-1.5 bg-slate-50 rounded-xl border border-slate-300 text-center">
              <img
                src={komputerImg}
                alt="Komputer PNG"
                className="w-24 object-contain"
                draggable="false"
              />
              <span className="text-[9px] text-slate-600 block mt-0.5 font-bold">Square</span>
            </div>

            <div className="space-y-2 text-slate-800 text-justify leading-relaxed">
              <p>
                Masuk sebagai siswa baru di <strong>SMPN 2 SINGARAJA</strong> memberikan pengalaman belajar yang sangat berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika. Di kelas ini, kami belajar teori dan mempraktikkan perangkat komputer.
              </p>
              <p>
                Dengan mode <strong>Square</strong>, teks melipat mengelilingi kotak gambar komputer di sebelah kiri.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tip Box */}
      <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Langkah 6 Praktik:</strong> Klik kanan pada gambar komputer yang baru di-insert ➔ pilih{' '}
          <strong className="text-white underline">Wrap Text ➔ Top and Bottom</strong> agar teks terbagi rapi di atas
          dan di bawah gambar!
        </span>
      </div>
    </div>
  );
}

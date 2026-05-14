import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingDown, Users, MonitorOff } from 'lucide-react';

const AnalisisPelanggaran = () => {
  // Data Perbandingan Sebelum vs Sesudah (Awal Semester vs Akhir Semester)
  const compareData = [
    { category: 'Game Online', sebelum: 18, sesudah: 1 },
    { category: 'Social Media', sebelum: 12, sesudah: 0 },
    { category: 'Video Hiburan', sebelum: 15, sesudah: 2 },
    { category: 'Copy-Paste Kode', sebelum: 22, sesudah: 4 },
  ];

  // Data Tren Pelanggaran per 10 Menit (Sesuai narasi distraksi menit ke-20)
  const trendData = [
    { menit: '0', jumlah: 2 },
    { menit: '10', jumlah: 5 },
    { menit: '20', jumlah: 24 }, // Puncak distraksi tanpa Ruang Spendaraja
    { menit: '30', jumlah: 18 },
    { menit: '40', jumlah: 22 },
  ];

  return (
    <div className="p-8 pt-24 bg-white min-h-screen font-sans text-slate-800">
      {/* Header Laporan */}
      <div className="flex justify-between items-end mb-8 border-b-2 border-red-50 px-2 pb-4">
        <div>
          <h2 className="text-2xl font-black text-red-600 flex items-center gap-2 italic">
            <AlertTriangle /> ANALISIS DISTRAKSI DIGITAL LAB KOMPUTER
          </h2>
          <p className="text-slate-500 font-medium">Laporan Audit Perilaku Murid - SMP Negeri 2 Singaraja</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest">
            Data Pra-Inovasi
          </span>
        </div>
      </div>

      {/* Rangkuman Masalah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <div className="flex justify-between items-start mb-4">
            <Users className="text-red-500" size={32} />
            <span className="text-red-600 font-bold text-xl">82%</span>
          </div>
          <h3 className="font-bold text-slate-700">Tingkat Distraksi</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Murid terdeteksi membuka tab non-pelajaran setelah 15 menit instruksi guru.</p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <div className="flex justify-between items-start mb-4">
            <MonitorOff className="text-orange-500" size={32} />
            <span className="text-orange-600 font-bold text-xl">20 Menit</span>
          </div>
          <h3 className="font-bold text-slate-700">Batas Fokus Maksimal</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Rata-rata murid mulai meninggalkan tugas algoritma Scratch untuk mencari hiburan.</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex justify-between items-start mb-4">
            <TrendingDown className="text-emerald-500" size={32} />
            <span className="text-emerald-600 font-bold text-xl">-90%</span>
          </div>
          <h3 className="font-bold text-slate-700">Target Reduksi</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Target penurunan pelanggaran melalui sistem monitoring Ruang Spendaraja.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Grafik Batas Fokus (Line Chart) */}
        <div className="bg-slate-50 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-600 mb-6 uppercase tracking-wider text-center">Tren Pelanggaran per Menit (Tanpa Monitoring)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                <XAxis dataKey="menit" label={{ value: 'Menit Ke-', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Jml Murid', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="stepAfter" dataKey="jumlah" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[11px] text-red-500 font-medium italic text-center">
            *Lonjakan tajam terjadi di menit ke-20: Murid mulai kehilangan minat pada logika Scratch.
          </p>
        </div>

        {/* Grafik Perbandingan Kategori (Bar Chart) */}
        <div className="bg-slate-50 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-600 mb-6 uppercase tracking-wider text-center">Perbandingan Pelanggaran (Sebelum vs Sesudah)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Legend />
                <Bar dataKey="sebelum" name="Sebelum Inovasi" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sesudah" name="Dengan Ruang Spendaraja" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
        <p className="text-xs font-light">Sistem Ruang Spendaraja: Merekam data secara otomatis untuk menjamin akurasi laporan.</p>
        <p className="text-xs font-mono text-slate-400 italic italic">Timestamp: {new Date().toLocaleDateString('id-ID')}</p>
      </div>
    </div>
  );
};

export default AnalisisPelanggaran;
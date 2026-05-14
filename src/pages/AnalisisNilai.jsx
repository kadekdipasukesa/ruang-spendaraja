import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { TrendingUp, Users, Award, CheckCircle } from 'lucide-react';

const AnalisisNilai = () => {
  const data = [
    { name: "Askara Restu", pre: 89, post: 94 },
    { name: "Desak Putu", pre: 76, post: 81 },
    { name: "Deva Arsa", pre: 80, post: 85 },
    { name: "I Gede Rizky", pre: 73, post: 74 },
    { name: "I Kadek Surya", pre: 78, post: 79 },
    { name: "I Putu Egy", pre: 80, post: 82 },
    { name: "Kadek Dinda", pre: 75, post: 80 },
    { name: "Kadek Dwipa", pre: 77, post: 80 },
    { name: "Kadek Ilka", pre: 76, post: 77 },
    { name: "Kadek Pramadana", pre: 73, post: 76 },
    { name: "Kadek Sintha", pre: 73, post: 78 },
    { name: "Kadek Tasya", pre: 85, post: 87 },
    { name: "Kadek Tisna", pre: 80, post: 85 },
    { name: "Kadek Widi", pre: 79, post: 82 },
    { name: "Ketut Ary", pre: 88, post: 93 },
    { name: "Komang Suastika", pre: 88, post: 92 },
    { name: "Made Melcy", pre: 75, post: 79 },
    { name: "Made Wikan", pre: 89, post: 93 },
    { name: "Moh. Hakim", pre: 79, post: 82 },
    { name: "M. David", pre: 79, post: 84 },
    { name: "Nabila Aulya", pre: 80, post: 81 },
    { name: "Ni Kadek Kania", pre: 76, post: 79 },
    { name: "Ni Luh Putu", pre: 79, post: 82 },
    { name: "Pande Komang", pre: 73, post: 78 },
    { name: "Putri Iswari", pre: 79, post: 82 },
    { name: "Putu Devandra", pre: 89, post: 91 },
    { name: "Putu Devani", pre: 80, post: 83 },
    { name: "Putu Devi", pre: 73, post: 78 },
    { name: "Putu Dewa", pre: 78, post: 81 },
    { name: "Putu Kanesia", pre: 88, post: 93 },
    { name: "Putu Pania", pre: 80, post: 82 },
    { name: "Sura Sembada", pre: 85, post: 86 }
  ];

  // Hitung Statistik
  const avgPre = (data.reduce((acc, curr) => acc + curr.pre, 0) / data.length).toFixed(1);
  const avgPost = (data.reduce((acc, curr) => acc + curr.post, 0) / data.length).toFixed(1);
  const peningkatan = (avgPost - avgPre).toFixed(1);

  return (
    <div className="p-8 pt-24 bg-slate-50 min-h-screen font-sans">
      {/* Header Analisis */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <TrendingUp className="text-emerald-500" size={36} /> ANALISIS HASIL BELAJAR
          </h2>
          <p className="text-slate-500 font-medium">Komparasi Capaian Nalar Analitis (Pre-Test vs Post-Test)</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-3 px-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Rata-rata Pre</p>
            <p className="text-xl font-black text-slate-700">{avgPre}</p>
          </div>
          <div className="bg-emerald-500 p-3 px-6 rounded-2xl shadow-lg text-center text-white">
            <p className="text-[10px] font-bold text-emerald-100 uppercase">Rata-rata Post</p>
            <p className="text-xl font-black">{avgPost}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* GRAFIK PENINGKATAN (Lg: 8 Kolom) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Visualisasi Peningkatan Nilai Per Siswa</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar dataKey="pre" name="Nilai Pre-Test" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="post" name="Nilai Post-Test" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <CheckCircle className="text-emerald-500" />
               <p className="text-sm font-bold text-emerald-800">Inovasi Ruang Spendaraja berhasil meningkatkan rata-rata nilai sebesar {peningkatan} poin.</p>
            </div>
          </div>
        </div>

        {/* TABEL DATA LENGKAP (Lg: 4 Kolom) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-900 text-white flex items-center gap-3">
            <Users size={20} className="text-blue-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Tabulasi Data Riil</h3>
          </div>
          <div className="overflow-y-auto max-h-[520px]">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Nama Murid</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Pre</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Post</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-700">{item.name}</td>
                    <td className="p-4 text-xs text-center text-slate-400">{item.pre}</td>
                    <td className="p-4 text-xs text-center font-black text-emerald-600 bg-emerald-50/50">{item.post}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalisisNilai;
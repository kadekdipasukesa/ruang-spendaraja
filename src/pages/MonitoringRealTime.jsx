import React from 'react';
import { Activity, Layout, MousePointer2, Search, UserCheck } from 'lucide-react';

const MonitoringRealTime = () => {
  const students = [
    { id: 1, name: "Askara Restu Zaki", location: "Simulasi Algoritma", status: "Active", time: "2m ago", color: "bg-green-500" },
    { id: 2, name: "Desak Putu Anggi Maharani", location: "Kuis Scratch V.1", status: "Active", time: "Just now", color: "bg-green-500" },
    { id: 3, name: "Deva Arsa Putra Ramadhan", location: "Materi Percabangan", status: "Active", time: "5m ago", color: "bg-green-500" },
    { id: 4, name: "I Gede Rizky Satria", location: "Halaman Beranda", status: "Idle", time: "12m ago", color: "bg-yellow-500" },
    { id: 5, name: "I putu Egy Hita premana", location: "Simulasi Loop", status: "Active", time: "1m ago", color: "bg-green-500" },
    { id: 6, name: "Kadek Dinda Santi Devi", location: "Kuis Scratch V.1", status: "Active", time: "3m ago", color: "bg-green-500" },
  ];

  return (
    <div className="p-8 pt-24 bg-slate-50 min-h-screen font-sans">
      {/* Header Panel Monitoring */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" /> Transformasi Supervisi: Ruang Spendaraja
          </h2>
          <p className="text-sm text-slate-500">Dashboard Live Navigasi Siswa - Lab Komputer SMPN 2 Singaraja</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
            <UserCheck size={18} className="text-blue-600" />
            <span className="text-sm font-bold text-blue-700">32 Siswa Terkoneksi</span>
          </div>
        </div>
      </div>

      {/* Grid Status Navigasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{student.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold italic">ID: 2026-00{student.id}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${student.color} animate-pulse`}></div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layout size={12} /> Sedang Diakses:
                </span>
                <span className="text-slate-400 italic">{student.time}</span>
              </div>
              <p className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                <MousePointer2 size={14} /> {student.location}
              </p>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                Status: {student.status}
               </span>
               <button className="text-[10px] text-slate-400 hover:text-blue-600 font-bold">Kirim Pesan Intervensi</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Caption untuk Naskah */}
      <div className="mt-8 p-6 bg-blue-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-sm">
             Insight Guru
          </h3>
          <p className="text-sm text-blue-100 leading-relaxed max-w-2xl italic">
            "Fitur ini memungkinkan saya mendeteksi murid yang 'diam' (Idle) terlalu lama. Misalnya I Gede Rizky terdeteksi Idle selama 12 menit di Beranda; ini adalah sinyal bagi saya untuk memberikan bantuan personal tanpa harus menunggu murid bertanya."
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Search size={120} />
        </div>
      </div>
    </div>
  );
};

export default MonitoringRealTime;
import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, BookOpen, FolderOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

const PortfolioLeaderboard = () => {
  // Data siswa dari input User
  const rawData = [
    { name: "Askara Restu Zaki", pre: 89, post: 94 },
    { name: "Putu Kanesia Sandyaripa", pre: 88, post: 93 },
    { name: "Made Wikan Restu Pramana", pre: 89, post: 93 },
    { name: "Ketut Ary Parwata", pre: 88, post: 93 },
    { name: "Komang Suastika", pre: 88, post: 92 },
    { name: "Putu Devandra Pratama Giri", pre: 89, post: 91 },
    { name: "Kadek Tasya Merta Febriani", pre: 85, post: 87 },
    { name: "Sura Sembada", pre: 85, post: 86 },
    { name: "Deva Arsa Putra Ramadhan", pre: 80, post: 85 },
    { name: "Kadek Tisna Pratiwi", pre: 80, post: 85 },
    { name: "Muhammad David Ramadhan", pre: 79, post: 84 },
    { name: "Putu Devani Rista S.N", pre: 80, post: 83 },
    { name: "I Putu Egy Hita Premana", pre: 80, post: 82 },
    { name: "Kadek Widi Putri", pre: 79, post: 82 },
    { name: "Mohamad Hakim Nazrro", pre: 79, post: 82 },
    { name: "Ni Luh Putu Widya Pratiwi", pre: 79, post: 82 },
    { name: "Putri Iswari Narariti", pre: 79, post: 82 },
    { name: "Putu Pania Nipiandita", pre: 80, post: 82 },
    { name: "Desak Putu Anggi Maharani", pre: 76, post: 81 },
    { name: "Nabila Aulya Maulana", pre: 80, post: 81 },
    { name: "Putu Dewa Sudiarta", pre: 78, post: 81 },
    { name: "Kadek Dinda Santi Devi", pre: 75, post: 80 },
    { name: "Kadek Dwipa Apriana Wijaya", pre: 77, post: 80 },
    { name: "I Kadek Surya Adi Pranata", pre: 78, post: 79 },
    { name: "Made Melcy Damar Dila", pre: 75, post: 79 },
    { name: "Ni Kadek Kania Dewi Prabaswari", pre: 76, post: 79 },
    { name: "Kadek Sintha Dewi Aryanti", pre: 73, post: 78 },
    { name: "Pande Komang Gede Oka", pre: 73, post: 78 },
    { name: "Putu Devi Agustin", pre: 73, post: 78 },
    { name: "Kadek Ilka Velina", pre: 76, post: 77 },
    { name: "Kadek Pramadana Putra", pre: 73, post: 76 },
    { name: "I Gede Rizky Satria Megantara", pre: 73, post: 74 }
  ];

  // Urutkan berdasarkan nilai POST tertinggi untuk Leaderboard
  const sortedStudents = [...rawData].sort((a, b) => b.post - a.post);

  return (
    <div className="p-8 pt-24 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Award className="text-yellow-500" size={36} /> ARSIP DIGITAL & LEADERBOARD
        </h2>
        <p className="text-slate-500">Hasil Capaian Nalar Analitis Murid Spendaraja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KIRI: LEADERBOARD (6 Kolom) */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy size={24} className="text-yellow-400" /> Top Performer - Post Test
            </h3>
            <p className="text-blue-100 text-xs mt-1 opacity-80">Peringkat berdasarkan kemajuan logika algoritma</p>
          </div>
          
          <div className="overflow-y-auto max-h-[600px] p-4">
            {sortedStudents.map((student, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 mb-3 rounded-2xl transition-all border-2 ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200' : 
                  index === 1 ? 'bg-slate-50 border-slate-200' : 
                  index === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent hover:border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 text-center font-black text-slate-400">
                    {index === 0 ? <Medal className="text-yellow-500 mx-auto" /> : 
                     index === 1 ? <Medal className="text-slate-400 mx-auto" /> : 
                     index === 2 ? <Medal className="text-orange-400 mx-auto" /> : `#${index + 1}`}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SMPN 2 Singaraja</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Pre</p>
                    <p className="text-sm font-bold text-slate-500">{student.pre}</p>
                  </div>
                  <div className="text-center bg-white px-4 py-1 rounded-xl border border-slate-100 shadow-inner">
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Post</p>
                    <p className="text-xl font-black text-blue-700">{student.post}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: PORTOFOLIO PREVIEW (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <FolderOpen className="text-blue-400 mb-4" size={40} />
              <h3 className="text-2xl font-black mb-2 italic">Digital Portfolio</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Setiap progres siswa di Ruang Spendaraja tersimpan secara otomatis sebagai arsip digital yang tidak akan hilang.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><BookOpen size={20}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Modul Tersimpan</p>
                    <p className="text-sm font-bold">12 Algoritma Dasar</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><TrendingUp size={20}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Rata-rata Kenaikan</p>
                    <p className="text-sm font-bold">+5.2 Poin Capaian</p>
                  </div>
                </div>
              </div>
            </div>
            <Star className="absolute -bottom-10 -right-10 text-white opacity-5" size={200} />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 italic">
              <CheckCircle2 className="text-green-500" size={18} /> Resume Belajar Terakhir
            </h4>
            <div className="space-y-3">
              {["Simulasi Loop Selesai", "Kuis Variabel Berhasil", "Project Scratch 1 Terarsip"].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-600">{item}</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Verified</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PortfolioLeaderboard;
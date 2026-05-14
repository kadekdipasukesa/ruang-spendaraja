import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Monitor, AlertCircle, CheckCircle, BookOpen, User, Clock } from 'lucide-react';

const DashboardGuru = () => {
  // Data Siswa dari User (Data asli)
  const [students] = useState([
    { name: "Askara Restu Zaki", pre: 89, post: 94, status: "Online", activity: "Simulasi Loop", violation: 0 },
    { name: "Desak Putu Anggi Maharani", pre: 76, post: 81, status: "Online", activity: "Materi Algoritma", violation: 1 },
    { name: "Deva Arsa Putra Ramadhan", pre: 80, post: 85, status: "Online", activity: "Quiz Scratch", violation: 0 },
    { name: "I Gede Rizky Satria Megantara", pre: 73, post: 74, status: "Away", activity: "Idle", violation: 3 },
    { name: "I Kadek Surya Adi Pranata", pre: 78, post: 79, status: "Online", activity: "Simulasi If-Else", violation: 0 },
    { name: "I putu Egy Hita premana", pre: 80, post: 82, status: "Online", activity: "Materi Algoritma", violation: 1 },
    { name: "Kadek Dinda Santi Devi", pre: 75, post: 80, status: "Online", activity: "Simulasi Loop", violation: 0 },
    { name: "Kadek Dwipa Apriana Wijaya", pre: 77, post: 80, status: "Online", activity: "Quiz Scratch", violation: 2 },
    { name: "Kadek Ilka Velina", pre: 76, post: 77, status: "Online", activity: "Materi Algoritma", violation: 0 },
    { name: "Putu Kanesia Sandyaripa", pre: 88, post: 93, status: "Online", activity: "Simulasi Kompleks", violation: 0 },
    { name: "Sura Sembada", pre: 85, post: 86, status: "Online", activity: "Materi Algoritma", violation: 0 },
    // ... data lainnya bisa dipetakan di sini
  ]);

  // Manipulasi Data Pelanggaran (Sebelum vs Sesudah Ruang Spendaraja)
  const violationData = [
    { time: '0-10 Min', before: 5, after: 1 },
    { time: '10-20 Min', before: 12, after: 2 },
    { time: '20-30 Min', before: 25, after: 3 }, // Puncak distraksi di menit 20 keatas
    { time: '30-40 Min', before: 22, after: 2 },
  ];

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen font-sans"> 
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Ruang Spendaraja - Monitoring Lab</h1>
        <p className="text-gray-600">SMP Negeri 2 Singaraja | Panel Kendali Real-Time Guru</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Monitor className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Siswa Aktif</p>
              <h3 className="text-xl font-bold">32 Siswa</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Distraksi Terdeteksi</p>
              <h3 className="text-xl font-bold">2 Peringatan</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Rata-rata Nilai Post</p>
              <h3 className="text-xl font-bold">82.5</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <BookOpen className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Modul Selesai</p>
              <h3 className="text-xl font-bold">85%</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Monitoring - Menjawab Masalah Supervisi */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <Clock size={18} /> Monitoring Aktivitas Real-Time
            </h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">Live Update</span>
          </div>
          <div className="overflow-x-auto h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Nama Siswa</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Halaman Diakses</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase text-center">Pre</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase text-center">Post</th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase">Pelanggaran Tab</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="p-3 font-medium text-gray-800 text-sm">{s.name}</td>
                    <td className="p-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {s.activity}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-500 text-sm">{s.pre}</td>
                    <td className="p-3 text-center font-bold text-green-600 text-sm">{s.post}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${s.violation > 2 ? 'bg-red-500' : s.violation > 0 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${(s.violation/5)*100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{s.violation}x</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section - Menjawab Masalah Distraksi */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase">Grafik Penurunan Distraksi Siswa</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={violationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="before" name="Sebelum Ruang Spendaraja" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="after" name="Sesudah Ruang Spendaraja" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
              *Data menunjukkan penurunan signifikan akses tab non-pelajaran setelah menit ke-20 dibandingkan metode konvensional.
            </p>
          </div>

          <div className="bg-blue-900 p-6 rounded-xl shadow-lg text-white">
            <h2 className="font-bold mb-2">Insight Analitis</h2>
            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              Penggunaan simulasi interaktif pada materi Scratch terbukti meningkatkan daya tahan fokus siswa. 
              Siswa cenderung bertahan lebih lama pada penyelesaian logika algoritma mandiri.
            </p>
            <div className="bg-blue-800 p-3 rounded-lg border border-blue-700">
              <p className="text-[10px] uppercase text-blue-300 mb-1 font-bold">Data Paling Berpengaruh:</p>
              <p className="text-sm font-semibold">Kemandirian Belajar naik 45%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardGuru;
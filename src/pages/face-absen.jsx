import React from 'react';
import { useFaceAbsen } from '../hooks/BEE/useFaceAbsen';
import FaceScanner from '../components/BEE/FaceScanner';
import { UserCheck, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FaceAbsenPage() {
  const { videoRef, isModelLoaded, startVideo, attendanceList, scanning, registerFace } = useFaceAbsen();
  const [inputName, setInputName] = React.useState("");

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link to="/bee-2026" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-600 font-bold text-xs uppercase mb-8 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Expo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Kiri: Scanner */}
          <div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
              AI FACE <br />
              <span className="text-amber-500">RECOGNITION</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mb-8 italic">
              "Prototipe absensi masa depan menggunakan pemindaian biometrik wajah secara real-time."
            </p>

            <FaceScanner videoRef={videoRef} scanning={scanning} isLoaded={isModelLoaded} />

            <button 
              onClick={startVideo}
              disabled={!isModelLoaded || scanning}
              className="w-full mt-6 bg-slate-900 hover:bg-amber-500 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {scanning ? <RefreshCw className="animate-spin" size={20} /> : "AKTIFKAN PEMINDAI"}
            </button>

            <div className="mt-8 p-6 bg-white rounded-3xl border border-amber-100 shadow-sm">
  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Daftar Wajah Baru</h4>
  <div className="flex gap-2">
    <input 
      type="text" 
      placeholder="Ketik namamu..." 
      value={inputName}
      onChange={(e) => setInputName(e.target.value)}
      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm"
    />
    <button 
      onClick={() => registerFace(inputName)}
      className="bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-amber-400 transition-all"
    >
      Daftar
    </button>
  </div>
</div>
          </div>

          {/* Kanan: Recent Attendance (Local State) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <UserCheck className="text-amber-500" /> LOG KEHADIRAN (LOCAL)
            </h3>
            
            <div className="space-y-4">
              {attendanceList.length > 0 ? attendanceList.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-right">
                  <div>
                    <p className="text-sm font-black text-slate-800">{log.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest">{log.time}</p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                    <ShieldCheck size={16} />
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 text-xs font-bold uppercase italic">Belum ada data terdeteksi</p>
                </div>
              )}
            </div>
            
            <p className="mt-8 text-[10px] text-slate-400 font-medium text-center uppercase tracking-widest">
              Data hanya disimpan sementara di memory browser <br /> untuk keperluan demo Expo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
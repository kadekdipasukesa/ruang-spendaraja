import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FormInputManual from '../components/SAS/FormInputManual';

export default function InputNilaiPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/bee-2026" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-500 font-bold text-xs uppercase mb-3 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            Sistem Input <span className="text-amber-500">Nilai SAS</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
            SMP Negeri 2 Singaraja — Tahun Pelajaran 2026
          </p>
        </div>

        {/* Memanggil Form Input Manual dengan Pencarian Dinamis */}
        <FormInputManual />
      </div>
    </div>
  );
}
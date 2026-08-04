import React from 'react';
import { Calendar, Monitor, Film } from 'lucide-react';

export default function HeroJurnal({ selectedLab, setSelectedLab }) {
    const labs = [
        { id: 'Lab TIK', name: 'Lab TIK', icon: <Monitor className="w-5 h-5" />, desc: 'Komputer & IT' },
        { id: 'Lab Multimedia', name: 'Lab Multimedia', icon: <Film className="w-5 h-5" />, desc: 'Audio, Video & Grafis' }
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 pt-8 pb-12 px-4 rounded-3xl mb-8 shadow-2xl">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
                        <Calendar className="w-3.5 h-3.5" /> Jurnal & Reservasi
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Timeline Penggunaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Laboratorium</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Pantau riwayat penggunaan lab, ketersediaan jadwal, serta ajukan peminjaman jam praktikum dengan mudah.
                    </p>
                </div>

                {/* Tab Switcher Lab */}
                <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full md:w-auto">
                    {labs.map((lab) => (
                        <button
                            key={lab.id}
                            onClick={() => setSelectedLab(lab.id)}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                selectedLab === lab.id
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                        >
                            {lab.icon}
                            <span>{lab.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
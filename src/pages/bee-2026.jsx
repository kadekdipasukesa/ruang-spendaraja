import React from 'react';
import { useBEE } from '../hooks/BEE/useBEE';
import ExpoCard from '../components/BEE/ExpoCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function BEE2026() {
    const { works, loading } = useBEE();

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div className="relative pt-20 pb-20 px-4">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto mb-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-amber-200 px-5 py-2 rounded-full shadow-sm mb-6 animate-bounce">
                        <Sparkles size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Pesta Inovasi Siswa 2026</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                        BULELENG <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">EDUCATION EXPO</span>
                    </h1>

                    <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg italic">
                        "Menampilkan karya digital dan inovasi teknologi terbaik dari siswa-siswi SMP Negeri 2 Singaraja."
                    </p>
                </div>

                {/* Grid List */}
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[450px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {works.map((work) => (
                                <ExpoCard key={work.id} item={work} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Call to Action Footer */}
                <div className="max-w-4xl mx-auto mt-24 bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Punya Karya Inovatif?</h2>
                        <p className="text-slate-400 mb-8 font-medium">Daftarkan karyamu untuk dipamerkan di BEE 2026 melalui Guru Informatika.</p>

                        {/* Link WhatsApp */}
                        <a
                            href="https://wa.me/6281939415343?text=Halo%20Admin%20BEE%202026%2C%20saya%20ingin%20mendaftarkan%20karya%20inovasi%20saya%20untuk%20dipamerkan."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 shadow-xl"
                        >
                            HUBUNGI ADMIN <ArrowRight size={20} />
                        </a>
                    </div>

                    {/* Efek Cahaya di Footer */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
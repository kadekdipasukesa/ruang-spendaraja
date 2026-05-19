import React from 'react';
import { useBEE } from '../hooks/BEE/useBEE';
import ExpoCard from '../components/BEE/ExpoCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import FeedbackBEE2026 from '../components/BEE/feedback_bee2026'

export default function BEE2026() {
    const { works, loading } = useBEE();

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div className="relative pt-32 pb-20 px-4">
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

                {/* Feedback BEE 2026 */}
                {/* Feedback Section */}
                <FeedbackBEE2026 />
            </div>
        </div>
    );
}
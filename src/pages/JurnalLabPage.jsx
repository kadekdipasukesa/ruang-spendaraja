import React, { useState, useEffect } from 'react';
import { useJurnalLab } from '../hooks/JurnalLab/useJurnalLab';
import HeroJurnal from '../components/JurnalLab/HeroJurnal';
import TimelineContainer from '../components/JurnalLab/TimelineContainer';
import FormPengajuanModal from '../components/JurnalLab/FormPengajuanModal';
import { Plus, Loader2, Lock } from 'lucide-react';

export default function JurnalLabPage({ user: propsUser }) {
    const {
        selectedLab,
        setSelectedLab,
        jurnalList,
        loading,
        role,
        submitPengajuan,
        handleApproval,
        handleComplete,
        handleDelete
    } = useJurnalLab('Lab TIK');

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Deteksi otomatis user dari localStorage
    const getLocalUser = () => {
        if (typeof window === 'undefined') return null;

        try {
            const allKeys = Object.keys(localStorage);
            for (const key of allKeys) {
                const rawValue = localStorage.getItem(key);
                try {
                    const parsed = JSON.parse(rawValue);
                    if (
                        parsed && 
                        typeof parsed === 'object' && 
                        (parsed.id || parsed.NISN || parsed.NAMA || parsed.nama || parsed.role)
                    ) {
                        return parsed;
                    }
                } catch (e) {
                    // Abaikan nilai non-JSON
                }
            }
        } catch (error) {
            // Abaikan error read storage
        }
        return null;
    };

    // State User
    const [currentUser, setCurrentUser] = useState(() => propsUser || getLocalUser());

    // Sync State saat terjadi Perubahan Session / Props
    useEffect(() => {
        const syncUser = () => {
            const activeUser = propsUser || getLocalUser();
            setCurrentUser(activeUser);
        };

        syncUser();

        window.addEventListener('storage', syncUser);
        return () => window.removeEventListener('storage', syncUser);
    }, [propsUser]);

    // Status Login
    const isLoggedIn = Boolean(currentUser);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-20 pb-24 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero / Header Switcher */}
                <HeroJurnal selectedLab={selectedLab} setSelectedLab={setSelectedLab} />

                {/* Toolbar / Action Bar */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white">Timeline Lab</h2>
                        <p className="text-xs text-slate-400">Jadwal real-time laboratorium {selectedLab}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isLoggedIn) {
                                alert("Harus login terlebih dahulu untuk membuat pengajuan jam lab!");
                                return;
                            }
                            setIsModalOpen(true);
                        }}
                        className={`font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
                            isLoggedIn
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/30"
                        }`}
                        title={!isLoggedIn ? "Login terlebih dahulu untuk mengajukan" : ""}
                    >
                        {isLoggedIn ? (
                            <Plus className="w-4 h-4" />
                        ) : (
                            <Lock className="w-4 h-4 text-rose-400" />
                        )}
                        <span>{isLoggedIn ? "Ajukan Jam Lab" : "Ajukan (Harus Login)"}</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                        <span className="text-xs">Memuat Timeline Lab...</span>
                    </div>
                ) : (
                    /* KONTAINER TIMELINE GROUPED PER BULAN & HARI */
                    <TimelineContainer
                        items={jurnalList}
                        role={role}
                        user={currentUser}
                        onApprove={handleApproval}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                    />
                )}

                {/* Modal Form Pengajuan */}
                <FormPengajuanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={submitPengajuan}
                    selectedLab={selectedLab}
                />
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // Sesuaikan path

const ModalGame = ({ children, onClose, title, subtitle, gameId, userClass, isAdmin }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading pengecekan kunci

  // 1. Cek Status Kunci saat Modal Buka & Pasang Realtime Listener
  useEffect(() => {

    // PENGAMAN: Jika gameId atau userClass belum ada, jangan lakukan apa-apa
    if (!gameId || !userClass) {
      console.warn("ModalGame: gameId atau userClass belum didefinisikan!");
      setIsLoading(false);
      return;
    }

    const checkLockStatus = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('game_controls')
        .select('is_locked')
        .eq('game_id', gameId)      // Harus game_id (sesuai SQL)
        .eq('class_name', userClass) // Harus class_name (sesuai SQL)
        .maybeSingle();

      if (data) setIsLocked(data.is_locked);
      setIsLoading(false);
    };

    checkLockStatus();

    // LOGIKA REALTIME: Mendengarkan perubahan status kunci secara langsung
    const channel = supabase
      .channel(`lock_channel_${gameId}_${userClass}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_controls',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          // Jika ada perubahan pada baris yang sesuai dengan kelas user ini
          if (payload.new && payload.new.class_name === userClass) {
            setIsLocked(payload.new.is_locked);
          }
        }
      )
      .subscribe();

    // Bersihkan channel saat modal ditutup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, userClass]);

  // 2. Fungsi Toggle Kunci (Hanya untuk Admin)
  const toggleLock = async () => {
    const { error } = await supabase
      .from('game_controls')
      .upsert({
        game_id: gameId,
        class_name: userClass,
        is_locked: !isLocked
      }, { onConflict: 'game_id,class_name' });

    // Note: setIsLocked tidak perlu dipanggil manual di sini jika Realtime sudah jalan,
    // tapi tetap dipanggil agar UI Admin terasa instant (snappy).
    if (!error) setIsLocked(!isLocked);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      {/* Overlay Backdrop Blur */}
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl animate-in fade-in duration-300"></div>

      {/* Kontainer Modal */}
      <div className="relative bg-[#0f172a] border border-blue-500/30 w-full max-w-full rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Dekorasi Cahaya Sudut */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Header Modal */}
        <div className="flex justify-between items-center p-8 pb-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                {title}
                {isLocked && <Lock className="text-red-500" size={20} />}
              </h2>
              <p className="text-slate-400 text-sm">{subtitle} • Kelas {userClass}</p>
            </div>
          </div>

          <button onClick={onClose} className="bg-white/5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Area Konten Game */}
        <div className="p-8 pt-4 relative min-h-[300px]">

          {/* SKELETON LOADING: Menghindari flash konten saat cek database */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* OVERLAY KUNCI: Menutup konten jika terkunci DAN bukan admin */}
              {isLocked && !isAdmin && (
                <div className="absolute inset-0 z-[50] bg-[#0f172a]/95 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 animate-in fade-in duration-500">
                  <div className="bg-red-500/20 p-6 rounded-full mb-4 border border-red-500/30">
                    <ShieldAlert size={48} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">AKSES KELAS DITUTUP</h3>
                  <p className="text-slate-400 max-w-md">
                    Maaf, akses game untuk kelas <b className="text-white">{userClass}</b> sedang dikunci oleh Admin. Silakan tunggu instruksi guru di depan kelas.
                  </p>
                </div>
              )}

              {/* Konten Game (Children): Diblur jika terkunci tapi admin masih bisa intip sedikit */}
              <div className={`transition-all duration-500 ${isLocked && !isAdmin ? 'blur-xl opacity-20 pointer-events-none' : 'opacity-100'}`}>
                {children}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalGame;
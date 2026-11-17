import React, { useMemo } from 'react';
import { Radio, PlusCircle, KeyRound, Users, Clock } from 'lucide-react';

export default function AdminRoomSelector({
  daftarSesi = [],
  selectedRoomId,
  onSelectRoom,
  onOpenCreateModal,
}) {
  // Sortir room: ongoing -> starting -> waiting -> finished -> archived
  const sortedRooms = useMemo(() => {
    const statusPriority = {
      ongoing: 1,
      starting: 2,
      waiting: 3,
      finished: 4,
      archived: 5,
    };

    return [...daftarSesi].sort((a, b) => {
      const prioA = statusPriority[a.status] || 99;
      const prioB = statusPriority[b.status] || 99;
      if (prioA !== prioB) return prioA - prioB;
      // Jika status sama, urutkan berdasarkan created_at descending
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [daftarSesi]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-blue-400 animate-pulse" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Daftar Ruang Ulangan CBT ({sortedRooms.length} Room Tersedia)
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 active:scale-98"
        >
          <PlusCircle size={14} />
          <span>+ Buat Room Baru</span>
        </button>
      </div>

      {/* Grid Pilihan Room Terurut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {sortedRooms.length === 0 ? (
          <div className="col-span-full p-4 text-center text-slate-500 text-xs font-semibold">
            Belum ada room ujian aktif. Klik "+ Buat Room Baru" untuk mengaktifkan room pertama.
          </div>
        ) : (
          sortedRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const isOngoing = room.status === 'ongoing';
            const isWaiting = room.status === 'waiting';
            const isStarting = room.status === 'starting';

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-400 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500'
                    : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-base font-black text-white tracking-wider flex items-center gap-1.5">
                      <KeyRound size={13} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                      {room.pin_ujian}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isOngoing
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isWaiting
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : isStarting
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  {/* Nama Room / Judul */}
                  <p className="text-[11px] font-bold text-slate-300 truncate mb-2" title={room.judul || 'Ulangan Harian'}>
                    {room.judul || 'Ulangan Harian Informatika'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 font-bold text-slate-300">
                    <Users size={12} className={room.peserta_count > 0 ? 'text-blue-400' : 'text-slate-500'} />
                    {room.peserta_count} Siswa
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={11} /> {room.durasi_menit || 80} Mnt
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-bl-lg">
                    DIPILIH
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}


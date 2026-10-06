import { Users, ChevronRight } from 'lucide-react';
import StudentAvatar from './StudentAvatar';

export default function LeaderboardTable({
  filteredList = [],
  currentStudentId,
  currentStudentNisn,
  currentStudentName,
  myRowRef,
  onSelectStudent,
  searchTerm,
  selectedClass,
  onResetSearch
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header List */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
            Daftar Skor Siswa ({filteredList.length})
          </h3>
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          Klik baris siswa untuk melihat rincian riwayat perolehan poin
        </div>
      </div>

      {/* Rows */}
      {filteredList.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {filteredList.map((item, index) => {
            const rankNumber = index + 1;
            const isMe =
              Number(item.id) === Number(currentStudentId) ||
              (currentStudentNisn && item.NISN === currentStudentNisn) ||
              (currentStudentName && (item.NAMA || '').toLowerCase() === currentStudentName);

            return (
              <div
                key={item.id || item.NISN || index}
                ref={isMe ? myRowRef : null}
                onClick={() => onSelectStudent && onSelectStudent(item, rankNumber)}
                className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sm:gap-4 transition-all cursor-pointer group ${
                  isMe
                    ? 'bg-amber-50/90 hover:bg-amber-100/70 border-l-4 border-amber-500 shadow-2xs'
                    : 'hover:bg-slate-50/90'
                }`}
                title={`Klik untuk melihat riwayat tugas & perolehan poin ${item.NAMA}`}
              >
                {/* Bagian Kiri: Nomor Peringkat, Foto Siswa & Data */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Badge Nomor Peringkat */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                      rankNumber === 1
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                        : rankNumber === 2
                        ? 'bg-slate-200 text-slate-800 ring-1 ring-slate-300'
                        : rankNumber === 3
                        ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : rankNumber}
                  </div>

                  {/* Foto Profil Siswa Resmi */}
                  <StudentAvatar
                    photoUrl={item.foto_profile}
                    name={item.NAMA}
                    id={item.id}
                    size="md"
                    className={`shrink-0 ring-1 ${isMe ? 'ring-amber-400' : 'ring-slate-200 group-hover:ring-slate-300'}`}
                  />

                  {/* Identitas Siswa */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-bold truncate group-hover:text-amber-800 transition-colors ${
                          isMe ? 'text-amber-950 font-black' : 'text-slate-900'
                        }`}
                        title={item.NAMA}
                      >
                        {item.NAMA}
                      </span>

                      {isMe && (
                        <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-amber-500 text-white shrink-0">
                          Kamu
                        </span>
                      )}

                      {rankNumber <= 3 && (
                        <span className="hidden sm:inline text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                          Top 3
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>Kelas <strong className="text-slate-600 font-semibold">{item.Kelas || '-'}</strong></span>
                      <span>·</span>
                      <span>Absen <strong className="text-slate-600 font-semibold">{item['No Absen'] || '-'}</strong></span>
                      {item.NISN && (
                        <>
                          <span className="hidden md:inline">·</span>
                          <span className="hidden md:inline font-mono">NISN: {item.NISN}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bagian Kanan: Poin & Panah Detail */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-black font-mono tabular-nums tracking-tight ${
                        rankNumber === 1
                          ? 'text-amber-600'
                          : isMe
                          ? 'text-amber-700 font-black'
                          : 'text-slate-900'
                      }`}
                    >
                      {item.total_points || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Poin</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-14 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">
            Belum Ada Data Siswa Ditemukan
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `Tidak ada siswa yang cocok dengan kata kunci "${searchTerm}". Silakan periksa kembali ejaan nama atau NISN.`
              : `Belum ada siswa di ${selectedClass === 'SEMUA' ? 'semua kelas 7' : `Kelas ${selectedClass}`} yang memiliki akumulasi poin tugas.`}
          </p>
          {searchTerm && onResetSearch && (
            <button
              type="button"
              onClick={onResetSearch}
              className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      )}
    </div>
  );
}

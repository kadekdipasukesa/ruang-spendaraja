import RankList from './RankList';
import AdminPoinPanel from './AdminPoinPanel'; // Jangan lupa di-import

export default function RankingTab({ allStudentsData, student }) {
  return (
    <> {/* Pembungkus Fragment supaya tidak error */}
      
      {/* 1. Panel Admin (Hanya muncul jika role admin) */}
      {student?.role === 'admin' && (
        <div className="mb-8"> {/* Jeda jarak ke bawah */}
          <AdminPoinPanel allStudents={allStudentsData} />
        </div>
      )}

      {/* 2. Daftar Ranking */}
      <div className="animate-in fade-in slide-in-from-bottom-4">
        {allStudentsData.length > 0 ? (
          <RankList
            students={allStudentsData}
            currentUser={student}
          />
        ) : (
          /* Tampilan Loading saat data diambil */
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest">Menyusun Peringkat...</p>
          </div>
        )}
      </div>

    </>
  );
}
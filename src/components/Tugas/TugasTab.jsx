import { FileText, Plus } from 'lucide-react';
import AssignmentCard from "./AssignmentCard";

export default function TugasTab({ 
  student, 
  assignments, 
  setShowInputTugas, 
  setSelectedTugas 
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <FileText className="text-blue-400" /> Tugas {student?.Kelas}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{assignments.length} Tugas tersedia untukmu</p>
        </div>

        {/* TOMBOL ADMIN */}
        {student?.role === 'admin' && (
          <button
            onClick={() => setShowInputTugas(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Tambah Tugas</span>
          </button>
        )}
      </div>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((t) => (
            <AssignmentCard
              key={t.id}
              data={t}
              onOpen={(val) => setSelectedTugas(val)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700">
          <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-600" size={30} />
          </div>
          <p className="text-slate-500 italic">Belum ada tugas untuk kelasmu. Santai dulu!</p>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { 
  FileText, Eye, Star, Award, MessageSquare, CheckCircle2, 
  Clock, Lock, ExternalLink, Edit3, UserCheck
} from 'lucide-react';

export default function PenilaianCardItem({
  item,
  onBeriNilai,
  onPreview
}) {
  if (!item) return null;

  const isGraded = item.nilai !== null && item.nilai !== undefined;
  const namaSiswa = item.nama || item.master_siswa?.NAMA || 'Siswa Ekstra TIK';
  const kelasSiswa = item.kelas || item.master_siswa?.Kelas || '-';
  const noAbsen = item.no_absen || item.master_siswa?.['No Absen'] || null;
  const judulTugas = item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || 'Tugas Ekstra TIK';
  const fileName = item.file_name || 'Dokumen Tugas';
  const fileUrl = item.file_url || '';

  return (
    <div
      className={`p-3.5 rounded-2xl border transition shadow-2xs space-y-2.5 ${
        isGraded
          ? 'bg-white hover:bg-emerald-50/20 border-slate-200 hover:border-emerald-300'
          : 'bg-white hover:bg-amber-50/20 border-slate-200 hover:border-amber-300'
      }`}
    >
      {/* Baris Identitas Siswa & Status Nilai */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs shrink-0">
            {namaSiswa.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
              {namaSiswa}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                {kelasSiswa}
              </span>
              {noAbsen && (
                <span className="font-mono text-[10px] text-slate-400">
                  #{noAbsen}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nilai Badge */}
        {isGraded ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="font-black text-xs font-mono">{item.nilai}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">pt</span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Belum Dinilai</span>
          </span>
        )}
      </div>

      {/* Konten Tugas */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
          <span className="text-violet-600">📑</span>
          <span className="truncate">{judulTugas}</span>
        </div>

        <p className="text-[11px] text-slate-600 truncate flex items-center gap-1 font-mono">
          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">{fileName}</span>
        </p>

        {item.catatan_siswa && (
          <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200/50 truncate">
            💬 "{item.catatan_siswa}"
          </p>
        )}

        {isGraded && item.feedback_guru && (
          <div className="text-[11px] text-emerald-900 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/70 space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <MessageSquare className="w-3 h-3" />
              <span>Catatan Guru:</span>
            </div>
            <p className="text-[11px] italic">"{item.feedback_guru}"</p>
          </div>
        )}
      </div>

      {/* Footer Info Waktu & Tombol Aksi */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-[10px] text-slate-400 font-mono truncate">
          {item.submitted_at
            ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' • ' + new Date(item.submitted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            : ''}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onPreview && onPreview(item, { canDownload: true })}
            className="inline-flex items-center gap-1 py-1.5 px-2.5 text-[11px] font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg border border-slate-200 transition cursor-pointer"
            title="Pratinjau Berkas"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat</span>
          </button>

          <button
            type="button"
            onClick={() => onBeriNilai && onBeriNilai(item)}
            className={`inline-flex items-center gap-1 py-1.5 px-3 text-[11px] font-bold rounded-lg transition shadow-2xs cursor-pointer ${
              isGraded
                ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                : 'text-white bg-violet-600 hover:bg-violet-700 shadow-violet-600/20'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isGraded ? 'Ubah Nilai' : 'Beri Nilai'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


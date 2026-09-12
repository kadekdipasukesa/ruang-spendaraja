import React from 'react';
import { FileText, Eye, ExternalLink, User } from 'lucide-react';
import { formatFileSize } from '../../services/ekstraTikService';

export default function RiwayatTugasItem({ item, activeNama, activeKelas, onPreview }) {
  return (
    <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 hover:border-indigo-200 transition space-y-2">
      {/* Identitas Siswa Pengumpul Tugas */}
      <div className="flex items-center justify-between gap-1.5 text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200/60">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3 h-3 text-indigo-600 shrink-0" />
          <span className="font-bold text-slate-800 truncate">
            {item.nama || activeNama || 'Siswa'}
          </span>
        </div>
        <span className="font-extrabold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] shrink-0 font-mono">
          {item.kelas || activeKelas || '7A'}
          {item.noAbsen ? ` • #${item.noAbsen}` : ''}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-slate-800 truncate">
            {item.judulTugas}
          </h4>
          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
            <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
            {item.fileName}
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
          Drive
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
        <span>{item.tanggal} • {item.waktu}</span>
        <span>{formatFileSize(item.fileSize)}</span>
      </div>

      {/* Tombol Preview Dokumen */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => onPreview(item)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/60 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview Dokumen</span>
        </button>
        {item.fileUrl && typeof item.fileUrl === 'string' && item.fileUrl.startsWith('http') && !item.fileUrl.includes('#') && (
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg border border-slate-200 transition"
            title="Buka di tab Google Drive"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

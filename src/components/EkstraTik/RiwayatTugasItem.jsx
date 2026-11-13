import React from 'react';
import { FileText, Eye, ExternalLink, User, Download, Check } from 'lucide-react';
import { formatFileSize } from '../../services/ekstraTikService';

export default function RiwayatTugasItem({
  item,
  activeNama,
  activeKelas,
  onPreview,
  user,
  activeSiswaId,
  isAdmin,
  isOwner
}) {
  if (!item) return null;

  // Nama dan Kelas siswa pengumpul tugas
  const namaSiswa = item.nama || item.master_siswa?.NAMA || activeNama || 'Siswa Ekstra TIK';
  const kelasSiswa = item.kelas || item.master_siswa?.Kelas || activeKelas || '-';
  const noAbsenSiswa = item.no_absen || item.noAbsen || item.master_siswa?.['No Absen'] || null;

  // Detail judul tugas, nama berkas, URL berkas, catatan siswa, dan ukuran berkas
  const judulTugas = item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || item.judulTugas || 'Tugas Ekstra TIK';
  const fileName = item.file_name || item.fileName || 'Dokumen Tugas';
  const fileUrl = item.file_url || item.fileUrl || '';
  const catatan = item.catatan_siswa || item.catatan || '';
  const fileSize = item.file_size || item.fileSize;

  // Validasi URL berkas
  const hasValidFileUrl = Boolean(
    fileUrl &&
    typeof fileUrl === 'string' &&
    fileUrl.startsWith('http') &&
    !fileUrl.includes('#')
  );

  // Format tanggal & waktu pengumpulan
  let waktuTeks = '';
  if (item.submitted_at) {
    try {
      const dateObj = new Date(item.submitted_at);
      const formattedDate = dateObj.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      waktuTeks = `${formattedDate} • ${formattedTime} WITA`;
    } catch {
      waktuTeks = String(item.submitted_at);
    }
  } else if (item.tanggal) {
    waktuTeks = item.waktu ? `${item.tanggal} • ${item.waktu}` : item.tanggal;
  }

  // Identifikasi kepemilikan file tugas (apakah berkas milik siswa yang sedang aktif/login)
  const isSelf = typeof isOwner !== 'undefined'
    ? Boolean(isOwner)
    : Boolean(
        (activeSiswaId && (item.siswa_id || item.siswaId) && String(activeSiswaId) === String(item.siswa_id || item.siswaId)) ||
        (user?.id && (item.siswa_id || item.siswaId) && String(user.id) === String(item.siswa_id || item.siswaId)) ||
        ((user?.NISN || user?.nisn) && (item.nisn || item.master_siswa?.NISN) && String(user?.NISN || user?.nisn).trim() === String(item.nisn || item.master_siswa?.NISN).trim()) ||
        (activeNama && item.nama && activeNama.trim().toLowerCase() === item.nama.trim().toLowerCase()) ||
        (user?.NAMA && item.nama && user.NAMA.trim().toLowerCase() === item.nama.trim().toLowerCase())
      );

  // Tombol download / unduh: HANYA ADA jika file tugas milik dia sendiri (atau guru/admin)
  const canDownload = isSelf || Boolean(isAdmin);

  return (
    <div className="p-3.5 bg-slate-50 hover:bg-indigo-50/20 rounded-xl border border-slate-200 hover:border-indigo-300 transition space-y-2 shadow-2xs">
      {/* Identitas Siswa Pengumpul Tugas */}
      <div className="flex items-center justify-between gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">
            {namaSiswa.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 truncate">
            {namaSiswa}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] border border-indigo-100 font-mono">
            Kelas {kelasSiswa}
          </span>
          {noAbsenSiswa && (
            <span className="text-slate-500 bg-white px-1.5 py-0.5 rounded text-[10px] border border-slate-200 font-mono">
              Absen {noAbsenSiswa}
            </span>
          )}
        </div>
      </div>

      {/* Konten Tugas & Nama Berkas */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
        <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1">
          <span className="text-indigo-600">📑</span>
          <span>{judulTugas}</span>
        </h4>
        <p className="text-[11px] text-slate-600 truncate flex items-center gap-1 font-mono">
          <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="truncate">{fileName}</span>
        </p>
        {catatan && (
          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
            "{catatan}"
          </p>
        )}
      </div>

      {/* Info Waktu & Ukuran Berkas / Status Tersimpan */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
        <span>{waktuTeks || (fileSize ? formatFileSize(fileSize) : '')}</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
          <Check className="w-3 h-3" />
          Tersimpan
        </span>
      </div>

      {/* Tombol Preview, Buka, dan Unduh */}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => onPreview && onPreview(item, { canDownload })}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
          title="Pratinjau Dokumen di Modal Multi-Engine"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview Dokumen</span>
        </button>

        {hasValidFileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg border border-slate-200 transition shrink-0"
            title="Buka File Langsung di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Tombol Unduh: Hanya muncul jika berkas adalah milik siswa itu sendiri (atau guru/admin) */}
        {canDownload && hasValidFileUrl && (
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition shrink-0"
            title="Unduh Berkas ke Perangkat"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

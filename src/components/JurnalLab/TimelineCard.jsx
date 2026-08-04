import React, { useState } from 'react';
import { 
  Clock, User, BookOpen, Users, AlertTriangle, 
  CheckCircle2, XCircle, ChevronDown, Check, X, Flag, PlayCircle, Trash2 
} from 'lucide-react';
import ModalReject from './ModalReject';
import ModalSelesai from './ModalSelesai';

export default function TimelineCard({ 
  item, 
  role, 
  role_2,
  isPengurusLab,
  currentUserId,
  onApprove, 
  onComplete,
  onDelete
}) {
  const [expanded, setExpanded] = useState(false);
  const [showSelesaiModal, setShowSelesaiModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoStr) => {
    if (!isoStr) return '00:00';
    return new Date(isoStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const now = new Date();
  const start = new Date(item.waktu_mulai);
  const end = new Date(item.waktu_selesai);

  const isOngoing = now >= start && now <= end;
  const isPast = now > end;
  const isFutureTime = now < start;
  const isRejected = item.status_pengajuan === 'rejected';
  const isPending = item.status_pengajuan === 'pending';

  const getThemeStyles = () => {
    if (isRejected) {
      return {
        line: 'border-rose-600',
        node: 'bg-rose-600 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.8)]',
        card: 'bg-gradient-to-r from-rose-950/80 via-slate-950 to-black border-rose-600/60 shadow-[0_0_15px_rgba(225,29,72,0.15)] text-rose-100',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        timeText: 'text-rose-400 font-semibold'
      };
    }
    if (isPending) {
      return {
        line: 'border-amber-500',
        node: 'bg-amber-500 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        card: 'bg-amber-950/30 border-amber-500/50 text-amber-100 shadow-amber-950/20',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        timeText: 'text-amber-400 font-semibold'
      };
    }
    if (isOngoing) {
      return {
        line: 'border-emerald-400',
        node: 'bg-emerald-400 border-emerald-200 shadow-[0_0_15px_rgba(52,211,153,1)] animate-bounce',
        card: 'bg-emerald-950/60 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-emerald-50',
        badge: 'bg-emerald-400/30 text-emerald-200 border-emerald-400/50 animate-pulse',
        timeText: 'text-emerald-300 font-bold'
      };
    }
    if (isFutureTime) {
      return {
        line: 'border-emerald-800',
        node: 'bg-emerald-800 border-emerald-600',
        card: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100/90',
        badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
        timeText: 'text-emerald-400 font-semibold'
      };
    }
    return {
      line: 'border-slate-800',
      node: 'bg-slate-800 border-slate-600',
      card: 'bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-75',
      badge: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
      timeText: 'text-slate-400'
    };
  };

  const styles = getThemeStyles();

  // 1. Pengecekan Admin, Guru, atau Pengurus Lab
  const isPengurusOrAdmin = 
    role === 'admin' || 
    role === 'guru' || 
    role === 'pengurus_lab' || 
    role_2 === 'pengurus_lab' || 
    Boolean(isPengurusLab);

  // 2. Ambil ID pembuat/pemohon pengajuan dari backend
  const ownerId = item.created_by || item.user_id || item.pemohon_id || item.pemohon?.id;
  
  // 3. Cek apakah user saat ini adalah orang yang mengajukan
  const isOwner = Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId));

  // 4. Hak Akses Hapus: Harus ada handler onDelete DAN (Admin/Pengurus Lab OR Pemohon Asal)
  const canDelete = Boolean(onDelete) && (
    role === 'admin' || 
    role === 'pengurus_lab' || 
    role_2 === 'pengurus_lab' || 
    Boolean(isPengurusLab) || 
    isOwner
  );

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div id={`timeline-item-${item.id}`} className={`relative pl-5 md:pl-7 border-l-2 ${styles.line} pb-5 last:pb-0`}>
      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${styles.node}`} />

      <div className={`border rounded-xl p-3.5 transition-all duration-200 shadow-md ${styles.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
              {formatDate(item.waktu_mulai)}
            </span>
            <span>•</span>
            <span className={styles.timeText}>
              {formatTime(item.waktu_mulai)} - {formatTime(item.waktu_selesai)} WITA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${styles.badge}`}>
              {isRejected && <><XCircle className="w-3 h-3" /> Ditolak</>}
              {isPending && <><Clock className="w-3 h-3" /> Belum Dikonfirmasi</>}
              {isOngoing && <><PlayCircle className="w-3 h-3" /> Sedang Berlangsung</>}
              {isPast && !isRejected && <><CheckCircle2 className="w-3 h-3" /> Selesai / Berlalu</>}
              {isFutureTime && !isPending && !isRejected && <><CheckCircle2 className="w-3 h-3" /> Disetujui</>}
            </span>

            {canDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                title="Hapus Pengajuan"
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            {item.mata_pelajaran || 'Kegiatan Lab'}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 font-normal border border-slate-800">
              Kelas {item.kelas}
            </span>
            {item.kategori_kegiatan && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-medium border border-indigo-800/60">
                {item.kategori_kegiatan}
              </span>
            )}
          </h3>
          <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{item.materi_kegiatan || 'Tidak ada uraian materi.'}</p>
        </div>

        <div className="flex items-center gap-4 text-xs opacity-80 mt-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1 truncate">
            <User className="w-3 h-3 shrink-0 opacity-60" />
            <span className="truncate">Guru: <strong>{item.guru_pengajar}</strong></span>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-2 border-t border-white/10 text-xs space-y-1.5 bg-black/40 p-2.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 opacity-60 shrink-0" />
              <span>Jumlah Siswa: <strong>{item.jumlah_siswa}</strong> siswa</span>
            </div>

            {item.pemohon?.NAMA && <div><span className="opacity-60">Diajukan Oleh:</span> {item.pemohon.NAMA} ({item.pemohon.Kelas})</div>}
            
            {item.acc_by && <div><span className="opacity-60">Pengurus Lab:</span> {item.acc_by}</div>}
            
            {item.alasan_penolakan && <div className="text-rose-400 font-semibold"><span className="opacity-70">Alasan Penolakan:</span> {item.alasan_penolakan}</div>}
            
            {item.kondisi_akhir && (
              <div className="flex items-center gap-4 pt-1 border-t border-white/5 mt-1">
                <div><span className="opacity-60">Kondisi Awal:</span> <span className="font-semibold">{item.kondisi_awal || 'Baik'}</span></div>
                <div><span className="opacity-60">Kondisi Akhir:</span> <span className="font-semibold">{item.kondisi_akhir}</span></div>
              </div>
            )}

            {item.catatan_kendala && (
              <div className="text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-start gap-1.5 mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div><strong>Kendala:</strong> {item.catatan_kendala}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-3 pt-1">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] opacity-80 hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer"
          >
            {expanded ? 'Sembunyikan' : 'Lihat Detail'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-1.5">
            {isPengurusOrAdmin && item.status_pengajuan === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove && onApprove(item.id, 'approved')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                >
                  <Check className="w-3 h-3" /> ACC
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Tolak
                </button>
              </>
            )}

            {isPengurusOrAdmin && (item.status_pengajuan === 'approved' || item.status_pengajuan === 'completed') && (
              <button
                type="button"
                onClick={() => setShowSelesaiModal(true)}
                className={`px-2.5 py-1 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow transition-all cursor-pointer ${
                  isPast ? 'bg-slate-700 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <Flag className="w-3 h-3" /> 
                {isPast ? 'Isi Jurnal / Laporan Lab' : 'Selesaikan Jam Lab'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Hapus Pengajuan Ini?</h4>
            <p className="text-xs text-slate-400 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalReject
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(alasan) => onApprove && onApprove(item.id, 'rejected', alasan)}
      />

      <ModalSelesai
        isOpen={showSelesaiModal}
        onClose={() => setShowSelesaiModal(false)}
        onConfirm={(payload) => onComplete && onComplete(item.id, payload)}
      />
    </div>
  );
}
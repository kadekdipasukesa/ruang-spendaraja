import React, { useState } from 'react';
import { 
  Clock, User, BookOpen, Users, AlertTriangle, 
  CheckCircle2, XCircle, ChevronDown, Check, X, PlayCircle, Trash2, Pencil,
  FileEdit, FileCheck, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import ModalReject from './ModalReject';
import ModalSelesai from './ModalSelesai';

export default function TimelineCard({ 
  item, 
  role, 
  role_2,
  isPengurusLab,
  currentUserId,
  currentUserNama,
  currentUser,
  onApprove, 
  onComplete,
  onEdit,
  onDelete
}) {
  const [expanded, setExpanded] = useState(false);
  const [showSelesaiModal, setShowSelesaiModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleDateString('id-ID', {
      timeZone: 'Asia/Makassar',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (isoStr) => {
    if (!isoStr) return '00:00';
    return new Date(isoStr).toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace('.', ':');
  };

  const now = new Date();
  const start = new Date(item?.waktu_mulai);
  const end = new Date(item?.waktu_selesai);

  // Status berdasarkan Waktu
  const isOngoing = now >= start && now <= end;
  const isPast = now > end;
  const isFutureTime = now < start;

  // Status berdasarkan Pengajuan Backend
  const isRejected = item?.status_pengajuan === 'rejected';
  const isPending = item?.status_pengajuan === 'pending';
  const isApproved = item?.status_pengajuan === 'approved';
  const isCompleted = item?.status_pengajuan === 'completed';

  // Cek apakah jurnal sudah diisi
  // Jurnal dianggap SUDAH DIISI jika:
  // - status_pengajuan === 'completed' ATAU
  // - kondisi_akhir berisi JSON valid dari form checklist pengembalian
  // Nilai default ('Baik', 'baik', '', null, '{}') TIDAK dianggap sudah isi jurnal.
  const hasFilledJurnal = (() => {
    if (item?.status_pengajuan === 'completed') return true;
    if (!item?.kondisi_akhir) return false;
    const raw = String(item.kondisi_akhir).trim();
    if (!raw || raw === 'Baik' || raw === 'baik' || raw === '{}' || raw === 'null') {
      return false;
    }
    try {
      const parsed = typeof item.kondisi_akhir === 'object' ? item.kondisi_akhir : JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if ('elektronik_dimatikan' in parsed || 'ruangan_dibersihkan' in parsed || 'kursi_dirapikan' in parsed) {
          return true;
        }
      }
    } catch (e) {
      return raw.length > 5 && raw.toLowerCase() !== 'baik';
    }
    return false;
  })();

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

  // 1. Pengecekan Pengurus Lab atau Admin
  const isPengurusOrAdmin = Boolean(
    isPengurusLab || 
    currentUser?.role === 'admin' || 
    currentUser?.role_2 === 'pengurus_lab' ||
    role === 'admin' || 
    role === 'pengurus_lab' || 
    role_2 === 'pengurus_lab'
  );

  // 2. Ambil ID & Nama pembuat/pemohon pengajuan dari backend
  const ownerId = item?.pemohon_id || item?.user_id || item?.created_by || item?.pemohon?.id;
  const activeUserId = currentUserId || currentUser?.id;
  const activeUserNama = currentUserNama || currentUser?.NAMA || currentUser?.nama;
  
  // 3. Cek apakah user saat ini adalah pemilik pengajuan (Owner)
  const isOwner = Boolean(
    (activeUserId && ownerId && String(activeUserId) === String(ownerId)) ||
    (activeUserNama && item?.guru_pengajar && item.guru_pengajar.trim().toLowerCase() === activeUserNama.trim().toLowerCase()) ||
    (activeUserNama && item?.pemohon?.NAMA && item.pemohon.NAMA.trim().toLowerCase() === activeUserNama.trim().toLowerCase())
  );

  // 4. Hak Akses:
  // - Hapus & Edit Pengajuan: Pengurus/Admin ATAU Pemilik Pengajuan Sendiri
  // - Selesaikan Jam Lab / Isi Jurnal: HANYA Pemilik Pengajuan (isOwner) saat status approved atau completed. Pengurus lab tidak bisa jika bukan owner.
  const canDelete = Boolean(onDelete) && (isPengurusOrAdmin || isOwner);
  const canEdit = Boolean(onEdit) && (isPengurusOrAdmin || isOwner);
  const canFillJournal = Boolean(onComplete) && isOwner && (isApproved || isCompleted);

  const handleDelete = () => {
    if (onDelete && item?.id) {
      onDelete(item.id);
    }
    setShowDeleteConfirm(false);
  };

  // Helper untuk merender kondisi akhir secara rapi dan manusiawi
  const renderKondisiAkhir = (kondisiStr) => {
    if (!kondisiStr) {
      return (
        <div className="text-amber-300/90 text-[11px] bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Jurnal pengembalian lab <strong>belum diisi</strong> oleh peminjam.</span>
        </div>
      );
    }

    const raw = String(kondisiStr).trim();
    if (raw === 'Baik' || raw === 'baik' || raw === '{}' || raw === 'null') {
      return (
        <div className="text-amber-300/90 text-[11px] bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Jurnal pengembalian lab <strong>belum diisi</strong> oleh peminjam (status masih default database).</span>
        </div>
      );
    }

    let parsed = null;
    if (typeof kondisiStr === 'object') {
      parsed = kondisiStr;
    } else {
      try {
        parsed = JSON.parse(kondisiStr);
      } catch (e) {
        // Fallback string biasa
      }
    }

    if (parsed && typeof parsed === 'object' && ('elektronik_dimatikan' in parsed || 'ruangan_dibersihkan' in parsed || 'kursi_dirapikan' in parsed)) {
      const { elektronik_dimatikan, ruangan_dibersihkan, kursi_dirapikan } = parsed;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] border ${
            elektronik_dimatikan 
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
          }`}>
            {elektronik_dimatikan ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            <span>Elektronik / PC {elektronik_dimatikan ? 'Dimatikan' : 'Belum Dimatikan'}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] border ${
            ruangan_dibersihkan 
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
          }`}>
            {ruangan_dibersihkan ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            <span>Ruangan {ruangan_dibersihkan ? 'Bersih & Disapu' : 'Belum Disapu'}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] border ${
            kursi_dirapikan 
              ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
          }`}>
            {kursi_dirapikan ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            <span>Kursi & Meja {kursi_dirapikan ? 'Dirapikan' : 'Belum Rapi'}</span>
          </div>
        </div>
      );
    }

    return <span className="font-semibold text-slate-200">{String(kondisiStr)}</span>;
  };

  return (
    <div id={`timeline-item-${item?.id}`} className={`relative pl-5 md:pl-7 border-l-2 ${styles.line} pb-5 last:pb-0`}>
      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${styles.node}`} />

      <div className={`border rounded-2xl p-3.5 sm:p-4 transition-all duration-200 shadow-md ${styles.card}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
              {formatDate(item?.waktu_mulai)}
            </span>
            <span>•</span>
            <span className={styles.timeText}>
              {formatTime(item?.waktu_mulai)} - {formatTime(item?.waktu_selesai)} WITA
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status Pengajuan Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${styles.badge}`}>
              {isRejected && <><XCircle className="w-3 h-3" /> Ditolak</>}
              {isPending && <><Clock className="w-3 h-3" /> Belum Dikonfirmasi</>}
              {isOngoing && !isRejected && <><PlayCircle className="w-3 h-3" /> Sedang Berlangsung</>}
              {isCompleted && <><CheckCircle2 className="w-3 h-3" /> Selesai</>}
              {isApproved && !isOngoing && !isCompleted && (
                <><CheckCircle2 className="w-3 h-3" /> {isPast ? 'Selesai / Berlalu' : 'Disetujui'}</>
              )}
            </span>

            {/* Indikator Status Pengisian Jurnal (Jurnal Terisi / Belum Isi Jurnal) */}
            {(isApproved || isCompleted) && (
              hasFilledJurnal ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Jurnal Terisi
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" /> Belum Isi Jurnal
                </span>
              )
            )}

            {/* Tombol Edit */}
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                title="Edit Pengajuan"
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Tombol Hapus */}
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
            {item?.mata_pelajaran || 'Kegiatan Lab'}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 font-normal border border-slate-800">
              Kelas {item?.kelas || '-'}
            </span>
            {item?.kategori_kegiatan && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-medium border border-indigo-800/60">
                {item.kategori_kegiatan}
              </span>
            )}
          </h3>
          <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{item?.materi_kegiatan || 'Tidak ada uraian materi.'}</p>
        </div>

        <div className="flex items-center gap-4 text-xs opacity-80 mt-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1 truncate">
            <User className="w-3 h-3 shrink-0 opacity-60" />
            <span className="truncate">Peminjam: <strong>{item?.guru_pengajar || '-'}</strong></span>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-2.5 border-t border-white/10 text-xs space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/70">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 opacity-60 shrink-0 text-indigo-400" />
              <span>Jumlah Peserta: <strong>{item?.jumlah_siswa || 0}</strong> orang</span>
            </div>

            {item?.pemohon?.NAMA && (
              <div><span className="opacity-60">Akun Pengaju:</span> {item.pemohon.NAMA} ({item.pemohon.Kelas})</div>
            )}
            
            {item?.acc_by && (
              <div><span className="opacity-60">Persetujuan Oleh:</span> <strong className="text-emerald-400">{item.acc_by}</strong></div>
            )}
            
            {item?.alasan_penolakan && (
              <div className="text-rose-400 font-semibold bg-rose-950/30 border border-rose-800/50 p-2 rounded-lg">
                <span className="opacity-70">Alasan Penolakan:</span> {item.alasan_penolakan}
              </div>
            )}

            {/* Rincian Kondisi Awal & Akhir Ruangan */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="opacity-70">Kondisi Awal Fasilitas:</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 font-semibold text-[11px]">
                  {item?.kondisi_awal || 'Baik'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kondisi Akhir Pengembalian Lab:</span>
                </div>
                {renderKondisiAkhir(item?.kondisi_akhir)}
              </div>
            </div>

            {item?.catatan_kendala && (
              <div className="text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-1.5 mt-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div><strong>Catatan Kendala / Kerusakan:</strong> {item.catatan_kendala}</div>
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Tombol ACC & Tolak: HANYA Pengurus Lab / Admin */}
            {isPengurusOrAdmin && isPending && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove && onApprove(item.id, 'approved')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow cursor-pointer transition-colors"
                >
                  <Check className="w-3 h-3" /> ACC
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X className="w-3 h-3" /> Tolak
                </button>
              </>
            )}

            {/* Tombol Isi / Edit Jurnal Lab: HANYA Pemilik Pengajuan (isOwner) saat Disetujui/Selesai */}
            {canFillJournal && (
              <button
                type="button"
                onClick={() => setShowSelesaiModal(true)}
                className={`px-3 py-1 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all cursor-pointer ${
                  !hasFilledJurnal
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                }`}
              >
                {!hasFilledJurnal ? (
                  <>
                    <FileEdit className="w-3.5 h-3.5 text-amber-200" /> 
                    <span>Isi Jurnal Lab (Belum Diisi)</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5 text-indigo-200" /> 
                    <span>Lihat / Edit Jurnal Lab</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
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
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
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
        item={item}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Shield, Lock, Unlock, Download, RefreshCw, CheckCircle2, AlertTriangle, 
  FileSpreadsheet, Users, Database, UserX, Calendar
} from 'lucide-react';
import { 
  setStatusAbsenEkstra, 
  generatePresensiCsv, 
  downloadCsvFile 
} from '../../services/ekstraTikService';
import ModalTandaiAlpa from './ModalTandaiAlpa';

export default function EkstraAdminControl({
  isLocked,
  setIsLocked,
  anggotaList = [],
  presensiList = [],
  onRefreshData
}) {
  const [updating, setUpdating] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showModalAlpa, setShowModalAlpa] = useState(false);
  const [isCloseSessionFlow, setIsCloseSessionFlow] = useState(false);

  const executeToggleLock = async (targetNextState) => {
    setUpdating(true);
    setMsg(null);
    try {
      await setStatusAbsenEkstra(targetNextState);
      setIsLocked(targetNextState);
      setMsg({
        type: 'success',
        text: targetNextState
          ? 'Sesi absen berhasil DITUTUP. Siswa tidak dapat melakukan presensi.'
          : 'Sesi absen berhasil DIBUKA. Siswa dapat mengisi presensi.'
      });
      setTimeout(() => setMsg(null), 4000);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Gagal memperbarui status kunci absen:', err);
      setMsg({
        type: 'error',
        text: 'Gagal mengubah status: ' + (err.message || 'Koneksi bermasalah')
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleLockClick = () => {
    // Jika sesi saat ini DIBUKA dan mau DITUTUP
    if (!isLocked) {
      const todayIso = new Date().toISOString().split('T')[0];
      const todayPresensi = presensiList.filter((p) => p.tanggal === todayIso);
      const existingSet = new Set();
      todayPresensi.forEach((p) => {
        if (p.siswa_id) existingSet.add(String(p.siswa_id));
        if (p.nama) existingSet.add(`${p.nama.toLowerCase().trim()}_${p.kelas || ''}`);
      });

      const unrecorded = anggotaList.filter((m) => {
        if (m.siswa_id && existingSet.has(String(m.siswa_id))) return false;
        const fallbackKey = `${(m.nama || '').toLowerCase().trim()}_${m.kelas || ''}`;
        if (existingSet.has(fallbackKey)) return false;
        return true;
      });

      // Jika masih ada siswa yang belum absen hari ini, tawarkan modal konfirmasi alpa
      if (unrecorded.length > 0) {
        setIsCloseSessionFlow(true);
        setShowModalAlpa(true);
        return;
      }
    }

    // Jika semua sudah absen atau sedang mau membuka sesi
    executeToggleLock(!isLocked);
  };

  const handleOpenManualAlpaModal = () => {
    setIsCloseSessionFlow(false);
    setShowModalAlpa(true);
  };

  const handleAlpaSuccess = async (andCloseSession = false) => {
    if (andCloseSession) {
      await executeToggleLock(true);
    }
    if (onRefreshData) onRefreshData();
    setMsg({
      type: 'success',
      text: 'Status presensi Alpa siswa berhasil diperbarui!'
    });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleDownloadCsv = () => {
    try {
      setDownloadingCsv(true);
      const csv = generatePresensiCsv(anggotaList, presensiList);
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      downloadCsvFile(csv, `Rekap_Presensi_Ekstra_TIK_${dateStr}.csv`);
      setMsg({
        type: 'success',
        text: 'File rekap presensi (.CSV) berhasil diunduh!'
      });
      setTimeout(() => setMsg(null), 3500);
    } catch (err) {
      console.error('Gagal mengekspor CSV:', err);
      setMsg({
        type: 'error',
        text: 'Gagal membuat file CSV: ' + err.message
      });
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-indigo-500/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info Kontrol */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0 text-violet-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                Panel Pembina Ekstra TIK
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3" />
                SUPABASE NATIVE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-violet-500/30 text-violet-200 rounded-full border border-violet-400/20">
                {anggotaList.length} Anggota Terdata
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                RUTIN SETIAP JUMAT
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
              Kontrol Presensi & Rekap Ekstrakurikuler
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {isLocked ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 inline" /> Presensi saat ini DITUTUP (Terkunci untuk siswa)
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 inline" /> Presensi saat ini DIBUKA (Siswa dapat melakukan absen)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Tombol Manual Tandai Alpa Siswa Belum Absen */}
          <button
            type="button"
            onClick={handleOpenManualAlpaModal}
            disabled={anggotaList.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-rose-600/90 hover:bg-rose-600 text-white transition shadow-lg shadow-rose-950/30 border border-rose-500/40 cursor-pointer disabled:opacity-50"
            title="Tandai siswa yang belum memiliki absensi sebagai Alpa"
          >
            <UserX className="w-4 h-4" />
            <span>Tandai Alpa</span>
          </button>

          {/* Tombol Download CSV */}
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={downloadingCsv || anggotaList.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-950/30 cursor-pointer disabled:opacity-50"
            title="Download Rekap Matriks Presensi ke format Excel/CSV"
          >
            <Download className="w-4 h-4" />
            <span>Download Rekap (.CSV)</span>
          </button>

          {/* Tombol Buka / Tutup Absen */}
          <button
            type="button"
            onClick={handleToggleLockClick}
            disabled={updating}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-lg cursor-pointer ${
              isLocked
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/20'
            } disabled:opacity-50`}
          >
            {updating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : isLocked ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Buka Sesi Absen</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Tutup Sesi Absen</span>
              </>
            )}
          </button>

          {onRefreshData && (
            <button
              type="button"
              onClick={onRefreshData}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
              title="Perbarui Data Realtime"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert */}
      {msg && (
        <div
          className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-150 ${
            msg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Modal Kelola / Konfirmasi Alpa */}
      <ModalTandaiAlpa
        isOpen={showModalAlpa}
        onClose={() => setShowModalAlpa(false)}
        anggotaList={anggotaList}
        presensiList={presensiList}
        isCloseSessionFlow={isCloseSessionFlow}
        onSuccess={handleAlpaSuccess}
        onCloseSessionOnly={() => executeToggleLock(true)}
      />
    </div>
  );
}

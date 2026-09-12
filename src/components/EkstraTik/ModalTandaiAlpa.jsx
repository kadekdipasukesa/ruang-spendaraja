import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, CheckCircle2, UserX, Users, Calendar, Clock, 
  RefreshCw, X, ShieldAlert, Check
} from 'lucide-react';
import { tandaiAlpaSiswaBelumAbsen } from '../../services/ekstraTikService';

export default function ModalTandaiAlpa({
  isOpen,
  onClose,
  tanggalAwal = '',
  anggotaList = [],
  presensiList = [],
  isCloseSessionFlow = false,
  onSuccess,
  onCloseSessionOnly
}) {
  const [selectedTanggal, setSelectedTanggal] = useState(
    tanggalAwal || new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Format teks hari dan tanggal bahasa Indonesia
  const formattedDayString = useMemo(() => {
    if (!selectedTanggal) return '';
    try {
      const parts = selectedTanggal.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const hari = d.toLocaleDateString('id-ID', { weekday: 'long' });
        const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        return `${hari}, ${tgl}`;
      }
      return selectedTanggal;
    } catch {
      return selectedTanggal;
    }
  }, [selectedTanggal]);

  // Hitung siswa yang sudah dan belum absen pada tanggal yang dipilih
  const { sudahAbsen, belumAbsen, breakdown } = useMemo(() => {
    const existing = presensiList.filter((p) => p.tanggal === selectedTanggal);
    const existingSet = new Set();
    const bd = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 };

    existing.forEach((p) => {
      if (p.siswa_id) {
        existingSet.add(String(p.siswa_id));
      }
      if (p.nama) {
        existingSet.add(`${p.nama.toLowerCase().trim()}_${p.kelas || ''}`);
      }
      if (bd[p.status_kehadiran] !== undefined) {
        bd[p.status_kehadiran]++;
      }
    });

    const unrecorded = [];
    const recorded = [];

    anggotaList.forEach((m) => {
      const hasSid = m.siswa_id && existingSet.has(String(m.siswa_id));
      const hasName = m.nama && existingSet.has(`${m.nama.toLowerCase().trim()}_${m.kelas || ''}`);
      if (hasSid || hasName) {
        recorded.push(m);
      } else {
        unrecorded.push(m);
      }
    });

    return {
      sudahAbsen: recorded,
      belumAbsen: unrecorded,
      breakdown: bd
    };
  }, [presensiList, anggotaList, selectedTanggal]);

  if (!isOpen) return null;

  const handleEksekusiAlpa = async (andCloseSession = false) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await tandaiAlpaSiswaBelumAbsen({
        tanggal: selectedTanggal,
        anggotaList
      });

      setSuccessMsg(
        `Berhasil menandai ${res.updatedCount} siswa sebagai Alpa untuk pertemuan ${formattedDayString}.`
      );

      if (onSuccess) {
        onSuccess(andCloseSession);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Gagal menandai Alpa:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses data ke Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {isCloseSessionFlow ? 'Tutup Sesi & Konfirmasi Alpa' : 'Tandai Siswa Belum Absen (Alpa)'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Jadwal Rutin: <span className="text-amber-300 font-semibold">Setiap Hari Jumat</span> • Pembina TIK
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Modal */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Pilihan Tanggal Pertemuan */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Tanggal Pertemuan Ekstra:
              </label>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                {formattedDayString}
              </span>
            </div>
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
            />
          </div>

          {/* Kartu Ringkasan Status Presensi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="block text-lg font-black text-emerald-700">{breakdown.Hadir}</span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Hadir</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="block text-lg font-black text-amber-700">{breakdown.Izin}</span>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Izin</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="block text-lg font-black text-blue-700">{breakdown.Sakit}</span>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Sakit</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="block text-lg font-black text-rose-700">{belumAbsen.length}</span>
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Belum Absen</span>
            </div>
          </div>

          {/* Kondisi Jika Semua Sudah Absen */}
          {belumAbsen.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-bold block">
                  Semua 42 Anggota Sudah Memiliki Catatan Presensi!
                </strong>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Tidak ada anggota yang berstatus kosong pada tanggal {formattedDayString}.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  Daftar Siswa Belum Absen ({belumAbsen.length} Orang):
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Akan ditandai sebagai: <strong className="text-rose-600">Alpa</strong>
                </span>
              </div>

              {/* Scrollable list siswa yang belum absen */}
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 divide-y divide-slate-200/70 p-1">
                {belumAbsen.map((s, idx) => (
                  <div
                    key={s.id || s.siswa_id || idx}
                    className="p-2 text-xs flex items-center justify-between hover:bg-white rounded-lg transition"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 text-center font-mono text-[10px] text-slate-400">
                        {idx + 1}.
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{s.nama}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                      Kelas {s.kelas}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                * Siswa yang ditandai Alpa tetap dapat diubah menjadi Hadir/Izin/Sakit sewaktu-waktu oleh Guru/Admin melalui Formulir Kehadiran.
              </p>
            </div>
          )}

          {/* Alert Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Alert Sukses */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Tombol Aksi */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>

          {isCloseSessionFlow && (
            <button
              type="button"
              onClick={() => {
                if (onCloseSessionOnly) onCloseSessionOnly();
                onClose();
              }}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
            >
              Tutup Sesi Saja (Tanpa Alpa)
            </button>
          )}

          {belumAbsen.length > 0 && (
            <button
              type="button"
              onClick={() => handleEksekusiAlpa(isCloseSessionFlow)}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses ke Supabase...</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5" />
                  <span>
                    {isCloseSessionFlow
                      ? `Tutup Sesi & Tandai ${belumAbsen.length} Siswa Alpa`
                      : `Tandai ${belumAbsen.length} Siswa Alpa`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

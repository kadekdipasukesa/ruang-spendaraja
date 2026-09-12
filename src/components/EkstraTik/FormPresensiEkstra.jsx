import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserCheck, CheckCircle2, Clock, Calendar, AlertCircle, Lock, Send, RefreshCw, Check, Database } from 'lucide-react';
import { 
  kirimPresensiEkstraSupabase, 
  getRiwayatPresensiSiswa, 
  getPresensiEkstra,
  subscribePresensiEkstra
} from '../../services/ekstraTikService';
import RiwayatPresensiList from './RiwayatPresensiList';
import MemberSelectorDropdown from './MemberSelectorDropdown';

export default function FormPresensiEkstra({ 
  user, 
  isLocked, 
  anggotaList = [], 
  allPresensiList = [],
  onRefreshData,
  onOpenLogin 
}) {
  const [status, setStatus] = useState('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [riwayatSiswa, setRiwayatSiswa] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);

  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [targetTanggal, setTargetTanggal] = useState(todayIso);

  const isAdminOrGuru = user?.role === 'admin' || user?.role === 'guru' || user?.role_2 === 'admin';

  // Form input jika memilih anggota dari list (khusus admin/guru) atau profil login
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [manualNama, setManualNama] = useState('');
  const [manualKelas, setManualKelas] = useState('7A');
  const [manualNisn, setManualNisn] = useState('');
  const [manualNoAbsen, setManualNoAbsen] = useState('');

  // Identitas aktif: Jika admin memilih siswa dari dropdown, gunakan data pilihan admin.
  // Jika siswa biasa login, selalu gunakan profil user yang terautentikasi.
  const activeNama = isAdminOrGuru 
    ? (selectedAnggota ? selectedAnggota.nama : manualNama || user?.NAMA || '')
    : (user?.NAMA || '');

  const activeKelas = isAdminOrGuru
    ? (selectedAnggota ? selectedAnggota.kelas : manualKelas || user?.Kelas || '7A')
    : (user?.Kelas || '');

  const activeNisn = isAdminOrGuru
    ? (selectedAnggota ? selectedAnggota.nisn : manualNisn || user?.NISN || '')
    : (user?.NISN || '');

  const activeNoAbsen = isAdminOrGuru
    ? (selectedAnggota ? selectedAnggota.no_absen : manualNoAbsen || user?.['No Absen'] || '')
    : (user?.['No Absen'] || '');

  const activeSiswaId = isAdminOrGuru
    ? (selectedAnggota?.siswa_id || null)
    : (user?.id || null);

  // Cek apakah siswa terdaftar di anggotaList (tabel ekstra_anggota)
  const registeredMember = useMemo(() => {
    if (isAdminOrGuru && selectedAnggota) {
      return selectedAnggota;
    }
    if (user?.id) {
      const byId = anggotaList.find((m) => String(m.siswa_id) === String(user.id));
      if (byId) return byId;
    }
    if (!activeNama) return null;
    return anggotaList.find(
      (m) =>
        (activeNisn && m.nisn && m.nisn === activeNisn) ||
        (m.nama?.toLowerCase().trim() === activeNama?.toLowerCase().trim() && m.kelas === activeKelas) ||
        (m.nama?.toLowerCase().trim() === activeNama?.toLowerCase().trim())
    );
  }, [anggotaList, user, selectedAnggota, activeNama, activeKelas, activeNisn, isAdminOrGuru]);

  // Muat riwayat presensi khusus siswa ini dari Supabase
  const loadRiwayatSiswa = useCallback(async () => {
    const studentSiswaId = registeredMember?.siswa_id || activeSiswaId || user?.id || null;
    const studentNama = registeredMember ? registeredMember.nama : activeNama;
    const studentNisn = registeredMember?.nisn || activeNisn;

    if (!studentSiswaId && !studentNama && !studentNisn) {
      setRiwayatSiswa([]);
      return;
    }

    setLoadingRiwayat(true);
    try {
      const data = await getRiwayatPresensiSiswa({
        siswa_id: studentSiswaId,
        nama: studentNama,
        nisn: studentNisn
      });
      setRiwayatSiswa(data || []);
    } catch (e) {
      console.warn('Gagal memuat presensi siswa:', e);
    } finally {
      setLoadingRiwayat(false);
    }
  }, [registeredMember, activeSiswaId, user, activeNama, activeNisn]);

  useEffect(() => {
    loadRiwayatSiswa();
  }, [loadRiwayatSiswa, allPresensiList]);

  // Cek apakah siswa ini sudah absen hari ini
  const existingTodayAttendance = useMemo(() => {
    if (!riwayatSiswa || riwayatSiswa.length === 0) return null;
    return riwayatSiswa.find((item) => item.tanggal === (isAdminOrGuru ? targetTanggal : todayIso));
  }, [riwayatSiswa, todayIso, targetTanggal, isAdminOrGuru]);

  const hasAttendedToday = Boolean(existingTodayAttendance);

  const handleSelectMember = (member) => {
    setSelectedAnggota(member);
    setManualNama(member.nama);
    setManualKelas(member.kelas);
    setManualNoAbsen(member.no_absen ? String(member.no_absen) : '');
    setManualNisn(member.nisn || '');
    setErrorMsg('');
    setSuccessData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessData(null);

    // Untuk siswa biasa yang belum login
    if (!user && !isAdminOrGuru) {
      setErrorMsg('Silakan login terlebih dahulu untuk melakukan presensi kehadiran.');
      return;
    }

    if (!activeNama.trim()) {
      setErrorMsg('Nama lengkap siswa tidak teridentifikasi.');
      return;
    }

    if (!registeredMember && !isAdminOrGuru) {
      setErrorMsg(
        `Akun "${activeNama}" belum terdaftar di daftar 42 Anggota Resmi Ekstrakurikuler TIK.`
      );
      return;
    }

    if (isLocked && !isAdminOrGuru) {
      setErrorMsg(
        'Sesi presensi sedang DITUTUP oleh Guru/Pembina TIK. Mohon tunggu hingga sesi dibuka.'
      );
      return;
    }

    if (hasAttendedToday && !isAdminOrGuru) {
      setErrorMsg(
        `Anda sudah melakukan presensi pada tanggal ${todayIso} (${existingTodayAttendance?.status_kehadiran || 'Hadir'}). Setiap siswa hanya dapat absen 1 kali per hari.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const dateToUse = isAdminOrGuru ? (targetTanggal || todayIso) : todayIso;
      const statusToUse = isAdminOrGuru ? status : 'Hadir'; // Siswa biasa selalu Hadir

      const payload = {
        tanggal: dateToUse,
        nama: registeredMember ? registeredMember.nama : activeNama,
        kelas: registeredMember ? registeredMember.kelas : activeKelas,
        nisn: registeredMember?.nisn || activeNisn || null,
        siswa_id: registeredMember?.siswa_id || activeSiswaId || user?.id || null,
        status_kehadiran: statusToUse,
        keterangan: keterangan.trim() || null
      };

      const res = await kirimPresensiEkstraSupabase(payload);
      setSuccessData(res);
      setKeterangan('');
      loadRiwayatSiswa();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Gagal mengirim presensi:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan presensi ke Supabase');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Kolom Kiri: Formulir Absensi Siswa */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-800">
                    Formulir Kehadiran
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-bold">
                    Jumat Rutin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Ekstrakurikuler TIK SMPN 2 Singaraja
                </p>
              </div>
            </div>

            {/* Quick selector dropdown: HANYA untuk Admin & Guru */}
            {isAdminOrGuru && (
              <MemberSelectorDropdown 
                anggotaList={anggotaList}
                onSelectMember={handleSelectMember} 
              />
            )}
          </div>

          {/* Banner Peringatan Kunci Sesi Absen */}
          {isLocked && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
              <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {isAdminOrGuru ? 'Sesi Presensi Terkunci untuk Siswa' : 'Presensi Sedang Ditutup Pembina!'}
                </strong>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  {isAdminOrGuru
                    ? 'Siswa tidak dapat melakukan absen mandiri. Namun Anda sebagai Guru/Admin tetap dapat mendata atau mengedit presensi anggota di bawah ini.'
                    : 'Pembina TIK sedang mengunci sesi absensi. Siswa baru dapat mengisi presensi saat sesi dibuka kembali oleh Guru.'}
                </p>
              </div>
            </div>
          )}

          {/* Banner Sudah Absen Hari Ini (khusus siswa) */}
          {hasAttendedToday && !isAdminOrGuru && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Anda Sudah Presensi Hari Ini!</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Kehadiran Anda pada tanggal <strong>{todayIso}</strong> tercatat sebagai{' '}
                  <span className="font-bold underline">{existingTodayAttendance.status_kehadiran}</span>.
                </p>
              </div>
            </div>
          )}

          {/* Jika Siswa Biasa Belum Login */}
          {!user && !isAdminOrGuru ? (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3 my-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Login Diperlukan untuk Presensi
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Hanya 42 anggota resmi yang dapat melakukan presensi kehadiran di Lab Komputer.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Masuk / Login Akun Siswa
              </button>
            </div>
          ) : (
            /* Form Input */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Mode Admin/Guru: Pilihan Tanggal & Selector Anggota */}
              {isAdminOrGuru && (
                <div className="p-3 bg-violet-50/70 border border-violet-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-violet-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-violet-700" />
                      Tanggal Pertemuan (Jumat):
                    </span>
                    <span className="text-[10px] text-violet-700 font-mono font-semibold">
                      Mode Pembina TIK
                    </span>
                  </div>
                  <input
                    type="date"
                    value={targetTanggal}
                    onChange={(e) => setTargetTanggal(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-violet-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono text-slate-800"
                  />
                </div>
              )}

              {/* Identitas Siswa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                {isAdminOrGuru ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={activeNama}
                      onChange={(e) => {
                        setSelectedAnggota(null);
                        setManualNama(e.target.value);
                      }}
                      placeholder="Pilih anggota dari tombol dropdown di kanan atas..."
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800"
                      required
                    />
                    {registeredMember ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Terverifikasi Anggota #{registeredMember.no_daftar} (Kelas {registeredMember.kelas})</span>
                      </div>
                    ) : activeNama ? (
                      <div className="text-[10px] text-amber-600 font-medium">
                        ⚠️ Belum terdaftar di 42 ekstra_anggota. Gunakan tombol "Pilih dari Daftar Anggota".
                      </div>
                    ) : null}
                  </div>
                ) : (
                  /* Mode Siswa: Kunci Identitas Berdasarkan Login */
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {activeNama}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                        Kelas {activeKelas} • Absen {activeNoAbsen || '-'}
                      </span>
                    </div>
                    {registeredMember ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                        <Check className="w-3 h-3" />
                        <span>Terdaftar sebagai Anggota Resmi #{registeredMember.no_daftar}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-rose-600 font-semibold mt-1">
                        ⚠️ Akun Anda belum terdaftar di 42 Anggota Ekstra TIK.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kelas & No Absen (Hanya tampil input jika Admin manual) */}
              {isAdminOrGuru && !selectedAnggota && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kelas
                    </label>
                    <select
                      value={activeKelas}
                      onChange={(e) => setManualKelas(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800"
                    >
                      {['7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H', '7I', '7J', '7K'].map((k) => (
                        <option key={k} value={k}>
                          Kelas {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      No. Absen
                    </label>
                    <input
                      type="number"
                      value={activeNoAbsen}
                      onChange={(e) => setManualNoAbsen(e.target.value)}
                      placeholder="No Absen"
                      className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Pilihan Status Kehadiran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Status Kehadiran
                </label>

                {isAdminOrGuru ? (
                  /* Admin & Guru: Dapat memilih Hadir, Izin, Sakit, atau Alpa */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'Hadir', label: 'Hadir', bg: 'bg-emerald-600', text: 'text-emerald-700' },
                      { key: 'Izin', label: 'Izin', bg: 'bg-amber-500', text: 'text-amber-700' },
                      { key: 'Sakit', label: 'Sakit', bg: 'bg-blue-600', text: 'text-blue-700' },
                      { key: 'Alpa', label: 'Alpa', bg: 'bg-rose-600', text: 'text-rose-700' }
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setStatus(s.key)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          status === s.key
                            ? `${s.bg} text-white shadow-xs`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s.key === 'Hadir' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Siswa: Status Kehadiran otomatis Hadir di Lab */
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          Hadir di Lab Komputer
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          Presensi mandiri siswa terverifikasi
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Hadir
                    </span>
                  </div>
                )}

                {/* Edukasi untuk Siswa mengenai Izin / Sakit */}
                {!isAdminOrGuru && (
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed italic">
                    * Catatan: Untuk status <strong className="text-amber-700 font-semibold">Izin</strong> atau{' '}
                    <strong className="text-blue-700 font-semibold">Sakit</strong>, mohon konfirmasi langsung ke Guru/Pembina TIK agar dicatat di sistem.
                  </p>
                )}
              </div>

              {/* Keterangan Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Keterangan {isAdminOrGuru ? '(Wajib untuk Izin/Sakit)' : '(Opsional)'}
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder={
                    isAdminOrGuru
                      ? 'Contoh: Izin mengikuti lomba OSN / Sakit demam ada surat dokter'
                      : 'Contoh: Hadir di Lab Komputer 1 / PC No. 12'
                  }
                  rows={2}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800"
                />
              </div>

              {/* Pesan Error */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Pesan Sukses */}
              {successData && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Presensi Berhasil Disimpan ke Supabase!</strong>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Data kehadiran untuk {successData.nama} ({successData.status_kehadiran}) pada tanggal {successData.tanggal} telah tercatat.
                    </p>
                  </div>
                </div>
              )}

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={submitting || (isLocked && !isAdminOrGuru) || (hasAttendedToday && !isAdminOrGuru)}
                className="w-full py-2.5 px-4 bg-violet-700 hover:bg-violet-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-violet-700/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAdminOrGuru ? 'Simpan Presensi Anggota' : 'Kirim Presensi Hadir Sekarang'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Riwayat Presensi & Rekap Matriks */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                Log Kehadiran & Rekap Matriks
              </h3>
            </div>
            {onRefreshData && (
              <button
                type="button"
                onClick={onRefreshData}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Muat Ulang Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <RiwayatPresensiList
            riwayatList={riwayatSiswa}
            anggotaList={anggotaList}
            allPresensiList={allPresensiList}
            fallbackNama={activeNama}
            fallbackKelas={activeKelas}
            hasSelectedStudent={Boolean(registeredMember || activeNama)}
          />
        </div>
      </div>
    </div>
  );
}

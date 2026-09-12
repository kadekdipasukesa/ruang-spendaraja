/**
 * DATA SPREADSHEET HISTORIS EKSTRAKURIKULER TIK
 * Target Sheet: "Ekstra_Tik_7_2026"
 * 
 * Berisi riwayat presensi format matriks tanggal langsung dari sheet resmi:
 * Tanggal Kolom: 24/7/2026, 31/7/2026, 14/8/2026, 21/8/2026, 28/8/2026, 4/9/2026
 * 
 * Sesuai data CSV resmi dari guru:
 * Kolom kosong = "Tidak Hadir"
 */

import { ANGGOTA_EKSTRA_TIK, KELAS_MAP_TITIK_KE_HURUF } from './ekstraTikWhitelist';

export const SPREADSHEET_DATE_COLUMNS = [
  '24/7/2026',
  '31/7/2026',
  '14/8/2026',
  '21/8/2026',
  '28/8/2026',
  '4/9/2026'
];

/**
 * Matriks presensi siswa dari Sheet Ekstra_Tik_7_2026
 * Mapping nomor pendaftar (no) ke status presensi per tanggal dari data CSV resmi
 * Kolom kosong = "Tidak Hadir"
 */
export const SPREADSHEET_MATRIX_DATA = {
  7: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': 'Hadir', '28/8/2026': '', '4/9/2026': 'Hadir' },
  9: { '24/7/2026': 'Hadir', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  5: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  3: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  34: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  41: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  1: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  2: { '24/7/2026': 'Hadir', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  16: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  19: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': '', '4/9/2026': 'Hadir' },
  27: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  28: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  36: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  11: { '24/7/2026': 'Hadir', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  6: { '24/7/2026': 'Hadir', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  30: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Izin', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  24: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  8: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': '', '4/9/2026': 'Hadir' },
  17: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  32: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  35: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  20: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  18: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  15: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  14: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': '', '4/9/2026': 'Hadir' },
  37: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  40: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  21: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  4: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  23: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': '' },
  10: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  39: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': 'Hadir', '28/8/2026': '', '4/9/2026': '' },
  26: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  33: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  13: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  12: { '24/7/2026': 'Hadir', '31/7/2026': 'Hadir', '14/8/2026': '', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  31: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  29: { '24/7/2026': '', '31/7/2026': 'Hadir', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  38: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': 'Hadir', '28/8/2026': 'Hadir', '4/9/2026': 'Hadir' },
  25: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': '' },
  22: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': 'Hadir', '21/8/2026': '', '28/8/2026': 'Hadir', '4/9/2026': 'Izin' },
  42: { '24/7/2026': '', '31/7/2026': '', '14/8/2026': '', '21/8/2026': '', '28/8/2026': '', '4/9/2026': 'Hadir' }
};

/**
 * Konversi string tanggal "D/M/YYYY" ke Timestamp numerik untuk pengurutan
 */
export function getTanggalTimestamp(tglStr) {
  if (!tglStr) return 0;
  const parts = String(tglStr).split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const dt = new Date(y, m, d, 14, 30);
    if (!isNaN(dt.getTime())) return dt.getTime();
  }
  return 0;
}

/**
 * Format string tanggal format "D/M/YYYY" menjadi tanggal lokal manusiawi
 */
export function formatTanggalKolomKeIndo(tglStr) {
  if (!tglStr) return 'Pertemuan Ekstra TIK';
  const parts = tglStr.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) {
      return dt.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }
  return tglStr;
}

/**
 * Ekstraksi riwayat presensi dari tabel matriks Sheet 'Ekstra_Tik_7_2026' untuk satu siswa
 */
export function getRiwayatPresensiDariSpreadsheet({ nama, kelas, noAbsen }) {
  const hasil = [];
  const clean = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  const inputNama = clean(nama);
  const inputKelas = clean(kelas);
  const inputAbsen = noAbsen ? parseInt(noAbsen, 10) : null;

  // Cari data siswa di daftar anggota
  let targetMember = null;
  if (inputNama) {
    targetMember = ANGGOTA_EKSTRA_TIK.find((m) => {
      const mNama = clean(m.nama);
      return mNama === inputNama || (mNama.length >= 8 && (mNama.includes(inputNama) || inputNama.includes(mNama)));
    });
  }
  if (!targetMember && inputAbsen && inputKelas) {
    targetMember = ANGGOTA_EKSTRA_TIK.find((m) => {
      const mAbsen = m.noAbsen;
      const mKelas = clean(m.kelas);
      return mAbsen === inputAbsen && (mKelas === inputKelas || mKelas.replace('7.', '7') === inputKelas.replace('7', ''));
    });
  }

  // Jika siswa terdaftar, ekstrak record presensinya dari sheet matriks
  if (targetMember && SPREADSHEET_MATRIX_DATA[targetMember.no]) {
    const dates = SPREADSHEET_DATE_COLUMNS;
    const rowData = SPREADSHEET_MATRIX_DATA[targetMember.no];
    const displayKelas = KELAS_MAP_TITIK_KE_HURUF[targetMember.kelas] || targetMember.kelas;

    // Urutkan dari tanggal terbaru ke terlama
    for (let i = dates.length - 1; i >= 0; i--) {
      const tgl = dates[i];
      const rawStatus = rowData[tgl];
      const isHadir = Boolean(rawStatus && rawStatus.trim());
      const status = isHadir ? rawStatus.trim() : 'Tidak Hadir';
      const ts = getTanggalTimestamp(tgl);

      hasil.push({
        id: `sh_${targetMember.no}_${tgl.replace(/[^0-9]/g, '')}`,
        nama: targetMember.nama,
        kelas: displayKelas,
        noAbsen: targetMember.noAbsen,
        status: status,
        tanggalKolom: tgl,
        tanggal: formatTanggalKolomKeIndo(tgl),
        timestamp: ts,
        waktu: isHadir ? '14:30 WITA' : '-',
        keterangan: isHadir
          ? `Tercatat ${status} di Google Spreadsheet (Ekstra_Tik_7_2026)`
          : 'Tidak hadir pada pertemuan ini (kolom kosong di sheet)',
        sumber: 'spreadsheet'
      });
    }
  }

  return hasil;
}

/**
 * Ekstraksi seluruh riwayat presensi semua siswa (42 anggota) per pertemuan
 * Digunakan untuk rekapitulasi lengkap presensi per hari
 */
export function getAllRiwayatPresensiSemuaSiswa() {
  const hasil = [];
  const dates = SPREADSHEET_DATE_COLUMNS;

  // Loop tanggal dari yang terbaru
  for (let i = dates.length - 1; i >= 0; i--) {
    const tgl = dates[i];
    const ts = getTanggalTimestamp(tgl);

    for (const member of ANGGOTA_EKSTRA_TIK) {
      if (member.no === 43) continue; // Skip baris guru/pembina

      const rowData = SPREADSHEET_MATRIX_DATA[member.no];
      const rawStatus = rowData ? rowData[tgl] : '';
      const isHadir = Boolean(rawStatus && rawStatus.trim());
      const status = isHadir ? rawStatus.trim() : 'Tidak Hadir';
      const displayKelas = KELAS_MAP_TITIK_KE_HURUF[member.kelas] || member.kelas;

      hasil.push({
        id: `all_${member.no}_${tgl.replace(/[^0-9]/g, '')}`,
        nama: member.nama,
        kelas: displayKelas,
        noAbsen: member.noAbsen,
        status: status,
        tanggalKolom: tgl,
        tanggal: formatTanggalKolomKeIndo(tgl),
        timestamp: ts,
        waktu: isHadir ? '14:30 WITA' : '-',
        keterangan: isHadir
          ? `Tercatat ${status} di Google Spreadsheet (Ekstra_Tik_7_2026)`
          : 'Tidak hadir pada pertemuan ini (kolom kosong di sheet)',
        sumber: 'spreadsheet'
      });
    }
  }

  return hasil;
}

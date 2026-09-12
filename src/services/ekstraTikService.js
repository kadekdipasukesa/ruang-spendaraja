import { supabase } from '../lib/supabaseClient';
import { uploadToCloudinary, CLOUDINARY_CONFIG } from '../utils/cloudinaryUpload';

/**
 * Format ukuran file ke format manusiawi (KB / MB)
 */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Normalisasi data anggota ekstra dengan data dari master_siswa
 */
function normalizeAnggota(row) {
  if (!row) return null;
  const s = row.master_siswa || {};
  return {
    id: row.id,
    siswa_id: row.siswa_id,
    no_daftar: row.no_daftar,
    status: row.status,
    created_at: row.created_at,
    // Ambil identitas utama dari master_siswa (single source of truth), fallback ke kolom tabel jika ada
    nama: s.NAMA || row.nama || '',
    kelas: s.Kelas || row.kelas || '',
    no_absen: s['No Absen'] ?? row.no_absen ?? null,
    gender: s.Gender || row.gender || '',
    nisn: s.NISN || row.nisn || '',
    raw_siswa: s
  };
}

/**
 * Normalisasi data presensi dengan relasi master_siswa
 */
function normalizePresensi(row) {
  if (!row) return null;
  const s = row.master_siswa || {};
  return {
    id: row.id,
    siswa_id: row.siswa_id,
    tanggal: row.tanggal,
    status_kehadiran: row.status_kehadiran,
    keterangan: row.keterangan,
    waktu_absen: row.waktu_absen,
    // Ambil identitas utama dari master_siswa
    nama: s.NAMA || row.nama || '',
    kelas: s.Kelas || row.kelas || '',
    no_absen: s['No Absen'] ?? null,
    gender: s.Gender || '',
    nisn: s.NISN || row.nisn || '',
    raw_siswa: s
  };
}

/**
 * Mengambil Daftar Seluruh Anggota Resmi Ekstra TIK dari Supabase
 * Membaca relasi Foreign Key master_siswa secara otomatis
 */
export async function getAnggotaEkstra() {
  const { data, error } = await supabase
    .from('ekstra_anggota')
    .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .order('no_daftar', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Gagal mengambil ekstra_anggota:', error);
    throw error;
  }
  return (data || []).map(normalizeAnggota);
}

/**
 * Mengambil Seluruh Data Presensi Ekstra TIK dari Supabase (termasuk JOIN master_siswa)
 */
export async function getPresensiEkstra(filterDate = null) {
  let query = supabase
    .from('ekstra_presensi')
    .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .order('tanggal', { ascending: false });

  if (filterDate) {
    query = query.eq('tanggal', filterDate);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Gagal mengambil ekstra_presensi:', error);
    throw error;
  }
  return (data || []).map(normalizePresensi);
}

/**
 * Helper untuk mencari ID siswa di master_siswa jika siswa_id belum disediakan
 */
async function resolveStudentId({ siswa_id, nisn, nama, kelas }) {
  if (siswa_id) return siswa_id;
  try {
    if (nisn) {
      const { data } = await supabase
        .from('master_siswa')
        .select('id')
        .eq('NISN', String(nisn).trim())
        .maybeSingle();
      if (data?.id) return data.id;
    }
    if (nama) {
      let q = supabase
        .from('master_siswa')
        .select('id')
        .ilike('NAMA', nama.trim());
      if (kelas) {
        q = q.eq('Kelas', kelas.trim());
      }
      const { data } = await q.maybeSingle();
      if (data?.id) return data.id;
    }
  } catch (err) {
    console.warn('Gagal resolveStudentId:', err);
  }
  return null;
}

/**
 * Mengambil Riwayat Presensi untuk 1 Siswa Tertentu
 */
export async function getRiwayatPresensiSiswa({ siswa_id, nisn, nama, kelas }) {
  if (!siswa_id && !nisn && !nama) return [];

  const resolvedSiswaId = await resolveStudentId({ siswa_id, nisn, nama, kelas });
  if (!resolvedSiswaId) return [];

  const { data, error } = await supabase
    .from('ekstra_presensi')
    .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .eq('siswa_id', resolvedSiswaId)
    .order('tanggal', { ascending: false });

  if (error) {
    console.error('Gagal mengambil presensi siswa:', error);
    return [];
  }
  return (data || []).map(normalizePresensi);
}

/**
 * Kirim Presensi Siswa ke Supabase
 * Menggunakan siswa_id sebagai foreign key murni ke master_siswa
 */
export async function kirimPresensiEkstraSupabase({
  tanggal,
  siswa_id,
  nama = '',
  kelas = '',
  nisn = null,
  status_kehadiran = 'Hadir',
  keterangan = ''
}) {
  const now = new Date();
  const dateToUse = tanggal || now.toISOString().split('T')[0];

  const resolvedSiswaId = await resolveStudentId({ siswa_id, nisn, nama, kelas });
  if (!resolvedSiswaId) {
    throw new Error('Identitas siswa tidak ditemukan di master_siswa. Pastikan data akun valid.');
  }

  // Schema murni Opsi 2: Hanya gunakan kolom yang valid di ekstra_presensi (tanpa kolom redundan nama/kelas/nisn)
  const payload = {
    tanggal: dateToUse,
    siswa_id: resolvedSiswaId,
    status_kehadiran,
    keterangan: keterangan?.trim() || null,
    waktu_absen: now.toISOString()
  };

  // Upsert dengan prioritas constraint unik (tanggal, siswa_id)
  let { data, error } = await supabase
    .from('ekstra_presensi')
    .upsert(payload, { onConflict: 'tanggal, siswa_id' })
    .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .single();

  if (error) {
    // Fallback tanpa klausa onConflict eksplisit jika constraint default database
    const resFallback = await supabase
      .from('ekstra_presensi')
      .upsert(payload)
      .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
      .single();

    if (resFallback.error) {
      console.error('Gagal menyimpan presensi ke Supabase:', resFallback.error);
      throw new Error(resFallback.error.message || 'Gagal menyimpan absensi');
    }
    return normalizePresensi(resFallback.data);
  }

  return normalizePresensi(data);
}

/**
 * Menandai siswa yang belum memiliki catatan presensi pada tanggal tertentu sebagai 'Alpa'
 * Digunakan secara manual oleh Admin/Guru atau saat penutupan sesi.
 */
export async function tandaiAlpaSiswaBelumAbsen({ tanggal, anggotaList = [] }) {
  const now = new Date();
  const dateToUse = tanggal || now.toISOString().split('T')[0];

  // 1. Ambil data presensi yang sudah ada pada tanggal tersebut (HANYA kolom siswa_id & status_kehadiran)
  const { data: existingPresensi, error: fetchErr } = await supabase
    .from('ekstra_presensi')
    .select('siswa_id, status_kehadiran')
    .eq('tanggal', dateToUse);

  if (fetchErr) {
    console.error('Gagal mengambil presensi tanggal:', fetchErr);
    throw fetchErr;
  }

  // 2. Filter anggota yang belum ada catatan presensi sama sekali
  const existingSet = new Set();
  (existingPresensi || []).forEach((p) => {
    if (p.siswa_id) {
      existingSet.add(String(p.siswa_id));
    }
  });

  const belumAbsen = (anggotaList || []).filter((m) => {
    if (m.siswa_id && existingSet.has(String(m.siswa_id))) return false;
    return true;
  });

  if (belumAbsen.length === 0) {
    return {
      updatedCount: 0,
      siswaList: [],
      message: 'Semua anggota sudah memiliki catatan presensi pada tanggal ini.'
    };
  }

  const payloadList = belumAbsen
    .filter((m) => m.siswa_id)
    .map((m) => ({
      tanggal: dateToUse,
      siswa_id: m.siswa_id,
      status_kehadiran: 'Alpa',
      keterangan: 'Tanpa Keterangan (Ditandai oleh Pembina)',
      waktu_absen: now.toISOString()
    }));

  if (payloadList.length === 0) {
    return {
      updatedCount: 0,
      siswaList: [],
      message: 'Tidak ada anggota dengan siswa_id valid untuk ditandai Alpa.'
    };
  }

  // 3. Upsert ke Supabase dengan onConflict tanggal, siswa_id
  let { data, error } = await supabase
    .from('ekstra_presensi')
    .upsert(payloadList, { onConflict: 'tanggal, siswa_id' })
    .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)');

  if (error) {
    const resFallback = await supabase
      .from('ekstra_presensi')
      .upsert(payloadList)
      .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)');

    if (resFallback.error) {
      console.error('Gagal menandai Alpa:', resFallback.error);
      throw new Error(resFallback.error.message || 'Gagal menyimpan status Alpa');
    }
    data = resFallback.data;
  }

  return {
    updatedCount: belumAbsen.length,
    siswaList: belumAbsen,
    data: (data || []).map(normalizePresensi)
  };
}

/**
 * Mengambil Daftar Master Tugas Ekstra TIK
 */
export async function getMasterTugasEkstra() {
  const { data, error } = await supabase
    .from('ekstra_tugas_master')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal mengambil tugas master ekstra:', error);
    return [];
  }
  return data || [];
}

/**
 * Mengambil Pengumpulan Tugas Ekstra TIK dari Supabase
 */
export async function getTugasPengumpulanEkstra(idTugas = null, siswa_id = null, nisn = null, nama = null) {
  let query = supabase
    .from('ekstra_tugas_pengumpulan')
    .select('*, ekstra_tugas_master(judul_tugas), master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .order('submitted_at', { ascending: false });

  if (idTugas) {
    query = query.eq('id_tugas', idTugas);
  }

  if (siswa_id) {
    query = query.eq('siswa_id', siswa_id);
  } else if (nisn || nama) {
    const resolvedId = await resolveStudentId({ nisn, nama });
    if (resolvedId) {
      query = query.eq('siswa_id', resolvedId);
    }
  }

  let { data, error } = await query;
  if (error) {
    console.warn('Query join ekstra_tugas_pengumpulan gagal, mencoba fallback select(*):', error);
    // Fallback tanpa join PostgREST jika relasi FK belum terindeks
    let fallbackQuery = supabase
      .from('ekstra_tugas_pengumpulan')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (idTugas) fallbackQuery = fallbackQuery.eq('id_tugas', idTugas);
    if (siswa_id) fallbackQuery = fallbackQuery.eq('siswa_id', siswa_id);

    const fallbackRes = await fallbackQuery;
    if (fallbackRes.error) {
      console.error('Fallback query tugas juga gagal:', fallbackRes.error);
      return [];
    }
    data = fallbackRes.data || [];

    // Lengkapi dengan data master_siswa manual jika siswa_id ada
    const studentIds = Array.from(new Set(data.map((r) => r.siswa_id).filter(Boolean)));
    const studentMap = {};
    if (studentIds.length > 0) {
      try {
        const { data: students } = await supabase
          .from('master_siswa')
          .select('id, NAMA, Kelas, "No Absen", Gender, NISN')
          .in('id', studentIds);
        (students || []).forEach((s) => {
          studentMap[s.id] = s;
        });
      } catch (err) {
        console.warn('Gagal memuat manual master_siswa untuk tugas:', err);
      }
    }

    return data.map((row) => {
      const s = studentMap[row.siswa_id] || {};
      return {
        ...row,
        nama: s.NAMA || row.nama || '',
        kelas: s.Kelas || row.kelas || '',
        nisn: s.NISN || row.nisn || '',
        no_absen: s['No Absen'] ?? null
      };
    });
  }

  return (data || []).map((row) => {
    const s = row.master_siswa || {};
    return {
      ...row,
      nama: s.NAMA || row.nama || '',
      kelas: s.Kelas || row.kelas || '',
      nisn: s.NISN || row.nisn || '',
      no_absen: s['No Absen'] ?? null
    };
  });
}

/**
 * Mengunggah Berkas Tugas ke Cloudinary (Preset tugas_ekstra_tik7) dan Menyimpan ke Supabase
 */
export async function kumpulTugasEkstraSupabase({
  id_tugas,
  siswa_id,
  nama = '',
  kelas = '',
  nisn = null,
  file,
  catatan_siswa = '',
  onUploadProgress = null
}) {
  if (!file) {
    throw new Error('Silakan pilih berkas tugas yang ingin diunggah.');
  }

  const resolvedSiswaId = await resolveStudentId({ siswa_id, nisn, nama, kelas });
  if (!resolvedSiswaId) {
    throw new Error('Identitas siswa (siswa_id) tidak valid atau siswa belum terdaftar di database.');
  }

  // 1. Upload ke Cloudinary dengan custom preset tugas_ekstra_tik7
  const fileUrl = await uploadToCloudinary(
    file,
    'tugas_ekstra_tik7',
    onUploadProgress,
    CLOUDINARY_CONFIG.uploadPresetEkstra
  );

  // 2. Simpan record ke database Supabase murni berdasarkan relasi foreign key (id_tugas, siswa_id)
  const payload = {
    id_tugas,
    siswa_id: resolvedSiswaId,
    file_url: fileUrl,
    file_name: file.name,
    catatan_siswa: catatan_siswa?.trim() || null,
    submitted_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('ekstra_tugas_pengumpulan')
    .upsert(payload, { onConflict: 'id_tugas, siswa_id' })
    .select('*, ekstra_tugas_master(judul_tugas), master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
    .single();

  if (error) {
    // Fallback tanpa onConflict spesifik
    const resFallback = await supabase
      .from('ekstra_tugas_pengumpulan')
      .upsert(payload)
      .select('*, ekstra_tugas_master(judul_tugas), master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
      .single();

    if (resFallback.error) {
      console.error('Gagal menyimpan pengumpulan tugas ke Supabase:', resFallback.error);
      throw new Error(resFallback.error.message || 'Gagal menyimpan riwayat tugas');
    }
    return resFallback.data;
  }

  return data;
}

/**
 * MANAJEMEN STATUS KUNCI ABSENSI (ADMIN TOGGLE)
 */
export async function getStatusAbsenEkstra() {
  try {
    const { data, error } = await supabase
      .from('game_controls')
      .select('is_locked')
      .eq('game_id', 'ekstra_tik_absen')
      .eq('class_name', 'ALL')
      .maybeSingle();

    if (error) {
      console.warn('Gagal membaca status absen dari game_controls:', error);
      return { isLocked: false };
    }
    return { isLocked: !!data?.is_locked };
  } catch (err) {
    console.error('Error fetching absen status:', err);
    return { isLocked: false };
  }
}

export async function setStatusAbsenEkstra(isLocked) {
  const { data, error } = await supabase
    .from('game_controls')
    .upsert(
      {
        game_id: 'ekstra_tik_absen',
        class_name: 'ALL',
        is_locked: isLocked
      },
      { onConflict: 'game_id, class_name' }
    )
    .select();

  if (error) throw error;
  return data;
}

export function subscribeStatusAbsenEkstra(callback) {
  const channelId = `absen_control_${Math.random().toString(36).substring(2, 7)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'game_controls',
        filter: 'game_id=eq.ekstra_tik_absen'
      },
      (payload) => {
        if (payload?.new && typeof payload.new.is_locked === 'boolean') {
          callback(payload.new.is_locked);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribePresensiEkstra(callback) {
  const channelId = `presensi_ekstra_${Math.random().toString(36).substring(2, 7)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ekstra_presensi'
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeTugasPengumpulanEkstra(callback) {
  const channelId = `tugas_ekstra_${Math.random().toString(36).substring(2, 7)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ekstra_tugas_pengumpulan'
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Generator CSV Rekap Matriks Kehadiran Ekstra TIK (Murni dari relasi master_siswa)
 */
export function generatePresensiCsv(anggotaList = [], presensiList = []) {
  const dateSet = new Set();
  presensiList.forEach((p) => {
    if (p.tanggal) dateSet.add(p.tanggal);
  });
  const sortedDates = Array.from(dateSet).sort();

  // Matrix map berbasis siswa_id (atau fallback nama_kelas)
  const matrixMap = new Map();
  presensiList.forEach((p) => {
    const key = p.siswa_id ? `sid_${p.siswa_id}` : `${(p.nama || '').toLowerCase().trim()}_${p.kelas || ''}`;
    if (!matrixMap.has(key)) {
      matrixMap.set(key, {});
    }
    matrixMap.get(key)[p.tanggal] = p.status_kehadiran;
  });

  const headers = [
    'No',
    'No Daftar',
    'ID Siswa',
    'Nama Lengkap',
    'Kelas',
    'No Absen',
    'L/P',
    'NISN',
    ...sortedDates,
    'Total Hadir',
    'Persentase Hadir (%)'
  ];

  const rows = anggotaList.map((m, idx) => {
    const key = m.siswa_id ? `sid_${m.siswa_id}` : `${(m.nama || '').toLowerCase().trim()}_${m.kelas || ''}`;
    const studentPresensi = matrixMap.get(key) || {};

    let totalHadir = 0;
    const dateValues = sortedDates.map((d) => {
      const st = studentPresensi[d] || 'Tidak Hadir';
      if (st === 'Hadir') totalHadir++;
      return st;
    });

    const persenHadir = sortedDates.length > 0 
      ? Math.round((totalHadir / sortedDates.length) * 100) 
      : 0;

    return [
      idx + 1,
      m.no_daftar || idx + 1,
      m.siswa_id || '',
      `"${(m.nama || '').replace(/"/g, '""')}"`,
      m.kelas || '',
      m.no_absen || '',
      (m.gender || '').toUpperCase().startsWith('P') ? 'P' : 'L',
      m.nisn ? `="${m.nisn}"` : '',
      ...dateValues.map((v) => `"${v}"`),
      totalHadir,
      `${persenHadir}%`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return csvContent;
}

/**
 * Generator CSV Rekap Pengumpulan Tugas Ekstra TIK
 */
export function generateTugasCsv(tugasList = []) {
  const headers = [
    'No',
    'ID Pengumpulan',
    'ID Siswa',
    'Nama Siswa',
    'Kelas',
    'No Absen',
    'NISN',
    'Judul Tugas',
    'Nama Berkas',
    'Catatan Siswa',
    'Waktu Pengumpulan',
    'Tautan Berkas'
  ];

  const rows = tugasList.map((item, idx) => {
    return [
      idx + 1,
      item.id || '',
      item.siswa_id || '',
      `"${(item.nama || '').replace(/"/g, '""')}"`,
      item.kelas || '',
      item.no_absen || '',
      item.nisn ? `="${item.nisn}"` : '',
      `"${(item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || 'Tugas Ekstra TIK').replace(/"/g, '""')}"`,
      `"${(item.file_name || '').replace(/"/g, '""')}"`,
      `"${(item.catatan_siswa || '').replace(/"/g, '""')}"`,
      item.submitted_at ? new Date(item.submitted_at).toLocaleString('id-ID') : '',
      `"${item.file_url || ''}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return csvContent;
}

export function downloadCsvFile(content, fileName = 'Rekap_Presensi_Ekstra_TIK.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

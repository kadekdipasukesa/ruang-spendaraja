import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Baca .env
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  const key = parts[0]?.trim();
  const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  if (key && val) env[key] = val;
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function seedTugas6() {
  const row = {
    id: 'b8192a6c-4820-4e31-89d5-7c5ef93108c6',
    kode_tugas: 'TUGAS-06-SUREL-GMAIL',
    urutan: 6,
    judul: 'Tugas 6: Praktik Resmi Surel (Gmail) - Surat Izin Lomba Melukis',
    kategori: 'Literasi Digital',
    tipe_tugas: 'praktik',
    custom_route: '/ruang-belajar/tugas/surel-gmail',
    deskripsi: 'Mempraktikkan pengiriman surel formal resmi menggunakan aplikasi Gmail asli: menyusun alamat Kepada (To) wali kelas, Tembusan (Cc) kepala sekolah, serta isi surat izin tidak masuk sekolah pada 1 November 2026 karena penyerahan hadiah lomba melukis.',
    petunjuk: [
      'Pelajari materi visual singkat dan jawab kuis checkpoint di setiap tahap.',
      'Tahap 1: Buka aplikasi Gmail di HP/laptopmu, pastikan akun aktif di Kotak Masuk (Inbox), lalu unggah screenshot.',
      'Tahap 2: Klik tombol + Tulis, masukkan email wali kelas di Kepada (To) dan email kepala sekolah di Tembusan (Cc) serta subjek surat, lalu unggah screenshot.',
      'Tahap 3: Tuliskan isi pesan formal izin tidak masuk sekolah pada 1 November 2026 karena penerimaan hadiah lomba melukis kabupaten (tanpa perlu upload PDF), lalu unggah screenshot.',
      'Klik Kumpul Tugas untuk mengirimkan 3 bukti screenshot pengerjaan ke Galeri Penilaian Admin untuk di-ACC (100 Poin).'
    ],
    deadline: '2026-11-05T23:59:59+08:00',
    poin_maksimal: 100,
    target_kelas: 'SEMUA',
    is_active: true,
    lampiran: []
  };

  const { data, error } = await supabase
    .from('tugas_master')
    .upsert(row, { onConflict: 'kode_tugas' })
    .select();

  if (error) {
    console.error('ERROR SEEDING TUGAS 6:', error);
  } else {
    console.log('BERHASIL SEED TUGAS 6 KE tugas_master:');
    console.log(JSON.stringify(data, null, 2));
  }
}

seedTugas6();

-- =========================================================================
-- SQL SEED DATA: TUGAS 6 SUREL GMAIL (TABEL PUBLIC.TUGAS_MASTER)
-- Platform: Ruang Spendaraja (SMP Negeri 2 Singaraja)
-- =========================================================================

INSERT INTO public.tugas_master (
  id,
  kode_tugas,
  urutan,
  judul,
  kategori,
  tipe_tugas,
  custom_route,
  deskripsi,
  petunjuk,
  deadline,
  poin_maksimal,
  target_kelas,
  is_active,
  lampiran,
  created_at,
  updated_at
) VALUES (
  'b8192a6c-4820-4e31-89d5-7c5ef93108c6'::uuid,
  'TUGAS-06-SUREL-GMAIL',
  6,
  'Tugas 6: Praktik Resmi Surel (Gmail) - Surat Izin Lomba Melukis',
  'Literasi Digital',
  'praktik',
  '/ruang-belajar/tugas/surel-gmail',
  'Mempraktikkan pengiriman surel formal resmi menggunakan aplikasi Gmail asli: menyusun alamat Kepada (To) wali kelas, Tembusan (Cc) kepala sekolah, serta isi surat izin tidak masuk sekolah pada 1 November 2026 karena penyerahan hadiah lomba melukis.',
  ARRAY[
    'Pelajari materi visual singkat dan jawab kuis checkpoint di setiap tahap.',
    'Tahap 1: Buka aplikasi Gmail di HP/laptopmu, pastikan akun aktif di Kotak Masuk (Inbox), lalu unggah screenshot.',
    'Tahap 2: Klik tombol + Tulis, masukkan email wali kelas di Kepada (To) dan email kepala sekolah di Tembusan (Cc) serta subjek surat, lalu unggah screenshot.',
    'Tahap 3: Tuliskan isi pesan formal izin tidak masuk sekolah pada 1 November 2026 karena penerimaan hadiah lomba melukis kabupaten (tanpa perlu upload PDF), lalu unggah screenshot.',
    'Klik Kumpul Tugas untuk mengirimkan 3 bukti screenshot pengerjaan ke Galeri Penilaian Admin untuk di-ACC (100 Poin).'
  ]::text[],
  '2026-11-05 23:59:59+08'::timestamptz,
  100,
  'SEMUA',
  true,
  '[]'::jsonb,
  now(),
  now()
)
ON CONFLICT (kode_tugas) DO UPDATE SET
  urutan = EXCLUDED.urutan,
  judul = EXCLUDED.judul,
  kategori = EXCLUDED.kategori,
  tipe_tugas = EXCLUDED.tipe_tugas,
  custom_route = EXCLUDED.custom_route,
  deskripsi = EXCLUDED.deskripsi,
  petunjuk = EXCLUDED.petunjuk,
  deadline = EXCLUDED.deadline,
  poin_maksimal = EXCLUDED.poin_maksimal,
  target_kelas = EXCLUDED.target_kelas,
  is_active = EXCLUDED.is_active,
  lampiran = EXCLUDED.lampiran,
  updated_at = now();

-- ==============================================================================
-- SQL MIGRASI: NORMALISASI TOTAL (OPSI 2) MODUL EKSTRAKURIKULER TIK
-- Jalankan script ini di SQL Editor Dashboard Supabase Anda:
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Pastikan kolom siswa_id sudah ada dan memiliki foreign key ke master_siswa
-- ------------------------------------------------------------------------------
ALTER TABLE public.ekstra_anggota 
ADD COLUMN IF NOT EXISTS siswa_id bigint REFERENCES public.master_siswa(id) ON DELETE CASCADE;

ALTER TABLE public.ekstra_presensi 
ADD COLUMN IF NOT EXISTS siswa_id bigint REFERENCES public.master_siswa(id) ON DELETE CASCADE;

ALTER TABLE public.ekstra_tugas_pengumpulan 
ADD COLUMN IF NOT EXISTS siswa_id bigint REFERENCES public.master_siswa(id) ON DELETE CASCADE;

-- ------------------------------------------------------------------------------
-- 2. Update / Backfill siswa_id jika ada baris yang masih kosong
-- ------------------------------------------------------------------------------
UPDATE public.ekstra_anggota ea
SET siswa_id = ms.id
FROM public.master_siswa ms
WHERE ea.siswa_id IS NULL
  AND (
    LOWER(REGEXP_REPLACE(ea.nama, '[^a-zA-Z0-9]', '', 'g')) = LOWER(REGEXP_REPLACE(ms."NAMA", '[^a-zA-Z0-9]', '', 'g'))
    OR LOWER(REGEXP_REPLACE(ms."NAMA", '[^a-zA-Z0-9]', '', 'g')) LIKE '%' || LOWER(REGEXP_REPLACE(ea.nama, '[^a-zA-Z0-9]', '', 'g')) || '%'
    OR LOWER(REGEXP_REPLACE(ea.nama, '[^a-zA-Z0-9]', '', 'g')) LIKE '%' || LOWER(REGEXP_REPLACE(ms."NAMA", '[^a-zA-Z0-9]', '', 'g')) || '%'
  );

UPDATE public.ekstra_presensi ep
SET siswa_id = ea.siswa_id
FROM public.ekstra_anggota ea
WHERE ep.siswa_id IS NULL
  AND LOWER(REGEXP_REPLACE(ep.nama, '[^a-zA-Z0-9]', '', 'g')) = LOWER(REGEXP_REPLACE(ea.nama, '[^a-zA-Z0-9]', '', 'g'))
  AND ea.siswa_id IS NOT NULL;

UPDATE public.ekstra_tugas_pengumpulan etp
SET siswa_id = ea.siswa_id
FROM public.ekstra_anggota ea
WHERE etp.siswa_id IS NULL
  AND LOWER(REGEXP_REPLACE(etp.nama, '[^a-zA-Z0-9]', '', 'g')) = LOWER(REGEXP_REPLACE(ea.nama, '[^a-zA-Z0-9]', '', 'g'))
  AND ea.siswa_id IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 3. Update Constraints (Ganti constraint berbasis nama menjadi berbasis siswa_id)
-- ------------------------------------------------------------------------------
-- Unik presensi harian per siswa:
ALTER TABLE public.ekstra_presensi DROP CONSTRAINT IF EXISTS unique_presensi_harian;
ALTER TABLE public.ekstra_presensi DROP CONSTRAINT IF EXISTS unique_presensi_harian_siswa;
ALTER TABLE public.ekstra_presensi ADD CONSTRAINT unique_presensi_harian_siswa UNIQUE (tanggal, siswa_id);

-- Unik pengumpulan tugas per siswa:
ALTER TABLE public.ekstra_tugas_pengumpulan DROP CONSTRAINT IF EXISTS unique_tugas_siswa;
ALTER TABLE public.ekstra_tugas_pengumpulan DROP CONSTRAINT IF EXISTS unique_tugas_siswa_id;
ALTER TABLE public.ekstra_tugas_pengumpulan ADD CONSTRAINT unique_tugas_siswa_id UNIQUE (id_tugas, siswa_id);

-- Unik keanggotaan 1 siswa hanya terdaftar 1x:
ALTER TABLE public.ekstra_anggota DROP CONSTRAINT IF EXISTS unique_anggota_siswa_id;
ALTER TABLE public.ekstra_anggota ADD CONSTRAINT unique_anggota_siswa_id UNIQUE (siswa_id);

-- ------------------------------------------------------------------------------
-- 4. HAPUS KOLOM REDUNDAN (Nama, Kelas, No Absen, Gender, NISN)
-- Sekarang seluruh data dibaca otomatis via JOIN master_siswa(id)!
-- ------------------------------------------------------------------------------

-- Tabel ekstra_anggota (Pertahankan no_daftar, alasan_seleksi, status, created_at):
ALTER TABLE public.ekstra_anggota DROP COLUMN IF EXISTS nama;
ALTER TABLE public.ekstra_anggota DROP COLUMN IF EXISTS kelas;
ALTER TABLE public.ekstra_anggota DROP COLUMN IF EXISTS no_absen;
ALTER TABLE public.ekstra_anggota DROP COLUMN IF EXISTS gender;
ALTER TABLE public.ekstra_anggota DROP COLUMN IF EXISTS nisn;

-- Tabel ekstra_presensi:
ALTER TABLE public.ekstra_presensi DROP COLUMN IF EXISTS nama;
ALTER TABLE public.ekstra_presensi DROP COLUMN IF EXISTS kelas;
ALTER TABLE public.ekstra_presensi DROP COLUMN IF EXISTS nisn;

-- Tabel ekstra_tugas_pengumpulan:
ALTER TABLE public.ekstra_tugas_pengumpulan DROP COLUMN IF EXISTS nama;
ALTER TABLE public.ekstra_tugas_pengumpulan DROP COLUMN IF EXISTS kelas;
ALTER TABLE public.ekstra_tugas_pengumpulan DROP COLUMN IF EXISTS nisn;

-- Selesai! Database sekarang 100% ternormalisasi & konsisten dengan master_siswa.

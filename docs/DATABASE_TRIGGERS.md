# Dokumentasi Stored Procedure & Trigger Database Supabase - Ruang Spendaraja

Dokumen ini mencatat seluruh **PostgreSQL Function (Stored Procedure) & Trigger** aktif di Supabase Ruang Spendaraja. 

Dokumentasi ini menjadi referensi utama bagi pengembang dan AI Agent agar **tidak membuat logika duplikat/konflik di sisi frontend** saat menangani poin, pelanggaran, log nilai, dan pemindahan alumni.

---

## 1. Ringkasan Trigger & Alur Sinkronisasi Poin

```text
[Aktivitas Siswa / Guru] (Input Tugas / Kuis / Game)
                 │
                 ▼
      [tugas_pengumpulan] (INSERT / UPDATE / DELETE)
                 │
                 ▼ (Trigger: trg_sync_tugas_to_point_logs)
                 ▼
         Fungsi: `sync_tugas_to_point_logs`
                 │ (Upsert 1 baris unik per tugas ke point_logs)
                 ▼
            [point_logs] (INSERT / UPDATE / DELETE)
                 │
                 ▼ (Trigger: trg_update_siswa_points)
                 ▼
         Fungsi: `update_siswa_points`
                 │ (Menambah / mengurangi master_siswa.total_points)
                 ▼
      [master_siswa.total_points] (Nilai Resmi Siswa Real-time)
```

---

## 2. Rincian Kode Fungsi & Trigger Supabase (Aktif)

### 1. `sync_tugas_to_point_logs` (Trigger 1)
* **Trigger Terpasang Pada**: Tabel `public.tugas_pengumpulan`
* **Event**: `AFTER INSERT OR UPDATE OR DELETE`
* **Fungsi**: Otomatis membuat, mengupdate, atau menghapus baris audit log pada tabel `point_logs` ketika nilai tugas siswa dimasukkan atau diedit. Mencegah duplikasi log untuk tugas yang sama.

```sql
CREATE OR REPLACE FUNCTION public.sync_tugas_to_point_logs()
RETURNS trigger AS $$
DECLARE
    v_judul text;
    v_desc text;
    v_target_log_id bigint;
BEGIN
    -- =========================================================================
    -- KASUS 1: DELETE (Data di tugas_pengumpulan dihapus)
    -- =========================================================================
    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.point_logs
        WHERE tugas_pengumpulan_id = OLD.id
           OR (siswa_id = OLD.siswa_id AND activity_type = 'tugas' AND description LIKE '%' || OLD.tugas_id::text || '%');
           
        RETURN OLD;
    END IF;

    -- =========================================================================
    -- KASUS 2: INSERT atau UPDATE (Skor Ditambah / Diedit)
    -- =========================================================================
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Ambil judul tugas dari tugas_master
        SELECT judul INTO v_judul 
        FROM public.tugas_master 
        WHERE id = NEW.tugas_id;
        
        IF v_judul IS NULL THEN
            v_judul := 'Tugas Praktik Ruang Belajar';
        END IF;

        -- Jika skor direset ke NULL atau <= 0, hapus baris log-nya
        IF NEW.skor IS NULL OR NEW.skor <= 0 THEN
            DELETE FROM public.point_logs
            WHERE tugas_pengumpulan_id = NEW.id
               OR (siswa_id = NEW.siswa_id AND activity_type = 'tugas' AND description ILIKE '%' || v_judul || '%');
            RETURN NEW;
        END IF;

        -- Format Deskripsi Bersih
        v_desc := v_judul || ' (Skor: ' || NEW.skor || ')';

        -- Cari baris log yang sudah ada untuk tugas ini
        SELECT id INTO v_target_log_id
        FROM public.point_logs
        WHERE tugas_pengumpulan_id = NEW.id
           OR (siswa_id = NEW.siswa_id AND activity_type = 'tugas' AND description ILIKE '%' || v_judul || '%')
        ORDER BY id ASC
        LIMIT 1;

        IF v_target_log_id IS NOT NULL THEN
            -- EDIT / UPDATE BARIS LOG YANG ADA
            UPDATE public.point_logs
            SET amount = NEW.skor,
                description = v_desc,
                tugas_pengumpulan_id = NEW.id,
                created_at = NOW()
            WHERE id = v_target_log_id;

            -- Bersihkan jika ada sisa log duplikat
            DELETE FROM public.point_logs
            WHERE (tugas_pengumpulan_id = NEW.id OR (siswa_id = NEW.siswa_id AND activity_type = 'tugas' AND description ILIKE '%' || v_judul || '%'))
              AND id <> v_target_log_id;
        ELSE
            -- INSERT BARU JIKA PERTAMA KALI
            INSERT INTO public.point_logs (
                siswa_id,
                amount,
                activity_type,
                description,
                tugas_pengumpulan_id,
                created_at
            ) VALUES (
                NEW.siswa_id,
                NEW.skor,
                'tugas',
                v_desc,
                NEW.id,
                NOW()
            );
        END IF;

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

### 2. `update_siswa_points` (Trigger 2)
* **Trigger Terpasang Pada**: Tabel `public.point_logs`
* **Event**: `AFTER INSERT OR UPDATE OR DELETE`
* **Fungsi**: Menghitung selisih (`delta`) poin pada saat ada log baru, log yang diedit, atau log yang dihapus, lalu langsung mengupdate kolom `total_points` pada tabel `master_siswa`.

```sql
CREATE OR REPLACE FUNCTION public.update_siswa_points()
RETURNS trigger AS $$
BEGIN
    -- Kasus 1: Ada log poin BARU masuk (INSERT)
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.master_siswa
        SET total_points = COALESCE(total_points, 0) + NEW.amount
        WHERE id = NEW.siswa_id;
        RETURN NEW;

    -- Kasus 2: Data log poin DIUBAH/DI-EDIT (UPDATE)
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE public.master_siswa
        SET total_points = COALESCE(total_points, 0) - OLD.amount + NEW.amount
        WHERE id = NEW.siswa_id;
        
        -- Antisipasi jika siswa_id diganti ke siswa lain
        IF (OLD.siswa_id <> NEW.siswa_id) THEN
            UPDATE public.master_siswa
            SET total_points = COALESCE(total_points, 0) - OLD.amount
            WHERE id = OLD.siswa_id;
        END IF;
        RETURN NEW;

    -- Kasus 3: Data log poin DIHAPUS (DELETE)
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.master_siswa
        SET total_points = COALESCE(total_points, 0) - OLD.amount
        WHERE id = OLD.siswa_id;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

### 3. `sync_total_pelanggaran`
* **Trigger Terpasang Pada**: Tabel `public.log_pelanggaran_siswa`
* **Event**: `AFTER INSERT OR UPDATE OR DELETE`
* **Fungsi**: Otomatis memperbarui kolom `total_pelanggaran` dan poin pelanggaran pada `master_siswa` saat ada pencatatan pelanggaran baru atau perubahan data pelanggaran oleh guru BK/Kesiswaan.

```sql
CREATE OR REPLACE FUNCTION public.sync_total_pelanggaran()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE public.master_siswa 
        SET 
            total_points = (
                SELECT COALESCE(SUM(poin_pelanggaran), 0) 
                FROM public.log_pelanggaran_siswa 
                WHERE siswa_id = NEW.siswa_id
            ),
            total_pelanggaran = (
                SELECT COUNT(*) 
                FROM public.log_pelanggaran_siswa 
                WHERE siswa_id = NEW.siswa_id
            )
        WHERE id = NEW.siswa_id;
    END IF;

    IF (TG_OP = 'DELETE') THEN
        UPDATE public.master_siswa 
        SET 
            total_points = (
                SELECT COALESCE(SUM(poin_pelanggaran), 0) 
                FROM public.log_pelanggaran_siswa 
                WHERE siswa_id = OLD.siswa_id
            ),
            total_pelanggaran = (
                SELECT COUNT(*) 
                FROM public.log_pelanggaran_siswa 
                WHERE siswa_id = OLD.siswa_id
            )
        WHERE id = OLD.siswa_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

### 4. `pindahkan_alumni`
* **Tipe**: RPC / Stored Procedure (Tunggal & Bersih)
* **Fungsi**: Memindahkan siswa yang status/kelasnya 'alumni' dari `master_siswa` ke tabel arsip `master_alumni` dengan mencatat tahun lulus (`p_tahun_lulus`).

```sql
CREATE OR REPLACE FUNCTION public.pindahkan_alumni(p_tahun_lulus text)
RETURNS TABLE(v_count integer) AS $$
DECLARE
    v_count INT;
BEGIN
    WITH deleted_rows AS (
        DELETE FROM master_siswa
        WHERE LOWER(TRIM("Kelas")) LIKE '%alumni%' 
           OR LOWER(TRIM("role")) = 'alumni'
        RETURNING "NAMA", "NISN", "Kelas", "No Absen", "Gender", "Agama"
    ),
    inserted_rows AS (
        INSERT INTO master_alumni ("NAMA", "NISN", "Kelas", "No Absen", "Gender", "Agama", "role", tahun_lulus)
        SELECT 
            "NAMA", 
            "NISN", 
            "Kelas", 
            "No Absen", 
            "Gender", 
            "Agama", 
            'alumni', 
            p_tahun_lulus
        FROM deleted_rows
        RETURNING id
    )
    SELECT COUNT(*) INTO v_count FROM inserted_rows;

    RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Catatan Penting untuk AI Agent & Pengembang

1. **Jangan Melakukan Perhitungan Nilai Manual di Frontend**:
   - Kolom `master_siswa.total_points` dan tabel `point_logs` **diurus 100% oleh PostgreSQL Trigger**. Frontend hanya perlu melakukan `INSERT`/`UPDATE` ke `tugas_pengumpulan`, dan database yang akan menyelesaikan sisanya secara otomatis.
2. **Kolom Kunci**:
   - Tabel `point_logs`: `siswa_id`, `amount`, `activity_type`, `description`, `tugas_pengumpulan_id`.
   - Tabel `tugas_pengumpulan`: `siswa_id`, `tugas_id`, `skor`.
   - Tabel `master_siswa`: `id`, `total_points`, `total_pelanggaran`.

# Dokumentasi Modul: Ekstrakurikuler TIK (`/ekstra-tik`)

Dokumen ini menjelaskan arsitektur baru berbasis **Supabase Database** (PostgreSQL) yang telah dinormalisasi total (**Opsi 2**) terhubung relasional ke `master_siswa` via `siswa_id`, antarmuka log kehadiran bergaya pesan WhatsApp 1 kolom terbungkus per hari, dan **Cloudinary Media Storage** (preset `tugas_ekstra_tik7`) untuk portal Ekstrakurikuler TIK SMPN 2 Singaraja.

---

## 1. Ringkasan & Tujuan Modul
* **URL Path**: `/ekstra-tik`
* **Controller**: `src/pages/EkstraTikPage.jsx`
* **Fungsi Utama**:
  1. **Presensi Kehadiran Siswa**: Siswa terverifikasi (42 anggota resmi di tabel `ekstra_anggota`) mengisi presensi yang langsung tersimpan di tabel `ekstra_presensi` Supabase secara realtime dengan relasi murni `siswa_id` ke `master_siswa`.
  2. **Tampilan Log Kehadiran Gaya WhatsApp**: Seluruh kehadiran siswa disajikan dalam **1 kolom rapi tanpa tab pemisah siswa** yang dikelompokkan per tanggal pertemuan dengan bubble sticky header ala WhatsApp, filter pencarian instan, dan status pill warna cerah.
  3. **Export Rekap Presensi (.CSV)**: Tombol unduh laporan matriks presensi seluruh 42 siswa dan semua tanggal pertemuan ke file `.csv` yang dapat langsung dibuka di Microsoft Excel dengan data siswa lengkap diambil dari `master_siswa`.
  4. **Pengumpulan Tugas ke Cloudinary**: Siswa mengunggah berkas tugas (Word `.docx`, PDF, Scratch `.sb3`, gambar, zip) hingga 25MB langsung ke Cloudinary menggunakan preset **`tugas_ekstra_tik7`** dan metadata tersimpan di tabel `ekstra_tugas_pengumpulan`.
  5. **In-App Document Live Preview**: Pratinjau dokumen langsung di dalam web menggunakan Cloudinary/Google Viewer modal (`ModalPreviewDokumen.jsx`).
  6. **Admin Sesi Toggle**: Guru/Admin (`role === 'admin' || role === 'guru' || role_2 === 'admin'`) dapat membuka dan menutup sesi absensi secara realtime menggunakan tabel Supabase `game_controls` (`game_id = 'ekstra_tik_absen'`).

---

## 2. Struktur Database Supabase Ternormalisasi (Opsi 2)

Dengan skema ternormalisasi total (Opsi 2), seluruh kolom redundan (`nama`, `kelas`, `no_absen`, `gender`, `nisn`) telah ditiadakan dari tabel-tabel modul ekstra. Data profil siswa menjadi **Single Source of Truth** yang diambil otomatis dari tabel `master_siswa` melalui `siswa_id`.

### A. Tabel `ekstra_anggota`
Menyimpan 42 anggota resmi hasil seleksi Ekstrakurikuler TIK Kelas 7.
* `id` (UUID, Primary Key)
* `siswa_id` (Bigint, Foreign Key ke `master_siswa.id` - *Single Source of Truth data siswa*)
* `no_daftar` (Integer, urutan pendaftaran/nomor urut seleksi)
* `alasan_seleksi` (Text, nullable)
* `status` (Text, default 'aktif')
* `created_at` (Timestamp)
* *Constraint Unik*: `unique_anggota_siswa_id (siswa_id)`

### B. Tabel `ekstra_presensi`
Menyimpan riwayat absensi setiap pertemuan per siswa.
* `id` (UUID, Primary Key)
* `siswa_id` (Bigint, Foreign Key ke `master_siswa.id`)
* `tanggal` (Date, format YYYY-MM-DD)
* `status_kehadiran` (Text, 'Hadir' | 'Izin' | 'Sakit' | 'Tidak Hadir')
* `keterangan` (Text, nullable)
* `waktu_absen` (Timestamp)
* *Constraint Unik*: `unique_presensi_harian_siswa (tanggal, siswa_id)` mencegah duplikasi absen pada tanggal yang sama.

### C. Tabel `ekstra_tugas_master`
Menyimpan daftar penugasan resmi ekstrakurikuler.
* `id` (UUID, Primary Key)
* `judul_tugas` (Text)
* `deskripsi` (Text)
* `deadline` (Timestamp, nullable)
* `created_at` (Timestamp)

### D. Tabel `ekstra_tugas_pengumpulan`
Menyimpan berkas tugas yang dikumpulkan siswa.
* `id` (UUID, Primary Key)
* `siswa_id` (Bigint, Foreign Key ke `master_siswa.id`)
* `id_tugas` (UUID, Foreign Key ke `ekstra_tugas_master.id`)
* `file_url` (Text, URL Cloudinary)
* `file_name` (Text)
* `catatan_siswa` (Text, nullable)
* `submitted_at` (Timestamp)
* *Constraint Unik*: `unique_tugas_siswa_id (id_tugas, siswa_id)`

---

## 3. Alur Query Frontend (Service Layer: `ekstraTikService.js`)
Frontend melakukan kueri dengan memanfaatkan relasi Supabase PostgREST ternormalisasi:
```javascript
// Contoh kueri mengambil ekstra_anggota beserta data master_siswa
const { data, error } = await supabase
  .from('ekstra_anggota')
  .select('*, master_siswa:siswa_id(id, NAMA, Kelas, "No Absen", Gender, NISN)')
  .order('no_daftar', { ascending: true });
```
Data kemudian dinormalisasi otomatis oleh helper `normalizeAnggota` dan `normalizePresensi` sehingga seluruh komponen UI menerima objek data yang konsisten (`nama`, `kelas`, `no_absen`, `gender`, `nisn`).

**Ketahanan Skema Ternormalisasi (Anti-Error `column ekstra_presensi.nama does not exist`)**:
1. **Helper `resolveStudentId`**: Otomatis memetakan dan mencari `siswa_id` dari `master_siswa` apabila hanya tersedia `NISN` atau `nama`, menjamin `siswa_id` valid sebelum eksekusi kueri ke Supabase.
2. **Kueri & Mutasi Murni Berbasis `siswa_id`**: Fungsi `kirimPresensiEkstraSupabase`, `tandaiAlpaSiswaBelumAbsen`, `getRiwayatPresensiSiswa`, `kumpulTugasEkstraSupabase`, dan `getTugasPengumpulanEkstra` hanya menyertakan kolom yang valid di database (`tanggal`, `siswa_id`, `status_kehadiran`, `keterangan`, `waktu_absen`) dan tidak lagi menyertakan kolom redundan yang telah di-drop (`nama`, `kelas`, `nisn`).
3. **Konflik Unik PostgREST**: Operasi `upsert` menggunakan klausa `{ onConflict: 'tanggal, siswa_id' }` pada presensi dan `{ onConflict: 'id_tugas, siswa_id' }` pada pengumpulan tugas.

---

## 4. Script SQL Migrasi & Normalisasi Total
File `/scripts/migration_add_siswa_id.sql` berisi script SQL lengkap untuk:
1. Memastikan kolom `siswa_id` terhubung sebagai Foreign Key ke `master_siswa(id)`.
2. Melakukan backfill/pemetaan otomatis data yang belum ber-`siswa_id`.
3. Memperbarui constraint unik menjadi berbasis `(tanggal, siswa_id)` dan `(id_tugas, siswa_id)`.
4. Menghapus kolom redundan (`nama`, `kelas`, `no_absen`, `gender`, `nisn`) dari ketiga tabel modul ekstra secara aman tanpa mengganggu tabel sistem lain.

---

## 5. Alur Presensi Hari Jumat & Hak Akses Status Kehadiran
1. **Jadwal Rutin Ekstra**: Setiap hari Jumat.
2. **Sesi Presensi**: Dibuka dan ditutup oleh Guru/Admin melalui toggle realtime Supabase (`game_controls.is_locked`).
3. **Hak Akses Siswa**:
   - Siswa wajib login dengan akun siswa Spendaraja yang terdaftar dalam 42 anggota resmi.
   - Identitas nama, kelas, dan nomor absen terkunci otomatis sesuai akun login (`read-only`).
   - Siswa mandiri **hanya dapat mengisi status "Hadir"** saat berada di Lab Komputer.
   - Tidak dapat melihat dropdown pemilihan anggota lain.
4. **Hak Akses Guru / Pembina TIK / Admin**:
   - Memiliki `MemberSelectorDropdown` untuk memilih anggota manapun dari 42 siswa terdaftar.
   - Memiliki hak eksklusif mencatatkan status **"Izin"** dan **"Sakit"** (lengkap dengan catatan alasan/keterangan).
   - Memiliki hak memilih tanggal pertemuan (Jumat aktif atau Jumat lampau).
   - Memiliki tombol **"Tandai Alpa Siswa Belum Absen"** (`ModalTandaiAlpa.jsx`), baik secara manual kapan saja maupun otomatis terkonfirmasi saat guru menekan tombol **"Tutup Sesi Presensi"**.
5. **Log Kehadiran WhatsApp-Style (`RiwayatPresensiList.jsx`)**:
   - Tampilan daftar kehadiran 1 kolom tanpa tab siswa (semua siswa ditampilkan langsung).
   - Dikelompokkan per tanggal pertemuan dengan header sticky yang mencantumkan nama hari (contoh: *Jumat, 12 September 2026*).
   - Dilengkapi filter status (Hadir, Izin, Sakit, Alpa), pencarian siswa, ringkasan statistik, dan unduh CSV.

---

## 6. Alur Unggah Berkas Tugas (`FormKumpulTugasEkstra.jsx`)
1. **Pilihan Anggota Terpadu (42 Anggota Ekstra TIK)**:
   - Formulir pengumpulan tugas menyediakan dropdown terpadu untuk memilih langsung dari 42 anggota resmi Ekstra TIK.
   - Siswa yang login otomatis terdeteksi dan profil anggotanya langsung terpilih sebagai default.
2. **Otomatisasi Nama & Kelas (Anti-Ketik Manual)**:
   - Bidang input **Nama Lengkap Siswa** dan **Kelas** berstatus `readOnly` dengan badge "Otomatis".
   - Nama, kelas, dan nomor absen terisi otomatis secara instan begitu anggota dipilih atau ketika siswa login, sehingga pengguna tidak perlu lagi mengetik manual.
3. **Visibilitas Penuh Admin & Pengawasan Tugas**:
   - Panel Riwayat Tugas dilengkapi *Scope Switcher*: tab **"Semua Siswa"** (menampilkan seluruh tugas yang dikumpulkan oleh ke-42 anggota) dan **"Siswa Terpilih"** (khusus siswa aktif di form).
   - Dilengkapi *Real-time Subscription* (`subscribeTugasPengumpulanEkstra`) via Supabase Postgres Changes sehingga berkas tugas baru langsung muncul di panel admin tanpa perlu me-refresh halaman.
   - Dilengkapi pencarian nama siswa / nama berkas, filter per kelas (7.1 s.d 7.11), filter per tugas master, dan tombol unduh rekap berkas tugas berformat `.CSV` (Excel).
   - Arsitektur *Resilient Query*: Dilengkapi fallback query otomatis jika PostgREST relationship cache belum terindeks, memastikan data pengumpulan di tabel `ekstra_tugas_pengumpulan` tidak pernah kosong atau terlewat di sisi admin.

---

## 7. Pratinjau Dokumen Multi-Engine (`ModalPreviewDokumen.jsx`)
1. **Multi-Engine Preview (Office Online & Google Docs)**:
   - File dokumen (.docx, .doc, .xlsx, .xls, .pptx, .ppt) dibuka default menggunakan **Microsoft Office Online Viewer** yang jauh lebih cepat dan stabil untuk file Office dibandingkan Google Drive Viewer.
   - File PDF dan teks dibuka secara native di dalam modal iframe.
   - Disediakan tombol saklar manual mesin viewer (*Switch Engine*): pengguna dapat beralih antara mesin **Office Viewer** dan **Google Docs Viewer** secara instan dengan 1 klik.
2. **Penanganan Timeout & Tombol Alternatif**:
   - Dilengkapi deteksi otomatis pemuatan lambat (*Slow Loading Fallback Box*) dengan tombol **"Buka di Tab Baru"** dan **"Unduh Berkas"** langsung dari Cloudinary.
   - Memastikan pengguna dan guru tidak pernah mengalami kendala dokumen tidak dapat diakses saat mereview tugas ekstrakurikuler.



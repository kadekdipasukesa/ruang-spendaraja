# Panduan Arsitektur & Cara Kerja: Modul Ruang Belajar (`/ruang-belajar`)

Dokumen ini berisi dokumentasi teknis mendalam mengenai modul **Ruang Belajar**, alur data, keterkaitan komponen, relasi tabel Supabase, dan simulator tugas interaktif.

---

## 1. Ikhtisar & Tujuan Modul

Modul **Ruang Belajar** (`/ruang-belajar`) adalah pusat aktivitas pembelajaran TIK/Informatika siswa SMP Negeri 2 Singaraja. Halaman ini berfungsi sebagai:
1. **Pusat Tugas & Materi**: Menampilkan modul pembelajaran bertahap (timeline).
2. **Simulator Praktik Interaktif**: Mengintegrasikan simulator file system dan kuis logika langsung di browser.
3. **Audit Trail Nilai Siswa**: Menampilkan log skor riil setiap tugas yang diselesaikan.
4. **Leaderboard Kelas (7A–7K)**: Memotivasi siswa melalui peringkat poin real-time.

---

## 2. Struktur Direktori & Komponen

```text
src/
├── pages/
│   ├── RuangBelajar.jsx                           # Controller & Halaman Utama Ruang Belajar
│   └── TugasKhusus/
│       ├── TugasSimulasiFolder.jsx                # Simulator File Explorer Windows/OS
│       └── TugasKuisAlgoritma.jsx                 # Kuis Logika & Algoritma Interaktif
│
├── components/RuangBelajar/
│   ├── RuangBelajarHeader.jsx                     # Header profil, skor real-time & Fixed Bottom Nav
│   ├── TimelineTugas.jsx                          # Tab 1: Daftar tugas, modul & status pengumpulan
│   ├── LogScoreTugas.jsx                          # Tab 2: Riwayat audit poin dari point_logs
│   ├── LeaderboardKelas.jsx                       # Tab 3: Peringkat siswa per kelas (poin > 0)
│   ├── TaskCard.jsx                               # Kartu item tugas individual
│   ├── TaskDetailModal.jsx                        # Modal rincian tugas & petunjuk pengerjaan
│   ├── ModalSubmitProyek.jsx                      # Modal upload/kirim link proyek
│   │
│   └── TugasKhusus/Tugas1/                        # Komponen Simulator File Explorer
│       ├── SimulationTopBar.jsx                   # Bar atas simulasi & tombol selesai
│       ├── MisiHeader.jsx                         # Ringkasan progress misi (0-100 poin)
│       ├── FloatingMissionPanel.jsx               # Panel misi melayang (auto-highlight target)
│       ├── ExplorerToolbar.jsx                    # Toolbar aksi (Folder Baru, Berkas Baru, Rename, Move, Hapus)
│       ├── ExplorerBreadcrumb.jsx                 # Navigasi path folder & history back/forward
│       ├── ExplorerSidebar.jsx                    # Quick access navigation C: Drive
│       ├── ExplorerMainView.jsx                   # Grid / List view item file & folder
│       ├── ExplorerStatusBar.jsx                  # Status bar jumlah item & item terpilih
│       ├── ModalNewFolder.jsx                     # Dialog input nama folder baru
│       ├── ModalNewFile.jsx                       # Dialog pilih tipe file (.docx, .png, .sb3, dll.)
│       ├── ModalRename.jsx                        # Dialog ganti nama berkas/folder
│       ├── ModalMove.jsx                          # Dialog pindah lokasi (dengan Folder Tree Hierarchy)
│       ├── ModalDelete.jsx                        # Konfirmasi hapus berkas
│       └── ModalSubmissionSuccess.jsx             # Dialog selebrasi & submit nilai ke database
│
└── hooks/RuangBelajar/
    ├── useRuangBelajarDB.js                       # Master hook database Supabase & state Ruang Belajar
    └── TugasKhusus/Tugas1/
        ├── useSimulasiFolder.js                   # State engine file explorer, breadcrumb & evaluasi
        └── missionsConfig.js                      # 25 daftar misi evaluasi otomatis (skor maks 100)
```

---

## 3. Alur Data & Siklus State (`useRuangBelajarDB.js`)

### A. Otentikasi Siswa
1. Hook membaca identitas siswa aktif dari `localStorage` (`ruang_belajar_student` atau `siswa_aktif`).
2. Jika ada session NISN, data siswa diambil langsung dari tabel Supabase `master_siswa` agar kolom `total_points` selalu terbarui secara *real-time*.

### B. Query Supabase
* **Tugas Master**: Mengambil semua baris dari `tugas_master` dengan filter `is_active = true`, diurutkan berdasarkan `urutan ASC`.
* **Pengumpulan Siswa**: Mengambil riwayat pengumpulan siswa aktif dari `tugas_pengumpulan` berdasarkan `nisn_siswa`.
* **Riwayat Poin**: Mengambil riwayat log dari `point_logs` berdasarkan `nisn_siswa` (diurutkan `created_at DESC`).
* **Leaderboard Kelas**: Mengambil seluruh siswa kelas 7 (`master_siswa`) yang memiliki `total_points > 0`, diurutkan berdasarkan `total_points DESC`.

---

## 4. Tiga Tab Utama Halaman (`activeTab`)

```text
               ┌──────────────────────────────┐
               │     RuangBelajar.jsx         │
               └──────────────┬───────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   [ activeTab ]        [ activeTab ]        [ activeTab ]
    'timeline'          'log_score'          'leaderboard'
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  TimelineTugas  │  │  LogScoreTugas  │  │ LeaderboardKelas│
│  - Filter modul │  │  - Audit log    │  │  - Tab Kelas 7A-K│
│  - Status tugas │  │  - Search logs  │  │  - Peringkat     │
│  - Tombol Mulai │  │  - Kategori poin│  │  - Medali Juara  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 1. Tab Timeline (`TimelineTugas.jsx`)
* Menampilkan daftar modul pelajaran dan alur roadmap pembelajaran.
* **Indikator Visual & Kartu Interaktif**:
  - **Tuntas Sempurna (100%)**: Badge hijau emerald (`Tuntas: 100/100 Poin`) + banner nilai resmi lengkap dengan ikon piala & tombol *"Lihat / Ulangi Praktik"*.
  - **Tersimpan Sebagian / Lanjutan (Skor < Maksimal)**: Badge amber (`Tersimpan: X/100 Poin`) + status strip berisi *progress bar* animasi & tombol *"Lanjutkan & Sempurnakan Skor (X/100 Poin)"* (murni berdasarkan rekaman di tabel `tugas_pengumpulan`).
  - **Belum Mulai / Belum Ada di Database**: Badge bobot tugas + tombol *"Mulai Praktik"* / *"Mulai Petualangan"*. Jika belum ada di database, wajib mulai dari awal (skor 0).
* Jika tugas memiliki `custom_route` (misal `/tugas/simulasi-folder`, `/tugas/berpikir-komputasional`, atau `/tugas/sistem-komputer`), tombol aksi akan mengarahkan siswa langsung ke modul tugas terkait.
* Jika tugas tipe upload file / link, membuka `ModalSubmitProyek.jsx`.

### 2. Tab Log Nilai (`LogScoreTugas.jsx`)
* Menampilkan seluruh aktivitas perolehan poin dari tabel `point_logs` dengan multi-layer fallback & sintesis audit dari `tugas_pengumpulan`.
* **Sistem Pencocokan Identitas Fleksibel**: Mendukung pencocokan multi-atribut (`id`, `NISN`, dan nama lengkap siswa) untuk memastikan riwayat perolehan poin siswa yang sedang login selalu tampil akurat pada mode *"Poin Saya"*.
* **Realtime Synchronization**: Terhubung langsung ke channel realtime Supabase untuk mendeteksi perubahan pada `point_logs` maupun `tugas_pengumpulan`.
* Dilengkapi filter mode tampilan (*Poin Saya* vs *Semua Log Siswa / Aktivitas Kelas*), filter pencarian teks instan, dan filter kategori chip (*Tugas*, *Game*, *Ujian*, *Bonus*).

### 3. Tab Leaderboard (`LeaderboardKelas.jsx`)
* Membagi leaderboard menjadi tombol pill per kelas: **7A, 7B, 7C, 7D, 7E, 7F, 7G, 7H, 7I, 7J, 7K**.
* Hanya menampilkan siswa dengan `total_points > 0` untuk menjaga kompetisi tetap relevan dan bersih.
* Peringkat 1, 2, dan 3 mendapatkan badge medali emas 🥇, perak 🥈, dan perunggu 🥉.

---

## 5. Indeks Tugas Khusus (Interactive Practical Tasks)

Untuk menjaga performa dan keterbacaan, setiap modul **Tugas Khusus / Simulator Interaktif** didokumentasikan dalam file terpisah di folder `/docs/tugas/`:

| Kode Tugas | Judul Modul & Route | Dokumentasi Teknis | Status |
|---|---|---|---|
| **Tugas 1** | Simulator Manajemen File & Folder (`/tugas/simulasi-folder`) | 📄 **[`/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md`](/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md)** | ✅ Selesai (25 Misi) |
| **Tugas 2** | Petualangan Berpikir Komputasional (`/tugas/berpikir-komputasional`) | 📄 **[`/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md`](/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md)** | ✅ Selesai (4 Misi Terpadu & Modular) |
| **Tugas 3** | Petualangan Sistem Komputer & Perkakas Digital (`/tugas/sistem-komputer`) | 📄 **[`/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md`](/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md)** | ✅ Selesai (4 Misi Terpadu & Modular) |

---

## 6. Alur Pengumpulan & Sinkronisasi Skor Database

```text
[Siswa Menyelesaikan 25 Misi di Simulator] (Skor: 100)
                    │
                    ▼
   Klik "Kumpulkan Simulasi" -> `handleSubmitSimulation()`
                    │
                    ▼
   [tugas_pengumpulan] (UPSERT: id_tugas, nisn, nilai_akhir = 100, status = 'graded')
                    │
                    ▼
   Trigger PostgreSQL Supabase: `trg_sync_tugas_to_point_logs`
                    │ (Membuat / mengupdate 1 baris di `point_logs`)
                    ▼
   [point_logs] (Audit Trail Log Poin)
                    │
                    ▼
   Trigger PostgreSQL Supabase: `trg_update_master_siswa_total_points`
                    │ (SUM semua point_change siswa tersebut)
                    ▼
   [master_siswa.total_points] (Nilai Resmi Siswa Terbarui)
                    │
                    ▼
   Header Siswa & Leaderboard Kelas Terupdate Otomatis secara Real-Time
```

---

## 7. Aturan Perubahan & Modifikasi Modul Ini

1. **Skor Siswa**: Jangan pernah mengkalkulasi ulang `total_points` manual di frontend — selalu biarkan database Supabase mengeksekusi trigger dan baca kolom `total_points` langsung dari `master_siswa`.
2. **Navigasi Bawah**: Fixed bottom navigation bar di `RuangBelajarHeader.jsx` dirender melalui `createPortal` ke `document.body` dengan safe-area inset agar tetap berada di posisi terbawah layar perangkat mobile tanpa tertutup keyboard/browser bar.
3. **Padding Container**: Pastikan `src/pages/RuangBelajar.jsx` mempertahankan bottom padding `pb-32 sm:pb-36` agar elemen paling bawah tidak terpotong oleh bottom bar.
4. **Modal Layering (Highest Priority Z-Index)**: Seluruh modal interaksi (`TaskDetailModal.jsx` dan `ModalSubmitProyek.jsx`) dirender menggunakan `createPortal` ke `document.body` dengan `z-[99999]`, memastikan modal detail tugas dan tombol aksi (seperti *"Lanjutkan Petualangan"*) selalu tampil di lapisan paling depan tanpa tertutupi oleh navbar atas, floating online presence, maupun bar navigasi bawah (Timeline, Log, Peringkat).
5. **Kebijakan Lanjutkan Tugas Wajib dari Database**: Saat siswa mengklik Mulai atau Lanjutkan pada Tugas 1, 2, dan 3, dilarang melanjutkan dari cache localStorage jika datanya belum ada di tabel `tugas_pengumpulan` Supabase. Jika belum ada di database, siswa wajib memulai dari awal (skor 0). Progres dan skor yang dilanjutkan murni berasal dari data resmi database.
6. **Paginasi & Incremental Rendering Log (`LogScoreTugas.jsx`)**: Pengambilan data dari `point_logs`, `tugas_pengumpulan`, dan `master_siswa` menggunakan paginasi `.range(from, from + step - 1)` (step 1000) sehingga seluruh 700+ data berhasil diambil dari database. Pada antarmuka mode Semua Siswa, data dirender secara inkremental (10 item terbaru terlebih dahulu) dilengkapi tombol *"Lihat Lebih Banyak (+10)"* agar beban DOM browser tetap ringan, responsif, dan bebas lag.
7. **Tie-Breaker Peringkat Leaderboard (`LeaderboardKelas.jsx`)**: Jika beberapa siswa memiliki jumlah total poin yang sama, sistem secara otomatis mengurutkan berdasarkan timestamp penyelesaian (`created_at` pada `point_logs`). Siswa yang lebih dulu memperoleh/mencapai skor tersebut akan mendapatkan posisi peringkat yang lebih tinggi (waktu lebih awal / *earliest achieved*).


# Dokumentasi Modul Jurnal & Reservasi Laboratorium (`src/pages/JurnalLabPage.jsx`)

Dokumen ini adalah referensi arsitektur teknis lengkap untuk modul **Jurnal & Reservasi Laboratorium** di platform Ruang Spendaraja (SMP Negeri 2 Singaraja). Dokumen ini mencakup alur kerja, hierarki komponen, skema database Supabase, hak akses (RBAC), algoritma penanggalan, validasi, dan sinkronisasi real-time.

---

## 1. Ringkasan Modul & Ruang Lingkup

Modul **Jurnal Lab** (`/jurnal-lab`) berfungsi sebagai sistem manajemen terpadu untuk:
1. **Pencatatan Jurnal Praktikum Real-time**: Merekam kegiatan belajar mengajar (KBM), ekstrakurikuler, dan ujian di laboratorium sekolah.
2. **Reservasi & Penjadwalan Ruangan**: Membantu guru dan siswa mengajukan jadwal pemakaian laboratorium agar tidak terjadi bentrok (*schedule conflict*).
3. **Pengawasan & Pengembalian Fasilitas**: Memastikan perangkat elektronik, kebersihan, dan kerapian laboratorium diverifikasi sebelum sesi berakhir oleh Pengurus Lab.

### Laboratorium yang Dikelola:
* 🖥️ **LAB Komputer** (Praktikum Informatika, Pemrograman, Desain Grafis, Simulasi)
* 🎬 **LAB Multimedia** (Audio, Video, Editing, Animasi, Podcast)
* 🔬 **LAB IPA** (Praktikum Sains, Fisika, Biologi, Kimia)

---

## 2. Peta File & Arsitektur Komponen

```text
src/pages/JurnalLabPage.jsx (Controller Utama)
├── src/hooks/JurnalLab/useJurnalLab.js (Custom Hook Data, Supabase CRUD & Realtime)
├── src/components/JurnalLab/HeroJurnal.jsx (Header Banner & Tab Switcher Laboratorium)
├── src/components/JurnalLab/TimelineContainer.jsx (Grouping Timeline Bulan/Hari, Clock WITA)
│   └── src/components/JurnalLab/TimelineCard.jsx (Kartu Peminjaman, Dynamic Node Color, Action)
│       ├── src/components/JurnalLab/ModalReject.jsx (Modal Alasan Penolakan Pengajuan)
│       └── src/components/JurnalLab/ModalSelesai.jsx (Modal Checklist Pengembalian & Kendala)
└── src/components/JurnalLab/FormPengajuanModal.jsx (Form Tambah/Edit Reservasi & Validasi Jam)
```

### Rincian Fungsi Per File:

| File | Tipe | Deskripsi & Tanggung Jawab Utama |
|---|---|---|
| `src/pages/JurnalLabPage.jsx` | Page Controller | Mengelola state sesi user login, modal buka/tutup, routing parameter lab, dan render komponen utama. |
| `src/hooks/JurnalLab/useJurnalLab.js` | Custom Hook | Pusat komunikasi database Supabase (`jurnal_lab`), subscription realtime postgres channel, CRUD (Insert/Update/Delete/Approve/Complete). |
| `src/components/JurnalLab/HeroJurnal.jsx` | UI Component | Banner visual dengan latar gradien gelap, deskripsi, dan tombol navigasi tab beralih antar lab. |
| `src/components/JurnalLab/TimelineContainer.jsx` | UI Component | Mengelompokkan data secara hierarkis per Bulan -> Hari, menyediakan jam digital WITA live, dan scroll view. |
| `src/components/JurnalLab/TimelineCard.jsx` | UI Component | Node garis waktu visual dengan styling adaptif (warna neon dinamis sesuai status waktu & pengajuan), detail expand, serta tombol aksi ACC/Tolak/Selesai/Edit/Hapus. |
| `src/components/JurnalLab/FormPengajuanModal.jsx` | Modal Form | Antarmuka formulir tambah dan edit peminjaman, konversi datetime picker ke format ISO 8601, serta validasi jam mulai/selesai. |
| `src/components/JurnalLab/ModalReject.jsx` | Modal Action | Pop-up konfirmasi penolakan jadwal oleh pengurus lab dengan input wajib alasan penolakan. |
| `src/components/JurnalLab/ModalSelesai.jsx` | Modal Action | Formulir checklist pengembalian (elektronik dimatikan, kebersihan, kerapian kursi) dan catatan kendala fasilitas. |

---

## 3. Skema Database Supabase (`public.jurnal_lab`)

Tabel utama yang digunakan dalam modul ini adalah `public.jurnal_lab` yang berelasi dengan `public.master_siswa` untuk melacak pemohon pengajuan.

### Struktur Kolom Tabel `jurnal_lab`

| Nama Kolom | Tipe Data | Nullable | Default | Deskripsi & Contoh Nilai |
|---|---|---|---|---|
| `id` | `uuid` / `bigint` | NO | `gen_random_uuid()` / auto | Primary key unik setiap baris jurnal lab |
| `nama_lab` | `text` | NO | - | Identitas lab (`LAB Komputer`, `LAB Multimedia`, `LAB IPA`) |
| `waktu_mulai` | `timestamptz` | NO | - | Waktu awal pemakaian (format ISO 8601 UTC) |
| `waktu_selesai` | `timestamptz` | NO | - | Waktu berakhirnya pemakaian (format ISO 8601 UTC) |
| `guru_pengajar` | `text` | NO | - | Nama guru penanggung jawab / pengajar |
| `mata_pelajaran` | `text` | NO | - | Mata pelajaran atau nama kegiatan (contoh: `Informatika`, `Desain UI`) |
| `kelas` | `text` | NO | - | Rombel kelas pengguna (contoh: `VIII A`, `VII C`, `Klub Robotik`) |
| `jumlah_siswa` | `integer` | YES | `0` | Estimasi jumlah siswa/peserta di dalam lab |
| `kategori_kegiatan` | `text` | YES | `'KBM'` | Kategori: `KBM`, `Ekskul`, `Ujian`, `Lainnya` |
| `materi_kegiatan` | `text` | YES | `NULL` | Uraian materi pembelajaran atau topik praktikum |
| `kondisi_awal` | `text` | YES | `'Baik'` | Kondisi ruangan & fasilitas sebelum dimulai |
| `kondisi_akhir` | `text` / `jsonb` | YES | `NULL` | JSON string checklist pengembalian (elektronik, kebersihan, kerapian) |
| `catatan_kendala` | `text` | YES | `NULL` | Laporan kendala kerusakan hardware, PC mati, jaringan, atau AC |
| `status_pengajuan` | `text` | NO | `'pending'` | Status alur: `pending`, `approved`, `rejected`, `completed` |
| `pemohon_id` | `uuid` / `bigint` | YES | `NULL` | FK ke `master_siswa.id` (akun siswa/guru yang mengajukan) |
| `acc_by` | `text` | YES | `NULL` | Nama admin/guru pengurus lab yang menyetujui/menolak |
| `acc_at` | `timestamptz` | YES | `NULL` | Timestamp kapan pengajuan disetujui/ditolak |
| `alasan_penolakan` | `text` | YES | `NULL` | Alasan jika status pengajuan diubah menjadi `rejected` |
| `created_at` | `timestamptz` | YES | `now()` | Waktu pembuatan baris data di database |

### Foreign Key Relationship
```sql
ALTER TABLE public.jurnal_lab
ADD CONSTRAINT jurnal_lab_pemohon_id_fkey
FOREIGN KEY (pemohon_id) REFERENCES public.master_siswa(id)
ON DELETE SET NULL;
```

---

## 4. Algoritma & Logika Alur Kerja Sistem

### A. Algoritma Deteksi Sesi Pengguna Fleksibel (*Multi-Key Storage Fallback*)
Di `JurnalLabPage.jsx`, sesi login dideteksi dari berbagai varian key `localStorage` untuk mendukung akun siswa, guru, dan admin secara seamless:
1. Membaca properti `propsUser` jika dikirimkan oleh parent component.
2. Jika tidak ada, melakukan pemindaian ke seluruh key di `localStorage`.
3. Memilih objek JSON yang memiliki field identitas valid (`id`, `NISN`, `NAMA`, `nama`, atau `role`).
4. Memasang event listener `window.addEventListener('storage', syncUser)` untuk auto-sync jika pengguna login di tab lain.

### B. Matrix Hak Akses (*Role-Based Access Control - RBAC*)

```text
               ┌──────────────────────────────┐
               │  Tamu (Belum Login)          │──► Hanya dapat melihat timeline (Tombol Ajukan Terkunci)
               └──────────────────────────────┘
               ┌──────────────────────────────┐
               │  Siswa / Guru (Pemohon)      │──► Ajukan jam lab baru, Edit & Hapus data milik sendiri
               └──────────────────────────────┘
               ┌──────────────────────────────┐
               │  Pengurus Lab / Admin        │──► Hak Penuh: ACC / Tolak, Selesaikan, Edit semua, Hapus
               └──────────────────────────────┘
```

Kriteria Pengurus Lab (`isPengurusLab`):
```javascript
const isPengurusLab = Boolean(
    currentUser?.role === 'admin' || 
    currentUser?.role_2 === 'pengurus_lab'
);
```

Hak Akses Aksi Kartu:
* **Tombol Edit / Hapus**: Tampil jika user adalah `isPengurusLab` **ATAU** `isOwner` (pemilik data yang membuat pengajuan dengan `currentUserId === item.pemohon_id` atau `guru_pengajar === currentUser.NAMA`).
* **Tombol ACC / Tolak**: Hanya tampil jika user adalah `isPengurusLab` dan status pengajuan masih `pending` (Guru pengajar biasa tanpa role pengurus lab TIDAK dapat melakukan ACC/Tolak).
* **Tombol Selesaikan Jam Lab / Isi Jurnal**: Hanya tampil jika user adalah `isOwner` (pemilik data peminjaman yang mengajukan) dan status pengajuan `approved` atau `completed`. Pengurus lab yang bukan owner tidak dapat mengisi/mengubah jurnal peminjaman orang lain.
  - Jika jurnal belum diisi: Tombol berlabel **"Isi Jurnal Lab (Belum Diisi)"** (warna amber) dan kartu menampilkan badge **"Belum Isi Jurnal"**.
  - Jika jurnal sudah diisi: Tombol berlabel **"Lihat / Edit Jurnal Lab"** (warna indigo) dan kartu menampilkan badge **"Jurnal Terisi"**. Data awal diambil dari database untuk diedit kembali.
* **Format Tampilan Kondisi Akhir**: String JSON `kondisi_akhir` diparsing otomatis menjadi kartu visual ramah pengguna dengan status checklist ikonik (Elektronik Dimatikan ✅/❌, Ruangan Disapu ✅/❌, Kursi & Meja Rapi ✅/❌).
* **Form Kondisi Awal**: Terdapat pada modal pengisian jurnal lab untuk memperbarui kondisi awal ruangan/perangkat saat pertama kali digunakan.

---

### C. Algoritma Pengelompokan Hierarki Timeline (Bulan -> Hari)
Di `TimelineContainer.jsx`, daftar flat `jurnalList` dari database ditransformasikan menjadi pohon bersarang (*nested tree*) secara komputasi memoized (`useMemo`):

```javascript
// Algoritma Pengelompokan Data:
const groupedData = safeItems.reduce((months, item) => {
    const dateObj = new Date(item.waktu_mulai);
    const dayKey = getLocalDateString(dateObj); // YYYY-MM-DD
    const monthKey = dayKey.substring(0, 7);    // YYYY-MM

    if (!months[monthKey]) {
        months[monthKey] = {
            monthKey,
            label: dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            days: {},
            totalItems: 0
        };
    }

    if (!months[monthKey].days[dayKey]) {
        months[monthKey].days[dayKey] = {
            dayKey,
            label: dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
            items: []
        };
    }

    months[monthKey].days[dayKey].items.push(item);
    months[monthKey].totalItems += 1;
    return months;
}, {});
```

#### Aturan Auto-Expand Accordion & Notifikasi Pending (Belum di-ACC):
* Secara otomatis membuka bulan berjalan (`todayMonthKey === YYYY-MM`).
* Secara otomatis membuka hari ini (`todayDayKey === YYYY-MM-DD`).
* Hari ini diberi badge khusus `Hari Ini` dengan border hijau emerald menyala (`border-emerald-500/40 bg-emerald-950/10`).
* **Indikator Titik Merah Kedip-kedip (Pending Notification Dot)**:
  1. **Tab Lab Switcher (`HeroJurnal.jsx`)**: Menampilkan titik merah berkedip (`animate-ping`) pada tab lab yang memiliki pengajuan berstatus `pending`.
  2. **Header Kontainer Bulan (`TimelineContainer.jsx`)**: Menampilkan badge bertitik merah berkedip beserta jumlah pengajuan yang belum di-ACC dalam bulan tersebut.
  3. **Header Kontainer Tanggal/Hari (`TimelineContainer.jsx`)**: Menampilkan badge bertitik merah berkedip pada baris tanggal yang memuat peminjaman yang masih menunggu persetujuan (*pending*).

---

### D. Algoritma Dynamic Theme Engine (Visual Node & Kartu)
Setiap kartu peminjaman pada `TimelineCard.jsx` dievaluasi status waktu dan backend-nya secara dinamis:

```text
Kondisi Logika Status Visual:
1. isRejected (status_pengajuan === 'rejected')
   └─► Tema Rose/Merah (Border Merah Neon, Badge Ditolak, Glowing 0.8)
2. isPending (status_pengajuan === 'pending')
   └─► Tema Amber/Kuning (Border Kuning, Badge Belum Dikonfirmasi)
3. isOngoing (now >= start && now <= end && !isRejected)
   └─► Tema Emerald/Hijau Neon (Node Animasi Membal/Bounce, Badge Pulse)
4. isFutureTime (now < start && isApproved)
   └─► Tema Emerald Gelap (Badge Disetujui, Waktu Masa Depan)
5. isPast / isCompleted (now > end || status_pengajuan === 'completed')
   └─► Tema Slate Meredup (Badge Selesai / Berlalu)
```

---

### E. Algoritma Konversi Waktu & Validasi Jam (WITA & ISO 8601)
1. **Jam Digital Live (WITA)**:
   - Menggunakan `Intl.DateTimeFormat` dengan zona waktu resmi Bali/Makassar `Asia/Makassar` (WITA = UTC+8).
   - Diperbarui setiap 1.000 ms via `setInterval`.
2. **Formulir Pengajuan Bebas Selisih Zona Waktu Device (`FormPengajuanModal.jsx`)**:
   - Menggunakan input native format waktu 24 Jam (`<input type="time" ... />`) yang memicu dialog pemilih waktu jam melingkar (*clock dial / circular time picker*) bawaan perangkat mobile dan peramban modern.
   - Pengecekan durasi: `jam_selesai > jam_mulai`.
   - Konversi ISO 8601 berbasis offset eksplisit GMT+8:
     ```javascript
     const startDateTime = new Date(`${formData.tanggal}T${formData.jam_mulai}:00+08:00`);
     const endDateTime = new Date(`${formData.tanggal}T${formData.jam_selesai}:00+08:00`);
     ```
   - **Nama Peminjam**: Otomatis terisi sesuai profil akun guru/pengguna yang sedang aktif (`currentUser.NAMA || currentUser.nama`).
   - **Mata Pelajaran / Kegiatan**: Menampung informasi nama mata pelajaran atau jenis agenda/kegiatan rapat & pelatihan.
   - **Solusi Z-Index & Aksesibilitas Penutupan Modal**:
     - Menggunakan React `createPortal` (langsung ke `document.body`) dengan `z-[250]`, berada di atas lapisan Navbar (`z-[100]`) sehingga tombol close `X` dan judul tidak pernah terhalang / tertimpa navbar saat di-scroll.
     - Menyediakan 4 metode penutupan: tombol sticky close `X` di sudut kanan atas, tombol `Batal` di bagian bawah formulir, klik area gelap (*backdrop*), serta tombol keyboard `Escape`.
     - Mengaktifkan kunci scroll background (`document.body.style.overflow = 'hidden'`) saat modal aktif.
   - **Pencegahan Tabrakan Jadwal Real-Time (Schedule Collision Prevention)**:
     - Validasi tabrakan jadwal berlaku **ketat hanya jika**: (1) Laboratorium yang dipilih sama, (2) Tanggal peminjaman sama (zona WITA), dan (3) Jam pelaksanaan saling bertabrakan/tumpang-tindih `(startA < endB) && (endA > startB)`. Pengajuan yang ditolak (*rejected*) atau pengajuan di tanggal/lab lain tidak akan mengunci tombol.
     - **Banner Peringatan Merah Berkedip**: Menampilkan kotak merah beranimasi denyut (*pulse/ping dot*) dengan rincian nama peminjam, mapel, kelas, dan rentang jam yang bentrok.
     - **Kunci Tombol Otomatis & Label Kedip Merah**: Tombol pengajuan dinonaktifkan (*disabled*) dan berganti tampilan menjadi merah berkedip bertuliskan *"Jadwal Bertabrakan (Terkunci)"*. Di bawah tombol juga ditampilkan label keterangan kecil berkedip merah: *"⚠️ Tidak bisa melakukan pengajuan: Jadwal di tanggal, lab, dan jam ini sudah terisi."* sehingga peminjam segera mengetahui penyebab tombol terkunci.
   - Fungsi `parseIsoToWITA(isoString)` mengekstrak tanggal dan jam (HH:mm) dalam zona `Asia/Makassar` saat form dibuka dalam **Mode Edit**.
   - Menyediakan tombol *Quick Presets* sesi praktikum KBM reguler (07:30-09:00, 09:00-10:30, 10:45-12:15, 13:00-14:30, 15:00-16:30).

---

### F. Algoritma Sinkronisasi Real-Time Supabase
Di `useJurnalLab.js`, perubahan jadwal lab (baik dari pengajuan baru, approval, penolakan, edit materi, maupun penyelesaian sesi) langsung disinkronkan ke seluruh klien yang sedang membuka halaman tanpa perlu refresh peramban:

```javascript
const channelId = `realtime_jurnal_lab_${Math.random().toString(36).substring(2, 7)}`;
const channel = supabase
    .channel(channelId)
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jurnal_lab' },
        () => {
            fetchJurnal(); // Otomatis refresh data terbaru
        }
    )
    .subscribe();
```

---

### G. Alur Penyelesaian Sesi & Laporan Checklist Lab (`ModalSelesai.jsx`)
Saat guru atau pengurus lab menekan tombol **"Selesaikan Jam Lab"** atau **"Isi Jurnal / Laporan Lab"**:
1. Menampilkan 3 item checklist wajib fasilitas:
   - ✅ *Peralatan elektronik dimatikan (Komputer, IFP, AC, Proyektor, Lampu).*
   - ✅ *Ruangan dibersihkan dan disapu.*
   - ✅ *Kursi dan meja dirapikan ke posisi semula.*
2. Menyediakan textarea opsional untuk mencatat kendala kerusakan atau gangguan teknis.
3. Data checklist di-serialize menjadi JSON terstruktur ke kolom `kondisi_akhir`:
   ```json
   {
     "elektronik_dimatikan": true,
     "ruangan_dibersihkan": true,
     "kursi_dirapikan": true
   }
   ```
4. Mengubah status pengajuan di database menjadi `'completed'`.

---

## 5. Panduan Penggunaan & Panduan AI Agent

1. **Integritas Waktu ISO**: Seluruh query dan penyimpanan waktu harus selalu menggunakan standar ISO string dengan timezone (`timestamptz`).
2. **Keamanan Relasi Pemohon**: Saat membuat pengajuan baru, pastikan menyertakan `pemohon_id: user?.id` agar hak akses edit dan hapus dapat terasosiasi dengan pemilik akun.
3. **Penyelarasan Role**: Periksa selalu kombinasi `role` dan `role_2` agar otorisasi Pengurus Lab dan Guru Pengajar tetap konsisten di seluruh aplikasi.

# Panduan Arsitektur & Cara Kerja: Home & Komponen Global

Dokumen ini mendokumentasikan secara rinci halaman **Beranda (Home Portal)** serta tiga komponen interaktif global yang aktif di seluruh aplikasi: **Navbar**, **FloatingOnline**, dan **LiveChat**.

---

## 1. Peta File & Direktori

```text
src/
├── pages/
│   └── Home.jsx                           # Controller Beranda & App Launcher
│
├── components/
│   ├── Navbar.jsx                         # Controller Utama Topbar Mengambang & Event Listener
│   ├── Navbar/
│   │   ├── NavbarBrand.jsx                # Brand Logo Ruang Spendaraja & Versi Aplikasi
│   │   ├── NavbarPointsBadge.jsx          # Indikator Poin Siswa Beranimasi (Kelas 7 & Admin)
│   │   ├── NavbarUserSection.jsx          # Tombol Masuk / Avatar Foto Profil Bulat & Profil Trigger
│   │   ├── ModalLogin.jsx                 # Modal Dialog Autocomplete Siswa & Pembuatan Akun Baru
│   │   ├── ModalProfilUser.jsx            # Modal Informasi Akun Siswa & Trigger Ambil Foto Kamera
│   │   └── CameraCaptureModal.jsx         # Viewfinder Kamera Langsung (Selfie 1:1, Flip, Snap & Anti-Pilih Berkas)
│   │
│   ├── FloatingOnline.jsx                 # Sidebar Mengambang Indikator Online (Supabase Presence)
│   ├── LiveChat.jsx                       # Widget Obrolan Realtime Siswa Antar-Kelas
│   │
│   └── Home/
│       ├── Hero.jsx                       # Header Sambutan, Profil Siswa & Filter Kategori
│       ├── ShortcutCard.jsx               # Kartu Aplikasi & Launcher Akses Layanan
│       ├── FeedbackForm.jsx               # Formulir Masukan & Saran Siswa/Pengunjung
│       └── Footer.jsx                     # Footer Portal Sekolah
│
└── utils/
    ├── appPermissions.js                  # Helper Verifikasi Izin Akses Modul Siswa/Kelas
    └── bannedWordsPool.js                 # Filter Otomatis Sensor Kata Kasar pada LiveChat
```

---

## 2. Halaman Beranda (`src/pages/Home.jsx`)

Halaman `Home` bertindak sebagai **Central App Launcher** untuk seluruh ekosistem digital Ruang Spendaraja.

### A. Fitur Utama
1. **Penyambutan Pengguna Terpersonalisasi (`Hero.jsx`)**:
   - Membaca session siswa dari `localStorage` (`user_siswa`).
   - Menampilkan nama siswa aktif dengan typography artistik atau banner *Digital Ecosystem v3.0*.
   - Filter Kategori Aplikasi: **Semua**, **Akademik**, **Event**, **Fasilitas**.

2. **Daftar Aplikasi & Hak Akses (`availableApps` & `ShortcutCard.jsx`)**:
   - Mengelola daftar modul aplikasi (Ruang Belajar, Typing Challenge, GEMPITAS 2026, Catatan Disiplin, BEE 2026, Jurnal Lab, dll.).
   - Setiap kartu memiliki efek visual neon glow dan border adaptif sesuai status izin pengguna (`checkAppAccess`).

3. **Formulir Umpan Balik (`FeedbackForm.jsx`)**:
   - Memungkinkan siswa atau guru mengirimkan saran, laporan kendala, atau masukan yang tersimpan ke Supabase.

---

## 3. Global Navigation Bar (`src/components/Navbar.jsx` & `src/components/Navbar/`)

Komponen `Navbar` berada di posisi paling atas layar, dibangun dengan arsitektur modular berkinerja tinggi, dan menyertakan integrasi foto profil siswa ke Cloudinary serta sinkronisasi Supabase Realtime.

```text
               ┌────────────────────────────────────────────────────────┐
               │ Navbar Mengambang (Floating Pill Header)               │
               │ [Logo Spenda]             [Poin] [Avatar Siswa] [Keluar]│
               └────────────────────────────────────────────────────────┘
```

### A. Pembagian Komponen Modular
1. **`Navbar.jsx` (Root Controller)**:
   - Mengatur event scroll (`useScroll`, `useMotionValueEvent`) dengan transisi auto-hide (sembunyi saat scroll ke bawah > 150px, muncul saat scroll ke atas).
   - Mengelola koneksi Supabase Realtime channel (`postgres_changes` tabel `master_siswa`) untuk pembaruan `total_points` dan `foto_profile` secara instan.
   - Mengorkestrasi pembukaan modal login dan modal detail profil.
2. **`NavbarBrand.jsx`**:
   - Menampilkan logo sekolah, judul "Ruang Spendaraja", serta versi rilis aplikasi.
3. **`NavbarPointsBadge.jsx`**:
   - Menampilkan akumulasi poin siswa (khusus kelas 7 & admin) dengan ikon animasi kilau (*sparkles*).
4. **`NavbarUserSection.jsx`**:
   - Jika belum login: Tombol masuk beranimasi.
   - Jika sudah login: Menampilkan avatar foto profil berbentuk bulat (atau inisial nama jika belum ada foto), nama pendek siswa, kelas, dan tombol keluar cepat (*quick logout*). Mengklik avatar akan membuka modal profil pengguna.
5. **`ModalLogin.jsx`**:
   - Autocomplete pencarian nama siswa di tabel `master_siswa`.
   - Logika aktivasi akun baru (`is_registered === false`) dengan pembuatan password pertama kali minimal 6 karakter.
   - Form input kata sandi dengan fitur lihat/sembunyikan (*toggle show/hide*).
6. **`ModalProfilUser.jsx` & `CameraCaptureModal.jsx`**:
   - Tampilan profil lengkap: Nama Lengkap, Kelas, No. Absen, NISN, Total Poin, dan Status Akun.
   - **Kebijakan Kamera Langsung (Anti-Pilih Berkas/Galeri)**: Input berkas lokal dinonaktifkan secara total. Penggantian foto profil mewajibkan pengguna membuka kamera langsung melalui `CameraCaptureModal.jsx` dengan bingkai oval panduan wajah, flip kamera (depan/belakang), dan crop instan 1:1.
   - Kompresi foto otomatis di sisi klien (*HTML5 Canvas* 1280px WebP, quality 0.8) sebelum pengunggahan.
   - Unggah melalui backend terotentikasi (`/api/profile/upload`) menggunakan Cloudinary Signed SDK dengan `overwrite: true` dan nama file statis tetap `photo_profile/profil_${user.id}` (1 siswa = tepat 1 file di Cloudinary).
   - Progress bar interaktif selama kompresi dan pengunggahan.
   - Fitur hapus foto profil dengan konfirmasi inline aman tanpa `window.confirm`. Menghapus aset fisik secara tuntas di Cloudinary via `/api/profile/delete` (`cloudinary.uploader.destroy`) serta mengosongkan kolom `foto_profile` di database menjadi `NULL` dan kembali ke avatar inisial.

### B. Mekanisme Unggah & Hapus Foto Profil (Server-Side Signed Cloudinary)
- Siswa menekan tombol kamera pada `ModalProfilUser.jsx`, yang langsung membuka viewfinder `CameraCaptureModal.jsx`.
- Setelah foto dijepret dan dikonfirmasi, gambar dikompresi menjadi WebP ringan di sisi klien, diubah menjadi Base64 Data URL, lalu dikirim ke backend `/api/profile/upload`.
- Server Node.js mengotentikasi permintaan menggunakan API Key & Secret Cloudinary, lalu mengunggah ke `folder: 'photo_profile'` dengan `public_id: 'profil_${userId}'`, `overwrite: true`, dan `invalidate: true`. Berkas lama otomatis tertimpa secara bersih tanpa menumpuk sampah di penyimpanan.
- URL foto berversi baru (`.../v{version}/photo_profile/profil_{userId}`) disimpan ke kolom `foto_profile` pada tabel `master_siswa` di Supabase, disinkronkan ke `localStorage`, dan disebarkan melalui CustomEvent `user-updated`.
- Saat siswa mengklik hapus foto, backend `/api/profile/delete` memanggil `cloudinary.uploader.destroy('photo_profile/profil_${userId}')` sehingga aset fisik di Cloudinary terhapus bersih dan kuota storage tetap maksimal.

---

## 4. Floating Online Presence (`src/components/FloatingOnline.jsx`)

> *Dokumentasi teknis & arsitektur lengkap:* **[`/docs/FLOATING_ONLINE.md`](/docs/FLOATING_ONLINE.md)**

Widget mengambang di sisi kanan layar yang berfungsi memantau kehadiran siswa secara interaktif.

```text
               Layar Kanan
               ┌──────────┬─────────────────────────────┐
               │ [HANDLE] │ Panel Statistik Online      │
               │  (Hijau) │ - 🟢 28 Siswa Online        │
               │          │ - Daftar Nama & Posisi      │
               │          │ - 💬 Tombol Buka Live Chat  │
               └──────────┴─────────────────────────────┘
```

### A. Cara Kerja Supabase Presence
1. **Inisialisasi Presence Room**:
   - Menggunakan `supabase.channel('online_room_...')` dengan konfigurasi `{ presence: { key: identifier } }`.
   - Mengirimkan metadata pelacakan (*presence track*):
     ```javascript
     {
       nama: identifier,
       kelas: userClass,
       posisi: activeTab, // Contoh: 'Ruang Belajar TIK', 'Home', 'Ulangan'
       online_at: new Date().toISOString()
     }
     ```
2. **Sinkronisasi Otomatis**:
   - Event `channel.on('presence', { event: 'sync' })` menghitung total siswa online dan memperbarui daftar avatar aktif.
3. **Badge Notifikasi Chat**:
   - Menyimpan `unreadCount` dan memunculkan badge merah berdenyut (*pulse*) saat ada pesan baru ketika panel chat tertutup.

---

## 5. Live Chat Real-time (`src/components/LiveChat.jsx`)

> *Dokumentasi teknis & arsitektur lengkap:* **[`/docs/LIVE_CHAT.md`](/docs/LIVE_CHAT.md)**

Ruang obrolan interaktif seluruh siswa yang terintegrasi langsung dengan database Supabase.

```text
   Siswa Kirim Pesan
          │
          ▼
   [Filter Kata Kasar] (filterBadWords)
          │
          ▼
   [Tabel Supabase: livechat] (INSERT)
          │
          ▼ Realtime Broadcast (channel.on INSERT)
          │
   ┌──────┴─────────────────────────────────┐
   ▼                                        ▼
Audio Notifikasi                     Pesan Muncul di Layar Siswa Lain
(Mixkit SFX)                         (Auto-scroll ke bawah)
```

### A. Fitur Kunci Live Chat
1. **Sensor Kata Kasar Otomatis (`filterBadWords`)**:
   - Menyaring input teks dari daftar kata terlarang di `bannedWordsPool.js` sebelum dikirimkan ke tabel `livechat`.

2. **Kontrol Akses Per-Kelas (`game_controls`)**:
   - Guru dapat mengunci atau membuka izin chat untuk kelas tertentu (misal: saat kelas 7.1 sedang ulangan, chat untuk kelas 7.1 dinonaktifkan dari tabel `game_controls` dengan `game_id = 'livechat_control'`).

3. **Audio Notifikasi & Unread Counter**:
   - Memainkan efek suara saat ada pesan masuk baru dan mengirim sinyal jumlah pesan belum dibaca (*unread*) ke `FloatingOnline` secara asinkron.

4. **Kaya Fitur Interaktif**:
   - Dukungan picker emoji (`emoji-picker-react`).
   - Warna nama pengirim otomatis acak dan konsisten berdasarkan hash nama.
   - Paginasi scroll riwayat pesan lama (*Load more messages*).

---

## 6. Aturan Perubahan & Modifikasi Komponen Ini

1. **Z-Index Layering**:
   - `Navbar`: `z-40` / `z-50`
   - `FloatingOnline` & `LiveChat`: `z-[45]` sampai `z-50` (Pastikan modal tidak tertutup oleh elemen konten halaman).
2. **Supabase Channel Cleanup**:
   - Selalu bersihkan channel realtime di `return () => { supabase.removeChannel(channel); }` pada setiap hook `useEffect` untuk mencegah memory leak dan penggandaan websocket connection.
3. **State Sync `unreadCount`**:
   - Pembaruan count dari `LiveChat` ke `FloatingOnline` menggunakan `setTimeout(..., 0)` agar tidak memicu peringatan React *state update during render*.

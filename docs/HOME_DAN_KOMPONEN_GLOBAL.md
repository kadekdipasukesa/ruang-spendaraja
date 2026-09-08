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
│   ├── Navbar.jsx                         # Topbar Mengambang & Modal Login/Registrasi Siswa
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

## 3. Global Navigation Bar (`src/components/Navbar.jsx`)

Komponen `Navbar` berada di posisi paling atas layar dan menyertakan sistem login cepat bagi siswa.

```text
               ┌────────────────────────────────────────────────────────┐
               │ Navbar Mengambang (Floating Pill Header)                │
               │ [Logo Spenda]                    [Poin] [Nama / Login] │
               └────────────────────────────────────────────────────────┘
```

### A. Alur Kerja & Fitur Kunci
1. **Auto-Hide on Scroll**:
   - Menggunakan hook Framer Motion (`useScroll` dan `useMotionValueEvent`).
   - Jika pengguna scroll ke bawah lebih dari 150px, navbar menghilang halus ke atas. Saat pengguna scroll ke atas sedikit saja, navbar langsung muncul kembali.

2. **Sinkronisasi Poin Real-time (Supabase Realtime Channel)**:
   - Berlangganan channel `postgres_changes` pada tabel `master_siswa` berdasarkan `user.id`.
   - Jika ada trigger poin bertambah dari tugas atau kuis, poin pada badge navbar langsung terupdate tanpa perlu refresh halaman.

3. **Modal Login & Registrasi Siswa Mandiri**:
   - **Pencarian Cepat Nama**: Fitur autocomplete nama siswa (mencari ke tabel `master_siswa` dengan limit 5).
   - **Aktivasi Akun Pertama Kali**: Jika siswa baru pertama kali login (`is_registered === false`), form otomatis meminta input password baru minimal 6 karakter.
   - **Login Cepat**: Verifikasi password terhadap kolom `password` pada tabel `master_siswa`.

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

# Panduan Teknis & Arsitektur: FloatingOnline (`src/components/FloatingOnline.jsx`)

Dokumen ini menjelaskan secara menyeluruh arsitektur, siklus hidup data, alur Supabase Presence, interaksi antarmuka pengguna (UI/UX), serta integrasi komunikasi dengan widget chat pada komponen **`FloatingOnline`**.

---

## 1. Ikhtisar & Peran Komponen

Komponen `FloatingOnline` adalah widget mengambang (*floating widget*) yang ditempatkan di sisi kanan layar aplikasi (`fixed right-0 top-1/2 -translate-y-1/2`). Komponen ini memiliki fungsi utama:
1. **Pemantau Kehadiran Pengguna (User Presence Tracker)**: Melacak siapa saja siswa/pengguna yang sedang aktif membuka aplikasi Ruang Spendaraja secara *real-time*.
2. **Penampil Statistik Kehadiran**: Menghitung jumlah pengguna online dan menyajikan daftar detail nama, kelas, serta posisi halaman terakhir pengguna.
3. **Pemicu Antarmuka Obrolan (Live Chat Launcher & Notification Bridge)**: Bertindak sebagai penghubung (*bridge*) untuk membuka jendela `LiveChat` dan menampilkan lencana merah (*unread badge*) saat ada pesan baru yang masuk ketika chat sedang ditutup.

---

## 2. Struktur Props & Kontrak Data

Komponen dideklarasikan dengan fungsi berikut:

```jsx
export default function FloatingOnline({ user, activeTab })
```

| Nama Prop | Tipe Data | Keterangan & Fallback |
|---|---|---|
| `user` | `Object` | Data sesi siswa aktif dari `localStorage` atau state login. Mendukung properti: `NAMA` / `nama`, `KELAS` / `Kelas` / `kelas`, `id`. Jika null/falsy, sistem menganggap pengguna sebagai tamu (`Tamu-[random]`). |
| `activeTab` | `String` | Nama tab/halaman tempat pengguna berada saat ini yang ditentukan otomatis oleh `getActiveTabLabel()` di `src/App.jsx` (misal: `'Home'`, `'Ruang Belajar TIK'`, `'Tugas 1: Simulasi Folder'`, `'Tugas 2: Berpikir Komputasional'`, `'Tugas 3: Sistem Komputer'`, `'Jurnal Lab Komputer'`, `'Mengisi Agenda Guru'`, `'Mengerjakan Ulangan'`, `'Mengerjakan Remidi'`, `'Kelola Akun Siswa'`, dll.). Default fallback: `'Menjelajah Portal'`. |

---

## 3. Alur Kerja Supabase Realtime Presence

Komponen menggunakan fitur **Supabase Realtime Presence** melalui koneksi WebSocket resmi (`supabaseClient.js`).

```text
Siswa Masuk Aplikasi / Ubah Tab
               │
               ▼
[useEffect Channel Initialization]
   - Channel Room Tetap (Shared): `spenda_global_online_room`
   - Presence Key: `usr_[id]` / `nisn_[nisn]` / `guest_[sessionId]`
               │
               ▼
[channel.subscribe] ───► status === 'SUBSCRIBED'
                               │
                               ▼
                    [channel.track(metadata)]
                    - id: presenceKey
                    - nama: identifier
                    - kelas: userClass
                    - posisi: activeTab
                    - online_at: timestamp ISO
                               │
                               ▼ Broadcast ke Seluruh Klien di Room yang Sama
┌────────────────────────────────────────────────────────────────────────┐
│ Event: `presence: { event: 'sync' }` / `join` / `leave`                │
│ - Membaca snapshot: `channel.presenceState()`                          │
│ - Deduplikasi per key siswa / tamu stabil                              │
│ - Update state: `setOnlineCount(uniqueUsers.length)`                   │
│ - Update state: `setOnlineUsers(uniqueUsers)`                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Rincian Implementasi Presence:
1. **Nama Room Statis (`spenda_global_online_room`)**:
   - **Krusial**: Seluruh pengguna wajib terhubung ke nama channel yang sama persis agar berada di dalam satu ruangan obrolan presence yang sama.
2. **Kunci Presence Unik & Stabil (`presenceKey`)**:
   - Untuk siswa login: Menggunakan format `usr_[id]` atau `nisn_[NISN]`. Jika siswa membuka 2 tab sekaligus, presence digabungkan ke 1 identitas sehingga tidak terjadi double count.
   - Untuk tamu belum login: Menggunakan sesi stabil `sessionStorage` (`spenda_presence_guest_id` dan `spenda_presence_guest_name`), sehingga identitas tamu tidak berubah-ubah saat berpindah rute/halaman.
3. **Pelacakan Posisi (`channel.track`)**:
   - Mengirim metadata `{ id, nama, kelas, posisi, online_at }`.
   - Mengupdate lokasi halaman aktif secara real-time saat prop `activeTab` berganti.
4. **Pembersihan Koneksi (Lifecycle Cleanup)**:
   - Pada return fungsi `useEffect`, `supabase.removeChannel(channel)` wajib dipanggil untuk melepas presence user dari room saat browser ditutup.

---

## 4. State Management Internal

| State | Tipe | Nilai Awal | Fungsi & Kegunaan |
|---|---|---|---|
| `onlineCount` | `Number` | `0` | Jumlah total pengguna yang sedang terhubung pada Presence room. |
| `onlineUsers` | `Array` | `[]` | Daftar objek metadata seluruh pengguna online. |
| `isOpen` | `Boolean` | `false` | Menentukan apakah panel samping sedang terbuka atau tertutup ke sisi layar. |
| `showDetail` | `Boolean` | `false` | Menentukan kemunculan modal popup rincian user online. |
| `triggerChat` | `Boolean` | `false` | Sinyal pemicu (*external trigger*) untuk memerintahkan `LiveChat` terbuka. |
| `unreadCount` | `Number` | `0` | Jumlah pesan belum dibaca yang diterima dari callback `setUnreadExternal` milik `LiveChat`. |

---

## 5. Anatomi Antarmuka Pengguna (UI Layout & Styling)

### A. Handle Samping Mengambang (Side Tab Handle)
* **Visual**: Batang hijau zamrud memanjang dengan bayangan neon halus (`shadow-[-4px_0_15px_rgba(16,185,129,0.4)]`).
* **Deteksi Cerdas Perangkat (Chromebook vs. Windows/HP/Mac)**:
  - Menggunakan deteksi user-agent client-side (`checkIsChromebook`) untuk mendeteksi `CrOS` / `Chrome OS`.
  - **Di Laptop Windows, Mac, dan HP (Non-Chromebook)**: Otomatis menggunakan dimensi original yang ramping dan rapi (`w-4 rounded-l-xl`), hanya menyembul 12px sehingga tidak memakan ruang layar dan tidak mengganggu pandangan.
  - **Khusus di Chromebook**: Menggunakan penyesuaian ergonomis (`w-7 -ml-3 rounded-l-2xl`) sehingga tonjolan fisik handle melebar ke kiri melampaui area *overlay scrollbar* ChromeOS (10–14px) agar selalu mudah diklik tanpa terhalang scrollbar halaman.
* **Interaksi Klik**: Membuka/menutup panel samping (`setIsOpen(!isOpen)`).
* **Indikator Titik**: Dua titik putih vertikal penanda grip sentuh.
* **Badge Notifikasi Handle**: Jika panel sedang tertutup (`!isOpen`) dan terdapat pesan chat belum dibaca (`unreadCount > 0`), muncul titik merah berdenyut (`animate-pulse`) di pojok kiri atas handle.

### B. Panel Utama Samping (Drawer Content)
* **Animasi Sliding**: Menggunakan transisi CSS halus `cubic-bezier(0.4, 0, 0.2, 1)`:
  - Terbuka: `translate-x-0 w-[85%] md:w-auto`
  - Tertutup: `translate-x-[calc(100%-12px)] w-auto` (hanya menyisakan 12px handle di tepi layar).
* **Latar Belakang**: `bg-slate-900 border-l border-y border-emerald-500/50 rounded-l-3xl backdrop-blur-xl`.
* **Indikator Live Pulse**: Lingkaran radar hijau berdenyut (`animate-ping`) di atas angka online.
* **Display Metrik**: Angka besar tebal (`text-4xl font-black text-emerald-400 tabular-nums`) dengan label `ONLINE`.
* **Tombol STATISTIK**:
  - Membuka modal detail user (`setShowDetail(true)`) dan menutup drawer samping (`setIsOpen(false)`).
* **Tombol LIVE CHAT**:
  - Mengaktifkan `setTriggerChat(true)` dan menutup drawer samping (`setIsOpen(false)`).
  - Dilengkapi ikon `MessageCircle` dan badge angka merah membal (`animate-bounce`) jika `unreadCount > 0`.
* **Tombol Tutup Mobile**: Tampil pada layar kecil (`md:hidden`) untuk memudahkan pengguna menutup drawer dengan sentuhan.
* **Overlay Gelap Mobile**: Saat panel terbuka pada smartphone, muncul backdrop hitam semi-transparan (`bg-black/40 backdrop-blur-sm z-[45] md:hidden`) yang menutup layar; mengklik backdrop langsung menutup drawer.

### C. Modal Detail Statistik User Online
* **Layering**: `z-[100]` dengan latar blur gelap (`bg-black/80 backdrop-blur-md`).
* **Card Container**: `max-w-sm rounded-[2rem] bg-slate-900 border border-emerald-500/30`.
* **Daftar User Scrollable**:
  - Avatar lingkaran inisial huruf pertama nama siswa (`u.nama?.charAt(0)`).
  - Teks nama tebal dengan label lokasi halaman (`📍 {u.posisi || 'Beranda'}`).
  - Badge kelas siswa di sisi kanan (`px-2 py-1 bg-slate-800 text-emerald-400 font-bold`).

---

## 6. Jembatan Integrasi dengan `LiveChat.jsx`

`FloatingOnline` merender komponen `LiveChat` secara langsung pada akhir JSX dan bertindak sebagai pengontrol eksternal:

```jsx
<LiveChat 
    student={user} 
    externalTrigger={triggerChat} 
    setExternalTrigger={setTriggerChat} 
    setUnreadExternal={setUnreadCount} 
/>
```

### Mekanisme Komunikasi Dua Arah:
1. **Parent-to-Child (Buka Chat)**:
   - Saat pengguna menekan tombol "LIVE CHAT" di panel `FloatingOnline`, state `triggerChat` diubah menjadi `true`.
   - `LiveChat` mendeteksi perubahan prop `externalTrigger` via `useEffect`, membuka jendela chat (`setIsOpen(true)`), dan memanggil `setExternalTrigger(false)` untuk mereset pemicu.
2. **Child-to-Parent (Sinkronisasi Unread Badge)**:
   - Ketika ada pesan baru masuk ke tabel `livechat` di Supabase dan jendela chat sedang tertutup (`!isOpen`), `LiveChat` memanggil fungsi `setUnreadExternal(nextCount)`.
   - `FloatingOnline` menerima nilai tersebut dan menyimpannya ke state `unreadCount`, sehingga angka notifikasi merah langsung muncul pada handle tab maupun tombol chat.
   - Saat pengguna membuka jendela chat, `LiveChat` otomatis mereset unread menjadi `0` dan menyinkronkannya kembali ke `FloatingOnline`.

---

## 7. Aturan Z-Index & Keamanan Tata Letak

1. **Backdrop Drawer Mobile**: `z-[45]`.
2. **Drawer Samping**: `z-50`.
3. **Modal Detail User**: `z-[100]`.
4. **Jendela LiveChat**: `z-[100]`.
5. **Emoji Picker di dalam Chat**: `z-[110]`.

*Catatan Penting*: Nilai z-index di atas telah diselaraskan dengan `Navbar` (`z-40` / `z-50`) dan modal materi/tugas Ruang Belajar (`z-[99999]`) agar tidak terjadi tabrakan tumpukan elemen antarmuka.

---

## 8. Panduan Verifikasi & Pengecekan Supabase Presence

Fitur Supabase Presence bekerja menggunakan protokol WebSocket *in-memory* di server Supabase Realtime (bukan menyimpan baris ke tabel PostgreSQL). Oleh karena itu, data kehadiran user tidak tersimpan di Table Editor database.

### Cara Memastikan Fitur Ini Bekerja Normal:

1. **Uji Coba Multi-Tab / Multi-Device (Paling Mudah)**:
   - Buka aplikasi di satu tab peramban biasa. Angka online akan menunjukkan `1`.
   - Buka tab kedua menggunakan mode **Incognito / Private Window** (atau buka dari HP lain).
   - Angka online di kedua jendela akan **otomatis bertambah menjadi `2`** dalam hitungan detik tanpa perlu refresh manual.
   - Klik tombol **STATISTIK** untuk melihat daftar nama, kelas, dan halaman posisi masing-masing perangkat secara langsung.
   - Jika salah satu tab ditutup, angka di tab lainnya otomatis berkurang kembali menjadi `1`.

2. **Cek Melalui Developer Console (F12)**:
   - Buka tab **Console** di DevTools peramban (tekan `F12` atau klik kanan -> `Inspect`).
   - Perhatikan pesan log berikut:
     - `📡 [Supabase Presence] Status Koneksi: SUBSCRIBED` (Menandakan WebSocket tersambung ke Supabase).
     - `📡 [Supabase Presence] Sync: X user online` (Menandakan state kehadiran berhasil disinkronkan).

3. **Cek Melalui Dashboard Supabase**:
   - Masuk ke dashboard proyek Supabase Anda.
   - Buka menu **Project Settings** -> **API** / **Realtime**.
   - Pastikan toggle **Realtime** berada pada status **Enabled (Aktif)**.
   - Di menu **Database** -> **Replication**, Realtime aktif secara global untuk mengizinkan broadcast WebSocket channel.


# Panduan Teknis & Arsitektur: LiveChat (`src/components/LiveChat.jsx`)

Dokumen ini mendokumentasikan secara rinci arsitektur, integrasi database Supabase, sistem kehadiran realtime, pengamanan moderasi kata, algoritma penguncian kelas, paginasi riwayat pesan, serta mekanisme *smart auto-scroll* pada komponen **`LiveChat`**.

---

## 1. Ikhtisar & Peran Komponen

Komponen `LiveChat` adalah widget obrolan langsung (*live communication chatbox*) siswa antar-kelas yang terhubung secara *real-time* ke database PostgreSQL Supabase. Widget ini memungkinkan:
1. Komunikasi antar-siswa dalam lingkungan belajar digital SMP Negeri 2 Singaraja.
2. Pengawasan dan kontrol ketertiban oleh guru/admin (fitur kunci obrolan per-kelas saat ujian/jam belajar serta pembersihan pesan).
3. Notifikasi visual dan audio instan saat ada pesan masuk baru.

---

## 2. Struktur Props & Kontrak Data

Komponen dideklarasikan dengan antarmuka:

```jsx
export default function LiveChat({ 
    student, 
    externalTrigger, 
    setExternalTrigger, 
    setUnreadExternal 
})
```

| Nama Prop | Tipe Data | Keterangan & Peran |
|---|---|---|
| `student` | `Object` | Data siswa aktif dari sesi login (`id`, `NAMA`, `Kelas`, `role`). Jika null/falsy, komponen tidak merender apapun (`return null`). |
| `externalTrigger` | `Boolean` | Pemicu eksternal dari `FloatingOnline` untuk membuka modal chat. |
| `setExternalTrigger` | `Function` | Callback untuk mengembalikan nilai `externalTrigger` menjadi `false` setelah jendela obrolan berhasil dibuka. |
| `setUnreadExternal` | `Function` | Callback untuk mengirimkan jumlah pesan belum dibaca (*unread count*) ke komponen induk `FloatingOnline`. |

---

## 3. Skema Database Supabase Terkait

Komponen berinteraksi secara aktif dengan 2 (dua) tabel di Supabase:

### A. Tabel `livechat` (Penyimpanan Obrolan)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `uuid` (PK) | Identifier unik pesan. |
| `full_name` | `text` | Nama lengkap pengirim (`student.NAMA`). |
| `kelas` | `text` | Kelas siswa pengirim (`student.Kelas`). |
| `role` | `text` | Peran pengirim: `'siswa'`, `'guru'`, atau `'admin'`. |
| `pesan` | `text` | Konten pesan teks yang telah disensor dari kata kasar. |
| `student_id` | `text` | ID unik akun siswa pengirim. |
| `created_at` | `timestamptz` | Waktu pengiriman pesan (default: `now()`). |

### B. Tabel `game_controls` (Kontrol Kunci Chat Per-Kelas)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `bigint` / `uuid` | Primary Key. |
| `game_id` | `text` | Diisi konstan `'livechat_control'` untuk fitur chat. |
| `class_name` | `text` | Nama kelas yang dikontrol (misal: `'7.1'`, `'7.2'`, `'Tanpa Kelas'`). |
| `is_locked` | `boolean` | `true` jika chat kelas tersebut sedang dikunci oleh guru/admin; `false` jika aktif. |

---

## 4. Alur Kerja Realtime & Siklus Hidup Event

Komponen menginisialisasi channel WebSocket Supabase pada `useEffect`:

```text
[useEffect Koneksi Realtime]
   - Channel ID: `livechat_system_[random]`
   - Listen 1: postgres_changes event 'INSERT' table 'livechat'
   - Listen 2: postgres_changes event 'DELETE' table 'livechat'
   - Listen 3: postgres_changes event '*' table 'game_controls' filter 'game_id=eq.livechat_control'
```

```text
Alur Pesan Masuk (INSERT):
              │
              ▼ Event INSERT dari Supabase
      [Cek Duplikasi Pesan]
       (m.id === payload.new.id)
              │
              ├──► Jika Ada: Abaikan (hindari duplikasi)
              ▼
     [Append ke State `messages`]
              │
              ▼
     [Audio Sound Effect SFX]
     Mixkit audio: `2358-preview.mp3`
              │
              ▼
      [Cek State Jendela `isOpen`]
              │
              ├─► Jika Terbuka (`isOpen === true`):
              │     Pesan langsung dibaca, unread count tidak bertambah.
              │
              └─► Jika Tertutup (`isOpen === false`):
                    1. unreadCount internal bertambah (+1).
                    2. Mengirim count ke `FloatingOnline` via `setUnreadExternal`:
                       `setTimeout(() => setUnreadExternal(nextCount), 0)`
                       *Catatan*: Menggunakan setTimeout 0 untuk mencegah peringatan
                       React "Cannot update a component while rendering another".
```

```text
Alur Pembersihan Pesan (DELETE):
- Event `DELETE` pada tabel `livechat` langsung mengosongkan state: `setMessages([])`.
```

```text
Alur Kontrol Kunci Kelas (GAME_CONTROLS):
- Setiap ada perubahan status kunci pada tabel `game_controls`, listener memanggil fungsi `fetchLockStatuses()` untuk memperbarui map status dan nilai `isLocked`.
```

---

## 5. Fitur Moderasi, Keamanan & Hak Akses

### A. Sensor Kata Kasar Otomatis (`filterBadWords`)
* Mengimpor utilitas `filterBadWords` dari `src/utils/bannedWordsPool.js`.
* Sebelum pesan dikirim ke database melalui `.insert()`, teks diproses terlebih dahulu untuk menyaring dan menyensor kosakata terlarang.

### B. Penguncian Obrolan Berbasis Kelas (Class-Level Lock)
* **Daftar Kelas**: `["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"]`.
* **Kondisi Terkunci untuk Siswa**:
  - Jika kelas siswa memiliki status `is_locked === true` pada `game_controls` dan siswa tersebut bukan admin (`student.role !== 'admin'`), widget obrolan dinonaktifkan.
  - Tampilan digantikan oleh tombol terkunci abu-abu (`opacity-50 grayscale`) dengan ikon `MessageSquareOff`.
  - Siswa yang terkunci tidak dapat membaca pesan maupun mengirimkan teks baru.
* **Panel Kontrol Admin**:
  - Hanya muncul jika `student.role === 'admin'`.
  - Admin dapat memilih kelas dari dropdown dan menekan tombol gembok untuk toggle status kunci (`Lock` / `Unlock`) yang disimpan menggunakan operasi `.upsert()` pada `game_controls`.

### C. Hapus Seluruh Riwayat Chat (Admin Only)
* Ikon tempat sampah (`Trash2`) di header hanya muncul untuk admin.
* Melakukan konfirmasi `window.confirm` dan mengeksekusi `.delete().neq('id', '00000000-0000-0000-0000-000000000000')` pada tabel `livechat`.

---

## 6. Logika Tampilan & Antarmuka Pesan

### A. Algoritma Pewarnaan Nama & Inisial Nama Tengah
1. **Nama Tengah (`getMiddleName`)**:
   - Jika nama siswa terdiri dari lebih dari 1 kata, sistem mengambil kata kedua sebagai nama panggilan di chat agar tidak memakan ruang bubble (`parts[1]`).
2. **Pewarnaan Konsisten Berbasis Hash (`getNameColor`)**:
   - Menggunakan algoritma hash string deterministik:
     ```javascript
     let hash = 0;
     for (let i = 0; i < name.length; i++) {
         hash = name.charCodeAt(i) + ((hash << 5) - hash);
     }
     return colors[Math.abs(hash) % colors.length];
     ```
   - Palet warna: `text-emerald-400`, `text-orange-400`, `text-pink-400`, `text-amber-400`, `text-cyan-400`, `text-lime-400`, `text-violet-400`, `text-fuchsia-400`.
   - Menghasilkan warna yang sama secara konsisten untuk nama siswa yang sama tanpa perlu menyimpan status warna ke database.

### B. Pembedaan Gaya Bubble Pesan
* **Pesan Sendiri (`isMe`)**:
  - Posisi rata kanan (`items-end`).
  - Bubble biru (`bg-blue-600 text-white rounded-2xl rounded-tr-none`).
* **Pesan Orang Lain**:
  - Posisi rata kiri (`items-start`).
  - Bubble abu-abu (`bg-slate-700 text-slate-100 rounded-2xl rounded-tl-none`).
  - Menampilkan nama panggilan dan kelas: `{getMiddleName(msg.full_name)} • {msg.kelas}`.
* **Pesan Admin / Guru**:
  - Menggunakan aksen gradien mewah (`bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600`).
* **Pesan Beruntun (Consecutive Messages)**:
  - Jika pesan dikirimkan oleh orang yang sama berturut-turut (`isSameSender`), nama pengirim disembunyikan dan jarak antar-bubble dirapatkan (`mt-0.5`).

### C. Pembatas Tanggal Menempel (Sticky Date Dividers)
* Membandingkan tanggal `created_at` pesan dengan pesan sebelumnya menggunakan `.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })`.
* Jika berbeda hari, muncul badge tanggal menempel (*sticky header*) di tengah kolom chat.

---

## 7. Paginasi & Smart Auto-Scroll

### A. Paginasi Riwayat Pesan (Load More)
* Awalnya memuat 10 pesan terakhir (`limit = 10`) dengan urutan `created_at` descending, lalu dibalik (`reverse()`).
* Tombol **"Lihat chat lebih lama..."** menambah limit `+10`.
* Pesan lama digabungkan ke urutan atas tanpa menduplikasi data (`existingIds.has(m.id)`).

### B. Smart Scroll Logic (`useLayoutEffect`)
* Menggunakan `useLayoutEffect` dan `useRef` (`scrollRef`, `lastScrollHeight`, `lastMessageCount`):
  ```javascript
  // Jika pesan bertambah banyak (artinya pengguna menekan "Lihat chat lebih lama..."):
  if (messages.length > lastMessageCount.current + 1 && lastMessageCount.current !== 0) {
      const heightDifference = container.scrollHeight - lastScrollHeight.current;
      container.scrollTop = heightDifference + 1; // Mempertahankan posisi baca pengguna
  } else {
      // Jika pesan baru masuk atau jendela baru dibuka:
      container.scrollTop = container.scrollHeight; // Auto-scroll ke pesan terbawah
  }
  ```
* Mencegah layar "melompat" ke bawah saat siswa sedang menelusuri riwayat pesan lama di bagian atas.

---

## 8. Integrasi Emoji Picker

* Menggunakan pustaka `emoji-picker-react` dengan tema gelap (`theme="dark"`).
* Posisi picker melayang di atas formulir input (`absolute bottom-full right-0 mb-2 z-[110]`).
* Mengetuk kolom input teks otomatis menutup emoji picker (`onFocus={() => setShowEmoji(false)}`).

---

## 9. Penanganan Tautan (Link) & Kartu Preview Ala WhatsApp

### A. Deteksi & Penguraian Tautan Teks (`renderMessageText`)
* Teks pesan diuraikan menggunakan ekspresi reguler `/(?:https?:\/\/|www\.)[^\s<>"']+/gi`.
* Tanda baca di akhir tautan (seperti titik, koma, tanda kurung) otomatis dibersihkan (`cleanUrl`) sehingga tidak merusak target URL. Tautan dengan awalan `www.` dinormalisasi menjadi protokol aman `https://`.
* Tautan dirender menggunakan elemen `<a>` dengan atribut keamanan `target="_blank"` dan `rel="noopener noreferrer"`.
* **Solusi Anti-Tembus Jendela (Anti-Overflow)**:
  - Sebelum perbaikan, flex item tanpa `min-w-0` membuat string URL panjang (misal >80 karakter tanpa spasi) mempertahankan lebar *min-content*, sehingga menembus batas jendela obrolan (350px).
  - Diperbaiki dengan menetapkan `min-w-0`, `max-w-full`, `overflow-x-hidden`, serta utilitas `break-all [overflow-wrap:anywhere]` pada pembungkus teks dan tag `<a>`. Hal ini menjamin tautan panjang terputus rapi di dalam batas bubble dan tidak pernah merusak layout jendela chat.

### B. Komponen Kartu Preview Link (`src/components/LiveChat/LinkPreviewCard.jsx`)
* Jika pesan mengandung tautan, tautan pertama diambil via `extractFirstUrl(msg.pesan)` untuk menampilkan kartu preview interaktif di bawah teks bubble, menyerupai kartu tautan WhatsApp.
* **Deteksi Instan Sisi Klien**:
  - **YouTube**: Menangkap ID video (`v=...`, `youtu.be/...`, atau `/shorts/...`) dan langsung menyediakan thumbnail `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` dan judul "Video YouTube".
  - **Scratch**: Mendeteksi ID proyek dan memuat thumbnail poster Scratch `https://cdn2.scratch.mit.edu/get_image/project/${projectId}_480x360.png`.
  - **Google Workspace**: Mengenali tautan Google Drive, Google Formulir, Google Dokumen, Google Spreadsheet, dan Google Slides.
* **Server-Side OpenGraph Scraper (`/api/link-preview` di `server.ts`)**:
  - Endpoint server mengambil metadata OpenGraph (`og:title`, `og:description`, `og:image`, `og:site_name`, dan tag `<title>`).
  - Dilengkapi proteksi keamanan SSRF (menolak host lokal/private) dan timeout 4 detik.
  - Hasil fetch disimpan di memori klien (`previewCache`) untuk mencegah request berulang saat menelusuri chat.
* **Gaya Visual Kartu**:
  - Banner gambar responsif (rasio 16:9 / aspect cover) dengan proteksi fallback jika gambar gagal dimuat.
  - Favicon domain resmi via Google S2 Favicon API (`https://www.google.com/s2/favicons?domain=...`).
  - Judul tebal maksimal 2 baris (`line-clamp-2`), deskripsi ringkas, nama domain, dan ikon eksternal tautan (`ExternalLink`).

---

## 10. Aturan Pemeliharaan (*Maintenance Rules*)

1. **Anti-Race Condition pada State Update**:
   - Selalu pertahankan pola `setTimeout(..., 0)` saat memanggil `setUnreadExternal` dari dalam listener Supabase agar tidak menimbulkan error React *setState during existing render cycle*.
2. **Pembersihan Channel WebSocket**:
   - Wajib memanggil `supabase.removeChannel(channel)` di fungsi pembersih `useEffect`.
3. **Z-Index Konsisten**:
   - Jendela LiveChat berada di `z-[100]` dan Emoji Picker di `z-[110]` agar tidak tertutup oleh modal lain.
4. **Anti-Tembus & Batas Responsif**:
   - Jendela chat memiliki batas `max-w-[calc(100vw-24px)]` dan `max-h-[calc(100vh-120px)]`.
   - Seluruh kontainer flex pembungkus pesan wajib menyertakan `min-w-0` dan `break-all [overflow-wrap:anywhere]` agar konten dinamis seperti tautan tidak pernah melebihi lebar bubble.
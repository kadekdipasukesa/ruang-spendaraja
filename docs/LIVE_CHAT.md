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
    setUnreadExternal,
    onlineCount = 0
})
```

| Nama Prop | Tipe Data | Keterangan & Peran |
|---|---|---|
| `student` | `Object` | Data siswa aktif dari sesi login (`id`, `NAMA`, `Kelas`, `role`). Jika null/falsy, komponen tidak merender apapun (`return null`). |
| `externalTrigger` | `Boolean` | Pemicu eksternal dari `FloatingOnline` untuk membuka modal chat. |
| `setExternalTrigger` | `Function` | Callback untuk mengembalikan nilai `externalTrigger` menjadi `false` setelah jendela obrolan berhasil dibuka. |
| `setUnreadExternal` | `Function` | Callback untuk mengirimkan jumlah pesan belum dibaca (*unread count*) ke komponen induk `FloatingOnline`. |
| `onlineCount` | `Number` | Jumlah total pengguna yang sedang aktif/online dari Supabase Presence `FloatingOnline`. |

---

## 3. Skema Database Supabase Terkait

Komponen berinteraksi secara aktif dengan 2 (dua) tabel di Supabase:

### A. Tabel `livechat` (Penyimpanan Obrolan Ternormalisasi)
Tabel `livechat` telah disederhanakan dan dinormalisasi sehingga tidak lagi menyimpan redundansi `full_name` dan `kelas`, melainkan menautkan langsung akun pengirim melalui `sender_id` ke `master_siswa`:

```sql
create table public.livechat (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  sender_id text not null,
  pesan text not null,
  target_type text not null default 'group'::text,
  target_id text not null,
  is_read boolean not null default false,
  constraint livechat_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_livechat_target on public.livechat using btree (target_type, target_id, created_at desc) TABLESPACE pg_default;
create index IF not exists idx_livechat_sender on public.livechat using btree (sender_id) TABLESPACE pg_default;
```

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `uuid` (PK) | Identifier unik pesan obrolan. |
| `created_at` | `timestamptz` | Waktu pengiriman pesan (default: `now()`). |
| `sender_id` | `text` | ID unik akun siswa/guru/admin dari `master_siswa.id` (Single Source of Truth identitas). |
| `pesan` | `text` | Konten pesan teks yang telah disaring dari kata kasar (*sensor moderation*). |
| `target_type` | `text` | Tipe target obrolan: `'group'` (grup kelas/ruang) atau `'personal'` (pesan langsung / DM masa depan). |
| `target_id` | `text` | Alamat tujuan: `'group_siswa'` (ruang siswa), `'group_guru'` (ruang guru), atau ID pengguna jika DM. |
| `is_read` | `boolean` | Status keterbacaan pesan (default: `false`). |

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

### C. Hapus Riwayat Chat & Pesan Tunggal (Admin Only)
* **Hapus Semua Riwayat Obrolan per Kamar**:
  - Ikon tempat sampah (`Trash2`) di header hanya muncul untuk admin (`isUserAdmin = true`).
  - Menampilkan modal dialog konfirmasi in-app elegan (bebas dari pemblokiran dialog `window.confirm` di lingkungan browser/iframe).
  - Mengeksekusi `.delete().eq('target_id', targetRoomId)` pada tabel `livechat` (di mana `targetRoomId` bernilai `'group_siswa'` atau `'group_guru'`).
  - State lokal langsung menyaring pesan di kamar tersebut, dan Supabase realtime menyiarkan event DELETE ke seluruh klien.
* **Hapus Pesan Tunggal (Per-Item)**:
  - Khusus akun admin, setiap item pesan di `ChatMessageItem.jsx` dilengkapi tombol hapus (`Trash2` kecil) di sisi bubble pesan.
  - Menampilkan modal dialog konfirmasi in-app elegan.
  - Mengeksekusi `.delete().eq('id', messageId)` pada tabel `livechat`.
  - Menghapus pesan tersebut seketika dari layar pengirim dan secara realtime di seluruh layar pengguna lain.

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

## 8. Integrasi Emoji Picker & Format Nama Pengirim

* **Emoji Picker**:
  - Menggunakan pustaka `emoji-picker-react` dengan tema gelap (`theme="dark"`).
  - Posisi picker melayang di atas formulir input (`absolute bottom-full right-0 mb-2 z-[110]`).
  - Mengetuk kolom input teks otomatis menutup emoji picker (`onFocus={() => setShowEmoji(false)}`).

* **Format Nama Pengirim 2 Kata (`getShortName`)**:
  - Menampilkan 2 kata nama (nama tengah dan belakang) yang diformat otomatis ke Title Case (misal: `"KADEK DIPA SUKESA"` atau `"kadek dipa sukesa"` menjadi `"Dipa Sukesa"`).
  - Teks nama pengirim di bubble chat menggunakan bobot normal (`font-normal`) tanpa penebalan (*non-bold*) dan tanpa transformasi kapital paksa (`uppercase` dihilangkan) agar tampilan lebih bersih, nyaman dibaca, dan proporsional.
  - Jika nama terdiri dari 1 atau 2 kata, nama tetap ditampilkan utuh. Jika terdiri dari 3 kata atau lebih (umum pada nama dengan urutan kelahiran Bali seperti *Putu*, *Kadek*, *Komang*, *Ketut*, *I*, *Ni*), sistem secara otomatis mengambil 2 kata terakhir (`parts.slice(-2).join(' ')`) agar ringkas namun tetap jelas mengenali siswa.

---

## 9. Penanganan Tautan (Link) & Kartu Preview Ala WhatsApp

### A. Deteksi & Penguraian Tautan Teks (`renderMessageText`)
* Teks pesan diuraikan menggunakan ekspresi reguler `/(?:https?:\/\/|www\.)[^\s<>"']+/gi`.
* Tanda baca di akhir tautan (seperti titik, koma, tanda kurung) otomatis dibersihkan (`cleanUrl`) sehingga tidak merusak target URL. Tautan dengan awalan `www.` dinormalisasi menjadi protokol aman `https://`.
* Tautan dirender menggunakan elemen `<a>` dengan atribut keamanan `target="_blank"` dan `rel="noopener noreferrer"`.
* **Solusi Anti-Tembus Jendela (Anti-Overflow)**:
  - Sebelum perbaikan, flex item tanpa `min-w-0` membuat string URL panjang (misal >80 karakter tanpa spasi) mempertahankan lebar *min-content*, sehingga menembus batas jendela obrolan (350px).
  - Diperbaiki dengan menetapkan `min-w-0`, `max-w-full`, `overflow-x-hidden`, serta utilitas `break-all [overflow-wrap:anywhere]` pada pembungkus teks dan tag `<a>`. Hal ini menjamin tautan panjang terputus rapi di dalam batas bubble dan tidak pernah merusak layout jendela chat.

### B. Komponen Kartu Preview Link Modular (`src/components/LiveChat/`)
Komponen pratinjau tautan dipecah menjadi tiga sub-modul terstruktur untuk menjaga kebersihan dan modularitas kode:
1. **`linkPreviewUtils.jsx`**:
   - Berisi fungsi utilitas deteksi tautan (`URL_REGEX`, `cleanUrl`, `extractFirstUrl`).
   - Ekstraksi platform instan (`getYouTubeVideoId`, `getYouTubeThumbnail`, `getInstagramInfo`, `getTikTokInfo`, `getWebpageThumbnail`, `isDirectImageUrl`, `getInstantPlatformPreview`).
   - Perender teks tautan anti-tembus jendela (`renderMessageText`).
2. **`VideoPlayerEmbed.jsx`**:
   - Pemutar video inline terpadu untuk YouTube, TikTok, Instagram, dan Scratch.
   - Dilengkapi tombol **Layar Penuh (Fullscreen / Maximize)** dan **Kecilkan (Minimize)** menggunakan Fullscreen API browser (`requestFullscreen()` & `exitFullscreen()`), mempermudah pengguna di perangkat desktop maupun mobile untuk menonton video dalam tampilan satu layar penuh tanpa terbatasi oleh ukuran jendela chat yang kecil.
   - Memastikan atribut iframe menyertakan permission policy `fullscreen` lengkap (`allow="... fullscreen"`) dan `allowFullScreen`.
   - Dilengkapi tombol Tutup (X) melayang dengan kontras tinggi di pojok kanan atas yang otomatis keluar dari mode fullscreen sebelum menutup player.
   - Iframe player responsif dengan aspect-ratio yang sesuai (16:9 untuk YouTube, 9:16 untuk TikTok/Instagram Reels).
3. **`LinkPreviewCard.jsx`**:
   - Komponen visual kartu preview ala WhatsApp dengan thumbnail, badge kategori (TikTok, Instagram, Video, Gambar, Scratch, Web), dan teks metadata yang dapat diklik.
   - **Fitur Pemutar Video Eksklusif (Exclusive Video Playback)**:
     - Setiap kartu memiliki ID unik berbasis `useId()`.
     - Saat pengguna memutar salah satu video di chat, kartu memancarkan event browser `livechat-active-video-play` dengan ID kartu tersebut.
     - Seluruh kartu `LinkPreviewCard` lain di dalam obrolan yang sedang memutar video otomatis mendengarkan event ini dan menutup pemutarnya (`setIsPlaying(false)`). Hal ini menjamin **tidak ada dua video yang berbunyi atau berputar bersamaan**.

* **Deteksi Instan Sisi Klien**:
  - **YouTube**: Menangkap ID video dari berbagai format URL (`v=...`, `youtu.be/...`, `/shorts/...`, `/embed/...`, `/live/...`, dan parameter campuran seperti playlist/radio mix), membersihkan entitas URL (`&amp;` -> `&`), menggunakan domain aman `https://www.youtube-nocookie.com/embed/...` untuk pemutaran video tanpa terhalang isolasi iframe, serta menyediakan tombol aksi cepat `Buka` untuk menonton langsung di YouTube.
  - **TikTok**: Mengenali URL `tiktok.com` maupun shortlink `vt.tiktok.com` / `vm.tiktok.com`.
  - **Instagram**: Mengenali URL Reel (`/reel/`), Postingan (`/p/`), dan TV (`/tv/`).
  - **Scratch**: Mendeteksi ID proyek dan memuat thumbnail poster Scratch `https://cdn2.scratch.mit.edu/get_image/project/${projectId}_480x360.png`.
  - **Google Workspace**: Mengenali tautan Google Drive, Google Formulir, Google Dokumen, Google Spreadsheet, dan Google Slides.

* **Server-Side Metadata Scraper (`/api/link-preview` di `server.ts`)**:
  - **TikTok**: Menggunakan endpoint resmi publik `https://www.tiktok.com/oembed?url=...` untuk mengekstrak judul video/caption, nama kreator, username (`@...`), thumbnail cover jernih dari CDN TikTok, dan ID video untuk pemutaran inline tanpa login.
  - **Instagram**: Mengakses endpoint publik `https://www.instagram.com/p/${shortcode}/embed/captioned/` menggunakan client identity aman untuk mengekstrak username kreator (`@username`), foto cover reel dari CDN Instagram, deskripsi, dan tipe konten (Reel/Postingan) tanpa terhalang dinding login Instagram.
  - **YouTube**: Menggunakan YouTube oEmbed API resmi.
  - **Website Umum**: Mengambil metadata OpenGraph (`og:title`, `og:description`, `og:image`, `og:site_name`, dan tag `<title>`) dengan fallback screenshot halaman web via WordPress mShots.
  - Dilengkapi proteksi keamanan SSRF (menolak host lokal/private) dan timeout 4 detik.
  - Hasil fetch disimpan di memori klien (`previewCache`) untuk mencegah request berulang saat menelusuri chat.

* **Gaya Visual Kartu**:
  - Banner gambar responsif (rasio 16:9 / aspect cover) dengan tombol Play interaktif (merah untuk YouTube, gelap/cyan untuk TikTok, gradasi sunset untuk Instagram).
  - Badge kategori dinamis di sudut kanan bawah (TikTok, Instagram, Video, Gambar, Scratch, Halaman Web).
  - Favicon domain resmi via Google S2 Favicon API (`https://www.google.com/s2/favicons?domain=...`).
  - Judul tebal maksimal 2 baris (`line-clamp-2`), deskripsi ringkas, nama domain, dan ikon eksternal tautan (`ExternalLink`).

---

## 10. Arsitektur Pemisahan Ruang (Ruang Siswa vs. Ruang Guru) & Proteksi Anti-Salah Kamar

Fitur LiveChat memisahkan alur komunikasi menjadi dua kamar yang terisolasi secara logis:

### A. Hak Akses & Keterisolasian Ruang
1. **Siswa & OSIS (`role: 'siswa'` / `'osis'`)**:
   - Terkunci permanen di **👥 Ruang Siswa**.
   - Tidak memiliki tombol pengalih kamar dan **sama sekali tidak dapat melihat obrolan dewan guru**.
   - Notifikasi suara dan unread counter hanya aktif untuk pesan yang dikirim ke Ruang Siswa.
2. **Guru (`role: 'guru'`)**:
   - Terkunci permanen di **👨‍🏫 Ruang Guru**.
   - Bebas dari kebisingan obrolan siswa. Obrolan bersifat privat untuk dewan guru.
   - Tidak terpengaruh oleh fitur penguncian kelas (`game_controls`) yang ditujukan untuk jam pelajaran siswa.
3. **Admin (`role: 'admin'`)**:
   - Memiliki tab switcher di header: `[ 👥 Ruang Siswa ]` dan `[ 👨‍🏫 Ruang Guru ]`.
   - Dapat berpindah kamar kapan saja untuk memonitor kedua kelompok.
   - Memiliki kendali hapus riwayat per-kamar (`handleDeleteAllInRoom`).

### B. Tampilan Kompak & Proteksi Anti-Salah Kamar untuk Admin
1. **Desain Kompak Maksimal**:
   - Menghilangkan badge label tebal ("Ruang Khusus Dewan Guru" dan "Ruang Obrolan Siswa") serta banner target yang memakan tinggi jendela, sehingga area scrolling chat tetap luas dan lega baik untuk Admin maupun Siswa/Guru.
   - Status ruang aktif cukup diwakili oleh teks sub-judul di bawah judul Live Chat ("Diskusi Guru" / "Obrolan Siswa").
2. **Penyesuaian Warna UI & Placeholder**:
   - Ruang Siswa: Placeholder *"Tulis pesan untuk siswa..."*, tombol kirim Biru, border fokus Biru.
   - Ruang Guru: Placeholder *"Tulis pesan untuk guru..."*, tombol kirim Amber, border fokus Amber.
3. **Format Label Pengirim Admin / Dev (`getSenderRoleOrClass`)**:
   - Jika data pesan memiliki `role: 'admin'` atau nilai kolom `kelas` adalah `'Ruang Guru'` maupun `'Ruang Siswa'`, sistem secara otomatis menampilkan label **`Admin`** (misal: `"Dipa Sukesa • Admin"`), bukan menampilkan teks mentah "Ruang Guru" atau "Ruang Siswa".
4. **Isolasi 100% Mutlak Ruang Guru (`effectiveRoom`)**:
   - Akun dengan role guru secara terprogram dikunci ke ruang `'guru'` (`effectiveRoom = isUserGuru ? 'guru' : ...`), sehingga obrolan siswa sama sekali tidak dapat masuk atau tertampil di layar guru dalam kondisi apapun.
5. **Payload Database Presisi**:
   - Pesan yang dikirim Admin saat membuka Ruang Guru otomatis ditandai `kelas: 'Ruang Guru'` dan `role: 'admin'`.
   - Pesan yang dikirim Admin saat membuka Ruang Siswa otomatis ditandai `kelas: 'Ruang Siswa'` dan `role: 'admin'`.
   - Hal ini menjamin pesan Admin tidak pernah bocor atau salah tampil di kamar yang tidak dimaksudkan.

---

## 11. Struktur Modular Sub-Komponen (`src/components/LiveChat/`)

Untuk menjaga keterbacaan kode (*clean code*), kemudahan pemeliharaan, serta performa rendering, `LiveChat` dipecah menjadi modul-modul terfokus:

1. **`src/components/LiveChat.jsx` (Orchestrator)**:
   - Mengelola state global chat (`messages`, `senderMap`, `unreadCount`, `limit`, `activeRoom`, `isLocked`).
   - Berlangganan ke Supabase Realtime (`livechat` dan `game_controls`).
   - Menangani sinkronisasi profil pengirim via kueri dinamis `master_siswa`.
   - Mengelola logika auto-scroll dan load more riwayat obrolan.
2. **`src/components/LiveChat/ChatHeader.jsx`**:
   - Menampilkan judul "Live Chat", indikator pulse hijau, ikon `Users` beserta jumlah total pengguna online (`onlineCount`) tanpa label tambahan, tombol hapus riwayat per-kamar (khusus admin), dan tombol tutup.
   - Menyediakan tombol tab switcher kamar (`Ruang Siswa` vs `Ruang Guru`) dan kontrol kunci chat kelas untuk Admin.
3. **`src/components/LiveChat/ChatMessageItem.jsx`**:
   - Merender setiap baris bubble pesan dengan format nama Title Case 2 kata (`Dipa Sukesa`), role badge (`Admin`, `Guru`, atau kelas seperti `7.1`), ikon verifikasi (`ShieldCheck` / `GraduationCap`), teks aman sensor, jam kirim, serta kartu preview link/video.
4. **`src/components/LiveChat/ChatInputForm.jsx`**:
   - Area input pesan, toggle emoji picker (`emoji-picker-react`), tombol kirim, dan tampilan banner proteksi saat chat kelas dikunci.
5. **`src/components/LiveChat/chatHelpers.js`**:
   - Fungsi pembantu: `getShortName`, `getNameColor`, `isMessageInRoom`, `getSenderRoleOrClass`, dan daftar kelas `CLASSES`.
6. **`src/components/LiveChat/LinkPreviewCard.jsx`**:
   - Modul kartu preview tautan dan inline media embed (YouTube, TikTok, Instagram, Twitter, Spotify).

---

## 12. Aturan Pemeliharaan (*Maintenance Rules*)

1. **Anti-Race Condition pada State Update**:
   - Selalu pertahankan pola `setTimeout(..., 0)` saat memanggil `setUnreadExternal` dari dalam listener Supabase agar tidak menimbulkan error React *setState during existing render cycle*.
2. **Pembersihan Channel WebSocket**:
   - Wajib memanggil `supabase.removeChannel(channel)` di fungsi pembersih `useEffect`.
3. **Z-Index Konsisten**:
   - Jendela LiveChat berada di `z-[100]` dan Emoji Picker di `z-[110]` agar tidak tertutup oleh modal lain.
4. **Anti-Tembus & Batas Responsif**:
   - Jendela chat memiliki batas `max-w-[calc(100vw-24px)]` dan `max-h-[calc(100vh-120px)]`.
   - Seluruh kontainer flex pembungkus pesan wajib menyertakan `min-w-0` dan `break-all [overflow-wrap:anywhere]` agar konten dinamis seperti tautan tidak pernah melebihi lebar bubble.
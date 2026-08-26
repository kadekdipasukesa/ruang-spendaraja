# Panduan Sistem Desain & Antarmuka - Ruang Spendaraja

Dokumen ini adalah referensi visual dan panduan styling resmi untuk seluruh aplikasi Ruang Spendaraja.

Karena aplikasi memiliki beberapa jenis halaman dengan kebutuhan pengguna yang berbeda (siswa, guru, praktikum, dan event), sistem desain dibagi ke dalam **4 Arketipe Gaya (Archetype Palette)** dengan **Aturan Komponen Bersama (Shared Core Rules)**.

---

## 1. Empat Arketipe Gaya Halaman

### Arketipe 1: Pembelajaran & Siswa (Amber/Warm Glow)
* **Halaman Contoh**: `/ruang-belajar`, `/bee-2026`
* **Target Pengguna**: Siswa SMP (Interaktif, Ceria, Modern, Berorientasi Poin)
* **Palet Warna Utama**:
  - Background: `bg-slate-950` / `bg-slate-900` dengan gradient subtle
  - Aksen Utama: `amber-500`, `orange-500`, `yellow-400`
  - Kontainer/Card: `bg-slate-900/80 backdrop-blur-md border border-amber-500/20`
  - Teks: `text-white` (Heading) dan `text-slate-300` (Body)
* **Ciri Khas UI**:
  - Header profil siswa beraksen emas/amber.
  - Fixed Bottom Navigation Bar terpisah di bagian bawah layar.
  - Badge poin medali (🥇 Emas, 🥈 Perak, 🥉 Perunggu).

---

### Arketipe 2: Modul Praktik & Simulasi (OS/Dark Precision)
* **Halaman Contoh**: `/tugas/simulasi-folder`, `/typing-challenge`, `/tugas/kuis-algoritma`
* **Target Pengguna**: Siswa saat praktikum mandiri (Fokus, Presisi, GUI Explorer)
* **Palet Warna Utama**:
  - Background: `bg-slate-900` / `bg-slate-950`
  - Aksen Direktori: `indigo-500`, `blue-500`, `amber-400` (Folder), `emerald-400` (Sukses)
  - Kontainer Toolbar: `bg-slate-800/90 border border-slate-700/80`
  - Panel Melayang: `bg-slate-900/95 border-2 border-amber-500/50 shadow-2xl`
* **Ciri Khas UI**:
  - Breadcrumb path navigable (`C: > TUGAS_INFORMATIKA_7 > ...`).
  - Item folder/file dengan icon spesifik (.docx, .sb3, .zip, dll.).
  - Floating mission panel dengan highlight target lokasi teks kuning tebal.

---

### Arketipe 3: Portal Utama & App Launcher (Tech Glow & Ecosystem)
* **Halaman Contoh**: `/` (`Home.jsx`)
* **Target Pengguna**: Semua Civitas Akademika & Pengunjung
* **Palet Warna Utama**:
  - Background: `bg-slate-950` dengan grid pattern & ambient radial gradient
  - Aksen Launcher: `indigo-500`, `purple-500`, `cyan-400`, `amber-400`
  - Kartu Pintasan: `bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40`
* **Ciri Khas UI**:
  - Hero banner sambutan terpersonalisasi.
  - Kartu aplikasi dengan efek neon hover glow & status lock/unlock permission.
  - Floating online indicator di sisi kanan.

---

### Arketipe 4: Panel Guru & Administrasi (Clean Light/Slate Clarity)
* **Halaman Contoh**: `/jurnal-lab`, `/agenda-guru`, `/pelanggaran`, `/admin-ujian`, `/admin/kelola-siswa`
* **Target Pengguna**: Guru, Wali Kelas, Guru BK, & Administrator
* **Palet Warna Utama**:
  - Background: `bg-slate-50` / `bg-white` (Light) atau `bg-slate-900` (Dark Mode opsional)
  - Aksen Data: `blue-600`, `indigo-600`, `emerald-600`, `rose-600` (Pelanggaran)
  - Card & Tabel: `bg-white border border-slate-200 shadow-sm rounded-2xl`
  - Teks: `text-slate-800` (Judul) dan `text-slate-600` (Isi Tabel)
* **Ciri Khas UI**:
  - Tabel data bergaris rapi dengan filter kelas/tanggal.
  - Tombol aksi export/print dan formulir input cepat.
  - Badge status ringkas (*Hadir*, *Selesai*, *Verifikasi*).

---

## 2. Aturan Komponen Bersama (Shared Core Rules)

Seluruh halaman dan arketipe **wajib mematuhi standar berikut**:

### A. Mobile-Friendly & Touch Targets
* **Minimal 44px**: Seluruh tombol interaktif, icon aksi, dan tab switcher wajib memiliki area sentuh minimal `h-11` (44px) atau `p-2.5` pada perangkat layar sentuh.
* **No Text Truncation / Broken Pills**: Teks di dalam pill, tab, atau badge tidak boleh terpotong atau terputus barisnya (selalu gunakan `whitespace-nowrap`).

### B. Hierarki Radius & Border
* **Kartu Kontainer Utama**: `rounded-2xl` (16px) atau `rounded-3xl` (24px).
* **Inner Container / Sub-card**: `rounded-xl` (12px) atau `rounded-lg` (8px).
* **Tombol & Filter Tabs**: `rounded-xl` atau `rounded-full` (Pill button).
* **Border Consistency**: Jangan gunakan border tebal jika radius sangat bulat; gunakan border halus semi-transparan (`border border-white/10` atau `border-slate-700/60`).

### C. Z-Index Layering
* `z-10` sampai `z-30`: Konten halaman, fixed cards, sticky headers lokal.
* `z-40`: Navigation Bar atas (`Navbar.jsx`).
* `z-[45]`: Floating Presence & Notification Drawer (`FloatingOnline.jsx`).
* `z-50`: Fixed Bottom Nav Portal (`RuangBelajarHeader.jsx`), Modal Dialog, dan Live Chat Drawer.
* `z-[60]`: Toast Notifikasi, Alert Konfirmasi Kritis, dan Tooltip.

### D. Standar Animasi (Framer Motion)
* **Transisi Dialog & Modal**:
  ```jsx
  initial={{ opacity: 0, scale: 0.95, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 10 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  ```
* **Hover Interaktif**: `whileHover={{ scale: 1.02 }}` dan `whileTap={{ scale: 0.98 }}` pada tombol aksi utama.

---

## 3. Strategi Penyelarasan Bertahap

1. **Pertahankan Gaya yang Sudah Berjalan**: Jangan merombak halaman yang sedang aktif digunakan siswa/guru kecuali ada permintaan fitur/perbaikan spesifik.
2. **Saat Menambah Fitur Baru**: Cocokkan fitur baru dengan **Arketipe Gaya** yang sesuai dari tabel di atas.
3. **Hindari Campuran Berlebihan dalam 1 Halaman**: Pastikan dalam 1 halaman tidak mencampur gaya terang putih dengan dark neon secara acak tanpa pembagian kontainer yang jelas.

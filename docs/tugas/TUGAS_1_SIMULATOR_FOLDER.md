# Dokumentasi Modul: Tugas 1 - Simulator Manajemen File & Folder

Dokumen ini mencatat secara mendalam arsitektur, struktur komponen, state engine, dan 25 misi interaktif pada simulator sistem berkas (file system explorer).

* **URL Route**: `/tugas/simulasi-folder`
* **File Utama Halaman**: `src/pages/TugasKhusus/TugasSimulasiFolder.jsx`
* **Direktori Komponen**: `src/components/RuangBelajar/TugasKhusus/Tugas1/`
* **Target Pembelajaran**: Siswa memahami hierarki folder (directory tree), operasi file (Create, Move, Rename, Delete), ekstensi file (.docx, .sb3, .zip), dan jalur mutlak path (`C:\...`).

---

## 1. Peta File & Komponen Tugas 1

```text
src/components/RuangBelajar/TugasKhusus/Tugas1/
├── missionsConfig.js               # Konfigurasi 25 Misi Bertingkat & Fungsi Validator Otomatis
├── FloatingMissionPanel.jsx        # Panel Panduan Misi Melayang (Sticky/Draggable)
├── ModalMove.jsx                   # Modal Pemindahan File dengan Visualisasi Folder Tree Interaktif
├── BreadcrumbBar.jsx               # Navigasi Jalur Folder Bersejarah (C: > TUGAS_INFORMATIKA_7 > ...)
├── ExplorerToolbar.jsx             # Bar Alat Aksi (Folder Baru, File Baru, Rename, Delete, Reset)
├── FileListGrid.jsx                # Grid/List Tampilan Item File & Folder
└── StatusFooter.jsx                # Info Status (Total Item, Folder Terpilih, Progress Skor)
```

---

## 2. Arsitektur Virtual File System (State Engine)

Simulator ini berjalan murni di sisi browser siswa menggunakan virtual file system berbasis array of objects JSON:

```javascript
// Struktur Data Setiap Item (File / Folder)
{
  id: "item_101",
  name: "Biodata_Siswa",
  type: "file",          // 'folder' atau 'file'
  extension: "docx",     // 'docx', 'sb3', 'zip', 'pptx', 'xlsx', 'txt', 'png', dll.
  parentId: "root",      // ID folder induk ('root' untuk root C:)
  size: "15 KB",
  createdAt: "2026-08-23T10:00:00Z"
}
```

### A. Operasi Kunci File System
1. **Navigasi Folder (`currentFolderId`)**:
   - Double click pada item bertipe `folder` mengubah state `currentFolderId`.
   - Tombol *Up Folder* atau klik breadcrumb memindahkan tampilan ke folder induk (`parentId`).
2. **Operasi CRUD Virtual**:
   - **Create**: Menambah objek baru dengan `parentId = currentFolderId`.
   - **Rename**: Mengubah properti `name` (dan ekstensi jika berlaku).
   - **Move (`ModalMove.jsx`)**: Memperbarui `parentId` ke folder target yang dipilih pada visual tree.
   - **Delete**: Menghapus item terpilih beserta seluruh sub-folder/sub-file di dalamnya secara rekursif.

---

## 3. Rincian 25 Misi Bertingkat (`missionsConfig.js`)

Sistem mengevaluasi struktur item setiap kali siswa melakukan aksi. Misi diselesaikan secara berurutan (*sequential progress*).

| Level | Judul Misi | Target Aksi & Validasi |
|---|---|---|
| **Misi 1** | Buka Folder Kerja | Buka folder `TUGAS_INFORMATIKA_7` di root `C:`. |
| **Misi 2** | Buat Folder Induk Bab | Buat folder baru `BAB_1_PERANGKAT_KERAS` di dalam `TUGAS_INFORMATIKA_7`. |
| **Misi 3** | Buat Folder Input | Buat subfolder `1_INPUT_DEVICE` di dalam `BAB_1_PERANGKAT_KERAS`. |
| **Misi 4** | Buat Folder Output | Buat subfolder `2_OUTPUT_DEVICE` di dalam `BAB_1_PERANGKAT_KERAS`. |
| **Misi 5** | Buat Folder Processing | Buat subfolder `3_PROCESSING_DEVICE` di dalam `BAB_1_PERANGKAT_KERAS`. |
| **Misi 6** | Buat Folder Storage | Buat subfolder `4_STORAGE_DEVICE` di dalam `BAB_1_PERANGKAT_KERAS`. |
| **Misi 7** | Simpan File Dokumen Keyboard | Buat file `Laporan_Keyboard.docx` di dalam `1_INPUT_DEVICE`. |
| **Misi 8** | Simpan File Gambar Mouse | Buat file `Foto_Mouse.png` di dalam `1_INPUT_DEVICE`. |
| **Misi 9** | Buat Dokumen Scanner | Buat file `Tugas_Scanner.docx` di dalam `1_INPUT_DEVICE`. |
| **Misi 10** | Simpan Dokumen Monitor | Buat file `Spesifikasi_Monitor.docx` di dalam `2_OUTPUT_DEVICE`. |
| **Misi 11** | Buat File Audio Speaker | Buat file `Tes_Speaker.mp3` di dalam `2_OUTPUT_DEVICE`. |
| **Misi 12** | Simpan Dokumen CPU & RAM | Buat file `Rangkuman_CPU_RAM.docx` di dalam `3_PROCESSING_DEVICE`. |
| **Misi 13** | Buat File Flashdisk | Buat file `Data_Flashdisk.docx` di dalam `4_STORAGE_DEVICE`. |
| **Misi 14** | Pindahkan File Salah Tempat | Pindahkan `Salah_Kamar_Project.sb3` dari root `C:` ke `TUGAS_INFORMATIKA_7`. |
| **Misi 15** | Rename File Sesuai Standar | Ganti nama `draft_laporan.txt` menjadi `Laporan_Final_Informatika.docx`. |
| **Misi 16** | Hapus File Sampah/Virus | Hapus file berbahaya `virus_palsu.exe` yang ada di folder `C:`. |
| **Misi 17** | Buat Folder Cadangan Backup | Buat folder `BACKUP_DATA_2026` di root `C:`. |
| **Misi 18** | Pindahkan File Arsip Zip | Pindahkan `Arsip_Semester_1.zip` ke dalam folder `BACKUP_DATA_2026`. |
| **Misi 19** | Buat Folder Bab 2 Algoritma | Buat folder `BAB_2_ALGORITMA_SCRATCH` di dalam `TUGAS_INFORMATIKA_7`. |
| **Misi 20** | Buat Subfolder Game Kucing | Buat folder `PROYEK_GAME_1` di dalam `BAB_2_ALGORITMA_SCRATCH`. |
| **Misi 21** | Simpan File Project Scratch | Buat file `Game_Animasi_Kucing.sb3` di dalam `PROYEK_GAME_1`. |
| **Misi 22** | Buat Subfolder Presentasi | Buat folder `BAHAN_PRESENTASI` di dalam `BAB_2_ALGORITMA_SCRATCH`. |
| **Misi 23** | Simpan Slide Presentasi PPTX | Buat file `Slide_Algoritma.pptx` di dalam `BAHAN_PRESENTASI`. |
| **Misi 24** | Bersihkan Folder Temporary | Hapus folder `TEMP_DELETE_ME` beserta isinya di dalam `TUGAS_INFORMATIKA_7`. |
| **Misi 25** | Finalisasi Master Archive | Buat file `MASTER_TUGAS_LENGKAP.zip` di dalam `TUGAS_INFORMATIKA_7`. |

---

## 4. Alur Evaluasi Otomatis & Sinkronisasi Skor

```text
Siswa Menyelesaikan Misi Ke-N
              │
              ▼
   State: `currentMissionIndex` Naik
              │
              ▼
   Hitung Skor: `(completedMissions / 25) * 100`
              │
              ▼ Siswa Klik "Kirim Nilai Tugas"
   [tugas_pengumpulan] (INSERT / UPDATE)
              │
              ▼ Otomatis via Supabase DB Trigger
   [point_logs] ───► [master_siswa.total_points]
```

### A. Validasi Misi Pintar
* Setiap misi pada `missionsConfig.js` memiliki fungsi validator murni:
  ```javascript
  validate: (fileSystemItems) => {
    // Memeriksa keberadaan item, nama persis (case-insensitive), tipe, dan parentId
    return fileSystemItems.some(item => 
      item.name.toLowerCase() === 'bab_1_perangkat_keras' && 
      item.type === 'folder' && 
      item.parentId === 'folder_tugas_7'
    );
  }
  ```

---

## 5. Panduan Modifikasi & Debugging

1. **Auto-Highlight Lokasi Target**:
   - `FloatingMissionPanel.jsx` memiliki helper untuk mendeteksi `(Lokasi Target: ...)` dalam teks petunjuk agar di-render dengan background kuning tebal (`bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded`).
2. **ModalMove Folder Tree View**:
   - Komponen `ModalMove.jsx` merender direktori secara rekursif. Hindari looping tak hingga dengan memastikan tidak ada item folder yang memiliki `parentId` dirinya sendiri.
3. **Reset State**:
   - Tombol *Reset Folder Default* mengembalikan state `items` ke `initialFileSystemData` bawaan misi 1.

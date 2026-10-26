# Standarisasi Format Kolom `detail_jawaban` (JSONB) - Ruang Spendaraja

Dokumen ini adalah spesifikasi resmi dan panduan implementasi struktur data kolom `detail_jawaban` pada tabel database `public.tugas_pengumpulan` Supabase untuk **Tugas 6 dan seterusnya**.

---

## 1. Latar Belakang & Prinsip Arsitektur

### A. Kebijakan Isolasi Data Legacy (Tugas 1 – 5)
Pada pengembangan awal Tugas 1 hingga Tugas 5, format objek di dalam `detail_jawaban` dibuat secara mandiri sesuai kebutuhan masing-masing modul:
* **Tugas 1 (Folder)**: Menyimpan `treeSnapshot`, `currentMissionId`, `missionsCompleted`.
* **Tugas 2 (Berpikir Komputasional)**: Menyimpan objek `missions` dan `scores` (m1–m4).
* **Tugas 3 (Sistem Komputer)**: Menyimpan `placements`, `quizAnswers`, `scoreBreakdown`.
* **Tugas 4 (Biner & ASCII)**: Menyimpan `activeStage`, `stage2Questions`–`stage4Questions`, `uploadedPhotoInfo`, `scores`.
* **Tugas 5 (Pengolah Kata Ms. Word)**: Menyimpan `completedTopicIds`, `checkpointAnswers`, `readingSeconds`, `quizAnswers`, `uploadedFileInfo`, `scoreTahap1`–`scoreTahap3`.

> [!IMPORTANT]
> **Kebijakan Nol Risiko (Zero Risk Policy)**:
> Format data pengerjaan Tugas 1 hingga Tugas 5 **TIDAK DIUBAH ATAU DIMIGRASI**. Seluruh data pengerjaan siswa yang sudah tersimpan di database tetap utuh dan stabil. Sistem mendeteksi format lama secara otomatis melalui ketiadaan properti `schema_version`.

### B. Prinsip Standarisasi Format Baru (v2.0)
Mulai **Tugas 6 ke atas**, seluruh tugas wajib mematuhi standar **Schema v2.0**:
1. **Efektif**: Memungkinkan pembuatan 1 komponen antarmuka universal di Dashboard Guru (*Universal Task Detail Modal*) yang dapat membaca dan menampilkan rincian progres tugas apapun secara otomatis.
2. **Efisien**: Menghindari redundansi data. Kolom SQL utama (`skor`, `persentase_skor`, `tautan_tugas`, `nama_berkas`, `catatan_siswa`) tetap menjadi *single source of truth* untuk kueri cepat dan indeks database. Kolom `detail_jawaban` hanya menyimpan metadata dan rincian evaluasi (< 3 KB per baris, tanpa blob/base64).
3. **Bijak (Future-Proof & Flexible)**: Memiliki blok khusus `custom_state` sebagai *sandbox* terisolasi untuk mekanik unik tiap tugas tanpa merusak struktur utama.
4. **Lengkap**: Mencakup telemetri pengerjaan (durasi detik, jumlah percobaan, waktu simpan), breakdown nilai terstruktur, status per tahapan, dan evaluasi otomatis (*auto-grading*).

---

## 2. Struktur Skema Standar (Schema v2.0 Specification)

Setiap payload JSON yang disimpan ke kolom `detail_jawaban` pada tugas baru wajib mengikuti kontrak berikut:

```typescript
interface StandardDetailJawabanV2 {
  /** Versi spesifikasi skema, wajib bernilai "2.0" */
  schema_version: "2.0";

  /** Klasifikasi model tugas */
  tipe_tugas: "multi_stage" | "single_task" | "kuis_murni" | "proyek_unggah" | "simulasi_interaktif";

  /** Informasi umum & telemetri pengerjaan */
  meta: {
    kode_tugas: string;             // Contoh: "TUGAS-06-EXCEL-DATA"
    judul_tugas: string;            // Nama lengkap tugas
    active_stage: number;           // Tahap/langkah yang sedang aktif dibuka siswa (1-indexed)
    total_stages: number;           // Total jumlah tahap/langkah
    time_spent_seconds: number;     // Akumulasi waktu pengerjaan aktif siswa (dalam detik)
    attempt_count: number;          // Jumlah percobaan submit / pengerjaan ulang
    last_saved_at: string;          // ISO 8601 Timestamp saat auto-save / simpan terakhir
    is_completed: boolean;          // True jika seluruh kriteria tugas sudah tuntas
  };

  /** Rincian perolehan nilai yang seragam untuk seluruh jenis tugas */
  ringkasan_skor: {
    skor_maksimal: number;          // Poin maksimal tugas (misal: 100)
    skor_diperoleh: number;         // Skor dari pengerjaan saat ini
    skor_tertinggi_disimpan: number;// Skor terbaik yang tercatat di database (proteksi Math.max)
    breakdown: Array<{
      id: string;                   // Identifier unik sub-penilaian (contoh: "tahap_1", "kuis", "proyek")
      label: string;                // Label ramah pengguna (contoh: "Literasi & Checkpoint Rumus")
      skor: number;                 // Poin yang berhasil didapatkan siswa
      skor_maks: number;            // Poin maksimal pada bagian ini
      status: "lulus" | "sebagian" | "belum" | "perlu_revisi";
    }>;
  };

  /** (Opsional) Rincian progres per tahapan atau misi */
  stages?: Record<string, {
    status: "locked" | "in_progress" | "completed";
    completed_at: string | null;    // ISO 8601 Timestamp
    skor?: number;
    answers?: Record<string, any>;  // Kunci jawaban / pilihan siswa
    notes?: string;
  }>;

  /** (Opsional) Metadata berkas yang diunggah ke Cloudinary */
  berkas?: {
    tipe: "dokumen" | "gambar" | "audio" | "video" | "arsip";
    format: string;                 // Ekstensi berkas, contoh: "xlsx", "docx", "pdf", "png"
    url: string;                    // Secure URL Cloudinary
    nama_file: string;              // Nama berkas asli
    ukuran_bytes?: number;          // Ukuran berkas (dalam bytes)
    uploaded_at: string;            // ISO 8601 Timestamp
  } | null;

  /** (Opsional) Ringkasan evaluasi otomatis sistem / AI */
  auto_grading?: {
    is_auto_graded: boolean;
    kriteria_terpenuhi: string[];   // Daftar kriteria rubrik yang sukses divalidasi
    kriteria_kurang: string[];      // Daftar kriteria yang belum lengkap
    catatan_sistem?: string;        // Feedback instan untuk siswa / guru
  } | null;

  /** (Opsional) Sandbox state lokal khusus untuk simulator / visual modul */
  custom_state?: Record<string, any>;
}
```

---

## 3. Contoh Format Data JSON Nyata

### A. Contoh 1: Tugas Multi-Tahap (Spreadsheet / Microsoft Excel)
```json
{
  "schema_version": "2.0",
  "tipe_tugas": "multi_stage",
  "meta": {
    "kode_tugas": "TUGAS-06-EXCEL-DATA",
    "judul_tugas": "Tugas 6: Pengolahan Angka & Formula Matematika",
    "active_stage": 2,
    "total_stages": 3,
    "time_spent_seconds": 620,
    "attempt_count": 1,
    "last_saved_at": "2026-11-02T08:45:10.000Z",
    "is_completed": false
  },
  "ringkasan_skor": {
    "skor_maksimal": 100,
    "skor_diperoleh": 85,
    "skor_tertinggi_disimpan": 85,
    "breakdown": [
      {
        "id": "tahap_1",
        "label": "Materi Literasi & Checkpoint Rumus",
        "skor": 20,
        "skor_maks": 20,
        "status": "lulus"
      },
      {
        "id": "tahap_2",
        "label": "Kuis Logika Fungsi SUM, AVERAGE, IF",
        "skor": 25,
        "skor_maks": 30,
        "status": "sebagian"
      },
      {
        "id": "tahap_3",
        "label": "Upload Berkas Workbook .xlsx",
        "skor": 40,
        "skor_maks": 50,
        "status": "sebagian"
      }
    ]
  },
  "stages": {
    "tahap_1": {
      "status": "completed",
      "completed_at": "2026-11-02T08:20:00.000Z",
      "skor": 20,
      "answers": {
        "chk_1": "=SUM(A1:A10)",
        "chk_2": "=AVERAGE(B2:B8)"
      }
    },
    "tahap_2": {
      "status": "completed",
      "completed_at": "2026-11-02T08:35:15.000Z",
      "skor": 25,
      "answers": {
        "q1": "B",
        "q2": "A",
        "q3": "D",
        "q4": "C"
      }
    },
    "tahap_3": {
      "status": "in_progress",
      "completed_at": null,
      "skor": 40,
      "answers": null
    }
  },
  "berkas": {
    "tipe": "dokumen",
    "format": "xlsx",
    "url": "https://res.cloudinary.com/ruang-spendaraja/raw/upload/v1234/Tugas/6/tugas6_budi.xlsx",
    "nama_file": "tugas6_budi_07_excel.xlsx",
    "ukuran_bytes": 24576,
    "uploaded_at": "2026-11-02T08:44:50.000Z"
  },
  "auto_grading": {
    "is_auto_graded": true,
    "kriteria_terpenuhi": [
      "format_file_xlsx_valid",
      "rumus_sum_ditemukan",
      "rumus_average_ditemukan"
    ],
    "kriteria_kurang": [
      "formula_if_kondisional_belum_lengkap"
    ],
    "catatan_sistem": "Tabel nilai siswa berhasil divalidasi. Perbaiki formula IF pada kolom Keterangan."
  },
  "custom_state": {
    "activeSheetIndex": 0,
    "lastSelectedCell": "E12"
  }
}
```

### B. Contoh 2: Tugas Pemrograman Visual / Scratch / Simulator
```json
{
  "schema_version": "2.0",
  "tipe_tugas": "simulasi_interaktif",
  "meta": {
    "kode_tugas": "TUGAS-07-SCRATCH-ANIMASI",
    "judul_tugas": "Tugas 7: Proyek Animasi Algoritma Percabangan Scratch",
    "active_stage": 1,
    "total_stages": 1,
    "time_spent_seconds": 900,
    "attempt_count": 2,
    "last_saved_at": "2026-11-15T10:12:00.000Z",
    "is_completed": true
  },
  "ringkasan_skor": {
    "skor_maksimal": 100,
    "skor_diperoleh": 100,
    "skor_tertinggi_disimpan": 100,
    "breakdown": [
      {
        "id": "blok_event",
        "label": "Blok Ketika Bendera Hijau Diklik",
        "skor": 25,
        "skor_maks": 25,
        "status": "lulus"
      },
      {
        "id": "blok_loop",
        "label": "Struktur Perulangan (Forever / Repeat)",
        "skor": 35,
        "skor_maks": 35,
        "status": "lulus"
      },
      {
        "id": "blok_kondisi",
        "label": "Percabangan Logika (If-Else Sensor)",
        "skor": 40,
        "skor_maks": 40,
        "status": "lulus"
      }
    ]
  },
  "berkas": {
    "tipe": "arsip",
    "format": "sb3",
    "url": "https://res.cloudinary.com/ruang-spendaraja/raw/upload/v1234/Tugas/7/proyek_animasi.sb3",
    "nama_file": "proyek_animasi_spendaraja.sb3",
    "ukuran_bytes": 1048576,
    "uploaded_at": "2026-11-15T10:10:00.000Z"
  },
  "auto_grading": {
    "is_auto_graded": true,
    "kriteria_terpenuhi": [
      "has_green_flag_hat",
      "contains_loop_blocks",
      "contains_conditional_branch"
    ],
    "kriteria_kurang": [],
    "catatan_sistem": "Struktur blok Scratch lengkap dan memenuhi semua rubrik."
  },
  "custom_state": {
    "spriteCount": 3,
    "totalBlocks": 42
  }
}
```

---

## 4. Helper JavaScript & Integrasi Kode (`src/utils/tugasSchemaHelper.js`)

Untuk mempermudah penggunaan di *custom hook* dan komponen React, gunakan modul helper berikut:

```javascript
/**
 * src/utils/tugasSchemaHelper.js
 * Utilitas resmi standarisasi detail_jawaban v2.0 Ruang Spendaraja
 */

/**
 * Membuat payload standar detail_jawaban v2.0
 */
export function buildStandardDetailJawaban({
  kodeTugas,
  judulTugas,
  tipeTugas = 'multi_stage',
  activeStage = 1,
  totalStages = 1,
  timeSpentSeconds = 0,
  attemptCount = 1,
  skorMaksimal = 100,
  skorDiperoleh = 0,
  skorTertinggiDisimpan = 0,
  breakdownSkor = [],
  stagesData = {},
  berkasInfo = null,
  autoGrading = null,
  customState = {},
  isCompleted = false,
}) {
  return {
    schema_version: '2.0',
    tipe_tugas: tipeTugas,
    meta: {
      kode_tugas: kodeTugas,
      judul_tugas: judulTugas,
      active_stage: activeStage,
      total_stages: totalStages,
      time_spent_seconds: Math.max(0, Math.round(timeSpentSeconds)),
      attempt_count: Math.max(1, attemptCount),
      last_saved_at: new Date().toISOString(),
      is_completed: Boolean(isCompleted),
    },
    ringkasan_skor: {
      skor_maksimal: skorMaksimal,
      skor_diperoleh: skorDiperoleh,
      skor_tertinggi_disimpan: Math.max(skorTertinggiDisimpan, skorDiperoleh),
      breakdown: breakdownSkor,
    },
    stages: stagesData,
    berkas: berkasInfo,
    auto_grading: autoGrading,
    custom_state: customState,
  };
}

/**
 * Parser aman yang otomatis mendeteksi format baru vs legacy
 */
export function parseDetailJawaban(rawDetail) {
  if (!rawDetail) {
    return { isLegacy: true, version: 'empty', data: {} };
  }

  let parsed = rawDetail;
  if (typeof rawDetail === 'string') {
    try {
      parsed = JSON.parse(rawDetail);
    } catch (e) {
      console.warn('Gagal parse JSON detail_jawaban:', e);
      return { isLegacy: true, version: 'corrupt', data: {} };
    }
  }

  if (parsed && typeof parsed === 'object') {
    if (parsed.schema_version === '2.0') {
      return {
        isLegacy: false,
        version: '2.0',
        data: parsed,
      };
    }
  }

  // Jika tidak memiliki schema_version 2.0, tandai sebagai Legacy (Tugas 1 - 5)
  return {
    isLegacy: true,
    version: 'legacy_v1',
    data: parsed || {},
  };
}
```

---

## 5. Pola Integrasi pada Hook Tugas (`useTugasState`)

Saat menyimpan pengerjaan ke Supabase, perhatikan pemetaan kolom berikut:

```javascript
// 1. Bangun detail_jawaban v2.0 menggunakan helper
const detailLog = buildStandardDetailJawaban({
  kodeTugas: 'TUGAS-06-EXCEL',
  judulTugas: 'Pengolahan Angka & Formula Matematika',
  activeStage: currentStage,
  totalStages: 3,
  timeSpentSeconds: timerSeconds,
  skorMaksimal: 100,
  skorDiperoleh: currentScore,
  skorTertinggiDisimpan: bestScoreInDb,
  breakdownSkor: [
    { id: 'tahap_1', label: 'Literasi Rumus', skor: scoreT1, skor_maks: 20, status: 'lulus' },
    { id: 'tahap_2', label: 'Kuis Logika', skor: scoreT2, skor_maks: 30, status: 'lulus' },
    { id: 'tahap_3', label: 'Proyek Dokumen', skor: scoreT3, skor_maks: 50, status: 'sebagian' },
  ],
  stagesData: {
    tahap_1: { status: 'completed', skor: scoreT1, answers: checkpointAnswers },
    tahap_2: { status: 'completed', skor: scoreT2, answers: quizAnswers },
    tahap_3: { status: isUploaded ? 'completed' : 'in_progress', skor: scoreT3 },
  },
  berkasInfo: uploadedFileInfo,
  autoGrading: autoGradingResult,
  customState: { activeCell: 'B4' },
  isCompleted: isFullySubmitted,
});

// 2. Simpan payload SQL murni ke tabel tugas_pengumpulan
const payload = {
  tugas_id: resolvedTaskId,
  siswa_id: studentId,
  status: isFullySubmitted ? 'submitted' : 'sedang',
  skor: Math.max(bestScoreInDb, currentScore),
  persentase_skor: Number(((Math.max(bestScoreInDb, currentScore) / 100) * 100).toFixed(2)),
  tautan_tugas: uploadedFileInfo?.url || null,
  nama_berkas: uploadedFileInfo?.nama_file || null,
  catatan_siswa: studentNotes || null,
  detail_jawaban: detailLog, // <-- JSONB Terstandar v2.0
  updated_at: new Date().toISOString(),
};
```

---

## 6. Panduan Implementasi di Dashboard Guru (Universal Viewer)

Dengan adanya skema seragam ini, komponen Dashboard Guru cukup menguji versi data:

```jsx
import { parseDetailJawaban } from '@/utils/tugasSchemaHelper';
import UniversalTaskDetailView from './UniversalTaskDetailView';
import LegacyTaskDetailView from './LegacyTaskDetailView';

export function StudentSubmissionDetailModal({ submission, taskCode, onClose }) {
  const { isLegacy, data } = parseDetailJawaban(submission?.detail_jawaban);

  if (isLegacy) {
    // Tugas 1 - 5 dirender dengan viewer khusus masing-masing
    return <LegacyTaskDetailView taskCode={taskCode} submission={submission} data={data} onClose={onClose} />;
  }

  // Tugas 6 ke atas otomatis dirender oleh komponen universal
  return (
    <UniversalTaskDetailView
      meta={data.meta}
      ringkasanSkor={data.ringkasan_skor}
      stages={data.stages}
      berkas={data.berkas}
      autoGrading={data.auto_grading}
      submission={submission}
      onClose={onClose}
    />
  );
}
```

---

## 7. Ringkasan Pantangan (Do's & Don'ts)

| Hal yang HARUS Dilakukan (Do's) | Hal yang DILARANG (Don'ts) |
|---|---|
| Selalu sertakan `"schema_version": "2.0"` pada semua tugas baru (Tugas 6+). | **DILARANG** mengubah atau memigrasi `detail_jawaban` Tugas 1–5 yang sudah ada di database. |
| Simpan berkas ke Cloudinary dan hanya simpan URL/nama file di `berkas` dan `tautan_tugas`. | **DILARANG** menyimpan string gambar/file base64 di dalam `detail_jawaban` (dapat menyebabkan overhead DB). |
| Selalu gunakan array `ringkasan_skor.breakdown` agar rincian skor bisa ditampilkan seragam di modal guru. | **DILARANG** membuat nama field skor acak (misal: `nilai1`, `pointTotal`, `skorAwal`) di tingkat root JSON. |
| Gunakan `custom_state` jika tugas memiliki data simulator interaktif khusus. | **DILARANG** mengirim kolom non-skema SQL ke Supabase (`file_url`, `nisn_siswa`, dll) agar tidak memicu error `PGRST204`. |
| Selalu bungkus parsing `detail_jawaban` dengan `try...catch` atau gunakan `parseDetailJawaban()`. | **DILARANG** mengasumsikan tipe data `detail_jawaban` selalu objek (PostgREST terkadang mengembalikan string JSON). |

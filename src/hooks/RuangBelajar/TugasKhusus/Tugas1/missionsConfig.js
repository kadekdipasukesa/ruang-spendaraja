/**
 * Konfigurasi 25 Target Misi Praktik Manajemen File & Folder
 * Total skor terdistribusi tepat 100 poin.
 * 
 * Data ini disimpan dalam detail_jawaban (JSONB) pada tabel tugas_pengumpulan
 * sehingga TIDAK PERLU mengubah skema tabel database Supabase.
 */

export const INITIAL_FILES_DATA = [
  { id: 'f-root-1', name: 'laporan_praktik.docx', type: 'file', parentId: null, fileType: 'doc', size: '24 KB', ext: '.docx' },
  { id: 'f-root-2', name: 'bagan_flowchart.png', type: 'file', parentId: null, fileType: 'img', size: '142 KB', ext: '.png' },
  { id: 'f-root-3', name: 'catatan_algoritma.txt', type: 'file', parentId: null, fileType: 'text', size: '4 KB', ext: '.txt' },
  { id: 'f-root-4', name: 'berkas_rusak.tmp', type: 'file', parentId: null, fileType: 'temp', size: '1 KB', ext: '.tmp' }
];

export const FILE_TYPE_OPTIONS = [
  { ext: '.docx', label: 'Dokumen Word (.docx)', type: 'doc', defaultName: 'dokumen_baru.docx', size: '18 KB' },
  { ext: '.xlsx', label: 'Spreadsheet Excel (.xlsx)', type: 'sheet', defaultName: 'data_tabel.xlsx', size: '22 KB' },
  { ext: '.pptx', label: 'Presentasi PowerPoint (.pptx)', type: 'slide', defaultName: 'slide_presentasi.pptx', size: '320 KB' },
  { ext: '.pdf', label: 'Dokumen PDF (.pdf)', type: 'pdf', defaultName: 'dokumen_final.pdf', size: '95 KB' },
  { ext: '.txt', label: 'Catatan Teks (.txt)', type: 'text', defaultName: 'catatan.txt', size: '3 KB' },
  { ext: '.png', label: 'Gambar PNG (.png)', type: 'img', defaultName: 'gambar_baru.png', size: '115 KB' },
  { ext: '.mp3', label: 'Audio Musik (.mp3)', type: 'audio', defaultName: 'rekaman_suara.mp3', size: '1.4 MB' },
  { ext: '.sb3', label: 'Proyek Scratch (.sb3)', type: 'code', defaultName: 'proyek_scratch.sb3', size: '450 KB' },
  { ext: '.zip', label: 'Arsip ZIP (.zip)', type: 'zip', defaultName: 'arsip_data.zip', size: '80 KB' }
];

// Helper helper normalisasi string
const norm = (str) => (str || '').trim().toLowerCase().replace(/[\s\-_]/g, '');

/**
 * 25 Target Misi Praktik Terstruktur (Total = 100 Poin)
 */
export const MISSIONS_DEF = [
  // === KATEGORI A: STRUKTUR FOLDER UTAMA & TINGKAT 1 (24 Poin) ===
  {
    id: 'm01',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Folder Utama "TUGAS_INFORMATIKA_7"',
    instruction: 'Buat folder utama bernama "TUGAS_INFORMATIKA_7" pada direktori Drive Utama (C:).',
    points: 4,
    check: (items) => {
      return items.some(
        (it) => it.type === 'folder' && it.parentId === null && norm(it.name) === 'tugasinformatika7'
      );
    }
  },
  {
    id: 'm02',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "01_DOKUMEN"',
    instruction: 'Buat subfolder "01_DOKUMEN" (atau "DOKUMEN") di dalam "TUGAS_INFORMATIKA_7".',
    points: 4,
    check: (items) => {
      const parent = items.find((it) => it.type === 'folder' && it.parentId === null && norm(it.name) === 'tugasinformatika7');
      if (!parent) return false;
      return items.some(
        (it) => it.type === 'folder' && it.parentId === parent.id && (norm(it.name) === '01dokumen' || norm(it.name) === 'dokumen')
      );
    }
  },
  {
    id: 'm03',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "02_GAMBAR"',
    instruction: 'Buat subfolder "02_GAMBAR" (atau "GAMBAR") di dalam "TUGAS_INFORMATIKA_7".',
    points: 4,
    check: (items) => {
      const parent = items.find((it) => it.type === 'folder' && it.parentId === null && norm(it.name) === 'tugasinformatika7');
      if (!parent) return false;
      return items.some(
        (it) => it.type === 'folder' && it.parentId === parent.id && (norm(it.name) === '02gambar' || norm(it.name) === 'gambar')
      );
    }
  },
  {
    id: 'm04',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "03_PROYEK_SCRATCH"',
    instruction: 'Buat subfolder "03_PROYEK_SCRATCH" (atau "PROYEK_SCRATCH" / "SCRATCH") di dalam "TUGAS_INFORMATIKA_7".',
    points: 4,
    check: (items) => {
      const parent = items.find((it) => it.type === 'folder' && it.parentId === null && norm(it.name) === 'tugasinformatika7');
      if (!parent) return false;
      return items.some(
        (it) => it.type === 'folder' && it.parentId === parent.id && (norm(it.name).includes('scratch') || norm(it.name).includes('proyek'))
      );
    }
  },
  {
    id: 'm05',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "04_AUDIO_VIDEO"',
    instruction: 'Buat subfolder "04_AUDIO_VIDEO" (atau "AUDIO_VIDEO" / "MEDIA") di dalam "TUGAS_INFORMATIKA_7".',
    points: 4,
    check: (items) => {
      const parent = items.find((it) => it.type === 'folder' && it.parentId === null && norm(it.name) === 'tugasinformatika7');
      if (!parent) return false;
      return items.some(
        (it) => it.type === 'folder' && it.parentId === parent.id && (norm(it.name).includes('audio') || norm(it.name).includes('media') || norm(it.name).includes('video'))
      );
    }
  },
  {
    id: 'm06',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "MATERI" di dalam Dokumen',
    instruction: 'Buka subfolder Dokumen, lalu buat subfolder bertingkat bernama "MATERI".',
    points: 4,
    check: (items) => {
      const docFolder = items.find((it) => it.type === 'folder' && (norm(it.name) === '01dokumen' || norm(it.name) === 'dokumen'));
      if (!docFolder) return false;
      return items.some((it) => it.type === 'folder' && it.parentId === docFolder.id && norm(it.name) === 'materi');
    }
  },

  // === KATEGORI B: SUBFOLDER TINGKAT LANJUT (16 Poin) ===
  {
    id: 'm07',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "TUGAS_HARIAN" di dalam Dokumen',
    instruction: 'Buka subfolder Dokumen, lalu buat subfolder bertingkat bernama "TUGAS_HARIAN".',
    points: 4,
    check: (items) => {
      const docFolder = items.find((it) => it.type === 'folder' && (norm(it.name) === '01dokumen' || norm(it.name) === 'dokumen'));
      if (!docFolder) return false;
      return items.some((it) => it.type === 'folder' && it.parentId === docFolder.id && (norm(it.name) === 'tugasharian' || norm(it.name) === 'tugas'));
    }
  },
  {
    id: 'm08',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "ASSET_SPRITE" di dalam Gambar',
    instruction: 'Buka subfolder Gambar, lalu buat subfolder bertingkat bernama "ASSET_SPRITE" (atau "SPRITE").',
    points: 4,
    check: (items) => {
      const imgFolder = items.find((it) => it.type === 'folder' && (norm(it.name) === '02gambar' || norm(it.name) === 'gambar'));
      if (!imgFolder) return false;
      return items.some((it) => it.type === 'folder' && it.parentId === imgFolder.id && (norm(it.name).includes('sprite') || norm(it.name).includes('asset')));
    }
  },
  {
    id: 'm09',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "DIAGRAM" di dalam Gambar',
    instruction: 'Buka subfolder Gambar, lalu buat subfolder bertingkat bernama "DIAGRAM" (atau "BAGAN").',
    points: 4,
    check: (items) => {
      const imgFolder = items.find((it) => it.type === 'folder' && (norm(it.name) === '02gambar' || norm(it.name) === 'gambar'));
      if (!imgFolder) return false;
      return items.some((it) => it.type === 'folder' && it.parentId === imgFolder.id && (norm(it.name).includes('diagram') || norm(it.name).includes('bagan')));
    }
  },
  {
    id: 'm10',
    category: 'Struktur Folder',
    categoryCode: 'folder',
    title: 'Buat Subfolder "BACKUP" di dalam Proyek Scratch',
    instruction: 'Buka subfolder Scratch, lalu buat subfolder bertingkat bernama "BACKUP".',
    points: 4,
    check: (items) => {
      const scratchFolder = items.find((it) => it.type === 'folder' && (norm(it.name).includes('scratch') || norm(it.name).includes('proyek')));
      if (!scratchFolder) return false;
      return items.some((it) => it.type === 'folder' && it.parentId === scratchFolder.id && norm(it.name) === 'backup');
    }
  },

  // === KATEGORI C: PEMINDAHAN BERKAS & PENGORGANISASIAN AWAL (16 Poin) ===
  {
    id: 'm11',
    category: 'Manajemen Berkas',
    categoryCode: 'file',
    title: 'Pindahkan "laporan_praktik.docx" ke Folder Dokumen',
    instruction: 'Pindahkan berkas laporan_praktik.docx dari root ke dalam subfolder DOKUMEN atau TUGAS_HARIAN.',
    points: 4,
    check: (items) => {
      const docFolders = items.filter(
        (it) => it.type === 'folder' && (norm(it.name).includes('dokumen') || norm(it.name).includes('tugas'))
      ).map((f) => f.id);
      return items.some(
        (it) => it.type === 'file' && norm(it.name).includes('laporan') && it.parentId !== null && docFolders.includes(it.parentId)
      );
    }
  },
  {
    id: 'm12',
    category: 'Manajemen Berkas',
    categoryCode: 'file',
    title: 'Pindahkan "bagan_flowchart.png" ke Folder Gambar',
    instruction: 'Pindahkan berkas bagan_flowchart.png dari root ke dalam subfolder GAMBAR atau DIAGRAM.',
    points: 4,
    check: (items) => {
      const imgFolders = items.filter(
        (it) => it.type === 'folder' && (norm(it.name).includes('gambar') || norm(it.name).includes('diagram'))
      ).map((f) => f.id);
      return items.some(
        (it) => it.type === 'file' && norm(it.name).includes('flowchart') && it.parentId !== null && imgFolders.includes(it.parentId)
      );
    }
  },
  {
    id: 'm13',
    category: 'Manajemen Berkas',
    categoryCode: 'file',
    title: 'Pindahkan "catatan_algoritma" ke Folder Dokumen',
    instruction: 'Pindahkan berkas catatan algoritma dari root ke dalam subfolder DOKUMEN atau MATERI.',
    points: 4,
    check: (items) => {
      const docFolders = items.filter(
        (it) => it.type === 'folder' && (norm(it.name).includes('dokumen') || norm(it.name).includes('materi'))
      ).map((f) => f.id);
      return items.some(
        (it) => it.type === 'file' && norm(it.name).includes('catatan') && it.parentId !== null && docFolders.includes(it.parentId)
      );
    }
  },
  {
    id: 'm14',
    category: 'Manajemen Berkas',
    categoryCode: 'file',
    title: 'Hapus Berkas Sampah "berkas_rusak.tmp"',
    instruction: 'Hapus berkas sementara "berkas_rusak.tmp" yang tidak diperlukan agar sistem bersih.',
    points: 4,
    check: (items) => {
      return !items.some((it) => it.type === 'file' && norm(it.name).includes('rusak'));
    }
  },

  // === KATEGORI D: PEMBUATAN BERKAS BARU DENGAN BERBAGAI EKSTENSI (24 Poin) ===
  {
    id: 'm15',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas Word "rangkuman_hardware.docx"',
    instruction: 'Gunakan tombol Buat Berkas untuk membuat file Word (.docx) bernama "rangkuman_hardware.docx" di folder Dokumen/Materi.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('hardware') && it.name.endsWith('.docx'));
    }
  },
  {
    id: 'm16',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas Spreadsheet "data_nilai.xlsx"',
    instruction: 'Buat file tabel Excel (.xlsx) bernama "data_nilai.xlsx" (atau "data_nilai_informatika.xlsx") di dalam folder Dokumen.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('nilai') && it.name.endsWith('.xlsx'));
    }
  },
  {
    id: 'm17',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas Slide "presentasi_jaringan.pptx"',
    instruction: 'Buat file presentasi PowerPoint (.pptx) bernama "presentasi_jaringan.pptx" di dalam folder Dokumen.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('jaringan') && it.name.endsWith('.pptx'));
    }
  },
  {
    id: 'm18',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas PDF "panduan_praktik.pdf"',
    instruction: 'Buat file PDF (.pdf) bernama "panduan_praktik.pdf" di dalam folder Dokumen.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('panduan') && it.name.endsWith('.pdf'));
    }
  },
  {
    id: 'm19',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas Sprite "karakter_kucing.png"',
    instruction: 'Buat file gambar PNG (.png) bernama "karakter_kucing.png" (atau "sprite_kucing.png") di folder Gambar/Asset Sprite.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && (norm(it.name).includes('kucing') || norm(it.name).includes('sprite')) && it.name.endsWith('.png'));
    }
  },
  {
    id: 'm20',
    category: 'Pembuatan Berkas',
    categoryCode: 'create',
    title: 'Buat Berkas Audio "suara_game.mp3"',
    instruction: 'Buat file musik/audio (.mp3) bernama "suara_game.mp3" (atau "efek_suara.mp3") di folder 04_AUDIO_VIDEO.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && (norm(it.name).includes('suara') || norm(it.name).includes('audio') || norm(it.name).includes('game')) && it.name.endsWith('.mp3'));
    }
  },

  // === KATEGORI E: PROYEK KHUSUS, ARSIP & REORGANISASI TUNTAS (20 Poin) ===
  {
    id: 'm21',
    category: 'Proyek & Arsip',
    categoryCode: 'special',
    title: 'Buat Berkas Proyek "game_labirin.sb3"',
    instruction: 'Buat file proyek Scratch (.sb3) bernama "game_labirin.sb3" di folder 03_PROYEK_SCRATCH.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('labirin') && it.name.endsWith('.sb3'));
    }
  },
  {
    id: 'm22',
    category: 'Proyek & Arsip',
    categoryCode: 'special',
    title: 'Buat Berkas Arsip "backup_minggu1.zip"',
    instruction: 'Buat file arsip terkompresi (.zip) bernama "backup_minggu1.zip" di folder BACKUP.',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('backup') && it.name.endsWith('.zip'));
    }
  },
  {
    id: 'm23',
    category: 'Pengorganisasian',
    categoryCode: 'rename',
    title: 'Ganti Nama (Rename) "catatan_algoritma.txt"',
    instruction: 'Ganti nama file "catatan_algoritma.txt" menjadi "catatan_algoritma_revisi.txt" (atau ada kata "revisi").',
    points: 4,
    check: (items) => {
      return items.some((it) => it.type === 'file' && norm(it.name).includes('revisi') && it.name.endsWith('.txt'));
    }
  },
  {
    id: 'm24',
    category: 'Kebersihan Direktori',
    categoryCode: 'clean',
    title: 'Kebersihan Drive Root (C:)',
    instruction: 'Pastikan direktori Drive Utama (C:) bersih dan rapi (hanya berisi folder utama, tidak ada file yang tercecer di luar folder).',
    points: 4,
    check: (items) => {
      const rootFiles = items.filter((it) => it.parentId === null && it.type === 'file');
      return rootFiles.length === 0;
    }
  },
  {
    id: 'm25',
    category: 'Struktur Lengkap',
    categoryCode: 'mastery',
    title: 'Penguasaan Struktur Direktori Lengkap',
    instruction: 'Tuntaskan manajemen struktur dengan minimal memiliki 6 folder teratur dan minimal 8 berkas tersimpan di subfolder yang tepat.',
    points: 4,
    check: (items) => {
      const totalFolders = items.filter((it) => it.type === 'folder').length;
      const totalFiles = items.filter((it) => it.type === 'file').length;
      return totalFolders >= 6 && totalFiles >= 8;
    }
  }
];

/**
 * Evaluator 25 Misi
 */
export function evaluateAllMissions(items = []) {
  const checklist = MISSIONS_DEF.map((m) => {
    let passed = false;
    try {
      passed = m.check(items);
    } catch (e) {
      passed = false;
    }

    return {
      id: m.id,
      category: m.category,
      categoryCode: m.categoryCode,
      title: m.title,
      instruction: m.instruction,
      points: m.points,
      passed: Boolean(passed)
    };
  });

  const totalScore = checklist.reduce((acc, curr) => acc + (curr.passed ? curr.points : 0), 0);
  const passedCount = checklist.filter((c) => c.passed).length;
  const totalCount = checklist.length;
  const percentage = Math.round((passedCount / totalCount) * 100);

  return {
    checklist,
    totalScore,
    passedCount,
    totalCount,
    percentage
  };
}

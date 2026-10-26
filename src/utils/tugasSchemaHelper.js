/**
 * src/utils/tugasSchemaHelper.js
 * Utilitas resmi standarisasi format data kolom detail_jawaban (JSONB) v2.0 Ruang Spendaraja
 * Dokumentasi teknis lengkap: docs/tugas/STANDARISASI_FORMAT_DETAIL_JAWABAN.md
 */

export const CURRENT_DETAIL_SCHEMA_VERSION = '2.0';

/**
 * Factory untuk membangun objek detail_jawaban v2.0 yang terstandarisasi untuk Tugas 6 dan seterusnya.
 *
 * @param {Object} params
 * @param {string} params.kodeTugas - Kode identitas tugas (misal: "TUGAS-06-EXCEL")
 * @param {string} params.judulTugas - Judul lengkap tugas
 * @param {'multi_stage'|'single_task'|'kuis_murni'|'proyek_unggah'|'simulasi_interaktif'} [params.tipeTugas='multi_stage'] - Kategori jenis tugas
 * @param {number} [params.activeStage=1] - Tahap yang sedang aktif dibuka siswa
 * @param {number} [params.totalStages=1] - Total jumlah tahapan/misi
 * @param {number} [params.timeSpentSeconds=0] - Durasi pengerjaan aktif dalam detik
 * @param {number} [params.attemptCount=1] - Jumlah percobaan pengerjaan/submit
 * @param {number} [params.skorMaksimal=100] - Total skor maksimal tugas
 * @param {number} [params.skorDiperoleh=0] - Skor yang diperoleh saat ini
 * @param {number} [params.skorTertinggiDisimpan=0] - Skor tertinggi yang pernah tersimpan
 * @param {Array<{id: string, label: string, skor: number, skor_maks: number, status: 'lulus'|'sebagian'|'belum'|'perlu_revisi'}>} [params.breakdownSkor=[]] - Rincian skor seragam
 * @param {Object} [params.stagesData={}] - Rincian status & jawaban per tahap/misi
 * @param {Object|null} [params.berkasInfo=null] - Informasi berkas yang diunggah ke Cloudinary
 * @param {Object|null} [params.autoGrading=null] - Hasil evaluasi otomatis / auto-grading sistem
 * @param {Object} [params.customState={}] - State khusus/sandbox lokal simulator tugas
 * @param {boolean} [params.isCompleted=false] - Status apakah seluruh tahapan sudah tuntas
 * @returns {Object} Objek JSON terstandarisasi v2.0
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
    schema_version: CURRENT_DETAIL_SCHEMA_VERSION,
    tipe_tugas: tipeTugas,
    meta: {
      kode_tugas: kodeTugas || 'TUGAS-BARU',
      judul_tugas: judulTugas || '',
      active_stage: Number(activeStage) || 1,
      total_stages: Number(totalStages) || 1,
      time_spent_seconds: Math.max(0, Math.round(Number(timeSpentSeconds) || 0)),
      attempt_count: Math.max(1, Number(attemptCount) || 1),
      last_saved_at: new Date().toISOString(),
      is_completed: Boolean(isCompleted),
    },
    ringkasan_skor: {
      skor_maksimal: Number(skorMaksimal) || 100,
      skor_diperoleh: Number(skorDiperoleh) || 0,
      skor_tertinggi_disimpan: Math.max(Number(skorTertinggiDisimpan) || 0, Number(skorDiperoleh) || 0),
      breakdown: Array.isArray(breakdownSkor) ? breakdownSkor : [],
    },
    stages: stagesData && typeof stagesData === 'object' ? stagesData : {},
    berkas: berkasInfo || null,
    auto_grading: autoGrading || null,
    custom_state: customState && typeof customState === 'object' ? customState : {},
  };
}

/**
 * Parser aman yang otomatis mendeteksi apakah detail_jawaban merupakan format v2.0 atau Legacy (Tugas 1-5).
 *
 * @param {any} rawDetail - Nilai raw dari kolom detail_jawaban Supabase
 * @returns {{isLegacy: boolean, version: string, data: Object}}
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
    if (parsed.schema_version === CURRENT_DETAIL_SCHEMA_VERSION) {
      return {
        isLegacy: false,
        version: CURRENT_DETAIL_SCHEMA_VERSION,
        data: parsed,
      };
    }
  }

  // Jika tidak memiliki schema_version '2.0', otomatis ditandai sebagai Legacy (Tugas 1-5)
  return {
    isLegacy: true,
    version: 'legacy_v1',
    data: parsed || {},
  };
}

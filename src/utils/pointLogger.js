import { supabase } from '../lib/supabaseClient';

/**
 * Mengambil total_points siswa terkini dari master_siswa setelah trigger database berjalan.
 */
export async function syncStudentPointsAfterTask(siswaId) {
  if (!siswaId) return null;

  try {
    // Jeda sejenak agar trigger PostgreSQL tugas_pengumpulan -> point_logs -> master_siswa selesai
    await new Promise((res) => setTimeout(res, 200));

    const { data: siswaData } = await supabase
      .from('master_siswa')
      .select('total_points')
      .eq('id', siswaId)
      .maybeSingle();

    if (siswaData?.total_points !== undefined && siswaData?.total_points !== null) {
      return siswaData.total_points;
    }

    // Fallback kalkulasi manual jika trigger di database belum aktif
    const { data: allLogs } = await supabase
      .from('point_logs')
      .select('amount')
      .eq('siswa_id', siswaId);

    const calculatedTotal = (allLogs || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return calculatedTotal;
  } catch (err) {
    console.warn('Gagal sinkronisasi total_points siswa:', err);
    return null;
  }
}

// Alias kompatibilitas
export const recordTaskPointLog = async ({ siswaId }) => {
  return await syncStudentPointsAfterTask(siswaId);
};


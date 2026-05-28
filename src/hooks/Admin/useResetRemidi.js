import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Sesuaikan path projekmu

export const useResetRemidi = () => {
    const [pesertaList, setPesertaList] = useState([]);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [pesan, setPesan] = useState({ tipe: '', teks: '' });

    // 1. Ambil data peserta remidi beserta detail nama siswanya (Join Table)
    const ambilPesertaRemidi = async () => {
        setLoadingFetch(true);
        try {
            // Kita join ke tabel master_siswa untuk mengambil kolom NAMA dan Kelas
            const { data, error } = await supabase
                .from('remidi_peserta')
                .select(`
                    id,
                    status_ujian,
                    cheat_count,
                    master_siswa (
                        id,
                        NAMA,
                        Kelas
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPesertaList(data || []);
        } catch (error) {
            console.error('Gagal mengambil data peserta remidi:', error.message);
            setPesan({ tipe: 'error', teks: 'Gagal memuat daftar peserta remidi.' });
        } finally {
            setLoadingFetch(false);
        }
    };

    // 2. Fungsi eksekusi reset remidi terblokir
    const eksekusiResetRemidi = async (idPeserta, namaSiswa) => {
        if (!idPeserta) return false;

        setLoadingReset(true);
        setPesan({ tipe: '', teks: '' });

        try {
            // Menggunakan format interval PostgreSQL untuk waktu sekarang minus 30 menit
            // Menggunakan format interval PostgreSQL untuk waktu sekarang minus 10 menit
            const waktuMundur10Menit = new Date(Date.now() - 10 * 60 * 1000).toISOString();

            const { error } = await supabase
                .from('remidi_peserta')
                .update({
                    status_ujian: 'working',
                    waktu_mulai_kerja: waktuMundur10Menit, // 🛠️ Variabel baru masuk sini
                    cheat_count: 0
                })
                .eq('id', idPeserta);

            if (error) throw error;

            setPesan({
                tipe: 'success',
                teks: `Ujian remidi atas nama "${namaSiswa}" berhasil dipulihkan ke status 'working' & Cheat Count kembali 0.`
            });

            // Refresh daftar list setelah sukses update
            await ambilPesertaRemidi();
            return true;
        } catch (error) {
            console.error('Gagal memulihkan remidi:', error.message);
            setPesan({ tipe: 'error', teks: `Gagal memulihkan ujian: ${error.message}` });
            return false;
        } finally {
            setLoadingReset(false);
        }
    };

    useEffect(() => {
        ambilPesertaRemidi();
    }, []);

    return {
        pesertaList,
        loadingFetch,
        loadingReset,
        pesan,
        setPesan,
        eksekusiResetRemidi,
        refreshData: ambilPesertaRemidi
    };
};
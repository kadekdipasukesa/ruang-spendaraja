import { useState, useEffect } from 'react';
// Sesuaikan path import supabaseClient di projekmu
import { supabase } from '../../lib/supabaseClient'; 

export const useResetPassword = () => {
    const [siswaList, setSiswaList] = useState([]);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [pesan, setPesan] = useState({ tipe: '', teks: '' });

    // 1. Ambil data semua siswa untuk autocomplete pencarian
    const ambilSemuaSiswa = async () => {
        setLoadingFetch(true);
        try {
            const { data, error } = await supabase
                .from('master_siswa')
                .select('id, NAMA, Kelas, NISN')
                .order('Kelas', { ascending: true })
                .order('NAMA', { ascending: true });

            if (error) throw error;
            setSiswaList(data || []);
        } catch (error) {
            console.error('Gagal mengambil data siswa:', error.message);
            setPesan({ tipe: 'error', teks: 'Gagal memuat daftar siswa.' });
        } finally {
            setLoadingFetch(false);
        }
    };

    // 2. Fungsi eksekusi reset status registrasi siswa (is_registered -> false)
    const eksekusiResetPassword = async (idSiswa, namaSiswa) => {
        if (!idSiswa) {
            setPesan({ tipe: 'error', teks: 'Silakan pilih nama siswa terlebih dahulu!' });
            return false;
        }

        setLoadingReset(true);
        setPesan({ tipe: '', teks: '' });

        try {
            const { error } = await supabase
                .from('master_siswa')
                .update({ is_registered: false }) // 🛠️ HANYA MENGUBAH KOLOM INI JADI FALSE
                .eq('id', idSiswa);

            if (error) throw error;

            setPesan({ 
                tipe: 'success', 
                teks: `Status registrasi siswa bernama "${namaSiswa}" berhasil direset. Akun kini berstatus Belum Terregistrasi.` 
            });
            return true;
        } catch (error) {
            console.error('Gagal mereset status registrasi:', error.message);
            setPesan({ tipe: 'error', teks: `Gagal mereset status registrasi: ${error.message}` });
            return false;
        } finally {
            setLoadingReset(false);
        }
    };

    useEffect(() => {
        ambilSemuaSiswa();
    }, []);

    return {
        siswaList,
        loadingFetch,
        loadingReset,
        pesan,
        setPesan,
        eksekusiResetPassword,
        refreshData: ambilSemuaSiswa
    };
};
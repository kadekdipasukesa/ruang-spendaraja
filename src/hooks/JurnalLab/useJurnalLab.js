import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useJurnalLab(defaultLab = 'Lab TIK') {
    const [selectedLab, setSelectedLab] = useState(defaultLab);
    const [jurnalList, setJurnalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = localStorage.getItem('user_siswa');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    const fetchJurnal = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('jurnal_lab')
                .select(`
                    *,
                    pemohon:master_siswa!jurnal_lab_pemohon_id_fkey (NAMA, Kelas)
                `)
                .eq('nama_lab', selectedLab)
                .order('waktu_mulai', { ascending: false });

            if (error) throw error;
            setJurnalList(data || []);
        } catch (err) {
            console.error('Error fetching jurnal:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJurnal();

        // Realtime Subscription
        const channel = supabase
            .channel('realtime-jurnal-lab')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'jurnal_lab' },
                () => {
                    fetchJurnal();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedLab]);

    // Submit Pengajuan / Booking Baru
    const submitPengajuan = async (formData) => {
        try {
            const { error } = await supabase
                .from('jurnal_lab')
                .insert([{
                    nama_lab: selectedLab,
                    waktu_mulai: formData.waktu_mulai,
                    waktu_selesai: formData.waktu_selesai,
                    pemohon_id: user?.id || null,
                    guru_pengajar: formData.guru_pengajar,
                    mata_pelajaran: formData.mata_pelajaran,
                    kelas: formData.kelas,
                    jumlah_siswa: parseInt(formData.jumlah_siswa) || 0,
                    kategori_kegiatan: formData.kategori_kegiatan,
                    materi_kegiatan: formData.materi_kegiatan,
                    kondisi_awal: formData.kondisi_awal || 'Baik',
                    status_pengajuan: 'pending'
                }]);

            if (error) throw error;
            await fetchJurnal();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    // ACC atau Tolak Pengajuan (Admin/Guru)
    const handleApproval = async (id, status, alasan = '') => {
        try {
            const updatePayload = {
                status_pengajuan: status,
                acc_by: user?.NAMA || 'Admin',
                acc_at: new Date().toISOString()
            };

            if (status === 'rejected') {
                updatePayload.alasan_penolakan = alasan;
            }

            const { error } = await supabase
                .from('jurnal_lab')
                .update(updatePayload)
                .eq('id', id);

            if (error) throw error;
            await fetchJurnal();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    // Selesaikan Penggunaan Lab (Update Kondisi Akhir & Catatan Kendala)
    const handleComplete = async (id, dataSelesai) => {
        try {
            const { error } = await supabase
                .from('jurnal_lab')
                .update({
                    status_pengajuan: 'completed',
                    kondisi_akhir: dataSelesai.kondisi_akhir,
                    catatan_kendala: dataSelesai.catatan_kendala
                })
                .eq('id', id);

            if (error) throw error;
            await fetchJurnal();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    // ➕ FUNGSI HAPUS JURNAL
    const handleDelete = async (id) => {
        console.log("Menghapus jurnal dengan ID:", id);
        try {
            const { error } = await supabase
                .from('jurnal_lab')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchJurnal();
            return { success: true };
        } catch (err) {
            console.error('Gagal menghapus jurnal:', err.message);
            return { success: false, message: err.message };
        }
    };

    return {
        selectedLab,
        setSelectedLab,
        jurnalList,
        loading,
        user,
        role: user?.role || 'tamu',
        submitPengajuan,
        handleApproval,
        handleComplete,
        handleDelete, // <-- Wajib ada di sini!
        refreshData: fetchJurnal
    };
}
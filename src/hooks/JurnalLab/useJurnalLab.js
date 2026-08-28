import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useJurnalLab(defaultLab = 'LAB Komputer') {
    const [selectedLab, setSelectedLab] = useState(defaultLab);
    const [jurnalList, setJurnalList] = useState([]);
    const [pendingCountsPerLab, setPendingCountsPerLab] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Ambil session user dari LocalStorage
    useEffect(() => {
        const session = localStorage.getItem('user_siswa') || localStorage.getItem('user');
        if (session) {
            try {
                setUser(JSON.parse(session));
            } catch (e) {
                console.error("Gagal parse session user:", e);
            }
        }
    }, []);

    const fetchPendingCounts = async () => {
        try {
            const { data, error } = await supabase
                .from('jurnal_lab')
                .select('nama_lab')
                .eq('status_pengajuan', 'pending');

            if (!error && data) {
                const counts = {};
                data.forEach((row) => {
                    if (row.nama_lab) {
                        counts[row.nama_lab] = (counts[row.nama_lab] || 0) + 1;
                    }
                });
                setPendingCountsPerLab(counts);
            }
        } catch (e) {
            console.error('Error fetching pending counts:', e);
        }
    };

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
        fetchPendingCounts();

        // Realtime Subscription
        const channelId = `realtime_jurnal_lab_${Math.random().toString(36).substring(2, 7)}`;
        const channel = supabase
            .channel(channelId)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'jurnal_lab' },
                () => {
                    fetchJurnal();
                    fetchPendingCounts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedLab]);

    // 🔄 PERBAIKAN: Submit Pengajuan Baru ATAU Update Data Lama (Edit)
    const submitPengajuan = async (formData, isEdit = false) => {
        try {
            // Data yang dikirim ke database
            const payload = {
                nama_lab: formData.nama_lab || selectedLab,
                waktu_mulai: formData.waktu_mulai,
                waktu_selesai: formData.waktu_selesai,
                guru_pengajar: formData.guru_pengajar,
                mata_pelajaran: formData.mata_pelajaran,
                kelas: formData.kelas,
                jumlah_siswa: parseInt(formData.jumlah_siswa) || 0,
                kategori_kegiatan: formData.kategori_kegiatan,
                materi_kegiatan: formData.materi_kegiatan,
                kondisi_awal: formData.kondisi_awal || 'Baik'
            };

            // Validasi tabrakan jadwal langsung ke Supabase
            const { data: existingRows, error: checkError } = await supabase
                .from('jurnal_lab')
                .select('id, nama_lab, waktu_mulai, waktu_selesai, guru_pengajar, mata_pelajaran, status_pengajuan')
                .eq('nama_lab', payload.nama_lab)
                .neq('status_pengajuan', 'rejected');

            if (!checkError && existingRows && existingRows.length > 0) {
                const targetStart = new Date(payload.waktu_mulai).getTime();
                const targetEnd = new Date(payload.waktu_selesai).getTime();
                const targetDate = formData.tanggal;

                const conflict = existingRows.find(item => {
                    if (formData.id && String(item.id) === String(formData.id)) return false;
                    
                    // Cek tanggal yang sama (WITA)
                    const itemDateObj = new Date(item.waktu_mulai);
                    if (!isNaN(itemDateObj.getTime())) {
                        const itemDateStr = new Intl.DateTimeFormat('en-CA', {
                            timeZone: 'Asia/Makassar',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).format(itemDateObj);
                        if (itemDateStr !== targetDate) return false;
                    }

                    const itemStart = new Date(item.waktu_mulai).getTime();
                    const itemEnd = new Date(item.waktu_selesai).getTime();
                    return targetStart < itemEnd && targetEnd > itemStart;
                });

                if (conflict) {
                    return {
                        success: false,
                        message: `Jadwal bertabrakan dengan kegiatan "${conflict.mata_pelajaran || 'Kegiatan'}" oleh ${conflict.guru_pengajar}!`
                    };
                }
            }

            let error;

            if (isEdit || formData.id) {
                // ------------------------------------
                // 1. MODE EDIT -> Gunakan UPDATE berdasarkan ID
                // ------------------------------------
                const { error: updateError } = await supabase
                    .from('jurnal_lab')
                    .update(payload)
                    .eq('id', formData.id);

                error = updateError;
            } else {
                // ------------------------------------
                // 2. MODE BARU -> Gunakan INSERT
                // ------------------------------------
                const { error: insertError } = await supabase
                    .from('jurnal_lab')
                    .insert([{
                        ...payload,
                        pemohon_id: formData.pemohon_id || user?.id || null,
                        status_pengajuan: 'pending'
                    }]);

                error = insertError;
            }

            if (error) throw error;
            await fetchJurnal();
            return { success: true };
        } catch (err) {
            console.error('Error submit pengajuan:', err.message);
            return { success: false, message: err.message };
        }
    };

    // ACC atau Tolak Pengajuan (Hanya Admin / Pengurus Lab)
    const handleApproval = async (id, status, alasan = '', approverName = '') => {
        try {
            const updatePayload = {
                status_pengajuan: status,
                acc_by: approverName || user?.NAMA || 'Pengurus Lab',
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

    // Selesaikan Penggunaan Lab (Update Kondisi Awal, Kondisi Akhir & Catatan Kendala)
    const handleComplete = async (id, dataSelesai) => {
        try {
            const updatePayload = {
                status_pengajuan: 'completed',
                kondisi_akhir: dataSelesai.kondisi_akhir,
                catatan_kendala: dataSelesai.catatan_kendala
            };

            if (dataSelesai.kondisi_awal !== undefined) {
                updatePayload.kondisi_awal = dataSelesai.kondisi_awal;
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

    // FUNGSI HAPUS JURNAL
    const handleDelete = async (id) => {
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
        pendingCountsPerLab,
        loading,
        user,
        role: user?.role || 'tamu',
        role_2: user?.role_2 || null,
        isPengurusLab: user?.role === 'admin' || user?.role_2 === 'pengurus_lab',
        submitPengajuan,
        handleApproval,
        handleComplete,
        handleDelete,
        refreshData: fetchJurnal
    };
}
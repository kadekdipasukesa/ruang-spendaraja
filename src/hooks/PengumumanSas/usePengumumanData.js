import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const usePengumumanData = () => {
    const [user, setUser] = useState(null);
    const [nilaiSiswa, setNilaiSiswa] = useState(null);
    const [karyaTerbaik, setKaryaTerbaik] = useState([]);
    const [top10Sas, setTop10Sas] = useState([]);
    const [liveRemidi, setLiveRemidi] = useState([]); // ⚡ State baru untuk Live Hasil Remidi
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [searchResult, setSearchResult] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('user_siswa');
        if (savedData) {
            const parsedUser = JSON.parse(savedData);
            setUser(parsedUser);
            const namaAkun = parsedUser.nama || parsedUser.NAMA || parsedUser.nama_siswa;
            if (namaAkun) fetchNilaiOtomatis(namaAkun);
        }
        fetchDataDefault();

        // ⚡ Setup Realtime Subscription untuk tabel remidi_peserta
        const channel = supabase
            .channel('live_remidi_announcement')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'remidi_peserta' }, () => {
                fetchLiveRemidi();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchNilaiOtomatis = async (nama) => {
        try {
            const { data } = await supabase
                .from('hasil_sas_2026')
                .select('*')
                .ilike('nama_siswa', `%${nama}%`)
                .maybeSingle();
            if (data) setNilaiSiswa(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLiveRemidi = async () => {
        try {
            const { data } = await supabase
                .from('remidi_peserta')
                .select(`
                    id,
                    nilai_akhir,
                    status_ujian,
                    master_siswa (NAMA)
                `)
                .in('status_ujian', ['submitted', 'blocked'])
                .order('nilai_akhir', { ascending: false });
            if (data) setLiveRemidi(data);
        } catch (err) {
            console.error("Gagal memuat live remidi:", err);
        }
    };

    const fetchDataDefault = async () => {
        try {
            setLoading(true);
            
            // 1. Top 10 SAS
            const { data: sasData } = await supabase
                .from('hasil_sas_2026')
                .select('*')
                .order('nilai_sas', { ascending: false })
                .limit(10);
            if (sasData) setTop10Sas(sasData);

            // 2. 10 Video Terbaik
            const { data: scratchData } = await supabase
                .from('tugas_scratch_sas')
                .select('*')
                .eq('terpilih_terbaik', true)
                .limit(10);
            if (scratchData) setKaryaTerbaik(scratchData);

            // 3. Ambil data awal Live Remidi
            await fetchLiveRemidi();

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cariDataManual = async (keyword) => {
        if (!keyword.trim()) return setSearchResult([]);
        setSearching(true);
        try {
            const { data } = await supabase
                .from('hasil_sas_2026')
                .select('*')
                .or(`nama_siswa.ilike.%${keyword}%,kelas.ilike.%${keyword}%`)
                .order('nama_siswa', { ascending: true });
            setSearchResult(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setSearching(false);
        }
    };

    const kirimTugasScratch = async (linkUrl, kelasSiswa) => {
        if (!user) {
            alert("🔒 Akses Ditolak! Anda harus login terlebih dahulu di Ruang Spendaraja.");
            return false;
        }
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('tugas_scratch_sas')
                .insert([{
                    siswa_id: user.id || null,
                    nama_siswa: user.nama || user.NAMA,
                    kelas: kelasSiswa || '',
                    link_youtube: linkUrl
                }]);

            if (error) throw error;
            alert("🚀 Link video tugas Scratch berhasil dikirim!");
            return true;
        } catch (err) {
            alert("Gagal mengirim link tugas.");
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return { 
        user, nilaiSiswa, karyaTerbaik, top10Sas, liveRemidi, loading, submitting, 
        searchResult, searching, cariDataManual, kirimTugasScratch 
    };
};
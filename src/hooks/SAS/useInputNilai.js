import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const useInputNilai = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [mapel, setMapel] = useState('Informatika');

    // State untuk LJK (Inisialisasi awal objek kosong)
    const [jawabanPG, setJawabanPG] = useState({});
    const [jawabanEssay, setJawabanEssay] = useState({ "1": "", "2": "" });
    const [skorEssay, setSkorEssay] = useState({ "1": 0, "2": 0 });
    const [loading, setLoading] = useState(false);

    // Kunci Jawaban Dummy (Sesuaikan dengan kunci asli)
    const kunciPG = {
        "1": "D", "2": "A", "3": "A", "4": "B", "5": "C", "6": "B", "7": "C", "8": "A", "9": "A", "10": "D",
        "11": "C", "12": "C", "13": "B", "14": "D", "15": "B", "16": "C", "17": "C", "18": "C", "19": "C", "20": "C",
        "21": "B", "22": "A", "23": "C", "24": "A", "25": "C", "26": "A", "27": "A", "28": "B", "29": "B", "30": "C",
        "31": "D", "32": "B", "33": "C", "34": "B", "35": "C", "36": "A", "37": "B", "38": "A", "39": "C", "40": "D",
        "41": "B", "42": "A", "43": "A", "44": "A", "45": "B", "46": "C", "47": "B", "48": "B", "49": "B", "50": "B"
    };

    // Efek Pencarian Suggestion Siswa
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSiswa = async () => {
            const { data, error } = await supabase
                .from('master_siswa')
                .select('id, NAMA, Kelas, "No Absen"') // <--- Perhatikan tanda kutip ganda "" pada "No Absen"
                .ilike('NAMA', `%${searchQuery}%`)
                .limit(5);

            if (error) {
                console.error("Error fetch siswa:", error.message); // Biar kalau error lagi langsung ketahuan alasannya
                return;
            }

            if (data) setSuggestions(data);
        };

        const delayDebounce = setTimeout(fetchSiswa, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Inisialisasi awal 50 soal kosong saat siswa dipilih
    const selectSiswa = (siswa) => {
        setSelectedSiswa(siswa);
        setSearchQuery(siswa.NAMA);
        setSuggestions([]);
    
        const initPG = {};
        for (let i = 1; i <= 50; i++) {
            initPG[i.toString()] = ""; // ✅ Diubah menjadi string kosong ""
        }
        setJawabanPG(initPG);
    };

    // Hitung Skor PG Otomatis
    const hitungPG = () => {
        let benar = 0;
        const totalSoal = Object.keys(kunciPG).length;
        Object.keys(jawabanPG).forEach(no => {
            if (jawabanPG[no] === kunciPG[no]) benar++;
        });
        return { benar, total: totalSoal, nilai: (benar / totalSoal) * 100 };
    };

    const simpanKeSupabase = async () => {
        if (!selectedSiswa) return { success: false, message: "Siswa belum dipilih!" };
        setLoading(true);

        const skorPGCalc = hitungPG();
        // Hitung rata-rata nilai essay sederhana (Skor total / jumlah soal)
        const totalSkorEssay = Object.values(skorEssay).reduce((a, b) => Number(a) + Number(b), 0);
        const nilaiEssayCalc = totalSkorEssay / Object.keys(skorEssay).length;

        const { error } = await supabase
            .from('sas_2026')
            .upsert({
                siswa_id: selectedSiswa.id,
                mata_pelajaran: mapel,
                jawaban_pilihan_ganda: jawabanPG,
                jawaban_essay: jawabanEssay,
                skor_essay: skorEssay,
                nilai_pg: skorPGCalc.nilai,
                nilai_essay: nilaiEssayCalc
            }, { onConflict: 'siswa_id, mata_pelajaran' });

        setLoading(false);
        if (error) return { success: false, message: error.message };
        return { success: true, message: "Data SAS 2026 berhasil disimpan!" };
    };

    return {
        searchQuery, setSearchQuery, suggestions, selectedSiswa, setSelectedSiswa,
        mapel, setMapel, jawabanPG, setJawabanPG, jawabanEssay, setJawabanEssay,
        skorEssay, setSkorEssay, selectSiswa, hitungPG, simpanKeSupabase, loading
    };
};
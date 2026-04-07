import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    History, Trophy, FilePlus, HeartHandshake,
    ChevronRight, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Komponen Anak
import HeroPelanggaran from '../components/CatatanPelanggaran/HeroPelanggaran';
import LogPelanggaran from '../components/CatatanPelanggaran/LogPelanggaran';
import RekapSiswa from '../components/CatatanPelanggaran/RekapSiswa';
import FormPelanggaran from '../components/CatatanPelanggaran/FormPelanggaran';

const DAFTAR_PELANGGARAN = [
    { id: 1, jenis: "Datang terlambat", kategori: "RINGAN", skor: 1 },
    { id: 2, jenis: "Keluar kelas tanpa ijin", kategori: "RINGAN", skor: 1 },
    { id: 3, jenis: "Tidak melaksanakan piket kelas", kategori: "RINGAN", skor: 1 },
    { id: 4, jenis: "Berpakaian seragam tidak lengkap", kategori: "RINGAN", skor: 1 },
    { id: 5, jenis: "Makan di dalam kelas", kategori: "RINGAN", skor: 1 },
    { id: 6, jenis: "Membeli makanan di waktu pelajaran", kategori: "RINGAN", skor: 1 },
    { id: 7, jenis: "Membuang sampah tidak pada tempatnya", kategori: "RINGAN", skor: 1 },
    { id: 8, jenis: "Bermain di tempat parkir", kategori: "RINGAN", skor: 1 },
    { id: 9, jenis: "Berhias berlebihan", kategori: "RINGAN", skor: 1 },
    { id: 10, jenis: "Memakai asesoris berlebihan", kategori: "RINGAN", skor: 1 },
    { id: 11, jenis: "Tidak membawa buku saku", kategori: "RINGAN", skor: 1 },
    { id: 12, jenis: "Tas tidak sesuai aturan", kategori: "RINGAN", skor: 1 },
    { id: 13, jenis: "Rambut tidak sesuai aturan", kategori: "RINGAN", skor: 1 },
    { id: 14, jenis: "Berada di kantin saat jam pelajaran", kategori: "RINGAN", skor: 1 },
    { id: 15, jenis: "Berada di luar kelas saat pelajaran", kategori: "RINGAN", skor: 1 },
    { id: 16, jenis: "Sepatu tidak sesuai aturan", kategori: "RINGAN", skor: 1 },
    { id: 17, jenis: "Pakaian tidak sesuai aturan", kategori: "RINGAN", skor: 1 },
    { id: 18, jenis: "Atribut tidak lengkap", kategori: "RINGAN", skor: 1 },
    { id: 19, jenis: "Kaos kaki tidak sesuai aturan", kategori: "RINGAN", skor: 1 },
    { id: 20, jenis: "Membuat surat palsu", kategori: "SEDANG", skor: 2 },
    { id: 21, jenis: "Membolos", kategori: "SEDANG", skor: 2 },
    { id: 22, jenis: "Keluar sekolah tanpa ijin", kategori: "SEDANG", skor: 2 },
    { id: 23, jenis: "Meninggalkan sekolah tanpa ijin", kategori: "SEDANG", skor: 2 },
    { id: 24, jenis: "Membawa barang yang mengandung unsur pornografi", kategori: "SEDANG", skor: 2 },
    { id: 25, jenis: "Membawa barang yang mengandung unsur SARA", kategori: "SEDANG", skor: 2 },
    { id: 26, jenis: "Tidak ikut upacara bendera", kategori: "SEDANG", skor: 2 },
    { id: 27, jenis: "Mengganggu kelas lain", kategori: "SEDANG", skor: 2 },
    { id: 28, jenis: "Bersikap tidak sopan kepada Guru dan Pegawai", kategori: "SEDANG", skor: 2 },
    { id: 29, jenis: "Menentang Guru dan Pegawai", kategori: "SEDANG", skor: 2 },
    { id: 30, jenis: "Mencoret fasilitas sekolah", kategori: "SEDANG", skor: 2 },
    { id: 31, jenis: "Membawa hp tanpa ijin guru", kategori: "SEDANG", skor: 2 },
    { id: 32, jenis: "Membawa minuman keras", kategori: "BERAT", skor: 3 },
    { id: 33, jenis: "Berkelahi", kategori: "BERAT", skor: 3 },
    { id: 34, jenis: "Merusak fasilitas sekolah secara sengaja", kategori: "BERAT", skor: 3 },
    { id: 35, jenis: "Mencuri", kategori: "BERAT", skor: 3 },
    { id: 36, jenis: "Menyebarkan berita bohong/ hoax", kategori: "BERAT", skor: 3 },
    { id: 37, jenis: "Berurusan dengan pihak berwajib", kategori: "BERAT", skor: 3 },
    { id: 38, jenis: "Membawa senjata tajam tanpa ijin guru", kategori: "BERAT", skor: 3 },
    { id: 39, jenis: "Mengikuti organisasi terlarang", kategori: "BERAT", skor: 3 },
    { id: 40, jenis: "Terlibat penyalahgunaan NAPZA", kategori: "BERAT", skor: 3 },
    { id: 41, jenis: "Menikah", kategori: "BERAT", skor: 3 },
    { id: 42, jenis: "Membawa rokok (elektrik maupun konvensional)", kategori: "BERAT", skor: 3 },
    { id: 43, jenis: "Membully", kategori: "BERAT", skor: 3 },
    { id: 44, jenis: "Melakukan pelecehan seksual", kategori: "BERAT", skor: 4 }
  ];

export default function PelanggaranPage() {
    const [activeMenu, setActiveMenu] = useState(1); // Default ke Menu 1
    const [user, setUser] = useState(null);
    const [logData, setLogData] = useState([]);
    const [rekapSiswa, setRekapSiswa] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('user_siswa');
        if (session) setUser(JSON.parse(session));
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // 1. Ambil Log Pelanggaran (Gunakan 'tanggal' dan alias pelapor)
            const { data: logs, error: logError } = await supabase
                .from('log_pelanggaran_siswa')
                .select(`
                    *,
                    master_siswa!log_pelanggaran_siswa_siswa_id_fkey (NAMA, Kelas),
                    pelapor:master_siswa!log_pelanggaran_siswa_pelapor_id_fkey (NAMA)
                `)
                .order('tanggal', { ascending: false });
    
            // 2. Ambil Rekap Siswa (Pastikan kolom total_pelanggaran sesuai)
            // Kita coba hilangkan dulu .gt(0) untuk memastikan data masuk atau tidak
            const { data: rekap, error: rekapError } = await supabase
                .from('master_siswa')
                .select('id, NAMA, Kelas, total_pelanggaran') // Sebutkan kolom secara spesifik
                .order('total_pelanggaran', { ascending: false })
                .limit(10); // Ambil 10 besar saja
    
            if (logError) console.error("Error Log:", logError.message);
            if (rekapError) console.error("Error Rekap:", rekapError.message);
    
            // Filter manual di sini supaya lebih aman didebug
            const siswaMelanggar = rekap ? rekap.filter(s => s.total_pelanggaran > 0) : [];
    
            setLogData(logs || []);
            setRekapSiswa(siswaMelanggar);
    
            // DEBUG: Cek di console browser (F12)
            console.log("Data Rekap Ter-load:", rekap);
            console.log("Data Rekap Melanggar:", siswaMelanggar);
    
        } catch (err) {
            console.error("Sistem Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async ({ selectedSiswa, pelanggaran, catatan, type }) => {
        setLoading(true);
        try {
            // 1. Ambil Session Pelapor (Siswa/Admin yang sedang login)
            const session = JSON.parse(localStorage.getItem('user_siswa'));
            const pelaporId = session?.id;
    
            // 2. Tentukan Poin (Pelanggaran positif, Pengabdian negatif)
let poinAksi = 0;
let jenisFinal = pelanggaran;

if (type === 'pelanggaran') {
    const p = DAFTAR_PELANGGARAN.find(item => item.jenis === pelanggaran);
    poinAksi = p ? p.skor : 0;
} else {
    // UBAH BARIS INI: 
    // Ambil total poin siswa saat ini dan jadikan MINUS agar hasil akhirnya 0
    // Kita gunakan data dari selectedSiswa yang dikirim oleh Form
    poinAksi = -(selectedSiswa.total_pelanggaran || 0); 
    
    // jenisFinal otomatis mengikuti teks "PENGABDIAN SEMINGGU" dll dari Form
    jenisFinal = pelanggaran; 
}
    
            // 3. INSERT KE LOG (Wajib pakai AWAIT dan tangkap ERROR)
            const { error: insertError } = await supabase
                .from('log_pelanggaran_siswa')
                .insert([{ 
                    siswa_id: selectedSiswa.id, 
                    jenis_pelanggaran: jenisFinal, 
                    poin_pelanggaran: poinAksi, 
                    catatan: catatan || "",
                    pelapor_id: pelaporId || null,
                    tanggal: new Date().toISOString()
                }]);
    
            if (insertError) {
                // Jika masuk sini, berarti Supabase menolak (RLS atau Kolom Salah)
                throw new Error(`Gagal Simpan Log: ${insertError.message}`);
            }
    
            // 4. UPDATE TOTAL POIN SISWA
            const poinLama = selectedSiswa.total_pelanggaran || 0;
            const poinBaru = Math.max(0, poinLama + poinAksi);
    
            const { error: updateError } = await supabase
                .from('master_siswa')
                .update({ total_pelanggaran: poinBaru })
                .eq('id', selectedSiswa.id);
    
            if (updateError) {
                throw new Error(`Gagal Update Poin Siswa: ${updateError.message}`);
            }
    
            // 5. JIKA SEMUA LOLOS, BARU MUNCUL ALERT
            alert("✅ DATA BERHASIL DICATAT KE DATABASE!");
            
            // Sinkronkan ulang data di layar
            await fetchInitialData(); 
            setActiveMenu(1); // Balik ke tab riwayat
    
        } catch (err) {
            // Jika ada masalah di tengah jalan, alert akan memberitahu alasannya
            console.error("ERROR SISTEM:", err);
            alert("❌ DATABASE ERROR: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const role = user?.role || 'tamu';

    // Definisi Menu & Hak Akses
    const menus = [
        { id: 1, label: "Catatan Pelanggaran", icon: <History size={18} />, roles: ['tamu', 'osis', 'admin', 'guru_osis'] },
        { id: 2, label: "Daftar Siswa", icon: <Trophy size={18} />, roles: ['tamu', 'osis', 'admin', 'guru_osis'] },
        { id: 3, label: "Input Catatan", icon: <FilePlus size={18} />, roles: ['osis', 'admin', 'guru_osis'] },
        { id: 4, label: "Input Pengabdian", icon: <HeartHandshake size={18} />, roles: ['admin', 'guru_osis'] },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] pb-24 text-slate-200">
            <HeroPelanggaran role={role} />

            <div className="container mx-auto px-4 -mt-16 relative z-30 max-w-6xl">

                {/* --- NAVIGATION TABS (SCROLLABLE & CENTERED) --- */}
                <div className="flex justify-center w-full mb-10 px-2">
                    <div className="flex overflow-x-auto no-scrollbar gap-3 p-2 bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/5 max-w-full sm:max-w-max shadow-2xl">
                        {menus.map((m) => (
                            m.roles.includes(role) && (
                                <button
                                    key={m.id}
                                    onClick={() => setActiveMenu(m.id)}
                                    className={`
            flex items-center gap-2 px-5 py-3 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all duration-300 whitespace-nowrap shrink-0
            ${activeMenu === m.id
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 scale-105'
                                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                        }
          `}
                                >
                                    <span className={`${activeMenu === m.id ? 'animate-bounce' : ''}`}>
                                        {m.icon}
                                    </span>
                                    {m.label}
                                </button>
                            )
                        ))}
                    </div>
                </div>

                {/* --- CSS KHUSUS UNTUK SEMBUNYIKAN SCROLLBAR (Opsional di index.css) --- */}
                <style>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>

                {/* --- KONTEN DINAMIS --- */}
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeMenu}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeMenu === 1 && <LogPelanggaran data={logData} />}

                            {activeMenu === 2 && <RekapSiswa data={rekapSiswa} />}

                            {activeMenu === 3 && (
                                <FormPelanggaran
                                    type="pelanggaran"
                                    canAccess={true}
                                    onSubmit={handleFormSubmit}
                                    loading={loading}
                                    daftarPelanggaran={DAFTAR_PELANGGARAN}
                                />
                            )}

                            {activeMenu === 4 && (
                                <FormPelanggaran
                                    type="pengabdian"
                                    canAccess={true}
                                    onSubmit={handleFormSubmit}
                                    loading={loading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

            {/* --- FOOTER INFO (Dinamis sesuai Menu) --- */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0f172a]/80 backdrop-blur-md border-t border-white/5 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                        <LayoutDashboard size={14} />
                        Status: <span className="text-blue-400">{role}</span>
                    </div>
                    <p className="text-[10px] italic text-slate-500 hidden md:block">
                        Klik menu di atas untuk berpindah halaman
                    </p>
                </div>
            </div>
        </div>
    );
}
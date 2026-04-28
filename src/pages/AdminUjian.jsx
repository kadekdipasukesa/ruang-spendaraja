import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import StatistikSiswa from '../components/Ulangan/StatistikSiswa';
import SesiCard from '../components/Ulangan/SesiCard';
import { Plus, StopCircle, Clock } from 'lucide-react'; // Tambah Clock icon
import { SOAL_POOL, hitungNilaiSiswa } from '../utils/soalUlanganPool';

export default function AdminUjian() {
  const [sesi, setSesi] = useState(null);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // State Jam
  const navigate = useNavigate();

  // --- LOGIKA JAM BERJALAN ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_siswa'));
    // Catatan: Admin biasanya punya role 'admin', pastikan di localstorage sudah benar
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      setIsAuthorized(true);
      fetchSesiAktif();
    }
  }, [navigate]);

  // Realtime Monitoring
  useEffect(() => {
    if (!sesi?.id) return;
    const channel = supabase
      .channel('admin_monitor')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ujian_peserta',
        filter: `sesi_id=eq.${sesi.id}`
      }, () => fetchPeserta(sesi.id))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sesi?.id]);

  const fetchSesiAktif = async () => {
    const { data } = await supabase
      .from('ujian_sesi')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data) {
      setSesi(data);
      fetchPeserta(data.id);
    }
  };

  const fetchPeserta = async (sesiId) => {
    const { data } = await supabase
      .from('ujian_peserta')
      .select('*, master_siswa(NAMA)')
      .eq('sesi_id', sesiId);
    if (data) setPeserta(data);
  };

  const handleBuatUjian = async () => {
    const durasi = prompt("Masukkan durasi ujian (menit):", "60");
    if (!durasi) return;

    const newPin = Math.random().toString(36).substring(2, 7).toUpperCase();
    const { data } = await supabase
      .from('ujian_sesi')
      .insert([{
        pin_ujian: newPin,
        status: 'waiting',
        judul: 'Ulangan Informatika',
        durasi_menit: parseInt(durasi)
      }])
      .select().single();

    setSesi(data);
    setPeserta([]);
  };

  const handleStartExam = async () => {
    setLoading(true);
    await supabase.from('ujian_sesi').update({ status: 'starting' }).eq('id', sesi.id);

    setTimeout(async () => {
      await supabase.from('ujian_sesi').update({ status: 'ongoing' }).eq('id', sesi.id);
      setSesi(prev => ({ ...prev, status: 'ongoing' }));
      setLoading(false);
    }, 4500);
  };

  const handleEndExam = async () => {
    if (!sesi || sesi.status === 'finished') return; // Validasi tambahan

    const yakin = window.confirm("Akhiri ujian sekarang? Nilai siswa akan langsung dihitung otomatis.");

    if (yakin) {
      await supabase.from('ujian_sesi').update({ status: 'finished' }).eq('id', sesi.id);
      await forceSubmitAll(sesi.id);

      await supabase
        .from('ujian_peserta')
        .update({ status_ujian: 'submitted', nilai_akhir: 0 })
        .eq('sesi_id', sesi.id)
        .in('status_ujian', ['ready', 'ongoing']);

      fetchPeserta(sesi.id);
      setSesi(prev => ({ ...prev, status: 'finished' }));
      alert("Sesi Berhasil Diakhiri & Nilai Telah Dihitung.");
    }
  };

  const forceSubmitAll = async (sesiId) => {
    const { data: listJawaban, error } = await supabase
      .from('ujian_jawaban')
      .select('peserta_id, jawaban_map, ujian_peserta!inner(sesi_id)')
      .eq('ujian_peserta.sesi_id', sesiId);

    if (error || !listJawaban) return;

    const updates = listJawaban.map((item) => {
      const skor = hitungNilaiSiswa(item.jawaban_map, SOAL_POOL);
      return supabase
        .from('ujian_peserta')
        .update({
          nilai_akhir: skor,
          status_ujian: 'submitted'
        })
        .eq('id', item.peserta_id);
    });

    await Promise.all(updates);
    fetchPeserta(sesiId);
  };

  const handleKalkulasiPoin = async () => {
    if (sesi.status !== 'finished') return alert("Sesi harus berstatus 'finished'!");

    const yakin = window.confirm("Kalkulasi poin sekarang? Sistem akan mengambil (Skor * 1) + Poin Tambahan untuk dikirim ke Master Siswa.");
    if (!yakin) return;

    setLoading(true);
    try {
        // 1. Map data dengan proteksi Tipe Data (Number)
        const dataLogSiapKirim = peserta.map(p => {
            // Pastikan semua menjadi angka dengan Number() atau parseInt()
            const skor = Number(p.nilai_akhir) || 0;
            const poinTambahan = Number(p.total_poin_didapat) || 0;
            const totalFinal = (skor * 1) + poinTambahan; 

            return {
                siswa_id: p.siswa_id,
                amount: totalFinal, // Harus integer
                activity_type: 'Ulangan',
                description: `Poin Ulangan: ${sesi.judul} (Skor: ${skor})`
            };
        }).filter(log => log.amount > 0); 

        if (dataLogSiapKirim.length === 0) {
            alert("Tidak ada poin untuk disinkronkan (semua skor 0).");
            setLoading(false);
            return;
        }

        console.log("Data yang akan dikirim:", dataLogSiapKirim); // Cek di console log

        // 2. Insert ke point_logs
        const { error: logError } = await supabase
            .from('point_logs')
            .insert(dataLogSiapKirim);

        if (logError) throw logError;

        // 3. Update status sesi ke 'archived'
        const { error: sesiError } = await supabase
            .from('ujian_sesi')
            .update({ status: 'archived' })
            .eq('id', sesi.id);

        if (sesiError) throw sesiError;

        alert("Kalkulasi Berhasil! Poin telah masuk ke Master Siswa.");
        
        // Refresh state lokal
        setSesi(prev => ({ ...prev, status: 'archived' }));
        if (fetchPeserta) fetchPeserta(sesi.id);
        
    } catch (err) {
      console.error("Detail Error:", err);
      alert("Gagal kalkulasi: " + (err.message || "Terjadi kesalahan sistem"));
    } finally {
      setLoading(false);
    }
};

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">ADMIN UJIAN</h1>
            <p className="text-slate-500">Monitoring & Control Sesi Ulangan</p>
          </div>

          <div className="flex items-center gap-4">
            {/* --- JAM DIGITAL --- */}
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <Clock size={20} className="text-blue-400" />
              <span className="font-mono text-xl font-black text-white">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <button onClick={handleBuatUjian} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all">
              <Plus size={20} /> BUAT SESI BARU
            </button>
          </div>
        </header>

        {!sesi ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-slate-500">Belum ada sesi ujian aktif.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <SesiCard
                sesi={sesi}
                pesertaCount={peserta.length}
                loading={loading}
                onStart={handleStartExam}
                onEnd={handleEndExam}
              />

              <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem]">
                <h4 className="text-red-500 font-bold text-sm mb-2">Danger Zone</h4>
                <button
                  onClick={handleEndExam}
                  // --- DISABLE BUTTON JIKA FINISHED ---
                  disabled={sesi.status === 'finished'}
                  className={`w-full text-left text-xs font-bold flex items-center gap-2 transition-colors ${sesi.status === 'finished'
                    ? 'opacity-20 cursor-not-allowed text-slate-500'
                    : 'text-red-500/60 hover:text-red-500'
                    }`}
                >
                  <StopCircle size={14} />
                  {sesi.status === 'finished' ? 'SESI TELAH BERAKHIR' : 'AKHIRI SESI PAKSA'}
                </button>
              </div>
            </div>

            {/* Muncul hanya jika sesi selesai */}
            {sesi.status === 'finished' && (
              <div className="mt-4 p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem]">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-blue-400 font-bold">Sinkronisasi Poin</h4>
                    <p className="text-xs text-slate-400">Kirim poin peserta ke Master Siswa via Point Logs.</p>
                  </div>
                  <button
                    onClick={handleKalkulasiPoin}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black transition-all flex items-center gap-2"
                  >
                    {loading ? 'PROSES...' : 'KALKULASI POIN'}
                  </button>
                </div>
              </div>
            )}

            <div className="lg:col-span-2">
              <StatistikSiswa
                peserta={peserta}
                statusSesi={sesi?.status} // Kirim status sesi (ongoing/finished/waiting)
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
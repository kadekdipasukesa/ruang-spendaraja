import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import StatistikSiswa from '../components/Ulangan/StatistikSiswa';
import SesiCard from '../components/Ulangan/SesiCard'; // Import komponen baru
import { Plus, StopCircle } from 'lucide-react';
import { SOAL_POOL, hitungNilaiSiswa } from '../utils/soalUlanganPool';

export default function AdminUjian() {
  const [sesi, setSesi] = useState(null);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_siswa'));
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      setIsAuthorized(true);
      fetchSesiAktif();
    }
  }, []);

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
      .select('*, master_siswa(NAMA)') // Gunakan NAMA (Kapital)
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
    if (!sesi) return;
  
    const yakin = window.confirm("Akhiri ujian sekarang? Nilai siswa akan langsung dihitung otomatis.");
  
    if (yakin) {
      // 1. Matikan sesi di tabel utama
      await supabase.from('ujian_sesi').update({ status: 'finished' }).eq('id', sesi.id);
  
      // 2. Hitung yang ada jawabannya
      await forceSubmitAll(sesi.id);
  
      // 3. Sapu bersih yang tidak ada jawabannya (masih status ready/ongoing)
      // Gunakan .in untuk mencakup status 'ready' dan 'ongoing' sekaligus
      await supabase
        .from('ujian_peserta')
        .update({ status_ujian: 'submitted', nilai_akhir: 0 })
        .eq('sesi_id', sesi.id)
        .in('status_ujian', ['ready', 'ongoing']);
  
      // 4. Refresh data lokal agar StatistikSiswa berubah
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
      // Gunakan fungsi yang diimport dari utils
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

    // PENTING: Refresh data peserta agar komponen StatistikSiswa terupdate
    fetchPeserta(sesiId);
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">ADMIN UJIAN</h1>
            <p className="text-slate-500">Monitoring & Control Sesi Ulangan</p>
          </div>
          <button onClick={handleBuatUjian} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all">
            <Plus size={20} /> BUAT SESI BARU
          </button>
        </header>

        {!sesi ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-slate-500">Belum ada sesi ujian aktif.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">

              {/* Komponen Sesi Card yang kita pisah tadi */}
              <SesiCard
                sesi={sesi}
                pesertaCount={peserta.length}
                loading={loading}
                onStart={handleStartExam}
              />

              <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem]">
                <h4 className="text-red-500 font-bold text-sm mb-2">Danger Zone</h4>
                <button
                  onClick={handleEndExam}
                  className="w-full text-left text-xs font-bold text-red-500/60 hover:text-red-500 flex items-center gap-2 transition-colors"
                >
                  <StopCircle size={14} /> AKHIRI SESI PAKSA
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <StatistikSiswa peserta={peserta} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
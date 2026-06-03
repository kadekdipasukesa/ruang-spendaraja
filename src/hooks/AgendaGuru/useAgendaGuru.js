import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function useAgendaGuru() {
  const [loading, setLoading] = useState(false);
  const [agendaList, setAgendaList] = useState([]);
  const [siswaKelas, setSiswaKelas] = useState([]);

  // 1. Ambil riwayat agenda berdasarkan Guru / Global
  const fetchAgenda = useCallback(async (kelasFilter = '') => {
    setLoading(true);
    try {
      let query = supabase
        .from('agenda_guru')
        .select(`
          *,
          absen_agenda_siswa(*)
        `)
        .order('tanggal', { ascending: false })
        .order('created_at', { ascending: false });

      if (kelasFilter) {
        query = query.eq('kelas', kelasFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAgendaList(data || []);
    } catch (err) {
      console.error('Error fetching agenda:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Ambil daftar siswa berdasarkan kelas untuk keperluan input absen singkat
  const fetchSiswaByKelas = useCallback(async (kelas) => {
    if (!kelas) return;
    try {
      const { data, error } = await supabase
        .from('master_siswa') // Sesuaikan nama tabel master siswa kamu
        .select('*')
        .eq('Kelas', kelas)
        .order('NAMA', { ascending: true });

      if (error) throw error;
      setSiswaKelas(data || []);
    } catch (err) {
      console.error('Error fetching siswa:', err.message);
    }
  }, []);

  // 3. Simpan Agenda Baru + Detail Absen Siswa
  const simpanAgenda = async (agendaData, dataAbsenSiswa) => {
    setLoading(true);
    try {
      // Insert ke tabel utama
      const { data: agendaBaru, error: errorAgenda } = await supabase
        .from('agenda_guru')
        .insert([agendaData])
        .select()
        .single();

      if (errorAgenda) throw errorAgenda;

      // Jika ada siswa yang absen (Sakit/Izin/Alpha), masukkan ke tabel detail
      if (dataAbsenSiswa.length > 0 && agendaBaru) {
        const payloadAbsen = dataAbsenSiswa.map(absen => ({
          agenda_id: agendaBaru.id,
          siswa_id: absen.siswa_id,
          nama_siswa: absen.nama_siswa,
          status_absen: absen.status_absen
        }));

        const { error: errorAbsen } = await supabase
          .from('absen_agenda_siswa')
          .insert(payloadAbsen);

        if (errorAbsen) throw errorAbsen;
      }

      return { success: true };
    } catch (err) {
      console.error('Error saving agenda:', err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    agendaList,
    siswaKelas,
    fetchAgenda,
    fetchSiswaByKelas,
    simpanAgenda
  };
}
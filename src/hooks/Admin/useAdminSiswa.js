import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Papa from 'papaparse';

export const normalizeName = (name) => {
  if (!name) return '';
  return name.toString().trim().toLowerCase().replace(/\s+/g, ' ');
};

export default function useAdminSiswa() {
  const [loading, setLoading] = useState(false);
  const [listSiswa, setListSiswa] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Fetch SELURUH data siswa dari Supabase
  const fetchAllSiswa = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let allData = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('master_siswa')
          .select('*')
          .order('NAMA', { ascending: true })
          .range(from, from + step - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          from += step;
          if (data.length < step) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      setListSiswa(allData);
    } catch (err) {
      console.error('Error fetching all siswa:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Parse CSV & Match Data (Support Update NISN Buatan -> NISN Resmi)
  const processCSV = (file) => {
    setLoading(true);
    setErrorMsg(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const rawRows = results.data;
        
        const dbList = listSiswa.map((item) => ({
          ...item,
          cleanName: normalizeName(item.NAMA),
          cleanNISN: item.NISN ? item.NISN.toString().trim() : '',
        }));

        const matchedDbIds = new Set();

        const analyzed = rawRows.map((row, idx) => {
          const rawNama = row.NAMA || row.nama || row['Nama Lengkap'] || '';
          const rawNISN = row.NISN || row.nisn || '';
          const rawKelas = row.Kelas || row.kelas || row.KELAS || '';
          const rawNoAbsen = row['No Absen'] || row.no_absen || row['No. Absen'] || null;
          const rawGender = row.Gender || row.gender || row.JK || null;
          const rawAgama = row.Agama || row.agama || null;
          const rawRole = row.Role || row.role || 'siswa';

          const cleanNamaInput = normalizeName(rawNama);
          const cleanNISNInput = rawNISN ? rawNISN.toString().trim() : '';
          const targetKelas = rawKelas.toString().trim();
          const targetRole = rawRole.toString().trim().toLowerCase();

          if (!rawNama) {
            return {
              id: `err-${idx}`,
              type: 'ERROR',
              reason: 'Nama siswa kosong di file CSV',
              data: row,
            };
          }

          let match = null;

          // 🔹 STRATEGI A: Match berdasarkan NISN (Jika NISN di CSV & DB sudah sama)
          if (cleanNISNInput) {
            match = dbList.find(
              (db) => !matchedDbIds.has(db.id) && db.cleanNISN === cleanNISNInput
            );
          }

          // 🔹 STRATEGI B: Jika NISN beda/NISN lama buatan, Match berdasarkan NAMA
          if (!match && cleanNamaInput) {
            match = dbList.find(
              (db) => !matchedDbIds.has(db.id) && db.cleanName === cleanNamaInput
            );
          }

          if (match) {
            matchedDbIds.add(match.id);

            const isAlumni = targetKelas.toLowerCase().includes('alumni');
            const isNisnChanged = match.cleanNISN !== cleanNISNInput && cleanNISNInput !== '';

            return {
              id: match.id,
              type: isAlumni ? 'ALUMNI' : match.Kelas !== targetKelas ? 'PINDAH_KELAS' : 'SAMA',
              action: 'UPDATE',
              oldKelas: match.Kelas || '-',
              newKelas: targetKelas,
              nisnNote: isNisnChanged ? `NISN Diperbarui: ${match.cleanNISN} ➔ ${cleanNISNInput}` : null,
              payload: {
                id: match.id,
                NAMA: rawNama.trim(),
                NISN: cleanNISNInput || match.NISN, // UPDATE NISN ke yang baru/resmi!
                Kelas: targetKelas,                  // UPDATE Kelas ke yang baru!
                "No Absen": rawNoAbsen ? parseInt(rawNoAbsen) : match['No Absen'],
                Gender: rawGender || match.Gender,
                Agama: rawAgama || match.Agama,
                role: targetRole || match.role || 'siswa',
              },
            };
          } else {
            // Siswa Baru jika nama & NISN benar-benar tidak ditemukan
            return {
              id: `new-${idx}`,
              type: 'BARU',
              action: 'INSERT',
              oldKelas: '-',
              newKelas: targetKelas,
              payload: {
                NAMA: rawNama.trim(),
                NISN: cleanNISNInput || `TEMP-${Date.now()}-${idx}`,
                Kelas: targetKelas,
                "No Absen": rawNoAbsen ? parseInt(rawNoAbsen) : null,
                Gender: rawGender,
                Agama: rawAgama,
                role: targetRole || 'siswa',
              },
            };
          }
        });

        setPreviewData(analyzed);
        setLoading(false);
      },
      error: (err) => {
        setErrorMsg(`Gagal membaca file CSV: ${err.message}`);
        setLoading(false);
      },
    });
  };

  // 3. Simpan Perubahan Per-Baris
  const commitBatchChanges = async () => {
    if (previewData.length === 0) return { success: false, message: 'Tidak ada data preview!' };

    setLoading(true);
    let successInsert = 0;
    let successUpdate = 0;
    let failedCount = 0;

    try {
      const inserts = previewData
        .filter((item) => item.action === 'INSERT' && item.type !== 'ERROR')
        .map((item) => item.payload);

      const updates = previewData
        .filter((item) => item.action === 'UPDATE' && item.type !== 'ERROR')
        .map((item) => item.payload);

      // A. Update data siswa (Update NISN & Kelas sekaligus)
      for (const item of updates) {
        const { id, ...updateFields } = item;
        const { error: updateErr } = await supabase
          .from('master_siswa')
          .update(updateFields)
          .eq('id', id);

        if (updateErr) {
          console.error(`Gagal update ID ${id} (${item.NAMA}):`, updateErr);
          failedCount++;
        } else {
          successUpdate++;
        }
      }

      // B. Insert data siswa baru
      for (const item of inserts) {
        const { error: insertErr } = await supabase
          .from('master_siswa')
          .insert([item]);

        if (insertErr) {
          console.error(`Gagal insert (${item.NAMA}):`, insertErr);
          failedCount++;
        } else {
          successInsert++;
        }
      }

      await fetchAllSiswa();
      setPreviewData([]);

      return {
        success: true,
        message: `Selesai diproses!\n- Berhasil Update (NISN & Kelas): ${successUpdate}\n- Berhasil Tambah Baru: ${successInsert}${failedCount > 0 ? `\n- Gagal: ${failedCount}` : ''}`,
      };
    } catch (err) {
      console.error('Commit error:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    listSiswa,
    previewData,
    errorMsg,
    setPreviewData,
    fetchAllSiswa,
    processCSV,
    commitBatchChanges,
  };
}
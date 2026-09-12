/* eslint-env node */
/* global process */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL atau Key tidak ditemukan di process.env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rawCsvData = `No.,Nama,Kelas,No. Absen,Gender,Post Test Seleksi,Waktu Pendaftaran,24/7/2026,31/7/2026,14/8/2026,21/8/2026,28/8/2026,4/9/2026,11/9/2026
7,Desak Nyoman Pradnya Paramita,7.1,5,perempuan,Karena saya ingin mengasah kemampuan di bidang informatika,23/07/2026 21:42:32,Hadir,Hadir,,Hadir,,Hadir,Hadir
9,DESAK PUTU GELSEY SENINTYA,7.1,6,Perempuan,Karena ingin mempelajari teknologi lebih dalam,24/07/2026 8:34:33,Hadir,,Hadir,Hadir,Hadir,Hadir,Hadir
5,Gede Apriliawan Sandiartha,7.1,7,Laki-laki,Karena saya ingin belajar dan mengenal tentang teknologi dan pemograman di bidang komputer dan informatika,23/07/2026 21:29:39,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
3,GEDE BISMA RESTIKA UDAYANA,7.1,8,Laki-Laki,Untuk belajar tentang komputer lebih dalam,23/07/2026 21:27:36,Hadir,Hadir,,Hadir,Hadir,Hadir,Hadir
34,Gede Eldrian Prasetya Wiguna,7.1,9,,Saya ingin masuk exra tik karena saya tertarik dengan pelajaran ini,30/07/2026 22:12:49,,,Hadir,Hadir,Hadir,Hadir,Hadir
41,Gede Putra Utama,7.1,10,,karena aku suka komputer,14/08/2026 11:41:18,,,Hadir,Hadir,Hadir,Hadir,Hadir
1,I Gede Defan Narendra,7.1,13,laki-laki,Karena seru dan juga tertarik pada komputer,23/07/2026 21:26:12,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
2,Kadek Aditya Pramana,7.1,17,laki-laki,Saya ingin belajar tentang komputer secara mendalam ,23/07/2026 21:26:53,Hadir,,Hadir,Hadir,Hadir,Hadir,Hadir
16,Putu Shiva Wulan Ariani,7.1,29,Perempuan,Karna saya berminat untuk mengikuti ekstra TIK Dan untuk menambah wawasan  saya,25/07/2026 19:23:37,,,Hadir,Hadir,Hadir,Hadir,Hadir
19,Putu Wira Bagus Suputra,7.1,31,laki-laki,Karna ingin mendalami teknologi.,26/07/2026 19:50:45,,,Hadir,,,Hadir,
27,I Putu Disha Ananda Putra,7.11,11,,Karena saya ingin belajar lebih dalam lagi tentang teknologi digital,29/07/2026 20:22:59,,,,,,,
28,Kadek Ariantini,7.11,13,,Karna saya suka,29/07/2026 20:24:41,,,,,,,
36,Made Bagas Pranajaya Putra,7.11,28,,"Ingin belajar teknologi informasi komputer lebih baik,karna belajar TIK aoan bisa dipakai selamanya",02/08/2026 21:54:21,,,,,,,
11,I KD Ngurah Kelvin Putra Wibawa,7.2,10,Laki-laki,INGIN MENGETAHUI KECANGGIHAN TEKNOLOGI JAMAN SEKARANG ,24/07/2026 9:23:38,Hadir,,,,,,
6,TEGUH RIZKI RAMDANI,7.2,31,Laki-laki,"Saya ingin banyak mempelajari tentang komputer, sistem informasi dan dunia digital karena saya juga ada keinginan menjadi programmer ",23/07/2026 21:37:25,Hadir,,Hadir,Hadir,Hadir,Hadir,Hadir
30,AZKHA RIDWAN AL GHAZALLI,7.2,32,,Karna saya bisa jago main komputer Dan kepengen pinter,29/07/2026 21:12:06,,Hadir,Hadir,Izin,Hadir,Hadir,Hadir
24,G.B. SURYANANJAYA S.,7.4,2,,Karna ingin lebih tau tentang tik,29/07/2026 8:58:59,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
8,Ketut Gede Arya Dana,7.4,14,laki-laki,"Karena harus dilaksanakan \n",23/07/2026 22:26:50,,,Hadir,,,Hadir,
17,I Kadek Arya Mertadana,7.5,6,Laki-Laki,𝐊𝐚𝐫𝐧𝐚 𝐬𝐚𝐲𝐚 𝐬𝐮𝐤𝐚 𝐛𝐞𝐥𝐚𝐣𝐚𝐫 𝐭𝐢𝐤 𝐤𝐚𝐫𝐧𝐚 𝐛𝐢𝐬𝐚 𝐦𝐞𝐠𝐮𝐧𝐚𝐤𝐚𝐧 𝐤𝐨𝐦𝐩𝐮𝐭𝐞𝐫 𝐝𝐢 𝐦𝐚𝐬𝐚 𝐝𝐞𝐩𝐧 𝐝𝐧 𝐛𝐠𝐮𝐬 𝐮 𝐭𝐮𝐤 𝐦𝐞𝐠𝐞𝐭𝐚𝐡𝐮𝐢 𝐩𝐞𝐦𝐛𝐞𝐥𝐚𝐣𝐚𝐫𝐚𝐧 𝐭𝐢𝐣,25/07/2026 19:26:31,,Hadir,,,,,
32,Ketut Lanang Perbawa,7.5,15,,Karena saya ingin mahir dalam menggunakan komputer ,30/07/2026 19:52:03,,,,,,,
35,Anak Agung Shri Saraswati,7.3,2,,Agar saya bisa belajar komputer dan aiti ,31/07/2026 14:44:11,,,Hadir,,Hadir,Hadir,Hadir
20,DESAK KETUT AMOLE HARTA CINTADEWI ARI,7.3,4,Perempuan,Ingin lebih mengerti tentang tik,26/07/2026 20:16:51,,Hadir,Hadir,,Hadir,Hadir,Hadir
18,I Gusti Agung Sidhi Dharma Pinatih,7.3,12,Laki-laki,Karena saya ingin belajar ilmu ini untuk masa depan saya,26/07/2026 10:45:53,,Hadir,,,Hadir,Hadir,Hadir
15,Paramahamsa Agung Made Shreyananda,7.3,26,Laki-laki,"Agar bisa belajar hal baru di dunia komputer karena saya tidak terlalu mengerti memakai laptop/komputer\nDan bisa berguna di masa depan",25/07/2026 19:22:05,,Hadir,Hadir,,Hadir,Hadir,Hadir
14,DUIARI ALINDA MULYA PRASANTI,7.3,5,Perempuan,karena ingin mempunyai skil mengetik cepet dan skil bisa tik,25/07/2026 19:21:28,,,Hadir,,,Hadir,Hadir
37,Komang Bagus Pranajaya Putra,7.5,18,,Ingin tau lebih banyak tentang teknologi informasi komputer ,02/08/2026 21:55:45,,,,,,,
40,Clarisa Claudia Chrisnova,7.6,2,,"karena saya ingin mengembangkan skill ilmu komputer saya untuk meraih cita cita saya,agar nanti saat saya sudah besar saya memiliki bekal ilmu komputer",14/08/2026 11:38:20,,,Hadir,Hadir,Hadir,Hadir,Hadir
21,Gede Ki Banito Mussolini,7.6,8,,Karna saya ingin menciptakan teknologi yang canggih ,28/07/2026 22:32:10,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
4,I KADEK AGUS SURYA DINATA,7.6,13,laki-laki,Karena saya ingin mengetahui tentang laptop/pc,23/07/2026 21:28:55,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
23,Komang Ayu Kartika Pertiwi,7.6,25,,Karena saya bisa mempelajari laptop atau komputer,29/07/2026 7:22:06,,,Hadir,Hadir,Hadir,,
10,KOMANG SHAKYA WIRA AJATHA,7.6,26,laki-laki,Karena saya ingin menjadi programer,24/07/2026 8:41:10,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
39,GEDE DANU ARTA GANYA,7.7,9,,Karna extra ini menarik dan juga asik jika kita serius dan guru nya salah satu yang terbaik,13/08/2026 20:49:23,,,,Hadir,,,Hadir
26,KADEK DANA PUTRA,7.7,16,,Karena pengen belajar komputer,29/07/2026 10:24:10,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
33,KETUT RESTU,7.7,21,,Karena saya ingin belajar komputer atau laptop,30/07/2026 20:17:01,,,Hadir,Hadir,Hadir,Hadir,Hadir
13,PUTU DANDELIA CAHAYA PUTRI,7.7,29,Perempuan,Karena  seru dan ingin mendalaminya,24/07/2026 11:52:56,Hadir,Hadir,,,Hadir,Hadir,Hadir
12,PUTU DIVIA ANASTASYA PUTRI,7.7,30,Perempuan,Karena minat bakat saya di komputer,24/07/2026 11:50:46,Hadir,Hadir,,Hadir,Hadir,Hadir,Sakit
31,PUTU KRISNA AGUS ARYA,7.7,32,,"Tertarik ingin mempelajari tentang TIK,menurut saya ini sangat bemanfaat.",30/07/2026 11:52:46,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
29,WILLY AHMAD JAILANI,7.8,1,,Karna keliatan seru,29/07/2026 20:46:52,,Hadir,Hadir,Hadir,Hadir,Hadir,Hadir
38,GUSTI AYU RAYA AGNITA,7.8,6,,Karena saya ingin belajar informatika lebih banyak ,03/08/2026 14:05:52,,,Hadir,Hadir,Hadir,Hadir,Izin
25,Ketut Juli Saputri,7.8,20,,Karena saya ingin belajar berkarya membuat game sendiri dan ingin menjadi youtuber ,29/07/2026 9:52:12,,,,,,,
22,KADEK AGUS WIDIADA,7.9,10,,Saya ingin mengetahui bayak hal terang komputer,29/07/2026 7:05:42,,,Hadir,,Hadir,Izin,Hadir
42,PUTU SURYA MAHESWARI,7.3,33,,agar menambah ilmu,04/09/2026 13:07:38,,,,,,Hadir,Hadir`;

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentStr = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentStr += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(currentStr.trim());
      currentStr = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentStr.trim());
      if (row.length > 1 || row[0] !== '') {
        lines.push(row);
      }
      row = [];
      currentStr = '';
    } else {
      currentStr += char;
    }
  }
  if (currentStr || row.length > 0) {
    row.push(currentStr.trim());
    lines.push(row);
  }
  return lines;
}

function formatToISODate(dStr) {
  const parts = dStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dStr;
}

function parseTimestamp(tsStr) {
  if (!tsStr) return null;
  const [datePart, timePart] = tsStr.split(' ');
  if (!datePart) return null;
  const parts = datePart.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    const time = timePart || '00:00:00';
    return `${year}-${month}-${day}T${time}+08:00`;
  }
  return null;
}

function normalizeKelas(k) {
  if (!k) return '';
  const mapping = {
    '7.1': '7A',
    '7.2': '7B',
    '7.3': '7C',
    '7.4': '7D',
    '7.5': '7E',
    '7.6': '7F',
    '7.7': '7G',
    '7.8': '7H',
    '7.9': '7I',
    '7.10': '7J',
    '7.11': '7K',
  };
  return mapping[k.trim()] || k.trim();
}

async function runMigration() {
  console.log('🚀 Memulai migrasi data Ekstra TIK ke Supabase...');

  console.log('Mengambil data master_siswa untuk mencocokkan NISN...');
  const { data: masterSiswa, error: errMaster } = await supabase
    .from('master_siswa')
    .select('NISN, NAMA, Kelas, "No Absen"');

  if (errMaster) {
    console.error('Peringatan saat mengambil master_siswa:', errMaster);
  }

  const parsed = parseCSV(rawCsvData);
  const headers = parsed[0];
  const dateColumns = [
    { index: 7, date: formatToISODate(headers[7]) },
    { index: 8, date: formatToISODate(headers[8]) },
    { index: 9, date: formatToISODate(headers[9]) },
    { index: 10, date: formatToISODate(headers[10]) },
    { index: 11, date: formatToISODate(headers[11]) },
    { index: 12, date: formatToISODate(headers[12]) },
    { index: 13, date: formatToISODate(headers[13]) },
  ];

  console.log('Tanggal pertemuan:', dateColumns.map(d => d.date).join(', '));

  const rows = parsed.slice(1);
  const anggotaToInsert = [];
  const presensiToInsert = [];

  for (const row of rows) {
    if (!row || row.length < 5) continue;
    const noDaftar = parseInt(row[0], 10) || null;
    const nama = row[1];
    const rawKelas = row[2];
    const kelas = normalizeKelas(rawKelas);
    const noAbsen = parseInt(row[3], 10) || null;
    const gender = row[4] || null;
    const alasan = row[5] || null;
    const waktuDaftar = parseTimestamp(row[6]);

    let nisn = null;
    if (masterSiswa && masterSiswa.length > 0) {
      const match = masterSiswa.find(
        (s) =>
          s.NAMA.trim().toLowerCase() === nama.trim().toLowerCase() ||
          (s.Kelas === kelas && parseInt(s['No Absen'], 10) === noAbsen)
      );
      if (match) {
        nisn = match.NISN;
      }
    }

    anggotaToInsert.push({
      no_daftar: noDaftar,
      nama: nama.trim(),
      kelas: kelas,
      no_absen: noAbsen,
      gender: gender,
      alasan_seleksi: alasan,
      waktu_pendaftaran: waktuDaftar,
      nisn: nisn,
      status: 'aktif',
    });

    for (const col of dateColumns) {
      const status = row[col.index];
      if (status && (status === 'Hadir' || status === 'Izin' || status === 'Sakit')) {
        presensiToInsert.push({
          tanggal: col.date,
          nama: nama.trim(),
          kelas: kelas,
          nisn: nisn,
          status_kehadiran: status,
          waktu_absen: `${col.date}T14:30:00+08:00`,
        });
      }
    }
  }

  console.log(`Memasukkan ${anggotaToInsert.length} data anggota ke tabel ekstra_anggota...`);
  // Hapus data lama agar bersih
  await supabase.from('ekstra_presensi').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('ekstra_anggota').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data: resAnggota, error: errAnggota } = await supabase
    .from('ekstra_anggota')
    .insert(anggotaToInsert)
    .select();

  if (errAnggota) {
    console.error('Gagal memasukkan data ke ekstra_anggota:', errAnggota);
    process.exit(1);
  }
  console.log(`✅ Berhasil memasukkan ${resAnggota.length} anggota!`);

  console.log(`Memasukkan ${presensiToInsert.length} log kehadiran ke tabel ekstra_presensi...`);
  const { data: resPresensi, error: errPresensi } = await supabase
    .from('ekstra_presensi')
    .insert(presensiToInsert)
    .select();

  if (errPresensi) {
    console.error('Gagal memasukkan data ke ekstra_presensi:', errPresensi);
    process.exit(1);
  }
  console.log(`✅ Berhasil memasukkan ${resPresensi.length} baris presensi!`);

  // Pastikan tugas master ada
  const { data: existingTugas } = await supabase.from('ekstra_tugas_master').select('id').limit(1);
  if (!existingTugas || existingTugas.length === 0) {
    await supabase.from('ekstra_tugas_master').insert([
      {
        judul_tugas: 'Latihan 1: Format Dokumen Surat Resmi (Microsoft Word / Docs)',
        deskripsi: 'Buatlah surat undangan resmi sekolah dengan kop surat, margin 3-4-3-3, paragraf menjorok, dan tabel susunan acara. Simpan dalam format .docx atau .pdf lalu unggah ke sini.',
        deadline: '2026-09-30T23:59:59+08:00',
        is_active: true,
      },
    ]);
    console.log('✅ Berhasil membuat tugas master Ekstra TIK!');
  }

  console.log('🎉 SEMUA DATA EKSTRA TIK BERHASIL DIMIGRASIKAN KE SUPABASE!');
}

runMigration().catch(console.error);

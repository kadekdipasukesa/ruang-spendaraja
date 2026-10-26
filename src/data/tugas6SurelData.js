/**
 * src/data/tugas6SurelData.js
 * Konfigurasi resmi Tugas 6: Praktik Komunikasi Resmi Surel (Gmail)
 * Kurikulum Merdeka Informatika Kelas 7 - SMP Negeri 2 Singaraja
 */

export const TUGAS_6_CONFIG = {
  id: 'b8192a6c-4820-4e31-89d5-7c5ef93108c6', // Canonical ID
  kode_tugas: 'TUGAS-06-SUREL-GMAIL',
  urutan: 6,
  judul: 'Tugas 6: Praktik Resmi Surel (Gmail) - Surat Izin Lomba Melukis',
  targetDate: '1 November 2026',
  targetTeacherEmail: 'walikelas.7a@smpn2singaraja.sch.id',
  targetPrincipalEmail: 'kepsek@smpn2singaraja.sch.id',
  poinMaksimal: 100,
  kategori: 'Literasi Digital',
  estimasiMenit: 35,
};

export const TEMPLATE_SURAT_IZIN = `Yth. Bapak/Ibu Wali Kelas 7
SMP Negeri 2 Singaraja
di Tempat

Dengan hormat,
Saya yang bertanda tangan di bawah ini:
Nama : {NAMA_SISWA}
Kelas : {KELAS_SISWA}
No. Absen : {ABSEN_SISWA}

Bermaksud memohon izin untuk tidak dapat mengikuti kegiatan belajar mengajar di sekolah pada tanggal 1 November 2026, dikarenakan harus menghadiri acara penyerahan hadiah sebagai pemenang lomba melukis pada perayaan Hari Kemerdekaan RI di tingkat kabupaten.

Demikian surat permohonan izin ini saya sampaikan dengan penuh rasa hormat. Atas perhatian dan izin yang Bapak/Ibu berikan, saya mengucapkan terima kasih.

Hormat saya,
{NAMA_SISWA}`;

export const TAHAPAN_TUGAS_6 = [
  {
    id: 1,
    title: 'Akun & Kotak Masuk Gmail',
    subtitle: 'Buka aplikasi Gmail dan pastikan akun aktif',
    bobotPoin: 30,
    icon: 'Mail',
    color: 'emerald',
    videoSummary: {
      durasi: '0:20',
      poinPenting: [
        'Surel (Surat Elektronik) adalah surat digital yang sampai dalam hitungan detik via internet.',
        'Alamat surel wajib memakai simbol @ (contoh: nama.siswa@gmail.com).',
        'Layar utama menampilkan Kotak Masuk (Inbox) dan foto profil akun aktif.',
      ],
    },
    kuis: {
      pertanyaan: 'Manakah di bawah ini penulisan alamat surel yang BENAR dan valid?',
      opsi: [
        { id: 'A', teks: 'budi santoso@gmail.com (ada spasi)' },
        { id: 'B', teks: 'budi.santoso@gmail.com (tanpa spasi dengan simbol @)', benar: true },
        { id: 'C', teks: 'budi,santoso@gmail,com (memakai koma)' },
        { id: 'D', teks: '@budi.santoso.gmail.com (simbol @ di awal)' },
      ],
      pembahasan: 'Alamat surel tidak boleh mengandung spasi dan wajib memisahkan username dengan domain menggunakan tanda @.',
    },
    praktek: {
      instruksi: 'Buka aplikasi Gmail di HP atau buka mail.google.com di laptop. Ambil tangkapan layar (screenshot) layar Kotak Masuk (Inbox) yang memperlihatkan foto atau nama akun Gmail-mu.',
      petunjukSS: 'Pastikan nama/foto profil akun Gmail-mu terlihat di pojok kanan atas.',
      targetLabel: 'Screenshot 1: Kotak Masuk (Inbox) Gmail',
    },
  },
  {
    id: 2,
    title: 'Menyusun Alamat Kepada (To) & Tembusan (Cc)',
    subtitle: 'Wali Kelas sebagai To & Kepala Sekolah sebagai Cc',
    bobotPoin: 35,
    icon: 'Users',
    color: 'blue',
    videoSummary: {
      durasi: '0:25',
      poinPenting: [
        'Klik tombol + Tulis (+ Compose) di Gmail untuk membuat pesan baru.',
        'Kolom Kepada (To) diisi penerima utama yang dituju (Wali Kelas).',
        'Klik menu Cc (Carbon Copy) untuk memasukkan Kepala Sekolah sebagai tembusan info resmi.',
        'Kolom Subjek wajib diisi judul surat yang jelas dan sopan.',
      ],
    },
    kuis: {
      pertanyaan: 'Jika Kepala Sekolah hanya perlu mengetahui surat izin kita sebagai tembusan informasi, di kolom manakah alamat beliau diletakkan?',
      opsi: [
        { id: 'A', teks: 'Kolom Kepada (To)' },
        { id: 'B', teks: 'Kolom Tembusan (Cc)', benar: true },
        { id: 'C', teks: 'Kolom Subjek pesan' },
        { id: 'D', teks: 'Cukup disebutkan di dalam salam pembuka' },
      ],
      pembahasan: 'Kolom Cc (Carbon Copy) khusus digunakan untuk mengirimkan salinan/tembusan kepada pihak yang berhak mengetahui informasi surat.',
    },
    praktek: {
      instruksi: 'Di Gmail, klik tombol "+ Tulis". Isi Kepada (To) dengan alamat wali kelas, klik tombol "Cc" lalu isi alamat kepala sekolah, dan ketik Subjek: "Permohonan Izin Tidak Masuk Sekolah - [Nama] [Kelas]".',
      petunjukSS: 'Ambil screenshot jendela penulisan pesan yang menampilkan kolom To, Cc, dan Subjek yang sudah terisi.',
      targetLabel: 'Screenshot 2: Jendela Tulis (To, Cc, & Subjek)',
    },
  },
  {
    id: 3,
    title: 'Menulis Isi Surat Izin Formal (Kasus 1 November 2026)',
    subtitle: 'Bahasa santun, alasan lomba melukis, tanpa upload PDF',
    bobotPoin: 35,
    icon: 'FileText',
    color: 'amber',
    videoSummary: {
      durasi: '0:25',
      poinPenting: [
        'Gunakan salam pembuka resmi: "Yth. Bapak/Ibu Wali Kelas...".',
        'Tuliskan identitas diri lengkap: Nama, Kelas, dan Nomor Absen.',
        'Sampaikan alasan izin secara jelas: penyerahan hadiah lomba melukis pada 1 November 2026.',
        'Tutup dengan permohonan izin dan ucapan terima kasih yang santun.',
        'Catatan: Pada tahap ini TIDAK PERLU melampirkan berkas PDF.',
      ],
    },
    kuis: {
      pertanyaan: 'Dalam etika berkirim surel formal kepada guru, hal manakah yang DILARANG dilakukan?',
      opsi: [
        { id: 'A', teks: 'Menggunakan salam pembuka yang santun' },
        { id: 'B', teks: 'Menyebutkan nama lengkap dan kelas' },
        { id: 'C', teks: 'Menulis seluruh isi surat memakai HURUF KAPITAL SEMUA (CAPSLOCK)', benar: true },
        { id: 'D', teks: 'Mengucapkan terima kasih di akhir surat' },
      ],
      pembahasan: 'Menulis dengan huruf kapital semua di internet dianggap berteriak atau membentak, sehingga dilarang dalam surat resmi.',
    },
    praktek: {
      instruksi: 'Ketikkan isi surat izin formal di badan pesan Gmail (kamu dapat menyalin draf yang telah disediakan). Pastikan memuat tanggal 1 November 2026 dan alasan lomba melukis. Ambil screenshot surat lengkap yang siap dikirim atau sudah di folder Terkirim.',
      petunjukSS: 'Ambil screenshot seluruh tampilan pesan yang memuat isi surat izin formal.',
      targetLabel: 'Screenshot 3: Isi Surat Izin Lengkap',
    },
  },
];

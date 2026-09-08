export const ETHICS_CASES = [
  {
    id: 'case_hoax',
    title: 'Studi Kasus 1: Pesan Berantai Hadiah Kuota Gratis 100GB di Grup WhatsApp',
    scenario: 'Kamu menerima pesan yang meminta meneruskan (forward) tautan aneh ke 10 grup agar mendapat kuota internet gratis.',
    correctAction: 'action_verify',
    correctImpact: 'negative_phising',
    actions: [
      { id: 'action_forward', text: 'Langsung teruskan tautan ke seluruh kontak grup obrolan agar mendapat kuota gratis' },
      { id: 'action_verify', text: 'Abaikan tautan mencurigakan, verifikasi di situs resmi, dan beri tahu teman grup' },
      { id: 'action_click', text: 'Buka tautan secara cepat kemudian masukkan nomor kontak telepon serta kata sandi akun' },
    ],
    impacts: [
      { id: 'negative_phising', text: 'Dampak Negatif: Berpotensi Phising & Pembobolan Akun Pribadi' },
      { id: 'positive_sharing', text: 'Dampak Positif: Mendapat Bonus Akses Internet Tanpa Batas Waktu' },
      { id: 'neutral', text: 'Dampak Netral: Sistem Otomatis Mengabaikan Formulir Pendaftaran' },
    ],
  },
  {
    id: 'case_privacy',
    title: 'Studi Kasus 2: Foto Teman Saat Sedang Tidur Lucu di Kelas',
    scenario: 'Kamu memotret temanmu yang sedang tidur di pojok kelas dengan pose lucu dan ingin menjadikannya meme di status media sosial.',
    correctAction: 'action_ask_permission',
    correctImpact: 'negative_cyberbullying',
    actions: [
      { id: 'action_post_direct', text: 'Unggah langsung ke akun publik agar memicu komentar ramai dan tawa pengikut' },
      { id: 'action_ask_permission', text: 'Minta persetujuan teman secara santun; batalkan unggah bila ia merasa tidak nyaman' },
      { id: 'action_tag_everyone', text: 'Kirimkan foto tersebut ke akun grup wali murid serta seluruh guru sekolah' },
    ],
    impacts: [
      { id: 'negative_cyberbullying', text: 'Dampak Negatif: Melanggar Privasi & Menjadi Korban Perundungan Siber' },
      { id: 'positive_humor', text: 'Dampak Positif: Menjalin Keakraban Tanpa Batas Etika Pertemanan' },
      { id: 'no_harm', text: 'Dampak Netral: Konten Media Sosial Otomatis Terhapus Sendiri' },
    ],
  },
  {
    id: 'case_screentime',
    title: 'Studi Kasus 3: Keseimbangan Waktu Layar (Screen Time)',
    scenario: 'Menjelang ujian sekolah, kamu merasa ingin terus bermain game online sampai larut malam pukul 02:00 pagi.',
    correctAction: 'action_time_management',
    correctImpact: 'negative_health_focus',
    actions: [
      { id: 'action_all_night', text: 'Lanjutkan bermain game sepanjang malam sambil mengonsumsi minuman penahan kantuk' },
      { id: 'action_time_management', text: 'Batasi screen time maksimal 1-2 jam untuk rileks, lalu tidur cukup demi ujian' },
      { id: 'action_skip_school', text: 'Mengambil izin tidak masuk kelas esok harinya agar dapat melunasi hutang jam tidur' },
    ],
    impacts: [
      { id: 'negative_health_focus', text: 'Dampak Negatif: Gangguan Penglihatan, Kelelahan Otak & Nilai Ujian Anjlok' },
      { id: 'positive_pro_gamer', text: 'Dampak Positif: Keterampilan Bermain Game Meningkat Tanpa Efek Samping' },
      { id: 'no_effect', text: 'Dampak Netral: Pola Jam Tubuh Menyesuaikan Aktivitas Bermain Game' },
    ],
  },
  {
    id: 'case_digital_footprint',
    title: 'Studi Kasus 4: Jejak Digital & Komentar di Media Sosial',
    scenario: 'Melihat konten video orang lain yang tidak kamu sukai di internet, lalu kamu ingin menuliskan kata-kata makian kasar.',
    correctAction: 'action_wise_comment',
    correctImpact: 'negative_digital_trace',
    actions: [
      { id: 'action_flame', text: 'Tuliskan ejekan dengan profil samaran tanpa nama agar identitas diri tidak diketahui' },
      { id: 'action_wise_comment', text: 'Terapkan etika netiket: beri tanggapan santun atau lewati konten tanpa mencaci' },
      { id: 'action_spam_insult', text: 'Mengajak beberapa rekan untuk membanjiri kolom komentar dengan kalimat sindiran' },
    ],
    impacts: [
      { id: 'negative_digital_trace', text: 'Dampak Negatif: Jejak Digital Tercatat Buruk & Berisiko Sanksi Hukum UU ITE' },
      { id: 'positive_freedom', text: 'Dampak Positif: Melatih Keberanian Mengutarakan Opini Tanpa Halangan Etika' },
      { id: 'no_trace', text: 'Dampak Netral: Komentar Daring Otomatis Lenyap Tanpa Bukti Tangkapan Layar' },
    ],
  },
  {
    id: 'case_security_password',
    title: 'Studi Kasus 5: Keamanan Akun & Kata Sandi',
    scenario: 'Teman sekelasmu meminta pinjam akun belajar untuk melihat tugas, dan menanyakan kata sandi akunmu.',
    correctAction: 'action_keep_secret',
    correctImpact: 'positive_account_safety',
    actions: [
      { id: 'action_give_password', text: 'Berikan informasi kata sandi akun pribadi karena rasa sungkan menolak kawan dekat' },
      { id: 'action_keep_secret', text: 'Jaga kerahasiaan kata sandi; dampingi langsung temanmu saat mempelajari materi' },
      { id: 'action_write_board', text: 'Menempelkan catatan akun dan kata sandi pada meja kelas agar mudah dibuka bersama' },
    ],
    impacts: [
      { id: 'positive_account_safety', text: 'Dampak Positif: Profil Aman dari Manipulasi Nilai & Penyalahgunaan Data' },
      { id: 'negative_friendship', text: 'Dampak Negatif: Mengakibatkan Kerenggangan Tali Hubungan Pertemanan Kelas' },
      { id: 'neutral_pass', text: 'Dampak Netral: Sistem Otomatis Mengunci Sandi Bila Dipakai Perangkat Lain' },
    ],
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Istilah "Jejak Digital" (Digital Footprint) dalam dunia teknologi informasi mengacu pada...',
    options: [
      { id: 'a', text: 'Sisa partikel debu halus pada permukaan layar sentuh gawai' },
      { id: 'b', text: 'Kabel tembaga jaringan internet yang tertanam di bawah aspal' },
      { id: 'c', text: 'Rekam jejak seluruh riwayat aktivitas online yang tersimpan' },
      { id: 'd', text: 'Ukuran resolusi tampilan grafis kartu video pada monitor LED' },
    ],
    correct: 'c',
  },
  {
    id: 2,
    question: 'Tindakan mengirim pesan berulang-ulang yang mengintimidasi, menghina, atau mempermalukan seseorang di media sosial disebut...',
    options: [
      { id: 'a', text: 'Cyberbullying atau perundungan siber di ranah internet' },
      { id: 'b', text: 'Cloud storage atau pencadangan berkas server daring' },
      { id: 'c', text: 'Digital marketing atau promosi komersial produk daring' },
      { id: 'd', text: 'Search engine optimization atau perayapan halaman situs' },
    ],
    correct: 'a',
  },
  {
    id: 3,
    question: 'Kombinasi kata sandi (password) akun yang memiliki tingkat keamanan tinggi dari risiko peretasan adalah...',
    options: [
      { id: 'a', text: 'Rangkaian tanggal lahir lengkap siswa tanpa spasi' },
      { id: 'b', text: 'Nama panggilan akun media sosial berulang tiga kali' },
      { id: 'c', text: 'Urutan alfabet angka berurutan sederhana "12345678"' },
      { id: 'd', text: 'Paduan minimal 8 karakter huruf besar, angka, dan simbol' },
    ],
    correct: 'd',
  },
  {
    id: 4,
    question: 'Manakah di bawah ini yang merupakan DAMPAK POSITIF dari pemanfaatan Teknologi Informasi dan Komunikasi?',
    options: [
      { id: 'a', text: 'Meningkatnya kebiasaan begadang tanpa beristirahat' },
      { id: 'b', text: 'Kemudahan mengakses ilmu dan kolaborasi pembelajaran' },
      { id: 'c', text: 'Makin derasnya peredaran kabar palsu yang menyesatkan' },
      { id: 'd', text: 'Tergantungnya aktivitas harian pada layar ponsel cerdas' },
    ],
    correct: 'b',
  },
  {
    id: 5,
    question: 'Tata krama kesopanan serta etika komunikasi yang wajib dijunjung saat berinteraksi di dunia maya dikenal dengan istilah...',
    options: [
      { id: 'a', text: 'Algorithm protocol sistem pertukaran kode data jaringan' },
      { id: 'b', text: 'Bandwidth throttling pembatasan kuota kecepatan sinyal' },
      { id: 'c', text: 'Netiket atau etika berkomunikasi santun di ruang siber' },
      { id: 'd', text: 'Firewall antivirus filter penyaring data lalu lintas web' },
    ],
    correct: 'c',
  },
];

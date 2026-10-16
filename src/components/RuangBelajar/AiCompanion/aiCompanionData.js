/**
 * Konfigurasi Karakter AI Murid Teman Belajar Spendaraja:
 * @aurora (Murid Cewek) & @arunika (Murid Cowok)
 * Video Perkenalan YouTube Shorts: https://youtube.com/shorts/K33Rp3U3PJ4?si=QkqEb4JX57tZ363-
 */

import auroraPhoto from '../../../assets/ai-companion/aurora.png';
import arunikaPhoto from '../../../assets/ai-companion/arunika.png';

export const AI_COMPANION_CONFIG = {
  youtubeShortsUrl: "https://youtube.com/shorts/K33Rp3U3PJ4",
  youtubeVideoId: "K33Rp3U3PJ4",
  youtubeEmbedUrl: "https://www.youtube.com/embed/K33Rp3U3PJ4?autoplay=1&rel=0&modestbranding=1",
  title: "Teman Belajar AI Spendaraja: Aurora & Arunika",
  subtitle: "Karakter AI Teman Sebaya Murid SMPN 2 Singaraja yang Siap Membantumu Belajar TIK & Menuntaskan Tugas!",
};

export const AI_CHARACTERS = {
  aurora: {
    id: "aurora",
    handle: "@aurora",
    name: "Aurora",
    gender: "female",
    avatarUrl: auroraPhoto,
    fallbackAvatarUrl: "/ai-companion/aurora.png",
    roleLabel: "Murid Kelas 7 • Peer Tutor Cewek",
    specialty: "Spesialis Penjelasan & Rangkuman Materi",
    avatarBg: "from-pink-500 via-rose-500 to-purple-600",
    badgeBorder: "border-pink-500/40 bg-pink-500/10 text-pink-700 dark:text-pink-300",
    glowColor: "rgba(244, 114, 182, 0.35)",
    ringColor: "from-pink-500 via-rose-400 to-amber-400",
    icon: "🌸",
    personalityTag: "Ramah • Teliti • Hangat",
    greeting: "Hai! Aku Aurora 👋 Senang banget bisa kenalan sama kamu! Ada materi atau tugas di Ruang Spendaraja yang bikin bingung? Jangan sungkan tanya ke aku ya, kita belajar bareng! 🌸✨",
    quickSuggestions: [
      "Jelaskan fungsi fitur-fitur di Microsoft Word dong!",
      "Bagaimana cara mudah memahami Bilangan Biner & ASCII?",
      "Apa bedanya hardware, software, dan brainware?",
      "Kasih tips cara belajar santai tapi materi cepat nempel!"
    ]
  },
  arunika: {
    id: "arunika",
    handle: "@arunika",
    name: "Arunika",
    gender: "male",
    avatarUrl: arunikaPhoto,
    fallbackAvatarUrl: "/ai-companion/arunika.png",
    roleLabel: "Murid Kelas 7 • Study Buddy Cowok",
    specialty: "Jago Logika, Praktikum & Shortcut Cepat",
    avatarBg: "from-cyan-500 via-blue-600 to-indigo-600",
    badgeBorder: "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    glowColor: "rgba(56, 189, 248, 0.35)",
    ringColor: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: "⚡",
    personalityTag: "Santai • Cepat • Solutif",
    greeting: "Yo halo! Aku Arunika ⚡ Siap bantu kamu beresin misi di Ruang Spendaraja sampai dapet skor XP maksimal! Mau bahas shortcut keyboard, trik simulasi lab, atau kuis apa nih? Gas tanya! 🚀😎",
    quickSuggestions: [
      "Bocorin shortcut keyboard paling penting di Ms Word!",
      "Gimana strategi cepat selesaiin misi Simulator Folder?",
      "Jelaskan logika 4 pilar Berpikir Komputasional!",
      "Gimana cara dapet peringkat atas di Leaderboard Kelas?"
    ]
  }
};

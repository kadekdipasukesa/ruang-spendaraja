import { ShieldAlert, Trophy, UserCheck, Globe, Terminal, Gamepad2, BookOpen, Cpu } from 'lucide-react';
import AppsCard from './AppsCard'; // Sesuai lokasi yang kamu sebutkan tadi

export default function AppsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <AppsCard
        title="CATATAN KEDISIPLINAN"
        description="Sistem pencatatan poin pelanggaran dan pengabdian siswa secara real-time."
        icon={ShieldAlert}
        color="rose"
        badge="Sistem"
        onOpen={() => window.location.href = '/pelanggaran'}
      />

      <AppsCard
        title="GEMPITAS 2026"
        description="Pendaftaran dan informasi Gema Lomba Matematika, IPA, & IPS SMP Negeri 2 Singaraja."
        icon={Trophy}
        color="orange"
        badge="Competition"
        onOpen={() => window.location.href = '/gempitas'}
      />

      <AppsCard
        title="Monitoring Liburan"
        description="Laporan pembelajaran mandiri murid selama masa liburan sekolah."
        icon={UserCheck}
        color="emerald"
        badge="Liburan"
        onOpen={() => window.open('https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbzlKlYSmo5WIcd6If6botntfyGc0E30ttGGHhL14Fhd98IoFqnEfY0iuR4tS6AWTUu0/exec', '_blank')}
      />

      <AppsCard
        title="Canva Design"
        description="Buat presentasi, poster, dan tugas sekolah dengan template yang kreatif."
        icon={Globe}
        color="purple"
        badge="Populer"
        onOpen={() => window.open('https://www.canva.com', '_blank')}
      />

      <AppsCard
        title="ChatGPT AI"
        description="Asisten cerdas untuk membantu brainstorming ide dan belajar konsep sulit."
        icon={Terminal}
        color="emerald"
        badge="AI Help"
        onOpen={() => window.open('https://chatgpt.com', '_blank')}
      />

      <AppsCard
        title="Quizizz"
        description="Mainkan kuis interaktif bersama teman sekelas untuk menguji pemahamanmu."
        icon={Gamepad2}
        color="rose"
        onOpen={() => window.open('https://quizizz.com/join', '_blank')}
      />

      <AppsCard
        title="Google Classroom"
        description="Cek pengumuman kelas dan kumpulkan tugas tepat waktu di sini."
        icon={BookOpen}
        color="blue"
        onOpen={() => window.open('https://classroom.google.com', '_blank')}
      />

      <AppsCard
        title="Typing Test"
        description="Latih kecepatan mengetik 10 jarimu agar mengerjakan tugas lebih cepat."
        icon={Cpu}
        color="orange"
        badge="Skill"
        onOpen={() => window.open('https://10fastfingers.com/typing-test/indonesian', '_blank')}
      />
    </div>
  );
}
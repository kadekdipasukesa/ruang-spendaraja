import { 
  Home as HomeIcon, Megaphone, Gamepad2, FileText, 
  Trophy, Lock, BookOpen, UserCheck, LayoutGrid 
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, student }) {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: <HomeIcon size={18} /> },
    { id: 'apps', label: 'Apps', icon: <LayoutGrid size={18} /> },
    { id: 'info', label: 'Informasi', icon: <Megaphone size={18} /> },
    { id: 'materi', label: 'Materi', icon: <BookOpen size={18} /> },
    { id: 'absen', label: 'Absensi', icon: <UserCheck size={18} /> },
    { id: 'playground', label: 'Playground', icon: <Gamepad2 size={18} /> },
    { id: 'tugas', label: 'Tugas', icon: <FileText size={18} /> },
    { id: 'ranking', label: 'Ranking', icon: <Trophy size={18} /> },
  ];

  const handleTabClick = (tabId) => {
    // Menu yang wajib diproteksi (Hanya 7.1-7.11 & Admin)
    const isProtected = ['absen', 'tugas', 'ranking', 'materi'].includes(tabId);
    
    if (isProtected) {
      // 1. Cek apakah admin (berdasarkan role di data student)
      const isAdmin = student?.role === 'admin';
      
      // 2. Cek apakah siswa kelas 7 (Regex untuk mencocokkan 7.1 sampai 7.11)
      const isClass7 = student?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(student.Kelas);

      if (!isAdmin && !isClass7) {
        alert('Maaf, menu ini khusus untuk Kelas 7 dan Admin!');
        return;
      }
    }

    setActiveTab(tabId);
  };

  return (
    <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        // Logika gembok: Muncul jika BUKAN admin DAN BUKAN kelas 7 pada menu terproteksi
        const isLocked = ['absen', 'tugas', 'ranking', 'materi'].includes(tab.id) && 
                         !(student?.role === 'admin') && 
                         !(student?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(student.Kelas));

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {tab.icon} {tab.label}
            
            {isLocked && (
              <Lock size={12} className="opacity-40 ml-1 text-red-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
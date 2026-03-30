import { Home as HomeIcon, Megaphone, Gamepad2, FileText, Trophy, Lock, BookOpen } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, student }) {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: <HomeIcon size={18} /> },
    { id: 'info', label: 'Informasi', icon: <Megaphone size={18} /> },
    { id: 'materi', label: 'Materi', icon: <BookOpen size={18} /> }, // Menu baru: Bisa diakses umum
    { id: 'playground', label: 'Playground', icon: <Gamepad2 size={18} /> },
    { id: 'tugas', label: 'Tugas', icon: <FileText size={18} /> },
    { id: 'ranking', label: 'Ranking', icon: <Trophy size={18} /> },
  ];

  const handleTabClick = (tabId) => {
    // Menu 'materi' tidak dimasukkan ke sini agar bisa diakses tanpa login
    const isProtected = tabId === 'tugas' || tabId === 'ranking';
    
    if (isProtected && !student) {
      alert('Login dulu ya untuk akses menu ini!');
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap
            ${activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          {tab.icon} {tab.label}
          
          {/* Tampilkan icon gembok kecil hanya untuk menu yang diproteksi */}
          {(tab.id === 'tugas' || tab.id === 'ranking') && !student && (
            <Lock size={12} className="opacity-40 ml-1" />
          )}
        </button>
      ))}
    </div>
  );
}
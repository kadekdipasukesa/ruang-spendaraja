import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Tambahkan Sparkles ke dalam daftar import
import { School, LogIn, X, User, Key, UserPlus, LogOut, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [inputNama, setInputNama] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [password, setPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk tombol mata

  // Listener Realtime khusus untuk Navbar
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('navbar-points')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'master_siswa',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updatedUser = { ...user, total_points: payload.new.total_points };
          setUser(updatedUser);
          localStorage.setItem('user_siswa', JSON.stringify(updatedUser)); // Update storage agar sinkron
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const formatShortName = (fullName) => {
    if (!fullName) return "";
    const words = fullName.trim().split(/\s+/);
    if (words.length <= 2) return fullName;
    return words.slice(-2).join(" ");
  };

  useEffect(() => {
    if (inputNama.length > 2 && !selectedSiswa) {
      const searchNama = async () => {
        const { data } = await supabase
          .from('master_siswa')
          .select('*')
          .ilike('NAMA', `%${inputNama}%`)
          .limit(5);
        setSuggestions(data || []);
      };
      searchNama();
    } else {
      setSuggestions([]);
    }
  }, [inputNama, selectedSiswa]);

  useEffect(() => {
    if (selectedSiswa) {
      if (selectedSiswa.is_registered === false) {
        setIsChangingPassword(true);
      } else {
        setIsChangingPassword(false);
      }
    }
  }, [selectedSiswa]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedSiswa) return;

    if (!selectedSiswa.is_registered) {
      if (newPassword.length < 6) {
        setErrorMsg("Password baru harus minimal 6 karakter!");
        return;
      }
      const { error } = await supabase
        .from('master_siswa')
        .update({ password: newPassword, is_registered: true })
        .eq('id', selectedSiswa.id);

      if (!error) {
        alert("Selamat! Akun berhasil dibuat. Silakan login.");
        window.location.reload();
      }
      return;
    }

    if (selectedSiswa.password === password) {
      localStorage.setItem('user_siswa', JSON.stringify(selectedSiswa));
      window.location.reload();
    } else {
      setErrorMsg("Password salah! Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_siswa');
    window.location.reload();
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    setIsChangingPassword(false);
    setSelectedSiswa(null);
    setInputNama('');
    setPassword('');
    setNewPassword('');
    setErrorMsg('');
    setShowPassword(false);
  };

  return (
    <nav className="bg-[#0f172a]/90 border-b border-blue-500/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* LOGO DENGAN VERSI */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
          <School size={22} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-black text-xl tracking-tighter">
            Ruang <span className="text-blue-400">Spendaraja</span>
          </span>
          <span className="text-[7px] font-bold text-slate-500 tracking-[0.2em] ml-0.5 mt-0.5">
            VERSI 1.0
          </span>
        </div>
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          {/* BADGE POIN NAVBAR */}
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl shadow-lg shadow-yellow-900/10">
            <div className="bg-yellow-500/20 p-1 rounded-lg">
              <Sparkles size={14} className="text-yellow-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black text-yellow-500/70 uppercase">Poin</span>
              <span className="text-sm font-black text-yellow-400">
                {user.total_points ?? 0}
              </span>
            </div>
          </div>

          <div className="text-right hidden md:block border-l border-white/10 pl-4">
            <p className="text-sm font-bold text-white capitalize">{formatShortName(user.NAMA)}</p>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Kelas {user.Kelas}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-600 p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg shadow-red-900/20"
          >
            <LogOut size={18} className="text-red-500 group-hover:text-white" />
          </button>
        </div>
      ) : (
        /* ... tombol masuk tetap sama ... */
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all font-bold text-sm">
          <LogIn size={18} /> <span>Masuk</span>
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] flex justify-center items-center md:items-start md:justify-end md:p-6">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                  {isChangingPassword ? "Buat Akun" : "Masuk Akun"}
                </h3>
                <div className="h-1 w-10 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button onClick={closeAndResetModal} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="flex items-center border border-white/10 rounded-2xl p-4 mt-1 bg-slate-900/80 focus-within:border-blue-500 shadow-inner transition-all">
                  <User size={18} className="text-blue-500 mr-3" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-white text-sm"
                    placeholder="Ketik namamu..."
                    value={selectedSiswa ? selectedSiswa.NAMA : inputNama}
                    onChange={(e) => { setInputNama(e.target.value); setSelectedSiswa(null); }}
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-[#1e293b] border border-white/10 rounded-2xl mt-2 shadow-2xl z-[70] overflow-hidden">
                    {suggestions.map((s) => (
                      <div key={s.id} onClick={() => { setSelectedSiswa(s); setSuggestions([]); }} className="p-4 hover:bg-blue-600/20 cursor-pointer text-sm border-b border-white/5 last:border-0 flex justify-between items-center text-white">
                        <span className="font-medium">{s.NAMA}</span> <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-bold uppercase">{s.Kelas}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedSiswa && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  {!selectedSiswa.is_registered || isChangingPassword ? (
                    <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/30 mt-4">
                      <h4 className="text-sm font-black uppercase text-blue-400 mb-2 flex items-center gap-2"><UserPlus size={18} /> Belum punya akun</h4>
                      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">Buat password baru untuk akunmu.</p>

                      <div className={`flex items-center border-2 bg-slate-950 rounded-2xl p-4 transition-all ${errorMsg ? 'border-red-500' : 'border-blue-500/50'}`}>
                        <Key size={18} className="text-blue-400 mr-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-transparent outline-none text-white text-sm"
                          placeholder="Password Baru"
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errorMsg && <p className="text-[10px] text-red-500 font-bold mt-2">⚠️ {errorMsg}</p>}
                      <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl mt-5 font-black uppercase tracking-widest hover:bg-emerald-500 transition-all text-xs">Aktifkan Akun</button>
                    </div>
                  ) : (
                    <>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                      <div className={`flex items-center border-2 rounded-2xl p-4 mt-1 transition-all ${errorMsg ? 'border-red-500 bg-red-500/5' : 'border-white/10 bg-slate-900/80 focus-within:border-blue-500'}`}>
                        <Key size={18} className={errorMsg ? 'text-red-500 mr-3' : 'text-blue-500 mr-3'} />
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-transparent outline-none text-white text-sm"
                          placeholder="Masukkan password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errorMsg && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 animate-pulse">⚠️ {errorMsg}</p>}
                      <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl mt-6 font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-xs">Masuk Sekarang</button>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
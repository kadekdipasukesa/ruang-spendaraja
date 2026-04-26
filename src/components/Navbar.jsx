import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { School, LogIn, X, User, Key, UserPlus, LogOut, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
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
  const [showPassword, setShowPassword] = useState(false);

  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // Jika scroll ke bawah lebih dari 150px, sembunyikan. 
    // Jika scroll ke atas, munculkan.
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('navbar-points')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'master_siswa', filter: `id=eq.${user.id}` },
        (payload) => {
          const updatedUser = { ...user, total_points: payload.new.total_points };
          setUser(updatedUser);
          localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
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
      setIsChangingPassword(selectedSiswa.is_registered === false);
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
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-slate-950/1 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center z-[100] transition-all duration-300"
        >
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent shadow-[0_1px_10px_rgba(245,158,11,0.2)]" />

        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
            <School size={22} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-white font-black text-xl tracking-tighter leading-tight">
              Ruang <span className="text-blue-400">Spendaraja</span>
            </span>
            <div className="flex items-center pt-1">
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
                v.{__APP_VERSION__}
              </span>
            </div>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {(user?.role === 'admin' || (user?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(user.Kelas))) && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl shadow-lg transition-all duration-500">
                <div className="bg-yellow-500/20 p-1 rounded-lg">
                  <Sparkles size={14} className="text-yellow-400" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] font-black text-yellow-500/70 uppercase tracking-tighter">Poin</span>
                  <span className="text-sm font-black text-yellow-400">{user.total_points ?? 0}</span>
                </div>
              </div>
            )}
            <div className="text-right hidden md:block border-l border-white/10 pl-4">
              <p className="text-sm font-bold text-white capitalize">{formatShortName(user.NAMA)}</p>
              <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{user.Kelas}</p>
            </div>
            <button onClick={handleLogout} className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-600 p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg shadow-red-900/20">
              <LogOut size={18} className="text-red-500 group-hover:text-white" />
            </button>
          </div>
        ) : (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all font-bold text-sm">
            <LogIn size={18} /> <span>Masuk</span>
          </button>
        )}
      </motion.nav>

      {/* MODAL SECTION - Di luar nav agar tidak terpotong stacking context */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] overflow-y-auto px-4 py-10 flex justify-center items-start md:justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAndResetModal}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#1e293b] w-full max-w-sm rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 border border-white/10 my-auto md:my-0 md:mt-4"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                    {isChangingPassword ? "Buat Akun" : "Masuk Akun"}
                  </h3>
                  <div className="h-1.5 w-8 bg-blue-500 rounded-full mt-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <button onClick={closeAndResetModal} className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-xl transition-all group">
                  <X size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                  <div className="flex items-center border border-white/5 rounded-2xl p-4 mt-1 bg-slate-950/50 focus-within:border-blue-500/50 shadow-inner transition-all">
                    <User size={18} className="text-blue-500 mr-3" />
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none text-white text-sm"
                      placeholder="Cari namamu..."
                      value={selectedSiswa ? selectedSiswa.NAMA : inputNama}
                      onChange={(e) => { setInputNama(e.target.value); setSelectedSiswa(null); }}
                    />
                  </div>

                  {suggestions.length > 0 && (
                    <div className="absolute w-full bg-[#1e293b] border border-white/10 rounded-2xl mt-2 shadow-2xl z-[160] overflow-hidden max-h-40 overflow-y-auto backdrop-blur-xl">
                      {suggestions.map((s) => (
                        <div key={s.id} onClick={() => { setSelectedSiswa(s); setSuggestions([]); }} className="p-4 hover:bg-blue-600/20 cursor-pointer text-sm border-b border-white/5 last:border-0 flex justify-between items-center text-white transition-colors">
                          <span className="font-medium">{s.NAMA}</span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-black uppercase">{s.Kelas}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSiswa && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {isChangingPassword ? (
                      <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/30 mt-2 text-center">
                        <UserPlus size={24} className="text-blue-400 mx-auto mb-2" />
                        <p className="text-[11px] text-slate-400 mb-4 uppercase font-black tracking-widest">Akun belum aktif, buat password baru:</p>
                        <div className="flex items-center border border-white/10 rounded-xl p-3 bg-slate-950/50">
                          <Key size={18} className="text-blue-500 mr-2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 6 Karakter"
                            className="bg-transparent outline-none text-white text-sm w-full"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                        <div className="flex items-center border border-white/5 rounded-2xl p-4 mt-1 bg-slate-950/50 focus-within:border-blue-500/50 shadow-inner transition-all">
                          <Key size={18} className="text-blue-500 mr-3" />
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-transparent outline-none text-white text-sm"
                            placeholder="Password anda..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {errorMsg && <p className="text-[10px] text-red-500 font-bold text-center animate-pulse tracking-wider">⚠️ {errorMsg}</p>}

                    <button type="submit" className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all text-xs shadow-lg ${isChangingPassword ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}>
                      {isChangingPassword ? "Aktifkan Akun" : "Masuk Sekarang"}
                    </button>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
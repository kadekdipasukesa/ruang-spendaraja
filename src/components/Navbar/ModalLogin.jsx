import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Key, UserPlus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function ModalLogin({ isOpen, onClose, onLoginSuccess }) {
  const [inputNama, setInputNama] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [password, setPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClose = () => {
    onClose();
    setIsChangingPassword(false);
    setSelectedSiswa(null);
    setInputNama('');
    setPassword('');
    setNewPassword('');
    setErrorMsg('');
    setShowPassword(false);
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedSiswa) return;

    setIsLoading(true);

    try {
      if (!selectedSiswa.is_registered) {
        if (newPassword.length < 6) {
          setErrorMsg('Password baru harus minimal 6 karakter!');
          setIsLoading(false);
          return;
        }
        const { error } = await supabase
          .from('master_siswa')
          .update({ password: newPassword, is_registered: true })
          .eq('id', selectedSiswa.id);

        if (!error) {
          alert('Selamat! Akun berhasil dibuat. Silakan login.');
          window.location.reload();
        } else {
          setErrorMsg('Gagal mengaktifkan akun. Silakan coba lagi.');
        }
        setIsLoading(false);
        return;
      }

      if (selectedSiswa.password === password) {
        localStorage.setItem('user_siswa', JSON.stringify(selectedSiswa));
        if (onLoginSuccess) {
          onLoginSuccess(selectedSiswa);
        } else {
          window.location.reload();
        }
      } else {
        setErrorMsg('Password salah! Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Terjadi kesalahan saat memproses data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto px-4 py-10 flex justify-center items-start md:justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            id="modal-login-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#1e293b] w-full max-w-sm rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 border border-white/10 my-auto md:my-0 md:mt-4"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                  {isChangingPassword ? 'Buat Akun' : 'Masuk Akun'}
                </h3>
                <div className="h-1.5 w-8 bg-blue-500 rounded-full mt-1 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
              <button
                id="btn-close-modal-login"
                type="button"
                onClick={handleClose}
                className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-xl transition-all group"
              >
                <X size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                  Nama Lengkap
                </label>
                <div className="flex items-center border border-white/5 rounded-2xl p-4 mt-1 bg-slate-950/50 focus-within:border-blue-500/50 shadow-inner transition-all">
                  <User size={18} className="text-blue-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                    placeholder="Cari namamu..."
                    value={selectedSiswa ? selectedSiswa.NAMA : inputNama}
                    onChange={(e) => {
                      setInputNama(e.target.value);
                      setSelectedSiswa(null);
                    }}
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-[#1e293b] border border-white/10 rounded-2xl mt-2 shadow-2xl z-[160] overflow-hidden max-h-40 overflow-y-auto backdrop-blur-xl">
                    {suggestions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedSiswa(s);
                          setSuggestions([]);
                        }}
                        className="p-4 hover:bg-blue-600/20 cursor-pointer text-sm border-b border-white/5 last:border-0 flex justify-between items-center text-white transition-colors"
                      >
                        <span className="font-medium truncate mr-2">{s.NAMA}</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-black uppercase shrink-0">
                          {s.Kelas}
                        </span>
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
                      <p className="text-[11px] text-slate-400 mb-4 uppercase font-black tracking-widest">
                        Akun belum aktif, buat password baru:
                      </p>
                      <div className="flex items-center border border-white/10 rounded-xl p-3 bg-slate-950/50">
                        <Key size={18} className="text-blue-500 mr-2 shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 Karakter"
                          className="bg-transparent outline-none text-white text-sm w-full"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                        Password
                      </label>
                      <div className="flex items-center border border-white/5 rounded-2xl p-4 mt-1 bg-slate-950/50 focus-within:border-blue-500/50 shadow-inner transition-all">
                        <Key size={18} className="text-blue-500 mr-3 shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                          placeholder="Password anda..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <p className="text-[10px] text-red-500 font-bold text-center animate-pulse tracking-wider">
                      ⚠️ {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all text-xs shadow-lg ${
                      isChangingPassword
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading
                      ? 'Memproses...'
                      : isChangingPassword
                      ? 'Aktifkan Akun'
                      : 'Masuk Sekarang'}
                  </button>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

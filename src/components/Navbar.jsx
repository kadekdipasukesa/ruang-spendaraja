import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { School, LogIn, X, User, Key } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  // --- 1. STATE (Penyimpanan Data Sementara) ---
  const [showModal, setShowModal] = useState(false); // Buka/tutup jendela login
  const [user, setUser] = useState(null); // Data siswa yang sedang login
  const [inputNama, setInputNama] = useState(''); // Teks yang diketik di kolom nama
  const [suggestions, setSuggestions] = useState([]); // Daftar rekomendasi nama dari database
  const [selectedSiswa, setSelectedSiswa] = useState(null); // Data siswa yang dipilih dari daftar
  const [password, setPassword] = useState(''); // Input password lama/standar
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Status apakah sedang ganti password
  const [newPassword, setNewPassword] = useState(''); // Input password baru
  const [errorMsg, setErrorMsg] = useState(''); // Menyimpan pesan error jika login gagal

  // --- 2. LOGIC: Cek Status Login saat web dibuka ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // --- 3. LOGIC: Mencari nama di database saat mengetik ---
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

  // --- 4. FUNGSI LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Hapus pesan error lama setiap kali tombol diklik

    if (!selectedSiswa) return;

    // A. Validasi Password
    if (selectedSiswa.password === password) {
      // B. Cek apakah masih pakai password default (123456)
      if (password === '123456' && !isChangingPassword) {
        setIsChangingPassword(true); // Pindah ke tampilan form ganti password
        return;
      }

      // C. Proses Simpan Password Baru
      if (isChangingPassword) {
        if (newPassword.length < 6) {
          setErrorMsg("Password baru harus minimal 6 karakter!");
          return;
        }
        const { error } = await supabase
          .from('master_siswa')
          .update({ password: newPassword, is_registered: true })
          .eq('id', selectedSiswa.id);

        if (!error) {
          alert("Sukses! Akun sudah aktif. Silakan login ulang.");
          window.location.reload();
        }
        return;
      }

      // D. Berhasil Login Normal
      localStorage.setItem('user_siswa', JSON.stringify(selectedSiswa));
      window.location.reload();
    } else {
      // E. JIKA SALAH PASSWORD: Isi state errorMsg
      setErrorMsg("Password salah! Pastikan NISN atau password kamu benar.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_siswa');
    window.location.reload();
  };

  // buat fungsi pembersih state saat klik close di modal
  const closeAndResetModal = () => {
    setShowModal(false);
    setIsChangingPassword(false);
    setSelectedSiswa(null);
    setInputNama('');
    setPassword('');
    setNewPassword('');
    setErrorMsg('');
  };

  return (
    <nav className="bg-[#0f172a]/80 border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-blue-400 font-bold text-xl">
        <School size={28} /> <span className="text-white">Ruang Spenda</span>
      </Link>

      {/* Tampilan Tombol Tergantung Status Login */}
      {user ? (
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">{user.NAMA}</p>
            <p className="text-[10px] text-blue-400 uppercase font-bold">Kelas {user.Kelas}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-400 p-2 rounded-lg hover:bg-red-500/20">
            <X size={18} />
          </button>
        </div>
      ) : (
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all">
          <LogIn size={18} /> <span>Login Siswa</span>
        </button>
      )}

      {/* JENDELA MODAL LOGIN - STRUKTUR SAMA PERSIS DENGAN KODE YANG KAMU MAU */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex justify-center items-start md:justify-end md:p-4">
          <div className="bg-[#1e293b] w-full max-w-sm m-4 rounded-2xl shadow-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-white">Masuk Akun</h3>
              <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-white" /></button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* KOLOM NAMA */}
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Lengkap</label>
                <div className="flex items-center border border-white/10 rounded-xl p-3 mt-1 bg-slate-900/50">
                  <User size={18} className="text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    className="w-full bg-transparent outline-none text-white placeholder:text-gray-600" 
                    placeholder="Cari namamu..."
                    value={selectedSiswa ? selectedSiswa.NAMA : inputNama}
                    onChange={(e) => { setInputNama(e.target.value); setSelectedSiswa(null); }}
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-[#1e293b] border border-white/10 rounded-xl mt-2 shadow-2xl z-[70]">
                    {suggestions.map((s) => (
                      <div key={s.id} onClick={() => { setSelectedSiswa(s); setSuggestions([]); }} className="p-3 hover:bg-blue-600/20 cursor-pointer text-sm border-b border-white/5 last:border-0 flex justify-between text-white">
                        <span>{s.NAMA}</span> <span className="font-bold text-blue-400">{s.Kelas}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* KOLOM PASSWORD / GANTI PASSWORD */}
              {selectedSiswa && (
                <div className="animate-in fade-in">
                  {!isChangingPassword ? (
                    <>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Password</label>
                      <div className={`flex items-center border-2 rounded-xl p-3 mt-1 ${errorMsg ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-slate-900/50'}`}>
                        <Key size={18} className={errorMsg ? 'text-red-500 mr-2' : 'text-gray-400 mr-2'} />
                        <input 
                          type="password" 
                          className="w-full bg-transparent outline-none text-white" 
                          placeholder="Password default 123456"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        />
                      </div>

                      {errorMsg && (
                        <p className="text-xs text-red-500 font-bold mt-2 animate-bounce">⚠️ {errorMsg}</p>
                      )}

                      <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl mt-6 font-bold hover:bg-blue-500 transition-all">Lanjut Masuk</button>
                    </>
                  ) : (
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                      <h4 className="text-sm font-bold text-blue-400 mb-1">🛡️ Buat Password Baru</h4>
                      <p className="text-[10px] text-slate-400 mb-4 font-medium">Buat minimal 6 karakter agar akunmu aman.</p>
                      
                      <div className={`flex items-center border-2 bg-slate-900 rounded-xl p-3 ${errorMsg ? 'border-red-500' : 'border-blue-900'}`}>
                        <Key size={18} className="text-blue-400 mr-2" />
                        <input 
                          type="password" 
                          className="w-full bg-transparent outline-none text-white" 
                          placeholder="Password Baru"
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                          autoFocus
                        />
                      </div>
                      
                      {errorMsg && <p className="text-xs text-red-500 font-bold mt-2">{errorMsg}</p>}

                      <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl mt-4 font-bold hover:bg-green-500 transition-all">Simpan & Login</button>
                    </div>
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
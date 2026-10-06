import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ShieldCheck, Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { updateUserSession } from '../../utils/authStorage';

export default function ModalGantiPassword({ isOpen, onClose, user, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user?.id) {
      setErrorMsg('Sesi pengguna tidak valid. Silakan login kembali.');
      return;
    }

    if (!currentPassword) {
      setErrorMsg('Harap masukkan kata sandi lama Anda.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMsg('Kata sandi baru tidak boleh sama dengan kata sandi lama.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Verifikasi kecocokan kata sandi lama langsung ke Supabase
      const { data: siswaData, error: fetchErr } = await supabase
        .from('master_siswa')
        .select('id, password')
        .eq('id', user.id)
        .single();

      if (fetchErr || !siswaData) {
        setErrorMsg('Gagal memverifikasi akun di database. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      if (siswaData.password !== currentPassword) {
        setErrorMsg('Kata sandi lama yang Anda masukkan salah!');
        setIsLoading(false);
        return;
      }

      // 2. Perbarui kata sandi di Supabase
      const { error: updateErr } = await supabase
        .from('master_siswa')
        .update({ password: newPassword })
        .eq('id', user.id);

      if (updateErr) {
        setErrorMsg('Gagal memperbarui kata sandi: ' + updateErr.message);
        setIsLoading(false);
        return;
      }

      // 3. Perbarui sesi lokal
      const updatedUser = { ...user, password: newPassword };
      updateUserSession(updatedUser);

      setSuccessMsg('Kata sandi berhasil diperbarui! Gunakan sandi baru ini pada login berikutnya.');
      setIsLoading(false);

      if (onSuccess) {
        onSuccess(updatedUser);
      }

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err) {
      console.error('Error ubah sandi:', err);
      setErrorMsg('Terjadi kendala sistem saat mengubah kata sandi.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto px-4 py-8 flex justify-center items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-[#1e293b] w-full max-w-sm rounded-[2rem] shadow-2xl p-6 border border-white/10 my-auto text-white z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Ubah Kata Sandi</h3>
                  <p className="text-[10px] text-slate-400">Amankan akun siswa Spendaraja</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Kata Sandi Lama */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                  Kata Sandi Lama <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center border border-white/10 rounded-xl px-3 py-2.5 bg-slate-950/50 focus-within:border-blue-500/50 transition-all">
                  <Key size={16} className="text-amber-400 mr-2.5 shrink-0" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Masukkan sandi saat ini..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-white text-xs placeholder-slate-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                  Kata Sandi Baru <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center border border-white/10 rounded-xl px-3 py-2.5 bg-slate-950/50 focus-within:border-blue-500/50 transition-all">
                  <ShieldCheck size={16} className="text-blue-400 mr-2.5 shrink-0" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-white text-xs placeholder-slate-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                  Ulangi Kata Sandi Baru <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center border border-white/10 rounded-xl px-3 py-2.5 bg-slate-950/50 focus-within:border-blue-500/50 transition-all">
                  <ShieldCheck size={16} className="text-blue-400 mr-2.5 shrink-0" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ketik ulang sandi baru..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-white text-xs placeholder-slate-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error & Success Messages */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-tight">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-emerald-300 text-xs">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-tight font-medium">{successMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Sandi'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

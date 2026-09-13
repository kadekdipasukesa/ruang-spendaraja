import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Trash2,
  User,
  School,
  Hash,
  CreditCard,
  Sparkles,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { compressImage } from '../../utils/cloudinaryUpload';

export default function ModalProfilUser({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imgError, setImgError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.foto_profile]);

  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa foto/gambar (JPG, PNG, WebP).');
      return;
    }

    // Reset pesan
    setErrorMsg('');
    setSuccessMsg('');
    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatus('Mengompres foto profil...');

    try {
      // 1. Kompresi gambar via HTML5 Canvas (max 1280px, WebP, quality 0.8)
      const compressed = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.8,
      });

      setUploadProgress(40);
      setUploadStatus('Mempersiapkan gambar...');

      // Konversi blob hasil kompresi ke Base64 Data URL
      const reader = new FileReader();
      const dataUri = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
        reader.readAsDataURL(compressed.file);
      });

      setUploadProgress(60);
      setUploadStatus('Mengunggah & menimpa foto di Cloudinary...');

      // 2. Unggah ke server-side endpoint dengan Signed Overwrite
      const uploadResp = await fetch('/api/profile/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          image: dataUri,
        }),
      });

      const uploadResult = await uploadResp.json();
      if (!uploadResp.ok || uploadResult.status !== 'success') {
        throw new Error(uploadResult.error || 'Gagal mengunggah foto profil ke Cloudinary.');
      }

      const uploadedUrl = uploadResult.url;

      setUploadProgress(90);
      setUploadStatus('Menyimpan perubahan ke database...');

      // 3. Simpan URL foto baru ke Supabase pada tabel master_siswa
      const { error: dbError } = await supabase
        .from('master_siswa')
        .update({ foto_profile: uploadedUrl })
        .eq('id', user.id);

      if (dbError) {
        throw new Error(dbError.message || 'Gagal menyimpan foto ke database.');
      }

      // 4. Update data pengguna di local state & localStorage
      const updatedUser = { ...user, foto_profile: uploadedUrl };
      localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      setImgError(false);
      setUploadProgress(100);
      setSuccessMsg('Foto profil berhasil diperbarui!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Gagal memperbarui foto profil:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengunggah foto profil.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user.foto_profile) return;
    setShowConfirmDelete(false);

    setErrorMsg('');
    setSuccessMsg('');
    setIsUploading(true);
    setUploadStatus('Menghapus berkas foto dari Cloudinary...');

    try {
      // 1. Hapus aset fisik di Cloudinary via server-side destroy
      try {
        await fetch('/api/profile/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (cloudErr) {
        console.warn('Gagal menghapus aset fisik dari Cloudinary:', cloudErr);
      }

      setUploadStatus('Menyinkronkan database...');

      // 2. Kosongkan kolom foto_profile di Supabase master_siswa
      const { error: dbError } = await supabase
        .from('master_siswa')
        .update({ foto_profile: null })
        .eq('id', user.id);

      if (dbError) {
        throw new Error(dbError.message || 'Gagal menghapus foto dari database.');
      }

      const updatedUser = { ...user, foto_profile: null };
      localStorage.setItem('user_siswa', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('user-updated', { detail: updatedUser }));

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      setImgError(false);
      setSuccessMsg('Foto profil berhasil dihapus secara permanen.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Gagal menghapus foto profil:', err);
      setErrorMsg(err.message || 'Gagal menghapus foto profil.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] overflow-y-auto px-4 py-8 flex justify-center items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          id="modal-profile-card"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative bg-[#1e293b] w-full max-w-md rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-7 border border-white/10 text-white z-10 my-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                Informasi Pengguna
              </span>
              <h3 className="font-black text-2xl text-white tracking-tight flex items-center gap-2 mt-0.5">
                Profil {user.role === 'admin' ? 'Admin' : 'Siswa'}
              </h3>
              <div className="h-1.5 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            </div>

            <button
              id="btn-close-modal-profil"
              type="button"
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-xl transition-all group"
            >
              <X size={20} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>

          {/* Avatar & Photo Upload Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-blue-500/30 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl flex items-center justify-center relative">
                {user.foto_profile && !imgError ? (
                  <img
                    src={user.foto_profile}
                    alt={user.NAMA}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 text-white select-none">
                    <span className="text-3xl sm:text-4xl font-black tracking-wider drop-shadow-md">
                      {getInitials(user.NAMA)}
                    </span>
                  </div>
                )}

                {/* Loading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-full p-2 text-center">
                    <Loader2 size={28} className="text-blue-400 animate-spin mb-1" />
                    <span className="text-[10px] font-bold text-slate-200">
                      {uploadProgress}%
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Camera Button */}
              <button
                id="btn-trigger-upload-photo"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Ganti Foto Profil"
                className="absolute bottom-1 right-1 p-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-full shadow-xl border-2 border-slate-900 transition-all cursor-pointer hover:scale-110 disabled:opacity-50"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                id="avatar-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Camera size={13} />
                <span>{user.foto_profile ? 'Ganti Foto' : 'Pasang Foto'}</span>
              </button>

              {user.foto_profile && (
                showConfirmDelete ? (
                  <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-xl animate-in fade-in zoom-in duration-200">
                    <span className="text-[11px] font-semibold text-rose-300">Hapus foto?</span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isUploading}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all active:scale-95"
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={isUploading}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={isUploading}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                )
              )}
            </div>

            {/* Status & Alerts */}
            {isUploading && (
              <div className="w-full mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-medium">
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl w-full">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl w-full">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Student Information Details Grid */}
          <div className="space-y-2.5 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <User size={14} className="text-blue-400" />
                <span>Nama Lengkap</span>
              </div>
              <span className="font-bold text-sm text-white text-right truncate max-w-[200px]">
                {user.NAMA}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <School size={14} className="text-amber-400" />
                <span>Kelas</span>
              </div>
              <span className="font-bold text-xs bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-lg border border-blue-500/30">
                {user.Kelas || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Hash size={14} className="text-emerald-400" />
                <span>No. Absen</span>
              </div>
              <span className="font-bold text-sm text-white">
                {user['No Absen'] || user.no_absen || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <CreditCard size={14} className="text-purple-400" />
                <span>NISN</span>
              </div>
              <span className="font-mono text-xs text-slate-300">
                {user.NISN || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Total Poin</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-lg">
                <span className="text-xs font-black text-yellow-400">
                  {user.total_points ?? 0}
                </span>
                <span className="text-[9px] font-bold text-yellow-500/80 uppercase">
                  Poin
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <ShieldCheck size={14} className="text-teal-400" />
                <span>Status Akun</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.role === 'admin' ? 'Administrator' : 'Siswa Aktif'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              id="btn-modal-profil-logout"
              type="button"
              onClick={onLogout}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Keluar Akun</span>
            </button>

            <button
              id="btn-modal-profil-close"
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

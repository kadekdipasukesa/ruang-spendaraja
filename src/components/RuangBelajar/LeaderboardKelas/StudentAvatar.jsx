import { useState, useEffect } from 'react';

/**
 * Helper untuk mendapatkan inisial nama siswa (maksimal 2 karakter)
 */
export function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Palet warna gradien inisial avatar yang konsisten berdasarkan ID / nama siswa
 */
export function getAvatarGradient(key) {
  const gradients = [
    'from-amber-500 to-orange-600 text-white',
    'from-blue-500 to-indigo-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-purple-500 to-pink-600 text-white',
    'from-rose-500 to-red-600 text-white',
    'from-cyan-500 to-blue-600 text-white'
  ];
  const hash = (key || '').toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

/**
 * Komponen Avatar Siswa dengan penanganan gambar error & inisial
 */
export default function StudentAvatar({ photoUrl, name, id, size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [photoUrl]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-base sm:text-lg',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-xl'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (photoUrl && !hasError) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden bg-slate-100 ${selectedSize} ${className}`}>
        <img
          src={photoUrl}
          alt={name || 'Foto Siswa'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>
    );
  }

  const gradient = getAvatarGradient(id || name);
  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center font-black select-none bg-gradient-to-br shadow-inner ${gradient} ${selectedSize} ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}

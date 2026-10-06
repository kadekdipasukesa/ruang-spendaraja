/**
 * Utilitas Manajemen Sesi Autentikasi Pengguna (Ruang Spendaraja)
 * Menangani pemisahan sesi Komputer Lab vs Perangkat Pribadi ("Ingat Saya")
 * serta pembersihan otomatis saat browser ditutup di komputer bersama.
 */

const STORAGE_KEY = 'user_siswa';
const REMEMBER_KEY = 'user_remember_me';
const SESSION_ACTIVE_KEY = 'user_session_active';

/**
 * Menyimpan sesi pengguna saat login
 * @param {object} user - Data pengguna dari master_siswa
 * @param {boolean} rememberMe - True jika perangkat pribadi (localStorage), False jika komputer lab (sessionStorage)
 */
export function saveUserSession(user, rememberMe = false) {
  if (!user) return;
  try {
    const userString = JSON.stringify(user);
    
    // Tandai bahwa sesi sedang aktif di tab/jendela ini
    sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    sessionStorage.setItem(STORAGE_KEY, userString);

    // Simpan ke localStorage agar seluruh modul dapat mengaksesnya
    localStorage.setItem(STORAGE_KEY, userString);
    localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
  } catch (err) {
    console.error('Gagal menyimpan sesi pengguna:', err);
  }
}

/**
 * Mengambil data sesi pengguna tersimpan dengan validasi sesi lab
 * @returns {object|null}
 */
export function getStoredUserSession() {
  try {
    const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
    const isSessionActive = sessionStorage.getItem(SESSION_ACTIVE_KEY) === 'true';
    const rawUser = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    // Jika pengguna TIDAK mencentang "Ingat Saya" (misal di komputer lab bersama)
    // dan browser baru saja dibuka kembali (sessionActive bernilai null):
    if (!rememberMe && !isSessionActive) {
      // Hapus data sisa sesi di komputer lab agar tidak nyangkut ke siswa berikutnya
      clearUserSession();
      return null;
    }

    // Jika tab masih aktif di sesi lab, pastikan penanda tetap hidup
    if (!rememberMe && isSessionActive) {
      sessionStorage.setItem(SESSION_ACTIVE_KEY, 'true');
    }

    return JSON.parse(rawUser);
  } catch (err) {
    console.warn('Gagal membaca sesi pengguna:', err);
    clearUserSession();
    return null;
  }
}

/**
 * Memperbarui data pengguna di sesi yang aktif
 * @param {object} updatedUser 
 */
export function updateUserSession(updatedUser) {
  if (!updatedUser) return;
  try {
    const userString = JSON.stringify(updatedUser);
    if (sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, userString);
    }
    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, userString);
    }
  } catch (err) {
    console.error('Gagal memperbarui sesi pengguna:', err);
  }
}

/**
 * Menghapus seluruh sesi pengguna (Logout)
 */
export function clearUserSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_ACTIVE_KEY);
  } catch (err) {
    console.error('Gagal membersihkan sesi pengguna:', err);
  }
}

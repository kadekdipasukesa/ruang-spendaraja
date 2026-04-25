// src/utils/appPermissions.js

export const checkAppAccess = (appId, student) => {
    const isAdmin = student?.role === 'admin';
    const kelas = student?.Kelas || "";
  
    // Definisikan aturan di sini
    const rules = {
      tik7: () => {
        // Izinkan jika Admin ATAU Kelas 7 (7.1 - 7.11)
        const isClass7 = /^7\.(1[0-1]|[1-9])$/.test(kelas);
        return isAdmin || isClass7;
      },
      // Jika ada app lain yang butuh aturan khusus, tambah di sini
      // presensi: () => isAdmin || kelas.startsWith('8'), 
    };
  
    // Jika appId ada di rules, jalankan fungsinya. 
    // Jika tidak ada di rules, berarti app tersebut terbuka untuk umum (true).
    return rules[appId] ? rules[appId]() : true;
  };
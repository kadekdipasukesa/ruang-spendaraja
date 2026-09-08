/**
 * Utilitas dan fungsi pembantu untuk fitur Live Chat Ruang Spendaraja
 */

// Format nama: 2 kata (nama tengah dan belakang) dengan format Title Case (misal: "KADEK DIPA SUKESA" -> "Dipa Sukesa")
export const getShortName = (fullName) => {
    if (!fullName) return "User";
    const parts = fullName.trim().split(/\s+/);
    const selectedParts = parts.length <= 1 ? parts : parts.slice(-2);
    return selectedParts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const getNameColor = (name) => {
    const colors = [
        'text-emerald-400', 'text-orange-400', 'text-pink-400',
        'text-amber-400', 'text-cyan-400', 'text-lime-400',
        'text-violet-400', 'text-fuchsia-400'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Memeriksa apakah suatu pesan ditujukan untuk 'siswa' atau 'guru'
 * - Berdasarkan target_id: 'group_guru' -> khusus guru, 'group_siswa' -> khusus siswa
 * - Fallback untuk backward-compatibility dengan skema lama
 */
export const isMessageInRoom = (msg, targetRoom) => {
    if (!msg) return false;

    // 1. Skema Baru: Kolom target_id ('group_guru' / 'group_siswa')
    if (msg.target_id) {
        if (msg.target_id === 'group_guru') return targetRoom === 'guru';
        if (msg.target_id === 'group_siswa') return targetRoom === 'siswa';
        return false;
    }

    // 2. Skema Lama (Fallback jika ada data transisi)
    const msgRole = String(msg.role || '').toLowerCase().trim();
    const msgKelas = String(msg.kelas || '').toLowerCase().trim();

    if (msgRole === 'guru' || msgKelas === 'ruang guru') {
        return targetRoom === 'guru';
    }
    if (msgRole === 'siswa' || msgRole === 'osis') {
        return targetRoom === 'siswa';
    }
    if (msgRole === 'admin') {
        if (msgKelas === 'ruang guru') {
            return targetRoom === 'guru';
        }
        return targetRoom === 'siswa';
    }
    return targetRoom === 'siswa';
};

/**
 * Menampilkan label peran atau kelas pengirim.
 * Jika pengirim adalah Admin (atau kelas 'Ruang Guru' / 'Ruang Siswa'), tampilkan 'Admin'.
 */
export const getSenderRoleOrClass = (sender, fallbackMsg) => {
    const roleLower = String(sender?.role || fallbackMsg?.role || '').toLowerCase().trim();
    const kelas = sender?.Kelas || sender?.KELAS || fallbackMsg?.kelas || '';
    const kelasLower = String(kelas).toLowerCase().trim();

    if (roleLower === 'admin' || kelasLower === 'ruang guru' || kelasLower === 'ruang siswa') {
        return 'Admin';
    }
    if (roleLower === 'guru') {
        return 'Guru';
    }
    return kelas;
};

export const CLASSES = ["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"];

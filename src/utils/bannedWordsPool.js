// src/utils/bannedWordsPool.js

// 1. Daftar kata dasar (cukup tulis kata dasarnya saja)
export const BANNED_WORDS = [
    // --- NASIONAL & PLESETAN ---
    "anjing", "anjeng", "ajing", "anying", "anj", "anjir", "anjrot", "anjng",
    "babi", "baby", "babay",
    "bangsat", "bangsad", "bgst", "bangshat",
    "tolol", "tol0l", "goblok", "goblog", "gblk", "geblek",
    "peler", "memek", "meki", "fefek", "pepek", "pukimak", "ngetot",
    "kontol", "k0nt0l", "contol", "kntl", "knthol", "titit", "pentil",
    "setan", "iblis", "lonthe", "lonte", "perek", "jablay", "fefek",

    // --- BAHASA BALI (Kasar/Umpatan) ---
    "ci", "cai", "nyai", // (Kasar jika konteksnya merendahkan)
    "bangke", "pirate", "buduh", "belog", "lengeh",
    "leak", "nasne", "naskleng", "naskleeng", "naskeleng", 

    // --- BAHASA JAWA (Kasar/Umpatan) ---
    "asune", "asu", "cok", "jancok", "jancuk", "dancok", "cuk",
    "ndasmu", "ndas", "matamu", "matane", "lambemu",
    "pekok", "kenthu", "tempik", "jembut", "gapleki",
    "kere", "modar", "mampus", "munyuk", "asu",

    // --- TOKOH & PRESIDEN (Mencegah Penghinaan) ---
    "soeharto", "suharto", 
    "bj habibie",
    "gusdur",
    "megawati", "mega", "banteng",
    "sby", "susilo bambang yudhoyono",
    "jokowi", "jokowidodo", "mulyono",
    "prabowo", "gibran", "rakabuming"
];

// 2. Fungsi pembersih yang cerdas
export const filterBadWords = (text) => {
    if (!text) return "";
    
    let filteredText = text;

    // Sortir dari kata terpanjang ke terpendek agar 'jancok' diproses sebelum 'cok'
    const sortedWords = [...BANNED_WORDS].sort((a, b) => b.length - a.length);

    sortedWords.forEach(word => {
        const pattern = word
            .split('')
            .map(char => {
                let c = char.toLowerCase();
                if (c === 'a') return '[a4@\\^]';
                if (c === 'i') return '[i1!l\\|]';
                if (c === 'o') return '[o0]';
                if (c === 's') return '[s5$]';
                if (c === 'g') return '[g9]';
                if (c === 'e') return '[e3]';
                if (c === 't') return '[t7]';
                if (c === 'b') return '[b8]';
                if (c === 'k') return '[kc]';
                return c;
            })
            .join('[\\s\\W_]*');

        /**
         * PERBAIKAN DI SINI:
         * Untuk kata yang sangat pendek (2-3 huruf), kita wajib pakai Boundary (\b)
         * Agar "ci" tersensor tapi "cinta" tidak.
         * Untuk kata panjang (>= 4), kita biarkan tanpa boundary agar tetap agresif.
         */
        let regex;
        if (word.length <= 3) {
            // Hanya sensor jika berdiri sendiri sebagai kata
            regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        } else {
            // Tetap agresif untuk kata panjang
            regex = new RegExp(pattern, 'gi');
        }
        
        filteredText = filteredText.replace(regex, (match) => "*".repeat(match.length));
    });
    
    return filteredText;
};
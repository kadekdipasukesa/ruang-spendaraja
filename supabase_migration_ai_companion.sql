-- ==================================================================================
-- MIGRASI SUPABASE: FITUR MEMORI & CHAT TEMAN BELAJAR AI (@aurora & @arunika)
-- AMAN: Tidak merubah / memodifikasi tabel yang sudah ada sama sekali!
-- Hanya membuat 2 tabel baru yang berelasi ke master_siswa(id)
-- ==================================================================================

-- 1. TABEL MEMORI PERMANEN (1 Baris per Siswa per Karakter)
-- Mengingat kepribadian, hobi, progres tugas, dan gaya bicara siswa
CREATE TABLE IF NOT EXISTS public.ai_companion_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Terhubung ke id tabel master_siswa tanpa merubah tabel master_siswa
    siswa_id INTEGER NOT NULL REFERENCES public.master_siswa(id) ON DELETE CASCADE,
    
    -- Karakter: 'aurora' atau 'arunika'
    character TEXT NOT NULL DEFAULT 'aurora' CHECK (character IN ('aurora', 'arunika')),
    
    -- Ringkasan profil kepribadian murid (maks 1-2 paragraf padat)
    profil_siswa TEXT DEFAULT 'Murid kelas 7 baru menyapa, gaya santai.',
    
    -- Ringkasan topik terakhir yang sedang dibahas
    topik_terakhir TEXT DEFAULT 'Baru perkenalan pertama kali.',
    
    -- Status suasana hati / mood
    mood_siswa TEXT DEFAULT 'santai',
    
    -- Total interaksi obrolan
    total_obrolan INTEGER DEFAULT 0,
    
    last_interacted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- GARANSI KEAMANAN: 1 Siswa hanya punya 1 catatan untuk Aurora & 1 untuk Arunika
    CONSTRAINT unique_siswa_companion_memory UNIQUE (siswa_id, character)
);

-- Indeks pencarian memori cepat
CREATE INDEX IF NOT EXISTS idx_ai_companion_memory_lookup 
ON public.ai_companion_memory (siswa_id, character);


-- 2. TABEL RIWAYAT CHAT AKTIF & JEDA RESPON (Delayed Chat)
-- Menyimpan chat aktif untuk mendukung jeda waktu balas realistis (2-10 menit)
CREATE TABLE IF NOT EXISTS public.ai_companion_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Terhubung ke id tabel master_siswa
    siswa_id INTEGER NOT NULL REFERENCES public.master_siswa(id) ON DELETE CASCADE,
    
    character TEXT NOT NULL DEFAULT 'aurora' CHECK (character IN ('aurora', 'arunika')),
    
    -- Pengirim pesan: 'student' (murid) atau 'companion' (Aurora/Arunika)
    sender TEXT NOT NULL CHECK (sender IN ('student', 'companion')),
    
    message_text TEXT NOT NULL,
    
    -- Status pesan: 'sent', 'read', 'typing', 'replied'
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'typing', 'replied')),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks pencarian riwayat chat per siswa
CREATE INDEX IF NOT EXISTS idx_ai_companion_messages_siswa 
ON public.ai_companion_messages (siswa_id, character, created_at DESC);


-- 3. TRIGGER OTOMATIS: Update Kolom updated_at & last_interacted_at
CREATE OR REPLACE FUNCTION public.trg_fn_update_ai_memory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_interacted_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ai_companion_memory_timestamp ON public.ai_companion_memory;
CREATE TRIGGER trg_ai_companion_memory_timestamp
BEFORE UPDATE ON public.ai_companion_memory
FOR EACH ROW
EXECUTE FUNCTION public.trg_fn_update_ai_memory_timestamp();

-- 4. Enable Row Level Security (RLS) & Kebijakan Akses Publik (Anon)
ALTER TABLE public.ai_companion_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_companion_messages ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses penuh untuk anon client Ruang Spendaraja
DROP POLICY IF EXISTS "Allow anon all on ai_companion_memory" ON public.ai_companion_memory;
CREATE POLICY "Allow anon all on ai_companion_memory" 
ON public.ai_companion_memory FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on ai_companion_messages" ON public.ai_companion_messages;
CREATE POLICY "Allow anon all on ai_companion_messages" 
ON public.ai_companion_messages FOR ALL USING (true) WITH CHECK (true);

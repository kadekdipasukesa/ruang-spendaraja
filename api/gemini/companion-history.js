/* global process */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://qatnbjebroskmswrjvex.supabase.co';

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdG5iamVicm9za21zd3JqdmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MDMyMDMsImV4cCI6MjA4NTA3OTIwM30.rRvcpptkY8kAvIwF8E2cQOLqR6AjJQtq8t2cqZRwQqM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
      messages: [],
      memory: null
    });
  }

  try {
    const studentId = req.query.studentId ? Number(req.query.studentId) : null;
    const character = req.query.character || 'aurora';

    if (!studentId || isNaN(studentId)) {
      return res.status(200).json({ messages: [], memory: null });
    }

    // Ambil data ringkasan memori
    let memData = null;
    try {
      const { data } = await supabase
        .from('ai_companion_memory')
        .select('profil_siswa, topik_terakhir, mood_siswa, total_obrolan, updated_at')
        .eq('siswa_id', studentId)
        .eq('character', character)
        .maybeSingle();
      memData = data;
    } catch (e) {
      console.warn('ai_companion_memory query skipped:', e);
    }

    // Ambil 25 riwayat pesan terakhir
    let msgData = [];
    try {
      const { data } = await supabase
        .from('ai_companion_messages')
        .select('id, sender, message_text, status, created_at')
        .eq('siswa_id', studentId)
        .eq('character', character)
        .order('created_at', { ascending: true })
        .limit(25);
      if (Array.isArray(data)) {
        msgData = data;
      }
    } catch (e) {
      console.warn('ai_companion_messages query skipped:', e);
    }

    return res.status(200).json({
      memory: memData || null,
      messages: msgData || []
    });
  } catch (err) {
    console.error('Error in Vercel companion-history handler:', err);
    return res.status(200).json({
      error: err.message || 'Gagal memuat riwayat.',
      memory: null,
      messages: []
    });
  }
}

import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAntiCheat(enabled, peserta, onViolation) {
  useEffect(() => {
    if (!enabled || !peserta) return;

    const handleVisibility = async () => {
      if (document.visibilityState === 'hidden') {
        const newCount = (peserta.cheat_count || 0) + 1;
        const { data } = await supabase
          .from('ujian_peserta')
          .update({ 
            cheat_count: newCount,
            status_ujian: newCount >= 3 ? 'blocked' : 'working'
          })
          .eq('id', peserta.id)
          .select().single();
        
        onViolation(data);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [enabled, peserta]);
}
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useExamRealtime(sesiId, pesertaId, callbacks) {
  useEffect(() => {
    if (!sesiId) return;

    const channel = supabase
      .channel(`ujian_${sesiId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', schema: 'public', table: 'ujian_sesi', filter: `id=eq.${sesiId}` 
      }, (payload) => {
        if (payload.new.status === 'starting') callbacks.onStarting();
        callbacks.onSesiUpdate(payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'ujian_peserta', filter: `id=eq.${pesertaId}`
      }, (payload) => {
        callbacks.onPesertaUpdate(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [sesiId, pesertaId]);
}
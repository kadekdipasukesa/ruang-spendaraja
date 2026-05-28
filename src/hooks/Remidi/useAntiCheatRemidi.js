import { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useAntiCheatRemidi(isActive, peserta, onCheatDetected) {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!isActive || !peserta || peserta.status_ujian !== 'working') return;

        const handleVisibilityChange = async () => {
            if (document.hidden) {
                const nextCount = (peserta.cheat_count || 0) + 1;
                const nextStatus = nextCount >= 3 ? 'blocked' : 'working';

                console.warn(`Siswa keluar jendela! Pelanggaran ke: ${nextCount}`);

                const { data, error } = await supabase
                    .from('remidi_peserta')
                    .update({ cheat_count: nextCount, status_ujian: nextStatus })
                    .eq('id', peserta.id)
                    .select()
                    .single();

                if (!error && data) {
                    onCheatDetected(data);
                    if (nextStatus === 'blocked') {
                        alert("Aplikasi terkunci otomatis! Kamu terdeteksi keluar dari ujian sebanyak 3 kali.");
                    } else {
                        alert(`Dilarang keluar! Pelanggaran ke-${nextCount}/3. Jika mencapai 3 kali, ujian diblokir.`);
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isActive, peserta, onCheatDetected]);
}
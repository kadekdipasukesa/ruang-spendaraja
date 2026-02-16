import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Leaderboard({ table }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from(table)
        .select('*')
        .order('score', { ascending: false })
        .limit(5);
      setScores(data || []);
    };
    fetchScores();

    // Realtime update leaderboard
    const channel = supabase.channel('leaderboard_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: table }, fetchScores)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [table]);

  return (
    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 mt-6">
      <h4 className="text-yellow-500 font-bold mb-3 flex items-center gap-2 text-sm uppercase">🏆 Top 5 Player</h4>
      <div className="space-y-2">
        {scores.map((s, i) => (
          <div key={s.id} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-lg">
            <span className="text-slate-300">{i + 1}. {s.nama} ({s.kelas})</span>
            <span className="text-blue-400 font-bold">{s.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
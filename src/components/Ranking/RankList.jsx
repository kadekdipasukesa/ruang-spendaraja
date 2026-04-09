import React, { useMemo } from 'react'; // Tambahkan useMemo
import { Trophy, Medal, Star, User } from 'lucide-react';

export default function RankList({ students, currentUser }) {
  // Gunakan useMemo agar sorting hanya berjalan jika data 'students' benar-benar berubah
  const sortedRanking = useMemo(() => {
    return [...students].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
  }, [students]);
  
  const topTen = useMemo(() => sortedRanking.slice(0, 10), [sortedRanking]);
  
  const myRankIndex = sortedRanking.findIndex(s => s.id === currentUser?.id);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SECTION 1: PODIUM TOP 3 */}
      <div className="grid grid-cols-3 gap-3 items-end pb-4 pt-8">
        {/* JUARA 2 */}
        {topTen[1] && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center overflow-hidden">
                <User size={32} className="text-slate-400" />
              </div>
              <div className="absolute -top-2 -right-2 bg-slate-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">2</div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-[10px] uppercase truncate w-20">{topTen[1].NAMA}</p>
              <p className="text-slate-400 font-black text-xs">{topTen[1].total_points} PT</p>
            </div>
          </div>
        )}

        {/* JUARA 1 */}
        {topTen[0] && (
          <div className="flex flex-col items-center gap-2 transform -translate-y-4">
            <div className="relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                <Trophy size={32} className="text-yellow-400" />
              </div>
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <User size={40} className="text-yellow-500" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-black w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ring-4 ring-slate-900">1</div>
            </div>
            <div className="text-center">
              <p className="text-yellow-400 font-black text-xs uppercase truncate w-24">{topTen[0].NAMA}</p>
              <p className="text-yellow-500 font-black text-sm">{topTen[0].total_points} PT</p>
            </div>
          </div>
        )}

        {/* JUARA 3 */}
        {topTen[2] && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-orange-900/20 border-2 border-orange-700 flex items-center justify-center overflow-hidden">
                <User size={32} className="text-orange-700" />
              </div>
              <div className="absolute -top-2 -right-2 bg-orange-700 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">3</div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-[10px] uppercase truncate w-20">{topTen[2].NAMA}</p>
              <p className="text-orange-600 font-black text-xs">{topTen[2].total_points} PT</p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: LIST TABLE */}
      <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Star size={16} className="text-yellow-500" /> Leaderboard Top 10
          </h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {topTen.map((student, index) => {
            const isMe = student.id === currentUser?.id;
            const rank = index + 1;
            
            return (
              <div key={student.id} className={`flex items-center gap-4 p-4 transition-all ${isMe ? 'bg-blue-600/20' : ''}`}>
                <div className="w-8 flex justify-center">
                  {rank === 1 && <Trophy size={18} className="text-yellow-500" />}
                  {rank === 2 && <Medal size={18} className="text-slate-400" />}
                  {rank === 3 && <Medal size={18} className="text-orange-600" />}
                  {rank > 3 && <span className="text-slate-500 font-black text-sm">{rank}</span>}
                </div>
                
                <div className="flex-1">
                  <p className={`font-bold text-sm ${isMe ? 'text-blue-400' : 'text-slate-200'}`}>
                    {student.NAMA} {isMe && "(Saya)"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Kelas {student.Kelas}</p>
                </div>

                <div className="text-right">
                  <p className={`font-black text-sm ${rank <= 3 ? 'text-yellow-500' : 'text-white'}`}>
                    {student.total_points ?? 0}
                  </p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Points</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: MY RANKING FOOTER (Hanya muncul jika user tidak masuk top 10) */}
      {myRank > 10 && (
        <div className="bg-blue-600 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center font-black text-white">
              #{myRank}
            </div>
            <div>
              <p className="text-white font-bold text-sm">Peringkat Kamu</p>
              <p className="text-blue-100 text-xs">Terus kumpulkan poin untuk masuk Top 10!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-xl">{currentUser.total_points}</p>
            <p className="text-blue-200 text-[8px] font-bold uppercase">Points</p>
          </div>
        </div>
      )}
    </div>
  );
}
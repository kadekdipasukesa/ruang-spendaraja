import { Trophy, Crown, Medal, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import StudentAvatar from './StudentAvatar';

export default function PodiumThree({ topThree = [], onSelectStudent }) {
  if (!topThree || topThree.length < 2) return null;

  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 items-end">
        {/* JUARA 2 (Perak - Tampil di Kiri pada Desktop) */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={() => onSelectStudent && onSelectStudent(topThree[1], 2)}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative overflow-hidden group hover:border-slate-400 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            title={`Klik untuk melihat riwayat perolehan nilai ${topThree[1].NAMA}`}
          >
            {/* Silver Pedestal Indicator */}
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                <Medal className="w-4 h-4 text-slate-400" />
                <span>Peringkat 2</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                🥈 Perak
              </span>
            </div>

            {/* Avatar Siswa */}
            <div className="relative my-2">
              <StudentAvatar
                photoUrl={topThree[1].foto_profile}
                name={topThree[1].NAMA}
                id={topThree[1].id}
                size="lg"
                className="ring-3 ring-slate-300 ring-offset-2 shadow-sm group-hover:ring-slate-400 transition-all"
              />
              <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 border-2 border-white flex items-center justify-center font-black text-[11px] shadow-xs">
                2
              </div>
            </div>

            <h3
              className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 line-clamp-1 w-full group-hover:text-amber-800 transition-colors"
              title={topThree[1].NAMA}
            >
              {topThree[1].NAMA}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Kelas {topThree[1].Kelas} · No. Absen {topThree[1]['No Absen'] || '-'}
            </p>

            <div className="mt-4 w-full py-2 px-3 rounded-2xl bg-slate-50 group-hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between transition-colors">
              <span className="text-[11px] font-bold text-slate-500">Skor Akhir</span>
              <span className="text-sm font-black text-slate-800 font-mono tabular-nums">
                {topThree[1].total_points || 0} <span className="text-xs font-medium text-slate-500">pt</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-semibold mt-2 group-hover:text-amber-600 transition-colors">
              Klik untuk lihat riwayat nilai &rarr;
            </span>
          </motion.div>
        )}

        {/* JUARA 1 (Emas - Podium Tengah Lebih Tinggi) */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => onSelectStudent && onSelectStudent(topThree[0], 1)}
            className="bg-gradient-to-b from-amber-500/10 via-amber-50/20 to-white rounded-3xl border-2 border-amber-400/90 p-6 shadow-md shadow-amber-500/10 flex flex-col items-center text-center order-1 md:order-2 relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1.5 transition-all cursor-pointer"
            title={`Klik untuk melihat riwayat perolehan nilai ${topThree[0].NAMA}`}
          >
            {/* Crown Banner */}
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Juara 1</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                🥇 Emas
              </span>
            </div>

            {/* Avatar Siswa Juara 1 */}
            <div className="relative my-2">
              <StudentAvatar
                photoUrl={topThree[0].foto_profile}
                name={topThree[0].NAMA}
                id={topThree[0].id}
                size="xl"
                className="ring-4 ring-amber-400 ring-offset-2 shadow-md group-hover:ring-amber-500 transition-all"
              />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-400 text-amber-950 flex items-center justify-center shadow-sm">
                <Crown className="w-4 h-4 text-yellow-950 fill-yellow-950" />
              </div>
              <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-2 border-white flex items-center justify-center font-black text-xs shadow-xs">
                1
              </div>
            </div>

            <h3
              className="text-base sm:text-lg font-black text-slate-900 mt-2 line-clamp-1 w-full group-hover:text-amber-900 transition-colors"
              title={topThree[0].NAMA}
            >
              {topThree[0].NAMA}
            </h3>

            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Kelas {topThree[0].Kelas} · No. Absen {topThree[0]['No Absen'] || '-'}
            </p>

            <div className="mt-4 w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-amber-100">Skor Juara</span>
              <span className="text-base font-black font-mono tabular-nums">
                {topThree[0].total_points || 0} <span className="text-xs font-semibold">pt</span>
              </span>
            </div>

            <span className="text-[10px] text-amber-700 font-extrabold mt-2 flex items-center gap-1 group-hover:underline">
              <span>Buka Detail Riwayat Poin</span>
              <span>&rarr;</span>
            </span>
          </motion.div>
        )}

        {/* JUARA 3 (Perunggu - Tampil di Kanan pada Desktop) */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => onSelectStudent && onSelectStudent(topThree[2], 3)}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center order-3 md:order-3 relative overflow-hidden group hover:border-amber-300 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            title={`Klik untuk melihat riwayat perolehan nilai ${topThree[2].NAMA}`}
          >
            {/* Bronze Pedestal Indicator */}
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs font-black text-amber-900/80 flex items-center gap-1">
                <Medal className="w-4 h-4 text-amber-600" />
                <span>Peringkat 3</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-800">
                🥉 Perunggu
              </span>
            </div>

            {/* Avatar Siswa */}
            <div className="relative my-2">
              <StudentAvatar
                photoUrl={topThree[2].foto_profile}
                name={topThree[2].NAMA}
                id={topThree[2].id}
                size="lg"
                className="ring-3 ring-amber-600/50 ring-offset-2 shadow-sm group-hover:ring-amber-600 transition-all"
              />
              <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-100 text-amber-800 border-2 border-white flex items-center justify-center font-black text-[11px] shadow-xs">
                3
              </div>
            </div>

            <h3
              className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 line-clamp-1 w-full group-hover:text-amber-800 transition-colors"
              title={topThree[2].NAMA}
            >
              {topThree[2].NAMA}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Kelas {topThree[2].Kelas} · No. Absen {topThree[2]['No Absen'] || '-'}
            </p>

            <div className="mt-4 w-full py-2 px-3 rounded-2xl bg-amber-50/60 group-hover:bg-amber-100/60 border border-amber-200/60 flex items-center justify-between transition-colors">
              <span className="text-[11px] font-bold text-amber-800">Skor Akhir</span>
              <span className="text-sm font-black text-amber-900 font-mono tabular-nums">
                {topThree[2].total_points || 0} <span className="text-xs font-medium text-amber-700">pt</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-semibold mt-2 group-hover:text-amber-600 transition-colors">
              Klik untuk lihat riwayat nilai &rarr;
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

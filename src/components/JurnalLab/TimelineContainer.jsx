import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Clock, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import TimelineCard from './TimelineCard';

export default function TimelineContainer({
    items,
    role,
    role_2,
    isPengurusLab,
    user,
    onApprove,
    onComplete,
    onEdit, // <-- 1. Terima prop onEdit di sini
    onDelete
}) {
    const [timeWITA, setTimeWITA] = useState('');
    const [openGroups, setOpenGroups] = useState({});
    const scrollRef = useRef(null);

    const getLocalDateString = (d) => {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formatter.format(d);
    };

    const todayDayKey = useMemo(() => getLocalDateString(new Date()), []);
    const todayMonthKey = useMemo(() => todayDayKey.substring(0, 7), [todayDayKey]);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Makassar',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            setTimeWITA(new Intl.DateTimeFormat('id-ID', options).format(now).replace('.', ':'));
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const groupedData = useMemo(() => {
        const months = {};
        const safeItems = items || []; // Mencegah crash jika items undefined

        safeItems.forEach((item) => {
            const dateObj = new Date(item.waktu_mulai);
            if (isNaN(dateObj.getTime())) return;

            const dayKey = getLocalDateString(dateObj);
            const monthKey = dayKey.substring(0, 7);

            if (!months[monthKey]) {
                months[monthKey] = {
                    monthKey,
                    label: dateObj.toLocaleDateString('id-ID', { timeZone: 'Asia/Makassar', month: 'long', year: 'numeric' }),
                    days: {},
                    totalItems: 0
                };
            }

            if (!months[monthKey].days[dayKey]) {
                months[monthKey].days[dayKey] = {
                    dayKey,
                    label: dateObj.toLocaleDateString('id-ID', { timeZone: 'Asia/Makassar', weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
                    items: []
                };
            }

            months[monthKey].days[dayKey].items.push(item);
            months[monthKey].totalItems += 1;
        });

        return months;
    }, [items]);

    useEffect(() => {
        if (Object.keys(groupedData).length === 0) return;

        const initialState = {};
        Object.keys(groupedData).forEach((mKey) => {
            initialState[`month_${mKey}`] = (mKey === todayMonthKey);

            Object.keys(groupedData[mKey].days).forEach((dKey) => {
                initialState[`day_${dKey}`] = (dKey === todayDayKey);
            });
        });

        setOpenGroups(initialState);
    }, [groupedData, todayMonthKey, todayDayKey]);

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const monthKeys = Object.keys(groupedData).sort().reverse();

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl max-w-5xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Jurnal Kegiatan Lab</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs font-mono font-bold text-emerald-400 shadow-inner">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{timeWITA || '00:00:00'} WITA</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 space-y-3"
            >
                {monthKeys.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-xs">
                        Belum ada jadwal penggunaan lab.
                    </div>
                ) : (
                    monthKeys.map((mKey) => {
                        const monthGroup = groupedData[mKey];
                        const isMonthOpen = Boolean(openGroups[`month_${mKey}`]);
                        const dayKeys = Object.keys(monthGroup.days).sort().reverse();

                        const monthPendingCount = Object.values(monthGroup.days).reduce(
                            (acc, day) => acc + day.items.filter((item) => item.status_pengajuan === 'pending').length,
                            0
                        );

                        return (
                            <div key={mKey} className="border border-slate-800/80 rounded-xl bg-slate-950/40 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(`month_${mKey}`)}
                                    className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/80 transition-colors text-left cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Calendar className="w-4 h-4 text-indigo-400" />
                                        <span className="text-xs font-bold text-white capitalize">{monthGroup.label}</span>
                                        {monthPendingCount > 0 && (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"></span>
                                                </span>
                                                <span>{monthPendingCount} Belum di-ACC</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                                            {monthGroup.totalItems} Kegiatan
                                        </span>
                                        {isMonthOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    </div>
                                </button>

                                {isMonthOpen && (
                                    <div className="p-2 space-y-2 border-t border-slate-800/50">
                                        {dayKeys.map((dKey) => {
                                            const dayGroup = monthGroup.days[dKey];
                                            const isDayOpen = Boolean(openGroups[`day_${dKey}`]);
                                            const isToday = dKey === todayDayKey;
                                            const dayPendingCount = dayGroup.items.filter((item) => item.status_pengajuan === 'pending').length;

                                            return (
                                                <div
                                                    key={dKey}
                                                    className={`border rounded-lg overflow-hidden transition-all ${isToday ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800/60 bg-slate-900/30'
                                                        }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(`day_${dKey}`)}
                                                        className="w-full flex items-center justify-between p-2.5 hover:bg-slate-800/50 transition-colors text-left cursor-pointer select-none"
                                                    >
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-xs font-semibold ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                                                                {dayGroup.label}
                                                            </span>
                                                            {isToday && (
                                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase border border-emerald-500/30">
                                                                    Hari Ini
                                                                </span>
                                                            )}
                                                            {dayPendingCount > 0 && (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold">
                                                                    <span className="relative flex h-1.5 w-1.5">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]"></span>
                                                                    </span>
                                                                    <span>{dayPendingCount} Belum di-ACC</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                                                                {dayGroup.items.length} Peminjaman
                                                            </span>
                                                            {isDayOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                                                        </div>
                                                    </button>

                                                    {isDayOpen && (
                                                        <div className="p-2 pt-3 border-t border-slate-800/40 space-y-2">
                                                            {dayGroup.items.map((item) => (
                                                                <TimelineCard
                                                                    key={item.id}
                                                                    item={item}
                                                                    role={user?.role || role}
                                                                    role_2={user?.role_2 || role_2}
                                                                    isPengurusLab={isPengurusLab}
                                                                    currentUser={user}
                                                                    currentUserId={user?.id}
                                                                    currentUserNama={user?.NAMA || user?.nama}
                                                                    onApprove={onApprove}
                                                                    onComplete={onComplete}
                                                                    onEdit={onEdit} // <-- 2. Operkan ke TimelineCard
                                                                    onDelete={onDelete}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
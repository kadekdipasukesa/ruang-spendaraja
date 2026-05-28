// src/components/SAS/GridLjkOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, RotateCcw, Sliders } from 'lucide-react';

export default function GridLjkOverlay({ 
  jawabanPG, 
  handlePGChange, 
  ljkImageUrl,
  gridDimensions,
  setGridDimensions,
  columnGap,
  setColumnGap,
  opacity,
  setOpacity
}) {
    // --- STATE INTERNAL (BAYANGAN) UNTUK ANIMASI SUPER SMOOTH ---
    const [localGap, setLocalGap] = useState(columnGap);
    const [localOpacity, setLocalOpacity] = useState(opacity);
    const [hideGrid, setHideGrid] = useState(false);

    const containerRef = useRef(null);
    const isResizing = useRef(false);
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0, w: 0, h: 0, t: 0, l: 0 });

    // Sinkronisasi state bayangan jika sewaktu-waktu ada reset dari luar
    useEffect(() => {
        setLocalGap(columnGap);
    }, [columnGap]);

    useEffect(() => {
        setLocalOpacity(opacity);
    }, [opacity]);

    // --- 1. MEMUAT POSISI TERAKHIR DARI LOCALSTORAGE ---
    useEffect(() => {
        const savedDimensions = localStorage.getItem('ljk_grid_dimensions');
        if (savedDimensions) {
            try {
                setGridDimensions(JSON.parse(savedDimensions));
            } catch (e) {
                console.error("Gagal memuat preset posisi grid", e);
            }
        }
    }, [setGridDimensions]);

    const saveDimensions = (newDims) => {
        setGridDimensions(newDims);
        localStorage.setItem('ljk_grid_dimensions', JSON.stringify(newDims));
    };

    // --- 2. LOGIKA DRAG & RESIZE MURNI MOUSE POINTER ---
    const handleMouseDown = (e, action) => {
        e.preventDefault();
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            w: (gridDimensions.width / 100) * containerRect.width,
            h: (gridDimensions.height / 100) * containerRect.height,
            t: (gridDimensions.top / 100) * containerRect.height,
            l: (gridDimensions.left / 100) * containerRect.width,
        };

        if (action === 'resize') isResizing.current = true;
        if (action === 'drag') isDragging.current = true;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current && !isDragging.current) return;
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        let newDims = { ...gridDimensions };

        if (isResizing.current) {
            const newWidthPx = Math.max(150, startPos.current.w + deltaX);
            const newHeightPx = Math.max(200, startPos.current.h + deltaY);
            newDims.width = (newWidthPx / containerRect.width) * 100;
            newDims.height = (newHeightPx / containerRect.height) * 100;
        }

        if (isDragging.current) {
            const newLeftPx = startPos.current.l + deltaX;
            const newTopPx = startPos.current.t + deltaY;
            newDims.left = (newLeftPx / containerRect.width) * 100;
            newDims.top = (newTopPx / containerRect.height) * 100;
        }

        newDims.width = Math.min(100, Math.max(10, newDims.width));
        newDims.height = Math.min(100, Math.max(10, newDims.height));
        newDims.top = Math.min(100, Math.max(0, newDims.top));
        newDims.left = Math.min(100, Math.max(0, newDims.left));

        setGridDimensions(newDims);
    };

    const handleMouseUp = () => {
        if (isResizing.current || isDragging.current) {
            isResizing.current = false;
            isDragging.current = false;
            localStorage.setItem('ljk_grid_dimensions', JSON.stringify(gridDimensions));
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // --- 3. LOGIKA KLIK JAWABAN ---
    const handleCellClick = (no, opt) => {
        if (jawabanPG[no] === opt) {
            handlePGChange(no, 'Null');
        } else {
            handlePGChange(no, opt);
        }
    };

    const renderRowExcel = (no) => (
        <div key={no} className="flex-1 grid grid-cols-5 border-b border-slate-300 last:border-b-0 items-stretch min-h-0">
            <div className="flex items-center justify-center bg-slate-100/60 font-black text-[10px] text-slate-500 border-r border-slate-300 select-none">
                {no}
            </div>
            {["A", "B", "C", "D"].map((opt) => {
                const isSelected = jawabanPG[no] === opt;
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => handleCellClick(no, opt)}
                        className={`flex items-center justify-center font-black text-xs border-r border-slate-300 last:border-r-0 transition-colors select-none ${
                            isSelected
                                ? 'bg-amber-500 text-white font-black'
                                : 'bg-transparent text-slate-700 hover:bg-amber-100/40'
                        }`}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
    

    return (
        <div className="space-y-3">
            {/* 🛠️ KALIBRATOR */}
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-2">
                    <Sliders className="text-amber-400" size={16} />
                    <span className="text-[11px] font-black uppercase tracking-wider text-white">Kalibrator Tabel</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                    {/* Menggunakan localGap untuk interaksi super cepat */}
                    <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400">Jarak Kolom:</span>
                        <input
                            type="range" min="0" max="100" step="1"
                            value={localGap}
                            onChange={(e) => setLocalGap(Number(e.target.value))}
                            onMouseUp={() => setColumnGap(localGap)} // ⚡ Kirim ke database/parent HANYA saat mouse dilepas
                            onTouchEnd={() => setColumnGap(localGap)} // Support HP/Tablet
                            className="w-16 accent-amber-500 cursor-pointer h-1 rounded"
                        />
                        <span className="font-mono text-[10px] text-amber-400">{localGap}px</span>
                    </div>

                    {/* Menggunakan localOpacity */}
                    <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400">Transparansi:</span>
                        <input
                            type="range" min="15" max="85" step="1"
                            value={localOpacity}
                            onChange={(e) => setLocalOpacity(Number(e.target.value))}
                            onMouseUp={() => setOpacity(localOpacity)} // ⚡ Kirim ke parent HANYA saat mouse dilepas
                            onTouchEnd={() => setOpacity(localOpacity)}
                            className="w-16 accent-amber-500 cursor-pointer h-1 rounded"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setHideGrid(!hideGrid)}
                        className={`p-1.5 rounded-lg border transition-colors ${hideGrid ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                    >
                        {hideGrid ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const defaultDims = { width: 90, height: 85, top: 8, left: 5 };
                            saveDimensions(defaultDims);
                            setColumnGap(16);
                            setOpacity(40);
                            setHideGrid(false);
                        }}
                        className="p-1.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg hover:text-white flex items-center gap-1 text-[10px] uppercase font-black"
                    >
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>
            </div>

            {/* 📦 DOUBLE-LAYER BOX */}
            <div
                ref={containerRef}
                className="relative w-full aspect-[1/1.414] max-w-2xl mx-auto border-2 border-slate-300 bg-slate-200 rounded-2xl overflow-hidden shadow-inner select-none"
            >
                {ljkImageUrl ? (
                    <img
                        src={ljkImageUrl}
                        alt="Kertas LJK Fisik"
                        className="w-full h-full object-fill absolute inset-0 pointer-events-none"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-bold p-6 text-center text-xs">
                        <span>[ Silakan Upload / Foto Kertas LJK Siswa ]</span>
                    </div>
                )}

                {!hideGrid && (
                    <div
                        className="absolute border-2 border-dashed border-amber-500 shadow-xl flex group"
                        style={{
                            width: `${gridDimensions.width}%`,
                            height: `${gridDimensions.height}%`,
                            top: `${gridDimensions.top}%`,
                            left: `${gridDimensions.left}%`,
                            backgroundColor: `rgba(255, 255, 255, ${localOpacity / 100})`, // pakai state lokal
                            gap: `${localGap}px`, // pakai state lokal
                            padding: localGap > 0 ? '1px' : '0px'
                        }}
                    >
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'drag')}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full cursor-move opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex items-center gap-1 border border-amber-600 shadow z-30 animate-bounce"
                        >
                            Klik & Geser Tabel
                        </div>

                        <div className="flex-1 flex flex-col border border-slate-400/80 h-full bg-transparent overflow-hidden rounded">
                            {Array.from({ length: 25 }, (_, i) => (i + 1).toString()).map(renderRowExcel)}
                        </div>

                        <div className="flex-1 flex flex-col border border-slate-400/80 h-full bg-transparent overflow-hidden rounded">
                            {Array.from({ length: 25 }, (_, i) => (i + 26).toString()).map(renderRowExcel)}
                        </div>

                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'resize')}
                            className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-tl-xl border-l border-t border-amber-600 cursor-se-resize flex items-center justify-center shadow z-30 group-hover:scale-110 transition-transform"
                            title="Tarik ujung ini untuk menyesuaikan skala ukuran LJK"
                        >
                            <div className="w-2 h-2 border-r-2 border-b-2 border-white/80 rotate-45 mb-0.5 ml-0.5" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
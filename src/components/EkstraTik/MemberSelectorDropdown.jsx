import React, { useState } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';

export default function MemberSelectorDropdown({ anggotaList = [], onSelectMember }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = anggotaList.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.nama && m.nama.toLowerCase().includes(q)) ||
      (m.kelas && m.kelas.toLowerCase().includes(q)) ||
      String(m.no_absen || '') === q
    );
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-lg transition cursor-pointer"
      >
        <User className="w-3.5 h-3.5" />
        <span>Pilih dari Daftar {anggotaList.length || 42} Anggota</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-72 sm:w-84 max-h-72 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xl z-50 flex flex-col">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kelas..."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-60">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">Anggota tidak ditemukan</div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id || m.no_daftar || m.nama}
                  type="button"
                  onClick={() => {
                    onSelectMember(m);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-violet-50 rounded-lg text-xs flex items-center justify-between group transition cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-800 group-hover:text-violet-900 block truncate">
                      {m.nama}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Kelas {m.kelas} • Absen {m.no_absen ?? '-'}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                    #{m.no_daftar || '-'}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Copy, Check, Code, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import { CODE_TEMPLATE_APPS_SCRIPT, DEFAULT_GAS_URL } from '../../services/ekstraTikService';

export default function ModalPanduanAppsScript({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_TEMPLATE_APPS_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-violet-700 to-indigo-800 text-white flex items-center justify-between gap-3 shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center border border-white/20">
              <Code className="w-4 h-4 text-violet-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Panduan & Kode Google Apps Script
              </h3>
              <p className="text-xs text-violet-200">
                Penerima Presensi & Pengunggah Dokumen ke Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Petunjuk Singkat */}
          <div className="bg-violet-50/70 border border-violet-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-violet-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Langkah Singkat Pemasangan di Google Spreadsheet Guru:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-violet-950/80 pl-1 leading-relaxed">
              <li>Buka file <b>Google Spreadsheet</b> tempat Anda ingin menyimpan absensi & tugas.</li>
              <li>Klik menu <b>Ekstensi</b> ➔ <b>Apps Script</b>.</li>
              <li>Hapus semua kode di <code className="bg-violet-200/60 px-1 rounded">Code.gs</code>, lalu <b>tempel (paste)</b> kode di bawah ini.</li>
              <li>Klik tombol <b>Terapkan (Deploy)</b> ➔ <b>Kelola Penerapan (Manage Deployments)</b> ➔ Edit (ikon pensil) ➔ Pilih <b>Versi Baru (New Version)</b> ➔ Klik <b>Terapkan (Deploy)</b>.</li>
              <li>Pastikan jenis <b>Aplikasi Web (Web App)</b>, <i>Jalankan Sebagai (Execute as): Saya (Me)</i>, dan <i>Akses (Who has access): Siapa Saja (Anyone)</i>.</li>
              <li>Jika muncul jendela otorisasi, klik <b>Tinjau Izin (Review permissions)</b> dan izinkan akses Google Drive & Spreadsheet.</li>
            </ol>
          </div>

          {/* Tips Folder Google Drive & Akun Google Berbeda */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Penting: Mengapa Folder / Sheet Belum Muncul di Akun Google Lain?</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed pl-1">
              <li>
                <b>Akun Eksekusi (Deploy As: Me)</b>: Google Apps Script berjalan di bawah akun Google yang membuat deployment (misal akun <i>belajar.id</i>). File dan folder Google Drive akan dibuat di dalam Drive akun tersebut.
              </li>
              <li>
                <b>Nama Sheet & Folder Resmi</b>: Script kini otomatis membuat sheet dan folder bernama: <b className="font-mono bg-amber-200/70 px-1.5 py-0.5 rounded text-amber-950">tugas_ekstra_kelas_7_2026</b>.
              </li>
              <li>
                <b>Tips Folder Bersama</b>: Jika Spreadsheet dibagikan ke beberapa akun guru, buka Google Drive akun pemilik, buat folder bernama <b className="font-mono text-amber-950">tugas_ekstra_kelas_7_2026</b> lalu klik kanan ➔ <b>Bagikan (Share)</b> ➔ <i>Siapa saja yang memiliki link (Pelihat)</i> agar semua akun guru dapat langsung melihat berkas tugas.
              </li>
              <li>
                <b>PENTING: Buat "Versi Baru" (New Version) Saat Deploy</b>: Setiap kali mengubah kode di Apps Script, wajib klik <b>Terapkan (Deploy)</b> ➔ <b>Kelola Penerapan (Manage Deployments)</b> ➔ Edit ➔ Pilih <b>Versi Baru (New Version)</b> ➔ Klik <b>Terapkan</b>. Jika tidak memilih "Versi Baru", Google akan tetap menjalankan kode lama!
              </li>
            </ul>
          </div>

          {/* Code Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs">Kode Sumber Google Apps Script:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Seluruh Kode</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 max-h-[300px]">
              {CODE_TEMPLATE_APPS_SCRIPT}
            </pre>
          </div>

          {/* Endpoint aktif */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              URL Endpoint Aktif Saat Ini:
            </span>
            <p className="text-xs font-mono text-slate-800 break-all bg-white p-2 rounded-lg border border-slate-200/60 select-all">
              {DEFAULT_GAS_URL}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-800 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Google Apps Script
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

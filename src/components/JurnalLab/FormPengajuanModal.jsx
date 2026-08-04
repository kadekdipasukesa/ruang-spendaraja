import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, User, Users, AlignLeft } from 'lucide-react';

export default function FormPengajuanModal({ isOpen, onClose, onSubmit, selectedLab }) {
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        jam_mulai: '07:30',
        jam_selesai: '09:00',
        guru_pengajar: '',
        mata_pelajaran: '',
        kelas: '',
        jumlah_siswa: 32,
        kategori_kegiatan: 'KBM',
        materi_kegiatan: '',
        kondisi_awal: 'Baik'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const waktu_mulai = new Date(`${formData.tanggal}T${formData.jam_mulai}:00`).toISOString();
        const waktu_selesai = new Date(`${formData.tanggal}T${formData.jam_selesai}:00`).toISOString();

        const result = await onSubmit({
            ...formData,
            waktu_mulai,
            waktu_selesai
        });

        setLoading(false);
        if (result.success) {
            onClose();
        } else {
            alert('Gagal mengirim pengajuan: ' + result.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative my-8">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-1">
                    Buat Jurnal / Pengajuan Lab
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                    Peminjaman jadwal penggunaan untuk <span className="text-indigo-400 font-semibold">{selectedLab}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Waktu & Tanggal */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Tanggal Praktikum
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Jam Mulai
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.jam_mulai}
                                onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Jam Selesai
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.jam_selesai}
                                onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Informasi Pengajar & Mapel */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-indigo-400" /> Guru Pengajar
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Nama Guru"
                                value={formData.guru_pengajar}
                                onChange={(e) => setFormData({ ...formData, guru_pengajar: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Mata Pelajaran
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Informatika / Multimedia"
                                value={formData.mata_pelajaran}
                                onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Kelas & Jumlah Siswa */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas</label>
                            <input
                                type="text"
                                required
                                placeholder="VIII A"
                                value={formData.kelas}
                                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-indigo-400" /> Jml Siswa
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.jumlah_siswa}
                                onChange={(e) => setFormData({ ...formData, jumlah_siswa: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                            <select
                                value={formData.kategori_kegiatan}
                                onChange={(e) => setFormData({ ...formData, kategori_kegiatan: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="KBM">KBM Regular</option>
                                <option value="Ekskul">Ekstrakurikuler</option>
                                <option value="Ujian">Ujian / Tes</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                    </div>

                    {/* Materi Kegiatan */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5 text-indigo-400" /> Materi / Topik Praktikum
                        </label>
                        <textarea
                            rows="2"
                            placeholder="Uraikan topik praktikum hari ini..."
                            value={formData.materi_kegiatan}
                            onChange={(e) => setFormData({ ...formData, materi_kegiatan: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan / Catat Jurnal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
import React from 'react';
import { BookOpen, CheckCircle2, Lock, Sparkles, ArrowRight, Award, Shield, FileText } from 'lucide-react';
import TopicCardFocused from './TopicCardFocused';
import DocxViewerProtected from '../DocxViewerProtected';
import { MATERI_TOPIK_WORD, TUGAS_5_CONFIG, PROYEK_BROSUR_DATA } from '../../../../../data/tugas5WordData';

export default function MateriWordLiterasi({
  completedTopicIds = [],
  readingSeconds = {},
  currentTopicSeconds = 0,
  checkpointAnswers = {},
  checkpointFeedback = null,
  onSelectAnswer,
  onVerifyAnswer,
  onNextTopic,
  onGoToQuiz,
  scoreTahap1 = 0,
}) {
  const allCompleted = completedTopicIds.length === MATERI_TOPIK_WORD.length;

  // Handle smooth scroll when clicking next topic
  const handleScrollToNextTopic = (currentTopicId) => {
    const nextTopicId = currentTopicId + 1;
    if (nextTopicId <= MATERI_TOPIK_WORD.length) {
      setTimeout(() => {
        const nextElem = document.getElementById(`topik-card-${nextTopicId}`);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (onGoToQuiz) {
      onGoToQuiz();
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner (Single Feed Explanation) */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Tahap 1 • Panduan 7 Langkah Praktik
              </span>
              <span className="text-xs text-slate-300">
                Informatika Kelas 7 • Microsoft Word
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
              Panduan Praktik Ms. Word: Pengalaman Belajar di SMPN 2 Singaraja
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Pelajari panduan 7 langkah di bawah ini secara bertahap dalam satu alur halaman. Selesaikan soal
              checkpoint singkat di setiap langkah untuk membuka materi selanjutnya.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Poin Checkpoint Membaca</span>
              <span className="text-sm sm:text-base font-black text-amber-300">
                {scoreTahap1} / {TUGAS_5_CONFIG.poin_tahap1_materi} Poin
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-black text-sm shadow-inner">
              {completedTopicIds.length}/{MATERI_TOPIK_WORD.length}
            </div>
          </div>
        </div>

        {/* Global Reading Progress Bar */}
        <div className="w-full bg-slate-950/60 rounded-full h-2.5 overflow-hidden mt-4 border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${(completedTopicIds.length / MATERI_TOPIK_WORD.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ─── TARGET SHOWCASE: CONTOH DOKUMEN JADI TERPROTEKSI (OFFICE VIEWER) ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
              📄
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Contoh Dokumen Hasil Jadi (PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA.docx)
              </h3>
              <p className="text-xs text-slate-400">
                Pratinjau resmi terproteksi (hanya lihat, anti-copy &amp; anti-download). Buatlah dokumen seperti ini di komputer lab/laptopmu!
              </p>
            </div>
          </div>

          {/* Quick Font Summary Badge */}
          <div className="flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            <span>Jenis Font: <strong className="text-amber-300">Calibri</strong></span>
            <span>•</span>
            <span>Ukuran: <strong className="text-blue-300">20pt</strong> (Judul), <strong className="text-indigo-300">15pt</strong> (Sub-judul), <strong className="text-slate-200">12pt</strong> (Teks)</span>
          </div>
        </div>

        {/* Document Viewer Protected Component */}
        <DocxViewerProtected />

        {/* Summary of 7 Practical Steps */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Alur 7 Langkah Praktik Menuju Dokumen Jadi di Atas:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                Langkah 1 &bull; Layout &amp; Font
              </span>
              <strong className="text-white block text-xs">Blank Doc, A4, Calibri 12pt</strong>
              <p className="text-slate-400 text-[11px]">Buka Word, pilih Blank Document, tab Layout Size A4, font Calibri 12pt.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">
                Langkah 2 &bull; Judul Utama
              </span>
              <strong className="text-white block text-xs">20pt Bold Center (Ctrl+E &amp; B)</strong>
              <p className="text-slate-400 text-[11px]">Ketik judul huruf kapital 20pt Bold Center, lalu sub-judul modul 12pt.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                Langkah 3 &bull; Tabel Identitas
              </span>
              <strong className="text-white block text-xs">Tabel 3x5 &amp; Shading Header</strong>
              <p className="text-slate-400 text-[11px]">Insert &gt; Table 3x5, beri Shading warna biru/abu pada header, isi identitas.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                Langkah 4 &bull; Cerita Pengalaman
              </span>
              <strong className="text-white block text-xs">Ruang Spendaraja 15pt &amp; Justify</strong>
              <p className="text-slate-400 text-[11px]">Sub-judul 15pt Bold, 2 paragraf cerita dirapikan dengan Justify (Ctrl+J).</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                Langkah 5 &bull; Format Khusus
              </span>
              <strong className="text-white block text-xs">Bold, Italic &amp; Pesan Center</strong>
              <p className="text-slate-400 text-[11px]">Bold nama sekolah/platform, Italic istilah asing, Pesan Penting Center Bold.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block">
                Langkah 6 &bull; Gambar Online PNG
              </span>
              <strong className="text-white block text-xs">Wrap Text: Top and Bottom</strong>
              <p className="text-slate-400 text-[11px]">Insert komputer PNG, klik kanan &gt; Wrap Text &gt; Top and Bottom di sela paragraf.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-wider block">
                Langkah 7 &bull; Simpan File (.docx)
              </span>
              <strong className="text-white block text-xs">Save As ke Folder Downloads &gt; Kelas &gt; Nama_NoAbsen</strong>
              <p className="text-slate-400 text-[11px]">
                File name: <code className="text-emerald-300 font-bold">tugas 5_nama_noAbsen_pengalaman belajar.docx</code> untuk diunggah di Tahap 3.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SINGLE-PAGE SCROLLING FEED OF 7 STEPS ─── */}
      <div className="space-y-8">
        {MATERI_TOPIK_WORD.map((topic, index) => {
          const isCompleted = completedTopicIds.includes(topic.id);
          // Langkah 1 selalu terbuka. Langkah berikutnya terbuka jika langkah sebelumnya selesai
          const isUnlocked = topic.id === 1 || completedTopicIds.includes(topic.id - 1);

          // Feedback checkpoint khusus langkah ini
          const feedback = checkpointFeedback?.topicId === topic.id ? checkpointFeedback : null;
          const currentSec = readingSeconds[topic.id] || 0;

          if (!isUnlocked) {
            // Locked / Hidden Placeholder Card
            return (
              <div
                key={topic.id}
                id={`topik-card-${topic.id}`}
                className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 text-slate-500 select-none transition"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {topic.topik} (Terkunci)
                        </span>
                        <span className="text-xs text-slate-500">
                          +{topic.poin} Poin
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-300 mt-1">
                        {topic.subjudul}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 italic bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
                    🔒 Selesaikan Langkah {topic.id - 1} di atas untuk membuka langkah ini
                  </span>
                </div>
              </div>
            );
          }

          // Unlocked & Visible Topic Card with interactive simulator
          return (
            <TopicCardFocused
              key={topic.id}
              topic={topic}
              topicNumber={topic.id}
              totalTopics={MATERI_TOPIK_WORD.length}
              currentSeconds={currentSec}
              threshold={TUGAS_5_CONFIG.readingThresholdSeconds}
              isCompleted={isCompleted}
              selectedAnswer={checkpointAnswers[topic.id] || null}
              checkpointFeedback={feedback}
              onSelectAnswer={onSelectAnswer}
              onVerifyAnswer={onVerifyAnswer}
              onNextTopic={() => handleScrollToNextTopic(topic.id)}
            />
          );
        })}
      </div>

      {/* ─── ALL STEPS COMPLETED CELEBRATION & NEXT STAGE CTA ─── */}
      {allCompleted && (
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border-2 border-emerald-500/50 rounded-3xl text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Luar Biasa! Seluruh 7 Langkah Praktik Microsoft Word Telah Tuntas!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Kamu telah membuktikan literasi membaca dan memahami 7 langkah menyusun naskah dokumen: mengatur kertas A4, font Calibri, membuat tabel identitas 3x5, mengetik cerita Justify, format Bold/Italic, Wrap Text Top &amp; Bottom pada gambar komputer, serta tata cara menyimpan berkas .docx (+14 Poin terkumpul).
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToQuiz}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black rounded-2xl text-sm transition shadow-xl shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer transform hover:scale-105"
          >
            <span>Lanjut ke Kuis Fitur Ms. Word (Tahap 2 • 26 Poin)</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
}

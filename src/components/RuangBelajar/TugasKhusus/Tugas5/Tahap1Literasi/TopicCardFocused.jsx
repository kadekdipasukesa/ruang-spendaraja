import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, ArrowRight, Sparkles, HelpCircle, Lock } from 'lucide-react';
import ReadingTimerIndicator from './ReadingTimerIndicator';
import VisualInterfaceWord from './visuals/VisualInterfaceWord';
import VisualJudulSubjudul from './visuals/VisualJudulSubjudul';
import VisualTableIdentitas from './visuals/VisualTableIdentitas';
import VisualCeritaPengalaman from './visuals/VisualCeritaPengalaman';
import VisualFormatKhusus from './visuals/VisualFormatKhusus';
import VisualWrapText from './visuals/VisualWrapText';
import VisualSaveExport from './visuals/VisualSaveExport';

// Helper inline parser for **bold**, *italic*, and `code`
function renderInlineFormatted(text) {
  if (!text) return null;
  const regex = /(\*\*.*?\*\*|\*[^*\n]+?\*|`[^`\n]+?`)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-amber-300 font-medium">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="bg-slate-900 border border-slate-700 text-emerald-300 font-mono px-1.5 py-0.5 rounded text-xs">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
}

// Helper block parser for lists, bullets, quotes, and paragraphs
function renderFormattedContent(content) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-slate-300 text-xs sm:text-sm leading-relaxed pl-3.5 border-l-2 border-blue-500/40">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Sub-bullet (indented): e.g. "   * " or "   - " or 2+ spaces
        if (line.startsWith('   * ') || line.startsWith('   - ') || line.startsWith('     - ') || line.startsWith('\t* ') || line.startsWith('\t- ') || /^\s{2,}[*-]\s/.test(line)) {
          const itemText = line.replace(/^\s*[*-\s]+/, '');
          return (
            <div key={idx} className="pl-5 flex items-start gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
              <div className="flex-1">{renderInlineFormatted(itemText)}</div>
            </div>
          );
        }

        // Main bullet: starts with "* " or "- "
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const itemText = trimmed.replace(/^[*-\s]+/, '');
          return (
            <div key={idx} className="pl-1 flex items-start gap-2.5 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-xs" />
              <div className="flex-1">{renderInlineFormatted(itemText)}</div>
            </div>
          );
        }

        // Numbered list item: e.g. "1. ", "2. "
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          const itemText = numMatch[2];
          return (
            <div key={idx} className="pt-1.5 flex items-start gap-2.5 text-white font-medium">
              <span className="w-5 h-5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {num}
              </span>
              <div className="flex-1">{renderInlineFormatted(itemText)}</div>
            </div>
          );
        }

        // Blockquote / Tip
        if (trimmed.startsWith('> ')) {
          const tipText = trimmed.replace(/^>\s*/, '');
          return (
            <div key={idx} className="p-3 my-2 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-200 flex items-start gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">{renderInlineFormatted(tipText)}</div>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={idx} className="text-slate-300 leading-relaxed">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function TopicCardFocused({
  topic,
  topicNumber = 1,
  totalTopics = 7,
  currentSeconds = 0,
  threshold = 45,
  isCompleted = false,
  selectedAnswer = null,
  checkpointFeedback = null,
  onSelectAnswer,
  onVerifyAnswer,
  onNextTopic,
}) {
  const isReadingReached = isCompleted || currentSeconds >= threshold;
  const question = topic.checkpointQuestion;

  // Render dynamic interactive visual based on visualType
  const renderVisual = () => {
    switch (topic.visualType) {
      case 'interface_word':
        return <VisualInterfaceWord />;
      case 'judul_subjudul':
        return <VisualJudulSubjudul />;
      case 'table_identitas':
        return <VisualTableIdentitas />;
      case 'cerita_justify':
        return <VisualCeritaPengalaman />;
      case 'format_khusus':
        return <VisualFormatKhusus />;
      case 'wrap_text':
        return <VisualWrapText />;
      case 'save_export':
        return <VisualSaveExport />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`topik-card-${topic.id}`}
      className={`rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 transition-all duration-300 border ${
        isCompleted
          ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'bg-slate-900/90 border-blue-500/30'
      }`}
    >
      {/* Topic Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}
            >
              Topik {topicNumber} dari {totalTopics}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {topic.estimasiWaktu}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              Poin Checkpoint:
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              +{topic.poin} Poin
            </span>
            {isCompleted && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white mt-2 leading-tight">
          {topic.topik}
        </h3>
        <p className="text-xs sm:text-sm text-blue-300/80 mt-1 font-medium">
          {topic.subjudul}
        </p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {topic.deskripsiSingkat}
        </p>
      </div>

      {/* Reading Timer Progress Bar */}
      <ReadingTimerIndicator
        currentSeconds={currentSeconds}
        threshold={threshold}
        isCompleted={isCompleted}
      />

      {/* Dynamic Visual Mockup & Interactive Simulator */}
      <div className="pt-1">
        {renderVisual()}
      </div>

      {/* Reading Content Text Sections */}
      <div className="space-y-4 text-slate-300 leading-relaxed text-xs sm:text-sm">
        {topic.sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2 hover:border-slate-600 transition"
          >
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span>{section.heading}</span>
            </h4>
            {renderFormattedContent(section.content)}
          </div>
        ))}
      </div>

      {/* ─── CHECKPOINT QUESTION SECTION (SOAL RINGAN PEMAHAMAN) ─── */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
          isCompleted
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : isReadingReached
            ? 'bg-slate-800/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
            : 'bg-slate-800/40 border-slate-700/50 opacity-90'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                isCompleted
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Pertanyaan Checkpoint Topik {topicNumber} (Soal Mudah & Bukti Membaca)
            </span>
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              isCompleted
                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600'
                : isReadingReached
                ? 'bg-amber-900/60 text-amber-300 border-amber-600'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isCompleted ? 'Sudah Terverifikasi Benar (+2 pt)' : isReadingReached ? 'Siap Dijawab' : 'Terkunci Sementara'}
          </span>
        </div>

        {/* Lock warning if 60s not passed */}
        {!isReadingReached && (
          <div className="mb-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-blue-400" />
            <span>
              Perhatikan materi & gambar di atas terlebih dahulu. Waktu tersisa{' '}
              <strong className="text-white font-mono">{Math.max(0, threshold - currentSeconds)} detik</strong> lagi
              sebelum kamu dapat mengunci jawaban.
            </span>
          </div>
        )}

        {/* Question Text */}
        <p className="text-xs sm:text-sm font-bold text-white mb-4 leading-relaxed">
          {renderInlineFormatted(question.pertanyaan)}
        </p>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {question.opsi.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            const isAnswerCorrect = isCompleted && opt.id === question.jawabanBenar;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={!isReadingReached || isCompleted}
                onClick={() => onSelectAnswer(topic.id, opt.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500'
                    : isSelected
                    ? 'bg-blue-900/50 border-blue-500 text-white ring-1 ring-blue-500'
                    : isReadingReached
                    ? 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-700/60 hover:border-slate-600 text-slate-300'
                    : 'bg-slate-900/30 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                    isAnswerCorrect
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : isSelected
                      ? 'bg-blue-500 text-white border-blue-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {renderInlineFormatted(opt.teks)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {checkpointFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs mb-4 flex items-start gap-2.5 border ${
              checkpointFeedback.isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}
          >
            {checkpointFeedback.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {checkpointFeedback.isCorrect ? 'Jawaban Tepat!' : 'Periksa Kembali:'}
              </span>
              <span>{renderInlineFormatted(checkpointFeedback.message)}</span>
              {checkpointFeedback.isCorrect && question.penjelasan && (
                <p className="mt-1.5 pt-1.5 border-t border-emerald-800/60 text-[11px] text-emerald-300/90 font-sans">
                  <strong>Penjelasan Fitur:</strong> {renderInlineFormatted(question.penjelasan)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons: Check or Scroll to Next */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
          {!isCompleted ? (
            <button
              type="button"
              disabled={!isReadingReached || !selectedAnswer}
              onClick={() => onVerifyAnswer(topic.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${
                isReadingReached && selectedAnswer
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black cursor-pointer shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isReadingReached
                  ? 'Kunci & Cek Jawaban'
                  : `Tunggu Waktu Membaca (${Math.max(0, threshold - currentSeconds)}s)`}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Topik {topicNumber} Selesai (+2 Poin)</span>
            </div>
          )}

          {/* Next Topic Button (triggers smooth scroll down) */}
          {isCompleted && (
            <button
              type="button"
              onClick={() => onNextTopic(topic.id)}
              className="ml-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>
                {topicNumber < totalTopics
                  ? `Scroll ke Topik ${topicNumber + 1} ↓`
                  : 'Lanjut ke Kuis Ms. Word (Tahap 2) →'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

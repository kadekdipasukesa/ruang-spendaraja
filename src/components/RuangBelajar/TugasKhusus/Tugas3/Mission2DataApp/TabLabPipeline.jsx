import {
  Database,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PIPELINE_CASES } from './pipelineData';

export default function TabLabPipeline({
  pipelineAnswers,
  onSelect,
  pipelineChecked,
  labScore,
  onCheckPipeline,
  onNextTab
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Simulator 3 Pipeline Transformasi Data Dunia Nyata
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih elemen Data Mentah (Input), Aplikasi Pengolah (Proses), dan Informasi Bermanfaat (Output) untuk setiap skenario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCheckPipeline}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Cek Hasil ({labScore}/10p)</span>
          </button>
        </div>
      </div>

      {/* 3 Pipeline Cases */}
      <div className="space-y-4">
        {PIPELINE_CASES.map((c) => {
          const currentChoice = pipelineAnswers[c.id] || {};
          const isInputCorrect = currentChoice.input === c.correctInput;
          const isAppCorrect = currentChoice.app === c.correctApp;
          const isOutputCorrect = currentChoice.output === c.correctOutput;
          const isAllCorrect = isInputCorrect && isAppCorrect && isOutputCorrect;

          return (
            <div
              key={c.id}
              className={`bg-slate-950 border rounded-3xl p-5 space-y-4 transition-all ${
                pipelineChecked
                  ? isAllCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-slate-800">
                    <c.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{c.title}</h4>
                    <p className="text-[11px] text-slate-400">{c.description}</p>
                  </div>
                </div>

                {pipelineChecked && (
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                    isAllCorrect
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {isAllCorrect ? '✅ 3.3/3.3p' : 'Perlu Diperbaiki'}
                  </span>
                )}
              </div>

              {/* 3 Dropdown Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Input */}
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                  <label className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                    <span>1. Data Mentah (Input)</span>
                    {pipelineChecked && (isInputCorrect ? '✅' : '❌')}
                  </label>
                  <select
                    value={currentChoice.input || ''}
                    onChange={(e) => onSelect(c.id, 'input', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Pilih Data Mentah --</option>
                    {c.inputs.map((inp, idx) => (
                      <option key={idx} value={inp}>{inp}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Process App */}
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                  <label className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                    <span>2. Aplikasi Pemroses (Proses)</span>
                    {pipelineChecked && (isAppCorrect ? '✅' : '❌')}
                  </label>
                  <select
                    value={currentChoice.app || ''}
                    onChange={(e) => onSelect(c.id, 'app', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Pilih Aplikasi Pengolah --</option>
                    {c.apps.map((ap, idx) => (
                      <option key={idx} value={ap}>{ap}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Output */}
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                  <label className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                    <span>3. Informasi Keluaran (Output)</span>
                    {pipelineChecked && (isOutputCorrect ? '✅' : '❌')}
                  </label>
                  <select
                    value={currentChoice.output || ''}
                    onChange={(e) => onSelect(c.id, 'output', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- Pilih Informasi Hasil --</option>
                    {c.outputs.map((out, idx) => (
                      <option key={idx} value={out}>{out}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Kuis Pemahaman Data</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

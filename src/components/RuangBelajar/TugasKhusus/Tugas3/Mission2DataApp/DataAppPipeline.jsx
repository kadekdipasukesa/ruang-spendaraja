import { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

import {
  PIPELINE_CASES,
  QUIZ_QUESTIONS
} from './pipelineData';

import TabMateriPipeline from './TabMateriPipeline';
import TabLabPipeline from './TabLabPipeline';
import TabKuisPipeline from './TabKuisPipeline';

// Re-ekspor dataset untuk menjaga kompatibilitas 100%
export {
  PIPELINE_CASES,
  QUIZ_QUESTIONS
};

export default function DataAppPipeline({ userId, currentScore, onComplete, onNextMission }) {
  const uid = userId ? String(userId) : 'guest';
  const PIPELINE_KEY = `tugas_sk_m2_pipeline_answers_user_${uid}`;
  const QUIZ_KEY = `tugas_sk_m2_quiz_answers_user_${uid}`;

  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'pipeline' | 'kuis'
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0 || Boolean(localStorage.getItem(PIPELINE_KEY))));

  const [pipelineAnswers, setPipelineAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(PIPELINE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initP = {};
      PIPELINE_CASES.forEach((c) => {
        initP[c.id] = { input: c.correctInput, app: c.correctApp, output: c.correctOutput };
      });
      return initP;
    }
    return {
      case_school: { input: '', app: '', output: '' },
      case_supermarket: { input: '', app: '', output: '' },
      case_smartwatch: { input: '', app: '', output: '' },
    };
  });

  const [pipelineChecked, setPipelineChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(PIPELINE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.values(parsed).some(v => v && (v.input || v.app || v.output))) {
          return true;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return Number(currentScore) >= 10;
  });

  const [quizAnswers, setQuizAnswers] = useState(() => {
    try {
      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 19) {
      const initQ = {};
      QUIZ_QUESTIONS.forEach((q) => {
        initQ[q.id] = q.correct;
      });
      return initQ;
    }
    return {};
  });

  const [quizChecked, setQuizChecked] = useState(() => {
    try {
      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return true;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return Number(currentScore) >= 19;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PIPELINE_KEY, JSON.stringify(pipelineAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [PIPELINE_KEY, pipelineAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [QUIZ_KEY, quizAnswers]);

  // Sinkronisasi otomatis saat user login berganti
  useEffect(() => {
    try {
      const savedPipe = localStorage.getItem(PIPELINE_KEY);
      if (savedPipe) {
        const parsed = JSON.parse(savedPipe);
        if (parsed && typeof parsed === 'object') {
          setPipelineAnswers(parsed);
          const hasData = Object.values(parsed).some((v) => v && (v.input || v.app || v.output));
          if (hasData || Number(currentScore) >= 10) {
            setPipelineChecked(true);
          }
        }
      } else if (Number(currentScore) >= 10) {
        const initP = {};
        PIPELINE_CASES.forEach((c) => {
          initP[c.id] = { input: c.correctInput, app: c.correctApp, output: c.correctOutput };
        });
        setPipelineAnswers(initP);
        setPipelineChecked(true);
      } else {
        setPipelineAnswers({
          case_school: { input: '', app: '', output: '' },
          case_supermarket: { input: '', app: '', output: '' },
          case_smartwatch: { input: '', app: '', output: '' },
        });
        setPipelineChecked(false);
      }

      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') {
          setQuizAnswers(parsed);
          if (Object.keys(parsed).length > 0 || Number(currentScore) >= 19) {
            setQuizChecked(true);
          }
        }
      } else if (Number(currentScore) >= 19) {
        const initQ = {};
        QUIZ_QUESTIONS.forEach((q) => { initQ[q.id] = q.correct; });
        setQuizAnswers(initQ);
        setQuizChecked(true);
      } else {
        setQuizAnswers({});
        setQuizChecked(false);
      }

      if (Number(currentScore) > 0 || savedPipe || savedQ) {
        setMateriRead(true);
      }
    } catch (e) {
      /* ignore */
    }
  }, [PIPELINE_KEY, QUIZ_KEY, currentScore]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 2 (Total 20 Poin):
  // - Lab Pipeline (3 Kasus x ~3.33 Poin): 10 Poin
  // - Kuis Data & Aplikasi (5 Soal x 2 Poin): 10 Poin
  // ====================================================
  let labPointsCalc = 0;
  PIPELINE_CASES.forEach((c) => {
    const userChoice = pipelineAnswers[c.id] || {};
    const isInputOk = userChoice.input === c.correctInput;
    const isAppOk = userChoice.app === c.correctApp;
    const isOutputOk = userChoice.output === c.correctOutput;
    if (isInputOk && isAppOk && isOutputOk) {
      labPointsCalc += 3.334;
    } else {
      if (isInputOk) labPointsCalc += 1;
      if (isAppOk) labPointsCalc += 1.334;
      if (isOutputOk) labPointsCalc += 1;
    }
  });
  const labScore = Math.min(10, Math.round(labPointsCalc));

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin

  const totalM2Score = Math.min(20, Math.max(Number(currentScore) || 0, labScore + quizScore));

  const handleSelect = (caseId, field, value) => {
    setPipelineAnswers((prev) => ({
      ...prev,
      [caseId]: {
        ...prev[caseId],
        [field]: value,
      },
    }));
    setPipelineChecked(false);
  };

  const handleCheckPipeline = () => {
    setPipelineChecked(true);
    celebratePointGain(true);
    let pts = 0;
    PIPELINE_CASES.forEach((c) => {
      const userChoice = pipelineAnswers[c.id] || {};
      const isInputOk = userChoice.input === c.correctInput;
      const isAppOk = userChoice.app === c.correctApp;
      const isOutputOk = userChoice.output === c.correctOutput;
      if (isInputOk && isAppOk && isOutputOk) pts += 3.334;
      else {
        if (isInputOk) pts += 1;
        if (isAppOk) pts += 1.334;
        if (isOutputOk) pts += 1;
      }
    });
    const newLabScore = Math.min(10, Math.round(pts));
    const newTotal = Math.min(20, Math.max(Number(currentScore) || 0, newLabScore + quizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m2', newTotal);
    }
  };

  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
    const newQuizScore = quizCorrectCount * 2;
    const newTotal = Math.min(20, Math.max(Number(currentScore) || 0, labScore + newQuizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m2', newTotal);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Misi 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 2 • Bobot 20 Poin
            </span>
            <span className="text-xs text-slate-400">Siklus Data Mentah, Aplikasi & Informasi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Transformasi Data Mentah Menjadi Informasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari siklus alur data, susun pipa transformasi pada 3 kasus dunia nyata, dan selesaikan kuis logika data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setActiveTab('materi');
              setMateriRead(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi Siklus</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Lab Pipeline (10p)</span>
            {(pipelineChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'pipeline'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{labScore}/10p</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'kuis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Kuis Data (10p)</span>
            {(quizChecked || quizScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'kuis'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{quizScore}/10p</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: MATERI SIKLUS TRANSFORMASI DATA */}
      {activeTab === 'materi' && (
        <TabMateriPipeline
          onNextTab={() => {
            setMateriRead(true);
            setActiveTab('pipeline');
          }}
        />
      )}

      {/* TAB 2: LAB SIMULATOR 3 PIPELINE */}
      {activeTab === 'pipeline' && (
        <TabLabPipeline
          pipelineAnswers={pipelineAnswers}
          onSelect={handleSelect}
          pipelineChecked={pipelineChecked}
          labScore={labScore}
          onCheckPipeline={handleCheckPipeline}
          onNextTab={() => setActiveTab('kuis')}
        />
      )}

      {/* TAB 3: KUIS DATA & APLIKASI */}
      {activeTab === 'kuis' && (
        <TabKuisPipeline
          quizAnswers={quizAnswers}
          onSelectAnswer={(qid, optId) => setQuizAnswers((prev) => ({ ...prev, [qid]: optId }))}
          quizChecked={quizChecked}
          quizScore={quizScore}
          quizCorrectCount={quizCorrectCount}
          onEvaluateQuiz={handleEvaluateQuiz}
          onResetQuiz={handleResetQuiz}
          totalM2Score={totalM2Score}
          onNextMission={onNextMission}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

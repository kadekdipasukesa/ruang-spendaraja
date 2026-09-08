import { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Eye
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

import {
  ETHICS_CASES,
  QUIZ_QUESTIONS
} from './ethicsData';

import TabMateriEtika from './TabMateriEtika';
import TabLabDetective from './TabLabDetective';
import TabKuisNetiket from './TabKuisNetiket';

// Re-ekspor dataset untuk menjaga kompatibilitas 100%
export {
  ETHICS_CASES,
  QUIZ_QUESTIONS
};

export default function DigitalEthicsDetective({ userId, currentScore, onComplete, onSubmitAll, isSubmitting }) {
  const uid = userId ? String(userId) : 'guest';
  const CASE_KEY = `tugas_sk_m4_case_answers_user_${uid}`;
  const QUIZ_KEY = `tugas_sk_m4_quiz_answers_user_${uid}`;

  const [activeTab, setActiveTab] = useState('materi');
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0 || Boolean(localStorage.getItem(CASE_KEY))));

  const [caseAnswers, setCaseAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(CASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initC = {};
      ETHICS_CASES.forEach((cs) => {
        initC[cs.id] = { action: cs.correctAction, impact: cs.correctImpact };
      });
      return initC;
    }
    return {
      case_hoax: { action: '', impact: '' },
      case_privacy: { action: '', impact: '' },
      case_screentime: { action: '', impact: '' },
      case_digital_footprint: { action: '', impact: '' },
      case_security_password: { action: '', impact: '' },
    };
  });

  const [casesChecked, setCasesChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(CASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.values(parsed).some(v => v && (v.action || v.impact))) {
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
    if (Number(currentScore) >= 5) {
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
    return Number(currentScore) >= 15;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CASE_KEY, JSON.stringify(caseAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [CASE_KEY, caseAnswers]);

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
      const savedCases = localStorage.getItem(CASE_KEY);
      if (savedCases) {
        const parsed = JSON.parse(savedCases);
        if (parsed && typeof parsed === 'object') {
          setCaseAnswers(parsed);
          const hasChoices = Object.values(parsed).some((v) => v && (v.action || v.impact));
          if (hasChoices || Number(currentScore) >= 10) {
            setCasesChecked(true);
          }
        }
      } else if (Number(currentScore) >= 10) {
        const initC = {};
        ETHICS_CASES.forEach((cs) => {
          initC[cs.id] = { action: cs.correctAction, impact: cs.correctImpact };
        });
        setCaseAnswers(initC);
        setCasesChecked(true);
      } else {
        setCaseAnswers({
          case_hoax: { action: '', impact: '' },
          case_privacy: { action: '', impact: '' },
          case_screentime: { action: '', impact: '' },
          case_digital_footprint: { action: '', impact: '' },
          case_security_password: { action: '', impact: '' },
        });
        setCasesChecked(false);
      }

      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') {
          setQuizAnswers(parsed);
          if (Object.keys(parsed).length > 0 || Number(currentScore) >= 15) {
            setQuizChecked(true);
          }
        }
      } else if (Number(currentScore) >= 15) {
        const initQ = {};
        QUIZ_QUESTIONS.forEach((q) => { initQ[q.id] = q.correct; });
        setQuizAnswers(initQ);
        setQuizChecked(true);
      } else {
        setQuizAnswers({});
        setQuizChecked(false);
      }

      if (Number(currentScore) > 0 || savedCases || savedQ) {
        setMateriRead(true);
      }
    } catch (e) {
      /* ignore */
    }
  }, [CASE_KEY, QUIZ_KEY, currentScore]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 4 (Total 15 Poin):
  // - Lab 5 Kasus Detektif (5 x 2 Poin): 10 Poin
  // - Kuis Etika & Keamanan (5 x 1 Poin): 5 Poin
  // Total = 10 + 5 = 15 Poin
  // ====================================================
  let labScore = 0;
  ETHICS_CASES.forEach((cs) => {
    const st = caseAnswers[cs.id] || {};
    const isActOk = st.action === cs.correctAction;
    const isImpOk = st.impact === cs.correctImpact;
    if (isActOk && isImpOk) {
      labScore += 2;
    } else if (isActOk || isImpOk) {
      labScore += 1;
    }
  });
  labScore = Math.min(10, Math.round(labScore));

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 1 : 0; // 5 Poin max

  const totalM4Score = Math.min(15, Math.max(Number(currentScore) || 0, labScore + quizScore));

  const handleSelectAction = (caseId, actionId) => {
    setCaseAnswers((prev) => ({
      ...prev,
      [caseId]: { ...prev[caseId], action: actionId },
    }));
    setCasesChecked(false);
  };

  const handleSelectImpact = (caseId, impactId) => {
    setCaseAnswers((prev) => ({
      ...prev,
      [caseId]: { ...prev[caseId], impact: impactId },
    }));
    setCasesChecked(false);
  };

  const handleCheckCases = () => {
    setCasesChecked(true);
    celebratePointGain(true);
    let pts = 0;
    ETHICS_CASES.forEach((cs) => {
      const st = caseAnswers[cs.id] || {};
      const isActOk = st.action === cs.correctAction;
      const isImpOk = st.impact === cs.correctImpact;
      if (isActOk && isImpOk) pts += 2;
      else if (isActOk || isImpOk) pts += 1;
    });
    const newLabScore = Math.min(10, Math.round(pts));
    const newTotal = Math.min(15, Math.max(Number(currentScore) || 0, newLabScore + quizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m4', newTotal);
    }
  };

  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
    const newQuizScore = quizCorrectCount * 1;
    const newTotal = Math.min(15, Math.max(Number(currentScore) || 0, labScore + newQuizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m4', newTotal);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 4 • Bobot 15 Poin
            </span>
            <span className="text-xs text-slate-400">Detektif Etika TIK, Netiket & Keamanan Akun</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Dampak Positif/Negatif TIK & Detektif Etika Digital
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis 5 kasus nyata dunia digital, buat keputusan bijak, dan selesaikan kuis pemahaman etika netiket.
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
            <span>1. Materi Etika</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('detective')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'detective'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Kasus Detektif (10p)</span>
            {(casesChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'detective'
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
            <span>3. Kuis Netiket (5p)</span>
            {(quizChecked || quizScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'kuis'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{quizScore}/5p</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: MATERI DAMPAK & ETIKA DIGITAL */}
      {activeTab === 'materi' && (
        <TabMateriEtika
          onNextTab={() => {
            setMateriRead(true);
            setActiveTab('detective');
          }}
        />
      )}

      {/* TAB 2: DETEKTIF 5 STUDI KASUS */}
      {activeTab === 'detective' && (
        <TabLabDetective
          caseAnswers={caseAnswers}
          onSelectAction={handleSelectAction}
          onSelectImpact={handleSelectImpact}
          casesChecked={casesChecked}
          labScore={labScore}
          onCheckCases={handleCheckCases}
          onNextTab={() => setActiveTab('kuis')}
        />
      )}

      {/* TAB 3: KUIS ETIKA & NETIKET */}
      {activeTab === 'kuis' && (
        <TabKuisNetiket
          quizAnswers={quizAnswers}
          onSelectAnswer={(qid, optId) => setQuizAnswers((prev) => ({ ...prev, [qid]: optId }))}
          quizChecked={quizChecked}
          quizScore={quizScore}
          quizCorrectCount={quizCorrectCount}
          onEvaluateQuiz={handleEvaluateQuiz}
          onResetQuiz={handleResetQuiz}
          totalM4Score={totalM4Score}
          onSubmitAll={onSubmitAll}
          isSubmitting={isSubmitting}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

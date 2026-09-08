import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  BookOpen,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

import {
  APP_20_TOOLS,
  APP_GROUPS,
  QUIZ_QUESTIONS
} from './toolboxData';

import TabMateriToolbox from './TabMateriToolbox';
import TabLabToolbox from './TabLabToolbox';
import TabKuisToolbox from './TabKuisToolbox';

// Re-ekspor data agar kompatibilitas tetap 100% terjaga bagi komponen luar
export {
  APP_20_TOOLS,
  APP_GROUPS,
  QUIZ_QUESTIONS
};

export default function DigitalToolbox({ userId, currentScore, onComplete, onNextMission }) {
  const uid = userId ? String(userId) : 'guest';
  const APP_KEY = `tugas_sk_m3_app_placements_user_${uid}`;
  const QUIZ_KEY = `tugas_sk_m3_quiz_answers_user_${uid}`;

  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'tools_drag' | 'kuis'
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0 || Boolean(localStorage.getItem(APP_KEY))));

  // Penempatan 20 Aplikasi: Cek localStorage (sinkron dengan database), lalu default
  const [appPlacements, setAppPlacements] = useState(() => {
    try {
      const saved = localStorage.getItem(APP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 20) {
      const init = {};
      APP_20_TOOLS.forEach((item) => {
        init[item.id] = item.group;
      });
      return init;
    }
    const init = {};
    APP_20_TOOLS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });

  const [shuffledAppList, setShuffledAppList] = useState(() =>
    [...APP_20_TOOLS].sort(() => Math.random() - 0.5)
  );
  const [selectedAppItem, setSelectedAppItem] = useState(null);
  const [appChecked, setAppChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(APP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.values(parsed).filter(Boolean).length >= 10) {
          return true;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return Number(currentScore) >= 20;
  });

  // Simpan draft penempatan ke localStorage agar tidak hilang
  useEffect(() => {
    try {
      localStorage.setItem(APP_KEY, JSON.stringify(appPlacements));
    } catch (e) {
      /* ignore */
    }
  }, [APP_KEY, appPlacements]);

  // Kuis State (No individual answer reveal, reset required)
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
    if (Number(currentScore) >= 10) {
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
    return Number(currentScore) >= 30;
  });

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
      const savedApp = localStorage.getItem(APP_KEY);
      if (savedApp) {
        const parsed = JSON.parse(savedApp);
        if (parsed && typeof parsed === 'object') {
          setAppPlacements(parsed);
          const placedCount = Object.values(parsed).filter(Boolean).length;
          if (placedCount >= 10 || Number(currentScore) >= 20) {
            setAppChecked(true);
          }
        }
      } else if (Number(currentScore) >= 20) {
        const init = {};
        APP_20_TOOLS.forEach((item) => { init[item.id] = item.group; });
        setAppPlacements(init);
        setAppChecked(true);
      } else {
        const init = {};
        APP_20_TOOLS.forEach((item) => { init[item.id] = ''; });
        setAppPlacements(init);
        setAppChecked(false);
      }

      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') {
          setQuizAnswers(parsed);
          if (Object.keys(parsed).length === 5 || Number(currentScore) >= 30) {
            setQuizChecked(true);
          }
        }
      } else if (Number(currentScore) >= 30) {
        const initQ = {};
        QUIZ_QUESTIONS.forEach((q) => { initQ[q.id] = q.correct; });
        setQuizAnswers(initQ);
        setQuizChecked(true);
      } else {
        setQuizAnswers({});
        setQuizChecked(false);
      }

      if (Number(currentScore) > 0 || savedApp || savedQ) {
        setMateriRead(true);
      }
    } catch (e) {
      /* ignore */
    }
  }, [APP_KEY, QUIZ_KEY, currentScore]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 3 (Total 30 Poin):
  // - Lab Drag & Drop 20 Aplikasi (20 item): 20 Poin (1 poin per aplikasi benar)
  // - Kuis Perkakas & Software (5 soal x 2 Poin): 10 Poin
  // Total = 20 + 10 = 30 Poin
  // ====================================================
  const appCorrectCount = APP_20_TOOLS.filter(
    (item) => appPlacements[item.id] === item.group
  ).length;
  const labScore = appCorrectCount; // 20 Poin (1 point per item)

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin

  const totalM3Score = Math.min(30, Math.max(Number(currentScore) || 0, Math.round(labScore + quizScore)));

  // Handler Assign Aplikasi
  const handleAssignApp = (itemId, targetGroup) => {
    const isUnassigning = !targetGroup || appPlacements[itemId] === targetGroup;
    const nextGroup = isUnassigning ? '' : targetGroup;

    setAppPlacements((prev) => ({
      ...prev,
      [itemId]: nextGroup,
    }));
    setAppChecked(false);
  };

  const handleClearApps = () => {
    const cleared = {};
    APP_20_TOOLS.forEach((a) => { cleared[a.id] = ''; });
    setAppPlacements(cleared);
    setSelectedAppItem(null);
    setAppChecked(false);
    setShuffledAppList([...APP_20_TOOLS].sort(() => Math.random() - 0.5));
  };

  // Check apps with sound & petasan/confetti
  const handleCheckApps = () => {
    setAppChecked(true);
    celebratePointGain(true);
    const newAppCount = APP_20_TOOLS.filter((item) => appPlacements[item.id] === item.group).length;
    const newLabScore = newAppCount;
    const newTotal = Math.min(30, Math.max(Number(currentScore) || 0, Math.round(newLabScore + quizScore)));
    if (onComplete && newTotal > 0) {
      onComplete('m3', newTotal);
    }
  };

  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
    const newQuizScore = quizCorrectCount * 2;
    const newTotal = Math.min(30, Math.max(Number(currentScore) || 0, Math.round(labScore + newQuizScore)));
    if (onComplete && newTotal > 0) {
      onComplete('m3', newTotal);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Misi 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 3 • Bobot 30 Poin
            </span>
            <span className="text-xs text-slate-400">Pengelompokan 20 Aplikasi & Kuis Software</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Eksplorasi Perkakas Digital & Ragam Software
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari 5 kelompok perkakas digital, cocokkan 20 aplikasi populer ke kelompok yang tepat, dan selesaikan kuis lisensi.
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
            <span>1. Materi 5 Kelompok</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tools_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tools_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2. Lab 20 Aplikasi (20p)</span>
            {(appChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'tools_drag'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{labScore}/20p</span>
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
            <span>3. Kuis Software (10p)</span>
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

      {/* TAB 1: MATERI 5 KELOMPOK PERKAKAS DIGITAL */}
      {activeTab === 'materi' && (
        <TabMateriToolbox
          onNextTab={() => {
            setMateriRead(true);
            setActiveTab('tools_drag');
          }}
        />
      )}

      {/* TAB 2: LAB DRAG & DROP 20 APLIKASI */}
      {activeTab === 'tools_drag' && (
        <TabLabToolbox
          appPlacements={appPlacements}
          onAssignApp={handleAssignApp}
          onClearApps={handleClearApps}
          shuffledAppList={shuffledAppList}
          selectedAppItem={selectedAppItem}
          setSelectedAppItem={setSelectedAppItem}
          appChecked={appChecked}
          labScore={labScore}
          appCorrectCount={appCorrectCount}
          onCheckApps={handleCheckApps}
          onNextTab={() => setActiveTab('kuis')}
        />
      )}

      {/* TAB 3: KUIS PERKAKAS DIGITAL & LISENSI */}
      {activeTab === 'kuis' && (
        <TabKuisToolbox
          quizAnswers={quizAnswers}
          onSelectAnswer={(qid, optId) => setQuizAnswers((prev) => ({ ...prev, [qid]: optId }))}
          quizChecked={quizChecked}
          quizScore={quizScore}
          quizCorrectCount={quizCorrectCount}
          onEvaluateQuiz={handleEvaluateQuiz}
          onResetQuiz={handleResetQuiz}
          totalM3Score={totalM3Score}
          onNextMission={onNextMission}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

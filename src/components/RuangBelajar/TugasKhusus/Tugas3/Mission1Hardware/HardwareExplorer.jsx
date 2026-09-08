import { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

import {
  HARDWARE_20_ITEMS,
  HW_CATEGORIES,
  SOFTWARE_20_ITEMS,
  SW_CATEGORIES,
  QUIZ_QUESTIONS
} from './hardwareData';

import TabMateriVisual from './TabMateriVisual';
import TabLabHardware from './TabLabHardware';
import TabLabSoftware from './TabLabSoftware';
import TabKuisKomputer from './TabKuisKomputer';

// Re-ekspor data agar kompatibilitas tetap 100% terjaga bagi komponen luar
export {
  HARDWARE_20_ITEMS,
  HW_CATEGORIES,
  SOFTWARE_20_ITEMS,
  SW_CATEGORIES,
  QUIZ_QUESTIONS
};

export default function HardwareExplorer({ userId, currentScore, onComplete, onNextMission }) {
  const uid = userId ? String(userId) : 'guest';
  const HW_KEY = `tugas_sk_m1_hw_placements_user_${uid}`;
  const SW_KEY = `tugas_sk_m1_sw_placements_user_${uid}`;
  const QUIZ_KEY = `tugas_sk_m1_quiz_answers_user_${uid}`;

  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'hw_drag' | 'sw_drag' | 'kuis'
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0 || Boolean(localStorage.getItem(HW_KEY))));

  // State Penempatan 20 Komponen Hardware: Cek localStorage (sinkron dengan database), lalu default
  const [hwPlacements, setHwPlacements] = useState(() => {
    try {
      const saved = localStorage.getItem(HW_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 15) {
      const init = {};
      HARDWARE_20_ITEMS.forEach((item) => {
        init[item.id] = item.category;
      });
      return init;
    }
    const init = {};
    HARDWARE_20_ITEMS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });

  const [shuffledHwList, setShuffledHwList] = useState(() =>
    [...HARDWARE_20_ITEMS].sort(() => Math.random() - 0.5)
  );
  const [selectedHwItem, setSelectedHwItem] = useState(null);
  const [hwChecked, setHwChecked] = useState(() => {
    return Number(currentScore) >= 15;
  });

  // State Penempatan 20 Perangkat Lunak: Cek localStorage (sinkron dengan database), lalu default
  const [swPlacements, setSwPlacements] = useState(() => {
    try {
      const saved = localStorage.getItem(SW_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 25) {
      const init = {};
      SOFTWARE_20_ITEMS.forEach((item) => {
        init[item.id] = item.type;
      });
      return init;
    }
    const init = {};
    SOFTWARE_20_ITEMS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });

  const [shuffledSwList, setShuffledSwList] = useState(() =>
    [...SOFTWARE_20_ITEMS].sort(() => Math.random() - 0.5)
  );
  const [selectedSwItem, setSelectedSwItem] = useState(null);
  const [swChecked, setSwChecked] = useState(() => {
    return Number(currentScore) >= 25;
  });

  // Simpan draft penempatan ke localStorage agar aman saat berpindah tab/misi
  useEffect(() => {
    try {
      localStorage.setItem(HW_KEY, JSON.stringify(hwPlacements));
    } catch (e) {
      /* ignore */
    }
  }, [HW_KEY, hwPlacements]);

  useEffect(() => {
    try {
      localStorage.setItem(SW_KEY, JSON.stringify(swPlacements));
    } catch (e) {
      /* ignore */
    }
  }, [SW_KEY, swPlacements]);

  // State Kuis (No individual answer reveal, full reset required)
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
    return Number(currentScore) >= 35;
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
      const savedHw = localStorage.getItem(HW_KEY);
      if (savedHw) {
        const parsed = JSON.parse(savedHw);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          setHwPlacements(parsed);
          const placedCount = Object.values(parsed).filter(Boolean).length;
          if (placedCount >= 10 || Number(currentScore) >= 15) {
            setHwChecked(true);
          }
        }
      } else if (Number(currentScore) >= 15) {
        const init = {};
        HARDWARE_20_ITEMS.forEach((item) => { init[item.id] = item.category; });
        setHwPlacements(init);
        setHwChecked(true);
      }

      const savedSw = localStorage.getItem(SW_KEY);
      if (savedSw) {
        const parsed = JSON.parse(savedSw);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          setSwPlacements(parsed);
          const placedCount = Object.values(parsed).filter(Boolean).length;
          if (placedCount >= 10 || Number(currentScore) >= 25) {
            setSwChecked(true);
          }
        }
      } else if (Number(currentScore) >= 25) {
        const init = {};
        SOFTWARE_20_ITEMS.forEach((item) => { init[item.id] = item.type; });
        setSwPlacements(init);
        setSwChecked(true);
      }

      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          setQuizAnswers(parsed);
          if (Object.keys(parsed).length === 5 || Number(currentScore) >= 35) {
            setQuizChecked(true);
          }
        }
      } else if (Number(currentScore) >= 35) {
        const initQ = {};
        QUIZ_QUESTIONS.forEach((q) => { initQ[q.id] = q.correct; });
        setQuizAnswers(initQ);
        setQuizChecked(true);
      }

      if (Number(currentScore) > 0 || savedHw || savedSw || savedQ) {
        setMateriRead(true);
      }
    } catch (e) {
      /* ignore */
    }
  }, [HW_KEY, SW_KEY, QUIZ_KEY, currentScore]);

  // ====================================================
  // PERHITUNGAN SKOR (Total 35 Poin untuk Misi 1):
  // - Lab Hardware (20 item): 15 Poin (0.75 poin per item benar)
  // - Lab Software (20 item): 10 Poin (0.5 poin per item benar)
  // - Kuis Komputer (5 soal): 10 Poin (2 poin per soal benar)
  // Total = 15 + 10 + 10 = 35 Poin
  // ====================================================
  const hwCorrectCount = HARDWARE_20_ITEMS.filter(
    (item) => hwPlacements[item.id] === item.category
  ).length;
  const hwScore = Math.round((hwCorrectCount / 20) * 15 * 10) / 10;

  const swCorrectCount = SOFTWARE_20_ITEMS.filter(
    (item) => swPlacements[item.id] === item.type
  ).length;
  const swScore = Math.round((swCorrectCount / 20) * 10 * 10) / 10;

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin max

  const calculatedScore = Math.round(hwScore + swScore + quizScore);
  const totalM1Score = Math.min(35, Math.max(Number(currentScore) || 0, calculatedScore));

  // Handler Hardware Placement
  const handleAssignHw = (itemId, targetCategory) => {
    const isUnassigning = !targetCategory || hwPlacements[itemId] === targetCategory;
    const nextCategory = isUnassigning ? '' : targetCategory;

    setHwPlacements((prev) => ({
      ...prev,
      [itemId]: nextCategory,
    }));
    setHwChecked(false);
  };

  const handleClearHw = () => {
    const cleared = {};
    HARDWARE_20_ITEMS.forEach((h) => { cleared[h.id] = ''; });
    setHwPlacements(cleared);
    setSelectedHwItem(null);
    setHwChecked(false);
    setShuffledHwList([...HARDWARE_20_ITEMS].sort(() => Math.random() - 0.5));
  };

  // Handler Software Placement
  const handleAssignSw = (itemId, targetType) => {
    const isUnassigning = !targetType || swPlacements[itemId] === targetType;
    const nextType = isUnassigning ? '' : targetType;

    setSwPlacements((prev) => ({
      ...prev,
      [itemId]: nextType,
    }));
    setSwChecked(false);
  };

  const handleClearSw = () => {
    const cleared = {};
    SOFTWARE_20_ITEMS.forEach((s) => { cleared[s.id] = ''; });
    setSwPlacements(cleared);
    setSelectedSwItem(null);
    setSwChecked(false);
    setShuffledSwList([...SOFTWARE_20_ITEMS].sort(() => Math.random() - 0.5));
  };

  // Check hardware with sound & confetti
  const handleCheckHw = () => {
    setHwChecked(true);
    celebratePointGain(true);
    try {
      localStorage.setItem(HW_KEY, JSON.stringify(hwPlacements));
    } catch (e) {
      /* ignore */
    }
    const newHwCount = HARDWARE_20_ITEMS.filter((item) => hwPlacements[item.id] === item.category).length;
    const newHwScore = Math.round((newHwCount / 20) * 15 * 10) / 10;
    const newTotal = Math.min(35, Math.max(Number(currentScore) || 0, Math.round(newHwScore + swScore + quizScore)));
    if (onComplete && newTotal > 0) {
      onComplete('m1', newTotal);
    }
  };

  // Check software with sound & confetti
  const handleCheckSw = () => {
    setSwChecked(true);
    celebratePointGain(true);
    try {
      localStorage.setItem(SW_KEY, JSON.stringify(swPlacements));
    } catch (e) {
      /* ignore */
    }
    const newSwCount = SOFTWARE_20_ITEMS.filter((item) => swPlacements[item.id] === item.type).length;
    const newSwScore = Math.round((newSwCount / 20) * 10 * 10) / 10;
    const newTotal = Math.min(35, Math.max(Number(currentScore) || 0, Math.round(hwScore + newSwScore + quizScore)));
    if (onComplete && newTotal > 0) {
      onComplete('m1', newTotal);
    }
  };

  // Evaluate quiz with sound/confetti
  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers));
    } catch (e) {
      /* ignore */
    }
    const newQuizScore = quizCorrectCount * 2;
    const newTotal = Math.min(35, Math.max(Number(currentScore) || 0, Math.round(hwScore + swScore + newQuizScore)));
    if (onComplete && newTotal > 0) {
      onComplete('m1', newTotal);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Misi 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 1 • Bobot 35 Poin
            </span>
            <span className="text-xs text-slate-400">Komponen Hardware, Software OS & Kuis</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Arsitektur Komponen Sistem Komputer & Klasifikasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari konsep perangkat keras & lunak, cocokkan 20 hardware dan 20 software ke kategorinya, lalu selesaikan kuis pemahaman.
          </p>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setActiveTab('materi');
              setMateriRead(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi Visual</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('hw_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'hw_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>2. Lab Hardware (15p)</span>
            {(hwChecked || hwScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'hw_drag'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{hwScore}/15p</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sw_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sw_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Lab Software (10p)</span>
            {(swChecked || swScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'sw_drag'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{swScore}/10p</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'kuis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Kuis (10p)</span>
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

      {/* TAB 1: MATERI VISUAL */}
      {activeTab === 'materi' && (
        <TabMateriVisual
          onNextTab={() => {
            setMateriRead(true);
            setActiveTab('hw_drag');
          }}
        />
      )}

      {/* TAB 2: LAB DRAG & DROP 20 KOMPONEN HARDWARE */}
      {activeTab === 'hw_drag' && (
        <TabLabHardware
          hwPlacements={hwPlacements}
          onAssignHw={handleAssignHw}
          onClearHw={handleClearHw}
          shuffledHwList={shuffledHwList}
          selectedHwItem={selectedHwItem}
          setSelectedHwItem={setSelectedHwItem}
          hwChecked={hwChecked}
          hwScore={hwScore}
          hwCorrectCount={hwCorrectCount}
          onCheckHw={handleCheckHw}
          onNextTab={() => setActiveTab('sw_drag')}
        />
      )}

      {/* TAB 3: LAB DRAG & DROP 20 SOFTWARE (OS vs APLIKASI) */}
      {activeTab === 'sw_drag' && (
        <TabLabSoftware
          swPlacements={swPlacements}
          onAssignSw={handleAssignSw}
          onClearSw={handleClearSw}
          shuffledSwList={shuffledSwList}
          selectedSwItem={selectedSwItem}
          setSelectedSwItem={setSelectedSwItem}
          swChecked={swChecked}
          swScore={swScore}
          swCorrectCount={swCorrectCount}
          onCheckSw={handleCheckSw}
          onNextTab={() => setActiveTab('kuis')}
        />
      )}

      {/* TAB 4: KUIS PEMAHAMAN SISTEM KOMPUTER */}
      {activeTab === 'kuis' && (
        <TabKuisKomputer
          quizAnswers={quizAnswers}
          onSelectAnswer={(qid, optId) => setQuizAnswers((prev) => ({ ...prev, [qid]: optId }))}
          quizChecked={quizChecked}
          quizScore={quizScore}
          quizCorrectCount={quizCorrectCount}
          onEvaluateQuiz={handleEvaluateQuiz}
          onResetQuiz={handleResetQuiz}
          totalM1Score={totalM1Score}
          onNextMission={onNextMission}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

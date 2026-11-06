import React, { useState, useEffect, useMemo } from 'react';
import {
  GameLevel,
  LabId,
  PlayerProgress,
  ElectricLevel,
  ChemistryLevel,
  PhysicsLevel,
} from './types/game';
import { ELECTRIC_LEVELS } from './data/electricLevels';
import { CHEMISTRY_LEVELS } from './data/chemistryLevels';
import { PHYSICS_LEVELS } from './data/physicsLevels';
import { ElectricLab } from './components/labs/ElectricLab';
import { ChemistryLab } from './components/labs/ChemistryLab';
import { PhysicsLab } from './components/labs/PhysicsLab';
import { UpdateAndParentModal } from './components/UpdateAndParentModal';
import { soundEngine } from './utils/soundEngine';
import {
  Volume2,
  VolumeX,
  Settings,
  Star,
  Home,
  Grid,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Award,
  Sparkles,
  Download,
} from 'lucide-react';

const STORAGE_PROGRESS_KEY = 'daneshmand_kocholo_progress_v1';
const STORAGE_CUSTOM_LEVELS_KEY = 'daneshmand_kocholo_custom_levels_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  completedIds: {},
  soundEnabled: true,
  voiceEnabled: true,
  updateManifestUrl: './updates/latest-levels.json',
  installedPackIds: [],
  childName: 'دانشمند کوچولو',
};

const LAB_CARDS: Array<{
  id: LabId;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  gradient: string;
  border: string;
}> = [
  {
    id: 'electric',
    title: 'آزمایشگاه برق و الکترونیک',
    subtitle: 'از وصل کردن باتری و آرمیچر تا سیم‌کشی حرفه‌ای تابلو فیوز، کلید یک‌پل، دوپل و پریز برق!',
    badge: '۹۰ مرحله حرفه‌ای برق',
    image: './assets/lab-electric.jpg',
    gradient: 'from-amber-500/25 via-orange-600/15 to-slate-900',
    border: 'border-amber-400/50 hover:border-amber-300',
  },
  {
    id: 'chemistry',
    title: 'آزمایشگاه شیمی و واکنش‌ها',
    subtitle: 'فواره نوشابه و نمک در دو شیشه، کوه آتشفشان، شیر جادویی، ترکیب رنگ‌ها، چراغ گدازه‌ای و اسلایم!',
    badge: '۹۰ مرحله جذاب شیمی',
    image: './assets/lab-chemistry.jpg',
    gradient: 'from-fuchsia-500/25 via-purple-600/15 to-slate-900',
    border: 'border-fuchsia-400/50 hover:border-fuchsia-300',
  },
  {
    id: 'physics',
    title: 'آزمایشگاه علوم و آهنربا',
    subtitle: 'جذب آهن و نچسبیدن به چوب با آهنربا، شناوری در آب، بادکنک الکتریسیته ساکن، ترازو و منشور نور!',
    badge: '۹۰ مرحله کشف علمی',
    image: './assets/lab-physics.jpg',
    gradient: 'from-emerald-500/25 via-cyan-600/15 to-slate-900',
    border: 'border-emerald-400/50 hover:border-emerald-300',
  },
];

export const App: React.FC = () => {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  const [customLevels, setCustomLevels] = useState<GameLevel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_LEVELS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [screen, setScreen] = useState<'home' | 'map' | 'play'>('home');
  const [activeLab, setActiveLab] = useState<LabId>('electric');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [activeLevelId, setActiveLevelId] = useState<string>('elec-1');
  const [parentModalOpen, setParentModalOpen] = useState<boolean>(false);

  // Sync sound engine settings
  useEffect(() => {
    soundEngine.soundEnabled = progress.soundEnabled;
    soundEngine.voiceEnabled = progress.voiceEnabled;
    soundEngine.customCheerUrl = progress.customCheerAudioDataUrl;
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Ignore quota errors
    }
  }, [progress]);

  // Persist custom / updated levels (in both localStorage and Electron disk store if running as .exe!)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_LEVELS_KEY, JSON.stringify(customLevels));
    } catch {
      // Ignore
    }
    if (window.desktopAPI) {
      window.desktopAPI
        .savePacks([
          {
            packId: 'saved-user-levels',
            version: '1.0',
            title: 'Saved Levels',
            description: '',
            releasedAt: '',
            levels: customLevels,
          },
        ])
        .catch(() => {});
    }
  }, [customLevels]);

  // Load Electron saved packs on startup if running as Windows .exe
  useEffect(() => {
    if (window.desktopAPI) {
      window.desktopAPI
        .loadSavedPacks()
        .then((packs) => {
          if (Array.isArray(packs) && packs.length > 0) {
            const loaded = packs.flatMap((p) => p.levels || []);
            if (loaded.length > 0) {
              setCustomLevels((prev) => {
                const existingIds = new Set(prev.map((x) => x.id));
                const merged = [...prev];
                loaded.forEach((l) => {
                  if (!existingIds.has(l.id)) merged.push(l);
                });
                return merged;
              });
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const allLevels = useMemo<GameLevel[]>(
    () => [...ELECTRIC_LEVELS, ...CHEMISTRY_LEVELS, ...PHYSICS_LEVELS, ...customLevels],
    [customLevels]
  );

  const labLevels = useMemo(
    () =>
      allLevels
        .filter((l) => l.lab === activeLab)
        .sort((a, b) => a.number - b.number),
    [allLevels, activeLab]
  );

  const currentLevel = useMemo(
    () => allLevels.find((l) => l.id === activeLevelId) || labLevels[0],
    [allLevels, activeLevelId, labLevels]
  );

  // Auto-read prompt softly when entering a level
  useEffect(() => {
    if (screen === 'play' && currentLevel && progress.voiceEnabled) {
      const timer = setTimeout(() => {
        soundEngine.speakPersian(currentLevel.kidPrompt);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [screen, currentLevel?.id]);

  const totalCompletedCount = Object.keys(progress.completedIds).length;
  const totalStars = Object.values(progress.completedIds).reduce((a, b) => a + b, 0);

  const scientistRank =
    totalCompletedCount >= 180
      ? '👑 پروفسور ارشد کل آزمایشگاه'
      : totalCompletedCount >= 60
      ? '🚀 مخترع درخشان'
      : totalCompletedCount >= 15
      ? '⚡ مهندس خلاق'
      : '🌟 دانشمند کنجکاو';

  const updateProgress = (patch: Partial<PlayerProgress>) => {
    setProgress((prev) => ({ ...prev, ...patch }));
  };

  const handleAddLevels = (incoming: GameLevel[], packId?: string) => {
    setCustomLevels((prev) => {
      const map = new Map(prev.map((l) => [l.id, l]));
      incoming.forEach((lvl) => map.set(lvl.id, { ...lvl, isCustomOrUpdate: true }));
      return Array.from(map.values());
    });
    if (packId && !progress.installedPackIds.includes(packId)) {
      updateProgress({ installedPackIds: [...progress.installedPackIds, packId] });
    }
  };

  const handleCompleteCurrentLevel = () => {
    if (!currentLevel) return;
    setProgress((prev) => ({
      ...prev,
      completedIds: {
        ...prev.completedIds,
        [currentLevel.id]: 3,
      },
    }));
  };

  const handleGoNextLevel = () => {
    if (!currentLevel) return;
    const idx = labLevels.findIndex((l) => l.id === currentLevel.id);
    if (idx >= 0 && idx < labLevels.length - 1) {
      const next = labLevels[idx + 1];
      setActiveLevelId(next.id);
      setSelectedChapter(next.chapter);
    } else {
      setScreen('map');
    }
  };

  const handleGoPrevLevel = () => {
    if (!currentLevel) return;
    const idx = labLevels.findIndex((l) => l.id === currentLevel.id);
    if (idx > 0) {
      const prev = labLevels[idx - 1];
      setActiveLevelId(prev.id);
      setSelectedChapter(prev.chapter);
    }
  };

  const openLabPortal = (labId: LabId, directPlay = false) => {
    soundEngine.playPop(620);
    setActiveLab(labId);
    const list = allLevels
      .filter((l) => l.lab === labId)
      .sort((a, b) => a.number - b.number);
    const firstUnfinished = list.find((l) => !progress.completedIds[l.id]) || list[0];
    setActiveLevelId(firstUnfinished.id);
    setSelectedChapter(firstUnfinished.chapter);
    setScreen(directPlay ? 'play' : 'map');
  };

  const toggleFullscreen = () => {
    if (window.desktopAPI) {
      window.desktopAPI.toggleFullscreen();
    } else if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black text-white flex flex-col">
      {/* Top Global Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(520);
              setScreen('home');
            }}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <img
              src="./icon.png"
              alt="دانشمند کوچولو"
              className="w-11 h-11 rounded-2xl border-2 border-amber-400 shadow-lg group-hover:scale-105 transition"
            />
            <div className="text-right">
              <h1 className="text-lg sm:text-xl font-black bg-gradient-to-l from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
                دانشمند کوچولو
              </h1>
              <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
                {scientistRank}
              </p>
            </div>
          </button>

          {screen !== 'home' && (
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(500);
                  setScreen('home');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-white/10"
              >
                <Home className="w-4 h-4 text-amber-400" />
                خانه
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(540);
                  setScreen('map');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-white/10"
              >
                <Grid className="w-4 h-4 text-cyan-400" />
                مراحل ۹۰گانه
              </button>
            </div>
          )}
        </div>

        {/* Right Controls: Stars, Sound, Fullscreen, Update/Parent Center */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-xs sm:text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalStars}</span>
          </div>

          <button
            type="button"
            onClick={() => updateProgress({ soundEnabled: !progress.soundEnabled })}
            className={`p-2 rounded-xl border transition ${
              progress.soundEnabled
                ? 'bg-slate-800 border-white/15 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
            title="قطع / وصل صدا"
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-sky-300 transition hidden sm:flex"
            title="تمام‌صفحه"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {!window.desktopAPI && (
            <a
              href="https://github.com/saeedsly/azmaeshkocholo/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition"
              title="دانلود مستقیم نسخه نصبی و پرتابل ویندوز (.EXE)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دانلود ویندوز (.EXE)</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(660);
              setParentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>آپدیت و والدین</span>
            <Settings className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col">
        {/* ==================== SCREEN 1: HOME LOBBY ==================== */}
        {screen === 'home' && (
          <div className="space-y-7 my-auto">
            {/* Hero Welcome Banner */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-gradient-to-l from-indigo-900/80 via-slate-900/95 to-cyan-950/80 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center gap-6">
              <img
                src="./assets/mascot.jpg"
                alt="پروفسور کوچولو"
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-3xl border-4 border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] shrink-0 animate-float"
              />
              <div className="space-y-3 text-center md:text-right flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black">
                  <Sparkles className="w-4 h-4" />
                  <span>مجموعه کامل ۲۷۰ مرحله‌ای ویژه کودک (با قابلیت افزودن مرحله جدید!)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  سلام {progress.childName} قهرمان! به آزمایشگاه بزرگت خوش اومدی! 🔬
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  امروز می‌خوای کدوم آزمایش رو انجام بدیم؟ آرمیچر و باتری و کلید و پریز ببندیم، فواره نوشابه و نمک درست کنیم، یا با آهنربای جادویی آهن‌ها رو شکار کنیم؟
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-bold text-emerald-300">
                    <Award className="w-4 h-4" />
                    <span>مراحل حل‌شده: {totalCompletedCount} از {allLevels.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => soundEngine.speakPersian(`سلام ${progress.childName} عزیز! بیا یکی از سه تا آزمایشگاه رو انتخاب کن تا بازی رو شروع کنیم!`)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 text-xs font-black transition"
                  >
                    🔊 شنیدن خوش‌آمدگویی صوتی
                  </button>
                </div>
              </div>
            </div>

            {/* 3 World Portal Cards (90 Levels Each!) */}
            <div className="grid md:grid-cols-3 gap-5">
              {LAB_CARDS.map((card) => {
                const levelsOfCard = allLevels.filter((l) => l.lab === card.id);
                const doneCount = levelsOfCard.filter((l) => progress.completedIds[l.id]).length;
                const pct = Math.round((doneCount / Math.max(1, levelsOfCard.length)) * 100);

                return (
                  <div
                    key={card.id}
                    className={`group rounded-3xl border-2 ${card.border} bg-gradient-to-b ${card.gradient} overflow-hidden shadow-2xl flex flex-col justify-between transition transform hover:-translate-y-1.5`}
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/85 border border-amber-300/50 text-amber-300 text-xs font-black">
                          {levelsOfCard.length} قسمت کامل
                        </span>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <h3 className="text-xl font-black text-white">{card.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed min-h-[52px]">
                          {card.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="pt-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                            <span>پیشرفت قهرمان</span>
                            <span>
                              {doneCount} / {levelsOfCard.length} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-gradient-to-l from-amber-400 to-emerald-400 transition-all duration-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openLabPortal(card.id, true)}
                        className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition transform active:scale-95"
                      >
                        شروع بازی ▶
                      </button>
                      <button
                        type="button"
                        onClick={() => openLabPortal(card.id, false)}
                        className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/15 transition"
                      >
                        ۹۰ مرحله
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== SCREEN 2: 90-LEVEL CHAPTER MAP ==================== */}
        {screen === 'map' && (
          <div className="space-y-5">
            {/* Lab Switcher Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-white/10 rounded-3xl p-4">
              <div className="flex flex-wrap gap-2">
                {LAB_CARDS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(560);
                      setActiveLab(c.id);
                      setSelectedChapter(1);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition ${
                      activeLab === c.id
                        ? 'bg-amber-400 text-slate-950 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
              <span className="text-xs text-amber-300 font-bold">
                مجموع مراحل این بخش: {labLevels.length} مرحله (همه باز و قابل انتخاب!)
              </span>
            </div>

            {/* 9 Chapters Selector */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((ch) => {
                const chLevels = labLevels.filter((l) => l.chapter === ch);
                const chDone = chLevels.filter((l) => progress.completedIds[l.id]).length;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(500 + ch * 25);
                      setSelectedChapter(ch);
                    }}
                    className={`px-3.5 py-2 rounded-2xl border text-xs font-black transition flex items-center gap-1.5 ${
                      selectedChapter === ch
                        ? 'bg-cyan-400 text-slate-950 border-white shadow-lg scale-105'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-white/10'
                    }`}
                  >
                    <span>فصل {ch}</span>
                    <span className="text-[10px] opacity-80">
                      ({chDone}/{chLevels.length})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Chapter Title Banner */}
            <div className="px-5 py-3 rounded-2xl bg-indigo-950/70 border border-indigo-400/30 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-amber-300">
                {labLevels.find((l) => l.chapter === selectedChapter)?.chapterTitle ||
                  `فصل ${selectedChapter}`}
              </h3>
              <span className="text-xs text-slate-300">روی هر شماره کلیک کن تا وارد آزمایشگاه بشوی!</span>
            </div>

            {/* Stages Grid for Selected Chapter */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {labLevels
                .filter((l) => l.chapter === selectedChapter)
                .map((lvl) => {
                  const stars = progress.completedIds[lvl.id] || 0;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playPop(640);
                        setActiveLevelId(lvl.id);
                        setScreen('play');
                      }}
                      className={`group p-4 rounded-3xl border-2 text-right flex flex-col justify-between gap-3 transition transform hover:-translate-y-1 shadow-xl ${
                        stars > 0
                          ? 'bg-emerald-950/60 border-emerald-400/60 hover:border-emerald-300'
                          : 'bg-slate-900/90 border-white/15 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow">
                          {lvl.number}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                stars >= s
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2">
                          {lvl.title}
                        </div>
                        {lvl.isCustomOrUpdate && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-fuchsia-500/30 text-fuchsia-200 text-[10px] font-bold">
                            ✨ مرحله آپدیت‌شده
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-black text-amber-300 group-hover:translate-x-[-4px] transition">
                        ورود به آزمایش ◀
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== SCREEN 3: ACTIVE LABORATORY WORKBENCH ==================== */}
        {screen === 'play' && currentLevel && (
          <div className="space-y-3.5">
            {/* Level Header + Mascot Voice Guidance */}
            <div className="bg-slate-900/90 border-2 border-white/15 rounded-3xl p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <img
                  src="./assets/mascot.jpg"
                  alt="دانشمند کوچولو"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                      مرحله {currentLevel.number} از {labLevels.length}
                    </span>
                    <span className="text-xs font-bold text-cyan-300">
                      {currentLevel.chapterTitle}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {currentLevel.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                    {currentLevel.kidPrompt}
                  </p>
                </div>
              </div>

              {/* Voice Readout + Prev/Next Stage Quick Navigation */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => soundEngine.speakPersian(currentLevel.kidPrompt)}
                  className="px-3.5 py-2 rounded-2xl bg-cyan-500/25 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 text-xs font-black transition"
                  title="پخش صوتی راهنمای مرحله"
                >
                  🔊 راهنمای صوتی
                </button>
                <button
                  type="button"
                  onClick={handleGoPrevLevel}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white"
                  title="مرحله قبلی"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleGoNextLevel}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white"
                  title="مرحله بعدی"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Render Dedicated Interactive Lab Engine */}
            {currentLevel.lab === 'electric' && (
              <ElectricLab
                level={currentLevel as ElectricLevel}
                onComplete={handleCompleteCurrentLevel}
                onNextLevel={handleGoNextLevel}
              />
            )}

            {currentLevel.lab === 'chemistry' && (
              <ChemistryLab
                level={currentLevel as ChemistryLevel}
                onComplete={handleCompleteCurrentLevel}
                onNextLevel={handleGoNextLevel}
              />
            )}

            {currentLevel.lab === 'physics' && (
              <PhysicsLab
                level={currentLevel as PhysicsLevel}
                onComplete={handleCompleteCurrentLevel}
                onNextLevel={handleGoNextLevel}
              />
            )}
          </div>
        )}
      </main>

      {/* Parent Settings, Online Level Updater & Level Builder Modal */}
      <UpdateAndParentModal
        isOpen={parentModalOpen}
        onClose={() => setParentModalOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
        customLevels={customLevels}
        onAddLevels={handleAddLevels}
        allLevels={allLevels}
        onJumpToLevel={(lab, levelId) => {
          setActiveLab(lab);
          setActiveLevelId(levelId);
          setScreen('play');
        }}
      />
    </div>
  );
};

export default App;

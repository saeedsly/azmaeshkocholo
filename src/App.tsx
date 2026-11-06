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
import { CreatorShowcaseModal } from './components/CreatorShowcaseModal';
import { AmbientLabBackground } from './components/AmbientLabBackground';
import { getStartClipForLevel, getWinExplanationForLevel } from './utils/kidExplanations';
import { soundEngine } from './utils/soundEngine';
import {
  Volume2,
  VolumeX,
  Settings,
  Home,
  Grid,
  ChevronRight,
  ChevronLeft,
  Star,
  Trophy,
  Award,
  Maximize2,
  Download,
  RefreshCw,
  Code2,
  Sparkles,
} from 'lucide-react';

const STORAGE_PROGRESS_KEY = 'daneshmand_kocholo_progress_v1';
const STORAGE_CUSTOM_LEVELS_KEY = 'daneshmand_kocholo_custom_levels_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  completedIds: {},
  lastPlayedLevelId: {
    electric: 'elec-001',
    chemistry: 'chem-001',
    physics: 'phys-001',
  },
  soundEnabled: true,
  voiceEnabled: true,
  narratorVoice: 'fa-IR-DilaraNeural',
  childName: 'پسر دانشمندم',
  creatorName: 'مهندس سعید سالاری (Saeed Salari)',
  creatorRole: 'طراح، معمار نرم‌افزار و برنامه‌نویس اپلیکیشن',
  creatorDedication:
    'پسرم، این آزمایشگاه بزرگ رو با تمام عشقم برنامه‌نویسی کردم تا هر روز با بازی و شادی، رازهای برق، شیمی و دنیای علم رو کشف کنی. بهت افتخار می‌کنم دانشمند کوچولوی بابا! 💛',
  installedPackIds: [],
  updateManifestUrl: './updates/latest-levels.json',
};

const LAB_META: Record<
  LabId,
  {
    title: string;
    subtitle: string;
    badgeText: string;
    bannerImg: string;
    gradient: string;
    border: string;
    accentText: string;
    introClip: string;
  }
> = {
  electric: {
    title: 'مهندسی برق و الکترونیک',
    subtitle: 'از باتری و آرمیچر و پنکه تا برق‌کشی حرفه‌ای کلید و پریز ساختمان!',
    badgeText: '۹۰ مرحله واقعی برق',
    bannerImg: './assets/world-electric.png',
    gradient: 'from-amber-500/25 via-orange-600/15 to-slate-900/95',
    border: 'border-amber-400/65 hover:border-amber-300',
    accentText: 'text-amber-300',
    introClip: 'elec_step_place',
  },
  chemistry: {
    title: 'آزمایشگاه شیمی و معجون‌ها',
    subtitle: 'نوشابه و نمک، باد شدن خودکار بادکنک، آتشفشان کفی و لامپ گدازه‌ای!',
    badgeText: '۹۰ مرحله شیمی جذاب',
    bannerImg: './assets/world-chemistry.png',
    gradient: 'from-fuchsia-500/25 via-purple-600/15 to-slate-900/95',
    border: 'border-fuchsia-400/65 hover:border-fuchsia-300',
    accentText: 'text-fuchsia-300',
    introClip: 'chem_step_start',
  },
  physics: {
    title: 'علوم روزمره و کشف طبیعت',
    subtitle: 'آهنربا به آهن می‌چسبه نه چوب! شناوری در آب، منشور رنگین‌کمان و گیاهان!',
    badgeText: '۹۰ مرحله علوم روزمره',
    bannerImg: './assets/world-physics.png',
    gradient: 'from-emerald-500/25 via-cyan-600/15 to-slate-900/95',
    border: 'border-emerald-400/65 hover:border-emerald-300',
    accentText: 'text-emerald-300',
    introClip: 'phys_magnet_start',
  },
};

export function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (raw) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  const [customLevels, setCustomLevels] = useState<GameLevel[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_LEVELS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  });

  const [view, setView] = useState<'home' | 'map' | 'play'>('home');
  const [activeLab, setActiveLab] = useState<LabId>('electric');
  const [activeLevelId, setActiveLevelId] = useState<string>('elec-001');
  const [parentModalOpen, setParentModalOpen] = useState<boolean>(false);
  const [creatorModalOpen, setCreatorModalOpen] = useState<boolean>(false);
  const [isDesktopApp, setIsDesktopApp] = useState<boolean>(false);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);

  // Subscribe to live voice engine speaking state for animated mascot soundwaves
  useEffect(() => {
    return soundEngine.subscribeSpeaking(setIsSpeakingNow);
  }, []);

  useEffect(() => {
    soundEngine.enabled = progress.soundEnabled;
    soundEngine.voiceEnabled = progress.voiceEnabled;
    soundEngine.narratorVoice = progress.narratorVoice || 'fa-IR-DilaraNeural';
    soundEngine.customCheerUrl = progress.customCheerAudioDataUrl;
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore quota errors
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_LEVELS_KEY, JSON.stringify(customLevels));
    } catch {
      // ignore
    }
  }, [customLevels]);

  useEffect(() => {
    if (window.desktopAPI?.isDesktop) {
      setIsDesktopApp(true);
      window.desktopAPI.loadSavedPacks().then((packs) => {
        if (Array.isArray(packs) && packs.length > 0) {
          const imported: GameLevel[] = [];
          packs.forEach((p) => {
            if (Array.isArray(p.levels)) imported.push(...p.levels);
          });
          if (imported.length > 0) {
            setCustomLevels((prev) => {
              const ids = new Set(prev.map((l) => l.id));
              return [...prev, ...imported.filter((l) => !ids.has(l.id))];
            });
          }
        }
      });
    }
  }, []);

  const allLevels = useMemo<GameLevel[]>(() => {
    return [
      ...ELECTRIC_LEVELS,
      ...CHEMISTRY_LEVELS,
      ...PHYSICS_LEVELS,
      ...customLevels,
    ];
  }, [customLevels]);

  const levelsByLab = useMemo(() => {
    return {
      electric: allLevels
        .filter((l) => l.lab === 'electric')
        .sort((a, b) => a.number - b.number),
      chemistry: allLevels
        .filter((l) => l.lab === 'chemistry')
        .sort((a, b) => a.number - b.number),
      physics: allLevels
        .filter((l) => l.lab === 'physics')
        .sort((a, b) => a.number - b.number),
    };
  }, [allLevels]);

  const activeLevel = useMemo<GameLevel>(() => {
    const found = allLevels.find((l) => l.id === activeLevelId);
    return found || levelsByLab[activeLab][0];
  }, [allLevels, activeLevelId, activeLab, levelsByLab]);

  // Automatically narrate the Persian instruction whenever a child enters a level!
  useEffect(() => {
    if (view !== 'play' || !activeLevel) return;
    const timer = setTimeout(() => {
      const clipKey = getStartClipForLevel(activeLevel);
      soundEngine.speakClipKey(clipKey);
    }, 320);
    return () => clearTimeout(timer);
  }, [view, activeLevel]);

  const totalStars = Object.keys(progress.completedIds).length * 3;
  const completedCountForLab = (lab: LabId) =>
    levelsByLab[lab].filter((l) => progress.completedIds[l.id]).length;

  const scientistRank = useMemo(() => {
    const done = Object.keys(progress.completedIds).length;
    if (done >= 180) return 'پروفسور نابغه کل آزمایشگاه 🏆';
    if (done >= 90) return 'مخترع ارشد علوم 🥇';
    if (done >= 35) return 'مهندس خلاق آزمایشگاه 🥈';
    if (done >= 10) return 'کاشف باهوش ستاره‌دار 🌟';
    return 'دانشمند کوچولوی کنجکاو 🔬';
  }, [progress.completedIds]);

  const updateProgress = (patch: Partial<PlayerProgress>) => {
    setProgress((prev) => ({ ...prev, ...patch }));
  };

  const handleOpenLabPlay = (lab: LabId, specificLevelId?: string) => {
    soundEngine.playPop(620);
    setActiveLab(lab);
    const prevLast = progress.lastPlayedLevelId || {
      electric: 'elec-001',
      chemistry: 'chem-001',
      physics: 'phys-001',
    };
    const targetId =
      specificLevelId || prevLast[lab] || levelsByLab[lab][0]?.id;
    setActiveLevelId(targetId);
    updateProgress({
      lastPlayedLevelId: {
        ...prevLast,
        [lab]: targetId,
      },
    });
    setView('play');
  };

  const handleLevelComplete = () => {
    setProgress((prev) => ({
      ...prev,
      completedIds: {
        ...prev.completedIds,
        [activeLevel.id]: 3,
      },
    }));
  };

  const handleNextLevel = () => {
    soundEngine.stopSpeech();
    soundEngine.playPop(680);
    const list = levelsByLab[activeLevel.lab];
    const idx = list.findIndex((l) => l.id === activeLevel.id);
    if (idx >= 0 && idx + 1 < list.length) {
      const nextLvl = list[idx + 1];
      setActiveLevelId(nextLvl.id);
      const prevLast = progress.lastPlayedLevelId || {
        electric: 'elec-001',
        chemistry: 'chem-001',
        physics: 'phys-001',
      };
      updateProgress({
        lastPlayedLevelId: {
          ...prevLast,
          [activeLevel.lab]: nextLvl.id,
        },
      });
    } else {
      setView('map');
    }
  };

  const handlePrevLevel = () => {
    soundEngine.stopSpeech();
    soundEngine.playPop(480);
    const list = levelsByLab[activeLevel.lab];
    const idx = list.findIndex((l) => l.id === activeLevel.id);
    if (idx > 0) {
      setActiveLevelId(list[idx - 1].id);
    }
  };

  const handleAddLevels = (incoming: GameLevel[], packId?: string) => {
    setCustomLevels((prev) => {
      const existingIds = new Set(allLevels.map((l) => l.id));
      const fresh = incoming.filter((l) => !existingIds.has(l.id));
      const merged = [...prev, ...fresh];
      if (window.desktopAPI?.savePacks) {
        window.desktopAPI.savePacks([
          {
            packId: packId || `saved-${Date.now()}`,
            version: '2.0.0',
            title: 'مراحل سفارشی و آپدیت',
            description: 'مراحل اضافه شده توسط والدین یا سرور بروزرسانی',
            releasedAt: new Date().toISOString(),
            levels: merged,
          },
        ]);
      }
      return merged;
    });
    if (packId && !progress.installedPackIds.includes(packId)) {
      updateProgress({
        installedPackIds: [...progress.installedPackIds, packId],
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen text-white flex flex-col selection:bg-amber-400 selection:text-slate-950"
    >
      {/* Ultra-Pro Animated Aurora & Floating Science Backdrop */}
      <AmbientLabBackground />

      {/* Top Glassmorphism Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand Logo + Live Voice Equalizer Badge */}
          <div
            onClick={() => {
              soundEngine.playPop(560);
              setView('home');
              soundEngine.speakClipKey('welcome_home');
            }}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src="./icon.png"
                alt="دانشمند کوچولو"
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 shadow-lg transition ${
                  isSpeakingNow
                    ? 'border-emerald-400 scale-110 shadow-[0_0_22px_rgba(52,211,153,0.75)]'
                    : 'border-amber-400 group-hover:scale-105'
                }`}
              />
              {isSpeakingNow && (
                <span className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black animate-pulse">
                  🔊 گویا
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-l from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
                  دانشمند کوچولو
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-300">
                  v2.0 سخنگو
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-bold hidden sm:block">
                {progress.childName} — {scientistRank}
              </p>
            </div>
          </div>

          {/* Action Controls & Creator Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Stars Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400/15 border border-amber-400/40 shadow-inner">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {totalStars}
              </span>
            </div>

            {view !== 'home' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.stopSpeech();
                  soundEngine.playPop(500);
                  setView('home');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs sm:text-sm font-black transition"
              >
                <Home className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">خانه</span>
              </button>
            )}

            {view === 'play' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.stopSpeech();
                  soundEngine.playPop(520);
                  setView('map');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs sm:text-sm font-black transition"
              >
                <Grid className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">نقشه ۹۰ مرحله</span>
              </button>
            )}

            {/* Sound & Voice Quick Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !progress.soundEnabled;
                if (!next) soundEngine.stopSpeech();
                updateProgress({ soundEnabled: next, voiceEnabled: next });
              }}
              className={`p-2 rounded-2xl border transition ${
                progress.soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-400/45 text-emerald-300'
                  : 'bg-slate-800 border-white/10 text-slate-400'
              }`}
              title="قطع / وصل صدای گوینده و افکت‌ها"
            >
              {progress.soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {isDesktopApp && (
              <button
                type="button"
                onClick={() => window.desktopAPI?.toggleFullscreen()}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-cyan-300 transition"
                title="تمام‌صفحه"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Dedicated Developer / Programmer Showcase Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(660);
                setCreatorModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-l from-amber-400/25 to-yellow-500/20 hover:from-amber-400/40 hover:to-yellow-500/35 border border-amber-300/60 text-xs sm:text-sm font-black text-amber-200 shadow-lg transition"
              title="درباره برنامه‌نویس و سازنده اپلیکیشن"
            >
              <Code2 className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">سازنده اپ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPop(600);
                setParentModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-white/25 text-xs sm:text-sm font-black shadow-lg transition"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">آپدیت و والدین</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex flex-col gap-6">
        {/* ================= HOME SCREEN ================= */}
        {view === 'home' && (
          <>
            {/* Hero Kid Scientist Banner */}
            <section className="relative rounded-[2.2rem] overflow-hidden border-2 border-amber-400/50 bg-gradient-to-l from-indigo-950/95 via-slate-900/95 to-purple-950/95 shadow-[0_25px_70px_rgba(0,0,0,0.55)] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/45 text-amber-300 text-xs font-black">
                  <Sparkles className="w-4 h-4" />
                  <span>نسخه ۲.۰ اولترا پرو با گوینده فارسی قدم‌به‌قدم و قصه‌گوی علمی!</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                  سلام {progress.childName}! 👋
                  <br />
                  <span className="text-amber-300">
                    امروز کدوم آزمایش شگفت‌انگیز رو انجام بدیم؟
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  فقط روی هر آزمایشگاه بزن! گوینده مهربون فارسی قدم‌به‌قدم بهت می‌گه چیکار کنی و بعد از هر آزمایش هم راز علمی اون رو برات تعریف می‌کنه!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => soundEngine.speakClipKey('welcome_home')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-b-4 border-amber-600 shadow-xl transition transform hover:scale-105 ${
                      isSpeakingNow ? 'ring-4 ring-emerald-400' : ''
                    }`}
                  >
                    <Volume2 className={`w-5 h-5 ${isSpeakingNow ? 'animate-bounce' : ''}`} />
                    {isSpeakingNow ? 'در حال صحبت با دانشمند کوچولو...' : 'پخش خوش‌آمدگویی صوتی 🔊'}
                  </button>

                  {!isDesktopApp && (
                    <a
                      href="https://github.com/saeedsly/azmaeshkocholo/releases/download/v2.0.0/Daneshmand-Kocholo-Portable-2.0.0.exe"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm border-b-4 border-emerald-700 shadow-xl transition transform hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      دانلود مستقیم ویندوز (.EXE نسخه ۲.۰)
                    </a>
                  )}
                </div>
              </div>

              <div className="relative z-10 shrink-0">
                <div className="absolute -inset-4 bg-amber-400/25 rounded-full blur-2xl animate-pulse pointer-events-none" />
                <img
                  src="./assets/hero-kid-scientist.png"
                  alt="دانشمند کوچولو"
                  className="relative w-48 h-48 sm:w-60 sm:h-60 object-cover rounded-[2rem] border-4 border-amber-300 shadow-2xl"
                />
              </div>
            </section>

            {/* 3 World Portals (90 Levels Each) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(['electric', 'chemistry', 'physics'] as LabId[]).map((labId) => {
                const meta = LAB_META[labId];
                const totalInLab = levelsByLab[labId].length;
                const doneInLab = completedCountForLab(labId);
                const pct = Math.round((doneInLab / Math.max(1, totalInLab)) * 100);

                return (
                  <div
                    key={labId}
                    onClick={() => handleOpenLabPlay(labId)}
                    className={`cursor-pointer group rounded-[2rem] border-2 ${meta.border} bg-gradient-to-b ${meta.gradient} backdrop-blur-md p-5 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between gap-4`}
                  >
                    <div className="space-y-3.5">
                      <div className="relative h-46 rounded-2xl overflow-hidden border border-white/15">
                        <img
                          src={meta.bannerImg}
                          alt={meta.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/85 border border-white/20 text-xs font-black text-amber-300 shadow">
                          {meta.badgeText}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.speakClipKey(meta.introClip);
                          }}
                          className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg transition transform hover:scale-110"
                          title="شنیدن معرفی صوتی بخش"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {meta.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {meta.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={meta.accentText}>پیشرفت آزمایش‌ها</span>
                          <span className="text-white">
                            {doneInLab} از {totalInLab} مرحله ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-950/90 overflow-hidden p-0.5 border border-white/10">
                          <div
                            style={{ width: `${Math.max(4, pct)}%` }}
                            className="h-full rounded-full bg-gradient-to-l from-amber-400 to-emerald-400 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLabPlay(labId);
                          }}
                          className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-b-4 border-amber-600 shadow-lg transition"
                        >
                          شروع بازی و آزمایش ▶
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.playPop(540);
                            setActiveLab(labId);
                            setView('map');
                          }}
                          className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/15 transition"
                        >
                          ۹۰ مرحله
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ================= DEDICATED DEVELOPER / PROGRAMMER SIGNATURE CARD ================= */}
            <section className="relative rounded-[2rem] overflow-hidden border-2 border-amber-400/55 bg-gradient-to-l from-slate-900/95 via-indigo-950/90 to-slate-900/95 p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-3 border-amber-300 bg-gradient-to-br from-amber-400/30 to-indigo-600/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] shrink-0">
                  {progress.creatorPhotoDataUrl ? (
                    <img
                      src={progress.creatorPhotoDataUrl}
                      alt={progress.creatorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👨‍💻</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] font-black text-amber-300">
                    <Award className="w-3.5 h-3.5" />
                    <span>بخش ویژه طراح و برنامه‌نویس اپلیکیشن</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    برنامه‌نویسی و توسعه توسط:{' '}
                    <span className="text-amber-300">
                      {progress.creatorName || 'مهندس سعید سالاری (Saeed Salari)'}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    «{progress.creatorDedication || DEFAULT_PROGRESS.creatorDedication}»
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => soundEngine.speakClipKey('creator_tribute')}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm border-b-4 border-amber-600 shadow-lg transition"
                >
                  <Volume2 className="w-4 h-4" />
                  معرفی صوتی سازنده اپ
                </button>
                <button
                  type="button"
                  onClick={() => setCreatorModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-300/40 text-amber-200 font-black text-xs sm:text-sm transition"
                >
                  <Code2 className="w-4 h-4" />
                  مشاهده پروفایل و ویرایش مشخصات سازنده
                </button>
              </div>
            </section>

            {/* Direct Windows .EXE v2.0 Download Bar */}
            {!isDesktopApp && (
              <section className="rounded-3xl border border-emerald-400/40 bg-slate-900/90 p-5 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center lg:text-right">
                  <h3 className="text-base sm:text-lg font-black text-emerald-300 flex items-center justify-center lg:justify-start gap-2">
                    <Download className="w-5 h-5" />
                    دانلود مستقیم نرم‌افزار ویندوز «دانشمند کوچولو» — نسخه ۲.۰ سخنگو (.EXE)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    شامل تمام ۲۷۰ مرحله + صدای فارسی داخلی (بدون نیاز به نصب صدای فارسی روی ویندوز!) — قابل اجرا روی ویندوز ۱۰ و ۱۱:
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                  <a
                    href="https://github.com/saeedsly/azmaeshkocholo/releases/download/v2.0.0/Daneshmand-Kocholo-Portable-2.0.0.exe"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm border-b-4 border-emerald-600 shadow-lg transition"
                  >
                    ⚡ دانلود نسخه بدون نصب (Portable v2.0.0 .EXE)
                  </a>
                  <a
                    href="https://github.com/saeedsly/azmaeshkocholo/releases/download/v2.0.0/Daneshmand-Kocholo-Setup-2.0.0.exe"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm border-b-4 border-cyan-600 shadow-lg transition"
                  >
                    💿 دانلود فایل نصبی ویندوز (Setup v2.0.0 .EXE)
                  </a>
                  <button
                    type="button"
                    onClick={() => setParentModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-amber-300 font-bold text-xs transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    بروزرسانی مراحل
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* ================= 90-LEVEL MAP SCREEN ================= */}
        {view === 'map' && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-white/15 rounded-3xl p-4 shadow-xl">
              <div className="flex flex-wrap items-center gap-2">
                {(['electric', 'chemistry', 'physics'] as LabId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop(540);
                      setActiveLab(id);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition ${
                      activeLab === id
                        ? 'bg-amber-400 text-slate-950 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {LAB_META[id].title} ({levelsByLab[id].length})
                  </button>
                ))}
              </div>

              <div className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>
                  تکمیل شده: {completedCountForLab(activeLab)} از {levelsByLab[activeLab].length} مرحله
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3">
              {levelsByLab[activeLab].map((lvl) => {
                const isDone = Boolean(progress.completedIds[lvl.id]);
                const isCurrent = lvl.id === activeLevelId;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleOpenLabPlay(activeLab, lvl.id)}
                    className={`group relative rounded-2xl p-3 border-2 flex flex-col items-center justify-between gap-1.5 text-center transition transform hover:-translate-y-1 ${
                      isDone
                        ? 'bg-emerald-950/75 border-emerald-400/70 shadow-lg'
                        : isCurrent
                        ? 'bg-amber-400/25 border-amber-300 ring-2 ring-amber-300/50'
                        : 'bg-slate-900/85 hover:bg-slate-800 border-white/15'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">
                      فصل {lvl.chapter}
                    </span>
                    <span className="text-2xl font-black text-white">{lvl.number}</span>
                    <span className="text-[11px] font-bold text-slate-200 line-clamp-1">
                      {lvl.title}
                    </span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            isDone
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= ACTIVE EXPERIMENT PLAYGROUND ================= */}
        {view === 'play' && activeLevel && (
          <section className="space-y-4">
            {/* Level Header & Live Talking Mascot Card */}
            <div className="bg-slate-900/92 border-2 border-white/15 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl">
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                {/* Animated Talking Scientist Avatar */}
                <button
                  type="button"
                  onClick={() => {
                    if (progress.completedIds[activeLevel.id]) {
                      const winStory = getWinExplanationForLevel(activeLevel);
                      soundEngine.speakPersian(winStory.fullText, winStory.clipKey);
                    } else {
                      soundEngine.speakClipKey(getStartClipForLevel(activeLevel));
                    }
                  }}
                  className={`shrink-0 relative w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex flex-col items-center justify-center shadow-lg border-b-4 border-amber-600 transition transform hover:scale-105 ${
                    isSpeakingNow ? 'ring-4 ring-emerald-400 animate-pulse' : ''
                  }`}
                  title="پخش راهنمای صوتی مرحله"
                >
                  <Volume2 className="w-6 h-6" />
                  <span className="text-[9px] font-black mt-0.5">راهنما</span>
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[11px] font-black text-amber-300">
                      مرحله {activeLevel.number} از {levelsByLab[activeLevel.lab].length} — {activeLevel.chapterTitle}
                    </span>
                    {progress.completedIds[activeLevel.id] && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[11px] font-black text-emerald-300">
                        تکمیل شده ⭐⭐⭐
                      </span>
                    )}
                    {isSpeakingNow && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black animate-pulse">
                        🎙️ گوینده در حال توضیح دادن...
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5">
                    {activeLevel.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-200 font-bold">
                    {activeLevel.kidPrompt}
                  </p>
                </div>
              </div>

              {/* Prev / Next Level Quick Switcher */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={handlePrevLevel}
                  disabled={activeLevel.number <= 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-white/15 text-xs font-bold transition"
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/50 text-emerald-200 text-xs font-black transition"
                >
                  مرحله بعد
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Lab Interactive Engine */}
            {activeLevel.lab === 'electric' && (
              <ElectricLab
                level={activeLevel as ElectricLevel}
                onComplete={handleLevelComplete}
                onNextLevel={handleNextLevel}
              />
            )}
            {activeLevel.lab === 'chemistry' && (
              <ChemistryLab
                level={activeLevel as ChemistryLevel}
                onComplete={handleLevelComplete}
                onNextLevel={handleNextLevel}
              />
            )}
            {activeLevel.lab === 'physics' && (
              <PhysicsLab
                level={activeLevel as PhysicsLevel}
                onComplete={handleLevelComplete}
                onNextLevel={handleNextLevel}
              />
            )}
          </section>
        )}
      </main>

      {/* Footer Signature */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/75 py-3 px-6 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-3">
        <span>
          🔬 دانشمند کوچولو (نسخه ۲.۰ اولترا پرو) — طراحی و برنامه‌نویسی توسط{' '}
          <button
            type="button"
            onClick={() => setCreatorModalOpen(true)}
            className="text-amber-300 hover:text-amber-200 font-black underline underline-offset-4"
          >
            {progress.creatorName || 'مهندس سعید سالاری'}
          </button>
        </span>
      </footer>

      {/* Dedicated Developer / Creator Showcase Modal */}
      <CreatorShowcaseModal
        isOpen={creatorModalOpen}
        onClose={() => setCreatorModalOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
      />

      {/* Parent & Online Level Update Modal */}
      <UpdateAndParentModal
        isOpen={parentModalOpen}
        onClose={() => setParentModalOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
        customLevels={customLevels}
        onAddLevels={handleAddLevels}
        allLevels={allLevels}
        onJumpToLevel={(lab, lvlId) => handleOpenLabPlay(lab, lvlId)}
      />
    </div>
  );
}
export default App;

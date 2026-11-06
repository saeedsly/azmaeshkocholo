import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AcademyLevel, AcademyOptionItem } from '../../types/game';
import { soundEngine } from '../../utils/soundEngine';
import { getStartClipForLevel } from '../../utils/kidExplanations';
import { VictoryStoryBanner } from '../VictoryStoryBanner';
import { toFaNum } from '../../data/mathLevels';
import { RotateCcw, Volume2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface AcademyPlaygroundProps {
  level: AcademyLevel;
  onComplete: () => void;
  onNextLevel: () => void;
}

const XYLOPHONE_BARS = [
  { idx: 0, noteFa: 'دو', en: 'C', color: '#ef4444', heightClass: 'h-48' },
  { idx: 1, noteFa: 'رِ', en: 'D', color: '#f97316', heightClass: 'h-44' },
  { idx: 2, noteFa: 'می', en: 'E', color: '#facc15', heightClass: 'h-40' },
  { idx: 3, noteFa: 'فا', en: 'F', color: '#22c55e', heightClass: 'h-36' },
  { idx: 4, noteFa: 'سُل', en: 'G', color: '#06b6d4', heightClass: 'h-32' },
  { idx: 5, noteFa: 'لا', en: 'A', color: '#3b82f6', heightClass: 'h-28' },
  { idx: 6, noteFa: 'سی', en: 'B', color: '#a855f7', heightClass: 'h-24' },
];

export const AcademyPlayground: React.FC<AcademyPlaygroundProps> = ({
  level,
  onComplete,
  onNextLevel,
}) => {
  const [completedOnce, setCompletedOnce] = useState(false);
  const [wrongOptionId, setWrongOptionId] = useState<string | null>(null);
  const [pickedCorrectId, setPickedCorrectId] = useState<string | null>(null);

  // 1. Counting basket state
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);

  // 4. Word builder state
  const [builtCount, setBuiltCount] = useState(0);
  const [usedTileIds, setUsedTileIds] = useState<string[]>([]);

  // 5. Robot coding state
  const [robotPos, setRobotPos] = useState<[number, number]>(level.robotStart || [0, 0]);
  const [robotTrail, setRobotTrail] = useState<string[]>([]);
  const [bumpFlash, setBumpFlash] = useState(false);

  // 6. Memory match state
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [peekAll, setPeekAll] = useState(true);

  // 7. Color mix studio state
  const [pouredPaintIds, setPouredPaintIds] = useState<string[]>([]);

  // 8. Xylophone melody state
  const [melodyStep, setMelodyStep] = useState(0);

  // 9. Sorting bins state
  const [sortedItemIds, setSortedItemIds] = useState<string[]>([]);

  // Reset on level change
  useEffect(() => {
    setCompletedOnce(false);
    setWrongOptionId(null);
    setPickedCorrectId(null);
    setPickedIndices([]);
    setBuiltCount(0);
    setUsedTileIds([]);
    setRobotPos(level.robotStart || [0, 0]);
    setRobotTrail([]);
    setBumpFlash(false);
    setFlippedIds([]);
    setMatchedPairIds([]);
    setPouredPaintIds([]);
    setMelodyStep(0);
    setSortedItemIds([]);

    if (level.gameKind === 'memory_match') {
      setPeekAll(true);
      const t = setTimeout(() => setPeekAll(false), 1500);
      return () => clearTimeout(t);
    } else {
      setPeekAll(false);
    }
  }, [level]);

  const triggerWin = () => {
    if (completedOnce) return;
    setCompletedOnce(true);
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 115,
      spread: 90,
      origin: { y: 0.58 },
    });
    onComplete();
  };

  // Scrambled tiles for Word Builder
  const wordTiles = useMemo(() => {
    if (level.gameKind !== 'word_builder' || !level.targetLetters) return [];
    const all = [
      ...level.targetLetters.map((ch, i) => ({ id: `t-${i}`, ch })),
      ...(level.extraLetters || []).map((ch, i) => ({ id: `x-${i}`, ch })),
    ];
    // Deterministic shuffle per level id
    return all.sort((a, b) => {
      const ha = (a.id.charCodeAt(0) * 17 + a.ch.charCodeAt(0) + level.number * 7) % 13;
      const hb = (b.id.charCodeAt(0) * 17 + b.ch.charCodeAt(0) + level.number * 7) % 13;
      return ha - hb;
    });
  }, [level]);

  // Shuffled cards for Memory Match
  const memoryDeck = useMemo(() => {
    if (level.gameKind !== 'memory_match' || !level.memoryPairs) return [];
    const cards: { cardId: string; pairId: string; text: string; speakFa?: string }[] = [];
    level.memoryPairs.forEach((p) => {
      cards.push({ cardId: `${p.pairId}-A`, pairId: p.pairId, text: p.cardA, speakFa: p.speakFa });
      cards.push({ cardId: `${p.pairId}-B`, pairId: p.pairId, text: p.cardB, speakFa: p.speakFa });
    });
    return cards.sort((a, b) => {
      const va = (a.cardId.charCodeAt(2) * 11 + a.cardId.charCodeAt(4) * 5 + level.number) % 9;
      const vb = (b.cardId.charCodeAt(2) * 11 + b.cardId.charCodeAt(4) * 5 + level.number) % 9;
      return va - vb;
    });
  }, [level]);

  // Compute recommended next robot direction for golden helping hand!
  const recommendedRobotDir = useMemo<'up' | 'down' | 'left' | 'right' | null>(() => {
    if (level.gameKind !== 'robot_coding' || !level.goalPos) return null;
    const size = level.gridSize || 4;
    const obsSet = new Set((level.obstacles || []).map(([r, c]) => `${r},${c}`));
    const [gr, gc] = level.goalPos;
    const [sr, sc] = robotPos;
    if (sr === gr && sc === gc) return null;

    // Quick BFS shortest path so the golden hand always knows the true safe move!
    const dirs: { d: 'up' | 'down' | 'left' | 'right'; dr: number; dc: number }[] = [
      { d: 'right', dr: 0, dc: 1 },
      { d: 'left', dr: 0, dc: -1 },
      { d: 'down', dr: 1, dc: 0 },
      { d: 'up', dr: -1, dc: 0 },
    ];
    const queue: { r: number; c: number; firstMove: 'up' | 'down' | 'left' | 'right' | null }[] = [
      { r: sr, c: sc, firstMove: null },
    ];
    const visited = new Set<string>([`${sr},${sc}`]);
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.r === gr && curr.c === gc) return curr.firstMove;
      for (const mv of dirs) {
        const nr = curr.r + mv.dr;
        const nc = curr.c + mv.dc;
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !obsSet.has(key) && !visited.has(key)) {
          visited.add(key);
          queue.push({ r: nr, c: nc, firstMove: curr.firstMove || mv.d });
        }
      }
    }
    return null;
  }, [level, robotPos]);

  const handleOptionSelect = (opt: AcademyOptionItem) => {
    if (completedOnce) return;
    if (opt.isCorrect) {
      soundEngine.playSnap();
      setPickedCorrectId(opt.id);
      if (level.lab === 'english') {
        soundEngine.speakEnglish(opt.label, opt.voiceClipKey || level.englishVoiceClipKey);
        setTimeout(() => triggerWin(), 650);
      } else {
        triggerWin();
      }
    } else {
      soundEngine.playShortCircuitWarning();
      setWrongOptionId(opt.id);
      soundEngine.speakClipKey('acad_wrong_gentle');
      setTimeout(() => setWrongOptionId(null), 650);
    }
  };

  const handleCountTap = (idx: number) => {
    if (completedOnce || pickedIndices.includes(idx)) return;
    const target = level.targetCount || 1;
    const nextList = [...pickedIndices, idx];
    const countNow = nextList.length;
    setPickedIndices(nextList);
    soundEngine.playMusicalGlass((countNow - 1) % 7);

    if (countNow >= target) {
      setTimeout(() => triggerWin(), 320);
    } else if (level.lab === 'english') {
      const enWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
      soundEngine.speakEnglish(enWords[countNow - 1] || String(countNow));
    } else if (countNow <= 10) {
      soundEngine.speakClipKey(`num_fa_${countNow}`);
    }
  };

  const handleWordTileTap = (tile: { id: string; ch: string }) => {
    if (completedOnce || usedTileIds.includes(tile.id) || !level.targetLetters) return;
    const expectedChar = level.targetLetters[builtCount];
    if (tile.ch === expectedChar) {
      soundEngine.playMusicalGlass(builtCount % 7);
      const nextUsed = [...usedTileIds, tile.id];
      const nextBuilt = builtCount + 1;
      setUsedTileIds(nextUsed);
      setBuiltCount(nextBuilt);
      if (nextBuilt >= level.targetLetters.length) {
        if (level.lab === 'english' && level.heroDisplay) {
          soundEngine.speakEnglish(level.heroDisplay, level.englishVoiceClipKey);
          setTimeout(() => triggerWin(), 650);
        } else {
          setTimeout(() => triggerWin(), 320);
        }
      }
    } else {
      soundEngine.playShortCircuitWarning();
      setWrongOptionId(tile.id);
      soundEngine.speakClipKey('acad_wrong_gentle');
      setTimeout(() => setWrongOptionId(null), 550);
    }
  };

  const handleMoveRobot = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (completedOnce) return;
    const size = level.gridSize || 4;
    const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const nr = robotPos[0] + dr;
    const nc = robotPos[1] + dc;

    const hitObstacle = (level.obstacles || []).some(([or, oc]) => or === nr && oc === nc);
    if (nr < 0 || nr >= size || nc < 0 || nc >= size || hitObstacle) {
      soundEngine.playShortCircuitWarning();
      setBumpFlash(true);
      soundEngine.speakClipKey('acad_robot_bump');
      setTimeout(() => setBumpFlash(false), 450);
      return;
    }

    soundEngine.playPop(620);
    setRobotTrail((prev) => [...prev, `${robotPos[0]},${robotPos[1]}`]);
    setRobotPos([nr, nc]);

    if (level.goalPos && nr === level.goalPos[0] && nc === level.goalPos[1]) {
      setTimeout(() => triggerWin(), 280);
    }
  };

  const handleFlipMemoryCard = (cardId: string, pairId: string, speakFa?: string) => {
    if (completedOnce || peekAll) return;
    if (matchedPairIds.includes(pairId) || flippedIds.includes(cardId) || flippedIds.length >= 2) {
      return;
    }
    soundEngine.playPop(580);
    const nextFlipped = [...flippedIds, cardId];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      const c1 = memoryDeck.find((c) => c.cardId === nextFlipped[0]);
      const c2 = memoryDeck.find((c) => c.cardId === nextFlipped[1]);
      if (c1 && c2 && c1.pairId === c2.pairId) {
        soundEngine.playMagnetClink(true);
        const nextMatched = [...matchedPairIds, c1.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIds([]);
        if (nextMatched.length >= (level.memoryPairs?.length || 3)) {
          setTimeout(() => triggerWin(), 350);
        } else if (speakFa) {
          soundEngine.speakPersian(`آفرین! ${speakFa}!`);
        }
      } else {
        setTimeout(() => {
          soundEngine.playPop(340);
          setFlippedIds([]);
        }, 780);
      }
    }
  };

  const handlePourPaint = (paint: { id: string; nameFa: string; colorHex: string; isRequired: boolean }) => {
    if (completedOnce || pouredPaintIds.includes(paint.id)) return;
    if (!paint.isRequired) {
      soundEngine.playShortCircuitWarning();
      soundEngine.speakClipKey('acad_wrong_gentle');
      return;
    }
    soundEngine.playPourLiquid();
    const next = [...pouredPaintIds, paint.id];
    setPouredPaintIds(next);
    const reqTotal = (level.paintChoices || []).filter((p) => p.isRequired).length;
    if (next.length >= reqTotal) {
      setTimeout(() => triggerWin(), 520);
    } else {
      soundEngine.speakPersian(`رنگ ${paint.nameFa} اضافه شد! حالا رنگ دوم رو بریز!`);
    }
  };

  const handleTapXylophone = (barIdx: number) => {
    soundEngine.playMusicalGlass(barIdx);
    if (completedOnce || !level.melodyNotes) return;
    const expected = level.melodyNotes[melodyStep];
    if (barIdx === expected) {
      const nextStep = melodyStep + 1;
      setMelodyStep(nextStep);
      if (nextStep >= level.melodyNotes.length) {
        setTimeout(() => triggerWin(), 420);
      }
    }
  };

  const currentSortItem = useMemo(() => {
    if (level.gameKind !== 'sorting_bins' || !level.sortItems) return null;
    return level.sortItems.find((it) => !sortedItemIds.includes(it.id)) || null;
  }, [level, sortedItemIds]);

  const handleSortIntoBin = (bin: 'A' | 'B') => {
    if (completedOnce || !currentSortItem || !level.sortItems) return;
    if (currentSortItem.targetBin === bin) {
      soundEngine.playSnap();
      const next = [...sortedItemIds, currentSortItem.id];
      setSortedItemIds(next);
      if (next.length >= level.sortItems.length) {
        setTimeout(() => triggerWin(), 300);
      } else {
        soundEngine.speakPersian(`آفرین! ${currentSortItem.nameFa} رفت توی سبد درست!`);
      }
    } else {
      soundEngine.playShortCircuitWarning();
      soundEngine.speakClipKey('acad_wrong_gentle');
    }
  };

  const resetLevel = () => {
    soundEngine.playPop(420);
    setCompletedOnce(false);
    setPickedCorrectId(null);
    setPickedIndices([]);
    setBuiltCount(0);
    setUsedTileIds([]);
    setRobotPos(level.robotStart || [0, 0]);
    setRobotTrail([]);
    setFlippedIds([]);
    setMatchedPairIds([]);
    setPouredPaintIds([]);
    setMelodyStep(0);
    setSortedItemIds([]);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Top Interactive Voice Instruction Coach Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/92 border border-white/15 rounded-2xl px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={() => soundEngine.speakPersian(level.kidPrompt, getStartClipForLevel(level))}
          className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-200 hover:text-white font-black text-right"
        >
          <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950 shadow">
            <Volume2 className="w-4 h-4" />
          </span>
          <span>🔊 بگو چیکار کنم: {level.kidPrompt}</span>
        </button>

        <div className="flex items-center gap-2">
          {level.lab === 'english' && level.heroDisplay && (
            <button
              type="button"
              onClick={() =>
                soundEngine.speakEnglish(
                  level.heroDisplay!.replace('= ', ''),
                  level.englishVoiceClipKey
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-black shadow transition"
            >
              <Volume2 className="w-4 h-4" />
              تلفظ انگلیسی 🇬🇧
            </button>
          )}
          <button
            type="button"
            onClick={resetLevel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" />
            شروع دوباره
          </button>
        </div>
      </div>

      {/* Main Playful Interactive Stage */}
      <div className="relative w-full min-h-[430px] rounded-[2.2rem] border-2 border-amber-400/45 bg-gradient-to-b from-indigo-950/95 via-slate-900/95 to-purple-950/90 shadow-2xl overflow-hidden select-none p-5 sm:p-7 flex flex-col items-center justify-between gap-5">
        {/* ================= 1. COUNTING BASKET ================= */}
        {level.gameKind === 'counting_basket' && (
          <>
            <div className="flex flex-col items-center gap-1 text-center">
              {level.equationDisplay && (
                <div className="px-5 py-1.5 rounded-2xl bg-amber-400/20 border border-amber-300/50 text-amber-200 font-black text-lg sm:text-2xl mb-1">
                  {level.equationDisplay}
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="px-6 py-2.5 rounded-3xl bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 text-3xl sm:text-5xl font-black shadow-xl border-2 border-white">
                  {level.heroDisplay}
                </span>
                <div className="text-right">
                  <div className="text-sm sm:text-lg font-black text-white">{level.heroSubLabel}</div>
                  <div className="text-xs text-emerald-300 font-bold">
                    چیده شده در سبد: {toFaNum(pickedIndices.length)} از {toFaNum(level.targetCount || 1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tappable Toys / Fruits Grid */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-2xl my-auto">
              {Array.from({ length: level.totalSpawnCount || (level.targetCount || 3) + 2 }).map((_, idx) => {
                const picked = pickedIndices.includes(idx);
                const isNextHint =
                  !completedOnce &&
                  !picked &&
                  pickedIndices.length < (level.targetCount || 1) &&
                  idx === pickedIndices.length;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={picked}
                    onClick={() => handleCountTap(idx)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl border-2 border-b-4 text-4xl sm:text-5xl flex items-center justify-center transition-all duration-300 ${
                      picked
                        ? 'opacity-20 scale-75 bg-slate-800 border-white/10'
                        : 'bg-slate-800/90 hover:bg-indigo-800/80 border-amber-300/80 shadow-xl hover:-translate-y-1.5 active:scale-95'
                    }`}
                  >
                    {isNextHint && (
                      <span className="absolute -top-5 -right-2 text-2xl animate-bounce pointer-events-none">
                        👆
                      </span>
                    )}
                    <span>{level.countEmoji || '🍎'}</span>
                  </button>
                );
              })}
            </div>

            {/* Woven Harvest Basket */}
            <div className="w-full max-w-xl rounded-3xl border-2 border-amber-500/70 bg-amber-950/80 px-5 py-3 flex flex-wrap items-center justify-center gap-2 min-h-[76px] shadow-inner">
              <span className="text-3xl mr-1">🧺</span>
              {pickedIndices.length === 0 ? (
                <span className="text-xs sm:text-sm font-bold text-amber-200/80">
                  روی شکل‌های بالا بزن تا با صدای بلند بشماریم و بیان توی سبد!
                </span>
              ) : (
                pickedIndices.map((_, i) => (
                  <span key={i} className="text-3xl animate-bounce">
                    {level.countEmoji}
                  </span>
                ))
              )}
            </div>
          </>
        )}

        {/* ================= 2. CHOICE DISCOVERY (FLASHCARDS & QUIZZES) ================= */}
        {level.gameKind === 'choice_discovery' && (
          <>
            <div
              onClick={() => {
                if (level.lab === 'english' && level.heroDisplay) {
                  soundEngine.speakEnglish(level.heroDisplay, level.englishVoiceClipKey);
                } else {
                  soundEngine.speakPersian(level.kidPrompt, getStartClipForLevel(level));
                }
              }}
              style={
                level.heroColorHex
                  ? { borderColor: level.heroColorHex, boxShadow: `0 0 35px ${level.heroColorHex}44` }
                  : undefined
              }
              className="cursor-pointer group relative rounded-[2rem] border-2 border-amber-300/70 bg-slate-950/85 px-8 py-5 flex flex-col items-center text-center gap-1.5 shadow-2xl transition hover:scale-[1.02] max-w-2xl"
            >
              <div className="flex items-center gap-3">
                {level.heroEmoji && <span className="text-5xl sm:text-6xl drop-shadow">{level.heroEmoji}</span>}
                <span className="text-2xl sm:text-5xl font-black text-amber-300 leading-snug">
                  {level.heroDisplay}
                </span>
              </div>
              {level.heroSubLabel && (
                <span className="text-xs sm:text-base font-bold text-cyan-200 mt-1">
                  {level.heroSubLabel}
                </span>
              )}
              {level.lab === 'english' && (
                <span className="mt-1 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-sky-500/25 text-sky-200 text-[11px] font-black">
                  <Volume2 className="w-3.5 h-3.5" /> برای شنیدن تلفظ انگلیسی اینجا بزن!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl my-auto">
              {(level.options || []).map((opt) => {
                const isWrong = wrongOptionId === opt.id;
                const isPicked = pickedCorrectId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleOptionSelect(opt)}
                    className={`relative rounded-3xl p-5 border-2 border-b-8 flex flex-col items-center justify-center gap-2 transition-all transform ${
                      isPicked
                        ? 'bg-emerald-500/35 border-emerald-400 scale-105 shadow-[0_0_35px_rgba(52,211,153,0.6)]'
                        : isWrong
                        ? 'bg-rose-900/50 border-rose-400 scale-95'
                        : 'bg-slate-800/90 hover:bg-slate-700/95 border-amber-300/60 hover:border-amber-300 hover:-translate-y-1.5 shadow-xl'
                    }`}
                  >
                    {opt.emoji && <span className="text-5xl sm:text-6xl drop-shadow-md">{opt.emoji}</span>}
                    <span className="text-lg sm:text-2xl font-black text-white text-center">
                      {opt.label}
                    </span>
                    {opt.subLabel && (
                      <span className="text-xs font-bold text-amber-300 text-center">
                        {opt.subLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================= 3. SEQUENCE TRAIN ================= */}
        {level.gameKind === 'sequence_train' && (
          <>
            <div className="text-center text-sm sm:text-base font-black text-amber-300">
              🚂 بوق بوووق! واگن علامت سوال (؟) رو پیدا کن تا قطار حرکت کنه!
            </div>

            {/* Railway Train Cars */}
            <div
              dir={level.lab === 'english' ? 'ltr' : 'rtl'}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-auto bg-slate-950/75 px-5 py-6 rounded-3xl border-b-8 border-amber-600/80 shadow-2xl"
            >
              <span className="text-5xl sm:text-6xl mx-1">🚂</span>
              {(level.wagons || []).map((wText, idx) => {
                const isMissing = idx === level.missingWagonIndex && !completedOnce;
                return (
                  <div
                    key={idx}
                    className={`min-w-[78px] sm:min-w-[96px] h-22 sm:h-24 px-3 rounded-2xl border-3 flex flex-col items-center justify-center font-black text-xl sm:text-3xl shadow-lg ${
                      isMissing
                        ? 'bg-amber-400/25 border-dashed border-amber-300 text-amber-300 animate-pulse'
                        : 'bg-gradient-to-b from-cyan-500 to-blue-700 border-white text-white'
                    }`}
                  >
                    <span>{isMissing ? '❓' : wText}</span>
                    <div className="flex gap-4 -mb-6 mt-2">
                      <span className="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-400" />
                      <span className="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Train Answer Choices */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {(level.options || []).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt)}
                  className={`min-w-[110px] px-6 py-4 rounded-3xl border-2 border-b-6 font-black text-2xl sm:text-3xl transition transform hover:-translate-y-1 shadow-xl ${
                    wrongOptionId === opt.id
                      ? 'bg-rose-800 border-rose-400'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ================= 4. WORD BUILDER (PERSIAN RTL & ENGLISH LTR) ================= */}
        {level.gameKind === 'word_builder' && (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-6xl sm:text-7xl drop-shadow-xl">{level.heroEmoji}</span>
              <span className="text-base sm:text-xl font-black text-amber-300">
                {level.heroSubLabel}
              </span>
            </div>

            {/* Letter Slots */}
            <div
              dir={level.rtlWord ? 'rtl' : 'ltr'}
              className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 my-auto"
            >
              {(level.targetLetters || []).map((ch, idx) => {
                const filled = idx < builtCount;
                const isActiveSlot = idx === builtCount;
                return (
                  <div
                    key={idx}
                    className={`w-16 h-18 sm:w-20 sm:h-22 rounded-2xl border-3 flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                      filled
                        ? 'bg-emerald-500 text-slate-950 border-white shadow-[0_0_25px_rgba(52,211,153,0.6)] scale-105'
                        : isActiveSlot
                        ? 'bg-amber-400/20 border-dashed border-amber-300 text-amber-300 animate-pulse'
                        : 'bg-slate-950/75 border-white/20 text-slate-600'
                    }`}
                  >
                    {filled ? ch : '؟'}
                  </div>
                );
              })}
            </div>

            {/* Tappable Letter Blocks */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {wordTiles.map((tile) => {
                const used = usedTileIds.includes(tile.id);
                const nextNeededChar = level.targetLetters?.[builtCount];
                const isHintTile = !used && !completedOnce && tile.ch === nextNeededChar;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    disabled={used}
                    onClick={() => handleWordTileTap(tile)}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-b-6 text-2xl sm:text-3xl font-black transition transform ${
                      used
                        ? 'opacity-20 scale-75 bg-slate-800 border-white/10'
                        : wrongOptionId === tile.id
                        ? 'bg-rose-700 text-white border-rose-400'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-600 shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {isHintTile && (
                      <span className="absolute -top-5 -right-2 text-2xl animate-bounce pointer-events-none">
                        👆
                      </span>
                    )}
                    {tile.ch}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================= 5. VISUAL ROBOT CODING ================= */}
        {level.gameKind === 'robot_coding' && (
          <div className="w-full flex flex-col lg:flex-row items-center justify-around gap-6 my-auto">
            {/* 4x4 Space Grid */}
            <div
              dir="ltr"
              className={`grid grid-cols-4 gap-2 p-3 rounded-3xl bg-slate-950/90 border-2 shadow-2xl ${
                bumpFlash ? 'border-rose-500 animate-bounce' : 'border-cyan-400/50'
              }`}
            >
              {Array.from({ length: (level.gridSize || 4) * (level.gridSize || 4) }).map((_, idx) => {
                const size = level.gridSize || 4;
                const r = Math.floor(idx / size);
                const c = idx % size;
                const isRobot = robotPos[0] === r && robotPos[1] === c;
                const isGoal = level.goalPos?.[0] === r && level.goalPos?.[1] === c;
                const isObs = (level.obstacles || []).some(([or, oc]) => or === r && oc === c);
                const isTrail = robotTrail.includes(`${r},${c}`);

                return (
                  <div
                    key={idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                      isRobot
                        ? 'bg-cyan-500/35 border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.65)] scale-105'
                        : isGoal
                        ? 'bg-amber-400/25 border-amber-300 animate-pulse'
                        : isObs
                        ? 'bg-slate-800 border-rose-500/40'
                        : isTrail
                        ? 'bg-emerald-950/50 border-emerald-400/30'
                        : 'bg-slate-900/90 border-white/10'
                    }`}
                  >
                    {isRobot ? '🤖' : isGoal ? level.goalEmoji || '⭐' : isObs ? '🪨' : isTrail ? '✨' : ''}
                  </div>
                );
              })}
            </div>

            {/* Kid-Friendly Directional Gamepad */}
            <div dir="ltr" className="flex flex-col items-center gap-2.5">
              <div className="text-xs sm:text-sm font-black text-cyan-200 mb-1" dir="rtl">
                🎮 دکمه‌های فرمان برنامه‌نویسی ربات:
              </div>
              <button
                type="button"
                onClick={() => handleMoveRobot('up')}
                className="relative w-24 h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-b-4 border-amber-600 flex flex-col items-center justify-center shadow-xl active:scale-95"
              >
                {recommendedRobotDir === 'up' && !completedOnce && (
                  <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                )}
                <ArrowUp className="w-6 h-6" />
                <span className="text-[11px]">بالا</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleMoveRobot('left')}
                  className="relative w-24 h-16 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black border-b-4 border-cyan-600 flex flex-col items-center justify-center shadow-xl active:scale-95"
                >
                  {recommendedRobotDir === 'left' && !completedOnce && (
                    <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                  )}
                  <ArrowLeft className="w-6 h-6" />
                  <span className="text-[11px]">چپ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveRobot('down')}
                  className="relative w-24 h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-b-4 border-amber-600 flex flex-col items-center justify-center shadow-xl active:scale-95"
                >
                  {recommendedRobotDir === 'down' && !completedOnce && (
                    <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                  )}
                  <ArrowDown className="w-6 h-6" />
                  <span className="text-[11px]">پایین</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveRobot('right')}
                  className="relative w-24 h-16 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black border-b-4 border-cyan-600 flex flex-col items-center justify-center shadow-xl active:scale-95"
                >
                  {recommendedRobotDir === 'right' && !completedOnce && (
                    <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                  )}
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-[11px]">راست</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. MEMORY MATCH CARDS ================= */}
        {level.gameKind === 'memory_match' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl my-auto">
            {memoryDeck.map((card) => {
              const isMatched = matchedPairIds.includes(card.pairId);
              const isOpen = peekAll || isMatched || flippedIds.includes(card.cardId);
              return (
                <button
                  key={card.cardId}
                  type="button"
                  onClick={() => handleFlipMemoryCard(card.cardId, card.pairId, card.speakFa)}
                  className={`h-28 sm:h-32 rounded-3xl border-2 border-b-6 font-black text-xl sm:text-2xl flex items-center justify-center p-3 transition-all duration-300 ${
                    isMatched
                      ? 'bg-emerald-500/35 border-emerald-400 text-white shadow-[0_0_25px_rgba(52,211,153,0.45)]'
                      : isOpen
                      ? 'bg-amber-400 text-slate-950 border-white scale-105 shadow-xl'
                      : 'bg-gradient-to-br from-indigo-700 to-purple-800 hover:from-indigo-600 hover:to-purple-700 border-amber-300/60 text-3xl shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {isOpen ? card.text : '🌟'}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= 7. COLOR MIXING STUDIO ================= */}
        {level.gameKind === 'color_mix_studio' && (
          <>
            <div className="flex flex-col items-center gap-2 my-auto">
              <div
                style={{
                  backgroundColor:
                    pouredPaintIds.length >= 2
                      ? level.mixedResultColorHex
                      : pouredPaintIds.length === 1
                      ? level.paintChoices?.find((p) => p.id === pouredPaintIds[0])?.colorHex
                      : '#1e293b',
                }}
                className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-colors duration-700"
              >
                <span className="text-6xl drop-shadow-lg">
                  {pouredPaintIds.length >= 2 ? level.paintTargetEmoji || '🎨' : '🎨'}
                </span>
                <span className="mt-1 px-3 py-0.5 rounded-full bg-slate-950/75 text-xs font-black text-white">
                  {pouredPaintIds.length >= 2
                    ? `رنگ ${level.mixedResultNameFa}! ✨`
                    : `${pouredPaintIds.length} از ۲ رنگ ریخته شد`}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {(level.paintChoices || []).map((paint) => {
                const used = pouredPaintIds.includes(paint.id);
                return (
                  <button
                    key={paint.id}
                    type="button"
                    disabled={used}
                    onClick={() => handlePourPaint(paint)}
                    className={`relative flex items-center gap-3 px-6 py-4 rounded-3xl border-2 border-b-6 font-black text-base transition transform ${
                      used
                        ? 'opacity-30 scale-90 bg-slate-800 border-white/15'
                        : 'bg-slate-900 hover:bg-slate-800 border-white/40 hover:-translate-y-1 shadow-xl'
                    }`}
                  >
                    {paint.isRequired && !used && !completedOnce && (
                      <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                    )}
                    <span
                      style={{ backgroundColor: paint.colorHex }}
                      className="w-9 h-9 rounded-full border-2 border-white shadow"
                    />
                    <span className="text-white">تیوپ رنگ {paint.nameFa}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================= 8. RAINBOW XYLOPHONE MUSIC ================= */}
        {level.gameKind === 'xylophone_melody' && (
          <>
            <div className="text-center space-y-1">
              <div className="text-base sm:text-xl font-black text-amber-300 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>{level.melodyTitleFa}</span>
              </div>
              <div className="text-xs font-bold text-cyan-200">
                نُت‌های نواخته شده: {toFaNum(melodyStep)} از {toFaNum(level.melodyNotes?.length || 4)}
              </div>
            </div>

            <div dir="ltr" className="flex items-center justify-center gap-2.5 sm:gap-4 my-auto">
              {XYLOPHONE_BARS.map((bar) => {
                const isNextNote = !completedOnce && level.melodyNotes?.[melodyStep] === bar.idx;
                return (
                  <button
                    key={bar.idx}
                    type="button"
                    onClick={() => handleTapXylophone(bar.idx)}
                    style={{ backgroundColor: bar.color }}
                    className={`relative w-11 sm:w-15 ${bar.heightClass} rounded-2xl border-2 border-white shadow-2xl flex flex-col items-center justify-between py-3 text-slate-950 font-black transition transform active:scale-90 hover:brightness-110 ${
                      isNextNote ? 'ring-4 ring-yellow-200 scale-105' : ''
                    }`}
                  >
                    {isNextNote && (
                      <span className="absolute -top-10 text-2xl sm:text-3xl animate-bounce pointer-events-none">
                        ⭐
                      </span>
                    )}
                    <span className="w-3 h-3 rounded-full bg-white/80" />
                    <span className="text-sm sm:text-base text-white drop-shadow">{bar.noteFa}</span>
                    <span className="w-3 h-3 rounded-full bg-white/80" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ================= 9. SORTING BINS ================= */}
        {level.gameKind === 'sorting_bins' && level.binA && level.binB && (
          <>
            {currentSortItem ? (
              <div className="flex flex-col items-center gap-2 bg-slate-950/90 border-2 border-amber-300 rounded-3xl px-8 py-4 shadow-2xl animate-pulse">
                <span className="text-6xl">{currentSortItem.emoji}</span>
                <span className="text-lg sm:text-2xl font-black text-white">
                  {currentSortItem.nameFa}
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  توی کدوم سبد پایین بندازیمش؟ ({toFaNum(sortedItemIds.length)} از {toFaNum(level.sortItems?.length || 4)})
                </span>
              </div>
            ) : (
              <div className="text-xl font-black text-emerald-300">✨ همه وسیله‌ها مرتب شدند!</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl my-auto">
              <button
                type="button"
                onClick={() => handleSortIntoBin('A')}
                style={{ borderColor: level.binA.colorHex }}
                className="relative rounded-3xl border-3 border-b-8 bg-slate-900/90 hover:bg-slate-800 p-6 flex flex-col items-center gap-2 shadow-2xl transition transform hover:-translate-y-1"
              >
                {currentSortItem?.targetBin === 'A' && !completedOnce && (
                  <span className="absolute -top-5 right-4 text-3xl animate-bounce">👆</span>
                )}
                <span className="text-5xl">{level.binA.emoji}</span>
                <span className="text-lg sm:text-xl font-black text-white">{level.binA.title}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSortIntoBin('B')}
                style={{ borderColor: level.binB.colorHex }}
                className="relative rounded-3xl border-3 border-b-8 bg-slate-900/90 hover:bg-slate-800 p-6 flex flex-col items-center gap-2 shadow-2xl transition transform hover:-translate-y-1"
              >
                {currentSortItem?.targetBin === 'B' && !completedOnce && (
                  <span className="absolute -top-5 right-4 text-3xl animate-bounce">👆</span>
                )}
                <span className="text-5xl">{level.binB.emoji}</span>
                <span className="text-lg sm:text-xl font-black text-white">{level.binB.title}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Celebratory Spoken Story Banner upon Win */}
      {completedOnce && <VictoryStoryBanner level={level} onNextLevel={onNextLevel} />}
    </div>
  );
};

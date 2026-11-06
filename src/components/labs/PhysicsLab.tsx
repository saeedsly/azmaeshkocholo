import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PhysicsLevel, PhysicsItemSpec } from '../../types/game';
import { soundEngine } from '../../utils/soundEngine';
import { VictoryStoryBanner } from '../VictoryStoryBanner';
import { getStartClipForLevel } from '../../utils/kidExplanations';
import { RotateCcw, Volume2 } from 'lucide-react';

interface PhysicsLabProps {
  level: PhysicsLevel;
  onComplete: () => void;
  onNextLevel: () => void;
}

export const PhysicsLab: React.FC<PhysicsLabProps> = ({
  level,
  onComplete,
  onNextLevel,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Magnet explore & poles
  const [magnetPos, setMagnetPos] = useState({ x: 50, y: 24 });
  const [draggingMagnet, setDraggingMagnet] = useState(false);
  const [testedIds, setTestedIds] = useState<string[]>([]);
  const [stuckIds, setStuckIds] = useState<string[]>([]);
  const [polesFlipped, setPolesFlipped] = useState(false);
  const [polesTested, setPolesTested] = useState(false);

  // Sink / float
  const [droppedWaterIds, setDroppedWaterIds] = useState<string[]>([]);
  const [saltAdded, setSaltAdded] = useState(false);

  // Static balloon
  const [balloonCharged, setBalloonCharged] = useState(false);
  const [staticStuckIds, setStaticStuckIds] = useState<string[]>([]);

  // Balance scale
  const [selectedScaleIds, setSelectedScaleIds] = useState<string[]>([]);

  // Ramp friction
  const [releasedRampIds, setReleasedRampIds] = useState<string[]>([]);

  // Light prism, wind, sound glasses, plant growth
  const [prismActive, setPrismActive] = useState(false);
  const [windPower, setWindPower] = useState(0);
  const [playedNotes, setPlayedNotes] = useState<number[]>([]);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  const [completedOnce, setCompletedOnce] = useState(false);

  useEffect(() => {
    setMagnetPos({ x: 50, y: 24 });
    setDraggingMagnet(false);
    setTestedIds([]);
    setStuckIds([]);
    setPolesFlipped(false);
    setPolesTested(false);
    setDroppedWaterIds([]);
    setSaltAdded(false);
    setBalloonCharged(false);
    setStaticStuckIds([]);
    setSelectedScaleIds([]);
    setReleasedRampIds([]);
    setPrismActive(false);
    setWindPower(0);
    setPlayedNotes([]);
    setCompletedStepIds([]);
    setCompletedOnce(false);
  }, [level]);

  const triggerWin = () => {
    if (completedOnce) return;
    setCompletedOnce(true);
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 115,
      spread: 88,
      origin: { y: 0.58 },
    });
    onComplete();
  };

  useEffect(() => {
    if (completedOnce) return;

    if (level.mode === 'magnet_explore') {
      const magneticItems = level.items.filter((i) => i.isMagnetic);
      if (
        magneticItems.length > 0 &&
        magneticItems.every((i) => stuckIds.includes(i.id)) &&
        testedIds.length >= Math.max(1, level.items.length - 1)
      ) {
        triggerWin();
      }
    } else if (level.mode === 'magnet_poles') {
      if (polesTested) {
        const t = setTimeout(() => triggerWin(), 650);
        return () => clearTimeout(t);
      }
    } else if (level.mode === 'sink_float') {
      const allDropped =
        level.items.length > 0 &&
        level.items.every((i) => droppedWaterIds.includes(i.id));
      const saltOk = !level.waterIsSalty || saltAdded;
      if (allDropped && saltOk) {
        triggerWin();
      }
    } else if (level.mode === 'static_balloon') {
      const attractable = level.items.filter((i) => i.attractedByStatic);
      if (
        balloonCharged &&
        attractable.length > 0 &&
        attractable.every((i) => staticStuckIds.includes(i.id))
      ) {
        triggerWin();
      }
    } else if (level.mode === 'balance_scale') {
      const target = level.targetWeight || 4;
      const sum = level.items
        .filter((i) => selectedScaleIds.includes(i.id))
        .reduce((acc, item) => acc + (item.weight || 1), 0);
      if (sum === target) {
        triggerWin();
      }
    } else if (level.mode === 'ramp_friction') {
      if (releasedRampIds.length >= Math.max(1, level.items.length)) {
        const t = setTimeout(() => triggerWin(), 1050);
        return () => clearTimeout(t);
      }
    } else if (level.mode === 'light_prism') {
      if (prismActive) {
        const t = setTimeout(() => triggerWin(), 850);
        return () => clearTimeout(t);
      }
    } else if (level.mode === 'wind_energy') {
      if (windPower >= 2) {
        const t = setTimeout(() => triggerWin(), 750);
        return () => clearTimeout(t);
      }
    } else if (level.mode === 'sound_glasses') {
      if (playedNotes.length >= Math.max(4, level.targetGoalCount || 4)) {
        triggerWin();
      }
    } else if (level.mode === 'plant_growth') {
      const req = level.items.filter((i) => i.isRequiredStep !== false);
      if (req.length > 0 && req.every((i) => completedStepIds.includes(i.id))) {
        const t = setTimeout(() => triggerWin(), 750);
        return () => clearTimeout(t);
      }
    }
  }, [
    level,
    stuckIds,
    testedIds,
    polesTested,
    droppedWaterIds,
    saltAdded,
    balloonCharged,
    staticStuckIds,
    selectedScaleIds,
    releasedRampIds,
    prismActive,
    windPower,
    playedNotes,
    completedStepIds,
    completedOnce,
  ]);

  const testMagnetItem = (item: PhysicsItemSpec) => {
    const isMag = Boolean(item.isMagnetic);
    const nextTested = testedIds.includes(item.id) ? testedIds : [...testedIds, item.id];
    setTestedIds(nextTested);

    if (isMag) {
      if (!stuckIds.includes(item.id)) {
        soundEngine.playMagnetClink(true);
        const nextStuck = [...stuckIds, item.id];
        setStuckIds(nextStuck);

        const magneticItems = level.items.filter((i) => i.isMagnetic);
        const willWinNow =
          magneticItems.every((i) => nextStuck.includes(i.id)) &&
          nextTested.length >= Math.max(1, level.items.length - 1);
        if (!willWinNow) {
          soundEngine.speakClipKey('phys_magnet_stuck');
        }
      }
    } else {
      soundEngine.playMagnetClink(false);
      const magneticItems = level.items.filter((i) => i.isMagnetic);
      const willWinNow =
        magneticItems.every((i) => stuckIds.includes(i.id)) &&
        nextTested.length >= Math.max(1, level.items.length - 1);
      if (!willWinNow) {
        soundEngine.speakClipKey('phys_magnet_wood_no');
      }
    }
  };

  const handleStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingMagnet || !stageRef.current || level.mode !== 'magnet_explore') return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(12, Math.min(88, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(16, Math.min(84, ((e.clientY - rect.top) / rect.height) * 100));
    setMagnetPos({ x, y });

    level.items.forEach((item, idx) => {
      const ix = 16 + (idx * 68) / Math.max(1, level.items.length - 1);
      const iy = 72;
      const dist = Math.hypot(x - ix, y - iy);
      if (dist < 16 && !testedIds.includes(item.id)) {
        testMagnetItem(item);
      }
    });
  };

  const resetStage = () => {
    soundEngine.playPop(420);
    setTestedIds([]);
    setStuckIds([]);
    setPolesFlipped(false);
    setPolesTested(false);
    setDroppedWaterIds([]);
    setSaltAdded(false);
    setBalloonCharged(false);
    setStaticStuckIds([]);
    setSelectedScaleIds([]);
    setReleasedRampIds([]);
    setPrismActive(false);
    setWindPower(0);
    setPlayedNotes([]);
    setCompletedStepIds([]);
    setCompletedOnce(false);
  };

  const currentScaleWeight = level.items
    .filter((i) => selectedScaleIds.includes(i.id))
    .reduce((acc, item) => acc + (item.weight || 1), 0);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Interactive Voice Step Coach Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-white/15 rounded-2xl px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={() => soundEngine.speakClipKey(getStartClipForLevel(level))}
          className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200 hover:text-white font-black text-right"
        >
          <span className="p-1.5 rounded-xl bg-emerald-400 text-slate-950 shadow">
            <Volume2 className="w-4 h-4" />
          </span>
          <span>🔊 بگو چیکار کنم: {level.kidPrompt}</span>
        </button>

        <button
          type="button"
          onClick={resetStage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 text-xs font-bold transition"
        >
          <RotateCcw className="w-4 h-4" />
          تکرار آزمایش
        </button>
      </div>

      {/* Main Everyday Science Interactive Stage */}
      <div
        ref={stageRef}
        onPointerMove={handleStageMove}
        onPointerUp={() => setDraggingMagnet(false)}
        className="relative w-full h-[435px] sm:h-[455px] rounded-[2rem] border-2 border-emerald-400/45 bg-gradient-to-b from-sky-950 via-slate-900 to-emerald-950/90 shadow-2xl overflow-hidden select-none p-4 flex flex-col justify-between"
      >
        {/* 1. MAGNET EXPLORATION STAGE (Iron sticks, Wood/Plastic doesn't!) */}
        {level.mode === 'magnet_explore' && (
          <>
            <div className="text-center text-xs sm:text-sm text-amber-300 font-black z-10">
              🧲 آهنربا رو با دستت بکش روی وسیله‌ها (یا روی هر وسیله کلیک کن) ببین کدوم آهن داره و می‌چسبه!
            </div>

            <div
              style={{ left: `${magnetPos.x}%`, top: `${magnetPos.y}%` }}
              onPointerDown={() => setDraggingMagnet(true)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-grab active:cursor-grabbing flex flex-col items-center"
            >
              <svg viewBox="0 0 130 115" className="w-28 h-24 drop-shadow-[0_12px_25px_rgba(239,68,68,0.45)]">
                <path
                  d="M22,95 Q65,122 108,95"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <path
                  d="M28,90 L28,44 A37,37 0 0,1 102,44 L102,90"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="22"
                />
                <path
                  d="M65,7 A37,37 0 0,1 102,44 L102,90"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="22"
                />
                <rect x="17" y="72" width="22" height="18" rx="3" fill="#e2e8f0" />
                <rect x="91" y="72" width="22" height="18" rx="3" fill="#e2e8f0" />
                <text x="23" y="62" fontSize="13" fill="#fff" fontWeight="bold">
                  N
                </text>
                <text x="97" y="62" fontSize="13" fill="#fff" fontWeight="bold">
                  S
                </text>
              </svg>
              <div className="flex gap-1 -mt-2">
                {level.items
                  .filter((i) => stuckIds.includes(i.id))
                  .map((i) => (
                    <span key={i.id} className="text-2xl animate-bounce drop-shadow">
                      {i.emoji}
                    </span>
                  ))}
              </div>
            </div>

            <div className="relative z-20 mt-auto bg-amber-950/85 border-t-4 border-amber-600/60 rounded-3xl p-4 flex flex-wrap items-center justify-around gap-3 shadow-inner">
              {level.items.map((item, idx) => {
                const isStuck = stuckIds.includes(item.id);
                const isTested = testedIds.includes(item.id);
                const isFirstUntested = !isTested && testedIds.length === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMagnetPos({
                        x: 20 + idx * (60 / Math.max(1, level.items.length - 1)),
                        y: 44,
                      });
                      testMagnetItem(item);
                    }}
                    className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${
                      isStuck
                        ? 'opacity-35 scale-90 bg-emerald-900/40 border-emerald-400'
                        : isTested && !item.isMagnetic
                        ? 'bg-amber-900/50 border-rose-400/70'
                        : 'bg-slate-900/90 hover:bg-slate-800 border-white/25 hover:-translate-y-1 shadow-lg'
                    }`}
                  >
                    {isFirstUntested && (
                      <span className="absolute -top-5 right-1 text-2xl animate-bounce pointer-events-none">
                        👆
                      </span>
                    )}
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-xs font-black text-white">{item.name}</span>
                    <span className="text-[11px] font-bold text-amber-300">
                      {isStuck
                        ? 'چسبید به آهنربا! 🧲'
                        : isTested
                        ? `نچسبید (${item.materialLabel || 'غیرآهنی'}) 🪵`
                        : 'بزن امتحان کن!'}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 2. MAGNET POLES ATTRACTION / REPULSION */}
        {level.mode === 'magnet_poles' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop(540);
                  setPolesFlipped((f) => !f);
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/20 text-white font-black text-xs sm:text-sm"
              >
                🔄 چرخاندن قطب آهنربای دوم
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playMagnetClink(true);
                  setPolesTested(true);
                }}
                className="relative px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm border-b-4 border-amber-600 shadow-lg"
              >
                <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                🧲 نزدیک کردن دو آهنربا به هم!
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 my-auto">
              {/* Left Bar Magnet */}
              <div
                style={{
                  transform: polesTested
                    ? polesFlipped
                      ? 'translateX(26px)'
                      : 'translateX(-18px)'
                    : 'none',
                  transition: 'transform 0.5s ease',
                }}
                className="flex rounded-xl overflow-hidden border-2 border-white shadow-2xl font-black text-lg"
              >
                <div className="w-18 h-14 bg-blue-600 flex items-center justify-center px-5">S</div>
                <div className="w-18 h-14 bg-red-600 flex items-center justify-center px-5">N</div>
              </div>

              <span className="text-3xl font-black text-amber-300">
                {polesTested ? (polesFlipped ? '🤝 جذب شدن!' : '↔️ دفع کردن!') : '⚡'}
              </span>

              {/* Right Bar Magnet */}
              <div
                style={{
                  transform: polesTested
                    ? polesFlipped
                      ? 'translateX(-26px)'
                      : 'translateX(18px)'
                    : 'none',
                  transition: 'transform 0.5s ease',
                }}
                className="flex rounded-xl overflow-hidden border-2 border-white shadow-2xl font-black text-lg"
              >
                {polesFlipped ? (
                  <>
                    <div className="w-18 h-14 bg-blue-600 flex items-center justify-center px-5">S</div>
                    <div className="w-18 h-14 bg-red-600 flex items-center justify-center px-5">N</div>
                  </>
                ) : (
                  <>
                    <div className="w-18 h-14 bg-red-600 flex items-center justify-center px-5">N</div>
                    <div className="w-18 h-14 bg-blue-600 flex items-center justify-center px-5">S</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. SINK OR FLOAT AQUARIUM STAGE */}
        {level.mode === 'sink_float' && (
          <div className="relative w-full h-full flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-center gap-3 z-20">
              {level.items.map((item, idx) => {
                const dropped = droppedWaterIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!dropped) {
                        soundEngine.playPourLiquid();
                        setDroppedWaterIds((prev) => [...prev, item.id]);
                        soundEngine.speakPersian(
                          item.floats
                            ? `آفرین! ${item.name} سبک‌تر از آبه و روی آب شناور موند!`
                            : level.waterIsSalty
                            ? `ببین! ${item.name} رفت ته آب! حالا نمک رو بریز تا بیاد بالا!`
                            : `ببین! ${item.name} سنگین‌تر از آبه و رفت ته تشت!`
                        );
                      }
                    }}
                    disabled={dropped}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition ${
                      dropped
                        ? 'opacity-40 bg-slate-800 border-white/10'
                        : 'bg-slate-900 hover:bg-sky-900 border-amber-400 text-white shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {!dropped && idx === droppedWaterIds.length && (
                      <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>
                    )}
                    <span className="text-2xl">{item.emoji}</span>
                    <span>انداختن {item.name} در آب 💧</span>
                  </button>
                );
              })}

              {level.waterIsSalty && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playFizzEruption();
                    setSaltAdded(true);
                  }}
                  className={`relative px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition ${
                    saltAdded
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-600 animate-bounce'
                  }`}
                >
                  🧂 ریختن نمک فراوان در آب {saltAdded ? '✓' : '👆'}
                </button>
              )}
            </div>

            <div className="relative w-full h-64 rounded-3xl border-4 border-sky-300/60 bg-gradient-to-b from-sky-400/25 via-sky-500/45 to-blue-700/75 overflow-hidden shadow-inner mt-auto">
              <div className="absolute inset-x-0 top-3 h-2 bg-white/35 blur-[1px]" />
              {level.items.map((item, idx) => {
                if (!droppedWaterIds.includes(item.id)) return null;
                const floatsNow = Boolean(item.floats) || Boolean(level.waterIsSalty && saltAdded);
                return (
                  <div
                    key={item.id}
                    style={{
                      left: `${20 + idx * (60 / Math.max(1, level.items.length - 1))}%`,
                      top: floatsNow ? '12%' : '70%',
                    }}
                    className="absolute -translate-x-1/2 transition-all duration-700 flex flex-col items-center"
                  >
                    <span className="text-5xl drop-shadow-lg">{item.emoji}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[11px] font-black text-white mt-1">
                      {floatsNow ? 'شناور روی آب 🌊' : 'ته آب رفت ⬇️'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. STATIC ELECTRICITY BALLOON */}
        {level.mode === 'static_balloon' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-3">
            <button
              type="button"
              onClick={() => {
                soundEngine.playWireSpark();
                setBalloonCharged(true);
                soundEngine.speakPersian('آفرین! بادکنک پر از برق ساکن شد! حالا بزن روی کاغذها تا بپرن بچسبن بهش!');
              }}
              className={`relative px-6 py-3 rounded-2xl font-black text-sm border-b-4 shadow-xl transition ${
                balloonCharged
                  ? 'bg-emerald-400 text-slate-950 border-emerald-600'
                  : 'bg-pink-500 hover:bg-pink-400 text-white border-pink-700 animate-pulse'
              }`}
            >
              {!balloonCharged && <span className="absolute -top-5 -right-2 text-2xl animate-bounce">👆</span>}
              🎈 ۱. مالش دادن بادکنک به مو و لباس پشمی {balloonCharged ? '(شارژ شد ⚡)' : ''}
            </button>

            <div className="relative flex flex-col items-center my-auto">
              <div
                className={`w-28 h-34 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 border-2 border-white/60 flex items-center justify-center text-4xl shadow-2xl ${
                  balloonCharged ? 'shadow-[0_0_40px_rgba(250,204,21,0.85)] animate-pulse' : ''
                }`}
              >
                🎈
              </div>
              <div className="flex gap-1 -mt-2">
                {level.items
                  .filter((i) => staticStuckIds.includes(i.id))
                  .map((i) => (
                    <span key={i.id} className="text-2xl animate-bounce">
                      {i.emoji}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {level.items.map((item) => {
                const stuck = staticStuckIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!balloonCharged) {
                        soundEngine.speakPersian('اول دکمه بالای صفحه رو بزن تا بادکنک رو مالش بدیم و برق‌دار بشه!');
                        return;
                      }
                      if (item.attractedByStatic) {
                        soundEngine.playMagnetClink(true);
                        setStaticStuckIds((prev) => [...prev, item.id]);
                      } else {
                        soundEngine.playMagnetClink(false);
                        soundEngine.speakPersian(`${item.name} سنگینه و با برق بادکنک بلند نمی‌شه!`);
                      }
                    }}
                    className={`relative px-4 py-2.5 rounded-2xl border-2 font-black text-xs flex items-center gap-2 ${
                      stuck
                        ? 'opacity-35 bg-emerald-900 border-emerald-400'
                        : 'bg-slate-900 hover:bg-slate-800 border-amber-300/70 text-white'
                    }`}
                  >
                    {balloonCharged && item.attractedByStatic && !stuck && (
                      <span className="absolute -top-5 -right-1 text-xl animate-bounce">👆</span>
                    )}
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. SEESAW & BALANCE SCALE */}
        {level.mode === 'balance_scale' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-2">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {level.items.map((item) => {
                const onScale = selectedScaleIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playSnap();
                      setSelectedScaleIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                    className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition ${
                      onScale
                        ? 'bg-emerald-400 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-amber-400/70'
                    }`}
                  >
                    {item.emoji} {item.name} (وزن: {item.weight || 1}) {onScale ? '✓' : '➕'}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-black text-amber-300">
              وزن کفه سمت چپ: {level.targetWeight || 4} | وزن انتخاب‌شده شما: {currentScaleWeight}
            </div>

            <div className="relative w-full max-w-xl h-52 flex flex-col items-center justify-end">
              <div
                style={{
                  transform: `rotate(${
                    Math.max(-18, Math.min(18, ((level.targetWeight || 4) - currentScaleWeight) * -6))
                  }deg)`,
                }}
                className="w-4/5 h-4 bg-amber-400 rounded-full border-2 border-amber-700 transition-transform duration-500 relative flex items-center justify-between px-6 shadow-xl"
              >
                <div className="-mt-16 flex flex-col items-center">
                  <span className="text-5xl">📦</span>
                  <span className="text-[11px] font-black bg-slate-900 px-2 py-0.5 rounded-full text-amber-300">
                    هدف ({level.targetWeight || 4})
                  </span>
                </div>
                <div className="-mt-16 flex items-center gap-1">
                  {level.items
                    .filter((i) => selectedScaleIds.includes(i.id))
                    .map((i) => (
                      <span key={i.id} className="text-4xl">
                        {i.emoji}
                      </span>
                    ))}
                </div>
              </div>
              <div className="w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[48px] border-b-emerald-400" />
            </div>
          </div>
        )}

        {/* 6. RAMP & FRICTION RACE */}
        {level.mode === 'ramp_friction' && (
          <div className="w-full h-full flex flex-col justify-around py-2 px-2">
            <div className="text-center text-xs sm:text-sm font-black text-amber-300">
              🏎️ روی هر مسیر کلیک کن تا ماشین رها بشه و ببینی روی کدوم سطح سریع‌تر می‌ره!
            </div>
            <div className="space-y-3">
              {level.items.map((item, idx) => {
                const released = releasedRampIds.includes(item.id);
                const speed = item.speedFactor || 5;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!released) {
                        soundEngine.playMotorWhir();
                        setReleasedRampIds((prev) => [...prev, item.id]);
                      }
                    }}
                    className="cursor-pointer relative h-20 rounded-2xl border-2 border-white/20 bg-slate-900/80 px-4 flex items-center justify-between overflow-hidden"
                  >
                    <div
                      className="absolute inset-y-0 right-0 opacity-25 pointer-events-none"
                      style={{ width: '100%', backgroundColor: item.color }}
                    />
                    <div className="relative z-10 flex items-center gap-2">
                      {!released && idx === releasedRampIds.length && (
                        <span className="text-xl animate-bounce">👆</span>
                      )}
                      <span className="text-xs sm:text-sm font-black text-white">
                        {item.name}
                      </span>
                    </div>
                    <div className="relative flex-1 mx-6 h-10 flex items-center">
                      <span
                        style={{
                          right: released ? `${Math.min(88, speed * 9)}%` : '0%',
                          transition: `right ${(12 - speed) * 0.16}s cubic-bezier(0.22, 1, 0.36, 1)`,
                        }}
                        className="absolute text-4xl"
                      >
                        {item.emoji || '🏎️'}
                      </span>
                    </div>
                    <span className="text-xl">🏁</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. LIGHT & RAINBOW PRISM (HIGH-DETAIL OPTICAL SVG) */}
        {level.mode === 'light_prism' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playWireSpark();
                setPrismActive(true);
              }}
              className="px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base border-b-4 border-amber-600 shadow-xl animate-pulse"
            >
              🔦 روشن کردن چراغ‌قوه به سمت منشور شیشه‌ای! 👆
            </button>

            <svg viewBox="0 0 560 220" className="w-full max-w-3xl h-64 drop-shadow-2xl">
              <rect x="22" y="96" width="68" height="32" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="3" />
              <polygon points="90,92 108,84 108,140 90,132" fill="#f59e0b" />
              <circle cx="56" cy="112" r="6" fill={prismActive ? '#22c55e' : '#ef4444'} />

              {prismActive && (
                <polygon points="108,104 252,108 252,118 108,120" fill="#fef9c3" opacity="0.95" />
              )}

              <polygon
                points="275,38 215,176 335,176"
                fill="rgba(186,230,253,0.32)"
                stroke="#7dd3fc"
                strokeWidth="4"
              />
              <polygon points="275,48 232,168 275,168" fill="rgba(255,255,255,0.16)" />

              {prismActive &&
                [
                  { c: '#ef4444', y2: 52 },
                  { c: '#f97316', y2: 72 },
                  { c: '#eab308', y2: 92 },
                  { c: '#22c55e', y2: 112 },
                  { c: '#06b6d4', y2: 132 },
                  { c: '#3b82f6', y2: 152 },
                  { c: '#a855f7', y2: 172 },
                ].map((ray, idx) => (
                  <line
                    key={idx}
                    x1="304"
                    y1={108 + idx * 2}
                    x2="538"
                    y2={ray.y2}
                    stroke={ray.c}
                    strokeWidth="9"
                    strokeLinecap="round"
                    opacity="0.92"
                  />
                ))}
            </svg>
          </div>
        )}

        {/* 8. WIND & PINWHEEL ENERGY */}
        {level.mode === 'wind_energy' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playMotorWhir();
                setWindPower((p) => p + 1);
              }}
              className="px-7 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm sm:text-base border-b-4 border-cyan-600 shadow-xl"
            >
              💨 فوت کردن و روشن کردن بادبزن! ({windPower}/2) 👆
            </button>

            <div className="flex items-center justify-around w-full max-w-2xl my-auto">
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 140 170" className="w-36 h-44 drop-shadow-xl">
                  <rect x="66" y="75" width="8" height="90" rx="4" fill="#fde68a" />
                  <g
                    style={{
                      transformOrigin: '70px 72px',
                      animation:
                        windPower > 0
                          ? `spin ${windPower >= 2 ? '0.45s' : '1.1s'} linear infinite`
                          : 'none',
                    }}
                  >
                    <path d="M70,72 L70,16 Q105,22 96,56 Z" fill="#ef4444" />
                    <path d="M70,72 L126,72 Q120,107 86,98 Z" fill="#eab308" />
                    <path d="M70,72 L70,128 Q35,122 44,88 Z" fill="#22c55e" />
                    <path d="M70,72 L14,72 Q20,37 54,46 Z" fill="#3b82f6" />
                    <circle cx="70" cy="72" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  </g>
                </svg>
                <span className="text-xs font-black text-cyan-200">فرفره رنگی</span>
              </div>

              <div
                style={{
                  transform: `translateX(${windPower * -28}px)`,
                  transition: 'transform 0.6s ease',
                }}
                className="flex flex-col items-center"
              >
                <span className="text-7xl drop-shadow-lg">⛵</span>
                <span className="text-xs font-black text-sky-200 mt-1">قایق بادبانی</span>
              </div>

              <div
                style={{
                  transform: `translateY(${windPower * -22}px)`,
                  transition: 'transform 0.6s ease',
                }}
                className="flex flex-col items-center"
              >
                <span className="text-7xl drop-shadow-lg">🪁</span>
                <span className="text-xs font-black text-amber-200 mt-1">بادبادک</span>
              </div>
            </div>
          </div>
        )}

        {/* 9. MUSICAL WATER XYLOPHONE */}
        {level.mode === 'sound_glasses' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-4">
            <div className="text-sm font-black text-amber-300">
              🎵 با قاشق روی لیوان‌های آب بزن و صدای زیر و بم اون‌ها رو بشنو! ({playedNotes.length}/4)
            </div>
            <div className="flex items-end justify-center gap-4 sm:gap-7 my-auto">
              {[
                { fill: 25, color: '#f43f5e', name: 'لیوان کم‌آب (زیر)' },
                { fill: 48, color: '#f59e0b', name: 'لیوان نیمه‌پر' },
                { fill: 70, color: '#10b981', name: 'لیوان پر' },
                { fill: 90, color: '#3b82f6', name: 'لیوان لبریز (بم)' },
              ].map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEngine.playMusicalGlass(3 - idx);
                    setPlayedNotes((prev) => [...prev, idx]);
                  }}
                  className="group relative flex flex-col items-center gap-2 transition transform hover:-translate-y-2 active:scale-95"
                >
                  {playedNotes.length === idx && (
                    <span className="absolute -top-7 text-2xl animate-bounce">🥄</span>
                  )}
                  <div className="relative w-16 sm:w-20 h-40 rounded-b-2xl border-4 border-white/75 bg-white/10 overflow-hidden flex items-end shadow-xl">
                    <div
                      style={{ height: `${g.fill}%`, backgroundColor: g.color }}
                      className="w-full opacity-85 transition-all"
                    />
                    <div className="absolute top-2 left-2 w-2 h-32 rounded-full bg-white/30" />
                  </div>
                  <span className="text-[11px] font-black text-white">{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 10. PLANT GROWTH & NATURE CYCLE */}
        {level.mode === 'plant_growth' && (
          <div className="w-full h-full flex flex-col items-center justify-between py-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {level.items.map((stepItem, idx) => {
                const done = completedStepIds.includes(stepItem.id);
                const isNext = !done && completedStepIds.length === idx;
                return (
                  <button
                    key={stepItem.id}
                    type="button"
                    onClick={() => {
                      if (stepItem.isRequiredStep === false) {
                        soundEngine.playShortCircuitWarning();
                        soundEngine.speakPersian('گیاه به این وسیله نیاز نداره عزیزم! دکمه‌های دیگه رو امتحان کن!');
                        return;
                      }
                      soundEngine.playPourLiquid();
                      if (!done) {
                        setCompletedStepIds((prev) => [...prev, stepItem.id]);
                      }
                    }}
                    className={`relative px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition ${
                      done
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : 'bg-slate-900 text-white border-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    {isNext && <span className="absolute -top-5 -right-1 text-xl animate-bounce">👆</span>}
                    {stepItem.emoji} {stepItem.name} {done && '✓'}
                  </button>
                );
              })}
            </div>

            <svg viewBox="0 0 280 230" className="w-64 h-56 my-auto drop-shadow-2xl">
              {completedStepIds.length >= 3 && (
                <g>
                  <circle cx="230" cy="42" r="26" fill="#facc15" />
                  <circle cx="230" cy="42" r="36" fill="#fef08a" opacity="0.35" />
                </g>
              )}
              {completedStepIds.length === 2 && (
                <g fill="#38bdf8">
                  <circle cx="125" cy="52" r="4" />
                  <circle cx="140" cy="64" r="4" />
                  <circle cx="155" cy="50" r="4" />
                </g>
              )}
              {completedStepIds.length === 1 && (
                <ellipse cx="140" cy="148" rx="9" ry="6" fill="#fde68a" />
              )}
              {completedStepIds.length >= 2 && (
                <g>
                  <path
                    d={completedStepIds.length >= 3 ? 'M140,152 Q142,102 140,68' : 'M140,152 Q142,126 140,108'}
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <ellipse cx="122" cy="122" rx="16" ry="8" fill="#4ade80" transform="rotate(-24 122 122)" />
                  <ellipse cx="158" cy="116" rx="16" ry="8" fill="#22c55e" transform="rotate(24 158 116)" />
                </g>
              )}
              {completedStepIds.length >= 3 && (
                <g transform="translate(140, 62)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-22"
                      rx="9"
                      ry="15"
                      fill="#facc15"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="14" fill="#78350f" stroke="#f59e0b" strokeWidth="3" />
                </g>
              )}
              <polygon points="96,152 184,152 170,218 110,218" fill="#c2410c" stroke="#ea580c" strokeWidth="3" />
              <rect x="88" y="140" width="104" height="16" rx="6" fill="#ea590c" />
            </svg>
          </div>
        )}
      </div>

      {completedOnce && <VictoryStoryBanner level={level} onNextLevel={onNextLevel} />}
    </div>
  );
};

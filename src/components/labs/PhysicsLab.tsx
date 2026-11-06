import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PhysicsLevel, PhysicsItemSpec } from '../../types/game';
import { soundEngine } from '../../utils/soundEngine';
import { Compass, RotateCcw } from 'lucide-react';

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
  // Shared progress states across sub-modes
  const [magnetPos, setMagnetPos] = useState<{ x: number; y: number }>({ x: 50, y: 26 });
  const [testedIds, setTestedIds] = useState<string[]>([]);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [poleProgress, setPoleProgress] = useState<number>(0); // 0..100
  const [balloonCharge, setBalloonCharge] = useState<number>(0); // 0..3
  const [scaleSelectedIds, setScaleSelectedIds] = useState<string[]>([]);
  const [raceRunning, setRaceRunning] = useState<boolean>(false);
  const [completedOnce, setCompletedOnce] = useState<boolean>(false);

  useEffect(() => {
    setMagnetPos({ x: 50, y: 26 });
    setTestedIds([]);
    setCollectedIds([]);
    setPoleProgress(0);
    setBalloonCharge(0);
    setScaleSelectedIds([]);
    setRaceRunning(false);
    setCompletedOnce(false);
  }, [level]);

  const triggerWin = () => {
    if (completedOnce) return;
    setCompletedOnce(true);
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 100,
      spread: 85,
      origin: { y: 0.6 },
    });
    onComplete();
  };

  // Evaluate win condition dynamically
  useEffect(() => {
    if (completedOnce) return;

    if (level.mode === 'magnet_explore') {
      if (collectedIds.length >= level.targetGoalCount) {
        triggerWin();
      }
    } else if (level.mode === 'magnet_poles') {
      if (poleProgress >= 100) {
        triggerWin();
      }
    } else if (level.mode === 'sink_float') {
      if (testedIds.length >= level.targetGoalCount) {
        triggerWin();
      }
    } else if (level.mode === 'static_balloon') {
      if (collectedIds.length >= level.targetGoalCount) {
        triggerWin();
      }
    } else if (level.mode === 'balance_scale') {
      const sum = scaleSelectedIds.reduce((acc, id) => {
        const it = level.items.find((x) => x.id === id);
        return acc + (it?.weight || 0);
      }, 0);
      if (sum === (level.targetWeight || 2)) {
        triggerWin();
      }
    } else if (
      level.mode === 'light_prism' ||
      level.mode === 'wind_energy' ||
      level.mode === 'sound_glasses' ||
      level.mode === 'plant_growth'
    ) {
      if (testedIds.length >= level.targetGoalCount) {
        triggerWin();
      }
    }
  }, [
    collectedIds,
    testedIds,
    poleProgress,
    scaleSelectedIds,
    level,
    completedOnce,
  ]);

  const resetSandbox = () => {
    soundEngine.playPop(400);
    setTestedIds([]);
    setCollectedIds([]);
    setPoleProgress(0);
    setBalloonCharge(0);
    setScaleSelectedIds([]);
    setRaceRunning(false);
    setCompletedOnce(false);
  };

  // ---- Mode Renderers ----

  const renderMagnetExplore = () => {
    const handleItemTest = (item: PhysicsItemSpec, idx: number) => {
      const targetX = 16 + ((idx * 72) / Math.max(1, level.items.length - 1));
      setMagnetPos({ x: targetX, y: 42 });
      if (!testedIds.includes(item.id)) {
        setTestedIds((prev) => [...prev, item.id]);
      }
      if (item.isMagnetic) {
        soundEngine.playMagnetClink(true);
        if (!collectedIds.includes(item.id)) {
          setCollectedIds((prev) => [...prev, item.id]);
        }
      } else {
        soundEngine.playMagnetClink(false);
      }
    };

    return (
      <div
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.max(12, Math.min(88, ((e.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(16, Math.min(56, ((e.clientY - rect.top) / rect.height) * 100));
          setMagnetPos({ x, y });
        }}
        className="relative w-full h-[410px] rounded-3xl border-2 border-emerald-400/35 bg-gradient-to-b from-slate-900 via-teal-950/60 to-amber-950/70 overflow-hidden select-none p-4"
      >
        <div className="text-center text-xs sm:text-sm font-black text-emerald-200">
          آهنربای نعل‌اسبی را حرکت بده و روی هر وسیله کلیک کن تا ببینی جذب می‌شود یا نه! ({collectedIds.length} از {level.targetGoalCount} آهنی پیدا شد)
        </div>

        {/* Floating Interactive Horseshoe Magnet */}
        <div
          style={{ left: `${magnetPos.x}%`, top: `${magnetPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-150 flex flex-col items-center"
        >
          <svg viewBox="0 0 120 110" className="w-28 h-26 drop-shadow-[0_10px_20px_rgba(239,68,68,0.4)]">
            {/* Red North Leg & Blue South Leg Horseshoe */}
            <path
              d="M28,90 L28,42 A32,32 0 0,1 60,12 L60,32 A12,12 0 0,0 48,42 L48,90 Z"
              fill="#ef4444"
              stroke="#fecaca"
              strokeWidth="2"
            />
            <path
              d="M92,90 L92,42 A32,32 0 0,0 60,12 L60,32 A12,12 0 0,1 72,42 L72,90 Z"
              fill="#2563eb"
              stroke="#bfdbfe"
              strokeWidth="2"
            />
            <rect x="28" y="78" width="20" height="14" fill="#cbd5e1" />
            <rect x="72" y="78" width="20" height="14" fill="#cbd5e1" />
            <text x="38" y="64" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">N</text>
            <text x="82" y="64" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">S</text>
          </svg>
          {/* Collected Magnetic Items Clinging to Magnet Poles! */}
          <div className="flex items-center gap-1 -mt-3">
            {collectedIds.map((cid) => {
              const found = level.items.find((x) => x.id === cid);
              return (
                <span key={cid} className="text-2xl drop-shadow animate-bounce">
                  {found?.emoji}
                </span>
              );
            })}
          </div>
        </div>

        {/* Everyday Objects Row on Wooden Table */}
        <div className="absolute inset-x-4 bottom-5 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
          {level.items.map((item, idx) => {
            const isStuck = collectedIds.includes(item.id);
            const wasTested = testedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemTest(item, idx)}
                onPointerEnter={() => handleItemTest(item, idx)}
                className={`group flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all ${
                  isStuck
                    ? 'opacity-35 scale-90 bg-emerald-900/40 border-emerald-400'
                    : wasTested && !item.isMagnetic
                    ? 'bg-amber-950/80 border-amber-400 animate-wiggle'
                    : 'bg-slate-900/85 hover:bg-slate-800 border-white/20 hover:scale-110 shadow-xl'
                }`}
              >
                <span className="text-4xl sm:text-5xl mb-1">{item.emoji}</span>
                <span className="text-xs font-black text-white">{item.name}</span>
                {isStuck && (
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
                    چسبید! 🧲 ({item.materialLabel})
                  </span>
                )}
                {wasTested && !item.isMagnetic && (
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 text-[10px] font-black">
                    به {item.materialLabel} نمی‌چسبد! ❌
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMagnetPoles = () => {
    const vehicle = level.items[0];
    return (
      <div className="relative w-full h-[380px] rounded-3xl border-2 border-cyan-400/35 bg-gradient-to-b from-slate-900 to-indigo-950 p-6 flex flex-col justify-between select-none">
        <div className="text-center text-sm font-black text-cyan-200">
          دکمه «هل دادن مغناطیسی 🧲» را پشت سر هم بزن تا {vehicle.name} بدون تماس دست به پرچم پایان برسد!
        </div>

        {/* Magnetic Track */}
        <div className="relative w-full h-32 bg-slate-800/90 border-2 border-white/15 rounded-3xl flex items-center px-6 overflow-hidden">
          <div className="absolute left-6 text-4xl">🏁</div>

          {/* Moving Magnet + Repelled Vehicle */}
          <div
            style={{ right: `${8 + poleProgress * 0.68}%` }}
            className="absolute flex items-center gap-4 transition-all duration-300"
          >
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-white font-black text-xs shadow-lg border border-white/40">
              S ◀ آهنربا ▶ N
            </div>
            <span className="text-cyan-300 font-black animate-pulse">)))</span>
            <div className="text-5xl drop-shadow-xl">{vehicle.emoji}</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              soundEngine.playMagnetClink(true);
              setPoleProgress((p) => Math.min(100, p + 25));
            }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-400 hover:to-blue-500 text-white font-black text-base sm:text-lg shadow-2xl border-2 border-white/40 transform active:scale-95 transition"
          >
            🧲 نزدیک کردن آهنربا و حرکت بدون تماس! ({poleProgress}%)
          </button>
        </div>
      </div>
    );
  };

  const renderSinkFloat = () => (
    <div className="relative w-full h-[420px] rounded-3xl border-2 border-sky-400/40 bg-slate-900 overflow-hidden flex flex-col justify-between p-4 select-none">
      {/* Items Shelf Above Water */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-3">
        {level.items.map((item) => {
          const dropped = testedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={dropped}
              onClick={() => {
                soundEngine.playPourLiquid();
                setTestedIds((prev) => [...prev, item.id]);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-black text-xs transition ${
                dropped
                  ? 'opacity-35 bg-slate-800 border-slate-700'
                  : 'bg-slate-800 hover:bg-sky-700 border-amber-300 text-white hover:scale-105 shadow-lg cursor-pointer'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span>{item.name}</span>
              {!dropped && <span className="text-amber-300">بنداز تو آب 👇</span>}
            </button>
          );
        })}
      </div>

      {/* Crystal Aquarium Water Tank */}
      <div className="relative w-full h-64 rounded-3xl border-4 border-sky-200/50 bg-gradient-to-b from-sky-400/35 via-blue-600/55 to-blue-950/90 overflow-hidden shadow-inner">
        <div className="absolute top-2 right-3 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
          {level.waterIsSalty ? '🌊 آکواریوم آب شور دریا (چگالی بالا)' : '💧 آکواریوم آب شیرین معمولی'}
        </div>

        {/* Surface Wave Line */}
        <div className="absolute inset-x-0 top-10 h-2 bg-sky-200/50 animate-pulse" />

        {/* Dropped Items Floating at Top OR Sunk at Bottom! */}
        {level.items.map((item, idx) => {
          if (!testedIds.includes(item.id)) return null;
          const leftPct = 15 + (idx * 70) / Math.max(1, level.items.length - 1);
          return (
            <div
              key={item.id}
              style={{
                left: `${leftPct}%`,
                top: item.floats ? '14%' : '70%',
              }}
              className={`absolute -translate-x-1/2 transition-all duration-700 flex flex-col items-center ${
                item.floats ? 'animate-float' : ''
              }`}
            >
              <span className="text-4xl drop-shadow-lg">{item.emoji}</span>
              <span
                className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  item.floats
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-amber-300 text-slate-950'
                }`}
              >
                {item.floats ? 'روی آب ماند! 🌊' : 'ته آب رفت! ⬇️'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStaticBalloon = () => (
    <div className="relative w-full h-[400px] rounded-3xl border-2 border-pink-400/40 bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 p-5 flex flex-col justify-between select-none">
      <div className="flex flex-wrap items-center justify-around gap-6 my-auto">
        {/* Step 1: Wool Sweater to Rub Balloon */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playWireSpark();
            setBalloonCharge((c) => Math.min(3, c + 1));
          }}
          className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-indigo-900/70 hover:bg-indigo-800 border-2 border-pink-300/50 shadow-xl transition transform active:scale-95"
        >
          <div className="flex items-center gap-2 text-5xl">
            <span>🧶</span>
            <span className={balloonCharge >= 3 ? 'animate-bounce' : ''}>🎈</span>
          </div>
          <span className="text-xs sm:text-sm font-black text-white">
            ۱. بادکنک را به لباس پشمی بمال!
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
            شارژ الکتریکی: {'⚡'.repeat(balloonCharge) || 'بدون شارژ (بزن شارژ شه!)'}
          </span>
        </button>

        {/* Step 2: Light Items Waiting to Jump */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {level.items.map((item) => {
            const stuck = collectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (balloonCharge < 2) {
                    soundEngine.playShortCircuitWarning();
                    return;
                  }
                  if (item.attractedByStatic) {
                    soundEngine.playMagnetClink(true);
                    if (!collectedIds.includes(item.id)) {
                      setCollectedIds((prev) => [...prev, item.id]);
                    }
                  } else {
                    soundEngine.playMagnetClink(false);
                  }
                }}
                className={`flex flex-col items-center p-3.5 rounded-2xl border-2 transition-all ${
                  stuck
                    ? '-translate-y-8 bg-pink-500/35 border-amber-300 scale-110'
                    : 'bg-slate-800 hover:bg-slate-700 border-white/20'
                }`}
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="text-xs font-bold text-white mt-1">{item.name}</span>
                <span className="text-[10px] text-amber-300 mt-0.5">
                  {stuck
                    ? 'پرید چسبید به بادکنک! ⚡'
                    : balloonCharge < 2
                    ? 'اول بادکنک رو شارژ کن!'
                    : item.attractedByStatic
                    ? 'بزن جذب بشه!'
                    : 'سنگینه!'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBalanceScale = () => {
    const targetW = level.targetWeight || 2;
    const rightW = scaleSelectedIds.reduce((sum, id) => {
      const it = level.items.find((x) => x.id === id);
      return sum + (it?.weight || 0);
    }, 0);
    const tiltDeg = Math.max(-16, Math.min(16, (rightW - targetW) * 4));

    return (
      <div className="relative w-full h-[410px] rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-slate-900 to-stone-950 p-5 flex flex-col justify-between select-none">
        <div className="text-center text-sm font-black text-amber-200">
          روی وزنه‌ها و میوه‌ها بزن تا جمع وزن کفه راست دقیقاً برابر با «{targetW}» شود! (الان: {rightW})
        </div>

        {/* Tilting Balance Beam */}
        <div className="relative flex flex-col items-center my-auto">
          <div
            style={{ transform: `rotate(${tiltDeg}deg)` }}
            className="w-72 sm:w-96 h-3 bg-amber-400 rounded-full transition-transform duration-500 relative flex justify-between items-center"
          >
            {/* Left Pan (Target) */}
            <div className="absolute -left-6 -top-16 w-24 h-16 rounded-2xl bg-sky-500/30 border-2 border-sky-300 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-sky-200">کفه هدف</span>
              <span className="text-xl font-black text-white">{targetW} ⭐</span>
            </div>

            {/* Right Pan (Player Selection) */}
            <div className="absolute -right-6 -top-16 w-28 h-16 rounded-2xl bg-emerald-500/30 border-2 border-emerald-300 flex flex-col items-center justify-center">
              <div className="flex gap-0.5 text-lg">
                {scaleSelectedIds.map((id) => (
                  <span key={id}>{level.items.find((x) => x.id === id)?.emoji}</span>
                ))}
              </div>
              <span className="text-xs font-black text-white">جمع: {rightW}</span>
            </div>
          </div>
          {/* Fulcrum Triangle */}
          <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[36px] border-b-amber-600 mt-1" />
        </div>

        {/* Selectable Weights */}
        <div className="flex flex-wrap justify-center gap-3">
          {level.items.map((item) => {
            const active = scaleSelectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playPop(active ? 380 : 620);
                  setScaleSelectedIds((prev) =>
                    active ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                  );
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition ${
                  active
                    ? 'bg-emerald-500 text-slate-950 border-white scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-amber-400/40'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.name}</span>
                <span>{active ? '✓ روی کفه' : '+ بذار'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInteractiveSteps = () => {
    if (level.mode === 'ramp_friction') {
      return (
        <div className="relative w-full h-[390px] rounded-3xl border-2 border-amber-400/35 bg-slate-900 p-5 flex flex-col justify-between select-none">
          <div className="text-center text-sm font-black text-amber-200">
            دکمه شروع مسابقه را بزن تا ببینی روی یخ لیز سریع‌تر حرکت می‌کند یا روی فرش پرزدار!
          </div>

          <div className="flex flex-col gap-5 my-auto">
            {/* Fast Ice Track */}
            <div className="relative h-16 rounded-2xl bg-gradient-to-l from-cyan-400/30 to-sky-200/20 border-2 border-cyan-300/50 flex items-center px-4">
              <span className="text-xs font-black text-cyan-200">❄️ مسیر لیز و صیقلی</span>
              <span
                className="absolute text-4xl transition-all duration-700"
                style={{ right: raceRunning ? '82%' : '8%' }}
              >
                🏎️
              </span>
              <span className="mr-auto text-2xl">🏁</span>
            </div>

            {/* Slow Carpet Track */}
            <div className="relative h-16 rounded-2xl bg-gradient-to-l from-amber-800/50 to-orange-900/40 border-2 border-amber-500/50 flex items-center px-4">
              <span className="text-xs font-black text-amber-200">🧶 مسیر فرشی زبر (اصطکاک زیاد)</span>
              <span
                className="absolute text-4xl transition-all duration-[2200ms]"
                style={{ right: raceRunning ? '76%' : '8%' }}
              >
                🚜
              </span>
              <span className="mr-auto text-2xl">🏁</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                soundEngine.playMotorWhir();
                setRaceRunning(true);
                setTimeout(() => triggerWin(), 1200);
              }}
              className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-xl"
            >
              🚦 شروع مسابقه سرعت و اصطکاک!
            </button>
          </div>
        </div>
      );
    }

    // Light Prism, Wind, Musical Water Glasses, or Plant Growth!
    return (
      <div className="relative w-full h-[400px] rounded-3xl border-2 border-emerald-400/35 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-emerald-950/60 p-6 flex flex-col justify-between items-center select-none">
        {/* Center Visual Stage */}
        <div className="my-auto flex flex-col items-center gap-4">
          {level.mode === 'light_prism' && (
            <div className="flex items-center gap-4">
              <span className="text-5xl">🔦</span>
              {testedIds.length >= 1 && (
                <div className="w-24 h-3 bg-yellow-300 rounded-full shadow-[0_0_20px_#fde047]" />
              )}
              <span className="text-6xl">💎</span>
              {testedIds.length >= 2 && (
                <div className="w-40 h-14 rounded-xl bg-gradient-to-b from-red-500 via-green-400 to-violet-600 shadow-2xl animate-pulse" />
              )}
            </div>
          )}

          {level.mode === 'wind_energy' && (
            <div className="flex items-center gap-8 text-6xl">
              <span className={testedIds.length > 0 ? 'animate-spin-fast' : ''}>🎡</span>
              <span className={testedIds.length > 1 ? 'animate-bounce' : ''}>⛵</span>
              <span className={testedIds.length > 2 ? 'animate-float' : ''}>🪁</span>
            </div>
          )}

          {level.mode === 'sound_glasses' && (
            <div className="flex items-end gap-3 sm:gap-5">
              {level.items.map((g, idx) => {
                const played = testedIds.includes(g.id);
                const fillH = 22 + idx * 14;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playMusicalGlass(7 - idx);
                      if (!testedIds.includes(g.id)) {
                        setTestedIds((prev) => [...prev, g.id]);
                      }
                    }}
                    className={`w-14 sm:w-16 h-28 rounded-b-2xl border-2 flex flex-col justify-end overflow-hidden transition transform hover:scale-110 ${
                      played ? 'border-amber-300 shadow-lg' : 'border-sky-200/50'
                    }`}
                  >
                    <div
                      style={{ height: `${fillH}%`, backgroundColor: g.color }}
                      className="w-full opacity-85 transition-all"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {level.mode === 'plant_growth' && (
            <div className="flex flex-col items-center">
              <div className="text-7xl transition-all duration-500 transform scale-110">
                {testedIds.length === 0
                  ? '🪴'
                  : testedIds.length === 1
                  ? '🌰'
                  : testedIds.length === 2
                  ? '🌱'
                  : testedIds.length === 3
                  ? '🌿'
                  : '🌻'}
              </div>
              <span className="mt-2 text-xs font-black text-emerald-300">
                مرحله رشد گیاه: {testedIds.length} از {level.targetGoalCount}
              </span>
            </div>
          )}
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {level.items.map((item, idx) => {
            const done = testedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (level.mode === 'sound_glasses') {
                    soundEngine.playMusicalGlass(7 - idx);
                  } else {
                    soundEngine.playWireSpark();
                  }
                  if (!done) {
                    setTestedIds((prev) => [...prev, item.id]);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition ${
                  done
                    ? 'bg-emerald-500/35 border-emerald-300 text-emerald-100'
                    : 'bg-slate-800 hover:bg-slate-700 border-amber-300 text-white animate-pulse'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.name}</span>
                {done && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-emerald-200 font-bold">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          <span>آزمایشگاه علوم روزمره — با دست خودت امتحان کن و کشف کن!</span>
        </div>
        <button
          type="button"
          onClick={resetSandbox}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 text-xs font-bold transition"
        >
          <RotateCcw className="w-4 h-4" />
          شروع دوباره آزمایش
        </button>
      </div>

      {level.mode === 'magnet_explore' && renderMagnetExplore()}
      {level.mode === 'magnet_poles' && renderMagnetPoles()}
      {level.mode === 'sink_float' && renderSinkFloat()}
      {level.mode === 'static_balloon' && renderStaticBalloon()}
      {level.mode === 'balance_scale' && renderBalanceScale()}
      {(level.mode === 'light_prism' ||
        level.mode === 'ramp_friction' ||
        level.mode === 'wind_energy' ||
        level.mode === 'sound_glasses' ||
        level.mode === 'plant_growth') &&
        renderInteractiveSteps()}

      {completedOnce && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 border-2 border-amber-300 rounded-3xl p-4 shadow-2xl animate-pulse-glow">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🧲</div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                آفرین دانشمند باهوش! راز علمی رو کشف کردی! ⭐
              </h4>
              <p className="text-xs sm:text-sm text-emerald-50 font-medium mt-0.5">
                {level.scienceTip}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(740);
              onNextLevel();
            }}
            className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg shadow-xl transition transform hover:scale-105 active:scale-95"
          >
            مرحله بعدی ⬅
          </button>
        </div>
      )}
    </div>
  );
};

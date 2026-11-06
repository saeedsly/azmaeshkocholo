import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ChemistryLevel,
  ChemIngredientId,
  ChemVesselSpec,
} from '../../types/game';
import { CHEM_INGREDIENT_META } from '../../data/chemistryLevels';
import { soundEngine } from '../../utils/soundEngine';
import { getChemPourVoiceKey } from '../../utils/kidExplanations';
import { ReactionCanvasFX } from './ReactionCanvasFX';
import { VictoryStoryBanner } from '../VictoryStoryBanner';
import { RotateCcw, Sparkles, Volume2 } from 'lucide-react';

interface ChemistryLabProps {
  level: ChemistryLevel;
  onComplete: () => void;
  onNextLevel: () => void;
}

export const ChemistryLab: React.FC<ChemistryLabProps> = ({
  level,
  onComplete,
  onNextLevel,
}) => {
  const [vesselContents, setVesselContents] = useState<Record<string, ChemIngredientId[]>>({});
  const [selectedIng, setSelectedIng] = useState<ChemIngredientId | null>(null);
  const [pouringState, setPouringState] = useState<{
    vesselId: string;
    ing: ChemIngredientId;
  } | null>(null);
  const [completedOnce, setCompletedOnce] = useState(false);

  useEffect(() => {
    const init: Record<string, ChemIngredientId[]> = {};
    level.vessels.forEach((v) => {
      init[v.vesselId] = [];
    });
    setVesselContents(init);
    setSelectedIng(level.vessels[0]?.requiredIngredients[0] || level.availableIngredients[0] || null);
    setPouringState(null);
    setCompletedOnce(false);
  }, [level]);

  const isVesselComplete = (v: ChemVesselSpec, contents = vesselContents[v.vesselId] || []) =>
    v.requiredIngredients.every((req) => contents.includes(req));

  useEffect(() => {
    if (completedOnce) return;
    const allDone = level.vessels.every((v) =>
      isVesselComplete(v, vesselContents[v.vesselId] || [])
    );
    if (allDone && level.vessels.length > 0) {
      setCompletedOnce(true);
      soundEngine.playVictoryFanfare();
      confetti({
        particleCount: 115,
        spread: 88,
        origin: { y: 0.58 },
      });
      onComplete();
    }
  }, [vesselContents, level, completedOnce, onComplete]);

  // Find the very next missing ingredient across vessels to guide the 4-year-old!
  const getNextGuidedAction = (stateMap = vesselContents) => {
    for (const v of level.vessels) {
      const added = stateMap[v.vesselId] || [];
      const nextReq = v.requiredIngredients.find((r) => !added.includes(r));
      if (nextReq) {
        return { vessel: v, ing: nextReq };
      }
    }
    return null;
  };

  const nextAction = getNextGuidedAction();

  const speakNextChemStep = () => {
    if (!nextAction) return;
    const ingName = CHEM_INGREDIENT_META[nextAction.ing].name;
    soundEngine.speakPersian(
      `عزیزم، حالا ${ingName} رو بردار و بریز توی ${nextAction.vessel.label}!`,
      'chem_step_start'
    );
  };

  const addIngredientToVessel = (vessel: ChemVesselSpec, ing: ChemIngredientId) => {
    const current = vesselContents[vessel.vesselId] || [];
    if (current.includes(ing)) {
      soundEngine.playPop(350);
      return;
    }

    if (!vessel.requiredIngredients.includes(ing)) {
      soundEngine.playShortCircuitWarning();
      soundEngine.speakPersian(
        `عزیزم، این ماده مال یک شیشه دیگه است! دکمه‌های چشمک‌زن زیر شیشه رو نگاه کن!`,
        'chem_step_start'
      );
      return;
    }

    const meta = CHEM_INGREDIENT_META[ing];
    if (meta.kind === 'liquid') {
      soundEngine.playPourLiquid();
    } else {
      soundEngine.playPop(580);
    }

    setPouringState({ vesselId: vessel.vesselId, ing });
    setTimeout(() => {
      setPouringState((prev) => (prev?.vesselId === vessel.vesselId ? null : prev));
    }, 680);

    const updated = [...current, ing];
    const nextStateMap = {
      ...vesselContents,
      [vessel.vesselId]: updated,
    };
    setVesselContents(nextStateMap);

    const willFinishAllVessels = level.vessels.every((v) =>
      isVesselComplete(v, nextStateMap[v.vesselId] || [])
    );

    if (vessel.requiredIngredients.every((r) => updated.includes(r))) {
      if (
        vessel.resultEffect === 'foam_geyser' ||
        vessel.resultEffect === 'volcano_eruption' ||
        vessel.resultEffect === 'lava_lamp' ||
        vessel.resultEffect === 'balloon_inflate'
      ) {
        setTimeout(() => soundEngine.playFizzEruption(), 220);
      } else {
        setTimeout(() => soundEngine.playWireSpark(), 220);
      }
    }

    // If the level isn't finished yet, speak warm step encouragement for the next ingredient!
    const upcoming = getNextGuidedAction(nextStateMap);
    if (upcoming) {
      setSelectedIng(upcoming.ing);
      if (!willFinishAllVessels) {
        const pourClip = getChemPourVoiceKey(ing);
        const nextIngName = CHEM_INGREDIENT_META[upcoming.ing].name;
        setTimeout(() => {
          soundEngine.speakPersian(
            `آفرین! حالا ${nextIngName} رو بریز توی ${upcoming.vessel.label}!`,
            pourClip || 'chem_step_start'
          );
        }, 380);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Interactive Voice Step Coach Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-white/15 rounded-2xl px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={speakNextChemStep}
          className="flex items-center gap-2 text-xs sm:text-sm text-fuchsia-200 hover:text-white font-black text-right"
        >
          <span className="p-1.5 rounded-xl bg-fuchsia-400 text-slate-950 shadow">
            <Volume2 className="w-4 h-4" />
          </span>
          <span>
            {nextAction
              ? `🔊 بگو چیکار کنم: حالا «${CHEM_INGREDIENT_META[nextAction.ing].emoji} ${CHEM_INGREDIENT_META[nextAction.ing].name}» رو بریز توی «${nextAction.vessel.label}»!`
              : '🎉 همه واکنش‌ها کامل شد!'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playPop(420);
            const clean: Record<string, ChemIngredientId[]> = {};
            level.vessels.forEach((v) => (clean[v.vesselId] = []));
            setVesselContents(clean);
            setCompletedOnce(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 text-xs font-bold transition"
        >
          <RotateCcw className="w-4 h-4" />
          شستن شیشه‌ها و تکرار آزمایش
        </button>
      </div>

      {/* Main Gleaming Chemistry Laboratory Stage */}
      <div className="relative w-full min-h-[435px] rounded-[2rem] border-2 border-fuchsia-400/40 bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/80 shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Lab Tile Backdrop Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f0abfc 1px, transparent 1px), linear-gradient(to bottom, #f0abfc 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        {/* Polished Wooden Lab Bench Surface */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-amber-950 via-amber-900/75 to-transparent border-t-2 border-amber-500/40 pointer-events-none" />

        {/* Glassware Vessels Row */}
        <div className="relative z-10 flex flex-wrap items-end justify-center gap-8 sm:gap-14 my-auto pt-8 pb-4">
          {level.vessels.map((vessel) => {
            const added = vesselContents[vessel.vesselId] || [];
            const reacted = isVesselComplete(vessel, added);
            const fillRatio = Math.min(
              1,
              added.length / Math.max(1, vessel.requiredIngredients.length)
            );
            const isPouringHere = pouringState?.vesselId === vessel.vesselId;
            const currentColor = reacted
              ? vessel.resultColor
              : added.length > 0
              ? CHEM_INGREDIENT_META[added[added.length - 1]].color
              : '#38bdf8';

            return (
              <div
                key={vessel.vesselId}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const ing = e.dataTransfer.getData('chemIng') as ChemIngredientId;
                  if (ing) addIngredientToVessel(vessel, ing);
                }}
                onClick={() => {
                  if (selectedIng) {
                    addIngredientToVessel(vessel, selectedIng);
                  }
                }}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.03]"
              >
                {isPouringHere && pouringState && (
                  <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                    <span className="text-4xl drop-shadow-lg">
                      {CHEM_INGREDIENT_META[pouringState.ing].emoji}
                    </span>
                    <div
                      className="w-3 h-16 rounded-full opacity-90 shadow-lg"
                      style={{
                        backgroundColor: CHEM_INGREDIENT_META[pouringState.ing].color,
                      }}
                    />
                  </div>
                )}

                {reacted && (
                  <div className="mb-2 px-4 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-xl animate-bounce">
                    ✨ {vessel.reactionTitle}
                  </div>
                )}

                {/* Custom Glassware & Animated Fluid Reaction SVG */}
                <div className="relative w-48 h-60 flex items-end justify-center">
                  <ReactionCanvasFX
                    active={reacted}
                    effect={vessel.resultEffect}
                    primaryColor={vessel.resultColor}
                    secondaryColor={vessel.secondaryColor}
                  />

                  {reacted &&
                    (vessel.resultEffect === 'foam_geyser' ||
                      vessel.resultEffect === 'volcano_eruption') && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                        <div
                          className="w-22 h-26 rounded-full blur-[1px] animate-bounce shadow-2xl"
                          style={{
                            background: `radial-gradient(circle, ${
                              vessel.secondaryColor || '#fff'
                            } 20%, ${vessel.resultColor} 95%)`,
                          }}
                        />
                        <div className="flex gap-1 -mt-8">
                          {[0, 1, 2, 3, 4].map((b) => (
                            <span
                              key={b}
                              className="w-6 h-6 rounded-full animate-ping"
                              style={{
                                backgroundColor: vessel.secondaryColor || '#fde68a',
                                animationDelay: `${b * 0.14}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {vessel.shape === 'balloon_bottle' && (
                    <div
                      className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 flex flex-col items-center pointer-events-none"
                      style={{
                        transform: `translateX(-50%) scale(${reacted ? 1.45 : 0.42})`,
                      }}
                    >
                      <div
                        className="w-18 h-22 rounded-full shadow-2xl border-2 border-white/50 relative"
                        style={{
                          backgroundColor: vessel.secondaryColor || '#ec4899',
                        }}
                      >
                        {/* Glossy Balloon Highlight */}
                        <div className="w-4 h-7 rounded-full bg-white/40 absolute top-3 right-3 -rotate-12" />
                      </div>
                      <div
                        className="w-4 h-3 -mt-1 rounded-sm"
                        style={{
                          backgroundColor: vessel.secondaryColor || '#ec4899',
                        }}
                      />
                    </div>
                  )}

                  <svg viewBox="0 0 180 210" className="w-48 h-56 drop-shadow-2xl">
                    {vessel.shape === 'volcano' && (
                      <polygon
                        points="16,198 66,54 114,54 164,198"
                        fill="#78350f"
                        stroke="#b45309"
                        strokeWidth="4"
                      />
                    )}

                    <defs>
                      <clipPath id={`clip-${vessel.vesselId}`}>
                        {vessel.shape === 'bottle' || vessel.shape === 'balloon_bottle' ? (
                          <path d="M70,24 L110,24 L110,66 L144,104 L144,194 Q90,202 36,194 L36,104 L70,66 Z" />
                        ) : vessel.shape === 'flask' || vessel.shape === 'volcano' ? (
                          <path d="M70,38 L110,38 L110,74 L152,190 Q90,200 28,190 L70,74 Z" />
                        ) : vessel.shape === 'dish' ? (
                          <rect x="20" y="110" width="140" height="84" rx="26" />
                        ) : (
                          <rect x="34" y="38" width="112" height="158" rx="18" />
                        )}
                      </clipPath>
                    </defs>

                    <g clipPath={`url(#clip-${vessel.vesselId})`}>
                      <rect x="0" y="0" width="180" height="210" fill="rgba(255,255,255,0.09)" />

                      {fillRatio > 0 && (
                        <>
                          {reacted && vessel.resultEffect === 'density_layers' ? (
                            <>
                              <rect x="0" y="152" width="180" height="58" fill={vessel.resultColor} />
                              <rect x="0" y="112" width="180" height="40" fill="#3b82f6" />
                              <rect
                                x="0"
                                y="76"
                                width="180"
                                height="36"
                                fill={vessel.secondaryColor || '#facc15'}
                              />
                            </>
                          ) : reacted && vessel.resultEffect === 'lava_lamp' ? (
                            <>
                              <rect x="0" y="76" width="180" height="134" fill={vessel.secondaryColor || '#facc15'} />
                              <rect x="0" y="150" width="180" height="60" fill={vessel.resultColor} />
                              {[48, 76, 106, 128].map((cx, idx) => (
                                <circle
                                  key={cx}
                                  cx={cx}
                                  cy={100 + (idx % 2) * 28}
                                  r={9 + (idx % 3) * 3}
                                  fill={vessel.resultColor}
                                >
                                  <animate
                                    attributeName="cy"
                                    values="165;88;165"
                                    dur={`${1.6 + idx * 0.35}s`}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              ))}
                            </>
                          ) : reacted && vessel.resultEffect === 'water_filter' ? (
                            <>
                              <rect x="0" y="65" width="180" height="44" fill="#d6a85a" />
                              <rect x="0" y="109" width="180" height="18" fill="#ffffff" />
                              <rect x="0" y="148" width="180" height="62" fill="#38bdf8" />
                              <circle cx="90" cy="135" r="4" fill="#38bdf8">
                                <animate attributeName="cy" values="126;154" dur="0.7s" repeatCount="indefinite" />
                              </circle>
                            </>
                          ) : (
                            <rect
                              x="0"
                              y={200 - fillRatio * (vessel.shape === 'dish' ? 76 : 138)}
                              width="180"
                              height="160"
                              fill={currentColor}
                              className="transition-all duration-500"
                            />
                          )}

                          {reacted && vessel.resultEffect === 'dancing_raisins' &&
                            [56, 88, 118].map((cx, i) => (
                              <circle key={cx} cx={cx} cy="150" r="7" fill="#581c87" stroke="#fff" strokeWidth="1.5">
                                <animate
                                  attributeName="cy"
                                  values="182;95;182"
                                  dur={`${1.5 + i * 0.4}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                            ))}

                          {reacted && vessel.resultEffect === 'magic_milk' && (
                            <g>
                              <circle cx="90" cy="152" r="18" fill="none" stroke="#fde047" strokeWidth="5">
                                <animate attributeName="r" values="8;55" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle cx="90" cy="152" r="32" fill="none" stroke="#38bdf8" strokeWidth="4">
                                <animate attributeName="r" values="4;45" dur="1.2s" repeatCount="indefinite" />
                              </circle>
                            </g>
                          )}

                          {reacted && vessel.resultEffect === 'pepper_scatter' &&
                            [34, 42, 138, 146].map((cx, idx) => (
                              <circle key={idx} cx={cx} cy={135 + idx * 8} r="3.5" fill="#1e293b" />
                            ))}

                          {reacted &&
                            (vessel.resultEffect === 'crystal_sparkle' ||
                              vessel.resultEffect === 'foam_geyser') &&
                            [52, 75, 98, 122].map((cx, i) => (
                              <circle key={cx} cx={cx} cy={160 - i * 12} r="4" fill="#ffffff" opacity="0.85">
                                <animate
                                  attributeName="cy"
                                  values="185;75"
                                  dur={`${0.9 + i * 0.25}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                            ))}
                        </>
                      )}

                      {/* Specular Vertical Glass Reflection Strip */}
                      <rect x="46" y="36" width="8" height="145" rx="4" fill="rgba(255,255,255,0.22)" />
                    </g>

                    {vessel.shape === 'bottle' || vessel.shape === 'balloon_bottle' ? (
                      <path
                        d="M70,24 L110,24 L110,66 L144,104 L144,194 Q90,202 36,194 L36,104 L70,66 Z"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />
                    ) : vessel.shape === 'flask' ? (
                      <path
                        d="M70,38 L110,38 L110,74 L152,190 Q90,200 28,190 L70,74 Z"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />
                    ) : vessel.shape === 'dish' ? (
                      <rect
                        x="20"
                        y="110"
                        width="140"
                        height="84"
                        rx="26"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />
                    ) : vessel.shape !== 'volcano' ? (
                      <rect
                        x="34"
                        y="38"
                        width="112"
                        height="158"
                        rx="18"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />
                    ) : null}
                  </svg>
                </div>

                {/* Vessel Name & Pictorial Recipe Buttons with Bouncing Guiding Hand! */}
                <div className="mt-1 bg-slate-950/90 border-2 border-white/15 rounded-2xl px-3.5 py-2.5 flex flex-col items-center gap-1.5 shadow-xl">
                  <span className="text-xs font-black text-white">{vessel.label}</span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {vessel.requiredIngredients.map((reqId) => {
                      const done = added.includes(reqId);
                      const m = CHEM_INGREDIENT_META[reqId];
                      const isNextGuided =
                        nextAction?.vessel.vesselId === vessel.vesselId &&
                        nextAction?.ing === reqId;

                      return (
                        <button
                          key={reqId}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addIngredientToVessel(vessel, reqId);
                          }}
                          className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black transition ${
                            done
                              ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200'
                              : isNextGuided
                              ? 'bg-amber-400 text-slate-950 border-2 border-white shadow-lg scale-105'
                              : 'bg-slate-800 hover:bg-fuchsia-600/40 border border-dashed border-amber-300/70 text-amber-200'
                          }`}
                          title={`افزودن ${m.name}`}
                        >
                          {isNextGuided && (
                            <span className="absolute -top-5 -right-2 text-lg animate-bounce pointer-events-none">
                              👆
                            </span>
                          )}
                          <span>{m.emoji}</span>
                          <span>{m.name}</span>
                          {done && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Shelf OR Spoken Victory Story Banner */}
      {completedOnce ? (
        <VictoryStoryBanner level={level} onNextLevel={onNextLevel} />
      ) : (
        <div className="bg-slate-900/92 border-2 border-white/15 rounded-3xl p-3.5 flex flex-wrap items-center justify-center gap-3 shadow-xl">
          <div className="w-full text-center text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>روی دکمه زرد زیر هر شیشه بزن، یا بطری‌ها رو از پایین بکش داخل شیشه!</span>
          </div>
          {level.availableIngredients.map((ingId) => {
            const meta = CHEM_INGREDIENT_META[ingId];
            const isSelected = selectedIng === ingId;
            return (
              <div
                key={ingId}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('chemIng', ingId)}
                onClick={() => {
                  soundEngine.playPop(540);
                  setSelectedIng(ingId);
                  soundEngine.speakPersian(`${meta.name}! حالا بزن روی شیشه آزمایش!`);
                }}
                className={`cursor-grab active:cursor-grabbing flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 border-b-4 transition transform hover:-translate-y-1 shadow-lg ${
                  isSelected
                    ? 'bg-fuchsia-600/40 border-amber-300 ring-2 ring-amber-300/60 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 border-white/15'
                }`}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-inner"
                  style={{ backgroundColor: `${meta.color}33`, border: `2px solid ${meta.color}` }}
                >
                  {meta.emoji}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-black text-white">{meta.name}</span>
                  <span className="text-[10px] text-amber-300 font-bold">بکش و بریز 🧪</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

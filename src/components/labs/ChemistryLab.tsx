import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ChemistryLevel,
  ChemIngredientId,
  ChemVesselSpec,
} from '../../types/game';
import { CHEM_INGREDIENT_META } from '../../data/chemistryLevels';
import { soundEngine } from '../../utils/soundEngine';
import { ReactionCanvasFX } from './ReactionCanvasFX';
import { FlaskConical, RotateCcw, Sparkles } from 'lucide-react';

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
    setSelectedIng(level.availableIngredients[0] || null);
    setPouringState(null);
    setCompletedOnce(false);
  }, [level]);

  const isVesselComplete = (v: ChemVesselSpec, contents = vesselContents[v.vesselId] || []) =>
    v.requiredIngredients.every((req) => contents.includes(req));

  // Check if all vessels completed!
  useEffect(() => {
    if (completedOnce) return;
    const allDone = level.vessels.every((v) =>
      isVesselComplete(v, vesselContents[v.vesselId] || [])
    );
    if (allDone && level.vessels.length > 0) {
      setCompletedOnce(true);
      soundEngine.playVictoryFanfare();
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
      });
      onComplete();
    }
  }, [vesselContents, level, completedOnce, onComplete]);

  const addIngredientToVessel = (vessel: ChemVesselSpec, ing: ChemIngredientId) => {
    const current = vesselContents[vessel.vesselId] || [];
    if (current.includes(ing)) {
      soundEngine.playPop(350);
      return;
    }

    // Check if this ingredient belongs in this vessel so a 4-year-old doesn't ruin the potion!
    if (!vessel.requiredIngredients.includes(ing)) {
      soundEngine.playShortCircuitWarning();
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
    }, 650);

    const updated = [...current, ing];
    setVesselContents((prev) => ({
      ...prev,
      [vessel.vesselId]: updated,
    }));

    // Trigger dramatic reaction sound if this completed the vessel!
    if (vessel.requiredIngredients.every((r) => updated.includes(r))) {
      if (
        vessel.resultEffect === 'foam_geyser' ||
        vessel.resultEffect === 'volcano_eruption' ||
        vessel.resultEffect === 'lava_lamp' ||
        vessel.resultEffect === 'balloon_inflate'
      ) {
        setTimeout(() => soundEngine.playFizzEruption(), 250);
      } else {
        setTimeout(() => soundEngine.playWireSpark(), 250);
      }
    }

    // Auto-select next needed ingredient for effortless 4-year-old play!
    const nextMissing = vessel.requiredIngredients.find((r) => !updated.includes(r));
    if (nextMissing) {
      setSelectedIng(nextMissing);
    } else {
      // Check other vessels
      for (const other of level.vessels) {
        if (other.vesselId === vessel.vesselId) continue;
        const otherCur = vesselContents[other.vesselId] || [];
        const m = other.requiredIngredients.find((r) => !otherCur.includes(r));
        if (m) {
          setSelectedIng(m);
          break;
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-fuchsia-200 font-bold">
          <FlaskConical className="w-5 h-5 text-fuchsia-400 animate-bounce" />
          <span>
            {selectedIng
              ? `ماده انتخاب‌شده: «${CHEM_INGREDIENT_META[selectedIng].emoji} ${CHEM_INGREDIENT_META[selectedIng].name}» — روی شیشه مورد نظر کلیک کن یا بکش و بریز داخلش!`
              : 'یک ماده از قفسه پایین بردار و داخل شیشه آزمایش بریز!'}
          </span>
        </div>

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

      {/* Main Chemistry Laboratory Table */}
      <div className="relative w-full min-h-[420px] rounded-3xl border-2 border-fuchsia-400/30 bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/70 shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
        {/* Ambient Lab Shelf Sparkles */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-900/80 to-transparent border-t border-amber-500/30 pointer-events-none" />

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
                {/* Pouring Stream Animation */}
                {isPouringHere && pouringState && (
                  <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                    <span className="text-4xl drop-shadow-lg">
                      {CHEM_INGREDIENT_META[pouringState.ing].emoji}
                    </span>
                    <div
                      className="w-2.5 h-16 rounded-full opacity-90"
                      style={{
                        backgroundColor: CHEM_INGREDIENT_META[pouringState.ing].color,
                      }}
                    />
                  </div>
                )}

                {/* Reaction Title Badge */}
                {reacted && (
                  <div className="mb-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-lg animate-bounce">
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
                  {/* FOAM GEYSER / VOLCANO ERUPTION PLUME! */}
                  {reacted &&
                    (vessel.resultEffect === 'foam_geyser' ||
                      vessel.resultEffect === 'volcano_eruption') && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                        <div
                          className="w-20 h-24 rounded-full blur-[1px] animate-bounce shadow-2xl"
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

                  {/* INFLATING BALLOON ON TOP OF BOTTLE! */}
                  {vessel.shape === 'balloon_bottle' && (
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 flex flex-col items-center pointer-events-none"
                      style={{
                        transform: `translateX(-50%) scale(${reacted ? 1.35 : 0.42})`,
                      }}
                    >
                      <div
                        className="w-16 h-20 rounded-full shadow-xl border-2 border-white/40"
                        style={{
                          backgroundColor: vessel.secondaryColor || '#ec4899',
                        }}
                      />
                      <div
                        className="w-4 h-3 -mt-1 rounded-sm"
                        style={{
                          backgroundColor: vessel.secondaryColor || '#ec4899',
                        }}
                      />
                    </div>
                  )}

                  <svg viewBox="0 0 180 210" className="w-48 h-56 drop-shadow-2xl">
                    {/* Volcano Cone Exterior if shape === 'volcano' */}
                    {vessel.shape === 'volcano' && (
                      <polygon
                        points="16,198 66,54 114,54 164,198"
                        fill="#78350f"
                        stroke="#b45309"
                        strokeWidth="4"
                      />
                    )}

                    {/* Glass Clip Path */}
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

                    {/* Liquid Content inside ClipPath */}
                    <g clipPath={`url(#clip-${vessel.vesselId})`}>
                      <rect x="0" y="0" width="180" height="210" fill="rgba(255,255,255,0.07)" />

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

                          {/* Dancing Raisins / Rising Bubbles / Magic Milk Rings / Crystals */}
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
                    </g>

                    {/* Crisp Glossy Glassware Rim & Reflections */}
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

                {/* Vessel Name & Pictorial Recipe Checklist for 4-Year-Olds! */}
                <div className="mt-1 bg-slate-950/85 border border-white/15 rounded-2xl px-3.5 py-2 flex flex-col items-center gap-1.5 shadow-xl">
                  <span className="text-xs font-black text-white">{vessel.label}</span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {vessel.requiredIngredients.map((reqId) => {
                      const done = added.includes(reqId);
                      const m = CHEM_INGREDIENT_META[reqId];
                      return (
                        <button
                          key={reqId}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addIngredientToVessel(vessel, reqId);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition ${
                            done
                              ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-200'
                              : 'bg-slate-800 hover:bg-fuchsia-600/40 border border-dashed border-amber-300/70 text-amber-200 animate-pulse'
                          }`}
                          title={`افزودن ${m.name}`}
                        >
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

      {/* Bottom Ingredient Bottles Shelf OR Victory Banner */}
      {completedOnce ? (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 border-2 border-amber-300 rounded-3xl p-4 shadow-2xl animate-pulse-glow">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🧪</div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                هورااا! عجب واکنش شیمیایی باحالی ساختی! ⭐
              </h4>
              <p className="text-xs sm:text-sm text-fuchsia-100 font-medium mt-0.5">
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
      ) : (
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-3.5 flex flex-wrap items-center justify-center gap-3">
          <div className="w-full text-center text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>قفسه مواد آزمایشگاهی — هر بطری را بکش داخل شیشه یا مستقیم روی دکمه‌های زیر هر شیشه بزن!</span>
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
                }}
                className={`cursor-grab active:cursor-grabbing flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition transform hover:-translate-y-1 shadow-lg ${
                  isSelected
                    ? 'bg-fuchsia-600/35 border-amber-300 ring-2 ring-amber-300/60 scale-105'
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

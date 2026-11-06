import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ElectricLevel,
  ElectricPartKind,
  ElectricSlotSpec,
} from '../../types/game';
import {
  ElectricPartGraphic,
  PART_NAMES_FA,
  APPLIANCE_META,
} from './ElectricPartsArt';
import { soundEngine } from '../../utils/soundEngine';
import { Lightbulb, RotateCcw, Sparkles, Zap, Plug, AlertTriangle } from 'lucide-react';

interface WireEdge {
  id: string;
  fromNode: string; // `${slotId}:${termId}`
  toNode: string;
  color: string;
}

interface TermDef {
  id: string;
  label: string;
  side: 'left' | 'right' | 'bottom';
  colorHex: string;
}

const SOURCE_KINDS = new Set<ElectricPartKind>([
  'aa_battery',
  'battery_9v',
  'dual_battery',
  'solar_panel',
  'hand_dynamo',
  'mcb_breaker',
]);

const LOAD_KINDS = new Set<ElectricPartKind>([
  'armature',
  'fan',
  'bulb_warm',
  'bulb_red',
  'bulb_green',
  'bulb_blue',
  'led_disco',
  'buzzer',
  'siren',
  'toy_car',
  'electromagnet',
  'crane_winch',
  'robot_buddy',
  'wall_outlet',
  'ceiling_lamp',
  'chandelier_dual',
  'exhaust_fan',
  'doorbell_chime',
]);

function getTerminalsForPart(kind: ElectricPartKind): TermDef[] {
  if (SOURCE_KINDS.has(kind)) {
    const isWall = kind === 'mcb_breaker';
    return [
      { id: 'pos', label: isWall ? 'فاز +' : '+', side: 'right', colorHex: '#ef4444' },
      { id: 'neg', label: isWall ? 'نول −' : '−', side: 'left', colorHex: '#3b82f6' },
    ];
  }
  if (kind === 'wall_switch_2') {
    return [
      { id: 'in', label: 'فاز', side: 'left', colorHex: '#ef4444' },
      { id: 'out', label: 'پل ۱', side: 'right', colorHex: '#f59e0b' },
      { id: 'out2', label: 'پل ۲', side: 'bottom', colorHex: '#a855f7' },
    ];
  }
  if (kind === 'wall_outlet') {
    return [
      { id: 'in', label: 'فاز', side: 'left', colorHex: '#ef4444' },
      { id: 'out', label: 'نول', side: 'right', colorHex: '#3b82f6' },
    ];
  }
  return [
    { id: 'in', label: 'ورود', side: 'left', colorHex: '#ef4444' },
    { id: 'out', label: 'خروج', side: 'right', colorHex: '#3b82f6' },
  ];
}

interface ElectricLabProps {
  level: ElectricLevel;
  onComplete: () => void;
  onNextLevel: () => void;
}

export const ElectricLab: React.FC<ElectricLabProps> = ({
  level,
  onComplete,
  onNextLevel,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [placedSlots, setPlacedSlots] = useState<Record<string, boolean>>({});
  const [wires, setWires] = useState<WireEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  const [switch1Map, setSwitch1Map] = useState<Record<string, boolean>>({});
  const [switch2Map, setSwitch2Map] = useState<Record<string, boolean>>({});
  const [dimmerMap, setDimmerMap] = useState<Record<string, number>>({});
  const [nightMap, setNightMap] = useState<Record<string, boolean>>({});
  const [pluggedIn, setPluggedIn] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedOnce, setCompletedOnce] = useState<boolean>(false);

  useEffect(() => {
    const initialPlaced: Record<string, boolean> = {};
    const initSw1: Record<string, boolean> = {};
    const initSw2: Record<string, boolean> = {};
    const initDim: Record<string, number> = {};
    const initNight: Record<string, boolean> = {};

    level.slots.forEach((s) => {
      initialPlaced[s.slotId] = Boolean(s.prePlaced);
      if (s.partKind === 'mcb_breaker') {
        initSw1[s.slotId] = false;
      } else if (s.partKind === 'stair_switch_a') {
        initSw1[s.slotId] = true;
      } else if (s.partKind === 'stair_switch_b') {
        initSw1[s.slotId] = false;
      } else {
        initSw1[s.slotId] = !level.requiresSwitchToggle;
      }
      initSw2[s.slotId] = false;
      initDim[s.slotId] = level.requiresSwitchToggle ? 0 : 2;
      initNight[s.slotId] = !level.requiresSwitchToggle;
    });

    setPlacedSlots(initialPlaced);
    setWires([]);
    setSelectedNode(null);
    setPointerPos(null);
    setSwitch1Map(initSw1);
    setSwitch2Map(initSw2);
    setDimmerMap(initDim);
    setNightMap(initNight);
    setPluggedIn(false);
    setShowHint(level.number <= 3); // Auto visual guide on first 3 levels for 4yo!
    setCompletedOnce(false);
  }, [level]);

  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number; color: string; slotId: string; termId: string }> = {};
    level.slots.forEach((slot) => {
      const terms = getTerminalsForPart(slot.partKind);
      terms.forEach((t) => {
        const dx = t.side === 'left' ? -8.5 : t.side === 'right' ? 8.5 : 0;
        const dy = t.side === 'bottom' ? 11.5 : 0;
        map[`${slot.slotId}:${t.id}`] = {
          x: Math.max(4, Math.min(96, slot.x + dx)),
          y: Math.max(8, Math.min(92, slot.y + dy)),
          color: t.colorHex,
          slotId: slot.slotId,
          termId: t.id,
        };
      });
    });
    return map;
  }, [level]);

  // Real DFS Simple-Path Circuit Solver
  const simulation = useMemo(() => {
    const poweredLoads = new Set<string>();
    const activeWires = new Set<string>();
    let shortCircuit = false;

    interface AdjEdge {
      to: string;
      edgeKind: 'wire' | 'switch' | 'load';
      refId: string;
    }
    const adj: Record<string, AdjEdge[]> = {};
    const addEdge = (u: string, v: string, edgeKind: AdjEdge['edgeKind'], refId: string) => {
      if (!adj[u]) adj[u] = [];
      if (!adj[v]) adj[v] = [];
      adj[u].push({ to: v, edgeKind, refId });
      adj[v].push({ to: u, edgeKind, refId });
    };

    wires.forEach((w) => {
      const s1 = w.fromNode.split(':')[0];
      const s2 = w.toNode.split(':')[0];
      if (placedSlots[s1] && placedSlots[s2]) {
        addEdge(w.fromNode, w.toNode, 'wire', w.id);
      }
    });

    const stairA = level.slots.find((s) => s.partKind === 'stair_switch_a');
    const stairB = level.slots.find((s) => s.partKind === 'stair_switch_b');

    level.slots.forEach((slot) => {
      if (!placedSlots[slot.slotId]) return;
      const k = slot.partKind;
      if (SOURCE_KINDS.has(k)) return;

      if (LOAD_KINDS.has(k)) {
        addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'load', slot.slotId);
        return;
      }

      if (k === 'junction_box' || k === 'fuse_box') {
        addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
      } else if (k === 'push_button' || k === 'toggle_switch' || k === 'wall_switch_1') {
        if (switch1Map[slot.slotId]) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
      } else if (k === 'wall_switch_2') {
        if (switch1Map[slot.slotId]) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
        if (switch2Map[slot.slotId]) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out2`, 'switch', slot.slotId);
        }
      } else if (k === 'dimmer_knob') {
        if ((dimmerMap[slot.slotId] ?? 0) > 0) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
      } else if (k === 'light_sensor') {
        if (nightMap[slot.slotId]) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
      } else if (k === 'stair_switch_a') {
        const conducts = stairB
          ? switch1Map[slot.slotId] === switch1Map[stairB.slotId]
          : switch1Map[slot.slotId];
        if (conducts) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
      } else if (k === 'stair_switch_b') {
        const conducts = stairA
          ? switch1Map[stairA.slotId] === switch1Map[slot.slotId]
          : switch1Map[slot.slotId];
        if (conducts) {
          addEdge(`${slot.slotId}:in`, `${slot.slotId}:out`, 'switch', slot.slotId);
        }
      }
    });

    level.slots.forEach((srcSlot) => {
      if (!placedSlots[srcSlot.slotId]) return;
      if (!SOURCE_KINDS.has(srcSlot.partKind)) return;
      if (srcSlot.partKind === 'mcb_breaker' && !switch1Map[srcSlot.slotId]) return;

      const startNode = `${srcSlot.slotId}:pos`;
      const endNode = `${srcSlot.slotId}:neg`;

      const visited = new Set<string>([startNode]);
      const pathLoads: string[] = [];
      const pathWires: string[] = [];

      const dfs = (curr: string) => {
        if (curr === endNode) {
          if (pathLoads.length === 0) {
            shortCircuit = true;
          } else {
            pathLoads.forEach((l) => poweredLoads.add(l));
            pathWires.forEach((w) => activeWires.add(w));
          }
          return;
        }
        const neighbors = adj[curr] || [];
        for (const edge of neighbors) {
          if (visited.has(edge.to)) continue;
          visited.add(edge.to);
          if (edge.edgeKind === 'load') pathLoads.push(edge.refId);
          if (edge.edgeKind === 'wire') pathWires.push(edge.refId);

          dfs(edge.to);

          if (edge.edgeKind === 'load') pathLoads.pop();
          if (edge.edgeKind === 'wire') pathWires.pop();
          visited.delete(edge.to);
        }
      };

      dfs(startNode);
    });

    if (shortCircuit) {
      poweredLoads.clear();
      activeWires.clear();
    }

    return { poweredLoads, activeWires, shortCircuit };
  }, [level, placedSlots, wires, switch1Map, switch2Map, dimmerMap, nightMap]);

  useEffect(() => {
    if (completedOnce) return;
    if (simulation.shortCircuit) return;

    const allTargetsPowered = level.targetLoads.every((id) =>
      simulation.poweredLoads.has(id)
    );
    const applianceOk = !level.pluggableAppliance || pluggedIn;

    if (allTargetsPowered && applianceOk) {
      setCompletedOnce(true);
      soundEngine.playVictoryFanfare();

      const hasBell = level.slots.some(
        (s) => s.partKind === 'buzzer' || s.partKind === 'doorbell_chime'
      );
      const hasMotor = level.slots.some(
        (s) => s.partKind === 'armature' || s.partKind === 'fan' || s.partKind === 'toy_car'
      );
      if (hasBell) soundEngine.playDoorbell();
      else if (hasMotor) soundEngine.playMotorWhir();

      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
      });
      onComplete();
    }
  }, [simulation, pluggedIn, level, completedOnce, onComplete]);

  useEffect(() => {
    if (simulation.shortCircuit) {
      soundEngine.playShortCircuitWarning();
    }
  }, [simulation.shortCircuit]);

  const placeSlotPart = (slot: ElectricSlotSpec) => {
    if (placedSlots[slot.slotId]) return;
    soundEngine.playSnap();
    setPlacedSlots((prev) => ({ ...prev, [slot.slotId]: true }));
  };

  const connectNodes = (nodeA: string, nodeB: string, preferredColor?: string) => {
    if (nodeA === nodeB) return;
    const slotA = nodeA.split(':')[0];
    const slotB = nodeB.split(':')[0];
    if (slotA === slotB) return;

    const exists = wires.some(
      (w) =>
        (w.fromNode === nodeA && w.toNode === nodeB) ||
        (w.fromNode === nodeB && w.toNode === nodeA)
    );
    if (exists) return;

    const infoA = nodePositions[nodeA];
    const infoB = nodePositions[nodeB];
    let color = preferredColor || '#f59e0b';
    if (!preferredColor) {
      if (infoA?.termId === 'neg' || infoB?.termId === 'neg') {
        color = '#3b82f6';
      } else if (infoA?.termId === 'pos' || infoB?.termId === 'pos') {
        color = '#ef4444';
      } else if (infoA?.termId === 'out2' || infoB?.termId === 'out2') {
        color = '#a855f7';
      }
    }

    soundEngine.playWireSpark();
    setWires((prev) => [
      ...prev,
      {
        id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fromNode: nodeA,
        toNode: nodeB,
        color,
      },
    ]);
  };

  const handleTerminalClick = (nodeKey: string) => {
    if (!selectedNode) {
      soundEngine.playPop(600);
      setSelectedNode(nodeKey);
    } else if (selectedNode === nodeKey) {
      setSelectedNode(null);
    } else {
      connectNodes(selectedNode, nodeKey);
      setSelectedNode(null);
      setPointerPos(null);
    }
  };

  const handleBoardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!selectedNode || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointerPos({ x, y });
  };

  const handleInteractPart = (
    slot: ElectricSlotSpec,
    sub?: 'sw1' | 'sw2' | 'dimmer' | 'sensor' | 'crank'
  ) => {
    if (sub === 'sw2') {
      setSwitch2Map((prev) => {
        const next = !prev[slot.slotId];
        soundEngine.playSwitchClick(next);
        return { ...prev, [slot.slotId]: next };
      });
      return;
    }
    if (sub === 'dimmer') {
      setDimmerMap((prev) => {
        const next = ((prev[slot.slotId] ?? 0) + 1) % 4;
        soundEngine.playSwitchClick(next > 0);
        return { ...prev, [slot.slotId]: next };
      });
      return;
    }
    if (sub === 'sensor') {
      setNightMap((prev) => {
        const next = !prev[slot.slotId];
        soundEngine.playSwitchClick(next);
        return { ...prev, [slot.slotId]: next };
      });
      return;
    }
    setSwitch1Map((prev) => {
      const next = !prev[slot.slotId];
      soundEngine.playSwitchClick(next);
      return { ...prev, [slot.slotId]: next };
    });
  };

  const nextHintWire = useMemo(() => {
    for (const hw of level.hintWires) {
      if (!placedSlots[hw.fromSlot] || !placedSlots[hw.toSlot]) continue;
      const n1 = `${hw.fromSlot}:${hw.fromTerm}`;
      const n2 = `${hw.toSlot}:${hw.toTerm}`;
      const found = wires.some(
        (w) =>
          (w.fromNode === n1 && w.toNode === n2) ||
          (w.fromNode === n2 && w.toNode === n1)
      );
      if (!found) return { n1, n2, color: hw.wireColor || '#ef4444' };
    }
    return null;
  }, [level.hintWires, wires, placedSlots]);

  const unplacedSlots = level.slots.filter((s) => !placedSlots[s.slotId]);
  const anyOutletPowered = level.slots.some(
    (s) => s.partKind === 'wall_outlet' && simulation.poweredLoads.has(s.slotId)
  );

  const makeWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const sag = Math.min(18, Math.abs(x2 - x1) * 0.22 + 6);
    return `M ${x1} ${y1} Q ${midX} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;
  };

  const boardBgClass =
    level.boardTheme === 'wall'
      ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-sky-400/35'
      : level.boardTheme === 'tech'
      ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border-cyan-400/35'
      : 'bg-gradient-to-br from-amber-950/95 via-stone-900 to-amber-950 border-amber-400/45';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200 font-bold">
          <Zap className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
          <span>
            {unplacedSlots.length > 0
              ? `قدم اول: قطعات پایین را بردار و بگذار روی میز (${level.slots.length - unplacedSlots.length} از ${level.slots.length})`
              : selectedNode
              ? 'حالا دایره رنگی قطعه دوم را لمس کن تا سیم وصل شود!'
              : nextHintWire
              ? 'قدم دوم: قرقره سیم را بردار یا دایره‌های رنگی قطعات را به هم وصل کن!'
              : level.pluggableAppliance && !pluggedIn
              ? 'قدم آخر: فیوز را روشن کن و دوشاخه وسیله برقی را بزن به پریز!'
              : 'حالا کلید یا فیوز را روشن کن تا سیستم به کار بیفتد!'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {unplacedSlots.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSnap();
                const all: Record<string, boolean> = {};
                level.slots.forEach((s) => (all[s.slotId] = true));
                setPlacedSlots(all);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition"
            >
              <Sparkles className="w-4 h-4" />
              چیدن قطعات
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(700);
              setShowHint((h) => !h);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              showHint
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-amber-500/20 hover:bg-amber-500/35 border-amber-400/40 text-amber-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            راهنما
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop(400);
              setWires([]);
              setSelectedNode(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" />
            باز کردن سیم‌ها
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit / Wall Workbench */}
      <div
        ref={boardRef}
        onPointerMove={handleBoardPointerMove}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const wireDrop = e.dataTransfer.getData('wireSpool');
          if (wireDrop && nextHintWire) {
            connectNodes(nextHintWire.n1, nextHintWire.n2, nextHintWire.color);
          }
        }}
        onClick={() => {
          if (selectedNode) {
            setSelectedNode(null);
            setPointerPos(null);
          }
        }}
        className={`relative w-full h-[430px] sm:h-[460px] rounded-3xl border-2 shadow-2xl overflow-hidden select-none ${boardBgClass}`}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              level.boardTheme === 'wall'
                ? 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)'
                : 'radial-gradient(#fde68a 1.5px, transparent 1.5px)',
            backgroundSize: level.boardTheme === 'wall' ? '48px 48px' : '26px 26px',
          }}
        />

        {level.boardTheme === 'wall' && (
          <div className="absolute top-2.5 right-4 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-[11px] font-bold text-sky-200 pointer-events-none">
            🏠 دیوار تمرین برق‌کشی ساختمان (قرمز = فاز | آبی = نول)
          </div>
        )}

        {simulation.shortCircuit && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-rose-600/95 border-2 border-amber-300 text-white px-4 py-2 rounded-2xl shadow-xl animate-bounce">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span className="text-xs sm:text-sm font-black">
              آخ! اتصال کوتاه شد! روی سیم اشتباه کلیک کن تا باز بشه!
            </span>
          </div>
        )}

        {/* SVG Flexible Physics Wires Layer */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        >
          {showHint && nextHintWire && nodePositions[nextHintWire.n1] && nodePositions[nextHintWire.n2] && (
            <path
              d={makeWirePath(
                nodePositions[nextHintWire.n1].x,
                nodePositions[nextHintWire.n1].y,
                nodePositions[nextHintWire.n2].x,
                nodePositions[nextHintWire.n2].y
              )}
              fill="none"
              stroke="#fde047"
              strokeWidth="1.2"
              strokeDasharray="2.2 1.8"
              className="animate-pulse"
            />
          )}

          {wires.map((w) => {
            const p1 = nodePositions[w.fromNode];
            const p2 = nodePositions[w.toNode];
            if (!p1 || !p2) return null;
            const d = makeWirePath(p1.x, p1.y, p2.x, p2.y);
            const isFlowing = simulation.activeWires.has(w.id);

            return (
              <g
                key={w.id}
                className="pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playPop(340);
                  setWires((prev) => prev.filter((item) => item.id !== w.id));
                }}
              >
                <path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" />
                <path d={d} fill="none" stroke={w.color} strokeWidth="1.5" strokeLinecap="round" />
                {isFlowing && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="0.85"
                    strokeDasharray="1.4 2.4"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="12"
                      to="0"
                      dur="0.6s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </g>
            );
          })}

          {selectedNode && pointerPos && nodePositions[selectedNode] && (
            <path
              d={makeWirePath(
                nodePositions[selectedNode].x,
                nodePositions[selectedNode].y,
                pointerPos.x,
                pointerPos.y
              )}
              fill="none"
              stroke="#fde047"
              strokeWidth="1.25"
              strokeDasharray="1.6 1.2"
            />
          )}
        </svg>

        {/* Workbench Component Slots */}
        {level.slots.map((slot) => {
          const isPlaced = placedSlots[slot.slotId];
          const isPowered = simulation.poweredLoads.has(slot.slotId);
          const terms = getTerminalsForPart(slot.partKind);
          const label = slot.customLabel || PART_NAMES_FA[slot.partKind];

          return (
            <div
              key={slot.slotId}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedKind = e.dataTransfer.getData('partKind');
                if (draggedKind && draggedKind === slot.partKind) {
                  placeSlotPart(slot);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPlaced) {
                  placeSlotPart(slot);
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-200 ${
                !isPlaced ? 'cursor-pointer hover:scale-105' : ''
              }`}
            >
              {!isPlaced ? (
                <div className="w-32 h-26 rounded-2xl border-2 border-dashed border-amber-300/75 bg-slate-900/65 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center animate-pulse shadow-lg">
                  <span className="text-xs font-extrabold text-amber-300">{label}</span>
                  <span className="text-[10px] text-slate-300 mt-1">اینجا بگذار 👇</span>
                </div>
              ) : (
                <div
                  className={`relative rounded-2xl px-3 py-2 backdrop-blur-md border-2 transition-all ${
                    isPowered
                      ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_32px_rgba(250,204,21,0.42)]'
                      : 'bg-slate-900/85 border-white/20 shadow-xl'
                  }`}
                >
                  <ElectricPartGraphic
                    kind={slot.partKind}
                    powered={isPowered}
                    switchOn={switch1Map[slot.slotId]}
                    switch2On={switch2Map[slot.slotId]}
                    dimmerLevel={dimmerMap[slot.slotId]}
                    nightMode={nightMap[slot.slotId]}
                    pluggedIn={pluggedIn}
                    onInteract={(sub) => handleInteractPart(slot, sub)}
                  />
                  <div className="text-[11px] font-extrabold text-center text-white/95 mt-0.5 whitespace-nowrap">
                    {label}
                  </div>

                  {terms.map((t) => {
                    const nodeKey = `${slot.slotId}:${t.id}`;
                    const isSelected = selectedNode === nodeKey;
                    const isHintEndpoint =
                      showHint &&
                      nextHintWire &&
                      (nextHintWire.n1 === nodeKey || nextHintWire.n2 === nodeKey);

                    const posClass =
                      t.side === 'left'
                        ? '-left-4 top-1/2 -translate-y-1/2'
                        : t.side === 'right'
                        ? '-right-4 top-1/2 -translate-y-1/2'
                        : 'left-1/2 -bottom-4 -translate-x-1/2';

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          handleTerminalClick(nodeKey);
                        }}
                        onPointerUp={(e) => {
                          e.stopPropagation();
                          if (selectedNode && selectedNode !== nodeKey) {
                            connectNodes(selectedNode, nodeKey);
                            setSelectedNode(null);
                            setPointerPos(null);
                          }
                        }}
                        style={{ backgroundColor: t.colorHex }}
                        className={`absolute ${posClass} w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-black text-white transition-transform hover:scale-125 focus:outline-none ${
                          isSelected
                            ? 'ring-4 ring-yellow-300 scale-125'
                            : isHintEndpoint
                            ? 'ring-4 ring-yellow-300 animate-pulse'
                            : ''
                        }`}
                        title={`اتصال سیم (${t.label})`}
                      >
                        {t.id === 'pos' ? '+' : t.id === 'neg' ? '−' : '●'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Pluggable Household Appliance Widget */}
        {level.pluggableAppliance && (
          <div className="absolute bottom-3 left-3 z-20 bg-slate-950/95 border-2 border-cyan-400/50 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform ${
                pluggedIn && anyOutletPowered
                  ? 'bg-amber-400/30 scale-110 animate-bounce shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                  : 'bg-slate-800'
              }`}
            >
              {APPLIANCE_META[level.pluggableAppliance].emoji}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white">
                {APPLIANCE_META[level.pluggableAppliance].name}
              </span>
              <span className="text-[11px] text-cyan-300">
                {pluggedIn && anyOutletPowered
                  ? APPLIANCE_META[level.pluggableAppliance].activeText
                  : pluggedIn
                  ? 'دوشاخه وصله! حالا برق پریز/فیوز رو وصل کن'
                  : 'دوشاخه رو بزن به پریز دیوار!'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playSnap();
                  setPluggedIn((p) => !p);
                }}
                className={`mt-1.5 flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition ${
                  pluggedIn
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse'
                }`}
              >
                <Plug className="w-4 h-4" />
                {pluggedIn ? 'دوشاخه داخل پریز است ✓' : 'زدن دوشاخه به پریز 🔌'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tray: Pick up Parts + Pick up Wire Spools! OR Victory Next-Level Banner */}
      {completedOnce ? (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 border-2 border-amber-300 rounded-3xl p-4 shadow-2xl animate-pulse-glow">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                آفرین دانشمند کوچولو! سیستم به کار افتاد! ⭐
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
      ) : (
        <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-3.5 flex flex-wrap items-center justify-center gap-3 min-h-[96px]">
          {/* Unplaced Components in Tray */}
          {unplacedSlots.map((slot) => (
            <div
              key={slot.slotId}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('partKind', slot.partKind)}
              onClick={() => placeSlotPart(slot)}
              className="cursor-grab active:cursor-grabbing group flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border-2 border-amber-400/60 hover:border-amber-300 rounded-2xl px-3.5 py-2 shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="scale-75 -m-3 pointer-events-none">
                <ElectricPartGraphic kind={slot.partKind} powered={false} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">
                  {slot.customLabel || PART_NAMES_FA[slot.partKind]}
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  بردار و بگذار بالا ☝️
                </span>
              </div>
            </div>
          ))}

          {/* Tactile Wire Spool Item! Kid can either pick up this Wire Spool OR connect terminals manually */}
          {unplacedSlots.length === 0 && nextHintWire && (
            <div
              draggable
              onDragStart={(e) => e.dataTransfer.setData('wireSpool', 'next')}
              onClick={() => connectNodes(nextHintWire.n1, nextHintWire.n2, nextHintWire.color)}
              className="cursor-grab active:cursor-grabbing flex items-center gap-3 bg-gradient-to-l from-red-500/25 via-slate-800 to-blue-500/25 hover:from-red-500/40 hover:to-blue-500/40 border-2 border-amber-300 rounded-2xl px-5 py-2.5 shadow-xl transition transform hover:-translate-y-1"
            >
              <svg viewBox="0 0 64 54" className="w-12 h-11 drop-shadow">
                <rect x="10" y="6" width="44" height="8" rx="4" fill="#cbd5e1" />
                <rect x="10" y="40" width="44" height="8" rx="4" fill="#cbd5e1" />
                <rect x="16" y="14" width="32" height="26" rx="4" fill={nextHintWire.color} />
                <line x1="16" y1="22" x2="48" y2="22" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
                <line x1="16" y1="31" x2="48" y2="31" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
              </svg>
              <div className="flex flex-col text-right">
                <span className="text-xs sm:text-sm font-black text-white">
                  برداشتن سیم رابط و اتصال 🔌
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  کلیک کن یا بکش روی میز (یا دایره‌های رنگی قطعات رو به هم وصل کن!)
                </span>
              </div>
            </div>
          )}

          {unplacedSlots.length === 0 && !nextHintWire && (
            <div className="flex items-center gap-2 text-emerald-300 font-black text-xs sm:text-sm animate-bounce">
              <span>⚡</span>
              <span>
                سیم‌کشی کامله! حالا کلید / فیوز / دوشاخه روی میز رو بزن تا مدار روشن بشه!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

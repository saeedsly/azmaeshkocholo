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
import { VictoryStoryBanner } from '../VictoryStoryBanner';
import { getPartVoiceClipKey } from '../../utils/kidExplanations';
import { soundEngine } from '../../utils/soundEngine';
import { Lightbulb, RotateCcw, Sparkles, Zap, Plug, AlertTriangle, Volume2 } from 'lucide-react';

interface WireEdge {
  id: string;
  fromNode: string;
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
  const [showHint, setShowHint] = useState<boolean>(true);
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
    setShowHint(level.number <= 10);
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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.58 },
      });
      onComplete();
    }
  }, [simulation, pluggedIn, level, completedOnce, onComplete]);

  useEffect(() => {
    if (simulation.shortCircuit) {
      soundEngine.playShortCircuitWarning();
      soundEngine.speakClipKey('elec_short_circuit');
    }
  }, [simulation.shortCircuit]);

  const unplacedSlots = level.slots.filter((s) => !placedSlots[s.slotId]);

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

  const placeSlotPart = (slot: ElectricSlotSpec) => {
    if (placedSlots[slot.slotId]) return;
    soundEngine.playSnap();
    const nextPlaced = { ...placedSlots, [slot.slotId]: true };
    setPlacedSlots(nextPlaced);

    const remaining = level.slots.filter((s) => !nextPlaced[s.slotId]);
    if (remaining.length === 0) {
      // All parts placed! Guide child by voice to wire them!
      soundEngine.speakClipKey('elec_step_wire');
    } else {
      soundEngine.speakClipKey(getPartVoiceClipKey(slot.partKind));
    }
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
    const nextWires = [
      ...wires,
      {
        id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fromNode: nodeA,
        toNode: nodeB,
        color,
      },
    ];
    setWires(nextWires);

    // Check if all hint wires are now connected -> speak next step if switch/breaker/plug needed!
    const stillMissingWire = level.hintWires.some((hw) => {
      const m1 = `${hw.fromSlot}:${hw.fromTerm}`;
      const m2 = `${hw.toSlot}:${hw.toTerm}`;
      return !nextWires.some(
        (w) =>
          (w.fromNode === m1 && w.toNode === m2) ||
          (w.fromNode === m2 && w.toNode === m1)
      );
    });

    if (!stillMissingWire) {
      const breakerOff = level.slots.some(
        (s) => s.partKind === 'mcb_breaker' && !switch1Map[s.slotId]
      );
      if (breakerOff) {
        soundEngine.speakClipKey('elec_step_breaker_on');
      } else if (level.requiresSwitchToggle) {
        soundEngine.speakClipKey('elec_step_switch_on');
      } else if (level.pluggableAppliance && !pluggedIn) {
        soundEngine.speakClipKey('elec_step_plug_in');
      }
    }
  };

  // Speak current step helper when child clicks "بگو چیکار کنم؟"
  const speakCurrentStepInstruction = () => {
    if (unplacedSlots.length > 0) {
      soundEngine.speakClipKey('elec_step_place');
    } else if (nextHintWire) {
      soundEngine.speakClipKey('elec_step_wire');
    } else {
      const breakerOff = level.slots.some(
        (s) => s.partKind === 'mcb_breaker' && !switch1Map[s.slotId]
      );
      if (breakerOff) soundEngine.speakClipKey('elec_step_breaker_on');
      else if (level.pluggableAppliance && !pluggedIn) soundEngine.speakClipKey('elec_step_plug_in');
      else soundEngine.speakClipKey('elec_step_switch_on');
    }
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
      // If breaker just turned ON and plug is still needed, guide child to plug!
      if (slot.partKind === 'mcb_breaker' && next && level.pluggableAppliance && !pluggedIn) {
        setTimeout(() => soundEngine.speakClipKey('elec_step_plug_in'), 350);
      }
      return { ...prev, [slot.slotId]: next };
    });
  };

  const anyOutletPowered = level.slots.some(
    (s) => s.partKind === 'wall_outlet' && simulation.poweredLoads.has(s.slotId)
  );
  const anyLampLit = level.slots.some(
    (s) =>
      (s.partKind.startsWith('bulb') ||
        s.partKind === 'ceiling_lamp' ||
        s.partKind === 'chandelier_dual' ||
        s.partKind === 'led_disco') &&
      simulation.poweredLoads.has(s.slotId)
  );

  const makeWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const sag = Math.min(18, Math.abs(x2 - x1) * 0.22 + 6);
    return `M ${x1} ${y1} Q ${midX} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;
  };

  const boardBgClass =
    level.boardTheme === 'wall'
      ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-sky-400/45'
      : level.boardTheme === 'tech'
      ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border-cyan-400/45'
      : 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 border-amber-400/50';

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top Interactive Voice Step Coach Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-white/15 rounded-2xl px-4 py-2.5 shadow-lg">
        <button
          type="button"
          onClick={speakCurrentStepInstruction}
          className="flex items-center gap-2 text-xs sm:text-sm text-amber-200 hover:text-amber-100 font-black text-right"
        >
          <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950 shadow">
            <Volume2 className="w-4 h-4" />
          </span>
          <span>
            {unplacedSlots.length > 0
              ? `🔊 بگو چیکار کنم: اول قطعه‌های پایین رو بردار بذار روی میز (${level.slots.length - unplacedSlots.length} از ${level.slots.length})`
              : selectedNode
              ? '🔊 حالا دایره رنگی قطعه دوم رو لمس کن تا سیم وصل بشه!'
              : nextHintWire
              ? '🔊 قدم دوم: روی قرقره سیم پایین بزن یا دایره‌های رنگی رو وصل کن!'
              : level.pluggableAppliance && !pluggedIn
              ? '🔊 قدم آخر: فیوز رو روشن کن و دوشاخه وسیله رو بزن توی پریز!'
              : '🔊 عالیه! حالا کلید یا فیوز روی میز رو روشن کن!'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {unplacedSlots.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSnap();
                const all: Record<string, boolean> = {};
                level.slots.forEach((s) => (all[s.slotId] = true));
                setPlacedSlots(all);
                soundEngine.speakClipKey('elec_step_wire');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition"
            >
              <Sparkles className="w-4 h-4" />
              چیدن خودکار
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
            خط راهنما
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
        className={`relative w-full h-[435px] sm:h-[465px] rounded-[2rem] border-2 shadow-2xl overflow-hidden select-none transition-all duration-500 ${boardBgClass}`}
      >
        {/* Warm Room Illumination Bloom when lamps light up! */}
        {anyLampLit && (
          <div className="absolute inset-0 bg-radial from-amber-300/15 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}

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
          <div className="absolute top-3 right-4 px-3.5 py-1 rounded-full bg-sky-500/25 border border-sky-400/40 text-[11px] font-black text-sky-200 pointer-events-none flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>دیوار برق‌کشی ساختمان (قرمز = فاز | آبی = نول)</span>
          </div>
        )}

        {simulation.shortCircuit && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-rose-600/95 border-2 border-amber-300 text-white px-4 py-2 rounded-2xl shadow-xl animate-bounce">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span className="text-xs sm:text-sm font-black">
              آخ عزیزم! اتصال کوتاه شد! روی سیم اشتباه کلیک کن تا باز بشه!
            </span>
          </div>
        )}

        {/* SVG Flexible 3D Insulated Wires Layer */}
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
              strokeWidth="1.25"
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
                <path d={d} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="2.8" strokeLinecap="round" />
                <path d={d} fill="none" stroke={w.color} strokeWidth="1.7" strokeLinecap="round" />
                {/* Glossy wire highlight */}
                <path d={d} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" strokeLinecap="round" />
                {isFlowing && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="0.95"
                    strokeDasharray="1.3 2.3"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="12"
                      to="0"
                      dur="0.55s"
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
              strokeWidth="1.3"
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

          // Show bouncing hand on switch/breaker when wiring is done!
          const needsSwitchClick =
            isPlaced &&
            unplacedSlots.length === 0 &&
            !nextHintWire &&
            !completedOnce &&
            ((slot.partKind === 'mcb_breaker' && !switch1Map[slot.slotId]) ||
              ((slot.partKind === 'toggle_switch' ||
                slot.partKind === 'push_button' ||
                slot.partKind === 'wall_switch_1' ||
                slot.partKind === 'wall_switch_2' ||
                slot.partKind === 'dimmer_knob' ||
                slot.partKind === 'light_sensor') &&
                !isPowered &&
                (!switch1Map[slot.slotId] ||
                  (slot.partKind === 'wall_switch_2' && !switch2Map[slot.slotId]) ||
                  (slot.partKind === 'dimmer_knob' && (dimmerMap[slot.slotId] ?? 0) === 0))));

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
                <div className="w-32 h-26 rounded-2xl border-2 border-dashed border-amber-300/80 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center animate-pulse shadow-lg">
                  <span className="text-xs font-extrabold text-amber-300">{label}</span>
                  <span className="text-[10px] text-slate-200 mt-1">اینجا بگذار 👇</span>
                </div>
              ) : (
                <div
                  className={`relative rounded-2xl px-3.5 py-2.5 backdrop-blur-md border-2 transition-all ${
                    isPowered
                      ? 'bg-slate-900/92 border-amber-400 shadow-[0_0_38px_rgba(250,204,21,0.48)]'
                      : 'bg-slate-900/88 border-white/25 shadow-2xl'
                  }`}
                >
                  {needsSwitchClick && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce pointer-events-none z-30">
                      👇
                    </div>
                  )}

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
                  <div className="text-[11px] font-black text-center text-white mt-0.5 whitespace-nowrap">
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
          <div className="absolute bottom-3 left-3 z-20 bg-slate-950/95 border-2 border-cyan-400/60 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform ${
                pluggedIn && anyOutletPowered
                  ? 'bg-amber-400/30 scale-110 animate-bounce shadow-[0_0_22px_rgba(250,204,21,0.65)]'
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
                className={`mt-1.5 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border-b-2 transition ${
                  pluggedIn
                    ? 'bg-emerald-400 border-emerald-600 text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-slate-950 animate-pulse'
                }`}
              >
                <Plug className="w-4 h-4" />
                {pluggedIn ? 'دوشاخه داخل پریز است ✓' : 'زدن دوشاخه به پریز 🔌 👆'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tray OR Spoken Victory Story Banner */}
      {completedOnce ? (
        <VictoryStoryBanner level={level} onNextLevel={onNextLevel} />
      ) : (
        <div className="bg-slate-900/92 border-2 border-white/15 rounded-3xl p-3.5 flex flex-wrap items-center justify-center gap-3.5 min-h-[100px] shadow-xl">
          {unplacedSlots.map((slot, idx) => (
            <div
              key={slot.slotId}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('partKind', slot.partKind)}
              onClick={() => placeSlotPart(slot)}
              className="relative cursor-grab active:cursor-grabbing group flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border-2 border-amber-400/70 hover:border-amber-300 border-b-4 rounded-2xl px-4 py-2.5 shadow-lg transition transform hover:-translate-y-1"
            >
              {idx === 0 && (
                <span className="absolute -top-4 -right-2 text-2xl animate-bounce pointer-events-none">
                  👆
                </span>
              )}
              <div className="scale-75 -m-3 pointer-events-none">
                <ElectricPartGraphic kind={slot.partKind} powered={false} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-white">
                  {slot.customLabel || PART_NAMES_FA[slot.partKind]}
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  بزن روش تا بره روی میز ☝️
                </span>
              </div>
            </div>
          ))}

          {unplacedSlots.length === 0 && nextHintWire && (
            <div
              draggable
              onDragStart={(e) => e.dataTransfer.setData('wireSpool', 'next')}
              onClick={() => connectNodes(nextHintWire.n1, nextHintWire.n2, nextHintWire.color)}
              className="relative cursor-grab active:cursor-grabbing flex items-center gap-3.5 bg-gradient-to-l from-red-500/30 via-slate-800 to-blue-500/30 hover:from-red-500/45 hover:to-blue-500/45 border-2 border-amber-300 border-b-4 rounded-2xl px-6 py-3 shadow-xl transition transform hover:-translate-y-1"
            >
              <span className="absolute -top-4 -right-2 text-2xl animate-bounce pointer-events-none">
                👆
              </span>
              <svg viewBox="0 0 64 54" className="w-12 h-11 drop-shadow">
                <rect x="10" y="6" width="44" height="8" rx="4" fill="#cbd5e1" />
                <rect x="10" y="40" width="44" height="8" rx="4" fill="#cbd5e1" />
                <rect x="16" y="14" width="32" height="26" rx="4" fill={nextHintWire.color} />
                <line x1="16" y1="22" x2="48" y2="22" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
                <line x1="16" y1="31" x2="48" y2="31" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
              </svg>
              <div className="flex flex-col text-right">
                <span className="text-sm font-black text-white">
                  برداشتن سیم رابط و اتصال خودکار 🔌
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  اینجا بزن تا سیم وصل بشه (یا خودت دایره‌های رنگی رو به هم وصل کن!)
                </span>
              </div>
            </div>
          )}

          {unplacedSlots.length === 0 && !nextHintWire && (
            <div className="flex items-center gap-2 text-emerald-300 font-black text-xs sm:text-sm animate-bounce">
              <span>⚡</span>
              <span>
                سیم‌کشی کامله عزیزم! حالا کلید / فیوز / دوشاخه روی میز رو بزن تا روشن بشه!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

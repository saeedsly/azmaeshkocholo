import React from 'react';
import { ElectricPartKind, PluggableApplianceKind } from '../../types/game';

interface PartArtProps {
  kind: ElectricPartKind;
  powered: boolean;
  switchOn?: boolean;
  switch2On?: boolean;
  dimmerLevel?: number; // 1..3
  nightMode?: boolean;
  pluggedIn?: boolean;
  onInteract?: (subAction?: 'sw1' | 'sw2' | 'dimmer' | 'sensor' | 'crank') => void;
}

export const PART_NAMES_FA: Record<ElectricPartKind, string> = {
  aa_battery: 'باتری قلمی',
  battery_9v: 'باتری کتابی ۹ ولت',
  dual_battery: 'جعبه‌باتری قوی',
  solar_panel: 'پنل خورشیدی',
  hand_dynamo: 'دینام دستی',
  armature: 'آرمیچر چرخان',
  fan: 'پنکه برقی',
  bulb_warm: 'لامپ طلایی',
  bulb_red: 'چراغ قرمز',
  bulb_green: 'چراغ سبز',
  bulb_blue: 'چراغ آبی',
  led_disco: 'گوی رنگین‌کمان',
  buzzer: 'زنگ موزیکال',
  siren: 'آژیر گردان',
  toy_car: 'ماشین برقی',
  electromagnet: 'آهنربای الکتریکی',
  crane_winch: 'جرثقیل برقی',
  robot_buddy: 'ربات کوچولو',
  push_button: 'دکمه شستی',
  toggle_switch: 'کلید قطع و وصل',
  dimmer_knob: 'دیمر تنظیم',
  light_sensor: 'سنسور شب (فتوسل)',
  fuse_box: 'فیوز ایمنی',
  mcb_breaker: 'فیوز تابلو برق',
  junction_box: 'جعبه تقسیم',
  wall_switch_1: 'کلید یک‌پل دیواری',
  wall_switch_2: 'کلید دوپل دیواری',
  stair_switch_a: 'کلید تبدیل اول',
  stair_switch_b: 'کلید تبدیل دوم',
  wall_outlet: 'پریز برق دیواری',
  ceiling_lamp: 'چراغ سقفی',
  chandelier_dual: 'لوستر سقفی',
  exhaust_fan: 'هواکش دیواری',
  doorbell_chime: 'زنگ آپارتمان',
};

export const APPLIANCE_META: Record<
  PluggableApplianceKind,
  { name: string; emoji: string; activeText: string; color: string }
> = {
  bedside_lamp: {
    name: 'چراغ خواب',
    emoji: '🛋️',
    activeText: 'چراغ خواب روشن شد!',
    color: '#fbbf24',
  },
  table_fan: {
    name: 'پنکه ایستاده',
    emoji: '🌀',
    activeText: 'پنکه خنک می‌چرخد!',
    color: '#38bdf8',
  },
  blender: {
    name: 'مخلوط‌کن میوه',
    emoji: '🍹',
    activeText: 'آبمیوه آماده شد!',
    color: '#f43f5e',
  },
  television: {
    name: 'تلویزیون کارتون',
    emoji: '📺',
    activeText: 'کارتون پخش شد!',
    color: '#8b5cf6',
  },
  hair_dryer: {
    name: 'سشوار برقی',
    emoji: '💨',
    activeText: 'باد گرم می‌وزد!',
    color: '#ec4899',
  },
  night_star: {
    name: 'چراغ ستاره شب',
    emoji: '🌟',
    activeText: 'ستاره‌ها درخشیدند!',
    color: '#eab308',
  },
};

export const ElectricPartGraphic: React.FC<PartArtProps> = ({
  kind,
  powered,
  switchOn = false,
  switch2On = false,
  dimmerLevel = 2,
  nightMode = true,
  pluggedIn = false,
  onInteract,
}) => {
  switch (kind) {
    case 'aa_battery':
      return (
        <svg viewBox="0 0 120 90" className="w-24 h-20 drop-shadow-lg select-none">
          <defs>
            <linearGradient id="aaBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="46%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="76" height="48" rx="10" fill="url(#aaBody)" stroke="#fde68a" strokeWidth="2" />
          <rect x="96" y="33" width="9" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          <rect x="13" y="31" width="7" height="26" rx="3" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5" />
          <text x="82" y="49" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
          <text x="31" y="49" fill="#93c5fd" fontSize="18" fontWeight="bold" textAnchor="middle">−</text>
          <path d="M58 29 L50 45 L58 45 L53 59 L67 41 L59 41 Z" fill="#fde047" />
        </svg>
      );

    case 'battery_9v':
      return (
        <svg viewBox="0 0 120 96" className="w-24 h-20 drop-shadow-lg select-none">
          <rect x="28" y="20" width="64" height="66" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
          <rect x="28" y="20" width="64" height="24" rx="8" fill="#f97316" />
          <rect x="40" y="10" width="12" height="10" rx="3" fill="#ef4444" stroke="#fecaca" strokeWidth="1.5" />
          <polygon points="68,20 82,20 79,10 71,10" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="1.5" />
          <text x="60" y="64" fill="#fde047" fontSize="17" fontWeight="900" textAnchor="middle">9V ⚡</text>
        </svg>
      );

    case 'dual_battery':
      return (
        <svg viewBox="0 0 120 96" className="w-24 h-20 drop-shadow-lg select-none">
          <rect x="16" y="16" width="88" height="64" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="24" y="24" width="72" height="20" rx="6" fill="#f59e0b" />
          <rect x="24" y="50" width="72" height="20" rx="6" fill="#f59e0b" />
          <text x="60" y="39" fill="#0f172a" fontSize="11" fontWeight="900" textAnchor="middle">+ باتری ۱ −</text>
          <text x="60" y="65" fill="#0f172a" fontSize="11" fontWeight="900" textAnchor="middle">+ باتری ۲ −</text>
        </svg>
      );

    case 'solar_panel':
      return (
        <svg viewBox="0 0 128 96" className="w-26 h-20 drop-shadow-lg select-none">
          <circle cx="24" cy="20" r="13" fill="#fde047" className="animate-pulse" />
          <rect x="26" y="28" width="82" height="54" rx="8" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="3" />
          <line x1="53" y1="28" x2="53" y2="82" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="80" y1="28" x2="80" y2="82" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="26" y1="46" x2="108" y2="46" stroke="#60a5fa" strokeWidth="1.5" />
          <line x1="26" y1="64" x2="108" y2="64" stroke="#60a5fa" strokeWidth="1.5" />
        </svg>
      );

    case 'hand_dynamo':
      return (
        <svg viewBox="0 0 124 96" className="w-24 h-20 drop-shadow-lg select-none">
          <rect x="22" y="26" width="66" height="50" rx="12" fill="#0284c7" stroke="#bae6fd" strokeWidth="2.5" />
          <circle cx="55" cy="51" r="16" fill="#0f172a" stroke="#fde047" strokeWidth="2.5" />
          <g className="origin-[86px_51px] animate-spin-slow">
            <circle cx="86" cy="51" r="18" fill="#475569" stroke="#e2e8f0" strokeWidth="2" />
            <line x1="86" y1="51" x2="106" y2="35" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
            <circle cx="106" cy="35" r="6" fill="#ef4444" />
          </g>
        </svg>
      );

    case 'armature':
      return (
        <div className="relative flex items-center justify-center w-28 h-22 select-none">
          {powered && (
            <div className="absolute -inset-2 rounded-full bg-cyan-400/25 blur-md animate-pulse pointer-events-none" />
          )}
          <svg viewBox="0 0 136 96" className="w-28 h-22 drop-shadow-xl">
            {/* Wooden/Metal Mount */}
            <rect x="22" y="68" width="70" height="14" rx="5" fill="#b45309" stroke="#fde68a" strokeWidth="1.5" />
            {/* Metallic Cylinder Body */}
            <rect x="20" y="26" width="72" height="44" rx="14" fill="#64748b" stroke="#e2e8f0" strokeWidth="2.5" />
            {/* Cutaway Copper Windings */}
            <rect x="36" y="33" width="40" height="30" rx="6" fill="#451a03" />
            <line x1="42" y1="34" x2="42" y2="62" stroke="#f97316" strokeWidth="4" />
            <line x1="50" y1="34" x2="50" y2="62" stroke="#ea580c" strokeWidth="4" />
            <line x1="58" y1="34" x2="58" y2="62" stroke="#f97316" strokeWidth="4" />
            <line x1="66" y1="34" x2="66" y2="62" stroke="#ea580c" strokeWidth="4" />
            {/* Rotor Shaft */}
            <rect x="92" y="44" width="18" height="8" rx="2" fill="#cbd5e1" />
            {/* Spinning Rotor Disc / Pulley */}
            <g
              style={{ transformOrigin: '112px 48px' }}
              className={powered ? 'animate-spin-fast' : ''}
            >
              <circle cx="112" cy="48" r="19" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
              <path d="M112 29 L118 48 L112 67 L106 48 Z" fill="#facc15" />
              <path d="M93 48 L112 42 L131 48 L112 54 Z" fill="#ef4444" />
              <circle cx="112" cy="48" r="4" fill="#fff" />
            </g>
          </svg>
        </div>
      );

    case 'fan':
    case 'exhaust_fan':
      return (
        <div className="relative flex items-center justify-center w-26 h-22 select-none">
          {powered && (
            <div className="absolute -inset-2 rounded-full bg-sky-400/25 blur-md animate-pulse pointer-events-none" />
          )}
          <svg viewBox="0 0 120 100" className="w-24 h-22 drop-shadow-xl">
            {kind === 'exhaust_fan' ? (
              <rect x="16" y="10" width="88" height="80" rx="14" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
            ) : (
              <path d="M44 82 L76 82 L66 64 L54 64 Z" fill="#334155" />
            )}
            <circle cx="60" cy="48" r="34" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
            <g
              style={{ transformOrigin: '60px 48px' }}
              className={powered ? 'animate-spin-fast' : ''}
            >
              <ellipse cx="60" cy="24" rx="10" ry="18" fill="#38bdf8" />
              <ellipse cx="60" cy="72" rx="10" ry="18" fill="#38bdf8" />
              <ellipse cx="36" cy="48" rx="18" ry="10" fill="#facc15" />
              <ellipse cx="84" cy="48" rx="18" ry="10" fill="#facc15" />
              <circle cx="60" cy="48" r="8" fill="#f8fafc" />
            </g>
          </svg>
        </div>
      );

    case 'bulb_warm':
    case 'bulb_red':
    case 'bulb_green':
    case 'bulb_blue':
    case 'ceiling_lamp': {
      const colorMap: Record<string, { on: string; glow: string }> = {
        bulb_warm: { on: '#fde047', glow: 'rgba(250,204,21,0.55)' },
        ceiling_lamp: { on: '#fef08a', glow: 'rgba(253,224,71,0.6)' },
        bulb_red: { on: '#ef4444', glow: 'rgba(239,68,68,0.55)' },
        bulb_green: { on: '#22c55e', glow: 'rgba(34,197,94,0.55)' },
        bulb_blue: { on: '#3b82f6', glow: 'rgba(59,130,246,0.55)' },
      };
      const c = colorMap[kind] || colorMap.bulb_warm;
      return (
        <div className="relative flex items-center justify-center w-24 h-22 select-none">
          {powered && (
            <div
              className="absolute -inset-4 rounded-full blur-xl animate-pulse pointer-events-none"
              style={{ backgroundColor: c.glow }}
            />
          )}
          <svg viewBox="0 0 110 100" className="w-22 h-22 drop-shadow-xl">
            <circle
              cx="55"
              cy="40"
              r="28"
              fill={powered ? c.on : '#334155'}
              stroke={powered ? '#ffffff' : '#94a3b8'}
              strokeWidth="2.5"
            />
            <path
              d="M46 52 L50 34 L55 42 L60 34 L64 52"
              fill="none"
              stroke={powered ? '#ffffff' : '#64748b'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="42" y="64" width="26" height="18" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <line x1="42" y1="70" x2="68" y2="70" stroke="#475569" strokeWidth="2" />
            <line x1="42" y1="76" x2="68" y2="76" stroke="#475569" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    case 'chandelier_dual':
      return (
        <div className="relative flex items-center justify-center w-28 h-22 select-none">
          {powered && (
            <div className="absolute -inset-5 rounded-full bg-amber-300/50 blur-xl animate-pulse pointer-events-none" />
          )}
          <svg viewBox="0 0 130 96" className="w-28 h-22 drop-shadow-xl">
            <rect x="58" y="8" width="14" height="18" rx="3" fill="#eab308" />
            <path d="M30 48 Q65 24 100 48" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <circle cx="30" cy="54" r="15" fill={powered ? '#fef08a' : '#475569'} stroke="#fde047" strokeWidth="2" />
            <circle cx="65" cy="58" r="17" fill={powered ? '#fde047' : '#475569'} stroke="#fde047" strokeWidth="2" />
            <circle cx="100" cy="54" r="15" fill={powered ? '#fef08a' : '#475569'} stroke="#fde047" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'led_disco':
      return (
        <div className="relative flex items-center justify-center w-24 h-22 select-none">
          {powered && (
            <div className="absolute -inset-5 rounded-full bg-gradient-to-tr from-pink-500/50 via-cyan-400/50 to-yellow-300/50 blur-xl animate-spin-slow pointer-events-none" />
          )}
          <svg viewBox="0 0 110 96" className="w-22 h-20 drop-shadow-xl">
            <rect x="30" y="64" width="50" height="18" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <circle
              cx="55"
              cy="42"
              r="26"
              fill={powered ? '#ec4899' : '#475569'}
              stroke="#f8fafc"
              strokeWidth="2"
            />
            {powered && (
              <>
                <circle cx="45" cy="34" r="6" fill="#fde047" />
                <circle cx="65" cy="36" r="6" fill="#38bdf8" />
                <circle cx="55" cy="50" r="6" fill="#4ade80" />
              </>
            )}
          </svg>
        </div>
      );

    case 'buzzer':
    case 'doorbell_chime':
      return (
        <div className={`relative flex items-center justify-center w-24 h-20 select-none ${powered ? 'animate-wiggle' : ''}`}>
          <svg viewBox="0 0 110 92" className="w-22 h-20 drop-shadow-xl">
            <circle cx="52" cy="46" r="26" fill="#f59e0b" stroke="#fef08a" strokeWidth="3" />
            <circle cx="52" cy="46" r="8" fill="#78350f" />
            <line x1="78" y1="68" x2="84" y2="44" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <circle cx="84" cy="42" r="6" fill="#ef4444" />
            {powered && (
              <text x="20" y="24" fontSize="20">🎵</text>
            )}
          </svg>
        </div>
      );

    case 'siren':
      return (
        <div className="relative flex items-center justify-center w-24 h-20 select-none">
          {powered && (
            <div className="absolute -inset-4 rounded-full bg-red-500/45 blur-xl animate-ping pointer-events-none" />
          )}
          <svg viewBox="0 0 110 92" className="w-22 h-20 drop-shadow-xl">
            <path d="M32 66 L38 26 Q55 16 72 26 L78 66 Z" fill={powered ? '#ef4444' : '#64748b'} stroke="#fca5a5" strokeWidth="2.5" />
            <rect x="24" y="66" width="62" height="14" rx="5" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'toy_car':
      return (
        <div className={`relative flex items-center justify-center w-28 h-20 select-none ${powered ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 130 90" className="w-28 h-20 drop-shadow-xl">
            {powered && <polygon points="106,46 130,34 130,60" fill="rgba(253,224,71,0.65)" />}
            <path d="M22 58 L34 32 L82 32 L104 50 L106 64 L20 64 Z" fill="#ef4444" stroke="#fecaca" strokeWidth="2" />
            <rect x="40" y="36" width="36" height="14" rx="4" fill="#bae6fd" />
            <circle cx="40" cy="66" r="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" className={powered ? 'animate-spin-fast' : ''} style={{ transformOrigin: '40px 66px' }} />
            <circle cx="88" cy="66" r="12" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" className={powered ? 'animate-spin-fast' : ''} style={{ transformOrigin: '88px 66px' }} />
          </svg>
        </div>
      );

    case 'electromagnet':
      return (
        <div className="relative flex items-center justify-center w-28 h-22 select-none">
          <svg viewBox="0 0 130 98" className="w-28 h-22 drop-shadow-xl">
            {/* Iron Nail */}
            <rect x="24" y="34" width="82" height="12" rx="3" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1.5" />
            <polygon points="106,34 120,40 106,46" fill="#cbd5e1" />
            <rect x="18" y="28" width="8" height="24" rx="2" fill="#64748b" />
            {/* Copper Coil */}
            {[36, 46, 56, 66, 76, 86].map((x) => (
              <rect key={x} x={x} y="28" width="6" height="24" rx="3" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />
            ))}
            {/* Paperclips jumping up when powered */}
            <g transform={powered ? 'translate(0, -18)' : 'translate(0, 0)'} className="transition-transform duration-300">
              <rect x="44" y="72" width="16" height="7" rx="3.5" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
              <rect x="68" y="74" width="16" height="7" rx="3.5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <rect x="92" y="70" width="16" height="7" rx="3.5" fill="none" stroke="#facc15" strokeWidth="2.5" />
            </g>
          </svg>
        </div>
      );

    case 'crane_winch':
      return (
        <div className="relative flex items-center justify-center w-26 h-24 select-none">
          <svg viewBox="0 0 120 105" className="w-26 h-24 drop-shadow-xl">
            <path d="M26 85 L44 20 L86 20" fill="none" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
            <circle cx="44" cy="24" r="10" fill="#334155" stroke="#fde047" strokeWidth="2" />
            <line x1="84" y1="20" x2="84" y2={powered ? '46' : '74'} stroke="#e2e8f0" strokeWidth="2.5" />
            <rect x="70" y={powered ? '46' : '74'} width="28" height="20" rx="4" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'robot_buddy':
      return (
        <div className={`relative flex items-center justify-center w-26 h-24 select-none ${powered ? 'animate-bounce' : ''}`}>
          <svg viewBox="0 0 120 105" className="w-26 h-24 drop-shadow-xl">
            <line x1="60" y1="8" x2="60" y2="22" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="60" cy="8" r="6" fill={powered ? '#22c55e' : '#64748b'} />
            <rect x="30" y="22" width="60" height="46" rx="14" fill="#0ea5e9" stroke="#e0f2fe" strokeWidth="2.5" />
            <circle cx="46" cy="42" r="7" fill={powered ? '#fde047' : '#0f172a'} />
            <circle cx="74" cy="42" r="7" fill={powered ? '#fde047' : '#0f172a'} />
            <path
              d={powered ? 'M44 55 Q60 66 76 55' : 'M46 57 L74 57'}
              fill="none"
              stroke="#fff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <rect x="36" y="70" width="48" height="24" rx="8" fill="#0284c7" />
          </svg>
        </div>
      );

    case 'push_button':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('sw1');
          }}
          className="group relative flex flex-col items-center justify-center focus:outline-none"
          title="فشار بده!"
        >
          <svg viewBox="0 0 110 86" className="w-22 h-18 drop-shadow-lg">
            <rect x="20" y="44" width="70" height="28" rx="8" fill="#334155" stroke="#94a3b8" strokeWidth="2.5" />
            <rect
              x="34"
              y={switchOn ? '34' : '20'}
              width="42"
              height="26"
              rx="10"
              fill={switchOn ? '#22c55e' : '#ef4444'}
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 -mt-1 shadow">
            {switchOn ? 'وصل شد! (کلیک)' : 'فشار بده 👇'}
          </span>
        </button>
      );

    case 'toggle_switch':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('sw1');
          }}
          className="flex flex-col items-center justify-center focus:outline-none"
        >
          <svg viewBox="0 0 110 82" className="w-22 h-18 drop-shadow-lg">
            <rect x="18" y="44" width="74" height="24" rx="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line
              x1="55"
              y1="48"
              x2={switchOn ? '80' : '32'}
              y2={switchOn ? '46' : '20'}
              stroke={switchOn ? '#4ade80' : '#f87171'}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="80" cy="46" r="5" fill="#4ade80" />
          </svg>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full -mt-1 ${switchOn ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-amber-300'}`}>
            {switchOn ? 'روشن ✓' : 'روشن کن 👇'}
          </span>
        </button>
      );

    case 'dimmer_knob':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('dimmer');
          }}
          className="flex flex-col items-center justify-center focus:outline-none"
        >
          <svg viewBox="0 0 100 86" className="w-22 h-18 drop-shadow-lg">
            <rect x="18" y="12" width="64" height="64" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="50" cy="44" r="20" fill="#334155" stroke="#f59e0b" strokeWidth="3" />
            <line
              x1="50"
              y1="44"
              x2={dimmerLevel === 0 ? '36' : dimmerLevel === 1 ? '50' : '64'}
              y2={dimmerLevel === 0 ? '54' : '28'}
              stroke="#fde047"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 -mt-1">
            درجه: {dimmerLevel === 0 ? 'خاموش' : `${dimmerLevel} 🔄`}
          </span>
        </button>
      );

    case 'light_sensor':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('sensor');
          }}
          className="flex flex-col items-center justify-center focus:outline-none"
        >
          <svg viewBox="0 0 108 84" className="w-22 h-18 drop-shadow-lg">
            <rect x="20" y="16" width="68" height="54" rx="14" fill={nightMode ? '#1e1b4b' : '#38bdf8'} stroke="#e2e8f0" strokeWidth="2.5" />
            <text x="54" y="51" fontSize="26" textAnchor="middle">
              {nightMode ? '🌙' : '☀️'}
            </text>
          </svg>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-400 text-slate-950 -mt-1">
            {nightMode ? 'حالت شب (فعال)' : 'روز (بزن شب بشه 🌙)'}
          </span>
        </button>
      );

    case 'fuse_box':
      return (
        <svg viewBox="0 0 110 80" className="w-22 h-16 drop-shadow-lg select-none">
          <rect x="18" y="22" width="74" height="36" rx="12" fill="#e2e8f0" fillOpacity="0.25" stroke="#93c5fd" strokeWidth="2.5" />
          <rect x="14" y="22" width="14" height="36" rx="4" fill="#cbd5e1" />
          <rect x="82" y="22" width="14" height="36" rx="4" fill="#cbd5e1" />
          <line x1="28" y1="40" x2="82" y2="40" stroke="#fbbf24" strokeWidth="3.5" />
        </svg>
      );

    case 'mcb_breaker':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('sw1');
          }}
          className="flex flex-col items-center justify-center focus:outline-none"
        >
          <svg viewBox="0 0 104 96" className="w-22 h-22 drop-shadow-xl">
            <rect x="20" y="8" width="64" height="80" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
            <rect x="30" y="20" width="44" height="12" rx="3" fill={switchOn ? '#ef4444' : '#22c55e'} />
            <text x="52" y="29" fontSize="9" fill="#fff" fontWeight="bold" textAnchor="middle">
              {switchOn ? 'ON وصل' : 'OFF قطع'}
            </text>
            <rect
              x="32"
              y={switchOn ? '38' : '54'}
              width="40"
              height="18"
              rx="5"
              fill={switchOn ? '#dc2626' : '#334155'}
              stroke="#0f172a"
              strokeWidth="2"
            />
          </svg>
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full -mt-1 shadow ${switchOn ? 'bg-emerald-400 text-slate-950' : 'bg-amber-300 text-slate-950'}`}>
            {switchOn ? 'فیوز بالاست ⚡' : 'بزن فیوز بالا ☝️'}
          </span>
        </button>
      );

    case 'junction_box':
      return (
        <svg viewBox="0 0 100 84" className="w-22 h-18 drop-shadow-lg select-none">
          <rect x="18" y="14" width="64" height="56" rx="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="50" cy="42" r="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <circle cx="50" cy="42" r="5" fill="#f59e0b" />
        </svg>
      );

    case 'wall_switch_1':
    case 'stair_switch_a':
    case 'stair_switch_b':
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInteract?.('sw1');
          }}
          className="flex flex-col items-center justify-center focus:outline-none"
        >
          <svg viewBox="0 0 100 94" className="w-22 h-20 drop-shadow-xl">
            <rect x="14" y="10" width="72" height="72" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <rect
              x="28"
              y="22"
              width="44"
              height="48"
              rx="6"
              fill={switchOn ? '#e0f2fe' : '#e2e8f0'}
              stroke={switchOn ? '#0284c7' : '#94a3b8'}
              strokeWidth="2.5"
            />
            <circle cx="50" cy={switchOn ? '32' : '58'} r="4" fill={switchOn ? '#22c55e' : '#94a3b8'} />
          </svg>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full -mt-1 ${switchOn ? 'bg-emerald-400 text-slate-950' : 'bg-sky-300 text-slate-950'}`}>
            {switchOn ? 'کلید روشن 💡' : 'کلید را بزن 👇'}
          </span>
        </button>
      );

    case 'wall_switch_2':
      return (
        <div className="flex flex-col items-center select-none">
          <div className="relative w-24 h-20 bg-slate-50 rounded-xl border-2 border-slate-300 shadow-lg flex items-center justify-center gap-1.5 p-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInteract?.('sw1');
              }}
              className={`flex-1 h-full rounded-lg border-2 flex flex-col items-center justify-center text-[10px] font-black transition ${
                switchOn ? 'bg-amber-200 border-amber-500 text-slate-900' : 'bg-slate-200 border-slate-400 text-slate-600'
              }`}
            >
              <span>پل ۱</span>
              <span>{switchOn ? 'روشن' : 'خاموش'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInteract?.('sw2');
              }}
              className={`flex-1 h-full rounded-lg border-2 flex flex-col items-center justify-center text-[10px] font-black transition ${
                switch2On ? 'bg-purple-200 border-purple-500 text-slate-900' : 'bg-slate-200 border-slate-400 text-slate-600'
              }`}
            >
              <span>پل ۲</span>
              <span>{switch2On ? 'روشن' : 'خاموش'}</span>
            </button>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 mt-0.5">
            هر دو پل را بزن 👇
          </span>
        </div>
      );

    case 'wall_outlet':
      return (
        <div className="relative flex flex-col items-center justify-center select-none">
          <svg viewBox="0 0 104 94" className="w-22 h-20 drop-shadow-xl">
            <rect x="14" y="10" width="76" height="74" rx="14" fill="#f8fafc" stroke={powered ? '#22c55e' : '#cbd5e1'} strokeWidth="3.5" />
            <circle cx="52" cy="47" r="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
            {/* Two socket holes */}
            <circle cx="41" cy="47" r="5" fill={pluggedIn ? '#f59e0b' : '#1e293b'} />
            <circle cx="63" cy="47" r="5" fill={pluggedIn ? '#f59e0b' : '#1e293b'} />
            {/* Earth clips */}
            <rect x="49" y="23" width="6" height="5" fill="#eab308" />
            <rect x="49" y="66" width="6" height="5" fill="#eab308" />
          </svg>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full -mt-1 ${powered ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
            {powered ? 'پریز برق‌دار شد ⚡' : 'پریز برق'}
          </span>
        </div>
      );
  }
};

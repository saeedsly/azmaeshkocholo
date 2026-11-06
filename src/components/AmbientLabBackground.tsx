import React from 'react';

const FLOATING_BADGES = [
  { icon: '⚛️', left: '6%', top: '16%', delay: '0s', size: 'text-3xl' },
  { icon: '⚡', left: '91%', top: '14%', delay: '1.1s', size: 'text-3xl' },
  { icon: '🧪', left: '12%', top: '76%', delay: '0.6s', size: 'text-3xl' },
  { icon: '🧲', left: '88%', top: '72%', delay: '1.8s', size: 'text-3xl' },
  { icon: '💡', left: '48%', top: '10%', delay: '2.3s', size: 'text-2xl' },
  { icon: '🔬', left: '78%', top: '42%', delay: '0.9s', size: 'text-2xl' },
  { icon: '🌈', left: '20%', top: '44%', delay: '1.5s', size: 'text-2xl' },
];

export const AmbientLabBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Space Laboratory Radial Auroras */}
      <div className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full bg-fuchsia-600/15 blur-[130px]" />
      <div className="absolute -bottom-44 right-1/4 w-[560px] h-[560px] rounded-full bg-cyan-500/15 blur-[130px]" />

      {/* Subtle Blueprint Science Grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Softly Floating Science Symbols */}
      {FLOATING_BADGES.map((b, idx) => (
        <div
          key={idx}
          style={{ left: b.left, top: b.top, animationDelay: b.delay }}
          className={`absolute ${b.size} opacity-[0.14] animate-float select-none`}
        >
          {b.icon}
        </div>
      ))}
    </div>
  );
};

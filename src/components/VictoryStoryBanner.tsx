import React, { useEffect } from 'react';
import { GameLevel } from '../types/game';
import { getWinExplanationForLevel } from '../utils/kidExplanations';
import { soundEngine } from '../utils/soundEngine';
import { Volume2, Star } from 'lucide-react';

interface Props {
  level: GameLevel;
  onNextLevel: () => void;
}

export const VictoryStoryBanner: React.FC<Props> = ({ level, onNextLevel }) => {
  const { clipKey, fullText } = getWinExplanationForLevel(level);

  // Automatically speak the sweet Persian scientific explanation when the experiment completes!
  useEffect(() => {
    const timer = setTimeout(() => {
      soundEngine.speakPersian(fullText, clipKey);
    }, 620);
    return () => clearTimeout(timer);
  }, [level.id, fullText, clipKey]);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border-2 border-amber-300 bg-gradient-to-l from-emerald-700 via-teal-700 to-indigo-800 p-4 sm:p-5 shadow-[0_0_45px_rgba(16,185,129,0.45)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mascot + Stars + Sweet Story Explanation */}
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <div className="relative shrink-0">
            <img
              src="./assets/mascot.jpg"
              alt="مربی آزمایشگاه"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-amber-300 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-2 text-2xl animate-bounce">🎉</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5 bg-slate-950/50 px-2.5 py-0.5 rounded-full border border-amber-300/50">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-amber-200">
                هورااا عزیزم! آزمایش عالی انجام شد!
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              {fullText}
            </p>
          </div>
        </div>

        {/* Replay Audio Explanation + Big 3D Next Level Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => soundEngine.speakPersian(fullText, clipKey)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-black text-xs sm:text-sm transition"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>دوباره توضیح بده</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.stopSpeech();
              soundEngine.playPop(760);
              onNextLevel();
            }}
            className="relative flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-2xl transition"
          >
            <span>مرحله بعدی ⬅</span>
            <span className="text-xl animate-bounce">👆</span>
          </button>
        </div>
      </div>
    </div>
  );
};

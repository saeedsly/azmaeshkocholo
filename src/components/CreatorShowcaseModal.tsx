import React, { useState } from 'react';
import { PlayerProgress } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import {
  X,
  Code2,
  Heart,
  Volume2,
  Award,
  Cpu,
  Sparkles,
  Edit3,
  Check,
  Upload,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onUpdateProgress: (patch: Partial<PlayerProgress>) => void;
}

export const CreatorShowcaseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
}) => {
  const [editing, setEditing] = useState(false);

  if (!isOpen) return null;

  const creatorName = progress.creatorName || 'مهندس سعید سالاری (Saeed Salari)';
  const creatorRole =
    progress.creatorRole || 'طراح، ایده‌پرداز و برنامه‌نویس ارشد اپلیکیشن دانشمند کوچولو';
  const dedication =
    progress.creatorDedication ||
    'این اثر آموزشی با تمام عشق و افتخار، برای شکوفایی استعداد، کنجکاوی و خلاقیت پسر عزیزم طراحی و برنامه‌نویسی شده است تا از کودکی طعم شیرین کشف علمی و مهندسی را بچشد. ❤️';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateProgress({ creatorPhotoDataUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-[2rem] border-2 border-amber-400/60 bg-gradient-to-b from-slate-900 via-indigo-950/95 to-slate-950 shadow-[0_0_70px_rgba(251,191,36,0.28)] p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2.5 rounded-2xl bg-slate-800/90 hover:bg-rose-600 border border-white/15 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Royal Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-xs font-black">
            <Code2 className="w-4 h-4" />
            <span>شناسنامه رسمی طراح و برنامه‌نویس اثر</span>
          </div>

          {/* Avatar / Developer Crest */}
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-amber-400 via-cyan-400 to-fuchsia-500 blur opacity-75 animate-pulse" />
            {progress.creatorPhotoDataUrl ? (
              <img
                src={progress.creatorPhotoDataUrl}
                alt={creatorName}
                className="relative w-28 h-28 rounded-full object-cover border-4 border-amber-300 shadow-2xl"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-700 border-4 border-white flex items-center justify-center text-5xl shadow-2xl">
                👨‍💻
              </div>
            )}
          </div>

          {!editing ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-l from-amber-200 via-yellow-300 to-cyan-200 bg-clip-text text-transparent">
                {creatorName}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-cyan-300">
                {creatorRole}
              </p>
            </>
          ) : (
            <div className="w-full max-w-lg space-y-2.5 text-right bg-slate-950/70 p-4 rounded-2xl border border-white/15">
              <div>
                <label className="text-[11px] font-bold text-amber-300">نام برنامه‌نویس و سازنده:</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => onUpdateProgress({ creatorName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-sm font-bold text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-300">عنوان تخصصی:</label>
                <input
                  type="text"
                  value={creatorRole}
                  onChange={(e) => onUpdateProgress({ creatorRole: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-300">متن تقدیم‌نامه پدرانه:</label>
                <textarea
                  rows={3}
                  value={dedication}
                  onChange={(e) => onUpdateProgress({ creatorDedication: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/25 border border-sky-400/40 text-sky-200 text-xs font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>انتخاب تصویر پروفایل سازنده</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs"
                >
                  <Check className="w-4 h-4" />
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Heartfelt Dedication Plaque */}
        <div className="mt-6 p-5 rounded-3xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-indigo-500/15 border border-amber-300/40 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-rose-300 font-black text-sm">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
            <span>تقدیم‌نامه اختصاصی به {progress.childName} عزیز</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            «{dedication}»
          </p>
          <button
            type="button"
            onClick={() =>
              soundEngine.speakPersian(
                `عزیزم، این بازی قشنگ و پر از آزمایش رو بابای مهربون و باهوشت، ${creatorName.replace(/\(.*?\)/g, '')}، با یک دنیا عشق مخصوص تو برنامه‌نویسی کرده تا بهترین دانشمند دنیا بشی!`,
                'creator_tribute'
              )
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition shadow-xl"
          >
            <Volume2 className="w-4 h-4" />
            <span>🔊 پخش معرفی صوتی سازنده برای کودک</span>
          </button>
        </div>

        {/* Technical Engineering Highlights Grid */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
            <Cpu className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-sm font-black text-white">۳ موتور شبیه‌ساز</div>
            <div className="text-[11px] text-slate-400">مدار برق، ذرات شیمی و فیزیک آهنربا</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
            <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <div className="text-sm font-black text-white">۲۷۰ مرحله + آپدیت‌پذیر</div>
            <div className="text-[11px] text-slate-400">قابلیت افزودن بی‌نهایت مرحله جدید</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
            <Award className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <div className="text-sm font-black text-white">مربی سخنگوی فارسی</div>
            <div className="text-[11px] text-slate-400">آموزش صوتی گام‌به‌گام ویژه کودک</div>
          </div>
        </div>

        {/* Footer Edit Toggle & GitHub Signature */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>نسخه ۲.۰ فوق‌حرفه‌ای | تمامی حقوق متعلق به سازنده اثر است.</span>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ویرایش مشخصات و عکس سازنده</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

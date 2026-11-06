import React, { useState, useRef } from 'react';
import {
  GameLevel,
  LabId,
  LevelPackManifest,
  PlayerProgress,
  ElectricPartKind,
  ChemIngredientId,
} from '../types/game';
import { PART_NAMES_FA } from './labs/ElectricPartsArt';
import { CHEM_INGREDIENT_META } from '../data/chemistryLevels';
import { soundEngine } from '../utils/soundEngine';
import {
  X,
  RefreshCw,
  Upload,
  Download,
  PlusCircle,
  Mic,
  Square,
  Trash2,
  BookOpen,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

declare global {
  interface Window {
    desktopAPI?: {
      isDesktop: boolean;
      getInfo: () => Promise<{ version: string; platform: string; userDataPath: string }>;
      toggleFullscreen: () => Promise<boolean>;
      loadSavedPacks: () => Promise<LevelPackManifest[]>;
      savePacks: (packs: LevelPackManifest[]) => Promise<boolean>;
      fetchOnlineManifest: (url: string) => Promise<LevelPackManifest>;
      importPackDialog: () => Promise<LevelPackManifest | null>;
      exportPackDialog: (pack: LevelPackManifest) => Promise<boolean>;
      checkAppUpdate: () => Promise<{ status: string; message?: string; version?: string }>;
      synthesizePersian?: (text: string, voiceName?: string) => Promise<string | null>;
    };
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onUpdateProgress: (next: Partial<PlayerProgress>) => void;
  customLevels: GameLevel[];
  onAddLevels: (newLevels: GameLevel[], packId?: string) => void;
  allLevels: GameLevel[];
  onJumpToLevel: (lab: LabId, levelId: string) => void;
}

export const UpdateAndParentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  customLevels,
  onAddLevels,
  allLevels,
  onJumpToLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'update' | 'builder' | 'voice' | 'scenarios'>('update');
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Level Builder state
  const [newLab, setNewLab] = useState<LabId>('electric');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [elecSource, setElecSource] = useState<ElectricPartKind>('aa_battery');
  const [elecSwitch, setElecSwitch] = useState<ElectricPartKind>('toggle_switch');
  const [elecLoad, setElecLoad] = useState<ElectricPartKind>('armature');
  const [chemIng1, setChemIng1] = useState<ChemIngredientId>('cola');
  const [chemIng2, setChemIng2] = useState<ChemIngredientId>('salt');

  // Voice Recorder state
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Scenario Filter
  const [scenarioLabFilter, setScenarioLabFilter] = useState<LabId>('electric');

  if (!isOpen) return null;

  const handleCheckOnlineUpdate = async () => {
    setIsChecking(true);
    setUpdateStatus('در حال بررسی سرور بروزرسانی مراحل...');
    try {
      let manifest: LevelPackManifest;
      const url = progress.updateManifestUrl || './updates/latest-levels.json';

      if (window.desktopAPI && url.startsWith('https://')) {
        manifest = await window.desktopAPI.fetchOnlineManifest(url);
      } else {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`کد وضعیت ${res.status}`);
        manifest = await res.json();
      }

      if (!manifest.levels || !Array.isArray(manifest.levels)) {
        throw new Error('فرمت بسته بروزرسانی معتبر نیست.');
      }

      onAddLevels(manifest.levels, manifest.packId);
      soundEngine.playVictoryFanfare();
      setUpdateStatus(
        `✅ بروزرسانی «${manifest.title}» (نسخه ${manifest.version}) با موفقیت نصب شد و ${manifest.levels.length} مرحله جدید به بازی اضافه گردید!`
      );
    } catch (err) {
      setUpdateStatus(
        `⚠️ خطا در دریافت آنلاین: ${(err as Error).message}. می‌توانید فایل بسته (.json) را به صورت آفلاین بارگذاری کنید.`
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as LevelPackManifest;
        if (parsed.levels && Array.isArray(parsed.levels)) {
          onAddLevels(parsed.levels, parsed.packId || `pack-${Date.now()}`);
          soundEngine.playVictoryFanfare();
          setUpdateStatus(`✅ بسته «${parsed.title || file.name}» با ${parsed.levels.length} مرحله جدید اضافه شد!`);
        }
      } catch {
        setUpdateStatus('❌ فایل انتخاب‌شده معتبر نیست.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCustomPack = async () => {
    const pack: LevelPackManifest = {
      packId: `custom-pack-${Date.now()}`,
      version: '1.0.0',
      title: 'بسته مراحل سفارشی دانشمند کوچولو',
      description: 'ساخته‌شده در کارگاه والدین',
      releasedAt: new Date().toISOString().slice(0, 10),
      levels: customLevels,
    };

    if (window.desktopAPI) {
      await window.desktopAPI.exportPackDialog(pack);
      return;
    }

    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'daneshmand-kocholo-levels.json';
    a.click();
  };

  const handleCreateCustomLevel = () => {
    const existingCount = allLevels.filter((l) => l.lab === newLab).length;
    const nextNum = existingCount + 1;
    const title = newTitle.trim() || `مرحله سفارشی ${nextNum}`;
    const kidPrompt =
      newPrompt.trim() ||
      'قهرمان بابا! این مرحله ویژه رو مخصوص تو ساختم، بیا با هم حلش کنیم!';

    let created: GameLevel;
    if (newLab === 'electric') {
      created = {
        id: `custom-elec-${Date.now()}`,
        lab: 'electric',
        number: nextNum,
        chapter: 9,
        chapterTitle: 'مراحل سفارشی و آپدیت‌شده',
        title,
        kidPrompt,
        scienceTip: 'مرحله اختصاصی طراحی‌شده در کارگاه والدین!',
        boardTheme: elecSource === 'mcb_breaker' ? 'wall' : 'tech',
        requiresSwitchToggle: true,
        slots: [
          { slotId: 'src', partKind: elecSource, x: 20, y: 56 },
          { slotId: 'ctrl', partKind: elecSwitch, x: 50, y: 30 },
          { slotId: 'load', partKind: elecLoad, x: 80, y: 56 },
        ],
        targetLoads: ['load'],
        hintWires: [
          { fromSlot: 'src', fromTerm: 'pos', toSlot: 'ctrl', toTerm: 'in', wireColor: '#ef4444' },
          { fromSlot: 'ctrl', fromTerm: 'out', toSlot: 'load', toTerm: 'in', wireColor: '#f59e0b' },
          { fromSlot: 'load', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
        ],
        isCustomOrUpdate: true,
      };
    } else if (newLab === 'chemistry') {
      created = {
        id: `custom-chem-${Date.now()}`,
        lab: 'chemistry',
        number: nextNum,
        chapter: 9,
        chapterTitle: 'مراحل سفارشی و آپدیت‌شده',
        title,
        kidPrompt,
        scienceTip: 'واکنش شیمیایی ساخته‌شده در کارگاه والدین!',
        availableIngredients: Array.from(new Set([chemIng1, chemIng2])),
        vessels: [
          {
            vesselId: 'v1',
            label: 'شیشه آزمایش ویژه',
            shape: 'bottle',
            requiredIngredients: Array.from(new Set([chemIng1, chemIng2])),
            resultEffect: 'foam_geyser',
            resultColor: '#8b5cf6',
            secondaryColor: '#fde047',
            reactionTitle: 'فوران شگفت‌انگیز!',
          },
        ],
        isCustomOrUpdate: true,
      };
    } else {
      created = {
        id: `custom-phys-${Date.now()}`,
        lab: 'physics',
        number: nextNum,
        chapter: 9,
        chapterTitle: 'مراحل سفارشی و آپدیت‌شده',
        title,
        kidPrompt,
        scienceTip: 'آزمایش آهنربایی اختصاصی کارگاه والدین!',
        mode: 'magnet_explore',
        targetGoalCount: 2,
        items: [
          { id: 'c1', name: 'آچار فولادی', emoji: '🔧', color: '#94a3b8', isMagnetic: true, materialLabel: 'فولاد' },
          { id: 'c2', name: 'کلید آهنی', emoji: '🗝️', color: '#cbd5e1', isMagnetic: true, materialLabel: 'آهن' },
          { id: 'c3', name: 'بلوک چوبی', emoji: '🪵', color: '#b45309', isMagnetic: false, materialLabel: 'چوب' },
        ],
        isCustomOrUpdate: true,
      };
    }

    onAddLevels([created]);
    soundEngine.playVictoryFanfare();
    setNewTitle('');
    setNewPrompt('');
    setUpdateStatus(`✅ مرحله جدید «${created.title}» ساخته شد و به انتهای لیست مراحل اضافه شد!`);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = String(reader.result);
          onUpdateProgress({ customCheerAudioDataUrl: dataUrl });
          soundEngine.customCheerUrl = dataUrl;
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      alert('دسترسی به میکروفون در دسترس نیست.');
    }
  };

  const stopVoiceRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-400/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="./icon.png" alt="icon" className="w-10 h-10 rounded-xl border border-amber-400" />
            <div>
              <h3 className="text-lg font-black text-white">
                مرکز مدیریت، بروزرسانی مراحل و پنل والدین
              </h3>
              <p className="text-xs text-slate-400">
                نسخه ۲.۰.۰ اولترا پرو (گوینده فارسی هوشمند) | مجموع مراحل فعال: {allLevels.length} مرحله ({customLevels.length} مرحله افزوده‌شده)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 px-6 py-3 bg-slate-950/60 border-b border-white/10">
          {[
            { id: 'update', label: '🔄 آپدیت و افزودن مراحل' },
            { id: 'builder', label: '🛠️ ساخت مرحله جدید' },
            { id: 'voice', label: '🎙️ تنظیمات و صدای بابا' },
            { id: 'scenarios', label: '📚 ۲۷۰ سناریو و راهنمای EXE' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                activeTab === t.id
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {updateStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 font-bold text-xs sm:text-sm">
              {updateStatus}
            </div>
          )}

          {activeTab === 'update' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
                <h4 className="font-black text-amber-300 text-base flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  بروزرسانی آنلاین و دریافت مراحل جدید بدون نصب مجدد
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  این برنامه طوری طراحی شده که هر زمان بسته مرحله جدیدی روی سرور یا مخزن گیت‌هاب قرار بگیرد، با یک کلیک مراحل جدید به هر سه بخش بازی اضافه می‌شوند! هم‌اکنون یک بسته آزمایشی (نسخه ۱.۱ شامل مراحل ۹۱ ویژه) آماده آزمایش است:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={progress.updateManifestUrl}
                    onChange={(e) => onUpdateProgress({ updateManifestUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-cyan-300 font-mono"
                    placeholder="./updates/latest-levels.json"
                  />
                  <button
                    type="button"
                    disabled={isChecking}
                    onClick={handleCheckOnlineUpdate}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    بررسی و دریافت مراحل جدید
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
                  <h4 className="font-black text-sky-300">📥 نصب آفلاین فایل بسته مراحل (.json)</h4>
                  <p className="text-xs text-slate-300">
                    حتی بدون اینترنت هم می‌توانید فایل‌های بسته مرحله را از فلش یا کامپیوتر وارد بازی کنید:
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.dkpack"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.desktopAPI) {
                        const pack = await window.desktopAPI.importPackDialog();
                        if (pack?.levels) {
                          onAddLevels(pack.levels, pack.packId);
                          setUpdateStatus(`✅ ${pack.levels.length} مرحله جدید از فایل ویندوز اضافه شد!`);
                        }
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs"
                  >
                    <Upload className="w-4 h-4" />
                    انتخاب فایل بسته مراحل از کامپیوتر
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
                  <h4 className="font-black text-purple-300">📤 خروجی گرفتن از مراحل اضافه‌شده</h4>
                  <p className="text-xs text-slate-300">
                    مراحل سفارشی ساخته‌شده ({customLevels.length} مرحله) را به صورت یک فایل قابل انتقال ذخیره کنید:
                  </p>
                  <button
                    type="button"
                    onClick={handleExportCustomPack}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs"
                  >
                    <Download className="w-4 h-4" />
                    ذخیره فایل بسته مراحل
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="space-y-4 bg-slate-800/70 p-4 rounded-2xl border border-white/10">
              <h4 className="font-black text-amber-300 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                طراحی و افزودن مرحله جدید توسط پدر در ۳۰ ثانیه!
              </h4>

              <div className="grid sm:grid-cols-3 gap-3">
                {(
                  [
                    { id: 'electric', name: '⚡ آزمایشگاه برق' },
                    { id: 'chemistry', name: '🧪 آزمایشگاه شیمی' },
                    { id: 'physics', name: '🧲 آزمایشگاه علوم و آهنربا' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setNewLab(b.id)}
                    className={`py-2.5 rounded-xl font-black text-xs border-2 transition ${
                      newLab === b.id
                        ? 'bg-amber-400 text-slate-950 border-white'
                        : 'bg-slate-900 text-slate-300 border-white/10'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نام مرحله جدید:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثلاً: مرحله ویژه آرمیچر قهرمان بابا!"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">جمله راهنمای صوتی برای پسرتان:</label>
                  <input
                    type="text"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="مثلاً: پسرم بیا این مدار ویژه رو با هم ببندیم!"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                  />
                </div>
              </div>

              {newLab === 'electric' && (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">منبع انرژی / تابلو:</label>
                    <select
                      value={elecSource}
                      onChange={(e) => setElecSource(e.target.value as ElectricPartKind)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    >
                      {(['aa_battery', 'battery_9v', 'solar_panel', 'hand_dynamo', 'mcb_breaker'] as ElectricPartKind[]).map((k) => (
                        <option key={k} value={k}>{PART_NAMES_FA[k]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">کلید کنترل:</label>
                    <select
                      value={elecSwitch}
                      onChange={(e) => setElecSwitch(e.target.value as ElectricPartKind)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    >
                      {(['toggle_switch', 'push_button', 'wall_switch_1', 'dimmer_knob', 'light_sensor'] as ElectricPartKind[]).map((k) => (
                        <option key={k} value={k}>{PART_NAMES_FA[k]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">قطعه مصرف‌کننده:</label>
                    <select
                      value={elecLoad}
                      onChange={(e) => setElecLoad(e.target.value as ElectricPartKind)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    >
                      {(['armature', 'fan', 'bulb_warm', 'toy_car', 'robot_buddy', 'electromagnet', 'ceiling_lamp', 'buzzer'] as ElectricPartKind[]).map((k) => (
                        <option key={k} value={k}>{PART_NAMES_FA[k]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {newLab === 'chemistry' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-fuchsia-200 mb-1">ماده اول:</label>
                    <select
                      value={chemIng1}
                      onChange={(e) => setChemIng1(e.target.value as ChemIngredientId)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    >
                      {(['cola', 'orange_soda', 'vinegar', 'lemon_juice', 'cabbage_juice', 'milk'] as ChemIngredientId[]).map((k) => (
                        <option key={k} value={k}>{CHEM_INGREDIENT_META[k].name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-fuchsia-200 mb-1">ماده واکنش‌دهنده دوم:</label>
                    <select
                      value={chemIng2}
                      onChange={(e) => setChemIng2(e.target.value as ChemIngredientId)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                    >
                      {(['salt', 'mentos', 'baking_soda', 'fizz_tablet', 'dish_soap'] as ChemIngredientId[]).map((k) => (
                        <option key={k} value={k}>{CHEM_INGREDIENT_META[k].name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateCustomLevel}
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition"
              >
                ✨ افزودن فوری این مرحله جدید به بازی
              </button>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
                <label className="block text-xs font-black text-amber-300">
                  نام پسر گلتان (برای نمایش و خطاب در آزمایشگاه):
                </label>
                <input
                  type="text"
                  value={progress.childName}
                  onChange={(e) => onUpdateProgress({ childName: e.target.value })}
                  className="w-full sm:w-72 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/20 text-white font-bold text-sm"
                  placeholder="دانشمند کوچولو"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-amber-400/40 space-y-3">
                <h4 className="font-black text-amber-300">
                  🗣️ انتخاب گوینده هوشمند فارسی (آموزش قدم‌به‌قدم و قصه‌گوی علمی)
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  در تمام مراحل، گوینده فارسی به صورت صوتی به فرزندتان می‌گوید چه کاری انجام دهد و پس از انجام آزمایش، اتفاق علمی را با زبان کودکانه توضیح می‌دهد:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.narratorVoice = 'fa-IR-DilaraNeural';
                      onUpdateProgress({ narratorVoice: 'fa-IR-DilaraNeural' });
                      soundEngine.speakPersian(
                        `سلام ${progress.childName}! من خاله دلارا هستم و توی همه آزمایش‌ها کمکت می‌کنم!`,
                        'welcome_home'
                      );
                    }}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm border-2 transition ${
                      (progress.narratorVoice || 'fa-IR-DilaraNeural') === 'fa-IR-DilaraNeural'
                        ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-900 text-slate-200 border-white/15'
                    }`}
                  >
                    👩‍🔬 صدای خاله دلارا (مهربان و کودکانه - پیش‌فرض)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.narratorVoice = 'fa-IR-FaridNeural';
                      onUpdateProgress({ narratorVoice: 'fa-IR-FaridNeural' });
                      soundEngine.speakPersian(
                        `سلام ${progress.childName} قهرمان! من عمو فرید هستم! بیا با هم آزمایش‌های باحال انجام بدیم!`
                      );
                    }}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm border-2 transition ${
                      progress.narratorVoice === 'fa-IR-FaridNeural'
                        ? 'bg-cyan-400 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-900 text-slate-200 border-white/15'
                    }`}
                  >
                    👨‍🔬 صدای عمو فرید (انرژی‌دار و علمی)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3">
                <h4 className="font-black text-emerald-300">
                  🎙️ ضبط صدای واقعی پدر برای تشویق پایان مراحل!
                </h4>
                <p className="text-xs text-slate-300">
                  می‌توانید صدای خودتان را (مثلاً: «آفرین پسرم! بهت افتخار می‌کنم دانشمند کوچولوی بابا!») ضبط کنید تا در پایان هر آزمایش پخش شود:
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {!recording ? (
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs"
                    >
                      <Mic className="w-4 h-4" />
                      شروع ضبط صدای بابا
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs animate-pulse"
                    >
                      <Square className="w-4 h-4" />
                      توقف و ذخیره صدا
                    </button>
                  )}

                  {progress.customCheerAudioDataUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => new Audio(progress.customCheerAudioDataUrl).play()}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                      >
                        ▶️ پخش صدای ذخیره‌شده
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateProgress({ customCheerAudioDataUrl: undefined });
                          soundEngine.customCheerUrl = undefined;
                        }}
                        className="p-2.5 rounded-xl bg-slate-700 hover:bg-rose-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-400/35 space-y-2">
                <h4 className="font-black text-cyan-300 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  راهنمای اجرای فایل نصبی ویندوز (.EXE)
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  ۱. در ریشه پروژه فایل <code className="text-amber-300 font-mono">build-windows-exe.bat</code> قرار داده شده است؛ روی سیستم ویندوز با دو بار کلیک روی آن، فایل نصبی <code className="text-amber-300 font-mono">Daneshmand Kocholo Setup.exe</code> و نسخه پرتابل بدون نیاز به نصب در پوشه <code className="text-amber-300 font-mono">release/</code> ساخته می‌شود.
                  <br />
                  ۲. همچنین گردش‌کار خودکار گیت‌هاب (<code className="text-amber-300 font-mono">.github/workflows/build-windows-exe.yml</code>) تنظیم شده تا در تب Actions گیت‌هاب به صورت ابری فایل <code className="text-amber-300 font-mono">.exe</code> ویندوز را بسازد و آماده دانلود کند!
                </p>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-black text-amber-300 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  مرورگر سریع تمام سناریوها (پرش مستقیم به هر مرحله)
                </h4>
                <div className="flex gap-1.5">
                  {(
                    [
                      { id: 'electric', label: 'برق (۹۰+)' },
                      { id: 'chemistry', label: 'شیمی (۹۰+)' },
                      { id: 'physics', label: 'علوم (۹۰+)' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setScenarioLabFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                        scenarioLabFilter === f.id
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {allLevels
                  .filter((l) => l.lab === scenarioLabFilter)
                  .map((lvl) => {
                    const done = Boolean(progress.completedIds[lvl.id]);
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => {
                          onJumpToLevel(lvl.lab, lvl.id);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-right transition"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white">
                            قسمت {lvl.number}: {lvl.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{lvl.chapterTitle}</span>
                        </div>
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 shrink-0">
                            اجرا ◀
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

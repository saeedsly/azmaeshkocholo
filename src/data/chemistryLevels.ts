import {
  ChemistryLevel,
  ChemIngredientId,
  ChemVesselSpec,
} from '../types/game';

export interface IngredientMeta {
  id: ChemIngredientId;
  name: string;
  emoji: string;
  kind: 'liquid' | 'powder' | 'solid' | 'tool';
  color: string;
}

export const CHEM_INGREDIENT_META: Record<ChemIngredientId, IngredientMeta> = {
  cola: { id: 'cola', name: 'نوشابه سیاه', emoji: '🥤', kind: 'liquid', color: '#3b1d0e' },
  orange_soda: { id: 'orange_soda', name: 'نوشابه پرتقالی', emoji: '🧃', kind: 'liquid', color: '#f97316' },
  water: { id: 'water', name: 'آب زلال', emoji: '💧', kind: 'liquid', color: '#38bdf8' },
  warm_water: { id: 'warm_water', name: 'آب گرم', emoji: '♨️', kind: 'liquid', color: '#fb7185' },
  vinegar: { id: 'vinegar', name: 'سرکه سفید', emoji: '🍶', kind: 'liquid', color: '#e2e8f0' },
  lemon_juice: { id: 'lemon_juice', name: 'آبلیمو تازه', emoji: '🍋', kind: 'liquid', color: '#fde047' },
  oil: { id: 'oil', name: 'روغن مایع', emoji: '🫗', kind: 'liquid', color: '#facc15' },
  milk: { id: 'milk', name: 'شیر سفید', emoji: '🥛', kind: 'liquid', color: '#f8fafc' },
  honey: { id: 'honey', name: 'عسل طلایی', emoji: '🍯', kind: 'liquid', color: '#d97706' },
  cabbage_juice: { id: 'cabbage_juice', name: 'آب کلم بنفش', emoji: '🟣', kind: 'liquid', color: '#9333ea' },
  dish_soap: { id: 'dish_soap', name: 'مایع ظرفشویی', emoji: '🫧', kind: 'liquid', color: '#10b981' },
  red_dye: { id: 'red_dye', name: 'قطره رنگ قرمز', emoji: '🔴', kind: 'liquid', color: '#ef4444' },
  blue_dye: { id: 'blue_dye', name: 'قطره رنگ آبی', emoji: '🔵', kind: 'liquid', color: '#2563eb' },
  yellow_dye: { id: 'yellow_dye', name: 'قطره رنگ زرد', emoji: '🟡', kind: 'liquid', color: '#eab308' },
  salt: { id: 'salt', name: 'نمکدان نمک', emoji: '🧂', kind: 'powder', color: '#f1f5f9' },
  baking_soda: { id: 'baking_soda', name: 'جوش شیرین', emoji: '🥄', kind: 'powder', color: '#e2e8f0' },
  sugar: { id: 'sugar', name: 'شکر شیرین', emoji: '🍬', kind: 'powder', color: '#fef9c3' },
  mentos: { id: 'mentos', name: 'قرص نعنایی', emoji: '⚪', kind: 'solid', color: '#cbd5e1' },
  fizz_tablet: { id: 'fizz_tablet', name: 'قرص جوشان', emoji: '💊', kind: 'solid', color: '#fb923c' },
  cornstarch: { id: 'cornstarch', name: 'نشاسته ذرت', emoji: '🥣', kind: 'powder', color: '#fef3c7' },
  ice_cube: { id: 'ice_cube', name: 'تکه یخ', emoji: '🧊', kind: 'solid', color: '#bae6fd' },
  raisins: { id: 'raisins', name: 'کشمش', emoji: '🍇', kind: 'solid', color: '#581c87' },
  pepper: { id: 'pepper', name: 'پودر فلفل', emoji: '🌶️', kind: 'powder', color: '#475569' },
  sand: { id: 'sand', name: 'شن ساحلی', emoji: '🏖️', kind: 'powder', color: '#d6a85a' },
  cotton_filter: { id: 'cotton_filter', name: 'صافی پنبه', emoji: '☁️', kind: 'solid', color: '#ffffff' },
  muddy_water: { id: 'muddy_water', name: 'آب گل‌آلود', emoji: '🤎', kind: 'liquid', color: '#78553a' },
  glitter: { id: 'glitter', name: 'اکلیل ستاره‌ای', emoji: '✨', kind: 'powder', color: '#f472b6' },
  yeast: { id: 'yeast', name: 'پودر مخمر', emoji: '🍞', kind: 'powder', color: '#fcd34d' },
  stir_spoon: { id: 'stir_spoon', name: 'قاشق همزن', emoji: '🥄', kind: 'tool', color: '#94a3b8' },
};

const CHEM_CHAPTERS: Record<number, string> = {
  1: 'فصل ۱: فواره‌های نوشابه، نمک و گازهای هیجان‌انگیز!',
  2: 'فصل ۲: کارخانه رنگ‌سازی و ترکیب رنگ‌های جادویی',
  3: 'فصل ۳: مایع‌های لایه‌لایه، روغن و چراغ گدازه‌ای',
  4: 'فصل ۴: حل شدن در دو شیشه! (نمک، شکر، شن و آب گرم)',
  5: 'فصل ۵: شیر جادویی، فرار فلفل‌ها و حباب‌های غول‌پیکر',
  6: 'فصل ۶: تغییر رنگ شگفت‌انگیز با عصاره کلم بنفش!',
  7: 'فصل ۷: آزمایش‌های یخی، برف مصنوعی و کریستال',
  8: 'فصل ۸: خمیرهای عجیب! اسلایم، اوبلک و فوم رنگین‌کمان',
  9: 'فصل ۹: استاد بزرگ آزمایشگاه شیمی و تصفیه آب!',
};

interface ChemBlueprint {
  title: string;
  kidPrompt: string;
  scienceTip: string;
  availableIngredients: ChemIngredientId[];
  vessels: ChemVesselSpec[];
}

function uniqueIngs(vessels: ChemVesselSpec[], extra: ChemIngredientId[] = []): ChemIngredientId[] {
  const set = new Set<ChemIngredientId>();
  vessels.forEach((v) => v.requiredIngredients.forEach((i) => set.add(i)));
  extra.forEach((i) => set.add(i));
  return Array.from(set);
}

function bp(
  title: string,
  kidPrompt: string,
  scienceTip: string,
  vessels: ChemVesselSpec[],
  extra: ChemIngredientId[] = []
): ChemBlueprint {
  return {
    title,
    kidPrompt,
    scienceTip,
    vessels,
    availableIngredients: uniqueIngs(vessels, extra),
  };
}

const CHEM_BLUEPRINTS: ChemBlueprint[] = [
  // ================= CHAPTER 1 (1-10): Soda + Salt, Two Bottles, Volcano & Balloons =================
  bp(
    'دو شیشه شگفت‌انگیز: نوشابه و نمک!',
    'دانشمند کوچولو! توی شیشه اول نوشابه و نمک بریز و توی شیشه دوم آب و نمک بریز؛ ببین چه اتفاق باحالی می‌افته!',
    'دانه‌های زبر نمک گاز مخفی داخل نوشابه (دی‌اکسید کربن) را یک‌دفعه آزاد می‌کنند و فواره کف درست می‌شود، ولی آب معمولی گاز ندارد!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه اول (نوشابه)',
        shape: 'bottle',
        requiredIngredients: ['cola', 'salt'],
        resultEffect: 'foam_geyser',
        resultColor: '#78350f',
        secondaryColor: '#fde68a',
        reactionTitle: 'فواره کف نوشابه!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه دوم (آب)',
        shape: 'bottle',
        requiredIngredients: ['water', 'salt'],
        resultEffect: 'dissolve_calm',
        resultColor: '#7dd3fc',
        reactionTitle: 'حل شدن آرام نمک!',
      },
    ]
  ),
  bp(
    'مسابقه دو فواره: نوشابه سیاه و پرتقالی با قرص نعنا!',
    'توی بطری اول نوشابه سیاه و قرص نعنایی بنداز، و توی بطری دوم نوشابه پرتقالی و قرص نعنایی!',
    'سطح پر از سوراخ‌های ریز قرص نعنایی هزاران حباب گاز را در یک ثانیه آزاد می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری سیاه',
        shape: 'bottle',
        requiredIngredients: ['cola', 'mentos'],
        resultEffect: 'foam_geyser',
        resultColor: '#451a03',
        secondaryColor: '#fcd34d',
        reactionTitle: 'فواره قهوه‌ای بلند!',
      },
      {
        vesselId: 'v2',
        label: 'بطری پرتقالی',
        shape: 'bottle',
        requiredIngredients: ['orange_soda', 'mentos'],
        resultEffect: 'foam_geyser',
        resultColor: '#ea580c',
        secondaryColor: '#fed7aa',
        reactionTitle: 'فواره نارنجی درخشان!',
      },
    ]
  ),
  bp(
    'کوه آتشفشان قرمز جوشان!',
    'توی دهانه کوه آتشفشان سرکه، رنگ قرمز و جوش شیرین بریز تا آتشفشان فوران کنه!',
    'ترکیب سرکه و جوش شیرین گاز فراوانی تولید می‌کند که مثل گدازه آتشفشان بیرون می‌جوشد!',
    [
      {
        vesselId: 'v1',
        label: 'کوه آتشفشان',
        shape: 'volcano',
        requiredIngredients: ['vinegar', 'red_dye', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#ef4444',
        secondaryColor: '#fca5a5',
        reactionTitle: 'فوران آتشفشان قرمز!',
      },
    ]
  ),
  bp(
    'باد کردن بادکنک بدون فوت کردن!',
    'توی بطری بادکنک‌دار آبلیمو و جوش شیرین بریز تا گاز جادویی خودش بادکنک رو باد کنه!',
    'گاز تولیدشده جایی برای فرار ندارد، پس به بالای بطری می‌رود و بادکنک را پر از گاز می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری بادکنک‌دار',
        shape: 'balloon_bottle',
        requiredIngredients: ['lemon_juice', 'baking_soda'],
        resultEffect: 'balloon_inflate',
        resultColor: '#fde047',
        secondaryColor: '#ec4899',
        reactionTitle: 'بادکنک خودبه‌خود باد شد!',
      },
    ]
  ),
  bp(
    'رقص کشمش‌های بازیگوش در نوشابه!',
    'توی شیشه اول نوشابه پرتقالی و کشمش بریز و با شیشه دوم (آب و کشمش) مقایسه کن!',
    'حباب‌های گاز به پوست چروک کشمش می‌چسبند و مثل جلیقه نجات آن را بالا می‌برند، بالا می‌ترکند و کشمش دوباره پایین می‌آید!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه گازدار',
        shape: 'beaker',
        requiredIngredients: ['orange_soda', 'raisins'],
        resultEffect: 'dancing_raisins',
        resultColor: '#fb923c',
        reactionTitle: 'کشمش‌ها می‌رقصند!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه آب ساده',
        shape: 'beaker',
        requiredIngredients: ['water', 'raisins'],
        resultEffect: 'dissolve_calm',
        resultColor: '#38bdf8',
        reactionTitle: 'کشمش ته آب ماند!',
      },
    ]
  ),
  bp(
    'معجون فوم لیمویی پف‌دار!',
    'آبلیمو، مایع ظرفشویی و جوش شیرین رو توی ارلن بریز تا فوم نرم و خوشبو بسازیم!',
    'مایع ظرفشویی گازهای آزادشده را در میلیون‌ها حباب ریز حبس می‌کند و کف غلیظ می‌سازد.',
    [
      {
        vesselId: 'v1',
        label: 'ارلن آزمایشگاهی',
        shape: 'flask',
        requiredIngredients: ['lemon_juice', 'dish_soap', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#a3e635',
        secondaryColor: '#ecfccb',
        reactionTitle: 'کف لیمویی غول‌پیکر!',
      },
    ]
  ),
  bp(
    'مسابقه قرص جوشان: آب گرم برنده میشه یا آب سرد؟',
    'توی شیشه اول آب گرم و قرص جوشان بنداز، توی شیشه دوم آب معمولی و قرص جوشان!',
    'در آب گرم مولکول‌ها تندتر حرکت می‌کنند، برای همین قرص جوشان خیلی سریع‌تر می‌جوشد!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر آب گرم',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'fizz_tablet'],
        resultEffect: 'foam_geyser',
        resultColor: '#fb7185',
        secondaryColor: '#ffe4e6',
        reactionTitle: 'جوشش فوق سریع!',
      },
      {
        vesselId: 'v2',
        label: 'بِشِر آب خنک',
        shape: 'beaker',
        requiredIngredients: ['water', 'fizz_tablet'],
        resultEffect: 'dancing_raisins',
        resultColor: '#38bdf8',
        reactionTitle: 'حباب‌های آرام!',
      },
    ]
  ),
  bp(
    'بادکنک دوقلوی سرکه‌ای و آبلیمویی',
    'دو تا بطری بادکنک‌دار رو یکی با سرکه و جوش شیرین، و یکی با آبلیمو و جوش شیرین باد کن!',
    'هم سرکه و هم آبلیمو خاصیت اسیدی ملایم دارند و با جوش شیرین گاز می‌سازند.',
    [
      {
        vesselId: 'v1',
        label: 'بادکنک آبی',
        shape: 'balloon_bottle',
        requiredIngredients: ['vinegar', 'baking_soda'],
        resultEffect: 'balloon_inflate',
        resultColor: '#93c5fd',
        secondaryColor: '#3b82f6',
        reactionTitle: 'بادکنک اول پر شد!',
      },
      {
        vesselId: 'v2',
        label: 'بادکنک زرد',
        shape: 'balloon_bottle',
        requiredIngredients: ['lemon_juice', 'baking_soda'],
        resultEffect: 'balloon_inflate',
        resultColor: '#fef08a',
        secondaryColor: '#eab308',
        reactionTitle: 'بادکنک دوم پر شد!',
      },
    ]
  ),
  bp(
    'نوشابه و شکر: فواره حباب‌دار شیرین!',
    'بیا امتحان کنیم اگر توی نوشابه سیاه شکر بریزیم چی میشه!',
    'دانه‌های شکر هم دقیقاً مثل نمک مراکز تشکیل حباب می‌سازند و گاز نوشابه را فوران می‌دهند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری نوشابه',
        shape: 'bottle',
        requiredIngredients: ['cola', 'sugar'],
        resultEffect: 'foam_geyser',
        resultColor: '#5c2d16',
        secondaryColor: '#fef3c7',
        reactionTitle: 'فواره شیرین نوشابه!',
      },
    ]
  ),
  bp(
    'آتشفشان کهکشانی اکلیلی (جشن پایان فصل ۱)',
    'سرکه، رنگ آبی، اکلیل ستاره‌ای و جوش شیرین رو ترکیب کن تا آتشفشان کهکشانی فوران کنه!',
    'آفرین دانشمند کوچولو! حالا می‌دانی گازها چطور از مایع‌ها آزاد می‌شوند!',
    [
      {
        vesselId: 'v1',
        label: 'آتشفشان کهکشانی',
        shape: 'volcano',
        requiredIngredients: ['vinegar', 'blue_dye', 'glitter', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#6366f1',
        secondaryColor: '#f472b6',
        reactionTitle: 'فوران ستاره‌ای درخشان!',
      },
    ]
  ),

  // ================= CHAPTER 2 (11-20): Color Mixing Factory =================
  bp(
    'جادوی ساخت رنگ نارنجی!',
    'در بِشِر آب زلال بریز، بعد قطره قرمز و قطره زرد اضافه کن و با قاشق هم بزن!',
    'قرمز و زرد دو رنگ اصلی هستند که از ترکیبشان رنگ نارنجی گرم ساخته می‌شود!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر رنگ‌سازی',
        shape: 'beaker',
        requiredIngredients: ['water', 'red_dye', 'yellow_dye', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#f97316',
        reactionTitle: 'رنگ نارنجی ساخته شد!',
      },
    ]
  ),
  bp(
    'جادوی ساخت رنگ سبز چمنی!',
    'آب، رنگ آبی و رنگ زرد رو توی ظرف بریز و هم بزن تا رنگ سبز درست بشه!',
    'ترکیب آبی آسمانی و زرد خورشیدی، رنگ سبز طبیعت را به وجود می‌آورد!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن رنگ سبز',
        shape: 'flask',
        requiredIngredients: ['water', 'blue_dye', 'yellow_dye', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#22c55e',
        reactionTitle: 'سبز زمردی درخشان!',
      },
    ]
  ),
  bp(
    'جادوی ساخت رنگ بنفش شاهانه!',
    'آب، قطره قرمز و قطره آبی رو با هم مخلوط کن تا بنفش خوشگل بسازی!',
    'ترکیب قرمز و آبی رنگ بنفش زیبا را می‌سازد.',
    [
      {
        vesselId: 'v1',
        label: 'ارلن بنفش',
        shape: 'flask',
        requiredIngredients: ['water', 'red_dye', 'blue_dye', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#a855f7',
        reactionTitle: 'بنفش جادویی!',
      },
    ]
  ),
  bp(
    'دو شیشه رنگین: یکی سبز، یکی نارنجی!',
    'توی شیشه اول رنگ سبز بساز و توی شیشه دوم رنگ نارنجی بساز!',
    'با فقط سه رنگ اصلی قرمز، زرد و آبی می‌توانیم دنیایی از رنگ‌ها بسازیم!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه سبز',
        shape: 'beaker',
        requiredIngredients: ['water', 'blue_dye', 'yellow_dye'],
        resultEffect: 'color_mix',
        resultColor: '#16a34a',
        reactionTitle: 'سبز آماده شد!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه نارنجی',
        shape: 'beaker',
        requiredIngredients: ['water', 'red_dye', 'yellow_dye'],
        resultEffect: 'color_mix',
        resultColor: '#ea580c',
        reactionTitle: 'نارنجی آماده شد!',
      },
    ]
  ),
  bp(
    'ساخت شیر توت‌فرنگی صورتی ملایم!',
    'وقتی رنگ قرمز رو به جای آب توی شیر سفید بریزیم چه رنگی میشه؟ امتحان کن!',
    'سفیدی شیر رنگ قرمز تند را روشن می‌کند و رنگ صورتی ملایم می‌سازد!',
    [
      {
        vesselId: 'v1',
        label: 'لیوان شیر رنگی',
        shape: 'beaker',
        requiredIngredients: ['milk', 'red_dye', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#f472b6',
        reactionTitle: 'صورتی خوش‌رنگ!',
      },
    ]
  ),
  bp(
    'شیر آسمانی آبی و شیر موزی زرد در دو شیشه!',
    'شیشه اول رو شیر آبی آسمانی کن و شیشه دوم رو شیر زرد موزی!',
    'رنگ سفید پایه همه رنگ‌ها را پاستلی و لطیف می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'شیر آسمانی',
        shape: 'beaker',
        requiredIngredients: ['milk', 'blue_dye'],
        resultEffect: 'color_mix',
        resultColor: '#60a5fa',
        reactionTitle: 'آبی پاستلی!',
      },
      {
        vesselId: 'v2',
        label: 'شیر طلایی',
        shape: 'beaker',
        requiredIngredients: ['milk', 'yellow_dye'],
        resultEffect: 'color_mix',
        resultColor: '#fde047',
        reactionTitle: 'زرد پاستلی!',
      },
    ]
  ),
  bp(
    'معجون کهربایی با هر سه رنگ اصلی!',
    'بیا قرمز، آبی و زرد رو با هم توی آب بریزیم و هم بزنیم ببینیم چه رنگی میشه!',
    'وقتی هر سه رنگ اصلی با هم ترکیب شوند، رنگ قهوه‌ای و کهربایی درست می‌شود.',
    [
      {
        vesselId: 'v1',
        label: 'ارلن سه رنگ',
        shape: 'flask',
        requiredIngredients: ['water', 'red_dye', 'blue_dye', 'yellow_dye', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#92400e',
        reactionTitle: 'کهربایی خاص!',
      },
    ]
  ),
  bp(
    'اکسیر فیروزه‌ای درخشان با اکلیل!',
    'آب، رنگ آبی، کمی زرد و اکلیل ستاره‌ای رو ترکیب کن!',
    'ذرات اکلیل نور را بازتاب می‌دهند و در مایع معلق می‌چرخند.',
    [
      {
        vesselId: 'v1',
        label: 'شیشه فیروزه‌ای',
        shape: 'flask',
        requiredIngredients: ['water', 'blue_dye', 'glitter', 'stir_spoon'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#06b6d4',
        secondaryColor: '#f472b6',
        reactionTitle: 'اکسیر الماسی!',
      },
    ]
  ),
  bp(
    'فواره سبز جوشان رنگ‌سازی!',
    'اول با رنگ آبی و زرد در سرکه رنگ سبز بساز، بعد با جوش شیرین فواره‌اش کن!',
    'می‌توانیم آزمایش ترکیب رنگ و آزمایش تولید گاز را با هم ترکیب کنیم!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن جوشان سبز',
        shape: 'flask',
        requiredIngredients: ['vinegar', 'blue_dye', 'yellow_dye', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#22c55e',
        secondaryColor: '#bbf7d0',
        reactionTitle: 'فوران سبز جادویی!',
      },
    ]
  ),
  bp(
    'جشنواره رنگین‌کمان دو شیشه‌ای (بنفش و سبز)',
    'در شیشه اول بنفش اکلیلی و در شیشه دوم سبز اکلیلی بساز!',
    'تبریک استاد رنگ‌ها! تمام ترکیب‌های رنگی را یاد گرفتی!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه بنفش',
        shape: 'flask',
        requiredIngredients: ['water', 'red_dye', 'blue_dye', 'glitter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#9333ea',
        reactionTitle: 'بنفش ستاره‌ای!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه سبز',
        shape: 'flask',
        requiredIngredients: ['water', 'blue_dye', 'yellow_dye', 'glitter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#10b981',
        reactionTitle: 'سبز ستاره‌ای!',
      },
    ]
  ),

  // ================= CHAPTER 3 (21-30): Density Layers, Oil & Water, Lava Lamps =================
  bp(
    'روغن و آب قاطی نمی‌شوند!',
    'توی شیشه آب آبی بریز و بعد روش روغن مایع اضافه کن؛ ببین روغن کجا می‌ایسته!',
    'روغن از آب سبک‌تر (کم‌چگال‌تر) است، برای همین همیشه مثل یک قایق طلایی روی آب شناور می‌ماند!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه لایه‌ای',
        shape: 'beaker',
        requiredIngredients: ['water', 'blue_dye', 'oil'],
        resultEffect: 'density_layers',
        resultColor: '#2563eb',
        secondaryColor: '#facc15',
        reactionTitle: 'دو لایه جداگانه آبی و طلایی!',
      },
    ]
  ),
  bp(
    'هم زدن آب و روغن — آیا قاطی می‌شوند؟',
    'آب قرمز و روغن رو بریز و با قاشق حسابی هم بزن؛ ببین دوباره از هم جدا میشن!',
    'مولکول‌های آب فقط دوست دارند دست مولکول‌های آب را بگیرند و روغن را کنار می‌زنند!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن آزمایش',
        shape: 'flask',
        requiredIngredients: ['water', 'red_dye', 'oil', 'stir_spoon'],
        resultEffect: 'density_layers',
        resultColor: '#ef4444',
        secondaryColor: '#fde047',
        reactionTitle: 'دوباره از هم جدا شدند!',
      },
    ]
  ),
  bp(
    'ساخت چراغ گدازه‌ای جادویی (لاوا لمپ قرمز)!',
    'آب، رنگ قرمز و روغن بریز، بعد یک قرص جوشان بنداز توش تا گوی‌های قرمز بالا و پایین برقصن!',
    'قرص جوشان ته آب حباب می‌سازد و قطره‌های آب رنگی را از دل روغن بالا می‌برد و دوباره پایین می‌افتند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری چراغ گدازه‌ای',
        shape: 'bottle',
        requiredIngredients: ['water', 'red_dye', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#ef4444',
        secondaryColor: '#facc15',
        reactionTitle: 'چراغ گدازه‌ای زنده شد!',
      },
    ]
  ),
  bp(
    'چراغ گدازه‌ای اقیانوسی آبی!',
    'حالا یک چراغ گدازه‌ای با رنگ آبی اقیانوسی، روغن و قرص جوشان بساز!',
    'چراغ گدازه‌ای هم مفهوم چگالی و هم تولید گاز را یک‌جا نشان می‌دهد!',
    [
      {
        vesselId: 'v1',
        label: 'لاوا لمپ آبی',
        shape: 'bottle',
        requiredIngredients: ['water', 'blue_dye', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#2563eb',
        secondaryColor: '#fde047',
        reactionTitle: 'حباب‌های اقیانوسی!',
      },
    ]
  ),
  bp(
    'برج سه‌طبقه مایعات: عسل، آب و روغن!',
    'عسل سنگین، آب آبی و روغن سبک رو توی شیشه بریز تا یک برج ۳ طبقه بسازی!',
    'عسل از همه سنگین‌تر است و ته می‌رود، آب وسط می‌ایستد و روغن بالای سر همه قرار می‌گیرد!',
    [
      {
        vesselId: 'v1',
        label: 'استوانه سه طبقه',
        shape: 'bottle',
        requiredIngredients: ['honey', 'water', 'blue_dye', 'oil'],
        resultEffect: 'density_layers',
        resultColor: '#d97706',
        secondaryColor: '#3b82f6',
        reactionTitle: 'برج جادویی ۳ لایه!',
      },
    ]
  ),
  bp(
    'دو چراغ گدازه‌ای هم‌زمان (سبز و بنفش)!',
    'در بطری اول چراغ گدازه‌ای قرمز و در بطری دوم چراغ گدازه‌ای آبی روشن کن!',
    'هر بطری مثل یک کهکشان رنگی می‌جوشد و می‌درخشد!',
    [
      {
        vesselId: 'v1',
        label: 'گدازه یاقوتی',
        shape: 'bottle',
        requiredIngredients: ['water', 'red_dye', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#e11d48',
        secondaryColor: '#fde047',
        reactionTitle: 'گدازه یاقوتی!',
      },
      {
        vesselId: 'v2',
        label: 'گدازه لاجوردی',
        shape: 'bottle',
        requiredIngredients: ['water', 'blue_dye', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#1d4ed8',
        secondaryColor: '#fde047',
        reactionTitle: 'گدازه لاجوردی!',
      },
    ]
  ),
  bp(
    'تکه یخ معلق بین آب و روغن!',
    'آب، روغن و یک تکه یخ بنداز توی ظرف! ببین یخ کجا می‌ایسته!',
    'یخ از آب سبک‌تر ولی از روغن کمی سنگین‌تر است، پس دقیقاً مرز وسط می‌ایستد!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر یخ و روغن',
        shape: 'beaker',
        requiredIngredients: ['water', 'oil', 'ice_cube'],
        resultEffect: 'density_layers',
        resultColor: '#38bdf8',
        secondaryColor: '#facc15',
        reactionTitle: 'یخ وسط مرز ایستاد!',
      },
    ]
  ),
  bp(
    'دوستی آب و روغن با مایع ظرفشویی!',
    'آب رنگی و روغن همیشه قهرند؛ اما مایع ظرفشویی بریز و هم بزن تا آشتی کنند!',
    'مایع ظرفشویی یک سرش دوست آب است و یک سرش دوست چربی؛ برای همین ظرف‌های چرب را تمیز می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن امولسیون',
        shape: 'flask',
        requiredIngredients: ['water', 'oil', 'dish_soap', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#84cc16',
        reactionTitle: 'آب و روغن مخلوط شدند!',
      },
    ]
  ),
  bp(
    'لاوا لمپ کهکشانی اکلیلی!',
    'آب آبی، روغن، اکلیل ستاره‌ای و قرص جوشان بریز تا ستاره‌ها بالا و پایین پرواز کنن!',
    'اکلیل‌ها همراه حباب‌های گاز در روغن سفر فضایی می‌کنند.',
    [
      {
        vesselId: 'v1',
        label: 'بطری فضایی',
        shape: 'bottle',
        requiredIngredients: ['water', 'blue_dye', 'oil', 'glitter', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#4f46e5',
        secondaryColor: '#f472b6',
        reactionTitle: 'کهکشان زنده!',
      },
    ]
  ),
  bp(
    'آتشفشان زیر دریا در روغن (پایان فصل ۳)',
    'آبلیمو، رنگ قرمز، روغن و جوش شیرین بریز تا حباب‌های آتشفشانی از دل روغن عبور کنن!',
    'استاد لایه‌ها و چگالی شدی!',
    [
      {
        vesselId: 'v1',
        label: 'استوانه زیر دریا',
        shape: 'bottle',
        requiredIngredients: ['lemon_juice', 'red_dye', 'oil', 'baking_soda'],
        resultEffect: 'lava_lamp',
        resultColor: '#dc2626',
        secondaryColor: '#facc15',
        reactionTitle: 'فوران زیر دریایی!',
      },
    ]
  ),

  // ================= CHAPTER 4 (31-40): Dissolving vs Not Dissolving =================
  bp(
    'دو شیشه مقایسه: نمک غیب میشه ولی شن نه!',
    'در شیشه اول آب و نمک بریز و هم بزن؛ در شیشه دوم آب و شن بریز و هم بزن!',
    'نمک در آب حل می‌شود و نامرئی می‌گردد، اما دانه‌های شن در آب حل نمی‌شوند و ته شیشه جمع می‌شوند!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه نمک (حل‌شدنی)',
        shape: 'beaker',
        requiredIngredients: ['water', 'salt', 'stir_spoon'],
        resultEffect: 'dissolve_calm',
        resultColor: '#bae6fd',
        reactionTitle: 'نمک کاملاً حل و نامرئی شد!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه شن (حل‌نشدنی)',
        shape: 'beaker',
        requiredIngredients: ['water', 'sand', 'stir_spoon'],
        resultEffect: 'density_layers',
        resultColor: '#d6a85a',
        secondaryColor: '#38bdf8',
        reactionTitle: 'شن ته لیوان نشست!',
      },
    ]
  ),
  bp(
    'شکر شیرین در آب گرم در برابر آب سرد!',
    'در شیشه اول آب گرم و شکر بریز، در شیشه دوم آب خنک و شکر!',
    'گرما باعث می‌شود بلورهای شکر خیلی تندتر در آب باز و حل شوند (مثل چای شیرین!).',
    [
      {
        vesselId: 'v1',
        label: 'آب گرم + شکر',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'sugar', 'stir_spoon'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#fda4af',
        reactionTitle: 'سریع حل شد!',
      },
      {
        vesselId: 'v2',
        label: 'آب سرد + شکر',
        shape: 'beaker',
        requiredIngredients: ['water', 'sugar', 'stir_spoon'],
        resultEffect: 'dissolve_calm',
        resultColor: '#7dd3fc',
        reactionTitle: 'آرام حل شد!',
      },
    ]
  ),
  bp(
    'عسل در آب گرم چطور حل می‌شود؟',
    'عسل غلیظ رو توی آب گرم بریز و با قاشق هم بزن تا شربت طلایی درست بشه!',
    'عسل در آب سرد سفت می‌ماند اما در آب گرم به راحتی روان و حل می‌شود.',
    [
      {
        vesselId: 'v1',
        label: 'لیوان شربت عسل',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'honey', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#f59e0b',
        reactionTitle: 'شربت طلایی عسل!',
      },
    ]
  ),
  bp(
    'شربت آبلیمو و شکر تابستانی!',
    'آب، آبلیمو تازه و شکر رو توی ظرف بریز و هم بزن!',
    'هم آبلیمو و هم شکر کاملاً در آب حل می‌شوند و محلول خوشمزه می‌سازند.',
    [
      {
        vesselId: 'v1',
        label: 'پارچ شربت لیمو',
        shape: 'beaker',
        requiredIngredients: ['water', 'lemon_juice', 'sugar', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#fef08a',
        reactionTitle: 'لیموناد علمی آماده است!',
      },
    ]
  ),
  bp(
    'آیا فلفل سیاه در آب حل می‌شود؟',
    'توی شیشه آب و پودر فلفل بریز و هم بزن؛ ببین دانه‌های فلفل روی آب می‌مانند!',
    'پودر فلفل در آب حل نمی‌شود و به خاطر کشش سطحی آب، روی سطح شناور می‌ماند.',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر آب و فلفل',
        shape: 'beaker',
        requiredIngredients: ['water', 'pepper', 'stir_spoon'],
        resultEffect: 'dissolve_calm',
        resultColor: '#64748b',
        reactionTitle: 'دانه‌های فلفل حل نشدند!',
      },
    ]
  ),
  bp(
    'آیا نمک در روغن حل می‌شود؟ مقایسه دو شیشه!',
    'در شیشه اول آب و نمک بریز، در شیشه دوم روغن و نمک بریز!',
    'جالبه بدانی نمک در آب حل می‌شود ولی در روغن اصلاً حل نمی‌شود و ته روغن می‌ماند!',
    [
      {
        vesselId: 'v1',
        label: 'آب + نمک',
        shape: 'beaker',
        requiredIngredients: ['water', 'salt'],
        resultEffect: 'dissolve_calm',
        resultColor: '#7dd3fc',
        reactionTitle: 'در آب حل شد!',
      },
      {
        vesselId: 'v2',
        label: 'روغن + نمک',
        shape: 'beaker',
        requiredIngredients: ['oil', 'salt'],
        resultEffect: 'density_layers',
        resultColor: '#e2e8f0',
        secondaryColor: '#facc15',
        reactionTitle: 'در روغن حل نشد!',
      },
    ]
  ),
  bp(
    'ساخت محلول نبات کریستالی اشباع!',
    'آب گرم، شکر و رنگ زرد رو با قاشق ترکیب کن تا بلورهای درخشان نبات شکل بگیره!',
    'وقتی آب گرم پر از شکر شود و سرد گردد، بلورهای زیبای نبات ساخته می‌شوند!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه بلور نبات',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'sugar', 'yellow_dye', 'stir_spoon'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#f59e0b',
        secondaryColor: '#fef3c7',
        reactionTitle: 'بلورهای طلایی نبات!',
      },
    ]
  ),
  bp(
    'شیر عسل گرم آرامش‌بخش',
    'شیر سفید و عسل طلایی رو با قاشق هم بزن!',
    'عسل در شیر حل می‌شود و رنگ و طعم آن را عوض می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'لیوان شیرعسل',
        shape: 'beaker',
        requiredIngredients: ['milk', 'honey', 'stir_spoon'],
        resultEffect: 'color_mix',
        resultColor: '#fde68a',
        reactionTitle: 'شیرعسل مقوی!',
      },
    ]
  ),
  bp(
    'جوش شیرین در آب در برابر سرکه (دو شیشه)',
    'در شیشه اول آب و جوش شیرین بریز، در شیشه دوم سرکه و جوش شیرین!',
    'جوش شیرین در آب آرام حل می‌شود، اما در سرکه واکنش شیمیایی می‌دهد و می‌جوشد!',
    [
      {
        vesselId: 'v1',
        label: 'آب + جوش شیرین',
        shape: 'beaker',
        requiredIngredients: ['water', 'baking_soda'],
        resultEffect: 'dissolve_calm',
        resultColor: '#bae6fd',
        reactionTitle: 'فقط حل شد!',
      },
      {
        vesselId: 'v2',
        label: 'سرکه + جوش شیرین',
        shape: 'beaker',
        requiredIngredients: ['vinegar', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#f1f5f9',
        secondaryColor: '#38bdf8',
        reactionTitle: 'واکنش داد و جوشید!',
      },
    ]
  ),
  bp(
    'یاقوت آبی کریستالی (جشن پایان فصل ۴)',
    'آب گرم، نمک، رنگ آبی و اکلیل بریز تا بلورهای یاقوت آبی بدرخشند!',
    'آفرین! تفاوت حل شدن فیزیکی و واکنش شیمیایی را یاد گرفتی!',
    [
      {
        vesselId: 'v1',
        label: 'بلور یاقوت آبی',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'salt', 'blue_dye', 'glitter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#1d4ed8',
        secondaryColor: '#93c5fd',
        reactionTitle: 'کریستال لاجوردی!',
      },
    ]
  ),

  // ================= CHAPTER 5 (41-50): Magic Milk, Pepper Soap & Giant Bubbles =================
  bp(
    'شیر جادویی رنگین‌کمانی!',
    'توی ظرف شیر بریز، قطره قرمز و آبی بچکان و آخر سر یک قطره مایع ظرفشویی بزن وسطش!',
    'مایع ظرفشویی چربی‌های نامرئی شیر را به حرکت درمی‌آورد و رنگ‌ها مثل آتش‌بازی می‌چرخند!',
    [
      {
        vesselId: 'v1',
        label: 'بشقاب شیر جادویی',
        shape: 'dish',
        requiredIngredients: ['milk', 'red_dye', 'blue_dye', 'dish_soap'],
        resultEffect: 'magic_milk',
        resultColor: '#ec4899',
        secondaryColor: '#3b82f6',
        reactionTitle: 'انفجار موج‌های رنگین‌کمان!',
      },
    ]
  ),
  bp(
    'چرا باید دست‌هامون رو با صابون بشوریم؟ (فرار فلفل‌ها!)',
    'توی ظرف آب بریز و پودر فلفل بپاش (مثل میکروب‌ها!)؛ حالا یک قطره مایع ظرفشویی بزن تا ببینی چطور فرار می‌کنن!',
    'مایع ظرفشویی کشش سطحی آب را می‌شکند و ذرات فلفل (و میکروب‌ها!) فوراً از صابون فرار می‌کنند!',
    [
      {
        vesselId: 'v1',
        label: 'ظرف آب و فلفل',
        shape: 'dish',
        requiredIngredients: ['water', 'pepper', 'dish_soap'],
        resultEffect: 'pepper_scatter',
        resultColor: '#38bdf8',
        secondaryColor: '#10b981',
        reactionTitle: 'فلفل‌ها به لبه ظرف فرار کردند!',
      },
    ]
  ),
  bp(
    'شیر جادویی خورشیدی (زرد و قرمز)',
    'شیر، رنگ زرد، رنگ قرمز و مایع ظرفشویی رو امتحان کن!',
    'موج‌های نارنجی و طلایی روی سطح شیر طرح‌های هنری می‌سازند.',
    [
      {
        vesselId: 'v1',
        label: 'ظرف شیر خورشیدی',
        shape: 'dish',
        requiredIngredients: ['milk', 'yellow_dye', 'red_dye', 'dish_soap'],
        resultEffect: 'magic_milk',
        resultColor: '#f97316',
        secondaryColor: '#fde047',
        reactionTitle: 'موج خورشیدی!',
      },
    ]
  ),
  bp(
    'مایع حباب‌ساز غول‌پیکر و نشکن!',
    'آب، مایع ظرفشویی و شکر رو با قاشق ترکیب کن تا محلول حباب‌های بزرگ و مقاوم بسازی!',
    'شکر تبخیر آب حباب را کند می‌کند و باعث می‌شود حباب‌ها دیرتر بترکند!',
    [
      {
        vesselId: 'v1',
        label: 'لیوان حباب‌ساز',
        shape: 'beaker',
        requiredIngredients: ['water', 'dish_soap', 'sugar', 'stir_spoon'],
        resultEffect: 'foam_geyser',
        resultColor: '#34d399',
        secondaryColor: '#ecfdf5',
        reactionTitle: 'حباب‌های غول‌پیکر پرواز کردند!',
      },
    ]
  ),
  bp(
    'حباب‌های عسلی فوق مقاوم!',
    'آب گرم، مایع ظرفشویی و کمی عسل بریز و هم بزن!',
    'عسل مثل گلیسیرین دیواره حباب را کشسان و محکم می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'ارلن حباب طلایی',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'dish_soap', 'honey', 'stir_spoon'],
        resultEffect: 'foam_geyser',
        resultColor: '#fbbf24',
        secondaryColor: '#fef3c7',
        reactionTitle: 'حباب‌های طلایی نشکن!',
      },
    ]
  ),
  bp(
    'شیر جادویی چهار فصل (قرمز، آبی، زرد)',
    'هر سه رنگ اصلی رو روی شیر بریز و با مایع ظرفشویی برقصونشون!',
    'هر قطره صابون جریان‌های گردابی جدید در شیر می‌سازد.',
    [
      {
        vesselId: 'v1',
        label: 'بوم نقاشی شیر',
        shape: 'dish',
        requiredIngredients: ['milk', 'red_dye', 'blue_dye', 'yellow_dye', 'dish_soap'],
        resultEffect: 'magic_milk',
        resultColor: '#8b5cf6',
        secondaryColor: '#10b981',
        reactionTitle: 'نقاشی زنده روی شیر!',
      },
    ]
  ),
  bp(
    'فرار اکلیل‌های ستاره‌ای روی آب!',
    'روی آب زلال اکلیل ستاره‌ای بپاش و بعد با یک قطره مایع ظرفشویی پخششون کن!',
    'کشش سطحی آب مثل یک پوست نازک نامرئی است که با صابون کنار می‌رود.',
    [
      {
        vesselId: 'v1',
        label: 'ظرف ستاره‌ها',
        shape: 'dish',
        requiredIngredients: ['water', 'glitter', 'dish_soap'],
        resultEffect: 'pepper_scatter',
        resultColor: '#ec4899',
        secondaryColor: '#38bdf8',
        reactionTitle: 'ستاره‌ها جهش کردند!',
      },
    ]
  ),
  bp(
    'دو ظرف مقایسه: شیر با صابون در برابر آب با صابون!',
    'در ظرف اول شیر + رنگ قرمز + صابون بریز؛ در ظرف دوم آب + رنگ قرمز + صابون!',
    'چون آب چربی ندارد، چرخش جادویی شیر در آب ساده اتفاق نمی‌افتد!',
    [
      {
        vesselId: 'v1',
        label: 'شیر چرب + صابون',
        shape: 'dish',
        requiredIngredients: ['milk', 'red_dye', 'dish_soap'],
        resultEffect: 'magic_milk',
        resultColor: '#f43f5e',
        secondaryColor: '#fda4af',
        reactionTitle: 'چرخش جادویی رنگ!',
      },
      {
        vesselId: 'v2',
        label: 'آب ساده + صابون',
        shape: 'dish',
        requiredIngredients: ['water', 'red_dye', 'dish_soap'],
        resultEffect: 'color_mix',
        resultColor: '#ef4444',
        reactionTitle: 'پخش ساده!',
      },
    ]
  ),
  bp(
    'مار کفی رنگین‌کمان!',
    'آب، مایع ظرفشویی، رنگ آبی و قرمز و جوش شیرین رو ترکیب کن!',
    'ترکیب کف صابون با رنگ‌ها ستون نرمی مثل مار کفی رنگارنگ می‌سازد.',
    [
      {
        vesselId: 'v1',
        label: 'بطری مار کفی',
        shape: 'bottle',
        requiredIngredients: ['vinegar', 'dish_soap', 'blue_dye', 'red_dye', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#a855f7',
        secondaryColor: '#f472b6',
        reactionTitle: 'مار کفی بنفش و صورتی!',
      },
    ]
  ),
  bp(
    'کوه حباب یاقوتی (پایان فصل ۵)',
    'سرکه، مایع ظرفشویی، اکلیل و جوش شیرین رو توی کوه آتشفشان بریز!',
    'آفرین! راز صابون و کشش سطحی آب رو کشف کردی!',
    [
      {
        vesselId: 'v1',
        label: 'آتشفشان حبابی',
        shape: 'volcano',
        requiredIngredients: ['vinegar', 'dish_soap', 'glitter', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#10b981',
        secondaryColor: '#a7f3d0',
        reactionTitle: 'کوه حباب درخشان!',
      },
    ]
  ),

  // ================= CHAPTER 6 (51-60): Magic Purple Cabbage Color-Shift =================
  bp(
    'جادوی کلم بنفش و آبلیمو: بنفش تبدیل به صورتی میشه!',
    'آب کلم بنفش رو توی شیشه بریز و بعد روش آبلیمو اضافه کن؛ ببین بدون رنگ خوراکی صورتی شد!',
    'عصاره کلم بنفش یک شناسگر طبیعی است؛ هر وقت به ترشی‌ها (اسید مثل لیمو) برسد صورتی خوش‌رنگ می‌شود!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر جادویی',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'lemon_juice'],
        resultEffect: 'ph_color_shift',
        resultColor: '#ec4899',
        secondaryColor: '#9333ea',
        reactionTitle: 'بنفش تبدیل به صورتی روشن شد!',
      },
    ]
  ),
  bp(
    'جادوی کلم بنفش و جوش شیرین: بنفش تبدیل به سبز-آبی میشه!',
    'حالا به آب کلم بنفش، جوش شیرین اضافه کن و هم بزن!',
    'جوش شیرین خاصیت قلیایی دارد و رنگ کلم بنفش را به فیروزه‌ای و سبز تبدیل می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر فیروزه‌ای',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'baking_soda', 'stir_spoon'],
        resultEffect: 'ph_color_shift',
        resultColor: '#14b8a6',
        secondaryColor: '#9333ea',
        reactionTitle: 'تبدیل به سبز فیروزه‌ای شد!',
      },
    ]
  ),
  bp(
    'شعبده‌بازی دو شیشه با یک بطری بنفش!',
    'هر دو شیشه آب کلم بنفش دارن! اولی رو با سرکه قرمز-صورتی کن و دومی رو با جوش شیرین سبز کن!',
    'یک مایع بنفش واحد بسته به ماده‌ای که به آن اضافه می‌شود دو رنگ کاملاً متفاوت می‌گیرد!',
    [
      {
        vesselId: 'v1',
        label: 'شیشه ترش (سرکه)',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'vinegar'],
        resultEffect: 'ph_color_shift',
        resultColor: '#f43f5e',
        reactionTitle: 'قرمز یاقوتی شد!',
      },
      {
        vesselId: 'v2',
        label: 'شیشه جوش شیرین',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'baking_soda'],
        resultEffect: 'ph_color_shift',
        resultColor: '#10b981',
        reactionTitle: 'سبز زمردی شد!',
      },
    ]
  ),
  bp(
    'برگرداندن رنگ به بنفش + فواره کف!',
    'آب کلم بنفش رو اول با آبلیمو صورتی کن و بعد جوش شیرین بریز تا هم دوباره بنفش بشه و هم کف کنه!',
    'وقتی ترشی لیمو و جوش شیرین همدیگر را خنثی می‌کنند، رنگ دوباره به بنفش برمی‌گردد!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن تغییر رنگ و کف',
        shape: 'flask',
        requiredIngredients: ['cabbage_juice', 'lemon_juice', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#a855f7',
        secondaryColor: '#f9a8d4',
        reactionTitle: 'خنثی شد و فوران کرد!',
      },
    ]
  ),
  bp(
    'تست نوشابه با کلم بنفش: نوشابه ترشه یا نه؟',
    'توی آب کلم بنفش کمی نوشابه پرتقالی یا آب ساده در دو شیشه بریز!',
    'گاز حل‌شده در نوشابه کمی خاصیت اسیدی دارد و رنگ کلم را به سمت سرخابی می‌برد!',
    [
      {
        vesselId: 'v1',
        label: 'کلم + نوشابه',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'orange_soda'],
        resultEffect: 'ph_color_shift',
        resultColor: '#e11d48',
        reactionTitle: 'سرخابی شد!',
      },
      {
        vesselId: 'v2',
        label: 'کلم + آب زلال',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'water'],
        resultEffect: 'ph_color_shift',
        resultColor: '#9333ea',
        reactionTitle: 'بنفش ماند (آب خنثی است)!',
      },
    ]
  ),
  bp(
    'تست مایع ظرفشویی با کلم بنفش',
    'آب کلم بنفش و مایع ظرفشویی رو ترکیب کن و تغییر رنگش رو ببین!',
    'بیشتر شوینده‌ها کمی قلیایی هستند و رنگ بنفش را آبی-سبز می‌کنند.',
    [
      {
        vesselId: 'v1',
        label: 'ارلن تست شوینده',
        shape: 'flask',
        requiredIngredients: ['cabbage_juice', 'dish_soap', 'stir_spoon'],
        resultEffect: 'ph_color_shift',
        resultColor: '#0ea5e9',
        reactionTitle: 'آبی درخشان شد!',
      },
    ]
  ),
  bp(
    'لاوا لمپ تغییر رنگ‌دهنده بنفش-صورتی!',
    'آب کلم بنفش، روغن و قرص جوشان رو ترکیب کن تا حباب‌های رنگی بسازه!',
    'قرص جوشان هنگام حل شدن رنگ کلم بنفش را به یاقوتی درخشان تبدیل می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'لاوا لمپ جادویی',
        shape: 'bottle',
        requiredIngredients: ['cabbage_juice', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#d946ef',
        secondaryColor: '#facc15',
        reactionTitle: 'گدازه ارغوانی!',
      },
    ]
  ),
  bp(
    'آیا نمک رنگ کلم بنفش رو عوض می‌کنه؟',
    'توی آب کلم بنفش نمک بریز و هم بزن؛ ببین رنگش عوض میشه یا بنفش می‌مونه!',
    'نمک خوراکی خنثی است (نه ترش و نه قلیایی)، پس رنگ کلم بنفش ثابت می‌ماند!',
    [
      {
        vesselId: 'v1',
        label: 'کلم + نمک',
        shape: 'beaker',
        requiredIngredients: ['cabbage_juice', 'salt', 'stir_spoon'],
        resultEffect: 'dissolve_calm',
        resultColor: '#9333ea',
        reactionTitle: 'بنفش ماند — نمک خنثی است!',
      },
    ]
  ),
  bp(
    'معجون پریان تغییر رنگ اکلیلی!',
    'آب کلم بنفش، آبلیمو و اکلیل ستاره‌ای بریز تا معجون صورتی درخشان بسازی!',
    'علم شیمی دقیقاً مثل شعبده‌بازی واقعی اما با دلیل علمی است!',
    [
      {
        vesselId: 'v1',
        label: 'جام بلورین',
        shape: 'flask',
        requiredIngredients: ['cabbage_juice', 'lemon_juice', 'glitter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#f43f5e',
        secondaryColor: '#fbcfe8',
        reactionTitle: 'معجون یاقوتی ستاره‌دار!',
      },
    ]
  ),
  bp(
    'آتشفشان رنگین‌کمان کلم بنفش (پایان فصل ۶)',
    'آب کلم بنفش، سرکه، مایع ظرفشویی و جوش شیرین رو توی آتشفشان بریز!',
    'شیمی‌دان کوچولو، فصل شناسگرهای رنگی رو با موفقیت تموم کردی!',
    [
      {
        vesselId: 'v1',
        label: 'آتشفشان ارغوانی',
        shape: 'volcano',
        requiredIngredients: ['cabbage_juice', 'vinegar', 'dish_soap', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#c026d3',
        secondaryColor: '#5eead4',
        reactionTitle: 'فوران دورنگ بنفش و فیروزه‌ای!',
      },
    ]
  ),

  // ================= CHAPTER 7 (61-70): Ice, Salt, Snow & Crystals =================
  bp(
    'ذوب کردن سریع یخ با نمک! (مقایسه دو ظرف)',
    'توی ظرف اول یخ و نمک بریز (مثل نمک‌پاشی خیابان در برف!) و توی ظرف دوم فقط یخ و آب!',
    'نمک دمای ذوب یخ را پایین می‌آورد و باعث می‌شود یخ خیلی سریع‌تر آب شود؛ برای همین زمستان در جاده‌های برفی نمک می‌پاشند!',
    [
      {
        vesselId: 'v1',
        label: 'یخ + نمک',
        shape: 'beaker',
        requiredIngredients: ['ice_cube', 'salt', 'red_dye'],
        resultEffect: 'ice_fishing',
        resultColor: '#38bdf8',
        secondaryColor: '#ef4444',
        reactionTitle: 'شیارهای رنگی روی یخ ذوب شد!',
      },
      {
        vesselId: 'v2',
        label: 'یخ بدون نمک',
        shape: 'beaker',
        requiredIngredients: ['ice_cube', 'water'],
        resultEffect: 'dissolve_calm',
        resultColor: '#bae6fd',
        reactionTitle: 'یخ آرام ماند!',
      },
    ]
  ),
  bp(
    'ماهیگیری جادویی تکه یخ بدون قلاب!',
    'آب، تکه یخ، نخ پنبه و کمی نمک روی یخ بریز تا نخ به یخ بچسبه و بلندش کنه!',
    'نمک یک لایه نازک یخ را آب می‌کند و سرمای زیر یخ دوباره آن را دور نخ منجمد می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'لیوان شکار یخ',
        shape: 'beaker',
        requiredIngredients: ['water', 'ice_cube', 'cotton_filter', 'salt'],
        resultEffect: 'ice_fishing',
        resultColor: '#0284c7',
        secondaryColor: '#ffffff',
        reactionTitle: 'یخ با نخ بالا آمد!',
      },
    ]
  ),
  bp(
    'آب شدن یخ در آب گرم در برابر آب سرد',
    'تکه یخ رو در شیشه آب گرم و شیشه آب سرد بنداز و سرعتشون رو ببین!',
    'گرمای آب گرم سریع به یخ منتقل می‌شود و آن را به مایع تبدیل می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'آب گرم + یخ',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'ice_cube'],
        resultEffect: 'dissolve_calm',
        resultColor: '#fda4af',
        reactionTitle: 'یخ فوری آب شد!',
      },
      {
        vesselId: 'v2',
        label: 'آب سرد + یخ',
        shape: 'beaker',
        requiredIngredients: ['water', 'ice_cube'],
        resultEffect: 'ice_fishing',
        resultColor: '#7dd3fc',
        reactionTitle: 'یخ شناور ماند!',
      },
    ]
  ),
  bp(
    'ساخت برف مصنوعی نرم در اتاق گرم!',
    'جوش شیرین فراوان و کمی آب سرد رو با قاشق هم بزن تا پودر برفی سرد و نرم بسازی!',
    'دانه های جوش شیرین با کمی آب خنک حالتی دقیقاً شبیه برف تازه برای آدم‌برفی کوچک پیدا می‌کنند!',
    [
      {
        vesselId: 'v1',
        label: 'کاسه برف‌ساز',
        shape: 'dish',
        requiredIngredients: ['baking_soda', 'water', 'stir_spoon'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#f1f5f9',
        secondaryColor: '#38bdf8',
        reactionTitle: 'برف نرم آزمایشگاهی ساخته شد!',
      },
    ]
  ),
  bp(
    'آدم‌برفی جوشان! آب شدن برف با آبلیمو',
    'برف جوش شیرین و اکلیل رو بساز، بعد روش آبلیمو بریز تا با صدای جلز و ولز کف کنه!',
    'برف مصنوعی جوش شیرین با آبلیمو واکنش گازدار فوق‌العاده جذابی می‌دهد!',
    [
      {
        vesselId: 'v1',
        label: 'ظرف برف جادویی',
        shape: 'dish',
        requiredIngredients: ['baking_soda', 'glitter', 'lemon_juice'],
        resultEffect: 'foam_geyser',
        resultColor: '#e0f2fe',
        secondaryColor: '#fde047',
        reactionTitle: 'برف درخشان کف کرد!',
      },
    ]
  ),
  bp(
    'نوشابه یخی تگرگی!',
    'نوشابه پرتقالی، یخ و کمی نمک رو امتحان کن!',
    'یخ سرد گاز نوشابه را در خود نگه می‌دارد، اما نمک آن را غافلگیر و آزاد می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'لیوان نوشابه یخی',
        shape: 'beaker',
        requiredIngredients: ['orange_soda', 'ice_cube', 'salt'],
        resultEffect: 'foam_geyser',
        resultColor: '#f97316',
        secondaryColor: '#bae6fd',
        reactionTitle: 'فوم خنک پرتقالی!',
      },
    ]
  ),
  bp(
    'کریستال‌های نمکی درخشان روی نخ',
    'آب گرم، نمک، رنگ آبی و نخ پنبه بذار تا کریستال‌های مکعبی نمک شکل بگیرن!',
    'بلورهای نمک زیر ذره‌بین دقیقاً شبیه مکعب‌های کوچک شیشه‌ای هستند!',
    [
      {
        vesselId: 'v1',
        label: 'بِشِر کریستال نمک',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'salt', 'blue_dye', 'cotton_filter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#3b82f6',
        secondaryColor: '#ffffff',
        reactionTitle: 'بلورهای مکعبی درخشان!',
      },
    ]
  ),
  bp(
    'یخ رنگی در روغن طلایی!',
    'توی روغن مایع یک تکه یخ و قطره رنگ آبی بنداز؛ وقتی یخ آب میشه قطره‌های جواهر پایین می‌افتن!',
    'به محض آب شدن یخ، قطره آب رنگی سنگین‌تر از روغن می‌شود و مثل مروارید آبی آرام پایین می‌رود!',
    [
      {
        vesselId: 'v1',
        label: 'استوانه جواهر یخی',
        shape: 'bottle',
        requiredIngredients: ['oil', 'ice_cube', 'blue_dye'],
        resultEffect: 'lava_lamp',
        resultColor: '#2563eb',
        secondaryColor: '#facc15',
        reactionTitle: 'مرواریدهای آبی در روغن!',
      },
    ]
  ),
  bp(
    'مرواریدهای یاقوتی و زمردی یخ در دو شیشه روغن!',
    'در شیشه اول روغن + یخ + قرمز، و در شیشه دوم روغن + یخ + زرد امتحان کن!',
    'ذوب آرام یخ در روغن یکی از زیباترین آزمایش‌های چگالی برای کودکان است!',
    [
      {
        vesselId: 'v1',
        label: 'مروارید قرمز',
        shape: 'bottle',
        requiredIngredients: ['oil', 'ice_cube', 'red_dye'],
        resultEffect: 'lava_lamp',
        resultColor: '#ef4444',
        secondaryColor: '#fde047',
        reactionTitle: 'قطرات یاقوتی!',
      },
      {
        vesselId: 'v2',
        label: 'مروارید سبز-طلایی',
        shape: 'bottle',
        requiredIngredients: ['oil', 'ice_cube', 'blue_dye'],
        resultEffect: 'lava_lamp',
        resultColor: '#06b6d4',
        secondaryColor: '#fde047',
        reactionTitle: 'قطرات فیروزه‌ای!',
      },
    ]
  ),
  bp(
    'باغ بلورین یخی ستاره‌دار (پایان فصل ۷)',
    'آب گرم، شکر، رنگ قرمز و آبی و اکلیل برای ساخت باغ کریستال بنفش!',
    'فصل کریستال‌ها و یخ رو عالی پشت سر گذاشتی!',
    [
      {
        vesselId: 'v1',
        label: 'باغ کریستال',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'sugar', 'red_dye', 'blue_dye', 'glitter'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#9333ea',
        secondaryColor: '#f472b6',
        reactionTitle: 'باغ بلورین بنفش!',
      },
    ]
  ),

  // ================= CHAPTER 8 (71-80): Oobleck, Slime & Cloud Dough =================
  bp(
    'ساخت خمیر جادویی اوبلک! (هم سفته هم مایع!)',
    'نشاسته ذرت و آب رو توی کاسه بریز و هم بزن! این مایع شگفت‌انگیز اگر ضربه بزنی سفته و اگر آرام دست بزنی مایع میشه!',
    'مخلوط نشاسته ذرت و آب یک سیال غیرنیوتنی است؛ زیر فشار ناگهانی دانه‌های نشاسته قفل می‌شوند!',
    [
      {
        vesselId: 'v1',
        label: 'کاسه اوبلک جادویی',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'water', 'stir_spoon'],
        resultEffect: 'slime_oobleck',
        resultColor: '#fef3c7',
        secondaryColor: '#f59e0b',
        reactionTitle: 'اوبلک شگفت‌انگیز آماده شد!',
      },
    ]
  ),
  bp(
    'اوبلک فضایی سبز رنگ!',
    'نشاسته ذرت، آب، رنگ آبی و زرد رو مخلوط کن تا اسلایم نشاسته‌ای سبز بسازی!',
    'می‌توان اوبلک را به هر رنگ دلخواهی درآورد و با دست ورز داد.',
    [
      {
        vesselId: 'v1',
        label: 'کاسه اوبلک سبز',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'water', 'blue_dye', 'yellow_dye'],
        resultEffect: 'slime_oobleck',
        resultColor: '#4ade80',
        secondaryColor: '#16a34a',
        reactionTitle: 'خمیر جادویی سبز!',
      },
    ]
  ),
  bp(
    'خمیر ابری فوق‌لطیف (نشاسته و روغن)!',
    'نشاسته ذرت، روغن مایع و رنگ قرمز رو با قاشق ترکیب کن تا خمیر ابری مخملی درست بشه!',
    'روغن دور دانه‌های ریز نشاسته را می‌پوشاند و خمیری مثل ابر نرم می‌سازد.',
    [
      {
        vesselId: 'v1',
        label: 'ظرف خمیر ابری',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'oil', 'red_dye', 'stir_spoon'],
        resultEffect: 'slime_oobleck',
        resultColor: '#fb7185',
        secondaryColor: '#fda4af',
        reactionTitle: 'خمیر ابری صورتی!',
      },
    ]
  ),
  bp(
    'اسلایم حبابی کشسان (نشاسته و مایع ظرفشویی)!',
    'نشاسته ذرت، مایع ظرفشویی و رنگ آبی رو با قاشق هم بزن تا خمیر اسلایم نرم و خوشبو بسازیم!',
    'ترکیب مایع غلیظ ظرفشویی با نشاسته، خمیر کشسان و کاملاً بی‌خطری برای بازی کودک می‌سازد!',
    [
      {
        vesselId: 'v1',
        label: 'ظرف اسلایم آبی',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'dish_soap', 'blue_dye', 'stir_spoon'],
        resultEffect: 'slime_oobleck',
        resultColor: '#38bdf8',
        secondaryColor: '#10b981',
        reactionTitle: 'اسلایم کشسان آماده بازی!',
      },
    ]
  ),
  bp(
    'اسلایم کهکشانی اکلیلی!',
    'نشاسته، مایع ظرفشویی، رنگ قرمز و آبی و اکلیل ستاره‌ای رو با هم بساز!',
    'اکلیل‌های داخل اسلایم با هر بار کشیدن خمیر می‌درخشند.',
    [
      {
        vesselId: 'v1',
        label: 'ظرف اسلایم کهکشانی',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'dish_soap', 'red_dye', 'blue_dye', 'glitter'],
        resultEffect: 'slime_oobleck',
        resultColor: '#a855f7',
        secondaryColor: '#f472b6',
        reactionTitle: 'اسلایم کهکشانی بنفش!',
      },
    ]
  ),
  bp(
    'شن جادویی ساحلی (شن و روغن و رنگ)!',
    'شن ساحلی، کمی نشاسته و روغن رو با هم ترکیب کن تا شن جادویی قالب‌پذیر بسازی!',
    'شن جادویی به دست نمی‌چسبد ولی هر شکلی مثل قلعه شنی را عالی نگه می‌دارد.',
    [
      {
        vesselId: 'v1',
        label: 'کاسه شن جادویی',
        shape: 'dish',
        requiredIngredients: ['sand', 'cornstarch', 'oil', 'stir_spoon'],
        resultEffect: 'slime_oobleck',
        resultColor: '#eab308',
        secondaryColor: '#ca8a04',
        reactionTitle: 'شن جادویی آماده قلعه‌سازی!',
      },
    ]
  ),
  bp(
    'خمیر پف‌کننده مخمر نانوایی!',
    'آب گرم، شکر و پودر مخمر رو توی بطری بادکنک‌دار بریز؛ مخمر زنده شکر می‌خوره و بادکنک رو باد می‌کنه!',
    'مخمر نانوایی موجود ریز مفیدی است که شکر را مصرف می‌کند و گاز تولید می‌کند تا نان پف کند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری مخمر زنده',
        shape: 'balloon_bottle',
        requiredIngredients: ['warm_water', 'sugar', 'yeast'],
        resultEffect: 'balloon_inflate',
        resultColor: '#fde68a',
        secondaryColor: '#f97316',
        reactionTitle: 'مخمرها گاز ساختند و بادکنک باد شد!',
      },
    ]
  ),
  bp(
    'مقایسه مخمر با شکر در برابر بدون شکر (دو بطری)!',
    'در بطری اول آب گرم + مخمر + شکر، و در بطری دوم فقط آب گرم + مخمر بریز!',
    'بدون شکر، مخمر غذا ندارد و نمی‌تواند گاز بسازد!',
    [
      {
        vesselId: 'v1',
        label: 'مخمر + غذای شکر',
        shape: 'balloon_bottle',
        requiredIngredients: ['warm_water', 'yeast', 'sugar'],
        resultEffect: 'balloon_inflate',
        resultColor: '#fcd34d',
        secondaryColor: '#22c55e',
        reactionTitle: 'بادکنک سبز پف کرد!',
      },
      {
        vesselId: 'v2',
        label: 'مخمر بدون شکر',
        shape: 'beaker',
        requiredIngredients: ['warm_water', 'yeast'],
        resultEffect: 'dissolve_calm',
        resultColor: '#fef08a',
        reactionTitle: 'بدون شکر پف نکرد!',
      },
    ]
  ),
  bp(
    'خمیردندان فیل کودکانه (فواره فوم مخمری)!',
    'آب گرم، مخمر، مایع ظرفشویی و رنگ زرد بریز تا ستون فوم نرم بالا بیاد!',
    'حباب‌های مخمر در کف صابون گیر می‌افتند و مثل خمیردندان غول‌پیکر برای یک فیل بیرون می‌آیند!',
    [
      {
        vesselId: 'v1',
        label: 'ارلن خمیردندان فیل',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'yeast', 'dish_soap', 'yellow_dye'],
        resultEffect: 'foam_geyser',
        resultColor: '#facc15',
        secondaryColor: '#fef9c3',
        reactionTitle: 'فواره خمیردندان فیل!',
      },
    ]
  ),
  bp(
    'دو اسلایم طلایی و فیروزه‌ای (پایان فصل ۸)',
    'در ظرف اول اسلایم زرد اکلیلی و در ظرف دوم اسلایم آبی اکلیلی بساز!',
    'استاد پلیمرها و خمیرهای علمی شدی!',
    [
      {
        vesselId: 'v1',
        label: 'اسلایم طلایی',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'dish_soap', 'yellow_dye', 'glitter'],
        resultEffect: 'slime_oobleck',
        resultColor: '#eab308',
        reactionTitle: 'اسلایم طلایی!',
      },
      {
        vesselId: 'v2',
        label: 'اسلایم فیروزه‌ای',
        shape: 'dish',
        requiredIngredients: ['cornstarch', 'dish_soap', 'blue_dye', 'glitter'],
        resultEffect: 'slime_oobleck',
        resultColor: '#06b6d4',
        reactionTitle: 'اسلایم فیروزه‌ای!',
      },
    ]
  ),

  // ================= CHAPTER 9 (81-90): Grand Master Chemist & Water Purification =================
  bp(
    'ساخت دستگاه تصفیه آب گل‌آلود!',
    'اول صافی پنبه و شن تمیز رو توی قیف بذار، بعد آب گل‌آلود رو بریز تا از پایین آب زلال و تمیز چکه کنه!',
    'لایه‌های شن و پنبه ذرات گل و لای را نگه می‌دارند و آب تمیز از لابه‌لای آن‌ها عبور می‌کند!',
    [
      {
        vesselId: 'v1',
        label: 'قیف تصفیه آب',
        shape: 'filter_funnel',
        requiredIngredients: ['cotton_filter', 'sand', 'muddy_water'],
        resultEffect: 'water_filter',
        resultColor: '#38bdf8',
        secondaryColor: '#78553a',
        reactionTitle: 'آب گل‌آلود زلال و شفاف شد!',
      },
    ]
  ),
  bp(
    'جدا کردن شن از آب نمک با صافی!',
    'توی قیف صافی پنبه بذار و مخلوط آب، نمک و شن رو صاف کن؛ شن بالا می‌مونه ولی آب نمک رد میشه!',
    'مواد حل‌نشده مثل شن در صافی گیر می‌کنند، اما مواد حل‌شده مثل نمک از صافی عبور می‌کنند!',
    [
      {
        vesselId: 'v1',
        label: 'صافی آزمایشگاه',
        shape: 'filter_funnel',
        requiredIngredients: ['cotton_filter', 'water', 'salt', 'sand'],
        resultEffect: 'water_filter',
        resultColor: '#7dd3fc',
        secondaryColor: '#d6a85a',
        reactionTitle: 'شن جدا شد و آب صاف پایین آمد!',
      },
    ]
  ),
  bp(
    'مقایسه تصفیه با صافی در برابر بدون صافی!',
    'شیشه اول قیف صافی داره و آب گل‌آلود رو صاف می‌کنه؛ شیشه دوم صافی نداره!',
    'در تصفیه‌خانه‌های شهر هم آب رودخانه از لایه‌های بزرگ ماسه و صافی عبور می‌کند.',
    [
      {
        vesselId: 'v1',
        label: 'با صافی پنبه و شن',
        shape: 'filter_funnel',
        requiredIngredients: ['cotton_filter', 'sand', 'muddy_water'],
        resultEffect: 'water_filter',
        resultColor: '#38bdf8',
        reactionTitle: 'آب زلال شد!',
      },
      {
        vesselId: 'v2',
        label: 'بدون صافی',
        shape: 'beaker',
        requiredIngredients: ['muddy_water'],
        resultEffect: 'dissolve_calm',
        resultColor: '#78553a',
        reactionTitle: 'کدر و گِلی ماند!',
      },
    ]
  ),
  bp(
    'دو آزمایش گازدار کلاسیک کنار هم: نوشابه+نمک و سرکه+جوش شیرین!',
    'در شیشه اول نوشابه و نمک، و در شیشه دوم سرکه و جوش شیرین بریز و دو فواره رو مقایسه کن!',
    'نوشابه گاز ذخیره‌شده را آزاد می‌کند، ولی سرکه و جوش شیرین گاز جدید تولید می‌کنند!',
    [
      {
        vesselId: 'v1',
        label: 'فواره نوشابه و نمک',
        shape: 'bottle',
        requiredIngredients: ['cola', 'salt'],
        resultEffect: 'foam_geyser',
        resultColor: '#451a03',
        secondaryColor: '#fde68a',
        reactionTitle: 'فواره نوشابه!',
      },
      {
        vesselId: 'v2',
        label: 'فواره سرکه و جوش شیرین',
        shape: 'bottle',
        requiredIngredients: ['vinegar', 'baking_soda'],
        resultEffect: 'foam_geyser',
        resultColor: '#e2e8f0',
        secondaryColor: '#38bdf8',
        reactionTitle: 'فواره سرکه!',
      },
    ]
  ),
  bp(
    'برج ۴ ماده شگفت‌انگیز (عسل، شیر، آب آبی و روغن)!',
    'عسل، آب، رنگ آبی و روغن رو با دقت لایه‌لایه روی هم بچین!',
    'دانستن چگالی به دانشمندان کمک می‌کند رفتار مایعات در دریاها و زمین را بشناسند.',
    [
      {
        vesselId: 'v1',
        label: 'استوانه ۴ عنصر',
        shape: 'bottle',
        requiredIngredients: ['honey', 'water', 'blue_dye', 'oil'],
        resultEffect: 'density_layers',
        resultColor: '#d97706',
        secondaryColor: '#2563eb',
        reactionTitle: 'برج رنگارنگ کامل شد!',
      },
    ]
  ),
  bp(
    'آزمایش ترکیبی کلم بنفش + چراغ گدازه‌ای!',
    'آب کلم بنفش، آبلیمو، روغن و قرص جوشان رو ترکیب کن تا لاوا لمپ صورتی بسازی!',
    'ابتدا رنگ بنفش با لیمو صورتی می‌شود و سپس در روغن می‌جوشد!',
    [
      {
        vesselId: 'v1',
        label: 'لاوا لمپ ترکیبی',
        shape: 'bottle',
        requiredIngredients: ['cabbage_juice', 'lemon_juice', 'oil', 'fizz_tablet'],
        resultEffect: 'lava_lamp',
        resultColor: '#ec4899',
        secondaryColor: '#facc15',
        reactionTitle: 'گدازه صورتی درخشان!',
      },
    ]
  ),
  bp(
    'نمایش دو آتشفشان دوقلوی آتش و یخ (قرمز و آبی)!',
    'کوه اول رو با رنگ قرمز و کوه دوم رو با رنگ آبی فوران بده!',
    'نمایش‌های بزرگ علمی با واکنش‌های بی‌خطر شگفت‌انگیزترین صحنه‌ها را خلق می‌کنند!',
    [
      {
        vesselId: 'v1',
        label: 'آتشفشان آتش (قرمز)',
        shape: 'volcano',
        requiredIngredients: ['vinegar', 'red_dye', 'dish_soap', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#ef4444',
        secondaryColor: '#fed7aa',
        reactionTitle: 'گدازه آتشین!',
      },
      {
        vesselId: 'v2',
        label: 'آتشفشان یخی (آبی)',
        shape: 'volcano',
        requiredIngredients: ['vinegar', 'blue_dye', 'dish_soap', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#2563eb',
        secondaryColor: '#bae6fd',
        reactionTitle: 'گدازه آبی یخی!',
      },
    ]
  ),
  bp(
    'جشنواره بادکنک و رقص کشمش هم‌زمان!',
    'در ظرف اول بادکنک رو با آبلیمو و جوش شیرین باد کن و در ظرف دوم کشمش‌ها رو در نوشابه برقصون!',
    'هر دو آزمایش قدرت شگفت‌انگیز حباب‌های گاز دی‌اکسید کربن را نشان می‌دهند!',
    [
      {
        vesselId: 'v1',
        label: 'بطری بادکنک',
        shape: 'balloon_bottle',
        requiredIngredients: ['lemon_juice', 'baking_soda'],
        resultEffect: 'balloon_inflate',
        resultColor: '#fde047',
        secondaryColor: '#f43f5e',
        reactionTitle: 'بادکنک بالا رفت!',
      },
      {
        vesselId: 'v2',
        label: 'لیوان رقص کشمش',
        shape: 'beaker',
        requiredIngredients: ['orange_soda', 'raisins'],
        resultEffect: 'dancing_raisins',
        resultColor: '#fb923c',
        reactionTitle: 'کشمش‌ها می‌رقصند!',
      },
    ]
  ),
  bp(
    'شیر جادویی الماسی و کریستال طلایی!',
    'در بشقاب اول شیر جادویی رنگارنگ بساز و در ارلن دوم بلور طلایی عسل و اکلیل!',
    'تسلط تو به آزمایشگاه شیمی بی‌نظیر است!',
    [
      {
        vesselId: 'v1',
        label: 'شیر جادویی',
        shape: 'dish',
        requiredIngredients: ['milk', 'red_dye', 'blue_dye', 'dish_soap'],
        resultEffect: 'magic_milk',
        resultColor: '#ec4899',
        secondaryColor: '#3b82f6',
        reactionTitle: 'امواج رنگین‌کمان!',
      },
      {
        vesselId: 'v2',
        label: 'بلور طلایی',
        shape: 'flask',
        requiredIngredients: ['warm_water', 'honey', 'glitter', 'stir_spoon'],
        resultEffect: 'crystal_sparkle',
        resultColor: '#f59e0b',
        reactionTitle: 'اکسیر طلایی درخشان!',
      },
    ]
  ),
  bp(
    'مرحله ۹۰ شیمی: نمایش بزرگ فارغ‌التحصیلی پروفسور شیمی کوچولو!',
    'افتخار آزمایشگاه! در شیشه اول فواره نوشابه و قرص نعنا و در کوه دوم آتشفشان کهکشانی رو هم‌زمان به پرواز دربیار!',
    'هورااا! تمام ۹۰ آزمایش شیمی دانشمند کوچولو را با موفقیت انجام دادی!',
    [
      {
        vesselId: 'v1',
        label: 'فواره بزرگ نوشابه',
        shape: 'bottle',
        requiredIngredients: ['cola', 'mentos', 'glitter'],
        resultEffect: 'foam_geyser',
        resultColor: '#78350f',
        secondaryColor: '#fde047',
        reactionTitle: 'فواره قهرمانی!',
      },
      {
        vesselId: 'v2',
        label: 'آتشفشان جشن رنگین‌کمان',
        shape: 'volcano',
        requiredIngredients: ['cabbage_juice', 'vinegar', 'dish_soap', 'baking_soda'],
        resultEffect: 'volcano_eruption',
        resultColor: '#9333ea',
        secondaryColor: '#34d399',
        reactionTitle: 'آتشفشان رنگین‌کمان قهرمانی!',
      },
    ]
  ),
];

export const CHEMISTRY_LEVELS: ChemistryLevel[] = CHEM_BLUEPRINTS.map((b, idx) => {
  const num = idx + 1;
  const chapter = Math.ceil(num / 10);
  return {
    id: `chem-${num}`,
    lab: 'chemistry',
    number: num,
    chapter,
    chapterTitle: CHEM_CHAPTERS[chapter],
    ...b,
  };
});

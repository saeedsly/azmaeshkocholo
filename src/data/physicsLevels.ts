import { PhysicsLevel, PhysicsItemSpec, PhysicsMode } from '../types/game';

const PHYS_CHAPTERS: Record<number, string> = {
  1: 'فصل ۱: جادوی آهنربا! جذب آهن در برابر چوب و پلاستیک',
  2: 'فصل ۲: قطب‌های آهنربا — هل دادن و کشیدن بدون دست!',
  3: 'فصل ۳: روی آب می‌ماند یا ته آب می‌رود؟ (شناوری)',
  4: 'فصل ۴: الکتریسیته ساکن و بادکنک شگفت‌انگیز',
  5: 'فصل ۵: ترازو و الاکلنگ تعادل (سنگین و سبک)',
  6: 'فصل ۶: نور، آینه، ذره‌بین و رنگین‌کمان منشور',
  7: 'فصل ۷: سطح شیب‌دار، چرخ و اصطکاک (یخ، چوب و فرش)',
  8: 'فصل ۸: قدرت باد و موسیقی لیوان‌های آب',
  9: 'فصل ۹: چرخه طبیعت و پرورش گیاه دانشمند کوچولو',
};

interface PhysBlueprint {
  title: string;
  kidPrompt: string;
  scienceTip: string;
  mode: PhysicsMode;
  items: PhysicsItemSpec[];
  targetGoalCount: number;
  waterIsSalty?: boolean;
  targetWeight?: number;
}

const PHYS_BLUEPRINTS: PhysBlueprint[] = [
  // ================= CHAPTER 1 (1-10): Magnet Explore (Iron vs Wood/Plastic) =================
  {
    title: 'آهنربا به آهن می‌چسبد ولی به چوب نه!',
    kidPrompt: 'آهنربای قرمز و آبی رو بردار و نزدیک وسایل ببر! ببین میخ آهنی و گیره فلزی جذب میشن ولی چوب نمی‌چسبه!',
    scienceTip: 'آهنربا فقط فلزاتی مثل آهن و فولاد را جذب می‌کند و هیچ اثری روی چوب ندارد!',
    mode: 'magnet_explore',
    targetGoalCount: 2,
    items: [
      { id: 'nail', name: 'میخ آهنی', emoji: '🔩', color: '#94a3b8', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'clip', name: 'گیره فلزی', emoji: '📎', color: '#cbd5e1', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'wood', name: 'تکه چوب', emoji: '🪵', color: '#b45309', isMagnetic: false, materialLabel: 'چوب' },
      { id: 'pencil', name: 'مداد چوبی', emoji: '✏️', color: '#f59e0b', isMagnetic: false, materialLabel: 'چوب' },
    ],
  },
  {
    title: 'کلید آهنی در برابر اردک پلاستیکی!',
    kidPrompt: 'با آهنربا کلید آهنی و آچار رو بگیر؛ ببین اردک پلاستیکی و توپ لاستیکی جذب نمیشن!',
    scienceTip: 'پلاستیک و لاستیک خاصیت مغناطیسی ندارند و به آهنربا نمی‌چسبند.',
    mode: 'magnet_explore',
    targetGoalCount: 2,
    items: [
      { id: 'key', name: 'کلید آهنی', emoji: '🗝️', color: '#94a3b8', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'wrench', name: 'آچار فولادی', emoji: '🔧', color: '#64748b', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'duck', name: 'اردک پلاستیکی', emoji: '🦆', color: '#facc15', isMagnetic: false, materialLabel: 'پلاستیک' },
      { id: 'ball', name: 'توپ لاستیکی', emoji: '🏀', color: '#f97316', isMagnetic: false, materialLabel: 'لاستیک' },
    ],
  },
  {
    title: 'قاشق و قیچی در برابر شیشه و برگ!',
    kidPrompt: 'آهنربا رو روی میز بچرخون تا قاشق استیل و قیچی رو پیدا کنه!',
    scienceTip: 'شیشه و برگ درخت هم غیرمغناطیسی هستند.',
    mode: 'magnet_explore',
    targetGoalCount: 2,
    items: [
      { id: 'spoon', name: 'قاشق فلزی', emoji: '🥄', color: '#cbd5e1', isMagnetic: true, materialLabel: 'استیل آهنی' },
      { id: 'scissor', name: 'قیچی فلزی', emoji: '✂️', color: '#ef4444', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'glass', name: 'لیوان شیشه‌ای', emoji: '🥛', color: '#bae6fd', isMagnetic: false, materialLabel: 'شیشه' },
      { id: 'leaf', name: 'برگ درخت', emoji: '🍃', color: '#22c55e', isMagnetic: false, materialLabel: 'گیاه' },
    ],
  },
  {
    title: 'گنج‌یابی در جعبه اسباب‌بازی!',
    kidPrompt: 'بین اسباب‌بازی‌های چوبی و پارچه‌ای، ۳ تا وسیله آهنی رو با آهنربا شکار کن!',
    scienceTip: 'پارچه و پنبه عروسک‌ها هیچ واکنشی به آهنربا نشان نمی‌دهند.',
    mode: 'magnet_explore',
    targetGoalCount: 3,
    items: [
      { id: 'bolt', name: 'پیچ و مهره', emoji: '🔩', color: '#64748b', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'bell', name: 'زنگوله آهنی', emoji: '🔔', color: '#eab308', isMagnetic: true, materialLabel: 'آهن آبکاری' },
      { id: 'pin', name: 'سنجاق قفلی', emoji: '🧷', color: '#cbd5e1', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'bear', name: 'خرس پارچه‌ای', emoji: '🧸', color: '#d97706', isMagnetic: false, materialLabel: 'پارچه' },
      { id: 'block', name: 'مکعب چوبی', emoji: '🪵', color: '#92400e', isMagnetic: false, materialLabel: 'چوب' },
    ],
  },
  {
    title: 'راز علمی: آیا همه فلزها به آهنربا می‌چسبند؟',
    kidPrompt: 'امتحان کن! میخ آهنی و قفل فولادی می‌چسبن، اما قوطی آلومینیومی و حلقه طلا نمی‌چسبن!',
    scienceTip: 'شگفتی علم: فقط آهن، نیکل و کبالت جذب آهنربا می‌شوند؛ آلومینیوم، مس و طلا جذب نمی‌شوند!',
    mode: 'magnet_explore',
    targetGoalCount: 2,
    items: [
      { id: 'lock', name: 'قفل آهنی', emoji: '🔒', color: '#64748b', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'nail2', name: 'چکش آهنی', emoji: '🔨', color: '#94a3b8', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'gold', name: 'انگشتر طلا', emoji: '💍', color: '#facc15', isMagnetic: false, materialLabel: 'طلا' },
      { id: 'alu', name: 'فویل آلومینیوم', emoji: '🪙', color: '#e2e8f0', isMagnetic: false, materialLabel: 'آلومینیوم' },
    ],
  },
  {
    title: 'کمک به خیاطی مامان: جمع کردن سنجاق‌ها از روی فرش!',
    kidPrompt: 'سنجاق‌ها و سوزن‌ها روی فرش ریختن! با آهنربا سریع همه‌شون رو بدون دست زدن جمع کن!',
    scienceTip: 'یکی از کاربردهای عالی آهنربا در خانه، پیدا کردن سوزن و سنجاق از روی فرش است!',
    mode: 'magnet_explore',
    targetGoalCount: 3,
    items: [
      { id: 'p1', name: 'سنجاق اول', emoji: '🧷', color: '#cbd5e1', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'p2', name: 'گیره فلزی', emoji: '📎', color: '#94a3b8', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'p3', name: 'قیچی کوچک', emoji: '✂️', color: '#f43f5e', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'yarn', name: 'کاموای پشمی', emoji: '🧶', color: '#ec4899', isMagnetic: false, materialLabel: 'پشم' },
      { id: 'btn', name: 'دکمه چوبی', emoji: '🪵', color: '#b45309', isMagnetic: false, materialLabel: 'چوب' },
    ],
  },
  {
    title: 'کمک به جعبه ابزار بابا!',
    kidPrompt: 'ابزارهای آهنی بابا رو با آهنربا جدا کن؛ خط‌کش چوبی و چسب کاغذی نمی‌چسبن!',
    scienceTip: 'پیچ‌گوشتی‌های حرفه‌ای نوک آهنربایی دارند تا پیچ از سرشان نیفتد!',
    mode: 'magnet_explore',
    targetGoalCount: 3,
    items: [
      { id: 'saw', name: 'اره فولادی', emoji: '🪚', color: '#94a3b8', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'nut', name: 'پیچ آهنی', emoji: '🔩', color: '#64748b', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'wr', name: 'آچار فرانسه', emoji: '🔧', color: '#475569', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'ruler', name: 'خط‌کش چوبی', emoji: '📏', color: '#eab308', isMagnetic: false, materialLabel: 'چوب' },
      { id: 'sponge', name: 'ابر اسفنجی', emoji: '🧽', color: '#fde047', isMagnetic: false, materialLabel: 'اسفنج' },
    ],
  },
  {
    title: 'آهنربا در آشپزخانه!',
    kidPrompt: 'کدام وسایل آشپزخانه به آهنربا مثل درِ یخچال می‌چسبن؟ پیداشون کن!',
    scienceTip: 'بدنه یخچال از ورق فولادی ساخته شده، برای همین مگنت‌های تزئینی به درِ یخچال می‌چسبند!',
    mode: 'magnet_explore',
    targetGoalCount: 2,
    items: [
      { id: 'fork', name: 'چنگال استیل', emoji: '🍴', color: '#cbd5e1', isMagnetic: true, materialLabel: 'استیل' },
      { id: 'can', name: 'قوطی کنسرو آهنی', emoji: '🥫', color: '#ef4444', isMagnetic: true, materialLabel: 'ورق آهن' },
      { id: 'plate', name: 'بشقاب چینی', emoji: '🍽️', color: '#f8fafc', isMagnetic: false, materialLabel: 'چینی' },
      { id: 'apple', name: 'سیب قرمز', emoji: '🍎', color: '#dc2626', isMagnetic: false, materialLabel: 'میوه' },
    ],
  },
  {
    title: 'گنج آهنربایی زیر شن‌های ساحل!',
    kidPrompt: 'بین صدف و چوب‌های ساحل، ۳ تا شیء آهنی پنهان رو با آهنربا بکش بیرون!',
    scienceTip: 'نیروی آهنربا از لابه‌لای شن و کاغذ هم عبور می‌کند!',
    mode: 'magnet_explore',
    targetGoalCount: 3,
    items: [
      { id: 'anchor', name: 'لنگر آهنی کوچک', emoji: '⚓', color: '#475569', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'oldkey', name: 'کلید صندوقچه', emoji: '🗝️', color: '#94a3b8', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'chain', name: 'زنجیر فولادی', emoji: '⛓️', color: '#64748b', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'shell', name: 'صدف دریایی', emoji: '🐚', color: '#fbcfe8', isMagnetic: false, materialLabel: 'آهک' },
      { id: 'drift', name: 'چوب ساحلی', emoji: '🪵', color: '#92400e', isMagnetic: false, materialLabel: 'چوب' },
    ],
  },
  {
    title: 'چالش قهرمانی فصل ۱: شکار ۴ شیء آهنی!',
    kidPrompt: 'حالا تو استاد آهنربایی! هر ۴ وسیله آهنی روی میز رو بدون اشتباه جذب کن!',
    scienceTip: 'آفرین! کاملاً یاد گرفتی که آهنربا عاشق آهن است ولی به چوب، پلاستیک و شیشه نمی‌چسبد!',
    mode: 'magnet_explore',
    targetGoalCount: 4,
    items: [
      { id: 'm1', name: 'میخ آهنی', emoji: '🔩', color: '#94a3b8', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'm2', name: 'گیره کاغذ', emoji: '📎', color: '#cbd5e1', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'm3', name: 'کلید آهنی', emoji: '🗝️', color: '#64748b', isMagnetic: true, materialLabel: 'آهن' },
      { id: 'm4', name: 'قیچی فلزی', emoji: '✂️', color: '#ef4444', isMagnetic: true, materialLabel: 'فولاد' },
      { id: 'n1', name: 'تکه چوب', emoji: '🪵', color: '#b45309', isMagnetic: false, materialLabel: 'چوب' },
      { id: 'n2', name: 'اردک پلاستیکی', emoji: '🦆', color: '#facc15', isMagnetic: false, materialLabel: 'پلاستیک' },
    ],
  },

  // ================= CHAPTER 2 (11-20): Magnet Poles & Non-Contact Push/Pull =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const scenarios = [
      {
        title: 'حرکت دادن ماشین آهنربایی بدون دست زدن! (دفع قطب‌ها)',
        kidPrompt: 'دو قطب هم‌رنگ آهنربا همدیگه رو هل میدن! آهنربا رو نزدیک ماشین ببر تا بدون تماس بره تا خط پایان!',
        scienceTip: 'دو قطب هم‌نام (قرمز با قرمز یا آبی با آبی) همدیگر را دفع (هل) می‌کنند!',
        emoji: '🚗',
        name: 'ماشین آهنربایی',
      },
      {
        title: 'قطار سریع‌السیر مغناطیسی!',
        kidPrompt: 'قطار آهنربایی رو با نیروی نامرئی آهنربا هل بده تا برسه به ایستگاه!',
        scienceTip: 'قطارهای فوق‌سریع مگلِو در دنیای واقعی روی نیروی آهنربا شناور می‌شوند و پرواز می‌کنند!',
        emoji: '🚅',
        name: 'قطار مگلو',
      },
      {
        title: 'هدایت قایق آهنربایی از زیر میز شیشه‌ای!',
        kidPrompt: 'آهنربا رو حرکت بده تا قایق آهنربایی رو تا جزیره گنج برسونی!',
        scienceTip: 'نیروی مغناطیسی به راحتی از شیشه، چوب نازک و آب عبور می‌کند!',
        emoji: '⛵',
        name: 'قایق آهنربایی',
      },
      {
        title: 'نجات زیردریایی کوچک با نیروی مغناطیس!',
        kidPrompt: 'زیردریایی رو از پشت شیشه آکواریوم با آهنربا هدایت کن به بندر امن!',
        scienceTip: 'حتی داخل آب هم آهنربا به خوبی کار می‌کند!',
        emoji: '🛥️',
        name: 'زیردریایی',
      },
      {
        title: 'مسابقه کفشدوزک آهنربایی روی برگ!',
        kidPrompt: 'کفشدوزک آهنربایی رو با حرکت آهنربا ببر تا برسه به گل خوشبو!',
        scienceTip: 'در اسباب‌بازی‌های علمی، زیر عروسک یک آهنربای کوچک می‌گذارند تا از زیر مقوا حرکت کند.',
        emoji: '🐞',
        name: 'کفشدوزک آهنربایی',
      },
      {
        title: 'موشک مغناطیسی به سوی ستاره!',
        kidPrompt: 'با نیروی دفع آهنربا، موشک کوچولو رو تا ستاره طلایی به پیش ببر!',
        scienceTip: 'میدان مغناطیسی فضایی نامرئی دور آهنرباست که نیرو وارد می‌کند.',
        emoji: '🚀',
        name: 'موشک آهنربایی',
      },
      {
        title: 'کشیدن واگن معدن به سمت انبار!',
        kidPrompt: 'واگن آهنی پر از طلا رو با نیروی آهنربا تا انبار هدایت کن!',
        scienceTip: 'قطب شمال (N) و قطب جنوب (S) مثل دو دوست همدیگر را جذب می‌کنند.',
        emoji: '🚃',
        name: 'واگن معدن',
      },
      {
        title: 'اسکیت‌باز آهنربایی روی یخ!',
        kidPrompt: 'پنگوئن اسکیت‌باز رو روی یخ با آهنربا سُر بده تا به پرچم برسه!',
        scienceTip: 'روی سطح لیز، کوچک‌ترین نیروی مغناطیسی جسم را به حرکت درمی‌آورد.',
        emoji: '🐧',
        name: 'پنگوئن اسکیت‌باز',
      },
      {
        title: 'لاک‌پشت آهنربایی در هزارتو!',
        kidPrompt: 'لاک‌پشت آهنربایی رو قدم‌به‌قدم تا برگ کاهو هدایت کن!',
        scienceTip: 'زمین بزرگ ما خودش یک آهنربای غول‌پیکر است که قطب‌نماها با آن کار می‌کنند!',
        emoji: '🐢',
        name: 'لاک‌پشت مغناطیسی',
      },
      {
        title: 'جشن پایان فصل ۲: ربات آهنربایی در دروازه قهرمانی!',
        kidPrompt: 'ربات آهنربایی رو بدون لمس مستقیم برسون به سکوی قهرمانی!',
        scienceTip: 'آفرین! هم جذب و هم دفع قطب‌های آهنربا را یاد گرفتی!',
        emoji: '🤖',
        name: 'ربات مغناطیسی',
      },
    ];
    const s = scenarios[i];
    return {
      title: s.title,
      kidPrompt: s.kidPrompt,
      scienceTip: s.scienceTip,
      mode: 'magnet_poles',
      targetGoalCount: 1,
      items: [{ id: `mp-${i}`, name: s.name, emoji: s.emoji, color: '#3b82f6', isMagnetic: true }],
    };
  }),

  // ================= CHAPTER 3 (21-30): Sink or Float in Water Tank =================
  {
    title: 'چوب روی آب می‌ماند ولی سنگ ته آب می‌رود!',
    kidPrompt: 'همه وسایل رو یکی‌یکی بنداز توی آکواریوم آب؛ ببین کدوم روی آب شناور می‌مونه و کدوم میره ته آب!',
    scienceTip: 'اجسامی مثل چوب که از آب سبک‌تر (کم‌چگال‌تر) هستند روی آب می‌مانند، ولی سنگ سنگین‌تر است و ته می‌رود!',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'log', name: 'کنده چوب', emoji: '🪵', color: '#b45309', floats: true },
      { id: 'duck', name: 'اردک حمام', emoji: '🦆', color: '#facc15', floats: true },
      { id: 'rock', name: 'سنگ رودخانه', emoji: '🪨', color: '#64748b', floats: false },
      { id: 'key', name: 'کلید آهنی', emoji: '🗝️', color: '#94a3b8', floats: false },
    ],
  },
  {
    title: 'سیب شناور می‌شود یا غرق می‌شود؟ امتحان کن!',
    kidPrompt: 'سیب، توپ، قاشق فلزی و سکه رو بنداز توی آب تا شگفت‌زده بشی!',
    scienceTip: 'بیشتر از یک‌چهارم حجم سیب پر از حباب‌های ریز هواست، برای همین سیب روی آب شناور می‌ماند!',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'apple', name: 'سیب قرمز', emoji: '🍎', color: '#ef4444', floats: true },
      { id: 'ball', name: 'توپ بادی', emoji: '⚽', color: '#38bdf8', floats: true },
      { id: 'spoon', name: 'قاشق فلزی', emoji: '🥄', color: '#cbd5e1', floats: false },
      { id: 'coin', name: 'سکه فلزی', emoji: '🪙', color: '#eab308', floats: false },
    ],
  },
  {
    title: 'قایق چوبی و برگ درخت در برابر آچار و پیچ!',
    kidPrompt: 'بنداز توی آب و ببین طبیعت چطور قایق می‌سازه!',
    scienceTip: 'کشتی‌های چوبی از خاصیت شناوری چوب استفاده می‌کنند.',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'boat', name: 'قایق کوچک', emoji: '⛵', color: '#f97316', floats: true },
      { id: 'leaf', name: 'برگ سبز', emoji: '🍃', color: '#22c55e', floats: true },
      { id: 'wrench', name: 'آچار آهنی', emoji: '🔧', color: '#64748b', floats: false },
      { id: 'nut', name: 'پیچ سنگین', emoji: '🔩', color: '#475569', floats: false },
    ],
  },
  {
    title: 'تخم‌مرغ در آب معمولی ته آب می‌رود!',
    kidPrompt: 'تخم‌مرغ تازه و سنگ رو با چوب‌پنبه و اسفنج در آب معمولی امتحان کن!',
    scienceTip: 'تخم‌مرغ سالم کمی از آب شیرین سنگین‌تر است و آرام به ته لیوان می‌رود.',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'egg', name: 'تخم‌مرغ تازه', emoji: '🥚', color: '#fef3c7', floats: false },
      { id: 'sponge', name: 'اسفنج حمام', emoji: '🧽', color: '#fde047', floats: true },
      { id: 'wood2', name: 'مکعب چوبی', emoji: '🪵', color: '#92400e', floats: true },
      { id: 'anchor', name: 'لنگر کوچک', emoji: '⚓', color: '#475569', floats: false },
    ],
  },
  {
    title: 'شعبده علمی: تخم‌مرغ در آب نمک دریا شناور می‌شود!',
    kidPrompt: 'این بار توی آکواریوم آب نمک ریختیم! حالا تخم‌مرغ رو بنداز ببین چطور روی آب می‌مونه!',
    scienceTip: 'حل شدن نمک در آب چگالی آب را زیاد می‌کند؛ برای همین در دریای شور شناور ماندن خیلی راحت‌تر است!',
    mode: 'sink_float',
    waterIsSalty: true,
    targetGoalCount: 3,
    items: [
      { id: 'egg_salt', name: 'تخم‌مرغ در آب نمک!', emoji: '🥚', color: '#fde68a', floats: true },
      { id: 'boat2', name: 'قایق کاغذی', emoji: '🛶', color: '#38bdf8', floats: true },
      { id: 'anvil', name: 'وزنه آهنی', emoji: '🏋️', color: '#475569', floats: false },
    ],
  },
  {
    title: 'راز پرتقال با پوست و پرتقال پوست‌کنده!',
    kidPrompt: 'پرتقال با پوست مثل جلیقه نجات روی آب می‌مونه، اما پرتقال بدون پوست میره ته آب!',
    scienceTip: 'پوست اسفنجی پرتقال پر از کیسه‌های کوچک هواست که مثل جلیقه نجات عمل می‌کند!',
    mode: 'sink_float',
    targetGoalCount: 3,
    items: [
      { id: 'orange_peel', name: 'پرتقال با پوست', emoji: '🍊', color: '#f97316', floats: true },
      { id: 'orange_naked', name: 'پرتقال بدون پوست', emoji: '🟠', color: '#ea580c', floats: false },
      { id: 'ice', name: 'تکه یخ', emoji: '🧊', color: '#bae6fd', floats: true },
    ],
  },
  {
    title: 'چرا کوه یخ روی آب دریا شناور است؟',
    kidPrompt: 'تکه یخ، خرس قطبی اسباب‌بازی، الماس شیشه‌ای و قفل رو توی آب بنداز!',
    scienceTip: 'وقتی آب یخ می‌زند کمی منبسط و سبک‌تر می‌شود، برای همین یخ همیشه روی آب می‌ایستد!',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'ice1', name: 'تکه یخ بزرگ', emoji: '🧊', color: '#7dd3fc', floats: true },
      { id: 'ring', name: 'تیوپ شنا', emoji: '🛟', color: '#ef4444', floats: true },
      { id: 'gem', name: 'سنگ بلوری', emoji: '💎', color: '#3b82f6', floats: false },
      { id: 'lock', name: 'قفل فلزی', emoji: '🔒', color: '#64748b', floats: false },
    ],
  },
  {
    title: 'میوه‌ها در استخر آب! (هندوانه شگفت‌انگیز)',
    kidPrompt: 'ببین هندوانه بزرگ و لیمو روی آب می‌مونن یا ته آب میرن!',
    scienceTip: 'حتی هندوانه بزرگ هم به خاطر ساختار درونی‌اش روی آب شناور می‌ماند!',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'melon', name: 'هندوانه', emoji: '🍉', color: '#16a34a', floats: true },
      { id: 'lemon', name: 'لیمو زرد', emoji: '🍋', color: '#fde047', floats: true },
      { id: 'hammer', name: 'چکش آهنی', emoji: '🔨', color: '#64748b', floats: false },
      { id: 'scissors', name: 'قیچی فلزی', emoji: '✂️', color: '#ef4444', floats: false },
    ],
  },
  {
    title: 'بطری خالی در برابر سنگ مرمر!',
    kidPrompt: 'وسایل پر از هوا و وسایل توپر سنگین رو در آب آزمایش کن!',
    scienceTip: 'هوای حبس‌شده داخل بطری دربسته باعث می‌شود هرگز غرق نشود.',
    mode: 'sink_float',
    targetGoalCount: 4,
    items: [
      { id: 'balloon', name: 'بادکنک بادی', emoji: '🎈', color: '#ec4899', floats: true },
      { id: 'feather', name: 'پر پرنده', emoji: '🪶', color: '#f8fafc', floats: true },
      { id: 'brick', name: 'آجر سفالی', emoji: '🧱', color: '#dc2626', floats: false },
      { id: 'chain', name: 'زنجیر آهنی', emoji: '⛓️', color: '#64748b', floats: false },
    ],
  },
  {
    title: 'آزمون کاپیتان دریایی (پایان فصل ۳)',
    kidPrompt: 'هر ۵ وسیله رو توی آکواریوم امتحان کن تا مدرک کاپیتان شناوری رو بگیری!',
    scienceTip: 'فوق‌العاده بود! راز شناور ماندن کشتی‌ها و اجسام را یاد گرفتی!',
    mode: 'sink_float',
    targetGoalCount: 5,
    items: [
      { id: 'ship', name: 'کشتی چوبی', emoji: '🚢', color: '#3b82f6', floats: true },
      { id: 'duck2', name: 'اردک زرد', emoji: '🦆', color: '#facc15', floats: true },
      { id: 'wood3', name: 'چوب‌پنبه', emoji: '🪵', color: '#b45309', floats: true },
      { id: 'rock2', name: 'صخره سنگی', emoji: '🪨', color: '#64748b', floats: false },
      { id: 'key2', name: 'کلید طلایی', emoji: '🗝️', color: '#eab308', floats: false },
    ],
  },

  // ================= CHAPTER 4 (31-40): Static Electricity Balloon =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const configs = [
      {
        title: 'الکتریسیته ساکن: بادکنک و خرده‌کاغذهای رنگی!',
        kidPrompt: 'اول بادکنک رو چند بار بمال به لباس پشمی تا شارژ بشه، بعد بگیرش بالای کاغذهای رنگی تا بپرن بالا!',
        scienceTip: 'مالش بادکنک به پشم به آن بار الکتریکی ساکن می‌دهد و چیزهای سبک مثل کاغذ را جذب می‌کند!',
        items: [
          { id: 'p1', name: 'کاغذ صورتی', emoji: '🌸', color: '#f472b6', attractedByStatic: true },
          { id: 'p2', name: 'کاغذ زرد', emoji: '⭐', color: '#facc15', attractedByStatic: true },
          { id: 'p3', name: 'کاغذ آبی', emoji: '💎', color: '#38bdf8', attractedByStatic: true },
        ],
      },
      {
        title: 'پرواز پروانه‌های دستمال کاغذی با بادکنک!',
        kidPrompt: 'بادکنک رو با لباس پشمی شارژ کن و بال پروانه‌های کاغذی رو به پرواز دربیار!',
        scienceTip: 'دستمال کاغذی بسیار سبک است و فوراً به سمت بادکنک باردار جهش می‌کند.',
        items: [
          { id: 'b1', name: 'پروانه آبی', emoji: '🦋', color: '#3b82f6', attractedByStatic: true },
          { id: 'b2', name: 'پروانه بنفش', emoji: '🦋', color: '#a855f7', attractedByStatic: true },
          { id: 'rock', name: 'سنگ سنگین', emoji: '🪨', color: '#64748b', attractedByStatic: false },
        ],
      },
      {
        title: 'بلند کردن پرهای سبک با الکتریسیته ساکن!',
        kidPrompt: 'بادکنک رو مالش بده و ببین پرهای نرم جذب میشن ولی چکش سنگین تکون نمی‌خوره!',
        scienceTip: 'الکتریسیته ساکن نیروی ظریفی دارد و اجسام سبک را بلند می‌کند.',
        items: [
          { id: 'f1', name: 'پر سفید', emoji: '🪶', color: '#f8fafc', attractedByStatic: true },
          { id: 'f2', name: 'پر طلایی', emoji: '🪶', color: '#fde047', attractedByStatic: true },
          { id: 'ham', name: 'چکش سنگین', emoji: '🔨', color: '#64748b', attractedByStatic: false },
        ],
      },
      {
        title: 'جدا کردن فلفل از نمک با بادکنک جادویی!',
        kidPrompt: 'بادکنک شارژشده رو نزدیک ببر تا دانه‌های سبک فلفل زودتر بپرن و بچسبن!',
        scienceTip: 'چون ذرات فلفل سبک‌تر از بلورهای نمک هستند، زودتر به بادکنک می‌چسبند!',
        items: [
          { id: 'pep1', name: 'دانه فلفل ۱', emoji: '⚫', color: '#475569', attractedByStatic: true },
          { id: 'pep2', name: 'دانه فلفل ۲', emoji: '⚫', color: '#334155', attractedByStatic: true },
          { id: 'pep3', name: 'دانه فلفل ۳', emoji: '⚫', color: '#1e293b', attractedByStatic: true },
        ],
      },
      {
        title: 'رقص پفک‌های برنجی با بادکنک!',
        kidPrompt: 'بادکنک رو به بلوز پشمی بمال و دانه‌های پفکی رو به رقص دربیار!',
        scienceTip: 'در زمستان وقتی لباس پشمی درمی‌آوری صدای جرقه ریز می‌شنوی؛ آن هم الکتریسیته ساکن است!',
        items: [
          { id: 'c1', name: 'پفک برنجی', emoji: '🍿', color: '#fef08a', attractedByStatic: true },
          { id: 'c2', name: 'ذرت پفکی', emoji: '🍿', color: '#fde047', attractedByStatic: true },
          { id: 'wood', name: 'تکه چوب', emoji: '🪵', color: '#92400e', attractedByStatic: false },
        ],
      },
      {
        title: 'جذب نخ‌های کاموایی رنگارنگ!',
        kidPrompt: 'با بادکنک باردار، نخ‌های سبک رنگی رو جذب کن!',
        scienceTip: 'شانه پلاستیکی هم وقتی به مو کشیده شود همین خاصیت را پیدا می‌کند!',
        items: [
          { id: 'y1', name: 'نخ قرمز', emoji: '🧵', color: '#ef4444', attractedByStatic: true },
          { id: 'y2', name: 'نخ سبز', emoji: '🧵', color: '#22c55e', attractedByStatic: true },
          { id: 'glass', name: 'لیوان سنگین', emoji: '🥛', color: '#bae6fd', attractedByStatic: false },
        ],
      },
      {
        title: 'تکان دادن قوطی خالی سبک بدون دست!',
        kidPrompt: 'بادکنک پرانرژی رو نزدیک قوطی خالی و ستاره‌های کاغذی ببر!',
        scienceTip: 'حتی قوطی فلزی خالی هم به سمت بادکنک باردار قل می‌خورد!',
        items: [
          { id: 'can', name: 'قوطی خالی سبک', emoji: '🥫', color: '#ef4444', attractedByStatic: true },
          { id: 'st1', name: 'ستاره کاغذی', emoji: '🌟', color: '#facc15', attractedByStatic: true },
        ],
      },
      {
        title: 'ابر و رعد و برق کوچک در اتاق!',
        kidPrompt: 'بادکنک رو خوب به پشم بمال تا مثل ابر باردار بشه و قطره‌ها و ستاره‌های کاغذی رو بکشه!',
        scienceTip: 'رعد و برق آسمان هم یک الکتریسیته ساکن بسیار بزرگ بین ابرهاست!',
        items: [
          { id: 'd1', name: 'ستاره نوری ۱', emoji: '✨', color: '#fde047', attractedByStatic: true },
          { id: 'd2', name: 'ستاره نوری ۲', emoji: '✨', color: '#38bdf8', attractedByStatic: true },
          { id: 'd3', name: 'ستاره نوری ۳', emoji: '✨', color: '#f472b6', attractedByStatic: true },
        ],
      },
      {
        title: 'گلبرگ‌های بهاری و بادکنک!',
        kidPrompt: 'گلبرگ‌های سبک گل رو با بادکنک باردار جمع کن!',
        scienceTip: 'زنبورها هم هنگام پرواز بار الکتریکی کوچکی می‌گیرند که گرده گل به بدنشان می‌چسبد!',
        items: [
          { id: 'fl1', name: 'گلبرگ صورتی', emoji: '🌸', color: '#ec4899', attractedByStatic: true },
          { id: 'fl2', name: 'گلبرگ زرد', emoji: '🌼', color: '#facc15', attractedByStatic: true },
          { id: 'fl3', name: 'گلبرگ بنفش', emoji: '🌺', color: '#a855f7', attractedByStatic: true },
        ],
      },
      {
        title: 'جشن پایان فصل ۴: استاد الکتریسیته ساکن!',
        kidPrompt: 'هر ۴ کاغذ رنگی جشن رو با بادکنک جادویی جذب کن!',
        scienceTip: 'عالی بود! حالا هم برق باتری و هم برق ساکن بادکنک را می‌شناسی!',
        items: [
          { id: 'k1', name: 'پولک قرمز', emoji: '🔴', color: '#ef4444', attractedByStatic: true },
          { id: 'k2', name: 'پولک آبی', emoji: '🔵', color: '#3b82f6', attractedByStatic: true },
          { id: 'k3', name: 'پولک سبز', emoji: '🟢', color: '#22c55e', attractedByStatic: true },
          { id: 'k4', name: 'پولک طلایی', emoji: '🟡', color: '#eab308', attractedByStatic: true },
        ],
      },
    ];
    const c = configs[i];
    const goal = c.items.filter((x) => x.attractedByStatic).length;
    return {
      title: c.title,
      kidPrompt: c.kidPrompt,
      scienceTip: c.scienceTip,
      mode: 'static_balloon',
      targetGoalCount: goal,
      items: c.items,
    };
  }),

  // ================= CHAPTER 5 (41-50): Balance Scale & Seesaw =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const levels = [
      {
        title: 'ترازو: دو سیب برابرند!',
        kidPrompt: 'توی کفه چپ وزن ۲ داریم؛ وسایل رو بذار توی کفه راست تا دو طرف ترازو دقیقاً صاف و برابر بشن!',
        scienceTip: 'وقتی وزن دو کفه ترازو یکسان باشد، شاهین ترازو کاملاً افقی می‌ایستد!',
        targetWeight: 2,
        items: [
          { id: 'a1', name: 'سیب (۱)', emoji: '🍎', color: '#ef4444', weight: 1 },
          { id: 'a2', name: 'سیب دوم (۱)', emoji: '🍏', color: '#22c55e', weight: 1 },
          { id: 'w5', name: 'هندوانه سنگین (۵)', emoji: '🍉', color: '#16a34a', weight: 5 },
        ],
      },
      {
        title: 'تعادل با وزنه ۳ کیلویی!',
        kidPrompt: 'کفه مقابل وزن ۳ داره؛ ترکیب درست میوه‌ها رو بذار روی کفه تا تعادل برقرار بشه!',
        scienceTip: 'یک آناناس ۲ واحدی به اضافه یک پرتقال ۱ واحدی دقیقاً برابر ۳ می‌شود!',
        targetWeight: 3,
        items: [
          { id: 'p1', name: 'آناناس (۲)', emoji: '🍍', color: '#eab308', weight: 2 },
          { id: 'o1', name: 'پرتقال (۱)', emoji: '🍊', color: '#f97316', weight: 1 },
          { id: 'r6', name: 'صخره (۶)', emoji: '🪨', color: '#64748b', weight: 6 },
        ],
      },
      {
        title: 'الاکلنگ حیوانات مهربان (وزن ۴)!',
        kidPrompt: 'خرگوش و گربه رو طوری روی الاکلنگ بذار که با سگ مهربان (۴) برابر بشن!',
        scienceTip: 'الاکلنگ پارک دقیقاً مثل یک ترازوی بزرگ کار می‌کند!',
        targetWeight: 4,
        items: [
          { id: 'cat', name: 'گربه (۲)', emoji: '🐱', color: '#fb923c', weight: 2 },
          { id: 'rab', name: 'خرگوش (۲)', emoji: '🐰', color: '#f472b6', weight: 2 },
          { id: 'ele', name: 'بچه‌فیل (۷)', emoji: '🐘', color: '#94a3b8', weight: 7 },
        ],
      },
      {
        title: 'وزن کردن هندوانه ۵ کیلویی!',
        kidPrompt: 'برای تراز کردن هندوانه (۵)، وزنه‌های درست رو انتخاب کن!',
        scienceTip: 'در میوه‌فروشی‌ها با جمع زدن وزنه‌ها، وزن دقیق میوه را پیدا می‌کنند.',
        targetWeight: 5,
        items: [
          { id: 'b3', name: 'وزنه ۳', emoji: '🏋️', color: '#3b82f6', weight: 3 },
          { id: 'b2', name: 'وزنه ۲', emoji: '🔔', color: '#eab308', weight: 2 },
          { id: 'b1', name: 'توت‌فرنگی (۱)', emoji: '🍓', color: '#ef4444', weight: 1 },
        ],
      },
      {
        title: 'تعادل دو کفه با سه وزنه مساوی (۶)!',
        kidPrompt: 'سه تا بلوک ۲ واحدی رو بذار توی کفه تا با وزنه ۶ برابر بشن!',
        scienceTip: 'سه تا ۲ تایی روی هم می‌شود ۶!',
        targetWeight: 6,
        items: [
          { id: 'c1', name: 'مکعب آبی (۲)', emoji: '🟦', color: '#3b82f6', weight: 2 },
          { id: 'c2', name: 'مکعب قرمز (۲)', emoji: '🟥', color: '#ef4444', weight: 2 },
          { id: 'c3', name: 'مکعب سبز (۲)', emoji: '🟩', color: '#22c55e', weight: 2 },
        ],
      },
      {
        title: 'سنگین مثل خرس مهربان (وزن ۷)!',
        kidPrompt: 'وسایل مناسب رو روی ترازو بذار تا با خرس قهوه‌ای (۷) تراز بشه!',
        scienceTip: 'اگر کفه راست پایین‌تر برود یعنی سنگین‌تر شده و باید یکی برداری!',
        targetWeight: 7,
        items: [
          { id: 'w4', name: 'کدو تنبل (۴)', emoji: '🎃', color: '#f97316', weight: 4 },
          { id: 'w3', name: 'نارگیل (۳)', emoji: '🥥', color: '#78350f', weight: 3 },
          { id: 'w2', name: 'موز (۲)', emoji: '🍌', color: '#fde047', weight: 2 },
        ],
      },
      {
        title: 'ترازوی طلا و جواهر (وزن ۵)!',
        kidPrompt: 'الماس و ستاره طلایی رو بذار روی کفه تا به عدد ۵ برسه!',
        scienceTip: 'طلافروش‌ها دقیق‌ترین ترازوهای دنیا را دارند.',
        targetWeight: 5,
        items: [
          { id: 'g3', name: 'الماس آبی (۳)', emoji: '💎', color: '#38bdf8', weight: 3 },
          { id: 'g2', name: 'تاج طلا (۲)', emoji: '👑', color: '#eab308', weight: 2 },
          { id: 'g4', name: 'سنگ بزرگ (۴)', emoji: '🪨', color: '#64748b', weight: 4 },
        ],
      },
      {
        title: 'بارگیری کامیون (وزن ۸)!',
        kidPrompt: 'جعبه‌ها رو طوری بذار که دقیقاً وزن ۸ رو بسازن!',
        scienceTip: 'توازن بار باعث می‌شود کامیون و کشتی کج نشوند.',
        targetWeight: 8,
        items: [
          { id: 'bx5', name: 'جعبه بزرگ (۵)', emoji: '📦', color: '#d97706', weight: 5 },
          { id: 'bx3', name: 'جعبه متوسط (۳)', emoji: '🎁', color: '#ec4899', weight: 3 },
          { id: 'bx4', name: 'کیسه (۴)', emoji: '💰', color: '#eab308', weight: 4 },
        ],
      },
      {
        title: 'تعادل فضانوردی (وزن ۹)!',
        kidPrompt: 'سنگ‌های ماه رو روی کفه بچین تا ترازو روی عدد ۹ صاف بایسته!',
        scienceTip: 'جرم اجسام همه‌جا ثابت است ولی وزنشان روی ماه سبک‌تر حس می‌شود!',
        targetWeight: 9,
        items: [
          { id: 'm5', name: 'شهاب‌سنگ (۵)', emoji: '☄️', color: '#f97316', weight: 5 },
          { id: 'm4', name: 'ستاره دنباله‌دار (۴)', emoji: '🌟', color: '#facc15', weight: 4 },
          { id: 'm2', name: 'ماه کوچک (۲)', emoji: '🌙', color: '#cbd5e1', weight: 2 },
        ],
      },
      {
        title: 'قهرمان ترازو و ریاضی (وزن ۱۰)!',
        kidPrompt: 'بزرگ‌ترین چالش تعادل! کفه ترازو رو دقیقاً به وزن ۱۰ برسون!',
        scienceTip: 'آفرین! هم مفهوم جرم و تعادل فیزیک و هم جمع اعداد را عالی یاد گرفتی!',
        targetWeight: 10,
        items: [
          { id: 't5', name: 'گنجینه طلا (۵)', emoji: '🏆', color: '#eab308', weight: 5 },
          { id: 't3', name: 'یاقوت (۳)', emoji: '💎', color: '#ef4444', weight: 3 },
          { id: 't2', name: 'ستاره (۲)', emoji: '⭐', color: '#facc15', weight: 2 },
        ],
      },
    ];
    const l = levels[i];
    return {
      title: l.title,
      kidPrompt: l.kidPrompt,
      scienceTip: l.scienceTip,
      mode: 'balance_scale',
      targetGoalCount: 1,
      targetWeight: l.targetWeight,
      items: l.items,
    };
  }),

  // ================= CHAPTER 6 (51-60): Light, Prism Rainbow, Mirror & Magnifier =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const titles = [
      'ساخت رنگین‌کمان ۷ رنگ با منشور شیشه‌ای!',
      'بازتاب نور چراغ‌قوه با آینه براق!',
      'عبور نور از شیشه شفاف در برابر چوب کدر!',
      'بزرگ‌نمایی کفشدوزک ریز با ذره‌بین!',
      'رنگین‌کمان بعد از باران (خورشید و قطره آب)!',
      'نور رنگی با طلق قرمز و آبی!',
      'پیدا کردن سایه حیوانات با چراغ‌قوه!',
      'هدایت نور خورشید به گلدان با آینه!',
      'بررسی رگبرگ‌های برگ زیر ذره‌بین بزرگ!',
      'جشن نور و رنگین‌کمان (پایان فصل ۶)!',
    ];
    return {
      title: titles[i],
      kidPrompt: 'ابزارهای نوری رو سر راه پرتو نور قرار بده و چراغ‌قوه رو روشن کن تا جادوی نور و رنگین‌کمان ظاهر بشه!',
      scienceTip: 'نور سفید خورشید در واقع از ۷ رنگ زیبای رنگین‌کمان ساخته شده که هنگام عبور از منشور یا قطره باران جدا می‌شوند!',
      mode: 'light_prism',
      targetGoalCount: 2,
      items: [
        { id: 'flashlight', name: 'منبع نور طلایی', emoji: '🔦', color: '#facc15', isRequiredStep: true },
        { id: 'prism', name: i % 2 === 0 ? 'منشور بلورین' : 'آینه و ذره‌بین', emoji: i % 2 === 0 ? '💎' : '🔍', color: '#38bdf8', isRequiredStep: true },
      ],
    };
  }),

  // ================= CHAPTER 7 (61-70): Ramps, Wheels & Friction =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const rampTitles = [
      'مسابقه سرسره: روی یخ لیز سریع‌تره یا روی فرش؟',
      'چرا چرخ گرد راحت قل می‌خورد ولی مکعب چوبی گیر می‌کند؟',
      'سرعت ماشین روی چوب صاف در برابر شن ساحلی!',
      'تیله شیشه‌ای روی سطح شیب‌دار بلند!',
      'کم کردن اصطکاک با چرخ‌اسکیت!',
      'چرا کفش زمستانی آج‌دار روی برف لیز نمی‌خورد؟',
      'مسابقه توپ فوتبال و توپ پشمی روی سرسره!',
      'سُر خوردن سورتمه روی پیست برفی!',
      'ترمز ایمنی ماشین روی جاده زبر!',
      'قهرمان حرکت و اصطکاک (پایان فصل ۷)!',
    ];
    return {
      title: rampTitles[i],
      kidPrompt: 'هر دو مسیر سرسره (لیز و زبر) رو امتحان کن و مسابقه رو شروع کن تا ببینی کدوم زودتر به خط پایان می‌رسه!',
      scienceTip: 'اصطکاک نیروی مالش بین سطوح است؛ یخ اصطکاک خیلی کمی دارد و اجسام رویش تند لیز می‌خورند، ولی فرش زبر سرعت را می‌گیرد!',
      mode: 'ramp_friction',
      targetGoalCount: 2,
      items: [
        { id: 'fast', name: 'مسیر یخی / چرخ‌دار', emoji: '🏎️', color: '#38bdf8', speedFactor: 9, isRequiredStep: true },
        { id: 'slow', name: 'مسیر فرشی زبر', emoji: '🚜', color: '#f59e0b', speedFactor: 3, isRequiredStep: true },
      ],
    };
  }),

  // ================= CHAPTER 8 (71-80): Wind Power & Musical Water Glasses =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    if (i < 5) {
      const windTitles = [
        'چرخاندن فرفره رنگی با نیروی باد!',
        'حرکت قایق بادبانی روی آب با باد!',
        'پرواز بادبادک رنگارنگ در آسمان!',
        'توربین بادی تولید برق پاک!',
        'فرود نرم چتر نجات در هوا!',
      ];
      return {
        title: windTitles[i],
        kidPrompt: 'دکمه بادزن رو بزن و قدرت باد رو زیاد کن تا ببینی هوای نامرئی چطور اجسام رو به حرکت درمی‌آره!',
        scienceTip: 'هوا با اینکه دیده نمی‌شود اما وجود دارد و وقتی حرکت می‌کند (باد)، انرژی حرکتی زیادی دارد!',
        mode: 'wind_energy',
        targetGoalCount: 3,
        items: [
          { id: 'w1', name: 'فرفره بادی', emoji: '🎡', color: '#ec4899', isRequiredStep: true },
          { id: 'w2', name: 'قایق بادبانی', emoji: '⛵', color: '#38bdf8', isRequiredStep: true },
          { id: 'w3', name: 'بادبادک شاد', emoji: '🪁', color: '#facc15', isRequiredStep: true },
        ],
      };
    }
    const soundTitles = [
      'سنتور آبی! صدای زیر و بم لیوان‌های آب',
      'نواختن آهنگ با ۴ لیوان کریستالی!',
      'کدام لیوان صدای نازک‌تر (زیرتر) دارد؟',
      'کدام لیوان صدای بم‌تر دارد؟',
      'کنسرت علمی دانشمند کوچولو (پایان فصل ۸)!',
    ];
    return {
      title: soundTitles[i - 5],
      kidPrompt: 'با قاشق چوبی روی همه لیوان‌های آب ضربه بزن و گوش کن که مقدار آب چطور صدای موسیقی رو عوض می‌کنه!',
      scienceTip: 'صدا از لرزش (ارتعاش) به وجود می‌آید؛ لیوان کم‌آب تندتر می‌لرزد و صدای زیر می‌دهد، و لیوان پرآب صدای بم می‌دهد!',
      mode: 'sound_glasses',
      targetGoalCount: 5,
      items: [
        { id: 'g1', name: 'لیوان کم‌آب', emoji: '🥃', color: '#f43f5e', weight: 1 },
        { id: 'g2', name: 'لیوان دوم', emoji: '🥃', color: '#fb923c', weight: 2 },
        { id: 'g3', name: 'لیوان نیمه', emoji: '🥃', color: '#facc15', weight: 3 },
        { id: 'g4', name: 'لیوان چهارم', emoji: '🥃', color: '#22c55e', weight: 4 },
        { id: 'g5', name: 'لیوان پرآب', emoji: '🥃', color: '#3b82f6', weight: 5 },
      ],
    };
  }),

  // ================= CHAPTER 9 (81-90): Nature, Seeds, Water & Sun Plant Growth =================
  ...Array.from({ length: 10 }, (_, i): PhysBlueprint => {
    const plants = [
      { title: 'کاشتن اولین دانه آفتابگردان!', emoji: '🌻', name: 'گل آفتابگردان' },
      { title: 'پرورش بوته توت‌فرنگی شیرین!', emoji: '🍓', name: 'بوته توت‌فرنگی' },
      { title: 'رشد درخت سیب قرمز از یک دانه کوچک!', emoji: '🍎', name: 'درخت سیب' },
      { title: 'رویش لاله بهاری رنگارنگ!', emoji: '🌷', name: 'گل لاله' },
      { title: 'پرورش بلال ذرت طلایی!', emoji: '🌽', name: 'گیاه ذرت' },
      { title: 'باغچه گوجه فرنگی آبدار!', emoji: '🍅', name: 'بوته گوجه' },
      { title: 'کمک زنبور عسل به شکوفه‌های بهاری!', emoji: '🌸', name: 'درخت شکوفه' },
      { title: 'پرورش هندوانه شیرین تابستانی!', emoji: '🍉', name: 'بوته هندوانه' },
      { title: 'کاشت درخت کاج همیشه‌سبز!', emoji: '🌲', name: 'درخت سبز' },
      { title: 'مرحله ۹۰ علوم: باغ بهشتی فارغ‌التحصیلی دانشمند کوچولو!', emoji: '🌳', name: 'درخت زندگی' },
    ];
    const p = plants[i];
    return {
      title: p.title,
      kidPrompt: `برای رشد ${p.name}، به ترتیب دانه، خاک مقوی، آب باران و نور خورشید مهربان رو به گلدان بده تا جوونه بزنه و بزرگ بشه!`,
      scienceTip: 'گیاهان موجودات زنده‌ای هستند که با کمک آب، خاک، هوا و نور خورشید (فتوسنتز) رشد می‌کنند و برای ما اکسیژن و میوه می‌سازند!',
      mode: 'plant_growth',
      targetGoalCount: 4,
      items: [
        { id: 'seed', name: 'دانه کوچک', emoji: '🌰', color: '#92400e', isRequiredStep: true },
        { id: 'soil', name: 'خاک مقوی', emoji: '🪴', color: '#78350f', isRequiredStep: true },
        { id: 'rain', name: 'آب باران', emoji: '🌧️', color: '#38bdf8', isRequiredStep: true },
        { id: 'sun', name: 'نور خورشید (و محصول ' + p.emoji + ')', emoji: '☀️', color: '#facc15', isRequiredStep: true },
      ],
    };
  }),
];

export const PHYSICS_LEVELS: PhysicsLevel[] = PHYS_BLUEPRINTS.map((b, idx) => {
  const num = idx + 1;
  const chapter = Math.ceil(num / 10);
  return {
    id: `phys-${num}`,
    lab: 'physics',
    number: num,
    chapter,
    chapterTitle: PHYS_CHAPTERS[chapter],
    ...b,
  };
});

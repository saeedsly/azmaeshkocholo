import { AcademyLevel } from '../types/game';

function buildLogicLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Chapter 1 (1..10): Kid Robot Coding — Straight & 1-Turn Paths (No obstacles at start!)
  const ROBOT_CH1: {
    start: [number, number];
    goal: [number, number];
    obs: [number, number][];
    emoji: string;
    title: string;
  }[] = [
    { start: [1, 0], goal: [1, 2], obs: [], emoji: '⭐', title: 'اولین فرمان ربات: ۲ قدم به جلو!' },
    { start: [1, 0], goal: [1, 3], obs: [], emoji: '🔋', title: 'رساندن ربات به باتری پرانرژی!' },
    { start: [0, 1], goal: [2, 1], obs: [], emoji: '🌟', title: 'حرکت ربات به سمت پایین!' },
    { start: [3, 2], goal: [1, 2], obs: [], emoji: '💎', title: 'حرکت ربات به سمت بالا!' },
    { start: [0, 0], goal: [1, 2], obs: [], emoji: '⭐', title: 'مسیر ال شکل (راست و پایین)!' },
    { start: [2, 0], goal: [0, 2], obs: [], emoji: '🚀', title: 'رساندن ربات به سکوی موشک!' },
    { start: [0, 0], goal: [2, 2], obs: [[1, 0]], emoji: '🔋', title: 'رد شدن از کنار سنگ فضایی!' },
    { start: [3, 0], goal: [1, 3], obs: [[2, 1]], emoji: '🏆', title: 'مسیر قهرمانی ربات کوچولو!' },
    { start: [0, 3], goal: [2, 0], obs: [[0, 1]], emoji: '⭐', title: 'سفر از راست به چپ جدول!' },
    { start: [3, 3], goal: [0, 0], obs: [[2, 2]], emoji: '👑', title: 'جشن فارغ‌التحصیلی فصل اول کدنویسی!' },
  ];
  ROBOT_CH1.forEach((cfg, i) => {
    const num = 1 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 1,
      chapterTitle: 'فصل ۱: برنامه‌نویسی تصویری ربات کوچولو',
      title: cfg.title,
      kidPrompt: 'با دکمه‌های جهت‌نما (⬆️ ⬇️ ⬅️ ➡️) به ربات فرمان بده تا قدم‌به‌قدم به هدف برسه!',
      scienceTip: 'هورااا برنامه‌نویس کوچولو! دقیقاً مثل یک مهندس واقعی به ربات دستور دادی و به هدف رسوندیش!',
      winVoiceClipKey: 'win_logic_robot',
      gameKind: 'robot_coding',
      gridSize: 4,
      robotStart: cfg.start,
      goalPos: cfg.goal,
      goalEmoji: cfg.emoji,
      obstacles: cfg.obs,
    });
  });

  // Chapter 2 (11..20): Kid Robot Coding — Maze Obstacles!
  const ROBOT_CH2: {
    start: [number, number];
    goal: [number, number];
    obs: [number, number][];
    emoji: string;
  }[] = [
    { start: [0, 0], goal: [0, 3], obs: [[0, 1]], emoji: '⭐' },
    { start: [0, 0], goal: [2, 3], obs: [[0, 2], [1, 1]], emoji: '🔋' },
    { start: [3, 0], goal: [0, 3], obs: [[2, 0], [1, 2]], emoji: '💎' },
    { start: [1, 0], goal: [1, 3], obs: [[1, 1], [1, 2]], emoji: '🌟' },
    { start: [0, 3], goal: [3, 0], obs: [[1, 3], [2, 1]], emoji: '🚀' },
    { start: [3, 3], goal: [0, 1], obs: [[2, 3], [1, 1]], emoji: '🎁' },
    { start: [2, 0], goal: [0, 3], obs: [[1, 0], [1, 2]], emoji: '🏆' },
    { start: [0, 1], goal: [3, 2], obs: [[1, 1], [2, 2]], emoji: '🔋' },
    { start: [3, 1], goal: [0, 2], obs: [[2, 1], [1, 2]], emoji: '⭐' },
    { start: [0, 0], goal: [3, 3], obs: [[0, 1], [2, 2], [1, 3]], emoji: '👑' },
  ];
  ROBOT_CH2.forEach((cfg, i) => {
    const num = 11 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 2,
      chapterTitle: 'فصل ۲: هدایت ربات از بین موانع فضایی',
      title: `هزارتوی ربات هوشمند — ماموریت ${i + 1}`,
      kidPrompt: 'مواظب سنگ‌های فضایی باش! راه باز رو پیدا کن و ربات رو به هدف برسون!',
      scienceTip: 'فوق‌العاده بود! وقتی سر راه مانع باشه، برنامه‌نویس باهوش مسیرش رو دور می‌زنه و راه‌حل جدید پیدا می‌کنه!',
      winVoiceClipKey: 'win_logic_robot',
      gameKind: 'robot_coding',
      gridSize: 4,
      robotStart: cfg.start,
      goalPos: cfg.goal,
      goalEmoji: cfg.emoji,
      obstacles: cfg.obs,
    });
  });

  // Chapter 3 (21..30): Visual Pattern Trains (ABAB, AABB, ABC)
  const PATTERNS = [
    { seq: ['🔴', '🔵', '🔴', '🔵'], miss: 3, ans: '🔵', x1: '🟢', x2: '🟡' },
    { seq: ['🍎', '🍌', '🍎', '🍌'], miss: 2, ans: '🍎', x1: '🍇', x2: '🍉' },
    { seq: ['⭐', '🌙', '⭐', '🌙'], miss: 3, ans: '🌙', x1: '☀️', x2: '☁️' },
    { seq: ['🚗', '🚌', '🚗', '🚌'], miss: 1, ans: '🚌', x1: '✈️', x2: '⛵' },
    { seq: ['🐱', '🐶', '🐱', '🐶'], miss: 3, ans: '🐶', x1: '🐸', x2: '🦁' },
    { seq: ['🔺', '🟦', '🔺', '🟦'], miss: 2, ans: '🔺', x1: '⭕', x2: '💚' },
    { seq: ['🌸', '🌸', '🍃', '🌸'], miss: 3, ans: '🌸', x1: '❄️', x2: '🔥' },
    { seq: ['🌞', '🌧️', '🌞', '🌧️'], miss: 3, ans: '🌧️', x1: '⛄', x2: '🌪️' },
    { seq: ['🎈', '🎁', '🎈', '🎁'], miss: 1, ans: '🎁', x1: '⚽', x2: '📘' },
    { seq: ['🟢', '🟡', '🔴', '🟢'], miss: 3, ans: '🟢', x1: '⚫', x2: '🟣' },
  ];
  PATTERNS.forEach((p, i) => {
    const num = 21 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 3,
      chapterTitle: 'فصل ۳: قطار کشف الگوهای هوش',
      title: `کشف الگوی قطار شادی — معمای ${i + 1}`,
      kidPrompt: 'با دقت به ترتیب شکل‌های واگن‌ها نگاه کن! نوبت کدوم شکله؟',
      scienceTip: 'باریکلا نابغه! پیدا کردن الگوهای تکراری یکی از مهم‌ترین مهارت‌های ریاضی و هوشه!',
      gameKind: 'sequence_train',
      wagons: p.seq,
      missingWagonIndex: p.miss,
      options: [
        { id: 'ok', label: p.ans, isCorrect: true },
        { id: 'w1', label: p.x1, isCorrect: false },
        { id: 'w2', label: p.x2, isCorrect: false },
      ],
    });
  });

  // Chapter 4 (31..40): Odd-One-Out (کدام یکی فرق دارد؟)
  const ODD_SETS = [
    { group: 'میوه‌ها و ماشین!', odd: ['🚗', 'ماشین'], same: [['🍎', 'سیب'], ['🍌', 'موز']], why: 'سیب و موز میوه هستن ولی ماشین وسیله نقلیه است!' },
    { group: 'پرنده‌ها و ماهی!', odd: ['🐟', 'ماهی'], same: [['🦅', 'عقاب'], ['🦜', 'طوطی']], why: 'طوطی و عقاب پرواز می‌کنن ولی ماهی توی آب شنا می‌کنه!' },
    { group: 'خوراکی‌ها و کفش!', odd: ['👟', 'کفش'], same: [['🍕', 'پیتزا'], ['🍦', 'بستنی']], why: 'پیتزا و بستنی خوراکی هستن ولی کفش رو می‌پوشیم!' },
    { group: 'حیوانات و صندلی!', odd: ['🪑', 'صندلی'], same: [['🦁', 'شیر'], ['🐘', 'فیل']], why: 'شیر و فیل حیوان زنده هستن ولی صندلی شیء بی‌جانه!' },
    { group: 'آسمان شب و توپ!', odd: ['⚽', 'توپ'], same: [['🌙', 'ماه'], ['⭐', 'ستاره']], why: 'ماه و ستاره در آسمان شب می‌درخشن!' },
    { group: 'زمستان و هندوانه!', odd: ['🍉', 'هندوانه'], same: [['⛄', 'آدم‌برفی'], ['🧤', 'دستکش']], why: 'آدم‌برفی و دستکش مال زمستان هستن!' },
    { group: 'دریا و دوچرخه!', odd: ['🚲', 'دوچرخه'], same: [['🐬', 'دلفین'], ['🐙', 'اختاپوس']], why: 'دلفین و اختاپوس در دریا زندگی می‌کنن!' },
    { group: 'ابزار نقاشی و قاشق!', odd: ['🥄', 'قاشق'], same: [['🎨', 'پالت رنگ'], ['🖍️', 'مداد شمعی']], why: 'پالت و مداد شمعی برای نقاشی هستن ولی قاشق برای غذاست!' },
    { group: 'لباس‌ها و موشک!', odd: ['🚀', 'موشک'], same: [['👕', 'تی‌شرت'], ['🧢', 'کلاه']], why: 'تی‌شرت و کلاه لباس هستن ولی موشک به فضا می‌ره!' },
    { group: 'سازهای موسیقی و سیب!', odd: ['🍎', 'سیب'], same: [['🎸', 'گیتار'], ['🥁', 'طبل']], why: 'گیتار و طبل ساز موسیقی هستن ولی سیب میوه است!' },
  ];
  ODD_SETS.forEach((o, i) => {
    const num = 31 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 4,
      chapterTitle: 'فصل ۴: شکار شکل متفاوت (تیزبینی)',
      title: `کدوم یکی با بقیه فرق داره؟ (${o.group})`,
      kidPrompt: 'با دقت نگاه کن عزیزم! دو تا از کارت‌ها شبیه هم هستن ولی یکی با بقیه فرق داره؛ متفاوته رو بزن!',
      scienceTip: `آفرین تیزبین من! ${o.why}`,
      gameKind: 'choice_discovery',
      heroDisplay: 'کدوم فرق داره؟ 🔍',
      heroSubLabel: 'شکل متفاوت رو پیدا کن!',
      options: [
        { id: 'odd', label: o.odd[1], emoji: o.odd[0], isCorrect: true },
        { id: 's1', label: o.same[0][1], emoji: o.same[0][0], isCorrect: false },
        { id: 's2', label: o.same[1][1], emoji: o.same[1][0], isCorrect: false },
      ],
    });
  });

  // Chapter 5 (41..50): Brain Memory Match Cards
  const MEM_THEMES = [
    [['🦁', '🦁', 'شیر'], ['🐘', '🐘', 'فیل'], ['🦒', '🦒', 'زرافه']],
    [['🚀', '🚀', 'موشک'], ['🪐', '🪐', 'زحل'], ['🌟', '🌟', 'ستاره']],
    [['🍎', '🍎', 'سیب'], ['🍓', '🍓', 'توت‌فرنگی'], ['🍌', '🍌', 'موز']],
    [['🚗', '🚗', 'ماشین'], ['✈️', '✈️', 'هواپیما'], ['⛵', '⛵', 'قایق']],
    [['⚽', '⚽', 'توپ'], ['🪁', '🪁', 'بادبادک'], ['🧸', '🧸', 'خرس عروسکی']],
    [['🦋', '🦋', 'پروانه'], ['🐝', '🐝', 'زنبور'], ['🐞', '🐞', 'کفشدوزک']],
    [['🌞', '🌞', 'خورشید'], ['🌈', '🌈', 'رنگین‌کمان'], ['❄️', '❄️', 'برف']],
    [['🎸', '🎸', 'گیتار'], ['🥁', '🥁', 'طبل'], ['🎺', '🎺', 'شیپور']],
    [['👑', '👑', 'تاج'], ['💎', '💎', 'الماس'], ['🔑', '🔑', 'کلید']],
    [['🦖', '🦖', 'دایناسور'], ['🐬', '🐬', 'دلفین'], ['🦜', '🦜', 'طوطی']],
  ];
  MEM_THEMES.forEach((set, i) => {
    const num = 41 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 5,
      chapterTitle: 'فصل ۵: باشگاه تقویت حافظه تصویری',
      title: `کارت‌های جادویی حافظه — مرحله ${i + 1}`,
      kidPrompt: 'جای شکل‌ها رو توی ذهنت بسپار و هر دو کارت یکسان رو با هم جفت کن!',
      scienceTip: 'ماشاءالله به این حافظه قوی! تمرین کارت‌های حافظه تمرکز و هوش رو چند برابر می‌کنه!',
      gameKind: 'memory_match',
      memoryPairs: set.map((p, idx) => ({
        pairId: `lp-${idx}`,
        cardA: p[0],
        cardB: p[1],
        speakFa: p[2],
      })),
    });
  });

  // Chapter 6 (51..60): Logical Sorting Bins
  const LOGIC_SORTS = [
    {
      title: 'پرنده‌های آسمان و ساکنان دریا',
      a: { title: 'آسمان و پرواز', emoji: '☁️', colorHex: '#38bdf8' },
      b: { title: 'دریا و شنا', emoji: '🌊', colorHex: '#0284c7' },
      items: [
        { id: '1', nameFa: 'پرنده', emoji: '🐦', targetBin: 'A' as const },
        { id: '2', nameFa: 'ماهی', emoji: '🐟', targetBin: 'B' as const },
        { id: '3', nameFa: 'هواپیما', emoji: '✈️', targetBin: 'A' as const },
        { id: '4', nameFa: 'دلفین', emoji: '🐬', targetBin: 'B' as const },
      ],
    },
    {
      title: 'خوراکی‌های خوشمزه یا اسباب‌بازی‌ها؟',
      a: { title: 'خوراکی‌ها', emoji: '🍽️', colorHex: '#22c55e' },
      b: { title: 'اسباب‌بازی‌ها', emoji: '🧸', colorHex: '#f59e0b' },
      items: [
        { id: '1', nameFa: 'سیب', emoji: '🍎', targetBin: 'A' as const },
        { id: '2', nameFa: 'توپ', emoji: '⚽', targetBin: 'B' as const },
        { id: '3', nameFa: 'موز', emoji: '🍌', targetBin: 'A' as const },
        { id: '4', nameFa: 'ماشین اسباب‌بازی', emoji: '🚗', targetBin: 'B' as const },
      ],
    },
    {
      title: 'چیزهای داغ و گرم در برابر چیزهای سرد!',
      a: { title: 'گرم و داغ', emoji: '🔥', colorHex: '#ef4444' },
      b: { title: 'خنک و سرد', emoji: '❄️', colorHex: '#38bdf8' },
      items: [
        { id: '1', nameFa: 'خورشید', emoji: '☀️', targetBin: 'A' as const },
        { id: '2', nameFa: 'بستنی', emoji: '🍦', targetBin: 'B' as const },
        { id: '3', nameFa: 'چای داغ', emoji: '☕', targetBin: 'A' as const },
        { id: '4', nameFa: 'آدم‌برفی', emoji: '⛄', targetBin: 'B' as const },
      ],
    },
    {
      title: 'وسایل روز و وسایل شب',
      a: { title: 'روز روشن', emoji: '🌞', colorHex: '#eab308' },
      b: { title: 'شب آرام', emoji: '🌙', colorHex: '#6366f1' },
      items: [
        { id: '1', nameFa: 'خورشید', emoji: '☀️', targetBin: 'A' as const },
        { id: '2', nameFa: 'ماه و ستاره', emoji: '🌙', targetBin: 'B' as const },
        { id: '3', nameFa: 'عینک آفتابی', emoji: '🕶️', targetBin: 'A' as const },
        { id: '4', nameFa: 'چراغ خواب', emoji: '🛌', targetBin: 'B' as const },
      ],
    },
    {
      title: 'حیوانات بزرگ در برابر حیوانات ریز و کوچک!',
      a: { title: 'بزرگ و قوی', emoji: '🐘', colorHex: '#f97316' },
      b: { title: 'کوچک و ظریف', emoji: '🐞', colorHex: '#10b981' },
      items: [
        { id: '1', nameFa: 'فیل', emoji: '🐘', targetBin: 'A' as const },
        { id: '2', nameFa: 'مورچه', emoji: '🐜', targetBin: 'B' as const },
        { id: '3', nameFa: 'نهنگ', emoji: '🐋', targetBin: 'A' as const },
        { id: '4', nameFa: 'زنبور', emoji: '🐝', targetBin: 'B' as const },
      ],
    },
  ];
  for (let i = 0; i < 10; i++) {
    const num = 51 + i;
    const cfg = LOGIC_SORTS[i % LOGIC_SORTS.length];
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 6,
      chapterTitle: 'فصل ۶: دسته‌بندی هوشمند مجموعه‌ها',
      title: `${cfg.title} (${i + 1})`,
      kidPrompt: 'هر تصویر رو نگاه کن و بذارش توی سبد درست خودش!',
      scienceTip: 'آفرین متفکر کوچولو! دسته‌بندی اشیاء پایه تفکر علمی و مهندسیه!',
      gameKind: 'sorting_bins',
      binA: cfg.a,
      binB: cfg.b,
      sortItems: cfg.items,
    });
  }

  // Chapter 7 (61..70): Advanced Space Robot Missions!
  for (let i = 0; i < 10; i++) {
    const num = 61 + i;
    const starts: [number, number][] = [
      [0, 0], [3, 0], [0, 3], [3, 3], [1, 0],
      [2, 3], [0, 2], [3, 1], [2, 0], [0, 0],
    ];
    const goals: [number, number][] = [
      [3, 3], [0, 3], [3, 0], [0, 0], [3, 3],
      [0, 0], [3, 0], [0, 3], [0, 3], [3, 2],
    ];
    const obsList: [number, number][][] = [
      [[1, 1], [2, 2]],
      [[1, 0], [2, 2]],
      [[1, 2], [2, 1]],
      [[2, 3], [1, 1]],
      [[1, 2], [2, 1]],
      [[2, 1], [0, 2]],
      [[1, 2], [2, 0]],
      [[2, 1], [1, 3]],
      [[1, 1], [0, 1]],
      [[0, 1], [1, 1], [2, 3]],
    ];
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 7,
      chapterTitle: 'فصل ۷: فرمانده ارشد ربات فضانورد',
      title: `ماموریت فضایی ربات — سیاره ${i + 1}`,
      kidPrompt: 'مهندس کوچولو، بهترین مسیر رو از بین شهاب‌سنگ‌ها پیدا کن و ربات رو به کریستال برسون!',
      scienceTip: 'درود بر مهندس برنامه‌نویس آینده! مثل یک حرفه‌ای الگوریتم مسیر ربات رو اجرا کردی!',
      winVoiceClipKey: 'win_logic_robot',
      gameKind: 'robot_coding',
      gridSize: 4,
      robotStart: starts[i],
      goalPos: goals[i],
      goalEmoji: '💎',
      obstacles: obsList[i],
    });
  }

  // Chapter 8 (71..80): Logical Associations (چه چیزی با چه چیزی جفت می‌شود؟)
  const ASSOCS = [
    { q: 'قفل 🔒 با چی باز می‌شه؟', ans: ['🔑', 'کلید'], w1: ['🥄', 'قاشق'], w2: ['✏️', 'مداد'] },
    { q: 'وقتی بارون 🌧️ میاد چی دستمون می‌گیریم؟', ans: ['☂️', 'چتر'], w1: ['🕶️', 'عینک دودی'], w2: ['⚽', 'توپ'] },
    { q: 'مسواک 🪥 دوستِ صمیمیِ چیه؟', ans: ['🦷', 'دندان تمیز'], w1: ['👟', 'کفش'], w2: ['🚗', 'ماشین'] },
    { q: 'مداد رنگی 🖍️ رو روی چی می‌کشیم؟', ans: ['📒', 'دفتر نقاشی'], w1: ['🍲', 'قابلمه'], w2: ['枕', 'بالش'] },
    { q: 'ماهی 🐟 توی کجا زندگی می‌کنه؟', ans: ['🌊', 'آب و دریا'], w1: ['🌵', 'بیابان'], w2: ['☁️', 'ابرها'] },
    { q: 'پرنده 🐦 خونه‌اش کجاست؟', ans: ['🪺', 'لانه روی درخت'], w1: ['🏠', 'گاراژ ماشین'], w2: ['🧊', 'یخچال'] },
    { q: 'کفش 👟 رو با چی می‌پوشیم؟', ans: ['🧦', 'جوراب'], w1: ['🧤', 'دستکش'], w2: ['🧢', 'کلاه'] },
    { q: 'سوپ گرم 🥣 رو با چی می‌خوریم؟', ans: ['🥄', 'قاشق'], w1: ['✂️', 'قیچی'], w2: ['🔑', 'کلید'] },
    { q: 'ماشین آتش‌نشانی 🚒 چی رو خاموش می‌کنه؟', ans: ['🔥', 'آتش'], w1: ['⛄', 'برف'], w2: ['🌈', 'رنگین‌کمان'] },
    { q: 'فضانورد 🧑‍🚀 با چی به فضا می‌ره؟', ans: ['🚀', 'موشک فضایی'], w1: ['🚲', 'دوچرخه'], w2: ['⛵', 'قایق'] },
  ];
  ASSOCS.forEach((a, i) => {
    const num = 71 + i;
    levels.push({
      id: `logic-${String(num).padStart(3, '0')}`,
      lab: 'logic',
      number: num,
      chapter: 8,
      chapterTitle: 'فصل ۸: معمای رابطه‌ها و منطق',
      title: a.q,
      kidPrompt: a.q,
      scienceTip: `آفرین باهوش من! «${a.ans[1]}» دقیقاً جفت و همراه درست این معماست!`,
      gameKind: 'choice_discovery',
      heroDisplay: a.q,
      heroSubLabel: 'بهترین گزینه منطقی رو انتخاب کن!',
      options: [
        { id: 'ok', label: a.ans[1], emoji: a.ans[0], isCorrect: true },
        { id: 'w1', label: a.w1[1], emoji: a.w1[0], isCorrect: false },
        { id: 'w2', label: a.w2[1], emoji: a.w2[0], isCorrect: false },
      ],
    });
  });

  // Chapter 9 (81..90): Grand Logic & Coding Championship
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    if (i % 2 === 0) {
      levels.push({
        id: `logic-${String(num).padStart(3, '0')}`,
        lab: 'logic',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: جام قهرمانی هوش و برنامه‌نویسی',
        title: `فینال کدنویسی ربات — مرحله ${i + 1}`,
        kidPrompt: 'قهرمان برنامه‌نویس، ربات رو به جام طلایی قهرمانی برسون!',
        scienceTip: 'تبریک می‌گم نابغه! تو مهارت حل مسئله و برنامه‌نویسی رو عالی یاد گرفتی!',
        winVoiceClipKey: 'win_logic_robot',
        gameKind: 'robot_coding',
        gridSize: 4,
        robotStart: [0, 0],
        goalPos: [3, 3],
        goalEmoji: '🏆',
        obstacles: [[0, 2], [1, 1], [2, 3]],
      });
    } else {
      const p = PATTERNS[i];
      levels.push({
        id: `logic-${String(num).padStart(3, '0')}`,
        lab: 'logic',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: جام قهرمانی هوش و برنامه‌نویسی',
        title: `معمای بزرگ الگوی قهرمانان — مرحله ${i + 1}`,
        kidPrompt: 'آخرین واگن قطار هوش رو با شکل درست تکمیل کن!',
        scienceTip: 'هورااا! تمام چالش‌های هوش و منطق رو با موفقیت پشت سر گذاشتی!',
        gameKind: 'sequence_train',
        wagons: p.seq,
        missingWagonIndex: p.miss,
        options: [
          { id: 'ok', label: p.ans, isCorrect: true },
          { id: 'w1', label: p.x1, isCorrect: false },
          { id: 'w2', label: p.x2, isCorrect: false },
        ],
      });
    }
  }

  return levels;
}

export const LOGIC_LEVELS: AcademyLevel[] = buildLogicLevels();

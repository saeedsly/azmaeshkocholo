import { AcademyLevel } from '../types/game';

function buildArtLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Chapter 1 (1..10): Discovering Colors in Nature & Toys
  const COLORS_10 = [
    { name: 'قرمز', obj: 'توت‌فرنگی قرمز', emoji: '🍓', hex: '#ef4444', w1: ['🍌', 'زرد'], w2: ['🐸', 'سبز'] },
    { name: 'زرد', obj: 'خورشید و لیمو زرد', emoji: '🍋', hex: '#facc15', w1: ['🍇', 'بنفش'], w2: ['🐳', 'آبی'] },
    { name: 'آبی', obj: 'دریا و نهنگ آبی', emoji: '🐳', hex: '#3b82f6', w1: ['🍎', 'قرمز'], w2: ['🍊', 'نارنجی'] },
    { name: 'سبز', obj: 'برگ و قورباغه سبز', emoji: '🐸', hex: '#22c55e', w1: ['🍓', 'قرمز'], w2: ['🍋', 'زرد'] },
    { name: 'نارنجی', obj: 'پرتقال و هویج نارنجی', emoji: '🍊', hex: '#f97316', w1: ['🐳', 'آبی'], w2: ['🍇', 'بنفش'] },
    { name: 'بنفش', obj: 'انگور بنفش', emoji: '🍇', hex: '#a855f7', w1: ['🍋', 'زرد'], w2: ['🐸', 'سبز'] },
    { name: 'صورتی', obj: 'فلامینگو و گل صورتی', emoji: '🌸', hex: '#ec4899', w1: ['🌳', 'سبز'], w2: ['☀️', 'زرد'] },
    { name: 'قهوه‌ای', obj: 'خرس مهربون قهوه‌ای', emoji: '🧸', hex: '#92400e', w1: ['🐳', 'آبی'], w2: ['🍓', 'قرمز'] },
    { name: 'سفید', obj: 'آدم‌برفی سفید', emoji: '⛄', hex: '#f8fafc', w1: ['🍊', 'نارنجی'], w2: ['🍇', 'بنفش'] },
    { name: 'طلایی', obj: 'ستاره درخشان طلایی', emoji: '🌟', hex: '#eab308', w1: ['🐸', 'سبز'], w2: ['🐳', 'آبی'] },
  ];
  COLORS_10.forEach((c, i) => {
    const num = 1 + i;
    levels.push({
      id: `art-${String(num).padStart(3, '0')}`,
      lab: 'art',
      number: num,
      chapter: 1,
      chapterTitle: 'فصل ۱: دنیای رنگ‌های شاد اطراف ما',
      title: `پیدا کردن رنگ زیبای «${c.name}»!`,
      kidPrompt: `هنرمند کوچولو، کدوم تصویر به رنگ «${c.name}» است؟`,
      scienceTip: `آفرین نقاش باذوق! «${c.obj}» رنگ قشنگ «${c.name}» داره!`,
      winVoiceClipKey: 'win_art_color',
      gameKind: 'choice_discovery',
      heroDisplay: `رنگ ${c.name}`,
      heroEmoji: c.emoji,
      heroColorHex: c.hex,
      heroSubLabel: 'تصویر هم‌رنگ رو پیدا کن!',
      options: [
        { id: 'ok', label: c.name, subLabel: c.obj, emoji: c.emoji, colorHex: c.hex, isCorrect: true },
        { id: 'w1', label: c.w1[1], emoji: c.w1[0], isCorrect: false },
        { id: 'w2', label: c.w2[1], emoji: c.w2[0], isCorrect: false },
      ],
    });
  });

  // Chapter 2 (11..20): Magic Color Mixing Studio!
  const COLOR_MIXES = [
    { a: ['قرمز', '#ef4444'], b: ['زرد', '#facc15'], wrong: ['آبی', '#3b82f6'], res: 'نارنجی', hex: '#f97316', target: '🍊' },
    { a: ['آبی', '#3b82f6'], b: ['زرد', '#facc15'], wrong: ['قرمز', '#ef4444'], res: 'سبز', hex: '#22c55e', target: '🐸' },
    { a: ['قرمز', '#ef4444'], b: ['آبی', '#3b82f6'], wrong: ['زرد', '#facc15'], res: 'بنفش', hex: '#a855f7', target: '🍇' },
    { a: ['قرمز', '#ef4444'], b: ['سفید', '#f8fafc'], wrong: ['سبز', '#22c55e'], res: 'صورتی', hex: '#f472b6', target: '🌸' },
    { a: ['آبی', '#2563eb'], b: ['سفید', '#f8fafc'], wrong: ['قرمز', '#ef4444'], res: 'آبی آسمانی', hex: '#38bdf8', target: '☁️' },
    { a: ['سبز', '#15803d'], b: ['زرد', '#facc15'], wrong: ['بنفش', '#a855f7'], res: 'سبز روشن بهاری', hex: '#84cc16', target: '🌱' },
    { a: ['قرمز', '#ef4444'], b: ['سبز', '#16a34a'], wrong: ['سفید', '#f8fafc'], res: 'قهوه‌ای شکلاتی', hex: '#78350f', target: '🧸' },
    { a: ['زرد', '#facc15'], b: ['سفید', '#f8fafc'], wrong: ['آبی', '#3b82f6'], res: 'کرم روشن', hex: '#fef08a', target: '🍦' },
    { a: ['بنفش', '#9333ea'], b: ['سفید', '#f8fafc'], wrong: ['سبز', '#22c55e'], res: 'یاسی ملایم', hex: '#d8b4fe', target: '🦋' },
    { a: ['آبی', '#0284c7'], b: ['سبز', '#10b981'], wrong: ['قرمز', '#ef4444'], res: 'فیروزه‌ای', hex: '#06b6d4', target: '💎' },
  ];
  COLOR_MIXES.forEach((m, i) => {
    const num = 11 + i;
    levels.push({
      id: `art-${String(num).padStart(3, '0')}`,
      lab: 'art',
      number: num,
      chapter: 2,
      chapterTitle: 'فصل ۲: آزمایشگاه جادویی ترکیب رنگ‌ها',
      title: `ترکیب «${m.a[0]}» و «${m.b[0]}» می‌شه رنگ «${m.res}»!`,
      kidPrompt: `عزیزم، رنگ «${m.a[0]}» و رنگ «${m.b[0]}» رو بریز توی پالت تا رنگ «${m.res}» بسازیم!`,
      scienceTip: `شگفت‌انگیزه! وقتی رنگ ${m.a[0]} و ${m.b[0]} با هم قاطی می‌شن، رنگ قشنگ «${m.res}» به وجود میاد!`,
      winVoiceClipKey: 'win_art_color',
      gameKind: 'color_mix_studio',
      paintChoices: [
        { id: 'pa', nameFa: m.a[0], colorHex: m.a[1], isRequired: true },
        { id: 'pb', nameFa: m.b[0], colorHex: m.b[1], isRequired: true },
        { id: 'pw', nameFa: m.wrong[0], colorHex: m.wrong[1], isRequired: false },
      ],
      mixedResultNameFa: m.res,
      mixedResultColorHex: m.hex,
      paintTargetEmoji: m.target,
    });
  });

  // Chapter 3 & 4 (21..40): Geometric Shapes & Real-World Shapes!
  const SHAPES_20 = [
    { s: 'دایره (گرد)', emoji: '🔴', real: 'چرخ و توپ گرد', w1: ['🟦', 'مربع'], w2: ['🔺', 'مثلث'] },
    { s: 'مربع (چهارگوش برابر)', emoji: '🟦', real: 'پنجره مربعی', w1: ['🔴', 'دایره'], w2: ['🔺', 'مثلث'] },
    { s: 'مثلث (سه‌گوش)', emoji: '🔺', real: 'برش پیتزا و سقف خانه', w1: ['🟦', 'مربع'], w2: ['🔴', 'دایره'] },
    { s: 'ستاره پنج‌پر', emoji: '⭐', real: 'ستاره آسمان', w1: ['🟦', 'مربع'], w2: ['🔴', 'دایره'] },
    { s: 'قلب مهربانی', emoji: '❤️', real: 'شکل قلب', w1: ['🔺', 'مثلث'], w2: ['🟦', 'مربع'] },
    { s: 'لوزی (الماس)', emoji: '🔶', real: 'بادبادک لوزی', w1: ['🔴', 'دایره'], w2: ['⭐', 'ستاره'] },
    { s: 'پیتزا چه شکلی دارد؟', emoji: '🍕', real: 'مثلث سه‌گوش 🔺', w1: ['🟦', 'مربع'], w2: ['⭐', 'ستاره'], ansEmoji: '🔺', ansLabel: 'مثلث' },
    { s: 'خورشید و توپ چه شکلی دارند؟', emoji: '⚽', real: 'دایره گرد 🔴', w1: ['🔺', 'مثلث'], w2: ['🟦', 'مربع'], ansEmoji: '🔴', ansLabel: 'دایره' },
    { s: 'بادبادک چه شکلی دارد؟', emoji: '🪁', real: 'لوزی 🔶', w1: ['🔴', 'دایره'], w2: ['⭐', 'ستاره'], ansEmoji: '🔶', ansLabel: 'لوزی' },
    { s: 'جعبه کادو چه شکلی دارد؟', emoji: '🎁', real: 'مربع چهارگوش 🟦', w1: ['🔺', 'مثلث'], w2: ['🔴', 'دایره'], ansEmoji: '🟦', ansLabel: 'مربع' },
  ];
  for (let i = 0; i < 20; i++) {
    const num = 21 + i;
    const sh = SHAPES_20[i % SHAPES_20.length];
    levels.push({
      id: `art-${String(num).padStart(3, '0')}`,
      lab: 'art',
      number: num,
      chapter: i < 10 ? 3 : 4,
      chapterTitle: i < 10 ? 'فصل ۳: شهر شکل‌های هندسی شاد' : 'فصل ۴: کشف شکل‌های هندسی در وسایل واقعی',
      title: `شناخت شکل: ${sh.s}`,
      kidPrompt: `معمار کوچولو، روی کارت درست شکل «${sh.ansLabel || sh.s.split(' ')[0]}» کلیک کن!`,
      scienceTip: `باریکلا! ${sh.real} شکل زیبای هندسی رو به ما نشون می‌ده!`,
      winVoiceClipKey: 'win_art_shape',
      gameKind: 'choice_discovery',
      heroDisplay: sh.s,
      heroEmoji: sh.emoji,
      heroSubLabel: sh.real,
      options: [
        { id: 'ok', label: sh.ansLabel || sh.s.split(' ')[0], emoji: sh.ansEmoji || sh.emoji, isCorrect: true },
        { id: 'w1', label: sh.w1[1], emoji: sh.w1[0], isCorrect: false },
        { id: 'w2', label: sh.w2[1], emoji: sh.w2[0], isCorrect: false },
      ],
    });
  }

  // Chapter 5 & 6 (41..60): Rainbow Xylophone Music Studio!
  const MELODIES = [
    { name: 'پله‌های شاد موسیقی (دو - رِ - می)', notes: [0, 1, 2] },
    { name: 'پرواز نُت‌ها تا اوج!', notes: [0, 2, 4, 6] },
    { name: 'آهنگ ستاره قشنگ آسمون ⭐', notes: [0, 0, 4, 4, 5, 5, 4] },
    { name: 'آهنگ تولدت مبارک عزیزم 🎂', notes: [0, 0, 1, 0, 3, 2] },
    { name: 'آهنگ قطار شادی بوق‌بوق 🚂', notes: [0, 1, 2, 3, 4] },
    { name: 'آهنگ بارون میاد شرشر 🌧️', notes: [4, 2, 4, 2, 0] },
    { name: 'ملودی پروانه‌های بهاری 🦋', notes: [2, 3, 4, 3, 2] },
    { name: 'ملودی زنگ مدرسه و شادی 🔔', notes: [4, 4, 2, 0] },
    { name: 'رقص دلفین‌ها در دریا 🐬', notes: [0, 3, 5, 3, 0] },
    { name: 'سمفونی قهرمان دانشمند کوچولو 🏆', notes: [0, 2, 4, 6, 4, 6] },
  ];
  for (let i = 0; i < 20; i++) {
    const num = 41 + i;
    const mel = MELODIES[i % MELODIES.length];
    levels.push({
      id: `art-${String(num).padStart(3, '0')}`,
      lab: 'art',
      number: num,
      chapter: i < 10 ? 5 : 6,
      chapterTitle: i < 10 ? 'فصل ۵: آموزش بلز رنگین‌کمانی و نُت‌ها' : 'فصل ۶: کنسرت آهنگ‌های شاد کودکانه',
      title: `نواختن ${mel.name}`,
      kidPrompt: 'روی کلید رنگی که ستاره چشمک‌زن بالای اون قرار داره بزن تا آهنگ قشنگمون کامل بشه!',
      scienceTip: `چه نوازنده‌ی هنرمندی! «${mel.name}» رو با ریتم عالی نواختی!`,
      winVoiceClipKey: 'win_art_music',
      gameKind: 'xylophone_melody',
      melodyNotes: mel.notes,
      melodyTitleFa: mel.name,
    });
  }

  // Chapter 7 (61..70): Sorting Warm/Cool Colors & Round/Cornered Shapes
  for (let i = 0; i < 10; i++) {
    const num = 61 + i;
    if (i % 2 === 0) {
      levels.push({
        id: `art-${String(num).padStart(3, '0')}`,
        lab: 'art',
        number: num,
        chapter: 7,
        chapterTitle: 'فصل ۷: دسته‌بندی رنگ‌ها و شکل‌های هندسی',
        title: `سبد شکل‌های گرد در برابر شکل‌های گوشه‌دار (${i + 1})`,
        kidPrompt: 'چیزهای گرد و دایره‌ای رو بذار توی سبد اول و شکل‌های گوشه‌دار رو توی سبد دوم!',
        scienceTip: 'آفرین معمار تیزبین! دایره هیچ گوشه‌ای نداره ولی مربع و مثلث گوشه‌دار هستن!',
        winVoiceClipKey: 'win_art_shape',
        gameKind: 'sorting_bins',
        binA: { title: 'گرد و بدون گوشه', emoji: '⭕', colorHex: '#ec4899' },
        binB: { title: 'گوشه‌دار (مثلث و مربع)', emoji: '📐', colorHex: '#3b82f6' },
        sortItems: [
          { id: '1', nameFa: 'توپ گرد', emoji: '⚽', targetBin: 'A' },
          { id: '2', nameFa: 'مثلث', emoji: '🔺', targetBin: 'B' },
          { id: '3', nameFa: 'ساعت گرد', emoji: '🕒', targetBin: 'A' },
          { id: '4', nameFa: 'مربع آبی', emoji: '🟦', targetBin: 'B' },
        ],
      });
    } else {
      levels.push({
        id: `art-${String(num).padStart(3, '0')}`,
        lab: 'art',
        number: num,
        chapter: 7,
        chapterTitle: 'فصل ۷: دسته‌بندی رنگ‌ها و شکل‌های هندسی',
        title: `سبد رنگ‌های گرم خورشیدی و رنگ‌های خنک دریایی (${i + 1})`,
        kidPrompt: 'قرمز و زرد و نارنجی رو بذار توی سبد رنگ‌های گرم و آبی و سبز رو توی سبد رنگ‌های خنک!',
        scienceTip: 'فوق‌العاده بود نقاش کوچولو! رنگ‌های گرم مثل خورشید پرانرژی‌ان و رنگ‌های سرد مثل دریا آرامش‌بخشن!',
        winVoiceClipKey: 'win_art_color',
        gameKind: 'sorting_bins',
        binA: { title: 'رنگ‌های گرم (قرمز و زرد)', emoji: '☀️', colorHex: '#f97316' },
        binB: { title: 'رنگ‌های خنک (آبی و سبز)', emoji: '🌊', colorHex: '#06b6d4' },
        sortItems: [
          { id: '1', nameFa: 'توت‌فرنگی قرمز', emoji: '🍓', targetBin: 'A' },
          { id: '2', nameFa: 'نهنگ آبی', emoji: '🐳', targetBin: 'B' },
          { id: '3', nameFa: 'پرتقال نارنجی', emoji: '🍊', targetBin: 'A' },
          { id: '4', nameFa: 'برگ سبز', emoji: '🍃', targetBin: 'B' },
        ],
      });
    }
  }

  // Chapter 8 (71..80): Artistic Memory Match
  for (let i = 0; i < 10; i++) {
    const num = 71 + i;
    levels.push({
      id: `art-${String(num).padStart(3, '0')}`,
      lab: 'art',
      number: num,
      chapter: 8,
      chapterTitle: 'فصل ۸: کارت‌های حافظه رنگ و شکل و سازها',
      title: `گالری حافظه هنرمند کوچولو — مرحله ${i + 1}`,
      kidPrompt: 'کارت‌ها رو برگردون و شکل‌ها و سازهای همسان رو پیدا کن!',
      scienceTip: 'آفرین هنرمند خوش‌فکر! چقدر سریع کارت‌های هم‌شکل رو پیدا کردی!',
      winVoiceClipKey: 'win_art_shape',
      gameKind: 'memory_match',
      memoryPairs: [
        { pairId: 'a1', cardA: '🎨 پالت', cardB: '🎨 پالت', speakFa: 'پالت نقاشی' },
        { pairId: 'a2', cardA: '🔺 مثلث', cardB: '🔺 مثلث', speakFa: 'مثلث سه‌گوش' },
        { pairId: 'a3', cardA: '🎹 پیانو', cardB: '🎹 پیانو', speakFa: 'پیانو و موسیقی' },
      ],
    });
  }

  // Chapter 9 (81..90): Grand Art, Shape & Music Festival
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    if (i < 5) {
      const m = COLOR_MIXES[i];
      levels.push({
        id: `art-${String(num).padStart(3, '0')}`,
        lab: 'art',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: جشنواره بزرگ نقاشی و موسیقی',
        title: `فینال استودیو رنگ: ساختن رنگ «${m.res}»`,
        kidPrompt: `استاد نقاش، رنگ ${m.a[0]} و ${m.b[0]} رو ترکیب کن!`,
        scienceTip: `هورااا! استودیو نقاشی با رنگ «${m.res}» درخشید!`,
        winVoiceClipKey: 'win_art_color',
        gameKind: 'color_mix_studio',
        paintChoices: [
          { id: 'pa', nameFa: m.a[0], colorHex: m.a[1], isRequired: true },
          { id: 'pb', nameFa: m.b[0], colorHex: m.b[1], isRequired: true },
          { id: 'pw', nameFa: m.wrong[0], colorHex: m.wrong[1], isRequired: false },
        ],
        mixedResultNameFa: m.res,
        mixedResultColorHex: m.hex,
        paintTargetEmoji: m.target,
      });
    } else {
      const mel = MELODIES[i];
      levels.push({
        id: `art-${String(num).padStart(3, '0')}`,
        lab: 'art',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: جشنواره بزرگ نقاشی و موسیقی',
        title: `کنسرت پایانی: ${mel.name}`,
        kidPrompt: 'بزن بریم برای اجرای باشکوه کنسرت پایانی روی بلز رنگین‌کمانی!',
        scienceTip: 'دست و جیغ و هورااا! تمام ۹۰ مرحله آتلیه هنر، شکل‌ها و موسیقی رو فتح کردی!',
        winVoiceClipKey: 'win_art_music',
        gameKind: 'xylophone_melody',
        melodyNotes: mel.notes,
        melodyTitleFa: mel.name,
      });
    }
  }

  return levels;
}

export const ART_LEVELS: AcademyLevel[] = buildArtLevels();

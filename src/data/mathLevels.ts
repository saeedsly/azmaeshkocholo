import { AcademyLevel } from '../types/game';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰', '۱۱', '۱۲', '۱۳', '۱۴', '۱۵', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰'];
const FA_WORDS = [
  'صفر',
  'یک',
  'دو',
  'سه',
  'چهار',
  'پنج',
  'شش',
  'هفت',
  'هشت',
  'نُه',
  'دَه',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده',
  'بیست',
];

export function toFaNum(n: number): string {
  if (n >= 0 && n <= 20) return FA_DIGITS[n];
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

const COUNT_ITEMS = [
  { emoji: '🍎', name: 'سیب قرمز' },
  { emoji: '⭐', name: 'ستاره طلایی' },
  { emoji: '🚗', name: 'ماشین مسابقه' },
  { emoji: '🍓', name: 'توت‌فرنگی' },
  { emoji: '🎈', name: 'بادکنک رنگی' },
  { emoji: '🐥', name: 'جوجه زرد' },
  { emoji: '⚽', name: 'توپ فوتبال' },
  { emoji: '🦋', name: 'پروانه قشنگ' },
  { emoji: '🍪', name: 'کلوچه شکلاتی' },
  { emoji: '🚀', name: 'موشک فضایی' },
];

function buildMathLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Chapter 1 (1..10): Counting & recognizing numbers 1..5
  for (let i = 0; i < 10; i++) {
    const num = i + 1;
    const n = (i % 5) + 1;
    const item = COUNT_ITEMS[i];
    if (i < 5) {
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 1,
        chapterTitle: 'فصل ۱: باغ شمارش اعداد ۱ تا ۵',
        title: `چیدن ${toFaNum(n)} ${item.name} در سبد!`,
        kidPrompt: `عزیزم، دقیقاً ${toFaNum(n)} تا ${item.name} رو لمس کن تا برن داخل سبد!`,
        scienceTip: `آفرین قهرمان! عدد «${toFaNum(n)}» یعنی ${FA_WORDS[n]} تا! وقتی دونه دونه بشماریم هیچ‌وقت اشتباه نمی‌کنیم!`,
        gameKind: 'counting_basket',
        heroDisplay: toFaNum(n),
        heroSubLabel: `عدد ${FA_WORDS[n]}`,
        targetCount: n,
        totalSpawnCount: Math.min(8, n + 2),
        countEmoji: item.emoji,
        countItemNameFa: item.name,
      });
    } else {
      const wrongs = [1, 2, 3, 4, 5].filter((x) => x !== n).slice(0, 2);
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 1,
        chapterTitle: 'فصل ۱: باغ شمارش اعداد ۱ تا ۵',
        title: `پیدا کردن عدد «${toFaNum(n)}» (${FA_WORDS[n]})`,
        kidPrompt: `بشمار ببین چند تا ${item.name} بالای صفحه هست و روی کارت عدد درست بزن!`,
        scienceTip: `باریکلا! ${item.emoji.repeat(n)} می‌شه دقیقاً ${toFaNum(n)} تا (${FA_WORDS[n]})!`,
        gameKind: 'choice_discovery',
        heroDisplay: item.emoji.repeat(n),
        heroSubLabel: `چند تا ${item.name} می‌بینی؟`,
        options: [n, ...wrongs]
          .sort((a, b) => a - b)
          .map((val) => ({
            id: `opt-${val}`,
            label: toFaNum(val),
            subLabel: FA_WORDS[val],
            emoji: item.emoji.repeat(val),
            isCorrect: val === n,
            voiceTextFa: `${FA_WORDS[val]}!`,
          })),
      });
    }
  }

  // Chapter 2 (11..20): Counting & recognizing 6..10 + Zero
  for (let i = 0; i < 10; i++) {
    const num = 11 + i;
    const item = COUNT_ITEMS[i];
    if (i < 5) {
      const n = 6 + i; // 6..10
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 2,
        chapterTitle: 'فصل ۲: جشن اعداد ۶ تا ۱۰ و صفر قهرمان',
        title: `شمارش شاد عدد «${toFaNum(n)}» (${FA_WORDS[n]})`,
        kidPrompt: `بیا با هم تا ${FA_WORDS[n]} بشماریم! روی ${toFaNum(n)} تا ${item.name} کلیک کن!`,
        scienceTip: `هورااا! تو الان بلدی تا عدد بزرگ «${toFaNum(n)}» (${FA_WORDS[n]}) بشماری!`,
        gameKind: 'counting_basket',
        heroDisplay: toFaNum(n),
        heroSubLabel: `عدد ${FA_WORDS[n]}`,
        targetCount: n,
        totalSpawnCount: n + 2,
        countEmoji: item.emoji,
        countItemNameFa: item.name,
      });
    } else if (i === 5) {
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 2,
        chapterTitle: 'فصل ۲: جشن اعداد ۶ تا ۱۰ و صفر قهرمان',
        title: 'راز عدد «۰» (صفر یعنی سبد خالی!)',
        kidPrompt: 'کدوم کارت نشون می‌ده که «هیچ سیبی» توی سبد نیست (صفر)؟',
        scienceTip: 'آفرین باهوش! وقتی توی ظرف هیچ چیزی نباشه، با عدد «۰» یعنی صفر نشونش می‌دیم!',
        gameKind: 'choice_discovery',
        heroDisplay: '۰',
        heroSubLabel: 'عدد صفر (خالی)',
        options: [
          { id: 'z0', label: '۰', subLabel: 'صفر (سبد خالی)', emoji: '🧺', isCorrect: true, voiceTextFa: 'صفر! یعنی سبد خالیه!' },
          { id: 'z2', label: '۲', subLabel: 'دو سیب', emoji: '🍎🍎', isCorrect: false },
          { id: 'z4', label: '۴', subLabel: 'چهار سیب', emoji: '🍎🍎🍎🍎', isCorrect: false },
        ],
      });
    } else {
      const n = i + 1; // 7..10
      const w1 = n - 2;
      const w2 = n === 10 ? 6 : n + 1;
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 2,
        chapterTitle: 'فصل ۲: جشن اعداد ۶ تا ۱۰ و صفر قهرمان',
        title: `شکار عدد «${toFaNum(n)}» (${FA_WORDS[n]})`,
        kidPrompt: `روی کارتی که عدد «${FA_WORDS[n]}» (${toFaNum(n)}) رو نشون می‌ده بزن!`,
        scienceTip: `عالی بود! عدد «${toFaNum(n)}» رو مثل یک ریاضی‌دان واقعی شناختی!`,
        gameKind: 'choice_discovery',
        heroDisplay: FA_WORDS[n],
        heroEmoji: item.emoji,
        heroSubLabel: `عدد ${FA_WORDS[n]} کدومه؟`,
        options: [n, w1, w2]
          .sort((a, b) => a - b)
          .map((v) => ({
            id: `c2-${v}`,
            label: toFaNum(v),
            subLabel: FA_WORDS[v],
            emoji: item.emoji,
            isCorrect: v === n,
          })),
      });
    }
  }

  // Chapter 3 (21..30): Number Sequence Train (1..12)
  for (let i = 0; i < 10; i++) {
    const num = 21 + i;
    const start = i + 1;
    const missingIdx = (i % 3) + 1; // 1, 2, or 3
    const seq = [start, start + 1, start + 2, start + 3];
    const ans = seq[missingIdx];
    levels.push({
      id: `math-${String(num).padStart(3, '0')}`,
      lab: 'math',
      number: num,
      chapter: 3,
      chapterTitle: 'فصل ۳: قطار ترتیب اعداد پشت‌سرهم',
      title: `واگن گمشده قطار اعداد (${toFaNum(start)} تا ${toFaNum(start + 3)})`,
      kidPrompt: 'ببین کدوم عدد باید سوار واگن علامت سوال (؟) بشه تا ترتیب قطار درست بشه!',
      scienceTip: `آفرین! ترتیب اعداد این قطار «${seq.map(toFaNum).join(' ، ')}» است و هر عدد یکی از قبلی بزرگ‌تره!`,
      gameKind: 'sequence_train',
      wagons: seq.map(toFaNum),
      missingWagonIndex: missingIdx,
      options: [ans, ans + 2, Math.max(0, ans - 2)]
        .sort((a, b) => a - b)
        .map((v, idx) => ({
          id: `tr-${idx}-${v}`,
          label: toFaNum(v),
          subLabel: FA_WORDS[v] || toFaNum(v),
          isCorrect: v === ans,
        })),
    });
  }

  // Chapter 4 (31..40): Comparing More / Less / Bigger Number
  for (let i = 0; i < 10; i++) {
    const num = 31 + i;
    const item = COUNT_ITEMS[i];
    const askMore = i % 2 === 0;
    const small = (i % 4) + 1;
    const big = small + 3;
    const mid = small + 1;
    const target = askMore ? big : small;
    levels.push({
      id: `math-${String(num).padStart(3, '0')}`,
      lab: 'math',
      number: num,
      chapter: 4,
      chapterTitle: 'فصل ۴: مقایسه بیشتر و کمتر',
      title: askMore ? `کدوم دسته ${item.name} «بیشتر» است؟` : `کدوم دسته ${item.name} «کمتر» است؟`,
      kidPrompt: askMore
        ? `قهرمان من، نگاه کن ببین توی کدوم کارت تعداد ${item.name} «بیشتر» و زیادتره!`
        : `قهرمان من، نگاه کن ببین توی کدوم کارت تعداد ${item.name} «کمتر» است!`,
      scienceTip: askMore
        ? `هورااا! عدد ${toFaNum(big)} از ${toFaNum(mid)} و ${toFaNum(small)} بزرگ‌تر و بیشتر است!`
        : `باریکلا! عدد ${toFaNum(small)} از بقیه کمتر و کوچک‌تر است!`,
      gameKind: 'choice_discovery',
      heroDisplay: askMore ? 'بیشتر ⬆️' : 'کمتر ⬇️',
      heroEmoji: item.emoji,
      heroSubLabel: askMore ? 'کارت پرتر و بیشتر رو انتخاب کن!' : 'کارت خلوت‌تر و کمتر رو انتخاب کن!',
      options: [small, mid, big].map((v) => ({
        id: `cmp-${v}`,
        label: toFaNum(v),
        subLabel: `${FA_WORDS[v]} ${item.name}`,
        emoji: item.emoji.repeat(v),
        isCorrect: v === target,
      })),
    });
  }

  // Chapter 5 (41..50): First Visual Addition (Sums up to 6)
  const ADD_PAIRS_1: [number, number][] = [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
    [3, 1],
    [2, 3],
    [3, 2],
    [4, 1],
    [3, 3],
    [4, 2],
  ];
  ADD_PAIRS_1.forEach(([a, b], i) => {
    const num = 41 + i;
    const sum = a + b;
    const item = COUNT_ITEMS[i];
    levels.push({
      id: `math-${String(num).padStart(3, '0')}`,
      lab: 'math',
      number: num,
      chapter: 5,
      chapterTitle: 'فصل ۵: اولین جمع‌های شاد با اسباب‌بازی',
      title: `جمع شاد: ${toFaNum(a)} تا با ${toFaNum(b)} تا چند تا می‌شه؟`,
      kidPrompt: `اول ${toFaNum(a)} تا و بعد ${toFaNum(b)} تای دیگه رو بذار توی سبد تا ببینی روی هم چند تا می‌شن!`,
      scienceTip: `هورااا! وقتی ${toFaNum(a)} تا ${item.name} و ${toFaNum(b)} تا ${item.name} رو روی هم بذاریم، می‌شه ${toFaNum(sum)} تا!`,
      winVoiceClipKey: 'win_math_add',
      gameKind: 'counting_basket',
      equationDisplay: `${toFaNum(a)} ${item.emoji} + ${toFaNum(b)} ${item.emoji} = ؟`,
      heroDisplay: `${toFaNum(a)} + ${toFaNum(b)}`,
      heroSubLabel: `روی هم ${toFaNum(sum)} تا بچین!`,
      targetCount: sum,
      totalSpawnCount: sum + 2,
      countEmoji: item.emoji,
      countItemNameFa: item.name,
    });
  });

  // Chapter 6 (51..60): Addition up to 10 (Visual Choice Cards)
  const ADD_PAIRS_2: [number, number][] = [
    [5, 1],
    [4, 3],
    [5, 2],
    [4, 4],
    [6, 2],
    [5, 3],
    [6, 3],
    [5, 4],
    [7, 3],
    [5, 5],
  ];
  ADD_PAIRS_2.forEach(([a, b], i) => {
    const num = 51 + i;
    const sum = a + b;
    const item = COUNT_ITEMS[i];
    levels.push({
      id: `math-${String(num).padStart(3, '0')}`,
      lab: 'math',
      number: num,
      chapter: 6,
      chapterTitle: 'فصل ۶: قهرمان جمع اعداد تا ۱۰',
      title: `معمای جمع: ${toFaNum(a)} + ${toFaNum(b)} مساوی چند؟`,
      kidPrompt: `شکل‌های دو طرف علامت به اضافه (+) رو روی هم بشمار و جواب درست رو بزن!`,
      scienceTip: `آفرین نابغه ریاضی! ${toFaNum(a)} به اضافه ${toFaNum(b)} مساوی ${toFaNum(sum)} می‌شه!`,
      winVoiceClipKey: 'win_math_add',
      gameKind: 'choice_discovery',
      heroDisplay: `${toFaNum(a)} + ${toFaNum(b)} = ؟`,
      heroSubLabel: `${item.emoji.repeat(a)}  ➕  ${item.emoji.repeat(b)}`,
      options: [sum - 1, sum, sum + 1].map((v) => ({
        id: `add2-${v}`,
        label: toFaNum(v),
        subLabel: FA_WORDS[v] || toFaNum(v),
        emoji: item.emoji,
        isCorrect: v === sum,
      })),
    });
  });

  // Chapter 7 (61..70): Playful Subtraction (Cookies & Balloons!)
  const SUB_PAIRS: [number, number][] = [
    [2, 1],
    [3, 1],
    [3, 2],
    [4, 1],
    [4, 2],
    [5, 2],
    [5, 3],
    [6, 2],
    [7, 3],
    [8, 4],
  ];
  SUB_PAIRS.forEach(([a, b], i) => {
    const num = 61 + i;
    const rem = a - b;
    const item = COUNT_ITEMS[i];
    levels.push({
      id: `math-${String(num).padStart(3, '0')}`,
      lab: 'math',
      number: num,
      chapter: 7,
      chapterTitle: 'فصل ۷: بازی کم کردن (چند تا باقی موند؟)',
      title: `از ${toFaNum(a)} تا ${item.name}، ${toFaNum(b)} تا کم بشه چند تا می‌مونه؟`,
      kidPrompt: `اگر ${toFaNum(a)} تا داشته باشیم و ${toFaNum(b)} تاش رو هدیه بدیم، چند تا باقی می‌مونه؟`,
      scienceTip: `باریکلا! وقتی از ${toFaNum(a)} تا، ${toFaNum(b)} تا کم کنیم، دقیقاً ${toFaNum(rem)} تا باقی می‌مونه!`,
      gameKind: 'choice_discovery',
      heroDisplay: `${toFaNum(a)} − ${toFaNum(b)} = ؟`,
      heroSubLabel: `باقی‌مانده: ${item.emoji.repeat(rem)}`,
      options: [Math.max(0, rem - 1), rem, rem + 2].map((v, idx) => ({
        id: `sub-${idx}-${v}`,
        label: toFaNum(v),
        subLabel: FA_WORDS[v],
        emoji: v === 0 ? '🧺' : item.emoji.repeat(Math.min(6, v)),
        isCorrect: v === rem,
      })),
    });
  });

  // Chapter 8 (71..80): Number & Quantity Memory Match + Even/Small vs Big Sorting
  for (let i = 0; i < 10; i++) {
    const num = 71 + i;
    if (i < 6) {
      const base = i + 1;
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 8,
        chapterTitle: 'فصل ۸: کارت‌های حافظه و دسته‌بندی اعداد',
        title: `حافظه ریاضی: جفت کردن عدد با شکل‌ها (${toFaNum(base)} تا ${toFaNum(base + 2)})`,
        kidPrompt: 'کارت‌ها رو برگردون و هر عدد فارسی رو با تعداد شکل‌های برابرش جفت کن!',
        scienceTip: 'فوق‌العاده بود! هم حافظه تصویریت قوی شد و هم اعداد رو فوری تشخیص دادی!',
        gameKind: 'memory_match',
        memoryPairs: [
          { pairId: 'p1', cardA: toFaNum(base), cardB: '🍎'.repeat(base), speakFa: FA_WORDS[base] },
          { pairId: 'p2', cardA: toFaNum(base + 1), cardB: '⭐'.repeat(base + 1), speakFa: FA_WORDS[base + 1] },
          { pairId: 'p3', cardA: toFaNum(base + 2), cardB: '🚗'.repeat(base + 2), speakFa: FA_WORDS[base + 2] },
        ],
      });
    } else {
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 8,
        chapterTitle: 'فصل ۸: کارت‌های حافظه و دسته‌بندی اعداد',
        title: `دسته‌بندی اعداد کوچک (۱ تا ۴) و بزرگ (۶ تا ۱۰) — مرحله ${toFaNum(i - 5)}`,
        kidPrompt: 'اعداد کوچک‌تر از ۵ رو بذار توی سبد آبی و اعداد بزرگ‌تر از ۵ رو بذار توی سبد طلایی!',
        scienceTip: 'آفرین! مقایسه‌ی اعداد کوچک و بزرگ بهت کمک می‌کنه مفهوم اندازه‌ها رو عالی بفهمی!',
        gameKind: 'sorting_bins',
        binA: { title: 'اعداد کوچک (۱ تا ۴)', emoji: '🐣', colorHex: '#38bdf8' },
        binB: { title: 'اعداد بزرگ (۶ تا ۱۰)', emoji: '🦁', colorHex: '#f59e0b' },
        sortItems: [
          { id: 's1', nameFa: 'عدد ۲', emoji: '۲️⃣', targetBin: 'A' },
          { id: 's2', nameFa: 'عدد ۸', emoji: '۸️⃣', targetBin: 'B' },
          { id: 's3', nameFa: 'عدد ۳', emoji: '۳️⃣', targetBin: 'A' },
          { id: 's4', nameFa: 'عدد ۹', emoji: '۹️⃣', targetBin: 'B' },
        ],
      });
    }
  }

  // Chapter 9 (81..90): Teen Numbers 11..20 & Grand Math Olympiad
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    const teen = 11 + i; // 11..20
    if (i % 2 === 0) {
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: اعداد قهرمان ۱۱ تا ۲۰',
        title: `آشنایی با عدد «${toFaNum(teen)}» (${FA_WORDS[teen]})`,
        kidPrompt: `عدد «${FA_WORDS[teen]}» یعنی یک بسته ده‌تایی و ${toFaNum(teen - 10)} یکی! کارتش رو پیدا کن!`,
        scienceTip: `هورااا! عدد «${toFaNum(teen)}» (${FA_WORDS[teen]}) از ۱۰ و ${toFaNum(teen - 10)} ساخته شده است!`,
        gameKind: 'choice_discovery',
        heroDisplay: `۱۰ + ${toFaNum(teen - 10)}`,
        heroSubLabel: `می‌شود عدد «${FA_WORDS[teen]}»!`,
        options: [teen - 1, teen, Math.min(20, teen + 2)].map((v, idx) => ({
          id: `tn-${idx}-${v}`,
          label: toFaNum(v),
          subLabel: FA_WORDS[v],
          emoji: '🌟',
          isCorrect: v === teen,
        })),
      });
    } else {
      const seq = [teen - 2, teen - 1, teen, teen + 1 > 20 ? 20 : teen + 1];
      levels.push({
        id: `math-${String(num).padStart(3, '0')}`,
        lab: 'math',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: اعداد قهرمان ۱۱ تا ۲۰',
        title: `قطار سریع‌السیر اعداد بزرگ تا ${toFaNum(teen)}!`,
        kidPrompt: `واگن خالی قطار بزرگ‌ها رو با عدد «${toFaNum(teen)}» کامل کن!`,
        scienceTip: `آفرین قهرمان ریاضی! حالا تا عدد بیست (۲۰) رو کامل بلدی!`,
        gameKind: 'sequence_train',
        wagons: seq.map(toFaNum),
        missingWagonIndex: 2,
        options: [teen - 3, teen, Math.min(20, teen + 1)].map((v, idx) => ({
          id: `tntr-${idx}-${v}`,
          label: toFaNum(v),
          subLabel: FA_WORDS[v],
          isCorrect: v === teen,
        })),
      });
    }
  }

  return levels;
}

export const MATH_LEVELS: AcademyLevel[] = buildMathLevels();

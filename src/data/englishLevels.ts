import { AcademyLevel } from '../types/game';

interface EngLetterSpec {
  letter: string;
  wordEn: string;
  meaningFa: string;
  emoji: string;
  clipKey?: string;
  w1: { en: string; fa: string; emoji: string };
  w2: { en: string; fa: string; emoji: string };
}

const ENG_ALPHABET_26: EngLetterSpec[] = [
  { letter: 'A a', wordEn: 'Apple', meaningFa: 'سیب', emoji: '🍎', clipKey: 'en_apple', w1: { en: 'Car', fa: 'ماشین', emoji: '🚗' }, w2: { en: 'Sun', fa: 'خورشید', emoji: '☀️' } },
  { letter: 'B b', wordEn: 'Ball', meaningFa: 'توپ', emoji: '⚽', clipKey: 'en_ball', w1: { en: 'Fish', fa: 'ماهی', emoji: '🐟' }, w2: { en: 'Tree', fa: 'درخت', emoji: '🌳' } },
  { letter: 'C c', wordEn: 'Cat', meaningFa: 'گربه', emoji: '🐱', clipKey: 'en_cat', w1: { en: 'Moon', fa: 'ماه', emoji: '🌙' }, w2: { en: 'Bus', fa: 'اتوبوس', emoji: '🚌' } },
  { letter: 'D d', wordEn: 'Dog', meaningFa: 'سگ مهربون', emoji: '🐶', clipKey: 'en_dog', w1: { en: 'Star', fa: 'ستاره', emoji: '⭐' }, w2: { en: 'Hat', fa: 'کلاه', emoji: '🧢' } },
  { letter: 'E e', wordEn: 'Elephant', meaningFa: 'فیل', emoji: '🐘', clipKey: 'en_elephant', w1: { en: 'Apple', fa: 'سیب', emoji: '🍎' }, w2: { en: 'Book', fa: 'کتاب', emoji: '📘' } },
  { letter: 'F f', wordEn: 'Fish', meaningFa: 'ماهی', emoji: '🐟', clipKey: 'en_fish', w1: { en: 'Car', fa: 'ماشین', emoji: '🚗' }, w2: { en: 'Lion', fa: 'شیر', emoji: '🦁' } },
  { letter: 'G g', wordEn: 'Giraffe', meaningFa: 'زرافه', emoji: '🦒', w1: { en: 'Ball', fa: 'توپ', emoji: '⚽' }, w2: { en: 'Cake', fa: 'کیک', emoji: '🎂' } },
  { letter: 'H h', wordEn: 'Hat', meaningFa: 'کلاه', emoji: '🧢', w1: { en: 'Dog', fa: 'سگ', emoji: '🐶' }, w2: { en: 'Banana', fa: 'موز', emoji: '🍌' } },
  { letter: 'I i', wordEn: 'Ice cream', meaningFa: 'بستنی', emoji: '🍦', w1: { en: 'Cat', fa: 'گربه', emoji: '🐱' }, w2: { en: 'Plane', fa: 'هواپیما', emoji: '✈️' } },
  { letter: 'J j', wordEn: 'Juice', meaningFa: 'آبمیوه', emoji: '🧃', w1: { en: 'Sun', fa: 'خورشید', emoji: '☀️' }, w2: { en: 'Shoe', fa: 'کفش', emoji: '👟' } },
  { letter: 'K k', wordEn: 'Kite', meaningFa: 'بادبادک', emoji: '🪁', w1: { en: 'Fish', fa: 'ماهی', emoji: '🐟' }, w2: { en: 'Milk', fa: 'شیر', emoji: '🥛' } },
  { letter: 'L l', wordEn: 'Lion', meaningFa: 'شیر جنگل', emoji: '🦁', clipKey: 'en_lion', w1: { en: 'Apple', fa: 'سیب', emoji: '🍎' }, w2: { en: 'Boat', fa: 'قایق', emoji: '⛵' } },
  { letter: 'M m', wordEn: 'Monkey', meaningFa: 'میمون', emoji: '🐵', clipKey: 'en_monkey', w1: { en: 'Star', fa: 'ستاره', emoji: '⭐' }, w2: { en: 'Car', fa: 'ماشین', emoji: '🚗' } },
  { letter: 'N n', wordEn: 'Nest', meaningFa: 'لانه پرنده', emoji: '🪺', w1: { en: 'Ball', fa: 'توپ', emoji: '⚽' }, w2: { en: 'Cat', fa: 'گربه', emoji: '🐱' } },
  { letter: 'O o', wordEn: 'Orange', meaningFa: 'پرتقال', emoji: '🍊', w1: { en: 'Dog', fa: 'سگ', emoji: '🐶' }, w2: { en: 'Train', fa: 'قطار', emoji: '🚂' } },
  { letter: 'P p', wordEn: 'Panda', meaningFa: 'خرس پاندا', emoji: '🐼', w1: { en: 'Sun', fa: 'خورشید', emoji: '☀️' }, w2: { en: 'Key', fa: 'کلید', emoji: '🔑' } },
  { letter: 'Q q', wordEn: 'Queen', meaningFa: 'ملکه', emoji: '👑', w1: { en: 'Fish', fa: 'ماهی', emoji: '🐟' }, w2: { en: 'Bus', fa: 'اتوبوس', emoji: '🚌' } },
  { letter: 'R r', wordEn: 'Rocket', meaningFa: 'موشک فضایی', emoji: '🚀', clipKey: 'en_rocket', w1: { en: 'Apple', fa: 'سیب', emoji: '🍎' }, w2: { en: 'Hat', fa: 'کلاه', emoji: '🧢' } },
  { letter: 'S s', wordEn: 'Sun', meaningFa: 'خورشید', emoji: '☀️', clipKey: 'en_sun', w1: { en: 'Cat', fa: 'گربه', emoji: '🐱' }, w2: { en: 'Book', fa: 'کتاب', emoji: '📘' } },
  { letter: 'T t', wordEn: 'Train', meaningFa: 'قطار', emoji: '🚂', w1: { en: 'Banana', fa: 'موز', emoji: '🍌' }, w2: { en: 'Lion', fa: 'شیر', emoji: '🦁' } },
  { letter: 'U u', wordEn: 'Umbrella', meaningFa: 'چتر', emoji: '☂️', w1: { en: 'Dog', fa: 'سگ', emoji: '🐶' }, w2: { en: 'Star', fa: 'ستاره', emoji: '⭐' } },
  { letter: 'V v', wordEn: 'Van', meaningFa: 'ون مسافرتی', emoji: '🚐', w1: { en: 'Apple', fa: 'سیب', emoji: '🍎' }, w2: { en: 'Moon', fa: 'ماه', emoji: '🌙' } },
  { letter: 'W w', wordEn: 'Whale', meaningFa: 'نهنگ آبی', emoji: '🐋', w1: { en: 'Car', fa: 'ماشین', emoji: '🚗' }, w2: { en: 'Cake', fa: 'کیک', emoji: '🎂' } },
  { letter: 'X x', wordEn: 'Xylophone', meaningFa: 'بلز موسیقی', emoji: '🎹', w1: { en: 'Cat', fa: 'گربه', emoji: '🐱' }, w2: { en: 'Ball', fa: 'توپ', emoji: '⚽' } },
  { letter: 'Y y', wordEn: 'Yellow Star', meaningFa: 'ستاره زرد', emoji: '🌟', clipKey: 'en_star', w1: { en: 'Fish', fa: 'ماهی', emoji: '🐟' }, w2: { en: 'Bus', fa: 'اتوبوس', emoji: '🚌' } },
  { letter: 'Z z', wordEn: 'Zebra', meaningFa: 'گورخر', emoji: '🦓', w1: { en: 'Sun', fa: 'خورشید', emoji: '☀️' }, w2: { en: 'Apple', fa: 'سیب', emoji: '🍎' } },
];

function buildEnglishLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Levels 1..26: Complete A..Z Phonics & Vocabulary + 27..30 ABC Sequence Trains
  ENG_ALPHABET_26.forEach((it, idx) => {
    const num = idx + 1;
    const chap = idx < 10 ? 1 : idx < 20 ? 2 : 3;
    const chapTitle =
      chap === 1
        ? 'فصل ۱: حروف انگلیسی A تا J با تلفظ شاد'
        : chap === 2
        ? 'فصل ۲: حروف انگلیسی K تا T با تلفظ شاد'
        : 'فصل ۳: حروف انگلیسی U تا Z و قطار الفبا';

    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: chap,
      chapterTitle: chapTitle,
      title: `حرف «${it.letter}» — ${it.wordEn} (${it.meaningFa})`,
      kidPrompt: `روی دکمه صدا بزن و تصویر «${it.wordEn}» (${it.meaningFa}) که با حرف ${it.letter.split(' ')[0]} شروع می‌شه رو پیدا کن!`,
      scienceTip: `آفرین قهرمان دو زبانه! به انگلیسی به ${it.meaningFa} می‌گن «${it.wordEn}»!`,
      englishVoiceClipKey: it.clipKey,
      gameKind: 'choice_discovery',
      heroDisplay: it.letter,
      heroSubLabel: `${it.wordEn} = ${it.meaningFa}`,
      heroEmoji: it.emoji,
      options: [
        {
          id: 'ok',
          label: it.wordEn,
          subLabel: it.meaningFa,
          emoji: it.emoji,
          isCorrect: true,
          voiceClipKey: it.clipKey,
        },
        {
          id: 'w1',
          label: it.w1.en,
          subLabel: it.w1.fa,
          emoji: it.w1.emoji,
          isCorrect: false,
        },
        {
          id: 'w2',
          label: it.w2.en,
          subLabel: it.w2.fa,
          emoji: it.w2.emoji,
          isCorrect: false,
        },
      ].sort((a, b) => ((idx + a.id.charCodeAt(0)) % 3) - ((idx + b.id.charCodeAt(0)) % 3)),
    });
  });

  // Levels 27..30: ABC Sequence Trains
  const ABC_TRAINS = [
    { seq: ['A', 'B', 'C', 'D'], miss: 2, ans: 'C', x1: 'M', x2: 'Z' },
    { seq: ['E', 'F', 'G', 'H'], miss: 1, ans: 'F', x1: 'A', x2: 'P' },
    { seq: ['L', 'M', 'N', 'O'], miss: 2, ans: 'N', x1: 'B', x2: 'W' },
    { seq: ['W', 'X', 'Y', 'Z'], miss: 3, ans: 'Z', x1: 'C', x2: 'K' },
  ];
  ABC_TRAINS.forEach((tr, i) => {
    const num = 27 + i;
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 3,
      chapterTitle: 'فصل ۳: حروف انگلیسی U تا Z و قطار الفبا',
      title: `قطار ABC انگلیسی: واگن حرف «${tr.ans}»`,
      kidPrompt: 'ببین کدوم حرف انگلیسی جای خالی قطار ABC رو پر می‌کنه!',
      scienceTip: `عالی بود! ترتیب این حروف انگلیسی «${tr.seq.join(' - ')}» است!`,
      gameKind: 'sequence_train',
      wagons: tr.seq,
      missingWagonIndex: tr.miss,
      options: [
        { id: 'o1', label: tr.ans, isCorrect: true },
        { id: 'o2', label: tr.x1, isCorrect: false },
        { id: 'o3', label: tr.x2, isCorrect: false },
      ],
    });
  });

  // Chapter 4 (31..40): English Numbers 1..10 (One to Ten!)
  const EN_NUMS = [
    { n: 1, en: 'One', fa: 'یک', emoji: '🍎' },
    { n: 2, en: 'Two', fa: 'دو', emoji: '🚗' },
    { n: 3, en: 'Three', fa: 'سه', emoji: '⭐' },
    { n: 4, en: 'Four', fa: 'چهار', emoji: '🎈' },
    { n: 5, en: 'Five', fa: 'پنج', emoji: '🍓' },
    { n: 6, en: 'Six', fa: 'شش', emoji: '🐥' },
    { n: 7, en: 'Seven', fa: 'هفت', emoji: '🦋' },
    { n: 8, en: 'Eight', fa: 'هشت', emoji: '🍪' },
    { n: 9, en: 'Nine', fa: 'نُه', emoji: '⚽' },
    { n: 10, en: 'Ten', fa: 'دَه', emoji: '🚀' },
  ];
  EN_NUMS.forEach((item, i) => {
    const num = 31 + i;
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 4,
      chapterTitle: 'فصل ۴: شمارش اعداد انگلیسی (One تا Ten)',
      title: `عدد انگلیسی «${item.n} — ${item.en}» (${item.fa})`,
      kidPrompt: `بیا به انگلیسی بشماریم! ${item.n} یعنی «${item.en}»! تعداد درست رو بچین توی سبد!`,
      scienceTip: `هورااا! عدد ${item.fa} به انگلیسی می‌شه «${item.en}»!`,
      englishVoiceClipKey: 'en_numbers',
      gameKind: 'counting_basket',
      heroDisplay: `${item.n} = ${item.en}`,
      heroSubLabel: `معنی فارسی: ${item.fa}`,
      targetCount: item.n,
      totalSpawnCount: item.n + 2,
      countEmoji: item.emoji,
      countItemNameFa: `${item.en} (${item.fa})`,
    });
  });

  // Chapter 5 (41..50): English Colors
  const EN_COLORS = [
    { en: 'Red', fa: 'قرمز', emoji: '🍓', hex: '#ef4444' },
    { en: 'Blue', fa: 'آبی', emoji: '🐳', hex: '#3b82f6' },
    { en: 'Yellow', fa: 'زرد', emoji: '🍋', hex: '#eab308' },
    { en: 'Green', fa: 'سبز', emoji: '🐸', hex: '#22c55e' },
    { en: 'Orange', fa: 'نارنجی', emoji: '🍊', hex: '#f97316' },
    { en: 'Purple', fa: 'بنفش', emoji: '🍇', hex: '#a855f7' },
    { en: 'Pink', fa: 'صورتی', emoji: '🦩', hex: '#ec4899' },
    { en: 'White', fa: 'سفید', emoji: '⛄', hex: '#f8fafc' },
    { en: 'Brown', fa: 'قهوه‌ای', emoji: '🧸', hex: '#92400e' },
    { en: 'Rainbow', fa: 'رنگین‌کمان', emoji: '🌈', hex: '#38bdf8' },
  ];
  EN_COLORS.forEach((col, i) => {
    const num = 41 + i;
    const wA = EN_COLORS[(i + 2) % EN_COLORS.length];
    const wB = EN_COLORS[(i + 5) % EN_COLORS.length];
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 5,
      chapterTitle: 'فصل ۵: رنگ‌های شاد انگلیسی (Colors)',
      title: `رنگ انگلیسی «${col.en}» (${col.fa})`,
      kidPrompt: `عزیزم، کدوم کارت به رنگ «${col.en}» یعنی «${col.fa}» است؟`,
      scienceTip: `آفرین! رنگ «${col.fa}» به انگلیسی می‌شه «${col.en}»!`,
      englishVoiceClipKey: 'en_colors',
      gameKind: 'choice_discovery',
      heroDisplay: col.en,
      heroSubLabel: `رنگ ${col.fa}`,
      heroEmoji: col.emoji,
      heroColorHex: col.hex,
      options: [
        { id: 'c', label: col.en, subLabel: col.fa, emoji: col.emoji, colorHex: col.hex, isCorrect: true },
        { id: 'x1', label: wA.en, subLabel: wA.fa, emoji: wA.emoji, colorHex: wA.hex, isCorrect: false },
        { id: 'x2', label: wB.en, subLabel: wB.fa, emoji: wB.emoji, colorHex: wB.hex, isCorrect: false },
      ],
    });
  });

  // Chapter 6 (51..60): Animals & Fruits in English
  const EN_VOCAB_6 = [
    { en: 'Banana', fa: 'موز', emoji: '🍌', x1: ['🐶', 'Dog'], x2: ['🚗', 'Car'] },
    { en: 'Strawberry', fa: 'توت‌فرنگی', emoji: '🍓', x1: ['🐱', 'Cat'], x2: ['🚌', 'Bus'] },
    { en: 'Watermelon', fa: 'هندوانه', emoji: '🍉', x1: ['🦁', 'Lion'], x2: ['🎩', 'Hat'] },
    { en: 'Rabbit', fa: 'خرگوش', emoji: '🐰', x1: ['🍎', 'Apple'], x2: ['☀️', 'Sun'] },
    { en: 'Bird', fa: 'پرنده', emoji: '🐦', x1: ['🍌', 'Banana'], x2: ['⚽', 'Ball'] },
    { en: 'Butterfly', fa: 'پروانه', emoji: '🦋', x1: ['🍞', 'Bread'], x2: ['🚂', 'Train'] },
    { en: 'Bear', fa: 'خرس مهربون', emoji: '🐻', x1: ['🍇', 'Grapes'], x2: ['✈️', 'Plane'] },
    { en: 'Duck', fa: 'اردک', emoji: '🦆', x1: ['🍊', 'Orange'], x2: ['📘', 'Book'] },
    { en: 'Horse', fa: 'اسب', emoji: '🐴', x1: ['🍦', 'Ice cream'], x2: ['☂️', 'Umbrella'] },
    { en: 'Bee', fa: 'زنبور عسل', emoji: '🐝', x1: ['🚗', 'Car'], x2: ['🌙', 'Moon'] },
  ];
  EN_VOCAB_6.forEach((v, i) => {
    const num = 51 + i;
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 6,
      chapterTitle: 'فصل ۶: حیوانات و میوه‌های انگلیسی',
      title: `کلمه انگلیسی «${v.en}» (${v.fa})`,
      kidPrompt: `قهرمان من، تصویر «${v.en}» یعنی «${v.fa}» رو پیدا کن!`,
      scienceTip: `باریکلا! «${v.en}» به فارسی یعنی «${v.fa}»!`,
      gameKind: 'choice_discovery',
      heroDisplay: v.en,
      heroSubLabel: v.fa,
      heroEmoji: v.emoji,
      options: [
        { id: 'ok', label: v.en, subLabel: v.fa, emoji: v.emoji, isCorrect: true },
        { id: 'w1', label: v.x1[1], emoji: v.x1[0], isCorrect: false },
        { id: 'w2', label: v.x2[1], emoji: v.x2[0], isCorrect: false },
      ],
    });
  });

  // Chapter 7 (61..70): Family, Body Parts & Vehicles in English
  const EN_VOCAB_7 = [
    { en: 'Father / Dad', fa: 'پدر / بابا', emoji: '👨‍👦', clip: 'en_family', x1: ['🚗', 'Car'], x2: ['🍎', 'Apple'] },
    { en: 'Mother / Mom', fa: 'مادر / مامان', emoji: '👩‍👦', clip: 'en_family', x1: ['🚌', 'Bus'], x2: ['⚽', 'Ball'] },
    { en: 'Happy Family', fa: 'خانواده شاد', emoji: '👨‍👩‍👦', clip: 'en_family', x1: ['🐟', 'Fish'], x2: ['🌳', 'Tree'] },
    { en: 'Eyes', fa: 'چشم‌ها', emoji: '👀', x1: ['👟', 'Shoes'], x2: ['🍌', 'Banana'] },
    { en: 'Hands', fa: 'دست‌ها', emoji: '👐', x1: ['🧢', 'Hat'], x2: ['🐱', 'Cat'] },
    { en: 'Car', fa: 'ماشین', emoji: '🚗', clip: 'en_car', x1: ['🍎', 'Apple'], x2: ['🐶', 'Dog'] },
    { en: 'Bus', fa: 'اتوبوس', emoji: '🚌', x1: ['🦁', 'Lion'], x2: ['🍦', 'Ice cream'] },
    { en: 'Airplane', fa: 'هواپیما', emoji: '✈️', x1: ['🍓', 'Strawberry'], x2: ['🐸', 'Frog'] },
    { en: 'Boat / Ship', fa: 'کشتی و قایق', emoji: '🚢', x1: ['🐵', 'Monkey'], x2: ['☀️', 'Sun'] },
    { en: 'Bicycle', fa: 'دوچرخه', emoji: '🚲', x1: ['🐘', 'Elephant'], x2: ['🌙', 'Moon'] },
  ];
  EN_VOCAB_7.forEach((v, i) => {
    const num = 61 + i;
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 7,
      chapterTitle: 'فصل ۷: خانواده، بدن و ماشین‌ها به انگلیسی',
      title: `واژه انگلیسی «${v.en}» (${v.fa})`,
      kidPrompt: `روی کارتی که تصویر «${v.en}» (${v.fa}) رو نشون می‌ده کلیک کن!`,
      scienceTip: `آفرین عزیز دلم! «${v.en}» یعنی «${v.fa}»!`,
      englishVoiceClipKey: v.clip,
      gameKind: 'choice_discovery',
      heroDisplay: v.en,
      heroSubLabel: v.fa,
      heroEmoji: v.emoji,
      options: [
        { id: 'ok', label: v.en, subLabel: v.fa, emoji: v.emoji, isCorrect: true },
        { id: 'w1', label: v.x1[1], emoji: v.x1[0], isCorrect: false },
        { id: 'w2', label: v.x2[1], emoji: v.x2[0], isCorrect: false },
      ],
    });
  });

  // Chapter 8 (71..80): Left-to-Right English Word Builder (CAT, DOG, SUN, CAR, STAR...)
  const EN_BUILD_WORDS = [
    { word: 'CAT', fa: 'گربه', emoji: '🐱', letters: ['C', 'A', 'T'], extra: ['B', 'O'], clip: 'en_cat' },
    { word: 'DOG', fa: 'سگ', emoji: '🐶', letters: ['D', 'O', 'G'], extra: ['A', 'P'], clip: 'en_dog' },
    { word: 'SUN', fa: 'خورشید', emoji: '☀️', letters: ['S', 'U', 'N'], extra: ['E', 'M'], clip: 'en_sun' },
    { word: 'CAR', fa: 'ماشین', emoji: '🚗', letters: ['C', 'A', 'R'], extra: ['T', 'L'], clip: 'en_car' },
    { word: 'BUS', fa: 'اتوبوس', emoji: '🚌', letters: ['B', 'U', 'S'], extra: ['D', 'A'] },
    { word: 'HAT', fa: 'کلاه', emoji: '🧢', letters: ['H', 'A', 'T'], extra: ['M', 'O'] },
    { word: 'BEE', fa: 'زنبور', emoji: '🐝', letters: ['B', 'E', 'E'], extra: ['K', 'U'] },
    { word: 'RED', fa: 'قرمز', emoji: '🔴', letters: ['R', 'E', 'D'], extra: ['B', 'S'], clip: 'en_colors' },
    { word: 'ONE', fa: 'عدد یک', emoji: '1️⃣', letters: ['O', 'N', 'E'], extra: ['T', 'A'], clip: 'en_numbers' },
    { word: 'STAR', fa: 'ستاره', emoji: '⭐', letters: ['S', 'T', 'A', 'R'], extra: ['P'], clip: 'en_star' },
  ];
  EN_BUILD_WORDS.forEach((w, i) => {
    const num = 71 + i;
    levels.push({
      id: `eng-${String(num).padStart(3, '0')}`,
      lab: 'english',
      number: num,
      chapter: 8,
      chapterTitle: 'فصل ۸: ساختن کلمات انگلیسی با بلوک حروف',
      title: `ساختن کلمه انگلیسی «${w.word}» (${w.fa})`,
      kidPrompt: `از چپ به راست روی حروف کلمه انگلیسی «${w.word}» (${w.fa}) کلیک کن!`,
      scienceTip: `فوق‌العاده بود! خودت کلمه انگلیسی «${w.word}» به معنی «${w.fa}» رو نوشتی!`,
      englishVoiceClipKey: w.clip,
      gameKind: 'word_builder',
      heroDisplay: w.word,
      heroEmoji: w.emoji,
      heroSubLabel: `${w.word} = ${w.fa}`,
      targetLetters: w.letters,
      extraLetters: w.extra,
      rtlWord: false,
    });
  });

  // Chapter 9 (81..90): Polite English Greetings + Bilingual Memory Match
  const GREETINGS = [
    { en: 'Hello!', fa: 'سلام!', emoji: '👋', x1: '😴', x2: '🌧️' },
    { en: 'Good Morning!', fa: 'صبح بخیر!', emoji: '🌅', x1: '🌙', x2: '❄️' },
    { en: 'Good Night!', fa: 'شب بخیر!', emoji: '🌙', x1: '☀️', x2: '⚽' },
    { en: 'Thank You!', fa: 'متشکرم!', emoji: '🎁', x1: '🪨', x2: '🌵' },
    { en: 'Goodbye!', fa: 'خداحافظ!', emoji: '🙋‍♂️', x1: '🍎', x2: '🐟' },
  ];
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    if (i < 5) {
      const g = GREETINGS[i];
      levels.push({
        id: `eng-${String(num).padStart(3, '0')}`,
        lab: 'english',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: مکالمه مودبانه و حافظه دو زبانه',
        title: `جمله مودبانه «${g.en}» (${g.fa})`,
        kidPrompt: `عزیزم، کدوم تصویر معنی «${g.en}» یعنی «${g.fa}» رو نشون می‌ده؟`,
        scienceTip: `آفرین قهرمان باادب! به انگلیسی وقتی می‌خوایم بگیم «${g.fa}»، می‌گیم «${g.en}»!`,
        englishVoiceClipKey: 'en_hello',
        gameKind: 'choice_discovery',
        heroDisplay: g.en,
        heroSubLabel: g.fa,
        heroEmoji: g.emoji,
        options: [
          { id: 'g1', label: g.en, subLabel: g.fa, emoji: g.emoji, isCorrect: true },
          { id: 'g2', label: 'Other', emoji: g.x1, isCorrect: false },
          { id: 'g3', label: 'Other', emoji: g.x2, isCorrect: false },
        ],
      });
    } else {
      const base = (i - 5) * 3;
      const a = ENG_ALPHABET_26[base];
      const b = ENG_ALPHABET_26[base + 1];
      const c = ENG_ALPHABET_26[base + 2];
      levels.push({
        id: `eng-${String(num).padStart(3, '0')}`,
        lab: 'english',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: مکالمه مودبانه و حافظه دو زبانه',
        title: `کارت‌های حافظه انگلیسی (${a.wordEn}, ${b.wordEn}, ${c.wordEn})`,
        kidPrompt: 'کارت‌ها رو برگردون و هر کلمه انگلیسی رو با تصویرش جفت کن!',
        scienceTip: 'هورااا قهرمان دو زبانه! ۹۰ مرحله آموزش انگلیسی رو مثل یک ستاره گذروندی!',
        englishVoiceClipKey: 'en_win_cheer',
        gameKind: 'memory_match',
        memoryPairs: [
          { pairId: 'e1', cardA: a.wordEn, cardB: `${a.emoji} ${a.meaningFa}`, speakFa: `${a.wordEn} یعنی ${a.meaningFa}` },
          { pairId: 'e2', cardA: b.wordEn, cardB: `${b.emoji} ${b.meaningFa}`, speakFa: `${b.wordEn} یعنی ${b.meaningFa}` },
          { pairId: 'e3', cardA: c.wordEn, cardB: `${c.emoji} ${c.meaningFa}`, speakFa: `${c.wordEn} یعنی ${c.meaningFa}` },
        ],
      });
    }
  }

  return levels;
}

export const ENGLISH_LEVELS: AcademyLevel[] = buildEnglishLevels();

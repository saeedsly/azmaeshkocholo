import { AcademyLevel } from '../types/game';

interface LetterEntry {
  letter: string;
  name: string;
  word: string;
  emoji: string;
  wrongA: { word: string; emoji: string };
  wrongB: { word: string; emoji: string };
}

// Complete 32-letter Persian Alphabet with child-friendly illustrated words!
const PERSIAN_ALPHABET_32: LetterEntry[] = [
  { letter: 'آ / ا', name: 'الف', word: 'آناناس و انار', emoji: '🍍', wrongA: { word: 'توپ', emoji: '⚽' }, wrongB: { word: 'ماشین', emoji: '🚗' } },
  { letter: 'ب', name: 'ب', word: 'بستنی', emoji: '🍦', wrongA: { word: 'سیب', emoji: '🍎' }, wrongB: { word: 'خورشید', emoji: '☀️' } },
  { letter: 'پ', name: 'پ', word: 'پروانه', emoji: '🦋', wrongA: { word: 'موز', emoji: '🍌' }, wrongB: { word: 'کیف', emoji: '🎒' } },
  { letter: 'ت', name: 'ت', word: 'توت‌فرنگی', emoji: '🍓', wrongA: { word: 'فیل', emoji: '🐘' }, wrongB: { word: 'چتر', emoji: '☂️' } },
  { letter: 'ث', name: 'ث', word: 'ثانیه (ساعت)', emoji: '⏱️', wrongA: { word: 'ماهی', emoji: '🐟' }, wrongB: { word: 'گل', emoji: '🌸' } },
  { letter: 'ج', name: 'ج', word: 'جوجه', emoji: '🐥', wrongA: { word: 'کفش', emoji: '👟' }, wrongB: { word: 'بادکنک', emoji: '🎈' } },
  { letter: 'چ', name: 'چ', word: 'چتر رنگی', emoji: '☂️', wrongA: { word: 'سیب', emoji: '🍎' }, wrongB: { word: 'ستاره', emoji: '⭐' } },
  { letter: 'ح', name: 'ح', word: 'حلزون', emoji: '🐌', wrongA: { word: 'هواپیما', emoji: '✈️' }, wrongB: { word: 'توپ', emoji: '⚽' } },
  { letter: 'خ', name: 'خ', word: 'خورشید', emoji: '☀️', wrongA: { word: 'پرتقال', emoji: '🍊' }, wrongB: { word: 'گربه', emoji: '🐱' } },
  { letter: 'د', name: 'د', word: 'درخت سبز', emoji: '🌳', wrongA: { word: 'ماشین', emoji: '🚗' }, wrongB: { word: 'بستنی', emoji: '🍦' } },
  { letter: 'ذ', name: 'ذ', word: 'ذرت خوشمزه', emoji: '🌽', wrongA: { word: 'شیر', emoji: '🦁' }, wrongB: { word: 'قاشق', emoji: '🥄' } },
  { letter: 'ر', name: 'ر', word: 'رنگین‌کمان', emoji: '🌈', wrongA: { word: 'کتاب', emoji: '📘' }, wrongB: { word: 'موشک', emoji: '🚀' } },
  { letter: 'ز', name: 'ز', word: 'زنبور عسل', emoji: '🐝', wrongA: { word: 'هویج', emoji: '🥕' }, wrongB: { word: 'کلاه', emoji: '🧢' } },
  { letter: 'ژ', name: 'ژ', word: 'ژله شیرین', emoji: '🍮', wrongA: { word: 'توپ', emoji: '⚽' }, wrongB: { word: 'درخت', emoji: '🌳' } },
  { letter: 'س', name: 'س', word: 'ستاره و سیب', emoji: '⭐', wrongA: { word: 'چتر', emoji: '☂️' }, wrongB: { word: 'فیل', emoji: '🐘' } },
  { letter: 'ش', name: 'ش', word: 'شیر قوی', emoji: '🦁', wrongA: { word: 'موز', emoji: '🍌' }, wrongB: { word: 'گل', emoji: '🌷' } },
  { letter: 'ص', name: 'ص', word: 'صابون حبابی', emoji: '🧼', wrongA: { word: 'خرگوش', emoji: '🐰' }, wrongB: { word: 'ماشین', emoji: '🚗' } },
  { letter: 'ض', name: 'ض', word: 'ضربان قلب', emoji: '💓', wrongA: { word: 'سیب', emoji: '🍎' }, wrongB: { word: 'کفش', emoji: '👟' } },
  { letter: 'ط', name: 'ط', word: 'طوطی سخنگو', emoji: '🦜', wrongA: { word: 'نان', emoji: '🍞' }, wrongB: { word: 'ستاره', emoji: '⭐' } },
  { letter: 'ظ', name: 'ظ', word: 'ظرف غذا', emoji: '🍲', wrongA: { word: 'بادکنک', emoji: '🎈' }, wrongB: { word: 'ملخ', emoji: '🦗' } },
  { letter: 'ع', name: 'ع', word: 'عینک و عسل', emoji: '👓', wrongA: { word: 'توپ', emoji: '⚽' }, wrongB: { word: 'پروانه', emoji: '🦋' } },
  { letter: 'غ', name: 'غ', word: 'غورباقه و غاز', emoji: '🐸', wrongA: { word: 'سیب', emoji: '🍎' }, wrongB: { word: 'ماشین', emoji: '🚗' } },
  { letter: 'ف', name: 'ف', word: 'فیل مهربون', emoji: '🐘', wrongA: { word: 'خورشید', emoji: '☀️' }, wrongB: { word: 'انار', emoji: '🍎' } },
  { letter: 'ق', name: 'ق', word: 'قایق بادبانی', emoji: '⛵', wrongA: { word: 'موز', emoji: '🍌' }, wrongB: { word: 'جوجه', emoji: '🐥' } },
  { letter: 'ک', name: 'ک', word: 'کتاب داستان', emoji: '📘', wrongA: { word: 'شیر', emoji: '🦁' }, wrongB: { word: 'چتر', emoji: '☂️' } },
  { letter: 'گ', name: 'گ', word: 'گل خوشبو', emoji: '🌸', wrongA: { word: 'ذرت', emoji: '🌽' }, wrongB: { word: 'هواپیما', emoji: '✈️' } },
  { letter: 'ل', name: 'ل', word: 'لیمو ترش', emoji: '🍋', wrongA: { word: 'فیل', emoji: '🐘' }, wrongB: { word: 'توپ', emoji: '⚽' } },
  { letter: 'م', name: 'م', word: 'موشک و ماه', emoji: '🚀', wrongA: { word: 'سیب', emoji: '🍎' }, wrongB: { word: 'کفش', emoji: '👟' } },
  { letter: 'ن', name: 'ن', word: 'نان تازه', emoji: '🍞', wrongA: { word: 'پروانه', emoji: '🦋' }, wrongB: { word: 'گربه', emoji: '🐱' } },
  { letter: 'و', name: 'و', word: 'ورزش و وزنه', emoji: '🏋️', wrongA: { word: 'بستنی', emoji: '🍦' }, wrongB: { word: 'درخت', emoji: '🌳' } },
  { letter: 'هـ', name: 'ه', word: 'هواپیما و هندوانه', emoji: '✈️', wrongA: { word: 'توپ', emoji: '⚽' }, wrongB: { word: 'زنبور', emoji: '🐝' } },
  { letter: 'ی', name: 'ی', word: 'یخ خنک', emoji: '🧊', wrongA: { word: 'خورشید', emoji: '☀️' }, wrongB: { word: 'شیر', emoji: '🦁' } },
];

function buildPersianLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Chapters 1..4 (Levels 1..32): All 32 Persian Letters + Levels 33..40 Alphabet Sequence Trains!
  PERSIAN_ALPHABET_32.forEach((entry, idx) => {
    const num = idx + 1;
    const chap = Math.min(4, Math.floor(idx / 8) + 1);
    const chapNames: Record<number, string> = {
      1: 'فصل ۱: حروف الف تا ح (آ، ب، پ، ت، ث، ج، چ، ح)',
      2: 'فصل ۲: حروف خ تا ش (خ، د، ذ، ر، ز، ژ، س، ش)',
      3: 'فصل ۳: حروف ص تا ق (ص، ض، ط، ظ، ع، غ، ف، ق)',
      4: 'فصل ۴: حروف ک تا ی (ک، گ، ل، م، ن، و، هـ، ی)',
    };
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: chap,
      chapterTitle: chapNames[chap],
      title: `حرف «${entry.letter}» مثل ${entry.word}!`,
      kidPrompt: `گل قشنگم! کدوم یکی از این تصویرها با حرف «${entry.letter}» شروع می‌شه؟`,
      scienceTip: `آفرین باسواد من! کلمه «${entry.word}» با صدای قشنگ «${entry.letter}» شروع می‌شه!`,
      gameKind: 'choice_discovery',
      heroDisplay: entry.letter,
      heroSubLabel: `حرف ${entry.name}`,
      heroEmoji: entry.emoji,
      options: [
        {
          id: 'ok',
          label: entry.word,
          subLabel: `اولش «${entry.letter}» داره!`,
          emoji: entry.emoji,
          isCorrect: true,
          voiceTextFa: `آفرین! ${entry.word}!`,
        },
        {
          id: 'w1',
          label: entry.wrongA.word,
          emoji: entry.wrongA.emoji,
          isCorrect: false,
        },
        {
          id: 'w2',
          label: entry.wrongB.word,
          emoji: entry.wrongB.emoji,
          isCorrect: false,
        },
      ].sort((a, b) => ((idx + a.id.charCodeAt(0)) % 3) - ((idx + b.id.charCodeAt(0)) % 3)),
    });
  });

  // Levels 33..40 (End of Ch 4) -> Chapter 5 (41..50): Alphabet Sequence Trains!
  // Let's make 33..40 part of Chapter 4 review & 41..50 Chapter 5 Alphabet Trains!
  const EXTRA_WORDS_33_40 = [
    { l: 'ب', word: 'بادکنک', emoji: '🎈', w1: '🍎 سیب', w2: '☀️ خورشید' },
    { l: 'پ', word: 'پیتزا', emoji: '🍕', w1: '🚗 ماشین', w2: '🐟 ماهی' },
    { l: 'ت', word: 'توپ', emoji: '⚽', w1: '🍌 موز', w2: '🌳 درخت' },
    { l: 'س', word: 'سیب قرمز', emoji: '🍎', w1: '🐘 فیل', w2: '☂️ چتر' },
    { l: 'ش', word: 'شکلات', emoji: '🍫', w1: '✈️ هواپیما', w2: '👟 کفش' },
    { l: 'م', word: 'ماشین', emoji: '🚗', w1: '🍓 توت', w2: '🐝 زنبور' },
    { l: 'گ', word: 'گربه ملوس', emoji: '🐱', w1: '🍞 نان', w2: '⛵ قایق' },
    { l: 'هـ', word: 'هندوانه', emoji: '🍉', w1: '📘 کتاب', w2: '🦁 شیر' },
  ];
  EXTRA_WORDS_33_40.forEach((it, i) => {
    const num = 33 + i;
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: 4,
      chapterTitle: 'فصل ۴: مرور طلایی صدای اول کلمه‌ها',
      title: `پیدا کردن کلمه هم‌آوا با حرف «${it.l}»`,
      kidPrompt: `عزیزم، ببین کدوم تصویر اولش صدای «${it.l}» داره!`,
      scienceTip: `هورااا! «${it.word}» با حرف «${it.l}» شروع می‌شه!`,
      gameKind: 'choice_discovery',
      heroDisplay: it.l,
      heroSubLabel: 'صدای اول کلمه',
      options: [
        { id: 'c', label: it.word, emoji: it.emoji, isCorrect: true, voiceTextFa: it.word },
        { id: 'x1', label: it.w1.split(' ')[1], emoji: it.w1.split(' ')[0], isCorrect: false },
        { id: 'x2', label: it.w2.split(' ')[1], emoji: it.w2.split(' ')[0], isCorrect: false },
      ],
    });
  });

  // Chapter 5 (41..50): Persian Alphabet Sequence Train
  const ALPHA_SEQ = [
    ['آ', 'ب', 'پ', 'ت'],
    ['ت', 'ث', 'ج', 'چ'],
    ['ح', 'خ', 'د', 'ذ'],
    ['ر', 'ز', 'ژ', 'س'],
    ['س', 'ش', 'ص', 'ض'],
    ['ط', 'ظ', 'ع', 'غ'],
    ['ف', 'ق', 'ک', 'گ'],
    ['گ', 'ل', 'م', 'ن'],
    ['م', 'ن', 'و', 'هـ'],
    ['ن', 'و', 'هـ', 'ی'],
  ];
  ALPHA_SEQ.forEach((seq, i) => {
    const num = 41 + i;
    const miss = (i % 2) + 1;
    const ans = seq[miss];
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: 5,
      chapterTitle: 'فصل ۵: قطار شاد ترتیب الفبای فارسی',
      title: `قطار الفبا: جای خالی بین «${seq[0]}» تا «${seq[3]}»`,
      kidPrompt: 'ببین کدوم حرف الفبا باید سوار واگن خالی قطار بشه!',
      scienceTip: `باریکلا! ترتیب درست این واگن‌ها «${seq.join(' ، ')}» است!`,
      gameKind: 'sequence_train',
      wagons: seq,
      missingWagonIndex: miss,
      options: [
        { id: 'a1', label: ans, subLabel: 'حرف درست', isCorrect: true },
        { id: 'a2', label: i < 5 ? 'م' : 'ب', subLabel: 'حرف دیگر', isCorrect: false },
        { id: 'a3', label: i < 5 ? 'ی' : 'چ', subLabel: 'حرف دیگر', isCorrect: false },
      ],
    });
  });

  // Chapter 6 (51..60): 2 & 3-Letter Persian Word Builder (RTL!)
  const SHORT_WORDS = [
    { word: 'آب', letters: ['آ', 'ب'], extra: ['پ', 'م'], emoji: '💧', tip: '«آ» و «ب» کنار هم می‌شن «آب» گوارا!' },
    { word: 'نان', letters: ['ن', 'ا', 'ن'], extra: ['ب', 'س'], emoji: '🍞', tip: 'آفرین! ن + ا + ن می‌شه «نان» گرم و تازه!' },
    { word: 'سیب', letters: ['س', 'ی', 'ب'], extra: ['ش', 'د'], emoji: '🍎', tip: 'عالی ساختی! س + ی + ب می‌شه «سیب» خوشمزه!' },
    { word: 'توپ', letters: ['ت', 'و', 'پ'], extra: ['ک', 'ز'], emoji: '⚽', tip: 'هورااا! ت + و + پ می‌شه «توپ» بازی!' },
    { word: 'ماه', letters: ['م', 'ا', 'ه'], extra: ['ر', 'ت'], emoji: '🌙', tip: 'باریکلا! م + ا + ه می‌شه «ماه» قشنگ آسمون!' },
    { word: 'گل', letters: ['گ', 'ل'], extra: ['ف', 'ن'], emoji: '🌸', tip: 'آفرین! گ + ل می‌شه «گل» خوشبو!' },
    { word: 'شیر', letters: ['ش', 'ی', 'ر'], extra: ['پ', 'م'], emoji: '🦁', tip: 'قهرمان من! ش + ی + ر می‌شه «شیر» جنگل!' },
    { word: 'موش', letters: ['م', 'و', 'ش'], extra: ['ب', 'ل'], emoji: '🐭', tip: 'عالی بود! م + و + ش می‌شه «موش» کوچولو!' },
    { word: 'دست', letters: ['د', 'س', 'ت'], extra: ['گ', 'ن'], emoji: '✋', tip: 'هورااا! د + س + ت می‌شه «دست» پرتوان تو!' },
    { word: 'چشم', letters: ['چ', 'ش', 'م'], extra: ['ا', 'ب'], emoji: '👀', tip: 'آفرین! چ + ش + م می‌شه «چشم» بینای تو!' },
  ];
  SHORT_WORDS.forEach((w, i) => {
    const num = 51 + i;
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: 6,
      chapterTitle: 'فصل ۶: کارگاه کلمه‌سازی فارسی (کلمات ۲ و ۳ حرفی)',
      title: `ساختن کلمه «${w.word}» با بلوک‌های حروف!`,
      kidPrompt: `به ترتیب از راست به چپ روی حروف کلمه «${w.word}» بزن تا ساخته بشه!`,
      scienceTip: w.tip,
      winVoiceClipKey: 'win_persian_word',
      gameKind: 'word_builder',
      heroDisplay: w.word,
      heroEmoji: w.emoji,
      heroSubLabel: `کلمه «${w.word}» رو بساز!`,
      targetLetters: w.letters,
      extraLetters: w.extra,
      rtlWord: true,
    });
  });

  // Chapter 7 (61..70): 4 & 5-Letter Beloved Persian Words (Baba, Maman, Setareh...)
  const FAMILY_WORDS = [
    { word: 'بابا', letters: ['ب', 'ا', 'ب', 'ا'], extra: ['ن', 'س'], emoji: '👨‍👦', tip: 'هورااا! «بابا» یعنی مهربون‌ترین قهرمان دنیا!' },
    { word: 'مادر', letters: ['م', 'ا', 'د', 'ر'], extra: ['پ', 'ز'], emoji: '👩‍👦', tip: 'آفرین عسلم! «مادر» یعنی فرشته‌ی مهربون خونه!' },
    { word: 'درخت', letters: ['د', 'ر', 'خ', 'ت'], extra: ['س', 'م'], emoji: '🌳', tip: 'باریکلا! کلمه «درخت» چهار حرفی رو کامل ساختی!' },
    { word: 'باران', letters: ['ب', 'ا', 'ر', 'ا', 'ن'], extra: ['ک'], emoji: '🌧️', tip: 'فوق‌العاده‌ای! «باران» لطیف آسمون رو نوشتی!' },
    { word: 'کتاب', letters: ['ک', 'ت', 'ا', 'ب'], extra: ['ش', 'و'], emoji: '📘', tip: 'آفرین دانشمند باسواد! کلمه «کتاب» رو ساختی!' },
    { word: 'ماهی', letters: ['م', 'ا', 'ه', 'ی'], extra: ['د', 'پ'], emoji: '🐟', tip: 'هورااا! «ماهی» قشنگ دریا ساخته شد!' },
    { word: 'خانه', letters: ['خ', 'ا', 'ن', 'ه'], extra: ['ط', 'ب'], emoji: '🏠', tip: 'باریکلا! کلمه گرم و قشنگ «خانه» رو ساختی!' },
    { word: 'ستاره', letters: ['س', 'ت', 'ا', 'ر', 'ه'], extra: ['گ'], emoji: '⭐', tip: 'آفرین ستاره‌ی درخشان بابا! کلمه ۵ حرفی «ستاره» کامل شد!' },
    { word: 'موشک', letters: ['م', 'و', 'ش', 'ک'], extra: ['ن', 'ب'], emoji: '🚀', tip: 'سه، دو، یک، پرتاب! کلمه «موشک» رو عالی ساختی!' },
    { word: 'آفتاب', letters: ['آ', 'ف', 'ت', 'ا', 'ب'], extra: ['ز'], emoji: '☀️', tip: 'هورااا! کلمه درخشان «آفتاب» رو مثل یک استاد نوشتی!' },
  ];
  FAMILY_WORDS.forEach((w, i) => {
    const num = 61 + i;
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: 7,
      chapterTitle: 'فصل ۷: کلمه‌سازی پیشرفته (بابا، مادر، ستاره...)',
      title: `ساختن کلمه زیبای «${w.word}» ${w.emoji}`,
      kidPrompt: `قهرمان باسواد من، حروف کلمه «${w.word}» رو به ترتیب بچین!`,
      scienceTip: w.tip,
      winVoiceClipKey: 'win_persian_word',
      gameKind: 'word_builder',
      heroDisplay: w.word,
      heroEmoji: w.emoji,
      heroSubLabel: `حروف کلمه «${w.word}»`,
      targetLetters: w.letters,
      extraLetters: w.extra,
      rtlWord: true,
    });
  });

  // Chapter 8 (71..80): Persian Letter & Picture Memory Match
  for (let i = 0; i < 10; i++) {
    const num = 71 + i;
    const idx = (i * 3) % 28;
    const e1 = PERSIAN_ALPHABET_32[idx];
    const e2 = PERSIAN_ALPHABET_32[idx + 1];
    const e3 = PERSIAN_ALPHABET_32[idx + 2];
    levels.push({
      id: `pers-${String(num).padStart(3, '0')}`,
      lab: 'persian',
      number: num,
      chapter: 8,
      chapterTitle: 'فصل ۸: کارت‌های حافظه حروف و تصاویر',
      title: `بازی حافظه الفبا: «${e1.letter} ، ${e2.letter} ، ${e3.letter}»`,
      kidPrompt: 'کارت‌ها رو برگردون و هر حرف فارسی رو با تصویری که با اون حرف شروع می‌شه جفت کن!',
      scienceTip: 'آفرین به این هوش و حافظه‌ی قوی! هر سه حرف رو با شکلشون پیدا کردی!',
      gameKind: 'memory_match',
      memoryPairs: [
        { pairId: 'm1', cardA: e1.letter, cardB: `${e1.emoji} ${e1.word.split(' ')[0]}`, speakFa: e1.word },
        { pairId: 'm2', cardA: e2.letter, cardB: `${e2.emoji} ${e2.word.split(' ')[0]}`, speakFa: e2.word },
        { pairId: 'm3', cardA: e3.letter, cardB: `${e3.emoji} ${e3.word.split(' ')[0]}`, speakFa: e3.word },
      ],
    });
  }

  // Chapter 9 (81..90): Rhyming Words & Dotted vs Undotted Letters Sorting
  const RHYMES = [
    { w: 'سیب 🍎', r: 'جیب 👖', x1: 'توپ ⚽', x2: 'ماه 🌙' },
    { w: 'ماه 🌙', r: 'راه 🛣️', x1: 'سیب 🍎', x2: 'فیل 🐘' },
    { w: 'باد 💨', r: 'شاد 😊', x1: 'گل 🌸', x2: 'کتاب 📘' },
    { w: 'ستاره ⭐', r: 'دوباره 🔄', x1: 'درخت 🌳', x2: 'نان 🍞' },
    { w: 'بهار 🌸', r: 'انار 🍎', x1: 'کفش 👟', x2: 'موشک 🚀' },
  ];
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    if (i < 5) {
      const rh = RHYMES[i];
      levels.push({
        id: `pers-${String(num).padStart(3, '0')}`,
        lab: 'persian',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: شعر و کلمه‌های هم‌قافیه و نقطه‌دارها',
        title: `کلمه هم‌آهنگ و هم‌قافیه با «${rh.w}» کدومه؟`,
        kidPrompt: `گوش کن عزیزم! کدوم کلمه آخرش دقیقاً شبیه «${rh.w}» صدا می‌ده؟`,
        scienceTip: `به به شاعر کوچولو! «${rh.w}» و «${rh.r}» هم‌قافیه هستن و توی شعرها کنار هم میان!`,
        gameKind: 'choice_discovery',
        heroDisplay: rh.w,
        heroSubLabel: 'هم‌قافیه‌اش رو پیدا کن!',
        options: [
          { id: 'r1', label: rh.r.split(' ')[0], emoji: rh.r.split(' ')[1], isCorrect: true, voiceTextFa: rh.r.split(' ')[0] },
          { id: 'r2', label: rh.x1.split(' ')[0], emoji: rh.x1.split(' ')[1], isCorrect: false },
          { id: 'r3', label: rh.x2.split(' ')[0], emoji: rh.x2.split(' ')[1], isCorrect: false },
        ],
      });
    } else {
      levels.push({
        id: `pers-${String(num).padStart(3, '0')}`,
        lab: 'persian',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: شعر و کلمه‌های هم‌قافیه و نقطه‌دارها',
        title: `دسته‌بندی حروف نقطه‌دار و بی‌نقطه (${i - 4})`,
        kidPrompt: 'حروفی که نقطه دارن رو بذار توی سبد نقطه‌دارها و حروف بدون نقطه رو توی سبد بی‌نقطه‌ها!',
        scienceTip: 'هورااا قهرمان الفبای فارسی! تمام ۹۰ مرحله الفبا و کلمه‌سازی رو با درخشش یاد گرفتی!',
        gameKind: 'sorting_bins',
        binA: { title: 'حروف نقطه‌دار', emoji: '🔵', colorHex: '#ec4899' },
        binB: { title: 'حروف بدون نقطه', emoji: '⚪', colorHex: '#10b981' },
        sortItems: [
          { id: 'd1', nameFa: 'حرف ب', emoji: 'ب', targetBin: 'A' },
          { id: 'd2', nameFa: 'حرف د', emoji: 'د', targetBin: 'B' },
          { id: 'd3', nameFa: 'حرف ش', emoji: 'ش', targetBin: 'A' },
          { id: 'd4', nameFa: 'حرف س', emoji: 'س', targetBin: 'B' },
        ],
      });
    }
  }

  return levels;
}

export const PERSIAN_LEVELS: AcademyLevel[] = buildPersianLevels();

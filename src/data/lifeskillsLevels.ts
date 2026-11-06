import { AcademyLevel } from '../types/game';

function buildLifeskillsLevels(): AcademyLevel[] {
  const levels: AcademyLevel[] = [];

  // Chapter 1 & 2 (1..20): Street Safety, Traffic Lights & Home Safety!
  const SAFETY_10 = [
    { q: 'وقتی چراغ راهنمایی «قرمز 🔴» است چه کاری درسته؟', ans: ['🛑', 'می‌ایستیم و صبر می‌کنیم!'], w1: ['🏃', 'وسط خیابان می‌دویم'], w2: ['🚲', 'تند رد می‌شویم'] },
    { q: 'وقتی چراغ عابر پیاده «سبز 🟢» شد و دست مامان و بابا رو گرفتیم چیکار می‌کنیم؟', ans: ['🚶‍♂️', 'با احتیاط از خط سفید رد می‌شیم'], w1: ['😴', 'وسط خیابان می‌نشینیم'], w2: ['⚽', 'توپ‌بازی می‌کنیم'] },
    { q: 'از کجای خیابان باید به سمت دیگر برویم؟', ans: ['🦓', 'خط‌کشی سفید عابر پیاده'], w1: ['🚗', 'وسط ماشین‌های تندرو'], w2: ['🚧', 'پشت کامیون'] },
    { q: 'وقتی سوار ماشین می‌شیم اولین کار ایمنی چیه؟', ans: ['💺', 'بستن کمربند ایمنی و نشستن روی صندلی کودک'], w1: ['🪟', 'بیرون آوردن سر از پنجره'], w2: ['🧍', 'ایستادن روی صندلی'] },
    { q: 'وقتی دوچرخه‌سواری یا اسکوتربازی می‌کنیم چی سرمون می‌ذاریم؟', ans: ['⛑️', 'کلاه ایمنی محکم'], w1: ['🍲', 'قابلمه'], w2: ['🎈', 'بادکنک'] },
    { q: 'در خانه آیا باید به قابلمه داغ روی گاز دست بزنیم؟', ans: ['🙅‍♂️', 'هرگز! داغه و فقط بزرگ‌ترها استفاده می‌کنن'], w1: ['✋', 'دست بزنیم'], w2: ['🏃', 'کنارش بدویم'] },
    { q: 'شماره تلفن «آتش‌نشانی» در ایران چند است؟ 🚒', ans: ['1️⃣2️⃣5️⃣', 'شماره ۱۲۵ آتش‌نشانی'], w1: ['0️⃣0️⃣0️⃣', 'صفر'], w2: ['9️⃣9️⃣9️⃣', 'نهصد و نود و نه'] },
    { q: 'شماره تلفن «اورژانس و آمبولانس» چند است؟ 🚑', ans: ['1️⃣1️⃣5️⃣', 'شماره ۱۱۵ اورژانس'], w1: ['2️⃣2️⃣2️⃣', 'دویست و بیست و دو'], w2: ['5️⃣5️⃣5️⃣', 'پانصد و پنجاه و پنج'] },
    { q: 'آیا باید جسم فلزی یا میخ داخل پریز برق واقعی فرو کنیم؟', ans: ['🚫', 'هرگز! فقط در بازی آزمایشگاه برق تمرین می‌کنیم!'], w1: ['🔧', 'امتحان کنیم'], w2: ['💦', 'آب بریزیم'] },
    { q: 'در پارک و فروشگاه باید کجا راه برویم؟', ans: ['👨‍👦', 'کنار پدر و مادر عزیز و در دید آن‌ها'], w1: ['🏃', 'تنهایی دور شویم'], w2: ['🙈', 'قایم شویم'] },
  ];
  for (let i = 0; i < 20; i++) {
    const num = 1 + i;
    const s = SAFETY_10[i % SAFETY_10.length];
    levels.push({
      id: `life-${String(num).padStart(3, '0')}`,
      lab: 'lifeskills',
      number: num,
      chapter: i < 10 ? 1 : 2,
      chapterTitle: i < 10 ? 'فصل ۱: پلیس کوچولو و قوانین راهنمایی' : 'فصل ۲: قهرمان ایمنی در خانه و شهر',
      title: s.q,
      kidPrompt: s.q,
      scienceTip: `آفرین قهرمان محتاط! «${s.ans[1]}» باعث می‌شه همیشه سالم و امن بمونیم!`,
      winVoiceClipKey: 'win_life_safety',
      gameKind: 'choice_discovery',
      heroDisplay: s.q,
      heroEmoji: s.ans[0],
      heroSubLabel: 'بهترین رفتار ایمنی کدومه؟',
      options: [
        { id: 'ok', label: s.ans[1], emoji: s.ans[0], isCorrect: true },
        { id: 'w1', label: s.w1[1], emoji: s.w1[0], isCorrect: false },
        { id: 'w2', label: s.w2[1], emoji: s.w2[0], isCorrect: false },
      ],
    });
  }

  // Chapter 3 & 4 (21..40): Hygiene + Healthy Food vs Sugary Snacks Sorting!
  for (let i = 0; i < 20; i++) {
    const num = 21 + i;
    if (i < 10) {
      const HYGIENE = [
        { q: 'قبل از غذا خوردن و بعد از بازی بیرون باید چیکار کنیم؟', ans: ['🧼', 'شستن دست‌ها با آب و صابون'], w1: ['泥', 'بازی با خاک'], w2: ['😴', 'خوابیدن با دست کثیف'] },
        { q: 'هر شب قبل از خواب و هر صبح برای براق موندن دندان‌ها چیکار می‌کنیم؟', ans: ['🪥', 'مسواک زدن کامل دندان‌ها'], w1: ['🍭', 'خوردن آب‌نبات در رختخواب'], w2: ['🥤', 'خوردن نوشابه'] },
        { q: 'برای اینکه قد بکشیم و پرانرژی باشیم شب‌ها چه موقع می‌خوابیم؟', ans: ['🛌', 'به‌موقع و در ساعت منظم شب'], w1: ['📱', 'بیدار ماندن تا صبح'], w2: ['🏃', 'دویدن نصف شب'] },
        { q: 'وقتی عطسه یا سرفه می‌کنیم چه کاری مودبانه و بهداشتیه؟', ans: ['🤧', 'گرفتن دستمال یا آرنج جلوی دهان'], w1: ['😮', 'عطسه در صورت دیگران'], w2: ['🙌', 'دست زدن به خوراکی‌ها'] },
        { q: 'در طول روز بدن ما برای شادابی به نوشیدن چه چیزی نیاز دارد؟', ans: ['💧', 'آب تمیز و گوارا'], w1: ['🥤', 'فقط نوشابه گازدار'], w2: ['🍬', 'شربت خیلی شیرین'] },
      ];
      const h = HYGIENE[i % HYGIENE.length];
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 3,
        chapterTitle: 'فصل ۳: قهرمان پاکیزگی، مسواک و سلامتی',
        title: h.q,
        kidPrompt: h.q,
        scienceTip: `هورااا! «${h.ans[1]}» میکروب‌ها رو دور می‌کنه و بدن رو قوی نگه می‌داره!`,
        winVoiceClipKey: 'win_life_health',
        gameKind: 'choice_discovery',
        heroDisplay: h.q,
        heroEmoji: h.ans[0],
        heroSubLabel: 'عادت سالم رو انتخاب کن!',
        options: [
          { id: 'ok', label: h.ans[1], emoji: h.ans[0], isCorrect: true },
          { id: 'w1', label: h.w1[1], emoji: h.w1[0], isCorrect: false },
          { id: 'w2', label: h.w2[1], emoji: h.w2[0], isCorrect: false },
        ],
      });
    } else {
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 4,
        chapterTitle: 'فصل ۴: سبد خوراکی‌های مقوی و سالم',
        title: `تفکیک خوراکی‌های سالم و مقوی از تنقلات پرشکر (${i - 9})`,
        kidPrompt: 'میوه و شیر و سبزیجات مقوی رو بذار در سبد سبز سلامتی، و شیرینی‌های زیاد رو در سبد زرد!',
        scienceTip: 'آفرین قهرمان پرانرژی! میوه، سبزیجات، شیر و تخم‌مرغ عضله‌ها و مغز رو قوی می‌کنن!',
        winVoiceClipKey: 'win_life_health',
        gameKind: 'sorting_bins',
        binA: { title: 'خوراکی مقوی و سالم', emoji: '💪', colorHex: '#22c55e' },
        binB: { title: 'تنقلات پرشکر (خیلی کم!)', emoji: '🍬', colorHex: '#f59e0b' },
        sortItems: [
          { id: '1', nameFa: 'سیب و میوه', emoji: '🍎', targetBin: 'A' },
          { id: '2', nameFa: 'آب‌نبات چوبی', emoji: '🍭', targetBin: 'B' },
          { id: '3', nameFa: 'کلم بروکلی و سبزی', emoji: '🥦', targetBin: 'A' },
          { id: '4', nameFa: 'نوشابه شیرین', emoji: '🥤', targetBin: 'B' },
        ],
      });
    }
  }

  // Chapter 5 & 6 (41..60): Four Seasons, Weather Clothes & Emotions!
  const SEASONS_EMOTIONS = [
    { q: 'در کدوم فصل درخت‌ها شکوفه می‌زنن و عید نوروز میاد؟', ans: ['🌸', 'فصل بهار زیبا'], w1: ['⛄', 'زمستان'], w2: ['🍁', 'پاییز'], clip: 'win_life_seasons' },
    { q: 'در کدوم فصل هوا گرمه و میوه‌های تابستانی مثل هندوانه می‌رسن؟', ans: ['☀️', 'فصل تابستان گرم'], w1: ['❄️', 'زمستان سرد'], w2: ['🍂', 'پاییز'], clip: 'win_life_seasons' },
    { q: 'در کدوم فصل برگ‌های درختان زرد و نارنجی می‌شن و می‌ریزن؟', ans: ['🍁', 'فصل پاییز هزاررنگ'], w1: ['🌸', 'بهار'], w2: ['🏖️', 'تابستان'], clip: 'win_life_seasons' },
    { q: 'در کدوم فصل برف سفید می‌باره و آدم‌برفی درست می‌کنیم؟', ans: ['⛄', 'فصل زمستان برفی'], w1: ['☀️', 'تابستان'], w2: ['🌸', 'بهار'], clip: 'win_life_seasons' },
    { q: 'وقتی بیرون برف و سرماست چه لباسی می‌پوشیم؟', ans: ['🧥', 'کاپشن گرم، کلاه و دستکش 🧤'], w1: ['🩳', 'لباس نازک ساحلی'], w2: ['🕶️', 'فقط عینک آفتابی'], clip: 'win_life_seasons' },
    { q: 'وقتی هدیه می‌گیریم یا آزمایش رو موفق انجام می‌دیم چه حسی داریم؟', ans: ['😊', 'احساس شادی و خوشحالی!'], w1: ['😠', 'عصبانی'], w2: ['😴', 'خواب‌آلود'], clip: 'win_life_manners' },
    { q: 'وقتی عصبانی می‌شیم بهترین کار برای آرام شدن چیه؟', ans: ['🌬️', 'کشیدن ۳ نفس عمیق و شمردن تا ۵'], w1: ['🗣️', 'داد زدن بلند'], w2: ['💥', 'پرت کردن اسباب‌بازی'], clip: 'win_life_manners' },
    { q: 'وقتی دوست کوچولومون زمین می‌خوره چه کار مهربانانه‌ای می‌کنیم؟', ans: ['🤝', 'دستش رو می‌گیریم و بهش کمک می‌کنیم'], w1: ['😂', 'می‌خندیم'], w2: ['🏃', 'بی‌توجه رد می‌شیم'], clip: 'win_life_manners' },
    { q: 'کدوم عضو صورت به ما کمک می‌کنه رنگ‌ها و کتاب‌ها رو ببینیم؟', ans: ['👀', 'چشم‌های قشنگ (حس بینایی)'], w1: ['👂', 'گوش'], w2: ['🤚', 'کف دست'], clip: 'win_life_health' },
    { q: 'کدوم عضو به ما کمک می‌کنه صدای موسیقی و صدای بابا و مامان رو بشنویم؟', ans: ['👂', 'گوش‌ها (حس شنوایی)'], w1: ['👃', 'بینی'], w2: ['🦶', 'پا'], clip: 'win_life_health' },
  ];
  for (let i = 0; i < 20; i++) {
    const num = 41 + i;
    const item = SEASONS_EMOTIONS[i % SEASONS_EMOTIONS.length];
    levels.push({
      id: `life-${String(num).padStart(3, '0')}`,
      lab: 'lifeskills',
      number: num,
      chapter: i < 10 ? 5 : 6,
      chapterTitle: i < 10 ? 'فصل ۵: چهار فصل سال و لباس مناسب' : 'فصل ۶: شناخت احساسات و حواس پنج‌گانه',
      title: item.q,
      kidPrompt: item.q,
      scienceTip: `آفرین گل مهربونم! «${item.ans[1]}» کاملاً درسته!`,
      winVoiceClipKey: item.clip,
      gameKind: 'choice_discovery',
      heroDisplay: item.q,
      heroEmoji: item.ans[0],
      heroSubLabel: 'بهترین پاسخ رو انتخاب کن!',
      options: [
        { id: 'ok', label: item.ans[1], emoji: item.ans[0], isCorrect: true },
        { id: 'w1', label: item.w1[1], emoji: item.w1[0], isCorrect: false },
        { id: 'w2', label: item.w2[1], emoji: item.w2[0], isCorrect: false },
      ],
    });
  }

  // Chapter 7 & 8 (61..80): Polite Magic Words + Tidy Room & Earth Care Sorting!
  for (let i = 0; i < 20; i++) {
    const num = 61 + i;
    if (i < 10) {
      const MANNERS = [
        { q: 'وقتی وارد خانه می‌شویم یا کسی رو می‌بینیم اولین کلمه قشنگ چیه؟', ans: ['👋', 'گفتن «سلام!» با لبخند'], w1: ['😶', 'رو برگرداندن'], w2: ['😤', 'اخم کردن'] },
        { q: 'وقتی کسی به ما آب، خوراکی یا هدیه می‌ده چی می‌گیم؟', ans: ['💝', 'می‌گیم «مرسی / متشکرم!»'], w1: ['🏃', 'فرار می‌کنیم'], w2: ['😠', 'غر می‌زنیم'] },
        { q: 'وقتی از مامان یا بابا چیزی می‌خوایم چه کلمه جادویی رو می‌گیم؟', ans: ['✨', 'می‌گیم «لطفاً / بی‌زحمت!»'], w1: ['📢', 'فریاد می‌زنیم'], w2: ['🦶', 'پا زمین می‌کوبیم'] },
        { q: 'وقتی بازی با اسباب‌بازی‌هامون تمام شد چه کار خوبی انجام می‌دیم؟', ans: ['🧺', 'اسباب‌بازی‌ها رو جمع می‌کنیم توی سبدشون!'], w1: ['🌪️', 'پخش‌وپلا رها می‌کنیم'], w2: ['🔨', 'می‌شکنیم'] },
        { q: 'پوست میوه و کاغذ زباله رو در پارک کجا می‌اندازیم؟', ans: ['🗑️', 'فقط داخل سطل زباله!'], w1: ['🌳', 'روی چمن و زمین'], w2: ['🌊', 'توی جوی آب'] },
      ];
      const m = MANNERS[i % MANNERS.length];
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 7,
        chapterTitle: 'فصل ۷: کلمه‌های جادویی ادب و مهربانی',
        title: m.q,
        kidPrompt: m.q,
        scienceTip: `هزار آفرین پسر مودب و آقا! «${m.ans[1]}» نشانه شخصیت بزرگ و مهربان توست!`,
        winVoiceClipKey: 'win_life_manners',
        gameKind: 'choice_discovery',
        heroDisplay: m.q,
        heroEmoji: m.ans[0],
        heroSubLabel: 'رفتار مودبانه کدومه؟',
        options: [
          { id: 'ok', label: m.ans[1], emoji: m.ans[0], isCorrect: true },
          { id: 'w1', label: m.w1[1], emoji: m.w1[0], isCorrect: false },
          { id: 'w2', label: m.w2[1], emoji: m.w2[0], isCorrect: false },
        ],
      });
    } else {
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 8,
        chapterTitle: 'فصل ۸: مرتب کردن اتاق و لباس فصل‌ها',
        title: `لباس زمستانی یا لباس تابستانی؟ (${i - 9})`,
        kidPrompt: 'لباس‌های گرم برفی رو بذار در سبد زمستان، و وسایل آفتابی رو در سبد تابستان!',
        scienceTip: 'باریکلا پسر منظم و مستقل! حالا خودت می‌دونی توی هر هوایی چه لباسی مناسبه!',
        winVoiceClipKey: 'win_life_seasons',
        gameKind: 'sorting_bins',
        binA: { title: 'فصل زمستان و برف', emoji: '❄️', colorHex: '#38bdf8' },
        binB: { title: 'فصل تابستان و آفتاب', emoji: '☀️', colorHex: '#f59e0b' },
        sortItems: [
          { id: '1', nameFa: 'دستکش پشمی', emoji: '🧤', targetBin: 'A' },
          { id: '2', nameFa: 'کلاه آفتابی', emoji: '👒', targetBin: 'B' },
          { id: '3', nameFa: 'شال‌گردن گرم', emoji: '🧣', targetBin: 'A' },
          { id: '4', nameFa: 'عینک آفتابی', emoji: '🕶️', targetBin: 'B' },
        ],
      });
    }
  }

  // Chapter 9 (81..90): Daily Routine Sequence & Life Skills Memory Finale!
  for (let i = 0; i < 10; i++) {
    const num = 81 + i;
    if (i < 5) {
      const ROUTINES = [
        { seq: ['🌅 بیداری', '🪥 مسواک', '🍳 صبحانه', '🎮 بازی و یادگیری'], miss: 1, ans: '🪥 مسواک', x1: '🌙 خواب شب', x2: '⛄ برف' },
        { seq: ['🌱 بهار', '☀️ تابستان', '🍁 پاییز', '❄️ زمستان'], miss: 2, ans: '🍁 پاییز', x1: '🚗 ماشین', x2: '⚽ توپ' },
        { seq: ['🧼 صابون', '💧 آبکشی', '🧻 خشک کردن', '🍽️ غذا خوردن'], miss: 1, ans: '💧 آبکشی', x1: '👟 کفش', x2: '🎈 بادکنک' },
        { seq: ['🔴 ایست', '🟡 آماده', '🟢 حرکت', '🏁 رسیدن امن'], miss: 2, ans: '🟢 حرکت', x1: '🍎 سیب', x2: '🐟 ماهی' },
        { seq: ['🍽️ شام', '🪥 مسواک شب', '📖 قصه شب', '😴 خواب شیرین'], miss: 1, ans: '🪥 مسواک شب', x1: '☀️ ظهر داغ', x2: '⚽ فوتبال' },
      ];
      const rt = ROUTINES[i];
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: برنامه روزانه قهرمانان و جشن پایانی',
        title: `قطار نظم و ترتیب روزانه — مرحله ${i + 1}`,
        kidPrompt: 'ببین کدوم کار خوب جای خالی قطار برنامه روزانه رو کامل می‌کنه!',
        scienceTip: 'آفرین پسر منظم، مودب و باهوش! داشتن برنامه منظم رمز موفقیت همه‌ی دانشمندهاست!',
        winVoiceClipKey: 'win_life_health',
        gameKind: 'sequence_train',
        wagons: rt.seq,
        missingWagonIndex: rt.miss,
        options: [
          { id: 'ok', label: rt.ans, isCorrect: true },
          { id: 'w1', label: rt.x1, isCorrect: false },
          { id: 'w2', label: rt.x2, isCorrect: false },
        ],
      });
    } else {
      levels.push({
        id: `life-${String(num).padStart(3, '0')}`,
        lab: 'lifeskills',
        number: num,
        chapter: 9,
        chapterTitle: 'فصل ۹: برنامه روزانه قهرمانان و جشن پایانی',
        title: `کارت‌های حافظه مهارت‌های زندگی — مرحله ${i - 4}`,
        kidPrompt: 'وسایل مرتبط با سلامتی و ایمنی رو با هم جفت کن!',
        scienceTip: 'هورااا قهرمان تمام‌عیار! تمام ۹۰ مرحله مهارت‌های زندگی، ادب و سلامتی رو با افتخار کامل کردی!',
        winVoiceClipKey: 'win_life_manners',
        gameKind: 'memory_match',
        memoryPairs: [
          { pairId: 'l1', cardA: '🪥 مسواک', cardB: '🦷 دندان براق', speakFa: 'مسواک و دندان تمیز' },
          { pairId: 'l2', cardA: '🧼 صابون', cardB: '👐 دست تمیز', speakFa: 'صابون و دست تمیز' },
          { pairId: 'l3', cardA: '⛑️ کلاه ایمنی', cardB: '🚲 دوچرخه', speakFa: 'دوچرخه‌سواری ایمن' },
        ],
      });
    }
  }

  return levels;
}

export const LIFESKILLS_LEVELS: AcademyLevel[] = buildLifeskillsLevels();

import {
  ElectricLevel,
  ElectricPartKind,
  PluggableApplianceKind,
  ElectricSlotSpec,
  WirePairHint,
} from '../types/game';

interface LevelBlueprint {
  title: string;
  kidPrompt: string;
  scienceTip: string;
  boardTheme: 'wood' | 'tech' | 'wall';
  slots: ElectricSlotSpec[];
  targetLoads: string[];
  requiresSwitchToggle?: boolean;
  requiresBreakerSafety?: boolean;
  pluggableAppliance?: PluggableApplianceKind;
  hintWires: WirePairHint[];
}

const CHAPTER_TITLES: Record<number, string> = {
  1: 'فصل ۱: اولین جرقه! باتری، سیم و آرمیچر',
  2: 'فصل ۲: جادوی دکمه و کلید قطع و وصل',
  3: 'فصل ۳: انرژی خورشیدی، دینام و قدرت بیشتر',
  4: 'فصل ۴: مدار سری و ریسه‌های نورانی',
  5: 'فصل ۵: مدار موازی و تقسیم جریان برق',
  6: 'فصل ۶: آهنربای الکتریکی، دیمر و سنسور هوشمند',
  7: 'فصل ۷: برق ساختمان، تابلو فیوز و کلید یک‌پل',
  8: 'فصل ۸: نصب حرفه‌ای پریز برق، دوشاخه و کلید دوپل',
  9: 'فصل ۹: مهندس ارشد! کلید تبدیل راه‌پله و خانه هوشمند',
};

// Helper for 2-part basic loop (Source + Load)
function simpleLoop(
  source: ElectricPartKind,
  load: ElectricPartKind,
  title: string,
  kidPrompt: string,
  scienceTip: string,
  theme: 'wood' | 'tech' = 'wood'
): LevelBlueprint {
  return {
    title,
    kidPrompt,
    scienceTip,
    boardTheme: theme,
    slots: [
      { slotId: 'src', partKind: source, x: 26, y: 52 },
      { slotId: 'load', partKind: load, x: 74, y: 52 },
    ],
    targetLoads: ['load'],
    hintWires: [
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'load', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'load', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  };
}

// Helper for 3-part switched loop (Source + Switch/Sensor/Dimmer + Load)
function switchedLoop(
  source: ElectricPartKind,
  ctrl: ElectricPartKind,
  load: ElectricPartKind,
  title: string,
  kidPrompt: string,
  scienceTip: string,
  theme: 'wood' | 'tech' | 'wall' = 'wood',
  requiresToggle = true
): LevelBlueprint {
  return {
    title,
    kidPrompt,
    scienceTip,
    boardTheme: theme,
    slots: [
      { slotId: 'src', partKind: source, x: 20, y: 58 },
      { slotId: 'ctrl', partKind: ctrl, x: 50, y: 30 },
      { slotId: 'load', partKind: load, x: 80, y: 58 },
    ],
    targetLoads: ['load'],
    requiresSwitchToggle: requiresToggle,
    hintWires: [
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'ctrl', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'ctrl', fromTerm: 'out', toSlot: 'load', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'load', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  };
}

// Helper for Series Circuit (Source + Switch + Load1 + Load2)
function seriesTwoLoads(
  source: ElectricPartKind,
  ctrl: ElectricPartKind | null,
  load1: ElectricPartKind,
  load2: ElectricPartKind,
  title: string,
  kidPrompt: string,
  scienceTip: string
): LevelBlueprint {
  if (!ctrl) {
    return {
      title,
      kidPrompt,
      scienceTip,
      boardTheme: 'tech',
      slots: [
        { slotId: 'src', partKind: source, x: 18, y: 55 },
        { slotId: 'l1', partKind: load1, x: 50, y: 34 },
        { slotId: 'l2', partKind: load2, x: 82, y: 55 },
      ],
      targetLoads: ['l1', 'l2'],
      hintWires: [
        { fromSlot: 'src', fromTerm: 'pos', toSlot: 'l1', toTerm: 'in', wireColor: '#ef4444' },
        { fromSlot: 'l1', fromTerm: 'out', toSlot: 'l2', toTerm: 'in', wireColor: '#f59e0b' },
        { fromSlot: 'l2', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
      ],
    };
  }
  return {
    title,
    kidPrompt,
    scienceTip,
    boardTheme: 'tech',
    slots: [
      { slotId: 'src', partKind: source, x: 16, y: 62 },
      { slotId: 'ctrl', partKind: ctrl, x: 38, y: 28 },
      { slotId: 'l1', partKind: load1, x: 64, y: 28 },
      { slotId: 'l2', partKind: load2, x: 84, y: 62 },
    ],
    targetLoads: ['l1', 'l2'],
    requiresSwitchToggle: true,
    hintWires: [
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'ctrl', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'ctrl', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'l2', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l2', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  };
}

// Helper for Parallel Circuit (Source + Switch/Junction + 2 parallel loads)
function parallelTwoLoads(
  source: ElectricPartKind,
  ctrl: ElectricPartKind,
  load1: ElectricPartKind,
  load2: ElectricPartKind,
  title: string,
  kidPrompt: string,
  scienceTip: string
): LevelBlueprint {
  return {
    title,
    kidPrompt,
    scienceTip,
    boardTheme: 'tech',
    slots: [
      { slotId: 'src', partKind: source, x: 16, y: 52 },
      { slotId: 'ctrl', partKind: ctrl, x: 44, y: 52 },
      { slotId: 'l1', partKind: load1, x: 78, y: 28 },
      { slotId: 'l2', partKind: load2, x: 78, y: 74 },
    ],
    targetLoads: ['l1', 'l2'],
    requiresSwitchToggle: ctrl !== 'junction_box',
    hintWires: [
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'ctrl', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'ctrl', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'ctrl', fromTerm: 'out', toSlot: 'l2', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'l2', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  };
}

const BLUEPRINTS: LevelBlueprint[] = [
  // ================= CHAPTER 1 (1-10): Battery + Wire + Armature & Toys =================
  simpleLoop(
    'aa_battery',
    'armature',
    'وصل کردن آرمیچر به باتری',
    'قهرمان کوچولو! باتری و آرمیچر رو بذار سر جاشون و با دو تا سیم به هم وصلشون کن تا آرمیچر بچرخه!',
    'وقتی دو سر باتری با سیم به آرمیچر وصل می‌شود، جریان برق مدار را کامل می‌کند و محور آرمیچر با سرعت می‌چرخد!'
  ),
  simpleLoop(
    'aa_battery',
    'bulb_warm',
    'اولین لامپ درخشان من',
    'حالا بیا با باتری و سیم، این لامپ قشنگ رو روشن کنیم!',
    'جریان الکتریکی از رشته نازک داخل لامپ عبور می‌کند، آن را گرم و نورانی می‌کند.'
  ),
  simpleLoop(
    'aa_battery',
    'fan',
    'پنکه خنک‌کننده کوچولو',
    'هوا گرمه! بیا پره‌های پنکه رو به باتری وصل کنیم تا باد خنک بزنه!',
    'داخل هر پنکه یک آرمیچر (موتور الکتریکی) وجود دارد که انرژی برق را به حرکت باد تبدیل می‌کند.'
  ),
  simpleLoop(
    'aa_battery',
    'buzzer',
    'زنگ شادی آزمایشگاه',
    'باتری و زنگ رو با سیم وصل کن تا صدای دینگ‌دانگ بلند بشه!',
    'برق باعث لرزش سریع صفحه فلزی داخل زنگ می‌شود و موج صوتی می‌سازد.'
  ),
  simpleLoop(
    'battery_9v',
    'bulb_red',
    'چراغ قرمز آتش‌نشانی',
    'با باتری کتابی قوی، چراغ قرمز آتش‌نشانی رو روشن کن!',
    'باتری کتابی ۹ ولت انرژی بیشتری نسبت به باتری قلمی ۱.۵ ولت دارد.'
  ),
  simpleLoop(
    'battery_9v',
    'toy_car',
    'ماشین مسابقه‌ای برقی',
    'باتری رو به ماشین اسباب‌بازی وصل کن تا چرخ‌هاش راه بیفته!',
    'ماشین‌های برقی با یک باتری و یک آرمیچر پرقدرت چرخ‌ها را به حرکت درمی‌آورند.'
  ),
  simpleLoop(
    'dual_battery',
    'bulb_green',
    'چراغ سبز حرکت!',
    'جعبه‌باتری دوتایی رو به چراغ سبز وصل کن تا بدرخشه!',
    'وقتی دو باتری قلمی کنار هم قرار می‌گیرند، نیروی آن‌ها با هم جمع می‌شود.'
  ),
  simpleLoop(
    'battery_9v',
    'siren',
    'آژیر نورانی پلیس',
    'بیا آژیر پلیس رو به باتری وصل کنیم تا چراغ‌گردانش روشن بشه!',
    'آژیر هم‌زمان هم نور و هم صدا از انرژی الکتریکی تولید می‌کند.'
  ),
  simpleLoop(
    'dual_battery',
    'led_disco',
    'گوی نوری رنگین‌کمانی',
    'چراغ جشنی رو با سیم به باتری وصل کن تا کل اتاق رنگی بشه!',
    'چراغ‌های LED با مصرف برق بسیار کم، نورهای رنگارنگ و زیبایی می‌سازند.'
  ),
  simpleLoop(
    'battery_9v',
    'robot_buddy',
    'بیدار کردن ربات دانشمند!',
    'جشن پایان فصل اول! باتری رو به ربات مهربون وصل کن تا برات دست تکون بده!',
    'تمام ربات‌های دنیا از ترکیب باتری، سیم و موتورهای الکتریکی ساخته می‌شوند!'
  ),

  // ================= CHAPTER 2 (11-20): Push Buttons & Switches =================
  switchedLoop(
    'aa_battery',
    'push_button',
    'buzzer',
    'زنگ در خانه با دکمه شستی',
    'باتری، دکمه شستی و زنگ رو سیم‌کشی کن؛ بعد دکمه رو فشار بده تا زنگ بزنه!',
    'دکمه شستی مثل یک پل متحرک است؛ فقط وقتی فشارش می‌دهی برق رد می‌شود!'
  ),
  switchedLoop(
    'aa_battery',
    'toggle_switch',
    'bulb_warm',
    'چراغ مطالعه کلیددار',
    'یک کلید قطع و وصل سر راه لامپ بذار تا هر وقت خواستی روشن و خاموشش کنی!',
    'کلید برق مدار را باز و بسته می‌کند تا باتری بی‌خودی تمام نشود.'
  ),
  switchedLoop(
    'aa_battery',
    'toggle_switch',
    'armature',
    'کنترل آرمیچر با کلید',
    'آرمیچر رو با کلید به باتری وصل کن و با کلید روشنش کن!',
    'با کلید می‌توانیم موتورهای برقی را با ایمنی کامل کنترل کنیم.'
  ),
  switchedLoop(
    'dual_battery',
    'toggle_switch',
    'fan',
    'پنکه رومیزی کلیددار',
    'برای پنکه یک کلید بذار، سیم‌ها رو بکش و بعد کلیدش رو روشن کن!',
    'پنکه‌های واقعی هم دقیقاً یک کلید سر راه سیم برق موتور دارند.'
  ),
  switchedLoop(
    'battery_9v',
    'push_button',
    'siren',
    'دکمه آژیر آتش‌نشانی',
    'شستی قرمز رو به آژیر و باتری وصل کن و دکمه آژیر رو بزن!',
    'در ایستگاه آتش‌نشانی با فشردن شستی، مدار آژیر بسته و فعال می‌شود.'
  ),
  switchedLoop(
    'dual_battery',
    'toggle_switch',
    'bulb_blue',
    'چراغ خواب آبی آرامش‌بخش',
    'چراغ خواب آبی رو با کلید و باتری بساز و روشنش کن!',
    'وقتی کلید خاموش است، فاصله هوایی داخل کلید اجازه عبور برق را نمی‌دهد.'
  ),
  switchedLoop(
    'battery_9v',
    'push_button',
    'toy_car',
    'پدال گاز ماشین برقی',
    'دکمه شستی رو مثل پدال گاز سر راه ماشین برقی وصل کن!',
    'پدال گاز ماشین‌های شارژی در واقع یک کلید برقی است که برق موتور را وصل می‌کند.'
  ),
  switchedLoop(
    'battery_9v',
    'toggle_switch',
    'crane_winch',
    'جرثقیل برقی کلیددار',
    'جرثقیل برقی رو با کلید راه‌اندازی کن تا جعبه گنج رو بالا بکشه!',
    'آرمیچر می‌تواند نخ قرقره جرثقیل را بپیچد و اجسام سنگین را بلند کند.'
  ),
  switchedLoop(
    'dual_battery',
    'toggle_switch',
    'led_disco',
    'کلید جشن تولد!',
    'گوی رنگین‌کمان رو با کلید سیم‌کشی کن و جشن رو شروع کن!',
    'همیشه کلید را روی یکی از سیم‌های اصلی بین باتری و مصرف‌کننده قرار می‌دهیم.'
  ),
  switchedLoop(
    'battery_9v',
    'toggle_switch',
    'robot_buddy',
    'دکمه روشن کردن ربات',
    'برای ربات کوچولو کلید روشن و خاموش نصب کن!',
    'حالا تو بلدی هر وسیله برقی رو با کلید کنترل کنی!'
  ),

  // ================= CHAPTER 3 (21-30): Solar, Hand Dynamo & High Power =================
  simpleLoop(
    'solar_panel',
    'fan',
    'پنکه با انرژی خورشید!',
    'بدون باتری! پنل خورشیدی رو با سیم به پنکه وصل کن تا نور خورشید بچرخونتش!',
    'سلول خورشیدی نور آفتاب را مستقیماً به جریان برق پاک تبدیل می‌کند!',
    'tech'
  ),
  simpleLoop(
    'solar_panel',
    'bulb_warm',
    'چراغ خورشیدی باغچه',
    'پنل خورشیدی رو به چراغ وصل کن تا با انرژی آفتاب روشن بشه!',
    'انرژی خورشیدی تمام‌نشدنی است و هوا را آلوده نمی‌کند.',
    'tech'
  ),
  simpleLoop(
    'hand_dynamo',
    'armature',
    'تولید برق با دست! (دینام)',
    'دینام دستی رو به آرمیچر وصل کن! وقتی دسته دینام می‌چرخه، خودش برق می‌سازه!',
    'داخل دینام یک آهنربا و سیم‌پیچ است؛ دقیقاً برعکس آرمیچر، حرکت را به برق تبدیل می‌کند!',
    'tech'
  ),
  simpleLoop(
    'hand_dynamo',
    'bulb_green',
    'چراغ قوه بدون باتری (دینامی)',
    'دینام چرخشی رو به لامپ سبز وصل کن تا با چرخش دسته روشن بشه!',
    'چراغ دینامی دوچرخه‌ها هم از چرخش چرخ برق می‌گیرد.',
    'tech'
  ),
  switchedLoop(
    'solar_panel',
    'toggle_switch',
    'toy_car',
    'ماشین خورشیدی آینده',
    'پنل خورشیدی، کلید و ماشین رو به هم وصل کن و ماشین خورشیدی رو راه بنداز!',
    'مهندسان ماشین‌هایی می‌سازند که سقفشان پنل خورشیدی دارد.',
    'tech'
  ),
  switchedLoop(
    'hand_dynamo',
    'push_button',
    'buzzer',
    'زنگ بدون باتری با دینام',
    'دینام، شستی و زنگ رو سیم‌کشی کن و زنگ رو به صدا دربیار!',
    'در نیروگاه‌های برق هم ژنراتورهای بزرگ با چرخش توربین برق شهر را می‌سازند.',
    'tech'
  ),
  switchedLoop(
    'dual_battery',
    'toggle_switch',
    'crane_winch',
    'بالابر قوی با جعبه‌باتری',
    'جعبه‌باتری قوی رو با کلید به جرثقیل وصل کن تا وزنه رو بالا ببره!',
    'هر چه ولتاژ باتری بیشتر باشد، زور موتور برقی بیشتر می‌شود.',
    'tech'
  ),
  switchedLoop(
    'solar_panel',
    'toggle_switch',
    'led_disco',
    'فانوس رنگارنگ خورشیدی',
    'با پنل خورشیدی و کلید، چراغ رنگی رو روشن کن!',
    'نور خورشید می‌تواند زیباترین چراغ‌ها را روشن کند.',
    'tech'
  ),
  switchedLoop(
    'hand_dynamo',
    'toggle_switch',
    'siren',
    'آژیر اضطراری دینامی',
    'وقتی برق نیست، با دینام دستی و کلید آژیر رو روشن کن!',
    'دینام در مواقع اضطراری بدون نیاز به باتری برق تولید می‌کند.',
    'tech'
  ),
  switchedLoop(
    'solar_panel',
    'toggle_switch',
    'robot_buddy',
    'ربات دوستدار طبیعت (خورشیدی)',
    'ربات کوچولو رو با پنل خورشیدی و کلید راه‌اندازی کن!',
    'مریخ‌نوردهای واقعی در فضا هم با پنل‌های خورشیدی کار می‌کنند!',
    'tech'
  ),

  // ================= CHAPTER 4 (31-40): Series Circuits =================
  seriesTwoLoads(
    'dual_battery',
    null,
    'bulb_warm',
    'bulb_warm',
    'دو لامپ پشت سر هم (مدار سری)',
    'بیا با یک باتری دو تا لامپ رو پشت سر هم مثل قطار با سیم وصل کنیم!',
    'در مدار سری، جریان برق یکی‌یکی از لامپ اول و بعد از لامپ دوم عبور می‌کند.'
  ),
  seriesTwoLoads(
    'battery_9v',
    null,
    'bulb_red',
    'bulb_green',
    'ریسه دو رنگ قرمز و سبز',
    'لامپ قرمز و لامپ سبز رو پشت سر هم به باتری کتابی وصل کن!',
    'در مدار سری فقط یک مسیر دایره‌ای برای حرکت برق وجود دارد.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'toggle_switch',
    'bulb_warm',
    'bulb_blue',
    'ریسه نوری کلیددار',
    'یک کلید بذار که با یک دکمه هر دو لامپ طلایی و آبی با هم روشن بشن!',
    'در مدار سری، یک کلید کل مسیر را قطع و وصل می‌کند.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'toggle_switch',
    'armature',
    'bulb_green',
    'آرمیچر با چراغ نشانگر روشن بودن',
    'آرمیچر و چراغ سبز رو سری وصل کن تا هر وقت آرمیچر می‌چرخه، چراغ هم خبر بده!',
    'چراغ نشانگر روی وسایل برقی نشان می‌دهد که برق در مدار جاری است.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'toggle_switch',
    'fan',
    'bulb_warm',
    'پنکه چراغ‌دار سقفی',
    'پنکه و لامپ رو در یک زنجیره کلیددار سیم‌کشی کن!',
    'انرژی باتری بین پنکه و لامپ تقسیم می‌شود.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'push_button',
    'buzzer',
    'bulb_red',
    'زنگ در برای ناشنوایان (صدا + نور)',
    'زنگ و چراغ قرمز رو با شستی وصل کن تا هم زنگ بزنه و هم چراغ روشن بشه!',
    'مهندسان خوب وسایلی می‌سازند که به همه آدم‌ها کمک کند!'
  ),
  seriesTwoLoads(
    'solar_panel',
    'toggle_switch',
    'bulb_green',
    'bulb_blue',
    'ریسه خورشیدی دو رنگ',
    'با پنل خورشیدی و کلید، دو چراغ سبز و آبی رو روشن کن!',
    'نور خورشید هر دو چراغ سری را روشن نگه می‌دارد.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'fuse_box',
    'toy_car',
    'bulb_warm',
    'ماشین برقی با چراغ جلو و فیوز ایمنی',
    'فیوز محافظ رو سر راه ماشین و چراغ جلوش قرار بده تا ایمن کار کنن!',
    'فیوز مثل یک نگهبان مهربان است؛ اگر برق بیش از حد شود مدار را قطع می‌کند تا نسوزد.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'fuse_box',
    'crane_winch',
    'siren',
    'جرثقیل کارگاهی با آژیر ایمنی',
    'فیوز، جرثقیل و آژیر هشدار رو پشت سر هم سیم‌کشی کن!',
    'در کارگاه‌های واقعی، جرثقیل هنگام حرکت آژیر هشدار روشن می‌کند.'
  ),
  seriesTwoLoads(
    'battery_9v',
    'toggle_switch',
    'led_disco',
    'robot_buddy',
    'جشن رقص ربات و گوی نوری!',
    'ربات و گوی دیسکو رو با کلید در یک مدار سری به کار بنداز!',
    'آفرین! حالا مدار سری رو کامل یاد گرفتی!'
  ),

  // ================= CHAPTER 5 (41-50): Parallel Circuits =================
  parallelTwoLoads(
    'battery_9v',
    'junction_box',
    'bulb_warm',
    'bulb_warm',
    'مدار موازی: دو لامپ پرنور!',
    'از جعبه تقسیم به هر لامپ سیم جداگانه بکش تا هر دو با بیشترین نور بدرخشن!',
    'در مدار موازی، هر لامپ مسیر مستقیم خودش را به باتری دارد و نورش کم نمی‌شود!'
  ),
  parallelTwoLoads(
    'battery_9v',
    'toggle_switch',
    'bulb_red',
    'bulb_blue',
    'چراغ‌های موازی قرمز و آبی',
    'بعد از کلید، دو شاخه موازی برای لامپ قرمز و آبی بکش!',
    'تمام چراغ‌های خانه‌های ما به صورت موازی بسته می‌شوند.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'toggle_switch',
    'fan',
    'bulb_warm',
    'اتاق خنک و روشن (پنکه و چراغ موازی)',
    'پنکه و لامپ رو موازی ببند تا پنکه تند بچرخه و لامپ هم پرنور باشه!',
    'در مدار موازی، پنکه و لامپ قدرت کامل باتری را دریافت می‌کنند.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'toggle_switch',
    'armature',
    'armature',
    'ماشین دو موتوره چهارچرخ!',
    'دو تا آرمیچر رو به شکل موازی به کلید و باتری وصل کن تا هم‌زمان پرقدرت بچرخن!',
    'ماشین‌های برقی قوی برای چرخ‌های جلو و عقب موتورهای موازی دارند.'
  ),
  parallelTwoLoads(
    'solar_panel',
    'junction_box',
    'fan',
    'bulb_green',
    'ایستگاه خورشیدی موازی',
    'از پنل خورشیدی به جعبه تقسیم برو و هم پنکه و هم چراغ سبز رو روشن کن!',
    'جعبه تقسیم به ما کمک می‌کند سیم‌ها را تمیز و مرتب منشعب کنیم.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'push_button',
    'buzzer',
    'siren',
    'سیستم هشدار دوبل موازی',
    'با یک شستی هم زنگ و هم آژیر گردان رو به طور موازی به کار بنداز!',
    'اگر در مدار موازی یکی از وسایل خراب شود، وسیله دیگر همچنان کار می‌کند!'
  ),
  parallelTwoLoads(
    'dual_battery',
    'toggle_switch',
    'toy_car',
    'led_disco',
    'ماشین کارناوال نورانی',
    'ماشین و گوی رنگی رو موازی سیم‌کشی کن و کلیدش رو بزن!',
    'انشعاب موازی باعث می‌شود سرعت ماشین کم نشود.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'fuse_box',
    'crane_winch',
    'bulb_warm',
    'کارگاه ایمن با فیوز و دو شاخه موازی',
    'اول برق رو از فیوز رد کن، بعد موازی به جرثقیل و نورافکن بده!',
    'یک فیوز اصلی می‌تواند از چند شاخه موازی محافظت کند.'
  ),
  parallelTwoLoads(
    'hand_dynamo',
    'junction_box',
    'bulb_red',
    'bulb_green',
    'نیروگاه دستی دو چراغه',
    'با دینام دستی و جعبه تقسیم، دو چراغ موازی رو هم‌زمان روشن کن!',
    'برق تولیدشده در نیروگاه با خطوط موازی به محله‌های مختلف می‌رسد.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'toggle_switch',
    'robot_buddy',
    'fan',
    'ربات و پنکه در مدار موازی!',
    'جشن پایان فصل پنجم! ربات و پنکه رو موازی سیم‌کشی کن!',
    'تو الان تفاوت مدار سری و موازی رو مثل یک مهندس واقعی بلدی!'
  ),

  // ================= CHAPTER 6 (51-60): Electromagnet, Dimmer & Smart Sensors =================
  switchedLoop(
    'battery_9v',
    'toggle_switch',
    'electromagnet',
    'ساخت آهنربای الکتریکی جادویی!',
    'سیم‌پیچ دور میخ آهنی رو با کلید به باتری وصل کن تا گیره‌های فلزی رو جذب کنه!',
    'وقتی برق از سیم‌پیچ دور میخ آهنی رد می‌شود، میخ تبدیل به آهنربای قوی می‌شود و با قطع برق رها می‌کند!',
    'tech'
  ),
  switchedLoop(
    'battery_9v',
    'push_button',
    'electromagnet',
    'جرثقیل آهنربایی اسقاطی',
    'با دکمه شستی آهنربای الکتریکی رو فعال کن تا قطعات آهنی رو بلند کنه!',
    'جرثقیل‌های بزرگ ذوب‌آهن با آهنربای الکتریکی ماشین‌های آهنی را بلند می‌کنند.',
    'tech'
  ),
  switchedLoop(
    'battery_9v',
    'dimmer_knob',
    'bulb_warm',
    'تنظیم نور چراغ با دیمر چرخشی',
    'دیمر چرخشی رو سر راه لامپ ببند و بعد پیچ دیمر رو بچرخون تا نور کم و زیاد بشه!',
    'دیمر (مقاومت متغیر) مقدار جریان برق را کم و زیاد می‌کند تا نور ملایم یا پرنور شود.',
    'tech'
  ),
  switchedLoop(
    'battery_9v',
    'dimmer_knob',
    'fan',
    'تنظیم سرعت پنکه (کند و تند)',
    'با نصب دیمر سر راه پنکه، سرعت چرخش پره‌ها رو خودت تنظیم کن!',
    'دکمه درجه‌های ۱ و ۲ و ۳ پنکه با تغییر مقاومت الکتریکی سرعت را عوض می‌کند.',
    'tech'
  ),
  switchedLoop(
    'battery_9v',
    'dimmer_knob',
    'armature',
    'کنترل سرعت چرخش آرمیچر',
    'دیمر چرخشی رو به باتری و آرمیچر وصل کن و سرعت آرمیچر رو بالا ببر!',
    'کنترل‌کننده سرعت موتور در قطارهای برقی به همین روش کار می‌کند.',
    'tech'
  ),
  switchedLoop(
    'battery_9v',
    'light_sensor',
    'bulb_warm',
    'چراغ هوشمند شب و روز (فتوسل)',
    'سنسور نور رو سر راه چراغ بذار؛ بعد دکمه «شب 🌙» روی سنسور رو بزن تا خودکار روشن بشه!',
    'چراغ‌های تیربرق کوچه سنسور فتوسل دارند؛ وقتی هوا تاریک شود خودبه‌خود روشن می‌شوند!',
    'tech'
  ),
  switchedLoop(
    'solar_panel',
    'light_sensor',
    'led_disco',
    'چراغ تزئینی هوشمند باغچه',
    'پنل و سنسور هوشمند رو به چراغ رنگارنگ وصل کن و حالت شب رو امتحان کن!',
    'سنسورهای نوری باعث صرفه‌جویی بزرگ در مصرف برق در طول روز می‌شوند.',
    'tech'
  ),
  parallelTwoLoads(
    'battery_9v',
    'light_sensor',
    'bulb_blue',
    'bulb_warm',
    'دو چراغ حیاط با یک سنسور شب',
    'سنسور شب رو طوری سیم‌کشی کن که با تاریک شدن هوا هر دو چراغ حیاط روشن بشن!',
    'یک سنسور هوشمند می‌تواند چندین چراغ موازی را هم‌زمان فرمان دهد.'
  ),
  parallelTwoLoads(
    'battery_9v',
    'dimmer_knob',
    'bulb_red',
    'fan',
    'کنترل هم‌زمان نور و باد با دیمر',
    'دیمر رو به چراغ قرمز و پنکه موازی وصل کن و پیچش رو بچرخون!',
    'مهندسان الکترونیک با ترکیب سنسور و مقاومت مدارهای هوشمند می‌سازند.'
  ),
  switchedLoop(
    'battery_9v',
    'light_sensor',
    'robot_buddy',
    'ربات نگهبان شب بیدار!',
    'ربات کوچولو رو به سنسور شب وصل کن تا به محض تاریک شدن هوا بیدار بشه!',
    'حالا آماده ورود به دنیای برق‌کشی واقعی ساختمان و نصب کلید و پریز هستی!',
    'tech'
  ),

  // ================= CHAPTER 7 (61-70): Home Electrical Panel, Breaker & Single Wall Switch =================
  {
    title: 'اول ایمنی! تابلو فیوز و چراغ سقفی',
    kidPrompt: 'مهندس برق! اول مطمئن شو فیوز خاموشه، سیم فاز (قرمز) و نول (آبی) رو به چراغ سقفی بکش و بعد فیوز رو بزن بالا!',
    scienceTip: 'در برق ساختمان همیشه دو سیم اصلی داریم: فاز (قرمز، برق‌دار) و نول (آبی، مسیر برگشت). همیشه قبل از کار فیوز را قطع می‌کنیم!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 22, y: 55 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 74, y: 32 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'lamp', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب اولین کلید یک‌پل دیواری اتاق!',
    kidPrompt: 'بیا مثل برق‌کار حرفه‌ای کلید دیوار رو نصب کنیم! فاز قرمز بره به کلید، از کلید بره به لامپ سقفی، و نول آبی برگرده به فیوز!',
    scienceTip: 'نکته طلایی برق‌کاری: همیشه سیم فاز (قرمز) را وارد کلید دیواری می‌کنیم تا وقتی کلید خاموش است، سرپیچ لامپ کاملاً بی‌برق و ایمن باشد!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 52 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 50, y: 66 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 78, y: 26 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب کلید دیواری برای هواکش آشپزخانه',
    kidPrompt: 'حالا با فیوز و کلید یک‌پل دیواری، هواکش آشپزخانه رو سیم‌کشی و روشن کن!',
    scienceTip: 'هواکش هم دقیقاً مثل لامپ سقفی با یک سیم برگشت از کلید یک‌پل و یک سیم نول مستقیم کار می‌کند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 55 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 50, y: 68 },
      { slotId: 'fan', partKind: 'exhaust_fan', x: 78, y: 28 },
    ],
    targetLoads: ['fan'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'fan', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'fan', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب زنگ در آپارتمان با شستی بیرون در',
    kidPrompt: 'تابلو فیوز، شستی دم در و زنگ داخل خونه رو سیم‌کشی کن؛ بعد فیوز رو بزن و زنگ در رو امتحان کن!',
    scienceTip: 'زنگ آپارتمان با شستی فشاری کار می‌کند تا فقط لحظه‌ای که مهمان انگشتش را نگه داشته صدا بدهد.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 55 },
      { slotId: 'btn', partKind: 'push_button', customLabel: 'شستی زنگ در', x: 50, y: 68 },
      { slotId: 'bell', partKind: 'doorbell_chime', x: 78, y: 26 },
    ],
    targetLoads: ['bell'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'btn', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'btn', fromTerm: 'out', toSlot: 'bell', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'bell', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'جعبه تقسیم بالای دیوار و کلید یک‌پل',
    kidPrompt: 'در خانه‌های واقعی سیم‌ها از جعبه تقسیم بالای دیوار رد می‌شن! فاز رو از جعبه تقسیم ببر به کلید و برگردون به چراغ!',
    scienceTip: 'جعبه تقسیم در بالای دیوار محل تمیز و استاندارد انشعاب سیم‌های لوله‌کشی داخل دیوار است.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 60 },
      { slotId: 'jbox', partKind: 'junction_box', x: 46, y: 26 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 46, y: 70 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 80, y: 26 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'jbox', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'jbox', fromTerm: 'out', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'یک کلید یک‌پل برای دو چراغ راهرو هم‌زمان',
    kidPrompt: 'راهرو طولانیه! کلید یک‌پل رو طوری سیم‌کشی کن که با یک کلید، هر دو چراغ سقفی راهرو با هم روشن بشن!',
    scienceTip: 'می‌توان خروجی یک کلید یک‌پل را به شکل موازی به دو یا چند چراغ سقفی وصل کرد.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 62 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 42, y: 68 },
      { slotId: 'l1', partKind: 'ceiling_lamp', customLabel: 'چراغ اول راهرو', x: 64, y: 24 },
      { slotId: 'l2', partKind: 'ceiling_lamp', customLabel: 'چراغ دوم راهرو', x: 86, y: 24 },
    ],
    targetLoads: ['l1', 'l2'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'l2', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'l2', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'حمام استاندارد: هم چراغ روشن بشه هم هواکش!',
    kidPrompt: 'کلید حمام رو طوری وصل کن که وقتی روشنش می‌کنیم، هم چراغ روشن بشه و هم هواکش بخار رو ببره بیرون!',
    scienceTip: 'در بسیاری از سرویس‌ها هواکش به همراه چراغ با یک کلید به صورت موازی کار می‌کند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 62 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 44, y: 68 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 66, y: 25 },
      { slotId: 'fan', partKind: 'exhaust_fan', x: 86, y: 42 },
    ],
    targetLoads: ['lamp', 'fan'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'fan', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'fan', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'تنظیم نور اتاق پذیرایی با دیمر دیواری',
    kidPrompt: 'به جای کلید معمولی، یک دیمر چرخشی دیواری سر راه لوستر پذیرایی نصب کن!',
    scienceTip: 'دیمر دیواری دقیقاً مثل کلید یک‌پل در مسیر سیم فاز بسته می‌شود.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 55 },
      { slotId: 'dim', partKind: 'dimmer_knob', customLabel: 'دیمر دیواری', x: 50, y: 68 },
      { slotId: 'lamp', partKind: 'chandelier_dual', customLabel: 'لوستر پذیرایی', x: 78, y: 26 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'dim', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'dim', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'چراغ سردر حیاط با فتوسل اتوماتیک و فیوز',
    kidPrompt: 'برق چراغ سردر خونه رو از فیوز به سنسور شب (فتوسل) بده تا شب‌ها خودبه‌خود کوچه رو روشن کنه!',
    scienceTip: 'فتوسل سر راه فاز قرار می‌گیرد و نقش یک کلید خودکار نوری را بازی می‌کند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 58 },
      { slotId: 'sen', partKind: 'light_sensor', customLabel: 'فتوسل حیاط', x: 50, y: 30 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', customLabel: 'چراغ سردر', x: 80, y: 30 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sen', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sen', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'آزمون پایان فصل ۷: اتاق استاندارد کلیددار',
    kidPrompt: 'فیوز، جعبه تقسیم، کلید یک‌پل و لوستر رو کامل سیم‌کشی کن و روشنش کن!',
    scienceTip: 'آفرین! حالا کاملاً آماده نصب پریز برق و کلید دوپل هستی!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 60 },
      { slotId: 'jbox', partKind: 'junction_box', x: 46, y: 26 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 46, y: 70 },
      { slotId: 'lamp', partKind: 'chandelier_dual', x: 80, y: 26 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'jbox', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'jbox', fromTerm: 'out', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },

  // ================= CHAPTER 8 (71-80): Wall Outlets, Plugs & Double Switches =================
  {
    title: 'نصب اولین پریز برق دیواری + دوشاخه چراغ خواب!',
    kidPrompt: 'بیا پریز برق نصب کنیم! سیم فاز قرمز و نول آبی رو از فیوز به دو پیچ پریز وصل کن، فیوز رو بزن بالا و بعد دوشاخه چراغ خواب رو بزن به پریز!',
    scienceTip: 'برخلاف کلید که فقط فاز می‌گیرد، پریز برق مستقیماً به هر دو سیم فاز (قرمز) و نول (آبی) وصل می‌شود تا به دوشاخه وسایل برق بدهد!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    pluggableAppliance: 'bedside_lamp',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 20, y: 48 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 58, y: 62 },
    ],
    targetLoads: ['out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'پریز برق اتاق برای پنکه ایستاده',
    kidPrompt: 'پریز برق رو با رعایت ایمنی فیوز سیم‌کشی کن و دوشاخه پنکه ایستاده رو توی پریز بزن تا بچرخه!',
    scienceTip: 'هر وقت دوشاخه پنکه را داخل پریز می‌زنی، دو شاخک فلزی آن به فاز و نول داخل پریز وصل می‌شوند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    pluggableAppliance: 'table_fan',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 20, y: 48 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 58, y: 62 },
    ],
    targetLoads: ['out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'پریز برق آشپزخانه برای مخلوط‌کن میوه',
    kidPrompt: 'از فیوز و جعبه تقسیم به پریز آشپزخانه سیم بکش، بعد دوشاخه مخلوط‌کن رو بزن تا آبمیوه درست بشه!',
    scienceTip: 'پریزهای آشپزخانه از طریق جعبه تقسیم با سیم‌های قوی به تابلو فیوز وصل می‌شوند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    pluggableAppliance: 'blender',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 56 },
      { slotId: 'jbox', partKind: 'junction_box', x: 44, y: 26 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 64 },
    ],
    targetLoads: ['out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'jbox', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'jbox', fromTerm: 'out', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'پریز تلویزیون اتاق کودک',
    kidPrompt: 'پریز دیوار تلویزیون رو سیم‌کشی کن و دوشاخه تلویزیون کارتون رو بهش وصل کن!',
    scienceTip: 'فیوز مینیاتوری از تلویزیون در برابر نوسان و اتصال کوتاه محافظت می‌کند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    pluggableAppliance: 'television',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 18, y: 52 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 58, y: 62 },
    ],
    targetLoads: ['out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب دو پریز برق موازی در یک اتاق',
    kidPrompt: 'دو تا پریز برق رو موازی به فیوز وصل کن و دوشاخه چراغ ستاره‌ای رو بزن به پریز!',
    scienceTip: 'پریزهای یک اتاق به صورت موازی از هم انشعاب می‌گیرند تا همه ۲۲۰ ولت یکسان داشته باشند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    pluggableAppliance: 'night_star',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 52 },
      { slotId: 'out1', partKind: 'wall_outlet', customLabel: 'پریز اول', x: 46, y: 64 },
      { slotId: 'out2', partKind: 'wall_outlet', customLabel: 'پریز دوم', x: 74, y: 64 },
    ],
    targetLoads: ['out1', 'out2'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'in', toSlot: 'out2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out2', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب کلید دوپل دیواری (دو چراغ مجزا با یک کلید دو دکمه!)',
    kidPrompt: 'کلید دوپل دو تا دکمه داره! یک فاز مشترک بهش بده و دو تا خروجی جدا برای چراغ اول و چراغ دوم بکش!',
    scienceTip: 'کلید دوپل یک ورودی فاز مشترک دارد و دو خروجی مستقل می‌دهد تا دو چراغ را جداگانه روشن و خاموش کنی!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 60 },
      { slotId: 'sw2', partKind: 'wall_switch_2', x: 44, y: 68 },
      { slotId: 'l1', partKind: 'ceiling_lamp', customLabel: 'چراغ پذیرایی', x: 64, y: 24 },
      { slotId: 'l2', partKind: 'chandelier_dual', customLabel: 'لوستر وسط', x: 86, y: 24 },
    ],
    targetLoads: ['l1', 'l2'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw2', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw2', fromTerm: 'out2', toSlot: 'l2', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'l2', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'کلید دوپل برای چراغ و هواکش جداگانه',
    kidPrompt: 'با کلید دوپل کاری کن که دکمه اول چراغ رو روشن کنه و دکمه دوم هواکش رو راه بندازه!',
    scienceTip: 'با کلید دوپل دیگر لازم نیست هواکش همیشه با چراغ روشن بماند؛ هر کدام دکمه خودش را دارد!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 16, y: 60 },
      { slotId: 'sw2', partKind: 'wall_switch_2', x: 44, y: 68 },
      { slotId: 'l1', partKind: 'ceiling_lamp', x: 64, y: 24 },
      { slotId: 'fan', partKind: 'exhaust_fan', x: 86, y: 34 },
    ],
    targetLoads: ['l1', 'fan'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw2', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw2', fromTerm: 'out2', toSlot: 'fan', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'fan', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نصب کلید و پریز کنار هم روی دیوار اتاق!',
    kidPrompt: 'حالا مثل یک اوستا برق‌کار واقعی، هم کلید چراغ سقفی و هم پریز برق چراغ خواب رو کنار هم نصب کن!',
    scienceTip: 'در قاب‌های دوقلوی روی دیوار، کلید فقط فاز را قطع و وصل می‌کند، اما پریز هم فاز دائم و هم نول دارد!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'bedside_lamp',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 54 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 40, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 68 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 76, y: 22 },
    ],
    targetLoads: ['lamp', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'میز آرایش: کلید چراغ آینه + پریز سشوار',
    kidPrompt: 'کلید چراغ بالای آینه و پریز برق سشوار رو هم‌زمان سیم‌کشی کن و سشوار رو به پریز بزن!',
    scienceTip: 'می‌توانیم سیم فاز را از پیچ ورودی کلید به پیچ فاز پریز کنارش پل (انشعاب) بزنیم، ولی نول حتماً جداگانه به پریز می‌آید.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'hair_dryer',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 54 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 40, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 68 },
      { slotId: 'lamp', partKind: 'chandelier_dual', customLabel: 'چراغ آینه', x: 76, y: 22 },
    ],
    targetLoads: ['lamp', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'in', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'آزمون پایان فصل ۸: آشپزخانه با کلید هواکش و پریز مخلوط‌کن',
    kidPrompt: 'هم کلید هواکش و هم پریز مخلوط‌کن آشپزخانه رو کامل سیم‌کشی و راه‌اندازی کن!',
    scienceTip: 'فوق‌العاده‌ای! حالا نصب کلید یک‌پل، دوپل، پریز و دوشاخه رو کاملاً یاد گرفتی!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'blender',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 54 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 40, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 68 },
      { slotId: 'fan', partKind: 'exhaust_fan', x: 76, y: 24 },
    ],
    targetLoads: ['fan', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'fan', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'fan', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },

  // ================= CHAPTER 9 (81-90): Master Electrician! Staircase Switches & Full Smart Rooms =================
  {
    title: 'جادوی کلید تبدیل راه‌پله! (کنترل یک چراغ از دو طبقه)',
    kidPrompt: 'کلید تبدیل پایین پله و کلید تبدیل بالای پله رو با سیم‌های رابط به هم وصل کن تا از هر دو جا بشه چراغ رو روشن کرد!',
    scienceTip: 'در کلید تبدیل، دو سیم رابط بین کلید طبقه اول و طبقه دوم کشیده می‌شود تا از پایین روشن و از بالا خاموش کنیم!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 56 },
      { slotId: 'sa', partKind: 'stair_switch_a', customLabel: 'کلید پایین پله', x: 38, y: 70 },
      { slotId: 'sb', partKind: 'stair_switch_b', customLabel: 'کلید بالای پله', x: 66, y: 70 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', customLabel: 'چراغ راه‌پله', x: 82, y: 24 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sa', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sa', fromTerm: 'out', toSlot: 'sb', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sb', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'کلید تبدیل تخت‌خواب (دم در اتاق و کنار تخت)',
    kidPrompt: 'کلید دم در اتاق و کلید بالای تخت رو طوری ببند که بدون بلند شدن از تخت بتونی لوستر رو کنترل کنی!',
    scienceTip: 'از کلید تبدیل علاوه بر راه‌پله، در اتاق خواب‌ها هم کنار تخت و کنار در ورودی استفاده می‌کنند!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 56 },
      { slotId: 'sa', partKind: 'stair_switch_a', customLabel: 'کلید ورودی اتاق', x: 38, y: 70 },
      { slotId: 'sb', partKind: 'stair_switch_b', customLabel: 'کلید کنار تخت', x: 66, y: 70 },
      { slotId: 'lamp', partKind: 'chandelier_dual', x: 82, y: 24 },
    ],
    targetLoads: ['lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sa', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sa', fromTerm: 'out', toSlot: 'sb', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sb', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'ورودی ویلا: زنگ در + چراغ هوشمند شب',
    kidPrompt: 'در ورودی خانه، هم شستی زنگ مهمان رو وصل کن و هم سنسور فتوسل چراغ سردر رو!',
    scienceTip: 'از یک تابلو فیوز می‌توان چند مدار مستقل (مدار زنگ و مدار روشنایی حیاط) را تغذیه کرد.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 56 },
      { slotId: 'btn', partKind: 'push_button', customLabel: 'شستی زنگ', x: 40, y: 70 },
      { slotId: 'sen', partKind: 'light_sensor', customLabel: 'فتوسل حیاط', x: 40, y: 28 },
      { slotId: 'bell', partKind: 'doorbell_chime', x: 78, y: 68 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 78, y: 24 },
    ],
    targetLoads: ['bell', 'lamp'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'btn', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'btn', fromTerm: 'out', toSlot: 'bell', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'bell', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sen', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sen', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'نشیمن رویایی: کلید دوپل لوستر + پریز تلویزیون',
    kidPrompt: 'در اتاق نشیمن، کلید دوپل رو به دو چراغ سقفی وصل کن و پریز تلویزیون رو هم برق‌دار کن!',
    scienceTip: 'در برق‌کشی حرفه‌ای، خط روشنایی و خط پریز منظم و تفکیک‌شده سیم‌کشی می‌شوند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'television',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 13, y: 56 },
      { slotId: 'sw2', partKind: 'wall_switch_2', x: 38, y: 70 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 70 },
      { slotId: 'l1', partKind: 'ceiling_lamp', x: 58, y: 22 },
      { slotId: 'l2', partKind: 'chandelier_dual', x: 84, y: 22 },
    ],
    targetLoads: ['l1', 'l2', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw2', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw2', fromTerm: 'out2', toSlot: 'l2', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'l2', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'آشپزخانه مدرن: کلید دوپل (چراغ و هواکش) + پریز مخلوط‌کن',
    kidPrompt: 'تمام برق آشپزخانه با توست! کلید دوپل چراغ و هواکش و پریز مخلوط‌کن رو کامل ببند!',
    scienceTip: 'سیم‌کشی اصولی آشپزخانه باعث می‌شود همه دستگاه‌ها امن و پرقدرت کار کنند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'blender',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 13, y: 56 },
      { slotId: 'sw2', partKind: 'wall_switch_2', x: 38, y: 70 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 70 },
      { slotId: 'l1', partKind: 'ceiling_lamp', x: 58, y: 22 },
      { slotId: 'fan', partKind: 'exhaust_fan', x: 84, y: 24 },
    ],
    targetLoads: ['l1', 'fan', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw2', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw2', fromTerm: 'out2', toSlot: 'fan', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'fan', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'اتاق مطالعه با دیمر روشنایی و پریز پنکه',
    kidPrompt: 'در اتاق مطالعه، دیمر چرخشی رو به چراغ سقفی وصل کن و پریز پنکه خنک‌کننده رو هم راه بنداز!',
    scienceTip: 'پریز همیشه باید قبل از دیمر برق مستقیم بگیرد تا ولتاژ پنکه کم نشود!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'table_fan',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 54 },
      { slotId: 'dim', partKind: 'dimmer_knob', x: 40, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 68 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 76, y: 22 },
    ],
    targetLoads: ['lamp', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'dim', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'dim', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'خانه سبز با پنل خورشیدی پشت‌بام و کلید و پریز!',
    kidPrompt: 'انرژی پاک خورشید پشت‌بام رو بیار توی اتاق: هم کلید چراغ سقف و هم پریز چراغ خواب ستاره‌ای رو روشن کن!',
    scienceTip: 'خانه‌های مدرن با پنل خورشیدی روی بام، برق روشنایی و پریزهای خانه را رایگان از آفتاب می‌گیرند!',
    boardTheme: 'wall',
    requiresSwitchToggle: true,
    pluggableAppliance: 'night_star',
    slots: [
      { slotId: 'src', partKind: 'solar_panel', customLabel: 'پنل خورشیدی بام', x: 15, y: 32 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 42, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 66, y: 68 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 78, y: 22 },
    ],
    targetLoads: ['lamp', 'out1'],
    hintWires: [
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'src', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'src', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'کارگاه اختراعات دانشمند کوچولو (آهنربا + پریز برق)',
    kidPrompt: 'در کارگاهت هم آهنربای الکتریکی رو با کلید راه بنداز و هم پریز ابزار برقی رو فعال کن!',
    scienceTip: 'در کارگاه‌های مهندسی هم مدارهای کنترل و هم پریزهای تغذیه کنار هم کار می‌کنند.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'table_fan',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 14, y: 54 },
      { slotId: 'sw1', partKind: 'wall_switch_1', x: 40, y: 68 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 64, y: 68 },
      { slotId: 'mag', partKind: 'electromagnet', x: 76, y: 24 },
    ],
    targetLoads: ['mag', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw1', fromTerm: 'out', toSlot: 'mag', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'mag', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'اتاق هوشمند شبانه (فتوسل + جعبه تقسیم + پریز)',
    kidPrompt: 'از فیوز به جعبه تقسیم برو؛ چراغ شب رو با فتوسل هوشمند کن و پریز چراغ خواب رو برق‌دار کن!',
    scienceTip: 'جعبه تقسیم قلب نظم سیم‌کشی ساختمان است.',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'bedside_lamp',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 13, y: 56 },
      { slotId: 'jbox', partKind: 'junction_box', x: 38, y: 26 },
      { slotId: 'sen', partKind: 'light_sensor', x: 60, y: 26 },
      { slotId: 'lamp', partKind: 'ceiling_lamp', x: 84, y: 26 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 56, y: 70 },
    ],
    targetLoads: ['lamp', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'jbox', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'jbox', fromTerm: 'out', toSlot: 'sen', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'jbox', fromTerm: 'out', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sen', fromTerm: 'out', toSlot: 'lamp', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'lamp', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
  {
    title: 'پروژه بزرگ مرحله ۹۰: جشن فارغ‌التحصیلی مهندس ارشد برق!',
    kidPrompt: 'افتخار آزمایشگاه! تابلو فیوز، کلید دوپل برای لوستر و ربات جشن، به همراه پریز تلویزیون رو کامل سیم‌کشی کن تا جشن قهرمانی شروع بشه!',
    scienceTip: 'هورااا! تو از وصل کردن یک آرمیچر کوچک به باتری شروع کردی و حالا برق‌کشی کامل کلید و پریز و تابلو فیوز یک خانه را بلدی!',
    boardTheme: 'wall',
    requiresBreakerSafety: true,
    requiresSwitchToggle: true,
    pluggableAppliance: 'television',
    slots: [
      { slotId: 'brk', partKind: 'mcb_breaker', x: 12, y: 56 },
      { slotId: 'sw2', partKind: 'wall_switch_2', x: 36, y: 70 },
      { slotId: 'out1', partKind: 'wall_outlet', x: 62, y: 70 },
      { slotId: 'l1', partKind: 'chandelier_dual', customLabel: 'لوستر جشن', x: 56, y: 22 },
      { slotId: 'bot', partKind: 'robot_buddy', customLabel: 'ربات قهرمان', x: 84, y: 26 },
    ],
    targetLoads: ['l1', 'bot', 'out1'],
    hintWires: [
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'sw2', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'sw2', fromTerm: 'out', toSlot: 'l1', toTerm: 'in', wireColor: '#f59e0b' },
      { fromSlot: 'sw2', fromTerm: 'out2', toSlot: 'bot', toTerm: 'in', wireColor: '#a855f7' },
      { fromSlot: 'l1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'bot', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
      { fromSlot: 'brk', fromTerm: 'pos', toSlot: 'out1', toTerm: 'in', wireColor: '#ef4444' },
      { fromSlot: 'out1', fromTerm: 'out', toSlot: 'brk', toTerm: 'neg', wireColor: '#3b82f6' },
    ],
  },
];

export const ELECTRIC_LEVELS: ElectricLevel[] = BLUEPRINTS.map((bp, index) => {
  const num = index + 1;
  const chapter = Math.ceil(num / 10);
  return {
    id: `elec-${num}`,
    lab: 'electric',
    number: num,
    chapter,
    chapterTitle: CHAPTER_TITLES[chapter],
    ...bp,
  };
});

#!/usr/bin/env python3
"""Generates ultra-crisp 3D-shaded illustrated SVG world banners for the 7 new Academy worlds."""
import pathlib

ASSETS = pathlib.Path(__file__).resolve().parent.parent / "public" / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

BANNERS = {
    "world-math.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="card1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <linearGradient id="card2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="card3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bg)"/>
  <rect width="640" height="320" fill="url(#glow)"/>
  <g opacity="0.22" stroke="#99f6e4" stroke-width="1">
    <line x1="0" y1="80" x2="640" y2="80"/><line x1="0" y1="160" x2="640" y2="160"/><line x1="0" y1="240" x2="640" y2="240"/>
    <line x1="160" y1="0" x2="160" y2="320"/><line x1="320" y1="0" x2="320" y2="320"/><line x1="480" y1="0" x2="480" y2="320"/>
  </g>
  <!-- 3D Number Blocks ۱ ۲ ۳ -->
  <g transform="translate(105,68) rotate(-8)">
    <rect width="115" height="135" rx="28" fill="#881337" y="10"/>
    <rect width="115" height="135" rx="28" fill="url(#card1)" stroke="#fff" stroke-width="4"/>
    <ellipse cx="35" cy="26" rx="18" ry="8" fill="#fff" opacity="0.35"/>
    <text x="57" y="98" font-size="78" font-family="Tahoma, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">۱</text>
  </g>
  <g transform="translate(262,48)">
    <rect width="122" height="145" rx="30" fill="#78350f" y="10"/>
    <rect width="122" height="145" rx="30" fill="url(#card2)" stroke="#fff" stroke-width="4"/>
    <ellipse cx="38" cy="26" rx="20" ry="8" fill="#fff" opacity="0.4"/>
    <text x="61" y="106" font-size="84" font-family="Tahoma, sans-serif" font-weight="900" fill="#0f172a" text-anchor="middle">۲</text>
  </g>
  <g transform="translate(425,68) rotate(8)">
    <rect width="115" height="135" rx="28" fill="#0c4a6e" y="10"/>
    <rect width="115" height="135" rx="28" fill="url(#card3)" stroke="#fff" stroke-width="4"/>
    <ellipse cx="35" cy="26" rx="18" ry="8" fill="#fff" opacity="0.35"/>
    <text x="57" y="98" font-size="78" font-family="Tahoma, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">۳</text>
  </g>
  <!-- Abacus & Apples Bottom Row -->
  <rect x="140" y="238" width="360" height="16" rx="8" fill="#fde68a" opacity="0.9"/>
  <circle cx="195" cy="246" r="20" fill="#ef4444" stroke="#fff" stroke-width="3"/>
  <circle cx="248" cy="246" r="20" fill="#f97316" stroke="#fff" stroke-width="3"/>
  <circle cx="301" cy="246" r="20" fill="#eab308" stroke="#fff" stroke-width="3"/>
  <circle cx="354" cy="246" r="20" fill="#22c55e" stroke="#fff" stroke-width="3"/>
  <circle cx="407" cy="246" r="20" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
  <circle cx="460" cy="246" r="20" fill="#a855f7" stroke="#fff" stroke-width="3"/>
  <text x="68" y="268" font-size="48">🍎</text>
  <text x="532" y="268" font-size="48">🚂</text>
  <text x="58" y="62" font-size="32">⭐</text>
  <text x="556" y="58" font-size="34">✨</text>
</svg>""",

    "world-persian.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgP" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="52%" stop-color="#9d174d"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <radialGradient id="glowP" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fde047" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgP)"/>
  <rect width="640" height="320" fill="url(#glowP)"/>
  <!-- Open Magical Book -->
  <path d="M120,255 Q220,230 320,258 Q420,230 520,255 L540,278 Q420,255 320,282 Q220,255 100,278 Z" fill="#fef3c7" stroke="#f59e0b" stroke-width="4"/>
  <path d="M132,245 Q224,218 320,248 L320,165 Q224,142 132,168 Z" fill="#fffbeb" stroke="#fcd34d" stroke-width="3"/>
  <path d="M508,245 Q416,218 320,248 L320,165 Q416,142 508,168 Z" fill="#fffbeb" stroke="#fcd34d" stroke-width="3"/>
  <!-- Floating 3D Persian Alphabet Tiles آ ب پ ت -->
  <g transform="translate(92,50) rotate(-9)">
    <rect width="102" height="112" rx="24" y="8" fill="#065f46"/>
    <rect width="102" height="112" rx="24" fill="#10b981" stroke="#fff" stroke-width="4"/>
    <text x="51" y="82" font-size="68" font-family="Tahoma, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">آ</text>
  </g>
  <g transform="translate(212,34) rotate(-3)">
    <rect width="104" height="114" rx="24" y="8" fill="#92400e"/>
    <rect width="104" height="114" rx="24" fill="#f59e0b" stroke="#fff" stroke-width="4"/>
    <text x="52" y="80" font-size="66" font-family="Tahoma, sans-serif" font-weight="900" fill="#0f172a" text-anchor="middle">ب</text>
  </g>
  <g transform="translate(332,34) rotate(4)">
    <rect width="104" height="114" rx="24" y="8" fill="#1e40af"/>
    <rect width="104" height="114" rx="24" fill="#38bdf8" stroke="#fff" stroke-width="4"/>
    <text x="52" y="78" font-size="64" font-family="Tahoma, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">پ</text>
  </g>
  <g transform="translate(450,52) rotate(9)">
    <rect width="102" height="112" rx="24" y="8" fill="#831843"/>
    <rect width="102" height="112" rx="24" fill="#f472b6" stroke="#fff" stroke-width="4"/>
    <text x="51" y="80" font-size="64" font-family="Tahoma, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">ش</text>
  </g>
  <text x="55" y="255" font-size="46">🍎</text>
  <text x="545" y="255" font-size="46">🦋</text>
  <text x="304" y="222" font-size="34">✨</text>
</svg>""",

    "world-english.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgE" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c4a6e"/>
      <stop offset="50%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <radialGradient id="glowE" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgE)"/>
  <rect width="640" height="320" fill="url(#glowE)"/>
  <!-- Smiling Earth Globe Center -->
  <circle cx="320" cy="196" r="88" fill="#0ea5e9" stroke="#bae6fd" stroke-width="5"/>
  <path d="M268,155 Q295,140 315,165 Q335,190 298,218 Q265,205 268,155 Z" fill="#22c55e"/>
  <path d="M345,145 Q385,155 378,198 Q356,225 338,195 Z" fill="#4ade80"/>
  <!-- 3D Toy Blocks A B C -->
  <g transform="translate(88,58) rotate(-10)">
    <rect width="110" height="118" rx="26" y="9" fill="#991b1b"/>
    <rect width="110" height="118" rx="26" fill="#ef4444" stroke="#fff" stroke-width="4"/>
    <text x="55" y="84" font-size="72" font-family="Arial Black, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">A</text>
  </g>
  <g transform="translate(265,24)">
    <rect width="110" height="118" rx="26" y="9" fill="#92400e"/>
    <rect width="110" height="118" rx="26" fill="#facc15" stroke="#fff" stroke-width="4"/>
    <text x="55" y="84" font-size="72" font-family="Arial Black, sans-serif" font-weight="900" fill="#0f172a" text-anchor="middle">B</text>
  </g>
  <g transform="translate(442,58) rotate(10)">
    <rect width="110" height="118" rx="26" y="9" fill="#065f46"/>
    <rect width="110" height="118" rx="26" fill="#10b981" stroke="#fff" stroke-width="4"/>
    <text x="55" y="84" font-size="72" font-family="Arial Black, sans-serif" font-weight="900" fill="#fff" text-anchor="middle">C</text>
  </g>
  <text x="115" y="268" font-size="50">🍎</text>
  <text x="478" y="268" font-size="50">🐱</text>
  <text x="555" y="55" font-size="34">🎈</text>
</svg>""",

    "world-logic.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgL)"/>
  <!-- Glowing Coding Grid Tiles -->
  <g transform="translate(95,188)">
    <rect x="0" y="0" width="96" height="72" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <text x="48" y="48" font-size="36" fill="#38bdf8" text-anchor="middle">➡️</text>
    <rect x="112" y="0" width="96" height="72" rx="16" fill="#1e293b" stroke="#a855f7" stroke-width="3"/>
    <text x="160" y="48" font-size="36" fill="#e879f9" text-anchor="middle">⬆️</text>
    <rect x="224" y="0" width="96" height="72" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <text x="272" y="48" font-size="36" fill="#38bdf8" text-anchor="middle">➡️</text>
    <rect x="336" y="0" width="108" height="72" rx="16" fill="#facc15" stroke="#fff" stroke-width="4"/>
    <text x="390" y="48" font-size="40" text-anchor="middle">⭐</text>
  </g>
  <!-- Cute 3D Programmable Kid Robot -->
  <g transform="translate(245,28)">
    <line x1="75" y1="0" x2="75" y2="24" stroke="#38bdf8" stroke-width="6"/>
    <circle cx="75" cy="8" r="10" fill="#facc15"/>
    <rect x="20" y="24" width="110" height="92" rx="28" fill="#e2e8f0" stroke="#38bdf8" stroke-width="5"/>
    <rect x="36" y="44" width="78" height="44" rx="14" fill="#0f172a"/>
    <circle cx="57" cy="66" r="10" fill="#22d3ee"/>
    <circle cx="93" cy="66" r="10" fill="#22d3ee"/>
    <path d="M60,80 Q75,90 90,80" stroke="#4ade80" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="34" y="120" width="82" height="34" rx="14" fill="#38bdf8"/>
  </g>
  <text x="95" y="115" font-size="52">🧩</text>
  <text x="495" y="115" font-size="52">🧠</text>
</svg>""",

    "world-art.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4a044e"/>
      <stop offset="50%" stop-color="#be185d"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgA)"/>
  <!-- Rainbow Xylophone Bars -->
  <g transform="translate(335,62)">
    <rect x="0" y="10" width="34" height="185" rx="12" fill="#ef4444" stroke="#fff" stroke-width="3"/>
    <rect x="44" y="22" width="34" height="162" rx="12" fill="#f97316" stroke="#fff" stroke-width="3"/>
    <rect x="88" y="34" width="34" height="140" rx="12" fill="#facc15" stroke="#fff" stroke-width="3"/>
    <rect x="132" y="46" width="34" height="118" rx="12" fill="#22c55e" stroke="#fff" stroke-width="3"/>
    <rect x="176" y="58" width="34" height="96" rx="12" fill="#38bdf8" stroke="#fff" stroke-width="3"/>
    <rect x="220" y="70" width="34" height="76" rx="12" fill="#a855f7" stroke="#fff" stroke-width="3"/>
  </g>
  <!-- 3D Geometric Shapes & Palette -->
  <circle cx="118" cy="105" r="46" fill="#38bdf8" stroke="#fff" stroke-width="4"/>
  <polygon points="235,52 182,148 288,148" fill="#facc15" stroke="#fff" stroke-width="4"/>
  <rect x="88" y="178" width="88" height="88" rx="18" fill="#22c55e" stroke="#fff" stroke-width="4"/>
  <text x="206" y="248" font-size="68">🎨</text>
  <text x="548" y="58" font-size="38">🎵</text>
</svg>""",

    "world-world.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgW" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="52%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgW)"/>
  <!-- Stars & Ringed Planet Saturn -->
  <circle cx="485" cy="95" r="46" fill="#f59e0b"/>
  <ellipse cx="485" cy="95" rx="86" ry="20" fill="none" stroke="#fde68a" stroke-width="8" transform="rotate(-18 485 95)"/>
  <circle cx="120" cy="64" r="32" fill="#facc15"/>
  <!-- Green Hills & Ocean Bottom -->
  <path d="M0,235 Q180,175 360,235 T640,225 L640,320 L0,320 Z" fill="#15803d"/>
  <path d="M310,255 Q475,215 640,255 L640,320 L310,320 Z" fill="#0284c7"/>
  <text x="82" y="255" font-size="74">🦁</text>
  <text x="205" y="268" font-size="64">🐘</text>
  <text x="315" y="152" font-size="68">🚀</text>
  <text x="425" y="285" font-size="64">🐬</text>
  <text x="532" y="275" font-size="58">🚒</text>
</svg>""",

    "world-lifeskills.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">
  <defs>
    <linearGradient id="bgS" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#065f46"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#bgS)"/>
  <!-- Friendly Traffic Light -->
  <rect x="276" y="34" width="88" height="212" rx="32" fill="#1e293b" stroke="#facc15" stroke-width="5"/>
  <circle cx="320" cy="82" r="24" fill="#ef4444"/>
  <circle cx="320" cy="140" r="24" fill="#facc15"/>
  <circle cx="320" cy="198" r="24" fill="#22c55e"/>
  <rect x="310" y="246" width="20" height="54" fill="#64748b"/>
  <!-- Healthy Habits & Seasons Icons -->
  <circle cx="135" cy="108" r="54" fill="#ffffff" fill-opacity="0.14" stroke="#7dd3fc" stroke-width="3"/>
  <text x="135" y="128" font-size="58" text-anchor="middle">🪥</text>
  <circle cx="135" cy="232" r="50" fill="#ffffff" fill-opacity="0.14" stroke="#86efac" stroke-width="3"/>
  <text x="135" y="250" font-size="54" text-anchor="middle">🥦</text>
  <circle cx="505" cy="108" r="54" fill="#ffffff" fill-opacity="0.14" stroke="#fde047" stroke-width="3"/>
  <text x="505" y="128" font-size="58" text-anchor="middle">☀️</text>
  <circle cx="505" cy="232" r="50" fill="#ffffff" fill-opacity="0.14" stroke="#f9a8d4" stroke-width="3"/>
  <text x="505" y="250" font-size="54" text-anchor="middle">❤️</text>
</svg>""",
}

for name, svg in BANNERS.items():
    (ASSETS / name).write_text(svg, encoding="utf-8")
    print(f"Wrote {name}")

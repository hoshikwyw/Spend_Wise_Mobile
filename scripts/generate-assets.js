const sharp = require("sharp");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "assets");

// App icon SVG (1024x1024 base)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#A78BFA"/>
    </linearGradient>
    <linearGradient id="coin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <circle cx="850" cy="150" r="130" fill="white" opacity="0.07"/>
  <circle cx="150" cy="880" r="100" fill="white" opacity="0.05"/>
  <!-- Wallet -->
  <rect x="180" y="350" width="664" height="430" rx="80" fill="white"/>
  <path d="M180 440 L180 380 C180 320 230 275 296 275 L728 275 C794 275 844 320 844 380 L844 440" fill="white" stroke="#E9E0FF" stroke-width="6"/>
  <line x1="240" y1="446" x2="560" y2="446" stroke="#DDD6FE" stroke-width="6" stroke-linecap="round" stroke-dasharray="16 12"/>
  <rect x="640" y="510" width="176" height="136" rx="44" fill="#8B5CF6" opacity="0.12"/>
  <circle cx="728" cy="578" r="28" fill="#8B5CF6" opacity="0.3"/>
  <!-- Card -->
  <rect x="232" y="520" width="296" height="188" rx="28" fill="#F9F7FF" stroke="#E9E0FF" stroke-width="4"/>
  <rect x="268" y="556" width="108" height="18" rx="9" fill="#C4B5FD"/>
  <rect x="268" y="590" width="172" height="14" rx="7" fill="#DDD6FE"/>
  <rect x="268" y="618" width="128" height="14" rx="7" fill="#EDE9FE"/>
  <!-- Coin big -->
  <circle cx="764" cy="210" r="100" fill="url(#coin)" stroke="#D97706" stroke-width="6"/>
  <circle cx="764" cy="210" r="78" fill="none" stroke="#D97706" stroke-width="3" opacity="0.3"/>
  <text x="764" y="245" text-anchor="middle" font-size="96" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <!-- Coin small -->
  <circle cx="276" cy="224" r="66" fill="url(#coin)" stroke="#D97706" stroke-width="4"/>
  <text x="276" y="252" text-anchor="middle" font-size="62" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <!-- Sparkles -->
  <g fill="white" opacity="0.75">
    <path d="M916 390 L924 414 L948 422 L924 430 L916 454 L908 430 L884 422 L908 414 Z"/>
    <path d="M140 560 L146 576 L162 582 L146 588 L140 604 L134 588 L118 582 L134 576 Z"/>
  </g>
  <!-- Bottom text -->
  <text x="512" y="900" text-anchor="middle" font-size="72" font-weight="800" font-family="Arial" fill="white" opacity="0.95" letter-spacing="10">SPENDWISE</text>
</svg>`;

// Adaptive icon foreground (just the content, no background)
const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="coin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <!-- Wallet centered -->
  <rect x="230" y="330" width="564" height="380" rx="70" fill="white"/>
  <path d="M230 400 L230 360 C230 310 270 275 320 275 L704 275 C754 275 794 310 794 360 L794 400" fill="white" stroke="#E9E0FF" stroke-width="5"/>
  <rect x="600" y="470" width="150" height="110" rx="36" fill="#8B5CF6" opacity="0.12"/>
  <circle cx="675" cy="525" r="22" fill="#8B5CF6" opacity="0.3"/>
  <!-- Card -->
  <rect x="280" y="478" width="240" height="150" rx="22" fill="#F9F7FF" stroke="#E9E0FF" stroke-width="3"/>
  <rect x="308" y="508" width="90" height="14" rx="7" fill="#C4B5FD"/>
  <rect x="308" y="534" width="140" height="10" rx="5" fill="#DDD6FE"/>
  <!-- Coin -->
  <circle cx="700" cy="230" r="80" fill="url(#coin)" stroke="#D97706" stroke-width="5"/>
  <text x="700" y="260" text-anchor="middle" font-size="76" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <circle cx="310" cy="250" r="52" fill="url(#coin)" stroke="#D97706" stroke-width="3"/>
  <text x="310" y="272" text-anchor="middle" font-size="48" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <!-- Sparkle -->
  <g fill="white" opacity="0.7">
    <path d="M840 360 L846 378 L864 384 L846 390 L840 408 L834 390 L816 384 L834 378 Z"/>
  </g>
</svg>`;

// Splash screen SVG
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="coin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <!-- Wallet -->
  <rect x="100" y="160" width="312" height="210" rx="38" fill="white"/>
  <path d="M100 210 L100 185 C100 158 122 138 152 138 L360 138 C390 138 412 158 412 185 L412 210" fill="white" stroke="#E9E0FF" stroke-width="3"/>
  <rect x="320" y="240" width="80" height="60" rx="20" fill="#8B5CF6" opacity="0.12"/>
  <circle cx="360" cy="270" r="12" fill="#8B5CF6" opacity="0.3"/>
  <!-- Card -->
  <rect x="130" y="248" width="130" height="82" rx="12" fill="#F9F7FF" stroke="#E9E0FF" stroke-width="2"/>
  <rect x="146" y="265" width="48" height="7" rx="3.5" fill="#C4B5FD"/>
  <rect x="146" y="280" width="76" height="5" rx="2.5" fill="#DDD6FE"/>
  <!-- Coin -->
  <circle cx="370" cy="115" r="44" fill="url(#coin)" stroke="#D97706" stroke-width="3"/>
  <text x="370" y="130" text-anchor="middle" font-size="42" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <circle cx="155" cy="125" r="28" fill="url(#coin)" stroke="#D97706" stroke-width="2"/>
  <text x="155" y="136" text-anchor="middle" font-size="26" font-weight="bold" font-family="Arial" fill="#92400E">S</text>
  <!-- Text -->
  <text x="256" y="430" text-anchor="middle" font-size="32" font-weight="800" font-family="Arial" fill="white" letter-spacing="4">SPENDWISE</text>
  <text x="256" y="458" text-anchor="middle" font-size="12" font-weight="600" font-family="Arial" fill="white" opacity="0.5" letter-spacing="3">CUTE TRACKER</text>
</svg>`;

async function generate() {
  // App icon (1024x1024)
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, "icon.png"));
  console.log("Created icon.png (1024x1024)");

  // Adaptive icon foreground (1024x1024)
  await sharp(Buffer.from(adaptiveSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, "adaptive-icon.png"));
  console.log("Created adaptive-icon.png (1024x1024)");

  // Splash icon (512x512 on transparent)
  await sharp(Buffer.from(splashSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(assetsDir, "splash-icon.png"));
  console.log("Created splash-icon.png (512x512)");

  // Favicon (48x48)
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(assetsDir, "favicon.png"));
  console.log("Created favicon.png (48x48)");

  console.log("\nAll assets generated!");
}

generate().catch(console.error);

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, '..', 'public', 'images', 'games');
const promoDir = path.join(__dirname, '..', 'public', 'images', 'promos');
if (!fs.existsSync(gameDir)) fs.mkdirSync(gameDir, { recursive: true });
if (!fs.existsSync(promoDir)) fs.mkdirSync(promoDir, { recursive: true });

// 1. Steam Wallet High-Res SVG Card
const steamSvg = `<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="steamBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101822"/>
      <stop offset="50%" stop-color="#1b2838"/>
      <stop offset="100%" stop-color="#0e141b"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#66c0f4"/>
      <stop offset="100%" stop-color="#1999e3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#steamBg)" rx="36"/>
  
  <!-- Subtle tech grid -->
  <circle cx="400" cy="420" r="280" fill="none" stroke="rgba(102,192,244,0.08)" stroke-width="2"/>
  <circle cx="400" cy="420" r="200" fill="none" stroke="rgba(102,192,244,0.12)" stroke-width="2"/>

  <!-- Center Steam Piston Logo -->
  <g transform="translate(400, 420) scale(3.5)">
    <path d="M-0.2 -48 C26.3 -48 48 -26.3 48 0.2 C48 20.8 34.8 38.3 16.5 45 L-3 37 C-4.8 36.3 -6.3 35 -7.4 33.4 L-28.8 24.5 C-32 23.2 -34.8 20.8 -36.7 17.8 L-47 3 C-47.6 1.8 -48 0.5 -48 -0.8 C-48 -27.3 -26.7 -48 -0.2 -48 Z" fill="#ffffff"/>
    <circle cx="-0.2" cy="0.2" r="20" fill="#171a21"/>
    <circle cx="-0.2" cy="0.2" r="10" fill="#ffffff"/>
    <circle cx="-28" cy="22" r="12" fill="#ffffff"/>
    <circle cx="-28" cy="22" r="6" fill="#171a21"/>
  </g>

  <!-- Typography -->
  <text x="400" y="680" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="4">STEAM</text>
  <text x="400" y="740" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="700" fill="url(#accentGrad)" letter-spacing="8">WALLET IDR</text>
  
  <rect x="260" y="790" width="280" height="52" rx="26" fill="rgba(102,192,244,0.15)" stroke="rgba(102,192,244,0.4)" stroke-width="2"/>
  <text x="400" y="824" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#66c0f4">KODE RESMI VALVE</text>
</svg>`;

// 2. Valorant Official Visual SVG Card
const valorantSvg = `<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="valBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1923"/>
      <stop offset="60%" stop-color="#1b2329"/>
      <stop offset="100%" stop-color="#3b1d28"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#valBg)" rx="36"/>
  
  <!-- Geometric Tactical Lines -->
  <path d="M60 60 L740 60 L740 940 L60 940 Z" fill="none" stroke="rgba(255,70,85,0.15)" stroke-width="2"/>
  <text x="400" y="140" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="rgba(255,70,85,0.7)" letter-spacing="6">// TACTICAL SHOOTER</text>

  <!-- Valorant Official V Shape Logo -->
  <g transform="translate(400, 430) scale(4.8)">
    <path d="M-18 -26 L-3 -26 L18 10 L4 10 Z" fill="#ff4655"/>
    <path d="M-4 -8 L6 -26 L18 -26 L-4 26 L-18 26 Z" fill="#ffffff"/>
  </g>

  <!-- Typography -->
  <text x="400" y="680" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="10">VALORANT</text>
  <text x="400" y="735" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="700" fill="#ff4655" letter-spacing="6">RIOT GAMES</text>
  
  <rect x="250" y="790" width="300" height="52" rx="26" fill="rgba(255,70,85,0.18)" stroke="rgba(255,70,85,0.5)" stroke-width="2"/>
  <text x="400" y="824" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="700" fill="#ffffff">VALORANT POINTS (VP)</text>
</svg>`;

// 3. Telkomsel Official Red Brand SVG Card
const telkomselSvg = `<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tselBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ee2737"/>
      <stop offset="65%" stop-color="#c41624"/>
      <stop offset="100%" stop-color="#1e2f5c"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#tselBg)" rx="36"/>
  
  <!-- Interlocking Rings Pattern -->
  <g transform="translate(400, 420) scale(4)">
    <circle cx="-14" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="7"/>
    <circle cx="14" cy="0" r="22" fill="none" stroke="#ffcb05" stroke-width="7"/>
    <path d="M-14 -22 A22 22 0 0 1 14 0" fill="none" stroke="#ffffff" stroke-width="7"/>
  </g>

  <!-- Typography -->
  <text x="400" y="670" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="58" font-weight="900" fill="#ffffff" letter-spacing="2">Telkomsel</text>
  <text x="400" y="730" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="700" fill="#ffcb05" letter-spacing="6">PULSA &amp; KUOTA DATA</text>
  
  <rect x="240" y="785" width="320" height="52" rx="26" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
  <text x="400" y="818" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="19" font-weight="700" fill="#ffffff">SEMUA OPERATOR RESMI</text>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(gameDir, 'steam-wallet.svg'), steamSvg);
fs.writeFileSync(path.join(gameDir, 'valorant.svg'), valorantSvg);
fs.writeFileSync(path.join(gameDir, 'pulsa-telkomsel.svg'), telkomselSvg);

console.log('All vector SVG game assets generated successfully!');

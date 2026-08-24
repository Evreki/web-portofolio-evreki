const fs = require('fs');

const b64White = fs.readFileSync('foto/spider-emblem-white.png').toString('base64');
const dataUri = `data:image/png;base64,${b64White}`;

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="spiderBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E50914"/>
      <stop offset="60%" stop-color="#B00020"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>

  <!-- NeoBrutalist Hard Drop Shadow -->
  <rect x="6" y="6" width="56" height="56" rx="10" fill="#000000"/>

  <!-- Main Badge Box -->
  <rect x="2" y="2" width="56" height="56" rx="10" fill="url(#spiderBg)" stroke="#000000" stroke-width="3.5"/>

  <!-- Spider Web Matrix Lines -->
  <path d="M30 4 L30 56 M4 30 L56 30 M12 12 L48 48 M12 48 L48 12" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="30" cy="30" r="15" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.2"/>
  <circle cx="30" cy="30" r="23" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.2"/>

  <!-- Authentic Spider-Man Emblem -->
  <image href="${dataUri}" x="10" y="8" width="40" height="44"/>
</svg>
`;

fs.writeFileSync('favicon.svg', svgContent);
console.log('Updated favicon.svg with authentic Spider-Man emblem!');

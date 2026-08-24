const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 427 584" width="427" height="584">
  <defs>
    <!-- Mask 3D Shading Gradient -->
    <radialGradient id="maskShading" cx="50%" cy="36%" r="48%" fx="50%" fy="30%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="45%" stop-color="#DC2626"/>
      <stop offset="80%" stop-color="#B91C1C"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </radialGradient>

    <!-- Suit Chest Shading -->
    <radialGradient id="chestShading" cx="50%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="60%" stop-color="#B91C1C"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </radialGradient>

    <!-- Blue Suit Lateral Sides -->
    <linearGradient id="blueSuitSide" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>

    <!-- Eye Lens Glossy Glow -->
    <linearGradient id="eyeLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>

    <!-- Eye Lens Inner Mesh -->
    <pattern id="lensMesh" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#94A3B8" opacity="0.35"/>
    </pattern>

    <!-- High-Tech Neon Glow Filter -->
    <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- ==================== 1. BODY & SHOULDERS SUIT (ALIGNED TO EVREKI'S BLAZER) ==================== -->
  <!-- Left Shoulder Suit Body -->
  <path d="M175 350 L75 385 L15 450 L5 584 L175 584 Z" fill="url(#blueSuitSide)"/>
  
  <!-- Right Shoulder Suit Body -->
  <path d="M252 350 L352 385 L412 450 L422 584 L252 584 Z" fill="url(#blueSuitSide)"/>

  <!-- Center Chest Red Suit (Matching V-Neck & Torso) -->
  <path d="M175 350 L252 350 L280 430 L275 584 L152 584 L147 430 Z" fill="url(#chestShading)"/>

  <!-- Black High-Tech Trim Accents along Shoulders (MCU Homecoming Style) -->
  <path d="M175 352 L75 387 L15 452" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M175 352 L75 387 L15 452" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8"/>

  <path d="M252 352 L352 387 L412 452" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M252 352 L352 387 L412 452" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8"/>

  <!-- Chest Webbing Grid -->
  <g stroke="#000000" stroke-width="1.8" fill="none" opacity="0.7">
    <!-- Vertical Web Lines on Chest -->
    <line x1="213.5" y1="350" x2="213.5" y2="584"/>
    <line x1="190" y1="350" x2="175" y2="584"/>
    <line x1="237" y1="350" x2="252" y2="584"/>
    <line x1="165" y1="355" x2="148" y2="440"/>
    <line x1="262" y1="355" x2="279" y2="440"/>
    <!-- Horizontal Web Arcs on Chest -->
    <path d="M165 375 Q213.5 390 262 375"/>
    <path d="M155 405 Q213.5 425 272 405"/>
    <path d="M148 440 Q213.5 465 279 440"/>
    <path d="M150 480 Q213.5 505 277 480"/>
    <path d="M151 525 Q213.5 550 276 525"/>
    <path d="M152 565 Q213.5 585 275 565"/>
  </g>

  <!-- Chest Spider-Man Emblem (Iconic Centerpiece) -->
  <g transform="translate(213.5, 435) scale(0.7)" fill="#000000">
    <ellipse cx="0" cy="0" rx="6" ry="12"/>
    <ellipse cx="0" cy="-12" rx="4.5" ry="5"/>
    <polygon points="-2.5,-16 0,-21 2.5,-16 0,-14"/>
    <!-- Upper Legs -->
    <path d="M-3 -10 Q-26 -24 -20 -38 Q-18 -38 -14 -34 Q-18 -20 -2 -6" fill="#000000"/>
    <path d="M-3 -4 Q-34 -12 -28 -28 Q-26 -28 -22 -24 Q-26 -8 -2 0" fill="#000000"/>
    <path d="M3 -10 Q26 -24 20 -38 Q18 -38 14 -34 Q18 -20 2 -6" fill="#000000"/>
    <path d="M3 -4 Q34 -12 28 -28 Q26 -28 22 -24 Q26 -8 2 0" fill="#000000"/>
    <!-- Lower Legs -->
    <path d="M-3 2 Q-38 12 -34 34 Q-36 34 -39 30 Q-40 8 -2 4" fill="#000000"/>
    <path d="M-3 8 Q-26 36 -14 58 Q-16 58 -19 53 Q-24 30 -2 10" fill="#000000"/>
    <path d="M3 2 Q38 12 34 34 Q36 34 39 30 Q40 8 2 4" fill="#000000"/>
    <path d="M3 8 Q26 36 14 58 Q16 58 19 53 Q24 30 2 10" fill="#000000"/>
  </g>


  <!-- ==================== 2. NECK (CONNECTING HEAD & TORSO) ==================== -->
  <path d="M175 300 L175 352 L252 352 L252 300 Z" fill="url(#maskShading)"/>
  <g stroke="#000000" stroke-width="1.8" opacity="0.65" fill="none">
    <line x1="213.5" y1="300" x2="213.5" y2="352"/>
    <line x1="194" y1="300" x2="194" y2="352"/>
    <line x1="233" y1="300" x2="233" y2="352"/>
    <path d="M175 320 Q213.5 330 252 320"/>
    <path d="M175 340 Q213.5 350 252 340"/>
  </g>


  <!-- ==================== 3. SPIDER-MAN MASK (ALIGNED 1:1 WITH EVREKI'S FACE) ==================== -->
  <!-- Mask Outer Contour (Aligned with Evreki's Head & Jawline) -->
  <path d="
    M213.5 75
    C155 75 132 110 132 175
    C132 245 155 295 180 310
    L213.5 315
    L247 310
    C272 295 295 245 295 175
    C295 110 272 75 213.5 75
    Z"
    fill="url(#maskShading)"
    stroke="#7F1D1D"
    stroke-width="2"/>

  <!-- Radial Web Lines from Nose Bridge Center (213.5, 225) -->
  <g stroke="#000000" stroke-width="1.8" fill="none" opacity="0.75">
    <!-- Forehead Lines -->
    <line x1="213.5" y1="225" x2="213.5" y2="76"/>
    <line x1="213.5" y1="225" x2="190" y2="78"/>
    <line x1="213.5" y1="225" x2="237" y2="78"/>
    <line x1="213.5" y1="225" x2="165" y2="86"/>
    <line x1="213.5" y1="225" x2="262" y2="86"/>
    <line x1="213.5" y1="225" x2="142" y2="105"/>
    <line x1="213.5" y1="225" x2="285" y2="105"/>
    <line x1="213.5" y1="225" x2="133" y2="135"/>
    <line x1="213.5" y1="225" x2="294" y2="135"/>
    <line x1="213.5" y1="225" x2="132" y2="175"/>
    <line x1="213.5" y1="225" x2="295" y2="175"/>
    <!-- Cheek & Jaw Lines -->
    <line x1="213.5" y1="225" x2="136" y2="225"/>
    <line x1="213.5" y1="225" x2="291" y2="225"/>
    <line x1="213.5" y1="225" x2="148" y2="265"/>
    <line x1="213.5" y1="225" x2="279" y2="265"/>
    <line x1="213.5" y1="225" x2="170" y2="298"/>
    <line x1="213.5" y1="225" x2="257" y2="298"/>
    <line x1="213.5" y1="225" x2="213.5" y2="315"/>

    <!-- Concentric Web Arcs (Radiating Across Mask) -->
    <path d="M195 210 Q213.5 200 232 210"/>
    <path d="M185 190 Q213.5 175 242 190"/>
    <path d="M172 165 Q213.5 145 255 165"/>
    <path d="M155 138 Q213.5 110 272 138"/>
    <path d="M142 110 Q213.5 82 285 110"/>

    <!-- Lower Jaw Arcs -->
    <path d="M195 240 Q213.5 250 232 240"/>
    <path d="M180 260 Q213.5 275 247 260"/>
    <path d="M165 282 Q213.5 300 262 282"/>
  </g>


  <!-- ==================== 4. ICONIC SPIDER-MAN EYE LENSES (ALIGNED WITH REAL EYES) ==================== -->
  <!-- ===== LEFT EYE (Viewer's Left - Center: 178, 198) ===== -->
  <!-- Outer Comic Black Bevel -->
  <path d="
    M152 178
    Q175 168 204 185
    Q208 190 206 206
    Q192 225 158 220
    Q150 219 148 210
    Q146 195 152 178
    Z"
    fill="#000000"
    stroke="#000000"
    stroke-width="3"
    stroke-linejoin="round"/>

  <!-- Inner Glossy White/Cyan Lens -->
  <path d="
    M156 182
    Q175 174 200 188
    Q202 192 201 204
    Q188 220 160 216
    Q154 215 152 208
    Q151 196 156 182
    Z"
    fill="url(#eyeLensGrad)"
    filter="url(#eyeGlow)"/>
  
  <!-- Inner Mesh Texture on Left Lens -->
  <path d="
    M156 182
    Q175 174 200 188
    Q202 192 201 204
    Q188 220 160 216
    Q154 215 152 208
    Q151 196 156 182
    Z"
    fill="url(#lensMesh)"/>


  <!-- ===== RIGHT EYE (Viewer's Right - Center: 249, 198) ===== -->
  <!-- Outer Comic Black Bevel -->
  <path d="
    M275 178
    Q252 168 223 185
    Q219 190 221 206
    Q235 225 269 220
    Q277 219 279 210
    Q281 195 275 178
    Z"
    fill="#000000"
    stroke="#000000"
    stroke-width="3"
    stroke-linejoin="round"/>

  <!-- Inner Glossy White/Cyan Lens -->
  <path d="
    M271 182
    Q252 174 227 188
    Q225 192 226 204
    Q239 220 267 216
    Q273 215 275 208
    Q276 196 271 182
    Z"
    fill="url(#eyeLensGrad)"
    filter="url(#eyeGlow)"/>

  <!-- Inner Mesh Texture on Right Lens -->
  <path d="
    M271 182
    Q252 174 227 188
    Q225 192 226 204
    Q239 220 267 216
    Q273 215 275 208
    Q276 196 271 182
    Z"
    fill="url(#lensMesh)"/>
</svg>
`;

fs.writeFileSync('foto/spiderman-aligned.svg', svg);
console.log('Created foto/spiderman-aligned.svg perfectly matched to 427x584!');

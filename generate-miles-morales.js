const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 427 584" width="427" height="584">
  <defs>
    <!-- Carbon Fiber Hex Weave Texture -->
    <pattern id="carbonFiber" width="6" height="6" patternUnits="userSpaceOnUse">
      <path d="M3 0 L6 1.5 L6 4.5 L3 6 L0 4.5 L0 1.5 Z" fill="#0E1118" stroke="#1A202C" stroke-width="0.6"/>
      <circle cx="3" cy="3" r="1" fill="#000000" opacity="0.6"/>
    </pattern>

    <!-- Micro Web Texture on Red Accents -->
    <pattern id="redGrid" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="#E11D48"/>
      <path d="M0 2 L4 2 M2 0 L2 4" stroke="#9F1239" stroke-width="0.5"/>
    </pattern>

    <!-- Head Shading (Matte Black 3D Volume) -->
    <radialGradient id="headShading" cx="48%" cy="32%" r="52%" fx="46%" fy="26%">
      <stop offset="0%" stop-color="#242B3B"/>
      <stop offset="35%" stop-color="#151A24"/>
      <stop offset="70%" stop-color="#0B0D13"/>
      <stop offset="100%" stop-color="#040508"/>
    </radialGradient>

    <!-- Jaw & Neck Ambient Occlusion -->
    <linearGradient id="neckShading" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050608"/>
      <stop offset="60%" stop-color="#11141C"/>
      <stop offset="100%" stop-color="#1A202C"/>
    </linearGradient>

    <!-- Torso Suit Shading -->
    <linearGradient id="torsoShading" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E2433"/>
      <stop offset="50%" stop-color="#0F131A"/>
      <stop offset="100%" stop-color="#06070A"/>
    </linearGradient>

    <!-- Miles Morales Crimson Red Stripe Gradient -->
    <linearGradient id="crimsonStripe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1E46"/>
      <stop offset="40%" stop-color="#E11D48"/>
      <stop offset="80%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>

    <!-- Glowing Red Webbing Filter -->
    <filter id="redWebGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Eye Lens Outer Bevel (Vivid Miles Red) -->
    <linearGradient id="eyeFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2E56"/>
      <stop offset="50%" stop-color="#E11D48"/>
      <stop offset="100%" stop-color="#9F1239"/>
    </linearGradient>

    <!-- Eye Lens Glass Reflection -->
    <linearGradient id="eyeLensGlass" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#F0FDF4"/>
      <stop offset="70%" stop-color="#E0F2FE"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>

    <!-- Eye Glowing Aura Filter -->
    <filter id="lensAuraGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- ==================== 1. TORSO & SHOULDERS (ALIGNED WITH EVREKI'S SUIT) ==================== -->
  <!-- Base Body Silhouette -->
  <path d="M175 350 L75 385 L15 450 L5 584 L422 584 L412 450 L352 385 L252 350 Z" fill="url(#torsoShading)"/>
  <path d="M175 350 L75 385 L15 450 L5 584 L422 584 L412 450 L352 385 L252 350 Z" fill="url(#carbonFiber)" opacity="0.75"/>

  <!-- Miles Morales Iconic Red Shoulder & Chest Wings/Stripes -->
  <!-- Left Shoulder Red Swoop -->
  <path d="M175 350 L110 375 L45 425 L30 470 L65 460 L130 405 L175 385 Z" fill="url(#crimsonStripe)"/>
  <!-- Right Shoulder Red Swoop -->
  <path d="M252 350 L317 375 L382 425 L397 470 L362 460 L297 405 L252 385 Z" fill="url(#crimsonStripe)"/>

  <!-- Center Chest V-Stripe Contour -->
  <path d="M175 350 L252 350 L275 435 L268 584 L159 584 L152 435 Z" fill="none" stroke="#000000" stroke-width="3"/>

  <!-- Chest Spider Emblem (Miles Morales Spray/Angular Spider) -->
  <g transform="translate(213.5, 442) scale(0.9)" filter="url(#redWebGlow)">
    <!-- Abdomen -->
    <ellipse cx="0" cy="2" rx="7" ry="16" fill="#FF1E46"/>
    <ellipse cx="0" cy="-14" rx="5" ry="7" fill="#FF1E46"/>
    
    <!-- Left Top Fangs / Legs -->
    <path d="M-3 -14 Q-28 -32 -24 -48 Q-22 -48 -17 -43 Q-21 -26 -1 -8" fill="#FF1E46"/>
    <path d="M-3 -6 Q-38 -16 -34 -34 Q-32 -34 -27 -30 Q-30 -12 -1 0" fill="#FF1E46"/>
    <!-- Right Top Fangs / Legs -->
    <path d="M3 -14 Q28 -32 24 -48 Q22 -48 17 -43 Q21 -26 1 -8" fill="#FF1E46"/>
    <path d="M3 -6 Q38 -16 34 -34 Q32 -34 27 -30 Q30 -12 1 0" fill="#FF1E46"/>

    <!-- Left Bottom Legs -->
    <path d="M-3 4 Q-46 16 -40 42 Q-43 42 -46 37 Q-48 12 -2 6" fill="#FF1E46"/>
    <path d="M-3 12 Q-32 44 -16 72 Q-19 72 -23 66 Q-30 38 -2 14" fill="#FF1E46"/>
    <!-- Right Bottom Legs -->
    <path d="M3 4 Q46 16 40 42 Q43 42 46 37 Q48 12 2 6" fill="#FF1E46"/>
    <path d="M3 12 Q32 44 16 72 Q19 72 23 66 Q30 38 2 14" fill="#FF1E46"/>
  </g>

  <!-- Chest Subtle Bio-Electric Venom Sparks -->
  <g stroke="#38BDF8" stroke-width="1.2" fill="none" opacity="0.6">
    <path d="M190 410 L195 425 L188 435"/>
    <path d="M237 410 L232 425 L239 435"/>
  </g>


  <!-- ==================== 2. NECK (CONNECTING HEAD & TORSO) ==================== -->
  <path d="M175 295 L175 352 L252 352 L252 295 Z" fill="url(#neckShading)"/>
  <path d="M175 295 L175 352 L252 352 L252 295 Z" fill="url(#carbonFiber)" opacity="0.6"/>
  <!-- Neck Red Web Lines -->
  <g stroke="#FF1E46" stroke-width="1.4" opacity="0.8" fill="none">
    <line x1="213.5" y1="295" x2="213.5" y2="352"/>
    <line x1="194" y1="295" x2="194" y2="352"/>
    <line x1="233" y1="295" x2="233" y2="352"/>
    <path d="M175 315 Q213.5 325 252 315"/>
    <path d="M175 338 Q213.5 348 252 338"/>
  </g>


  <!-- ==================== 3. MILES MORALES HEAD MASK (1:1 ALIGNED WITH EVREKI) ==================== -->
  <!-- Mask Outer Volume & Shape -->
  <path d="
    M213.5 75
    C152 75 130 110 130 175
    C130 245 152 295 178 310
    L213.5 316
    L249 310
    C275 295 297 245 297 175
    C297 110 275 75 213.5 75
    Z"
    fill="url(#headShading)"/>
  
  <!-- Carbon Fiber Head Overlay -->
  <path d="
    M213.5 75
    C152 75 130 110 130 175
    C130 245 152 295 178 310
    L213.5 316
    L249 310
    C275 295 297 245 297 175
    C297 110 275 75 213.5 75
    Z"
    fill="url(#carbonFiber)"
    opacity="0.82"/>

  <!-- Mask Rim Specular Light -->
  <path d="
    M213.5 76
    C153 76 131 111 131 175
    C131 244 153 294 179 309
    L213.5 315
    L248 309
    C274 294 296 244 296 175
    C296 111 274 76 213.5 76
    Z"
    fill="none"
    stroke="#38BDF8"
    stroke-width="1.2"
    opacity="0.5"/>

  <!-- Glowing Crimson Webbing Grid on Mask (Radiating from Nose Bridge 213.5, 226) -->
  <g stroke="#FF1E46" stroke-width="1.6" fill="none" opacity="0.85" filter="url(#redWebGlow)">
    <!-- Radial Lines (Forehead & Temples) -->
    <line x1="213.5" y1="226" x2="213.5" y2="76"/>
    <line x1="213.5" y1="226" x2="190" y2="78"/>
    <line x1="213.5" y1="226" x2="237" y2="78"/>
    <line x1="213.5" y1="226" x2="165" y2="86"/>
    <line x1="213.5" y1="226" x2="262" y2="86"/>
    <line x1="213.5" y1="226" x2="142" y2="105"/>
    <line x1="213.5" y1="226" x2="285" y2="105"/>
    <line x1="213.5" y1="226" x2="132" y2="135"/>
    <line x1="213.5" y1="226" x2="295" y2="135"/>
    <line x1="213.5" y1="226" x2="130" y2="175"/>
    <line x1="213.5" y1="226" x2="297" y2="175"/>
    <!-- Cheeks & Chin -->
    <line x1="213.5" y1="226" x2="134" y2="226"/>
    <line x1="213.5" y1="226" x2="293" y2="226"/>
    <line x1="213.5" y1="226" x2="146" y2="265"/>
    <line x1="213.5" y1="226" x2="281" y2="265"/>
    <line x1="213.5" y1="226" x2="168" y2="298"/>
    <line x1="213.5" y1="226" x2="259" y2="298"/>
    <line x1="213.5" y1="226" x2="213.5" y2="316"/>

    <!-- Concentric Web Catenary Rings -->
    <path d="M195 210 Q213.5 200 232 210"/>
    <path d="M184 188 Q213.5 174 243 188"/>
    <path d="M170 162 Q213.5 142 257 162"/>
    <path d="M153 134 Q213.5 106 274 134"/>
    <path d="M140 106 Q213.5 78 287 106"/>

    <!-- Lower Jaw Rings -->
    <path d="M195 242 Q213.5 252 232 242"/>
    <path d="M179 262 Q213.5 277 248 262"/>
    <path d="M163 284 Q213.5 302 264 284"/>
  </g>


  <!-- ==================== 4. HIGH-TECH MILES MORALES EYE LENSES ==================== -->
  <!-- ===== LEFT EYE (Viewer's Left - Center: 178, 198) ===== -->
  <!-- Drop Shadow / Depth Rim -->
  <path d="
    M148 174
    Q175 162 207 181
    Q212 188 209 208
    Q194 229 154 224
    Q145 222 143 211
    Q141 193 148 174
    Z"
    fill="#000000"
    opacity="0.95"/>

  <!-- Thick Crimson Red Metallic Frame -->
  <path d="
    M150 176
    Q175 164 205 183
    Q210 189 207 206
    Q192 227 156 222
    Q147 221 145 210
    Q143 194 150 176
    Z"
    fill="url(#eyeFrameGrad)"
    stroke="#FF1E46"
    stroke-width="2.2"
    stroke-linejoin="round"/>

  <!-- Inner Glossy Glass Lens with Cyber Glow -->
  <path d="
    M157 182
    Q175 173 199 187
    Q202 191 200 203
    Q187 219 162 215
    Q156 214 154 207
    Q153 196 157 182
    Z"
    fill="url(#eyeLensGlass)"
    filter="url(#lensAuraGlow)"/>

  <!-- Specular Lens Highlights (White Gloss Arc) -->
  <path d="M160 186 Q175 178 194 188" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.95"/>


  <!-- ===== RIGHT EYE (Viewer's Right - Center: 249, 198) ===== -->
  <!-- Drop Shadow / Depth Rim -->
  <path d="
    M279 174
    Q252 162 220 181
    Q215 188 218 208
    Q233 229 273 224
    Q282 222 284 211
    Q286 193 279 174
    Z"
    fill="#000000"
    opacity="0.95"/>

  <!-- Thick Crimson Red Metallic Frame -->
  <path d="
    M277 176
    Q252 164 222 183
    Q217 189 220 206
    Q235 227 271 222
    Q280 221 282 210
    Q284 194 277 176
    Z"
    fill="url(#eyeFrameGrad)"
    stroke="#FF1E46"
    stroke-width="2.2"
    stroke-linejoin="round"/>

  <!-- Inner Glossy Glass Lens with Cyber Glow -->
  <path d="
    M270 182
    Q252 173 228 187
    Q225 191 227 203
    Q240 219 265 215
    Q271 214 273 207
    Q274 196 270 182
    Z"
    fill="url(#eyeLensGlass)"
    filter="url(#lensAuraGlow)"/>

  <!-- Specular Lens Highlights (White Gloss Arc) -->
  <path d="M267 186 Q252 178 233 188" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.95"/>
</svg>
`;

fs.writeFileSync('foto/spiderman-aligned.svg', svg);
console.log('Created ultra-high-end Miles Morales Spider-Man SVG perfectly matched to 427x584!');

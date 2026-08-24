const fs = require('fs');
const path = require('path');

// Read the uploaded image
const src = 'C:\\Users\\EVREKI\\.gemini\\antigravity\\brain\\b030934d-dedc-4fac-97ef-4363103a68ee\\.user_uploaded\\media_1787537014365.png';
const dest = 'c:\\laragon\\www\\web portofolio evreki\\foto\\spider-reference.png';

fs.copyFileSync(src, dest);
console.log('Copied spider reference image to foto/spider-reference.png');

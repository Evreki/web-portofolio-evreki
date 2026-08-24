const fs = require('fs');
const src = 'C:\\Users\\EVREKI\\.gemini\\antigravity\\brain\\b030934d-dedc-4fac-97ef-4363103a68ee\\.user_uploaded\\media_1787537900944.png';
const dest = 'c:\\laragon\\www\\web portofolio evreki\\foto\\spiderman-raw.png';

fs.copyFileSync(src, dest);
console.log('Copied raw spiderman image to foto/spiderman-raw.png');

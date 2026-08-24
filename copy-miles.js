const fs = require('fs');
const src = 'C:\\Users\\EVREKI\\.gemini\\antigravity\\brain\\b030934d-dedc-4fac-97ef-4363103a68ee\\.user_uploaded\\media_1787538698962.png';
const dest = 'c:\\laragon\\www\\web portofolio evreki\\foto\\miles-reference.png';

fs.copyFileSync(src, dest);
console.log('Copied miles reference image to foto/miles-reference.png');

const fs = require('fs');

// We can analyze the alpha channel and silhouette of profile-transparent.png
// to find the exact boundary of Evreki's shoulders and neck!
const buf = fs.readFileSync('foto/profile-transparent.png');
console.log('File size:', buf.length);

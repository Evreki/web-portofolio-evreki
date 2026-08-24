const fs = require('fs');

// Read PNG header for width and height
const buf = fs.readFileSync('foto/profile-transparent.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

console.log(`Dimensions: ${width} x ${height}`);

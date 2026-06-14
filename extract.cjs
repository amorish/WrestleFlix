const fs = require('fs');
const content = fs.readFileSync('C:/Users/MANISH/.gemini/antigravity/brain/d380c101-4372-4c6f-aeb8-cbb0ca28f8bc/.system_generated/steps/287/content.md', 'utf8');
const match = content.match(/"videoId":"([^"]{11})"/);
console.log(match ? match[1] : 'not found');

const fs = require('fs');
const content = fs.readFileSync('src/main/java/com/coffeego/service/MenuService.java', 'utf8');

const lines = content.split('\n');
const parsed = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/new\s+MenuItem\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/);
  if (match) {
    // If the MenuItem constructor spans multiple lines, check next lines too
    let fullChunk = line;
    for (let j = 1; j <= 5 && i + j < lines.length; j++) {
      if (lines[i + j].includes('new MenuItem(')) break;
      fullChunk += ' ' + lines[i + j];
      if (lines[i + j].includes(');')) break;
    }
    const imgMatch = fullChunk.match(/\/images\/[^"\s)]+/);
    parsed.push({ id: match[1], name: match[2], cat: match[3], img: imgMatch ? imgMatch[0] : 'NONE' });
  }
}
console.log('Total items in MenuService.java:', parsed.length);
parsed.forEach(p => {
  console.log(p.id.padEnd(8) + ' | ' + p.cat.padEnd(12) + ' | ' + p.name.padEnd(35) + ' | ' + p.img);
});

// Check if any image is shared between items
const imgCounts = {};
parsed.forEach(p => {
  imgCounts[p.img] = (imgCounts[p.img] || 0) + 1;
});
console.log('\nShared image URLs in MenuService:');
for (const [img, count] of Object.entries(imgCounts)) {
  if (count > 1) {
    const itemsUsing = parsed.filter(p => p.img === img).map(p => p.name);
    console.log(`URL ${img} used by ${count} items: ${itemsUsing.join(', ')}`);
  }
}

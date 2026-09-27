const fs = require('fs');

const content = fs.readFileSync('src/main/java/com/coffeego/service/MenuService.java', 'utf8');
const lines = content.split('\n');
const items = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/new\s+MenuItem\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/);
  if (m) {
    let full = line;
    for (let j = 1; j <= 6 && i + j < lines.length; j++) {
      if (lines[i+j].includes('new MenuItem(')) break;
      full += ' ' + lines[i+j];
      if (lines[i+j].includes(');')) break;
    }
    const imgM = full.match(/\/images\/(?:items\/)?([^"\s)]+\.jpg)/);
    const descM = full.match(/new\s+MenuItem\([^,]+,[^,]+,[^,]+,\s*"([^"]+)"/);
    items.push({
      id: m[1],
      name: m[2],
      category: m[3],
      description: descM ? descM[1] : '',
      imageFile: imgM ? imgM[1] : null
    });
  }
}

console.log('Total items in MenuService:', items.length);
fs.writeFileSync('all_menu_items.json', JSON.stringify(items, null, 2));
console.log('Saved to all_menu_items.json');

const fs = require('fs');
const crypto = require('crypto');

const menuContent = fs.readFileSync('src/main/java/com/coffeego/service/MenuService.java', 'utf8');
const lines = menuContent.split('\n');
const items = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/new\s+MenuItem\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/);
  if (m) {
    let full = line;
    for (let j = 1; j <= 5 && i + j < lines.length; j++) {
      if (lines[i+j].includes('new MenuItem(')) break;
      full += ' ' + lines[i+j];
      if (lines[i+j].includes(');')) break;
    }
    const imgM = full.match(/\/images\/items\/([^"]+\.jpg)/);
    items.push({ id: m[1], name: m[2], cat: m[3], file: imgM ? imgM[1] : null });
  }
}

const hashMap = {};

items.forEach(it => {
  if (!it.file) {
    console.log('NO FILE FOR:', it.id, it.name);
    return;
  }
  const p = 'src/main/resources/static/images/items/' + it.file;
  if (!fs.existsSync(p)) {
    console.log('FILE MISSING:', it.file, 'for', it.name);
    return;
  }
  const buf = fs.readFileSync(p);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (!hashMap[hash]) {
    hashMap[hash] = [];
  }
  hashMap[hash].push({ name: it.name, file: it.file, id: it.id, cat: it.cat });
});

console.log('=== DUPLICATE GROUPS IN ACTIVE MENU ===');
let dupCount = 0;
for (const [hash, group] of Object.entries(hashMap)) {
  if (group.length > 1) {
    dupCount += group.length;
    console.log('\nDUPLICATE GROUP (' + group.length + ' items, hash: ' + hash.slice(0,8) + '):');
    group.forEach(g => console.log('  [' + g.cat + '] ' + g.name + ' -> ' + g.file));
  }
}
console.log('\nTotal items with duplicate photos: ' + dupCount + ' / ' + items.length);

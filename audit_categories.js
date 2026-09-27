const fs = require('fs');
const content = fs.readFileSync('src/main/java/com/coffeego/service/MenuService.java', 'utf8');
const regex = /new MenuItem\([^,]+,\s*"([^"]+)",\s*"([^"]+)",[^,]+,[^,]+,[^,]+,[^,]+,\s*"([^"]+)"/g;
let m;
const items = [];
while ((m = regex.exec(content)) !== null) {
  items.push({ name: m[1], category: m[2], image: m[3] });
}
console.log('Total items parsed:', items.length);

const byCat = {};
for (const it of items) {
  if (!byCat[it.category]) byCat[it.category] = [];
  byCat[it.category].push(it);
}

for (const [cat, list] of Object.entries(byCat)) {
  console.log('\n=== ' + cat + ' (' + list.length + ') ===');
  list.forEach(i => console.log('  ' + i.name + ' -> ' + i.image));
}

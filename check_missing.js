const fs = require('fs');
const path = require('path');

const menuServiceContent = fs.readFileSync(path.join(__dirname, 'src/main/java/com/coffeego/service/MenuService.java'), 'utf8');
const itemsDir = path.join(__dirname, 'src/main/resources/static/images/items');
const existingFiles = new Set(fs.readdirSync(itemsDir));

const itemRegex = /menuItems\.add\(new MenuItem\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",/g;
let m;
const all = [];
while ((m = itemRegex.exec(menuServiceContent)) !== null) {
  all.push({ id: m[1], name: m[2], category: m[3], desc: m[4] });
}

console.log(`Total menu items in MenuService: ${all.length}`);
all.forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.id}] ${it.name} (${it.category})`);
});

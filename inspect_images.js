const fs = require('fs');
const path = require('path');

function getImageSize(buffer) {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: 'png' };
  }
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xFF) break;
      const marker = buffer[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
          type: 'jpg'
        };
      }
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }
  return { width: 0, height: 0, type: 'unknown' };
}

const items = JSON.parse(fs.readFileSync('all_menu_items.json', 'utf8'));
const results = [];

for (const it of items) {
  const p = path.join('src/main/resources/static/images/items', it.imageFile);
  if (!fs.existsSync(p)) {
    results.push({ ...it, status: 'MISSING' });
    continue;
  }
  const buf = fs.readFileSync(p);
  const size = getImageSize(buf);
  results.push({
    id: it.id,
    name: it.name,
    category: it.category,
    file: it.imageFile,
    bytes: buf.length,
    width: size.width,
    height: size.height,
    aspect: (size.width / (size.height || 1)).toFixed(2)
  });
}

fs.writeFileSync('image_specs.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Wrote image_specs.json successfully for ' + results.length + ' items');

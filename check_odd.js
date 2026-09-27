const fs = require('fs');
const specs = JSON.parse(fs.readFileSync('image_specs.json', 'utf8'));

const odd = specs.filter(s => s.status === 'MISSING' || s.width < 300 || s.height < 300 || s.aspect < 0.65 || s.aspect > 2.0);
console.log('Odd / suspicious dimension images (' + odd.length + '):');
odd.forEach(o => {
  console.log(`${o.id.padEnd(8)} | ${o.name.padEnd(30)} | ${o.file.padEnd(30)} | ${o.width}x${o.height} | aspect: ${o.aspect}`);
});

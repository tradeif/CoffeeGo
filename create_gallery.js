const fs = require('fs');

const items = JSON.parse(fs.readFileSync('all_menu_items.json', 'utf8'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CoffeeGo Menu Images Audit</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
    h1 { text-align: center; color: #ffb74d; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 20px; }
    .card { background: #2a2a2a; border-radius: 12px; overflow: hidden; padding: 10px; border: 1px solid #444; }
    .card img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; background: #111; }
    .name { font-weight: bold; font-size: 14px; margin-top: 8px; color: #fff; }
    .cat { font-size: 11px; color: #ff9800; text-transform: uppercase; font-weight: bold; }
    .file { font-size: 10px; color: #888; word-break: break-all; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>CoffeeGo Menu Items Image Audit (${items.length} Items)</h1>
  <div class="grid">
    ${items.map(it => `
      <div class="card" id="card-${it.id}">
        <img src="/images/items/${it.imageFile}" alt="${it.name}" loading="lazy" />
        <div class="cat">${it.category}</div>
        <div class="name">${it.name}</div>
        <div class="file">${it.imageFile}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync('src/main/resources/static/inspect_all.html', html, 'utf8');
console.log('Created src/main/resources/static/inspect_all.html');

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

async function searchBing(query) {
  try {
    const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res.text();
    const regex = /murl&quot;:&quot;(https?:\/\/[^&"]+)&quot;/g;
    const matches = [];
    let m;
    while ((m = regex.exec(html)) !== null) {
      const u = m[1];
      if (!u.includes('.svg') && !u.includes('.gif') && !u.includes('vector') && !u.includes('cartoon') && !u.includes('icon')) {
        matches.push(u);
      }
    }
    return matches;
  } catch (e) {
    return [];
  }
}

async function searchWiki(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CoffeeGoApp/1.0' } });
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];
    const list = [];
    for (const p of Object.values(data.query.pages)) {
      if (p.imageinfo && p.imageinfo[0]) {
        const u = p.imageinfo[0].thumburl;
        const t = p.title.toLowerCase();
        if ((t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.webp')) && !t.includes('pdf') && !t.includes('djvu')) {
          list.push(u);
        }
      }
    }
    return list;
  } catch (e) {
    return [];
  }
}

function isValidImageBuffer(buf) {
  if (!buf || buf.length < 15000) return false;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

async function downloadCandidate(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (!isValidImageBuffer(buf)) return false;
    fs.writeFileSync(destPath, buf);
    const targetPath = destPath.replace('src/main/resources/static/images/items', 'target/classes/static/images/items');
    fs.writeFileSync(targetPath, buf);
    return true;
  } catch (e) {
    clearTimeout(timer);
    return false;
  }
}

async function fetchItem(filename, query, wikiQuery) {
  const dest = path.join(srcDir, filename);
  console.log(`Fetching: ${filename} for query: ${query}...`);
  const bingUrls = await searchBing(query);
  for (let i = 0; i < Math.min(bingUrls.length, 10); i++) {
    const ok = await downloadCandidate(bingUrls[i], dest);
    if (ok) {
      console.log(`  -> SUCCESS from Bing #${i+1} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
      return true;
    }
  }

  if (wikiQuery) {
    const wikiUrls = await searchWiki(wikiQuery);
    for (let i = 0; i < Math.min(wikiUrls.length, 5); i++) {
      const ok = await downloadCandidate(wikiUrls[i], dest);
      if (ok) {
        console.log(`  -> SUCCESS from Wiki #${i+1} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
        return true;
      }
    }
  }

  console.warn(`  -> FAILED: ${filename}`);
  return false;
}

async function run() {
  await fetchItem('regular_cold_coffee.jpg', 'frothy cafe cold coffee glass recipe', 'cold coffee glass');
  await fetchItem('hot_chocolate.jpg', 'rich hot chocolate mug marshmallows cocoa powder recipe', 'hot chocolate mug');
  await fetchItem('cranberry_mojito.jpg', 'cranberry mojito drink mint lime glass recipe', 'cranberry cocktail glass');
  await fetchItem('cheese_burst_sandwich.jpg', 'cheese burst grilled sandwich molten cheese pull', 'grilled cheese sandwich');
  await fetchItem('corn_cheese_pizza.jpg', 'sweet corn cheese pizza slice mozzarella', 'corn pizza cheese');
}

run();

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
    const regex = /murl&quot;:&quot;(https?:\/\/[^&"']+)&quot;/g;
    const matches = [];
    let m;
    while ((m = regex.exec(html)) !== null) {
      const u = m[1];
      if (!/ftcdn|stock\.adobe|shutterstock|istockphoto|gettyimages|alamy|123rf|depositphotos|dreamstime|cartoon|vector|icon/i.test(u)) {
        matches.push(u);
      }
    }
    return matches;
  } catch (e) {
    return [];
  }
}

function isValidImageBuffer(buf) {
  if (!buf || buf.length < 10000) return false;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

async function downloadCandidate(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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

const missing = [
  { file: 'orange_mojito.jpg', queries: ['orange mojito drink ice', 'citrus orange mojito glass', 'orange mocktail mint'] },
  { file: 'sweet_corn_soup.jpg', queries: ['sweet corn vegetable soup bowl', 'chinese corn soup spoon', 'creamy sweet corn soup recipe'] },
  { file: 'paneer_burger.jpg', queries: ['paneer burger sesame bun', 'cottage cheese burger patty', 'crispy paneer burger cafe'] },
  { file: 'aloo_tikki_wrap.jpg', queries: ['potato kathi roll wrap', 'aloo wrap roll street food', 'veg frankie wrap roll'] }
];

async function run() {
  for (const item of missing) {
    const dest = path.join(srcDir, item.file);
    let ok = false;
    for (const q of item.queries) {
      console.log(`Searching for ${item.file} with query "${q}"...`);
      const urls = await searchBing(q);
      for (const u of urls.slice(0, 10)) {
        if (await downloadCandidate(u, dest)) {
          console.log(`Successfully downloaded ${item.file} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
          ok = true;
          break;
        }
      }
      if (ok) break;
    }
    if (!ok) console.error(`Failed to download ${item.file}`);
  }
}

run();

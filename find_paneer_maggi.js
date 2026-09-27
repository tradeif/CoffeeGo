const https = require('https');
const http = require('http');
const fs = require('fs');

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode));
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(fs.statSync(dest).size);
      });
    });
    req.on('error', reject);
  });
}

function searchBing(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&qft=+filterui:imagesize-medium&form=HDRSC2';
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const matches = [];
        const regex = /murl&quot;:&quot;(https?:\/\/[^&]+?\.(?:jpg|jpeg|png|webp))&quot;/g;
        let m;
        while ((m = regex.exec(html)) !== null) matches.push(m[1]);
        resolve(matches);
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'chilli paneer noodles recipe bowl indo chinese',
    'paneer chow mein noodles bowl recipe',
    'paneer hakka noodles recipe bowl'
  ];

  for (const q of queries) {
    console.log('Searching query:', q);
    const urls = await searchBing(q);
    for (const u of urls) {
      const lower = u.toLowerCase();
      if (lower.includes('curry') || lower.includes('makhani') || lower.includes('butter-masala') || lower.includes('gravy') || lower.includes('cheese-cubes') || lower.includes('raw-paneer')) continue;
      if (!lower.includes('noodles') && !lower.includes('chow') && !lower.includes('maggi') && !lower.includes('hakka')) continue;
      console.log('Candidate:', u);
      try {
        const sz = await downloadImage(u, 'src/main/resources/static/images/items/paneer_tikka_maggi.jpg');
        if (sz > 10000) {
          fs.copyFileSync('src/main/resources/static/images/items/paneer_tikka_maggi.jpg', 'target/classes/static/images/items/paneer_tikka_maggi.jpg');
          console.log('-> SUCCESS saved paneer_tikka_maggi.jpg:', sz);
          return;
        }
      } catch (e) {
        console.log('Failed:', e.message);
      }
    }
  }
}

run();

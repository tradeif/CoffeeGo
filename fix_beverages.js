const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetItems = [
  {
    file: 'watermelon_mojito.jpg',
    query: 'watermelon mojito cocktail drink glass recipe mint ice',
    mustInclude: ['watermelon', 'mojito', 'cocktail', 'drink', 'mocktail']
  },
  {
    file: 'virgin_mojito.jpg',
    query: 'classic virgin mojito mocktail glass recipe mint lime',
    mustInclude: ['mojito', 'virgin', 'mint', 'lime', 'mocktail', 'drink']
  },
  {
    file: 'blue_lagoon_mocktail.jpg',
    query: 'blue lagoon mocktail cocktail drink glass curacao lemon recipe',
    mustInclude: ['blue', 'lagoon', 'curacao', 'mocktail', 'drink', 'cocktail']
  },
  {
    file: 'peach_mocktail.jpg',
    query: 'peach mocktail iced drink glass recipe sparkling summer',
    mustInclude: ['peach', 'mocktail', 'drink', 'spritzer', 'cocktail']
  }
];

const negativeWords = [
  'vector', 'logo', 'diagram', 'clipart', 'chart', 'graph', 'drawing', 'poster',
  'people', 'celebrity', 'modi', 'god', 'ganesh', 'temple', 'shrine', 'statue',
  'worksheet', 'certificate', 'factory', 'swatch', 'palette', 'app', 'icon',
  'screenshot', 'slide', 'presentation', 'boardwalk', 'mountain', 'landscape',
  'sunset', 'beach', 'wonderla', 'jio', 'ambani', 'backrub', 'google', 'boygames',
  'game', 'tattoo', 'shades-of-blue', 'boy-games', 'watermelon-field'
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 12000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        const size = fs.statSync(dest).size;
        if (size < 8000) {
          fs.unlinkSync(dest);
          reject(new Error('File too small: ' + size));
        } else {
          resolve(size);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function searchBing(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&qft=+filterui:imagesize-medium&form=HDRSC2';
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const matches = [];
        const regex = /murl&quot;:&quot;(https?:\/\/[^&]+?\.(?:jpg|jpeg|png|webp))&quot;/g;
        let m;
        while ((m = regex.exec(html)) !== null) {
          matches.push(m[1]);
        }
        resolve(matches);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of targetItems) {
    console.log(`\n=== Processing ${item.file} ===`);
    const urls = await searchBing(item.query);
    console.log(`Found ${urls.length} candidates from Bing`);
    
    let success = false;
    for (const url of urls) {
      const lower = url.toLowerCase();
      if (negativeWords.some(w => lower.includes(w))) continue;
      if (!item.mustInclude.some(w => lower.includes(w))) continue;

      const srcPath = path.join('src/main/resources/static/images/items', item.file);
      const tgtPath = path.join('target/classes/static/images/items', item.file);

      try {
        console.log('Attempting:', url.substring(0, 90) + '...');
        const size = await downloadImage(url, srcPath);
        fs.copyFileSync(srcPath, tgtPath);
        console.log(`-> SUCCESS: Saved ${item.file} (${size} bytes)`);
        success = true;
        break;
      } catch (err) {
        console.log(`   Skipped: ${err.message}`);
      }
    }

    if (!success) {
      console.error(`!!! FAILED to find valid food image for ${item.file}`);
    }
  }
}

run();

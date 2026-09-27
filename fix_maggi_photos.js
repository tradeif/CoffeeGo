const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const maggiItems = [
  {
    file: 'corn_cheese_maggi.jpg',
    query: 'cheese corn maggi noodles bowl recipe melted',
    mustInclude: ['maggi', 'cheese', 'corn', 'noodles', 'recipe']
  },
  {
    file: 'paneer_tikka_maggi.jpg',
    query: 'paneer maggi noodles spicy bowl recipe',
    mustInclude: ['paneer', 'maggi', 'noodles', 'recipe']
  },
  {
    file: 'schezwan_maggi.jpg',
    query: 'schezwan maggi noodles spicy red bowl recipe indo chinese',
    mustInclude: ['schezwan', 'maggi', 'noodles', 'spicy', 'chilli', 'bowl']
  },
  {
    file: 'punjabi_tadka_maggi.jpg',
    query: 'punjabi tadka maggi noodles desi spicy bowl recipe',
    mustInclude: ['tadka', 'maggi', 'noodles', 'punjabi', 'masala', 'bowl']
  },
  {
    file: 'cheese_maggi.jpg',
    query: 'cheese maggi noodles bowl melted cheese pull recipe',
    mustInclude: ['cheese', 'maggi', 'noodles', 'bowl', 'melted']
  },
  {
    file: 'tandoori_maggi.jpg',
    query: 'tandoori maggi noodles spicy cafe bowl recipe',
    mustInclude: ['tandoori', 'maggi', 'noodles', 'spicy', 'bowl']
  },
  {
    file: 'veg_masala_maggi.jpg',
    query: 'vegetable masala maggi noodles bowl recipe peas carrots',
    mustInclude: ['vegetable', 'masala', 'maggi', 'noodles', 'bowl']
  },
  {
    file: 'plain_maggi.jpg',
    query: 'classic masala maggi noodles bowl fork recipe',
    mustInclude: ['maggi', 'noodles', 'bowl', 'masala', 'recipe']
  }
];

const negativeWords = [
  'vector', 'logo', 'diagram', 'clipart', 'chart', 'graph', 'drawing', 'poster',
  'people', 'celebrity', 'modi', 'god', 'ganesh', 'temple', 'shrine', 'statue',
  'worksheet', 'certificate', 'factory', 'swatch', 'palette', 'app', 'icon',
  'screenshot', 'slide', 'presentation', 'boardwalk', 'mountain', 'landscape',
  'sunset', 'beach', 'classroom', 'school', 'students', 'anime', 'manga', 'butterfly',
  'dance', 'dancer', 'costume', 'punjabi-suit', 'vegetable-market', 'raw-vegetable',
  'grocery', 'farm', 'fields', 'text', 'watermark'
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
  for (const item of maggiItems) {
    console.log(`\n=== Processing ${item.file} ===`);
    const urls = await searchBing(item.query);
    console.log(`Found ${urls.length} candidates from Bing for query: "${item.query}"`);
    
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

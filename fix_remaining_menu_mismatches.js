const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetItems = [
  // Pizzas
  { file: 'peri_peri_paneer_pizza.jpg', query: 'peri peri paneer pizza slice recipe cheese', mustInclude: ['pizza', 'paneer', 'cheese'] },
  { file: 'double_cheese_pizza.jpg', query: 'double cheese margherita pizza slice melted cheese pull recipe', mustInclude: ['pizza', 'cheese'] },
  { file: 'otc_pizza.jpg', query: 'onion tomato capsicum veg pizza recipe', mustInclude: ['pizza', 'veg', 'cheese', 'capsicum', 'tomato', 'onion'] },
  { file: 'corn_cheese_pizza.jpg', query: 'sweet corn cheese pizza slice recipe', mustInclude: ['pizza', 'corn', 'cheese'] },
  { file: 'capsicum_pizza.jpg', query: 'green capsicum bell pepper pizza recipe slice', mustInclude: ['pizza', 'capsicum', 'pepper', 'cheese'] },
  { file: 'onion_pizza.jpg', query: 'onion cheese pizza slice recipe', mustInclude: ['pizza', 'onion', 'cheese'] },
  { file: 'margherita_pizza.jpg', query: 'classic margherita pizza fresh basil mozzarella recipe', mustInclude: ['pizza', 'margherita', 'cheese', 'basil'] },

  // Burgers
  { file: 'mexican_cheese_burger.jpg', query: 'mexican salsa cheese burger jalapeno bun recipe', mustInclude: ['burger', 'cheese', 'mexican', 'bun'] },
  { file: 'tandoori_cheese_burger.jpg', query: 'tandoori paneer cheese burger recipe spicy', mustInclude: ['burger', 'tandoori', 'cheese', 'bun'] },
  { file: 'cheese_slice_burger.jpg', query: 'classic veg cheeseburger melted cheese slice bun recipe', mustInclude: ['burger', 'cheese', 'cheeseburger', 'bun'] },

  // Shakes
  { file: 'blueberry_shake.jpg', query: 'blueberry milkshake tall glass whipped cream recipe', mustInclude: ['blueberry', 'shake', 'milkshake', 'glass'] },
  { file: 'mango_shake.jpg', query: 'mango milkshake thick glass whipped cream recipe', mustInclude: ['mango', 'shake', 'milkshake', 'glass'] },
  { file: 'kesar_elaichi_shake.jpg', query: 'kesar elaichi saffron cardamom milkshake glass recipe', mustInclude: ['kesar', 'elaichi', 'saffron', 'cardamom', 'shake', 'milkshake', 'badam', 'pista', 'glass'] },
  { file: 'butterscotch_shake.jpg', query: 'butterscotch milkshake caramel crunch glass recipe', mustInclude: ['butterscotch', 'shake', 'milkshake', 'glass'] },
  { file: 'kit_kat_shake.jpg', query: 'kit kat milkshake chocolate glass whipped cream recipe', mustInclude: ['kitkat', 'kit', 'kat', 'shake', 'milkshake', 'glass'] },
  { file: 'oreo_shake.jpg', query: 'oreo milkshake cookies and cream glass recipe', mustInclude: ['oreo', 'shake', 'milkshake', 'glass'] },
  { file: 'chocolate_shake.jpg', query: 'thick chocolate milkshake glass chocolate drizzle recipe', mustInclude: ['chocolate', 'shake', 'milkshake', 'glass'] },
  { file: 'paan_shake.jpg', query: 'meetha paan milkshake refreshing drink glass recipe', mustInclude: ['paan', 'shake', 'milkshake', 'drink', 'glass'] },

  // Waffles & Desserts
  { file: 'nutella_waffle.jpg', query: 'nutella belgian waffle plate chocolate drizzle recipe', mustInclude: ['nutella', 'waffle', 'chocolate', 'belgian'] },
  { file: 'choco_chips_waffle.jpg', query: 'chocolate chip waffle warm plate recipe', mustInclude: ['choco', 'chip', 'waffle', 'chocolate'] },
  { file: 'dark_chocolate_waffle.jpg', query: 'dark chocolate waffle sauce berries plate recipe', mustInclude: ['dark', 'chocolate', 'waffle', 'belgian'] },
  { file: 'brownie_with_icecream.jpg', query: 'sizzling brownie with vanilla ice cream chocolate sauce plate', mustInclude: ['brownie', 'ice', 'cream', 'chocolate', 'sizzler'] },
  { file: 'brownie_with_chocolate.jpg', query: 'fudge chocolate brownie ganache drizzle plate recipe', mustInclude: ['brownie', 'chocolate', 'fudge'] },
  { file: 'choco_lava_cake.jpg', query: 'molten chocolate lava cake oozing center plate recipe', mustInclude: ['lava', 'cake', 'chocolate', 'molten'] },

  // Fries & Snacks
  { file: 'honey_chilli_potato.jpg', query: 'honey chilli potato crispy sesame seeds bowl recipe', mustInclude: ['honey', 'chilli', 'potato', 'sesame', 'crispy'] },
  { file: 'chilli_potato.jpg', query: 'crispy chilli potato indo chinese bowl recipe', mustInclude: ['chilli', 'potato', 'crispy'] },
  { file: 'cheese_fries.jpg', query: 'loaded cheese fries melted cheddar sauce plate recipe', mustInclude: ['cheese', 'fries', 'french', 'cheddar'] },
  { file: 'peri_peri_fries.jpg', query: 'peri peri masala french fries crispy plate recipe', mustInclude: ['peri', 'fries', 'french', 'masala'] }
];

const negativeWords = [
  'vector', 'logo', 'diagram', 'clipart', 'chart', 'graph', 'drawing', 'poster',
  'people', 'celebrity', 'modi', 'god', 'ganesh', 'temple', 'shrine', 'statue',
  'worksheet', 'certificate', 'factory', 'swatch', 'palette', 'app', 'icon',
  'screenshot', 'slide', 'presentation', 'boardwalk', 'mountain', 'landscape',
  'sunset', 'beach', 'wonderla', 'jio', 'ambani', 'backrub', 'google', 'boygames',
  'game', 'tattoo', 'grub', 'bootloader', 'nano', 'terminal', 'cartoon', 'thumbnail'
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

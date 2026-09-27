const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

async function getVqd(query) {
  try {
    const res = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    const m = html.match(/vqd=([0-9-_]+)/);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}

async function searchImages(query) {
  const vqd = await getVqd(query);
  if (!vqd) return [];
  const url = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,type:photo,&p=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://duckduckgo.com/'
    }
  });
  const data = await res.json();
  return data.results || [];
}

function isValidImage(buf) {
  if (!buf || buf.length < 15000) return false;
  // JPEG
  if (buf[0] === 0xFF && buf[1] === 0xD8) return true;
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
  // WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

async function downloadCandidate(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*'
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    return isValidImage(buf) ? buf : null;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

// Items that need exact, verified replacement
const itemsToFix = [
  // WRAPS
  {
    file: 'corn_cheese_wrap.jpg',
    query: 'corn cheese wrap frankie recipe',
    mustInclude: ['wrap', 'frankie', 'roll', 'corn', 'cheese']
  },
  {
    file: 'aloo_tikki_wrap.jpg',
    query: 'aloo kathi roll frankie recipe',
    mustInclude: ['aloo', 'kathi', 'roll', 'frankie', 'wrap', 'potato']
  },
  {
    file: 'veggie_delight_wrap.jpg',
    query: 'fresh veg tortilla wrap roll recipe',
    mustInclude: ['wrap', 'roll', 'veg', 'tortilla', 'burrito']
  },

  // BURGERS
  {
    file: 'double_tikki_burger.jpg',
    query: 'double patty veg burger recipe',
    mustInclude: ['burger', 'patty', 'veggie']
  },
  {
    file: 'cheese_paneer_burger.jpg',
    query: 'crispy paneer burger cheese slice recipe',
    mustInclude: ['paneer', 'burger']
  },
  {
    file: 'paneer_burger.jpg',
    query: 'paneer tikka burger recipe street food',
    mustInclude: ['paneer', 'burger']
  },

  // MOMOS & SNACKS
  {
    file: 'cheese_corn_momos.jpg',
    query: 'cheese corn momos recipe food',
    mustInclude: ['momos', 'momo', 'corn', 'cheese', 'dumpling']
  },
  {
    file: 'kurkure_fry_momos.jpg',
    query: 'crispy kurkure momos recipe fried',
    mustInclude: ['kurkure', 'momos', 'momo', 'crispy']
  },
  {
    file: 'paneer_momos.jpg',
    query: 'steamed paneer momos recipe food',
    mustInclude: ['paneer', 'momos', 'momo', 'dumpling']
  },
  {
    file: 'veg_fry_momos.jpg',
    query: 'crispy veg fried momos recipe',
    mustInclude: ['fried', 'momos', 'momo']
  },
  {
    file: 'spring_roll.jpg',
    query: 'crispy veg spring rolls recipe food blog',
    mustInclude: ['spring', 'roll', 'rolls']
  },
  {
    file: 'peanut_chaat.jpg',
    query: 'spicy peanut chaat salad recipe indian',
    mustInclude: ['peanut', 'chaat']
  },
  {
    file: 'kurkure_chaat.jpg',
    query: 'street style kurkure chaat recipe',
    mustInclude: ['kurkure', 'chaat', 'bhel']
  },

  // PATTIES
  {
    file: 'paneer_tikka_patties.jpg',
    query: 'paneer puff pastry patties indian bakery recipe',
    mustInclude: ['puff', 'patties', 'patty', 'paneer']
  },
  {
    file: 'paneer_patties.jpg',
    query: 'spiced paneer puff patty indian recipe',
    mustInclude: ['paneer', 'puff', 'patty', 'patties']
  },
  {
    file: 'cheese_patties.jpg',
    query: 'cheese puff pastry patty golden flaky recipe',
    mustInclude: ['cheese', 'puff', 'pastry', 'patty', 'patties']
  },
  {
    file: 'pizza_patties.jpg',
    query: 'pizza puff pastry mcdonalds style recipe',
    mustInclude: ['pizza', 'puff', 'patty']
  },

  // MAGGI
  {
    file: 'paneer_tikka_maggi.jpg',
    query: 'paneer tikka maggi recipe street food',
    mustInclude: ['maggi', 'paneer', 'noodles']
  },
  {
    file: 'corn_cheese_maggi.jpg',
    query: 'cheese corn maggi recipe street style',
    mustInclude: ['corn', 'cheese', 'maggi', 'noodles']
  },
  {
    file: 'cheese_maggi.jpg',
    query: 'cheesy masala maggi recipe bowl',
    mustInclude: ['cheese', 'cheesy', 'maggi']
  },

  // WAFFLES & DESSERTS
  {
    file: 'brownie_nutella_waffle.jpg',
    query: 'nutella brownie belgian waffle chocolate recipe',
    mustInclude: ['waffle', 'waffles', 'brownie', 'nutella']
  },
  {
    file: 'kitkat_nutella_waffle.jpg',
    query: 'kitkat nutella waffle chocolate recipe',
    mustInclude: ['kitkat', 'kit kat', 'waffle', 'waffles', 'nutella']
  },
  {
    file: 'kitkat_waffle.jpg',
    query: 'kit kat waffle dessert cafe recipe',
    mustInclude: ['kitkat', 'kit kat', 'waffle', 'waffles']
  },
  {
    file: 'ice_cream_waffle.jpg',
    query: 'belgian waffle with vanilla ice cream scoop recipe',
    mustInclude: ['waffle', 'waffles', 'ice cream']
  },
  {
    file: 'nutella_brownie.jpg',
    query: 'fudgy nutella chocolate brownie square recipe',
    mustInclude: ['brownie', 'brownies', 'nutella']
  },

  // SHAKES & BEVERAGES
  {
    file: 'tot_special_shake.jpg',
    query: 'loaded chocolate freakshake monster shake recipe',
    mustInclude: ['freakshake', 'shake', 'milkshake']
  },
  {
    file: 'strawberry_shake.jpg',
    query: 'creamy strawberry milkshake whipped cream glass recipe',
    mustInclude: ['strawberry', 'milkshake', 'shake']
  },
  {
    file: 'strawberry_mocktail.jpg',
    query: 'sparkling strawberry mocktail mint glass recipe',
    mustInclude: ['strawberry', 'mocktail', 'drink', 'cocktail', 'cooler']
  },
  {
    file: 'strawberry_ice_tea.jpg',
    query: 'fresh strawberry iced tea mint lemon glass recipe',
    mustInclude: ['strawberry', 'tea', 'iced']
  },
  {
    file: 'sweet_corn_soup.jpg',
    query: 'creamy veg sweet corn soup bowl recipe',
    mustInclude: ['corn', 'soup']
  },
  {
    file: 'cranberry_mojito.jpg',
    query: 'sparkling cranberry mojito fresh mint lime glass recipe',
    mustInclude: ['cranberry', 'mojito']
  },
  {
    file: 'cranberry_mocktail.jpg',
    query: 'cranberry mocktail fizz glass rosemary recipe',
    mustInclude: ['cranberry', 'mocktail', 'drink', 'cocktail', 'fizz']
  },
  {
    file: 'orange_mojito.jpg',
    query: 'fresh orange mojito mint citrus drink recipe',
    mustInclude: ['orange', 'mojito']
  },
  {
    file: 'orange_ice_tea.jpg',
    query: 'iced orange tea fresh orange slices glass recipe',
    mustInclude: ['orange', 'tea', 'iced']
  },

  // COMBOS
  {
    file: 'combo_pizza_sandwich_coffee.jpg',
    query: 'pizza sandwich cold coffee cafe meal combo spread',
    mustInclude: ['pizza', 'sandwich', 'combo', 'cafe', 'food', 'meal']
  }
];

async function run() {
  console.log(`Starting replacement of ${itemsToFix.length} specific items...`);
  let fixedCount = 0;

  for (const item of itemsToFix) {
    console.log(`\nProcessing: ${item.file} (Query: "${item.query}")`);
    const results = await searchImages(item.query);
    if (!results || results.length === 0) {
      console.warn(`  No search results for ${item.file}`);
      continue;
    }

    let success = false;
    for (const r of results) {
      const titleLower = (r.title || '').toLowerCase();
      const hasMatch = item.mustInclude.some(term => titleLower.includes(term.toLowerCase()));
      if (!hasMatch) continue;

      // Filter out stock site watermarks or suspicious non-food terms
      if (/stock|adobe|alamy|getty|shutterstock|depositphotos|vector|cartoon|diagram|meme|saree|dress|model|chart|graph|map/i.test(titleLower)) {
        continue;
      }

      const imgUrl = r.image;
      if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) continue;

      const buf = await downloadCandidate(imgUrl);
      if (buf) {
        const dest1 = path.join(srcDir, item.file);
        const dest2 = path.join(targetDir, item.file);
        fs.writeFileSync(dest1, buf);
        fs.writeFileSync(dest2, buf);
        console.log(`  -> SUCCESS: ${item.file} from "${r.title.slice(0, 50)}" (${(buf.length / 1024).toFixed(1)} KB)`);
        success = true;
        fixedCount++;
        break;
      }
    }

    if (!success) {
      console.error(`  -> FAILED to find validated image for ${item.file}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Completed: ${fixedCount} / ${itemsToFix.length} items replaced with validated food photos!`);
}

run();

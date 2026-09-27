const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

async function getVqd(query) {
  try {
    const res = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
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
  try {
    const vqd = await getVqd(query);
    if (!vqd) return [];
    const url = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,type:photo,&p=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
}

function isValidImageBuffer(buf) {
  if (!buf || buf.length < 10000) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
  // WEBP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

async function downloadImage(url, destPath, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
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

const items = [
  // Best sellers
  { id: "bs-1", file: "farm_house_pizza.jpg", query: "farmhouse vegetable pizza bell pepper sweet corn mozzarella" },
  { id: "bs-2", file: "nutella_cold_coffee.jpg", query: "nutella cold coffee iced glass chocolate drizzle" },
  { id: "bs-3", file: "special_tot_burger.jpg", query: "gourmet loaded cafe cheese burger crispy patty secret sauce" },
  { id: "bs-4", file: "tandoori_gravy_momos.jpg", query: "tandoori gravy momos red spicy cream coriander" },

  // Cold coffee & hot coffee
  { id: "cc-1", file: "brownie_cold_coffee.jpg", query: "brownie cold coffee frappe glass chocolate fudge" },
  { id: "cc-2", file: "hazelnut_cold_coffee.jpg", query: "hazelnut iced coffee cold brew glass" },
  { id: "cc-3", file: "caramel_cold_coffee.jpg", query: "caramel iced latte glass drizzle" },
  { id: "cc-ch", file: "chocolate_cold_coffee.jpg", query: "chocolate cold coffee frappe mocha glass" },
  { id: "cc-4", file: "choco_chips_cold_coffee.jpg", query: "iced coffee chocolate chips topping foam" },
  { id: "cc-5", file: "regular_cold_coffee.jpg", query: "classic cafe cold coffee froth glass" },
  { id: "hc-1", file: "hot_chocolate.jpg", query: "rich hot chocolate mug cocoa powder marshmallows" },
  { id: "hc-2", file: "hazelnut_hot_coffee.jpg", query: "hazelnut cappuccino latte art cup" },
  { id: "hc-3", file: "vanilla_hot_coffee.jpg", query: "vanilla latte coffee cup latte art" },
  { id: "hc-4", file: "regular_hot_coffee.jpg", query: "steaming hot cappuccino cup saucer froth" },

  // Mojitos, mocktails, soups & iced teas
  { id: "bev-1", file: "cranberry_mojito.jpg", query: "cranberry mojito drink mint lime ice glass" },
  { id: "bev-2", file: "blueberry_mojito.jpg", query: "blueberry mojito fresh blueberries mint crushed ice" },
  { id: "bev-3", file: "strawberry_mojito.jpg", query: "strawberry mojito cocktail glass mint lime" },
  { id: "bev-om", file: "orange_mojito.jpg", query: "orange mojito mocktail mint orange slice ice" },
  { id: "bev-4", file: "watermelon_mojito.jpg", query: "watermelon mojito fresh mint crushed ice glass" },
  { id: "bev-5", file: "virgin_mojito.jpg", query: "classic virgin mojito lime mint club soda glass" },
  { id: "bev-6", file: "blue_lagoon_mocktail.jpg", query: "blue lagoon mocktail blue curacao lemon slice" },
  { id: "bev-7", file: "peach_mocktail.jpg", query: "peach mocktail sparkling drink glass mint" },
  { id: "bev-cm", file: "cranberry_mocktail.jpg", query: "cranberry mocktail sparkling fizz glass" },
  { id: "bev-bm", file: "blueberry_mocktail.jpg", query: "sparkling blueberry mocktail drink glass" },
  { id: "bev-sm", file: "strawberry_mocktail.jpg", query: "sparkling strawberry mocktail glass ice" },
  { id: "bev-oit", file: "orange_ice_tea.jpg", query: "orange iced tea glass mint slice" },
  { id: "bev-9", file: "blueberry_ice_tea.jpg", query: "blueberry iced tea glass lemon" },
  { id: "bev-sit", file: "strawberry_ice_tea.jpg", query: "strawberry iced tea glass mint lemon" },
  { id: "bev-pit", file: "peach_ice_tea.jpg", query: "peach iced tea glass mint peach slice" },
  { id: "bev-8", file: "lemon_ice_tea.jpg", query: "lemon iced tea glass mint fresh lemon slice" },
  { id: "sp-1", file: "hot_sour_soup.jpg", query: "hot and sour soup bowl indo chinese" },
  { id: "sp-2", file: "sweet_corn_soup.jpg", query: "sweet corn soup bowl creamy" },
  { id: "sp-3", file: "tomato_soup.jpg", query: "creamy tomato soup bowl croutons" },

  // Pizzas
  { id: "pz-1", file: "peppy_paneer_pizza.jpg", query: "peppy paneer pizza capsicum paprika cheese" },
  { id: "pz-2", file: "peri_peri_paneer_pizza.jpg", query: "peri peri paneer pizza spicy cheese" },
  { id: "pz-3", file: "double_cheese_pizza.jpg", query: "double cheese margherita pizza cheese pull" },
  { id: "pz-4", file: "otc_pizza.jpg", query: "onion tomato capsicum veg pizza" },
  { id: "pz-5", file: "corn_cheese_pizza.jpg", query: "sweet corn cheese pizza mozzarella" },
  { id: "pz-cap", file: "capsicum_pizza.jpg", query: "green bell pepper capsicum cheese pizza" },
  { id: "pz-on", file: "onion_pizza.jpg", query: "onion cheese pizza red onions" },
  { id: "pz-6", file: "margherita_pizza.jpg", query: "classic italian margherita pizza fresh basil mozzarella" },

  // Burgers
  { id: "bg-1", file: "cheese_paneer_burger.jpg", query: "paneer burger cheese slice herb mayo lettuce" },
  { id: "bg-2", file: "double_tikki_burger.jpg", query: "double veg tikki burger stacked" },
  { id: "bg-3", file: "mexican_cheese_burger.jpg", query: "mexican burger jalapenos salsa cheese" },
  { id: "bg-4", file: "tandoori_cheese_burger.jpg", query: "tandoori burger crispy patty cheese sauce" },
  { id: "bg-cs", file: "cheese_slice_burger.jpg", query: "cheeseburger melted american cheese slice veg patty" },
  { id: "bg-5", file: "paneer_burger.jpg", query: "crispy paneer patty burger bun" },
  { id: "bg-6", file: "veg_tikki_burger.jpg", query: "crispy veg tikki burger tomato lettuce" },
  { id: "bg-7", file: "aloo_tikki_burger.jpg", query: "crispy aloo tikki burger sesame bun" },

  // Sandwiches & wraps
  { id: "sw-1", file: "cheese_burst_sandwich.jpg", query: "cheese burst grilled sandwich molten cheese pull" },
  { id: "sw-2", file: "paneer_tikka_sandwich.jpg", query: "paneer tikka grilled sandwich tandoori spices" },
  { id: "sw-3", file: "mexican_cheese_sandwich.jpg", query: "mexican grilled sandwich sweet corn jalapeno cheese" },
  { id: "sw-4", file: "corn_cheese_sandwich.jpg", query: "sweet corn cheese grilled sandwich toastie" },
  { id: "sw-cg", file: "cheese_grill_sandwich.jpg", query: "golden brown grilled cheese sandwich melted" },
  { id: "sw-tg", file: "tandoori_grill_sandwich.jpg", query: "tandoori spiced grilled sandwich street style" },
  { id: "sw-5", file: "veg_grill_sandwich.jpg", query: "bombay veg grilled sandwich mint chutney cucumber tomato" },
  { id: "wr-1", file: "tandoori_paneer_wrap.jpg", query: "tandoori paneer kathi roll wrap" },
  { id: "wr-2", file: "corn_cheese_wrap.jpg", query: "sweet corn cheese tortilla wrap" },
  { id: "wr-3", file: "veggie_delight_wrap.jpg", query: "healthy fresh veggie wrap roll" },
  { id: "wr-4", file: "aloo_tikki_wrap.jpg", query: "aloo tikki kathi roll wrap" },

  // Shakes
  { id: "sh-1", file: "tot_special_shake.jpg", query: "loaded freakshake milkshake dry fruits wafer toppings" },
  { id: "sh-2", file: "nutella_chocolate_shake.jpg", query: "nutella chocolate milkshake whipped cream jar" },
  { id: "sh-3", file: "brownie_shake.jpg", query: "chocolate brownie milkshake fudge topping" },
  { id: "sh-4", file: "popcorn_shake.jpg", query: "caramel popcorn milkshake whipped cream" },
  { id: "sh-bb", file: "blueberry_shake.jpg", query: "blueberry milkshake thick purple fresh berries" },
  { id: "sh-mg", file: "mango_shake.jpg", query: "thick mango milkshake fresh mango pulp" },
  { id: "sh-bub", file: "bubble_shake.jpg", query: "boba bubble tea shake tapioca pearls" },
  { id: "sh-5", file: "kesar_elaichi_shake.jpg", query: "kesar elaichi saffron milkshake pistachios" },
  { id: "sh-bs", file: "butterscotch_shake.jpg", query: "butterscotch milkshake caramel praline nuts" },
  { id: "sh-6", file: "kit_kat_shake.jpg", query: "kit kat chocolate milkshake wafer fingers" },
  { id: "sh-7", file: "oreo_shake.jpg", query: "oreo cookies and cream milkshake whipped cream" },
  { id: "sh-cs", file: "chocolate_shake.jpg", query: "creamy chocolate fudge milkshake glass" },
  { id: "sh-ss", file: "strawberry_shake.jpg", query: "strawberry milkshake pink whipped cream fresh strawberry" },
  { id: "sh-8", file: "paan_shake.jpg", query: "paan gulkand milkshake pistachio rose petals" },
  { id: "sh-vs", file: "vanilla_shake.jpg", query: "vanilla bean milkshake whipped cream cherry" },

  // Waffles & Desserts
  { id: "wf-1", file: "ice_cream_waffle.jpg", query: "belgian waffle scoops ice cream chocolate drizzle" },
  { id: "wf-2", file: "brownie_nutella_waffle.jpg", query: "waffle brownie crumble nutella chocolate" },
  { id: "wf-knw", file: "kitkat_nutella_waffle.jpg", query: "waffle nutella kit kat pieces" },
  { id: "wf-3", file: "nutella_waffle.jpg", query: "golden belgian waffle warm nutella choco chips" },
  { id: "wf-kw", file: "kitkat_waffle.jpg", query: "waffle milk chocolate kit kat fingers" },
  { id: "wf-ccw", file: "choco_chips_waffle.jpg", query: "belgian waffle chocolate chips fudge" },
  { id: "wf-dcw", file: "dark_chocolate_waffle.jpg", query: "crispy waffle dark chocolate sauce drizzle" },
  { id: "wf-4", file: "nutella_brownie.jpg", query: "fudge chocolate brownie warm nutella drizzle" },
  { id: "wf-5", file: "brownie_with_icecream.jpg", query: "sizzling brownie vanilla ice cream scoop chocolate sauce" },
  { id: "wf-bwc", file: "brownie_with_chocolate.jpg", query: "warm chocolate fudge brownie molten sauce" },
  { id: "wf-6", file: "choco_lava_cake.jpg", query: "molten chocolate lava cake oozing center" },

  // Momos & Snacks
  { id: "mo-1", file: "cheese_corn_momos.jpg", query: "steamed cheese corn momos dumplings bamboo" },
  { id: "mo-2", file: "kurkure_fry_momos.jpg", query: "kurkure crispy fried momos chutney" },
  { id: "mo-3", file: "paneer_momos.jpg", query: "steamed paneer momos dumplings red spicy chutney" },
  { id: "mo-vf", file: "veg_fry_momos.jpg", query: "crispy golden fried momos dumplings" },
  { id: "fr-1", file: "honey_chilli_potato.jpg", query: "honey chilli potato crispy sesame seeds spring onion" },
  { id: "fr-cp", file: "chilli_potato.jpg", query: "crispy chilli potato wok tossed bell peppers" },
  { id: "fr-2", file: "cheese_fries.jpg", query: "crispy french fries smothered melted cheese sauce" },
  { id: "fr-3", file: "peri_peri_fries.jpg", query: "peri peri french fries spicy red seasoning" },
  { id: "fr-4", file: "masala_fries.jpg", query: "chatpata masala french fries indian spices" },
  { id: "fr-5", file: "salted_fries.jpg", query: "classic golden crispy salted french fries basket" },
  { id: "sn-sr", file: "spring_roll.jpg", query: "crispy vegetable spring rolls sweet chili sauce cut" },
  { id: "pt-1", file: "paneer_tikka_patties.jpg", query: "paneer tikka puff pastry turnover bakery" },
  { id: "pt-2", file: "pizza_patties.jpg", query: "pizza puff pastry pocket melted cheese" },
  { id: "pt-3", file: "cheese_patties.jpg", query: "flaky cheese puff pastry golden" },
  { id: "pt-tp", file: "tandoori_patties.jpg", query: "spicy tandoori veg puff pastry" },
  { id: "pt-pp", file: "paneer_patties.jpg", query: "paneer puff pastry indian bakery" },
  { id: "pt-4", file: "aloo_patties.jpg", query: "golden triangular aloo puff patty indian samosa puff" },
  { id: "ch-pc", file: "peanut_chaat.jpg", query: "spiced peanut chaat onions tomatoes coriander" },
  { id: "ch-kc", file: "kurkure_chaat.jpg", query: "kurkure chaat street snack bowl" },

  // Maggi
  { id: "mg-1", file: "corn_cheese_maggi.jpg", query: "cheese corn maggi noodles sweet corn melted cheese" },
  { id: "mg-2", file: "paneer_tikka_maggi.jpg", query: "paneer tikka maggi noodles grilled paneer cubes" },
  { id: "mg-3", file: "schezwan_maggi.jpg", query: "spicy schezwan maggi noodles red chili Indo Chinese" },
  { id: "mg-4", file: "punjabi_tadka_maggi.jpg", query: "punjabi tadka maggi noodles desi tomato onion" },
  { id: "mg-cm", file: "cheese_maggi.jpg", query: "cheese maggi noodles bowl melted cheddar layer" },
  { id: "mg-5", file: "tandoori_maggi.jpg", query: "smoky tandoori masala maggi noodles" },
  { id: "mg-vmm", file: "veg_masala_maggi.jpg", query: "vegetable masala maggi noodles peas carrots" },
  { id: "mg-6", file: "plain_maggi.jpg", query: "classic yellow masala maggi noodles bowl fork" },

  // Pasta
  { id: "ps-1", file: "makhani_pasta.jpg", query: "creamy makhani sauce penne pasta butter masala herbs" },
  { id: "ps-2", file: "pink_sauce_pasta.jpg", query: "penne alla vodka pink sauce pasta tomato cream" },
  { id: "ps-3", file: "white_sauce_pasta.jpg", query: "creamy garlic white sauce pasta penne alfredo bechamel" },
  { id: "ps-4", file: "red_sauce_pasta.jpg", query: "penne arrabbiata red sauce pasta tomato basil italian" },

  // Combos
  { id: "cb-1", file: "combo_pizza_sandwich_coffee.jpg", query: "cafe table pizza grilled sandwich iced cold coffee spread" },
  { id: "cb-2", file: "combo_burgers_fries_coffee.jpg", query: "fast food feast burgers french fries iced coffees" },
  { id: "cb-3", file: "combo_burger_fries_coffee.jpg", query: "cafe meal tray burger crispy fries iced cold coffee" }
];

async function processAll() {
  console.log(`Starting download for ${items.length} unique menu items...`);
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dest = path.join(srcDir, item.file);

    // If file already exists and is valid size, skip
    if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
      console.log(`[${i+1}/${items.length}] SKIP (already exists): ${item.file}`);
      // Ensure targetDir also has it
      const targetPath = path.join(targetDir, item.file);
      if (!fs.existsSync(targetPath)) fs.copyFileSync(dest, targetPath);
      skipCount++;
      continue;
    }

    console.log(`[${i+1}/${items.length}] Searching for: ${item.query}...`);
    const results = await searchImages(item.query);
    let downloaded = false;

    for (let r = 0; r < Math.min(results.length, 6); r++) {
      const candidateUrl = results[r].image;
      if (!candidateUrl) continue;
      // Skip if url contains svg or gif
      if (candidateUrl.includes('.svg') || candidateUrl.includes('.gif')) continue;

      const ok = await downloadImage(candidateUrl, dest);
      if (ok) {
        console.log(`  -> SUCCESS downloaded ${item.file} from candidate #${r+1} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
        downloaded = true;
        successCount++;
        break;
      }
    }

    if (!downloaded) {
      console.warn(`  -> FAILED to download ${item.file} after candidates`);
      failCount++;
    }

    // Small delay between searches to be gentle
    await new Promise(res => setTimeout(res, 250));
  }

  console.log('\n=======================================');
  console.log(`DOWNLOAD COMPLETE: ${successCount} downloaded, ${skipCount} skipped, ${failCount} failed.`);
  console.log('=======================================');
}

processAll();

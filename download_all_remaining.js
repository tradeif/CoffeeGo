const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

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
  if (!buf || buf.length < 15000) return false;
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

// Complete list of items with tailored search queries
const allItems = [
  // COFFEE
  { id: "cc-4", file: "choco_chips_cold_coffee.jpg", query: "cold coffee with choco chips glass recipe" },
  { id: "hc-2", file: "hazelnut_hot_coffee.jpg", query: "hazelnut hot cappuccino latte art cup" },
  { id: "hc-3", file: "vanilla_hot_coffee.jpg", query: "vanilla hot latte coffee cup latte art" },
  { id: "hc-4", file: "regular_hot_coffee.jpg", query: "hot beaten coffee cup saucer cafe" },

  // MOJITOS & BEVERAGES
  { id: "bev-om", file: "orange_mojito.jpg", query: "fresh orange mojito drink mint glass" },
  { id: "bev-4", file: "watermelon_mojito.jpg", query: "watermelon mojito mint crushed ice glass" },
  { id: "bev-5", file: "virgin_mojito.jpg", query: "classic virgin mojito lime mint club soda glass" },
  { id: "bev-6", file: "blue_lagoon_mocktail.jpg", query: "blue lagoon mocktail curacao lemon glass" },
  { id: "bev-7", file: "peach_mocktail.jpg", query: "peach mocktail sparkling drink glass" },
  { id: "bev-cm", file: "cranberry_mocktail.jpg", query: "cranberry mocktail fizz glass mint" },
  { id: "bev-bm", file: "blueberry_mocktail.jpg", query: "sparkling blueberry mocktail drink glass" },
  { id: "bev-sm", file: "strawberry_mocktail.jpg", query: "strawberry mocktail crushed ice glass" },
  { id: "bev-oit", file: "orange_ice_tea.jpg", query: "orange iced tea fresh orange slice glass" },
  { id: "bev-9", file: "blueberry_ice_tea.jpg", query: "blueberry iced tea glass mint" },
  { id: "bev-sit", file: "strawberry_ice_tea.jpg", query: "strawberry iced tea glass mint lemon" },
  { id: "bev-pit", file: "peach_ice_tea.jpg", query: "fresh peach iced tea glass mint" },
  { id: "bev-8", file: "lemon_ice_tea.jpg", query: "classic lemon iced tea glass lemon slice mint" },
  { id: "sp-1", file: "hot_sour_soup.jpg", query: "veg hot and sour soup bowl indo chinese" },
  { id: "sp-2", file: "sweet_corn_soup.jpg", query: "sweet corn veg soup bowl creamy" },
  { id: "sp-3", file: "tomato_soup.jpg", query: "creamy tomato soup bowl croutons basil" },

  // PIZZAS
  { id: "pz-1", file: "peppy_paneer_pizza.jpg", query: "peppy paneer pizza capsicum red paprika" },
  { id: "pz-2", file: "peri_peri_paneer_pizza.jpg", query: "peri peri paneer pizza spicy cheese" },
  { id: "pz-3", file: "double_cheese_pizza.jpg", query: "double cheese margherita pizza cheese pull" },
  { id: "pz-4", file: "otc_pizza.jpg", query: "onion tomato capsicum pizza veg" },
  { id: "pz-cap", file: "capsicum_pizza.jpg", query: "green capsicum bell pepper pizza cheese" },
  { id: "pz-on", file: "onion_pizza.jpg", query: "red onion pizza mozzarella cheese" },
  { id: "pz-6", file: "margherita_pizza.jpg", query: "margherita pizza fresh basil mozzarella" },

  // BURGERS
  { id: "bg-1", file: "cheese_paneer_burger.jpg", query: "paneer burger cheese slice herb mayo" },
  { id: "bg-2", file: "double_tikki_burger.jpg", query: "double tikki veg burger double patty" },
  { id: "bg-3", file: "mexican_cheese_burger.jpg", query: "mexican burger jalapenos salsa cheese" },
  { id: "bg-4", file: "tandoori_cheese_burger.jpg", query: "tandoori burger crispy patty spicy sauce" },
  { id: "bg-cs", file: "cheese_slice_burger.jpg", query: "cheeseburger melted american cheese slice" },
  { id: "bg-5", file: "paneer_burger.jpg", query: "crispy paneer patty burger lettuce" },
  { id: "bg-6", file: "veg_tikki_burger.jpg", query: "crispy veg tikki burger cafe style" },

  // SANDWICHES & WRAPS
  { id: "sw-2", file: "paneer_tikka_sandwich.jpg", query: "paneer tikka grilled sandwich tandoori" },
  { id: "sw-3", file: "mexican_cheese_sandwich.jpg", query: "mexican grilled sandwich corn jalapeno cheese" },
  { id: "sw-4", file: "corn_cheese_sandwich.jpg", query: "sweet corn cheese toastie grilled sandwich" },
  { id: "sw-cg", file: "cheese_grill_sandwich.jpg", query: "golden grilled cheese sandwich toasted" },
  { id: "sw-tg", file: "tandoori_grill_sandwich.jpg", query: "tandoori grilled sandwich spicy street food" },
  { id: "sw-5", file: "veg_grill_sandwich.jpg", query: "bombay veg grilled sandwich mint chutney" },
  { id: "wr-1", file: "tandoori_paneer_wrap.jpg", query: "paneer kathi roll tandoori wrap" },
  { id: "wr-2", file: "corn_cheese_wrap.jpg", query: "sweet corn cheese tortilla wrap" },
  { id: "wr-3", file: "veggie_delight_wrap.jpg", query: "healthy fresh veggie wrap roll" },
  { id: "wr-4", file: "aloo_tikki_wrap.jpg", query: "aloo tikki kathi roll wrap" },

  // SHAKES
  { id: "sh-1", file: "tot_special_shake.jpg", query: "chocolate freakshake dry fruits toppings wafer" },
  { id: "sh-2", file: "nutella_chocolate_shake.jpg", query: "nutella milkshake whipped cream jar" },
  { id: "sh-3", file: "brownie_shake.jpg", query: "brownie milkshake chocolate fudge" },
  { id: "sh-4", file: "popcorn_shake.jpg", query: "caramel popcorn milkshake whipped cream" },
  { id: "sh-bb", file: "blueberry_shake.jpg", query: "thick blueberry milkshake fresh berries glass" },
  { id: "sh-mg", file: "mango_shake.jpg", query: "thick mango milkshake fresh mango pulp" },
  { id: "sh-bub", file: "bubble_shake.jpg", query: "boba bubble milk tea tapioca pearls glass" },
  { id: "sh-5", file: "kesar_elaichi_shake.jpg", query: "kesar elaichi saffron milk shake pistachios" },
  { id: "sh-bs", file: "butterscotch_shake.jpg", query: "butterscotch milkshake caramel praline" },
  { id: "sh-6", file: "kit_kat_shake.jpg", query: "kit kat chocolate milkshake whipped cream" },
  { id: "sh-7", file: "oreo_shake.jpg", query: "oreo cookies and cream milkshake whipped cream" },
  { id: "sh-cs", file: "chocolate_shake.jpg", query: "creamy chocolate fudge milkshake glass" },
  { id: "sh-ss", file: "strawberry_shake.jpg", query: "strawberry milkshake pink whipped cream fresh strawberry" },
  { id: "sh-8", file: "paan_shake.jpg", query: "paan milkshake gulkand pistachio rose" },
  { id: "sh-vs", file: "vanilla_shake.jpg", query: "classic vanilla milkshake whipped cream cherry" },

  // WAFFLES & DESSERTS
  { id: "wf-1", file: "ice_cream_waffle.jpg", query: "belgian waffle with scoops ice cream chocolate drizzle" },
  { id: "wf-2", file: "brownie_nutella_waffle.jpg", query: "waffle brownie crumble nutella chocolate sauce" },
  { id: "wf-knw", file: "kitkat_nutella_waffle.jpg", query: "waffle nutella kit kat pieces" },
  { id: "wf-3", file: "nutella_waffle.jpg", query: "belgian waffle warm nutella choco chips" },
  { id: "wf-kw", file: "kitkat_waffle.jpg", query: "waffle milk chocolate kit kat fingers" },
  { id: "wf-ccw", file: "choco_chips_waffle.jpg", query: "belgian waffle chocolate chips sauce" },
  { id: "wf-dcw", file: "dark_chocolate_waffle.jpg", query: "crispy waffle dark chocolate sauce drizzle" },
  { id: "wf-4", file: "nutella_brownie.jpg", query: "chocolate brownie warm nutella drizzle" },
  { id: "wf-5", file: "brownie_with_icecream.jpg", query: "sizzling brownie vanilla ice cream scoop chocolate sauce" },
  { id: "wf-bwc", file: "brownie_with_chocolate.jpg", query: "warm chocolate fudge brownie molten sauce" },
  { id: "wf-6", file: "choco_lava_cake.jpg", query: "molten chocolate lava cake oozing center" },

  // MOMOS & SNACKS
  { id: "mo-1", file: "cheese_corn_momos.jpg", query: "steamed cheese corn momos dumplings bamboo" },
  { id: "mo-2", file: "kurkure_fry_momos.jpg", query: "kurkure momos crispy fried crunchy chutney" },
  { id: "mo-3", file: "paneer_momos.jpg", query: "steamed paneer momos dumplings red spicy chutney" },
  { id: "mo-vf", file: "veg_fry_momos.jpg", query: "crispy golden fried veg momos dumplings" },
  { id: "fr-1", file: "honey_chilli_potato.jpg", query: "crispy honey chilli potato sesame seeds" },
  { id: "fr-cp", file: "chilli_potato.jpg", query: "crispy chilli potato wok tossed Indo Chinese" },
  { id: "fr-2", file: "cheese_fries.jpg", query: "french fries smothered melted cheddar cheese sauce" },
  { id: "fr-3", file: "peri_peri_fries.jpg", query: "peri peri french fries spicy seasoning basket" },
  { id: "fr-4", file: "masala_fries.jpg", query: "masala french fries chatpata spices basket" },
  { id: "fr-5", file: "salted_fries.jpg", query: "crispy golden salted french fries basket" },
  { id: "sn-sr", file: "spring_roll.jpg", query: "crispy vegetable spring rolls sweet chili sauce" },
  { id: "pt-1", file: "paneer_tikka_patties.jpg", query: "paneer puff pastry turnover bakery" },
  { id: "pt-2", file: "pizza_patties.jpg", query: "pizza puff pastry pocket melted cheese" },
  { id: "pt-3", file: "cheese_patties.jpg", query: "cheese puff pastry golden flaky bakery" },
  { id: "pt-tp", file: "tandoori_patties.jpg", query: "tandoori puff pastry vegetable spicy" },
  { id: "pt-pp", file: "paneer_patties.jpg", query: "paneer puff pastry indian bakery" },
  { id: "pt-4", file: "aloo_patties.jpg", query: "aloo puff pastry indian bakery samosa puff" },
  { id: "ch-pc", file: "peanut_chaat.jpg", query: "spiced peanut chaat onions tomatoes coriander bowl" },
  { id: "ch-kc", file: "kurkure_chaat.jpg", query: "kurkure chaat street snack bowl" },

  // MAGGI
  { id: "mg-1", file: "corn_cheese_maggi.jpg", query: "cheese corn maggi noodles sweet corn melted cheese" },
  { id: "mg-2", file: "paneer_tikka_maggi.jpg", query: "paneer maggi noodles grilled paneer cubes" },
  { id: "mg-3", file: "schezwan_maggi.jpg", query: "spicy schezwan maggi noodles red chili Indo Chinese" },
  { id: "mg-4", file: "punjabi_tadka_maggi.jpg", query: "punjabi tadka maggi noodles desi tomato onion" },
  { id: "mg-cm", file: "cheese_maggi.jpg", query: "cheese maggi noodles bowl melted cheddar layer" },
  { id: "mg-5", file: "tandoori_maggi.jpg", query: "tandoori masala maggi noodles spicy" },
  { id: "mg-vmm", file: "veg_masala_maggi.jpg", query: "vegetable masala maggi noodles peas carrots" },
  { id: "mg-6", file: "plain_maggi.jpg", query: "classic yellow masala maggi noodles bowl fork" },

  // COMBOS
  { id: "cb-1", file: "combo_pizza_sandwich_coffee.jpg", query: "pizza sandwich iced cold coffee cafe meal" },
  { id: "cb-2", file: "combo_burgers_fries_coffee.jpg", query: "burgers french fries iced cold coffee combo" },
  { id: "cb-3", file: "combo_burger_fries_coffee.jpg", query: "burger french fries iced cold coffee meal" }
];

async function run() {
  console.log(`Checking and downloading ${allItems.length} remaining items...`);
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const dest = path.join(srcDir, item.file);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
      console.log(`[${i+1}/${allItems.length}] EXISTS: ${item.file} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
      const targetPath = path.join(targetDir, item.file);
      if (!fs.existsSync(targetPath)) fs.copyFileSync(dest, targetPath);
      skippedCount++;
      continue;
    }

    console.log(`[${i+1}/${allItems.length}] Searching: ${item.query}...`);
    const urls = await searchBing(item.query);
    let success = false;

    for (let c = 0; c < Math.min(urls.length, 10); c++) {
      const u = urls[c];
      success = await downloadCandidate(u, dest);
      if (success) {
        console.log(`  -> SUCCESS: ${item.file} from #${c+1} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
        downloadedCount++;
        break;
      }
    }

    if (!success) {
      console.warn(`  -> FAILED: ${item.file}`);
      failedCount++;
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n=======================================');
  console.log(`COMPLETE: ${downloadedCount} downloaded, ${skippedCount} existed, ${failedCount} failed.`);
  console.log('=======================================');
}

run();

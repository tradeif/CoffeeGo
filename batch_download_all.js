const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

async function searchDDG(query) {
  try {
    const r1 = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&t=h_&iax=images&ia=images', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await r1.text();
    const vqdMatch = html.match(/vqd=([0-9-_]+)/);
    if (!vqdMatch) return [];
    const vqd = vqdMatch[1];
    const r2 = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + vqd + '&f=,,,type:photo,&p=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    });
    if (!r2.ok) return [];
    const d = await r2.json();
    return d.results || [];
  } catch (e) {
    return [];
  }
}

function isValidImageBuffer(buf) {
  if (!buf || buf.length < 15000) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
  // WEBP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

async function downloadCandidate(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
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
  // 1. BEST SELLERS
  { id: "bs-1", file: "farm_house_pizza.jpg", query: "farmhouse vegetable pizza bell pepper sweet corn mozzarella recipe" },
  { id: "bs-2", file: "nutella_cold_coffee.jpg", query: "nutella cold coffee iced glass chocolate drizzle" },
  { id: "bs-3", file: "special_tot_burger.jpg", query: "gourmet loaded cafe cheese burger crispy patty secret sauce" },
  { id: "bs-4", file: "tandoori_gravy_momos.jpg", query: "tandoori gravy momos red spicy cream coriander" },

  // 2. COLD COFFEE & HOT COFFEE
  { id: "cc-1", file: "brownie_cold_coffee.jpg", query: "fudge brownie iced coffee tall glass recipe" },
  { id: "cc-2", file: "hazelnut_cold_coffee.jpg", query: "hazelnut iced coffee glass recipe" },
  { id: "cc-3", file: "caramel_cold_coffee.jpg", query: "iced caramel macchiato drizzle glass recipe" },
  { id: "cc-ch", file: "chocolate_cold_coffee.jpg", query: "iced chocolate mocha cold coffee recipe" },
  { id: "cc-4", file: "choco_chips_cold_coffee.jpg", query: "iced coffee chocolate chips topping glass" },
  { id: "cc-5", file: "regular_cold_coffee.jpg", query: "indian cafe style cold coffee froth recipe" },
  { id: "hc-1", file: "hot_chocolate.jpg", query: "rich hot chocolate mug whipped cream cocoa powder" },
  { id: "hc-2", file: "hazelnut_hot_coffee.jpg", query: "hazelnut cappuccino latte art mug" },
  { id: "hc-3", file: "vanilla_hot_coffee.jpg", query: "vanilla latte coffee cup latte art" },
  { id: "hc-4", file: "regular_hot_coffee.jpg", query: "steaming hot cappuccino cup saucer froth" },

  // 3. MOJITOS, MOCKTAILS, SOUPS & ICE TEA
  { id: "bev-1", file: "cranberry_mojito.jpg", query: "cranberry mojito drink mint lime ice glass recipe" },
  { id: "bev-2", file: "blueberry_mojito.jpg", query: "blueberry mojito drink recipe" },
  { id: "bev-3", file: "strawberry_mojito.jpg", query: "strawberry mojito drink recipe" },
  { id: "bev-om", file: "orange_mojito.jpg", query: "orange mojito cocktail fresh mint orange slice recipe" },
  { id: "bev-4", file: "watermelon_mojito.jpg", query: "watermelon mojito fresh mint crushed ice glass recipe" },
  { id: "bev-5", file: "virgin_mojito.jpg", query: "classic virgin mojito lime mint club soda glass recipe" },
  { id: "bev-6", file: "blue_lagoon_mocktail.jpg", query: "blue lagoon mocktail blue curacao lemon slice recipe" },
  { id: "bev-7", file: "peach_mocktail.jpg", query: "sparkling peach mocktail drink glass mint recipe" },
  { id: "bev-cm", file: "cranberry_mocktail.jpg", query: "cranberry mocktail sparkling fizz glass recipe" },
  { id: "bev-bm", file: "blueberry_mocktail.jpg", query: "sparkling blueberry mocktail drink glass recipe" },
  { id: "bev-sm", file: "strawberry_mocktail.jpg", query: "sparkling strawberry mocktail glass crushed ice" },
  { id: "bev-oit", file: "orange_ice_tea.jpg", query: "orange iced tea glass mint slice recipe" },
  { id: "bev-9", file: "blueberry_ice_tea.jpg", query: "blueberry iced tea glass lemon recipe" },
  { id: "bev-sit", file: "strawberry_ice_tea.jpg", query: "strawberry iced tea glass mint lemon recipe" },
  { id: "bev-pit", file: "peach_ice_tea.jpg", query: "southern peach iced tea glass mint peach slice recipe" },
  { id: "bev-8", file: "lemon_ice_tea.jpg", query: "classic lemon iced tea glass mint fresh lemon slice recipe" },
  { id: "sp-1", file: "hot_sour_soup.jpg", query: "veg hot and sour soup bowl indo chinese recipe" },
  { id: "sp-2", file: "sweet_corn_soup.jpg", query: "creamy sweet corn veg soup bowl recipe" },
  { id: "sp-3", file: "tomato_soup.jpg", query: "creamy tomato soup bowl croutons fresh basil recipe" },

  // 4. PIZZAS
  { id: "pz-1", file: "peppy_paneer_pizza.jpg", query: "peppy paneer pizza capsicum red paprika recipe" },
  { id: "pz-2", file: "peri_peri_paneer_pizza.jpg", query: "peri peri paneer pizza spicy cheese recipe" },
  { id: "pz-3", file: "double_cheese_pizza.jpg", query: "double cheese margherita pizza cheese pull slice" },
  { id: "pz-4", file: "otc_pizza.jpg", query: "onion tomato capsicum veg pizza recipe" },
  { id: "pz-5", file: "corn_cheese_pizza.jpg", query: "sweet corn cheese pizza mozzarella recipe" },
  { id: "pz-cap", file: "capsicum_pizza.jpg", query: "green bell pepper capsicum cheese pizza recipe" },
  { id: "pz-on", file: "onion_pizza.jpg", query: "onion cheese pizza red onions mozzarella recipe" },
  { id: "pz-6", file: "margherita_pizza.jpg", query: "classic italian margherita pizza fresh basil mozzarella recipe" },

  // 5. BURGERS
  { id: "bg-1", file: "cheese_paneer_burger.jpg", query: "crispy paneer burger cheese slice herb mayo recipe" },
  { id: "bg-2", file: "double_tikki_burger.jpg", query: "double patty veg burger stacked high recipe" },
  { id: "bg-3", file: "mexican_cheese_burger.jpg", query: "mexican burger jalapenos salsa cheese recipe" },
  { id: "bg-4", file: "tandoori_cheese_burger.jpg", query: "tandoori burger crispy patty cheese sauce recipe" },
  { id: "bg-cs", file: "cheese_slice_burger.jpg", query: "cheeseburger melted american cheese slice veg patty recipe" },
  { id: "bg-5", file: "paneer_burger.jpg", query: "paneer tikka burger grilled bun recipe" },
  { id: "bg-6", file: "veg_tikki_burger.jpg", query: "crispy veg tikki burger tomato lettuce recipe" },
  { id: "bg-7", file: "aloo_tikki_burger.jpg", query: "crispy aloo tikki burger sesame bun recipe" },

  // 6. SANDWICHES & WRAPS
  { id: "sw-1", file: "cheese_burst_sandwich.jpg", query: "cheese burst grilled sandwich molten cheese pull recipe" },
  { id: "sw-2", file: "paneer_tikka_sandwich.jpg", query: "paneer tikka grilled sandwich tandoori spices recipe" },
  { id: "sw-3", file: "mexican_cheese_sandwich.jpg", query: "mexican grilled sandwich sweet corn jalapeno cheese recipe" },
  { id: "sw-4", file: "corn_cheese_sandwich.jpg", query: "sweet corn cheese grilled sandwich toastie recipe" },
  { id: "sw-cg", file: "cheese_grill_sandwich.jpg", query: "classic grilled cheese sandwich golden brown melted recipe" },
  { id: "sw-tg", file: "tandoori_grill_sandwich.jpg", query: "bombay tandoori grilled sandwich street style recipe" },
  { id: "sw-5", file: "veg_grill_sandwich.jpg", query: "bombay veg grilled sandwich mint chutney cucumber tomato recipe" },
  { id: "wr-1", file: "tandoori_paneer_wrap.jpg", query: "paneer kathi roll tandoori wrap recipe" },
  { id: "wr-2", file: "corn_cheese_wrap.jpg", query: "sweet corn cheese wrap tortilla recipe" },
  { id: "wr-3", file: "veggie_delight_wrap.jpg", query: "healthy vegetable wrap roll tortilla recipe" },
  { id: "wr-4", file: "aloo_tikki_wrap.jpg", query: "crispy aloo wrap kathi roll recipe" },

  // 7. SHAKES
  { id: "sh-1", file: "tot_special_shake.jpg", query: "loaded chocolate freakshake dry fruits wafer toppings recipe" },
  { id: "sh-2", file: "nutella_chocolate_shake.jpg", query: "nutella milkshake whipped cream glass jar recipe" },
  { id: "sh-3", file: "brownie_shake.jpg", query: "chocolate brownie milkshake fudge topping recipe" },
  { id: "sh-4", file: "popcorn_shake.jpg", query: "caramel popcorn milkshake whipped cream recipe" },
  { id: "sh-bb", file: "blueberry_shake.jpg", query: "blueberry milkshake thick purple fresh berries recipe" },
  { id: "sh-mg", file: "mango_shake.jpg", query: "thick mango milkshake fresh mango pulp recipe" },
  { id: "sh-bub", file: "bubble_shake.jpg", query: "boba bubble tea milk shake tapioca pearls recipe" },
  { id: "sh-5", file: "kesar_elaichi_shake.jpg", query: "kesar elaichi saffron milkshake pistachios recipe" },
  { id: "sh-bs", file: "butterscotch_shake.jpg", query: "butterscotch milkshake caramel praline nuts recipe" },
  { id: "sh-6", file: "kit_kat_shake.jpg", query: "kit kat chocolate milkshake wafer fingers recipe" },
  { id: "sh-7", file: "oreo_shake.jpg", query: "oreo cookies and cream milkshake whipped cream recipe" },
  { id: "sh-cs", file: "chocolate_shake.jpg", query: "creamy chocolate milkshake glass chocolate drizzle recipe" },
  { id: "sh-ss", file: "strawberry_shake.jpg", query: "strawberry milkshake pink whipped cream fresh strawberry recipe" },
  { id: "sh-8", file: "paan_shake.jpg", query: "paan gulkand milkshake pistachio rose petals recipe" },
  { id: "sh-vs", file: "vanilla_shake.jpg", query: "classic vanilla milkshake whipped cream cherry recipe" },

  // 8. WAFFLES & DESSERTS
  { id: "wf-1", file: "ice_cream_waffle.jpg", query: "belgian waffle scoops ice cream chocolate drizzle recipe" },
  { id: "wf-2", file: "brownie_nutella_waffle.jpg", query: "waffle brownie crumble nutella chocolate sauce recipe" },
  { id: "wf-knw", file: "kitkat_nutella_waffle.jpg", query: "waffle nutella kit kat pieces recipe" },
  { id: "wf-3", file: "nutella_waffle.jpg", query: "golden belgian waffle warm nutella choco chips recipe" },
  { id: "wf-kw", file: "kitkat_waffle.jpg", query: "waffle milk chocolate kit kat fingers recipe" },
  { id: "wf-ccw", file: "choco_chips_waffle.jpg", query: "belgian waffle chocolate chips fudge drizzle recipe" },
  { id: "wf-dcw", file: "dark_chocolate_waffle.jpg", query: "crispy waffle dark chocolate sauce drizzle recipe" },
  { id: "wf-4", file: "nutella_brownie.jpg", query: "fudge chocolate walnut brownie warm nutella drizzle recipe" },
  { id: "wf-5", file: "brownie_with_icecream.jpg", query: "sizzling brownie vanilla ice cream scoop chocolate sauce recipe" },
  { id: "wf-bwc", file: "brownie_with_chocolate.jpg", query: "warm chocolate fudge brownie molten sauce recipe" },
  { id: "wf-6", file: "choco_lava_cake.jpg", query: "molten chocolate lava cake oozing center recipe" },

  // 9. MOMOS, PATTIES, FRIES & CHAAT
  { id: "mo-1", file: "cheese_corn_momos.jpg", query: "steamed cheese corn momos dumplings recipe" },
  { id: "mo-2", file: "kurkure_fry_momos.jpg", query: "kurkure momos crispy crunchy fried momos recipe" },
  { id: "mo-3", file: "paneer_momos.jpg", query: "steamed paneer momos dumplings red chutney recipe" },
  { id: "mo-vf", file: "veg_fry_momos.jpg", query: "crispy golden fried veg momos dumplings recipe" },
  { id: "fr-1", file: "honey_chilli_potato.jpg", query: "crispy honey chilli potato sesame seeds recipe" },
  { id: "fr-cp", file: "chilli_potato.jpg", query: "crispy chilli potato wok tossed Indo Chinese recipe" },
  { id: "fr-2", file: "cheese_fries.jpg", query: "crispy french fries smothered melted cheese sauce recipe" },
  { id: "fr-3", file: "peri_peri_fries.jpg", query: "peri peri french fries spicy red seasoning recipe" },
  { id: "fr-4", file: "masala_fries.jpg", query: "chatpata masala french fries indian spices recipe" },
  { id: "fr-5", file: "salted_fries.jpg", query: "golden crispy salted french fries basket recipe" },
  { id: "sn-sr", file: "spring_roll.jpg", query: "crispy vegetable spring rolls sweet chili sauce recipe" },
  { id: "pt-1", file: "paneer_tikka_patties.jpg", query: "paneer puff pastry turnover bakery recipe" },
  { id: "pt-2", file: "pizza_patties.jpg", query: "pizza puff pastry pocket melted cheese recipe" },
  { id: "pt-3", file: "cheese_patties.jpg", query: "flaky cheese puff pastry golden bakery recipe" },
  { id: "pt-tp", file: "tandoori_patties.jpg", query: "spicy tandoori veg puff pastry bakery recipe" },
  { id: "pt-pp", file: "paneer_patties.jpg", query: "paneer puff pastry indian bakery recipe" },
  { id: "pt-4", file: "aloo_patties.jpg", query: "golden triangular aloo puff patty indian samosa puff recipe" },
  { id: "ch-pc", file: "peanut_chaat.jpg", query: "spiced peanut chaat onions tomatoes coriander recipe" },
  { id: "ch-kc", file: "kurkure_chaat.jpg", query: "kurkure chaat street snack bowl recipe" },

  // 10. MAGGI
  { id: "mg-1", file: "corn_cheese_maggi.jpg", query: "cheese corn maggi noodles sweet corn melted cheese recipe" },
  { id: "mg-2", file: "paneer_tikka_maggi.jpg", query: "paneer maggi noodles grilled paneer cubes recipe" },
  { id: "mg-3", file: "schezwan_maggi.jpg", query: "spicy schezwan maggi noodles red chili recipe" },
  { id: "mg-4", file: "punjabi_tadka_maggi.jpg", query: "punjabi tadka maggi noodles desi tomato onion recipe" },
  { id: "mg-cm", file: "cheese_maggi.jpg", query: "cheese maggi noodles bowl melted cheddar layer recipe" },
  { id: "mg-5", file: "tandoori_maggi.jpg", query: "smoky tandoori masala maggi noodles recipe" },
  { id: "mg-vmm", file: "veg_masala_maggi.jpg", query: "vegetable masala maggi noodles peas carrots recipe" },
  { id: "mg-6", file: "plain_maggi.jpg", query: "classic yellow masala maggi noodles bowl fork recipe" },

  // 11. PASTA
  { id: "ps-1", file: "makhani_pasta.jpg", query: "creamy makhani sauce penne pasta butter masala herbs" },
  { id: "ps-2", file: "pink_sauce_pasta.jpg", query: "penne alla vodka pink sauce pasta tomato cream" },
  { id: "ps-3", file: "white_sauce_pasta.jpg", query: "creamy garlic white sauce pasta penne alfredo bechamel" },
  { id: "ps-4", file: "red_sauce_pasta.jpg", query: "penne arrabbiata red sauce pasta tomato basil italian" },

  // 12. COMBOS
  { id: "cb-1", file: "combo_pizza_sandwich_coffee.jpg", query: "pizza grilled sandwich iced cold coffee cafe meal table" },
  { id: "cb-2", file: "combo_burgers_fries_coffee.jpg", query: "burgers french fries basket iced cold coffee feast" },
  { id: "cb-3", file: "combo_burger_fries_coffee.jpg", query: "burger crispy french fries iced cold coffee combo meal" }
];

async function run() {
  console.log(`Starting verified download for ${items.length} menu items...`);
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dest = path.join(srcDir, item.file);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 25000) {
      console.log(`[${i+1}/${items.length}] EXISTS: ${item.file} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
      const targetPath = path.join(targetDir, item.file);
      if (!fs.existsSync(targetPath)) fs.copyFileSync(dest, targetPath);
      skipCount++;
      continue;
    }

    console.log(`[${i+1}/${items.length}] Searching: ${item.query}...`);
    const results = await searchDDG(item.query);
    let ok = false;

    for (let r = 0; r < Math.min(results.length, 8); r++) {
      const u = results[r].image;
      if (!u || u.includes('.svg') || u.includes('.gif')) continue;
      ok = await downloadCandidate(u, dest);
      if (ok) {
        console.log(`  -> SUCCESS: ${item.file} from candidate #${r+1} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
        successCount++;
        break;
      }
    }

    if (!ok) {
      console.warn(`  -> FAILED: ${item.file}`);
      failCount++;
    }

    // Gentle delay to prevent rate-limiting
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log('\n=======================================');
  console.log(`SUMMARY: ${successCount} downloaded, ${skipCount} skipped/kept, ${failCount} failed.`);
  console.log('=======================================');
}

run();

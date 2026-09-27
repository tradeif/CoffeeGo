const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/main/resources/static/images/items');
const targetDir = path.join(__dirname, 'target/classes/static/images/items');

const itemImageMap = {
  // Best sellers
  "bs-1": "farm_house_pizza.jpg",
  "bs-2": "nutella_cold_coffee.jpg",
  "bs-3": "special_tot_burger.jpg",
  "bs-4": "tandoori_gravy_momos.jpg",

  // Cold coffee & hot coffee
  "cc-1": "brownie_cold_coffee.jpg",
  "cc-2": "hazelnut_cold_coffee.jpg",
  "cc-3": "caramel_cold_coffee.jpg",
  "cc-ch": "chocolate_cold_coffee.jpg",
  "cc-4": "choco_chips_cold_coffee.jpg",
  "cc-5": "regular_cold_coffee.jpg",
  "hc-1": "hot_chocolate.jpg",
  "hc-2": "hazelnut_hot_coffee.jpg",
  "hc-3": "vanilla_hot_coffee.jpg",
  "hc-4": "regular_hot_coffee.jpg",

  // Mojitos, mocktails, soups & iced teas
  "bev-1": "cranberry_mojito.jpg",
  "bev-2": "blueberry_mojito.jpg",
  "bev-3": "strawberry_mojito.jpg",
  "bev-om": "orange_mojito.jpg",
  "bev-4": "watermelon_mojito.jpg",
  "bev-5": "virgin_mojito.jpg",
  "bev-6": "blue_lagoon_mocktail.jpg",
  "bev-7": "peach_mocktail.jpg",
  "bev-cm": "cranberry_mocktail.jpg",
  "bev-bm": "blueberry_mocktail.jpg",
  "bev-sm": "strawberry_mocktail.jpg",
  "bev-oit": "orange_ice_tea.jpg",
  "bev-9": "blueberry_ice_tea.jpg",
  "bev-sit": "strawberry_ice_tea.jpg",
  "bev-pit": "peach_ice_tea.jpg",
  "bev-8": "lemon_ice_tea.jpg",
  "sp-1": "hot_sour_soup.jpg",
  "sp-2": "sweet_corn_soup.jpg",
  "sp-3": "tomato_soup.jpg",

  // Pizzas
  "pz-1": "peppy_paneer_pizza.jpg",
  "pz-2": "peri_peri_paneer_pizza.jpg",
  "pz-3": "double_cheese_pizza.jpg",
  "pz-4": "otc_pizza.jpg",
  "pz-5": "corn_cheese_pizza.jpg",
  "pz-cap": "capsicum_pizza.jpg",
  "pz-on": "onion_pizza.jpg",
  "pz-6": "margherita_pizza.jpg",

  // Burgers
  "bg-1": "cheese_paneer_burger.jpg",
  "bg-2": "double_tikki_burger.jpg",
  "bg-3": "mexican_cheese_burger.jpg",
  "bg-4": "tandoori_cheese_burger.jpg",
  "bg-cs": "cheese_slice_burger.jpg",
  "bg-5": "paneer_burger.jpg",
  "bg-6": "veg_tikki_burger.jpg",
  "bg-7": "aloo_tikki_burger.jpg",

  // Sandwiches & wraps
  "sw-1": "cheese_burst_sandwich.jpg",
  "sw-2": "paneer_tikka_sandwich.jpg",
  "sw-3": "mexican_cheese_sandwich.jpg",
  "sw-4": "corn_cheese_sandwich.jpg",
  "sw-cg": "cheese_grill_sandwich.jpg",
  "sw-tg": "tandoori_grill_sandwich.jpg",
  "sw-5": "veg_grill_sandwich.jpg",
  "wr-1": "tandoori_paneer_wrap.jpg",
  "wr-2": "corn_cheese_wrap.jpg",
  "wr-3": "veggie_delight_wrap.jpg",
  "wr-4": "aloo_tikki_wrap.jpg",

  // Shakes
  "sh-1": "tot_special_shake.jpg",
  "sh-2": "nutella_chocolate_shake.jpg",
  "sh-3": "brownie_shake.jpg",
  "sh-4": "popcorn_shake.jpg",
  "sh-bb": "blueberry_shake.jpg",
  "sh-mg": "mango_shake.jpg",
  "sh-bub": "bubble_shake.jpg",
  "sh-5": "kesar_elaichi_shake.jpg",
  "sh-bs": "butterscotch_shake.jpg",
  "sh-6": "kit_kat_shake.jpg",
  "sh-7": "oreo_shake.jpg",
  "sh-cs": "chocolate_shake.jpg",
  "sh-ss": "strawberry_shake.jpg",
  "sh-8": "paan_shake.jpg",
  "sh-vs": "vanilla_shake.jpg",

  // Waffles & desserts
  "wf-1": "ice_cream_waffle.jpg",
  "wf-2": "brownie_nutella_waffle.jpg",
  "wf-knw": "kitkat_nutella_waffle.jpg",
  "wf-3": "nutella_waffle.jpg",
  "wf-kw": "kitkat_waffle.jpg",
  "wf-ccw": "choco_chips_waffle.jpg",
  "wf-dcw": "dark_chocolate_waffle.jpg",
  "wf-4": "nutella_brownie.jpg",
  "wf-5": "brownie_with_icecream.jpg",
  "wf-bwc": "brownie_with_chocolate.jpg",
  "wf-6": "choco_lava_cake.jpg",

  // Momos, snacks, fries, patties, chaat
  "mo-1": "cheese_corn_momos.jpg",
  "mo-2": "kurkure_fry_momos.jpg",
  "mo-3": "paneer_momos.jpg",
  "mo-vf": "veg_fry_momos.jpg",
  "fr-1": "honey_chilli_potato.jpg",
  "fr-cp": "chilli_potato.jpg",
  "fr-2": "cheese_fries.jpg",
  "fr-3": "peri_peri_fries.jpg",
  "fr-4": "masala_fries.jpg",
  "fr-5": "salted_fries.jpg",
  "sn-sr": "spring_roll.jpg",
  "pt-1": "paneer_tikka_patties.jpg",
  "pt-2": "pizza_patties.jpg",
  "pt-3": "cheese_patties.jpg",
  "pt-tp": "tandoori_patties.jpg",
  "pt-pp": "paneer_patties.jpg",
  "pt-4": "aloo_patties.jpg",
  "ch-pc": "peanut_chaat.jpg",
  "ch-kc": "kurkure_chaat.jpg",

  // Maggi & pasta
  "mg-1": "corn_cheese_maggi.jpg",
  "mg-2": "paneer_tikka_maggi.jpg",
  "mg-3": "schezwan_maggi.jpg",
  "mg-4": "punjabi_tadka_maggi.jpg",
  "mg-cm": "cheese_maggi.jpg",
  "mg-5": "tandoori_maggi.jpg",
  "mg-vmm": "veg_masala_maggi.jpg",
  "mg-6": "plain_maggi.jpg",
  "ps-1": "makhani_pasta.jpg",
  "ps-2": "pink_sauce_pasta.jpg",
  "ps-3": "white_sauce_pasta.jpg",
  "ps-4": "red_sauce_pasta.jpg",

  // Combos
  "cb-1": "combo_pizza_sandwich_coffee.jpg",
  "cb-2": "combo_burgers_fries_coffee.jpg",
  "cb-3": "combo_burger_fries_coffee.jpg"
};

let missingCount = 0;
let validCount = 0;

for (const [id, file] of Object.entries(itemImageMap)) {
  const p1 = path.join(srcDir, file);
  const p2 = path.join(targetDir, file);
  if (!fs.existsSync(p1)) {
    console.error(`MISSING in src: [${id}] ${file}`);
    missingCount++;
  } else {
    validCount++;
    if (!fs.existsSync(p2)) {
      fs.copyFileSync(p1, p2);
    }
  }
}

console.log(`Total mapped: ${Object.keys(itemImageMap).length}`);
console.log(`Valid images: ${validCount}`);
console.log(`Missing images: ${missingCount}`);

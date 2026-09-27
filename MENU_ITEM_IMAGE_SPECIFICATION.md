# CoffeeGo Menu Item Image Specification & Content Standard

## 1. Executive Summary & Purpose
This document establishes the mandatory visual identity and photographic accuracy standard for all menu items displayed across CoffeeGo web applications, mobile interfaces, and digital ordering boards.

**Core Mandate:**
> **Every menu item photo must correspond exactly to its specific culinary dish name and recipe preparation. Cross-item duplication, generic category fallbacks, non-food stock assets, and inaccurate dish representations are strictly prohibited.**

For example:
- **Hazelnut Cold Coffee** MUST show a cold coffee beverage prepared with roasted crushed hazelnuts, hazelnut syrup or swirl, and whipped cream. It must NOT show a plain iced latte, a hot cappuccino, or chocolate cold coffee.
- **Chocolate Cold Coffee** MUST show a decadent iced blended cold coffee layered or drizzled with chocolate ganache/syrup, topped with dark chocolate curls. It must NOT share an image with Hazelnut Cold Coffee or Regular Cold Coffee.
- **Tandoori Grill Sandwich** MUST show a toasted Bombay/cafe-style grilled sandwich featuring authentic spiced red tandoori paneer/veggie filling with grill marks. It must NOT display a cold deli sub, generic white bread sandwich, or non-food content.

---

## 2. Strict Rules & Architectural Constraints

### Rule 1: 1-to-1 Semantic Alignment
- The dish title in [`MenuService.java`](file:///c:/cafe/src/main/java/com/coffeego/service/MenuService.java) dictates the exact contents of the image.
- Ingredients featured in the item name (e.g., *KitKat*, *Brownie*, *Corn & Cheese*, *Tandoori Paneer*, *Kurkure*, *Aloo Tikki*) must be visibly distinguishable or clearly represented in the photograph.

### Rule 2: Zero Duplication (Hash & Visual Uniqueness)
- Every single menu item must have its own dedicated image file located at:
  ```
  src/main/resources/static/images/items/<item_slug>.jpg
  ```
- No two items in the menu may reference the same file or contain identical binary/hash data.
- The automated verification script (`find_duplicates.js`) must exit with `0 duplicate items` prior to any production deployment.

### Rule 3: Zero Generic Category Placeholders
- Legacy fallbacks such as `item_cold_coffee.jpg`, `item_sandwich.jpg`, `item_momo.jpg`, or placeholder SVG icons must never be assigned as an item's primary photo in `MenuService.java`.
- Each item must be explicitly mapped to its unique URL path:
  ```java
  new MenuItem(..., "Hazelnut Cold Coffee", ..., "/images/items/hazelnut_cold_coffee.jpg")
  ```

### Rule 4: Elimination of Non-Food & Hallucinated Media
- Automated web scrapers and media ingest pipelines must apply strict culinary keyword filtering.
- Any media containing charts, technical diagrams, geographic maps, people portraits/celebrities, watermarks, or irrelevant stock photography will fail validation.

---

## 3. Photographic Style Guidelines

| Attribute | Specification |
|---|---|
| **Subject Focus** | Front-and-center presentation of the freshly prepared food or drink. |
| **Angle & Framing** | 45-degree angle (for sandwiches, burgers, bowls, waffles) or eye-level / 30-degree perspective (for tall drinks, cold coffees, shakes). |
| **Lighting** | Warm, inviting cafe/restaurant natural lighting with soft shadows; high contrast highlighting textures (melted cheese pull, grill marks, coffee foam, chocolate drizzles). |
| **Aspect Ratio & Resolution** | 4:3 or 1:1 ratio, minimum 600x450px, optimized JPEG/WebP format under 400KB for rapid browser delivery. |
| **Background / Staging** | Cafe ambience, wooden counter, slate platter, ceramic dishware, or clean minimalist tabletop. Avoid cluttered or distracting backgrounds. |

---

## 4. Item Directory Reference & Mapping

Below is the verified inventory of all 120 menu items mapped to their exact, unique asset filenames:

### Cold Coffees (100% Unique & Distinct)
- **Regular Cold Coffee**: `regular_cold_coffee.jpg` – Classic frothy cafe-style blended cold coffee served in a tall glass with subtle cocoa powder dusting.
- **Hazelnut Cold Coffee**: `hazelnut_cold_coffee.jpg` – Iced cold coffee swirled with rich hazelnut syrup, roasted crushed hazelnut toppings, and whipped cream.
- **Chocolate Cold Coffee**: `chocolate_cold_coffee.jpg` – Thick iced mocha coffee drizzled with chocolate sauce, whipped topping, and chocolate curls.
- **Brownie Cold Coffee**: `brownie_cold_coffee.jpg` – Blended iced frappe topped with fudgy chocolate brownie chunks and chocolate syrup.
- **Choco Chips Cold Coffee**: `choco_chips_cold_coffee.jpg` – Creamy cold coffee crowned with generous crispy semi-sweet chocolate chips.

### Pizzas (100% Unique & Distinct)
- **Farm House Pizza**: `farm_house_pizza.jpg` – Loaded garden pizza with crisp capsicum, sweet corn, fresh tomatoes, sliced onions, and rich melted mozzarella.
- **Peppy Paneer Pizza**: `peppy_paneer_pizza.jpg` – Golden artisan crust loaded with spiced marinated paneer cubes, red paprika, sliced onions, capsicum, and fresh cilantro.
- **Peri Peri Paneer Pizza**: `peri_peri_paneer_pizza.jpg` – Whole rustic baked pizza topped with fiery peri-peri spiced paneer chunks, melted cheese, and herbs on a wooden paddle.
- **Double Cheese Pizza**: `double_cheese_pizza.jpg` – Deep golden baked pizza featuring dual layers of creamy mozzarella and cheddar with a dramatic cheese pull.
- **OTC Pizza (Onion Tomato Capsicum)**: `otc_pizza.jpg` – Classic favorite garden pizza loaded with diced onions, tomatoes, and crisp green bell peppers.
- **Corn Cheese Pizza**: `corn_cheese_pizza.jpg` – Golden sweet corn kernels smothered in bubbling stretchy melted mozzarella cheese.
- **Capsicum Pizza**: `capsicum_pizza.jpg` – Golden round artisan pizza topped with vibrant green capsicum rings and bubbly melted cheese.
- **Onion Pizza**: `onion_pizza.jpg` – Sweet sliced caramelized onions baked over rich mozzarella cheese.
- **Margherita Pizza**: `margherita_pizza.jpg` – Classic Italian pizza with herb tomato concasse and fresh mozzarella.

### Sandwiches & Wraps (100% Unique & Distinct)
- **Cheese Grill Sandwich**: `cheese_grill_sandwich.jpg` – Golden toasted sandwich with visible stretchy melted cheddar & mozzarella cheese pull.
- **Cheese Burst Sandwich**: `cheese_burst_sandwich.jpg` – Multi-layer toasted sandwich bursting with molten cheese center.
- **Paneer Tikka Sandwich**: `paneer_tikka_sandwich.jpg` – Char-grilled marinated paneer cubes layered with mint coriander chutney on toasted bread.
- **Mexican Cheese Sandwich**: `mexican_cheese_sandwich.jpg` – Spiced Mexican sweet corn, crunchy capsicum, jalapenos, salsa, and cheese toastie.
- **Corn Cheese Sandwich**: `corn_cheese_sandwich.jpg` – Sweet golden corn kernels folded into bubbling mozzarella between golden grilled bread.
- **Tandoori Grill Sandwich**: `tandoori_grill_sandwich.jpg` – Smoky tandoori spiced vegetable sandwich grilled with crisp charred ridges.
- **Veg Grill Sandwich**: `veg_grill_sandwich.jpg` – Classic Bombay vegetable grill sandwich with beetroot, cucumber, tomato, potato, and green chutney.
- **Tandoori Paneer Wrap**: `tandoori_paneer_wrap.jpg` – Grilled tortilla roll packed with smoky tandoori paneer slices and salad.
- **Corn Cheese Wrap**: `corn_cheese_wrap.jpg` – Soft flatbread wrap loaded with creamy sweet corn and cheese filling.
- **Aloo Tikki Wrap**: `aloo_tikki_wrap.jpg` – Spiced potato patty with onions, tangy sauce, and crispy lettuce in a toasted wrap.
- **Veggie Delight Wrap**: `veggie_delight_wrap.jpg` – Fresh bell peppers, onions, shredded carrots, and herb cream dressing wrapped in a tortilla.

### Burgers, Fries & Snacks
- **Double Tikki Burger**: `double_tikki_burger.jpg` – Towering toasted sesame bun with two crispy vegetable patties, cheese, and special sauce.
- **Cheese Paneer Burger**: `cheese_paneer_burger.jpg` – Golden fried paneer block topped with melted cheese slice and garlic mayo.
- **Paneer Burger**: `paneer_burger.jpg` – Crispy battered paneer patty with lettuce and spicy mayo.
- **Honey Chilli Potato**: `honey_chilli_potato.jpg` – Crisp fried potato fingers tossed in sweet and fiery honey chili glaze with sesame seeds.
- **Chilli Potato**: `chilli_potato.jpg` – Crispy potato wedges tossed with onions and spicy wok sauce.
- **Cheese Fries**: `cheese_fries.jpg` – Golden crisp french fries smothered in warm cheddar cheese sauce.
- **Peri Peri Fries**: `peri_peri_fries.jpg` – Freshly fried potatoes dusted with authentic spicy African peri-peri mix.
- **Masala Fries**: `masala_fries.jpg` – Crispy crinkle-cut fries seasoned with tangy chatpata Indian cafe spice blend and fresh coriander.
- **Salted Fries**: `salted_fries.jpg` – Classic salted golden crispy potato french fries served fresh and hot.
- **Cheese Corn Momos**: `cheese_corn_momos.jpg` – Steamed dumplings stuffed with sweet corn and melted cheese.
- **Kurkure Fry Momos**: `kurkure_fry_momos.jpg` – Extra crunchy batter-coated deep-fried momos with spicy red dip.
- **Paneer Momos**: `paneer_momos.jpg` – Delicately pleated momos stuffed with seasoned grated cottage cheese.
- **Veg Fry Momos**: `veg_fry_momos.jpg` – Golden fried vegetable dumplings with garlic-chilli dip.
- **Spring Roll**: `spring_roll.jpg` – Crispy golden fried rolls stuffed with shredded vegetables and glass noodles.
- **Peanut Chaat**: `peanut_chaat.jpg` – Tangy Indian roasted peanut salad with diced onions, tomatoes, and lemon.
- **Kur Kre Chaat**: `kurkure_chaat.jpg` – Chatpata snack mixed with crispy Kurkure sticks, sev, onions, and chutneys.

### Patties, Maggi & Waffles
- **Paneer Tikka Patties**: `paneer_tikka_patties.jpg` – Flaky puff pastry turnover filled with spicy paneer tikka filling.
- **Pizza Patties**: `pizza_patties.jpg` – Golden baked puff pastry turnover pockets loaded with pizza sauce, melted cheese, and veggies.
- **Cheese Patties**: `cheese_patties.jpg` – Golden flaky pastry baked with gooey melted cheese filling.
- **Tandoori Patties**: `tandoori_patties.jpg` – Flaky bakery puff pastry stuffed with smoky red tandoori spiced filling served on a plate.
- **Paneer Patties**: `paneer_patties.jpg` – Crisp golden puff pastry triangles topped with nigella seeds and spiced cottage cheese filling.
- **Aloo Patties**: `aloo_patties.jpg` – Classic Indian bakery aloo masala puff pastry turnover with layered flaky crust.
### Maggi Bowls (100% Unique & Accurate)
- **Veg Corn Cheese Maggi**: `corn_cheese_maggi.jpg` – Steaming bowl of Maggi noodles elevated with sweet golden corn kernels and molten cheese.
- **Paneer Tikka Maggi**: `paneer_tikka_maggi.jpg` – Gourmet ceramic bowl of Maggi noodles topped with charred golden paneer tikka cubes and scallions.
- **Schezwan Maggi**: `schezwan_maggi.jpg` – Fiery red Indo-Chinese style noodles with spicy Schezwan sauce, bell peppers, and spring onions.
- **Punjabi Tadka Maggi**: `punjabi_tadka_maggi.jpg` – Desi Punjabi street-style tempered Maggi with cumin, onions, tomatoes, and paneer.
- **Cheese Maggi**: `cheese_maggi.jpg` – Baked comforting Maggi noodles smothered with a generous layer of melted cheddar & mozzarella cheese pull.
- **Tandoori Maggi**: `tandoori_maggi.jpg` – Smoky roasted masala infused Maggi noodles tossed with vegetables and coriander.
- **Veg Masala Maggi**: `veg_masala_maggi.jpg` – Classic Maggi noodles in a white bowl cooked with green peas, diced carrots, and rich masala broth.
- **Plain Maggi**: `plain_maggi.jpg` – The all-time classic 2-minute yellow masala Maggi noodles served hot on a plate.

### Waffles & Desserts
- **Brownie Nutella Waffle**: `brownie_nutella_waffle.jpg` – Crisp Belgian waffle smothered with Nutella spread and fudge brownie chunks.
- **KitKat Nutella Waffle**: `kitkat_nutella_waffle.jpg` – Belgian waffle loaded with Nutella and crunchy crushed KitKat wafer bars.
- **KitKat Waffle**: `kitkat_waffle.jpg` – Golden waffle garnished with white and milk chocolate drizzles and KitKat fingers.
- **Ice Cream Waffle**: `ice_cream_waffle.jpg` – Warm crisp waffle topped with a cold scoop of vanilla ice cream and chocolate syrup.
- **Nutella Brownie**: `nutella_brownie.jpg` – Dense fudge chocolate brownie smothered with warm Nutella ganache.

---

## 5. Verification & Continuous Quality Assurance
To prevent regression or accidental re-introduction of duplicate/mismatched photos:

1. **Hash Verification Script**: Run [`find_duplicates.js`](file:///c:/cafe/find_duplicates.js) before committing changes. It computes MD5 hashes of all active menu items and verifies 100% uniqueness.
2. **Visual Inspection Gallery**: View [`inspect_all.html`](file:///c:/cafe/src/main/resources/static/inspect_all.html) in your browser to inspect every item side-by-side with its culinary title and category.
3. **Compilation & Deployment**: When adding or updating images, ensure assets are present in `src/main/resources/static/images/items/` and run `.\mvnw compile` so Spring Boot packages them into `target/classes/static/images/items/`.

package com.coffeego.service;

import com.coffeego.model.MenuItem;
import com.coffeego.model.Promotion;
import com.coffeego.model.Testimonial;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final List<MenuItem> menuItems = new CopyOnWriteArrayList<>();
    private final List<Promotion> promotions = new CopyOnWriteArrayList<>();
    private final List<Testimonial> testimonials = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void initData() {
        menuItems.clear();
        promotions.clear();
        testimonials.clear();

        // ================= BEST SELLERS (TOP 4) =================
        // 1. Farm House Pizza (Featured Center Card)
        Map<String, Double> farmHouseSizes = new LinkedHashMap<>();
        farmHouseSizes.put("Small", 100.0);
        farmHouseSizes.put("Medium", 180.0);
        farmHouseSizes.put("Large", 230.0);
        menuItems.add(new MenuItem("bs-1", "Farm House Pizza", "PIZZA",
                "Loaded with crisp capsicum, sweet corn, fresh tomatoes, onion, and rich mozzarella cheese.",
                100.0, 130.0, "₹100 - ₹230", "/images/items/farm_house_pizza.jpg", "BESTSELLER", true, true, farmHouseSizes));

        // 2. Nutella Cold Coffee
        Map<String, Double> nutellaCoffeeSizes = new LinkedHashMap<>();
        nutellaCoffeeSizes.put("Small", 80.0);
        nutellaCoffeeSizes.put("Medium", 100.0);
        nutellaCoffeeSizes.put("Large", 120.0);
        menuItems.add(new MenuItem("bs-2", "Nutella Cold Coffee", "COFFEE",
                "Rich blended cold espresso infused with creamy Nutella and chocolate drizzle.",
                80.0, 100.0, "₹80 - ₹120", "/images/items/nutella_cold_coffee.jpg", "CHEF SPECIAL", true, false, nutellaCoffeeSizes));

        // 3. Special TOT Burger
        menuItems.add(new MenuItem("bs-3", "Special TOT Burger", "BURGER",
                "Signature jumbo cafe burger stacked with spiced crispy patty, melted cheese, and chef's secret sauce.",
                90.0, 110.0, "₹90", "/images/items/special_tot_burger.jpg", "HOT", true, false, null));

        // 4. Tandoori Gravy Momos
        Map<String, Double> momoSizes = new LinkedHashMap<>();
        momoSizes.put("6 Pcs", 120.0);
        momoSizes.put("10 Pcs", 180.0);
        menuItems.add(new MenuItem("bs-4", "Tandoori Gravy Momos", "SNACKS",
                "Dumplings tossed in smoky spicy tandoori gravy with herbs and cream.",
                120.0, 150.0, "₹120 - ₹180", "/images/items/tandoori_gravy_momos.jpg", "POPULAR", true, false, momoSizes));


        // ================= COLD COFFEE & HOT COFFEE =================
        Map<String, Double> brownieCoffeeSizes = new LinkedHashMap<>();
        brownieCoffeeSizes.put("Small", 80.0); brownieCoffeeSizes.put("Medium", 90.0); brownieCoffeeSizes.put("Large", 110.0);
        menuItems.add(new MenuItem("cc-1", "Brownie Cold Coffee", "COFFEE", "Thick chilled cold coffee blended with fudgy brownie chunks.", 80.0, 100.0, "₹80 / ₹90 / ₹110", "/images/items/brownie_cold_coffee.jpg", "MUST TRY", false, false, brownieCoffeeSizes));

        Map<String, Double> hazelnutCoffeeSizes = new LinkedHashMap<>();
        hazelnutCoffeeSizes.put("Small", 60.0); hazelnutCoffeeSizes.put("Medium", 80.0); hazelnutCoffeeSizes.put("Large", 100.0);
        menuItems.add(new MenuItem("cc-2", "Hazelnut Cold Coffee", "COFFEE", "Aromatic hazelnut blended into silky cold brew coffee.", 60.0, 80.0, "₹60 / ₹80 / ₹100", "/images/items/hazelnut_cold_coffee.jpg", "", false, false, hazelnutCoffeeSizes));

        Map<String, Double> caramelCoffeeSizes = new LinkedHashMap<>();
        caramelCoffeeSizes.put("Small", 60.0); caramelCoffeeSizes.put("Medium", 70.0); caramelCoffeeSizes.put("Large", 90.0);
        menuItems.add(new MenuItem("cc-3", "Caramel Cold Coffee", "COFFEE", "Smooth buttery caramel layered over chilled espresso.", 60.0, 75.0, "₹60 / ₹70 / ₹90", "/images/items/caramel_cold_coffee.jpg", "", false, false, caramelCoffeeSizes));

        Map<String, Double> chocolateCoffeeSizes = new LinkedHashMap<>();
        chocolateCoffeeSizes.put("Small", 50.0); chocolateCoffeeSizes.put("Medium", 60.0); chocolateCoffeeSizes.put("Large", 80.0);
        menuItems.add(new MenuItem("cc-ch", "Chocolate Cold Coffee", "COFFEE", "Creamy blend of fresh milk, bold coffee, and cocoa syrup.", 50.0, 65.0, "₹50 / ₹60 / ₹80", "/images/items/chocolate_cold_coffee.jpg", "POPULAR", false, false, chocolateCoffeeSizes));

        Map<String, Double> chocoChipsCoffeeSizes = new LinkedHashMap<>();
        chocoChipsCoffeeSizes.put("Small", 50.0); chocoChipsCoffeeSizes.put("Medium", 60.0); chocoChipsCoffeeSizes.put("Large", 80.0);
        menuItems.add(new MenuItem("cc-4", "Cold Coffee with Choco Chips", "COFFEE", "Classic cold coffee loaded with crunchy chocolate chips.", 50.0, 65.0, "₹50 / ₹60 / ₹80", "/images/items/choco_chips_cold_coffee.jpg", "FAV", false, false, chocoChipsCoffeeSizes));

        Map<String, Double> regularCoffeeSizes = new LinkedHashMap<>();
        regularCoffeeSizes.put("Small", 40.0); regularCoffeeSizes.put("Medium", 50.0); regularCoffeeSizes.put("Large", 75.0);
        menuItems.add(new MenuItem("cc-5", "Regular Cold Coffee", "COFFEE", "Classic refreshing cold coffee with rich froth.", 40.0, 50.0, "₹40 / ₹50 / ₹75", "/images/items/regular_cold_coffee.jpg", "", false, false, regularCoffeeSizes));

        menuItems.add(new MenuItem("hc-1", "Hot Chocolate", "COFFEE", "Steaming velvety melted chocolate topped with cocoa powder.", 70.0, 90.0, "₹70", "/images/items/hot_chocolate.jpg", "WARM", false, false, null));
        menuItems.add(new MenuItem("hc-2", "Hazelnut Hot Coffee", "COFFEE", "Freshly brewed hot cappuccino with toasted hazelnut syrup.", 60.0, 80.0, "₹60", "/images/items/hazelnut_hot_coffee.jpg", "", false, false, null));
        menuItems.add(new MenuItem("hc-3", "Vanilla Hot Coffee", "COFFEE", "Rich hot latte with soothing aromatic French vanilla.", 50.0, 65.0, "₹50", "/images/items/vanilla_hot_coffee.jpg", "", false, false, null));
        menuItems.add(new MenuItem("hc-4", "Regular Hot Coffee", "COFFEE", "Traditional piping hot hand-beaten cafe style coffee.", 40.0, 50.0, "₹40", "/images/items/regular_hot_coffee.jpg", "", false, false, null));

        // ================= MOJITOS, MOCKTAILS, SOUPS & ICE TEA =================
        menuItems.add(new MenuItem("bev-1", "Cranberry Mojito", "BEVERAGES", "Zesty sparkling soda with tart cranberry and muddled fresh mint.", 100.0, 120.0, "₹100", "/images/items/cranberry_mojito.jpg", "REFRESHING", false, false, null));
        menuItems.add(new MenuItem("bev-2", "Blueberry Mojito", "BEVERAGES", "Crushed sweet blueberries, mint leaves, lime and bubbly soda.", 90.0, 110.0, "₹90", "/images/items/blueberry_mojito.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-3", "Strawberry Mojito", "BEVERAGES", "Fresh strawberry puree with sparkling citrus soda and crushed ice.", 80.0, 100.0, "₹80", "/images/items/strawberry_mojito.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-om", "Orange Mojito", "BEVERAGES", "Tangy citrus orange burst with crushed mint and bubbly fizz.", 80.0, 100.0, "₹80", "/images/items/orange_mojito.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-4", "Watermelon Mojito", "BEVERAGES", "Chilled summery watermelon splash with garden mint.", 80.0, 100.0, "₹80", "/images/items/watermelon_mojito.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-5", "Virgin Mojito", "BEVERAGES", "Timeless classic with mint sprigs, lime wedges, and club soda.", 70.0, 90.0, "₹70", "/images/items/virgin_mojito.jpg", "CLASSIC", false, false, null));
        menuItems.add(new MenuItem("bev-6", "Blue Lagoon Mocktail", "BEVERAGES", "Vibrant curacao citrus cooler with soda and crushed ice.", 80.0, 100.0, "₹80", "/images/items/blue_lagoon_mocktail.jpg", "TROPICAL", false, false, null));
        menuItems.add(new MenuItem("bev-7", "Peach Mocktail", "BEVERAGES", "Velvety sweet peach nectar with bubbly sparkling soda.", 80.0, 100.0, "₹80", "/images/items/peach_mocktail.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-cm", "Cranberry Mocktail", "BEVERAGES", "Tart crisp cranberry juice cocktail with lemon fizz.", 90.0, 110.0, "₹90", "/images/items/cranberry_mocktail.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-bm", "Blueberry Mocktail", "BEVERAGES", "Wild blueberry syrup shaken with ice and soda.", 90.0, 110.0, "₹90", "/images/items/blueberry_mocktail.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-sm", "Strawberry Mocktail", "BEVERAGES", "Sweet summer strawberry cooler with crushed ice.", 80.0, 100.0, "₹80", "/images/items/strawberry_mocktail.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-oit", "Orange Ice Tea", "BEVERAGES", "Zesty orange essence infused iced black tea.", 70.0, 85.0, "₹70", "/images/items/orange_ice_tea.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-9", "Blueberry Ice Tea", "BEVERAGES", "Berry-infused refreshing iced black tea.", 70.0, 85.0, "₹70", "/images/items/blueberry_ice_tea.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-sit", "Strawberry Ice Tea", "BEVERAGES", "Sweet strawberry blend brewed cold over lemon ice.", 70.0, 85.0, "₹70", "/images/items/strawberry_ice_tea.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-pit", "Peach Ice Tea", "BEVERAGES", "Orchard peach sweetness with smooth brewed tea.", 70.0, 85.0, "₹70", "/images/items/peach_ice_tea.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bev-8", "Lemon Ice Tea", "BEVERAGES", "Crisp brewed black tea chilled over ice with fresh lemon.", 60.0, 75.0, "₹60", "/images/items/lemon_ice_tea.jpg", "", false, false, null));

        // SOUPS
        menuItems.add(new MenuItem("sp-1", "Hot N Sour Veg Soup", "BEVERAGES", "Piping hot spicy and tangy soup with finely diced garden veggies.", 80.0, 95.0, "₹80", "/images/items/hot_sour_soup.jpg", "HOT", false, false, null));
        menuItems.add(new MenuItem("sp-2", "Sweet Corn Soup", "BEVERAGES", "Creamy comforting soup packed with tender golden sweet corn.", 80.0, 95.0, "₹80", "/images/items/sweet_corn_soup.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sp-3", "Tomato Soup", "BEVERAGES", "Rich ripe plum tomato velouté served with crunchy croutons.", 80.0, 95.0, "₹80", "/images/items/tomato_soup.jpg", "", false, false, null));

        // ================= PIZZAS =================
        Map<String, Double> peppyPaneerSizes = new LinkedHashMap<>();
        peppyPaneerSizes.put("Small", 100.0); peppyPaneerSizes.put("Medium", 170.0); peppyPaneerSizes.put("Large", 200.0);
        menuItems.add(new MenuItem("pz-1", "Peppy Paneer Pizza", "PIZZA", "Spiced tender paneer cubes, crisp capsicum, and red paprika.", 100.0, 130.0, "₹100 / ₹170 / ₹200", "/images/items/peppy_paneer_pizza.jpg", "HOT", false, false, peppyPaneerSizes));

        Map<String, Double> periPeriPaneerSizes = new LinkedHashMap<>();
        periPeriPaneerSizes.put("Small", 100.0); periPeriPaneerSizes.put("Medium", 170.0); periPeriPaneerSizes.put("Large", 200.0);
        menuItems.add(new MenuItem("pz-2", "Peri Peri Paneer Pizza", "PIZZA", "Fiery peri-peri marinated paneer chunks on molten cheese base.", 100.0, 130.0, "₹100 / ₹170 / ₹200", "/images/items/peri_peri_paneer_pizza.jpg", "SPICY", false, false, periPeriPaneerSizes));

        Map<String, Double> doubleCheeseSizes = new LinkedHashMap<>();
        doubleCheeseSizes.put("Small", 100.0); doubleCheeseSizes.put("Medium", 150.0); doubleCheeseSizes.put("Large", 190.0);
        menuItems.add(new MenuItem("pz-3", "Double Cheese Pizza", "PIZZA", "Overloaded dual layers of creamy mozzarella and cheddar cheese.", 100.0, 130.0, "₹100 / ₹150 / ₹190", "/images/items/double_cheese_pizza.jpg", "CHEESY", false, false, doubleCheeseSizes));

        Map<String, Double> otcSizes = new LinkedHashMap<>();
        otcSizes.put("Small", 100.0); otcSizes.put("Medium", 160.0);
        menuItems.add(new MenuItem("pz-4", "OTC Pizza (Onion Tomato Capsicum)", "PIZZA", "The favorite garden trio: crunchy onions, fresh tomatoes, bell peppers.", 100.0, 120.0, "₹100 / ₹160", "/images/items/otc_pizza.jpg", "", false, false, otcSizes));

        Map<String, Double> cornCheeseSizes = new LinkedHashMap<>();
        cornCheeseSizes.put("Small", 90.0); cornCheeseSizes.put("Medium", 150.0);
        menuItems.add(new MenuItem("pz-5", "Corn Cheese Pizza", "PIZZA", "Golden sweet corn kernels smothered in bubbling mozzarella.", 90.0, 110.0, "₹90 / ₹150", "/images/items/corn_cheese_pizza.jpg", "", false, false, cornCheeseSizes));

        Map<String, Double> capsicumPizzaSizes = new LinkedHashMap<>();
        capsicumPizzaSizes.put("Small", 90.0); capsicumPizzaSizes.put("Medium", 150.0);
        menuItems.add(new MenuItem("pz-cap", "Capsicum Pizza", "PIZZA", "Fresh diced green bell peppers on herbs and cheese crust.", 90.0, 110.0, "₹90 / ₹150", "/images/items/capsicum_pizza.jpg", "", false, false, capsicumPizzaSizes));

        Map<String, Double> onionPizzaSizes = new LinkedHashMap<>();
        onionPizzaSizes.put("Small", 90.0); onionPizzaSizes.put("Medium", 150.0);
        menuItems.add(new MenuItem("pz-on", "Onion Pizza", "PIZZA", "Crispy sliced sweet onions with rich mozzarella cheese.", 90.0, 110.0, "₹90 / ₹150", "/images/items/onion_pizza.jpg", "", false, false, onionPizzaSizes));

        Map<String, Double> margheritaSizes = new LinkedHashMap<>();
        margheritaSizes.put("Small", 80.0); margheritaSizes.put("Medium", 140.0);
        menuItems.add(new MenuItem("pz-6", "Margherita Pizza", "PIZZA", "Classic Italian pizza with herb tomato concasse and fresh mozzarella.", 80.0, 100.0, "₹80 / ₹140", "/images/items/margherita_pizza.jpg", "CLASSIC", false, false, margheritaSizes));

        // ================= BURGERS =================
        menuItems.add(new MenuItem("bg-1", "Cheese Paneer Burger", "BURGER", "Grilled paneer patty topped with melted cheese slice and herb mayo.", 80.0, 95.0, "₹80", "/images/items/cheese_paneer_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-2", "Double Tikki Burger", "BURGER", "Two golden crisp vegetable tikkis stacked with fresh veggies.", 80.0, 95.0, "₹80", "/images/items/double_tikki_burger.jpg", "LOADED", false, false, null));
        menuItems.add(new MenuItem("bg-3", "Mexican Cheese Burger", "BURGER", "Tangy salsa sauce, jalapeno slices, melted cheese and spiced patty.", 70.0, 85.0, "₹70", "/images/items/mexican_cheese_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-4", "Tandoori Cheese Burger", "BURGER", "Smoky tandoori spread with crispy patty and cheese.", 70.0, 85.0, "₹70", "/images/items/tandoori_cheese_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-cs", "Cheese Slice Burger", "BURGER", "Crispy veggie patty with an extra melted American cheese slice.", 70.0, 85.0, "₹70", "/images/items/cheese_slice_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-5", "Paneer Burger", "BURGER", "Seasoned paneer steak with crisp onions and signature dressing.", 70.0, 85.0, "₹70", "/images/items/paneer_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-6", "Veg Tikki Burger", "BURGER", "Classic street-style crispy potato patty with fresh salad.", 60.0, 75.0, "₹60", "/images/items/veg_tikki_burger.jpg", "", false, false, null));
        menuItems.add(new MenuItem("bg-7", "Aloo Tikki Burger", "BURGER", "Golden fried spiced potato patty on soft toasted sesame bun.", 50.0, 65.0, "₹50", "/images/items/aloo_tikki_burger.jpg", "POPULAR", false, false, null));

        // ================= SANDWICHES & WRAPS =================
        menuItems.add(new MenuItem("sw-1", "Cheese Brust Grill Sandwich", "SANDWICHES", "Triple layer grilled bread oozing with molten cheese burst.", 110.0, 130.0, "₹110", "/images/items/cheese_burst_sandwich.jpg", "MUST TRY", false, false, null));
        menuItems.add(new MenuItem("sw-2", "Paneer Tikka Grill Sandwich", "SANDWICHES", "Char-grilled paneer tikka slices with tandoori spices and cheese.", 100.0, 120.0, "₹100", "/images/items/paneer_tikka_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sw-3", "Mexican Cheese Grill Sandwich", "SANDWICHES", "Jalapenos, sweet corn, salsa drizzle, and Mexican herbs.", 90.0, 110.0, "₹90", "/images/items/mexican_cheese_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sw-4", "Corn Cheese Grill Sandwich", "SANDWICHES", "Sweet corn and extra melted mozzarella cheese toastie.", 80.0, 95.0, "₹80", "/images/items/corn_cheese_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sw-cg", "Cheese Grill Sandwich", "SANDWICHES", "Melted cheese blend between toasted herb butter sourdough bread.", 80.0, 95.0, "₹80", "/images/items/cheese_grill_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sw-tg", "Tandoori Grill Sandwich", "SANDWICHES", "Spicy tandoori sauce with diced vegetables toasted to golden perfection.", 80.0, 95.0, "₹80", "/images/items/tandoori_grill_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sw-5", "Veg Grill Sandwich", "SANDWICHES", "Crisp sliced cucumbers, tomatoes, capsicum with mint chutney.", 70.0, 85.0, "₹70", "/images/items/veg_grill_sandwich.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wr-1", "Tandoori Paneer Wrap", "SANDWICHES", "Soft tortilla roll packed with smoky tandoori paneer & crunchy veggies.", 90.0, 110.0, "₹90", "/images/items/tandoori_paneer_wrap.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wr-2", "Corn Cheese Wrap", "SANDWICHES", "Tortilla wrap filled with sweet corn, cheese spread, and greens.", 90.0, 110.0, "₹90", "/images/items/corn_cheese_wrap.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wr-3", "Veggie Delight Wrap", "SANDWICHES", "Healthy garden vegetables tossed in tangy dressing inside warm flatbread.", 80.0, 95.0, "₹80", "/images/items/veggie_delight_wrap.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wr-4", "Aloo Tikki Wrap", "SANDWICHES", "Crisp aloo tikki rolled with onions, cheese, and spicy mayo.", 70.0, 85.0, "₹70", "/images/items/aloo_tikki_wrap.jpg", "", false, false, null));

        // ================= SHAKES & DESSERTS / WAFFLES =================
        menuItems.add(new MenuItem("sh-1", "Tot Special Shake", "SHAKES", "Grand thick shake loaded with rich ice cream, dry fruits, and toppings.", 150.0, 180.0, "₹150", "/images/items/tot_special_shake.jpg", "SIGNATURE", false, false, null));
        menuItems.add(new MenuItem("sh-2", "Nutella Chocolate Shake", "SHAKES", "Decadent shake blended with genuine Nutella spread and chocolate.", 140.0, 170.0, "₹140", "/images/items/nutella_chocolate_shake.jpg", "HEAVENLY", false, false, null));
        menuItems.add(new MenuItem("sh-3", "Brownie Shake", "SHAKES", "Rich chocolate shake blended with an entire baked fudge brownie.", 100.0, 120.0, "₹100", "/images/items/brownie_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-4", "Popcorn Shake", "SHAKES", "Caramelized gourmet popcorn blended into creamy sweet shake.", 100.0, 120.0, "₹100", "/images/items/popcorn_shake.jpg", "UNIQUE", false, false, null));
        menuItems.add(new MenuItem("sh-bb", "Blueberry Shake", "SHAKES", "Creamy vanilla shake infused with tart and sweet blueberries.", 90.0, 110.0, "₹90", "/images/items/blueberry_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-mg", "Mango Shake", "SHAKES", "Luscious Alphonso mango pulp blended with thick ice cream.", 90.0, 110.0, "₹90", "/images/items/mango_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-bub", "Bubble Shake", "SHAKES", "Fun sweet shake with popping pearls and colorful fruit flavor.", 90.0, 110.0, "₹90", "/images/items/bubble_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-5", "Kesar Elaichi Shake", "SHAKES", "Traditional royal saffron and green cardamom infused thick shake.", 90.0, 110.0, "₹90", "/images/items/kesar_elaichi_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-bs", "Butter Scotch Shake", "SHAKES", "Caramel crunch butterscotch pralines blended with fresh milk.", 80.0, 100.0, "₹80", "/images/items/butterscotch_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-6", "Kit Kat Shake", "SHAKES", "Crunchy wafer Kit Kat fingers crushed into velvety chocolate shake.", 80.0, 100.0, "₹80", "/images/items/kit_kat_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-7", "Oreo Shake", "SHAKES", "Creamy vanilla shake packed with crushed chocolate Oreo cookies.", 80.0, 100.0, "₹80", "/images/items/oreo_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-cs", "Chocolate Shake", "SHAKES", "Rich cocoa fudge shake topped with chocolate syrup.", 80.0, 100.0, "₹80", "/images/items/chocolate_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-ss", "Strawberry Shake", "SHAKES", "Classic pink strawberry thick shake with strawberry swirls.", 80.0, 100.0, "₹80", "/images/items/strawberry_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-8", "Paan Shake", "SHAKES", "Refreshing Calcutta betel leaf flavor with gulkand essence.", 80.0, 100.0, "₹80", "/images/items/paan_shake.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sh-vs", "Vanilla Shake", "SHAKES", "Silky smooth aromatic Madagascar vanilla thick shake.", 70.0, 85.0, "₹70", "/images/items/vanilla_shake.jpg", "", false, false, null));

        // WAFFLES & BROWNIES
        menuItems.add(new MenuItem("wf-1", "Tot Special Ice Cream Waffle", "DESSERTS", "Warm Belgian waffle served with dual ice cream scoops and fudge drizzle.", 150.0, 180.0, "₹150", "/images/items/ice_cream_waffle.jpg", "SPECIAL", false, false, null));
        menuItems.add(new MenuItem("wf-2", "Brownie Nutella Waffle", "DESSERTS", "Crispy waffle topped with brownie crumble and hot molten Nutella.", 140.0, 170.0, "₹140", "/images/items/brownie_nutella_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-knw", "Kit Kat Nutella Waffle", "DESSERTS", "Golden waffle layered with Nutella and crunchy Kit Kat pieces.", 120.0, 150.0, "₹120", "/images/items/kitkat_nutella_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-3", "Nutella Waffle", "DESSERTS", "Golden waffle smothered with warm Nutella and choco chips.", 110.0, 130.0, "₹110", "/images/items/nutella_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-kw", "Kit Kat Waffle", "DESSERTS", "Waffle smothered in milk chocolate and crisp Kit Kat fingers.", 100.0, 120.0, "₹100", "/images/items/kitkat_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-ccw", "Choco Chips Waffle", "DESSERTS", "Warm Belgian waffle studded with chocolate fudge & chips.", 90.0, 110.0, "₹90", "/images/items/choco_chips_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-dcw", "Dark Chocolate Waffle", "DESSERTS", "Rich 70% dark chocolate drizzle on crispy golden waffle.", 80.0, 100.0, "₹80", "/images/items/dark_chocolate_waffle.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-4", "Nutella Chocolate Brownie", "DESSERTS", "Warm chocolate walnut brownie drizzled with rich hazelnut Nutella.", 180.0, 210.0, "₹180", "/images/items/nutella_brownie.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-5", "Brownie with Ice Cream", "DESSERTS", "Sizzling hot brownie topped with chilled vanilla bean ice cream.", 150.0, 175.0, "₹150", "/images/items/brownie_with_icecream.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-bwc", "Brownie with Chocolate", "DESSERTS", "Fudge brownie bathed in warm molten chocolate sauce.", 120.0, 140.0, "₹120", "/images/items/brownie_with_chocolate.jpg", "", false, false, null));
        menuItems.add(new MenuItem("wf-6", "Mini Choco Lava Cake", "DESSERTS", "Gooey chocolate cake with a molten chocolate lava center.", 50.0, 65.0, "₹50", "/images/items/choco_lava_cake.jpg", "", false, false, null));

        // ================= MOMOS, PATTIES, FRIES & CHAAT =================
        Map<String, Double> cheeseCornMomoSizes = new LinkedHashMap<>();
        cheeseCornMomoSizes.put("6 Pcs", 100.0); cheeseCornMomoSizes.put("10 Pcs", 160.0);
        menuItems.add(new MenuItem("mo-1", "Cheese Corn Momos", "SNACKS", "Steamed dumplings stuffed with sweet corn and melted cheese.", 100.0, 120.0, "₹100 / ₹160", "/images/items/cheese_corn_momos.jpg", "", false, false, cheeseCornMomoSizes));

        Map<String, Double> kurkureMomoSizes = new LinkedHashMap<>();
        kurkureMomoSizes.put("6 Pcs", 80.0); kurkureMomoSizes.put("10 Pcs", 120.0);
        menuItems.add(new MenuItem("mo-2", "Kurkure Fry Momos", "SNACKS", "Super-crispy battered crunchy fried dumplings.", 80.0, 100.0, "₹80 / ₹120", "/images/items/kurkure_fry_momos.jpg", "CRUNCHY", false, false, kurkureMomoSizes));

        Map<String, Double> paneerMomoSizes = new LinkedHashMap<>();
        paneerMomoSizes.put("6 Pcs", 80.0); paneerMomoSizes.put("10 Pcs", 110.0);
        menuItems.add(new MenuItem("mo-3", "Paneer Momos", "SNACKS", "Tender dumplings filled with spiced grated paneer and herbs.", 80.0, 100.0, "₹80 / ₹110", "/images/items/paneer_momos.jpg", "", false, false, paneerMomoSizes));

        Map<String, Double> vegFryMomoSizes = new LinkedHashMap<>();
        vegFryMomoSizes.put("6 Pcs", 60.0); vegFryMomoSizes.put("10 Pcs", 90.0);
        menuItems.add(new MenuItem("mo-vf", "Veg Fry Momos", "SNACKS", "Crispy fried dumplings stuffed with spiced vegetables.", 60.0, 80.0, "₹60 / ₹90", "/images/items/veg_fry_momos.jpg", "", false, false, vegFryMomoSizes));

        menuItems.add(new MenuItem("fr-1", "Honey Chilli Potato", "SNACKS", "Crisp fried potato fingers tossed in sweet and fiery honey chili glaze.", 100.0, 120.0, "₹100", "/images/items/honey_chilli_potato.jpg", "HOT", false, false, null));
        menuItems.add(new MenuItem("fr-cp", "Chilli Potato", "SNACKS", "Crispy potato wedges tossed with onions and spicy wok sauce.", 90.0, 110.0, "₹90", "/images/items/chilli_potato.jpg", "", false, false, null));
        menuItems.add(new MenuItem("fr-2", "Cheese Fries", "SNACKS", "Golden crisp french fries smothered in warm cheese sauce.", 90.0, 110.0, "₹90", "/images/items/cheese_fries.jpg", "", false, false, null));
        menuItems.add(new MenuItem("fr-3", "Peri Peri Fries", "SNACKS", "Freshly fried potatoes dusted with authentic spicy African peri-peri mix.", 80.0, 100.0, "₹80", "/images/items/peri_peri_fries.jpg", "", false, false, null));
        menuItems.add(new MenuItem("fr-4", "Masala Fries", "SNACKS", "Seasoned with tangy chatpata Indian cafe spice blend.", 70.0, 85.0, "₹70", "/images/items/masala_fries.jpg", "", false, false, null));
        menuItems.add(new MenuItem("fr-5", "Salted Fries", "SNACKS", "Classic salted golden crispy potato fries.", 60.0, 75.0, "₹60", "/images/items/salted_fries.jpg", "", false, false, null));
        menuItems.add(new MenuItem("sn-sr", "Spring Roll", "SNACKS", "Golden crispy thin wrappers packed with savory stir-fried noodles & veggies.", 90.0, 110.0, "₹90", "/images/items/spring_roll.jpg", "", false, false, null));

        menuItems.add(new MenuItem("pt-1", "Paneer Tikka Patties", "SNACKS", "Flaky puff pastry stuffed with spicy paneer tikka filling.", 70.0, 85.0, "₹70", "/images/items/paneer_tikka_patties.jpg", "", false, false, null));
        menuItems.add(new MenuItem("pt-2", "Pizza Patties", "SNACKS", "Puff pastry loaded with pizza sauce, veggies, and cheese.", 70.0, 85.0, "₹70", "/images/items/pizza_patties.jpg", "", false, false, null));
        menuItems.add(new MenuItem("pt-3", "Cheese Patties", "SNACKS", "Golden flaky pastry with gooey melted cheese filling.", 60.0, 75.0, "₹60", "/images/items/cheese_patties.jpg", "", false, false, null));
        menuItems.add(new MenuItem("pt-tp", "Tandoori Patties", "SNACKS", "Flaky puff pastry stuffed with smoky tandoori spiced filling.", 60.0, 75.0, "₹60", "/images/items/tandoori_patties.jpg", "", false, false, null));
        menuItems.add(new MenuItem("pt-pp", "Paneer Patties", "SNACKS", "Puff pastry loaded with spiced cottage cheese.", 50.0, 65.0, "₹50", "/images/items/paneer_patties.jpg", "", false, false, null));
        menuItems.add(new MenuItem("pt-4", "Aloo Patties", "SNACKS", "Classic bakery aloo masala puff pastry.", 40.0, 50.0, "₹40", "/images/items/aloo_patties.jpg", "", false, false, null));

        // MASALA CHAAT
        menuItems.add(new MenuItem("ch-pc", "Peanut Chaat", "SNACKS", "Roasted peanuts tossed with fresh onions, tomatoes, lime and chaat spices.", 70.0, 85.0, "₹70", "/images/items/peanut_chaat.jpg", "", false, false, null));
        menuItems.add(new MenuItem("ch-kc", "Kur Kre Chaat", "SNACKS", "Crunchy corn curl snack mixed with diced veggies and tangy lemon zest.", 60.0, 75.0, "₹60", "/images/items/kurkure_chaat.jpg", "", false, false, null));

        // ================= MAGGI & PASTA =================
        menuItems.add(new MenuItem("mg-1", "Veg Corn Cheese Maggi", "MAGGI", "Two-minute Maggi elevated with sweet corn, vegetables, and molten cheese.", 90.0, 110.0, "₹90", "/images/items/corn_cheese_maggi.jpg", "BESTSELLER", false, false, null));
        menuItems.add(new MenuItem("mg-2", "Paneer Tikka Maggi", "MAGGI", "Maggi noodles stir-fried with charred paneer cubes and tikka spice.", 80.0, 100.0, "₹80", "/images/items/paneer_tikka_maggi.jpg", "", false, false, null));
        menuItems.add(new MenuItem("mg-3", "Schezwan Maggi", "MAGGI", "Spicy Indo-Chinese style noodles with pungent schezwan chili sauce.", 80.0, 95.0, "₹80", "/images/items/schezwan_maggi.jpg", "SPICY", false, false, null));
        menuItems.add(new MenuItem("mg-4", "Punjabi Tadka Maggi", "MAGGI", "Desi tempered Maggi with cumin, onions, tomatoes, and green chilies.", 70.0, 85.0, "₹70", "/images/items/punjabi_tadka_maggi.jpg", "", false, false, null));
        menuItems.add(new MenuItem("mg-cm", "Cheese Maggi", "MAGGI", "Comforting Maggi topped with generous layer of melted cheddar.", 70.0, 85.0, "₹70", "/images/items/cheese_maggi.jpg", "", false, false, null));
        menuItems.add(new MenuItem("mg-5", "Tandoori Maggi", "MAGGI", "Smoky roasted masala infused Maggi with fresh coriander.", 70.0, 85.0, "₹70", "/images/items/tandoori_maggi.jpg", "", false, false, null));
        menuItems.add(new MenuItem("mg-vmm", "Veg Masala Maggi", "MAGGI", "Classic noodles sautéed with garden fresh onions, peas & carrots.", 60.0, 75.0, "₹60", "/images/items/veg_masala_maggi.jpg", "", false, false, null));
        menuItems.add(new MenuItem("mg-6", "Plain Maggi", "MAGGI", "The all-time comfort classic masala Maggi.", 50.0, 60.0, "₹50", "/images/items/plain_maggi.jpg", "", false, false, null));

        menuItems.add(new MenuItem("ps-1", "Makhani Pasta", "PASTA", "Penne pasta enveloped in rich buttery makhani gravy with herbs.", 140.0, 165.0, "₹140", "/images/items/makhani_pasta.jpg", "DESI FUSION", false, false, null));
        menuItems.add(new MenuItem("ps-2", "Pink Sauce Pasta", "PASTA", "Harmonious blend of tangy marinara and creamy white cheese sauce.", 140.0, 165.0, "₹140", "/images/items/pink_sauce_pasta.jpg", "", false, false, null));
        menuItems.add(new MenuItem("ps-3", "White Sauce Pasta", "PASTA", "Penne tossed in garlic bechamel sauce with sweet corn and bell peppers.", 120.0, 145.0, "₹120", "/images/items/white_sauce_pasta.jpg", "", false, false, null));
        menuItems.add(new MenuItem("ps-4", "Red Sauce Pasta", "PASTA", "Authentic Italian tomato basil sauce with oregano and chili flakes.", 100.0, 125.0, "₹100", "/images/items/red_sauce_pasta.jpg", "", false, false, null));

        // ================= SUPER SAVER COMBOS =================
        menuItems.add(new MenuItem("cb-1", "OTC Pizza + Veg Sandwich + 2 Cold Coffee", "COMBOS",
                "Medium OTC Pizza + Crispy Veg Grilled Sandwich + 2 Medium Cold Coffees.",
                330.0, 420.0, "₹330", "/images/items/combo_pizza_sandwich_coffee.jpg", "MEGA SAVER", false, false, null));

        menuItems.add(new MenuItem("cb-2", "2 Aloo Tikki Burger + 2 Cold Coffee + Fries", "COMBOS",
                "2 Aloo Tikki Burgers + 2 Small Cold Coffees + Crispy French Fries basket.",
                220.0, 290.0, "₹220", "/images/items/combo_burgers_fries_coffee.jpg", "BEST VALUE", false, false, null));

        menuItems.add(new MenuItem("cb-3", "Aloo Tikki Burger + Fries + Cold Coffee", "COMBOS",
                "Single meal deal: Aloo Tikki Burger + Salted Fries + Small Cold Coffee.",
                135.0, 175.0, "₹135", "/images/items/combo_burger_fries_coffee.jpg", "SOLO COMBO", false, false, null));


        // ================= PROMOTIONS =================
        promotions.add(new Promotion("p1", "FAST DELIVERY", "DOOR TO DOOR", "QUICK & SAFE DELIVERY", "", "HOTLINE",
                "/images/promo_delivery.jpg", "#A8381D", "9799450432"));

        promotions.add(new Promotion("p2", "MAKE PIZZA ON YOUR TASTE", "1. SELECT CRUST  2. CHOOSE BASE  3. ADD INGREDIENTS", "CUSTOM PIZZA", "FROM ₹80", "BUILD NOW",
                "/images/promo_custom_pizza.jpg", "#E59516", ""));

        promotions.add(new Promotion("p3", "DOUBLE CHEESE PIZZA", "Overloaded dual layers of creamy mozzarella", "SPECIAL OFFER", "₹100", "ONLY ₹100",
                "/images/promo_double_cheese.jpg", "#3E2018", ""));

        promotions.add(new Promotion("p4", "BURGER DAY", "SPECIAL TOT BURGER & FRIES", "SAVE BIG", "50% OFF", "LIMITED TIME",
                "/images/promo_burger_day.jpg", "#F8F4EE", ""));

        promotions.add(new Promotion("p5", "SUPER COMBOS", "OTC Pizza + Sandwich + 2 Cold Coffee", "COMBO DEAL", "SAVE ₹90", "₹330",
                "/images/item_combo.jpg", "#588B46", ""));


        // ================= TESTIMONIALS =================
        testimonials.add(new Testimonial("t1", "RAHUL SHARMA", "Verified Customer",
                "Coffee Go ka Nutella Cold Coffee aur Farm House Pizza ekdum lajawab hai! 30 minute mein hot delivery bhi mili. Bahut badhiya experience raha!",
                "/images/coffeego_logo.png", 5, "2026-09-18", "Zomato Review"));

        testimonials.add(new Testimonial("t2", "AMIT VERMA", "Google Local Guide",
                "Tandoori Gravy Momos aur Special TOT Burger ne toh dil jeet liya! Delivery bhi time pe aati hai. LNMIIT canteen ka best alternative!",
                "/images/coffeego_logo.png", 5, "2026-09-15", "Google Review"));

        testimonials.add(new Testimonial("t3", "PRIYA PATEL", "Top Contributor",
                "Coffee Go mein jo Hazelnut Cold Coffee aur Cheese Burst Sandwich milti hai, woh kisi bhi cafe se behtar hai! Prices bhi reasonable hain aur 30-minute guarantee ne toh mujhe regular customer bana diya!",
                "/images/coffeego_logo.png", 5, "2026-09-22", "Swiggy Review"));

        testimonials.add(new Testimonial("t4", "SNEHA GUPTA", "Cafe Regular",
                "Kesar Elaichi Shake aur Cheese Brust Sandwich toh meri daily favourites ban gayi hain. Best cafe vibes ever!",
                "/images/coffeego_logo.png", 5, "2026-09-10", "Instagram"));

        testimonials.add(new Testimonial("t5", "ARJUN MEHTA", "Daily Subscriber",
                "\u20b9330 mein 2 cold coffees + pizza combo? Bilkul mast deal hai yaar! Garam aur fresh delivery bhi mili. 10/10!",
                "/images/coffeego_logo.png", 5, "2026-09-08", "Google Review"));
    }

    public List<MenuItem> getAllMenuItems() {
        return Collections.unmodifiableList(menuItems);
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        if (category == null || category.trim().isEmpty() || "ALL".equalsIgnoreCase(category)) {
            return getAllMenuItems();
        }
        return menuItems.stream()
                .filter(item -> category.equalsIgnoreCase(item.getCategory()))
                .collect(Collectors.toList());
    }

    public List<MenuItem> getBestSellers() {
        return menuItems.stream()
                .filter(MenuItem::isBestSeller)
                .collect(Collectors.toList());
    }

    public Optional<MenuItem> getMenuItemById(String id) {
        return menuItems.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst();
    }

    public List<Promotion> getPromotions() {
        return Collections.unmodifiableList(promotions);
    }

    public List<Testimonial> getTestimonials() {
        return Collections.unmodifiableList(testimonials);
    }
}

async function searchCommons(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CoffeeGoApp/1.0 (contact@cafe.local)' } });
    const data = await res.json();
    if (!data.query || !data.query.pages) return null;
    const candidates = [];
    for (const p of Object.values(data.query.pages)) {
      if (!p.imageinfo || !p.imageinfo[0]) continue;
      const u = p.imageinfo[0].thumburl;
      const t = p.title.toLowerCase();
      if ((t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.webp')) &&
          !t.includes('.pdf') && !t.includes('.djvu') && !t.includes('flag') && !t.includes('logo') && !t.includes('icon') && !t.includes('map') && !t.includes('diagram')) {
        candidates.push({ title: p.title, url: u });
      }
    }
    return candidates.length > 0 ? candidates[0] : null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const testList = [
    { name: "Cranberry Mojito", q: "cranberry cocktail glass" },
    { name: "Blueberry Mojito", q: "blueberry drink cocktail glass" },
    { name: "Strawberry Mojito", q: "strawberry mojito cocktail glass" },
    { name: "Orange Mojito", q: "orange cocktail drink mint" },
    { name: "Watermelon Mojito", q: "watermelon drink cocktail mint" },
    { name: "Virgin Mojito", q: "mojito cocktail mint lime" },
    { name: "Blue Lagoon Mocktail", q: "blue lagoon cocktail glass" },
    { name: "Peach Iced Tea", q: "peach iced tea glass" },
    { name: "Lemon Iced Tea", q: "lemon iced tea glass" },
    { name: "Hot and Sour Soup", q: "hot and sour soup bowl" },
    { name: "Sweet Corn Soup", q: "sweet corn soup bowl" },
    { name: "Tomato Soup", q: "tomato soup bowl croutons" },
    { name: "Hazelnut Cold Coffee", q: "iced coffee glass" },
    { name: "Caramel Cold Coffee", q: "caramel macchiato iced glass" },
    { name: "Chocolate Cold Coffee", q: "iced mocha glass" },
    { name: "Hot Chocolate", q: "hot chocolate mug whipped cream" },
    { name: "Vanilla Hot Coffee", q: "vanilla latte cup" },
    { name: "Peppy Paneer Pizza", q: "paneer pizza" },
    { name: "Corn Cheese Pizza", q: "corn pizza cheese" },
    { name: "Margherita Pizza", q: "pizza margherita basil" },
    { name: "Cheese Paneer Burger", q: "paneer burger" },
    { name: "Mexican Cheese Burger", q: "cheeseburger jalapeno" },
    { name: "Veg Tikki Burger", q: "veggie burger sandwich" },
    { name: "Cheese Burst Sandwich", q: "grilled cheese sandwich melted" },
    { name: "Paneer Tikka Sandwich", q: "paneer tikka sandwich" },
    { name: "Veg Grill Sandwich", q: "vegetable sandwich grilled" },
    { name: "Nutella Shake", q: "chocolate milkshake whipped cream" },
    { name: "Mango Shake", q: "mango milkshake glass" },
    { name: "Oreo Shake", q: "oreo milkshake glass" },
    { name: "Strawberry Shake", q: "strawberry milkshake glass" },
    { name: "Belgian Waffle", q: "waffles ice cream chocolate" },
    { name: "Brownie with Ice Cream", q: "brownie vanilla ice cream" },
    { name: "Choco Lava Cake", q: "chocolate lava cake" },
    { name: "Honey Chilli Potato", q: "honey chilli potato" },
    { name: "Cheese Fries", q: "cheese fries" },
    { name: "Peri Peri Fries", q: "french fries spicy" },
    { name: "Spring Roll", q: "crispy spring rolls sweet chili" },
    { name: "Aloo Patties", q: "aloo puff pastry" },
    { name: "Maggi Noodles", q: "maggi noodles bowl" }
  ];

  for (const item of testList) {
    const res = await searchCommons(item.q);
    console.log(item.name, '=>', res ? res.title : 'NOT FOUND');
  }
}

run();

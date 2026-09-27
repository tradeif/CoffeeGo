const fs = require('fs');

const files = ['choco_chips_cold_coffee.jpg', 'regular_hot_coffee.jpg', 'corn_cheese_wrap.jpg'];
files.forEach(f => {
  const buf = fs.readFileSync('src/main/resources/static/images/items/' + f);
  console.log(f, buf.slice(0, 16).toString('hex'), buf.slice(0, 16).toString('ascii'));
});

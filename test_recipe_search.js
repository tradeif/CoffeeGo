async function searchRecipeSite(site, dish) {
  const q = `site:${site} ${dish}`;
  const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(q) + '&first=1';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  const regex = /murl&quot;:&quot;(https?:\/\/[^&"']+)&quot;/g;
  let m;
  const list = [];
  const baseDomain = site.split('.')[0];
  while ((m = regex.exec(html)) !== null) {
    const u = m[1];
    if (u.includes(baseDomain) && !u.includes('logo') && !u.includes('icon') && !u.includes('author') && !u.includes('banner')) {
      list.push(u);
    }
  }
  console.log(site, dish, '->', list.slice(0, 3));
  return list[0];
}

(async () => {
  await searchRecipeSite('hebbarskitchen.com', 'corn cheese wrap');
  await searchRecipeSite('hebbarskitchen.com', 'aloo wrap');
  await searchRecipeSite('hebbarskitchen.com', 'spring roll');
  await searchRecipeSite('vegrecipesofindia.com', 'steamed momos');
  await searchRecipeSite('vegrecipesofindia.com', 'veg burger');
})();

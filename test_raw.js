async function testRaw(q) {
  const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent(q) + '&first=1';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  const regex = /murl&quot;:&quot;(https?:\/\/[^&"']+)&quot;/g;
  let m;
  const list = [];
  while ((m = regex.exec(html)) !== null) {
    list.push(m[1]);
  }
  console.log(q, '->');
  list.slice(0, 5).forEach(u => console.log('  ', u));
}

(async () => {
  await testRaw('hebbars kitchen cheese corn frankie roll recipe');
  await testRaw('veg recipes of india aloo wrap frankie recipe');
  await testRaw('crispy spring rolls recipe veg recipes of india');
  await testRaw('veg momos recipe hebbars kitchen');
})();

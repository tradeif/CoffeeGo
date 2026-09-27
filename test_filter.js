async function searchBingClean(query) {
  const res = await fetch('https://www.bing.com/images/search?q=' + encodeURIComponent(query) + '&first=1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const regex = /murl&quot;:&quot;(https?:\/\/[^&"']+)&quot;/g;
  const list = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const u = m[1];
    if (!/vecteezy|freepik|ftcdn|adobe|shutterstock|istock|getty|alamy|123rf|depositphotos|dreamstime|cartoon|vector|icon/i.test(u)) {
      list.push(u);
    }
  }
  return list;
}

async function run() {
  const r = await searchBingClean('triple grilled cheese sandwich food blog');
  console.log('Clean non-stock images found:', r.length);
  r.slice(0, 5).forEach(u => console.log(' ->', u));
}
run();

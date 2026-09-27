async function searchBing(query) {
  try {
    const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res.text();
    const regex = /murl&quot;:&quot;(https?:\/\/[^&"]+)&quot;/g;
    const matches = [];
    let m;
    while ((m = regex.exec(html)) !== null) {
      matches.push(m[1]);
    }
    return matches;
  } catch (e) {
    return [];
  }
}

async function run() {
  const queries = [
    'cold coffee with choco chips glass recipe',
    'cranberry mojito drink mint glass recipe',
    'sweet corn cheese pizza slice',
    'cheese burst grilled sandwich',
    'honey chilli potato sesame',
    'hot chocolate mug whipped cream'
  ];
  for (const q of queries) {
    const r = await searchBing(q);
    console.log(q, '=> found:', r.length);
    if (r.length > 0) {
      console.log('  sample:', r[0]);
    }
  }
}
run();

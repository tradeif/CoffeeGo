async function searchDDG(query) {
  try {
    const initRes = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await initRes.text();
    const vqdRegex = /vqd=([0-9-_]+)/;
    const m = html.match(vqdRegex);
    if (!m) {
      console.log('No vqd found, length:', html.length);
      return [];
    }
    const vqd = m[1];
    const imgUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,type:photo,&p=1`;
    const imgRes = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    const data = await imgRes.json();
    return data.results || [];
  } catch (e) {
    console.error('Error:', e.message);
    return [];
  }
}

async function run() {
  const results = await searchDDG('blueberry mojito drink');
  console.log('Found:', results.length);
  if (results.length > 0) {
    console.log('Sample:', results[0].image, results[0].title);
  }
}
run();

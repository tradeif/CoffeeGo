const https = require('https');
const url = 'https://www.bing.com/images/search?q=' + encodeURIComponent('site:youtube.com "paneer maggi"') + '&form=HDRSC2';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const matches = [];
    const regex = /murl&quot;:&quot;(https?:\/\/[^&]+?\.(?:jpg|jpeg|png|webp))&quot;/g;
    let m;
    while ((m = regex.exec(html)) !== null) matches.push(m[1]);
    console.log(matches.slice(0, 10));
  });
});

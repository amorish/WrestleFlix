const https = require('https');
https.get('https://www.youtube.com/playlist?list=PLgqDyJZN9OYlC7dbsNRrLqTuw_f7OE3fc', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const ids = [];
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      if (!ids.includes(match[1])) ids.push(match[1]);
    }
    console.log(JSON.stringify(ids));
  });
});

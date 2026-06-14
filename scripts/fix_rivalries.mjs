const fs = require('fs');
const ytSearch = require('yt-search');

async function buildPlaylist(rivalry) {
  const query = rivalry.match + ' ' + rivalry.promotion;
  try {
    const r = await ytSearch(query);
    const vids = r.videos.slice(0, 3).map(v => v.videoId);
    return vids.length > 0 ? vids : null;
  } catch(e) {}
  return null;
}

(async () => {
  let data = JSON.parse(fs.readFileSync('src/data/matches.json', 'utf8'));
  for (const m of data) {
    if (m.category === 'Legendary Rivalries') {
      const vids = await buildPlaylist(m);
      if (vids) {
        m.videoId = vids;
        m.videoSource = 'youtube';
      }
    }
  }
  fs.writeFileSync('src/data/matches.json', JSON.stringify(data, null, 2));
  console.log('Done building playlists');
})();

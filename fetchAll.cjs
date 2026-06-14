const fs = require('fs');
const https = require('https');

const playlists = {
  'PLgqDyJZN9OYlC7dbsNRrLqTuw_f7OE3fc': 'hist-4',
  'PLlj3Hc_QGrSdOnoJnKeMOR7Rg2UK1HY0v': 'fe-1',
  'PLfalIYDZtGGDBmKl0slVTSSHEbbi1iTRu': 'fe-2',
  'PLEpTCGDuJrIlSuw9dmXVmpqQX80CjN4aP': 'fe-3'
};

let appFile = fs.readFileSync('src/App.tsx', 'utf8');
let promises = [];

Object.keys(playlists).forEach(pl => {
  promises.push(new Promise((resolve) => {
    https.get('https://www.youtube.com/playlist?list=' + pl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const ids = [];
        const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        let match;
        while ((match = regex.exec(data)) !== null) {
          if (!ids.includes(match[1])) ids.push(match[1]);
        }
        resolve({ pl, ids });
      });
    });
  }));
});

Promise.all(promises).then(results => {
  results.forEach(({ pl, ids }) => {
    if (ids.length > 0) {
      const stringifiedIds = JSON.stringify(ids).replace(/"/g, "'");
      const regex = new RegExp("videoId:\\s*'" + pl + "'");
      appFile = appFile.replace(regex, "videoId: " + stringifiedIds);
      
      // Remove thumbnailId so it auto-generates correctly from the first element in the array
      // Find the object containing this playlist and remove the thumbnailId property from it
      const objectRegex = new RegExp("(\\{[^\\}]*)videoId:\\s*\\[[^\\]]+\\]([^\\}]*\\})", "g");
      appFile = appFile.replace(objectRegex, (match) => {
        return match.replace(/,\s*thumbnailId:\s*'[^']+'/, '');
      });
    }
  });
  fs.writeFileSync('src/App.tsx', appFile);
  console.log('done');
});

import fs from 'fs';
import yts from 'yt-search';
import https from 'https';

const matchesPath = 'src/data/matches.json';
let matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

// Dailymotion fetch helper
function fetchDailymotionDuration(vid) {
  return new Promise((resolve) => {
    https.get(`https://api.dailymotion.com/video/${vid}?fields=duration`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.duration || 0);
        } catch {
          resolve(0);
        }
      });
    }).on('error', () => resolve(0));
  });
}

// Format seconds into MM:SS or HH:MM:SS
function formatDuration(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return 'N/A';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function getVideoDuration(vid, source) {
  if (source === 'dailymotion') {
    return await fetchDailymotionDuration(vid);
  } else if (source === 'youtube') {
    try {
      const fetchPromise = yts({ videoId: vid });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000));
      const r = await Promise.race([fetchPromise, timeoutPromise]);
      return r.duration ? r.duration.seconds : 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

async function main() {
  console.log(`Starting duration fetch for ${matches.length} matches...`);
  
  let processed = 0;
  let updated = 0;

  for (const match of matches) {
    processed++;
    // Skip if already has duration
    if (match.duration && match.duration !== 'N/A') {
      continue;
    }
    
    // Skip if no video id
    if (!match.videoId || match.videoId === 'TODO') {
      match.duration = 'N/A';
      continue;
    }

    let totalSeconds = 0;

    if (Array.isArray(match.videoId)) {
      // It's a playlist, calculate average duration
      let sum = 0;
      let count = 0;
      for (const vid of match.videoId) {
        const sec = await getVideoDuration(vid, match.videoSource || 'youtube');
        if (sec > 0) {
          sum += sec;
          count++;
        }
      }
      if (count > 0) {
        totalSeconds = Math.round(sum / count);
      }
    } else {
      // Single video
      totalSeconds = await getVideoDuration(match.videoId, match.videoSource || 'youtube');
    }

    match.duration = formatDuration(totalSeconds);
    updated++;

    process.stdout.write(`Processed ${processed} / ${matches.length}. Updated: ${updated}\n`);
    
    // Save progress iteratively
    if (updated % 5 === 0 || processed === matches.length) {
      fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    }
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nFinished! Updated ${updated} matches.`);
}

main();

import fs from 'fs';

const matches = JSON.parse(fs.readFileSync('src/data/matches.json', 'utf8'));

function extractParticipants(matchString) {
    let s = matchString.replace(/ vs\. | and | & |,/g, ',');
    s = s.replace(/\(|\)/g, ',');
    return s.split(',').map(p => p.trim()).filter(p => p);
}

function isValidMatchVideo(title, matchString, eventName, isDuplicate) {
    const participants = extractParticipants(matchString);
    const ignored = new Set(['the', 'jr', 'vs', 'and']);
    
    for (const p of participants) {
        const words = p.match(/[a-zA-Z0-9]+/g);
        if (!words) continue;
        let validWords = words.filter(w => !ignored.has(w.toLowerCase()));
        if (validWords.length === 0) validWords = words;
        
        const keyword = validWords.reduce((a, b) => a.length >= b.length ? a : b);
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (!regex.test(title)) return false;
    }
    
    if (isDuplicate) {
        const words = eventName.match(/[a-zA-Z0-9]+/g);
        if (words) {
            let validWords = words.filter(w => !ignored.has(w.toLowerCase()));
            if (validWords.length > 0) {
                const keyword = validWords.reduce((a, b) => a.length >= b.length ? a : b);
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (!regex.test(title)) return false;
            }
        }
    }
    return true;
}

async function getYtTitle(vid) {
    try {
        const res = await fetch(`https://www.youtube.com/watch?v=${vid}`, { signal: AbortSignal.timeout(5000) });
        const html = await res.text();
        const m = html.match(/<title>(.*?)<\/title>/);
        return m ? m[1].replace(' - YouTube', '') : '';
    } catch { return ''; }
}

async function getDmTitle(vid) {
    try {
        const res = await fetch(`https://api.dailymotion.com/video/${vid}?fields=title`, { signal: AbortSignal.timeout(5000) });
        const json = await res.json();
        return json.title || '';
    } catch { return ''; }
}

function normalizeMatchName(name) {
    return name.split(' vs. ').map(p => p.trim()).sort().join(' vs. ');
}

async function main() {
    const matchCounts = {};
    for (const m of matches) {
        const norm = normalizeMatchName(m.match);
        matchCounts[norm] = (matchCounts[norm] || 0) + 1;
    }

    let cleared = 0;
    
    // Process in batches of 10 to avoid hanging/rate limits but keep it fast
    for (let i = 0; i < matches.length; i += 10) {
        const batch = matches.slice(i, i + 10);
        await Promise.all(batch.map(async (m) => {
            const vid = m.videoId;
            if (!vid) return;
            
            const source = m.videoSource;
            let title = '';
            if (source === 'youtube') title = await getYtTitle(vid);
            else if (source === 'dailymotion') title = await getDmTitle(vid);
            
            const norm = normalizeMatchName(m.match);
            const isDuplicate = matchCounts[norm] > 1;
            
            if (title) {
                if (!isValidMatchVideo(title, m.match, m.event || '', isDuplicate)) {
                    m.videoId = null;
                    m.videoSource = null;
                    cleared++;
                }
            }
        }));
        process.stdout.write(`Processed ${Math.min(i + 10, matches.length)} / ${matches.length} matches...\r`);
    }

    if (cleared > 0) {
        fs.writeFileSync('src/data/matches.json', JSON.stringify(matches, null, 2));
        console.log(`\nCleared ${cleared} wrong videos.`);
    } else {
        console.log('\nAll good.');
    }
}

main();

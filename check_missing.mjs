import fs from 'fs';

const matches = JSON.parse(fs.readFileSync('src/data/matches.json', 'utf8'));

async function checkYouTube(vid) {
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`, {
            signal: AbortSignal.timeout(8000)
        });
        if (res.status === 200) return { available: true };
        return { available: false, reason: `HTTP ${res.status}` };
    } catch (e) {
        return { available: false, reason: e.message };
    }
}

async function checkDailymotion(vid) {
    try {
        const res = await fetch(`https://api.dailymotion.com/video/${vid}?fields=title,status`, {
            signal: AbortSignal.timeout(8000)
        });
        const json = await res.json();
        if (json.error) return { available: false, reason: json.error.message || 'error' };
        return { available: true };
    } catch (e) {
        return { available: false, reason: e.message };
    }
}

async function main() {
    const results = { missing: [], dead: [], total: matches.length };

    // Find entries with videoSource = "undefined" or missing
    for (const m of matches) {
        if (!m.videoSource || m.videoSource === 'undefined' || m.videoSource === 'null') {
            results.missing.push({
                id: m.id,
                match: m.match,
                event: m.event,
                date: m.date,
                videoId: m.videoId,
                videoSource: m.videoSource,
                issue: 'missing_source'
            });
        }
    }

    // Check YouTube videos
    const ytMatches = matches.filter(m => m.videoSource === 'youtube');
    console.log(`Checking ${ytMatches.length} YouTube videos...`);
    
    for (let i = 0; i < ytMatches.length; i += 10) {
        const batch = ytMatches.slice(i, i + 10);
        const checks = await Promise.all(batch.map(async (m) => {
            const vids = Array.isArray(m.videoId) ? m.videoId : [m.videoId];
            for (const vid of vids) {
                const result = await checkYouTube(vid);
                if (!result.available) {
                    return {
                        id: m.id,
                        match: m.match,
                        event: m.event,
                        date: m.date,
                        videoId: vid,
                        videoSource: 'youtube',
                        issue: 'dead_video',
                        reason: result.reason
                    };
                }
            }
            return null;
        }));
        checks.filter(Boolean).forEach(c => results.dead.push(c));
        process.stdout.write(`  YouTube: ${Math.min(i + 10, ytMatches.length)} / ${ytMatches.length}\r`);
    }
    console.log('');

    // Check Dailymotion videos
    const dmMatches = matches.filter(m => m.videoSource === 'dailymotion');
    console.log(`Checking ${dmMatches.length} Dailymotion videos...`);
    
    for (let i = 0; i < dmMatches.length; i += 5) {
        const batch = dmMatches.slice(i, i + 5);
        const checks = await Promise.all(batch.map(async (m) => {
            const vids = Array.isArray(m.videoId) ? m.videoId : [m.videoId];
            for (const vid of vids) {
                const result = await checkDailymotion(vid);
                if (!result.available) {
                    return {
                        id: m.id,
                        match: m.match,
                        event: m.event,
                        date: m.date,
                        videoId: vid,
                        videoSource: 'dailymotion',
                        issue: 'dead_video',
                        reason: result.reason
                    };
                }
            }
            return null;
        }));
        checks.filter(Boolean).forEach(c => results.dead.push(c));
        process.stdout.write(`  Dailymotion: ${Math.min(i + 5, dmMatches.length)} / ${dmMatches.length}\r`);
    }
    console.log('');

    // Output results
    console.log('\n========================================');
    console.log(`TOTAL MATCHES: ${results.total}`);
    console.log(`MISSING SOURCE: ${results.missing.length}`);
    console.log(`DEAD VIDEOS: ${results.dead.length}`);
    console.log('========================================\n');

    if (results.missing.length > 0) {
        console.log('--- MISSING VIDEO SOURCE ---');
        results.missing.forEach(m => {
            console.log(`  [${m.id}] ${m.match} (${m.event}, ${m.date}) - videoId: ${m.videoId}`);
        });
        console.log('');
    }

    if (results.dead.length > 0) {
        console.log('--- DEAD/UNAVAILABLE VIDEOS ---');
        results.dead.forEach(m => {
            console.log(`  [${m.id}] ${m.match} (${m.event}, ${m.date}) - ${m.videoSource}:${m.videoId} - ${m.reason}`);
        });
        console.log('');
    }

    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        total: results.total,
        missingSource: results.missing,
        deadVideos: results.dead,
        summary: {
            totalMissing: results.missing.length,
            totalDead: results.dead.length,
            totalProblematic: results.missing.length + results.dead.length
        }
    };
    fs.writeFileSync('missing_videos_report.json', JSON.stringify(report, null, 2));
    console.log('Report saved to missing_videos_report.json');
}

main();

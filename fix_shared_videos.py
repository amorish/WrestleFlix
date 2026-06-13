import json
import urllib.request
import urllib.parse
import re
import time
import random
from collections import defaultdict
import sys

bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along', 'top 10', 'highlights', 'short']

def is_bad_title(title):
    return any(word in title.lower() for word in bad_keywords)

def search_youtube(query, used_video_ids):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        
        blocks = html.split('"videoRenderer":{')
        for block in blocks[1:]:
            vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
            if not vid_match: continue
            vid = vid_match.group(1)
            
            title_match = re.search(r'"title":\{"runs":\[\{"text":"([^"]+)"', block)
            title = title_match.group(1) if title_match else ""
            
            if is_bad_title(title) or vid in used_video_ids: continue
            
            time_match = re.search(r'"lengthText":\{[^}]*"simpleText":"([\d:]+)"', block)
            if not time_match: continue
            time_str = time_match.group(1)
            parts = time_str.split(':')
            seconds = int(parts[0])*3600 + int(parts[1])*60 + int(parts[2]) if len(parts)==3 else int(parts[0])*60 + int(parts[1]) if len(parts)==2 else 0
                
            if 900 <= seconds <= 5400: return vid
    except Exception: pass
    return None

def search_dailymotion(query, used_video_ids):
    url = f"https://api.dailymotion.com/videos?search={urllib.parse.quote(query)}&fields=id,title,duration&limit=10"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        for v in data.get('list', []):
            if not is_bad_title(v.get('title', '')) and v['id'] not in used_video_ids and 900 <= v.get('duration', 0) <= 5400:
                return v['id']
    except Exception: pass
    return None

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)

    # Find duplicates
    vids = defaultdict(list)
    for m in matches:
        if m.get('videoId'): vids[m['videoId']].append(m)

    shared_vids = {k: v for k, v in vids.items() if len(v) > 1}
    
    used_video_ids = set()
    for k, v in vids.items():
        if len(v) == 1:
            used_video_ids.add(k)
            
    print(f"Found {len(shared_vids)} videos shared illegally among multiple matches.")
    
    matches_to_fix = []
    for k, match_list in shared_vids.items():
        for m in match_list:
            m['videoId'] = None
            matches_to_fix.append(m)

    print(f"Fixing {len(matches_to_fix)} matches with ultra-specific queries...")
    
    updated_count = 0
    for i, match in enumerate(matches_to_fix):
        query = f"{match['match']} {match.get('event', '')} {match.get('date', '')} full match"
        print(f"[{i+1}/{len(matches_to_fix)}] Specific Search: {query}")
        
        vid = search_youtube(query, used_video_ids)
        source = 'youtube'
        if not vid:
            vid = search_dailymotion(query, used_video_ids)
            source = 'dailymotion'
            
        if vid:
            print(f" -> Found unique {source} video {vid}")
            match['videoId'] = vid
            match['videoSource'] = source
            used_video_ids.add(vid)
            updated_count += 1
        else:
            print(" -> FAILED to find any unique video.")
            
        if updated_count > 0 and updated_count % 5 == 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(matches, f, indent=2)
                
        time.sleep(random.uniform(2, 4))
        sys.stdout.flush()

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)
    print(f"Fixed {updated_count} matches.")

if __name__ == '__main__':
    main()

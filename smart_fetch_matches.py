import json
import urllib.request
import urllib.parse
import re
import time
import random
import sys

bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along', 'top 10', 'highlights', 'short']

def is_bad_title(title):
    title_lower = title.lower()
    return any(word in title_lower for word in bad_keywords)

def extract_participants(match_string):
    s = match_string.replace(' vs. ', ',').replace(' and ', ',').replace(' & ', ',')
    s = s.replace('(', ',').replace(')', ',')
    parts = [p.strip() for p in s.split(',')]
    return [p for p in parts if p]

def is_valid_match_video(title, match_string, event_name, is_duplicate):
    participants = extract_participants(match_string)
    ignored = {'the', 'jr', 'vs', 'and'}
    
    for p in participants:
        words = re.findall(r'[a-zA-Z0-9]+', p)
        if not words: continue
        valid_words = [w for w in words if w.lower() not in ignored]
        if not valid_words:
            valid_words = words
        keyword = max(valid_words, key=len)
        if not re.search(r'\b' + re.escape(keyword) + r'\b', title, re.IGNORECASE):
            return False
            
    if is_duplicate:
        words = re.findall(r'[a-zA-Z0-9]+', event_name)
        valid_words = [w for w in words if w.lower() not in ignored]
        if valid_words:
            keyword = max(valid_words, key=len)
            if not re.search(r'\b' + re.escape(keyword) + r'\b', title, re.IGNORECASE):
                return False
                
    return True

def search_youtube(query, used_video_ids, match_string, event_name, is_duplicate):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        
        blocks = html.split('"videoRenderer":{')
        for block in blocks[1:]:
            vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
            if not vid_match: continue
            vid = vid_match.group(1)
            
            title_match = re.search(r'"title":\{"runs":\[\{"text":"([^"]+)"', block)
            title = title_match.group(1) if title_match else ""
            
            if is_bad_title(title):
                continue
                
            if not is_valid_match_video(title, match_string, event_name, is_duplicate):
                continue
                
            if vid in used_video_ids:
                continue
            
            time_match = re.search(r'"lengthText":\{.*?"simpleText":"([\d:]+)"', block)
            if not time_match: continue
            
            time_str = time_match.group(1)
            parts = time_str.split(':')
            seconds = 0
            if len(parts) == 3:
                seconds = int(parts[0])*3600 + int(parts[1])*60 + int(parts[2])
            elif len(parts) == 2:
                seconds = int(parts[0])*60 + int(parts[1])
                
            if 900 <= seconds <= 5400:
                return vid
    except Exception as e:
        print("Error fetching YT for", query, e)
    return None

def search_dailymotion(query, used_video_ids, match_string, event_name, is_duplicate):
    url = f"https://api.dailymotion.com/videos?search={urllib.parse.quote(query)}&fields=id,title,duration&limit=10"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        for v in data.get('list', []):
            dur = v.get('duration', 0)
            title = v.get('title', '')
            vid = v['id']
            
            if is_bad_title(title) or vid in used_video_ids:
                continue
                
            if not is_valid_match_video(title, match_string, event_name, is_duplicate):
                continue
            
            if 900 <= dur <= 5400:
                return vid
                
    except Exception as e:
        print(f"Error fetching DM API for {query}: {e}")
    return None

def normalize_match_name(name):
    parts = [p.strip() for p in name.split(' vs. ')]
    return ' vs. '.join(sorted(parts))

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    match_counts = {}
    for match in matches:
        norm = normalize_match_name(match['match'])
        match_counts[norm] = match_counts.get(norm, 0) + 1
        
    used_video_ids = set()
    updated_count = 0
    
    print(f"Starting Smart Fetch for {len(matches)} matches...")
    
    for i, match in enumerate(matches):
        match_name = match['match']
        event = match.get('event', '')
        
        # We will process everything to replace invalid ones, or skip if valid?
        # Since logic changed, we might want to let it run on everything, 
        # but to speed it up we can skip ones that already have a video.
        if match.get('videoId'):
            continue
            
        norm = normalize_match_name(match_name)
        is_duplicate = match_counts[norm] > 1
        
        query_base = match_name
        if is_duplicate:
            date = match.get('date', '')
            year = date[-4:] if len(date) >= 4 else ''
            query_base = f"{match_name} {event} {year}"
            print(f"[{i+1}/{len(matches)}] Duplicate found, searching with context: {query_base}")
        else:
            print(f"[{i+1}/{len(matches)}] Searching: {query_base}")
            
        yt_query = f"{query_base} full match"
        
        vid = search_youtube(yt_query, used_video_ids, match_name, event, is_duplicate)
        source = 'youtube'
        
        if not vid:
            print(" -> YT failed or found duplicate. Trying Dailymotion...")
            vid = search_dailymotion(query_base, used_video_ids, match_name, event, is_duplicate)
            source = 'dailymotion'
            
        if vid:
            if match.get('videoId') != vid:
                print(f" -> Success: Found {source} video {vid}")
                match['videoId'] = vid
                match['videoSource'] = source
                updated_count += 1
            else:
                print(f" -> Kept existing {source} video {vid}")
            
            used_video_ids.add(vid)
        else:
            print(" -> Failed to find any suitable video.")
            
        if updated_count > 0 and updated_count % 5 == 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(matches, f, indent=2)
                
        time.sleep(random.uniform(2.0, 4.0))
        sys.stdout.flush()

    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Smart Fetch Complete. Updated {updated_count} matches.")
    else:
        print("Smart Fetch Complete. No updates needed.")

if __name__ == '__main__':
    main()

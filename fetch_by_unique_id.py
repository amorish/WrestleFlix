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

def is_valid_match_video(title, match_string):
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
    return True

def search_youtube(query, used_video_ids, match_string):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        
        blocks = html.split('"videoRenderer":{')
        for block in blocks[1:]:
            vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
            if not vid_match: continue
            vid = vid_match.group(1)
            
            title_match = re.search(r'"title":\{"runs":\[\{"text":"([^"]+)"', block)
            title = title_match.group(1) if title_match else ""
            
            if is_bad_title(title) or vid in used_video_ids:
                continue
                
            if not is_valid_match_video(title, match_string):
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
                
            if 300 <= seconds <= 7200: # 5 min to 2 hours
                return vid
    except Exception as e:
        pass
    return None

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    used_video_ids = set([m['videoId'] for m in matches if m.get('videoId')])
    updated_count = 0
    
    missing_matches = [m for m in matches if not m.get('videoId')]
    print(f"Starting fetch for {len(missing_matches)} matches without videoId...")
    
    for i, match in enumerate(matches):
        if match.get('videoId'):
            continue
            
        match_name = match.get('match', '')
        brand = match.get('promotion', '')
        date = match.get('date', '')
        event = match.get('event', '')
        
        # Unique ID as search query
        query = f"{match_name} {brand} {date} {event} full match"
        print(f"[{updated_count+1}/{len(missing_matches)}] Searching: {query}")
        
        vid = search_youtube(query, used_video_ids, match_name)
        
        if vid:
            print(f" -> Success: Found YouTube video {vid}")
            match['videoId'] = vid
            match['videoSource'] = 'youtube'
            used_video_ids.add(vid)
            updated_count += 1
            
            if updated_count % 5 == 0:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(matches, f, indent=2)
        else:
            print(" -> Failed to find a suitable video.")
            
        time.sleep(random.uniform(0.5, 1.5))
        sys.stdout.flush()

    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Fetch Complete. Updated {updated_count} matches.")
    else:
        print("Fetch Complete. No updates made.")

if __name__ == '__main__':
    main()

import json
import urllib.request
import urllib.parse
import re
import time

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

def get_yt_title(vid):
    try:
        url = f'https://www.youtube.com/watch?v={vid}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        m = re.search(r'<title>(.*?)</title>', html)
        return m.group(1).replace(' - YouTube', '') if m else ''
    except: return ''

def get_dm_title(vid):
    try:
        url = f'https://api.dailymotion.com/video/{vid}?fields=title'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        return res.get('title', '')
    except: return ''

def normalize_match_name(name):
    parts = [p.strip() for p in name.split(' vs. ')]
    return ' vs. '.join(sorted(parts))

def main():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    match_counts = {}
    for match in matches:
        norm = normalize_match_name(match['match'])
        match_counts[norm] = match_counts.get(norm, 0) + 1

    cleared = 0
    total = len(matches)
    for i, m in enumerate(matches):
        vid = m.get('videoId')
        if not vid: continue
        
        source = m.get('videoSource')
        title = ''
        if source == 'youtube':
            title = get_yt_title(vid)
        elif source == 'dailymotion':
            title = get_dm_title(vid)
            
        norm = normalize_match_name(m['match'])
        is_duplicate = match_counts[norm] > 1
        
        if title:
            if not is_valid_match_video(title, m['match'], m.get('event', ''), is_duplicate):
                try:
                    print(f"[{i+1}/{total}] Cleared wrong video for: {m['match']}")
                except: pass
                m['videoId'] = None
                m['videoSource'] = None
                cleared += 1
            else:
                pass # valid
        else:
            print(f"[{i+1}/{total}] Failed to fetch title for {vid}")
            
    if cleared > 0:
        with open('src/data/matches.json', 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Cleared {cleared} bad videos.")
    else:
        print("All existing videos passed strict validation.")

if __name__ == '__main__':
    main()

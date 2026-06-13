import json
import urllib.request
import re
import time

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

def count_vs(text):
    return len(re.findall(r'\b(?:vs\.?|v\.?)\b', text, re.IGNORECASE))

def main():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    mismatches = []
    print("Starting validation...")
    
    for i, m in enumerate(matches):
        vid = m.get('videoId')
        if not vid: continue
        
        source = m.get('videoSource')
        title = ''
        if source == 'youtube':
            title = get_yt_title(vid)
        elif source == 'dailymotion':
            title = get_dm_title(vid)
            
        if not title: continue
        
        match_vs_count = count_vs(m['match'])
        title_vs_count = count_vs(title)
        
        # check if video title has more "vs" (e.g. triple threat vs singles)
        # or if video title implies multi-man tag team when match is singles
        
        if match_vs_count == 1 and title_vs_count > 1:
            mismatches.append({
                'match': m['match'],
                'video_title': title,
                'id': m['id']
            })
            print(f"Mismatch found: Match='{m['match']}' | Video='{title}'")
            
    with open('mismatches_report.json', 'w', encoding='utf-8') as f:
        json.dump(mismatches, f, indent=2)
        
    print(f"\nFound {len(mismatches)} potential mismatches. Saved to mismatches_report.json")

if __name__ == '__main__':
    main()

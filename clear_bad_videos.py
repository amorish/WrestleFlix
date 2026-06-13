import json
import urllib.request
import re

bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along', 'top 10', 'highlights', 'short']

def is_bad_title(title):
    return any(w in title.lower() for w in bad_keywords)

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

def main():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)

    cleared = 0
    for m in matches:
        vid = m.get('videoId')
        if not vid: continue
        source = m.get('videoSource')
        title = ''
        if source == 'youtube': title = get_yt_title(vid)
        elif source == 'dailymotion': title = get_dm_title(vid)
        
        if title and is_bad_title(title):
            print(f"Bad video found: {m['match']} -> {title}")
            m['videoId'] = ''
            m['videoSource'] = ''
            cleared += 1

    if cleared > 0:
        with open('src/data/matches.json', 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f'Cleared {cleared} bad videos.')
    else:
        print('No bad videos found.')

if __name__ == '__main__':
    main()

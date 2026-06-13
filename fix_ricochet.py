import json
import urllib.request
import urllib.parse
import re

def search_youtube(query):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # Simple extraction of videoId and length
        blocks = html.split('"videoRenderer":{')
        for block in blocks[1:]:
            vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
            if not vid_match: continue
            vid = vid_match.group(1)
            
            time_match = re.search(r'"lengthText":\{[^}]*"simpleText":"([\d:]+)"', block)
            if not time_match: continue
            
            time_str = time_match.group(1)
            parts = time_str.split(':')
            seconds = 0
            if len(parts) == 3: # H:M:S
                seconds = int(parts[0])*3600 + int(parts[1])*60 + int(parts[2])
            elif len(parts) == 2: # M:S
                seconds = int(parts[0])*60 + int(parts[1])
                
            if 900 <= seconds <= 5400: # between 15 mins and 90 mins
                return vid, seconds
    except Exception as e:
        print("Error fetching", query, e)
    return None, None

def search_dailymotion(query):
    try:
        url = f"https://www.dailymotion.com/search/{urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        video_ids = re.findall(r'href="/video/([a-zA-Z0-9]+)"', html)
        if video_ids:
            return video_ids[0], 1800 # assume it's good
    except Exception as e:
        print("DM Error:", e)
    return None, None

def fix_ricochet():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    for match in matches:
        if "EC3" in match['match'] and "Ricochet" in match['match']:
            print(f"Found match: {match['match']}")
            print(f"Current videoId: {match.get('videoId')}")
            
            query = f"{match['match']} full match"
            print(f"Searching YouTube for: {query}")
            vid, sec = search_youtube(query)
            if vid:
                print(f"Found YouTube video: {vid} ({sec} seconds)")
                match['videoId'] = vid
            else:
                print("Searching Dailymotion...")
                vid, sec = search_dailymotion(query)
                if vid:
                    print(f"Found Dailymotion video: {vid}")
                    match['videoId'] = vid
                else:
                    print("No better video found.")
            break
            
    with open('src/data/matches.json', 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)

if __name__ == '__main__':
    fix_ricochet()

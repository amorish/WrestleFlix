import json
import urllib.request
import urllib.parse
import re
import time
import random

def fetch_youtube_id(query):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        })
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # YouTube uses "videoId":"XXXXXXXXXXX" in its initial data script
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
        if video_ids:
            # return the first one
            return video_ids[0]
    except Exception as e:
        print("Error fetching", query, e)
    return None

def update_matches():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)

    print(f"Updating {len(matches)} matches with YouTube thumbnails...")
    
    for i, match in enumerate(matches):
        if 'videoId' not in match:
            query = f"{match['match']} {match['promotion']} {match['date']} full match"
            vid = fetch_youtube_id(query)
            if vid:
                match['videoId'] = vid
                print(f"[{i+1}/{len(matches)}] Found ID {vid} for {match['match']}")
            else:
                print(f"[{i+1}/{len(matches)}] No ID found for {match['match']}")
            
            # small delay to avoid rate limit
            time.sleep(random.uniform(0.5, 1.0))
            
            # Save incrementally
            if i % 10 == 0:
                with open('src/data/matches.json', 'w', encoding='utf-8') as f:
                    json.dump(matches, f, indent=2)

    with open('src/data/matches.json', 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)
    print("Done updating matches.")

if __name__ == "__main__":
    update_matches()

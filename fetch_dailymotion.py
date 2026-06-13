import json
import urllib.request
import urllib.parse
import re
import time
import random

def fetch_dailymotion_id(query):
    try:
        url = f"https://www.dailymotion.com/search/{urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        
        # Dailymotion usually embeds initial state json or has href="/video/xxx"
        video_ids = re.findall(r'href="/video/([a-zA-Z0-9]+)"', html)
        if video_ids:
            return video_ids[0]
    except Exception as e:
        print("Error fetching", query, e)
    return None

def update_matches():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)

    print(f"Updating {len(matches)} matches with Dailymotion fallback...")
    
    updated_count = 0
    for i, match in enumerate(matches):
        if 'videoId' not in match:
            query = f"{match['match']} {match['promotion']} {match['date']} full match"
            vid = fetch_dailymotion_id(query)
            if vid:
                match['videoId'] = vid
                match['videoSource'] = 'dailymotion'
                updated_count += 1
                print(f"[{i+1}/{len(matches)}] Found Dailymotion ID {vid} for {match['match']}")
            else:
                print(f"[{i+1}/{len(matches)}] No Dailymotion ID found for {match['match']}")
            
            time.sleep(random.uniform(0.5, 1.0))
            
            if i % 10 == 0:
                with open('src/data/matches.json', 'w', encoding='utf-8') as f:
                    json.dump(matches, f, indent=2)

    with open('src/data/matches.json', 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)
    print(f"Done. Added Dailymotion IDs to {updated_count} matches.")

if __name__ == "__main__":
    update_matches()

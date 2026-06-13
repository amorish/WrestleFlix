import json
import urllib.request
import urllib.parse
import re
import time
import random

def fetch_youtube_id(query):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
        if video_ids:
            return video_ids[0]
    except Exception as e:
        print("YT Error:", e)
    return None

def fetch_dailymotion_id(query):
    try:
        url = f"https://www.dailymotion.com/search/{urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8', errors='ignore')
        video_ids = re.findall(r'href="/video/([a-zA-Z0-9]+)"', html)
        if video_ids:
            return video_ids[0]
    except Exception as e:
        print("DM Error:", e)
    return None

def update_matches():
    with open('src/data/matches.json', 'r', encoding='utf-8') as f:
        matches = json.load(f)

    print(f"Updating {len(matches)} matches with YT + DM fallback...")
    
    for i, match in enumerate(matches):
        if 'videoId' not in match:
            query = f"{match['match']} {match['promotion']} {match['date']} full match"
            
            # Try YouTube first
            vid = fetch_youtube_id(query)
            if vid:
                match['videoId'] = vid
                match['videoSource'] = 'youtube'
                print(f"[{i+1}/{len(matches)}] YT: {vid}")
            else:
                # Fallback to Dailymotion
                time.sleep(random.uniform(0.5, 1.0))
                vid_dm = fetch_dailymotion_id(query)
                if vid_dm:
                    match['videoId'] = vid_dm
                    match['videoSource'] = 'dailymotion'
                    print(f"[{i+1}/{len(matches)}] DM Fallback: {vid_dm}")
                else:
                    print(f"[{i+1}/{len(matches)}] No Video Found.")
            
            time.sleep(random.uniform(0.5, 1.0))
            
            if i % 10 == 0:
                with open('src/data/matches.json', 'w', encoding='utf-8') as f:
                    json.dump(matches, f, indent=2)

    with open('src/data/matches.json', 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)
    print("Done fetching videos.")

if __name__ == "__main__":
    update_matches()

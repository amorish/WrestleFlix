import json
import urllib.request
import urllib.parse
import re
import time
import random

bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along']

def is_bad_title(title):
    title_lower = title.lower()
    return any(word in title_lower for word in bad_keywords)

def search_youtube(query):
    try:
        url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req, timeout=10)
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
            
            return vid
    except Exception as e:
        print("Error fetching YT for", query, e)
    return None

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    updated = 0
    sources_without_thumbnails = ['vk', 'wwe', 'reddit', 'twitter', 'archive']
    
    print("Starting thumbnail search using YouTube...")
    for i, match in enumerate(matches):
        src = match.get('videoSource', '')
        if src in sources_without_thumbnails and not match.get('thumbnailId'):
            name = match.get('match', '')
            event = match.get('event', '')
            brand = match.get('promotion', '')
            date = match.get('date', '')
            
            name_no_brackets = re.sub(r'\[.*?\]|\(.*?\)', '', name).strip()
            
            query = f"{name_no_brackets} {event} {date}"
            query = re.sub(r'\s+', ' ', query).strip()
            
            print(f"[{i+1}/{len(matches)}] Searching YT for: {query}")
            vid = search_youtube(query)
            
            if vid:
                img_url = f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg"
                print(f" -> Found YT video {vid}, setting thumbnail: {img_url}")
                match['thumbnailId'] = img_url
                updated += 1
            else:
                print(" -> No image found on YT.")
                
            time.sleep(random.uniform(1.0, 2.0))
            
    if updated > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Done. Updated {updated} thumbnails.")

if __name__ == '__main__':
    main()

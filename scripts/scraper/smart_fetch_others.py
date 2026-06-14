import json
import urllib.request
import urllib.parse
import re
import time
import random
import sys

bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along', 'top 10', 'short']

def is_bad_title(title):
    title_lower = title.lower()
    return any(word in title_lower for word in bad_keywords)

def search_youtube(query, used_video_ids):
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
            
            if is_bad_title(title):
                continue
                
            if vid in used_video_ids:
                continue
            
            return vid
    except Exception as e:
        print("Error fetching YT for", query, e)
    return None

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    used_video_ids = set()
    for m in matches:
        v = m.get('videoId')
        if isinstance(v, str):
            used_video_ids.add(v)
        elif isinstance(v, list):
            for item in v:
                used_video_ids.add(item)

    updated_count = 0
    
    # This script targets entries that are NOT matches, 
    # e.g., Moments, Entrances, Comedy, etc.
    non_match_categories = ['Moments', 'Iconic Entrances & Themes', 'Comedy & Botches', 'Mic Masters', 'Behind the Curtain']
    
    print("Starting Smart Fetch for Other Videos...")
    
    for i, match in enumerate(matches):
        cat = match.get('category', '')
        if cat not in non_match_categories:
            continue
            
        if match.get('videoId'):
            # If the user wants to overwrite, we could remove this continue
            continue
            
        name = match.get('match', '')
        event = match.get('event', '')
        brand = match.get('promotion', '')
        date = match.get('date', '')
        
        # User defined unique ID parts:
        # name, channel, event, brand, date
        # channel and brand are both covered by promotion here
        
        name_no_brackets = re.sub(r'\[.*?\]|\(.*?\)', '', name).strip()
        year = date[-4:] if len(date) >= 4 else ''
        
        # Step 0: without brackets
        q0 = f"{name_no_brackets} {brand} {event} {brand} {date}"
        q0 = re.sub(r'\s+', ' ', q0).strip()
        
        # Step 1: without date, only year
        q1 = f"{name_no_brackets} {brand} {event} {brand} {year}"
        q1 = re.sub(r'\s+', ' ', q1).strip()
        
        # Step 2: without date and year
        q2 = f"{name_no_brackets} {brand} {event} {brand}"
        q2 = re.sub(r'\s+', ' ', q2).strip()
        
        queries = [q0, q1, q2]
        vid = None
        
        for step, q in enumerate(queries):
            print(f"[{i+1}/{len(matches)}] Step {step} Searching: {q}")
            vid = search_youtube(q, used_video_ids)
            if vid:
                break
                
        if vid:
            print(f" -> Success: Found YT video {vid}")
            match['videoId'] = vid
            match['videoSource'] = 'youtube'
            used_video_ids.add(vid)
            updated_count += 1
        else:
            print(" -> Failed to find any suitable video.")
            
        if updated_count > 0 and updated_count % 5 == 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(matches, f, indent=2)
                
        time.sleep(random.uniform(2.0, 4.0))

    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Smart Fetch Complete. Updated {updated_count} items.")
    else:
        print("Smart Fetch Complete. No updates needed.")

if __name__ == '__main__':
    main()

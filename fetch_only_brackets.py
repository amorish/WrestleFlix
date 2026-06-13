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

def extract_brackets_only(match_name):
    # Split by 'vs.' or 'vs'
    parts = re.split(r'\s+vs\.?\s+', match_name, flags=re.IGNORECASE)
    new_parts = []
    for part in parts:
        # Find all things in brackets
        brackets = re.findall(r'\((.*?)\)|\[(.*?)\]', part)
        if brackets:
            # Flatten the tuples returned by findall
            extracted = []
            for b in brackets:
                if b[0]: extracted.append(b[0].strip())
                if b[1]: extracted.append(b[1].strip())
            new_parts.append(" and ".join(extracted))
        else:
            # If no brackets on this side, keep the original side
            new_parts.append(part.strip())
            
    return " vs ".join(new_parts)

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
            
            if is_bad_title(title) or vid in used_video_ids:
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
    
    # Also manually insert the two known URLs from the user (we don't know the exact match, but we can prevent using these IDs twice)
    used_video_ids.add("pe_R6uDTcQE")
    used_video_ids.add("S1EPVYogT44")

    updated_count = 0
    missing_matches = [m for m in matches if not m.get('videoId')]
    print(f"Starting fetch for {len(missing_matches)} matches without videoId (Bracket extraction search)...")
    
    for i, match in enumerate(matches):
        if match.get('videoId'):
            continue
            
        match_name = match.get('match', '')
        # Only do this if there are actually brackets in the match name
        if '(' not in match_name and '[' not in match_name:
            continue
            
        clean_match_name = extract_brackets_only(match_name)
        # Clean up double spaces
        clean_match_name = re.sub(r'\s+', ' ', clean_match_name).strip()
        
        brand = match.get('promotion', '')
        date = match.get('date', '')
        event = match.get('event', '')
        
        query = f"{clean_match_name} {brand} {event} full match"
        query = re.sub(r'\s+', ' ', query).strip()
        
        print(f"[{updated_count+1}/{len(missing_matches)}] Searching: {query}")
        
        vid = search_youtube(query, used_video_ids)
        
        if vid:
            print(f" -> Success: Found YouTube video {vid}")
            match['videoId'] = vid
            match['videoSource'] = 'youtube'
            used_video_ids.add(vid)
            updated_count += 1
            
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

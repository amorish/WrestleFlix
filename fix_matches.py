import json
import yt_dlp
import time
import random
import sys

def get_best_match_video(match_title):
    query = f"ytsearch15:{match_title} full match"
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'noplaylist': True,
    }
    
    best_vid = None
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(query, download=False)
            if not info or 'entries' not in info:
                return None
            
            # Prioritize videos between 15 mins (900s) and 90 mins (5400s)
            # and from official WWE channels or having "full match" in title
            for entry in info['entries']:
                dur = entry.get('duration')
                if not dur:
                    continue
                
                title = entry.get('title', '').lower()
                channel = entry.get('uploader', '').lower()
                
                if 900 <= dur <= 5400:
                    # Very high priority
                    if 'wwe' in channel or 'full match' in title:
                        return entry['id']
                    
            # Fallback to any video between 15 mins and 90 mins
            for entry in info['entries']:
                dur = entry.get('duration')
                if dur and 900 <= dur <= 5400:
                    return entry['id']
            
            # Final fallback: just anything > 15 mins
            for entry in info['entries']:
                dur = entry.get('duration')
                if dur and dur >= 900:
                    return entry['id']
                    
    except Exception as e:
        pass
    
    return best_vid

def fix_matches():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    print(f"Checking {len(matches)} matches...")
    updated_count = 0
    
    ydl_opts_check = {'quiet': True, 'extract_flat': True, 'noplaylist': True}
    
    with yt_dlp.YoutubeDL(ydl_opts_check) as ydl:
        for i, match in enumerate(matches):
            current_vid = match.get('videoId')
            needs_update = False
            
            # We don't want to check every single video via yt-dlp info extraction as it's slow.
            # Instead, we will aggressively update all using ytsearch, 
            # or we can check duration first. Let's check duration first.
            
            if not current_vid:
                needs_update = True
            else:
                try:
                    info = ydl.extract_info(f"https://www.youtube.com/watch?v={current_vid}", download=False)
                    dur = info.get('duration', 0)
                    if dur < 900 or dur > 7200:  # less than 15 mins or greater than 2 hours (likely full show)
                        needs_update = True
                except Exception:
                    # Video might be unavailable or from another source
                    needs_update = True
            
            if needs_update:
                print(f"[{i+1}/{len(matches)}] Fixing match: {match['match']}")
                new_vid = get_best_match_video(match['match'])
                if new_vid:
                    match['videoId'] = new_vid
                    updated_count += 1
                    print(f" -> Found better video: {new_vid}")
                else:
                    print(" -> No good video found.")
                
                # Save periodically
                if updated_count > 0 and updated_count % 5 == 0:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(matches, f, indent=2)
            
            sys.stdout.flush()

    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Updated {updated_count} matches.")
    else:
        print("No matches needed updating or no better videos found.")

if __name__ == '__main__':
    fix_matches()

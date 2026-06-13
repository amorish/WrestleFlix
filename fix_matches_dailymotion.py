import json
import urllib.request
import urllib.parse
import sys
import time

def search_dailymotion_api(match_title):
    query = f"{match_title}"
    url = f"https://api.dailymotion.com/videos?search={urllib.parse.quote(query)}&fields=id,title,duration&limit=20"
    
    bad_keywords = ['reaction', 'review', 'podcast', 'interview', 'wrestletalk', 'news', 'predictions', 'watchalong', 'watch-along']
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        for v in data.get('list', []):
            dur = v.get('duration', 0)
            title = v.get('title', '').lower()
            
            # Check for bad keywords
            is_bad = any(word in title for word in bad_keywords)
            
            if not is_bad and 900 <= dur <= 5400: # between 15 and 90 mins
                return v['id']
                
    except Exception as e:
        print(f"Error fetching DM API for {match_title}: {e}")
    return None

def fix_all_matches():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    print(f"Re-checking {len(matches)} matches via Dailymotion API with strict title filtering...")
    updated_count = 0
    
    for i, match in enumerate(matches):
        print(f"[{i+1}/{len(matches)}] Checking: {match['match']}")
        dm_id = search_dailymotion_api(match['match'])
        
        if dm_id:
            if match.get('videoId') != dm_id:
                print(f" -> Found BETTER Dailymotion video (filtered): {dm_id}")
                match['videoId'] = dm_id
                match['videoSource'] = 'dailymotion'
                updated_count += 1
        else:
            print(" -> No pure match found on Dailymotion.")
            
        if updated_count > 0 and updated_count % 10 == 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(matches, f, indent=2)
                
        time.sleep(0.5)
        sys.stdout.flush()

    if updated_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Updated {updated_count} matches with STRICT Dailymotion videos.")
    else:
        print("No matches updated.")

if __name__ == '__main__':
    fix_all_matches()

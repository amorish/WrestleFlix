import json
import urllib.request
import urllib.parse
import re
import time
import random

def search_dailymotion_via_ddg(match_name):
    query = f"site:dailymotion.com/video {match_name}"
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # Look for dailymotion video links
        links = re.findall(r'href="([^"]*dailymotion\.com/video/[a-zA-Z0-9]+)[^"]*"', html)
        if links:
            # Clean up the link (DDG might wrap it)
            clean_link = links[0]
            if "uddg=" in clean_link:
                clean_link = urllib.parse.unquote(clean_link.split('uddg=')[1].split('&')[0])
                
            # Extract video ID
            vid_match = re.search(r'video/([a-zA-Z0-9]+)', clean_link)
            if vid_match:
                return vid_match.group(1)
    except Exception as e:
        print(f"Error fetching DDG for {match_name}: {e}")
    return None

def fix_matches_with_ddg():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)

    # Let's fix the specific match the user mentioned first to test
    target = "Andrade \"Cien\" Almas vs. Johnny Gargano"
    for match in matches:
        if "Cien" in match['match'] and "Gargano" in match['match']:
            print(f"Testing DDG search for: {match['match']}")
            vid = search_dailymotion_via_ddg(match['match'])
            if vid:
                print(f"Found Dailymotion ID via search engine: {vid}")
                match['videoId'] = vid
                match['videoSource'] = 'dailymotion'
            else:
                print("Could not find video.")
            break
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)

if __name__ == '__main__':
    fix_matches_with_ddg()

import json
import re
import time
import random
from duckduckgo_search import DDGS

def search_ddg_image(query):
    try:
        with DDGS() as ddgs:
            results = ddgs.images(
                keywords=query,
                region='wt-wt',
                safesearch='moderate',
                size='Large',
                max_results=3,
            )
            for r in results:
                url = r.get('image')
                if url and ('.jpg' in url.lower() or '.png' in url.lower() or '.jpeg' in url.lower()):
                    return url
    except Exception as e:
        print("Error fetching DDG image for", query, e)
    return None

def main():
    file_path = 'src/data/matches.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        matches = json.load(f)
        
    updated = 0
    sources_without_thumbnails = ['vk', 'wwe', 'reddit', 'twitter', 'archive']
    
    print("Starting thumbnail image search using DuckDuckGo...")
    for i, match in enumerate(matches):
        if not match.get('videoId'):
            continue
            
        src = match.get('videoSource', '')
        if match.get('thumbnailId'):
            continue
            
        if src in sources_without_thumbnails:
            name = match.get('match', '')
            event = match.get('event', '')
            brand = match.get('promotion', '')
            date = match.get('date', '')
            
            name_no_brackets = re.sub(r'\[.*?\]|\(.*?\)', '', name).strip()
            year = date[-4:] if len(date) >= 4 else ''
            
            # Step 0: without brackets
            q0 = f"{name_no_brackets} {brand} {event} {brand} {date} wrestling"
            q0 = re.sub(r'\s+', ' ', q0).strip()
            
            # Step 1: without date, only year
            q1 = f"{name_no_brackets} {brand} {event} {brand} {year} wrestling"
            q1 = re.sub(r'\s+', ' ', q1).strip()
            
            # Step 2: without date and year
            q2 = f"{name_no_brackets} {brand} {event} {brand} wrestling"
            q2 = re.sub(r'\s+', ' ', q2).strip()
            
            queries = [q0, q1, q2]
            img_url = None
            
            for step, q in enumerate(queries):
                print(f"[{i+1}/{len(matches)}] Step {step} Searching image for: {q}")
                img_url = search_ddg_image(q)
                if img_url:
                    break
                    
            if img_url:
                print(f" -> Found image: {img_url}")
                match['thumbnailId'] = img_url
                updated += 1
            else:
                print(" -> No image found.")
                
            time.sleep(random.uniform(1.0, 2.0))
            
    if updated > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2)
        print(f"Done. Updated {updated} thumbnails.")
    else:
        print("Done. No thumbnails updated.")

if __name__ == '__main__':
    main()

import json
import urllib.request
from bs4 import BeautifulSoup
import re
import os

url = "https://en.wikipedia.org/wiki/List_of_professional_wrestling_matches_rated_5_or_more_stars_by_Dave_Meltzer"

def parse_html():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        content = response.read()

    soup = BeautifulSoup(content, 'html.parser')
    matches = []

    tables = soup.find_all('table', class_='wikitable')
    for table in tables:
        rows = table.find_all('tr')
        if not rows:
            continue
            
        header_row = rows[0]
        th_texts = [th.get_text(strip=True).lower() for th in header_row.find_all('th')]
        
        required_cols = ['date', 'match', 'promotion', 'event', 'rating']
        if not all(any(req in th for th in th_texts) for req in required_cols):
            continue

        col_map = {}
        for i, th in enumerate(th_texts):
            for req in required_cols:
                if req in th:
                    col_map[req] = i
                    break

        num_cols = len(th_texts)
        rowspans = {i: {"text": "", "span_left": 0} for i in range(num_cols)}

        for row in rows[1:]:
            cells = row.find_all(['td', 'th'])
            if not cells:
                continue

            row_data = {}
            cell_idx = 0
            
            for col_idx in range(num_cols):
                if rowspans[col_idx]["span_left"] > 0:
                    row_data[col_idx] = rowspans[col_idx]["text"]
                    rowspans[col_idx]["span_left"] -= 1
                else:
                    if cell_idx < len(cells):
                        cell = cells[cell_idx]
                        text = cell.get_text(separator=" ", strip=True)
                        text = re.sub(r'\[\d+\]', '', text).strip()
                        row_data[col_idx] = text
                        
                        span = int(cell.get('rowspan', 1))
                        if span > 1:
                            rowspans[col_idx] = {"text": text, "span_left": span - 1}
                            
                        cell_idx += 1
                    else:
                        row_data[col_idx] = ""

            try:
                date = row_data.get(col_map.get('date', -1), "")
                match_text = row_data.get(col_map.get('match', -1), "")
                promotion = row_data.get(col_map.get('promotion', -1), "")
                event = row_data.get(col_map.get('event', -1), "")
                rating = row_data.get(col_map.get('rating', -1), "")

                if match_text and rating and match_text.lower() != 'match':
                    matches.append({
                        "id": str(len(matches) + 1),
                        "date": date,
                        "match": match_text,
                        "promotion": promotion,
                        "event": event,
                        "rating": rating
                    })
            except Exception as e:
                print(e)
                pass

    return matches

if __name__ == "__main__":
    matches = parse_html()
    os.makedirs('src/data', exist_ok=True)
    
    old_matches = {}
    try:
        with open('src/data/matches.json', 'r', encoding='utf-8') as f:
            for m in json.load(f):
                if 'videoId' in m:
                    old_matches[m['match']] = m['videoId']
    except Exception as e:
        print("Could not read old matches:", e)

    for m in matches:
        if m['match'] in old_matches:
            m['videoId'] = old_matches[m['match']]

    with open('src/data/matches.json', 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=2)
    print(f"Parsed {len(matches)} matches.")

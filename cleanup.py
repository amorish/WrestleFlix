import json

with open('src/data/matches.json', 'r', encoding='utf-8') as f:
    matches = json.load(f)

new_matches = []
for m in matches:
    if m['match'] == 'Being The Elite (The Origins)':
        continue
    if m['match'] == 'Breaking Ground':
        continue
        
    if m['match'] == "Vice's Dark Side of the Ring":
        m['thumbnailId'] = 'https://i.ytimg.com/vi/VxvcZHQQiwg/hqdefault.jpg'
        
    new_matches.append(m)

with open('src/data/matches.json', 'w', encoding='utf-8') as f:
    json.dump(new_matches, f, indent=2, ensure_ascii=False)

print(f"Update complete! Total matches: {len(new_matches)}")

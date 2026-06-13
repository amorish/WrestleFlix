import json

file_path = 'src/data/matches.json'
with open(file_path, 'r', encoding='utf-8') as f:
    matches = json.load(f)

for m in matches:
    if 'El Grande Americano vs. "The Original" El Grande Americano' in m['match']:
        m['videoId'] = 'pfbQdjYBcEc'
        m['videoSource'] = 'youtube'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2)
print("Updated El Grande Americano match.")

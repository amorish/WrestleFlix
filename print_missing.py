import json

with open('src/data/matches.json', 'r', encoding='utf-8') as f:
    matches = json.load(f)

missing = [m for m in matches if not m.get('videoId')]

with open('missing_list.txt', 'w', encoding='utf-8') as out:
    for m in missing:
        out.write(f"- {m['match']} ({m['event']}, {m['date']})\n")

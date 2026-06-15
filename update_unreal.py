import json

with open('src/data/matches.json', 'r', encoding='utf-8') as f:
    matches = json.load(f)

new_matches = []
for m in matches:
    if m['match'] == 'WWE: Unreal (Season 1 & 2)':
        m['videoId'] = [
            "x9nsgiy",
            "x9nsgiw",
            "x9nt128",
            "x9nt2he",
            "x9nt2hc",
            "xabc0x6",
            "xabc12e",
            "xabc182",
            "xabc1iy",
            "xabc1q8"
        ]
        m['thumbnailId'] = 'https://www.dailymotion.com/thumbnail/video/x9nsgiy'
        
    new_matches.append(m)

with open('src/data/matches.json', 'w', encoding='utf-8') as f:
    json.dump(new_matches, f, indent=2, ensure_ascii=False)

print("Updated WWE: Unreal")

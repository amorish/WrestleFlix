import json

file_path = 'src/data/matches.json'
with open(file_path, 'r', encoding='utf-8') as f:
    matches = json.load(f)

for m in matches:
    if 'Adam Cole vs. EC3 vs. Killian Dain' in m['match']:
        m['videoId'] = '4HMtd3TpwHU'
        m['videoSource'] = 'youtube'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2)
print("Updated Ladder Match.")

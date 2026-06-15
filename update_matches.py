import json
import uuid

with open('src/data/matches.json', 'r', encoding='utf-8') as f:
    matches = json.load(f)

# 1. Update URLs
updates = {
    "Vice's Dark Side of the Ring": {"videoId": "PLZ_hwG6UuEJZReR_jv12o73OY_gDu2mHV", "videoSource": "youtube"},
    "Eddie Kingston Address Your Enemies": {"videoId": "DXc6RcPPozc", "videoSource": "youtube"},
    "Kurt Angle vs. Shawn Michaels": {"videoId": "zSC0we1MxkY", "videoSource": "youtube"},
    "AJ Styles vs. Minoru Suzuki": {"videoId": "x9kpboc", "videoSource": "dailymotion"},
    "The Rock vs. Hollywood Hulk Hogan": {"videoId": "eJ9zibElS5w", "videoSource": "youtube"},
    "Sting vs. Triple H": {"videoId": "P4X7FKJBRIA", "videoSource": "youtube"},
    "John Cena vs. AJ Styles": {"videoId": "MLylfh3atzA", "videoSource": "youtube"},
    "Undertaker vs. Shawn Michaels": {"videoId": "Gd54flkPtL4", "videoSource": "youtube"},
    "Brock Lesnar vs. Daniel Bryan": {"videoId": "UZ1lEn4gzAU", "videoSource": "youtube"},
    "Samoa Joe vs. Kenta Kobashi": {"videoId": "cvzX218xqkk", "videoSource": "youtube"},
    "Shinsuke Nakamura vs. Sami Zayn": {"videoId": "QY55WTGN0pU", "videoSource": "youtube"},
    "Kofi Kingston vs. Daniel Bryan": {"videoId": "KoVp3t5Hp18", "videoSource": "youtube"},
    "Rey Mysterio vs. Eddie Guerrero": {"videoId": "DId80JKzBY4", "videoSource": "youtube"},
    "Samoa Joe vs. CM Punk II": {"videoId": "tgUpNMmADxc", "videoSource": "youtube"},
    "Tyler Bate vs. Pete Dunne": {"videoId": "x6c1e25", "videoSource": "dailymotion"},
    "Katsuyori Shibata vs. Tomohiro Ishii": {"videoId": "x4818vd", "videoSource": "dailymotion"},
    "Cedric Alexander vs. Kota Ibushi": {"videoId": "muT1F2X1S2Y", "videoSource": "youtube"},
    "Mike Awesome vs. Masato Tanaka": {"videoId": "x4iedsz", "videoSource": "dailymotion"},
    "WeeLC: El Torito vs. Hornswoggle": {"videoId": "3di3UU6ICtc", "videoSource": "youtube"}
}

# 3. Deletions
deletions = [
    "Being The Elite (The Origins) Vlog",
    "Breaking Ground Reality",
    "Sammy Guevara's Vlog Highlights",
    "The Fall and Rise of Katsuyori Shibata",
    "The Brilliance of Toru Yano",
    "Roman Reigns: The Making of the Tribal Chief",
    "NJPW's In-Ring Psychology Explained"
]

new_matches = []
for m in matches:
    # Handle updates (match titles might be exact or just the start)
    for key, data in updates.items():
        if m['match'].startswith(key):
            m['videoId'] = data['videoId']
            m['videoSource'] = data['videoSource']
            break
    
    # Handle deletions
    to_delete = False
    for d in deletions:
        if m['match'].startswith(d):
            to_delete = True
            break
            
    if not to_delete:
        new_matches.append(m)

# 2. Additions
# Blood & Guts
new_matches.append({
    "id": "m_" + str(uuid.uuid4())[:8],
    "match": "The Elite vs. Blackpool Combat Club",
    "date": "2023-07-19",
    "promotion": "AEW",
    "event": "Dynamite: Blood & Guts",
    "category": "Epic Multi-Man Battles",
    "rating": "0",
    "videoId": "VWoDFZYu8zs",
    "videoSource": "youtube",
    "timestamp": "1:19:13",
    "endTimestamp": "2:21:43"
})

# WWE Unreal
new_matches.append({
    "id": "m_" + str(uuid.uuid4())[:8],
    "match": "WWE: Unreal (Season 1 & 2)",
    "date": "2024-01-01",
    "promotion": "WWE",
    "event": "Documentary",
    "category": "Behind the Curtain",
    "rating": "0",
    "videoId": ["x9ilziy", "x9x552q"],
    "videoSource": "dailymotion",
    "description": "Behind the scenes documentary covering the modern era of WWE."
})

# 4. Add new Psychological / Philosophical essays
new_matches.extend([
    {
        "id": "m_" + str(uuid.uuid4())[:8],
        "match": "The Genius of Kenta Kobashi",
        "date": "2020-01-01",
        "promotion": "Various",
        "event": "Joseph Montecillo",
        "category": "Psychological / Philosophical",
        "rating": "0",
        "videoId": "ORnIzE4zEEo",
        "videoSource": "youtube"
    },
    {
        "id": "m_" + str(uuid.uuid4())[:8],
        "match": "All Japan Pro Wrestling: A Tragic Fall",
        "date": "2020-01-01",
        "promotion": "Various",
        "event": "Kim Justice",
        "category": "Psychological / Philosophical",
        "rating": "0",
        "videoId": "i8UGf3vHWfY",
        "videoSource": "youtube"
    },
    {
        "id": "m_" + str(uuid.uuid4())[:8],
        "match": "The Elite Story",
        "date": "2020-01-01",
        "promotion": "Various",
        "event": "Tranquilo Club",
        "category": "Psychological / Philosophical",
        "rating": "0",
        "videoId": "Qh5xw6DnGUA",
        "videoSource": "youtube"
    },
    {
        "id": "m_" + str(uuid.uuid4())[:8],
        "match": "The Fall of WCW",
        "date": "2020-01-01",
        "promotion": "Various",
        "event": "Wrestling Bios",
        "category": "Psychological / Philosophical",
        "rating": "0",
        "videoId": "y6I4eU22hOM",
        "videoSource": "youtube"
    }
])

with open('src/data/matches.json', 'w', encoding='utf-8') as f:
    json.dump(new_matches, f, indent=2, ensure_ascii=False)

print(f"Update complete! Total matches: {len(new_matches)}")

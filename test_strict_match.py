import re

def extract_participants(match_string):
    s = match_string.replace(' vs. ', ',').replace(' and ', ',').replace(' & ', ',')
    s = s.replace('(', ',').replace(')', ',')
    parts = [p.strip() for p in s.split(',')]
    return [p for p in parts if p]

def is_valid_match_video(title, match_string, event_name, is_duplicate):
    participants = extract_participants(match_string)
    
    for p in participants:
        # Get the longest word in the participant's name to match
        # Ignore non-alphanumeric
        words = re.findall(r'[a-zA-Z0-9]+', p)
        if not words: continue
        
        # Filter out generic words
        ignored = {'the', 'jr', 'vs', 'and'}
        valid_words = [w for w in words if w.lower() not in ignored]
        if not valid_words:
            valid_words = words
            
        keyword = max(valid_words, key=len)
        
        # Word by word match
        if not re.search(r'\b' + re.escape(keyword) + r'\b', title, re.IGNORECASE):
            return False
            
    if is_duplicate:
        # Match event name word by word
        words = re.findall(r'[a-zA-Z0-9]+', event_name)
        valid_words = [w for w in words if w.lower() not in ignored]
        if valid_words:
            keyword = max(valid_words, key=len)
            if not re.search(r'\b' + re.escape(keyword) + r'\b', title, re.IGNORECASE):
                return False
                
    return True

matches = [
    ("Gunther vs. Drew McIntyre vs. Sheamus", "Gunther vs Sheamus", False, False),
    ("Gunther vs. Drew McIntyre vs. Sheamus", "FULL MATCH: Gunther vs. McIntyre vs. Sheamus", False, True),
    ("Adam Cole vs. EC3 vs. Killian Dain vs. Lars Sullivan vs. Ricochet vs. Velveteen Dream", "FULL MATCH - NXT North American Championship Ladder Match: NXT TakeOver: New Orleans", False, False) # Wait, this title doesn't have the names! It will be rejected.
]

for m, t, is_dup, expected in matches:
    res = is_valid_match_video(t, m, "", is_dup)
    print(f"Match: {m} | Title: {t} | Result: {res} | Expected: {expected}")

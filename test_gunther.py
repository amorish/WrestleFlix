import urllib.request, urllib.parse, re
import json

query = 'Gunther vs. Drew McIntyre vs. Sheamus full match'
url = f'https://www.youtube.com/results?search_query={urllib.parse.quote(query)}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

blocks = html.split('"videoRenderer":{')
for block in blocks[1:3]:
    vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
    length = re.search(r'"lengthText":\{.*?"simpleText":"([\d:]+)"', block)
    title_match = re.search(r'"title":\{"runs":\[\{"text":"([^"]+)"', block)
    
    if vid_match:
        print('Video:', vid_match.group(1))
        print('Length:', length.group(1) if length else 'No Length')
        print('Title:', title_match.group(1) if title_match else 'No Title')


import urllib.request, urllib.parse, re

query = 'Adam Cole vs. EC3 vs. Killian Dain vs. Lars Sullivan vs. Ricochet vs. Velveteen Dream full match'
url = f'https://www.youtube.com/results?search_query={urllib.parse.quote(query)}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

blocks = html.split('"videoRenderer":{')
for block in blocks[1:2]:
    vid_match = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', block)
    length = block.find('"lengthText":{')
    if length != -1:
        print("Length substring:", block[length:length+200])

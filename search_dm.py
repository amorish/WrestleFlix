import urllib.request
import json
import urllib.parse

def search_dm(query):
    url = 'https://api.dailymotion.com/videos?fields=id,title&search=' + urllib.parse.quote(query) + '&limit=100'
    html = urllib.request.urlopen(url).read().decode()
    data = json.loads(html)
    for v in data['list']:
        print(f"{v['id']} - {v['title']}")

print("---S01---")
search_dm("wwe unreal s01")
print("---S02---")
search_dm("wwe unreal s02")

import os
import urllib.request
import time

domains = {
    'wwe': 'wwe.com',
    'aew': 'allelitewrestling.com',
    'njpw': 'njpw1972.com',
    'tna': 'tnawrestling.com',
    'roh': 'rohwrestling.com',
    'cmll': 'cmll.com',
    'aaa': 'luchalibreaaa.com',
    'stardom': 'wwr-stardom.com',
    'noah': 'noah.co.jp',
    'ajpw': 'all-japan.co.jp',
    'revpro': 'revolutionprowrestling.com'
}

os.makedirs('d:/WrestleFlix/public/logos', exist_ok=True)

for name, domain in domains.items():
    url = f"https://logo.clearbit.com/{domain}"
    filename = f"d:/WrestleFlix/public/logos/{name}.png"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
    time.sleep(0.5)

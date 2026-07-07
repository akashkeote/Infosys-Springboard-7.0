import requests
from bs4 import BeautifulSoup
import re

resp = requests.get('https://www.myscheme.gov.in/search', headers={'User-Agent': 'Mozilla/5.0'})
print('Status:', resp.status_code)

if resp.status_code == 200:
    soup = BeautifulSoup(resp.text, 'html.parser')
    scripts = soup.find_all('script')
    found_api = False
    
    for s in scripts:
        if s.string and '/api/' in s.string:
            found_api = True
            matches = re.findall(r'"(/[^"]+api[^"]+)"', s.string)
            if matches:
                print('Found API in script:', matches)
                
    if not found_api:
        print('No /api/ strings found in inline scripts.')
        
    # check for next data
    next_data = soup.find("script", id="__NEXT_DATA__")
    if next_data:
        print("Found NEXT_DATA length:", len(next_data.string))

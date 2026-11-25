from pathlib import Path
import json, re
from html.parser import HTMLParser
root=Path(__file__).resolve().parent.parent
items=json.loads((root/'catalog.json').read_text(encoding='utf-8'))
assert items, 'Empty catalog'
urls=[x['url'] for x in items]; assert len(set(urls))==len(urls), 'Duplicate URLs'
class Links(HTMLParser):
 def __init__(self): super().__init__(); self.hrefs=set()
 def handle_starttag(self,tag,attrs):
  if tag=='a': self.hrefs.update(v for k,v in attrs if k=='href' and v)
p=Links(); p.feed((root/'cursos.html').read_text(encoding='utf-8'))
for x in items:
 f=(root/x['url']).resolve(); assert f.is_relative_to(root) and f.is_file() and f.suffix=='.html', x['url']; assert x['url'] in p.hrefs, x['url']; assert x['title'].strip(), x['url']
assert 'cursos.html' in (root/'index.html').read_text(encoding='utf-8')
print(f'PASS: {len(items)} catalog entries, linked and present')

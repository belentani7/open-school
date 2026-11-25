from pathlib import Path
import json
from html.parser import HTMLParser
root=Path(__file__).resolve().parent.parent
catalog=json.loads((root/'catalog.json').read_text(encoding='utf-8'))
mods=[x for x in catalog if x['url'].startswith('universal-modulos/java-21/')]
assert len(mods)==14
class Page(HTMLParser):
 def __init__(self): super().__init__();self.ids=set();self.links=[];self.questions=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a: self.ids.add(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag=='fieldset' and 'data-correct' in a:self.questions+=1
for m in mods:
 f=root/m['url'];p=Page();p.feed(f.read_text(encoding='utf-8'));assert {'teoria','ejemplo','laboratorio','evaluacion'}<=p.ids,m['url'];assert p.questions==2,m['url']
 for link in p.links:
  if link.startswith('#'):assert link[1:] in p.ids,link
  elif ':' not in link:assert (f.parent/link.split('#')[0]).resolve().is_file(),link
print('PASS: 14 modules, 28 quiz questions, module navigation')

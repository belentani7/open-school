import re
import os

def extract_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    links = re.findall(r'(?:href|src)=["\']([^"\'>]+)["\']', content)
    return links

def check_links(filepath):
    base_dir = os.path.dirname(filepath)
    links = extract_links(filepath)
    broken = []
    for link in links:
        if link.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:', '#')):
            continue
        if link.startswith('./'):
            link = link[2:]
        target = os.path.normpath(os.path.join(base_dir, link))
        if not os.path.exists(target):
            broken.append((link, target))
    return broken

broken = check_links('C:/Users/USER/workspace/ecosistema/belentani-ecosystem/educacion/open-school/index.html')
if broken:
    print('BROKEN LINKS:')
    for link, target in broken:
        print(f'  {link} -> {target} (NOT FOUND)')
else:
    print('OK: All internal links in index.html exist on disk')

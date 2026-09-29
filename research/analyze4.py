import re

src = open('sim-beauty-cjk.js', encoding='utf-8').read()
lines = src.split('\n')

# find lines containing slot patterns like "LV1-1-1插槽"
hits = [(i, l.strip()[:120]) for i, l in enumerate(lines) if '插槽' in l and 'LV' in l]
print(f'{len(hits)} lines with LV slot patterns; first 5:')
for i, l in hits[:5]:
    print(f'  line {i+1}: {l}')

# find big data arrays - count lines with '["' pattern to locate armor tables
# Armor entries likely have defense numbers and slot strings
m = re.search(r'var ([A-Za-z]+) = \[', src)
# locate '雷颚龙' or '铠武' etc. Let's find "头" part usage in data: Ec = "头 身 腕 腰 脚 护石"
i = src.find('头 身 腕 腰 脚 护石')
print('\nEc parts at char', i)

# Search for the armor constructor/class usage around big arrays: find 'new Xd(' style mapping similar to Td
for name in re.findall(r'function ([A-Za-z]{2})\(a\) \{\s*return a\.map', src):
    print('mapper fn:', name)

# find all functions that map arrays into objects
for m in re.finditer(r'function ([A-Za-z]{2})\(a\) \{\s*return a\.map\(', src):
    i = m.start()
    snippet = src[i:i+260].replace('\n', ' ')
    print(f'\n--- {m.group(1)} at {i}: {snippet[:240]}')

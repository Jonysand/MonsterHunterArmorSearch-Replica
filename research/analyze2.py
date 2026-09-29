import re

src = open('sim-beauty-cjk.js', encoding='utf-8').read()
lines = src.split('\n')

# Find all top-level-ish assignments of large data tables (function Td used for data)
# First: locate Td definition
m = re.search(r'function Td\(', src)
if m:
    i = m.start()
    print('=== Td def at char', i)
    print(src[i:i + 800])

# Find calls to Td( and their approximate line numbers
for i, line in enumerate(lines):
    if re.search(r'\bTd\(', line) and 'function Td' not in line:
        print(f'line {i+1}: {line.strip()[:100]}')

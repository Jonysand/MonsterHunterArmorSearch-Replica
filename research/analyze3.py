import re

src = open('sim-beauty-cjk.js', encoding='utf-8').read()

# Find class Md
m = re.search(r'class Md\s*{|function Md\(', src)
if m:
    i = m.start()
    print('=== Md at char', i)
    print(src[i:i + 1500])

print()
# Find Ud object full extent - what other fields does Ud have?
i = src.find('var Ud = {')
if i < 0:
    i = src.find('Ud = {')
print('=== Ud object:')
print(src[i:i + 400])

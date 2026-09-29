import re

src = open('sim-beauty.js', encoding='utf-8', errors='replace').read()
s2 = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), src)
s2 = s2.encode('utf-8', errors='surrogatepass').decode('utf-8', errors='replace')
open('sim-beauty-cjk.js', 'w', encoding='utf-8').write(s2)
print('lines:', s2.count('\n'))
for kw in ['攻击', '攻击', '体术', '护石', '装饰品', '装饰', ' レウス', '火龙', '雄火']:
    print(kw, s2.count(kw))
# find where data tables are
for kw in ['攻击', '护石', '装饰品']:
    i = s2.find(kw)
    if i >= 0:
        print(f'--- first {kw} at char {i}:')
        print(s2[max(0, i - 300):i + 200])

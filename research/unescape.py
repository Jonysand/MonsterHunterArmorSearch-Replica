import re

src = open('assets/sim-compiled-ja.es6.js', encoding='utf-8', errors='replace').read()
s2 = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), src)
s2 = s2.encode('utf-8', errors='surrogatepass').decode('utf-8', errors='replace')
open('assets/sim-unescaped.js', 'w', encoding='utf-8').write(s2)
for kw in ['攻撃', '体術', '見切り', 'ガード', '回避', '装填', 'レウス', 'ズク']:
    print(kw, s2.count(kw))

"""Clean raw extracted data into the JSON files the replica app will ship."""
import json
import re

raw = json.load(open('extracted_raw.json', encoding='utf-8'))

# ---------- armors ----------
# raw: [name, rarity, type, part, A, C, D, upgradeGroup, I, slotCount, slots, skills, defense, resists]
armors = []
plus_count = 0
for a in raw['armors']:
    name, rarity, typ, part, A, C, D, grp, I, cnt, slots, skills, defense, resists = a
    assert A == 0 and C == 0 and D == 0 and I == 0 and typ == 3, a
    if '+' in name:
        plus_count += 1
    armors.append({
        'name': name,
        'part': part,            # 0 head 1 body 2 arm 3 waist 4 legs 5 charm
        'rarity': rarity,
        'group': grp,            # 0 charm, 5/6 upgradeable (auto + variants pre-generated)
        'slots': slots,          # slot level list desc, 0-padded
        'skills': skills,
        'defense': defense,
        'resists': resists,      # [fire, water, thunder, ice, dragon]
    })
print('armors:', len(armors), '| "+" variants in data:', plus_count)
defs = sorted(set(a['defense'] for a in armors))
print('defense range:', defs[0], '-', defs[-1])
rars = sorted(set(a['rarity'] for a in armors))
print('rarities:', rars)

# ---------- decos ----------
# raw: [name, x, slotLv, y, z, skills]
def clean_decos(lst, kind):
    out = []
    for d in lst:
        name, x, slot, y, z, skills = d
        assert x == 1 and y == 0 and z == 0, d
        out.append({'name': name, 'slot': slot, 'skills': skills, 'kind': kind})
    return out

decos_armor = clean_decos(raw['decos_armor'], 'armor')
decos_weapon = clean_decos(raw['decos_weapon'], 'weapon')
print('decos_armor:', len(decos_armor), '| decos_weapon:', len(decos_weapon))
ws = set(raw['weapon_skills'])
armor_deco_skills = {s for d in decos_armor for s in d['skills']}
weapon_deco_skills = {s for d in decos_weapon for s in d['skills']}
print('Ea∩armor-deco-skills:', ws & armor_deco_skills)
print('Ea vs weapon-deco-skills equal:', ws == weapon_deco_skills, '| missing:', ws - weapon_deco_skills, '| extra:', weapon_deco_skills - ws)

# ---------- skill groups ----------
groups = []
for gname, entries in raw['skill_groups']:
    skills = []
    for ename, base, lvl, typ in entries:
        assert typ == 3, ename
        skills.append({'entry': ename, 'skill': base, 'level': lvl})
    groups.append({'group': gname, 'skills': skills})
print('groups:', [(g['group'], len(g['skills'])) for g in groups])

data = {
    'version': '20260917T022420',
    'parts': ['头', '身', '腕', '腰', '脚', '护石'],
    'armors': armors,
    'decos': decos_armor + decos_weapon,
    'skill_groups': groups,
    'weapon_skills': sorted(ws),
    'set_groups': raw['group_jb'],
    'group_skills': raw['group_ib'],
}
with open('mhwilds-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
import os
print('mhwilds-data.json size:', os.path.getsize('mhwilds-data.json') // 1024, 'KB')

# ---------- i18n ----------
src = open('sim-beauty-cjk.js', encoding='utf-8').read()
i = src.find('function Qe() {')
j = src.find('return {', i)
j = src.find('{', j)
depth = 0
k = j
while True:
    if src[k] == '{':
        depth += 1
    elif src[k] == '}':
        depth -= 1
        if depth == 0:
            break
    k += 1
lit = src[j:k + 1]
lit = re.sub(r',\s*([\]}])', r'\1', lit)
# quote bare JS keys (e.g. edit: "Edit")
lit = re.sub(r'([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)', r'\1"\2"\3', lit)
i18n = json.loads(lit)
print('i18n keys:', len(i18n))
with open('mhwilds-i18n.json', 'w', encoding='utf-8') as f:
    json.dump(i18n, f, ensure_ascii=False, indent=1)

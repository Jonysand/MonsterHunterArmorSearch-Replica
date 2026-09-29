"""Extract embedded game data tables from the beautified sim bundle into JSON.

Tables:
- armors      : kd/nd  -> raw 14-tuples [name, rarity, type, part, A, C, D, upgradeGroup, I, baseCost, slots, skills, defense, resists]
- decos_armor : Ud.Aa  -> raw 6-tuples [name, ?, slotLv, ?, ?, skills]   (防具装飾品, incl. generic slot placeholders)
- decos_weapon: Ud.ca  -> raw 6-tuples (武器装飾品, incl. compound)
- skill_weights: Ud.lb -> {skill: weight}
- skill_groups: Vd.kb   -> [[seriesName, [[entryName, baseSkill, level, type], ...]], ...]
- weapon_skills: Vd.Ea -> string list
"""
import json
import re

src = open('sim-beauty-cjk.js', encoding='utf-8').read()

OPEN = {'(': ')', '[': ']', '{': '}'}


def extract_balanced(start_idx, open_ch):
    """Return the substring from start_idx (which must be open_ch) to its matching close."""
    assert src[start_idx] == open_ch, f'expected {open_ch} at {start_idx}, got {src[start_idx]}'
    depth = 0
    i = start_idx
    in_str = None
    while i < len(src):
        c = src[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == in_str:
                in_str = None
        elif c in '"\'':
            in_str = c
        elif c in OPEN:
            depth += 1
        elif c in (')', ']', '}'):
            depth -= 1
            if depth == 0:
                return src[start_idx:i + 1]
        i += 1
    raise ValueError('unbalanced')


def find_after(marker, open_ch, occurrence=1):
    pos = -1
    for _ in range(occurrence):
        pos = src.find(marker, pos + 1)
        assert pos >= 0, f'marker not found: {marker!r}'
    pos = src.find(open_ch, pos)
    return extract_balanced(pos, open_ch)


def to_json(literal):
    literal = re.sub(r',\s*([\]}])', r'\1', literal)  # trailing commas
    return json.loads(literal)


# 1. Armors: the big literal fed to the Wc mapper (first `}([` occurrence, at the nd block)
armor_lit = find_after('}([', '[', occurrence=1)
armors = to_json(armor_lit)

# 2. Ud = { Aa: Td([...]), ca: Td([...]), lb: {...} }
aa_lit = find_after('Aa: Td(', '[')
ca_lit = find_after('ca: Td(', '[')
lb_lit = find_after('lb: {', '{', occurrence=2)
decos_armor = to_json(aa_lit)
decos_weapon = to_json(ca_lit)
skill_weights = to_json(lb_lit)

# 3. Vd.kb series (second `}([` occurrence)
kb_lit = find_after('}([', '[', occurrence=2)
skill_groups_raw = to_json(kb_lit)
# strip the mapper wrapper: literal is ( [ ... ] ) -> we captured inner [ ... ]
import re as _re
_ea = _re.search(r'Vd\.Ea = new Set\("(.+?)"[.]split', src, _re.S)
weapon_skills = _ea.group(1).split(' ')
import re as _re
_jb = _re.search(r'Vd\.jb = "([^"]+)"', src, _re.S)
_ib = _re.search(r'Vd\.ib = "([^"]+)"', src, _re.S)
group_jb = _jb.group(1).split(' ')
group_ib = _ib.group(1).split(' ')

out = {
    'armors': armors,
    'decos_armor': decos_armor,
    'decos_weapon': decos_weapon,
    'skill_weights': skill_weights,
    'skill_groups': skill_groups_raw,
    'weapon_skills': weapon_skills,
    'group_jb': group_jb,
    'group_ib': group_ib,
}
with open('extracted_raw.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print('armors:', len(armors))
print('decos_armor:', len(decos_armor), '| decos_weapon:', len(decos_weapon))
print('skill_weights:', len(skill_weights), '| skill_groups:', len(skill_groups_raw))
print('weapon_skills:', len(weapon_skills), '| jb:', len(out['group_jb']), '| ib:', len(out['group_ib']))

# sanity: field stats for armors
from collections import Counter
part_c = Counter(a[3] for a in armors)
print('part dist:', dict(part_c))
f4 = Counter(a[4] for a in armors)
f5 = Counter(a[5] for a in armors)
f6 = Counter(a[6] for a in armors)
f7 = Counter(a[7] for a in armors)
f8 = Counter(a[8] for a in armors)
print('f4:', dict(f4), 'f5:', dict(f5), 'f6:', dict(f6))
print('f7(upgradeGroup):', dict(f7), 'f8:', dict(f8))
slot_nz = [a for a in armors if sum(a[10]) > 0]
print('armors with slots:', len(slot_nz))
for a in slot_nz[:8]:
    print('  ', a[0], 'part', a[3], 'baseCost', a[9], 'slots', a[10], 'def', a[12], 'skills', a[11])
# charm entries (part 5) and weapon (part 6)?
print('charms in master:', [a[0] for a in armors if a[3] == 5][:10])

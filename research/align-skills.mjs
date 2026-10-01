// 从原站 EN / zh-hans 两个语言 bundle 中提取技能表，按条目顺序对齐生成 EN→zh-Hans 官方名称映射
// 用法: node align-skills.mjs
import fs from "node:fs";

function balancedEnd(src, openIdx) {
  let depth = 0;
  let inStr = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'") inStr = c;
    else if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("unbalanced");
}

function parseLit(lit) {
  try {
    return JSON.parse(lit);
  } catch {
    // eslint-disable-next-line no-new-func
    return new Function(`return (${lit})`)();
  }
}

/** 枚举 probe 全部出现位置，提取各外层数组，返回能通过 shape 校验的解析结果 */
function findTable(src, probe, shape) {
  const results = new Map();
  let from = 0;
  for (;;) {
    const p = src.indexOf(probe, from);
    if (p < 0) break;
    from = p + 1;
    // 逐个回溯外层 '['：跳过闭合位置在 probe 之前的兄弟括号
    let cand = src.lastIndexOf("[", p);
    while (cand >= 0) {
      const end = balancedEnd(src, cand);
      if (end > p && !results.has(cand)) {
        try {
          const v = parseLit(src.slice(cand, end + 1));
          if (shape(v)) results.set(cand, v);
        } catch {}
      }
      cand = src.lastIndexOf("[", cand - 1);
    }
  }
  return [...results.values()];
}

const isSkillGroups = (v) =>
  Array.isArray(v) && v.length >= 5 && v.every((g) => Array.isArray(g) && g.length === 2 && typeof g[0] === "string" && Array.isArray(g[1]) && g[1].every((e) => Array.isArray(e) && e.length === 4 && typeof e[0] === "string" && typeof e[1] === "string" && typeof e[2] === "number"));
const isNameList = (v) => Array.isArray(v) && v.length >= 30 && v.every((x) => typeof x === "string");

function unescapeAll(s) {
  return s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

const zh = unescapeAll(fs.readFileSync("assets/sim-compiled-zh-hans.es6.js", "utf8"));
const en = unescapeAll(fs.readFileSync("sim-en.es6.js", "utf8"));

const zhTables = findTable(zh, "弱点特效Lv1", isSkillGroups);
const enTables = findTable(en, "Weakness Exploit Lv1", isSkillGroups);
console.log("candidate skill tables: zh", zhTables.length, "| en", enTables.length);
if (!zhTables.length || !enTables.length) {
  for (const [tag, src, probe] of [["zh", zh, "弱点特效Lv1"], ["en", en, "Weakness Exploit Lv1"]]) {
    const p = src.indexOf(probe);
    console.log(tag, "probe idx:", p, "ctx:", JSON.stringify(src.slice(p - 50, p + 70)));
    let cand = src.lastIndexOf("[", p);
    for (let n = 0; cand >= 0 && n < 4; n++) {
      const end = balancedEnd(src, cand);
      if (end <= p) break;
      const lit = src.slice(cand, end + 1);
      let v = null;
      let err = "";
      try {
        v = parseLit(lit);
      } catch (e) {
        err = String(e).slice(0, 80);
      }
      const desc =
        v === null
          ? "PARSE FAIL " + err
          : Array.isArray(v)
            ? `array len=${v.length} g0keys=${JSON.stringify(Array.isArray(v[0]) ? [typeof v[0][0], Array.isArray(v[0][1]), v[0][1]?.length, Array.isArray(v[0][1]?.[0]) ? v[0][1][0]?.length : null] : typeof v[0])}`
            : typeof v;
      console.log(tag, "bracket@", cand, "litlen", lit.length, "->", desc);
      cand = src.lastIndexOf("[", cand - 1);
    }
  }
  process.exit(1);
}

const flatten = (t) => t.flatMap(([, list]) => list);
const zhFlat = flatten(zhTables.sort((a, b) => flatten(b).length - flatten(a).length)[0]);
const enFlat = flatten(enTables.sort((a, b) => flatten(b).length - flatten(a).length)[0]);
console.log("flattened entries: zh", zhFlat.length, "| en", enFlat.length);
if (zhFlat.length !== enFlat.length) throw new Error("entry count mismatch");
for (let i = 0; i < zhFlat.length; i++) {
  if (zhFlat[i][2] !== enFlat[i][2]) throw new Error(`level mismatch at ${i}: ${zhFlat[i][0]} vs ${enFlat[i][0]}`);
}

// 依序对齐基础技能名（保序去重）
const mapping = {};
{
  const seen = new Set();
  for (let i = 0; i < zhFlat.length; i++) {
    const z = zhFlat[i][1];
    if (seen.has(z)) continue;
    seen.add(z);
    mapping[enFlat[i][1]] = z;
  }
}

// 武器技能表对齐
const zhW = findTable(zh, "会心击【属性】", isNameList).sort((a, b) => b.length - a.length)[0];
const enW = ["Crit Element", "Critical Element", "Charge Master"]
  .flatMap((p) => findTable(en, p, isNameList))
  .sort((a, b) => b.length - a.length)[0];
console.log("weapon skills: zh", zhW?.length, "| en", enW?.length);
if (zhW && enW && zhW.length === enW.length) {
  zhW.forEach((z, i) => {
    if (mapping[enW[i]] && mapping[enW[i]] !== z) console.log("NOTE dup EN weapon name:", enW[i]);
    mapping[enW[i]] = z;
  });
} else {
  console.log("weapon tables not aligned — check manually");
}

console.log("mapping entries:", Object.keys(mapping).length);

// 覆盖率校验：导出文件中全部技能名必须能映射
const file = fs
  .readFileSync("D:/Steam/steamapps/common/MonsterHunterWilds/reframework/data/Talisman_Exporter/Exported_Talismans.txt", "utf8")
  .split(/\r?\n/)
  .filter(Boolean);
const used = new Set();
for (const l of file) {
  const f = l.split(",");
  for (const n of [f[0], f[2], f[4]]) if (n) used.add(n);
}
const missing = [...used].filter((n) => !(n in mapping));
console.log("export file uses", used.size, "skills; missing in mapping:", missing.length ? missing : "none");

fs.writeFileSync("skill-map-en-zh.json", JSON.stringify(mapping, null, 1), "utf8");
console.log("written skill-map-en-zh.json");

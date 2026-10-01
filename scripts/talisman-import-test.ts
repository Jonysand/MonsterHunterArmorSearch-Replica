/** 护石导入端到端验证：node_modules/.bin/jiti scripts/talisman-import-test.ts <Exported_Talismans.txt> */
import { readFileSync } from "node:fs";

// store 在模块加载期访问 localStorage，node 下先打桩
const mem = new Map<string, string>();
(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
};

import { parseTalismanText, charmFingerprint } from "../src/lib/talismanImport";
import { useSimulator } from "../src/store/simulator";
import { search } from "../src/lib/engine";
import type { SearchParams, SearchResult } from "../src/types";

let failed = 0;
function check(label: string, cond: boolean, detail = ""): void {
  console.log(`${cond ? "✓" : "✗"} ${label}${cond || !detail ? "" : ` — ${detail}`}`);
  if (!cond) failed++;
}

const file = process.argv[2] ?? "D:/Steam/steamapps/common/MonsterHunterWilds/reframework/data/Talisman_Exporter/Exported_Talismans.txt";
const text = readFileSync(file, "utf8");

// ---- T1: 真实导出文件全量解析 ----
const t0 = Date.now();
const r = parseTalismanText(text);
console.log(`\n=== T1 解析真实导出文件（${text.split(/\r?\n/).filter((l) => l.trim()).length} 行） ${Date.now() - t0}ms ===`);
check("零解析错误", r.errors.length === 0, JSON.stringify(r.errors.slice(0, 5)));
check("763 个护石全部解析", r.charms.length === 763, `got ${r.charms.length}`);
const first = r.charms[0];
check(
  "第 1 行内容正确（攻击守势1/火场怪力2/无伤1，防具槽2-1）",
  charmFingerprint(first) ===
    charmFingerprint({ name: "", skills: { 攻击守势: 1, 火场怪力: 2, 无伤: 1 }, slots: [2, 1, 0], weaponSlots: [0, 0, 0] }),
  JSON.stringify(first),
);
const withWeapon = r.charms.find((c) => (c.weaponSlots ?? []).some((s) => s > 0))!;
check(
  "武器插槽样本解析（Normal Shots 行 → 通常弹·通常箭强化+属性变换，武器槽1）",
  charmFingerprint(withWeapon) ===
    charmFingerprint({ name: "", skills: { "通常弹·通常箭强化": 1, 属性变换: 1 }, slots: [0, 0, 0], weaponSlots: [1, 0, 0] }),
  JSON.stringify(withWeapon),
);
const skillSet = new Set(r.charms.flatMap((c) => Object.keys(c.skills)));
check("全部技能名均为中文", [...skillSet].every((s) => !/[a-zA-Z]/.test(s)), [...skillSet].filter((s) => /[a-zA-Z]/.test(s)).join(","));

// ---- T2: 坏行容错 ----
const bad = parseTalismanText(
  "Attack Boost,1,XXX,2,,0,0,0,0,0,0,0\nshort,line\n\nGuard,1,,0,,0,1,1,0,0,0,0",
);
console.log("\n=== T2 坏行容错 ===");
check("未知技能/字段不足 2 处错误", bad.errors.length === 2, JSON.stringify(bad.errors));
check("有效行照常解析（Guard1）", bad.charms.length === 1 && bad.charms[0].skills["格挡性能"] === 1, JSON.stringify(bad.charms));

// ---- T3: store 批量导入 + 去重 ----
console.log("\n=== T3 批量导入与去重 ===");
const store = useSimulator.getState();
const firstRun = store.importCharms(r.charms, true);
check("首次导入 756 个、批内重复 7 个", firstRun.added === 756 && firstRun.duplicate === 7, JSON.stringify(firstRun));
const second = useSimulator.getState().importCharms(r.charms, true);
check("重复导入全部去重", second.added === 0 && second.duplicate === 763, JSON.stringify(second));
const noDedupe = useSimulator.getState().importCharms(r.charms.slice(0, 5), false);
check("关闭去重则照常追加", noDedupe.added === 5, JSON.stringify(noDedupe));
check("localStorage 持久化条数一致", JSON.parse(mem.get("mhwilds-zh-hans-charms-v1")!).length === 761);

// ---- T4: 护石武器槽并入武器珠解算 ----
console.log("\n=== T4 武器槽并入武器珠解算 ===");
const base: SearchParams = {
  armorSkills: { 弱点特效: 1 }, // 防具珠可直接满足，保证 DFS 快速出解
  weaponSkills: { "会心击【属性】": 1 }, // 武器专属技能，仅武器槽可放珠补齐，考察武器槽合并
  weaponSlots: [],
  pins: {},
  excludes: {},
  charms: [],
  minDefense: 0,
  resMins: [-100, -100, -100, -100, -100],
  limit: 5,
  decoInventory: {},
};
const run = (params: SearchParams): Promise<SearchResult[]> =>
  new Promise((res) => {
    let last: SearchResult[] = [];
    search(params, {
      onProgress: (_p, rs) => (last = rs),
      shouldCancel: () => false,
      onDone: () => res(last),
    });
  });

const withoutCharm = await run({ ...base });
check("无护石、武器无槽 → 无解（会心击【属性】无法满足）", withoutCharm.length === 0);
const withCharm = await run({
  ...base,
  charms: [
    {
      name: "测试武槽护石",
      part: 5,
      slots: [0, 0, 0],
      skills: {},
      defense: 0,
      resists: [0, 0, 0, 0, 0],
      cost: 0,
      slotKey: "0-0-0",
      weaponSlots: [1],
    },
  ],
});
check(
  "护石武器槽1 → 属会珠【1】补齐武器技能会心击【属性】1",
  withCharm.length > 0 && withCharm.every((x) => (x.weaponDecos["属会珠【1】"] ?? 0) === 1),
  JSON.stringify(withCharm[0]?.weaponDecos),
);

// ---- T5: 导入护石参与搜索（固定护石位） ----
console.log("\n=== T5 导入护石参与搜索 ===");
const charmName = useSimulator.getState().charms[0].name;
const t5 = await run({
  ...base,
  weaponSkills: {},
  armorSkills: { 攻击守势: 1 },
  pins: { 5: charmName },
  charms: useSimulator.getState().charms.map((c) => ({
    ...c,
    part: 5,
    defense: 0,
    resists: [0, 0, 0, 0, 0] as [number, number, number, number, number],
    cost: 0,
    slotKey: c.slots.join("-"),
    ...(c.weaponSlots?.some((s) => s > 0) ? { weaponSlots: c.weaponSlots } : {}),
  })),
});
check(`固定「${charmName}」可出解`, t5.length > 0);

console.log(failed ? `\n${failed} 项失败` : "\n全部通过");
process.exit(failed ? 1 : 0);

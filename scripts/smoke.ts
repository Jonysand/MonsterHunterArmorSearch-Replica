/** 引擎冒烟测试：node --import tsx scripts/smoke.ts */
import { search } from "../src/lib/engine";
import type { SearchParams, SearchResult } from "../src/types";
import { ARMORS, ARMOR_BY_NAME, DECOS, DECO_BY_NAME } from "../src/lib/model";

function show(label: string, r: SearchResult): void {
  const parts = r.parts
    .map((p, i) => (i === 5 ? `护石:${p?.name ?? "无"}` : p?.name ?? "无"))
    .join(" | ");
  const decos = Object.entries(r.armorDecos)
    .map(([n, c]) => `${n}×${c}`)
    .join(" ");
  const wd = Object.entries(r.weaponDecos)
    .map(([n, c]) => `${n}×${c}`)
    .join(" ");
  console.log(`\n[${label}] 防御=${r.defense} ${parts}`);
  console.log(`  防具珠: ${decos || "无"}  武器珠: ${wd || "无"}`);
}

function verify(label: string, params: SearchParams, expectSkills: string[]): boolean {
  let ok = true;
  let count = 0;
  search(params, {
    onProgress: (_p, rs) => {
      count = rs.length;
      for (const r of rs.slice(0, 5)) {
        const total: Record<string, number> = {};
        for (const p of r.parts) {
          if (!p) continue;
          for (const s in p.skills) total[s] = (total[s] ?? 0) + p.skills[s];
        }
        for (const [n, c] of Object.entries(r.armorDecos)) {
          const d = DECO_BY_NAME.get(n)!;
          for (const s in d.skills) total[s] = (total[s] ?? 0) + d.skills[s] * c;
        }
        for (const [n, c] of Object.entries(r.weaponDecos)) {
          const d = DECO_BY_NAME.get(n)!;
          for (const s in d.skills) total[s] = (total[s] ?? 0) + d.skills[s] * c;
        }
        for (const sk of expectSkills) {
          const lv = Number(sk.match(/Lv(\d)$/)?.[1] ?? 1);
          const name = sk.replace(/Lv\d$/, "");
          if ((total[name] ?? 0) < lv) {
            ok = false;
            console.log(`  ✗ ${name} 需要 ${lv}，实际 ${total[name] ?? 0}`);
          }
        }
      }
    },
    shouldCancel: () => false,
  });
  console.log(`${label}: ${count} 件结果, 技能核验 ${ok ? "✓" : "✗"}`);
  return ok && count > 0;
}

const base: SearchParams = {
  armorSkills: {},
  weaponSkills: {},
  weaponSlots: [],
  pins: {},
  excludes: {},
  charms: [],
  minDefense: 0,
  resMins: [-100, -100, -100, -100, -100],
  limit: 10,
  decoInventory: {},
};

console.log("=== T1 弱点特效Lv3（防具珠补齐） ===");
verify("T1", { ...base, armorSkills: { 弱点特效: 3 } }, ["弱点特效Lv3"]);

console.log("\n=== T2 看破Lv3 + 攻击Lv3（武器珠技能） 武器插槽LV3-1-1 ===");
verify(
  "T2",
  { ...base, weaponSkills: { 看破: 3, 攻击: 3 }, weaponSlots: [3, 1, 1] },
  ["看破Lv3", "攻击Lv3"],
);

console.log("\n=== T3 组合: 弱点特效2 + 看破2 + 攻击2, 武器插槽LV2-2-1 ===");
verify(
  "T3",
  { ...base, armorSkills: { 弱点特效: 2 }, weaponSkills: { 看破: 2, 攻击: 2 }, weaponSlots: [2, 2, 1] },
  ["弱点特效Lv2", "看破Lv2", "攻击Lv2"],
);

console.log("\n=== T4 最低防御 300 ===");
verify("T4", { ...base, armorSkills: { 弱点特效: 3 }, minDefense: 300 }, ["弱点特效Lv3"]);

console.log("\n=== T5 所持数限制: 痛击珠【3】只有1颗 ===");
verify(
  "T5",
  { ...base, armorSkills: { 弱点特效: 3 }, decoInventory: { "痛击珠【3】": 1 } },
  ["弱点特效Lv3"],
);

console.log("\n=== 样例输出 ===");
{
  const rs: SearchResult[] = [];
  search({ ...base, armorSkills: { 弱点特效: 3, 看破: 2 }, weaponSkills: { 攻击: 2 }, weaponSlots: [3, 1, 1], limit: 3 }, {
    onProgress: (_p, r) => void (rs.length = 0) || rs.push(...r),
    shouldCancel: () => false,
  });
  rs.slice(0, 3).forEach((r, i) => show(`样例${i + 1}`, r));
}

// 数据完整性
console.log(`\n数据: 防具 ${ARMORS.length}（含+变体）, 珠子 ${DECOS.length}`);
console.log("护鹭鹰龙腰甲 存在:", ARMOR_BY_NAME.has("护鹭鹰龙腰甲"));

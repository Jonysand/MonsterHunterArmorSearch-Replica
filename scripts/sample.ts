import { search } from "../src/lib/engine";
import type { SearchParams, SearchResult } from "../src/types";
import { DECO_BY_NAME } from "../src/lib/model";

const base: SearchParams = {
  armorSkills: {},
  weaponSkills: {},
  weaponSlots: [],
  pins: {},
  excludes: {},
  charms: [],
  minDefense: 0,
  resMins: [-100, -100, -100, -100, -100],
  limit: 3,
  decoInventory: {},
};
const rs: SearchResult[] = [];
search(
  {
    ...base,
    armorSkills: { 弱点特效: 3 },
    weaponSkills: { 看破: 2, 攻击: 2 },
    weaponSlots: [3, 1, 1],
    limit: 3,
  },
  {
    onProgress: (_p, r) => {
      rs.length = 0;
      rs.push(...r);
    },
    shouldCancel: () => false,
  },
);
console.log("样例结果:", rs.length);
for (const r of rs.slice(0, 3)) {
  const parts = r.parts.map((p, i) => (i === 5 ? `护石:${p?.name ?? "无"}` : p?.name ?? "无")).join(" | ");
  console.log(`防御=${r.defense} ${parts}`);
  console.log(`  防具珠: ${Object.entries(r.armorDecos).map(([n, c]) => `${n}×${c}`).join(" ") || "无"}  武器珠: ${Object.entries(r.weaponDecos).map(([n, c]) => `${n}×${c}`).join(" ") || "无"}`);
}
void DECO_BY_NAME;

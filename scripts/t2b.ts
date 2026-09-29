import { search } from "../src/lib/engine";
import type { SearchParams } from "../src/types";
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
  limit: 5,
  decoInventory: {},
};
let n = 0;
let ok = true;
search(
  { ...base, weaponSkills: { 看破: 3, 攻击: 3 }, weaponSlots: [3, 3, 3] },
  {
    onProgress: (_p, rs) => {
      n = rs.length;
      for (const r of rs) {
        const t: Record<string, number> = {};
        for (const [nm, c] of Object.entries(r.weaponDecos)) {
          const d = DECO_BY_NAME.get(nm)!;
          for (const s in d.skills) t[s] = (t[s] ?? 0) + d.skills[s] * c;
        }
        if ((t["看破"] ?? 0) < 3 || (t["攻击"] ?? 0) < 3) {
          ok = false;
          console.log("bad:", JSON.stringify(r.weaponDecos), JSON.stringify(t));
        }
      }
    },
    shouldCancel: () => false,
  },
);
console.log("T2b 看破3+攻击3 [3,3,3]:", n, "件, 核验", ok ? "✓" : "✗");

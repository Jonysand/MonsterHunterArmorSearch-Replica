import { ARMORS, DECOS, WEAPON_SKILLS } from "../src/lib/model";

for (const sk of ["攻击", "看破", "弱点特效"]) {
  const ds = DECOS.filter((d) => d.skills[sk]);
  console.log(sk, "珠子:", ds.map((d) => `${d.name}(槽${d.slot},+${d.skills[sk]})`).join(" "));
}

let n = 0;
for (const a of ARMORS) {
  for (const s in a.skills) {
    if (WEAPON_SKILLS.has(s)) {
      n++;
      if (n <= 3) console.log("防具提供武器技能:", a.name, s, a.skills[s]);
    }
  }
}
console.log("提供武器技能的防具数:", n);

console.log("痛击珠:", DECOS.filter((d) => d.name.includes("痛击")).map((d) => JSON.stringify(d)));

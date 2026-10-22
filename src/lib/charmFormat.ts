/** 护石内容的最小结构（与 store 的 CharmInput 结构兼容，避免服务端引入浏览器 store） */
export interface CharmShape {
  skills: Record<string, number>;
  slots: number[];
  weaponSlots?: number[];
}

/** 生成护石内容指纹（技能集合 + 两组插槽），用于导入去重 */
export function charmFingerprint(c: CharmShape): string {
  const skills = Object.entries(c.skills)
    .sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  const slots = (c.slots ?? []).join("-");
  const weapon = (c.weaponSlots ?? []).join("-");
  return `${skills}|${slots}|${weapon}`;
}

/** 按登记页同款规则生成护石名：技能Lv 并列 + 插槽/武器槽档位 */
export function charmDisplayName(c: CharmShape): string {
  const skills = Object.entries(c.skills)
    .map(([k, v]) => `${k}Lv${v}`)
    .join(" ");
  const armor = (c.slots ?? []).filter((s) => s > 0);
  const weapon = (c.weaponSlots ?? []).filter((s) => s > 0);
  let name = skills;
  if (armor.length) name += `${name ? " ・" : ""}插槽${armor.join("-")}`;
  if (weapon.length) name += `${name ? " ・" : ""}武器槽${weapon.join("-")}`;
  return name || "无名护石";
}

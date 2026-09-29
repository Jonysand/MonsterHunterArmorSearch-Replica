import rawData from "../data/mhwilds-data.json";
import type { ArmorData, DecoData, SkillGroup, SkillEntry } from "../types";

interface RawArmorJson {
  name: string;
  part: number;
  rarity: number;
  group: number;
  slots: number[];
  skills: Record<string, number>;
  defense: number;
  resists: number[];
}

const raw = rawData as unknown as {
  version: string;
  parts: string[];
  armors: RawArmorJson[];
  decos: DecoData[];
  skill_groups: { group: string; skills: SkillEntry[] }[];
  weapon_skills: string[];
  set_groups: string[];
  group_skills: string[];
};

export const DATA_VERSION = raw.version;
export const PART_LABELS = raw.parts;

/** 防具等级上限：技能名 → 最大等级（含"通用插槽（预留插槽）"伪技能） */
const skillMaxLevel = new Map<string, number>();
for (const g of raw.skill_groups) {
  for (const s of g.skills) {
    skillMaxLevel.set(s.skill, Math.max(skillMaxLevel.get(s.skill) ?? 0, s.level));
  }
}
/** 选择器展示名 → 基础技能名与等级（"弱点特效Lv2" → {skill, level}） */
const entryIndex = new Map<string, { skill: string; level: number }>();
for (const g of raw.skill_groups) {
  for (const s of g.skills) {
    entryIndex.set(s.entry, { skill: s.skill, level: s.level });
  }
}

/**
 * 与原站一致：group 5/6 的防具生成 "+" 强化变体。
 * group 5：所有插槽等级 +1；group 6：前两个插槽 +1（上限 Lv3）。
 */
function withPlusVariants(armors: RawArmorJson[]): RawArmorJson[] {
  const out = [...armors];
  for (const a of armors) {
    if (a.part > 4) continue;
    if (a.group === 5) {
      out.push({
        ...a,
        name: a.name + "+",
        slots: a.slots.map((s) => Math.min(3, s + 1)) as number[],
      });
    } else if (a.group === 6) {
      out.push({
        ...a,
        name: a.name + "+",
        slots: [Math.min(3, a.slots[0] + 1), Math.min(3, a.slots[1] + 1), a.slots[2]],
      });
    }
  }
  return out;
}

export const ARMORS: ArmorData[] = withPlusVariants(raw.armors).map((a) => ({
  name: a.name,
  part: a.part,
  rarity: a.rarity,
  group: a.group,
  slots: [a.slots[0], a.slots[1], a.slots[2]],
  skills: a.skills,
  defense: a.defense,
  resists: [a.resists[0], a.resists[1], a.resists[2], a.resists[3], a.resists[4]],
}));

export const ARMOR_BY_NAME = new Map(ARMORS.map((a) => [a.name, a]));

export const DECOS: DecoData[] = raw.decos;
export const DECO_BY_NAME = new Map(DECOS.map((d) => [d.name, d]));

/** 技能分组（技能选择器用） */
export const SKILL_GROUPS: SkillGroup[] = raw.skill_groups;

/** 武器珠技能集合 */
export const WEAPON_SKILLS = new Set(raw.weapon_skills);

/** Group Skill 下拉候选（Group Skill 组） */
export const GROUP_SKILL_NAMES: string[] = [...raw.group_skills];
/** 系列技能（套装技能）下拉候选 */
export const SERIES_SKILL_NAMES: string[] = [...raw.set_groups];

/** 技能选择器展示名解析："弱点特效Lv2" → 技能名+等级；伪插槽技能原样透传 */
export function parseSkillEntry(entry: string): { skill: string; level: number } | null {
  return entryIndex.get(entry) ?? null;
}

/** 技能基础名 → 最大等级 */
export function maxLevelOf(skill: string): number {
  return skillMaxLevel.get(skill) ?? 0;
}

/** 全部技能选择项（拍平，按分组顺序） */
export function allSkillEntries(): (SkillEntry & { group: string })[] {
  return SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.group })));
}

/** 槽位模式签名 */
export function slotKeyOf(slots: number[]): string {
  return slots.join("-");
}

/** 内置护石（主数据 part=5）转装备实例之外，还需用户自定义护石；此表仅提供内置清单 */
export function builtinCharms(): ArmorData[] {
  return ARMORS.filter((a) => a.part === 5);
}

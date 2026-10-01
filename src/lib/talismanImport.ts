/**
 * 护石文本导入 —— 兼容 REFramework "Talisman Exporter" mod 与原站(mhwilds.wiki-db.com)
 * 护石复制粘贴的导出格式。每行 12 个 CSV 字段：
 *
 *   技能1名,技能1级,技能2名,技能2级,技能3名,技能3级, 防具槽1,防具槽2,防具槽3, 武器槽1,武器槽2,武器槽3
 *
 * 技能名可同时出现防具技能与武器技能(TU2 鉴定护石)；无技能的槽位名为空、等级为 0。
 * 导出文件为英文技能名，按原站官方 en/zh-hans 数据对齐表(skillNameMap)翻译成中文；
 * 中文技能名直接透传。
 */
import { SKILL_NAME_EN_TO_ZH } from "./skillNameMap";
import { SKILL_GROUPS, WEAPON_SKILLS } from "./model";
import type { CharmInput } from "../store/simulator";

/** 项目内全部合法中文技能名（防具 + 武器） */
const ZH_SKILL_NAMES: ReadonlySet<string> = new Set([
  ...SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.skill)),
  ...WEAPON_SKILLS,
]);

export interface TalismanParseError {
  /** 1 起始的行号 */
  line: number;
  reason: string;
}

export interface TalismanParseResult {
  /** 导入内容（未分配 id，未经去重） */
  charms: Omit<CharmInput, "id">[];
  errors: TalismanParseError[];
  /** 空行 / 全空护石等被忽略的行数 */
  skipped: number;
}

/** 护石内容指纹，用于去重（技能集合 + 两组插槽） */
export function charmFingerprint(c: Pick<CharmInput, "skills" | "slots" | "weaponSlots">): string {
  const skills = Object.entries(c.skills)
    .sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  const slots = (c.slots ?? []).join("-");
  const weapon = (c.weaponSlots ?? []).join("-");
  return `${skills}|${slots}|${weapon}`;
}

/** 按登记页同款规则生成护石名：技能Lv 并列 + 插槽/武器槽档位 */
export function charmDisplayName(c: Pick<CharmInput, "skills" | "slots" | "weaponSlots">): string {
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

function parseIntStrict(s: string): number | null {
  if (!/^\d+$/.test(s)) return null;
  return parseInt(s, 10);
}

function translateSkill(name: string): string | null {
  if (ZH_SKILL_NAMES.has(name)) return name;
  return SKILL_NAME_EN_TO_ZH[name] ?? null;
}

/** 解析导出文本；永不抛出，逐行收集错误 */
export function parseTalismanText(text: string): TalismanParseResult {
  const charms: Omit<CharmInput, "id">[] = [];
  const errors: TalismanParseError[] = [];
  let skipped = 0;

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    const lineNo = i + 1;
    if (!raw) continue;

    const fields = raw.split(",").map((f) => f.trim());
    if (fields.length < 12) {
      errors.push({ line: lineNo, reason: `字段数不足（${fields.length}/12）` });
      continue;
    }

    // 三组技能
    const skills: Record<string, number> = {};
    let ok = true;
    for (let s = 0; s < 3; s++) {
      const name = fields[s * 2];
      const lvStr = fields[s * 2 + 1];
      if (!name) {
        if (lvStr && lvStr !== "0") {
          errors.push({ line: lineNo, reason: `技能${s + 1}名为空但等级为 ${lvStr}` });
          ok = false;
        }
        continue;
      }
      const level = parseIntStrict(lvStr);
      if (level === null || level < 1 || level > 7) {
        errors.push({ line: lineNo, reason: `技能「${name}」等级无效（${lvStr || "空"}）` });
        ok = false;
        continue;
      }
      const zh = translateSkill(name);
      if (!zh) {
        errors.push({ line: lineNo, reason: `未知技能名「${name}」` });
        ok = false;
        continue;
      }
      skills[zh] = Math.max(skills[zh] ?? 0, level);
    }

    // 两组插槽：防具槽 + 武器槽
    const slots: number[] = [];
    const weaponSlots: number[] = [];
    for (let g = 0; g < 2 && ok; g++) {
      const target = g === 0 ? slots : weaponSlots;
      for (let k = 0; k < 3; k++) {
        const v = parseIntStrict(fields[6 + g * 3 + k]);
        if (v === null || v > 3) {
          errors.push({ line: lineNo, reason: `${g === 0 ? "防具" : "武器"}插槽${k + 1}无效（${fields[6 + g * 3 + k] || "空"}）` });
          ok = false;
          break;
        }
        target.push(v);
      }
    }
    if (!ok) continue;

    if (!Object.keys(skills).length && slots.every((s) => s === 0) && weaponSlots.every((s) => s === 0)) {
      skipped++;
      continue;
    }
    // 游戏内插槽按 Lv3 ≥ Lv2 ≥ Lv1 降序登记
    slots.sort((a, b) => b - a);
    weaponSlots.sort((a, b) => b - a);
    charms.push({ name: charmDisplayName({ skills, slots, weaponSlots }), skills, slots, weaponSlots });
  }

  return { charms, errors, skipped };
}

export interface ImportReport {
  added: number;
  duplicate: number;
  skipped: number;
  failed: number;
  /** 截取后的前若干条错误（供 UI 展示） */
  errorPreview: TalismanParseError[];
  errorTotal: number;
}

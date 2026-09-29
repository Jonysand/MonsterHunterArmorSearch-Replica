import { WEAPON_SKILLS, parseSkillEntry } from "./model";
import type { SearchParams } from "../types";

/**
 * URL hash 序列化 —— 兼容原站格式：
 * #skills=弱点特效Lv2,攻击Lv3&s=1&e=1&w=LV3-1&d=0&rf=-100...&l=200
 * 技能以 "技能名LvN" 逗号分隔；护石、所持数等本地数据不入 hash。
 */
export function encodeHash(p: {
  armorSkills: Record<string, number>;
  weaponSkills: Record<string, number>;
  weaponSlots: number[];
  minDefense: number;
  resMins: [number, number, number, number, number];
  limit: number;
}): string {
  const skills: string[] = [];
  for (const [s, lv] of Object.entries(p.armorSkills)) if (lv > 0) skills.push(`${s}Lv${lv}`);
  for (const [s, lv] of Object.entries(p.weaponSkills)) if (lv > 0) skills.push(`${s}Lv${lv}`);
  const q = new URLSearchParams();
  q.set("skills", skills.join(","));
  q.set("s", "1");
  q.set("e", "1");
  q.set("w", p.weaponSlots.some((x) => x > 0) ? `LV${p.weaponSlots.filter((x) => x > 0).join("-")}` : "");
  q.set("d", String(p.minDefense));
  const [rf, rw, rt, ri, rd] = p.resMins;
  q.set("rf", String(rf));
  q.set("rw", String(rw));
  q.set("rt", String(rt));
  q.set("ri", String(ri));
  q.set("rd", String(rd));
  q.set("l", String(p.limit));
  return q.toString();
}

export interface DecodedQuery {
  armorSkills: Record<string, number>;
  weaponSkills: Record<string, number>;
  weaponSlots: number[];
  minDefense: number;
  resMins: [number, number, number, number, number];
  limit: number;
}

/** 解析原站兼容 hash；未知技能忽略 */
export function decodeHash(hash: string): DecodedQuery | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  const q = new URLSearchParams(raw);
  const out: DecodedQuery = {
    armorSkills: {},
    weaponSkills: {},
    weaponSlots: [],
    minDefense: 0,
    resMins: [-100, -100, -100, -100, -100],
    limit: 200,
  };
  const skills = q.get("skills") ?? "";
  for (const part of skills.split(",")) {
    const entry = part.trim();
    if (!entry) continue;
    const parsed = parseSkillEntry(entry);
    if (!parsed) continue;
    if (WEAPON_SKILLS.has(parsed.skill)) out.weaponSkills[parsed.skill] = parsed.level;
    else out.armorSkills[parsed.skill] = parsed.level;
  }
  const w = q.get("w") ?? "";
  const m = w.match(/LV(\d)(?:-(\d))?(?:-(\d))?/);
  if (m) out.weaponSlots = [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
  out.minDefense = Number(q.get("d") ?? 0) || 0;
  out.resMins = [
    Number(q.get("rf") ?? -100),
    Number(q.get("rw") ?? -100),
    Number(q.get("rt") ?? -100),
    Number(q.get("ri") ?? -100),
    Number(q.get("rd") ?? -100),
  ];
  out.limit = Number(q.get("l") ?? 200) || 200;
  return out;
}

export type { SearchParams };

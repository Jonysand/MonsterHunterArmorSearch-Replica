/**
 * 从解密后的 MH Wilds 角色存档中提取护石（EquipBox → talisman）。
 *
 * 游戏内护石数据保存在 `app.SaveDataManager._Equip._EquipBox` 的物品里：
 *   - `FreeVal0` ∈ {189,190,191,192} 表示护石（普通/历史/神秘/黄金时代）
 *   - `BowgunCustomizeId` 是 4 个 s16：
 *       [0..2] = 等级 * 1000 + app.HunterDef.Skill 枚举
 *       [3]    = 插槽打包值（十/百/千位 + 个位 flag）
 * 本模块只读取类流，不写入任何数据。
 */
import { charmDisplayName } from "../../src/lib/charmFormat.ts";
import type { SyncedTalisman } from "../../src/lib/gameSyncTypes.ts";
import {
  ARRAY_TYPE,
  RSZ_TYPE,
  RszParseError,
  getArrayField,
  getNumberField,
  murmur3_32,
  readArrayFieldAt,
  type RszClass,
} from "./rsz.ts";
import { SKILL_ID_TO_EN, SKILL_ID_TO_ZH } from "./skillIds.ts";

export const HASH_FREE_VAL0 = murmur3_32("FreeVal0");
export const HASH_BOWGUN_CUSTOMIZE_ID = murmur3_32("BowgunCustomizeId");
export const HASH_EQUIP_BOX = murmur3_32("_EquipBox");

const AMULET_TYPES = new Set([189, 190, 191, 192]);

export interface ExtractedTalismans {
  talismans: SyncedTalisman[];
  stats: {
    /** EquipBox 物品总数 */
    itemCount: number;
    /** 护石条目（含空占位） */
    talismanCount: number;
    /** 可导入的护石数 */
    nonEmptyTalismanCount: number;
    /** 空护石/占位条目 */
    emptyCount: number;
    /** 因未知技能 ID 跳过的条目 */
    skippedUnknownSkill: number;
    unknownSkillIds: number[];
    /** 选中的 EquipBox 字段在解密流中的偏移 */
    sourceOffset: number;
    /** 所有候选中非空护石数（用于诊断重复快照） */
    candidates: { offset: number; itemCount: number; talismanCount: number; nonEmptyCount: number }[];
    warnings: string[];
  };
}

/** 解析单个技能值：等级 * 1000 + 技能枚举 ID */
export function decodeSkillValue(raw: number): { level: number; skillId: number } | null {
  if (!Number.isFinite(raw) || raw <= 0) return null;
  const level = Math.floor(raw / 1000);
  const skillId = raw % 1000;
  if (level < 1 || level > 7 || skillId <= 0) return null;
  return { level, skillId };
}

/**
 * 解码插槽打包值。
 *
 * 十进制位：千=槽A，百=槽B，十=槽C 或 武器槽等级，个=flag
 *   flag 0：纯防具槽 [千,百,十]
 *   flag 1：防具槽 [百,十,0] + 武器槽 [千]
 *   flag 3：仅武器槽 [千]
 */
export function decodeSlotPacking(
  raw: number,
): { slots: number[]; weaponSlots: number[] } | null {
  if (!Number.isFinite(raw) || raw < 0) return null;
  const value = Math.floor(raw);
  const a1 = Math.floor(value / 1000) % 10;
  const a2 = Math.floor(value / 100) % 10;
  const a3 = Math.floor(value / 10) % 10;
  const flag = value % 10;

  if (flag === 0) {
    return { slots: [a1, a2, a3], weaponSlots: [] };
  }
  if (flag === 1) {
    return { slots: [a2, a3, 0], weaponSlots: a1 > 0 ? [a1] : [] };
  }
  if (flag === 3) {
    return { slots: [0, 0, 0], weaponSlots: a1 > 0 ? [a1] : [] };
  }
  return null;
}

function pad3(values: number[]): number[] {
  return [values[0] ?? 0, values[1] ?? 0, values[2] ?? 0];
}

function countTalismans(items: RszClass[]): {
  talismanCount: number;
  nonEmptyCount: number;
} {
  let talismanCount = 0;
  let nonEmptyCount = 0;
  for (const item of items) {
    const free = getNumberField(item, HASH_FREE_VAL0);
    if (free === null || !AMULET_TYPES.has(free)) continue;
    talismanCount++;
    const custom = getArrayField(item, HASH_BOWGUN_CUSTOMIZE_ID);
    if (!custom) continue;
    const values = custom.values.map((value) =>
      value.kind === "number" ? Number(value.value) : 0,
    );
    if (values.slice(0, 3).some((value) => value > 0) || (values[3] ?? 0) > 0) {
      nonEmptyCount++;
    }
  }
  return { talismanCount, nonEmptyCount };
}

interface EquipBoxCandidate {
  offset: number;
  items: RszClass[];
  talismanCount: number;
  nonEmptyCount: number;
}

/** 扫描解密后的类流，找到所有 `_EquipBox` 数组并统计其中的护石 */
export function findEquipBoxCandidates(data: Buffer): EquipBoxCandidate[] {
  const pattern = Buffer.alloc(4);
  pattern.writeUInt32LE(HASH_EQUIP_BOX);
  const candidates: EquipBoxCandidate[] = [];
  let index = data.indexOf(pattern);
  while (index !== -1) {
    if ((index & 3) === 0) {
      // 先做低成本的结构校验，避免把随机字节当数组解析
      if (
        index + 24 <= data.length &&
        data.readInt32LE(index + 4) === RSZ_TYPE.ARRAY &&
        data.readInt32LE(index + 8) === RSZ_TYPE.CLASS &&
        data.readUInt32LE(index + 12) === 8 &&
        data.readInt32LE(index + 20) === ARRAY_TYPE.CLASS
      ) {
        const length = data.readUInt32LE(index + 16);
        if (length > 0 && length <= 20_000) {
          try {
            const array = readArrayFieldAt(data, index, HASH_EQUIP_BOX);
            const items: RszClass[] = [];
            for (const value of array.values) {
              if (value.kind === "class") items.push(value.value);
            }
            const counts = countTalismans(items);
            candidates.push({
              offset: index,
              items,
              talismanCount: counts.talismanCount,
              nonEmptyCount: counts.nonEmptyCount,
            });
          } catch (error) {
            if (!(error instanceof RszParseError)) throw error;
          }
        }
      }
    }
    index = data.indexOf(pattern, index + 4);
  }
  return candidates;
}

function valuesOf(array: ReturnType<typeof getArrayField>): number[] {
  if (!array) return [];
  return array.values.map((value) =>
    value.kind === "number" ? Number(value.value) : 0,
  );
}

/** 从解密+解压后的存档类流中提取护石 */
export function extractTalismans(saveData: Buffer): ExtractedTalismans {
  const warnings: string[] = [];
  const candidates = findEquipBoxCandidates(saveData);
  if (candidates.length === 0) {
    throw new Error("存档中未找到护石箱（_EquipBox），可能不是角色存档或游戏版本已变化");
  }

  // 存档里可能有多个 EquipBox 快照；选择实际护石最多的一份
  candidates.sort(
    (a, b) => b.nonEmptyCount - a.nonEmptyCount || b.talismanCount - a.talismanCount,
  );
  const best = candidates[0];
  const talismans: SyncedTalisman[] = [];
  const unknownSkillIds = new Set<number>();
  let emptyCount = 0;
  let skippedUnknownSkill = 0;

  for (const item of best.items) {
    const free = getNumberField(item, HASH_FREE_VAL0);
    if (free === null || !AMULET_TYPES.has(free)) continue;

    const custom = getArrayField(item, HASH_BOWGUN_CUSTOMIZE_ID);
    const rawValues = valuesOf(custom);
    if (rawValues.length < 4) {
      warnings.push(`护石条目字段不完整（BowgunCustomizeId 长度 ${rawValues.length}）`);
      continue;
    }

    const skills: Record<string, number> = {};
    let hasUnknownSkill = false;
    for (let i = 0; i < 3; i++) {
      const decoded = decodeSkillValue(rawValues[i]);
      if (!decoded) continue;
      const name = SKILL_ID_TO_ZH[decoded.skillId] ?? SKILL_ID_TO_EN[decoded.skillId];
      if (!name) {
        unknownSkillIds.add(decoded.skillId);
        hasUnknownSkill = true;
        continue;
      }
      skills[name] = Math.max(skills[name] ?? 0, decoded.level);
    }

    const slotInfo = decodeSlotPacking(rawValues[3]);
    const armorSlots = slotInfo ? slotInfo.slots.filter((slot) => slot > 0) : [];
    const weaponSlots = slotInfo ? slotInfo.weaponSlots.filter((slot) => slot > 0) : [];
    const hasSkill = Object.keys(skills).length > 0;
    const hasSlot = armorSlots.length > 0 || weaponSlots.length > 0;

    if (!hasSkill && !hasSlot) {
      emptyCount++;
      continue;
    }
    if (hasUnknownSkill) {
      skippedUnknownSkill++;
      continue;
    }
    if (!slotInfo) {
      warnings.push(`未知插槽打包值 ${rawValues[3]}（已按无插槽处理）`);
    }

    armorSlots.sort((a, b) => b - a);
    weaponSlots.sort((a, b) => b - a);
    const shape = {
      skills,
      slots: pad3(armorSlots),
      weaponSlots: pad3(weaponSlots),
    };
    talismans.push({
      name: charmDisplayName(shape),
      ...shape,
      amuletType: free,
    });
  }

  if (unknownSkillIds.size > 0) {
    warnings.unshift(
      `发现未知技能 ID：${[...unknownSkillIds].sort((a, b) => a - b).join(", ")}（相关护石已跳过）`,
    );
  }
  if (skippedUnknownSkill > 0) {
    warnings.push(`因未知技能跳过 ${skippedUnknownSkill} 个护石`);
  }

  return {
    talismans,
    stats: {
      itemCount: best.items.length,
      talismanCount: best.talismanCount,
      nonEmptyTalismanCount: talismans.length,
      emptyCount,
      skippedUnknownSkill,
      unknownSkillIds: [...unknownSkillIds].sort((a, b) => a - b),
      sourceOffset: best.offset,
      candidates: candidates.map((candidate) => ({
        offset: candidate.offset,
        itemCount: candidate.items.length,
        talismanCount: candidate.talismanCount,
        nonEmptyCount: candidate.nonEmptyCount,
      })),
      warnings,
    },
  };
}

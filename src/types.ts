/** 部位索引：0头 1身 2腕 3腰 4脚 5护石（与原站数据一致） */
export const PART_HEAD = 0;
export const PART_BODY = 1;
export const PART_ARM = 2;
export const PART_WAIST = 3;
export const PART_LEGS = 4;
export const PART_CHARM = 5;
/** 虚拟部位：武器插槽 */
export const PART_WEAPON = 6;

export const PART_NAMES = ["头", "身", "腕", "腰", "脚", "护石"] as const;
export const PART_KEYS = ["head", "body", "arm", "waist", "legs", "charm"] as const;

export type PartIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** 防具/护石主数据（含运行时生成的 "+" 强化变体） */
export interface ArmorData {
  name: string;
  part: number;
  rarity: number;
  /** 装甲系列组；5/6 组存在插槽升级变体（提取器已在加载期生成） */
  group: number;
  /** 插槽等级列表（降序，0 补齐到 3 位），如 [3,1,0] = 一个Lv3一个Lv1 */
  slots: [number, number, number];
  skills: Record<string, number>;
  defense: number;
  /** [火, 水, 雷, 冰, 龙] */
  resists: [number, number, number, number, number];
}

export interface DecoData {
  name: string;
  /** 插槽等级 1-3 */
  slot: number;
  skills: Record<string, number>;
  kind: "armor" | "weapon";
}

export interface SkillEntry {
  /** 选择器展示名，如 "弱点特效Lv2" */
  entry: string;
  /** 基础技能名，如 "弱点特效" */
  skill: string;
  level: number;
}

export interface SkillGroup {
  group: string;
  skills: SkillEntry[];
}

/** 搜索引擎中的装备实例 */
export interface Piece {
  name: string;
  part: number;
  slots: [number, number, number];
  skills: Record<string, number>;
  defense: number;
  resists: [number, number, number, number, number];
  /** 成本 = Σ需求技能等级 + 插槽数，用于候选排序与剪枝 */
  cost: number;
  /** 槽位模式签名（同部位同模式可合并代表） */
  slotKey: string;
}

/** 搜索条件 */
export interface SearchParams {
  /** 必须发动的技能 → 等级（不含武器珠技能） */
  armorSkills: Record<string, number>;
  /** 武器珠技能 → 等级 */
  weaponSkills: Record<string, number>;
  /** 武器插槽等级列表（降序，可空数组=无插槽） */
  weaponSlots: number[];
  /** 各部位固定装备名 */
  pins: Partial<Record<PartIndex, string>>;
  /** 各部位除外装备名 */
  excludes: Partial<Record<PartIndex, string[]>>;
  /** 护石候选（用户登记 + 内置护石） */
  charms: Piece[];
  /** 最低防御 */
  minDefense: number;
  /** 各属性耐性下限 [火, 水, 雷, 冰, 龙]，-100 为不限制 */
  resMins: [number, number, number, number, number];
  /** 结果上限 */
  limit: number;
  /** 装饰品所持数（名称→数量；缺省按无限制处理） */
  decoInventory: Record<string, number>;
  /** 搜索节点预算（超限提前终止），缺省 2,000,000 */
  nodeBudget?: number;
}

export interface SearchResult {
  parts: (Piece | null)[];
  /** 防具珠布置 名称→数量 */
  armorDecos: Record<string, number>;
  /** 武器珠布置 名称→数量 */
  weaponDecos: Record<string, number>;
  defense: number;
  resists: [number, number, number, number, number];
}

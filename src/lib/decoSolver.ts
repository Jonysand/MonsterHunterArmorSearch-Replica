import type { DecoData } from "../types";

/**
 * 装饰品求解器 —— 复刻原站 Mg/Og/Pg 的桶级联模型：
 * 插槽按等级分桶；低级珠可放入高级插槽（占位从高桶透支），反之不行。
 * push 后若总容量（Kg 级联）为负则回滚。
 */
export interface DecoSolveInput {
  /** 各插槽等级列表，如 [3,1,1] */
  slots: number[];
  /** 技能 → 还需等级 */
  required: Record<string, number>;
  /** 技能 → 候选装饰品（单技能珠 + 复合珠） */
  decosBySkill: Map<string, DecoData[]>;
  /** 所持数，缺省视为无限 */
  inventory: Record<string, number>;
  /** 搜索节点预算，超过则放弃 */
  nodeBudget?: number;
}

export interface DecoPlacement {
  deco: DecoData;
  count: number;
}

interface SolveState {
  /** [_, lv1, lv2, lv3] 剩余桶 */
  buckets: [number, number, number, number];
  remaining: Record<string, number>;
  placed: DecoPlacement[];
}

/** 级联后的总剩余容量（原站 Kg） */
function capacity(b: [number, number, number, number]): number {
  const mid = b[2] + Math.min(0, b[1]);
  return b[3] + Math.min(0, mid);
}

function ownedOf(inventory: Record<string, number>, decoName: string): number {
  return Object.prototype.hasOwnProperty.call(inventory, decoName)
    ? inventory[decoName]
    : Infinity;
}

function pushDeco(st: SolveState, deco: DecoData, count: number): boolean {
  st.buckets[deco.slot] -= count;
  for (const s in deco.skills) st.remaining[s] = (st.remaining[s] ?? 0) - deco.skills[s] * count;
  if (capacity(st.buckets) < 0) {
    // 回滚
    st.buckets[deco.slot] += count;
    for (const s in deco.skills) st.remaining[s] = (st.remaining[s] ?? 0) + deco.skills[s] * count;
    return false;
  }
  st.placed.push({ deco, count });
  return true;
}

function popDeco(st: SolveState, deco: DecoData, count: number): void {
  const top = st.placed[st.placed.length - 1];
  if (top && top.deco === deco && top.count === count) st.placed.pop();
  else {
    const i = st.placed.findIndex((p) => p.deco === deco && p.count === count);
    if (i >= 0) st.placed.splice(i, 1);
  }
  st.buckets[deco.slot] += count;
  for (const s in deco.skills) st.remaining[s] = (st.remaining[s] ?? 0) + deco.skills[s] * count;
}

/**
 * 回溯求解：取第一个未满足技能，尝试其单技能珠与包含它的复合珠。
 * 返回布置方案或 null。
 */
export function solveDecos(input: DecoSolveInput): DecoPlacement[] | null {
  const { slots, required, decosBySkill, inventory } = input;
  const buckets: [number, number, number, number] = [0, 0, 0, 0];
  for (const s of slots) {
    if (s >= 1 && s <= 3) buckets[s]++;
  }
  const remaining: Record<string, number> = {};
  for (const k in required) remaining[k] = required[k];

  // 快速排除：按每颗珠最大提供级数估计最少所需槽数
  const maxGives = new Map<string, number>();
  for (const k in required) {
    let mx = 0;
    for (const d of decosBySkill.get(k) ?? []) mx = Math.max(mx, d.skills[k] ?? 0);
    maxGives.set(k, mx);
  }
  let needSlots = 0;
  for (const k in required) {
    const mx = maxGives.get(k) ?? 0;
    if (mx <= 0) return null; // 没有任何珠子能提供该技能
    needSlots += Math.ceil(Math.max(0, required[k]) / mx);
  }
  if (needSlots > slots.length) return null;

  const st: SolveState = { buckets, remaining, placed: [] };
  let nodes = 0;
  const budget = input.nodeBudget ?? 30000;

  const requiredKeys = Object.keys(remaining).filter((k) => remaining[k] > 0);

  function firstUnsatisfied(): string | null {
    for (const k of requiredKeys) if (st.remaining[k] > 0) return k;
    return null;
  }

  function bt(): boolean {
    if (++nodes > budget) return false;
    const skill = firstUnsatisfied();
    if (skill === null) return true;
    const options = decosBySkill.get(skill) ?? [];
    for (const deco of options) {
      const gives = deco.skills[skill] ?? 0;
      if (gives <= 0) continue;
      const own = ownedOf(inventory, deco.name);
      const maxByNeed = Math.ceil(st.remaining[skill] / gives);
      const max = Math.min(isFinite(own) ? own : maxByNeed, maxByNeed);
      for (let c = max; c >= 1; c--) {
        if (!pushDeco(st, deco, c)) continue;
        if (bt()) return true;
        popDeco(st, deco, c);
      }
    }
    return false;
  }

  return bt() ? st.placed.map((p) => ({ deco: p.deco, count: p.count })) : null;
}

/** 布置结果展开为 名称→数量 */
export function placementToCounts(placed: DecoPlacement[] | null): Record<string, number> | null {
  if (!placed) return null;
  const out: Record<string, number> = {};
  for (const p of placed) out[p.deco.name] = (out[p.deco.name] ?? 0) + p.count;
  return out;
}

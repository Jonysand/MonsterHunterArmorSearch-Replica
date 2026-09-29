import { ARMORS, DECOS, WEAPON_SKILLS } from "./model";
import { placementToCounts, solveDecos } from "./decoSolver";
import type { ArmorData, DecoData, Piece, SearchParams, SearchResult } from "../types";
import { PART_CHARM } from "../types";

/** 成本 = Σ（需求技能提供等级）+ 插槽数，用于候选排序与剪枝上界（复刻原站 Y.A） */
function costOf(p: { skills: Record<string, number>; slots: number[] }, required: Record<string, number>): number {
  let c = 0;
  for (const s in required) c += p.skills[s] ?? 0;
  return c + p.slots.filter((x) => x > 0).length;
}

function toPiece(a: ArmorData, required: Record<string, number>): Piece {
  return {
    name: a.name,
    part: a.part,
    slots: a.slots,
    skills: a.skills,
    defense: a.defense,
    resists: a.resists,
    cost: costOf(a, required),
    slotKey: a.slots.join("-"),
  };
}

const EMPTY_CHARM: Piece = {
  name: "无",
  part: PART_CHARM,
  slots: [0, 0, 0],
  skills: {},
  defense: 0,
  resists: [0, 0, 0, 0, 0],
  cost: 0,
  slotKey: "0-0-0",
};

/**
 * 候选构建 —— 复刻原站 ne.D 合并策略：
 * 不提供任何需求技能的防具按 部位+槽位模式 分组，仅保留防御最高者；
 * 提供需求技能者全部保留。固定/除外在此过滤。
 */
function buildCandidates(required: Record<string, number>, params: SearchParams): Piece[][] {
  const byPart: Piece[][] = [[], [], [], [], [], []];
  for (let part = 0; part <= 4; part++) {
    const excluded = new Set(params.excludes[part as 0] ?? []);
    let pool = ARMORS.filter((a) => a.part === part && !excluded.has(a.name));
    const pin = params.pins[part as 0];
    if (pin) {
      const pinned = pool.find((a) => a.name === pin);
      pool = pinned ? [pinned] : [];
    } else {
      const best = new Map<string, ArmorData>();
      const skilled: ArmorData[] = [];
      for (const a of pool) {
        let has = false;
        for (const s in required) {
          if ((a.skills[s] ?? 0) > 0) {
            has = true;
            break;
          }
        }
        if (has) skilled.push(a);
        else {
          const k = a.slots.join("-");
          const cur = best.get(k);
          if (!cur || a.defense > cur.defense) best.set(k, a);
        }
      }
      pool = skilled.concat([...best.values()]);
    }
    const pieces = pool.map((a) => toPiece(a, required));
    pieces.sort((x, y) => y.cost - x.cost || x.name.localeCompare(y.name, "zh-Hans-CN"));
    byPart[part] = pieces;
  }
  const charmExcluded = new Set(params.excludes[5] ?? []);
  let charms = params.charms.filter((c) => !charmExcluded.has(c.name));
  const charmPin = params.pins[5];
  if (charmPin) charms = charms.filter((c) => c.name === charmPin);
  byPart[5] = [EMPTY_CHARM, ...charms].sort((x, y) => costOf(y, required) - costOf(x, required));
  return byPart;
}

/** 装饰品索引：技能 → 候选珠（按该技能提供等级降序、插槽等级升序） */
function decoIndex(kind: "armor" | "weapon"): Map<string, DecoData[]> {
  const m = new Map<string, DecoData[]>();
  for (const d of DECOS) {
    if (d.kind !== kind) continue;
    for (const s in d.skills) {
      if (!m.has(s)) m.set(s, []);
      m.get(s)!.push(d);
    }
  }
  for (const [skill, list] of m) {
    list.sort((a, b) => (b.skills[skill] ?? 0) - (a.skills[skill] ?? 0) || a.slot - b.slot);
  }
  return m;
}

export interface EngineCallbacks {
  onProgress: (percent: number, results: SearchResult[]) => void;
  shouldCancel: () => boolean;
  /** 搜索结束（完成或取消/超预算）后回调 */
  onDone?: () => void;
}

const NODES_PER_YIELD = 4000;

/**
 * 主搜索 —— 复刻原站 Ne.D 分支限界 DFS：
 * 按部位 0→5 依成本降序枚举，装饰品可随时补齐差额（记录解后继续深入寻找更高防御的变体）；
 * 剪枝上界 = 未分配部位最大成本和 + 已分配空插槽数。
 */
export function search(params: SearchParams, cb: EngineCallbacks): void {
  const armorRequired = { ...params.armorSkills };
  const weaponRequired = { ...params.weaponSkills };
  const hasWeaponReq = Object.keys(weaponRequired).length > 0;

  const armorDecoMap = decoIndex("armor");
  const weaponDecoMap = decoIndex("weapon");
  const byPart = buildCandidates(armorRequired, params);
  const partMaxCost = byPart.map((list) => (list.length ? Math.max(...list.map((p) => p.cost)) : 0));
  const partMaxDef = byPart.map((list) => (list.length ? Math.max(...list.map((p) => p.defense)) : 0));
  const partMaxRes = byPart.map((list) => {
    const mx = [0, 0, 0, 0, 0];
    for (const p of list) for (let r = 0; r < 5; r++) mx[r] = Math.max(mx[r], p.resists[r]);
    return mx;
  });

  const results: SearchResult[] = [];
  const seen = new Set<string>();
  const limit = Math.max(1, params.limit);
  const assignment: (Piece | null)[] = [null, null, null, null, null, null];
  const curSkills: Record<string, number> = {};
  let curDefense = 0;
  const curResists = [0, 0, 0, 0, 0];
  let nodes = 0;
  let cancelled = false;
  const nodeBudget = params.nodeBudget ?? 2_000_000;

  function deficitOf(): number {
    let d = 0;
    for (const s in armorRequired) d += Math.max(0, armorRequired[s] - (curSkills[s] ?? 0));
    return d;
  }

  function assignedSlots(): number[] {
    const out: number[] = [];
    for (let i = 0; i <= 5; i++) {
      const p = assignment[i];
      if (p) for (const s of p.slots) if (s > 0) out.push(s);
    }
    return out;
  }

  function pieceWeaponSkillContribution(): Record<string, number> {
    const provided: Record<string, number> = {};
    for (let i = 0; i <= 5; i++) {
      const p = assignment[i];
      if (p) for (const s in p.skills) if (WEAPON_SKILLS.has(s)) provided[s] = (provided[s] ?? 0) + p.skills[s];
    }
    return provided;
  }

  function tryRecord(): void {
    const d = deficitOf();
    const slots = assignedSlots();
    if (d > slots.length) return;

    const requiredLeft: Record<string, number> = {};
    for (const s in armorRequired) {
      const left = armorRequired[s] - (curSkills[s] ?? 0);
      if (left > 0) requiredLeft[s] = left;
    }
    const armorSolve = Object.keys(requiredLeft).length
      ? solveDecos({ slots, required: requiredLeft, decosBySkill: armorDecoMap, inventory: params.decoInventory })
      : [];
    if (!armorSolve) return;
    const armorPlacement = placementToCounts(armorSolve)!;

    let wp: Record<string, number> = {};
    if (hasWeaponReq) {
      const provided = pieceWeaponSkillContribution();
      const leftWeapon: Record<string, number> = {};
      for (const s in weaponRequired) {
        const left = weaponRequired[s] - (provided[s] ?? 0);
        if (left > 0) leftWeapon[s] = left;
      }
      if (Object.keys(leftWeapon).length) {
        const solve = solveDecos({
          slots: params.weaponSlots,
          required: leftWeapon,
          decosBySkill: weaponDecoMap,
          inventory: params.decoInventory,
        });
        if (!solve) return;
        wp = placementToCounts(solve)!;
      }
    }

    const sig =
      assignment.map((p) => (p ? p.name : "-")).join("|") +
      "#" +
      JSON.stringify(armorPlacement) +
      "#" +
      JSON.stringify(wp);
    if (seen.has(sig)) return;
    seen.add(sig);

    let defense = 0;
    const resists: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    for (let i = 0; i <= 4; i++) {
      const p = assignment[i];
      if (p) {
        defense += p.defense;
        for (let r = 0; r < 5; r++) resists[r] += p.resists[r];
      }
    }
    results.push({ parts: [...assignment], armorDecos: armorPlacement, weaponDecos: wp, defense, resists });
  }

  /** prev 是否支配 cand（同部位、每档插槽与需求技能提供均 ≥） */
  function dominatedBy(cand: Piece, prev: Piece): boolean {
    for (let i = 0; i < 3; i++) if (cand.slots[i] > prev.slots[i]) return false;
    for (const s in armorRequired) {
      if ((cand.skills[s] ?? 0) > (prev.skills[s] ?? 0)) return false;
    }
    return true;
  }

  /** DFS 生成器：每处理若干节点 yield 一次，由时间片泵驱动，避免阻塞 UI（复刻原站分批异步） */
  function* dfsGen(part: number): Generator<void> {
    if (cancelled || results.length >= limit) return;
    if (++nodes >= nodeBudget) {
      cancelled = true;
      return;
    }
    if (nodes % NODES_PER_YIELD === 0) {
      cb.onProgress(Math.min(99, Math.floor((results.length / limit) * 100)), [...results]);
      if (cb.shouldCancel()) {
        cancelled = true;
        return;
      }
      yield;
      if (cancelled) return;
    }
    if (part > 5) {
      tryRecord();
      return;
    }
    const d = deficitOf();
    const freeSlots = assignedSlots().length;
    let upper = 0;
    for (let p = part; p <= 5; p++) upper += partMaxCost[p];
    if (upper + freeSlots < d) return;

    // 最低防御 / 耐性的乐观约束：未分配部位按最大值估计
    let optimisticDefense = curDefense;
    for (let p = part; p <= 4; p++) optimisticDefense += partMaxDef[p];
    if (optimisticDefense < params.minDefense) return;
    for (let r = 0; r < 5; r++) {
      if (params.resMins[r] > -100) {
        let optimistic = curResists[r];
        for (let p = part; p <= 4; p++) optimistic += partMaxRes[p][r];
        if (optimistic < params.resMins[r]) return;
      }
    }

    const tried: Piece[] = [];
    for (const cand of byPart[part]) {
      if (cancelled || results.length >= limit) return;
      // 逐候选剪枝：后续候选成本更低，若当前候选已无法补齐差额则整体 break
      const emptyAhead = 6 - part;
      if (cand.cost * emptyAhead + freeSlots < d) break;
      let dup = false;
      for (const prev of tried) {
        if (dominatedBy(cand, prev)) {
          dup = true;
          break;
        }
      }
      if (dup) continue;
      tried.push(cand);

      assignment[part] = cand;
      for (const s in cand.skills) curSkills[s] = (curSkills[s] ?? 0) + cand.skills[s];
      curDefense += cand.defense;
      for (let r = 0; r < 5; r++) curResists[r] += cand.resists[r];

      // 局部可行性：该部位装配后仍需满足乐观约束
      let ok = true;
      if (part <= 4) {
        let od = curDefense;
        for (let p = part + 1; p <= 4; p++) od += partMaxDef[p];
        if (od < params.minDefense) ok = false;
        if (ok) {
          for (let r = 0; r < 5; r++) {
            if (params.resMins[r] > -100) {
              let o = curResists[r];
              for (let p = part + 1; p <= 4; p++) o += partMaxRes[p][r];
              if (o < params.resMins[r]) {
                ok = false;
                break;
              }
            }
          }
        }
      }
      if (ok) {
        tryRecord();
        if (results.length < limit) yield* dfsGen(part + 1);
      }

      for (const s in cand.skills) {
        curSkills[s] = (curSkills[s] ?? 0) - cand.skills[s];
        if (curSkills[s] <= 0) delete curSkills[s];
      }
      curDefense -= cand.defense;
      for (let r = 0; r < 5; r++) curResists[r] -= cand.resists[r];
      assignment[part] = null;
      if (cancelled) return;
    }
  }

  cb.onProgress(0, []);
  const it = dfsGen(0);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    results.sort((a, b) => b.defense - a.defense);
    cb.onProgress(100, results);
    cb.onDone?.();
  };
  const pump = () => {
    if (cancelled) {
      finish();
      return;
    }
    const start = Date.now();
    let r = it.next();
    while (!r.done && Date.now() - start < 40) r = it.next();
    if (r.done) finish();
    else setTimeout(pump, 0);
  };
  pump();
}

/**
 * 追加技能检索 —— 复刻原站 Gh：
 * 对每个未达上限的技能，将需求 +1 后跑一次上限为 1 的搜索，有解即为可追加。
 */
export function extraSearch(
  params: SearchParams,
  maxLevels: Map<string, number>,
  cb: { onProgress: (pct: number, addable: string[]) => void; shouldCancel: () => boolean; onDone?: () => void },
): void {
  const candidates: string[] = [];
  for (const [s, lv] of maxLevels) {
    const req = params.armorSkills[s] ?? params.weaponSkills[s] ?? 0;
    if (lv > req) candidates.push(s);
  }
  candidates.sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  const addable: string[] = [];
  let done = 0;
  const step = () => {
    if (cb.shouldCancel() || done >= candidates.length) {
      cb.onProgress(100, addable);
      return;
    }
    const batchEnd = Math.min(candidates.length, done + 4);
    const runBatch = () => {
      if (cb.shouldCancel() || done >= batchEnd) {
        cb.onProgress(Math.floor((done / Math.max(1, candidates.length)) * 100), [...addable]);
        if (done < candidates.length && !cb.shouldCancel()) setTimeout(step, 0);
        else cb.onProgress(100, addable);
        return;
      }
      const skill = candidates[done];
      const test: SearchParams = {
        ...params,
        armorSkills:
          params.armorSkills[skill] !== undefined
            ? { ...params.armorSkills, [skill]: params.armorSkills[skill] + 1 }
            : { ...params.armorSkills, [skill]: 1 },
        limit: 1,
      };
      let found = false;
      search(test, {
        onProgress: (_p, rs) => {
          if (rs.length > 0) found = true;
        },
        shouldCancel: () => cb.shouldCancel(),
        onDone: () => {
          if (found) addable.push(skill);
          done++;
          setTimeout(runBatch, 0);
        },
      });
    };
    runBatch();
  };
  setTimeout(step, 0);
}

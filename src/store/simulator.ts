import { create } from "zustand";
import type { Piece, SearchParams, SearchResult } from "../types";
import { PART_CHARM } from "../types";
import { ARMORS, builtinCharms, maxLevelOf } from "../lib/model";
import { extraSearch, search } from "../lib/engine";
import { decodeHash, encodeHash } from "../lib/share";
import { charmFingerprint } from "../lib/talismanImport";

/** 用户自定义护石（localStorage 持久化，键名对齐原站风格） */
const CHARM_KEY = "mhwilds-zh-hans-charms-v1";
const MYSET_KEY = "mhwilds-zh-hans-myset-v1";

export interface CharmInput {
  id: number;
  name: string;
  skills: Record<string, number>;
  slots: number[]; // 防具插槽等级列表（降序）
  /** 武器插槽等级列表（TU2 鉴定护石，降序；常规登记护石无此字段） */
  weaponSlots?: number[];
}

interface MySetEntry {
  id: number;
  name: string;
  parts: string[]; // 部位装备名（空串=无）
  defense: number;
  armorDecos: Record<string, number>;
  weaponDecos: Record<string, number>;
  savedAt: number;
}

export type TabKey = "search" | "myset" | "charm" | "config";

interface SimulatorState {
  tab: TabKey;
  // 搜索条件
  armorSkills: Record<string, number>;
  weaponSkills: Record<string, number>;
  weaponSlots: number[];
  groupSkill: string; // Group Skill 下拉
  seriesSkill: string; // 系列技能下拉
  minDefense: number;
  resMins: [number, number, number, number, number];
  limit: number;
  pins: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, string>>;
  excludes: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, string[]>>;
  decoInventory: Record<string, number>;
  charms: CharmInput[];
  mySets: MySetEntry[];

  // 搜索状态
  searching: boolean;
  progress: number;
  results: SearchResult[];
  extraRunning: boolean;
  extraProgress: number;
  addableSkills: string[];

  // 动作
  setTab: (t: TabKey) => void;
  setSkill: (skill: string, level: number) => void;
  setWeaponSkill: (skill: string, level: number) => void;
  setWeaponSlots: (slots: number[]) => void;
  setGroupSkill: (name: string) => void;
  setSeriesSkill: (name: string) => void;
  setMinDefense: (n: number) => void;
  setResMin: (idx: number, v: number) => void;
  setLimit: (n: number) => void;
  setPin: (part: 0 | 1 | 2 | 3 | 4 | 5, name: string) => void;
  setExcludes: (part: 0 | 1 | 2 | 3 | 4 | 5, names: string[]) => void;
  setDecoCount: (name: string, n: number) => void;
  resetDecoCounts: (n: Record<string, number>) => void;
  addCharm: (c: Omit<CharmInput, "id">) => void;
  /** 批量导入护石；dedupe 时按内容指纹跳过与现有/批内重复的条目，返回 {added, duplicate} */
  importCharms: (items: Omit<CharmInput, "id">[], dedupe: boolean) => { added: number; duplicate: number };
  removeCharm: (id: number) => void;
  clearCharms: () => void;
  saveMySet: (r: SearchResult) => void;
  removeMySet: (id: number) => void;
  reset: () => void;
  runSearch: () => void;
  cancelSearch: () => void;
  runExtraSearch: () => void;
  cancelExtraSearch: () => void;
  loadFromHash: () => boolean;
}

let searchToken = 0;
let extraToken = 0;
let charmIdSeq = 1;
let mySetIdSeq = 1;

function loadCharms(): CharmInput[] {
  try {
    const raw = localStorage.getItem(CHARM_KEY);
    if (raw) return JSON.parse(raw) as CharmInput[];
  } catch {
    /* ignore */
  }
  return [];
}

function loadMySets(): MySetEntry[] {
  try {
    const raw = localStorage.getItem(MYSET_KEY);
    if (raw) return JSON.parse(raw) as MySetEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

function persistCharms(charms: CharmInput[]): void {
  try {
    localStorage.setItem(CHARM_KEY, JSON.stringify(charms));
  } catch {
    /* ignore */
  }
}

function persistMySets(sets: MySetEntry[]): void {
  try {
    localStorage.setItem(MYSET_KEY, JSON.stringify(sets));
  } catch {
    /* ignore */
  }
}

/** 内置护石 → 护石输入（登录护石表与自定义护石合并参与搜索） */
function builtinCharmInputs(): CharmInput[] {
  return builtinCharms().map((a) => ({
    id: 0,
    name: a.name,
    skills: a.skills,
    slots: a.slots.filter((s) => s > 0),
  }));
}

function charmToPiece(c: CharmInput): Piece {
  const slots = [c.slots[0] ?? 0, c.slots[1] ?? 0, c.slots[2] ?? 0];
  const weaponSlots = c.weaponSlots?.filter((s) => s > 0) ?? [];
  return {
    name: c.name,
    part: PART_CHARM,
    slots: [slots[0], slots[1], slots[2]],
    skills: c.skills,
    defense: 0,
    resists: [0, 0, 0, 0, 0],
    cost: 0,
    slotKey: slots.join("-"),
    ...(weaponSlots.length ? { weaponSlots } : {}),
  };
}

export const useSimulator = create<SimulatorState>((set, get) => ({
  tab: "search",
  armorSkills: {},
  weaponSkills: {},
  weaponSlots: [],
  groupSkill: "",
  seriesSkill: "",
  minDefense: 0,
  resMins: [-100, -100, -100, -100, -100],
  limit: 200,
  pins: {},
  excludes: {},
  decoInventory: {},
  charms: loadCharms(),
  mySets: loadMySets(),

  searching: false,
  progress: 0,
  results: [],
  extraRunning: false,
  extraProgress: 0,
  addableSkills: [],

  setTab: (t) => set({ tab: t }),
  setSkill: (skill, level) =>
    set((s) => {
      const next = { ...s.armorSkills };
      if (level > 0) next[skill] = level;
      else delete next[skill];
      return { armorSkills: next };
    }),
  setWeaponSkill: (skill, level) =>
    set((s) => {
      const next = { ...s.weaponSkills };
      if (level > 0) next[skill] = level;
      else delete next[skill];
      return { weaponSkills: next };
    }),
  setWeaponSlots: (slots) => set({ weaponSlots: slots }),
  setGroupSkill: (name) => set({ groupSkill: name }),
  setSeriesSkill: (name) => set({ seriesSkill: name }),
  setMinDefense: (n) => set({ minDefense: n }),
  setResMin: (idx, v) =>
    set((s) => {
      const next = [...s.resMins] as [number, number, number, number, number];
      next[idx] = v;
      return { resMins: next };
    }),
  setLimit: (n) => set({ limit: n }),
  setPin: (part, name) =>
    set((s) => {
      const next = { ...s.pins };
      if (name) next[part] = name;
      else delete next[part];
      return { pins: next };
    }),
  setExcludes: (part, names) =>
    set((s) => {
      const next = { ...s.excludes };
      if (names.length) next[part] = names;
      else delete next[part];
      return { excludes: next };
    }),
  setDecoCount: (name, n) =>
    set((s) => {
      const next = { ...s.decoInventory };
      if (n > 0) next[name] = n;
      else delete next[name];
      return { decoInventory: next };
    }),
  resetDecoCounts: (n) => set({ decoInventory: { ...n } }),
  addCharm: (c) =>
    set((s) => {
      const charm: CharmInput = { ...c, id: charmIdSeq++ };
      const next = [...s.charms, charm];
      persistCharms(next);
      return { charms: next };
    }),
  importCharms: (items, dedupe) => {
    const seen = new Set<string>();
    if (dedupe) {
      for (const c of get().charms) seen.add(charmFingerprint(c));
    }
    const added: CharmInput[] = [];
    let duplicate = 0;
    for (const item of items) {
      if (dedupe) {
        const fp = charmFingerprint(item);
        if (seen.has(fp)) {
          duplicate++;
          continue;
        }
        seen.add(fp);
      }
      added.push({ ...item, id: charmIdSeq++ });
    }
    if (added.length) {
      set((s) => {
        const next = [...s.charms, ...added];
        persistCharms(next);
        return { charms: next };
      });
    }
    return { added: added.length, duplicate };
  },
  removeCharm: (id) =>
    set((s) => {
      const next = s.charms.filter((c) => c.id !== id);
      persistCharms(next);
      return { charms: next };
    }),
  clearCharms: () =>
    set(() => {
      persistCharms([]);
      return { charms: [] };
    }),
  saveMySet: (r) =>
    set((s) => {
      const entry: MySetEntry = {
        id: mySetIdSeq++,
        name: r.parts.map((p) => p?.name ?? "").filter(Boolean).join(" ") || "未命名套装",
        parts: r.parts.map((p) => p?.name ?? ""),
        defense: r.defense,
        armorDecos: r.armorDecos,
        weaponDecos: r.weaponDecos,
        savedAt: Date.now(),
      };
      const next = [entry, ...s.mySets].slice(0, 100);
      persistMySets(next);
      return { mySets: next };
    }),
  removeMySet: (id) =>
    set((s) => {
      const next = s.mySets.filter((m) => m.id !== id);
      persistMySets(next);
      return { mySets: next };
    }),
  reset: () =>
    set({
      armorSkills: {},
      weaponSkills: {},
      weaponSlots: [],
      groupSkill: "",
      seriesSkill: "",
      minDefense: 0,
      resMins: [-100, -100, -100, -100, -100],
      limit: 200,
      results: [],
      progress: 0,
      searching: false,
    }),

  runSearch: () => {
    const token = ++searchToken;
    const s = get();
    const params: SearchParams = {
      armorSkills: { ...s.armorSkills },
      weaponSkills: { ...s.weaponSkills },
      weaponSlots: s.weaponSlots,
      pins: s.pins,
      excludes: s.excludes,
      charms: [...builtinCharmInputs(), ...s.charms].map(charmToPiece),
      minDefense: s.minDefense,
      resMins: s.resMins,
      limit: s.limit,
      decoInventory: s.decoInventory,
    };
    if (s.groupSkill) params.armorSkills[s.groupSkill] = Math.max(params.armorSkills[s.groupSkill] ?? 0, 1);
    if (s.seriesSkill) params.armorSkills[s.seriesSkill] = Math.max(params.armorSkills[s.seriesSkill] ?? 0, 1);
    set({ searching: true, progress: 0, results: [] });
    // 同步写入 hash（与原站一致，搜索后可分享）
    const hash = encodeHash(params);
    history.replaceState(null, "", `#${hash}`);
    setTimeout(() => {
      search(params, {
        onProgress: (pct, rs) => {
          if (searchToken === token) set({ progress: pct, results: rs });
        },
        shouldCancel: () => searchToken !== token,
        onDone: () => {
          if (searchToken === token) set({ searching: false, progress: 100 });
        },
      });
    }, 30);
  },
  cancelSearch: () => {
    ++searchToken;
    set({ searching: false });
  },
  runExtraSearch: () => {
    const token = ++extraToken;
    const s = get();
    const maxLevels = new Map<string, number>();
    for (const a of ARMORS) for (const sk in a.skills) maxLevels.set(sk, Math.max(maxLevels.get(sk) ?? 0, a.skills[sk]));
    const params: SearchParams = {
      armorSkills: { ...s.armorSkills },
      weaponSkills: { ...s.weaponSkills },
      weaponSlots: s.weaponSlots,
      pins: s.pins,
      excludes: s.excludes,
      charms: [...builtinCharmInputs(), ...s.charms].map(charmToPiece),
      minDefense: s.minDefense,
      resMins: s.resMins,
      limit: 1,
      decoInventory: s.decoInventory,
      nodeBudget: 300_000,
    };
    set({ extraRunning: true, extraProgress: 0, addableSkills: [] });
    setTimeout(() => {
      extraSearch(params, maxLevels, {
        onProgress: (pct, addable) => {
          if (extraToken === token) set({ extraProgress: pct, addableSkills: addable });
        },
        shouldCancel: () => extraToken !== token,
        onDone: () => {
          if (extraToken === token) set({ extraRunning: false, extraProgress: 100 });
        },
      });
    }, 30);
  },
  cancelExtraSearch: () => {
    ++extraToken;
    set({ extraRunning: false });
  },
  loadFromHash: () => {
    const q = decodeHash(window.location.hash);
    if (!q) return false;
    set({
      armorSkills: q.armorSkills,
      weaponSkills: q.weaponSkills,
      weaponSlots: q.weaponSlots,
      minDefense: q.minDefense,
      resMins: q.resMins,
      limit: q.limit,
    });
    return true;
  },
}));

/** 追加技能候选用：技能最大等级表 */
export function skillMaxLevels(): Map<string, number> {
  const m = new Map<string, number>();
  for (const a of ARMORS) for (const s in a.skills) m.set(s, Math.max(m.get(s) ?? 0, a.skills[s]));
  return m;
}

export function maxLevelOfSkill(skill: string): number {
  return maxLevelOf(skill);
}

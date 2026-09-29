import { useMemo } from "react";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { builtinCharms, GROUP_SKILL_NAMES, SERIES_SKILL_NAMES } from "../lib/model";
import SkillPicker from "./SkillPicker";
import ResultTable from "./ResultTable";

/** 武器插槽模式（复刻原站 Y.i()：a≥b≥c、a≤3 的全部组合） */
const WEAPON_PATTERNS: number[][] = (() => {
  const out: number[][] = [[]];
  for (let a = 3; a >= 1; a--) {
    for (let b = a; b >= 0; b--) {
      for (let c = b; c >= 0; c--) out.push([a, b, c]);
    }
  }
  return out;
})();

function labelOf(pattern: number[]): string {
  const nz = pattern.filter((x) => x > 0);
  return nz.length ? `武器插槽LV${nz.join("-")}` : "武器插槽无";
}

const RES_ITEMS = ["火耐性", "水耐性", "雷耐性", "冰耐性", "龙耐性"];
const RES_VALUES: number[] = Array.from({ length: 51 }, (_, i) => i - 25);

export default function SearchTab() {
  const s = useSimulator();
  const charmNames = useMemo(
    () => [...builtinCharms().map((a) => a.name), ...s.charms.map((c) => c.name)],
    [s.charms],
  );

  return (
    <div>
      {/* 武器与系列技能 */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1 text-sm">
          <select
            className="h-8 rounded border border-slate-300 bg-white px-2 text-sm"
            value={s.weaponSlots.join("-")}
            onChange={(e) => s.setWeaponSlots(e.target.value ? e.target.value.split("-").map(Number) : [])}
          >
            {WEAPON_PATTERNS.map((p, i) => (
              <option key={i} value={p.join("-")}>
                {labelOf(p)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm">
          <span className="text-slate-500">Group Skill</span>
          <select
            className="h-8 rounded border border-slate-300 bg-white px-2 text-sm"
            value={s.groupSkill}
            onChange={(e) => s.setGroupSkill(e.target.value)}
          >
            <option value="">No group skill</option>
            {GROUP_SKILLS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 text-sm">
          <span className="text-slate-500">系列技能</span>
          <select
            className="h-8 rounded border border-slate-300 bg-white px-2 text-sm"
            value={s.seriesSkill}
            onChange={(e) => s.setSeriesSkill(e.target.value)}
          >
            <option value="">无</option>
            {SERIES_SKILLS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 数值条件 */}
      <div className="mt-3 flex flex-wrap items-center gap-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
        <label className="flex items-center gap-1">
          <span className="text-slate-600">结果数</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={s.limit}
            onChange={(e) => s.setLimit(Math.max(1, Number(e.target.value) || 200))}
            className="h-8 w-20 rounded border border-slate-300 px-2"
          />
        </label>
        <label className="flex items-center gap-1">
          <span className="text-slate-600">最低防御力</span>
          <input
            type="number"
            min={0}
            value={s.minDefense}
            onChange={(e) => s.setMinDefense(Math.max(0, Number(e.target.value) || 0))}
            className="h-8 w-20 rounded border border-slate-300 px-2"
          />
        </label>
        {RES_ITEMS.map((label, i) => (
          <label key={label} className="flex items-center gap-1">
            <span className="text-slate-600">{label}</span>
            <select
              className="h-8 rounded border border-slate-300 bg-white px-1 text-sm"
              value={s.resMins[i]}
              onChange={(e) => s.setResMin(i, Number(e.target.value))}
            >
              <option value={-100}>--</option>
              {RES_VALUES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* 技能选择 */}
      <div className="mt-4">
        <SkillPicker />
      </div>

      {/* 操作按钮 */}
      <div className="sticky bottom-0 mt-4 flex items-center gap-3 border-t border-slate-200 bg-white/95 py-3 backdrop-blur">
        <button
          className="inline-flex items-center gap-1.5 rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          disabled={s.searching}
          onClick={s.runSearch}
        >
          {s.searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} 搜索
        </button>
        <button
          className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
          disabled={s.searching}
          onClick={s.reset}
        >
          <RotateCcw size={15} /> 重置
        </button>
        <span className="text-xs text-slate-400">
          已登记护石 {charmNames.length} 个（内置 + 自定义）
        </span>
      </div>

      <ResultTable />
    </div>
  );
}

const GROUP_SKILLS = GROUP_SKILL_NAMES;
const SERIES_SKILLS = SERIES_SKILL_NAMES;

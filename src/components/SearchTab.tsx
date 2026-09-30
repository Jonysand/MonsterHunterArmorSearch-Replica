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
    <div className="flex flex-col gap-3">
      {/* 武器与系列技能 + 数值条件 */}
      <section className="card">
        <header>
          <span className="ttl">搜索条件</span>
          <span className="hd-note">武器插槽 / 系列技能与数值门槛</span>
        </header>
        <div className="pad flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="field">
              <span className="flabel">武器插槽</span>
              <select
                className="select"
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
            <label className="field">
              <span className="flabel">Group Skill</span>
              <select
                className="select"
                value={s.groupSkill}
                onChange={(e) => s.setGroupSkill(e.target.value)}
              >
                <option value="">无</option>
                {GROUP_SKILLS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="flabel">系列技能</span>
              <select
                className="select"
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

          <div className="subbox flex flex-wrap items-center gap-x-4 gap-y-2 p-2.5">
            <label className="field">
              <span className="flabel">结果数</span>
              <input
                type="number"
                min={1}
                max={1000}
                value={s.limit}
                onChange={(e) => s.setLimit(Math.max(1, Number(e.target.value) || 200))}
                className="input w-[72px]"
              />
            </label>
            <label className="field">
              <span className="flabel">最低防御力</span>
              <input
                type="number"
                min={0}
                value={s.minDefense}
                onChange={(e) => s.setMinDefense(Math.max(0, Number(e.target.value) || 0))}
                className="input w-[72px]"
              />
            </label>
            {RES_ITEMS.map((label, i) => (
              <label key={label} className="field">
                <span className="flabel">{label}</span>
                <select
                  className="select w-[74px]"
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
        </div>
      </section>

      {/* 技能选择 */}
      <SkillPicker />

      {/* 操作按钮 */}
      <div className="action-bar">
        <button className="btn primary lg" disabled={s.searching} onClick={s.runSearch}>
          {s.searching ? <Loader2 className="animate-spin" /> : <Search />} 搜索
        </button>
        <button className="btn" disabled={s.searching} onClick={s.reset}>
          <RotateCcw /> 重置
        </button>
        <span className="ml-auto text-[11px] text-[color:var(--w-ink-4)]">
          已登记护石 {charmNames.length} 个（内置 + 自定义）
        </span>
      </div>

      <ResultTable />
    </div>
  );
}

const GROUP_SKILLS = GROUP_SKILL_NAMES;
const SERIES_SKILLS = SERIES_SKILL_NAMES;

import { useMemo } from "react";
import { useSimulator } from "../store/simulator";
import { ARMORS, DECOS } from "../lib/model";
import { PART_LABELS } from "../lib/model";

/** 装备设定（复刻原站"装备的固定·除外"与"装饰品所持数"） */
export default function ConfigTab() {
  const pins = useSimulator((s) => s.pins);
  const excludes = useSimulator((s) => s.excludes);
  const setPin = useSimulator((s) => s.setPin);
  const setExcludes = useSimulator((s) => s.setExcludes);
  const decoInventory = useSimulator((s) => s.decoInventory);
  const setDecoCount = useSimulator((s) => s.setDecoCount);
  const resetDecoCounts = useSimulator((s) => s.resetDecoCounts);

  const armorByPart = useMemo(() => {
    const m: Record<number, typeof ARMORS> = {};
    for (const a of ARMORS) {
      if (a.part > 5) continue;
      (m[a.part] ??= []).push(a);
    }
    for (const k in m) m[k].sort((x, y) => x.name.localeCompare(y.name, "zh-Hans-CN"));
    return m;
  }, []);

  const allDecos = useMemo(() => {
    const single = DECOS.filter((d) => d.kind === "weapon" && Object.keys(d.skills).length === 1);
    const multi = DECOS.filter((d) => d.kind === "weapon" && Object.keys(d.skills).length > 1);
    const armor = DECOS.filter((d) => d.kind === "armor");
    return { multi, single, armor };
  }, []);

  const maxAll = () => {
    const inv: Record<string, number> = {};
    for (const d of DECOS) inv[d.name] = 99;
    resetDecoCounts(inv);
  };
  const zeroAll = () => resetDecoCounts({});

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">装备的固定 · 除外</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PART_LABELS.map((label, part) => (
            <fieldset key={label} className="rounded border border-slate-200 bg-white p-2 text-sm">
              <legend className="px-1 text-xs font-semibold text-slate-500">{label}</legend>
              <label className="mb-1 block">
                <span className="mr-1 text-xs text-slate-500">固定</span>
                <select
                  className="h-7 w-[calc(100%-36px)] rounded border border-slate-300 bg-white px-1"
                  value={pins[part as 0] ?? ""}
                  onChange={(e) => setPin(part as 0, e.target.value)}
                >
                  <option value="">（不固定）</option>
                  {(armorByPart[part] ?? []).map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="max-h-28 overflow-auto rounded border border-slate-100 p-1">
                {(armorByPart[part] ?? []).map((a) => {
                  const list = excludes[part as 0] ?? [];
                  const checked = list.includes(a.name);
                  return (
                    <label key={a.name} className="flex items-center gap-1 py-0.5 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...list, a.name]
                            : list.filter((n) => n !== a.name);
                          setExcludes(part as 0, next);
                        }}
                      />
                      {a.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700">装饰品所持数</h3>
          <button className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50" onClick={maxAll}>
            全部设为最大
          </button>
          <button className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50" onClick={zeroAll}>
            全部设为 0
          </button>
          <span className="text-xs text-slate-400">留空 = 无限制</span>
        </div>
        {(
          [
            ["复合武器装饰品", allDecos.multi],
            ["武器装饰品", allDecos.single],
            ["防具装饰品", allDecos.armor],
          ] as const
        ).map(([label, list]) => (
          <fieldset key={label} className="mb-3 rounded border border-slate-200 bg-white p-2">
            <legend className="px-1 text-xs font-semibold text-slate-500">
              {label}（{list.length}）
            </legend>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {list.map((d) => (
                <label key={d.name} className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <span className="w-[132px] truncate text-right" title={d.name}>
                    {d.name}
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="∞"
                    className="h-6 w-14 rounded border border-slate-300 px-1"
                    value={decoInventory[d.name] ?? ""}
                    onChange={(e) => setDecoCount(d.name, Number(e.target.value) || 0)}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </section>
    </div>
  );
}

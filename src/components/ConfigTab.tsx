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
    <div className="flex flex-col gap-3">
      <section className="card">
        <header>
          <span className="ttl">装备的固定 · 除外</span>
          <span className="hd-note">每部位至多固定一件；勾选的防具不参与搜索</span>
        </header>
        <div className="pad grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PART_LABELS.map((label, part) => (
            <div key={label} className="subbox p-2.5">
              <div className="group-hd mb-2">{label}</div>
              <label className="mb-1.5 flex items-center gap-1.5">
                <span className="flabel w-8 shrink-0">固定</span>
                <select
                  className="select min-w-0 flex-1"
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
              <div className="max-h-28 overflow-auto rounded-lg border border-[color:var(--w-line)] bg-[rgba(0,0,0,0.35)] p-1.5">
                {(armorByPart[part] ?? []).map((a) => {
                  const list = excludes[part as 0] ?? [];
                  const checked = list.includes(a.name);
                  return (
                    <label key={a.name} className="flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 text-[11px] text-[color:var(--w-ink-2)] hover:bg-[rgba(245,158,11,0.06)]">
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
                      <span className="truncate" title={a.name}>
                        {a.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <header>
          <span className="ttl">装饰品所持数</span>
          <button className="btn sm" onClick={maxAll}>
            全部设为最大
          </button>
          <button className="btn sm" onClick={zeroAll}>
            全部设为 0
          </button>
          <span className="hd-note">留空 = 无限制</span>
        </header>
        <div className="pad grid items-start gap-3 xl:grid-cols-3">
          {(
            [
              ["复合武器装饰品", allDecos.multi],
              ["武器装饰品", allDecos.single],
              ["防具装饰品", allDecos.armor],
            ] as const
          ).map(([label, list]) => (
            <div key={label} className="subbox p-2.5">
              <div className="group-hd mb-2">
                {label}
                <span className="n">{list.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {list.map((d) => (
                  <label key={d.name} className="flex items-center gap-1.5">
                    <span className="w-[132px] shrink-0 truncate text-right text-[11px] text-[color:var(--w-ink-2)]" title={d.name}>
                      {d.name}
                    </span>
                    <input
                      type="number"
                      min={0}
                      placeholder="∞"
                      className="input tight flex-1"
                      value={decoInventory[d.name] ?? ""}
                      onChange={(e) => setDecoCount(d.name, Number(e.target.value) || 0)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { BookmarkPlus, CircleStop, Loader2 } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { DECO_BY_NAME, PART_LABELS } from "../lib/model";
import type { SearchResult } from "../types";

const RES_LABEL = ["火", "水", "雷", "冰", "龙"];

function decoSummary(counts: Record<string, number>): string {
  return (
    Object.entries(counts)
      .map(([name, n]) => {
        const d = DECO_BY_NAME.get(name);
        const lv = d && !name.includes("【") ? `【${d.slot}】` : "";
        return `${name}${lv}×${n}`;
      })
      .join("、") || "无"
  );
}

function resultSkills(r: SearchResult): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of r.parts) {
    if (!p) continue;
    for (const s in p.skills) out[s] = (out[s] ?? 0) + p.skills[s];
  }
  for (const [name, n] of Object.entries(r.armorDecos)) {
    const d = DECO_BY_NAME.get(name);
    if (d) for (const s in d.skills) out[s] = (out[s] ?? 0) + d.skills[s] * n;
  }
  for (const [name, n] of Object.entries(r.weaponDecos)) {
    const d = DECO_BY_NAME.get(name);
    if (d) for (const s in d.skills) out[s] = (out[s] ?? 0) + d.skills[s] * n;
  }
  return out;
}

export default function ResultTable() {
  const results = useSimulator((s) => s.results);
  const progress = useSimulator((s) => s.progress);
  const searching = useSimulator((s) => s.searching);
  const cancelSearch = useSimulator((s) => s.cancelSearch);
  const saveMySet = useSimulator((s) => s.saveMySet);
  const extraRunning = useSimulator((s) => s.extraRunning);
  const extraProgress = useSimulator((s) => s.extraProgress);
  const addableSkills = useSimulator((s) => s.addableSkills);
  const runExtraSearch = useSimulator((s) => s.runExtraSearch);
  const cancelExtraSearch = useSimulator((s) => s.cancelExtraSearch);

  if (!searching && results.length === 0 && !extraRunning && addableSkills.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {(searching || results.length > 0) && (
        <section className="rounded border border-slate-200 bg-white">
          <header className="flex items-center gap-3 border-b border-slate-200 px-3 py-2">
            <h3 className="text-sm font-semibold text-slate-700">
              搜索结果 <span className="font-normal text-slate-500">{results.length} 件</span>
            </h3>
            {searching && (
              <>
                <div className="h-2 flex-1 overflow-hidden rounded bg-slate-100">
                  <div className="h-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-slate-500">{progress}%</span>
                <button
                  className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                  onClick={cancelSearch}
                >
                  <CircleStop size={14} /> 停止
                </button>
              </>
            )}
          </header>
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="border-b border-slate-200 px-2 py-1.5 text-left">防御</th>
                  {PART_LABELS.map((p) => (
                    <th key={p} className="border-b border-slate-200 px-2 py-1.5 text-left">
                      {p}
                    </th>
                  ))}
                  <th className="border-b border-slate-200 px-2 py-1.5 text-left">防具珠</th>
                  <th className="border-b border-slate-200 px-2 py-1.5 text-left">武器珠</th>
                  <th className="border-b border-slate-200 px-2 py-1.5 text-left">耐性</th>
                  <th className="border-b border-slate-200 px-2 py-1.5 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const achieved = resultSkills(r);
                  const skillText = Object.entries(achieved)
                    .map(([s, lv]) => `${s}Lv${lv}`)
                    .join(" ");
                  return (
                    <tr key={i} title={skillText} className="odd:bg-white even:bg-slate-50/60 hover:bg-amber-50/60">
                      <td className="px-2 py-1.5 font-semibold text-slate-800">{r.defense}</td>
                      {r.parts.map((p, j) => (
                        <td key={j} className="px-2 py-1.5 text-slate-700" title={p ? `防御 ${p.defense}` : undefined}>
                          {p ? p.name : <span className="text-slate-400">无</span>}
                          {p && p.slots.some((x) => x > 0) && (
                            <span className="ml-1 text-xs text-slate-400">
                              [{p.slots.filter((x) => x > 0).join("-")}]
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="max-w-[220px] px-2 py-1.5 text-xs text-slate-600">{decoSummary(r.armorDecos)}</td>
                      <td className="max-w-[220px] px-2 py-1.5 text-xs text-slate-600">{decoSummary(r.weaponDecos)}</td>
                      <td className="px-2 py-1.5 text-xs text-slate-600" title={RES_LABEL.map((l, i) => `${l}${r.resists[i]}`).join(" ")}>
                        {RES_LABEL.map((l, i) => `${l}${r.resists[i] >= 0 ? "+" : ""}${r.resists[i]}`).join(" ")}
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          className="inline-flex items-center gap-1 rounded border border-slate-300 px-1.5 py-0.5 text-xs hover:bg-slate-50"
                          title="保存到我的套装"
                          onClick={() => saveMySet(r)}
                        >
                          <BookmarkPlus size={13} /> 保存
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
            disabled={extraRunning || searching}
            onClick={runExtraSearch}
          >
            {extraRunning ? <Loader2 size={14} className="animate-spin" /> : null} 查询追加技能
          </button>
          {extraRunning && (
            <>
              <div className="h-2 w-40 overflow-hidden rounded bg-slate-100">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${extraProgress}%` }} />
              </div>
              <span className="text-xs text-slate-500">{extraProgress}%</span>
              <button
                className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                onClick={cancelExtraSearch}
              >
                <CircleStop size={14} /> 停止
              </button>
            </>
          )}
        </div>
        {addableSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {addableSkills.map((s) => (
              <span key={s} className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
                {s}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

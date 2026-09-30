import { BookmarkPlus, CircleStop, Loader2, Sparkles } from "lucide-react";
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
    <div className="flex flex-col gap-3">
      {(searching || results.length > 0) && (
        <section className="card">
          <header>
            <span className="ttl">搜索结果</span>
            <span className="cnt">{results.length}</span>
            {searching && (
              <>
                <div className="prog mx-2">
                  <i style={{ width: `${progress}%` }} />
                </div>
                <span className="pct">{progress}%</span>
                <button className="btn sm danger" onClick={cancelSearch}>
                  <CircleStop /> 停止
                </button>
              </>
            )}
          </header>
          <div className="max-h-[560px] overflow-auto rounded-b-xl">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>防御</th>
                  {PART_LABELS.map((p) => (
                    <th key={p}>{p}</th>
                  ))}
                  <th>防具珠</th>
                  <th>武器珠</th>
                  <th>耐性</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const achieved = resultSkills(r);
                  const skillText = Object.entries(achieved)
                    .map(([s, lv]) => `${s}Lv${lv}`)
                    .join(" ");
                  return (
                    <tr key={i} title={skillText}>
                      <td className="num">{r.defense}</td>
                      {r.parts.map((p, j) => (
                        <td key={j} title={p ? `防御 ${p.defense}` : undefined}>
                          {p ? (
                            p.name
                          ) : (
                            <span className="dim">无</span>
                          )}
                          {p && p.slots.some((x) => x > 0) && (
                            <span className="lv-badge ml-1">
                              [{p.slots.filter((x) => x > 0).join("-")}]
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="max-w-[220px] text-[11px] text-[color:var(--w-ink-3)]">{decoSummary(r.armorDecos)}</td>
                      <td className="max-w-[220px] text-[11px] text-[color:var(--w-ink-3)]">{decoSummary(r.weaponDecos)}</td>
                      <td className="text-[11px] text-[color:var(--w-ink-3)]" title={RES_LABEL.map((l, i) => `${l}${r.resists[i]}`).join(" ")}>
                        {RES_LABEL.map((l, i) => `${l}${r.resists[i] >= 0 ? "+" : ""}${r.resists[i]}`).join(" ")}
                      </td>
                      <td>
                        <button className="btn sm" title="保存到我的套装" onClick={() => saveMySet(r)}>
                          <BookmarkPlus /> 保存
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

      <section className="card">
        <header>
          <span className="ttl">追加技能检索</span>
          <span className="hd-note">枚举当前配装下还能追加发动的技能</span>
        </header>
        <div className="pad">
          <div className="flex flex-wrap items-center gap-2.5">
            <button className="btn" disabled={extraRunning || searching} onClick={runExtraSearch}>
              {extraRunning ? <Loader2 className="animate-spin" /> : <Sparkles />} 查询追加技能
            </button>
            {extraRunning && (
              <>
                <div className="prog w-48" style={{ flex: "0 0 180px" }}>
                  <i style={{ width: `${extraProgress}%` }} />
                </div>
                <span className="pct">{extraProgress}%</span>
                <button className="btn sm danger" onClick={cancelExtraSearch}>
                  <CircleStop /> 停止
                </button>
              </>
            )}
          </div>
          {addableSkills.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {addableSkills.map((s) => (
                <span key={s} className="chip green">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

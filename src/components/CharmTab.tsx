import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { builtinCharms, SKILL_GROUPS } from "../lib/model";

/** 护石管理（复刻原站"鉴定护石"页：登记随机获得的护石，与内置护石共同参与搜索） */
export default function CharmTab() {
  const charms = useSimulator((s) => s.charms);
  const addCharm = useSimulator((s) => s.addCharm);
  const removeCharm = useSimulator((s) => s.removeCharm);
  const clearCharms = useSimulator((s) => s.clearCharms);

  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(1);
  const [slots, setSlots] = useState<number[]>([]);
  const [extraSkill, setExtraSkill] = useState("");
  const [extraLevel, setExtraLevel] = useState(1);

  const allSkillNames = useMemo(() => {
    const names = new Set<string>();
    for (const g of SKILL_GROUPS) for (const it of g.skills) names.add(it.skill);
    return [...names].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }, []);

  const builtins = useMemo(() => builtinCharms(), []);

  const submit = () => {
    if (!skill && !extraSkill) return;
    const skills: Record<string, number> = {};
    if (skill) skills[skill] = level;
    if (extraSkill) skills[extraSkill] = extraLevel;
    addCharm({
      name: Object.entries(skills)
        .map(([k, v]) => `${k}Lv${v}`)
        .join(" ") + (slots.length ? `・插槽${slots.join("-")}` : "") || "自定义护石",
      skills,
      slots: [...slots].sort((a, b) => b - a),
    });
    setSkill("");
    setExtraSkill("");
    setLevel(1);
    setExtraLevel(1);
    setSlots([]);
  };

  return (
    <div className="space-y-4">
      <section className="rounded border border-slate-200 bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-slate-700">登记护石</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <select
            className="h-8 rounded border border-slate-300 bg-white px-2"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            <option value="">技能1…</option>
            {allSkillNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={5}
            className="h-8 w-16 rounded border border-slate-300 px-2"
            value={level}
            onChange={(e) => setLevel(Math.max(1, Number(e.target.value) || 1))}
          />
          <select
            className="h-8 rounded border border-slate-300 bg-white px-2"
            value={extraSkill}
            onChange={(e) => setExtraSkill(e.target.value)}
          >
            <option value="">技能2…</option>
            {allSkillNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={5}
            className="h-8 w-16 rounded border border-slate-300 px-2"
            value={extraLevel}
            onChange={(e) => setExtraLevel(Math.max(1, Number(e.target.value) || 1))}
          />
          <span className="text-slate-500">插槽</span>
          {[0, 1, 2].map((i) => (
            <select
              key={i}
              className="h-8 w-16 rounded border border-slate-300 bg-white px-1"
              value={slots[i] ?? 0}
              onChange={(e) => {
                const next = [...slots];
                next[i] = Number(e.target.value);
                setSlots(next);
              }}
            >
              <option value={0}>--</option>
              {[3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  Lv{v}
                </option>
              ))}
            </select>
          ))}
          <button
            className="inline-flex items-center gap-1 rounded bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700"
            onClick={submit}
          >
            <Plus size={14} /> 添加
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            onClick={clearCharms}
          >
            删除全部
          </button>
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white">
        <header className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          已登记护石（{charms.length}）
        </header>
        <table className="w-full text-sm">
          <tbody>
            {charms.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-slate-400">暂无自定义护石</td>
              </tr>
            )}
            {charms.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">{c.name}</td>
                <td className="px-3 py-1.5 text-slate-500">
                  {Object.entries(c.skills)
                    .map(([k, v]) => `${k}Lv${v}`)
                    .join(" ")}
                </td>
                <td className="px-3 py-1.5 text-slate-500">
                  {c.slots.filter((x) => x > 0).length ? `插槽[${c.slots.filter((x) => x > 0).join("-")}]` : "无插槽"}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                    onClick={() => removeCharm(c.id)}
                  >
                    <Trash2 size={13} /> 删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded border border-slate-200 bg-white">
        <header className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          内置护石（任务获得，{builtins.length}）
        </header>
        <div className="flex max-h-64 flex-wrap gap-1.5 overflow-auto p-3">
          {builtins.map((b) => (
            <span key={b.name} className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
              {b.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Gem, Plus, Trash2 } from "lucide-react";
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
    <div className="flex flex-col gap-3">
      <section className="card">
        <header>
          <span className="ttl">登记护石</span>
          <span className="hd-note">登记随机获得的护石，与内置护石共同参与搜索</span>
        </header>
        <div className="pad flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="field">
              <span className="flabel">技能1</span>
              <select className="select min-w-[130px]" value={skill} onChange={(e) => setSkill(e.target.value)}>
                <option value="">（无）</option>
                {allSkillNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="flabel">等级</span>
              <input
                type="number"
                min={1}
                max={5}
                className="input w-[60px]"
                value={level}
                onChange={(e) => setLevel(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <label className="field">
              <span className="flabel">技能2</span>
              <select className="select min-w-[130px]" value={extraSkill} onChange={(e) => setExtraSkill(e.target.value)}>
                <option value="">（无）</option>
                {allSkillNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="flabel">等级</span>
              <input
                type="number"
                min={1}
                max={5}
                className="input w-[60px]"
                value={extraLevel}
                onChange={(e) => setExtraLevel(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
          </div>
          <div className="subbox flex flex-wrap items-center gap-x-4 gap-y-2 p-2.5">
            <span className="flabel">插槽</span>
            {[0, 1, 2].map((i) => (
              <select
                key={i}
                className="select w-[74px]"
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
            <span className="text-[10.5px] text-[color:var(--w-ink-4)]">按 Lv3 ≥ Lv2 ≥ Lv1 顺序填写</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn primary" onClick={submit}>
              <Plus /> 添加护石
            </button>
            <button className="btn danger" disabled={charms.length === 0} onClick={clearCharms}>
              <Trash2 /> 删除全部
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <header>
          <span className="ttl">已登记护石</span>
          <span className="cnt">{charms.length}</span>
        </header>
        <div className="max-h-[360px] overflow-auto">
          <table className="sim-table">
            <thead>
              <tr>
                <th>护石</th>
                <th>技能</th>
                <th>插槽</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {charms.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-hint compact">
                      <Gem />
                      <div>暂无自定义护石，在上方登记后参与搜索</div>
                    </div>
                  </td>
                </tr>
              )}
              {charms.map((c) => (
                <tr key={c.id}>
                  <td className="font-bold text-[color:#f5f5f5]">{c.name}</td>
                  <td className="text-[11.5px] text-[color:var(--w-ink-3)]">
                    {Object.entries(c.skills)
                      .map(([k, v]) => `${k}Lv${v}`)
                      .join(" ")}
                  </td>
                  <td className="text-[11.5px] text-[color:var(--w-ink-3)]">
                    {c.slots.filter((x) => x > 0).length ? `插槽[${c.slots.filter((x) => x > 0).join("-")}]` : "无插槽"}
                  </td>
                  <td className="text-right">
                    <button className="btn sm danger" onClick={() => removeCharm(c.id)}>
                      <Trash2 /> 删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <header>
          <span className="ttl">内置护石</span>
          <span className="cnt">{builtins.length}</span>
          <span className="hd-note">任务获得，直接参与搜索</span>
        </header>
        <div className="pad flex max-h-64 flex-wrap gap-1.5 overflow-auto">
          {builtins.map((b) => (
            <span key={b.name} className="chip">
              {b.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

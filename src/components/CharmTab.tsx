import { useMemo, useState, type ChangeEvent } from "react";
import { Gem, Plus, Trash2, Upload } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { builtinCharms, SKILL_GROUPS } from "../lib/model";
import { parseTalismanText } from "../lib/talismanImport";
import type { ImportReport } from "../lib/talismanImport";

/** 护石管理（复刻原站"鉴定护石"页：登记随机获得的护石，与内置护石共同参与搜索） */
export default function CharmTab() {
  const charms = useSimulator((s) => s.charms);
  const addCharm = useSimulator((s) => s.addCharm);
  const importCharms = useSimulator((s) => s.importCharms);
  const removeCharm = useSimulator((s) => s.removeCharm);
  const clearCharms = useSimulator((s) => s.clearCharms);

  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState(1);
  const [slots, setSlots] = useState<number[]>([]);
  const [extraSkill, setExtraSkill] = useState("");
  const [extraLevel, setExtraLevel] = useState(1);

  const [importText, setImportText] = useState("");
  const [dedupe, setDedupe] = useState(true);
  const [report, setReport] = useState<ImportReport | null>(null);

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

  const doImport = () => {
    if (!importText.trim()) return;
    const parsed = parseTalismanText(importText);
    const { added, duplicate } = importCharms(parsed.charms, dedupe);
    setReport({
      added,
      duplicate,
      skipped: parsed.skipped,
      failed: parsed.errors.length,
      errorPreview: parsed.errors.slice(0, 8),
      errorTotal: parsed.errors.length,
    });
    if (added > 0) setImportText("");
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) f.text().then((t) => setImportText(t));
    e.target.value = "";
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
          <span className="ttl">批量导入</span>
          <span className="hd-note">支持 REFramework「Talisman Exporter」导出文件与原站护石复制粘贴格式</span>
        </header>
        <div className="pad flex flex-col gap-3">
          <div className="text-[11px] leading-relaxed text-[color:var(--w-ink-3)]">
            在游戏内按 Insert 打开 REFramework 菜单导出（文件位于
            <code className="mx-1 rounded bg-black/30 px-1 py-0.5 text-[10.5px] text-[color:var(--w-accent)]">
              reframework\data\Talisman_Exporter\Exported_Talismans.txt
            </code>
            ），把文件内容粘贴到下方或直接选择文件；每行一个护石，英文技能名自动翻译为中文。
          </div>
          <textarea
            className="input h-36 resize-y font-mono text-[11px] leading-5"
            placeholder={"Offensive Guard,1,Heroics,2,Peak Performance,1,2,1,0,0,0,0\nPunishing Draw,3,Foray,1,,0,2,0,0,0,0,0\n…"}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="btn relative cursor-pointer">
              <Upload /> 选择文件
              <input type="file" accept=".txt,.csv,text/plain" className="hidden" onChange={onFile} />
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-[color:var(--w-ink-3)]">
              <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} />
              跳过重复护石
            </label>
            <div className="flex-1" />
            <button className="btn primary" disabled={!importText.trim()} onClick={doImport}>
              <Plus /> 导入
            </button>
          </div>
          {report && (
            <div className="subbox p-2.5 text-[11.5px] leading-relaxed">
              <span className="text-[color:var(--w-accent)]">成功导入 {report.added} 个护石</span>
              {report.duplicate > 0 && <span className="ml-3 text-[color:var(--w-ink-3)]">跳过重复 {report.duplicate} 个</span>}
              {report.skipped > 0 && <span className="ml-3 text-[color:var(--w-ink-3)]">忽略空行 {report.skipped} 行</span>}
              {report.failed > 0 && (
                <div className="mt-1.5 text-[color:#e08a6d]">
                  {report.failed} 行解析失败（共 {report.errorTotal} 处）：
                  <ul className="mt-0.5 list-inside list-disc">
                    {report.errorPreview.map((e, i) => (
                      <li key={i}>
                        第 {e.line} 行：{e.reason}
                      </li>
                    ))}
                    {report.errorTotal > report.errorPreview.length && <li>…其余 {report.errorTotal - report.errorPreview.length} 处略</li>}
                  </ul>
                </div>
              )}
            </div>
          )}
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
                <th>武器槽</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {charms.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-hint compact">
                      <Gem />
                      <div>暂无自定义护石，在上方登记或批量导入后参与搜索</div>
                    </div>
                  </td>
                </tr>
              )}
              {charms.map((c) => {
                const wslots = (c.weaponSlots ?? []).filter((x) => x > 0);
                return (
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
                    <td className="text-[11.5px] text-[color:var(--w-ink-3)]">{wslots.length ? `武槽[${wslots.join("-")}]` : "--"}</td>
                    <td className="text-right">
                      <button className="btn sm danger" onClick={() => removeCharm(c.id)}>
                        <Trash2 /> 删除
                      </button>
                    </td>
                  </tr>
                );
              })}
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

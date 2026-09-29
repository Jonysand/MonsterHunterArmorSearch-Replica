import { Trash2 } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { DECO_BY_NAME } from "../lib/model";
import { PART_LABELS } from "../lib/model";

/** 我的套装（保存的搜索结果） */
export default function MySetTab() {
  const mySets = useSimulator((s) => s.mySets);
  const removeMySet = useSimulator((s) => s.removeMySet);

  if (mySets.length === 0) {
    return <div className="rounded border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">暂无保存的套装，在搜索结果中点击“保存”即可加入。</div>;
  }

  return (
    <div className="space-y-3">
      {mySets.map((m) => (
        <section key={m.id} className="rounded border border-slate-200 bg-white p-3">
          <header className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              {m.name}
              <span className="ml-2 font-normal text-slate-500">防御 {m.defense}</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{new Date(m.savedAt).toLocaleString()}</span>
              <button
                className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                onClick={() => removeMySet(m.id)}
              >
                <Trash2 size={13} /> 删除
              </button>
            </div>
          </header>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:grid-cols-3">
            {m.parts.map((name, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-8 shrink-0 text-xs text-slate-400">{PART_LABELS[i]}</span>
                <span className="text-slate-700">{name || "无"}</span>
              </div>
            ))}
          </div>
          {(Object.keys(m.armorDecos).length > 0 || Object.keys(m.weaponDecos).length > 0) && (
            <div className="mt-2 text-xs text-slate-600">
            防具珠：
            {Object.entries(m.armorDecos)
              .map(([n, c]) => `${n}${DECO_BY_NAME.get(n) && !n.includes("【") ? `【${DECO_BY_NAME.get(n)!.slot}】` : ""}×${c}`)
              .join("、") || "无"}
            　武器珠：
            {Object.entries(m.weaponDecos)
              .map(([n, c]) => `${n}${DECO_BY_NAME.get(n) && !n.includes("【") ? `【${DECO_BY_NAME.get(n)!.slot}】` : ""}×${c}`)
              .join("、") || "无"}
          </div>
          )}
        </section>
      ))}
    </div>
  );
}

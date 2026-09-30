import { Shirt, Trash2 } from "lucide-react";
import { useSimulator } from "../store/simulator";
import { DECO_BY_NAME, PART_LABELS } from "../lib/model";

/** 我的套装（保存的搜索结果） */
export default function MySetTab() {
  const mySets = useSimulator((s) => s.mySets);
  const removeMySet = useSimulator((s) => s.removeMySet);

  if (mySets.length === 0) {
    return (
      <section className="card">
        <div className="empty-hint">
          <Shirt />
          <div>暂无保存的套装，在搜索结果中点击「保存」即可加入</div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mySets.map((m) => (
        <section key={m.id} className="card">
          <header>
            <span className="ttl" style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "#fafafa" }}>
              {m.name}
            </span>
            <span className="cnt">{m.defense}</span>
            <span className="hd-note">防御</span>
            <span style={{ flex: 1 }} />
            <span className="hd-note">{new Date(m.savedAt).toLocaleString()}</span>
            <button className="btn sm danger" onClick={() => removeMySet(m.id)}>
              <Trash2 /> 删除
            </button>
          </header>
          <div className="pad">
            <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px] md:grid-cols-3">
              {m.parts.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-8 shrink-0 text-[11px] text-[color:var(--w-ink-4)]">{PART_LABELS[i]}</span>
                  <span className="text-[color:#d4d4d4]">{name || <span className="text-[color:var(--w-ink-4)]">无</span>}</span>
                </div>
              ))}
            </div>
            {(Object.keys(m.armorDecos).length > 0 || Object.keys(m.weaponDecos).length > 0) && (
              <div className="mt-2.5 border-t border-[#1c1c1c] pt-2 text-[11px] leading-relaxed text-[color:var(--w-ink-3)]">
                <div>
                  <span className="text-[color:var(--w-ink-4)]">防具珠：</span>
                  {Object.entries(m.armorDecos)
                    .map(([n, c]) => `${n}${DECO_BY_NAME.get(n) && !n.includes("【") ? `【${DECO_BY_NAME.get(n)!.slot}】` : ""}×${c}`)
                    .join("、") || "无"}
                </div>
                <div>
                  <span className="text-[color:var(--w-ink-4)]">武器珠：</span>
                  {Object.entries(m.weaponDecos)
                    .map(([n, c]) => `${n}${DECO_BY_NAME.get(n) && !n.includes("【") ? `【${DECO_BY_NAME.get(n)!.slot}】` : ""}×${c}`)
                    .join("、") || "无"}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

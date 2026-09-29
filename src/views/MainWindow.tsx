import { useEffect } from "react";
import { useSimulator, type TabKey } from "../store/simulator";
import { DATA_VERSION } from "../lib/model";
import SearchTab from "../components/SearchTab";
import MySetTab from "../components/MySetTab";
import CharmTab from "../components/CharmTab";
import ConfigTab from "../components/ConfigTab";

const TABS: { key: TabKey; label: string }[] = [
  { key: "search", label: "搜索" },
  { key: "myset", label: "我的套装" },
  { key: "charm", label: "护石" },
  { key: "config", label: "装备设定" },
];

export function MainWindow() {
  const tab = useSimulator((s) => s.tab);
  const setTab = useSimulator((s) => s.setTab);
  const loadFromHash = useSimulator((s) => s.loadFromHash);
  const runSearch = useSimulator((s) => s.runSearch);

  useEffect(() => {
    // 支持原站分享链接（#skills=...）直接恢复条件
    if (loadFromHash()) runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4">
      <h1 className="mb-1 text-xl font-bold text-slate-800">MH Wilds 技能模拟器</h1>
      <p className="mb-3 text-xs text-slate-400">
        本地复刻版 · 数据版本 {DATA_VERSION} · 支持粘贴原站 mhwilds.wiki-db.com/sim 的分享链接
      </p>

      <nav className="mb-4 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`-mb-px rounded-t border-x border-t px-4 py-1.5 text-sm ${
              tab === t.key
                ? "border-slate-200 bg-white font-medium text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "search" && <SearchTab />}
      {tab === "myset" && <MySetTab />}
      {tab === "charm" && <CharmTab />}
      {tab === "config" && <ConfigTab />}
    </main>
  );
}

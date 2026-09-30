import { useEffect } from "react";
import { Gem, Search, Shirt, SlidersHorizontal } from "lucide-react";
import { useSimulator, type TabKey } from "../store/simulator";
import { DATA_VERSION } from "../lib/model";
import SearchTab from "../components/SearchTab";
import MySetTab from "../components/MySetTab";
import CharmTab from "../components/CharmTab";
import ConfigTab from "../components/ConfigTab";

const TABS: { key: TabKey; label: string; icon: typeof Search }[] = [
  { key: "search", label: "技能搜索", icon: Search },
  { key: "myset", label: "我的套装", icon: Shirt },
  { key: "charm", label: "护石管理", icon: Gem },
  { key: "config", label: "装备设定", icon: SlidersHorizontal },
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
    <div className="sim-scope mx-auto w-full max-w-[1200px] px-5 py-5">
      <header className="page-head">
        <div>
          <h1>MH Wilds 技能模拟器</h1>
          <p className="sub">
            本地复刻版 · 数据版本 <b>{DATA_VERSION}</b> · 支持粘贴原站 <b>mhwilds.wiki-db.com/sim</b> 的分享链接恢复条件并搜索
          </p>
        </div>
      </header>

      <nav className="sim-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              <Icon />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {tab === "search" && <SearchTab />}
      {tab === "myset" && <MySetTab />}
      {tab === "charm" && <CharmTab />}
      {tab === "config" && <ConfigTab />}
    </div>
  );
}

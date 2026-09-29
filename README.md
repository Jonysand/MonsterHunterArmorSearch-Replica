# MH Wilds 技能模拟器（本地复刻版）

对 [mhwilds.wiki-db.com/sim](https://mhwilds.wiki-db.com/sim/)（モンハーワイルド スキルシミュ(泣)）的本地功能复刻，
技术栈与 `D:\VisualStudioProjects\MHDanmuToolsV2` 一致：**Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5 + lucide-react**。

## 运行

```bash
npm install
npm run dev        # 开发（http://localhost:1420）
npm run build      # 生产构建（tsc && vite build）
npm run preview    # 预览构建产物
```

## 功能

- **技能选择**：按分组（任务/道具/战斗/套装技能/Group Skill/武器技能等）选择需发动的技能与等级，数据与原站中文版一致
- **武器插槽**：全部 20 种武器插槽模式；武器系技能（攻击/看破/属性攻击强化等 51 种）通过武器珠补齐
- **搜索**：防具 + 护石组合的分支限界深度搜索，装饰品随时补齐差额；进度条、结果上限（默认 200）、中途停止
- **装饰品求解**：插槽级联桶模型（Lv1 珠可入高级插槽、反之不行），支持复合武器珠、所持数限制
- **条件**：最低防御力、五属性耐性下限、各部位装备固定/除外、装饰品所持数（留空=无限）
- **追加技能检索**：枚举当前配装下还能追加哪些技能（复刻原站"追加スキル検索"）
- **护石管理**：内置护石（任务获得）+ 自定义护石登记，localStorage 持久化
- **我的套装**：搜索结果一键保存
- **分享链接兼容**：可直接粘贴原站的 `#skills=...&s=1&e=1&w=LV3-1-1&d=0&l=200` 格式链接自动恢复条件并搜索；本站搜索后同样生成该格式 hash

## 实现来源（逆向说明）

`research/` 目录保留了完整的分析材料：

- `assets/sim-compiled-zh-hans.es6.js` — 原站 Closure Compiler 编译的 Preact 单文件应用（数据全部内嵌）
- `extract_data.py` / `clean_data.py` — 从 bundle 提取并清洗 5 张数据表（防具 891 含护石、防具珠 69、武器珠 295、技能分组 11 组、Group/系列技能表），生成 `src/data/mhwilds-data.json`
- 运行时生成的 `+` 强化防具变体（插槽等级 +1，上限 Lv3）在 `src/lib/model.ts` 中按原站逻辑重建

核心算法对照（原站 Closure 混淆名 → 本项目）：

| 原站 | 本项目 | 作用 |
| --- | --- | --- |
| `ne.D` 候选构建 | `engine.ts buildCandidates` | 无技能防具按部位+槽位模式合并取防御最高者 |
| `Ne.D` DFS + `hd`/`Ge` 剪枝 | `engine.ts dfsGen` | 分支限界：未分配部位最大成本和 + 空插槽数 ≥ 技能差额 |
| `Mg/Og/Pg` 装饰品求解 | `decoSolver.ts` | 桶级联回溯（Lv1 珠溢出占用高级桶），复合珠支持 |
| `Dh.Ch` → `Ng` 武器珠校验 | `engine.ts tryRecord` | 武器技能只能由武器插槽承担，防具珠不可入 |
| `Gh` 追加技能检索 | `engine.ts extraSearch` | 逐技能 +1 后跑 limit=1 的搜索判可行 |
| `dh`/`fh` hash 序列化 | `lib/share.ts` | 与原站 URL 格式互通 |

## 目录结构

```
src/
├── data/            # 从原站 bundle 提取的游戏数据（mhwilds-data.json）
├── lib/
│   ├── model.ts     # 数据加载、+变体生成、技能索引
│   ├── engine.ts    # 搜索引擎（分支限界 DFS + 时间片调度）
│   ├── decoSolver.ts# 装饰品求解器
│   └── share.ts     # URL hash 编解码（原站格式兼容）
├── store/           # Zustand 状态
├── views/           # 主窗口
└── components/      # 技能选择/结果表/护石/装备设定等
scripts/             # 冒烟测试（tsx scripts/smoke.ts）
research/            # 原站分析与数据提取材料
```

## 已知与原站的差异

- 原站的第二武器（双武器）插槽、复合珠优先放置策略做了简化：单武器插槽模式 + 通用回溯求解
- 结果中"无"部位含义与原站一致：该部位可任意填充（装饰品已补齐技能），表中未列出候补装备名
- 桌面端未包含 Tauri 壳（参考项目 MHDanmuToolsV2 的桌面打包），如需可后续套用其 src-tauri 配置

数据版权归原站 wiki-db.com，本项目仅作本地学习/研究用途。

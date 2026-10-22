# MH Wilds 技能模拟器（本地复刻版）

对 [mhwilds.wiki-db.com/sim](https://mhwilds.wiki-db.com/sim/)（モンハーワイルド スキルシミュ(泣)）的本地功能复刻，
技术栈与 MonsterOrderToolsV2 系列工具一致：**Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5 + lucide-react**。

## 运行

```bash
npm install
npm run dev          # 开发（http://localhost:1420，护石同步 API 随 Vite 自动挂载）
npm run build        # 生产构建（前端 tsc + 服务端 tsc + vite build）
npm run preview      # 预览构建产物（同样挂载同步 API）
npm run sync         # 独立护石同步 API（http://127.0.0.1:1421；静态部署时使用）
npm run smoke        # 引擎冒烟：5 组搜索用例 + 技能核验
npm run test:sync    # 存档解密/解析/同步端到端验证（本机无存档时跳过集成部分）
npm run test:import  # 旧版文本导入验证；缺省读取导出文件，无则以内置样例降级运行
```

## UI 风格（与 MonsterOrderToolsV2 统一）

本项目后续将作为 [MonsterOrderToolsV2](https://github.com/Jonysand/MonsterOrderToolsV2) 的一个 tab 嵌入，
界面与其主窗口（控制台）风格完全统一：

- **配色令牌**：暗色 neutral-950 底 + 琥珀金 accent，`src/App.css` 的 `:root` 与宿主同值（`--w-bg/--w-panel/--w-line/--w-ink*/--amber*`），合并后不冲突
- **字体**：随包内嵌与宿主同源的三套子集字体（`MH Sans SC` 正文 / `MH Serif SC` 标题 / `MH DM Serif` 数字），`font-sans` / `font-serif` 工具类直接可用
- **组件类**：视图根节点统一挂 `.sim-scope` 命名空间（对齐宿主 `.ml-scope` / `.rd-scope` 约定），card / btn(primary·danger·sm) / sim-tabs / input·select(tight) / chip / prog 等组件类与宿主同构
- **嵌入方式**：作为 tab 时把 `MainWindow` 渲染进宿主的滚动内容区即可（根容器 `min-height: 100%`，高度交给宿主），不需要任何样式适配
- **同步 API**：嵌入宿主时需由宿主转发 `/api`，或在构建时设置 `VITE_SYNC_API` 指向本工具的同步服务；其余 UI 无额外依赖

## 功能

- **技能选择**：按分组（任务/道具/战斗/套装技能/Group Skill/武器技能等）选择需发动的技能与等级，数据与原站中文版一致
- **武器插槽**：全部 20 种武器插槽模式；武器系技能（攻击/看破/属性攻击强化等 51 种）通过武器珠补齐
- **搜索**：防具 + 护石组合的分支限界深度搜索，装饰品随时补齐差额；进度条、结果上限（默认 200）、中途停止
- **装饰品求解**：插槽级联桶模型（Lv1 珠可入高级插槽、反之不行），支持复合武器珠、所持数限制
- **条件**：最低防御力、五属性耐性下限、各部位装备固定/除外、装饰品所持数（留空=无限）
- **追加技能检索**：枚举当前配装下还能追加哪些技能（复刻原站"追加スキル検索"）
- **护石管理**：内置护石（任务获得）+ 自定义护石登记 + **从游戏存档直接同步**（无需任何 mod，见下）+ 旧版文本批量导入，localStorage 持久化
- **我的套装**：搜索结果一键保存
- **分享链接兼容**：可直接粘贴原站的 `#skills=...&s=1&e=1&w=LV3-1-1&d=0&l=200` 格式链接自动恢复条件并搜索；本站搜索后同样生成该格式 hash

## 护石数据：从游戏存档直接同步（推荐）

护石管理页会直连本机 Steam 存档，读出当前角色的全部护石。**不需要 REFramework、Talisman Exporter 或任何游戏 mod**，也不需要在游戏里按热键导出。

### 使用

1. 游戏至少手动保存过一次，确保 `Steam/userdata/<账号>/2246340/remote/win64_save/data00XSlot.bin` 存在；同步读取的是**最近一次保存到磁盘**的存档，游戏内新获得的护石请先保存
2. `npm run dev` 启动本工具（同步 API 随 Vite 自动挂载，无需额外进程）
3. 打开「护石管理」→ 点「立即同步」；「存档变化时自动同步」默认开启，之后每次存档更新都会自动导入
4. 面板会显示存档路径、SteamID64、存档时间、护石总数/可导入数；重复护石按内容指纹自动跳过

### 原理（只读）

- 自动定位 Steam 根目录与 `userdata`，也支持 `MHW_SAVE_PATH` / `MHW_STEAM_ID` 环境变量覆盖（多账号或非标准安装时使用）
- 读取 `data00XSlot.bin`：Capcom RE Engine 的 DSSS 容器（Mandarin 加密 + Deflate）
- 按 MH Wilds 的 Mandarin 种子与 Steam `ParseVariant = 2` 解密；解压后是自描述的 RSZ 类流
- 按字段名哈希定位 `_Equip._EquipBox`，读取 `FreeVal0`（189-192 表示护石）与 `BowgunCustomizeId`（3 个技能 `等级 × 1000 + 技能枚举`，第 4 个为插槽打包值）
- 技能枚举 → 中文名映射由 `scripts/generate-skill-id-map.mjs` 从游戏消息表生成到 `server/save/skillIds.ts`
- 同一账号有多个角色槽时，取修改时间最新的 `data00XSlot.bin`

同步服务只监听 `127.0.0.1`，没有写存档接口，不会修改游戏数据，也不会把任何内容上传到网络。

### 独立/静态部署

- `npm run dev` / `npm run preview`：Vite 插件自动挂载 `/api`
- 纯静态部署：另开终端 `npm run sync`（默认 `http://127.0.0.1:1421`），构建时设置 `VITE_SYNC_API=http://127.0.0.1:1421/api`
- 端口 1420 被占用时：`npx vite --port 1423`（同步 API 跟随当前 Vite 端口）

### 故障排查

- **未找到存档**：确认游戏已保存；或设置 `MHW_SAVE_PATH=<Steam 根目录>\userdata\<账号>\2246340\remote\win64_save\data001Slot.bin` 与 `MHW_STEAM_ID=<SteamID64>`
- **解密失败**：常见原因是存档属于其他 Steam 账号，或游戏大版本更新改变了加密参数；可先回退到下面的手动导入
- **只读到部分护石**：以最后修改的角色槽为准；切换角色并保存后会自动重新同步
- **未知技能 ID**：游戏新增技能尚未进入映射表时会跳过对应护石并在页面提示；更新映射后重跑 `npm run test:sync` 即可

### 手动批量导入（备用）

不想让工具读取存档时，仍可在「护石管理 → 批量导入」粘贴/选择文本，格式与 [Talisman Exporter](https://www.nexusmods.com/monsterhunterwilds/mods/3087) 及原站"护石复制粘贴"导出一致。每行 12 个字段：

```
技能1名,技能1级,技能2名,技能2级,技能3名,技能3级, 防具槽×3, 武器槽×3
Offensive Guard,1,Heroics,2,Peak Performance,1,2,1,0,0,0,0
```

- 英文技能名按原站官方 en/zh-hans 语言包逐条对齐自动翻译（`src/lib/skillNameMap.ts`，165 条，由 `research/align-skills.mjs` 生成）；中文技能名直接透传
- 鉴定护石（TU2）的**武器插槽**与武器技能完整支持：武器槽并入武器珠解算槽池
- 内容指纹去重（可关）、逐行错误报告（未知技能名/字段数不足等）、空行跳过

<details>
<summary>旧流程：REFramework + Talisman Exporter（仅作备用，已不再需要）</summary>

1. 安装 [REFramework](https://www.nexusmods.com/monsterhunterwilds/mods/93)：把压缩包内的 `dinput8.dll` 解压到游戏根目录
2. 安装 [Talisman Exporter](https://www.nexusmods.com/monsterhunterwilds/mods/3087)：把 `talisman_exporter.lua` 放入 `MonsterHunterWilds\reframework\autorun\`
3. 启动游戏并加载存档，按 `Insert` 打开 REFramework 菜单导出（或触发手动存档时自动导出）
4. 导出文件位于 `MonsterHunterWilds\reframework\data\Talisman_Exporter\Exported_Talismans.txt`，粘贴到「批量导入」输入框或选择该文件

</details>

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

### 护石存档同步（新增）

存档同步同样是逆向实现的，已用本机真实存档与社区工具逐字节对照验证：

- [MandarinJuice](https://github.com/mi5hmash/MandarinJuice)（MIT）— DSSS/Mandarin 容器、MH Wilds 的 MandarinSeed 与 Steam ParseVariant
- [ree-save-editor](https://github.com/kvasszn/ree-save-editor) — MH Wilds 存档结构、Mandarin 种子、`app.HunterDef.Skill` 枚举与游戏消息表

实现位置：

- `server/save/mandarin.ts` — BigInt 等价实现 2048 位容器运算（模幂/乘法/整除）+ AES-128-OFB；SteamID64 经 `~` 变换后参与解密
- `server/save/rsz.ts` — 自描述 RSZ 类流读取器；字段名哈希即 `MurmurHash3_32(name, 0xffffffff)`，因此无需 RSZ 类型库
- `server/save/talismans.ts` — `_EquipBox` → `FreeVal0` / `BowgunCustomizeId` → 护石（技能、防具槽、武器槽）
- `server/save/discovery.ts` — Steam 根目录、userdata、角色槽发现与游戏进程检测

## 目录结构

```
src/
├── data/            # 从原站 bundle 提取的游戏数据（mhwilds-data.json）
├── lib/
│   ├── model.ts     # 数据加载、+变体生成、技能索引
│   ├── engine.ts    # 搜索引擎（分支限界 DFS + 时间片调度）
│   ├── decoSolver.ts# 装饰品求解器
│   ├── talismanImport.ts # 护石文本导入（Talisman Exporter / 原站格式解析）
│   ├── skillNameMap.ts   # 技能名 en→zh 映射（原站双语包对齐生成）
│   └── share.ts     # URL hash 编解码（原站格式兼容）
├── store/           # Zustand 状态
├── views/           # 主窗口
└── components/      # 技能选择/结果表/护石/装备设定/游戏同步面板等
server/
├── save/
│   ├── mandarin.ts  # DSSS/Mandarin 存档解密 + Deflate 解压
│   ├── rsz.ts       # 自描述 RSZ 类流解析（Murmur3 字段哈希）
│   ├── talismans.ts # EquipBox → 护石（技能/插槽解码）
│   ├── discovery.ts # Steam 存档发现、角色槽选择、游戏进程检测
│   ├── service.ts   # 解析缓存与同步状态
│   └── skillIds.ts  # 技能枚举 → 中文名（脚本生成）
├── syncApi.ts       # /api/game/status、/api/game/talismans
└── standalone.ts    # npm run sync（127.0.0.1:1421）
scripts/             # 冒烟/导入/同步验证 + 技能映射生成脚本
research/            # 原站分析与数据提取材料（align-skills.mjs 生成技能名映射）
```

## 已知与原站的差异

- 原站的第二武器（双武器）插槽、复合珠优先放置策略做了简化：单武器插槽模式 + 通用回溯求解
- 结果中"无"部位含义与原站一致：该部位可任意填充（装饰品已补齐技能），表中未列出候补装备名
- 桌面端未包含 Tauri 壳（参考项目 MHDanmuToolsV2 的桌面打包），如需可后续套用其 src-tauri 配置
- 存档同步是社区逆向实现，不是 Capcom 官方接口；游戏大版本更新可能改变加密种子或字段结构，届时需更新 `server/save/mandarin.ts` / `talismans.ts`，也可先用手动导入
- 同一 Steam 账号有多个角色时，同步以修改时间最新的 `data00XSlot.bin` 为准；不会合并多个角色的护石

数据版权归原站 wiki-db.com，本项目仅作本地学习/研究用途。

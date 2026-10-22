/**
 * 护石同步端到端验证：npm run test:sync
 *
 *  - 单元：Murmur3 字段哈希、技能值/插槽打包解码
 *  - 集成：自动发现本机存档 → Mandarin 解密 → RSZ 类流解析 → 护石提取
 *  - 往返：提取结果转成 Talisman Exporter 文本，再由 parseTalismanText 解析，指纹一致
 *
 * 找不到存档时默认跳过集成部分（退出码 0）；加 `--require-save` 则视为失败。
 */
import { SKILL_GROUPS, WEAPON_SKILLS } from "../src/lib/model";
import { charmFingerprint } from "../src/lib/charmFormat";
import { parseTalismanText } from "../src/lib/talismanImport";
import { discoverSave } from "../server/save/discovery";
import { getSyncedTalismans } from "../server/save/service";
import {
  HASH_BOWGUN_CUSTOMIZE_ID,
  HASH_EQUIP_BOX,
  HASH_FREE_VAL0,
  decodeSkillValue,
  decodeSlotPacking,
} from "../server/save/talismans";
import { murmur3_32 } from "../server/save/rsz";

let failed = 0;
function check(label: string, condition: boolean, detail = ""): void {
  console.log(`${condition ? "✓" : "✗"} ${label}${condition || !detail ? "" : ` — ${detail}`}`);
  if (!condition) failed++;
}

const requireSave = process.argv.includes("--require-save");

// ---- T1: 字段哈希 ----
console.log("=== T1 Murmur3 字段哈希 ===");
check("FreeVal0 hash", HASH_FREE_VAL0 === 0xefccb875, HASH_FREE_VAL0.toString(16));
check("BowgunCustomizeId hash", HASH_BOWGUN_CUSTOMIZE_ID === 0x3fc62d3f, HASH_BOWGUN_CUSTOMIZE_ID.toString(16));
check("_EquipBox hash", HASH_EQUIP_BOX === 0x9f7aad2a, HASH_EQUIP_BOX.toString(16));
check("murmur3_32 与常量一致", murmur3_32("FreeVal0") === 0xefccb875);

// ---- T2: 技能值解码 ----
console.log("\n=== T2 技能值解码 ===");
check("1029 → 等级1/技能29", JSON.stringify(decodeSkillValue(1029)) === JSON.stringify({ level: 1, skillId: 29 }));
check("3163 → 等级3/技能163", JSON.stringify(decodeSkillValue(3163)) === JSON.stringify({ level: 3, skillId: 163 }));
check("7001 → 等级7/技能1", JSON.stringify(decodeSkillValue(7001)) === JSON.stringify({ level: 7, skillId: 1 }));
check("0 / -1 / 8001 → null", decodeSkillValue(0) === null && decodeSkillValue(-1) === null && decodeSkillValue(8001) === null);

// ---- T3: 插槽打包解码 ----
console.log("\n=== T3 插槽打包解码 ===");
const slotCases: [number, number[], number[]][] = [
  [2100, [2, 1, 0], []],
  [2000, [2, 0, 0], []],
  [1100, [1, 1, 0], []],
  [1101, [1, 0, 0], [1]],
  [1111, [1, 1, 0], [1]],
  [1003, [0, 0, 0], [1]],
];
for (const [raw, slots, weaponSlots] of slotCases) {
  const decoded = decodeSlotPacking(raw);
  check(
    `${raw} → 防具[${slots.join(",")}] 武器[${weaponSlots.join(",")}]`,
    decoded !== null &&
      JSON.stringify(decoded.slots) === JSON.stringify(slots) &&
      JSON.stringify(decoded.weaponSlots) === JSON.stringify(weaponSlots),
    JSON.stringify(decoded),
  );
}
check("-1 → null（空占位）", decodeSlotPacking(-1) === null);

// ---- T4: 存档发现 ----
console.log("\n=== T4 存档发现 ===");
const discovery = discoverSave();
console.log(`Steam 根目录：${discovery.steamRoots.join(" | ") || "(未找到)"}`);
if (discovery.save) {
  console.log(`存档：${discovery.save.filePath}`);
  console.log(`账号：${discovery.save.accountId} / SteamID64 ${discovery.save.steamId64}`);
  console.log(`修改时间：${new Date(discovery.save.mtimeMs).toLocaleString()}`);
} else {
  console.log("未找到存档：", discovery.warnings.join("；"));
}
check("游戏进程检测不抛异常", typeof discovery.gameRunning === "boolean");

if (!discovery.save) {
  console.log("\n[i] 未找到 MH Wilds 存档，跳过集成测试。");
  if (requireSave) failed++;
} else {
  // ---- T5: 解密 + 提取 ----
  console.log("\n=== T5 解密 + 护石提取 ===");
  const result = await getSyncedTalismans(true);
  console.log(`状态：ok=${result.ok} characterFound=${result.status.characterFound}`);
  console.log(
    `护石：${result.status.talismanCount ?? 0}（可导入 ${result.talismans.length}） · ` +
      `解析 ${result.status.parseMs ?? 0}ms`,
  );
  if (result.status.warnings?.length) console.log("提示：", result.status.warnings.join("；"));
  check("解密/解析成功", result.ok, result.error ?? JSON.stringify(result.status));
  check("找到角色护石数据", result.status.characterFound === true);
  check("护石数量 > 0", result.talismans.length > 0, String(result.talismans.length));

  const appSkills = new Set([
    ...SKILL_GROUPS.flatMap((group) => group.skills.map((entry) => entry.skill)),
    ...WEAPON_SKILLS,
  ]);
  const badSkill = result.talismans
    .flatMap((talisman) => Object.keys(talisman.skills))
    .find((name) => !appSkills.has(name));
  check("全部技能名均存在于当前数据表", badSkill === undefined, badSkill);

  const badShape = result.talismans.find(
    (talisman) =>
      talisman.slots.length !== 3 ||
      talisman.weaponSlots.length !== 3 ||
      talisman.slots.some((slot) => slot < 0 || slot > 3) ||
      talisman.weaponSlots.some((slot) => slot < 0 || slot > 3),
  );
  check("插槽数组均为 3 位且范围合法", badShape === undefined, JSON.stringify(badShape));

  // ---- T6: 导出文本往返 ----
  console.log("\n=== T6 导出文本往返（提取 → 文本 → 解析） ===");
  const toLine = (talisman: (typeof result.talismans)[number]): string => {
    const entries = Object.entries(talisman.skills);
    const skillFields: string[] = [];
    for (let i = 0; i < 3; i++) {
      const entry = entries[i];
      skillFields.push(entry ? entry[0] : "", entry ? String(entry[1]) : "0");
    }
    return [...skillFields, ...talisman.slots, ...talisman.weaponSlots].join(",");
  };
  const sample = result.talismans;
  const text = sample.map(toLine).join("\n");
  const parsed = parseTalismanText(text);
  const expected = new Set(sample.map((talisman) => charmFingerprint(talisman)));
  const actual = new Set(parsed.charms.map((charm) => charmFingerprint(charm)));
  const identical = expected.size === actual.size && [...expected].every((fingerprint) => actual.has(fingerprint));
  check("全部护石往返指纹一致", identical, `expected=${expected.size} actual=${actual.size} errors=${parsed.errors.length}`);
  if (!identical) {
    const missing = [...expected].filter((fingerprint) => !actual.has(fingerprint)).slice(0, 3);
    console.log("  差异样本：", missing);
    console.log("  解析错误：", parsed.errors.slice(0, 3));
  }
}

console.log(failed ? `\n${failed} 项失败` : "\n全部通过");
process.exit(failed ? 1 : 0);

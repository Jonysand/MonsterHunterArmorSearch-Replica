/**
 * 生成 server/save/skillIds.ts（app.HunterDef.Skill 枚举 → 中文/英文技能名）。
 *
 * 数据来源为 RE Engine 资源提取结果（ree-save-editor 仓库的 assets/mhwilds）：
 *   - enumsmhwilds.json            枚举数值 → 枚举符号名
 *   - enums_mappings_mhwilds.json  枚举符号名 → 消息 GUID
 *   - combined_msgs.json.gz        消息 GUID → 各语言文本（content[13] 为简体中文）
 *
 * 用法：
 *   node scripts/generate-skill-id-map.mjs \
 *     <enumsmhwilds.json> <enums_mappings_mhwilds.json> <combined_msgs.json.gz> [输出路径]
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [enumsPath, mappingsPath, messagesPath, outputArg] = process.argv.slice(2);
if (!enumsPath || !mappingsPath || !messagesPath) {
  console.error(
    "用法：node scripts/generate-skill-id-map.mjs <enumsmhwilds.json> <enums_mappings_mhwilds.json> <combined_msgs.json.gz> [输出路径]",
  );
  process.exit(1);
}

const outputPath = path.resolve(outputArg ?? "server/save/skillIds.ts");
const enums = JSON.parse(fs.readFileSync(enumsPath, "utf8"));
const mappings = JSON.parse(fs.readFileSync(mappingsPath, "utf8"));
const messageFile = messagesPath.endsWith(".gz")
  ? zlib.gunzipSync(fs.readFileSync(messagesPath))
  : fs.readFileSync(messagesPath);
const messages = JSON.parse(messageFile.toString("utf8"));

const skillEnum = enums["app.HunterDef.Skill"];
const skillMappings = mappings["app.HunterDef.Skill"];
if (!skillEnum || !skillMappings) {
  console.error("输入文件中缺少 app.HunterDef.Skill 枚举或其消息映射");
  process.exit(1);
}

/** 去除富文本标签；#Rejected# 条目视为无名称 */
function clean(value) {
  if (!value) return null;
  const text = String(value).replace(/<[^>]*>/g, "").trim();
  return !text || text.includes("#Rejected#") ? null : text;
}

const zh = {};
const en = {};
for (const [idText, symbol] of Object.entries(skillEnum)) {
  const id = Number(idText);
  if (!Number.isInteger(id) || id <= 0) continue;
  const guid = skillMappings[symbol];
  const message = guid ? messages.msgs?.[guid] : undefined;
  const zhName = clean(message?.content?.[13]);
  const enName = clean(message?.content?.[1]);
  if (zhName) zh[id] = zhName;
  if (enName) en[id] = enName;
}

function record(name, values) {
  const ids = Object.keys(values)
    .map(Number)
    .sort((a, b) => a - b);
  let output = `export const ${name}: Readonly<Record<number, string>> = {\n`;
  let line = "  ";
  let column = 0;
  for (const id of ids) {
    const piece = `${id}: ${JSON.stringify(values[id])}, `;
    if (column + piece.length > 110) {
      output += `${line.trimEnd()}\n`;
      line = "  ";
      column = 0;
    }
    line += piece;
    column += piece.length;
  }
  output += `${line.trimEnd()}\n};\n`;
  return output;
}

const content =
  "/**\n" +
  " * 游戏内 app.HunterDef.Skill 枚举 → 技能显示名。\n" +
  " * 简体中文取自游戏消息表 content[13]，英文取自 content[1]。\n" +
  " * 由 scripts/generate-skill-id-map.mjs 生成，请勿手改。\n" +
  " */\n" +
  record("SKILL_ID_TO_ZH", zh) +
  "\n" +
  record("SKILL_ID_TO_EN", en);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);
console.log(
  `写入 ${outputPath}：中文 ${Object.keys(zh).length} 条，英文 ${Object.keys(en).length} 条`,
);

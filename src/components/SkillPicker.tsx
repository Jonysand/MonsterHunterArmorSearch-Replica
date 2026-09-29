import { useMemo } from "react";
import { SKILL_GROUPS, WEAPON_SKILLS } from "../lib/model";
import { useSimulator } from "../store/simulator";

interface SkillSelectProps {
  skill: string;
  maxLevel: number;
  value: number;
  onChange: (lv: number) => void;
}

function SkillSelect({ skill, maxLevel, value, onChange }: SkillSelectProps) {
  return (
    <label className="inline-flex min-w-[108px] flex-1 items-center gap-1 text-sm">
      <span className="w-[84px] shrink-0 truncate text-right text-slate-600" title={skill}>
        {skill}
      </span>
      <select
        className="h-7 min-w-0 flex-1 rounded border border-slate-300 bg-white px-1 text-sm"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>--</option>
        {Array.from({ length: maxLevel }, (_, i) => i + 1).map((lv) => (
          <option key={lv} value={lv}>
            Lv{lv}
          </option>
        ))}
      </select>
    </label>
  );
}

/** 分组技能选择器（复刻原站：按分组展示全部技能的下拉等级选择） */
export default function SkillPicker() {
  const armorSkills = useSimulator((s) => s.armorSkills);
  const weaponSkills = useSimulator((s) => s.weaponSkills);
  const setSkill = useSimulator((s) => s.setSkill);
  const setWeaponSkill = useSimulator((s) => s.setWeaponSkill);

  // 分组内同一技能存在多条等级条目（如 攻击Lv1/Lv2/...），按技能去重取最大等级
  const groups = useMemo(
    () =>
      SKILL_GROUPS.map((g) => {
        const maxBySkill = new Map<string, number>();
        for (const it of g.skills) {
          maxBySkill.set(it.skill, Math.max(maxBySkill.get(it.skill) ?? 0, it.level));
        }
        return { name: g.group, items: [...maxBySkill.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN")) };
      }).filter((g) => g.items.length > 0),
    [],
  );

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <fieldset key={g.name} className="rounded border border-slate-200 bg-slate-50 p-2">
          <legend className="px-1 text-xs font-semibold text-slate-500">{g.name}</legend>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {g.items.map(([skill, maxLevel]) => {
              const isWeapon = WEAPON_SKILLS.has(skill);
              const value = isWeapon ? (weaponSkills[skill] ?? 0) : (armorSkills[skill] ?? 0);
              return (
                <SkillSelect
                  key={skill}
                  skill={skill}
                  maxLevel={maxLevel}
                  value={value}
                  onChange={(lv) => (isWeapon ? setWeaponSkill(skill, lv) : setSkill(skill, lv))}
                />
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

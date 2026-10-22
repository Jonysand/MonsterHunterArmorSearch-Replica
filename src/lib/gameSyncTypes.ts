/** 从游戏存档同步到网页的护石（不含 localStorage id） */
export interface SyncedTalisman {
  name: string;
  skills: Record<string, number>;
  slots: number[];
  /** 武器插槽（TU2 鉴定护石），无则为空数组 */
  weaponSlots: number[];
  /** 游戏内护石类型枚举（189-192），仅用于诊断 */
  amuletType: number;
}

export interface GameSyncStatus {
  ok: boolean;
  /** 同步服务自身是否可用（请求成功即 true） */
  gameRunning: boolean;
  saveFound: boolean;
  characterFound: boolean;
  savePath?: string;
  /** 毫秒时间戳 */
  saveMtimeMs?: number;
  /** SteamID64（十进制字符串） */
  steamId?: string;
  /** EquipBox 中的护石总数（含空占位） */
  talismanCount?: number;
  /** 实际可导入的护石数（技能/插槽非空） */
  nonEmptyTalismanCount?: number;
  /** 解析耗时（毫秒） */
  parseMs?: number;
  /** 同一账号下的其他角色存档 */
  otherSaves?: { path: string; mtimeMs: number }[];
  /** 非致命提示（未知技能 ID 等） */
  warnings?: string[];
  error?: string;
  checkedAt: number;
}

export interface GameSyncResult {
  ok: boolean;
  talismans: SyncedTalisman[];
  status: GameSyncStatus;
  error?: string;
}

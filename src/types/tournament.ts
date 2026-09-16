import { CharacterId } from './game';

export type TournamentSize = 8 | 16;
export type TournamentRoundName = '16強淘汰賽' | '八強淘汰賽' | '四強準決賽' | '季軍爭奪賽' | '總冠軍決賽';

export interface TournamentMatch {
  id: string;
  round: number; // 1 = 16強, 2 = 8強, 3 = 4強, 4 = 決賽
  roundName: TournamentRoundName;
  matchIndex: number;
  p1CharId: CharacterId | null;
  p2CharId: CharacterId | null;
  winnerCharId: CharacterId | null;
  loserCharId: CharacterId | null;
  status: 'pending' | 'ready' | 'in_progress' | 'finished';
  isPlayerMatch: boolean;
  matchTime?: number;
  p1Damage?: number;
  p2Damage?: number;
  summary?: string;
  nextMatchId?: string;
  nextMatchSlot?: 'p1' | 'p2';
}

export interface BeltHistoryEntry {
  tournamentTitle: string;
  date: number;
  daysEarned: number;
  opponentId?: CharacterId | null;
  isDefense: boolean;
  resultType?: 'defense_success' | 'title_won' | 'title_lost';
  defenseNumber?: number; // 第幾次成功衛冕 (1, 2, 3...)
  championshipNumber?: number; // 第幾度王者 (1, 2, 3...)
  matchType?: 'duel' | 'tournament' | 'title_defense';
  note?: string;
}

/**
 * 宿敵交手紀錄 (Champion Rivalry Record)
 * 追蹤冠軍近期面對的最後 3 位對手與交鋒結果
 */
export interface ChampionRivalry {
  opponentId: CharacterId;
  date: number;
  result: 'win' | 'loss';
  defenseNumber?: number;
  matchType?: 'duel' | 'tournament' | 'title_defense';
  tournamentTitle?: string;
  note?: string;
}

/**
 * 冠軍腰帶與榮譽衛冕紀錄 (WWE 摔角冠軍頭銜規則架構)
 */
export interface ChampionBeltRecord {
  characterId: CharacterId;
  reignDays: number;            // 當前已衛冕的「虛擬天數」
  currentReignDefenses: number; // 本屆連續成功衛冕次數 (WWE: Defenses during current reign)
  totalDefenses: number;        // 生涯累計成功衛冕次數 (WWE: Career total title defenses)
  totalChampionships: number;   // 累計奪冠次數 (WWE: X-Time World Champion, 幾度世界冠軍)
  longestReignDays: number;     // 歷史最高單次衛冕天數
  firstCrownedAt: number;       // 首次奪冠時間戳
  lastDefendedAt: number;       // 最近一次成功衛冕/奪冠時間戳
  history: BeltHistoryEntry[];
  // 角色生涯戰績與對抗數據
  totalMatches: number;         // 總戰鬥場次
  wins: number;                 // 勝場次數
  losses: number;               // 敗場次數
  winRate: number;              // 個人勝率 (0 ~ 100%)
  totalBattleDuration: number;  // 累計戰鬥時長 (秒)
  avgBattleDuration: number;    // 平均戰鬥時長 (秒)
  currentWinStreak: number;     // 當前連勝場次
  maxWinStreak: number;         // 歷史最高連勝紀錄
  // 宿敵對決追蹤 (Rivalry Tracking: last 3 opponents faced)
  recentRivals: CharacterId[];  // 最近 3 位對手 (以最新遭遇排序，最多 3 位)
  recentRivalries?: ChampionRivalry[]; // 最近 3 場對手詳細宿敵交鋒資訊
  // 傷害與技能輸出統計 (Damage and Skill Analytics)
  totalDamageDealt?: number;         // 累計輸出總傷害
  totalSkillDamageDealt?: number;    // 累計技能奧義傷害
  totalCollisionDamageDealt?: number;// 累計普攻碰撞傷害
  peakDamageDealt?: number;          // 單場最高輸出傷害
}

/**
 * 最近對戰紀錄項 (Detailed Match History Record)
 */
export interface MatchRecordEntry {
  id: string;
  timestamp: number;
  mode: 'duel' | 'tournament' | 'title_defense';
  winnerCharId: CharacterId;
  loserCharId: CharacterId;
  duration: number; // 秒
  winnerDamage: number;
  loserDamage: number;
  winnerSkillDamage: number;
  winnerCollisionDamage: number;
  loserSkillDamage: number;
  loserCollisionDamage: number;
  tournamentTitle?: string;
  tournamentRound?: string;
  isTitleMatch?: boolean;
}

/**
 * 全局傷害統計 (Comprehensive Damage Analytics)
 */
export interface OverallDamageStats {
  totalDamage: number;
  totalSkillDamage: number;
  totalCollisionDamage: number;
  peakDamageSingleMatch: number;
}

/**
 * 錦標賽累計戰績 (Tournament Career Stats)
 */
export interface TournamentOverallStats {
  tournamentsPlayed: number;
  championshipsWon: number;
  finalsReached: number;
  matchesWon: number;
  matchesTotal: number;
}

/**
 * 對戰結算傳入的戰鬥詳細數據
 */
export interface MatchCombatDetails {
  winnerDamage?: number;
  loserDamage?: number;
  winnerSkillDamage?: number;
  winnerCollisionDamage?: number;
  loserSkillDamage?: number;
  loserCollisionDamage?: number;
  matchType?: 'duel' | 'tournament' | 'title_defense';
  tournamentTitle?: string;
  tournamentRound?: string;
  isTitleMatch?: boolean;
}

export interface TournamentBeltState {
  currentHolderId: CharacterId | null; // 當前金腰帶持有者 (null = 空缺王座)
  currentReignDays: number;            // 當前持有者的衛冕天數
  currentReignDefenses: number;        // 當前持有者本次統治的連續衛冕次數
  records: Record<CharacterId, ChampionBeltRecord>; // 各英雄金腰帶歷史庫
  recentMatches?: MatchRecordEntry[];  // 最近對戰紀錄列表 (最新排在最前)
  overallDamage?: OverallDamageStats;  // 全局傷害統計與技能/普攻比例
  tournamentStats?: TournamentOverallStats; // 錦標賽累計成績
  lastReignIncrease: {
    characterId: CharacterId;
    daysAdded: number;
    totalDays: number;
    isConsecutiveDefense: boolean;
    defenseNumber?: number;
    resultType?: 'defense_success' | 'title_won' | 'title_lost';
    previousHolderId?: CharacterId | null;
    opponentId?: CharacterId | null;
    matchType?: 'duel' | 'tournament' | 'title_defense';
    wweAnnouncement?: string;
    wweHeadline?: string;
    isUpset?: boolean;
    timestamp: number;
  } | null;
}

export interface TournamentState {
  id: string;
  size: TournamentSize;
  title: string;
  playerCharId: CharacterId | null; // null = 觀戰模式 (Spectator)
  playerControl: 'manual' | 'auto';
  currentMatchId: string | null;
  matches: TournamentMatch[];
  championId: CharacterId | null;
  runnerUpId: CharacterId | null;
  stage: 'bracket' | 'fighting' | 'champion';
  createdAt: number;
  roster: CharacterId[];
  isTitleTournament?: boolean; // 是否為金腰帶頭銜爭奪賽/加冕盃賽 (true = 冠軍加冕/衛冕賽, false = 無頭銜盃賽)
}

/**
 * 淘汰賽自動接續下一局設定 (3 ~ 10 秒倒數)
 */
export interface AutoNextMatchConfig {
  enabled: boolean;
  seconds: number; // 3 ~ 10 秒
  action: 'enter' | 'simulate'; // 'enter' = 進入擂台對抗, 'simulate' = 快速模擬推進
}

import { CharacterId } from '../types/game';
import {
  TournamentMatch,
  TournamentBeltState,
  ChampionBeltRecord,
  BeltHistoryEntry,
  ChampionRivalry,
  MatchRecordEntry,
  OverallDamageStats,
  TournamentOverallStats,
  MatchCombatDetails
} from '../types/tournament';
import { ALL_CHAR_IDS } from './tournamentManager';
import { CHARACTERS } from '../data/characters';

const STORAGE_KEY = 'arena_champion_belt_v6_wwe';
const PREVIOUS_STORAGE_KEYS = [
  'arena_champion_belt_v1',
  'arena_champion_belt_v2',
  'arena_champion_belt_v3',
  'arena_champion_belt_v4',
  'arena_champion_belt_v5_clean'
];

/**
 * Record or update recent rivalries for a champion, keeping strictly the last 3 opponents faced.
 */
export function recordChampionRival(
  record: ChampionBeltRecord,
  opponentId: CharacterId,
  result: 'win' | 'loss',
  defenseNumber?: number,
  matchType?: 'duel' | 'tournament' | 'title_defense',
  tournamentTitle?: string,
  note?: string
): { recentRivals: CharacterId[]; recentRivalries: ChampionRivalry[] } {
  const rivalry: ChampionRivalry = {
    opponentId,
    date: Date.now(),
    result,
    defenseNumber,
    matchType,
    tournamentTitle,
    note
  };

  const prevRivals = Array.isArray(record.recentRivals) ? record.recentRivals : [];
  const nextRivals = [opponentId, ...prevRivals].slice(0, 3);

  const prevRivalries = Array.isArray(record.recentRivalries) ? record.recentRivalries : [];
  const nextRivalries = [rivalry, ...prevRivalries].slice(0, 3);

  return {
    recentRivals: nextRivals,
    recentRivalries: nextRivalries
  };
}

/**
 * Get the last 3 opponents a champion has faced (with automatic fallback to history if not yet tracked).
 */
export function getChampionRecentRivals(
  record: ChampionBeltRecord | null | undefined
): CharacterId[] {
  if (!record) return [];
  if (Array.isArray(record.recentRivals) && record.recentRivals.length > 0) {
    return record.recentRivals.slice(0, 3);
  }
  // Fallback extraction from history
  if (Array.isArray(record.history)) {
    const fromHistory: CharacterId[] = [];
    for (const h of record.history) {
      if (h.opponentId) {
        fromHistory.push(h.opponentId);
        if (fromHistory.length >= 3) break;
      }
    }
    return fromHistory;
  }
  return [];
}

/**
 * Get the last 3 opponent rivalry entries a champion has faced.
 */
export function getChampionRecentRivalries(
  record: ChampionBeltRecord | null | undefined
): ChampionRivalry[] {
  if (!record) return [];
  if (Array.isArray(record.recentRivalries) && record.recentRivalries.length > 0) {
    return record.recentRivalries.slice(0, 3);
  }
  // Fallback extraction from history
  if (Array.isArray(record.history)) {
    const rivalries: ChampionRivalry[] = [];
    for (const h of record.history) {
      if (h.opponentId) {
        rivalries.push({
          opponentId: h.opponentId,
          date: h.date,
          result: h.resultType === 'title_lost' ? 'loss' : 'win',
          defenseNumber: h.defenseNumber,
          matchType: h.matchType,
          tournamentTitle: h.tournamentTitle,
          note: h.note
        });
        if (rivalries.length >= 3) break;
      }
    }
    return rivalries;
  }
  return [];
}

/**
 * Create a completely clean and empty career & belt record for a character.
 * Adheres to WWE professional wrestling championship lineage rules:
 * - totalChampionships: X-Time World Champion (幾度世界冠軍)
 * - currentReignDefenses: Consecutive title defenses during current reign (本屆連續衛冕次數)
 * - totalDefenses: Lifetime total successful title defenses (生涯累計成功衛冕次數)
 */
export function createEmptyChampionRecord(id: CharacterId): ChampionBeltRecord {
  return {
    characterId: id,
    reignDays: 0,
    currentReignDefenses: 0,
    totalDefenses: 0,
    totalChampionships: 0,
    longestReignDays: 0,
    firstCrownedAt: 0,
    lastDefendedAt: 0,
    history: [],
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalBattleDuration: 0,
    avgBattleDuration: 0,
    currentWinStreak: 0,
    maxWinStreak: 0,
    recentRivals: [],
    recentRivalries: [],
    totalDamageDealt: 0,
    totalSkillDamageDealt: 0,
    totalCollisionDamageDealt: 0,
    peakDamageDealt: 0
  };
}

/**
 * Initialize pure empty belt records for all contenders.
 * Throne is vacant (currentHolderId: null) until a player or champion wins a title match!
 */
export function createInitialBeltState(): TournamentBeltState {
  const records: Record<CharacterId, ChampionBeltRecord> = {} as Record<CharacterId, ChampionBeltRecord>;

  ALL_CHAR_IDS.forEach(id => {
    records[id] = createEmptyChampionRecord(id);
  });

  return {
    currentHolderId: null, // 王座空缺，由選手在比賽中壓上金腰帶親手開創新王國！
    currentReignDays: 0,
    currentReignDefenses: 0,
    records,
    recentMatches: [],
    overallDamage: {
      totalDamage: 0,
      totalSkillDamage: 0,
      totalCollisionDamage: 0,
      peakDamageSingleMatch: 0
    },
    tournamentStats: {
      tournamentsPlayed: 0,
      championshipsWon: 0,
      finalsReached: 0,
      matchesWon: 0,
      matchesTotal: 0
    },
    lastReignIncrease: null
  };
}

/**
 * Load belt state from localStorage with backward compatibility migration.
 */
export function loadBeltState(): TournamentBeltState {
  try {
    // Check current storage key first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as TournamentBeltState;
      if (parsed && parsed.records) {
        const mergedRecords: Record<CharacterId, ChampionBeltRecord> = {} as Record<CharacterId, ChampionBeltRecord>;

        ALL_CHAR_IDS.forEach(id => {
          const savedRec = parsed.records[id];
          if (savedRec) {
            const totalMatches = savedRec.totalMatches || 0;
            const wins = savedRec.wins || 0;
            const losses = savedRec.losses || 0;
            const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 1000) / 10 : 0;
            const totalBattleDuration = savedRec.totalBattleDuration || 0;
            const avgBattleDuration = totalMatches > 0
              ? Math.round((totalBattleDuration / totalMatches) * 10) / 10
              : 0;

            let recentRivals = Array.isArray(savedRec.recentRivals) ? savedRec.recentRivals.slice(0, 3) : [];
            let recentRivalries = Array.isArray(savedRec.recentRivalries) ? savedRec.recentRivalries.slice(0, 3) : [];

            // Backfill from history if recentRivals is empty
            if (recentRivals.length === 0 && Array.isArray(savedRec.history)) {
              for (const h of savedRec.history) {
                if (h.opponentId) {
                  recentRivals.push(h.opponentId);
                  recentRivalries.push({
                    opponentId: h.opponentId,
                    date: h.date,
                    result: h.resultType === 'title_lost' ? 'loss' : 'win',
                    defenseNumber: h.defenseNumber,
                    matchType: h.matchType,
                    tournamentTitle: h.tournamentTitle,
                    note: h.note
                  });
                  if (recentRivals.length >= 3) break;
                }
              }
            }

            // Estimate or restore damage numbers if already recorded
            const totalDamageDealt = savedRec.totalDamageDealt ?? (totalMatches * 165);
            const totalSkillDamageDealt = savedRec.totalSkillDamageDealt ?? Math.round(totalDamageDealt * 0.67);
            const totalCollisionDamageDealt = savedRec.totalCollisionDamageDealt ?? (totalDamageDealt - totalSkillDamageDealt);
            const peakDamageDealt = savedRec.peakDamageDealt ?? (totalMatches > 0 ? Math.round(Math.max(120, avgBattleDuration * 6.5)) : 0);

            mergedRecords[id] = {
              characterId: id,
              reignDays: savedRec.reignDays || 0,
              currentReignDefenses: savedRec.currentReignDefenses || 0,
              totalDefenses: savedRec.totalDefenses || 0,
              totalChampionships: savedRec.totalChampionships || 0,
              longestReignDays: savedRec.longestReignDays || savedRec.reignDays || 0,
              firstCrownedAt: savedRec.firstCrownedAt || 0,
              lastDefendedAt: savedRec.lastDefendedAt || 0,
              history: Array.isArray(savedRec.history) ? savedRec.history : [],
              totalMatches,
              wins,
              losses,
              winRate,
              totalBattleDuration,
              avgBattleDuration,
              currentWinStreak: savedRec.currentWinStreak || 0,
              maxWinStreak: savedRec.maxWinStreak || 0,
              recentRivals,
              recentRivalries,
              totalDamageDealt,
              totalSkillDamageDealt,
              totalCollisionDamageDealt,
              peakDamageDealt
            };
          } else {
            mergedRecords[id] = createEmptyChampionRecord(id);
          }
        });

        const currentHolderId = parsed.currentHolderId || null;
        const currentHolderRecord = currentHolderId ? mergedRecords[currentHolderId] : null;

        // Restore or derive overall damage stats
        const overallDamage: OverallDamageStats = parsed.overallDamage || {
          totalDamage: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalDamageDealt || 0), 0),
          totalSkillDamage: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalSkillDamageDealt || 0), 0),
          totalCollisionDamage: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalCollisionDamageDealt || 0), 0),
          peakDamageSingleMatch: Math.max(0, ...Object.values(mergedRecords).map(r => r.peakDamageDealt || 0))
        };

        // Restore or derive tournament stats
        const tournamentStats: TournamentOverallStats = parsed.tournamentStats || {
          tournamentsPlayed: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalChampionships || 0), 0) + (currentHolderId ? 1 : 0),
          championshipsWon: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalChampionships || 0), 0),
          finalsReached: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalChampionships || 0), 0),
          matchesWon: Object.values(mergedRecords).reduce((acc, r) => acc + (r.wins || 0), 0),
          matchesTotal: Object.values(mergedRecords).reduce((acc, r) => acc + (r.totalMatches || 0), 0)
        };

        const recentMatches: MatchRecordEntry[] = Array.isArray(parsed.recentMatches)
          ? parsed.recentMatches
          : [];

        return {
          currentHolderId,
          currentReignDays: parsed.currentReignDays || (currentHolderRecord ? currentHolderRecord.reignDays : 0),
          currentReignDefenses: parsed.currentReignDefenses || (currentHolderRecord ? currentHolderRecord.currentReignDefenses : 0),
          records: mergedRecords,
          recentMatches,
          overallDamage,
          tournamentStats,
          lastReignIncrease: parsed.lastReignIncrease || null
        };
      }
    }

    // Try migrating from v5 if available
    const prevSaved = localStorage.getItem('arena_champion_belt_v5_clean');
    if (prevSaved) {
      const parsed = JSON.parse(prevSaved) as TournamentBeltState;
      if (parsed && parsed.records) {
        const migratedState = createInitialBeltState();
        migratedState.currentHolderId = parsed.currentHolderId || null;
        migratedState.currentReignDays = parsed.currentReignDays || 0;

        ALL_CHAR_IDS.forEach(id => {
          const s = parsed.records[id];
          if (s) {
            migratedState.records[id] = {
              ...createEmptyChampionRecord(id),
              ...s,
              currentReignDefenses: s.totalDefenses || 0,
              longestReignDays: s.reignDays || 0
            };
          }
        });

        if (migratedState.currentHolderId && migratedState.records[migratedState.currentHolderId]) {
          migratedState.currentReignDefenses = migratedState.records[migratedState.currentHolderId].currentReignDefenses;
        }

        saveBeltState(migratedState);
        return migratedState;
      }
    }
  } catch (e) {
    console.error('Failed to load belt state from localStorage:', e);
  }

  const fresh = createInitialBeltState();
  saveBeltState(fresh);
  return fresh;
}

/**
 * Save belt state to localStorage
 */
export function saveBeltState(state: TournamentBeltState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save belt state to localStorage:', e);
  }
}

/**
 * Check if a match between two characters is an official WWE Title Defense Match.
 * In WWE Rules:
 * - If belt is vacant (currentHolderId === null), it's a Vacant Championship match.
 * - If either fighter is the reigning champion, it is a Title Defense match where the belt is on the line.
 * - Otherwise it is an exhibition / non-title match.
 */
export function isTitleDefenseMatch(
  beltState: TournamentBeltState,
  p1CharId: CharacterId | null,
  p2CharId: CharacterId | null,
  isTournamentMatch: boolean = false,
  isTournamentFinal: boolean = false,
  isTitleMatchEnabled: boolean = true
): {
  isTitleMatch: boolean;
  championId: CharacterId | null;
  challengerId: CharacterId | null;
  isVacant: boolean;
  isCoronationMatch?: boolean;
} {
  // 若開關關閉，則一律判定為無頭銜賽冠軍確認 (Non-Title Match)
  if (!isTitleMatchEnabled) {
    return { isTitleMatch: false, championId: null, challengerId: null, isVacant: false, isCoronationMatch: false };
  }

  if (!p1CharId || !p2CharId) {
    return { isTitleMatch: false, championId: null, challengerId: null, isVacant: false, isCoronationMatch: false };
  }

  const currentHolder = beltState.currentHolderId;

  // If throne is vacant:
  // - In 1v1 duel: it is a vacant title coronation match!
  // - In tournament: only the final match crowns the vacant belt! Early rounds are contender matches.
  if (!currentHolder) {
    if (!isTournamentMatch || isTournamentFinal) {
      return { isTitleMatch: true, championId: null, challengerId: null, isVacant: true, isCoronationMatch: true };
    }
    return { isTitleMatch: false, championId: null, challengerId: null, isVacant: true, isCoronationMatch: false };
  }

  if (p1CharId === currentHolder) {
    return { isTitleMatch: true, championId: p1CharId, challengerId: p2CharId, isVacant: false, isCoronationMatch: false };
  }

  if (p2CharId === currentHolder) {
    return { isTitleMatch: true, championId: p2CharId, challengerId: p1CharId, isVacant: false, isCoronationMatch: false };
  }

  // 1v1 單挑且啟用加冕賽開關：若雙方皆非霸主，作為官方【冠軍加冕爭奪賽】(勝者加冕登基)
  if (!isTournamentMatch) {
    return { isTitleMatch: true, championId: currentHolder, challengerId: null, isVacant: false, isCoronationMatch: true };
  }

  return { isTitleMatch: false, championId: null, challengerId: null, isVacant: false, isCoronationMatch: false };
}

/**
 * Record an individual match outcome into the character career records:
 * Updates personal win rate, total battle duration, average battle duration, and win streaks.
 */
export function recordMatchOutcome(
  prevState: TournamentBeltState,
  winnerId: CharacterId,
  loserId: CharacterId,
  matchDurationSeconds: number,
  details?: MatchCombatDetails
): TournamentBeltState {
  const duration = Math.max(3, Math.round(matchDurationSeconds * 10) / 10);
  const updatedRecords = { ...prevState.records };

  // Calculate damage numbers
  const winnerDamage = Math.round(details?.winnerDamage ?? Math.max(80, duration * 5.2));
  const winnerSkillDamage = Math.round(details?.winnerSkillDamage ?? Math.round(winnerDamage * 0.68));
  const winnerCollisionDamage = Math.round(details?.winnerCollisionDamage ?? (winnerDamage - winnerSkillDamage));

  const loserDamage = Math.round(details?.loserDamage ?? Math.max(30, duration * 3.1));
  const loserSkillDamage = Math.round(details?.loserSkillDamage ?? Math.round(loserDamage * 0.62));
  const loserCollisionDamage = Math.round(details?.loserCollisionDamage ?? (loserDamage - loserSkillDamage));

  // Update Winner
  const prevWinner = updatedRecords[winnerId] || createEmptyChampionRecord(winnerId);
  const newWinnerMatches = (prevWinner.totalMatches || 0) + 1;
  const newWinnerWins = (prevWinner.wins || 0) + 1;
  const newWinnerLosses = prevWinner.losses || 0;
  const newWinnerWinRate = Math.round((newWinnerWins / newWinnerMatches) * 1000) / 10;
  const newWinnerTotalDuration = Math.round(((prevWinner.totalBattleDuration || 0) + duration) * 10) / 10;
  const newWinnerAvgDuration = Math.round((newWinnerTotalDuration / newWinnerMatches) * 10) / 10;
  const newWinnerCurrentStreak = (prevWinner.currentWinStreak || 0) + 1;
  const newWinnerMaxStreak = Math.max(prevWinner.maxWinStreak || 0, newWinnerCurrentStreak);

  const winnerRivalTrack = recordChampionRival(
    prevWinner,
    loserId,
    'win',
    prevWinner.currentReignDefenses,
    details?.matchType || 'duel',
    details?.tournamentTitle || '競技場對決',
    details?.tournamentRound ? `${details.tournamentRound} 戰勝對手` : `戰勝對手`
  );

  updatedRecords[winnerId] = {
    ...prevWinner,
    totalMatches: newWinnerMatches,
    wins: newWinnerWins,
    losses: newWinnerLosses,
    winRate: newWinnerWinRate,
    totalBattleDuration: newWinnerTotalDuration,
    avgBattleDuration: newWinnerAvgDuration,
    currentWinStreak: newWinnerCurrentStreak,
    maxWinStreak: newWinnerMaxStreak,
    recentRivals: winnerRivalTrack.recentRivals,
    recentRivalries: winnerRivalTrack.recentRivalries,
    totalDamageDealt: (prevWinner.totalDamageDealt || 0) + winnerDamage,
    totalSkillDamageDealt: (prevWinner.totalSkillDamageDealt || 0) + winnerSkillDamage,
    totalCollisionDamageDealt: (prevWinner.totalCollisionDamageDealt || 0) + winnerCollisionDamage,
    peakDamageDealt: Math.max(prevWinner.peakDamageDealt || 0, winnerDamage)
  };

  // Update Loser
  const prevLoser = updatedRecords[loserId] || createEmptyChampionRecord(loserId);
  const newLoserMatches = (prevLoser.totalMatches || 0) + 1;
  const newLoserWins = prevLoser.wins || 0;
  const newLoserLosses = (prevLoser.losses || 0) + 1;
  const newLoserWinRate = Math.round((newLoserWins / newLoserMatches) * 1000) / 10;
  const newLoserTotalDuration = Math.round(((prevLoser.totalBattleDuration || 0) + duration) * 10) / 10;
  const newLoserAvgDuration = Math.round((newLoserTotalDuration / newLoserMatches) * 10) / 10;
  const newLoserCurrentStreak = 0; // Broken streak resets to 0
  const newLoserMaxStreak = prevLoser.maxWinStreak || 0; // Preserve best streak

  const loserRivalTrack = recordChampionRival(
    prevLoser,
    winnerId,
    'loss',
    undefined,
    details?.matchType || 'duel',
    details?.tournamentTitle || '競技場對決',
    details?.tournamentRound ? `${details.tournamentRound} 不敵對手` : `不敵對手`
  );

  updatedRecords[loserId] = {
    ...prevLoser,
    totalMatches: newLoserMatches,
    wins: newLoserWins,
    losses: newLoserLosses,
    winRate: newLoserWinRate,
    totalBattleDuration: newLoserTotalDuration,
    avgBattleDuration: newLoserAvgDuration,
    currentWinStreak: newLoserCurrentStreak,
    maxWinStreak: newLoserMaxStreak,
    recentRivals: loserRivalTrack.recentRivals,
    recentRivalries: loserRivalTrack.recentRivalries,
    totalDamageDealt: (prevLoser.totalDamageDealt || 0) + loserDamage,
    totalSkillDamageDealt: (prevLoser.totalSkillDamageDealt || 0) + loserSkillDamage,
    totalCollisionDamageDealt: (prevLoser.totalCollisionDamageDealt || 0) + loserCollisionDamage,
    peakDamageDealt: Math.max(prevLoser.peakDamageDealt || 0, loserDamage)
  };

  // Update Overall Damage
  const prevDamage = prevState.overallDamage || {
    totalDamage: 0,
    totalSkillDamage: 0,
    totalCollisionDamage: 0,
    peakDamageSingleMatch: 0
  };
  const nextOverallDamage: OverallDamageStats = {
    totalDamage: prevDamage.totalDamage + winnerDamage + loserDamage,
    totalSkillDamage: prevDamage.totalSkillDamage + winnerSkillDamage + loserSkillDamage,
    totalCollisionDamage: prevDamage.totalCollisionDamage + winnerCollisionDamage + loserCollisionDamage,
    peakDamageSingleMatch: Math.max(prevDamage.peakDamageSingleMatch, winnerDamage, loserDamage)
  };

  // Prepend to Recent Match History
  const matchEntry: MatchRecordEntry = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    mode: details?.matchType || 'duel',
    winnerCharId: winnerId,
    loserCharId: loserId,
    duration,
    winnerDamage,
    loserDamage,
    winnerSkillDamage,
    winnerCollisionDamage,
    loserSkillDamage,
    loserCollisionDamage,
    tournamentTitle: details?.tournamentTitle,
    tournamentRound: details?.tournamentRound,
    isTitleMatch: details?.isTitleMatch
  };
  const updatedRecentMatches = [matchEntry, ...(prevState.recentMatches || [])].slice(0, 50);

  // Update Tournament Career Stats if applicable
  const prevTourney = prevState.tournamentStats || {
    tournamentsPlayed: 0,
    championshipsWon: 0,
    finalsReached: 0,
    matchesWon: 0,
    matchesTotal: 0
  };
  const nextTournamentStats: TournamentOverallStats = {
    ...prevTourney,
    matchesTotal: details?.matchType === 'tournament' ? prevTourney.matchesTotal + 1 : prevTourney.matchesTotal,
    matchesWon: details?.matchType === 'tournament' ? prevTourney.matchesWon + 1 : prevTourney.matchesWon
  };

  const nextState: TournamentBeltState = {
    ...prevState,
    records: updatedRecords,
    recentMatches: updatedRecentMatches,
    overallDamage: nextOverallDamage,
    tournamentStats: nextTournamentStats
  };

  saveBeltState(nextState);
  return nextState;
}

/**
 * Result returned by resolving a WWE-style Title Match
 */
export interface TitleMatchResolution {
  nextState: TournamentBeltState;
  isTitleMatch: boolean;
  resultType: 'defense_success' | 'title_won' | 'title_lost' | 'none';
  isConsecutiveDefense: boolean;
  defenseNumber: number; // 成功衛冕次數 (若為新王加冕則為 0)
  newChampionshipNumber: number; // 第幾度世界王者 (1-Time, 2-Time, etc.)
  daysAdded: number;
  totalDays: number;
  previousHolderId: CharacterId | null;
  newHolderId: CharacterId;
  wweAnnouncement: string;
  wweHeadline: string;
  note: string;
}

/**
 * Resolve a WWE Title Defense Match strictly following WWE Championship rules:
 *
 * 1. 【衛冕成功 (AND STILL CHAMPION)】:
 *    - The reigning champion defeats the challenger.
 *    - Defense count strictly increments: currentReignDefenses + 1, totalDefenses + 1.
 *    - Virtual reign days awarded (base + streak multiplier).
 *
 * 2. 【冠軍易主 (AND NEW CHAMPION)】:
 *    - The challenger defeats the reigning champion.
 *    - Reigning champion loses the belt, reign is broken, currentReignDefenses resets to 0.
 *    - Challenger is crowned as the New Champion, totalChampionships + 1 (幾度王者).
 *    - Challenger's defenses count for this new reign starts at 0 (WWE rule: winning title is NOT a defense).
 *    - Starts with initial reign days (e.g. 30~45 days).
 *
 * 3. 【首度奪得空缺王座 (VACANT TITLE WON)】:
 *    - When throne is vacant, winner becomes inaugural / new champion (totalChampionships + 1, defenses = 0).
 */
export function resolveTitleMatchOutcome(
  prevState: TournamentBeltState,
  winnerId: CharacterId,
  loserId: CharacterId,
  matchType: 'duel' | 'tournament' = 'tournament',
  tournamentTitle: string = 'WWE 世界重量級金腰帶衛冕戰',
  tournamentSize: number = 8
): TitleMatchResolution {
  const previousHolderId = prevState.currentHolderId;
  const winnerChar = CHARACTERS[winnerId];
  const loserChar = CHARACTERS[loserId];
  const winnerName = winnerChar ? winnerChar.name : winnerId;
  const loserName = loserChar ? loserChar.name : loserId;

  const updatedRecords = { ...prevState.records };
  const prevWinnerRecord = updatedRecords[winnerId] || createEmptyChampionRecord(winnerId);
  const prevLoserRecord = updatedRecords[loserId] || createEmptyChampionRecord(loserId);

  // CASE 1: Throne is VACANT
  if (!previousHolderId) {
    const sizeBonus = tournamentSize === 16 ? 20 : 10;
    const daysAdded = 30 + sizeBonus;
    const newChampionshipNumber = (prevWinnerRecord.totalChampionships || 0) + 1;

    const winnerHistoryEntry: BeltHistoryEntry = {
      tournamentTitle,
      date: Date.now(),
      daysEarned: daysAdded,
      opponentId: loserId,
      isDefense: false,
      resultType: 'title_won',
      defenseNumber: 0,
      championshipNumber: newChampionshipNumber,
      matchType,
      note: `【WWE 空缺頭銜爭奪】擊敗 ${loserName}，首次加冕世界重量級冠軍（登基王者，尚待發起衛冕戰）`
    };

    const winnerRivalTrack = recordChampionRival(
      prevWinnerRecord,
      loserId,
      'win',
      0,
      matchType,
      tournamentTitle,
      `擊敗 ${loserName}，加冕世界重量級冠軍`
    );

    updatedRecords[winnerId] = {
      ...prevWinnerRecord,
      reignDays: daysAdded,
      currentReignDefenses: 0, // WWE Rule: Winning title is 0 defenses!
      totalDefenses: prevWinnerRecord.totalDefenses || 0,
      totalChampionships: newChampionshipNumber,
      longestReignDays: Math.max(prevWinnerRecord.longestReignDays || 0, daysAdded),
      firstCrownedAt: prevWinnerRecord.firstCrownedAt || Date.now(),
      lastDefendedAt: Date.now(),
      history: [winnerHistoryEntry, ...(prevWinnerRecord.history || [])],
      recentRivals: winnerRivalTrack.recentRivals,
      recentRivalries: winnerRivalTrack.recentRivalries
    };

    const lastReignIncrease = {
      characterId: winnerId,
      daysAdded,
      totalDays: daysAdded,
      isConsecutiveDefense: false,
      defenseNumber: 0,
      resultType: 'title_won' as const,
      previousHolderId: null,
      opponentId: loserId,
      matchType,
      wweAnnouncement: `AND NEW WWE CHAMPION! 首任世界冠軍榮耀加冕！`,
      wweHeadline: `${winnerName} 於首任世界冠軍加冕賽中獲勝，正式加冕為球球競技場「首任世界冠軍」！`,
      isUpset: false,
      timestamp: Date.now()
    };

    const nextState: TournamentBeltState = {
      currentHolderId: winnerId,
      currentReignDays: daysAdded,
      currentReignDefenses: 0,
      records: updatedRecords,
      lastReignIncrease
    };

    saveBeltState(nextState);

    return {
      nextState,
      isTitleMatch: true,
      resultType: 'title_won',
      isConsecutiveDefense: false,
      defenseNumber: 0,
      newChampionshipNumber,
      daysAdded,
      totalDays: daysAdded,
      previousHolderId: null,
      newHolderId: winnerId,
      wweAnnouncement: `AND NEW WWE CHAMPION!`,
      wweHeadline: `${winnerName} 於首任世界冠軍加冕賽中獲勝，正式加冕為球球競技場「首任世界冠軍」！`,
      note: `榮耀加冕為球球競技場「首任世界冠軍」！衛冕起算 0 次，開始累積衛冕天數（等待發起首次世界頭銜衛冕戰）`
    };
  }

  // CASE 2: Reigning Champion Defends Successfully (AND STILL CHAMPION!)
  if (previousHolderId === winnerId) {
    const currentReignDefenses = (prevWinnerRecord.currentReignDefenses || 0) + 1;
    const totalDefenses = (prevWinnerRecord.totalDefenses || 0) + 1;

    // Calculate days earned: base days + defense streak bonus + tournament scale bonus
    let baseDays = matchType === 'tournament'
      ? Math.floor(35 + Math.random() * 20) // 35 ~ 54 days for tournament
      : Math.floor(18 + Math.random() * 12); // 18 ~ 29 days for 1v1 duel

    const streakBonus = Math.min(80, currentReignDefenses * 12);
    const sizeBonus = matchType === 'tournament' && tournamentSize === 16 ? 20 : 5;
    const daysAdded = baseDays + streakBonus + sizeBonus;
    const newTotalDays = (prevWinnerRecord.reignDays || 0) + daysAdded;
    const longestDays = Math.max(prevWinnerRecord.longestReignDays || 0, newTotalDays);

    const winnerHistoryEntry: BeltHistoryEntry = {
      tournamentTitle,
      date: Date.now(),
      daysEarned: daysAdded,
      opponentId: loserId,
      isDefense: true,
      resultType: 'defense_success',
      defenseNumber: currentReignDefenses,
      championshipNumber: prevWinnerRecord.totalChampionships || 1,
      matchType,
      note: `【WWE 世界頭銜防衛戰】AND STILL CHAMPION! 第 ${currentReignDefenses} 次成功衛冕，擊退挑戰者 ${loserName}！(+${daysAdded}天)`
    };

    const winnerRivalTrack = recordChampionRival(
      prevWinnerRecord,
      loserId,
      'win',
      currentReignDefenses,
      matchType,
      tournamentTitle,
      `第 ${currentReignDefenses} 次成功衛冕，擊退挑戰者 ${loserName}`
    );

    updatedRecords[winnerId] = {
      ...prevWinnerRecord,
      reignDays: newTotalDays,
      currentReignDefenses,
      totalDefenses,
      longestReignDays: longestDays,
      lastDefendedAt: Date.now(),
      history: [winnerHistoryEntry, ...(prevWinnerRecord.history || [])],
      recentRivals: winnerRivalTrack.recentRivals,
      recentRivalries: winnerRivalTrack.recentRivalries
    };

    const lastReignIncrease = {
      characterId: winnerId,
      daysAdded,
      totalDays: newTotalDays,
      isConsecutiveDefense: true,
      defenseNumber: currentReignDefenses,
      resultType: 'defense_success' as const,
      previousHolderId: winnerId,
      opponentId: loserId,
      matchType,
      wweAnnouncement: `AND STILL WWE CHAMPION! 第 ${currentReignDefenses} 次成功衛冕！`,
      wweHeadline: `衛冕成功！王者 ${winnerName} 擊退挑戰者 ${loserName}，達成第 ${currentReignDefenses} 次成功衛冕！`,
      isUpset: false,
      timestamp: Date.now()
    };

    const nextState: TournamentBeltState = {
      currentHolderId: winnerId,
      currentReignDays: newTotalDays,
      currentReignDefenses,
      records: updatedRecords,
      lastReignIncrease
    };

    saveBeltState(nextState);

    return {
      nextState,
      isTitleMatch: true,
      resultType: 'defense_success',
      isConsecutiveDefense: true,
      defenseNumber: currentReignDefenses,
      newChampionshipNumber: prevWinnerRecord.totalChampionships || 1,
      daysAdded,
      totalDays: newTotalDays,
      previousHolderId: winnerId,
      newHolderId: winnerId,
      wweAnnouncement: `AND STILL WWE CHAMPION!`,
      wweHeadline: `${winnerName} 衛冕成功！擊退挑戰者 ${loserName}，達成第 ${currentReignDefenses} 次成功衛冕！`,
      note: `本屆金腰帶統治天數累計至 ${newTotalDays} 天（增加 +${daysAdded} 天）`
    };
  }

  // CASE 3: Reigning Champion LOSES (AND NEW CHAMPION! Dethroned!)
  if (previousHolderId === loserId) {
    const formerDefenses = prevLoserRecord.currentReignDefenses || 0;
    const formerDays = prevLoserRecord.reignDays || 0;

    // Terminate former champion's active reign
    const loserHistoryEntry: BeltHistoryEntry = {
      tournamentTitle,
      date: Date.now(),
      daysEarned: 0,
      opponentId: winnerId,
      isDefense: true,
      resultType: 'title_lost',
      defenseNumber: formerDefenses,
      championshipNumber: prevLoserRecord.totalChampionships || 1,
      matchType,
      note: `【WWE 世界頭銜防衛戰】丟失金腰帶，遭挑戰者 ${winnerName} 擊破！本屆統治定格於 ${formerDefenses} 次衛冕 (${formerDays}天)`
    };

    const loserRivalTrack = recordChampionRival(
      prevLoserRecord,
      winnerId,
      'loss',
      formerDefenses,
      matchType,
      tournamentTitle,
      `衛冕失利，遭挑戰者 ${winnerName} 擊破`
    );

    updatedRecords[loserId] = {
      ...prevLoserRecord,
      currentReignDefenses: 0, // Dethroned: current reign streak broken!
      history: [loserHistoryEntry, ...(prevLoserRecord.history || [])],
      recentRivals: loserRivalTrack.recentRivals,
      recentRivalries: loserRivalTrack.recentRivalries
    };

    // Crown the Challenger as the NEW Champion
    const newChampionshipNumber = (prevWinnerRecord.totalChampionships || 0) + 1;
    // Base days for crowning + bonus for dethroning high-defense champion
    const dethroneBonus = Math.min(30, formerDefenses * 5);
    const daysAdded = 30 + dethroneBonus + (tournamentSize === 16 ? 15 : 0);

    const winnerHistoryEntry: BeltHistoryEntry = {
      tournamentTitle,
      date: Date.now(),
      daysEarned: daysAdded,
      opponentId: loserId,
      isDefense: false,
      resultType: 'title_won',
      defenseNumber: 0, // Starts at 0 defenses for this new reign!
      championshipNumber: newChampionshipNumber,
      matchType,
      note: `【WWE 世界頭銜決戰】AND NEW CHAMPION! 爆冷擊敗前任霸主 ${loserName}，榮耀加冕為第 ${newChampionshipNumber} 度世界王者！(+${daysAdded}天)`
    };

    const winnerRivalTrack = recordChampionRival(
      prevWinnerRecord,
      loserId,
      'win',
      0,
      matchType,
      tournamentTitle,
      `擊敗前任霸主 ${loserName}，榮耀加冕新王`
    );

    updatedRecords[winnerId] = {
      ...prevWinnerRecord,
      reignDays: daysAdded,
      currentReignDefenses: 0, // WWE Rule: Starts with 0 defenses!
      totalDefenses: prevWinnerRecord.totalDefenses || 0,
      totalChampionships: newChampionshipNumber,
      longestReignDays: Math.max(prevWinnerRecord.longestReignDays || 0, daysAdded),
      firstCrownedAt: prevWinnerRecord.firstCrownedAt || Date.now(),
      lastDefendedAt: Date.now(),
      history: [winnerHistoryEntry, ...(prevWinnerRecord.history || [])],
      recentRivals: winnerRivalTrack.recentRivals,
      recentRivalries: winnerRivalTrack.recentRivalries
    };

    const lastReignIncrease = {
      characterId: winnerId,
      daysAdded,
      totalDays: daysAdded,
      isConsecutiveDefense: false,
      defenseNumber: 0,
      resultType: 'title_won' as const,
      previousHolderId: loserId,
      opponentId: loserId,
      matchType,
      wweAnnouncement: `AND NEW WWE CHAMPION! 冠軍易主！新王誕生！`,
      wweHeadline: `💥 世紀大爆冷！${winnerName} 擊潰霸主 ${loserName}，奪走世界重量級金腰帶！`,
      isUpset: true,
      timestamp: Date.now()
    };

    const nextState: TournamentBeltState = {
      currentHolderId: winnerId,
      currentReignDays: daysAdded,
      currentReignDefenses: 0,
      records: updatedRecords,
      lastReignIncrease
    };

    saveBeltState(nextState);

    return {
      nextState,
      isTitleMatch: true,
      resultType: 'title_won',
      isConsecutiveDefense: false,
      defenseNumber: 0,
      newChampionshipNumber,
      daysAdded,
      totalDays: daysAdded,
      previousHolderId: loserId,
      newHolderId: winnerId,
      wweAnnouncement: `AND NEW WWE CHAMPION!`,
      wweHeadline: `冠軍易主！${winnerName} 擊潰霸主 ${loserName}，成為新任第 ${newChampionshipNumber} 度世界重量級冠軍！`,
      note: `前冠軍統治定格於 ${formerDefenses} 次衛冕；新王加冕，本屆衛冕次數起算為 0 次！`
    };
  }

  // CASE 4: Neither is current champion (e.g. tournament match where champion already fell)
  // Crown tournament winner as the undisputed new champion!
  const newChampionshipNumber = (prevWinnerRecord.totalChampionships || 0) + 1;
  const daysAdded = 35 + (tournamentSize === 16 ? 15 : 5);

  const winnerHistoryEntry: BeltHistoryEntry = {
    tournamentTitle,
    date: Date.now(),
    daysEarned: daysAdded,
    opponentId: loserId,
    isDefense: false,
    resultType: 'title_won',
    defenseNumber: 0,
    championshipNumber: newChampionshipNumber,
    matchType,
    note: `【WWE 總決賽頭銜爭霸】擊退 ${loserName}，統治空缺王座，加冕為第 ${newChampionshipNumber} 度世界王者！(+${daysAdded}天)`
  };

  const winnerRivalTrack = recordChampionRival(
    prevWinnerRecord,
    loserId,
    'win',
    0,
    matchType,
    tournamentTitle,
    `總決賽擊退 ${loserName}，加冕世界重量級冠軍`
  );

  updatedRecords[winnerId] = {
    ...prevWinnerRecord,
    reignDays: daysAdded,
    currentReignDefenses: 0,
    totalDefenses: prevWinnerRecord.totalDefenses || 0,
    totalChampionships: newChampionshipNumber,
    longestReignDays: Math.max(prevWinnerRecord.longestReignDays || 0, daysAdded),
    firstCrownedAt: prevWinnerRecord.firstCrownedAt || Date.now(),
    lastDefendedAt: Date.now(),
    history: [winnerHistoryEntry, ...(prevWinnerRecord.history || [])],
    recentRivals: winnerRivalTrack.recentRivals,
    recentRivalries: winnerRivalTrack.recentRivalries
  };

  const lastReignIncrease = {
    characterId: winnerId,
    daysAdded,
    totalDays: daysAdded,
    isConsecutiveDefense: false,
    defenseNumber: 0,
    resultType: 'title_won' as const,
    previousHolderId,
    opponentId: loserId,
    matchType,
    wweAnnouncement: `AND NEW WWE CHAMPION! 加冕世界重量級冠軍！`,
    wweHeadline: `總決賽登頂！${winnerName} 擊退 ${loserName}，加冕為第 ${newChampionshipNumber} 度世界重量級冠軍！`,
    isUpset: false,
    timestamp: Date.now()
  };

  const nextState: TournamentBeltState = {
    currentHolderId: winnerId,
    currentReignDays: daysAdded,
    currentReignDefenses: 0,
    records: updatedRecords,
    lastReignIncrease
  };

  saveBeltState(nextState);

  return {
    nextState,
    isTitleMatch: true,
    resultType: 'title_won',
    isConsecutiveDefense: false,
    defenseNumber: 0,
    newChampionshipNumber,
    daysAdded,
    totalDays: daysAdded,
    previousHolderId,
    newHolderId: winnerId,
    wweAnnouncement: `AND NEW WWE CHAMPION!`,
    wweHeadline: `${winnerName} 於決賽擊潰 ${loserName}，榮耀加冕為第 ${newChampionshipNumber} 度世界重量級冠軍！`,
    note: `新王登基！本屆衛冕次數起算為 0 次，累計獲得 ${daysAdded} 天統治天數`
  };
}

/**
 * Award the championship belt (tournament wrap).
 * Backward-compatible wrapper over resolveTitleMatchOutcome.
 */
export function awardChampionshipBelt(
  prevState: TournamentBeltState,
  championId: CharacterId,
  runnerUpId: CharacterId | null,
  tournamentTitle: string,
  tournamentSize: number
): {
  nextState: TournamentBeltState;
  isConsecutiveDefense: boolean;
  daysAdded: number;
  totalDays: number;
  previousHolderId: CharacterId | null;
} {
  const opponentId = runnerUpId || (prevState.currentHolderId && prevState.currentHolderId !== championId ? prevState.currentHolderId : 'huotong');
  const res = resolveTitleMatchOutcome(
    prevState,
    championId,
    opponentId,
    'tournament',
    tournamentTitle,
    tournamentSize
  );

  const prevTourney = res.nextState.tournamentStats || {
    tournamentsPlayed: 0,
    championshipsWon: 0,
    finalsReached: 0,
    matchesWon: 0,
    matchesTotal: 0
  };

  const nextStateWithTourney: TournamentBeltState = {
    ...res.nextState,
    tournamentStats: {
      ...prevTourney,
      tournamentsPlayed: prevTourney.tournamentsPlayed + 1,
      championshipsWon: prevTourney.championshipsWon + 1,
      finalsReached: prevTourney.finalsReached + 1
    }
  };
  saveBeltState(nextStateWithTourney);

  return {
    nextState: nextStateWithTourney,
    isConsecutiveDefense: res.isConsecutiveDefense,
    daysAdded: res.daysAdded,
    totalDays: res.totalDays,
    previousHolderId: res.previousHolderId
  };
}

/**
 * Result of processing a single tournament match
 */
export interface TournamentMatchProcessResult {
  nextState: TournamentBeltState;
  isTitleMatch: boolean;
  isUpset: boolean;
  resultType: 'defense_success' | 'title_won' | 'title_lost' | 'contender_win' | 'none';
  wweAnnouncement?: string;
  wweHeadline?: string;
  defenseNumber?: number;
  daysAdded?: number;
  totalDays?: number;
  summary: string;
}

/**
 * Process a tournament match outcome according to strict WWE lineage rules:
 * - If match involves beltState.currentHolderId -> Official Title Defense match.
 *   - Champion wins -> 衛冕成功 (currentReignDefenses + 1, totalDefenses + 1, reign days added)
 *   - Champion loses -> 💥 世紀大爆冷 (belt moves to challenger! challenger reign starts with 0 defenses, former champ streak ends)
 * - If beltState.currentHolderId is null and match is the final -> Vacant Title Championship (new champion, 0 defenses)
 * - Otherwise -> Contender Match (爭取挑戰權排位戰), updates career stats (wins, losses, winRate, streaks, damage, rivalries)
 */
export function processTournamentMatch(
  prevState: TournamentBeltState,
  match: TournamentMatch,
  winnerId: CharacterId,
  loserId: CharacterId,
  matchDurationSeconds: number,
  tournamentTitle: string,
  tournamentSize: number = 8,
  isTitleMatchEnabled: boolean = true
): TournamentMatchProcessResult {
  const winnerChar = CHARACTERS[winnerId];
  const loserChar = CHARACTERS[loserId];
  const winnerName = winnerChar ? winnerChar.name : winnerId;
  const loserName = loserChar ? loserChar.name : loserId;

  const isFinalMatch = match.id === 'm_final' || !match.nextMatchId;
  const currentHolder = prevState.currentHolderId;

  // Determine if this is an official Title Match based on isTitleMatchEnabled switch
  let isTitleMatch = false;
  if (isTitleMatchEnabled) {
    if (currentHolder && (match.p1CharId === currentHolder || match.p2CharId === currentHolder)) {
      isTitleMatch = true;
    } else if (isFinalMatch) {
      // 決賽為官方冠軍加冕賽 (無論目前王座是否懸空)
      isTitleMatch = true;
    }
  }

  // 1. Record basic combat match outcome into career stats
  let intermediateState = recordMatchOutcome(
    prevState,
    winnerId,
    loserId,
    matchDurationSeconds,
    {
      matchType: 'tournament',
      tournamentTitle,
      tournamentRound: match.roundName,
      isTitleMatch
    }
  );

  if (isTitleMatch) {
    const titleRes = resolveTitleMatchOutcome(
      intermediateState,
      winnerId,
      loserId,
      'tournament',
      `${tournamentTitle} · ${match.roundName}`,
      tournamentSize
    );

    const isUpset = titleRes.resultType === 'title_lost' || (currentHolder === loserId);

    let summaryText = '';
    if (titleRes.resultType === 'defense_success') {
      summaryText = `👑【衛冕成功】${winnerName} 擊退挑戰者 ${loserName}，達成第 ${titleRes.defenseNumber} 次衛冕！(+${titleRes.daysAdded}天)`;
    } else if (titleRes.resultType === 'title_won') {
      if (isUpset) {
        summaryText = `💥【世紀大爆冷】${winnerName} 擊潰霸主 ${loserName}，金腰帶易主加冕新王！`;
      } else {
        summaryText = `👑【新王加冕】${winnerName} 決賽奪得世界金腰帶，成為第 ${titleRes.newChampionshipNumber} 度世界冠軍！`;
      }
    } else {
      summaryText = `${winnerName} 擊敗 ${loserName} 奪冠晉級！`;
    }

    // If this completed the tournament final, update tournament overall stats
    if (isFinalMatch) {
      const prevTourney = titleRes.nextState.tournamentStats || {
        tournamentsPlayed: 0,
        championshipsWon: 0,
        finalsReached: 0,
        matchesWon: 0,
        matchesTotal: 0
      };
      titleRes.nextState.tournamentStats = {
        ...prevTourney,
        tournamentsPlayed: prevTourney.tournamentsPlayed + 1,
        championshipsWon: prevTourney.championshipsWon + 1,
        finalsReached: prevTourney.finalsReached + 1
      };
      saveBeltState(titleRes.nextState);
    }

    return {
      nextState: titleRes.nextState,
      isTitleMatch: true,
      isUpset,
      resultType: titleRes.resultType,
      wweAnnouncement: titleRes.wweAnnouncement,
      wweHeadline: titleRes.wweHeadline,
      defenseNumber: titleRes.defenseNumber,
      daysAdded: titleRes.daysAdded,
      totalDays: titleRes.totalDays,
      summary: summaryText
    };
  } else {
    // Non-title contender match
    const summaryText = `⚔️【挑戰權晉級】${winnerName} 戰勝 ${loserName}，挺進下一輪！`;
    return {
      nextState: intermediateState,
      isTitleMatch: false,
      isUpset: false,
      resultType: 'contender_win',
      summary: summaryText
    };
  }
}

/**
 * Batch process multiple simulated tournament matches sequentially
 */
export function batchProcessTournamentMatches(
  prevState: TournamentBeltState,
  matches: {
    match: TournamentMatch;
    winnerId: CharacterId;
    loserId: CharacterId;
    matchDurationSeconds: number;
  }[],
  tournamentTitle: string,
  tournamentSize: number = 8
): {
  nextState: TournamentBeltState;
  summaries: Record<string, string>;
} {
  let currentState = prevState;
  const summaries: Record<string, string> = {};

  for (const m of matches) {
    const res = processTournamentMatch(
      currentState,
      m.match,
      m.winnerId,
      m.loserId,
      m.matchDurationSeconds,
      tournamentTitle,
      tournamentSize
    );
    currentState = res.nextState;
    summaries[m.match.id] = res.summary;
  }

  return { nextState: currentState, summaries };
}

/**
 * Batch record multiple match outcomes (e.g. from fast-forwarding an entire tournament round)
 */
export function batchRecordMatchOutcomes(
  prevState: TournamentBeltState,
  matches: { winnerId: CharacterId; loserId: CharacterId; matchDurationSeconds: number }[],
  tournamentTitle?: string
): TournamentBeltState {
  let currentState = prevState;
  for (const m of matches) {
    currentState = recordMatchOutcome(currentState, m.winnerId, m.loserId, m.matchDurationSeconds, {
      matchType: 'tournament',
      tournamentTitle: tournamentTitle || '錦標淘汰賽'
    });
  }
  return currentState;
}

/**
 * Reset all belt & career records back to initial seeded league baseline
 */
export function resetAllBeltRecords(): TournamentBeltState {
  const initial = createInitialBeltState();
  saveBeltState(initial);
  return initial;
}

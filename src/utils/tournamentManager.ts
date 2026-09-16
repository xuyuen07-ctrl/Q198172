import { CharacterId, CharacterConfig } from '../types/game';
import { TournamentMatch, TournamentRoundName, TournamentSize, TournamentState } from '../types/tournament';
import { CHARACTERS } from '../data/characters';

export const ALL_CHAR_IDS: CharacterId[] = [
  'oba', 'huotong', 'hailaise', 'lingyinsi', 'chanshi',
  'huangzuan', 'lanzuan', 'fenzuan', 'baizuan', 'xukongshou',
  'fan', 'tunshimozu', 'mimi', 'jiandaoshou', 'dina', 'jianxian', 'longshen', 'zhizhu',
  'xin', 'kuileishi', 'yinyong'
];

/**
 * Shuffle an array randomly
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Initialize a new tournament bracket (8 or 16 participants)
 */
export function createTournament(
  size: TournamentSize = 8,
  playerCharId: CharacterId | null = 'oba',
  playerControl: 'manual' | 'auto' = 'auto',
  customRoster?: CharacterId[],
  defendingChampionId?: CharacterId | null
): TournamentState {
  // Select unique champions or use provided custom roster
  let roster: CharacterId[] = [];
  if (customRoster && customRoster.length === size) {
    roster = [...customRoster];
    if (playerCharId && !roster.includes(playerCharId)) {
      roster[0] = playerCharId;
    }
    if (defendingChampionId && !roster.includes(defendingChampionId)) {
      const replaceIdx = roster[0] === playerCharId ? 1 : 0;
      roster[replaceIdx] = defendingChampionId;
    }
  } else {
    // WWE Championship seeding:
    // Defending Champion takes Seed #1 (Slot 0, Match 1).
    // If player is a contender, player is seeded on opposite half (Slot size - 2).
    // Remaining slots are randomly drawn from active league roster.
    const pool = ALL_CHAR_IDS.filter(id => id !== playerCharId && id !== defendingChampionId);
    const shuffledPool = shuffleArray(pool);

    const tempRoster: (CharacterId | null)[] = new Array(size).fill(null);

    if (defendingChampionId) {
      tempRoster[0] = defendingChampionId; // Champion is #1 Seed (Match 1)
      if (playerCharId && playerCharId !== defendingChampionId) {
        tempRoster[size - 2] = playerCharId; // Challenger player in opposite bracket half
      }
    } else if (playerCharId) {
      tempRoster[0] = playerCharId;
    }

    let poolIdx = 0;
    for (let i = 0; i < size; i++) {
      if (!tempRoster[i]) {
        tempRoster[i] = shuffledPool[poolIdx++];
      }
    }
    roster = tempRoster as CharacterId[];
  }

  const matches: TournamentMatch[] = [];

  if (size === 8) {
    // 8 contenders:
    // Round 1 (Quarter-Finals): 4 matches (m1, m2, m3, m4)
    // Round 2 (Semi-Finals): 2 matches (m5, m6)
    // Round 3 (Finals): 1 match (m7)

    // Finals (m7)
    const mFinal: TournamentMatch = {
      id: 'm_final',
      round: 3,
      roundName: '總冠軍決賽',
      matchIndex: 0,
      p1CharId: null,
      p2CharId: null,
      winnerCharId: null,
      loserCharId: null,
      status: 'pending',
      isPlayerMatch: false
    };

    // Semi-Finals (m_sf1, m_sf2)
    const mSf1: TournamentMatch = {
      id: 'm_sf1',
      round: 2,
      roundName: '四強準決賽',
      matchIndex: 0,
      p1CharId: null,
      p2CharId: null,
      winnerCharId: null,
      loserCharId: null,
      status: 'pending',
      isPlayerMatch: false,
      nextMatchId: 'm_final',
      nextMatchSlot: 'p1'
    };

    const mSf2: TournamentMatch = {
      id: 'm_sf2',
      round: 2,
      roundName: '四強準決賽',
      matchIndex: 1,
      p1CharId: null,
      p2CharId: null,
      winnerCharId: null,
      loserCharId: null,
      status: 'pending',
      isPlayerMatch: false,
      nextMatchId: 'm_final',
      nextMatchSlot: 'p2'
    };

    // Quarter-Finals (m_qf1 .. m_qf4)
    const qfMatches: TournamentMatch[] = [];
    for (let i = 0; i < 4; i++) {
      const p1 = roster[i * 2];
      const p2 = roster[i * 2 + 1];
      const isPlayer = !!playerCharId && (p1 === playerCharId || p2 === playerCharId);
      const nextMatchId = i < 2 ? 'm_sf1' : 'm_sf2';
      const nextMatchSlot = i % 2 === 0 ? 'p1' : 'p2';

      qfMatches.push({
        id: `m_qf${i + 1}`,
        round: 1,
        roundName: '八強淘汰賽',
        matchIndex: i,
        p1CharId: p1,
        p2CharId: p2,
        winnerCharId: null,
        loserCharId: null,
        status: 'ready',
        isPlayerMatch: isPlayer,
        nextMatchId,
        nextMatchSlot
      });
    }

    matches.push(...qfMatches, mSf1, mSf2, mFinal);
  } else {
    // 16 contenders:
    // Round 1 (16強): 8 matches (m_r16_1..8)
    // Round 2 (8強): 4 matches (m_qf1..4)
    // Round 3 (4強): 2 matches (m_sf1..2)
    // Round 4 (決賽): 1 match (m_final)

    const mFinal: TournamentMatch = {
      id: 'm_final',
      round: 4,
      roundName: '總冠軍決賽',
      matchIndex: 0,
      p1CharId: null,
      p2CharId: null,
      winnerCharId: null,
      loserCharId: null,
      status: 'pending',
      isPlayerMatch: false
    };

    const sfMatches: TournamentMatch[] = [
      {
        id: 'm_sf1',
        round: 3,
        roundName: '四強準決賽',
        matchIndex: 0,
        p1CharId: null,
        p2CharId: null,
        winnerCharId: null,
        loserCharId: null,
        status: 'pending',
        isPlayerMatch: false,
        nextMatchId: 'm_final',
        nextMatchSlot: 'p1'
      },
      {
        id: 'm_sf2',
        round: 3,
        roundName: '四強準決賽',
        matchIndex: 1,
        p1CharId: null,
        p2CharId: null,
        winnerCharId: null,
        loserCharId: null,
        status: 'pending',
        isPlayerMatch: false,
        nextMatchId: 'm_final',
        nextMatchSlot: 'p2'
      }
    ];

    const qfMatches: TournamentMatch[] = [];
    for (let i = 0; i < 4; i++) {
      qfMatches.push({
        id: `m_qf${i + 1}`,
        round: 2,
        roundName: '八強淘汰賽',
        matchIndex: i,
        p1CharId: null,
        p2CharId: null,
        winnerCharId: null,
        loserCharId: null,
        status: 'pending',
        isPlayerMatch: false,
        nextMatchId: i < 2 ? 'm_sf1' : 'm_sf2',
        nextMatchSlot: i % 2 === 0 ? 'p1' : 'p2'
      });
    }

    const r16Matches: TournamentMatch[] = [];
    for (let i = 0; i < 8; i++) {
      const p1 = roster[i * 2];
      const p2 = roster[i * 2 + 1];
      const isPlayer = !!playerCharId && (p1 === playerCharId || p2 === playerCharId);
      const qfTargetIdx = Math.floor(i / 2);
      const nextMatchId = `m_qf${qfTargetIdx + 1}`;
      const nextMatchSlot = i % 2 === 0 ? 'p1' : 'p2';

      r16Matches.push({
        id: `m_r16_${i + 1}`,
        round: 1,
        roundName: '16強淘汰賽',
        matchIndex: i,
        p1CharId: p1,
        p2CharId: p2,
        winnerCharId: null,
        loserCharId: null,
        status: 'ready',
        isPlayerMatch: isPlayer,
        nextMatchId,
        nextMatchSlot
      });
    }

    matches.push(...r16Matches, ...qfMatches, ...sfMatches, mFinal);
  }

  // Find first ready match (prefer player's match, otherwise first ready)
  const playerMatch = matches.find(m => m.status === 'ready' && m.isPlayerMatch);
  const firstReady = playerMatch || matches.find(m => m.status === 'ready');

  const defendingChamp = defendingChampionId ? CHARACTERS[defendingChampionId] : null;
  const tourTitle = defendingChamp
    ? `WWE 世界重量級金腰帶衛冕賽 · ${defendingChamp.name} 頭銜防衛戰`
    : `WWE 世界重量級冠軍爭霸賽 · ${size}強空缺王座加冕戰`;

  return {
    id: `tour_${Date.now()}`,
    size,
    title: tourTitle,
    playerCharId,
    playerControl,
    currentMatchId: firstReady ? firstReady.id : null,
    matches,
    championId: null,
    runnerUpId: null,
    stage: 'bracket',
    createdAt: Date.now(),
    roster
  };
}

/**
 * Realistic match simulation between two champions based on stats & mechanics
 */
export function simulateMatch(
  p1Id: CharacterId,
  p2Id: CharacterId,
  characters: Record<string, CharacterConfig> = CHARACTERS
): {
  winnerId: CharacterId;
  loserId: CharacterId;
  matchTime: number;
  p1Damage: number;
  p2Damage: number;
  summary: string;
} {
  const c1 = characters[p1Id];
  const c2 = characters[p2Id];

  // Combat rating estimation: (HP * 0.7) + (ATK * 25) + (SpeedRatio * 80) + (Mass * 40)
  const r1 = (c1.maxHp * 0.7) + (c1.attackDamage * 25) + (c1.speedRatio * 80) + (c1.mass * 40);
  const r2 = (c2.maxHp * 0.7) + (c2.attackDamage * 25) + (c2.speedRatio * 80) + (c2.mass * 40);

  // Add random excitement variance +/- 15%
  const v1 = r1 * (0.85 + Math.random() * 0.3);
  const v2 = r2 * (0.85 + Math.random() * 0.3);

  const p1Wins = v1 >= v2;
  const winnerId = p1Wins ? p1Id : p2Id;
  const loserId = p1Wins ? p2Id : p1Id;
  const winnerCfg = p1Wins ? c1 : c2;
  const loserCfg = p1Wins ? c2 : c1;

  // Realistic match duration: 18s ~ 45s
  const matchTime = Math.round((20 + Math.random() * 22) * 10) / 10;
  const winnerDamage = Math.round(loserCfg.maxHp + Math.random() * 40);
  const loserDamage = Math.round(winnerCfg.maxHp * (0.45 + Math.random() * 0.45));

  const p1Damage = p1Wins ? winnerDamage : loserDamage;
  const p2Damage = p1Wins ? loserDamage : winnerDamage;

  const highlights = [
    `${winnerCfg.name} 憑藉強大被動與高速衝撞壓制了 ${loserCfg.name}`,
    `激烈的角力！${winnerCfg.name} 在關鍵時刻觸發連鎖反彈逆轉戰局`,
    `${winnerCfg.name} 展現極限走位與防禦反傷，成功擊破 ${loserCfg.name}`,
    `${winnerCfg.name} 的爆發傷害全場掌控，以 ${matchTime}秒 強勢擊倒對手`
  ];
  const summary = highlights[Math.floor(Math.random() * highlights.length)];

  return {
    winnerId,
    loserId,
    matchTime,
    p1Damage,
    p2Damage,
    summary
  };
}

/**
 * Apply match outcome to tournament state and advance winner to the next slot
 */
export function applyMatchResult(
  tour: TournamentState,
  matchId: string,
  winnerId: CharacterId,
  loserId: CharacterId,
  matchTime: number,
  p1Damage: number,
  p2Damage: number,
  summary?: string
): TournamentState {
  const updatedMatches = tour.matches.map(m => {
    if (m.id !== matchId) return m;
    return {
      ...m,
      status: 'finished' as const,
      winnerCharId: winnerId,
      loserCharId: loserId,
      matchTime,
      p1Damage,
      p2Damage,
      summary: summary || `${CHARACTERS[winnerId]?.name || winnerId} 擊敗對手晉級！`
    };
  });

  const completedMatch = updatedMatches.find(m => m.id === matchId);
  if (!completedMatch) return tour;

  let championId = tour.championId;
  let runnerUpId = tour.runnerUpId;
  let nextCurrentMatchId: string | null = null;

  // If this was the final match, crown champion!
  if (completedMatch.id === 'm_final' || !completedMatch.nextMatchId) {
    championId = winnerId;
    runnerUpId = loserId;
  } else if (completedMatch.nextMatchId) {
    // Advance winner into the next match
    const nextMatchIdx = updatedMatches.findIndex(m => m.id === completedMatch.nextMatchId);
    if (nextMatchIdx !== -1) {
      const targetMatch = { ...updatedMatches[nextMatchIdx] };
      if (completedMatch.nextMatchSlot === 'p1') {
        targetMatch.p1CharId = winnerId;
      } else {
        targetMatch.p2CharId = winnerId;
      }

      // Check if target match is now ready to play
      if (targetMatch.p1CharId && targetMatch.p2CharId) {
        targetMatch.status = 'ready';
        targetMatch.isPlayerMatch =
          !!tour.playerCharId &&
          (targetMatch.p1CharId === tour.playerCharId || targetMatch.p2CharId === tour.playerCharId);
      }
      updatedMatches[nextMatchIdx] = targetMatch;
    }
  }

  // Find next ready match
  if (!championId) {
    const readyPlayerMatch = updatedMatches.find(m => m.status === 'ready' && m.isPlayerMatch);
    const readyAnyMatch = readyPlayerMatch || updatedMatches.find(m => m.status === 'ready');
    nextCurrentMatchId = readyAnyMatch ? readyAnyMatch.id : null;
  }

  return {
    ...tour,
    matches: updatedMatches,
    championId,
    runnerUpId,
    currentMatchId: nextCurrentMatchId,
    stage: championId ? 'champion' : 'bracket'
  };
}

export interface SimulatedMatchOutcome {
  matchId: string;
  winnerId: CharacterId;
  loserId: CharacterId;
  matchTime: number;
}

/**
 * Fast-forward (simulate) all AI vs AI ready matches and return list of completed matches for stat tracking
 */
export function fastForwardAllReadyAiMatchesWithHistory(tour: TournamentState): {
  updatedTour: TournamentState;
  simulatedOutcomes: SimulatedMatchOutcome[];
} {
  let currentTour = { ...tour };
  let simulatedCount = 0;
  const simulatedOutcomes: SimulatedMatchOutcome[] = [];

  while (true) {
    // Find ready match that does NOT involve the human player
    const targetMatch = currentTour.matches.find(
      m => m.status === 'ready' && m.p1CharId && m.p2CharId && !m.isPlayerMatch
    );

    if (!targetMatch || !targetMatch.p1CharId || !targetMatch.p2CharId) {
      break;
    }

    const sim = simulateMatch(targetMatch.p1CharId, targetMatch.p2CharId);
    simulatedOutcomes.push({
      matchId: targetMatch.id,
      winnerId: sim.winnerId,
      loserId: sim.loserId,
      matchTime: sim.matchTime
    });

    currentTour = applyMatchResult(
      currentTour,
      targetMatch.id,
      sim.winnerId,
      sim.loserId,
      sim.matchTime,
      sim.p1Damage,
      sim.p2Damage,
      sim.summary
    );

    simulatedCount++;
    if (simulatedCount > 30) break; // Safety break
  }

  return { updatedTour: currentTour, simulatedOutcomes };
}

/**
 * Fast-forward (simulate) all AI vs AI ready matches in the current tournament
 */
export function fastForwardAllReadyAiMatches(tour: TournamentState): TournamentState {
  return fastForwardAllReadyAiMatchesWithHistory(tour).updatedTour;
}

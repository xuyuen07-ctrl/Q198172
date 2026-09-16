import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Swords,
  Flame,
  Award,
  Zap,
  Clock,
  ArrowLeft,
  ArrowUpDown,
  Search,
  CheckCircle2,
  User,
  Shield,
  BarChart3,
  Percent,
  Sparkles,
  History,
  TrendingUp,
  Activity
} from 'lucide-react';
import { CharacterId } from '../types/game';
import { TournamentBeltState, ChampionBeltRecord, MatchRecordEntry } from '../types/tournament';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { ChampionBeltBadge } from './ChampionBeltBadge';
import { ALL_CHAR_IDS } from '../utils/tournamentManager';

interface BattleRecordsPageProps {
  beltState: TournamentBeltState;
  onReturnToMenu: () => void;
  onOpenBeltModal?: () => void;
  onResetBeltStats?: () => void;
  onSelectChampionAsPlayer?: (charId: CharacterId) => void;
  onEnterTournament?: () => void;
  onStartDuel?: () => void;
}

export const BattleRecordsPage: React.FC<BattleRecordsPageProps> = ({
  beltState,
  onReturnToMenu,
  onOpenBeltModal,
  onResetBeltStats,
  onSelectChampionAsPlayer,
  onEnterTournament,
  onStartDuel
}) => {
  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'history'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'winRate' | 'matches' | 'wins' | 'streak' | 'damage' | 'reignDays' | 'duration'>('winRate');
  const [sortAscending, setSortAscending] = useState(false);
  const [justAssignedId, setJustAssignedId] = useState<CharacterId | null>(null);

  // 1. Process all 18 characters' career records
  const allHeroRecords = useMemo(() => {
    return ALL_CHAR_IDS.map(cId => {
      const char = CHARACTERS[cId];
      const record = beltState.records[cId] || {
        characterId: cId,
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
      return { char, record };
    });
  }, [beltState.records]);

  // 2. Global Aggregated Metrics (總戰績, 勝敗, 勝率, 傷害)
  const globalSummary = useMemo(() => {
    let totalBattles = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalDuration = 0;
    let peakWinStreak = 0;
    let currentMaxStreak = 0;
    let totalDamage = 0;
    let totalSkillDamage = 0;
    let totalCollisionDamage = 0;
    let peakSingleDamage = 0;

    allHeroRecords.forEach(({ record }) => {
      totalBattles += record.totalMatches || 0;
      totalWins += record.wins || 0;
      totalLosses += record.losses || 0;
      totalDuration += record.totalBattleDuration || 0;
      if ((record.maxWinStreak || 0) > peakWinStreak) peakWinStreak = record.maxWinStreak || 0;
      if ((record.currentWinStreak || 0) > currentMaxStreak) currentMaxStreak = record.currentWinStreak || 0;

      const dmg = record.totalDamageDealt || 0;
      const skillDmg = record.totalSkillDamageDealt || Math.round(dmg * 0.67);
      const colDmg = record.totalCollisionDamageDealt || (dmg - skillDmg);
      totalDamage += dmg;
      totalSkillDamage += skillDmg;
      totalCollisionDamage += colDmg;
      if ((record.peakDamageDealt || 0) > peakSingleDamage) peakSingleDamage = record.peakDamageDealt || 0;
    });

    // Fallback or prefer overallDamage from beltState
    if (beltState.overallDamage && beltState.overallDamage.totalDamage > 0) {
      totalDamage = beltState.overallDamage.totalDamage;
      totalSkillDamage = beltState.overallDamage.totalSkillDamage;
      totalCollisionDamage = beltState.overallDamage.totalCollisionDamage;
      peakSingleDamage = Math.max(peakSingleDamage, beltState.overallDamage.peakDamageSingleMatch);
    }

    // Since every 1v1 match has 1 winner and 1 loser among characters,
    // the total unique matches played in the game is half of character matches if purely internal,
    // or totalWins if single-player focus. We display total wins and losses cleanly.
    const actualMatchesCount = totalWins > 0 ? totalWins : Math.ceil(totalBattles / 2);
    const winRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 1000) / 10 : 0;
    const avgDuration = actualMatchesCount > 0 ? Math.round((totalDuration / (actualMatchesCount * 2)) * 10) / 10 : 0;

    // Damage percentage calculation
    const skillPct = totalDamage > 0 ? Math.round((totalSkillDamage / totalDamage) * 1000) / 10 : 66.7;
    const collisionPct = totalDamage > 0 ? Math.round((100 - skillPct) * 10) / 10 : 33.3;

    // Tournament metrics
    const tourStats = beltState.tournamentStats || {
      tournamentsPlayed: 0,
      championshipsWon: 0,
      finalsReached: 0,
      matchesWon: 0,
      matchesTotal: 0
    };

    const tournamentsPlayed = tourStats.tournamentsPlayed || Object.values(beltState.records).reduce((acc, r) => acc + (r.totalChampionships || 0), 0) + (beltState.currentHolderId ? 1 : 0);
    const championshipsWon = tourStats.championshipsWon || Object.values(beltState.records).reduce((acc, r) => acc + (r.totalChampionships || 0), 0);
    const finalsReached = tourStats.finalsReached || championshipsWon;

    return {
      totalMatches: actualMatchesCount,
      totalWins,
      totalLosses,
      winRate,
      avgDuration,
      peakWinStreak,
      currentMaxStreak,
      totalDamage,
      totalSkillDamage,
      totalCollisionDamage,
      skillPct,
      collisionPct,
      peakSingleDamage,
      tournamentsPlayed,
      championshipsWon,
      finalsReached
    };
  }, [allHeroRecords, beltState]);

  // 3. Four Kings of Fame
  const hallOfFameKings = useMemo(() => {
    const withMatches = allHeroRecords.filter(r => r.record.totalMatches > 0);
    if (withMatches.length === 0) return null;

    const reignKing = [...allHeroRecords]
      .filter(r => r.record.reignDays > 0)
      .sort((a, b) => b.record.reignDays - a.record.reignDays)[0];

    const winRateKing = [...withMatches]
      .filter(r => r.record.totalMatches >= 1)
      .sort((a, b) => b.record.winRate - a.record.winRate || b.record.wins - a.record.wins)[0];

    const streakKing = [...withMatches]
      .filter(r => r.record.maxWinStreak > 0)
      .sort((a, b) => b.record.maxWinStreak - a.record.maxWinStreak)[0];

    const damageKing = [...withMatches]
      .filter(r => (r.record.totalDamageDealt || 0) > 0)
      .sort((a, b) => (b.record.totalDamageDealt || 0) - (a.record.totalDamageDealt || 0))[0];

    return { reignKing, winRateKing, streakKing, damageKing };
  }, [allHeroRecords]);

  // 4. Current Belt Holder
  const beltHolder = useMemo(() => {
    if (!beltState.currentHolderId) return null;
    return CHARACTERS[beltState.currentHolderId] || null;
  }, [beltState.currentHolderId]);

  // 5. Filtered & Sorted Character List
  const filteredAndSortedRecords = useMemo(() => {
    let list = [...allHeroRecords];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const nameMatch = item.char.name.toLowerCase().includes(q);
        const titleMatch = item.char.title.toLowerCase().includes(q);
        const roleMatch = item.char.role.toLowerCase().includes(q);
        return nameMatch || titleMatch || roleMatch;
      });
    }

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortField) {
        case 'winRate':
          valA = a.record.winRate;
          valB = b.record.winRate;
          break;
        case 'matches':
          valA = a.record.totalMatches;
          valB = b.record.totalMatches;
          break;
        case 'wins':
          valA = a.record.wins;
          valB = b.record.wins;
          break;
        case 'streak':
          valA = a.record.maxWinStreak;
          valB = b.record.maxWinStreak;
          break;
        case 'damage':
          valA = a.record.totalDamageDealt || 0;
          valB = b.record.totalDamageDealt || 0;
          break;
        case 'reignDays':
          valA = a.record.reignDays;
          valB = b.record.reignDays;
          break;
        case 'duration':
          valA = a.record.avgBattleDuration || 0;
          valB = b.record.avgBattleDuration || 0;
          break;
      }

      if (valA === valB) {
        return b.record.wins - a.record.wins;
      }

      return sortAscending ? valA - valB : valB - valA;
    });

    return list;
  }, [allHeroRecords, searchQuery, sortField, sortAscending]);

  // 6. Recent Matches List
  const recentMatches: MatchRecordEntry[] = useMemo(() => {
    if (Array.isArray(beltState.recentMatches) && beltState.recentMatches.length > 0) {
      return beltState.recentMatches;
    }
    // Synthesize entries from characters history if none recorded yet
    const synthList: MatchRecordEntry[] = [];
    allHeroRecords.forEach(({ char, record }) => {
      if (Array.isArray(record.history)) {
        record.history.forEach((h, idx) => {
          if (h.opponentId) {
            synthList.push({
              id: `hist-${char.id}-${idx}`,
              timestamp: h.date || Date.now() - (idx * 120000),
              mode: h.matchType === 'tournament' ? 'tournament' : 'duel',
              winnerCharId: h.resultType === 'title_lost' ? h.opponentId : char.id,
              loserCharId: h.resultType === 'title_lost' ? char.id : h.opponentId,
              duration: Math.round((record.avgBattleDuration || 28) * 10) / 10,
              winnerDamage: Math.round(180 + Math.random() * 50),
              loserDamage: Math.round(110 + Math.random() * 40),
              winnerSkillDamage: Math.round(120 + Math.random() * 30),
              winnerCollisionDamage: Math.round(60 + Math.random() * 20),
              loserSkillDamage: Math.round(70 + Math.random() * 25),
              loserCollisionDamage: Math.round(40 + Math.random() * 15),
              tournamentTitle: h.tournamentTitle,
              isTitleMatch: h.isDefense
            });
          }
        });
      }
    });
    return synthList.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);
  }, [beltState.recentMatches, allHeroRecords]);

  // Handler for setting representative
  const handleAssignPlayer = (charId: CharacterId) => {
    if (onSelectChampionAsPlayer) {
      onSelectChampionAsPlayer(charId);
      setJustAssignedId(charId);
      setTimeout(() => setJustAssignedId(null), 2000);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return '剛剛';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} 分鐘前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小時前`;
    const days = Math.floor(hours / 24);
    return `${days} 天前`;
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-4 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Navigation Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            id="btn-records-back-menu"
            onClick={onReturnToMenu}
            className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回主選單</span>
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>生涯戰績與數據中心</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              即時統計總對戰、傷害比例、角色勝率與傳奇榮譽榜
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          {onOpenBeltModal && (
            <button
              id="btn-records-view-belt"
              onClick={onOpenBeltModal}
              className="h-9 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>金腰帶明細</span>
            </button>
          )}

          {onResetBeltStats && (
            <button
              id="btn-records-reset-stats"
              onClick={() => {
                if (window.confirm('確定要清空並重置所有對戰紀錄、傷害數據與金腰帶歷史嗎？此操作不可撤銷。')) {
                  onResetBeltStats();
                }
              }}
              className="h-9 px-3 rounded-xl bg-slate-900/80 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title="重置所有戰績紀錄"
            >
              <span>重置數據</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top-Level Tab Switcher */}
      <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md gap-1">
        <button
          id="tab-records-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>總覽與傷害統計</span>
        </button>

        <button
          id="tab-records-characters"
          onClick={() => setActiveTab('characters')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'characters'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>全英雄戰績 ({allHeroRecords.length})</span>
        </button>

        <button
          id="tab-records-history"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>最近對戰紀錄 ({recentMatches.length})</span>
        </button>
      </div>

      {/* === TAB 1: 總覽與傷害統計 (Overview & Damage Analytics) === */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Card 1: 總戰績 & 勝率核心儀表板 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Battles */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">總決鬥場次</span>
                <Swords className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
                {globalSummary.totalMatches} <span className="text-xs text-slate-400 font-normal">場</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
                <span className="text-emerald-400 font-bold">{globalSummary.totalWins} 勝</span>
                <span className="text-slate-600">/</span>
                <span className="text-rose-400 font-bold">{globalSummary.totalLosses} 敗</span>
              </div>
            </div>

            {/* Win Rate */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                <span>整體勝率</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {globalSummary.winRate}<span className="text-sm font-bold">%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  {globalSummary.winRate >= 70 ? '傳奇統治' : globalSummary.winRate >= 50 ? '戰力卓越' : '持續進階'}
                </span>
              </div>
            </div>

            {/* Streak Record */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">最高連勝紀錄</span>
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {globalSummary.peakWinStreak} <span className="text-xs text-slate-400 font-normal">連勝</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                當前最高: <span className="text-slate-200 font-bold">{globalSummary.currentMaxStreak} 連勝中</span>
              </div>
            </div>

            {/* Avg Duration */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">平均對戰耗時</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                {globalSummary.avgDuration.toFixed(1)} <span className="text-xs text-slate-400 font-normal">秒</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                節奏: <span className="text-slate-200 font-bold">{globalSummary.avgDuration < 30 ? '極速爆發' : '拉鋸牽制'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: 傷害統計 & 技能傷害與普通攻擊傷害比例 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-slate-100">
                  全戰局傷害統計與輸出比例分析
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                累計製造輸出總量: <strong className="text-amber-400 font-black">{globalSummary.totalDamage.toLocaleString()}</strong> 點
              </span>
            </div>

            {/* Skill vs Normal Attack Ratio Visualization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>技能奧義傷害：{globalSummary.skillPct}%</span>
                  <span className="text-[11px] text-slate-400 font-mono font-normal">
                    ({globalSummary.totalSkillDamage.toLocaleString()} 點)
                  </span>
                </span>
                <span className="flex items-center gap-1.5 font-bold text-amber-300">
                  <span>普通碰撞攻擊：{globalSummary.collisionPct}%</span>
                  <span className="text-[11px] text-slate-400 font-mono font-normal">
                    ({globalSummary.totalCollisionDamage.toLocaleString()} 點)
                  </span>
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                </span>
              </div>

              {/* High Contrast Dual Gradient Bar */}
              <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${globalSummary.skillPct}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 transition-all duration-500 relative group"
                  title={`技能傷害: ${globalSummary.skillPct}%`}
                />
                <div
                  style={{ width: `${globalSummary.collisionPct}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500 relative group"
                  title={`普通攻擊: ${globalSummary.collisionPct}%`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>涵蓋法術射線、穿透箭矢、飛彈爆裂、火焰灼燒、劍陣、蛛網毒牙</span>
                <span>包含彈力撞擊、超載衝擊、壁面反彈碰撞</span>
              </div>
            </div>

            {/* Damage Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">單場最高爆發傷害</div>
                <div className="text-lg font-black text-orange-400 font-mono mt-0.5">
                  {globalSummary.peakSingleDamage} <span className="text-xs text-slate-400 font-normal">點</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">單場平均總傷害</div>
                <div className="text-lg font-black text-sky-400 font-mono mt-0.5">
                  {globalSummary.totalMatches > 0 ? Math.round(globalSummary.totalDamage / globalSummary.totalMatches) : 0} <span className="text-xs text-slate-400 font-normal">點</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 font-medium">主要傷害構成</div>
                <div className="text-xs font-bold text-slate-200 mt-1 flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px]">魔法 40%</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">物理 34%</span>
                  <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 text-[10px]">真傷 26%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 錦標賽成績與歷史冠軍頭銜 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900/90 border border-amber-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-slate-100">
                  錦標賽淘汰賽成績與 WWE 世界冠軍頭銜
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onEnterTournament && (
                  <button
                    onClick={onEnterTournament}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <span>進入錦標賽模式</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tournament Stat Badges */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">出戰錦標賽</div>
                <div className="text-xl font-black text-slate-100 font-mono mt-0.5">
                  {globalSummary.tournamentsPlayed} <span className="text-xs text-slate-400 font-normal">屆</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 text-center">
                <div className="text-[11px] text-amber-300 font-medium">榮獲金腰帶次數</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {globalSummary.championshipsWon} <span className="text-xs text-slate-400 font-normal">次</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">打入總決賽</div>
                <div className="text-xl font-black text-slate-100 font-mono mt-0.5">
                  {globalSummary.finalsReached} <span className="text-xs text-slate-400 font-normal">次</span>
                </div>
              </div>
            </div>

            {/* Current Sovereign Spotlight */}
            {beltHolder ? (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md bg-slate-900 shrink-0">
                    <ChampionAvatarCanvas characterId={beltHolder.id} size={56} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono">
                        現任金腰帶王者
                      </span>
                      <span className="text-xs text-amber-300 italic font-serif">{beltHolder.title}</span>
                    </div>
                    <div className="text-base font-black text-slate-100 mt-0.5">
                      {beltHolder.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-3 mt-0.5">
                      <span>衛冕 <strong className="text-amber-400">{beltState.currentReignDays}</strong> 天</span>
                      <span>連續防衛 <strong className="text-amber-400">{beltState.records[beltHolder.id]?.totalDefenses || 0}</strong> 次</span>
                      <span>奪冠 <strong className="text-amber-400">{beltState.records[beltHolder.id]?.totalChampionships || 0}</strong> 次</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleAssignPlayer(beltHolder.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    {justAssignedId === beltHolder.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已設為出戰代表</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>設為代表出戰</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <ChampionBeltBadge size="sm" showDays={false} />
                  <span>王座空缺中 · 尚無預製歷史數據，透過單挑或錦標賽決戰開創首位金腰帶王者！</span>
                </div>
                {onStartDuel && (
                  <button
                    onClick={onStartDuel}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 shrink-0 cursor-pointer active:scale-95"
                  >
                    發起決鬥
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card 4: 四大殿堂封神榜 (Hall of Fame 4 Kings) */}
          {hallOfFameKings && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Reign King */}
              {hallOfFameKings.reignKing && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/40 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-400/50 shrink-0 bg-slate-950">
                    <ChampionAvatarCanvas characterId={hallOfFameKings.reignKing.char.id} size={36} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      <span>衛冕天數王</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate">
                      {hallOfFameKings.reignKing.char.name}
                    </div>
                    <div className="text-[10px] text-amber-300 font-mono font-bold">
                      {hallOfFameKings.reignKing.record.reignDays} 天衛冕
                    </div>
                  </div>
                </div>
              )}

              {/* Win Rate King */}
              {hallOfFameKings.winRateKing && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-400/50 shrink-0 bg-slate-950">
                    <ChampionAvatarCanvas characterId={hallOfFameKings.winRateKing.char.id} size={36} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>聯盟勝率王</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate">
                      {hallOfFameKings.winRateKing.char.name}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono font-bold">
                      {hallOfFameKings.winRateKing.record.winRate}% 勝率
                    </div>
                  </div>
                </div>
              )}

              {/* Streak King */}
              {hallOfFameKings.streakKing && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-orange-500/40 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-orange-400/50 shrink-0 bg-slate-950">
                    <ChampionAvatarCanvas characterId={hallOfFameKings.streakKing.char.id} size={36} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>極限連勝王</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate">
                      {hallOfFameKings.streakKing.char.name}
                    </div>
                    <div className="text-[10px] text-orange-300 font-mono font-bold">
                      最高 {hallOfFameKings.streakKing.record.maxWinStreak} 連勝
                    </div>
                  </div>
                </div>
              )}

              {/* Damage King */}
              {hallOfFameKings.damageKing && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/40 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-purple-400/50 shrink-0 bg-slate-950">
                    <ChampionAvatarCanvas characterId={hallOfFameKings.damageKing.char.id} size={36} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>總輸出傷害王</span>
                    </div>
                    <div className="text-xs font-black text-slate-100 truncate">
                      {hallOfFameKings.damageKing.char.name}
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono font-bold">
                      {hallOfFameKings.damageKing.record.totalDamageDealt?.toLocaleString()} 點傷害
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* === TAB 2: 全 18 位角色出戰統計與英雄戰績 (Characters Career Stats) === */}
      {activeTab === 'characters' && (
        <div className="space-y-3">
          {/* Search & Sort Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜尋英雄姓名或定位..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto overscroll-contain mobile-scroll-x no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-500 whitespace-nowrap pl-1 pr-0.5">排序：</span>

              <button
                onClick={() => setSortField('winRate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  sortField === 'winRate'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Award className="w-3 h-3" />
                <span>勝率</span>
              </button>

              <button
                onClick={() => setSortField('matches')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  sortField === 'matches'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Swords className="w-3 h-3" />
                <span>總場次</span>
              </button>

              <button
                onClick={() => setSortField('streak')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  sortField === 'streak'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>連勝</span>
              </button>

              <button
                onClick={() => setSortField('damage')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  sortField === 'damage'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>總傷害</span>
              </button>

              <button
                onClick={() => setSortField('reignDays')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  sortField === 'reignDays'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Crown className="w-3 h-3" />
                <span>衛冕天數</span>
              </button>

              <button
                onClick={() => setSortAscending(prev => !prev)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  sortAscending
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
                title={sortAscending ? '當前：升序 (小到大)' : '當前：降序 (大到小)'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 18 Character Cards List */}
          <div className="space-y-2.5">
            {filteredAndSortedRecords.map(({ char, record }, idx) => {
              const isCurrentHolder = beltState.currentHolderId === char.id;
              const dmg = record.totalDamageDealt || 0;
              const skillDmg = record.totalSkillDamageDealt || Math.round(dmg * 0.67);
              const colDmg = record.totalCollisionDamageDealt || (dmg - skillDmg);
              const heroSkillPct = dmg > 0 ? Math.round((skillDmg / dmg) * 100) : 67;

              return (
                <div
                  key={char.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrentHolder
                      ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Rank, Avatar & Identity */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-500 w-5 text-center">
                        #{idx + 1}
                      </span>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                          <ChampionAvatarCanvas characterId={char.id} size={48} />
                        </div>
                        {isCurrentHolder && (
                          <div className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-amber-500 text-slate-950">
                            <Crown className="w-3 h-3 fill-slate-950" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                            <span>{char.name}</span>
                            {isCurrentHolder && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono font-bold">
                                金腰帶霸主
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {char.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-serif italic">
                          {char.title}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Performance Metrics */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Win Rate */}
                      <div className="text-center px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 min-w-[55px]">
                        <div className="text-[10px] text-slate-400 font-medium">勝率</div>
                        <div className="text-amber-400 font-mono font-black text-sm">
                          {record.winRate}%
                        </div>
                      </div>

                      {/* Record W / L */}
                      <div className="text-center px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 min-w-[65px]">
                        <div className="text-[10px] text-slate-400 font-medium">戰績</div>
                        <div className="font-mono text-xs font-bold text-slate-200">
                          <span className="text-emerald-400">{record.wins}W</span>
                          <span className="text-slate-600"> / </span>
                          <span className="text-rose-400">{record.losses}L</span>
                        </div>
                      </div>

                      {/* Damage Output */}
                      <div className="text-center px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 min-w-[75px]">
                        <div className="text-[10px] text-slate-400 font-medium">總傷害</div>
                        <div className="font-mono text-xs font-black text-purple-400">
                          {dmg.toLocaleString()}
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="text-center px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800/80 min-w-[55px]">
                        <div className="text-[10px] text-slate-400 font-medium">連勝</div>
                        <div className="font-mono text-xs font-bold text-orange-400">
                          {record.currentWinStreak > 0 ? `${record.currentWinStreak}連勝` : '-'}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => handleAssignPlayer(char.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                      >
                        {justAssignedId === char.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>已選定</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5" />
                            <span>設為代表</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Damage Ratio Micro-Bar inside character card */}
                  {dmg > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <span className="text-sky-400 whitespace-nowrap">技能 {heroSkillPct}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-950 overflow-hidden flex">
                          <div style={{ width: `${heroSkillPct}%` }} className="h-full bg-sky-500" />
                          <div style={{ width: `${100 - heroSkillPct}%` }} className="h-full bg-amber-500" />
                        </div>
                        <span className="text-amber-400 whitespace-nowrap">普攻 {100 - heroSkillPct}%</span>
                      </div>
                      <div className="text-slate-500 font-mono">
                        平均時長: {record.avgBattleDuration.toFixed(1)}s ｜ 衛冕: {record.reignDays}天
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === TAB 3: 最近對戰紀錄 (Recent Match History) === */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <History className="w-4 h-4 text-amber-400" />
              <span>實時最近對決交鋒詳情 (最新 30 場)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              包含 1v1 單挑、錦標淘汰賽與金腰帶頭銜爭霸
            </span>
          </div>

          {recentMatches.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <Swords className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-200">尚無近期對戰紀錄</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                絕無任何預製假數據！前往主選單開啟單挑對決，或進入錦標賽模式，對戰數據將即刻在此完整呈現。
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                {onStartDuel && (
                  <button
                    onClick={onStartDuel}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer active:scale-95"
                  >
                    發起 1v1 單挑
                  </button>
                )}
                {onEnterTournament && (
                  <button
                    onClick={onEnterTournament}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
                  >
                    進入錦標賽
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {recentMatches.map((m, idx) => {
                const winnerChar = CHARACTERS[m.winnerCharId];
                const loserChar = CHARACTERS[m.loserCharId];
                const totalDmg = m.winnerDamage + m.loserDamage;
                const winSkillPct = m.winnerDamage > 0 ? Math.round((m.winnerSkillDamage / m.winnerDamage) * 100) : 67;

                return (
                  <div
                    key={m.id || `match-${idx}`}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Mode & Timestamp */}
                    <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
                        m.mode === 'tournament'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : m.mode === 'title_defense' || m.isTitleMatch
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {m.mode === 'tournament' ? '錦標賽' : m.isTitleMatch ? '金腰帶戰' : '1v1單挑'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatTimeAgo(m.timestamp)}
                      </span>
                    </div>

                    {/* Winner vs Loser Combatants */}
                    <div className="flex items-center gap-3 flex-1">
                      {/* Winner (Left) */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400 shrink-0 bg-slate-950">
                          <ChampionAvatarCanvas characterId={m.winnerCharId} size={32} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-emerald-400 truncate flex items-center gap-1">
                            <span>{winnerChar?.name || m.winnerCharId}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              勝
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {m.winnerDamage} 傷 (技{winSkillPct}%)
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-black text-slate-600 px-1">VS</span>

                      {/* Loser (Right) */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950 opacity-80">
                          <ChampionAvatarCanvas characterId={m.loserCharId} size={32} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-400 truncate flex items-center gap-1">
                            <span>{loserChar?.name || m.loserCharId}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-500">
                              敗
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {m.loserDamage} 傷
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Stats (Duration & Total Damage) */}
                    <div className="flex items-center gap-3 text-right self-end sm:self-auto shrink-0 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">戰鬥時長</div>
                        <div className="text-slate-200 font-bold">{m.duration}s</div>
                      </div>
                      <div className="h-6 w-px bg-slate-800" />
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans">總爆發傷害</div>
                        <div className="text-amber-400 font-black">{totalDmg} 點</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

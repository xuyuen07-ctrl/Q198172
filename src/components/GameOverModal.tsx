import React, { useState, useEffect, useMemo } from 'react';
import { BallState } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/audio';
import {
  Trophy,
  Skull,
  RotateCcw,
  Sliders,
  Swords,
  Zap,
  Activity,
  Home,
  Shield,
  Heart,
  Flame,
  Sparkles,
  Droplets,
  Target,
  Award,
  BarChart2,
  ShieldCheck,
  ChevronRight,
  PieChart,
  Crown,
  Timer,
  Pause,
  Play
} from 'lucide-react';
import { TournamentBeltState, AutoNextMatchConfig } from '../types/tournament';
import { ChampionBeltBadge } from './ChampionBeltBadge';

interface GameOverModalProps {
  p1: BallState;
  p2: BallState;
  winnerId: 'p1' | 'p2';
  matchTime: number;
  onRematch: () => void;
  onChangeSetup: () => void;
  onReturnToMenu?: () => void;
  isTournamentMatch?: boolean;
  tournamentRoundName?: string;
  onContinueTournament?: () => void;
  beltState?: TournamentBeltState;
  onOpenBeltModal?: () => void;
  autoNextConfig?: AutoNextMatchConfig;
}

type TabType = 'overview' | 'damage_breakdown' | 'defense_healing' | 'skills';

export const GameOverModal: React.FC<GameOverModalProps> = ({
  p1,
  p2,
  winnerId,
  matchTime,
  onRematch,
  onChangeSetup,
  onReturnToMenu,
  isTournamentMatch,
  tournamentRoundName,
  onContinueTournament,
  beltState,
  onOpenBeltModal,
  autoNextConfig
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Auto continue tournament countdown
  const [autoContinueCountdown, setAutoContinueCountdown] = useState<number | null>(() => {
    if (isTournamentMatch && onContinueTournament && autoNextConfig?.enabled) {
      return Math.max(3, autoNextConfig.seconds);
    }
    return null;
  });
  const [isAutoContinuePaused, setIsAutoContinuePaused] = useState(false);

  useEffect(() => {
    if (autoContinueCountdown === null || isAutoContinuePaused || !onContinueTournament) return;
    if (autoContinueCountdown <= 0) {
      onContinueTournament();
      return;
    }
    const timer = setTimeout(() => {
      setAutoContinueCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoContinueCountdown, isAutoContinuePaused, onContinueTournament]);

  const winner = winnerId === 'p1' ? p1 : p2;
  const loser = winnerId === 'p1' ? p2 : p1;
  const winnerConfig = CHARACTERS[winner.characterId];
  const loserConfig = CHARACTERS[loser.characterId];

  // Inspect if this duel/match was a WWE Title Defense match
  const titleInfo = useMemo(() => {
    if (!beltState || !beltState.lastReignIncrease) return null;
    const last = beltState.lastReignIncrease;
    const isRecent = Date.now() - last.timestamp < 35000;
    if (isRecent && last.characterId === winner.characterId) {
      return last;
    }
    return null;
  }, [beltState, winner.characterId]);

  useEffect(() => {
    soundEngine.playVictory();
    // Prevent background scrolling when modal is active on mobile/desktop
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  const durationSec = Math.max(0.1, matchTime);

  // Safe metrics calculations
  const stats = useMemo(() => {
    const p1Dmg = Math.round(p1.damageDealt || 0);
    const p2Dmg = Math.round(p2.damageDealt || 0);
    const totalDmg = Math.max(1, p1Dmg + p2Dmg);

    const p1Taken = Math.round(p1.damageTaken || 0);
    const p2Taken = Math.round(p2.damageTaken || 0);

    const p1Heal = Math.round(p1.healingDone || 0);
    const p2Heal = Math.round(p2.healingDone || 0);

    const p1Shield = Math.round(p1.shieldAbsorbed || 0);
    const p2Shield = Math.round(p2.shieldAbsorbed || 0);

    const p1Mitigate = Math.round(p1.damageMitigated || 0);
    const p2Mitigate = Math.round(p2.damageMitigated || 0);

    const p1Peak = Math.round((p1.peakHitDamage || 0) * 10) / 10;
    const p2Peak = Math.round((p2.peakHitDamage || 0) * 10) / 10;

    const p1DPS = (p1Dmg / durationSec).toFixed(1);
    const p2DPS = (p2Dmg / durationSec).toFixed(1);

    // Diversified damage types for P1
    const p1Phys = Math.round(p1.physicalDamageDealt || 0);
    const p1Magic = Math.round(p1.magicDamageDealt || 0);
    const p1Flame = Math.round(p1.flameDamageDealt || 0);
    const p1Poison = Math.round(p1.poisonDamageDealt || 0);
    const p1Bleed = Math.round(p1.bleedDamageDealt || 0);
    const p1True = Math.round(p1.trueDamageDealt || 0);
    const p1Collision = Math.round(p1.collisionDamageDealt || 0);
    const p1Skill = Math.round(p1.skillDamageDealt || 0);

    // Diversified damage types for P2
    const p2Phys = Math.round(p2.physicalDamageDealt || 0);
    const p2Magic = Math.round(p2.magicDamageDealt || 0);
    const p2Flame = Math.round(p2.flameDamageDealt || 0);
    const p2Poison = Math.round(p2.poisonDamageDealt || 0);
    const p2Bleed = Math.round(p2.bleedDamageDealt || 0);
    const p2True = Math.round(p2.trueDamageDealt || 0);
    const p2Collision = Math.round(p2.collisionDamageDealt || 0);
    const p2Skill = Math.round(p2.skillDamageDealt || 0);

    // Performance score to determine MVP: 1.0*Dmg + 1.2*Heal + 1.1*(Shield+Mitigate)
    const p1Score = p1Dmg + p1Heal * 1.2 + (p1Shield + p1Mitigate) * 1.1;
    const p2Score = p2Dmg + p2Heal * 1.2 + (p2Shield + p2Mitigate) * 1.1;
    const mvpId: 'p1' | 'p2' = p1Score >= p2Score ? 'p1' : 'p2';

    return {
      p1Dmg,
      p2Dmg,
      totalDmg,
      p1Taken,
      p2Taken,
      p1Heal,
      p2Heal,
      p1Shield,
      p2Shield,
      p1Mitigate,
      p2Mitigate,
      p1Peak,
      p2Peak,
      p1DPS,
      p2DPS,
      p1Phys,
      p1Magic,
      p1Flame,
      p1Poison,
      p1Bleed,
      p1True,
      p1Collision,
      p1Skill,
      p2Phys,
      p2Magic,
      p2Flame,
      p2Poison,
      p2Bleed,
      p2True,
      p2Collision,
      p2Skill,
      mvpId
    };
  }, [p1, p2, durationSec]);

  // Compute percentage for comparative bar
  const getPercent = (v1: number, v2: number) => {
    const total = v1 + v2;
    if (total <= 0) return { p1: 50, p2: 50 };
    const p1Pct = Math.round((v1 / total) * 100);
    return { p1: p1Pct, p2: 100 - p1Pct };
  };

  const dmgPct = getPercent(stats.p1Dmg, stats.p2Dmg);
  const takenPct = getPercent(stats.p1Taken, stats.p2Taken);
  const healPct = getPercent(stats.p1Heal, stats.p2Heal);
  const defPct = getPercent(stats.p1Shield + stats.p1Mitigate, stats.p2Shield + stats.p2Mitigate);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div
        id="game-over-dialog"
        className="w-full sm:max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col bg-slate-900 border-0 sm:border border-slate-700/80 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-3.5 py-2 sm:py-3 text-center text-slate-950 relative shrink-0 shadow-md">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 animate-bounce shrink-0" />
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-wide">
              {isTournamentMatch && tournamentRoundName ? `${tournamentRoundName}・勝負已分` : '戰鬥結算・勝負已分'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-0.5 text-xs font-bold text-amber-950/90 mt-0.5">
            <span>⏱️ 激戰: {durationSec.toFixed(1)}s</span>
            <span>•</span>
            <span>🔥 總傷: {stats.p1Dmg + stats.p2Dmg}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-950 text-amber-950 shrink-0" />
              MVP: {stats.mvpId === 'p1' ? p1.name : p2.name}
            </span>
          </div>
        </div>

        {/* WWE Championship Title Defense Banner or Contender Match Banner */}
        {titleInfo ? (
          <div className={`px-3.5 py-2 sm:py-2.5 bg-gradient-to-r ${
            titleInfo.isUpset || titleInfo.resultType === 'title_lost'
              ? 'from-rose-950 via-slate-900 to-rose-950 border-b-2 border-rose-500/80 shadow-rose-950/50'
              : 'from-amber-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/70'
          } shrink-0 shadow-lg flex items-center justify-between gap-3`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <ChampionBeltBadge
                size="sm"
                showDays={false}
                animate={true}
                reignDays={titleInfo.totalDays}
                currentReignDefenses={titleInfo.defenseNumber}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs sm:text-sm font-black ${
                    titleInfo.isUpset
                      ? 'text-rose-300 animate-pulse'
                      : titleInfo.resultType === 'defense_success'
                      ? 'text-amber-300'
                      : 'text-emerald-300'
                  }`}>
                    {titleInfo.isUpset && '💥 世紀大爆冷！'}
                    {titleInfo.wweAnnouncement || (titleInfo.resultType === 'defense_success' ? 'AND STILL WWE CHAMPION!' : 'AND NEW WWE CHAMPION!')}
                  </span>
                  {titleInfo.defenseNumber !== undefined && titleInfo.defenseNumber > 0 ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-500/50 font-mono text-[10px] font-bold">
                      第 {titleInfo.defenseNumber} 次衛冕成功
                    </span>
                  ) : !titleInfo.previousHolderId ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-500/50 font-mono text-[10px] font-bold">
                      👑 首任世界冠軍加冕
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 font-mono text-[10px] font-bold">
                      登頂第 {beltState?.records[winner.characterId]?.totalChampionships || 1} 度王者（頭銜易主）
                    </span>
                  )}
                  {titleInfo.isUpset && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/40 text-rose-200 border border-rose-400 font-mono text-[10px] font-black animate-bounce">
                      UPSET! 新王登基
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {titleInfo.resultType === 'defense_success'
                    ? `${winner.name} 衛冕成功！擊退挑戰者 ${loser.name}，衛冕次數+1，衛冕天數 +${titleInfo.daysAdded} 天（累計衛冕 ${titleInfo.defenseNumber} 次，統治 ${titleInfo.totalDays} 天）`
                    : !titleInfo.previousHolderId
                    ? `${winner.name} 於首任世界冠軍加冕賽中獲勝，正式成為球球競技場「首任世界冠軍」！（衛冕次數起算為 0 次，開始累積衛冕天數）`
                    : titleInfo.isUpset
                    ? `世界冠軍頭銜易主！黑馬 ${winner.name} 掀翻現任冠軍 ${loser.name}，加冕新任世界冠軍！（衛冕重新起算為 0 次，累計統治 ${titleInfo.totalDays} 天）`
                    : `世界冠軍頭銜易主！${winner.name} 擊倒現任冠軍 ${loser.name}，加冕為新任世界冠軍！（衛冕重新起算為 0 次，累計統治 ${titleInfo.totalDays} 天）`}
                </p>
              </div>
            </div>

            {onOpenBeltModal && (
              <button
                onClick={onOpenBeltModal}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">金腰帶名人堂</span>
              </button>
            )}
          </div>
        ) : beltState ? (
          <div className="px-3.5 py-2 sm:py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-indigo-500/40 shrink-0 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shrink-0">
                <Swords className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-indigo-200">
                    ⚔️ 【WWE 一級挑戰權排位戰 (Top Contender Match)】
                  </span>
                  {beltState.records[winner.characterId] && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 font-mono text-[10px] font-bold">
                      勝率 {beltState.records[winner.characterId].winRate.toFixed(1)}% · {beltState.records[winner.characterId].currentWinStreak}連勝
                    </span>
                  )}
                  {beltState.records[winner.characterId]?.totalChampionships > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-500/50 font-mono text-[10px] font-bold">
                      前任 {beltState.records[winner.characterId].totalChampionships} 度王者
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {winner.name} 贏得挑戰權爭奪戰！生涯累計 {beltState.records[winner.characterId]?.wins || 1} 勝，距離向霸主 {beltState.currentHolderId ? CHARACTERS[beltState.currentHolderId]?.name : '金腰帶'} 叫陣更進一步！
                </p>
              </div>
            </div>

            {onOpenBeltModal && (
              <button
                onClick={onOpenBeltModal}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">挑戰者天梯</span>
              </button>
            )}
          </div>
        ) : null}

        {/* Mobile Compact Matchup Summary (sm:hidden) */}
        <div className="sm:hidden px-3 py-2 bg-slate-950/90 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-amber-500/30 rounded-xl p-2.5">
            {/* Winner */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-amber-400 shadow"
                  style={{ backgroundColor: winnerConfig.primaryColor || '#3b82f6' }}
                >
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded-full shadow">
                  WIN
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-slate-100 truncate">{winner.name}</div>
                <div className="text-xs text-amber-300 font-mono">
                  HP {Math.round(winner.hp)}/{winner.maxHp}
                </div>
              </div>
            </div>

            {/* VS Badge & DPS */}
            <div className="shrink-0 px-2.5 text-center border-x border-slate-800">
              <div className="text-[10px] font-black text-amber-400 tracking-wider">VS</div>
              <div className="text-xs font-mono font-bold text-slate-300">
                {winnerId === 'p1' ? stats.p1DPS : stats.p2DPS} <span className="text-[10px] text-slate-500 font-normal">DPS</span>
              </div>
            </div>

            {/* Loser */}
            <div className="flex items-center justify-end gap-2 min-w-0 flex-1 text-right">
              <div className="min-w-0">
                <div className="font-bold text-sm text-slate-400 truncate">{loser.name}</div>
                <div className="text-xs text-rose-400 font-mono">
                  KO (0/{loser.maxHp})
                </div>
              </div>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-700 bg-slate-800 opacity-75">
                  <Skull className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Winner & Loser Highlight Cards (hidden sm:grid) */}
        <div className="hidden sm:grid p-3.5 bg-slate-950/70 border-b border-slate-800 shrink-0 grid-cols-2 gap-2.5">
          {/* Winner Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 rounded-xl p-2.5 sm:p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400"
                  style={{ backgroundColor: winnerConfig.primaryColor || '#3b82f6' }}
                >
                  <Trophy className="w-5 h-5 text-white drop-shadow" />
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1 rounded-full shadow">
                  WIN
                </div>
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-extrabold text-base text-slate-100 truncate">{winner.name}</span>
                  <span className="text-xs text-amber-300 shrink-0">({winnerConfig.title})</span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  剩餘血量:{' '}
                  <span className="font-mono font-bold text-amber-300">{Math.round(winner.hp)}</span>
                  <span className="text-slate-500"> / {winner.maxHp}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <div className="text-xs font-semibold text-amber-400">輸出 DPS</div>
              <div className="text-base font-black font-mono text-white">
                {winnerId === 'p1' ? stats.p1DPS : stats.p2DPS}
              </div>
            </div>
          </div>

          {/* Loser Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 flex items-center justify-between opacity-85">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-slate-700 bg-slate-800"
                  style={{ opacity: 0.8 }}
                >
                  <Skull className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-base text-slate-300 truncate">{loser.name}</span>
                  <span className="text-xs text-slate-500 shrink-0">({loserConfig.title})</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  生命力歸零 (0 / {loser.maxHp})
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 pl-2">
              <div className="text-xs font-semibold text-slate-500">輸出 DPS</div>
              <div className="text-base font-bold font-mono text-slate-400">
                {winnerId === 'p1' ? stats.p2DPS : stats.p1DPS}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="bg-slate-950 px-2 sm:px-4 pt-2 border-b border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto select-none no-scrollbar shrink-0 touch-pan-x">
          <button
            id="tab-btn-overview"
            onClick={() => setActiveTab('overview')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'overview'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
            <span>核心數據</span>
          </button>

          <button
            id="tab-btn-damage"
            onClick={() => setActiveTab('damage_breakdown')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'damage_breakdown'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span>多元傷害</span>
          </button>

          <button
            id="tab-btn-defense"
            onClick={() => setActiveTab('defense_healing')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'defense_healing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>防禦生還</span>
          </button>

          <button
            id="tab-btn-skills"
            onClick={() => setActiveTab('skills')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'skills'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
            <span>奧義次數</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-3 sm:p-5 flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y space-y-3.5 touch-pan-y">
          {/* TAB 1: 核心數據對比 (CORE OVERVIEW) */}
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Player Columns Header */}
              <div className="grid grid-cols-12 items-center text-center text-xs sm:text-sm font-extrabold pb-2 border-b border-slate-800">
                <div className="col-span-5 text-left flex items-center gap-1.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-blue-400 font-bold truncate">{p1.name}</span>
                </div>
                <div className="col-span-2 text-slate-400 text-xs shrink-0">對決項目</div>
                <div className="col-span-5 text-right flex items-center justify-end gap-1.5 min-w-0">
                  <span className="text-red-400 font-bold truncate">{p2.name}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                </div>
              </div>

              {/* Metric 1: 總輸出傷害 (Total Damage) */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="grid grid-cols-12 items-center text-xs sm:text-sm">
                  <div className="col-span-4 text-left font-mono font-bold text-blue-300">
                    <span className="text-sm sm:text-base">{stats.p1Dmg}</span>{' '}
                    <span className="text-xs text-slate-500 font-normal">({stats.p1DPS}/s)</span>
                  </div>
                  <div className="col-span-4 text-center font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>總輸出傷害</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-red-300">
                    <span className="text-xs text-slate-500 font-normal">({stats.p2DPS}/s)</span>{' '}
                    <span className="text-sm sm:text-base">{stats.p2Dmg}</span>
                  </div>
                </div>
                {/* Comparative Bar */}
                <div className="h-2.5 sm:h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-blue-500 transition-all duration-500" style={{ width: `${dmgPct.p1}%` }} />
                  <div className="bg-red-500 transition-all duration-500" style={{ width: `${dmgPct.p2}%` }} />
                </div>
              </div>

              {/* Metric 2: 承傷總量 (Damage Taken) */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="grid grid-cols-12 items-center text-xs sm:text-sm">
                  <div className="col-span-4 text-left font-mono font-bold text-slate-300 text-sm sm:text-base">
                    {stats.p1Taken}
                  </div>
                  <div className="col-span-4 text-center font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Skull className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>承受傷害</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-slate-300 text-sm sm:text-base">
                    {stats.p2Taken}
                  </div>
                </div>
                <div className="h-2.5 sm:h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-blue-400/80 transition-all duration-500" style={{ width: `${takenPct.p1}%` }} />
                  <div className="bg-red-400/80 transition-all duration-500" style={{ width: `${takenPct.p2}%` }} />
                </div>
              </div>

              {/* Metric 3: 生命恢復與吸血 (Healing Done) */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="grid grid-cols-12 items-center text-xs sm:text-sm">
                  <div className="col-span-4 text-left font-mono font-bold text-emerald-400 text-sm sm:text-base">
                    +{stats.p1Heal}
                  </div>
                  <div className="col-span-4 text-center font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>治療與吸血</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-emerald-400 text-sm sm:text-base">
                    +{stats.p2Heal}
                  </div>
                </div>
                <div className="h-2.5 sm:h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${healPct.p1}%` }} />
                  <div className="bg-emerald-600 transition-all duration-500" style={{ width: `${healPct.p2}%` }} />
                </div>
              </div>

              {/* Metric 4: 護盾格擋與領域減傷 (Shield & Damage Mitigated) */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
                <div className="grid grid-cols-12 items-center text-xs sm:text-sm">
                  <div className="col-span-4 text-left font-mono font-bold text-cyan-300">
                    <span className="text-sm sm:text-base">{stats.p1Shield + stats.p1Mitigate}</span>{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      ({stats.p1Shield}盾/{stats.p1Mitigate}免)
                    </span>
                  </div>
                  <div className="col-span-4 text-center font-bold text-slate-200 flex items-center justify-center gap-1">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>護盾格擋減免</span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold text-cyan-300">
                    <span className="text-xs text-slate-500 font-normal">
                      ({stats.p2Shield}盾/{stats.p2Mitigate}免)
                    </span>{' '}
                    <span className="text-sm sm:text-base">{stats.p2Shield + stats.p2Mitigate}</span>
                  </div>
                </div>
                <div className="h-2.5 sm:h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-cyan-500 transition-all duration-500" style={{ width: `${defPct.p1}%` }} />
                  <div className="bg-cyan-600 transition-all duration-500" style={{ width: `${defPct.p2}%` }} />
                </div>
              </div>

              {/* Metric 5: 單次最高峰值 & 命中次數 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>最高單次峰值傷害</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm font-mono font-bold">
                      <span className="text-blue-400">{stats.p1Peak}</span>
                      <span className="text-slate-600">vs</span>
                      <span className="text-red-400">{stats.p2Peak}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                      {stats.p1Peak >= stats.p2Peak ? p1.name : p2.name} 領先
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-sky-400" />
                      <span>總有效命中次數</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm font-mono font-bold">
                      <span className="text-blue-400">{p1.hitsDealt} 次</span>
                      <span className="text-slate-600">vs</span>
                      <span className="text-red-400">{p2.hitsDealt} 次</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold">
                      有效命中率
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 多元傷害拆解 (DIVERSIFIED DAMAGE BREAKDOWN) */}
          {activeTab === 'damage_breakdown' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-amber-400" />
                    <span>傷害屬性多元化拆解 (Damage Types)</span>
                  </div>
                  <span className="text-xs text-slate-400">精準計算 6 種屬性</span>
                </div>

                {/* Legend Chips */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> 物理傷害
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" /> 魔法傷害
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/15 text-orange-300 border border-orange-500/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> 烈焰燃燒
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> 劇毒侵蝕
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> 爪痕流血
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100/15 text-slate-100 border border-slate-200/30 font-medium">
                    <span className="w-2 h-2 rounded-full bg-white" /> 穿透真傷
                  </span>
                </div>

                {/* Detailed Table Comparison */}
                <div className="space-y-2 pt-1">
                  {[
                    {
                      label: '物理傷害 (Physical)',
                      icon: <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
                      p1Val: stats.p1Phys,
                      p2Val: stats.p2Phys,
                      color: 'text-amber-300'
                    },
                    {
                      label: '魔法傷害 (Magic)',
                      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                      p1Val: stats.p1Magic,
                      p2Val: stats.p2Magic,
                      color: 'text-indigo-300'
                    },
                    {
                      label: '烈焰燃燒 (Flame)',
                      icon: <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />,
                      p1Val: stats.p1Flame,
                      p2Val: stats.p2Flame,
                      color: 'text-orange-300'
                    },
                    {
                      label: '劇毒侵蝕 (Poison)',
                      icon: <Droplets className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
                      p1Val: stats.p1Poison,
                      p2Val: stats.p2Poison,
                      color: 'text-emerald-300'
                    },
                    {
                      label: '爪痕流血 (Bleed)',
                      icon: <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
                      p1Val: stats.p1Bleed,
                      p2Val: stats.p2Bleed,
                      color: 'text-rose-300'
                    },
                    {
                      label: '穿透真傷 (True Dmg)',
                      icon: <Target className="w-3.5 h-3.5 text-white shrink-0" />,
                      p1Val: stats.p1True,
                      p2Val: stats.p2True,
                      color: 'text-white'
                    }
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center text-xs sm:text-sm py-2 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800/70"
                    >
                      <div className="col-span-4 text-left font-mono font-bold text-blue-300">
                        {row.p1Val}
                        <span className="text-xs text-slate-500 ml-1">
                          ({stats.p1Dmg > 0 ? Math.round((row.p1Val / stats.p1Dmg) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="col-span-4 flex items-center justify-center gap-1 font-semibold text-slate-300 text-center">
                        {row.icon}
                        <span className="truncate">{row.label}</span>
                      </div>
                      <div className="col-span-4 text-right font-mono font-bold text-red-300">
                        <span className="text-xs text-slate-500 mr-1">
                          ({stats.p2Dmg > 0 ? Math.round((row.p2Val / stats.p2Dmg) * 100) : 0}%)
                        </span>
                        {row.p2Val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collision vs Skill Damage Ratio */}
              <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-slate-800 space-y-2.5">
                <div className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-sky-400" />
                  <span>普通碰撞普攻 vs 技能奧義爆發</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {/* P1 */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-900/40">
                    <div className="font-bold text-blue-400 mb-1.5">{p1.name}</div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>碰撞: {stats.p1Collision}</span>
                      <span>技能: {stats.p1Skill}</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-amber-400"
                        style={{
                          width: `${
                            stats.p1Dmg > 0 ? Math.round((stats.p1Collision / stats.p1Dmg) * 100) : 50
                          }%`
                        }}
                      />
                      <div
                        className="bg-purple-500"
                        style={{
                          width: `${
                            stats.p1Dmg > 0 ? Math.round((stats.p1Skill / stats.p1Dmg) * 100) : 50
                          }%`
                        }}
                      />
                    </div>
                  </div>

                  {/* P2 */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-red-900/40">
                    <div className="font-bold text-red-400 mb-1.5">{p2.name}</div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>碰撞: {stats.p2Collision}</span>
                      <span>技能: {stats.p2Skill}</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-amber-400"
                        style={{
                          width: `${
                            stats.p2Dmg > 0 ? Math.round((stats.p2Collision / stats.p2Dmg) * 100) : 50
                          }%`
                        }}
                      />
                      <div
                        className="bg-purple-500"
                        style={{
                          width: `${
                            stats.p2Dmg > 0 ? Math.round((stats.p2Skill / stats.p2Dmg) * 100) : 50
                          }%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 治療與防禦生還 (DEFENSE & HEALING) */}
          {activeTab === 'defense_healing' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* P1 Defense Card */}
                <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-blue-900/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 text-sm sm:text-base">{p1.name}・防護生還數據</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Heart className="w-4 h-4" /> 生命治癒總量
                      </span>
                      <span className="font-mono font-bold text-emerald-300 text-sm">+{stats.p1Heal}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        <Shield className="w-4 h-4" /> 護盾吸收抵擋
                      </span>
                      <span className="font-mono font-bold text-sky-300 text-sm">{stats.p1Shield}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <ShieldCheck className="w-4 h-4" /> 領域/免傷減免
                      </span>
                      <span className="font-mono font-bold text-purple-300 text-sm">{stats.p1Mitigate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800/80">
                      <span className="font-semibold text-slate-200">有效生還抵免總計</span>
                      <span className="font-mono font-black text-amber-300 text-sm sm:text-base">
                        {stats.p1Heal + stats.p1Shield + stats.p1Mitigate} 點
                      </span>
                    </div>
                  </div>
                </div>

                {/* P2 Defense Card */}
                <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-red-900/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-red-400 text-sm sm:text-base">{p2.name}・防護生還數據</span>
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Heart className="w-4 h-4" /> 生命治癒總量
                      </span>
                      <span className="font-mono font-bold text-emerald-300 text-sm">+{stats.p2Heal}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-sky-400">
                        <Shield className="w-4 h-4" /> 護盾吸收抵擋
                      </span>
                      <span className="font-mono font-bold text-sky-300 text-sm">{stats.p2Shield}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <ShieldCheck className="w-4 h-4" /> 領域/免傷減免
                      </span>
                      <span className="font-mono font-bold text-purple-300 text-sm">{stats.p2Mitigate}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800/80">
                      <span className="font-semibold text-slate-200">有效生還抵免總計</span>
                      <span className="font-mono font-black text-amber-300 text-sm sm:text-base">
                        {stats.p2Heal + stats.p2Shield + stats.p2Mitigate} 點
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Survivability Assessment Badge */}
              <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200">生還與防護評定</div>
                    <div className="text-xs text-slate-400">
                      計算抵擋、護盾吸收與續航回血對生存時長的實質貢獻
                    </div>
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                    {stats.p1Heal + stats.p1Shield + stats.p1Mitigate >=
                    stats.p2Heal + stats.p2Shield + stats.p2Mitigate
                      ? `${p1.name} 具備更強續航防禦`
                      : `${p2.name} 具備更強續航防禦`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 被動奧義矩陣 (SKILLS & PASSIVE MATRIX) */}
          {activeTab === 'skills' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* P1 Skill Matrix */}
                <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-blue-900/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 text-sm sm:text-base">{p1.name} 被動奧義次數</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {CHARACTERS[p1.characterId].passives.map((p, pIdx) => {
                      const triggerCount =
                        pIdx === 0
                          ? p1.passive1Triggers
                          : pIdx === 1
                          ? p1.passive2Triggers
                          : p1.passive3Triggers;
                      return (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-200 text-xs sm:text-sm">
                              被動{pIdx + 1}：{p.name}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">{p.description}</div>
                          </div>
                          <div className="font-mono font-black text-sm sm:text-base text-amber-400 pl-2 shrink-0">
                            {triggerCount || 0} 次
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* P2 Skill Matrix */}
                <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-red-900/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-red-400 text-sm sm:text-base">{p2.name} 被動奧義次數</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {CHARACTERS[p2.characterId].passives.map((p, pIdx) => {
                      const triggerCount =
                        pIdx === 0
                          ? p2.passive1Triggers
                          : pIdx === 1
                          ? p2.passive2Triggers
                          : p2.passive3Triggers;
                      return (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-200 text-xs sm:text-sm">
                              被動{pIdx + 1}：{p.name}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">{p.description}</div>
                          </div>
                          <div className="font-mono font-black text-sm sm:text-base text-amber-400 pl-2 shrink-0">
                            {triggerCount || 0} 次
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile Responsive Layout */}
        <div className="p-2.5 sm:p-4 bg-slate-950/95 border-t border-slate-800 flex flex-col gap-2 shrink-0 touch-manipulation select-none">
          {isTournamentMatch && onContinueTournament && (
            <div className="flex flex-col gap-1.5">
              {/* Auto Continue Countdown Banner if enabled */}
              {autoNextConfig?.enabled && autoContinueCountdown !== null && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Timer className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">
                      {isAutoContinuePaused
                        ? '自動繼續已暫停（可自由查閱結算）'
                        : `自動賽程：${autoContinueCountdown} 秒後推進下一局`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setIsAutoContinuePaused(prev => !prev)}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-200 text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      {isAutoContinuePaused ? '繼續倒數' : '暫停'}
                    </button>
                    <button
                      onClick={onContinueTournament}
                      className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black hover:bg-amber-400 cursor-pointer"
                    >
                      立刻推進
                    </button>
                  </div>
                </div>
              )}

              <button
                id="btn-modal-continue-tour"
                onClick={onContinueTournament}
                className="w-full min-h-[46px] py-2.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-[0.98] text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Trophy className="w-4 h-4 fill-slate-950 shrink-0" />
                <span>
                  晉級下一輪 / 查看賽程表
                  {autoNextConfig?.enabled && autoContinueCountdown !== null && !isAutoContinuePaused
                    ? ` (${autoContinueCountdown}s 自動前往)`
                    : ''}
                </span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2">
            <button
              id="btn-modal-rematch"
              onClick={onRematch}
              className="min-h-[46px] py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer col-span-2 sm:col-span-1 sm:flex-1"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>重戰本場 (Rematch)</span>
            </button>

            <button
              id="btn-modal-change"
              onClick={onChangeSetup}
              className="min-h-[46px] py-2.5 px-3 sm:px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer sm:w-auto"
              title={isTournamentMatch ? '返回錦標淘汰賽程對陣樹' : '更換參戰英雄與設定'}
            >
              {isTournamentMatch ? (
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Sliders className="w-4 h-4 shrink-0" />
              )}
              <span>{isTournamentMatch ? '返回賽程樹' : '更換英雄'}</span>
            </button>

            {onReturnToMenu && (
              <button
                id="btn-modal-return-menu"
                onClick={onReturnToMenu}
                className="min-h-[46px] py-2.5 px-3 sm:px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer sm:w-auto"
              >
                <Home className="w-4 h-4 text-sky-400 shrink-0" />
                <span>主選單</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

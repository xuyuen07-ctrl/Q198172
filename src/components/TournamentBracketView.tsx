import React, { useState, useEffect, useMemo } from 'react';
import { TournamentMatch, TournamentState, TournamentSize, TournamentBeltState, AutoNextMatchConfig } from '../types/tournament';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { ChampionBeltBadge } from './ChampionBeltBadge';
import { soundEngine } from '../utils/audio';
import {
  Trophy,
  Swords,
  Zap,
  Play,
  Pause,
  Sparkles,
  RotateCcw,
  Crown,
  FastForward,
  CheckCircle2,
  Clock,
  Timer,
  User,
  Bot,
  ChevronRight,
  ChevronLeft,
  Shield,
  Flame,
  Award,
  Home,
  Sliders,
  BookOpen,
  Info,
  BarChart3
} from 'lucide-react';

interface TournamentBracketViewProps {
  tournament: TournamentState;
  beltState: TournamentBeltState;
  autoNextConfig: AutoNextMatchConfig;
  onUpdateAutoNextConfig: React.Dispatch<React.SetStateAction<AutoNextMatchConfig>>;
  onSelectMatch: (matchId: string) => void;
  onEnterMatch: (matchId: string) => void;
  onSimulateMatch: (matchId: string) => void;
  onFastForwardAi: () => void;
  onNewTournament: (size: TournamentSize) => void;
  onTogglePlayerControl: () => void;
  onSwitchToDuelMode: () => void;
  onReturnToMenu?: () => void;
  onOpenBeltModal?: () => void;
  onOpenCharacterSelect?: () => void;
  onOpenHandbook?: () => void;
  onOpenHelpDrawer?: () => void;
  onOpenRecords?: () => void;
}

export const TournamentBracketView: React.FC<TournamentBracketViewProps> = ({
  tournament,
  beltState,
  autoNextConfig,
  onUpdateAutoNextConfig,
  onSelectMatch,
  onEnterMatch,
  onSimulateMatch,
  onFastForwardAi,
  onNewTournament,
  onTogglePlayerControl,
  onSwitchToDuelMode,
  onReturnToMenu,
  onOpenBeltModal,
  onOpenCharacterSelect,
  onOpenHandbook,
  onOpenHelpDrawer,
  onOpenRecords
}) => {
  // Group matches by round
  const maxRound = tournament.size === 16 ? 4 : 3;
  const rounds: { round: number; name: string; matches: TournamentMatch[] }[] = [];

  for (let r = 1; r <= maxRound; r++) {
    const roundMatches = tournament.matches.filter(m => m.round === r);
    const roundName = roundMatches[0]?.roundName || (r === maxRound ? '總冠軍決賽' : `第 ${r} 輪`);
    rounds.push({ round: r, name: roundName, matches: roundMatches });
  }

  // Count progress
  const totalMatches = tournament.matches.length;
  const finishedMatches = tournament.matches.filter(m => m.status === 'finished').length;
  const progressPercent = Math.round((finishedMatches / totalMatches) * 100);

  // Check if any AI matches can be auto-simulated
  const hasAiReadyMatches = tournament.matches.some(
    m => m.status === 'ready' && m.p1CharId && m.p2CharId && !m.isPlayerMatch
  );

  const currentHolder = beltState.currentHolderId ? CHARACTERS[beltState.currentHolderId] : null;

  // Find unstarted / ready matches sorted by bracket progression
  const readyMatches = useMemo(() => {
    return tournament.matches
      .filter(m => m.status === 'ready' && m.p1CharId && m.p2CharId)
      .sort((a, b) => (a.round - b.round) || (a.matchIndex - b.matchIndex));
  }, [tournament.matches]);

  const nextUnstartedMatch = readyMatches[0] || null;
  const nextP1Char = nextUnstartedMatch?.p1CharId ? CHARACTERS[nextUnstartedMatch.p1CharId] : null;
  const nextP2Char = nextUnstartedMatch?.p2CharId ? CHARACTERS[nextUnstartedMatch.p2CharId] : null;

  // Auto-next match countdown state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [targetMatchId, setTargetMatchId] = useState<string | null>(null);

  // Synchronize target match and start/reset timer when ready matches change
  useEffect(() => {
    if (!autoNextConfig.enabled || !nextUnstartedMatch) {
      setCountdown(null);
      setTargetMatchId(null);
      return;
    }

    if (targetMatchId !== nextUnstartedMatch.id) {
      setTargetMatchId(nextUnstartedMatch.id);
      setCountdown(autoNextConfig.seconds);
      setIsPaused(false);
    }
  }, [autoNextConfig.enabled, autoNextConfig.seconds, nextUnstartedMatch, targetMatchId]);

  // Countdown timer loop
  useEffect(() => {
    if (!autoNextConfig.enabled || isPaused || countdown === null || !nextUnstartedMatch) {
      return;
    }

    if (countdown <= 0) {
      soundEngine.playCountdownBeep(true);
      setCountdown(null);
      if (autoNextConfig.action === 'enter') {
        onEnterMatch(nextUnstartedMatch.id);
      } else {
        onSimulateMatch(nextUnstartedMatch.id);
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextVal = countdown - 1;
      if (nextVal <= 3 && nextVal > 0) {
        soundEngine.playCountdownBeep(false);
      }
      setCountdown(nextVal);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextConfig.enabled, autoNextConfig.action, countdown, isPaused, nextUnstartedMatch, onEnterMatch, onSimulateMatch]);

  const handleToggleAutoNext = () => {
    const nextEnabled = !autoNextConfig.enabled;
    onUpdateAutoNextConfig(prev => ({ ...prev, enabled: nextEnabled }));
    if (nextEnabled && nextUnstartedMatch) {
      setTargetMatchId(nextUnstartedMatch.id);
      setCountdown(autoNextConfig.seconds);
      setIsPaused(false);
    } else {
      setCountdown(null);
    }
  };

  const handleSetSeconds = (sec: number) => {
    const bounded = Math.min(10, Math.max(3, sec));
    onUpdateAutoNextConfig(prev => ({ ...prev, seconds: bounded }));
    if (autoNextConfig.enabled && nextUnstartedMatch) {
      setCountdown(bounded);
      setIsPaused(false);
    }
  };

  const handleSetAction = (act: 'enter' | 'simulate') => {
    onUpdateAutoNextConfig(prev => ({ ...prev, action: act }));
  };

  const handleStartNow = () => {
    if (!nextUnstartedMatch) return;
    soundEngine.playCountdownBeep(true);
    setCountdown(null);
    if (autoNextConfig.action === 'enter') {
      onEnterMatch(nextUnstartedMatch.id);
    } else {
      onSimulateMatch(nextUnstartedMatch.id);
    }
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const renderMatchCard = (match: TournamentMatch) => {
    const isReady = match.status === 'ready';
    const isFinished = match.status === 'finished';
    const isSelected = tournament.currentMatchId === match.id;
    const isFinal = match.id === 'm_final';

    const p1Char = match.p1CharId ? CHARACTERS[match.p1CharId] : null;
    const p2Char = match.p2CharId ? CHARACTERS[match.p2CharId] : null;

    const p1IsWinner = match.winnerCharId && match.winnerCharId === match.p1CharId;
    const p2IsWinner = match.winnerCharId && match.winnerCharId === match.p2CharId;

    const isP1Player = !!tournament.playerCharId && match.p1CharId === tournament.playerCharId;
    const isP2Player = !!tournament.playerCharId && match.p2CharId === tournament.playerCharId;

    const isP1BeltHolder = !!match.p1CharId && beltState.currentHolderId === match.p1CharId;
    const isP2BeltHolder = !!match.p2CharId && beltState.currentHolderId === match.p2CharId;

    const isNextTarget = nextUnstartedMatch?.id === match.id;
    const isAutoCounting = isNextTarget && autoNextConfig.enabled && countdown !== null;

    return (
      <div
        key={match.id}
        onClick={() => onSelectMatch(match.id)}
        className={`relative rounded-xl border p-3 transition-all duration-300 backdrop-blur-md cursor-pointer group ${
          isAutoCounting
            ? 'border-amber-400 bg-slate-900/95 shadow-xl shadow-amber-500/25 ring-2 ring-amber-400/80 scale-[1.01]'
            : isFinal
            ? 'border-amber-500/70 bg-gradient-to-br from-amber-950/40 via-slate-900/95 to-amber-950/30 shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/30'
            : isSelected
            ? 'border-sky-400 bg-slate-900/95 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50'
            : isReady
            ? 'border-sky-500/40 bg-slate-900/80 hover:border-sky-400/80 shadow-md'
            : isFinished
            ? 'border-slate-800/80 bg-slate-950/60 opacity-90'
            : 'border-slate-800/40 bg-slate-950/40 opacity-60'
        }`}
      >
        {/* Match Header Info */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold">
            {isFinal ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span>金腰帶決賽・加冕爭霸</span>
              </span>
            ) : (
              <span className="text-slate-400">第 {match.matchIndex + 1} 組</span>
            )}

            {match.isPlayerMatch && (
              <span className="px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[9px] font-black flex items-center gap-0.5">
                <User className="w-2.5 h-2.5" />
                <span>你的對決</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isFinished ? (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>已晉級</span>
              </span>
            ) : isAutoCounting ? (
              <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded-full border border-amber-500/40 animate-pulse">
                <Timer className="w-3 h-3 text-amber-400" />
                <span>{isPaused ? '暫停中' : `${countdown}s 後開戰`}</span>
              </span>
            ) : isReady ? (
              <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 px-1.5 py-0.2 bg-amber-500/10 rounded-full border border-amber-500/30 animate-pulse">
                <Swords className="w-3 h-3" />
                <span>準備對決</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>等待前輪</span>
              </span>
            )}
          </div>
        </div>

        {/* Competitor 1 */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-lg mb-1.5 transition-colors ${
            p1IsWinner
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-bold'
              : match.loserCharId && match.loserCharId === match.p1CharId
              ? 'opacity-40 line-through text-slate-500 bg-slate-950/30'
              : 'bg-slate-800/40 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {p1Char ? (
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10 relative">
                <ChampionAvatarCanvas
                  characterId={p1Char.id}
                  size={24}
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                ?
              </div>
            )}

            <div className="truncate">
              <div className="text-xs font-semibold truncate flex items-center gap-1">
                <span>{p1Char ? p1Char.name : '待定選手'}</span>
                {isP1BeltHolder && (
                  <span className="text-[9px] px-1 rounded bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 fill-slate-950" />
                    <span>腰帶王</span>
                  </span>
                )}
                {isP1Player && (
                  <span className="text-[9px] px-1 rounded bg-sky-500 text-slate-950 font-black">你</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {p1Char ? `${p1Char.title} · ${p1Char.primaryRoleName || '戰士'}` : '上一輪勝者'}
              </div>
            </div>
          </div>

          {p1IsWinner && (
            <span className="text-[10px] font-black text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 flex items-center gap-0.5 shrink-0">
              <Crown className="w-3 h-3 fill-amber-400" />
              <span>晉級</span>
            </span>
          )}
        </div>

        {/* Competitor 2 */}
        <div
          className={`flex items-center justify-between p-1.5 rounded-lg mb-2 transition-colors ${
            p2IsWinner
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-bold'
              : match.loserCharId && match.loserCharId === match.p2CharId
              ? 'opacity-40 line-through text-slate-500 bg-slate-950/30'
              : 'bg-slate-800/40 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {p2Char ? (
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10 relative">
                <ChampionAvatarCanvas
                  characterId={p2Char.id}
                  size={24}
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                ?
              </div>
            )}

            <div className="truncate">
              <div className="text-xs font-semibold truncate flex items-center gap-1">
                <span>{p2Char ? p2Char.name : '待定選手'}</span>
                {isP2BeltHolder && (
                  <span className="text-[9px] px-1 rounded bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 fill-slate-950" />
                    <span>腰帶王</span>
                  </span>
                )}
                {isP2Player && (
                  <span className="text-[9px] px-1 rounded bg-sky-500 text-slate-950 font-black">你</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {p2Char ? `${p2Char.title} · ${p2Char.primaryRoleName || '戰士'}` : '上一輪勝者'}
              </div>
            </div>
          </div>

          {p2IsWinner && (
            <span className="text-[10px] font-black text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 flex items-center gap-0.5 shrink-0">
              <Crown className="w-3 h-3 fill-amber-400" />
              <span>晉級</span>
            </span>
          )}
        </div>

        {/* Action / Outcome footer */}
        {isFinished ? (
          <div className="text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span className="truncate">{match.summary || '戰局結束'}</span>
            {match.matchTime && (
              <span className="font-mono text-slate-400 shrink-0 ml-1">{match.matchTime}s</span>
            )}
          </div>
        ) : isReady ? (
          <div className="flex flex-col gap-1.5 pt-1 touch-manipulation select-none">
            {/* Active Auto-Countdown Target Badge on Match Card */}
            {isAutoCounting && (
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/25 to-yellow-500/15 border border-amber-500/60 text-amber-300 text-[11px] font-bold shadow-sm animate-pulse">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {isPaused ? '倒數暫停中' : `${countdown} 秒後自動${autoNextConfig.action === 'enter' ? '進入擂台' : '快速模擬'}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePause();
                  }}
                  className="px-2 py-0.5 rounded bg-slate-950/80 hover:bg-slate-900 border border-amber-500/50 text-[10px] text-amber-200 font-bold shrink-0 cursor-pointer transition-colors"
                >
                  {isPaused ? '繼續' : '暫停'}
                </button>
              </div>
            )}

            {/* Ergonomic Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id={`btn-match-enter-${match.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterMatch(match.id);
                }}
                className={`min-h-[40px] py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95 ${
                  isAutoCounting && autoNextConfig.action === 'enter'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-300 animate-pulse'
                    : match.isPlayerMatch
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-600/30 ring-1 ring-sky-300/40'
                    : 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-sky-600/20'
                }`}
                title={isAutoCounting && autoNextConfig.action === 'enter' ? '跳過倒數，立即開戰' : '進入擂台實時對決'}
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {isAutoCounting && autoNextConfig.action === 'enter'
                    ? `立即開打 (${countdown}s)`
                    : match.isPlayerMatch
                    ? '親自迎戰'
                    : '進入擂台'}
                </span>
              </button>

              <button
                id={`btn-match-sim-${match.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulateMatch(match.id);
                }}
                className={`min-h-[40px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                  isAutoCounting && autoNextConfig.action === 'simulate'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 ring-2 ring-amber-300 animate-pulse font-black'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700 hover:text-amber-300'
                }`}
                title={isAutoCounting && autoNextConfig.action === 'simulate' ? '跳過倒數，直接結算' : '快速模擬計算勝負'}
              >
                <FastForward className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  {isAutoCounting && autoNextConfig.action === 'simulate'
                    ? `即刻結算 (${countdown}s)`
                    : '快速模擬'}
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Top Unified Header: Return to Menu, Title & Handbook/Help Utilities */}
      <div className="w-full flex items-center justify-between p-2 sm:py-2.5 sm:px-4 bg-slate-900/90 border border-slate-800/90 rounded-2xl backdrop-blur-xl shadow-lg shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          {onReturnToMenu && (
            <button
              id="btn-bracket-return-menu"
              onClick={onReturnToMenu}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95 group"
              title="返回主選單"
            >
              <ChevronLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <span>返回主選單</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-black text-slate-100">
              錦標淘汰賽對陣樹
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 font-mono font-bold">
              {tournament.size}強規模
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenRecords && (
            <button
              id="btn-bracket-records-header"
              onClick={onOpenRecords}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/70 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              title="查看獨立戰績數據中心"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>戰績數據</span>
            </button>
          )}

          {(onOpenHandbook || onOpenHelpDrawer) && (
            <button
              id="btn-bracket-rules-guide"
              onClick={onOpenHandbook || onOpenHelpDrawer}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-sky-950/90 border border-amber-500/60 hover:border-amber-400 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              title="查看完整戰鬥規則與英雄圖鑑百科"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>規則與圖鑑指南</span>
            </button>
          )}
        </div>
      </div>

      {/* Tournament Esports Hero Banner */}
      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/50 border border-slate-800/90 shadow-xl relative overflow-hidden backdrop-blur-xl">
        {/* Background Cyber Glow Accent */}
        <div className="absolute -top-12 right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          {/* Title & Stats */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-300/40">
                <Trophy className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                    <span className="text-flow-gold">{tournament.title}</span>
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                    KNOCKOUT BRACKET
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  爭奪冠軍金腰帶 · 加冕總冠軍霸主 · 衛冕獲得虛擬統治天數
                </p>
              </div>
            </div>

            {/* Tournament Progress Meter */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-48 sm:w-64 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-300 font-mono font-bold">
                進度: {finishedMatches} / {totalMatches} 場 ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Tournament Control Toolbar & Belt Status */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Belt Status Card */}
            <div
              onClick={onOpenBeltModal}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 transition-colors cursor-pointer shadow-sm group"
              title="點擊查看冠軍腰帶衛冕名人堂"
            >
              <ChampionBeltBadge
                size="sm"
                reignDays={beltState.currentReignDays}
                currentReignDefenses={beltState.currentReignDefenses}
                showDays={false}
              />
              <div className="text-left">
                <div className="text-[9px] font-mono text-amber-400/90 font-bold flex items-center gap-1">
                  <span>WWE 世界金腰帶</span>
                  <span className="text-amber-200 font-mono">({beltState.currentReignDays}天)</span>
                </div>
                <div className="text-xs font-black text-amber-200 truncate max-w-[120px] flex items-center gap-1">
                  <span>{currentHolder ? currentHolder.name : '王座空缺'}</span>
                  {currentHolder && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      {beltState.currentReignDefenses > 0 ? `衛冕${beltState.currentReignDefenses}次` : '新王'}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Player Champion Profile Badge */}
            {tournament.playerCharId && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-sky-500/30 text-xs">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-sky-400">
                  <ChampionAvatarCanvas
                    characterId={tournament.playerCharId}
                    size={24}
                  />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">代表選手</div>
                  <div className="font-bold text-sky-300">
                    {CHARACTERS[tournament.playerCharId].name}
                  </div>
                </div>

                {/* Control Toggle */}
                <button
                  onClick={onTogglePlayerControl}
                  className={`ml-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    tournament.playerControl === 'manual'
                      ? 'bg-blue-600/30 text-sky-300 border-sky-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="切換手動引導或電腦代打"
                >
                  {tournament.playerControl === 'manual' ? (
                    <>
                      <User className="w-3 h-3" />
                      <span>手動引導</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3" />
                      <span>AI 自動</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Fast Simulate AI matches */}
            {hasAiReadyMatches && (
              <button
                id="btn-fast-forward-ai"
                onClick={onFastForwardAi}
                className="w-full sm:w-auto h-10 sm:h-auto px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 touch-manipulation select-none"
                title="自動模擬完成其他選手對決"
              >
                <FastForward className="w-4 h-4 text-amber-400 shrink-0" />
                <span>一鍵推進電腦局</span>
              </button>
            )}

            {/* New Tournament Dropdown / Actions - Clean & Non-redundant */}
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-2 touch-manipulation select-none">
              {onOpenCharacterSelect && (
                <button
                  onClick={onOpenCharacterSelect}
                  className="h-10 sm:h-auto px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="開啟選角介面自訂參賽選手名單與玩家代表"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>自訂名單</span>
                </button>
              )}

              <button
                onClick={() => onNewTournament(tournament.size === 8 ? 16 : 8)}
                className="h-10 sm:h-auto px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                title="切換 8強 / 16強 規模"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>切換({tournament.size === 8 ? '16強' : '8強'})</span>
              </button>

              <button
                onClick={onSwitchToDuelMode}
                className="h-10 sm:h-auto px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                title="切換為 1v1 經典單挑模式"
              >
                <Swords className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>切換單挑</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Auto Next Match Control Panel (10～3秒 自動開賽系統) */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 p-3 sm:p-4 shadow-xl backdrop-blur-xl relative overflow-hidden">
        {/* Cyber background flare */}
        <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          autoNextConfig.enabled ? 'bg-amber-500/15 opacity-100' : 'opacity-0'
        }`} />

        <div className="flex flex-col gap-3 relative z-10">
          {/* Header row: Toggle and Title */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                autoNextConfig.enabled
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                    <span>自動進行下一局比賽</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                      10～3秒倒數
                    </span>
                  </h3>
                  {autoNextConfig.enabled && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>運作中</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {autoNextConfig.enabled
                    ? `未開始的比賽將自動倒數 ${autoNextConfig.seconds} 秒後${autoNextConfig.action === 'enter' ? '進入擂台開打' : '快速模擬出勝負'}`
                    : '開啟後將以 10～3 秒自動倒數進行下一局未開始的比賽，免去手動尋找點擊'}
                </p>
              </div>
            </div>

            {/* Main Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-auto-next-match"
                onClick={handleToggleAutoNext}
                className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md select-none touch-manipulation active:scale-95 ${
                  autoNextConfig.enabled
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${autoNextConfig.enabled ? 'fill-slate-950' : 'text-amber-400'}`} />
                <span>{autoNextConfig.enabled ? '自動開賽：已啟動' : '開啟自動下一局'}</span>
                <div className={`w-3 h-3 rounded-full border transition-colors ${
                  autoNextConfig.enabled ? 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/50' : 'bg-slate-700 border-slate-600'
                }`} />
              </button>
            </div>
          </div>

          {/* Auto Next Controls & Status (when enabled) */}
          {autoNextConfig.enabled ? (
            <div className="flex flex-col gap-3">
              {/* Next Match Live Countdown Banner */}
              {nextUnstartedMatch && nextP1Char && nextP2Char ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/40 border border-amber-500/40 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-950 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10">
                      <span className="font-mono text-xl font-black text-amber-300">
                        {countdown !== null ? countdown : autoNextConfig.seconds}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 absolute bottom-0.5">SEC</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>目標對決：{nextUnstartedMatch.roundName}（第 {nextUnstartedMatch.matchIndex + 1} 組）</span>
                        {isPaused && (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] border border-red-500/30">
                            已暫停
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-100 truncate flex items-center gap-1.5 mt-0.5">
                        <span className="text-sky-300">{nextP1Char.name}</span>
                        <span className="text-slate-500 text-xs">VS</span>
                        <span className="text-rose-300">{nextP2Char.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Controls during Countdown */}
                  <div className="flex items-center gap-2 shrink-0 touch-manipulation select-none">
                    <button
                      id="btn-auto-next-pause"
                      onClick={handleTogglePause}
                      className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer active:scale-95"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isPaused ? '繼續倒數' : '暫停'}</span>
                    </button>

                    <button
                      id="btn-auto-next-start-now"
                      onClick={handleStartNow}
                      className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                      title="跳過等待，立刻開打"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                      <span>立即開打 (跳過倒數)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>目前所有對決皆已完成或正在進行中，無未開始的下一局對決。</span>
                </div>
              )}

              {/* Dynamic Animated Progress Bar */}
              {countdown !== null && autoNextConfig.seconds > 0 && (
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      countdown <= 3 ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-500 via-amber-400 to-yellow-400'
                    }`}
                    style={{
                      width: `${Math.max(0, Math.min(100, (countdown / autoNextConfig.seconds) * 100))}%`
                    }}
                  />
                </div>
              )}

              {/* Configuration Bar: Seconds (10 ~ 3s) & Action Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                {/* Seconds Selection (10 ~ 3s) */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>開賽倒數時間：</span>
                      <span className="font-mono text-amber-300 font-black text-sm">{autoNextConfig.seconds} 秒</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">範圍: 10～3 秒</span>
                  </div>

                  {/* Quick Preset Buttons 3s, 5s, 8s, 10s */}
                  <div className="flex items-center gap-1.5">
                    {[3, 5, 8, 10].map(sec => (
                      <button
                        key={sec}
                        onClick={() => handleSetSeconds(sec)}
                        className={`flex-1 py-1.5 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer select-none active:scale-95 ${
                          autoNextConfig.seconds === sec
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-sm font-black'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {sec} 秒
                      </button>
                    ))}
                  </div>

                  {/* Smooth Range Slider 3s ~ 10s */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">3秒</span>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={1}
                      value={autoNextConfig.seconds}
                      onChange={(e) => handleSetSeconds(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-slate-400">10秒</span>
                  </div>
                </div>

                {/* Action Mode Selection: Arena Battle vs Fast Simulate */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-2.5">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-sky-400" />
                    <span>倒數結束時執行的動作：</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSetAction('enter')}
                      className={`min-h-[38px] py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        autoNextConfig.action === 'enter'
                          ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-400 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5 shrink-0" />
                      <span>進入擂台 (觀戰/操作)</span>
                    </button>

                    <button
                      onClick={() => handleSetAction('simulate')}
                      className={`min-h-[38px] py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        autoNextConfig.action === 'simulate'
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-300 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <FastForward className="w-3.5 h-3.5 shrink-0" />
                      <span>快速模擬 (直接出勝負)</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {autoNextConfig.action === 'enter'
                      ? '提示：自動載入 2D 擂台即時碰撞對戰畫面'
                      : '提示：自動演算結果並推進晉級，連續自動進行整場錦標賽'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed quick hint */
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-0.5">
              <span>可自由設定 10～3 秒倒數，自動依序推進下一場未開始的比賽。</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">預設：5秒</span>
                <button
                  onClick={() => {
                    handleSetSeconds(3);
                    handleToggleAutoNext();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-600/60 text-amber-300 font-mono font-bold text-[11px] cursor-pointer"
                >
                  ⚡ 快速 3 秒啟動
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Esports Interactive Bracket Grid */}
      <div className="w-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-x-auto overscroll-contain mobile-scroll-x shadow-inner">
        <div
          className="grid gap-6 min-w-[760px]"
          style={{
            gridTemplateColumns: `repeat(${rounds.length}, minmax(240px, 1fr))`
          }}
        >
          {rounds.map((roundGroup, rIdx) => (
            <div key={roundGroup.round} className="flex flex-col gap-3">
              {/* Round Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-300">
                    {roundGroup.name}
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {roundGroup.matches.filter(m => m.status === 'finished').length} / {roundGroup.matches.length}
                </span>
              </div>

              {/* Match Cards in this round */}
              <div className="flex flex-col justify-around gap-4 flex-1 py-1">
                {roundGroup.matches.map(match => renderMatchCard(match))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

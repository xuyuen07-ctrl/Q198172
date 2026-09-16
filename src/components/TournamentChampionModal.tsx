import React, { useEffect, useState } from 'react';
import { TournamentState, TournamentBeltState } from '../types/tournament';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { ChampionBeltBadge } from './ChampionBeltBadge';
import { soundEngine } from '../utils/audio';
import { Trophy, Crown, Sparkles, Swords, RotateCcw, Award, CheckCircle2, User, ShieldCheck, Flame } from 'lucide-react';

interface TournamentChampionModalProps {
  tournament: TournamentState;
  beltState: TournamentBeltState;
  onNewTournament: () => void;
  onViewBracket: () => void;
  onSwitchToDuel: () => void;
  onOpenBeltModal?: () => void;
}

export const TournamentChampionModal: React.FC<TournamentChampionModalProps> = ({
  tournament,
  beltState,
  onNewTournament,
  onViewBracket,
  onSwitchToDuel,
  onOpenBeltModal
}) => {
  if (!tournament.championId) return null;

  const champion = CHARACTERS[tournament.championId];
  const runnerUp = tournament.runnerUpId ? CHARACTERS[tournament.runnerUpId] : null;
  const isPlayerChampion = !!tournament.playerCharId && tournament.playerCharId === tournament.championId;

  // Calculate stats across tournament matches
  const champMatches = tournament.matches.filter(m => m.winnerCharId === tournament.championId);
  const totalKOs = champMatches.length;

  const lastIncrease = beltState.lastReignIncrease;
  const isRecentIncrease = !!lastIncrease && (Date.now() - lastIncrease.timestamp < 35000) && (lastIncrease.characterId === tournament.championId);
  const isTitleMatch = isRecentIncrease;
  const isDefense = lastIncrease?.isConsecutiveDefense ?? false;
  const daysAdded = lastIncrease?.daysAdded ?? 30;
  const totalDays = lastIncrease?.totalDays ?? (beltState.records[tournament.championId]?.reignDays || daysAdded);

  // Animated counting for virtual reign days
  const [displayedDays, setDisplayedDays] = useState<number>(() =>
    isDefense ? Math.max(0, totalDays - daysAdded) : 0
  );

  useEffect(() => {
    // Sound fanfare
    soundEngine.playChampionBeltFanfare();

    if (!isTitleMatch) return;

    const startValue = isDefense ? Math.max(0, totalDays - daysAdded) : 0;
    const targetValue = totalDays;
    const stepDuration = 35; // ms per tick
    const totalSteps = 25;
    const increment = Math.max(1, Math.round((targetValue - startValue) / totalSteps));

    let current = startValue;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setDisplayedDays(current);
      soundEngine.playDefenseDaysCount();
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalDays, daysAdded, isDefense, isTitleMatch]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md flex items-center justify-center min-h-full animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/60 p-5 sm:p-7 shadow-2xl shadow-amber-500/30 text-center overflow-hidden my-auto">
        {/* Shimmer background light beams */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Trophy & Crown Visual */}
        <div className="relative z-10 flex flex-col items-center flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y pr-1 w-full">
          {/* Champion Belt or Trophy Showcase in Header */}
          <div className="relative mb-2 flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-400/60 shadow-xl shadow-amber-500/25 mb-2 animate-bounce duration-1000">
              {isTitleMatch ? (
                <ChampionBeltBadge
                  size="lg"
                  reignDays={displayedDays}
                  showDays={false}
                  animate={true}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg">
                  <Trophy className="w-9 h-9 fill-slate-950 stroke-[2.2]" />
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
              {isTitleMatch ? (
                <>
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>最高榮譽・世界冠軍金腰帶加冕</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>錦標賽無頭銜賽冠軍 · 純戰績登頂</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isTitleMatch
                  ? (isDefense ? '衛冕王座成功！' : '新王霸氣加冕！')
                  : '淘汰賽總冠軍封王！'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center justify-center gap-2">
              <span className="text-flow-gold">
                {champion.name} {isTitleMatch ? (isDefense ? '衛冕金腰帶' : '加冕總冠軍') : '榮獲錦標賽冠軍'}
              </span>
            </h2>

            {isPlayerChampion && (
              <p className="text-xs font-bold text-sky-400 flex items-center justify-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>恭喜！你親自引導的代表選手成功贏得錦標賽總冠軍！</span>
              </p>
            )}
          </div>

          {/* Title Match Reign Days Reward Banner or Non-Title Tournament Trophy Banner */}
          {isTitleMatch ? (
            <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-950 to-amber-950/70 border-2 border-amber-400/50 shadow-lg shadow-amber-500/20 mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
                  {isDefense ? (
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] text-amber-300/90 font-bold flex items-center gap-1">
                    <span>{isDefense ? 'AND STILL! 成功衛冕金腰帶' : 'AND NEW! 加冕世界重量級冠軍'}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[9px] font-mono font-black border border-amber-500/40">
                      +{daysAdded} 天
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    {isDefense
                      ? `本屆連續第 ${beltState.records[tournament.championId]?.currentReignDefenses || 1} 次衛冕成功！(生涯總衛冕: ${beltState.records[tournament.championId]?.totalDefenses || 1} 次)`
                      : `新王加冕為第 ${beltState.records[tournament.championId]?.totalChampionships || 1} 度世界王者！(本屆衛冕起算 0 次)`}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-mono uppercase">累計衛冕天數</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400 flex items-baseline justify-end gap-0.5">
                  <span>{displayedDays}</span>
                  <span className="text-xs font-serif text-slate-300">天</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-400/50 shadow-lg mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shrink-0">
                  <Trophy className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <div className="text-[11px] text-indigo-200 font-bold flex items-center gap-1">
                    <span>無頭銜賽制：淘汰賽登頂！</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 text-[9px] font-mono font-black border border-indigo-500/40">
                      生涯勝場 +{totalKOs}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">
                    本場以無頭銜賽模式進行，結果已完全納入選手生涯勝負、勝率與傷害總統計！
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 font-mono uppercase">生涯總勝率</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-300 flex items-baseline justify-end gap-0.5">
                  <span>{beltState.records[tournament.championId]?.winRate.toFixed(0) || '100'}</span>
                  <span className="text-xs font-serif text-slate-300">%</span>
                </div>
              </div>
            </div>
          )}

          {/* Champion Display Showcase Card */}
          <div className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-inner mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20 shrink-0">
                <ChampionAvatarCanvas
                  characterId={champion.id}
                  size={56}
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-amber-400 font-bold">{champion.title}</div>
                <div className="text-base font-black text-slate-100">{champion.name}</div>
                <div className="text-xs text-slate-400">{champion.role}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-xs text-slate-300 w-full sm:w-auto justify-around sm:justify-center border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
              <div>
                <span className="text-slate-400">淘汰對手: </span>
                <span className="font-mono font-bold text-amber-400">{totalKOs} 場</span>
              </div>
              {runnerUp && (
                <div>
                  <span className="text-slate-400">決賽落敗: </span>
                  <span className="font-bold text-slate-300">{runnerUp.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <button
              onClick={onNewTournament}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              <span>新一屆淘汰賽 (發起衛冕戰)</span>
            </button>

            {onOpenBeltModal && (
              <button
                onClick={onOpenBeltModal}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/50 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>查看金腰帶名人堂</span>
              </button>
            )}

            <button
              onClick={onViewBracket}
              className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-sky-400" />
              <span>賽程樹</span>
            </button>

            <button
              onClick={onSwitchToDuel}
              className="w-full sm:w-auto py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
            >
              <Swords className="w-4 h-4 text-slate-400" />
              <span>1v1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

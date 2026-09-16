import React from 'react';
import { BallState } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { MarqueeText } from './MarqueeText';
import { Activity, Play, Pause, RotateCcw, Volume2, VolumeX, Swords, Zap, Flame, ShieldAlert, FastForward, Sparkles, Bomb, Skull, Eye, Target, Shield, Wind, Crosshair, Heart, Gift, Scissors, Moon, Home, Droplet, Snowflake, Lock, Star, Sun, Sword, ChevronLeft, Trophy, BookOpen, Info, Crown } from 'lucide-react';

interface BattleHUDProps {
  p1: BallState;
  p2: BallState;
  matchTime: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameover';
  gameSpeed: number;
  soundEnabled: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onToggleSpeed: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onReturnToMenu?: () => void;
  isP1Manual?: boolean;
  onTriggerP1Dash?: () => void;
  onTriggerP1Shield?: () => void;
  gameMode?: 'duel' | 'tournament';
  roundName?: string;
  onOpenHandbook?: () => void;
  onOpenHelpDrawer?: () => void;
  onReturnToBracket?: () => void;
  isTitleMatch?: boolean;
  onReplayIntro?: () => void;
}

const getCleanRole = (roleStr?: string): string => {
  if (!roleStr) return '';
  const match = roleStr.match(/^(.+?)（(.+)）$/);
  if (match) {
    const main = match[1];
    const subs = match[2].replace(/／/g, '·').replace(/\//g, '·').replace(/\s+/g, '');
    return `${main} · ${subs}`;
  }
  return roleStr;
};

interface XinExperienceBarProps {
  ball: BallState;
  compact?: boolean;
}

export const XinExperienceBar: React.FC<XinExperienceBarProps> = ({ ball, compact = false }) => {
  if (ball.characterId !== 'xin') return null;

  const level = ball.xinLevel || 1;
  const exp = Math.min(100, Math.max(0, ball.xinExp || 0));
  const isMaxLevel = level >= 6;
  const form = ball.xinForm || 'balance';

  // 形態專屬配色與陰影流光
  const formStyles = {
    dark: {
      accent: '#c084fc',
      border: 'border-purple-500/60',
      badgeBg: 'bg-purple-950/80',
      textAccent: 'text-purple-300',
      barGrad: 'bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-400',
      glowShadow: 'shadow-[0_0_8px_rgba(192,132,252,0.6)]',
      slotActiveBg: 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]',
      slotCurrentBg: 'bg-purple-500/50 animate-pulse border-purple-400',
    },
    light: {
      accent: '#fbbf24',
      border: 'border-amber-500/60',
      badgeBg: 'bg-amber-950/80',
      textAccent: 'text-amber-300',
      barGrad: 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300',
      glowShadow: 'shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      slotActiveBg: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]',
      slotCurrentBg: 'bg-amber-500/50 animate-pulse border-amber-400',
    },
    balance: {
      accent: '#38bdf8',
      border: 'border-sky-500/60',
      badgeBg: 'bg-slate-900/90',
      textAccent: 'text-sky-300',
      barGrad: 'bg-gradient-to-r from-sky-600 via-cyan-400 to-slate-200',
      glowShadow: 'shadow-[0_0_8px_rgba(56,189,248,0.6)]',
      slotActiveBg: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]',
      slotCurrentBg: 'bg-sky-500/50 animate-pulse border-sky-400',
    }
  }[form];

  const bonusDamage = (level - 1) * 10;
  const progressPercent = isMaxLevel ? 100 : exp;

  if (compact) {
    // 適用於行動端極簡 HUD
    return (
      <div className="flex items-center gap-1.5 w-full mt-0.5">
        <div className={`px-1 py-0.2 rounded text-[8px] font-mono font-black border ${formStyles.border} ${formStyles.badgeBg} ${formStyles.textAccent} shrink-0 flex items-center gap-0.5 leading-none`}>
          <Star className="w-2 h-2 fill-current" />
          <span>{isMaxLevel ? 'Lv.MAX' : `Lv.${level}`}</span>
        </div>
        <div className="flex-1 h-1.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative shadow-inner p-0.2">
          <div
            className={`h-full rounded-full transition-all duration-200 ${formStyles.barGrad} ${formStyles.glowShadow}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[7.5px] font-mono text-slate-400 shrink-0 leading-none">
          {isMaxLevel ? 'MAX' : `${exp}%`}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full p-1.5 rounded-lg bg-slate-950/80 border ${formStyles.border} mt-1.5 shadow-md relative overflow-hidden`}>
      {/* 頂部標題與等級/數值資訊列 */}
      <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none mb-1">
        <div className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${formStyles.border} ${formStyles.badgeBg} ${formStyles.textAccent} flex items-center gap-1 shadow-sm`}>
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>{isMaxLevel ? 'Lv.6 MAX' : `Lv.${level}`}</span>
          </span>
          <span className="text-slate-300 font-semibold tracking-tight text-[9.5px]">
            {isMaxLevel ? '神裝大成' : '魔劍經驗'}
          </span>
          {bonusDamage > 0 && (
            <span className="text-[8.5px] px-1 py-0.2 rounded bg-slate-800/80 text-amber-300/90 font-medium">
              +{bonusDamage}% 傷害
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[9px]">
          {isMaxLevel ? (
            <span className="text-amber-400 font-black tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>頂階極限</span>
            </span>
          ) : (
            <span className="text-slate-400">
              <span className={`font-black ${formStyles.textAccent}`}>{exp}</span>
              <span className="text-slate-600">/100 EXP</span>
            </span>
          )}
        </div>
      </div>

      {/* 6 階晶槽插槽分段刻度 (呼應球體頭部 6 階進階晶鑽) */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        {[1, 2, 3, 4, 5, 6].map((slotLevel) => {
          const isUnlocked = level >= slotLevel;
          const isCurrent = level === slotLevel && !isMaxLevel;
          return (
            <div
              key={slotLevel}
              className={`h-1.5 rounded-xs transition-all relative ${
                isUnlocked
                  ? formStyles.slotActiveBg
                  : isCurrent
                  ? `border ${formStyles.slotCurrentBg}`
                  : 'bg-slate-800/60 border border-slate-700/40'
              }`}
              title={`Lv.${slotLevel} 晶鑽核心`}
            >
              {isCurrent && (
                <div
                  className={`h-full ${formStyles.barGrad} rounded-xs`}
                  style={{ width: `${exp}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 主經驗進度條 (平滑光帶) */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/90 relative shadow-inner p-0.2">
        <div
          className={`h-full rounded-full transition-all duration-200 relative overflow-hidden ${formStyles.barGrad} ${formStyles.glowShadow}`}
          style={{ width: `${progressPercent}%` }}
        >
          <div className="energy-beam-flow opacity-60" />
        </div>
      </div>
    </div>
  );
};

interface YinyongStatusBarProps {
  ball: BallState;
  compact?: boolean;
}

export const YinyongStatusBar: React.FC<YinyongStatusBarProps> = ({ ball, compact = false }) => {
  if (ball.characterId !== 'yinyong') return null;

  const state = ball.yinyongState || 'SEARCHING';
  const chargeTimer = ball.yinyongChargeTimer || 0;
  const maxCharge = ball.yinyongMaxCharge || 22.0;
  const chargePercent = Math.min(100, Math.max(0, (chargeTimer / maxCharge) * 100));
  const declareTimer = ball.yinyongDeclareTimer || 0;
  const successCooldown = ball.yinyongSuccessCooldown || 0;
  const failRecoveryTimer = ball.yinyongFailRecoveryTimer || 0;
  const rageStacks = ball.yinyongRageStacks || 0;
  const isBoundless = !!ball.yinyongBoundlessActive;
  const boundlessDuration = ball.yinyongBoundlessDuration || 0;
  const isLowHp = ball.hp < ball.maxHp * 0.35;

  // Determine state display metadata
  let stateLabel = '目標搜尋';
  let stateColor = 'border-slate-700 bg-slate-900/80 text-slate-300';
  let barGradient = 'bg-gradient-to-r from-slate-600 to-slate-400';
  let barPercent = 0;
  let statusDetail = '尋找敵方破綻中...';
  let stateIcon = <Target className="w-2.5 h-2.5" />;

  if (isBoundless) {
    stateLabel = '一拳無界';
    stateColor = 'border-red-500/80 bg-red-950/90 text-red-200 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]';
    barGradient = 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-300';
    barPercent = (boundlessDuration / 4.0) * 100;
    statusDetail = `絕對免傷領域中 (${boundlessDuration.toFixed(1)}s)`;
    stateIcon = <Shield className="w-2.5 h-2.5 text-red-400" />;
  } else if (state === 'SEARCHING') {
    stateLabel = '搜尋目標';
    stateColor = 'border-amber-600/50 bg-amber-950/60 text-amber-300';
    barGradient = 'bg-gradient-to-r from-amber-700 to-yellow-500 animate-pulse';
    const st = ball.yinyongSearchTimer ?? 0.8;
    barPercent = Math.max(0, Math.min(100, ((0.8 - st) / 0.8) * 100));
    statusDetail = `鎖定目標座標中 (${st.toFixed(1)}s)...`;
    stateIcon = <Target className="w-2.5 h-2.5 text-amber-400" />;
  } else if (state === 'CHARGING') {
    stateLabel = '原地蓄力';
    stateColor = chargePercent >= 95
      ? 'border-amber-400/80 bg-red-950/90 text-amber-200 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]'
      : chargePercent >= 60
      ? 'border-rose-500/70 bg-red-950/70 text-rose-200'
      : 'border-red-600/60 bg-red-950/60 text-red-300';
    barGradient = chargePercent >= 95
      ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-300 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
      : chargePercent >= 60
      ? 'bg-gradient-to-r from-red-700 via-rose-500 to-orange-400'
      : 'bg-gradient-to-r from-red-900 via-red-700 to-rose-600';
    barPercent = chargePercent;
    statusDetail = `${chargeTimer.toFixed(1)}s / ${maxCharge.toFixed(0)}s (${chargePercent.toFixed(1)}%) 原地聚氣`;
    stateIcon = <Flame className="w-2.5 h-2.5 text-rose-400" />;
  } else if (state === 'DECLARING') {
    stateLabel = '身後宣告';
    stateColor = 'border-amber-400 bg-red-950/90 text-amber-300 animate-bounce shadow-[0_0_10px_rgba(250,204,21,0.8)]';
    barGradient = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-red-500';
    barPercent = Math.max(0, Math.min(100, (declareTimer / 2.5) * 100));
    statusDetail = `突襲至身後！宣告即將決勝 (${declareTimer.toFixed(1)}s)`;
    stateIcon = <Skull className="w-2.5 h-2.5 text-amber-400" />;
  } else if (state === 'PUNCHING') {
    stateLabel = '一拳決勝';
    stateColor = 'border-yellow-400 bg-amber-950/90 text-yellow-200 animate-pulse';
    barGradient = 'bg-gradient-to-r from-yellow-300 via-amber-400 to-red-600';
    barPercent = 100;
    statusDetail = '必殺重拳轟擊中！';
    stateIcon = <Zap className="w-2.5 h-2.5 text-yellow-300" />;
  } else if (state === 'COOLDOWN') {
    stateLabel = '冷卻中';
    stateColor = 'border-slate-700 bg-slate-900/80 text-slate-400';
    barGradient = 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500';
    barPercent = Math.max(0, Math.min(100, (1 - successCooldown / 8.0) * 100));
    statusDetail = `成功冷卻剩餘 ${successCooldown.toFixed(1)}s`;
    stateIcon = <RotateCcw className="w-2.5 h-2.5 text-slate-400" />;
  } else if (state === 'FAIL_RECOVERY') {
    stateLabel = '越挫越勇';
    stateColor = 'border-orange-500/70 bg-orange-950/70 text-orange-300';
    barGradient = 'bg-gradient-to-r from-orange-800 via-orange-600 to-amber-500';
    barPercent = Math.max(0, Math.min(100, (1 - failRecoveryTimer / 4.0) * 100));
    statusDetail = `落空恢復中剩餘 ${failRecoveryTimer.toFixed(1)}s (暴怒+1)`;
    stateIcon = <RotateCcw className="w-2.5 h-2.5 text-orange-400" />;
  }

  // Compact Mode (Mobile HUD)
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 w-full mt-0.5">
        <div className={`px-1 py-0.2 rounded text-[8px] font-mono font-black border ${stateColor} shrink-0 flex items-center gap-0.5 leading-none`}>
          {stateIcon}
          <span>{stateLabel}</span>
        </div>
        <div className="flex-1 h-1.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative shadow-inner p-0.2">
          <div
            className={`h-full rounded-full transition-all duration-100 ${barGradient}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
        <span className="text-[7.5px] font-mono text-slate-300 shrink-0 leading-none">
          {state === 'CHARGING'
            ? `${chargePercent.toFixed(0)}%`
            : state === 'DECLARING'
            ? `${declareTimer.toFixed(1)}s`
            : state === 'COOLDOWN'
            ? `${successCooldown.toFixed(1)}s`
            : state === 'FAIL_RECOVERY'
            ? `${failRecoveryTimer.toFixed(1)}s`
            : isBoundless
            ? `${boundlessDuration.toFixed(1)}s`
            : '待機'}
        </span>
      </div>
    );
  }

  // Desktop / Expanded Mode
  return (
    <div className={`w-full p-1.5 rounded-lg bg-slate-950/85 border ${
      isBoundless ? 'border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
      state === 'DECLARING' ? 'border-amber-500/70 shadow-[0_0_10px_rgba(250,204,21,0.4)]' :
      chargePercent >= 95 ? 'border-amber-500/60 shadow-[0_0_8px_rgba(250,204,21,0.3)]' :
      'border-red-900/50'
    } mt-1.5 shadow-md relative overflow-hidden`}>
      {/* Top Header: Badge, Status Text, and Rage/Immortal counters */}
      <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${stateColor} flex items-center gap-1 shadow-sm`}>
            {stateIcon}
            <span>{stateLabel}</span>
          </span>
          <span className="text-slate-300 font-semibold tracking-tight text-[9.5px]">
            {state === 'CHARGING' ? '22s 原地蓄力' : '一拳狀態'}
          </span>
          {rageStacks > 0 && (
            <span className="text-[8.5px] px-1 py-0.2 rounded bg-orange-950/80 border border-orange-600/60 text-orange-300 font-medium">
              暴怒 x{rageStacks} (+{rageStacks * 5}%)
            </span>
          )}
          {isLowHp && (
            <span className="text-[8px] px-1 py-0.2 rounded bg-rose-950/80 border border-rose-600/50 text-rose-300 font-medium">
              不死之血 3%
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
          {state === 'CHARGING' ? (
            <span>
              <span className="font-black text-amber-300">{chargeTimer.toFixed(1)}s</span>
              <span className="text-slate-500"> / 22.0s</span>
              <span className="text-rose-400 font-bold ml-1">({chargePercent.toFixed(1)}%)</span>
            </span>
          ) : state === 'DECLARING' ? (
            <span className="text-amber-300 font-black animate-pulse">
              倒數 {declareTimer.toFixed(1)}s
            </span>
          ) : state === 'COOLDOWN' ? (
            <span className="text-slate-400">
              冷卻剩餘 {successCooldown.toFixed(1)}s
            </span>
          ) : state === 'FAIL_RECOVERY' ? (
            <span className="text-orange-400">
              恢復剩餘 {failRecoveryTimer.toFixed(1)}s
            </span>
          ) : (
            <span className="text-slate-400">{statusDetail}</span>
          )}
        </div>
      </div>

      {/* 22s 蓄力刻度標記 (5s, 14s, 21s 里程碑) */}
      <div className="grid grid-cols-4 gap-1 mb-1">
        {[
          { label: '起手 0-5s', threshold: 5.0 },
          { label: '破勢 5-14s', threshold: 14.0 },
          { label: '極意 14-21s', threshold: 21.0 },
          { label: '必殺 21-22s', threshold: 22.0 },
        ].map((phase, idx) => {
          const isPhaseReached = chargeTimer >= phase.threshold;
          const isCurrentPhase = (
            (idx === 0 && chargeTimer < 5.0) ||
            (idx === 1 && chargeTimer >= 5.0 && chargeTimer < 14.0) ||
            (idx === 2 && chargeTimer >= 14.0 && chargeTimer < 21.0) ||
            (idx === 3 && chargeTimer >= 21.0)
          ) && state === 'CHARGING';

          return (
            <div
              key={idx}
              className={`h-1.5 rounded-xs transition-all relative ${
                isPhaseReached
                  ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                  : isCurrentPhase
                  ? 'bg-amber-400/80 animate-pulse border border-amber-300'
                  : 'bg-slate-900 border border-slate-800/80'
              }`}
              title={phase.label}
            />
          );
        })}
      </div>

      {/* 主進度條 */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/90 relative shadow-inner p-0.2">
        <div
          className={`h-full rounded-full transition-all duration-100 relative overflow-hidden ${barGradient}`}
          style={{ width: `${barPercent}%` }}
        >
          <div className="energy-beam-flow opacity-60" />
        </div>
      </div>
    </div>
  );
};

export const BattleHUD: React.FC<BattleHUDProps> = ({
  p1,
  p2,
  matchTime,
  gameStatus,
  gameSpeed,
  soundEnabled,
  onTogglePlay,
  onRestart,
  onToggleSpeed,
  onToggleSound,
  onOpenSettings,
  onReturnToMenu,
  isP1Manual,
  onTriggerP1Dash,
  onTriggerP1Shield,
  gameMode = 'duel',
  roundName,
  onOpenHandbook,
  onOpenHelpDrawer,
  onReturnToBracket,
  isTitleMatch = false,
  onReplayIntro
}) => {
  const p1Config = CHARACTERS[p1.characterId];
  const p2Config = CHARACTERS[p2.characterId];

  const p1HpPercent = Math.max(0, Math.min(100, (p1.hp / p1.maxHp) * 100));
  const p2HpPercent = Math.max(0, Math.min(100, (p2.hp / p2.maxHp) * 100));

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const renderPlayerSkillsMobileBar = (ball: BallState, side: 'p1' | 'p2') => {
    const isOba = ball.characterId === 'oba';
    const isHuotong = ball.characterId === 'huotong';
    const isHailaise = ball.characterId === 'hailaise';
    const isLingyinsi = ball.characterId === 'lingyinsi';
    const isChanshi = ball.characterId === 'chanshi';
    const isHuangzuan = ball.characterId === 'huangzuan';
    const isLanzuan = ball.characterId === 'lanzuan';
    const isFenzuan = ball.characterId === 'fenzuan';
    const isBaizuan = ball.characterId === 'baizuan';
    const isXukongshou = ball.characterId === 'xukongshou';
    const isFan = ball.characterId === 'fan';
    const isTunshimozu = ball.characterId === 'tunshimozu';
    const isMimi = ball.characterId === 'mimi';
    const isJiandaoshou = ball.characterId === 'jiandaoshou';
    const isDina = ball.characterId === 'dina';
    const isJianxian = ball.characterId === 'jianxian';
    const isLongshen = ball.characterId === 'longshen';
    const isZhizhu = ball.characterId === 'zhizhu';
    const isXin = ball.characterId === 'xin';
    const isKuileishi = ball.characterId === 'kuileishi';
    const isYinyong = ball.characterId === 'yinyong';
    const speed = Math.hypot(ball.vx, ball.vy);

    // Skill 1 Info
    let s1Icon = <Zap className="w-3 h-3 text-amber-400" />;
    let s1Label = '重擊加成';
    let s1Value = '常駐 +25%';
    let s1Active = false;
    let s1Progress = 1.0;
    let s1Color = '#3b82f6';

    if (isOba) {
      s1Icon = <Zap className="w-3 h-3 text-blue-400" />;
      s1Label = '重擊常駐';
      s1Value = '+25% 撞傷';
      s1Active = true;
      s1Progress = 1.0;
      s1Color = '#3b82f6';
    } else if (isHuotong) {
      s1Icon = <Flame className="w-3 h-3 text-red-400" />;
      s1Label = '火焰外殼';
      const cd = ball.huotongFlameShellCooldown ?? 0;
      s1Progress = cd > 0 ? Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0)) : 1.0;
      s1Active = cd <= 0.2;
      s1Value = cd > 0.2 ? `${cd.toFixed(1)}s` : ball.flameShellTriggered ? '反彈灼燒' : '就緒 5火';
      s1Color = cd <= 0.2 ? '#ef4444' : '#991b1b';
    } else if (isHailaise) {
      s1Icon = <Sparkles className="w-3 h-3 text-purple-400" />;
      s1Label = '魔法吸能';
      const energy = ball.magicEnergy || 0;
      s1Progress = Math.min(1.0, energy / 30);
      s1Active = energy >= 30;
      s1Value = energy >= 30 ? '滿額 +30' : `${energy.toFixed(0)}/30 點`;
      s1Color = '#a855f7';
    } else if (isLingyinsi) {
      s1Icon = <Zap className="w-3 h-3 text-sky-400" />;
      s1Label = '靈能藍箭';
      const cd = ball.blueArrowCooldown ?? 4;
      s1Progress = Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0));
      s1Active = cd <= 0.2;
      s1Value = cd <= 0.2 ? '就緒 3物傷' : `${cd.toFixed(1)}s`;
      s1Color = '#38bdf8';
    } else if (isChanshi) {
      s1Icon = <Zap className="w-3 h-3 text-amber-400" />;
      s1Label = '禁錮光環';
      const cd = ball.chanshiAuraCooldown ?? 7;
      s1Progress = Math.max(0, Math.min(1.0, (7.0 - cd) / 7.0));
      s1Active = cd <= 0.2;
      s1Value = cd <= 0.2 ? '就緒 緩速35%' : `${cd.toFixed(1)}s`;
      s1Color = '#eab308';
    } else if (isHuangzuan) {
      s1Icon = <Zap className="w-3 h-3 text-lime-400" />;
      s1Label = '指定閃電';
      const cd = ball.huangzuanLightningCooldown ?? 5;
      s1Progress = Math.max(0, Math.min(1.0, (5 - cd) / 5));
      s1Active = cd <= 0.2;
      s1Value = cd <= 0.2 ? '就緒 麻痺0.5s' : `${cd.toFixed(1)}s`;
      s1Color = '#facc15';
    } else if (isLanzuan) {
      s1Icon = <Zap className="w-3 h-3 text-sky-400" />;
      s1Label = '藍色波長';
      const tickTimer = ball.lanzuanWaveTickTimer || 0;
      s1Progress = Math.max(0, Math.min(1.0, (tickTimer % 0.5) / 0.5));
      s1Active = true;
      s1Value = '常駐 110px 脈衝';
      s1Color = '#38bdf8';
    } else if (isFenzuan) {
      s1Icon = <ShieldAlert className="w-3 h-3 text-pink-400" />;
      s1Label = '粉色圓盾';
      const cd = ball.fenzuanShieldCooldown ?? 8;
      const isFlying = !!ball.fenzuanShieldActive;
      s1Progress = isFlying ? 1.0 : Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0));
      s1Active = isFlying || cd <= 0.2;
      s1Value = isFlying ? '飛行折返中' : cd <= 0.2 ? '就緒 4物傷' : `${cd.toFixed(1)}s`;
      s1Color = '#f472b6';
    } else if (isBaizuan) {
      s1Icon = <Sparkles className="w-3 h-3 text-slate-100" />;
      s1Label = '鏡像分身';
      const clone = ball.baizuanClone;
      const cd = ball.baizuanCloneCooldown ?? 16;
      const hasClone = !!clone && clone.hp > 0;
      s1Progress = hasClone ? clone.hp / 2 : Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      s1Active = hasClone || cd <= 0.2;
      s1Value = hasClone ? `分身 HP ${clone.hp}/2` : cd <= 0.2 ? '就緒 鏡像' : `${cd.toFixed(0)}s`;
      s1Color = '#ffffff';
    } else if (isXukongshou) {
      s1Icon = <Skull className="w-3 h-3 text-purple-400" />;
      s1Label = '虛空撕咬';
      const active = !!ball.xukongshouBiteActive;
      const duration = ball.xukongshouBiteDuration || 0;
      const cd = ball.xukongshouBiteCooldown ?? 10;
      s1Active = active || cd <= 0.2;
      s1Progress = active ? duration / 3 : Math.max(0, Math.min(1.0, (10 - cd) / 10));
      s1Value = active ? `撕咬無敵 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒 咬3s' : `${cd.toFixed(0)}s`;
      s1Color = '#a855f7';
    } else if (isFan) {
      s1Icon = <Crosshair className="w-3 h-3 text-sky-400" />;
      s1Label = '狩獵箭矢';
      const marks = ball.fanHunterMarks || 0;
      const cd = ball.fanAttackCheckTimer ?? 1.5;
      s1Progress = Math.max(0, Math.min(1.0, (1.5 - cd) / 1.5));
      s1Active = cd <= 0.2;
      s1Value = marks >= 3 ? '真傷爆發!' : cd <= 0.2 ? `發射 (印記${marks}/3)` : `${cd.toFixed(1)}s`;
      s1Color = '#38bdf8';
    } else if (isTunshimozu) {
      s1Icon = <Flame className="w-3 h-3 text-purple-400" />;
      s1Label = '吞噬吸收';
      const stacks = ball.growthStacks || 0;
      s1Active = stacks > 0;
      s1Progress = Math.min(1.0, stacks / 50);
      s1Value = `成長 ${stacks}/50層`;
      s1Color = '#9333ea';
    } else if (isMimi) {
      s1Icon = <Zap className="w-3 h-3 text-pink-400" />;
      s1Label = '貓咪衝爪';
      const cd = ball.mimiClawCooldown ?? 2;
      s1Progress = Math.max(0, Math.min(1.0, (2 - cd) / 2));
      s1Active = cd <= 0.2;
      s1Value = cd <= 0.2 ? '就緒 3物+流血' : `${cd.toFixed(1)}s`;
      s1Color = '#f472b6';
    } else if (isJiandaoshou) {
      s1Icon = <Scissors className="w-3 h-3 text-slate-200" />;
      s1Label = '剪裁生命';
      const cd = ball.jiandaoshouSnipCooldown ?? 5.0;
      s1Progress = Math.max(0, Math.min(1.0, (5.0 - cd) / 5.0));
      s1Active = cd <= 0.1;
      s1Value = cd <= 0.1 ? '就緒 4物+1%最大HP' : `${cd.toFixed(1)}s`;
      s1Color = '#f8fafc';
    } else if (isDina) {
      s1Icon = <Sparkles className="w-3 h-3 text-slate-100" />;
      s1Label = '白光連射';
      const cd = ball.dinaWhiteLightCooldown ?? 1.2;
      const availCount = (ball.dinaWhiteEnergies || []).filter(e => e.state === 'AVAILABLE').length;
      s1Progress = Math.max(0, Math.min(1.0, (1.2 - cd) / 1.2));
      s1Active = cd <= 0.1;
      s1Value = cd <= 0.1 ? `就緒 0.5魔傷 (能量:${availCount})` : `${cd.toFixed(1)}s (能量:${availCount})`;
      s1Color = '#ffffff';
    } else if (isJianxian) {
      s1Icon = <Swords className="w-3 h-3 text-slate-100" />;
      s1Label = '白劍爆裂';
      const cd = ball.jianxianBurstSwordCooldown ?? 3.0;
      s1Progress = Math.max(0, Math.min(1.0, (3.0 - cd) / 3.0));
      s1Active = cd <= 0.15;
      s1Value = cd <= 0.15 ? '就緒 420px爆裂' : `${cd.toFixed(1)}s`;
      s1Color = '#ffffff';
    } else if (isLongshen) {
      s1Icon = <Wind className="w-3 h-3 text-amber-400" />;
      s1Label = '龍搖';
      const cd = ball.longshenSwoopCooldown ?? 1.5;
      s1Progress = Math.max(0, Math.min(1.0, (1.5 - cd) / 1.5));
      s1Active = cd <= 0.15 || !!ball.longshenSwoopActive;
      s1Value = ball.longshenSwoopActive ? '掠擊中' : cd <= 0.15 ? '就緒 衝刺掠擊' : `${cd.toFixed(1)}s`;
      s1Color = '#f59e0b';
    } else if (isZhizhu) {
      s1Icon = <Crosshair className="w-3 h-3 text-emerald-400" />;
      s1Label = '毒牙印記';
      const cd = ball.spiderVenomFangCooldown ?? 4.0;
      s1Progress = Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0));
      s1Active = cd <= 0.15;
      s1Value = cd <= 0.15 ? '就緒 150px突刺' : `${cd.toFixed(1)}s`;
      s1Color = '#10b981';
    } else if (isXin) {
      s1Icon = <Zap className="w-3 h-3 text-amber-300" />;
      s1Label = '魔劍普攻';
      const cd = ball.xinBasicAttackCooldown ?? 1.4;
      s1Progress = Math.max(0, Math.min(1.0, (1.4 - cd) / 1.4));
      s1Active = cd <= 0.15;
      s1Value = cd <= 0.15 ? '就緒 240px直射' : `${cd.toFixed(1)}s`;
      s1Color = ball.xinForm === 'dark' ? '#c084fc' : (ball.xinForm === 'light' ? '#fde047' : '#67e8f9');
    } else if (isKuileishi) {
      s1Icon = <Sparkles className="w-3 h-3 text-purple-300" />;
      s1Label = '傀儡召喚';
      const puppets = (ball.puppets || []).filter(p => p.hp > 0 && p.currentSegment <= 3);
      const cd = ball.puppetSummonCooldown ?? 8.0;
      s1Progress = puppets.length >= 2 ? 1.0 : Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0));
      s1Active = puppets.length > 0;
      s1Value = puppets.length > 0 ? `存活 ${puppets.length}/2隻 (30%護幕)` : cd <= 0.2 ? '就緒 召喚' : `${cd.toFixed(1)}s`;
      s1Color = '#c084fc';
    } else if (isYinyong) {
      s1Icon = <Zap className="w-3 h-3 text-red-500" />;
      s1Label = '尹雄一拳';
      const state = ball.yinyongState || 'READY';
      const charge = ball.yinyongChargeTimer || 0;
      const maxC = ball.yinyongMaxCharge || 22.0;
      if (state === 'CHARGING') {
        s1Progress = Math.min(1.0, charge / maxC);
        s1Active = true;
        s1Value = `蓄力 ${charge.toFixed(1)}/22s`;
        s1Color = '#ef4444';
      } else if (state === 'DECLARING') {
        s1Progress = 1.0;
        s1Active = true;
        s1Value = `身後宣告 ${(ball.yinyongDeclareTimer || 0).toFixed(1)}s`;
        s1Color = '#ffffff';
      } else if (state === 'PUNCHING') {
        s1Progress = 1.0;
        s1Active = true;
        s1Value = '一拳決勝爆發!!';
        s1Color = '#facc15';
      } else if (state === 'COOLDOWN' || (ball.yinyongSuccessCooldown || 0) > 0) {
        const cd = ball.yinyongSuccessCooldown || 0;
        s1Progress = Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0));
        s1Active = cd <= 0.15;
        s1Value = cd <= 0.15 ? '就緒' : `冷卻 ${cd.toFixed(1)}s`;
        s1Color = '#7f1d1d';
      } else if (state === 'FAIL_RECOVERY' || (ball.yinyongFailRecoveryTimer || 0) > 0) {
        const rec = ball.yinyongFailRecoveryTimer || 0;
        s1Progress = Math.max(0, Math.min(1.0, (4.0 - rec) / 4.0));
        s1Active = rec <= 0.15;
        s1Value = rec <= 0.15 ? '就緒' : `恢復 ${rec.toFixed(1)}s`;
        s1Color = '#991b1b';
      } else {
        const st = ball.yinyongSearchTimer ?? 0.8;
        s1Progress = Math.max(0, Math.min(1.0, (0.8 - st) / 0.8));
        s1Active = false;
        s1Value = '搜尋目標中...';
        s1Color = '#ef4444';
      }
    }

    // Skill 2 Info
    let s2Icon = <FastForward className="w-3 h-3 text-sky-300" />;
    let s2Label = '蓄力反彈';
    let s2Value = '待受擊';
    let s2Active = false;
    let s2Progress = 0.25;
    let s2Color = '#38bdf8';

    if (isOba) {
      s2Icon = <FastForward className="w-3 h-3 text-sky-300" />;
      s2Label = '蓄力反彈';
      s2Active = !!ball.hasChargedBounce;
      s2Progress = ball.hasChargedBounce ? 1.0 : 0.25;
      s2Value = ball.hasChargedBounce ? '就緒 +18%速' : '待受擊反彈';
      s2Color = '#38bdf8';
    } else if (isHuotong) {
      s2Icon = <ShieldAlert className="w-3 h-3 text-orange-400" />;
      s2Label = '滾燙狀態';
      const cd = ball.huotongHotBodyCooldown ?? 0;
      s2Progress = cd > 0 ? Math.max(0, Math.min(1.0, (3.5 - cd) / 3.5)) : Math.min(1.0, speed / 200);
      s2Active = !!ball.isHotBodyActive && cd <= 0.2;
      s2Value = cd > 0.2 ? `${cd.toFixed(1)}s` : ball.isHotBodyActive ? '高溫 +15%傷' : `${Math.round(speed)}/200速`;
      s2Color = cd > 0.2 ? '#7c2d12' : '#f97316';
    } else if (isHailaise) {
      s2Icon = <Zap className="w-3 h-3 text-fuchsia-400" />;
      s2Label = '紫光光束';
      const cd = ball.energyBeamCooldown ?? 5.5;
      s2Progress = Math.max(0, Math.min(1.0, (5.5 - cd) / 5.5));
      s2Active = cd <= 0.2;
      s2Value = cd <= 0.2 ? '就緒 10-20傷' : `${cd.toFixed(1)}s`;
      s2Color = '#d946ef';
    } else if (isLingyinsi) {
      s2Icon = <Sparkles className="w-3 h-3 text-cyan-400" />;
      s2Label = '靜止分身';
      const aliveClones = (ball.clones || []).filter(c => c.hp > 0).length;
      const cd = ball.cloneCooldown ?? 16;
      s2Progress = Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      s2Active = aliveClones > 0 || cd <= 0.2;
      s2Value = aliveClones > 0 ? `${aliveClones}分身 (分攤)` : cd <= 0.2 ? '就緒' : `${cd.toFixed(0)}s`;
      s2Color = '#06b6d4';
    } else if (isChanshi) {
      s2Icon = <ShieldAlert className="w-3 h-3 text-yellow-400" />;
      s2Label = '金鐘罩';
      s2Active = (ball.chanshiBellShieldTimer || 0) > 0 || (ball.chanshiSuperArmorTimer || 0) > 0;
      s2Progress = s2Active ? 1.0 : 0.3;
      s2Value = s2Active ? '霸體反彈20%' : '受擊反彈20%';
      s2Color = '#facc15';
    } else if (isHuangzuan) {
      s2Icon = <FastForward className="w-3 h-3 text-lime-300" />;
      s2Label = '閃電超速';
      const stacks = ball.huangzuanSpeedStacks || 0;
      s2Progress = stacks / 10;
      s2Active = stacks >= 10;
      s2Value = `${stacks}/10層 (${(94 * (1 + stacks * 0.05)).toFixed(0)}%)`;
      s2Color = '#fde047';
    } else if (isLanzuan) {
      s2Icon = <Sparkles className="w-3 h-3 text-cyan-300" />;
      s2Label = '藍色光球';
      if (ball.lanzuanOrb && ball.lanzuanOrb.hp > 0) {
        s2Active = true;
        s2Progress = ball.lanzuanOrb.hp / ball.lanzuanOrb.maxHp;
        s2Value = `光球 HP ${ball.lanzuanOrb.hp}/3`;
      } else {
        const cd = ball.lanzuanOrbCooldown ?? 20;
        s2Progress = Math.max(0, Math.min(1.0, (20 - cd) / 20));
        s2Active = cd <= 0.2;
        s2Value = cd <= 0.2 ? '就緒 召喚' : `${cd.toFixed(0)}s`;
      }
      s2Color = '#38bdf8';
    } else if (isFenzuan) {
      s2Icon = <ShieldAlert className="w-3 h-3 text-pink-300" />;
      s2Label = '減傷力場';
      const active = !!ball.fenzuanFieldActive;
      const duration = ball.fenzuanFieldDuration || 0;
      const cd = ball.fenzuanFieldCooldown ?? 22;
      s2Active = active || cd <= 0.2;
      s2Progress = active ? duration / 5 : Math.max(0, Math.min(1.0, (22.0 - cd) / 22.0));
      s2Value = active ? `力場中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒' : `${cd.toFixed(0)}s`;
      s2Color = '#ec4899';
    } else if (isBaizuan) {
      s2Icon = <Sparkles className="w-3 h-3 text-slate-100" />;
      s2Label = '純白閃耀';
      const active = !!ball.baizuanShiningActive;
      const duration = ball.baizuanShiningDuration || 0;
      const cd = ball.baizuanShiningCooldown ?? 16;
      s2Active = active || cd <= 0.2;
      s2Progress = active ? duration / 5 : Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      s2Value = active ? `閃耀中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒 定身' : `${cd.toFixed(0)}s`;
      s2Color = '#ffffff';
    } else if (isXukongshou) {
      s2Icon = <Eye className="w-3 h-3 text-purple-300" />;
      s2Label = '虛空裂縫';
      const hasRift = !!ball.xukongshouRift;
      const cd = ball.xukongshouRiftCooldown ?? 20;
      s2Active = hasRift || cd <= 0.2;
      s2Progress = hasRift ? (ball.xukongshouRift?.duration || 0) / 8 : Math.max(0, Math.min(1.0, (20 - cd) / 20));
      s2Value = hasRift ? (ball.xukongshouRift?.trappedEnemy ? '困住中' : '裂縫已開') : cd <= 0.2 ? '就緒 困2s' : `${cd.toFixed(0)}s`;
      s2Color = '#c084fc';
    } else if (isFan) {
      s2Icon = <FastForward className="w-3 h-3 text-cyan-400" />;
      s2Label = '翻滾預知';
      const isRolling = !!ball.fanIsRolling;
      const cd = ball.fanRollCooldown ?? 5;
      s2Active = isRolling || cd <= 0.2;
      s2Progress = isRolling ? 1.0 : Math.max(0, Math.min(1.0, (5 - cd) / 5));
      s2Value = isRolling ? '翻滾閃避中' : cd <= 0.2 ? '就緒 100px' : `${cd.toFixed(1)}s`;
      s2Color = '#06b6d4';
    } else if (isTunshimozu) {
      s2Icon = <Shield className="w-3 h-3 text-fuchsia-400" />;
      s2Label = '魔軀成長';
      const stacks = ball.growthStacks || 0;
      const bonusTier = Math.floor(stacks / 10);
      s2Active = bonusTier > 0;
      s2Progress = Math.min(1.0, bonusTier / 5);
      s2Value = bonusTier > 0 ? `階級 ${bonusTier}/5 (+${bonusTier * 2}%抗)` : '待10層強化';
      s2Color = '#c084fc';
    } else if (isMimi) {
      s2Icon = <Heart className="w-3 h-3 text-pink-400" />;
      s2Label = '愛心飛射';
      const cd = ball.mimiHeartCooldown ?? 20;
      s2Progress = Math.max(0, Math.min(1.0, (20 - cd) / 20));
      s2Active = cd <= 0.2;
      s2Value = cd <= 0.2 ? '就緒 6魔+魅惑' : `${cd.toFixed(1)}s`;
      s2Color = '#ec4899';
    } else if (isJiandaoshou) {
      s2Icon = <Shield className="w-3 h-3 text-amber-200" />;
      s2Label = '聖霧守護';
      if (ball.jiandaoshouMistActive) {
        s2Active = true;
        s2Progress = Math.max(0, Math.min(1.0, (ball.jiandaoshouMistDuration ?? 0) / 8));
        s2Value = `聖霧展開 ${(ball.jiandaoshouMistDuration ?? 0).toFixed(1)}s (130px防護)`;
        s2Color = '#fef08a';
      } else {
        const cd = ball.jiandaoshouMistCooldown ?? 18;
        s2Progress = Math.max(0, Math.min(1.0, (18.0 - cd) / 18.0));
        s2Active = false;
        s2Value = cd <= 0.1 ? '即將展開' : `冷卻 ${cd.toFixed(1)}s`;
        s2Color = '#94a3b8';
      }
    } else if (isDina) {
      s2Icon = <Moon className="w-3 h-3 text-purple-400" />;
      s2Label = '暗光蓄力';
      if (ball.dinaDarkLightState === 'CHARGING') {
        s2Active = true;
        const progress = (0.6 - (ball.dinaDarkLightChargeTimer ?? 0)) / 0.6;
        s2Progress = Math.max(0, Math.min(1.0, progress));
        s2Value = `蓄力中 ${(ball.dinaDarkLightChargeTimer ?? 0).toFixed(1)}s`;
        s2Color = '#c084fc';
      } else if (ball.dinaDarkLightState === 'READY') {
        s2Active = true;
        s2Progress = 1.0;
        s2Value = `蓄力完成 4魔傷${ball.dinaPerfectAbsorb ? ' (完美)' : ''}`;
        s2Color = '#d946ef';
      } else if (ball.dinaDarkLightState === 'FIRED') {
        s2Active = true;
        s2Progress = 1.0;
        s2Value = '融合窗口開啟 1.8s';
        s2Color = '#a855f7';
      } else {
        s2Active = false;
        s2Progress = 0.2;
        s2Value = ball.dinaPerfectAbsorb ? '具完美融合資格' : '吸收白光蓄力中';
        s2Color = '#7e22ce';
      }
    } else if (isJianxian) {
      s2Icon = <FastForward className="w-3 h-3 text-sky-400" />;
      s2Label = '退劍緩行';
      const cd = ball.jianxianRetreatCooldown ?? 7.6;
      const isRetreating = (ball.jianxianRetreatAnimTimer || 0) > 0;
      s2Progress = isRetreating ? 1.0 : Math.max(0, Math.min(1.0, (7.6 - cd) / 7.6));
      s2Active = isRetreating || cd <= 0.15;
      s2Value = isRetreating ? '仙影凌波中' : cd <= 0.15 ? '就緒 140px後撤' : `${cd.toFixed(1)}s`;
      s2Color = '#38bdf8';
    } else if (isLongshen) {
      s2Icon = <Flame className="w-3 h-3 text-orange-400" />;
      s2Label = '龍息';
      const cd = ball.longshenFlameCooldown ?? 6.0;
      s2Progress = Math.max(0, Math.min(1.0, (6.0 - cd) / 6.0));
      s2Active = cd <= 0.15 || !!ball.longshenFlameActive;
      s2Value = ball.longshenFlameActive ? '吐息中 5魔傷' : cd <= 0.15 ? '就緒 扇形龍息' : `${cd.toFixed(1)}s`;
      s2Color = '#ea580c';
    } else if (isZhizhu) {
      s2Icon = <Target className="w-3 h-3 text-emerald-400" />;
      s2Label = '獵網束縛';
      const cd = ball.spiderWebCooldown ?? 8.0;
      s2Progress = Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0));
      s2Active = cd <= 0.15;
      s2Value = cd <= 0.15 ? '就緒 380px飛網' : `${cd.toFixed(1)}s`;
      s2Color = '#10b981';
    } else if (isXin) {
      s2Icon = <FastForward className="w-3 h-3 text-purple-400" />;
      s2Label = '逐影破陣';
      const isDashing = !!ball.xinShadowDashing;
      const isCharging = (ball.xinShadowDashChargeTimer || 0) > 0;
      const cd = ball.xinShadowDashCooldown ?? 6.5;
      s2Progress = (isDashing || isCharging) ? 1.0 : Math.max(0, Math.min(1.0, (6.5 - cd) / 6.5));
      s2Active = isDashing || isCharging || cd <= 0.15;
      s2Value = isCharging ? '破陣蓄勢中' : isDashing ? '穿透突刺中!' : cd <= 0.15 ? '就緒 穿刺' : `${cd.toFixed(1)}s`;
      s2Color = ball.xinForm === 'dark' ? '#c084fc' : (ball.xinForm === 'light' ? '#fbbf24' : '#38bdf8');
    } else if (isKuileishi) {
      s2Icon = <Crosshair className="w-3 h-3 text-fuchsia-300" />;
      s2Label = '牽線束縛';
      const cd = ball.puppetTetherCooldown ?? 6.0;
      s2Progress = Math.max(0, Math.min(1.0, (6.0 - cd) / 6.0));
      s2Active = cd <= 0.15;
      s2Value = cd <= 0.15 ? '就緒 減速25%' : `${cd.toFixed(1)}s`;
      s2Color = '#e879f9';
    } else if (isYinyong) {
      s2Icon = <Sparkles className="w-3 h-3 text-rose-400" />;
      s2Label = '不死之血';
      const hpLow = ball.hp < ball.maxHp * 0.35;
      const cd = ball.yinyongImmortalCooldown || 0;
      if (hpLow) {
        if (cd > 0) {
          s2Progress = Math.max(0, Math.min(1.0, (12.0 - cd) / 12.0));
          s2Active = false;
          s2Value = `CD ${cd.toFixed(1)}s`;
          s2Color = '#7f1d1d';
        } else {
          const checkTimer = ball.yinyongImmortalCheckTimer ?? 2.0;
          s2Progress = Math.max(0, Math.min(1.0, (2.0 - checkTimer) / 2.0));
          s2Active = true;
          s2Value = `判定中(${checkTimer.toFixed(1)}s) 3%回滿`;
          s2Color = '#ef4444';
        }
      } else {
        s2Progress = Math.min(1.0, ball.hp / (ball.maxHp * 0.35));
        s2Active = false;
        s2Value = `需HP<35% (${Math.round(ball.hp)}/126)`;
        s2Color = '#64748b';
      }
    }

    // Skill 3 Info
    let s3Icon = <Sparkles className="w-3 h-3 text-amber-300" />;
    let s3Label = '連續猛撞';
    let s3Value = '0/3 次';
    let s3Active = false;
    let s3Progress = 0.0;
    let s3Color = '#fbbf24';

    if (isOba) {
      s3Icon = <Sparkles className="w-3 h-3 text-amber-300" />;
      s3Label = '連續猛撞';
      const combo = Math.min(ball.consecutiveHits || 0, 3);
      s3Progress = combo / 3;
      s3Active = combo >= 3;
      s3Value = combo >= 3 ? '就緒 +12傷!' : `${combo}/3 次碰撞`;
      s3Color = '#fbbf24';
    } else if (isHuotong) {
      s3Icon = <Bomb className="w-3 h-3 text-amber-400" />;
      s3Label = '爆燃反彈';
      const cd = ball.huotongExplosiveCooldown ?? 0;
      s3Active = !!ball.hasExplosiveBounceReady && cd <= 0.2;
      s3Progress = cd > 0 ? Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0)) : ball.hasExplosiveBounceReady ? 1.0 : 0.2;
      s3Value = cd > 0.2 ? `${cd.toFixed(1)}s` : ball.hasExplosiveBounceReady ? '就緒 +7火傷' : '待強力衝擊';
      s3Color = cd > 0.2 ? '#7c2d12' : '#ea580c';
    } else if (isHailaise) {
      s3Icon = <Bomb className="w-3 h-3 text-purple-300" />;
      s3Label = '絕境附身';
      const isLowHp = (ball.hp / ball.maxHp) <= 0.25;
      s3Active = !ball.hasTriggeredPossession && isLowHp;
      s3Progress = ball.hasTriggeredPossession ? 1.0 : isLowHp ? 1.0 : 0.25;
      s3Value = ball.hasTriggeredPossession ? '已釋放完畢' : isLowHp ? '觸發 3枚飛彈!' : 'HP<25% 觸發';
      s3Color = '#8b5cf6';
    } else if (isLingyinsi) {
      s3Icon = <ShieldAlert className="w-3 h-3 text-emerald-400" />;
      s3Label = '回金光圈';
      const activeOrbs = ball.greenOrbs?.filter(o => o.active).length || 0;
      const cd = ball.greenOrbsCooldown ?? 18;
      const isOrbsActive = !!ball.greenOrbsActive && activeOrbs > 0;
      s3Progress = isOrbsActive ? 1.0 : Math.max(0, Math.min(1.0, (18.0 - cd) / 18.0));
      s3Active = isOrbsActive || cd <= 0.2;
      s3Value = isOrbsActive ? `${activeOrbs}圈 (21傷)` : cd <= 0.2 ? '就緒' : `${cd.toFixed(0)}s`;
      s3Color = '#22c55e';
    } else if (isChanshi) {
      s3Icon = <Sparkles className="w-3 h-3 text-yellow-300" />;
      s3Label = '金身回復';
      const isLowHp = ball.hp <= 150;
      s3Active = !ball.chanshiGoldenBodyUsed && isLowHp;
      s3Progress = ball.chanshiGoldenBodyUsed ? 1.0 : isLowHp ? 1.0 : 0.3;
      s3Value = ball.chanshiGoldenBodyUsed ? '已回復 80HP' : isLowHp ? '觸發回 80HP!' : 'HP<30% 瀕死';
      s3Color = '#fef08a';
    } else if (isHuangzuan) {
      s3Icon = <Sparkles className="w-3 h-3 text-lime-400" />;
      s3Label = '雷電領域';
      const fieldActive = !!ball.huangzuanFieldActive;
      const duration = ball.huangzuanFieldDuration || 0;
      const cd = ball.huangzuanFieldCooldown ?? 30;
      s3Active = fieldActive || cd <= 0.2;
      s3Progress = fieldActive ? duration / 3.5 : Math.max(0, Math.min(1.0, (30 - cd) / 30));
      s3Value = fieldActive ? `電擊中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒' : `${cd.toFixed(0)}s`;
      s3Color = '#eab308';
    } else if (isLanzuan) {
      s3Icon = <Sparkles className="w-3 h-3 text-sky-400" />;
      s3Label = '情緒法陣';
      const fieldActive = !!ball.lanzuanEmotionFieldActive;
      const duration = ball.lanzuanEmotionFieldDuration || 0;
      const cd = ball.lanzuanEmotionCooldown ?? 40;
      s3Active = fieldActive || cd <= 0.2;
      s3Progress = fieldActive ? duration / 3.5 : Math.max(0, Math.min(1.0, (40 - cd) / 40));
      s3Value = fieldActive ? `法陣中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒 90爆' : `${cd.toFixed(0)}s`;
      s3Color = '#0ea5e9';
    } else if (isFenzuan) {
      s3Icon = <Sparkles className="w-3 h-3 text-pink-400" />;
      s3Label = '泡泡尖刺';
      const active = !!ball.fenzuanBubbleActive;
      const duration = ball.fenzuanBubbleDuration || 0;
      const cd = ball.fenzuanBubbleCooldown ?? 40;
      s3Active = active || cd <= 0.2;
      s3Progress = active ? duration / 10 : Math.max(0, Math.min(1.0, (40.0 - cd) / 40.0));
      s3Value = active ? `衝刺中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒 +3傷' : `${cd.toFixed(0)}s`;
      s3Color = '#f472b6';
    } else if (isBaizuan) {
      s3Icon = <Sparkles className="w-3 h-3 text-slate-100" />;
      s3Label = '白色死光';
      const active = !!ball.baizuanRayActive;
      const duration = ball.baizuanRayDuration || 0;
      const cd = ball.baizuanRayCooldown ?? 18;
      s3Active = active || cd <= 0.2;
      s3Progress = active ? duration / 8 : Math.max(0, Math.min(1.0, (18.0 - cd) / 18.0));
      s3Value = active ? `照射中 ${duration.toFixed(1)}s` : cd <= 0.2 ? '就緒 貫穿' : `${cd.toFixed(0)}s`;
      s3Color = '#ffffff';
    } else if (isXukongshou) {
      s3Icon = <Target className="w-3 h-3 text-purple-400" />;
      s3Label = '虛空獵擊';
      const isLocking = (ball.xukongshouHuntLockTimer || 0) > 0;
      const isDashing = !!ball.xukongshouHuntActive;
      const cd = ball.xukongshouHuntCooldown ?? 25;
      s3Active = isLocking || isDashing || cd <= 0.2;
      s3Progress = isLocking ? (3 - (ball.xukongshouHuntLockTimer || 0)) / 3 : Math.max(0, Math.min(1.0, (25 - cd) / 25));
      s3Value = isLocking ? `鎖定中 ${(ball.xukongshouHuntLockTimer || 0).toFixed(1)}s` : isDashing ? '幻影突進!' : cd <= 0.2 ? '就緒 20傷' : `${cd.toFixed(0)}s`;
      s3Color = '#a855f7';
    } else if (isFan) {
      s3Icon = <Zap className="w-3 h-3 text-amber-300" />;
      s3Label = '超速強化';
      const active = !!ball.fanOverclockActive;
      const duration = ball.fanOverclockDuration || 0;
      const cd = ball.fanOverclockCooldown ?? 20;
      s3Active = active || cd <= 0.2;
      s3Progress = active ? duration / 10 : Math.max(0, Math.min(1.0, (20 - cd) / 20));
      s3Value = active ? `超速中 ${duration.toFixed(1)}s (+30%速)` : cd <= 0.2 ? '就緒 強化10s' : `${cd.toFixed(0)}s`;
      s3Color = '#facc15';
    } else if (isTunshimozu) {
      s3Icon = <Bomb className="w-3 h-3 text-purple-400" />;
      s3Label = '暴食魔爆';
      const cd = ball.gluttonyBurstCooldown ?? 6;
      s3Active = cd <= 0.2;
      s3Progress = Math.max(0, Math.min(1.0, (6 - cd) / 6));
      s3Value = cd <= 0.2 ? '受撞30%觸發' : `${cd.toFixed(1)}s`;
      s3Color = '#a855f7';
    } else if (isMimi) {
      s3Icon = <Gift className="w-3 h-3 text-emerald-400" />;
      s3Label = '咪咪希望';
      const hasPacks = !!(ball.mimiGrowthPacks && ball.mimiGrowthPacks.length > 0);
      const destroyCd = ball.mimiHopeDestroyCooldown ?? 0;
      const spawnTimer = ball.mimiHopeSpawnTimer ?? 30;
      const lifeStacks = ball.mimiLifeStacks || 0;
      const atkStacks = ball.mimiAttackStacks || 0;
      const isBoosting = !!(ball.mimiSpeedBoostTimer && ball.mimiSpeedBoostTimer > 0);
      s3Active = hasPacks || isBoosting;
      s3Progress = hasPacks ? 1.0 : Math.max(0, Math.min(1.0, (30 - spawnTimer) / 30));
      const bonusText = (lifeStacks > 0 || atkStacks > 0) ? ` (+${(lifeStacks * 0.1).toFixed(1)}%HP +${(atkStacks * 0.1).toFixed(1)}%攻)` : '';
      s3Value = isBoosting
        ? `靈動加速中 (+15%速)`
        : hasPacks
          ? `雙包降臨!${bonusText}`
          : destroyCd > 0
            ? `破壞CD ${destroyCd.toFixed(0)}s`
            : `${Math.max(0, spawnTimer).toFixed(0)}s生成${bonusText}`;
      s3Color = '#10b981';
    } else if (isJiandaoshou) {
      s3Icon = <Crosshair className="w-3 h-3 text-sky-200" />;
      s3Label = '聖針連射';
      if ((ball.jiandaoshouNeedlesRemaining ?? 0) > 0) {
        s3Active = true;
        s3Progress = 1.0;
        s3Value = `連射中 剩餘${ball.jiandaoshouNeedlesRemaining}枚`;
        s3Color = '#38bdf8';
      } else {
        const cd = ball.jiandaoshouNeedleCooldown ?? 12;
        s3Progress = Math.max(0, Math.min(1.0, (12 - cd) / 12));
        s3Active = cd <= 0.2;
        s3Value = cd <= 0.2 ? '就緒 5枚連射' : `${cd.toFixed(1)}s`;
        s3Color = '#e2e8f0';
      }
    } else if (isDina) {
      s3Icon = <Wind className="w-3 h-3 text-indigo-300" />;
      s3Label = '核心之力/融合';
      if (ball.dinaCorePowerActive) {
        s3Active = true;
        s3Progress = 1.0;
        s3Value = '核心拉扯中 (拉至220px)';
        s3Color = '#818cf8';
      } else {
        const cd = ball.dinaCorePowerCooldown ?? 8;
        s3Progress = Math.max(0, Math.min(1.0, (8 - cd) / 8));
        s3Active = cd <= 0.2;
        s3Value = cd <= 0.2 ? '核心就緒 (防護130px)' : `${cd.toFixed(1)}s`;
        s3Color = '#c7d2fe';
      }
    } else if (isJianxian) {
      s3Icon = <Shield className="w-3 h-3 text-sky-300" />;
      s3Label = '百萬劍陣';
      if (ball.jianxianArrayActive) {
        s3Active = true;
        const dur = ball.jianxianArrayDuration ?? 0;
        s3Progress = Math.max(0, Math.min(1.0, dur / 10.0));
        const totalDmg = (ball.jianxianArrayTotalDamage ?? 0).toFixed(1);
        s3Value = `劍陣中 ${dur.toFixed(1)}s (${totalDmg}/35傷)`;
        s3Color = '#38bdf8';
      } else {
        const cd = ball.jianxianArrayCooldown ?? 30;
        s3Progress = Math.max(0, Math.min(1.0, (30.0 - cd) / 30.0));
        s3Active = cd <= 0.2;
        s3Value = cd <= 0.2 ? '就緒 10s守護劍陣' : `${cd.toFixed(0)}s`;
        s3Color = '#7dd3fc';
      }
    } else if (isLongshen) {
      s3Icon = <Sparkles className="w-3 h-3 text-amber-300" />;
      s3Label = '龍形';
      const cd = ball.longshenFormCooldown ?? 24.0;
      const active = !!ball.longshenFormActive;
      const dur = ball.longshenFormDuration ?? 0;
      s3Progress = active ? Math.max(0, Math.min(1.0, dur / 7.0)) : Math.max(0, Math.min(1.0, (24.0 - cd) / 24.0));
      s3Active = active || cd <= 0.15;
      s3Value = active ? `龍形真身 ${dur.toFixed(1)}s` : cd <= 0.15 ? '就緒 7s真龍' : `${cd.toFixed(1)}s`;
      s3Color = '#f59e0b';
    } else if (isZhizhu) {
      s3Icon = <Shield className="w-3 h-3 text-emerald-400" />;
      s3Label = '蛛群獵殺';
      const cd = ball.spiderSwarmCooldown ?? 15.0;
      const count = ball.spiderMiniSummons?.length || 0;
      s3Progress = Math.max(0, Math.min(1.0, (15.0 - cd) / 15.0));
      s3Active = count > 0 || cd <= 0.15;
      s3Value = count > 0 ? `召喚中 (${count}隻)` : cd <= 0.15 ? '就緒 召喚×3' : `${cd.toFixed(1)}s`;
      s3Color = '#34d399';
    } else if (isXin) {
      s3Icon = <Flame className="w-3 h-3 text-amber-400" />;
      s3Label = '裂空劍痕';
      const isCharging = (ball.xinSkySlashChargeTimer || 0) > 0;
      const cd = ball.xinSkySlashCooldown ?? 11.0;
      s3Progress = isCharging ? 1.0 : Math.max(0, Math.min(1.0, (11.0 - cd) / 11.0));
      s3Active = isCharging || cd <= 0.15;
      s3Value = isCharging ? '裂空蓄能中!' : cd <= 0.15 ? '就緒 42爆發' : `${cd.toFixed(1)}s`;
      s3Color = ball.xinForm === 'dark' ? '#a855f7' : (ball.xinForm === 'light' ? '#f59e0b' : '#38bdf8');
    } else if (isKuileishi) {
      s3Icon = <Zap className="w-3 h-3 text-purple-400" />;
      s3Label = '木偶終幕';
      const stacks = ball.puppetResonance || 0;
      const cd = ball.puppetFinaleCooldown ?? 20.0;
      const isReady = stacks >= 3 && cd <= 0.15;
      s3Progress = Math.max(0, Math.min(1.0, (20.0 - cd) / 20.0));
      s3Active = isReady;
      s3Value = cd > 0.15 ? `CD ${cd.toFixed(1)}s (共鳴${stacks}/3)` : stacks >= 3 ? '★ 終幕就緒！' : `待共鳴 ${stacks}/3層`;
      s3Color = stacks >= 3 ? '#f472b6' : '#a855f7';
    } else if (isYinyong) {
      s3Icon = <ShieldAlert className="w-3 h-3 text-amber-400" />;
      s3Label = '越挫越勇';
      const stacks = ball.yinyongRageStacks || 0;
      s3Progress = stacks / 10;
      s3Active = stacks > 0;
      s3Value = `暴怒 ${stacks}/10 (+${stacks * 5}%傷)`;
      s3Color = stacks >= 10 ? '#facc15' : '#f97316';
    }

    // Skill 4 Info (New Passive 4)
    let s4Icon = <Zap className="w-3 h-3 text-cyan-400" />;
    let s4Label = '被動四';
    let s4Value = '常駐就緒';
    let s4Active = true;
    let s4Progress = 1.0;
    let s4Color = '#38bdf8';

    if (isOba) {
      s4Icon = <Zap className="w-3 h-3 text-sky-400" />;
      s4Label = '破陣衝鋒';
      s4Value = '就緒 +14物傷';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#3b82f6';
    } else if (isHuotong) {
      s4Icon = <Flame className="w-3 h-3 text-orange-400" />;
      s4Label = '熔火爆步';
      s4Value = '就緒 熔岩路徑';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#f97316';
    } else if (isHailaise) {
      s4Icon = <Sparkles className="w-3 h-3 text-purple-400" />;
      s4Label = '潮汐重壓';
      s4Value = '就緒 減速重力';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#a855f7';
    } else if (isLingyinsi) {
      s4Icon = <FastForward className="w-3 h-3 text-emerald-400" />;
      s4Label = '殘影步法';
      s4Value = '受擊殘影滑行';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#10b981';
    } else if (isChanshi) {
      s4Icon = <Shield className="w-3 h-3 text-amber-300" />;
      s4Label = '菩提金鐘';
      s4Value = '就緒 金鐘抵傷';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#f59e0b';
    } else if (isHuangzuan) {
      s4Icon = <Zap className="w-3 h-3 text-yellow-400" />;
      s4Label = '金晶破甲';
      s4Value = '就緒 破甲電擊';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#eab308';
    } else if (isLanzuan) {
      s4Icon = <ShieldAlert className="w-3 h-3 text-cyan-400" />;
      s4Label = '蒼藍冰鏡';
      s4Value = '就緒 反彈冰鏡';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#06b6d4';
    } else if (isFenzuan) {
      s4Icon = <Heart className="w-3 h-3 text-pink-400" />;
      s4Label = '治癒晶芒';
      s4Value = '就緒 自癒28HP';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#ec4899';
    } else if (isBaizuan) {
      s4Icon = <Sun className="w-3 h-3 text-slate-100" />;
      s4Label = '折射刺殺';
      s4Value = '撞牆隱光 破防35%';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#f8fafc';
    } else if (isXukongshou) {
      s4Icon = <Eye className="w-3 h-3 text-purple-300" />;
      s4Label = '虛空潛行';
      s4Value = '招後潛行 +14暗傷';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#c084fc';
    } else if (isFan) {
      s4Icon = <Target className="w-3 h-3 text-yellow-300" />;
      s4Label = '弱點洞察';
      s4Value = '遠距+25%傷+雙印';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#eab308';
    } else if (isTunshimozu) {
      s4Icon = <Shield className="w-3 h-3 text-purple-400" />;
      s4Label = '魔能硬皮';
      s4Value = '每5碎片+16抵傷';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#9333ea';
    } else if (isMimi) {
      s4Icon = <Heart className="w-3 h-3 text-rose-400" />;
      s4Label = '貓咪九命';
      s4Value = '瀕死保底1HP無敵';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#f43f5e';
    } else if (isJiandaoshou) {
      s4Icon = <Scissors className="w-3 h-3 text-slate-200" />;
      s4Label = '縫合收線';
      s4Value = '4段收線 24魔傷';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#e2e8f0';
    } else if (isDina) {
      s4Icon = <Sparkles className="w-3 h-3 text-purple-300" />;
      s4Label = '極光共鳴';
      s4Value = '極光帶 9魔傷/回能';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#c084fc';
    } else if (isJianxian) {
      s4Icon = <Sword className="w-3 h-3 text-sky-400" />;
      s4Label = '萬劍歸宗';
      s4Value = '每6劍落巨靈劍';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#38bdf8';
    } else if (isLongshen) {
      s4Icon = <Zap className="w-3 h-3 text-amber-400" />;
      s4Label = '龍威';
      s4Value = '真龍威壓 (常駐)';
      s4Active = true;
      s4Progress = 1.0;
      s4Color = '#f59e0b';
    } else if (isZhizhu) {
      s4Icon = <Skull className="w-3 h-3 text-emerald-500" />;
      s4Label = '蛛后毒爆';
      const cd = ball.spiderBurstCooldown ?? 25.0;
      s4Progress = Math.max(0, Math.min(1.0, (25.0 - cd) / 25.0));
      s4Active = cd <= 0.15;
      s4Value = cd <= 0.15 ? '就緒 160px毒爆' : `${cd.toFixed(1)}s`;
      s4Color = '#059669';
    } else if (isXin) {
      s4Icon = <Sun className="w-3 h-3 text-amber-300" />;
      s4Label = '雙相魔劍';
      const formText = ball.xinForm === 'dark' ? '煞暗(狂暴)' : (ball.xinForm === 'light' ? '曜光(統御)' : '平衡形態');
      const energy = Math.round(ball.xinFormEnergy ?? 100);
      s4Value = `${formText} ${energy}%`;
      s4Active = true;
      s4Progress = energy / 100;
      s4Color = ball.xinForm === 'dark' ? '#a855f7' : (ball.xinForm === 'light' ? '#f59e0b' : '#38bdf8');
    } else if (isKuileishi) {
      s4Icon = <ShieldAlert className="w-3 h-3 text-purple-300" />;
      s4Label = '傀儡護幕/替身';
      const hasPuppets = (ball.puppets || []).filter(p => p.hp > 0 && p.currentSegment <= 3).length > 0;
      const subCd = ball.puppetSubstituteCooldown ?? 0;
      s4Active = hasPuppets;
      s4Progress = hasPuppets ? 1.0 : 0.2;
      s4Value = hasPuppets
        ? (subCd > 0 ? `護幕30% (替身CD ${subCd.toFixed(0)}s)` : '護幕30% + 替身就緒')
        : '無傀儡保護';
      s4Color = '#c084fc';
    } else if (isYinyong) {
      s4Icon = <Crosshair className="w-3 h-3 text-red-500" />;
      s4Label = '一拳無界';
      if (ball.yinyongBoundlessActive) {
        s4Progress = Math.max(0, (ball.yinyongBoundlessDuration ?? 0) / 4.0);
        s4Active = true;
        s4Value = `★ 免傷 ${(ball.yinyongBoundlessDuration ?? 0).toFixed(1)}s`;
        s4Color = '#ef4444';
      } else if (ball.yinyongBoundlessUsed) {
        s4Progress = 0;
        s4Active = false;
        s4Value = '已觸發 (限1次)';
        s4Color = '#475569';
      } else {
        s4Progress = 1.0;
        s4Active = true;
        s4Value = '就緒 (HP<1%免傷4s+回10%)';
        s4Color = '#dc2626';
      }
    }

    const charConfig = CHARACTERS[ball.characterId];
    const p1Desc = charConfig?.passives?.[0]?.description || '';
    const p2Desc = charConfig?.passives?.[1]?.description || '';
    const p3Desc = charConfig?.passives?.[2]?.description || '';
    const p4Desc = charConfig?.passives?.[3]?.description || '';
    const p1FullName = charConfig?.passives?.[0]?.name || s1Label;
    const p2FullName = charConfig?.passives?.[1]?.name || s2Label;
    const p3FullName = charConfig?.passives?.[2]?.name || s3Label;
    const p4FullName = charConfig?.passives?.[3]?.name || s4Label;

    return (
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mt-2 pt-2 border-t border-slate-800/80 shrink-0">
        {/* Skill 1 Card */}
        <div
          className={`group h-[58px] min-h-[58px] max-h-[58px] p-1.5 rounded-lg border flex flex-col justify-between transition-all relative cursor-help overflow-hidden shrink-0 ${
            s1Active
              ? 'bg-purple-500/20 border-purple-400/80 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.35)] ring-1 ring-purple-400/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
          title={`【被動一・${p1FullName}】\n狀態: ${s1Value}\n${p1Desc}`}
        >
          {/* Hover Skill Tooltip popup */}
          <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 z-50 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-left w-52 pointer-events-none text-slate-200">
            <div className="font-bold text-xs flex items-center gap-1" style={{ color: s1Color }}>
              <span>被動一・{p1FullName}</span>
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">{s1Value} ({Math.round(s1Progress * 100)}%)</div>
            <div className="text-[10px] text-slate-300 mt-1 leading-relaxed">{p1Desc}</div>
          </div>

          <div className="flex items-center justify-between gap-1 w-full min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="shrink-0">{s1Icon}</span>
              <MarqueeText containerClassName="min-w-0 flex-1" className="text-[10px] sm:text-[11px] font-bold tracking-tight">
                {s1Label}
              </MarqueeText>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                s1Active ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono leading-none my-0.5 min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden whitespace-nowrap">
            <MarqueeText containerClassName="min-w-0 flex-1" className="font-semibold text-slate-200">
              {s1Value}
            </MarqueeText>
            <span className="text-[8px] sm:text-[9px] text-sky-400 font-bold ml-1 shrink-0">
              {Math.round(s1Progress * 100)}%
            </span>
          </div>

          {/* Mini Cooldown Track Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90 relative shrink-0">
            <div
              className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
              style={{
                width: `${Math.round(s1Progress * 100)}%`,
                backgroundColor: s1Color,
                boxShadow: s1Active ? `0 0 8px ${s1Color}` : 'none'
              }}
            >
              <div className="energy-beam-flow" />
            </div>
          </div>
        </div>

        {/* Skill 2 Card */}
        <div
          className={`group h-[58px] min-h-[58px] max-h-[58px] p-1.5 rounded-lg border flex flex-col justify-between transition-all relative cursor-help overflow-hidden shrink-0 ${
            s2Active
              ? 'bg-amber-500/20 border-amber-400/80 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
          title={`【被動二・${p2FullName}】\n狀態: ${s2Value}\n${p2Desc}`}
        >
          {/* Hover Skill Tooltip popup */}
          <div className="hidden group-hover:block absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-1 z-50 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-left w-52 pointer-events-none text-slate-200">
            <div className="font-bold text-xs flex items-center gap-1" style={{ color: s2Color }}>
              <span>被動二・{p2FullName}</span>
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">{s2Value} ({Math.round(s2Progress * 100)}%)</div>
            <div className="text-[10px] text-slate-300 mt-1 leading-relaxed">{p2Desc}</div>
          </div>

          <div className="flex items-center justify-between gap-1 w-full min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="shrink-0">{s2Icon}</span>
              <MarqueeText containerClassName="min-w-0 flex-1" className="text-[10px] sm:text-[11px] font-bold tracking-tight">
                {s2Label}
              </MarqueeText>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                s2Active ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono leading-none my-0.5 min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden whitespace-nowrap">
            <MarqueeText containerClassName="min-w-0 flex-1" className={`font-semibold ${s2Active ? 'text-amber-300' : 'text-slate-200'}`}>
              {s2Value}
            </MarqueeText>
            <span className="text-[8px] sm:text-[9px] text-sky-400 font-bold ml-1 shrink-0">
              {Math.round(s2Progress * 100)}%
            </span>
          </div>

          {/* Mini Cooldown Track Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90 relative shrink-0">
            <div
              className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
              style={{
                width: `${Math.round(s2Progress * 100)}%`,
                backgroundColor: s2Color,
                boxShadow: s2Active ? `0 0 8px ${s2Color}` : 'none'
              }}
            >
              <div className="energy-beam-flow" />
            </div>
          </div>
        </div>

        {/* Skill 3 Card */}
        <div
          className={`group h-[58px] min-h-[58px] max-h-[58px] p-1.5 rounded-lg border flex flex-col justify-between transition-all relative cursor-help overflow-hidden shrink-0 ${
            s3Active
              ? 'bg-amber-400/25 border-amber-400/90 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.45)] ring-1 ring-amber-400/40'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
          title={`【被動三・${p3FullName}】\n狀態: ${s3Value}\n${p3Desc}`}
        >
          {/* Hover Skill Tooltip popup */}
          <div className="hidden group-hover:block absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 mb-1 z-50 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-left w-52 pointer-events-none text-slate-200">
            <div className="font-bold text-xs flex items-center gap-1" style={{ color: s3Color }}>
              <span>被動三・{p3FullName}</span>
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">{s3Value} ({Math.round(s3Progress * 100)}%)</div>
            <div className="text-[10px] text-slate-300 mt-1 leading-relaxed">{p3Desc}</div>
          </div>

          <div className="flex items-center justify-between gap-1 w-full min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="shrink-0">{s3Icon}</span>
              <MarqueeText containerClassName="min-w-0 flex-1" className="text-[10px] sm:text-[11px] font-bold tracking-tight">
                {s3Label}
              </MarqueeText>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                s3Active ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono leading-none my-0.5 min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden whitespace-nowrap">
            <MarqueeText containerClassName="min-w-0 flex-1" className={`font-semibold ${s3Active ? 'text-amber-300' : 'text-slate-200'}`}>
              {s3Value}
            </MarqueeText>
            <span className="text-[8px] sm:text-[9px] text-sky-400 font-bold ml-1 shrink-0">
              {Math.round(s3Progress * 100)}%
            </span>
          </div>

          {/* Mini Cooldown Track Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90 relative shrink-0">
            <div
              className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
              style={{
                width: `${Math.round(s3Progress * 100)}%`,
                backgroundColor: s3Color,
                boxShadow: s3Active ? `0 0 8px ${s3Color}` : 'none'
              }}
            >
              <div className="energy-beam-flow" />
            </div>
          </div>
        </div>

        {/* Skill 4 Card */}
        <div
          className={`group h-[58px] min-h-[58px] max-h-[58px] p-1.5 rounded-lg border flex flex-col justify-between transition-all relative cursor-help overflow-hidden shrink-0 ${
            s4Active
              ? 'bg-sky-500/20 border-sky-400/80 text-sky-100 shadow-[0_0_10px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
          title={`【被動四・${p4FullName}】\n狀態: ${s4Value}\n${p4Desc}`}
        >
          {/* Hover Skill Tooltip popup */}
          <div className="hidden group-hover:block absolute bottom-full right-0 mb-1 z-50 p-2 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-left w-52 pointer-events-none text-slate-200">
            <div className="font-bold text-xs flex items-center gap-1" style={{ color: s4Color }}>
              <span>被動四・{p4FullName}</span>
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">{s4Value} ({Math.round(s4Progress * 100)}%)</div>
            <div className="text-[10px] text-slate-300 mt-1 leading-relaxed">{p4Desc}</div>
          </div>

          <div className="flex items-center justify-between gap-1 w-full min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="shrink-0">{s4Icon}</span>
              <MarqueeText containerClassName="min-w-0 flex-1" className="text-[10px] sm:text-[11px] font-bold tracking-tight">
                {s4Label}
              </MarqueeText>
            </div>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                s4Active ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono leading-none my-0.5 min-w-0 h-4 min-h-[16px] max-h-[16px] overflow-hidden whitespace-nowrap">
            <MarqueeText containerClassName="min-w-0 flex-1" className={`font-semibold ${s4Active ? 'text-sky-300' : 'text-slate-200'}`}>
              {s4Value}
            </MarqueeText>
            <span className="text-[8px] sm:text-[9px] text-sky-400 font-bold ml-1 shrink-0">
              {Math.round(s4Progress * 100)}%
            </span>
          </div>

          {/* Mini Cooldown Track Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90 relative shrink-0">
            <div
              className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
              style={{
                width: `${Math.round(s4Progress * 100)}%`,
                backgroundColor: s4Color,
                boxShadow: s4Active ? `0 0 8px ${s4Color}` : 'none'
              }}
            >
              <div className="energy-beam-flow" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="battle-hud" className="w-full max-w-4xl mx-auto space-y-2.5 select-none shrink-0">
      {/* Top Match Bar & Quick Controls - Non-overlapping Responsive Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900/95 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg shrink-0 gap-2">
        {/* Top Segment: Left Identity + Mobile Timer (Separated on Mobile, Unified on Desktop) */}
        <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
          {/* Left Navigation & Match Identity */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {gameMode === 'tournament' ? (
              <button
                id="btn-arena-return-bracket"
                onClick={onReturnToBracket || onReturnToMenu}
                className="h-8 px-2 sm:px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 group shrink-0"
                title="返回錦標淘汰賽程樹"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                <span className="hidden sm:inline">返回賽程</span>
                <span className="sm:hidden">賽程</span>
              </button>
            ) : (
              onReturnToMenu && (
                <button
                  id="btn-arena-return-menu"
                  onClick={onReturnToMenu}
                  className="h-8 px-2 sm:px-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 group shrink-0"
                  title="返回主選單"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-sky-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                  <span className="hidden sm:inline">返回主選單</span>
                  <span className="sm:hidden">選單</span>
                </button>
              )
            )}

            {/* Mode Badge */}
            {gameMode === 'tournament' ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[11px] font-bold shrink-0">
                <Trophy className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-none">{roundName || '淘汰賽'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-sky-300 text-[11px] font-bold shrink-0">
                <Swords className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="hidden sm:inline">1 VS 1 經典單挑</span>
                <span className="sm:hidden">1V1</span>
              </div>
            )}

            {/* Title Match Status Badge */}
            {isTitleMatch ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-bold shrink-0 animate-pulse shadow-xs">
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <span className="hidden sm:inline">👑 冠軍加冕賽</span>
                <span className="sm:hidden">加冕賽</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/80 text-slate-400 text-[10.5px] font-semibold shrink-0">
                <span className="hidden sm:inline">⚔️ 一般比賽</span>
                <span className="sm:hidden">一般賽</span>
              </div>
            )}
          </div>

          {/* Dedicated Mobile Timer (Placed cleanly on top-right on mobile, never overlapping text) */}
          <div className="sm:hidden flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-sky-500/40 shadow-inner shrink-0">
            <Activity className="w-3 h-3 text-sky-400 animate-pulse shrink-0" />
            <span className="font-mono text-xs font-black text-sky-200 min-w-[46px] text-center tracking-wider">
              {formatTime(matchTime)}
            </span>
          </div>
        </div>

        {/* Desktop Centered Timer (With dedicated spacing and clear separation, zero text collision) */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-lg border border-slate-800 shadow-inner shrink-0 mx-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" />
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden lg:inline">戰鬥時間</span>
          <span className="font-mono text-xs sm:text-sm font-black text-sky-200 min-w-[54px] text-center tracking-wider">
            {formatTime(matchTime)}
          </span>
        </div>

        {/* Right Match Controls & Utilities - Logically Ordered & Non-duplicated */}
        <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-1.5 touch-manipulation select-none shrink-0 pt-1 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
          {/* 1. Play / Pause (Primary Action) */}
          <button
            id="btn-toggle-play"
            onClick={onTogglePlay}
            className={`h-8 min-w-[34px] px-2 sm:px-2.5 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm ${
              gameStatus === 'playing'
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 border border-emerald-400/30'
            }`}
            title={gameStatus === 'playing' ? '暫停戰鬥 (Space)' : '開始 / 繼續戰鬥 (Space)'}
          >
            {gameStatus === 'playing' ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{gameStatus === 'playing' ? '暫停' : '開始'}</span>
          </button>

          {/* 2. Speed Control */}
          <button
            id="btn-toggle-speed"
            onClick={onToggleSpeed}
            className="h-8 min-w-[32px] px-1.5 sm:px-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-300 border border-slate-700/80 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5"
            title="調整戰鬥速率 (1x / 1.5x / 2x)"
          >
            <FastForward className="w-3 h-3 text-sky-400 shrink-0" />
            <span>{gameSpeed}x</span>
          </button>

          {/* 3. Restart Match */}
          <button
            id="btn-restart"
            onClick={onRestart}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center"
            title="重新開始對決 (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* 4. Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-slate-100 border border-slate-700/80 transition-all cursor-pointer flex items-center justify-center"
            title={soundEnabled ? '靜音' : '開啟音效'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* 5. Wrestler Intro Broadcast Replay */}
          {onReplayIntro && (
            <button
              id="btn-replay-wrestler-intro"
              onClick={onReplayIntro}
              className="h-8 px-2 sm:px-2.5 rounded-lg bg-gradient-to-r from-amber-600/30 to-yellow-600/30 hover:from-amber-600/40 hover:to-yellow-600/40 active:scale-95 text-amber-200 border border-amber-500/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              title="重新播放摔角風格雙方開場介紹播報"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span className="hidden md:inline">開場介紹</span>
              <span className="md:hidden">介紹</span>
            </button>
          )}

          {/* 6. Character Select (Duel Mode only) */}
          {gameMode === 'duel' && (
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="h-8 px-2 sm:px-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white transition-all flex items-center justify-center gap-1 text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer border border-sky-400/30"
              title="更換我方或對手英雄"
            >
              <Swords className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">更換英雄</span>
              <span className="md:hidden">選角</span>
            </button>
          )}

          {/* Subtle divider */}
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block mx-0.5" />

          {/* 6. Integrated Rules & Mechanics Handbook */}
          {(onOpenHandbook || onOpenHelpDrawer) && (
            <button
              id="btn-arena-rules-guide"
              onClick={onOpenHandbook || onOpenHelpDrawer}
              className="h-8 px-2 sm:px-2.5 rounded-lg bg-gradient-to-r from-amber-950/80 to-sky-950/80 hover:from-amber-900/90 hover:to-sky-900/90 active:scale-95 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              title="查看競技場戰鬥規則指南與英雄圖鑑百科"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden md:inline">規則與圖鑑</span>
              <span className="md:hidden">指南</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dedicated Compact Combat Gauge (sm:hidden) */}
      <div className="sm:hidden w-full bg-slate-900/95 border border-slate-800/90 rounded-xl p-2 shadow-lg backdrop-blur-md shrink-0">
        <div className="grid grid-cols-2 gap-2 items-center relative">
          {/* Center VS Mini Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[8px] font-black text-slate-300 shadow font-mono">
              VS
            </span>
          </div>

          {/* Left (P1 Blue) Mobile Block */}
          <div className="flex flex-col gap-1 min-w-0 pr-1.5">
            {/* Top: Avatar + Name + HP num */}
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="relative shrink-0">
                <ChampionAvatarCanvas
                  characterId={p1.characterId}
                  size={26}
                  hasChargedBounce={p1.hasChargedBounce}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 leading-none">
                  <span className="font-black text-slate-100 text-xs truncate max-w-[65px]">{p1.name}</span>
                  <span className="text-[10px] font-mono font-bold text-sky-300 shrink-0">
                    {Math.round(p1.hp)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-400 mt-0.5 leading-none">
                  <span className="text-blue-400 font-bold truncate max-w-[50px]">{getCleanRole(p1Config.role).split('·')[0]}</span>
                  <span className="font-mono text-slate-400">{p1HpPercent.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 relative overflow-hidden ${
                  p1HpPercent > 35
                    ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse'
                }`}
                style={{ width: `${p1HpPercent}%` }}
              >
                <div className="energy-beam-flow" />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    p1.isOverdrive
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                      : 'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, ((p1.energy ?? 100) / (p1.maxEnergy ?? 100)) * 100))}%` }}
                />
              </div>
              <span className={`text-[8.5px] font-mono font-bold shrink-0 leading-none flex items-center ${
                p1.isOverdrive ? 'text-amber-300 animate-pulse font-black' : 'text-sky-300'
              }`}>
                {p1.isOverdrive ? '超載⚡' : `${Math.round(p1.energy ?? 100)}⚡`}
              </span>
            </div>

            {/* P1 Xin Specialized EXP Bar (Mobile) */}
            <XinExperienceBar ball={p1} compact />

            {/* P1 Yinyong Specialized State Machine Status Bar (Mobile) */}
            <YinyongStatusBar ball={p1} compact />
          </div>

          {/* Right (P2 Red) Mobile Block */}
          <div className="flex flex-col gap-1 min-w-0 pl-1.5">
            {/* Top: HP num + Name + Avatar */}
            <div className="flex items-center gap-1.5 min-w-0 justify-end">
              <div className="min-w-0 flex-1 text-right">
                <div className="flex items-center justify-between gap-1 leading-none">
                  <span className="text-[10px] font-mono font-bold text-rose-300 shrink-0">
                    {Math.round(p2.hp)}
                  </span>
                  <span className="font-black text-slate-100 text-xs truncate max-w-[65px]">{p2.name}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-slate-400 mt-0.5 leading-none">
                  <span className="font-mono text-slate-400">{p2HpPercent.toFixed(0)}%</span>
                  <span className="text-red-400 font-bold truncate max-w-[50px]">{getCleanRole(p2Config.role).split('·')[0]}</span>
                </div>
              </div>
              <div className="relative shrink-0">
                <ChampionAvatarCanvas
                  characterId={p2.characterId}
                  size={26}
                  isHotBody={p2.isHotBodyActive}
                />
              </div>
            </div>

            {/* HP Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 relative overflow-hidden ${
                  p2HpPercent > 35
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse'
                }`}
                style={{ width: `${p2HpPercent}%` }}
              >
                <div className="energy-beam-flow" />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="flex items-center gap-1 justify-end">
              <span className={`text-[8.5px] font-mono font-bold shrink-0 leading-none flex items-center ${
                p2.isOverdrive ? 'text-amber-300 animate-pulse font-black' : 'text-rose-300'
              }`}>
                {p2.isOverdrive ? '超載⚡' : `${Math.round(p2.energy ?? 100)}⚡`}
              </span>
              <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    p2.isOverdrive
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                      : 'bg-gradient-to-r from-red-500 via-rose-400 to-pink-300'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, ((p2.energy ?? 100) / (p2.maxEnergy ?? 100)) * 100))}%` }}
                />
              </div>
            </div>

            {/* P2 Xin Specialized EXP Bar (Mobile) */}
            <XinExperienceBar ball={p2} compact />

            {/* P2 Yinyong Specialized State Machine Status Bar (Mobile) */}
            <YinyongStatusBar ball={p2} compact />
          </div>
        </div>
      </div>

      {/* Main Dual HP & Attributes Meter (Desktop & Tablet view - hidden on mobile) */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-2 sm:gap-4 shrink-0">
        {/* P1 HP Card (Left Blue) */}
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-xl p-2.5 sm:p-3 backdrop-blur-md shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[224px] h-auto shrink-0 min-w-0">
          <div className="min-w-0">
            <div className="flex items-start justify-between mb-2 min-w-0 gap-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <ChampionAvatarCanvas
                    characterId={p1.characterId}
                    size={38}
                    hasChargedBounce={p1.hasChargedBounce}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-black text-slate-100 text-xs sm:text-sm truncate shrink-0 max-w-[90px] sm:max-w-[120px]">{p1.name}</span>
                    <MarqueeText
                      containerClassName="min-w-0 flex-1 max-w-[90px] sm:max-w-none"
                      className="text-[9px] px-1 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 rounded font-bold"
                    >
                      {getCleanRole(p1Config.role)}
                    </MarqueeText>
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block">
                    攻:{p1.baseAttack} | 質:{p1Config.mass}
                  </div>
                  <div className="h-5 min-h-[20px] max-h-[20px] flex items-center gap-1 mt-0.5 overflow-hidden">
                    {p1.isBleedingByMimi && (
                      <span className="text-[9px] px-1 py-0.2 bg-rose-950/90 text-rose-300 border border-rose-600/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Droplet className="w-2.5 h-2.5 text-rose-400 fill-rose-400 shrink-0" />
                        <span>流血 {(p1.bleedTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.isCharmedByMimi && (
                      <span className="text-[9px] px-1 py-0.2 bg-pink-950/90 text-pink-300 border border-pink-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400 shrink-0" />
                        <span>魅惑 {(p1.charmedByMimiTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {(p1.mimiHopeDestroyCooldown ?? 0) > 0 && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-600/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <RotateCcw className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>踩毀CD {(p1.mimiHopeDestroyCooldown || 0).toFixed(0)}s</span>
                      </span>
                    )}
                    {p1.isSlowedByNeedle && (
                      <span className="text-[9px] px-1 py-0.2 bg-sky-950/90 text-sky-300 border border-sky-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Snowflake className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                        <span>聖針減速 {(p1.slowedByNeedleTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.jiandaoshouMistActive && (
                      <span className="text-[9px] px-1 py-0.2 bg-slate-900/90 text-amber-200 border border-amber-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                        <span>聖霧指定防護 {(p1.jiandaoshouMistDuration || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.isDinaBurned && (
                      <span className="text-[9px] px-1 py-0.2 bg-rose-950/90 text-rose-300 border border-rose-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Flame className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                        <span>融合燃燒 {(p1.dinaBurnTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.isDinaSlowed && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Wind className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                        <span>融合減速35% {(p1.dinaSlowTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.isDinaImmobilized && (
                      <span className="text-[9px] px-1 py-0.2 bg-indigo-950/90 text-indigo-200 border border-indigo-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Lock className="w-2.5 h-2.5 text-indigo-300 shrink-0" />
                        <span>融合定身 {(p1.dinaImmobilizeTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.dinaCorePowerActive && (
                      <span className="text-[9px] px-1 py-0.2 bg-sky-950/90 text-sky-200 border border-sky-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-sky-300 shrink-0" />
                        <span>核心風箏拉扯中</span>
                      </span>
                    )}
                    {p1.dinaPerfectAbsorb && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-200 border border-amber-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                        <span>完美融合就緒</span>
                      </span>
                    )}
                    {(p1.spiderPoisonMarkTimer ?? 0) > 0 && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-950/90 text-emerald-300 border border-emerald-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Crosshair className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>蛛毒印記 {(p1.spiderPoisonMarkTimer ?? 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p1.isSlowedBySpiderWeb && (
                      <span className="text-[9px] px-1 py-0.2 bg-teal-950/90 text-teal-300 border border-teal-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Target className="w-2.5 h-2.5 text-teal-400 shrink-0" />
                        <span>蛛網纏繞 -35%</span>
                      </span>
                    )}
                    {p1.isTetheredByPuppeteer && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                        <span>牽線束縛 -25%速</span>
                      </span>
                    )}
                    {p1.characterId === 'kuileishi' && (
                      <>
                        <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                          <span>傀儡 {(p1.puppets || []).filter(p => p.hp > 0 && p.currentSegment <= 3).length}/2</span>
                        </span>
                        <span className="text-[9px] px-1 py-0.2 bg-fuchsia-950/90 text-fuchsia-300 border border-fuchsia-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Zap className="w-2.5 h-2.5 text-fuchsia-400 shrink-0" />
                          <span>共鳴 {p1.puppetResonance || 0}/3</span>
                        </span>
                      </>
                    )}
                    {p1.characterId === 'yinyong' && (
                      <>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0 ${
                          p1.yinyongState === 'DECLARING' || p1.yinyongState === 'PUNCHING' ? 'bg-red-600 text-white animate-pulse' :
                          p1.yinyongState === 'CHARGING' ? 'bg-red-950/90 text-red-300 border border-red-500/70' :
                          'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}>
                          <Zap className="w-2.5 h-2.5 text-red-400 shrink-0" />
                          <span>
                            {p1.yinyongState === 'DECLARING' ? '身後宣告中!' :
                             p1.yinyongState === 'PUNCHING' ? '一拳決勝!!' :
                             p1.yinyongState === 'CHARGING' ? `蓄力 ${(p1.yinyongChargeTimer || 0).toFixed(1)}/22s` :
                             (p1.yinyongSuccessCooldown || 0) > 0 ? `冷卻 ${(p1.yinyongSuccessCooldown || 0).toFixed(1)}s` :
                             (p1.yinyongFailRecoveryTimer || 0) > 0 ? `落空恢復 ${(p1.yinyongFailRecoveryTimer || 0).toFixed(1)}s` :
                             '搜尋鎖定中'}
                          </span>
                        </span>
                        {(p1.yinyongRageStacks || 0) > 0 && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <ShieldAlert className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>暴怒 {p1.yinyongRageStacks}/10 (+{(p1.yinyongRageStacks || 0) * 5}%)</span>
                          </span>
                        )}
                        {p1.yinyongBoundlessActive && (
                          <span className="text-[9px] px-1 py-0.2 bg-red-900 text-white rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <Crosshair className="w-2.5 h-2.5 text-yellow-300 shrink-0" />
                            <span>無界免傷 {(p1.yinyongBoundlessDuration || 0).toFixed(1)}s</span>
                          </span>
                        )}
                      </>
                    )}
                    {p1.characterId === 'xin' && (
                      <>
                        <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                          <span>Lv.{p1.xinLevel || 1} ({p1.xinExp || 0}/100)</span>
                        </span>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0 ${
                          p1.xinForm === 'dark' ? 'bg-purple-950/90 text-purple-300 border border-purple-500/70' :
                          p1.xinForm === 'light' ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70' :
                          'bg-sky-950/90 text-sky-300 border border-sky-500/70'
                        }`}>
                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                          <span>{p1.xinForm === 'dark' ? '煞暗形態' : p1.xinForm === 'light' ? '曜光形態' : '平衡形態'}</span>
                        </span>
                        {(p1.xinShieldAmount || 0) > 0 && (
                          <span className="text-[9px] px-1 py-0.2 bg-yellow-950/90 text-yellow-300 border border-yellow-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <Shield className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
                            <span>護盾 {Math.round(p1.xinShieldAmount!)}</span>
                          </span>
                        )}
                        {p1.xinShadowDashing && (
                          <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-200 border border-purple-400/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <FastForward className="w-2.5 h-2.5 text-purple-300 shrink-0" />
                            <span>逐影穿透</span>
                          </span>
                        )}
                      </>
                    )}
                    {!p1.isBleedingByMimi && !p1.isCharmedByMimi && (p1.mimiHopeDestroyCooldown ?? 0) <= 0 && !p1.isSlowedByNeedle && !p1.jiandaoshouMistActive && !p1.isDinaBurned && !p1.isDinaSlowed && !p1.isDinaImmobilized && (p1.spiderPoisonMarkTimer ?? 0) <= 0 && !p1.isSlowedBySpiderWeb && p1.characterId !== 'xin' && (
                      <span className="text-[9px] text-slate-500/60 font-mono tracking-wider">狀態正常</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-1">
                <div className="font-mono text-xs sm:text-sm font-black text-blue-400 leading-tight">
                  {Math.max(0, Math.round(p1.hp))} <span className="text-[10px] text-slate-500 font-normal">/ {p1.maxHp}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono font-bold leading-tight">{p1HpPercent.toFixed(0)}%</div>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 relative overflow-hidden ${
                  p1HpPercent > 35
                    ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : 'bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse'
                }`}
                style={{ width: `${p1HpPercent}%` }}
              >
                <div className="energy-beam-flow" />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="flex items-center gap-1 text-sky-400">
                  <Zap className="w-3 h-3" />
                  <span>能量</span>
                  {p1.isOverdrive && (
                    <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-black animate-pulse flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      <span>超載</span>
                    </span>
                  )}
                </span>
                <span className="text-sky-300">
                  {Math.round(p1.energy ?? 100)} <span className="text-slate-500 font-normal">/ {p1.maxEnergy ?? 100}</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5 mt-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    p1.isOverdrive
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                      : 'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, ((p1.energy ?? 100) / (p1.maxEnergy ?? 100)) * 100))}%` }}
                />
              </div>
            </div>

            {/* P1 Xin Specialized EXP & Soul Crystal Growth Bar (Desktop) */}
            <XinExperienceBar ball={p1} />

            {/* P1 Yinyong Specialized State Machine & 22s Charge Status Bar (Desktop) */}
            <YinyongStatusBar ball={p1} />

            {/* P1 Tactical Action / Status Slot (Fixed Height to Prevent Layout Shift) */}
            <div className="flex items-center gap-1.5 mt-2 h-8 min-h-[32px] max-h-[32px] touch-manipulation">
              {isP1Manual ? (
                <>
                  <button
                    id="btn-p1-tactical-dash"
                    onClick={onTriggerP1Dash}
                    disabled={(p1.energy ?? 0) < 30 || (p1.tacticalCooldown ?? 0) > 0 || gameStatus !== 'playing'}
                    className="flex-1 h-full px-1 sm:px-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-600/50 disabled:opacity-40 disabled:pointer-events-none text-sky-200 text-[11px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 select-none"
                    title="消耗 30 能量發動戰術瞬衝 (快捷鍵 J)"
                  >
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 sm:w-3 sm:h-3" />瞬衝 [J]</span>
                    <span className="text-[9px] text-sky-400 flex items-center gap-0.5">30<Zap className="w-2.5 h-2.5" /></span>
                  </button>
                  <button
                    id="btn-p1-tactical-shield"
                    onClick={onTriggerP1Shield}
                    disabled={(p1.energy ?? 0) < 25 || (p1.tacticalCooldown ?? 0) > 0 || gameStatus !== 'playing'}
                    className="flex-1 h-full px-1 sm:px-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 disabled:opacity-40 disabled:pointer-events-none text-amber-200 text-[11px] sm:text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 select-none"
                    title="消耗 25 能量發動戰術護盾 (快捷鍵 K)"
                  >
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 sm:w-3 sm:h-3" />護盾 [K]</span>
                    <span className="text-[9px] text-amber-400 flex items-center gap-0.5">25<Zap className="w-2.5 h-2.5" /></span>
                  </button>
                </>
              ) : (
                <div className="w-full h-full px-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span>AI 自主戰術決策中</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">自動施放瞬衝/護盾</span>
                </div>
              )}
            </div>
          </div>

          {/* Integrated Compact Mobile Skill Status Bar */}
          {renderPlayerSkillsMobileBar(p1, 'p1')}
        </div>

        {/* P2 HP Card (Right Red) */}
        <div className="bg-slate-900/90 border border-red-500/40 rounded-xl p-2.5 sm:p-3 backdrop-blur-md shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[224px] h-auto shrink-0 min-w-0">
          <div className="min-w-0">
            <div className="flex items-start justify-between mb-2 min-w-0 gap-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <ChampionAvatarCanvas
                    characterId={p2.characterId}
                    size={38}
                    isHotBody={p2.isHotBodyActive}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-black text-slate-100 text-xs sm:text-sm truncate shrink-0 max-w-[90px] sm:max-w-[120px]">{p2.name}</span>
                    <MarqueeText
                      containerClassName="min-w-0 flex-1 max-w-[90px] sm:max-w-none"
                      className="text-[9px] px-1 py-0.2 bg-red-950 text-red-300 border border-red-800 rounded font-bold"
                    >
                      {getCleanRole(p2Config.role)}
                    </MarqueeText>
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block">
                    攻:{p2.baseAttack} | 質:{p2Config.mass}
                  </div>
                  <div className="h-5 min-h-[20px] max-h-[20px] flex items-center gap-1 mt-0.5 overflow-hidden">
                    {p2.isBleedingByMimi && (
                      <span className="text-[9px] px-1 py-0.2 bg-rose-950/90 text-rose-300 border border-rose-600/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Droplet className="w-2.5 h-2.5 text-rose-400 fill-rose-400 shrink-0" />
                        <span>流血 {(p2.bleedTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.isCharmedByMimi && (
                      <span className="text-[9px] px-1 py-0.2 bg-pink-950/90 text-pink-300 border border-pink-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400 shrink-0" />
                        <span>魅惑 {(p2.charmedByMimiTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {(p2.mimiHopeDestroyCooldown ?? 0) > 0 && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-600/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <RotateCcw className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>踩毀CD {(p2.mimiHopeDestroyCooldown || 0).toFixed(0)}s</span>
                      </span>
                    )}
                    {p2.isSlowedByNeedle && (
                      <span className="text-[9px] px-1 py-0.2 bg-sky-950/90 text-sky-300 border border-sky-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Snowflake className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                        <span>聖針減速 {(p2.slowedByNeedleTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.jiandaoshouMistActive && (
                      <span className="text-[9px] px-1 py-0.2 bg-slate-900/90 text-amber-200 border border-amber-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                        <span>聖霧指定防護 {(p2.jiandaoshouMistDuration || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.isDinaBurned && (
                      <span className="text-[9px] px-1 py-0.2 bg-rose-950/90 text-rose-300 border border-rose-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Flame className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                        <span>融合燃燒 {(p2.dinaBurnTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.isDinaSlowed && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Wind className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                        <span>融合減速35% {(p2.dinaSlowTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.isDinaImmobilized && (
                      <span className="text-[9px] px-1 py-0.2 bg-indigo-950/90 text-indigo-200 border border-indigo-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Lock className="w-2.5 h-2.5 text-indigo-300 shrink-0" />
                        <span>融合定身 {(p2.dinaImmobilizeTimer || 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.dinaCorePowerActive && (
                      <span className="text-[9px] px-1 py-0.2 bg-sky-950/90 text-sky-200 border border-sky-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-sky-300 shrink-0" />
                        <span>核心風箏拉扯中</span>
                      </span>
                    )}
                    {p2.dinaPerfectAbsorb && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-200 border border-amber-400/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                        <span>完美融合就緒</span>
                      </span>
                    )}
                    {(p2.spiderPoisonMarkTimer ?? 0) > 0 && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-950/90 text-emerald-300 border border-emerald-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Crosshair className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>蛛毒印記 {(p2.spiderPoisonMarkTimer ?? 0).toFixed(1)}s</span>
                      </span>
                    )}
                    {p2.isSlowedBySpiderWeb && (
                      <span className="text-[9px] px-1 py-0.2 bg-teal-950/90 text-teal-300 border border-teal-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Target className="w-2.5 h-2.5 text-teal-400 shrink-0" />
                        <span>蛛網纏繞 -35%</span>
                      </span>
                    )}
                    {p2.isTetheredByPuppeteer && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                        <span>牽線束縛 -25%速</span>
                      </span>
                    )}
                    {p2.characterId === 'kuileishi' && (
                      <>
                        <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-300 border border-purple-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                          <span>傀儡 {(p2.puppets || []).filter(p => p.hp > 0 && p.currentSegment <= 3).length}/2</span>
                        </span>
                        <span className="text-[9px] px-1 py-0.2 bg-fuchsia-950/90 text-fuchsia-300 border border-fuchsia-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Zap className="w-2.5 h-2.5 text-fuchsia-400 shrink-0" />
                          <span>共鳴 {p2.puppetResonance || 0}/3</span>
                        </span>
                      </>
                    )}
                    {p2.characterId === 'yinyong' && (
                      <>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0 ${
                          p2.yinyongState === 'DECLARING' || p2.yinyongState === 'PUNCHING' ? 'bg-red-600 text-white animate-pulse' :
                          p2.yinyongState === 'CHARGING' ? 'bg-red-950/90 text-red-300 border border-red-500/70' :
                          'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}>
                          <Zap className="w-2.5 h-2.5 text-red-400 shrink-0" />
                          <span>
                            {p2.yinyongState === 'DECLARING' ? '身後宣告中!' :
                             p2.yinyongState === 'PUNCHING' ? '一拳決勝!!' :
                             p2.yinyongState === 'CHARGING' ? `蓄力 ${(p2.yinyongChargeTimer || 0).toFixed(1)}/22s` :
                             (p2.yinyongSuccessCooldown || 0) > 0 ? `冷卻 ${(p2.yinyongSuccessCooldown || 0).toFixed(1)}s` :
                             (p2.yinyongFailRecoveryTimer || 0) > 0 ? `落空恢復 ${(p2.yinyongFailRecoveryTimer || 0).toFixed(1)}s` :
                             '搜尋鎖定中'}
                          </span>
                        </span>
                        {(p2.yinyongRageStacks || 0) > 0 && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <ShieldAlert className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>暴怒 {p2.yinyongRageStacks}/10 (+{(p2.yinyongRageStacks || 0) * 5}%)</span>
                          </span>
                        )}
                        {p2.yinyongBoundlessActive && (
                          <span className="text-[9px] px-1 py-0.2 bg-red-900 text-white rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <Crosshair className="w-2.5 h-2.5 text-yellow-300 shrink-0" />
                            <span>無界免傷 {(p2.yinyongBoundlessDuration || 0).toFixed(1)}s</span>
                          </span>
                        )}
                      </>
                    )}
                    {p2.characterId === 'xin' && (
                      <>
                        <span className="text-[9px] px-1 py-0.2 bg-amber-950/90 text-amber-300 border border-amber-500/70 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                          <span>Lv.{p2.xinLevel || 1} ({p2.xinExp || 0}/100)</span>
                        </span>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0 ${
                          p2.xinForm === 'dark' ? 'bg-purple-950/90 text-purple-300 border border-purple-500/70' :
                          p2.xinForm === 'light' ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70' :
                          'bg-sky-950/90 text-sky-300 border border-sky-500/70'
                        }`}>
                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                          <span>{p2.xinForm === 'dark' ? '煞暗形態' : p2.xinForm === 'light' ? '曜光形態' : '平衡形態'}</span>
                        </span>
                        {(p2.xinShieldAmount || 0) > 0 && (
                          <span className="text-[9px] px-1 py-0.2 bg-yellow-950/90 text-yellow-300 border border-yellow-500/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <Shield className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
                            <span>護盾 {Math.round(p2.xinShieldAmount!)}</span>
                          </span>
                        )}
                        {p2.xinShadowDashing && (
                          <span className="text-[9px] px-1 py-0.2 bg-purple-950/90 text-purple-200 border border-purple-400/70 rounded font-bold animate-pulse flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0">
                            <FastForward className="w-2.5 h-2.5 text-purple-300 shrink-0" />
                            <span>逐影穿透</span>
                          </span>
                        )}
                      </>
                    )}
                    {!p2.isBleedingByMimi && !p2.isCharmedByMimi && (p2.mimiHopeDestroyCooldown ?? 0) <= 0 && !p2.isSlowedByNeedle && !p2.jiandaoshouMistActive && !p2.isDinaBurned && !p2.isDinaSlowed && !p2.isDinaImmobilized && (p2.spiderPoisonMarkTimer ?? 0) <= 0 && !p2.isSlowedBySpiderWeb && p2.characterId !== 'xin' && (
                      <span className="text-[9px] text-slate-500/60 font-mono tracking-wider">狀態正常</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-1">
                <div className="font-mono text-xs sm:text-sm font-black text-red-400 leading-tight">
                  {Math.max(0, Math.round(p2.hp))} <span className="text-[10px] text-slate-500 font-normal">/ {p2.maxHp}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono font-bold leading-tight">{p2HpPercent.toFixed(0)}%</div>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 relative overflow-hidden ${
                  p2HpPercent > 35
                    ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.5)]'
                    : 'bg-gradient-to-r from-red-700 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse'
                }`}
                style={{ width: `${p2HpPercent}%` }}
              >
                <div className="energy-beam-flow" />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="flex items-center gap-1 text-orange-400">
                  <Zap className="w-3 h-3" />
                  <span>能量</span>
                  {p2.isOverdrive && (
                    <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-black animate-pulse flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />
                      <span>超載</span>
                    </span>
                  )}
                </span>
                <span className="text-orange-300">
                  {Math.round(p2.energy ?? 100)} <span className="text-slate-500 font-normal">/ {p2.maxEnergy ?? 100}</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner p-0.5 mt-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    p2.isOverdrive
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                      : 'bg-gradient-to-r from-orange-500 via-amber-400 to-red-400'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, ((p2.energy ?? 100) / (p2.maxEnergy ?? 100)) * 100))}%` }}
                />
              </div>
            </div>

            {/* P2 Xin Specialized EXP & Soul Crystal Growth Bar (Desktop) */}
            <XinExperienceBar ball={p2} />

            {/* P2 Yinyong Specialized State Machine & 22s Charge Status Bar (Desktop) */}
            <YinyongStatusBar ball={p2} />

            {/* P2 Tactical Status Slot (Fixed Height to Prevent Layout Shift) */}
            <div className="flex items-center gap-1.5 mt-2 h-7 min-h-[28px] max-h-[28px]">
              <div className="w-full h-full px-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400">
                  <Zap className="w-3 h-3 text-red-400" />
                  <span>AI 自主戰術決策中</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono">自動施放瞬衝/護盾</span>
              </div>
            </div>
          </div>

          {/* Integrated Compact Mobile Skill Status Bar */}
          {renderPlayerSkillsMobileBar(p2, 'p2')}
        </div>
      </div>
    </div>
  );
};

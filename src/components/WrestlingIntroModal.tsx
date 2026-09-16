import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { BallState } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { ChampionBeltRecord, TournamentBeltState } from '../types/tournament';
import { wrestlingAnnouncer } from '../utils/wrestlingAnnouncer';
import { soundEngine } from '../utils/audio';
import { getKnockoutStyle, getPastWinRate } from '../utils/knockoutStyleHelper';
import {
  Crown,
  Scale,
  Zap,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
  FastForward,
  Award,
  Sparkles,
  Flame,
  TrendingUp,
  ChevronRight,
  FlameKindling
} from 'lucide-react';

interface WrestlingIntroModalProps {
  p1: BallState;
  p2: BallState;
  isTitleMatch: boolean;
  beltState?: TournamentBeltState;
  gameMode?: 'duel' | 'tournament';
  tournamentRoundName?: string;
  onFinishIntro: () => void;
  soundEnabled?: boolean;
}

// Stage:
// 0: 'curtain' - Dramatic lighting & match announcement
// 1: 'fighter1' - Spotlight on Challenger / Fighter 1 (Stats: Weight, Speed, Record, Nickname)
// 2: 'fighter2' - Spotlight on Champion / Fighter 2 (Stats: Weight, Speed, Reign days, Defenses)
// 3: 'clash' - Face-to-face clash countdown & Ring Bell "DING! DING! DING!"
type IntroStage = 'curtain' | 'fighter1' | 'fighter2' | 'clash';

const QUICK_MODE_STORAGE_KEY = 'ball_game_wrestling_quick_intro_v1';

export const WrestlingIntroModal: React.FC<WrestlingIntroModalProps> = ({
  p1,
  p2,
  isTitleMatch,
  beltState,
  gameMode = 'duel',
  tournamentRoundName,
  onFinishIntro,
  soundEnabled = true
}) => {
  // Check if user previously toggled quick intro mode
  const [isQuickMode, setIsQuickMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(QUICK_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [stage, setStage] = useState<IntroStage>(() => (isQuickMode ? 'clash' : 'curtain'));
  const [countdown, setCountdown] = useState<number>(() => (isQuickMode ? 2 : 3));
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(!soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const p1Config = CHARACTERS[p1.characterId];
  const p2Config = CHARACTERS[p2.characterId];

  // Belt records
  const p1Record: ChampionBeltRecord | undefined = beltState?.records[p1.characterId];
  const p2Record: ChampionBeltRecord | undefined = beltState?.records[p2.characterId];
  const isP1Champion = beltState?.currentHolderId === p1.characterId;
  const isP2Champion = beltState?.currentHolderId === p2.characterId;

  // Dynamically generated Knockout Style and Past Win Rate Tags
  const p1Style = useMemo(() => getKnockoutStyle(p1Config), [p1Config]);
  const p2Style = useMemo(() => getKnockoutStyle(p2Config), [p2Config]);
  const p1WinRate = useMemo(() => getPastWinRate(p1Config, p1Record), [p1Config, p1Record]);
  const p2WinRate = useMemo(() => getPastWinRate(p2Config, p2Record), [p2Config, p2Record]);

  // Formatted stats
  const getWeightText = (mass: number) => {
    const kg = Math.round(mass * 105);
    const lbs = Math.round(kg * 2.204);
    return `${kg} 公斤 (${lbs} 磅)`;
  };

  const getSpeedText = (speed: number) => {
    return `${Math.round(speed)} px/s (疾走度 ${Math.round(speed / 2.5)}%)`;
  };

  const getChampionshipText = (record?: ChampionBeltRecord, isChamp?: boolean) => {
    if (isChamp) {
      return `👑 現任世界重量級冠軍 (第 ${record?.currentReignDefenses || 0} 次衛冕中 · 統治 ${record?.reignDays || 0} 天)`;
    }
    if (record && record.totalChampionships > 0) {
      return `⭐ 前任 ${record.totalChampionships} 度冠軍得主 · 累計衛冕 ${record.totalDefenses} 次`;
    }
    return '⚔️ 世界冠軍挑戰者 / 精英角鬥士';
  };

  // Sync voice mute
  useEffect(() => {
    wrestlingAnnouncer.setMuted(isVoiceMuted);
  }, [isVoiceMuted]);

  // Audio Context retrieval
  useEffect(() => {
    audioCtxRef.current = soundEngine.getContext();
  }, []);

  // Quick mode toggle handler
  const handleToggleQuickMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !isQuickMode;
    setIsQuickMode(nextVal);
    try {
      localStorage.setItem(QUICK_MODE_STORAGE_KEY, nextVal ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  // Clear running timers
  const clearAllTimers = () => {
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current);
      stageTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Skip handler (immediately start battle)
  const handleSkip = useCallback(() => {
    clearAllTimers();
    wrestlingAnnouncer.stopSpeaking();
    const ctx = audioCtxRef.current;
    wrestlingAnnouncer.playRingBell(ctx);
    onFinishIntro();
  }, [onFinishIntro]);

  // Stage transition forward (Next stage or start match)
  const advanceToNextStage = useCallback(() => {
    const ctx = audioCtxRef.current;
    clearAllTimers();
    wrestlingAnnouncer.stopSpeaking();
    wrestlingAnnouncer.playTransitionChime(ctx);

    setStage((prev) => {
      if (prev === 'curtain') return 'fighter1';
      if (prev === 'fighter1') return 'fighter2';
      if (prev === 'fighter2') return 'clash';
      handleSkip();
      return 'clash';
    });
  }, [handleSkip]);

  // Subtitle speech lines
  const currentSubtitle = useMemo(() => {
    if (stage === 'curtain') {
      return isTitleMatch
        ? '女士們先生們！歡迎來到世界重量級金腰帶冠軍爭奪大賽！'
        : '女士們先生們！頂級角鬥士碰撞大決戰，即將引爆全場！';
    }
    if (stage === 'fighter1') {
      const cleanStyle = p1Style.styleName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9・]/g, '');
      const recordSummary = p1WinRate.hasRecord
        ? `過往勝率 ${p1WinRate.displayRateText}`
        : '生涯首戰登場';
      return `藍角選手：${p1Config.name}！體重 ${Math.round(p1Config.mass * 105)} 公斤！${recordSummary}！獨門【${cleanStyle}】震撼全場！`;
    }
    if (stage === 'fighter2') {
      const cleanStyle = p2Style.styleName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9・]/g, '');
      const recordSummary = p2WinRate.hasRecord
        ? `過往勝率 ${p2WinRate.displayRateText}`
        : '生涯首戰登場';
      return `紅角登場！${isP2Champion ? '現任世界冠軍' : '頂尖挑戰者'}：${p2Config.name}！身負【${cleanStyle}】威名！${recordSummary}！今晚誰將制霸擂台？！`;
    }
    return '🔔 敲響戰鐘！雙方碰撞，比賽正式打響！';
  }, [stage, isTitleMatch, p1Config.name, p1Config.mass, p1WinRate.hasRecord, p1WinRate.displayRateText, p1Style.styleName, isP2Champion, p2Config.name, p2WinRate.hasRecord, p2WinRate.displayRateText, p2Style.styleName]);

  // Automated stage progression sequence
  useEffect(() => {
    const ctx = audioCtxRef.current;
    clearAllTimers();

    if (stage === 'curtain') {
      if (soundEnabled && !isVoiceMuted) {
        wrestlingAnnouncer.playStadiumHorn(ctx, isTitleMatch);
        const matchTitleText = isTitleMatch
          ? '女士們先生們！歡迎來到球球競技場，世界重量級金腰帶冠軍爭奪大賽！'
          : '女士們先生們！萬眾矚目的頂級角鬥士碰撞大決戰，即將引爆全場！';
        wrestlingAnnouncer.speak(matchTitleText, 1.08);
      }

      stageTimerRef.current = setTimeout(() => {
        setStage('fighter1');
      }, isQuickMode ? 1000 : 2000);
    } else if (stage === 'fighter1') {
      if (soundEnabled && !isVoiceMuted) {
        wrestlingAnnouncer.playStadiumHorn(ctx, isP1Champion);
        const cleanStyle = p1Style.styleName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9・]/g, '');
        const p1Intro = `首先登場的是！藍角選手：${p1Config.name}！稱號${p1Config.title}！體重 ${Math.round(p1Config.mass * 105)} 公斤！${p1WinRate.voiceWinRateIntro}！以獨門的【${cleanStyle}】震撼全場！`;
        wrestlingAnnouncer.speak(p1Intro, 1.1);
      }

      stageTimerRef.current = setTimeout(() => {
        setStage('fighter2');
      }, isQuickMode ? 1200 : 3000);
    } else if (stage === 'fighter2') {
      if (soundEnabled && !isVoiceMuted) {
        wrestlingAnnouncer.playStadiumHorn(ctx, isP2Champion);
        const cleanStyle = p2Style.styleName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9・]/g, '');
        const p2Intro = `而在紅角登場的！${isP2Champion ? '現任世界重量級金腰帶霸主' : '頂尖挑戰者'}：${p2Config.name}！身負【${cleanStyle}】的恐怖威名！${p2WinRate.voiceWinRateIntro}！今晚誰將統治擂台？！`;
        wrestlingAnnouncer.speak(p2Intro, 1.1);
      }

      stageTimerRef.current = setTimeout(() => {
        setStage('clash');
      }, isQuickMode ? 1200 : 3000);
    } else if (stage === 'clash') {
      if (soundEnabled && !isVoiceMuted) {
        wrestlingAnnouncer.speak('敲響戰鐘！比賽正式開始！', 1.25, 1.1);
        wrestlingAnnouncer.playRingBell(ctx);
      }

      let currentC = isQuickMode ? 2 : 3;
      setCountdown(currentC);
      countdownIntervalRef.current = setInterval(() => {
        currentC -= 1;
        setCountdown(currentC);
        if (currentC <= 0) {
          clearAllTimers();
          wrestlingAnnouncer.playRingBell(ctx);
          onFinishIntro();
        }
      }, isQuickMode ? 500 : 650);
    }

    return () => {
      clearAllTimers();
    };
  }, [stage, isTitleMatch, isP1Champion, isP2Champion, p1Config, p2Config, p1Record, p2Record, p1Style, p2Style, p1WinRate, p2WinRate, soundEnabled, isVoiceMuted, isQuickMode, onFinishIntro]);

  // Keyboard navigation: Space/Enter advances stage; Escape skips intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        advanceToNextStage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [advanceToNextStage, handleSkip]);

  return (
    <div
      id="wrestling-intro-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/92 backdrop-blur-md overflow-hidden select-none animate-in fade-in duration-200"
      onClick={advanceToNextStage}
      title="點擊任意處前進下一步，或按 ESC 直接開戰"
    >
      {/* Dynamic WWE Stage Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blue Spotlight Left */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-pulse" />
        {/* Red Spotlight Right */}
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl animate-pulse" />
        {/* Center Golden Flare for Title Match */}
        {isTitleMatch && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full bg-amber-500/15 blur-3xl animate-pulse" />
        )}
        {/* Diagonal Stage Light Beams */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-200 via-transparent to-transparent" />
      </div>

      {/* Main Wrestling Arena Showcase Card */}
      <div
        className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-amber-500/60 rounded-3xl p-3.5 sm:p-6 shadow-2xl shadow-amber-500/20 flex flex-col items-center z-10 overflow-hidden"
        onClick={(e) => {
          // Allow clicks on the card itself to advance stage, unless clicking specific controls
          if ((e.target as HTMLElement).closest('button')) return;
          advanceToNextStage();
        }}
      >
        {/* Top WWE Style Banner */}
        <div className="w-full flex items-center justify-between pb-2.5 border-b border-slate-800/90 gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="px-2.5 py-0.5 sm:py-1 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 font-mono text-[10px] sm:text-[11px] font-black tracking-widest uppercase animate-pulse flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE BROADCAST
            </div>
            {isTitleMatch ? (
              <div className="px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/30 border border-amber-500/60 text-amber-200 text-xs font-black flex items-center gap-1 shadow-sm shrink-0">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>👑 世界重量級金腰帶爭奪戰</span>
              </div>
            ) : (
              <div className="px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 shrink-0">
                <Swords className="w-3.5 h-3.5 text-sky-400" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {gameMode === 'tournament' ? (tournamentRoundName || '淘汰賽對決') : '1對1 巔峰碰撞排位對抗'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Voice / Quick Intro / Skip Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Intro Toggle (⚡ 快速開場) */}
            <button
              onClick={handleToggleQuickMode}
              className={`px-2 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                isQuickMode
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-400'
              }`}
              title="切換快速開場模式 (開啟後每次跳過繁瑣唱名，直接以極速對撞倒數開局)"
            >
              <Zap className={`w-3 h-3 ${isQuickMode ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">快速模式</span>
              <span className="text-[10px] opacity-75">{isQuickMode ? '已開' : '關'}</span>
            </button>

            {/* Voice Mute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceMuted((prev) => !prev);
              }}
              className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title={isVoiceMuted ? '開啟主播語音播報' : '靜音語音播報'}
            >
              {isVoiceMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">靜音</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="hidden md:inline">播報中</span>
                </>
              )}
            </button>

            {/* Direct Start / Skip Button */}
            <button
              id="btn-skip-wrestling-intro"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-xs transition-all flex items-center gap-1 shadow-md shadow-amber-500/30 cursor-pointer"
              title="直接跳過開場介紹進入戰鬥 (ESC)"
            >
              <FastForward className="w-3.5 h-3.5 fill-current" />
              <span>直接開戰 (ESC)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Center Display based on current Stage */}
        <div className="w-full my-3 sm:my-5 min-h-[330px] flex flex-col items-center justify-center relative">
          {/* 1. CURTAIN STAGE: Grand Title Announcement */}
          {stage === 'curtain' && (
            <div className="flex flex-col items-center text-center space-y-3.5 animate-in zoom-in-95 duration-300">
              <div className="relative">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-2xl shadow-amber-500/40">
                  <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
                    <Crown className="w-9 h-9 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1.5 -right-1.5 animate-spin" />
              </div>

              <div className="space-y-1">
                <p className="text-amber-400 font-mono text-xs sm:text-sm tracking-widest font-black uppercase">
                  {isTitleMatch ? '★ CHAMPIONSHIP MAIN EVENT ★' : '★ FEATURED MATCH OF THE NIGHT ★'}
                </p>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
                  {isTitleMatch ? '世界重量級冠軍爭霸戰' : '頂級角鬥士榮耀對決'}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                  擂台鐘聲即將敲響！全場屏息以待，兩大球球碰撞巨星即將爆發巔峰對撞！
                </p>
              </div>

              {/* Belt representation if title match */}
              {isTitleMatch && (
                <div className="px-3.5 py-1.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex items-center gap-2.5 shadow-inner">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-amber-200">
                    本場勝者直接登頂加冕或成功衛冕球球競技場「世界重量級金腰帶」！
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. FIGHTER 1 SHOWCASE: Blue Corner */}
          {stage === 'fighter1' && (
            <div className="w-full max-w-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900/95 border-2 border-blue-500/60 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-in slide-in-from-left duration-300 shadow-2xl shadow-blue-500/20">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-950/90 border-2 border-blue-400 p-2 flex items-center justify-center relative shadow-lg shadow-blue-500/40">
                  <ChampionAvatarCanvas characterId={p1.characterId} size={95} />
                  <span className="absolute -top-3 -left-3 px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-black">
                    BLUE CORNER
                  </span>
                  {isP1Champion && (
                    <div className="absolute -bottom-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      現任世界冠軍
                    </div>
                  )}
                </div>
                <span className="text-xs font-black text-blue-400 mt-2 tracking-wider">藍角選手</span>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left w-full min-w-0">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{p1Config.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                      {p1Config.title}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">({p1Config.role})</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-300 font-medium mt-0.5">
                    {getChampionshipText(p1Record, isP1Champion)}
                  </p>
                </div>

                {/* 動態『過往勝率』與『擊倒風格』標籤列 */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {/* 過往勝率 / 戰績標籤 */}
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${p1WinRate.themeClass.bg} ${p1WinRate.themeClass.border} ${p1WinRate.themeClass.text}`}>
                    {p1WinRate.hasRecord ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    )}
                    <span className="font-mono font-black text-white text-sm">{p1WinRate.displayRateText}</span>
                    {p1WinRate.hasRecord && <span>勝率</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-black">
                      {p1WinRate.tierTitle}
                    </span>
                    {p1WinRate.streakText && (
                      <span className="text-[10px] text-amber-200 font-bold">
                        ({p1WinRate.streakText})
                      </span>
                    )}
                  </div>

                  {/* 擊倒風格精簡標籤 */}
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${p1Style.themeClass.badgeBg}`}>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>風格：{p1Style.styleBadge}</span>
                  </div>
                </div>

                {/* 獨門摔角擊倒風格卡片 */}
                <div className="bg-slate-950/90 border border-blue-500/40 rounded-xl p-2.5 space-y-1 shadow-inner text-left">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-xs font-black text-blue-300 flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-amber-400" /> {p1Style.styleName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-200">
                      絕殺：<span className="text-amber-300 font-bold">{p1Style.signatureFinisher}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {p1Style.tacticalSummary}
                  </p>
                </div>

                {/* Wrestler Tale of the Tape */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Scale className="w-3 h-3 text-sky-400" /> 體重
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100">
                      {getWeightText(p1Config.mass)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Zap className="w-3 h-3 text-amber-400" /> 極速
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100">
                      {getSpeedText(p1Config.baseSpeed)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Trophy className="w-3 h-3 text-emerald-400" /> 戰績
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100 truncate">
                      {p1WinRate.recordText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. FIGHTER 2 SHOWCASE: Red Corner */}
          {stage === 'fighter2' && (
            <div className="w-full max-w-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900/95 border-2 border-rose-500/60 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-in slide-in-from-right duration-300 shadow-2xl shadow-rose-500/20">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-rose-950/90 border-2 border-rose-400 p-2 flex items-center justify-center relative shadow-lg shadow-rose-500/40">
                  <ChampionAvatarCanvas characterId={p2.characterId} size={95} />
                  <span className="absolute -top-3 -left-3 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[10px] font-black">
                    RED CORNER
                  </span>
                  {isP2Champion && (
                    <div className="absolute -bottom-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      現任世界冠軍
                    </div>
                  )}
                </div>
                <span className="text-xs font-black text-rose-400 mt-2 tracking-wider">紅角選手</span>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left w-full min-w-0">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{p2Config.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                      {p2Config.title}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">({p2Config.role})</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-300 font-medium mt-0.5">
                    {getChampionshipText(p2Record, isP2Champion)}
                  </p>
                </div>

                {/* 動態『過往勝率』與『擊倒風格』標籤列 */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {/* 過往勝率 / 戰績標籤 */}
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${p2WinRate.themeClass.bg} ${p2WinRate.themeClass.border} ${p2WinRate.themeClass.text}`}>
                    {p2WinRate.hasRecord ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    )}
                    <span className="font-mono font-black text-white text-sm">{p2WinRate.displayRateText}</span>
                    {p2WinRate.hasRecord && <span>勝率</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-black">
                      {p2WinRate.tierTitle}
                    </span>
                    {p2WinRate.streakText && (
                      <span className="text-[10px] text-amber-200 font-bold">
                        ({p2WinRate.streakText})
                      </span>
                    )}
                  </div>

                  {/* 擊倒風格精簡標籤 */}
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${p2Style.themeClass.badgeBg}`}>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>風格：{p2Style.styleBadge}</span>
                  </div>
                </div>

                {/* 獨門摔角擊倒風格卡片 */}
                <div className="bg-slate-950/90 border border-rose-500/40 rounded-xl p-2.5 space-y-1 shadow-inner text-left">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-amber-400" /> {p2Style.styleName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-200">
                      絕殺：<span className="text-amber-300 font-bold">{p2Style.signatureFinisher}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {p2Style.tacticalSummary}
                  </p>
                </div>

                {/* Wrestler Tale of the Tape */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center sm:text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Scale className="w-3 h-3 text-rose-400" /> 體重
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100">
                      {getWeightText(p2Config.mass)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Zap className="w-3 h-3 text-amber-400" /> 極速
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100">
                      {getSpeedText(p2Config.baseSpeed)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1 justify-center sm:justify-start">
                      <Trophy className="w-3 h-3 text-emerald-400" /> 戰績
                    </span>
                    <p className="text-xs font-mono font-black text-slate-100 truncate">
                      {p2WinRate.recordText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. CLASH STAGE: Face-to-Face & Countdown Ring Bell */}
          {stage === 'clash' && (
            <div className="w-full max-w-2xl flex flex-col items-center animate-in zoom-in duration-200 space-y-3">
              <div className="flex items-center justify-center gap-4 sm:gap-10 w-full my-1">
                {/* P1 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-3xl bg-blue-950 border-2 border-blue-400 p-1.5 flex items-center justify-center relative shadow-xl shadow-blue-500/40">
                    <ChampionAvatarCanvas characterId={p1.characterId} size={85} />
                    {isP1Champion && (
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400 absolute -top-2 -right-2" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-blue-300">{p1Config.name}</span>
                </div>

                {/* VS / Countdown Emblem */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-1 flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-bounce">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <span className="font-mono text-3xl sm:text-4xl font-black text-amber-300">
                        {countdown > 0 ? countdown : 'GO!'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-amber-400 uppercase tracking-widest mt-1.5">
                    BELL RINGING!
                  </span>
                </div>

                {/* P2 */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-3xl bg-rose-950 border-2 border-rose-400 p-1.5 flex items-center justify-center relative shadow-xl shadow-rose-500/40">
                    <ChampionAvatarCanvas characterId={p2.characterId} size={85} />
                    {isP2Champion && (
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400 absolute -top-2 -right-2" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-black text-rose-300">{p2Config.name}</span>
                </div>
              </div>

              {/* Style & Winrate Collision Preview Card */}
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 sm:p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  {/* P1 side */}
                  <div className="flex-1 flex flex-col items-start bg-blue-950/50 p-2 rounded-xl border border-blue-500/40">
                    <span className="text-[10px] text-blue-400 font-black flex items-center gap-1">
                      {p1WinRate.hasRecord ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-400" /> {p1WinRate.displayRateText} 勝率 ({p1WinRate.tierBadge})
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-300" /> {p1WinRate.displayRateText} ({p1WinRate.tierBadge})
                        </>
                      )}
                    </span>
                    <span className="text-xs font-black text-white truncate max-w-[150px] mt-0.5">
                      {p1Style.styleBadge}
                    </span>
                  </div>

                  <div className="px-2 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-[10px] sm:text-[11px] shrink-0">
                    ⚡ 風格對撞 ⚡
                  </div>

                  {/* P2 side */}
                  <div className="flex-1 flex flex-col items-end bg-rose-950/50 p-2 rounded-xl border border-rose-500/40">
                    <span className="text-[10px] text-rose-400 font-black flex items-center gap-1">
                      {p2WinRate.hasRecord ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-400" /> {p2WinRate.displayRateText} 勝率 ({p2WinRate.tierBadge})
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-300" /> {p2WinRate.displayRateText} ({p2WinRate.tierBadge})
                        </>
                      )}
                    </span>
                    <span className="text-xs font-black text-white truncate max-w-[150px] mt-0.5">
                      {p2Style.styleBadge}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 text-center font-medium bg-slate-900/80 py-1.5 px-3 rounded-lg border border-slate-800">
                  <span className="text-blue-300 font-bold">{p1Style.signatureFinisher}</span>
                  <span className="text-amber-400 mx-2 font-black">VS</span>
                  <span className="text-rose-300 font-bold">{p2Style.signatureFinisher}</span>
                </div>
              </div>

              <p className="text-amber-300 text-xs sm:text-sm font-bold text-center animate-pulse">
                🔔 敲響擂台戰鐘！全力衝撞、搶佔擂台制霸權！
              </p>
            </div>
          )}
        </div>

        {/* Live Broadcast Commentary Subtitle & Interactive Equalizer Bar */}
        <div className="w-full bg-slate-950/90 border border-amber-500/40 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-inner mb-2.5">
          <div className="flex items-center gap-1 text-amber-400 shrink-0">
            <FlameKindling className="w-4 h-4 text-amber-400 animate-bounce" />
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-yellow-400 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-amber-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400/90 leading-tight">
              <span>🎙️ 現場主播即時播報</span>
              <span className="text-slate-600">｜</span>
              <span className="text-slate-400 font-normal truncate">
                {stage === 'curtain' ? '大會開幕盛典' : stage === 'fighter1' ? '藍角選手引介' : stage === 'fighter2' ? '紅角選手引介' : '敲響擂台戰鐘'}
              </span>
            </div>
            <p className="text-xs sm:text-[13px] font-bold text-amber-100 truncate mt-0.5">
              {currentSubtitle}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              advanceToNextStage();
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer flex items-center gap-0.5"
            title="推進至下一個介紹環節 (空白鍵)"
          >
            <span>{stage === 'clash' ? '立即開打' : '下一步'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Stage Progress Stepper Dots */}
        <div className="w-full flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Step 1 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllTimers();
                setStage('curtain');
              }}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                stage === 'curtain' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${stage === 'curtain' ? 'bg-amber-400' : 'bg-slate-600'}`} />
              <span className="hidden sm:inline">1. 賽事大會揭幕</span>
              <span className="sm:hidden">揭幕</span>
            </button>

            {/* Step 2 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllTimers();
                setStage('fighter1');
              }}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                stage === 'fighter1' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${stage === 'fighter1' ? 'bg-blue-400' : 'bg-slate-600'}`} />
              <span className="hidden sm:inline">2. 藍角登場</span>
              <span className="sm:hidden">藍角</span>
            </button>

            {/* Step 3 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllTimers();
                setStage('fighter2');
              }}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                stage === 'fighter2' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${stage === 'fighter2' ? 'bg-rose-400' : 'bg-slate-600'}`} />
              <span className="hidden sm:inline">3. 紅角登場</span>
              <span className="sm:hidden">紅角</span>
            </button>

            {/* Step 4 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAllTimers();
                setStage('clash');
              }}
              className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                stage === 'clash' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${stage === 'clash' ? 'bg-yellow-400' : 'bg-slate-600'}`} />
              <span className="hidden sm:inline">4. 戰鐘開打</span>
              <span className="sm:hidden">開打</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="hidden md:inline text-slate-500">
              點擊畫面或空白鍵推進 ｜ ESC 快速開打
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

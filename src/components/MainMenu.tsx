import React, { useState, useMemo } from 'react';
import { GameSettings, CharacterId } from '../types/game';
import { TournamentState, TournamentSize, TournamentBeltState, ChampionBeltRecord } from '../types/tournament';
import { CHARACTERS } from '../data/characters';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { ChampionBeltBadge } from './ChampionBeltBadge';
import { soundEngine } from '../utils/audio';
import { isTitleDefenseMatch } from '../utils/beltManager';
import {
  Swords,
  Trophy,
  Zap,
  Shield,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Wind,
  BookOpen,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sliders,
  ChevronRight,
  Info,
  Crown,
  ShieldCheck,
  Clock,
  TrendingUp,
  Search,
  ArrowUpDown,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Medal,
  BarChart3
} from 'lucide-react';

interface MainMenuProps {
  gameMode: 'duel' | 'tournament';
  onSelectGameMode: (mode: 'duel' | 'tournament') => void;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  tournament: TournamentState;
  beltState?: TournamentBeltState;
  onUpdateTournamentSize: (size: TournamentSize) => void;
  onToggleTournamentControl: () => void;
  onOpenCharacterSelect: (focusSide?: 'p1' | 'p2') => void;
  onOpenHandbook: () => void;
  onOpenHelpDrawer: () => void;
  onOpenBeltModal?: () => void;
  onOpenBalancePatch?: () => void;
  onOpenRecords?: () => void;
  onStartDuel: () => void;
  onEnterTournament: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSelectChampionAsPlayer?: (id: CharacterId) => void;
  onResetBeltStats?: () => void;
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

export const MainMenu: React.FC<MainMenuProps> = ({
  gameMode,
  onSelectGameMode,
  settings,
  onUpdateSettings,
  tournament,
  beltState,
  onUpdateTournamentSize,
  onToggleTournamentControl,
  onOpenCharacterSelect,
  onOpenHandbook,
  onOpenHelpDrawer,
  onOpenBeltModal,
  onOpenBalancePatch,
  onOpenRecords,
  onStartDuel,
  onEnterTournament,
  soundEnabled,
  onToggleSound,
  onSelectChampionAsPlayer,
  onResetBeltStats
}) => {
  const [justAssignedId, setJustAssignedId] = useState<CharacterId | null>(null);

  const p1Char = CHARACTERS[settings.p1Char] || CHARACTERS.oba;
  const p2Char = CHARACTERS[settings.p2Char] || CHARACTERS.huotong;
  const tourPlayerChar = tournament.playerCharId ? CHARACTERS[tournament.playerCharId] : p1Char;
  const beltHolder = beltState?.currentHolderId ? CHARACTERS[beltState.currentHolderId] : null;

  const handleModeSwitch = (mode: 'duel' | 'tournament') => {
    soundEngine.playSelectHero();
    onSelectGameMode(mode);
  };

  const handleAssignPlayer = (charId: CharacterId) => {
    soundEngine.playSelectHero();
    if (onSelectChampionAsPlayer) {
      onSelectChampionAsPlayer(charId);
    }
    setJustAssignedId(charId);
    setTimeout(() => setJustAssignedId(null), 2000);
  };

  // 冠軍加冕賽開關狀態判定 (支持經典單挑與錦標賽所有模式)
  const isTitleMatchActive = gameMode === 'duel'
    ? (settings.isTitleMatchEnabled !== false)
    : (settings.isTournamentTitleMatchEnabled ?? settings.isTitleMatchEnabled) !== false;

  const duelTitleDetails = useMemo(() => {
    if (!beltState) return { isTitleMatch: false, isVacant: true, isCoronationMatch: true, championId: null };
    return isTitleDefenseMatch(beltState, settings.p1Char, settings.p2Char, false, false, isTitleMatchActive);
  }, [beltState, settings.p1Char, settings.p2Char, isTitleMatchActive]);

  const toggleTitleMatchSwitch = () => {
    soundEngine.playSelectHero();
    if (gameMode === 'duel') {
      onUpdateSettings({
        ...settings,
        isTitleMatchEnabled: !isTitleMatchActive
      });
    } else {
      onUpdateSettings({
        ...settings,
        isTournamentTitleMatchEnabled: !isTitleMatchActive
      });
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 animate-in fade-in duration-300">
      {/* 1. Main Esports Banner & Quick Hub */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 p-4 sm:p-6 shadow-2xl">
        {/* Futuristic glowing top hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/20 via-sky-400 to-amber-500/80" />
        
        {/* Subtle grid background accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-amber-500 flex items-center justify-center shadow-lg shadow-sky-500/25 ring-1 ring-white/20 shrink-0">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 flex items-center gap-2">
                    <span className="text-flow-shimmer font-black">球球即時競技</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800/90 text-sky-300 border border-sky-500/30 rounded-full font-mono shadow-sm">
                      ARENA 2.0
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  物理剛體碰撞 · 專屬三大被動連鎖 · 戰術手動操作
                </p>
              </div>
            </div>
          </div>

          {/* Top Quick Utility Buttons - Mobile Optimized Grid & Desktop Flex */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-row items-stretch md:items-center gap-2 shrink-0 touch-manipulation select-none">
            {/* Primary Action Buttons Group (Updates, Battle Records & Belts) */}
            <div className="grid grid-cols-3 gap-2 flex-1 md:flex md:items-center md:gap-2">
              {onOpenBalancePatch && (
                <button
                  id="btn-main-balance-patch"
                  onClick={onOpenBalancePatch}
                  className="h-10 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-emerald-950/90 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/60 text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/15 active:scale-95"
                  title="查看 v2.6 全英雄傷害、冷卻與機制平衡調整公告"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">平衡更新</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 font-mono shrink-0">
                    v2.6
                  </span>
                </button>
              )}

              {onOpenRecords && (
                <button
                  id="btn-main-records-header"
                  onClick={onOpenRecords}
                  className="h-10 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/80 text-xs font-black text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 ring-1 ring-amber-500/30"
                  title="獨立戰績頁面：查看生涯勝率、傷害統計與歷史冠軍"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">戰績</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono font-black shrink-0 shadow">
                    數據
                  </span>
                </button>
              )}

              {onOpenBeltModal && (
                <button
                  id="btn-main-belt-hof"
                  onClick={onOpenBeltModal}
                  className="h-10 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 hover:from-amber-900 hover:to-yellow-900 border border-amber-500/60 text-xs font-black text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/15 active:scale-95"
                  title="查看世界冠軍金腰帶與名人堂衛冕紀錄"
                >
                  <ChampionBeltBadge
                    size="sm"
                    reignDays={beltState?.currentReignDays || 0}
                    showDays={false}
                  />
                  <div className="flex items-center gap-1 truncate">
                    <span className="truncate">金腰帶</span>
                    {beltState && beltState.currentReignDays > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 font-mono shrink-0">
                        {beltState.currentReignDays}天
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>

            {/* Secondary Utilities Group (Integrated Rules & Handbook Guide, Sound) */}
            <div className="flex items-center gap-2">
              <button
                id="btn-main-rules-guide"
                onClick={onOpenHandbook}
                className="h-10 sm:h-auto flex-1 md:flex-initial px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-sky-950/90 hover:from-amber-900/90 hover:to-sky-900/90 border border-amber-500/60 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 hover:border-amber-400"
                title="開啟競技場戰鬥規則指南與英雄百科圖鑑"
              >
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>規則指南與圖鑑</span>
              </button>

              <button
                id="btn-main-sound"
                onClick={onToggleSound}
                className="h-10 w-10 sm:h-auto sm:w-auto p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                title={soundEnabled ? '點擊靜音' : '開啟音效'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-sky-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 獨立戰績快捷橫幅 (Independent Battle Records Direct Portal) */}
      {onOpenRecords && (
        <button
          id="btn-main-battle-records-portal"
          onClick={onOpenRecords}
          className="w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/60 hover:border-amber-400 hover:shadow-amber-500/10 text-slate-100 flex items-center justify-between shadow-xl transition-all cursor-pointer group active:scale-[0.99]"
          title="獨立戰績頁面：集中查看總戰績、勝負勝率、傷害統計與歷史冠軍"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform shrink-0">
              <BarChart3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                  戰績數據中心 (Battle Records)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold shrink-0">
                  獨立專區
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                獨立集中顯示：總戰績 · 勝負勝率 · 傷害統計 (技能 vs 普攻) · 最近對戰 · 歷史冠軍
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-black group-hover:translate-x-1 transition-transform shrink-0 pl-2">
            <span className="hidden xs:inline">點擊進入</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* 2. 【核心模式選擇按鈕】 - 緊隨其下即是【選角按鈕】 (符合「模式按鈕要顯示在主畫面選角按鈕上」) */}
      <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-4 sm:p-5 shadow-xl space-y-4">
        {/* Mode Buttons Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-200">
              第一步：選擇對戰模式 (Game Mode)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            模式切換將即時更新下方選角配置
          </span>
        </div>

        {/* The Two Big Prominent Mode Selection Buttons (Sitting directly ABOVE Character Select!) */}
        <div className="grid sm:grid-cols-2 gap-3" id="mode-buttons-container">
          {/* Mode Button 1: 經典單挑 (1v1 Duel) */}
          <button
            id="btn-mode-duel"
            onClick={() => handleModeSwitch('duel')}
            className={`relative rounded-xl p-3.5 sm:p-4 text-left border transition-all duration-200 cursor-pointer overflow-hidden group ${
              gameMode === 'duel'
                ? 'bg-gradient-to-br from-blue-950/70 via-slate-900 to-indigo-950/50 border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/40'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 opacity-80'
            }`}
          >
            {gameMode === 'duel' && (
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                當前選擇
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  gameMode === 'duel'
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Swords className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-100">經典單挑</h3>
                  <span className="text-[10px] text-blue-400 font-mono font-bold">1 VS 1</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  自選雙方選手與控制方式，即時在固定 2D 擂台展開物理肉搏。
                </p>
              </div>
            </div>
          </button>

          {/* Mode Button 2: 錦標淘汰賽 (Knockout Tournament) */}
          <button
            id="btn-mode-tournament"
            onClick={() => handleModeSwitch('tournament')}
            className={`relative rounded-xl p-3.5 sm:p-4 text-left border transition-all duration-200 cursor-pointer overflow-hidden group ${
              gameMode === 'tournament'
                ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-yellow-950/40 border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 opacity-80'
            }`}
          >
            {gameMode === 'tournament' && (
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                當前選擇
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  gameMode === 'tournament'
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Trophy className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-100">錦標淘汰賽</h3>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">8 / 16 強晉級樹</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  選手單敗淘汰制！可代表出戰擂台或全自動模擬，決戰奪冠。
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-slate-800/80" />

        {/* 3. 【第二步：出戰角色預覽與選角按鈕】 (Sitting directly UNDER Mode Buttons!) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-slate-200">
                第二步：出戰選手陣容配置 (Champion Setup)
              </h2>
            </div>

            {/* Quick Button to Open Character Select Modal */}
            <button
              id="btn-main-character-select-quick"
              onClick={() => onOpenCharacterSelect()}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/25 border border-blue-400/30 transition-all cursor-pointer group"
            >
              <Swords className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
              <span>進入完整選角名單</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
            </button>
          </div>

          {/* Matchup Preview Cards */}
          {gameMode === 'duel' ? (
            /* 1v1 Mode: P1 vs P2 Preview */
            <div className="grid md:grid-cols-2 gap-3">
              {/* P1 Card (Blue) */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-500/40 relative flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                    藍方選手 (P1)
                  </span>
                  {/* P1 Control Toggle Button */}
                  <button
                    onClick={() => {
                      soundEngine.playSelectHero();
                      onUpdateSettings({
                        ...settings,
                        p1Control: settings.p1Control === 'manual' ? 'auto' : 'manual'
                      });
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                      settings.p1Control === 'manual'
                        ? 'bg-blue-600/30 text-sky-300 border-sky-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {settings.p1Control === 'manual' ? (
                      <>
                        <User className="w-2.5 h-2.5" />
                        <span>玩家手動 (WASD/J/K)</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-2.5 h-2.5" />
                        <span>全自動 AI 碰撞</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-blue-400/40 shadow-md shadow-blue-500/20 shrink-0 bg-slate-900">
                    <ChampionAvatarCanvas characterId={p1Char.id} size={56} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-100 truncate">{p1Char.name}</h4>
                      <span className="text-[10px] text-slate-400 font-serif italic truncate">{p1Char.title}</span>
                    </div>
                    <div className="text-[11px] font-bold text-sky-400 mt-0.5">
                      {getCleanRole(p1Char.role)}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                      <span>HP: {p1Char.maxHp}</span>
                      <span>質量: {p1Char.mass.toFixed(2)}x</span>
                      <span>攻傷: {p1Char.attackDamage}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button to Change P1 */}
                <button
                  onClick={() => onOpenCharacterSelect('p1')}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-sky-400" />
                  <span>更換我方英雄</span>
                </button>
              </div>

              {/* P2 Card (Red) */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-red-500/40 relative flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                    紅方對手 (P2)
                  </span>
                  {/* P2 Control Toggle Button */}
                  <button
                    onClick={() => {
                      soundEngine.playSelectHero();
                      onUpdateSettings({
                        ...settings,
                        p2Control: settings.p2Control === 'manual' ? 'auto' : 'manual'
                      });
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                      settings.p2Control === 'manual'
                        ? 'bg-red-600/30 text-red-300 border-red-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {settings.p2Control === 'manual' ? (
                      <>
                        <User className="w-2.5 h-2.5" />
                        <span>玩家手動 (方向鍵)</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-2.5 h-2.5" />
                        <span>全自動 AI 碰撞</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-red-400/40 shadow-md shadow-red-500/20 shrink-0 bg-slate-900">
                    <ChampionAvatarCanvas characterId={p2Char.id} size={56} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-100 truncate">{p2Char.name}</h4>
                      <span className="text-[10px] text-slate-400 font-serif italic truncate">{p2Char.title}</span>
                    </div>
                    <div className="text-[11px] font-bold text-red-400 mt-0.5">
                      {getCleanRole(p2Char.role)}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                      <span>HP: {p2Char.maxHp}</span>
                      <span>質量: {p2Char.mass.toFixed(2)}x</span>
                      <span>攻傷: {p2Char.attackDamage}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button to Change P2 */}
                <button
                  onClick={() => onOpenCharacterSelect('p2')}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-red-400" />
                  <span>更換紅方英雄</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tournament Mode: Roster, Player Representative & Bracket Settings */
            <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/40 relative flex flex-col gap-3.5">
              {/* Header with Title & Quick Link to Independent Records */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-300">
                    錦標賽賽制、賽程與參賽配置
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tournament.size}強淘汰賽
                  </span>
                </div>

                {onOpenRecords && (
                  <button
                    onClick={onOpenRecords}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-bold cursor-pointer transition-colors self-start sm:self-auto"
                    title="前往獨立戰績頁面查看完整數據"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>查看完整戰績數據 →</span>
                  </button>
                )}
              </div>

              {/* 賽程與參賽配置 (Tournament Setup) */}
              <div className="space-y-3.5">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20 shrink-0 bg-slate-900">
                        <ChampionAvatarCanvas characterId={tourPlayerChar.id} size={64} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                            你的參賽代表
                          </span>
                          <span className="text-xs text-slate-400 font-serif italic">
                            {tourPlayerChar.title}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-100">{tourPlayerChar.name}</h4>
                        <div className="text-xs font-bold text-amber-400">
                          {getCleanRole(tourPlayerChar.role)}
                        </div>
                      </div>
                    </div>

                    {/* Tournament Config Controls - Responsive Mobile Layout */}
                    <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-row items-stretch md:items-center gap-2 md:gap-2.5 self-stretch md:self-auto justify-end touch-manipulation select-none">
                      <div className="grid grid-cols-2 gap-2 flex-1 md:flex md:items-center">
                        {/* Size Selector */}
                        <div className="flex items-center justify-center bg-slate-900 p-1 rounded-xl border border-slate-800 h-10 sm:h-auto">
                          <button
                            onClick={() => onUpdateTournamentSize(8)}
                            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                              tournament.size === 8
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            8 強賽制
                          </button>
                          <button
                            onClick={() => onUpdateTournamentSize(16)}
                            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                              tournament.size === 16
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            16 強賽制
                          </button>
                        </div>

                        {/* Control Selector */}
                        <button
                          onClick={onToggleTournamentControl}
                          className={`h-10 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                            tournament.playerControl === 'manual'
                              ? 'bg-blue-600/30 text-sky-300 border-sky-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                          title="切換手動引導或電腦代打"
                        >
                          {tournament.playerControl === 'manual' ? (
                            <>
                              <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span className="truncate">親自出戰</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">AI 代打</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Change Tournament Hero / Configure Tournament Roster */}
                      <button
                        onClick={() => onOpenCharacterSelect('p1')}
                        className="h-10 sm:h-auto px-3.5 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5 shrink-0" />
                        <span>自訂參賽席位 ({tournament.size}強名單)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mini Tournament Participants Strip */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold text-slate-300">
                        參賽選手陣容名單 ({tournament.roster?.length || tournament.size} 席位)：
                      </span>
                      <button
                        onClick={() => onOpenCharacterSelect('p1')}
                        className="text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>點此更換席位英雄</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto overscroll-contain mobile-scroll-x no-scrollbar py-1">
                      {(tournament.roster && tournament.roster.length > 0
                        ? tournament.roster
                        : Object.keys(CHARACTERS).slice(0, tournament.size)
                      ).map((cId, idx) => {
                        const c = CHARACTERS[cId as CharacterId];
                        const isPlayer = tournament.playerCharId === cId;
                        return (
                          <div
                            key={`mini-seed-${idx}`}
                            onClick={() => onOpenCharacterSelect('p1')}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer shrink-0 transition-all ${
                              isPlayer
                                ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                            title={isPlayer ? '你的代表英雄 (點擊配置名單)' : '參賽選手 (點擊配置名單)'}
                          >
                            <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                              <ChampionAvatarCanvas characterId={cId as CharacterId} size={20} />
                            </div>
                            <span className="font-bold truncate max-w-[55px]">{c?.name || cId}</span>
                            {isPlayer && <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 現任金腰帶王者卡片 (Current Belt Sovereign Spotlight) */}
                {beltHolder ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-950 border border-amber-500/50 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/30 bg-slate-900 shrink-0">
                              <ChampionAvatarCanvas characterId={beltHolder.id} size={64} />
                            </div>
                            <div className="absolute -top-2 -right-2 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                              <Crown className="w-3.5 h-3.5 fill-slate-950" />
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono tracking-wide shadow">
                                現任金腰帶霸主
                              </span>
                              <span className="text-xs text-amber-300 font-serif italic">{beltHolder.title}</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-100 flex items-center gap-2">
                              <span>{beltHolder.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                                {getCleanRole(beltHolder.role)}
                              </span>
                            </h4>
                            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 font-mono pt-0.5">
                              <span>統治 <strong className="text-amber-400 font-black">{beltState?.currentReignDays || 0}</strong> 天</span>
                              <span>衛冕成功 <strong className="text-amber-400 font-black">{beltState?.records[beltHolder.id]?.totalDefenses || 0}</strong> 次</span>
                              <span>奪冠 <strong className="text-amber-400 font-black">{beltState?.records[beltHolder.id]?.totalChampionships || 0}</strong> 次</span>
                            </div>
                          </div>
                        </div>

                        {/* Reigning King's Career Performance & Direct Action */}
                        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end">
                          {beltState?.records[beltHolder.id] && (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
                              <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-medium">個人勝率</div>
                                <div className="text-amber-400 font-mono font-black text-sm">
                                  {beltState.records[beltHolder.id].winRate}%
                                </div>
                              </div>
                              <div className="h-6 w-px bg-slate-800" />
                              <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-medium">平均時長</div>
                                <div className="text-sky-300 font-mono font-black text-sm">
                                  {beltState.records[beltHolder.id].avgBattleDuration}s
                                </div>
                              </div>
                              <div className="h-6 w-px bg-slate-800" />
                              <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-medium">當前連勝</div>
                                <div className="text-orange-400 font-mono font-black text-sm">
                                  {beltState.records[beltHolder.id].currentWinStreak > 0 ? `${beltState.records[beltHolder.id].currentWinStreak}連勝` : '-'}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-2 touch-manipulation select-none">
                            <button
                              onClick={() => handleAssignPlayer(beltHolder.id)}
                              className="h-10 sm:h-auto px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                            >
                              {justAssignedId === beltHolder.id ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                                  <span>已設為代表</span>
                                </>
                              ) : (
                                <>
                                  <User className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                                  <span>設為代表</span>
                                </>
                              )}
                            </button>
                            {onOpenBeltModal && (
                              <button
                                onClick={onOpenBeltModal}
                                className="h-10 sm:h-auto px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                              >
                                查看腰帶明細
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                          <ChampionBeltBadge size="sm" showDays={false} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-bold">
                              王座空缺中
                            </span>
                            <span className="text-xs text-amber-400 font-bold">歷史空白 · 等待首位冠軍加冕</span>
                          </div>
                          <p className="text-xs text-slate-300">
                            絕無任何預製虛構歷史！所有英雄歷史與金腰帶榮譽，皆需由玩家親自遊玩開拓加冕。
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onSelectGameMode('tournament')}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>立即角逐首任金腰帶</span>
                        </button>
                        {onOpenBeltModal && (
                          <button
                            onClick={onOpenBeltModal}
                            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 active:scale-95 cursor-pointer whitespace-nowrap"
                          >
                            查看腰帶
                          </button>
                        )}
                      </div>
                    </div>
                  )}



                  {/* 戰績獨立提醒與跳轉捷徑 */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">全英雄生涯戰績與數據中心已獨立</div>
                        <div className="text-[11px] text-slate-400">總勝負、勝率、傷害統計比例、最近對戰與冠軍頭銜皆在獨立戰績專區。</div>
                      </div>
                    </div>
                    {onOpenRecords && (
                      <button
                        onClick={onOpenRecords}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer shrink-0 active:scale-95 flex items-center gap-1.5"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>進入戰績頁面</span>
                      </button>
                    )}
                  </div>

            </div>
          )}
        </div>

        {/* 【👑 冠軍加冕賽確認 (Title Match Confirmation Switch)】 */}
        <div className={`rounded-xl p-3 sm:p-3.5 border transition-all duration-200 ${
          isTitleMatchActive
            ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-yellow-950/40 border-amber-500/60 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
            : 'bg-slate-950/60 border-slate-800/90'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isTitleMatchActive
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {isTitleMatchActive ? (
                  <Crown className="w-4 h-4 fill-amber-400/50 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-100">
                    賽事性質判定：
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border font-mono tracking-wider ${
                    isTitleMatchActive
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    {isTitleMatchActive
                      ? (gameMode === 'duel'
                          ? (duelTitleDetails.championId ? '👑 世界冠軍頭銜衛冕戰' : '👑 首任世界冠軍加冕賽')
                          : '👑 錦標賽世界冠軍加冕戰')
                      : '⚔️ 一般比賽（不涉及世界冠軍頭銜）'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {isTitleMatchActive
                    ? (gameMode === 'duel'
                        ? (duelTitleDetails.championId
                            ? `【世界冠軍頭銜爭奪】勝者加冕或衛冕金腰帶，衛冕次數＋1 並累計衛冕天數！挑戰者獲勝則頭銜易主。`
                            : `【首任世界冠軍加冕賽】目前尚未產生世界冠軍，勝者將正式加冕為球球競技場「首任世界冠軍」！`)
                        : `【錦標賽加冕賽】決賽勝者將正式加冕世界冠軍金腰帶，載入歷史名人堂！`)
                    : `【一般比賽】預設不涉及冠軍頭銜。即使世界冠軍參賽，勝負僅計入生涯戰績，不影響衛冕次數與衛冕天數。`}
                </p>
              </div>
            </div>

            {/* Toggle switch button (冠軍加冕賽確認) */}
            <button
              id="btn-toggle-title-match"
              onClick={toggleTitleMatchSwitch}
              className={`h-9 px-3.5 rounded-xl text-xs font-black border flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer active:scale-95 shadow-sm ${
                isTitleMatchActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-yellow-300 hover:brightness-105 shadow-amber-500/20'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-slate-100'
              }`}
              title="點擊開啟或關閉冠軍加冕賽確認（每場比賽獨立判定）"
            >
              <Crown className={`w-3.5 h-3.5 ${isTitleMatchActive ? 'fill-slate-950' : 'text-slate-400'}`} />
              <span>{isTitleMatchActive ? '冠軍加冕賽確認：已開啟' : '冠軍加冕賽確認：關閉 (一般比賽)'}</span>
              <span className={`w-2 h-2 rounded-full ${isTitleMatchActive ? 'bg-slate-950' : 'bg-slate-500'}`} />
            </button>
          </div>
        </div>

        {/* 4. 【第三步：啟動進入對戰按鈕】 (Sitting directly UNDER Character Select!) */}
        <div className="pt-2">
          {gameMode === 'duel' ? (
            <button
              id="btn-main-start-duel"
              onClick={onStartDuel}
              className="relative overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-base tracking-wider shadow-xl shadow-blue-500/30 border border-blue-400/40 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="energy-beam-flow pointer-events-none z-0 opacity-30" />
              <Play className="w-5 h-5 fill-white relative z-10 transition-transform group-hover:scale-110" />
              <span className="relative z-10 drop-shadow">進入擂台開始對決 (Start Battle)</span>
            </button>
          ) : (
            <button
              id="btn-main-start-tournament"
              onClick={onEnterTournament}
              className="relative overflow-hidden w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base tracking-wider shadow-xl shadow-amber-500/30 border border-yellow-300/60 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="energy-beam-flow pointer-events-none z-0 opacity-25" />
              <Trophy className="w-5 h-5 fill-slate-950 relative z-10 transition-transform group-hover:scale-110" />
              <span className="relative z-10 drop-shadow">進入錦標賽對陣樹 (Enter Bracket)</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Quick Features & Mechanics Grid */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-sky-400">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>2D 物理剛體碰撞</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            真實質量、速度、碰撞衝量與反彈向量運算，不同體型碰撞動量真實傳遞。
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>三大專屬被動連鎖</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            18+ 原創英雄各自具備 3 大被動，涵蓋能量充能、超載暴擊與瀕死護盾反殺。
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>戰術瞬衝與金光護盾</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            手動操作時可使用 [J] 爆發突進重創敵手，或 [K] 展開護盾強烈反震彈開對手。
          </p>
        </div>
      </div>
    </div>
  );
};

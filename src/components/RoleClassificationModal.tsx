import React, { useState, useEffect } from 'react';
import { CharacterId } from '../types/game';
import { RoleCategory, RoleInfo } from '../types/roles';
import { ROLE_TAXONOMY, ROLE_COLLISION_RULES, getCharacterSubClasses } from '../data/roleTaxonomy';
import {
  SKILL_PRIORITY_TIERS,
  SKILL_MECHANISM_GUIDES,
  MECHANISM_INTERACTIONS,
  SkillPriorityTierInfo,
  SkillMechanismGuide
} from '../data/skillMechanics';
import { CHARACTERS } from '../data/characters';
import { CURRENT_BALANCE_PATCH } from '../data/balancePatch';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import {
  Shield,
  Swords,
  Crosshair,
  Sparkles,
  HeartHandshake,
  X,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Flame,
  Zap,
  Activity,
  Target,
  ArrowRight,
  ShieldCheck,
  Award,
  Radio,
  RotateCcw,
  HeartPulse,
  Disc,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  AlertCircle,
  Trophy,
  Gamepad2,
  Wind,
  HelpCircle,
  Play
} from 'lucide-react';

interface RoleClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: RoleCategory;
  initialMode?: 'rules' | 'roles' | 'mechanics' | 'patch';
  onSelectCharacter?: (characterId: CharacterId) => void;
}

export const RoleClassificationModal: React.FC<RoleClassificationModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'tank',
  initialMode = 'rules',
  onSelectCharacter
}) => {
  const [modalMode, setModalMode] = useState<'rules' | 'roles' | 'mechanics' | 'patch'>(initialMode);
  const [activeRoleTab, setActiveRoleTab] = useState<RoleCategory>(initialRole);
  const [selectedSubClassId, setSelectedSubClassId] = useState<string | null>(null);

  // Synchronize modalMode with initialMode whenever opened
  useEffect(() => {
    if (isOpen && initialMode) {
      setModalMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Patch tab filter
  const [patchFilter, setPatchFilter] = useState<'all' | 'buff' | 'nerf' | 'adjust'>('all');

  // Mechanics sub-tabs
  const [mechanicsSubTab, setMechanicsSubTab] = useState<'priority' | 'guides' | 'matrix'>('priority');
  const [selectedGuideId, setSelectedGuideId] = useState<string>(SKILL_MECHANISM_GUIDES[0].id);

  if (!isOpen) return null;

  const currentRoleInfo: RoleInfo = ROLE_TAXONOMY[activeRoleTab];

  const getRoleIcon = (roleId: RoleCategory, className = 'w-4 h-4') => {
    switch (roleId) {
      case 'tank':
        return <Shield className={className} />;
      case 'warrior':
        return <Swords className={className} />;
      case 'assassin':
        return <Flame className={className} />;
      case 'marksman':
        return <Crosshair className={className} />;
      case 'mage':
        return <Sparkles className={className} />;
      case 'support':
        return <HeartHandshake className={className} />;
    }
  };

  const getMechanismIcon = (iconName: SkillMechanismGuide['iconName'], className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Shield':
        return <Shield className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Swords':
        return <Swords className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'RotateCcw':
        return <RotateCcw className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Disc':
        return <Disc className={className} />;
      case 'Crosshair':
        return <Crosshair className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const roleKeys: RoleCategory[] = ['tank', 'warrior', 'assassin', 'marksman', 'mage', 'support'];
  const activeGuide = SKILL_MECHANISM_GUIDES.find(g => g.id === selectedGuideId) || SKILL_MECHANISM_GUIDES[0];

  return (
    <div
      id="role-classification-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4 bg-black/85 backdrop-blur-md flex items-center justify-center min-h-full animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="role-classification-modal-content"
        className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-400 flex items-center justify-center shadow-inner shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
                <span>競技場百科圖鑑與技能機制手冊</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                涵蓋 6 大定位判定標準、T0~T7 技能優先順序執行鏈、{SKILL_MECHANISM_GUIDES.length} 大核心機制與克制法則
              </p>
            </div>
          </div>

          {/* Mode Switcher & Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80 overflow-x-auto">
              <button
                id="btn-mode-rules"
                onClick={() => setModalMode('rules')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  modalMode === 'rules'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>戰鬥規則指南</span>
              </button>
              <button
                id="btn-mode-roles"
                onClick={() => setModalMode('roles')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  modalMode === 'roles'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>角色定位 (54標準)</span>
              </button>
              <button
                id="btn-mode-mechanics"
                onClick={() => setModalMode('mechanics')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  modalMode === 'mechanics'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>技能機制與優先鏈</span>
              </button>
              <button
                id="btn-mode-patch"
                onClick={() => setModalMode('patch')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  modalMode === 'patch'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>平衡更新 (v2.6)</span>
              </button>
            </div>

            <button
              id="btn-close-role-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="關閉手冊"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODE 0: 戰鬥規則與操作指南 (Game Rules & Combat Manual) */}
        {modalMode === 'rules' && (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y p-3 sm:p-5 space-y-4">
            {/* Rules Hero Header */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 shadow-lg relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px] border border-sky-500/40 uppercase">
                      Official Combat Manual
                    </span>
                    <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                      <span>競技場戰鬥規則・核心能量系統與技巧指南</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    本遊戲為純 2D 剛體物理即時撞擊模擬對決。英雄具備專屬定位屬性、被動技能觸發鏈與戰術手動操作。熟練掌握能量循環、超載暴擊與戰術瞬衝護盾，即可在淘汰賽勇奪擂台金腰帶！
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">物理模擬</div>
                    <div className="text-xs font-black text-sky-400">剛體碰撞</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">能量自然回復</div>
                    <div className="text-xs font-black text-amber-400">15 / 秒</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. 遊戲核心模式與勝負判定 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-200 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>一、賽制模式與勝負判定規則</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                      1v1
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">經典單挑對決</h4>
                      <span className="text-[10px] text-slate-400">自選英雄極限切磋</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    雙方代表於剛體物理擂台自由對抗。將對方生命值擊減至 0，或將對手強勢撞擊出邊界，即刻取得單挑勝利！
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">錦標淘汰賽制</h4>
                      <span className="text-[10px] text-slate-400">8強 / 16強 淘汰樹</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    逐輪晉級單淘汰賽！支援玩家代表親自上陣（或切換 AI 自動代打），自動推演電腦局，直取總冠軍榮耀！
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50 transition-colors space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 flex items-center justify-center font-bold text-xs">
                      👑
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-200">WWE 世界金腰帶</h4>
                      <span className="text-[10px] text-amber-400/80 font-mono">擂台王座與衛冕統治</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    現任王者守擂，擊敗王者即可篡位奪帶！每次成功衛冕累計「虛擬統治天數」與「防衛次數」，登錄名人堂！
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 核心能量系統與四大作戰技巧 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-200 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>二、核心能量系統與四大戰術技巧</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/90 border border-sky-900/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-sky-400">
                    <Zap className="w-4 h-4" />
                    <span>能量循環與被動觸發</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    球體每秒自然回復 <strong className="text-sky-300">15 點能量</strong>（上限 100）。各英雄專屬被動技能依冷卻與能量自動觸發，能量耗盡時技能暫緩。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-900/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>超載暴擊 (Overdrive)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    當能量集滿 <strong className="text-amber-300">100 點</strong> 時自動啟動超載！下一次碰撞產生金光震波，額外附加 <strong className="text-amber-300">+30% 暴擊傷害</strong>！
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-blue-900/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-400">
                    <Wind className="w-4 h-4" />
                    <span>戰術瞬衝 [快捷鍵 J]</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    手動操控時消耗 <strong className="text-blue-300">30 能量</strong>，向游標或敵球方向瞬間爆發突進！命中造成強力破甲、破防與擊退反衝。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-900/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
                    <Shield className="w-4 h-4" />
                    <span>戰術護盾 [快捷鍵 K]</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    手動操控時消耗 <strong className="text-emerald-300">25 能量</strong> 展開金光防護罩，抵擋 <strong className="text-emerald-300">75% 受到傷害</strong> 並強烈震開衝擊之敵球！
                  </p>
                </div>
              </div>
            </div>

            {/* 3. 鍵盤快捷鍵與觸控操作對照表 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-200 uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <span>三、按鍵操作與快捷鍵對照手冊</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-sky-400">
                    WASD / 方向鍵
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">手動球體移動</div>
                  <div className="text-[10px] text-slate-400">引導移動與衝刺向</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-blue-400">
                    J 鍵
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">戰術瞬衝</div>
                  <div className="text-[10px] text-slate-400">消耗 30 能量瞬突</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
                    K 鍵
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">戰術護盾</div>
                  <div className="text-[10px] text-slate-400">消耗 25 能量防護</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                    空白鍵 (Space)
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">暫停 / 繼續</div>
                  <div className="text-[10px] text-slate-400">控制戰鬥節奏</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-rose-400">
                    R 鍵
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">重新開始</div>
                  <div className="text-[10px] text-slate-400">重置當前戰局</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-purple-400">
                    1 / 2 / 3 鍵
                  </div>
                  <div className="text-[11px] font-bold text-slate-200">戰鬥速率</div>
                  <div className="text-[10px] text-slate-400">1x / 1.5x / 2x 倍速</div>
                </div>
              </div>
            </div>

            {/* 4. 職業碰撞傷害與技能分離原則 */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>職業系統物理碰撞傷害通則（近戰碰撞 vs 遠程技能分離）</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">競技平衡物理模型</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                在剛體物理對決中，<strong className="text-emerald-300">坦克、戰士、刺客、輔助</strong> 均具備近身物理碰撞傷害；而 <strong className="text-amber-300">射手與法師</strong> 的物理碰撞傷害固定為 0，其傷害輸出完全仰賴法術投射物與專屬被動技能。因此遠程英雄須善用位移與反彈，避免被近戰強勢壓迫於擂台邊角。
              </p>
            </div>

            {/* Quick Navigation Footer Links */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>想要進一步研究各英雄能力與技能克制？</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setModalMode('roles')}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>查看 6 大英雄定位 (54標準)</span>
                </button>
                <button
                  onClick={() => setModalMode('mechanics')}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>查看 T0~T7 技能優先鏈</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 1: 角色分類判定標準 (54 Criteria) */}
        {modalMode === 'roles' && (
          <>
            {/* 6 大定位 Tab 切換欄 */}
            <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
              {roleKeys.map(roleKey => {
                const info = ROLE_TAXONOMY[roleKey];
                const isActive = activeRoleTab === roleKey;
                return (
                  <button
                    key={roleKey}
                    id={`tab-role-${roleKey}`}
                    onClick={() => {
                      setActiveRoleTab(roleKey);
                      setSelectedSubClassId(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`}
                    style={
                      isActive
                        ? {
                            borderBottom: `2px solid ${info.themeColor}`,
                            color: info.themeColor
                          }
                        : {}
                    }
                  >
                    {getRoleIcon(roleKey, 'w-3.5 h-3.5')}
                    <span>{info.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({info.subClasses.length})</span>
                  </button>
                );
              })}
            </div>

            {/* Content Body: Roles */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y p-3 sm:p-5 space-y-4">
              {/* 職業碰撞規則統一對照條 (Role Collision Rules Bar) */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    職業系統碰撞傷害規範（射手與法師固定為 0）
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">技能輸出與物理碰撞完全分離</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {Object.values(ROLE_COLLISION_RULES).map(rule => {
                    const isZero = rule.canDealDamage === false;
                    const isCurrentRole = rule.role === activeRoleTab;
                    return (
                      <div
                        key={rule.role}
                        onClick={() => {
                          setActiveRoleTab(rule.role);
                          setSelectedSubClassId(null);
                        }}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          isCurrentRole
                            ? 'bg-slate-800/90 border-slate-600 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850'
                        }`}
                      >
                        <div className="text-[11px] font-bold text-slate-300">{rule.roleName}</div>
                        <div
                          className={`text-[11px] font-black mt-0.5 ${
                            isZero ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {rule.collisionDamageText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Role Overview Card */}
              <div
                className="p-3.5 rounded-xl border relative overflow-hidden"
                style={{
                  backgroundColor: `${currentRoleInfo.themeColor}12`,
                  borderColor: `${currentRoleInfo.themeColor}35`
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-black uppercase px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${currentRoleInfo.themeColor}25`,
                          borderColor: `${currentRoleInfo.themeColor}80`,
                          color: currentRoleInfo.themeColor
                        }}
                      >
                        {currentRoleInfo.id}
                      </span>
                      <h3 className="text-sm font-black text-slate-100">
                        {currentRoleInfo.name} ({currentRoleInfo.englishName})
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {currentRoleInfo.description}
                    </p>
                    {/* 職業碰撞規則標籤 */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80">
                        <span className="text-slate-400 font-semibold">碰撞傷害：</span>
                        <span
                          className={`font-black ${
                            currentRoleInfo.id === 'marksman' || currentRoleInfo.id === 'mage'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {ROLE_COLLISION_RULES[currentRoleInfo.id]?.collisionDamageText}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {ROLE_COLLISION_RULES[currentRoleInfo.id]?.detail}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">細分子類</span>
                    <p
                      className="text-base font-black"
                      style={{ color: currentRoleInfo.themeColor }}
                    >
                      {currentRoleInfo.subClasses.length} 類
                    </p>
                  </div>
                </div>
              </div>

              {/* SubClass Cards Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                  <span>細分子類與嚴格判定標準 (54 條基準)：</span>
                  <span className="text-[11px] text-slate-400 font-mono">點擊卡片查看細節</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentRoleInfo.subClasses.map((subClass, index) => {
                    const isSelected = selectedSubClassId === subClass.id;
                    const matchedHeroes = Object.values(CHARACTERS).filter(c =>
                      (subClass.matchedCharacterIds || []).includes(c.id)
                    );

                    return (
                      <div
                        key={subClass.id}
                        id={`subclass-card-${subClass.id}`}
                        onClick={() => setSelectedSubClassId(isSelected ? null : subClass.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/95 border-sky-500 shadow-lg ring-1 ring-sky-500/50'
                            : 'bg-slate-950/70 border-slate-800/90 hover:bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span
                              className="text-xs font-black"
                              style={{
                                color: currentRoleInfo.themeColor
                              }}
                            >
                              {subClass.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            <span>符合英雄：</span>
                            <span className="font-bold text-slate-200">{matchedHeroes.length} 位</span>
                          </div>
                        </div>

                        {/* Official Criterion */}
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11.5px] text-slate-300 leading-relaxed mb-2.5">
                          <span className="font-bold text-sky-400 mr-1">判定標準：</span>
                          <span>{subClass.criterion}</span>
                        </div>

                        {/* Matched Champions Preview */}
                        {matchedHeroes.length > 0 ? (
                          <div className="space-y-2 pt-1 border-t border-slate-800/60">
                            <div className="text-[10.5px] text-slate-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>代表英雄與具體技能判定：</span>
                            </div>

                            <div className="space-y-1.5">
                              {matchedHeroes.map(hero => {
                                const charMatches = getCharacterSubClasses(hero.id);
                                const specificMatch = charMatches.find(m => m.name === subClass.name);

                                return (
                                  <div
                                    key={hero.id}
                                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/70 flex items-start gap-2 text-[11px]"
                                  >
                                    <div className="shrink-0 pt-0.5">
                                      <ChampionAvatarCanvas characterId={hero.id} size={28} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <span className="font-bold text-slate-200">
                                          {hero.name} · {hero.title}
                                        </span>
                                        {onSelectCharacter && (
                                          <button
                                            onClick={e => {
                                              e.stopPropagation();
                                              onSelectCharacter(hero.id);
                                              onClose();
                                            }}
                                            className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 hover:bg-sky-800 hover:text-white transition-colors cursor-pointer"
                                          >
                                            選擇
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-slate-400 text-[10.5px] leading-snug mt-0.5">
                                        {specificMatch?.rationale || hero.role}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1 border-t border-slate-800/60 text-[10.5px] text-slate-400 italic">
                            目前英雄池暫無主要以此為唯一標籤之代表，作為後續英雄擴充判定基準。
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* MODE 2: 技能優先順序與機制圖鑑 (Mechanics & Priority Compendium) */}
        {modalMode === 'mechanics' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mechanics Sub-Tab Switcher */}
            <div className="flex items-center justify-between px-5 py-2 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  id="tab-sub-priority"
                  onClick={() => setMechanicsSubTab('priority')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mechanicsSubTab === 'priority'
                      ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  優先順序執行鏈 (T0 ~ T7)
                </button>
                <button
                  id="tab-sub-guides"
                  onClick={() => setMechanicsSubTab('guides')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mechanicsSubTab === 'guides'
                      ? 'bg-sky-500/20 border border-sky-500/60 text-sky-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {SKILL_MECHANISM_GUIDES.length} 大核心機制詳解
                </button>
                <button
                  id="tab-sub-matrix"
                  onClick={() => setMechanicsSubTab('matrix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mechanicsSubTab === 'matrix'
                      ? 'bg-purple-500/20 border border-purple-500/60 text-purple-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  機制相生相剋矩陣
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                <span>每影格嚴格按物理與技能階層優先運算</span>
              </div>
            </div>

            {/* Sub-view A: 技能優先順序執行鏈 (T0 ~ T7) */}
            {mechanicsSubTab === 'priority' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y p-3 sm:p-5 space-y-3.5">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">技能結算優先原則：</span>
                    <span>
                      當同一影格多個技能或物理事件同時觸發時，由最高階層（T0）向前向下依序判定。
                      高優先級具備阻斷、抵消或免除低優先級效果的特權（例如：T0 無敵阻絕 T7 碰撞傷害、T1 霸體完全免疫 T2 硬控）。
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {SKILL_PRIORITY_TIERS.map((tierInfo: SkillPriorityTierInfo, idx) => (
                    <div
                      key={tierInfo.tier}
                      id={`priority-tier-${tierInfo.tier}`}
                      className="p-4 rounded-xl border transition-all hover:bg-slate-900/90"
                      style={{
                        backgroundColor: tierInfo.bgColor,
                        borderColor: tierInfo.borderColor
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-700/60">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="px-2.5 py-0.5 rounded-lg text-xs font-black font-mono shadow-sm"
                            style={{
                              backgroundColor: tierInfo.color,
                              color: '#000000'
                            }}
                          >
                            {tierInfo.tier}
                          </span>
                          <h4 className="text-sm font-black text-slate-100">
                            {tierInfo.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                            {tierInfo.badge}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                          <Activity className="w-3.5 h-3.5 text-slate-400" />
                          <span>結算時機：</span>
                          <span className="text-slate-200 font-bold">{tierInfo.timing}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                        {tierInfo.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11.5px] text-slate-300 mb-3">
                        <span className="font-bold text-sky-400 mr-1.5">核心執行法則：</span>
                        <span>{tierInfo.priorityRule}</span>
                      </div>

                      {/* Real Examples */}
                      <div className="space-y-1.5">
                        <div className="text-[10.5px] text-slate-400 font-bold">經典代表英雄技能：</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tierInfo.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[11px]"
                            >
                              <div
                                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: tierInfo.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-100">{ex.skillName}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({ex.championName})</span>
                                </div>
                                <p className="text-slate-300 text-[10.5px] leading-snug mt-0.5">
                                  {ex.effect}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-view B: 八大核心機制詳解 (8 Deep Mechanism Guides) */}
            {mechanicsSubTab === 'guides' && (
              <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
                {/* Left side list of 8 guides */}
                <div className="w-full md:w-72 max-h-44 md:max-h-none border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50 p-3 space-y-1.5 overflow-y-auto overscroll-contain mobile-scroll-y shrink-0">
                  <div className="text-[11px] font-bold text-slate-400 px-2 mb-1">
                    {SKILL_MECHANISM_GUIDES.length} 大機制專題：
                  </div>
                  {SKILL_MECHANISM_GUIDES.map(guide => {
                    const isSelected = guide.id === selectedGuideId;
                    return (
                      <button
                        key={guide.id}
                        id={`btn-guide-${guide.id}`}
                        onClick={() => setSelectedGuideId(guide.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-sky-500 text-white shadow-md ring-1 ring-sky-500/40'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: `${guide.badgeColor}20`,
                              borderColor: `${guide.badgeColor}50`,
                              color: guide.badgeColor
                            }}
                          >
                            {getMechanismIcon(guide.iconName, 'w-3.5 h-3.5')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{guide.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{guide.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Right side detailed explanation */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y p-3 sm:p-5 space-y-4">
                  <div
                    className="p-4 rounded-xl border relative overflow-hidden"
                    style={{
                      backgroundColor: `${activeGuide.badgeColor}12`,
                      borderColor: `${activeGuide.badgeColor}40`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase border"
                        style={{
                          backgroundColor: `${activeGuide.badgeColor}25`,
                          borderColor: `${activeGuide.badgeColor}80`,
                          color: activeGuide.badgeColor
                        }}
                      >
                        {activeGuide.iconName} 機制專題
                      </span>
                      <h3 className="text-sm font-black text-slate-100">{activeGuide.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeGuide.summary}</p>
                  </div>

                  {/* Core Principles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-sky-400" />
                      <span>核心運算法則與觸發邏輯：</span>
                    </h4>
                    <div className="space-y-1.5">
                      {activeGuide.corePrinciples.map((principle, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11.5px] text-slate-300 leading-relaxed flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <span>{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-400" />
                      <span>戰場深度解析：</span>
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {activeGuide.detailedExplanation}
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>代表英雄與技能實裝：</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeGuide.keySkills.map((ks, ksIdx) => (
                        <div
                          key={ksIdx}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                            <span className="text-amber-400">[{ks.champion}]</span>
                            <span>{ks.skill}</span>
                          </div>
                          <p className="text-slate-400 text-[10.5px] leading-snug">{ks.mechanism}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Counter Strategy */}
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                    <Target className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">實戰應對與反制技巧 (Counter Play)：</span>
                      <p className="mt-0.5 text-slate-300 leading-relaxed">{activeGuide.counterStrategy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view C: 機制相生相剋矩陣 (Mechanism Interaction Matrix) */}
            {mechanicsSubTab === 'matrix' && (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y p-3 sm:p-5 space-y-3.5">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-2">
                  <Swords className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">機制碰撞交互矩陣：</span>
                    <span>
                      在瞬息萬變的彈射碰撞中，不同的技能機制會產生精準的抵消、穿透或吸收判定。了解克制關係能助您在選角與對抗中佔據先機。
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {MECHANISM_INTERACTIONS.map(rule => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>{rule.title}</span>
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[10.5px]">
                          {rule.priorityWinner}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">進攻機制：</span>
                          <span className="font-bold text-rose-300 ml-1">{rule.attackerMechanism}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400">防守機制：</span>
                          <span className="font-bold text-sky-300 ml-1">{rule.defenderMechanism}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11.5px] text-slate-200 leading-relaxed">
                        <span className="font-bold text-emerald-400 mr-1">交互結算結果：</span>
                        <span>{rule.interactionOutcome}</span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>作戰訣竅：{rule.combatTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: 全英雄平衡公告 (v2.5) */}
        {modalMode === 'patch' && (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y flex flex-col bg-slate-950/40">
            {/* Patch Overview Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-black">
                    {CURRENT_BALANCE_PATCH.version}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {CURRENT_BALANCE_PATCH.date}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPatchFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      patchFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    全部 ({CURRENT_BALANCE_PATCH.changes.length})
                  </button>
                  <button
                    onClick={() => setPatchFilter('buff')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      patchFilter === 'buff' ? 'bg-emerald-600 text-white' : 'text-emerald-400/80 hover:text-emerald-300'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>強化</span>
                  </button>
                  <button
                    onClick={() => setPatchFilter('nerf')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      patchFilter === 'nerf' ? 'bg-rose-600 text-white' : 'text-rose-400/80 hover:text-rose-300'
                    }`}
                  >
                    <TrendingDown className="w-3 h-3" />
                    <span>削弱</span>
                  </button>
                  <button
                    onClick={() => setPatchFilter('adjust')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      patchFilter === 'adjust' ? 'bg-sky-600 text-white' : 'text-sky-400/80 hover:text-sky-300'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>機制</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {CURRENT_BALANCE_PATCH.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-2">
                {CURRENT_BALANCE_PATCH.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List of Characters with changes */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {CURRENT_BALANCE_PATCH.changes
                .filter(c => patchFilter === 'all' || c.type === patchFilter)
                .map(item => {
                  const char = CHARACTERS[item.characterId];
                  const isBuff = item.type === 'buff';
                  const isNerf = item.type === 'nerf';

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-4 transition-all duration-200 ${
                        isBuff
                          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border-emerald-500/40'
                          : isNerf
                          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/40'
                          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/20 border-sky-500/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          {char && (
                            <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 shadow">
                              <ChampionAvatarCanvas character={char} size={38} />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-100">
                                {item.characterName}
                              </h3>
                              <span className="text-xs text-slate-400">
                                {item.characterTitle}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                  isBuff
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : isNerf
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                }`}
                              >
                                {isBuff && <TrendingUp className="w-2.5 h-2.5" />}
                                {isNerf && <TrendingDown className="w-2.5 h-2.5" />}
                                {!isBuff && !isNerf && <RotateCcw className="w-2.5 h-2.5" />}
                                {isBuff ? '增強強化' : isNerf ? '削弱平衡' : '機制重構'}
                              </span>
                            </div>
                            <p className="text-xs text-amber-300 font-medium mt-0.5">
                              {item.headline}
                            </p>
                          </div>
                        </div>

                        {onSelectCharacter && (
                          <button
                            onClick={() => {
                              onSelectCharacter(item.characterId);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white border border-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                          >
                            選取此英雄
                          </button>
                        )}
                      </div>

                      {/* Detail diff items */}
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {item.changes.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1"
                          >
                            <span className="text-xs font-bold text-slate-200">
                              {c.target}
                            </span>
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 line-through text-[11px] border border-slate-800">
                                {c.before}
                              </span>
                              <span className="text-slate-500">➔</span>
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[11px] border ${
                                  isBuff
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                    : isNerf
                                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                                    : 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                                }`}
                              >
                                {c.after}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {c.reason}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-300">平衡意圖：</strong>
                          {item.summary}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>所有分類皆經戰鬥數值、被動技能觸發與物理碰撞模型嚴格判定</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            返回英雄選擇
          </button>
        </div>
      </div>
    </div>
  );
};

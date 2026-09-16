import React, { useState, useRef, useEffect } from 'react';
import { CharacterId, GameSettings, PassiveSkill } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { RoleCategory } from '../types/roles';
import { ROLE_TAXONOMY } from '../data/roleTaxonomy';
import { RoleClassificationModal } from './RoleClassificationModal';
import { soundEngine } from '../utils/audio';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { FlowingSkillDescription } from './FlowingSkillDescription';
import { MarqueeText } from './MarqueeText';
import { TournamentSize } from '../types/tournament';
import { ALL_CHAR_IDS, shuffleArray } from '../utils/tournamentManager';
import {
  Swords,
  Bot,
  User,
  Zap,
  FastForward,
  Sparkles,
  Bomb,
  ShieldAlert,
  Flame,
  Shield,
  Layers,
  Orbit,
  CircleDot,
  CheckCircle2,
  X,
  Wand2,
  Activity,
  Maximize2,
  Weight,
  Copy,
  Sun,
  Diamond,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  HeartHandshake,
  BookOpen,
  Shuffle,
  Trophy,
  Crown,
  RotateCcw,
  Sliders,
  Check,
  Heart,
  Scissors,
  Sword,
  Eye,
  Target,
  Wind,
  Ghost,
  Compass,
  Skull,
  Gift,
  Moon
} from 'lucide-react';

export interface CharacterSelectModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onStartMatch: () => void;
  onClose: () => void;
  initialSide?: 'p1' | 'p2';
  initialMode?: 'duel' | 'tournament';
  tournamentSize?: TournamentSize;
  tournamentRoster?: CharacterId[];
  tournamentPlayerChar?: CharacterId | null;
  onConfirmTournamentSetup?: (
    roster: CharacterId[],
    playerCharId: CharacterId | null,
    size: TournamentSize
  ) => void;
}

const PAGE_SIZE = 6; // 每個分頁 6 位角色

// 輔助函式：提取乾淨且無冗餘的特化名稱，例如「主坦 · 反傷 · 碰撞」
const getCleanSpecialization = (roleStr: string): string => {
  const match = roleStr.match(/（(.+)）/);
  if (match && match[1]) {
    return match[1].replace(/／/g, ' · ').replace(/\//g, ' · ');
  }
  return roleStr;
};

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  settings,
  onUpdateSettings,
  onStartMatch,
  onClose,
  initialSide = 'p1',
  initialMode = 'duel',
  tournamentSize = 8,
  tournamentRoster,
  tournamentPlayerChar,
  onConfirmTournamentSetup
}) => {
  const charactersList = Object.values(CHARACTERS);
  const [modalMode, setModalMode] = useState<'duel' | 'tournament'>(initialMode);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<RoleCategory | 'all'>('all');
  const [isRoleHandbookOpen, setIsRoleHandbookOpen] = useState<boolean>(false);
  const [handbookInitialRole, setHandbookInitialRole] = useState<RoleCategory>('tank');
  const [handbookInitialMode, setHandbookInitialMode] = useState<'roles' | 'mechanics' | 'patch'>('roles');

  // Tournament-specific state
  const [tourSize, setTourSize] = useState<TournamentSize>(tournamentSize || 8);
  const [tourRoster, setTourRoster] = useState<CharacterId[]>(() => {
    if (tournamentRoster && tournamentRoster.length > 0) {
      if (tournamentRoster.length === (tournamentSize || 8)) return [...tournamentRoster];
      if ((tournamentSize || 8) === 16) {
        const missing = ALL_CHAR_IDS.filter(id => !tournamentRoster.includes(id));
        return [...tournamentRoster, ...missing].slice(0, 16);
      }
      return tournamentRoster.slice(0, 8);
    }
    return ALL_CHAR_IDS.slice(0, tournamentSize || 8);
  });
  const [tourPlayerChar, setTourPlayerChar] = useState<CharacterId | null>(
    tournamentPlayerChar || settings.p1Char || 'oba'
  );
  const [activeTourSlot, setActiveTourSlot] = useState<number>(0);

  const filteredCharactersList = charactersList.filter(c => {
    if (selectedRoleFilter === 'all') return true;
    return c.primaryRole === selectedRoleFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCharactersList.length / PAGE_SIZE));
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedSide, setSelectedSide] = useState<'p1' | 'p2'>(initialSide);
  const [isStarting, setIsStarting] = useState(false);

  // Active champion depending on mode: in tournament mode it's the active tour slot's champion
  const activeCharId = modalMode === 'tournament'
    ? (tourRoster[activeTourSlot] || tourPlayerChar || settings.p1Char || 'oba')
    : (selectedSide === 'p1' ? settings.p1Char : settings.p2Char);
  const activeChar = CHARACTERS[activeCharId] || CHARACTERS.oba;

  // Safe clamped current page
  const safeCurrentPage = Math.min(Math.max(0, currentPage), Math.max(0, totalPages - 1));

  // Touch & Mouse swipe state
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const [isSwiping, setIsSwiping] = useState(false);

  // Keyboard navigation for left/right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  // Automatically ensure current page shows the active champion when side or champion changes
  useEffect(() => {
    const indexInFiltered = filteredCharactersList.findIndex(c => c.id === activeCharId);
    if (indexInFiltered >= 0) {
      const page = Math.floor(indexInFiltered / PAGE_SIZE);
      setCurrentPage(page);
    } else {
      // If hero is outside current role filter, clamp to first page
      setCurrentPage(0);
    }
  }, [selectedSide, activeCharId, selectedRoleFilter, modalMode, activeTourSlot]);

  const handleSelectCharacter = (id: CharacterId) => {
    soundEngine.playSelectHero();
    if (modalMode === 'tournament') {
      const newRoster = [...tourRoster];
      const existingIdx = newRoster.indexOf(id);
      if (existingIdx !== -1 && existingIdx !== activeTourSlot) {
        // Swap slots so every contender is unique!
        const prevAtSlot = newRoster[activeTourSlot];
        newRoster[activeTourSlot] = id;
        newRoster[existingIdx] = prevAtSlot;
      } else {
        newRoster[activeTourSlot] = id;
      }
      setTourRoster(newRoster);
      // If this slot was designated as player's champion, update player representative too
      if (tourPlayerChar && tourRoster[activeTourSlot] === tourPlayerChar) {
        setTourPlayerChar(id);
        onUpdateSettings({ ...settings, p1Char: id });
      }
    } else {
      if (selectedSide === 'p1') {
        onUpdateSettings({ ...settings, p1Char: id });
      } else {
        onUpdateSettings({ ...settings, p2Char: id });
      }
    }
  };

  const handleSelectTourSlot = (index: number) => {
    soundEngine.playSelectHero();
    setActiveTourSlot(index);
    const heroId = tourRoster[index];
    if (heroId) {
      const idxInList = filteredCharactersList.findIndex(c => c.id === heroId);
      if (idxInList >= 0) {
        setCurrentPage(Math.floor(idxInList / PAGE_SIZE));
      }
    }
  };

  const handleToggleTourSize = (newSize: TournamentSize) => {
    soundEngine.playSelectHero();
    setTourSize(newSize);
    if (newSize === 16) {
      const current = [...tourRoster];
      const missing = ALL_CHAR_IDS.filter(id => !current.includes(id));
      const expanded = [...current, ...missing].slice(0, 16);
      setTourRoster(expanded);
    } else {
      let trimmed = tourRoster.slice(0, 8);
      if (tourPlayerChar && !trimmed.includes(tourPlayerChar)) {
        trimmed[0] = tourPlayerChar;
      }
      setTourRoster(trimmed);
      if (activeTourSlot >= 8) setActiveTourSlot(0);
    }
  };

  const handleRandomizeTourRoster = () => {
    soundEngine.playSelectHero();
    let newRoster: CharacterId[];
    if (tourSize === 16) {
      newRoster = shuffleArray(ALL_CHAR_IDS);
    } else {
      const pool = ALL_CHAR_IDS.filter(id => id !== tourPlayerChar);
      const shuffled = shuffleArray(pool);
      if (tourPlayerChar) {
        newRoster = shuffleArray([tourPlayerChar, ...shuffled.slice(0, 7)]);
      } else {
        newRoster = shuffled.slice(0, 8);
      }
    }
    setTourRoster(newRoster);
  };

  const handleSetTourPlayerHero = (charId: CharacterId) => {
    soundEngine.playSelectHero();
    setTourPlayerChar(charId);
    onUpdateSettings({ ...settings, p1Char: charId });
  };

  const handleConfirmTournament = () => {
    soundEngine.playLockIn();
    if (onConfirmTournamentSetup) {
      onConfirmTournamentSetup(tourRoster, tourPlayerChar, tourSize);
    }
    onClose();
  };

  const handleToggleControl = (side: 'p1' | 'p2') => {
    soundEngine.playSelectHero();
    if (side === 'p1') {
      onUpdateSettings({
        ...settings,
        p1Control: settings.p1Control === 'auto' ? 'manual' : 'auto'
      });
    } else {
      onUpdateSettings({
        ...settings,
        p2Control: settings.p2Control === 'auto' ? 'manual' : 'auto'
      });
    }
  };

  const handlePrevPage = () => {
    if (totalPages <= 1) return;
    soundEngine.playSelectHero();
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    if (totalPages <= 1) return;
    soundEngine.playSelectHero();
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const diffY = e.touches[0].clientY - touchStartYRef.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - (touchStartYRef.current ?? touchEndY);
    const threshold = 40; // minimum swipe distance

    if (Math.abs(diffX) >= threshold && Math.abs(diffX) > Math.abs(diffY) * 1.4 && totalPages > 1) {
      if (diffX > 0) {
        handlePrevPage();
      } else {
        handleNextPage();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setIsSwiping(false);
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || touchStartXRef.current === null) return;
    const diffX = e.clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 15) {
      setIsSwiping(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || touchStartXRef.current === null) return;
    const diffX = e.clientX - touchStartXRef.current;
    const threshold = 40;

    if (Math.abs(diffX) >= threshold && totalPages > 1) {
      if (diffX > 0) {
        handlePrevPage();
      } else {
        handleNextPage();
      }
    }

    isMouseDownRef.current = false;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setIsSwiping(false);
  };

  const handleStartBattle = () => {
    soundEngine.playLockIn();
    setIsStarting(true);
    setTimeout(() => {
      onStartMatch();
    }, 300);
  };

  // Current page characters (slice 6 per page from filtered list)
  const currentChars = filteredCharactersList.slice(
    safeCurrentPage * PAGE_SIZE,
    (safeCurrentPage + 1) * PAGE_SIZE
  );

  const renderRoleIcon = (roleId?: RoleCategory, className = 'w-3 h-3') => {
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
      default:
        return <Swords className={className} />;
    }
  };

  const renderSkillIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Zap':
        return <Zap className={className} />;
      case 'FastForward':
        return <FastForward className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Bomb':
        return <Bomb className={className} />;
      case 'Wand2':
        return <Wand2 className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Orbit':
        return <Orbit className={className} />;
      case 'CircleDot':
        return <CircleDot className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Copy':
        return <Copy className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Diamond':
        return <Diamond className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Sword':
        return <Sword className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'Ghost':
        return <Ghost className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Skull':
        return <Skull className={className} />;
      case 'Gift':
        return <Gift className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      default:
        return <Zap className={className} />;
    }
  };

  const handleRandomPick = (side: 'p1' | 'p2' | 'both') => {
    soundEngine.playSelectHero();
    const ids = Object.keys(CHARACTERS) as CharacterId[];
    if (side === 'p1') {
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      onUpdateSettings({ ...settings, p1Char: randomId });
      if (selectedRoleFilter !== 'all' && CHARACTERS[randomId]?.primaryRole !== selectedRoleFilter) {
        setSelectedRoleFilter('all');
      }
    } else if (side === 'p2') {
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      onUpdateSettings({ ...settings, p2Char: randomId });
      if (selectedRoleFilter !== 'all' && CHARACTERS[randomId]?.primaryRole !== selectedRoleFilter) {
        setSelectedRoleFilter('all');
      }
    } else {
      const r1 = ids[Math.floor(Math.random() * ids.length)];
      let r2 = ids[Math.floor(Math.random() * ids.length)];
      if (ids.length > 1 && r1 === r2) {
        const remaining = ids.filter(id => id !== r1);
        r2 = remaining[Math.floor(Math.random() * remaining.length)];
      }
      onUpdateSettings({ ...settings, p1Char: r1, p2Char: r2 });
      setSelectedRoleFilter('all');
    }
  };

  const handleMirrorMatch = () => {
    soundEngine.playSelectHero();
    if (selectedSide === 'p1') {
      onUpdateSettings({ ...settings, p2Char: settings.p1Char });
    } else {
      onUpdateSettings({ ...settings, p1Char: settings.p2Char });
    }
  };

  const getPassiveCooldownBadge = (charId: CharacterId, index: number) => {
    switch (charId) {
      case 'oba':
        return index === 0 ? '【常駐加成】' : index === 1 ? '【受擊即時反彈】' : index === 2 ? '【3次碰撞重擊】' : '【破陣衝鋒 8sCD】';
      case 'huotong':
        return index === 0 ? '【常駐受擊反彈】' : index === 1 ? '【時速>200啟動】' : index === 2 ? '【強撞反彈蓄力】' : '【熔火爆步 10sCD】';
      case 'hailaise':
        return index === 0 ? '【受傷轉換能量】' : index === 1 ? '【冷卻週期 7 秒】' : index === 2 ? '【殘血<25% 限1次】' : '【潮汐重壓 9sCD】';
      case 'lingyinsi':
        return index === 0 ? '【冷卻週期 5 秒】' : index === 1 ? '【冷卻週期 25 秒】' : index === 2 ? '【冷卻週期 25 秒】' : '【殘影步法 7sCD】';
      case 'chanshi':
        return index === 0 ? '【冷卻週期 8 秒】' : index === 1 ? '【受擊反彈+霸體】' : index === 2 ? '【瀕死<30% 限1次】' : '【菩提金鐘 12sCD】';
      case 'huangzuan':
        return index === 0 ? '【冷卻週期 5 秒】' : index === 1 ? '【每2s疊速/撞擊重置】' : index === 2 ? '【冷卻週期 30 秒】' : '【金晶破甲 6sCD】';
      case 'lanzuan':
        return index === 0 ? '【常駐光環擴散】' : index === 1 ? '【3HP光球/20sCD】' : index === 2 ? '【冷卻週期 40 秒】' : '【蒼藍冰鏡 10sCD】';
      case 'fenzuan':
        return index === 0 ? '【冷卻週期 5 秒】' : index === 1 ? '【冷卻週期 15 秒】' : index === 2 ? '【冷卻週期 30 秒】' : '【治癒晶芒 12sCD】';
      case 'baizuan':
        return index === 0 ? '【鏡像分身 14sCD】' : index === 1 ? '【閃耀定身 15sCD】' : index === 2 ? '【白色死光 40sCD】' : '【折射刺殺 5.5sCD】';
      case 'xukongshou':
        return index === 0 ? '【撕咬無敵 3s】' : index === 1 ? '【空間傳送+困敵 2s】' : index === 2 ? '【鎖定刺殺 25sCD】' : '【虛空潛行 8.5sCD】';
      case 'fan':
        return index === 0 ? '【自動射箭+三印真傷】' : index === 1 ? '【翻滾位移+加速】' : index === 2 ? '【超速強化 11sCD】' : '【弱點洞察 常駐】';
      case 'tunshimozu':
        return index === 0 ? '【接觸吸收能量碎片】' : index === 1 ? '【每10層屬性成長】' : index === 2 ? '【受撞30%魔爆 6sCD】' : '【魔能硬皮 抵傷震退】';
      case 'mimi':
        return index === 0 ? '【撲爪免撞+流血 1.2s】' : index === 1 ? '【愛心魅惑 11sCD】' : index === 2 ? '【雙包成長 18s週期】' : '【貓咪九命 瀕死保底】';
      case 'jiandaoshou':
        return index === 0 ? '【剪裁生命+吸血 1.6s】' : index === 1 ? '【聖霧領域 無敵4.5s】' : index === 2 ? '【聖針連射 6.5sCD】' : '【縫合收線 6sCD】';
      case 'dina':
        return index === 0 ? '【白光射擊 0.7sCD】' : index === 1 ? '【暗光爆轟 融合窗口】' : index === 2 ? '【三相融合/核心拉扯】' : '【極光共鳴帶 5sCD】';
      case 'jianxian':
        return index === 0 ? '【白劍爆裂 2.5sCD】' : index === 1 ? '【凌波退步 4.8sCD】' : index === 2 ? '【百萬劍陣 15sCD】' : '【萬劍歸宗 6.0sCD】';
      case 'longshen':
        return index === 0 ? '【神速俯衝 5.8sCD】' : index === 1 ? '【雙重裂爪 3.2sCD】' : index === 2 ? '【滅世龍息 9.5sCD】' : '【真龍降世 24sCD】';
      case 'zhizhu':
        return index === 0 ? '【毒牙突刺 4.8sCD】' : index === 1 ? '【獵網束縛 8.0sCD】' : index === 2 ? '【蛛群獵殺 16sCD】' : '【蛛后毒爆 27sCD】';
      case 'xin':
        return index === 0 ? '【雙相劍氣 1.4sCD】' : index === 1 ? '【逐影破陣 6.5sCD】' : index === 2 ? '【裂空劍痕 11sCD】' : '【雙相魔劍 Lv.1~6】';
      default:
        return '【被動技能】';
    }
  };

  // Helper to split badgeText into compact cooldown tag and clean effect highlight
  const getPassiveBadgeInfo = (passive: PassiveSkill, charId: CharacterId, index: number) => {
    let cdTag = '';
    let effectTag = '';
    if (passive.badgeText) {
      if (passive.badgeText.includes('·')) {
        const parts = passive.badgeText.split('·');
        cdTag = parts[0].trim();
        effectTag = parts.slice(1).join('·').trim();
      } else {
        cdTag = passive.badgeText.trim();
      }
    }
    if (!cdTag) {
      cdTag = getPassiveCooldownBadge(charId, index);
    }
    return { cdTag, effectTag };
  };

  return (
    <div
      translate="no"
      className="notranslate fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md flex items-center justify-center min-h-full animate-in fade-in duration-200"
    >
      {/* Responsive Modal Container */}
      <div
        id="character-select-mobile-container"
        className={`relative w-full max-w-xl sm:max-w-2xl max-h-[94vh] flex flex-col bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto transition-all duration-200 ${
          isStarting ? 'scale-[0.98] brightness-110' : ''
        }`}
      >
        {/* Mode Switcher Tabs (Duel 1v1 vs Tournament Knockout) */}
        <div className="px-3 sm:px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              id="tab-mode-duel"
              onClick={() => {
                soundEngine.playSelectHero();
                setModalMode('duel');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                modalMode === 'duel'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>1v1 單挑配置</span>
            </button>
            <button
              id="tab-mode-tournament"
              onClick={() => {
                soundEngine.playSelectHero();
                setModalMode('tournament');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                modalMode === 'tournament'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>錦標淘汰賽席位 ({tourSize}強)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-open-balance-patch"
              onClick={() => {
                soundEngine.playSelectHero();
                setHandbookInitialRole(activeChar.primaryRole || 'tank');
                setHandbookInitialMode('patch');
                setIsRoleHandbookOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 hover:text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
              title="查看 v2.6 全英雄傷害與冷卻平衡調整公告"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">平衡公告</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-200 font-mono">
                v2.6
              </span>
            </button>

            <button
              id="btn-open-handbook"
              onClick={() => {
                soundEngine.playSelectHero();
                setHandbookInitialRole(activeChar.primaryRole || 'tank');
                setHandbookInitialMode('mechanics');
                setIsRoleHandbookOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-600/60 text-amber-300 hover:text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
              title="查看技能優先順序與機制圖鑑百科"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">機制圖鑑</span>
            </button>

            <button
              id="btn-close-char-select"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Mode Sub-Header Bar */}
        {modalMode === 'duel' ? (
          /* Duel Mode: Player / Opponent Side Selector Tab with Hero Thumbnails & Quick Actions */
          <div className="px-3 sm:px-4 py-2 bg-slate-950/70 border-b border-slate-800/90 flex items-center gap-2 shrink-0">
            {/* P1 Select Tab */}
            <button
              id="tab-select-p1"
              onClick={() => setSelectedSide('p1')}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer min-w-0 ${
                selectedSide === 'p1'
                  ? 'bg-blue-950/80 border-blue-500 text-blue-100 ring-2 ring-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="relative shrink-0">
                <ChampionAvatarCanvas characterId={settings.p1Char} size={30} />
                <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded text-[7.5px] font-black bg-blue-600 text-white ring-1 ring-white/30">
                  我方
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate font-black text-slate-100 text-xs">{CHARACTERS[settings.p1Char]?.name}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleControl('p1');
                    }}
                    className={`px-1 py-0.2 rounded text-[8.5px] font-bold border transition-all flex items-center gap-0.5 cursor-pointer shrink-0 ${
                      settings.p1Control === 'manual'
                        ? 'bg-sky-950/90 text-sky-300 border-sky-600/80 hover:bg-sky-900'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900'
                    }`}
                    title="點擊切換我方控制 (手動 / 自動AI)"
                  >
                    {settings.p1Control === 'manual' ? (
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" />
                        <span>手動</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5" />
                        <span>AI</span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0 mt-0.5">
                  {CHARACTERS[settings.p1Char]?.primaryRole && (
                    <span
                      className="text-[8.5px] px-1 py-0.2 rounded font-black border shrink-0"
                      style={{
                        backgroundColor: `${ROLE_TAXONOMY[CHARACTERS[settings.p1Char].primaryRole!].themeColor}20`,
                        borderColor: `${ROLE_TAXONOMY[CHARACTERS[settings.p1Char].primaryRole!].themeColor}60`,
                        color: ROLE_TAXONOMY[CHARACTERS[settings.p1Char].primaryRole!].themeColor
                      }}
                    >
                      {CHARACTERS[settings.p1Char].primaryRoleName}
                    </span>
                  )}
                  <MarqueeText
                    containerClassName="min-w-0 flex-1"
                    className="text-[9.5px] text-blue-200/90 font-medium"
                  >
                    {CHARACTERS[settings.p1Char]?.role}
                  </MarqueeText>
                </div>
              </div>
            </button>

            {/* VS Divider & Quick Matchup Actions */}
            <div className="flex flex-col items-center gap-1 shrink-0 px-0.5">
              <span className="text-[10px] font-black font-mono text-slate-500">VS</span>
              <div className="flex items-center gap-1">
                <button
                  id="btn-random-pick"
                  onClick={() => handleRandomPick(selectedSide)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95"
                  title={`隨機切換${selectedSide === 'p1' ? '我方' : '對手'}英雄`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-mirror-match"
                  onClick={handleMirrorMatch}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 transition-all cursor-pointer active:scale-95"
                  title="鏡像對決 (雙方選用相同英雄)"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* P2 Select Tab */}
            <button
              id="tab-select-p2"
              onClick={() => setSelectedSide('p2')}
              className={`flex-1 py-1.5 px-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer min-w-0 ${
                selectedSide === 'p2'
                  ? 'bg-red-950/80 border-red-500 text-red-100 ring-2 ring-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="relative shrink-0">
                <ChampionAvatarCanvas characterId={settings.p2Char} size={30} />
                <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded text-[7.5px] font-black bg-red-600 text-white ring-1 ring-white/30">
                  對手
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate font-black text-slate-100 text-xs">{CHARACTERS[settings.p2Char]?.name}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleControl('p2');
                    }}
                    className={`px-1 py-0.2 rounded text-[8.5px] font-bold border transition-all flex items-center gap-0.5 cursor-pointer shrink-0 ${
                      settings.p2Control === 'manual'
                        ? 'bg-sky-950/90 text-sky-300 border-sky-600/80 hover:bg-sky-900'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900'
                    }`}
                    title="點擊切換對手控制 (手動 / 自動AI)"
                  >
                    {settings.p2Control === 'manual' ? (
                      <span className="flex items-center gap-0.5">
                        <User className="w-2.5 h-2.5" />
                        <span>手動</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5" />
                        <span>AI</span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0 mt-0.5">
                  {CHARACTERS[settings.p2Char]?.primaryRole && (
                    <span
                      className="text-[8.5px] px-1 py-0.2 rounded font-black border shrink-0"
                      style={{
                        backgroundColor: `${ROLE_TAXONOMY[CHARACTERS[settings.p2Char].primaryRole!].themeColor}20`,
                        borderColor: `${ROLE_TAXONOMY[CHARACTERS[settings.p2Char].primaryRole!].themeColor}60`,
                        color: ROLE_TAXONOMY[CHARACTERS[settings.p2Char].primaryRole!].themeColor
                      }}
                    >
                      {CHARACTERS[settings.p2Char].primaryRoleName}
                    </span>
                  )}
                  <MarqueeText
                    containerClassName="min-w-0 flex-1"
                    className="text-[9.5px] text-red-200/90 font-medium"
                  >
                    {CHARACTERS[settings.p2Char]?.role}
                  </MarqueeText>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Tournament Mode: Seed Roster Visual Strip & Controls */
          <div className="px-3 sm:px-4 py-2.5 bg-slate-950/90 border-b border-amber-500/30 space-y-2 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* Bracket Size Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>淘汰賽制:</span>
                </span>
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => handleToggleTourSize(8)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      tourSize === 8
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    8 強賽
                  </button>
                  <button
                    onClick={() => handleToggleTourSize(16)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      tourSize === 16
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    16 強賽
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomizeTourRoster}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  title="隨機洗牌種子席位"
                >
                  <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                  <span>隨機洗牌</span>
                </button>
                <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
                  <span>點選席位切換英雄</span>
                </div>
              </div>
            </div>

            {/* Visual Seed Slots Horizontal Scroll Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
              {tourRoster.map((charId, idx) => {
                const char = CHARACTERS[charId];
                const isActive = activeTourSlot === idx;
                const isPlayer = tourPlayerChar === charId;

                return (
                  <div
                    key={`tour-slot-${idx}`}
                    onClick={() => handleSelectTourSlot(idx)}
                    className={`relative p-1.5 rounded-xl border flex flex-col items-center shrink-0 w-20 transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Seed Number Badge */}
                    <div className="flex items-center justify-between w-full text-[9px] font-mono mb-1">
                      <span className={`font-black px-1 rounded ${isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        #{idx + 1}
                      </span>
                      {isPlayer && (
                        <span className="p-0.5 rounded bg-amber-400/20 text-amber-300" title="玩家代表英雄">
                          <Crown className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        </span>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 mb-1">
                      <ChampionAvatarCanvas characterId={charId} size={32} />
                    </div>

                    <span className="text-[10.5px] font-black text-slate-100 truncate w-full text-center">
                      {char?.name}
                    </span>

                    {/* Quick Button to set as player */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetTourPlayerHero(charId);
                      }}
                      className={`mt-1 w-full py-0.5 rounded text-[8px] font-bold border transition-colors flex items-center justify-center gap-0.5 cursor-pointer ${
                        isPlayer
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-800/80 hover:bg-slate-750 text-slate-400 border-slate-700'
                      }`}
                      title={isPlayer ? '目前為你的代表英雄' : '設為你的代表英雄'}
                    >
                      <Crown className={`w-2 h-2 ${isPlayer ? 'fill-slate-950' : ''}`} />
                      <span>{isPlayer ? '代表' : '設代表'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y px-3 sm:px-4 py-3 space-y-4">
          {/* 1. 角色列表 (Paginated 6 Characters per page with left/right swipe and buttons) */}
          <div>
            {/* 職業分類滑動表 (Role Filter Slider) */}
            <div className="relative w-full mb-2.5">
              <div
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 touch-pan-x"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <button
                  id="filter-role-all"
                  onClick={() => {
                    soundEngine.playSelectHero();
                    setSelectedRoleFilter('all');
                    setCurrentPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    selectedRoleFilter === 'all'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-1 ring-white/30'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  全部 ({charactersList.length})
                </button>

                {(['tank', 'warrior', 'assassin', 'marksman', 'mage', 'support'] as RoleCategory[]).map(roleKey => {
                  const info = ROLE_TAXONOMY[roleKey];
                  const count = charactersList.filter(c => c.primaryRole === roleKey).length;
                  const isActive = selectedRoleFilter === roleKey;
                  return (
                    <button
                      key={roleKey}
                      id={`filter-role-${roleKey}`}
                      onClick={() => {
                        soundEngine.playSelectHero();
                        if (isActive) {
                          setSelectedRoleFilter('all');
                        } else {
                          setSelectedRoleFilter(roleKey);
                        }
                        setCurrentPage(0);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'text-white shadow-md ring-1 ring-white/30'
                          : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      style={isActive ? { backgroundColor: info.themeColor } : {}}
                    >
                      {renderRoleIcon(roleKey, 'w-3.5 h-3.5')}
                      <span>{info.name}</span>
                      <span className="text-[10px] opacity-80 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <div className="flex items-center gap-1.5">
                <span>英雄列表</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedRoleFilter === 'all'
                    ? `共 ${charactersList.length} 位角色`
                    : `${ROLE_TAXONOMY[selectedRoleFilter]?.name}共 ${filteredCharactersList.length} 位`}
                </span>
                {selectedRoleFilter !== 'all' && (
                  <button
                    onClick={() => {
                      soundEngine.playSelectHero();
                      setSelectedRoleFilter('all');
                      setCurrentPage(0);
                    }}
                    className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                  >
                    (清除)
                  </button>
                )}
              </div>

              {/* Pagination Controls 《 》 */}
              <div className="flex items-center gap-1 bg-slate-950/90 px-1.5 py-0.5 rounded-lg border border-slate-800">
                <button
                  id="btn-page-prev"
                  onClick={handlePrevPage}
                  disabled={totalPages <= 1}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors font-black text-xs ${
                    totalPages <= 1
                      ? 'text-slate-600 opacity-40 cursor-not-allowed pointer-events-none'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer active:scale-95'
                  }`}
                  title="上一頁"
                >
                  《
                </button>

                <span className="text-[11px] font-mono font-bold text-sky-400 px-1 select-none">
                  第 {safeCurrentPage + 1} / {totalPages} 頁
                </span>

                <button
                  id="btn-page-next"
                  onClick={handleNextPage}
                  disabled={totalPages <= 1}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors font-black text-xs ${
                    totalPages <= 1
                      ? 'text-slate-600 opacity-40 cursor-not-allowed pointer-events-none'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer active:scale-95'
                  }`}
                  title="下一頁"
                >
                  》
                </button>
              </div>
            </div>

            {/* Swipeable Grid Container */}
            <div
              id="character-select-paginated-container"
              className="relative touch-pan-y cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* 6-Character Grid per page (2 rows x 3 columns) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 min-h-[210px] transition-all duration-200">
                {currentChars.map((char) => {
                  const isSelected = activeCharId === char.id;
                  const isP1Using = modalMode === 'duel' && settings.p1Char === char.id;
                  const isP2Using = modalMode === 'duel' && settings.p2Char === char.id;
                  const roleInfo = char.primaryRole ? ROLE_TAXONOMY[char.primaryRole] : null;

                  // Tournament attributes
                  const tourSlotIdx = modalMode === 'tournament' ? tourRoster.indexOf(char.id) : -1;
                  const isTourPlayer = modalMode === 'tournament' && tourPlayerChar === char.id;
                  const isAtActiveTourSlot = modalMode === 'tournament' && tourRoster[activeTourSlot] === char.id;

                  return (
                    <button
                      key={char.id}
                      id={`btn-char-${char.id}`}
                      onClick={() => handleSelectCharacter(char.id)}
                      className={`relative p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                        isSelected || isAtActiveTourSlot
                          ? 'bg-slate-800/90 border-sky-400 ring-2 ring-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.35)]'
                          : 'bg-slate-950/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Consistent Champion Sphere Canvas */}
                      <div className="relative mb-1">
                        <ChampionAvatarCanvas characterId={char.id} size={50} />
                        {/* Active Player Badges */}
                        {isP1Using && (
                          <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded text-[8px] font-black bg-blue-600 text-white shadow ring-1 ring-white/30">
                            P1
                          </span>
                        )}
                        {isP2Using && (
                          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded text-[8px] font-black bg-red-600 text-white shadow ring-1 ring-white/30">
                            P2
                          </span>
                        )}

                        {/* Tournament seed and player representative badges */}
                        {modalMode === 'tournament' && tourSlotIdx !== -1 && (
                          <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded text-[8px] font-mono font-black bg-amber-500 text-slate-950 shadow ring-1 ring-white/30">
                            #{tourSlotIdx + 1}
                          </span>
                        )}
                        {modalMode === 'tournament' && isTourPlayer && (
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded text-[7.5px] font-black bg-amber-400 text-slate-950 shadow ring-1 ring-amber-300 flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5 fill-slate-950" />
                            代表
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-slate-100 truncate w-full">
                        {char.name}
                      </div>
                      
                      {/* Primary Role & Subclass indication */}
                      <div className="flex items-center justify-center gap-1 w-full mt-0.5">
                        {roleInfo && (
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded font-black border flex items-center gap-0.5 shrink-0"
                            style={{
                              backgroundColor: `${roleInfo.themeColor}20`,
                              borderColor: `${roleInfo.themeColor}60`,
                              color: roleInfo.themeColor
                            }}
                          >
                            {renderRoleIcon(char.primaryRole, 'w-2.5 h-2.5')}
                            <span>{roleInfo.name}</span>
                          </span>
                        )}
                      </div>

                      {/* Clean specialization instead of redundant repeat of role name */}
                      <div className="w-full mt-0.5 overflow-hidden">
                        <MarqueeText
                          containerClassName="w-full justify-center"
                          className="text-[9.5px] text-slate-300/90 font-medium"
                        >
                          {getCleanSpecialization(char.role)}
                        </MarqueeText>
                      </div>

                      {modalMode === 'tournament' ? (
                        <div className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-amber-400">
                          {tourSlotIdx !== -1 ? (
                            <span>席位 #{tourSlotIdx + 1} 參賽</span>
                          ) : (
                            <span className="text-slate-500">點擊填入席位</span>
                          )}
                        </div>
                      ) : (
                        isSelected && (
                          <div className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-sky-400">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>已選</span>
                          </div>
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Swipe hint & Indicator Dots */}
              <div className="flex items-center justify-between mt-2 pt-1 px-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  {totalPages > 1 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sky-400 font-bold">左右滑動《 》</span>
                      <span>切換每頁 6 位英雄</span>
                    </div>
                  ) : (
                    <span>目前共 {filteredCharactersList.length} 位英雄</span>
                  )}
                </div>

                {/* Page Indicator Dots */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEngine.playSelectHero();
                          setCurrentPage(idx);
                        }}
                        className={`transition-all rounded-full cursor-pointer p-0.5 ${
                          safeCurrentPage === idx
                            ? 'w-4 h-1.5 bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]'
                            : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={`第 ${idx + 1} 頁`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. 選中角色詳細資訊 (Normal sized, clean & non-bloated) */}
          <div
            key={activeChar.id}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 transition-opacity duration-200 animate-in fade-in"
          >
            {/* Header: Name, Title & Role */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl bg-slate-900/90 border flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: `${activeChar.accentColor}70`,
                    boxShadow: `0 0 18px ${activeChar.accentColor}30`
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${activeChar.accentColor}, transparent 70%)`
                    }}
                  />
                  <ChampionAvatarCanvas characterId={activeChar.id} size={50} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-100 tracking-wide">
                      {activeChar.name}
                    </h3>

                    {/* Primary Role Badge (Clickable to open Handbook) */}
                    {activeChar.primaryRole && (
                      <button
                        onClick={() => {
                          soundEngine.playSelectHero();
                          setHandbookInitialRole(activeChar.primaryRole!);
                          setIsRoleHandbookOpen(true);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md font-black border flex items-center gap-1 transition-all hover:scale-105 cursor-pointer shadow-sm"
                        style={{
                          backgroundColor: `${ROLE_TAXONOMY[activeChar.primaryRole].themeColor}25`,
                          borderColor: `${ROLE_TAXONOMY[activeChar.primaryRole].themeColor}80`,
                          color: ROLE_TAXONOMY[activeChar.primaryRole].themeColor
                        }}
                        title="點擊查看此主定位判定標準"
                      >
                        {renderRoleIcon(activeChar.primaryRole, 'w-3 h-3')}
                        <span>【{activeChar.primaryRoleName}】</span>
                      </button>
                    )}

                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-bold border"
                      style={{
                        backgroundColor: `${activeChar.accentColor}20`,
                        borderColor: `${activeChar.accentColor}60`,
                        color: activeChar.accentColor
                      }}
                    >
                      專精：{getCleanSpecialization(activeChar.role)}
                    </span>
                  </div>

                  {/* Sub-classes badges */}
                  {activeChar.subClasses && activeChar.subClasses.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <span className="text-[10px] text-slate-400 font-bold">符合子類：</span>
                      {activeChar.subClasses.map(subClass => (
                        <button
                          key={subClass}
                          onClick={() => {
                            soundEngine.playSelectHero();
                            if (activeChar.primaryRole) {
                              setHandbookInitialRole(activeChar.primaryRole);
                            }
                            setIsRoleHandbookOpen(true);
                          }}
                          className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-sky-300 hover:border-sky-500/80 transition-colors cursor-pointer"
                          title={`查看「${subClass}」判定標準`}
                        >
                          {subClass}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    {activeChar.title}
                  </p>
                </div>
              </div>

              {/* Quick AI / Manual Control Switch */}
              <button
                id="btn-toggle-control-mode"
                onClick={() => handleToggleControl(selectedSide)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-[11px] font-bold text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="切換操控方式"
              >
                {(selectedSide === 'p1' ? settings.p1Control : settings.p2Control) === 'manual' ? (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-sky-400" />
                    <span>手動操控</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Bot className="w-3 h-3 text-emerald-400" />
                    <span>自動 AI</span>
                  </span>
                )}
              </button>
            </div>

            {/* 基本數值 (生命值、速度、體積、質量) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                  <Activity className="w-2.5 h-2.5 text-rose-400" />
                  <span>生命</span>
                </div>
                <div className="text-xs font-bold text-slate-100 mt-0.5">
                  {activeChar.maxHp}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                  <FastForward className="w-2.5 h-2.5 text-sky-400" />
                  <span>速度</span>
                </div>
                <div className="text-xs font-bold text-sky-300 mt-0.5">
                  {Math.round(activeChar.speedRatio * 100)}%
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                  <Maximize2 className="w-2.5 h-2.5 text-amber-400" />
                  <span>體積</span>
                </div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">
                  {activeChar.size}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
                  <Weight className="w-2.5 h-2.5 text-emerald-400" />
                  <span>質量</span>
                </div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">
                  {activeChar.mass}
                </div>
              </div>
            </div>

            {/* 碰撞傷害規範提示 (射手與法師固定為 0) */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Swords className="w-3 h-3 text-sky-400" />
                <span>基礎碰撞傷害：</span>
              </span>
              <span
                className={`font-black ${
                  activeChar.attackDamage === 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {activeChar.attackDamage === 0
                  ? '0（零碰撞傷害・全技能輸出）'
                  : `${activeChar.attackDamage} 點物理撞擊`}
              </span>
            </div>

            {/* 4個被動技能 (自動觸發，無主動技能) */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>4 大被動技能 (自動觸發與被動特性)</span>
              </div>

              <div className="space-y-1.5">
                {activeChar.passives.map((passive, index) => (
                  <div
                    key={`${activeChar.id}-${passive.id}`}
                    className={`p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-start gap-2.5 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 ${
                      index === 0 ? 'wave-flow-in-1' : index === 1 ? 'wave-flow-in-2' : index === 2 ? 'wave-flow-in-3' : 'wave-flow-in-4'
                    }`}
                  >
                    {/* Subtle Holo Accent Top Border */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${activeChar.accentColor}, transparent)`
                      }}
                    />

                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-inner mt-0.5"
                      style={{
                        backgroundColor: `${activeChar.accentColor}18`,
                        borderColor: `${activeChar.accentColor}50`,
                        color: activeChar.accentColor
                      }}
                    >
                      {renderSkillIcon(passive.iconName, 'w-4 h-4')}
                    </div>

                    <div className="flex-1 min-w-0">
                      {(() => {
                        const badgeInfo = getPassiveBadgeInfo(passive, activeChar.id, index);
                        return (
                          <>
                            {/* Skill Header: Unrestricted Title & Compact Cooldown Tag */}
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs sm:text-[13px] font-black text-slate-100 whitespace-nowrap">
                                  被動{['一', '二', '三', '四'][index]} · {passive.name}
                                </span>
                                {passive.energyCost ? (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono font-bold">
                                    {passive.energyCost}⚡
                                  </span>
                                ) : null}
                              </div>

                              {/* Clean, Non-blocking Cooldown / Trigger Badge */}
                              <div className="flex items-center gap-1 shrink-0">
                                <span
                                  className="text-[9px] px-2 py-0.5 rounded font-mono font-bold border whitespace-nowrap"
                                  style={{
                                    backgroundColor: `${activeChar.accentColor}18`,
                                    borderColor: `${activeChar.accentColor}50`,
                                    color: activeChar.accentColor
                                  }}
                                >
                                  {badgeInfo.cdTag}
                                </span>
                              </div>
                            </div>

                            {/* Combat Effect Spec Tag (if available) - displayed on its own neat line */}
                            {badgeInfo.effectTag && (
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-300/95 font-mono font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                <span className="break-words leading-tight">{badgeInfo.effectTag}</span>
                              </div>
                            )}

                            {/* Upgraded Flowing Skill Description with Smart Keyword Highlighting */}
                            <FlowingSkillDescription
                              text={passive.description}
                              accentColor={activeChar.accentColor}
                              waveIndex={index}
                              isShimmering={false}
                              className="mt-1.5"
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 開始對戰 / 確認淘汰賽陣容 (Bottom Sticky Action Bar) */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col gap-2">
          {modalMode === 'tournament' ? (
            <div className="space-y-2">
              <button
                id="btn-confirm-tournament-roster"
                onClick={handleConfirmTournament}
                className="relative overflow-hidden w-full py-3 sm:py-3.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-amber-500/25 border border-amber-300/40 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer group select-none"
              >
                <div className="energy-beam-flow pointer-events-none z-0 opacity-25" />
                <Trophy className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12 drop-shadow-sm shrink-0 fill-slate-950" />
                <span className="relative z-10 whitespace-nowrap drop-shadow-sm">
                  確認並生成 {tourSize} 強淘汰賽程樹
                </span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>玩家代表英雄：{tourPlayerChar ? CHARACTERS[tourPlayerChar]?.name : '未指定'}</span>
                </span>
                <span className="text-amber-400 font-mono font-bold">已就緒 {tourRoster.length}/{tourSize} 席位</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                id="btn-start-battle-main"
                onClick={handleStartBattle}
                className="relative overflow-hidden w-full py-3 sm:py-3.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer group select-none"
              >
                <div className="energy-beam-flow pointer-events-none z-0 opacity-20" />
                <Swords className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12 drop-shadow-sm shrink-0" />
                <span className="relative z-10 whitespace-nowrap drop-shadow-sm">開始對戰 (1 VS 1 即時競技)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="truncate">我方：{CHARACTERS[settings.p1Char]?.name}</span>
                <span className="text-slate-500 font-mono px-1">VS</span>
                <span className="truncate">對手：{CHARACTERS[settings.p2Char]?.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Taxonomy & Criteria Handbook Modal */}
      <RoleClassificationModal
        isOpen={isRoleHandbookOpen}
        onClose={() => setIsRoleHandbookOpen(false)}
        initialRole={handbookInitialRole}
        initialMode={handbookInitialMode}
        onSelectCharacter={id => {
          handleSelectCharacter(id as CharacterId);
        }}
      />
    </div>
  );
};

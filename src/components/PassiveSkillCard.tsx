import React from 'react';
import { BallState, PassiveSkill } from '../types/game';
import { FlowingSkillDescription } from './FlowingSkillDescription';
import {
  Zap,
  FastForward,
  Flame,
  ShieldAlert,
  Sparkles,
  Bomb,
  Wand2,
  Layers,
  Orbit,
  CircleDot,
  Shield,
  Copy,
  Sun,
  Diamond,
  Skull,
  Eye,
  Target,
  LucideIcon,
  Clock,
  Check,
  Wind,
  Swords,
  ShieldCheck,
  Crosshair,
  Activity,
  Scissors,
  Heart,
  Moon,
  Gift,
  Sword,
  RotateCcw,
  TrendingUp,
  Boxes,
  Share2
} from 'lucide-react';

interface PassiveSkillCardProps {
  skill: PassiveSkill;
  ball: BallState;
  index: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  FastForward,
  Flame,
  ShieldAlert,
  Sparkles,
  Bomb,
  Wand2,
  Layers,
  Orbit,
  CircleDot,
  Shield,
  Copy,
  Sun,
  Diamond,
  Skull,
  Eye,
  Target,
  Scissors,
  Crosshair,
  Heart,
  Moon,
  Gift,
  Sword,
  Swords,
  Wind,
  RotateCcw,
  TrendingUp,
  Boxes,
  Share2
};

export const PassiveSkillCard: React.FC<PassiveSkillCardProps> = ({ skill, ball, index }) => {
  const IconComponent = ICON_MAP[skill.iconName] || Zap;
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
  const isJiandaoshou = ball.characterId === 'jiandaoshou';
  const isTunshimozu = ball.characterId === 'tunshimozu';
  const isMimi = ball.characterId === 'mimi';
  const isDina = ball.characterId === 'dina';
  const isJianxian = ball.characterId === 'jianxian';
  const isLongshen = ball.characterId === 'longshen';
  const isZhizhu = ball.characterId === 'zhizhu';
  const isXin = ball.characterId === 'xin';
  const isKuileishi = ball.characterId === 'kuileishi';
  const isYinyong = ball.characterId === 'yinyong';

  // Calculate real-time speed & progress for each skill
  const currentSpeed = Math.hypot(ball.vx, ball.vy);
  let isActive = false;
  let progress = 0; // 0 to 1 (0% to 100%)
  let statusBadge = '';
  let progressText = '';
  let ringColor = '#3b82f6';
  let triggerCount = 0;
  let cooldownPeriodText = '常駐技能';
  let BarStateIcon: LucideIcon = Sparkles;
  let barStateLabel = '常駐生效';
  let barValueDetail = '';

  if (index === 0) {
    triggerCount = ball.passive1Triggers;
    if (isOba) {
      statusBadge = '每次撞擊常駐';
      isActive = true;
      progress = 1.0;
      progressText = '常駐';
      ringColor = '#3b82f6'; // Cobalt Blue
      cooldownPeriodText = '碰撞即時生效';
      BarStateIcon = Sparkles;
      barStateLabel = '常駐加成生效中';
      barValueDetail = '碰撞傷害固定提升 25% (22 → 27.5)';
    } else if (isHuotong) {
      const cd = ball.huotongFlameShellCooldown ?? 0;
      progress = cd > 0 ? Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0)) : 1.0;
      isActive = cd <= 0.2;
      statusBadge = cd > 0.2 ? `外殼冷卻 (${cd.toFixed(1)}s)` : ball.flameShellTriggered ? '反彈灼燒中 (5火傷)' : '受擊反彈 5火傷 (就緒)';
      progressText = cd > 0.2 ? `${cd.toFixed(1)}s` : 'READY';
      ringColor = cd <= 0.2 ? '#ef4444' : '#7f1d1d';
      cooldownPeriodText = '冷卻週期: 4.0 秒 (受擊自動反彈)';
      BarStateIcon = cd > 0.2 ? Clock : ball.flameShellTriggered ? Flame : Shield;
      barStateLabel = cd > 0.2 ? '火焰外殼充能冷卻中' : ball.flameShellTriggered ? '火焰反彈灼燒命中' : '火焰外殼防護就緒';
      barValueDetail = cd > 0.2 ? `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.0 秒` : '受敵方碰撞消耗 15 能量自動反彈 5 點固定火傷';
    } else if (isHailaise) {
      const energy = ball.magicEnergy || 0;
      progress = Math.min(1.0, energy / 30);
      isActive = energy >= 30;
      statusBadge = energy >= 30 ? '能量滿額 (30點)' : `魔法能量 (${energy.toFixed(1)}/30)`;
      progressText = `${Math.round(progress * 100)}%`;
      ringColor = '#a855f7'; // Purple
      cooldownPeriodText = '受傷 8% 轉換能量 (上限30)';
      BarStateIcon = energy >= 30 ? Zap : Activity;
      barStateLabel = energy >= 30 ? '魔法能量已達滿額 (+30傷)' : '碰撞受傷轉換充能中';
      barValueDetail = `當前魔法能量儲備: ${energy.toFixed(1)} / 30 點`;
    } else if (isLingyinsi) {
      const cd = ball.blueArrowCooldown ?? 4.0;
      progress = Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0));
      isActive = cd <= 0.2;
      statusBadge = cd <= 0.2 ? '藍光箭就緒 (3物傷)' : `齊射冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#38bdf8'; // Sky Blue
      cooldownPeriodText = '冷卻週期: 4.0 秒 (本體+分身同步)';
      BarStateIcon = cd <= 0.2 ? Zap : Clock;
      barStateLabel = cd <= 0.2 ? '藍光箭同步發射就緒!' : '靈能藍光箭冷卻充能中';
      barValueDetail = cd <= 0.2 ? '非指定性直線齊射 3 點物理傷害' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.0 秒`;
    } else if (isChanshi) {
      const cd = ball.chanshiAuraCooldown ?? 7.0;
      progress = Math.max(0, Math.min(1.0, (7.0 - cd) / 7.0));
      isActive = cd <= 0.2;
      statusBadge = cd <= 0.2 ? '禁錮光環釋放中' : `光環冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#eab308'; // Gold
      cooldownPeriodText = '冷卻週期: 7.0 秒 (持續光環)';
      BarStateIcon = cd <= 0.2 ? Zap : Clock;
      barStateLabel = cd <= 0.2 ? '禁錮光環已展開釋放!' : '禁錮光環充能冷卻中';
      barValueDetail = cd <= 0.2 ? '半徑 100px 範圍降低敵速 30%' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 7.0 秒`;
    } else if (isHuangzuan) {
      const cd = ball.huangzuanLightningCooldown ?? 4.0;
      progress = Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0));
      isActive = cd <= 0.2;
      statusBadge = cd <= 0.2 ? '閃電就緒 (麻痺0.5s)' : `閃電冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#facc15';
      cooldownPeriodText = '冷卻週期: 4.0 秒 (自動鎖定)';
      BarStateIcon = cd <= 0.2 ? Zap : Clock;
      barStateLabel = cd <= 0.2 ? '指定性閃電鎖定就緒!' : '指定性閃電充能冷卻中';
      barValueDetail = cd <= 0.2 ? '命中造成 4 魔傷並麻痺敵方 0.5 秒' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.0 秒`;
    } else if (isLanzuan) {
      statusBadge = '藍色波長常駐 (1魔傷/0.5s)';
      isActive = true;
      progress = 1.0;
      progressText = '常駐';
      ringColor = '#38bdf8';
      cooldownPeriodText = '半徑 110px 常駐擴散';
      BarStateIcon = Sparkles;
      barStateLabel = '藍色波長持續擴散中';
      barValueDetail = '範圍內敵方每 0.5 秒持續受到 1 點魔法傷害';
    } else if (isFenzuan) {
      const cd = ball.fenzuanShieldCooldown ?? 4.0;
      const isFlying = !!ball.fenzuanShieldActive;
      progress = isFlying ? 1.0 : Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0));
      isActive = isFlying || cd <= 0.2;
      statusBadge = isFlying
        ? '圓盾飛行折返中 (出4/回2傷)'
        : cd <= 0.2
        ? '粉色圓盾就緒'
        : `圓盾冷卻 (${cd.toFixed(1)}s)`;
      progressText = isFlying ? '飛行中' : cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#f472b6';
      cooldownPeriodText = '冷卻週期: 4.0 秒 (折返返回後起算)';
      BarStateIcon = isFlying ? Flame : cd <= 0.2 ? Zap : Clock;
      barStateLabel = isFlying ? '粉色圓盾直線折返飛行中' : cd <= 0.2 ? '粉色圓盾擲出就緒!' : '粉色圓盾冷卻充能中';
      barValueDetail = isFlying ? '直線飛行 150px (出4物傷 / 回2物傷)' : cd <= 0.2 ? '可向前直線擲出折返盾' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.0 秒`;
    } else if (isBaizuan) {
      const clone = ball.baizuanClone;
      const cd = ball.baizuanCloneCooldown ?? 16.0;
      const hasClone = !!clone && clone.hp > 0;
      progress = hasClone ? clone.hp / 2 : Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      isActive = hasClone || cd <= 0.2;
      statusBadge = hasClone
        ? `分身存活 (HP ${clone.hp}/2)`
        : cd <= 0.2
        ? '鏡像召喚就緒'
        : `分身冷卻 (${cd.toFixed(1)}s)`;
      progressText = hasClone ? `HP ${clone.hp}/2` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ffffff';
      cooldownPeriodText = '冷卻週期: 16 秒 (存活最長15秒)';
      BarStateIcon = hasClone ? Copy : cd <= 0.2 ? Zap : Clock;
      barStateLabel = hasClone ? '敵方鏡像分身存活協同中' : cd <= 0.2 ? '鏡像分身召喚就緒!' : '鏡像分身冷卻充能中';
      barValueDetail = hasClone ? `分身生命值: ${clone.hp} / 2 格 (模仿敵方被動一)` : cd <= 0.2 ? '可立即召喚 1 個敵方鏡像分身' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 16.0 秒`;
    } else if (isXukongshou) {
      const active = !!ball.xukongshouBiteActive;
      const duration = ball.xukongshouBiteDuration || 0;
      const cd = ball.xukongshouBiteCooldown ?? 10.0;
      isActive = active || cd <= 0.2;
      progress = active ? Math.max(0, duration / 3.0) : Math.max(0, Math.min(1.0, (10.0 - cd) / 10.0));
      statusBadge = active
        ? `撕咬無敵中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '虛空獸撕咬就緒'
        : `撕咬冷卻 (${cd.toFixed(1)}s)`;
      progressText = active ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#a855f7';
      cooldownPeriodText = '消耗: 25能量 | 冷卻: 10秒 (持續3秒)';
      BarStateIcon = active ? Target : cd <= 0.2 ? Zap : Clock;
      barStateLabel = active ? '虛空獸裂口咬住中 (每0.5s撕咬6傷，不觸發碰撞傷害)' : cd <= 0.2 ? '虛空獸撕咬就緒!' : '虛空獸撕咬冷卻中';
      barValueDetail = active ? `咬住剩餘: ${duration.toFixed(1)} 秒 / 3.0 秒 (完全無敵，每0.5s造成6點撕咬傷害，結束後後撤)` : cd <= 0.2 ? '接近敵人時消耗 25 能量咬住3秒 (持續撕咬傷，不觸發碰撞)' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 10.0 秒`;
    } else if (isFan) {
      const timer = ball.fanAttackCheckTimer ?? 1.5;
      progress = Math.max(0, Math.min(1.0, (1.5 - timer) / 1.5));
      isActive = timer <= 0.25;
      statusBadge = '1.5s判定週期';
      progressText = `${timer.toFixed(1)}s`;
      ringColor = '#facc15';
      cooldownPeriodText = '判定週期: 1.5 秒 | 射程: 300px (翻滾後318px)';
      BarStateIcon = Target;
      barStateLabel = '獵手射擊判定 (5物傷 / 3層疊滿15真傷)';
      barValueDetail = `攻擊判定倒數: 剩餘 ${timer.toFixed(1)} 秒 / 1.5 秒 (範圍內自動瞄準發射)`;
    } else if (isJiandaoshou) {
      const cd = ball.jiandaoshouSnipCooldown ?? 5.0;
      progress = Math.max(0, Math.min(1.0, (5.0 - cd) / 5.0));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '剪裁就緒 (+1%最大HP傷)' : `冷卻中 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#f8fafc';
      cooldownPeriodText = '冷卻: 5.0 秒 | 魔法比例傷害';
      BarStateIcon = Scissors;
      barStateLabel = cd <= 0.1 ? '剪裁生命就緒 (4物傷 + 1%目標最大HP魔傷 + 回復)' : '剪裁生命冷卻中';
      barValueDetail = cd <= 0.1 ? '攻擊英雄時造成 4物傷 + 1%目標最大HP魔傷，並回復該額外傷害生命值' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 5.0 秒`;
    } else if (isTunshimozu) {
      const stacks = ball.growthStacks || 0;
      progress = Math.min(1.0, stacks / 50);
      isActive = stacks > 0;
      statusBadge = stacks >= 50 ? '吞噬極限 (50層)' : `吞噬成長 (${stacks}/50層)`;
      progressText = `${stacks}/50`;
      ringColor = '#a855f7';
      cooldownPeriodText = '吸收召喚物成長 (上限50層)';
      BarStateIcon = Flame;
      barStateLabel = stacks >= 50 ? '魔祖完全體 (+50層體積血量)' : '魔核吞噬能量累積中';
      barValueDetail = `當前吞噬: ${stacks} / 50 層 (HP+${stacks * 2}, 半徑+${(stacks * 0.2).toFixed(1)}px)`;
    } else if (isMimi) {
      const cd = ball.mimiClawCooldown ?? 2.0;
      progress = Math.max(0, Math.min(1.0, (2.0 - cd) / 2.0));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '貓爪衝刺就緒' : `衝爪冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#fb7185';
      cooldownPeriodText = '冷卻週期: 2.0 秒 (快速突進爪擊)';
      BarStateIcon = Zap;
      barStateLabel = cd <= 0.1 ? '貓爪衝刺突擊就緒!' : '衝爪突擊冷卻充能中';
      barValueDetail = cd <= 0.1 ? '鎖定敵方突進抓擊造成 8 點物傷' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 2.0 秒`;
    } else if (isDina) {
      const cd = ball.dinaWhiteLightCooldown ?? 1.2;
      progress = Math.max(0, Math.min(1.0, (1.2 - cd) / 1.2));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '白光彈就緒' : `白光冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#38bdf8';
      cooldownPeriodText = '發射週期: 1.2 秒 | 射程: 280px';
      BarStateIcon = Zap;
      barStateLabel = cd <= 0.1 ? '純淨白光彈裝填完畢!' : '白光彈充能裝填中';
      barValueDetail = cd <= 0.1 ? '直線射出白光彈造成 5 點魔法傷害' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 1.2 秒`;
    } else if (isJianxian) {
      const cd = ball.jianxianBurstSwordCooldown ?? 3.0;
      progress = Math.max(0, Math.min(1.0, (3.0 - cd) / 3.0));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '爆裂白劍就緒' : `白劍冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#e0f2fe';
      cooldownPeriodText = '冷卻週期: 3.0 秒 | 射程: 320px';
      BarStateIcon = Sword;
      barStateLabel = cd <= 0.1 ? '御劍術・白劍出鞘就緒!' : '御劍術・白劍真氣匯聚中';
      barValueDetail = cd <= 0.1 ? '飛劍射出命中引爆 12 點御劍傷害與劍氣破片' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 3.0 秒`;
    } else if (isLongshen) {
      const cd = ball.longshenSwoopCooldown ?? 5.8;
      const isSwooping = !!ball.longshenSwoopActive;
      progress = isSwooping ? 1.0 : Math.max(0, Math.min(1.0, (5.8 - cd) / 5.8));
      isActive = isSwooping || cd <= 0.1;
      statusBadge = isSwooping ? '神速俯衝中!' : cd <= 0.1 ? '龍搖俯衝就緒' : `龍搖冷卻 (${cd.toFixed(1)}s)`;
      progressText = isSwooping ? 'SWOOP' : cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#dc2626';
      cooldownPeriodText = '冷卻: 5.8 秒 | 霸體俯衝 240px';
      BarStateIcon = FastForward;
      barStateLabel = isSwooping ? '霸體俯衝獵殺中 (28物傷+20%破防)' : cd <= 0.1 ? '神速俯衝獵殺就緒!' : '龍搖俯衝充能中';
      barValueDetail = isSwooping ? '鎖定敵方極速俯衝，衝刺期間免疫碰撞傷害' : cd <= 0.1 ? '240px 內鎖定敵人施展霸體神速俯衝' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 5.8 秒`;
    } else if (isZhizhu) {
      const cd = ball.spiderVenomFangCooldown ?? 4.8;
      progress = Math.max(0, Math.min(1.0, (4.8 - cd) / 4.8));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '毒牙突刺就緒' : `突刺冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#10b981';
      cooldownPeriodText = '冷卻週期: 4.8 秒 | 150px 突刺';
      BarStateIcon = Zap;
      barStateLabel = cd <= 0.1 ? '毒牙突刺就緒 (6物傷+4s跳毒)' : '毒牙毒囊蓄液中';
      barValueDetail = cd <= 0.1 ? '鎖定 150px 內敵人突刺，附加蛛毒印記持續 4 秒' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.8 秒`;
    } else if (isXin) {
      const cd = ball.xinBasicAttackCooldown ?? 1.4;
      const form = ball.xinForm || 'balance';
      const baseCd = form === 'dark' ? 0.9 : 1.4;
      progress = Math.max(0, Math.min(1.0, (baseCd - cd) / baseCd));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? (form === 'dark' ? '魔劍狂斬 (暗)' : form === 'light' ? '魔劍普攻 (光)' : '魔劍普攻就緒') : `揮劍充能 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = form === 'dark' ? '#c084fc' : form === 'light' ? '#fbbf24' : '#f59e0b';
      cooldownPeriodText = `揮劍週期: ${baseCd.toFixed(1)} 秒 | 射程: 220px`;
      BarStateIcon = Sword;
      barStateLabel = cd <= 0.1 ? `雙相劍氣就緒 (${form === 'dark' ? '狂暴暗刃' : form === 'light' ? '聖光治癒' : '平衡'})` : '雙相魔劍揮擊冷卻中';
      barValueDetail = cd <= 0.1 ? '鎖定 220px 內敵人揮出劍氣，造成 18 點物理傷害並獲 15 XP' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / ${baseCd.toFixed(1)} 秒`;
    } else if (isKuileishi) {
      const puppets = (ball.puppets || []).filter(p => p.hp > 0);
      const cd = ball.puppetSummonCooldown ?? 0;
      progress = puppets.length >= 2 ? 1.0 : cd > 0 ? Math.max(0, Math.min(1.0, (5.0 - cd) / 5.0)) : 1.0;
      isActive = puppets.length > 0;
      statusBadge = puppets.length >= 2 ? '傀儡滿額 (2具)' : cd > 0 ? `召喚冷卻 (${cd.toFixed(1)}s)` : '召喚就緒 (最多2具)';
      progressText = `${puppets.length}/2`;
      ringColor = '#c084fc';
      cooldownPeriodText = '召喚週期: 5.0 秒 | 上限 2 具';
      BarStateIcon = puppets.length > 0 ? Sparkles : Clock;
      barStateLabel = puppets.length >= 2 ? '魔法傀儡存活滿額 (2具協戰)' : cd > 0 ? '傀儡召喚冷卻充能中' : '傀儡召喚就緒';
      barValueDetail = `存活傀儡: ${puppets.length} / 2 具 (每具3條生命共75HP，普攻6物傷/0.6s)`;
    } else if (isYinyong) {
      const state = ball.yinyongState || 'SEARCHING';
      const charge = ball.yinyongChargeTimer || 0;
      const maxC = ball.yinyongMaxCharge || 22.0;
      const successCd = ball.yinyongSuccessCooldown || 0;
      const failRec = ball.yinyongFailRecoveryTimer || 0;
      const declareTimer = ball.yinyongDeclareTimer || 0;

      if (state === 'CHARGING') {
        progress = Math.min(1.0, charge / maxC);
        isActive = true;
        statusBadge = `蓄力中 ${charge.toFixed(1)}/22s (${Math.round(progress * 100)}%)`;
        progressText = `${Math.round(progress * 100)}%`;
        ringColor = progress >= 0.95 ? '#facc15' : progress >= 0.63 ? '#f97316' : '#ef4444';
        cooldownPeriodText = '蓄力週期: 22.0 秒 (原地聚氣・0碰撞傷)';
        BarStateIcon = Zap;
        barStateLabel = progress >= 0.95 ? '★ 必殺拳意即將成型！' : progress >= 0.63 ? '拳勢極意激盪中' : '原地22秒拳意蓄勢中';
        barValueDetail = `蓄力進度: ${charge.toFixed(1)} 秒 / 22.0 秒 (蓄滿後瞬移至身後50px宣告2.5s)`;
      } else if (state === 'DECLARING') {
        progress = Math.max(0, Math.min(1.0, declareTimer / 2.5));
        isActive = true;
        statusBadge = `身後宣告 ${declareTimer.toFixed(1)}s`;
        progressText = `${declareTimer.toFixed(1)}s`;
        ringColor = '#ffffff';
        cooldownPeriodText = '宣告時長: 2.5 秒 (鎖定朝向・身後壓制)';
        BarStateIcon = Crosshair;
        barStateLabel = '身後宣告中・一拳即將決勝！';
        barValueDetail = `宣告倒數: 剩餘 ${declareTimer.toFixed(1)} 秒 / 2.5 秒 (倒數結束揮出毀滅一拳)`;
      } else if (state === 'PUNCHING') {
        progress = 1.0;
        isActive = true;
        statusBadge = '★★★ 一拳決勝爆發！';
        progressText = 'PUNCH!';
        ringColor = '#facc15';
        cooldownPeriodText = '即時爆發・直接擊倒判定';
        BarStateIcon = Zap;
        barStateLabel = '一拳決勝！毀滅打擊判定中';
        barValueDetail = '造成目標當前生命+999毀滅真傷';
      } else if (state === 'COOLDOWN' || successCd > 0) {
        progress = Math.max(0, Math.min(1.0, (8.0 - successCd) / 8.0));
        isActive = successCd <= 0.15;
        statusBadge = successCd <= 0.15 ? '一拳就緒 (即將蓄力)' : `成功冷卻 (${successCd.toFixed(1)}s)`;
        progressText = successCd <= 0.15 ? 'READY' : `${successCd.toFixed(1)}s`;
        ringColor = successCd <= 0.15 ? '#22c55e' : '#7f1d1d';
        cooldownPeriodText = '成功冷卻: 8.0 秒 (冷卻後重新搜尋蓄力)';
        BarStateIcon = successCd <= 0.15 ? Check : RotateCcw;
        barStateLabel = successCd <= 0.15 ? '冷卻完畢・即將啟動新一輪蓄力' : '一拳命中後冷卻休整中';
        barValueDetail = `冷卻倒數: 剩餘 ${successCd.toFixed(1)} 秒 / 8.0 秒`;
      } else if (state === 'FAIL_RECOVERY' || failRec > 0) {
        progress = Math.max(0, Math.min(1.0, (4.0 - failRec) / 4.0));
        isActive = failRec <= 0.15;
        statusBadge = failRec <= 0.15 ? '恢復完畢 (準備再戰)' : `落空恢復 (${failRec.toFixed(1)}s)`;
        progressText = failRec <= 0.15 ? 'READY' : `${failRec.toFixed(1)}s`;
        ringColor = failRec <= 0.15 ? '#f97316' : '#991b1b';
        cooldownPeriodText = '失敗恢復: 4.0 秒 (獲得越挫越勇+1層)';
        BarStateIcon = failRec <= 0.15 ? Check : RotateCcw;
        barStateLabel = failRec <= 0.15 ? '落空恢復完畢・重新鎖定中' : '一拳落空・失敗恢復凝氣中';
        barValueDetail = `恢復倒數: 剩餘 ${failRec.toFixed(1)} 秒 / 4.0 秒 (暴怒已累積 ${ball.yinyongRageStacks || 0} 層)`;
      } else {
        const searchTimer = ball.yinyongSearchTimer ?? 0.8;
        progress = Math.max(0, Math.min(1.0, (0.8 - searchTimer) / 0.8));
        isActive = false;
        statusBadge = '搜尋鎖定目標中...';
        progressText = 'SEEK';
        ringColor = '#dc2626';
        cooldownPeriodText = '重新鎖定目標: 約 0.5~0.8 秒';
        BarStateIcon = Target;
        barStateLabel = '正在鎖定對手破綻準備原地蓄力';
        barValueDetail = '鎖定敵方動態座標，隨後進入 22 秒原地蓄力';
      }
    }
  } else if (index === 1) {
    triggerCount = ball.passive2Triggers;
    if (isOba) {
      isActive = ball.hasChargedBounce;
      progress = ball.hasChargedBounce ? 1.0 : 0.25;
      statusBadge = ball.hasChargedBounce ? '蓄力反彈就緒 (+18%)' : '等待受擊反彈';
      progressText = ball.hasChargedBounce ? 'READY' : '待受擊';
      ringColor = ball.hasChargedBounce ? '#38bdf8' : '#64748b';
      cooldownPeriodText = '受擊即時觸發・單次反彈';
      BarStateIcon = ball.hasChargedBounce ? Zap : Clock;
      barStateLabel = ball.hasChargedBounce ? '蓄力反彈就緒 (+18% 反彈速度)' : '等待受到敵方碰撞衝擊';
      barValueDetail = ball.hasChargedBounce ? '下一次反彈速度額外提升 18%' : '受到敵人碰撞後立即啟動';
    } else if (isHuotong) {
      const cd = ball.huotongHotBodyCooldown ?? 0;
      const speedThreshold = 200;
      progress = cd > 0 ? Math.max(0, Math.min(1.0, (3.5 - cd) / 3.5)) : Math.min(1.0, Math.max(0.1, currentSpeed / speedThreshold));
      isActive = ball.isHotBodyActive && cd <= 0.2;
      statusBadge = cd > 0.2 ? `滾燙冷卻 (${cd.toFixed(1)}s)` : ball.isHotBodyActive ? '高速滾燙中 (+15%)' : `滾燙加速 (${Math.round(currentSpeed)}/${speedThreshold})`;
      progressText = cd > 0.2 ? `${cd.toFixed(1)}s` : `${Math.round(progress * 100)}%`;
      ringColor = cd > 0.2 ? '#7c2d12' : ball.isHotBodyActive ? '#f97316' : '#ea580c';
      cooldownPeriodText = '冷卻週期: 3.5 秒 | 速度門檻 > 200';
      BarStateIcon = cd > 0.2 ? Clock : ball.isHotBodyActive ? Flame : Zap;
      barStateLabel = cd > 0.2 ? '滾燙狀態充能冷卻中' : ball.isHotBodyActive ? '滾燙狀態全開 (+15% 碰撞傷害)' : '高速移動蓄力中';
      barValueDetail = cd > 0.2 ? `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 3.5 秒` : `當前時速: ${Math.round(currentSpeed)} / ${speedThreshold} 速度門檻`;
    } else if (isHailaise) {
      const cd = ball.energyBeamCooldown ?? 5.5;
      progress = Math.max(0, Math.min(1.0, (5.5 - cd) / 5.5));
      isActive = cd <= 0.2;
      statusBadge = cd <= 0.2 ? '紫光能量條發射!' : `能量條冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#d946ef';
      cooldownPeriodText = '冷卻週期: 5.5 秒 (自動飄忽發射)';
      BarStateIcon = cd <= 0.2 ? Zap : Clock;
      barStateLabel = cd <= 0.2 ? '紫光能量條發射就緒!' : '紫光能量條冷卻充能中';
      barValueDetail = cd <= 0.2 ? '非指定性飛行，命中 10~20 點魔法傷害' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 5.5 秒`;
    } else if (isLingyinsi) {
      const aliveClones = (ball.clones || []).filter(c => c.hp > 0);
      const cd = ball.cloneCooldown ?? 16.0;
      progress = Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      isActive = aliveClones.length > 0 || cd <= 0.2;
      statusBadge = aliveClones.length > 0
        ? `分身存活 ${aliveClones.length}/2 (分攤30%)`
        : cd <= 0.2
        ? '分身召喚就緒'
        : `分身冷卻 (${cd.toFixed(1)}s)`;
      progressText = aliveClones.length > 0 ? `${aliveClones.length}分身` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#06b6d4'; // Cyan
      cooldownPeriodText = '冷卻週期: 16 秒 (最多存活 2 個)';
      BarStateIcon = aliveClones.length > 0 ? Copy : cd <= 0.2 ? Zap : Clock;
      barStateLabel = aliveClones.length > 0 ? '靜止分身協防同步中' : cd <= 0.2 ? '靈隱寺分身術就緒!' : '靈隱寺分身術冷卻充能中';
      barValueDetail = aliveClones.length > 0 ? `存活分身: ${aliveClones.length} / 2 個 (120px 範圍分攤 30% 傷害)` : cd <= 0.2 ? '可自動召喚 1 個 17 HP 靜止分身' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 16.0 秒`;
    } else if (isChanshi) {
      const shieldTimer = ball.chanshiBellShieldTimer || 0;
      const armorTimer = ball.chanshiSuperArmorTimer || 0;
      isActive = shieldTimer > 0 || armorTimer > 0;
      progress = isActive ? 1.0 : 0.3;
      statusBadge = isActive ? '金鐘罩霸體中 (反彈20%)' : '受擊自動反彈20%';
      progressText = isActive ? '0.5s霸體' : '待受擊';
      ringColor = '#facc15';
      cooldownPeriodText = '受擊即時觸發・持續 0.5 秒';
      BarStateIcon = isActive ? Shield : ShieldCheck;
      barStateLabel = isActive ? '0.5 秒金鐘罩霸體護身中' : '受擊即時反彈待命中';
      barValueDetail = isActive ? '反彈 20% 受到的碰撞傷害 + 免疫控制' : '受到敵方碰撞時自動觸發反彈與霸體';
    } else if (isHuangzuan) {
      const stacks = ball.huangzuanSpeedStacks || 0;
      progress = stacks / 10;
      isActive = stacks >= 10;
      statusBadge = `閃電超速 (${stacks}/10層, ${(94 * (1 + stacks * 0.05)).toFixed(0)}%)`;
      progressText = stacks === 10 ? 'MAX 141%' : `${stacks}/10`;
      ringColor = '#fde047';
      cooldownPeriodText = '每 2 秒增加 1 層 (最高 10 層)';
      BarStateIcon = stacks >= 10 ? Zap : FastForward;
      barStateLabel = stacks >= 10 ? '閃電超速滿層 (速度 141%)' : '閃電超速每 2 秒疊加中';
      barValueDetail = `當前層數: ${stacks} / 10 層 (增傷 +${(stacks * 0.1).toFixed(1)}，撞擊後重置/10sCD)`;
    } else if (isLanzuan) {
      if (ball.lanzuanOrb && ball.lanzuanOrb.hp > 0) {
        isActive = true;
        progress = ball.lanzuanOrb.hp / ball.lanzuanOrb.maxHp;
        statusBadge = `光球射線壓制 (HP ${ball.lanzuanOrb.hp}/3)`;
        progressText = `${ball.lanzuanOrb.hp}/3`;
        ringColor = '#38bdf8';
        cooldownPeriodText = '3格生命值靜止光球';
        BarStateIcon = CircleDot;
        barStateLabel = '藍色光球能量子彈壓制中';
        barValueDetail = `光球生命值: ${ball.lanzuanOrb.hp} / 3 格 (子彈 0.1 魔傷)`;
      } else {
        const cd = ball.lanzuanOrbCooldown ?? 12.0;
        progress = Math.max(0, Math.min(1.0, (12.0 - cd) / 12.0));
        isActive = cd <= 0.2;
        statusBadge = cd <= 0.2 ? '光球召喚就緒' : `光球冷卻 (${cd.toFixed(1)}s)`;
        progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
        ringColor = '#0284c7';
        cooldownPeriodText = '冷卻週期: 12 秒 (摧毀後開始)';
        BarStateIcon = cd <= 0.2 ? Zap : Clock;
        barStateLabel = cd <= 0.2 ? '藍色光球召喚就緒!' : '藍色光球召喚冷卻中';
        barValueDetail = cd <= 0.2 ? '可重新召喚 3 格生命值靜止光球' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 12.0 秒`;
      }
    } else if (isFenzuan) {
      const cd = ball.fenzuanFieldCooldown ?? 12.0;
      const duration = ball.fenzuanFieldDuration ?? 0;
      isActive = !!ball.fenzuanFieldActive;
      progress = ball.fenzuanFieldActive
        ? Math.max(0, duration / 5.0)
        : Math.max(0, Math.min(1.0, (12.0 - cd) / 12.0));
      statusBadge = ball.fenzuanFieldActive
        ? `減傷力場中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '減傷力場就緒'
        : `力場冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.fenzuanFieldActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ec4899';
      cooldownPeriodText = '冷卻週期: 12 秒 (持續 5 秒)';
      BarStateIcon = ball.fenzuanFieldActive ? ShieldAlert : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.fenzuanFieldActive ? '粉色減傷力場展開中' : cd <= 0.2 ? '減傷力場就緒!' : '減傷力場冷卻充能中';
      barValueDetail = ball.fenzuanFieldActive ? `持續時間剩餘: ${duration.toFixed(1)} 秒 / 5.0 秒 (降低 1.5% 傷害)` : cd <= 0.2 ? '可以自身為中心展開減傷力場' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 12.0 秒`;
    } else if (isBaizuan) {
      const cd = ball.baizuanShiningCooldown ?? 16.0;
      const duration = ball.baizuanShiningDuration ?? 0;
      isActive = !!ball.baizuanShiningActive;
      progress = ball.baizuanShiningActive
        ? Math.max(0, duration / 5.0)
        : Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      statusBadge = ball.baizuanShiningActive
        ? `閃耀釋放中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '閃耀就緒'
        : `閃耀冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.baizuanShiningActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ffffff';
      cooldownPeriodText = '冷卻週期: 16 秒 (持續 5 秒)';
      BarStateIcon = ball.baizuanShiningActive ? Sun : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.baizuanShiningActive ? '純白閃耀釋放中 (停移+定身1.5s)' : cd <= 0.2 ? '純白閃耀就緒!' : '純白閃耀冷卻充能中';
      barValueDetail = ball.baizuanShiningActive ? `釋放剩餘: ${duration.toFixed(1)} 秒 / 5.0 秒 (定身1.5s + 1魔傷/s)` : cd <= 0.2 ? '可向周圍釋放白色閃光定身敵方' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 16.0 秒`;
    } else if (isXukongshou) {
      const hasRift = !!ball.xukongshouRift;
      const cd = ball.xukongshouRiftCooldown ?? 20;
      isActive = hasRift || cd <= 0.2;
      progress = hasRift ? Math.max(0, (ball.xukongshouRift?.duration || 0) / 8) : Math.max(0, Math.min(1.0, (20 - cd) / 20));
      statusBadge = hasRift
        ? (ball.xukongshouRift?.trappedEnemy ? '敵人被困住 2s' : '空間折疊裂縫開啟')
        : cd <= 0.2
        ? '虛空裂縫就緒'
        : `裂縫冷卻 (${cd.toFixed(1)}s)`;
      progressText = hasRift ? '裂縫開啟' : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#c084fc';
      cooldownPeriodText = '消耗: 25能量 | 冷卻: 20秒';
      BarStateIcon = hasRift ? Orbit : cd <= 0.2 ? Zap : Clock;
      barStateLabel = hasRift ? (ball.xukongshouRift?.trappedEnemy ? '敵人被困在虛空裂縫中無法移動' : '虛空裂縫撕開中 (入口與出口折疊)') : cd <= 0.2 ? '虛空裂縫撕裂就緒!' : '虛空裂縫冷卻中';
      barValueDetail = hasRift ? '折疊空間傳送自己，敵人踩中困住 2 秒' : cd <= 0.2 ? '可消耗 25 能量開啟空間裂縫' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 20.0 秒`;
    } else if (isFan) {
      const cd = ball.fanRollCooldown ?? 0;
      const isRolling = !!ball.fanIsRolling;
      isActive = isRolling || cd <= 0.1;
      progress = isRolling ? 1.0 : cd > 0 ? Math.max(0, Math.min(1.0, (5.0 - cd) / 5.0)) : 1.0;
      statusBadge = isRolling ? '翻滾位移中' : cd <= 0.1 ? '翻滾預知就緒' : `翻滾冷卻 (${cd.toFixed(1)}s)`;
      progressText = isRolling ? 'ROLL' : cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#e2e8f0';
      cooldownPeriodText = '冷卻週期: 5.0 秒 (敵近145px自動位移100px)';
      BarStateIcon = isRolling ? Wind : cd <= 0.1 ? Zap : Clock;
      barStateLabel = isRolling ? '翻滾預知位移中 (留下銀白殘影)' : cd <= 0.1 ? '翻滾預知就緒 (射程永久提升至318px)' : '翻滾預知冷卻中';
      barValueDetail = isRolling ? '位移 100px 拉開距離' : cd <= 0.1 ? '敵方逼近 145px 時自動向外翻滾位移 100px' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 5.0 秒`;
    } else if (isJiandaoshou) {
      isActive = ball.jiandaoshouMistActive;
      const duration = ball.jiandaoshouMistDuration ?? 0;
      const cd = ball.jiandaoshouMistCooldown ?? 18.0;
      progress = isActive ? Math.max(0, Math.min(1.0, duration / 8.0)) : Math.max(0, Math.min(1.0, (18.0 - cd) / 18.0));
      statusBadge = isActive ? `聖霧護佑中 (${duration.toFixed(1)}s)` : cd <= 0.1 ? '聖霧就緒' : `冷卻 (${cd.toFixed(0)}s)`;
      progressText = isActive ? `${duration.toFixed(1)}s` : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#fef08a';
      cooldownPeriodText = '冷卻: 18 秒 | 持續: 8 秒 | 半徑: 130px';
      BarStateIcon = Shield;
      barStateLabel = isActive ? '聖霧守護生效中 (免疫一切普攻與非指定技能傷害)' : cd <= 0.1 ? '聖霧守護就緒!' : '聖霧守護冷卻中';
      barValueDetail = isActive ? `聖霧剩餘: ${duration.toFixed(1)} 秒 / 8.0 秒 (隨球體移動，霧內免疫所有傷害，只受指定控制技影響)` : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 18.0 秒 (全技能防護領域)`;
    } else if (isTunshimozu) {
      const stacks = ball.growthStacks || 0;
      const tier = Math.floor(stacks / 10);
      progress = Math.min(1.0, (stacks % 10) / 10);
      isActive = tier > 0;
      statusBadge = `魔甲階級 (第 ${tier} 階)`;
      progressText = `第${tier}階`;
      ringColor = '#7c3aed';
      cooldownPeriodText = '每 10 層吞噬晉升一階魔軀';
      BarStateIcon = ShieldAlert;
      barStateLabel = `漆黑魔甲 第 ${tier} 階防護 (減傷 ${(tier * 2)}%)`;
      barValueDetail = `當前魔甲: 減傷 ${(tier * 2)}% (距離下一階還差 ${10 - (stacks % 10)} 層吞噬)`;
    } else if (isMimi) {
      const cd = ball.mimiHeartCooldown ?? 20.0;
      progress = Math.max(0, Math.min(1.0, (20.0 - cd) / 20.0));
      isActive = cd <= 0.2;
      statusBadge = cd <= 0.2 ? '愛心飛彈就緒' : `愛心冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#f43f5e';
      cooldownPeriodText = '冷卻週期: 20 秒 (發射粉紅心型飛彈)';
      BarStateIcon = Heart;
      barStateLabel = cd <= 0.2 ? '萌動愛心飛彈發射就緒!' : '愛心飛彈充能冷卻中';
      barValueDetail = cd <= 0.2 ? '發射 2 枚愛心飛彈，每枚造成 12 魔傷並短暫迷惑' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 20.0 秒`;
    } else if (isDina) {
      const state = ball.dinaDarkLightState;
      const chargeTimer = ball.dinaDarkLightChargeTimer ?? 0;
      const isCharging = state === 'CHARGING';
      const isReady = state === 'READY';
      progress = isReady ? 1.0 : isCharging ? Math.max(0, Math.min(1.0, (0.6 - chargeTimer) / 0.6)) : 0.2;
      isActive = isReady || isCharging;
      statusBadge = isReady ? '暗光砲就緒!' : isCharging ? `蓄力中 (${chargeTimer.toFixed(1)}s)` : '準備蓄力';
      progressText = isReady ? 'READY' : isCharging ? '蓄力' : '等待';
      ringColor = '#818cf8';
      cooldownPeriodText = '蓄力 0.6 秒 | 貫穿暗光雷射';
      BarStateIcon = Moon;
      barStateLabel = isReady ? '湮滅暗光砲充能完畢!' : isCharging ? '暗光粒子高速壓縮凝聚中...' : '暗光砲待命中';
      barValueDetail = isReady ? '鎖定目標轟出暗光束造成 14 點暗魔法貫穿傷' : isCharging ? `蓄力倒數: 剩餘 ${chargeTimer.toFixed(1)} 秒 / 0.6 秒` : '白光命中後開始引導蓄力';
    } else if (isJianxian) {
      const cd = ball.jianxianRetreatCooldown ?? 7.6;
      const isRetreating = (ball.jianxianRetreatAnimTimer || 0) > 0;
      progress = isRetreating ? 1.0 : Math.max(0, Math.min(1.0, (7.6 - cd) / 7.6));
      isActive = isRetreating || cd <= 0.2;
      statusBadge = isRetreating ? '踏劍後撤中!' : cd <= 0.2 ? '退劍就緒 (敵近150px)' : `退劍冷卻 (${cd.toFixed(1)}s)`;
      progressText = isRetreating ? '後撤' : cd <= 0.2 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#38bdf8';
      cooldownPeriodText = '冷卻: 7.6 秒 | 敵近150px自動反向退劍緩行';
      BarStateIcon = Wind;
      barStateLabel = isRetreating ? '劍仙凌空踏劍向後疾退，留下遲緩青芒劍氣' : cd <= 0.2 ? '退劍緩行蓄勢就緒 (近身防護)' : '退劍緩行冷卻充能中';
      barValueDetail = isRetreating ? '後撤 120px，發射 1 枚飛劍減速敵方 45% (持續 2s)' : cd <= 0.2 ? '敵人逼近至 150px 時自動後撤拉開距離' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 7.6 秒`;
    } else if (isLongshen) {
      const cd = ball.longshenStrikeCooldown ?? 3.2;
      progress = Math.max(0, Math.min(1.0, (3.2 - cd) / 3.2));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '雙重裂爪就緒' : `裂爪冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#f59e0b';
      cooldownPeriodText = '冷卻週期: 3.2 秒 | 160px 裂爪';
      BarStateIcon = Zap;
      barStateLabel = cd <= 0.1 ? '雙重裂爪就緒 (合計40爆發+引爆15真傷)' : '狂暴裂爪冷卻蓄勢中';
      barValueDetail = cd <= 0.1 ? '近身 160px 施展雙重裂爪，灼燒或龍威目標額外引爆 15 真傷' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 3.2 秒`;
    } else if (isZhizhu) {
      const cd = ball.spiderWebCooldown ?? 8.0;
      progress = Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '獵網束縛就緒' : `獵網冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#059669';
      cooldownPeriodText = '冷卻週期: 8.0 秒 | 射程: 380px';
      BarStateIcon = Target;
      barStateLabel = cd <= 0.1 ? '強韌獵網束縛就緒 (35%減速+網陷阱)' : '獵網編織冷卻中';
      barValueDetail = cd <= 0.1 ? '噴射強韌蛛網減速敵人 35% 並在地面留下 2.5 秒黏稠蛛網' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 8.0 秒`;
    } else if (isXin) {
      const cd = ball.xinShadowDashCooldown ?? 6.5;
      const isDashing = !!ball.xinShadowDashing;
      progress = isDashing ? 1.0 : Math.max(0, Math.min(1.0, (6.5 - cd) / 6.5));
      isActive = isDashing || cd <= 0.1;
      statusBadge = isDashing ? '逐影穿透中!' : cd <= 0.1 ? '逐影破陣就緒' : `破陣冷卻 (${cd.toFixed(1)}s)`;
      progressText = isDashing ? 'DASH' : cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#818cf8';
      cooldownPeriodText = '冷卻週期: 6.5 秒 | 280px 突進穿透';
      BarStateIcon = Zap;
      barStateLabel = isDashing ? '雙相劍影極速穿透中 (免疫碰撞傷害)' : cd <= 0.1 ? '逐影破陣就緒 (24~34傷+護盾/撕裂)' : '逐影破陣蓄勢充能中';
      barValueDetail = isDashing ? '極速突進穿透敵陣，光形態護盾 / 暗形態撕裂' : cd <= 0.1 ? '鎖定 280px 內目標化作雙相劍影極速穿透突進' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 6.5 秒`;
    } else if (isKuileishi) {
      const cd = ball.puppetAegisCooldown ?? 0;
      const isShieldActive = (ball.puppetAegisTimer ?? 0) > 0;
      progress = isShieldActive ? 1.0 : cd > 0 ? Math.max(0, Math.min(1.0, (3.5 - cd) / 3.5)) : 1.0;
      isActive = isShieldActive || cd <= 0.15;
      statusBadge = isShieldActive ? '護幕生效中 (-40%)' : cd <= 0.15 ? '護幕就緒 (-40%傷)' : `護幕冷卻 (${cd.toFixed(1)}s)`;
      progressText = isShieldActive ? 'ACTIVE' : cd <= 0.15 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#a855f7';
      cooldownPeriodText = '冷卻週期: 3.5 秒 (受擊保護護幕)';
      BarStateIcon = isShieldActive ? ShieldCheck : cd <= 0.15 ? Shield : Clock;
      barStateLabel = isShieldActive ? '傀儡守護護幕生效中 (減傷 40% + 移速+20%)' : cd <= 0.15 ? '傀儡保護結界防禦就緒' : '傀儡護幕冷卻充能中';
      barValueDetail = cd <= 0.15 ? '受擊時傀儡分攤 40% 傷害並提供護幕保護與移速加成' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 3.5 秒`;
    } else if (isYinyong) {
      const isLowHp = ball.hp < ball.maxHp * 0.35;
      const cd = ball.yinyongImmortalCooldown || 0;
      const checkTimer = ball.yinyongImmortalCheckTimer ?? 2.0;

      if (isLowHp) {
        if (cd > 0) {
          progress = Math.max(0, Math.min(1.0, (12.0 - cd) / 12.0));
          isActive = false;
          statusBadge = `冷卻中 (${cd.toFixed(1)}s)`;
          progressText = `${cd.toFixed(1)}s`;
          ringColor = '#7f1d1d';
          cooldownPeriodText = '冷卻週期: 12.0 秒 (奇蹟觸發後冷卻)';
          BarStateIcon = RotateCcw;
          barStateLabel = '不死之血奇蹟冷卻修整中';
          barValueDetail = `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 12.0 秒 (12秒內最多奇蹟回滿1次)`;
        } else {
          progress = Math.max(0, Math.min(1.0, (2.0 - checkTimer) / 2.0));
          isActive = true;
          statusBadge = `判定中 (${checkTimer.toFixed(1)}s) 3%機率`;
          progressText = '3%判定';
          ringColor = '#ef4444';
          cooldownPeriodText = '判定週期: 每 2.0 秒判定 3% 機率回滿';
          BarStateIcon = Heart;
          barStateLabel = '★ 不死之血判定中 (3% 機率回滿 360 HP)';
          barValueDetail = `當前生命 ${Math.round(ball.hp)}/360 (<35%門檻)！下次脈衝倒數: ${checkTimer.toFixed(1)}s`;
        }
      } else {
        progress = Math.min(1.0, Math.max(0, (ball.maxHp * 0.35 - (ball.hp - ball.maxHp * 0.35)) / (ball.maxHp * 0.35)));
        isActive = false;
        statusBadge = `待瀕血 (需HP<35%)`;
        progressText = `${Math.round((ball.hp / ball.maxHp) * 100)}%`;
        ringColor = '#64748b';
        cooldownPeriodText = '觸發條件: HP < 35% (≤ 126 HP)';
        BarStateIcon = Shield;
        barStateLabel = '等待生命值降至 35% 以下啟動';
        barValueDetail = `當前生命: ${Math.round(ball.hp)} / 360 HP (需降至 126 HP 以下啟動不死血脈)`;
      }
    }
  } else if (index === 2) {
    triggerCount = ball.passive3Triggers;
    if (isOba) {
      const combo = Math.min(ball.consecutiveHits || 0, 3);
      progress = combo / 3;
      isActive = combo >= 3;
      statusBadge = combo >= 3 ? '猛撞就緒 (+12傷)' : `連擊積累 (${combo}/3)`;
      progressText = combo >= 3 ? 'READY' : `${combo}/3`;
      ringColor = combo >= 3 ? '#fbbf24' : combo > 0 ? '#38bdf8' : '#64748b';
      cooldownPeriodText = '每連續 3 次碰撞觸發重擊';
      BarStateIcon = combo >= 3 ? Zap : Activity;
      barStateLabel = combo >= 3 ? '連續猛撞蓄能完畢 (+12 傷害)' : '連續碰撞次數累積中';
      barValueDetail = combo >= 3 ? '下一次碰撞命中額外造成 12 點物理傷害!' : `當前碰撞: ${combo} / 3 次 (尚需碰撞 ${3 - combo} 次)`;
    } else if (isHuotong) {
      const cd = ball.huotongExplosiveCooldown ?? 0;
      isActive = !!ball.hasExplosiveBounceReady && cd <= 0.2;
      progress = cd > 0 ? Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0)) : ball.hasExplosiveBounceReady ? 1.0 : 0.2;
      statusBadge = cd > 0.2 ? `爆燃冷卻 (${cd.toFixed(1)}s)` : ball.hasExplosiveBounceReady ? '爆燃命中 (+7火傷)' : '等待強撞 (衝擊>140)';
      progressText = cd > 0.2 ? `${cd.toFixed(1)}s` : ball.hasExplosiveBounceReady ? '爆燃就緒' : '待強撞';
      ringColor = cd > 0.2 ? '#7c2d12' : ball.hasExplosiveBounceReady ? '#ea580c' : '#78350f';
      cooldownPeriodText = '冷卻週期: 8.0 秒 (強力反彈後啟動)';
      BarStateIcon = cd > 0.2 ? Clock : ball.hasExplosiveBounceReady ? Flame : Clock;
      barStateLabel = cd > 0.2 ? '爆燃反彈冷卻充能中' : ball.hasExplosiveBounceReady ? '爆燃反彈蓄力完畢 (+7 火傷)' : '等待強力碰撞衝擊';
      barValueDetail = cd > 0.2 ? `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 8.0 秒` : ball.hasExplosiveBounceReady ? '下一次碰撞命中額外造成 7 點火焰傷害' : '反彈衝擊力道需超過 140';
    } else if (isHailaise) {
      const isLowHp = (ball.hp / ball.maxHp) <= 0.25;
      isActive = !ball.hasTriggeredPossession && isLowHp;
      progress = ball.hasTriggeredPossession ? 1.0 : (isLowHp ? 1.0 : Math.max(0.1, 1 - (ball.hp / ball.maxHp)));
      statusBadge = ball.hasTriggeredPossession ? '已釋放 (3枚飛彈)' : isLowHp ? '殘血發動!' : '殘血觸發 (生命<25%)';
      progressText = ball.hasTriggeredPossession ? '已釋放' : isLowHp ? '觸發!' : 'HP<25%';
      ringColor = '#8b5cf6';
      cooldownPeriodText = '每場戰鬥限觸發 1 次 (HP < 25%)';
      BarStateIcon = ball.hasTriggeredPossession ? Check : isLowHp ? Flame : Shield;
      barStateLabel = ball.hasTriggeredPossession ? '本場戰鬥已發動完畢' : isLowHp ? '生命低於 25%! 3枚追蹤法球發射中' : '絕境附身被動備戰監控中';
      barValueDetail = ball.hasTriggeredPossession ? '已消耗 50% 當前剩餘生命轉為 3 枚飛彈' : `當前血量: ${(ball.hp / ball.maxHp * 100).toFixed(0)}% / 門檻 25%`;
    } else if (isLingyinsi) {
      const activeOrbs = ball.greenOrbs?.filter(o => o.active).length || 0;
      const cd = ball.greenOrbsCooldown ?? 25;
      const isOrbsActive = !!ball.greenOrbsActive && activeOrbs > 0;
      progress = isOrbsActive ? 1.0 : Math.max(0, Math.min(1.0, (25 - cd) / 25));
      isActive = isOrbsActive || cd <= 0.2;
      statusBadge = isOrbsActive
        ? `綠光圈護體 (${activeOrbs}/3圈)`
        : cd <= 0.2
        ? '回金集就緒'
        : `回金集冷卻 (${cd.toFixed(1)}s)`;
      progressText = isOrbsActive ? `${activeOrbs}圈` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#22c55e'; // Green
      cooldownPeriodText = '冷卻週期: 25 秒 (命中後冷卻)';
      BarStateIcon = isOrbsActive ? Orbit : cd <= 0.2 ? Zap : Clock;
      barStateLabel = isOrbsActive ? '3 重綠光圈旋轉護體中' : cd <= 0.2 ? '回金集旋轉光圈就緒!' : '回金集光圈冷卻充能中';
      barValueDetail = isOrbsActive ? `存活旋轉光圈: ${activeOrbs} / 3 圈 (每圈造成 21 物傷)` : cd <= 0.2 ? '可自動生成 3 個綠色旋轉護體光圈' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 25.0 秒`;
    } else if (isChanshi) {
      const isLowHp = ball.hp <= 150;
      isActive = !ball.chanshiGoldenBodyUsed && isLowHp;
      progress = ball.chanshiGoldenBodyUsed ? 1.0 : (isLowHp ? 1.0 : Math.max(0.1, 1 - (ball.hp / ball.maxHp)));
      statusBadge = ball.chanshiGoldenBodyUsed
        ? '已觸發 (回復80HP)'
        : isLowHp
        ? '金身發動!'
        : '殘血觸發 (生命<30%)';
      progressText = ball.chanshiGoldenBodyUsed ? '已使用' : isLowHp ? '觸發!' : 'HP<30%';
      ringColor = '#fef08a';
      cooldownPeriodText = '每場戰鬥限觸發 1 次 (HP < 30%)';
      BarStateIcon = ball.chanshiGoldenBodyUsed ? Check : isLowHp ? Flame : Shield;
      barStateLabel = ball.chanshiGoldenBodyUsed ? '本場金身回復已使用完畢' : isLowHp ? '生命低於 30%! 立即回復 80 HP' : '金身瀕死回復監控中';
      barValueDetail = ball.chanshiGoldenBodyUsed ? '已成功回復 80 點生命值' : `當前血量: ${ball.hp} / 500 (觸發門檻 150 HP)`;
    } else if (isHuangzuan) {
      const cd = ball.huangzuanFieldCooldown ?? 30;
      const duration = ball.huangzuanFieldDuration ?? 0;
      isActive = !!ball.huangzuanFieldActive;
      progress = ball.huangzuanFieldActive
        ? Math.max(0, duration / 3.5)
        : Math.max(0, Math.min(1.0, (30 - cd) / 30));
      statusBadge = ball.huangzuanFieldActive
        ? `雷電領域中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '雷電領域就緒'
        : `領域冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.huangzuanFieldActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#eab308';
      cooldownPeriodText = '冷卻週期: 30 秒 (持續 3.5 秒)';
      BarStateIcon = ball.huangzuanFieldActive ? Zap : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.huangzuanFieldActive ? '雷電超能領域展開中' : cd <= 0.2 ? '雷電超能領域就緒!' : '雷電超能領域冷卻充能中';
      barValueDetail = ball.huangzuanFieldActive ? `持續時間剩餘: ${duration.toFixed(1)} 秒 / 3.5 秒 (每 0.1s 1 魔傷)` : cd <= 0.2 ? '可形成雷電能量區域高頻電擊' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 30.0 秒`;
    } else if (isLanzuan) {
      const cd = ball.lanzuanEmotionCooldown ?? 40;
      const duration = ball.lanzuanEmotionFieldDuration ?? 0;
      isActive = !!ball.lanzuanEmotionFieldActive;
      progress = ball.lanzuanEmotionFieldActive
        ? Math.max(0, duration / 3.5)
        : Math.max(0, Math.min(1.0, (40 - cd) / 40));
      statusBadge = ball.lanzuanEmotionFieldActive
        ? `情緒法陣中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '情緒法陣就緒'
        : `法陣冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.lanzuanEmotionFieldActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#0ea5e9';
      cooldownPeriodText = '冷卻週期: 40 秒 (持續 3.5 秒)';
      BarStateIcon = ball.lanzuanEmotionFieldActive ? Sparkles : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.lanzuanEmotionFieldActive ? '藍色情緒法陣展開中 (結尾90魔爆)' : cd <= 0.2 ? '藍色情緒能量法陣就緒!' : '情緒能量法陣冷卻充能中';
      barValueDetail = ball.lanzuanEmotionFieldActive ? `法陣蓄力剩餘: ${duration.toFixed(1)} 秒 / 3.5 秒 (減速 35%)` : cd <= 0.2 ? '可施放 140px 減速法陣並引爆 90 傷' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 40.0 秒`;
    } else if (isFenzuan) {
      const cd = ball.fenzuanBubbleCooldown ?? 30;
      const duration = ball.fenzuanBubbleDuration ?? 0;
      isActive = !!ball.fenzuanBubbleActive;
      progress = ball.fenzuanBubbleActive
        ? Math.max(0, duration / 10)
        : Math.max(0, Math.min(1.0, (30 - cd) / 30));
      statusBadge = ball.fenzuanBubbleActive
        ? `泡泡衝刺中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '泡泡尖刺就緒'
        : `尖刺冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.fenzuanBubbleActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#f472b6';
      cooldownPeriodText = '冷卻週期: 30 秒 (持續 10 秒)';
      BarStateIcon = ball.fenzuanBubbleActive ? Flame : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.fenzuanBubbleActive ? '泡泡尖刺包裹隨機衝刺中' : cd <= 0.2 ? '泡泡尖刺衝刺就緒!' : '泡泡尖刺冷卻充能中';
      barValueDetail = ball.fenzuanBubbleActive ? `衝刺剩餘: ${duration.toFixed(1)} 秒 / 10.0 秒 (碰撞+3物傷)` : cd <= 0.2 ? '可包裹自身進行隨機衝刺與撞擊增傷' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 30.0 秒`;
    } else if (isBaizuan) {
      const cd = ball.baizuanRayCooldown ?? 24;
      const duration = ball.baizuanRayDuration ?? 0;
      isActive = !!ball.baizuanRayActive;
      progress = ball.baizuanRayActive
        ? Math.max(0, duration / 8)
        : Math.max(0, Math.min(1.0, (24 - cd) / 24));
      statusBadge = ball.baizuanRayActive
        ? `白色死光中 (${duration.toFixed(1)}s)`
        : cd <= 0.2
        ? '白色死光就緒'
        : `死光冷卻 (${cd.toFixed(1)}s)`;
      progressText = ball.baizuanRayActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ffffff';
      cooldownPeriodText = '冷卻週期: 24 秒 (持續 8 秒)';
      BarStateIcon = ball.baizuanRayActive ? Sun : cd <= 0.2 ? Zap : Clock;
      barStateLabel = ball.baizuanRayActive ? '白色死光直線貫穿照射中' : cd <= 0.2 ? '白色死光發射就緒!' : '白色死光冷卻充能中';
      barValueDetail = ball.baizuanRayActive ? `死光照射剩餘: ${duration.toFixed(1)} 秒 / 8.0 秒 (每秒 1.5 魔傷)` : cd <= 0.2 ? '可發射 300px 直線白色閃光' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 24.0 秒`;
    } else if (isXukongshou) {
      const isLocking = (ball.xukongshouHuntLockTimer || 0) > 0;
      const isDashing = !!ball.xukongshouHuntActive;
      const cd = ball.xukongshouHuntCooldown ?? 25;
      isActive = isLocking || isDashing || cd <= 0.2;
      progress = isLocking ? Math.max(0, (3 - (ball.xukongshouHuntLockTimer || 0)) / 3) : Math.max(0, Math.min(1.0, (25 - cd) / 25));
      statusBadge = isLocking
        ? `鎖定標記中 (${(ball.xukongshouHuntLockTimer || 0).toFixed(1)}s)`
        : isDashing
        ? '幻影穿刺突進!'
        : cd <= 0.2
        ? '虛空獵擊就緒'
        : `獵擊冷卻 (${cd.toFixed(1)}s)`;
      progressText = isLocking ? `${(ball.xukongshouHuntLockTimer || 0).toFixed(1)}s` : isDashing ? '突進' : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#a855f7';
      cooldownPeriodText = '消耗: 35能量 | 冷卻: 25秒';
      BarStateIcon = isLocking ? Target : isDashing ? FastForward : cd <= 0.2 ? Zap : Clock;
      barStateLabel = isLocking ? '敵人身上附加黑紫色虛空標記鎖定中' : isDashing ? '化身半透明幻影以極速穿刺衝刺中' : cd <= 0.2 ? '虛空獵擊就緒!' : '虛空獵擊冷卻中';
      barValueDetail = isLocking ? `鎖定倒數: ${(ball.xukongshouHuntLockTimer || 0).toFixed(1)} 秒 / 3.0 秒` : isDashing ? '命中將造成 20 點物理傷害並留下殘影' : cd <= 0.2 ? '可消耗 35 能量鎖定敵方 3 秒並幻影穿刺' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 25.0 秒`;
    } else if (isFan) {
      const active = !!ball.fanOverclockActive;
      const duration = ball.fanOverclockDuration ?? 0;
      const cd = ball.fanOverclockCooldown ?? 0;
      isActive = active || cd <= 0.1;
      progress = active ? Math.max(0, duration / 10.0) : cd > 0 ? Math.max(0, Math.min(1.0, (20.0 - cd) / 20.0)) : 1.0;
      statusBadge = active ? `超速中 (${duration.toFixed(1)}s)` : cd <= 0.1 ? '超速強化就緒' : `超速冷卻 (${cd.toFixed(1)}s)`;
      progressText = active ? `${duration.toFixed(1)}s` : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#facc15';
      cooldownPeriodText = '持續: 10 秒 | 冷卻: 20 秒';
      BarStateIcon = active ? FastForward : cd <= 0.1 ? Zap : Clock;
      barStateLabel = active ? '超速強化中 (速度130%，每秒減少翻滾CD 0.5s)' : cd <= 0.1 ? '超速強化就緒!' : '超速強化冷卻中';
      barValueDetail = active ? `狀態剩餘: ${duration.toFixed(1)} 秒 / 10.0 秒 (速度提升至130%，每秒減少翻滾CD 0.5s)` : cd <= 0.1 ? '開戰自動啟動，速度提升30%' : `充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 20.0 秒`;
    } else if (isJiandaoshou) {
      const remaining = ball.jiandaoshouNeedlesRemaining ?? 0;
      const cd = ball.jiandaoshouNeedleCooldown ?? 12;
      isActive = remaining > 0;
      progress = isActive ? 1.0 : Math.max(0, Math.min(1.0, (12 - cd) / 12));
      statusBadge = remaining > 0 ? `聖針連射中 (剩餘${remaining}枚)` : cd <= 0.2 ? '飛針就緒 (5枚)' : `冷卻 (${cd.toFixed(0)}s)`;
      progressText = remaining > 0 ? `${remaining}枚` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#38bdf8';
      cooldownPeriodText = '冷卻: 12 秒 | 發射: 5 枚魔法針 | 射程: 360px';
      BarStateIcon = Crosshair;
      barStateLabel = remaining > 0 ? `聖針連射中 (剩餘 ${remaining} 枚飛針)` : cd <= 0.2 ? '聖針連射就緒!' : '聖針連射冷卻中';
      barValueDetail = remaining > 0 ? `浮現 5 枚銀白色魔法針連射中，每枚 6 魔法傷害 + 1.2s 減速 20%` : cd <= 0.2 ? '準備向目標發射 5 枚銀白色飛針，總計 30 魔法傷害與減速' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 12.0 秒`;
    } else if (isTunshimozu) {
      const cd = ball.gluttonyBurstCooldown ?? 0;
      const stacks = ball.growthStacks || 0;
      const bonus = Math.floor(stacks / 10);
      const burstDmg = 4 + bonus;
      const burstRadius = 70 + bonus * 8;
      progress = cd > 0 ? Math.max(0, Math.min(1.0, (6.0 - cd) / 6.0)) : 1.0;
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? `魔爆就緒 (${burstDmg}魔傷)` : `魔爆冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#c084fc';
      cooldownPeriodText = '冷卻週期: 6.0 秒 | 受撞 30% 機率魔爆';
      BarStateIcon = cd <= 0.1 ? Flame : Clock;
      barStateLabel = cd <= 0.1 ? `暴食魔爆就緒! (${burstDmg}魔傷/${burstRadius}px)` : '暴食魔爆冷卻充能中';
      barValueDetail = cd <= 0.1 ? `受敵方碰撞時 30% 機率觸發魔爆，對範圍內造成 ${burstDmg} 點魔法傷害` : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 6.0 秒 (成長值 ${stacks} 層)`;
    } else if (isMimi) {
      const spawnTimer = ball.mimiHopeSpawnTimer ?? 30.0;
      const destroyCd = ball.mimiHopeDestroyCooldown ?? 0;
      const hasPacks = (ball.mimiGrowthPacks?.length ?? 0) > 0;
      const isDestroyed = destroyCd > 0;
      progress = hasPacks ? 1.0 : isDestroyed ? Math.max(0, (40.0 - destroyCd) / 40.0) : Math.max(0, (30.0 - spawnTimer) / 30.0);
      isActive = hasPacks;
      statusBadge = hasPacks ? '成長包在場' : isDestroyed ? `破壞冷卻 (${destroyCd.toFixed(0)}s)` : `生成倒數 (${spawnTimer.toFixed(0)}s)`;
      progressText = hasPacks ? 'PRESENT' : isDestroyed ? `${destroyCd.toFixed(0)}s` : `${spawnTimer.toFixed(0)}s`;
      ringColor = '#ec4899';
      cooldownPeriodText = '生成週期: 30 秒 | 吸收成長 +0.1% (破壞70s)';
      BarStateIcon = hasPacks ? Gift : isDestroyed ? ShieldAlert : Clock;
      barStateLabel = hasPacks ? '戰場成長包等待吸收中 (生命/攻擊二選一)' : isDestroyed ? '成長包被敵方踩壞，進入 40 秒冷卻' : '咪咪希望成長包生成計時中';
      barValueDetail = `累積成長: 生命+${((ball.mimiLifeStacks || 0) * 0.1).toFixed(1)}% (${ball.mimiLifeStacks || 0}/100層) / 攻擊+${((ball.mimiAttackStacks || 0) * 0.1).toFixed(1)}% (${ball.mimiAttackStacks || 0}/100層)`;
    } else if (isDina) {
      const cd = ball.dinaCorePowerCooldown ?? 0;
      const fusionWindow = ball.dinaCurrentFusionWindow;
      const isFusionActive = !!(fusionWindow && fusionWindow.isActive && !fusionWindow.used);
      const isPerfect = !!(fusionWindow && fusionWindow.isPerfect);
      const isCoreActive = !!ball.dinaCorePowerActive;
      progress = isFusionActive ? 1.0 : cd > 0 ? Math.max(0, Math.min(1.0, (8.0 - cd) / 8.0)) : 1.0;
      isActive = isFusionActive || isCoreActive || cd <= 0.1;
      statusBadge = isFusionActive ? (isPerfect ? '【完美融合中】' : '三相融合窗口') : isCoreActive ? '核心風箏中' : cd <= 0.1 ? '核心防護就緒' : `核心冷卻 (${cd.toFixed(1)}s)`;
      progressText = isFusionActive ? (isPerfect ? 'PERFECT' : 'FUSION') : cd <= 0.1 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#a855f7';
      cooldownPeriodText = '核心防護: 8.0 秒 | 融合窗口開啟';
      BarStateIcon = isFusionActive ? Orbit : isCoreActive ? Wind : cd <= 0.1 ? Shield : Clock;
      barStateLabel = isFusionActive ? (isPerfect ? '【完美】三相融合就緒 (20魔傷+控制)' : '三相融合窗口開啟 (12魔傷+控制)') : isCoreActive ? '核心之力位移拉開距離中' : cd <= 0.1 ? '核心防護就緒 (敵近130px自動風箏)' : '核心防護冷卻充能中';
      barValueDetail = isFusionActive ? (isPerfect ? '暗光融合完美觸發，隨機附加燃燒/緩速/定神' : '可消耗一枚白光發動三相融合光球') : cd <= 0.1 ? '敵方進入 130px 危險距離時，自動向後位移至 220px 安全距離' : `核心之力充能倒數: 剩餘 ${cd.toFixed(1)} 秒 / 8.0 秒`;
    } else if (isJianxian) {
      const arrayActive = !!ball.jianxianArrayActive;
      const duration = ball.jianxianArrayDuration ?? 0;
      const cd = ball.jianxianArrayCooldown ?? 0;
      const totalDmg = ball.jianxianArrayTotalDamage ?? 0;
      progress = arrayActive ? Math.max(0, duration / 10.0) : cd > 0 ? Math.max(0, Math.min(1.0, (30.0 - cd) / 30.0)) : 1.0;
      isActive = arrayActive || cd <= 0.2;
      statusBadge = arrayActive ? `劍陣啟動中 (${duration.toFixed(1)}s)` : cd <= 0.2 ? '百萬劍陣就緒' : `劍陣冷卻 (${cd.toFixed(0)}s)`;
      progressText = arrayActive ? `${duration.toFixed(1)}s` : cd <= 0.2 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#38bdf8';
      cooldownPeriodText = '持續: 10 秒 | 冷卻: 30 秒 | 上限: 35 魔傷';
      BarStateIcon = arrayActive ? Swords : cd <= 0.2 ? Sword : Clock;
      barStateLabel = arrayActive ? `百萬劍陣全開中 (累計造成 ${totalDmg.toFixed(1)} / 35 魔傷)` : cd <= 0.2 ? '百萬劍陣守護就緒!' : '百萬劍陣真氣蓄積中';
      barValueDetail = arrayActive ? `劍陣剩餘: ${duration.toFixed(1)} 秒 / 10.0 秒 (每0.1s射出劍氣，每秒上限3.5傷)` : cd <= 0.2 ? '三柄巨型仙劍護體，萬道白色劍氣持續射向敵方' : `劍陣冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 30.0 秒`;
    } else if (isLongshen) {
      const cd = ball.longshenFlameCooldown ?? 9.5;
      const isFlaming = !!ball.longshenFlameActive;
      const duration = ball.longshenFlameDuration ?? 0;
      progress = isFlaming ? Math.max(0, duration / 2.2) : cd > 0 ? Math.max(0, Math.min(1.0, (9.5 - cd) / 9.5)) : 1.0;
      isActive = isFlaming || cd <= 0.1;
      statusBadge = isFlaming ? `噴射龍息中 (${duration.toFixed(1)}s)` : cd <= 0.1 ? '滅世龍炎就緒' : `龍炎冷卻 (${cd.toFixed(1)}s)`;
      progressText = isFlaming ? `${duration.toFixed(1)}s` : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ef4444';
      cooldownPeriodText = '噴射: 2.2 秒 | 冷卻: 9.5 秒 | 90°扇形';
      BarStateIcon = isFlaming ? Flame : cd <= 0.1 ? Zap : Clock;
      barStateLabel = isFlaming ? '狂暴滅世龍息噴射中 (滿額64火傷+融甲)' : cd <= 0.1 ? '滅世龍炎噴射就緒!' : '狂暴龍息聚能冷卻中';
      barValueDetail = isFlaming ? `龍息剩餘: ${duration.toFixed(1)} 秒 / 2.2 秒 (每0.25s 8火傷，核心每秒6真傷)` : cd <= 0.1 ? '向 90 度扇形、240px 射程噴射烈焰持續 2.2 秒' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 9.5 秒`;
    } else if (isZhizhu) {
      const cd = ball.spiderSwarmCooldown ?? 16.0;
      const minisCount = ball.spiderMiniSummons?.length ?? 0;
      isActive = minisCount > 0 || cd <= 0.1;
      progress = minisCount > 0 ? 1.0 : Math.max(0, Math.min(1.0, (16.0 - cd) / 16.0));
      statusBadge = minisCount > 0 ? `蛛群獵殺中 (${minisCount}隻)` : cd <= 0.1 ? '蛛群孵化就緒' : `蛛群冷卻 (${cd.toFixed(1)}s)`;
      progressText = minisCount > 0 ? `${minisCount}隻` : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#10b981';
      cooldownPeriodText = '冷卻週期: 16.0 秒 | 召喚 3 隻小蜘蛛';
      BarStateIcon = minisCount > 0 ? Orbit : cd <= 0.1 ? Zap : Clock;
      barStateLabel = minisCount > 0 ? `蛛群獵殺進行中 (在場 ${minisCount} 隻追擊)` : cd <= 0.1 ? '蛛群獵殺孵化就緒!' : '小蜘蛛孵化冷卻中';
      barValueDetail = minisCount > 0 ? `小蜘蛛具備獨立碰撞體系，優先狂暴追擊帶毒印敵人` : cd <= 0.1 ? '從腹部召喚 3 隻小蜘蛛 (每隻 8 HP，撲咬造成 3 物傷)' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 16.0 秒`;
    } else if (isXin) {
      const cd = ball.xinSkySlashCooldown ?? 11.0;
      const chargeTimer = ball.xinSkySlashChargeTimer ?? 0;
      const isCharging = chargeTimer > 0;
      progress = isCharging ? Math.max(0, Math.min(1.0, (0.5 - chargeTimer) / 0.5)) : Math.max(0, Math.min(1.0, (11.0 - cd) / 11.0));
      isActive = isCharging || cd <= 0.1;
      statusBadge = isCharging ? `蓄勢瞄準中 (${chargeTimer.toFixed(1)}s)` : cd <= 0.1 ? '裂空劍痕就緒' : `劍痕冷卻 (${cd.toFixed(1)}s)`;
      progressText = isCharging ? 'AIM' : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#a855f7';
      cooldownPeriodText = '冷卻週期: 11.0 秒 | 360px 終極衝擊';
      BarStateIcon = isCharging ? Crosshair : cd <= 0.1 ? Sword : Clock;
      barStateLabel = isCharging ? '裂空劍痕蓄勢鎖定中 (顯現劍痕指示線)' : cd <= 0.1 ? '裂空劍痕蓄勢完畢! (42爆發+回血/斬殺)' : '裂空劍痕真氣蓄積中';
      barValueDetail = isCharging ? `蓄力瞄準倒數: 剩餘 ${chargeTimer.toFixed(1)} 秒 / 0.5 秒` : cd <= 0.1 ? '斬出巨型雙相衝擊劍痕，光回血 / 暗斬殺暴擊，獲 40 XP' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 11.0 秒`;
    } else if (isKuileishi) {
      const cd = ball.puppetTetherCooldown ?? 0;
      progress = cd > 0 ? Math.max(0, Math.min(1.0, (4.0 - cd) / 4.0)) : 1.0;
      isActive = cd <= 0.15;
      statusBadge = cd <= 0.15 ? '牽線就緒 (減速40%)' : `牽線冷卻 (${cd.toFixed(1)}s)`;
      progressText = cd <= 0.15 ? 'READY' : `${cd.toFixed(1)}s`;
      ringColor = '#e879f9';
      cooldownPeriodText = '冷卻週期: 4.0 秒 | 射程: 400px';
      BarStateIcon = cd <= 0.15 ? Target : Clock;
      barStateLabel = cd <= 0.15 ? '命運牽線發射就緒!' : '命運牽線冷卻充能中';
      barValueDetail = cd <= 0.15 ? '發射牽線造成 8 魔傷，減速 40% 並使傀儡狂暴追擊' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 4.0 秒`;
    } else if (isYinyong) {
      const stacks = ball.yinyongRageStacks || 0;
      progress = Math.min(1.0, stacks / 10);
      isActive = stacks > 0;
      statusBadge = stacks > 0 ? `暴怒 ${stacks}/10 (+${stacks * 5}%傷)` : '等待落空累積 (0/10)';
      progressText = `${stacks}/10`;
      ringColor = stacks >= 10 ? '#facc15' : stacks >= 5 ? '#f97316' : '#ef4444';
      cooldownPeriodText = '未命中永久累積 (上限 10 層，每層+5%傷)';
      BarStateIcon = stacks >= 10 ? ShieldAlert : TrendingUp;
      barStateLabel = stacks >= 10 ? '★ 越挫越勇已達極限 10 層 (+50% 必殺傷)' : stacks > 0 ? `暴怒積累中: +${stacks * 5}% 額外增傷` : '等待一拳落空激發暴怒';
      barValueDetail = `當前層數: ${stacks} / 10 層 (每落空 1 次永久提供 +5% 傷害加成，保留至擊中)`;
    }
  } else if (index === 3) {
    triggerCount = ball.passive4Triggers ?? 0;
    isActive = true;
    progress = 1.0;
    progressText = 'READY';
    ringColor = '#38bdf8';
    cooldownPeriodText = skill.badgeText || '被動技能';
    BarStateIcon = IconComponent;
    barStateLabel = `${skill.name} 就緒`;
    barValueDetail = skill.description;

    if (isOba) {
      ringColor = '#3b82f6';
      statusBadge = '破陣衝鋒就緒';
      cooldownPeriodText = '8s 週期冷卻';
      barStateLabel = '破陣衝鋒 (8sCD)';
      barValueDetail = '脫離碰撞加速蓄勢，下次撞擊擊退敵方 60px 並追加 14 點物傷';
    } else if (isHuotong) {
      ringColor = '#ef4444';
      statusBadge = '熔火爆步就緒';
      cooldownPeriodText = '10s 週期冷卻';
      barStateLabel = '熔火爆步 (10sCD)';
      barValueDetail = '高速移動留下熔岩尾跡，碰觸敵方造成持續灼燒與減速';
    } else if (isHailaise) {
      ringColor = '#8b5cf6';
      statusBadge = '潮汐重壓就緒';
      cooldownPeriodText = '9s 週期冷卻';
      barStateLabel = '潮汐重壓 (9sCD)';
      barValueDetail = '釋放暗潮重力場壓制周圍，降低敵方移速並引爆魔法震盪';
    } else if (isLingyinsi) {
      ringColor = '#10b981';
      statusBadge = '殘影步法就緒';
      cooldownPeriodText = '7s 週期冷卻';
      barStateLabel = '殘影步法 (7sCD)';
      barValueDetail = '受擊時留下替身殘影迷惑敵方，並朝安全方位反向滑行';
    } else if (isChanshi) {
      ringColor = '#f59e0b';
      statusBadge = '菩提金鐘就緒';
      cooldownPeriodText = '12s 週期冷卻';
      barStateLabel = '菩提金鐘 (12sCD)';
      barValueDetail = '召喚佛光金鐘護體，抵消下一次致命衝撞並震開周圍敵方';
    } else if (isHuangzuan) {
      ringColor = '#eab308';
      statusBadge = '金晶破甲就緒';
      cooldownPeriodText = '6s 週期冷卻';
      barStateLabel = '金晶破甲 (6sCD)';
      barValueDetail = '電弧穿甲衝擊，破壞敵方防護抗性並造成額外穿透電擊';
    } else if (isLanzuan) {
      ringColor = '#06b6d4';
      statusBadge = '蒼藍冰鏡就緒';
      cooldownPeriodText = '10s 週期冷卻';
      barStateLabel = '蒼藍冰鏡 (10sCD)';
      barValueDetail = '生成一面冰晶鏡盾，阻擋正面投射物並反射部分傷害';
    } else if (isFenzuan) {
      ringColor = '#ec4899';
      statusBadge = '治癒晶芒就緒';
      cooldownPeriodText = '12s 週期冷卻';
      barStateLabel = '治癒晶芒 (12sCD)';
      barValueDetail = '收盾散發粉晶柔光，瞬間修復自身 28 HP 並生成加速光徑';
    } else if (isBaizuan) {
      ringColor = '#e2e8f0';
      statusBadge = '折射刺殺就緒';
      cooldownPeriodText = '5.5s 週期冷卻';
      barStateLabel = '折射刺殺 (5.5sCD)';
      barValueDetail = '撞牆反彈後進入折射隱光，無視 35% 防禦並追加 16 點刺殺傷害';
    } else if (isXukongshou) {
      ringColor = '#a855f7';
      statusBadge = '虛空潛行就緒';
      cooldownPeriodText = '8.5s 週期冷卻';
      barStateLabel = '虛空潛行 (8.5sCD)';
      barValueDetail = '招式結束後進入潛行 1.5 秒，移速提升 35% 且下次攻擊附加 14 暗傷';
    } else if (isFan) {
      ringColor = '#eab308';
      statusBadge = '弱點洞察常駐';
      cooldownPeriodText = '距離>220px 常駐';
      barStateLabel = '遠距弱點洞察';
      barValueDetail = '目標距離大於 220px 時箭矢傷害提升 25%，20% 機率附加雙獵痕';
    } else if (isTunshimozu) {
      ringColor = '#7e22ce';
      statusBadge = '魔能硬皮生效';
      cooldownPeriodText = '每5個碎片生成1層';
      barStateLabel = '魔能硬皮抵傷';
      barValueDetail = '每吞噬 5 個能量碎片生成 1 層硬皮 (上限2層)，每層抵消 16 傷害';
    } else if (isMimi) {
      ringColor = '#f43f5e';
      statusBadge = '貓咪九命保底';
      cooldownPeriodText = '每場戰鬥限 1 次';
      barStateLabel = '貓咪九命瀕死保底';
      barValueDetail = '致命傷時保留 1 HP 獲 1.2 秒無敵護罩並向後彈跳';
    } else if (isJiandaoshou) {
      ringColor = '#cbd5e1';
      statusBadge = '縫合收線蓄勢';
      cooldownPeriodText = '4段縫合線 (6sCD)';
      barStateLabel = '縫合收線 (6sCD)';
      barValueDetail = '累計 4 段縫合線強制收線，造成 24 點魔法傷害並打斷敵方移動';
    } else if (isDina) {
      ringColor = '#c084fc';
      statusBadge = '極光共鳴帶就緒';
      cooldownPeriodText = '5s 週期冷卻';
      barStateLabel = '極光共鳴帶 (5sCD)';
      barValueDetail = '暗光或三相身後留極光帶，敵碰每秒 9 魔傷，自身穿過回能量與移速';
    } else if (isJianxian) {
      ringColor = '#38bdf8';
      statusBadge = '萬劍歸宗蓄勢';
      cooldownPeriodText = '每6柄仙劍觸發';
      barStateLabel = '萬劍歸宗巨靈劍';
      barValueDetail = '每累積發射 6 柄仙劍召喚巨靈飛劍直插敵人，造成 20 魔傷與擊退';
    } else if (isLongshen) {
      const cd = ball.longshenFormCooldown ?? 24;
      const isDragonForm = !!ball.longshenFormActive;
      const duration = ball.longshenFormDuration ?? 0;
      progress = isDragonForm ? Math.max(0, duration / 10.0) : cd > 0 ? Math.max(0, Math.min(1.0, (24.0 - cd) / 24.0)) : 1.0;
      isActive = isDragonForm || cd <= 0.1;
      statusBadge = isDragonForm ? `真龍形態中 (${duration.toFixed(1)}s)` : cd <= 0.1 ? '真龍降世就緒' : `真龍冷卻 (${cd.toFixed(0)}s)`;
      progressText = isDragonForm ? `${duration.toFixed(1)}s` : cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#ef4444';
      cooldownPeriodText = '持續: 10 秒 | 冷卻: 24 秒 | 真龍形態';
      BarStateIcon = isDragonForm ? Flame : cd <= 0.1 ? Sparkles : Clock;
      barStateLabel = isDragonForm ? '神龍真形降臨中 (移速+40% / 150火傷領域)' : cd <= 0.1 ? '真龍降世覺醒就緒!' : '真龍之魂聚能冷卻中';
      barValueDetail = isDragonForm ? `真龍領域剩餘: ${duration.toFixed(1)} 秒 / 10.0 秒 (降下龍炎，冷卻加速25%)` : cd <= 0.1 ? '變身神龍真形，釋放天地龍吟造成 40 爆發傷並開啟焚滅領域' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 24.0 秒`;
    } else if (isZhizhu) {
      const cd = ball.spiderBurstCooldown ?? ball.spiderQueenBurstCooldown ?? 27.0;
      progress = Math.max(0, Math.min(1.0, (27.0 - cd) / 27.0));
      isActive = cd <= 0.1;
      statusBadge = cd <= 0.1 ? '蛛后毒爆就緒' : `毒爆冷卻 (${cd.toFixed(0)}s)`;
      progressText = cd <= 0.1 ? 'READY' : `${cd.toFixed(0)}s`;
      ringColor = '#10b981';
      cooldownPeriodText = '冷卻週期: 27.0 秒 | 160px 毒液風暴';
      BarStateIcon = cd <= 0.1 ? Skull : Clock;
      barStateLabel = cd <= 0.1 ? '蛛后毒爆就緒 (18毒傷 + 引爆14真傷)' : '深層毒囊蓄毒充能中';
      barValueDetail = cd <= 0.1 ? '引爆 160px 毒液風暴，帶毒印目標額外引爆 14 穿透真傷' : `冷卻倒數: 剩餘 ${cd.toFixed(1)} 秒 / 27.0 秒`;
    } else if (isXin) {
      const lvl = ball.xinLevel ?? 1;
      const exp = ball.xinExp ?? 0;
      const form = ball.xinForm || 'balance';
      const formEnergy = ball.xinFormEnergy ?? 0;
      isActive = true;
      progress = lvl >= 6 ? 1.0 : Math.min(1.0, exp / 100);
      statusBadge = `魔劍 Lv.${lvl} (${form === 'dark' ? '暗・狂暴' : form === 'light' ? '光・統御' : '平衡'})`;
      progressText = `Lv.${lvl}`;
      ringColor = form === 'dark' ? '#c084fc' : form === 'light' ? '#fbbf24' : '#f59e0b';
      cooldownPeriodText = `成長階級: Lv.${lvl}/6 · 全傷+${lvl * 10}%`;
      BarStateIcon = Sparkles;
      barStateLabel = `雙相戰魂 Lv.${lvl} · ${form === 'dark' ? '暗之魔劍(狂暴)' : form === 'light' ? '光之魔劍(統御)' : '平衡魔劍'}`;
      barValueDetail = `等級經驗: ${exp}/100 XP (HP+${lvl * 25}, 傷害+${lvl * 10}%) | 形態能量: ${Math.round(formEnergy)}/100`;
    } else if (isKuileishi) {
      const resonance = ball.puppetResonance || 0;
      const cd = ball.puppetFinaleCooldown ?? 0;
      progress = resonance >= 3 && cd <= 0.15 ? 1.0 : cd > 0 ? Math.max(0, Math.min(1.0, (12.0 - cd) / 12.0)) : resonance / 3;
      isActive = resonance >= 3 && cd <= 0.15;
      statusBadge = resonance >= 3 && cd <= 0.15 ? '★ 終幕就緒 (46傷)' : cd > 0 ? `終幕冷卻 (${cd.toFixed(1)}s)` : `共鳴 ${resonance}/3層`;
      progressText = resonance >= 3 ? 'READY' : `${resonance}/3`;
      ringColor = resonance >= 3 ? '#f472b6' : '#a855f7';
      cooldownPeriodText = '冷卻週期: 12 秒 | 需 3 層共鳴+牽線';
      BarStateIcon = resonance >= 3 ? Zap : Clock;
      barStateLabel = resonance >= 3 && cd <= 0.15 ? '★ 木偶終幕待命！即將爆發 46 點傷害' : cd > 0 ? '木偶終幕冷卻充能中' : `等待共鳴蓄滿 (${resonance}/3 層)`;
      barValueDetail = resonance >= 3 && cd <= 0.15 ? '目標被牽線時傀儡突進連鎖引爆 46 點高爆發與 0.9s 定身' : `當前共鳴: ${resonance}/3 層 (替身減傷 65% 保護生效中)`;
    } else if (isYinyong) {
      if (ball.yinyongBoundlessActive) {
        const remain = ball.yinyongBoundlessDuration ?? 4.0;
        progress = Math.max(0, Math.min(1.0, remain / 4.0));
        isActive = true;
        statusBadge = `★ 絕對免傷中 (${remain.toFixed(1)}s)`;
        progressText = `${remain.toFixed(1)}s`;
        ringColor = '#ef4444';
        cooldownPeriodText = '持續時長: 4.0 秒 (雙方絕對免傷)';
        BarStateIcon = Crosshair;
        barStateLabel = '★ 一拳無界領域展開！雙方絕對免傷';
        barValueDetail = `領域持續剩餘: ${remain.toFixed(1)} 秒 / 4.0 秒 (結束後回流恢復 10% 最大生命 36 HP)`;
      } else if (ball.yinyongBoundlessUsed) {
        progress = 0;
        isActive = false;
        statusBadge = '本場已觸發 (限1次)';
        progressText = 'EXHAUST';
        ringColor = '#475569';
        cooldownPeriodText = '每場戰鬥限生效 1 次';
        BarStateIcon = Check;
        barStateLabel = '一拳無界已消耗';
        barValueDetail = '瀕死免死與生命回流已於本場戰鬥生效完畢';
      } else {
        const hpRatio = ball.hp / ball.maxHp;
        progress = 1.0;
        isActive = hpRatio <= 0.2;
        statusBadge = hpRatio <= 0.2 ? '瀕死警戒 (就緒)' : '瀕死鎖血就緒 (HP<1%)';
        progressText = 'READY';
        ringColor = '#dc2626';
        cooldownPeriodText = '觸發條件: 瀕死 HP ≤ 1% (≤ 3.6 HP)';
        BarStateIcon = ShieldCheck;
        barStateLabel = '一拳無界瀕死保護充能完好';
        barValueDetail = '受到致命傷害或 HP ≤ 1% 時自動鎖血 1 HP，雙方免傷 4 秒並恢復 36 HP';
      }
    }
  }

  const typeLabels = ['自身基礎強化', '碰撞/反彈強化', '特殊機制', '終極特性/戰術秘技'];

  // SVG Circular Gauge Math
  const radius = 18;
  const circumference = 2 * Math.PI * radius; // ~113.1
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      id={`skill-${ball.id}-${index}`}
      className={`relative p-3 rounded-xl border transition-all duration-300 overflow-hidden ${
        isActive
          ? 'bg-slate-900/95 border-amber-400/80 shadow-[0_0_16px_rgba(251,191,36,0.22)] ring-1 ring-amber-400/40'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Background soft ambient glow when ready */}
      {isActive && (
        <div
          className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: ringColor }}
        />
      )}

      <div className="flex items-start justify-between gap-2.5 relative z-10">
        <div className="flex items-center gap-3">
          {/* Circular Progress Gauge with Skill Icon inside */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
              {/* Background Track */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="transparent"
              />
              {/* Active / Cooldown Progress Ring */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                stroke={ringColor}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-200 ease-out"
                style={{
                  filter: isActive ? `drop-shadow(0 0 5px ${ringColor})` : 'none'
                }}
              />
            </svg>

            {/* Centered Skill Icon */}
            <div
              className={`absolute inset-0 m-auto w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-slate-800 text-amber-300 shadow-inner' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Mini Progress Percentage / Stack pill on bottom-right of circle */}
            <span
              className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold border shadow ${
                isActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {progressText}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                被動{['一', '二', '三', '四'][index]}
              </span>
              <span className="text-sm font-black text-slate-100 whitespace-nowrap">{skill.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/90 text-sky-300 font-mono font-bold border border-slate-700/80 whitespace-nowrap">
                {cooldownPeriodText}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
              <span>{typeLabels[index]}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5 text-slate-500" />
                {isActive ? '即時生效中' : '冷卻蓄能中'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge: Non-blocking responsive pill */}
        <div className="flex items-center self-start sm:self-center shrink-0">
          <span
            className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-tight border transition-colors ${
              isActive
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                : 'bg-slate-800/90 text-slate-400 border-slate-700'
            }`}
          >
            {statusBadge}
          </span>
        </div>
      </div>

      {/* Dynamic Skill Description with flowing keywords & status glow */}
      <FlowingSkillDescription
        text={skill.description}
        accentColor={ringColor}
        isShimmering={isActive}
        waveIndex={index}
        className="mt-2 text-xs"
      />

      {/* 技能冷卻條與即時狀態字條優化 (Optimized Cooldown Bar & Status Strip) */}
      <div className="mt-2.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-1.5 relative overflow-hidden">
        {/* Cooldown Bar Top Status Line */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isActive ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse' : 'bg-slate-700'
              }`}
            />
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 flex items-center gap-1 ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_6px_rgba(251,191,36,0.2)]'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <BarStateIcon className="w-3 h-3 shrink-0" />
              <span>{barStateLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300 font-bold shrink-0 ml-2">
            <span className="text-slate-400">充能</span>
            <span className="text-sky-400 font-black">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* High-Definition Glowing Cooldown Track Bar with Moving Energy Beam */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 relative shadow-inner p-0.5">
          <div
            className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
            style={{
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: ringColor,
              boxShadow: isActive ? `0 0 10px ${ringColor}, 0 0 4px #ffffff` : 'none'
            }}
          >
            {/* Moving light beam on cooldown bar */}
            <div className="energy-beam-flow" />
            {isActive && (
              <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
            )}
          </div>
        </div>

        {/* Cooldown Bar Bottom Detail & Trigger Count Strip */}
        <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5 gap-2">
          <span className="text-slate-300 font-mono font-medium leading-tight break-words">
            {barValueDetail || cooldownPeriodText}
          </span>

          <div className="flex items-center gap-1 shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 self-end">
            <span className="text-slate-400 text-[9px]">累計觸發</span>
            <span className="font-mono font-bold text-amber-300 text-[10px]">{triggerCount} 次</span>
          </div>
        </div>
      </div>
    </div>
  );
};

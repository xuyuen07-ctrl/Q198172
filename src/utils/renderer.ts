import { CharacterId, Particle, Projectile, LingyinsiClone, OrbitingGreenOrb, LanzuanBlueOrb, BaizuanMirrorClone, VoidRift, EnergyShard, MimiGrowthPack, SpiderWebZone, SpiderMiniSummon } from '../types/game';
import { CHARACTERS } from '../data/characters';
import {
  drawObaFeatures,
  drawHuotongFeatures,
  drawHailaiseFeatures,
  drawLingyinsiFeatures,
  drawChanshiFeatures,
  drawHuangzuanFeatures,
  drawLanzuanFeatures,
  drawFenzuanFeatures,
  drawBaizuanFeatures,
  drawXukongshouFeatures,
  drawFanFeatures,
  drawTunshimozuFeatures,
  drawMimiFeatures,
  drawJiandaoshouFeatures,
  drawDinaFeatures,
  drawJianxianFeatures,
  drawLongshenFeatures,
  drawZhizhuFeatures,
  drawXinFeatures,
  drawKuileishiFeatures,
  drawCombatPuppet,
  drawYinyongFeatures,
  drawYinyongBoundlessDomain,
  drawManyaiyaFeatures
} from './characterRenderers';
import { drawCharacterExclusiveOutfit } from './characterOutfits';

export { drawCombatPuppet, drawYinyongBoundlessDomain, drawCharacterExclusiveOutfit, drawManyaiyaFeatures };

export interface ChampionRenderOptions {
  time?: number;
  hasChargedBounce?: boolean;
  hasExplosiveBounce?: boolean;
  isHotBody?: boolean;
  shieldActiveTimer?: number;
  hitFlashTimer?: number;
  consecutiveHits?: number;
  magicEnergy?: number;
  energyBeamCooldown?: number;
  hailaiseShield?: number;
  hailaiseMaxShield?: number;
  hailaiseBombCooldown?: number;
  hasTriggeredPossession?: boolean;
  clonesCount?: number;
  greenOrbsActive?: boolean;
  chanshiSuperArmorTimer?: number;
  chanshiBellShieldTimer?: number;
  chanshiHealingAnimTimer?: number;
  chanshiGoldenBodyUsed?: boolean;
  chanshiAuraWaveRadius?: number;
  isSlowedByChanshi?: boolean;
  huangzuanSpeedStacks?: number;
  huangzuanSpeedCooldown?: number;
  huangzuanFieldActive?: boolean;
  huangzuanFieldDuration?: number;
  isParalyzed?: boolean;
  paralysisTimer?: number;
  isSlowedByLanzuan?: boolean;
  lanzuanEmotionFieldActive?: boolean;
  fenzuanShieldActive?: boolean;
  fenzuanFieldActive?: boolean;
  isProtectedByFenzuanField?: boolean;
  fenzuanBubbleActive?: boolean;
  baizuanCloneActive?: boolean;
  baizuanShiningActive?: boolean;
  baizuanRayActive?: boolean;
  isBlanchedAndImmobilized?: boolean;
  blanchedTimer?: number;
  xukongshouBiteActive?: boolean;
  xukongshouBiteDuration?: number;
  xukongshouBiteAngle?: number;
  isInvulnerable?: boolean;
  isBittenByVoidBeast?: boolean;
  isTrappedInVoid?: boolean;
  isLockedByVoidHunt?: boolean;
  lockedByVoidHuntTimer?: number;
  isPhantomDash?: boolean;
  fanHunterMarks?: number;
  fanRollCooldown?: number;
  fanIsRolling?: boolean;
  fanHasRangeBoost?: boolean;
  fanOverclockActive?: boolean;
  growthStacks?: number;
  isGluttonyBurstReady?: boolean;
  devourImploding?: boolean;
  mimiClawAnimTimer?: number;
  mimiLifeStacks?: number;
  mimiAttackStacks?: number;
  isBleedingByMimi?: boolean;
  bleedTimer?: number;
  isCharmedByMimi?: boolean;
  charmedByMimiTimer?: number;
  jiandaoshouSnipAnimTimer?: number;
  jiandaoshouCoreGlowTimer?: number;
  jiandaoshouMistActive?: boolean;
  isSlowedByNeedle?: boolean;
  slowedByNeedleTimer?: number;
  dinaHaloRotationAngle?: number;
  dinaDarkLightState?: string;
  dinaPerfectAbsorb?: boolean;
  dinaCorePowerActive?: boolean;
  dinaWhiteEnergyCount?: number;
  jianxianOrbitSwordAngle?: number;
  jianxianArrayActive?: boolean;
  jianxianArrayDuration?: number;
  jianxianRetreatAnimTimer?: number;
  isSlowedByJianxian?: boolean;
  slowedByJianxianTimer?: number;
  longshenFormActive?: boolean;
  longshenFormDuration?: number;
  longshenSwoopActive?: boolean;
  longshenStrikeAnimTimer?: number;
  longshenFlameActive?: boolean;
  longshenFlameAngle?: number;
  longshenFormWingPhase?: number;
  spiderVenomFangAnimTimer?: number;
  spiderBurstAnimTimer?: number;
  spiderPoisonMarkTimer?: number;
  isSlowedBySpiderWeb?: boolean;
  xinForm?: 'balance' | 'light' | 'dark';
  xinLevel?: number;
  xinFormEnergy?: number;
  xinShieldAmount?: number;
  xinShadowDashing?: boolean;
  xinShadowDashAnimTimer?: number;
  xinSkySlashChargeTimer?: number;
  xinShadowDashChargeTimer?: number;
  xinBasicSlashAnimTimer?: number;
  xinLockAimAngle?: number;
  xinSwordOrbitAngle?: number;
  xinExpAbsorbTimer?: number;
  xinUpgradeAnimTimer?: number;
  xinSwordVibrate?: number;
  facingAngle?: number;
  speed?: number;
  targetX?: number;
  targetY?: number;
  vx?: number;
  vy?: number;
  isFlashing?: boolean;
  opacity?: number;
  showDetails?: boolean;
  puppetResonance?: number;
  puppetAegisTimer?: number;
  puppetSubstituteCooldown?: number;
  puppetTetherAnimTimer?: number;
  isTetheredByPuppeteer?: boolean;
  puppetFinaleStandby?: boolean;
  yinyongState?: 'READY' | 'SEARCHING' | 'CHARGING' | 'TELEPORTING' | 'DECLARING' | 'PUNCHING' | 'SUCCESS' | 'MISS' | 'COOLDOWN' | 'FAIL_RECOVERY';
  yinyongChargeTimer?: number;
  yinyongMaxCharge?: number;
  yinyongDeclareTimer?: number;
  yinyongPunchAnimTimer?: number;
  yinyongMissAnimTimer?: number;
  yinyongRageStacks?: number;
  yinyongBoundlessActive?: boolean;
  yinyongBoundlessDuration?: number;
  yinyongImmortalAnimTimer?: number;
  yinyongAfterimageTimer?: number;
  yinyongFacingAngle?: number;
  junkoMemoryFragments?: number;
  junkoEyeAwakened?: boolean;
  junkoEyeAwakenTimer?: number;
  junkoHolyKnightActive?: boolean;
  junkoHolyKnightDuration?: number;
  junkoIsDashing?: boolean;
  junkoDashesRemaining?: number;
  junkoTetherPullTimer?: number;
  isBoundByJunko?: boolean;
  isSnaredByJunko?: boolean;
  isSlowedByJunko?: boolean;
  junkoVulnerableStacks?: number;
}

/**
 * Unified Champion Sphere Renderer
 * Ensures 100% visual consistency between Champion Select and In-game Arena!
 */
export function drawChampionSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  charId: CharacterId,
  options: ChampionRenderOptions = {}
) {
  const {
    time = Date.now() * 0.001,
    hasChargedBounce = false,
    hasExplosiveBounce = false,
    isHotBody = false,
    shieldActiveTimer = 0,
    hitFlashTimer = 0,
    consecutiveHits = 0,
    magicEnergy = 0,
    hailaiseShield = 0,
    hailaiseMaxShield = 50,
    hailaiseBombCooldown = 40,
    hasTriggeredPossession = false,
    clonesCount = 0,
    greenOrbsActive = false,
    chanshiSuperArmorTimer = 0,
    chanshiBellShieldTimer = 0,
    chanshiHealingAnimTimer = 0,
    chanshiGoldenBodyUsed = false,
    isSlowedByChanshi = false,
    huangzuanSpeedStacks = 0,
    huangzuanSpeedCooldown = 0,
    huangzuanFieldActive = false,
    huangzuanFieldDuration = 0,
    isParalyzed = false,
    paralysisTimer = 0,
    isSlowedByLanzuan = false,
    lanzuanEmotionFieldActive = false,
    fenzuanShieldActive = false,
    fenzuanFieldActive = false,
    isProtectedByFenzuanField = false,
    fenzuanBubbleActive = false,
    baizuanCloneActive = false,
    baizuanShiningActive = false,
    baizuanRayActive = false,
    isBlanchedAndImmobilized = false,
    blanchedTimer = 0,
    xukongshouBiteActive = false,
    xukongshouBiteDuration = 0,
    xukongshouBiteAngle = 0,
    isInvulnerable = false,
    isBittenByVoidBeast = false,
    isTrappedInVoid = false,
    isLockedByVoidHunt = false,
    lockedByVoidHuntTimer = 0,
    isPhantomDash = false,
    fanHunterMarks = 0,
    fanRollCooldown = 0,
    fanIsRolling = false,
    fanHasRangeBoost = false,
    fanOverclockActive = false,
    growthStacks = 0,
    isGluttonyBurstReady = true,
    devourImploding = false,
    mimiClawAnimTimer = 0,
    mimiLifeStacks = 0,
    mimiAttackStacks = 0,
    isBleedingByMimi = false,
    bleedTimer = 0,
    isCharmedByMimi = false,
    charmedByMimiTimer = 0,
    longshenFormActive = false,
    longshenFormDuration = 0,
    longshenSwoopActive = false,
    longshenStrikeAnimTimer = 0,
    longshenFlameActive = false,
    longshenFlameAngle = 0,
    longshenFormWingPhase = 0,
    opacity = 1.0,
    showDetails = true
  } = options;

  const config = CHARACTERS[charId] || CHARACTERS.oba;
  const isOba = charId === 'oba';
  const isHuotong = charId === 'huotong';
  const isHailaise = charId === 'hailaise';
  const isLingyinsi = charId === 'lingyinsi';
  const isChanshi = charId === 'chanshi';
  const isHuangzuan = charId === 'huangzuan';
  const isLanzuan = charId === 'lanzuan';
  const isFenzuan = charId === 'fenzuan';
  const isBaizuan = charId === 'baizuan';
  const isXukongshou = charId === 'xukongshou';
  const isFan = charId === 'fan';
  const isTunshimozu = charId === 'tunshimozu';
  const isMimi = charId === 'mimi';
  const isLongshen = charId === 'longshen';
  const isZhizhu = charId === 'zhizhu';
  const isXin = charId === 'xin';
  const isKuileishi = charId === 'kuileishi';
  const isYinyong = charId === 'yinyong';
  const isManyaiya = charId === 'manyaiya';

  ctx.save();
  // Semi-transparent phantom when sprinting or in phantom dash mode
  if (isPhantomDash || (isXukongshou && isPhantomDash)) {
    ctx.globalAlpha = opacity * 0.42;
  } else {
    ctx.globalAlpha = opacity;
  }

  // -------------------------------------------------------------
  // 1. DYNAMIC EXTERNAL AURAS & STATUS RINGS
  // -------------------------------------------------------------
  if (options.spiderPoisonMarkTimer && options.spiderPoisonMarkTimer > 0) {
    // 蛛毒印記特效：環繞劇毒翡翠霧氣與毒液氣泡
    ctx.save();
    const poisonAlpha = Math.min(1.0, options.spiderPoisonMarkTimer / 1.0);
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.85 * poisonAlpha})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, time * 3, time * 3 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 毒素氣泡微粒
    for (let i = 0; i < 3; i++) {
      const pa = time * 4 + (i * Math.PI * 2) / 3;
      const px = x + Math.cos(pa) * (radius + 6);
      const py = y + Math.sin(pa) * (radius + 6);
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (options.isSlowedBySpiderWeb) {
    // 獵網束縛黏滯特效：蛛絲白色黏液牽引圈
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 6, -time * 2, -time * 2 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  if (isParalyzed) {
    // 麻痺狀態特效 (細小黃色電弧環繞)
    ctx.save();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 12;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, time * 8, time * 8 + Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      const a = time * 10 + (i * Math.PI) / 2;
      const rx = x + Math.cos(a) * (radius + 6);
      const ry = y + Math.sin(a) * (radius + 6);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (isSlowedByLanzuan) {
    // 藍鑽情緒減速特效 (柔和半透明天藍色減速微光與水滴光點)
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, -time * 3, -time * 3 + Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      const a = -time * 4 + (i * Math.PI) / 2;
      const px = x + Math.cos(a) * (radius + 6);
      const py = y + Math.sin(a) * (radius + 6);
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (fanHunterMarks && fanHunterMarks > 0) {
    // 白色獵痕環繞光圈 (1~2層為旋轉白色環，即將引爆時高亮)
    ctx.save();
    for (let m = 0; m < Math.min(3, fanHunterMarks); m++) {
      const ringOffset = 4 + m * 4;
      const spinAngle = time * (3 + m * 1.5) + (m * Math.PI) / 2;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius + ringOffset, spinAngle, spinAngle + (Math.PI * 4) / 3);
      ctx.stroke();

      // Small white diamond notch on the ring
      const notchX = x + Math.cos(spinAngle) * (radius + ringOffset);
      const notchY = y + Math.sin(spinAngle) * (radius + ringOffset);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(notchX, notchY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (isOba) {
    // --- OBA (奧巴): Kinetic Shockwaves, Mach Cones, & Berserk Overcharge ---
    // 被動三【狂撞】蓄力準備 (連續碰撞達到3次時，球體爆發金紅過載狂暴氣場)
    if (consecutiveHits >= 3) {
      ctx.save();
      const collapsePhase = (time * 4) % 1;
      const ringR = radius + 20 - collapsePhase * 16;

      // 1. Rapidly collapsing crimson shockwave intake ring
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.0;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 20;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(radius + 3, ringR), 0, Math.PI * 2);
      ctx.stroke();

      // 2. Fierce golden-crimson berserk overdrive plasma arcs
      const arcCount = 5;
      for (let i = 0; i < arcCount; i++) {
        const a1 = (i * Math.PI * 2) / arcCount + time * 6;
        const a2 = a1 + (Math.PI / 4) * (0.8 + Math.sin(time * 18 + i) * 0.4);
        const arcR = radius + 6 + Math.sin(time * 14 + i) * 4;
        ctx.strokeStyle = i % 2 === 0 ? '#fef08a' : '#ef4444';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(x, y, arcR, a1, a2);
        ctx.stroke();
      }

      // 3. 3-Stage Overcharge Combo Indicator Sigils
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3 + time * 1.5;
        const px = x + Math.cos(a) * (radius + 12);
        const py = y + Math.sin(a) * (radius + 12);
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Inner white spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Ground tremor shockwave pulse
      const tremorR = radius + 10 + Math.sin(time * 10) * 3;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 2.0;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x, y, tremorR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (consecutiveHits > 0) {
      // Show combo pips for hits 1 and 2
      ctx.save();
      for (let i = 0; i < consecutiveHits; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
        const px = x + Math.cos(a) * (radius + 8);
        const py = y + Math.sin(a) * (radius + 8);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 奧巴 被動二【反震 (蓄力反彈)】: 超音速錐形動能激波 & 推進渦輪光環
    if (hasChargedBounce) {
      ctx.save();
      const pulse = Math.sin(time * 10) * 3;

      // 1. Dual Golden Kinetic Acceleration Rings
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 8 + pulse, time * 3, time * 3 + Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 4 - pulse * 0.5, -time * 4, -time * 4 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Supersonic Kinetic Chevron Air-Brakes
      for (let i = 0; i < 4; i++) {
        const a = time * 2.5 + (i * Math.PI) / 2;
        const cx1 = x + Math.cos(a) * (radius + 11);
        const cy1 = y + Math.sin(a) * (radius + 11);
        const cx2 = x + Math.cos(a + 0.15) * (radius + 14);
        const cy2 = y + Math.sin(a + 0.15) * (radius + 14);
        const cx3 = x + Math.cos(a + 0.3) * (radius + 11);
        const cy3 = y + Math.sin(a + 0.3) * (radius + 11);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.lineTo(cx3, cy3);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Aegis Kinetic Armor Ring (Subtle tech aegis for Oba)
    if (showDetails) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting Golden Aegis Runes
      for (let i = 0; i < 3; i++) {
        const angle = time * 1.5 + (i * Math.PI * 2) / 3;
        const rx = x + Math.cos(angle) * (radius + 3.5);
        const ry = y + Math.sin(angle) * (radius + 3.5);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  } else if (isHuotong) {
    // --- HUOTONG (火桶): Molten Flame Carapace & Meteor Conflagration ---
    // 火桶 被動二【厚重桶身】受擊防護罩 (熔岩晶甲弧盾)
    if (shieldActiveTimer > 0) {
      ctx.save();
      const shieldAlpha = Math.min(0.95, shieldActiveTimer * 2.8);

      // 3 Orbiting Magma Shell Plates
      for (let i = 0; i < 3; i++) {
        const plateAngle = time * 3.5 + (i * Math.PI * 2) / 3;
        const plateR = radius + 7 + Math.sin(time * 8 + i) * 1.5;
        const span = 0.42;

        ctx.strokeStyle = `rgba(251, 146, 60, ${shieldAlpha})`;
        ctx.lineWidth = 4.2;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(x, y, plateR, plateAngle - span, plateAngle + span);
        ctx.stroke();

        // Inner glowing magma vein
        ctx.strokeStyle = `rgba(254, 240, 138, ${shieldAlpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, plateR, plateAngle - span * 0.7, plateAngle + span * 0.7);
        ctx.stroke();
      }

      // Volcanic Amber Radial Shield Dome
      const shieldGrad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius + 9);
      shieldGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
      shieldGrad.addColorStop(0.65, `rgba(249, 115, 22, ${shieldAlpha * 0.28})`);
      shieldGrad.addColorStop(1, `rgba(254, 240, 138, ${shieldAlpha * 0.65})`);
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Fiery Blaze Aura (Hot Body or Explosive Bounce: 熾烈熔岩氣旋與爆發核心)
    if (isHotBody || hasExplosiveBounce) {
      ctx.save();
      const flameCount = 10;
      const baseR = radius + 6;

      // 1. Swirling Volcanic Plasma Flames
      for (let i = 0; i < flameCount; i++) {
        const angle = (i * Math.PI * 2) / flameCount + time * 3.8;
        const wave = Math.sin(time * 14 + i * 1.5) * 4.5;
        const fx = x + Math.cos(angle) * (baseR + wave);
        const fy = y + Math.sin(angle) * (baseR + wave);
        
        ctx.fillStyle = hasExplosiveBounce
          ? (i % 2 === 0 ? '#ff7700' : '#fef08a')
          : (i % 2 === 0 ? '#ef4444' : '#f97316');
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(fx, fy, 3.2 + Math.sin(time * 12 + i) * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Orbiting Pyroclastic Plasma Orbs for Explosive Bounce
      if (hasExplosiveBounce) {
        for (let i = 0; i < 3; i++) {
          const orbA = -time * 5 + (i * Math.PI * 2) / 3;
          const ox = x + Math.cos(orbA) * (radius + 11);
          const oy = y + Math.sin(orbA) * (radius + 11);

          // Pyroclastic Core
          const orbGrad = ctx.createRadialGradient(ox, oy, 1, ox, oy, 6);
          orbGrad.addColorStop(0, '#ffffff');
          orbGrad.addColorStop(0.4, '#fed7aa');
          orbGrad.addColorStop(0.8, '#f97316');
          orbGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
          ctx.fillStyle = orbGrad;
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(ox, oy, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Outer incandescent flame corona boundary
      ctx.strokeStyle = hasExplosiveBounce ? '#ff9900' : '#dc2626';
      ctx.lineWidth = 2.8;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(x, y, radius + 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (showDetails) {
      // Subtle ambient heat ring
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  } else if (isHailaise) {
    // --- HAILAISE (海萊斯): Ancient Arcane Glyphs & Nether Void Sigil ---
    ctx.save();
    
    // 被動三【魔法附體】冥界虛空冠冕與噬魂法瞳
    if (hasTriggeredPossession) {
      const vortexR = radius + 9;
      // Nether spirit horns & rotating dark eyes
      for (let i = 0; i < 6; i++) {
        const a = time * 4.2 + (i * Math.PI * 2) / 6;
        const vx = x + Math.cos(a) * vortexR;
        const vy = y + Math.sin(a) * vortexR;
        ctx.fillStyle = i % 2 === 0 ? '#581c87' : '#c084fc';
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(vx, vy, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // White core glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(vx, vy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Void crown horns
      for (let i = 0; i < 3; i++) {
        const hornA = -Math.PI / 2 + ((i - 1) * Math.PI) / 4;
        const hx1 = x + Math.cos(hornA - 0.15) * (radius + 6);
        const hy1 = y + Math.sin(hornA - 0.15) * (radius + 6);
        const hx2 = x + Math.cos(hornA) * (radius + 14);
        const hy2 = y + Math.sin(hornA) * (radius + 14);
        const hx3 = x + Math.cos(hornA + 0.15) * (radius + 6);
        const hy3 = y + Math.sin(hornA + 0.15) * (radius + 6);

        ctx.fillStyle = 'rgba(192, 132, 252, 0.85)';
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(hx1, hy1);
        ctx.lineTo(hx2, hy2);
        ctx.lineTo(hx3, hy3);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Magic Energy Stored Field (Passive 1: 遠古奧術符文環隨能量層級演進，上限 45)
    if (magicEnergy > 0) {
      const energyRatio = Math.min(1.0, magicEnergy / 45);
      const pulse = Math.sin(time * 6) * (2 + energyRatio * 3.5);
      const ringR = radius + 6 + pulse;

      // 1. Outer Arcane Runic Ring
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 + energyRatio * 0.5})`;
      ctx.lineWidth = 2.2 + energyRatio * 2.5;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 14 + energyRatio * 16;
      ctx.setLineDash([6 + energyRatio * 4, 3]);
      ctx.beginPath();
      ctx.arc(x, y, ringR, -time * 2.5, -time * 2.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Concentric Inner Starburst Glyph
      if (energyRatio > 0.4) {
        const starPoints = 6;
        ctx.strokeStyle = `rgba(243, 232, 255, ${energyRatio * 0.7})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let i = 0; i < starPoints; i++) {
          const a = time * 1.5 + (i * Math.PI * 2) / starPoints;
          const r1 = radius + 2;
          const r2 = ringR - 1;
          ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
          ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
        }
        ctx.stroke();
      }
    }

    // 奧術晶盾 (Passive 4: Arcane Crystal Shield Dome)
    if (hailaiseShield > 0) {
      const shieldRatio = Math.min(1.0, hailaiseShield / (hailaiseMaxShield || 50));
      const sRadius = radius + 8 + Math.sin(time * 4) * 1.5;

      ctx.save();
      ctx.shadowColor = '#d8b4fe';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + shieldRatio * 0.5})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(x, y, sRadius, 0, Math.PI * 2);
      ctx.stroke();

      const shieldGrad = ctx.createRadialGradient(x, y, radius * 0.5, x, y, sRadius);
      shieldGrad.addColorStop(0, 'rgba(192, 132, 252, 0)');
      shieldGrad.addColorStop(0.7, `rgba(168, 85, 247, ${shieldRatio * 0.18})`);
      shieldGrad.addColorStop(1, `rgba(216, 180, 254, ${shieldRatio * 0.45})`);
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(x, y, sRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4 revolving crystal facets
      for (let i = 0; i < 4; i++) {
        const ca = time * 2.2 + (i * Math.PI * 0.5);
        const cx = x + Math.cos(ca) * sRadius;
        const cy = y + Math.sin(ca) * sRadius;
        ctx.fillStyle = '#f5d0fe';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Orbiting Arcane Glyphs
    if (showDetails) {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3.5, 0, Math.PI * 2);
      ctx.stroke();

      const runeCount = 4;
      for (let i = 0; i < runeCount; i++) {
        const angle = time * 2.0 + (i * Math.PI * 2) / runeCount;
        const rx = x + Math.cos(angle) * (radius + 4.5);
        const ry = y + Math.sin(angle) * (radius + 4.5);
        ctx.fillStyle = '#f3e8ff';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isLingyinsi) {
    // --- LINGYINSI (靈隱寺): Spiritual Psionic Taiji Marksman Halo ---
    ctx.save();
    const pulse = Math.sin(time * 5) * 2;
    
    // Psionic Focus Ring with Directional Compass Vectors
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4.0 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Cardinal Directional Psionic Arrowheads
    for (let i = 0; i < 4; i++) {
      const angle = time * 1.2 + (i * Math.PI) / 2;
      const ax = x + Math.cos(angle) * (radius + 7);
      const ay = y + Math.sin(angle) * (radius + 7);
      const perpA = angle + Math.PI / 2;
      
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * (radius + 10), y + Math.sin(angle) * (radius + 10));
      ctx.lineTo(ax + Math.cos(perpA) * 3, ay + Math.sin(perpA) * 3);
      ctx.lineTo(ax - Math.cos(perpA) * 3, ay - Math.sin(perpA) * 3);
      ctx.closePath();
      ctx.fill();
    }

    // Spiritual Diamond Reticle Pips
    if (showDetails) {
      const pipCount = 4;
      for (let i = 0; i < pipCount; i++) {
        const angle = -time * 1.5 + (i * Math.PI * 2) / pipCount;
        const px = x + Math.cos(angle) * (radius + 4.5);
        const py = y + Math.sin(angle) * (radius + 4.5);
        ctx.fillStyle = '#bae6fd';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isChanshi) {
    // --- CHANSHI (禪師): Ancient Golden Bell Barrier & Great Sun Nirvana Aura ---
    ctx.save();
    const pulse = Math.sin(time * 4) * 2;

    // 1. Golden Bell Shield & Super Armor (古剎金鐘法界)
    if (chanshiBellShieldTimer > 0 || chanshiSuperArmorTimer > 0) {
      const bellLife = Math.max(chanshiBellShieldTimer, chanshiSuperArmorTimer) / 0.5;
      const bellAlpha = Math.min(1.0, bellLife * 1.25);

      ctx.save();
      // Outer 3D Bell Dome Contour
      ctx.strokeStyle = `rgba(254, 240, 138, ${bellAlpha})`;
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 22;

      // Draw Bell Dome Outline
      ctx.beginPath();
      ctx.arc(x, y - radius * 0.15, radius + 9, Math.PI * 0.85, Math.PI * 2.15);
      ctx.stroke();

      // Top Bell Ring / Clapper Handle
      ctx.beginPath();
      ctx.arc(x, y - radius - 8, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom Bell Flared Lip
      ctx.beginPath();
      ctx.ellipse(x, y + radius + 8, radius + 9, radius * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Translucent Bell Amber Light Fill
      const bellGrad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius + 11);
      bellGrad.addColorStop(0, `rgba(254, 240, 138, ${0.25 * bellAlpha})`);
      bellGrad.addColorStop(0.7, `rgba(245, 158, 11, ${0.35 * bellAlpha})`);
      bellGrad.addColorStop(1, `rgba(180, 83, 9, ${0.55 * bellAlpha})`);
      ctx.fillStyle = bellGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius + 9, 0, Math.PI * 2);
      ctx.fill();

      // Resonant Bell Acoustic Sound Rings
      const ringPhase = (time * 6) % 1;
      ctx.strokeStyle = `rgba(253, 224, 71, ${(1 - ringPhase) * 0.7 * bellAlpha})`;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(x, y, radius + 8 + ringPhase * 12, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting Vajra Sanskrit Runes
      for (let i = 0; i < 4; i++) {
        const a = time * 5 + (i * Math.PI) / 2;
        const rx = x + Math.cos(a) * (radius + 10);
        const ry = y + Math.sin(a) * (radius + 10);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Golden Body Healing Nirvana Flash (涅槃金身佛光)
    if (chanshiHealingAnimTimer > 0) {
      const healRatio = chanshiHealingAnimTimer / 1.0;
      ctx.save();
      ctx.strokeStyle = `rgba(254, 240, 138, ${healRatio * 0.95})`;
      ctx.lineWidth = 3.6;
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 26;
      ctx.beginPath();
      ctx.arc(x, y, radius + 14 * (1 - healRatio * 0.4), 0, Math.PI * 2);
      ctx.stroke();

      // Cascading Golden Nectar Light Motes
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6 + time * 3;
        const dist = radius + 6 + (1 - healRatio) * 16;
        ctx.fillStyle = '#fffbeb';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * dist, y + Math.sin(a) * dist, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Sacred Zen Harmonic Halo with Lotus Petal Tips
    if (showDetails) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4.0 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // 6 Sacred Buddhist / Zen Halo Orbiting Light Orbs
      const orbCount = 6;
      for (let i = 0; i < orbCount; i++) {
        const angle = time * 1.2 + (i * Math.PI * 2) / orbCount;
        const px = x + Math.cos(angle) * (radius + 5.0);
        const py = y + Math.sin(angle) * (radius + 5.0);
        ctx.fillStyle = i % 2 === 0 ? '#fffbeb' : '#facc15';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isHuangzuan) {
    // --- HUANGZUAN (黃鑽): Overdrive Lightning Plasma Matrix ---
    ctx.save();
    const stacks = huangzuanSpeedStacks || 0;
    if (stacks > 0) {
      const pulse = Math.sin(time * 14) * (1 + stacks * 0.25);
      
      // 1. Dynamic Electric Stacking Ring
      ctx.strokeStyle = stacks >= 8 ? '#ffffff' : '#e8fc02';
      ctx.lineWidth = 1.8 + (stacks / 10) * 2.0;
      ctx.shadowColor = '#e8fc02';
      ctx.shadowBlur = 14 + stacks * 1.6;
      ctx.setLineDash([5 + stacks, 3]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 5 + pulse, time * (3 + stacks * 0.6), time * (3 + stacks * 0.6) + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. High-Voltage Jagged Lightning Arcs on Ball Boundary
      const arcCount = Math.min(5, Math.max(2, Math.floor(stacks / 2)));
      for (let i = 0; i < arcCount; i++) {
        const a1 = (i * Math.PI * 2) / arcCount + time * 8;
        const a2 = a1 + 0.35 + Math.random() * 0.2;
        const midA = (a1 + a2) / 2;
        const r1 = radius + 3;
        const rMid = radius + 8 + Math.random() * 4;
        const r2 = radius + 3;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#e8fc02';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a1) * r1, y + Math.sin(a1) * r1);
        ctx.lineTo(x + Math.cos(midA) * rMid, y + Math.sin(midA) * rMid);
        ctx.lineTo(x + Math.cos(a2) * r2, y + Math.sin(a2) * r2);
        ctx.stroke();
      }

      // 3. Orbiting Ion Plasma Nodes
      const nodeCount = Math.min(6, Math.max(3, Math.floor(stacks / 2)));
      for (let i = 0; i < nodeCount; i++) {
        const a = -time * 7 + (i * Math.PI * 2) / nodeCount;
        const nx = x + Math.cos(a) * (radius + 6.5);
        const ny = y + Math.sin(a) * (radius + 6.5);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#e8fc02';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isLanzuan) {
    // --- LANZUAN (藍鑽): Sapphire Harmonic Resonance Aura & Emotion Barrier ---
    ctx.save();
    const pulse = Math.sin(time * 5) * 1.8;

    // Emotion field active or general aura in details mode
    if (lanzuanEmotionFieldActive || showDetails) {
      // 1. Concentric Harmonic Cyan-Azure Resonance Halo
      ctx.strokeStyle = lanzuanEmotionFieldActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = lanzuanEmotionFieldActive ? 2.4 : 1.4;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = lanzuanEmotionFieldActive ? 16 : 8;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 5.5 + pulse, -time * 2.0, -time * 2.0 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Translucent Sapphire Crystalline Dome
      if (lanzuanEmotionFieldActive) {
        const domeGrad = ctx.createRadialGradient(x, y, radius, x, y, radius + 11);
        domeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        domeGrad.addColorStop(0.65, 'rgba(186, 230, 253, 0.18)');
        domeGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = domeGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius + 11, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. 4 Orbiting Royal Sapphire Diamond Crystals
      for (let i = 0; i < 4; i++) {
        const a = time * 2.4 + (i * Math.PI) / 2;
        const px = x + Math.cos(a) * (radius + 7.5);
        const py = y + Math.sin(a) * (radius + 7.5);
        ctx.fillStyle = '#bae6fd';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isFenzuan) {
    // --- FENZUAN (粉鑽): Rose Quartz Sanctuary & Prismatic Bubble Spikes ---
    ctx.save();
    const pulse = Math.sin(time * 6) * 1.8;

    // Passive 2: Pink Damage Reduction Field Protective Halo (玫瑰晶簇神聖聖域環)
    if (fenzuanFieldActive || isProtectedByFenzuanField) {
      ctx.save();
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.6;
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 18;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 6 + pulse, time * 2.2, time * 2.2 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Soft rose-quartz outer shield dome
      const fieldH = ctx.createRadialGradient(x, y, radius, x, y, radius + 10);
      fieldH.addColorStop(0, 'rgba(244, 114, 182, 0.4)');
      fieldH.addColorStop(0.7, 'rgba(251, 207, 232, 0.25)');
      fieldH.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = fieldH;
      ctx.beginPath();
      ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
      ctx.fill();

      // 4 Floating Rose Diamond Petals
      for (let i = 0; i < 4; i++) {
        const pa = time * 2 + (i * Math.PI) / 2;
        const px = x + Math.cos(pa) * (radius + 8);
        const py = y + Math.sin(pa) * (radius + 8);
        ctx.fillStyle = '#fce7f3';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Passive 3: Bubble Spikes (炫彩粉晶尖刺泡泡)
    if (fenzuanBubbleActive) {
      ctx.save();
      const bubbleR = radius + 7 + Math.sin(time * 8) * 1.6;

      // 1. Iridescent Multi-Stop Bubble Shell
      const bubGrad = ctx.createRadialGradient(x - bubbleR * 0.35, y - bubbleR * 0.35, 2, x, y, bubbleR);
      bubGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
      bubGrad.addColorStop(0.3, 'rgba(251, 207, 232, 0.45)');
      bubGrad.addColorStop(0.7, 'rgba(244, 114, 182, 0.55)');
      bubGrad.addColorStop(1, 'rgba(236, 72, 153, 0.8)');

      ctx.fillStyle = bubGrad;
      ctx.beginPath();
      ctx.arc(x, y, bubbleR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Crystal Bubble Rim
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 14;
      ctx.stroke();

      // 3. 8 Dynamic Razor-Sharp Pink Crystal Spikes
      const spikeCount = 8;
      for (let i = 0; i < spikeCount; i++) {
        const spikeAngle = time * 2.8 + (i * Math.PI * 2) / spikeCount;
        const baseR = bubbleR - 1.5;
        const tipR = bubbleR + 7 + Math.sin(time * 12 + i) * 2.5;
        const sideSpread = 0.16;

        const bx1 = x + Math.cos(spikeAngle - sideSpread) * baseR;
        const by1 = y + Math.sin(spikeAngle - sideSpread) * baseR;
        const tx = x + Math.cos(spikeAngle) * tipR;
        const ty = y + Math.sin(spikeAngle) * tipR;
        const bx2 = x + Math.cos(spikeAngle + sideSpread) * baseR;
        const by2 = y + Math.sin(spikeAngle + sideSpread) * baseR;

        // Faceted crystal spike with two tone shading
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f472b6';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(tx, ty);
        ctx.lineTo(bx2, by2);
        ctx.closePath();
        ctx.fill();
      }

      // 4. Bubble Specular Glare Arc
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(x, y, bubbleR * 0.75, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.stroke();
      ctx.restore();
    } else if (showDetails) {
      // Subtle ambient pink diamond crystal shimmer halo
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3.5 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // 4 Ambient pink diamond sparkle dots
      for (let i = 0; i < 4; i++) {
        const a = time * 1.4 + (i * Math.PI * 2) / 4;
        const px = x + Math.cos(a) * (radius + 4.8);
        const py = y + Math.sin(a) * (radius + 4.8);
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fbcfe8';
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isBaizuan) {
    // --- BAIZUAN (白鑽): Supernova Radiant Domain & Annihilation Focus ---
    ctx.save();
    const pulse = Math.sin(time * 6) * 1.8;

    if (baizuanShiningActive) {
      // Passive 2: Supernova Blinding God-Ray Corona
      ctx.save();
      const shineR = radius + 9 + Math.sin(time * 10) * 3;

      // 8-directional god-rays
      for (let i = 0; i < 8; i++) {
        const rayA = time * 2.5 + (i * Math.PI) / 4;
        const rx1 = x + Math.cos(rayA) * (radius + 4);
        const ry1 = y + Math.sin(rayA) * (radius + 4);
        const rx2 = x + Math.cos(rayA) * (shineR + 8);
        const ry2 = y + Math.sin(rayA) * (shineR + 8);

        ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : 'rgba(224, 242, 254, 0.8)';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.8;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(x, y, shineR, time * 3.5, time * 3.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const flareGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, shineR + 6);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      flareGrad.addColorStop(0.7, 'rgba(240, 249, 255, 0.25)');
      flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(x, y, shineR + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (baizuanRayActive) {
      // Passive 3: Death Ray High-Voltage Photonic Corona & Diamond Focus Lenses
      ctx.save();
      const pulseFast = Math.sin(time * 24) * 3;
      const rayR = radius + 9 + pulseFast;

      // Radiant white-cyan outer glow
      const coronaGrad = ctx.createRadialGradient(x, y, radius, x, y, rayR + 14);
      coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coronaGrad.addColorStop(0.4, 'rgba(224, 242, 254, 0.6)');
      coronaGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.25)');
      coronaGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(x, y, rayR + 14, 0, Math.PI * 2);
      ctx.fill();

      // Sharp vibrating laser corona boundary
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.0;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(x, y, rayR, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary counter-spinning diamond reticle
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(x, y, rayR - 4, -time * 3, -time * 3 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6 Orbiting diamond prism focusing lenses
      for (let i = 0; i < 6; i++) {
        const a = time * 4.5 + (i * Math.PI * 2) / 6;
        const px = x + Math.cos(a) * (radius + 14);
        const py = y + Math.sin(a) * (radius + 14);

        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#e0f2fe';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        // Diamond shape
        ctx.moveTo(px, py - 4.5);
        ctx.lineTo(px + 3, py);
        ctx.lineTo(px, py + 4.5);
        ctx.lineTo(px - 3, py);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (showDetails) {
      // Subtle ambient pure white diamond crystal shimmer halo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, radius + 3.5 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // 4 Ambient pure white crystalline diamond glint particles
      for (let i = 0; i < 4; i++) {
        const a = time * 1.5 + (i * Math.PI * 2) / 4;
        const px = x + Math.cos(a) * (radius + 4.8);
        const py = y + Math.sin(a) * (radius + 4.8);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isXukongshou) {
    // --- XUKONGSHOU (虛空獸): Abyssal Void Horizon & Phantom Shadows ---
    ctx.save();
    const pulse = Math.sin(time * 5) * 2;

    // 1. Abyssal Void Corona (Black-Purple Gradient)
    const coronaR = Math.max(1, radius + 14 + pulse);
    const voidGlow = ctx.createRadialGradient(x, y, Math.max(0, radius * 0.8), x, y, coronaR);
    voidGlow.addColorStop(0, 'rgba(88, 28, 135, 0.55)');
    voidGlow.addColorStop(0.5, 'rgba(46, 16, 101, 0.4)');
    voidGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = voidGlow;
    ctx.beginPath();
    ctx.arc(x, y, coronaR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Void Boundary Tendrils / Energy Ribbons
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, radius + 4 + pulse * 0.5), time * 2, time * 2 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Invulnerability Barrier during Void Bite
    if (isInvulnerable || xukongshouBiteActive) {
      ctx.save();
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#d8b4fe';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(x, y, radius + 9, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating runic points
      for (let i = 0; i < 6; i++) {
        const ra = time * 3 + (i * Math.PI) / 3;
        const rx = x + Math.cos(ra) * (radius + 9);
        const ry = y + Math.sin(ra) * (radius + 9);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  } else if (isFan) {
    // --- FAN (凡): Tactical Kinetic Hunter Halo & Overclock Slipstream ---
    ctx.save();
    const pulse = Math.sin(time * 6) * 1.5;

    // 1. Overclock Supersonic Energy Vortex
    if (fanOverclockActive) {
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 16;
      ctx.setLineDash([7, 3]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 6 + pulse, time * 8, time * 8 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Overclock Golden Plasma Sparks
      for (let i = 0; i < 4; i++) {
        const a = time * 12 + (i * Math.PI) / 2;
        const dist = radius + 7 + Math.sin(time * 16 + i) * 3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * dist, y + Math.sin(a) * dist, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Rolling Evasion Kinetic Shimmer
    if (fanIsRolling) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 2.8;
      ctx.shadowColor = '#e2e8f0';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Tactical Hunter Reticle Ring in details mode
    if (showDetails) {
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(x, y, radius + 4.0, 0, Math.PI * 2);
      ctx.stroke();

      // 3 Precision Gold-Silver Pointer Ticks
      for (let i = 0; i < 3; i++) {
        const a = time * 1.6 + (i * Math.PI * 2) / 3;
        const px = x + Math.cos(a) * (radius + 4.5);
        const py = y + Math.sin(a) * (radius + 4.5);
        ctx.fillStyle = i === 0 ? '#fef08a' : '#e2e8f0';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (isTunshimozu) {
    // --- TUNSHIMOZU (吞噬魔族): Abyssal Demonic Gravitational Singularity Halo ---
    ctx.save();
    const growthRatio = Math.min(1.0, growthStacks / 50);
    const pulse = Math.sin(time * 3.5) * (1.5 + growthRatio * 1.5);

    // 1. Abyssal Singularity Distortion Shroud
    if (growthStacks >= 10 || showDetails) {
      const auraR = radius + 7 + growthRatio * 6 + pulse;
      const auraGrad = ctx.createRadialGradient(x, y, radius * 0.75, x, y, auraR);
      auraGrad.addColorStop(0, 'rgba(88, 28, 135, 0.5)');
      auraGrad.addColorStop(0.65, `rgba(192, 132, 252, ${0.15 + growthRatio * 0.25})`);
      auraGrad.addColorStop(1, 'rgba(15, 2, 30, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, y, auraR, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Runic Singularity Ring
      ctx.strokeStyle = `rgba(216, 180, 254, ${0.35 + growthRatio * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 10;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(x, y, radius + 4.5 + growthRatio * 3, time * 2.0, time * 2.0 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Demonic Burst Ready Arc Discharge
    if (isGluttonyBurstReady) {
      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 12;
      for (let i = 0; i < 3; i++) {
        const a1 = (i * Math.PI * 2) / 3 + time * 4;
        const a2 = a1 + 0.45;
        ctx.beginPath();
        ctx.arc(x, y, radius + 5.5, a1, a2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Bitten by Void Beast Status Effect (Dark violet constriction shadow, chains & gnashing fangs indicator)
  if (isBittenByVoidBeast) {
    ctx.save();
    const bitePulse = Math.sin(time * 14) * 2.5;

    // Dark void shadow shroud
    const voidShroud = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius + 10);
    voidShroud.addColorStop(0, 'rgba(46, 16, 101, 0.45)');
    voidShroud.addColorStop(0.7, 'rgba(88, 28, 135, 0.6)');
    voidShroud.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
    ctx.fillStyle = voidShroud;
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // Spiky void constriction ring
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 6 + bitePulse, time * 4, time * 4 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Restraint teeth clamps
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const r1 = radius + 1;
      const r2 = radius + 9;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Blanch & Immobilize Status Effect (Pure White Diamond Crystal Frozen Shell)
  if (isBlanchedAndImmobilized) {
    ctx.save();
    // 1. Multi-layered pure white crystal barrier
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 7, time * 4, time * 4 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Crystal facet freeze cage lines
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x1 = x + Math.cos(a) * (radius * 0.6);
      const y1 = y + Math.sin(a) * (radius * 0.6);
      const x2 = x + Math.cos(a) * (radius + 7);
      const y2 = y + Math.sin(a) * (radius + 7);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const frostGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius + 7);
    frostGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    frostGrad.addColorStop(0.7, 'rgba(240, 249, 255, 0.45)');
    frostGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    ctx.fillStyle = frostGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius + 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Mimi Bleed Status Effect (Crimson rose claw marks & dripping blood droplets)
  if (isBleedingByMimi) {
    ctx.save();
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 8;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.85, time * 3 + i * 0.4, time * 3 + i * 0.4 + 0.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Mimi Charm Status Effect (Fluttering pink heart crown above ball)
  if (isCharmedByMimi) {
    ctx.save();
    const heartCount = 3;
    for (let i = 0; i < heartCount; i++) {
      const hAngle = (i * Math.PI * 2) / heartCount + time * 3.5;
      const hDist = radius + 12;
      const hx = x + Math.cos(hAngle) * hDist;
      const hy = y - radius * 0.45 + Math.sin(hAngle) * (hDist * 0.35);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(0.35, 0.35);
      ctx.fillStyle = '#ec4899';
      ctx.shadowColor = '#f472b6';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(-7, -7, -12, 0, 0, 12);
      ctx.bezierCurveTo(12, 0, 7, -7, 0, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // Jiandaoshou Needle Slow Ring (淡藍白色減速環)
  if (options.isSlowedByNeedle) {
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.9)';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, radius + 8 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + time * 2;
      const tx1 = x + Math.cos(a) * (radius + 6);
      const ty1 = y + Math.sin(a) * (radius + 6);
      const tx2 = x + Math.cos(a) * (radius + 11);
      const ty2 = y + Math.sin(a) * (radius + 11);
      ctx.beginPath();
      ctx.moveTo(tx1, ty1);
      ctx.lineTo(tx2, ty2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 2. MAIN 3D SPHERE BODY
  // -------------------------------------------------------------
  ctx.save();
  ctx.shadowColor = config.glowColor;
  ctx.shadowBlur = 16;

  // High-contrast 3D Radial Lighting
  const lightX = x - radius * 0.38;
  const lightY = y - radius * 0.38;
  const bodyGrad = ctx.createRadialGradient(
    lightX,
    lightY,
    radius * 0.1,
    x,
    y,
    radius
  );

  if (isOba) {
    // Cobalt Blue Steel with Golden sheen
    bodyGrad.addColorStop(0, '#e0f2fe'); // Specular light highlight
    bodyGrad.addColorStop(0.2, '#38bdf8'); // Sky blue midtone
    bodyGrad.addColorStop(0.55, '#1d4ed8'); // Rich royal cobalt
    bodyGrad.addColorStop(0.88, '#1e3a8a'); // Deep navy shadow
    bodyGrad.addColorStop(1, '#0f172a'); // Dark edge
  } else if (isHuotong) {
    // Molten Magma Iron Barrel
    bodyGrad.addColorStop(0, '#fed7aa'); // Fiery white-amber highlight
    bodyGrad.addColorStop(0.25, '#f97316'); // Fiery orange
    bodyGrad.addColorStop(0.6, '#dc2626'); // Molten crimson
    bodyGrad.addColorStop(0.88, '#7f1d1d'); // Deep dark iron rust
    bodyGrad.addColorStop(1, '#450a0a'); // Charred bottom edge
  } else if (isHailaise) {
    // Hailaise: Mystic Arcane Amethyst Crystal Orb
    bodyGrad.addColorStop(0, '#faf5ff'); // Bright lavender specular
    bodyGrad.addColorStop(0.22, '#c084fc'); // Radiant lilac
    bodyGrad.addColorStop(0.58, '#9333ea'); // Deep royal amethyst
    bodyGrad.addColorStop(0.88, '#581c87'); // Abyssal violet
    bodyGrad.addColorStop(1, '#2e1065'); // Dark mystic rim
  } else if (isLingyinsi) {
    // Lingyinsi: Spiritual Psionic Temple Azure & Cyan Sphere
    bodyGrad.addColorStop(0, '#ecfeff'); // Luminous white-cyan specular highlight
    bodyGrad.addColorStop(0.22, '#38bdf8'); // Radiant azure midtone
    bodyGrad.addColorStop(0.58, '#0284c7'); // Spiritual deep sky cyan
    bodyGrad.addColorStop(0.88, '#0369a1'); // Abyssal temple sapphire
    bodyGrad.addColorStop(1, '#082f49'); // Deep twilight rim
  } else if (isChanshi) {
    // Chanshi: Sacred Zen Gold & Radiant Amber Sphere
    bodyGrad.addColorStop(0, '#fffbeb'); // Specular pure ivory-gold highlight
    bodyGrad.addColorStop(0.22, '#fde047'); // Radiant pure gold midtone
    bodyGrad.addColorStop(0.58, '#eab308'); // Resonant monk amber gold
    bodyGrad.addColorStop(0.88, '#a16207'); // Deep temple bronze shadow
    bodyGrad.addColorStop(1, '#451a03'); // Abyssal dark amber rim
  } else if (isHuangzuan) {
    // Huangzuan: Radiant Canary Neon Diamond & Prismatic Crystalline Sphere
    bodyGrad.addColorStop(0, '#ffffff'); // Specular pure brilliant white
    bodyGrad.addColorStop(0.16, '#faff60'); // Luminous canary diamond highlight
    bodyGrad.addColorStop(0.48, '#e5fb05'); // High-voltage vivid electric canary
    bodyGrad.addColorStop(0.78, '#8ba600'); // Crystalline prismatic topaz shadow
    bodyGrad.addColorStop(0.94, '#4d5c00'); // Deep olive-diamond facet edge
    bodyGrad.addColorStop(1, '#242b00'); // Abyssal diamond cut boundary
  } else if (isFenzuan) {
    // Fenzuan: Luminous Pink Diamond & Prismatic Rose Crystalline Sphere
    bodyGrad.addColorStop(0, '#ffffff'); // Specular pure diamond brilliant apex
    bodyGrad.addColorStop(0.18, '#fce7f3'); // Light crystalline pastel pink facet
    bodyGrad.addColorStop(0.48, '#f472b6'); // Radiant vivid pink diamond facet
    bodyGrad.addColorStop(0.76, '#db2777'); // Deep rose diamond crystal shadow
    bodyGrad.addColorStop(0.92, '#9d174d'); // Abyssal ruby-rose facet boundary
    bodyGrad.addColorStop(1, '#500724'); // Diamond cut bottom edge
  } else if (isBaizuan) {
    // Baizuan: Pure White Diamond & Translucent Prismatic Crystalline Sphere
    bodyGrad.addColorStop(0, '#ffffff'); // Specular pure brilliant white apex
    bodyGrad.addColorStop(0.18, '#f8fafc'); // High-light facet pure white crystal
    bodyGrad.addColorStop(0.46, '#f1f5f9'); // Prismatic clear crystal midtone
    bodyGrad.addColorStop(0.74, '#e2e8f0'); // Light silver refraction shadow
    bodyGrad.addColorStop(0.90, '#cbd5e1'); // Diamond facet boundary
    bodyGrad.addColorStop(1, '#94a3b8'); // Sharp crystalline cut edge
  } else if (isXukongshou) {
    // Xukongshou: Pitch-black alien sphere with dark purple void energy rim
    bodyGrad.addColorStop(0, '#1f0d32');    // Highlight apex deep void violet
    bodyGrad.addColorStop(0.24, '#0f051c'); // Abyssal pitch purple-black
    bodyGrad.addColorStop(0.60, '#030108'); // Pitch obsidian void center
    bodyGrad.addColorStop(0.85, '#170629'); // Dark purple transitional boundary
    bodyGrad.addColorStop(0.96, '#4c1d95'); // Deep purple energy rim
    bodyGrad.addColorStop(1, '#7e22ce');    // Dark purple void energy glow
  } else if (isFan) {
    // Fan: Tactical Hunter Titanium & Brushed Carbon-Steel Sphere
    bodyGrad.addColorStop(0, '#ffffff');    // Specular titanium white apex
    bodyGrad.addColorStop(0.18, '#e2e8f0'); // Crisp brushed platinum
    bodyGrad.addColorStop(0.48, '#64748b'); // Tactical slate titanium midtone
    bodyGrad.addColorStop(0.78, '#334155'); // Deep carbon armor shadow
    bodyGrad.addColorStop(0.92, '#1e293b'); // Dark carbon boundary
    bodyGrad.addColorStop(1, '#0f172a');    // Abyssal edge rim
  } else if (isTunshimozu) {
    // Tunshimozu: Abyssal Demonic Void Colossus & Singularity Flesh
    bodyGrad.addColorStop(0, '#fdf4ff');    // Singularity light burst apex
    bodyGrad.addColorStop(0.18, '#c084fc'); // Glowing demonic violet midtone
    bodyGrad.addColorStop(0.52, '#6b21a8'); // Abyssal royal purple
    bodyGrad.addColorStop(0.80, '#2e1065'); // Dark pitch void mantle
    bodyGrad.addColorStop(0.95, '#130324'); // Demonic chitin edge
    bodyGrad.addColorStop(1, '#05000a');    // Pitch singularity boundary
  } else if (isMimi) {
    // Mimi: Sweet Pastel Pink & Rose Feline Marksman Sphere
    bodyGrad.addColorStop(0, '#ffffff');    // Luminous pure pearl white apex
    bodyGrad.addColorStop(0.18, '#fce7f3'); // Sweet pastel peach-pink
    bodyGrad.addColorStop(0.48, '#f472b6'); // Radiant strawberry rose pink
    bodyGrad.addColorStop(0.78, '#db2777'); // Deep magenta rose shadow
    bodyGrad.addColorStop(0.92, '#9d174d'); // Dark velvet rose boundary
    bodyGrad.addColorStop(1, '#500724');    // Abyssal burgundy edge
  } else if (isLongshen) {
    // Longshen: Imperial Golden Crimson Dragon God Sphere
    bodyGrad.addColorStop(0, '#fef08a');    // Radiant divine gold apex highlight
    bodyGrad.addColorStop(0.22, '#f59e0b'); // Rich fiery amber dragon scale
    bodyGrad.addColorStop(0.58, '#dc2626'); // Blazing dragon flame crimson
    bodyGrad.addColorStop(0.88, '#991b1b'); // Deep imperial red shadow
    bodyGrad.addColorStop(1, '#450a0a');    // Dark dragon obsidian boundary
  } else if (isZhizhu) {
    // Zhizhu: Obsidian Black & Toxic Emerald Arachnid Sphere
    bodyGrad.addColorStop(0, '#34d399');    // Specular toxic jade apex highlight
    bodyGrad.addColorStop(0.20, '#059669'); // Venomous emerald green
    bodyGrad.addColorStop(0.52, '#064e3b'); // Deep toxic chitin forest green
    bodyGrad.addColorStop(0.82, '#09090b'); // Abyssal obsidian black
    bodyGrad.addColorStop(1, '#022c22');    // Toxic dark rim
  } else if (isXin) {
    // Xin: Heavy Dark-Gray Metallic Armor Sphere (沉重黑灰金屬戰士裝甲)
    const xForm = options.xinForm || 'balance';
    bodyGrad.addColorStop(0, '#64748b');    // Cool metallic brushed specular gleam
    bodyGrad.addColorStop(0.18, '#334155'); // Heavy gunmetal steel plate
    bodyGrad.addColorStop(0.52, '#1e293b'); // Dark armor carbon-steel
    bodyGrad.addColorStop(0.82, '#0f172a'); // Reinforced shadow plate
    bodyGrad.addColorStop(1, '#020617');    // Abyssal boundary rim
  } else if (isKuileishi) {
    // Kuileishi: Arcane Mystic Violet & Amethyst Puppet Master Sphere (秘術紫曜命運木偶球體)
    bodyGrad.addColorStop(0, '#f5d0fe');    // Arcane lavender apex
    bodyGrad.addColorStop(0.18, '#c084fc'); // Glowing mystical violet midtone
    bodyGrad.addColorStop(0.52, '#7e22ce'); // Deep amethyst purple
    bodyGrad.addColorStop(0.82, '#3b0764'); // Abyssal twilight puppet shadow
    bodyGrad.addColorStop(1, '#1e0338');    // Deep arcane boundary rim
  } else if (isManyaiya) {
    // Manyaiya Junko: Sacred Godblade Silver-Black Sphere with Pure White Bandages & Red Memory Sheen
    bodyGrad.addColorStop(0, '#ffffff'); // Divine pure white specular apex
    bodyGrad.addColorStop(0.18, '#e2e8f0'); // Sacred bandage silver-white facet
    bodyGrad.addColorStop(0.48, '#334155'); // Slate metal blade body
    bodyGrad.addColorStop(0.78, '#1e293b'); // Dark armor shadow
    bodyGrad.addColorStop(0.92, '#0f172a'); // Abyssal black edge
    bodyGrad.addColorStop(1, '#020617'); // Pitch black boundary rim
  } else {
    // Lanzuan: Imperial Royal Blue Sapphire Diamond & Prismatic Crystalline Sphere
    bodyGrad.addColorStop(0, '#ffffff'); // Specular pure diamond brilliant apex
    bodyGrad.addColorStop(0.18, '#bae6fd'); // Light crystalline sky facet
    bodyGrad.addColorStop(0.48, '#38bdf8'); // Radiant royal sapphire facet
    bodyGrad.addColorStop(0.76, '#0284c7'); // Deep oceanic diamond blue
    bodyGrad.addColorStop(0.92, '#075985'); // Abyssal cobalt facet edge
    bodyGrad.addColorStop(1, '#082f49'); // Diamond facet rim boundary
  }

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle 3D Specular Highlight at top-left
  const specGrad = ctx.createRadialGradient(
    lightX,
    lightY,
    0,
    lightX,
    lightY,
    radius * 0.45
  );
  specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  specGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.14)');
  specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = specGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Fresnel Rim Reflection at bottom-right (adds authentic 3D optical curvature across all characters)
  const fresnelX = x + radius * 0.35;
  const fresnelY = y + radius * 0.35;
  const fresnelColor = isOba
    ? 'rgba(251, 191, 36, 0.25)'
    : isHuotong
    ? 'rgba(249, 115, 22, 0.3)'
    : isHailaise
    ? 'rgba(216, 180, 254, 0.3)'
    : isLingyinsi
    ? 'rgba(56, 189, 248, 0.28)'
    : isChanshi
    ? 'rgba(254, 240, 138, 0.35)'
    : isHuangzuan
    ? 'rgba(250, 255, 120, 0.35)'
    : isFenzuan
    ? 'rgba(252, 231, 243, 0.35)'
    : isBaizuan
    ? 'rgba(255, 255, 255, 0.35)'
    : isXukongshou
    ? 'rgba(192, 132, 252, 0.28)'
    : isFan
    ? 'rgba(254, 240, 138, 0.28)'
    : isTunshimozu
    ? 'rgba(240, 171, 252, 0.3)'
    : isMimi
    ? 'rgba(244, 114, 182, 0.35)'
    : isLongshen
    ? 'rgba(251, 191, 36, 0.4)'
    : isZhizhu
    ? 'rgba(16, 185, 129, 0.4)'
    : isXin
    ? 'rgba(192, 132, 252, 0.45)'
    : isKuileishi
    ? 'rgba(232, 121, 249, 0.45)'
    : isManyaiya
    ? 'rgba(255, 255, 255, 0.45)'
    : 'rgba(186, 230, 253, 0.3)';

  const fresnelGrad = ctx.createRadialGradient(
    fresnelX,
    fresnelY,
    radius * 0.4,
    fresnelX,
    fresnelY,
    radius * 0.75
  );
  fresnelGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  fresnelGrad.addColorStop(0.7, fresnelColor);
  fresnelGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = fresnelGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Outer edge metal rim
  ctx.strokeStyle = isOba
    ? 'rgba(251, 191, 36, 0.7)'
    : isHuotong
    ? 'rgba(249, 115, 22, 0.7)'
    : isHailaise
    ? 'rgba(192, 132, 252, 0.75)'
    : isLingyinsi
    ? 'rgba(56, 189, 248, 0.75)'
    : isChanshi
    ? 'rgba(253, 224, 71, 0.85)'
    : isHuangzuan
    ? 'rgba(232, 252, 2, 0.95)'
    : isFenzuan
    ? 'rgba(244, 114, 182, 0.95)'
    : isBaizuan
    ? 'rgba(255, 255, 255, 0.95)'
    : isXukongshou
    ? 'rgba(168, 85, 247, 0.95)'
    : isFan
    ? 'rgba(234, 179, 8, 0.95)'
    : isTunshimozu
    ? 'rgba(192, 132, 252, 0.95)'
    : isLongshen
    ? 'rgba(245, 158, 11, 0.95)'
    : isXin
    ? (options.xinForm === 'light' ? 'rgba(251, 191, 36, 0.95)' : options.xinForm === 'dark' ? 'rgba(192, 132, 252, 0.95)' : 'rgba(216, 180, 254, 0.95)')
    : isKuileishi
    ? 'rgba(192, 132, 252, 0.95)'
    : 'rgba(56, 189, 248, 0.95)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 3. DISTINCTIVE CHARACTER CRESTS & SURFACE DETAILS (HIGH-DEFINITION)
  // -------------------------------------------------------------
  if (isOba) {
    drawObaFeatures(ctx, x, y, radius, time);
  } else if (isHuotong) {
    drawHuotongFeatures(ctx, x, y, radius, time);
  } else if (isHailaise) {
    drawHailaiseFeatures(ctx, x, y, radius, time);
  } else if (isLingyinsi) {
    drawLingyinsiFeatures(ctx, x, y, radius, time);
  } else if (isChanshi) {
    drawChanshiFeatures(ctx, x, y, radius, time);
  } else if (charId === 'huangzuan') {
    drawHuangzuanFeatures(ctx, x, y, radius, time);
  } else if (charId === 'lanzuan') {
    drawLanzuanFeatures(ctx, x, y, radius, time);
  } else if (charId === 'fenzuan') {
    drawFenzuanFeatures(ctx, x, y, radius, time);
  } else if (charId === 'baizuan') {
    drawBaizuanFeatures(ctx, x, y, radius, time);
  } else if (isXukongshou) {
    drawXukongshouFeatures(ctx, x, y, radius, time, xukongshouBiteActive);
  } else if (isFan) {
    drawFanFeatures(ctx, x, y, radius, time, fanOverclockActive, fanIsRolling);
  } else if (isTunshimozu) {
    drawTunshimozuFeatures(ctx, x, y, radius, time, growthStacks, isGluttonyBurstReady, devourImploding);
  } else if (isMimi) {
    drawMimiFeatures(ctx, x, y, radius, time, mimiClawAnimTimer, mimiLifeStacks, mimiAttackStacks);
  } else if (charId === 'jiandaoshou') {
    drawJiandaoshouFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      options.jiandaoshouSnipAnimTimer ?? 0,
      options.jiandaoshouCoreGlowTimer ?? 0,
      options.jiandaoshouMistActive ?? false,
      options.vx ?? 0,
      options.vy ?? 0,
      options.targetX,
      options.targetY
    );
  } else if (charId === 'dina') {
    drawDinaFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      options.dinaHaloRotationAngle ?? 0,
      options.dinaDarkLightState ?? 'EMPTY',
      options.dinaPerfectAbsorb ?? false,
      options.dinaCorePowerActive ?? false,
      options.dinaWhiteEnergyCount ?? 0
    );
  } else if (charId === 'jianxian') {
    drawJianxianFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      options.jianxianOrbitSwordAngle ?? 0,
      options.jianxianArrayActive ?? false,
      options.jianxianArrayDuration ?? 0,
      options.jianxianRetreatAnimTimer ?? 0,
      options.vx ?? 0,
      options.vy ?? 0
    );
  } else if (charId === 'longshen') {
    drawLongshenFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      longshenFormActive,
      longshenFormDuration,
      longshenSwoopActive,
      longshenStrikeAnimTimer,
      longshenFlameActive,
      longshenFlameAngle,
      longshenFormWingPhase,
      options.vx ?? 0,
      options.vy ?? 0,
      options.targetX,
      options.targetY
    );
  } else if (charId === 'zhizhu') {
    drawZhizhuFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      options.spiderVenomFangAnimTimer ?? 0,
      options.spiderBurstAnimTimer ?? 0,
      options.vx ?? 0,
      options.vy ?? 0
    );
  } else if (charId === 'xin') {
    drawXinFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      {
        facingAngle: options.facingAngle ?? (options.vx !== undefined && options.vy !== undefined ? Math.atan2(options.vy, options.vx) : 0),
        xinForm: options.xinForm,
        xinLevel: options.xinLevel,
        xinFormEnergy: options.xinFormEnergy,
        xinShieldAmount: options.xinShieldAmount,
        xinShadowDashing: options.xinShadowDashing,
        xinShadowDashAnimTimer: options.xinShadowDashAnimTimer,
        xinSkySlashChargeTimer: options.xinSkySlashChargeTimer,
        xinShadowDashChargeTimer: options.xinShadowDashChargeTimer,
        xinBasicSlashAnimTimer: options.xinBasicSlashAnimTimer,
        xinLockAimAngle: options.xinLockAimAngle,
        xinSwordOrbitAngle: options.xinSwordOrbitAngle,
        xinExpAbsorbTimer: options.xinExpAbsorbTimer,
        xinUpgradeAnimTimer: options.xinUpgradeAnimTimer,
        xinSwordVibrate: options.xinSwordVibrate,
        speed: options.speed
      }
    );
  } else if (charId === 'kuileishi') {
    drawKuileishiFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      {
        resonanceStacks: options.puppetResonance ?? 0,
        aegisTimer: options.puppetAegisTimer ?? 0,
        tetherAnimTimer: options.puppetTetherAnimTimer ?? 0,
        finaleStandby: options.puppetFinaleStandby ?? false,
        targetX: options.targetX,
        targetY: options.targetY,
        vx: options.vx,
        vy: options.vy
      }
    );
  } else if (charId === 'yinyong') {
    drawYinyongFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      {
        state: options.yinyongState,
        chargeTimer: options.yinyongChargeTimer,
        maxCharge: options.yinyongMaxCharge,
        declareTimer: options.yinyongDeclareTimer,
        punchAnimTimer: options.yinyongPunchAnimTimer,
        missAnimTimer: options.yinyongMissAnimTimer,
        rageStacks: options.yinyongRageStacks,
        boundlessActive: options.yinyongBoundlessActive,
        immortalAnimTimer: options.yinyongImmortalAnimTimer,
        targetX: options.targetX,
        targetY: options.targetY,
        vx: options.vx,
        vy: options.vy
      }
    );
  } else if (charId === 'manyaiya') {
    drawManyaiyaFeatures(
      ctx,
      x,
      y,
      radius,
      time,
      {
        memoryFragments: options.junkoMemoryFragments ?? 0,
        isEyeAwakened: options.junkoEyeAwakened ?? false,
        awakenTimer: options.junkoEyeAwakenTimer ?? 0,
        isKnightActive: options.junkoHolyKnightActive ?? false,
        knightDuration: options.junkoHolyKnightDuration ?? 0,
        isDashing: options.junkoIsDashing ?? false,
        dashesRemaining: options.junkoDashesRemaining ?? 0,
        pullTimer: options.junkoTetherPullTimer ?? 0,
        targetX: options.targetX,
        targetY: options.targetY,
        vx: options.vx,
        vy: options.vy
      }
    );
  }

  // -------------------------------------------------------------
  // 4. BOTTOM INDICATOR DOTS (CLONES COUNT / COMBO / ENERGY / GOLDEN BODY / SPEED STACKS)
  // -------------------------------------------------------------
  if (showDetails) {
    if (isOba && consecutiveHits > 0) {
      const dots = 3;
      const hitCount = Math.min(consecutiveHits, 3);
      const spacing = 7;
      const startX = x - ((dots - 1) * spacing) / 2;
      const dotY = y + radius + 11;

      for (let i = 0; i < dots; i++) {
        ctx.save();
        ctx.fillStyle = i < hitCount ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)';
        if (i < hitCount) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(startX + i * spacing, dotY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (isHailaise && magicEnergy > 0) {
      ctx.save();
      const pips = Math.min(9, Math.ceil(magicEnergy / 5)); // up to 9 pips (5 energy each, max 45)
      const spacing = 5.2;
      const startX = x - ((pips - 1) * spacing) / 2;
      const dotY = y + radius + 11;

      for (let i = 0; i < pips; i++) {
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(startX + i * spacing, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (isLingyinsi && clonesCount > 0) {
      // Show mini cyan clone pips
      ctx.save();
      const spacing = 8;
      const startX = x - ((clonesCount - 1) * spacing) / 2;
      const dotY = y + radius + 11;

      for (let i = 0; i < clonesCount; i++) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(startX + i * spacing, dotY, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (isChanshi) {
      // Show Golden Body status pip (Golden if available, faint if consumed)
      ctx.save();
      const dotY = y + radius + 11;
      ctx.fillStyle = !chanshiGoldenBodyUsed ? '#facc15' : 'rgba(234, 179, 8, 0.25)';
      if (!chanshiGoldenBodyUsed) {
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      ctx.arc(x, dotY, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (isHuangzuan && huangzuanSpeedStacks > 0) {
      // Show up to 10 speed stack pips
      ctx.save();
      const totalPips = 10;
      const activePips = Math.min(10, huangzuanSpeedStacks);
      const spacing = 4.2;
      const startX = x - ((totalPips - 1) * spacing) / 2;
      const dotY = y + radius + 11;

      for (let i = 0; i < totalPips; i++) {
        const isActive = i < activePips;
        ctx.fillStyle = isActive
          ? (activePips === 10 ? '#ffffff' : '#e8fc02')
          : 'rgba(255, 255, 255, 0.2)';
        if (isActive) {
          ctx.shadowColor = activePips === 10 ? '#ffffff' : '#e8fc02';
          ctx.shadowBlur = activePips === 10 ? 8 : 4;
        }
        ctx.beginPath();
        ctx.arc(startX + i * spacing, dotY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (isLanzuan) {
      // Show Lanzuan Blue Orb summon readiness / active state pip
      ctx.save();
      const dotY = y + radius + 11;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, dotY, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (isFenzuan) {
      // Show Fenzuan Shield readiness / active state pip
      ctx.save();
      const dotY = y + radius + 11;
      ctx.fillStyle = '#f472b6';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, dotY, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (isBaizuan) {
      // Show Baizuan Mirror Clone / Ray readiness state pip
      ctx.save();
      const dotY = y + radius + 11;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, dotY, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (isXukongshou) {
      // Show Xukongshou Void Readiness Pip
      ctx.save();
      const dotY = y + radius + 11;
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, dotY, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (isFan) {
      // Show Fan readiness pips: Overclock (Gold) / Roll (Silver-white)
      ctx.save();
      const dotY = y + radius + 11;
      if (fanOverclockActive) {
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const rollReady = fanRollCooldown <= 0;
        ctx.fillStyle = rollReady ? '#f8fafc' : 'rgba(255, 255, 255, 0.25)';
        if (rollReady) {
          ctx.shadowColor = '#f8fafc';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(x, dotY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (isTunshimozu) {
      // Show Tunshimozu 5-tier growth diamonds, stack badge, and Gluttony Burst indicator
      ctx.save();
      const dotY = y + radius + 11;
      const unlockedTiers = Math.min(5, Math.floor(growthStacks / 10));

      // 5 Demonic Growth Tier Diamonds
      const tierCount = 5;
      const spacing = 7;
      const startX = x - ((tierCount - 1) * spacing) / 2;

      for (let t = 0; t < tierCount; t++) {
        const isUnlocked = t < unlockedTiers;
        const tx = startX + t * spacing;
        ctx.fillStyle = isUnlocked ? '#f0abfc' : 'rgba(147, 51, 234, 0.25)';
        if (isUnlocked) {
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.moveTo(tx, dotY - 2.5);
        ctx.lineTo(tx + 2, dotY);
        ctx.lineTo(tx, dotY + 2.5);
        ctx.lineTo(tx - 2, dotY);
        ctx.closePath();
        ctx.fill();
      }

      // Gluttony Burst Ready Indicator Star Notch (Right of tiers)
      if (isGluttonyBurstReady) {
        const starX = startX + tierCount * spacing;
        ctx.fillStyle = '#fae8ff';
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(starX, dotY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // White Hunter Marks overhead pips on target
    if (fanHunterMarks && fanHunterMarks > 0) {
      ctx.save();
      const markCount = Math.min(3, fanHunterMarks);
      const spacing = 7;
      const startX = x - ((markCount - 1) * spacing) / 2;
      const markY = y - radius - 8;
      for (let i = 0; i < markCount; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const mx = startX + i * spacing;
        ctx.moveTo(mx, markY - 3);
        ctx.lineTo(mx + 2.2, markY);
        ctx.lineTo(mx, markY + 3);
        ctx.lineTo(mx - 2.2, markY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    } else if (charId === 'yinyong') {
      const rage = options.yinyongRageStacks || 0;
      if (rage > 0) {
        ctx.save();
        const totalPips = 10;
        const activePips = Math.min(10, rage);
        const spacing = 4.2;
        const startX = x - ((totalPips - 1) * spacing) / 2;
        const dotY = y + radius + 11;

        for (let i = 0; i < totalPips; i++) {
          const isActive = i < activePips;
          ctx.fillStyle = isActive
            ? (activePips === 10 ? '#fee2e2' : '#ef4444')
            : 'rgba(239, 68, 68, 0.2)';
          if (isActive) {
            ctx.shadowColor = activePips === 10 ? '#ffffff' : '#ef4444';
            ctx.shadowBlur = activePips === 10 ? 8 : 4;
          }
          ctx.beginPath();
          ctx.arc(startX + i * spacing, dotY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }

  ctx.restore();
}

/**
 * Draw Chanshi's Imprisoning Aura (Passive 1: 禁錮光環 - 100px radius)
 */
export function drawChanshiAura(
  ctx: CanvasRenderingContext2D,
  chanshiX: number,
  chanshiY: number,
  time: number = performance.now() * 0.001,
  auraRadius: number = 100
) {
  ctx.save();

  // 1. Radiant Golden Aura Floor Gradient
  const auraGrad = ctx.createRadialGradient(
    chanshiX,
    chanshiY,
    15,
    chanshiX,
    chanshiY,
    auraRadius
  );
  auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
  auraGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.09)');
  auraGrad.addColorStop(0.85, 'rgba(234, 179, 8, 0.04)');
  auraGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(chanshiX, chanshiY, auraRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Rotating Zen Lotus Petal Geometries (8 Petals)
  const petalCount = 8;
  for (let p = 0; p < petalCount; p++) {
    const a = (p * Math.PI * 2) / petalCount + time * 0.25;
    const pR = auraRadius * 0.65;
    const pWidth = auraRadius * 0.25;

    ctx.save();
    ctx.translate(chanshiX, chanshiY);
    ctx.rotate(a);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(pWidth, pR * 0.5, 0, pR);
    ctx.quadraticCurveTo(-pWidth, pR * 0.5, 0, 10);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Steady Rotating Concentric Golden Ring Border
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 14;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(chanshiX, chanshiY, auraRadius, time * 0.4, time * 0.4 + Math.PI * 2);
  ctx.stroke();

  // Inner subtle secondary counter-rotating ring
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(chanshiX, chanshiY, auraRadius - 6, -time * 0.3, -time * 0.3 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Orbiting Gold and Pale-White Motes along the perimeter
  const moteCount = 8;
  for (let i = 0; i < moteCount; i++) {
    const angle = time * 0.6 + (i * Math.PI * 2) / moteCount;
    const mx = chanshiX + Math.cos(angle) * auraRadius;
    const my = chanshiY + Math.sin(angle) * auraRadius;
    const isPaleWhite = i % 2 === 0;

    ctx.fillStyle = isPaleWhite ? '#fffbeb' : '#fde047';
    ctx.shadowColor = isPaleWhite ? '#ffffff' : '#facc15';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Huangzuan's Lightning Field (Passive 3: 閃電超能 - 115px radius)
 * - 以黃鑽為中心形成雷電能量區域 (半徑 115px)
 * - 霓虹金絲雀黃鑽與白色電弧在能量區域內流動、邊界旋轉環與閃電結點
 */
export function drawHuangzuanField(
  ctx: CanvasRenderingContext2D,
  huangzuanX: number,
  huangzuanY: number,
  time: number = performance.now() * 0.001,
  fieldRadius: number = 115,
  isCollapsing: boolean = false,
  collapseRatio: number = 0
) {
  ctx.save();
  const effectiveRadius = isCollapsing
    ? Math.max(8, fieldRadius * (1 - collapseRatio))
    : fieldRadius;

  // 1. Subtle Translucent Electric Canary Yellow Floor Glow
  const fieldGrad = ctx.createRadialGradient(
    huangzuanX,
    huangzuanY,
    10,
    huangzuanX,
    huangzuanY,
    effectiveRadius
  );
  fieldGrad.addColorStop(0, 'rgba(232, 252, 2, 0.24)');
  fieldGrad.addColorStop(0.5, 'rgba(200, 240, 0, 0.12)');
  fieldGrad.addColorStop(0.85, 'rgba(160, 200, 0, 0.05)');
  fieldGrad.addColorStop(1, 'rgba(120, 145, 0, 0)');
  ctx.fillStyle = fieldGrad;
  ctx.beginPath();
  ctx.arc(huangzuanX, huangzuanY, effectiveRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. High-Voltage Rotating Lightning Outer Ring
  ctx.strokeStyle = '#e8fc02';
  ctx.lineWidth = 2.2;
  ctx.shadowColor = '#faff60';
  ctx.shadowBlur = 16;
  ctx.setLineDash([14, 6, 4, 6]);
  ctx.beginPath();
  ctx.arc(huangzuanX, huangzuanY, effectiveRadius, time * 1.5, time * 1.5 + Math.PI * 2);
  ctx.stroke();

  // Secondary inner high-speed counter-rotating filament
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(huangzuanX, huangzuanY, effectiveRadius - 5, -time * 2.2, -time * 2.2 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Lightning nodes on perimeter
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    const angle = time * 1.2 + (i * Math.PI * 2) / nodeCount;
    const nx = huangzuanX + Math.cos(angle) * effectiveRadius;
    const ny = huangzuanY + Math.sin(angle) * effectiveRadius;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#e8fc02';
    ctx.shadowColor = '#e8fc02';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(nx, ny, 3.0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Internal dynamic branching lightning arcs
  for (let i = 0; i < 4; i++) {
    const a1 = time * 3.0 + i * 1.6;
    const r1 = 15 + ((time * 35 + i * 40) % (effectiveRadius - 25));
    const x1 = huangzuanX + Math.cos(a1) * r1;
    const y1 = huangzuanY + Math.sin(a1) * r1;

    const a2 = a1 + 0.9 + Math.sin(time * 6 + i) * 0.4;
    const r2 = r1 + 30;
    const x2 = huangzuanX + Math.cos(a2) * r2;
    const y2 = huangzuanY + Math.sin(a2) * r2;

    const midX = (x1 + x2) / 2 + (Math.sin(time * 22 + i) - 0.5) * 16;
    const midY = (y1 + y2) / 2 + (Math.cos(time * 22 + i) - 0.5) * 16;

    ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : '#faff60';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#faff60';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(midX, midY);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Branch fork
    const forkX = midX + Math.cos(a1 + 1.2) * 12;
    const forkY = midY + Math.sin(a1 + 1.2) * 12;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(forkX, forkY);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Lanzuan's Continuous Blue Wavelength (Passive 1: 藍色波長 - 110px radius)
 * - 藍鑽持續向周圍釋放擴散藍色波長 (半徑 110px)
 * - 波紋由中心向外擴散，範圍內持續產生細小藍色粒子與光點
 */
export function drawLanzuanWavelengthAura(
  ctx: CanvasRenderingContext2D,
  lanzuanX: number,
  lanzuanY: number,
  time: number = performance.now() * 0.001,
  auraRadius: number = 110
) {
  ctx.save();

  // 1. Subtle Translucent Blue Ambient Floor Glow
  const auraGrad = ctx.createRadialGradient(
    lanzuanX,
    lanzuanY,
    15,
    lanzuanX,
    lanzuanY,
    auraRadius
  );
  auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
  auraGrad.addColorStop(0.65, 'rgba(14, 165, 233, 0.06)');
  auraGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(lanzuanX, lanzuanY, auraRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Concentric Expanding Wavelength Ripples (Phase animation)
  const rippleCount = 3;
  for (let i = 0; i < rippleCount; i++) {
    const phase = ((time * 0.65 + (i / rippleCount)) % 1);
    const r = 20 + phase * (auraRadius - 20);
    const alpha = (1 - phase) * 0.45;

    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(lanzuanX, lanzuanY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Peripheral Dashed Boundary Ring
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(lanzuanX, lanzuanY, auraRadius, time * 0.3, time * 0.3 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Subtle Floating Blue Sparkles along perimeter
  for (let i = 0; i < 6; i++) {
    const a = time * 0.5 + (i * Math.PI * 2) / 6;
    const px = lanzuanX + Math.cos(a) * auraRadius;
    const py = lanzuanY + Math.sin(a) * auraRadius;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#bae6fd';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Lanzuan's Stationary Blue Orb (Passive 2: 藍色光球 - 3 HP)
 */
export function drawLanzuanBlueOrb(
  ctx: CanvasRenderingContext2D,
  orb: LanzuanBlueOrb,
  time: number = performance.now() * 0.001
) {
  if (!orb || orb.hp <= 0) return;

  ctx.save();
  const r = orb.radius || 14;
  const isFlashing = (orb.flashTimer || 0) > 0;

  // 1. Outer Crystalline Glow Halo & Flash
  ctx.shadowColor = isFlashing ? '#ffffff' : '#38bdf8';
  ctx.shadowBlur = isFlashing ? 24 : 16;

  // 2. Stationary Crystal Sphere Body
  const orbGrad = ctx.createRadialGradient(
    orb.x - r * 0.35,
    orb.y - r * 0.35,
    r * 0.1,
    orb.x,
    orb.y,
    r * 1.2
  );
  if (isFlashing) {
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.35, '#e0f2fe');
    orbGrad.addColorStop(0.7, '#38bdf8');
    orbGrad.addColorStop(1, '#0284c7');
  } else {
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.25, '#bae6fd');
    orbGrad.addColorStop(0.6, '#38bdf8');
    orbGrad.addColorStop(0.88, '#0284c7');
    orbGrad.addColorStop(1, '#082f49');
  }

  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
  ctx.fill();

  // 3. Orbiting Cyan Crystal Ring & Particles
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, r + 3 + Math.sin(time * 6) * 1.5, time * 2, time * 2 + Math.PI * 1.5);
  ctx.stroke();

  // Mini orbiting crystal dot
  const dotAngle = time * 3;
  const dotDist = r + 4;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(orb.x + Math.cos(dotAngle) * dotDist, orb.y + Math.sin(dotAngle) * dotDist, 2, 0, Math.PI * 2);
  ctx.fill();

  // 4. Diamond Facet Cross Lines
  ctx.strokeStyle = isFlashing ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(orb.x, orb.y - r * 0.7);
  ctx.lineTo(orb.x + r * 0.7, orb.y);
  ctx.lineTo(orb.x, orb.y + r * 0.7);
  ctx.lineTo(orb.x - r * 0.7, orb.y);
  ctx.closePath();
  ctx.stroke();

  // 5. Overhead 3-HP Diamond Bar (Segmented Crystals)
  const barW = 28;
  const barH = 3.5;
  const barX = orb.x - barW / 2;
  const barY = orb.y - r - 9;
  const hpRatio = Math.max(0, Math.min(1, orb.hp / orb.maxHp));

  // Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

  // Health Fill
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(barX, barY, barW * hpRatio, barH);

  // Segment dividers (3 HP total)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(barX + barW / 3, barY);
  ctx.lineTo(barX + barW / 3, barY + barH);
  ctx.moveTo(barX + (barW * 2) / 3, barY);
  ctx.lineTo(barX + (barW * 2) / 3, barY + barH);
  ctx.stroke();

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(barX, barY, barW, barH);

  // Label
  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 8px ui-sans-serif, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`光球 ${orb.hp}/3 HP`, orb.x, barY - 3);

  ctx.restore();
}

/**
 * Draw Lanzuan's Emotional Energy Field (Passive 3: 藍色情緒能量 - 140px radius)
 * - 以藍鑽為中心形成大範圍情緒能量場 (半徑 140px，持續 3.5 秒)
 * - 範圍內柔和藍色情緒曼陀羅波紋緩速敵方，結束時急遽收縮並引發魔法爆發
 */
export function drawLanzuanEmotionField(
  ctx: CanvasRenderingContext2D,
  lanzuanX: number,
  lanzuanY: number,
  time: number = performance.now() * 0.001,
  fieldRadius: number = 140,
  isCollapsing: boolean = false,
  collapseRatio: number = 0
) {
  ctx.save();
  const effectiveRadius = isCollapsing
    ? Math.max(8, fieldRadius * (1 - collapseRatio))
    : fieldRadius;

  // 1. Translucent Emotional Royal Blue Floor Glow
  const fieldGrad = ctx.createRadialGradient(
    lanzuanX,
    lanzuanY,
    15,
    lanzuanX,
    lanzuanY,
    effectiveRadius
  );
  fieldGrad.addColorStop(0, isCollapsing ? 'rgba(186, 230, 253, 0.45)' : 'rgba(56, 189, 248, 0.22)');
  fieldGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.12)');
  fieldGrad.addColorStop(0.85, 'rgba(2, 132, 199, 0.06)');
  fieldGrad.addColorStop(1, 'rgba(7, 89, 133, 0)');
  ctx.fillStyle = fieldGrad;
  ctx.beginPath();
  ctx.arc(lanzuanX, lanzuanY, effectiveRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Emotional Slowing Spiral Inward Vortex Lines
  const spiralArmCount = 4;
  for (let s = 0; s < spiralArmCount; s++) {
    const baseA = (s * Math.PI * 2) / spiralArmCount - time * 0.9;
    ctx.strokeStyle = isCollapsing ? 'rgba(224, 242, 254, 0.6)' : 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let r = 16; r <= effectiveRadius * 0.9; r += 6) {
      const curl = baseA + (r / effectiveRadius) * 1.5;
      const sx = lanzuanX + Math.cos(curl) * r;
      const sy = lanzuanY + Math.sin(curl) * r;
      if (r === 16) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  // 3. Rotating Emotional Mandala Ring
  ctx.strokeStyle = isCollapsing ? '#ffffff' : '#38bdf8';
  ctx.lineWidth = isCollapsing ? 2.5 : 1.8;
  ctx.shadowColor = '#0ea5e9';
  ctx.shadowBlur = 16;
  ctx.setLineDash([12, 6, 4, 6]);
  ctx.beginPath();
  ctx.arc(lanzuanX, lanzuanY, effectiveRadius, time * 0.8, time * 0.8 + Math.PI * 2);
  ctx.stroke();

  // Inner counter-rotating crystal ring
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(lanzuanX, lanzuanY, effectiveRadius - 6, -time * 1.2, -time * 1.2 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. 8 Geometric Sacred Mandala Facets & Inward Energy Needles
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + time * 0.4;
    const r1 = effectiveRadius * 0.35;
    const r2 = effectiveRadius * 0.95;

    ctx.strokeStyle = isCollapsing ? 'rgba(255, 255, 255, 0.7)' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lanzuanX + Math.cos(a) * r1, lanzuanY + Math.sin(a) * r1);
    ctx.lineTo(lanzuanX + Math.cos(a) * r2, lanzuanY + Math.sin(a) * r2);
    ctx.stroke();

    // Diamond node at facet
    const mx = lanzuanX + Math.cos(a) * (effectiveRadius * 0.65);
    const my = lanzuanY + Math.sin(a) * (effectiveRadius * 0.65);
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Perimeter nodes
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    const angle = time * 0.8 + (i * Math.PI * 2) / nodeCount;
    const nx = lanzuanX + Math.cos(angle) * effectiveRadius;
    const ny = lanzuanY + Math.sin(angle) * effectiveRadius;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(nx, ny, 3.0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Fenzuan's Pink Damage Reduction Field (Passive 2: 粉色減傷力場 - 85px radius, 5s duration)
 * - 85px radius semi-transparent pink energy shield dome
 * - Hexagonal crystal shield matrix, expanding wave ripples, glowing pink border, sparkling motes
 */
export function drawFenzuanField(
  ctx: CanvasRenderingContext2D,
  fenzuanX: number,
  fenzuanY: number,
  time: number = performance.now() * 0.001,
  fieldRadius: number = 85
) {
  ctx.save();
  const pulse = Math.sin(time * 5) * 2.5;
  const curRadius = fieldRadius + pulse;

  // 1. Semi-transparent Soft Pink Energy Field Gradient
  const fieldGrad = ctx.createRadialGradient(
    fenzuanX,
    fenzuanY,
    10,
    fenzuanX,
    fenzuanY,
    curRadius
  );
  fieldGrad.addColorStop(0, 'rgba(253, 242, 248, 0.32)');
  fieldGrad.addColorStop(0.45, 'rgba(244, 114, 182, 0.22)');
  fieldGrad.addColorStop(0.85, 'rgba(236, 72, 153, 0.14)');
  fieldGrad.addColorStop(1, 'rgba(219, 39, 119, 0)');

  ctx.fillStyle = fieldGrad;
  ctx.beginPath();
  ctx.arc(fenzuanX, fenzuanY, curRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Hexagonal Crystal Shield Grid Matrix
  ctx.strokeStyle = 'rgba(251, 207, 232, 0.22)';
  ctx.lineWidth = 1.0;
  const hexStep = 24;
  const bound = Math.floor(curRadius / hexStep) + 1;
  for (let q = -bound; q <= bound; q++) {
    for (let r = -bound; r <= bound; r++) {
      const hx = fenzuanX + hexStep * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const hy = fenzuanY + hexStep * (1.5 * r);
      if (Math.hypot(hx - fenzuanX, hy - fenzuanY) <= curRadius - 8) {
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (k * Math.PI) / 3;
          const px = hx + Math.cos(a) * (hexStep * 0.52);
          const py = hy + Math.sin(a) * (hexStep * 0.52);
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // 3. Glowing Outer Boundary Ring
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
  ctx.lineWidth = 2.2;
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 14;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(fenzuanX, fenzuanY, curRadius, time * 0.6, time * 0.6 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Concentric Shield Wave Ripples
  const rippleCount = 2;
  for (let r = 1; r <= rippleCount; r++) {
    const ripplePhase = (time * 0.8 + (r * 0.5)) % 1;
    const ripR = curRadius * (0.3 + ripplePhase * 0.68);
    const ripAlpha = (1 - ripplePhase) * 0.45;
    ctx.strokeStyle = `rgba(244, 114, 182, ${ripAlpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(fenzuanX, fenzuanY, ripR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 5. Perimeter Diamond Crystal Sparkles
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    const angle = time * 0.9 + (i * Math.PI * 2) / nodeCount;
    const nx = fenzuanX + Math.cos(angle) * curRadius;
    const ny = fenzuanY + Math.sin(angle) * curRadius;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fbcfe8';
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Lingyinsi's Stationary Clone
 */
export function drawLingyinsiClone(
  ctx: CanvasRenderingContext2D,
  clone: LingyinsiClone,
  lingyinsiX: number,
  lingyinsiY: number,
  time: number = performance.now() * 0.001
) {
  ctx.save();

  const distToMain = Math.hypot(clone.x - lingyinsiX, clone.y - lingyinsiY);
  const inShareRange = distToMain <= 120;

  // 1. Draw 120px Damage Share Range Area (Subtle glowing circle)
  ctx.save();
  ctx.beginPath();
  ctx.arc(clone.x, clone.y, 120, 0, Math.PI * 2);
  ctx.strokeStyle = inShareRange ? 'rgba(56, 189, 248, 0.35)' : 'rgba(14, 165, 233, 0.15)';
  ctx.lineWidth = inShareRange ? 1.5 : 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();

  if (inShareRange) {
    // Subtle radial aura inside range
    const rangeGrad = ctx.createRadialGradient(clone.x, clone.y, 10, clone.x, clone.y, 120);
    rangeGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
    rangeGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = rangeGrad;
    ctx.fill();

    // Damage Transfer Link Tether Beam between Main Body and Clone
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.setLineDash([6, 3]);
    ctx.lineDashOffset = -time * 24;
    ctx.beginPath();
    ctx.moveTo(clone.x, clone.y);
    ctx.lineTo(lingyinsiX, lingyinsiY);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Clone Body Sphere (Ethereal translucent spiritual replica)
  const cloneAlpha = 0.85 + Math.sin(time * 6) * 0.1;
  ctx.globalAlpha = cloneAlpha;

  // Clone 3D gradient
  const r = clone.radius;
  const cloneGrad = ctx.createRadialGradient(
    clone.x - r * 0.35,
    clone.y - r * 0.35,
    r * 0.1,
    clone.x,
    clone.y,
    r
  );
  cloneGrad.addColorStop(0, '#e0f2fe');
  cloneGrad.addColorStop(0.3, '#38bdf8');
  cloneGrad.addColorStop(0.7, '#0284c7');
  cloneGrad.addColorStop(1, 'rgba(3, 105, 161, 0.85)');

  ctx.fillStyle = cloneGrad;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(clone.x, clone.y, r, 0, Math.PI * 2);
  ctx.fill();

  // Clone Ring
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Spiritual Marksman Pattern
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(clone.x, clone.y, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + time * 0.8;
    ctx.beginPath();
    ctx.moveTo(clone.x + Math.cos(a) * (r * 0.3), clone.y + Math.sin(a) * (r * 0.3));
    ctx.lineTo(clone.x + Math.cos(a) * (r * 0.75), clone.y + Math.sin(a) * (r * 0.75));
    ctx.stroke();
  }

  // 3. Mini Clone Health Bar (17 HP max)
  const barW = 28;
  const barH = 3.5;
  const barX = clone.x - barW / 2;
  const barY = clone.y - r - 8;
  const hpRatio = Math.max(0, Math.min(1, clone.hp / clone.maxHp));

  ctx.globalAlpha = 1.0;
  // Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
  // Health Fill
  ctx.fillStyle = hpRatio > 0.4 ? '#38bdf8' : '#ef4444';
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(barX, barY, barW, barH);

  // Label
  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 8px ui-sans-serif, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`分身 ${Math.ceil(clone.hp)}HP`, clone.x, barY - 3);

  ctx.restore();
}

/**
 * Draw Baizuan's Mirror Clone (Passive 1: 鏡像分身 - 2 segments HP)
 * - 召喚 1 個敵方球體的鏡像分身 (2 格生命值，最多存在 15 秒)
 * - 分身模仿敵方外觀與被動技能一，擁有半透明銀白鏡面晶體折射層與頭頂 2 格晶體血條
 */
export function drawBaizuanClone(
  ctx: CanvasRenderingContext2D,
  clone: BaizuanMirrorClone,
  time: number = performance.now() * 0.001
) {
  if (!clone || clone.hp <= 0) return;

  ctx.save();
  const r = clone.radius || 17;
  const isFlashing = !!(clone.lastHitTime && (time - clone.lastHitTime < 0.15));

  // 1. Draw Mirrored Enemy Champion Base Body
  drawChampionSphere(
    ctx,
    clone.x,
    clone.y,
    r,
    clone.targetCharId,
    {
      time,
      isFlashing
    }
  );

  // 2. Translucent Silver-White Holographic Mirror Refraction Overlay
  ctx.save();
  ctx.globalAlpha = 0.55 + Math.sin(time * 6) * 0.12;

  // Prismatic Mirror Crystalline Gradient
  const mirrorGrad = ctx.createLinearGradient(
    clone.x - r,
    clone.y - r,
    clone.x + r,
    clone.y + r
  );
  mirrorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  mirrorGrad.addColorStop(0.35, 'rgba(226, 232, 240, 0.45)');
  mirrorGrad.addColorStop(0.65, 'rgba(203, 213, 225, 0.3)');
  mirrorGrad.addColorStop(1, 'rgba(255, 255, 255, 0.75)');

  ctx.fillStyle = mirrorGrad;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(clone.x, clone.y, r, 0, Math.PI * 2);
  ctx.fill();

  // Outer Crystalline Mirror Rim
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // 3. Mirror Diamond Facet Refraction Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(clone.x, clone.y - r * 0.75);
  ctx.lineTo(clone.x + r * 0.75, clone.y);
  ctx.lineTo(clone.x, clone.y + r * 0.75);
  ctx.lineTo(clone.x - r * 0.75, clone.y);
  ctx.closePath();
  ctx.stroke();

  // Diagonal Specular Reflection Sweep
  const sweepAngle = time * 2;
  const sx = clone.x + Math.cos(sweepAngle) * (r * 0.5);
  const sy = clone.y + Math.sin(sweepAngle) * (r * 0.5);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(sx, sy, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 4. Overhead Segmented 2-HP Diamond Bar
  const barW = 26;
  const barH = 3.5;
  const barX = clone.x - barW / 2;
  const barY = clone.y - r - 9;
  const hpRatio = Math.max(0, Math.min(1, clone.hp / clone.maxHp));

  ctx.save();
  // Bar Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

  // Health Fill (Pure White / Cold Silver Diamond)
  const fillGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
  fillGrad.addColorStop(0, '#ffffff');
  fillGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = fillGrad;
  ctx.fillRect(barX, barY, barW * hpRatio, barH);

  // 2-Segment Divider (Center Line)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(barX + barW / 2, barY);
  ctx.lineTo(barX + barW / 2, barY + barH);
  ctx.stroke();

  // Bar Outer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 0.6;
  ctx.strokeRect(barX, barY, barW, barH);

  // Overhead Label
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 6;
  ctx.font = 'bold 8px ui-sans-serif, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`鏡像分身 ${clone.hp}/2`, clone.x, barY - 3);
  ctx.restore();

  ctx.restore();
}

/**
 * Draw Baizuan's Radiant White Shining Field (Passive 2: 閃耀 - 115px radius)
 * - 停止移動，持續 5 秒釋放純白耀斑
 * - 115px 範圍內爆發璀璨光芒、旋轉星芒稜鏡射線與閃光結點
 */
export function drawBaizuanShining(
  ctx: CanvasRenderingContext2D,
  baizuanX: number,
  baizuanY: number,
  time: number = performance.now() * 0.001,
  fieldRadius: number = 115
) {
  ctx.save();

  // 1. Radiant Pure White Floor Glow Gradient
  const fieldGrad = ctx.createRadialGradient(
    baizuanX,
    baizuanY,
    12,
    baizuanX,
    baizuanY,
    fieldRadius
  );
  fieldGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  fieldGrad.addColorStop(0.35, 'rgba(241, 245, 249, 0.22)');
  fieldGrad.addColorStop(0.75, 'rgba(224, 242, 254, 0.12)');
  fieldGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = fieldGrad;
  ctx.beginPath();
  ctx.arc(baizuanX, baizuanY, fieldRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Outward Expanding Crystalline Stun Wave Pulses
  const pulseRingCount = 3;
  for (let p = 0; p < pulseRingCount; p++) {
    const wavePhase = (time * 1.5 + p / pulseRingCount) % 1;
    const waveR = 15 + wavePhase * (fieldRadius - 15);
    const waveAlpha = (1 - wavePhase) * 0.55;

    ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(baizuanX, baizuanY, waveR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Rotating 8-Point Prism Star Beams with Diamond Rune Facets
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + time * 0.6;
    const len = fieldRadius * (i % 2 === 0 ? 0.95 : 0.65);
    const endX = baizuanX + Math.cos(angle) * len;
    const endY = baizuanY + Math.sin(angle) * len;

    const beamGrad = ctx.createLinearGradient(baizuanX, baizuanY, endX, endY);
    beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    beamGrad.addColorStop(0.5, 'rgba(241, 245, 249, 0.45)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = i % 2 === 0 ? 2.2 : 1.4;
    ctx.beginPath();
    ctx.moveTo(baizuanX, baizuanY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Geometric Diamond Rhombus along main axes
    if (i % 2 === 0) {
      const midDist = fieldRadius * 0.55;
      const mx = baizuanX + Math.cos(angle) * midDist;
      const my = baizuanY + Math.sin(angle) * midDist;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 6);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // 4. High-Refraction Concentric Boundary Ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.0;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 18;
  ctx.setLineDash([12, 6, 4, 6]);
  ctx.beginPath();
  ctx.arc(baizuanX, baizuanY, fieldRadius, time * 1.2, time * 1.2 + Math.PI * 2);
  ctx.stroke();

  // Secondary inner counter-rotating ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.arc(baizuanX, baizuanY, fieldRadius - 6, -time * 1.5, -time * 1.5 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Perimeter Diamond Sparkle Nodes
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    const angle = time * 1.2 + (i * Math.PI * 2) / nodeCount;
    const nx = baizuanX + Math.cos(angle) * fieldRadius;
    const ny = baizuanY + Math.sin(angle) * fieldRadius;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(nx, ny, 3.0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Central Blinding Supernova Core
  const pulse = Math.sin(time * 12) * 4;
  const coreR = Math.max(8, 20 + pulse);
  const coreGrad = ctx.createRadialGradient(baizuanX, baizuanY, 0, baizuanX, baizuanY, coreR);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.95)');
  coreGrad.addColorStop(0.7, 'rgba(224, 242, 254, 0.5)');
  coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(baizuanX, baizuanY, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw Jianxian's Million Sword Array Ground Formation (Passive 3: 百萬劍陣 160px 守護劍陣)
 * - 守護劍陣持續 10 秒，地面顯現八卦太極劍陣陣圖、青藍仙靈道紋光環、旋轉護體飛劍符文與靈光波動
 */
export function drawJianxianArrayField(
  ctx: CanvasRenderingContext2D,
  jxX: number,
  jxY: number,
  time: number = performance.now() * 0.001,
  fieldRadius: number = 160,
  durationRemaining: number = 10
) {
  ctx.save();

  // Alpha fade out in last 1.2 seconds
  const alphaFactor = durationRemaining < 1.2 ? Math.max(0.1, durationRemaining / 1.2) : 1.0;

  // 1. Subtle Translucent Celestial Blue / Silver Jade Floor Glow
  const fieldGrad = ctx.createRadialGradient(jxX, jxY, 15, jxX, jxY, fieldRadius);
  fieldGrad.addColorStop(0, `rgba(56, 189, 248, ${0.22 * alphaFactor})`);
  fieldGrad.addColorStop(0.45, `rgba(14, 165, 233, ${0.12 * alphaFactor})`);
  fieldGrad.addColorStop(0.8, `rgba(2, 132, 199, ${0.05 * alphaFactor})`);
  fieldGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = fieldGrad;
  ctx.beginPath();
  ctx.arc(jxX, jxY, fieldRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Rotating Daoist Tai-Chi Bagua Inscription Rings
  ctx.save();
  ctx.translate(jxX, jxY);
  ctx.rotate(time * 0.4);

  // Outer primary talisman sword ring
  ctx.strokeStyle = `rgba(186, 230, 253, ${0.8 * alphaFactor})`;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([16, 8, 6, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, fieldRadius * 0.95, 0, Math.PI * 2);
  ctx.stroke();

  // Counter-rotating inner formation ring
  ctx.rotate(-time * 0.8);
  ctx.strokeStyle = `rgba(56, 189, 248, ${0.65 * alphaFactor})`;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, fieldRadius * 0.68, 0, Math.PI * 2);
  ctx.stroke();

  // Intermediate celestial division ring
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * alphaFactor})`;
  ctx.lineWidth = 1.0;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, fieldRadius * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 3. 8 Cardinal Sword Inscriptions pointing into the formation
  ctx.save();
  ctx.translate(jxX, jxY);
  for (let i = 0; i < 8; i++) {
    const swordAngle = (i * Math.PI) / 4 + time * 0.3;
    const rDist = fieldRadius * 0.82;
    const sx = Math.cos(swordAngle) * rDist;
    const sy = Math.sin(swordAngle) * rDist;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(swordAngle + Math.PI * 0.5);

    // Miniature floor sword rune
    ctx.strokeStyle = `rgba(224, 242, 254, ${0.75 * alphaFactor})`;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.4 * alphaFactor})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(2.5, 3);
    ctx.lineTo(-2.5, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Small star glow
    ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alphaFactor})`;
    ctx.beginPath();
    ctx.arc(0, -9, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();

  // 4. Inward Floating Sword Qi Wisps
  const wispCount = 6;
  for (let w = 0; w < wispCount; w++) {
    const wispPhase = (time * 1.2 + w / wispCount) % 1;
    const wispR = fieldRadius * (0.95 - wispPhase * 0.65);
    const wispA = (w * Math.PI * 2) / wispCount + time * 0.7;
    const wx = jxX + Math.cos(wispA) * wispR;
    const wy = jxY + Math.sin(wispA) * wispR;

    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - wispPhase) * 0.65 * alphaFactor})`;
    ctx.beginPath();
    ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Baizuan's White Death Ray (Passive 3: 白色死光 - 300px beam)
 * - 300px 直線白色死光，高能晶體光束與端點耀斑
 */
export function drawBaizuanDeathRay(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  angle: number,
  length: number = 300,
  time: number = performance.now() * 0.001
) {
  ctx.save();
  const endX = startX + Math.cos(angle) * length;
  const endY = startY + Math.sin(angle) * length;

  // 0. Arena Floor Illumination Projection (High-Visibility Glow Track)
  const floorGrad = ctx.createLinearGradient(startX, startY, endX, endY);
  floorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  floorGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.35)');
  floorGrad.addColorStop(0.75, 'rgba(186, 230, 253, 0.2)');
  floorGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.strokeStyle = floorGrad;
  ctx.lineWidth = 44 + Math.sin(time * 16) * 5;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 32;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // 1. Outer Diffuse Luminous Bloom Sheath with Prismatic Soft Tint
  const sheathGrad = ctx.createLinearGradient(startX, startY, endX, endY);
  sheathGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sheathGrad.addColorStop(0.25, 'rgba(224, 242, 254, 0.85)');
  sheathGrad.addColorStop(0.65, 'rgba(186, 230, 253, 0.65)');
  sheathGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

  ctx.strokeStyle = sheathGrad;
  ctx.lineWidth = 26 + Math.sin(time * 20) * 4;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // 2. Mid Prismatic Diamond Energy Laser Beam
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.98)';
  ctx.lineWidth = 12 + Math.sin(time * 26) * 2;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // 3. Pure Intense White High-Voltage Laser Core
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4.8;
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // 4. Dynamic High-Frequency Electric Lightning Filaments along the beam
  for (let l = 0; l < 3; l++) {
    ctx.strokeStyle = l === 0 ? '#ffffff' : 'rgba(224, 242, 254, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    const segments = 6;
    for (let s = 1; s <= segments; s++) {
      const segRatio = s / segments;
      const baseSegX = startX + Math.cos(angle) * (length * segRatio);
      const baseSegY = startY + Math.sin(angle) * (length * segRatio);
      // Perpendicular jitter offset
      const jitter = Math.sin(time * 30 + s * 2 + l * 4) * (8 - s * 0.8);
      const perpAngle = angle + Math.PI / 2;
      const jx = baseSegX + Math.cos(perpAngle) * jitter;
      const jy = baseSegY + Math.sin(perpAngle) * jitter;
      ctx.lineTo(jx, jy);
    }
    ctx.stroke();
  }

  // 5. Moving Photonic Plasma Pulses surging down the ray
  const pulseCount = 6;
  for (let p = 0; p < pulseCount; p++) {
    const pulsePhase = (time * 3.2 + p / pulseCount) % 1;
    const px = startX + Math.cos(angle) * (length * pulsePhase);
    const py = startY + Math.sin(angle) * (length * pulsePhase);

    // High intensity diamond photon bead
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Micro containment ring around bead
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 11, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 6. Stationary & Rotating Prismatic Crystal Focusing Lenses along the beam
  const ringDistances = [50, 110, 170, 230, 280];
  ringDistances.forEach((d, idx) => {
    if (d < length) {
      const rx = startX + Math.cos(angle) * d;
      const ry = startY + Math.sin(angle) * d;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(angle);
      const ringSpin = time * (idx % 2 === 0 ? 5 : -5);
      ctx.rotate(ringSpin);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      // Diamond lens shape
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(4.5, 0);
      ctx.lineTo(0, 9);
      ctx.lineTo(-4.5, 0);
      ctx.closePath();
      ctx.stroke();

      // Cross reticle lines
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(7, 0);
      ctx.moveTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.stroke();

      ctx.restore();
    }
  });

  // 7. Source Emission Nozzle (12-Point Rotating Diamond Flare & Focus Array)
  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(time * 3.5);
  const flareR = 16;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const r = i % 2 === 0 ? flareR : flareR * 0.45;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();

  // Expanding shockwave ring at nozzle
  const muzzleRingR = (time * 40) % 24;
  const muzzleAlpha = Math.max(0, 1 - muzzleRingR / 24);
  ctx.strokeStyle = `rgba(255, 255, 255, ${muzzleAlpha})`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, flareR + muzzleRingR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 8. Beam Terminus / High Energy Impact Sparkle Burst
  ctx.save();
  ctx.translate(endX, endY);
  const termR = 10 + Math.sin(time * 20) * 3;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 26;
  ctx.beginPath();
  ctx.arc(0, 0, termR, 0, Math.PI * 2);
  ctx.fill();

  // Expanding impact shockwave rings
  for (let w = 0; w < 2; w++) {
    const wr = ((time * 50 + w * 18) % 32) + 6;
    const wa = Math.max(0, 1 - wr / 38);
    ctx.strokeStyle = `rgba(255, 255, 255, ${wa * 0.85})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, wr, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 8-Point Prismatic impact star flare
  ctx.rotate(-time * 6);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const flen = i % 2 === 0 ? termR * 2.6 : termR * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * flen, Math.sin(a) * flen);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Draw Lingyinsi's Orbiting Green Orbs (Passive 3: 聚集回金集)
 */
export function drawOrbitingGreenOrbs(
  ctx: CanvasRenderingContext2D,
  lingyinsiX: number,
  lingyinsiY: number,
  greenOrbs: OrbitingGreenOrb[],
  orbitAngle: number,
  time: number = performance.now() * 0.001
) {
  if (!greenOrbs || greenOrbs.length === 0) return;

  const orbitRadius = 42;

  ctx.save();

  // Draw faint orbital ring track
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(lingyinsiX, lingyinsiY, orbitRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw each active orb
  greenOrbs.forEach((orb) => {
    if (!orb.active) return;

    const angle = orb.angle + orbitAngle;
    const ox = lingyinsiX + Math.cos(angle) * orbitRadius;
    const oy = lingyinsiY + Math.sin(angle) * orbitRadius;
    const r = orb.radius || 7;

    // Glowing Emerald Outer Halo
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 14;

    const orbGrad = ctx.createRadialGradient(
      ox - r * 0.35,
      oy - r * 0.35,
      r * 0.1,
      ox,
      oy,
      r * 1.3
    );
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.3, '#86efac');
    orbGrad.addColorStop(0.7, '#22c55e');
    orbGrad.addColorStop(1, '#15803d');

    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fill();

    // Emerald Ring Halo
    ctx.strokeStyle = '#dcfce7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox, oy, r + 2 + Math.sin(time * 8 + orb.angle) * 1.2, 0, Math.PI * 2);
    ctx.stroke();

    // Center Core Light
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ox - r * 0.25, oy - r * 0.25, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draw in-flight Projectiles:
 * 1. Purple Energy Bar (7s erratic beam)
 * 2. Magic Missiles (Homing arcane bolts)
 * 3. Psionic Blue Arrow (Lingyinsi 5s straight skillshot)
 */
export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  proj: Projectile,
  time: number = performance.now() * 0.001
) {
  ctx.save();

  if (proj.type === 'purple_energy_bar') {
    // --- PURPLE ENERGY BAR (長條型能量條) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.45;
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4 * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const len = proj.width || 34;
    const h = proj.height || 9;

    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.beginPath();
    ctx.roundRect(-len / 2 - 3, -h / 2 - 3, len + 6, h + 6, 6);
    ctx.fill();

    const beamGrad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    beamGrad.addColorStop(0, 'rgba(126, 34, 206, 0.7)');
    beamGrad.addColorStop(0.5, '#c084fc');
    beamGrad.addColorStop(0.9, '#f3e8ff');
    beamGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.roundRect(-len / 2, -h / 2, len, h, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-len / 2 + 4, -1.5, len - 6, 3, 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(len / 2, -h / 2);
    ctx.lineTo(len / 2 + 6, 0);
    ctx.lineTo(len / 2, h / 2);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'purple_bomb') {
    // --- HAILAISE PURPLE BOMB (海萊斯被動三: 紫色爆彈) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.6;
        ctx.fillStyle = i % 2 === 0 ? '#c084fc' : '#9333ea';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (proj.radius || 10) * (1 - i / proj.trail.length) * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const r = proj.radius || 10;

    // 1. Outer Arcane Glow & Pulsing Aura
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 18;

    const bombGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 1.6);
    bombGrad.addColorStop(0, '#ffffff');
    bombGrad.addColorStop(0.25, '#f5d0fe');
    bombGrad.addColorStop(0.55, '#c084fc');
    bombGrad.addColorStop(0.85, '#9333ea');
    bombGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');

    ctx.fillStyle = bombGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Solid High-Density Arcane Core
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // 3. Bright Diamond Rune Core
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(r * 0.9, 0);
    ctx.lineTo(0, -r * 0.55);
    ctx.lineTo(-r * 0.9, 0);
    ctx.lineTo(0, r * 0.55);
    ctx.closePath();
    ctx.fill();

    // 4. Arcane Cross Spark
    ctx.strokeStyle = '#fae8ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, 0);
    ctx.lineTo(r * 0.6, 0);
    ctx.moveTo(0, -r * 0.6);
    ctx.lineTo(0, r * 0.6);
    ctx.stroke();
  } else if (proj.type === 'magic_missile') {
    // --- HOMING MAGIC MISSILE (魔法飛彈) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.5;
        ctx.fillStyle = i % 2 === 0 ? '#c084fc' : '#e879f9';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (proj.radius || 6) * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const r = proj.radius || 7;

    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 14;

    const misGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 1.5);
    misGrad.addColorStop(0, '#ffffff');
    misGrad.addColorStop(0.3, '#f0abfc');
    misGrad.addColorStop(0.7, '#a855f7');
    misGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');

    ctx.fillStyle = misGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(r * 1.2, 0);
    ctx.lineTo(0, -r * 0.7);
    ctx.lineTo(-r * 0.8, 0);
    ctx.lineTo(0, r * 0.7);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'blue_light_arrow') {
    // --- PSIONIC BLUE ARROW (靈能藍光箭) ---
    // Draw motion trail
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.6;
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#0ea5e9';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5 * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const len = proj.width || 28;
    const h = proj.height || 6;

    // Glowing Cyan Energy Halo
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 14;

    // Arrow Shaft Gradient
    const arrowGrad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    arrowGrad.addColorStop(0, 'rgba(2, 132, 199, 0.2)');
    arrowGrad.addColorStop(0.4, '#0ea5e9');
    arrowGrad.addColorStop(0.85, '#38bdf8');
    arrowGrad.addColorStop(1, '#ffffff');

    // Arrow Body
    ctx.fillStyle = arrowGrad;
    ctx.beginPath();
    ctx.moveTo(-len / 2, -h / 4);
    ctx.lineTo(len / 4, -h / 3);
    ctx.lineTo(len / 4, -h / 2);
    ctx.lineTo(len / 2 + 5, 0); // sharp tip
    ctx.lineTo(len / 4, h / 2);
    ctx.lineTo(len / 4, h / 3);
    ctx.lineTo(-len / 2, h / 4);
    ctx.closePath();
    ctx.fill();

    // Energy Feathers at tail
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-len / 2 + 2, -h / 2);
    ctx.lineTo(-len / 2 + 6, 0);
    ctx.lineTo(-len / 2 + 2, h / 2);
    ctx.stroke();

    // Brilliant White Core Needle
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-len / 3, -1);
    ctx.lineTo(len / 2 + 3, 0);
    ctx.lineTo(-len / 3, 1);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'lanzuan_bullet') {
    // --- LANZUAN BLUE ENERGY BULLET (藍色能量子彈) ---
    // 1. Trail Particles & Gradient Glow Points
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * (0.65 - (i / proj.trail.length) * 0.4);
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#e0f2fe';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (proj.radius || 6) * (0.8 - (i / proj.trail.length) * 0.45), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const br = proj.radius || 6;

    // 2. Luminous Outer Blue Aura
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;

    // 3. Teardrop/Spherical Energy Bullet Body
    const bulletGrad = ctx.createRadialGradient(-1, 0, 0.5, 0, 0, br * 1.3);
    bulletGrad.addColorStop(0, '#ffffff');
    bulletGrad.addColorStop(0.25, '#e0f2fe');
    bulletGrad.addColorStop(0.6, '#38bdf8');
    bulletGrad.addColorStop(0.9, '#0284c7');
    bulletGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

    ctx.fillStyle = bulletGrad;
    ctx.beginPath();
    // Teardrop energy shape pointed forward
    ctx.moveTo(br * 1.5, 0);
    ctx.bezierCurveTo(br * 0.8, -br * 1.1, -br * 1.2, -br * 0.9, -br * 1.5, 0);
    ctx.bezierCurveTo(-br * 1.2, br * 0.9, br * 0.8, br * 1.1, br * 1.5, 0);
    ctx.closePath();
    ctx.fill();

    // 4. Diamond Core Sparkle in Center
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(br * 0.9, 0);
    ctx.lineTo(0, -br * 0.45);
    ctx.lineTo(-br * 0.8, 0);
    ctx.lineTo(0, br * 0.45);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'lanzuan_crystal_ray') {
    // --- LANZUAN CRYSTAL RAY (水晶射線) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.6;
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#e0f2fe';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3 * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const len = proj.width || 30;
    const h = proj.height || 6;

    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;

    // Laser Beam Shaft
    const rayGrad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
    rayGrad.addColorStop(0, 'rgba(2, 132, 199, 0.2)');
    rayGrad.addColorStop(0.4, '#0ea5e9');
    rayGrad.addColorStop(0.85, '#38bdf8');
    rayGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(-len / 2, -h / 3);
    ctx.lineTo(len / 4, -h / 2);
    ctx.lineTo(len / 2 + 5, 0);
    ctx.lineTo(len / 4, h / 2);
    ctx.lineTo(-len / 2, h / 3);
    ctx.closePath();
    ctx.fill();

    // Brilliant White Core Needle
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-len / 3, -1);
    ctx.lineTo(len / 2 + 3, 0);
    ctx.lineTo(-len / 3, 1);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'fenzuan_shield') {
    // --- FENZUAN PINK CIRCULAR DIAMOND ENERGY SHIELD (粉色圓形能量盾牌) ---
    // Draw motion trail
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.45;
        ctx.fillStyle = i % 2 === 0 ? '#f472b6' : '#fbcfe8';
        ctx.beginPath();
        const trailR = Math.max(0.5, (proj.radius || 12) * Math.max(0.08, 0.8 - (i / proj.trail.length) * 0.6));
        ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const spin = proj.spin || time * 6;
    ctx.translate(proj.x, proj.y);
    ctx.rotate(spin);

    const r = proj.radius || 14;

    // Glowing Pink Halo
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 14;

    // Shield Circular Body Gradient
    const shieldGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 1, 0, 0, r);
    shieldGrad.addColorStop(0, '#ffffff');
    shieldGrad.addColorStop(0.3, '#fce7f3');
    shieldGrad.addColorStop(0.7, '#f472b6');
    shieldGrad.addColorStop(1, '#db2777');

    ctx.fillStyle = shieldGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Outer Diamond Edge Rim
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Facet Bevel Lines inside Shield
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.8);
    ctx.lineTo(r * 0.8, 0);
    ctx.lineTo(0, r * 0.8);
    ctx.lineTo(-r * 0.8, 0);
    ctx.closePath();
    ctx.stroke();

    // Central White Diamond Core Jewel
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.3);
    ctx.lineTo(r * 0.3, 0);
    ctx.lineTo(0, r * 0.3);
    ctx.lineTo(-r * 0.3, 0);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'fan_hunter_arrow') {
    drawFanArrowVisuals(ctx, proj, performance.now() / 1000);
  } else if (proj.type === 'mimi_heart_shot') {
    // --- MIMI HEART SHOT (愛心飛射) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.45;
        ctx.fillStyle = i % 2 === 0 ? '#f472b6' : '#fda4af';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4 * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const r = proj.radius || 12;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 18;

    // Glowing 3D Heart Shape
    const heartGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 2, 0, 0, r * 1.4);
    heartGrad.addColorStop(0, '#ffffff');
    heartGrad.addColorStop(0.25, '#fbcfe8');
    heartGrad.addColorStop(0.65, '#ec4899');
    heartGrad.addColorStop(1, '#be185d');

    const s = r / 14;
    ctx.scale(s, s);
    ctx.fillStyle = heartGrad;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-9, -8, -16, 0, 0, 14);
    ctx.bezierCurveTo(16, 0, 9, -8, 0, 4);
    ctx.closePath();
    ctx.fill();

    // Heart Outline & Specular Rim
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Shimmering Inner Glimmer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(-4, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'jiandao_needle') {
    // --- JIANDAOSHOU SACRED FLYING NEEDLE (聖針連射) ---
    // Fine silver-white light trail ribbon
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.6;
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.4 * (1 - i / proj.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    // Slender silver-white needle body
    const needleLen = 22;
    const needleW = 2.4;

    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;

    // Outer sacred glow aura
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = needleW + 2;
    ctx.beginPath();
    ctx.moveTo(-needleLen * 0.5, 0);
    ctx.lineTo(needleLen * 0.5, 0);
    ctx.stroke();

    // Needle metallic body (silver to white to gold tip)
    const needleGrad = ctx.createLinearGradient(-needleLen * 0.5, 0, needleLen * 0.5, 0);
    needleGrad.addColorStop(0, '#94a3b8');
    needleGrad.addColorStop(0.35, '#cbd5e1');
    needleGrad.addColorStop(0.8, '#ffffff');
    needleGrad.addColorStop(1, '#fef08a'); // gold glint on sharp tip

    ctx.strokeStyle = needleGrad;
    ctx.lineWidth = needleW;
    ctx.beginPath();
    ctx.moveTo(-needleLen * 0.5, 0);
    ctx.lineTo(needleLen * 0.5, 0);
    ctx.stroke();

    // Needle eyelet hole at rear
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(-needleLen * 0.42, 0, 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Piercing sharp point starburst
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(needleLen * 0.5, 0, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'dina_white_light') {
    // --- 蒂納 (Dina) 被動一: 白光 (Radiant White Starlight Sphere) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        const trailR = (proj.radius || 6) * 0.7 * (1 - prog);
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.45 * (1 - prog);
        ctx.fillStyle = 'rgba(224, 231, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailR + 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.translate(proj.x, proj.y);
    const r = proj.radius || 6;

    // Outer starlight aura (multi-stop radial gradient for silky smooth 60fps glow)
    const whiteAura = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r + 4);
    whiteAura.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    whiteAura.addColorStop(0.5, 'rgba(224, 231, 255, 0.35)');
    whiteAura.addColorStop(1, 'rgba(199, 210, 254, 0)');
    ctx.fillStyle = whiteAura;
    ctx.beginPath();
    ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
    ctx.fill();

    // Radiant gradient sphere
    const whiteGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
    whiteGrad.addColorStop(0, '#ffffff');
    whiteGrad.addColorStop(0.5, '#f8fafc');
    whiteGrad.addColorStop(0.85, '#e0e7ff');
    whiteGrad.addColorStop(1, '#c7d2fe');
    ctx.fillStyle = whiteGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 4-pointed micro starburst core
    ctx.save();
    ctx.rotate(time * 4);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.75, 0);
    ctx.lineTo(r * 0.75, 0);
    ctx.moveTo(0, -r * 0.75);
    ctx.lineTo(0, r * 0.75);
    ctx.stroke();
    ctx.restore();
  } else if (proj.type === 'dina_dark_light') {
    // --- 蒂納 (Dina) 被動二: 暗光 (Abyssal Void Bolt) ---
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        const trailR = (proj.radius || 8) * 0.75 * (1 - prog);
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.45 * (1 - prog);
        ctx.fillStyle = 'rgba(126, 34, 206, 0.45)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailR + 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.translate(proj.x, proj.y);
    const r = proj.radius || 8;

    // Dark void distortion halo
    const darkAura = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r + 5);
    darkAura.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
    darkAura.addColorStop(0.5, 'rgba(126, 34, 206, 0.3)');
    darkAura.addColorStop(1, 'rgba(59, 7, 100, 0)');
    ctx.fillStyle = darkAura;
    ctx.beginPath();
    ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
    ctx.fill();

    // Abyssal gradient core
    const darkGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
    darkGrad.addColorStop(0, '#09090b');
    darkGrad.addColorStop(0.65, '#3b0764');
    darkGrad.addColorStop(0.9, '#581c87');
    darkGrad.addColorStop(1, '#c084fc');
    ctx.fillStyle = darkGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Event horizon pulsing ring
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (proj.type === 'dina_fusion_orb') {
    // --- 蒂納 (Dina) 被動三: 三相融合光球 (Tri-Phase Fusion Orb) ---
    // 特徵: 黑色核心、白色外環、黑白旋轉能量、三道光刃高速旋轉、黑白魔法粒子環繞
    if (proj.trail && proj.trail.length > 0) {
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        const trailR = (proj.radius || 10) * 0.65 * (1 - prog);
        ctx.save();
        ctx.globalAlpha = pt.alpha * 0.5 * (1 - prog);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(192, 132, 252, 0.8)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.translate(proj.x, proj.y);
    const r = proj.radius || 10;
    const isPerfect = proj.dinaFusionType === 'perfect';

    // 1. 外層神聖/深淵交融光暈 (Outer Corona - Zero shadowBlur, pure radial gradient)
    const coronaGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r + 7);
    if (isPerfect) {
      coronaGrad.addColorStop(0, 'rgba(251, 113, 133, 0.8)');
      coronaGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.35)');
      coronaGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');
    } else {
      coronaGrad.addColorStop(0, 'rgba(232, 121, 249, 0.7)');
      coronaGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.35)');
      coronaGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
    }
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r + 7, 0, Math.PI * 2);
    ctx.fill();

    // 2. 白色外環 (White Outer Ring)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 3. 黑色核心 (Black Core)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, 0, r - 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. 黑白旋轉能量 (Dual-Rotating Yin-Yang Energy Vortex)
    ctx.save();
    ctx.rotate(time * 8);
    // 白旋翼
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r - 2, 0, Math.PI);
    ctx.fill();
    // 黑紫反向翼
    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.arc(0, 0, (r - 2) * 0.55, 0, Math.PI * 2);
    ctx.fill();
    // 中心能量星
    ctx.fillStyle = isPerfect ? '#facc15' : '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. 三道光刃高速旋轉 (Three Orbiting Micro Blades)
    ctx.save();
    const bladeDist = r * 1.55;
    for (let i = 0; i < 3; i++) {
      const bAngle = time * 10 + (i * Math.PI * 2) / 3;
      const bpx = Math.cos(bAngle) * bladeDist;
      const bpy = Math.sin(bAngle) * bladeDist;
      ctx.save();
      ctx.translate(bpx, bpy);
      ctx.rotate(bAngle + Math.PI * 0.5);
      ctx.fillStyle = i === 0 ? '#ffffff' : i === 1 ? '#a855f7' : '#c084fc';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(2.2, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(-2.2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  } else if (proj.type === 'jianxian_burst_sword' || proj.type === 'jianxian_slow_sword') {
    // --- 劍仙 (Jianxian) 仙靈白劍 / 緩速仙劍 ---
    const isSlow = proj.type === 'jianxian_slow_sword';
    const angle = Math.atan2(proj.vy, proj.vx);

    // 1. 飛行流光尾跡
    if (proj.trail && proj.trail.length > 0) {
      ctx.save();
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        const trailAlpha = pt.alpha * 0.45 * (1 - prog);
        ctx.fillStyle = isSlow
          ? `rgba(56, 189, 248, ${trailAlpha})`
          : `rgba(255, 255, 255, ${trailAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (proj.radius || 8) * 0.5 * (1 - prog), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const swordLen = (proj.length || 24);
    const swordW = (proj.width || 7);
    const halfW = swordW * 0.5;

    // 2. 外圍仙氣輝光 (Radial gradient glow, 零 shadowBlur)
    const glowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, swordLen * 0.7);
    glowGrad.addColorStop(0, isSlow ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.75)');
    glowGrad.addColorStop(0.6, isSlow ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.3)');
    glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, swordLen * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // 3. 仙劍刃身 (指向正 X 軸方向)
    ctx.save();
    const bladeGrad = ctx.createLinearGradient(-swordLen * 0.5, 0, swordLen * 0.5, 0);
    bladeGrad.addColorStop(0, isSlow ? '#bae6fd' : '#f0f9ff');
    bladeGrad.addColorStop(0.7, '#ffffff');
    bladeGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = bladeGrad;

    ctx.beginPath();
    ctx.moveTo(swordLen * 0.5, 0); // 劍尖
    ctx.lineTo(swordLen * 0.1, halfW);
    ctx.lineTo(-swordLen * 0.35, halfW * 0.8);
    ctx.lineTo(-swordLen * 0.35, -halfW * 0.8);
    ctx.lineTo(swordLen * 0.1, -halfW);
    ctx.closePath();
    ctx.fill();

    // 劍脊鋒芒
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(swordLen * 0.5, 0);
    ctx.lineTo(-swordLen * 0.35, 0);
    ctx.stroke();

    // 劍格與寶石
    ctx.fillStyle = isSlow ? '#0284c7' : '#38bdf8';
    ctx.fillRect(-swordLen * 0.4, -halfW * 1.3, swordLen * 0.1, halfW * 2.6);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-swordLen * 0.35, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 劍柄
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-swordLen * 0.55, -halfW * 0.4, swordLen * 0.18, halfW * 0.8);

    // 緩速仙劍額外寒霜符紋環
    if (isSlow) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(0, 0, swordLen * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  } else if (proj.type === 'jianxian_sword_qi') {
    // --- 劍仙 (Jianxian) 被動三: 百萬劍陣 飛射劍氣 ---
    const angle = Math.atan2(proj.vy, proj.vx);

    if (proj.trail && proj.trail.length > 0) {
      ctx.save();
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        ctx.fillStyle = `rgba(224, 242, 254, ${pt.alpha * 0.4 * (1 - prog)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (proj.radius || 4) * (1 - prog), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const qiLen = proj.length || 16;
    const qiW = proj.width || 4;

    // 梭形銳利劍氣月牙
    const qiGrad = ctx.createLinearGradient(-qiLen * 0.5, 0, qiLen * 0.5, 0);
    qiGrad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    qiGrad.addColorStop(0.5, '#ffffff');
    qiGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = qiGrad;

    ctx.beginPath();
    ctx.moveTo(qiLen * 0.5, 0);
    ctx.quadraticCurveTo(0, qiW * 0.8, -qiLen * 0.5, 0);
    ctx.quadraticCurveTo(0, -qiW * 0.8, qiLen * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    // 核心亮線
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-qiLen * 0.4, 0);
    ctx.lineTo(qiLen * 0.5, 0);
    ctx.stroke();
  } else if (proj.type === 'spider_web_net') {
    // --- 蜘蛛 (Zhizhu) 飛射獵網 (Spider Silk Net Projectile) ---
    const netR = proj.radius || 10;
    const spinAngle = time * 7;

    // 飛行蛛絲微粒軌跡
    if (proj.trail && proj.trail.length > 0) {
      ctx.save();
      for (let i = 0; i < proj.trail.length; i++) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha * 0.35 * (1 - prog)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, netR * 0.4 * (1 - prog), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.translate(proj.x, proj.y);
    ctx.rotate(spinAngle);

    // 放射狀蛛絲骨架
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 6;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * netR, Math.sin(a) * netR);
      ctx.stroke();
    }

    // 雙層同心網
    for (let ring = 1; ring <= 2; ring++) {
      const r = netR * (ring / 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 結點綠色毒露
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * netR, Math.sin(a) * netR, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (proj.type === 'xin_sword_strike') {
    // --- 辛 (Xin) 被動一: 魔劍普攻 雙相月牙劍氣 (High-Definition Arcane Blade Wave) ---
    const angle = Math.atan2(proj.vy, proj.vx);
    const form = proj.extraData?.form || 'balance';

    // 1. 流暢漸變光翼拖尾 (Fluid Luminous Ribbon Trail)
    if (proj.trail && proj.trail.length >= 2) {
      ctx.save();
      for (let i = 0; i < proj.trail.length - 1; i++) {
        const p0 = proj.trail[i];
        const p1 = proj.trail[i + 1];
        const segAlpha = Math.min(p0.alpha, p1.alpha) * 0.75;
        if (segAlpha <= 0.02) continue;

        const progress = i / proj.trail.length;
        const trailGrad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        if (form === 'light') {
          trailGrad.addColorStop(0, `rgba(254, 240, 138, ${segAlpha.toFixed(3)})`);
          trailGrad.addColorStop(0.5, `rgba(251, 191, 36, ${(segAlpha * 0.55).toFixed(3)})`);
          trailGrad.addColorStop(1, `rgba(245, 158, 11, ${(segAlpha * 0.1).toFixed(3)})`);
        } else if (form === 'dark') {
          trailGrad.addColorStop(0, `rgba(233, 213, 255, ${segAlpha.toFixed(3)})`);
          trailGrad.addColorStop(0.5, `rgba(192, 132, 252, ${(segAlpha * 0.6).toFixed(3)})`);
          trailGrad.addColorStop(1, `rgba(88, 28, 135, ${(segAlpha * 0.1).toFixed(3)})`);
        } else {
          trailGrad.addColorStop(0, `rgba(255, 255, 255, ${segAlpha.toFixed(3)})`);
          trailGrad.addColorStop(0.5, `rgba(251, 191, 36, ${(segAlpha * 0.45).toFixed(3)})`);
          trailGrad.addColorStop(1, `rgba(168, 85, 247, ${(segAlpha * 0.1).toFixed(3)})`);
        }

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = Math.max(1.0, (proj.radius || 9) * 1.6 * (1 - progress * 0.7));
        ctx.stroke();
      }

      // 拖尾光芒星屑
      for (let i = 0; i < proj.trail.length; i += 2) {
        const pt = proj.trail[i];
        const prog = i / proj.trail.length;
        ctx.fillStyle = form === 'light' ? 'rgba(254, 240, 138, 0.7)' : (form === 'dark' ? 'rgba(216, 180, 254, 0.7)' : 'rgba(255, 255, 255, 0.75)');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.6, 2.2 * (1 - prog)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const waveR = (proj.radius || 9) * 1.3;
    const waveW = waveR * 2.8;
    const waveH = waveR * 1.5;

    // 光暈設定
    ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#c084fc' : '#38bdf8';
    ctx.shadowBlur = 15;

    // 2. 音速前鋒超薄激波 (Supersonic Bow Wave Arc)
    ctx.strokeStyle = form === 'light' ? 'rgba(254, 240, 138, 0.6)' : (form === 'dark' ? 'rgba(233, 213, 255, 0.65)' : 'rgba(255, 255, 255, 0.65)');
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(waveW * 0.15, 0, waveH * 1.15, -Math.PI * 0.46, Math.PI * 0.46);
    ctx.stroke();

    // 3. 雙向後掠月牙主劍氣 (Swept-Back Crescent Blade Wave)
    const bladeGrad = ctx.createLinearGradient(-waveW * 0.6, 0, waveW * 0.7, 0);
    if (form === 'light') {
      bladeGrad.addColorStop(0, 'rgba(245, 158, 11, 0.1)');
      bladeGrad.addColorStop(0.3, '#f59e0b');
      bladeGrad.addColorStop(0.7, '#fef08a');
      bladeGrad.addColorStop(1, '#ffffff');
    } else if (form === 'dark') {
      bladeGrad.addColorStop(0, 'rgba(59, 7, 100, 0.1)');
      bladeGrad.addColorStop(0.3, '#9333ea');
      bladeGrad.addColorStop(0.7, '#c084fc');
      bladeGrad.addColorStop(1, '#ffffff');
    } else {
      bladeGrad.addColorStop(0, 'rgba(148, 163, 184, 0.1)');
      bladeGrad.addColorStop(0.35, '#a855f7');
      bladeGrad.addColorStop(0.7, '#fef08a');
      bladeGrad.addColorStop(1, '#ffffff');
    }

    ctx.fillStyle = bladeGrad;
    ctx.beginPath();
    // 劍尖正前端
    ctx.moveTo(waveW * 0.62, 0);
    // 上翼尖後掠曲線
    ctx.bezierCurveTo(waveW * 0.35, waveH * 0.6, 0, waveH * 1.15, -waveW * 0.5, waveH * 0.9);
    // 上翼內緣凹弧
    ctx.bezierCurveTo(-waveW * 0.15, waveH * 0.45, 0, 0, -waveW * 0.15, 0);
    // 下翼內緣凹弧
    ctx.bezierCurveTo(0, 0, -waveW * 0.15, -waveH * 0.45, -waveW * 0.5, -waveH * 0.9);
    // 下翼尖後掠曲線回前端
    ctx.bezierCurveTo(0, -waveH * 1.15, waveW * 0.35, -waveH * 0.6, waveW * 0.62, 0);
    ctx.closePath();
    ctx.fill();

    // 4. 內層純白鋒芒核心脊骨 (Incandescent Cutting Spine)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-waveW * 0.25, 0);
    ctx.lineTo(waveW * 0.64, 0);
    ctx.stroke();

    // 劍尖高亮星芒微晶鑽 (Cutting Tip Specular Star)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(waveW * 0.6, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. 兩側後掠能量氣流微鬚 (Trailing Energy Barb Wisps)
    ctx.strokeStyle = form === 'light' ? 'rgba(254, 240, 138, 0.7)' : (form === 'dark' ? 'rgba(216, 180, 254, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-waveW * 0.5, waveH * 0.9);
    ctx.lineTo(-waveW * 0.72, waveH * 1.1);
    ctx.moveTo(-waveW * 0.5, -waveH * 0.9);
    ctx.lineTo(-waveW * 0.72, -waveH * 1.1);
    ctx.stroke();

    ctx.restore();
  } else if (proj.type === 'xin_sky_cleave') {
    // --- 辛 (Xin) 被動三: 裂空劍痕 終極空間撕裂巨刃 (Cataclysmic Spatial Cleave) ---
    const angle = Math.atan2(proj.vy, proj.vx);
    const form = proj.extraData?.form || 'balance';

    // 1. 空間撕裂軌跡殘痕 (Dimensional Fracture Trail Wake)
    if (proj.trail && proj.trail.length > 0) {
      ctx.save();
      // 空間裂痕流帶
      for (let i = 0; i < proj.trail.length - 1; i++) {
        const pt0 = proj.trail[i];
        const pt1 = proj.trail[i + 1];
        const prog = i / proj.trail.length;
        const alpha = Math.min(pt0.alpha, pt1.alpha) * (0.8 - prog * 0.4);
        if (alpha <= 0.02) continue;

        const riftGrad = ctx.createLinearGradient(pt0.x, pt0.y, pt1.x, pt1.y);
        if (form === 'light') {
          riftGrad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
          riftGrad.addColorStop(1, `rgba(245, 158, 11, ${alpha * 0.2})`);
        } else if (form === 'dark') {
          riftGrad.addColorStop(0, `rgba(216, 180, 254, ${alpha})`);
          riftGrad.addColorStop(1, `rgba(147, 51, 234, ${alpha * 0.2})`);
        } else {
          riftGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          riftGrad.addColorStop(1, `rgba(168, 85, 247, ${alpha * 0.2})`);
        }

        ctx.strokeStyle = riftGrad;
        ctx.lineWidth = Math.max(1.2, 14 * (1 - prog * 0.75));
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();

        // 空間鋸齒裂紋閃電細線
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(pt0.x, pt0.y);
          const midX = (pt0.x + pt1.x) * 0.5 + (Math.sin(i * 3) * 6);
          const midY = (pt0.y + pt1.y) * 0.5 + (Math.cos(i * 3) * 6);
          ctx.lineTo(midX, midY);
          ctx.lineTo(pt1.x, pt1.y);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const cleaveLen = proj.length || 54;
    const cleaveW = proj.width || 24;

    ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#c084fc' : '#38bdf8';
    ctx.shadowBlur = 22;

    // 2. 空間撕裂外層衝擊激波 (Outer Cataclysmic Sonic Shockwave)
    ctx.strokeStyle = form === 'light' ? 'rgba(254, 240, 138, 0.75)' : (form === 'dark' ? 'rgba(216, 180, 254, 0.75)' : 'rgba(255, 255, 255, 0.75)');
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cleaveLen * 0.62, 0);
    ctx.lineTo(cleaveLen * 0.15, cleaveW * 0.72);
    ctx.lineTo(-cleaveLen * 0.45, cleaveW * 0.48);
    ctx.lineTo(-cleaveLen * 0.25, 0);
    ctx.lineTo(-cleaveLen * 0.45, -cleaveW * 0.48);
    ctx.lineTo(cleaveLen * 0.15, -cleaveW * 0.72);
    ctx.closePath();
    ctx.stroke();

    // 3. 裂空巨大雙相劍身主體 (Multi-Segment Spatial Cleave Body)
    const cleaveGrad = ctx.createLinearGradient(-cleaveLen * 0.5, 0, cleaveLen * 0.6, 0);
    if (form === 'light') {
      cleaveGrad.addColorStop(0, 'rgba(180, 83, 9, 0.2)');
      cleaveGrad.addColorStop(0.3, '#f59e0b');
      cleaveGrad.addColorStop(0.7, '#fef08a');
      cleaveGrad.addColorStop(1, '#ffffff');
    } else if (form === 'dark') {
      cleaveGrad.addColorStop(0, 'rgba(46, 16, 101, 0.2)');
      cleaveGrad.addColorStop(0.3, '#7e22ce');
      cleaveGrad.addColorStop(0.7, '#d8b4fe');
      cleaveGrad.addColorStop(1, '#ffffff');
    } else {
      cleaveGrad.addColorStop(0, '#7c3aed');
      cleaveGrad.addColorStop(0.35, '#f59e0b');
      cleaveGrad.addColorStop(0.7, '#fde047');
      cleaveGrad.addColorStop(1, '#ffffff');
    }

    ctx.fillStyle = cleaveGrad;
    ctx.beginPath();
    ctx.moveTo(cleaveLen * 0.58, 0); // 裂空最前尖刃
    ctx.lineTo(cleaveLen * 0.18, cleaveW * 0.52); // 右前翼刃
    ctx.lineTo(cleaveLen * 0.08, cleaveW * 0.38); // 翼刃收折凹槽
    ctx.lineTo(-cleaveLen * 0.48, cleaveW * 0.36); // 後掠副刃
    ctx.lineTo(-cleaveLen * 0.28, 0); // 劍底凹槽
    ctx.lineTo(-cleaveLen * 0.48, -cleaveW * 0.36);
    ctx.lineTo(cleaveLen * 0.08, -cleaveW * 0.38);
    ctx.lineTo(cleaveLen * 0.18, -cleaveW * 0.52);
    ctx.closePath();
    ctx.fill();

    // 4. 中央空間破碎裂隙 (Central Jagged Spatial Rift Fissure)
    ctx.fillStyle = form === 'dark' ? '#0f172a' : '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(cleaveLen * 0.42, 0);
    ctx.lineTo(cleaveLen * 0.1, cleaveW * 0.18);
    ctx.lineTo(-cleaveLen * 0.22, cleaveW * 0.12);
    ctx.lineTo(-cleaveLen * 0.34, 0);
    ctx.lineTo(-cleaveLen * 0.22, -cleaveW * 0.12);
    ctx.lineTo(cleaveLen * 0.1, -cleaveW * 0.18);
    ctx.closePath();
    ctx.fill();

    // 5. 貫穿空間裂紋雷光線 (Spatial Lightning Core)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-cleaveLen * 0.42, 0);
    ctx.lineTo(cleaveLen * 0.6, 0);
    ctx.stroke();

    // 裂空側翼撕裂光刺
    ctx.strokeStyle = form === 'light' ? '#fde047' : (form === 'dark' ? '#f472b6' : '#93c5fd');
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cleaveLen * 0.15, cleaveW * 0.5);
    ctx.lineTo(cleaveLen * 0.05, cleaveW * 0.7);
    ctx.moveTo(cleaveLen * 0.15, -cleaveW * 0.5);
    ctx.lineTo(cleaveLen * 0.05, -cleaveW * 0.7);
    ctx.stroke();

    ctx.restore();
  } else if (proj.type === 'junko_bandage_arrow') {
    // --- 曼麥亞・軍子: 神箭・白縛疾嵐 (Sacred Bandage Gale Arrow) ---
    const angle = Math.atan2(proj.vy, proj.vx);

    // 1. 神聖白繃帶流光殘影軌跡
    if (proj.trail && proj.trail.length > 0) {
      ctx.save();
      for (let i = 0; i < proj.trail.length - 1; i++) {
        const pt0 = proj.trail[i];
        const pt1 = proj.trail[i + 1];
        const prog = i / proj.trail.length;
        const alpha = Math.min(pt0.alpha, pt1.alpha) * (0.8 - prog * 0.4);
        if (alpha <= 0.02) continue;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = Math.max(1.5, 6 * (1 - prog * 0.6));
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();

        // 金紅龍瞳微粒
        if (i % 2 === 0) {
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt0.x, pt0.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 2. 箭矢本體 (白金符文螺旋神箭)
    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    const arrowLen = proj.width || 28;
    const arrowH = proj.height || 8;

    // 箭頭光暈
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;

    // 螺旋白繃帶箭桿
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-arrowLen * 0.5, 0);
    ctx.lineTo(arrowLen * 0.4, 0);
    ctx.stroke();

    // 箭頭：白金破風箭鏃
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(arrowLen * 0.55, 0);
    ctx.lineTo(arrowLen * 0.15, -arrowH * 0.55);
    ctx.lineTo(arrowLen * 0.22, 0);
    ctx.lineTo(arrowLen * 0.15, arrowH * 0.55);
    ctx.closePath();
    ctx.fill();

    // 箭羽神聖飄帶
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.4;
    const trailSway = Math.sin(time * 20) * 3;
    ctx.beginPath();
    ctx.moveTo(-arrowLen * 0.4, 0);
    ctx.quadraticCurveTo(-arrowLen * 0.6, -3, -arrowLen * 0.75, trailSway - 4);
    ctx.moveTo(-arrowLen * 0.4, 0);
    ctx.quadraticCurveTo(-arrowLen * 0.6, 3, -arrowLen * 0.75, -trailSway + 4);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * 凡 (Fan) 專屬箭矢視覺特效:
 * - 金銀色流光軌跡束與粒子殘影 (清晰平滑且不遮擋戰場內容)
 * - 銳利金黃破空箭頭、純白穿甲針芯與銀白平衡雙尾羽
 * - 前向極細微光導向針，增強動態辨識度
 */
export function drawFanArrowVisuals(ctx: CanvasRenderingContext2D, proj: Projectile, time: number) {
  // 1. 繪製流暢優雅的飛行軌跡流光帶 (Sleek Gradient Ribbon Trail - 清晰且不遮擋戰場)
  if (proj.trail && proj.trail.length >= 2) {
    ctx.save();
    for (let i = 0; i < proj.trail.length - 1; i++) {
      const p0 = proj.trail[i];
      const p1 = proj.trail[i + 1];
      const segAlpha = Math.min(p0.alpha, p1.alpha) * 0.65;
      if (segAlpha <= 0.02) continue;

      const progress = i / proj.trail.length;
      const trailGrad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
      if (i % 2 === 0) {
        trailGrad.addColorStop(0, `rgba(250, 204, 21, ${segAlpha.toFixed(3)})`);
        trailGrad.addColorStop(1, `rgba(254, 240, 138, ${(segAlpha * 0.35).toFixed(3)})`);
      } else {
        trailGrad.addColorStop(0, `rgba(255, 255, 255, ${segAlpha.toFixed(3)})`);
        trailGrad.addColorStop(1, `rgba(226, 232, 240, ${(segAlpha * 0.35).toFixed(3)})`);
      }

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.strokeStyle = trailGrad;
      // 寬度漸層平滑收細：頭部 2.8px -> 尾部 0.6px，絕不遮蔽小球與傷害文字
      ctx.lineWidth = Math.max(0.6, 2.8 * (1 - progress * 0.78));
      ctx.stroke();
    }

    // 沿軌跡節點的金銀微星微粒 (Gold & Silver Micro Diamonds)
    for (let i = 0; i < proj.trail.length; i++) {
      const pt = proj.trail[i];
      const progress = i / proj.trail.length;
      const nodeAlpha = pt.alpha * (0.6 - progress * 0.35);
      if (nodeAlpha <= 0.04) continue;

      ctx.save();
      ctx.globalAlpha = nodeAlpha;
      const isGold = i % 2 === 0;
      ctx.fillStyle = isGold ? '#facc15' : '#ffffff';
      ctx.shadowColor = isGold ? '#facc15' : '#ffffff';
      ctx.shadowBlur = 5;
      const sparkSize = Math.max(0.8, 2.2 * (1 - progress * 0.65));

      ctx.translate(pt.x, pt.y);
      ctx.beginPath();
      ctx.moveTo(0, -sparkSize);
      ctx.lineTo(sparkSize * 0.6, 0);
      ctx.lineTo(0, sparkSize);
      ctx.lineTo(-sparkSize * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // 2. 凡專屬破空實體箭矢 (Sleek Golden-Silver Piercing Arrow)
  ctx.save();
  const angle = Math.atan2(proj.vy, proj.vx);
  ctx.translate(proj.x, proj.y);
  ctx.rotate(angle);

  const len = 30;
  const h = 6.5;

  // 前向極細微光導向針 (前方 8px 極細半透明白光，指示飛行方向且不擋視線)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(len / 2 + 5, 0);
  ctx.lineTo(len / 2 + 13, 0);
  ctx.stroke();

  // 金銀光暈柔和散發
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 12;

  // 金銀雙色漸層箭桿 (Silver-White & Gold Arrow Shaft)
  const shaftGrad = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
  shaftGrad.addColorStop(0, 'rgba(248, 250, 252, 0.2)');
  shaftGrad.addColorStop(0.35, '#cbd5e1');
  shaftGrad.addColorStop(0.7, '#fef08a');
  shaftGrad.addColorStop(1, '#facc15');

  ctx.fillStyle = shaftGrad;
  ctx.beginPath();
  ctx.moveTo(-len / 2, -1.0);
  ctx.lineTo(len / 4, -1.3);
  ctx.lineTo(len / 4, 1.3);
  ctx.lineTo(-len / 2, 1.0);
  ctx.closePath();
  ctx.fill();

  // 銳利空氣動力金黃箭頭 (Aerodynamic Golden Arrowhead)
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(len / 4, -h / 2);
  ctx.lineTo(len / 2 + 5, 0);
  ctx.lineTo(len / 4, h / 2);
  ctx.lineTo(len / 4 + 1.8, 0);
  ctx.closePath();
  ctx.fill();

  // 純白能量穿甲針芯 (Pure White Needle Core)
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(-len / 4, -0.7);
  ctx.lineTo(len / 2 + 2, 0);
  ctx.lineTo(-len / 4, 0.7);
  ctx.closePath();
  ctx.fill();

  // 雙側傾斜尾翼 (Dual Angled Stabilizer Feathers)
  ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.lineTo(-len / 2 - 3.5, -h * 0.45);
  ctx.lineTo(-len / 2 + 2.5, 0);
  ctx.lineTo(-len / 2 - 3.5, h * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * 凡 (Fan) 專屬射程範圍圈 (Attack Range Indicator - 300px / 318px):
 * - 高辨識度戰術射程環，透明內圈漸層（不遮擋戰場與小球戰鬥）
 * - 雙色（金黃／銀白）戰術刻度與四方準星錨點
 * - 目標進入射程時啟動動態鎖定脈衝與方位瞄準標記
 * - 翻滾提升射程至 318px (+6%) 時顯示進階擴展環與數值提示
 * - 超速強化 (Overclock) 期間帶有電芒金光流轉特效
 */
export function drawFanAttackRangeCircle(
  ctx: CanvasRenderingContext2D,
  fanX: number,
  fanY: number,
  time: number = performance.now() * 0.001,
  rangeRadius: number = 300,
  isBoosted: boolean = false,
  isOverclock: boolean = false,
  hasTargetInRange: boolean = false,
  targetX?: number,
  targetY?: number
) {
  ctx.save();

  // 1. 內圈超微量環境漸層 (僅在邊緣 75%~100% 處產生極淡霧光，中心完全通透不遮視線)
  const floorGrad = ctx.createRadialGradient(
    fanX,
    fanY,
    rangeRadius * 0.7,
    fanX,
    fanY,
    rangeRadius
  );
  if (hasTargetInRange) {
    floorGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
    floorGrad.addColorStop(0.85, 'rgba(250, 204, 21, 0.035)');
    floorGrad.addColorStop(1, 'rgba(254, 240, 138, 0.07)');
  } else {
    floorGrad.addColorStop(0, 'rgba(248, 250, 252, 0)');
    floorGrad.addColorStop(0.85, 'rgba(203, 213, 225, 0.018)');
    floorGrad.addColorStop(1, 'rgba(250, 204, 21, 0.04)');
  }
  ctx.fillStyle = floorGrad;
  ctx.beginPath();
  ctx.arc(fanX, fanY, rangeRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. 若翻滾後啟動 318px 射程提升 (+6%)，在內側繪製一圈虛線幽靈原射程環 (300px)，凸顯擴增範圍
  if (isBoosted && rangeRadius > 305) {
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(fanX, fanY, 300, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 3. 戰術主刻度圓環 (Fine Tactical Perimeter)
  ctx.save();
  const rotationOffset = time * (isOverclock ? 0.25 : 0.12);

  // 邊緣光暈設定
  ctx.shadowColor = isOverclock ? '#facc15' : hasTargetInRange ? '#fde047' : '#e2e8f0';
  ctx.shadowBlur = hasTargetInRange ? 9 : 4;

  // 主環線 (微細雙色刻度：平滑虛線弧)
  const baseAlpha = hasTargetInRange ? 0.65 : 0.35;
  const strokeColor = isOverclock
    ? `rgba(250, 204, 21, ${baseAlpha.toFixed(2)})`
    : isBoosted
    ? `rgba(254, 240, 138, ${baseAlpha.toFixed(2)})`
    : `rgba(226, 232, 240, ${baseAlpha.toFixed(2)})`;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = isOverclock ? 1.8 : 1.3;
  // 戰術虛線間隔
  ctx.setLineDash([14, 8, 4, 8]);
  ctx.lineDashOffset = -rotationOffset * 50;
  ctx.beginPath();
  ctx.arc(fanX, fanY, rangeRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. 戰術十字與八方位狙擊瞄準刻度 (8-Directional Tactical Reticle Ticks)
  ctx.save();
  const tickAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  for (let i = 0; i < tickAngles.length; i++) {
    const deg = tickAngles[i];
    const rad = (deg * Math.PI) / 180;
    const isCardinal = deg % 90 === 0;
    const tickLen = isCardinal ? 7 : 4;
    const innerR = rangeRadius - (isCardinal ? 4 : 2);
    const outerR = innerR + tickLen;

    const x1 = fanX + Math.cos(rad) * innerR;
    const y1 = fanY + Math.sin(rad) * innerR;
    const x2 = fanX + Math.cos(rad) * outerR;
    const y2 = fanY + Math.sin(rad) * outerR;

    ctx.strokeStyle = isCardinal
      ? (hasTargetInRange ? '#facc15' : '#ffffff')
      : 'rgba(226, 232, 240, 0.4)';
    ctx.lineWidth = isCardinal ? 1.5 : 1.0;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 四方正位點綴微型戰術圓點
    if (isCardinal) {
      const notchR = outerR + 2.5;
      const nx = fanX + Math.cos(rad) * notchR;
      const ny = fanY + Math.sin(rad) * notchR;
      ctx.fillStyle = hasTargetInRange ? '#facc15' : 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 5. 目標方位瞄準指示針 (Target Azimuth Tracker)
  if (hasTargetInRange && targetX !== undefined && targetY !== undefined) {
    const angleToTarget = Math.atan2(targetY - fanY, targetX - fanX);
    const pointerR = rangeRadius;
    const px = fanX + Math.cos(angleToTarget) * pointerR;
    const py = fanY + Math.sin(angleToTarget) * pointerR;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angleToTarget);

    // 瞄準鎖定金色菱形指針
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-3, -3);
    ctx.lineTo(-1, 0);
    ctx.lineTo(-3, 3);
    ctx.closePath();
    ctx.fill();

    // 指向目標的極淡引導短虛線 (從指針向外延伸 16px)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();

    ctx.restore();
  }

  // 6. 頂部射程 HUD 微標籤 (Top Sleek Tactical Range Badge with Custom Vector Reticle Art)
  ctx.save();
  const labelY = fanY - rangeRadius - 7;
  const labelText = isBoosted ? '318px (+6%)' : '300px';
  ctx.font = 'bold 9px ui-sans-serif, system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(labelText).width;
  const iconSpace = 12; // 自定義向量十字準星空間
  const pillPaddingX = 6;
  const pillHeight = 14;
  const pillWidth = textWidth + iconSpace + pillPaddingX * 2;
  const pillX = fanX - pillWidth / 2;
  const pillTop = labelY - pillHeight / 2;

  // 膠囊底色 (深色半透明玻璃)
  ctx.fillStyle = hasTargetInRange ? 'rgba(15, 23, 42, 0.82)' : 'rgba(15, 23, 42, 0.65)';
  ctx.strokeStyle = hasTargetInRange
    ? 'rgba(250, 204, 21, 0.6)'
    : isBoosted
    ? 'rgba(254, 240, 138, 0.45)'
    : 'rgba(226, 232, 240, 0.25)';
  ctx.lineWidth = 1.0;

  ctx.beginPath();
  const r = 4;
  ctx.moveTo(pillX + r, pillTop);
  ctx.lineTo(pillX + pillWidth - r, pillTop);
  ctx.quadraticCurveTo(pillX + pillWidth, pillTop, pillX + pillWidth, pillTop + r);
  ctx.lineTo(pillX + pillWidth, pillTop + pillHeight - r);
  ctx.quadraticCurveTo(pillX + pillWidth, pillTop + pillHeight, pillX + pillWidth - r, pillTop + pillHeight);
  ctx.lineTo(pillX + r, pillTop + pillHeight);
  ctx.quadraticCurveTo(pillX, pillTop + pillHeight, pillX, pillTop + pillHeight - r);
  ctx.lineTo(pillX, pillTop + r);
  ctx.quadraticCurveTo(pillX, pillTop, pillX + r, pillTop);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 自定義向量十字準星美術圖示 (Custom Vector Crosshair Art - No Emojis)
  const iconCenterX = pillX + pillPaddingX + 4;
  const iconCenterY = labelY;
  ctx.strokeStyle = hasTargetInRange ? '#facc15' : isBoosted ? '#fef08a' : '#cbd5e1';
  ctx.lineWidth = 1.0;
  // 小圓環
  ctx.beginPath();
  ctx.arc(iconCenterX, iconCenterY, 3, 0, Math.PI * 2);
  ctx.stroke();
  // 十字線
  ctx.beginPath();
  ctx.moveTo(iconCenterX - 4.5, iconCenterY);
  ctx.lineTo(iconCenterX - 1.5, iconCenterY);
  ctx.moveTo(iconCenterX + 1.5, iconCenterY);
  ctx.lineTo(iconCenterX + 4.5, iconCenterY);
  ctx.moveTo(iconCenterX, iconCenterY - 4.5);
  ctx.lineTo(iconCenterX, iconCenterY - 1.5);
  ctx.moveTo(iconCenterX, iconCenterY + 1.5);
  ctx.lineTo(iconCenterX, iconCenterY + 4.5);
  ctx.stroke();

  // 文字內容
  ctx.fillStyle = hasTargetInRange ? '#facc15' : isBoosted ? '#fef08a' : '#f8fafc';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, iconCenterX + 6, labelY);

  ctx.restore();

  ctx.restore();
}

/**
 * Ultra-fast sparkling diamond 4-pointed star
 * Renders without shadowBlur for buttery smooth 60 FPS performance
 */
function drawSparkleStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number = 0,
  innerRatio: number = 0.22
) {
  ctx.save();
  ctx.translate(x, y);
  if (angle !== 0) ctx.rotate(angle);
  const r = Math.max(0.6, radius);
  const inR = r * innerRatio;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, -inR, inR, 0);
  ctx.lineTo(r, 0);
  ctx.quadraticCurveTo(inR, 0, 0, inR);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, inR, -inR, 0);
  ctx.lineTo(-r, 0);
  ctx.quadraticCurveTo(-inR, 0, 0, -inR);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Render special skill particles (Gold Sparks, Fiery Flames, Magma Shards, Shockwaves, Arcane Sparks, Psionic Blue Sparks, Green Orbs)
 */
export function drawCustomParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha);

  if (p.type === 'fan_arrow_spark' || p.type === 'fan_overclock_spark') {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2.2);
    ctx.lineTo(r * 0.45, -r * 0.45);
    ctx.lineTo(r * 2.2, 0);
    ctx.lineTo(r * 0.45, r * 0.45);
    ctx.lineTo(0, r * 2.2);
    ctx.lineTo(-r * 0.45, r * 0.45);
    ctx.lineTo(-r * 2.2, 0);
    ctx.lineTo(-r * 0.45, -r * 0.45);
    ctx.closePath();
    ctx.fill();
  } else if (p.type === 'fan_arrow_afterimage') {
    // 箭矢金銀殘影 (Aerodynamic faint arrow phantom afterimage)
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.angle !== undefined) {
      ctx.rotate(p.angle);
    }
    ctx.strokeStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.3;
    const len = 18;
    const h = 5;
    // 殘影箭頭人字紋
    ctx.beginPath();
    ctx.moveTo(len / 2, 0);
    ctx.lineTo(-len / 4, -h / 2);
    ctx.moveTo(len / 2, 0);
    ctx.lineTo(-len / 4, h / 2);
    ctx.stroke();
    // 殘影箭軸線
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-len / 2, 0);
    ctx.lineTo(len / 4, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'fan_hit_stacked_ring') {
    // 命中敵人時的白色圓環層疊效果 (Stacked White Concentric Ripple Rings)
    const progress = Math.max(0, Math.min(1.0, 1 - p.life / p.maxLife));
    const startR = p.extraData?.startR ?? p.radius;
    const endR = p.extraData?.endR ?? (p.radius + 24);
    const currentR = startR + (endR - startR) * Math.sin((progress * Math.PI) / 2);
    const ringIdx = p.extraData?.ringIndex ?? 0;

    ctx.save();
    ctx.strokeStyle = p.color;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = Math.max(2, 10 - ringIdx * 2);
    // 纖細邊緣，不遮擋小球本體與血量資訊
    ctx.lineWidth = Math.max(0.8, (p.width ?? 1.8) * (1 - progress * 0.45));

    ctx.beginPath();
    ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
    ctx.stroke();

    // 在圓環四極點處帶有極微小的銀白菱形亮點，增加精緻層次感
    if (progress > 0.12 && progress < 0.82) {
      ctx.fillStyle = '#ffffff';
      const notchAlpha = Math.sin(progress * Math.PI) * 0.65;
      ctx.globalAlpha = Math.max(0, p.alpha * notchAlpha);
      for (let a = 0; a < 4; a++) {
        const ang = (a * Math.PI) / 2 + (ringIdx * Math.PI) / 4 + progress * 0.35;
        const nx = p.x + Math.cos(ang) * currentR;
        const ny = p.y + Math.sin(ang) * currentR;
        ctx.beginPath();
        ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  } else if (p.type === 'fan_hunter_mark_ring') {
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (0.8 + 0.2 * (1 - p.life / p.maxLife)), 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'fan_hunter_burst') {
    const progress = 1 - p.life / p.maxLife;
    const r = Math.max(2, p.radius * (1 - progress * 0.6));
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2.5 * (1 - progress);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'fan_roll_afterimage') {
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'gold_spark' || p.type === 'arcane_spark' || p.type === 'psionic_arrow_spark') {
    // Radiant 4-point Diamond Star Spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2);
    ctx.lineTo(r * 0.5, -r * 0.5);
    ctx.lineTo(r * 2, 0);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(0, r * 2);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.lineTo(-r * 2, 0);
    ctx.lineTo(-r * 0.5, -r * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (p.type === 'green_orb_spark') {
    // Emerald energy burst spark
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#86efac';
    ctx.shadowBlur = 10;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'spirit_dissolve') {
    // Soft glowing dissolving spirit particle
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (1 + (1 - p.life / p.maxLife) * 0.8), 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'flame' || p.type === 'fire_ember') {
    // Soft glowing radial flame plume
    const r = p.radius * (1 + (1 - p.life / p.maxLife) * 0.5);
    const flameGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.3, p.color);
    flameGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flameGrad;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'collision_streak') {
    // High-Velocity Dynamic Kinetic Collision Streak
    const angle = p.angle !== undefined ? p.angle : (Math.hypot(p.vx, p.vy) > 0.01 ? Math.atan2(p.vy, p.vx) : 0);
    const lifeRatio = Math.max(0, p.life / p.maxLife);
    const len = (p.length || 28) * (0.35 + 0.65 * lifeRatio);
    const w = Math.max(1.2, (p.width || 3.0) * lifeRatio);

    ctx.translate(p.x, p.y);
    ctx.rotate(angle);

    ctx.shadowColor = p.color;
    ctx.shadowBlur = Math.min(20, 6 + (p.length || 25) * 0.25);

    const streakGrad = ctx.createLinearGradient(0, 0, -len, 0);
    streakGrad.addColorStop(0, '#ffffff');
    streakGrad.addColorStop(0.2, p.color);
    streakGrad.addColorStop(0.7, p.trailColor || p.color);
    streakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = streakGrad;
    ctx.beginPath();
    ctx.moveTo(w * 0.6, 0);
    ctx.lineTo(0, -w * 0.5);
    ctx.lineTo(-len * 0.8, -w * 0.2);
    ctx.lineTo(-len, 0);
    ctx.lineTo(-len * 0.8, w * 0.2);
    ctx.lineTo(0, w * 0.5);
    ctx.closePath();
    ctx.fill();

    if (w >= 2.0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w * 0.4, 0);
      ctx.lineTo(0, -w * 0.2);
      ctx.lineTo(-len * 0.5, 0);
      ctx.lineTo(0, w * 0.2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (p.type === 'shockwave') {
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.3 + progress * 1.4);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = Math.max(1, 3.5 * (1 - progress));
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'energy_suction') {
    // Hailaise P1 Inward Purple Energy Suction
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'flame_jet') {
    // Huotong P1 Fiery Jet Blast Plume
    const r = p.radius * (1 + (1 - p.life / p.maxLife) * 0.8);
    const flameGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.3, '#fbbf24');
    flameGrad.addColorStop(0.7, '#f97316');
    flameGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = flameGrad;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'shield_barrier') {
    // Huotong P2 Protective Outer Halo & Absorb Wave
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (1 + progress * 0.5);
    ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, p.alpha)})`;
    ctx.lineWidth = Math.max(1, 3 * (1 - progress));
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'residual_fire') {
    // Huotong P3 Spinning Residual Combustion Flame
    const rot = (p.spin || 0) + (1 - p.life / p.maxLife) * 4;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(rot);
    const r = p.radius * (0.8 + 0.4 * Math.sin(p.life * 10));
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.4, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'summon_mandala') {
    // Lingyinsi P2 Summoning Mandala Circle
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.4 + progress * 0.6);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(progress * Math.PI);
    ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, p.alpha)})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, curR, 0, Math.PI * 2);
    ctx.stroke();
    // Inner diamond in mandala
    ctx.beginPath();
    ctx.moveTo(0, -curR * 0.7);
    ctx.lineTo(curR * 0.7, 0);
    ctx.lineTo(0, curR * 0.7);
    ctx.lineTo(-curR * 0.7, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'starburst') {
    // Hailaise P2 / P3 Purple Starburst upon beam/missile impact
    const r = p.radius;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.spin || 0) + (1 - p.life / p.maxLife) * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const len = i % 2 === 0 ? r * 2.2 : r * 0.9;
      if (i === 0) ctx.moveTo(Math.cos(a) * len, Math.sin(a) * len);
      else ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'kinetic_shard') {
    // Oba P1 / P3 High-velocity shattered physical fragments
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(r * 1.5, 0);
    ctx.lineTo(-r, -r * 0.6);
    ctx.lineTo(-r * 0.5, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'magma_shard' || p.type === 'magic_rune') {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'zen_bell_shield') {
    // Chanshi P2 Golden Bell Shield burst ripple
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.8 + progress * 0.6);
    ctx.strokeStyle = `rgba(253, 224, 71, ${Math.max(0, p.alpha || 1)})`;
    ctx.lineWidth = Math.max(1, 3.5 * (1 - progress));
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();

    // Bell dome contour shape in the shockwave
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + curR * 0.4, curR * 0.9, curR * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'zen_shockwave' || p.type === 'zen_pulse') {
    // Chanshi P1 / P2 Golden Shockwave Pulse
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.3 + progress * 1.5);
    ctx.strokeStyle = `rgba(250, 204, 21, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = Math.max(1, 3 * (1 - progress));
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'zen_aura_spark') {
    // Chanshi P1 Imprisoning Aura Floating Mote (Gold & Pale White)
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'zen_slow_ring') {
    // Chanshi P1 Enemy Slow Ripple
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.8 + progress * 0.4);
    ctx.strokeStyle = `rgba(234, 179, 8, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#ca8a04';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'zen_heal_spark') {
    // Chanshi P3 Golden Body Recovery Floating Spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'zen_heal_core') {
    // Chanshi P3 Golden Body Massive Heal Burst Core
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.5 + progress * 1.0);
    const healGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curR);
    healGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    healGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.7)');
    healGrad.addColorStop(0.8, 'rgba(234, 179, 8, 0.4)');
    healGrad.addColorStop(1, 'rgba(161, 98, 7, 0)');
    ctx.fillStyle = healGrad;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'huangzuan_bolt') {
    // Huangzuan P1 Jagged Targeted Lightning Bolt segment
    const startX = p.extraData?.startX ?? p.x;
    const startY = p.extraData?.startY ?? p.y;
    const endX = p.extraData?.endX ?? (p.targetX ?? p.x);
    const endY = p.extraData?.endY ?? (p.targetY ?? p.y);

    ctx.save();
    // Outer canary neon electric glow line
    ctx.strokeStyle = '#e8fc02';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#faff60';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Inner pure white core beam
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'huangzuan_arc') {
    // Huangzuan crackling electric spark arc
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#e8fc02';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'huangzuan_spark') {
    // High-speed spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#faff60';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'huangzuan_shockwave') {
    // Electric Ring Shockwave
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.3 + progress * 1.4);
    ctx.strokeStyle = `rgba(232, 252, 2, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = Math.max(1, 3.5 * (1 - progress));
    ctx.shadowColor = '#faff60';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'huangzuan_collapse') {
    // Inward rushing collapse spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'lanzuan_spark' || p.type === 'lanzuan_orb_spark') {
    // Radiant 4-point Blue Diamond Star Spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2);
    ctx.lineTo(r * 0.5, -r * 0.5);
    ctx.lineTo(r * 2, 0);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(0, r * 2);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.lineTo(-r * 2, 0);
    ctx.lineTo(-r * 0.5, -r * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (p.type === 'lanzuan_shard') {
    // Angular Diamond Shard Fragment
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || (p.life * 8));
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(r * 1.5, 0);
    ctx.lineTo(-r * 0.8, -r * 0.6);
    ctx.lineTo(-r * 0.3, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'lanzuan_emotion_ring') {
    // Floating Emotional Ring Mandala Spark
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'lanzuan_emotion_burst') {
    // Emotional Burst Shockwave Ring
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.3 + progress * 1.3);
    ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = Math.max(1, 3.5 * (1 - progress));
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'fenzuan_spark' || p.type === 'fenzuan_shield_trail') {
    // Radiant 4-point Rose Diamond Star Spark
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 8;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2);
    ctx.lineTo(r * 0.5, -r * 0.5);
    ctx.lineTo(r * 2, 0);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.lineTo(0, r * 2);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.lineTo(-r * 2, 0);
    ctx.lineTo(-r * 0.5, -r * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (p.type === 'fenzuan_spike_shard') {
    // Sharp Crystal Spike Shard
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || (p.life * 6));
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 8;
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(r * 1.8, 0);
    ctx.lineTo(-r * 0.7, -r * 0.5);
    ctx.lineTo(-r * 0.3, r * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'fenzuan_bubble' || p.type === 'fenzuan_bubble_pop') {
    // Soft transparent pink bubble particle with specular glint
    const progress = 1 - p.life / p.maxLife;
    const r = p.radius * (1 + progress * 0.4);
    ctx.strokeStyle = `rgba(244, 114, 182, ${Math.max(0, p.alpha || 1)})`;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Bubble inner pastel tint
    ctx.fillStyle = `rgba(251, 207, 232, ${Math.max(0, (p.alpha || 1) * 0.25)})`;
    ctx.fill();
  } else if (p.type === 'fenzuan_field_ring' || p.type === 'fenzuan_shield_ring') {
    // Pink Energy Ring Ripple
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.4 + progress * 1.2);
    ctx.strokeStyle = `rgba(244, 114, 182, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = Math.max(1, 3 * (1 - progress));
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'baizuan_crystal_spark' || p.type === 'baizuan_spark') {
    // 4-point pure white crystal diamond glint
    ctx.save();
    ctx.translate(p.x, p.y);
    const r = p.radius * (p.life / p.maxLife);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.3, -r * 0.3);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.3, r * 0.3);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.3, r * 0.3);
    ctx.lineTo(-r, 0);
    ctx.lineTo(-r * 0.3, -r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'baizuan_mirror_crack' || p.type === 'baizuan_clone_shard') {
    // Sharp shattered mirror crystal polygon facet
    ctx.save();
    ctx.translate(p.x, p.y);
    const progress = 1 - p.life / p.maxLife;
    const r = p.radius * (1 + progress * 0.3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.8, -r * 0.2);
    ctx.lineTo(r * 0.4, r);
    ctx.lineTo(-r * 0.6, r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'baizuan_shining_ring') {
    // Pure White Expanding Prism Ring
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.3 + progress * 1.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = Math.max(1, 2.5 * (1 - progress));
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.type === 'void_spark' || p.type === 'void_mark_sigil') {
    // Ethereal dark purple diamond spark with bright violet core
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;
    ctx.translate(p.x, p.y);
    const r = p.radius;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2);
    ctx.lineTo(r * 0.6, -r * 0.6);
    ctx.lineTo(r * 2, 0);
    ctx.lineTo(r * 0.6, r * 0.6);
    ctx.lineTo(0, r * 2);
    ctx.lineTo(-r * 0.6, r * 0.6);
    ctx.lineTo(-r * 2, 0);
    ctx.lineTo(-r * 0.6, -r * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'void_burst') {
    // Shocking violet void explosion particle
    const r = Math.max(0.5, p.radius * (1 + Math.max(0, 1 - p.life / p.maxLife) * 0.7));
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    grad.addColorStop(0, '#f3e8ff');
    grad.addColorStop(0.4, p.color);
    grad.addColorStop(1, 'rgba(88, 28, 135, 0)');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'void_rift_swirl') {
    // Spiral void particle
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#7e22ce';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'void_phantom_shadow') {
    // Dark phantom afterimage of sphere
    ctx.fillStyle = 'rgba(26, 10, 42, 0.45)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#581c87';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (p.type === 'devour_implosion') {
    // 吞噬黑紫色粒子流: 向球體中心急遽收縮的彗星流光與黑紫魔核
    ctx.save();
    const speed = Math.hypot(p.vx, p.vy);
    const angle = speed > 1 ? Math.atan2(p.vy, p.vx) : 0;
    const tailLen = Math.min(22, Math.max(6, speed * 0.07));

    ctx.translate(p.x, p.y);
    ctx.rotate(angle);

    // Stream tail (Black to deep purple to violet gradient)
    const tailGrad = ctx.createLinearGradient(-tailLen, 0, p.radius, 0);
    tailGrad.addColorStop(0, 'rgba(15, 2, 30, 0)');
    tailGrad.addColorStop(0.3, 'rgba(59, 7, 100, 0.7)');
    tailGrad.addColorStop(0.7, 'rgba(126, 34, 206, 0.85)');
    tailGrad.addColorStop(1, p.color);

    ctx.fillStyle = tailGrad;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(-tailLen, 0);
    ctx.lineTo(p.radius * 0.4, -p.radius * 0.6);
    ctx.lineTo(p.radius, 0);
    ctx.lineTo(p.radius * 0.4, p.radius * 0.6);
    ctx.closePath();
    ctx.fill();

    // Core black-purple demonic droplet
    ctx.fillStyle = '#0f021e';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1, p.radius * 0.7), 0, Math.PI * 2);
    ctx.fill();

    // Glowing violet spark center
    ctx.fillStyle = '#f3e8ff';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.6, p.radius * 0.35), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  } else if (p.type === 'gluttony_burst_shockwave') {
    // 暴食魔爆: 狂暴魔力雙重衝擊波環與8向魔能棘刺
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.15 + progress * 0.85);
    const alpha = Math.max(0, p.alpha || 1) * (1 - progress);

    ctx.save();
    // 1. Central dark-purple expanding void aura
    const craterGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curR);
    craterGrad.addColorStop(0, `rgba(59, 7, 100, ${alpha * 0.4})`);
    craterGrad.addColorStop(0.7, `rgba(126, 34, 206, ${alpha * 0.25})`);
    craterGrad.addColorStop(1, 'rgba(15, 2, 30, 0)');
    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Demonic Wave Ring
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.9})`;
    ctx.lineWidth = Math.max(1.6, 4.2 * (1 - progress));
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Inner Bright Core Ring
    ctx.strokeStyle = `rgba(250, 232, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1.0, 2.4 * (1 - progress));
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR * 0.82, 0, Math.PI * 2);
    ctx.stroke();

    // 4. 8-Spike Radial Demonic Blast Javelins
    const spikeLen = Math.max(4, 18 * (1 - progress));
    ctx.strokeStyle = `rgba(240, 171, 252, ${alpha * 0.95})`;
    ctx.lineWidth = 1.8;
    for (let s = 0; s < 8; s++) {
      const sAng = (s * Math.PI * 2) / 8 + progress * 0.5;
      const sx1 = p.x + Math.cos(sAng) * (curR - 2);
      const sy1 = p.y + Math.sin(sAng) * (curR - 2);
      const sx2 = p.x + Math.cos(sAng) * (curR + spikeLen);
      const sy2 = p.y + Math.sin(sAng) * (curR + spikeLen);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }
    ctx.restore();
  } else if (p.type === 'gluttony_burst_spark') {
    // 暴食魔爆殘留紫色魔能碎片 (旋轉菱形魔晶飛散與光尾)
    const progress = 1 - p.life / p.maxLife;
    const alpha = Math.max(0, p.alpha || 1) * (1 - progress * 0.8);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    const speed = Math.hypot(p.vx, p.vy);
    const ang = speed > 1 ? Math.atan2(p.vy, p.vx) : 0;
    ctx.rotate(ang);

    // Glowing Trail
    const tailLen = Math.min(22, Math.max(6, speed * 0.08));
    const tailGrad = ctx.createLinearGradient(-tailLen, 0, p.radius, 0);
    tailGrad.addColorStop(0, 'rgba(15, 2, 30, 0)');
    tailGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.6)');
    tailGrad.addColorStop(1, p.color);
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(-tailLen, 0);
    ctx.lineTo(p.radius * 0.4, -p.radius * 0.7);
    ctx.lineTo(p.radius * 1.2, 0);
    ctx.lineTo(p.radius * 0.4, p.radius * 0.7);
    ctx.closePath();
    ctx.fill();

    // Crystal Shard
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.8, p.radius * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'shard_pulse') {
    // 能量碎片周圍的微光脈衝環
    const progress = 1 - p.life / p.maxLife;
    const curR = p.radius * (0.5 + progress * 0.8);
    ctx.save();
    ctx.strokeStyle = `rgba(168, 85, 247, ${(p.alpha || 1) * (1 - progress)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_snip_cut') {
    // 剪刀攻擊切裂斬擊特效: 雙刃十字銀白裁斷切光與交會火花
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);

    const len = (p.length || 48) * (0.35 + progress * 0.65);
    const alpha = (p.alpha || 1) * (1 - progress);

    // 1. Dual scissor shear incisions (forming sharp crossed scissor cut)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
    ctx.lineWidth = 4.2 * (1 - progress * 0.5);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(-len * 0.52, -len * 0.28);
    ctx.lineTo(len * 0.52, len * 0.28);
    ctx.moveTo(-len * 0.52, len * 0.28);
    ctx.lineTo(len * 0.52, -len * 0.28);
    ctx.stroke();

    // 2. Sharp razor core line with golden edge bevel
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, -len * 0.27);
    ctx.lineTo(len * 0.5, len * 0.27);
    ctx.moveTo(-len * 0.5, len * 0.27);
    ctx.lineTo(len * 0.5, -len * 0.27);
    ctx.stroke();

    // 3. Central scissor shear vortex & lens diamond flare
    const diamondR = 5.5 * (1 - progress);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -diamondR);
    ctx.lineTo(diamondR * 0.6, 0);
    ctx.lineTo(0, diamondR);
    ctx.lineTo(-diamondR * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_scissor_slash_arc') {
    // 剪刀斬擊雙向對咬月牙圓弧刃芒 (Dual Opposing Crescent Slash Shockwaves)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);

    const arcR = (p.radius || 36) * (0.7 + progress * 0.5);
    const alpha = (p.alpha || 1) * (1 - progress);

    // Upper Blade Inward Crescent Arc
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
    ctx.lineWidth = 3.6 * (1 - progress * 0.6);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, arcR, -Math.PI * 0.42, 0.05);
    ctx.stroke();

    // Lower Blade Inward Crescent Arc (Mirrored Opposing Bite)
    ctx.beginPath();
    ctx.arc(0, 0, arcR, -0.05, Math.PI * 0.42);
    ctx.stroke();

    // Golden inner razor contour arcs
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.85})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, arcR - 2.5, -Math.PI * 0.38, 0.02);
    ctx.arc(0, 0, arcR - 2.5, -0.02, Math.PI * 0.38);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_cross_flash') {
    // 十字切裂瞬間爆光 (Expanding sharp cross ray flash at shear vertex)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle || 0) + progress * 0.1);
    const alpha = (p.alpha || 1) * (1 - progress);
    const sz = (p.radius || 24) * (0.5 + progress * 0.7);

    // Expanding cross rays
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 2.4 * (1 - progress * 0.5);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(-sz, 0);
    ctx.lineTo(sz, 0);
    ctx.moveTo(0, -sz * 0.7);
    ctx.lineTo(0, sz * 0.7);
    ctx.stroke();

    // Diagonal gold shear flashes
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-sz * 0.65, -sz * 0.4);
    ctx.lineTo(sz * 0.65, sz * 0.4);
    ctx.moveTo(-sz * 0.65, sz * 0.4);
    ctx.lineTo(sz * 0.65, -sz * 0.4);
    ctx.stroke();

    // Center core flash
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, sz * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_shear_spark') {
    // 金屬咬合高速摩擦火花 (High-velocity directional shear sparks)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    const ang = Math.atan2(p.vy, p.vx);
    ctx.rotate(ang);
    const len = (p.length || 10) * (1 - progress * 0.5);
    const alpha = (p.alpha || 1) * (1 - progress);

    ctx.strokeStyle = p.color || `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 1.8 * (1 - progress * 0.3);
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_blade_trail') {
    // 剪刃揮砍殘影弧光扇面 (Blade motion blur trail arc)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle || 0);
    const alpha = (p.alpha || 0.6) * (1 - progress);
    const r = (p.radius || 30);

    ctx.strokeStyle = `rgba(241, 245, 249, ${alpha})`;
    ctx.lineWidth = 3.0 * (1 - progress);
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, r, -0.4, 0.4);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_fate_thread') {
    // 命運剪裁絲線 (Severed glowing fate threads snapping and curling outward)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle || 0) + (p.spin || 0) * progress);
    const alpha = (p.alpha || 1) * (1 - progress);
    const len = (p.length || 20) * (1 - progress * 0.3);
    const curl = Math.sin(progress * Math.PI) * 8;

    ctx.strokeStyle = p.color || `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.quadraticCurveTo(0, curl, len * 0.5, 0);
    ctx.stroke();

    // Glint on severed end tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-len * 0.5, 0, 1.4, 0, Math.PI * 2);
    ctx.arc(len * 0.5, 0, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_scissor_mark') {
    // 剪刀命中符號 (Scissor Hit Symbol / Insignia stamped on enemy)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle || 0) + progress * 0.15);
    const scale = (1 - progress * 0.25);
    ctx.scale(scale, scale);

    const alpha = (p.alpha || 1) * (1 - progress);

    // 1. Radiant 4-pointed incision gleam (剪裁開裂十字光芒)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.75})`;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    const incisionLen = 22 * (0.6 + progress * 0.5);
    ctx.beginPath();
    ctx.moveTo(-incisionLen, 0);
    ctx.lineTo(incisionLen, 0);
    ctx.moveTo(0, -incisionLen);
    ctx.lineTo(0, incisionLen);
    ctx.stroke();

    // 2. Stylized Crossed Scissor Blades
    ctx.strokeStyle = `rgba(241, 245, 249, ${alpha})`;
    ctx.fillStyle = `rgba(203, 213, 225, ${alpha * 0.35})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#cbd5e1';
    ctx.shadowBlur = 6;

    // Crossed cutting blades
    ctx.beginPath();
    ctx.moveTo(-12, -14);
    ctx.lineTo(12, 14);
    ctx.moveTo(-12, 14);
    ctx.lineTo(12, -14);
    ctx.stroke();

    // Dual handle rings
    ctx.beginPath();
    ctx.arc(-14, -14, 3.5, 0, Math.PI * 2);
    ctx.arc(-14, 14, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Central Golden Pivot Rivet & Diamond Sparkle
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_needle_hit_symbol') {
    // 聖針命中符號 (4-Pointed Radiant Needle Piercing Cross Symbol)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle || 0) + progress * 0.2);
    const alpha = (p.alpha || 1) * (1 - progress);

    // 1. Expanding needle penetration shockwave ripple
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
    ctx.lineWidth = 1.6 * (1 - progress * 0.5);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 18 * progress + 4, 0, Math.PI * 2);
    ctx.stroke();

    // 2. 4-pointed radiant piercing needle starburst
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;

    const vLen = 20 * (1 - progress * 0.3); // vertical piercing needle spike
    const hLen = 8 * (1 - progress * 0.4);  // horizontal cross needle
    const w = 1.8;

    ctx.beginPath();
    // Vertical diamond needle
    ctx.moveTo(0, -vLen);
    ctx.lineTo(w, 0);
    ctx.lineTo(0, vLen);
    ctx.lineTo(-w, 0);
    ctx.closePath();
    ctx.fill();

    // Horizontal diamond bar
    ctx.beginPath();
    ctx.moveTo(-hLen, 0);
    ctx.lineTo(0, w);
    ctx.lineTo(hLen, 0);
    ctx.lineTo(0, -w);
    ctx.closePath();
    ctx.fill();

    // 3. Central golden needle eyelet flare
    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_needle_spark') {
    // 銀白色飛針碎芒粒子 (Sharp needle shard spray)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    const ang = Math.atan2(p.vy, p.vx);
    ctx.rotate(ang);

    const len = (p.length || 8) * (1 - progress * 0.4);
    const alpha = (p.alpha || 1) * (1 - progress);

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#e2e8f0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_slow_ring') {
    // 聖針減速光環 (Pale icy-cyan & silver-white deceleration shock ring)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress * 0.7);
    ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
    ctx.lineWidth = 2.2 * (1 - progress * 0.4);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    const curR = p.radius * (1 + progress * 0.3);
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();

    // Dotted inner frost ring
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.lineWidth = 1.0;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  } else if (p.type === 'jiandao_mist_wisp') {
    // 聖霧守護半透明白色霧氣團 (Soft billowing translucent white mist wisp)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 0.28) * (1 - progress);
    const curR = p.radius * (1 + progress * 0.45);

    const mistG = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, curR);
    mistG.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    mistG.addColorStop(0.5, `rgba(241, 245, 249, ${alpha * 0.65})`);
    mistG.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = mistG;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_halo_spark') {
    // 聖霧守護光環粒子 (Radiant drifting holy halo spark)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;

    // 4-pointed radiant star spark
    const sz = p.radius * (1 - progress * 0.4);
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.6, sz * 0.6), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.75})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(p.x - sz * 1.6, p.y);
    ctx.lineTo(p.x + sz * 1.6, p.y);
    ctx.moveTo(p.x, p.y - sz * 1.6);
    ctx.lineTo(p.x, p.y + sz * 1.6);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_mist_deflect_ring') {
    // 聖霧格擋衝擊波 (Holy mist deflection ripple ring)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 3.0 * (1 - progress * 0.5);
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 40) * (0.5 + progress * 0.8), 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 40) * (0.65 + progress * 0.8), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jiandao_holy_burst') {
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha || 1) * (1 - progress)})`;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.radius * (1 - progress * 0.6)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jiandao_heal_spark') {
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.fillStyle = `rgba(254, 240, 138, ${(p.alpha || 1) * (1 - progress)})`;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (1 - progress * 0.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_white_spark') {
    // 蒂納 - 白光閃爍星芒粒子 (閃爍 4 芒星 + 微星塵，零 shadowBlur 高效能)
    const progress = 1 - p.life / p.maxLife;
    const twinkle = 0.70 + 0.30 * Math.sin(p.life * 32 + (p.angle || 0));
    const alpha = Math.max(0, Math.min(1, (p.alpha || 1) * (1 - progress) * twinkle));
    const r = Math.max(0.6, (p.radius || 2.2) * (1 - progress * 0.45));
    const rot = (p.angle || 0) + (p.spin || 4) * progress;

    ctx.save();
    // 柔和光暈外圈
    ctx.fillStyle = `rgba(224, 231, 255, ${alpha * 0.35})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 四芒星閃爍核心
    ctx.fillStyle = p.color || '#ffffff';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, r, rot, 0.22);

    // 亮白極小星核
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.4, r * 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_dark_spark') {
    // 蒂納 - 暗光暗紫虛空閃爍粒子 (暗影 4 芒星 + 深淵暗暈，零 shadowBlur 高效能)
    const progress = 1 - p.life / p.maxLife;
    const twinkle = 0.65 + 0.35 * Math.sin(p.life * 28 + (p.angle || 0));
    const alpha = Math.max(0, Math.min(1, (p.alpha || 1) * (1 - progress) * twinkle));
    const r = Math.max(0.6, (p.radius || 2.5) * (1 - progress * 0.4));
    const rot = (p.angle || 0) - (p.spin || 5) * progress;

    ctx.save();
    // 暗影紫暈
    ctx.fillStyle = `rgba(126, 34, 206, ${alpha * 0.4})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.7, 0, Math.PI * 2);
    ctx.fill();

    // 暗芒閃爍核心
    ctx.fillStyle = p.color || '#c084fc';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, r, rot, 0.28);

    // 核心微亮點
    ctx.fillStyle = '#f5d0fe';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.4, r * 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_dark_charge_spark') {
    // 蒂納 - 暗光蓄力匯聚粒子 (旋轉匯聚、高頻閃爍、高辨識紫光)
    const progress = 1 - p.life / p.maxLife;
    const twinkle = 0.72 + 0.28 * Math.sin(p.life * 36 + (p.angle || 0));
    const alpha = Math.max(0, Math.min(1, (p.alpha || 1) * (1 - progress * 0.25) * twinkle));
    const r = Math.max(0.6, (p.radius || 2.2) * (1 - progress * 0.3));
    const rot = (p.angle || 0) + (p.spin || 6) * progress;

    ctx.save();
    // 匯聚光波
    ctx.fillStyle = `rgba(192, 132, 252, ${alpha * 0.4})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 蓄力微芒星
    ctx.fillStyle = p.color || '#e879f9';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, r, rot, 0.24);

    // 晶亮核心
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.4, r * 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_fusion_spark' || p.type === 'dina_fusion_spawn_spark') {
    // 蒂納 - 融合光球雙相閃爍粒子 (白紫雙極星芒 + 衝擊雙環，零 shadowBlur 高效能)
    const progress = 1 - p.life / p.maxLife;
    const twinkle = 0.70 + 0.30 * Math.sin(p.life * 35 + (p.angle || 0));
    const alpha = Math.max(0, Math.min(1, (p.alpha || 1) * (1 - progress) * twinkle));
    const r = Math.max(0.8, (p.radius || 2.8) * (1 - progress * 0.35));
    const rot = (p.angle || 0) + (p.spin || 7) * progress;

    ctx.save();
    // 柔和雙色擴散環
    ctx.strokeStyle = progress < 0.45 ? `rgba(255, 255, 255, ${alpha * 0.6})` : `rgba(217, 70, 239, ${alpha * 0.6})`;
    ctx.lineWidth = 1.2 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
    ctx.stroke();

    // 雙相閃爍星芒核心
    ctx.fillStyle = p.color || '#ffffff';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, r, rot, 0.22);

    // 璀璨星塵亮點
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, r * 0.35), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_burn_ember') {
    // 蒂納 - 融合燃燒暗紅殘燼 (零 shadowBlur 雙層繪製)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.fillStyle = `rgba(244, 63, 94, ${alpha * 0.35})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.8, (p.radius || 2) * 1.8), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(251, 113, 133, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 2) * (1 - progress * 0.3)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'dina_slow_rune') {
    // 蒂納 - 融合減速秘文 (零 shadowBlur 雙環)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.35})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 16) * (0.8 + progress * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(232, 121, 249, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 16) * (0.8 + progress * 0.3), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'dina_immobilize_chain') {
    // 蒂納 - 融合定身光暗雙環鎖定 (零 shadowBlur 雙層)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress * 0.6);
    // 白金光環 (雙層柔和弧)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 18), 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 18), 0, Math.PI);
    ctx.stroke();
    // 黑紫暗環 (雙層柔和弧)
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.4})`;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 18), Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(216, 180, 254, ${alpha})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 18), Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'dina_core_power_wave') {
    // 蒂納 - 核心之力位移衝擊波 (零 shadowBlur 雙層)
    const progress = 1 - p.life / p.maxLife;
    ctx.save();
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.strokeStyle = `rgba(129, 140, 248, ${alpha * 0.35})`;
    ctx.lineWidth = 4.2 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 30) * (0.3 + progress * 1.0), 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(224, 231, 255, ${alpha})`;
    ctx.lineWidth = 1.8 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.radius || 30) * (0.3 + progress * 1.0), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jianxian_sword_trail') {
    // 劍仙 - 仙靈白劍飛行星塵軌跡 (零 shadowBlur 高效能四芒星)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    const r = Math.max(0.6, (p.radius || 2) * (1 - progress * 0.5));
    const rot = (p.angle || 0) + (p.spin || 3) * progress;
    ctx.save();
    ctx.fillStyle = p.color || '#ffffff';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, r, rot, 0.25);
    ctx.restore();
  } else if (p.type === 'jianxian_burst_spark') {
    // 劍仙 - 白劍爆裂劍晶破片微粒
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    const r = Math.max(0.5, (p.radius || 2.5) * (1 - progress * 0.3));
    ctx.save();
    ctx.fillStyle = p.color || '#bae6fd';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jianxian_burst_ring') {
    // 劍仙 - 70px 白劍爆裂仙道衝擊環 (零 shadowBlur 雙層漸散環)
    const progress = 1 - p.life / p.maxLife;
    const currentR = (p.radius || 70) * Math.sin(progress * Math.PI * 0.5);
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.save();
    // 內層純白銳利環
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 2.2 * (1 - progress * 0.7);
    ctx.beginPath();
    ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
    ctx.stroke();
    // 外層仙青柔和環
    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.4})`;
    ctx.lineWidth = 4.5 * (1 - progress * 0.6);
    ctx.beginPath();
    ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'jianxian_retreat_smoke') {
    // 劍仙 - 退劍仙羽殘影霧氣
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.6) * (1 - progress);
    const r = (p.radius || 12) * (0.8 + progress * 0.8);
    ctx.save();
    ctx.fillStyle = `rgba(224, 242, 254, ${alpha * 0.4})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jianxian_slow_frost') {
    // 劍仙 - 緩速仙劍寒霜符紋晶屑
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    const r = Math.max(0.6, (p.radius || 2) * (1 - progress * 0.4));
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jianxian_qi_trail') {
    // 劍仙 - 劍氣飛馳微光
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.7) * (1 - progress);
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.4, (p.radius || 1.5) * (1 - progress * 0.5)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'jianxian_array_rune') {
    // 劍仙 - 百萬劍陣符文微光
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    ctx.save();
    ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
    drawSparkleStar(ctx, p.x, p.y, p.radius || 2, progress * 4, 0.3);
    ctx.restore();
  } else if (p.type === 'longshen_swoop_spark' || p.type === 'longshen_flame_particle') {
    // 龍神 - 俯衝火星 / 龍炎粒子
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.save();
    ctx.fillStyle = p.color || '#f97316';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 3) * (1 - progress * 0.4)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'longshen_swoop_trail') {
    // 龍神 - 俯衝氣浪尾跡
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.6) * (1 - progress);
    ctx.save();
    ctx.fillStyle = p.color || '#ea580c';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 5) * (1 - progress * 0.2)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'longshen_strike_claw') {
    // 龍神 - 龍爪打擊裂痕
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.save();
    ctx.strokeStyle = p.color || '#f97316';
    ctx.lineWidth = Math.max(1, (p.width || 2) * (1 - progress * 0.5));
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    const len = (p.length || 15) * (0.8 + progress * 0.5);
    const ang = p.angle || 0;
    ctx.moveTo(p.x - Math.cos(ang) * len * 0.5, p.y - Math.sin(ang) * len * 0.5);
    ctx.lineTo(p.x + Math.cos(ang) * len * 0.5, p.y + Math.sin(ang) * len * 0.5);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'longshen_form_aura_particle' || p.type === 'longshen_form_wing_spark') {
    // 龍神 - 龍真身領域金炎微星
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    ctx.save();
    ctx.fillStyle = p.color || '#fbbf24';
    ctx.globalAlpha = alpha;
    drawSparkleStar(ctx, p.x, p.y, Math.max(0.8, (p.radius || 2.5) * (1 - progress * 0.3)), (p.angle || 0) + progress * 4, 0.3);
    ctx.restore();
  } else if (p.type === 'xin_upgrade_ring') {
    // 辛 - 升級能量擴散環 (Expanding dual-phase ring)
    const progress = 1 - p.life / p.maxLife;
    const curR = (p.radius || 30) * (0.3 + progress * 1.2);
    const alpha = (p.alpha || 1) * (1 - progress);
    ctx.save();
    ctx.strokeStyle = p.color || `rgba(251, 191, 36, ${alpha})`;
    ctx.lineWidth = Math.max(0.8, (p.width || 2.5) * (1 - progress * 0.5));
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
    // 內層細純白環
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR * 0.95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_charge_ring') {
    // 辛 - 蓄力收縮向心光環 (Contracting charge ring)
    const progress = 1 - p.life / p.maxLife;
    const curR = (p.radius || 24) * (1 - progress * 0.7);
    const alpha = (p.alpha || 1) * (1 - progress * 0.2);
    ctx.save();
    ctx.strokeStyle = p.color || `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_impact_spark') {
    // 辛 - 魔劍打擊破甲火花 (Directional metal sparks)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    const len = (p.length || 10) * (1 - progress * 0.4);
    ctx.save();
    ctx.translate(p.x, p.y);
    const ang = Math.atan2(p.vy, p.vx);
    ctx.rotate(ang);
    ctx.strokeStyle = p.color || '#fef08a';
    ctx.lineWidth = 1.6 * (1 - progress * 0.3);
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_exp_ring') {
    // 辛 - 經驗吸收收縮環 (Exp absorption into core)
    const progress = 1 - p.life / p.maxLife;
    const curR = (p.radius || 28) * (1 - progress);
    const alpha = (p.alpha || 1) * (1 - progress * 0.2);
    ctx.save();
    ctx.strokeStyle = p.color || `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(1, curR), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_dash_trail') {
    // 辛 - 逐影衝刺短能量微粒拖影
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.65) * (1 - progress);
    ctx.save();
    ctx.fillStyle = p.color || '#e2e8f0';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.6, (p.radius || 2.2) * (1 - progress * 0.4)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_afterimage') {
    // 辛 - 重裝戰士半透明殘影拖尾 (Heavy Armor Translucent Afterimage)
    // 極短暫、半透明，展現厚重金屬輪廓與雙相核心暗光，不影響碰撞體積
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.4) * (1 - progress * progress); // 快速柔和淡出
    const radius = p.radius || 21;
    const form = p.extraData?.form || 'balance';
    const fillCol = form === 'dark' ? 'rgba(76, 29, 149, 0.45)' : (form === 'light' ? 'rgba(180, 83, 9, 0.45)' : 'rgba(30, 41, 59, 0.5)');
    const strokeCol = form === 'dark' ? 'rgba(168, 85, 247, 0.6)' : (form === 'light' ? 'rgba(251, 191, 36, 0.6)' : 'rgba(148, 163, 184, 0.6)');
    const coreCol = form === 'dark' ? 'rgba(192, 132, 252, 0.7)' : (form === 'light' ? 'rgba(254, 240, 138, 0.7)' : 'rgba(224, 231, 255, 0.7)');

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);

    // 1. 裝甲重球體半透明剪影
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 2. 金屬硬質外骨骼邊線 (微縮 0.95 體積感，不膨脹外框)
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius - 0.6, 0, Math.PI * 2);
    ctx.stroke();

    // 3. 核心結晶微光印記 (微小十字能量核)
    ctx.fillStyle = coreCol;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // 4. 重裝裝甲橫向接縫刻線剪影
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(p.x - radius * 0.65, p.y);
    ctx.lineTo(p.x + radius * 0.65, p.y);
    ctx.stroke();

    ctx.restore();
  } else if (p.type === 'xin_collision_shard') {
    // 辛 - 碰撞瞬間厚重裝甲火花與金屬微碎片
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    const size = Math.max(0.6, (p.radius || 2) * (1 - progress * 0.5));
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.spin || 0) + progress * 5);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color || '#e2e8f0';
    // 小型菱形金屬碎片
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.5);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size * 1.5);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_sword_trail') {
    // 辛 - 浮游魔劍微光星塵尾跡
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    ctx.save();
    ctx.fillStyle = p.color || '#fef08a';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.6, (p.radius || 2) * (1 - progress * 0.4)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_slash_arc') {
    // 辛 - 劍氣弧光斬擊痕 (Crescent Blade Slash Arc In Air)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.9) * (1 - progress * progress);
    const arcR = (p.radius || 24) * (1 + progress * 0.35);
    const ang = p.angle || 0;
    const sweep = (p.extraData?.sweep || 1.1) * (1 - progress * 0.2);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = p.color || '#fde047';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.lineWidth = Math.max(1.0, (p.width || 3.5) * (1 - progress));
    ctx.beginPath();
    ctx.arc(0, 0, arcR, -sweep * 0.5, sweep * 0.5);
    ctx.stroke();

    // 內層純白極光銳鋒
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(0.8, (p.width || 3.5) * 0.45 * (1 - progress));
    ctx.beginPath();
    ctx.arc(0, 0, arcR, -sweep * 0.35, sweep * 0.35);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_cross_slash') {
    // 辛 - 命中十字雙斬破甲光印 (Cross Slash Impact Mark)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    const len = (p.length || 26) * (1 + progress * 0.25);
    const ang = p.angle || 0;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = p.color || '#ffffff';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.lineWidth = Math.max(1.2, 3.2 * (1 - progress));

    // 十字第一刀
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, -len * 0.25);
    ctx.lineTo(len * 0.5, len * 0.25);
    ctx.stroke();

    // 十字第二刀
    ctx.beginPath();
    ctx.moveTo(-len * 0.35, len * 0.5);
    ctx.lineTo(len * 0.35, -len * 0.5);
    ctx.stroke();

    // 中心亮核
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1, 3.5 * (1 - progress)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_spatial_rift_crack') {
    // 辛 - 裂空空間破碎裂痕 (Spatial Rift Fracture Crack)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.9) * (1 - progress);
    const len = (p.length || 32) * (1 + progress * 0.15);
    const ang = p.angle || 0;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = p.color || '#c084fc';
    ctx.shadowColor = p.color || '#9333ea';
    ctx.shadowBlur = 14;
    ctx.lineWidth = Math.max(1.0, 2.8 * (1 - progress));

    // 鋸齒狀空間裂縫
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(-len * 0.2, (p.extraData?.jag1 || 6));
    ctx.lineTo(0, -(p.extraData?.jag2 || 5));
    ctx.lineTo(len * 0.25, (p.extraData?.jag3 || 4));
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();

    // 裂縫純白核心電光
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-len * 0.35, 0);
    ctx.lineTo(0, -(p.extraData?.jag2 || 5) * 0.6);
    ctx.lineTo(len * 0.35, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_sonic_cone') {
    // 辛 - 逐影突進音錐衝擊氣浪 (Supersonic Penetration Shock Cone)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.8) * (1 - progress);
    const coneLen = (p.length || 28) * (1 + progress * 0.6);
    const coneW = (p.width || 22) * (1 + progress * 0.8);
    const ang = p.angle || 0;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = p.color || 'rgba(254, 240, 138, 0.7)';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.lineWidth = Math.max(0.8, 2.2 * (1 - progress));

    // V形音錐
    ctx.beginPath();
    ctx.moveTo(coneLen * 0.5, 0);
    ctx.lineTo(-coneLen * 0.5, coneW * 0.5);
    ctx.moveTo(coneLen * 0.5, 0);
    ctx.lineTo(-coneLen * 0.5, -coneW * 0.5);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_sky_beam') {
    // 辛 - 裂空神芒天柱射線 (Spatial Cataclysm Beam)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.9) * (1 - progress);
    const len = (p.length || 60) * (1 + progress * 0.4);
    const w = (p.width || 8) * (1 - progress * 0.5);
    const ang = p.angle || 0;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.strokeStyle = p.color || '#fef08a';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 16;
    ctx.lineWidth = Math.max(1.0, w);
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();

    // 核心純白細光
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(0.8, w * 0.4);
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, 0);
    ctx.lineTo(len * 0.5, 0);
    ctx.stroke();
    ctx.restore();
  } else if (p.type === 'xin_shield_aura') {
    // 辛 - 守護神聖護盾微粒
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.75) * (1 - progress);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = p.color || '#fef08a';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 2.5) * (1 - progress * 0.3)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_level_spark') {
    // 辛 - 戰魂升階金紫星芒 (Rank-Up Radiant Spark)
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 1) * (1 - progress);
    const size = (p.radius || 5) * (1 - progress * 0.4);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.spin || 0) + progress * 4);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = p.color || '#ffffff';
    ctx.shadowColor = p.color || '#fbbf24';
    ctx.shadowBlur = 10;
    // 四角銳利星芒
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.8);
    ctx.quadraticCurveTo(0, 0, size * 1.8, 0);
    ctx.quadraticCurveTo(0, 0, 0, size * 1.8);
    ctx.quadraticCurveTo(0, 0, -size * 1.8, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size * 1.8);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_light_spark') {
    // 辛 - 耀光微金火花
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.9) * (1 - progress);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = p.color || '#fde047';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 1.8) * (1 - progress * 0.4)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (p.type === 'xin_dark_spark') {
    // 辛 - 暗影紫晶暗芒
    const progress = 1 - p.life / p.maxLife;
    const alpha = (p.alpha || 0.9) * (1 - progress);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = p.color || '#c084fc';
    ctx.shadowColor = '#9333ea';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, (p.radius || 1.8) * (1 - progress * 0.4)), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Void Rift Entrance and Exit (Passive 2: 虛空裂縫)
 */
export function drawVoidRift(
  ctx: CanvasRenderingContext2D,
  rift: VoidRift,
  time: number = performance.now() * 0.001
) {
  ctx.save();

  // Helper to draw single portal tear (entrance or exit)
  const drawPortal = (px: number, py: number, isExit: boolean) => {
    ctx.save();
    const pulse = Math.sin(time * 6 + (isExit ? Math.PI : 0)) * 3;
    const r = Math.max(6, rift.radius + pulse);

    // Outer Void Accretion Disc
    const discGrad = ctx.createRadialGradient(px, py, 2, px, py, Math.max(4, r + 10));
    discGrad.addColorStop(0, '#000000');
    discGrad.addColorStop(0.35, '#3b0764');
    discGrad.addColorStop(0.75, isExit ? '#a855f7' : '#7e22ce');
    discGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(4, r + 10), 0, Math.PI * 2);
    ctx.fill();

    // Event Horizon Pitch Black Void Center
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(px, py, Math.max(1, r * 0.55), 0, Math.PI * 2);
    ctx.fill();

    // Swirling Spacetime Distortion Ring
    ctx.strokeStyle = isExit ? '#c084fc' : '#a855f7';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 14;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.arc(px, py, Math.max(1, r * 0.75), time * 3 * (isExit ? -1 : 1), time * 3 * (isExit ? -1 : 1) + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Portal Rim
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(1, r), 0, Math.PI * 2);
    ctx.stroke();

    // Text Label
    ctx.font = '900 11px system-ui, sans-serif';
    ctx.fillStyle = isExit ? '#e9d5ff' : '#d8b4fe';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 6;
    ctx.fillText(isExit ? '出口 [EXIT]' : '入口 [ENTRY]', px, py - r - 8);

    ctx.restore();
  };

  // 1. Spacetime Folding Energy Conduit connecting entrance and exit
  ctx.save();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
  ctx.lineWidth = 2.0;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 10;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(rift.entranceX, rift.entranceY);
  ctx.lineTo(rift.exitX, rift.exitY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 2. Draw Entrance and Exit
  drawPortal(rift.entranceX, rift.entranceY, false);
  drawPortal(rift.exitX, rift.exitY, true);

  ctx.restore();
}

/**
 * Draw Void Hunt Target Lock Mark (Passive 3: 虛空獵擊 3s 鎖定標記)
 */
export function drawVoidHuntTargetMark(
  ctx: CanvasRenderingContext2D,
  targetX: number,
  targetY: number,
  radius: number,
  remainingTime: number,
  time: number = performance.now() * 0.001
) {
  ctx.save();
  const markR = radius + 14 + Math.sin(time * 8) * 2;

  // Rotating target brackets (4 corners)
  const angle = time * 3;
  ctx.translate(targetX, targetY);
  ctx.rotate(angle);

  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2.2;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 12;

  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const bx = Math.cos(a) * markR;
    const by = Math.sin(a) * markR;
    ctx.beginPath();
    ctx.arc(0, 0, markR, a - 0.22, a + 0.22);
    ctx.stroke();
  }

  // Crosshair center lines
  ctx.strokeStyle = 'rgba(233, 213, 255, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-markR * 0.4, 0);
  ctx.lineTo(markR * 0.4, 0);
  ctx.moveTo(0, -markR * 0.4);
  ctx.lineTo(0, markR * 0.4);
  ctx.stroke();

  // Timer label
  ctx.rotate(-angle); // Reset rotation for text readability
  ctx.font = '900 12px system-ui, sans-serif';
  ctx.fillStyle = '#f3e8ff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#7e22ce';
  ctx.shadowBlur = 8;
  ctx.fillText(`鎖定中 ${Math.max(0, remainingTime).toFixed(1)}s`, 0, -markR - 10);

  ctx.restore();
}

/**
 * Draw Void Bite Restraint Tether (Passive 1: 虛空獸 咬住束縛特效)
 */
export function drawVoidBiteTether(
  ctx: CanvasRenderingContext2D,
  beastX: number,
  beastY: number,
  targetX: number,
  targetY: number,
  time: number = performance.now() * 0.001
) {
  ctx.save();

  const dx = targetX - beastX;
  const dy = targetY - beastY;
  const dist = Math.hypot(dx, dy);
  const midX = (beastX + targetX) / 2;
  const midY = (beastY + targetY) / 2;
  const perpX = -dy / (dist || 1);
  const perpY = dx / (dist || 1);

  // 1. Dark violet swirling constriction coils
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 14;

  ctx.beginPath();
  ctx.moveTo(beastX, beastY);
  const wave = Math.sin(time * 14) * 9;
  ctx.quadraticCurveTo(midX + perpX * wave, midY + perpY * wave, targetX, targetY);
  ctx.stroke();

  // Reverse swirling tendril
  ctx.strokeStyle = '#7e22ce';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(beastX, beastY);
  ctx.quadraticCurveTo(midX - perpX * wave, midY - perpY * wave, targetX, targetY);
  ctx.stroke();

  // 2. Void Maw Clamping Graphic at contact point
  const biteAngle = Math.atan2(dy, dx);
  const clampX = beastX + Math.cos(biteAngle) * (dist * 0.55);
  const clampY = beastY + Math.sin(biteAngle) * (dist * 0.55);

  ctx.save();
  ctx.translate(clampX, clampY);
  ctx.rotate(biteAngle);

  // Pulsing void vortex
  const vGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
  vGrad.addColorStop(0, 'rgba(192, 132, 252, 0.8)');
  vGrad.addColorStop(0.5, 'rgba(126, 34, 206, 0.5)');
  vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  // Gnashing upper and lower phantom fangs
  const chompPulse = Math.abs(Math.sin(time * 16)) * 4;
  ctx.fillStyle = '#f3e8ff';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 8;

  // Upper fang
  ctx.beginPath();
  ctx.moveTo(-6, -12 + chompPulse);
  ctx.lineTo(6, -12 + chompPulse);
  ctx.lineTo(0, -2 + chompPulse);
  ctx.closePath();
  ctx.fill();

  // Lower fang
  ctx.beginPath();
  ctx.moveTo(-6, 12 - chompPulse);
  ctx.lineTo(6, 12 - chompPulse);
  ctx.lineTo(0, 2 - chompPulse);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

/**
 * Draw Void Trap Cage (Passive 2: 敵人踩中裂縫被困住 2s 特效)
 */
export function drawVoidTrapCage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number = performance.now() * 0.001
) {
  ctx.save();
  const cageR = radius + 10;

  // Dark violet void web cage
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 12;

  // Concentric octagonal web
  for (let ring = 1; ring <= 2; ring++) {
    const curR = (cageR * ring) / 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + time * (ring % 2 === 0 ? 1 : -1);
      const px = x + Math.cos(a) * curR;
      const py = y + Math.sin(a) * curR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Warning text
  ctx.font = '900 11px system-ui, sans-serif';
  ctx.fillStyle = '#e9d5ff';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 8;
  ctx.fillText('虛空束縛 (困住)', x, y - cageR - 8);

  ctx.restore();
}

/**
 * Draw Energy Shard (能量碎片)
 * Floating arcane crystal diamond with rotating runes and expiration countdown ring
 */
export function drawEnergyShard(
  ctx: CanvasRenderingContext2D,
  shard: EnergyShard,
  time: number = performance.now() * 0.001
) {
  ctx.save();

  // Gentle floating bob
  const bobY = Math.sin(time * 3 + shard.pulsePhase) * 3;
  const cx = shard.x;
  const cy = shard.y + bobY;
  const r = shard.radius;

  // Blinking alert when lifespan is expiring (< 3s)
  const isExpiring = shard.life < 3.0;
  if (isExpiring && Math.floor(time * 8) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // 0. Soft Vertical Arcane Beacon Light Pillar
  const beaconGrad = ctx.createLinearGradient(cx, cy + 10, cx, cy - 36);
  beaconGrad.addColorStop(0, 'rgba(192, 132, 252, 0.28)');
  beaconGrad.addColorStop(0.7, 'rgba(147, 51, 234, 0.12)');
  beaconGrad.addColorStop(1, 'rgba(15, 2, 30, 0)');
  ctx.fillStyle = beaconGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 3.5, cy + 6);
  ctx.lineTo(cx - 7, cy - 36);
  ctx.lineTo(cx + 7, cy - 36);
  ctx.lineTo(cx + 3.5, cy + 6);
  ctx.closePath();
  ctx.fill();

  // 0.5 Ground Runic Shadow / Energy Pool
  const shadowGrad = ctx.createRadialGradient(cx, shard.y + 12, 1, cx, shard.y + 12, r * 1.5);
  shadowGrad.addColorStop(0, 'rgba(15, 2, 30, 0.45)');
  shadowGrad.addColorStop(0.7, 'rgba(126, 34, 206, 0.2)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, shard.y + 12, r * 1.4, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Ambient Pulsing Aura
  const auraPulse = 0.85 + Math.sin(time * 4 + shard.pulsePhase) * 0.15;
  const auraGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2.0 * auraPulse);
  auraGrad.addColorStop(0, 'rgba(232, 121, 249, 0.5)');
  auraGrad.addColorStop(0.55, 'rgba(126, 34, 206, 0.28)');
  auraGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.0 * auraPulse, 0, Math.PI * 2);
  ctx.fill();

  // 2. Lifespan Countdown Circular Arc (Remaining time from 15s)
  const lifeRatio = Math.max(0, Math.min(1, shard.life / shard.maxLife));
  ctx.strokeStyle = isExpiring ? 'rgba(239, 68, 68, 0.85)' : 'rgba(216, 180, 254, 0.55)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lifeRatio);
  ctx.stroke();

  // 3. Rotating Outer Arcane Rune Rhombus (Clockwise)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 1.8 + shard.pulsePhase);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.3;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.35);
  ctx.lineTo(r * 0.95, 0);
  ctx.lineTo(0, r * 1.35);
  ctx.lineTo(-r * 0.95, 0);
  ctx.closePath();
  ctx.stroke();

  // Counter-rotating Inner Rune Ring
  ctx.rotate(-time * 3.6);
  ctx.strokeStyle = 'rgba(245, 208, 254, 0.7)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.7);
  ctx.lineTo(r * 0.65, 0);
  ctx.lineTo(0, r * 0.7);
  ctx.lineTo(-r * 0.65, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // 4. Inner Octahedral Crystal Facets
  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 10;

  // Crystal Gradient Body
  const crystalGrad = ctx.createLinearGradient(0, -r, 0, r);
  crystalGrad.addColorStop(0, '#fdf4ff');
  crystalGrad.addColorStop(0.3, '#c084fc');
  crystalGrad.addColorStop(0.7, '#7e22ce');
  crystalGrad.addColorStop(1, '#3b0764');

  ctx.fillStyle = crystalGrad;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.75, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r * 0.75, 0);
  ctx.closePath();
  ctx.fill();

  // Facet Split Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(0, r);
  ctx.moveTo(-r * 0.75, 0);
  ctx.lineTo(r * 0.75, 0);
  ctx.stroke();

  // Center white star glimmer
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 2.0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

/**
 * Draw Tunshimozu Devour Visual Effect (『吞噬』被動技能視覺效果)
 * 當吞噬魔族吸收能量碎片時，從碎片位置產生向球體中心收縮的黑紫色粒子流
 * 包括：
 * 1. 從碎片原點向球心收縮的數條黑紫色能量引力弧線 (Dark-purple Gravitational Inflow Streamers)
 * 2. 沿收縮流高速湧向球心的流動黑紫色粒子束 (Fast-flowing particle stream comets)
 * 3. 碎片原點處的空間塌縮環 (Origin Space Collapse Ring)
 * 4. 球體中心的黑洞引力渦流 (Core Gravitational Singularity Vortex)
 */
export function drawDevourParticleStream(
  ctx: CanvasRenderingContext2D,
  shardX: number,
  shardY: number,
  ballX: number,
  ballY: number,
  ballRadius: number,
  animTimer: number, // 0.45s down to 0s
  nowTime: number = performance.now() * 0.001
) {
  const maxDuration = 0.45;
  const progress = Math.max(0, Math.min(1, 1 - animTimer / maxDuration)); // 0 -> 1
  const alpha = Math.max(0, Math.min(1, animTimer / (maxDuration * 0.75))); // fades out at end
  if (alpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const dx = ballX - shardX;
  const dy = ballY - shardY;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const perpX = -Math.sin(angle);
  const perpY = Math.cos(angle);

  // 1. Shard Origin Space Collapse Ring
  const originCollapseR = Math.max(1, 16 * (1 - progress));
  ctx.save();
  ctx.strokeStyle = `rgba(192, 132, 252, ${alpha * 0.85})`;
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#7e22ce';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(shardX, shardY, originCollapseR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Multi-strand Dark Purple Gravitational Streamers (弧形黑紫引力流束)
  const strandCount = 5;
  for (let i = 0; i < strandCount; i++) {
    const strandOffset = (i - 2) * (dist * 0.2) * (1 - progress * 0.6);
    const midT = 0.45 + (i % 2) * 0.1;
    // Control point bends outward then snaps to ball center
    const ctrlX = shardX + dx * midT + perpX * strandOffset;
    const ctrlY = shardY + dy * midT + perpY * strandOffset;

    // Gradient along streamer (Black-purple to royal purple to bright violet)
    const streamerGrad = ctx.createLinearGradient(shardX, shardY, ballX, ballY);
    streamerGrad.addColorStop(0, 'rgba(15, 2, 30, 0.3)');
    streamerGrad.addColorStop(0.3, 'rgba(59, 7, 100, 0.85)');
    streamerGrad.addColorStop(0.7, 'rgba(126, 34, 206, 0.95)');
    streamerGrad.addColorStop(1, 'rgba(192, 132, 252, 0.95)');

    ctx.save();
    ctx.strokeStyle = streamerGrad;
    ctx.lineWidth = Math.max(1.2, 3.4 * (1 - progress * 0.5));
    ctx.shadowColor = '#581c87';
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(shardX, shardY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, ballX, ballY);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Contracting Particle Stream Along Streamer Paths (高速向球心收縮的黑紫色粒子群)
  const particleCount = 20;
  for (let j = 0; j < particleCount; j++) {
    // Particle travel from shard (t=0) to ball (t=1)
    const baseT = (progress * 2.5 + j / particleCount) % 1.0;
    const strandIdx = j % strandCount;
    const strandOffset = (strandIdx - 2) * (dist * 0.2) * (1 - baseT * 0.7);
    const midT = 0.45 + (strandIdx % 2) * 0.1;
    const ctrlX = shardX + dx * midT + perpX * strandOffset;
    const ctrlY = shardY + dy * midT + perpY * strandOffset;

    // Quadratic bezier: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const u = 1 - baseT;
    const px = u * u * shardX + 2 * u * baseT * ctrlX + baseT * baseT * ballX;
    const py = u * u * shardY + 2 * u * baseT * ctrlY + baseT * baseT * ballY;

    // Tangent derivative for comet angle
    const tx = 2 * (1 - baseT) * (ctrlX - shardX) + 2 * baseT * (ballX - ctrlX);
    const ty = 2 * (1 - baseT) * (ctrlY - shardY) + 2 * baseT * (ballY - ctrlY);
    const tAngle = Math.atan2(ty, tx);

    const pRadius = Math.max(1.4, 4.2 * (1 - baseT * 0.45));
    const pAlpha = alpha * Math.sin(baseT * Math.PI); // Fades in smoothly and fades into core

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(tAngle);
    ctx.globalAlpha = pAlpha;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;

    // Comet tail
    const cometGrad = ctx.createLinearGradient(-8, 0, pRadius, 0);
    cometGrad.addColorStop(0, 'rgba(15, 2, 30, 0)');
    cometGrad.addColorStop(0.5, 'rgba(59, 7, 100, 0.7)');
    cometGrad.addColorStop(1, j % 3 === 0 ? '#f3e8ff' : j % 2 === 0 ? '#c084fc' : '#581c87');
    ctx.fillStyle = cometGrad;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(pRadius * 0.5, -pRadius * 0.7);
    ctx.lineTo(pRadius, 0);
    ctx.lineTo(pRadius * 0.5, pRadius * 0.7);
    ctx.closePath();
    ctx.fill();

    // Demonic core droplet
    ctx.fillStyle = '#0f021e';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.8, pRadius * 0.6), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. Ball Core Devour Singularity Vortex (球心吞噬黑洞引力渦流)
  ctx.save();
  ctx.translate(ballX, ballY);
  ctx.rotate(nowTime * 9 + progress * Math.PI * 3);
  const vortexRadius = ballRadius * (0.45 + (1 - progress) * 0.35);

  // Black-purple vortex gradient
  const vortexGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, vortexRadius);
  vortexGrad.addColorStop(0, '#0f021e');
  vortexGrad.addColorStop(0.45, '#3b0764');
  vortexGrad.addColorStop(0.85, '#7e22ce');
  vortexGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');

  ctx.fillStyle = vortexGrad;
  ctx.beginPath();
  ctx.arc(0, 0, vortexRadius, 0, Math.PI * 2);
  ctx.fill();

  // Spiral swirl arms converging into center
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 6;
  for (let arm = 0; arm < 3; arm++) {
    const armAngle = (arm * Math.PI * 2) / 3;
    ctx.beginPath();
    for (let step = 0; step < 16; step++) {
      const stepAngle = armAngle + step * 0.36;
      const stepR = (1 - step / 16) * vortexRadius;
      const sx = Math.cos(stepAngle) * stepR;
      const sy = Math.sin(stepAngle) * stepR;
      if (step === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/**
 * 咪咪 (Mimi) 被動三：咪咪希望 成長包 (Mimi Growth Pack) 渲染器
 * - 生命成長包: 翡翠晶瑩愛心膠囊 + 呼吸脈衝 + 收集範圍光環 (HP上限 +0.1%)
 * - 攻擊成長包: 赤紅金芒寶劍徽記 + 旋轉攻擊符文 + 收集範圍光環 (攻擊力 +0.1%)
 * - 清楚標註 20px 觸發半徑與文字標籤，敵方踩踏破壞有清晰警示
 */
export function drawMimiGrowthPack(ctx: CanvasRenderingContext2D, pack: MimiGrowthPack, time: number) {
  ctx.save();
  const bobY = Math.sin(time * 3.5 + (pack.type === 'life' ? 0 : Math.PI)) * 3.5;
  const px = pack.x;
  const py = pack.y + bobY;
  const r = pack.radius || 14;
  const isLife = pack.type === 'life';

  // 1. Interaction Detection Boundary (20px collection radius ring)
  const interactRadius = r + 20;
  ctx.save();
  ctx.strokeStyle = isLife ? 'rgba(52, 211, 153, 0.45)' : 'rgba(251, 146, 60, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(px, py, interactRadius, time * 2, time * 2 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 2. Base Glowing Beacon Radial Glow
  const beaconGrad = ctx.createRadialGradient(px, py, 2, px, py, r * 2.2);
  if (isLife) {
    beaconGrad.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
    beaconGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
    beaconGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
  } else {
    beaconGrad.addColorStop(0, 'rgba(251, 146, 60, 0.6)');
    beaconGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.25)');
    beaconGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  }
  ctx.fillStyle = beaconGrad;
  ctx.beginPath();
  ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 3. Main Emblem Body
  ctx.save();
  ctx.shadowColor = isLife ? '#10b981' : '#f59e0b';
  ctx.shadowBlur = 14;

  if (isLife) {
    // --- LIFE GROWTH PACK: EMERALD HEART CAPSULE ---
    const gemGrad = ctx.createLinearGradient(px - r, py - r, px + r, py + r);
    gemGrad.addColorStop(0, '#ffffff');
    gemGrad.addColorStop(0.3, '#6ee7b7');
    gemGrad.addColorStop(0.7, '#10b981');
    gemGrad.addColorStop(1, '#064e3b');
    ctx.fillStyle = gemGrad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner heart emblem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const hs = r / 16;
    ctx.save();
    ctx.translate(px, py - 1);
    ctx.scale(hs, hs);
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-7, -7, -12, 0, 0, 11);
    ctx.bezierCurveTo(12, 0, 7, -7, 0, 3);
    ctx.closePath();
    ctx.fill();

    // Plus sign cross inside heart
    ctx.fillStyle = '#059669';
    ctx.fillRect(-1.2, 1, 2.4, 6);
    ctx.fillRect(-3, 2.8, 6, 2.4);
    ctx.restore();
  } else {
    // --- ATTACK GROWTH PACK: CRIMSON SWORD EMBLEM ---
    const swordGrad = ctx.createLinearGradient(px - r, py - r, px + r, py + r);
    swordGrad.addColorStop(0, '#ffffff');
    swordGrad.addColorStop(0.3, '#fcd34d');
    swordGrad.addColorStop(0.7, '#f97316');
    swordGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = swordGrad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner blade symbol
    ctx.fillStyle = '#ffffff';
    ctx.save();
    ctx.translate(px, py);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.7);
    ctx.lineTo(r * 0.22, -r * 0.35);
    ctx.lineTo(r * 0.12, r * 0.3);
    ctx.lineTo(-r * 0.12, r * 0.3);
    ctx.lineTo(-r * 0.22, -r * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-r * 0.36, r * 0.26, r * 0.72, 2.4);
    ctx.beginPath();
    ctx.arc(0, r * 0.52, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 4. Floating Pill Tag Label
  ctx.save();
  const labelY = py + r + 13;
  ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const labelText = isLife ? 'HP成長 +0.1%' : '攻成長 +0.1%';
  const textWidth = ctx.measureText(labelText).width;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(px - textWidth / 2 - 5, labelY - 7, textWidth + 10, 14, 4);
  ctx.fill();

  ctx.strokeStyle = isLife ? 'rgba(52, 211, 153, 0.7)' : 'rgba(251, 146, 60, 0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = isLife ? '#34d399' : '#fbbf24';
  ctx.fillText(labelText, px, labelY);
  ctx.restore();

  ctx.restore();
}

/**
 * 咪咪 (Mimi) 被動一：貓咪衝爪 爪擊特效 (Mimi Claw Slash Effect)
 * 渲染 3 道極速粉紅撕裂爪痕與粒子光弧
 */
export function drawMimiClawSlash(
  ctx: CanvasRenderingContext2D,
  targetX: number,
  targetY: number,
  progress: number // 0 to 1 (0 = start, 1 = fade)
) {
  ctx.save();
  const alpha = Math.max(0, 1 - progress);
  ctx.globalAlpha = alpha;
  ctx.translate(targetX, targetY);

  const clawCount = 3;
  const slashLen = 38 * (1 + progress * 0.3);
  const spacing = 11;

  ctx.shadowColor = '#ec4899';
  ctx.shadowBlur = 16;
  ctx.lineCap = 'round';

  for (let i = 0; i < clawCount; i++) {
    const offsetY = (i - 1) * spacing;
    ctx.save();
    ctx.translate(0, offsetY);
    ctx.rotate(0.45);

    // Glowing outer pink arc
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3.5 * (1 - progress * 0.4);
    ctx.beginPath();
    ctx.moveTo(-slashLen / 2, -2);
    ctx.quadraticCurveTo(0, 6, slashLen / 2, -2);
    ctx.stroke();

    // White hot core cut
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-slashLen / 2 + 4, -1.5);
    ctx.quadraticCurveTo(0, 4.5, slashLen / 2 - 4, -1.5);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Jiandaoshou (剪刀手) - Passive 2: 聖霧守護 (Holy Mist Sanctuary)
 * 130px radius holy mist following the champion.
 * - Sacred white magic circle at the base
 * - Billowing semi-transparent white mist (r=130)
 * - Pale gold ring on the perimeter
 * - Slowly rotating mist wisps
 * - Sacred light particles drifting upward
 */
export function drawJiandaoshouMist(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number = performance.now() * 0.001,
  radius: number = 130
) {
  ctx.save();

  // 1. Base Sacred White Magic Circle (Floor Glyphs)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 0.25);

  // Outer inscribed dodecagon / star lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const px = Math.cos(angle) * (radius * 0.85);
    const py = Math.sin(angle) * (radius * 0.85);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner interlocking triangles / hexagram
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const px = Math.cos(angle) * (radius * 0.55);
    const py = Math.sin(angle) * (radius * 0.55);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // 2. Billowing Semi-Transparent White Mist Volume (白色半透明霧氣)
  const mistGrad = ctx.createRadialGradient(x, y, 10, x, y, radius);
  mistGrad.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
  mistGrad.addColorStop(0.5, 'rgba(241, 245, 249, 0.22)');
  mistGrad.addColorStop(0.85, 'rgba(254, 249, 195, 0.12)');
  mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = mistGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Rotating mist cloud clusters
  const clouds = 6;
  for (let i = 0; i < clouds; i++) {
    const rotSpeed = 0.35 * (i % 2 === 0 ? 1 : -1);
    const cloudAngle = time * rotSpeed + (i * Math.PI * 2) / clouds;
    const dist = radius * 0.52 + Math.sin(time * 2 + i) * 12;
    const cx = x + Math.cos(cloudAngle) * dist;
    const cy = y + Math.sin(cloudAngle) * dist;
    const cRadius = radius * 0.42;

    const cloudGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cRadius);
    cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    cloudGrad.addColorStop(0.6, 'rgba(248, 250, 252, 0.08)');
    cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Pale Gold Outer Halo Ring (霧圈邊緣有淡金色光環)
  const pulse = Math.sin(time * 3) * 1.5;
  const rimR = radius + pulse;

  ctx.save();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)'; // pale gold #fef08a
  ctx.lineWidth = 2.2;
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, rimR, 0, Math.PI * 2);
  ctx.stroke();

  // Fine dotted accent ring inside
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(x, y, rimR - 5, -time * 0.5, -time * 0.5 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 4. Upward Drifting Holy Light Particles (聖光粒子向上飄散)
  const particles = 8;
  for (let i = 0; i < particles; i++) {
    const seed = i * 1.37;
    const lifeCycle = ((time * 0.8 + seed) % 1);
    const pAngle = (i * Math.PI * 2) / particles + Math.sin(time + i) * 0.3;
    const pDist = (radius * 0.75) * (0.2 + 0.8 * ((seed * 3) % 1));
    const px = x + Math.cos(pAngle) * pDist;
    const py = y + Math.sin(pAngle) * pDist - lifeCycle * 40; // drifts upward
    const pAlpha = Math.sin(lifeCycle * Math.PI) * 0.75;
    const pSize = 1.5 + Math.sin(i + time) * 0.8;

    ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 龍神 - 被動四｜龍身：140px 龍神烈焰領域 (Flame Domain)
 * 變身期間龍身周圍伴隨炙熱龍炎領域，半徑140px
 */
export function drawLongshenFlameDomain(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number = performance.now() * 0.001,
  radius: number = 140
) {
  ctx.save();

  // 1. 底層旋轉龍神烈焰法陣 (Rotating Dragon Seal Floor Glyphs)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 0.4);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const spokes = 8;
  for (let i = 0; i < spokes; i++) {
    const ang = (i * Math.PI * 2) / spokes;
    const px = Math.cos(ang) * (radius * 0.88);
    const py = Math.sin(ang) * (radius * 0.88);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // 8 個外圈金焰菱形龍符
  for (let i = 0; i < spokes; i++) {
    const ang = (i * Math.PI * 2) / spokes + Math.PI / spokes;
    const rx = Math.cos(ang) * (radius * 0.88);
    const ry = Math.sin(ang) * (radius * 0.88);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(rx, ry - 4);
    ctx.lineTo(rx + 4, ry);
    ctx.lineTo(rx, ry + 4);
    ctx.lineTo(rx - 4, ry);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 2. 熾熱烈焰輻射漸層 (Molten Dragon Flame Core Volume)
  const pulse = Math.sin(time * 6) * 3;
  const curR = radius + pulse;
  const flameGrad = ctx.createRadialGradient(x, y, 15, x, y, curR);
  flameGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
  flameGrad.addColorStop(0.35, 'rgba(249, 115, 22, 0.22)');
  flameGrad.addColorStop(0.75, 'rgba(220, 38, 38, 0.14)');
  flameGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');

  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.arc(x, y, curR, 0, Math.PI * 2);
  ctx.fill();

  // 3. 雙層金紅烈焰外環 (Double Outer Fiery Rings)
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, curR, 0, Math.PI * 2);
  ctx.stroke();

  // 逆時針虛線微火環
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(x, y, curR - 6, -time * 1.5, -time * 1.5 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 4. 環繞騰空升騰的金紅火星 (Ascending Fire Sparks)
  const sparkCount = 10;
  for (let i = 0; i < sparkCount; i++) {
    const seed = i * 1.57;
    const progress = ((time * 1.2 + seed) % 1);
    const sAng = (i * Math.PI * 2) / sparkCount + Math.sin(time * 2 + i) * 0.4;
    const sDist = radius * (0.2 + progress * 0.75);
    const sx = x + Math.cos(sAng) * sDist;
    const sy = y + Math.sin(sAng) * sDist - progress * 24; // upward buoyant drift
    const alpha = Math.sin(progress * Math.PI) * 0.85;

    ctx.fillStyle = i % 2 === 0 ? `rgba(254, 240, 138, ${alpha})` : `rgba(249, 115, 22, ${alpha})`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 龍神 - 被動三｜龍炎：90度扇形狂暴龍炎噴射 (Dragon Flame Breath Cone)
 * 攻擊範圍：90度扇形，最大範圍 220px
 */
export function drawLongshenFlameCone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flameAngle: number,
  time: number = performance.now() * 0.001,
  range: number = 220
) {
  ctx.save();
  const halfSpread = Math.PI / 4; // 45° each side => 90° total fan
  const startAng = flameAngle - halfSpread;
  const endAng = flameAngle + halfSpread;

  // 1. 扇形烈焰底層漸層填充 (Fan Base Gradient)
  const coneGrad = ctx.createRadialGradient(x, y, 10, x, y, range);
  coneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  coneGrad.addColorStop(0.18, 'rgba(254, 240, 138, 0.55)');
  coneGrad.addColorStop(0.48, 'rgba(249, 115, 22, 0.4)');
  coneGrad.addColorStop(0.82, 'rgba(220, 38, 38, 0.25)');
  coneGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');

  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, range, startAng, endAng);
  ctx.closePath();
  ctx.fill();

  // 2. 扇形兩側與弧形外沿的金焰邊界光束 (Fiery Fan Edges)
  ctx.save();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.0;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(startAng) * range, y + Math.sin(startAng) * range);
  ctx.arc(x, y, range, startAng, endAng);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();

  // 3. 5條噴湧烈焰舌狀火柱 (Streaming Fiery Plumes within Fan)
  const tongues = 5;
  for (let t = 0; t < tongues; t++) {
    const tRatio = (t + 0.5) / tongues;
    const baseAng = startAng + tRatio * (halfSpread * 2);
    const wave = Math.sin(time * 16 + t * 2.2) * 0.08;
    const actualAng = baseAng + wave;
    const tLen = range * (0.65 + 0.35 * Math.sin(time * 12 + t * 1.8));

    const tongueGrad = ctx.createLinearGradient(
      x,
      y,
      x + Math.cos(actualAng) * tLen,
      y + Math.sin(actualAng) * tLen
    );
    tongueGrad.addColorStop(0, '#ffffff');
    tongueGrad.addColorStop(0.2, '#fef08a');
    tongueGrad.addColorStop(0.6, '#f97316');
    tongueGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.strokeStyle = tongueGrad;
    ctx.lineWidth = 4.0;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(x, y);
    const midX = x + Math.cos(actualAng) * (tLen * 0.5) + Math.sin(time * 14 + t) * 8;
    const midY = y + Math.sin(actualAng) * (tLen * 0.5) - Math.cos(time * 14 + t) * 8;
    const endX = x + Math.cos(actualAng) * tLen;
    const endY = y + Math.sin(actualAng) * tLen;
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();
  }

  // 4. 扇面前沿激突火球粒子 (Erupting Fire Embers)
  const embers = 8;
  for (let e = 0; e < embers; e++) {
    const eFrac = ((time * 2.2 + e * 0.28) % 1);
    const eAng = startAng + ((e * 1.37) % 1) * (halfSpread * 2);
    const eDist = range * (0.2 + eFrac * 0.8);
    const ex = x + Math.cos(eAng) * eDist;
    const ey = y + Math.sin(eAng) * eDist;
    const eAlpha = (1 - eFrac) * 0.9;

    ctx.fillStyle = `rgba(254, 240, 138, ${eAlpha})`;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ex, ey, 2.5 * (1 - eFrac * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 龍神 - 被動二｜龍普：近身龍爪打擊斬痕 (Dragon Strike Slash)
 */
export function drawLongshenStrikeSlash(
  ctx: CanvasRenderingContext2D,
  targetX: number,
  targetY: number,
  time: number,
  progress: number
) {
  ctx.save();
  const alpha = Math.max(0, 1 - progress);
  ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
  ctx.lineWidth = Math.max(1, 3.5 * alpha);
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 12;

  // 三道金色弧形爪刃斬痕
  for (let c = -1; c <= 1; c++) {
    const off = c * 10;
    ctx.beginPath();
    ctx.moveTo(targetX - 22, targetY + off - 18);
    ctx.quadraticCurveTo(targetX + 6, targetY + off, targetX + 26, targetY + off + 18);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 龍神 - 被動三｜龍炎：觸發前 0.5 秒半透明紅色扇形預警指示器 (Telegraph Preview Indicator)
 * - 90 度扇形前方預覽
 * - 最大半徑 220px
 * - 半透明紅色漸層扇形 + 動態警戒虛線邊界 + 充能蓄勢前緣弧
 */
export function drawLongshenFlamePreview(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  time: number,
  cooldownRemaining: number,
  range: number = 220
) {
  ctx.save();
  const halfSpread = Math.PI / 4; // 45° 各半 => 90° 扇形
  const startAng = angle - halfSpread;
  const endAng = angle + halfSpread;

  // 0.5 秒充能蓄勢進度 (0 -> 1)
  const progress = Math.max(0, Math.min(1, 1 - cooldownRemaining / 0.5));
  const pulse = 0.82 + 0.18 * Math.sin(time * 14);

  // 1. 半透明紅色扇形底色漸層 (Semi-transparent red sector fill)
  const baseAlpha = (0.15 + 0.15 * progress) * pulse;
  const sectorGrad = ctx.createRadialGradient(x, y, 8, x, y, range);
  sectorGrad.addColorStop(0, `rgba(239, 68, 68, ${baseAlpha * 1.5})`);
  sectorGrad.addColorStop(0.5, `rgba(220, 38, 38, ${baseAlpha})`);
  sectorGrad.addColorStop(0.85, `rgba(185, 28, 28, ${baseAlpha * 0.7})`);
  sectorGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');

  ctx.fillStyle = sectorGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, range, startAng, endAng);
  ctx.closePath();
  ctx.fill();

  // 2. 扇形外輪廓動態紅色警戒虛線 (Pulsing dashed warning perimeter)
  ctx.save();
  ctx.strokeStyle = `rgba(239, 68, 68, ${(0.55 + 0.35 * progress) * pulse})`;
  ctx.lineWidth = 1.8 + progress * 0.6;
  ctx.setLineDash([8, 5]);
  ctx.lineDashOffset = -time * 20;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8 + progress * 6;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(startAng) * range, y + Math.sin(startAng) * range);
  ctx.arc(x, y, range, startAng, endAng);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();

  // 3. 50% 射程輔助弧線 (110px 中距標記)
  ctx.save();
  ctx.strokeStyle = `rgba(248, 113, 113, ${0.3 * pulse})`;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(x, y, range * 0.5, startAng, endAng);
  ctx.stroke();
  ctx.restore();

  // 4. 正前方中心指向線 (Center-aim guideline)
  ctx.save();
  ctx.strokeStyle = `rgba(252, 165, 165, ${0.4 * pulse})`;
  ctx.lineWidth = 1.0;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * range, y + Math.sin(angle) * range);
  ctx.stroke();
  ctx.restore();

  // 5. 擴散充能蓄勢前緣弧 (Expanding charge wavefront)
  const chargeR = Math.max(12, range * progress);
  ctx.save();
  ctx.strokeStyle = `rgba(254, 202, 202, ${(0.6 + 0.3 * progress) * pulse})`;
  ctx.lineWidth = 2.2;
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, chargeR, startAng, endAng);
  ctx.stroke();
  ctx.restore();

  // 6. 扇形區域內微弱聚集的警戒火星 (Anticipation embers)
  const previewEmbers = 4;
  for (let i = 0; i < previewEmbers; i++) {
    const eFrac = ((time * 1.5 + i * 0.25) % 1.0);
    const eAng = startAng + ((i * 1.33 + time * 0.1) % 1.0) * (halfSpread * 2);
    const eDist = range * (0.15 + 0.75 * eFrac);
    const ex = x + Math.cos(eAng) * eDist;
    const ey = y + Math.sin(eAng) * eDist;
    const eAlpha = (1 - eFrac) * (0.4 + 0.4 * progress);

    ctx.save();
    ctx.fillStyle = `rgba(254, 202, 202, ${eAlpha})`;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(ex, ey, 1.8 * (1 - eFrac * 0.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 蜘蛛 (Zhizhu) - 被動二: 獵網束縛 (100px 直徑 / 50px 半徑 蛛網區域)
 */
export function drawSpiderWebZone(
  ctx: CanvasRenderingContext2D,
  zone: SpiderWebZone,
  time: number = performance.now() * 0.001
) {
  ctx.save();
  const radius = zone.radius || 50;
  const alpha = Math.min(1.0, zone.duration / 0.5);

  // 1. 半透明黏液毒性底層
  const groundGrad = ctx.createRadialGradient(zone.x, zone.y, 5, zone.x, zone.y, radius);
  groundGrad.addColorStop(0, `rgba(16, 185, 129, ${0.22 * alpha})`);
  groundGrad.addColorStop(0.6, `rgba(6, 78, 59, ${0.12 * alpha})`);
  groundGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = groundGrad;
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(zone.x, zone.y);

  // 2. 8條放射蛛絲錨線 (Radiating Structural Spokes)
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * alpha})`;
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 6;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.stroke();
  }

  // 3. 3圈同心八邊形黏絲 (Concentric Octagonal Sticky Rings)
  for (let ring = 1; ring <= 3; ring++) {
    const r = radius * (ring / 3.2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.65 * alpha})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const nextA = ((i + 1) * Math.PI) / 4;
      const px1 = Math.cos(a) * r;
      const py1 = Math.sin(a) * r;
      const px2 = Math.cos(nextA) * r;
      const py2 = Math.sin(nextA) * r;
      const midA = (a + nextA) / 2;
      const cpx = Math.cos(midA) * (r * 0.88);
      const cpy = Math.sin(midA) * (r * 0.88);
      if (i === 0) ctx.moveTo(px1, py1);
      ctx.quadraticCurveTo(cpx, cpy, px2, py2);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 4. 結點微小晶瑩毒露珠
  ctx.fillStyle = `rgba(16, 185, 129, ${0.9 * alpha})`;
  for (let ring = 1; ring <= 3; ring++) {
    const r = radius * (ring / 3.2);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * 蜘蛛 (Zhizhu) - 被動三: 狂暴小蜘蛛繪製 (SpiderMiniSummon)
 */
export function drawSpiderMini(
  ctx: CanvasRenderingContext2D,
  mini: SpiderMiniSummon,
  time: number = performance.now() * 0.001
) {
  if (mini.hp <= 0) return;
  ctx.save();
  ctx.translate(mini.x, mini.y);

  const speed = Math.hypot(mini.vx, mini.vy);
  const facing = speed > 1 ? Math.atan2(mini.vy, mini.vx) : 0;
  ctx.rotate(facing);

  const r = mini.radius || 7.5;

  // 1. 8隻微型快速蠕動節肢 (Mini Skittering Legs)
  const legAngles = [-0.7, -1.3, -1.9, -2.5, 0.7, 1.3, 1.9, 2.5];
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  for (let i = 0; i < legAngles.length; i++) {
    const baseA = legAngles[i];
    const walkWave = Math.sin(time * 24 + i * 1.5) * 0.25;
    const ang = baseA + walkWave;
    const side = i < 4 ? -1 : 1;
    const rootX = Math.cos(ang) * (r * 0.7);
    const rootY = Math.sin(ang) * (r * 0.7);

    const midLen = r * 0.8;
    const midX = rootX + Math.cos(ang + side * 0.4) * midLen;
    const midY = rootY + Math.sin(ang + side * 0.4) * midLen;

    const tipLen = r * 0.6;
    const tipX = midX + Math.cos(ang + side * 1.1) * tipLen;
    const tipY = midY + Math.sin(ang + side * 1.1) * tipLen;

    ctx.beginPath();
    ctx.moveTo(rootX, rootY);
    ctx.lineTo(midX, midY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
  }

  // 2. 漆黑腹部與胸部甲殼 (Thorax & Abdomen)
  // 腹部
  const abGrad = ctx.createRadialGradient(-r * 0.4, 0, 1, -r * 0.4, 0, r * 0.8);
  abGrad.addColorStop(0, '#064e3b');
  abGrad.addColorStop(0.6, '#022c22');
  abGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = abGrad;
  ctx.beginPath();
  ctx.arc(-r * 0.35, 0, r * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // 胸頭部
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(r * 0.35, 0, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. 猩紅狂暴微型複眼 (Crimson Glowing Eyes)
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(r * 0.55, -r * 0.22, 1.2, 0, Math.PI * 2);
  ctx.arc(r * 0.55, r * 0.22, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 4. 微型生命值血條 (8 HP)
  ctx.restore(); // 取消旋轉以正向繪製血條
  ctx.save();
  const barW = 16;
  const barH = 2.5;
  const barX = mini.x - barW / 2;
  const barY = mini.y - r - 5;
  const hpRatio = Math.max(0, Math.min(1, mini.hp / mini.maxHp));

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(barX, barY, barW, barH);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  ctx.restore();
}





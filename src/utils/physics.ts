import { BallState, CharacterConfig, CombatEvent, FloatingText, Particle, Projectile, LingyinsiClone, OrbitingGreenOrb, LanzuanBlueOrb, BaizuanMirrorClone, EnergyShard, MimiGrowthPack, WhiteLightEnergy, SpiderMiniSummon, SpiderWebZone, CombatPuppet } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from './audio';

export const ARENA_WIDTH = 800;
export const ARENA_HEIGHT = 520;
export const BASE_RADIUS_SCALE = 1.25; // Scales radius for great visual clarity (21 -> ~26px, 24 -> ~30px, 17 -> ~21px)

export function createInitialBall(
  id: 'p1' | 'p2',
  charConfig: CharacterConfig,
  isAi: boolean
): BallState {
  const isP1 = id === 'p1';
  const radius = charConfig.size * BASE_RADIUS_SCALE;
  const startX = isP1 ? ARENA_WIDTH * 0.28 : ARENA_WIDTH * 0.72;
  const startY = ARENA_HEIGHT * 0.5 + (isP1 ? -30 : 30);

  // Initial energetic launch velocity with slight vertical deviation
  const initialAngle = isP1 ? (Math.random() * 0.6 - 0.3) : (Math.PI + (Math.random() * 0.6 - 0.3));
  const initialSpeed = charConfig.baseSpeed * 0.85;

  return {
    id,
    characterId: charConfig.id,
    name: charConfig.name,
    x: startX,
    y: startY,
    vx: Math.cos(initialAngle) * initialSpeed,
    vy: Math.sin(initialAngle) * initialSpeed,
    radius,
    mass: charConfig.mass,
    maxHp: charConfig.maxHp,
    hp: charConfig.maxHp,
    baseAttack: charConfig.attackDamage,
    baseSpeed: charConfig.baseSpeed,
    isAi,

    // Oba Passive states
    consecutiveHits: 0,
    nextBounceSpeedMultiplier: 1.0,
    hasChargedBounce: false,

    // Huotong Passive states
    hasExplosiveBounceReady: false,
    flameShellTriggered: false,
    isHotBodyActive: false,
    huotongFlameShellCooldown: 0,
    huotongHotBodyCooldown: 0,
    huotongExplosiveCooldown: 0,

    // Hailaise Passive states
    magicEnergy: 0,
    energyBeamCooldown: 2.8, // 2.8-second auto beam timer
    hailaiseBombCooldown: 40.0, // 每40秒發射3顆紫色爆彈
    hailaiseBombVolleyHits: {},
    hailaiseShield: charConfig.id === 'hailaise' ? 50 : 0,
    hailaiseMaxShield: charConfig.id === 'hailaise' ? 50 : 0,
    hasTriggeredPossession: false,
    pendingMissilesCount: 0,
    pendingMissileDamage: 0,
    missileLaunchTimer: 0,

    // Lingyinsi Passive states
    blueArrowCooldown: 4.0, // 4-second auto blue arrow timer
    cloneCooldown: 16.0,     // 16-second auto clone timer
    clones: [],
    greenOrbsCooldown: 18.0, // 18-second auto green orbs timer
    greenOrbs: [],
    greenOrbsActive: false,
    greenOrbsOrbitAngle: 0,
    greenOrbsDuration: 0,
    greenOrbsHitTriggered: false,

    // Chanshi Passive states
    chanshiAuraCooldown: 7.0,
    chanshiAuraTimer: 0,
    chanshiAuraWaveRadius: 0,
    chanshiSuperArmorTimer: 0,
    chanshiBellShieldTimer: 0,
    chanshiGoldenBodyUsed: false,
    chanshiHealingAnimTimer: 0,
    isSlowedByChanshi: false,
    slowedByChanshiTimer: 0,

    // Huangzuan Passive states
    huangzuanLightningCooldown: 4.0, // 4-second targeted lightning cooldown
    isParalyzed: false,
    paralysisTimer: 0,
    huangzuanSpeedStacks: 0,
    huangzuanStackTimer: 0,
    huangzuanSpeedCooldown: 0,
    huangzuanFieldCooldown: 0, // Starts ready (18s after finish)
    huangzuanFieldActive: false,
    huangzuanFieldDuration: 0,
    huangzuanFieldTickTimer: 0,
    huangzuanFieldCollapseTimer: 0,

    // Lanzuan Passive states
    lanzuanWaveTickTimer: 0,
    lanzuanOrbCooldown: 0, // Starts ready at match start (12s CD after destruction)
    lanzuanOrb: null,
    lanzuanEmotionCooldown: 0, // Starts ready at match start (22s CD after burst)
    lanzuanEmotionFieldActive: false,
    lanzuanEmotionFieldDuration: 0,
    lanzuanEmotionCollapseTimer: 0,
    isSlowedByLanzuan: false,
    slowedByLanzuanTimer: 0,

    // Fenzuan Passive states
    fenzuanShieldCooldown: 0, // Starts ready (4s CD after return)
    fenzuanShieldActive: false,
    fenzuanShieldCatchAnimTimer: 0,
    fenzuanFieldCooldown: 0, // Starts ready (12s after finish)
    fenzuanFieldActive: false,
    fenzuanFieldDuration: 0,
    fenzuanFieldDamageReductionTimer: 0,
    isProtectedByFenzuanField: false,
    fenzuanBubbleCooldown: 0, // Starts ready (16s after finish)
    fenzuanBubbleActive: false,
    fenzuanBubbleDuration: 0,
    fenzuanBubbleDashTimer: 0,
    fenzuanBubbleLastTouchTime: 0,
    lastBallHitTime: 0,

    // Baizuan Passive states
    baizuanCloneCooldown: 0, // Starts ready at match start (16s CD after destruction)
    baizuanClone: null,
    baizuanShiningCooldown: 0, // Starts ready (16s CD after 5s duration)
    baizuanShiningActive: false,
    baizuanShiningDuration: 0,
    baizuanShiningTickTimer: 0,
    isBlanchedAndImmobilized: false,
    blanchedTimer: 0,
    shiningResistanceTimer: 0,
    baizuanRayCooldown: 0, // Starts ready (18s CD after 8s or impact)
    baizuanRayActive: false,
    baizuanRayDuration: 0,
    baizuanRayAngle: 0,
    baizuanRayTickTimer: 0,
    baizuanRayHitCooldown: 0,
    baizuanRayImpactTimer: 0,

    // Xukongshou Passive states (虛空獸)
    isInvulnerable: false,
    xukongshouBiteCooldown: 0, // Starts ready (10s CD after 3s bite)
    xukongshouBiteActive: false,
    xukongshouBiteDuration: 0,
    xukongshouBiteDamageTickTimer: 0,
    xukongshouBiteAngle: 0,
    xukongshouBiteRecoilTimer: 0,
    isBittenByVoidBeast: false,
    xukongshouRiftCooldown: 0, // Starts ready (20s CD after use)
    xukongshouRift: null,
    isTrappedInVoid: false,
    trappedInVoidTimer: 0,
    xukongshouHuntCooldown: 0, // Starts ready (25s CD after strike)
    xukongshouHuntLockTimer: 0,
    xukongshouHuntActive: false,
    isLockedByVoidHunt: false,
    lockedByVoidHuntTimer: 0,
    isPhantomDash: false,

    // Fan Passive states (凡)
    fanAttackCheckTimer: 1.5,
    fanHunterMarks: 0,
    fanLastHitByArrowTime: 0,
    fanRollCooldown: 0,
    fanIsRolling: false,
    fanRollDuration: 0,
    fanRollVx: 0,
    fanRollVy: 0,
    fanHasRangeBoost: false,
    fanOverclockCooldown: 0,
    fanOverclockActive: false,
    fanOverclockDuration: 0,
    fanOverclockTickTimer: 0,

    // Tunshimozu Passive states (吞噬魔族)
    growthStacks: 0,
    maxGrowthStacks: 50,
    shardSpawnTimer: 0.5,
    energyShards: [],
    gluttonyBurstCooldown: 0,
    gluttonyBurstAnimTimer: 0,
    devourImplosionAnimTimer: 0,
    collisionResistance: 0,

    // Mimi Passive states (愛心者・咪咪)
    mimiClawCooldown: 0,
    mimiClawAnimTimer: 0,
    mimiClawTargetX: undefined,
    mimiClawTargetY: undefined,
    mimiHeartCooldown: 0,
    mimiHopeSpawnTimer: 0.5,
    mimiHopeDestroyCooldown: 0,
    mimiCycleId: 0,
    mimiHasAbsorbedThisCycle: false,
    mimiLifeStacks: 0,
    mimiAttackStacks: 0,
    mimiGrowthPacks: [],
    isBleedingByMimi: false,
    bleedTimer: 0,
    bleedTickTimer: 0,
    bleedSourceId: undefined,
    isCharmedByMimi: false,
    charmedByMimiTimer: 0,
    charmedByMimiSourceId: undefined,

    // Jiandaoshou Passive states (剪刀手)
    jiandaoshouSnipCooldown: 0,
    jiandaoshouSnipAnimTimer: 0,
    jiandaoshouMistActive: false,
    jiandaoshouMistDuration: 0,
    jiandaoshouMistCooldown: 0,
    jiandaoshouNeedleCooldown: 0,
    jiandaoshouNeedlesRemaining: 0,
    jiandaoshouNeedleIntervalTimer: 0,
    jiandaoshouCoreGlowTimer: 0,
    isSlowedByNeedle: false,
    slowedByNeedleTimer: 0,

    // Dina Passive states (蒂納: 三相光環 / 白光 / 暗光 / 三相融合 / 核心之力)
    dinaWhiteLightCooldown: 0,
    dinaWhiteLightState: 'READY',
    dinaWhiteEnergies: [],
    dinaDarkLightState: 'EMPTY',
    dinaDarkLightChargeTimer: 0,
    dinaDarkLightEnergy: 0,
    dinaPerfectAbsorb: false,
    dinaBestEffectReady: false,
    dinaCurrentFusionWindow: null,
    dinaCurrentFusionEvent: null,
    dinaCorePowerCooldown: 0,
    dinaCorePowerActive: false,
    dinaCorePowerAnimTimer: 0,
    dinaCorePowerTargetDist: 220,
    dinaCorePowerDangerDist: 130,
    dinaHaloRotationAngle: 0,
    isProcessingWhiteLight: false,
    isProcessingDarkLight: false,
    isProcessingFusion: false,
    isProcessingCorePower: false,
    isDinaBurned: false,
    dinaBurnTimer: 0,
    dinaBurnInterval: 0.5,
    dinaBurnDamagePerTick: 1,
    isDinaSlowed: false,
    dinaSlowTimer: 0,
    isDinaImmobilized: false,
    dinaImmobilizeTimer: 0,

    // Jianxian Passive States (劍仙被動狀態初始化)
    jianxianOrbitSwordAngle: 0,
    jianxianBurstSwordCooldown: 0.5,
    jianxianRetreatCooldown: 0,
    jianxianRetreatAnimTimer: 0,
    isSlowedByJianxian: false,
    slowedByJianxianTimer: 0,
    jianxianArrayActive: false,
    jianxianArrayDuration: 0,
    jianxianArrayCooldown: 0,
    jianxianArrayFireTimer: 0,
    jianxianArraySecTimer: 0,
    jianxianArraySecDamage: 0,
    jianxianArrayTotalDamage: 0,

    // Longshen Passive States (龍神被動狀態初始化)
    longshenSwoopCooldown: 1.0,
    longshenSwoopActive: false,
    longshenSwoopStartX: 0,
    longshenSwoopStartY: 0,
    longshenSwoopDirX: 0,
    longshenSwoopDirY: 0,
    longshenSwoopDistTraveled: 0,
    longshenSwoopHitEnemyIds: [],
    longshenSwoopAnimTimer: 0,
    longshenStrikeCooldown: 2.0,
    longshenStrikeAnimTimer: 0,
    longshenStrikeTargetX: undefined,
    longshenStrikeTargetY: undefined,
    longshenFlameCooldown: 3.0,
    longshenFlameActive: false,
    longshenFlameDuration: 0,
    longshenFlameAngle: 0,
    longshenFlameDamageDealt: {},
    longshenFlameSecDamage: {},
    longshenFlameSecTimer: 0,
    longshenFlameTickTimer: 0,
    longshenFormCooldown: 5.0,
    longshenFormActive: false,
    longshenFormDuration: 0,
    longshenFormWingPhase: 0,
    longshenFormDamageDealt: {},
    longshenFormTickTimer: 0,
    longshenAweTimer: 0,
    longshenSlowTimer: 0,
    longshenBurnTimer: 0,

    // Zhizhu Passive States (蜘蛛被動狀態初始化)
    spiderVenomFangCooldown: 0.5,
    spiderVenomFangAnimTimer: 0,
    spiderPoisonMarkTimer: 0,
    spiderPoisonTickTimer: 0,
    spiderWebCooldown: 1.0,
    spiderWebZones: [],
    spiderSwarmCooldown: 2.0,
    spiderMiniSummons: [],
    spiderBurstCooldown: 3.0,
    spiderBurstAnimTimer: 0,
    spiderHitByMiniCount: 0,
    isSlowedBySpiderWeb: false,
    slowedBySpiderWebTimer: 0,

    // Xin Passive states (辛: 雙相魔劍 / 逐影破陣 / 裂空劍痕 / 雙相魔劍)
    xinLevel: 1,
    xinExp: 0,
    xinForm: 'balance',
    xinFormEnergy: 100,
    xinFormCycleTimer: 0,
    xinNextForm: 'light',
    xinSkySlashCooldown: 11.0,
    xinSkySlashChargeTimer: 0,
    xinSkySlashAimAngle: undefined,
    xinSkySlashTargetX: undefined,
    xinSkySlashTargetY: undefined,
    xinShadowDashCooldown: 6.5,
    xinShadowDashChargeTimer: 0,
    xinShadowDashing: false,
    xinShadowDashStartX: 0,
    xinShadowDashStartY: 0,
    xinShadowDashDirX: 0,
    xinShadowDashDirY: 0,
    xinShadowDashDistTraveled: 0,
    xinShadowDashHitIds: [],
    xinShadowDashAnimTimer: 0,
    xinBasicAttackCooldown: 1.4,
    xinBasicSlashAnimTimer: 0,
    xinLockAimAngle: undefined,
    xinLockTargetId: undefined,
    xinLockTargetDist: undefined,
    xinLockSkillType: null,
    xinSwordOrbitAngle: 0,
    xinShieldAmount: 0,
    xinDarkAtkSpeedBoost: false,
    xinExpAbsorbTimer: 0,
    xinUpgradeAnimTimer: 0,
    xinSwordVibrate: 0,

    // Kuileishi Passive states (傀儡師被動技能狀態)
    puppets: [],
    puppetSummonCooldown: 2.0,
    puppetResonance: 0,
    puppetResonanceDecayTimer: 8.0,
    puppetTetherCooldown: 1.5,
    puppetTetherAnimTimer: 0,
    puppetAegisTimer: 0,
    puppetSubstituteCooldown: 0,
    puppetFinaleCooldown: 5.0,
    puppetFinaleStandby: false,
    isTetheredByPuppeteer: false,
    tetheredByPuppeteerTimer: 0,

    // Yinyong Passive states (一拳尹雄被動技能狀態)
    yinyongState: 'SEARCHING',
    yinyongChargeTimer: 0,
    yinyongMaxCharge: 22.0,
    yinyongLockedTargetId: null,
    yinyongSearchTimer: 0.8,
    yinyongDeclareTimer: 0,
    yinyongPunchAnimTimer: 0,
    yinyongMissAnimTimer: 0,
    yinyongSuccessCooldown: 0,
    yinyongFailRecoveryTimer: 0,
    yinyongAfterimageTimer: 0,
    yinyongAfterimageX: 0,
    yinyongAfterimageY: 0,
    yinyongFacingAngle: 0,
    yinyongPunchHitboxX: 0,
    yinyongPunchHitboxY: 0,
    yinyongPunchHitboxRadius: 28,
    yinyongPunchExecuted: false,
    yinyongImmortalCheckTimer: 2.0,
    yinyongImmortalCooldown: 0,
    yinyongImmortalAnimTimer: 0,
    yinyongRageStacks: 0,
    yinyongBoundlessActive: false,
    yinyongBoundlessDuration: 0,
    yinyongBoundlessUsed: false,
    yinyongBoundlessCollapseTimer: 0,

    // Manyaiya (Junko) Passive states (曼麥亞・軍子被動技能狀態)
    junkoMemoryFragments: {},
    junkoEyeAwakened: false,
    junkoEyeAwakenTimer: 0,
    junkoAwakenBonusReady: false,
    junkoAwakenCooldowns: {},
    junkoArrowCooldown: 1.0,
    junkoTetherCooldown: 2.0,
    junkoHolyKnightActive: false,
    junkoHolyKnightDuration: 0,
    junkoHolyKnightCooldown: 8.0,
    junkoKnightKills: 0,
    junkoDashesRemaining: 0,
    junkoTotalDashesUsedInForm: 0,
    junkoIsDashing: false,
    junkoDashTimer: 0,
    junkoDashStartX: 0,
    junkoDashStartY: 0,
    junkoDashTargetX: 0,
    junkoDashTargetY: 0,
    junkoDashAngle: 0,
    junkoDashHitTargets: {},
    junkoTetherPulling: false,
    junkoTetherPullTimer: 0,
    junkoTetherTargetX: 0,
    junkoTetherTargetY: 0,
    junkoLiberationAnimTimer: 0,
    junkoVulnerableStacks: 0,

    // Energy & Combat Techniques System (能量與戰鬥技巧系統)
    energy: 50,
    maxEnergy: 100,
    energyRegen: 7.0,
    isOverdrive: false,
    overdriveTimer: 0,
    lastGrazeTime: 0,
    lastWallEnergyTime: 0,
    tacticalShieldTimer: 0,
    tacticalDashTimer: 0,
    tacticalCooldown: 0,
    energyDepletedPromptTimer: 0,

    // Detailed Stats for Combat Analytics
    damageDealt: 0,
    damageTaken: 0,
    healingDone: 0,
    shieldAbsorbed: 0,
    damageMitigated: 0,
    peakHitDamage: 0,
    hitsDealt: 0,
    hitsReceived: 0,

    // Diverse Damage Types Breakdown
    physicalDamageDealt: 0,
    magicDamageDealt: 0,
    flameDamageDealt: 0,
    trueDamageDealt: 0,
    poisonDamageDealt: 0,
    bleedDamageDealt: 0,
    collisionDamageDealt: 0,
    skillDamageDealt: 0,

    passive1Triggers: 0,
    passive2Triggers: 0,
    passive3Triggers: 0,
    passive4Triggers: 0,

    trail: []
  };
}

export interface PhysicsStepResult {
  p1: BallState;
  p2: BallState;
  projectiles: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  combatEvents: CombatEvent[];
  winner: 'p1' | 'p2' | null;
}

export function updatePhysics(
  p1: BallState,
  p2: BallState,
  projectiles: Projectile[],
  dt: number,
  p1InputVector: { x: number; y: number } | null,
  p2InputVector: { x: number; y: number } | null,
  matchTime: number
): PhysicsStepResult {
  const newParticles: Particle[] = [];
  const newFloatingTexts: FloatingText[] = [];
  const newEvents: CombatEvent[] = [];
  let currentProjectiles: Projectile[] = projectiles.map(p => ({
    ...p,
    trail: [...(p.trail || [])]
  }));

  // Deep clone states
  const b1: BallState = {
    ...p1,
    clones: p1.clones.map(c => ({ ...c })),
    greenOrbs: p1.greenOrbs.map(o => ({ ...o })),
    lanzuanOrb: p1.lanzuanOrb ? { ...p1.lanzuanOrb } : null,
    baizuanClone: p1.baizuanClone ? { ...p1.baizuanClone } : null,
    mimiGrowthPacks: p1.mimiGrowthPacks ? p1.mimiGrowthPacks.map(pk => ({ ...pk })) : [],
    puppets: p1.puppets ? p1.puppets.map(pup => ({ ...pup })) : [],
    trail: [...p1.trail]
  };
  const b2: BallState = {
    ...p2,
    clones: p2.clones.map(c => ({ ...c })),
    greenOrbs: p2.greenOrbs.map(o => ({ ...o })),
    lanzuanOrb: p2.lanzuanOrb ? { ...p2.lanzuanOrb } : null,
    baizuanClone: p2.baizuanClone ? { ...p2.baizuanClone } : null,
    mimiGrowthPacks: p2.mimiGrowthPacks ? p2.mimiGrowthPacks.map(pk => ({ ...pk })) : [],
    puppets: p2.puppets ? p2.puppets.map(pup => ({ ...pup })) : [],
    trail: [...p2.trail]
  };

  // Sub-stepping to ensure zero tunneling and extreme stability (4 sub-steps per frame)
  const SUB_STEPS = 4;
  const subDt = dt / SUB_STEPS;

  for (let step = 0; step < SUB_STEPS; step++) {
    const currentSubTime = matchTime + step * subDt;

    // 0. Energy regeneration & Autonomous Combat Tactics
    updateBallEnergyAndTactics(b1, b2, subDt, currentSubTime, newFloatingTexts, newEvents, newParticles);
    updateBallEnergyAndTactics(b2, b1, subDt, currentSubTime, newFloatingTexts, newEvents, newParticles);

    // 1. Steering & AI behavior
    applySteering(b1, b2, p1InputVector, subDt, currentSubTime);
    applySteering(b2, b1, p2InputVector, subDt, currentSubTime);

    // 2. Movement integration
    b1.x += b1.vx * subDt;
    b1.y += b1.vy * subDt;
    b2.x += b2.vx * subDt;
    b2.y += b2.vy * subDt;

    // Check Hot Body state & tick cooldowns for Huotong
    const b1Speed = Math.hypot(b1.vx, b1.vy);
    const b2Speed = Math.hypot(b2.vx, b2.vy);
    if (b1.characterId === 'huotong') {
      if (b1.huotongFlameShellCooldown > 0) b1.huotongFlameShellCooldown = Math.max(0, b1.huotongFlameShellCooldown - subDt);
      if (b1.huotongHotBodyCooldown > 0) b1.huotongHotBodyCooldown = Math.max(0, b1.huotongHotBodyCooldown - subDt);
      if (b1.huotongExplosiveCooldown > 0) b1.huotongExplosiveCooldown = Math.max(0, b1.huotongExplosiveCooldown - subDt);
      b1.isHotBodyActive = b1Speed >= 160 && b1.huotongHotBodyCooldown <= 0;
    }
    if (b2.characterId === 'huotong') {
      if (b2.huotongFlameShellCooldown > 0) b2.huotongFlameShellCooldown = Math.max(0, b2.huotongFlameShellCooldown - subDt);
      if (b2.huotongHotBodyCooldown > 0) b2.huotongHotBodyCooldown = Math.max(0, b2.huotongHotBodyCooldown - subDt);
      if (b2.huotongExplosiveCooldown > 0) b2.huotongExplosiveCooldown = Math.max(0, b2.huotongExplosiveCooldown - subDt);
      b2.isHotBodyActive = b2Speed >= 160 && b2.huotongHotBodyCooldown <= 0;
    }

    // 3. Wall boundaries collision
    handleWallCollision(b1, newParticles, currentSubTime, newFloatingTexts, newEvents);
    handleWallCollision(b2, newParticles, currentSubTime, newFloatingTexts, newEvents);

    // 3.5 Check Xukongshou Passive 1 (Void Beast Bite 10s CD, 3s duration, invulnerable)
    // Runs BEFORE Circle-Circle collision so Void Beast immediately clamps enemy and prevents collision damage
    updateXukongshouBitePassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateXukongshouBitePassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 4. Circle-Circle collision check & resolution (Main Ball vs Main Ball)
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const dist = Math.hypot(dx, dy);
    const minDist = b1.radius + b2.radius;

    // 虛空獸咬住敵人期間：只會造成咬著傷害，絕對不觸發碰撞傷害及彈力碰撞分離
    const isVoidBitingActive =
      b1.xukongshouBiteActive ||
      b2.xukongshouBiteActive ||
      b1.isBittenByVoidBeast ||
      b2.isBittenByVoidBeast ||
      (b1.xukongshouBiteRecoilTimer && b1.xukongshouBiteRecoilTimer > 0) ||
      (b2.xukongshouBiteRecoilTimer && b2.xukongshouBiteRecoilTimer > 0);

    if (dist < minDist && dist > 0.001 && !isVoidBitingActive) {
      const nx = dx / dist;
      const ny = dy / dist;

      // Positional separation
      const overlap = minDist - dist;
      const totalMass = b1.mass + b2.mass;
      const b1Charging = b1.characterId === 'yinyong' && b1.yinyongState === 'CHARGING';
      const b2Charging = b2.characterId === 'yinyong' && b2.yinyongState === 'CHARGING';
      if (b1Charging && !b2Charging) {
        b2.x += nx * overlap;
        b2.y += ny * overlap;
      } else if (!b1Charging && b2Charging) {
        b1.x -= nx * overlap;
        b1.y -= ny * overlap;
      } else {
        b1.x -= nx * (overlap * (b2.mass / totalMass));
        b1.y -= ny * (overlap * (b2.mass / totalMass));
        b2.x += nx * (overlap * (b1.mass / totalMass));
        b2.y += ny * (overlap * (b1.mass / totalMass));
      }

      // Relative velocity
      const rvx = b2.vx - b1.vx;
      const rvy = b2.vy - b1.vy;
      const velAlongNormal = rvx * nx + rvy * ny;

      // Tangent vector for glancing deflection
      const tx = -ny;
      const ty = nx;
      const velAlongTangent = rvx * tx + rvy * ty;

      if (velAlongNormal < 0) {
        const impactSpeed = Math.abs(velAlongNormal);

        // 戰鬥技巧: 極限拼刀 (Clash Parry on high-speed mutual collision)
        if (impactSpeed >= 220) {
          const clashEnergy = 15;
          b1.energy = Math.min(b1.maxEnergy || 100, (b1.energy || 0) + clashEnergy);
          b2.energy = Math.min(b2.maxEnergy || 100, (b2.energy || 0) + clashEnergy);
          soundEngine.playClashParry();
          const clashTopY = Math.min(b1.y - b1.radius, b2.y - b2.radius) - 20;
          const clashSideX = (b1.x + b2.x) / 2 + ((b1.x > b2.x) ? 24 : -24);
          newFloatingTexts.push({
            id: `fct_clash_${Math.random()}`,
            x: clashSideX,
            y: clashTopY,
            text: `極限拼刀 +${clashEnergy}`,
            color: '#facc15',
            fontSize: 13,
            scale: 1.2,
            shakeIntensity: 8,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -22,
            damageType: 'energy',
            damageValue: clashEnergy
          });
          newEvents.push({
            id: `evt_clash_${Math.random()}`,
            timestamp: currentSubTime,
            type: 'energy_technique',
            attackerId: b1.id,
            targetId: b2.id,
            text: `【極限拼刀】${b1.name} 與 ${b2.name} 高速對撞！各自獲得 +${clashEnergy} 能量！`,
            badge: '極限拼刀'
          });
        }

        let restitution = 0.95;

        // Apply Oba Passive 2 (蓄力反彈: boost next bounce speed by 25%)
        let b1BounceMultiplier = 1.0;
        let b2BounceMultiplier = 1.0;

        if (b1.characterId === 'oba' && b1.hasChargedBounce) {
          if (tryConsumeEnergy(b1, 15, '蓄力反彈', newFloatingTexts, newEvents)) {
            b1BounceMultiplier = 1.25;
            b1.passive2Triggers++;
            soundEngine.playReboundBoost();
          }
          b1.hasChargedBounce = false;
        }
        if (b2.characterId === 'oba' && b2.hasChargedBounce) {
          if (tryConsumeEnergy(b2, 15, '蓄力反彈', newFloatingTexts, newEvents)) {
            b2BounceMultiplier = 1.25;
            b2.passive2Triggers++;
            soundEngine.playReboundBoost();
          }
          b2.hasChargedBounce = false;
        }

        // ==========================================
        // 核心回擊向量計算 (Recoil Vector Calculation Based on Mass Difference)
        // ==========================================
        // 計算兩球品質差與相對比例
        const massDiff = b1.mass - b2.mass; // 正數代表 b1 比 b2 重
        const normalizedDiff = massDiff / totalMass; // 範圍約 [-0.35, +0.35]
        const massRatio1 = b2.mass / b1.mass;
        const massRatio2 = b1.mass / b2.mass;

        // 戲劇性回擊衝量乘數 (Dramatic Knockback Factors)
        // 重球碰撞輕球時：輕球遭受劇烈回擊向量擊飛，重球則保有強大慣性向前推進
        // 輕球碰撞重球時：輕球受反作用力被猛烈回彈
        let recoilFactor1 = 1.0;
        let recoilFactor2 = 1.0;

        if (massDiff > 0) {
          // b1 較重，b2 較輕
          recoilFactor1 = Math.max(0.38, 1.0 - normalizedDiff * 1.5);
          recoilFactor2 = 1.0 + normalizedDiff * 2.2 + Math.max(0, massRatio2 - 1.0) * 0.4;
        } else if (massDiff < 0) {
          // b1 較輕，b2 較重
          recoilFactor1 = 1.0 + Math.abs(normalizedDiff) * 2.2 + Math.max(0, massRatio1 - 1.0) * 0.4;
          recoilFactor2 = Math.max(0.38, 1.0 - Math.abs(normalizedDiff) * 1.5);
        }

        // 基礎法向彈性衝量
        const baseImpulse = (-(1 + restitution) * velAlongNormal) / (1 / b1.mass + 1 / b2.mass);

        // 法向回擊衝量標量 (Normal Recoil Magnitudes)
        let normalRecoil1 = (baseImpulse / b1.mass) * b1BounceMultiplier * recoilFactor1;
        let normalRecoil2 = (baseImpulse / b2.mass) * b2BounceMultiplier * recoilFactor2;

        // 切向偏轉回擊 (Glancing Recoil Deflection): 依品質差將角動量傳遞給較輕一方
        const glanceScale = 0.28;
        const tangRecoil1 = -velAlongTangent * glanceScale * (b2.mass / totalMass);
        const tangRecoil2 = velAlongTangent * glanceScale * (b1.mass / totalMass);

        // 劇烈碰撞速度門檻追加動態爆發衝量 (Dramatic Kinetic Surge)
        if (impactSpeed >= 135 && Math.abs(massDiff) >= 0.15) {
          const surgeForce = Math.min(impactSpeed / 190, 1.6) * Math.abs(normalizedDiff) * 60;
          if (b1.mass < b2.mass) {
            normalRecoil1 += surgeForce;
          } else {
            normalRecoil2 += surgeForce;
          }
        }

        // 依品質差合成完整的「回擊向量」(Recoil Vectors)
        let recoil1X = -nx * normalRecoil1 + tx * tangRecoil1;
        let recoil1Y = -ny * normalRecoil1 + ty * tangRecoil1;
        let recoil2X = nx * normalRecoil2 + tx * tangRecoil2;
        let recoil2Y = ny * normalRecoil2 + ty * tangRecoil2;

        // 禪師金鐘罩霸體判定：霸體期間免疫 85% 擊退回擊
        if (b1.chanshiSuperArmorTimer > 0) {
          recoil1X *= 0.15;
          recoil1Y *= 0.15;
        }
        if (b2.chanshiSuperArmorTimer > 0) {
          recoil2X *= 0.15;
          recoil2Y *= 0.15;
        }

        // 火桶滾燙桶身加持額外回擊撞擊力
        if (b1.characterId === 'huotong' && b1.isHotBodyActive) {
          recoil2X += nx * 32;
          recoil2Y += ny * 32;
        }
        if (b2.characterId === 'huotong' && b2.isHotBodyActive) {
          recoil1X -= nx * 32;
          recoil1Y -= ny * 32;
        }

        // 注入回擊向量至兩球瞬時速度
        b1.vx += recoil1X;
        b1.vy += recoil1Y;
        b2.vx += recoil2X;
        b2.vy += recoil2Y;

        // 速度極限平滑限制 (防止極端疊加穿透邊界)
        const maxVelocityCap = 680;
        const currentSpeed1 = Math.hypot(b1.vx, b1.vy);
        if (currentSpeed1 > maxVelocityCap) {
          b1.vx = (b1.vx / currentSpeed1) * maxVelocityCap;
          b1.vy = (b1.vy / currentSpeed1) * maxVelocityCap;
        }
        const currentSpeed2 = Math.hypot(b2.vx, b2.vy);
        if (currentSpeed2 > maxVelocityCap) {
          b2.vx = (b2.vx / currentSpeed2) * maxVelocityCap;
          b2.vy = (b2.vy / currentSpeed2) * maxVelocityCap;
        }

        // 一拳尹雄：蓄力期間牢牢釘立原地，完全吸收並抵銷碰撞衝量
        if (b1.characterId === 'yinyong' && b1.yinyongState === 'CHARGING') {
          b1.vx = 0;
          b1.vy = 0;
        }
        if (b2.characterId === 'yinyong' && b2.yinyongState === 'CHARGING') {
          b2.vx = 0;
          b2.vy = 0;
        }

        // Set Oba Passive 2 ready state for NEXT bounce when hit
        if (b1.characterId === 'oba') {
          b1.hasChargedBounce = true;
        }
        if (b2.characterId === 'oba') {
          b2.hasChargedBounce = true;
        }

        // Set Huotong Passive 3 ready state (爆燃反彈, 需冷卻就緒)
        if (b1.characterId === 'huotong' && impactSpeed >= 140 && (b1.huotongExplosiveCooldown <= 0)) {
          b1.hasExplosiveBounceReady = true;
        }
        if (b2.characterId === 'huotong' && impactSpeed >= 140 && (b2.huotongExplosiveCooldown <= 0)) {
          b2.hasExplosiveBounceReady = true;
        }

        // --- DAMAGE CALCULATION & PASSIVE SKILL TRIGGERS ---
        const collisionX = b1.x + nx * b1.radius;
        const collisionY = b1.y + ny * b1.radius;

        // Throttle collision combat damage so multi-step physics doesn't cause damage numbers or sounds to explode
        const canTriggerBallCollisionDamage = matchTime - (b1.lastBallHitTime || 0) >= 0.20;
        if (canTriggerBallCollisionDamage) {
          b1.lastBallHitTime = matchTime;
          b2.lastBallHitTime = matchTime;

          // Process Ball 1 attacking Ball 2
          processCollisionDamage(
            b1,
            b2,
            collisionX,
            collisionY,
            matchTime,
            newFloatingTexts,
            newEvents,
            newParticles
          );

          // Process Ball 2 attacking Ball 1
          processCollisionDamage(
            b2,
            b1,
            collisionX,
            collisionY,
            matchTime,
            newFloatingTexts,
            newEvents,
            newParticles
          );

          spawnImpactParticles(collisionX, collisionY, impactSpeed, newParticles);
          spawnCollisionStreaks(collisionX, collisionY, nx, ny, impactSpeed, b1, b2, newParticles);

          // 辛 - 重裝戰士碰撞極短暫半透明殘影與金屬破片 (不影響碰撞體積)
          if (b1.characterId === 'xin') {
            spawnXinCollisionEffects(b1, impactSpeed, collisionX, collisionY, nx, ny, newParticles);
          }
          if (b2.characterId === 'xin') {
            spawnXinCollisionEffects(b2, impactSpeed, collisionX, collisionY, -nx, -ny, newParticles);
          }
          
          // 品質差劇烈碰撞震波特效 (Mass-Disparity Impact Shockwave)
          if (Math.abs(massDiff) >= 0.20 && impactSpeed >= 110) {
            newParticles.push({
              x: collisionX,
              y: collisionY,
              vx: nx * (massDiff > 0 ? 1 : -1) * 40,
              vy: ny * (massDiff > 0 ? 1 : -1) * 40,
              radius: 14 + Math.abs(massDiff) * 22,
              color: massDiff > 0 ? '#f59e0b' : '#38bdf8',
              alpha: 0.85,
              maxLife: 0.26,
              life: 0.26,
              type: 'shockwave'
            });
          }

          soundEngine.playCollision(Math.min(impactSpeed / 250, 1.5));
        }
      }
    }

    // 5. Check Lingyinsi Clones vs Enemy Ball Collisions
    handleCloneBallCollisions(b1, b2, newFloatingTexts, newEvents, newParticles);
    handleCloneBallCollisions(b2, b1, newFloatingTexts, newEvents, newParticles);

    // 5.1 Check Lanzuan Blue Orb vs Enemy Ball Collisions
    handleLanzuanOrbCollisions(b1, b2, matchTime, newFloatingTexts, newEvents, newParticles);
    handleLanzuanOrbCollisions(b2, b1, matchTime, newFloatingTexts, newEvents, newParticles);

    // 5.2 Check Baizuan Mirror Clone vs Enemy Ball Collisions
    handleBaizuanCloneCollisions(b1, b2, matchTime, newFloatingTexts, newEvents, newParticles);
    handleBaizuanCloneCollisions(b2, b1, matchTime, newFloatingTexts, newEvents, newParticles);

    // 6. Check Hailaise Passive 2 (7s Periodic Purple Energy Beam)
    updateHailaiseBeamTrigger(b1, b2, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateHailaiseBeamTrigger(b2, b1, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 7. Check Hailaise Passive 3 (每40秒發射3顆紫色爆彈非指定性技能)
    updateHailaiseBombTrigger(b1, b2, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateHailaiseBombTrigger(b2, b1, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 8. Check Lingyinsi Passive 1 (5s Psionic Blue Light Arrow Sync Fire)
    updateLingyinsiBlueArrowTrigger(b1, b2, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateLingyinsiBlueArrowTrigger(b2, b1, subDt, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 9. Check Lingyinsi Passive 2 (25s Clone Summon)
    updateLingyinsiCloneSummonTrigger(b1, subDt, newFloatingTexts, newEvents, newParticles);
    updateLingyinsiCloneSummonTrigger(b2, subDt, newFloatingTexts, newEvents, newParticles);

    // 10. Check Lingyinsi Passive 3 (25s Orbiting Green Orbs)
    updateLingyinsiGreenOrbsTrigger(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateLingyinsiGreenOrbsTrigger(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 11. Check Chanshi Passive 1 (8s Imprisoning Aura, 100px radius, 30% slow)
    updateChanshiAuraTrigger(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateChanshiAuraTrigger(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 12. Check Chanshi Passive 3 (Low-HP < 30% Golden Body Recovery)
    updateChanshiGoldenBodyRecovery(b1, matchTime, newFloatingTexts, newEvents, newParticles);
    updateChanshiGoldenBodyRecovery(b2, matchTime, newFloatingTexts, newEvents, newParticles);

    // 13. Update Chanshi Timers (Super Armor, Bell Shield, Healing Anim)
    updateChanshiTimers(b1, subDt);
    updateChanshiTimers(b2, subDt);

    // 14. Check Huangzuan Passive 1 (5s Targeted Lightning)
    updateHuangzuanTargetedLightning(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateHuangzuanTargetedLightning(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 15. Check Huangzuan Passive 2 (Speed Stacks Accumulation every 2s, max 10)
    updateHuangzuanSpeedPassive(b1, subDt, newParticles);
    updateHuangzuanSpeedPassive(b2, subDt, newParticles);

    // 16. Check Huangzuan Passive 3 (3.5s Lightning Field every 30s)
    updateHuangzuanFieldPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateHuangzuanFieldPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 17. Update Huangzuan General Timers (Paralysis, Collapse)
    updateHuangzuanTimers(b1, subDt, newParticles);
    updateHuangzuanTimers(b2, subDt, newParticles);

    // 18. Check Lanzuan Passive 1 (Constant Blue Wavelength 110px AoE, 0.5s tick 1 magic damage)
    updateLanzuanWavelengthPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateLanzuanWavelengthPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 19. Check Lanzuan Passive 2 (20s Blue Orb Summon & 2s Laser Beam Auto-Fire)
    updateLanzuanBlueOrbPassive(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateLanzuanBlueOrbPassive(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 20. Check Lanzuan Passive 3 (40s Blue Emotion Field 140px, 3.5s slow, 25 magic burst)
    updateLanzuanEmotionPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateLanzuanEmotionPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 21. Update Lanzuan Timers (Slow status decay, Collapse animations)
    updateLanzuanTimers(b1, subDt);
    updateLanzuanTimers(b2, subDt);

    // 22. Check Fenzuan Passive 1 (Pink Shield 150px linear skillshot, 5s CD after return)
    updateFenzuanShieldPassive(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateFenzuanShieldPassive(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 23. Check Fenzuan Passive 2 (Pink Damage Reduction Field 85px radius, 5s duration, 15s CD)
    updateFenzuanFieldPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateFenzuanFieldPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 24. Check Fenzuan Passive 3 (Bubble Spikes 10s duration, 30s CD, random dashes)
    updateFenzuanBubblePassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateFenzuanBubblePassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 25. Update Fenzuan Timers
    updateFenzuanTimers(b1, subDt);
    updateFenzuanTimers(b2, subDt);

    // 26. Check Baizuan Passive 1 (Mirror Clone 20s CD, 15s duration, 2 HP, mimics enemy skill 1 with 50% effectiveness)
    updateBaizuanMirrorClonePassive(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateBaizuanMirrorClonePassive(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 27. Check Baizuan Passive 2 (Shining 20s CD, 5s duration, stops movement, 1.5s blanch stun, 1 magic dmg/s)
    updateBaizuanShiningPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateBaizuanShiningPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 28. Check Baizuan Passive 3 (White Death Ray 40s CD, 8s duration, 300px beam, 1.5 magic dmg/s, 1.5 impact damage)
    updateBaizuanDeathRayPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateBaizuanDeathRayPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 29. Update Baizuan Timers (Blanch & Immobilize duration, Shining resistance)
    updateBaizuanTimers(b1, b2, subDt);
    updateBaizuanTimers(b2, b1, subDt);

    // 31. Check Xukongshou Passive 2 (Void Rift 20s CD, teleport entrance/exit, trap enemy 2s)
    updateXukongshouRiftPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateXukongshouRiftPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 32. Check Xukongshou Passive 3 (Void Hunt 25s CD, 3s lock, 20 dmg phantom dash)
    updateXukongshouHuntPassive(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateXukongshouHuntPassive(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 33. Update Xukongshou Timers (trapped in void, locked target)
    updateXukongshouTimers(b1, subDt);
    updateXukongshouTimers(b2, subDt);

    // 33.5. Check Fan Passive Skills (凡: 獵手本性, 翻滾預知, 超速強化)
    updateFanPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateFanPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.6. Check Tunshimozu Passive Skills (吞噬魔族: 吞噬, 魔軀成長, 暴食魔爆)
    updateTunshimozuPassiveSkills(b1, b2, subDt, matchTime, newFloatingTexts, newEvents, newParticles);
    updateTunshimozuPassiveSkills(b2, b1, subDt, matchTime, newFloatingTexts, newEvents, newParticles);

    // 33.7. Check Mimi Passive Skills (愛心者・咪咪: 貓咪衝爪, 愛心飛射, 咪咪希望)
    updateMimiPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateMimiPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.8. Check Jiandaoshou Passive Skills (剪刀手: 剪裁之術, 聖霧守護, 聖針連射)
    updateJiandaoshouPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateJiandaoshouPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.9. Check Dina Passive Skills (蒂納: 白光發射, 暗光蓄力, 三相融合, 核心之力)
    updateDinaPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateDinaPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.10. Check Jianxian Passive Skills (劍仙: 白劍爆裂, 退劍緩行, 百萬劍陣)
    updateJianxianPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateJianxianPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.11. Check Longshen Passive Skills (龍神: 龍搖, 龍普, 龍炎, 龍身)
    updateLongshenPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateLongshenPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.12. Check Spider Passive Skills (蜘蛛: 毒牙印記, 獵網束縛, 蛛群獵殺, 蛛后毒爆)
    updateSpiderPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateSpiderPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.13. Check Xin Passive Skills (辛: 魔劍普攻, 逐影破陣, 裂空劍痕, 雙相魔劍)
    updateXinPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateXinPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.14. Check Kuileishi Passive Skills (傀儡師: 傀儡召喚, 牽線束縛, 傀儡共鳴, 木偶終幕)
    updateKuileishiPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateKuileishiPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.15. Check Yinyong Passive Skills (一拳尹雄: 尹雄一拳, 不死之血, 越挫越勇, 一拳無界)
    updateYinyongPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateYinyongPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 33.16. Check Manyaiya (Junko) Passive Skills (曼麥亞・軍子: 異瞳殘憶, 白縛神箭, 聖帶縛界, 弒國終章)
    updateManyaiyaPassiveSkills(b1, b2, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);
    updateManyaiyaPassiveSkills(b2, b1, subDt, matchTime, currentProjectiles, newFloatingTexts, newEvents, newParticles);

    // 34. Update Active Projectiles in flight (including collisions with Balls and Clones)
    currentProjectiles = updateProjectiles(
      currentProjectiles,
      b1,
      b2,
      subDt,
      matchTime,
      newFloatingTexts,
      newEvents,
      newParticles
    );
  }

  // Update visual trails
  updateBallTrail(b1);
  updateBallTrail(b2);

  // Check victory / death condition
  let winner: 'p1' | 'p2' | null = null;
  if (b1.hp <= 0 && b2.hp <= 0) {
    winner = b1.hp > b2.hp ? 'p1' : 'p2';
    if (b1.hp === b2.hp) winner = 'p1';
  } else if (b1.hp <= 0) {
    b1.hp = 0;
    winner = 'p2';
  } else if (b2.hp <= 0) {
    b2.hp = 0;
    winner = 'p1';
  }

  return {
    p1: b1,
    p2: b2,
    projectiles: currentProjectiles,
    particles: newParticles,
    floatingTexts: newFloatingTexts,
    combatEvents: newEvents,
    winner
  };
}

/**
 * Handle AI or Player steering forces
 */
function applySteering(
  self: BallState,
  target: BallState,
  inputVector: { x: number; y: number } | null,
  dt: number,
  subTime: number
) {
  // If bitten by Void Beast, target is trapped in jaws and cannot steer
  if (self.isBittenByVoidBeast) {
    self.vx = 0;
    self.vy = 0;
    return;
  }

  // 一拳尹雄：蓄力期間原地聚氣，完全消除位移與轉向，牢牢釘立原地
  if (self.characterId === 'yinyong' && self.yinyongState === 'CHARGING') {
    self.vx = 0;
    self.vy = 0;
    return;
  }

  // If paralyzed (e.g. hit by Huangzuan Passive 1), completely stop movement for 0.5s
  if (self.isParalyzed && self.paralysisTimer > 0) {
    self.vx = 0;
    self.vy = 0;
    return;
  }

  // If Fan is actively rolling (翻滾位移中), maintain roll velocity and skip steering
  if (self.characterId === 'fan' && self.fanIsRolling) {
    return;
  }

  // If Longshen is actively swooping (龍神【龍搖】俯衝中), maintain swoop velocity and skip steering
  if (self.characterId === 'longshen' && self.longshenSwoopActive) {
    return;
  }

  // If Immobilized by Dina Fusion (蒂納三相融合定身: 無法主動位移)
  if (self.isDinaImmobilized && (self.dinaImmobilizeTimer ?? 0) > 0) {
    self.vx *= 0.85;
    self.vy *= 0.85;
    return;
  }

  // If Charmed by Mimi, target is enamored and pulled toward the caster with dreamy motion
  if (self.isCharmedByMimi && (self.charmedByMimiTimer ?? 0) > 0) {
    const caster = self.charmedByMimiSourceId === target.id ? target : self;
    const toCasterX = caster.x - self.x;
    const toCasterY = caster.y - self.y;
    const distToCaster = Math.hypot(toCasterX, toCasterY);
    if (distToCaster > 20) {
      const charmPullSpeed = 85;
      self.vx = (toCasterX / distToCaster) * charmPullSpeed;
      self.vy = (toCasterY / distToCaster) * charmPullSpeed;
    }
    return;
  }

  let steerX = 0;
  let steerY = 0;

  if (self.isAi || !inputVector || (inputVector.x === 0 && inputVector.y === 0)) {
    const seed = self.id === 'p1' ? 1.45 : 4.82;
    const wanderAngle = (subTime * 1.6 + seed) + Math.sin(subTime * 2.8 + seed * 2.2) * 1.35;
    const wanderX = Math.cos(wanderAngle);
    const wanderY = Math.sin(wanderAngle);

    const dx = target.x - self.x;
    const dy = target.y - self.y;
    const dist = Math.hypot(dx, dy);

    let engageX = 0;
    let engageY = 0;
    if (dist > 0.1) {
      if (self.characterId === 'fan') {
        // Fan is a pure archer (純射手) with 0 collision damage: kites at 180~270px
        const maxRange = self.fanHasRangeBoost ? 300 : 280;
        if (dist < 170) {
          // Too close: retreat away
          engageX = -dx / dist;
          engageY = -dy / dist;
        } else if (dist > maxRange) {
          // Too far: close into shooting distance
          engageX = dx / dist;
          engageY = dy / dist;
        } else {
          // In sweet spot: circle/strafe tangentially
          engageX = -dy / dist;
          engageY = dx / dist;
        }
      } else if (self.characterId === 'dina') {
        // Dina: 遠距離風箏/特殊型法師 (保持距離 ＞ 避免近距離碰撞 ＞ 遠程技能 ＞ 光暗融合)
        if (dist < 180) {
          // 太近/危險距離：全力遠離防碰撞
          engageX = -dx / dist;
          engageY = -dy / dist;
        } else if (dist > 340) {
          // 太遠：適度靠近進入技能範圍
          engageX = dx / dist;
          engageY = dy / dist;
        } else {
          // 甜蜜區間 (180~340px)：環繞盤旋走位
          engageX = -dy / dist;
          engageY = dx / dist;
        }
      } else if (self.characterId === 'kuileishi') {
        // Kuileishi: 輔助召喚型傀儡師 (碰撞傷害 0，在傀儡後方遠程牽制，保持 190~280px 風箏走位)
        if (dist < 190) {
          engageX = -dx / dist;
          engageY = -dy / dist;
        } else if (dist > 280) {
          engageX = dx / dist;
          engageY = dy / dist;
        } else {
          engageX = -dy / dist;
          engageY = dx / dist;
        }
      } else if (self.characterId === 'mimi' && self.mimiGrowthPacks && self.mimiGrowthPacks.length > 0) {
        // Mimi AI: Prioritize collecting nearby growth pack!
        let nearestPack: MimiGrowthPack | null = null;
        let minPackDist = 9999;
        for (const pk of self.mimiGrowthPacks) {
          const pd = Math.hypot(pk.x - self.x, pk.y - self.y);
          if (pd < minPackDist) {
            minPackDist = pd;
            nearestPack = pk;
          }
        }
        if (nearestPack && minPackDist < 450) {
          const toPackX = (nearestPack.x - self.x) / minPackDist;
          const toPackY = (nearestPack.y - self.y) / minPackDist;
          engageX = (dx / dist) * 0.25 + toPackX * 0.75;
          engageY = (dy / dist) * 0.25 + toPackY * 0.75;
        } else {
          engageX = dx / dist;
          engageY = dy / dist;
        }
      } else if (target.characterId === 'mimi' && target.mimiGrowthPacks && target.mimiGrowthPacks.length > 0 && (self.mimiHopeDestroyCooldown ?? 0) <= 0) {
        // Enemy AI: If trample is off cooldown and near a growth pack, contest/trample it!
        let nearestPack: MimiGrowthPack | null = null;
        let minPackDist = 9999;
        for (const pk of target.mimiGrowthPacks) {
          const pd = Math.hypot(pk.x - self.x, pk.y - self.y);
          if (pd < minPackDist) {
            minPackDist = pd;
            nearestPack = pk;
          }
        }
        if (nearestPack && minPackDist < 220) {
          const toPackX = (nearestPack.x - self.x) / minPackDist;
          const toPackY = (nearestPack.y - self.y) / minPackDist;
          engageX = (dx / dist) * 0.4 + toPackX * 0.6;
          engageY = (dy / dist) * 0.4 + toPackY * 0.6;
        } else {
          engageX = dx / dist;
          engageY = dy / dist;
        }
      } else {
        engageX = dx / dist;
        engageY = dy / dist;
      }
    }

    const blendX = wanderX * 0.45 + engageX * 0.55;
    const blendY = wanderY * 0.45 + engageY * 0.55;
    const blendLen = Math.hypot(blendX, blendY);

    if (blendLen > 0.05) {
      steerX = blendX / blendLen;
      steerY = blendY / blendLen;
    }
  } else {
    const len = Math.hypot(inputVector.x, inputVector.y);
    if (len > 0.05) {
      steerX = inputVector.x / len;
      steerY = inputVector.y / len;
    }
  }

  // Apply Chanshi Imprisoning Aura slow (-35% speed) if not under Super Armor (金鐘罩霸體期間免疫減速)
  const isSlowedByChanshi = self.isSlowedByChanshi && (self.chanshiSuperArmorTimer <= 0);
  const chanshiSlowScale = isSlowedByChanshi ? 0.65 : 1.0;

  // Apply Lanzuan Emotion Field slow (-35% speed) if not under Super Armor
  const isSlowedByLanzuan = self.isSlowedByLanzuan && (self.chanshiSuperArmorTimer <= 0);
  const lanzuanSlowScale = isSlowedByLanzuan ? 0.65 : 1.0;

  // Apply Dina Fusion Slow (-35% speed)
  const isSlowedByDina = self.isDinaSlowed && (self.dinaSlowTimer ?? 0) > 0;
  const dinaSlowScale = isSlowedByDina ? 0.65 : 1.0;

  // Apply Jianxian Slow Sword Slow (-25% speed, 持續2秒) if not under Super Armor
  const isSlowedByJianxian = self.isSlowedByJianxian && (self.chanshiSuperArmorTimer <= 0);
  const jianxianSlowScale = isSlowedByJianxian ? 0.75 : 1.0;

  // Apply Longshen Awe Slow (-20% speed, 2秒) if not under Super Armor
  const isSlowedByLongshen = (self.longshenSlowTimer && self.longshenSlowTimer > 0) && (self.chanshiSuperArmorTimer <= 0);
  const longshenSlowScale = isSlowedByLongshen ? 0.80 : 1.0;

  // Apply Spider Web Slow (-35% speed) if not under Super Armor
  const isSlowedBySpiderWeb = (self.isSlowedBySpiderWeb || (self.slowedBySpiderWebTimer ?? 0) > 0) && (self.chanshiSuperArmorTimer <= 0);
  const spiderWebSlowScale = isSlowedBySpiderWeb ? 0.65 : 1.0;

  // Apply Puppeteer Thread Bind Slow (-40% speed) if not under Super Armor
  const isSlowedByPuppetTether = (self.isTetheredByPuppeteer || (self.tetheredByPuppeteerTimer ?? 0) > 0) && (self.chanshiSuperArmorTimer <= 0);
  const puppetTetherSlowScale = isSlowedByPuppetTether ? 0.60 : 1.0;

  // Apply Junko Bandage Arrow Slow (-25% speed) if not under Super Armor
  const isSlowedByJunko = (self.isSlowedByJunko || (self.slowedByJunkoTimer ?? 0) > 0) && (self.chanshiSuperArmorTimer <= 0);
  const junkoSlowScale = isSlowedByJunko ? 0.75 : 1.0;

  let combinedSlowScale = chanshiSlowScale * lanzuanSlowScale * dinaSlowScale * jianxianSlowScale * longshenSlowScale * spiderWebSlowScale * puppetTetherSlowScale * junkoSlowScale;

  // 曼麥亞・軍子: 神之騎士完全體期間完全免疫減速
  if (self.characterId === 'manyaiya' && self.junkoHolyKnightActive) {
    combinedSlowScale = 1.0;
  }

  // Apply Huangzuan Passive 2 Speed Stacking (每層+5%, 最高10層 141% 速度)
  const huangzuanSpeedMultiplier = self.characterId === 'huangzuan'
    ? (1 + (self.huangzuanSpeedStacks || 0) * 0.05)
    : 1.0;

  // Apply Kuileishi Passive 3 Resonance Speed Stacking (每層+6%, 最高3層 118% 速度) + 護幕激發加速 (+20%)
  const kuileishiAegisBoost = (self.characterId === 'kuileishi' && (self.puppetAegisTimer ?? 0) > 0) ? 1.20 : 1.0;
  const kuileishiSpeedMultiplier = self.characterId === 'kuileishi'
    ? (1 + (self.puppetResonance || 0) * 0.06) * kuileishiAegisBoost
    : 1.0;

  // Apply Fan Passive 3 Overclock Boost (+55% speed from 100% to 155%)
  const fanOverclockMultiplier = (self.characterId === 'fan' && self.fanOverclockActive) ? 1.55 : 1.0;

  // Apply Tunshimozu Speed Reduction (每碎片 -0.8%, 每10層魔軀成長 -2%, 50層時共 50% 速度)
  const tunshiSpeedMultiplier = self.characterId === 'tunshimozu'
    ? Math.max(0.50, 1.0 - (self.growthStacks || 0) * 0.008 - Math.floor((self.growthStacks || 0) / 10) * 0.02)
    : 1.0;

  // Apply Mimi Pack Absorption Agility Boost (+15% speed for 1.5s)
  const mimiSpeedMultiplier = (self.characterId === 'mimi' && (self.mimiSpeedBoostTimer ?? 0) > 0) ? 1.15 : 1.0;

  // Apply Longshen Passive 4 Dragon Divine Form Speed Boost (+40% speed from 95% to 133%)
  const longshenSpeedMultiplier = (self.characterId === 'longshen' && self.longshenFormActive) ? 1.40 : 1.0;

  // Apply Junko Dual Pupil Awakening (+20%) & Holy Knight Form (+15%)
  const junkoSpeedMultiplier = self.characterId === 'manyaiya'
    ? (1.0 + (self.junkoEyeAwakened ? 0.20 : 0) + (self.junkoHolyKnightActive ? 0.15 : 0))
    : 1.0;

  // 被軍子定身或束縛時無法移動
  const isImmobilizedByJunko = (self.isBoundByJunko || (self.boundByJunkoTimer ?? 0) > 0 || self.isSnaredByJunko || (self.snaredByJunkoTimer ?? 0) > 0);
  const immobilizationMultiplier = isImmobilizedByJunko ? 0 : 1.0;

  const effectiveSpeed = self.baseSpeed * huangzuanSpeedMultiplier * kuileishiSpeedMultiplier * fanOverclockMultiplier * tunshiSpeedMultiplier * mimiSpeedMultiplier * longshenSpeedMultiplier * junkoSpeedMultiplier * combinedSlowScale * immobilizationMultiplier;

  const accel = effectiveSpeed * 4.6;
  self.vx += steerX * accel * dt;
  self.vy += steerY * accel * dt;

  const friction = 0.992;
  self.vx *= Math.pow(friction, dt * 60);
  self.vy *= Math.pow(friction, dt * 60);

  const currentSpeed = Math.hypot(self.vx, self.vy);
  const maxNaturalSpeed = effectiveSpeed * 1.65;
  if (currentSpeed > maxNaturalSpeed) {
    const decayFactor = 0.96;
    self.vx *= decayFactor;
    self.vy *= decayFactor;
  }

  const minSpeed = effectiveSpeed * 0.65;
  if (currentSpeed < minSpeed && currentSpeed > 0.01) {
    const boost = (minSpeed / currentSpeed) * 0.08;
    self.vx += self.vx * boost;
    self.vy += self.vy * boost;
  }
}

/**
 * Try to consume skill energy. Returns true if successful.
 * If insufficient, triggers throttled alert and returns false.
 */
export function tryConsumeEnergy(
  self: BallState,
  cost: number,
  skillName: string,
  fctList?: FloatingText[],
  events?: CombatEvent[]
): boolean {
  if (cost <= 0) return true;
  const currentEnergy = self.energy ?? 0;
  if (currentEnergy >= cost) {
    self.energy = Math.max(0, currentEnergy - cost);
    if (fctList && cost >= 8) {
      fctList.push({
        id: `fct_ec_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 10,
        text: `-${cost} [${skillName}]`,
        color: '#38bdf8',
        fontSize: 13,
        alpha: 1.0,
        life: 0.75,
        maxLife: 0.75,
        vy: -30,
        vx: (Math.random() - 0.5) * 6,
        damageType: 'energy',
        damageValue: cost
      });
    }
    return true;
  } else {
    // Energy depleted prompt (throttled to once per 1.5s)
    if (!self.energyDepletedPromptTimer || self.energyDepletedPromptTimer <= 0) {
      self.energyDepletedPromptTimer = 1.5;
      soundEngine.playEnergyDepleted();
      if (fctList) {
        fctList.push({
          id: `fct_dep_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 12,
          text: `能量不足 (${Math.round(currentEnergy)}/${cost})`,
          color: '#f87171',
          fontSize: 11,
          alpha: 1.0,
          life: 0.8,
          maxLife: 0.8,
          vy: -16,
          damageType: 'status',
          damageValue: 0
        });
      }
    }
    return false;
  }
}

/**
 * Update ball energy regeneration, overdrive state, and combat technique timers
 */
export function updateBallEnergyAndTactics(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 1. Natural Energy Regeneration
  const regen = self.energyRegen || 7.0;
  const maxEp = self.maxEnergy || 100;
  if ((self.energy ?? 0) < maxEp) {
    self.energy = Math.min(maxEp, (self.energy ?? 0) + regen * dt);
  }

  // 2. Overdrive Status Transition
  if ((self.energy ?? 0) >= maxEp && !self.isOverdrive) {
    self.isOverdrive = true;
    soundEngine.playOverdrive();
    if (fctList) {
      fctList.push({
        id: `fct_od_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 20,
        text: 'OVERDRIVE 能量超載',
        color: '#facc15',
        fontSize: 14,
        scale: 1.25,
        shakeIntensity: 8,
        alpha: 1.0,
        life: 1.1,
        maxLife: 1.1,
        vy: -24,
        damageType: 'status',
        damageValue: 0
      });
    }
    if (events) {
      events.push({
        id: `evt_od_${Math.random()}`,
        timestamp: matchTime,
        type: 'energy_technique',
        attackerId: self.id,
        text: `${self.name} 能量蓄滿 100% 進入【超載狀態 (OVERDRIVE)】！下次碰撞攻擊附加 30% 暴擊威力！`,
        badge: 'OVERDRIVE'
      });
    }
  }

  // 3. Decay Tactical Timers
  if (self.tacticalShieldTimer && self.tacticalShieldTimer > 0) {
    self.tacticalShieldTimer = Math.max(0, self.tacticalShieldTimer - dt);
  }
  if (self.tacticalDashTimer && self.tacticalDashTimer > 0) {
    self.tacticalDashTimer = Math.max(0, self.tacticalDashTimer - dt);
  }
  if (self.tacticalCooldown && self.tacticalCooldown > 0) {
    self.tacticalCooldown = Math.max(0, self.tacticalCooldown - dt);
  }
  if (self.energyDepletedPromptTimer && self.energyDepletedPromptTimer > 0) {
    self.energyDepletedPromptTimer = Math.max(0, self.energyDepletedPromptTimer - dt);
  }

  // 4. Autonomous Combat Techniques (AI Decision)
  if (self.isAi && (self.tacticalCooldown ?? 0) <= 0 && self.hp > 0) {
    const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);
    const selfSpeed = Math.hypot(self.vx, self.vy);

    // Technique 1: Tactical Dash
    if ((self.energy ?? 0) >= 30 && distToEnemy > 120 && distToEnemy < 260 && selfSpeed > 75 && Math.random() < 0.03) {
      executeTacticalDash(self, enemy, matchTime, fctList, events, particles);
    }
    // Technique 2: Tactical Shield
    else if ((self.energy ?? 0) >= 25 && self.hp < self.maxHp * 0.45 && distToEnemy < 150 && (self.tacticalShieldTimer ?? 0) <= 0 && Math.random() < 0.03) {
      executeTacticalShield(self, matchTime, fctList, events, particles);
    }
  }
}

/**
 * Execute Tactical Dash technique (30 Energy)
 */
export function executeTacticalDash(
  self: BallState,
  target: BallState,
  matchTime: number,
  fctList?: FloatingText[],
  events?: CombatEvent[],
  particles?: Particle[]
): boolean {
  if (self.hp <= 0) return false;
  if (self.isBittenByVoidBeast) {
    if (fctList) {
      fctList.push({
        id: `fct_trapped_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 14,
        text: '虛空撕咬束縛 無法衝刺!',
        color: '#c084fc',
        fontSize: 12,
        alpha: 1.0,
        life: 0.6,
        maxLife: 0.6,
        vy: -20,
        damageType: 'status'
      });
    }
    return false;
  }
  if (!tryConsumeEnergy(self, 30, '戰術瞬衝', fctList, events)) {
    return false;
  }

  self.tacticalCooldown = 3.5;
  self.tacticalDashTimer = 0.4;
  const dx = target.x - self.x;
  const dy = target.y - self.y;
  const len = Math.hypot(dx, dy) || 1;
  self.vx += (dx / len) * 200;
  self.vy += (dy / len) * 200;
  soundEngine.playTacticalDash();

  if (fctList) {
    fctList.push({
      id: `fct_dash_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 14,
      text: '戰術瞬衝 -30',
      color: '#38bdf8',
      fontSize: 13,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -24,
      damageType: 'status',
      damageValue: 0
    });
  }

  if (events) {
    events.push({
      id: `evt_dash_${Math.random()}`,
      timestamp: matchTime,
      type: 'energy_technique',
      attackerId: self.id,
      text: `${self.name} 施展【戰術瞬衝】，消耗 30 能量高速突進！`,
      badge: '戰術瞬衝'
    });
  }

  if (particles) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: self.x,
        y: self.y,
        vx: Math.cos(a) * 75,
        vy: Math.sin(a) * 75,
        radius: 2.8,
        color: '#38bdf8',
        alpha: 0.95,
        maxLife: 0.35,
        life: 0.35,
        type: 'spark'
      });
    }
  }
  return true;
}

/**
 * Execute Tactical Shield technique (25 Energy)
 */
export function executeTacticalShield(
  self: BallState,
  matchTime: number,
  fctList?: FloatingText[],
  events?: CombatEvent[],
  particles?: Particle[]
): boolean {
  if (self.hp <= 0) return false;
  if (!tryConsumeEnergy(self, 25, '戰術護盾', fctList, events)) {
    return false;
  }

  self.tacticalCooldown = 4.5;
  self.tacticalShieldTimer = 2.0;
  soundEngine.playTacticalShield();

  if (fctList) {
    fctList.push({
      id: `fct_shield_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 14,
      text: '戰術護盾 -25',
      color: '#facc15',
      fontSize: 13,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -22,
      damageType: 'status',
      damageValue: 0
    });
  }

  if (events) {
    events.push({
      id: `evt_shield_${Math.random()}`,
      timestamp: matchTime,
      type: 'energy_technique',
      attackerId: self.id,
      text: `${self.name} 展開【戰術護盾】，消耗 25 能量準備格擋即將到來的傷害！`,
      badge: '戰術護盾'
    });
  }

  if (particles) {
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: self.radius + 16,
      color: '#facc15',
      alpha: 0.9,
      maxLife: 0.4,
      life: 0.4,
      type: 'shockwave'
    });
  }
  return true;
}

/**
 * Bounds checking, wall bounce, and kinetic wall bounce energy recovery
 */
function handleWallCollision(
  ball: BallState,
  particles: Particle[],
  matchTime?: number,
  fctList?: FloatingText[],
  events?: CombatEvent[]
) {
  // If bitten by Void Beast, ball is clamped and held in jaws, ignore wall bounce
  if (ball.isBittenByVoidBeast) {
    return;
  }

  const minX = ball.radius;
  const maxX = ARENA_WIDTH - ball.radius;
  const minY = ball.radius;
  const maxY = ARENA_HEIGHT - ball.radius;

  const wallRestitution = 0.92;
  const speed = Math.hypot(ball.vx, ball.vy);
  let didBounce = false;

  if (ball.x < minX) {
    ball.x = minX;
    ball.vx = Math.abs(ball.vx) * wallRestitution;
    didBounce = true;
  } else if (ball.x > maxX) {
    ball.x = maxX;
    ball.vx = -Math.abs(ball.vx) * wallRestitution;
    didBounce = true;
  }

  if (ball.y < minY) {
    ball.y = minY;
    ball.vy = Math.abs(ball.vy) * wallRestitution;
    didBounce = true;
  } else if (ball.y > maxY) {
    ball.y = maxY;
    ball.vy = -Math.abs(ball.vy) * wallRestitution;
    didBounce = true;
  }

  if (didBounce) {
    spawnWallSpark(ball.x, ball.y, speed, particles);
    soundEngine.playWallBounce();

    // 辛 - 撞牆殘影與裝甲火星 (不影響碰撞體積)
    if (ball.characterId === 'xin' && particles) {
      const wallNx = ball.x <= minX ? 1 : (ball.x >= maxX ? -1 : 0);
      const wallNy = ball.y <= minY ? 1 : (ball.y >= maxY ? -1 : 0);
      spawnXinCollisionEffects(ball, speed, ball.x, ball.y, wallNx || 1, wallNy || 0, particles);
    }

    // 戰鬥技巧: 壁面彈跳充能 (Wall Rebound Kinetic Recharging)
    if (matchTime !== undefined && speed >= 135 && (matchTime - (ball.lastWallEnergyTime || 0) >= 0.35)) {
      ball.lastWallEnergyTime = matchTime;
      const energyGained = 8;
      ball.energy = Math.min(ball.maxEnergy || 100, (ball.energy || 0) + energyGained);
      ball.vx *= 1.08;
      ball.vy *= 1.08;
      soundEngine.playEnergyCharge();

      if (fctList) {
        fctList.push({
          id: `fct_wb_${Math.random()}`,
          x: ball.x,
          y: ball.y - 12,
          text: `+${energyGained} [壁面彈衝]`,
          color: '#38bdf8',
          fontSize: 11,
          alpha: 1.0,
          life: 0.65,
          maxLife: 0.65,
          vy: -20,
          damageType: 'energy',
          damageValue: energyGained
        });
      }

      if (events && Math.random() < 0.25) {
        events.push({
          id: `evt_wb_${Math.random()}`,
          timestamp: matchTime,
          type: 'energy_technique',
          attackerId: ball.id,
          text: `${ball.name} 精準踩踏壁面受身借力，獲得 +${energyGained} 能量並加速反彈！`,
          badge: '壁面彈衝'
        });
      }
    }
  }
}

/**
 * Dynamic style resolver for floating combat text:
 * - 物理傷害 (Physical): 白色 (#ffffff)
 * - 火焰傷害 (Flame): 橘紅色 (#ff5722 / #f97316)
 * - 魔法能量 / 魔法傷害 (Magic energy / Magic): 紫色 (#c084fc / #a855f7)
 * - 治癒回復 (Heal): 綠色 (#4ade80)
 * - 狀態 / 其他 (Status): 天藍色 (#38bdf8)
 *
 * Font size dynamically scales with damage value:
 * - <= 3: 11px
 * - 4 ~ 7: 13px
 * - 8 ~ 15: 15px
 * - 16 ~ 25: 17px
 * - 26 ~ 45: 19px
 * - > 45: 22 ~ 26px
 */
export function getFloatingTextStyle(
  amount: number,
  type: 'physical' | 'flame' | 'magic' | 'heal' | 'status' | 'true' | 'poison'
): { color: string; fontSize: number; scale: number; shakeIntensity: number } {
  let color = '#ffffff';

  if (type === 'physical') {
    color = '#f1f5f9'; // 物理傷害顯示為柔和白
  } else if (type === 'flame') {
    color = '#fb923c'; // 火焰傷害顯示為柔和橘紅
  } else if (type === 'magic') {
    color = '#c084fc'; // 魔法傷害顯示為紫色
  } else if (type === 'heal') {
    color = '#4ade80'; // 治癒
  } else if (type === 'status') {
    color = '#38bdf8'; // 狀態效果
  } else if (type === 'true') {
    color = '#fbbf24'; // 神聖真實傷害顯示為金黃色
  } else if (type === 'poison') {
    color = '#10b981'; // 蛛毒/毒素傷害顯示為翡翠綠
  }

  // 簡潔精準字體尺寸，移除劇烈抖動避免畫面雜亂
  let fontSize = 12;
  let scale = 1.0;
  let shakeIntensity = 0;

  if (amount <= 5) {
    fontSize = 11;
    scale = 0.90;
  } else if (amount <= 15) {
    fontSize = 12;
    scale = 1.0;
  } else if (amount <= 30) {
    fontSize = 13;
    scale = 1.05;
  } else if (amount <= 60) {
    fontSize = 14;
    scale = 1.10;
  } else {
    fontSize = 15;
    scale = 1.15;
  }

  return { color, fontSize, scale, shakeIntensity };
}

/**
 * Records combat damage stats with comprehensive damage types & role separation
 */
export function recordDamageStats(
  attacker: BallState,
  defender: BallState,
  amount: number,
  damageType: 'physical' | 'magic' | 'flame' | 'true' | 'poison',
  reason: string = ''
) {
  if (amount <= 0) return;
  attacker.damageDealt = (attacker.damageDealt || 0) + amount;
  attacker.peakHitDamage = Math.max(attacker.peakHitDamage || 0, amount);
  defender.damageTaken = (defender.damageTaken || 0) + amount;

  const isTrue = damageType === 'true' || reason.includes('真傷') || reason.includes('真實傷害');
  if (isTrue) {
    attacker.trueDamageDealt = (attacker.trueDamageDealt || 0) + amount;
  } else if (damageType === 'magic') {
    attacker.magicDamageDealt = (attacker.magicDamageDealt || 0) + amount;
  } else if (damageType === 'flame') {
    attacker.flameDamageDealt = (attacker.flameDamageDealt || 0) + amount;
  } else if (damageType === 'poison') {
    attacker.poisonDamageDealt = (attacker.poisonDamageDealt || 0) + amount;
  } else {
    // Physical or Bleed
    if (reason.includes('流血') || reason.includes('撕裂') || reason.includes('爪擊流血')) {
      attacker.bleedDamageDealt = (attacker.bleedDamageDealt || 0) + amount;
    } else {
      attacker.physicalDamageDealt = (attacker.physicalDamageDealt || 0) + amount;
    }
  }

  if (reason.includes('碰撞') || reason.includes('衝撞') || reason.includes('普通碰撞')) {
    attacker.collisionDamageDealt = (attacker.collisionDamageDealt || 0) + amount;
  } else {
    attacker.skillDamageDealt = (attacker.skillDamageDealt || 0) + amount;
  }
}

/**
 * Records combat healing stats
 */
export function recordHealingStats(target: BallState, amount: number) {
  if (amount <= 0) return;
  target.healingDone = (target.healingDone || 0) + Math.round(amount);
}

/**
 * Deducts damage from a CombatPuppet across its 3 life segments (20 HP each)
 */
export function damageCombatPuppet(
  puppet: CombatPuppet,
  damage: number,
  fctList?: FloatingText[],
  particles?: Particle[]
): void {
  if (puppet.hp <= 0 || puppet.currentSegment > 3) return;

  puppet.hitFlashTimer = 0.35;
  let remainingDmg = damage;

  const segMax = puppet.maxSegmentHp || 25;
  while (remainingDmg > 0 && puppet.currentSegment <= 3) {
    if (puppet.segmentHp > remainingDmg) {
      puppet.segmentHp -= remainingDmg;
      remainingDmg = 0;
    } else {
      remainingDmg -= puppet.segmentHp;
      puppet.currentSegment++;
      puppet.segmentHp = segMax; // reset for next segment
      soundEngine.playPuppetSegmentBreak();
    }
  }

  // Calculate total HP
  if (puppet.currentSegment > 3) {
    puppet.hp = 0;
    puppet.segmentHp = 0;
    soundEngine.playPuppetSegmentBreak();
  } else {
    puppet.hp = Math.max(0, (3 - puppet.currentSegment) * segMax + puppet.segmentHp);
  }

  if (fctList) {
    fctList.push({
      id: `fct_puppet_${Math.random()}`,
      x: puppet.x + (Math.random() * 16 - 8),
      y: puppet.y - puppet.radius - 12,
      text: `-${damage} [傀儡 ${Math.min(3, puppet.currentSegment)}/3條]`,
      color: '#c084fc',
      fontSize: 11,
      scale: 1.0,
      shakeIntensity: 2,
      alpha: 1.0,
      life: 0.7,
      maxLife: 0.7,
      vy: -22,
      damageType: 'magic',
      damageValue: damage
    });
  }

  if (particles) {
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: puppet.x,
        y: puppet.y,
        vx: Math.cos(a) * 45,
        vy: Math.sin(a) * 45,
        radius: 2,
        color: '#d8b4fe',
        alpha: 0.9,
        maxLife: 0.25,
        life: 0.25,
        type: 'puppet_thread_spark'
      });
    }
  }
}

/**
 * Centralized Damage Application with Lingyinsi Clone Damage Sharing Logic
 * Rule: When Lingyinsi takes damage, if there are alive clones within 120px range,
 * 30% of damage is transferred to clones (split equally among valid clones).
 * Lingyinsi only takes the remaining 70% damage.
 * If damage exceeds clone's remaining HP, the clone dies and excess does NOT return to main body.
 */
export function applyDamageWithDamageSharing(
  defender: BallState,
  attacker: BallState,
  rawDamage: number,
  damageType: 'physical' | 'magic' | 'flame' | 'true' | 'poison',
  reason: string,
  hitX: number,
  hitY: number,
  matchTime: number,
  fctList?: FloatingText[],
  events?: CombatEvent[],
  particles?: Particle[]
): number {
  if (rawDamage <= 0 || defender.hp <= 0) return 0;

  const isTrueDamage = damageType === 'true' || reason.includes('真傷') || reason.includes('真實傷害');

  // 一拳尹雄被動四: 一拳無界 (領域持續4秒內雙方絕對免傷)
  if (defender.yinyongBoundlessActive || attacker?.yinyongBoundlessActive) {
    if (fctList) {
      fctList.push({
        id: `fct_boundless_imm_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 18,
        text: '一拳無界 免傷',
        color: '#f87171',
        fontSize: 12,
        scale: 1.1,
        shakeIntensity: 0,
        alpha: 0.9,
        life: 0.6,
        maxLife: 0.6,
        vy: -18
      });
    }
    return 0;
  }

  // 虛空獸被動一: 咬住敵人期間完全免疫傷害 (Complete Invulnerability)
  if (defender.isInvulnerable) {
    if (fctList) {
      fctList.push({
        id: `fct_immune_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 18,
        text: '虛空無敵 IMMUNE',
        color: '#c084fc',
        fontSize: 13,
        scale: 1.2,
        shakeIntensity: 0,
        alpha: 1.0,
        life: 0.8,
        maxLife: 0.8,
        vy: -20,
        damageType: 'status',
        damageValue: 0
      });
    }
    if (particles) {
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: Math.cos(a) * 50,
          vy: Math.sin(a) * 50,
          radius: 2,
          color: '#a855f7',
          alpha: 0.8,
          maxLife: 0.3,
          life: 0.3,
          type: 'void_spark'
        });
      }
    }
    return 0;
  }

  // 戰術技巧: 戰術護盾 格擋 (Tactical Shield Block)
  if (defender.tacticalShieldTimer && defender.tacticalShieldTimer > 0) {
    defender.tacticalShieldTimer = 0;
    defender.shieldAbsorbed = (defender.shieldAbsorbed || 0) + rawDamage;
    soundEngine.playTacticalShield();
    if (fctList) {
      fctList.push({
        id: `fct_shield_block_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 16,
        text: '戰術護盾 格擋抵消!',
        color: '#facc15',
        fontSize: 13,
        scale: 1.25,
        shakeIntensity: 6,
        alpha: 1.0,
        life: 0.85,
        maxLife: 0.85,
        vy: -22,
        damageType: 'status',
        damageValue: 0
      });
    }
    if (events) {
      events.push({
        id: `evt_shield_block_${Math.random()}`,
        timestamp: matchTime,
        type: 'energy_technique',
        attackerId: defender.id,
        text: `${defender.name} 的【戰術護盾】完美格擋抵消了本次攻擊 (${reason})！`,
        badge: '護盾格擋'
      });
    }
    if (particles) {
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2;
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: Math.cos(a) * 70,
          vy: Math.sin(a) * 70,
          radius: 2.5,
          color: '#facc15',
          alpha: 0.9,
          maxLife: 0.3,
          life: 0.3,
          type: 'spark'
        });
      }
    }
    return 0;
  }

  // 辛 (Xin): 逐影破陣穿透突進期間完全免疫碰撞傷害
  if (defender.characterId === 'xin' && defender.xinShadowDashing && (reason === '碰撞傷害' || reason?.includes('碰撞'))) {
    return 0;
  }

  // Fenzuan Passive 2: Damage Reduction Field (1.5% damage reduction when in range)
  // [Skill Priority Rule T6 True Damage vs T1 Mitigation Field]: True Damage penetrates and bypasses all damage reduction fields!
  let incomingDamage = rawDamage;

  // 龍神被動一【龍威壓制】: 若目標受到龍威壓制 (longshenAweTimer > 0) 且攻擊者為龍神，受到傷害提升 20%
  if (defender.longshenAweTimer && defender.longshenAweTimer > 0 && attacker.characterId === 'longshen') {
    incomingDamage = Math.max(1, Math.round(incomingDamage * 1.2));
  }

  // 曼麥亞・軍子【記憶斷片易傷狀態】：滿 3 層記憶斷片的敵人受到軍子所有傷害提升 +25%
  if (
    attacker.characterId === 'manyaiya' &&
    ((attacker.junkoMemoryFragments && (attacker.junkoMemoryFragments[defender.id] ?? 0) >= 3) ||
      (defender.junkoVulnerableStacks && defender.junkoVulnerableStacks > 0))
  ) {
    incomingDamage = Math.max(1, Math.round(incomingDamage * 1.25));
  }

  // 曼麥亞・軍子【異瞳覺醒·神聖爆發】：下一次神刃/技能攻擊附帶 +12 純粹神聖傷害
  if (attacker.characterId === 'manyaiya' && attacker.junkoAwakenBonusReady) {
    attacker.junkoAwakenBonusReady = false;
    incomingDamage += 12;
    if (fctList) {
      fctList.push({
        id: `fct_junko_awaken_bonus_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 26,
        text: '【異瞳覺醒·神聖爆發】+12 真實神聖傷害',
        color: '#fef08a',
        fontSize: 13,
        scale: 1.25,
        shakeIntensity: 5,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -24
      });
    }
  }

  if (!isTrueDamage && defender.isProtectedByFenzuanField) {
    // 1.5% reduction
    const reduced = Math.max(1, Math.round(rawDamage * (1 - 0.015) * 10) / 10);
    const mitigated = rawDamage - reduced;
    if (mitigated > 0) {
      defender.damageMitigated = (defender.damageMitigated || 0) + mitigated;
    }
    incomingDamage = reduced;
    defender.fenzuanFieldDamageReductionTimer = 0.25;

    // Pink protective ripple
    if (particles) {
      particles.push({
        x: defender.x,
        y: defender.y,
        vx: 0,
        vy: 0,
        radius: defender.radius + 14,
        color: '#f472b6',
        alpha: 0.9,
        maxLife: 0.25,
        life: 0.25,
        type: 'fenzuan_field_ripple'
      });
    }
  }

  // Hailaise Passive 4: 奧術晶盾 (開局獲得 50 點魔法護盾，護盾破碎時對周圍釋放奧術衝擊造成 26 點魔法傷害)
  if (defender.characterId === 'hailaise' && defender.hailaiseShield && defender.hailaiseShield > 0) {
    const shieldAbsorb = Math.min(defender.hailaiseShield, incomingDamage);
    defender.hailaiseShield -= shieldAbsorb;
    defender.shieldAbsorbed = (defender.shieldAbsorbed || 0) + shieldAbsorb;
    incomingDamage -= shieldAbsorb;

    soundEngine.playTacticalShield();

    if (fctList && shieldAbsorb > 0) {
      fctList.push({
        id: `fct_arcane_shield_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 20,
        text: `奧術晶盾 吸收 -${shieldAbsorb}`,
        color: '#c084fc',
        fontSize: 12,
        scale: 1.1,
        shakeIntensity: 4,
        alpha: 1.0,
        life: 0.8,
        maxLife: 0.8,
        vy: -22,
        damageType: 'status',
        damageValue: 0
      });
    }

    // 護盾破碎判定
    if (defender.hailaiseShield <= 0) {
      defender.hailaiseShield = 0;
      defender.passive4Triggers++;
      soundEngine.playMimiHeartExplode();

      if (fctList) {
        fctList.push({
          id: `fct_shield_break_${Math.random()}`,
          x: defender.x,
          y: defender.y - defender.radius - 32,
          text: '【奧術晶盾 破碎反擊!】(26魔傷)',
          color: '#e879f9',
          fontSize: 14,
          scale: 1.3,
          shakeIntensity: 8,
          alpha: 1.0,
          life: 1.2,
          maxLife: 1.2,
          vy: -28
        });
      }

      if (events) {
        events.push({
          id: `evt_shield_break_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: defender.id,
          targetId: attacker.id,
          damage: 26,
          skillName: '奧術晶盾',
          text: `${defender.name} 的【奧術晶盾】破裂，引發奧術衝擊反噬 ${attacker.name}，造成 26 點魔法傷害！`,
          badge: '晶盾破裂'
        });
      }

      // Shockwave & burst particles
      if (particles) {
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: 0,
          vy: 0,
          radius: 55,
          color: '#c084fc',
          alpha: 0.95,
          maxLife: 0.35,
          life: 0.35,
          type: 'shockwave'
        });

        for (let i = 0; i < 18; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 120;
          particles.push({
            x: defender.x,
            y: defender.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.8 + Math.random() * 2,
            color: Math.random() > 0.4 ? '#c084fc' : '#f5d0fe',
            alpha: 1.0,
            maxLife: 0.4,
            life: 0.4,
            type: 'arcane_spark'
          });
        }
      }

      // 對反噬目標造成 26 點魔法傷害
      if (attacker && attacker.hp > 0) {
        applyDamageWithDamageSharing(
          attacker,
          defender,
          26,
          'magic',
          '奧術晶盾破碎衝擊',
          defender.x,
          defender.y,
          matchTime,
          fctList,
          events,
          particles
        );
      }
    }

    if (incomingDamage <= 0) {
      return shieldAbsorb;
    }
  }

  // 辛 (Xin) 光之魔劍 神聖護盾 (Holy Shield absorb)
  if (defender.characterId === 'xin' && defender.xinShieldAmount && defender.xinShieldAmount > 0) {
    const shieldAbsorb = Math.min(defender.xinShieldAmount, incomingDamage);
    defender.xinShieldAmount -= shieldAbsorb;
    defender.shieldAbsorbed = (defender.shieldAbsorbed || 0) + shieldAbsorb;
    incomingDamage -= shieldAbsorb;

    soundEngine.playTacticalShield();

    if (fctList && shieldAbsorb > 0) {
      fctList.push({
        id: `fct_xin_shield_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 20,
        text: `聖光護盾 吸收 -${shieldAbsorb}`,
        color: '#fbbf24',
        fontSize: 12,
        scale: 1.1,
        shakeIntensity: 4,
        alpha: 1.0,
        life: 0.8,
        maxLife: 0.8,
        vy: -22,
        damageType: 'status',
        damageValue: 0
      });
    }

    if (incomingDamage <= 0) {
      return shieldAbsorb;
    }
  }

  // Check if defender is Lingyinsi and has valid clones within 120px range
  if (defender.characterId === 'lingyinsi' && defender.clones && defender.clones.length > 0) {
    const validClones = defender.clones.filter(
      c => c.hp > 0 && Math.hypot(defender.x - c.x, defender.y - c.y) <= 120
    );

    if (validClones.length > 0) {
      // 30% damage transferred to clones, 70% to main body
      const totalTransferred = Math.round(incomingDamage * 0.30);
      const mainDamage = Math.max(1, incomingDamage - totalTransferred);
      const perCloneDamage = Math.max(1, Math.round(totalTransferred / validClones.length));

      // 1. Deduct main body HP (70%)
      defender.hp = Math.max(0, defender.hp - mainDamage);
      recordDamageStats(attacker, defender, incomingDamage, isTrueDamage ? 'true' : damageType, reason);

      // 2. Deduct clone HPs (30% split)
      validClones.forEach(clone => {
        const cloneActualTaken = Math.min(clone.hp, perCloneDamage);
        clone.hp = Math.max(0, clone.hp - perCloneDamage);

        // Visual tether effect from main to clone
        if (particles) {
          particles.push({
            x: (defender.x + clone.x) / 2,
            y: (defender.y + clone.y) / 2,
            vx: (clone.x - defender.x) * 0.5,
            vy: (clone.y - defender.y) * 0.5,
            radius: 3,
            color: '#38bdf8',
            alpha: 1.0,
            maxLife: 0.25,
            life: 0.25,
            type: 'psionic_arrow_spark'
          });
        }

        // Floating damage on clone (inherit color from damageType, with dynamic size)
        if (fctList) {
          const cloneStyle = getFloatingTextStyle(cloneActualTaken, damageType);
          fctList.push({
            id: `fct_clone_${Math.random()}`,
            x: clone.x,
            y: clone.y - clone.radius - 12,
            text: `-${cloneActualTaken} [分攤]`,
            color: cloneStyle.color,
            fontSize: Math.max(11, cloneStyle.fontSize - 1),
            scale: cloneStyle.scale,
            shakeIntensity: cloneStyle.shakeIntensity,
            damageType: damageType,
            damageValue: cloneActualTaken,
            alpha: 1.0,
            life: 0.75,
            maxLife: 0.75,
            vy: -25
          });
        }

        // Clone death dissolution
        if (clone.hp <= 0) {
          if (particles) {
            for (let i = 0; i < 12; i++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 40 + Math.random() * 80;
              particles.push({
                x: clone.x,
                y: clone.y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                radius: 2.5 + Math.random() * 2,
                color: '#38bdf8',
                alpha: 1.0,
                maxLife: 0.4,
                life: 0.4,
                type: 'spirit_dissolve'
              });
            }
          }

          if (events) {
            events.push({
              id: `evt_${Math.random()}`,
              timestamp: matchTime,
              type: 'passive_trigger',
              attackerId: attacker.id,
              targetId: defender.id,
              skillName: '靈隱寺分身術',
              text: `靈隱寺分身承受傷害達上限已消散！`,
              badge: '分身消散'
            });
          }
        }
      });

      // Filter dead clones
      defender.clones = defender.clones.filter(c => c.hp > 0);

      soundEngine.playDamageShare();

      // Floating text on main body
      if (fctList) {
        const mainStyle = getFloatingTextStyle(mainDamage, damageType);
        fctList.push({
          id: `fct_${Math.random()}`,
          x: defender.x + (Math.random() * 20 - 10),
          y: defender.y - defender.radius - 10,
          text: `-${mainDamage} [分身分攤30%]`,
          color: mainStyle.color,
          fontSize: mainStyle.fontSize,
          scale: mainStyle.scale,
          shakeIntensity: mainStyle.shakeIntensity,
          damageType: damageType,
          damageValue: mainDamage,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -35
        });
      }

      return mainDamage;
    }
  }

  // 傀儡師 (Kuileishi) 被動一【傀儡護幕】(30%減免轉移至最高血量傀儡) 與【木偶替身】(單次受傷>10% HP，額外減免20%達50%，並扣除1條傀儡生命)
  if (defender.characterId === 'kuileishi' && defender.puppets && defender.puppets.length > 0) {
    const alivePuppets = defender.puppets.filter(p => p.hp > 0 && p.currentSegment <= 3);
    if (alivePuppets.length > 0) {
      // Find puppet with highest current HP
      alivePuppets.sort((a, b) => b.hp - a.hp);
      const chosenPuppet = alivePuppets[0];

      // Check 木偶替身: single incoming damage > 10% max HP (420 * 0.10 = 42 HP)
      const isLargeHit = incomingDamage > defender.maxHp * 0.10;
      const canSubstitute = isLargeHit && (defender.puppetSubstituteCooldown ?? 0) <= 0;

      let reductionRatio = 0.40; // 護幕常駐 40% 傷害轉移減免
      let usedSubstitute = false;

      if (canSubstitute) {
        defender.puppetSubstituteCooldown = 7.5;
        reductionRatio = 0.65; // 木偶替身強化至 65% 減傷
        usedSubstitute = true;
        defender.passive4Triggers = (defender.passive4Triggers || 0) + 1;

        // Highest HP puppet sacrifices 1 full life segment
        const segMax = chosenPuppet.maxSegmentHp || 25;
        chosenPuppet.currentSegment++;
        chosenPuppet.segmentHp = segMax;
        chosenPuppet.hp = Math.max(0, (3 - chosenPuppet.currentSegment) * segMax + chosenPuppet.segmentHp);
        chosenPuppet.hitFlashTimer = 0.35;
        chosenPuppet.lineFlashTimer = 0.45;

        // Wood splinters and violet sparks on Puppeteer
        if (particles) {
          for (let i = 0; i < 14; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 50 + Math.random() * 100;
            particles.push({
              x: defender.x,
              y: defender.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.5,
              color: i % 2 === 0 ? '#d97706' : '#c084fc',
              alpha: 1.0,
              maxLife: 0.4,
              life: 0.4,
              type: 'puppet_thread_spark'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_substitute_${Math.random()}`,
            x: defender.x,
            y: defender.y - defender.radius - 24,
            text: '【木偶替身】減傷65% 獻祭傀儡生命！',
            color: '#c084fc',
            fontSize: 13,
            scale: 1.25,
            shakeIntensity: 4,
            alpha: 1.0,
            life: 0.9,
            maxLife: 0.9,
            vy: -24,
            damageType: 'status',
            damageValue: 0
          });
        }

        if (events) {
          events.push({
            id: `evt_sub_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: attacker.id,
            targetId: defender.id,
            skillName: '木偶替身',
            text: `【木偶替身】${defender.name} 遭受重創，傀儡替身抵擋 65% 傷害並獻祭 1 條生命條！`,
            badge: '木偶替身'
          });
        }
      }

      const transferredDmg = Math.round(incomingDamage * reductionRatio);
      const mainDamage = Math.max(1, incomingDamage - transferredDmg);

      // Deduct from puppet using standard damage logic if not substitute sacrifice
      if (!usedSubstitute) {
        damageCombatPuppet(chosenPuppet, transferredDmg, fctList, particles);
        chosenPuppet.lineFlashTimer = 0.3;
        chosenPuppet.shieldActiveTimer = 0.4;
      }

      defender.puppetAegisTimer = 1.5; // 觸發護幕獲得 1.5 秒加速 +20%
      defender.puppetAegisCooldown = 3.5;
      defender.passive2Triggers = (defender.passive2Triggers || 0) + 1;
      defender.hp = Math.max(0, defender.hp - mainDamage);
      defender.damageMitigated = (defender.damageMitigated || 0) + transferredDmg;
      recordDamageStats(attacker, defender, incomingDamage, isTrueDamage ? 'true' : damageType, reason);

      soundEngine.playPuppetAegis();

      // Tether flash particles between puppeteer and puppet
      if (particles) {
        for (let i = 0; i < 8; i++) {
          const t = i / 8;
          particles.push({
            x: defender.x + (chosenPuppet.x - defender.x) * t,
            y: defender.y + (chosenPuppet.y - defender.y) * t,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            radius: 2,
            color: '#c084fc',
            alpha: 0.9,
            maxLife: 0.3,
            life: 0.3,
            type: 'puppet_thread_spark'
          });
        }
      }

      // Filter dead puppets
      defender.puppets = defender.puppets.filter(p => p.hp > 0 && p.currentSegment <= 3);

      if (fctList) {
        const mainStyle = getFloatingTextStyle(mainDamage, damageType);
        fctList.push({
          id: `fct_kls_mitigated_${Math.random()}`,
          x: defender.x + (Math.random() * 20 - 10),
          y: defender.y - defender.radius - 10,
          text: `-${mainDamage} [護幕轉移 ${transferredDmg}]`,
          color: mainStyle.color,
          fontSize: mainStyle.fontSize,
          scale: mainStyle.scale,
          shakeIntensity: mainStyle.shakeIntensity,
          damageType: damageType,
          damageValue: mainDamage,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -35
        });
      }

      return mainDamage;
    }
  }

  // T0 Priority: Emergency Survival / Death-Prevention Interception
  // 禪師金身回復優先判定：若本次傷害將使血量低於 30% 或致死，立即阻斷暴斃並觸發金身回復
  if (
    defender.characterId === 'chanshi' &&
    !defender.chanshiGoldenBodyUsed &&
    (defender.hp - incomingDamage <= defender.maxHp * 0.30 || defender.hp - incomingDamage <= 0)
  ) {
    if (tryConsumeEnergy(defender, 40, '金身回復', fctList, events)) {
      defender.chanshiGoldenBodyUsed = true;
      defender.passive3Triggers++;
      defender.chanshiHealingAnimTimer = 1.0;
      soundEngine.playZenGoldenHeal();

      const healAmount = 80;
      const survivingBase = Math.max(1, defender.hp - incomingDamage);
      defender.hp = Math.min(defender.maxHp, survivingBase + healAmount);
      recordHealingStats(defender, healAmount);
      recordDamageStats(attacker, defender, incomingDamage, isTrueDamage ? 'true' : damageType, reason);

      if (fctList) {
        fctList.push({
          id: `fct_heal_${Math.random()}`,
          x: defender.x,
          y: defender.y - defender.radius - 24,
          text: `+${healAmount} [金身保底回復]`,
          color: '#facc15',
          fontSize: 14,
          alpha: 1.0,
          life: 1.1,
          maxLife: 1.1,
          vy: -30
        });
      }

      // Golden core gathering particles
      if (particles) {
        for (let i = 0; i < 24; i++) {
          const angle = (i * Math.PI * 2) / 24;
          const startDist = defender.radius + 24 + Math.random() * 16;
          particles.push({
            x: defender.x + Math.cos(angle) * startDist,
            y: defender.y + Math.sin(angle) * startDist,
            vx: -Math.cos(angle) * 80,
            vy: -Math.sin(angle) * 80,
            radius: 2.5 + Math.random() * 2,
            color: Math.random() > 0.3 ? '#fef08a' : '#f59e0b',
            alpha: 0.95,
            maxLife: 0.45,
            life: 0.45,
            type: 'zen_heal_spark'
          });
        }
      }

      if (events) {
        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: attacker.id,
          targetId: defender.id,
          skillName: '金身回復',
          text: `【T0 優先級】${defender.name} 遭受重創，金身回復立即啟動！阻斷致命暴斃並回復 ${healAmount} HP！`,
          badge: '金身保底'
        });
      }

      if (fctList) {
        const style = getFloatingTextStyle(incomingDamage, damageType);
        fctList.push({
          id: `fct_${Math.random()}`,
          x: defender.x,
          y: defender.y - defender.radius - 12,
          text: `-${incomingDamage} [${reason || '重擊'}]`,
          color: style.color,
          fontSize: style.fontSize,
          scale: style.scale,
          shakeIntensity: style.shakeIntensity,
          damageType: damageType,
          damageValue: incomingDamage,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -35
        });
      }

      return incomingDamage;
    }
  }

  // 一拳尹雄被動四: 一拳無界 (瀕死鎖血／阻斷致命傷害)
  if (
    defender.characterId === 'yinyong' &&
    !defender.yinyongBoundlessUsed &&
    (defender.hp - incomingDamage <= defender.maxHp * 0.01 || defender.hp - incomingDamage <= 0)
  ) {
    defender.hp = 1;
    defender.yinyongBoundlessUsed = true;
    defender.yinyongBoundlessActive = true;
    defender.yinyongBoundlessDuration = 4.0;
    soundEngine.playYinyongBoundless();

    if (fctList) {
      fctList.push({
        id: `fct_boundless_trig_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 24,
        text: '★【一拳無界】瀕死鎖血！雙方免傷4秒！',
        color: '#ef4444',
        fontSize: 15,
        scale: 1.4,
        shakeIntensity: 8,
        alpha: 1.0,
        life: 1.2,
        maxLife: 1.2,
        vy: -30
      });
    }

    if (events) {
      events.push({
        id: `evt_boundless_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: attacker.id,
        targetId: defender.id,
        skillName: '一拳無界',
        text: `★【一拳無界】${defender.name} 遭受致命打擊，觸發瀕死免死！鎖血 1 HP，展開 135px 結界，雙方絕對免傷 4 秒！`,
        badge: '一拳無界'
      });
    }

    return 0;
  }

  // Standard damage deduction
  defender.hp = Math.max(0, defender.hp - incomingDamage);
  recordDamageStats(attacker, defender, incomingDamage, isTrueDamage ? 'true' : damageType, reason);

  const reasonTag = (!isTrueDamage && defender.isProtectedByFenzuanField)
    ? `${reason ? `${reason}, ` : ''}減傷1.5%`
    : reason;

  const resolvedDamageType = isTrueDamage ? 'true' : damageType;
  const style = getFloatingTextStyle(incomingDamage, resolvedDamageType);

  const colDx = defender.x - attacker.x;
  const colDist = Math.hypot(colDx, defender.y - attacker.y) || 1;
  const normX = colDx / colDist;
  const flankDir = Math.abs(normX) > 0.15 ? Math.sign(normX) : (defender.x > 400 ? 1 : -1);
  const dmgX = defender.x + flankDir * (defender.radius * 0.75 + 10);
  const dmgY = defender.y - defender.radius - 14;

  if (fctList) {
    fctList.push({
      id: `fct_${Math.random()}`,
      x: dmgX,
      y: dmgY,
      text: `-${incomingDamage}${reasonTag ? ` [${reasonTag}]` : ''}`,
      color: style.color,
      fontSize: style.fontSize,
      scale: style.scale,
      shakeIntensity: style.shakeIntensity,
      damageType: damageType,
      damageValue: incomingDamage,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -35
    });
  }

  return incomingDamage;
}

/**
 * Check collision between an Enemy Ball and Lingyinsi Clones
 */
function handleCloneBallCollisions(
  owner: BallState,
  enemy: BallState,
  fctList?: FloatingText[],
  events?: CombatEvent[],
  particles?: Particle[]
) {
  if (owner.characterId !== 'lingyinsi' || !owner.clones || owner.clones.length === 0) return;

  for (let i = owner.clones.length - 1; i >= 0; i--) {
    const clone = owner.clones[i];
    if (clone.hp <= 0) continue;

    const cdx = enemy.x - clone.x;
    const cdy = enemy.y - clone.y;
    const dist = Math.hypot(cdx, cdy);
    const minDist = enemy.radius + clone.radius;

    if (dist < minDist && dist > 0.001) {
      const nx = cdx / dist;
      const ny = cdy / dist;

      // Rebound enemy ball off stationary clone
      const velAlongNormal = enemy.vx * nx + enemy.vy * ny;
      if (velAlongNormal < 0) {
        enemy.vx -= 1.8 * velAlongNormal * nx;
        enemy.vy -= 1.8 * velAlongNormal * ny;

        // Clone takes collision damage directly from enemy ball (射手與法師碰撞傷害固定為 0)
        const isEnemyZeroCollision = isZeroCollisionDamageRole(enemy.characterId);
        const cloneDmg = isEnemyZeroCollision ? 0 : (enemy.baseAttack || 0);
        if (cloneDmg > 0) {
          clone.hp = Math.max(0, clone.hp - cloneDmg);
          recordDamageStats(enemy, owner, cloneDmg, 'physical', '撞擊分身');
          enemy.hitsDealt++;

          if (fctList) {
            fctList.push({
              id: `fct_clone_${Math.random()}`,
              x: clone.x,
              y: clone.y - clone.radius - 10,
              text: `-${cloneDmg} [撞擊分身]`,
              color: '#ef4444',
              fontSize: 12,
              alpha: 1.0,
              life: 0.75,
              maxLife: 0.75,
              vy: -25
            });
          }
        }

        // Impact particles on clone
        if (particles) {
          for (let p = 0; p < 8; p++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 50 + Math.random() * 80;
            particles.push({
              x: clone.x,
              y: clone.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              radius: 2.2,
              color: '#38bdf8',
              alpha: 1.0,
              maxLife: 0.3,
              life: 0.3,
              type: 'psionic_arrow_spark'
            });
          }
        }

        soundEngine.playCollision(0.8);

        if (clone.hp <= 0 && events) {
          events.push({
            id: `evt_${Math.random()}`,
            timestamp: Date.now() * 0.001,
            type: 'collision',
            attackerId: enemy.id,
            targetId: owner.id,
            damage: cloneDmg,
            text: `${enemy.name} 撞擊並擊碎了 ${owner.name} 的分身！`,
            badge: '分身消滅'
          });
        }
      }
    }
  }

  owner.clones = owner.clones.filter(c => c.hp > 0);
}

/**
 * 職業系統碰撞傷害規則判定：
 * 射手與法師的基礎碰撞傷害永久固定為 0。
 * 自身碰撞不造成傷害、不會因撞擊敵人造成物理傷害、不得透過速度/質量/碰撞增傷造成傷害。
 * 技能傷害與物理碰撞完全分離。
 *
 * 目前指定角色修正：
 * 射手｜碰撞傷害 0：靈隱寺、凡
 * 法師｜碰撞傷害 0：海萊絲、藍鑽、蒂納、劍仙
 */
export function isZeroCollisionDamageRole(characterId: string): boolean {
  if (
    characterId === 'lingyinsi' ||
    characterId === 'fan' ||
    characterId === 'hailaise' ||
    characterId === 'lanzuan' ||
    characterId === 'dina' ||
    characterId === 'jianxian' ||
    characterId === 'xin' ||
    characterId === 'kuileishi' ||
    characterId === 'yinyong' ||
    characterId === 'manyaiya'
  ) {
    return true;
  }
  const charConfig = CHARACTERS[characterId];
  if (charConfig && (charConfig.primaryRole === 'marksman' || charConfig.primaryRole === 'mage')) {
    return true;
  }
  return false;
}

/**
 * Damage & Passive Skills Resolution for Collisions
 */
function processCollisionDamage(
  attacker: BallState,
  defender: BallState,
  hitX: number,
  hitY: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 虛空獸咬住敵人期間只會造成咬著傷害，絕對不觸發碰撞傷害
  if (
    attacker.xukongshouBiteActive ||
    defender.xukongshouBiteActive ||
    attacker.isBittenByVoidBeast ||
    defender.isBittenByVoidBeast
  ) {
    return;
  }

  // 射手與法師：碰撞傷害永久固定為 0（自身碰撞不造成傷害，技能與碰撞完全分離）
  const isZeroCollision = isZeroCollisionDamageRole(attacker.characterId);
  let totalDmg = isZeroCollision ? 0 : (attacker.baseAttack || 0);
  const skillTags: string[] = [];

  // 1. 碰撞能量回饋 (Kinetic Strike Energy & Rage Energy)
  const attackerGain = 10;
  const defenderGain = 6;
  attacker.energy = Math.min(attacker.maxEnergy || 100, (attacker.energy || 0) + attackerGain);
  defender.energy = Math.min(defender.maxEnergy || 100, (defender.energy || 0) + defenderGain);

  // 2. 超載暴擊釋放 (Overdrive Critical Strike Discharge)
  if (attacker.isOverdrive) {
    attacker.isOverdrive = false;
    attacker.energy = Math.max(0, (attacker.energy || 100) - 35);
    if (!isZeroCollision) {
      totalDmg = Math.round(totalDmg * 1.30);
      skillTags.push('超載暴擊+30%');
    }
    soundEngine.playOverdrive();

    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 48,
      color: '#facc15',
      alpha: 1.0,
      maxLife: 0.35,
      life: 0.35,
      type: 'shockwave'
    });
  }

  // ===================== OBA SKILLS (Attacker) =====================
  if (attacker.characterId === 'oba') {
    // 被動一【重擊】: 每次碰撞敵方消耗 15 能量，造成額外 25% 物理傷害 (22 * 0.25 = 5.5 -> 6點)
    if (tryConsumeEnergy(attacker, 15, '重擊', fctList, events)) {
      const heavyBonus = Math.round(attacker.baseAttack * 0.25);
      totalDmg += heavyBonus;
      attacker.passive1Triggers++;
      skillTags.push('重擊+25%');
      soundEngine.playHeavyHit();
      soundEngine.playGoldSpark();
    }

    const goldColors = ['#fbbf24', '#f59e0b', '#fef08a', '#ffd700', '#ffffff'];
    const sparkCount = 14;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 160;
      particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 2.5,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        alpha: 1.0,
        maxLife: 0.38 + Math.random() * 0.15,
        life: 0.38 + Math.random() * 0.15,
        type: 'gold_spark'
      });
    }

    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 32,
      color: '#fbbf24',
      alpha: 0.85,
      maxLife: 0.28,
      life: 0.28,
      type: 'shockwave'
    });

    // 被動三【連續猛撞】: 連續 3 次有效碰撞後，消耗 25 能量下一次額外造成 15 點物理爆發傷害
    attacker.consecutiveHits++;
    if (attacker.consecutiveHits >= 4) {
      if (tryConsumeEnergy(attacker, 25, '連續猛撞', fctList, events)) {
        totalDmg += 15;
        attacker.consecutiveHits = 0;
        attacker.passive3Triggers++;
        skillTags.push('連續猛撞+15');
        soundEngine.playComboTrigger();

        particles.push({
          x: hitX,
          y: hitY,
          vx: 0,
          vy: 0,
          radius: 50,
          color: '#fbbf24',
          alpha: 0.95,
          maxLife: 0.4,
          life: 0.4,
          type: 'shockwave'
        });

        for (let i = 0; i < 18; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 120 + Math.random() * 200;
          particles.push({
            x: hitX,
            y: hitY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 3 + Math.random() * 2,
            color: Math.random() > 0.4 ? '#fef08a' : '#38bdf8',
            alpha: 1.0,
            maxLife: 0.45,
            life: 0.45,
            type: 'gold_spark'
          });
        }
      } else {
        attacker.consecutiveHits = 3; // Keep ready until energy is available
      }
    }
  }

  // ===================== HUOTONG SKILLS (Attacker) =====================
  if (attacker.characterId === 'huotong') {
    const flameColors = ['#ef4444', '#f97316', '#dc2626', '#ea580c', '#ffedd5'];

    // 被動二【滾燙桶身】: 消耗 15 能量，高速移動時碰撞傷害提升 25% (14 * 1.25 -> +3.5)，冷卻 3.5 秒
    if (attacker.isHotBodyActive && (attacker.huotongHotBodyCooldown <= 0)) {
      if (tryConsumeEnergy(attacker, 15, '滾燙桶身', fctList, events)) {
        const hotBonus = Math.max(1, Math.round(attacker.baseAttack * 0.25));
        totalDmg += hotBonus;
        attacker.huotongHotBodyCooldown = 3.5; // 3.5s 冷卻
        attacker.isHotBodyActive = false;
        attacker.passive2Triggers++;
        skillTags.push('滾燙+25%');
        soundEngine.playFireBurst();

        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 80 + Math.random() * 150;
          particles.push({
            x: hitX,
            y: hitY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 30,
            radius: 4 + Math.random() * 5,
            color: flameColors[Math.floor(Math.random() * flameColors.length)],
            alpha: 0.95,
            maxLife: 0.42,
            life: 0.42,
            type: 'flame'
          });
        }
      }
    }

    // 被動三【爆燃反彈】: 消耗 20 能量，受到強力反彈後下一次命中額外造成 16 點火焰傷害，冷卻 8 秒
    if (attacker.hasExplosiveBounceReady) {
      if (tryConsumeEnergy(attacker, 20, '爆燃反彈', fctList, events)) {
        totalDmg += 16;
        attacker.hasExplosiveBounceReady = false;
        attacker.huotongExplosiveCooldown = 8.0; // 8.0s 冷卻
        attacker.passive3Triggers++;
        skillTags.push('爆燃+16');
        soundEngine.playFireBurst();

        particles.push({
          x: hitX,
          y: hitY,
          vx: 0,
          vy: 0,
          radius: 46,
          color: '#f97316',
          alpha: 0.95,
          maxLife: 0.36,
          life: 0.36,
          type: 'shockwave'
        });

        for (let i = 0; i < 22; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 90 + Math.random() * 180;
          particles.push({
            x: hitX,
            y: hitY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 3 + Math.random() * 4,
            color: flameColors[Math.floor(Math.random() * flameColors.length)],
            alpha: 0.95,
            maxLife: 0.45,
            life: 0.45,
            type: Math.random() > 0.5 ? 'flame' : 'magma_shard'
          });
        }
      }
    }
  }

  // ===================== HUANGZUAN SKILLS (Attacker) =====================
  if (attacker.characterId === 'huangzuan') {
    const stacks = attacker.huangzuanSpeedStacks || 0;
    const speedBonus = stacks * 1.5;
    totalDmg = (attacker.baseAttack || 12) + speedBonus;

    attacker.passive2Triggers++;
    if (stacks > 0) {
      skillTags.push(`超速${stacks}層+${speedBonus.toFixed(1)}物傷`);
    }
    soundEngine.playSpeedCollision();

    // Reset stacks, set 10s cooldown
    attacker.huangzuanSpeedStacks = 0;
    attacker.huangzuanStackTimer = 0;
    attacker.huangzuanSpeedCooldown = 10.0;

    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 44 + stacks * 2,
      color: '#facc15',
      alpha: 0.95,
      maxLife: 0.35,
      life: 0.35,
      type: 'huangzuan_shockwave'
    });

    const sparkCount = 14 + stacks * 2;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 80 + Math.random() * 180;
      particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2.5 + Math.random() * 2.5,
        color: Math.random() > 0.35 ? '#facc15' : '#ffffff',
        alpha: 1.0,
        maxLife: 0.38 + Math.random() * 0.15,
        life: 0.38 + Math.random() * 0.15,
        type: 'huangzuan_spark'
      });
    }
  }

  // ===================== FENZUAN SKILLS (Attacker) =====================
  if (attacker.characterId === 'fenzuan') {
    totalDmg = attacker.baseAttack || 10;

    // 被動三【泡泡尖刺】: 泡泡尖刺狀態下，與敵方球體接觸時造成 8 點額外物理傷害 (削弱自 16 點)
    if (attacker.fenzuanBubbleActive) {
      totalDmg += 8;
      attacker.passive3Triggers++;
      attacker.fenzuanBubbleLastTouchTime = matchTime; // Synchronize touch cooldown
      skillTags.push('泡泡尖刺+8物傷');
      soundEngine.playFenzuanBubbleSpikeImpact();

      // Pink bubble impact shockwave
      particles.push({
        x: hitX,
        y: hitY,
        vx: 0,
        vy: 0,
        radius: 46,
        color: '#f472b6',
        alpha: 0.95,
        maxLife: 0.35,
        life: 0.35,
        type: 'shockwave'
      });

      // Crystal spike shards and bubble pops
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 70 + Math.random() * 160;
        particles.push({
          x: hitX,
          y: hitY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#f472b6' : '#fdf2f8',
          alpha: 1.0,
          maxLife: 0.38,
          life: 0.38,
          type: 'fenzuan_spike_shard'
        });
      }

      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 30 + Math.random() * 60;
        particles.push({
          x: hitX,
          y: hitY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 3 + Math.random() * 3,
          color: '#fbcfe8',
          alpha: 0.85,
          maxLife: 0.3,
          life: 0.3,
          type: 'fenzuan_bubble_pop'
        });
      }
    }
  }

  // ===================== LONGSHEN SKILLS (Attacker) =====================
  if (attacker.characterId === 'longshen') {
    totalDmg = attacker.baseAttack || 10;
    if (attacker.longshenFormActive) {
      totalDmg += 12; // 變身真龍形態 普通碰撞爆發 22 點物傷
      skillTags.push('真龍神威+12物傷');
      soundEngine.playFireBurst();

      particles.push({
        x: hitX,
        y: hitY,
        vx: 0,
        vy: 0,
        radius: 50,
        color: '#fbbf24',
        alpha: 0.95,
        maxLife: 0.35,
        life: 0.35,
        type: 'shockwave'
      });
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 100;
        particles.push({
          x: hitX,
          y: hitY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.8 + Math.random() * 2,
          color: i % 2 === 0 ? '#f59e0b' : '#ef4444',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'longshen_flame_particle'
        });
      }
    }
  }

  // ===================== JIANDAOSHOU SKILLS (剪刀手: 剪刀攻擊 & 剪裁之術) =====================
  if (attacker.characterId === 'jiandaoshou') {
    // 啟用主動手部剪刀多階段暴烈剪斷動畫 (0.38s) 與核心魔力光暈
    attacker.jiandaoshouSnipAnimTimer = 0.38;
    attacker.jiandaoshouCoreGlowTimer = 0.45;

    const attackAngle = Math.atan2(defender.y - attacker.y, defender.x - attacker.x);
    attacker.jiandaoshouAttackAimAngle = attackAngle;

    // 音效: 俐落金屬剪切與開合聲
    soundEngine.playJiandaoSnip();

    // 剪刀攻擊視覺特效：
    // 1. 雙刃十字銀白裁斷切光 (Snip cut crossed shear flashes)
    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 5,
      length: 54,
      angle: attackAngle,
      color: '#ffffff',
      alpha: 1.0,
      maxLife: 0.38,
      life: 0.38,
      type: 'jiandao_snip_cut'
    });

    // 2. 雙向對咬月牙圓弧斬芒 (Scissor dual opposing crescent slash shockwaves)
    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 40,
      angle: attackAngle,
      color: '#ffffff',
      alpha: 1.0,
      maxLife: 0.35,
      life: 0.35,
      type: 'jiandao_scissor_slash_arc'
    });

    // 3. 十字切裂瞬間爆光 (Cross-Cut Shear Vertex Flash)
    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 28,
      angle: attackAngle,
      color: '#ffffff',
      alpha: 1.0,
      maxLife: 0.28,
      life: 0.28,
      type: 'jiandao_cross_flash'
    });

    // 4. 命中符號 (Scissor mark / Insignia stamped on enemy)
    particles.push({
      x: defender.x,
      y: defender.y,
      vx: 0,
      vy: 0,
      radius: 14,
      angle: attackAngle,
      color: '#f8fafc',
      alpha: 1.0,
      maxLife: 0.48,
      life: 0.48,
      type: 'jiandao_scissor_mark'
    });

    // 5. 金屬咬合高溫摩擦火花 (High-velocity directional shear sparks spraying perpendicular to cut)
    const normalAng1 = attackAngle + Math.PI * 0.5;
    const normalAng2 = attackAngle - Math.PI * 0.5;
    for (let i = 0; i < 10; i++) {
      const baseAng = i % 2 === 0 ? normalAng1 : normalAng2;
      const a = baseAng + (Math.random() - 0.5) * 0.55;
      const spd = 70 + Math.random() * 120;
      particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2.2,
        length: 12 + Math.random() * 8,
        color: Math.random() > 0.3 ? '#fef08a' : '#ffffff',
        alpha: 1.0,
        maxLife: 0.28,
        life: 0.28,
        type: 'jiandao_shear_spark'
      });
    }

    // 6. 銀白與聖金火花飛濺
    for (let i = 0; i < 8; i++) {
      const a = attackAngle + (Math.random() - 0.5) * Math.PI * 0.9;
      const spd = 50 + Math.random() * 100;
      particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2 + Math.random() * 2,
        color: Math.random() > 0.35 ? '#ffffff' : '#fef08a',
        alpha: 1.0,
        maxLife: 0.35,
        life: 0.35,
        type: 'jiandao_holy_burst'
      });
    }

    // 被動一【剪裁之術】: 冷卻時間 1.6 秒。碰撞敵人時額外造成目標最大生命值 5.5% 的傷害，並回復自身等量生命值。
    if ((attacker.jiandaoshouSnipCooldown ?? 0) <= 0) {
      attacker.jiandaoshouSnipCooldown = 1.6;
      attacker.passive1Triggers++;

      const bonusDmg = Math.max(5, Math.round(defender.maxHp * 0.055));
      totalDmg += bonusDmg;
      const healAmount = bonusDmg;
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
      recordHealingStats(attacker, healAmount);
      skillTags.push(`剪裁之術+${bonusDmg}`);

      soundEngine.playJiandaoHeal();

      // 命運剪裁絲線特效 (Glowing fate threads severed and recoiling)
      for (let i = 0; i < 4; i++) {
        const ang = Math.random() * Math.PI * 2;
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: Math.cos(ang) * (30 + Math.random() * 40),
          vy: Math.sin(ang) * (30 + Math.random() * 40),
          radius: 2.5,
          length: 22 + Math.random() * 14,
          angle: ang,
          spin: (Math.random() - 0.5) * 8,
          color: Math.random() > 0.4 ? '#fef08a' : '#ffffff',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'jiandao_fate_thread'
        });
      }

      fctList.push({
        id: `fct_jiandao_heal_${Math.random()}`,
        x: attacker.x,
        y: attacker.y - attacker.radius - 12,
        text: `+${healAmount} 剪裁回復`,
        color: '#fef08a',
        fontSize: 12,
        scale: 1.15,
        shakeIntensity: 0,
        alpha: 1.0,
        life: 0.75,
        maxLife: 0.75,
        vy: -22,
        damageType: 'status',
        damageValue: 0
      });

      // Healing sparks flowing towards attacker
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 20 + Math.random() * 50;
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: Math.cos(a) * spd + (attacker.x - defender.x) * 1.5,
          vy: Math.sin(a) * spd + (attacker.y - defender.y) * 1.5,
          radius: 2.2 + Math.random() * 1.5,
          color: '#fef08a',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'jiandao_heal_spark'
        });
      }
    }
  }

  // If defender has Spiky Bubble active, sync defender's touch timer
  if (defender.characterId === 'fenzuan' && defender.fenzuanBubbleActive) {
    defender.fenzuanBubbleLastTouchTime = matchTime;
  }

  // Mimi Charm Debuff: If attacker is charmed by Mimi, attack damage is reduced by 25%
  if (attacker.isCharmedByMimi && (attacker.charmedByMimiTimer ?? 0) > 0 && totalDmg > 0) {
    totalDmg = Math.max(1, Math.round(totalDmg * 0.75));
    skillTags.push('魅惑-25%傷');
  }

  // Mimi Predatory Synergy: If attacker is Mimi and defender is bleeding by Mimi, +10% bonus attack damage!
  if (attacker.characterId === 'mimi' && defender.isBleedingByMimi && totalDmg > 0) {
    totalDmg = Math.max(1, Math.round(totalDmg * 1.10));
    skillTags.push('捕食本能+10%傷');
  }

  // Apply defender's collision resistance (Tunshimozu 魔軀成長: 每10層 +2% 抗性，最高 10%)
  if (defender.collisionResistance && defender.collisionResistance > 0 && totalDmg > 0) {
    const resPercent = Math.round(defender.collisionResistance * 100);
    totalDmg = Math.max(1, Math.round(totalDmg * (1 - defender.collisionResistance)));
    skillTags.push(`抗性-${resPercent}%`);
  }

  // ===================== CHARGING / RUSHING DEFENDER SAFETY MECHANISM (突進砍人衝刺安全機制) =====================
  // 1. 咪咪 (Mimi) 被動一【貓咪衝爪】發動期間：完全免疫碰撞傷害！
  // 徹底修復撲爪接近敵方時反遭敵方碰撞傷害自殘自爆的重大問題
  if (defender.characterId === 'mimi' && (defender.mimiClawAnimTimer ?? 0) > 0) {
    totalDmg = 0;
    fctList.push({
      id: `fct_mimi_immune_${Math.random()}`,
      x: defender.x,
      y: defender.y - defender.radius - 14,
      text: '免疫 [貓爪突進]',
      color: '#f472b6',
      fontSize: 13,
      scale: 1.25,
      shakeIntensity: 0,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -26,
      damageType: 'status',
      damageValue: 0
    });
  }

  // 2. 虛空獸 (Xukongshou) 被動三【虛空獵擊】極速衝向目標期間：完全免疫碰撞傷害（化身虛空極速幻影）
  if (defender.characterId === 'xukongshou' && (defender.xukongshouHuntActive || defender.isPhantomDash)) {
    totalDmg = 0;
    fctList.push({
      id: `fct_xukong_immune_${Math.random()}`,
      x: defender.x,
      y: defender.y - defender.radius - 14,
      text: '免疫 [虛空極速]',
      color: '#c084fc',
      fontSize: 13,
      scale: 1.25,
      shakeIntensity: 0,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -26,
      damageType: 'status',
      damageValue: 0
    });
  }

  // 3. 凡 (Fan) 被動二【翻滾預知】翻滾位移期間：完全免疫碰撞傷害（翻滾無敵幀）
  if (defender.characterId === 'fan' && defender.fanIsRolling) {
    totalDmg = 0;
    fctList.push({
      id: `fct_fan_roll_immune_${Math.random()}`,
      x: defender.x,
      y: defender.y - defender.radius - 14,
      text: '閃避 [翻滾無敵]',
      color: '#e2e8f0',
      fontSize: 13,
      scale: 1.25,
      shakeIntensity: 0,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -26,
      damageType: 'status',
      damageValue: 0
    });
  }

  // 3.5. 剪刀手 (Jiandaoshou) 被動二【聖霧守護】期間：處於聖霧中時，完全免疫一切普通碰撞攻擊！
  if (defender.characterId === 'jiandaoshou' && defender.jiandaoshouMistActive) {
    totalDmg = 0;
    soundEngine.playJiandaoMistDeflect();
    fctList.push({
      id: `fct_jiandao_immune_${Math.random()}`,
      x: defender.x,
      y: defender.y - defender.radius - 14,
      text: '聖霧格擋 [免疫傷害]',
      color: '#fef08a',
      fontSize: 13,
      scale: 1.25,
      shakeIntensity: 0,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -26,
      damageType: 'status',
      damageValue: 0
    });

    // Holy deflection ring
    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 36,
      color: '#fef08a',
      alpha: 1.0,
      maxLife: 0.35,
      life: 0.35,
      type: 'jiandao_mist_deflect_ring'
    });

    // Deflection halo sparks
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 80;
      particles.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2.2,
        color: '#ffffff',
        alpha: 1.0,
        maxLife: 0.4,
        life: 0.4,
        type: 'jiandao_halo_spark'
      });
    }
  }

  // 4. 粉鑽 (Fenzuan) 被動三【泡泡尖刺】突擊期間：尖刺泡泡力場吸收 35% 碰撞反衝傷害 (削弱自 70%)
  if (defender.characterId === 'fenzuan' && defender.fenzuanBubbleActive && totalDmg > 0) {
    totalDmg = Math.max(1, Math.round(totalDmg * 0.65));
    skillTags.push('泡泡護體-35%傷');
  }

  // 5. 全英雄【戰術瞬衝】期間：瞬衝突進帶有 80% 減傷安全先手保護機制
  if ((defender.tacticalDashTimer ?? 0) > 0 && totalDmg > 0) {
    totalDmg = Math.max(1, Math.round(totalDmg * 0.20));
    skillTags.push('戰術瞬衝減傷-80%');
  }

  // 6. 火桶 (Huotong) 處於滾燙高速衝撞 (速度 >= 200) 時，堅韌外殼減免 15% 碰撞傷害
  if (defender.characterId === 'huotong' && Math.hypot(defender.vx, defender.vy) >= 200 && totalDmg > 0) {
    totalDmg = Math.max(1, Math.round(totalDmg * 0.85));
    skillTags.push('滾燙桶身-15%傷');
  }

  // 7. 龍神 (Longshen) 被動一【龍搖】急速俯衝期間：神龍霸體完全免疫碰撞反噬傷害
  if (defender.characterId === 'longshen' && defender.longshenSwoopActive) {
    totalDmg = 0;
    fctList.push({
      id: `fct_ls_swoop_immune_${Math.random()}`,
      x: defender.x,
      y: defender.y - defender.radius - 14,
      text: '霸體 [神龍俯衝]',
      color: '#f59e0b',
      fontSize: 13,
      scale: 1.25,
      shakeIntensity: 0,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -26,
      damageType: 'status',
      damageValue: 0
    });
  }

  // 射手與法師最終防線：基礎碰撞傷害永久固定為 0，不得透過速度、質量、暴擊或任何碰撞增傷造成物理傷害
  if (isZeroCollision) {
    totalDmg = 0;
  }

  // Apply main collision damage to defender using centralized damage sharing
  let actualDamageTaken = 0;
  if (totalDmg > 0) {
    const tagText = skillTags.length > 0 ? skillTags.join(' ') : '';
    actualDamageTaken = applyDamageWithDamageSharing(
      defender,
      attacker,
      totalDmg,
      attacker.characterId === 'huotong' ? 'flame' : attacker.characterId === 'hailaise' ? 'magic' : 'physical',
      tagText,
      hitX,
      hitY,
      matchTime,
      fctList,
      events,
      particles
    );

    attacker.hitsDealt++;
    defender.hitsReceived++;

    // Log combat event
    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'collision',
      attackerId: attacker.id,
      targetId: defender.id,
      damage: totalDmg,
      text: `${attacker.name} 撞擊 ${defender.name} 造成 ${totalDmg} 點傷害${tagText ? ` [${tagText}]` : ''}`,
      badge: skillTags.join(' | ') || undefined
    });
  }

  // ===================== DEFENDER RETALIATION PASSIVES =====================
  // 0. Tunshimozu Passive 3: 暴食魔爆 (受到碰撞時釋放魔力爆裂，30% 機率，6s 冷卻)
  if (defender.characterId === 'tunshimozu') {
    if ((defender.gluttonyBurstCooldown || 0) <= 0) {
      if (Math.random() <= 0.30) {
        defender.gluttonyBurstCooldown = 6.0; // 6s CD
        defender.passive3Triggers++;
        defender.gluttonyBurstAnimTimer = 0.4;

        const tiers = Math.floor((defender.growthStacks || 0) / 10);
        const burstDmg = 4 + tiers; // 4 ~ 9 magic damage
        const burstRadius = 70 + tiers * 8; // 70px ~ 110px

        soundEngine.playGluttonyBurst();

        // Check if attacker is within burst area
        const distToAttacker = Math.hypot(attacker.x - defender.x, attacker.y - defender.y);
        if (distToAttacker <= burstRadius + attacker.radius) {
          applyDamageWithDamageSharing(
            attacker,
            defender,
            burstDmg,
            'magic',
            '暴食魔爆',
            attacker.x,
            attacker.y,
            matchTime,
            fctList,
            events,
            particles
          );
        }

        // Gluttony Burst FX: Multi-layered shockwaves and demonic crystalline embers
        defender.gluttonyBurstAnimTimer = 0.45;

        // Primary outer shockwave
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: 0,
          vy: 0,
          radius: burstRadius,
          color: '#c084fc',
          alpha: 1.0,
          maxLife: 0.42,
          life: 0.42,
          type: 'gluttony_burst_shockwave'
        });

        // Fast inner core shockwave
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: 0,
          vy: 0,
          radius: burstRadius * 0.55,
          color: '#f0abfc',
          alpha: 1.0,
          maxLife: 0.28,
          life: 0.28,
          type: 'gluttony_burst_shockwave'
        });

        for (let i = 0; i < 24; i++) {
          const angle = (i * Math.PI * 2) / 24 + (Math.random() - 0.5) * 0.3;
          const spd = 70 + Math.random() * 160;
          particles.push({
            x: defender.x,
            y: defender.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 2.2 + Math.random() * 2.8,
            color: i % 3 === 0 ? '#fdf4ff' : i % 2 === 0 ? '#d946ef' : '#7e22ce',
            alpha: 1.0,
            maxLife: 0.4,
            life: 0.4,
            type: 'gluttony_burst_spark'
          });
        }

        // FCT Alert for Gluttony Burst
        fctList.push({
          id: `fct_burst_${Math.random()}`,
          x: defender.x,
          y: defender.y - defender.radius - 20,
          text: `暴食魔爆! ${burstDmg}魔傷`,
          color: '#e879f9',
          fontSize: 13,
          scale: 1.3,
          shakeIntensity: 5,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -28,
          damageType: 'status',
          damageValue: 0
        });

        events.push({
          id: `evt_burst_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: defender.id,
          targetId: attacker.id,
          text: `【暴食魔爆】${defender.name} 遭受撞擊引爆魔力！對範圍內造成 ${burstDmg} 點魔法傷害！`,
          badge: '暴食魔爆'
        });
      }
    }
  }

  // 1. Huotong Passive 1【火焰外殼】: 受到敵方碰撞時，消耗 15 能量對敵人造成 12 點固定火焰傷害 (冷卻 4.0 秒)
  if (defender.characterId === 'huotong' && (defender.huotongFlameShellCooldown <= 0) && tryConsumeEnergy(defender, 15, '火焰外殼', fctList, events)) {
    const thornDmg = 12;
    defender.huotongFlameShellCooldown = 4.0; // 4.0s 冷卻
    applyDamageWithDamageSharing(
      attacker,
      defender,
      thornDmg,
      'flame',
      '火焰外殼',
      attacker.x,
      attacker.y,
      matchTime,
      fctList,
      events,
      particles
    );

    defender.passive1Triggers++;
    defender.flameShellTriggered = true;
    soundEngine.playFlameShell();

    const dx = attacker.x - defender.x;
    const dy = attacker.y - defender.y;
    const baseAngle = Math.atan2(dy, dx);

    for (let i = 0; i < 14; i++) {
      const spread = (Math.random() - 0.5) * 1.4;
      const angle = baseAngle + spread;
      const speed = 70 + Math.random() * 120;
      particles.push({
        x: defender.x,
        y: defender.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3.5 + Math.random() * 3,
        color: Math.random() > 0.4 ? '#ef4444' : '#f97316',
        alpha: 0.95,
        maxLife: 0.38,
        life: 0.38,
        type: 'flame'
      });
    }

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: defender.id,
      targetId: attacker.id,
      damage: thornDmg,
      skillName: '火焰外殼',
      text: `${defender.name} 的【火焰外殼】灼燒反彈，對 ${attacker.name} 造成 ${thornDmg} 點火焰傷害！`,
      badge: '火焰外殼'
    });
  }

  // 2. Hailaise Passive 1【傷害轉換】: 受到傷害時將 35% 轉換為魔法能量，並額外回復 +16 點戰鬥能量！
  if (defender.characterId === 'hailaise' && totalDmg > 0) {
    const energyGained = Math.max(1, Math.round(totalDmg * 0.35));
    const prevEnergy = defender.magicEnergy;
    defender.magicEnergy = Math.min(45, defender.magicEnergy + energyGained);
    const actualGained = defender.magicEnergy - prevEnergy;

    // 回復 +16 點戰鬥能量
    const prevCombatEnergy = defender.energy;
    defender.energy = Math.min(defender.maxEnergy || 100, (defender.energy || 0) + 16);
    const actualCombatGained = defender.energy - prevCombatEnergy;

    if (actualGained > 0 || actualCombatGained > 0) {
      defender.passive1Triggers++;
      soundEngine.playEnergyAbsorb();

      fctList.push({
        id: `fct_${Math.random()}`,
        x: defender.x,
        y: defender.y - defender.radius - 22,
        text: `傷害轉換 +${actualGained}魔能 +${actualCombatGained}能量`,
        color: '#c084fc',
        fontSize: 12,
        alpha: 1.0,
        life: 0.85,
        maxLife: 0.85,
        vy: -28
      });

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 60;
        particles.push({
          x: defender.x,
          y: defender.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 2,
          color: '#e9d5ff',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'arcane_spark'
        });
      }
    }
  }

  // 3. Chanshi Passive 2【金鐘罩】:
  // 禪師受到碰撞傷害時，消耗 15 能量觸發「金鐘罩」。
  // 先正常計算本次碰撞傷害，取得禪師實際受到的碰撞傷害。
  // 反彈傷害 ＝ 實際受到的碰撞傷害 × 25% (例如 10 -> 3, 20 -> 5, 30 -> 8, 40 -> 10)。
  // 將反彈傷害直接施加給造成此次碰撞的敵方球體 (物理傷害)。
  // 同時給予禪師 0.5 秒霸體 (不受減速、擊退與控制影響)。
  if (defender.characterId === 'chanshi' && actualDamageTaken > 0 && tryConsumeEnergy(defender, 15, '金鐘罩', fctList, events)) {
    // 3. Chanshi Passive 2【金鐘罩】: 受到碰撞時消耗 15 能量觸發金鐘罩，反彈 30% 承受傷害並獲得 0.6 秒霸體
    const reflectDmg = Math.round(actualDamageTaken * 0.30);

    // 給予 0.6 秒霸體 & 金鐘罩視覺效果
    defender.chanshiSuperArmorTimer = 0.6;
    defender.chanshiBellShieldTimer = 0.6;
    defender.isSlowedByChanshi = false;
    defender.isParalyzed = false;
    defender.passive2Triggers++;
    soundEngine.playZenBellShield();

    if (reflectDmg > 0) {
      applyDamageWithDamageSharing(
        attacker,
        defender,
        reflectDmg,
        'physical',
        '金鐘罩反彈',
        attacker.x,
        attacker.y,
        matchTime,
        fctList,
        events,
        particles
      );
    }

    // 金鐘罩特效: 碰撞瞬間生成半透明金色鐘形護罩, 碰撞中心金色衝擊波向外擴散, 反彈能量脈衝向敵方球體擴散
    particles.push({
      x: defender.x,
      y: defender.y,
      vx: 0,
      vy: 0,
      radius: defender.radius + 14,
      color: '#fbbf24',
      alpha: 0.9,
      maxLife: 0.5,
      life: 0.5,
      type: 'zen_bell_shield'
    });

    particles.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: 42,
      color: '#fde047',
      alpha: 0.85,
      maxLife: 0.35,
      life: 0.35,
      type: 'zen_shockwave'
    });

    // 金色能量脈衝向敵方擴散
    const dx = attacker.x - defender.x;
    const dy = attacker.y - defender.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    for (let i = 0; i < 14; i++) {
      const spd = 120 + Math.random() * 150;
      const spread = (Math.random() - 0.5) * 0.8;
      const pAngle = Math.atan2(ny, nx) + spread;
      particles.push({
        x: defender.x + nx * defender.radius,
        y: defender.y + ny * defender.radius,
        vx: Math.cos(pAngle) * spd,
        vy: Math.sin(pAngle) * spd,
        radius: 2.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#fef08a' : '#facc15',
        alpha: 1.0,
        maxLife: 0.38,
        life: 0.38,
        type: 'zen_pulse'
      });
    }

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: defender.id,
      targetId: attacker.id,
      damage: reflectDmg,
      skillName: '金鐘罩',
      text: `${defender.name} 的【金鐘罩】反彈 ${reflectDmg} 點物理傷害並獲得 0.5s 霸體！`,
      badge: `金鐘罩 (反彈${reflectDmg}傷+霸體)`
    });
  }
}

/**
 * Lingyinsi Passive 1: Auto-fires Psionic Blue Arrow every 5 seconds (Main Body + All Clones Sync)
 */
function updateLingyinsiBlueArrowTrigger(
  self: BallState,
  target: BallState,
  dt: number,
  projectiles: Projectile[],
  fctList: FloatingText[] | undefined,
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lingyinsi' || self.hp <= 0) return;

  self.blueArrowCooldown -= dt;
  if (self.blueArrowCooldown <= 0) {
    if (!tryConsumeEnergy(self, 20, '靈能藍光箭', fctList, events)) {
      self.blueArrowCooldown = 1.0;
      return;
    }
    self.blueArrowCooldown = 3.8; // v2.6: 3.8s CD (遠程射手冷卻+1s)
    self.passive1Triggers++;

    const speed = 480; // v2.6: 提升彈道速度至 480px/s，改善遠程命中手感

    // 1. Launch from Main Body (aimed at enemy's current position, non-homing)
    const angleMain = Math.atan2(target.y - self.y, target.x - self.x);
    projectiles.push({
      id: `blue_arrow_main_${Math.random()}`,
      ownerId: self.id,
      targetId: target.id,
      type: 'blue_light_arrow',
      x: self.x,
      y: self.y,
      vx: Math.cos(angleMain) * speed,
      vy: Math.sin(angleMain) * speed,
      width: 28,
      height: 6,
      radius: 6,
      damage: 28, // v2.6: 28 physical damage (提高單次技能傷害)
      isPhysical: true,
      life: 3.0,
      maxLife: 3.0,
      color: '#38bdf8',
      trail: []
    });

    // Muzzle particles on main body
    for (let i = 0; i < 8; i++) {
      const a = angleMain + (Math.random() - 0.5) * 0.8;
      const spd = 60 + Math.random() * 100;
      particles.push({
        x: self.x,
        y: self.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2.5,
        color: '#38bdf8',
        alpha: 1.0,
        maxLife: 0.25,
        life: 0.25,
        type: 'psionic_arrow_spark'
      });
    }

    // 2. Synchronized Launch from all alive Clones
    if (self.clones && self.clones.length > 0) {
      self.clones.forEach(clone => {
        if (clone.hp <= 0) return;

        const angleClone = Math.atan2(target.y - clone.y, target.x - clone.x);
        projectiles.push({
          id: `blue_arrow_clone_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          type: 'blue_light_arrow',
          x: clone.x,
          y: clone.y,
          vx: Math.cos(angleClone) * speed,
          vy: Math.sin(angleClone) * speed,
          width: 28,
          height: 6,
          radius: 6,
          damage: 26, // v2.6: 26 physical damage (buffed from 22)
          isPhysical: true,
          life: 3.0,
          maxLife: 3.0,
          color: '#38bdf8',
          trail: []
        });

        // Muzzle particles on clone
        for (let i = 0; i < 6; i++) {
          const a = angleClone + (Math.random() - 0.5) * 0.8;
          const spd = 50 + Math.random() * 80;
          particles.push({
            x: clone.x,
            y: clone.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#7dd3fc',
            alpha: 1.0,
            maxLife: 0.25,
            life: 0.25,
            type: 'psionic_arrow_spark'
          });
        }
      });
    }

    soundEngine.playPsionicArrow();

    const cloneCount = self.clones ? self.clones.filter(c => c.hp > 0).length : 0;
    events.push({
      id: `evt_${Math.random()}`,
      timestamp: Date.now() * 0.001,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      damage: 22,
      skillName: '靈能藍光箭',
      text: `${self.name}${cloneCount > 0 ? ` 與 ${cloneCount} 個分身同步` : ''}發射【靈能藍光箭】(22物傷)！`,
      badge: '靈能藍光箭'
    });
  }
}

/**
 * Lingyinsi Passive 2: Auto-summons 1 stationary clone every 25s (Max 2 clones)
 */
function updateLingyinsiCloneSummonTrigger(
  self: BallState,
  dt: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lingyinsi' || self.hp <= 0) return;

  // Filter out destroyed clones
  self.clones = (self.clones || []).filter(c => c.hp > 0);

  self.cloneCooldown -= dt;
  if (self.cloneCooldown <= 0) {
    // Max 2 clones concurrent
    if (self.clones.length < 2) {
      if (!tryConsumeEnergy(self, 30, '分身術', fctList, events)) {
        self.cloneCooldown = 1.0;
        return;
      }
      self.cloneCooldown = 10.0; // Reset 10s timer (balanced down from 16s)
      // Calculate spawn offset (within arena bounds)
      const offsetDistance = 55;
      const angle = self.clones.length === 0 ? (self.id === 'p1' ? 0.8 : 2.3) : (self.id === 'p1' ? -0.8 : -2.3);
      let spawnX = self.x + Math.cos(angle) * offsetDistance;
      let spawnY = self.y + Math.sin(angle) * offsetDistance;

      // Clamp to bounds
      spawnX = Math.max(50, Math.min(ARENA_WIDTH - 50, spawnX));
      spawnY = Math.max(50, Math.min(ARENA_HEIGHT - 50, spawnY));

      const cloneMaxHp = Math.round(self.maxHp * 0.15); // 15% of 360 = 54 HP (buffed from 10%)
      const newClone: LingyinsiClone = {
        id: `clone_${Math.random()}`,
        ownerId: self.id,
        x: spawnX,
        y: spawnY,
        radius: 14 * BASE_RADIUS_SCALE,
        maxHp: cloneMaxHp,
        hp: cloneMaxHp,
        createdTime: Date.now() * 0.001
      };

      self.clones.push(newClone);
      self.passive2Triggers++;

      soundEngine.playCloneSummon();

      // Summon spiritual burst particles
      particles.push({
        x: spawnX,
        y: spawnY,
        vx: 0,
        vy: 0,
        radius: 40,
        color: '#38bdf8',
        alpha: 0.9,
        maxLife: 0.35,
        life: 0.35,
        type: 'shockwave'
      });

      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 120;
        particles.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2,
          color: '#38bdf8',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'spirit_dissolve'
        });
      }

      fctList.push({
        id: `fct_${Math.random()}`,
        x: spawnX,
        y: spawnY - 20,
        text: `【召喚分身 54HP】`,
        color: '#38bdf8',
        fontSize: 13,
        alpha: 1.0,
        life: 1.0,
        maxLife: 1.0,
        vy: -25
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: Date.now() * 0.001,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: self.id,
        skillName: '靈隱寺分身術',
        text: `${self.name} 施展【靈隱寺分身術】，召喚第 ${self.clones.length} 個靜止分身 (54HP，120px內分攤30%傷害)！`,
        badge: '靈隱寺分身術'
      });
    }
  }
}

/**
 * Lingyinsi Passive 3: Auto-generates 3 Orbiting Green Orbs every 18s (24 Physical DMG on Hit)
 */
function updateLingyinsiGreenOrbsTrigger(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lingyinsi' || self.hp <= 0) return;

  // 1. Cooldown timer count
  self.greenOrbsCooldown -= dt;
  if (self.greenOrbsCooldown <= 0 && (!self.greenOrbsActive || self.greenOrbs.length === 0)) {
    if (!tryConsumeEnergy(self, 40, '聚集回金集', fctList, events)) {
      self.greenOrbsCooldown = 1.0;
      return;
    }
    // Generate 3 green glowing orb rings revolving around self
    self.greenOrbs = [
      { id: `gorb_0_${Math.random()}`, angle: 0, radius: 7, active: true },
      { id: `gorb_1_${Math.random()}`, angle: (Math.PI * 2) / 3, radius: 7, active: true },
      { id: `gorb_2_${Math.random()}`, angle: (Math.PI * 4) / 3, radius: 7, active: true }
    ];
    self.greenOrbsActive = true;
    self.greenOrbsDuration = 16.0; // 16s duration or until consumed
    self.greenOrbsHitTriggered = false;
    self.greenOrbsCooldown = 12.0; // Initial 12s cooldown (balanced down from 18s)
    self.passive3Triggers++;

    soundEngine.playGreenOrbsSummon();

    // Manifestation ring aura
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: 46,
      color: '#22c55e',
      alpha: 0.9,
      maxLife: 0.35,
      life: 0.35,
      type: 'shockwave'
    });

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      skillName: '聚集回金集',
      text: `${self.name} 施展【聚集回金集】，生成 3 個綠色光圈球體圍繞旋轉！`,
      badge: '聚集回金集'
    });
  }

  // 2. Update active orbiting green orbs
  if (self.greenOrbsActive && self.greenOrbs && self.greenOrbs.length > 0) {
    self.greenOrbsOrbitAngle = (self.greenOrbsOrbitAngle || 0) + dt * 3.6;
    self.greenOrbsDuration -= dt;

    const orbitRadius = 42;

    // Check collision with enemy ball
    for (const orb of self.greenOrbs) {
      if (!orb.active) continue;

      const currentAngle = orb.angle + self.greenOrbsOrbitAngle;
      const ox = self.x + Math.cos(currentAngle) * orbitRadius;
      const oy = self.y + Math.sin(currentAngle) * orbitRadius;

      const odx = target.x - ox;
      const ody = target.y - oy;
      const odist = Math.hypot(odx, ody);
      const hitRadius = target.radius + orb.radius;

      if (odist <= hitRadius) {
        // GREEN ORB COLLISION DETONATION!
        orb.active = false;
        const orbDmg = 36; // 36 physical damage (buffed from 26)

        applyDamageWithDamageSharing(
          target,
          self,
          orbDmg,
          'physical',
          '回金集+36',
          ox,
          oy,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        soundEngine.playGreenOrbHit();

        // If this is the first hit in the cycle, trigger the 12s cooldown
        if (!self.greenOrbsHitTriggered) {
          self.greenOrbsHitTriggered = true;
          self.greenOrbsCooldown = 12.0; // Enters 12s cooldown on hit
        }

        // Green crystal explosion particles
        particles.push({
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          radius: 36,
          color: '#22c55e',
          alpha: 0.95,
          maxLife: 0.3,
          life: 0.3,
          type: 'shockwave'
        });

        for (let i = 0; i < 14; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 70 + Math.random() * 140;
          particles.push({
            x: ox,
            y: oy,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 3,
            color: '#86efac',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'green_orb_spark'
          });
        }

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: target.id,
          damage: orbDmg,
          skillName: '聚集回金集',
          text: `${self.name} 的【聚集回金集】綠色光圈命中 ${target.name} 造成 ${orbDmg} 點物理傷害！`,
          badge: '回金集命中'
        });
      }
    }

    // Check if all orbs consumed or expired
    const activeOrbs = self.greenOrbs.filter(o => o.active);
    if (activeOrbs.length === 0 || self.greenOrbsDuration <= 0) {
      self.greenOrbsActive = false;
      self.greenOrbs = [];
    }
  }
}

/**
 * Hailaise Passive 2: Auto-fires Purple Energy Bar every 7 seconds
 */
function updateHailaiseBeamTrigger(
  self: BallState,
  target: BallState,
  dt: number,
  projectiles: Projectile[],
  fctList: FloatingText[] | undefined,
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'hailaise' || self.hp <= 0) return;

  self.energyBeamCooldown -= dt;
  if (self.energyBeamCooldown <= 0) {
    if (!tryConsumeEnergy(self, 25, '紫色能量條', fctList, events)) {
      self.energyBeamCooldown = 1.0;
      return;
    }
    self.energyBeamCooldown = 3.8; // v2.6: 3.8s CD (法師冷卻+1s)

    const targetCenterX = ARENA_WIDTH * 0.5 + (Math.random() * 200 - 100);
    const targetCenterY = ARENA_HEIGHT * 0.5 + (Math.random() * 160 - 80);
    const baseAngle = Math.atan2(targetCenterY - self.y, targetCenterX - self.x) + (Math.random() * 0.6 - 0.3);

    const speed = 520; // v2.6: 提升彈道速度至 520px/s (原 420)，大幅改善技能手感
    const vx = Math.cos(baseAngle) * speed;
    const vy = Math.sin(baseAngle) * speed;

    projectiles.push({
      id: `beam_${Math.random()}`,
      ownerId: self.id,
      targetId: target.id,
      type: 'purple_energy_bar',
      x: self.x,
      y: self.y,
      vx,
      vy,
      width: 40,
      height: 10,
      radius: 9,
      damage: 54, // v2.6: 調高基礎傷害至 54 (原 48)
      life: 3.5,
      maxLife: 3.5,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 12.5,
      wobbleAmp: 65,
      color: '#a855f7',
      trail: []
    });

    self.passive2Triggers++;
    soundEngine.playArcaneBeam();

    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: 32,
      color: '#c084fc',
      alpha: 0.9,
      maxLife: 0.25,
      life: 0.25,
      type: 'shockwave'
    });

    for (let i = 0; i < 12; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.2;
      const spd = 80 + Math.random() * 120;
      particles.push({
        x: self.x,
        y: self.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#c084fc' : '#e9d5ff',
        alpha: 1.0,
        maxLife: 0.35,
        life: 0.35,
        type: 'arcane_spark'
      });
    }

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: Date.now() * 0.001,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      damage: 48,
      skillName: '紫色能量條',
      text: `${self.name} 自動釋放疾速【紫色能量條】(420速/48基礎魔傷)，狂暴貫穿戰場！`,
      badge: '紫色能量條'
    });
  }
}

/**
 * Hailaise Passive 3: 每40秒發射3顆紫色爆彈（非指定性技能）
 * 不再依靠生命發動！
 * 每一顆傷害命中同一位敵人傷害遞減：每一顆魔法傷害20，後續命中同一個敵人減少1傷害 (20 -> 19 -> 18)
 */
function updateHailaiseBombTrigger(
  self: BallState,
  target: BallState,
  dt: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'hailaise' || self.hp <= 0) return;

  if (self.hailaiseBombCooldown === undefined) {
    self.hailaiseBombCooldown = 40.0;
  }

  self.hailaiseBombCooldown -= dt;

  if (self.hailaiseBombCooldown <= 0) {
    self.hailaiseBombCooldown = 40.0; // 每40秒重置
    self.passive3Triggers++;

    soundEngine.playMimiHeartExplode();

    const volleyId = `hailaise_volley_${self.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const baseAngle = Math.atan2(target.y - self.y, target.x - self.x);
    const bombSpeed = 400; // v2.6: 提升彈道速度 (330 -> 400)
    const spreadOffsets = [-0.22, 0, 0.22]; // 3 non-targeted skillshot paths

    spreadOffsets.forEach((offset, idx) => {
      const angle = baseAngle + offset;
      const vx = Math.cos(angle) * bombSpeed;
      const vy = Math.sin(angle) * bombSpeed;

      projectiles.push({
        id: `purple_bomb_${self.id}_${idx}_${Math.random()}`,
        ownerId: self.id,
        targetId: target.id,
        type: 'purple_bomb',
        x: self.x + Math.cos(angle) * (self.radius + 8),
        y: self.y + Math.sin(angle) * (self.radius + 8),
        vx,
        vy,
        radius: 10,
        damage: 20, // 首發 20 點魔法傷害，命中同一敵人遞減 -1
        life: 3.8,
        maxLife: 3.8,
        color: '#a855f7',
        trail: [],
        volleyId,
        bombIndex: idx
      });
    });

    fctList.push({
      id: `fct_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 28,
      text: '【紫色爆彈 3連發!】(每枚20魔傷/同目標遞減)',
      color: '#c084fc',
      fontSize: 13,
      alpha: 1.0,
      life: 1.2,
      maxLife: 1.2,
      vy: -26
    });

    // Launch shockwave
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: 46,
      color: '#a855f7',
      alpha: 0.95,
      maxLife: 0.35,
      life: 0.35,
      type: 'shockwave'
    });

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 130;
      particles.push({
        x: self.x,
        y: self.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2.8 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#c084fc' : '#f5d0fe',
        alpha: 1.0,
        maxLife: 0.4,
        life: 0.4,
        type: 'arcane_spark'
      });
    }

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: Date.now() * 0.001,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      damage: 20,
      skillName: '紫色爆彈',
      text: `${self.name} 每40秒釋放【紫色爆彈】！3顆魔法爆彈非指定連射，逐發遞減打擊敵人！`,
      badge: '紫色爆彈'
    });
  }
}

/**
 * 咪咪 (Mimi) 愛心飛射 80px 範圍爆裂觸發器
 * 當愛心直接命中、觸碰競技場邊界、或達到 300px 最大距離時引爆
 * 80px 範圍內造成 6 點魔法傷害並魅惑敵人 2 秒
 */
function triggerMimiHeartExplosion(
  proj: Projectile,
  owner: BallState,
  target: BallState,
  expX: number,
  expY: number,
  reason: string,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  soundEngine.playMimiHeartExplode();
  const aoeRadius = 80;
  const aoeDamage = 20; // v2.6: Buffed to 20 (from 16)

  // 80px visual shockwave ring
  particles.push({
    x: expX,
    y: expY,
    vx: 0,
    vy: 0,
    radius: aoeRadius,
    color: '#ec4899',
    alpha: 0.85,
    maxLife: 0.35,
    life: 0.35,
    type: 'shockwave'
  });

  // 18 Pink heart & glimmer burst particles
  for (let i = 0; i < 18; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = 40 + Math.random() * 100;
    particles.push({
      x: expX,
      y: expY,
      vx: Math.cos(a) * spd,
      vy: Math.sin(a) * spd,
      radius: 2.2 + Math.random() * 2.5,
      color: Math.random() > 0.35 ? '#ec4899' : '#fbcfe8',
      alpha: 1.0,
      maxLife: 0.4,
      life: 0.4,
      type: 'mimi_heart_explosion'
    });
  }

  // Check AoE on enemy ball
  const distToTarget = Math.hypot(target.x - expX, target.y - expY);
  if (distToTarget <= aoeRadius + target.radius) {
    applyDamageWithDamageSharing(
      target,
      owner,
      aoeDamage,
      'magic',
      '愛心飛射 [魅惑2s]',
      target.x,
      target.y,
      matchTime,
      fctList,
      events,
      particles
    );

    target.hitsReceived++;
    owner.passive2Triggers = (owner.passive2Triggers || 0) + 1;

    // Apply 2.0s Charm (魅惑) to target
    target.isCharmedByMimi = true;
    target.charmedByMimiTimer = 2.0;
    target.charmedByMimiSourceId = owner.id;

    fctList.push({
      id: `fct_charm_${Math.random()}`,
      x: target.x,
      y: target.y - target.radius - 12,
      text: '魅惑 2.0s!',
      color: '#ec4899',
      fontSize: 13,
      alpha: 1.0,
      life: 0.85,
      maxLife: 0.85,
      vy: -25
    });

    events.push({
      id: `evt_mimi_charm_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: owner.id,
      targetId: target.id,
      skillName: '愛心飛射',
      text: `【愛心飛射】${owner.name} 的愛心（${reason}）觸發 80px 爆裂！對 ${target.name} 造成 ${aoeDamage} 點魔法傷害並魅惑 2 秒（使其不由自主緩步靠近咪咪）！`,
      badge: '魅惑2s'
    });
  }
}

/**
 * Update Projectile Positions, Homing Steer, and Collisions with Balls & Clones
 */
function updateProjectiles(
  projectiles: Projectile[],
  b1: BallState,
  b2: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
): Projectile[] {
  const active: Projectile[] = [];

  for (const proj of projectiles) {
    proj.life -= dt;
    if (proj.life <= 0) {
      // 蜘蛛獵網飛彈若落空或超時落地，在著彈點生成直徑 90px 黏稠蛛網區域
      if (proj.type === 'spider_web_net') {
        const owner = proj.ownerId === 'p1' ? b1 : b2;
        const newWebZone: SpiderWebZone = {
          id: `web_zone_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ownerId: owner.id,
          x: Math.max(45, Math.min(ARENA_WIDTH - 45, proj.x)),
          y: Math.max(45, Math.min(ARENA_HEIGHT - 45, proj.y)),
          radius: 45,
          duration: 2.5,
          maxDuration: 2.5,
          createdTime: matchTime
        };
        if (!owner.spiderWebZones) owner.spiderWebZones = [];
        owner.spiderWebZones.push(newWebZone);
        soundEngine.playSpiderWeb();
      }
      continue;
    }

    const owner = proj.ownerId === 'p1' ? b1 : b2;
    const target = proj.ownerId === 'p1' ? b2 : b1;

    // --- UPDATE MOVEMENT ---
    if (proj.type === 'purple_energy_bar') {
      proj.wobblePhase = (proj.wobblePhase || 0) + dt * (proj.wobbleSpeed || 12.5);
      const mainSpeed = Math.hypot(proj.vx, proj.vy) || 420;
      const mainAngle = Math.atan2(proj.vy, proj.vx);
      const waveOffset = Math.sin(proj.wobblePhase) * (proj.wobbleAmp || 65);

      const perpAngle = mainAngle + Math.PI / 2;
      const stepVx = Math.cos(mainAngle) * mainSpeed + Math.cos(perpAngle) * waveOffset;
      const stepVy = Math.sin(mainAngle) * mainSpeed + Math.sin(perpAngle) * waveOffset;

      proj.x += stepVx * dt;
      proj.y += stepVy * dt;

      if (proj.x < 10 || proj.x > ARENA_WIDTH - 10) {
        proj.vx = -proj.vx;
        proj.x = Math.max(10, Math.min(ARENA_WIDTH - 10, proj.x));
      }
      if (proj.y < 10 || proj.y > ARENA_HEIGHT - 10) {
        proj.vy = -proj.vy;
        proj.y = Math.max(10, Math.min(ARENA_HEIGHT - 10, proj.y));
      }
    } else if (proj.type === 'purple_bomb') {
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // 邊界反彈
      if (proj.x < 12) {
        proj.x = 12;
        proj.vx = Math.abs(proj.vx) * 0.96;
      } else if (proj.x > ARENA_WIDTH - 12) {
        proj.x = ARENA_WIDTH - 12;
        proj.vx = -Math.abs(proj.vx) * 0.96;
      }
      if (proj.y < 12) {
        proj.y = 12;
        proj.vy = Math.abs(proj.vy) * 0.96;
      } else if (proj.y > ARENA_HEIGHT - 12) {
        proj.y = ARENA_HEIGHT - 12;
        proj.vy = -Math.abs(proj.vy) * 0.96;
      }
    } else if (proj.type === 'magic_missile') {
      const tdx = target.x - proj.x;
      const tdy = target.y - proj.y;
      const tdist = Math.hypot(tdx, tdy);

      if (tdist > 1) {
        const desiredAngle = Math.atan2(tdy, tdx);
        const currentAngle = Math.atan2(proj.vy, proj.vx);
        let angleDiff = desiredAngle - currentAngle;

        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const turnRate = 8.5;
        const newAngle = currentAngle + angleDiff * Math.min(1.0, turnRate * dt);
        const currentSpeed = Math.min(360, (Math.hypot(proj.vx, proj.vy) || 220) + 120 * dt);

        proj.vx = Math.cos(newAngle) * currentSpeed;
        proj.vy = Math.sin(newAngle) * currentSpeed;
      }

      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
    } else if (
      proj.type === 'blue_light_arrow' ||
      proj.type === 'lanzuan_bullet' ||
      proj.type === 'lanzuan_crystal_ray' ||
      proj.type === 'fan_hunter_arrow' ||
      proj.type === 'jiandao_needle' ||
      proj.type === 'dina_white_light' ||
      proj.type === 'dina_dark_light' ||
      proj.type === 'dina_fusion_orb' ||
      proj.type === 'jianxian_burst_sword' ||
      proj.type === 'jianxian_slow_sword' ||
      proj.type === 'jianxian_sword_qi' ||
      proj.type === 'spider_web_net' ||
      proj.type === 'xin_sword_strike' ||
      proj.type === 'xin_sky_cleave' ||
      proj.type === 'junko_bandage_arrow'
    ) {
      // Straight fast skillshot (non-homing)
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // 劍仙 - 白劍爆裂飛行距離判定 (到達 420px 產生 70px 爆炸)
      if (proj.type === 'jianxian_burst_sword') {
        const stepDist = Math.hypot(proj.vx * dt, proj.vy * dt);
        proj.traveledDist = (proj.traveledDist || 0) + stepDist;
        if (proj.traveledDist >= (proj.maxDistance || 420)) {
          triggerJianxianBurstExplosion(proj, owner, b1, b2, matchTime, fctList, events, particles);
          continue;
        }
      }

      // Dina Light Projectiles Trails & Independent Particle Tracking VFX
      if (proj.type === 'dina_white_light' || proj.type === 'dina_dark_light' || proj.type === 'dina_fusion_orb') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.95 });
        if (proj.trail.length > 8) proj.trail.pop();

        if (proj.type === 'dina_white_light') {
          // 蒂納 - 白光獨立粒子追蹤特效：銀白璀璨四芒星與微金星屑
          if (Math.random() < 0.65) {
            const spread = (Math.random() - 0.5) * 6;
            particles.push({
              x: proj.x - proj.vx * dt * 0.4 + spread,
              y: proj.y - proj.vy * dt * 0.4 + spread,
              vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 16,
              vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 16,
              radius: 1.8 + Math.random() * 1.4,
              color: Math.random() > 0.35 ? '#ffffff' : '#fef08a',
              alpha: 1.0,
              maxLife: 0.24 + Math.random() * 0.08,
              life: 0.24 + Math.random() * 0.08,
              type: 'dina_white_spark',
              angle: Math.random() * Math.PI,
              spin: (Math.random() - 0.5) * 6
            });
          }
        } else if (proj.type === 'dina_dark_light') {
          // 蒂納 - 暗光獨立粒子追蹤特效：暗夜紫晶星芒與深淵虛空塵
          if (Math.random() < 0.70) {
            const spread = (Math.random() - 0.5) * 8;
            particles.push({
              x: proj.x - proj.vx * dt * 0.4 + spread,
              y: proj.y - proj.vy * dt * 0.4 + spread,
              vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 18,
              vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 18,
              radius: 2.0 + Math.random() * 1.6,
              color: Math.random() > 0.4 ? '#c084fc' : (Math.random() > 0.5 ? '#e879f9' : '#7e22ce'),
              alpha: 1.0,
              maxLife: 0.26 + Math.random() * 0.08,
              life: 0.26 + Math.random() * 0.08,
              type: 'dina_dark_spark',
              angle: Math.random() * Math.PI,
              spin: -(Math.random() - 0.5) * 6
            });
          }
        } else if (proj.type === 'dina_fusion_orb') {
          // 蒂納 - 融合光球獨立粒子追蹤特效：雙極雙螺旋旋轉星芒軌跡 (白紫雙色交融)
          const isPerfect = proj.dinaFusionType === 'perfect';
          const orbitAngle = ((proj.x + proj.y) * 0.12 + matchTime * 14) % (Math.PI * 2);
          const orbitRadius = 7.5;
          
          // Phase A: 銀白星芒
          particles.push({
            x: proj.x + Math.cos(orbitAngle) * orbitRadius,
            y: proj.y + Math.sin(orbitAngle) * orbitRadius,
            vx: -proj.vx * 0.06 + Math.cos(orbitAngle + Math.PI / 2) * 25,
            vy: -proj.vy * 0.06 + Math.sin(orbitAngle + Math.PI / 2) * 25,
            radius: 2.2 + Math.random() * 1.0,
            color: '#ffffff',
            alpha: 1.0,
            maxLife: 0.24,
            life: 0.24,
            type: 'dina_fusion_spark',
            angle: orbitAngle,
            spin: 5
          });

          // Phase B: 深邃黑紫 / 完美緋紅星芒
          particles.push({
            x: proj.x + Math.cos(orbitAngle + Math.PI) * orbitRadius,
            y: proj.y + Math.sin(orbitAngle + Math.PI) * orbitRadius,
            vx: -proj.vx * 0.06 + Math.cos(orbitAngle - Math.PI / 2) * 25,
            vy: -proj.vy * 0.06 + Math.sin(orbitAngle - Math.PI / 2) * 25,
            radius: 2.2 + Math.random() * 1.0,
            color: isPerfect ? '#f43f5e' : (Math.random() > 0.5 ? '#c084fc' : '#e879f9'),
            alpha: 1.0,
            maxLife: 0.24,
            life: 0.24,
            type: 'dina_fusion_spark',
            angle: orbitAngle + Math.PI,
            spin: -5
          });
        }
      }

      // Jiandaoshou Holy Needle particle trail
      if (proj.type === 'jiandao_needle') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.95 });
        if (proj.trail.length > 8) proj.trail.pop();

        if (Math.random() < 0.6) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 2,
            y: proj.y + (Math.random() - 0.5) * 2,
            vx: -proj.vx * 0.05 + (Math.random() - 0.5) * 8,
            vy: -proj.vy * 0.05 + (Math.random() - 0.5) * 8,
            radius: 1.4,
            length: 6,
            color: Math.random() > 0.3 ? '#ffffff' : '#fef08a',
            alpha: 0.8,
            maxLife: 0.18,
            life: 0.18,
            type: 'jiandao_needle_spark'
          });
        }
      }

      // Fan hunter arrow particle trail (gold and silver sparkles + afterimages)
      if (proj.type === 'fan_hunter_arrow') {
        // Gold & Silver sparkling trail particles
        if (Math.random() < 0.85) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 3,
            y: proj.y + (Math.random() - 0.5) * 3,
            vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 10,
            vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 10,
            radius: 1.5 + Math.random() * 1.5,
            color: Math.random() > 0.45 ? '#facc15' : '#f8fafc',
            alpha: 0.85,
            maxLife: 0.22,
            life: 0.22,
            type: 'fan_arrow_spark'
          });
        }

        // Faint aerodynamic arrow phantom afterimage
        if (Math.random() < 0.4) {
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: -proj.vx * 0.03,
            vy: -proj.vy * 0.03,
            radius: 3,
            color: Math.random() > 0.5 ? '#facc15' : '#ffffff',
            alpha: 0.45,
            maxLife: 0.16,
            life: 0.16,
            angle: Math.atan2(proj.vy, proj.vx),
            type: 'fan_arrow_afterimage'
          });
        }
      }

      // Lanzuan bullet particle trail
      if (proj.type === 'lanzuan_bullet' && Math.random() < 0.65) {
        particles.push({
          x: proj.x + (Math.random() - 0.5) * 4,
          y: proj.y + (Math.random() - 0.5) * 4,
          vx: -proj.vx * 0.12 + (Math.random() - 0.5) * 12,
          vy: -proj.vy * 0.12 + (Math.random() - 0.5) * 12,
          radius: 1.8 + Math.random() * 1.2,
          color: Math.random() > 0.35 ? '#38bdf8' : '#e0f2fe',
          alpha: 0.85,
          maxLife: 0.22,
          life: 0.22,
          type: 'lanzuan_spark'
        });
      }

      // 劍仙 - 白劍爆裂飛劍粒子拖尾 (仙靈白光與銀藍劍氣殘影)
      if (proj.type === 'jianxian_burst_sword') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.95 });
        if (proj.trail.length > 8) proj.trail.pop();

        if (Math.random() < 0.7) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 4,
            y: proj.y + (Math.random() - 0.5) * 4,
            vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 10,
            vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 10,
            radius: 1.8 + Math.random() * 1.2,
            color: Math.random() > 0.4 ? '#ffffff' : '#bae6fd',
            alpha: 0.9,
            maxLife: 0.2,
            life: 0.2,
            type: 'jianxian_burst_spark'
          });
        }
      }

      // 劍仙 - 退劍緩行飛劍粒子拖尾 (冰霜太極仙符碎屑)
      if (proj.type === 'jianxian_slow_sword') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.95 });
        if (proj.trail.length > 8) proj.trail.pop();

        if (Math.random() < 0.75) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 4,
            y: proj.y + (Math.random() - 0.5) * 4,
            vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 12,
            vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 12,
            radius: 2.0,
            color: Math.random() > 0.5 ? '#38bdf8' : '#e0f2fe',
            alpha: 0.9,
            maxLife: 0.22,
            life: 0.22,
            type: 'jianxian_slow_frost'
          });
        }
      }

      // 劍仙 - 百萬劍氣粒子拖尾
      if (proj.type === 'jianxian_sword_qi') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.9 });
        if (proj.trail.length > 5) proj.trail.pop();

        if (Math.random() < 0.4 && particles) {
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: -proj.vx * 0.05,
            vy: -proj.vy * 0.05,
            radius: 1.2,
            color: '#bae6fd',
            alpha: 0.8,
            maxLife: 0.15,
            life: 0.15,
            type: 'jianxian_burst_spark'
          });
        }
      }

      // 蜘蛛 - 獵網束縛飛網粒子拖尾 (黏性蛛絲與翡翠毒沫)
      if (proj.type === 'spider_web_net') {
        if (!proj.trail) proj.trail = [];
        proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 0.95 });
        if (proj.trail.length > 8) proj.trail.pop();

        if (Math.random() < 0.7 && particles) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 6,
            y: proj.y + (Math.random() - 0.5) * 6,
            vx: -proj.vx * 0.08 + (Math.random() - 0.5) * 12,
            vy: -proj.vy * 0.08 + (Math.random() - 0.5) * 12,
            radius: 1.6 + Math.random() * 1.2,
            color: Math.random() > 0.4 ? '#10b981' : '#ffffff',
            alpha: 0.85,
            maxLife: 0.22,
            life: 0.22,
            type: 'smoke'
          });
        }
      }

      // 辛 - 魔劍普攻劍氣微導引與飛行星塵尾跡
      if (proj.type === 'xin_sword_strike') {
        // 輕微尋敵靈動微導向 (Soft homing during first 0.35s)
        if (target && target.hp > 0 && proj.life > (proj.maxLife - 0.35)) {
          const tdx = target.x - proj.x;
          const tdy = target.y - proj.y;
          const curAng = Math.atan2(proj.vy, proj.vx);
          const tgtAng = Math.atan2(tdy, tdx);
          let diffAng = tgtAng - curAng;
          while (diffAng > Math.PI) diffAng -= Math.PI * 2;
          while (diffAng < -Math.PI) diffAng += Math.PI * 2;
          const turnRate = 2.4 * dt;
          const newAng = curAng + Math.max(-turnRate, Math.min(turnRate, diffAng));
          const spd = Math.hypot(proj.vx, proj.vy) || 540;
          proj.vx = Math.cos(newAng) * spd;
          proj.vy = Math.sin(newAng) * spd;
        }

        if (Math.random() < 0.6 && particles) {
          const isDark = proj.extraData?.form === 'dark';
          const isLight = proj.extraData?.form === 'light';
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 6,
            y: proj.y + (Math.random() - 0.5) * 6,
            vx: -proj.vx * 0.06 + (Math.random() - 0.5) * 14,
            vy: -proj.vy * 0.06 + (Math.random() - 0.5) * 14,
            radius: 1.8,
            color: isDark ? '#c084fc' : (isLight ? '#fef08a' : '#ffffff'),
            alpha: 0.85,
            maxLife: 0.2,
            life: 0.2,
            type: 'xin_sword_trail'
          });
        }
      }

      // 辛 - 裂空劍痕空間撕裂碎屑
      if (proj.type === 'xin_sky_cleave') {
        if (Math.random() < 0.45 && particles) {
          const cleaveAng = Math.atan2(proj.vy, proj.vx);
          const isDark = proj.extraData?.form === 'dark';
          const isLight = proj.extraData?.form === 'light';
          particles.push({
            x: proj.x - Math.cos(cleaveAng) * 16 + (Math.random() - 0.5) * 8,
            y: proj.y - Math.sin(cleaveAng) * 16 + (Math.random() - 0.5) * 8,
            vx: -proj.vx * 0.03,
            vy: -proj.vy * 0.03,
            radius: 2,
            length: 22,
            angle: cleaveAng + (Math.random() - 0.5) * 0.5,
            color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#93c5fd'),
            alpha: 0.85,
            maxLife: 0.26,
            life: 0.26,
            type: 'xin_spatial_rift_crack',
            extraData: { jag1: 5, jag2: -4, jag3: 3 }
          });
        }
      }
    } else if (proj.type === 'fenzuan_shield') {
      // Fenzuan Shield: Straight 150px out, then returns to owner (non-homing during out phase)
      if (proj.fenzuanShieldState === 'outward') {
        const stepX = proj.vx * dt;
        const stepY = proj.vy * dt;
        proj.x += stepX;
        proj.y += stepY;
        const stepDist = Math.hypot(stepX, stepY);
        proj.fenzuanTraveledDist = (proj.fenzuanTraveledDist || 0) + stepDist;

        // Subtle pink shield trail sparkles
        if (Math.random() < 0.4) {
          particles.push({
            x: proj.x + (Math.random() - 0.5) * 8,
            y: proj.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            radius: 2,
            color: Math.random() > 0.4 ? '#f472b6' : '#fdf2f8',
            alpha: 0.8,
            maxLife: 0.25,
            life: 0.25,
            type: 'fenzuan_shield_trail'
          });
        }

        // Check if reached 150px max travel distance
        if (proj.fenzuanTraveledDist >= (proj.fenzuanMaxDist || 150)) {
          proj.fenzuanShieldState = 'returning';
        }
      } else {
        // Returning phase: moves directly towards owner's current position
        const toOwnerX = owner.x - proj.x;
        const toOwnerY = owner.y - proj.y;
        const distToOwner = Math.hypot(toOwnerX, toOwnerY);
        const returnSpeed = 330;

        if (distToOwner > 1) {
          proj.vx = (toOwnerX / distToOwner) * returnSpeed;
          proj.vy = (toOwnerY / distToOwner) * returnSpeed;
        }

        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;

        // Catch shield check
        if (distToOwner <= owner.radius + 14 || distToOwner <= returnSpeed * dt * 1.5) {
          // Shield returned to Fenzuan!
          owner.fenzuanShieldActive = false;
          owner.fenzuanShieldCooldown = 8.0; // 8s cooldown starts only AFTER complete return (調長自 5s)
          owner.fenzuanShieldCatchAnimTimer = 0.35;
          soundEngine.playFenzuanShieldReturn();

          // Expanding pink catch ring & sparkles
          particles.push({
            x: owner.x,
            y: owner.y,
            vx: 0,
            vy: 0,
            radius: owner.radius + 16,
            color: '#f472b6',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'fenzuan_shield_ring'
          });

          for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 80;
            particles.push({
              x: owner.x,
              y: owner.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2 + Math.random() * 1.5,
              color: Math.random() > 0.4 ? '#f472b6' : '#ffffff',
              alpha: 1.0,
              maxLife: 0.3,
              life: 0.3,
              type: 'fenzuan_spark'
            });
          }

          // Discard projectile now that it is caught
          continue;
        }
      }
    } else if (proj.type === 'mimi_heart_shot') {
      // Mimi Heart Shot: travels forward up to 300px max distance, straight line (no tracking)
      const stepX = proj.vx * dt;
      const stepY = proj.vy * dt;
      proj.x += stepX;
      proj.y += stepY;
      const stepDist = Math.hypot(stepX, stepY);
      proj.mimiTraveledDist = (proj.mimiTraveledDist || 0) + stepDist;

      // Sparkling heart trail
      if (Math.random() < 0.7) {
        particles.push({
          x: proj.x + (Math.random() - 0.5) * 6,
          y: proj.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          radius: 1.8,
          color: Math.random() > 0.4 ? '#f472b6' : '#fda4af',
          alpha: 0.85,
          maxLife: 0.22,
          life: 0.22,
          type: 'mimi_heart_spark'
        });
      }

      // Check max range (300px) or boundary wall contact
      const isWallHit = proj.x - proj.radius <= 0 || proj.x + proj.radius >= ARENA_WIDTH || proj.y - proj.radius <= 0 || proj.y + proj.radius >= ARENA_HEIGHT;
      const isMaxDist = proj.mimiTraveledDist >= (proj.mimiMaxDist || 300);

      if (isWallHit || isMaxDist) {
        // Trigger 80px AoE Heart Burst on wall impact or max range
        triggerMimiHeartExplosion(
          proj,
          owner,
          target,
          Math.max(10, Math.min(ARENA_WIDTH - 10, proj.x)),
          Math.max(10, Math.min(ARENA_HEIGHT - 10, proj.y)),
          isWallHit ? '觸壁引爆' : '達極限射程300px引爆',
          matchTime,
          fctList,
          events,
          particles
        );
        continue;
      }
    }

    // Add trail point
    proj.trail = proj.trail || [];
    proj.trail.unshift({ x: proj.x, y: proj.y, alpha: 1.0 });
    const maxTrailLen = proj.type === 'fan_hunter_arrow' ? 10 : (proj.type === 'xin_sword_strike' ? 12 : (proj.type === 'xin_sky_cleave' ? 14 : (proj.type === 'junko_bandage_arrow' ? 10 : 6)));
    if (proj.trail.length > maxTrailLen) proj.trail.pop();
    for (const t of proj.trail) t.alpha *= (proj.type === 'fan_hunter_arrow' || proj.type === 'xin_sword_strike' || proj.type === 'xin_sky_cleave' || proj.type === 'junko_bandage_arrow') ? 0.85 : 0.75;

    // --- CHECK HIT ENEMY CLONES FIRST ---
    let hitSomething = false;
    if (target.characterId === 'lingyinsi' && target.clones && target.clones.length > 0) {
      for (const clone of target.clones) {
        if (clone.hp <= 0) continue;
        const cdx = clone.x - proj.x;
        const cdy = clone.y - proj.y;
        const cdist = Math.hypot(cdx, cdy);
        if (cdist <= clone.radius + (proj.radius || 6)) {
          // Projectile hits clone
          clone.hp = Math.max(0, clone.hp - proj.damage);
          recordDamageStats(owner, target, proj.damage, 'magic', '投射物命中分身');
          hitSomething = true;

          fctList.push({
            id: `fct_${Math.random()}`,
            x: clone.x,
            y: clone.y - clone.radius - 8,
            text: `-${proj.damage}`,
            color: '#38bdf8',
            fontSize: 11,
            alpha: 1.0,
            life: 0.7,
            maxLife: 0.7,
            vy: -20
          });

          // Impact sparks
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 80;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2,
              color: '#38bdf8',
              alpha: 1.0,
              maxLife: 0.25,
              life: 0.25,
              type: 'psionic_arrow_spark'
            });
          }
          break;
        }
      }
      target.clones = target.clones.filter(c => c.hp > 0);
    }

    if (hitSomething) continue;

    // --- CHECK HIT ENEMY LANZUAN ORB ---
    if (target.lanzuanOrb && target.lanzuanOrb.hp > 0) {
      const orb = target.lanzuanOrb;
      const odx = orb.x - proj.x;
      const ody = orb.y - proj.y;
      const odist = Math.hypot(odx, ody);
      if (odist <= orb.radius + (proj.radius || 6)) {
        orb.hp -= 1;
        orb.lastHitTime = matchTime;
        recordDamageStats(owner, target, 1, 'magic', '擊中藍鑽光球');
        hitSomething = true;

        fctList.push({
          id: `fct_orb_${Math.random()}`,
          x: orb.x,
          y: orb.y - orb.radius - 8,
          text: `-1 HP [光球]`,
          color: '#38bdf8',
          fontSize: 11,
          alpha: 1.0,
          life: 0.7,
          maxLife: 0.7,
          vy: -20
        });

        // Hit sparks
        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 70;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#38bdf8',
            alpha: 1.0,
            maxLife: 0.25,
            life: 0.25,
            type: 'lanzuan_orb_spark'
          });
        }

        if (orb.hp <= 0) {
          target.lanzuanOrb = null;
          target.lanzuanOrbCooldown = 20.0;
          soundEngine.playLanzuanOrbBreak();

          for (let i = 0; i < 16; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 120;
            particles.push({
              x: orb.x,
              y: orb.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.5 + Math.random() * 2,
              color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
              alpha: 1.0,
              maxLife: 0.4,
              life: 0.4,
              type: 'lanzuan_shard'
            });
          }

          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: owner.id,
            targetId: target.id,
            skillName: '藍色光球',
            text: `藍色光球承受攻擊已破碎！`,
            badge: '光球破碎'
          });
        }
      }
    }

    if (hitSomething) continue;

    // --- CHECK HIT ENEMY BAIZUAN MIRROR CLONE ---
    if (target.baizuanClone && target.baizuanClone.hp > 0) {
      const clone = target.baizuanClone;
      const cdx = clone.x - proj.x;
      const cdy = clone.y - proj.y;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist <= clone.radius + (proj.radius || 6)) {
        clone.hp = Math.max(0, clone.hp - 1);
        clone.lastHitTime = matchTime;
        recordDamageStats(owner, target, 1, 'magic', '擊中鏡像分身');
        hitSomething = true;

        fctList.push({
          id: `fct_clone_${Math.random()}`,
          x: clone.x,
          y: clone.y - clone.radius - 8,
          text: `-1 格 [分身]`,
          color: '#ffffff',
          fontSize: 11,
          alpha: 1.0,
          life: 0.7,
          maxLife: 0.7,
          vy: -20
        });

        // Impact shards
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 80;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#ffffff',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'baizuan_clone_shard'
          });
        }

        if (clone.hp <= 0) {
          target.baizuanClone = null;
          target.baizuanCloneCooldown = 20.0;
          soundEngine.playBaizuanCloneShatter();

          for (let i = 0; i < 18; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 140;
            particles.push({
              x: clone.x,
              y: clone.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.5 + Math.random() * 2,
              color: Math.random() > 0.4 ? '#ffffff' : '#e2e8f0',
              alpha: 1.0,
              maxLife: 0.45,
              life: 0.45,
              type: 'baizuan_mirror_crack'
            });
          }

          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: owner.id,
            targetId: target.id,
            skillName: '鏡像分身',
            text: `鏡像分身承受攻擊已破碎！(進入20s冷卻)`,
            badge: '分身破碎'
          });
        }
      }
    }

    if (hitSomething) continue;

    // --- CHECK HIT ENEMY COMBAT PUPPETS (傀儡優先吸引火力/攔截投射物) ---
    if (target.characterId === 'kuileishi' && target.puppets && target.puppets.length > 0) {
      for (const puppet of target.puppets) {
        if (puppet.hp <= 0 || puppet.currentSegment > 3) continue;
        const pdx = puppet.x - proj.x;
        const pdy = puppet.y - proj.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist <= puppet.radius + (proj.radius || 6)) {
          damageCombatPuppet(puppet, proj.damage, fctList, particles);
          const mappedDmg: 'true' | 'physical' | 'flame' | 'magic' | 'poison' =
            proj.damageType === 'true' || proj.damageType === 'physical' || proj.damageType === 'flame' || proj.damageType === 'poison'
              ? proj.damageType
              : 'magic';
          recordDamageStats(owner, target, proj.damage, mappedDmg, '投射物命中傀儡');
          hitSomething = true;
          soundEngine.playDamageShare();
          break;
        }
      }
    }

    if (hitSomething) continue;

    // --- CHECK HIT TARGET MAIN BALL ---
    const hitDx = target.x - proj.x;
    const hitDy = target.y - proj.y;
    const hitDist = Math.hypot(hitDx, hitDy);
    const hitThreshold = target.radius + (proj.radius || 8);

    if (hitDist <= hitThreshold) {
      // 剪刀手 (Jiandaoshou) 聖霧守護格擋機制: 處於聖霧中時，完全免疫一切非指定技能傷害！
      if (target.characterId === 'jiandaoshou' && target.jiandaoshouMistActive) {
        soundEngine.playJiandaoMistDeflect();
        fctList.push({
          id: `fct_jiandao_proj_deflect_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 12,
          text: '聖霧格擋 [免疫技能]',
          color: '#fef08a',
          fontSize: 12,
          scale: 1.15,
          alpha: 1.0,
          life: 0.75,
          maxLife: 0.75,
          vy: -22,
          damageType: 'status',
          damageValue: 0
        });

        // Deflection shock ripple & holy sparks at contact point
        particles.push({
          x: proj.x,
          y: proj.y,
          vx: 0,
          vy: 0,
          radius: 36,
          color: '#fef08a',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'jiandao_mist_deflect_ring'
        });

        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 80;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.2,
            color: '#ffffff',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'jiandao_halo_spark'
          });
        }

        // Deflected projectile vanishes
        continue;
      }

      // 剪刀手 (Jiandaoshou) 被動三【聖針連射】命中結算
      if (proj.type === 'jiandao_needle') {
        const needleDamage = 18; // v2.6: Buffed to 18 (from 16)
        applyDamageWithDamageSharing(
          target,
          owner,
          needleDamage,
          'magic',
          '聖針連射',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.25;

        // Apply 25% slow for 1.2s
        target.isSlowedByNeedle = true;
        target.slowedByNeedleTimer = 1.2;

        soundEngine.playJiandaoNeedleHit();

        // 聖針連射命中符號與視覺特效:
        // 1. 聖針十字命中符號 (4-pointed radiant piercing needle cross symbol with golden eyelet)
        const hitAngle = Math.atan2(proj.vy, proj.vx);
        particles.push({
          x: target.x,
          y: target.y,
          vx: 0,
          vy: 0,
          radius: 14,
          angle: hitAngle,
          color: '#ffffff',
          alpha: 1.0,
          maxLife: 0.42,
          life: 0.42,
          type: 'jiandao_needle_hit_symbol'
        });

        // 2. 銀白色飛針碎芒粒子沿穿透方向散射 (Needle shard spray)
        for (let i = 0; i < 8; i++) {
          const a = hitAngle + (Math.random() - 0.5) * Math.PI * 0.7;
          const spd = 60 + Math.random() * 120;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            length: 10 + Math.random() * 6,
            color: '#ffffff',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'jiandao_needle_spark'
          });
        }

        // 3. 聖針減速光環 (Pale cyan-white deceleration frost shock ring)
        particles.push({
          x: target.x,
          y: target.y,
          vx: 0,
          vy: 0,
          radius: target.radius + 12,
          color: '#38bdf8',
          alpha: 0.95,
          maxLife: 0.4,
          life: 0.4,
          type: 'jiandao_slow_ring'
        });

        // 4. 聖光碎芒 (Holy burst stars)
        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 30 + Math.random() * 60;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#fef08a',
            alpha: 1.0,
            maxLife: 0.32,
            life: 0.32,
            type: 'jiandao_holy_burst'
          });
        }

        fctList.push({
          id: `fct_needle_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 10,
          text: `-12 聖針連射 (減速20%)`,
          color: '#e2e8f0',
          fontSize: 12,
          scale: 1.15,
          alpha: 1.0,
          life: 0.75,
          maxLife: 0.75,
          vy: -22,
          damageType: 'magic',
          damageValue: 12
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'projectile_hit',
          attackerId: owner.id,
          targetId: target.id,
          damage: needleDamage,
          skillName: '聖針連射',
          text: `${owner.name} 的【聖針連射】命中 ${target.name} 造成 12 點魔法傷害，並減速 20%！`,
          badge: '聖針命中'
        });

        continue;
      }

      // 蒂納 (Dina) 被動一【白光發射】命中結算 (2.5 魔傷 + 必然產生1個白光能量)
      if (proj.type === 'dina_white_light') {
        const whiteDamage = 2.5;
        applyDamageWithDamageSharing(
          target,
          owner,
          whiteDamage,
          'magic',
          '白光發射',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.2;

        // 必然在目標身旁凝聚 1 個【白光能量】
        const newEnergy: WhiteLightEnergy = {
          eventId: `wle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sourceProjectileId: proj.id,
          state: 'AVAILABLE',
          createdAt: matchTime,
          consumed: false,
          reservedBy: null,
          absorptionOwner: null,
          fusionOwner: null,
          x: target.x + (Math.random() - 0.5) * 20,
          y: target.y + (Math.random() - 0.5) * 20
        };
        if (!owner.dinaWhiteEnergies) owner.dinaWhiteEnergies = [];
        owner.dinaWhiteEnergies.push(newEnergy);

        soundEngine.playDinaAbsorb();

        // 蒂納 - 白光命中：星光閃爍星芒群爆發 (璀璨四芒星與微金星塵)
        for (let i = 0; i < 14; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 50 + Math.random() * 90;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.2 + Math.random() * 1.4,
            color: Math.random() > 0.35 ? '#ffffff' : (Math.random() > 0.5 ? '#fef08a' : '#e0e7ff'),
            alpha: 1.0,
            maxLife: 0.36 + Math.random() * 0.12,
            life: 0.36 + Math.random() * 0.12,
            type: 'dina_white_spark',
            angle: a,
            spin: (Math.random() - 0.5) * 8
          });
        }

        fctList.push({
          id: `fct_dina_white_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 10,
          text: `-2.5 白光 (產生能量)`,
          color: '#ffffff',
          fontSize: 11,
          scale: 1.1,
          alpha: 1.0,
          life: 0.75,
          maxLife: 0.75,
          vy: -20,
          damageType: 'magic',
          damageValue: 2.5
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'projectile_hit',
          attackerId: owner.id,
          targetId: target.id,
          damage: whiteDamage,
          skillName: '白光發射',
          text: `${owner.name} 的【白光】命中 ${target.name} 造成 2.5 點魔法傷害，並凝聚 1 個【白光能量】！`,
          badge: '白光能量'
        });

        continue;
      }

      // 蒂納 (Dina) 被動二【暗光蓄力】命中結算 (10 點魔傷)
      if (proj.type === 'dina_dark_light') {
        const darkDamage = 10;
        applyDamageWithDamageSharing(
          target,
          owner,
          darkDamage,
          'magic',
          '暗光蓄力',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.25;

        // 蒂納 - 暗光命中：暗夜紫晶閃爍星芒與虛空爆碎群
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 70 + Math.random() * 110;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.5 + Math.random() * 1.5,
            color: Math.random() > 0.4 ? '#c084fc' : (Math.random() > 0.5 ? '#e879f9' : '#7e22ce'),
            alpha: 1.0,
            maxLife: 0.38 + Math.random() * 0.12,
            life: 0.38 + Math.random() * 0.12,
            type: 'dina_dark_spark',
            angle: a,
            spin: -(Math.random() - 0.5) * 8
          });
        }

        fctList.push({
          id: `fct_dina_dark_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 10,
          text: `-10 暗光爆轟`,
          color: '#c084fc',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.75,
          maxLife: 0.75,
          vy: -22,
          damageType: 'magic',
          damageValue: 10
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'projectile_hit',
          attackerId: owner.id,
          targetId: target.id,
          damage: darkDamage,
          skillName: '暗光蓄力',
          text: `${owner.name} 的【暗光】轟擊 ${target.name} 造成 10 點魔法傷害！`,
          badge: '暗光爆轟'
        });

        continue;
      }

      // 蒂納 (Dina) 被動三【三相融合】命中結算 (完美融合26魔傷 / 一般融合15魔傷 + 隨機附加燃燒/減速/定身)
      if (proj.type === 'dina_fusion_orb') {
        const isPerfect = proj.dinaFusionType === 'perfect';
        const fusionDamage = isPerfect ? 26 : 15;
        applyDamageWithDamageSharing(
          target,
          owner,
          fusionDamage,
          'magic',
          isPerfect ? '完美三相融合' : '三相融合',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.35;

        // 隨機附加 1 種控制效果 (燃燒 / 減速 / 定身 完全隨機三選一)
        const randEffect = Math.floor(Math.random() * 3);
        let effectName = '';

        if (randEffect === 0) {
          // 燃燒 (每0.5秒造成2點傷害)
          const dur = isPerfect ? 2.5 : 1.5;
          target.isDinaBurned = true;
          target.dinaBurnTimer = dur;
          target.dinaBurnInterval = 0.5;
          target.dinaBurnDamagePerTick = 2;
          effectName = `燃燒狀態 (${dur}s)`;
          fctList.push({
            id: `fct_dina_burn_init_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 24,
            text: `融合燃燒 (${dur}s)`,
            color: '#fb7185',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20
          });
        } else if (randEffect === 1) {
          // 減速 (移動速度降低35%)
          const dur = isPerfect ? 2.0 : 1.5;
          target.isDinaSlowed = true;
          target.dinaSlowTimer = dur;
          effectName = `減速35% (${dur}s)`;
          fctList.push({
            id: `fct_dina_slow_init_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 24,
            text: `融合減速 35% (${dur}s)`,
            color: '#c084fc',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20
          });
        } else {
          // 定身 (無法主動位移)
          const dur = isPerfect ? 1.2 : 0.8;
          target.isDinaImmobilized = true;
          target.dinaImmobilizeTimer = dur;
          target.vx = 0;
          target.vy = 0;
          effectName = `定身禁錮 (${dur}s)`;
          fctList.push({
            id: `fct_dina_immob_init_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 24,
            text: `融合定身 (${dur}s)`,
            color: '#818cf8',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20
          });
        }

        // 蒂納 - 融合光球命中：雙相天體超新星爆散 (純白、紫粉、緋紅星芒群)
        const hitCount = isPerfect ? 24 : 18;
        for (let i = 0; i < hitCount; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 80 + Math.random() * 140;
          const isWhite = i % 2 === 0;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.6 + Math.random() * 1.6,
            color: isWhite ? '#ffffff' : (isPerfect ? '#f43f5e' : (Math.random() > 0.5 ? '#c084fc' : '#e879f9')),
            alpha: 1.0,
            maxLife: 0.42 + Math.random() * 0.14,
            life: 0.42 + Math.random() * 0.14,
            type: 'dina_fusion_spark',
            angle: a,
            spin: (Math.random() - 0.5) * 10
          });
        }

        fctList.push({
          id: `fct_dina_fusion_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 10,
          text: `-${fusionDamage} ${isPerfect ? '【完美】三相融合' : '三相融合'}`,
          color: isPerfect ? '#f43f5e' : '#d946ef',
          fontSize: 14,
          scale: 1.35,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -24,
          damageType: 'magic',
          damageValue: fusionDamage
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'projectile_hit',
          attackerId: owner.id,
          targetId: target.id,
          damage: fusionDamage,
          skillName: isPerfect ? '完美三相融合' : '三相融合',
          text: `${owner.name} 的【${isPerfect ? '完美三相融合' : '三相融合'}】重創 ${target.name} 造成 ${fusionDamage} 點魔法傷害，並觸發【${effectName}】！`,
          badge: isPerfect ? '完美融合' : '三相融合'
        });

        continue;
      }

      // 劍仙 (Jianxian) - 被動一【白劍爆裂】命中結算 (直接引爆 70px 範圍 2.5 魔法傷害)
      if (proj.type === 'jianxian_burst_sword') {
        triggerJianxianBurstExplosion(proj, owner, b1, b2, matchTime, fctList, events, particles);
        continue;
      }

      // 劍仙 (Jianxian) - 被動二【退劍緩行】命中結算 (5.5 點魔傷 + 25% 緩速，持續 2 秒)
      if (proj.type === 'jianxian_slow_sword') {
        const slowDmg = 5.5;
        applyDamageWithDamageSharing(
          target,
          owner,
          slowDmg,
          'magic',
          '退劍緩行',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.35;

        // 附加 25% 緩速 (持續 2 秒，同一敵人不重複疊加)
        target.isSlowedByJianxian = true;
        target.slowedByJianxianTimer = 2.0;

        soundEngine.playJianxianSlowSwordHit();

        fctList.push({
          id: `fct_jx_hit_slow_${Math.random()}`,
          x: target.x,
          y: target.y - target.radius - 12,
          text: '-5.5 寒冰緩速 25% (2s)',
          color: '#38bdf8',
          fontSize: 12,
          scale: 1.15,
          alpha: 1.0,
          life: 0.8,
          maxLife: 0.8,
          vy: -20,
          damageType: 'magic',
          damageValue: 5.5
        });

        // 寒霜太極仙符微粒
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 90;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.0 + Math.random() * 1.5,
            color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'jianxian_slow_frost'
          });
        }

        events.push({
          id: `evt_jx_slow_hit_${Math.random()}`,
          timestamp: matchTime,
          type: 'projectile_hit',
          attackerId: owner.id,
          targetId: target.id,
          damage: slowDmg,
          skillName: '退劍緩行',
          text: `${owner.name} 的【退劍緩行】命中 ${target.name} 造成 5.5 點魔法傷害並降低 25% 移速！`,
          badge: '退劍緩行'
        });

        continue;
      }

      // 劍仙 (Jianxian) - 被動三【百萬劍陣】劍氣命中結算 (單發 0.7 魔傷，受每秒7.0及總量70限制)
      if (proj.type === 'jianxian_sword_qi') {
        const qiDmg = 0.7;
        const currentSecDmg = owner.jianxianArraySecDamage || 0;
        const currentTotalDmg = owner.jianxianArrayTotalDamage || 0;

        if (currentSecDmg < 7.0 && currentTotalDmg < 70.0) {
          const actualDmg = Math.min(qiDmg, Math.min(7.0 - currentSecDmg, 70.0 - currentTotalDmg));
          if (actualDmg > 0.01) {
            owner.jianxianArraySecDamage = currentSecDmg + actualDmg;
            owner.jianxianArrayTotalDamage = currentTotalDmg + actualDmg;

            applyDamageWithDamageSharing(
              target,
              owner,
              actualDmg,
              'magic',
              '百萬劍氣',
              proj.x,
              proj.y,
              matchTime,
              fctList,
              events,
              particles
            );

            target.hitsReceived++;
            target.hitFlashTimer = 0.15;
          }
        }

        // 劍痕火花微粒
        for (let i = 0; i < 4; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 30 + Math.random() * 60;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 1.2,
            color: Math.random() > 0.5 ? '#ffffff' : '#bae6fd',
            alpha: 0.8,
            maxLife: 0.18,
            life: 0.18,
            type: 'jianxian_burst_spark'
          });
        }

        continue;
      }

      // 蜘蛛 (Zhizhu) - 被動二【獵網束縛】黏性蛛網命中
      if (proj.type === 'spider_web_net') {
        const netDamage = 2; // 蛛網生成時附帶微弱衝擊：造成 2 點物理傷害
        applyDamageWithDamageSharing(
          target,
          owner,
          netDamage,
          'physical',
          '獵網束縛',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.2;

        // 生成直徑 100px 蛛網區域 (半徑 50px)，持續 2.5 秒
        const newWebZone: SpiderWebZone = {
          id: `web_zone_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ownerId: owner.id,
          x: target.x,
          y: target.y,
          radius: 50,
          duration: 2.5,
          maxDuration: 2.5,
          createdTime: matchTime
        };
        if (!owner.spiderWebZones) owner.spiderWebZones = [];
        owner.spiderWebZones.push(newWebZone);

        // 處於蛛網內：移動速度降低 35%
        target.isSlowedBySpiderWeb = true;
        target.slowedBySpiderWebTimer = 2.5;

        soundEngine.playSpiderWeb();

        // 蛛網爆裂粒子
        if (particles) {
          for (let i = 0; i < 16; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 80;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 1.5 + Math.random() * 1.5,
              color: Math.random() > 0.4 ? '#ffffff' : '#10b981',
              alpha: 0.9,
              maxLife: 0.4,
              life: 0.4,
              type: 'smoke'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_spider_web_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 12,
            text: '-2 獵網束縛 減速 35%',
            color: '#10b981',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20,
            damageType: 'physical',
            damageValue: 2
          });
        }

        if (events) {
          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'projectile_hit',
            attackerId: owner.id,
            targetId: target.id,
            damage: netDamage,
            skillName: '獵網束縛',
            text: `${owner.name} 的【獵網束縛】纏住 ${target.name}，生成 90px 黏滯蛛網造成 2 點傷害並降低 35% 速度！`,
            badge: '獵網束縛'
          });
        }

        continue;
      }

      // 辛 (Xin) - 魔劍普攻 (xin_sword_strike)
      if (proj.type === 'xin_sword_strike') {
        const isDark = owner.xinForm === 'dark';
        const isLight = owner.xinForm === 'light';
        const levelMult = 1 + ((owner.xinLevel || 1) - 1) * 0.10;
        let baseDmg = 18;
        if (isLight) baseDmg += 8; // 26 base
        if (isDark) baseDmg += 8; // 26 base
        const strikeDmg = Math.round(baseDmg * levelMult);

        applyDamageWithDamageSharing(
          target,
          owner,
          strikeDmg,
          isLight ? 'magic' : 'physical',
          '魔劍普攻',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.2;

        // 光形態普攻回復 6 HP
        if (isLight) {
          owner.hp = Math.min(owner.maxHp, owner.hp + 6);
        }

        // 獲得 15 EXP
        addXinExp(owner, 15, fctList, events, particles, matchTime);

        // 獲得 10 點形態能量
        owner.xinFormEnergy = Math.min(100, (owner.xinFormEnergy || 0) + 10);

        soundEngine.playJianxianSwordQi();

        // 命中十字雙斬破甲光印與弧光
        if (particles) {
          const hitAngle = Math.atan2(proj.vy, proj.vx);
          const hitColor = isDark ? '#c084fc' : (isLight ? '#fde047' : '#ffffff');

          // 十字破甲雙斬
          particles.push({
            x: target.x,
            y: target.y,
            vx: 0,
            vy: 0,
            radius: 4,
            length: 28,
            angle: hitAngle,
            color: hitColor,
            alpha: 1.0,
            maxLife: 0.28,
            life: 0.28,
            type: 'xin_cross_slash'
          });

          // 飛濺斬擊弧光
          particles.push({
            x: target.x,
            y: target.y,
            vx: Math.cos(hitAngle) * 35,
            vy: Math.sin(hitAngle) * 35,
            radius: 20,
            angle: hitAngle,
            color: isDark ? '#e9d5ff' : '#fef08a',
            alpha: 0.95,
            maxLife: 0.22,
            life: 0.22,
            width: 3.2,
            type: 'xin_slash_arc',
            extraData: { sweep: 1.2 }
          });

          // 放射狀金屬與魔能火花
          for (let p = 0; p < 10; p++) {
            const a = hitAngle + (Math.random() - 0.5) * Math.PI * 1.2;
            const spd = 60 + Math.random() * 90;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.2,
              length: 12,
              color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#e2e8f0'),
              alpha: 1.0,
              maxLife: 0.28,
              life: 0.28,
              type: 'xin_impact_spark'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_xin_hit_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 12,
            text: isLight ? `-${strikeDmg} 曜光魔劍(+6治癒)` : (isDark ? `-${strikeDmg} 煞暗魔劍[狂暴]!` : `-${strikeDmg} 魔劍普攻`),
            color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#e2e8f0'),
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20,
            damageType: isLight ? 'magic' : 'physical',
            damageValue: strikeDmg
          });
        }

        continue;
      }

      // 辛 (Xin) - 裂空劍痕 (xin_sky_cleave)
      if (proj.type === 'xin_sky_cleave') {
        const isDark = owner.xinForm === 'dark';
        const isLight = owner.xinForm === 'light';
        const levelMult = 1 + ((owner.xinLevel || 1) - 1) * 0.10;
        const cleaveDmg = Math.round(42 * levelMult);

        applyDamageWithDamageSharing(
          target,
          owner,
          cleaveDmg,
          'magic',
          '裂空劍痕',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.35;

        // 光形態：治癒 30 HP (滿血轉護盾)
        if (isLight) {
          const healNeed = owner.maxHp - owner.hp;
          if (healNeed >= 30) {
            owner.hp += 30;
          } else {
            owner.hp = owner.maxHp;
            const shieldAdd = 30 - healNeed;
            owner.xinShieldAmount = Math.min(100, (owner.xinShieldAmount || 0) + shieldAdd);
          }
        }

        // 暗形態：目標生命低於 50% 時觸發斬殺，額外 18 點穿透真傷！
        let darkExecuteDmg = 0;
        if (isDark && target.hp < target.maxHp * 0.5) {
          darkExecuteDmg = Math.round(18 * levelMult);
          applyDamageWithDamageSharing(
            target,
            owner,
            darkExecuteDmg,
            'true',
            '煞暗斬殺',
            proj.x,
            proj.y,
            matchTime,
            fctList,
            events,
            particles
          );
        }

        // 獲得 40 EXP
        addXinExp(owner, 40, fctList, events, particles, matchTime);

        soundEngine.playOverdrive();

        // 裂空大爆炸粒子 (空間裂隙網 + 巨大十字裂空印 + 衝擊波)
        if (particles) {
          const hitAngle = Math.atan2(proj.vy, proj.vx);
          const riftColor = isDark ? '#c084fc' : (isLight ? '#fde047' : '#93c5fd');

          // 1. 巨大十字裂空斬擊光印
          particles.push({
            x: target.x,
            y: target.y,
            vx: 0,
            vy: 0,
            radius: 6,
            length: 46,
            angle: hitAngle,
            color: isDark ? '#ffffff' : '#fef08a',
            alpha: 1.0,
            maxLife: 0.38,
            life: 0.38,
            type: 'xin_cross_slash'
          });

          // 2. 空間天柱射線爆發 (Spatial Sky Beam)
          particles.push({
            x: target.x,
            y: target.y,
            vx: 0,
            vy: 0,
            radius: 12,
            length: 75,
            width: 12,
            angle: hitAngle,
            color: riftColor,
            alpha: 1.0,
            maxLife: 0.28,
            life: 0.28,
            type: 'xin_sky_beam'
          });

          // 3. 放射狀空間裂痕 (Radiating Spatial Rift Cracks)
          for (let r = 0; r < 4; r++) {
            const crackAng = hitAngle + (r * Math.PI / 2) + (Math.random() - 0.5) * 0.4;
            particles.push({
              x: target.x + Math.cos(crackAng) * 14,
              y: target.y + Math.sin(crackAng) * 14,
              vx: Math.cos(crackAng) * 18,
              vy: Math.sin(crackAng) * 18,
              radius: 3,
              length: 36,
              angle: crackAng,
              color: riftColor,
              alpha: 0.95,
              maxLife: 0.35,
              life: 0.35,
              type: 'xin_spatial_rift_crack',
              extraData: { jag1: 6, jag2: -5, jag3: 4 }
            });
          }

          // 4. 衝擊波
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: 0,
            vy: 0,
            radius: 75,
            color: isDark ? '#9333ea' : (isLight ? '#f59e0b' : '#38bdf8'),
            alpha: 1.0,
            maxLife: 0.38,
            life: 0.38,
            type: 'shockwave'
          });

          // 5. 雙相星芒火花
          for (let p = 0; p < 24; p++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 70 + Math.random() * 130;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 3.2,
              length: 14,
              color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#bae6fd'),
              alpha: 1.0,
              maxLife: 0.42,
              life: 0.42,
              type: 'xin_impact_spark'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_xin_cleave_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 20,
            text: darkExecuteDmg > 0 ? `-42 裂空劍痕! -18 斬殺真傷!` : `-42 裂空劍痕!`,
            color: isDark ? '#c084fc' : (isLight ? '#facc15' : '#38bdf8'),
            fontSize: 14,
            scale: 1.35,
            alpha: 1.0,
            life: 1.0,
            maxLife: 1.0,
            vy: -24,
            damageType: 'magic',
            damageValue: cleaveDmg + darkExecuteDmg
          });
        }

        if (events) {
          events.push({
            id: `evt_xin_cleave_hit_${Math.random()}`,
            timestamp: matchTime,
            type: 'projectile_hit',
            attackerId: owner.id,
            targetId: target.id,
            damage: cleaveDmg + darkExecuteDmg,
            skillName: '裂空劍痕',
            text: `${owner.name} 的【裂空劍痕】爆發撕裂 ${target.name}，造成 ${cleaveDmg} 點傷害${darkExecuteDmg > 0 ? ' 並觸發 18 點狂暴斬殺真傷' : ''}！`,
            badge: darkExecuteDmg > 0 ? '煞暗斬殺' : '裂空破防'
          });
        }

        continue;
      }

      // 曼麥亞・軍子 (Manyaiya Junko) - 白縛神箭 (junko_bandage_arrow)
      if (proj.type === 'junko_bandage_arrow') {
        const isHolyKnight = owner.junkoHolyKnightActive;
        const arrowDmg = isHolyKnight ? 5 : 4;

        // 核心機制｜記憶斷片：每名敵人獨立計算，上限 3 層
        if (!owner.junkoMemoryFragments) owner.junkoMemoryFragments = {};
        const oldMem = owner.junkoMemoryFragments[target.id] || 0;
        const newMem = Math.min(3, oldMem + 1);
        owner.junkoMemoryFragments[target.id] = newMem;

        applyDamageWithDamageSharing(
          target,
          owner,
          arrowDmg,
          'physical',
          '白縛神箭',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        target.hitFlashTimer = 0.2;

        // 減速 25% 持續 1.5 秒
        target.isSlowedByJunko = true;
        target.slowedByJunkoTimer = Math.max(target.slowedByJunkoTimer || 0, 1.5);

        // 若命中前已有 2 層記憶斷片，額外造成 0.5 秒定身
        const didRoot = oldMem >= 2;
        if (didRoot) {
          target.isSnaredByJunko = true;
          target.snaredByJunkoTimer = Math.max(target.snaredByJunkoTimer || 0, 0.5);
        }

        soundEngine.playJunkoArrowHit(didRoot);

        // 檢查是否觸發【異瞳覺醒】(任一敵人達到 3 層)
        if (newMem >= 3) {
          target.junkoVulnerableStacks = 1;
          const currentAwakenCd = owner.junkoAwakenCooldowns?.[target.id] || 0;
          if (currentAwakenCd <= 0 && !owner.junkoEyeAwakened) {
            owner.junkoEyeAwakened = true;
            owner.junkoEyeAwakenTimer = 5.0;
            owner.junkoAwakenBonusReady = true;
            if (!owner.junkoAwakenCooldowns) owner.junkoAwakenCooldowns = {};
            owner.junkoAwakenCooldowns[target.id] = 8.0;
            soundEngine.playJunkoAwakening();

            if (fctList) {
              fctList.push({
                id: `fct_junko_awaken_${Math.random()}`,
                x: owner.x,
                y: owner.y - owner.radius - 28,
                text: '★★★【異瞳覺醒】天龍金紅/殘憶青銀雙瞳綻放！移速+20%！下一次攻擊附帶+12神聖傷害！',
                color: '#fbbf24',
                fontSize: 13,
                scale: 1.35,
                shakeIntensity: 6,
                alpha: 1.0,
                life: 1.4,
                maxLife: 1.4,
                vy: -24
              });
            }

            if (events) {
              events.push({
                id: `evt_junko_awaken_${Math.random()}`,
                timestamp: matchTime,
                type: 'passive_trigger',
                attackerId: owner.id,
                targetId: target.id,
                skillName: '異瞳覺醒',
                text: `${owner.name} 的【異瞳覺醒】全面點燃！記憶斷片疊滿 3 層，敵方進入易傷狀態 (+25% 傷害)！`,
                badge: '異瞳覺醒'
              });
            }
          }
        }

        // 白縛繃帶與符文粒子爆散
        if (particles) {
          const hitAngle = Math.atan2(proj.vy, proj.vx);
          for (let p = 0; p < 12; p++) {
            const a = hitAngle + (Math.random() - 0.5) * Math.PI;
            const spd = 40 + Math.random() * 80;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.2,
              length: 12,
              color: Math.random() > 0.4 ? '#ffffff' : '#fef08a',
              alpha: 1.0,
              maxLife: 0.3,
              life: 0.3,
              type: 'spark'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_junko_arrow_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 14,
            text: didRoot
              ? `-${arrowDmg} 白縛神箭(記憶[${newMem}/3] 定身0.5s 減速25%)`
              : `-${arrowDmg} 白縛神箭(記憶[${newMem}/3] 減速25%)`,
            color: '#f8fafc',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.9,
            maxLife: 0.9,
            vy: -20,
            damageType: 'physical',
            damageValue: arrowDmg
          });
        }

        continue;
      }

      // If Fenzuan Shield: does not disappear on hit, can hit once on outward (4 dmg) and once on returning (2 dmg)
      if (proj.type === 'fenzuan_shield') {
        let didHit = false;
        let shieldDamage = 0;
        let shieldReason = '';

        if (proj.fenzuanShieldState === 'outward' && !proj.fenzuanHitOutward) {
          proj.fenzuanHitOutward = true;
          didHit = true;
          shieldDamage = 10;
          shieldReason = '粉色圓盾出擊+10';
        } else if (proj.fenzuanShieldState === 'returning' && !proj.fenzuanHitReturning) {
          proj.fenzuanHitReturning = true;
          didHit = true;
          shieldDamage = 6;
          shieldReason = '粉色圓盾返回+6';
        }

        if (didHit) {
          applyDamageWithDamageSharing(
            target,
            owner,
            shieldDamage,
            'physical',
            shieldReason,
            proj.x,
            proj.y,
            matchTime,
            fctList,
            events,
            particles
          );

          target.hitsReceived++;
          soundEngine.playFenzuanShieldHit();

          particles.push({
            x: proj.x,
            y: proj.y,
            vx: 0,
            vy: 0,
            radius: 36,
            color: '#f472b6',
            alpha: 0.9,
            maxLife: 0.28,
            life: 0.28,
            type: 'shockwave'
          });

          for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 100;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.2,
              color: Math.random() > 0.4 ? '#f472b6' : '#ffffff',
              alpha: 1.0,
              maxLife: 0.3,
              life: 0.3,
              type: 'fenzuan_spark'
            });
          }

          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'projectile_hit',
            attackerId: owner.id,
            targetId: target.id,
            damage: shieldDamage,
            skillName: '粉色圓盾',
            text: `${owner.name} 的【粉色圓盾】${proj.fenzuanShieldState === 'outward' ? '飛出' : '返回'}命中 ${target.name} 造成 ${shieldDamage} 點物理傷害！`,
            badge: `${shieldReason}`
          });
        }

        // Shield pierces through and keeps flying until it returns to owner!
        active.push(proj);
        continue;
      }

      // Fan Hunter Arrow hit logic
      if (proj.type === 'fan_hunter_arrow') {
        const lastHitTime = target.fanLastHitByArrowTime || 0;
        if (matchTime - lastHitTime < 0.1) {
          // Cooldown active for this enemy (0.1s interval constraint): no damage, no mark, no true damage
          for (let i = 0; i < 4; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 30 + Math.random() * 40;
            particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 1.5,
              color: '#94a3b8',
              alpha: 0.6,
              maxLife: 0.18,
              life: 0.18,
              type: 'fan_arrow_spark'
            });
          }
          continue; // Arrow consumed
        }

        // Valid hit on enemy!
        target.fanLastHitByArrowTime = matchTime;
        const arrowDamage = 14; // Buffed from 9
        applyDamageWithDamageSharing(
          target,
          owner,
          arrowDamage,
          'physical',
          '獵手箭矢+14',
          proj.x,
          proj.y,
          matchTime,
          fctList,
          events,
          particles
        );

        target.hitsReceived++;
        soundEngine.playFanArrowHit();

        // Add 1 stack of White Hunter Mark (白色獵痕)
        target.fanHunterMarks = (target.fanHunterMarks || 0) + 1;

        // 凡專屬視覺特效: 命中敵人時的白色圓環層疊效果 (Stacked White Concentric Ripple Rings)
        const baseRadius = target.radius;
        const ringConfigs = [
          { startR: baseRadius * 0.85, endR: baseRadius + 14, life: 0.28, width: 2.2, color: '#ffffff', alpha: 0.95 },
          { startR: baseRadius * 1.0, endR: baseRadius + 26, life: 0.36, width: 1.8, color: '#f8fafc', alpha: 0.82 },
          { startR: baseRadius * 1.15, endR: baseRadius + 40, life: 0.44, width: 1.4, color: '#e2e8f0', alpha: 0.68 }
        ];

        ringConfigs.forEach((cfg, idx) => {
          particles.push({
            x: target.x,
            y: target.y,
            vx: 0,
            vy: 0,
            radius: cfg.startR,
            color: cfg.color,
            alpha: cfg.alpha,
            maxLife: cfg.life,
            life: cfg.life,
            width: cfg.width,
            type: 'fan_hit_stacked_ring',
            extraData: {
              ringIndex: idx,
              startR: cfg.startR,
              endR: cfg.endR,
              impactX: proj.x,
              impactY: proj.y
            }
          });
        });

        // 金銀色命中粒子濺射 (Gold & Silver Impact Sparks)
        for (let i = 0; i < 9; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 45 + Math.random() * 85;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 1.8 + Math.random() * 1.5,
            color: Math.random() > 0.45 ? '#facc15' : '#ffffff',
            alpha: 1.0,
            maxLife: 0.25,
            life: 0.25,
            type: 'fan_arrow_spark'
          });
        }

        // Check if 3 stacks reached:
        // "當同一名敵人累積到3層獵痕時，立即消耗全部3層。消耗3層獵痕後，立即造成15點真實傷害。"
        // "第三次有效命中時，3個白色圓環同時收縮，產生白色能量爆裂並造成15點真實傷害。"
        if (target.fanHunterMarks >= 3) {
          target.fanHunterMarks = 0; // consumed
          const trueDmg = 36; // Buffed from 28
          applyDamageWithDamageSharing(
            target,
            owner,
            trueDmg,
            'true', // T6 True Damage burst
            '獵痕爆裂 [36真傷]',
            target.x,
            target.y,
            matchTime,
            fctList,
            events,
            particles
          );

          soundEngine.playFanHunterMarkBurst();

          // 3 contracting white rings & burst shockwave
          for (let r = 1; r <= 3; r++) {
            particles.push({
              x: target.x,
              y: target.y,
              vx: 0,
              vy: 0,
              radius: target.radius + r * 10,
              color: '#ffffff',
              alpha: 1.0,
              maxLife: 0.35,
              life: 0.35,
              type: 'fan_hunter_burst'
            });
          }

          particles.push({
            x: target.x,
            y: target.y,
            vx: 0,
            vy: 0,
            radius: 46,
            color: '#fef08a',
            alpha: 1.0,
            maxLife: 0.38,
            life: 0.38,
            type: 'shockwave'
          });

          for (let i = 0; i < 16; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 120;
            particles.push({
              x: target.x,
              y: target.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.2 + Math.random() * 2,
              color: Math.random() > 0.4 ? '#ffffff' : '#fde047',
              alpha: 1.0,
              maxLife: 0.4,
              life: 0.4,
              type: 'fan_arrow_spark'
            });
          }

          events.push({
            id: `evt_hm_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: owner.id,
            targetId: target.id,
            skillName: '獵痕爆裂',
            text: `${owner.name} 的【白色獵痕】疊滿 3 層爆裂！對 ${target.name} 造成 28 點真實傷害！`,
            badge: '28真實傷害'
          });
        }

        continue; // Arrow consumed
      }

      // If Mimi Heart Shot (愛心飛射): direct collision triggers 80px AoE explosion (6 magic dmg + 2s charm)
      if (proj.type === 'mimi_heart_shot') {
        triggerMimiHeartExplosion(
          proj,
          owner,
          target,
          proj.x,
          proj.y,
          '直接命中',
          matchTime,
          fctList,
          events,
          particles
        );
        continue; // Heart shot consumed
      }

      let finalDamage = proj.damage;
      const skillName =
        proj.type === 'purple_energy_bar'
          ? '紫色能量條'
          : proj.type === 'purple_bomb'
          ? '紫色爆彈'
          : proj.type === 'magic_missile'
          ? '魔法飛彈'
          : proj.type === 'blue_light_arrow'
          ? '靈能藍光箭'
          : proj.type === 'lanzuan_bullet'
          ? '藍色能量子彈'
          : '水晶射線';

      // If Purple Energy Bar: consume up to 30 stored magic energy to convert into extra damage (48 + 30 = max 78)!
      if (proj.type === 'purple_energy_bar') {
        const energyAvailable = owner.magicEnergy;
        const energyConsumed = Math.min(30, energyAvailable);
        owner.magicEnergy -= energyConsumed;
        finalDamage = 48 + energyConsumed;
      } else if (proj.type === 'purple_bomb') {
        if (!target.hailaiseBombVolleyHits) {
          target.hailaiseBombVolleyHits = {};
        }
        const vKey = proj.volleyId || 'volley_default';
        const hitOrder = target.hailaiseBombVolleyHits[vKey] || 0;
        target.hailaiseBombVolleyHits[vKey] = hitOrder + 1;

        // 每一顆傷害命中同一位敵人傷害遞減 每一顆魔法傷害20 後續命中同一個敵人減少1傷害 (20 -> 19 -> 18)
        finalDamage = Math.max(1, 20 - hitOrder * 1);
      }

      applyDamageWithDamageSharing(
        target,
        owner,
        finalDamage,
        proj.isPhysical ? 'physical' : 'magic',
        skillName,
        proj.x,
        proj.y,
        matchTime,
        fctList,
        events,
        particles
      );

      target.hitsReceived++;

      if (proj.type === 'blue_light_arrow') {
        // Crisp laser hit sound & spark burst
        soundEngine.playPsionicArrow();

        for (let i = 0; i < 10; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 120;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.5,
            color: '#38bdf8',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'psionic_arrow_spark'
          });
        }
      } else if (proj.type === 'lanzuan_bullet') {
        soundEngine.playLanzuanBulletHit();

        // Blue energy explosion shockwave
        particles.push({
          x: proj.x,
          y: proj.y,
          vx: 0,
          vy: 0,
          radius: 22,
          color: '#38bdf8',
          alpha: 0.9,
          maxLife: 0.28,
          life: 0.28,
          type: 'shockwave'
        });

        // Blue energy explosion particles
        for (let i = 0; i < 10; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 45 + Math.random() * 90;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2 + Math.random() * 1.5,
            color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'lanzuan_spark'
          });
        }
      } else if (proj.type === 'lanzuan_crystal_ray') {
        soundEngine.playLanzuanWaveTick();
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 50 + Math.random() * 100;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#38bdf8',
            alpha: 1.0,
            maxLife: 0.25,
            life: 0.25,
            type: 'lanzuan_spark'
          });
        }
      } else if (proj.type === 'purple_bomb') {
        soundEngine.playMimiHeartExplode();

        // 48px purple explosion shockwave
        particles.push({
          x: proj.x,
          y: proj.y,
          vx: 0,
          vy: 0,
          radius: 48,
          color: '#a855f7',
          alpha: 0.95,
          maxLife: 0.35,
          life: 0.35,
          type: 'shockwave'
        });

        // 16 purple & violet explosive sparks
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 65 + Math.random() * 140;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.8 + Math.random() * 2,
            color: Math.random() > 0.4 ? '#c084fc' : (Math.random() > 0.5 ? '#f5d0fe' : '#7e22ce'),
            alpha: 1.0,
            maxLife: 0.4,
            life: 0.4,
            type: 'arcane_spark'
          });
        }
      } else {

        particles.push({
          x: proj.x,
          y: proj.y,
          vx: 0,
          vy: 0,
          radius: 35,
          color: proj.type === 'purple_energy_bar' ? '#c084fc' : '#e879f9',
          alpha: 0.9,
          maxLife: 0.3,
          life: 0.3,
          type: 'shockwave'
        });

        for (let i = 0; i < 12; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 140;
          particles.push({
            x: proj.x,
            y: proj.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.5 + Math.random() * 2,
            color: Math.random() > 0.4 ? '#e9d5ff' : '#c084fc',
            alpha: 1.0,
            maxLife: 0.38,
            life: 0.38,
            type: 'arcane_spark'
          });
        }
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'projectile_hit',
        attackerId: owner.id,
        targetId: target.id,
        damage: finalDamage,
        skillName,
        text: `${owner.name} 的【${skillName}】命中 ${target.name} 造成 ${finalDamage} 點傷害！`,
        badge: skillName
      });

      continue;
    }

    active.push(proj);
  }

  return active;
}

function spawnCollisionStreaks(
  hitX: number,
  hitY: number,
  nx: number,
  ny: number,
  impactSpeed: number,
  b1: BallState,
  b2: BallState,
  list: Particle[]
) {
  const tx = -ny;
  const ty = nx;

  const speedRatio = Math.min(2.2, Math.max(0.2, impactSpeed / 180));
  const isHeavyImpact = impactSpeed >= 150;
  const isExtremeImpact = impactSpeed >= 230;

  const baseCount = isExtremeImpact ? 20 : isHeavyImpact ? 14 : Math.max(6, Math.floor(speedRatio * 8));

  const getColorForChar = (charId: string) => {
    switch (charId) {
      case 'oba':
        return { primary: '#fbbf24', secondary: '#f59e0b', trail: '#fef08a' };
      case 'huotong':
        return { primary: '#f97316', secondary: '#ef4444', trail: '#fed7aa' };
      case 'hailaise':
        return { primary: '#d946ef', secondary: '#8b5cf6', trail: '#f5d0fe' };
      case 'lingyinsi':
        return { primary: '#38bdf8', secondary: '#0284c7', trail: '#e0f2fe' };
      case 'chanshi':
        return { primary: '#fde047', secondary: '#eab308', trail: '#fffbeb' };
      case 'huangzuan':
        return { primary: '#e5fb05', secondary: '#8ba600', trail: '#ffffff' };
      case 'lanzuan':
        return { primary: '#38bdf8', secondary: '#0284c7', trail: '#bae6fd' };
      case 'fenzuan':
        return { primary: '#f472b6', secondary: '#db2777', trail: '#fce7f3' };
      case 'baizuan':
        return { primary: '#ffffff', secondary: '#e2e8f0', trail: '#ffffff' };
      default:
        return { primary: '#38bdf8', secondary: '#60a5fa', trail: '#e0f2fe' };
    }
  };

  const theme1 = getColorForChar(b1.characterId);
  const theme2 = getColorForChar(b2.characterId);

  for (let i = 0; i < baseCount; i++) {
    const dirSign = i % 2 === 0 ? 1 : -1;
    const normalSpread = (Math.random() - 0.5) * (0.8 + speedRatio * 0.4);
    const dirX = tx * dirSign + nx * normalSpread;
    const dirY = ty * dirSign + ny * normalSpread;
    const dirLen = Math.hypot(dirX, dirY) || 1;
    const normDirX = dirX / dirLen;
    const normDirY = dirY / dirLen;

    const streakSpeed = (100 + impactSpeed * 1.5) * (0.75 + Math.random() * 0.5);
    const streakLength = (16 + speedRatio * 42) * (0.8 + Math.random() * 0.4);
    const streakWidth = Math.max(1.6, (1.8 + speedRatio * 2.5) * (0.8 + Math.random() * 0.4));
    const maxLife = 0.22 + speedRatio * 0.12;

    const chosenTheme = i % 2 === 0 ? theme1 : theme2;
    const isElectricWhite = isExtremeImpact && Math.random() > 0.5;
    const color = isElectricWhite ? '#ffffff' : (Math.random() > 0.35 ? chosenTheme.primary : chosenTheme.secondary);

    list.push({
      x: hitX + (Math.random() - 0.5) * 6,
      y: hitY + (Math.random() - 0.5) * 6,
      vx: normDirX * streakSpeed,
      vy: normDirY * streakSpeed,
      radius: streakWidth,
      width: streakWidth,
      length: streakLength,
      angle: Math.atan2(normDirY, normDirX),
      color,
      trailColor: isElectricWhite ? '#38bdf8' : chosenTheme.trail,
      alpha: 1.0,
      maxLife,
      life: maxLife,
      type: 'collision_streak'
    });
  }

  if (isHeavyImpact) {
    const slashCount = isExtremeImpact ? 4 : 2;
    for (let s = 0; s < slashCount; s++) {
      const dirSign = s % 2 === 0 ? 1 : -1;
      const slashAngle = Math.atan2(ty * dirSign, tx * dirSign) + (Math.random() - 0.5) * 0.18;
      const slashSpeed = (190 + impactSpeed * 1.8);
      const slashLength = (40 + speedRatio * 48);
      const slashWidth = Math.min(6.0, 3.2 + speedRatio * 1.8);
      const maxLife = 0.24 + speedRatio * 0.1;

      list.push({
        x: hitX,
        y: hitY,
        vx: Math.cos(slashAngle) * slashSpeed,
        vy: Math.sin(slashAngle) * slashSpeed,
        radius: slashWidth,
        width: slashWidth,
        length: slashLength,
        angle: slashAngle,
        color: '#ffffff',
        trailColor: isExtremeImpact ? '#38bdf8' : theme1.primary,
        alpha: 1.0,
        maxLife,
        life: maxLife,
        type: 'collision_streak'
      });
    }

    list.push({
      x: hitX,
      y: hitY,
      vx: 0,
      vy: 0,
      radius: Math.min(64, 24 + speedRatio * 20),
      color: isExtremeImpact ? '#ffffff' : (theme1.primary || '#fbbf24'),
      alpha: 0.9,
      maxLife: 0.22,
      life: 0.22,
      type: 'shockwave'
    });
  }
}

function spawnImpactParticles(x: number, y: number, intensity: number, list: Particle[]) {
  const count = Math.min(Math.floor(intensity / 16) + 6, 18);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * intensity * 0.8;
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 2 + Math.random() * 2.5,
      color: Math.random() > 0.4 ? '#fef08a' : '#ffffff',
      alpha: 1.0,
      maxLife: 0.3 + Math.random() * 0.2,
      life: 0.3 + Math.random() * 0.2,
      type: 'gold_spark'
    });
  }
}

function spawnWallSpark(x: number, y: number, ballSpeed: number, list: Particle[]) {
  const sparkCount = ballSpeed > 150 ? 8 : 4;
  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * (ballSpeed > 150 ? 120 : 60);
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.8 + Math.random() * 1.2,
      color: Math.random() > 0.5 ? '#93c5fd' : '#cbd5e1',
      alpha: 0.75,
      maxLife: 0.25,
      life: 0.25,
      type: 'spark'
    });
  }

  if (ballSpeed > 160) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 100;
      list.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.2,
        width: 2.5,
        length: 22 + (ballSpeed / 200) * 16,
        angle,
        color: '#bae6fd',
        trailColor: '#38bdf8',
        alpha: 0.9,
        maxLife: 0.2,
        life: 0.2,
        type: 'collision_streak'
      });
    }
  }
}

function updateBallTrail(ball: BallState) {
  const isXukong = ball.characterId === 'xukongshou';
  const maxTrail = isXukong ? 14 : 8;
  const initialAlpha = isXukong ? 0.75 : 0.6;
  const speed = Math.hypot(ball.vx, ball.vy);

  // Xukongshou becomes semi-transparent phantom when dashing or moving at high speed
  if (isXukong) {
    if (speed > 360 || ball.xukongshouHuntActive || (ball.tacticalDashTimer || 0) > 0) {
      ball.isPhantomDash = true;
    } else {
      ball.isPhantomDash = false;
    }
  }

  ball.trail.unshift({ x: ball.x, y: ball.y, alpha: initialAlpha });
  if (ball.trail.length > maxTrail) {
    ball.trail.pop();
  }
  const decay = isXukong ? 0.88 : 0.82;
  for (let i = 0; i < ball.trail.length; i++) {
    ball.trail[i].alpha *= decay;
  }
}

/**
 * Update Chanshi Super Armor, Bell Shield, and Healing Anim timers
 */
function updateChanshiTimers(ball: BallState, dt: number) {
  if (ball.chanshiSuperArmorTimer > 0) {
    ball.chanshiSuperArmorTimer = Math.max(0, ball.chanshiSuperArmorTimer - dt);
  }
  if (ball.chanshiBellShieldTimer > 0) {
    ball.chanshiBellShieldTimer = Math.max(0, ball.chanshiBellShieldTimer - dt);
  }
  if (ball.chanshiHealingAnimTimer > 0) {
    ball.chanshiHealingAnimTimer = Math.max(0, ball.chanshiHealingAnimTimer - dt);
  }
}

/**
 * Chanshi Passive 1: Imprisoning Aura (100px radius, 30% slow to enemy, refreshes every 8 seconds)
 */
function updateChanshiAuraTrigger(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[] | undefined,
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'chanshi' || self.hp <= 0) {
    return;
  }

  self.chanshiAuraTimer = (self.chanshiAuraTimer || 0) + dt;
  self.chanshiAuraCooldown = (self.chanshiAuraCooldown !== undefined ? self.chanshiAuraCooldown : 7.0) - dt;

  // Pulse wave animation expanding to 110px
  if (self.chanshiAuraCooldown <= 0) {
    if (!tryConsumeEnergy(self, 20, '禁錮光環', fctList, events)) {
      self.chanshiAuraCooldown = 1.0;
      return;
    }
    self.chanshiAuraCooldown = 7.0;
    self.chanshiAuraWaveRadius = 0;
    self.passive1Triggers++;
    soundEngine.playZenAuraPulse();

    // 110px pulse damage (8 magic damage) if enemy inside
    const distToTarget = Math.hypot(target.x - self.x, target.y - self.y);
    if (distToTarget <= 110 + target.radius && target.hp > 0) {
      applyDamageWithDamageSharing(
        target,
        self,
        8,
        'magic',
        '禁錮光環',
        target.x,
        target.y,
        matchTime,
        fctList,
        events,
        particles
      );
    }

    // 7-second refresh ripple wave
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: 110,
      color: '#fef08a',
      alpha: 0.85,
      maxLife: 0.6,
      life: 0.6,
      type: 'zen_shockwave'
    });

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      skillName: '禁錮光環',
      text: `${self.name} 釋放【禁錮光環】，展開半徑 110px 減速 35% 區域並造成 8 點魔法傷害！`,
      badge: '禁錮光環 (減速35%+8傷)'
    });
  }

  // Expanding wave visual progress
  if (self.chanshiAuraWaveRadius < 110) {
    self.chanshiAuraWaveRadius = Math.min(110, self.chanshiAuraWaveRadius + (110 / 0.6) * dt);
  }

  // Aura border ambient particle emission (gold & pale white)
  if (Math.random() < 0.35) {
    const angle = Math.random() * Math.PI * 2;
    const r = 104 + Math.random() * 8;
    const px = self.x + Math.cos(angle) * r;
    const py = self.y + Math.sin(angle) * r;
    particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 8 - Math.sin(angle) * 12, // tangential slow orbit
      vy: (Math.random() - 0.5) * 8 + Math.cos(angle) * 12,
      radius: 1.5 + Math.random() * 1.5,
      color: Math.random() > 0.4 ? '#fef08a' : '#facc15',
      alpha: 0.75,
      maxLife: 0.45,
      life: 0.45,
      type: 'zen_aura_spark'
    });
  }

  // Distance check: radius 110px
  const dist = Math.hypot(target.x - self.x, target.y - self.y);
  const AURA_RADIUS = 110;

  if (dist <= AURA_RADIUS && target.hp > 0) {
    const wasSlowed = target.isSlowedByChanshi;
    target.isSlowedByChanshi = true;

    // Enemy under slow effect: generate golden slow particles and ring ripple
    target.slowedByChanshiTimer = (target.slowedByChanshiTimer || 0) + dt;
    if (target.slowedByChanshiTimer >= 0.08) {
      target.slowedByChanshiTimer = 0;

      // Low brightness golden particle around enemy
      const pAngle = Math.random() * Math.PI * 2;
      const pDist = target.radius * (0.8 + Math.random() * 0.5);
      particles.push({
        x: target.x + Math.cos(pAngle) * pDist,
        y: target.y + Math.sin(pAngle) * pDist,
        vx: (Math.random() - 0.5) * 10,
        vy: -15 - Math.random() * 15,
        radius: 1.8 + Math.random() * 1.5,
        color: '#facc15',
        alpha: 0.55,
        maxLife: 0.35,
        life: 0.35,
        type: 'zen_aura_spark'
      });

      // Ring ripple when first entering or periodically
      if (!wasSlowed || Math.random() < 0.15) {
        particles.push({
          x: target.x,
          y: target.y,
          vx: 0,
          vy: 0,
          radius: target.radius + 8,
          color: '#eab308',
          alpha: 0.6,
          maxLife: 0.3,
          life: 0.3,
          type: 'zen_slow_ring'
        });
      }
    }
  } else {
    // Left the aura range -> immediately remove slow effect
    target.isSlowedByChanshi = false;
  }
}

/**
 * Chanshi Passive 3: Golden Body Recovery (HP < 30% -> heals 80 HP, once per match, max 500)
 */
function updateChanshiGoldenBodyRecovery(
  self: BallState,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'chanshi' || self.chanshiGoldenBodyUsed || self.hp <= 0) return;

  const thresholdHp = self.maxHp * 0.30; // 500 * 0.30 = 150
  if (self.hp < thresholdHp) {
    if (!tryConsumeEnergy(self, 40, '金身回復', fctList, events)) {
      return;
    }
    self.chanshiGoldenBodyUsed = true;
    self.passive3Triggers++;
    self.chanshiHealingAnimTimer = 1.0;

    const healAmount = 100;
    const prevHp = self.hp;
    self.hp = Math.min(self.maxHp, self.hp + healAmount);
    const actualHealed = self.hp - prevHp;
    recordHealingStats(self, actualHealed);

    soundEngine.playZenGoldenHeal();

    // Floating text: Golden heal
    fctList.push({
      id: `fct_heal_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 24,
      text: `+${actualHealed} [金身回復]`,
      color: '#facc15',
      fontSize: 14,
      alpha: 1.0,
      life: 1.1,
      maxLife: 1.1,
      vy: -30
    });

    // Golden core gathering particles: outside converging into center
    for (let i = 0; i < 28; i++) {
      const angle = (i * Math.PI * 2) / 28;
      const startDist = self.radius + 28 + Math.random() * 18;
      const startX = self.x + Math.cos(angle) * startDist;
      const startY = self.y + Math.sin(angle) * startDist;
      particles.push({
        x: startX,
        y: startY,
        vx: -Math.cos(angle) * 85,
        vy: -Math.sin(angle) * 85,
        radius: 2.5 + Math.random() * 2,
        color: Math.random() > 0.3 ? '#fef08a' : '#f59e0b',
        alpha: 0.95,
        maxLife: 0.45,
        life: 0.45,
        type: 'zen_heal_spark'
      });
    }

    // Expanding golden healing ring
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: 64,
      color: '#fde047',
      alpha: 0.9,
      maxLife: 0.65,
      life: 0.65,
      type: 'zen_heal_core'
    });

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      skillName: '金身回復',
      text: `${self.name} 生命值低於 30%，觸發【金身回復】恢復 ${actualHealed} 點生命值！`,
      badge: `金身回復 (+${actualHealed}HP)`
    });
  }
}

/**
 * Huangzuan Passive 1: Targeted Lightning (每5秒自動釋放一次指定性閃電)
 * - 系統自動選擇敵方球體作為目標
 * - 造成 4 點魔法傷害
 * - 使敵人麻痺 0.5 秒（期間敵方無法移動，0.5秒後恢復）
 * - 閃電不可連鎖，每次觸發只造成一次傷害
 * - 特效：黃色與白色電弧在黃鑽周圍聚集，觸發後形成不規則折線閃電連接敵方，命中產生黃色電光爆發、電弧粒子與短暫環形衝擊波
 */
function updateHuangzuanTargetedLightning(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'huangzuan' || self.hp <= 0 || target.hp <= 0) return;

  self.huangzuanLightningCooldown -= dt;
  if (self.huangzuanLightningCooldown <= 0) {
    if (!tryConsumeEnergy(self, 20, '指定性閃電', fctList, events)) {
      self.huangzuanLightningCooldown = 1.0;
      return;
    }
    self.huangzuanLightningCooldown = 5.0; // Reset 5.0s timer
    self.passive1Triggers++;

    // 造成 20 點魔法傷害
    const dmg = 20;
    applyDamageWithDamageSharing(
      target,
      self,
      dmg,
      'magic',
      '指定性閃電',
      target.x,
      target.y,
      matchTime,
      fctList,
      events,
      particles
    );

    // 使敵方麻痺 0.5 秒 (若敵方處於金鐘罩霸體狀態，則抵抗定身麻痺)
    if (target.chanshiSuperArmorTimer > 0) {
      fctList.push({
        id: `fct_armor_immune_${Math.random()}`,
        x: target.x,
        y: target.y - target.radius - 14,
        text: '霸體免控 IMMUNE',
        color: '#fde047',
        fontSize: 12,
        scale: 1.15,
        alpha: 1.0,
        life: 0.8,
        maxLife: 0.8,
        vy: -20,
        damageType: 'status',
        damageValue: 0
      });
      events.push({
        id: `evt_armor_immune_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: target.id,
        targetId: self.id,
        skillName: '霸體免控',
        text: `${target.name} 處於【金鐘罩霸體】狀態，免疫了 ${self.name} 的麻痺定身！`,
        badge: '霸體免控'
      });
    } else {
      target.isParalyzed = true;
      target.paralysisTimer = 0.5;
      target.vx = 0;
      target.vy = 0;
      soundEngine.playParalysis();
    }

    soundEngine.playTargetedLightning();

    // 1. 生成黃鑽本體周圍的聚集電弧粒子 (黃色與白色)
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = self.radius + 4 + Math.random() * 8;
      particles.push({
        x: self.x + Math.cos(angle) * r,
        y: self.y + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        radius: 2 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#facc15' : '#ffffff',
        alpha: 1.0,
        maxLife: 0.28,
        life: 0.28,
        type: 'huangzuan_arc'
      });
    }

    // 2. 生成連向敵方的不規則折線閃電 (Polyline Lightning Bolt)
    const dx = target.x - self.x;
    const dy = target.y - self.y;
    const totalDist = Math.hypot(dx, dy);
    const numSegments = Math.max(5, Math.floor(totalDist / 24));
    let prevX = self.x;
    let prevY = self.y;

    for (let s = 1; s <= numSegments; s++) {
      const t = s / numSegments;
      const targetPointX = self.x + dx * t;
      const targetPointY = self.y + dy * t;
      // Perpendicular zig-zag offset
      const perpX = -dy / (totalDist || 1);
      const perpY = dx / (totalDist || 1);
      const offset = (s === numSegments) ? 0 : (Math.random() - 0.5) * 28;
      const curX = targetPointX + perpX * offset;
      const curY = targetPointY + perpY * offset;

      particles.push({
        x: (prevX + curX) / 2,
        y: (prevY + curY) / 2,
        vx: 0,
        vy: 0,
        radius: 3,
        color: s % 2 === 0 ? '#ffffff' : '#facc15',
        alpha: 1.0,
        maxLife: 0.18,
        life: 0.18,
        type: 'huangzuan_bolt',
        targetX: curX,
        targetY: curY,
        extraData: { startX: prevX, startY: prevY, endX: curX, endY: curY }
      });

      prevX = curX;
      prevY = curY;
    }

    // 3. 命中敵方時產生黃色電光爆發、電弧粒子與短暫環形衝擊波
    particles.push({
      x: target.x,
      y: target.y,
      vx: 0,
      vy: 0,
      radius: 38,
      color: '#fde047',
      alpha: 0.95,
      maxLife: 0.3,
      life: 0.3,
      type: 'huangzuan_shockwave'
    });

    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 140;
      particles.push({
        x: target.x,
        y: target.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2 + Math.random() * 2.5,
        color: Math.random() > 0.35 ? '#e8fc02' : '#ffffff',
        alpha: 1.0,
        maxLife: 0.32,
        life: 0.32,
        type: 'huangzuan_spark'
      });
    }

    // 麻痺浮動文字
    fctList.push({
      id: `fct_paralyze_${Math.random()}`,
      x: target.x,
      y: target.y - target.radius - 24,
      text: `麻痺 0.5s`,
      color: '#e8fc02',
      fontSize: 12,
      alpha: 1.0,
      life: 0.75,
      maxLife: 0.75,
      vy: -20
    });

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      damage: dmg,
      skillName: '指定性閃電',
      text: `${self.name} 釋放【指定性閃電】命中 ${target.name} 造成 20 點魔法傷害並使其麻痺 0.5 秒！`,
      badge: '指定性閃電 (20魔傷+麻痺0.5s)'
    });
  }
}

/**
 * Huangzuan Passive 2: Lightning Hyperspeed (閃電超速)
 * - 每 2 秒自動增加 1 層速度，最高 10 層
 * - 每層速度增加 5% (最高 141%)
 * - 碰撞後進入 10 秒冷卻，期間無法累積層數，冷卻結束重新每 2 秒累積
 */
function updateHuangzuanSpeedPassive(
  self: BallState,
  dt: number,
  particles: Particle[]
) {
  if (self.characterId !== 'huangzuan' || self.hp <= 0) return;

  // If on 10s cooldown after collision
  if (self.huangzuanSpeedCooldown > 0) {
    self.huangzuanSpeedCooldown = Math.max(0, self.huangzuanSpeedCooldown - dt);
    return;
  }

  // Not on cooldown: accumulate 1 stack every 2 seconds up to 10
  if (self.huangzuanSpeedStacks < 10) {
    self.huangzuanStackTimer += dt;
    if (self.huangzuanStackTimer >= 2.0) {
      if (!tryConsumeEnergy(self, 5, '閃電超速', undefined, undefined)) {
        self.huangzuanStackTimer = 1.5;
        return;
      }
      self.huangzuanStackTimer -= 2.0;
      self.huangzuanSpeedStacks = Math.min(10, self.huangzuanSpeedStacks + 1);
      soundEngine.playSpeedStack();

      // Mini burst of lightning when stack is gained
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 50;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 2,
          color: '#e8fc02',
          alpha: 1.0,
          maxLife: 0.25,
          life: 0.25,
          type: 'huangzuan_spark'
        });
      }
    }
  }

  // Ambient particles based on current stacks
  const stacks = self.huangzuanSpeedStacks || 0;
  if (stacks > 0 && Math.random() < 0.15 + stacks * 0.05) {
    const angle = Math.random() * Math.PI * 2;
    const r = self.radius + 2 + Math.random() * 6;
    particles.push({
      x: self.x + Math.cos(angle) * r,
      y: self.y + Math.sin(angle) * r,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      radius: 1.5 + (stacks / 10) * 1.5,
      color: Math.random() > 0.3 ? '#e8fc02' : '#ffffff',
      alpha: 0.85,
      maxLife: 0.25,
      life: 0.25,
      type: 'huangzuan_arc'
    });
  }
}

/**
 * Huangzuan Passive 3: Lightning Overcharge (閃電超能)
 * - 自動釋放範圍性雷電 (3.5秒持續，結束後30秒冷卻)
 * - 以黃鑽為中心形成雷電能量區域 (半徑 115px)
 * - 敵方進入有效範圍後每 0.1 秒受到 1 點固定魔法傷害 (最多35次)
 * - 離開範圍停止受傷，重新進入再次受傷
 * - 3.5秒結束後雷電光環向中心快速收縮，粒子消散並進入30秒冷卻
 */
function updateHuangzuanFieldPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'huangzuan' || self.hp <= 0) return;

  const FIELD_RADIUS = 115;

  // If field is NOT currently active, manage cooldown timer
  if (!self.huangzuanFieldActive) {
    self.huangzuanFieldCooldown -= dt;
    if (self.huangzuanFieldCooldown <= 0) {
      if (!tryConsumeEnergy(self, 40, '閃電超能', fctList, events)) {
        self.huangzuanFieldCooldown = 1.0;
        return;
      }
      // Trigger Field!
      self.huangzuanFieldActive = true;
      self.huangzuanFieldDuration = 3.5;
      self.huangzuanFieldTickTimer = 0;
      self.passive3Triggers++;

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '閃電超能',
        text: `${self.name} 釋放【閃電超能】，以自身為中心生成持續 3.5 秒的雷電能量區域！`,
        badge: '閃電超能 (3.5s每0.1s電擊)'
      });
    }
  }

  // If field IS active
  if (self.huangzuanFieldActive) {
    self.huangzuanFieldDuration -= dt;
    self.huangzuanFieldTickTimer += dt;

    // Field ambient lightning aura particles
    if (Math.random() < 0.4) {
      const angle = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * (FIELD_RADIUS - 10);
      particles.push({
        x: self.x + Math.cos(angle) * r,
        y: self.y + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 30,
        vy: (Math.random() - 0.5) * 30,
        radius: 2 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#e8fc02' : '#ffffff',
        alpha: 0.9,
        maxLife: 0.22,
        life: 0.22,
        type: 'huangzuan_arc'
      });
    }

    // Process 0.1s fixed tick damage
    while (self.huangzuanFieldTickTimer >= 0.1) {
      self.huangzuanFieldTickTimer -= 0.1;

      if (target.hp > 0) {
        const dist = Math.hypot(target.x - self.x, target.y - self.y);
        if (dist <= FIELD_RADIUS + target.radius) {
          const tickDmg = 2.5;
          applyDamageWithDamageSharing(
            target,
            self,
            tickDmg,
            'magic',
            '閃電超能',
            target.x,
            target.y,
            matchTime,
            fctList,
            events,
            particles
          );

          soundEngine.playLightningFieldTick();

          // Small electric burst on enemy
          for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 40 + Math.random() * 60;
            particles.push({
              x: target.x,
              y: target.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              radius: 2,
              color: '#e8fc02',
              alpha: 0.95,
              maxLife: 0.18,
              life: 0.18,
              type: 'huangzuan_spark'
            });
          }
        }
      }
    }

    // Check if 3.5s duration has ended
    if (self.huangzuanFieldDuration <= 0) {
      self.huangzuanFieldActive = false;
      self.huangzuanFieldDuration = 0;
      self.huangzuanFieldCooldown = 30.0; // 30s cooldown
      self.huangzuanFieldCollapseTimer = 0.35;

      soundEngine.playFieldCollapse();

      // Particles collapsing rapidly into center
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI * 2) / 24;
        const r = FIELD_RADIUS;
        const px = self.x + Math.cos(angle) * r;
        const py = self.y + Math.sin(angle) * r;
        particles.push({
          x: px,
          y: py,
          vx: -Math.cos(angle) * 220,
          vy: -Math.sin(angle) * 220,
          radius: 2.5 + Math.random() * 1.5,
          color: Math.random() > 0.4 ? '#e8fc02' : '#ffffff',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'huangzuan_collapse'
        });
      }
    }
  }
}

/**
 * Update Huangzuan general timers & paralysis status on any ball
 */
function updateHuangzuanTimers(
  ball: BallState,
  dt: number,
  particles: Particle[]
) {
  // Paralysis timer & visual arcs
  if (ball.isParalyzed) {
    ball.paralysisTimer -= dt;
    ball.vx = 0;
    ball.vy = 0;

    // Small yellow arcs surrounding enemy ball during paralysis
    if (Math.random() < 0.6) {
      const angle = Math.random() * Math.PI * 2;
      const r = ball.radius + 2 + Math.random() * 6;
      particles.push({
        x: ball.x + Math.cos(angle) * r,
        y: ball.y + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: 1.5 + Math.random() * 1.5,
        color: Math.random() > 0.3 ? '#e8fc02' : '#ffffff',
        alpha: 0.9,
        maxLife: 0.18,
        life: 0.18,
        type: 'huangzuan_arc'
      });
    }

    if (ball.paralysisTimer <= 0) {
      ball.isParalyzed = false;
      ball.paralysisTimer = 0;
    }
  }

  // Field collapse visual timer
  if (ball.huangzuanFieldCollapseTimer > 0) {
    ball.huangzuanFieldCollapseTimer = Math.max(0, ball.huangzuanFieldCollapseTimer - dt);
  }
}

/**
 * Handle Lanzuan Blue Orb collision with enemy ball
 */
function handleLanzuanOrbCollisions(
  owner: BallState,
  enemy: BallState,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (!owner.lanzuanOrb || owner.lanzuanOrb.hp <= 0) return;

  const orb = owner.lanzuanOrb;
  const dx = enemy.x - orb.x;
  const dy = enemy.y - orb.y;
  const dist = Math.hypot(dx, dy);
  const minDist = enemy.radius + orb.radius;

  if (dist < minDist && dist > 0.001) {
    const nx = dx / dist;
    const ny = dy / dist;

    // Slight positional bounce on enemy
    enemy.x = orb.x + nx * minDist;
    enemy.y = orb.y + ny * minDist;
    enemy.vx += nx * 60;
    enemy.vy += ny * 60;

    // Hit throttle so 1 collision tick doesn't wipe all HP
    if (matchTime - (orb.lastHitTime || 0) < 0.25) return;

    orb.hp -= 1;
    orb.lastHitTime = matchTime;
    owner.hitsReceived++;

    fctList.push({
      id: `fct_orb_hit_${Math.random()}`,
      x: orb.x,
      y: orb.y - orb.radius - 8,
      text: `-1 HP [光球受擊]`,
      color: '#38bdf8',
      fontSize: 11,
      alpha: 1.0,
      life: 0.7,
      maxLife: 0.7,
      vy: -20
    });

    // Hit sparks
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 80;
      particles.push({
        x: orb.x,
        y: orb.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2,
        color: '#38bdf8',
        alpha: 1.0,
        maxLife: 0.25,
        life: 0.25,
        type: 'lanzuan_orb_spark'
      });
    }

    if (orb.hp <= 0) {
      owner.lanzuanOrb = null;
      owner.lanzuanOrbCooldown = 20.0;
      soundEngine.playLanzuanOrbBreak();

      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 130;
        particles.push({
          x: orb.x,
          y: orb.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'lanzuan_shard'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: enemy.id,
        targetId: owner.id,
        skillName: '藍色光球',
        text: `藍鑽的【藍色光球】承受碰撞已破碎消散！(進入20秒冷卻)`,
        badge: '光球破碎'
      });
    }
  }
}

/**
 * Lanzuan Passive 1: Blue Wavelength (藍色波長)
 * - 藍鑽持續向周圍釋放擴散藍色波長 (半徑 110px，無冷卻常駐)
 * - 敵方進入範圍後每 0.5 秒持續受到 1 點魔法傷害
 */
function updateLanzuanWavelengthPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lanzuan' || self.hp <= 0) return;

  const AURA_RADIUS = 110;

  // Emit translucent blue ripples and soft particles constantly
  if (Math.random() < 0.25) {
    const angle = Math.random() * Math.PI * 2;
    const r = 10 + Math.random() * (AURA_RADIUS - 15);
    particles.push({
      x: self.x + Math.cos(angle) * r,
      y: self.y + Math.sin(angle) * r,
      vx: Math.cos(angle) * 20,
      vy: Math.sin(angle) * 20,
      radius: 1.8 + Math.random() * 1.5,
      color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
      alpha: 0.8,
      maxLife: 0.4,
      life: 0.4,
      type: 'lanzuan_spark'
    });
  }

  // Periodic tick for damage (0.5s interval)
  self.lanzuanWaveTickTimer = (self.lanzuanWaveTickTimer || 0) + dt;
  if (self.lanzuanWaveTickTimer >= 0.5) {
    self.lanzuanWaveTickTimer -= 0.5;

    if (target.hp > 0) {
      const dist = Math.hypot(target.x - self.x, target.y - self.y);
      if (dist <= AURA_RADIUS + target.radius) {
        if (!tryConsumeEnergy(self, 8, '藍色波長', undefined, undefined)) {
          return;
        }
        const tickDmg = 9; // Buffed from 6
        applyDamageWithDamageSharing(
          target,
          self,
          tickDmg,
          'magic',
          '藍色波長',
          target.x,
          target.y,
          matchTime,
          fctList,
          events,
          particles
        );

        soundEngine.playLanzuanWaveTick();
        self.passive1Triggers++;

        // Blue pulse on target
        for (let i = 0; i < 4; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 35 + Math.random() * 50;
          particles.push({
            x: target.x,
            y: target.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#38bdf8',
            alpha: 0.9,
            maxLife: 0.2,
            life: 0.2,
            type: 'lanzuan_spark'
          });
        }
      }
    }
  }
}

/**
 * Lanzuan Passive 2: Blue Orb (藍色光球)
 * - 開局自動召喚 1 顆靜止「藍色光球」(擁有 3 HP，停留在原地不移動不追蹤)
 * - 光球持續向敵方發射「藍色能量子彈」(造成 0.1 點魔法傷害，射擊間隔 1.5s，清楚可見飛行彈道與拖尾)
 * - 光球承受 3 次攻擊後破碎消散，進入 20 秒冷卻後重新召喚
 */
function updateLanzuanBlueOrbPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lanzuan' || self.hp <= 0) return;

  // 1. Orb Summon Logic
  if (!self.lanzuanOrb) {
    self.lanzuanOrbCooldown -= dt;
    if (self.lanzuanOrbCooldown <= 0) {
      if (!tryConsumeEnergy(self, 30, '藍色光球', fctList, events)) {
        self.lanzuanOrbCooldown = 1.0;
        return;
      }
      // Summon a stationary Blue Orb
      const spawnX = Math.max(90, Math.min(ARENA_WIDTH - 90, self.x + (target.x - self.x) * 0.32 + (Math.random() - 0.5) * 50));
      const spawnY = Math.max(80, Math.min(ARENA_HEIGHT - 80, self.y + (target.y - self.y) * 0.32 + (Math.random() - 0.5) * 50));

      self.lanzuanOrb = {
        id: `lanzuan_orb_${Math.random()}`,
        ownerId: self.id,
        x: spawnX,
        y: spawnY,
        radius: 14,
        hp: 4,
        maxHp: 4,
        shootCooldown: 0.5,
        createdTime: matchTime,
        flashTimer: 0
      };

      self.lanzuanOrbCooldown = 12.0; // Balanced down to 12s (from 20s)
      self.passive2Triggers++;
      soundEngine.playLanzuanOrbSummon();

      // Summon crystallization particles
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 80;
        particles.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5,
          color: '#38bdf8',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'lanzuan_orb_spark'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '藍色光球',
        text: `${self.name} 自動召喚【藍色光球】（4 HP），持續發射可視化藍色能量子彈！`,
        badge: '藍色光球 (4HP)'
      });
    }
  }

  // 2. Active Orb Shooting Logic
  if (self.lanzuanOrb && self.lanzuanOrb.hp > 0) {
    const orb = self.lanzuanOrb;

    // Decay flash timer
    if (orb.flashTimer && orb.flashTimer > 0) {
      orb.flashTimer = Math.max(0, orb.flashTimer - dt);
    }

    // Ambient floating particles around orb
    if (Math.random() < 0.22) {
      const a = Math.random() * Math.PI * 2;
      const r = orb.radius + 2 + Math.random() * 6;
      particles.push({
        x: orb.x + Math.cos(a) * r,
        y: orb.y + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius: 1.5,
        color: '#38bdf8',
        alpha: 0.85,
        maxLife: 0.3,
        life: 0.3,
        type: 'lanzuan_orb_spark'
      });
    }

    orb.shootCooldown -= dt;
    if (orb.shootCooldown <= 0) {
      orb.shootCooldown = 1.0; // v2.6: 1.0s interval (+0.2s CD)
      orb.flashTimer = 0.22;   // Core flash

      if (target.hp > 0) {
        // Direct flight path from orb core to current target position
        const angle = Math.atan2(target.y - orb.y, target.x - orb.x);
        const speed = 460; // v2.6: 彈速由 320 提升至 460，遠程手感更佳
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        projectiles.push({
          id: `lanzuan_bullet_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          type: 'lanzuan_bullet',
          x: orb.x,
          y: orb.y,
          vx,
          vy,
          radius: 6,
          damage: 18, // v2.6: 提升單發傷害至 18 (原 14)
          life: 3.5,
          maxLife: 3.5,
          color: '#38bdf8',
          trail: []
        });

        soundEngine.playLanzuanOrbShoot();

        // Muzzle burst ring & sparkles from orb core
        particles.push({
          x: orb.x,
          y: orb.y,
          vx: 0,
          vy: 0,
          radius: orb.radius + 8,
          color: '#38bdf8',
          alpha: 0.9,
          maxLife: 0.2,
          life: 0.2,
          type: 'shockwave'
        });

        for (let i = 0; i < 6; i++) {
          const a = angle + (Math.random() - 0.5) * 0.7;
          const spd = 40 + Math.random() * 70;
          particles.push({
            x: orb.x,
            y: orb.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2,
            color: '#e0f2fe',
            alpha: 1.0,
            maxLife: 0.2,
            life: 0.2,
            type: 'lanzuan_spark'
          });
        }
      }
    }
  }
}

/**
 * Lanzuan Passive 3: Blue Emotional Energy (藍色情緒能量)
 * - 每 40 秒自動釋放「藍色情緒能量」廣域法陣 (半徑 140px，持續 3.5 秒)
 * - 範圍內敵方減速 35%
 * - 3.5 秒結束時急劇收縮引發魔法爆發，對範圍內敵方造成 90 點爆發魔法傷害！
 */
function updateLanzuanEmotionPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'lanzuan' || self.hp <= 0) return;

  const FIELD_RADIUS = 140;

  // Cooldown & trigger
  if (!self.lanzuanEmotionFieldActive) {
    self.lanzuanEmotionCooldown -= dt;
    if (self.lanzuanEmotionCooldown <= 0) {
      if (!tryConsumeEnergy(self, 45, '藍色情緒能量', fctList, events)) {
        self.lanzuanEmotionCooldown = 1.0;
        return;
      }
      self.lanzuanEmotionFieldActive = true;
      self.lanzuanEmotionFieldDuration = 3.5;
      self.passive3Triggers++;
      soundEngine.playLanzuanEmotionCast();

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '藍色情緒能量',
        text: `${self.name} 施展【藍色情緒能量】，開啟大範圍情緒能量場並減速敵方！`,
        badge: '情緒能量場 (減速35%)'
      });
    }
  }

  // Active Emotion Field
  if (self.lanzuanEmotionFieldActive) {
    self.lanzuanEmotionFieldDuration -= dt;

    // Check slow on target
    if (target.hp > 0) {
      const dist = Math.hypot(target.x - self.x, target.y - self.y);
      if (dist <= FIELD_RADIUS + target.radius) {
        target.isSlowedByLanzuan = true;
        target.slowedByLanzuanTimer = 0.2;
      }
    }

    // Ambient floating blue emotional particles
    if (Math.random() < 0.35) {
      const angle = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * (FIELD_RADIUS - 15);
      particles.push({
        x: self.x + Math.cos(angle) * r,
        y: self.y + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        radius: 2 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
        alpha: 0.85,
        maxLife: 0.35,
        life: 0.35,
        type: 'lanzuan_emotion_ring'
      });
    }

    // When 3.5s duration ends: EXPLOSION / MAGIC BURST
    if (self.lanzuanEmotionFieldDuration <= 0) {
      self.lanzuanEmotionFieldActive = false;
      self.lanzuanEmotionFieldDuration = 0;
      self.lanzuanEmotionCooldown = 25.0; // Balanced down to 25s (from 40s)
      self.lanzuanEmotionCollapseTimer = 0.35;

      soundEngine.playLanzuanEmotionBurst();

      // Check if target is caught in burst
      if (target.hp > 0) {
        const dist = Math.hypot(target.x - self.x, target.y - self.y);
        if (dist <= FIELD_RADIUS + target.radius) {
          const burstDamage = 130; // Buffed from 90
          applyDamageWithDamageSharing(
            target,
            self,
            burstDamage,
            'magic',
            '藍色情緒能量爆發',
            target.x,
            target.y,
            matchTime,
            fctList,
            events,
            particles
          );

          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            targetId: target.id,
            damage: burstDamage,
            skillName: '藍色情緒能量',
            text: `${self.name} 的【藍色情緒能量】引發魔法爆發，對 ${target.name} 造成 130 點爆發魔法傷害！`,
            badge: '情緒爆發 (130魔傷)'
          });
        }
      }

      // Massive crystalline burst shockwaves & shards
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: FIELD_RADIUS,
        color: '#38bdf8',
        alpha: 1.0,
        maxLife: 0.35,
        life: 0.35,
        type: 'lanzuan_emotion_burst'
      });

      for (let i = 0; i < 28; i++) {
        const a = (i * Math.PI * 2) / 28;
        const spd = 120 + Math.random() * 160;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 3 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#38bdf8' : '#e0f2fe',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'lanzuan_shard'
        });
      }
    }
  }
}

/**
 * Update Lanzuan general timers & slow decay on any ball
 */
function updateLanzuanTimers(ball: BallState, dt: number) {
  if (ball.slowedByLanzuanTimer > 0) {
    ball.slowedByLanzuanTimer -= dt;
    if (ball.slowedByLanzuanTimer <= 0) {
      ball.isSlowedByLanzuan = false;
      ball.slowedByLanzuanTimer = 0;
    }
  }

  if (ball.lanzuanEmotionCollapseTimer > 0) {
    ball.lanzuanEmotionCollapseTimer = Math.max(0, ball.lanzuanEmotionCollapseTimer - dt);
  }
}

/**
 * Fenzuan Passive 1: Pink Shield (粉色圓盾)
 * - 丟出一面粉色圓形能量盾牌
 * - 從粉鑽位置向前直線飛行 150px，到達 150px 後立即返回粉鑽
 * - 飛出階段命中敵人：造成 10 點物理傷害
 * - 返回階段命中敵人：造成 6 點物理傷害
 * - 盾牌完全返回粉鑽後，才開始 8 秒冷卻
 * - 盾牌不追蹤敵人
 */
function updateFenzuanShieldPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[] | undefined,
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'fenzuan' || self.hp <= 0) return;

  // If shield is not currently in flight, tick down cooldown
  if (!self.fenzuanShieldActive) {
    if (self.fenzuanShieldCooldown > 0) {
      self.fenzuanShieldCooldown -= dt;
    }

    if (self.fenzuanShieldCooldown <= 0) {
      if (!tryConsumeEnergy(self, 20, '粉色圓盾', fctList, events)) {
        self.fenzuanShieldCooldown = 1.0;
        return;
      }
      self.fenzuanShieldActive = true;
      self.passive1Triggers++;

      // Determine throw direction (straight line in current moving direction or towards target)
      let throwAngle = 0;
      const curSpeed = Math.hypot(self.vx, self.vy);
      if (curSpeed > 15) {
        throwAngle = Math.atan2(self.vy, self.vx);
      } else {
        throwAngle = Math.atan2(target.y - self.y, target.x - self.x);
      }

      const shieldSpeed = 300;
      const vx = Math.cos(throwAngle) * shieldSpeed;
      const vy = Math.sin(throwAngle) * shieldSpeed;

      projectiles.push({
        id: `fenzuan_shield_${Math.random()}`,
        ownerId: self.id,
        targetId: target.id,
        type: 'fenzuan_shield',
        x: self.x,
        y: self.y,
        vx,
        vy,
        width: 28,
        height: 28,
        radius: 14,
        damage: 10,
        isPhysical: true,
        life: 8.0,
        maxLife: 8.0,
        color: '#f472b6',
        trail: [],
        fenzuanShieldState: 'outward',
        fenzuanOriginX: self.x,
        fenzuanOriginY: self.y,
        fenzuanTraveledDist: 0,
        fenzuanMaxDist: 150,
        fenzuanHitOutward: false,
        fenzuanHitReturning: false
      });

      soundEngine.playFenzuanShieldThrow();

      // Launch flash and sparkles
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: self.radius + 8,
        color: '#f472b6',
        alpha: 0.9,
        maxLife: 0.22,
        life: 0.22,
        type: 'fenzuan_shield_ring'
      });

      for (let i = 0; i < 8; i++) {
        const a = throwAngle + (Math.random() - 0.5) * 0.8;
        const spd = 60 + Math.random() * 80;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.2,
          color: Math.random() > 0.4 ? '#f472b6' : '#fdf2f8',
          alpha: 1.0,
          maxLife: 0.25,
          life: 0.25,
          type: 'fenzuan_spark'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '粉色圓盾',
        text: `${self.name} 擲出【粉色圓盾】，向前直線飛行 150px！`,
        badge: '粉色圓盾 (直線150px)'
      });
    }
  }
}

/**
 * Fenzuan Passive 2: Pink Damage Reduction Field (粉色減傷力場)
 * - 持續時間：5 秒，冷卻時間：15 秒
 * - 減傷效果：1.5%
 * - 力場以粉鑽為中心，範圍內自身與友方受到傷害時降低 1.5%
 * - 離開範圍後立即失去減傷效果
 */
function updateFenzuanFieldPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[] | undefined,
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'fenzuan' || self.hp <= 0) {
    if (self.fenzuanFieldActive) {
      self.fenzuanFieldActive = false;
      self.isProtectedByFenzuanField = false;
    }
    return;
  }

  const FIELD_RADIUS = 85;

  // Not currently active -> tick down 15s cooldown
  if (!self.fenzuanFieldActive) {
    self.isProtectedByFenzuanField = false;
    if (self.fenzuanFieldCooldown > 0) {
      self.fenzuanFieldCooldown -= dt;
    }

    if (self.fenzuanFieldCooldown <= 0) {
      if (!tryConsumeEnergy(self, 25, '粉色減傷力場', fctList, events)) {
        self.fenzuanFieldCooldown = 1.0;
        return;
      }
      self.fenzuanFieldActive = true;
      self.fenzuanFieldDuration = 5.0;
      self.passive2Triggers++;

      soundEngine.playFenzuanFieldCast();

      // Field activation ripple
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: FIELD_RADIUS,
        color: '#f472b6',
        alpha: 0.85,
        maxLife: 0.4,
        life: 0.4,
        type: 'fenzuan_field_ring'
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '粉色減傷力場',
        text: `${self.name} 展開【粉色減傷力場】，自身與範圍內友軍受傷降低 1.5%！`,
        badge: '粉色減傷力場 (持續5s)'
      });
    }
  }

  // Field is active
  if (self.fenzuanFieldActive) {
    self.fenzuanFieldDuration -= dt;
    self.isProtectedByFenzuanField = true;

    // Ambient floating pink diamond shimmer
    if (Math.random() < 0.35) {
      const angle = Math.random() * Math.PI * 2;
      const r = 16 + Math.random() * (FIELD_RADIUS - 10);
      particles.push({
        x: self.x + Math.cos(angle) * r,
        y: self.y + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        radius: 1.8 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? '#f472b6' : '#fdf2f8',
        alpha: 0.8,
        maxLife: 0.3,
        life: 0.3,
        type: 'fenzuan_spark'
      });
    }

    // When 5s duration ends
    if (self.fenzuanFieldDuration <= 0) {
      self.fenzuanFieldActive = false;
      self.fenzuanFieldDuration = 0;
      self.isProtectedByFenzuanField = false;
      self.fenzuanFieldCooldown = 22.0; // Enters 22s cooldown (調長自 15s)

      // Gentle dissipation ring
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: FIELD_RADIUS,
        color: '#fbcfe8',
        alpha: 0.6,
        maxLife: 0.3,
        life: 0.3,
        type: 'fenzuan_field_ripple'
      });
    }
  }
}

/**
 * Fenzuan Passive 3: Bubble Spikes (泡泡尖刺)
 * - 包裹自身形成粉色泡泡尖刺
 * - 泡泡形成後持續進行隨機方向衝刺與衝撞
 * - 持續時間：10 秒，碰觸傷害：3 點物理傷害，冷卻時間：30 秒
 * - 10 秒結束後泡泡消散並進入 30 秒冷卻
 */
function updateFenzuanBubblePassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'fenzuan' || self.hp <= 0) {
    if (self.fenzuanBubbleActive) {
      self.fenzuanBubbleActive = false;
    }
    return;
  }

  // Not currently active -> tick down 30s cooldown
  if (!self.fenzuanBubbleActive) {
    if (self.fenzuanBubbleCooldown > 0) {
      self.fenzuanBubbleCooldown -= dt;
    }

    if (self.fenzuanBubbleCooldown <= 0) {
      if (!tryConsumeEnergy(self, 35, '泡泡尖刺', fctList, events)) {
        self.fenzuanBubbleCooldown = 1.0;
        return;
      }
      self.fenzuanBubbleActive = true;
      self.fenzuanBubbleDuration = 7.5;
      self.fenzuanBubbleDashTimer = 0.3;
      self.passive3Triggers++;

      soundEngine.playFenzuanBubbleSpikesActive();

      // Bubble formation ring & sparkles
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: self.radius + 14,
        color: '#f472b6',
        alpha: 0.95,
        maxLife: 0.35,
        life: 0.35,
        type: 'fenzuan_shield_ring'
      });

      for (let i = 0; i < 14; i++) {
        const a = (i * Math.PI * 2) / 14;
        particles.push({
          x: self.x + Math.cos(a) * (self.radius + 8),
          y: self.y + Math.sin(a) * (self.radius + 8),
          vx: Math.cos(a) * 35,
          vy: Math.sin(a) * 35,
          radius: 2.5,
          color: '#f472b6',
          alpha: 1.0,
          maxLife: 0.3,
          life: 0.3,
          type: 'fenzuan_spike_shard'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '泡泡尖刺',
        text: `${self.name} 凝成【泡泡尖刺】，7.5秒內衝刺並造成 +8 碰觸物理傷害！`,
        badge: '泡泡尖刺 (持續7.5s)'
      });
    }
  }

  // Bubble Spikes active
  if (self.fenzuanBubbleActive) {
    self.fenzuanBubbleDuration -= dt;

    // Continuous controlled random direction dash bursts
    self.fenzuanBubbleDashTimer -= dt;
    if (self.fenzuanBubbleDashTimer <= 0) {
      self.fenzuanBubbleDashTimer = 0.6 + Math.random() * 0.4; // Every 0.6~1.0s

      // Dash impulse towards enemy with randomized angle deviation
      const angleToTarget = Math.atan2(target.y - self.y, target.x - self.x);
      const dashAngle = angleToTarget + (Math.random() - 0.5) * 1.2;
      const dashImpulse = 180 + Math.random() * 50;

      self.vx += Math.cos(dashAngle) * dashImpulse;
      self.vy += Math.sin(dashAngle) * dashImpulse;

      // Cap speed to prevent physics instability
      const maxSpd = 360;
      const curSpd = Math.hypot(self.vx, self.vy);
      if (curSpd > maxSpd) {
        self.vx = (self.vx / curSpd) * maxSpd;
        self.vy = (self.vy / curSpd) * maxSpd;
      }

      // Dash propulsion bubble stream
      for (let i = 0; i < 4; i++) {
        const revAngle = dashAngle + Math.PI + (Math.random() - 0.5) * 0.6;
        const spd = 40 + Math.random() * 60;
        particles.push({
          x: self.x - Math.cos(dashAngle) * self.radius,
          y: self.y - Math.sin(dashAngle) * self.radius,
          vx: Math.cos(revAngle) * spd,
          vy: Math.sin(revAngle) * spd,
          radius: 2.5 + Math.random() * 2,
          color: '#fbcfe8',
          alpha: 0.9,
          maxLife: 0.28,
          life: 0.28,
          type: 'fenzuan_bubble'
        });
      }
    }

    // Touch / Spiky Bubble Contact Detection with safe debounce
    const dx = target.x - self.x;
    const dy = target.y - self.y;
    const dist = Math.hypot(dx, dy);
    const bubbleRadius = self.radius + 6;
    const touchDist = bubbleRadius + target.radius;

    if (dist <= touchDist && dist > 0.001) {
      const now = matchTime;
      // 0.35s touch interval throttle to prevent multi-frame damage explosion
      if (now - (self.fenzuanBubbleLastTouchTime || 0) >= 0.35) {
        self.fenzuanBubbleLastTouchTime = now;
        self.passive3Triggers++;

        const nx = dx / dist;
        const ny = dy / dist;
        const hitX = self.x + nx * bubbleRadius;
        const hitY = self.y + ny * bubbleRadius;

        applyDamageWithDamageSharing(
          target,
          self,
          8,
          'physical',
          '泡泡尖刺碰觸',
          hitX,
          hitY,
          matchTime,
          fctList,
          events,
          particles
        );

        soundEngine.playFenzuanBubbleSpikeImpact();

        // Crystal needle impact particles
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 80;
          particles.push({
            x: hitX,
            y: hitY,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2 + Math.random() * 1.5,
            color: Math.random() > 0.35 ? '#f472b6' : '#fdf2f8',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'fenzuan_spike_shard'
          });
        }
      }
    }

    // Ambient floating bubble trail & crystal needle sparks
    if (Math.random() < 0.4) {
      const a = Math.random() * Math.PI * 2;
      const r = self.radius + 4 + Math.random() * 6;
      particles.push({
        x: self.x + Math.cos(a) * r,
        y: self.y + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        radius: 2 + Math.random() * 1.8,
        color: Math.random() > 0.35 ? '#f472b6' : '#fdf2f8',
        alpha: 0.85,
        maxLife: 0.3,
        life: 0.3,
        type: 'fenzuan_bubble'
      });
    }

    // When 7.5s duration ends: bubble burst & 40s cooldown
    if (self.fenzuanBubbleDuration <= 0) {
      self.fenzuanBubbleActive = false;
      self.fenzuanBubbleDuration = 0;
      self.fenzuanBubbleCooldown = 40.0; // Enters 40s cooldown (調長自 30s)

      soundEngine.playFenzuanBubblePop();

      // Bubble pop burst
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: self.radius + 18,
        color: '#f472b6',
        alpha: 0.9,
        maxLife: 0.3,
        life: 0.3,
        type: 'shockwave'
      });

      for (let i = 0; i < 18; i++) {
        const a = (i * Math.PI * 2) / 18;
        const spd = 60 + Math.random() * 90;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#f472b6' : '#fbcfe8',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'fenzuan_bubble_pop'
        });
      }
    }
  }
}

/**
 * Update Fenzuan timers & animation decays
 */
function updateFenzuanTimers(ball: BallState, dt: number) {
  if (ball.fenzuanShieldCatchAnimTimer && ball.fenzuanShieldCatchAnimTimer > 0) {
    ball.fenzuanShieldCatchAnimTimer = Math.max(0, ball.fenzuanShieldCatchAnimTimer - dt);
  }

  if (ball.fenzuanFieldDamageReductionTimer && ball.fenzuanFieldDamageReductionTimer > 0) {
    ball.fenzuanFieldDamageReductionTimer = Math.max(0, ball.fenzuanFieldDamageReductionTimer - dt);
  }
}

/**
 * Check collisions between Baizuan's Mirror Clone and Enemy Ball
 */
function handleBaizuanCloneCollisions(
  owner: BallState,
  target: BallState,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (owner.characterId !== 'baizuan' || !owner.baizuanClone || owner.baizuanClone.hp <= 0) return;

  const clone = owner.baizuanClone;
  const dx = target.x - clone.x;
  const dy = target.y - clone.y;
  const dist = Math.hypot(dx, dy);
  const minDist = clone.radius + target.radius;

  if (dist < minDist && dist > 0.001) {
    // Normal & Separation
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minDist - dist;

    target.x += nx * overlap * 0.5;
    target.y += ny * overlap * 0.5;
    clone.x -= nx * overlap * 0.5;
    clone.y -= ny * overlap * 0.5;

    // Bounce reaction
    const kx = clone.vx - target.vx;
    const ky = clone.vy - target.vy;
    const p = 2 * (nx * kx + ny * ky) / (0.85 + target.mass);

    clone.vx -= p * target.mass * nx * 1.1;
    clone.vy -= p * target.mass * ny * 1.1;
    target.vx += p * 0.85 * nx * 1.1;
    target.vy += p * 0.85 * ny * 1.1;

    // Clone loses 1 health point per collision
    clone.hp = Math.max(0, clone.hp - 1);
    clone.lastHitTime = matchTime;

    // Target takes 60% clone collision damage (8 magic damage)
    applyDamageWithDamageSharing(
      target,
      owner,
      8,
      'magic',
      '鏡像分身碰撞',
      (clone.x + target.x) / 2,
      (clone.y + target.y) / 2,
      matchTime,
      fctList,
      events,
      particles
    );

    fctList.push({
      id: `fct_clone_${Math.random()}`,
      x: clone.x,
      y: clone.y - clone.radius - 8,
      text: `-1 格 [分身]`,
      color: '#ffffff',
      fontSize: 11,
      alpha: 1.0,
      life: 0.7,
      maxLife: 0.7,
      vy: -20
    });

    // Impact Shards
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 50 + Math.random() * 80;
      particles.push({
        x: (clone.x + target.x) / 2,
        y: (clone.y + target.y) / 2,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2,
        color: '#ffffff',
        alpha: 1.0,
        maxLife: 0.3,
        life: 0.3,
        type: 'baizuan_clone_shard'
      });
    }

    if (clone.hp <= 0) {
      owner.baizuanClone = null;
      owner.baizuanCloneCooldown = 16.0;
      soundEngine.playBaizuanCloneShatter();

      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 140;
        particles.push({
          x: clone.x,
          y: clone.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#ffffff' : '#e2e8f0',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'baizuan_mirror_crack'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: owner.id,
        targetId: target.id,
        skillName: '鏡像分身',
        text: `鏡像分身承受碰撞已破碎！(進入16s冷卻)`,
        badge: '分身破碎'
      });
    }
  }
}

/**
 * Baizuan Passive 1: Mirror Clone (鏡像分身 - 20s CD, 15s duration, 2 HP)
 * - 模仿敵方當前被動一技能，造成 50% 傷害與控制持續時間
 */
function updateBaizuanMirrorClonePassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'baizuan') return;

  if (self.hp <= 0) {
    if (self.baizuanClone) self.baizuanClone = null;
    return;
  }

  // Active Clone Lifecycle
  if (self.baizuanClone && self.baizuanClone.hp > 0) {
    const clone = self.baizuanClone;
    clone.duration -= dt;

    // Clone movement & tracking enemy ball
    const toTargetX = target.x - clone.x;
    const toTargetY = target.y - clone.y;
    const distToTarget = Math.hypot(toTargetX, toTargetY);
    const cloneSpeed = 145;

    if (distToTarget > 1) {
      clone.vx = (toTargetX / distToTarget) * cloneSpeed;
      clone.vy = (toTargetY / distToTarget) * cloneSpeed;
    }

    clone.x += clone.vx * dt;
    clone.y += clone.vy * dt;

    // Arena boundary bounce
    const pad = clone.radius + 4;
    if (clone.x < pad) { clone.x = pad; clone.vx = Math.abs(clone.vx); }
    if (clone.x > ARENA_WIDTH - pad) { clone.x = ARENA_WIDTH - pad; clone.vx = -Math.abs(clone.vx); }
    if (clone.y < pad) { clone.y = pad; clone.vy = Math.abs(clone.vy); }
    if (clone.y > ARENA_HEIGHT - pad) { clone.y = ARENA_HEIGHT - pad; clone.vy = -Math.abs(clone.vy); }

    // Ambient clone crystal shimmer trail
    if (Math.random() < 0.35) {
      particles.push({
        x: clone.x + (Math.random() - 0.5) * 8,
        y: clone.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        radius: 2,
        color: '#ffffff',
        alpha: 0.8,
        maxLife: 0.25,
        life: 0.25,
        type: 'baizuan_crystal_spark'
      });
    }

    // Clone Mimic Enemy Passive 1 execution
    clone.mimicSkillCooldown = (clone.mimicSkillCooldown || 0) - dt;
    if (clone.mimicSkillCooldown <= 0) {
      const charId = clone.targetCharId;
      if (charId === 'huotong') {
        clone.mimicSkillCooldown = 1.0;
        // 60% Fire Blast (2.5 magic dmg within 60px)
        if (distToTarget <= 60 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            2.5,
            'magic',
            '鏡像火焰',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
        }
      } else if (charId === 'hailaise') {
        clone.mimicSkillCooldown = 3.5;
        // 60% Magic Missile (2.5 magic dmg)
        const angle = Math.atan2(target.y - clone.y, target.x - clone.x);
        projectiles.push({
          id: `proj_clone_missile_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          x: clone.x,
          y: clone.y,
          vx: Math.cos(angle) * 260,
          vy: Math.sin(angle) * 260,
          radius: 6,
          damage: 2.5,
          color: '#ffffff',
          type: 'magic_missile',
          trail: []
        });
      } else if (charId === 'lingyinsi') {
        clone.mimicSkillCooldown = 4.0;
        // 60% Psionic Arrow (3.5 physical dmg)
        const angle = Math.atan2(target.y - clone.y, target.x - clone.x);
        projectiles.push({
          id: `proj_clone_arrow_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          x: clone.x,
          y: clone.y,
          vx: Math.cos(angle) * 380,
          vy: Math.sin(angle) * 380,
          radius: 5,
          width: 22,
          height: 5,
          damage: 3.5,
          color: '#ffffff',
          type: 'blue_light_arrow',
          isPhysical: true,
          trail: []
        });
      } else if (charId === 'chanshi') {
        clone.mimicSkillCooldown = 7.0;
        // 60% Imprisoning Aura (20% slow for 1.5s within 85px)
        if (distToTarget <= 85 + target.radius) {
          target.isSlowedByChanshi = true;
          target.slowedByChanshiTimer = 1.5;
          applyDamageWithDamageSharing(
            target,
            self,
            2.5,
            'magic',
            '鏡像禁錮',
            target.x,
            target.y,
            matchTime,
            fctList,
            events,
            particles
          );
        }
      } else if (charId === 'huangzuan') {
        clone.mimicSkillCooldown = 4.5;
        // 60% Lightning Strike (3.0 magic dmg + 0.25s paralysis)
        target.isParalyzed = true;
        target.paralysisTimer = 0.25;
        applyDamageWithDamageSharing(
          target,
          self,
          3.0,
          'magic',
          '鏡像閃電',
          target.x,
          target.y,
          matchTime,
          fctList,
          events,
          particles
        );
      } else if (charId === 'lanzuan') {
        clone.mimicSkillCooldown = 0.5;
        // 60% Wavelength (1.0 magic dmg within 70px)
        if (distToTarget <= 70 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            1.0,
            'magic',
            '鏡像波長',
            target.x,
            target.y,
            matchTime,
            fctList,
            events,
            particles
          );
        }
      } else if (charId === 'fenzuan') {
        clone.mimicSkillCooldown = 4.5;
        // 60% Diamond Shield (3.5 physical dmg)
        const angle = Math.atan2(target.y - clone.y, target.x - clone.x);
        projectiles.push({
          id: `proj_clone_shield_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          x: clone.x,
          y: clone.y,
          vx: Math.cos(angle) * 300,
          vy: Math.sin(angle) * 300,
          radius: 11,
          damage: 3.5,
          color: '#ffffff',
          type: 'fenzuan_shield',
          isPhysical: true,
          fenzuanShieldState: 'outward',
          fenzuanTraveledDist: 0,
          fenzuanMaxDist: 140,
          trail: []
        });
      } else if (charId === 'oba') {
        clone.mimicSkillCooldown = 3.0;
        // 鏡像重擊 (6.0 physical dmg within 75px)
        if (distToTarget <= 75 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            6.0,
            'physical',
            '鏡像重擊',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
          soundEngine.playHeavyHit();
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
              x: (clone.x + target.x) / 2,
              y: (clone.y + target.y) / 2,
              vx: Math.cos(a) * 60,
              vy: Math.sin(a) * 60,
              radius: 2,
              color: '#ffffff',
              alpha: 1.0,
              maxLife: 0.25,
              life: 0.25,
              type: 'baizuan_crystal_spark'
            });
          }
        }
      } else if (charId === 'xukongshou') {
        clone.mimicSkillCooldown = 3.5;
        // 鏡像撕咬 (5.0 physical dmg within 75px)
        if (distToTarget <= 75 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            5.0,
            'physical',
            '鏡像撕咬',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
          soundEngine.playVoidBite();
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
              x: (clone.x + target.x) / 2,
              y: (clone.y + target.y) / 2,
              vx: Math.cos(a) * 50,
              vy: Math.sin(a) * 50,
              radius: 2,
              color: '#e2e8f0',
              alpha: 0.9,
              maxLife: 0.25,
              life: 0.25,
              type: 'void_spark'
            });
          }
        }
      } else if (charId === 'fan') {
        clone.mimicSkillCooldown = 2.5;
        // 鏡像獵箭 (4.0 physical dmg straight arrow)
        const angle = Math.atan2(target.y - clone.y, target.x - clone.x);
        projectiles.push({
          id: `proj_clone_arrow_${Math.random()}`,
          ownerId: self.id,
          targetId: target.id,
          x: clone.x,
          y: clone.y,
          vx: Math.cos(angle) * 460,
          vy: Math.sin(angle) * 460,
          radius: 5,
          damage: 4,
          color: '#ffffff',
          type: 'blue_light_arrow',
          isPhysical: true,
          life: 0.8,
          maxLife: 0.8,
          trail: []
        });
        soundEngine.playFanArrowShoot();
      } else if (charId === 'tunshimozu') {
        clone.mimicSkillCooldown = 3.0;
        // 鏡像吞噬魔脈 (4.0 magic dmg within 85px)
        if (distToTarget <= 85 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            4.0,
            'magic',
            '鏡像吞噬',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
          for (let i = 0; i < 6; i++) {
            const a = Math.random() * Math.PI * 2;
            particles.push({
              x: clone.x + Math.cos(a) * 20,
              y: clone.y + Math.sin(a) * 20,
              vx: -Math.cos(a) * 35,
              vy: -Math.sin(a) * 35,
              radius: 2,
              color: '#ffffff',
              alpha: 0.85,
              maxLife: 0.25,
              life: 0.25,
              type: 'baizuan_crystal_spark'
            });
          }
        }
      } else if (charId === 'baizuan') {
        clone.mimicSkillCooldown = 3.0;
        // 鏡像純白晶芒 (4.0 magic dmg within 90px)
        if (distToTarget <= 90 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            4.0,
            'magic',
            '鏡像晶芒',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
          soundEngine.playBaizuanShiningPulse();
        }
      } else {
        // Default: crystal needle burst (3.0 magic dmg)
        clone.mimicSkillCooldown = 3.5;
        if (distToTarget <= 90 + target.radius) {
          applyDamageWithDamageSharing(
            target,
            self,
            3.0,
            'magic',
            '鏡像晶芒',
            (clone.x + target.x) / 2,
            (clone.y + target.y) / 2,
            matchTime,
            fctList,
            events,
            particles
          );
        }
      }
    }

    // Duration expiration
    if (clone.duration <= 0) {
      self.baizuanClone = null;
      self.baizuanCloneCooldown = 16.0;
      soundEngine.playBaizuanCloneShatter();

      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 50 + Math.random() * 120;
        particles.push({
          x: clone.x,
          y: clone.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5,
          color: '#ffffff',
          alpha: 1.0,
          maxLife: 0.4,
          life: 0.4,
          type: 'baizuan_mirror_crack'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '鏡像分身',
        text: `鏡像分身持續時間結束已消散。(進入16s冷卻)`,
        badge: '分身消散'
      });
    }
  } else {
    // Cooldown progression
    if (self.baizuanCloneCooldown > 0) {
      self.baizuanCloneCooldown = Math.max(0, self.baizuanCloneCooldown - dt);
    } else {
      if (!tryConsumeEnergy(self, 35, '鏡像分身', fctList, events)) {
        self.baizuanCloneCooldown = 1.0;
        return;
      }
      // Cooldown complete: Summon Mirror Clone!
      const spawnAngle = Math.atan2(self.y - target.y, self.x - target.x);
      const spawnDist = self.radius + 28;
      const cloneX = Math.max(35, Math.min(ARENA_WIDTH - 35, self.x + Math.cos(spawnAngle) * spawnDist));
      const cloneY = Math.max(35, Math.min(ARENA_HEIGHT - 35, self.y + Math.sin(spawnAngle) * spawnDist));

      self.baizuanClone = {
        id: `clone_baizuan_${Math.random()}`,
        ownerId: self.id,
        targetCharId: target.characterId,
        x: cloneX,
        y: cloneY,
        vx: 0,
        vy: 0,
        radius: 17,
        hp: 3,
        maxHp: 3,
        duration: 15.0,
        createdTime: matchTime,
        mimicSkillCooldown: 1.0
      };

      self.passive1Triggers++;
      soundEngine.playBaizuanCloneSummon();

      // Summon flash particles
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        const spd = 40 + Math.random() * 80;
        particles.push({
          x: cloneX,
          y: cloneY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5,
          color: '#ffffff',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'baizuan_crystal_spark'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '鏡像分身',
        text: `${self.name} 召喚了敵方 ${target.name} 的【鏡像分身】！(持續15s，承受3次攻擊碎裂)`,
        badge: '召喚分身'
      });
    }
  }
}

/**
 * Baizuan Passive 2: Shining (閃耀 - 20s CD, 5s duration)
 * - 停止移動，5s 內對 115px 敵人定身 1.5s 並每秒造成 1 點魔法傷害
 */
function updateBaizuanShiningPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'baizuan' || self.hp <= 0) return;

  if (self.baizuanShiningActive) {
    // Lock position/stop movement during shining
    self.vx = 0;
    self.vy = 0;
    self.baizuanShiningDuration -= dt;

    // Radiant pulsating particles
    if (Math.random() < 0.45) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 130;
      particles.push({
        x: self.x + Math.cos(a) * r,
        y: self.y + Math.sin(a) * r,
        vx: Math.cos(a) * 20,
        vy: Math.sin(a) * 20,
        radius: 2 + Math.random() * 2,
        color: '#ffffff',
        alpha: 0.9,
        maxLife: 0.3,
        life: 0.3,
        type: 'baizuan_crystal_spark'
      });
    }

    // 1.0s periodic damage tick (12.0 magic damage / s)
    self.baizuanShiningTickTimer -= dt;
    if (self.baizuanShiningTickTimer <= 0) {
      self.baizuanShiningTickTimer = 1.0;
      const dist = Math.hypot(target.x - self.x, target.y - self.y);
      if (dist <= 130 + target.radius) {
        applyDamageWithDamageSharing(
          target,
          self,
          12.0,
          'magic',
          '閃耀灼光',
          target.x,
          target.y,
          matchTime,
          fctList,
          events,
          particles
        );
        soundEngine.playBaizuanShiningPulse();
      }
    }

    // End of shining
    if (self.baizuanShiningDuration <= 0) {
      self.baizuanShiningActive = false;
      self.baizuanShiningDuration = 0;
      self.baizuanShiningCooldown = 16.0;
    }
  } else {
    // Cooldown progression
    if (self.baizuanShiningCooldown > 0) {
      self.baizuanShiningCooldown = Math.max(0, self.baizuanShiningCooldown - dt);
    } else {
      if (!tryConsumeEnergy(self, 30, '閃耀', fctList, events)) {
        self.baizuanShiningCooldown = 1.0;
        return;
      }
      // Trigger Shining!
      self.baizuanShiningActive = true;
      self.baizuanShiningDuration = 5.0;
      self.baizuanShiningTickTimer = 1.0;
      self.vx = 0;
      self.vy = 0;
      self.passive2Triggers++;
      soundEngine.playBaizuanShiningStart();

      const dist = Math.hypot(target.x - self.x, target.y - self.y);
      if (dist <= 130 + target.radius) {
        // Check resistance & super armor
        if ((target.shiningResistanceTimer || 0) <= 0) {
          if (target.chanshiSuperArmorTimer > 0) {
            fctList.push({
              id: `fct_armor_immune_${Math.random()}`,
              x: target.x,
              y: target.y - target.radius - 14,
              text: '霸體免控 IMMUNE',
              color: '#fde047',
              fontSize: 12,
              scale: 1.15,
              alpha: 1.0,
              life: 0.8,
              maxLife: 0.8,
              vy: -20,
              damageType: 'status',
              damageValue: 0
            });
            events.push({
              id: `evt_armor_immune_${Math.random()}`,
              timestamp: matchTime,
              type: 'passive_trigger',
              attackerId: target.id,
              targetId: self.id,
              skillName: '霸體免控',
              text: `${target.name} 處於【金鐘罩霸體】狀態，免疫了 ${self.name} 的閃耀定身！`,
              badge: '霸體免控'
            });
          } else {
            target.isBlanchedAndImmobilized = true;
            target.blanchedTimer = 2.0;
            target.vx = 0;
            target.vy = 0;

            fctList.push({
              id: `fct_blanch_${Math.random()}`,
              x: target.x,
              y: target.y - target.radius - 12,
              text: `定身 2.0s`,
              color: '#ffffff',
              fontSize: 12,
              alpha: 1.0,
              life: 0.9,
              maxLife: 0.9,
              vy: -22
            });

            events.push({
              id: `evt_${Math.random()}`,
              timestamp: matchTime,
              type: 'passive_trigger',
              attackerId: self.id,
              targetId: target.id,
              skillName: '閃耀',
              text: `${self.name} 發動【閃耀】！定身敵方 ${target.name} 2.0秒並持續灼燒！`,
              badge: '定身 2.0s'
            });
          }
        }
      } else {
        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '閃耀',
          text: `${self.name} 啟動【閃耀】，在原地綻放純白耀斑！`,
          badge: '閃耀釋放'
        });
      }
    }
  }
}

/**
 * Baizuan Passive 3: White Death Ray (白色死光 - 18s CD, 8s duration, 320px beam)
 * - 320px 直線光束，每秒 3.0 魔法傷害 (1.5 / 0.5s)
 * - 敵方球體撞擊光束時立即受到 4.0 魔法傷害並中斷死光進入 18s 冷卻
 */
function updateBaizuanDeathRayPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'baizuan' || self.hp <= 0) return;

  if (self.baizuanRayActive) {
    self.baizuanRayDuration -= dt;

    // Smoothly track target angle
    const targetAngle = Math.atan2(target.y - self.y, target.x - self.x);
    self.baizuanRayAngle = targetAngle;

    const rayLen = 320;
    const endX = self.x + Math.cos(targetAngle) * rayLen;
    const endY = self.y + Math.sin(targetAngle) * rayLen;

    // Calculate distance from target center to ray line segment
    const l2 = rayLen * rayLen;
    let t = ((target.x - self.x) * (endX - self.x) + (target.y - self.y) * (endY - self.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = self.x + t * (endX - self.x);
    const projY = self.y + t * (endY - self.y);
    const distToBeam = Math.hypot(target.x - projX, target.y - projY);

    // Continuous Beam Shimmer Sparkle Particles
    if (Math.random() < 0.65) {
      const beamPos = Math.random() * rayLen;
      particles.push({
        x: self.x + Math.cos(targetAngle) * beamPos,
        y: self.y + Math.sin(targetAngle) * beamPos,
        vx: (Math.random() - 0.5) * 25,
        vy: (Math.random() - 0.5) * 25,
        radius: 2.2,
        color: '#ffffff',
        alpha: 0.95,
        maxLife: 0.25,
        life: 0.25,
        type: 'baizuan_crystal_spark'
      });
    }

    // 1. Direct Collision Impact Check:
    // "若敵人撞擊光線，立即造成 4.0 點魔法傷害並中斷死光進入冷卻"
    // Trigger condition:
    // - Direct physical ball collision with Baizuan (two champions collide), OR
    // - After 0.6s grace period (to ensure beam is fully visible and not insta-cancelled on cast),
    //   the enemy collides across the beam shaft at significant speed (>180px/s)
    const ballDist = Math.hypot(self.x - target.x, self.y - target.y);
    const directBallCollision = ballDist <= (self.radius + target.radius + 3);
    const hasFiredGracePeriod = self.baizuanRayDuration <= 7.4; // Fired for at least 0.6s
    const enemyImpactSpeed = Math.hypot(target.vx, target.vy);
    const highSpeedBeamCollision = hasFiredGracePeriod && distToBeam <= (target.radius + 4) && t > 0.05 && t <= 0.95 && enemyImpactSpeed >= 180;

    if (directBallCollision || highSpeedBeamCollision) {
      // Collision impact interrupt!
      applyDamageWithDamageSharing(
        target,
        self,
        22.0,
        'magic',
        '死光撞擊',
        projX,
        projY,
        matchTime,
        fctList,
        events,
        particles
      );

      soundEngine.playBaizuanDeathRayImpact();

      // Impact Shockwave & Burst
      particles.push({
        x: projX,
        y: projY,
        vx: 0,
        vy: 0,
        radius: 42,
        color: '#ffffff',
        alpha: 0.95,
        maxLife: 0.35,
        life: 0.35,
        type: 'shockwave'
      });

      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 70 + Math.random() * 140;
        particles.push({
          x: projX,
          y: projY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.8,
          color: '#ffffff',
          alpha: 1.0,
          maxLife: 0.4,
          life: 0.4,
          type: 'baizuan_crystal_spark'
        });
      }

      // Interrupt beam and enter 18s cooldown
      self.baizuanRayActive = false;
      self.baizuanRayDuration = 0;
      self.baizuanRayCooldown = 18.0;

      fctList.push({
        id: `fct_${Math.random()}`,
        x: projX,
        y: projY - 18,
        text: '-22.0 [死光中斷]',
        color: '#ffffff',
        fontSize: 16,
        vy: -28,
        maxLife: 1.1,
        life: 1.1,
        alpha: 1.0,
        damageType: 'magic',
        damageValue: 22.0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '白色死光',
        text: `${target.name} 撞擊【白色死光】承受 22 點魔法傷害！死光中斷進入 18s 冷卻`,
        badge: '死光中斷 (18sCD)'
      });
      return;
    }

    // 2. Continuous Beam Tick Damage:
    // "每秒造成 10.0 點魔法傷害（每 0.5s 判定一次，即每次 5.0 魔傷）"
    const isTargetInBeam = distToBeam <= (target.radius + 18) && t > 0.02 && t <= 1.0;
    if (isTargetInBeam) {
      self.baizuanRayTickTimer -= dt;
      if (self.baizuanRayTickTimer <= 0) {
        self.baizuanRayTickTimer = 0.5;
        applyDamageWithDamageSharing(
          target,
          self,
          5.0,
          'magic',
          '白色死光',
          target.x,
          target.y,
          matchTime,
          fctList,
          events,
          particles
        );

        // Contact Sparkle Cluster
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: target.x + (Math.random() - 0.5) * target.radius,
            y: target.y + (Math.random() - 0.5) * target.radius,
            vx: (Math.random() - 0.5) * 60,
            vy: (Math.random() - 0.5) * 60,
            radius: 2.2,
            color: '#ffffff',
            alpha: 1.0,
            maxLife: 0.28,
            life: 0.28,
            type: 'baizuan_crystal_spark'
          });
        }
      }
    }

    // 3. Natural 8s duration expiration
    if (self.baizuanRayDuration <= 0) {
      self.baizuanRayActive = false;
      self.baizuanRayDuration = 0;
      self.baizuanRayCooldown = 18.0;

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '白色死光',
        text: `${self.name} 的【白色死光】照射完畢，進入 18s 冷卻`,
        badge: '死光冷卻 (18s)'
      });
    }
  } else {
    // Cooldown progression
    if (self.baizuanRayCooldown > 0) {
      self.baizuanRayCooldown = Math.max(0, self.baizuanRayCooldown - dt);
    } else {
      if (!tryConsumeEnergy(self, 40, '白色死光', fctList, events)) {
        self.baizuanRayCooldown = 1.0;
        return;
      }
      // Fire White Death Ray!
      self.baizuanRayActive = true;
      self.baizuanRayDuration = 8.0;
      self.baizuanRayTickTimer = 0.5;
      self.baizuanRayAngle = Math.atan2(target.y - self.y, target.x - self.x);
      self.passive3Triggers++;
      soundEngine.playBaizuanDeathRay();

      fctList.push({
        id: `fct_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 18,
        text: '白色死光 (8s)',
        color: '#ffffff',
        fontSize: 16,
        vy: -25,
        maxLife: 1.2,
        life: 1.2,
        alpha: 1.0,
        damageType: 'status',
        damageValue: 0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '白色死光',
        text: `${self.name} 發射【白色死光】！向目標傾瀉 300px 高能晶體光束！`,
        badge: '白色死光 (8s)'
      });
    }
  }
}

/**
 * Update Baizuan status effect timers (Blanch, Resistance)
 */
function updateBaizuanTimers(ball: BallState, enemy: BallState, dt: number) {
  // Blanch & Immobilize decay
  if (ball.isBlanchedAndImmobilized) {
    ball.vx = 0;
    ball.vy = 0;
    ball.blanchedTimer = (ball.blanchedTimer || 0) - dt;
    if (ball.blanchedTimer <= 0) {
      ball.isBlanchedAndImmobilized = false;
      ball.blanchedTimer = 0;
      ball.shiningResistanceTimer = 3.0; // 3s immunity after blanch ends
    }
  }

  // Shining resistance decay
  if (ball.shiningResistanceTimer && ball.shiningResistanceTimer > 0) {
    ball.shiningResistanceTimer = Math.max(0, ball.shiningResistanceTimer - dt);
  }
}

/**
 * Xukongshou Passive 1: Void Beast Bite (虛空獸 - 10s CD, 3s duration, 25 Energy)
 * - 張開裂口巨嘴咬住敵人 3 秒，期間完全免疫傷害且敵人無法脫離
 * - 3 秒結束後自動放開敵人，受反作用力快速向後位移
 */
function updateXukongshouBitePassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'xukongshou') return;

  // If self is dead, release target immediately
  if (self.hp <= 0) {
    if (self.xukongshouBiteActive) {
      self.xukongshouBiteActive = false;
      self.isInvulnerable = false;
      target.isBittenByVoidBeast = false;
      self.xukongshouBiteDamageTickTimer = 0;
    }
    return;
  }

  // If self is currently bitten by another Void Beast, self cannot bite
  if (self.isBittenByVoidBeast) return;

  if (self.xukongshouBiteActive) {
    // If target has died during bite, cancel bite cleanly
    if (target.hp <= 0) {
      self.xukongshouBiteActive = false;
      self.isInvulnerable = false;
      target.isBittenByVoidBeast = false;
      self.xukongshouBiteDamageTickTimer = 0;
      return;
    }

    self.xukongshouBiteDuration -= dt;
    self.isInvulnerable = true;
    target.isBittenByVoidBeast = true;

    // Grace period on lastBallHitTime to completely prevent collision damage during bite
    self.lastBallHitTime = matchTime + 0.6;
    target.lastBallHitTime = matchTime + 0.6;

    // Clamp enemy tightly in front of Void Beast's mouth within arena boundaries
    const biteAngle = self.xukongshouBiteAngle ?? Math.atan2(target.y - self.y, target.x - self.x);
    const clampDist = self.radius + target.radius * 0.35;
    target.x = Math.max(target.radius, Math.min(ARENA_WIDTH - target.radius, self.x + Math.cos(biteAngle) * clampDist));
    target.y = Math.max(target.radius, Math.min(ARENA_HEIGHT - target.radius, self.y + Math.sin(biteAngle) * clampDist));
    target.vx = 0;
    target.vy = 0;

    // Periodic Bite Damage (每 0.5 秒撕咬傷害 6 點，3 秒共 6 次傷害，完全不觸發碰撞傷害)
    self.xukongshouBiteDamageTickTimer = (self.xukongshouBiteDamageTickTimer || 0) + dt;
    if (self.xukongshouBiteDamageTickTimer >= 0.5) {
      self.xukongshouBiteDamageTickTimer -= 0.5;
      const biteDmg = 6;
      const actualDmg = applyDamageWithDamageSharing(
        target,
        self,
        biteDmg,
        'physical',
        '虛空撕咬',
        target.x,
        target.y,
        matchTime,
        fctList,
        events,
        particles
      );

      if (actualDmg > 0) {
        self.hitsDealt = (self.hitsDealt || 0) + 1;
        target.hitsReceived = (target.hitsReceived || 0) + 1;

        soundEngine.playVoidBite();

        // Visceral bite spark particles at mouth contact point
        const contactX = self.x + Math.cos(biteAngle) * (self.radius * 0.85);
        const contactY = self.y + Math.sin(biteAngle) * (self.radius * 0.85);
        for (let i = 0; i < 6; i++) {
          const pAng = biteAngle + (Math.random() - 0.5) * 1.8;
          const spd = 40 + Math.random() * 60;
          particles.push({
            x: contactX,
            y: contactY,
            vx: Math.cos(pAng) * spd,
            vy: Math.sin(pAng) * spd,
            radius: 2.2 + Math.random() * 1.5,
            color: i % 2 === 0 ? '#c084fc' : '#f3e8ff',
            alpha: 0.95,
            maxLife: 0.28,
            life: 0.28,
            type: 'void_spark'
          });
        }

        events.push({
          id: `evt_bite_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: target.id,
          skillName: '虛空撕咬',
          damage: actualDmg,
          text: `${self.name} 裂口巨嘴撕咬深入 ${target.name}，造成 ${actualDmg} 點撕咬傷害！(無碰撞傷)`,
          badge: '撕咬傷害'
        });
      }
    }

    // Void suction particles flowing into the maw
    if (Math.random() < 0.45) {
      const pAngle = biteAngle + (Math.random() - 0.5) * 0.9;
      const pDist = clampDist + Math.random() * 24;
      particles.push({
        x: self.x + Math.cos(pAngle) * pDist,
        y: self.y + Math.sin(pAngle) * pDist,
        vx: -Math.cos(pAngle) * 70,
        vy: -Math.sin(pAngle) * 70,
        radius: 2.2,
        color: '#a855f7',
        alpha: 0.85,
        maxLife: 0.25,
        life: 0.25,
        type: 'void_spark'
      });
    }

    // 3 seconds ended: Auto release & recoil backwards
    if (self.xukongshouBiteDuration <= 0) {
      self.xukongshouBiteActive = false;
      self.isInvulnerable = false;
      target.isBittenByVoidBeast = false;
      self.xukongshouBiteDamageTickTimer = 0;

      // Recoil: Rapid backward displacement without changing collision radius
      const recoilAngle = biteAngle + Math.PI;
      self.vx = Math.cos(recoilAngle) * 600;
      self.vy = Math.sin(recoilAngle) * 600;
      self.xukongshouBiteRecoilTimer = 0.4;
      self.xukongshouBiteCooldown = 10.0;

      // Push target forward cleanly away to prevent immediate overlap collision
      target.x = Math.max(target.radius, Math.min(ARENA_WIDTH - target.radius, self.x + Math.cos(biteAngle) * (self.radius + target.radius + 14)));
      target.y = Math.max(target.radius, Math.min(ARENA_HEIGHT - target.radius, self.y + Math.sin(biteAngle) * (self.radius + target.radius + 14)));
      target.vx = Math.cos(biteAngle) * 60;
      target.vy = Math.sin(biteAngle) * 60;

      // Grace period prevents mutual collision damage upon disengagement
      self.lastBallHitTime = matchTime + 0.6;
      target.lastBallHitTime = matchTime + 0.6;

      soundEngine.playVoidBurst();

      // Void burst explosion upon release
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * 120,
          vy: Math.sin(a) * 120,
          radius: 3,
          color: '#c084fc',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'void_burst'
        });
      }

      fctList.push({
        id: `fct_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 18,
        text: '鬆口釋放・虛空後撤',
        color: '#c084fc',
        fontSize: 14,
        vy: -24,
        maxLife: 1.0,
        life: 1.0,
        alpha: 1.0,
        damageType: 'status',
        damageValue: 0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '虛空獸',
        text: `${self.name} 鬆開 ${target.name} 並引發虛空爆裂，受反作用力快速後撤！進入 10s 冷卻`,
        badge: '鬆口後撤 (10sCD)'
      });
    }
  } else {
    // Tick recoil timer down
    if (self.xukongshouBiteRecoilTimer && self.xukongshouBiteRecoilTimer > 0) {
      self.xukongshouBiteRecoilTimer -= dt;
    }

    // Cooldown progression
    if (self.xukongshouBiteCooldown > 0) {
      self.xukongshouBiteCooldown = Math.max(0, self.xukongshouBiteCooldown - dt);
    } else {
      // Trigger when close to enemy (dist <= self.radius + target.radius + 36)
      const dist = Math.hypot(target.x - self.x, target.y - self.y);
      if (dist <= self.radius + target.radius + 36 && target.hp > 0) {
        if (!tryConsumeEnergy(self, 25, '虛空獸', fctList, events)) {
          self.xukongshouBiteCooldown = 1.0;
          return;
        }
        // Activate Bite!
        self.xukongshouBiteActive = true;
        self.xukongshouBiteDuration = 3.0;
        self.xukongshouBiteDamageTickTimer = 0;
        self.isInvulnerable = true;
        target.isBittenByVoidBeast = true;
        self.xukongshouBiteAngle = Math.atan2(target.y - self.y, target.x - self.x);
        self.passive1Triggers++;

        // Prevent collision damage immediately upon latching
        self.lastBallHitTime = matchTime + 3.5;
        target.lastBallHitTime = matchTime + 3.5;

        // Clamp immediately
        const clampDist = self.radius + target.radius * 0.35;
        target.x = Math.max(target.radius, Math.min(ARENA_WIDTH - target.radius, self.x + Math.cos(self.xukongshouBiteAngle) * clampDist));
        target.y = Math.max(target.radius, Math.min(ARENA_HEIGHT - target.radius, self.y + Math.sin(self.xukongshouBiteAngle) * clampDist));
        target.vx = 0;
        target.vy = 0;

        soundEngine.playVoidBite();

        fctList.push({
          id: `fct_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 18,
          text: '虛空撕咬 (3.0s撕咬傷)',
          color: '#a855f7',
          fontSize: 14,
          vy: -22,
          maxLife: 1.1,
          life: 1.1,
          alpha: 1.0,
          damageType: 'status',
          damageValue: 0
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: target.id,
          skillName: '虛空獸',
          text: `${self.name} 消耗 25 能量張開裂口咬住 ${target.name}！3 秒內只造成撕咬傷害且完全免疫傷害！`,
          badge: '撕咬3s (無敵)'
        });
      }
    }
  }
}

/**
 * Xukongshou Passive 2: Void Rift (虛空裂縫 - 20s CD, 25 Energy)
 * - 撕開空間開啟裂縫入口與另一側出口，快速鑽入入口並瞬間折疊傳送至出口
 * - 敵人踩到裂縫將被虛空困住 2 秒無法移動，隨後裂縫消散
 */
function updateXukongshouRiftPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'xukongshou' || self.hp <= 0) return;

  if (self.xukongshouRift) {
    const rift = self.xukongshouRift;
    rift.duration -= dt;

    // Swirling rift particles at entrance and exit
    if (Math.random() < 0.35) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: rift.entranceX + Math.cos(a) * 16,
        y: rift.entranceY + Math.sin(a) * 16,
        vx: -Math.sin(a) * 40,
        vy: Math.cos(a) * 40,
        radius: 2,
        color: '#7e22ce',
        alpha: 0.8,
        maxLife: 0.28,
        life: 0.28,
        type: 'void_rift_swirl'
      });
      particles.push({
        x: rift.exitX + Math.cos(a) * 16,
        y: rift.exitY + Math.sin(a) * 16,
        vx: -Math.sin(a) * 40,
        vy: Math.cos(a) * 40,
        radius: 2,
        color: '#a855f7',
        alpha: 0.8,
        maxLife: 0.28,
        life: 0.28,
        type: 'void_rift_swirl'
      });
    }

    // Check if self has teleported yet
    if (!rift.hasTeleported) {
      const distToEnt = Math.hypot(self.x - rift.entranceX, self.y - rift.entranceY);
      if (distToEnt <= self.radius + rift.radius) {
        // Instant teleport to exit!
        self.x = rift.exitX;
        self.y = rift.exitY;
        rift.hasTeleported = true;
        soundEngine.playVoidRiftTeleport();

        // Teleport burst flash
        for (let i = 0; i < 14; i++) {
          const a = (i * Math.PI * 2) / 14;
          particles.push({
            x: rift.exitX,
            y: rift.exitY,
            vx: Math.cos(a) * 80,
            vy: Math.sin(a) * 80,
            radius: 2.5,
            color: '#c084fc',
            alpha: 1.0,
            maxLife: 0.3,
            life: 0.3,
            type: 'void_burst'
          });
        }

        fctList.push({
          id: `fct_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 18,
          text: '虛空折疊傳送',
          color: '#c084fc',
          fontSize: 14,
          vy: -22,
          maxLife: 1.0,
          life: 1.0,
          alpha: 1.0,
          damageType: 'status',
          damageValue: 0
        });

        events.push({
          id: `evt_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '虛空裂縫',
          text: `${self.name} 鑽入【虛空裂縫】折疊空間瞬間傳送至出口！`,
          badge: '裂縫傳送'
        });
      }
    }

    // Check if target touches entrance or exit
    if (!rift.trappedEnemy) {
      const distTargetEnt = Math.hypot(target.x - rift.entranceX, target.y - rift.entranceY);
      const distTargetExit = Math.hypot(target.x - rift.exitX, target.y - rift.exitY);

      if (distTargetEnt <= target.radius + rift.radius || distTargetExit <= target.radius + rift.radius) {
        if (target.chanshiSuperArmorTimer > 0) {
          fctList.push({
            id: `fct_immune_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 18,
            text: '霸體免控 IMMUNE',
            color: '#fde047',
            fontSize: 13,
            alpha: 1.0,
            vy: -22,
            maxLife: 0.9,
            life: 0.9,
            damageType: 'status',
            damageValue: 0
          });
          events.push({
            id: `evt_armor_immune_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: target.id,
            targetId: self.id,
            skillName: '霸體免控',
            text: `${target.name} 處於【金鐘罩霸體】狀態，免疫了虛空裂縫的禁錮困住！`,
            badge: '霸體免控'
          });
        } else {
          // Trap enemy for 2 seconds!
          target.isTrappedInVoid = true;
          target.trappedInVoidTimer = 2.0;
          target.vx = 0;
          target.vy = 0;
          rift.trappedEnemy = true;
          rift.trappedTimer = 2.0;

          soundEngine.playVoidBurst();

          fctList.push({
            id: `fct_${Math.random()}`,
            x: target.x,
            y: target.y - target.radius - 18,
            text: '虛空困住 (2.0s)',
            color: '#a855f7',
            fontSize: 14,
            vy: -22,
            maxLife: 1.1,
            life: 1.1,
            alpha: 1.0,
            damageType: 'status',
            damageValue: 0
          });

          events.push({
            id: `evt_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            targetId: target.id,
            skillName: '虛空裂縫',
            text: `${target.name} 踩入【虛空裂縫】被虛空深淵困住 2 秒無法移動！`,
            badge: '虛空困住 2s'
          });
        }
      }
    }

    // Trapped enemy countdown
    if (rift.trappedEnemy) {
      rift.trappedTimer -= dt;
      target.vx = 0;
      target.vy = 0;
      if (rift.trappedTimer <= 0) {
        target.isTrappedInVoid = false;
        self.xukongshouRift = null; // Rift dissipates after trap completes
      }
    } else if (rift.duration <= 0) {
      self.xukongshouRift = null;
    }
  } else {
    // Cooldown progression
    if (self.xukongshouRiftCooldown > 0) {
      self.xukongshouRiftCooldown = Math.max(0, self.xukongshouRiftCooldown - dt);
    } else {
      if (!tryConsumeEnergy(self, 25, '虛空裂縫', fctList, events)) {
        self.xukongshouRiftCooldown = 1.0;
        return;
      }
      // Create entrance in front of self, exit strategically behind or across from enemy
      const aimAngle = (Math.abs(self.vx) + Math.abs(self.vy) > 30)
        ? Math.atan2(self.vy, self.vx)
        : Math.atan2(target.y - self.y, target.x - self.x);
      const entX = Math.max(45, Math.min(ARENA_WIDTH - 45, self.x + Math.cos(aimAngle) * 50));
      const entY = Math.max(45, Math.min(ARENA_HEIGHT - 45, self.y + Math.sin(aimAngle) * 50));

      const exitAngle = Math.atan2(target.y - self.y, target.x - self.x);
      const exitX = Math.max(50, Math.min(ARENA_WIDTH - 50, target.x + Math.cos(exitAngle) * 100));
      const exitY = Math.max(50, Math.min(ARENA_HEIGHT - 50, target.y + Math.sin(exitAngle) * 100));

      self.xukongshouRift = {
        id: `rift_${Math.random()}`,
        ownerId: self.id,
        entranceX: entX,
        entranceY: entY,
        exitX: exitX,
        exitY: exitY,
        radius: 28,
        duration: 8.0,
        hasTeleported: false,
        trappedEnemy: false,
        trappedTimer: 0,
        createdTime: matchTime
      };

      self.xukongshouRiftCooldown = 20.0;
      self.passive2Triggers++;
      soundEngine.playVoidBurst();

      fctList.push({
        id: `fct_${Math.random()}`,
        x: entX,
        y: entY - 18,
        text: '虛空裂縫撕開',
        color: '#c084fc',
        fontSize: 13,
        vy: -20,
        maxLife: 1.0,
        life: 1.0,
        alpha: 1.0,
        damageType: 'status',
        damageValue: 0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '虛空裂縫',
        text: `${self.name} 撕裂空間開啟【虛空裂縫】！入口與出口折疊，踩入者將被困 2 秒！進入 20s 冷卻`,
        badge: '裂縫傳送 (20sCD)'
      });
    }
  }
}

/**
 * Xukongshou Passive 3: Void Hunt (虛空獵擊 - 25s CD, 35 Energy)
 * - 消耗 35 能量在敵人身上附加黑紫色虛空標記鎖定 3 秒
 * - 鎖定完成後化身半透明幻影以極速穿刺衝向敵人，命中造成 20 點物理傷害並留下殘影
 */
function updateXukongshouHuntPassive(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'xukongshou' || self.hp <= 0) return;

  if (self.xukongshouHuntLockTimer > 0) {
    self.xukongshouHuntLockTimer -= dt;
    target.isLockedByVoidHunt = true;
    target.lockedByVoidHuntTimer = self.xukongshouHuntLockTimer;

    // Void targeting pulses around target
    if (Math.random() < 0.35) {
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x: target.x + Math.cos(a) * (target.radius + 12),
        y: target.y + Math.sin(a) * (target.radius + 12),
        vx: -Math.cos(a) * 35,
        vy: -Math.sin(a) * 35,
        radius: 2.2,
        color: '#a855f7',
        alpha: 0.9,
        maxLife: 0.25,
        life: 0.25,
        type: 'void_mark_sigil'
      });
    }

    // 3 seconds locking finished: Unleash phantom dash!
    if (self.xukongshouHuntLockTimer <= 0) {
      self.xukongshouHuntActive = true;
      self.isPhantomDash = true;

      const huntAngle = Math.atan2(target.y - self.y, target.x - self.x);
      self.vx = Math.cos(huntAngle) * 820;
      self.vy = Math.sin(huntAngle) * 820;
      soundEngine.playVoidHuntStrike();

      fctList.push({
        id: `fct_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 18,
        text: '虛空獵擊・幻影突進',
        color: '#c084fc',
        fontSize: 15,
        vy: -24,
        maxLife: 1.0,
        life: 1.0,
        alpha: 1.0,
        damageType: 'status',
        damageValue: 0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '虛空獵擊',
        text: `${self.name} 鎖定完畢！化身半透明幻影以極速突襲 ${target.name}！`,
        badge: '幻影突襲'
      });
    }
  } else if (self.xukongshouHuntActive) {
    // Spawning dark purple phantom afterimages
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: self.radius,
      color: '#2e1065',
      alpha: 0.55,
      maxLife: 0.25,
      life: 0.25,
      type: 'void_phantom_shadow'
    });

    // Check collision with target
    const dist = Math.hypot(target.x - self.x, target.y - self.y);
    if (dist <= self.radius + target.radius + 15) {
      // 20 damage!
      applyDamageWithDamageSharing(
        target,
        self,
        20,
        'physical',
        '虛空獵擊',
        target.x,
        target.y,
        matchTime,
        fctList,
        events,
        particles
      );

      soundEngine.playVoidBurst();
      self.xukongshouHuntActive = false;
      self.isPhantomDash = false;
      target.isLockedByVoidHunt = false;
      self.xukongshouHuntCooldown = 25.0;
      self.passive3Triggers++;

      // Heavy void impact burst
      for (let i = 0; i < 18; i++) {
        const a = (i * Math.PI * 2) / 18;
        particles.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(a) * 95,
          vy: Math.sin(a) * 95,
          radius: 3,
          color: '#c084fc',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'void_burst'
        });
      }

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '虛空獵擊',
        text: `${self.name} 的【虛空獵擊】命中！造成 20 點物理傷害並留下殘影！進入 25s 冷卻`,
        badge: '獵擊命中 (20傷)'
      });
    } else {
      const speed = Math.hypot(self.vx, self.vy);
      if (speed < 180) {
        self.xukongshouHuntActive = false;
        self.isPhantomDash = false;
        target.isLockedByVoidHunt = false;
        self.xukongshouHuntCooldown = 25.0;
      }
    }
  } else {
    // Cooldown progression
    if (self.xukongshouHuntCooldown > 0) {
      self.xukongshouHuntCooldown = Math.max(0, self.xukongshouHuntCooldown - dt);
    } else {
      if (!tryConsumeEnergy(self, 35, '虛空獵擊', fctList, events)) {
        self.xukongshouHuntCooldown = 1.0;
        return;
      }
      // Start 3-second lock-on!
      self.xukongshouHuntLockTimer = 3.0;
      target.isLockedByVoidHunt = true;
      target.lockedByVoidHuntTimer = 3.0;
      soundEngine.playVoidHuntLock();

      fctList.push({
        id: `fct_${Math.random()}`,
        x: target.x,
        y: target.y - target.radius - 18,
        text: '虛空鎖定 (3.0s)',
        color: '#a855f7',
        fontSize: 14,
        vy: -22,
        maxLife: 1.1,
        life: 1.1,
        alpha: 1.0,
        damageType: 'status',
        damageValue: 0
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '虛空獵擊',
        text: `${self.name} 消耗 35 能量在 ${target.name} 身上附加黑紫色標記鎖定 3 秒！`,
        badge: '虛空鎖定 3s'
      });
    }
  }
}

/**
 * Update Xukongshou status timers (trapped in void, locked target)
 */
function updateXukongshouTimers(ball: BallState, dt: number) {
  // Trapped in void immobilization
  if (ball.isTrappedInVoid) {
    ball.vx = 0;
    ball.vy = 0;
    ball.trappedInVoidTimer = (ball.trappedInVoidTimer || 0) - dt;
    if (ball.trappedInVoidTimer <= 0) {
      ball.isTrappedInVoid = false;
      ball.trappedInVoidTimer = 0;
    }
  }

  // Void lock countdown
  if (ball.isLockedByVoidHunt && (ball.lockedByVoidHuntTimer || 0) > 0) {
    ball.lockedByVoidHuntTimer = Math.max(0, (ball.lockedByVoidHuntTimer || 0) - dt);
    if (ball.lockedByVoidHuntTimer <= 0) {
      ball.isLockedByVoidHunt = false;
    }
  }
}

/**
 * Check and update Fan (凡) Passive Skills:
 * - Passive 1: 獵手本性 (Hunter's Instinct) - 1.5s attack check, 300/318px range, 5 phys damage, 3 white marks -> 15 true damage.
 * - Passive 2: 翻滾預知 (Roll Foresight) - 100px dodge roll away from enemy, leaves silver-white afterimages, +6% range boost permanently, 5s CD after roll.
 * - Passive 3: 超速強化 (Overclock Boost) - 10s duration, +30% speed, every second reduces Roll Foresight remaining CD by 0.5s, 20s CD after duration.
 */
function updateFanPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'fan' || self.hp <= 0) return;

  // ----------------------------------------------------
  // PASSIVE 3: 超速強化 (Overclock Boost)
  // ----------------------------------------------------
  if (self.fanOverclockActive) {
    self.fanOverclockDuration = Math.max(0, (self.fanOverclockDuration || 0) - dt);

    // Dynamic particles for Overclock
    if (Math.random() < 0.35) {
      particles.push({
        x: self.x + (Math.random() - 0.5) * self.radius * 1.6,
        y: self.y + (Math.random() - 0.5) * self.radius * 1.6,
        vx: -self.vx * 0.2 + (Math.random() - 0.5) * 35,
        vy: -self.vy * 0.2 + (Math.random() - 0.5) * 35,
        radius: 2 + Math.random() * 2.2,
        color: Math.random() > 0.45 ? '#facc15' : '#f8fafc',
        alpha: 0.85,
        maxLife: 0.3,
        life: 0.3,
        type: 'fan_overclock_spark'
      });
    }

    // Cooldown reduction tick: every 1.0s, reduces roll foresight remaining cooldown by 1.2s
    self.fanOverclockTickTimer = (self.fanOverclockTickTimer || 1.0) - dt;
    if (self.fanOverclockTickTimer <= 0) {
      self.fanOverclockTickTimer += 1.0;
      if (self.fanRollCooldown > 0) {
        self.fanRollCooldown = Math.max(0, self.fanRollCooldown - 1.2);
      }
    }

    // Overclock duration ended
    if (self.fanOverclockDuration <= 0) {
      self.fanOverclockActive = false;
      self.fanOverclockCooldown = 11.0; // 11s CD
      events.push({
        id: `evt_oc_end_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '超速強化',
        text: `${self.name} 的【超速強化】狀態結束，速度恢復正常，進入 11 秒冷卻。`,
        badge: '超速結束'
      });
    }
  } else {
    // Cooldown ticking
    if (self.fanOverclockCooldown > 0) {
      self.fanOverclockCooldown = Math.max(0, self.fanOverclockCooldown - dt);
    } else if (matchTime > 1.0 && target.hp > 0) {
      // Auto-trigger Overclock Boost
      self.fanOverclockActive = true;
      self.fanOverclockDuration = 10.0;
      self.fanOverclockTickTimer = 1.0;
      self.passive3Triggers++;
      soundEngine.playFanOverclock();

      fctList.push({
        id: `fct_oc_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 14,
        text: '超速強化! 速度+55%',
        color: '#facc15',
        fontSize: 13,
        scale: 1.25,
        shakeIntensity: 6,
        alpha: 1.0,
        life: 0.85,
        maxLife: 0.85,
        vy: -22
      });

      events.push({
        id: `evt_oc_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '超速強化',
        text: `${self.name} 啟動【超速強化】！速度提升至 155%，期間每秒減少翻滾預知冷卻 1.2 秒 (持續 10 秒)！`,
        badge: '超速強化 (+55%速)'
      });
    }
  }

  // ----------------------------------------------------
  // PASSIVE 2: 翻滾預知 (Roll Foresight)
  // ----------------------------------------------------
  if (self.fanIsRolling) {
    self.fanRollDuration = (self.fanRollDuration || 0) - dt;
    self.vx = self.fanRollVx || 0;
    self.vy = self.fanRollVy || 0;

    // Emit silver-white afterimage particles
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: self.radius,
      color: '#e2e8f0',
      alpha: 0.5,
      maxLife: 0.22,
      life: 0.22,
      type: 'fan_roll_afterimage'
    });

    if (self.fanRollDuration <= 0) {
      self.fanIsRolling = false;
      self.fanHasRangeBoost = true; // Permanent +10% range boost (330px)
      self.fanRollCooldown = 2.8;  // v2.6: 2.8s CD starts AFTER roll completes (+0.4s CD)
      self.passive2Triggers++;

      fctList.push({
        id: `fct_roll_fin_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 10,
        text: '射程+10% (330px)',
        color: '#fef08a',
        fontSize: 11,
        alpha: 1.0,
        life: 0.75,
        maxLife: 0.75,
        vy: -18
      });
    }
  } else {
    // Cooldown progression
    if (self.fanRollCooldown > 0) {
      self.fanRollCooldown = Math.max(0, self.fanRollCooldown - dt);
    } else if (target.hp > 0) {
      // Check enemy distance to dodge / roll: if enemy is within 145px or closing in
      const edx = target.x - self.x;
      const edy = target.y - self.y;
      const enemyDist = Math.hypot(edx, edy);

      if (enemyDist < 145 && enemyDist > 0.1) {
        // Roll 100px away from enemy
        let rollAngle = Math.atan2(-edy, -edx);

        // Wall deflection: if rolling directly into wall, angle sideways
        const testX = self.x + Math.cos(rollAngle) * 100;
        const testY = self.y + Math.sin(rollAngle) * 100;
        if (testX < 30 || testX > ARENA_WIDTH - 30 || testY < 30 || testY > ARENA_HEIGHT - 30) {
          // Adjust towards arena center
          const toCenterX = ARENA_WIDTH / 2 - self.x;
          const toCenterY = ARENA_HEIGHT / 2 - self.y;
          const centerAngle = Math.atan2(toCenterY, toCenterX);
          rollAngle = (rollAngle + centerAngle) / 2;
        }

        const rollDuration = 0.22; // 0.22s snappy roll
        const rollSpeed = 100 / rollDuration; // ~454.5 px/s

        self.fanIsRolling = true;
        self.fanRollDuration = rollDuration;
        self.fanRollVx = Math.cos(rollAngle) * rollSpeed;
        self.fanRollVy = Math.sin(rollAngle) * rollSpeed;
        self.vx = self.fanRollVx;
        self.vy = self.fanRollVy;

        soundEngine.playFanRoll();

        fctList.push({
          id: `fct_roll_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 12,
          text: '翻滾預知',
          color: '#e2e8f0',
          fontSize: 12,
          scale: 1.15,
          alpha: 1.0,
          life: 0.65,
          maxLife: 0.65,
          vy: -20
        });

        events.push({
          id: `evt_roll_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: target.id,
          skillName: '翻滾預知',
          text: `${self.name} 感知到敵方逼近，發動【翻滾預知】位移 100px 拉開距離！`,
          badge: '翻滾位移 100px'
        });
      }
    }
  }

  // ----------------------------------------------------
  // PASSIVE 1: 獵手本性 (Hunter's Instinct)
  // ----------------------------------------------------
  // Attack check interval: 1.2s (v2.6: 冷卻適度增加至 1.2s，提高單次技能傷害)
  self.fanAttackCheckTimer = (self.fanAttackCheckTimer || 1.2) - dt;
  if (self.fanAttackCheckTimer <= 0) {
    self.fanAttackCheckTimer += 1.2; // Always reset next check 1.2s later!

    // Max attack range: base 300px, 330px if range boosted by roll
    const maxRange = self.fanHasRangeBoost ? 330 : 300;

    // Collect valid candidate enemies within attack range
    interface TargetCandidate {
      targetObj: BallState | LingyinsiClone | LanzuanBlueOrb | BaizuanMirrorClone;
      x: number;
      y: number;
      dist: number;
      marks: number;
      angleDiff: number;
      idVal: number;
      isMainBall: boolean;
    }

    const candidates: TargetCandidate[] = [];

    // Check main enemy ball
    if (target.hp > 0) {
      const dx = target.x - self.x;
      const dy = target.y - self.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= maxRange) {
        const toTargetAngle = Math.atan2(dy, dx);
        const selfFacingAngle = Math.atan2(self.vy, self.vx);
        let angleDiff = Math.abs(toTargetAngle - selfFacingAngle);
        while (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

        candidates.push({
          targetObj: target,
          x: target.x,
          y: target.y,
          dist,
          marks: target.fanHunterMarks || 0,
          angleDiff,
          idVal: target.id === 'p1' ? 1 : 2,
          isMainBall: true
        });
      }
    }

    // Also check clones if enemy has them
    if (target.clones && target.clones.length > 0) {
      for (const clone of target.clones) {
        if (clone.hp <= 0) continue;
        const dx = clone.x - self.x;
        const dy = clone.y - self.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= maxRange) {
          const toTargetAngle = Math.atan2(dy, dx);
          const selfFacingAngle = Math.atan2(self.vy, self.vx);
          let angleDiff = Math.abs(toTargetAngle - selfFacingAngle);
          while (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

          candidates.push({
            targetObj: clone,
            x: clone.x,
            y: clone.y,
            dist,
            marks: 0,
            angleDiff,
            idVal: 10,
            isMainBall: false
          });
        }
      }
    }

    // Prioritize candidates:
    // 1. Closest distance
    // 2. Highest marks
    // 3. Smallest angle difference to Fan's facing
    // 4. Smaller ID
    if (candidates.length > 0) {
      candidates.sort((a, b) => {
        if (Math.abs(a.dist - b.dist) > 2) {
          return a.dist - b.dist;
        }
        if (a.marks !== b.marks) {
          return b.marks - a.marks;
        }
        if (Math.abs(a.angleDiff - b.angleDiff) > 0.05) {
          return a.angleDiff - b.angleDiff;
        }
        return a.idVal - b.idVal;
      });

      const chosen = candidates[0];

      // Shoot ONE straight arrow towards chosen target's location at this instant
      const arrowSpeed = 650; // v2.6: 彈道速度大幅提升至 650px/s (原 520)，極大改善遠程手感
      const aimDx = chosen.x - self.x;
      const aimDy = chosen.y - self.y;
      const aimDist = Math.hypot(aimDx, aimDy);
      const aimAngle = aimDist > 0.01 ? Math.atan2(aimDy, aimDx) : 0;

      const arrowVx = Math.cos(aimAngle) * arrowSpeed;
      const arrowVy = Math.sin(aimAngle) * arrowSpeed;
      const flightDuration = maxRange / arrowSpeed;

      projectiles.push({
        id: `arrow_${Math.random()}`,
        ownerId: self.id,
        targetId: target.id,
        type: 'fan_hunter_arrow',
        x: self.x,
        y: self.y,
        vx: arrowVx,
        vy: arrowVy,
        radius: 6,
        damage: 18, // v2.6: 18 physical damage (大幅提升單發傷害)
        isPhysical: true,
        life: flightDuration,
        maxLife: flightDuration,
        color: '#facc15',
        trail: []
      });

      self.passive1Triggers++;
      soundEngine.playFanArrowShoot();

      // Muzzle release particles
      for (let i = 0; i < 6; i++) {
        const pAngle = aimAngle + (Math.random() - 0.5) * 0.7;
        const pSpeed = 60 + Math.random() * 80;
        particles.push({
          x: self.x + Math.cos(aimAngle) * (self.radius + 4),
          y: self.y + Math.sin(aimAngle) * (self.radius + 4),
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          radius: 1.8,
          color: Math.random() > 0.4 ? '#facc15' : '#f8fafc',
          alpha: 1.0,
          maxLife: 0.2,
          life: 0.2,
          type: 'fan_arrow_spark'
        });
      }
    }
  }
}

/**
 * Update Tunshimozu (吞噬魔族) Passive Skills and Battlefield Energy Shards:
 * - 能量碎片生成:
 *   - 戰場同時最多存在：8個
 *   - 每個碎片生成間隔：3秒
 *   - 碎片存在時間：15秒
 *   - 生成位置：隨機分布於戰場，不生成在球體碰撞體內
 *   - 碎片不造成傷害，只有吞噬魔族可以吸收
 * - 被動技能1：吞噬
 *   - 接觸能量碎片立即吸收
 *   - 獲得碎片屬性：+1成長值, +0.4 Size, +0.025 Mass, +3 HP上限(並回血+3), +0.2 碰撞傷害, -0.8% 移動速度
 *   - 產生黑紫色能量向球體核心收縮的吸收特效
 *   - 最大 50 個碎片
 * - 被動技能2：魔軀成長
 *   - 成長值每累積 10 層，額外獲得：+15 HP上限(並回血+15), +2% 碰撞抗性, +1 碰撞傷害, -2% 速度
 *   - 50層完全成長時：Size 38, Mass 2.20, HP上限 785 (基底710 + 魔軀成長75), 碰撞傷害 20 (基底15 + 魔軀成長5), 速度 50% (基底60% - 魔軀成長10%), 碰撞抗性 10%
 * - 被動技能3：暴食魔爆
 *   - 冷卻時間倒數 (6s CD)
 *   - 動畫計時器倒數
 */
function updateTunshimozuPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // Decay cooldowns and animation timers
  if (self.gluttonyBurstCooldown && self.gluttonyBurstCooldown > 0) {
    self.gluttonyBurstCooldown = Math.max(0, self.gluttonyBurstCooldown - dt);
  }
  if (self.gluttonyBurstAnimTimer && self.gluttonyBurstAnimTimer > 0) {
    self.gluttonyBurstAnimTimer = Math.max(0, self.gluttonyBurstAnimTimer - dt);
  }
  if (self.devourImplosionAnimTimer && self.devourImplosionAnimTimer > 0) {
    self.devourImplosionAnimTimer = Math.max(0, self.devourImplosionAnimTimer - dt);
  }

  // Only run shard lifecycle if self is Tunshimozu
  if (self.characterId !== 'tunshimozu') return;

  // Decrement Tunshimozu anim and cooldown timers
  if (self.devourImplosionAnimTimer && self.devourImplosionAnimTimer > 0) {
    self.devourImplosionAnimTimer = Math.max(0, self.devourImplosionAnimTimer - dt);
  }
  if (self.gluttonyBurstAnimTimer && self.gluttonyBurstAnimTimer > 0) {
    self.gluttonyBurstAnimTimer = Math.max(0, self.gluttonyBurstAnimTimer - dt);
  }
  if (self.gluttonyBurstCooldown && self.gluttonyBurstCooldown > 0) {
    self.gluttonyBurstCooldown = Math.max(0, self.gluttonyBurstCooldown - dt);
  }

  // Initialize shards array if undefined
  if (!self.energyShards) {
    self.energyShards = [];
  }

  // 1. Update existing shards lifetime & decay
  for (let i = self.energyShards.length - 1; i >= 0; i--) {
    const shard = self.energyShards[i];
    shard.life -= dt;
    if (shard.life <= 0) {
      // Shard expired dissolution effect
      for (let p = 0; p < 6; p++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: shard.x,
          y: shard.y,
          vx: Math.cos(angle) * 35,
          vy: Math.sin(angle) * 35,
          radius: 1.5,
          color: '#a855f7',
          alpha: 0.7,
          maxLife: 0.25,
          life: 0.25,
          type: 'spark'
        });
      }
      self.energyShards.splice(i, 1);
    }
  }

  // 2. Spawn new shards:
  // - Max 8 shards concurrently
  // - 3.0s interval
  // - 15.0s lifespan
  self.shardSpawnTimer = (self.shardSpawnTimer ?? 3.0) - dt;
  if (self.shardSpawnTimer <= 0) {
    self.shardSpawnTimer += 3.0; // Reset 3s spawn interval

    if (self.energyShards.length < 8) {
      // Find a random position not colliding with any ball body
      let validX = 0;
      let validY = 0;
      let foundSpot = false;

      for (let attempt = 0; attempt < 14; attempt++) {
        const candX = 55 + Math.random() * (ARENA_WIDTH - 110);
        const candY = 55 + Math.random() * (ARENA_HEIGHT - 110);

        const distToSelf = Math.hypot(candX - self.x, candY - self.y);
        const distToTarget = Math.hypot(candX - target.x, candY - target.y);

        if (distToSelf > self.radius + 35 && distToTarget > target.radius + 35) {
          validX = candX;
          validY = candY;
          foundSpot = true;
          break;
        }
      }

      if (foundSpot) {
        const newShard: EnergyShard = {
          id: `shard_${Date.now()}_${Math.random()}`,
          x: validX,
          y: validY,
          radius: 9,
          life: 15.0,
          maxLife: 15.0,
          spawnTime: matchTime,
          pulsePhase: Math.random() * Math.PI * 2
        };
        self.energyShards.push(newShard);

        // Spawn pulse wave FX
        particles.push({
          x: validX,
          y: validY,
          vx: 0,
          vy: 0,
          radius: 20,
          color: '#c084fc',
          alpha: 0.85,
          maxLife: 0.35,
          life: 0.35,
          type: 'shard_pulse'
        });
      }
    }
  }

  // If match has two tunshimozu balls (mirror match), sync energyShards array
  if (target.characterId === 'tunshimozu' && target.energyShards !== self.energyShards) {
    target.energyShards = self.energyShards;
  }

  // 3. Passive 1: 吞噬 (Devour) - Check collision / proximity with energy shards
  if (self.hp > 0 && self.energyShards.length > 0) {
    for (let i = self.energyShards.length - 1; i >= 0; i--) {
      const shard = self.energyShards[i];
      const dist = Math.hypot(self.x - shard.x, self.y - shard.y);
      const contactDist = self.radius + shard.radius + 4;

      if (dist <= contactDist) {
        // Absorbed immediately!
        self.devourLastShardX = shard.x;
        self.devourLastShardY = shard.y;
        self.devourImplosionAnimTimer = 0.45;
        self.energyShards.splice(i, 1);
        self.passive1Triggers++;
        soundEngine.playDevourShard();

        // Increment growth up to 50 stacks max
        if ((self.growthStacks || 0) < (self.maxGrowthStacks || 50)) {
          self.growthStacks = (self.growthStacks || 0) + 1;

          // Apply stat growth:
          // Base stats: Size 18, Mass 0.95, HP 560, Base Dmg 5, Speed 100%
          // Per shard: +0.4 Size, +0.025 Mass, +3 HP上限, +0.2 碰撞傷害, -0.8% 速度
          // Per 10 stacks (魔軀成長): +15 HP上限, +2% 抗性, +1 碰撞傷害, -2% 速度
          const stacks = self.growthStacks;
          const tiers = Math.floor(stacks / 10);

          // Update size
          self.radius = (18 + stacks * 0.4) * BASE_RADIUS_SCALE;

          // Update mass
          self.mass = Math.round((0.95 + stacks * 0.025) * 1000) / 1000;

          // Update max HP and heal current HP
          const prevMaxHp = self.maxHp;
          self.maxHp = 560 + stacks * 3 + tiers * 15;
          const hpGain = self.maxHp - prevMaxHp;
          self.hp = Math.min(self.maxHp, self.hp + hpGain);
          recordHealingStats(self, hpGain);

          // Update collision damage
          self.baseAttack = Math.round((5 + stacks * 0.2 + tiers * 1) * 10) / 10;

          // Update collision resistance
          self.collisionResistance = tiers * 0.02;

          // Lateral text positioning (avoids center popping)
          const flankDir = self.x > 400 ? 1 : -1;
          const textX = self.x + flankDir * (self.radius * 0.75 + 12);
          const textY = self.y - self.radius - 14;

          fctList.push({
            id: `fct_devour_${Math.random()}`,
            x: textX,
            y: textY,
            text: `吞噬 +1 [${stacks}/50]`,
            color: '#c084fc',
            fontSize: 12,
            scale: 1.15,
            shakeIntensity: 3,
            alpha: 1.0,
            life: 0.72,
            maxLife: 0.72,
            vy: -26,
            damageType: 'status',
            damageValue: 0
          });

          // Milestone event every 10 stacks (魔軀成長 - 階級蛻變)
          if (stacks % 10 === 0) {
            self.passive2Triggers++;
            fctList.push({
              id: `fct_growth_${Math.random()}`,
              x: textX,
              y: textY - 18,
              text: `魔軀成長 第${tiers}階! (HP+15 抗性+2% 傷+1)`,
              color: '#f0abfc',
              fontSize: 13,
              scale: 1.35,
              shakeIntensity: 6,
              alpha: 1.0,
              life: 0.95,
              maxLife: 0.95,
              vy: -32,
              damageType: 'status',
              damageValue: 0
            });

            // Demonic Metamorphosis Expansion Nova
            particles.push({
              x: self.x,
              y: self.y,
              vx: 0,
              vy: 0,
              radius: self.radius * 2.4,
              color: '#d946ef',
              alpha: 1.0,
              maxLife: 0.5,
              life: 0.5,
              type: 'gluttony_burst_shockwave'
            });

            for (let m = 0; m < 20; m++) {
              const ang = (m * Math.PI * 2) / 20;
              const spd = 70 + Math.random() * 80;
              particles.push({
                x: self.x,
                y: self.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                radius: 2.8,
                color: m % 2 === 0 ? '#f0abfc' : '#a855f7',
                alpha: 1.0,
                maxLife: 0.45,
                life: 0.45,
                type: 'gluttony_burst_spark'
              });
            }

            events.push({
              id: `evt_growth_${Math.random()}`,
              timestamp: matchTime,
              type: 'passive_trigger',
              attackerId: self.id,
              text: `【魔軀成長】${self.name} 累積達 ${stacks} 層！魔軀蛻變增大（第 ${tiers} 階），獲得額外 HP 上限、碰撞傷害與碰撞抗性！`,
              badge: `魔軀成長 ${stacks}層`
            });
          }
        }

        // Absorption Implosion Visual FX:
        // Dark purple and magenta magical energy streams rapidly contracting towards ball core
        for (let p = 0; p < 16; p++) {
          const angle = Math.random() * Math.PI * 2;
          const distFromShard = 26 + Math.random() * 24;
          const sx = shard.x + Math.cos(angle) * distFromShard;
          const sy = shard.y + Math.sin(angle) * distFromShard;
          const toCoreAngle = Math.atan2(self.y - sy, self.x - sx);
          const spd = 160 + Math.random() * 100;

          particles.push({
            x: sx,
            y: sy,
            vx: Math.cos(toCoreAngle) * spd,
            vy: Math.sin(toCoreAngle) * spd,
            radius: 2.4 + Math.random() * 1.6,
            color: Math.random() > 0.4 ? '#f0abfc' : '#7e22ce',
            alpha: 1.0,
            maxLife: 0.32,
            life: 0.32,
            type: 'devour_implosion',
            targetX: self.x,
            targetY: self.y
          });
        }
      } else if (dist < self.radius + 65 && Math.random() < 0.18) {
        // Proximity Gravitational Wisp: shard drifting trail toward Tunshimozu
        const toBallAngle = Math.atan2(self.y - shard.y, self.x - shard.x);
        particles.push({
          x: shard.x + (Math.random() - 0.5) * 8,
          y: shard.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(toBallAngle) * (40 + Math.random() * 30),
          vy: Math.sin(toBallAngle) * (40 + Math.random() * 30),
          radius: 1.6,
          color: '#c084fc',
          alpha: 0.6,
          maxLife: 0.25,
          life: 0.25,
          type: 'spark'
        });
      }
    }
  }
}

/**
 * 愛心者・咪咪 (Mimi) 專屬三大被動技能模擬系統:
 * 1. 【貓咪衝爪】(Cat Claw Rush): 每 2 秒進行一次揮爪突襲，造成物理傷害並附加 3 秒流血 (每秒受傷)
 * 2. 【愛心飛射】(Heart Shot): 每 20 秒射出粉紅愛心飛彈，命中造成魔法傷害並魅惑敵人 2 秒 (朝咪咪方向移步)
 * 3. 【咪咪希望】(Mimi's Hope): 戰場定期生成生命成長包與攻擊成長包 (二選一)，吸收永久疊加屬性；敵方可踩踏破壞 (擁有40秒冷卻)
 */
function updateMimiPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // -------------------------------------------------------------------------
  // 0. STATUS EFFECT SIMULATION (Applied to any ball: Bleeding & Charmed)
  // -------------------------------------------------------------------------

  // Mimi Bleed Status Effect (貓咪衝爪流血: 3秒持續，每1.0秒跳血)
  if (self.isBleedingByMimi && (self.bleedTimer ?? 0) > 0) {
    self.bleedTimer = Math.max(0, (self.bleedTimer ?? 0) - dt);
    self.bleedTickTimer = (self.bleedTickTimer ?? 1.0) - dt;

    if (self.bleedTickTimer <= 0) {
      self.bleedTickTimer += 1.0;
      const bleedDmg = 2.0; // v2.6: 2.0/s (buffed from 1.8)
      self.hp = Math.max(0, self.hp - bleedDmg);
      self.hitsReceived++;

      if (self.bleedSourceId) {
        const attacker = self.bleedSourceId === target.id ? target : self;
        recordDamageStats(attacker, self, bleedDmg, 'physical', '爪擊流血');
      }

      fctList.push({
        id: `fct_bleed_${Math.random()}`,
        x: self.x + (Math.random() - 0.5) * 12,
        y: self.y - self.radius - 8,
        text: `-2.0 流血`,
        color: '#f43f5e',
        fontSize: 12,
        alpha: 1.0,
        life: 0.65,
        maxLife: 0.65,
        vy: -20
      });

      // Blood droplet particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: self.x,
          y: self.y,
          vx: (Math.random() - 0.5) * 35,
          vy: 20 + Math.random() * 40,
          radius: 1.8,
          color: '#e11d48',
          alpha: 0.9,
          maxLife: 0.35,
          life: 0.35,
          type: 'mimi_bleed_drop'
        });
      }
    }

    if (self.bleedTimer <= 0) {
      self.isBleedingByMimi = false;
      self.bleedTimer = 0;
    }
  }

  // Mimi Charm Status Effect (愛心魅惑: 2秒持續，情不自禁朝施法者緩步移動)
  if (self.isCharmedByMimi && (self.charmedByMimiTimer ?? 0) > 0) {
    self.charmedByMimiTimer = Math.max(0, (self.charmedByMimiTimer ?? 0) - dt);
    const caster = self.charmedByMimiSourceId === target.id ? target : self;
    const toCasterX = caster.x - self.x;
    const toCasterY = caster.y - self.y;
    const distToCaster = Math.hypot(toCasterX, toCasterY);

    if (distToCaster > 25) {
      const charmPullSpeed = 85;
      self.vx = (toCasterX / distToCaster) * charmPullSpeed;
      self.vy = (toCasterY / distToCaster) * charmPullSpeed;
    }

    if (Math.random() < 0.28) {
      particles.push({
        x: self.x + (Math.random() - 0.5) * self.radius,
        y: self.y - self.radius - 6,
        vx: (Math.random() - 0.5) * 16,
        vy: -25 - Math.random() * 20,
        radius: 2.2,
        color: '#ec4899',
        alpha: 0.9,
        maxLife: 0.45,
        life: 0.45,
        type: 'mimi_charm_heart'
      });
    }

    if (self.charmedByMimiTimer <= 0) {
      self.isCharmedByMimi = false;
      self.charmedByMimiTimer = 0;
    }
  }

  // Decrement enemy destroy cooldown timer on self
  if (self.mimiHopeDestroyCooldown && self.mimiHopeDestroyCooldown > 0) {
    self.mimiHopeDestroyCooldown = Math.max(0, self.mimiHopeDestroyCooldown - dt);
  }

  // Decrement Mimi's Claw Animation Timer
  if (self.mimiClawAnimTimer && self.mimiClawAnimTimer > 0) {
    self.mimiClawAnimTimer = Math.max(0, self.mimiClawAnimTimer - dt);
  }

  // Decrement Mimi Speed Boost Timer
  if (self.mimiSpeedBoostTimer && self.mimiSpeedBoostTimer > 0) {
    self.mimiSpeedBoostTimer = Math.max(0, self.mimiSpeedBoostTimer - dt);
  }

  // Only run Mimi's active passive logic if self is Mimi
  if (self.characterId !== 'mimi') return;

  // Initialize packs array if needed
  if (!self.mimiGrowthPacks) {
    self.mimiGrowthPacks = [];
  }

  // Mirror match pack synchronization
  if (target.characterId === 'mimi' && target.mimiGrowthPacks !== self.mimiGrowthPacks) {
    target.mimiGrowthPacks = self.mimiGrowthPacks;
  }

  // -------------------------------------------------------------------------
  // 1. PASSIVE 1: 貓咪衝爪 (Cat Claw Rush) - 100px Range, 2s Cooldown, 3 Dmg + 3s Bleed
  // -------------------------------------------------------------------------
  self.mimiClawCooldown = Math.max(0, (self.mimiClawCooldown ?? 0) - dt);

  if (self.hp > 0 && target.hp > 0 && self.mimiClawCooldown <= 0) {
    const distToTarget = Math.hypot(target.x - self.x, target.y - self.y);
    const clawRange = 100 + self.radius + target.radius;
    // Trigger when enemy is within 100px combat proximity
    if (distToTarget <= clawRange) {
      self.mimiClawCooldown = 2.2; // v2.6: 冷卻增加至 2.2s (原 1.4s)，降低頻率增加單次爆發
      self.passive1Triggers++;

      // Trigger claw strike animation and sound
      self.mimiClawAnimTimer = 0.35;
      self.mimiClawTargetX = target.x;
      self.mimiClawTargetY = target.y;
      soundEngine.playMimiClaw();

      // Feline pounce lunge forward impulse
      const lungeAngle = Math.atan2(target.y - self.y, target.x - self.x);
      self.vx += Math.cos(lungeAngle) * 65;
      self.vy += Math.sin(lungeAngle) * 65;

      const clawDamage = 14; // v2.6: 大幅提高技能傷害至 14 (原 7)
      applyDamageWithDamageSharing(
        target,
        self,
        clawDamage,
        'physical',
        '貓咪衝爪 [流血3s]',
        target.x,
        target.y,
        matchTime,
        fctList,
        events,
        particles
      );

      // Apply 3s Bleed to target (2.0/s, non-stacking refresh)
      target.isBleedingByMimi = true;
      target.bleedTimer = 3.0;
      target.bleedTickTimer = 1.0;
      target.bleedSourceId = self.id;

      // Claw slash spark particles
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 80;
        particles.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2,
          color: Math.random() > 0.4 ? '#ec4899' : '#ffffff',
          alpha: 1.0,
          maxLife: 0.25,
          life: 0.25,
          type: 'mimi_claw_slash'
        });
      }

      events.push({
        id: `evt_mimi_claw_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '貓咪衝爪',
        text: `【貓咪衝爪】${self.name} 迅捷揮爪突襲 ${target.name}！造成 ${clawDamage} 點物理傷害並附加 3 秒流血（每秒 2.0 傷害，總計 14 傷害）！`,
        badge: '衝爪流血'
      });
    }
  }

  // -------------------------------------------------------------------------
  // 2. PASSIVE 2: 愛心飛射 (Heart Shot) - 300px Trigger Range, 14s Cooldown, 80px AoE
  // -------------------------------------------------------------------------
  self.mimiHeartCooldown = Math.max(0, (self.mimiHeartCooldown ?? 0) - dt);

  const distToEnemyForHeart = Math.hypot(target.x - self.x, target.y - self.y);
  const heartFiringRange = 300 + self.radius + target.radius;

  if (self.hp > 0 && target.hp > 0 && self.mimiHeartCooldown <= 0 && distToEnemyForHeart <= heartFiringRange) {
    self.mimiHeartCooldown = 14.0; // v2.6: 14s cooldown (+1.0s CD)
    soundEngine.playMimiHeartShot();

    const aimAngle = Math.atan2(target.y - self.y, target.x - self.x);
    const shotSpeed = 380; // v2.6: 提升彈道速度 (290 -> 380)
    const launchDist = self.radius + 12;

    projectiles.push({
      id: `mimi_heart_${Date.now()}_${Math.random()}`,
      ownerId: self.id,
      type: 'mimi_heart_shot',
      x: self.x + Math.cos(aimAngle) * launchDist,
      y: self.y + Math.sin(aimAngle) * launchDist,
      vx: Math.cos(aimAngle) * shotSpeed,
      vy: Math.sin(aimAngle) * shotSpeed,
      radius: 13,
      damage: 20, // v2.6: 20 damage (buffed from 16)
      color: '#f472b6',
      trail: [],
      life: 3.5,
      isPhysical: false,
      mimiOriginX: self.x,
      mimiOriginY: self.y,
      mimiTraveledDist: 0,
      mimiMaxDist: 300
    });

    // Launch pink spark fanfare
    for (let i = 0; i < 8; i++) {
      const a = aimAngle + (Math.random() - 0.5) * 0.8;
      const spd = 30 + Math.random() * 60;
      particles.push({
        x: self.x + Math.cos(aimAngle) * launchDist,
        y: self.y + Math.sin(aimAngle) * launchDist,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 2,
        color: '#f472b6',
        alpha: 1.0,
        maxLife: 0.25,
        life: 0.25,
        type: 'mimi_heart_spark'
      });
    }

    events.push({
      id: `evt_mimi_hs_launch_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      skillName: '愛心飛射',
      text: `【愛心飛射】${self.name} 向 300px 內目標射出粉紅愛心！觸壁/達極限/命中將觸發 80px 爆裂，造成 6 點魔法傷害並魅惑 2 秒！`,
      badge: '愛心飛射'
    });
  }

  // -------------------------------------------------------------------------
  // 3. PASSIVE 3: 咪咪希望 (Mimi's Hope) - 20s Spawn, 2-Choose-1, 40s Enemy Trample CD
  // -------------------------------------------------------------------------
  self.mimiHopeSpawnTimer = (self.mimiHopeSpawnTimer ?? 20.0) - dt;

  // Periodic spawn: every 20s (and initial at 0.5s)
  if (self.mimiHopeSpawnTimer <= 0) {
    self.mimiHopeSpawnTimer += 20.0;

    // Only spawn if arena currently has fewer than 2 packs
    if (self.mimiGrowthPacks.length === 0) {
      self.mimiCycleId = (self.mimiCycleId || 0) + 1;
      self.mimiHasAbsorbedThisCycle = false;

      // Find 2 safe separated locations on the battlefield
      const spots: { x: number; y: number }[] = [];
      for (let s = 0; s < 2; s++) {
        let sx = 0;
        let sy = 0;
        for (let attempt = 0; attempt < 16; attempt++) {
          const candX = 80 + Math.random() * (ARENA_WIDTH - 160);
          const candY = 80 + Math.random() * (ARENA_HEIGHT - 160);
          const distToP1 = Math.hypot(candX - self.x, candY - self.y);
          const distToP2 = Math.hypot(candX - target.x, candY - target.y);
          const distToOtherSpot = spots.length > 0 ? Math.hypot(candX - spots[0].x, candY - spots[0].y) : 999;

          if (distToP1 > self.radius + 35 && distToP2 > target.radius + 35 && distToOtherSpot > 120) {
            sx = candX;
            sy = candY;
            break;
          }
        }
        if (sx === 0) {
          sx = 150 + s * 500;
          sy = 200 + Math.random() * 120;
        }
        spots.push({ x: sx, y: sy });
      }

      // Add Life Pack (翡翠生命成長包)
      const lifePack: MimiGrowthPack = {
        id: `mimi_life_pack_${self.mimiCycleId}`,
        type: 'life',
        x: spots[0].x,
        y: spots[0].y,
        radius: 14,
        createdAt: matchTime,
        cycleId: self.mimiCycleId
      };

      // Add Attack Pack (赤紅攻擊成長包)
      const attackPack: MimiGrowthPack = {
        id: `mimi_attack_pack_${self.mimiCycleId}`,
        type: 'attack',
        x: spots[1].x,
        y: spots[1].y,
        radius: 14,
        createdAt: matchTime,
        cycleId: self.mimiCycleId
      };

      self.mimiGrowthPacks.push(lifePack, attackPack);

      // Spawn portal particles
      [lifePack, attackPack].forEach(pk => {
        particles.push({
          x: pk.x,
          y: pk.y,
          vx: 0,
          vy: 0,
          radius: 26,
          color: pk.type === 'life' ? '#34d399' : '#f59e0b',
          alpha: 0.9,
          maxLife: 0.4,
          life: 0.4,
          type: 'spark'
        });
      });

      events.push({
        id: `evt_mimi_spawn_packs_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '咪咪希望',
        text: `【咪咪希望】戰場降臨了生命成長包與攻擊成長包（二選一）！咪咪靠近20px即可吸收，敵方踩踏可將其踩毀！`,
        badge: '成長包降臨'
      });
    }
  }

  // Check Mimi Absorption (20px detection trigger ring: dist <= self.radius + pack.radius + 20)
  if (self.hp > 0 && self.mimiGrowthPacks.length > 0) {
    for (let i = self.mimiGrowthPacks.length - 1; i >= 0; i--) {
      const pack = self.mimiGrowthPacks[i];
      const dist = Math.hypot(self.x - pack.x, self.y - pack.y);
      const detectionDist = self.radius + pack.radius + 20;

      if (dist <= detectionDist) {
        // Absorption successful!
        self.mimiGrowthPacks.splice(i, 1);
        self.passive3Triggers++;
        soundEngine.playMimiPackAbsorb();

        if (pack.type === 'life') {
          self.mimiLifeStacks = Math.min(100, (self.mimiLifeStacks || 0) + 1);
          const hpInc = Math.max(1, Math.round(self.maxHp * 0.001 * 10) / 10);
          self.maxHp += hpInc;
          self.hp += hpInc;

          fctList.push({
            id: `fct_pack_life_${Math.random()}`,
            x: self.x,
            y: self.y - self.radius - 12,
            text: `HP上限 +0.1%! (${self.mimiLifeStacks}層)`,
            color: '#34d399',
            fontSize: 12,
            alpha: 1.0,
            life: 0.85,
            maxLife: 0.85,
            vy: -25
          });

          events.push({
            id: `evt_mimi_abs_life_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            skillName: '咪咪希望',
            text: `【咪咪希望】${self.name} 吸收了【生命成長包】！HP上限成長提升！(累積 ${self.mimiLifeStacks} 層)`,
            badge: `HP成長 ${self.mimiLifeStacks}層`
          });
        } else {
          self.mimiAttackStacks = Math.min(100, (self.mimiAttackStacks || 0) + 1);
          self.baseAttack = Math.round((self.baseAttack * 1.001) * 100) / 100;

          fctList.push({
            id: `fct_pack_atk_${Math.random()}`,
            x: self.x,
            y: self.y - self.radius - 12,
            text: `攻擊成長 +0.1%! (${self.mimiAttackStacks}層)`,
            color: '#fbbf24',
            fontSize: 12,
            alpha: 1.0,
            life: 0.85,
            maxLife: 0.85,
            vy: -25
          });

          events.push({
            id: `evt_mimi_abs_atk_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            skillName: '咪咪希望',
            text: `【咪咪希望】${self.name} 吸收了【攻擊成長包】！攻擊力成長提升！(累積 ${self.mimiAttackStacks} 層)`,
            badge: `攻擊成長 ${self.mimiAttackStacks}層`
          });
        }

        // Instant Reward: +5 HP recovery and 1.5s agility boost (+15% move speed)
        const healAmt = Math.min(5, self.maxHp - self.hp);
        if (healAmt > 0) {
          self.hp += healAmt;
          recordHealingStats(self, healAmt);
          fctList.push({
            id: `fct_pack_heal_${Math.random()}`,
            x: self.x + (Math.random() - 0.5) * 16,
            y: self.y - self.radius - 24,
            text: `+${healAmt} 恢復`,
            color: '#10b981',
            fontSize: 12,
            alpha: 1.0,
            life: 0.75,
            maxLife: 0.75,
            vy: -20
          });
        }
        self.mimiSpeedBoostTimer = 1.5;

        // Absorption particle fountain
        for (let p = 0; p < 14; p++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 50 + Math.random() * 80;
          particles.push({
            x: pack.x,
            y: pack.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.2,
            color: pack.type === 'life' ? '#34d399' : '#f59e0b',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'mimi_pack_absorb'
          });
        }

        // 2-Choose-1 Rule: Any other pack in the same cycle automatically dissolves!
        for (let j = self.mimiGrowthPacks.length - 1; j >= 0; j--) {
          if (self.mimiGrowthPacks[j].cycleId === pack.cycleId) {
            const dissolved = self.mimiGrowthPacks.splice(j, 1)[0];
            for (let p = 0; p < 8; p++) {
              const a = Math.random() * Math.PI * 2;
              particles.push({
                x: dissolved.x,
                y: dissolved.y,
                vx: Math.cos(a) * 40,
                vy: Math.sin(a) * 40,
                radius: 1.6,
                color: '#94a3b8',
                alpha: 0.6,
                maxLife: 0.3,
                life: 0.3,
                type: 'spark'
              });
            }
          }
        }
        break;
      }
    }
  }

  // Check Enemy Trample / Destruction: 20px range, 40s Cooldown, 70s Respawn, Both Packs Shatter
  if (target.hp > 0 && self.mimiGrowthPacks.length > 0) {
    for (let i = self.mimiGrowthPacks.length - 1; i >= 0; i--) {
      const pack = self.mimiGrowthPacks[i];
      const distToEnemy = Math.hypot(target.x - pack.x, target.y - pack.y);

      // Enemy enters within 20px of the pack
      if (distToEnemy <= target.radius + pack.radius + 20) {
        if ((target.mimiHopeDestroyCooldown ?? 0) <= 0) {
          // Both packs destroyed immediately by enemy!
          target.mimiHopeDestroyCooldown = 40.0; // 40s destroy cooldown
          self.mimiHopeSpawnTimer = 70.0; // 40s cooldown + 30s spawn timer = 70s respawn
          soundEngine.playMimiPackBreak();

          // Particle burst at both pack positions
          self.mimiGrowthPacks.forEach(pk => {
            for (let p = 0; p < 16; p++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 60 + Math.random() * 100;
              particles.push({
                x: pk.x,
                y: pk.y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                radius: 2.2,
                color: pk.type === 'life' ? '#10b981' : '#ea580c',
                alpha: 1.0,
                maxLife: 0.35,
                life: 0.35,
                type: 'mimi_pack_burst'
              });
            }
          });

          self.mimiGrowthPacks = [];
          if (target.characterId === 'mimi') target.mimiGrowthPacks = [];

          fctList.push({
            id: `fct_pack_destroyed_${Math.random()}`,
            x: pack.x,
            y: pack.y - 12,
            text: '雙包已踩毀! (40s CD / 70s重生)',
            color: '#f97316',
            fontSize: 12,
            alpha: 1.0,
            life: 0.95,
            maxLife: 0.95,
            vy: -20
          });

          events.push({
            id: `evt_mimi_destroyed_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: target.id,
            targetId: self.id,
            skillName: '踩毀成長包',
            text: `【破壞希望】${target.name} 踩毀了成長包！雙包立即消散並進入 40 秒冷卻，共 70 秒後重新生成！`,
            badge: '雙包被踩毀'
          });
          break;
        }
      }
    }
  }
}

/**
 * 剪刀手 (Jiandaoshou) 專屬技能與視覺特效更新模組
 * - 被動一【剪裁之術】: 碰撞冷卻與回復（主動剪刀攻擊動畫衰減）
 * - 被動二【聖霧守護】: 每 18 秒在周圍召喚半透明白色聖霧（半徑 130px），持續 4 秒。處於聖霧中時，完全免疫一切普通碰撞攻擊與非指定技能傷害。
 *   視覺特效：生成半透明白色霧氣團 (jiandao_mist_wisp) 與聖光光環光芒粒子 (jiandao_halo_spark)。
 * - 被動三【聖針連射】: 每 12 秒向敵人方向高速發射 5 枚微型銀白色飛針（射程 400px），每枚造成 6 點魔法傷害，並使目標減速 20% 持續 1.2 秒。
 *   視覺特效：核心魔力釋放光暈、飛針高頻射出、命中十字璀璨符號、銀白飛針碎芒粒子、減速冰霜光環。
 * - 狀態效果：聖針減速 (isSlowedByNeedle) 速度減幅 20% 與微型冰霜星屑粒子衰減。
 */
export function updateJiandaoshouPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 1. 聖針減速狀態處理 (通用，任何被剪刀手聖針擊中的單位)
  if (self.isSlowedByNeedle && (self.slowedByNeedleTimer ?? 0) > 0) {
    self.slowedByNeedleTimer = (self.slowedByNeedleTimer ?? 0) - dt;
    // 減速 20% 阻尼
    self.vx *= Math.pow(0.8, dt * 2.5);
    self.vy *= Math.pow(0.8, dt * 2.5);

    // 減速狀態冰屑粒子微光
    if (Math.random() < 0.2) {
      const a = Math.random() * Math.PI * 2;
      const dist = Math.random() * self.radius;
      particles.push({
        x: self.x + Math.cos(a) * dist,
        y: self.y + Math.sin(a) * dist,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        radius: 1.8,
        color: '#7dd3fc',
        alpha: 0.8,
        maxLife: 0.35,
        life: 0.35,
        type: 'spark'
      });
    }

    if (self.slowedByNeedleTimer <= 0) {
      self.isSlowedByNeedle = false;
      self.slowedByNeedleTimer = 0;
    }
  }

  // 若自身不是剪刀手，則不執行後續英雄專屬主動/被動更新
  if (self.characterId !== 'jiandaoshou') return;

  // 2. 剪刀攻擊與核心動畫計時器衰減
  if ((self.jiandaoshouSnipAnimTimer ?? 0) > 0) {
    self.jiandaoshouSnipAnimTimer = Math.max(0, (self.jiandaoshouSnipAnimTimer ?? 0) - dt);
  }
  if ((self.jiandaoshouCoreGlowTimer ?? 0) > 0) {
    self.jiandaoshouCoreGlowTimer = Math.max(0, (self.jiandaoshouCoreGlowTimer ?? 0) - dt);
  }

  // 迎敵剪切攻擊：當在一定近戰距離內 (120px) 且正高速衝向目標，主動發動剪刀開合突刺姿態
  const distToTarget = Math.hypot(target.x - self.x, target.y - self.y);
  const relVx = self.vx - target.vx;
  const relVy = self.vy - target.vy;
  const approachDot = (relVx * (target.x - self.x) + relVy * (target.y - self.y)) / Math.max(1, distToTarget);

  if (
    self.hp > 0 &&
    target.hp > 0 &&
    (self.jiandaoshouSnipAnimTimer ?? 0) <= 0 &&
    distToTarget <= (self.radius + target.radius + 68) &&
    approachDot > 45
  ) {
    self.jiandaoshouSnipAnimTimer = 0.38;
    self.jiandaoshouCoreGlowTimer = 0.35;
    self.jiandaoshouAttackAimAngle = Math.atan2(target.y - self.y, target.x - self.x);
    soundEngine.playJiandaoSnip();

    // 揮刃殘影弧光
    particles.push({
      x: self.x + Math.cos(self.jiandaoshouAttackAimAngle) * (self.radius * 0.9),
      y: self.y + Math.sin(self.jiandaoshouAttackAimAngle) * (self.radius * 0.9),
      vx: 0,
      vy: 0,
      radius: self.radius * 1.3,
      angle: self.jiandaoshouAttackAimAngle,
      color: '#ffffff',
      alpha: 0.65,
      maxLife: 0.25,
      life: 0.25,
      type: 'jiandao_blade_trail'
    });
  }

  // 3. 被動一【剪裁之術】冷卻計時器
  if ((self.jiandaoshouSnipCooldown ?? 0) > 0) {
    self.jiandaoshouSnipCooldown = Math.max(0, (self.jiandaoshouSnipCooldown ?? 0) - dt);
  }

  // 4. 被動二【聖霧守護】更新
  // 每 18 秒召喚半透明白色聖霧（半徑 130px），持續 4 秒
  if (self.jiandaoshouMistActive) {
    self.jiandaoshouMistDuration = Math.max(0, (self.jiandaoshouMistDuration ?? 0) - dt);

    // 聖霧中動態生成半透明白色霧氣團 (jiandao_mist_wisp) 與聖光光環光芒 (jiandao_halo_spark)
    // 霧氣團生成
    if (Math.random() < 0.65) {
      const mistAngle = Math.random() * Math.PI * 2;
      const mistDist = Math.random() * 115;
      const driftSpeed = 8 + Math.random() * 18;
      const driftAngle = Math.random() * Math.PI * 2;
      particles.push({
        x: self.x + Math.cos(mistAngle) * mistDist,
        y: self.y + Math.sin(mistAngle) * mistDist,
        vx: Math.cos(driftAngle) * driftSpeed,
        vy: Math.sin(driftAngle) * driftSpeed,
        radius: 20 + Math.random() * 18,
        color: '#ffffff',
        alpha: 0.35 + Math.random() * 0.25,
        maxLife: 0.7 + Math.random() * 0.5,
        life: 0.7 + Math.random() * 0.5,
        type: 'jiandao_mist_wisp'
      });
    }

    // 聖光光環粒子 (邊緣周圍上升鑽石光芒)
    if (Math.random() < 0.45) {
      const haloAngle = Math.random() * Math.PI * 2;
      const haloDist = 120 + (Math.random() - 0.5) * 20;
      particles.push({
        x: self.x + Math.cos(haloAngle) * haloDist,
        y: self.y + Math.sin(haloAngle) * haloDist,
        vx: (Math.random() - 0.5) * 12,
        vy: -15 - Math.random() * 25,
        radius: 2 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? '#ffffff' : '#fef08a',
        alpha: 0.9,
        maxLife: 0.6,
        life: 0.6,
        type: 'jiandao_halo_spark'
      });
    }

    // 聖霧持續時間結束
    if (self.jiandaoshouMistDuration <= 0) {
      self.jiandaoshouMistActive = false;
      self.jiandaoshouMistCooldown = 10.0;

      fctList.push({
        id: `fct_mist_end_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 12,
        text: '聖霧散去',
        color: '#94a3b8',
        fontSize: 11,
        alpha: 0.9,
        life: 0.65,
        maxLife: 0.65,
        vy: -18
      });
    }
  } else {
    // 聖霧冷卻衰減
    if ((self.jiandaoshouMistCooldown ?? 0) > 0) {
      self.jiandaoshouMistCooldown = Math.max(0, (self.jiandaoshouMistCooldown ?? 0) - dt);
    } else if (self.hp > 0) {
      // 觸發【聖霧守護】
      self.jiandaoshouMistActive = true;
      self.jiandaoshouMistDuration = 4.5;
      self.jiandaoshouMistCooldown = 10.0;
      self.passive2Triggers++;

      soundEngine.playJiandaoMistActivate();

      fctList.push({
        id: `fct_mist_act_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 16,
        text: '【聖霧守護】持續4.5秒 免疫傷害',
        color: '#fef08a',
        fontSize: 13,
        scale: 1.2,
        alpha: 1.0,
        life: 1.0,
        maxLife: 1.0,
        vy: -24
      });

      events.push({
        id: `evt_mist_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: target.id,
        skillName: '聖霧守護',
        text: `【聖霧守護】${self.name} 召喚了半徑 130px 聖霧，持續 4 秒完全免疫碰撞與技能傷害！`,
        badge: '聖霧守護'
      });

      // 瞬間湧現多團聖霧與環狀光環星塵
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * 100;
        particles.push({
          x: self.x + Math.cos(a) * d,
          y: self.y + Math.sin(a) * d,
          vx: Math.cos(a) * 20,
          vy: Math.sin(a) * 20,
          radius: 24 + Math.random() * 16,
          color: '#ffffff',
          alpha: 0.5,
          maxLife: 0.8,
          life: 0.8,
          type: 'jiandao_mist_wisp'
        });
      }

      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        particles.push({
          x: self.x + Math.cos(a) * 125,
          y: self.y + Math.sin(a) * 125,
          vx: Math.cos(a) * 15,
          vy: Math.sin(a) * 15 - 10,
          radius: 2.5,
          color: '#fef08a',
          alpha: 1.0,
          maxLife: 0.7,
          life: 0.7,
          type: 'jiandao_halo_spark'
        });
      }
    }
  }

  // 5. 被動三【聖針連射】更新
  // 每 6.5 秒向敵人方向高速發射 5 枚微型銀白色飛針（射程 400px）
  if ((self.jiandaoshouNeedleCooldown ?? 0) > 0) {
    self.jiandaoshouNeedleCooldown = Math.max(0, (self.jiandaoshouNeedleCooldown ?? 0) - dt);
  } else if ((self.jiandaoshouNeedlesRemaining ?? 0) <= 0 && self.hp > 0 && target.hp > 0) {
    // 觸發連射準備
    self.jiandaoshouNeedlesRemaining = 5;
    self.jiandaoshouNeedleIntervalTimer = 0; // 第一發立即射出
    self.jiandaoshouNeedleCooldown = 7.5; // v2.6: +1.0s CD (6.5s -> 7.5s)
    self.passive3Triggers++;

    fctList.push({
      id: `fct_needle_barrage_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 14,
      text: '【聖針連射】(5發飛針)',
      color: '#e2e8f0',
      fontSize: 12,
      scale: 1.15,
      alpha: 1.0,
      life: 0.8,
      maxLife: 0.8,
      vy: -22
    });

    events.push({
      id: `evt_needle_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: target.id,
      skillName: '聖針連射',
      text: `【聖針連射】${self.name} 高速向 ${target.name} 發射 5 枚聖光飛針！`,
      badge: '聖針連射'
    });
  }

  // 聖針發射間隔循環
  if ((self.jiandaoshouNeedlesRemaining ?? 0) > 0 && self.hp > 0) {
    self.jiandaoshouNeedleIntervalTimer = Math.max(0, (self.jiandaoshouNeedleIntervalTimer ?? 0) - dt);

    if (self.jiandaoshouNeedleIntervalTimer <= 0) {
      self.jiandaoshouNeedlesRemaining--;
      self.jiandaoshouNeedleIntervalTimer = 0.12; // 每發相隔 0.12 秒
      self.jiandaoshouCoreGlowTimer = 0.35; // 射出時核心魔力爆發光暈

      // 音效
      soundEngine.playJiandaoNeedleLaunch();

      // 計算朝向目標的發射向量 (射程 400px，速度 460px/s => 生命週期 400 / 460)
      const aimDx = target.x - self.x;
      const aimDy = target.y - self.y;
      const aimDist = Math.hypot(aimDx, aimDy) || 1;
      // 微量散佈角 (±2.5度) 增添自然連射節奏
      const spread = (Math.random() - 0.5) * 0.09;
      const baseAngle = Math.atan2(aimDy, aimDx) + spread;
      const speed = 460;
      const maxRange = 400;
      const lifeTime = maxRange / speed;

      const launchX = self.x + Math.cos(baseAngle) * (self.radius + 6);
      const launchY = self.y + Math.sin(baseAngle) * (self.radius + 6);

      projectiles.push({
        id: `proj_needle_${Math.random()}`,
        ownerId: self.id,
        type: 'jiandao_needle',
        x: launchX,
        y: launchY,
        vx: Math.cos(baseAngle) * speed,
        vy: Math.sin(baseAngle) * speed,
        radius: 3.5,
        damage: 16,
        life: lifeTime,
        maxLife: lifeTime,
        color: '#ffffff',
        trail: []
      });

      // 飛針射出火花特效
      for (let i = 0; i < 3; i++) {
        const a = baseAngle + (Math.random() - 0.5) * 0.5;
        const spd = 30 + Math.random() * 50;
        particles.push({
          x: launchX,
          y: launchY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 1.5,
          color: '#ffffff',
          alpha: 1.0,
          maxLife: 0.2,
          life: 0.2,
          type: 'jiandao_needle_spark'
        });
      }
    }
  }
}

/**
 * 蒂納 (Tina / Dina) 被動技能系統更新
 * 職業：法師／特殊型（遠距離風箏／光暗能量／融合攻擊／隨機控制）
 * - 武器【三相光環】：白光、暗光、融合光平時環繞旋轉。
 * - 被動一【白光發射】：每 1.2 秒向敵方發射1枚白光（射程 360px，速度 320px/s），造成 0.5 點魔法傷害，命中必然產生 1 個【白光能量】。
 * - 被動二【暗光蓄力】：兩階段機制。
 *   - 階段一：檢測場上未消耗的【白光能量】，自動吸收並進入 0.6 秒蓄力狀態（若白光產生 ≤ 0.8 秒內吸收，標記 perfectAbsorb = true）。
 *   - 階段二：蓄力完成後朝敵方發射暗光（射程 300px，速度 280px/s），造成 4 點魔法傷害，並開啟 1.8 秒【融合窗口】。
 * - 被動三【三相融合】：在融合窗口開啟期間，若場上存在另一個白光能量且與敵方距離 ≤ 320px，立即觸發融合並消耗該白光能量與關閉窗口。
 *   - 完美融合（繼承 perfectAbsorb）：造成 14 點魔法傷害，並 1/3 隨機賦予強化版控制（燃燒 2.5s / 減速35% 2.0s / 定身 1.2s）。
 *   - 一般融合：造成 8 點魔法傷害，並 1/3 隨機賦予常規控制（燃燒 1.5s / 減速35% 1.5s / 定身 0.8s）。
 * - 核心之力【遠距離風箏防護】：冷卻 8 秒。當敵方接近（距離 < 130px）時自動觸發緊急位移拉開至 220px 安全距離。
 * - 狀態處理：處理目標受到融合的燃燒 (Burn)、減速 (Slow)、定身 (Immobilize) 結算。
 */
export function updateDinaPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 1. 處理通用異常狀態 (自身若受到蒂納融合狀態)
  // 1.1 燃燒狀態結算 (Burn)
  if (self.isDinaBurned && (self.dinaBurnTimer ?? 0) > 0) {
    self.dinaBurnTimer = (self.dinaBurnTimer ?? 0) - dt;
    self.dinaBurnInterval = (self.dinaBurnInterval ?? 0.5) - dt;

    if (self.dinaBurnInterval <= 0) {
      self.dinaBurnInterval = 0.5;
      const burnDmg = self.dinaBurnDamagePerTick || 1;
      self.hp = Math.max(0, self.hp - burnDmg);
      self.hitsReceived++;
      recordDamageStats(target, self, burnDmg, 'flame', '蒂納燃燒');

      fctList.push({
        id: `fct_burn_tick_${Math.random()}`,
        x: self.x + (Math.random() - 0.5) * 16,
        y: self.y - self.radius - 8,
        text: `-${burnDmg} 燃燒`,
        color: '#fb7185',
        fontSize: 11,
        scale: 1.0,
        alpha: 0.9,
        life: 0.55,
        maxLife: 0.55,
        vy: -18,
        damageType: 'magic',
        damageValue: burnDmg
      });

      // 燃燒火屑粒子
      particles.push({
        x: self.x + (Math.random() - 0.5) * self.radius,
        y: self.y + (Math.random() - 0.5) * self.radius,
        vx: (Math.random() - 0.5) * 20,
        vy: -20 - Math.random() * 20,
        radius: 2,
        color: '#f43f5e',
        alpha: 0.9,
        maxLife: 0.35,
        life: 0.35,
        type: 'dina_burn_ember'
      });
    }

    if (self.dinaBurnTimer <= 0) {
      self.isDinaBurned = false;
      self.dinaBurnTimer = 0;
    }
  }

  // 1.2 減速狀態結算 (Slow)
  if (self.isDinaSlowed && (self.dinaSlowTimer ?? 0) > 0) {
    self.dinaSlowTimer = (self.dinaSlowTimer ?? 0) - dt;
    if (Math.random() < 0.25) {
      particles.push({
        x: self.x + (Math.random() - 0.5) * self.radius * 1.5,
        y: self.y + (Math.random() - 0.5) * self.radius * 1.5,
        vx: 0,
        vy: -8,
        radius: 2.2,
        color: '#c084fc',
        alpha: 0.8,
        maxLife: 0.35,
        life: 0.35,
        type: 'dina_slow_rune'
      });
    }
    if (self.dinaSlowTimer <= 0) {
      self.isDinaSlowed = false;
      self.dinaSlowTimer = 0;
    }
  }

  // 1.3 定身狀態結算 (Immobilize)
  if (self.isDinaImmobilized && (self.dinaImmobilizeTimer ?? 0) > 0) {
    self.dinaImmobilizeTimer = (self.dinaImmobilizeTimer ?? 0) - dt;
    self.vx *= 0.8;
    self.vy *= 0.8;
    if (Math.random() < 0.3) {
      particles.push({
        x: self.x + (Math.random() - 0.5) * self.radius,
        y: self.y + (Math.random() - 0.5) * self.radius,
        vx: 0,
        vy: 0,
        radius: self.radius * 1.1,
        color: '#818cf8',
        alpha: 0.8,
        maxLife: 0.3,
        life: 0.3,
        type: 'dina_immobilize_chain'
      });
    }
    if (self.dinaImmobilizeTimer <= 0) {
      self.isDinaImmobilized = false;
      self.dinaImmobilizeTimer = 0;
    }
  }

  // 若自身不是蒂納，則不執行後續英雄專屬邏輯
  if (self.characterId !== 'dina') return;

  // 2. 武器三相光環旋轉角度更新
  self.dinaHaloRotationAngle = ((self.dinaHaloRotationAngle ?? 0) + dt * 2.5) % (Math.PI * 2);

  // 3. 核心之力冷卻與風箏防護計時器
  if ((self.dinaCorePowerCooldown ?? 0) > 0) {
    self.dinaCorePowerCooldown = Math.max(0, (self.dinaCorePowerCooldown ?? 0) - dt);
  }
  if ((self.dinaCorePowerAnimTimer ?? 0) > 0) {
    self.dinaCorePowerAnimTimer = Math.max(0, (self.dinaCorePowerAnimTimer ?? 0) - dt);
    if (self.dinaCorePowerAnimTimer <= 0) {
      self.dinaCorePowerActive = false;
    }
  }

  // 核心之力觸發檢查：當敵方接近（距離 < 130px），且冷卻完畢時自動觸發緊急風箏位移
  const distToTarget = Math.hypot(target.x - self.x, target.y - self.y);
  if (
    self.hp > 0 &&
    target.hp > 0 &&
    (self.dinaCorePowerCooldown ?? 0) <= 0 &&
    distToTarget < 130 &&
    distToTarget > 0.1
  ) {
    self.dinaCorePowerCooldown = 5.5;
    self.dinaCorePowerActive = true;
    self.dinaCorePowerAnimTimer = 0.35;

    // 向遠離目標方向高速推開
    const escapeX = -(target.x - self.x) / distToTarget;
    const escapeY = -(target.y - self.y) / distToTarget;
    self.vx = escapeX * 360;
    self.vy = escapeY * 360;

    soundEngine.playDinaCorePower();

    // 核心氣浪衝擊波粒子
    particles.push({
      x: self.x,
      y: self.y,
      vx: 0,
      vy: 0,
      radius: self.radius + 20,
      color: '#818cf8',
      alpha: 1.0,
      maxLife: 0.35,
      life: 0.35,
      type: 'dina_core_power_wave'
    });

    fctList.push({
      id: `fct_core_power_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 12,
      text: `核心之力 (拉開至220px)`,
      color: '#a5b4fc',
      fontSize: 12,
      scale: 1.2,
      alpha: 1.0,
      life: 0.75,
      maxLife: 0.75,
      vy: -22
    });

    events.push({
      id: `evt_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      skillName: '核心之力',
      text: `${self.name} 受到近身壓迫，觸發【核心之力】緊急風箏拉開距離！`,
      badge: '核心風箏'
    });
  }

  // 4. 清理過期或已被消耗的白光能量
  if (self.dinaWhiteEnergies && self.dinaWhiteEnergies.length > 0) {
    self.dinaWhiteEnergies = self.dinaWhiteEnergies.filter(e => {
      if (e.consumed && e.state === 'CONSUMED') return false;
      if (e.state === 'ABSORBED') return false;
      if (matchTime - e.createdAt > 14.0) return false;
      return true;
    });
  } else {
    self.dinaWhiteEnergies = [];
  }

  // 5. 被動一【白光發射】
  // 每 0.9 秒自動朝敵方發射 1 枚白光（射程 360px，速度 320px/s），造成 2.5 魔法傷害
  if ((self.dinaWhiteLightCooldown ?? 0) > 0) {
    self.dinaWhiteLightCooldown = Math.max(0, (self.dinaWhiteLightCooldown ?? 0) - dt);
  }

  if (
    self.hp > 0 &&
    target.hp > 0 &&
    (self.dinaWhiteLightCooldown ?? 0) <= 0 &&
    !self.isProcessingWhiteLight
  ) {
    self.isProcessingWhiteLight = true;
    self.dinaWhiteLightCooldown = 1.7; // v2.6: +0.8s CD (0.9s -> 1.7s)

    const aimAngle = Math.atan2(target.y - self.y, target.x - self.x);
    const speed = 440; // v2.6: 提升彈道速度 (320 -> 440)
    const launchDist = self.radius + 4;
    const launchX = self.x + Math.cos(aimAngle) * launchDist;
    const launchY = self.y + Math.sin(aimAngle) * launchDist;
    const maxRange = 360;
    const lifeTime = maxRange / speed;

    projectiles.push({
      id: `proj_dina_white_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ownerId: self.id,
      type: 'dina_white_light',
      x: launchX,
      y: launchY,
      vx: Math.cos(aimAngle) * speed,
      vy: Math.sin(aimAngle) * speed,
      radius: 6,
      damage: 5.5, // v2.6: 5.5 damage (buffed from 2.5)
      life: lifeTime,
      maxLife: lifeTime,
      color: '#ffffff',
      trail: []
    });

    soundEngine.playDinaWhiteLight();

    // 發射星光碎屑
    for (let i = 0; i < 4; i++) {
      const a = aimAngle + (Math.random() - 0.5) * 0.6;
      const spd = 30 + Math.random() * 40;
      particles.push({
        x: launchX,
        y: launchY,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        radius: 1.6,
        color: '#ffffff',
        alpha: 1.0,
        maxLife: 0.22,
        life: 0.22,
        type: 'dina_white_spark'
      });
    }

    self.isProcessingWhiteLight = false;
  }

  // 6. 被動二【暗光吸收與蓄力】
  // 6.1 階段一：檢測場上是否有可用的白光能量進行吸收
  if (
    self.hp > 0 &&
    (!self.dinaDarkLightState || self.dinaDarkLightState === 'EMPTY') &&
    !self.isProcessingDarkLight
  ) {
    const availEnergy = self.dinaWhiteEnergies.find(e => e.state === 'AVAILABLE' && !e.consumed);
    if (availEnergy) {
      self.isProcessingDarkLight = true;
      availEnergy.state = 'RESERVED_FOR_ABSORPTION';

      // 檢查是否在生成後 0.8 秒內被吸收 -> 完美吸收
      const age = matchTime - availEnergy.createdAt;
      self.dinaPerfectAbsorb = age <= 0.8;

      availEnergy.state = 'ABSORBED';
      availEnergy.consumed = true;

      self.dinaDarkLightState = 'CHARGING';
      self.dinaDarkLightChargeTimer = 0.4;

      soundEngine.playDinaAbsorb();

      // 能量湧入粒子
      const ex = availEnergy.x ?? self.x;
      const ey = availEnergy.y ?? self.y;
      for (let i = 0; i < 6; i++) {
        const toMeX = (self.x - ex) * 0.8 + (Math.random() - 0.5) * 30;
        const toMeY = (self.y - ey) * 0.8 + (Math.random() - 0.5) * 30;
        particles.push({
          x: ex,
          y: ey,
          vx: toMeX,
          vy: toMeY,
          radius: 2.2,
          color: self.dinaPerfectAbsorb ? '#facc15' : '#c084fc',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'dina_white_spark'
        });
      }

      fctList.push({
        id: `fct_absorb_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 12,
        text: self.dinaPerfectAbsorb ? '【完美】吸收能量 (0.4s蓄力)' : '吸收白光 (0.4s蓄力)',
        color: self.dinaPerfectAbsorb ? '#fef08a' : '#c084fc',
        fontSize: 11,
        scale: 1.1,
        alpha: 1.0,
        life: 0.65,
        maxLife: 0.65,
        vy: -18
      });

      self.isProcessingDarkLight = false;
    }
  }

  // 6.2 階段二：暗光蓄力倒數與發射
  if (self.dinaDarkLightState === 'CHARGING' && (self.dinaDarkLightChargeTimer ?? 0) > 0) {
    self.dinaDarkLightChargeTimer = (self.dinaDarkLightChargeTimer ?? 0) - dt;

    // 蒂納 - 暗光蓄力粒子群：向蒂納核心漩渦匯聚的紫晶暗光粒子 (每幀依機率生成，輕量低負擔)
    if (Math.random() < 0.65) {
      const chargeAngle = Math.random() * Math.PI * 2;
      const chargeDist = self.radius + 14 + Math.random() * 22;
      const startX = self.x + Math.cos(chargeAngle) * chargeDist;
      const startY = self.y + Math.sin(chargeAngle) * chargeDist;
      const convergeSpeed = 70 + Math.random() * 40;
      const tanSpeed = 35 + Math.random() * 25; // 帶切向漩渦速度
      // 向心方向
      const toCenterX = -Math.cos(chargeAngle);
      const toCenterY = -Math.sin(chargeAngle);
      // 切線方向
      const tanX = -Math.sin(chargeAngle);
      const tanY = Math.cos(chargeAngle);

      particles.push({
        x: startX,
        y: startY,
        vx: toCenterX * convergeSpeed + tanX * tanSpeed,
        vy: toCenterY * convergeSpeed + tanY * tanSpeed,
        radius: 1.8 + Math.random() * 1.2,
        color: Math.random() > 0.4 ? '#c084fc' : '#e879f9',
        alpha: 0.95,
        maxLife: 0.28,
        life: 0.28,
        type: 'dina_dark_charge_spark',
        angle: chargeAngle,
        spin: 6
      });
    }

    if (self.dinaDarkLightChargeTimer <= 0) {
      self.dinaDarkLightState = 'READY';

      // 蓄力完成，立即朝敵方發射暗光（射程 300px，速度 280px/s，造成 4 點魔法傷害）
      if (self.hp > 0 && target.hp > 0) {
        const aimAngle = Math.atan2(target.y - self.y, target.x - self.x);
        const speed = 420; // v2.6: 提升彈道速度 (280 -> 420)
        const launchDist = self.radius + 6;
        const launchX = self.x + Math.cos(aimAngle) * launchDist;
        const launchY = self.y + Math.sin(aimAngle) * launchDist;
        const maxRange = 300;
        const lifeTime = maxRange / speed;

        projectiles.push({
          id: `proj_dina_dark_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ownerId: self.id,
          type: 'dina_dark_light',
          x: launchX,
          y: launchY,
          vx: Math.cos(aimAngle) * speed,
          vy: Math.sin(aimAngle) * speed,
          radius: 8,
          damage: 22, // v2.6: 22 damage (buffed from 10)
          life: lifeTime,
          maxLife: lifeTime,
          color: '#c084fc',
          trail: []
        });

        soundEngine.playDinaDarkLight();

        // 開啟 1.8 秒融合窗口
        const windowId = `fw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        self.dinaCurrentFusionWindow = {
          windowId,
          darkLightEventId: `dle_${Date.now()}`,
          openedAt: matchTime,
          expiresAt: matchTime + 1.8,
          startTime: matchTime,
          endTime: matchTime + 1.8,
          isActive: true,
          used: false,
          isPerfect: !!self.dinaPerfectAbsorb,
          state: 'OPEN',
          pairedWhiteLightEventId: null,
          fusionEventId: null
        };
        self.dinaDarkLightState = 'FIRED';

        fctList.push({
          id: `fct_fusion_win_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 14,
          text: `融合窗口開啟 1.8s${self.dinaPerfectAbsorb ? ' (完美)' : ''}`,
          color: '#e879f9',
          fontSize: 11,
          scale: 1.15,
          alpha: 1.0,
          life: 0.75,
          maxLife: 0.75,
          vy: -20
        });
      } else {
        self.dinaDarkLightState = 'EMPTY';
      }
    }
  }

  // 7. 融合窗口計時與過期檢查
  if (self.dinaCurrentFusionWindow && self.dinaCurrentFusionWindow.isActive) {
    if (matchTime >= self.dinaCurrentFusionWindow.endTime || self.dinaCurrentFusionWindow.used) {
      self.dinaCurrentFusionWindow.isActive = false;
      self.dinaDarkLightState = 'EMPTY';
      self.dinaPerfectAbsorb = false;
    }
  }

  // 8. 被動三【三相融合 (Tri-Phase Fusion)】
  // 觸發條件：在融合窗口開啟期間，場上存在另一個可用白光能量，且蒂納與敵方距離 ≤ 320px
  if (
    self.hp > 0 &&
    target.hp > 0 &&
    self.dinaCurrentFusionWindow &&
    self.dinaCurrentFusionWindow.isActive &&
    !self.dinaCurrentFusionWindow.used &&
    !self.isProcessingFusion
  ) {
    const fusionWhite = self.dinaWhiteEnergies.find(e => e.state === 'AVAILABLE' && !e.consumed);
    if (fusionWhite && distToTarget <= 320) {
      self.isProcessingFusion = true;

      fusionWhite.state = 'RESERVED_FOR_FUSION';
      fusionWhite.state = 'CONSUMED';
      fusionWhite.consumed = true;

      self.dinaCurrentFusionWindow.used = true;
      self.dinaCurrentFusionWindow.isActive = false;
      self.dinaDarkLightState = 'EMPTY';

      const isPerfect = !!self.dinaCurrentFusionWindow.isPerfect;

      // 發射三相融合光球（射程 340px，速度 420px/s）
      const aimAngle = Math.atan2(target.y - self.y, target.x - self.x);
      const speed = 420; // v2.6: 提升彈道速度 (360 -> 420)
      const launchDist = self.radius + 8;
      const launchX = self.x + Math.cos(aimAngle) * launchDist;
      const launchY = self.y + Math.sin(aimAngle) * launchDist;
      const maxRange = 340;
      const lifeTime = maxRange / speed;

      projectiles.push({
        id: `proj_dina_fusion_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ownerId: self.id,
        type: 'dina_fusion_orb',
        x: launchX,
        y: launchY,
        vx: Math.cos(aimAngle) * speed,
        vy: Math.sin(aimAngle) * speed,
        radius: 10,
        damage: isPerfect ? 48 : 28, // v2.6: 48/28 (buffed from 26/15)
        life: lifeTime,
        maxLife: lifeTime,
        color: '#d946ef',
        dinaFusionType: isPerfect ? 'perfect' : 'regular',
        trail: []
      });

      soundEngine.playDinaFusion(isPerfect);

      // 蒂納 - 融合光球生成時：雙色對應閃爍粒子群爆發 (白光與紫暗光雙極匯流交融，零卡頓)
      const spawnCount = isPerfect ? 20 : 14;
      for (let i = 0; i < spawnCount; i++) {
        const a = (i / spawnCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const spd = 60 + Math.random() * 90;
        const isWhite = i % 2 === 0;
        particles.push({
          x: launchX,
          y: launchY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.4 + Math.random() * 1.4,
          color: isWhite ? '#ffffff' : (isPerfect ? '#f43f5e' : (Math.random() > 0.5 ? '#c084fc' : '#e879f9')),
          alpha: 1.0,
          maxLife: 0.36 + Math.random() * 0.1,
          life: 0.36 + Math.random() * 0.1,
          type: 'dina_fusion_spawn_spark',
          angle: a,
          spin: (Math.random() - 0.5) * 8
        });
      }

      fctList.push({
        id: `fct_fusion_cast_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 14,
        text: isPerfect ? '【完美】三相融合爆發！' : '三相融合發動！',
        color: isPerfect ? '#f43f5e' : '#d946ef',
        fontSize: 13,
        scale: 1.25,
        alpha: 1.0,
        life: 0.85,
        maxLife: 0.85,
        vy: -22
      });

      events.push({
        id: `evt_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: isPerfect ? '完美三相融合' : '三相融合',
        text: `${self.name} 匯聚黑白光刃，觸發【${isPerfect ? '完美三相融合' : '三相融合'}】向 ${target.name} 轟出融合光球！`,
        badge: isPerfect ? '完美融合' : '三相融合'
      });

      self.isProcessingFusion = false;
      self.dinaPerfectAbsorb = false;
    }
  }
}

/**
 * 劍仙 (Jianxian) - 被動一【白劍爆裂】範圍爆炸結算
 * 到達 420px 最大射程或命中敵人時，在當前位置產生 70px 小範圍爆炸，造成 2.5 點魔法傷害
 * 同一次爆炸對同一敵人僅能造成一次傷害
 */
function triggerJianxianBurstExplosion(
  proj: Projectile,
  owner: BallState,
  b1: BallState,
  b2: BallState,
  matchTime: number,
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  const explodeRadius = 70;
  const burstDmg = 14; // v2.6: Buffed to 14 (from 6.5)

  soundEngine.playJianxianSwordBurst();

  // 1. 爆炸仙環衝擊波 (70px 仙靈銀白光環)
  particles.push({
    x: proj.x,
    y: proj.y,
    vx: 0,
    vy: 0,
    radius: explodeRadius,
    color: '#ffffff',
    alpha: 0.95,
    maxLife: 0.32,
    life: 0.32,
    type: 'jianxian_burst_ring'
  });

  // 2. 仙劍爆散星芒群 (銀白與淡青靈光)
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const spd = 60 + Math.random() * 120;
    particles.push({
      x: proj.x,
      y: proj.y,
      vx: Math.cos(a) * spd,
      vy: Math.sin(a) * spd,
      radius: 2.2 + Math.random() * 1.5,
      color: Math.random() > 0.4 ? '#ffffff' : '#38bdf8',
      alpha: 1.0,
      maxLife: 0.36,
      life: 0.36,
      type: 'jianxian_burst_spark'
    });
  }

  // 3. 判定 70px 範圍內所有敵方球體
  const potentialTargets = [b1, b2].filter(b => b.id !== owner.id && b.hp > 0);

  for (const t of potentialTargets) {
    const distToCenter = Math.hypot(t.x - proj.x, t.y - proj.y);
    if (distToCenter <= explodeRadius + t.radius) {
      applyDamageWithDamageSharing(
        t,
        owner,
        burstDmg,
        'magic',
        '白劍爆裂',
        proj.x,
        proj.y,
        matchTime,
        fctList,
        events,
        particles
      );

      t.hitsReceived++;
      t.hitFlashTimer = 0.3;

      fctList.push({
        id: `fct_jx_burst_${Math.random()}`,
        x: t.x,
        y: t.y - t.radius - 12,
        text: `-${burstDmg} 白劍爆裂`,
        color: '#f0f9ff',
        fontSize: 12,
        scale: 1.25,
        alpha: 1.0,
        life: 0.8,
        maxLife: 0.8,
        vy: -22,
        damageType: 'magic',
        damageValue: burstDmg
      });

      events.push({
        id: `evt_jx_burst_hit_${Math.random()}`,
        timestamp: matchTime,
        type: 'projectile_hit',
        attackerId: owner.id,
        targetId: t.id,
        damage: burstDmg,
        skillName: '白劍爆裂',
        text: `${owner.name} 的【白劍爆裂】在 ${t.name} 身邊引爆 70px 劍氣波，造成 2.5 點魔法傷害！`,
        badge: '白劍爆裂'
      });
    }
  }
}

/**
 * 劍仙 (Jianxian) - 完整被動技能主循環
 * 包含：
 * 1. 仙靈白劍旋轉環繞與狀態冷卻倒數
 * 2. 被動一【白劍爆裂】：每3秒自動向最近有效敵人方向射出一把非指定性白色仙劍（420px射程、70px爆炸、2.5魔傷）
 * 3. 被動二【退劍緩行】：敵人逼近危險距離(115px)時，自動反向位移140px，並直線射出緩速仙劍(2魔傷+降速25%持續2s，CD 7.6s)
 * 4. 被動三【百萬劍陣】：身後三把大型仙劍守護10秒，每0.1秒出白色劍氣，受每秒3.5魔傷及10秒共35傷上限克制，結束後CD 30s
 */
export function updateJianxianPassiveSkills(
  self: BallState,
  target: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 緩速持續時間計時器 (Target or Self)
  if (self.isSlowedByJianxian) {
    self.slowedByJianxianTimer = (self.slowedByJianxianTimer || 0) - dt;
    if (self.slowedByJianxianTimer <= 0) {
      self.isSlowedByJianxian = false;
      self.slowedByJianxianTimer = 0;
    }
  }

  // 非劍仙角色不執行後續專屬技能
  if (self.characterId !== 'jianxian' || self.hp <= 0) return;

  // 1. 仙靈白劍外觀環繞角度自轉
  self.jianxianOrbitSwordAngle = ((self.jianxianOrbitSwordAngle || 0) + dt * 2.8) % (Math.PI * 2);

  // 位移殘影計時器倒數
  if ((self.jianxianRetreatAnimTimer || 0) > 0) {
    self.jianxianRetreatAnimTimer = Math.max(0, (self.jianxianRetreatAnimTimer || 0) - dt);
  }

  const hasValidEnemy = !!target && target.hp > 0;
  const dx = hasValidEnemy ? target.x - self.x : 0;
  const dy = hasValidEnemy ? target.y - self.y : 0;
  const distToEnemy = hasValidEnemy ? Math.hypot(dx, dy) : 9999;

  // 2. 被動一【白劍爆裂】(每 3 秒自動向最近敵人發射)
  self.jianxianBurstSwordCooldown = (self.jianxianBurstSwordCooldown ?? 0.5) - dt;
  if (self.jianxianBurstSwordCooldown <= 0) {
    if (hasValidEnemy && distToEnemy > 1) {
      const aimDirX = dx / distToEnemy;
      const aimDirY = dy / distToEnemy;
      const swordSpeed = 460; // v2.6: 提升彈道速度 (380 -> 460)
      const spawnDist = self.radius + 8;

      projectiles.push({
        id: `proj_jx_burst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ownerId: self.id,
        type: 'jianxian_burst_sword',
        x: self.x + aimDirX * spawnDist,
        y: self.y + aimDirY * spawnDist,
        vx: aimDirX * swordSpeed,
        vy: aimDirY * swordSpeed,
        radius: 6,
        damage: 14, // v2.6: 14 damage (buffed from 6.5)
        damageType: 'magic',
        life: 420 / swordSpeed + 0.1,
        maxLife: 420 / swordSpeed + 0.1,
        traveledDist: 0,
        maxDistance: 420,
        color: '#ffffff',
        trail: []
      });

      soundEngine.playJianxianWhiteSwordLaunch();

      // 發射口仙氣流光微粒
      for (let i = 0; i < 8; i++) {
        const a = Math.atan2(aimDirY, aimDirX) + (Math.random() - 0.5) * 0.8;
        const spd = 40 + Math.random() * 80;
        particles.push({
          x: self.x + aimDirX * spawnDist,
          y: self.y + aimDirY * spawnDist,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 1.8 + Math.random() * 1.2,
          color: Math.random() > 0.4 ? '#ffffff' : '#bae6fd',
          alpha: 0.9,
          maxLife: 0.25,
          life: 0.25,
          type: 'jianxian_burst_spark'
        });
      }

      self.passive1Triggers = (self.passive1Triggers || 0) + 1;
      self.jianxianBurstSwordCooldown = 2.5; // v2.6: +0.5s CD (2.0s -> 2.5s)

      events.push({
        id: `evt_jx_p1_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '白劍爆裂',
        text: `${self.name} 祭出仙靈白劍，向 ${target.name} 激射而出（射程 420px）！`,
        badge: '白劍爆裂'
      });
    } else {
      self.jianxianBurstSwordCooldown = 0.5;
    }
  }

  // 3. 被動二【退劍緩行】(危險距離 115px 自動後撤 140px 並射出緩速仙劍，CD 7.6s)
  self.jianxianRetreatCooldown = Math.max(0, (self.jianxianRetreatCooldown ?? 0) - dt);
  if (self.jianxianRetreatCooldown <= 0 && hasValidEnemy && distToEnemy <= 115 && distToEnemy > 1) {
    // 遠離敵人的方向
    const retreatDirX = -dx / distToEnemy;
    const retreatDirY = -dy / distToEnemy;
    const towardsEnemyDirX = dx / distToEnemy;
    const towardsEnemyDirY = dy / distToEnemy;

    const shiftDistance = 140;
    const startX = self.x;
    const startY = self.y;

    // 計算位移後的新座標，嚴格約束在場地牆體內（不得穿牆）
    const padding = self.radius + 15;
    let endX = startX + retreatDirX * shiftDistance;
    let endY = startY + retreatDirY * shiftDistance;
    endX = Math.max(padding, Math.min(ARENA_WIDTH - padding, endX));
    endY = Math.max(padding, Math.min(ARENA_HEIGHT - padding, endY));

    // 沿位移路徑產生仙影殘痕
    const trailSteps = 8;
    for (let s = 0; s <= trailSteps; s++) {
      const frac = s / trailSteps;
      const px = startX + (endX - startX) * frac;
      const py = startY + (endY - startY) * frac;
      particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        radius: 2.2,
        color: '#38bdf8',
        alpha: 0.75 * (1 - frac * 0.5),
        maxLife: 0.35,
        life: 0.35,
        type: 'jianxian_slow_frost'
      });
    }

    self.x = endX;
    self.y = endY;
    self.vx = retreatDirX * 120;
    self.vy = retreatDirY * 120;
    self.jianxianRetreatAnimTimer = 0.45;

    // 同時沿位移前的敵人方向直線射出一把非追蹤緩速仙劍
    const slowSwordSpeed = 420;
    projectiles.push({
      id: `proj_jx_slow_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ownerId: self.id,
      type: 'jianxian_slow_sword',
      x: self.x,
      y: self.y,
      vx: towardsEnemyDirX * slowSwordSpeed,
      vy: towardsEnemyDirY * slowSwordSpeed,
      radius: 6,
      damage: 5.5,
      damageType: 'magic',
      life: 1.5,
      maxLife: 1.5,
      color: '#38bdf8',
      trail: []
    });

    soundEngine.playJianxianRetreat();

    fctList.push({
      id: `fct_jx_retreat_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 12,
      text: '仙影凌波・退劍緩行',
      color: '#38bdf8',
      fontSize: 12,
      scale: 1.2,
      alpha: 1.0,
      life: 0.8,
      maxLife: 0.8,
      vy: -20
    });

    events.push({
      id: `evt_jx_p2_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      skillName: '退劍緩行',
      text: `${self.name} 感應近身危機，施展【退劍緩行】凌波後撤 140px 並反手射出寒霜仙劍！`,
      badge: '退劍緩行'
    });

    self.passive2Triggers = (self.passive2Triggers || 0) + 1;
    self.jianxianRetreatCooldown = 4.8;
  }

  // 4. 被動三【百萬劍陣】(守護劍陣10秒，每0.1秒出劍氣，每秒上限7.0魔傷，10秒上限70魔傷，CD 18秒)
  if (!self.jianxianArrayActive) {
    self.jianxianArrayCooldown = Math.max(0, (self.jianxianArrayCooldown ?? 0) - dt);
    if (self.jianxianArrayCooldown <= 0 && hasValidEnemy) {
      self.jianxianArrayActive = true;
      self.jianxianArrayDuration = 10.0;
      self.jianxianArrayFireTimer = 0;
      self.jianxianArraySecTimer = 0;
      self.jianxianArraySecDamage = 0;
      self.jianxianArrayTotalDamage = 0;

      soundEngine.playJianxianMillionArrayActivate();

      // 劍陣啟動神聖光環微粒
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const spd = 50 + Math.random() * 80;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 1.5,
          color: i % 2 === 0 ? '#ffffff' : '#38bdf8',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'jianxian_burst_ring'
        });
      }

      fctList.push({
        id: `fct_jx_array_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 14,
        text: '百萬劍陣・守護降臨！',
        color: '#38bdf8',
        fontSize: 13,
        scale: 1.3,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -22
      });

      events.push({
        id: `evt_jx_p3_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '百萬劍陣',
        text: `${self.name} 展開【百萬劍陣】！身後三柄巨型仙劍護體，萬道劍氣傾瀉而出（持續10秒）！`,
        badge: '百萬劍陣'
      });

      self.passive3Triggers = (self.passive3Triggers || 0) + 1;
    }
  } else {
    // 劍陣處於啟動狀態
    self.jianxianArrayDuration = Math.max(0, (self.jianxianArrayDuration ?? 0) - dt);

    // 1秒滑動窗口重置計時器 (每秒傷害上限7.0)
    self.jianxianArraySecTimer = (self.jianxianArraySecTimer || 0) + dt;
    if (self.jianxianArraySecTimer >= 1.0) {
      self.jianxianArraySecTimer -= 1.0;
      self.jianxianArraySecDamage = 0;
    }

    // 每 0.1 秒向不同角度射出白色劍氣
    self.jianxianArrayFireTimer = (self.jianxianArrayFireTimer || 0) + dt;
    if (self.jianxianArrayFireTimer >= 0.1) {
      self.jianxianArrayFireTimer -= 0.1;

      if (hasValidEnemy && (self.jianxianArrayTotalDamage || 0) < 115.0) {
        const baseAngle = Math.atan2(dy, dx);
        const spreadAngle = (Math.random() - 0.5) * 0.5; // 輕微擴散扇形
        const qiAngle = baseAngle + spreadAngle;
        const qiSpeed = 520; // v2.6: 提升彈道速度 (460 -> 520)
        const spawnDist = self.radius + 10;

        projectiles.push({
          id: `proj_jx_qi_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ownerId: self.id,
          type: 'jianxian_sword_qi',
          x: self.x + Math.cos(qiAngle) * spawnDist,
          y: self.y + Math.sin(qiAngle) * spawnDist,
          vx: Math.cos(qiAngle) * qiSpeed,
          vy: Math.sin(qiAngle) * qiSpeed,
          radius: 3.5,
          damage: 1.4, // v2.6: 1.4 damage (buffed from 0.7)
          damageType: 'magic',
          life: 0.85,
          maxLife: 0.85,
          color: '#e0f2fe',
          trail: []
        });

        soundEngine.playJianxianSwordQi();
      }
    }

    // 劍陣10秒持續時間結束
    if (self.jianxianArrayDuration <= 0) {
      self.jianxianArrayActive = false;
      self.jianxianArrayDuration = 0;
      self.jianxianArrayCooldown = 15.0; // v2.6: 15s CD (from 18s)

      fctList.push({
        id: `fct_jx_array_end_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 12,
        text: '百萬劍陣收束 (CD 15s)',
        color: '#94a3b8',
        fontSize: 11,
        scale: 1.0,
        alpha: 0.85,
        life: 0.7,
        maxLife: 0.7,
        vy: -15
      });
    }
  }
}

/**
 * 龍神 (Longshen) 高傷害戰士核心技能邏輯：
 * 被動一【龍搖】:
 *   - 自動鎖定 240px 內最近敵人，神速俯衝 (620px/s)。俯衝期間神龍霸體完全免疫碰撞反噬傷害。
 *   - 命中造成 28 點高額物理爆發傷害 + 目標最大生命值 4% 破防穿透打擊。
 *   - 附加 20% 減速 (2秒) 與【龍威壓制】(3秒，使目標受到龍神傷害提升 20%)。
 *   - 冷卻 5.0 秒 (真龍形態下 3.8 秒)。
 * 被動二【龍普】:
 *   - 敵人進入 160px 近身範圍時揮動狂暴龍爪施展【雙重裂爪】。
 *   - 首爪猛擊 18 點物傷，次爪穿甲撕裂 22 點物傷 (近身瞬間爆發合計 40 點高傷)。
 *   - 若目標帶有【龍威壓制】或【龍炎灼燒】，額外引爆 15 點烈火真傷 (最高 55 點極限爆發)。
 *   - 冷卻 3.2 秒 (真龍形態下 2.4 秒)。
 * 被動三【龍炎】:
 *   - 觸發前 0.5 秒展開扇形半透明紅色預警，隨後噴射 90度扇形、240px 射程滅世龍息 (持續 2.2 秒)。
 *   - 每 0.25 秒造成 8 點火焰傷害 (每秒上限 32 點，持續期間全中高達 64 點高傷)。
 *   - 140px 內核高溫額外附加 2 點融甲真傷，並持續刷新目標【龍炎灼燒】狀態。
 *   - 結束後冷卻 8.5 秒。
 * 被動四【龍身】:
 *   - 覺醒飛行神龍真形持續 10 秒！變身瞬間釋放天地龍吟，對周圍 240px 敵人造成 40 點神威爆發傷害。
 *   - 移動速度大幅提升 +40% (達 133% 疾速空優)，普通碰撞附加 12 點神龍威能 (合計 22 點物傷)。
 *   - 展開 160px「真龍焚滅領域」，每 0.5 秒降下龍炎造成 9 點火焰傷害 (10秒上限提升至 150 點)。
 *   - 全技能冷卻加速 25%，結束後冷卻 24 秒。
 */
export function updateLongshenPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'longshen' || self.hp <= 0) return;

  // 狀態效果計時器衰減 (龍威壓制、龍威減速、龍炎灼燒)
  if (self.longshenAweTimer && self.longshenAweTimer > 0) self.longshenAweTimer = Math.max(0, self.longshenAweTimer - dt);
  if (self.longshenSlowTimer && self.longshenSlowTimer > 0) self.longshenSlowTimer = Math.max(0, self.longshenSlowTimer - dt);
  if (self.longshenBurnTimer && self.longshenBurnTimer > 0) self.longshenBurnTimer = Math.max(0, self.longshenBurnTimer - dt);

  if (enemy.longshenAweTimer && enemy.longshenAweTimer > 0) enemy.longshenAweTimer = Math.max(0, enemy.longshenAweTimer - dt);
  if (enemy.longshenSlowTimer && enemy.longshenSlowTimer > 0) enemy.longshenSlowTimer = Math.max(0, enemy.longshenSlowTimer - dt);
  if (enemy.longshenBurnTimer && enemy.longshenBurnTimer > 0) enemy.longshenBurnTimer = Math.max(0, enemy.longshenBurnTimer - dt);

  // 收集有效目標列表 (對手主球 + 存活的分身/結晶/晶球)
  const validTargets: { id: string; x: number; y: number; radius: number; targetRef: any }[] = [];
  if (enemy.hp > 0) {
    validTargets.push({ id: enemy.id, x: enemy.x, y: enemy.y, radius: enemy.radius, targetRef: enemy });
  }
  if (enemy.clones) {
    for (const c of enemy.clones) {
      if (c.hp > 0) {
        validTargets.push({ id: c.id, x: c.x, y: c.y, radius: c.radius, targetRef: c });
      }
    }
  }
  if (enemy.lanzuanOrb && enemy.lanzuanOrb.hp > 0) {
    validTargets.push({ id: enemy.lanzuanOrb.id, x: enemy.lanzuanOrb.x, y: enemy.lanzuanOrb.y, radius: enemy.lanzuanOrb.radius, targetRef: enemy.lanzuanOrb });
  }
  if (enemy.baizuanClone && enemy.baizuanClone.hp > 0) {
    validTargets.push({ id: enemy.baizuanClone.id, x: enemy.baizuanClone.x, y: enemy.baizuanClone.y, radius: enemy.baizuanClone.radius, targetRef: enemy.baizuanClone });
  }
  const hasValidEnemy = validTargets.length > 0;

  // 真龍形態下冷卻速度加快 25% (dt * 1.25)
  const effectiveCdDt = self.longshenFormActive ? dt * 1.25 : dt;

  // 1. 被動一【龍搖】(5.0秒CD，240px神速俯衝，28物傷+4%最大生命破防穿透，命中施加龍威壓制+20%增傷與減速)
  if (!self.longshenSwoopActive) {
    self.longshenSwoopCooldown = Math.max(0, (self.longshenSwoopCooldown ?? 0) - effectiveCdDt);
    if (self.longshenSwoopCooldown <= 0 && hasValidEnemy) {
      let nearestTarget: { id: string; x: number; y: number; radius: number; targetRef: any } | null = null;
      let minDist = 9999;
      for (const t of validTargets) {
        const d = Math.hypot(t.x - self.x, t.y - self.y);
        if (d < minDist) {
          minDist = d;
          nearestTarget = t;
        }
      }

      if (nearestTarget && minDist <= 240) {
        const dirLen = Math.hypot(nearestTarget.x - self.x, nearestTarget.y - self.y) || 1;
        const dirX = (nearestTarget.x - self.x) / dirLen;
        const dirY = (nearestTarget.y - self.y) / dirLen;

        self.longshenSwoopActive = true;
        self.longshenSwoopCooldown = 5.8; // v2.6: +0.8s CD (5.0s -> 5.8s)
        self.longshenSwoopStartX = self.x;
        self.longshenSwoopStartY = self.y;
        self.longshenSwoopDirX = dirX;
        self.longshenSwoopDirY = dirY;
        self.longshenSwoopDistTraveled = 0;
        self.longshenSwoopHitEnemyIds = [];

        const swoopSpeed = 620;
        self.vx = dirX * swoopSpeed;
        self.vy = dirY * swoopSpeed;

        soundEngine.playLongshenSwoop();

        for (let i = 0; i < 18; i++) {
          const a = Math.atan2(dirY, dirX) + Math.PI + (Math.random() - 0.5) * 1.2;
          const spd = 50 + Math.random() * 110;
          particles.push({
            x: self.x,
            y: self.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 3.0 + Math.random() * 2.5,
            color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
            alpha: 0.95,
            maxLife: 0.4,
            life: 0.4,
            type: 'longshen_flame_particle'
          });
        }

        fctList.push({
          id: `fct_ls_swoop_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 14,
          text: '龍搖・神速俯衝！',
          color: '#f59e0b',
          fontSize: 13,
          scale: 1.25,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -22
        });

        events.push({
          id: `evt_ls_p1_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '龍搖',
          text: `${self.name} 怒嘯破空，施展【龍搖】神速俯衝 240px 疾襲目標！`,
          badge: '龍搖'
        });

        self.passive1Triggers = (self.passive1Triggers || 0) + 1;
      }
    }
  } else {
    const stepDist = Math.hypot(self.vx, self.vy) * dt;
    self.longshenSwoopDistTraveled = (self.longshenSwoopDistTraveled || 0) + stepDist;

    // 飛行俯衝烈焰軌跡
    particles.push({
      x: self.x,
      y: self.y,
      vx: (Math.random() - 0.5) * 20 - (self.longshenSwoopDirX || 0) * 50,
      vy: (Math.random() - 0.5) * 20 - (self.longshenSwoopDirY || 0) * 50,
      radius: 3.5 + Math.random() * 2.5,
      color: '#f97316',
      alpha: 0.85,
      maxLife: 0.3,
      life: 0.3,
      type: 'longshen_flame_particle'
    });

    let hitOccurred = false;
    self.longshenSwoopHitEnemyIds = self.longshenSwoopHitEnemyIds || [];
    for (const t of validTargets) {
      const hitDist = Math.hypot(t.x - self.x, t.y - self.y);
      if (hitDist <= self.radius + t.radius) {
        if (!self.longshenSwoopHitEnemyIds.includes(t.id)) {
          self.longshenSwoopHitEnemyIds.push(t.id);

          // 基礎爆發 28 點物傷 + 4% 目標最大生命破防傷害 (對召喚物上限25)
          const targetMaxHp = t.targetRef.maxHp || 500;
          const hpPierce = Math.min(25, Math.max(4, Math.round(targetMaxHp * 0.04)));
          const totalSwoopDmg = 28 + hpPierce;

          applyDamageWithDamageSharing(
            t.targetRef,
            self,
            totalSwoopDmg,
            'physical',
            '【龍搖】神速俯衝物理破防爆發',
            t.x,
            t.y,
            matchTime,
            fctList,
            events,
            particles
          );

          // 施加【龍威壓制】(3秒內承受龍神傷害提升20%) 與【減速】(2秒內移動速度降低20%)
          t.targetRef.longshenAweTimer = 3.0;
          t.targetRef.longshenSlowTimer = 2.0;

          fctList.push({
            id: `fct_ls_awe_${Math.random()}`,
            x: t.x,
            y: t.y - t.radius - 28,
            text: '龍威壓制 (+20%傷害)',
            color: '#fbbf24',
            fontSize: 12,
            scale: 1.15,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -18
          });

          soundEngine.playLongshenStrike();

          // 命中衝擊波
          particles.push({
            x: t.x,
            y: t.y,
            vx: 0,
            vy: 0,
            radius: 46,
            color: '#ef4444',
            alpha: 0.95,
            maxLife: 0.35,
            life: 0.35,
            type: 'shockwave'
          });

          for (let i = 0; i < 16; i++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 70 + Math.random() * 110;
            particles.push({
              x: t.x,
              y: t.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              radius: 2.5 + Math.random() * 2,
              color: '#fef08a',
              alpha: 1.0,
              maxLife: 0.4,
              life: 0.4,
              type: 'longshen_strike_claw'
            });
          }

          hitOccurred = true;
          break;
        }
      }
    }

    if (hitOccurred || (self.longshenSwoopDistTraveled || 0) >= 240) {
      self.longshenSwoopActive = false;
      self.longshenSwoopDistTraveled = 0;
      self.vx *= 0.35;
      self.vy *= 0.35;
    }
  }

  // 2. 被動二【龍普】(3.2秒CD，160px近身雙重裂爪 18+22=40點物傷，若有龍威或灼燒額外引爆15真傷，近身極限55點高傷)
  self.longshenStrikeAnimTimer = Math.max(0, (self.longshenStrikeAnimTimer ?? 0) - dt);
  self.longshenStrikeCooldown = Math.max(0, (self.longshenStrikeCooldown ?? 0) - effectiveCdDt);
  if (self.longshenStrikeCooldown <= 0 && hasValidEnemy) {
    let inRangeTarget: { id: string; x: number; y: number; radius: number; targetRef: any } | null = null;
    let closestDist = 9999;
    for (const t of validTargets) {
      const d = Math.hypot(t.x - self.x, t.y - self.y);
      if (d <= 160 && d < closestDist) {
        closestDist = d;
        inRangeTarget = t;
      }
    }

    if (inRangeTarget) {
      self.longshenStrikeCooldown = 3.2;
      self.longshenStrikeAnimTimer = 0.35;
      self.longshenStrikeTargetX = inRangeTarget.x;
      self.longshenStrikeTargetY = inRangeTarget.y;

      // 第一段爪芒: 18 點物理傷害
      applyDamageWithDamageSharing(
        inRangeTarget.targetRef,
        self,
        18,
        'physical',
        '【龍普】首爪猛烈撕裂',
        inRangeTarget.x,
        inRangeTarget.y,
        matchTime,
        fctList,
        events,
        particles
      );

      // 第二段爪芒: 22 點穿甲撕裂物理傷害 (合計 40 點物傷)
      applyDamageWithDamageSharing(
        inRangeTarget.targetRef,
        self,
        22,
        'physical',
        '【龍普】二段穿甲裂爪',
        inRangeTarget.x,
        inRangeTarget.y,
        matchTime,
        fctList,
        events,
        particles
      );

      // 狂暴傷口引爆: 若目標受龍威壓制或灼燒狀態，額外引爆 15 點烈火暴擊真實傷害！
      const hasCondition = (inRangeTarget.targetRef.longshenAweTimer && inRangeTarget.targetRef.longshenAweTimer > 0) ||
        (inRangeTarget.targetRef.longshenBurnTimer && inRangeTarget.targetRef.longshenBurnTimer > 0) ||
        self.longshenFlameActive;

      if (hasCondition) {
        applyDamageWithDamageSharing(
          inRangeTarget.targetRef,
          self,
          15,
          'true',
          '【龍普】狂暴傷口引爆真傷',
          inRangeTarget.x,
          inRangeTarget.y,
          matchTime,
          fctList,
          events,
          particles
        );

        fctList.push({
          id: `fct_ls_explode_${Math.random()}`,
          x: inRangeTarget.x,
          y: inRangeTarget.y - inRangeTarget.radius - 28,
          text: '烈火引爆 +15 真傷！',
          color: '#fbbf24',
          fontSize: 13,
          scale: 1.25,
          alpha: 1.0,
          life: 0.85,
          maxLife: 0.85,
          vy: -20
        });

        soundEngine.playFireBurst();
      }

      soundEngine.playLongshenStrike();

      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 50 + Math.random() * 85;
        particles.push({
          x: inRangeTarget.x,
          y: inRangeTarget.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.2 + Math.random() * 2,
          color: i % 2 === 0 ? '#facc15' : '#ef4444',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'longshen_strike_claw'
        });
      }

      events.push({
        id: `evt_ls_p2_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '龍普',
        text: `${self.name} 揮動狂暴龍爪施展【雙重裂爪】，造成 40 點近身物理打擊${hasCondition ? ' 並引爆 15 點烈火真傷' : ''}！`,
        badge: '龍普'
      });

      self.passive2Triggers = (self.passive2Triggers || 0) + 1;
    }
  }

  // 3. 被動三【龍炎】(8.5秒CD，持續2.2秒，90度扇形，最大半徑240px，每0.25秒8點火傷，滿額64火傷+內核融甲真傷)
  if (!self.longshenFlameActive) {
    self.longshenFlameCooldown = Math.max(0, (self.longshenFlameCooldown ?? 0) - effectiveCdDt);
    if (self.longshenFlameCooldown <= 0 && hasValidEnemy) {
      let flameTarget: { id: string; x: number; y: number; radius: number; targetRef: any } | null = null;
      let minTargetDist = 9999;
      for (const t of validTargets) {
        const d = Math.hypot(t.x - self.x, t.y - self.y);
        if (d <= 240 && d < minTargetDist) {
          minTargetDist = d;
          flameTarget = t;
        }
      }

      if (flameTarget) {
        self.longshenFlameActive = true;
        self.longshenFlameDuration = 2.2;
        self.longshenFlameAngle = Math.atan2(flameTarget.y - self.y, flameTarget.x - self.x);
        self.longshenFlameDamageDealt = {};
        self.longshenFlameSecDamage = {};
        self.longshenFlameSecTimer = 0;
        self.longshenFlameTickTimer = 0;

        soundEngine.playLongshenFlame();

        fctList.push({
          id: `fct_ls_flame_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 14,
          text: '龍炎・滅世龍息！(64火傷+融甲)',
          color: '#ea580c',
          fontSize: 13,
          scale: 1.3,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -22
        });

        events.push({
          id: `evt_ls_p3_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '龍炎',
          text: `${self.name} 仰天怒哮，朝敵方噴吐 240px 狂暴滅世龍息（滿額 64 火傷＋高溫融甲）！`,
          badge: '龍炎'
        });

        self.passive3Triggers = (self.passive3Triggers || 0) + 1;
      }
    }
  } else {
    self.longshenFlameDuration = Math.max(0, (self.longshenFlameDuration ?? 0) - dt);

    if (hasValidEnemy) {
      const targetAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
      let diff = targetAngle - (self.longshenFlameAngle || 0);
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      self.longshenFlameAngle = (self.longshenFlameAngle || 0) + diff * Math.min(1.0, dt * 7);
    }

    const baseAngle = self.longshenFlameAngle || 0;
    for (let i = 0; i < 4; i++) {
      const coneOffset = (Math.random() - 0.5) * (Math.PI / 2);
      const fireAngle = baseAngle + coneOffset;
      const fireSpeed = 180 + Math.random() * 220;
      particles.push({
        x: self.x + Math.cos(fireAngle) * (self.radius + 6),
        y: self.y + Math.sin(fireAngle) * (self.radius + 6),
        vx: Math.cos(fireAngle) * fireSpeed + (Math.random() - 0.5) * 35,
        vy: Math.sin(fireAngle) * fireSpeed + (Math.random() - 0.5) * 35,
        radius: 3.5 + Math.random() * 3.5,
        color: Math.random() > 0.35 ? '#f97316' : '#ef4444',
        alpha: 0.95,
        maxLife: 0.45,
        life: 0.45,
        type: 'longshen_flame_particle'
      });
    }

    // 滑動窗口重置：每秒傷害上限 32 點
    self.longshenFlameSecTimer = (self.longshenFlameSecTimer || 0) + dt;
    if (self.longshenFlameSecTimer >= 1.0) {
      self.longshenFlameSecTimer -= 1.0;
      self.longshenFlameSecDamage = {};
    }

    self.longshenFlameDamageDealt = self.longshenFlameDamageDealt || {};
    self.longshenFlameSecDamage = self.longshenFlameSecDamage || {};

    // 每 0.25 秒進行一次高頻判定 (持續 2.2 秒共 8 次判定，每次 8 點火傷，滿額 64 點)
    self.longshenFlameTickTimer = (self.longshenFlameTickTimer || 0) + dt;
    if (self.longshenFlameTickTimer >= 0.25) {
      self.longshenFlameTickTimer -= 0.25;

      for (const t of validTargets) {
        const totalDmg = self.longshenFlameDamageDealt[t.id] || 0;
        const secDmg = self.longshenFlameSecDamage[t.id] || 0;

        if (totalDmg < 64.0 && secDmg < 32.0) {
          const distToCenter = Math.hypot(t.x - self.x, t.y - self.y);
          if (distToCenter <= 240) {
            let angDiff = Math.abs(Math.atan2(t.y - self.y, t.x - self.x) - (self.longshenFlameAngle || 0));
            while (angDiff > Math.PI) angDiff = Math.abs(angDiff - Math.PI * 2);

            if (angDiff <= Math.PI / 4) {
              const dmgToDeal = Math.min(8.0, 64.0 - totalDmg, 32.0 - secDmg);
              if (dmgToDeal > 0) {
                self.longshenFlameDamageDealt[t.id] = totalDmg + dmgToDeal;
                self.longshenFlameSecDamage[t.id] = secDmg + dmgToDeal;

                applyDamageWithDamageSharing(
                  t.targetRef,
                  self,
                  dmgToDeal,
                  'flame',
                  '【龍炎】滅世烈焰焚燒',
                  t.x,
                  t.y,
                  matchTime,
                  fctList,
                  events,
                  particles
                );

                // 核心高溫融甲真傷：若目標處於 140px 內核心範圍內，每次判定額外附加 2 點融甲真傷
                if (distToCenter <= 140) {
                  applyDamageWithDamageSharing(
                    t.targetRef,
                    self,
                    2,
                    'true',
                    '【龍炎】核爆高溫融甲',
                    t.x,
                    t.y,
                    matchTime,
                    fctList,
                    events,
                    particles
                  );
                }

                // 刷新目標灼燒計時器 (持續 2.5 秒，為龍普提供引爆條件)
                t.targetRef.longshenBurnTimer = 2.5;

                soundEngine.playLongshenFlame();
              }
            }
          }
        }
      }
    }

    if (self.longshenFlameDuration <= 0) {
      self.longshenFlameActive = false;
      self.longshenFlameCooldown = 9.5; // v2.6: +1.0s CD (8.5s -> 9.5s)
    }
  }

  // 4. 被動四【龍身】(24秒CD，持續10秒，瞬間天地龍吟40點神威爆發，160px焚滅領域每0.5秒9點火傷上限150點，+40%速度，普通碰撞+12物傷)
  if (!self.longshenFormActive) {
    self.longshenFormCooldown = Math.max(0, (self.longshenFormCooldown ?? 0) - dt);
    if (self.longshenFormCooldown <= 0 && hasValidEnemy) {
      self.longshenFormActive = true;
      self.longshenFormDuration = 10.0;
      self.longshenFormWingPhase = 0;
      self.longshenFormDamageDealt = {};
      self.longshenFormTickTimer = 0;

      soundEngine.playLongshenFormActivate();

      // 變身瞬間：天地龍吟神威爆發，對周圍 240px 所有敵對目標造成 40 點神威爆發傷害！
      for (const t of validTargets) {
        const d = Math.hypot(t.x - self.x, t.y - self.y);
        if (d <= 240) {
          applyDamageWithDamageSharing(
            t.targetRef,
            self,
            40,
            'physical',
            '【真龍降世】天地龍吟爆發',
            t.x,
            t.y,
            matchTime,
            fctList,
            events,
            particles
          );
        }
      }

      // 天地震波與赤金環形火浪
      particles.push({
        x: self.x,
        y: self.y,
        vx: 0,
        vy: 0,
        radius: 70,
        color: '#fbbf24',
        alpha: 0.95,
        maxLife: 0.45,
        life: 0.45,
        type: 'shockwave'
      });

      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const spd = 70 + Math.random() * 110;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 3.5 + Math.random() * 2.5,
          color: i % 2 === 0 ? '#fbbf24' : '#ef4444',
          alpha: 1.0,
          maxLife: 0.5,
          life: 0.5,
          type: 'longshen_form_aura_particle'
        });
      }

      fctList.push({
        id: `fct_ls_form_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 18,
        text: '龍身・真龍降世！(+40%速/150領域火傷)',
        color: '#f59e0b',
        fontSize: 14,
        scale: 1.4,
        alpha: 1.0,
        life: 1.1,
        maxLife: 1.1,
        vy: -26
      });

      events.push({
        id: `evt_ls_p4_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        skillName: '龍身',
        text: `${self.name} 覺醒飛行神龍真形！天地龍吟震懾全場（40 點爆發傷害），展開 160px 焚滅領域（滿額 150 火傷）！`,
        badge: '龍身'
      });

      self.passive4Triggers = (self.passive4Triggers || 0) + 1;
    }
  } else {
    self.longshenFormDuration = Math.max(0, (self.longshenFormDuration ?? 0) - dt);
    self.longshenFormWingPhase = (self.longshenFormWingPhase || 0) + dt * 14;

    if (Math.random() < 0.65) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 160;
      particles.push({
        x: self.x + Math.cos(a) * r,
        y: self.y + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 15,
        vy: -20 - Math.random() * 30,
        radius: 2.5 + Math.random() * 2.5,
        color: '#f59e0b',
        alpha: 0.85,
        maxLife: 0.45,
        life: 0.45,
        type: 'longshen_flame_particle'
      });
    }

    self.longshenFormDamageDealt = self.longshenFormDamageDealt || {};
    self.longshenFormTickTimer = (self.longshenFormTickTimer || 0) + dt;

    // 每 0.5 秒判定一次領域焚滅火傷 (每次 9 點火傷，持續 10 秒上限 150 點)
    if (self.longshenFormTickTimer >= 0.5) {
      self.longshenFormTickTimer -= 0.5;

      for (const t of validTargets) {
        const currentTotal = self.longshenFormDamageDealt[t.id] || 0;
        if (currentTotal < 150) {
          const distToEnemy = Math.hypot(t.x - self.x, t.y - self.y);
          if (distToEnemy <= 160) {
            const dmgToApply = Math.min(9, 150 - currentTotal);
            if (dmgToApply > 0) {
              self.longshenFormDamageDealt[t.id] = currentTotal + dmgToApply;

              applyDamageWithDamageSharing(
                t.targetRef,
                self,
                dmgToApply,
                'flame',
                '【真龍領域】焚滅神威',
                t.x,
                t.y,
                matchTime,
                fctList,
                events,
                particles
              );

              soundEngine.playLongshenFlame();
            }
          }
        }
      }
    }

    if (self.longshenFormDuration <= 0) {
      self.longshenFormActive = false;
      self.longshenFormDuration = 0;
      self.longshenFormCooldown = 24.0;

      fctList.push({
        id: `fct_ls_form_end_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 12,
        text: '龍身真形收束 (CD 24s)',
        color: '#94a3b8',
        fontSize: 11,
        scale: 1.0,
        alpha: 0.85,
        life: 0.7,
        maxLife: 0.7,
        vy: -15
      });
    }
  }
}

/**
 * 蜘蛛 (Zhizhu) - 刺客核心被動連招系統
 * 定位：毒液連招／蛛網控制／召喚追擊／近距離爆發
 * 屬性：毒／自然／物理
 * 
 * 戰鬥核心循環：
 * 掛毒 (被動一: 毒牙印記) → 蛛網限制 (被動二: 獵網束縛) → 小蜘蛛追擊 (被動三: 蛛群獵殺) → 毒液爆發 (被動四: 蛛后毒爆)
 */
export function updateSpiderPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  // 1. 基礎計時器更新 (動畫與冷卻)
  self.spiderVenomFangAnimTimer = Math.max(0, (self.spiderVenomFangAnimTimer ?? 0) - dt);
  self.spiderBurstAnimTimer = Math.max(0, (self.spiderBurstAnimTimer ?? 0) - dt);

  // 減速狀態衰減 (蛛網黏滯)
  if ((self.slowedBySpiderWebTimer ?? 0) > 0) {
    self.slowedBySpiderWebTimer = Math.max(0, (self.slowedBySpiderWebTimer ?? 0) - dt);
    if (self.slowedBySpiderWebTimer <= 0) {
      self.isSlowedBySpiderWeb = false;
    }
  }

  // 蛛毒印記持續時間與每秒跳毒 (被動一：每秒造成 1 點毒素傷害，持續 4 秒)
  if ((self.spiderPoisonMarkTimer ?? 0) > 0) {
    self.spiderPoisonMarkTimer = Math.max(0, (self.spiderPoisonMarkTimer ?? 0) - dt);
    self.spiderPoisonTickTimer = (self.spiderPoisonTickTimer || 0) + dt;

    if (self.spiderPoisonTickTimer >= 1.0) {
      self.spiderPoisonTickTimer -= 1.0;
      const poisonDmg = 2; // v2.6: 2 damage per tick (buffed from 1)

      applyDamageWithDamageSharing(
        self,
        enemy,
        poisonDmg,
        'poison',
        '蛛毒跳毒',
        self.x,
        self.y,
        matchTime,
        fctList,
        events,
        particles
      );

      self.hitsReceived++;
      enemy.damageDealt += poisonDmg;
      self.hitFlashTimer = 0.15;

      soundEngine.playSpiderPoisonTick();

      // 毒素氣泡微粒
      if (particles) {
        particles.push({
          x: self.x + (Math.random() - 0.5) * self.radius,
          y: self.y - self.radius * 0.5,
          vx: (Math.random() - 0.5) * 15,
          vy: -25 - Math.random() * 20,
          radius: 1.8 + Math.random() * 1.2,
          color: '#10b981',
          alpha: 0.9,
          maxLife: 0.35,
          life: 0.35,
          type: 'smoke'
        });
      }

      if (fctList) {
        fctList.push({
          id: `fct_spider_dot_${Math.random()}`,
          x: self.x + (Math.random() - 0.5) * 16,
          y: self.y - self.radius - 12,
          text: '-2 蛛毒',
          color: '#10b981',
          fontSize: 11,
          scale: 1.0,
          alpha: 0.95,
          life: 0.6,
          maxLife: 0.6,
          vy: -18,
          damageType: 'poison',
          damageValue: 2
        });
      }
    }

    if (self.spiderPoisonMarkTimer <= 0) {
      self.spiderHitByMiniCount = 0;
    }
  }

  // 2. 蛛網區域 (Spider Web Zones) 生命期與範圍減速偵測
  if (self.spiderWebZones && self.spiderWebZones.length > 0) {
    for (const zone of self.spiderWebZones) {
      zone.duration -= dt;

      // 檢查敵方球體是否踩入蛛網區域 (直徑 90px -> 半徑 45px)
      if (enemy.hp > 0) {
        const dist = Math.hypot(enemy.x - zone.x, enemy.y - zone.y);
        if (dist <= zone.radius + enemy.radius) {
          enemy.isSlowedBySpiderWeb = true;
          enemy.slowedBySpiderWebTimer = Math.max(enemy.slowedBySpiderWebTimer || 0, 0.4);
        }
      }
    }
    self.spiderWebZones = self.spiderWebZones.filter(z => z.duration > 0);
  }

  // 3. 狂暴小蜘蛛 (Spider Mini Summons) 追擊、咬擊與生命週期更新
  if (self.spiderMiniSummons && self.spiderMiniSummons.length > 0) {
    for (const mini of self.spiderMiniSummons) {
      mini.life -= dt;
      mini.attackCooldown = Math.max(0, (mini.attackCooldown || 0) - dt);

      if (mini.life > 0 && mini.hp > 0 && enemy.hp > 0) {
        // 自動鎖定敵人追擊 (若目標帶有蛛毒印記，狂暴全速追擊)
        const dx = enemy.x - mini.x;
        const dy = enemy.y - mini.y;
        const dist = Math.hypot(dx, dy);
        const hasPoison = (enemy.spiderPoisonMarkTimer ?? 0) > 0;
        const miniSpeed = hasPoison ? 240 : 180;

        if (dist > 8) {
          mini.vx = (dx / dist) * miniSpeed;
          mini.vy = (dy / dist) * miniSpeed;
        }
        mini.x += mini.vx * dt;
        mini.y += mini.vy * dt;
        mini.legPhase = (mini.legPhase || 0) + dt * 18;

        // 競技場邊界約束
        mini.x = Math.max(mini.radius, Math.min(ARENA_WIDTH - mini.radius, mini.x));
        mini.y = Math.max(mini.radius, Math.min(ARENA_HEIGHT - mini.radius, mini.y));

        // 碰觸咬擊
        if (dist <= mini.radius + enemy.radius && mini.attackCooldown <= 0) {
          mini.attackCooldown = 0.8;
          const biteDmg = 2; // 每次咬擊造成 2 點物理傷害
          applyDamageWithDamageSharing(
            enemy,
            self,
            biteDmg,
            'physical',
            '小蜘蛛撕咬',
            mini.x,
            mini.y,
            matchTime,
            fctList,
            events,
            particles
          );

          enemy.hitsReceived++;
          enemy.spiderHitByMiniCount = (enemy.spiderHitByMiniCount || 0) + 1; // 記錄至少攻擊1次

          soundEngine.playSpiderMiniAttack();

          // 撕咬微粒
          if (particles) {
            for (let p = 0; p < 4; p++) {
              const a = Math.random() * Math.PI * 2;
              particles.push({
                x: mini.x,
                y: mini.y,
                vx: Math.cos(a) * 45,
                vy: Math.sin(a) * 45,
                radius: 1.5,
                color: '#34d399',
                alpha: 0.85,
                maxLife: 0.25,
                life: 0.25,
                type: 'smoke'
              });
            }
          }

          if (fctList) {
            fctList.push({
              id: `fct_mini_${Math.random()}`,
              x: enemy.x + (Math.random() - 0.5) * 20,
              y: enemy.y - enemy.radius - 8,
              text: '-2 蛛群撕咬',
              color: '#34d399',
              fontSize: 10,
              scale: 1.0,
              alpha: 1.0,
              life: 0.6,
              maxLife: 0.6,
              vy: -15,
              damageType: 'physical',
              damageValue: 2
            });
          }
        }

        // 碰撞受傷機制 (敵方球體非零碰撞角色衝撞小蜘蛛會對其造成傷害)
        if (dist < mini.radius + enemy.radius) {
          const isEnemyZero = isZeroCollisionDamageRole(enemy.characterId);
          if (!isEnemyZero && (enemy.baseAttack || 10) > 0) {
            const smashDmg = Math.max(2, Math.round((enemy.baseAttack || 10) * 0.4));
            mini.hp -= smashDmg;
            if (mini.hp <= 0 && particles) {
              for (let p = 0; p < 8; p++) {
                const a = Math.random() * Math.PI * 2;
                particles.push({
                  x: mini.x,
                  y: mini.y,
                  vx: Math.cos(a) * 60,
                  vy: Math.sin(a) * 60,
                  radius: 2.0,
                  color: '#10b981',
                  alpha: 0.9,
                  maxLife: 0.3,
                  life: 0.3,
                  type: 'smoke'
                });
              }
            }
          }
        }
      }
    }

    self.spiderMiniSummons = self.spiderMiniSummons.filter(m => m.life > 0 && m.hp > 0);
  }

  // 若不是蜘蛛本體，或者自己已經陣亡，結束技能施放流程
  if (self.characterId !== 'zhizhu' || self.hp <= 0 || enemy.hp <= 0) {
    return;
  }

  const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);

  // 4. 被動一【毒牙印記】(4秒CD，150px 範圍，3點物理傷 + 附加4秒蛛毒印記，每秒1點毒素傷害，完整最高7傷)
  self.spiderVenomFangCooldown = Math.max(0, (self.spiderVenomFangCooldown ?? 0) - dt);
  if (self.spiderVenomFangCooldown <= 0) {
    if (distToEnemy <= 150 + self.radius + enemy.radius) {
      self.spiderVenomFangCooldown = 4.0;
      self.spiderVenomFangAnimTimer = 0.25;

      const directDamage = 3;
      applyDamageWithDamageSharing(
        enemy,
        self,
        directDamage,
        'physical',
        '毒牙印記',
        enemy.x,
        enemy.y,
        matchTime,
        fctList,
        events,
        particles
      );

      enemy.hitsReceived++;
      self.damageDealt += directDamage;
      enemy.hitFlashTimer = 0.2;

      // 附加／刷新「蛛毒印記」4秒 (敵人身上最多存在1層，不疊加，刷新時間)
      enemy.spiderPoisonMarkTimer = 4.0;
      enemy.spiderPoisonTickTimer = 0;
      enemy.spiderPoisonSourceId = self.id;

      soundEngine.playSpiderFang();

      // 毒牙突刺穿透微粒
      if (particles) {
        for (let i = 0; i < 12; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 80;
          particles.push({
            x: enemy.x,
            y: enemy.y,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            radius: 2.0 + Math.random() * 1.5,
            color: Math.random() > 0.3 ? '#10b981' : '#059669',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'smoke'
          });
        }
      }

      if (fctList) {
        fctList.push({
          id: `fct_zhizhu_fang_${Math.random()}`,
          x: enemy.x,
          y: enemy.y - enemy.radius - 12,
          text: '-3 毒牙印記 (蛛毒4s)',
          color: '#10b981',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.8,
          maxLife: 0.8,
          vy: -20,
          damageType: 'physical',
          damageValue: 3
        });
      }

      if (events) {
        events.push({
          id: `evt_zz_p1_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: enemy.id,
          skillName: '毒牙印記',
          text: `${self.name} 發動【毒牙印記】近身突刺 ${enemy.name} 造成 3 點物理傷害，並附加 4 秒蛛毒！`,
          badge: '毒牙印記'
        });
      }

      self.passive1Triggers = (self.passive1Triggers || 0) + 1;
    }
  }

  // 5. 被動二【獵網束縛】(8秒CD，380px 射程噴吐強韌蛛網。命中造成 35% 強效減速持續 2.5 秒，並留下 90px 蛛網區域)
  self.spiderWebCooldown = Math.max(0, (self.spiderWebCooldown ?? 0) - dt);
  if (self.spiderWebCooldown <= 0) {
    if (distToEnemy <= 380 + self.radius + enemy.radius) {
      self.spiderWebCooldown = 8.0;

      // 朝敵方發射黏性蛛網飛彈
      const dx = enemy.x - self.x;
      const dy = enemy.y - self.y;
      const angle = Math.atan2(dy, dx);
      const netSpeed = 380;

      projectiles.push({
        id: `spider_net_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: self.id,
        type: 'spider_web_net',
        x: self.x + Math.cos(angle) * (self.radius + 6),
        y: self.y + Math.sin(angle) * (self.radius + 6),
        vx: Math.cos(angle) * netSpeed,
        vy: Math.sin(angle) * netSpeed,
        radius: 14,
        damage: 2,
        damageType: 'physical',
        life: 1.5,
        maxLife: 1.5,
        color: '#10b981',
        trail: []
      });

      soundEngine.playSpiderWeb();

      if (events) {
        events.push({
          id: `evt_zz_p2_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: enemy.id,
          skillName: '獵網束縛',
          text: `${self.name} 朝 380px 射程內的 ${enemy.name} 噴吐【獵網束縛】！`,
          badge: '獵網束縛'
        });
      }

      self.passive2Triggers = (self.passive2Triggers || 0) + 1;
    }
  }

  // 6. 被動三【蛛群獵殺】(15秒CD，召喚 3 隻敏捷小蜘蛛，8 HP，狂暴追擊敵人；若目標帶有蛛毒印記則全速狂暴圍攻)
  self.spiderSwarmCooldown = Math.max(0, (self.spiderSwarmCooldown ?? 0) - dt);
  if (self.spiderSwarmCooldown <= 0 && enemy.hp > 0) {
    self.spiderSwarmCooldown = 15.0;

    // 召喚 3 隻狂暴小蜘蛛
    if (!self.spiderMiniSummons) self.spiderMiniSummons = [];

    for (let i = 0; i < 3; i++) {
      const spawnAngle = (i / 3) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const offsetDist = self.radius + 14;
      const mini: SpiderMiniSummon = {
        id: `mini_spider_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: self.id,
        x: self.x + Math.cos(spawnAngle) * offsetDist,
        y: self.y + Math.sin(spawnAngle) * offsetDist,
        vx: Math.cos(spawnAngle) * 70,
        vy: Math.sin(spawnAngle) * 70,
        radius: 7,
        hp: 8,
        maxHp: 8,
        life: 10.0,
        maxLife: 10.0,
        attackCooldown: 0.3 + i * 0.2,
        legPhase: i * 2.0
      };
      self.spiderMiniSummons.push(mini);
    }

    soundEngine.playSpiderSwarm();

    // 召喚微粒噴濺
    if (particles) {
      for (let i = 0; i < 15; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 30 + Math.random() * 60;
        particles.push({
          x: self.x,
          y: self.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 1.8,
          color: '#10b981',
          alpha: 0.9,
          maxLife: 0.35,
          life: 0.35,
          type: 'smoke'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_zhizhu_swarm_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 14,
        text: '蛛群獵殺・小蜘蛛×3！',
        color: '#34d399',
        fontSize: 12,
        scale: 1.25,
        alpha: 1.0,
        life: 0.85,
        maxLife: 0.85,
        vy: -22
      });
    }

    if (events) {
      events.push({
        id: `evt_zz_p3_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        skillName: '蛛群獵殺',
        text: `${self.name} 從腹部召喚 3 隻敏捷小蜘蛛（8 HP）圍獵 ${enemy.name}！`,
        badge: '蛛群獵殺'
      });
    }

    self.passive3Triggers = (self.passive3Triggers || 0) + 1;
  }

  // 7. 被動四【蛛后毒爆】(25秒CD，160px 範圍內引爆毒液風暴，造成 10 點劇烈毒素傷害；若目標身上帶有「蛛毒印記」，徹底引爆印記額外造成 8 點穿透真傷，合計 18 點爆發並消除印記！)
  self.spiderBurstCooldown = Math.max(0, (self.spiderBurstCooldown ?? 0) - dt);
  if (self.spiderBurstCooldown <= 0 && distToEnemy <= 160 + self.radius + enemy.radius) {
    self.spiderBurstCooldown = 25.0;
    self.spiderBurstAnimTimer = 0.45;

    const hasPoison = (enemy.spiderPoisonMarkTimer ?? 0) > 0;
    const basePoisonDmg = 10;
    const extraTrueDmg = 8;

    // 1. 造成 10 點劇烈毒素傷害
    applyDamageWithDamageSharing(
      enemy,
      self,
      basePoisonDmg,
      'poison',
      '蛛后毒爆',
      enemy.x,
      enemy.y,
      matchTime,
      fctList,
      events,
      particles
    );

    enemy.hitsReceived++;
    enemy.hitFlashTimer = 0.35;

    // 2. 若目標身上帶有「蛛毒印記」，徹底引爆印記額外造成 8 點穿透真傷並消除印記 (合計 18 點爆發)
    if (hasPoison) {
      enemy.spiderPoisonMarkTimer = 0;
      enemy.spiderHitByMiniCount = 0;

      applyDamageWithDamageSharing(
        enemy,
        self,
        extraTrueDmg,
        'true',
        '毒爆印記破滅',
        enemy.x,
        enemy.y,
        matchTime,
        fctList,
        events,
        particles
      );

      enemy.hitsReceived++;
    }

    soundEngine.playSpiderPoisonBurst();

    // 毒爆震波與微粒爆破 (翡翠毒液噴濺)
    if (particles) {
      particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: 0,
        vy: 0,
        radius: 75,
        color: '#10b981',
        alpha: 1.0,
        maxLife: 0.4,
        life: 0.4,
        type: 'shockwave'
      });

      for (let i = 0; i < 28; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 130;
        particles.push({
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.5 + Math.random() * 2.0,
          color: i % 2 === 0 ? '#10b981' : '#047857',
          alpha: 1.0,
          maxLife: 0.45,
          life: 0.45,
          type: 'smoke'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_zhizhu_burst_${Math.random()}`,
        x: enemy.x,
        y: enemy.y - enemy.radius - 16,
        text: hasPoison ? '-10 毒液風暴! -8 印記真傷!' : '-10 毒液風暴!',
        color: '#059669',
        fontSize: 13,
        scale: 1.35,
        alpha: 1.0,
        life: 0.95,
        maxLife: 0.95,
        vy: -24,
        damageType: hasPoison ? 'true' : 'poison',
        damageValue: basePoisonDmg + (hasPoison ? extraTrueDmg : 0)
      });
    }

    if (events) {
      events.push({
        id: `evt_zz_p4_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        skillName: '蛛后毒爆',
        text: hasPoison
          ? `${self.name} 引爆 160px 毒液風暴並徹底引爆 ${enemy.name} 的【蛛毒印記】，造成 10 毒傷 + 8 穿透真傷（合計 18 傷害）！`
          : `${self.name} 引爆 160px 毒液風暴對 ${enemy.name} 造成 10 點劇烈毒素傷害！`,
        badge: hasPoison ? '印記真傷引爆' : '蛛后毒爆'
      });
    }

    self.passive4Triggers = (self.passive4Triggers || 0) + 1;
  }
}

/**
 * 辛 (Xin) - 經驗值增加與升級系統
 * 最高等級：Lv.6 (每級提升 +10% 全技能傷害、+25 最大生命值並回復 25 HP)
 */
export function addXinExp(
  xin: BallState,
  amount: number,
  fctList?: FloatingText[],
  events?: CombatEvent[],
  particles?: Particle[],
  matchTime: number = 0
) {
  if (xin.characterId !== 'xin' || xin.hp <= 0) return;
  const currentLevel = xin.xinLevel || 1;
  if (currentLevel >= 6) {
    xin.xinExp = 100;
    return;
  }

  xin.xinExp = (xin.xinExp || 0) + amount;

  // 每次成功獲得經驗：觸發經驗能量環快速收縮吸收進核心動畫
  xin.xinExpAbsorbTimer = 0.35;

  if (xin.xinExp >= 100 && currentLevel < 6) {
    xin.xinExp -= 100;
    xin.xinLevel = (xin.xinLevel || 1) + 1;
    xin.maxHp += 25;
    xin.hp = Math.min(xin.maxHp, xin.hp + 25);

    // 升級動畫：核心亮起、能量環擴散、裝甲裂縫發光、魔劍暫停 0.2 秒
    xin.xinUpgradeAnimTimer = 0.35;

    soundEngine.playXinLevelUp();

    if (particles) {
      particles.push({
        x: xin.x,
        y: xin.y,
        vx: 0,
        vy: 0,
        radius: xin.radius + 8,
        color: '#fbbf24',
        alpha: 0.95,
        maxLife: 0.4,
        life: 0.4,
        scaleGrowth: 40,
        type: 'xin_upgrade_ring'
      });

      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        const spd = 35 + Math.random() * 45;
        particles.push({
          x: xin.x,
          y: xin.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.2,
          color: i % 2 === 0 ? '#fde047' : '#c084fc',
          alpha: 1.0,
          maxLife: 0.35,
          life: 0.35,
          type: 'spark'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_xin_lvl_${Math.random()}`,
        x: xin.x,
        y: xin.y - xin.radius - 20,
        text: `Lv.${xin.xinLevel} 突破 (+10%傷 / +25HP)`,
        color: '#facc15',
        fontSize: 12,
        scale: 1.25,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -18
      });
    }

    if (events) {
      events.push({
        id: `evt_xin_lvl_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: xin.id,
        skillName: '雙相魔劍突破',
        text: `${xin.name} 匯聚雙相核心，成功晉升至【Lv.${xin.xinLevel}】！全技能傷害 +10%，生命上限 +25！`,
        badge: `Lv.${xin.xinLevel} 突破`
      });
    }
  }
}

/**
 * 辛 (Xin) - 重裝戰士粒子特效管理系統 (Heavy Warrior Particle Trail & Collision Shards)
 * 當辛移動或碰撞時，產生極短暫、半透明的殘影拖尾效果，強化重裝沉穩移動感，但不影響碰撞體積
 */
export function spawnXinHeavyWarriorParticles(
  xin: BallState,
  dt: number,
  particles: Particle[]
) {
  if (!particles || xin.characterId !== 'xin' || xin.hp <= 0) return;

  const currentSpeed = Math.hypot(xin.vx, xin.vy);
  
  // 計算上一幀到這一幀的真實位移
  const lx = xin.xinLastX ?? xin.x;
  const ly = xin.xinLastY ?? xin.y;
  const frameMovedDist = Math.hypot(xin.x - lx, xin.y - ly);
  xin.xinLastX = xin.x;
  xin.xinLastY = xin.y;

  xin.xinLastTrailDist = (xin.xinLastTrailDist || 0) + frameMovedDist;
  xin.xinAfterimageTimer = Math.max(0, (xin.xinAfterimageTimer || 0) - dt);

  // 1. 移動殘影觸發條件：
  // 當前速度 > 120 且 (累積位移 >= 18px 或 定時冷卻完畢)
  const distThreshold = currentSpeed > 350 ? 14 : (currentSpeed > 200 ? 18 : 24);
  const timeThresholdMet = (xin.xinAfterimageTimer || 0) <= 0;
  const distThresholdMet = (xin.xinLastTrailDist || 0) >= distThreshold;

  if (currentSpeed >= 115 && (distThresholdMet || (timeThresholdMet && currentSpeed > 220))) {
    xin.xinLastTrailDist = 0;
    xin.xinAfterimageTimer = currentSpeed > 350 ? 0.045 : 0.08;

    // 生成極短暫、半透明殘影 (不膨脹，不影響碰撞體積，純視覺渲染)
    const baseAlpha = currentSpeed > 350 ? 0.38 : (currentSpeed > 200 ? 0.30 : 0.22);
    const lifeDuration = currentSpeed > 350 ? 0.16 : 0.13;

    particles.push({
      x: xin.x,
      y: xin.y,
      vx: xin.vx * 0.04, // 些微慣性漂移
      vy: xin.vy * 0.04,
      radius: xin.radius, // 與球體半徑 21 嚴格一致
      color: xin.xinForm === 'dark' ? '#a855f7' : (xin.xinForm === 'light' ? '#fbbf24' : '#94a3b8'),
      alpha: baseAlpha,
      maxLife: lifeDuration,
      life: lifeDuration,
      type: 'xin_afterimage',
      extraData: {
        form: xin.xinForm || 'balance',
        level: xin.xinLevel || 1
      }
    });
  }
}

/**
 * 辛 (Xin) - 碰撞短暫殘影與裝甲微火花碎片 (Heavy Warrior Collision Particles)
 * 當辛與敵球或牆壁發生激烈碰撞時觸發
 */
export function spawnXinCollisionEffects(
  xin: BallState,
  impactSpeed: number,
  collisionX: number,
  collisionY: number,
  nx: number,
  ny: number,
  particles: Particle[]
) {
  if (!particles || xin.characterId !== 'xin' || xin.hp <= 0) return;

  const form = xin.xinForm || 'balance';
  const color = form === 'dark' ? '#c084fc' : (form === 'light' ? '#fde047' : '#e2e8f0');

  // 1. 碰撞點極短暫半透明殘影 (受撞擊反作用力輕微震退的虛像，0.12s 快速淡出)
  particles.push({
    x: xin.x,
    y: xin.y,
    vx: -nx * 12,
    vy: -ny * 12,
    radius: xin.radius,
    color,
    alpha: 0.35,
    maxLife: 0.12,
    life: 0.12,
    type: 'xin_afterimage',
    extraData: {
      form,
      level: xin.xinLevel || 1
    }
  });

  // 2. 辛特有的金屬裝甲碰撞火星與菱形破片 (不影響碰撞體積，純視覺層)
  const shardCount = impactSpeed > 220 ? 4 : 2;
  for (let s = 0; s < shardCount; s++) {
    const spreadAngle = Math.atan2(ny, nx) + (Math.random() - 0.5) * 1.6;
    const shardSpd = 30 + Math.random() * 60;
    particles.push({
      x: collisionX + (Math.random() - 0.5) * 6,
      y: collisionY + (Math.random() - 0.5) * 6,
      vx: Math.cos(spreadAngle) * shardSpd,
      vy: Math.sin(spreadAngle) * shardSpd,
      radius: 1.6 + Math.random() * 1.2,
      color,
      alpha: 0.75,
      maxLife: 0.18 + Math.random() * 0.1,
      life: 0.18 + Math.random() * 0.1,
      type: 'xin_collision_shard',
      spin: Math.random() * Math.PI * 2
    });
  }
}

/**
 * 辛 (Xin) - 雙相魔劍 核心技能與形態系統
 * 定位：形態戰士 / 技能戰士 / 成長戰士 (沉重金屬球體 × 光暗雙相能量 × 環繞式魔劍)
 * 核心機制：
 * 1. 永久 0 碰撞傷害 (isZeroCollisionDamageRole)
 * 2. 雙相魔劍 (初始平衡 → 統御曜光 → 狂暴煞暗 循環切換，形態每秒遞減 10 能量)
 * 3. 魔劍普攻 (1.4s CD，自動鎖定 240px 目標，魔劍迅速前移揮斬發射細長劍氣，命中 +15 XP)
 * 4. 逐影破陣 (6.5s CD，蓄力 0.22s 魔劍前移開道，直線突進穿透，命中 +25 XP，光形態獲護盾，暗形態更高穿傷)
 * 5. 裂空劍痕 (11.0s CD，蓄力 0.45s 縮小環與魔劍震動，發射超遠巨型雙相空間劍氣，命中 +40 XP，光形態回血，暗形態斬殺)
 */
export function updateXinPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'xin' || self.hp <= 0) return;

  // 0. 重裝戰士粒子特效管理系統：產生極短暫、半透明殘影拖尾效果，強化沉重位移感
  spawnXinHeavyWarriorParticles(self, dt, particles);

  // 1. 魔劍環繞與升級暫停判定
  const isUpgrading = (self.xinUpgradeAnimTimer || 0) > 0.15;
  if (!isUpgrading) {
    // 沉穩、優雅緩慢環繞，不高速旋轉
    const orbitSpeed = self.xinForm === 'dark' ? 2.2 : (self.xinForm === 'light' ? 1.8 : 1.5);
    self.xinSwordOrbitAngle = ((self.xinSwordOrbitAngle || 0) + orbitSpeed * dt) % (Math.PI * 2);
  }

  // 計時器衰減
  if (self.xinExpAbsorbTimer && self.xinExpAbsorbTimer > 0) {
    self.xinExpAbsorbTimer = Math.max(0, self.xinExpAbsorbTimer - dt);
  }
  if (self.xinUpgradeAnimTimer && self.xinUpgradeAnimTimer > 0) {
    self.xinUpgradeAnimTimer = Math.max(0, self.xinUpgradeAnimTimer - dt);
  }

  // 成長等級傷害倍率 (+10% / level)
  const levelMult = 1 + ((self.xinLevel || 1) - 1) * 0.10;

  // 2. 形態能量與轉換機制 (被動四: 雙相魔劍)
  if (self.xinForm === 'balance') {
    // 初始平衡形態：能量由 100 逐步消耗 (持續 10 秒)，歸零時切換至光之魔劍(統御)
    self.xinFormEnergy = Math.max(0, (self.xinFormEnergy ?? 100) - 10 * dt);
    if (self.xinFormEnergy <= 0) {
      self.xinForm = 'light';
      self.xinFormEnergy = 100;
      soundEngine.playXinFormSwitch('light');

      if (fctList) {
        fctList.push({
          id: `fct_xin_form_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 20,
          text: '【統御形態｜光之劍】(+護盾/+聖光治療)',
          color: '#fbbf24',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -18
        });
      }

      if (events) {
        events.push({
          id: `evt_xin_form_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '雙相魔劍',
          text: `${self.name} 轉換為【統御形態｜光之魔劍】！獲得神聖護盾與治療強化！`,
          badge: '統御光劍'
        });
      }

      if (particles) {
        for (let i = 0; i < 14; i++) {
          const a = Math.random() * Math.PI * 2;
          particles.push({
            x: self.x,
            y: self.y,
            vx: Math.cos(a) * 45,
            vy: Math.sin(a) * 45,
            radius: 2.2,
            color: '#facc15',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'xin_light_spark'
          });
        }
      }
    }
  } else if (self.xinForm === 'light') {
    // 統御光形態：每秒消耗 10 能量 (持續 10 秒)
    self.xinFormEnergy = Math.max(0, (self.xinFormEnergy ?? 100) - 10 * dt);
    if (self.xinFormEnergy <= 0) {
      self.xinForm = 'dark';
      self.xinFormEnergy = 100;
      soundEngine.playXinFormSwitch('dark');

      if (fctList) {
        fctList.push({
          id: `fct_xin_form_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 20,
          text: '【狂暴形態｜暗之劍】(+35%攻速/+斬殺)',
          color: '#c084fc',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -18
        });
      }

      if (events) {
        events.push({
          id: `evt_xin_form_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '雙相魔劍',
          text: `${self.name} 轉換為【狂暴形態｜暗之魔劍】！攻速提升 35% 並啟動斬殺機制！`,
          badge: '狂暴暗劍'
        });
      }

      if (particles) {
        for (let i = 0; i < 16; i++) {
          const a = Math.random() * Math.PI * 2;
          particles.push({
            x: self.x,
            y: self.y,
            vx: Math.cos(a) * 55,
            vy: Math.sin(a) * 55,
            radius: 2.5,
            color: '#a855f7',
            alpha: 1.0,
            maxLife: 0.35,
            life: 0.35,
            type: 'xin_dark_spark'
          });
        }
      }
    }
  } else if (self.xinForm === 'dark') {
    // 狂暴暗形態：每秒消耗 10 能量 (持續 10 秒)
    self.xinFormEnergy = Math.max(0, (self.xinFormEnergy ?? 100) - 10 * dt);
    if (self.xinFormEnergy <= 0) {
      self.xinForm = 'light';
      self.xinFormEnergy = 100;
      soundEngine.playXinFormSwitch('light');

      if (fctList) {
        fctList.push({
          id: `fct_xin_form_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 20,
          text: '【統御形態｜光之劍】(+護盾/+聖光治療)',
          color: '#fbbf24',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -18
        });
      }

      if (events) {
        events.push({
          id: `evt_xin_form_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          skillName: '雙相魔劍',
          text: `${self.name} 循環轉換為【統御形態｜光之魔劍】！`,
          badge: '統御光劍'
        });
      }
    }
  }

  // 3. 逐影破陣 (被動二: 逐影破陣 Dash State & Cooldown)
  if (self.xinShadowDashChargeTimer && self.xinShadowDashChargeTimer > 0) {
    self.xinShadowDashChargeTimer -= dt;
    self.xinLockAimAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
    self.xinLockTargetId = enemy.id;
    self.xinLockTargetDist = Math.hypot(enemy.x - self.x, enemy.y - self.y);
    self.xinLockSkillType = 'shadow_dash';

    if (self.xinShadowDashChargeTimer <= 0) {
      // 啟動破陣穿透衝刺：魔劍保持在最前方，無分身、不瞬移
      self.xinShadowDashChargeTimer = 0;
      self.xinShadowDashing = true;
      self.xinShadowDashStartX = self.x;
      self.xinShadowDashStartY = self.y;
      self.xinShadowDashDistTraveled = 0;
      self.xinShadowDashHitIds = [];
      self.xinShadowDashAnimTimer = 0.35;

      const angle = self.xinLockAimAngle ?? Math.atan2(enemy.y - self.y, enemy.x - self.x);
      const dashSpeed = 680;
      self.xinShadowDashDirX = Math.cos(angle);
      self.xinShadowDashDirY = Math.sin(angle);
      self.vx = self.xinShadowDashDirX * dashSpeed;
      self.vy = self.xinShadowDashDirY * dashSpeed;

      soundEngine.playXinShadowDash();
    }
  } else if (self.xinShadowDashing) {
    // 正在高速穿透衝刺 (魔劍保持在前方，短距離能量拖影)
    self.xinShadowDashAnimTimer = Math.max(0, (self.xinShadowDashAnimTimer || 0) - dt);
    const distThisStep = Math.hypot(self.vx, self.vy) * dt;
    self.xinShadowDashDistTraveled = (self.xinShadowDashDistTraveled || 0) + distThisStep;

    // 乾淨的短能量微粒拖影 (不產生分身殘影)
    if (particles && Math.random() < 0.6) {
      const trailAngle = Math.atan2(self.vy, self.vx) + Math.PI;
      particles.push({
        x: self.x + Math.cos(trailAngle) * (self.radius * 0.7),
        y: self.y + Math.sin(trailAngle) * (self.radius * 0.7),
        vx: -self.vx * 0.12 + (Math.random() - 0.5) * 15,
        vy: -self.vy * 0.12 + (Math.random() - 0.5) * 15,
        radius: 2.2,
        color: self.xinForm === 'dark' ? '#9333ea' : (self.xinForm === 'light' ? '#facc15' : '#e2e8f0'),
        alpha: 0.65,
        maxLife: 0.22,
        life: 0.22,
        type: 'xin_dash_trail'
      });
    }

    // 碰撞命中穿透判定
    if (enemy.hp > 0 && !self.xinShadowDashHitIds?.includes(enemy.id)) {
      const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);
      if (distToEnemy <= self.radius + enemy.radius + 16) {
        if (!self.xinShadowDashHitIds) self.xinShadowDashHitIds = [];
        self.xinShadowDashHitIds.push(enemy.id);

        const isDark = self.xinForm === 'dark';
        const isLight = self.xinForm === 'light';
        const baseDmg = isDark ? 34 : 24;
        const finalDmg = Math.round(baseDmg * levelMult);

        applyDamageWithDamageSharing(
          enemy,
          self,
          finalDmg,
          'physical',
          '逐影破陣',
          enemy.x,
          enemy.y,
          matchTime,
          fctList,
          events,
          particles
        );

        enemy.hitsReceived++;
        enemy.hitFlashTimer = 0.25;

        // 光形態效果：獲得 35 點神聖護盾
        if (isLight) {
          self.xinShieldAmount = Math.min(100, (self.xinShieldAmount || 0) + 35);
        }

        // 獲得 25 點 EXP
        addXinExp(self, 25, fctList, events, particles, matchTime);

        soundEngine.playXinSwordSlash(isDark ? 'dark' : (isLight ? 'light' : 'balance'));

        // 小型直線衝擊特效 (directional sparks, 零鏡頭震動, 零地圖跳動)
        if (particles) {
          const hitAng = Math.atan2(enemy.y - self.y, enemy.x - self.x);
          for (let p = 0; p < 8; p++) {
            const spread = (Math.random() - 0.5) * 0.7;
            const spd = 50 + Math.random() * 70;
            particles.push({
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(hitAng + spread) * spd,
              vy: Math.sin(hitAng + spread) * spd,
              radius: 2.0,
              color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#e2e8f0'),
              alpha: 0.9,
              maxLife: 0.25,
              life: 0.25,
              type: 'xin_impact_spark'
            });
          }
        }

        if (fctList) {
          fctList.push({
            id: `fct_xin_dash_${Math.random()}`,
            x: enemy.x,
            y: enemy.y - enemy.radius - 14,
            text: isDark ? `-${finalDmg} 逐影破陣[狂暴]!` : (isLight ? `-${finalDmg} 逐影破陣[+35護盾]` : `-${finalDmg} 逐影破陣`),
            color: isDark ? '#c084fc' : (isLight ? '#facc15' : '#e2e8f0'),
            fontSize: 12,
            scale: 1.2,
            alpha: 1.0,
            life: 0.8,
            maxLife: 0.8,
            vy: -20,
            damageType: 'physical',
            damageValue: finalDmg
          });
        }

        if (events) {
          events.push({
            id: `evt_xin_dash_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            targetId: enemy.id,
            damage: finalDmg,
            skillName: '逐影破陣',
            text: `${self.name} 穿透衝刺斬破 ${enemy.name}，造成 ${finalDmg} 點傷害${isLight ? ' 並獲取 35 點神聖護盾' : ''}！`,
            badge: '逐影破陣'
          });
        }

        self.passive2Triggers = (self.passive2Triggers || 0) + 1;
      }
    }

    if ((self.xinShadowDashDistTraveled || 0) >= 280 || self.xinShadowDashAnimTimer <= 0) {
      self.xinShadowDashing = false;
      self.xinShadowDashDistTraveled = 0;
      self.xinLockSkillType = null;
      self.vx *= 0.4;
      self.vy *= 0.4;
    }
  } else {
    // 逐影破陣冷卻
    self.xinShadowDashCooldown = Math.max(0, (self.xinShadowDashCooldown ?? 0) - dt);
    if (self.xinShadowDashCooldown <= 0 && enemy.hp > 0) {
      const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);
      if (distToEnemy <= 280) {
        self.xinShadowDashCooldown = 6.5;
        self.xinShadowDashChargeTimer = 0.22; // 0.22s 瞄準蓄力 (魔劍前移、核心亮起、壓縮能量)
        self.xinLockAimAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
        self.xinLockTargetId = enemy.id;
        self.xinLockTargetDist = distToEnemy;
        self.xinLockSkillType = 'shadow_dash';
      }
    }
  }

  // 4. 裂空劍痕 (被動三: 裂空劍痕 11s CD)
  // 強力斬擊時：魔劍停止環繞、移動至球體前方、鎖定方向、蓄力環逐漸縮小、魔劍微震動、發射巨大空間劍氣
  if (self.xinSkySlashChargeTimer && self.xinSkySlashChargeTimer > 0) {
    self.xinSkySlashChargeTimer -= dt;
    self.xinLockAimAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
    self.xinLockTargetId = enemy.id;
    self.xinLockTargetDist = Math.hypot(enemy.x - self.x, enemy.y - self.y);
    self.xinLockSkillType = 'sky_cleave';

    // 蓄力後段 (最後 0.16 秒) 魔劍微震動！
    if (self.xinSkySlashChargeTimer <= 0.16) {
      self.xinSwordVibrate = ((0.16 - self.xinSkySlashChargeTimer) / 0.16) * 3.0;
    } else {
      self.xinSwordVibrate = 0;
    }

    if (self.xinSkySlashChargeTimer <= 0) {
      self.xinSkySlashChargeTimer = 0;
      self.xinSwordVibrate = 0;
      self.xinLockSkillType = null;

      // 發射裂空巨型雙相衝擊劍痕
      const aimAngle = self.xinSkySlashAimAngle ?? Math.atan2(enemy.y - self.y, enemy.x - self.x);
      const cleaveSpeed = 600;
      const vx = Math.cos(aimAngle) * cleaveSpeed;
      const vy = Math.sin(aimAngle) * cleaveSpeed;
      const baseDmg = 42;
      const finalDmg = Math.round(baseDmg * levelMult);

      projectiles.push({
        id: `xin_cleave_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: self.id,
        targetId: enemy.id,
        type: 'xin_sky_cleave',
        x: self.x + Math.cos(aimAngle) * (self.radius + 26),
        y: self.y + Math.sin(aimAngle) * (self.radius + 26),
        vx,
        vy,
        radius: 18,
        damage: finalDmg,
        damageType: 'magic',
        life: 1.8,
        maxLife: 1.8,
        color: self.xinForm === 'dark' ? '#a855f7' : (self.xinForm === 'light' ? '#f59e0b' : '#38bdf8'),
        trail: [],
        extraData: { form: self.xinForm, baseDmg, level: self.xinLevel }
      });

      // 產生角色周圍微型能量衝擊環與空間開裂閃光
      if (particles) {
        particles.push({
          x: self.x,
          y: self.y,
          vx: 0,
          vy: 0,
          radius: self.radius + 8,
          color: self.xinForm === 'dark' ? '#a855f7' : (self.xinForm === 'light' ? '#fbbf24' : '#e2e8f0'),
          alpha: 0.9,
          maxLife: 0.32,
          life: 0.32,
          scaleGrowth: 32,
          type: 'xin_charge_ring'
        });

        // 巨刃出鞘空間裂痕
        particles.push({
          x: self.x + Math.cos(aimAngle) * (self.radius + 16),
          y: self.y + Math.sin(aimAngle) * (self.radius + 16),
          vx: Math.cos(aimAngle) * 40,
          vy: Math.sin(aimAngle) * 40,
          radius: 3,
          length: 42,
          angle: aimAngle,
          color: self.xinForm === 'dark' ? '#c084fc' : (self.xinForm === 'light' ? '#fde047' : '#ffffff'),
          alpha: 0.95,
          maxLife: 0.28,
          life: 0.28,
          type: 'xin_spatial_rift_crack',
          extraData: { jag1: 6, jag2: -5, jag3: 4 }
        });
      }

      soundEngine.playXinSkySlash();

      if (events) {
        events.push({
          id: `evt_xin_cleave_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: enemy.id,
          damage: finalDmg,
          skillName: '裂空劍痕',
          text: `${self.name} 蓄勢凝聚魔劍，斬出巨型【裂空劍痕】！`,
          badge: '裂空劍痕'
        });
      }

      self.passive3Triggers = (self.passive3Triggers || 0) + 1;
    }
  } else {
    self.xinSkySlashCooldown = Math.max(0, (self.xinSkySlashCooldown ?? 0) - dt);
    if (self.xinSkySlashCooldown <= 0 && enemy.hp > 0 && !self.xinShadowDashing) {
      const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);
      if (distToEnemy <= 360) {
        self.xinSkySlashCooldown = 11.0;
        self.xinSkySlashChargeTimer = 0.45; // 0.45s 瞄準蓄勢 (魔劍前移、縮小蓄力環、微震動)
        self.xinSkySlashAimAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
        self.xinLockAimAngle = self.xinSkySlashAimAngle;
        self.xinLockTargetId = enemy.id;
        self.xinLockTargetDist = distToEnemy;
        self.xinLockSkillType = 'sky_cleave';
      }
    }
  }

  // 5. 魔劍普攻 (被動一: 魔劍普攻 1.4s CD，暗形態 0.91s CD)
  // 普攻流程：1. 魔劍平滑移至攻擊方向 -> 2. 短暫亮起 -> 3. 快速揮擊 -> 4. 發射細長劍氣 -> 5. 魔劍回歸外圍環繞
  const atkSpeedFactor = self.xinForm === 'dark' ? 1.35 : 1.0;
  self.xinBasicAttackCooldown = Math.max(0, (self.xinBasicAttackCooldown ?? 0) - dt * atkSpeedFactor);

  if (self.xinBasicSlashAnimTimer && self.xinBasicSlashAnimTimer > 0) {
    self.xinBasicSlashAnimTimer -= dt;
    if (self.xinBasicSlashAnimTimer <= 0) {
      self.xinBasicSlashAnimTimer = 0;

      // 揮擊至前端瞬間發射細長型劍氣 (清爽乾淨、容易辨識)
      const angle = self.xinLockAimAngle ?? Math.atan2(enemy.y - self.y, enemy.x - self.x);
      const strikeSpeed = 540;
      const vx = Math.cos(angle) * strikeSpeed;
      const vy = Math.sin(angle) * strikeSpeed;
      const isDark = self.xinForm === 'dark';
      const isLight = self.xinForm === 'light';
      const baseDmg = 18 + (isLight ? 8 : 0) + (isDark ? 8 : 0);
      const finalDmg = Math.round(baseDmg * levelMult);

      projectiles.push({
        id: `xin_strike_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: self.id,
        targetId: enemy.id,
        type: 'xin_sword_strike',
        x: self.x + Math.cos(angle) * (self.radius + 22),
        y: self.y + Math.sin(angle) * (self.radius + 22),
        vx,
        vy,
        radius: 7, // 細長穿刺劍氣
        damage: finalDmg,
        damageType: isLight ? 'magic' : 'physical',
        life: 1.2,
        maxLife: 1.2,
        color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#e2e8f0'),
        trail: [],
        extraData: { form: self.xinForm, baseDmg, level: self.xinLevel }
      });

      // 斬擊出鞘弧光粒子 (Seamless launch arc)
      if (particles) {
        particles.push({
          x: self.x + Math.cos(angle) * (self.radius + 18),
          y: self.y + Math.sin(angle) * (self.radius + 18),
          vx: Math.cos(angle) * 35,
          vy: Math.sin(angle) * 35,
          radius: 22,
          angle,
          width: 3.5,
          color: isDark ? '#c084fc' : (isLight ? '#fde047' : '#ffffff'),
          alpha: 0.9,
          maxLife: 0.16,
          life: 0.16,
          type: 'xin_slash_arc',
          extraData: { sweep: 1.1 }
        });
      }

      soundEngine.playXinSwordSlash(self.xinForm);
      self.passive1Triggers = (self.passive1Triggers || 0) + 1;

      if (!self.xinShadowDashChargeTimer && !self.xinSkySlashChargeTimer) {
        self.xinLockSkillType = null;
      }
    }
  } else if (
    self.xinBasicAttackCooldown <= 0 &&
    enemy.hp > 0 &&
    !self.xinShadowDashing &&
    (!self.xinSkySlashChargeTimer || self.xinSkySlashChargeTimer <= 0) &&
    (!self.xinShadowDashChargeTimer || self.xinShadowDashChargeTimer <= 0)
  ) {
    const distToEnemy = Math.hypot(enemy.x - self.x, enemy.y - self.y);
    if (distToEnemy <= 240) {
      self.xinBasicAttackCooldown = 1.4;
      self.xinBasicSlashAnimTimer = 0.14; // 0.14 秒快速揮擊動畫
      self.xinLockAimAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
      self.xinLockTargetId = enemy.id;
      self.xinLockTargetDist = distToEnemy;
      self.xinLockSkillType = 'basic_attack';
    }
  }

  // 若沒有正在進行的技能瞄準與揮劍，清除鎖定狀態
  if (
    !self.xinShadowDashChargeTimer &&
    !self.xinSkySlashChargeTimer &&
    (!self.xinBasicSlashAnimTimer || self.xinBasicSlashAnimTimer <= 0) &&
    (self.xinBasicAttackCooldown ?? 0) > 0.3
  ) {
    if (self.xinLockSkillType === null) {
      self.xinLockAimAngle = undefined;
      self.xinLockTargetId = undefined;
      self.xinLockTargetDist = undefined;
    }
  }
}

/**
 * 傀儡師 (Kuileishi) 被動技能系統:
 * 1. 武器／核心｜命運傀儡線 (狀態連結視覺, 傀儡移動與牽引)
 * 2. 被動一【傀儡召喚】:
 *    - 召喚間隔：8 秒自動召喚 1 隻戰鬥傀儡 (上限 2 隻)
 *    - 傀儡獨立血量：3 條生命條，每條 20 HP (總計 60 HP)
 *    - 仇恨吸引：敵人與投射物優先攻擊傀儡
 *    - 傀儡具有獨立碰撞體，受到碰撞傷害，被撞擊產生物理反彈，對敵人造成 0 碰撞傷害
 *    - 傀儡護幕：場上有傀儡時，本體受到傷害減免 30%，轉移至最高生命值傀儡
 *    - 木偶替身：單次受到大於 10% 最大生命值傷害時，額外減免 20% (共 50%)，傀儡獻祭 1 條完整生命條 (CD 12s)
 * 3. 被動二【牽線束縛】:
 *    - CD：6 秒
 *    - 自動釋放命運傀儡線束縛敵人，造成 8 點魔法傷害
 *    - 使敵人減速 25%，持續 2.5 秒
 *    - 命中賦予 1 層傀儡共鳴
 * 4. 被動三【傀儡共鳴】與【木偶終幕】:
 *    - 傀儡共鳴：共 3 層，每層提供 4% 移動速度加成 (最高 12%)
 *    - 傀儡每 2 秒普攻命中敵人獲得 1 層共鳴
 *    - 木偶終幕 (CD 20 秒):
 *      - 觸發條件：需同時滿足「3層共鳴」+「牽線束縛命中目標」+「場上有活著的傀儡」
 *      - 觸發時全傀儡突進連攜夾擊，消耗全部共鳴層數
 *      - 造成 10 點固定魔法傷害 (若 2 隻傀儡存活則增幅至 15 點魔法傷害)
 *      - 造成短暫定身 0.6 秒與命運傀儡線交錯絕響特效
 */
export function updateKuileishiPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
): void {
  if (self.characterId !== 'kuileishi' || self.hp <= 0) return;

  // Initialize arrays & counters if needed
  if (!self.puppets) self.puppets = [];

  // Update timers
  if (self.puppetAegisTimer && self.puppetAegisTimer > 0) {
    self.puppetAegisTimer = Math.max(0, self.puppetAegisTimer - dt);
  }
  if (self.puppetAegisCooldown && self.puppetAegisCooldown > 0) {
    self.puppetAegisCooldown = Math.max(0, self.puppetAegisCooldown - dt);
  }
  if (self.puppetSubstituteCooldown && self.puppetSubstituteCooldown > 0) {
    self.puppetSubstituteCooldown = Math.max(0, self.puppetSubstituteCooldown - dt);
  }
  if (self.puppetTetherAnimTimer && self.puppetTetherAnimTimer > 0) {
    self.puppetTetherAnimTimer = Math.max(0, self.puppetTetherAnimTimer - dt);
  }

  // Update enemy tether state
  if (enemy.tetheredByPuppeteerTimer && enemy.tetheredByPuppeteerTimer > 0) {
    enemy.tetheredByPuppeteerTimer = Math.max(0, enemy.tetheredByPuppeteerTimer - dt);
    enemy.isTetheredByPuppeteer = enemy.tetheredByPuppeteerTimer > 0;
  } else {
    enemy.isTetheredByPuppeteer = false;
  }

  // Resonance stack decay (8s decay timer)
  if (self.puppetResonance && self.puppetResonance > 0) {
    self.puppetResonanceDecayTimer = (self.puppetResonanceDecayTimer || 8.0) - dt;
    if (self.puppetResonanceDecayTimer <= 0) {
      self.puppetResonance = Math.max(0, self.puppetResonance - 1);
      self.puppetResonanceDecayTimer = 8.0;
    }
  }

  // 1. 被動一【傀儡召喚】(戰鬥開始時及每 5 秒自動召喚一具魔法傀儡，最多 2 具，每具75HP分3條生命條)
  const alivePuppets = self.puppets.filter(p => p.hp > 0 && p.currentSegment <= 3);

  // 戰鬥開始第一瞬間立即召喚第一具傀儡，無需空等 5 秒
  const isMatchInitial = self.puppetSummonCooldown === undefined;
  if (isMatchInitial) {
    self.puppetSummonCooldown = 5.0;
  } else {
    self.puppetSummonCooldown -= dt;
  }

  const shouldSpawn = (isMatchInitial && alivePuppets.length === 0) || (self.puppetSummonCooldown <= 0 && alivePuppets.length < 2);

  if (shouldSpawn) {
    self.puppetSummonCooldown = 5.0;
    // 召喚位置在傀儡師前方略微偏向敵人的方位
    const toEnAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x) || 0;
    const spreadAngle = toEnAngle + (Math.random() - 0.5) * 1.2;
    const spawnDist = 38 + Math.random() * 20;
    const spawnX = Math.max(30, Math.min(ARENA_WIDTH - 30, self.x + Math.cos(spreadAngle) * spawnDist));
    const spawnY = Math.max(30, Math.min(ARENA_HEIGHT - 30, self.y + Math.sin(spreadAngle) * spawnDist));

    const newPuppet: CombatPuppet = {
      id: `puppet_${self.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ownerId: self.id,
      x: spawnX,
      y: spawnY,
      vx: Math.cos(toEnAngle) * 120,
      vy: Math.sin(toEnAngle) * 120,
      radius: 14,
      mass: 0.80,
      maxHp: 75,
      hp: 75,
      totalHp: 75,
      totalSegments: 3,
      currentSegment: 1,
      segmentHp: 25,
      maxSegmentHp: 25,
      stopTimer: 0,
      attackCooldown: 0.6,
      attackAnimTimer: 0,
      slashAnimTimer: 0,
      slashCooldown: 0.3, // 召喚初速進入戰鬥狀態
      targetX: enemy.x,
      targetY: enemy.y,
      hitFlashTimer: 0.3,
      lineFlashTimer: 0.5,
      shieldActiveTimer: 0,
      finaleDashTimer: 0,
      createdTime: Date.now()
    };

    self.puppets.push(newPuppet);
    self.passive1Triggers = (self.passive1Triggers || 0) + 1;

    soundEngine.playPuppetSummon();

    if (particles) {
      particles.push({
        x: spawnX,
        y: spawnY,
        vx: 0,
        vy: 0,
        radius: 36,
        color: '#c084fc',
        alpha: 0.9,
        maxLife: 0.32,
        life: 0.32,
        type: 'shockwave'
      });

      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 40 + Math.random() * 80;
        particles.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 2.2,
          color: i % 2 === 0 ? '#d97706' : '#a855f7',
          alpha: 1.0,
          maxLife: 0.4,
          life: 0.4,
          type: 'puppet_thread_spark'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_puppet_spawn_${Math.random()}`,
        x: spawnX,
        y: spawnY - 18,
        text: `【召喚戰鬥傀儡 3條命75HP】`,
        color: '#c084fc',
        fontSize: 12,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -22
      });
    }

    if (events) {
      events.push({
        id: `evt_puppet_spawn_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: self.id,
        skillName: '傀儡召喚',
        text: `${self.name} 編織命運之線，召喚戰鬥傀儡 (3條生命條共75HP，極速追擊280~440px/s，自動斬擊並提供護幕)！`,
        badge: '傀儡召喚'
      });
    }
  }

  // 2. 更新場上所有戰鬥傀儡物理與攻擊行為
  const isTargetTethered = enemy.isTetheredByPuppeteer || (enemy.tetheredByPuppeteerTimer ?? 0) > 0;

  for (const puppet of self.puppets) {
    if (puppet.hp <= 0 || puppet.currentSegment > 3) continue;

    // Decay timers
    if (puppet.hitFlashTimer && puppet.hitFlashTimer > 0) {
      puppet.hitFlashTimer = Math.max(0, puppet.hitFlashTimer - dt);
    }
    if (puppet.lineFlashTimer && puppet.lineFlashTimer > 0) {
      puppet.lineFlashTimer = Math.max(0, puppet.lineFlashTimer - dt);
    }
    if (puppet.slashAnimTimer && puppet.slashAnimTimer > 0) {
      puppet.slashAnimTimer = Math.max(0, puppet.slashAnimTimer - dt);
    }
    if (puppet.shieldActiveTimer && puppet.shieldActiveTimer > 0) {
      puppet.shieldActiveTimer = Math.max(0, puppet.shieldActiveTimer - dt);
    }
    if (puppet.finaleDashTimer && puppet.finaleDashTimer > 0) {
      puppet.finaleDashTimer = Math.max(0, puppet.finaleDashTimer - dt);
    }

    // AI movement: Puppet moves toward the enemy to intercept and strike (常規 280 px/s，牽線暴衝 440 px/s)
    const toEnemyX = enemy.x - puppet.x;
    const toEnemyY = enemy.y - puppet.y;
    const distToEnemy = Math.hypot(toEnemyX, toEnemyY) || 1;

    const toOwnerX = self.x - puppet.x;
    const toOwnerY = self.y - puppet.y;
    const distToOwner = Math.hypot(toOwnerX, toOwnerY) || 1;

    let steerX = 0;
    let steerY = 0;

    // Soft leash to master: only gently guide back if exceptionally far (>520px)
    if (distToOwner > 520) {
      steerX += (toOwnerX / distToOwner) * 120;
      steerY += (toOwnerY / distToOwner) * 120;
    }

    // Chase Enemy: Standard speed is 280 px/s. If enemy is tethered, sprint at 440 px/s!
    const approachSpd = isTargetTethered ? 440 : 280;
    if (distToEnemy > 28) {
      steerX += (toEnemyX / distToEnemy) * approachSpd;
      steerY += (toEnemyY / distToEnemy) * approachSpd;
    } else {
      // Circle enemy aggressively when in melee contact
      steerX += (-toEnemyY / distToEnemy) * 110;
      steerY += (toEnemyX / distToEnemy) * 110;
    }

    // Apply acceleration & damping (加速度提升至 7.0，阻尼提升至 0.94，機動性大爆發)
    puppet.vx += steerX * 7.0 * dt;
    puppet.vy += steerY * 7.0 * dt;
    puppet.vx *= Math.pow(0.94, dt * 60);
    puppet.vy *= Math.pow(0.94, dt * 60);

    // Update position
    puppet.x += puppet.vx * dt;
    puppet.y += puppet.vy * dt;

    // Arena boundary bounce
    if (puppet.x - puppet.radius < 0) {
      puppet.x = puppet.radius;
      puppet.vx = Math.abs(puppet.vx) * 0.75;
    } else if (puppet.x + puppet.radius > ARENA_WIDTH) {
      puppet.x = ARENA_WIDTH - puppet.radius;
      puppet.vx = -Math.abs(puppet.vx) * 0.75;
    }
    if (puppet.y - puppet.radius < 0) {
      puppet.y = puppet.radius;
      puppet.vy = Math.abs(puppet.vy) * 0.75;
    } else if (puppet.y + puppet.radius > ARENA_HEIGHT) {
      puppet.y = ARENA_HEIGHT - puppet.radius;
      puppet.vy = -Math.abs(puppet.vy) * 0.75;
    }

    // Collision with enemy ball:
    const edx = enemy.x - puppet.x;
    const edy = enemy.y - puppet.y;
    const edist = Math.hypot(edx, edy);
    const minColDist = enemy.radius + puppet.radius;

    if (edist < minColDist && edist > 0.001) {
      const enx = edx / edist;
      const eny = edy / edist;
      const overlap = minColDist - edist;

      puppet.x -= enx * overlap * 0.65;
      puppet.y -= eny * overlap * 0.65;
      enemy.x += enx * overlap * 0.35;
      enemy.y += eny * overlap * 0.35;

      const rvx = enemy.vx - puppet.vx;
      const rvy = enemy.vy - puppet.vy;
      const normalVel = rvx * enx + rvy * eny;

      if (normalVel < 0) {
        const impulse = normalVel * 0.85;
        puppet.vx += enx * impulse * (enemy.mass / (puppet.mass + enemy.mass));
        puppet.vy += eny * impulse * (enemy.mass / (puppet.mass + enemy.mass));
        enemy.vx -= enx * impulse * (puppet.mass / (puppet.mass + enemy.mass));
        enemy.vy -= eny * impulse * (puppet.mass / (puppet.mass + enemy.mass));

        // Enemy deals collision damage to puppet (0 collision damage to enemy)
        const impactDmg = Math.max(4, Math.round((enemy.baseAttack || 10) * 0.8));
        damageCombatPuppet(puppet, impactDmg, fctList, particles);
        recordDamageStats(enemy, self, impactDmg, 'physical', '敵方撞擊傀儡');
        soundEngine.playReboundBoost();
      }
    }

    // 傀儡自動攻擊: 180px 範圍內自動攻擊敵人，每 0.6 秒造成 6 點物理傷害，累積 1 層共鳴
    puppet.slashCooldown = (puppet.slashCooldown ?? 0.6) - dt;
    if (puppet.slashCooldown <= 0 && distToEnemy <= 180 && enemy.hp > 0) {
      puppet.slashCooldown = 0.6;
      puppet.slashAnimTimer = 0.22;

      // 傀儡向目標強力突刺衝鋒 (突進衝量由 85 強化至 180)
      puppet.vx += (toEnemyX / distToEnemy) * 180;
      puppet.vy += (toEnemyY / distToEnemy) * 180;

      // 【核心修復】正確傳入 defender=enemy, attacker=self
      const slashDmg = 6; // 技能加強: 6 點物理傷害
      applyDamageWithDamageSharing(
        enemy,
        self,
        slashDmg,
        'physical',
        '傀儡攻擊',
        enemy.x,
        enemy.y,
        matchTime,
        fctList,
        events,
        particles
      );

      // 每次命中累積 1 層共鳴 (上限 3 層)
      if ((self.puppetResonance ?? 0) < 3) {
        self.puppetResonance = (self.puppetResonance || 0) + 1;
        self.puppetResonanceDecayTimer = 8.0;

        if (fctList) {
          fctList.push({
            id: `fct_resonance_${Math.random()}`,
            x: self.x,
            y: self.y - self.radius - 12,
            text: `【傀儡共鳴】${self.puppetResonance}/3層`,
            color: '#c084fc',
            fontSize: 11,
            alpha: 1.0,
            life: 0.7,
            maxLife: 0.7,
            vy: -18
          });
        }
      }

      soundEngine.playPuppetSlash();

      if (particles) {
        particles.push({
          x: enemy.x,
          y: enemy.y,
          vx: (Math.random() - 0.5) * 45,
          vy: (Math.random() - 0.5) * 45,
          radius: 18,
          color: '#c084fc',
          alpha: 0.9,
          maxLife: 0.25,
          life: 0.25,
          type: 'puppet_thread_spark'
        });
      }
    }
  }

  // Clean up destroyed puppets
  self.puppets = self.puppets.filter(p => p.hp > 0 && p.currentSegment <= 3);

  // 3. 被動二【牽線束縛】(冷卻 4.0 秒，400px 射程，造成 8 點魔法傷害，減速 40% 持續 2.5 秒，傀儡暴衝集火)
  self.puppetTetherCooldown = (self.puppetTetherCooldown ?? 4.0) - dt;
  const distToEnemyFromMaster = Math.hypot(enemy.x - self.x, enemy.y - self.y);

  if (self.puppetTetherCooldown <= 0 && distToEnemyFromMaster <= 400 && enemy.hp > 0) {
    self.puppetTetherCooldown = 4.0;
    self.puppetTetherAnimTimer = 0.45;
    self.passive2Triggers = (self.passive2Triggers || 0) + 1;

    // 降低目標 40% 移動速度，持續 2.5 秒
    enemy.isTetheredByPuppeteer = true;
    enemy.tetheredByPuppeteerTimer = 2.5;

    // 造成 8 點魔法傷害
    const bindDmg = 8;
    applyDamageWithDamageSharing(
      enemy,
      self,
      bindDmg,
      'magic',
      '牽線束縛',
      enemy.x,
      enemy.y,
      matchTime,
      fctList,
      events,
      particles
    );

    // 牽線命中後，所有存活傀儡立即優先鎖定並暴衝集火該敵人 (衝量由 150 加強至 280)
    for (const p of self.puppets) {
      if (p.hp <= 0 || p.currentSegment > 3) continue;
      const pdx = enemy.x - p.x;
      const pdy = enemy.y - p.y;
      const pd = Math.hypot(pdx, pdy) || 1;
      p.vx += (pdx / pd) * 280;
      p.vy += (pdy / pd) * 280;
      p.lineFlashTimer = 0.5;
    }

    // 累積 1 層傀儡共鳴
    if ((self.puppetResonance ?? 0) < 3) {
      self.puppetResonance = (self.puppetResonance || 0) + 1;
      self.puppetResonanceDecayTimer = 8.0;
    }

    soundEngine.playPuppetTether();

    if (particles) {
      // 命運傀儡線流光光粒
      for (let i = 0; i < 20; i++) {
        const t = i / 20;
        particles.push({
          x: self.x + (enemy.x - self.x) * t,
          y: self.y + (enemy.y - self.y) * t,
          vx: (Math.random() - 0.5) * 30,
          vy: (Math.random() - 0.5) * 30,
          radius: 2.5,
          color: i % 2 === 0 ? '#c084fc' : '#e9d5ff',
          alpha: 0.95,
          maxLife: 0.35,
          life: 0.35,
          type: 'puppet_thread_spark'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_tether_${Math.random()}`,
        x: enemy.x,
        y: enemy.y - enemy.radius - 20,
        text: '【牽線束縛】減速40%·傀儡暴衝集火！',
        color: '#c084fc',
        fontSize: 13,
        scale: 1.2,
        shakeIntensity: 4,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -24
      });
    }

    if (events) {
      events.push({
        id: `evt_tether_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        damage: bindDmg,
        skillName: '牽線束縛',
        text: `${self.name} 發射命運傀儡線！【牽線束縛】造成 ${bindDmg} 點魔法傷害，降低目標 40% 速度，令所有傀儡暴衝突進集火！`,
        badge: '牽線束縛'
      });
    }
  }

  // 4. 被動四【傀儡共鳴與木偶終幕】(CD 12秒)
  // 條件：滿 3 層共鳴 + 目標被牽線 + 傀儡存活時進入「終幕待命」；下一次傀儡命中觸發：
  // 傀儡普攻(6物傷) + 共鳴爆發(16魔傷) + 木偶終幕交叉斬擊(24魔傷) = 總計 46 點連鎖毀滅爆發！
  self.puppetFinaleCooldown = (self.puppetFinaleCooldown ?? 12.0) - dt;
  const currentPuppets = self.puppets.filter(p => p.hp > 0 && p.currentSegment <= 3);
  const isTethered = enemy.isTetheredByPuppeteer || (enemy.tetheredByPuppeteerTimer ?? 0) > 0;
  const isResonanceReady = (self.puppetResonance ?? 0) >= 3;
  const hasPuppets = currentPuppets.length > 0;

  self.puppetFinaleStandby = isResonanceReady && hasPuppets && (self.puppetFinaleCooldown <= 0);

  // 當處於終幕待命狀態，且目標被牽線，且傀儡靠近敵人 (220px內) 時觸發終幕連鎖斬擊
  const anyPuppetInRangeForFinale = currentPuppets.some(p => Math.hypot(enemy.x - p.x, enemy.y - p.y) <= 220);

  if (self.puppetFinaleStandby && isTethered && anyPuppetInRangeForFinale && enemy.hp > 0) {
    self.puppetFinaleCooldown = 12.0;
    self.puppetResonance = 0; // 終幕完成後共鳴清零
    self.puppetFinaleStandby = false;
    self.passive3Triggers = (self.passive3Triggers || 0) + 1;

    // 所有存活傀儡極速超音速交叉突進 (520 px/s)
    currentPuppets.forEach(p => {
      const dx = enemy.x - p.x;
      const dy = enemy.y - p.y;
      const d = Math.hypot(dx, dy) || 1;
      p.vx = (dx / d) * 520;
      p.vy = (dy / d) * 520;
      p.lineFlashTimer = 0.8;
      p.slashAnimTimer = 0.5;
      p.finaleDashTimer = 0.5;
    });

    // 依序觸發連鎖三段傷害：
    // 1. 傀儡普攻: 6 點物理傷害
    applyDamageWithDamageSharing(
      enemy,
      self,
      6,
      'physical',
      '木偶終幕-傀儡普攻',
      enemy.x,
      enemy.y,
      matchTime,
      fctList,
      events,
      particles
    );

    // 2. 共鳴爆發: 16 點魔法傷害
    applyDamageWithDamageSharing(
      enemy,
      self,
      16,
      'magic',
      '木偶終幕-共鳴爆發',
      enemy.x,
      enemy.y,
      matchTime,
      fctList,
      events,
      particles
    );

    // 3. 木偶終幕交叉斬擊: 24 點魔法傷害 (總計 46 點毀滅爆發)
    applyDamageWithDamageSharing(
      enemy,
      self,
      24,
      'magic',
      '木偶終幕-交叉斬擊',
      enemy.x,
      enemy.y,
      matchTime,
      fctList,
      events,
      particles
    );

    // 目標定身壓制 0.9 秒
    if (!enemy.chanshiSuperArmorTimer || enemy.chanshiSuperArmorTimer <= 0) {
      enemy.vx *= 0.05;
      enemy.vy *= 0.05;
    }

    soundEngine.playPuppetFinale();

    // 終幕紫粉衝擊波與斬光粒子
    if (particles) {
      particles.push({
        x: enemy.x,
        y: enemy.y,
        vx: 0,
        vy: 0,
        radius: 80,
        color: '#f43f5e',
        alpha: 1.0,
        maxLife: 0.55,
        life: 0.55,
        type: 'shockwave'
      });

      for (let i = 0; i < 36; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 90 + Math.random() * 220;
        particles.push({
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          radius: 3.5,
          color: i % 2 === 0 ? '#f43f5e' : '#c084fc',
          alpha: 1.0,
          maxLife: 0.5,
          life: 0.5,
          type: 'puppet_thread_spark'
        });
      }
    }

    if (fctList) {
      fctList.push({
        id: `fct_finale_${Math.random()}`,
        x: enemy.x,
        y: enemy.y - enemy.radius - 28,
        text: '★【木偶終幕】46點毀滅連鎖爆發！(普攻6+共鳴16+終幕24)',
        color: '#f43f5e',
        fontSize: 15,
        scale: 1.45,
        shakeIntensity: 8,
        alpha: 1.0,
        life: 1.2,
        maxLife: 1.2,
        vy: -32
      });
    }

    if (events) {
      events.push({
        id: `evt_finale_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        damage: 46,
        skillName: '木偶終幕',
        text: `★【木偶終幕】3層共鳴結合牽線束縛，傀儡以超音速交叉斬擊！造成 46 點毀滅爆發傷害 (普攻6 + 共鳴16 + 終幕24) 並定身壓制 0.9 秒！`,
        badge: '木偶終幕'
      });
    }
  }
}

/**
 * 一拳尹雄 (Yinyong) 被動技能狀態機與戰鬥邏輯
 * 核心：
 * 1. 尹雄一拳：22秒超長蓄力 (原地蓄力凝聚拳勢) -> 瞬間突襲至身後約50px -> 2.5秒身後宣告 -> 一拳決勝 (命中必殺擊倒，落空失敗恢復4s)
 * 2. 不死之血：HP < 35%，每2秒3%機率奇蹟回滿，冷卻12秒
 * 3. 越挫越勇：落空未命中+1層暴怒 (上限10層)，每層提供+5%傷害，永久保留
 * 4. 一拳無界：HP < 1% 或瀕死免死，鎖血1HP，展開135px黑紅領域，雙方絕對免傷4秒；4秒後領域碎裂回流，恢復10%最大生命 (36 HP)，每場限1次
 */
export function updateYinyongPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
): void {
  if (self.characterId !== 'yinyong' || self.hp <= 0) return;

  // 初始化狀態機與欄位
  if (!self.yinyongState) {
    self.yinyongState = 'SEARCHING';
    self.yinyongChargeTimer = 0;
    self.yinyongMaxCharge = 22.0;
    self.yinyongSearchTimer = 0.5;
    self.yinyongRageStacks = 0;
  }

  // 特效與動畫計時衰減
  if (self.yinyongAfterimageTimer && self.yinyongAfterimageTimer > 0) {
    self.yinyongAfterimageTimer = Math.max(0, self.yinyongAfterimageTimer - dt);
  }
  if (self.yinyongPunchAnimTimer && self.yinyongPunchAnimTimer > 0) {
    self.yinyongPunchAnimTimer = Math.max(0, self.yinyongPunchAnimTimer - dt);
  }
  if (self.yinyongMissAnimTimer && self.yinyongMissAnimTimer > 0) {
    self.yinyongMissAnimTimer = Math.max(0, self.yinyongMissAnimTimer - dt);
  }
  if (self.yinyongImmortalAnimTimer && self.yinyongImmortalAnimTimer > 0) {
    self.yinyongImmortalAnimTimer = Math.max(0, self.yinyongImmortalAnimTimer - dt);
  }
  if (self.yinyongBoundlessCollapseTimer && self.yinyongBoundlessCollapseTimer > 0) {
    self.yinyongBoundlessCollapseTimer = Math.max(0, self.yinyongBoundlessCollapseTimer - dt);
  }

  // ==========================================
  // 被動四: 一拳無界 (Boundless Punch)
  // ==========================================
  // 瀕死檢測: 若生命值 <= 1 或 <= 1% 且尚未觸發過
  if (!self.yinyongBoundlessUsed && (self.hp <= 1 || (self.hp / self.maxHp) <= 0.01)) {
    self.hp = 1;
    self.yinyongBoundlessActive = true;
    self.yinyongBoundlessDuration = 4.0;
    self.yinyongBoundlessUsed = true;
    self.passive4Triggers = (self.passive4Triggers || 0) + 1;
    soundEngine.playYinyongBoundless();

    fctList.push({
      id: `fct_boundless_${Math.random()}`,
      x: self.x,
      y: self.y - self.radius - 24,
      text: '★【一拳無界】瀕死鎖血！雙方免傷4秒！',
      color: '#ef4444',
      fontSize: 15,
      scale: 1.4,
      shakeIntensity: 8,
      alpha: 1.0,
      life: 1.2,
      maxLife: 1.2,
      vy: -30
    });

    events.push({
      id: `evt_boundless_${Math.random()}`,
      timestamp: matchTime,
      type: 'passive_trigger',
      attackerId: self.id,
      targetId: enemy.id,
      skillName: '一拳無界',
      text: `★【一拳無界】一拳尹雄觸發瀕死免死，展開 135px 黑紅領域，雙方進入 4 秒絕對免傷！暫停蓄力與判定！`,
      badge: '一拳無界'
    });
  }

  // 領域進行中處理
  if (self.yinyongBoundlessActive) {
    self.yinyongBoundlessDuration = (self.yinyongBoundlessDuration || 4.0) - dt;
    self.hp = Math.max(1, self.hp); // 結界內鎖定最低 1 HP

    // 4 秒結界結束
    if (self.yinyongBoundlessDuration <= 0) {
      self.yinyongBoundlessActive = false;
      self.yinyongBoundlessCollapseTimer = 0.6;
      soundEngine.playYinyongBoundlessEnd();

      // 4 秒結束後結界碎裂回流，尹雄恢復 10% 最大生命值 (36 HP)
      const healAmount = Math.round(self.maxHp * 0.1);
      self.hp = Math.min(self.maxHp, self.hp + healAmount);

      fctList.push({
        id: `fct_boundless_end_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 22,
        text: `★【一拳無界】結界碎裂回流！恢復 +${healAmount} HP！`,
        color: '#22c55e',
        fontSize: 14,
        scale: 1.3,
        shakeIntensity: 5,
        alpha: 1.0,
        life: 1.0,
        maxLife: 1.0,
        vy: -26
      });

      events.push({
        id: `evt_boundless_end_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        skillName: '一拳無界',
        text: `【一拳無界】4 秒結界結束碎裂回流，一拳尹雄恢復 ${healAmount} 點生命 (10%最大生命)，恢復正常戰鬥節奏！`,
        badge: '無界回流'
      });
    }

    // 結界期間暫停蓄力與判定，直接返回
    return;
  }

  // ==========================================
  // 被動二: 不死之血 (Immortal Blood)
  // ==========================================
  // 條件: HP < 35% (即 HP < 126)
  if (self.hp < self.maxHp * 0.35) {
    if (self.yinyongImmortalCooldown && self.yinyongImmortalCooldown > 0) {
      self.yinyongImmortalCooldown -= dt;
    } else {
      self.yinyongImmortalCheckTimer = (self.yinyongImmortalCheckTimer ?? 2.0) - dt;
      if (self.yinyongImmortalCheckTimer <= 0) {
        self.yinyongImmortalCheckTimer = 2.0;

        // 3% 機率回滿判定
        if (Math.random() < 0.03) {
          self.hp = self.maxHp;
          self.yinyongImmortalCooldown = 12.0;
          self.yinyongImmortalAnimTimer = 0.8;
          self.passive2Triggers = (self.passive2Triggers || 0) + 1;
          soundEngine.playYinyongImmortalBlood();

          fctList.push({
            id: `fct_immortal_${Math.random()}`,
            x: self.x,
            y: self.y - self.radius - 26,
            text: '★【不死之血】奇蹟觸發！生命值回滿至 100% (360 HP)！',
            color: '#ef4444',
            fontSize: 15,
            scale: 1.45,
            shakeIntensity: 8,
            alpha: 1.0,
            life: 1.3,
            maxLife: 1.3,
            vy: -32
          });

          events.push({
            id: `evt_immortal_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            targetId: enemy.id,
            skillName: '不死之血',
            text: `★【不死之血】一拳尹雄在極低血量下觸發 3% 奇蹟回滿，生命值直接恢復至 360 點！(進入12秒冷卻)`,
            badge: '不死之血'
          });
        }
      }
    }
  }

  // ==========================================
  // 被動一: 尹雄一拳 (One-Punch Strike) 核心狀態機
  // ==========================================
  const state = self.yinyongState || 'SEARCHING';

  if (state === 'SEARCHING') {
    self.yinyongFacingAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
    self.yinyongSearchTimer = (self.yinyongSearchTimer || 0.8) - dt;

    if (self.yinyongSearchTimer <= 0) {
      self.yinyongLockedTargetId = enemy.id as any;
      self.yinyongState = 'CHARGING';
      self.yinyongChargeTimer = 0;
      self.yinyongMaxCharge = 22.0;
      soundEngine.playYinyongChargeHum();

      fctList.push({
        id: `fct_charge_start_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 18,
        text: '【尹雄一拳】鎖定目標！原地22秒拳意蓄勢開始！',
        color: '#ef4444',
        fontSize: 13,
        scale: 1.2,
        shakeIntensity: 3,
        alpha: 1.0,
        life: 0.9,
        maxLife: 0.9,
        vy: -22
      });
    }
  } else if (state === 'CHARGING') {
    // === 核心規範：在蓄力期間 尹雄是在原地並設計拳頭 ===
    // 凝聚拳意，完全消除速度與慣性，釘立原地，專注聚氣
    self.vx = 0;
    self.vy = 0;
    self.yinyongFacingAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);

    const prevCharge = self.yinyongChargeTimer || 0;
    const currentCharge = prevCharge + dt;
    self.yinyongChargeTimer = currentCharge;

    // 階段里程碑共鳴音效
    if (prevCharge < 5.0 && currentCharge >= 5.0) {
      soundEngine.playYinyongChargeHum();
    } else if (prevCharge < 14.0 && currentCharge >= 14.0) {
      soundEngine.playYinyongChargeHum();
    } else if (prevCharge < 21.0 && currentCharge >= 21.0) {
      soundEngine.playYinyongChargeHum();
    }

    // 22 秒蓄力完成 -> 瞬間突襲
    if (currentCharge >= (self.yinyongMaxCharge || 22.0)) {
      // 1. 原地留下 0.15 秒紅黑殘像
      self.yinyongAfterimageX = self.x;
      self.yinyongAfterimageY = self.y;
      self.yinyongAfterimageTimer = 0.15;

      // 2. 瞬移至目標身後約 50px
      const enemySpeed = Math.hypot(enemy.vx, enemy.vy);
      const enemyDir = enemySpeed > 20 ? Math.atan2(enemy.vy, enemy.vx) : Math.atan2(enemy.y - self.y, enemy.x - self.x);
      
      let targetX = enemy.x - Math.cos(enemyDir) * 50;
      let targetY = enemy.y - Math.sin(enemyDir) * 50;

      // 邊界防卡安全限制
      const pad = self.radius + 18;
      targetX = Math.max(30 + pad, Math.min(800 - 30 - pad, targetX));
      targetY = Math.max(30 + pad, Math.min(600 - 30 - pad, targetY));

      self.x = targetX;
      self.y = targetY;
      self.vx = 0;
      self.vy = 0;

      // 3. 轉入身後宣告 2.5 秒
      self.yinyongState = 'DECLARING';
      self.yinyongDeclareTimer = 2.5;
      self.yinyongPunchExecuted = false;
      self.yinyongFacingAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);

      soundEngine.playYinyongTeleport();
      soundEngine.playYinyongDeclare();

      fctList.push({
        id: `fct_tele_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 22,
        text: '★【瞬間突襲】已移至敵方身後！身後宣告 2.5s！',
        color: '#fbbf24',
        fontSize: 14,
        scale: 1.35,
        shakeIntensity: 6,
        alpha: 1.0,
        life: 1.1,
        maxLife: 1.1,
        vy: -28
      });

      events.push({
        id: `evt_tele_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        skillName: '瞬間突襲',
        text: `【瞬間突襲】一拳尹雄 22 秒原地極限蓄力完成！瞬間位移至 ${enemy.name} 身後 50px，展開 2.5 秒身後宣告！`,
        badge: '瞬間突襲'
      });
    }
  } else if (state === 'DECLARING') {
    // 身後宣告 2.5 秒：朝向敵人鎖定
    self.yinyongFacingAngle = Math.atan2(enemy.y - self.y, enemy.x - self.x);
    self.vx *= 0.1;
    self.vy *= 0.1;

    self.yinyongDeclareTimer = (self.yinyongDeclareTimer || 2.5) - dt;

    if (self.yinyongDeclareTimer <= 0 && !self.yinyongPunchExecuted) {
      self.yinyongPunchExecuted = true;
      self.yinyongState = 'PUNCHING';
      self.yinyongPunchAnimTimer = 0.4;

      // Hitbox 判定 (在尹雄朝向 enemy 前方約 28px 處)
      const angle = self.yinyongFacingAngle;
      const hx = self.x + Math.cos(angle) * 28;
      const hy = self.y + Math.sin(angle) * 28;
      self.yinyongPunchHitboxX = hx;
      self.yinyongPunchHitboxY = hy;
      self.yinyongPunchHitboxRadius = 28;

      const dist = Math.hypot(enemy.x - hx, enemy.y - hy);
      const isHit = dist <= (28 + enemy.radius);

      if (isHit) {
        // === 命中：一拳決勝／擊倒 ===
        const rageBonus = 1 + (self.yinyongRageStacks || 0) * 0.05;
        const totalDamage = Math.round((enemy.hp + 999) * rageBonus);

        soundEngine.playYinyongPunch();

        applyDamageWithDamageSharing(
          enemy,
          self,
          totalDamage,
          'true',
          '尹雄一拳·一擊必殺',
          hx,
          hy,
          matchTime,
          fctList,
          events,
          particles
        );

        self.passive1Triggers = (self.passive1Triggers || 0) + 1;

        fctList.push({
          id: `fct_punch_hit_${Math.random()}`,
          x: hx,
          y: hy - 32,
          text: `★★★【一拳決勝】一擊必殺！${totalDamage} 毀滅重拳！`,
          color: '#facc15',
          fontSize: 16,
          scale: 1.55,
          shakeIntensity: 12,
          alpha: 1.0,
          life: 1.5,
          maxLife: 1.5,
          vy: -38
        });

        events.push({
          id: `evt_punch_kill_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: enemy.id,
          skillName: '尹雄一拳',
          text: `★★★【尹雄一拳】身後宣告結束，一拳決勝！造成 ${totalDamage} 點必殺傷害！擊倒 ${enemy.name}！`,
          badge: '一拳必殺'
        });

        self.yinyongState = 'COOLDOWN';
        self.yinyongSuccessCooldown = 8.0;
      } else {
        // === 未命中：越挫越勇 +1 層暴怒 ===
        self.yinyongRageStacks = Math.min(10, (self.yinyongRageStacks || 0) + 1);
        self.passive3Triggers = (self.passive3Triggers || 0) + 1;
        self.yinyongMissAnimTimer = 0.6;
        soundEngine.playYinyongMiss();

        fctList.push({
          id: `fct_punch_miss_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 22,
          text: `落空！【越挫越勇】暴怒層數 ${self.yinyongRageStacks}/10 (+${self.yinyongRageStacks * 5}%傷)`,
          color: '#f97316',
          fontSize: 13,
          scale: 1.25,
          shakeIntensity: 4,
          alpha: 1.0,
          life: 1.1,
          maxLife: 1.1,
          vy: -24
        });

        events.push({
          id: `evt_punch_miss_${Math.random()}`,
          timestamp: matchTime,
          type: 'passive_trigger',
          attackerId: self.id,
          targetId: enemy.id,
          skillName: '越挫越勇',
          text: `【越挫越勇】一拳未命中！激發暴怒！層數提升至 ${self.yinyongRageStacks}/10 (提供 +${self.yinyongRageStacks * 5}% 額外傷害，永久保留)！`,
          badge: '越挫越勇'
        });

        self.yinyongState = 'FAIL_RECOVERY';
        self.yinyongFailRecoveryTimer = 4.0;
      }
    }
  } else if (state === 'COOLDOWN') {
    // 成功後冷卻 8 秒
    self.yinyongSuccessCooldown = (self.yinyongSuccessCooldown || 8.0) - dt;
    if (self.yinyongSuccessCooldown <= 0) {
      self.yinyongState = 'SEARCHING';
      self.yinyongSearchTimer = 1.0;
    }
  } else if (state === 'FAIL_RECOVERY') {
    // 失敗恢復 4 秒
    self.yinyongFailRecoveryTimer = (self.yinyongFailRecoveryTimer || 4.0) - dt;
    if (self.yinyongFailRecoveryTimer <= 0) {
      self.yinyongState = 'SEARCHING';
      self.yinyongSearchTimer = 1.0;
    }
  }
}

/**
 * =========================================================================================
 * 曼麥亞・軍子｜神之從刃 (Manyaiya Junko) 核心被動與主動戰鬥系統
 * 核心機制：記憶斷片 (0~3層獨立計算)
 * 技能一：神瞳殘憶・天龍之眼 (異瞳雙色、移速+20%、易傷+25%、+12神聖傷害)
 * 技能二：神箭・白縛疾嵐 (850px/s神箭、減速25%、2層定身0.5s、+1記憶斷片)
 * 技能三：聖帶・斷憶縛界 (拉回80/100px、束縛0.8~1.2s 或 飛錨拉牆220/260px)
 * 技能四：神刃・弒國終章 (完全體10s、移速+15%免減速、1100px/s連環穿透、收割刷新+解放衝擊波)
 * =========================================================================================
 */
export function updateManyaiyaPassiveSkills(
  self: BallState,
  enemy: BallState,
  dt: number,
  matchTime: number,
  projectiles: Projectile[],
  fctList: FloatingText[],
  events: CombatEvent[],
  particles: Particle[]
) {
  if (self.characterId !== 'manyaiya') return;
  if (self.hp <= 0 || enemy.hp <= 0) return;

  // 初始化軍子狀態容器
  if (!self.junkoMemoryFragments) self.junkoMemoryFragments = {};
  if (!self.junkoAwakenCooldowns) self.junkoAwakenCooldowns = {};

  // 更新敵方受到的減速與束縛計時
  if ((enemy.slowedByJunkoTimer ?? 0) > 0) {
    enemy.slowedByJunkoTimer = Math.max(0, (enemy.slowedByJunkoTimer ?? 0) - dt);
    enemy.isSlowedByJunko = enemy.slowedByJunkoTimer > 0;
  }
  if ((enemy.boundByJunkoTimer ?? 0) > 0) {
    enemy.boundByJunkoTimer = Math.max(0, (enemy.boundByJunkoTimer ?? 0) - dt);
    enemy.isBoundByJunko = enemy.boundByJunkoTimer > 0;
  }
  if ((enemy.snaredByJunkoTimer ?? 0) > 0) {
    enemy.snaredByJunkoTimer = Math.max(0, (enemy.snaredByJunkoTimer ?? 0) - dt);
    enemy.isSnaredByJunko = enemy.snaredByJunkoTimer > 0;
  }

  // 1. 更新各冷卻計時器
  for (const eId of Object.keys(self.junkoAwakenCooldowns)) {
    if (self.junkoAwakenCooldowns[eId] > 0) {
      self.junkoAwakenCooldowns[eId] = Math.max(0, self.junkoAwakenCooldowns[eId] - dt);
    }
  }

  // 異瞳覺醒持續時間倒數
  if (self.junkoEyeAwakened) {
    self.junkoEyeAwakenTimer = (self.junkoEyeAwakenTimer || 5.0) - dt;
    if (self.junkoEyeAwakenTimer <= 0) {
      self.junkoEyeAwakened = false;
      self.junkoAwakenBonusReady = false;
    }
  }

  // 聖帶拉扯視覺動畫計時
  if (self.junkoTetherPullTimer && self.junkoTetherPullTimer > 0) {
    self.junkoTetherPullTimer -= dt;
    if (self.junkoTetherPullTimer <= 0) {
      self.junkoTetherPulling = false;
    }
  }

  // 神之騎士完全體持續時間與減速免疫
  if (self.junkoHolyKnightActive) {
    self.junkoHolyKnightDuration = (self.junkoHolyKnightDuration || 10.0) - dt;
    if (self.junkoHolyKnightDuration <= 0) {
      self.junkoHolyKnightActive = false;
      self.junkoHolyKnightCooldown = 30.0;
      self.junkoDashesRemaining = 0;
      self.junkoIsDashing = false;

      // 若在完全體期間取得擊殺，觸發【記憶解放】神聖衝擊波
      if (self.junkoKnightKills && self.junkoKnightKills > 0) {
        soundEngine.playJunkoMemoryLiberation();
        const kx = enemy.x - self.x;
        const ky = enemy.y - self.y;
        const kdist = Math.hypot(kx, ky) || 1;
        enemy.vx += (kx / kdist) * 500;
        enemy.vy += (ky / kdist) * 500;

        if (particles) {
          particles.push({
            x: self.x,
            y: self.y,
            vx: 0,
            vy: 0,
            radius: 120,
            color: '#fbbf24',
            alpha: 1.0,
            maxLife: 0.5,
            life: 0.5,
            type: 'shockwave'
          });
        }

        if (fctList) {
          fctList.push({
            id: `fct_junko_liberation_${Math.random()}`,
            x: self.x,
            y: self.y - self.radius - 32,
            text: '★★★【記憶解放】神聖衝擊波震退強敵！',
            color: '#fef08a',
            fontSize: 14,
            scale: 1.4,
            shakeIntensity: 8,
            alpha: 1.0,
            life: 1.2,
            maxLife: 1.2,
            vy: -26
          });
        }

        if (events) {
          events.push({
            id: `evt_junko_liberation_${Math.random()}`,
            timestamp: matchTime,
            type: 'passive_trigger',
            attackerId: self.id,
            targetId: enemy.id,
            skillName: '記憶解放',
            text: `${self.name} 完全體結束，綻放【記憶解放】神聖衝擊波強力擊退全場！`,
            badge: '記憶解放'
          });
        }
      }
    }
  } else {
    self.junkoHolyKnightCooldown = (self.junkoHolyKnightCooldown ?? 8.0) - dt;
  }

  // 2. 異瞳雙色粒子視覺特效 (天龍金紅 + 記憶青銀)
  if (self.junkoEyeAwakened && particles && Math.random() < 0.45) {
    // 右眼：金色/緋紅
    particles.push({
      x: self.x + 6,
      y: self.y - 4,
      vx: (Math.random() - 0.5) * 20,
      vy: -15 - Math.random() * 20,
      radius: 2.2,
      color: Math.random() > 0.4 ? '#fbbf24' : '#f43f5e',
      alpha: 1.0,
      maxLife: 0.25,
      life: 0.25,
      type: 'spark'
    });
    // 左眼：青藍/純銀白
    particles.push({
      x: self.x - 6,
      y: self.y - 4,
      vx: (Math.random() - 0.5) * 20,
      vy: -15 - Math.random() * 20,
      radius: 2.2,
      color: Math.random() > 0.4 ? '#38bdf8' : '#f8fafc',
      alpha: 1.0,
      maxLife: 0.25,
      life: 0.25,
      type: 'spark'
    });
  }

  // 3. 處理突進中的位移與判定矩形 (弒國突進)
  if (self.junkoIsDashing) {
    self.junkoDashTimer = (self.junkoDashTimer || 0) - dt;
    const ang = self.junkoDashAngle || 0;
    const dashSpd = 1100;
    const moveStep = dashSpd * dt;
    self.x += Math.cos(ang) * moveStep;
    self.y += Math.sin(ang) * moveStep;
    self.x = Math.max(25, Math.min(775, self.x));
    self.y = Math.max(25, Math.min(575, self.y));

    // 突進軌跡殘影粒子
    if (particles && Math.random() < 0.7) {
      particles.push({
        x: self.x,
        y: self.y,
        vx: -Math.cos(ang) * 40,
        vy: -Math.sin(ang) * 40,
        radius: 12,
        color: '#ffffff',
        alpha: 0.8,
        maxLife: 0.18,
        life: 0.18,
        type: 'spark'
      });
    }

    // 判定矩形穿透判定 (120 x 45px 沿突進方向)
    if (!self.junkoDashHitTargets) self.junkoDashHitTargets = {};
    if (!self.junkoDashHitTargets[enemy.id]) {
      const edx = enemy.x - self.x;
      const edy = enemy.y - self.y;
      const dist = Math.hypot(edx, edy);
      if (dist <= 65) {
        self.junkoDashHitTargets[enemy.id] = true;
        // 有效攻擊 +1 層記憶斷片 (上限3層)
        const oldMem = self.junkoMemoryFragments[enemy.id] || 0;
        const newMem = Math.min(3, oldMem + 1);
        self.junkoMemoryFragments[enemy.id] = newMem;
        if (newMem >= 3) enemy.junkoVulnerableStacks = 1;

        const has3Frags = newMem >= 3;
        // 基礎 10 點物理傷害，若目標處於 3 層斷片追加 15 點神聖真實傷害
        const baseDmg = 10;
        const holyDmg = has3Frags ? 15 : 0;
        const totalDmg = baseDmg + holyDmg;

        applyDamageWithDamageSharing(
          enemy,
          self,
          totalDmg,
          has3Frags ? 'true' : 'physical',
          '弒國突進',
          enemy.x,
          enemy.y,
          matchTime,
          fctList,
          events,
          particles
        );

        soundEngine.playOverdrive();

        // 檢查收割機制 (突進擊殺目標刷新 +1 次突進並延長形態 3 秒，單次形態最多 3 次)
        if (enemy.hp <= 0) {
          self.junkoKnightKills = (self.junkoKnightKills || 0) + 1;
          if ((self.junkoTotalDashesUsedInForm || 0) < 3) {
            self.junkoDashesRemaining = Math.min(3, (self.junkoDashesRemaining || 0) + 1);
            self.junkoHolyKnightDuration = (self.junkoHolyKnightDuration || 0) + 3.0;
            soundEngine.playJunkoKillRefresh();

            if (fctList) {
              fctList.push({
                id: `fct_junko_reap_${Math.random()}`,
                x: self.x,
                y: self.y - self.radius - 30,
                text: '★★★【弒國收割刷新】突進+1！形態延長+3秒！',
                color: '#f43f5e',
                fontSize: 14,
                scale: 1.35,
                shakeIntensity: 7,
                alpha: 1.0,
                life: 1.3,
                maxLife: 1.3,
                vy: -26
              });
            }
          }
        }
      }
    }

    if (self.junkoDashTimer <= 0) {
      self.junkoIsDashing = false;
    }
  }

  // 4. 觸發【神之騎士完全體】(Passive 4)
  // 解鎖條件：當軍子觸發【異瞳覺醒】且目標身上存在記憶斷片時解鎖 (CD 30s)
  const enemyFragments = self.junkoMemoryFragments[enemy.id] || 0;
  if (
    !self.junkoHolyKnightActive &&
    (self.junkoHolyKnightCooldown ?? 0) <= 0 &&
    self.junkoEyeAwakened &&
    enemyFragments >= 1
  ) {
    self.junkoHolyKnightActive = true;
    self.junkoHolyKnightDuration = 10.0;
    self.junkoDashesRemaining = 2;
    self.junkoTotalDashesUsedInForm = 0;
    self.junkoKnightKills = 0;
    soundEngine.playJunkoHolyForm();

    if (fctList) {
      fctList.push({
        id: `fct_junko_holy_form_${Math.random()}`,
        x: self.x,
        y: self.y - self.radius - 32,
        text: '★★★【神之騎士完全體】神刃從刃浮現！免疫減速！移速+15%！獲得2次弒國突進！',
        color: '#fbbf24',
        fontSize: 14,
        scale: 1.4,
        shakeIntensity: 8,
        alpha: 1.0,
        life: 1.6,
        maxLife: 1.6,
        vy: -26
      });
    }

    if (events) {
      events.push({
        id: `evt_junko_holy_form_${Math.random()}`,
        timestamp: matchTime,
        type: 'passive_trigger',
        attackerId: self.id,
        targetId: enemy.id,
        skillName: '神刃・弒國終章',
        text: `${self.name} 降臨【神之騎士完全體】！神之從刃展現弒國威能，獲得 2 次 1100px/s 弒國穿透突進！`,
        badge: '神之騎士'
      });
    }
  }

  // 5. 執行【弒國突進】充能釋放
  if (
    self.junkoHolyKnightActive &&
    !self.junkoIsDashing &&
    (self.junkoDashesRemaining || 0) > 0
  ) {
    const dx = enemy.x - self.x;
    const dy = enemy.y - self.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 300) {
      self.junkoIsDashing = true;
      self.junkoDashTimer = 250 / 1100; // ~0.23s
      self.junkoDashStartX = self.x;
      self.junkoDashStartY = self.y;
      const ang = Math.atan2(dy, dx);
      self.junkoDashAngle = ang;
      self.junkoDashTargetX = self.x + Math.cos(ang) * 250;
      self.junkoDashTargetY = self.y + Math.sin(ang) * 250;
      self.junkoDashHitTargets = {};
      self.junkoDashesRemaining = Math.max(0, (self.junkoDashesRemaining || 1) - 1);
      self.junkoTotalDashesUsedInForm = (self.junkoTotalDashesUsedInForm || 0) + 1;
      soundEngine.playJunkoGodbladeDash();
    }
  }

  // 6. 技能二：神箭・白縛疾嵐 (Passive 2)
  // 每 5 秒 (形態下 3 秒) 從手臂繃帶中射出白縛神箭 (850px/s)
  self.junkoArrowCooldown = (self.junkoArrowCooldown ?? 1.0) - dt;
  const arrowMaxRange = self.junkoHolyKnightActive ? 400 : 320;
  const dxToEnemy = enemy.x - self.x;
  const dyToEnemy = enemy.y - self.y;
  const distToEnemy = Math.hypot(dxToEnemy, dyToEnemy);

  if ((self.junkoArrowCooldown ?? 0) <= 0 && distToEnemy <= arrowMaxRange + 40) {
    self.junkoArrowCooldown = self.junkoHolyKnightActive ? 3.0 : 5.0;
    const ang = Math.atan2(dyToEnemy, dxToEnemy);
    const spd = 850;
    projectiles.push({
      id: `proj_junko_arrow_${Math.random()}`,
      ownerId: self.id,
      x: self.x + Math.cos(ang) * (self.radius + 10),
      y: self.y + Math.sin(ang) * (self.radius + 10),
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      damage: self.junkoHolyKnightActive ? 5 : 4,
      type: 'junko_bandage_arrow',
      color: '#ffffff',
      radius: 6,
      maxLife: 1.2,
      life: 1.2,
      angle: ang,
      trail: []
    });
    soundEngine.playJunkoArrowLaunch();
  }

  // 7. 技能三：聖帶・斷憶縛界 (Passive 3)
  // 每 7 秒 (形態下 5 秒) 甩出神聖白繃帶 (射程 280px)
  self.junkoTetherCooldown = (self.junkoTetherCooldown ?? 2.5) - dt;
  if ((self.junkoTetherCooldown ?? 0) <= 0) {
    self.junkoTetherCooldown = self.junkoHolyKnightActive ? 5.0 : 7.0;

    // 【判定一·命中敵人】：距離 <= 280px
    if (distToEnemy <= 280) {
      soundEngine.playJunkoTetherCast(false);
      self.junkoTetherPulling = true;
      self.junkoTetherPullTimer = 0.45;
      self.junkoTetherTargetX = enemy.x;
      self.junkoTetherTargetY = enemy.y;

      // 5 點物理傷害 + 1 層記憶斷片
      const oldMem = self.junkoMemoryFragments[enemy.id] || 0;
      const newMem = Math.min(3, oldMem + 1);
      self.junkoMemoryFragments[enemy.id] = newMem;
      if (newMem >= 3) enemy.junkoVulnerableStacks = 1;

      applyDamageWithDamageSharing(
        enemy,
        self,
        5,
        'physical',
        '聖帶縛界',
        enemy.x,
        enemy.y,
        matchTime,
        fctList,
        events,
        particles
      );

      // 強力拉動 80px (形態下 100px)
      const pullDist = self.junkoHolyKnightActive ? 100 : 80;
      const pullDirX = (self.x - enemy.x) / (distToEnemy || 1);
      const pullDirY = (self.y - enemy.y) / (distToEnemy || 1);
      enemy.x += pullDirX * pullDist;
      enemy.y += pullDirY * pullDist;
      enemy.vx += pullDirX * 300;
      enemy.vy += pullDirY * 300;
      enemy.x = Math.max(25, Math.min(775, enemy.x));
      enemy.y = Math.max(25, Math.min(575, enemy.y));

      // 束縛 0.8s (若目標身上有 2~3 層記憶延長至 1.2s)
      const bindTime = oldMem >= 2 ? 1.2 : 0.8;
      enemy.isBoundByJunko = true;
      enemy.boundByJunkoTimer = Math.max(enemy.boundByJunkoTimer || 0, bindTime);

      if (fctList) {
        fctList.push({
          id: `fct_junko_tether_hit_${Math.random()}`,
          x: enemy.x,
          y: enemy.y - enemy.radius - 18,
          text: `-5 聖帶拉回${pullDist}px 束縛${bindTime}s (記憶[${newMem}/3])`,
          color: '#e2e8f0',
          fontSize: 12,
          scale: 1.2,
          alpha: 1.0,
          life: 0.9,
          maxLife: 0.9,
          vy: -22
        });
      }

      // 檢查異瞳覺醒
      if (newMem >= 3) {
        const awakenCd = self.junkoAwakenCooldowns?.[enemy.id] || 0;
        if (awakenCd <= 0 && !self.junkoEyeAwakened) {
          self.junkoEyeAwakened = true;
          self.junkoEyeAwakenTimer = 5.0;
          self.junkoAwakenBonusReady = true;
          self.junkoAwakenCooldowns[enemy.id] = 8.0;
          soundEngine.playJunkoAwakening();
        }
      }
    } else {
      // 【判定二·未命中/瞄準地形】：繃帶釘入最近牆體，軍子迅猛拉向該點 (最高 220px / 形態 260px)
      soundEngine.playJunkoTetherCast(true);
      self.junkoTetherPulling = true;
      self.junkoTetherPullTimer = 0.35;

      // 尋找最近牆壁
      const dLeft = self.x - 20;
      const dRight = 780 - self.x;
      const dTop = self.y - 20;
      const dBottom = 580 - self.y;
      const minWallDist = Math.min(dLeft, dRight, dTop, dBottom);
      let wallTargetX = self.x;
      let wallTargetY = self.y;
      if (minWallDist === dLeft) wallTargetX = 25;
      else if (minWallDist === dRight) wallTargetX = 775;
      else if (minWallDist === dTop) wallTargetY = 25;
      else wallTargetY = 575;

      self.junkoTetherTargetX = wallTargetX;
      self.junkoTetherTargetY = wallTargetY;

      const flyDist = Math.min(minWallDist, self.junkoHolyKnightActive ? 260 : 220);
      const wdx = wallTargetX - self.x;
      const wdy = wallTargetY - self.y;
      const wdist = Math.hypot(wdx, wdy) || 1;
      self.x += (wdx / wdist) * flyDist;
      self.y += (wdy / wdist) * flyDist;
      self.vx += (wdx / wdist) * 450;
      self.vy += (wdy / wdist) * 450;
      self.x = Math.max(25, Math.min(775, self.x));
      self.y = Math.max(25, Math.min(575, self.y));

      if (fctList) {
        fctList.push({
          id: `fct_junko_wall_tether_${Math.random()}`,
          x: self.x,
          y: self.y - self.radius - 16,
          text: `【聖帶飛錨】拉向牆壁迅猛突進！`,
          color: '#93c5fd',
          fontSize: 12,
          scale: 1.15,
          alpha: 1.0,
          life: 0.8,
          maxLife: 0.8,
          vy: -20
        });
      }
    }
  }
}




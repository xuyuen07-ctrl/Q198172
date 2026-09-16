import { RoleCategory } from './roles';

export type CharacterId = 'oba' | 'huotong' | 'hailaise' | 'lingyinsi' | 'chanshi' | 'huangzuan' | 'lanzuan' | 'fenzuan' | 'baizuan' | 'xukongshou' | 'fan' | 'tunshimozu' | 'mimi' | 'jiandaoshou' | 'dina' | 'jianxian' | 'longshen' | 'zhizhu' | 'xin' | 'kuileishi' | 'yinyong' | 'manyaiya';

export interface CombatPuppet {
  id: string;
  ownerId: 'p1' | 'p2';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number; // 13px small sphere puppet
  currentSegment: 1 | 2 | 3; // 1: wood shell, 2: joint magic, 3: magic core
  segmentHp: number; // 0 ~ 20
  maxSegmentHp: number; // 20
  totalHp: number; // 0 ~ 60
  hp: number; // alias for totalHp (for convenience)
  maxHp?: number;
  mass?: number;
  stopTimer: number; // 0.15s pause when segment broken
  attackCooldown: number; // 1.0s interval
  attackAnimTimer: number; // 0.2s visual attack glow
  slashAnimTimer?: number;
  slashCooldown?: number;
  hitFlashTimer: number; // hit white flash
  lineFlashTimer: number; // line shimmer
  shieldActiveTimer: number; // puppet aegis shield active
  finaleDashTimer: number; // finale cross-dash
  createdTime: number;
  targetId?: string;
  totalSegments?: number;
  targetX?: number;
  targetY?: number;
}

export interface SpiderMiniSummon {
  id: string;
  ownerId: 'p1' | 'p2';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number; // ~9px
  hp: number;     // 8 HP
  maxHp: number;  // 8 HP
  duration?: number; // ~10s
  maxDuration?: number;
  life: number;
  maxLife: number;
  attackCooldown: number;
  legPhase: number;
  targetId?: string;
  createdTime?: number;
  lastHitTime?: number;
}

export interface SpiderWebZone {
  id: string;
  ownerId?: 'p1' | 'p2';
  x: number;
  y: number;
  radius: number; // ~45px
  duration: number; // 2.5s
  maxDuration: number;
  createdTime?: number;
}

export interface MimiGrowthPack {
  id: string;
  type: 'life' | 'attack';
  x: number;
  y: number;
  radius: number;
  cycleId: number;
  createdAt: number;
  pulsePhase?: number;
}

export interface PassiveSkill {
  id: string;
  name: string;
  type: 1 | 2 | 3 | 4; // 被動一 (基礎戰鬥能力), 被動二 (碰撞/反彈/攻擊), 被動三 (特殊機制), 被動四 (戰術專精 / 小被動4)
  description: string;
  iconName: string;
  badgeText?: string;
  energyCost?: number; // 技能釋放所需消耗的能量值
}

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  title: string;
  role: string;
  primaryRole?: RoleCategory;
  primaryRoleName?: string;
  subClasses?: string[];
  maxHp: number;
  attackDamage: number;
  speedRatio: number; // e.g. 0.92 for 92%, 0.84 for 84%, 0.96 for 96%, 0.98 for 98%
  baseSpeed: number;  // px/s
  size: number;       // base radius representation
  mass: number;       // 1.25, 1.45, 0.85, 0.9, 0.90
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowColor: string;
  avatarIcon: string;
  passives: [PassiveSkill, PassiveSkill, PassiveSkill, PassiveSkill] | PassiveSkill[];
  equipment?: CharacterEquipment;
}

export interface CharacterEquipment {
  outfitName: string;         // 專屬外觀衣服名稱 (例如: 「雷霆動力泰坦戰甲」)
  outfitType: string;         // 服裝類型 (例如: 「軍工重裝防彈裝甲衣」)
  outfitDesc: string;         // 外觀衣服精工細節描述
  weaponName: string;         // 專屬神兵裝備名稱 (例如: 「雙聯納米脈衝指虎」)
  weaponDesc: string;         // 裝備武器細節描述
  accessoryName: string;      // 專屬配件/飾品名稱 (例如: 「動能聚變渦輪反應爐」)
  accessoryDesc: string;      // 飾品細節描述
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface LingyinsiClone {
  id: string;
  ownerId: 'p1' | 'p2';
  x: number;
  y: number;
  radius: number;
  maxHp: number; // 17 (5% of 340)
  hp: number;
  createdTime: number;
  spawnTime?: number;    // For materializing animation
  lastHitTime?: number;  // For hit flash and fracture lines
}

export interface OrbitingGreenOrb {
  id: string;
  angle: number;
  radius: number;
  active: boolean;
  orbitTilt?: number;    // Distinct orbit tilt angle
}

export interface LanzuanBlueOrb {
  id: string;
  ownerId: 'p1' | 'p2';
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number; // 3 HP
  shootCooldown: number; // Shoots energy bullet every 1.5s - 2.0s
  createdTime: number;
  lastHitTime?: number;
  flashTimer?: number; // Flash effect when firing bullet
}

export interface BaizuanMirrorClone {
  id: string;
  ownerId: 'p1' | 'p2';
  targetCharId: CharacterId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number; // 2 segments (扣2次攻擊)
  maxHp: number; // 2
  duration: number; // 最多存在15秒
  createdTime: number;
  lastHitTime?: number;
  mimicSkillCooldown: number; // 模仿技能一冷卻計時
}

export interface VoidRift {
  id: string;
  ownerId: 'p1' | 'p2';
  entranceX: number;
  entranceY: number;
  exitX: number;
  exitY: number;
  radius: number;
  duration: number; // seconds remaining
  hasTeleported: boolean;
  trappedEnemy: boolean;
  trappedTimer: number; // 2s when enemy trapped
  createdTime: number;
}

// ==========================================
// 蒂納 (Dina) 專屬事件與狀態機資料結構
// ==========================================
export type WhiteLightProjectileState = 'CREATED' | 'ACTIVE' | 'HIT' | 'EXPIRED' | 'CONSUMED';
export type WhiteLightEnergyState = 'CREATED' | 'AVAILABLE' | 'RESERVED_FOR_ABSORPTION' | 'ABSORBED' | 'RESERVED_FOR_FUSION' | 'CONSUMED' | 'EXPIRED';
export type DarkLightChargeState = 'EMPTY' | 'CHARGING' | 'READY' | 'RESERVED' | 'FIRED' | 'CONSUMED' | 'EXPIRED';
export type DarkLightActiveState = 'CREATED' | 'ACTIVE' | 'PAIRED' | 'CONSUMED' | 'EXPIRED';
export type FusionWindowState = 'OPEN' | 'PAIRING' | 'CLOSED' | 'EXPIRED';
export type FusionEventState = 'PENDING' | 'VALIDATED' | 'RESOLVED' | 'CANCELLED';

export interface WhiteLightEnergy {
  eventId: string;
  sourceProjectileId: string;
  state: WhiteLightEnergyState;
  createdAt: number;
  consumed: boolean;
  reservedBy: string | null;
  absorptionOwner: string | null;
  fusionOwner: string | null;
  x?: number;
  y?: number;
}

export interface FusionWindow {
  windowId: string;
  darkLightEventId: string;
  openedAt: number;
  expiresAt: number;
  startTime?: number;
  endTime?: number;
  isActive?: boolean;
  used?: boolean;
  isPerfect?: boolean;
  state: FusionWindowState;
  pairedWhiteLightEventId: string | null;
  fusionEventId: string | null;
}

export interface FusionEvent {
  eventId: string;
  fusionType: 'regular' | 'perfect';
  state: FusionEventState;
  createdAt: number;
  damageResolved: boolean;
  effectApplied?: 'burn' | 'slow' | 'immobilize';
  targetId?: 'p1' | 'p2';
  damage: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  type:
    | 'spark'
    | 'smoke'
    | 'flame'
    | 'impact'
    | 'trail'
    | 'shockwave'
    | 'gold_spark'
    | 'fire_ember'
    | 'magma_shard'
    | 'lightning'
    | 'arcane_spark'
    | 'purple_beam'
    | 'magic_rune'
    | 'collision_streak'
    | 'psionic_arrow_spark'
    | 'spirit_dissolve'
    | 'green_orb_spark'
    | 'energy_suction'
    | 'flame_jet'
    | 'shield_barrier'
    | 'residual_fire'
    | 'summon_mandala'
    | 'starburst'
    | 'kinetic_shard'
    | 'energy_ring_collapse'
    | 'zen_aura_spark'
    | 'zen_bell_shield'
    | 'zen_heal_core'
    | 'zen_shockwave'
    | 'zen_slow_ring'
    | 'zen_pulse'
    | 'zen_heal_spark'
    | 'huangzuan_spark'
    | 'huangzuan_arc'
    | 'huangzuan_bolt'
    | 'huangzuan_shockwave'
    | 'huangzuan_field_ring'
    | 'huangzuan_collapse'
    | 'lanzuan_wave'
    | 'lanzuan_spark'
    | 'lanzuan_orb_spark'
    | 'lanzuan_ray'
    | 'lanzuan_emotion_ring'
    | 'lanzuan_emotion_burst'
    | 'lanzuan_shard'
    | 'fenzuan_spark'
    | 'fenzuan_shield_trail'
    | 'fenzuan_shield_ring'
    | 'fenzuan_field_ring'
    | 'fenzuan_field_ripple'
    | 'fenzuan_bubble'
    | 'fenzuan_spike_shard'
    | 'fenzuan_bubble_pop'
    | 'baizuan_spark'
    | 'baizuan_clone_shard'
    | 'baizuan_mirror_crack'
    | 'baizuan_shining_ring'
    | 'baizuan_shining_wave'
    | 'baizuan_blanch_aura'
    | 'baizuan_deathray_beam'
    | 'baizuan_deathray_impact'
    | 'baizuan_crystal_spark'
    | 'baizuan_crystal_trail'
    | 'oba_sonic_cone'
    | 'oba_combo_blast'
    | 'huotong_conflagration'
    | 'hailaise_void_sigil'
    | 'chanshi_mandala_lotus'
    | 'baizuan_prism_lens'
    | 'void_spark'
    | 'void_burst'
    | 'void_rift_swirl'
    | 'void_mark_sigil'
    | 'void_phantom_shadow'
    | 'void_fangs_bite'
    | 'void_cage_chain'
    | 'fan_arrow_spark'
    | 'fan_arrow_trail'
    | 'fan_arrow_afterimage'
    | 'fan_hit_stacked_ring'
    | 'fan_hunter_mark_ring'
    | 'fan_hunter_burst'
    | 'fan_roll_afterimage'
    | 'fan_overclock_spark'
    | 'devour_implosion'
    | 'gluttony_burst_shockwave'
    | 'gluttony_burst_spark'
    | 'shard_pulse'
    | 'mimi_heart_spark'
    | 'mimi_heart_trail'
    | 'mimi_claw_slash'
    | 'mimi_bleed_drop'
    | 'mimi_charm_heart'
    | 'mimi_pack_burst'
    | 'mimi_pack_absorb'
    | 'mimi_heart_explosion'
    | 'jiandao_snip_cut'
    | 'jiandao_mist_wisp'
    | 'jiandao_mist_rune'
    | 'jiandao_needle_spark'
    | 'jiandao_holy_burst'
    | 'jiandao_heal_spark'
    | 'jiandao_scissor_mark'
    | 'jiandao_slow_ring'
    | 'jiandao_halo_spark'
    | 'jiandao_needle_hit_symbol'
    | 'jiandao_scissor_slash_arc'
    | 'jiandao_mist_deflect_ring'
    | 'jiandao_blade_trail'
    | 'jiandao_shear_spark'
    | 'jiandao_cross_flash'
    | 'jiandao_fate_thread'
    | 'dina_white_spark'
    | 'dina_dark_spark'
    | 'dina_dark_charge_spark'
    | 'dina_fusion_spark'
    | 'dina_fusion_spawn_spark'
    | 'dina_halo_blade'
    | 'dina_burn_ember'
    | 'dina_slow_rune'
    | 'dina_immobilize_chain'
    | 'dina_core_power_wave'
    | 'jianxian_sword_trail'
    | 'jianxian_burst_spark'
    | 'jianxian_burst_ring'
    | 'jianxian_retreat_smoke'
    | 'jianxian_slow_frost'
    | 'jianxian_qi_trail'
    | 'jianxian_array_rune'
    | 'longshen_swoop_spark'
    | 'longshen_swoop_trail'
    | 'longshen_strike_claw'
    | 'longshen_flame_particle'
    | 'longshen_form_aura_particle'
    | 'longshen_form_wing_spark'
    | 'xin_light_spark'
    | 'xin_dark_spark'
    | 'xin_sword_slash'
    | 'xin_sky_beam'
    | 'xin_level_spark'
    | 'xin_shield_aura'
    | 'xin_dash_trail'
    | 'xin_exp_ring'
    | 'xin_upgrade_ring'
    | 'xin_charge_ring'
    | 'xin_impact_spark'
    | 'xin_sword_trail'
    | 'xin_afterimage'
    | 'xin_collision_shard'
    | 'xin_slash_arc'
    | 'xin_spatial_rift_crack'
    | 'xin_cross_slash'
    | 'xin_sonic_cone'
    | 'puppet_wood_chip'
    | 'puppet_magic_shard'
    | 'puppet_line_particle'
    | 'puppet_shield_shard'
    | 'puppet_core_burst'
    | 'puppet_slash_particle'
    | 'puppet_resonance_ring'
    | 'puppet_tether_spark'
    | 'puppet_thread_spark'
    | 'yinyong_core_glow'
    | 'yinyong_fist_spark'
    | 'yinyong_charge_particle'
    | 'yinyong_teleport_afterimage'
    | 'yinyong_shockwave_ring'
    | 'yinyong_punch_fist_outline'
    | 'yinyong_rage_aura'
    | 'yinyong_immortal_burst'
    | 'yinyong_boundless_rune'
    | 'yinyong_boundless_shard'
    | 'junko_bandage_trail'
    | 'junko_memory_shard'
    | 'junko_eye_glow'
    | 'junko_blade_spark'
    | 'junko_dash_line'
    | 'junko_cross_slash'
    | 'junko_liberation_burst'
    | 'junko_tether_rune';
  scaleGrowth?: number;
  spin?: number;
  length?: number;
  width?: number;
  angle?: number;
  trailColor?: string;
  targetX?: number;
  targetY?: number;
  extraData?: any;
}

export interface Projectile {
  id: string;
  ownerId: 'p1' | 'p2';
  targetId?: 'p1' | 'p2';
  type:
    | 'purple_energy_bar'
    | 'magic_missile'
    | 'blue_light_arrow'
    | 'lanzuan_crystal_ray'
    | 'lanzuan_bullet'
    | 'fenzuan_shield'
    | 'baizuan_mirror_bullet'
    | 'baizuan_deathray_spark'
    | 'fan_hunter_arrow'
    | 'mimi_heart_shot'
    | 'jiandao_needle'
    | 'dina_white_light'
    | 'dina_dark_light'
    | 'dina_fusion_orb'
    | 'jianxian_burst_sword'
    | 'jianxian_slow_sword'
    | 'jianxian_sword_qi'
    | 'spider_web_net'
    | 'purple_bomb'
    | 'xin_sword_strike'
    | 'xin_sky_cleave'
    | 'xin_shadow_rush'
    | 'puppet_missile'
    | 'junko_bandage_arrow';
  x: number;
  y: number;
  vx: number;
  vy: number;
  width?: number;
  height?: number;
  length?: number;
  radius: number;
  damage: number;
  damageType?: CombatTextType;
  isPhysical?: boolean;
  isClone?: boolean; // For clone projectile lower brightness
  energyConsumed?: number;
  volleyId?: string; // For tracking bomb volleys and consecutive hit decay
  bombIndex?: number; // 0, 1, 2 for 3-bomb spread
  life?: number;
  maxLife?: number;
  wobblePhase?: number;
  wobbleSpeed?: number;
  wobbleAmp?: number;
  color: string;
  angle?: number;
  spin?: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
  maxDistance?: number;
  traveledDist?: number;

  // Fenzuan Shield specific state
  fenzuanShieldState?: 'outward' | 'returning';
  fenzuanOriginX?: number;
  fenzuanOriginY?: number;
  fenzuanTraveledDist?: number;
  fenzuanMaxDist?: number;
  fenzuanHitOutward?: boolean;
  fenzuanHitReturning?: boolean;

  // Mimi Heart Shot specific state
  mimiOriginX?: number;
  mimiOriginY?: number;
  mimiTraveledDist?: number;
  mimiMaxDist?: number;

  // Dina specific projectile state
  dinaFusionType?: 'regular' | 'perfect';
  dinaFusionEffect?: 'burn' | 'slow' | 'immobilize';
  dinaEventId?: string;

  // Jianxian (劍仙) specific projectile state
  jianxianOriginX?: number;
  jianxianOriginY?: number;
  jianxianMaxDist?: number;
  jianxianTraveledDist?: number;
  jianxianExploded?: boolean;
  jianxianExplosionRadius?: number;
  jianxianHitEnemyIds?: string[];
  extraData?: any;
}

export type CombatTextType = 'physical' | 'flame' | 'magic' | 'heal' | 'status' | 'energy' | 'technique' | 'true' | 'poison';

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  vx?: number;
  text: string;
  color: string;
  fontSize: number;
  alpha: number;
  life: number;
  maxLife: number;
  vy: number;
  tag?: string;
  damageType?: CombatTextType;
  damageValue?: number;
  scale?: number;
  shakeIntensity?: number;
  isCrit?: boolean;
  targetId?: string;
  stackCount?: number;
  parsed?: any;
}

export interface EnergyShard {
  id: string;
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
  spawnTime: number;
  pulsePhase: number;
}

export interface BallState {
  id: 'p1' | 'p2';
  characterId: CharacterId;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  maxHp: number;
  hp: number;
  baseAttack: number;
  baseSpeed: number;
  isAi: boolean;

  // Energy System (能量系統)
  energy: number;                  // 當前能量 (0 ~ 100)
  maxEnergy: number;               // 最大能量 (100)
  energyRegen: number;             // 每秒基礎自然回能 (預設 6.0)
  isOverdrive: boolean;            // 是否處於滿能量超載狀態 (移速 +10%，下次攻擊/技能暴擊)
  overdriveTimer?: number;         // 超載狀態特效計時器
  lastGrazeTime?: number;          // 擦彈冷卻計時器
  lastWallEnergyTime?: number;     // 壁面蓄能冷卻計時器
  tacticalShieldTimer?: number;    // 戰術能量護盾持續時間 (0 ~ 1.5s，抵擋下一次受擊)
  tacticalDashTimer?: number;      // 瞬步衝刺殘影計時器
  tacticalCooldown?: number;       // 戰術技能通用冷卻
  energyDepletedPromptTimer?: number; // 能量枯竭提示冷卻
  
  // Oba Passive states
  consecutiveHits: number;      // 奧巴被動三: 連續3次有效碰撞
  nextBounceSpeedMultiplier: number; // 奧巴被動二: 蓄力反彈 (1.18)
  hasChargedBounce: boolean;    // 是否處於蓄力反彈狀態
  
  // Huotong Passive states
  hasExplosiveBounceReady: boolean; // 火桶被動三: 爆燃反彈準備就緒 (+7 火傷)
  flameShellTriggered: boolean; // 火桶被動一視覺反饋
  isHotBodyActive: boolean;     // 火桶被動二: 高速移動中 (速度 >= 門檻)
  huotongFlameShellCooldown: number; // 火桶被動一【火焰外殼】冷卻計時器 (4.0s)
  huotongHotBodyCooldown: number;    // 火桶被動二【滾燙桶身】冷卻計時器 (3.5s)
  huotongExplosiveCooldown: number;  // 火桶被動三【爆燃反彈】冷卻計時器 (8.0s)
  shieldActiveTimer?: number;   // 火桶被動二: 半透明防護護罩計時器
  hitFlashTimer?: number;       // 受擊瞬間閃光計時器
  
  // Hailaise Passive states
  magicEnergy: number;          // 海萊絲被動一: 魔法能量 (0~45)
  energyBeamCooldown: number;   // 海萊絲被動二: 穿透紫色能量條冷卻計時
  hailaiseBombCooldown: number; // 海萊絲被動三: 每40秒發射3顆紫色爆彈
  hailaiseBombVolleyHits?: Record<string, number>; // 記錄當次爆彈命中目標次數（傷害遞減計算）
  hailaiseShield?: number;      // 海萊絲被動四: 奧術晶盾當前護盾值 (開局50)
  hailaiseMaxShield?: number;   // 海萊絲被動四: 奧術晶盾上限 (50)
  hasTriggeredPossession?: boolean; // 舊被動三保留相容性
  pendingMissilesCount?: number; // 舊飛彈保留相容性
  pendingMissileDamage?: number;
  missileLaunchTimer?: number;

  // Lingyinsi Passive states
  blueArrowCooldown: number;    // 靈隱寺被動一: 5秒自動發射倒計時
  cloneCooldown: number;        // 靈隱寺被動二: 25秒召喚分身倒計時
  clones: LingyinsiClone[];     // 存活分身列表 (最多2個)
  greenOrbsCooldown: number;    // 靈隱寺被動三: 25秒生成光圈球體倒計時
  greenOrbs: OrbitingGreenOrb[]; // 3個綠色光圈球體
  greenOrbsActive: boolean;     // 是否有旋轉光圈啟用中
  greenOrbsOrbitAngle: number;  // 旋轉角
  greenOrbsDuration: number;    // 光圈持續時間
  greenOrbsHitTriggered: boolean; // 是否已觸發至少一次命中

  // Chanshi Passive states
  chanshiAuraCooldown: number;     // 禪師被動一: 8秒光環刷新倒計時
  chanshiAuraTimer: number;        // 禪師被動一: 光環內部週期計時
  chanshiAuraWaveRadius: number;   // 禪師被動一: 0~100px 擴散波半徑
  chanshiSuperArmorTimer: number;  // 禪師被動二: 金鐘罩 0.5s 霸體計時器
  chanshiBellShieldTimer: number;  // 禪師被動二: 金鐘罩半透明金色鐘形護罩視覺計時器
  chanshiGoldenBodyUsed: boolean;  // 禪師被動三: 金身回復是否已觸發 (每場戰鬥最多1次)
  chanshiHealingAnimTimer: number; // 禪師被動三: 金色能量核心匯聚與擴散動畫計時器
  isSlowedByChanshi: boolean;      // 是否正受到敵方禪師禁錮光環減速 (速度 -30%)
  slowedByChanshiTimer: number;    // 減速特效粒子計時器

  // Huangzuan Passive states
  huangzuanLightningCooldown: number;  // 黃鑽被動一: 5秒自動釋放倒計時
  isParalyzed: boolean;                // 是否處於麻痺狀態 (被動一命中: 0.5s 無法移動)
  paralysisTimer: number;              // 麻痺計時器 (0.5s)
  huangzuanSpeedStacks: number;        // 黃鑽被動二: 速度層數 (0~10)
  huangzuanStackTimer: number;         // 黃鑽被動二: 每2秒增加1層計時器
  huangzuanSpeedCooldown: number;      // 黃鑽被動二: 碰撞後10秒冷卻計時器
  huangzuanFieldCooldown: number;      // 黃鑽被動三: 30秒冷卻倒計時
  huangzuanFieldActive: boolean;       // 黃鑽被動三: 3.5秒超能電場是否啟用中
  huangzuanFieldDuration: number;      // 黃鑽被動三: 3.5秒剩餘持續時間
  huangzuanFieldTickTimer: number;     // 黃鑽被動三: 0.1秒傷害跳擊間隔
  huangzuanFieldCollapseTimer: number; // 黃鑽被動三: 結束時收縮動畫計時器
  
  // Lanzuan Passive states
  lanzuanWaveTickTimer?: number;       // 藍鑽被動一: 藍色波長傷害跳擊計時 (每0.5s 1魔傷)
  lanzuanOrbCooldown: number;          // 藍鑽被動二: 藍色光球 20秒召喚冷卻倒計時
  lanzuanOrb: LanzuanBlueOrb | null;   // 藍鑽被動二: 召喚出的靜止藍色光球 (3 HP)
  lanzuanEmotionCooldown: number;      // 藍鑽被動三: 藍色情緒能量 40秒冷卻倒計時
  lanzuanEmotionFieldActive: boolean;  // 藍鑽被動三: 情緒能量場是否開啟 (半徑140px, 3.5秒)
  lanzuanEmotionFieldDuration: number; // 藍鑽被動三: 3.5秒剩餘時間
  lanzuanEmotionCollapseTimer: number; // 藍鑽被動三: 爆發收縮動畫計時器
  isSlowedByLanzuan: boolean;          // 是否正受到藍鑽情緒能量場減速 (速度 -35%)
  slowedByLanzuanTimer: number;        // 減速特效計時器
  
  // Fenzuan Passive states
  fenzuanShieldCooldown: number;       // 粉鑽被動一: 粉色圓盾 8秒冷卻倒計時 (盾牌完全返回後開始計時)
  fenzuanShieldActive: boolean;        // 粉鑽被動一: 盾牌是否正處於投擲/返回中
  fenzuanShieldCatchAnimTimer?: number;// 粉鑽被動一: 盾牌收回時的光環特效計時器
  fenzuanFieldCooldown: number;        // 粉鑽被動二: 粉色減傷力場 22秒冷卻倒計時
  fenzuanFieldActive: boolean;         // 粉鑽被動二: 減傷力場是否開啟 (持續5秒)
  fenzuanFieldDuration: number;        // 粉鑽被動二: 減傷力場剩餘時間
  fenzuanFieldDamageReductionTimer?: number; // 粉鑽被動二: 受擊防護波紋計時器
  isProtectedByFenzuanField?: boolean; // 是否處於粉鑽減傷力場範圍內 (受到傷害降低1.5%)
  fenzuanBubbleCooldown: number;       // 粉鑽被動三: 泡泡尖刺 40秒冷卻倒計時
  fenzuanBubbleActive: boolean;        // 粉鑽被動三: 泡泡尖刺是否開啟 (持續7.5秒)
  fenzuanBubbleDuration: number;       // 粉鑽被動三: 泡泡尖刺剩餘時間
  fenzuanBubbleDashTimer: number;      // 粉鑽被動三: 衝刺隨機方向切換計時器
  fenzuanBubbleLastTouchTime?: number; // 粉鑽被動三: 碰觸傷害防重複判定計時器
  lastBallHitTime?: number;            // 球體實體碰撞傷害防連擊判定計時器
  
  // Baizuan Passive states
  baizuanCloneCooldown: number;        // 白鑽被動一: 鏡像分身 20秒冷卻倒計時
  baizuanClone: BaizuanMirrorClone | null; // 白鑽被動一: 當前召喚之鏡像分身 (最多1個)
  baizuanShiningCooldown: number;      // 白鑽被動二: 閃耀 20秒冷卻倒計時
  baizuanShiningActive: boolean;       // 白鑽被動二: 閃耀是否啟用 (持續5秒)
  baizuanShiningDuration: number;      // 白鑽被動二: 閃耀剩餘時間 (5秒)
  baizuanShiningTickTimer: number;     // 白鑽被動二: 每秒傷害判定計時器
  isBlanchedAndImmobilized?: boolean;  // 白鑽被動二: 是否處於白化與定身狀態 (持續1.5秒，外觀變白，速度降為0)
  blanchedTimer?: number;              // 白鑽被動二: 白化與定身剩餘時間
  shiningResistanceTimer?: number;     // 白鑽被動二: 定身結束後獲得的 3秒閃光抗性計時器
  baizuanRayCooldown: number;          // 白鑽被動三: 白色死光 24秒冷卻倒計時
  baizuanRayActive: boolean;           // 白鑽被動三: 白色死光是否啟用 (最多8秒)
  baizuanRayDuration: number;          // 白鑽被動三: 白色死光剩餘時間
  baizuanRayAngle: number;             // 白鑽被動三: 白色死光直線朝向角
  baizuanRayTickTimer: number;         // 白鑽被動三: 每0.5秒傷害判定計時器
  baizuanRayHitCooldown?: number;      // 防止幀重複判定
  baizuanRayImpactTimer?: number;      // 撞擊/結束收縮光效計時器

  // Xukongshou Passive states (虛空獸)
  isInvulnerable?: boolean;            // 虛空獸被動一: 咬住敵人期間完全免疫傷害
  xukongshouBiteCooldown: number;      // 虛空獸被動一: 10秒冷卻倒計時
  xukongshouBiteActive: boolean;       // 虛空獸被動一: 是否正在張嘴咬住敵人 (持續3秒)
  xukongshouBiteDuration: number;      // 虛空獸被動一: 咬住剩餘時間 (3秒)
  xukongshouBiteDamageTickTimer?: number; // 虛空獸被動一: 每0.5秒撕咬傷害計時器
  xukongshouBiteAngle?: number;        // 虛空獸被動一: 咬住朝向角
  xukongshouBiteRecoilTimer?: number;  // 虛空獸被動一: 鬆口後受到反作用力向後位移特效計時器
  isBittenByVoidBeast?: boolean;       // 敵人是否正被虛空獸咬住無法脫離
  xukongshouRiftCooldown: number;      // 虛空獸被動二: 虛空裂縫 20秒冷卻倒計時
  xukongshouRift: VoidRift | null;     // 虛空獸被動二: 當前空間裂縫 (入口與出口)
  isTrappedInVoid?: boolean;           // 敵人是否踩中裂縫被虛空困住 (無法移動2秒)
  trappedInVoidTimer?: number;         // 困住剩餘時間 (2秒)
  xukongshouHuntCooldown: number;      // 虛空獸被動三: 虛空獵擊 25秒冷卻倒計時
  xukongshouHuntLockTimer: number;     // 虛空獸被動三: 鎖定目標倒計時 (3秒)
  xukongshouHuntActive: boolean;       // 虛空獸被動三: 幻影極速刺殺衝刺中
  isLockedByVoidHunt?: boolean;        // 敵人是否被黑紫色虛空標記鎖定
  lockedByVoidHuntTimer?: number;      // 敵人身上的鎖定標記計時器
  isPhantomDash?: boolean;             // 虛空獸是否處於半透明幻影狀態

  // Fan Passive states (凡)
  fanAttackCheckTimer: number;         // 凡被動一: 1.5秒攻擊判定間隔
  fanHunterMarks: number;              // 凡被動一: 白色獵痕層數 (0~3)
  fanLastHitByArrowTime?: number;      // 凡被動一: 同一敵人箭矢命中間隔冷卻 (0.1秒)
  fanRollCooldown: number;             // 凡被動二: 翻滾預知 5秒冷卻 (翻滾完成後開始計時)
  fanIsRolling: boolean;               // 凡被動二: 正在翻滾位移中
  fanRollDuration: number;             // 凡被動二: 翻滾持續時間 (0.22s)
  fanRollVx?: number;                  // 凡被動二: 翻滾速度向量 X
  fanRollVy?: number;                  // 凡被動二: 翻滾速度向量 Y
  fanHasRangeBoost: boolean;           // 凡被動二: 翻滾完成後獲得 6% 額外攻擊範圍 (300px -> 318px)
  fanOverclockCooldown: number;        // 凡被動三: 超速強化 20秒冷卻 (10秒結束後開始計時)
  fanOverclockActive: boolean;         // 凡被動三: 超速強化是否啟動中 (10秒)
  fanOverclockDuration: number;        // 凡被動三: 超速強化剩餘持續時間 (10秒)
  fanOverclockTickTimer: number;       // 凡被動三: 每秒減少翻滾預知剩餘冷卻0.5秒計時器

  // Tunshimozu Passive states (吞噬魔族)
  growthStacks: number;                // 吞噬魔族: 當前成長值 (0~50)
  maxGrowthStacks: number;             // 吞噬魔族: 最大成長值 (50)
  shardSpawnTimer: number;             // 能量碎片生成計時器 (每3秒生成1個)
  energyShards: EnergyShard[];         // 戰場當前能量碎片列表 (上限8個)
  gluttonyBurstCooldown: number;       // 吞噬魔族被動三: 暴食魔爆 6秒冷卻
  gluttonyBurstAnimTimer?: number;     // 暴食魔爆爆發動畫計時器
  devourImplosionAnimTimer?: number;   // 吞噬碎片收縮動畫計時器
  devourLastShardX?: number;           // 最近一次吞噬碎片之 X 座標
  devourLastShardY?: number;           // 最近一次吞噬碎片之 Y 座標
  collisionResistance?: number;        // 魔軀成長提供之碰撞抗性 (0~10%)

  // Mimi Passive states (愛心者・咪咪)
  mimiClawCooldown: number;            // 咪咪被動一: 貓咪衝爪 2秒冷卻
  mimiClawAnimTimer?: number;          // 貓咪衝爪爪擊動畫計時器
  mimiClawTargetX?: number;            // 貓咪衝爪目標位置 X
  mimiClawTargetY?: number;            // 貓咪衝爪目標位置 Y
  mimiHeartCooldown: number;           // 咪咪被動二: 愛心飛射 20秒冷卻
  mimiHopeSpawnTimer: number;          // 咪咪被動三: 咪咪希望 30秒生成計時器
  mimiHopeDestroyCooldown: number;     // 咪咪被動三: 咪咪希望 40秒破壞冷卻計時器
  mimiCycleId: number;                 // 咪咪希望: 當前成長週期編號
  mimiHasAbsorbedThisCycle: boolean;   // 咪咪希望: 當前週期是否已吸收包 (二選一限制)
  mimiLifeStacks: number;              // 咪咪希望: 生命包吸收累積次數 (0~100)
  mimiAttackStacks: number;            // 咪咪希望: 攻擊包吸收累積次數 (0~100)
  mimiGrowthPacks: MimiGrowthPack[];   // 咪咪希望: 戰場當前成長包列表 (最多2顆: 1生命+1攻擊)
  mimiSpeedBoostTimer?: number;        // 咪咪希望: 吸收成長包後獲得的 1.5秒靈動加速 (+15% 跑速)

  // Jiandaoshou Passive states (剪刀手)
  jiandaoshouSnipCooldown: number;            // 剪刀手被動一: 剪裁生命 2.5秒冷卻
  jiandaoshouSnipAnimTimer?: number;          // 剪刀張開剪合動畫計時器
  jiandaoshouCoreGlowTimer?: number;          // 核心短暫變亮計時器 (回血/剪裁時)
  jiandaoshouMistActive: boolean;             // 剪刀手被動二: 聖霧守護 是否處於展開狀態 (8秒)
  jiandaoshouMistDuration: number;            // 聖霧守護剩餘持續時間 (8秒)
  jiandaoshouMistCooldown: number;            // 聖霧守護結束後的20秒冷卻倒計時
  jiandaoshouNeedleCooldown: number;          // 剪刀手被動三: 聖針連射 12秒冷卻
  jiandaoshouNeedlesRemaining: number;        // 當前輪次剩餘待發射飛針數 (0~5)
  jiandaoshouNeedleIntervalTimer: number;     // 每枚飛針0.25秒發射間隔計時器
  jiandaoshouNeedleAimAngle?: number;         // 鎖定之固定發射方向角
  jiandaoshouAttackAimAngle?: number;         // 剪刀剪切攻擊鎖定角度
  jiandaoshouAttackPhase?: number;            // 剪刀攻擊多階段動畫計時器 (0~0.38)

  // Dina Passive states (蒂納: 三相光環 / 白光 / 暗光 / 三相融合 / 核心之力)
  dinaWhiteLightCooldown: number;             // 蒂納被動一: 白光發射冷卻計時器 (1.2s)
  dinaWhiteLightState: 'READY' | 'COOLDOWN';  // 白光冷卻狀態
  dinaWhiteEnergies: WhiteLightEnergy[];      // 戰場已產生之白光能量陣列
  dinaDarkLightState: DarkLightChargeState;   // 蒂納被動二: 暗光狀態
  dinaDarkLightChargeTimer: number;          // 暗光蓄力計時器
  dinaDarkLightEnergy: number;               // 暗光累積能量 (0 ~ 100)
  dinaPerfectAbsorb: boolean;                // 是否已吸收白光獲得完美融合資格
  dinaBestEffectReady: boolean;              // 完美融合最佳效果就緒標記
  dinaCurrentFusionWindow: FusionWindow | null; // 當前暗光發射開啟之 FusionWindow
  dinaCurrentFusionEvent: FusionEvent | null;   // 當前處理中之 FusionEvent
  dinaCorePowerCooldown: number;             // 蒂納特殊被動【核心之力】8秒冷卻計時器
  dinaCorePowerActive: boolean;              // 核心之力自動位移逃離是否啟用中
  dinaCorePowerAnimTimer?: number;           // 核心之力視覺氣浪計時器
  dinaCorePowerTargetDist: number;           // 安全距離 (220px)
  dinaCorePowerDangerDist: number;           // 危險距離 (130px)
  dinaHaloRotationAngle: number;             // 三相光環武器旋轉角 (視覺表現)
  isProcessingWhiteLight?: boolean;          // 防止白光重複觸發鎖
  isProcessingDarkLight?: boolean;           // 防止暗光重複觸發鎖
  isProcessingFusion?: boolean;              // 防止融合重複觸發鎖
  isProcessingCorePower?: boolean;           // 防止核心之力重複觸發鎖

  // Status effects applied to balls
  isBleedingByMimi?: boolean;          // 是否處於咪咪貓咪衝爪流血狀態 (持續3秒)
  bleedTimer?: number;                 // 流血剩餘時間 (3秒)
  bleedTickTimer?: number;             // 每秒跳血計時器
  bleedSourceId?: 'p1' | 'p2';         // 流血傷害來源
  isCharmedByMimi?: boolean;           // 是否處於咪咪愛心魅惑狀態 (持續2秒，強制朝咪咪移動)
  charmedByMimiTimer?: number;         // 魅惑剩餘時間 (2秒)
  charmedByMimiSourceId?: 'p1' | 'p2'; // 魅惑施法者來源
  isSlowedByNeedle?: boolean;          // 是否受到聖針減速 20% (持續1秒)
  slowedByNeedleTimer?: number;        // 聖針減速剩餘時間 (1秒)
  isDinaBurned?: boolean;              // 是否處於蒂納融合燃燒狀態 (持續2秒)
  dinaBurnTimer?: number;              // 燃燒剩餘時間 (2秒)
  dinaBurnInterval?: number;           // 燃燒跳血間隔
  dinaBurnDamagePerTick?: number;      // 每次跳血傷害
  dinaBurnTickTimer?: number;          // 燃燒跳血計時器
  dinaBurnSourceId?: 'p1' | 'p2';      // 燃燒傷害來源
  isDinaSlowed?: boolean;              // 是否處於蒂納融合緩速狀態 (速度 -35%，持續2秒)
  dinaSlowTimer?: number;              // 緩速剩餘時間 (2秒)
  isDinaImmobilized?: boolean;         // 是否處於蒂納融合定神狀態 (無法移動1秒)
  dinaImmobilizeTimer?: number;        // 定神剩餘時間 (1秒)

  // Jianxian Passive states (劍仙: 仙靈白劍 / 白劍爆裂 / 退劍緩行 / 百萬劍陣)
  jianxianOrbitSwordAngle?: number;          // 武器仙靈白劍環繞旋轉角度
  jianxianBurstSwordCooldown?: number;        // 被動一: 白劍爆裂 3秒冷卻倒計時
  jianxianRetreatCooldown?: number;           // 被動二: 退劍緩行 7.6秒冷卻倒計時
  jianxianRetreatAnimTimer?: number;          // 被動二: 位移仙氣殘影計時器
  isSlowedByJianxian?: boolean;               // 被動二: 是否受到緩速仙劍減速 (25%)
  slowedByJianxianTimer?: number;             // 被動二: 減速持續時間 (2.0s)
  jianxianArrayActive?: boolean;              // 被動三: 百萬劍陣是否處於啟動狀態 (持續10s)
  jianxianArrayDuration?: number;             // 被動三: 百萬劍陣剩餘持續時間 (10s)
  jianxianArrayCooldown?: number;             // 被動三: 百萬劍陣冷卻時間 (30s，陣法結束後開始計時)
  jianxianArrayFireTimer?: number;            // 被動三: 每0.1秒發射判定計時器
  jianxianArraySecTimer?: number;             // 被動三: 1秒滑動窗口計時器 (每秒傷害上限3.5)
  jianxianArraySecDamage?: number;            // 被動三: 當前秒累計劍陣傷害 (每秒上限3.5)
  jianxianArrayTotalDamage?: number;          // 被動三: 當前輪次累計劍陣傷害 (10秒上限35)

  // Longshen Passive states (龍神: 龍神之軀 / 龍搖 / 龍普 / 龍炎 / 龍身)
  longshenSwoopCooldown?: number;             // 被動一: 龍搖 6秒冷卻倒數
  longshenSwoopActive?: boolean;              // 被動一: 是否處於俯衝狀態
  longshenSwoopTargetId?: string;             // 被動一: 鎖定的目標ID
  longshenSwoopStartX?: number;               // 被動一: 俯衝起點X
  longshenSwoopStartY?: number;               // 被動一: 俯衝起點Y
  longshenSwoopDirX?: number;                 // 被動一: 俯衝方向向量X
  longshenSwoopDirY?: number;                 // 被動一: 俯衝方向向量Y
  longshenSwoopDistTraveled?: number;         // 被動一: 當前俯衝累積位移 (上限220px)
  longshenSwoopHitEnemyIds?: string[];        // 被動一: 本次俯衝已命中的敵人ID (同一敵人最多受一次傷害)
  longshenSwoopAnimTimer?: number;            // 被動一: 俯衝風痕與火焰衝擊波計時器

  longshenStrikeCooldown?: number;            // 被動二: 龍普 4秒冷卻倒數
  longshenStrikeAnimTimer?: number;           // 被動二: 龍普猛烈近身打擊視覺動畫計時器
  longshenStrikeTargetX?: number;             // 被動二: 近身打擊目標X
  longshenStrikeTargetY?: number;             // 被動二: 近身打擊目標Y

  longshenFlameCooldown?: number;             // 被動三: 龍炎 10秒冷卻倒數 (結束後開始計算)
  longshenFlameActive?: boolean;              // 被動三: 龍炎是否處於噴射狀態 (持續2秒)
  longshenFlameDuration?: number;             // 被動三: 龍炎剩餘持續時間 (2.0s)
  longshenFlameTickTimer?: number;            // 被動三: 每0.5秒判定計時器
  longshenFlameAngle?: number;                // 被動三: 噴射扇形中心角度
  longshenFlameDamageDealt?: Record<string, number>; // 被動三: 單次噴射對同一敵人累計傷害 (上限6點)
  longshenFlameSecDamage?: Record<string, number>;    // 被動三: 同一秒內傷害累計 (上限3點)
  longshenFlameSecTimer?: number;             // 被動三: 1秒滑動窗口計時器

  longshenFormCooldown?: number;              // 被動四: 龍身 30秒冷卻倒數 (變身結束後開始計算)
  longshenFormActive?: boolean;               // 被動四: 飛行龍形真身是否啟用 (持續10秒)
  longshenFormDuration?: number;              // 被動四: 龍身剩餘持續時間 (10.0s)
  longshenFormTickTimer?: number;             // 被動四: 龍焰領域每0.5秒判定計時器
  longshenFormDamageDealt?: Record<string, number>; // 被動四: 龍焰領域對同一敵人總傷害 (上限25點)
  longshenFormWingPhase?: number;             // 被動四: 飛行龍形翅膀扇動與龍體蜿蜒相位 (視覺動畫)

  longshenAweTimer?: number;                  // 龍威壓制持續時間 (使目標受到的龍神傷害+20%)
  longshenSlowTimer?: number;                 // 龍威減速持續時間 (使目標移動速度-20%)
  longshenBurnTimer?: number;                 // 龍炎灼燒持續時間 (為龍普雙爪撕裂引爆真傷提供條件)

  // Zhizhu Passive states (蜘蛛: 毒牙印記 / 獵網束縛 / 蛛群獵殺 / 蛛后毒爆)
  spiderVenomFangCooldown?: number;           // 被動一: 毒牙印記 4.0秒冷卻倒計時
  spiderVenomFangAnimTimer?: number;          // 被動一: 毒牙突刺穿刺視覺計時器
  spiderWebCooldown?: number;                 // 被動二: 獵網束縛 8.0秒冷卻倒計時
  spiderWebBindCooldown?: number;             // Alias
  spiderSwarmCooldown?: number;               // 被動三: 蛛群獵殺 15.0秒冷卻倒計時
  spiderMiniSummons?: SpiderMiniSummon[];     // 被動三: 召喚的追擊小蜘蛛
  spiderMinis?: SpiderMiniSummon[];           // Alias
  spiderWebZones?: SpiderWebZone[];           // 被動二: 戰場上的蛛網束縛區域
  spiderBurstCooldown?: number;               // 被動四: 蛛后毒爆 25.0秒冷卻倒計時
  spiderQueenBurstCooldown?: number;          // Alias
  spiderBurstAnimTimer?: number;              // 被動四: 毒爆環形毒液波視覺計時器
  spiderSilkTrailTimer?: number;              // 移動時短暫蛛絲痕跡計時器
  spiderHitByMiniCount?: number;              // 目標受到小蜘蛛攻擊次數

  // Spider Target Status Effects (受擊目標身上的蛛毒與蛛網狀態)
  spiderPoisonMarkTimer?: number;             // 蛛毒印記剩餘時間 (最多1層，持續4秒，每秒1點毒傷)
  spiderPoisonTickTimer?: number;             // 蛛毒每秒跳血計時器
  spiderPoisonSourceId?: 'p1' | 'p2';         // 蛛毒來源玩家
  isSlowedBySpiderWeb?: boolean;              // 是否處於獵網束縛減速中 (速度 -35%)
  slowedBySpiderWebTimer?: number;            // 獵網減速剩餘時間 (2.5秒)

  // Xin Passive states (辛: 雙相魔劍 / 逐影破陣 / 裂空劍痕 / 形態成長)
  xinLevel?: number;                          // 成長等級 (1~6)
  xinExp?: number;                            // 經驗值 (0~100)
  xinForm?: 'balance' | 'light' | 'dark';     // 當前形態：平衡 / 統御(光) / 狂暴(暗)
  xinFormEnergy?: number;                     // 形態能量值 (0~100)
  xinFormCycleTimer?: number;                 // 形態循環/消耗計時器
  xinNextForm?: 'light' | 'dark';             // 平衡形態下一次切換的目標形態
  xinSkySlashCooldown?: number;               // 被動三: 裂空劍痕冷卻 (11.0s)
  xinSkySlashChargeTimer?: number;            // 被動三: 裂空劍痕蓄力瞄準計時器 (0.5s)
  xinSkySlashAimAngle?: number;               // 被動三: 蓄力固定鎖定角度
  xinSkySlashTargetX?: number;                // 被動三: 蓄力鎖定目標X
  xinSkySlashTargetY?: number;                // 被動三: 蓄力鎖定目標Y
  xinShadowDashCooldown?: number;             // 被動二: 逐影破陣冷卻 (6.5s)
  xinShadowDashChargeTimer?: number;          // 被動二: 逐影破陣蓄力計時器 (0.25s)
  xinShadowDashing?: boolean;                 // 被動二: 是否正處於極速突進穿透中
  xinShadowDashStartX?: number;               // 被動二: 突進起點X
  xinShadowDashStartY?: number;               // 被動二: 突進起點Y
  xinShadowDashDirX?: number;                 // 被動二: 突進方向X
  xinShadowDashDirY?: number;                 // 被動二: 突進方向Y
  xinShadowDashDistTraveled?: number;         // 被動二: 突進已位移距離 (上限280px)
  xinShadowDashHitIds?: string[];             // 被動二: 本次突進已穿透命中的目標ID
  xinShadowDashAnimTimer?: number;            // 被動二: 殘影劍煞動畫計時器
  xinBasicAttackCooldown?: number;            // 被動一: 魔劍普攻冷卻 (1.4s，暗形態 0.9s)
  xinBasicSlashAnimTimer?: number;            // 被動一: 普攻揮擊動畫計時器 (0.16s)
  xinLockAimAngle?: number;                   // 辛通用鎖定瞄準角
  xinLockTargetId?: string;                   // 當前鎖定目標ID
  xinLockTargetDist?: number;                 // 鎖定目標距離
  xinLockSkillType?: 'sky_cleave' | 'shadow_dash' | 'basic_attack' | null; // 當前鎖定準備施放之技能
  xinSwordOrbitAngle?: number;                // 雙相魔劍環繞旋轉角度 (視覺表現)
  xinShieldAmount?: number;                   // 光形態逐影破陣獲得的神聖護盾
  xinDarkAtkSpeedBoost?: boolean;             // 暗形態攻速加成標記
  xinExpAbsorbTimer?: number;                 // 經驗值吸收微縮能量環動畫計時器 (0.35s)
  xinUpgradeAnimTimer?: number;               // 升級魔劍暫停與裂隙爆亮動畫計時器 (0.35s)
  xinSwordVibrate?: number;                   // 蓄力魔劍微震動強度
  xinLastTrailDist?: number;                  // 粒子系統：辛上次生成殘影後的累積位移
  xinAfterimageTimer?: number;                // 粒子系統：定時殘影節奏計時器
  xinLastX?: number;                          // 辛上一幀 X 坐標 (計算真實移動)
  xinLastY?: number;                          // 辛上一幀 Y 坐標 (計算真實移動)

  // Kuileishi (傀儡師: 命運傀儡線 / 三命戰鬥傀儡 / 傀儡護幕 / 牽線束縛 / 傀儡共鳴 / 木偶替身 / 木偶終幕)
  puppets?: CombatPuppet[];                   // 場上召喚的魔法傀儡 (最多2具)
  puppetSummonCooldown?: number;              // 傀儡召喚間隔 (8秒)
  puppetAegisCooldown?: number;              // 被動二: 傀儡護幕冷卻 (5秒)
  puppetAegisTimer?: number;                  // 被動二: 傀儡護幕持續時間 (1.5秒)
  puppetTetherCooldown?: number;              // 被動三: 牽線束縛冷卻 (6秒)
  puppetTetherAnimTimer?: number;             // 被動三: 發射牽線動畫計時器
  puppetResonance?: number;                   // 被動四: 傀儡共鳴層數 (0~3)
  puppetResonanceDecayTimer?: number;         // 被動四: 傀儡共鳴衰減計時器 (8秒)
  puppetFinaleStandby?: boolean;              // 被動四: 終幕共鳴待命狀態 (3層共鳴+目標牽線+傀儡存活+終幕無CD)
  puppetFinaleCooldown?: number;              // 被動六: 木偶終幕冷卻 (20秒)
  puppetFinaleAnimTimer?: number;             // 被動六: 終幕交叉突進斬擊動畫計時器 (0.3s)
  puppetSubstituteCooldown?: number;          // 被動五: 木偶替身高額傷害減免冷卻 (12秒)
  
  // Puppeteer Target Debuffs (受擊目標身上的牽線束縛狀態)
  isTetheredByPuppeteer?: boolean;            // 是否處於命運傀儡線牽線束縛中 (速度-25%)
  tetheredByPuppeteerTimer?: number;          // 牽線束縛持續時間 (2.0秒)
  tetheredTimer?: number;                     // 牽線束縛持續時間 (2.0秒)
  tetheredSourceId?: 'p1' | 'p2';             // 牽線來源傀儡師玩家ID

  // Yinyong (一拳尹雄: 一拳蓄力 / 瞬間突襲 / 身後宣告 / 一拳必殺 / 不死之血 / 越挫越勇 / 一拳無界)
  yinyongState?: 'READY' | 'SEARCHING' | 'CHARGING' | 'TELEPORTING' | 'DECLARING' | 'PUNCHING' | 'SUCCESS' | 'MISS' | 'COOLDOWN' | 'FAIL_RECOVERY';
  yinyongChargeTimer?: number;                // 22秒蓄力計時器 (0 -> 22s)
  yinyongMaxCharge?: number;                  // 22.0s
  yinyongLockedTargetId?: 'p1' | 'p2' | null; // 蓄力鎖定的唯一目標
  yinyongSearchTimer?: number;                // 重新搜尋目標 3秒等待
  yinyongDeclareTimer?: number;               // 身後宣告 2.5秒倒數
  yinyongPunchAnimTimer?: number;             // 一拳命中爆發視覺動畫 (0.25~0.4s)
  yinyongMissAnimTimer?: number;              // 一拳未命中能量消散動畫
  yinyongSuccessCooldown?: number;            // 成功命中後冷卻 8秒
  yinyongFailRecoveryTimer?: number;          // 失敗恢復 4秒
  yinyongAfterimageTimer?: number;            // 瞬移殘影保留 0.15秒
  yinyongAfterimageX?: number;                // 瞬移前 X
  yinyongAfterimageY?: number;                // 瞬移前 Y
  yinyongFacingAngle?: number;                // 拳頭與身體朝向敵人的角度
  yinyongPunchHitboxX?: number;               // 拳擊 Hitbox 實際 X
  yinyongPunchHitboxY?: number;               // 拳擊 Hitbox 實際 Y
  yinyongPunchHitboxRadius?: number;          // 拳擊 Hitbox 半徑 (約28px)
  yinyongPunchExecuted?: boolean;             // 本次宣告結束是否已進行單次判定
  // 被動二【不死之血】: HP < 35% (126 HP) -> 每2秒判定 3% 機率回滿 (360 HP) -> 成功冷卻 12 秒
  yinyongImmortalCheckTimer?: number;         // 每2秒判定計時器
  yinyongImmortalCooldown?: number;           // 成功後12秒冷卻
  yinyongImmortalAnimTimer?: number;          // 回滿生命圓形恢復波與爆發特效計時器
  // 被動三【越挫越勇】: 攻擊型技能未命中 +1層 (最高10層) -> 每層原技能傷害5%額外物理傷害 (不清除)
  yinyongRageStacks?: number;                 // 越挫越勇層數 (0~10)
  // 被動四【一拳無界】: HP < 1% (3.6 HP) -> 4秒雙方免傷 -> 結束後恢復10%最大HP (36 HP) -> 每場限1次
  yinyongBoundlessActive?: boolean;           // 一拳無界領域是否開啟中 (4秒)
  yinyongBoundlessDuration?: number;          // 領域剩餘時間 (4.0s)
  yinyongBoundlessUsed?: boolean;             // 每場限1次標記
  yinyongBoundlessCollapseTimer?: number;     // 領域結束由外向內破碎與能量回流核心動畫

  // Manyaiya Junko (曼麥亞・軍子: 神之從刃 / 記憶斷片 / 異瞳覺醒 / 神箭・白縛疾嵐 / 聖帶・斷憶縛界 / 神刃・弒國終章 / 神之騎士完全體 / 弒國突進 / 記憶解放)
  junkoMemoryFragments?: Record<string, number>; // 每個敵人的記憶斷片層數 (0~3)
  junkoEyeAwakened?: boolean;                   // 異瞳覺醒狀態 (5秒)
  junkoEyeAwakenTimer?: number;                 // 異瞳覺醒剩餘時間
  junkoAwakenBonusReady?: boolean;              // 下一次神刃攻擊附帶+12純粹神聖傷害
  junkoAwakenCooldowns?: Record<string, number>;// 每個敵人的覺醒冷卻 (8秒)
  junkoArrowCooldown?: number;                  // 神箭冷卻 (5秒 / 形態3秒)
  junkoTetherCooldown?: number;                 // 聖帶冷卻 (7秒 / 形態5秒)
  junkoHolyKnightActive?: boolean;              // 神之騎士完全體 (10秒)
  junkoHolyKnightDuration?: number;             // 完全體持續時間 (10秒)
  junkoHolyKnightCooldown?: number;             // 弒國終章冷卻 (30秒)
  junkoKnightKills?: number;                    // 完全體期間擊殺數 (用於觸發記憶解放)
  junkoDashesRemaining?: number;                // 弒國突進可用次數 (初始2次，收割刷新至多+1，上限3次)
  junkoTotalDashesUsedInForm?: number;          // 單次形態突進已用次數 (上限3)
  junkoIsDashing?: boolean;                     // 是否處於弒國突進位移中 (1100 px/s, 250px)
  junkoDashTimer?: number;                      // 突進持續時間
  junkoDashStartX?: number;
  junkoDashStartY?: number;
  junkoDashTargetX?: number;
  junkoDashTargetY?: number;
  junkoDashAngle?: number;
  junkoDashHitTargets?: Record<string, boolean>;// 當次突進已命中目標，防止多重hitbox重複加層
  junkoTetherPulling?: boolean;                 // 聖帶拉扯中 (敵方拉回80/100px 或 地形飛拉220/260px)
  junkoTetherPullTimer?: number;
  junkoTetherTargetX?: number;
  junkoTetherTargetY?: number;
  junkoLiberationAnimTimer?: number;            // 記憶解放衝擊波視覺動畫
  // 敵方受到軍子的負面狀態
  isBoundByJunko?: boolean;                     // 被軍子聖帶束縛 (0.8s / 1.2s)
  boundByJunkoTimer?: number;
  isSnaredByJunko?: boolean;                    // 被軍子神箭定身 (0.5s)
  snaredByJunkoTimer?: number;
  isSlowedByJunko?: boolean;                    // 被軍子神箭減速 (25%, 1.5s)
  slowedByJunkoTimer?: number;
  junkoVulnerableStacks?: number;               // 敵方身上 3層斷片時獲得易傷狀態 (+25% 受到軍子傷害)

  // Stats tracking for post-game & comprehensive combat analytics
  damageDealt: number;            // 總輸出傷害
  damageTaken?: number;           // 總承受傷害
  healingDone?: number;           // 總治療回復量
  shieldAbsorbed?: number;        // 護盾與格擋抵消傷害
  damageMitigated?: number;       // 防禦與減傷領域減免量
  peakHitDamage?: number;         // 單次最高爆發傷害
  hitsDealt: number;
  hitsReceived: number;

  // Diverse Damage Types Breakdown
  physicalDamageDealt?: number;   // 物理傷害
  magicDamageDealt?: number;      // 魔法傷害
  flameDamageDealt?: number;      // 火焰傷害
  trueDamageDealt?: number;       // 真實傷害 (無視護甲穿透)
  poisonDamageDealt?: number;     // 劇毒傷害
  bleedDamageDealt?: number;      // 流血傷害
  collisionDamageDealt?: number;  // 碰撞普攻傷害
  skillDamageDealt?: number;      // 技能奧義傷害

  passive1Triggers: number;
  passive2Triggers: number;
  passive3Triggers: number;
  passive4Triggers: number;
  
  // Trail visual positions
  trail: Array<{ x: number; y: number; alpha: number }>;
}

export interface CombatEvent {
  id: string;
  timestamp: number; // seconds from match start
  type: 'collision' | 'passive_trigger' | 'wall_bounce' | 'death' | 'projectile_hit' | 'energy_technique';
  attackerId?: 'p1' | 'p2';
  targetId?: 'p1' | 'p2';
  text: string;
  damage?: number;
  badge?: string;
  skillName?: string;
  energyCost?: number;
  technique?: string;
}

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover';

export interface GameSettings {
  p1Char: CharacterId;
  p2Char: CharacterId;
  p1Control: 'auto' | 'manual';
  p2Control: 'auto' | 'manual';
  gameSpeed: number; // 1, 1.5, 2
  soundEnabled: boolean;
  isTitleMatchEnabled?: boolean; // 冠軍加冕賽開關 (Title Match: true = 冠軍加冕/衛冕賽, false = 無頭銜賽冠軍)
  isTournamentTitleMatchEnabled?: boolean; // 錦標賽冠軍加冕開關 (true = 金腰帶盃賽加冕, false = 無頭銜公開賽)
}

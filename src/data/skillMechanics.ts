export interface SkillPriorityTierInfo {
  tier: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';
  name: string;
  badge: string;
  timing: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  priorityRule: string;
  examples: {
    skillName: string;
    championName: string;
    effect: string;
  }[];
}

export interface SkillMechanismGuide {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'Shield' | 'Zap' | 'Flame' | 'Sparkles' | 'Swords' | 'Target' | 'Layers' | 'Activity' | 'Radio' | 'RotateCcw' | 'HeartPulse' | 'Disc' | 'Crosshair';
  badgeColor: string;
  summary: string;
  corePrinciples: string[];
  detailedExplanation: string;
  keySkills: {
    champion: string;
    skill: string;
    mechanism: string;
  }[];
  counterStrategy: string;
}

export interface MechanismInteractionRule {
  id: string;
  title: string;
  attackerMechanism: string;
  defenderMechanism: string;
  priorityWinner: string;
  interactionOutcome: string;
  combatTip: string;
}

/**
 * 技能優先順序執行鏈 (Skill Priority Execution Chain)
 * 嚴格規範遊戲物理與技能運算中，每一影格與受擊瞬間的結算先後次序
 */
export const SKILL_PRIORITY_TIERS: SkillPriorityTierInfo[] = [
  {
    tier: 'T0',
    name: '絕境瀕死保底與絕對無敵',
    badge: '最高優先級 · 結算前置',
    timing: '傷害結算前置 / 致命傷阻斷瞬間',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.45)',
    description: '具有最高優先判定權。當英雄受到致命傷害或處於無敵狀態時，優先於所有普通物理與魔法扣血結算，確保關鍵生存被動不被單幀爆發跳過。',
    priorityRule: '優先於一般血量扣除。若受到致死打擊，若具備未觸發的瀕死保底被動，強制阻斷死亡並立即執行急救回血。',
    examples: [
      {
        skillName: '金身回復',
        championName: '禪師',
        effect: '血量低於 30% 或受到致命傷害時，優先觸發金光灌頂回復 80 HP，阻斷暴斃。'
      },
      {
        skillName: '虛空撕咬無敵',
        championName: '虛空獸',
        effect: '咬住目標 3 秒期間，本體進入虛空完全無敵，免疫一切碰撞與技能傷害。'
      },
      {
        skillName: '魔法附體',
        championName: '海萊絲',
        effect: '生命值低於 25% 瞬間自動觸發，發射 4 枚魔法飛彈並回充魔法能量。'
      }
    ]
  },
  {
    tier: 'T1',
    name: '護盾格擋、減傷與霸體防禦',
    badge: '防護格擋 · 狀態免疫',
    timing: '承受傷害命中瞬間 / 控場施加前',
    color: '#facc15',
    bgColor: 'rgba(250, 204, 21, 0.15)',
    borderColor: 'rgba(250, 204, 21, 0.45)',
    description: '在受到傷害生效前介入。包含戰術護盾單次抵消、金鐘罩霸體減免受擊衝量與反彈傷害，以及粉鑽的減傷力場。',
    priorityRule: '戰術護盾優先消耗以完全格擋本次傷害；霸體（Super Armor）使單位免疫擊退、減速與後續定身控制。',
    examples: [
      {
        skillName: '戰術護盾',
        championName: '全英雄技巧',
        effect: '展開護盾阻擋下一次即將到來的任意碰撞或技能傷害，完全抵消並產生金光格擋波。'
      },
      {
        skillName: '金鐘罩',
        championName: '禪師',
        effect: '受擊反彈 25% 傷害，獲得 0.5s 霸體：免疫 85% 擊退，完全免疫減速與定身。'
      },
      {
        skillName: '粉色減傷力場',
        championName: '粉鑽',
        effect: '半徑 85px 力場內常駐降低 25% 受到的一切傷害。'
      },
      {
        skillName: '火焰外殼',
        championName: '火桶',
        effect: '受擊時消耗 15 能量對攻擊者反震 5 點固定火焰傷害（冷卻 4 秒）。'
      }
    ]
  },
  {
    tier: 'T2',
    name: '硬性控制、禁錮與麻痺判定',
    badge: '空間封鎖 · 行動阻斷',
    timing: '命中判定後 / 轉向速度計算前',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    description: '強制限制或剝奪敵方球體的操縱力與位移速度。若目標處於「霸體狀態」，則控制效果無效並標記「霸體免控」。',
    priorityRule: '若目標處於霸體（金鐘罩）或無敵狀態，硬控被完全抵抗；否則依序結算定身、麻痺或光環減速。',
    examples: [
      {
        skillName: '指定性閃電',
        championName: '黃鑽',
        effect: '天降雷擊造成 0.5s 麻痺定身，使目標完全失去速度與轉向能力。'
      },
      {
        skillName: '純白閃耀',
        championName: '白鑽',
        effect: '強光致盲定身 1.5s；定身結束後目標獲得 3s 閃光抗性，避免被連續循環定身。'
      },
      {
        skillName: '虛空裂縫',
        championName: '虛空獸',
        effect: '踩中暗影裂縫陷阱立即被禁錮 2s，無法移動且無法轉向。'
      },
      {
        skillName: '禁錮光環 & 情緒能量場',
        championName: '禪師 / 藍鑽',
        effect: '範圍內施加 30% ~ 35% 強力減速，多重力場採乘法疊加。'
      }
    ]
  },
  {
    tier: 'T3',
    name: '戰術位移、翻滾與空間瞬步',
    badge: '空間機動 · 迴避穿梭',
    timing: '位移積分階段 / 動態速度覆寫',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    description: '覆寫常規慣性牽引的高速移動技巧。部分位移技能附帶無敵影格（I-Frames）或穿透判定。',
    priorityRule: '戰術衝刺與翻滾的向量優先於常規轉向加速度（applySteering）；翻滾期間免疫碰撞傷害。',
    examples: [
      {
        skillName: '翻滾預知',
        championName: '凡',
        effect: '0.22s 翻滾突進，翻滾期間完全免疫一般碰撞傷害，並拉開風箏距離。'
      },
      {
        skillName: '虛空獵擊',
        championName: '虛空獸',
        effect: '鎖定敵方 3s 後化身幻影極速突進，穿透戰場造成 20 點爆發傷害。'
      },
      {
        skillName: '戰術瞬衝',
        championName: '全英雄技巧',
        effect: '消耗 30 能量向游標或敵方瞬間爆發 480px/s 突進衝撞。'
      }
    ]
  },
  {
    tier: 'T4',
    name: '召喚物實體、分身與能量碎片',
    badge: '戰場衍生 · 獨立生命體',
    timing: '實體碰撞前 / 傷害分攤鏈結算',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    description: '在戰場中生成具備獨立坐標、碰撞體積或生命值的輔助實體，可替本體分攤傷害或提供定點壓制。',
    priorityRule: '當本體受擊時，若 120px 內存在分身，優先觸發 30% 傷害分攤；分身死亡溢出傷害不反彈給本體。',
    examples: [
      {
        skillName: '分身術',
        championName: '靈隱寺',
        effect: '召喚獨立分身同步發射藍箭；120px 範圍內為本體吸收 30% 傷害，本體僅受 70%。'
      },
      {
        skillName: '鏡像分身',
        championName: '白鑽',
        effect: '召喚擁有 2 點生命的分身，完全鏡像敵方技能一並提供干擾。'
      },
      {
        skillName: '藍色光球',
        championName: '藍鑽',
        effect: '生成 3 點生命的靜止能量哨塔，每 2s 射出追蹤激光。'
      },
      {
        skillName: '能量碎片吞噬',
        championName: '吞噬魔族',
        effect: '戰場散落暗紫能量碎片，本體觸碰即吞噬吸收並永久疊加魔軀成長。'
      }
    ]
  },
  {
    tier: 'T5',
    name: '結界領域、光環壓制與持續波長',
    badge: '區域覆蓋 · 持續頻率',
    timing: '週期性 Tick 判定 (0.1s ~ 0.5s)',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.45)',
    description: '以球體為中心或定點鋪設的空間壓制領域。具備持續頻率跳傷、範圍減速或倒數結束後的爆裂判定。',
    priorityRule: '每 0.1s ~ 0.5s 固定週期間隔觸發。若敵方身處結界邊界，以歐幾里得距離判斷是否處於有效半徑內。',
    examples: [
      {
        skillName: '超能電場',
        championName: '黃鑽',
        effect: '生成 3.5s 雷電領域，以 0.1s 極高頻率對踏入者造成微量電傷與電磁減速。'
      },
      {
        skillName: '情緒能量場',
        championName: '藍鑽',
        effect: '展開 140px 結界減速 35%，3.5 秒結束時引爆 65 點高額範圍魔法傷害。'
      },
      {
        skillName: '藍色波長',
        championName: '藍鑽',
        effect: '110px 常駐脈衝，每 0.5 秒對半徑內敵人造成 1 點穿透魔法傷害。'
      }
    ]
  },
  {
    tier: 'T6',
    name: '遠程投射物、穿透射線與真實箭矢',
    badge: '彈道軌跡 · 空間穿刺',
    timing: '投射物更新 / 線性碰撞判定',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.45)',
    description: '沿著指定向量飛行的實體或全屏光束。可被分身阻擋，但真實傷害箭矢與穿透射線可無視常規防護。',
    priorityRule: '穿透射線直接命中路徑上全部目標；真實傷害無視目標的常規防禦力與粉鑽減傷力場。',
    examples: [
      {
        skillName: '獵手本性',
        championName: '凡',
        effect: '常態射出精準箭矢；命中疊加獵痕，疊滿 3 層引爆 15 點無視防禦的真實傷害。'
      },
      {
        skillName: '紫色能量條',
        championName: '海萊絲',
        effect: '全圖直線貫穿射線，貫穿路徑上所有主體與分身造成 15 點魔法打擊。'
      },
      {
        skillName: '白色死光',
        championName: '白鑽',
        effect: '300px 持續聚焦射線，每秒造成 1.5 點魔法灼燒與擊退衝量。'
      },
      {
        skillName: '粉色圓盾',
        championName: '粉鑽',
        effect: '直線擲出 150px 並旋轉折返，具備去程與回程兩段物理命中判定。'
      }
    ]
  },
  {
    tier: 'T7',
    name: '碰撞回擊、質量衝量與蓄力爆燃',
    badge: '物理動能 · 衝撞結算',
    timing: '球體幾何相交 / 分離衝量注入',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.45)',
    description: '核心 2D 物理碰撞運算。計算兩球質量差、法向分離速度、切向偏轉角動量，並結算由碰撞引發的反彈爆發。',
    priorityRule: '重球撞輕球時輕球受劇烈回彈；對撞速度 >= 220 px/s 時觸發【極限拼刀】各得 15 能量。碰撞後結算各英雄被動反傷。',
    examples: [
      {
        skillName: '連續猛撞',
        championName: '奧巴',
        effect: '累計 3 次碰撞後消耗 25 能量，下一次碰撞額外爆發 15 點物理重傷。'
      },
      {
        skillName: '爆燃反彈',
        championName: '火桶',
        effect: '碰撞速度超過 140 px/s 時觸發，反彈衝撞附加 7 點爆炸火焰傷害（冷卻 8 秒）。'
      },
      {
        skillName: '暴食魔爆',
        championName: '吞噬魔族',
        effect: '遭受碰撞時 30% 機率引爆魔力，對範圍內敵人造成 4 ~ 9 點魔法衝擊。'
      },
      {
        skillName: '極限拼刀 & 壁面彈跳',
        championName: '全英雄機制',
        effect: '高速對撞觸發拼刀相互抵消並回能；撞牆借力彈跳獲得 +8 能量與速度加乘。'
      }
    ]
  }
];

/**
 * 技能機制圖鑑詳解 (Skill Mechanism Compendium)
 * 涵蓋 8 大核心機制深度解說，供玩家深入研讀克制與連攜戰術
 */
export const SKILL_MECHANISM_GUIDES: SkillMechanismGuide[] = [
  {
    id: 'mech_collision_momentum',
    title: '碰撞衝量與質量差機制',
    subtitle: 'Collision Impulse & Mass Disparity Physics',
    iconName: 'Activity',
    badgeColor: '#ef4444',
    summary: '遊戲核心的硬派物理系統。兩球碰撞不僅結算傷害，更依據雙方質量比計算回擊速度與震飛距離。',
    corePrinciples: [
      '質量推進法則：重球（如火桶 mass 1.45、吞噬魔族成長後 mass 1.65）撞擊輕球（如凡 mass 0.85）時，重球保有強大慣性持續前推，輕球則遭受 2.2 倍劇烈擊退。',
      '極限拼刀（Clash Parry）：兩球若以 >= 220 px/s 的超高速正面對撞，判定為極限拼刀，雙方立即獲得 +15 能量與金色拼刀震波。',
      '壁面受身彈衝（Wall Rebound）：以 >= 135 px/s 撞擊競技場邊界時，精準藉由牆面彈性反彈，獲得 +8 能量並提升 8% 脫離速度。',
      '蓄力反彈加成：奧巴被動二使下一次反彈速度提升 25%，可連續發動高速衝撞攻勢。'
    ],
    detailedExplanation: '在碰撞瞬間，系統首先計算兩球的相對速度向量沿法線（Normal）與切線（Tangent）的分量。輕球面對重球時，受到的法向回擊衝量會按質量差加成，容易被震向牆角或敵方結界領域中。善用壁面彈跳充能與極限拼刀，是扭轉質量劣勢的關鍵技巧。',
    keySkills: [
      { champion: '奧巴', skill: '重擊 & 連續猛撞', mechanism: '每次碰撞消耗 15 能量提升 25% 撞擊傷害，第 3 次碰撞爆發 +15 額外物傷。' },
      { champion: '火桶', skill: '滾燙桶身 & 爆燃反彈', mechanism: '球速 >= 140 時啟動滾燙桶身提升 +15% 撞擊傷害（冷卻 3.5 秒），強力反彈後附加 7 點爆燃火傷（冷卻 8 秒）。' },
      { champion: '吞噬魔族', skill: '魔軀成長', mechanism: '吞噬能量碎片不斷提升體積與質量，後期成為無法被撞退的戰場巨獸。' }
    ],
    counterStrategy: '面對高質量碰撞型英雄時，避免正面硬拼。利用遠程技能削弱或以角度切向滑碰（Glancing blow），並在撞牆時善用壁面彈跳受身拉開身位。'
  },
  {
    id: 'mech_super_armor',
    title: '護盾、減傷與霸體法則',
    subtitle: 'Shields, Damage Mitigation & Super Armor',
    iconName: 'Shield',
    badgeColor: '#facc15',
    summary: '高階防衛體系。護盾可吸收傷害，減傷力場常駐降低承傷，而「霸體」更是免疫控制與擊退的核心王牌。',
    corePrinciples: [
      '霸體（Super Armor）判定：處於霸體期間（如禪師金鐘罩），免疫 85% 物理擊退，且完全免疫所有定身（Stun）、麻痺（Paralysis）與光環減速（Slow）！',
      '戰術護盾（Tactical Shield）：手動消耗 25 能量展開，可完美格擋抵消下一次任意碰撞或投射物打擊。',
      '減傷力場（Damage Reduction）：粉鑽被動二的粉色力場可將範圍內受到的全部傷害固定降低 25%。',
      '受擊反彈（Damage Reflection）：火桶反傷 5 點（冷卻 4 秒）、禪師反傷 25%，攻擊受反傷英雄時會自損血量。'
    ],
    detailedExplanation: '防護機制在優先級上高於普通傷害扣除。當攻擊命中帶有霸體或護盾的目標時，系統先判定格擋是否生效；若未格擋，則依序扣減防護力場百分比，最後將反彈傷害反饋給進攻方。這使得霸體英雄在硬碰硬中佔據極高交換優勢。',
    keySkills: [
      { champion: '禪師', skill: '金鐘罩', mechanism: '受擊反彈 25% 傷害，並給予自身 0.5s 霸體，期間完全免疫控制與大幅抵抗擊退。' },
      { champion: '粉鑽', skill: '粉色減傷力場', mechanism: '85px 半徑常駐 25% 減傷，有效提高自身與周遭單位的生存力。' },
      { champion: '火桶', skill: '火焰外殼', mechanism: '每次受撞消耗 15 能量反彈 5 點灼燒傷害（冷卻 4 秒），使敵方近戰衝撞時必須承受代價。' }
    ],
    counterStrategy: '切勿在敵方金鐘罩霸體期間施放高冷卻的控制技能（如黃鑽雷電或白鑽閃光）。等待霸體 0.5s 結束後再施加控制，或使用真傷英雄（凡）直接穿透防護。'
  },
  {
    id: 'mech_crowd_control',
    title: '異常狀態與控制抵抗抗性',
    subtitle: 'Crowd Control, Stun, Paralysis & Resistance',
    iconName: 'Zap',
    badgeColor: '#a855f7',
    summary: '控制戰場節奏的核心機制。透過麻痺、白化定身、空間禁錮與光環減速，強行封鎖敵方走位。',
    corePrinciples: [
      '麻痺（Paralysis）：黃鑽閃電命中使敵方陷入 0.5s 麻痺，期間速度清零且無法接受任何操控向量。',
      '白化定身（Blanch Stun）：白鑽純白閃耀定身 1.5s；定身結束後目標自動獲得 3s 閃光抗性，防止無限連鎖定身。',
      '空間困住（Void Trap）：踩入虛空裂縫陷阱會被困在原地 2s，完全失去機動力。',
      '光環減速疊加：禪師禁錮光環（-30%）與藍鑽情緒力場（-35%）同時生效時，依乘法疊加計算，使球體寸步難行。'
    ],
    detailedExplanation: '為了防止控制過度導致挫折感，遊戲內置了控制抗性冷卻機制。白鑽閃光定身結束後，敵方球體會產生短暫的閃光抗性屏障；同時，霸體狀態（金鐘罩）能直接無效化任何正在試圖施加的控制效果。',
    keySkills: [
      { champion: '黃鑽', skill: '指定性閃電', mechanism: '每 5s 自動天降閃電打擊最近敵人，造成 0.5s 強制麻痺定身。' },
      { champion: '白鑽', skill: '閃耀', mechanism: '釋放強烈白光使敵方定身 1.5s 並附帶持續魔法微傷。' },
      { champion: '虛空獸', skill: '虛空裂縫', mechanism: '在場上佈設空間入口與出口陷阱，踩入即觸發 2s 虛空禁錮。' }
    ],
    counterStrategy: '被定身時不可慌張亂耗能量。等待定身解除後獲得的短暫抗性期間，立刻使用戰術瞬衝脫離險境或撞牆借力反打。'
  },
  {
    id: 'mech_clone_sharing',
    title: '分身協同與傷害分攤機制',
    subtitle: 'Clones, Entities & Damage Redistribution',
    iconName: 'Layers',
    badgeColor: '#10b981',
    summary: '召喚獨立生命體協同作戰，兼具火力同步與本體傷害轉移承擔的戰術機制。',
    corePrinciples: [
      '30% 傷害分攤鏈：靈隱寺本體受擊時，若 120px 範圍內存在存活分身，30% 傷害被分攤至分身承受，本體僅受 70% 傷害！',
      '超額吸收不反彈：若分身剩餘生命低於分攤傷害，分身消散，超出的傷害不會回流至本體，提供極佳的防暴擊緩衝。',
      '鏡像複製：白鑽鏡像分身擁有 2 點生命，可完美鏡像敵方技能一（如複製對手的藍箭或光球）。',
      '守護光球：靈隱寺被動三每 25s 召喚 3 顆綠色光球環繞自身，撞到敵方造成 15 點魔法傷害並擊退敵人。'
    ],
    detailedExplanation: '分身系統並非單純的視覺特效，而是真實具有血量與物理碰撞體的實體。在遭遇高單發爆發的技能（如奧巴 3 層重擊或藍鑽爆發）時，分身如同移動沙袋，能大幅削弱致命打擊的殺傷力。',
    keySkills: [
      { champion: '靈隱寺', skill: '分身術 & 靈能藍箭', mechanism: '召喚分身並同步發射藍箭，並在近距離為本體吸收 30% 傷害。' },
      { champion: '白鑽', skill: '鏡像分身', mechanism: '召喚 2 HP 鏡像實體，阻擋彈道並複製對手主要技能。' },
      { champion: '藍鑽', skill: '藍色光球', mechanism: '召喚 3 HP 定點哨塔，每 2s 自動向敵方連射追蹤光球。' }
    ],
    counterStrategy: '對陣靈隱寺時，應優先清理其身旁的分身或將靈隱寺撞出與分身的 120px 守護範圍，使其失去 30% 減傷分攤保護。'
  },
  {
    id: 'mech_true_damage_penetration',
    title: '真實傷害與全圖穿透法則',
    subtitle: 'True Damage, Penetration & Armor Bypass',
    iconName: 'Target',
    badgeColor: '#f97316',
    summary: '克制坦克與防禦結界的究極利刃。無視減傷力場與防護百分比，直接扣除敵方核心生命值。',
    corePrinciples: [
      '真實傷害（True Damage）：凡「獵手本性」疊滿 3 層獵痕時爆發的 15 點真實傷害，完全無視粉鑽減傷力場與防禦減免！',
      '全屏穿透射線：海萊絲紫色能量條與白鑽白色死光具備無衰減穿透力，能一穿到底打擊路徑上的本體與分身。',
      '魔法穿透波長：藍鑽常駐藍色波長無視一般物理反彈，每 0.5s 穩定跳出 1 點穿透魔傷。'
    ],
    detailedExplanation: '當物理碰撞型坦克以高血量與厚重減傷自居時，真實傷害是唯一的直接剋星。真實傷害跳字採用亮金色與特殊暴擊震波渲染，不與常規物理防護產生衰減運算。',
    keySkills: [
      { champion: '凡', skill: '獵手本性', mechanism: '普通箭矢命中疊加獵手標記，第 3 次命中引爆 15 點神聖真實傷害。' },
      { champion: '海萊絲', skill: '紫色能量條', mechanism: '全圖射程的紫色高能激光，穿透障礙物與召喚物造成 15 點魔法重擊。' },
      { champion: '白鑽', skill: '白色死光', mechanism: '聚焦 300px 射線持續直擊，持續造成 1.5 點魔傷與動態衝量。' }
    ],
    counterStrategy: '面對射手「凡」的真實傷害箭矢時，務必透過左右機動與戰術瞬衝進行近身壓制，不給其遠程疊加 3 層標記的空間。'
  },
  {
    id: 'mech_devour_growth',
    title: '吞噬成長與體型質變系統',
    subtitle: 'Devour, Biomass Stacking & Morphological Evolution',
    iconName: 'Flame',
    badgeColor: '#a855f7',
    summary: '吞噬魔族獨有的深淵成長機制。透過吸收戰場上的暗紫碎片，體型、生命上限與被動威力發生指數級質變。',
    corePrinciples: [
      '碎片生成與吞噬：戰場每 0.5s 自動生成 1 枚能量碎片；觸碰碎片即可吞噬吸收，層數上限為 50 層。',
      '數值成長公式：每吞噬 1 層碎片，最大生命值 +7（最高 +350 HP，上限可達 830 HP）、半徑 +0.36px、質量 +0.008。',
      '每 10 層魔軀質變：每滿 10 層額外獲得 +2% 碰撞減傷抗性（最高 10%），暴食魔爆基礎傷害與半徑大幅擴張！',
      '重量代價：魔軀龐大化後移動速度略微下降，但撞擊衝量大幅增強，對手被撞時會產生更劇烈的震退。'
    ],
    detailedExplanation: '吞噬魔族是標準的後期成長型英雄。前期體型正常且需要小心防守，一旦將層數疊至 30~50 層，其龐大的體積與極高的碰撞抗性會使其成為全場的碰撞霸主，受撞時觸發的暴食魔爆半徑亦達到最大 110px。',
    keySkills: [
      { champion: '吞噬魔族', skill: '吞噬 & 魔軀成長', mechanism: '吞噬場上碎片獲得生命值、體型、質量與抗性提升，上限 50 層。' },
      { champion: '吞噬魔族', skill: '暴食魔爆', mechanism: '受撞時 30% 機率引爆魔力，對範圍內造成 4 ~ 9 點魔法衝擊波。' }
    ],
    counterStrategy: '在吞噬魔族成長前期發動猛攻，爭奪戰場走位不讓其輕易撿拾碎片；若被其拖入後期，利用凡的真實傷害遠程風箏是最佳解法。'
  },
  {
    id: 'mech_invulnerability_mobility',
    title: '空間位移、翻滾與絕對無敵',
    subtitle: 'Blinks, Roll I-Frames & Absolute Invulnerability',
    iconName: 'Swords',
    badgeColor: '#ec4899',
    summary: '極限逃生與切入的頂級機制。包含無敵影格、空間折疊傳送與無視碰撞的高速翻滾。',
    corePrinciples: [
      '絕對無敵（Immunity）：虛空獸被動一咬住敵人 3 秒期間，本體進入虛空完全無敵，頭頂標註「虛空無敵 IMMUNE」，阻絕一切傷害。',
      '翻滾迴避（Roll I-Frames）：射手「凡」在翻滾的 0.22s 期間高速滑行，且完全免疫任何碰撞打擊。',
      '空間折疊傳送：虛空獸進入虛空裂縫入口時，瞬間瞬移至出口端，並在出口留下空間波動。',
      '幻影鎖定獵擊：虛空獸鎖定目標 3s 後化身暗影極速衝刺，造成 20 點爆發傷害並留下虛空軌跡。'
    ],
    detailedExplanation: '在快節奏的球體碰撞中，無敵與高速位移是打破僵局與規避敵方大招（如奧巴第 3 次連續重擊、海萊絲能量射線）的王牌手段。把握無敵生效的時機，能使對手的高額爆發徹底落空。',
    keySkills: [
      { champion: '虛空獸', skill: '虛空撕咬', mechanism: '每 10s 觸發，咬住目標 3s 造成每秒 2 點傷害，咬住期間自身完全無敵。' },
      { champion: '凡', skill: '翻滾預知', mechanism: '每 3s 觸發 0.22s 翻滾突進，翻滾期間免疫碰撞傷害。' },
      { champion: '虛空獸', skill: '虛空獵擊', mechanism: '鎖定敵方後化作暗影高速穿刺，造成 20 點穿甲物理傷害。' }
    ],
    counterStrategy: '當虛空獸發動撕咬無敵時，切忌對其施放投射物或大招，因所有傷害均會無效化；等待其咬咬結束彈開後再行反擊。'
  },
  {
    id: 'mech_energy_overdrive',
    title: '能量超載循環與戰術技巧',
    subtitle: 'Energy Dynamics, Overdrive & Tactical Mastery',
    iconName: 'Sparkles',
    badgeColor: '#38bdf8',
    summary: '全英雄通用的戰鬥技巧引擎。能量決定了技能的施放頻率，而超載（Overdrive）則是扭轉乾坤的爆發時刻。',
    corePrinciples: [
      '自然回能：球體每秒自動回復 7 點能量（上限 100 點）。',
      '超載狀態（Overdrive）：當能量蓄滿 100 點時，自動進入超載狀態！移速提升 10%，下一次碰撞造成額外暴擊衝量。',
      '快速回能手段：極限拼刀 (+15)、壁面彈跳受身 (+8)、海萊絲受撞吸能 (+15% 轉化)。',
      '技能能量消耗：被動觸發與戰術技能均需消耗 15 ~ 40 能量，能量不足時技能暫緩觸發，避免無腦連發。'
    ],
    detailedExplanation: '能量系統是整個競技場的核心調節器。掌握好能量節奏的選手，會利用撞牆借力和極限拼刀迅速充能，隨後手動施展戰術瞬衝（J鍵）或戰術護盾（K鍵）掌控戰局，在進入超載狀態時發動致命衝撞。',
    keySkills: [
      { champion: '全英雄', skill: '超載爆發 (Overdrive)', mechanism: '滿 100 能量啟動，移速提升並強化下一次撞擊動能。' },
      { champion: '全英雄', skill: '戰術瞬衝 [J]', mechanism: '消耗 30 能量向敵方極速衝刺，造成額外衝撞位移。' },
      { champion: '全英雄', skill: '戰術護盾 [K]', mechanism: '消耗 25 能量展開護盾，抵擋下一次傷害。' }
    ],
    counterStrategy: '當發現對手頭頂標註「能量不足」時，正是發動猛攻的絕佳時機；若對手進入「OVERDRIVE 超載」，應避其鋒芒，防範其強化衝擊。'
  },
  {
    id: 'mech_field_resonance',
    title: '結界領域與延遲共鳴引爆機制',
    subtitle: 'Area Fields, Resonance & Delayed Detonation',
    iconName: 'Radio',
    badgeColor: '#06b6d4',
    summary: '以時間換取空間與高額爆發的控場領域機制。包含週期性頻率跳傷、強力移動牽引，以及倒數完畢時的核爆級引爆。',
    corePrinciples: [
      '延遲引爆核爆：藍鑽「情緒能量場」鋪設半徑 140px 結界，對踏入者施加 35% 強力減速；經過 3.5s 能量共鳴蓄滿後，產生高達 65 點全屏級魔法引爆傷害！',
      '高頻電磁領域：黃鑽「超能電場」每 0.1s 判定一次傷害與磁性干擾，以極高跳傷頻率打斷敵方慣性與微操。',
      '動態半徑歐氏判定：系統每幀以歐幾里得距離計算敵方球心與結界中心的向量長度，敵方完全脫離邊界瞬間立即解除減速與跳傷。',
      '常駐穿透波長：藍鑽「藍色波長」每 0.5s 向周圍 110px 震盪 1 點穿透魔傷，無視常規物理反彈。'
    ],
    detailedExplanation: '結界技能考驗的是走位控制與空間逼迫能力。藍鑽在鋪設情緒力場後，敵方若無法在 3.5s 內使用瞬衝或高移速逃出力場邊界，將承受致命的 65 點範圍爆破。熟練的結界型選手會將敵人逼入牆角或與隊友配合減速，達成百分之百的引爆命中。',
    keySkills: [
      { champion: '藍鑽', skill: '情緒能量場', mechanism: '140px 結界減速 35%，3.5 秒結束時引爆 65 點高額範圍魔法傷害。' },
      { champion: '黃鑽', skill: '超能電場', mechanism: '3.5s 雷電領域，以 0.1s 超高頻率對踏入者造成微量電傷與電磁減速。' },
      { champion: '藍鑽', skill: '藍色波長', mechanism: '110px 常駐脈衝，每 0.5 秒對半徑內敵人造成 1 點穿透魔法傷害。' }
    ],
    counterStrategy: '當看見藍鑽腳下展開 140px 蔚藍情緒力場時，必須立即向外緣高速滑碰或消耗 30 能量施展戰術瞬衝（J鍵）脫離，切勿在力場內貪刀徘徊，否則 3.5 秒後的 65 點核爆將直接蒸發半血。'
  },
  {
    id: 'mech_wormhole_teleportation',
    title: '空間裂縫與雙向折疊傳送機制',
    subtitle: 'Spatial Rifts, Entanglement & Wormhole Warp',
    iconName: 'Disc',
    badgeColor: '#8b5cf6',
    summary: '打破歐幾里得空間常規的拓撲傳送系統。藉由空間入口與出口折疊，實現瞬間位移重置動量與設置敵方禁錮陷阱。',
    corePrinciples: [
      '雙向蟲洞折疊：虛空獸「虛空裂縫」在競技場兩端生成暗紫旋轉奇異點（入口與出口），本體踩入入口端瞬間，光速瞬移至出口端！',
      '向量繼承與重組：傳送時保留原有速度純量但自動朝出口切線射出，使敵方預判的衝撞軌跡瞬間完全撲空。',
      '空間禁錮陷阱：敵方若誤踏虛空裂縫奇異點，將觸發暗影捕獸夾，被原地禁錮 2.0s，無法移動且無法轉向！',
      '傳送冷卻鎖定：為避免穿梭死循環，每次傳送後具有短暫的 1.5s 空間冷卻，奇異點維持 15s 存在時間。'
    ],
    detailedExplanation: '空間傳送機制在球體彈射對決中是戰術維度的質變。虛空獸既可將裂縫當作跨越全圖的逃生跳板，亦可故意將出口或入口設置在敵方常走的牆角彈跳線上，形成不可逾越的禁錮陷阱。',
    keySkills: [
      { champion: '虛空獸', skill: '虛空裂縫', mechanism: '在場上佈設空間入口與出口，自身踩入瞬間傳送，敵方踏入則被禁錮 2s。' },
      { champion: '虛空獸', skill: '虛空撕咬', mechanism: '鎖定撕咬時本體完全化入虛空，不可選中且免疫傷害。' }
    ],
    counterStrategy: '時刻留意競技場地面旋轉的暗紫空間奇異點位置。切忌沿著奇異點連線方向直線衝刺；若被虛空獸誘騙入裂縫，可預先扣留戰術護盾防範後續集火。'
  },
  {
    id: 'mech_cheat_death_resurgence',
    title: '瀕死保底與防暴斃急救機制',
    subtitle: 'Emergency Lifeline, Cheat Death & Resurgence',
    iconName: 'HeartPulse',
    badgeColor: '#ec4899',
    summary: '高危險碰撞環境下的終極保險絲。在受到致命爆發或血量危急的單一影格內，強制阻斷死亡並執行急救回能。',
    corePrinciples: [
      'T0 級阻斷單幀暴斃：禪師「金身回復」在生命值低於 30% 或受到將致死的超額爆發瞬間，強制終止常規扣血流程，直接回復 80 HP！',
      '瀕死全彈發射：海萊絲「魔法附體」在血線被壓制至 25% 以下時瞬間啟動，自動發射 4 枚追蹤魔法飛彈並補滿魔力。',
      '單場冷卻與指示燈：瀕死急救通常具備單場 1 次或長達數十秒的冷卻，英雄球體下方會以金色/紫色流光顯示保底就緒狀態。',
      '阻斷致死溢出傷害：受到超過剩餘生命上限的巨額傷害時，金身回復先於死亡結算執行，將血量鎖定並抬升至安全線。'
    ],
    detailedExplanation: '在碰撞遊戲中，連續的暴擊衝撞或重擊連攜往往會在數毫秒內造成致死傷害。瀕死保底機制賦予玩家極限容錯率，也是弱勢方在血線落後時反敗為勝的心理戰籌碼。進攻方必須考慮對手的保底技能是否已交，避免無效浪費終結爆發。',
    keySkills: [
      { champion: '禪師', skill: '金身回復', mechanism: '生命低於 30% 或致命時立即觸發，回復 80 HP，每場戰鬥僅限觸發 1 次。' },
      { champion: '海萊絲', skill: '魔法附體', mechanism: '生命低於 25% 自動啟動，發射 4 枚追蹤魔法飛彈並重填魔力。' }
    ],
    counterStrategy: '對陣禪師時，切記在其血量高於 30% 時保留高消耗的高額終結技；先以小傷磨破其 30% 逼出「金身回復」後，再交出爆發技能完成擊殺。'
  },
  {
    id: 'mech_hunter_marks',
    title: '獵痕標記疊加與真實傷害引爆機制',
    subtitle: 'Hunter Marks, Stacking & Divine True Damage',
    iconName: 'Crosshair',
    badgeColor: '#f59e0b',
    summary: '射手「凡」專屬的精準獵殺系統。透過射程優勢累積白色獵痕，疊滿 3 層無視一切減傷引爆真實傷害。',
    corePrinciples: [
      '獵痕動態指示：凡的箭矢命中目標時，會在目標身旁生成旋轉的白色結晶環；1~2 層時白環快速旋轉示警。',
      '第 3 層破甲真傷：當獵痕累積至第 3 層瞬間，白環爆碎引發神聖衝擊，直接造成 15 點無視任何防禦與減傷力場的真實傷害！',
      '真實傷害屬性：真實傷害無視粉鑽減傷力場（-25%）、火桶護盾與吞噬魔族魔軀碰撞抗性，扣減數值完全固定。',
      '層數衰退倒數：若目標在 4.5s 內未再次受到凡的攻擊，獵痕將自然消散，考驗射手的連續壓制節奏。'
    ],
    detailedExplanation: '凡的獵痕系統將射手的「持續輸出」與「爆發終結」完美融合。面對以高質量或高減傷著稱的坦克英雄時，真實傷害是無可爭議的終極剋星。配合其 300px 遠程射程圈與翻滾迴避，凡能將坦克玩弄於股掌之間。',
    keySkills: [
      { champion: '凡', skill: '獵手本性', mechanism: '常態射出精準箭矢，命中疊加獵痕，3 層引爆 15 點神聖真實傷害。' },
      { champion: '凡', skill: '超頻爆發', mechanism: '提升 6% 射程並大幅縮短翻滾冷卻，使疊加獵痕的速度倍增。' }
    ],
    counterStrategy: '當自身頭頂已經懸浮 2 層旋轉白色獵痕時，切勿沿著直線逃跑，應立即走 S 形或消耗 30 能量瞬衝近身貼臉，逼迫凡進入盲區無法連續射擊。'
  },
  {
    id: 'mech_reactive_burst',
    title: '被動受撞反震與深淵範圍魔爆',
    subtitle: 'Reactive Shockwaves & Gluttony Retaliation',
    iconName: 'Zap',
    badgeColor: '#d946ef',
    summary: '防守即進攻的反打機制。受到敵方碰撞衝撞時，藉由被動幾率或能量消耗引發反向衝擊或範圍魔力爆破。',
    corePrinciples: [
      '深淵暴食魔爆：吞噬魔族受撞時 30% 機率由體內向外引爆深淵魔能，對半徑 70~110px 範圍造成 4 ~ 9 點魔法衝擊波！',
      '火焰護甲反傷：火桶受撞時消耗 15 能量反震 5 點灼燒傷害（冷卻 4 秒），限制近戰進攻節奏。',
      '禪師金鐘反彈：禪師受撞反彈 25% 傷害，並給予自身 0.5s 霸體，直接反制近身連擊。'
    ],
    detailedExplanation: '被動反擊機制徹底打破了「進攻方永遠主動獲益」的思維定勢。吞噬魔族魔軀階級越高，暴食魔爆的爆炸半徑（最高 110px）與威力越大，使得圍攻魔族反而會遭受毀滅性的範圍魔爆反噬。',
    keySkills: [
      { champion: '吞噬魔族', skill: '暴食魔爆', mechanism: '受撞時 30% 機率引爆魔力，對周遭範圍造成 4 ~ 9 點魔法傷害。' },
      { champion: '火桶', skill: '火焰外殼', mechanism: '受撞消耗 15 能量反擊 5 點固定灼燒火焰傷害（冷卻 4 秒）。' }
    ],
    counterStrategy: '撞擊帶有受撞反擊被動的英雄時，避免過於密集的短距離連撞；利用遠程投射物或精準位移進行消耗，降低近身受反噬的風險。'
  },
  {
    id: 'mech_boomerang_range',
    title: '回旋折返與動態射程雷達管理',
    subtitle: 'Boomerang Trajectory & Engagement Range Radar',
    iconName: 'RotateCcw',
    badgeColor: '#f472b6',
    summary: '射程界線可視化與非線性飛行軌跡。包含動態射程鎖定雷達與具備去程、回程雙段物理判定之折返投擲。',
    corePrinciples: [
      '雙段折返命中：粉鑽「粉色圓盾」直線擲出 150px 後旋轉折返，去程與回程各具備 1 次獨立物理命中，合計可造成雙倍打擊！',
      '動態射程雷達環：凡具備常態 300px（超頻 318px）的專屬射程雷達圈；當敵方球體進入雷達邊界時，自動亮起高亮鎖定準星。',
      '折返幾何角控制：投擲圓盾後藉由本體走位微調，可改變圓盾折返的回拉直線，達成隔山打牛或盲區繞擊。'
    ],
    detailedExplanation: '掌握射程邊界與非線性彈道是高階選手的標誌性素養。射程雷達明確界定了「安全風箏區」與「危險近戰區」的分界；而折返武器則允許玩家在未直面敵人的情況下，利用幾何折射創造雙倍輸出。',
    keySkills: [
      { champion: '粉鑽', skill: '粉色圓盾', mechanism: '直線擲出 150px 並旋轉折返，具備去程與回程兩段命中。' },
      { champion: '凡', skill: '專屬射程圈 (300px/318px)', mechanism: '自動鎖定半徑內目標並以最高射速進行精準風箏打擊。' }
    ],
    counterStrategy: '面對折返武器時，在圓盾剛擲出時向兩側橫向滑開，即可同時規避去程與回程；面對凡時，果斷貼身越過其 300px 射程圈進入內圍肉搏。'
  }
];

/**
 * 技能機制相生相剋互動矩陣 (Mechanism Interaction Matrix)
 */
export const MECHANISM_INTERACTIONS: MechanismInteractionRule[] = [
  {
    id: 'int_armor_vs_cc',
    title: '霸體 vs 硬性控制 (黃鑽閃電 / 白鑽閃光)',
    attackerMechanism: '硬性控制 (麻痺 / 定身 / 減速)',
    defenderMechanism: '霸體狀態 (禪師金鐘罩 0.5s)',
    priorityWinner: '霸體完全免疫 (Super Armor Wins)',
    interactionOutcome: '控制無效！目標頭頂跳出「霸體免控 IMMUNE」字樣，速度不減且不受到麻痺定身影響。',
    combatTip: '禪師受撞觸發金鐘罩時，敵方若同時落下黃鑽閃電，閃電的定身效果會被霸體完全抵消。'
  },
  {
    id: 'int_true_dmg_vs_shield',
    title: '真實傷害 (凡獵手本性) vs 減傷力場 (粉鑽力場)',
    attackerMechanism: '真實傷害 (True Damage)',
    defenderMechanism: '減傷力場 (25% 傷害減免)',
    priorityWinner: '真實傷害直接穿透 (True Damage Wins)',
    interactionOutcome: '無視減免！15 點真實傷害直接穿透粉鑽的粉色減傷力場，完整扣除其本體生命。',
    combatTip: '凡是面對粉鑽與高抗性吞噬魔族時的天然剋星，透過射程疊滿 3 層標記即可打出無減免真傷。'
  },
  {
    id: 'int_true_dmg_vs_devour',
    title: '真實傷害 (凡獵手本性) vs 魔軀高抗性 (吞噬魔族 50 層)',
    attackerMechanism: '神聖真實傷害 (True Damage)',
    defenderMechanism: '魔軀成長抗性 (最高 +10% 碰撞抗性與 830 HP)',
    priorityWinner: '真實傷害無視抗性 (True Damage Ignores Armor)',
    interactionOutcome: '15 點真實傷害完全不被魔軀成長的抗性削減，直接造成全額致命打擊。',
    combatTip: '後期魔軀龐大的吞噬魔族最忌憚射手凡的真實傷害，魔族需利用其超大質量逼迫凡撞牆。'
  },
  {
    id: 'int_i_frames_vs_burst',
    title: '無敵影格 (虛空撕咬) vs 爆發碰撞 (奧巴第3次猛撞)',
    attackerMechanism: '物理爆發碰撞 (+15 額外物傷)',
    defenderMechanism: '虛空撕咬無敵 (3s 虛空完全免疫)',
    priorityWinner: '絕對無敵優先生效 (Invulnerability Wins)',
    interactionOutcome: '傷害完全抵消！奧巴消耗能量打出的爆發傷害判定在無敵身上，顯示「虛空無敵 IMMUNE」，傷害為 0。',
    combatTip: '虛空獸撕咬咬住目標時，雙方禁止任何碰撞傷害結算，奧巴切勿在此時浪費能量衝撞。'
  },
  {
    id: 'int_clone_vs_single_target',
    title: '分身分攤 (靈隱寺 30% 分攤) vs 遠程穿刺',
    attackerMechanism: '單體爆發或投射物射擊',
    defenderMechanism: '靈隱寺分身術 (120px 傷害轉移鏈)',
    priorityWinner: '分身分攤機制分流 (Clone Mitigation)',
    interactionOutcome: '30% 傷害轉移給分身吸收，靈隱寺本體僅受 70% 傷害；若分身因傷害歸零消散，超額傷害不反流。',
    combatTip: '與靈隱寺作戰時，先以範圍技能或穿透技能清理分身，才能對其本體造成全額殺傷。'
  },
  {
    id: 'int_clash_vs_collision',
    title: '極限拼刀 vs 常規碰撞',
    attackerMechanism: '雙方球體以 >= 220 px/s 高速正面對衝',
    defenderMechanism: '常態物理分離向量',
    priorityWinner: '極限拼刀優先 (Clash Parry)',
    interactionOutcome: '觸發特殊拼刀震波與金光，雙方各自獲得 +15 能量，並彈開相互分離。',
    combatTip: '面對能量匱乏時，主動高速衝向對手拼刀，是快速累積 15 能量展開戰術技能的高階手法。'
  },
  {
    id: 'int_rift_warp_vs_charge',
    title: '空間折疊傳送 vs 戰術瞬衝鎖定',
    attackerMechanism: '高速直線戰術瞬衝 (480 px/s 衝刺)',
    defenderMechanism: '虛空裂縫折疊傳送 (Wormhole Warp)',
    priorityWinner: '空間折疊重置位移 (Spatial Warp Wins)',
    interactionOutcome: '衝刺落空！防守方踏入裂縫奇異點瞬間瞬移至出口端，進攻方高速衝撞撲空並撞擊牆面。',
    combatTip: '面對奧巴或火桶的高速直線衝鋒，虛空獸踏入裂縫可完美規避衝撞並反客為主誘敵撞牆。'
  },
  {
    id: 'int_cheat_death_vs_lethal',
    title: '瀕死保底 (禪師金身回復) vs 單發致死重擊',
    attackerMechanism: '單幀高額致死傷害 (例如 65 點能量場核爆)',
    defenderMechanism: '金身回復 T0 阻斷機制 (瀕死保底)',
    priorityWinner: 'T0 瀕死保底優先 (Cheat Death Wins)',
    interactionOutcome: '拒絕暴斃！生命值被強制鎖定並立即回復 80 HP，阻斷單幀被秒殺的厄運。',
    combatTip: '當禪師具備金身回復時，切忌在對手高血量時浪費核爆大招，應先以小技能逼出保底。'
  }
];

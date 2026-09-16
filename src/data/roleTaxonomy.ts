import { RoleCategory, RoleInfo, SubClassCriterion, CharacterSubClassMatch } from '../types/roles';

/**
 * 職業碰撞規則體系 (Role Collision Damage Rules)
 * 嚴格遵循遊戲最終統一規範：
 * - 坦克：可造成碰撞傷害
 * - 戰士：可造成碰撞傷害
 * - 刺客：可造成碰撞傷害
 * - 射手：0，不造成碰撞傷害
 * - 法師：0，不造成碰撞傷害
 * - 輔助：依角色技能設定判定
 *
 * 最終統一規則：
 * 射手與法師的基礎碰撞傷害永久固定為 0。
 * 角色仍然會正常：碰撞、反彈、受到敵方碰撞影響、受到技能傷害、受到物理系統影響。
 * 但射手與法師：撞到敵人不造成傷害，所有傷害必須由各自的技能系統產生。
 */
export interface RoleCollisionRule {
  role: RoleCategory;
  roleName: string;
  collisionDamageText: string;
  canDealDamage: boolean | 'conditional';
  detail: string;
}

export const ROLE_COLLISION_RULES: Record<RoleCategory, RoleCollisionRule> = {
  tank: {
    role: 'tank',
    roleName: '坦克',
    collisionDamageText: '可造成碰撞傷害',
    canDealDamage: true,
    detail: '主要依靠自身體積與質量撞擊敵人造成物理傷害，並可觸發反傷或體型強化。'
  },
  warrior: {
    role: 'warrior',
    roleName: '戰士',
    collisionDamageText: '可造成碰撞傷害',
    canDealDamage: true,
    detail: '主要依靠自身球體近戰肉搏高速衝撞敵人，造成爆發或持續物理傷害。'
  },
  assassin: {
    role: 'assassin',
    roleName: '刺客',
    collisionDamageText: '可造成碰撞傷害',
    canDealDamage: true,
    detail: '主要依靠高速位移突進鎖定追擊衝撞，造成敏捷物理碰撞傷害。'
  },
  marksman: {
    role: 'marksman',
    roleName: '射手',
    collisionDamageText: '0，不造成碰撞傷害',
    canDealDamage: false,
    detail: '基礎碰撞傷害固定為 0。正常碰撞反彈但不造成撞擊傷害，所有輸出必須來自遠程技能、箭矢、投射物。'
  },
  mage: {
    role: 'mage',
    roleName: '法師',
    collisionDamageText: '0，不造成碰撞傷害',
    canDealDamage: false,
    detail: '基礎碰撞傷害固定為 0。正常碰撞反彈但不造成撞擊傷害，所有輸出必須來自魔法、能量、範圍技能或法術投射物。'
  },
  support: {
    role: 'support',
    roleName: '輔助',
    collisionDamageText: '依角色技能設定判定',
    canDealDamage: 'conditional',
    detail: '基礎碰撞傷害依角色技能設定判定（如特定被動或防禦技能賦予的反傷與碰撞效果）。'
  }
};

/**
 * 角色詳細分類與判定標準體系 (Comprehensive Character Role Taxonomy & Criteria)
 * 嚴格遵循遊戲角色分類判定標準：
 * 涵蓋 6 大定位（坦克、戰士、刺客、射手、法師、輔助）與 54 種細分判定準則。
 */
export const ROLE_TAXONOMY: Record<RoleCategory, RoleInfo> = {
  tank: {
    id: 'tank',
    name: '坦克',
    englishName: 'Tank',
    themeColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    description: '以高生命值、減傷、護盾、控制或反傷為核心，負責承傷與吸收戰場衝擊。',
    subClasses: [
      {
        id: 'tank_main',
        name: '主坦克',
        parentRole: 'tank',
        criterion: '高生命值、高承傷能力，主要依靠自身耐久度長時間承受傷害。',
        matchedCharacterIds: ['huotong', 'chanshi']
      },
      {
        id: 'tank_defense',
        name: '防禦坦克',
        parentRole: 'tank',
        criterion: '擁有減傷、護盾、防禦或降低受到傷害的能力。',
        matchedCharacterIds: ['chanshi', 'huotong']
      },
      {
        id: 'tank_reflect',
        name: '反傷坦克',
        parentRole: 'tank',
        criterion: '受到攻擊或碰撞後，能將部分傷害反射給敵人。',
        matchedCharacterIds: ['huotong', 'chanshi']
      },
      {
        id: 'tank_shield',
        name: '護盾坦克',
        parentRole: 'tank',
        criterion: '能產生自身或友方護盾，利用額外生命值承受傷害。',
        matchedCharacterIds: ['chanshi']
      },
      {
        id: 'tank_control',
        name: '控制坦克',
        parentRole: 'tank',
        criterion: '具備定身、減速、禁錮等控制能力，同時具有較高生存能力。',
        matchedCharacterIds: ['chanshi']
      },
      {
        id: 'tank_collision',
        name: '碰撞坦克',
        parentRole: 'tank',
        criterion: '主要依靠體型、重量、碰撞強度與碰撞技能造成威脅。',
        matchedCharacterIds: ['huotong', 'tunshimozu']
      },
      {
        id: 'tank_growth',
        name: '成長坦克',
        parentRole: 'tank',
        criterion: '能透過吸收戰場碎片或時間成長提升生命、體型與數值，後期轉化為強大戰力。',
        matchedCharacterIds: ['tunshimozu']
      },
      {
        id: 'tank_heal',
        name: '回復坦克',
        parentRole: 'tank',
        criterion: '具有自身生命恢復、持續回血或低血量回復能力。',
        matchedCharacterIds: ['chanshi']
      },
      {
        id: 'tank_zone',
        name: '陣地坦克',
        parentRole: 'tank',
        criterion: '能在固定區域建立防禦、控制或持續效果，適合守住戰場區域。',
        matchedCharacterIds: ['chanshi']
      }
    ]
  },
  warrior: {
    id: 'warrior',
    name: '戰士',
    englishName: 'Warrior',
    themeColor: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.45)',
    description: '具備均衡攻防、高速肉搏衝撞與近身連續爆發的近戰主力。',
    subClasses: [
      {
        id: 'warrior_melee',
        name: '近戰戰士',
        parentRole: 'warrior',
        criterion: '主要依靠自身球體接近敵人並透過碰撞造成傷害。',
        matchedCharacterIds: ['oba', 'huangzuan', 'longshen']
      },
      {
        id: 'warrior_collision',
        name: '碰撞戰士',
        parentRole: 'warrior',
        criterion: '碰撞本身是主要輸出手段，並能強化碰撞傷害或衝撞效果。',
        matchedCharacterIds: ['oba', 'huangzuan', 'longshen']
      },
      {
        id: 'warrior_burst',
        name: '爆發戰士',
        parentRole: 'warrior',
        criterion: '短時間內能透過技能或連續碰撞造成大量傷害。',
        matchedCharacterIds: ['oba', 'longshen']
      },
      {
        id: 'warrior_sustain',
        name: '持續戰士',
        parentRole: 'warrior',
        criterion: '能透過連續攻擊、碰撞或技能維持穩定輸出。',
        matchedCharacterIds: ['oba', 'huangzuan', 'tunshimozu', 'longshen']
      },
      {
        id: 'warrior_speed',
        name: '速度戰士',
        parentRole: 'warrior',
        criterion: '速度會直接影響輸出、追擊或戰鬥能力。',
        matchedCharacterIds: ['huangzuan']
      },
      {
        id: 'warrior_control',
        name: '控制戰士',
        parentRole: 'warrior',
        criterion: '具備減速、麻痺、限制移動等控制效果，同時保有戰士型輸出。',
        matchedCharacterIds: ['huangzuan']
      },
      {
        id: 'warrior_defense',
        name: '防禦戰士',
        parentRole: 'warrior',
        criterion: '具有一定減傷、反震、防禦或承傷能力。',
        matchedCharacterIds: ['oba']
      },
      {
        id: 'warrior_chase',
        name: '追擊戰士',
        parentRole: 'warrior',
        criterion: '擅長持續追蹤敵人並利用速度或位移維持近距離壓力。',
        matchedCharacterIds: ['huangzuan', 'oba', 'longshen']
      },
      {
        id: 'warrior_skill',
        name: '技能戰士',
        parentRole: 'warrior',
        criterion: '核心輸出完全來自自動技能攻擊，而非物理碰撞傷害。',
        matchedCharacterIds: ['xin']
      },
      {
        id: 'warrior_growth',
        name: '成長戰士',
        parentRole: 'warrior',
        criterion: '透過戰鬥中累積經驗升級，永久提升屬性與技能威力。',
        matchedCharacterIds: ['xin']
      },
      {
        id: 'warrior_form',
        name: '形態戰士',
        parentRole: 'warrior',
        criterion: '具備雙相或多形態切換體系，在不同形態下擁有獨特攻防機制。',
        matchedCharacterIds: ['xin', 'longshen']
      }
    ]
  },
  assassin: {
    id: 'assassin',
    name: '刺客',
    englishName: 'Assassin',
    themeColor: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.15)',
    borderColor: 'rgba(192, 132, 252, 0.45)',
    description: '以極致機動、位移突進、鎖定追擊與定身瞬殺見長的致命突擊手。',
    subClasses: [
      {
        id: 'assassin_burst',
        name: '爆發刺客',
        parentRole: 'assassin',
        criterion: '短時間內能快速造成高額單次或連續傷害。',
        matchedCharacterIds: ['xukongshou', 'baizuan', 'zhizhu', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_speed',
        name: '高速刺客',
        parentRole: 'assassin',
        criterion: '核心戰鬥能力依賴高速移動、快速接近或快速脫離。',
        matchedCharacterIds: ['xukongshou', 'baizuan', 'zhizhu', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_stealth',
        name: '潛行刺客',
        parentRole: 'assassin',
        criterion: '能隱藏自身位置、降低可見度或暫時脫離敵人判斷。',
        matchedCharacterIds: ['xukongshou']
      },
      {
        id: 'assassin_dash',
        name: '突進刺客',
        parentRole: 'assassin',
        criterion: '能快速向敵人突進並在短時間內完成攻擊。',
        matchedCharacterIds: ['xukongshou', 'zhizhu', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_chase',
        name: '追擊刺客',
        parentRole: 'assassin',
        criterion: '能鎖定敵人並持續追擊，讓敵人難以脫離攻擊範圍。',
        matchedCharacterIds: ['xukongshou', 'zhizhu', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_control',
        name: '控制刺客',
        parentRole: 'assassin',
        criterion: '透過定身、禁錮、陷阱或其他控制效果限制敵人後再進行攻擊。',
        matchedCharacterIds: ['xukongshou', 'baizuan', 'zhizhu', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_poison',
        name: '毒液刺客',
        parentRole: 'assassin',
        criterion: '以致命毒牙、毒素印記與毒爆連招進行削弱與爆發。',
        matchedCharacterIds: ['zhizhu']
      },
      {
        id: 'assassin_summon',
        name: '召喚刺客',
        parentRole: 'assassin',
        criterion: '能召喚狂暴蛛群等生物協同作戰，提供干擾與追擊傷害。',
        matchedCharacterIds: ['zhizhu']
      },
      {
        id: 'assassin_teleport',
        name: '位移刺客',
        parentRole: 'assassin',
        criterion: '核心能力包含瞬移、衝刺、閃避或特殊位移。',
        matchedCharacterIds: ['xukongshou', 'yinyong', 'manyaiya']
      },
      {
        id: 'assassin_true_damage',
        name: '真傷刺客',
        parentRole: 'assassin',
        criterion: '主要輸出包含無視一般防禦、減傷或抗性的真實傷害。',
        matchedCharacterIds: ['zhizhu', 'manyaiya']
      }
    ]
  },
  marksman: {
    id: 'marksman',
    name: '射手',
    englishName: 'Marksman',
    themeColor: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    description: '以遠程投射物、規律壓制、真實傷害或零碰撞風箏拉扯為核心。基礎碰撞傷害永久固定為 0，輸出全來自遠程技能系統。',
    subClasses: [
      {
        id: 'marksman_rapid',
        name: '速射射手',
        parentRole: 'marksman',
        criterion: '攻擊頻率高，依靠大量快速投射物累積傷害。',
        matchedCharacterIds: ['lingyinsi']
      },
      {
        id: 'marksman_sniper',
        name: '狙擊射手',
        parentRole: 'marksman',
        criterion: '攻擊距離較長，依靠單次高傷害或精準命中造成威脅。',
        matchedCharacterIds: ['fan']
      },
      {
        id: 'marksman_burst',
        name: '爆發射手',
        parentRole: 'marksman',
        criterion: '短時間內透過連續遠程攻擊快速打出大量傷害。',
        matchedCharacterIds: ['lingyinsi']
      },
      {
        id: 'marksman_sustain',
        name: '持續射手',
        parentRole: 'marksman',
        criterion: '能長時間穩定進行遠程輸出，不依賴單次爆發。',
        matchedCharacterIds: ['fan', 'lingyinsi', 'mimi']
      },
      {
        id: 'marksman_control',
        name: '控制射手',
        parentRole: 'marksman',
        criterion: '遠程攻擊或投射物具備魅惑、減速、禁錮等強力控場能力。',
        matchedCharacterIds: ['mimi']
      },
      {
        id: 'marksman_range',
        name: '遠程射手',
        parentRole: 'marksman',
        criterion: '主要攻擊距離明顯高於一般碰撞或近戰角色。',
        matchedCharacterIds: ['fan', 'lingyinsi']
      },
      {
        id: 'marksman_pierce',
        name: '穿透射手',
        parentRole: 'marksman',
        criterion: '攻擊能穿透敵人、障礙或一次影響多個目標。',
        matchedCharacterIds: []
      },
      {
        id: 'marksman_homing',
        name: '追蹤射手',
        parentRole: 'marksman',
        criterion: '投射物或攻擊能追蹤、鎖定或持續追擊敵人。',
        matchedCharacterIds: []
      },
      {
        id: 'marksman_aoe',
        name: '範圍射手',
        parentRole: 'marksman',
        criterion: '攻擊能造成區域傷害或同時影響多個位置。',
        matchedCharacterIds: ['lingyinsi']
      },
      {
        id: 'marksman_true_damage',
        name: '真傷射手',
        parentRole: 'marksman',
        criterion: '主要遠程輸出包含真實傷害。',
        matchedCharacterIds: ['fan']
      },
      {
        id: 'marksman_non_collision',
        name: '非碰撞射手',
        parentRole: 'marksman',
        criterion: '角色本身不造成碰撞傷害（碰撞傷害固定為 0），所有輸出均來自遠程技能、箭矢或投射物。',
        matchedCharacterIds: ['fan', 'lingyinsi']
      }
    ]
  },
  mage: {
    id: 'mage',
    name: '法師',
    englishName: 'Mage',
    themeColor: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    description: '掌控奧術法陣、領域光環、召喚物射擊與能量轉化的魔法輸出者。基礎碰撞傷害永久固定為 0，輸出全來自魔法技能系統。',
    subClasses: [
      {
        id: 'mage_burst',
        name: '爆發法師',
        parentRole: 'mage',
        criterion: '透過技能在短時間內造成大量魔法傷害。',
        matchedCharacterIds: ['lanzuan', 'baizuan']
      },
      {
        id: 'mage_sustain',
        name: '持續法師',
        parentRole: 'mage',
        criterion: '依靠持續存在的魔法效果、週期攻擊或持續傷害輸出。',
        matchedCharacterIds: ['lanzuan', 'hailaise']
      },
      {
        id: 'mage_zone_control',
        name: '控場法師',
        parentRole: 'mage',
        criterion: '能改變戰場區域，利用範圍效果限制敵人的活動空間。',
        matchedCharacterIds: ['lanzuan']
      },
      {
        id: 'mage_aoe',
        name: '範圍法師',
        parentRole: 'mage',
        criterion: '技能具有較大的作用範圍，可同時影響敵人或區域。',
        matchedCharacterIds: ['lanzuan', 'hailaise', 'baizuan']
      },
      {
        id: 'mage_poke',
        name: '消耗法師',
        parentRole: 'mage',
        criterion: '透過持續遠程攻擊、週期傷害或資源消耗逐步削弱敵人。',
        matchedCharacterIds: ['hailaise', 'lanzuan']
      },
      {
        id: 'mage_summon',
        name: '召喚法師',
        parentRole: 'mage',
        criterion: '能召喚獨立存在的魔法單位、能量球或其他攻擊物。',
        matchedCharacterIds: ['lanzuan', 'baizuan']
      },
      {
        id: 'mage_control',
        name: '控制法師',
        parentRole: 'mage',
        criterion: '主要依靠減速、定身、禁錮等魔法控制限制敵人。',
        matchedCharacterIds: ['baizuan', 'lanzuan']
      },
      {
        id: 'mage_energy',
        name: '能量法師',
        parentRole: 'mage',
        criterion: '核心輸出或技能強度會受到自身累積能量、魔力或資源影響。',
        matchedCharacterIds: ['hailaise']
      },
      {
        id: 'mage_teleport',
        name: '位移法師',
        parentRole: 'mage',
        criterion: '具備瞬移、傳送或特殊空間移動能力。',
        matchedCharacterIds: []
      },
      {
        id: 'mage_true_damage',
        name: '真傷法師',
        parentRole: 'mage',
        criterion: '主要魔法輸出包含真實傷害。',
        matchedCharacterIds: []
      },
      {
        id: 'mage_non_collision',
        name: '非碰撞法師',
        parentRole: 'mage',
        criterion: '角色本身不造成碰撞傷害（碰撞傷害固定為 0），所有輸出均來自魔法、能量、範圍技能或投射物。',
        matchedCharacterIds: ['hailaise', 'lanzuan', 'dina', 'jianxian']
      }
    ]
  },
  support: {
    id: 'support',
    name: '輔助',
    englishName: 'Support',
    themeColor: '#f472b6',
    bgColor: 'rgba(244, 114, 182, 0.15)',
    borderColor: 'rgba(244, 114, 182, 0.45)',
    description: '以減傷防護、圓盾防衛、泡泡尖刺與戰術機制調控戰局節奏。',
    subClasses: [
      {
        id: 'support_defense',
        name: '防禦輔助',
        parentRole: 'support',
        criterion: '主要降低自身或友方受到的傷害。',
        matchedCharacterIds: ['fenzuan']
      },
      {
        id: 'support_shield',
        name: '護盾輔助',
        parentRole: 'support',
        criterion: '能提供護盾或額外防護效果。',
        matchedCharacterIds: ['fenzuan']
      },
      {
        id: 'support_heal',
        name: '回復輔助',
        parentRole: 'support',
        criterion: '能恢復自身或友方生命值。',
        matchedCharacterIds: []
      },
      {
        id: 'support_buff',
        name: '增益輔助',
        parentRole: 'support',
        criterion: '能提升自身或友方的速度、傷害、防禦等戰鬥能力。',
        matchedCharacterIds: ['fenzuan', 'mimi']
      },
      {
        id: 'support_control',
        name: '控制輔助',
        parentRole: 'support',
        criterion: '主要透過減速、禁錮、定身等效果限制敵人。',
        matchedCharacterIds: ['mimi', 'kuileishi']
      },
      {
        id: 'support_damage_reduction',
        name: '減傷輔助',
        parentRole: 'support',
        criterion: '能直接降低受到的傷害比例。',
        matchedCharacterIds: ['fenzuan', 'kuileishi']
      },
      {
        id: 'support_summon',
        name: '召喚輔助',
        parentRole: 'support',
        criterion: '能召喚獨立單位或輔助物件協助戰鬥。',
        matchedCharacterIds: ['kuileishi']
      },
      {
        id: 'support_reflect',
        name: '反傷輔助',
        parentRole: 'support',
        criterion: '受到攻擊時能將部分傷害反射給敵人。',
        matchedCharacterIds: []
      },
      {
        id: 'support_mobility',
        name: '機動輔助',
        parentRole: 'support',
        criterion: '具有位移、衝刺、閃避或提升移動能力的輔助效果。',
        matchedCharacterIds: ['fenzuan']
      },
      {
        id: 'support_tactical',
        name: '戰術輔助',
        parentRole: 'support',
        criterion: '透過護盾、控制、範圍效果或特殊機制改變戰鬥節奏，而非單純依靠輸出。',
        matchedCharacterIds: ['fenzuan', 'kuileishi']
      }
    ]
  }
};

/**
 * 英雄符合之細分標準詳細判定 (Character Matching Criteria with Full Rationale)
 */
export const CHARACTER_SUBCLASS_MAP: Record<string, CharacterSubClassMatch[]> = {
  oba: [
    {
      name: '近戰戰士',
      parentRole: 'warrior',
      criterion: '主要依靠自身球體接近敵人並透過碰撞造成傷害。',
      rationale: '基礎攻擊力 22 點，完全依靠球體貼近敵方產生高速碰撞輸出。'
    },
    {
      name: '碰撞戰士',
      parentRole: 'warrior',
      criterion: '碰撞本身是主要輸出手段，並能強化碰撞傷害或衝撞效果。',
      rationale: '技能「重擊」使碰撞消耗 15 能量額外造成 +25% 物理傷害；「蓄力反彈」提升 25% 反彈速度。'
    },
    {
      name: '爆發戰士',
      parentRole: 'warrior',
      criterion: '短時間內能透過技能或連續碰撞造成大量傷害。',
      rationale: '技能「連續猛撞」在第 3 次碰撞後額外爆發 15 點物理爆發傷害。'
    },
    {
      name: '持續戰士',
      parentRole: 'warrior',
      criterion: '能透過連續攻擊、碰撞或技能維持穩定輸出。',
      rationale: '依靠 1.25 質量與穩定的 22 點物理平撞，具備極強的近身肉搏持久力。'
    }
  ],

  huotong: [
    {
      name: '主坦克',
      parentRole: 'tank',
      criterion: '高生命值、高承傷能力，主要依靠自身耐久度長時間承受傷害。',
      rationale: '生命值高達 580 點（全英雄最高生命），能長時間承受大量傷害。'
    },
    {
      name: '反傷坦克',
      parentRole: 'tank',
      criterion: '受到攻擊或碰撞後，能將部分傷害反射給敵人。',
      rationale: '技能「火焰外殼」受敵方碰撞時對敵人反彈 5 點固定火焰反傷（冷卻 4 秒）。'
    },
    {
      name: '碰撞坦克',
      parentRole: 'tank',
      criterion: '主要依靠體型、重量、碰撞強度與碰撞技能造成威脅。',
      rationale: '體積 24、質量 1.45 冠絕全場，搭配「滾燙桶身」高速碰撞 +15% 傷（冷卻 3.5 秒）與「爆燃反彈」+7 火傷（冷卻 8 秒）。'
    }
  ],

  hailaise: [
    {
      name: '能量法師',
      parentRole: 'mage',
      criterion: '核心輸出或技能強度會受到自身累積能量、魔力或資源影響。',
      rationale: '技能「傷害轉換」將 35% 受傷轉化為魔法能量（上限45）並回充 +16 點戰鬥能量，轉化資源釋放技能。'
    },
    {
      name: '消耗法師',
      parentRole: 'mage',
      criterion: '透過持續遠程攻擊、週期傷害或資源消耗逐步削弱敵人。',
      rationale: '技能「紫色能量條」每 2.8 秒直線貫穿發射（420px/s疾速），造成 48~78 點魔法傷害持續削血。'
    },
    {
      name: '範圍法師',
      parentRole: 'mage',
      criterion: '技能具有較大的作用範圍，可同時影響敵人或區域。',
      rationale: '「紫色能量條」具備疾速直線穿透軌跡，且「紫色爆彈」每40秒進行三連發範圍覆蓋。'
    },
    {
      name: '持續法師',
      parentRole: 'mage',
      criterion: '依靠持續存在的魔法效果、週期攻擊或持續傷害輸出。',
      rationale: '「紫色爆彈」每 40 秒連發 3 顆非指定爆彈，精準遞減壓制敵人。'
    }
  ],

  lingyinsi: [
    {
      name: '遠程射手',
      parentRole: 'marksman',
      criterion: '主要攻擊距離明顯高於一般碰撞或近戰角色。',
      rationale: '技能「靈能藍光箭」具有 400px 超遠直線射程，完全在安全距離外輸出。'
    },
    {
      name: '速射射手',
      parentRole: 'marksman',
      criterion: '攻擊頻率高，依靠大量快速投射物累積傷害。',
      rationale: '本體與召喚分身同步齊射「靈能藍光箭」，高頻率多發箭矢壓制。'
    },
    {
      name: '持續射手',
      parentRole: 'marksman',
      criterion: '能長時間穩定進行遠程輸出，不依賴單次爆發。',
      rationale: '每 4 秒規律齊射箭矢，配合分身穩定累積可觀遠程傷害。'
    },
    {
      name: '範圍射手',
      parentRole: 'marksman',
      criterion: '攻擊能造成區域傷害或同時影響多個位置。',
      rationale: '技能「聚集回金集」生成 3 個環繞旋轉光圈，碰撞引爆 18 點範圍傷害。'
    }
  ],

  chanshi: [
    {
      name: '控制坦克',
      parentRole: 'tank',
      criterion: '具備定身、減速、禁錮等控制能力，同時具有較高生存能力。',
      rationale: '技能「禁錮光環」提供 110px 範圍 35% 強力減速，同時自身擁有 500 點高生命值。'
    },
    {
      name: '反傷坦克',
      parentRole: 'tank',
      criterion: '受到攻擊或碰撞後，能將部分傷害反射給敵人。',
      rationale: '技能「金鐘罩」受擊時反彈 30% 承受傷害，並獲得 0.6 秒霸體。'
    },
    {
      name: '回復坦克',
      parentRole: 'tank',
      criterion: '具有自身生命恢復、持續回血或低血量回復能力。',
      rationale: '技能「金身回復」在生命值首度低於 30% 時，瞬間回復 80 點巨額生命值。'
    },
    {
      name: '陣地坦克',
      parentRole: 'tank',
      criterion: '能在固定區域建立防禦、控制或持續效果，適合守住戰場區域。',
      rationale: '每 7 秒常駐展開 110px 金色減速陣地，壓制敵方活動空間。'
    },
    {
      name: '防禦坦克',
      parentRole: 'tank',
      criterion: '擁有減傷、護盾、防禦或降低受到傷害的能力。',
      rationale: '金鐘罩霸體護身與 1.30 質量帶來穩固防禦體態。'
    }
  ],

  huangzuan: [
    {
      name: '速度戰士',
      parentRole: 'warrior',
      criterion: '速度會直接影響輸出、追擊或戰鬥能力。',
      rationale: '技能「閃電超速」累積最高 10 層速度（移速提升至 141%），且每層直接提供 +1.2 碰撞傷害。'
    },
    {
      name: '控制戰士',
      parentRole: 'warrior',
      criterion: '具備減速、麻痺、限制移動等控制效果，同時保有戰士型輸出。',
      rationale: '技能「指定性閃電」造成 12 點魔法傷害並附帶 0.5 秒麻痺定身。'
    },
    {
      name: '追擊戰士',
      parentRole: 'warrior',
      criterion: '擅長持續追蹤敵人並利用速度或位移維持近距離壓力。',
      rationale: '最高達 338 px/s 的電光疾速，讓敵人無從逃逸脫離近戰接觸。'
    },
    {
      name: '持續戰士',
      parentRole: 'warrior',
      criterion: '能透過連續攻擊、碰撞或技能維持穩定輸出。',
      rationale: '技能「閃電超能」展開 115px 雷域，每 0.1 秒造成 1.5 點持續電擊。'
    }
  ],

  lanzuan: [
    {
      name: '控場法師',
      parentRole: 'mage',
      criterion: '能改變戰場區域，利用範圍效果限制敵人的活動空間。',
      rationale: '技能「藍色情緒能量」展開 140px 巨大法陣，範圍內強迫減速 35%。'
    },
    {
      name: '爆發法師',
      parentRole: 'mage',
      criterion: '透過技能在短時間內造成大量魔法傷害。',
      rationale: '情緒能量法陣蓄力完畢引爆造成 65 點極限魔法爆發傷害。'
    },
    {
      name: '召喚法師',
      parentRole: 'mage',
      criterion: '能召喚獨立存在的魔法單位、能量球或其他攻擊物。',
      rationale: '技能「藍色光球」召喚獨立 3HP 光球，每 1.2 秒自動發射魔法子彈。'
    },
    {
      name: '持續法師',
      parentRole: 'mage',
      criterion: '依靠持續存在的魔法效果、週期攻擊或持續傷害輸出。',
      rationale: '技能「藍色波長」常駐 110px 領域，每 0.5 秒穩定造成 3 點魔法傷害。'
    },
    {
      name: '範圍法師',
      parentRole: 'mage',
      criterion: '技能具有較大的作用範圍，可同時影響敵人或區域。',
      rationale: '110px 波長與 140px 情緒法陣皆具備廣域覆蓋能力。'
    }
  ],

  fenzuan: [
    {
      name: '減傷輔助',
      parentRole: 'support',
      criterion: '能直接降低受到的傷害比例。',
      rationale: '技能「粉色減傷力場」展開 5 秒，受到任何傷害時直接大幅降低 25%。'
    },
    {
      name: '防禦輔助',
      parentRole: 'support',
      criterion: '主要降低自身或友方受到的傷害。',
      rationale: '透過減傷力場與圓盾格擋回護，大幅提升生存韌性。'
    },
    {
      name: '護盾輔助',
      parentRole: 'support',
      criterion: '能提供護盾或額外防護效果。',
      rationale: '技能「粉色圓盾」擲出直線 150px 來回防護屏障，兼具防衛與攻擊。'
    },
    {
      name: '戰術輔助',
      parentRole: 'support',
      criterion: '透過護盾、控制、範圍效果或特殊機制改變戰鬥節奏，而非單純依靠輸出。',
      rationale: '技能「泡泡尖刺」與「減傷力場」大幅翻轉敵我碰撞優勢與戰鬥節奏。'
    },
    {
      name: '增益輔助',
      parentRole: 'support',
      criterion: '能提升自身或友方的速度、傷害、防禦等戰鬥能力。',
      rationale: '泡泡尖刺使自身碰撞額外獲得 +8 點物理攻擊增益。'
    }
  ],

  baizuan: [
    {
      name: '控制刺客',
      parentRole: 'assassin',
      criterion: '透過定身、禁錮、陷阱或其他控制效果限制敵人後再進行攻擊。',
      rationale: '技能「閃耀」向周圍釋放純白閃光，強制判定定身敵人 1.5 秒後進行輸出。'
    },
    {
      name: '高速刺客',
      parentRole: 'assassin',
      criterion: '核心戰鬥能力依賴高速移動、快速接近或快速脫離。',
      rationale: '基礎速度 102% (260 px/s)，體積 17 輕巧敏捷。'
    },
    {
      name: '爆發刺客',
      parentRole: 'assassin',
      criterion: '短時間內能快速造成高額單次或連續傷害。',
      rationale: '技能「白色死光」300px 射線貫穿，撞擊光線觸發 12 點魔爆傷害。'
    },
    {
      name: '控制法師',
      parentRole: 'mage',
      criterion: '主要依靠減速、定身、禁錮等魔法控制限制敵人。',
      rationale: '定身 1.5 秒並每秒造成 5 點魔傷，兼具控制與法術打擊。'
    }
  ],

  xukongshou: [
    {
      name: '突進刺客',
      parentRole: 'assassin',
      criterion: '能快速向敵人突進並在短時間內完成攻擊。',
      rationale: '技能「虛空獵擊」標記後化身半透明幻影以極速突進衝向目標造成 20 點傷害。'
    },
    {
      name: '位移刺客',
      parentRole: 'assassin',
      criterion: '核心能力包含瞬移、衝刺、閃避或特殊位移。',
      rationale: '技能「虛空裂縫」開啟空間入口與出口折疊瞬間傳送；撕咬鬆口後快速向後位移彈射。'
    },
    {
      name: '追擊刺客',
      parentRole: 'assassin',
      criterion: '能鎖定敵人並持續追擊，讓敵人難以脫離攻擊範圍。',
      rationale: '黑紫色標記鎖定敵人 3 秒持續鎖定追殺，敵人無法逃脫。'
    },
    {
      name: '控制刺客',
      parentRole: 'assassin',
      criterion: '透過定身、禁錮、陷阱或其他控制效果限制敵人後再進行攻擊。',
      rationale: '虛空裂縫困住目標 2 秒，巨嘴咬住 3 秒使敵人完全無法移動或脫離。'
    },
    {
      name: '高速刺客',
      parentRole: 'assassin',
      criterion: '核心戰鬥能力依賴高速移動、快速接近或快速脫離。',
      rationale: '基礎速度 108% (275 px/s 全英雄最高極速)。'
    },
    {
      name: '爆發刺客',
      parentRole: 'assassin',
      criterion: '短時間內能快速造成高額單次或連續傷害。',
      rationale: '撕咬咬住連續造成 36 點撕咬傷害，鬆口接獵擊 20 點瞬發爆發。'
    },
    {
      name: '潛行刺客',
      parentRole: 'assassin',
      criterion: '能隱藏自身位置、降低可見度或暫時脫離敵人判斷。',
      rationale: '虛空裂縫穿梭時融入暗紫空間，獵擊時化為半透明幻影。'
    }
  ],

  fan: [
    {
      name: '非碰撞射手',
      parentRole: 'marksman',
      criterion: '角色本身不造成碰撞傷害，主要依靠遠程攻擊輸出。',
      rationale: '基礎碰撞攻擊力為 0 (attackDamage: 0)，本體與翻滾碰撞完全不扣除敵方血量，全靠遠程箭矢。'
    },
    {
      name: '真傷射手',
      parentRole: 'marksman',
      criterion: '主要遠程輸出包含真實傷害。',
      rationale: '技能「獵手本性」疊滿 3 層白色獵痕，立即造成 15 點無視一般防禦與抗性的真實傷害。'
    },
    {
      name: '遠程射手',
      parentRole: 'marksman',
      criterion: '主要攻擊距離明顯高於一般碰撞或近戰角色。',
      rationale: '基礎攻擊距離達 300px，翻滾後永久延伸至 318px，遠距離風箏拉扯。'
    },
    {
      name: '持續射手',
      parentRole: 'marksman',
      criterion: '能長時間穩定進行遠程輸出，不依賴單次爆發。',
      rationale: '每 1.5 秒自動規律判定射擊，在安全距離穩定累積傷害。'
    },
    {
      name: '狙擊射手',
      parentRole: 'marksman',
      criterion: '攻擊距離較長，依靠單次高傷害或精準命中造成威脅。',
      rationale: '318px 精準直線貫通射擊與 3 層獵痕定點爆破。'
    }
  ],

  tunshimozu: [
    {
      name: '成長坦克',
      parentRole: 'tank',
      criterion: '能透過吸收戰場碎片或時間成長提升生命、體型與數值，後期轉化為強大戰力。',
      rationale: '每吸收 1 個能量碎片提升體型、重量、HP 上限與碰撞傷害，最高完全成長達到 38 Size、2.20 Mass、710 HP 與 15 碰撞傷害。'
    },
    {
      name: '碰撞坦克',
      parentRole: 'tank',
      criterion: '主要依靠體型、重量、碰撞強度與碰撞技能造成威脅。',
      rationale: '成長後擁有 2.20 超大重量與 38 超巨碰撞半徑，碰撞傷害從 5 成長至 20 (含魔軀成長)，形成巨大化肉搏壓制。'
    },
    {
      name: '持續戰士',
      parentRole: 'warrior',
      criterion: '能透過連續攻擊、碰撞或技能維持穩定輸出。',
      rationale: '依靠高頻碰撞、永久性魔軀成長屬性加成與暴食魔爆持續造成魔物雙修傷害。'
    }
  ],

  mimi: [
    {
      name: '持續射手',
      parentRole: 'marksman',
      criterion: '能透過連續攻擊或技能維持穩定遠程傷害輸出。',
      rationale: '貓咪衝爪高頻突襲與流血傷害，維持穩定的遠程與近距離騷擾。'
    },
    {
      name: '控制射手',
      parentRole: 'marksman',
      criterion: '具備強力的位移牽引、魅惑或定身控制技能。',
      rationale: '愛心飛射命中敵方後造成 2 秒強制魅惑位移，打亂敵方戰術走位。'
    },
    {
      name: '增益輔助',
      parentRole: 'support',
      criterion: '能透過生成道具或特殊機制永久成長自身或改變戰局。',
      rationale: '咪咪希望生成生命包與攻擊包，永久成長自身血量與攻擊力。'
    }
  ],

  jiandaoshou: [
    {
      name: '生命比例傷害',
      parentRole: 'mage',
      criterion: '技能傷害根據敵方最大生命值百分比造成額外傷害，敵方血量上限越高傷害越高。',
      rationale: '剪刀近戰剪裁與聖針連射命中時，均附帶目標最大生命值 1% 的額外魔法傷害，且不隨目標當前血量降低而衰減。'
    },
    {
      name: '指定防護',
      parentRole: 'mage',
      criterion: '具備領域遮蔽或目標指定豁免能力，範圍外敵人無法鎖定自身。',
      rationale: '聖霧守護展開 130px 聖白領域，處於霧圈外的敵人完全無法指定剪刀手，無法使用指向與自動鎖定技能。'
    },
    {
      name: '多段控制',
      parentRole: 'assassin',
      criterion: '擁有連續多段攻擊與減速牽制能力，可快速壓制敵方移動步伐。',
      rationale: '聖針連射連續發射 5 枚高速飛針，每枚命中均施加 20% 緩速持續 1 秒，多段命中可持續限制敵人機動性。'
    }
  ],

  dina: [
    {
      name: '遠距離風箏',
      parentRole: 'mage',
      criterion: '具備主動距離管理與安全拉扯機制，優先維持與敵人距離並於遠程施放技能。',
      rationale: '被動【核心之力】於敵人接近 130px 時自動拉開距離至安全距離，配合白光、暗光遠程輸出。'
    },
    {
      name: '光暗能量',
      parentRole: 'mage',
      criterion: '掌控雙重或多重能量體系，透過能量積累與吸收強化攻擊機制。',
      rationale: '白光命中生成白光能量，暗光吸收可用能量蓄力並取得完美吸收資格。'
    },
    {
      name: '融合攻擊',
      parentRole: 'mage',
      criterion: '能將不同元素或能量進行交融共鳴，爆發出複合型魔法威力。',
      rationale: '暗光發射開啟 Fusion Window，將白光與暗光融合成三相融合光球，造成高額爆發傷害。'
    },
    {
      name: '隨機控制',
      parentRole: 'support',
      criterion: '技能命中可隨機施加多種不同異常負面狀態，使敵方戰鬥節奏難以預測。',
      rationale: '三相融合光球命中隨機附加燃燒（持續傷害）、緩速（降低移速）或定神（完全定身）控制。'
    }
  ],
  jianxian: [
    {
      name: '遠程消耗',
      parentRole: 'mage',
      criterion: '具備超遠距離技能投射手段，能持續在安全距離磨耗敵方生命值。',
      rationale: '每 3秒 自動射出 420px 仙靈白劍，於極限射程或命中時產生 70px 小範圍魔法爆裂。'
    },
    {
      name: '位移拉距',
      parentRole: 'mage',
      criterion: '遭遇敵人逼近時具備主動或被動位移能力，拉開安全作戰間隔。',
      rationale: '當敵人進入危險距離時，自動反向短距離位移 140px，並射出緩速仙劍削弱目標 25% 速度。'
    },
    {
      name: '持續劍陣',
      parentRole: 'mage',
      criterion: '召喚維持數秒的領域或伴隨式法陣，提供高頻率持續攻擊輸出。',
      rationale: '身後凝結三把大型仙劍形成 10 秒劍陣，每 0.1 秒高頻發射劍氣，嚴格控制每秒 3.5 魔法秒傷上限。'
    }
  ],
  longshen: [
    {
      name: '近戰戰士',
      parentRole: 'warrior',
      criterion: '主要依靠自身球體接近敵人並透過碰撞與近身技能造成物理傷害。',
      rationale: '龍神以球體型態戰鬥，近身 160px 自動觸發【龍普】造成 5 點物理打擊，並具備 6 點基礎碰撞傷害。'
    },
    {
      name: '範圍壓制',
      parentRole: 'warrior',
      criterion: '具備大範圍扇形或領域持續傷害，能在近中距離封鎖並壓制敵方走位。',
      rationale: '【龍炎】朝前方 90 度扇形 220px 噴射持續火焰，2 秒內多段判定造成最高 6 點範圍火焰傷害。'
    },
    {
      name: '變身持續輸出',
      parentRole: 'warrior',
      criterion: '顯現強大的終極真身形態，全面強化機動性與全方位領域輸出。',
      rationale: '【龍身】顯現飛行龍形真身持續 10 秒，跑速提升 +35%（達 128.25%），周圍產生 140px 龍焰領域造成最高 25 點火焰傷害。'
    },
    {
      name: '突進爆發',
      parentRole: 'warrior',
      criterion: '自動鎖定附近有效目標進行快速短距俯衝，造成單次物理爆發傷害。',
      rationale: '【龍搖】自動判定附近有效敵人朝其快速俯衝（最大 220px），命中造成 8 點單次物理爆發傷害。'
    }
  ],
  xin: [
    {
      name: '技能戰士',
      parentRole: 'warrior',
      criterion: '核心輸出完全來自自動技能攻擊，而非物理碰撞傷害。',
      rationale: '辛是第一位不依靠碰撞造成傷害的戰士，碰撞傷害永久固定為 0，純依賴自動鎖定技能輸出。'
    },
    {
      name: '成長戰士',
      parentRole: 'warrior',
      criterion: '透過戰鬥中累積經驗升級，永久提升屬性與技能威力。',
      rationale: '每累積 100 XP 提升一級（最高 Lv.6），每級提升全技能攻擊力 +10% 與最大生命 +25。'
    },
    {
      name: '形態切換',
      parentRole: 'warrior',
      criterion: '具備雙相或多形態切換體系，在不同形態下擁有獨特攻防機制。',
      rationale: '周身環繞雙相魔劍，可切換初始【平衡魔劍】、統御【光之魔劍】與狂暴【暗之魔劍】三種戰鬥形態。'
    },
    {
      name: '非指定鎖定',
      parentRole: 'warrior',
      criterion: '自動搜尋最近目標並鎖定方向發動直線彈道技能，敵人可走位規避。',
      rationale: '所有技能均遵循自動鎖定範圍內最近敵人，固定方向射出直線劍痕或突進穿透。'
    }
  ],
  kuileishi: [
    {
      name: '傀儡召喚',
      parentRole: 'support',
      criterion: '能召喚獨立戰鬥單位協助戰鬥、吸引火力與承擔傷害。',
      rationale: '每 8 秒自動召喚一具 3 條生命條 (共 60 HP) 的魔法戰鬥傀儡 (最多 2 具)，具備獨立仇恨優先吸引敵方火力。'
    },
    {
      name: '牽制控制',
      parentRole: 'support',
      criterion: '主要透過減速、束縛、定身等負面狀態限制敵方走位。',
      rationale: '技能「牽線束縛」每 6 秒向 300px 內敵人發射命運傀儡線，降低目標 25% 移動速度持續 2 秒，並引導傀儡集火。'
    },
    {
      name: '遠程消耗',
      parentRole: 'support',
      criterion: '依靠中遠距離自動攻擊或召喚物持續磨損敵方生命值。',
      rationale: '傀儡在 150px 範圍內以 1.0 秒間隔持續造成 2 點傷害，累積共鳴層數。'
    },
    {
      name: '保護支援',
      parentRole: 'support',
      criterion: '具備為自身或友方提供免傷、減傷轉移或護盾支援的防禦機制。',
      rationale: '「傀儡護幕」提供 30% 減傷並將 30% 傷害轉移至傀儡；「木偶替身」在承受高額傷害時額外減免 20% (雙減傷最高 50%)。'
    },
    {
      name: '連鎖攻擊',
      parentRole: 'support',
      criterion: '透過多重條件連鎖觸發終極爆發連招。',
      rationale: '3 層共鳴 + 牽線束縛 + 傀儡存活時觸發「木偶終幕」，依序爆發傀儡普攻(2) + 共鳴(8) + 終幕交叉斬擊(10)，合計 20 點連鎖傷害。'
    }
  ],
  yinyong: [
    {
      name: '超長蓄力一擊',
      parentRole: 'assassin',
      criterion: '需要長週期蓄力或前置準備，完成後爆發決定性攻擊。',
      rationale: '自動 22 秒超長蓄力倒數，完成後自動鎖定敵人身後並宣告 2.5 秒，揮出毀滅擊倒一拳。'
    },
    {
      name: '瞬間突襲',
      parentRole: 'assassin',
      criterion: '能瞬間位移至目標背後或盲區展開刺殺。',
      rationale: '蓄力完成後無視距離瞬間瞬移至目標身後約 50px 處，並壓制鎖定攻擊方向。'
    },
    {
      name: '失敗成長',
      parentRole: 'assassin',
      criterion: '攻擊落空或受挫時不會衰退，反而能累積怒氣強化下一輪威力。',
      rationale: '【越挫越勇】一拳若未命中目標，永久疊加 1 層暴怒印記 (最高 10 層)，每層提升 5% 技能額外物理傷害。'
    },
    {
      name: '低血翻盤',
      parentRole: 'assassin',
      criterion: '生命值偏低時具備逆境逆轉能力。',
      rationale: '【不死之血】HP < 35% 時每 2 秒 3% 機率瞬間回滿最大生命 (360 HP)。'
    },
    {
      name: '瀕死免死',
      parentRole: 'assassin',
      criterion: '承受致命危險時具備保底不死或全場鎖血反制。',
      rationale: '【一拳無界】HP < 1% 時啟動 4 秒雙方免傷領域，結束後回血 10% (每場限 1 次)。'
    }
  ],
  manyaiya: [
    {
      name: '連續突進',
      parentRole: 'assassin',
      criterion: '具備多次連續超高速位移，能迅速穿透戰場並鎖定目標。',
      rationale: '「神之騎士完全體」提供 1100 px/s「弒國突進」(初始 2 次充能，穿透距離 250px)，且擊殺目標立即刷新突進。'
    },
    {
      name: '印記刺客',
      parentRole: 'assassin',
      criterion: '透過對特定目標施加層數印記，疊滿後觸發狀態質變與高額斬殺。',
      rationale: '「記憶斷片」共用核心資源(上限 3 層)，技能命中疊層，疊滿 3 層時敵方陷入 25% 易傷，自身爆發「異瞳覺醒」與神刃斬殺。'
    },
    {
      name: '控制刺客',
      parentRole: 'assassin',
      criterion: '具備遠程牽引、定身與減速控制鏈，將獵物牢牢鎖死。',
      rationale: '「聖帶・斷憶縛界」將目標拉向自身 80~100px 並束縛 0.8~1.2 秒；「神箭・白縛疾嵐」提供 25% 減速與 0.5 秒定身。'
    },
    {
      name: '收割刺客',
      parentRole: 'assassin',
      criterion: '在擊殺目標後獲得技能重置、增益延長與連續擊倒能力。',
      rationale: '完全體期間弒國突進擊殺目標立即刷新 +1 次突進並延長形態 3 秒，收割結束引發全場「記憶解放」神聖衝擊波。'
    },
    {
      name: '強化鬥士',
      parentRole: 'warrior',
      criterion: '具備形態轉換能力，開啟完全體後獲得高額機動、免疫減速與全技能強化。',
      rationale: '解鎖「神之騎士完全體」(持續 10 秒)，移速額外+15%、免疫所有減速，神箭與聖帶冷卻縮短，身附神之從刃雙持戰陣。'
    },
    {
      name: '真傷刺客',
      parentRole: 'assassin',
      criterion: '主要輸出包含無視護甲穿透的純粹神聖真實傷害。',
      rationale: '異瞳覺醒下一次攻擊追加 +12 點純粹神聖傷害；完全體突進命中 3 層斷片目標追加 15 點神聖真實傷害。'
    }
  ]
};

/**
 * 取得指定英雄的所有細分判定符合項目
 */
export function getCharacterSubClasses(characterId: string): CharacterSubClassMatch[] {
  return CHARACTER_SUBCLASS_MAP[characterId] || [];
}

/**
 * 取得指定定位的資訊
 */
export function getRoleInfo(role: RoleCategory): RoleInfo {
  return ROLE_TAXONOMY[role];
}

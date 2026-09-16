import { CharacterConfig } from '../types/game';

export const CHARACTERS: Record<string, CharacterConfig> = {
  oba: {
    id: 'oba',
    name: '奧巴',
    title: '物理戰士',
    role: '戰士（近戰／碰撞／爆發）',
    primaryRole: 'warrior',
    primaryRoleName: '戰士',
    subClasses: ['近戰戰士', '碰撞戰士', '爆發戰士', '持續戰士'],
    maxHp: 520,
    attackDamage: 14, // v2.6: 下調戰士碰撞傷害 (19 -> 14)
    speedRatio: 0.92,
    baseSpeed: 235, // px/s
    size: 21, // visual scale radius ~ 26px
    mass: 1.25,
    primaryColor: '#3b82f6', // Bright cobalt blue
    secondaryColor: '#1d4ed8', // Dark blue
    accentColor: '#60a5fa', // Light cyan blue
    glowColor: 'rgba(59, 130, 246, 0.6)',
    avatarIcon: 'Shield',
    equipment: {
      outfitName: '雷霆動力泰坦防彈裝甲衣',
      outfitType: '軍工重裝戰術防彈胸鎧',
      outfitDesc: '由軍用碳纖維與鈷藍高強度複合合金壓鑄而成，配備液壓緩震肩鎧與高溫排氣散熱閥，在極限碰撞下吸收 40% 動能衝擊。',
      weaponName: '雙聯納米脈衝指虎',
      weaponDesc: '微型高頻等離子線圈加持的重合金指節護甲，每一次揮拳或撞擊皆迸發出震撼的藍光電流脈衝。',
      accessoryName: '動能聚變渦輪反應爐',
      accessoryDesc: '胸口裝配的微型冷核聚變動力爐，隨連續碰撞旋轉釋放金黃過載氣場。'
    },
    passives: [
      {
        id: 'oba_p1',
        name: '重擊',
        type: 1,
        description: '【常駐強化】每次碰撞敵方時消耗 15 能量，使該次碰撞額外造成 20% 物理傷害 (14 → 16.8 點)。若能量不足則僅造成基礎碰撞傷害。',
        iconName: 'Zap',
        badgeText: '常駐 · 碰撞增傷 +20%',
        energyCost: 15
      },
      {
        id: 'oba_p2',
        name: '蓄力反彈',
        type: 2,
        description: '【受擊蓄能】受到敵方碰撞時消耗 15 能量觸發動能蓄力，使下一次反彈速度提升 25%，化被動為凌厲反擊。',
        iconName: 'FastForward',
        badgeText: '受擊 · 反彈速度 +25%',
        energyCost: 15
      },
      {
        id: 'oba_p3',
        name: '連續猛撞',
        type: 3,
        description: '【連擊爆發】連續 3 次與敵方碰撞命中後消耗 25 能量，使下一次猛烈碰撞額外造成 9 點高額物理爆發傷害。',
        iconName: 'Flame',
        badgeText: '3層連擊 · 下次碰撞 +9爆傷',
        energyCost: 25
      },
      {
        id: 'oba_p4',
        name: '不屈戰魂',
        type: 4,
        description: '【瀕死絕地】生命值低於 50% 時消耗 15 能量覺醒「不屈戰魂」，立即獲得 15% 減傷效果並提升 12% 移動速度，持續 8 秒。(冷卻 18 秒)',
        iconName: 'ShieldAlert',
        badgeText: 'CD 18s · HP<50% 獲15%減傷+12%移速',
        energyCost: 15
      }
    ]
  },
  huotong: {
    id: 'huotong',
    name: '火桶',
    title: '坦克遊走',
    role: '坦克（主坦／反傷／碰撞）',
    primaryRole: 'tank',
    primaryRoleName: '坦克',
    subClasses: ['主坦克', '反傷坦克', '碰撞坦克'],
    maxHp: 557, // v2.6: 全坦克生命值 +7 HP (550 -> 557)
    attackDamage: 10, // v2.6: 降低坦克碰撞傷害 (14 -> 10)
    speedRatio: 0.84,
    baseSpeed: 215, // px/s
    size: 24, // visual scale radius ~ 30px
    mass: 1.45,
    primaryColor: '#ef4444', // Red / Crimson
    secondaryColor: '#b91c1c', // Deep molten red
    accentColor: '#f97316', // Fiery orange
    glowColor: 'rgba(239, 68, 68, 0.6)',
    avatarIcon: 'Flame',
    equipment: {
      outfitName: '黑曜熔爐耐火鍛造師重風衣',
      outfitType: '焦黑耐高溫重皮革大衣',
      outfitDesc: '耐受三千度地心熔岩的高韌性耐火皮革，雙排黃銅防爆鉚釘固定，內襯烈焰朱紅隔熱層，雙肩自帶高壓蒸氣排氣管。',
      weaponName: '雙聯火神重迫擊炮',
      weaponDesc: '雙側加裝耐熱膛線高溫迫擊鋼炮，具備雙螺旋散熱槽與赤紅熔岩導流管道，能在碰撞時激發灼熱爆破。',
      accessoryName: '黃銅熱力壓力計與安全閥',
      accessoryDesc: '胸前精準跳動的雙指針壓力計，即時監控體內過熱餘燼蒸氣。'
    },
    passives: [
      {
        id: 'huotong_p1',
        name: '火焰外殼',
        type: 1,
        description: '【受擊反傷】受到敵方碰撞時消耗 15 能量觸發熾熱外殼，對反彈碰撞的敵人造成 10 點固定火焰傷害。(冷卻 4.8 秒)',
        iconName: 'ShieldAlert',
        badgeText: 'CD 4.8s · 受擊反彈 10火傷',
        energyCost: 15
      },
      {
        id: 'huotong_p2',
        name: '滾燙桶身',
        type: 2,
        description: '【疾速衝撞】速度達到 200 px/s 以上的高速衝刺狀態下，碰撞命中敵方消耗 15 能量，使碰撞傷害提升 25% (10 → 12.5 點)。(冷卻 4.5 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 4.5s · 高速衝撞增傷 +25%',
        energyCost: 15
      },
      {
        id: 'huotong_p3',
        name: '爆燃反彈',
        type: 3,
        description: '【反彈蓄勢】受到強力衝撞並反彈後消耗 20 能量蓄勢，使下一次碰撞命中額外造成 15 點烈焰爆燃傷害。(冷卻 10.2 秒)',
        iconName: 'Bomb',
        badgeText: 'CD 10.2s · 強撞反彈 +15火傷',
        energyCost: 20
      },
      {
        id: 'huotong_p4',
        name: '餘燼重燃',
        type: 4,
        description: '【碰撞散焰】每次碰撞牆壁或受到強烈衝撞時消耗 12 能量，向周圍散射 2 團燃燒餘燼，命中敵人造成 8 點魔法火傷。(冷卻 3.5 秒)',
        iconName: 'Flame',
        badgeText: 'CD 3.5s · 撞擊散發餘燼 8火傷',
        energyCost: 12
      }
    ]
  },
  hailaise: {
    id: 'hailaise',
    name: '海萊斯',
    title: '魔法英雄',
    role: '法師（能量／消耗／範圍／零碰撞傷害）',
    primaryRole: 'mage',
    primaryRoleName: '法師',
    subClasses: ['能量法師', '消耗法師', '範圍法師', '持續法師', '非碰撞法師'],
    maxHp: 430,
    attackDamage: 0,
    speedRatio: 0.98,
    baseSpeed: 255, // px/s
    size: 17, // visual scale radius ~ 21px
    mass: 0.85,
    primaryColor: '#a855f7', // Mystic Purple
    secondaryColor: '#7e22ce', // Deep Amethyst
    accentColor: '#c084fc', // Arcane Violet / Lavender
    glowColor: 'rgba(168, 85, 247, 0.65)',
    avatarIcon: 'Sparkles',
    equipment: {
      outfitName: '星穹虛空大祭司秘法神袍',
      outfitType: '星雲絲綢奧術儀式長袍',
      outfitDesc: '取自虛空星屑編織的深紫流光法衣，肩披懸浮星雲護肩，衣擺刺繡著銀白黃道十二星宮與自轉星辰。',
      weaponName: '星穹紫晶虛空權杖',
      weaponDesc: '由三重反向自轉星環環繞的紫晶法杖，頂部懸浮極光十字星針，凝聚無盡虛空魔彈。',
      accessoryName: '秘法星盤領扣與深空星帶',
      accessoryDesc: '胸口鑲嵌的星月形黑曜石寶珠，自帶微型引力場牽引星光微粒。'
    },
    passives: [
      {
        id: 'hailaise_p1',
        name: '傷害轉換',
        type: 1,
        description: '【受傷充能】受到傷害時將 35% 轉換為魔法能量儲備 (上限 45 點)，並額外立即回復 +16 點戰鬥能量！',
        iconName: 'Sparkles',
        badgeText: '常駐 · 受傷轉換35%能+回16能',
        energyCost: 0
      },
      {
        id: 'hailaise_p2',
        name: '紫色能量條',
        type: 2,
        description: '【疾速穿透】消耗 25 能量發射疾速穿透「紫色能量條」，彈速高達 480 px/s，貫穿敵人造成 52 點基礎魔傷並附加魔法轉換傷害 (52~84 點魔傷)。(冷卻 3.8 秒)',
        iconName: 'Zap',
        badgeText: 'CD 3.8s · 疾速能量條 52~84魔傷',
        energyCost: 25
      },
      {
        id: 'hailaise_p3',
        name: '紫色爆彈',
        type: 3,
        description: '【連鎖轟炸】每 40 秒週期自動發射 3 顆引導型紫色爆彈，每顆造成 20 點魔法傷害；連續命中同一目標時傷害遞減 1 點 (20/19/18 點)。(冷卻 40 秒)',
        iconName: 'Bomb',
        badgeText: 'CD 40s · 3連發引導爆彈 (20/19/18魔傷)',
        energyCost: 0
      },
      {
        id: 'hailaise_p4',
        name: '奧術晶盾',
        type: 4,
        description: '【晶盾衝擊】消耗 15 能量在身周凝結 50 點奧術護盾；護盾被打破或吸收完畢時對周圍 100px 範圍引發魔力衝擊，造成 26 點魔法傷害。(冷卻 7.0 秒)',
        iconName: 'Shield',
        badgeText: 'CD 7.0s · 50點晶盾+破盾26魔傷',
        energyCost: 15
      }
    ]
  },
  lingyinsi: {
    id: 'lingyinsi',
    name: '靈隱寺',
    title: '射手分身',
    role: '射手（遠程／速射／分身／零碰撞傷害）',
    primaryRole: 'marksman',
    primaryRoleName: '射手',
    subClasses: ['遠程射手', '速射射手', '持續射手', '範圍射手', '非碰撞射手'],
    maxHp: 380,
    attackDamage: 0,
    speedRatio: 0.98,
    baseSpeed: 250, // px/s (98% speed tier)
    size: 17, // volume 17
    mass: 0.9,
    primaryColor: '#06b6d4', // Luminous Cyan
    secondaryColor: '#0284c7', // Deep Temple Sky Blue
    accentColor: '#38bdf8', // Radiant Azure
    glowColor: 'rgba(6, 182, 212, 0.65)',
    avatarIcon: 'Layers',
    equipment: {
      outfitName: '風行翠羽遊俠輕裝戰袍',
      outfitType: '精靈遊俠前襟短獵袍',
      outfitDesc: '採用千風之息浸染的翡翠綠絲綢，飾以金絲流風雲紋與隼鷹翎羽，行動時幾乎不發出絲毫風噪。',
      weaponName: '翡翠靈風反曲神弓',
      weaponDesc: '千年青玉與靈木揉合打造的反曲神弓，弓身刻有破空符文，能將疾風凝成無形神矢。',
      accessoryName: '皮革箭袋胸帶與疾風翎羽別針',
      accessoryDesc: '斜跨胸前的鞣製鹿皮箭袋武裝帶，佩戴銀質風行徽記。'
    },
    passives: [
      {
        id: 'lingyinsi_p1',
        name: '靈能藍光箭',
        type: 1,
        description: '【同步齊射】消耗 20 能量發射穿透性疾速「靈能藍光箭」，造成 28 點直線傷害；本體與全體召喚分身同步齊射！(冷卻 3.0 秒)',
        iconName: 'Zap',
        badgeText: 'CD 3.0s · 同步齊射 28傷',
        energyCost: 20
      },
      {
        id: 'lingyinsi_p2',
        name: '靈隱寺分身術',
        type: 2,
        description: '【幻影分身】消耗 35 能量召喚 1 個靜止幻影分身 (上限 2 個，每個具備 75 HP)，同步射擊並為本體分攤 30% 傷害。(冷卻 8.5 秒)',
        iconName: 'Layers',
        badgeText: 'CD 8.5s · 召喚75HP分身+分攤30%傷',
        energyCost: 35
      },
      {
        id: 'lingyinsi_p3',
        name: '聚集回金集',
        type: 3,
        description: '【迴旋光圈】消耗 40 能量生成 3 個翡翠光圈圍繞身周旋轉，碰撞敵人引爆造成 48 點魔法傷害。(冷卻 11.0 秒)',
        iconName: 'Orbit',
        badgeText: 'CD 11.0s · 3重旋轉光圈 48魔傷',
        energyCost: 40
      },
      {
        id: 'lingyinsi_p4',
        name: '幻影步',
        type: 4,
        description: '【應急拉距】敵人迫近至 100px 內時消耗 15 能量觸發幻影瞬移 90px 拉開距離，並使本體與分身攻速提升 20%，持續 2 秒。(冷卻 6.5 秒)',
        iconName: 'Wind',
        badgeText: 'CD 6.5s · 瞬移90px拉距+攻速提升20%',
        energyCost: 15
      }
    ]
  },
  chanshi: {
    id: 'chanshi',
    name: '禪師',
    title: '禪武大師',
    role: '坦克（控制／陣地／反傷）',
    primaryRole: 'tank',
    primaryRoleName: '坦克',
    subClasses: ['控制坦克', '反傷坦克', '回復坦克', '陣地坦克', '防禦坦克'],
    maxHp: 507, // v2.6: 全坦克生命值 +7 HP (500 -> 507)
    attackDamage: 11, // v2.6: 降低坦克碰撞傷害 (17 -> 11)
    speedRatio: 0.88,
    baseSpeed: 225, // px/s (88% speed tier)
    size: 22, // radius size 22
    mass: 1.30,
    primaryColor: '#eab308', // Amber Gold
    secondaryColor: '#ca8a04', // Deep Warm Gold
    accentColor: '#fef08a', // Pale White-Gold / Ivory
    glowColor: 'rgba(234, 179, 8, 0.65)',
    avatarIcon: 'Shield',
    equipment: {
      outfitName: '金剛明王九環盤龍金絲袈裟',
      outfitType: '右袒式明黃藏青織錦袈裟',
      outfitDesc: '佛門至寶金剛袈裟，斜披盤龍金線刺繡大披帛，具備萬法不侵的佛光祥雲加持。',
      weaponName: '降魔佛光九環錫杖',
      weaponDesc: '杖頂盛開八葉金蓮托起摩尼寶珠，兩側九枚降魔金環隨步履鏗鏘作響，震懾諸邪。',
      accessoryName: '八角降魔護心鏡與沉香念珠串',
      accessoryDesc: '胸前懸掛的大顆沉香木念珠，正中八角青銅護心鏡散發琉璃澄澈金芒。'
    },
    passives: [
      {
        id: 'chanshi_p1',
        name: '禁錮光環',
        type: 1,
        description: '【陣地減速】消耗 20 能量在身周展開 110px 金色減速光環，使敵人減速 35% 並每秒造成 16 點魔法傷害。(冷卻 8.5 秒)',
        iconName: 'CircleDot',
        badgeText: 'CD 8.5s · 110px光環 減速35%+16魔傷',
        energyCost: 20
      },
      {
        id: 'chanshi_p2',
        name: '金鐘罩',
        type: 2,
        description: '【反震霸體】受擊時消耗 15 能量激發「金鐘罩」，反彈 28% 承受傷害並獲得 0.6 秒霸體抗擊狀態。',
        iconName: 'ShieldAlert',
        badgeText: '受擊 · 反彈28%傷+0.6s霸體',
        energyCost: 15
      },
      {
        id: 'chanshi_p3',
        name: '金身回復',
        type: 3,
        description: '【絕境金身】生命值低於 30% 時消耗 40 能量觸發「金身回復」，佛光灌頂瞬間恢復 80 點生命值。(冷卻 20 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 20s · HP<30% 瞬間回復80HP',
        energyCost: 40
      },
      {
        id: 'chanshi_p4',
        name: '禪心入定',
        type: 4,
        description: '【靜止修持】移動速度低於 120 px/s 或處於防禦受控狀態時，每秒額外回復 6 點能量與 4 點生命值，並減少 25% 擊退距離。',
        iconName: 'Sparkles',
        badgeText: '常駐 · 低速每秒回6能+4血 減擊退25%',
        energyCost: 0
      }
    ]
  },
  huangzuan: {
    id: 'huangzuan',
    name: '黃鑽',
    title: '雷電戰士',
    role: '戰士（速度／控制／追擊）',
    primaryRole: 'warrior',
    primaryRoleName: '戰士',
    subClasses: ['速度戰士', '控制戰士', '追擊戰士', '持續戰士'],
    maxHp: 500,
    attackDamage: 11, // v2.6: 降低戰士碰撞傷害 (15 -> 11)
    speedRatio: 0.94,
    baseSpeed: 240, // px/s (94% speed tier)
    size: 21, // visual radius size 21 (r = 26.25px)
    mass: 1.20,
    primaryColor: '#fef08a', // Cold Platinum-White Gold
    secondaryColor: '#64748b', // Crystalline Deep Platinum Facet
    accentColor: '#ffffff', // Pure Diamond Specular Highlight
    glowColor: 'rgba(254, 240, 138, 0.85)',
    avatarIcon: 'Zap',
    equipment: {
      outfitName: '超導迅雷刺客納米疾行風衣',
      outfitType: '高導電超輕質潛行戰術服',
      outfitDesc: '表面鍍有微米級金質超導雷電紋路，立體剪裁高領護頸能抵禦超音速音爆，全身散發刺骨電芒。',
      weaponName: '高頻等離子雷光雙袖刃',
      weaponDesc: '收納於腕部微型滑軌的雙聯等離子光刃，每秒震動八萬次，能撕裂任何防禦力場。',
      accessoryName: '背部微型脈衝噴氣風道口',
      accessoryDesc: '雙肩後側裝備的電離子加速噴嘴，提供瞬間折線變向的爆發推力。'
    },
    passives: [
      {
        id: 'huangzuan_p1',
        name: '指定性閃電',
        type: 1,
        description: '【索敵雷擊】消耗 20 能量召喚折線雷霆直擊目標，造成 20 點魔法傷害並使目標麻痺定身 0.4 秒。(冷卻 4.2 秒)',
        iconName: 'Zap',
        badgeText: 'CD 4.2s · 索敵雷擊 20魔傷+麻痺0.4s',
        energyCost: 20
      },
      {
        id: 'huangzuan_p2',
        name: '閃電超速',
        type: 2,
        description: '【動能疊速】每 2 秒消耗 5 能量累積 1 層閃電極速 (上限 10 層)，每層增加 5% 速度與 +1.2 碰撞傷害。',
        iconName: 'FastForward',
        badgeText: '常駐 · 最高10層 速度+50%+12物傷',
        energyCost: 5
      },
      {
        id: 'huangzuan_p3',
        name: '閃電超能',
        type: 3,
        description: '【雷電領域】消耗 40 能量在周身形成半徑 120px 雷電領域，持續 3.2 秒，每 0.1 秒造成 2.8 點高頻魔傷。(冷卻 12 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 12s · 120px雷域 3.2s每0.1s 2.8魔傷',
        energyCost: 40
      },
      {
        id: 'huangzuan_p4',
        name: '雷電過載',
        type: 4,
        description: '【碰撞電弧】速度層數達到 5 層以上時消耗 10 能量引發過載，碰撞敵人時額外觸發連鎖電弧造成 12 點魔法傷害並減速 20%，持續 1 秒。(冷卻 3.0 秒)',
        iconName: 'Zap',
        badgeText: 'CD 3.0s · 5層觸發 12魔傷電弧+減速20%',
        energyCost: 10
      }
    ]
  },
  lanzuan: {
    id: 'lanzuan',
    name: '藍鑽',
    title: '藍晶法師',
    role: '法師（控場／爆發／召喚／零碰撞傷害）',
    primaryRole: 'mage',
    primaryRoleName: '法師',
    subClasses: ['控場法師', '爆發法師', '召喚法師', '持續法師', '範圍法師', '非碰撞法師'],
    maxHp: 415,
    attackDamage: 0,
    speedRatio: 0.94,
    baseSpeed: 240, // px/s (94% speed tier)
    size: 18, // volume 18 (r = 22.5px)
    mass: 0.90,
    primaryColor: '#38bdf8', // Luminous Ice/Aqua Blue Diamond
    secondaryColor: '#0284c7', // Deep Sapphire Facet
    accentColor: '#e0f2fe', // Brilliant White-Blue Specular Diamond
    glowColor: 'rgba(56, 189, 248, 0.75)',
    avatarIcon: 'Sparkles',
    equipment: {
      outfitName: '瀚海星圖大賢者天藍法袍',
      outfitType: '深海星象奧術天鵝絨長袍',
      outfitDesc: '採集深海珍珠光澤與夜空星光紡織而成，裙擺銀絲浪花隨水流靈動浮現，兼具潮汐減速威嚴。',
      weaponName: '璇璣星象儀法杖',
      weaponDesc: '法杖尖端懸浮三重黃銅與藍寶石天球儀星環，中心深海明珠每秒噴湧冷卻減速法波。',
      accessoryName: '水精靈星軌項圈與潮汐寶珠',
      accessoryDesc: '鎖骨處佩戴的自轉星圖鎖扣，不斷凝聚護體水藍靈珠。'
    },
    passives: [
      {
        id: 'lanzuan_p1',
        name: '藍色波長',
        type: 1,
        description: '【常駐領域】持續展開 110px 藍色波長力場，每秒消耗 8 能量，領域內敵人每 0.35 秒持續受到 12 點魔法波紋傷害。',
        iconName: 'Orbit',
        badgeText: '常駐 · 110px力場 每0.35s 12魔傷',
        energyCost: 8
      },
      {
        id: 'lanzuan_p2',
        name: '藍色光球',
        type: 2,
        description: '【自動砲台】消耗 30 能量召喚 5 HP 藍晶守護光球，每 0.7 秒自動向敵人射擊疾速光彈，造成 22 點魔法傷害。(冷卻 7.5 秒)',
        iconName: 'CircleDot',
        badgeText: 'CD 7.5s · 召喚5HP光球 (每0.7s 22魔傷)',
        energyCost: 30
      },
      {
        id: 'lanzuan_p3',
        name: '藍色情緒能量',
        type: 3,
        description: '【引力法陣】消耗 45 能量展開 140px 蒼藍情緒法陣，牽引減速 35% 並在法陣結束時引發 120 點毀滅巨額魔爆！(冷卻 14 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 14s · 140px法陣 減速35%+120魔爆',
        energyCost: 45
      },
      {
        id: 'lanzuan_p4',
        name: '冰晶凝結',
        type: 4,
        description: '【霜凍追擊】消耗 15 能量使處於波長或法陣中的敵人觸發冰晶凝結，追加 16 點冰霜魔傷並大幅減速 45%，持續 1.5 秒。(冷卻 8.0 秒)',
        iconName: 'Diamond',
        badgeText: 'CD 8.0s · 霜凍凝結 16魔傷+減速45%',
        energyCost: 15
      }
    ]
  },
  fenzuan: {
    id: 'fenzuan',
    name: '粉鑽',
    title: '粉晶輔助',
    role: '輔助（減傷／護盾／戰術）',
    primaryRole: 'support',
    primaryRoleName: '輔助',
    subClasses: ['減傷輔助', '防禦輔助', '護盾輔助', '戰術輔助', '增益輔助'],
    maxHp: 427, // v2.6: 全坦克/防禦 +7 HP (420 -> 427)
    attackDamage: 7, // v2.6: 降低碰撞傷害 (10 -> 7)
    speedRatio: 0.90,
    baseSpeed: 230, // px/s (90% speed tier)
    size: 20, // volume 20 (r = 25px)
    mass: 1.00,
    primaryColor: '#f472b6', // Bright Pink Diamond
    secondaryColor: '#db2777', // Deep Rose Diamond Facet
    accentColor: '#fdf2f8', // Soft Rose-White Specular Diamond
    glowColor: 'rgba(244, 114, 182, 0.75)',
    avatarIcon: 'Shield',
    equipment: {
      outfitName: '聖靈薔薇守護天使禮服',
      outfitType: '櫻粉雙層荷葉蕾絲金邊聖殿禮服',
      outfitDesc: '柔美櫻粉與純白絲緞織造，胸前覆以鍍金天使雙翼護心鎧，背後舒展半透明薄紗聖潔披肩。',
      weaponName: '慈悲救贖雙生花杖',
      weaponDesc: '杖首盛開不凋零的金蕊薔薇聖花，兩條粉晶藤蔓環繞杖身，釋放撫慰靈魂的充沛生機。',
      accessoryName: '心形粉紅碧璽聖徽',
      accessoryDesc: '鑲嵌於胸口的璀璨粉鑽神石，能在危機時刻激發全體無敵守護法環。'
    },
    passives: [
      {
        id: 'fenzuan_p1',
        name: '粉色圓盾',
        type: 1,
        description: '【折返投擲】消耗 20 能量向前直線擲出 150px 粉色圓盾，飛出命中造成 10 點物傷，折返飛回命中造成 6 點物傷 (共計 16 點物傷)。(冷卻 8.0 秒)',
        iconName: 'Shield',
        badgeText: 'CD 8.0s · 150px折返飛盾 (出10/回6物傷)',
        energyCost: 20
      },
      {
        id: 'fenzuan_p2',
        name: '粉色減傷力場',
        type: 2,
        description: '【防護屏障】消耗 25 能量展開周身減傷力場持續 5 秒，期間大幅吸收並降低自身承受傷害 40%。(冷卻 22 秒)',
        iconName: 'ShieldAlert',
        badgeText: 'CD 22s · 展開5秒力場 減傷40%',
        energyCost: 25
      },
      {
        id: 'fenzuan_p3',
        name: '泡泡尖刺',
        type: 3,
        description: '【刺盾武裝】消耗 35 能量凝聚粉色泡泡尖刺護甲持續 7.5 秒，衝撞接觸敵人時額外造成 8 點穿刺物理傷害。(冷卻 40 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 40s · 持續7.5s 衝撞額外+8物傷',
        energyCost: 35
      },
      {
        id: 'fenzuan_p4',
        name: '治癒晶芒',
        type: 4,
        description: '【收招回春】圓盾收回或減傷力場結束時消耗 15 能量散發粉晶柔光，立即修復自身 28 點生命值並展開持續 2.5 秒的加速光徑。(冷卻 12 秒)',
        iconName: 'Heart',
        badgeText: 'CD 12s · 收招自癒28HP+加速光徑2.5s',
        energyCost: 15
      }
    ]
  },
  baizuan: {
    id: 'baizuan',
    name: '白鑽',
    title: '鏡芒晶刺',
    role: '刺客（控制／高速／爆發）',
    primaryRole: 'assassin',
    primaryRoleName: '刺客',
    subClasses: ['控制刺客', '高速刺客', '爆發刺客', '控制法師'],
    maxHp: 380,
    attackDamage: 11, // v2.6: 降低刺客碰撞傷害 (16 -> 11)
    speedRatio: 1.06, // v2.6: 提高刺客移動速度 (1.02 -> 1.06)
    baseSpeed: 272, // px/s (106% speed tier)
    size: 17, // volume 17 (r = 21.25px)
    mass: 0.85,
    primaryColor: '#ffffff', // Pure White Diamond
    secondaryColor: '#e2e8f0', // Translucent Silver Crystal Facet
    accentColor: '#ffffff', // Pure Diamond Specular Highlight
    glowColor: 'rgba(255, 255, 255, 0.9)',
    avatarIcon: 'Diamond',
    equipment: {
      outfitName: '純白稜鏡大審判官聖殿重袍',
      outfitType: '幾何折線純白高階祭司法袍',
      outfitDesc: '潔白無瑕的厚質聖職法袍，外罩銀質幾何立體肩鎧，光芒照射時折射出璀璨全光譜光輝。',
      weaponName: '折光雙月鏡面戰輪',
      weaponDesc: '雙刃全反光鏡面圓刃，刃口經原子級研磨，折射多重分身與聚焦毀滅光束。',
      accessoryName: '八面體天然折光鑽石聖胸針',
      accessoryDesc: '法袍前襟佩掛的正八面體大鑽石，不斷在身前投射出彩虹光芒與分身光學倒影。'
    },
    passives: [
      {
        id: 'baizuan_p1',
        name: '鏡像分身',
        type: 1,
        description: '【鏡像複製】消耗 35 能量召喚 1 個敵方鏡像分身 (具備 3 HP，持續 12 秒)，完美模仿並施放目標英雄的第一被動技能！(冷卻 14 秒)',
        iconName: 'Copy',
        badgeText: 'CD 14s · 召喚敵方分身 (3HP/模仿技能一)',
        energyCost: 35
      },
      {
        id: 'baizuan_p2',
        name: '閃耀',
        type: 2,
        description: '【眩目晶光】消耗 30 能量向周圍釋放純白刺目光芒，瞬間定身敵人 1.5 秒並每秒造成 12 點魔法灼傷。(冷卻 15 秒)',
        iconName: 'Sun',
        badgeText: 'CD 15s · 周圍定身1.5s+每秒12魔傷',
        energyCost: 30
      },
      {
        id: 'baizuan_p3',
        name: '白色死光',
        type: 3,
        description: '【射線掃射】消耗 40 能量釋放長達 300px 的白色毀滅死光，每秒造成 10 點魔傷，敵方撞擊光柱中心引爆 22 點穿透魔傷！(冷卻 18 秒)',
        iconName: 'Zap',
        badgeText: 'CD 18s · 300px貫穿死光+中心22魔爆',
        energyCost: 40
      },
      {
        id: 'baizuan_p4',
        name: '折射刺殺',
        type: 4,
        description: '【反彈隱刃】碰撞戰場邊界反彈後的 1.2 秒內進入「折射隱光」，下一次對敵人造成的傷害無視 35% 防禦並追加 16 點刺殺傷害。(冷卻 5.5 秒)',
        iconName: 'Sun',
        badgeText: 'CD 5.5s · 撞牆隱光 破防35%+16刺殺傷',
        energyCost: 15
      }
    ]
  },
  xukongshou: {
    id: 'xukongshou',
    name: '虛空獸',
    title: '純刺客',
    role: '刺客（突進／位移／追擊）',
    primaryRole: 'assassin',
    primaryRoleName: '刺客',
    subClasses: ['突進刺客', '位移刺客', '追擊刺客', '控制刺客', '高速刺客', '爆發刺客', '潛行刺客'],
    maxHp: 360,
    attackDamage: 12, // v2.6: 降低刺客碰撞傷害 (18 -> 12)
    speedRatio: 1.14, // v2.6: 提高刺客移動速度 (1.08 -> 1.14)
    baseSpeed: 290, // px/s (114% speed tier)
    size: 19, // volume 19 (r = 23.75px)
    mass: 0.90,
    primaryColor: '#090514', // Pitch black void abyss
    secondaryColor: '#2e1065', // Deep void purple shadow
    accentColor: '#a855f7', // Radiant void violet
    glowColor: 'rgba(168, 85, 247, 0.75)',
    avatarIcon: 'Ghost',
    equipment: {
      outfitName: '深淵噬界重裝生物異骨甲',
      outfitType: '外生長黑紫硬化幾丁質甲胃',
      outfitDesc: '由深淵死界晶化骨骸自我分泌凝結的生體鎧甲，具備自我修復與吞噬暗影能量的活性。',
      weaponName: '虛空裂爪與噬魂骨角',
      weaponDesc: '四隻晶化暗紫利爪伴生於指掌，頭頂伸展出三根鋸齒狀虛空尖刺，能直接扯破維度裂隙。',
      accessoryName: '深淵黑洞核心囚籠',
      accessoryDesc: '胸腔由六對骨齒鎖住的微型奇點黑洞，不斷將四周光線與敵方殘片吸入深淵。'
    },
    passives: [
      {
        id: 'xukongshou_p1',
        name: '虛空巨嘴',
        type: 1,
        description: '【壓制撕咬】消耗 25 能量張開深淵裂口咬住敵人 3 秒，撕咬期間完全免疫一切傷害且每 0.5 秒造成 8 點撕咬傷害 (合計 48 點，不觸發碰撞傷害)；3 秒後鬆口引爆虛空並後撤彈射。(冷卻 12 秒)',
        iconName: 'Ghost',
        badgeText: 'CD 12s · 壓制撕咬3s無敵 48撕咬傷',
        energyCost: 25
      },
      {
        id: 'xukongshou_p2',
        name: '虛空裂縫',
        type: 2,
        description: '【維度折疊】撕裂空間開啟入口與出口並瞬間折疊傳送；敵人踏入裂縫將被深淵囚禁 2 秒，隨後裂縫坍縮引爆。(冷卻 20 秒)',
        iconName: 'Layers',
        badgeText: 'CD 20s · 空間折疊傳送+困敵2s',
        energyCost: 25
      },
      {
        id: 'xukongshou_p3',
        name: '虛空獵擊',
        type: 3,
        description: '【深淵追殺】消耗 35 能量在目標身上附加暗影標記鎖定 3 秒，隨後化作深淵殘影極速襲殺，命中造成 28 點穿透暗影傷害！(冷卻 28 秒)',
        iconName: 'Crosshair',
        badgeText: 'CD 28s · 鎖定3s極速瞬殺 28暗傷',
        energyCost: 35
      },
      {
        id: 'xukongshou_p4',
        name: '虛空潛行',
        type: 4,
        description: '【暗影隱匿】完成撕咬或空間傳送後消耗 20 能量進入虛空潛行 1.5 秒，移動速度提升 35% 且下次攻擊額外附加 14 點暗影傷害。(冷卻 8.5 秒)',
        iconName: 'Eye',
        badgeText: 'CD 8.5s · 招後潛行1.5s 移速+35%+14暗傷',
        energyCost: 20
      }
    ]
  },
  fan: {
    id: 'fan',
    name: '凡',
    title: '純射手',
    role: '射手（非碰撞／真傷／遠程）',
    primaryRole: 'marksman',
    primaryRoleName: '射手',
    subClasses: ['非碰撞射手', '真傷射手', '遠程射手', '持續射手', '狙擊射手'],
    maxHp: 360,
    attackDamage: 0,
    speedRatio: 1.02,
    baseSpeed: 260,
    size: 17,
    mass: 0.85,
    primaryColor: '#334155',
    secondaryColor: '#1e293b',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    avatarIcon: 'Crosshair',
    equipment: {
      outfitName: '暗夜幽靈特工狙擊戰術風衣',
      outfitType: '高立領防紅外微光迷彩大衣',
      outfitDesc: '軍規防彈防水防紅外偵測特勤風衣，斜跨重型穿甲彈藥斜掛帶，腰懸快拆戰術武裝皮帶。',
      weaponName: '全息複合重型狙擊弩',
      weaponDesc: '高模量碳纖維複合弓臂，整合紅外激光測距儀與微型動能平衡翼，百步穿楊一擊斃命。',
      accessoryName: '特工全息夜視目鏡與金色功勳章',
      accessoryDesc: '左眼上方懸掛單眼戰術全息目鏡，標記敵方破綻白印並即時測算風阻彈道。'
    },
    passives: [
      {
        id: 'fan_p1',
        name: '獵手本性',
        type: 1,
        description: '【精準獵箭】每 1.2 秒週期自動瞄準射程內目標發射疾速箭矢，命中造成 18 點物理傷害並附加 1 層白色獵痕 (上限 3 層)。疊滿 3 層立即引爆造成 42 點真實傷害！',
        iconName: 'Crosshair',
        badgeText: '1.2s週期 · 18物傷+3層獵痕42真傷',
        energyCost: 0
      },
      {
        id: 'fan_p2',
        name: '翻滾預知',
        type: 2,
        description: '【戰術位移】預判敵方軌跡自動翻滾 110px 位移拉開距離與規避危險；翻滾完成後射程永久提升 10% (300px → 330px)。(冷卻 3.4 秒)',
        iconName: 'Compass',
        badgeText: 'CD 3.4s · 戰術翻滾110px 射程+10%',
        energyCost: 0
      },
      {
        id: 'fan_p3',
        name: '超速強化',
        type: 3,
        description: '【風行狂瀾】啟動超速動能核心持續 10 秒，移動速度激增 55%，周身環繞金色風壓；期間每秒額外加速「翻滾預知」冷卻 1.2 秒。(冷卻 12 秒)',
        iconName: 'Zap',
        badgeText: 'CD 12s · 移速+55% 翻滾冷卻加速 (持續10s)',
        energyCost: 0
      },
      {
        id: 'fan_p4',
        name: '弱點洞察',
        type: 4,
        description: '【遠距狙擊】與目標距離大於 220px 時自動觸發「弱點洞察」，普通箭矢傷害提升 25%，且有 20% 機率直接命中弱點附加 2 層白色獵痕！',
        iconName: 'Target',
        badgeText: '常駐 · 距離>220px 箭傷+25%+雙獵痕',
        energyCost: 0
      }
    ]
  },
  tunshimozu: {
    id: 'tunshimozu',
    name: '吞噬魔族',
    title: '成長坦克',
    role: '坦克／戰士（成長／碰撞／持續）',
    primaryRole: 'tank',
    primaryRoleName: '坦克',
    subClasses: ['成長坦克', '碰撞坦克', '持續戰士'],
    maxHp: 567, // v2.6: 全坦克生命值 +7 HP (560 -> 567)
    attackDamage: 3, // v2.6: 降低坦克碰撞傷害 (5 -> 3)
    speedRatio: 1.00,
    baseSpeed: 235,
    size: 18,
    mass: 0.95,
    primaryColor: '#7e22ce',
    secondaryColor: '#3b0764',
    accentColor: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.75)',
    avatarIcon: 'Skull',
    equipment: {
      outfitName: '原初暴食邪神吞天魔鎧',
      outfitType: '黑曜巨獸魔骨胸腔重鎧',
      outfitDesc: '自上古混沌暴食深淵中誕生的邪神鎧甲，胸膛為巨大森白利齒裂口，雙肩各生長一尊咆哮魔頭。',
      weaponName: '幽冥噬魂巨口戰肩與魔爪',
      weaponDesc: '肩鎧的骷髏眼眶噴湧著青藍幽冥鬼火，手臂覆蓋重型骨刺，能生生咬碎對手的生命精華。',
      accessoryName: '萬魂怨念邪煞披風',
      accessoryDesc: '身後翻騰的純黑霧狀幽冥披風，隨成長層數增加愈發龐大猙獰。'
    },
    passives: [
      {
        id: 'tunshimozu_p1',
        name: '吞噬核心',
        type: 1,
        description: '【能量吞噬】接觸戰場能量碎片自動吞噬吸收。每次吸收成長值 +1、體積 +0.4、質量 +0.025、最大生命 +3、碰撞傷害 +0.2，移動速度 -0.8% (上限 50 層)。',
        iconName: 'Flame',
        badgeText: '常駐 · 碎片吞噬 (上限50層全能成長)',
        energyCost: 0
      },
      {
        id: 'tunshimozu_p2',
        name: '魔軀成長',
        type: 2,
        description: '【永久淬鍊】每累積 10 層成長值：最大生命額外 +15、碰撞抗性 +2%、碰撞傷害 +1。滿 50 層時累計獲得生命 +75、抗性 +10%、碰撞傷害 +5！',
        iconName: 'Shield',
        badgeText: '常駐 · 每10層 生命+15/抗性+2%/傷+1',
        energyCost: 0
      },
      {
        id: 'tunshimozu_p3',
        name: '暴食魔爆',
        type: 3,
        description: '【受撞魔衝】受到敵方有效碰撞時 30% 機率引爆體內魔能，造成 16~36 點魔法傷害，範圍隨成長值由 70px 擴大至 110px。(冷卻 7.5 秒)',
        iconName: 'Zap',
        badgeText: 'CD 7.5s · 受撞30%魔爆 16~36魔傷',
        energyCost: 0
      },
      {
        id: 'tunshimozu_p4',
        name: '魔能硬皮',
        type: 4,
        description: '【深淵硬甲】每吞噬 5 個能量碎片凝聚 1 層魔能硬皮 (上限 2 層)，每層硬皮可直接抵消下一次受到的任意傷害 16 點並震退周圍敵人。',
        iconName: 'Shield',
        badgeText: '常駐 · 每5碎片獲16點抵傷硬皮 (上限2層)',
        energyCost: 0
      }
    ]
  },
  mimi: {
    id: 'mimi',
    name: '愛心者・咪咪',
    title: '持續射手／控制',
    role: '射手／輔助（持續／控制／成長）',
    primaryRole: 'marksman',
    primaryRoleName: '射手',
    subClasses: ['持續射手', '控制射手', '增益輔助'],
    maxHp: 360,
    attackDamage: 0,
    speedRatio: 1.00,
    baseSpeed: 235,
    size: 18,
    mass: 0.90,
    primaryColor: '#ec4899',
    secondaryColor: '#be185d',
    accentColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.75)',
    avatarIcon: 'Heart',
    equipment: {
      outfitName: '幻夜靈貓忍客短羽織',
      outfitType: '和風短款暗夜刺客服裝',
      outfitDesc: '暗夜深紫與櫻粉撞色日式短羽織，背部繡有金線貓爪梅花印，腰繫寬錦繡腰封與朱紅蝴蝶結。',
      weaponName: '十文字暗殺合金貓爪',
      weaponDesc: '隱藏於肉墊手套中的四聯十文字合金利刃，揮動時帶起粉色查克拉爪痕與劇毒撕裂。',
      accessoryName: '雙金鈴繩結項圈與毛絨暗影圍脖',
      accessoryDesc: '脖頸佩戴一對散發靈光的小巧黃金鈴鐺，跳躍時微晃，雙肩圍繞純白蓬鬆絨毛。'
    },
    passives: [
      {
        id: 'mimi_p1',
        name: '貓咪衝爪',
        type: 1,
        description: '【急速撲擊】自動鎖定 100px 內最近敵方發起疾風爪擊，造成 14 點物理傷害並附加 3 秒流血 (每秒 2.5 點傷害，共 21.5 點傷害)；撲擊期間免疫碰撞傷害。(冷卻 2.2 秒)',
        iconName: 'Zap',
        badgeText: 'CD 2.2s · 100px撲爪免撞 21.5總傷+流血',
        energyCost: 0
      },
      {
        id: 'mimi_p2',
        name: '愛心飛射',
        type: 2,
        description: '【魅惑愛心】向 300px 內最近敵方射出疾速大型愛心，命中或終點引爆造成 22 點魔法傷害並使目標魅惑 2.0 秒，強制朝咪咪緩慢靠近。(冷卻 12 秒)',
        iconName: 'Heart',
        badgeText: 'CD 12s · 300px愛心 22魔傷+魅惑2s',
        energyCost: 0
      },
      {
        id: 'mimi_p3',
        name: '咪咪希望',
        type: 3,
        description: '【戰場補給】每 18 秒隨機生成生命包與攻擊包各 1 顆，吸收單次使最大生命與攻擊力永久成長 +0.25% (上限 +20%)；補給包被破壞則於 38 秒後重生。',
        iconName: 'Gift',
        badgeText: '18s生成 · 雙補給包 屬性成長+0.25%',
        energyCost: 0
      },
      {
        id: 'mimi_p4',
        name: '貓咪九命',
        type: 4,
        description: '【絕境守護】承受致命傷害時消耗 30 能量緊急保留 1 點生命值，瞬間向後彈跳並獲得 1.2 秒絕對無敵愛心護罩 (每場戰鬥限觸發 1 次)。',
        iconName: 'Heart',
        badgeText: '戰鬥限1次 · 瀕死鎖血1HP+1.2s無敵',
        energyCost: 30
      }
    ]
  },
  jiandaoshou: {
    id: 'jiandaoshou',
    name: '剪刀手',
    title: '法師／刺客',
    role: '法師／刺客（生命比例傷害／指定防護／多段控制）',
    primaryRole: 'mage',
    primaryRoleName: '法師',
    subClasses: ['生命比例傷害', '指定防護', '多段控制'],
    maxHp: 380,
    attackDamage: 0,
    speedRatio: 1.04,
    baseSpeed: 250,
    size: 18,
    mass: 0.85,
    primaryColor: '#0f172a',
    secondaryColor: '#e2e8f0',
    accentColor: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.75)',
    avatarIcon: 'Scissors',
    equipment: {
      outfitName: '蒸汽工匠紳士雙排扣燕尾禮服',
      outfitType: '維多利亞修身精密刺繡燕尾服',
      outfitDesc: '精緻酒紅與炭黑呢絨面料，挺拔立領搭配純白襯衫與絲綢領結，馬甲上懸掛黃銅發條懷表鏈。',
      weaponName: '大馬士革精密合金雙刃巨剪',
      weaponDesc: '以精密星型齒輪為軸心的巨型裁縫鋼剪，刀身刻有大馬士革折疊鍛打紋理，鋒利無比。',
      accessoryName: '皮質剪鞘武裝胸帶與銀質量尺',
      accessoryDesc: '斜挎胸前的牛皮製工具吊帶，別有三枚金質裁縫大頭針與高純度水銀平衡瓶。'
    },
    passives: [
      {
        id: 'jiandaoshou_p1',
        name: '剪裁生命',
        type: 1,
        description: '【比例收割】揮舞巨剪對 110px 判定範圍內敵人施展斬切，造成 16 點物理傷害並追加目標最大生命值 5.5% 的魔法傷害，並全額轉化為自身生命回復！(冷卻 2.2 秒)',
        iconName: 'Scissors',
        badgeText: 'CD 2.2s · 110px剪裁 16物傷+5.5%最大HP+吸血',
        energyCost: 0
      },
      {
        id: 'jiandaoshou_p2',
        name: '聖霧守護',
        type: 2,
        description: '【無敵領域】展開半徑 130px 聖霧領域持續 4.5 秒，處於聖霧領域期間免疫一切傷害與負面控制！(冷卻 11 秒)',
        iconName: 'Shield',
        badgeText: 'CD 11s · 130px聖霧領域 4.5s全免疫',
        energyCost: 0
      },
      {
        id: 'jiandaoshou_p3',
        name: '聖針連射',
        type: 3,
        description: '【遠距齊射】向 400px 射程內敵人連續疾速發射 5 枚神聖飛針，每枚命中造成 18 點魔法傷害並降低目標 25% 移動速度，持續 1.2 秒。(冷卻 7.5 秒)',
        iconName: 'Crosshair',
        badgeText: 'CD 7.5s · 400px 5連發飛針 單發18魔傷',
        energyCost: 0
      },
      {
        id: 'jiandaoshou_p4',
        name: '縫合收線',
        type: 4,
        description: '【穿線爆裂】剪裁或聖針命中時附加「縫合線」；累計 4 段時消耗 15 能量強制收線，造成 24 點魔法傷害並打斷敵人動作 0.5 秒。(冷卻 6.0 秒)',
        iconName: 'Scissors',
        badgeText: 'CD 6.0s · 4段縫合收線 24魔傷+打斷',
        energyCost: 15
      }
    ]
  },
  dina: {
    id: 'dina',
    name: '蒂納',
    title: '法師／特殊型',
    role: '法師／特殊型（遠距離風箏／光暗能量／融合攻擊／隨機控制）',
    primaryRole: 'mage',
    primaryRoleName: '法師',
    subClasses: ['遠距離風箏', '光暗能量', '融合攻擊', '隨機控制'],
    maxHp: 350,
    attackDamage: 0,
    speedRatio: 0.98,
    baseSpeed: 250,
    size: 18,
    mass: 0.85,
    primaryColor: '#f8fafc',
    secondaryColor: '#1e1b4b',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.75)',
    avatarIcon: 'Sparkles',
    equipment: {
      outfitName: '日蝕雙相晨昏神女禮袍',
      outfitType: '左右對稱光暗雙色祭祀宮廷長袍',
      outfitDesc: '左半身燦金如旭日初升，右半身靛藍如永夜星河，金絲星軌自衣領延展至裙擺，展現極致神性。',
      weaponName: '日輪月魄雙環靈具',
      weaponDesc: '懸浮於雙側的日耀金輪與月蝕冰環，隨情緒共鳴釋放金色日耀脈衝與暗色噬光星彈。',
      accessoryName: '晨昏雙生浮雕束腰與星河飄帛',
      accessoryDesc: '腰間交織太陽烈焰與新月星辰的金雕束腰，背後飄揚著如流動星河般的半透明薄紗天衣。'
    },
    passives: [
      {
        id: 'dina_p1',
        name: '白光凝結',
        type: 1,
        description: '【疾速光球】操控純白光球以極速射向敵人，命中造成 5.5 點魔法傷害並凝聚 1 點白光能量。(冷卻 1.7 秒)',
        iconName: 'Sun',
        badgeText: 'CD 1.7s · 疾速白光球 5.5魔傷+凝結能量',
        energyCost: 0
      },
      {
        id: 'dina_p2',
        name: '暗光爆轟',
        type: 2,
        description: '【暗能蓄勢】消耗白光能量進行 0.35 秒蓄力後發射高能暗光，命中造成 22 點魔法傷害並開啟持續 2.0 秒的三相融合窗口。(冷卻 3.5 秒)',
        iconName: 'Moon',
        badgeText: 'CD 3.5s · 0.35s蓄力暗光 22魔傷+融合窗口',
        energyCost: 0
      },
      {
        id: 'dina_p3',
        name: '三相融合／核心之力',
        type: 3,
        description: '【相態融合】融合窗口期間發射三相融合光球，完美融合造成 48 點魔法傷害，普通融合造成 28 點魔法傷害並隨機附加燃燒、減速或定身！敵人接近 130px 時自動彈射推開。(冷卻 5.5 秒)',
        iconName: 'Orbit',
        badgeText: 'CD 5.5s · 三相融合 (28/48魔傷+控制) / 核心推開',
        energyCost: 0
      },
      {
        id: 'dina_p4',
        name: '極光共鳴',
        type: 4,
        description: '【極光步道】發射暗光或三相融合時在身後留下持續 2.5 秒的極光共鳴帶，敵方觸碰每秒受 9 點魔傷，蒂納穿過立即回復 15 點能量與 15% 移速。(冷卻 5.0 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 5.0s · 極光共鳴帶 9魔傷/回15能+速',
        energyCost: 0
      }
    ]
  },
  jianxian: {
    id: 'jianxian',
    name: '劍仙',
    title: '仙靈劍尊',
    role: '法師／特殊（遠程消耗／位移拉距／持續劍陣／零碰撞傷害）',
    primaryRole: 'mage',
    primaryRoleName: '法師',
    subClasses: ['遠程消耗', '位移拉距', '持續劍陣', '非碰撞法師'],
    maxHp: 380,
    attackDamage: 0,
    speedRatio: 1.00,
    baseSpeed: 255,
    size: 19,
    mass: 0.90,
    primaryColor: '#f8fafc',
    secondaryColor: '#38bdf8',
    accentColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.75)',
    avatarIcon: 'Sword',
    equipment: {
      outfitName: '九霄青蓮飄渺太極仙真羽衣',
      outfitType: '天青月白流雲廣袖仙人道袍',
      outfitDesc: '採九霄雲霞紡織而成，袖口與袍角刺繡朵朵金色重瓣青蓮，隨風凌空而立，超塵脫俗。',
      weaponName: '七星龍淵青蓮飛劍',
      weaponDesc: '銘刻太極八卦古篆的碧玉仙劍，劍柄綴有七顆北斗寒星靈石，心念一動化作萬道劍陣。',
      accessoryName: '太極八卦白玉佩與朱砂納靈葫蘆',
      accessoryDesc: '腰懸一塊溫潤無暇的和闐白玉太極雙魚珮，側邊繫著朱漆燙金仙家養劍靈葫。'
    },
    passives: [
      {
        id: 'jianxian_p1',
        name: '白劍爆裂',
        type: 1,
        description: '【仙劍破空】每 2.5 秒自動向敵人方向御劍射出疾速白色仙劍，命中或飛行至 440px 終點引爆 75px 範圍，造成 14 點魔法範圍傷害。(冷卻 2.5 秒)',
        iconName: 'Sparkles',
        badgeText: 'CD 2.5s · 440px仙劍 75px範圍14魔傷',
        energyCost: 0
      },
      {
        id: 'jianxian_p2',
        name: '退劍緩行',
        type: 2,
        description: '【凌波退步】敵方迫近時自動反向凌波位移 150px 拉開距離，並射出一柄寒霜仙劍造成 12 點魔法傷害與 30% 減速，持續 2.2 秒。(冷卻 4.8 秒)',
        iconName: 'Wind',
        badgeText: 'CD 4.8s · 反向瞬移150px 12魔傷+減速30%',
        energyCost: 0
      },
      {
        id: 'jianxian_p3',
        name: '百萬劍陣',
        type: 3,
        description: '【護體劍陣】啟動持續 10 秒的仙靈守護劍陣，身後三柄仙劍每 0.1 秒齊射凌厲劍氣 (單發 1.4 魔傷，每秒最高 12 點，總量最高 115 點魔法傷害)。(冷卻 15 秒)',
        iconName: 'Shield',
        badgeText: 'CD 15s · 守護劍陣10s 萬道劍氣 (最高115魔傷)',
        energyCost: 0
      },
      {
        id: 'jianxian_p4',
        name: '萬劍歸宗',
        type: 4,
        description: '【巨靈天降】每累積發射 6 柄仙劍 (含白劍、寒霜劍與劍陣劍氣)，召喚一柄巨靈神劍破空直插敵人，造成 20 點穿透魔法傷害並擊退 45px。(冷卻 6.0 秒)',
        iconName: 'Sword',
        badgeText: 'CD 6.0s · 每6劍天降巨靈劍 20魔傷+擊退',
        energyCost: 10
      }
    ]
  },
  longshen: {
    id: 'longshen',
    name: '龍神',
    title: '龍神之軀',
    role: '戰士（近距離高爆發／扇形滅世龍息／真龍降世領域）',
    primaryRole: 'warrior',
    primaryRoleName: '戰士',
    subClasses: ['近戰戰士', '範圍壓制', '變身持續輸出', '爆發戰士'],
    maxHp: 560,
    attackDamage: 7, // v2.6: 降低戰士碰撞傷害 (10 -> 7)
    speedRatio: 0.95,
    baseSpeed: 242,
    size: 22,
    mass: 1.35,
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    avatarIcon: 'Flame',
    equipment: {
      outfitName: '九五至尊真龍焚天皇龍戰袍',
      outfitType: '赤金龍鱗帝王九龍重甲戰袍',
      outfitDesc: '由九天真龍赤金逆鱗鍛造，胸前盤臥天龍吐珠護心鏡，外罩朱紅烈焰金絲刺繡皇者大披風。',
      weaponName: '天帝降魔赤炎龍神爪',
      weaponDesc: '雙臂覆蓋天界真火赤金龍爪，指尖燃燒三昧真火，揮爪間劃破長空掀起滅世火柱。',
      accessoryName: '傲天怒目龍首肩鎧與金冠龍角',
      accessoryDesc: '雙肩盤踞立體精鑄的怒目龍頭，口銜金珠，頭頂兩支赤金龍角繚繞熾熱天火。'
    },
    passives: [
      {
        id: 'longshen_p1',
        name: '龍搖',
        type: 1,
        description: '【神速俯衝】自動鎖定 240px 內敵人發動極速霸體俯衝 (期間免疫碰撞傷害)；命中造成 28 點高額物理爆發傷害與 4% 最大生命破甲，並附加 20% 減速與「龍威壓制」(受龍神傷害提升 20%，持續 3 秒)。(冷卻 5.8 秒)',
        iconName: 'FastForward',
        badgeText: 'CD 5.8s · 240px神速俯衝 28物傷+破甲20%',
        energyCost: 0
      },
      {
        id: 'longshen_p2',
        name: '龍普',
        type: 2,
        description: '【狂暴雙爪】敵人進入 160px 近身範圍時施展「雙重裂爪」，首擊造成 18 點物理傷害，次擊撕裂造成 22 點物理傷害 (合計 40 點爆發)！若目標處於龍威或灼燒狀態，額外引爆 15 點烈火真傷！(冷卻 3.2 秒)',
        iconName: 'Zap',
        badgeText: 'CD 3.2s · 160px雙重裂爪 40物傷+引爆15真傷',
        energyCost: 0
      },
      {
        id: 'longshen_p3',
        name: '龍炎',
        type: 3,
        description: '【滅世龍息】前方 0.5 秒展開扇形預警，隨後向 90 度扇形、240px 射程噴射烈焰持續 2.2 秒。每 0.25 秒造成 8 點火焰傷害 (累計最高 64 點火傷)；前方 140px 核心範圍每秒額外承受 6 點融甲真傷！(冷卻 9.5 秒)',
        iconName: 'Flame',
        badgeText: 'CD 9.5s · 90°扇形240px 滿額64火傷+融甲',
        energyCost: 0
      },
      {
        id: 'longshen_p4',
        name: '龍身',
        type: 4,
        description: '【真龍降世】覺醒神龍真形持續 10 秒！變身瞬間對周圍 240px 釋放天地龍吟造成 40 點神威爆發傷害；變身期間移速激增 40%，展開 160px「真龍焚滅領域」(每 0.5 秒降下龍炎，上限 150 點火傷)，碰撞傷害提升至 22 點且全技能冷卻加速 25%！(冷卻 24 秒)',
        iconName: 'Flame',
        badgeText: 'CD 24s · 變身真龍10s 瞬間40爆發+領域150火傷',
        energyCost: 0
      }
    ]
  },
  zhizhu: {
    id: 'zhizhu',
    name: '蜘蛛',
    title: '蛛后',
    role: '刺客（毒液連招／蛛網控制／召喚追擊／近距離爆發）',
    primaryRole: 'assassin',
    primaryRoleName: '刺客',
    subClasses: ['毒液刺客', '控制刺客', '召喚刺客', '爆發刺客', '突進刺客'],
    maxHp: 390,
    attackDamage: 3, // v2.6: 降低碰撞傷害 (5 -> 3)
    speedRatio: 1.12, // v2.6: 提升刺客移動速度 (1.06 -> 1.12)
    baseSpeed: 285, // px/s (112% speed tier)
    size: 19, // volume 19
    mass: 0.92,
    primaryColor: '#0f172a',
    secondaryColor: '#064e3b',
    accentColor: '#10b981',
    glowColor: 'rgba(168, 85, 129, 0.65)',
    avatarIcon: 'Bug',
    equipment: {
      outfitName: '幽夜黑寡婦毒網絲絨宮廷胸衣長裙',
      outfitType: '暗黑哥德蕾絲刺繡深V束腰長禮服',
      outfitDesc: '純黑天鵝絨面料搭配劇毒翠綠寶石鑲嵌的蛛網狀銀色蕾絲骨架，拖曳著半透明蛛絲女王薄紗。',
      weaponName: '八極毒針幾丁質步足戰甲',
      weaponDesc: '背部生長出八根如金屬長針般的黑紫硬化蛛足，足尖淬有致命神經毒素，行進如履平地。',
      accessoryName: '黑曜石天鵝絨頸圈與凝毒紫水晶',
      accessoryDesc: '緊貼咽喉的黑絲絨鎖骨鏈，胸前垂懸一顆凝固劇毒原液的淚滴形深紫水晶。'
    },
    passives: [
      {
        id: 'zhizhu_p1',
        name: '毒牙印記',
        type: 1,
        description: '【毒牙突刺】自動鎖定 150px 內敵人突刺，命中立即造成 6 點物理傷害並附加「蛛毒印記」持續 4 秒 (每秒造成 2 點毒素傷害，最高 14 點傷害)。(冷卻 4.8 秒)',
        iconName: 'Zap',
        badgeText: 'CD 4.8s · 150px毒牙突刺 6物傷+4s跳毒',
        energyCost: 0
      },
      {
        id: 'zhizhu_p2',
        name: '獵網束縛',
        type: 2,
        description: '【獵網陷阱】朝 380px 射程內敵人噴射強韌蛛網，命中造成 35% 強效減速持續 2.5 秒，並在目標腳下留下一片半徑 45px 的黏稠蛛網陷阱區域。(冷卻 8.0 秒)',
        iconName: 'Target',
        badgeText: 'CD 8.0s · 380px蛛網束縛 減速35%+蛛網區域',
        energyCost: 0
      },
      {
        id: 'zhizhu_p3',
        name: '蛛群獵殺',
        type: 3,
        description: '【孵化蛛群】從腹部召喚 3 隻敏捷小蜘蛛 (每隻 8 HP)，具備獨立碰撞體系並優先狂暴追擊帶有「蛛毒印記」的敵人，每次撲咬造成 3 點物理傷害。(冷卻 16.0 秒)',
        iconName: 'Bug',
        badgeText: 'CD 16s · 召喚3隻小蜘蛛 8HP+3物傷撲咬',
        energyCost: 0
      },
      {
        id: 'zhizhu_p4',
        name: '蛛后毒爆',
        type: 4,
        description: '【毒液風暴】調動體內深層毒囊對 160px 範圍引發劇毒風暴，造成 18 點毒素傷害；若目標帶有「蛛毒印記」，將徹底引爆印記額外造成 14 點穿透真傷 (合計 32 點爆發真傷)！(冷卻 27.0 秒)',
        iconName: 'Skull',
        badgeText: 'CD 27s · 160px毒液風暴 18毒傷+引爆14真傷',
        energyCost: 0
      }
    ]
  },
  xin: {
    id: 'xin',
    name: '辛',
    title: '雙相魔劍',
    role: '戰士（高攻擊技能戰士／成長／形態切換／蓄力鎖定／非碰撞輸出）',
    primaryRole: 'warrior',
    primaryRoleName: '戰士',
    subClasses: ['技能戰士', '成長戰士', '形態戰士', '蓄力戰士', '非碰撞戰士'],
    maxHp: 540,
    attackDamage: 0,
    speedRatio: 0.82,
    baseSpeed: 210,
    size: 21,
    mass: 1.35,
    primaryColor: '#1e2430',
    secondaryColor: '#f59e0b',
    accentColor: '#c084fc',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    avatarIcon: 'Sword',
    equipment: {
      outfitName: '雙相魔劍遊俠神聖暗影聖騎士板甲',
      outfitType: '光暗撞色精鋼重裝半身板甲',
      outfitDesc: '左側為鍍金純銀雕刻的聖堂十字騎士胸甲，右側為黑曜石刻蝕影魔符文的暗影胸鎧，黑白雙色披風飄動。',
      weaponName: '光暗雙生十字聖裁雙魔劍',
      weaponDesc: '雙手分持白金聖劍（釋放治療神聖劍氣）與暗金魔劍（釋放狂暴撕裂暗影），雙刃交叉破陣。',
      accessoryName: '聖暗十字胸甲護喉與雙鞘劍袋',
      accessoryDesc: '厚實的護頸喉甲中央鑲嵌雙相能量寶珠，身後交叉背負兩把重劍的真皮背帶。'
    },
    passives: [
      {
        id: 'xin_p1',
        name: '魔劍普攻',
        type: 1,
        description: '【雙相劍氣】自動搜尋 220px 內敵人揮出凌厲劍氣，命中造成 18 點物理傷害 (光形態附加 8 點聖光法傷；暗形態攻速提升 35% 且附加 8 點撕裂暗傷)，每次命中獲得 15 點經驗值 (XP)。(冷卻 1.4 秒)',
        iconName: 'Sword',
        badgeText: 'CD 1.4s · 220px魔劍普攻 18傷+15XP 形態特化',
        energyCost: 0
      },
      {
        id: 'xin_p2',
        name: '逐影破陣',
        type: 2,
        description: '【極速突進】短暫蓄力 0.25 秒鎖定 280px 內方位，化作雙相殘影極速穿透敵陣！突進期間免疫碰撞傷害，穿透造成 24 點傷害 (光形態凝結 35 點神聖護盾；暗形態突進傷害提升至 34 點撕裂暗傷)，每次命中獲得 25 點 XP。(冷卻 6.5 秒)',
        iconName: 'Zap',
        badgeText: 'CD 6.5s · 280px極速破陣 24~34傷+護盾/撕裂',
        energyCost: 0
      },
      {
        id: 'xin_p3',
        name: '裂空劍痕',
        type: 3,
        description: '【終極劍痕】鎖定 360px 內敵人進行 0.5 秒蓄勢瞄準，朝直線斬出撕裂空間的巨型雙相衝擊劍痕！命中造成 42 點毀滅爆發傷害 (光形態命中回復 30 HP；暗形態對低於 50% 生命目標追加 18 點斬殺暴擊)，每次命中獲得 40 點 XP。(冷卻 11.0 秒)',
        iconName: 'Crosshair',
        badgeText: 'CD 11.0s · 360px裂空巨痕 42爆發+回血/斬殺',
        energyCost: 0
      },
      {
        id: 'xin_p4',
        name: '雙相魔劍',
        type: 4,
        description: '【雙相戰魂】辛的靈魂核心：【魔劍成長】每累積 100 XP 升級 (最高 Lv.6)，每級提升基礎攻擊與全技能傷害 +10%、最大生命 +25；【形態轉換】初始為平衡形態，充能滿 100 後在「光之統御」與「暗之狂暴」間循環切換 (持續 10 秒)！辛的碰撞傷害永久為 0。',
        iconName: 'Sparkles',
        badgeText: 'Lv.1~6成長 · 傷害+10%/級 雙相形態循環 (0碰撞傷)',
        energyCost: 0
      }
    ]
  },
  kuileishi: {
    id: 'kuileishi',
    name: '傀儡師',
    title: '命運提線',
    role: '輔助（傀儡召喚／牽制控制／遠程消耗／保護支援／連鎖攻擊）',
    primaryRole: 'support',
    primaryRoleName: '輔助',
    subClasses: ['傀儡召喚', '牽制控制', '遠程消耗', '保護支援', '連鎖攻擊'],
    maxHp: 420,
    attackDamage: 0, // 傀儡師本體不依靠碰撞造成傷害
    speedRatio: 0.90,
    baseSpeed: 225, // px/s
    size: 20, // visual scale radius ~ 25px
    mass: 1.00,
    primaryColor: '#2e1065', // Deep purple
    secondaryColor: '#0a0a0f', // Obsidian black
    accentColor: '#c084fc', // Bright magic purple
    glowColor: 'rgba(192, 132, 252, 0.65)',
    avatarIcon: 'Boxes',
    equipment: {
      outfitName: '哥德提線大師夜宴燕尾絨服',
      outfitType: '紫羅蘭絲絨宮廷長款燕尾大衣',
      outfitDesc: '幽邃暗紫天鵝絨長大衣，內襯純白層疊維多利亞蕾絲褶皺襯衫（Jabot），衣襬開衩俐落優雅。',
      weaponName: '秘銀提線交錯牽星十字架',
      weaponDesc: '手戴精雕秘銀提線指環，手指輕輕撥動懸浮八根發光法力傀儡絲線，精準操控戰場兩具傀儡。',
      accessoryName: '黃銅牽線齒輪胸盒與陶瓷木偶面具',
      accessoryDesc: '胸口固定著微型齒輪絞線盒，左側翻領別著一具雕工精緻的陶瓷哭笑木偶微型胸針。'
    },
    passives: [
      {
        id: 'kuileishi_p1',
        name: '三命傀儡',
        type: 1,
        description: '【傀儡召喚】戰鬥開始時及每 5 秒自動召喚一具魔法傀儡 (最多 2 具)。每具傀儡擁有 3 條獨立生命條 (外殼/關節/核心，每條 25 HP，共 75 HP)。傀儡擁有獨立仇恨優先吸引敵人火力，並以 280 px/s 極速追擊敵人 (被牽線目標暴衝至 440 px/s)，每 0.6 秒造成 6 點物理傷害，每次命中累積 1 層共鳴。',
        iconName: 'Boxes',
        badgeText: '每5s召喚(上限2) · 3條命共75HP 追擊280~440px/s 斬擊6傷/0.6s',
        energyCost: 0
      },
      {
        id: 'kuileishi_p2',
        name: '傀儡護幕',
        type: 2,
        description: '【保護結界】受到攻擊時，存活傀儡自動展開保護結界，移至前方形成木偶魔法護盾。傀儡師受到傷害降低 40%，將 40% 傷害轉移至傀儡承擔，並使本體獲得 +20% 跑速持續 1.5 秒。(冷卻 3.5 秒)',
        iconName: 'Shield',
        badgeText: 'CD 3.5s · 受到傷害-40% 轉移40%至傀儡 移速+20%',
        energyCost: 0
      },
      {
        id: 'kuileishi_p3',
        name: '牽線束縛',
        type: 3,
        description: '【牽線控制】自動向 400px 內最近敵人發射命運傀儡線，造成 8 點魔法傷害，並降低目標 40% 移動速度，持續 2.5 秒。牽線命中後，所有存活傀儡移速暴增至 440 px/s 並立即鎖定集火，額外賦予 1 層共鳴。(冷卻 4.0 秒)',
        iconName: 'Share2',
        badgeText: 'CD 4s · 400px射程 8魔傷 減速40%持續2.5s 傀儡狂暴集火',
        energyCost: 0
      },
      {
        id: 'kuileishi_p4',
        name: '傀儡共鳴與木偶終幕',
        type: 4,
        description: '【連鎖終幕】共鳴每層提供 +6% 移速 (最高 18%)。達 3 層且目標被牽線、傀儡存活時進入「終幕待命」；傀儡突進連鎖觸發：傀儡普攻(6物傷) + 共鳴爆發(16魔傷) + 木偶終幕交叉斬擊(24魔傷)，總計 46 點毀滅爆發與 0.9 秒定身！(冷卻 12 秒)。【木偶替身】單次受傷≥10%HP時傀儡替身減傷65%(CD 7.5s)。傀儡師碰撞傷害永久為0。',
        iconName: 'Sparkles',
        badgeText: '3層共鳴+牽線引爆46點終幕爆發 · 替身減傷65% (0碰撞傷)',
        energyCost: 0
      }
    ]
  },
  yinyong: {
    id: 'yinyong',
    name: '一拳尹雄',
    title: '一拳英雄',
    role: '刺客（超長蓄力／瞬間突襲／一擊必殺／低血翻盤／失敗成長／瀕死免死）',
    primaryRole: 'assassin',
    primaryRoleName: '刺客',
    subClasses: ['爆發刺客', '位移刺客', '追擊刺客', '控制刺客', '高速刺客'],
    maxHp: 360,
    attackDamage: 0, // 完全不依靠碰撞傷害
    speedRatio: 1.00, // 速度 100%
    baseSpeed: 250, // px/s
    size: 18, // 球體大小 18
    mass: 0.85, // 質量 0.85
    primaryColor: '#0f172a', // 主色黑色深灰
    secondaryColor: '#1e293b', // 肌肉手臂暗灰
    accentColor: '#ef4444', // 能量裂紋烈紅
    glowColor: 'rgba(239, 68, 68, 0.75)',
    avatarIcon: 'Flame',
    equipment: {
      outfitName: '極真霸拳宗師戰意武道服',
      outfitType: '重磅純棉墨黑短打武僧格鬥袍',
      outfitDesc: '沉穩厚重的黑棉武道服，衣邊翻滾赤紅炎紋滾邊，雙袖撕裂露出如鐵鑄般的宗師肩臂肌肉。',
      weaponName: '無敵王者百戰黃金冠軍腰帶',
      weaponDesc: '腰間繫著極致耀眼的世界格鬥冠軍純金腰帶，中央鑲嵌巨大鴿血紅寶石與兩側勝利橄欖枝金雕。',
      accessoryName: '赤白雙色戰氣拳擊綁帶與武神額帶',
      accessoryDesc: '雙手密密層層纏繞的赤白棉質武道纏手帶，額間繫黑綢武神抹額，周身翻滾熾烈白金拳氣。'
    },
    passives: [
      {
        id: 'yinyong_p1',
        name: '尹雄一拳',
        type: 1,
        description: '【核心機制】戰鬥開始自動進入22秒倒數蓄力。蓄力完成後鎖定目標，瞬間瞬移至目標身後約50px並宣告2.5秒。宣告期間鎖定朝向、生成Hitbox與身後壓制；宣告結束揮出毀滅一拳（直接擊倒判定）。命中成功冷卻8秒；未命中/被躲避進入失敗恢復4秒，並疊加【越挫越勇】。',
        iconName: 'Zap',
        badgeText: '22s超長蓄力 · 瞬移身後50px 宣告2.5s 一拳決勝 (0碰撞傷)',
        energyCost: 0
      },
      {
        id: 'yinyong_p2',
        name: '不死之血',
        type: 2,
        description: '【低血翻盤】生命值低於 35% (≤126 HP) 時進入不死之血狀態。每 2 秒自動進行判定，擁有 3% 機率激發潛能瞬間回滿生命值 (360 HP)。觸發成功後進入 12 秒冷卻週期。',
        iconName: 'Heart',
        badgeText: 'HP<35%觸發 · 每2s判定 3%機率回滿生命 (CD 12s)',
        energyCost: 0
      },
      {
        id: 'yinyong_p3',
        name: '越挫越勇',
        type: 3,
        description: '【失敗成長】尹雄的一拳每落空一次，累積 1 層「越挫越勇」暴怒印記 (最高可疊加 10 層)。每層使技能傷害提升 5% 額外物理傷害。暴怒印記永久保留不清除，直至下一次蓄力命中目標。',
        iconName: 'TrendingUp',
        badgeText: '未命中+1層(上限10) · 每層增傷5% 暴怒印記永久累積',
        energyCost: 0
      },
      {
        id: 'yinyong_p4',
        name: '一拳無界',
        type: 4,
        description: '【瀕死免死】生命值低於 1% (≤3.6 HP) 遭受致命危險時瞬間啟動一拳無界領域：強制使場上雙方獲得 4 秒完全免傷狀態。無界領域持續結束後，立即為自身恢復 10% 最大生命值 (36 HP)。每場戰鬥限觸發 1 次。',
        iconName: 'ShieldAlert',
        badgeText: 'HP<1%瀕死觸發 · 雙方免傷4s 恢復10%最大HP (每場限1次)',
        energyCost: 0
      }
    ]
  },
  manyaiya: {
    id: 'manyaiya',
    name: '曼麥亞・軍子',
    title: '神之從刃',
    role: '刺客（神之從刃／高速突進／記憶收割）',
    primaryRole: 'assassin',
    primaryRoleName: '刺客',
    subClasses: ['高速刺客', '印記刺客', '控制刺客', '收割刺客', '連續突進', '強化鬥士'],
    maxHp: 390,
    attackDamage: 0, // 曼麥亞・軍子完全不依靠碰撞造成傷害 (碰撞傷害固定為0)
    speedRatio: 1.08, // 速度 108%
    baseSpeed: 270, // 250 * 1.08 = 270 px/s
    size: 18, // 球體大小 18
    mass: 0.88, // 質量 0.88
    primaryColor: '#0f172a', // 主色黑色深灰
    secondaryColor: '#334155', // 暗灰作戰裝甲
    accentColor: '#ffffff', // 純白神聖繃帶
    glowColor: 'rgba(255, 255, 255, 0.85)',
    avatarIcon: 'Swords',
    equipment: {
      outfitName: '天龍神從聖縛作戰裝束',
      outfitType: '神聖符文白繃帶與暗銀高階從刃輕鎧',
      outfitDesc: '周身環繞無數道古老天龍神聖符文白繃帶，貼附暗黑輕量化高強度防護從刃甲片，兼具極致靈活機動與束縛敵方的超凡韌性。',
      weaponName: '神之雙向從刃・斷憶',
      weaponDesc: '由純淨神聖白金與緋紅記憶斷片凝聚而成的雙持神刃，完全不依賴蠻力撞擊，唯有在穿透與突進時迸發弒國威能。',
      accessoryName: '天龍之眼與凡人殘憶雙異瞳核',
      accessoryDesc: '右眼流轉神聖天龍金紅光暈，左眼凝聚深沉青銀記憶斷片，當疊滿三層記憶時將點燃震撼天地的神之騎士完全體。'
    },
    passives: [
      {
        id: 'manyaiya_p1',
        name: '神瞳殘憶・天龍之眼',
        type: 1,
        description: '【核心被動】右眼為天龍之眼，左眼為凡人記憶之眼。敵人身上獨立計算【記憶斷片】(上限3層)。每次有效技能攻擊命中+1層(同次攻擊最多+1層)。當任一敵人的記憶斷片達到3層時，軍子立即觸發【異瞳覺醒】(持續5秒)：雙眼烈芒綻放(右眼金/紅，左眼青/銀)、移速+20%，下一次神刃攻擊附帶+12純粹神聖傷害(若5秒未命中則結束，每名敵人覺醒CD 8秒)。滿3層斷片的敵人進入【易傷狀態】，受到軍子所有傷害+25%。',
        iconName: 'Eye',
        badgeText: '3層記憶覺醒 · 異瞳雙色 移速+20% +12神聖傷害 (易傷+25%)',
        energyCost: 0
      },
      {
        id: 'manyaiya_p2',
        name: '神箭・白縛疾嵐',
        type: 2,
        description: '【遠程干擾】每 5 秒 (神之騎士形態下 3 秒) 從手臂繃帶中凝聚出一支高速旋轉白縛神箭射向目標 (射程 320px / 形態 400px，飛行速度 850px/s)。命中第一名敵人造成 4 點物理傷害 (形態下 5 點)、+1層【記憶斷片】，並使目標降低移速 25% 持續 1.5 秒。若目標已有 2 層記憶斷片，額外造成 0.5 秒定身。',
        iconName: 'Crosshair',
        badgeText: 'CD 5s(形態3s) · 850px/s神箭 減速25% 滿2層定身0.5s',
        energyCost: 0
      },
      {
        id: 'manyaiya_p3',
        name: '聖帶・斷憶縛界',
        type: 3,
        description: '【控制位移】每 7 秒 (形態下 5 秒) 甩出兩道帶有神聖符文的白色繃帶 (射程 280px)。【判定一·命中敵人】：造成 5 點物理傷害、+1層【記憶斷片】，將目標向軍子強力拉動 80px (形態下 100px)，並束縛 0.8 秒 (若目標身上已有 2~3 層記憶延長至 1.2 秒)；【判定二·未命中/瞄準地形】：繃帶釘入最近牆體，軍子迅猛拉向該點 (最高 220px / 形態 260px)，位移期間不可阻擋。',
        iconName: 'Anchor',
        badgeText: 'CD 7s(形態5s) · 強控拉回80px 束縛0.8~1.2s / 飛錨拉牆220px',
        energyCost: 0
      },
      {
        id: 'manyaiya_p4',
        name: '神刃・弒國終章',
        type: 4,
        description: '【終極完全體】冷卻 30 秒。當軍子觸發【異瞳覺醒】且目標身上存在記憶斷片時解鎖【神之騎士完全體】(持續 10 秒)：身側浮現神之從刃與神聖緋紅氣場、移速額外+15%、免疫減速。獲得【弒國突進】(初始 2 次充能，突進速度 1100px/s，突進距離 250px)，穿透判定矩形 (120×45px) 造成 10 點物理傷害 (若目標處於 3 層記憶斷片追加 15 點神聖真實傷害)。【收割機制】：若突進擊殺目標，立即刷新 +1 次突進次數並延長形態 3 秒 (單次形態最多突進 3 次，同目標限刷新 1 次)。形態結束若取得擊殺，觸發【記憶解放】神聖衝擊波擊退全場！',
        iconName: 'Swords',
        badgeText: '完全體10s · 移速+15%免減速 1100px/s連環穿透 (擊殺刷新+解放)',
        energyCost: 0
      }
    ]
  }
};

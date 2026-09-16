import { CharacterConfig } from '../types/game';
import { ChampionBeltRecord, TournamentBeltState } from '../types/tournament';

export interface KnockoutStyleInfo {
  styleName: string;          // 擊倒風格名稱，如 "💥 連續硬直粉碎流"
  styleBadge: string;         // 簡潔標籤，如 "粉碎爆破"
  signatureFinisher: string;  // 招牌絕殺技能，如 "納米脈衝全彈轟炸"
  tacticalSummary: string;    // 戰術打法簡述
  iconName: 'Flame' | 'Zap' | 'Shield' | 'Swords' | 'Skull' | 'Crosshair' | 'Sparkles' | 'Anchor' | 'Eye' | 'Target';
  themeClass: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    badgeBg: string;
  };
  voiceStyleIntro: string;    // 播報主播語音介紹詞
}

export interface PastWinRateInfo {
  hasRecord: boolean;         // 是否有實際對戰記錄 (true: 根據真實數據, false: 首次出戰)
  ratePercentage?: number;    // 0 ~ 100
  displayRateText: string;    // "85%" 或 "首次出戰"
  tierTitle: string;          // "🔥 天王統治級" 或 "🌟 擂台新星"
  tierBadge: string;          // "DOMINATOR" 或 "ROOKIE"
  streakText?: string;        // "4連勝中"
  recordText: string;         // "12勝 2敗" 或 "首次出戰 (0勝 0敗)"
  themeClass: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  voiceWinRateIntro: string;  // 播報主播戰率語音詞
}

// 預設經典 22 位角色的獨門摔角擊倒風格
const KNOCKOUT_STYLES_MAP: Record<string, KnockoutStyleInfo> = {
  oba: {
    styleName: '💥 鋼鐵重炮・連續硬直粉碎流',
    styleBadge: '硬直粉碎',
    signatureFinisher: '納米脈衝動能全彈轟炸',
    tacticalSummary: '利用泰坦裝甲的高質量與連擊蓄力，將敵方逼入死角施加連續硬直無情碾碎！',
    iconName: 'Zap',
    themeClass: {
      bg: 'from-blue-900/40 to-slate-900',
      border: 'border-blue-500/60',
      text: 'text-blue-300',
      glow: 'shadow-blue-500/30',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    voiceStyleIntro: '以狂暴連擊與極限硬直聞名的【鋼鐵重炮・連續硬直粉碎流】！'
  },
  huotong: {
    styleName: '🔥 熔岩煉獄・受擊反傷自爆流',
    styleBadge: '高溫反傷',
    signatureFinisher: '雙聯火神熔岩過載衝撞',
    tacticalSummary: '以高額生命值為誘餌誘敵碰撞，觸發烈焰外殼反震與高溫迫擊自爆！',
    iconName: 'Flame',
    themeClass: {
      bg: 'from-rose-900/40 to-slate-900',
      border: 'border-rose-500/60',
      text: 'text-rose-300',
      glow: 'shadow-rose-500/30',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    voiceStyleIntro: '身懷地心高溫、令對手膽寒的【熔岩煉獄・受擊反傷自爆流】！'
  },
  hailaise: {
    styleName: '🌊 深海暗湧・渦流連環絞殺流',
    styleBadge: '漩渦絞殺',
    signatureFinisher: '三叉戟深海狂瀾牽引',
    tacticalSummary: '藉由深海潮汐漩渦持續牽引對手減速，隨後以萬鈞波濤連續絞殺！',
    iconName: 'Anchor',
    themeClass: {
      bg: 'from-cyan-900/40 to-slate-900',
      border: 'border-cyan-500/60',
      text: 'text-cyan-300',
      glow: 'shadow-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    },
    voiceStyleIntro: '掌控大海之怒的【深海暗湧・渦流連環絞殺流】！'
  },
  lingyinsi: {
    styleName: '🧘 金剛伏魔・分身幻影反噬流',
    styleBadge: '禪定反噬',
    signatureFinisher: '萬佛朝宗・金剛碎界法相',
    tacticalSummary: '召喚分身迷惑軌跡借力打力，以靜制動在承受碰撞瞬間爆發佛光反噬！',
    iconName: 'Shield',
    themeClass: {
      bg: 'from-amber-900/40 to-slate-900',
      border: 'border-amber-500/60',
      text: 'text-amber-300',
      glow: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    voiceStyleIntro: '無懈可擊的護法宗師！【金剛伏魔・分身幻影反噬流】！'
  },
  chanshi: {
    styleName: '🕸️ 絲線纏縛・極限封鎖絕命流',
    styleBadge: '絲線纏殺',
    signatureFinisher: '天羅地網・千絲封喉鎖命',
    tacticalSummary: '於擂台四周織就重重黏著絲線，剝奪對手移動空間後施以窒息鎖喉！',
    iconName: 'Target',
    themeClass: {
      bg: 'from-emerald-900/40 to-slate-900',
      border: 'border-emerald-500/60',
      text: 'text-emerald-300',
      glow: 'shadow-emerald-500/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    voiceStyleIntro: '令人插翅難飛的【絲線纏縛・極限封鎖絕命流】！'
  },
  huangzuan: {
    styleName: '⚡ 晶能雷暴・高頻電光速殺流',
    styleBadge: '電光速殺',
    signatureFinisher: '超導脈衝黃晶雷暴星爆',
    tacticalSummary: '以高頻脈衝激發狂暴電流，於極速閃避中連續發射電磁穿透震盪！',
    iconName: 'Zap',
    themeClass: {
      bg: 'from-yellow-900/40 to-slate-900',
      border: 'border-yellow-500/60',
      text: 'text-yellow-300',
      glow: 'shadow-yellow-500/30',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
    },
    voiceStyleIntro: '勢如狂雷的速殺王者！【晶能雷暴・高頻電光速殺流】！'
  },
  lanzuan: {
    styleName: '💎 極寒冰晶・絕對零度冰封流',
    styleBadge: '零度冰封',
    signatureFinisher: '永凍冰河萬象碎裂打擊',
    tacticalSummary: '散發刺骨冰息凍結擂台路徑，將敵人速度降至冰點後擊碎寒冰護甲！',
    iconName: 'Sparkles',
    themeClass: {
      bg: 'from-sky-900/40 to-slate-900',
      border: 'border-sky-500/60',
      text: 'text-sky-300',
      glow: 'shadow-sky-500/30',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
    },
    voiceStyleIntro: '冰封一切的刺骨嚴冬！【極寒冰晶・絕對零度冰封流】！'
  },
  fenzuan: {
    styleName: '🌸 魅影幻惑・動能逆轉汲取流',
    styleBadge: '動能汲取',
    signatureFinisher: '粉晶魅惑・靈魂狂亂衝擊',
    tacticalSummary: '逆轉對手衝撞能量化為己用，削弱對手攻擊強度的同時強化自身爆發！',
    iconName: 'Sparkles',
    themeClass: {
      bg: 'from-pink-900/40 to-slate-900',
      border: 'border-pink-500/60',
      text: 'text-pink-300',
      glow: 'shadow-pink-500/30',
      badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
    },
    voiceStyleIntro: '難以捉摸的幻術狂徒！【魅影幻惑・動能逆轉汲取流】！'
  },
  baizuan: {
    styleName: '✨ 聖光審判・極致破甲裁決流',
    styleBadge: '真傷裁決',
    signatureFinisher: '輝光神罰・破曉裁決之刺',
    tacticalSummary: '無視對手防禦護甲，引導聖光天罰直接貫穿生命核心造成高額真實傷害！',
    iconName: 'Swords',
    themeClass: {
      bg: 'from-slate-800 to-slate-900',
      border: 'border-yellow-400/70',
      text: 'text-yellow-200',
      glow: 'shadow-yellow-400/30',
      badgeBg: 'bg-yellow-400/20 text-yellow-200 border-yellow-400/40'
    },
    voiceStyleIntro: '無堅不摧的至高裁決！【聖光審判・極致破甲裁決流】！'
  },
  xukongshou: {
    styleName: '🌌 裂隙吞噬・次元重壓湮滅流',
    styleBadge: '次元湮滅',
    signatureFinisher: '虛空特異點・重力黑洞坍縮',
    tacticalSummary: '撕裂空間製造虛空裂痕，以超維重力強行拉扯對手碾碎至粉塵！',
    iconName: 'Skull',
    themeClass: {
      bg: 'from-purple-900/40 to-slate-900',
      border: 'border-purple-500/60',
      text: 'text-purple-300',
      glow: 'shadow-purple-500/30',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    },
    voiceStyleIntro: '吞噬星辰的恐怖異獸！【裂隙吞噬・次元重壓湮滅流】！'
  },
  fan: {
    styleName: '👊 一擊必殺・極限蓄力核爆流',
    styleBadge: '認真一拳',
    signatureFinisher: '寰宇毀滅・認真一拳終結',
    tacticalSummary: '平實無華的走位下隱藏驚世駭俗的一拳，蓄勢爆發之時天地俱滅！',
    iconName: 'Flame',
    themeClass: {
      bg: 'from-amber-800/40 to-slate-900',
      border: 'border-amber-400/80',
      text: 'text-amber-200',
      glow: 'shadow-amber-400/40',
      badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/50'
    },
    voiceStyleIntro: '一擊震撼全場的無敵神話！【一擊必殺・極限蓄力核爆流】！'
  },
  tunshimozu: {
    styleName: '🩸 嗜血狂宴・無限汲取霸體流',
    styleBadge: '嗜血霸體',
    signatureFinisher: '深淵魔核血宴狂噬',
    tacticalSummary: '血量越低狂暴度越高，霸體硬頂任何衝撞並以生命汲取永續續航！',
    iconName: 'Skull',
    themeClass: {
      bg: 'from-red-950 to-slate-900',
      border: 'border-red-600/70',
      text: 'text-red-300',
      glow: 'shadow-red-600/40',
      badgeBg: 'bg-red-600/20 text-red-300 border-red-600/50'
    },
    voiceStyleIntro: '越戰越狂的血色夢魘！【嗜血狂宴・無限汲取霸體流】！'
  },
  mimi: {
    styleName: '🐾 靈貓迷蹤・超音速背刺穿透流',
    styleBadge: '音速背刺',
    signatureFinisher: '疾風瞬影・九命絕殺爪擊',
    tacticalSummary: '憑藉全場頂級移動極速與死角位移，在敵方盲區連續暴擊穿刺！',
    iconName: 'Zap',
    themeClass: {
      bg: 'from-orange-900/40 to-slate-900',
      border: 'border-orange-500/60',
      text: 'text-orange-300',
      glow: 'shadow-orange-500/30',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    },
    voiceStyleIntro: '快若疾電的擂台魅影！【靈貓迷蹤・超音速背刺穿透流】！'
  },
  jiandaoshou: {
    styleName: '✂️ 雙刃絞肉・十字雙剪處決流',
    styleBadge: '雙剪處決',
    signatureFinisher: '斷頭十字剪・死刑終結技',
    tacticalSummary: '近身格鬥的高危絞肉機，精準瞄準敵方殘血破綻發動致命處決剪殺！',
    iconName: 'Swords',
    themeClass: {
      bg: 'from-zinc-800 to-slate-900',
      border: 'border-rose-400/70',
      text: 'text-rose-200',
      glow: 'shadow-rose-400/30',
      badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/40'
    },
    voiceStyleIntro: '無情撕裂一切的殘酷劊子手！【雙刃絞肉・十字雙剪處決流】！'
  },
  dina: {
    styleName: '🧪 劇毒蝕骨・生化蔓延折磨流',
    styleBadge: '生化劇毒',
    signatureFinisher: '萬毒沸騰・神經瓦解酸雨',
    tacticalSummary: '散播腐蝕性生化劇毒毒霧，持續疊加猛毒侵蝕對手護甲與生機！',
    iconName: 'Skull',
    themeClass: {
      bg: 'from-lime-950/50 to-slate-900',
      border: 'border-lime-500/60',
      text: 'text-lime-300',
      glow: 'shadow-lime-500/30',
      badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/40'
    },
    voiceStyleIntro: '劇毒蔓延的致命生化專家！【劇毒蝕骨・生化蔓延折磨流】！'
  },
  jianxian: {
    styleName: '🗡️ 萬劍歸宗・御劍飛仙無雙流',
    styleBadge: '飛劍誅仙',
    signatureFinisher: '青蓮九霄誅仙劍陣大齊射',
    tacticalSummary: '體表環繞凌厲飛劍，以超遠程御劍術與近身無雙劍罡全面主宰擂台！',
    iconName: 'Swords',
    themeClass: {
      bg: 'from-teal-950/50 to-slate-900',
      border: 'border-teal-400/70',
      text: 'text-teal-200',
      glow: 'shadow-teal-400/30',
      badgeBg: 'bg-teal-500/20 text-teal-200 border-teal-500/40'
    },
    voiceStyleIntro: '劍氣縱橫三萬里的絕世大宗師！【萬劍歸宗・御劍飛仙無雙流】！'
  },
  longshen: {
    styleName: '🐉 真龍咆哮・霸王烈焰焚天流',
    styleBadge: '霸王龍息',
    signatureFinisher: '九霄龍吟天崩地裂霸王衝',
    tacticalSummary: '狂暴龍息覆蓋全場，以遠古真龍霸體粉碎任何正面衝撞的敵人！',
    iconName: 'Flame',
    themeClass: {
      bg: 'from-red-950/60 to-slate-900',
      border: 'border-amber-500/70',
      text: 'text-amber-300',
      glow: 'shadow-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50'
    },
    voiceStyleIntro: '傲視群雄的太古霸主！【真龍咆哮・霸王烈焰焚天流】！'
  },
  zhizhu: {
    styleName: '🕷️ 蛛群狂潮・母巢群攻窒息流',
    styleBadge: '蛛群母巢',
    signatureFinisher: '百萬幼蛛召喚・毒網圍殺',
    tacticalSummary: '源源不絕召喚自爆幼蛛與蛛網陷阱，在混亂與圍毆中吞食獵物！',
    iconName: 'Skull',
    themeClass: {
      bg: 'from-violet-950/50 to-slate-900',
      border: 'border-violet-500/60',
      text: 'text-violet-300',
      glow: 'shadow-violet-500/30',
      badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40'
    },
    voiceStyleIntro: '母巢暴走的深淵女皇！【蛛群狂潮・母巢群攻窒息流】！'
  },
  xin: {
    styleName: '💖 心靈共鳴・超感知反制折射流',
    styleBadge: '心靈折射',
    signatureFinisher: '靈魂激盪・全頻超載衝擊',
    tacticalSummary: '預讀敵方碰撞軌跡，以精準心靈力場折射傷害並震退對手！',
    iconName: 'Sparkles',
    themeClass: {
      bg: 'from-rose-950/40 to-slate-900',
      border: 'border-rose-400/60',
      text: 'text-rose-200',
      glow: 'shadow-rose-400/30',
      badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/40'
    },
    voiceStyleIntro: '掌控心靈感應的預知大師！【心靈共鳴・超感知反制折射流】！'
  },
  kuileishi: {
    styleName: '🎎 三重提線・影舞協同圍剿流',
    styleBadge: '傀儡圍剿',
    signatureFinisher: '機關密令・天元絞殺大陣',
    tacticalSummary: '同時操控三重木甲傀儡形成多重夾角，以人數優勢進行多段連續斬殺！',
    iconName: 'Target',
    themeClass: {
      bg: 'from-indigo-950/50 to-slate-900',
      border: 'border-indigo-400/60',
      text: 'text-indigo-200',
      glow: 'shadow-indigo-400/30',
      badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40'
    },
    voiceStyleIntro: '操弄戰局的提線宗師！【三重提線・影舞協同圍剿流】！'
  },
  yinyong: {
    styleName: '🌑 暗影分身・移形換位偷襲流',
    styleBadge: '影遁偷襲',
    signatureFinisher: '暗夜降臨・千影穿心絕殺',
    tacticalSummary: '分身與本體瞬間移形換位，以難以捉摸的影遁突襲在瞬息間奠定勝局！',
    iconName: 'Eye',
    themeClass: {
      bg: 'from-slate-900 to-slate-950',
      border: 'border-purple-600/70',
      text: 'text-purple-200',
      glow: 'shadow-purple-600/30',
      badgeBg: 'bg-purple-600/20 text-purple-200 border-purple-600/40'
    },
    voiceStyleIntro: '暗夜中的收割者！【暗影分身・移形換位偷襲流】！'
  },
  manyaiya: {
    styleName: '⚜️ 雙眼神騎士・天龍殘憶弒國流',
    styleBadge: '神刃弒國',
    signatureFinisher: '神刃・弒國終章完全體連環穿透',
    tacticalSummary: '右眼天龍左眼凡憶，三層斷片異瞳覺醒，神聖聖帶強控拉回與無情突進穿透！',
    iconName: 'Eye',
    themeClass: {
      bg: 'from-amber-950/60 via-red-950/40 to-slate-900',
      border: 'border-amber-400/80',
      text: 'text-amber-200',
      glow: 'shadow-amber-400/50',
      badgeBg: 'bg-gradient-to-r from-amber-500/30 to-red-500/30 text-amber-200 border-amber-400/50'
    },
    voiceStyleIntro: '天龍異瞳覺醒！令人聞風喪膽的【雙眼神騎士・天龍殘憶弒國流】！'
  }
};

/**
 * 動態獲取或生成角色的擊倒風格標籤
 */
export function getKnockoutStyle(char: CharacterConfig): KnockoutStyleInfo {
  if (KNOCKOUT_STYLES_MAP[char.id]) {
    return KNOCKOUT_STYLES_MAP[char.id];
  }

  // 若為未預先列入的特殊自訂角色，依據屬性與角色特性進行動態智慧生成
  const isHeavy = char.mass >= 1.2;
  const isFast = char.baseSpeed >= 240;
  const isHighDmg = char.attackDamage >= 14;

  let styleName = '⚔️ 全能進擊・均衡格鬥流';
  let styleBadge = '全能格鬥';
  let finisher = `${char.equipment?.weaponName || '破甲撞擊'}・終結爆破`;
  let summary = '兼具機動力與碰撞威能的實戰格鬥派，擅長抓準時機迎頭重擊！';

  if (isHeavy && isHighDmg) {
    styleName = '💥 重裝泰坦・極限震盪碾壓流';
    styleBadge = '震盪碾壓';
    finisher = `${char.equipment?.weaponName || '重錘'}・崩山裂地撞`;
    summary = '憑藉超重噸位與高碰撞力將敵人轟入絕境！';
  } else if (isFast) {
    styleName = '⚡ 疾風瞬影・極速穿梭刺殺流';
    styleBadge = '疾風刺殺';
    finisher = `${char.equipment?.weaponName || '迅捷利刃'}・超音速背刺`;
    summary = '全速位移拉扯，在對手破綻之際發動高速收割！';
  } else if (char.maxHp >= 500) {
    styleName = '🛡️ 不壞金身・反震鐵壁堡壘流';
    styleBadge = '鐵壁反震';
    finisher = '絕對防壁・逆向動能反轟';
    summary = '宛如銅牆鐵壁，以不可撼動的高額生命抵禦一切進攻！';
  }

  return {
    styleName,
    styleBadge,
    signatureFinisher: finisher,
    tacticalSummary: summary,
    iconName: 'Swords',
    themeClass: {
      bg: 'from-blue-900/40 to-slate-900',
      border: 'border-blue-500/60',
      text: 'text-blue-300',
      glow: 'shadow-blue-500/20',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    voiceStyleIntro: `以獨門戰法【${styleName}】聞名的擂台好手！`
  };
}

/**
 * 動態解析角色的過往勝率與實戰戰鬥數據
 * 嚴格根據真實數據（beltState.records），決不捏造或亂報數據。
 * 若尚未出賽或無戰績紀錄，明確標記為「生涯首戰」或「首次出戰」。
 */
export function getPastWinRate(
  char: CharacterConfig,
  record?: ChampionBeltRecord
): PastWinRateInfo {
  // 1. 若已有真實對戰紀錄 (totalMatches > 0)
  if (record && record.totalMatches > 0) {
    const total = record.totalMatches;
    const wins = record.wins;
    const losses = record.losses;
    const rate = Math.min(100, Math.max(0, Math.round((wins / total) * 100)));

    let tierTitle = '⚔️ 均勢強者級';
    let tierBadge = 'VETERAN';
    let themeClass = {
      bg: 'bg-sky-950/50',
      border: 'border-sky-500/60',
      text: 'text-sky-300',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
    };
    let voiceWinRateIntro = `生涯戰績 ${wins} 勝 ${losses} 敗，過往勝率達百分之 ${rate}！`;

    if (losses === 0 && total >= 1) {
      tierTitle = '👑 保持不敗';
      tierBadge = 'UNDISPUTED';
      themeClass = {
        bg: 'bg-amber-950/60',
        border: 'border-amber-400/80',
        text: 'text-amber-300',
        badgeBg: 'bg-amber-500/25 text-amber-200 border-amber-500/60'
      };
      voiceWinRateIntro = `出戰 ${total} 場至今保持未嘗一敗的百分百全勝紀錄！`;
    } else if (wins === 0 && total >= 1) {
      tierTitle = '💥 爭取首勝';
      tierBadge = 'CHALLENGER';
      themeClass = {
        bg: 'bg-rose-950/50',
        border: 'border-rose-500/60',
        text: 'text-rose-300',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      };
      voiceWinRateIntro = `出戰 ${total} 場正全力以赴力拼生涯首場勝仗！`;
    } else if (rate >= 75) {
      tierTitle = '🔥 天王統治級';
      tierBadge = 'DOMINATOR';
      themeClass = {
        bg: 'bg-amber-950/60',
        border: 'border-amber-400/80',
        text: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/50'
      };
      voiceWinRateIntro = `生涯戰績 ${wins} 勝 ${losses} 敗，過往勝率高達百分之 ${rate}！統治力震撼全場！`;
    } else if (rate >= 50) {
      tierTitle = '⚔️ 實戰強者級';
      tierBadge = 'VETERAN';
      themeClass = {
        bg: 'bg-emerald-950/50',
        border: 'border-emerald-500/60',
        text: 'text-emerald-300',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      };
      voiceWinRateIntro = `生涯戰績 ${wins} 勝 ${losses} 敗，勝率為百分之 ${rate}！實戰經驗豐富！`;
    } else {
      tierTitle = '💥 逆境獵手級';
      tierBadge = 'CONTENDER';
      themeClass = {
        bg: 'bg-rose-950/50',
        border: 'border-rose-500/60',
        text: 'text-rose-300',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      };
      voiceWinRateIntro = `生涯戰績 ${wins} 勝 ${losses} 敗，過往勝率百分之 ${rate}，具備翻盤爆發力！`;
    }

    const streakText = record.currentWinStreak >= 2 ? `🔥 ${record.currentWinStreak} 連勝中` : undefined;

    return {
      hasRecord: true,
      ratePercentage: rate,
      displayRateText: `${rate}%`,
      tierTitle,
      tierBadge,
      streakText,
      recordText: `${wins}勝 ${losses}敗 (共${total}戰)`,
      themeClass,
      voiceWinRateIntro
    };
  }

  // 2. 尚無出賽紀錄（生涯首戰/初次登台）：真實呈現，絕不隨機捏造或模擬勝率數據
  return {
    hasRecord: false,
    ratePercentage: undefined,
    displayRateText: '生涯首戰',
    tierTitle: '🌟 擂台新星',
    tierBadge: 'ROOKIE',
    streakText: '初次登場',
    recordText: '首次出戰 (0勝 0敗)',
    themeClass: {
      bg: 'bg-slate-850/80',
      border: 'border-indigo-500/50',
      text: 'text-indigo-300',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
    },
    voiceWinRateIntro: '迎來擂台生涯首次戰鬥！全力以赴爭取開門紅！'
  };
}

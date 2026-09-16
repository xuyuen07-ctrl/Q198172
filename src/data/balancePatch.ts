import { CharacterId } from '../types/game';

export interface BalanceChangeItem {
  id: string;
  characterId: CharacterId;
  characterName: string;
  characterTitle: string;
  type: 'buff' | 'nerf' | 'adjust';
  category: 'damage' | 'cooldown' | 'mechanic' | 'stats';
  headline: string;
  changes: {
    target: string;
    before: string;
    after: string;
    reason: string;
  }[];
  summary: string;
}

export interface PatchNoteVersion {
  version: string;
  title: string;
  date: string;
  description: string;
  highlights: string[];
  changes: BalanceChangeItem[];
}

export const CURRENT_BALANCE_PATCH: PatchNoteVersion = {
  version: 'v2.6',
  title: '球球競技場｜平衡更新 v2.6',
  date: '2026.09.14 全伺服器同步生效',
  description:
    '本次更新主要針對角色強度差距、技能冷卻、碰撞傷害與遠程技能手感進行全面調整。整體目標是降低單純依靠高速碰撞造成大量傷害的玩法，提高技能命中、技能循環與角色定位的重要性。',
  highlights: [
    '降低無腦碰撞傷害：戰士、刺客、坦克碰撞傷害下修，擺脫高速衝撞秒殺，更看重技能時機。',
    '強勢角色技能冷卻調整：高爆發、高控制與高機動技能適度延長冷卻時間，防止過度頻繁連續施放。',
    '弱勢角色技能傷害大幅補強：蒂納、咪咪、劍仙、凡、剪刀手、蜘蛛單次技能威脅顯著提高。',
    '坦克定位回歸：全體坦克角色生存能力提升，基礎生命值統一增加 7 點，碰撞傷害下調專注承傷與控場。',
    '法師與射手遠程手感升級：彈道飛行速度大幅提升改善命中體驗，技能冷卻增加 1 秒以考驗技能規劃。'
  ],
  changes: [
    {
      id: 'dina_v26',
      characterId: 'dina',
      characterName: '蒂納',
      characterTitle: '法師／特殊型',
      type: 'adjust',
      category: 'damage',
      headline: '遠程彈道大幅提速、技能冷卻微增，大幅提高單次融合與光束威脅',
      changes: [
        {
          target: '白光發射彈速與傷害',
          before: '320 px/s / 2.5 傷害',
          after: '500 px/s (+56%) / 6.0 傷害 (+140%)',
          reason: '顯著提升飛行速度與手感，單次命中能造成更實質的消耗威脅。'
        },
        {
          target: '白光冷卻時間 (CD)',
          before: '0.9 秒',
          after: '1.9 秒 (+1.0s)',
          reason: '法師冷卻增加 1 秒，降低無限制連發，提高單發施放時機的要求。'
        },
        {
          target: '暗光蓄力彈速與傷害',
          before: '280 px/s / 10 傷害',
          after: '440 px/s (+57%) / 22 傷害 (+120%)',
          reason: '暗光飛行速度與爆發傷害雙重強化，改善遠程命中手感。'
        },
        {
          target: '三相融合光球彈速與傷害',
          before: '360 px/s / 普通15・完美26',
          after: '520 px/s (+44%) / 普通28・完美48',
          reason: '作為核心爆發大招，大幅提速確保命中反饋，並大幅提升單次斬殺威脅。'
        },
        {
          target: '核心之力擊退冷卻',
          before: '5.5 秒',
          after: '6.5 秒 (+1.0s)',
          reason: '法師防身技能冷卻增加 1 秒，近身博弈需更審慎評估。'
        }
      ],
      summary: '彈速全面飛躍讓技能命中率大幅提高，冷卻微增確保博弈節奏清晰。'
    },
    {
      id: 'fan_v26',
      characterId: 'fan',
      characterName: '凡',
      characterTitle: '純射手',
      type: 'adjust',
      category: 'damage',
      headline: '獵手箭矢彈速暴增至 650px/s，單發傷害與真傷大幅躍升，冷卻適度延長',
      changes: [
        {
          target: '獵手本性箭矢飛行速度',
          before: '520 px/s',
          after: '650 px/s (+25%)',
          reason: '遠程射手彈道大幅提速，手感流暢度與超遠距離命中率顯著改善。'
        },
        {
          target: '獵手箭矢傷害 / 3層獵痕真傷',
          before: '14 物傷 / 36 真傷',
          after: '18 物傷 (+28%) / 42 真傷 (+16%)',
          reason: '提高單次技能威脅性，弱勢傷害補強。'
        },
        {
          target: '射擊間隔與翻滾冷卻 (CD)',
          before: '0.8s 間隔 / 2.4s 翻滾',
          after: '1.2s 間隔 (+0.4s) / 3.4s 翻滾 (+1.0s)',
          reason: '射手技能冷卻增加 1 秒，防止過度頻繁無腦射擊，需要更細緻的走位規劃。'
        }
      ],
      summary: '遠程彈速與真傷回饋極致提升，更注重射程拉扯與冷卻空檔管理。'
    },
    {
      id: 'mimi_v26',
      characterId: 'mimi',
      characterName: '咪咪',
      characterTitle: '狂暴貓咪（刺客／戰士）',
      type: 'adjust',
      category: 'damage',
      headline: '衝爪爆發與流血傷害翻倍，愛心彈速提升，技能冷卻同步增加',
      changes: [
        {
          target: '貓咪衝爪單次傷害 / 流血',
          before: '7 物傷 / 1.8 流血/s',
          after: '14 物傷 (+100%) / 2.5 流血/s (+38%)',
          reason: '大幅提高近身技能傷害，弱勢傷害補強。'
        },
        {
          target: '貓咪衝爪冷卻時間 (CD)',
          before: '1.4 秒',
          after: '2.2 秒 (+0.8s)',
          reason: '避免過於頻繁施放連續突進，提高單次切入威脅與操作時機。'
        },
        {
          target: '愛心射擊彈速與傷害',
          before: '290 px/s / 16 傷害',
          after: '420 px/s (+45%) / 22 傷害 (+37%)',
          reason: '遠程彈速大幅提升，擊中敵人給予更強有力的斬殺威脅。'
        },
        {
          target: '基礎碰撞傷害',
          before: '14 碰撞攻擊',
          after: '11 碰撞攻擊 (-21%)',
          reason: '降低無腦碰撞傷害，更多傷害回歸技能命中。'
        }
      ],
      summary: '刺客技能爆發與速度強化，碰撞傷害降低，進場未斬殺將有更長冷卻真空期。'
    },
    {
      id: 'jianxian_v26',
      characterId: 'jianxian',
      characterName: '劍仙',
      characterTitle: '仙靈劍尊（法師）',
      type: 'adjust',
      category: 'damage',
      headline: '仙劍彈速提昇至 500px/s，單發傷害大幅翻倍，劍陣總傷提升至 110',
      changes: [
        {
          target: '白劍爆裂彈速與傷害',
          before: '380 px/s / 6.5 魔傷',
          after: '500 px/s (+31%) / 14.0 魔傷 (+115%)',
          reason: '仙劍飛行手感大幅提振，單次爆裂威脅大幅補強。'
        },
        {
          target: '白劍爆裂冷卻時間 (CD)',
          before: '2.0 秒',
          after: '3.0 秒 (+1.0s)',
          reason: '法師技能冷卻增加 1 秒，減少過度頻繁出劍。'
        },
        {
          target: '退劍緩行彈速、傷害與冷卻',
          before: '420 px/s / 5.5 魔傷 / 4.8s CD',
          after: '520 px/s / 12.0 魔傷 (+118%) / 5.8s CD (+1.0s)',
          reason: '退劍反向防禦彈速與反擊傷害提升，冷卻同步微增。'
        },
        {
          target: '百萬劍陣單道劍氣 / 總傷上限',
          before: '0.7 魔傷 / 70 總傷',
          after: '1.3 魔傷 / 110 總傷 (+57%)',
          reason: '終極守護劍陣具備更強大的壓制力，冷卻由 18s 調增至 19s (+1s)。'
        }
      ],
      summary: '徹底擺脫遠程傷害不足的困境，仙劍如雷霆貫穿戰場。'
    },
    {
      id: 'lingyinsi_v26',
      characterId: 'lingyinsi',
      characterName: '靈隱寺',
      characterTitle: '靈能射手',
      type: 'adjust',
      category: 'cooldown',
      headline: '藍光箭彈速大幅提升至 480px/s，傷害增強，技能冷卻延長 1 秒',
      changes: [
        {
          target: '藍光箭矢彈道速度',
          before: '360 px/s',
          after: '480 px/s (+33%)',
          reason: '大幅改善遠程技能手感與預判命中體驗。'
        },
        {
          target: '藍光箭單次傷害',
          before: '22 物理傷害',
          after: '28 物理傷害 (+27%)',
          reason: '補強遠程射手單次命中收益。'
        },
        {
          target: '藍光箭 / 分身術冷卻時間 (CD)',
          before: '2.8s / 10.0s',
          after: '3.8s (+1.0s) / 11.0s (+1.0s)',
          reason: '射手技能冷卻統一增加 1 秒，需要更精確掌握技能循環節奏。'
        }
      ],
      summary: '極大改善手感與命中率，適度增加冷卻避免無限壓制。'
    },
    {
      id: 'hailaise_v26',
      characterId: 'hailaise',
      characterName: '海萊絲',
      characterTitle: '秘術法師',
      type: 'adjust',
      category: 'damage',
      headline: '能量光束彈速提升至 520px/s，單發傷害提升至 54，冷卻增加 1 秒',
      changes: [
        {
          target: '秘能光束飛行速度',
          before: '420 px/s',
          after: '520 px/s (+24%)',
          reason: '提升光束飛行速度，大幅改善施法命中手感。'
        },
        {
          target: '秘能光束單發傷害',
          before: '48 魔法傷害',
          after: '54 魔法傷害 (+12%)',
          reason: '提升單次技能威懾力。'
        },
        {
          target: '光束與秘能爆彈冷卻時間 (CD)',
          before: '2.8s / 40.0s',
          after: '3.8s (+1.0s) / 41.0s (+1.0s)',
          reason: '法師技能冷卻增加 1 秒，控制高爆發連續施放。'
        }
      ],
      summary: '極速光束穿透敵陣，提高操作反饋與循環時機把控。'
    },
    {
      id: 'zhizhu_v26',
      characterId: 'zhizhu',
      characterName: '蜘蛛',
      characterTitle: '暗黑刺客',
      type: 'adjust',
      category: 'damage',
      headline: '毒牙與蛛網傷害翻倍，蛛網彈速暴增，技能冷卻增加控制真空期',
      changes: [
        {
          target: '毒牙直傷 / 蛛網傷害',
          before: '3 直傷 / 2 傷害',
          after: '6 直傷 (+100%) / 6 傷害 (+200%)',
          reason: '大幅補強整體傷害偏低的刺客技能威脅。'
        },
        {
          target: '蛛網飛彈速度',
          before: '380 px/s',
          after: '480 px/s (+26%)',
          reason: '改善遠程蛛網黏著手感。'
        },
        {
          target: '蛛后毒爆基礎毒傷 / 穿透真傷',
          before: '10 毒傷 / 8 真傷',
          after: '16 毒傷 (+60%) / 12 真傷 (+50%)',
          reason: '強化終極毒爆斬殺威懾力。'
        },
        {
          target: '技能冷卻時間 (CD)',
          before: '毒牙4.0s / 蛛網8.0s / 毒爆25s',
          after: '毒牙4.8s / 蛛網9.0s / 毒爆26s',
          reason: '刺客技能冷卻增加，進場未能成功擊殺時面臨更長真空期。'
        },
        {
          target: '基礎碰撞傷害',
          before: '14 碰撞攻擊',
          after: '10 碰撞攻擊 (-28%)',
          reason: '刺客碰撞傷害降低，更仰賴精準技能切入。'
        }
      ],
      summary: '毒素傷害大幅飆升，碰撞傷害下修，精準刺客風格確立。'
    },
    {
      id: 'jiandaoshou_v26',
      characterId: 'jiandaoshou',
      characterName: '剪刀手',
      characterTitle: '俐落戰士／刺客',
      type: 'adjust',
      category: 'cooldown',
      headline: '飛針彈速提升至 560px/s，剪裁之術傷害提高，聖霧與飛針冷卻延長',
      changes: [
        {
          target: '連射飛針飛行速度與傷害',
          before: '460 px/s / 16 傷害',
          after: '560 px/s (+22%) / 18 傷害 (+12%)',
          reason: '改善飛針連射命中體驗與單發傷害。'
        },
        {
          target: '剪裁之術最大生命百分比傷害',
          before: '5.5% 目標最大生命',
          after: '6.5% 目標最大生命 (+18%)',
          reason: '提高單次技能傷害與反制高坦血量的能力。'
        },
        {
          target: '各項技能冷卻時間 (CD)',
          before: '剪裁1.6s / 聖霧10s / 飛針6.5s',
          after: '剪裁2.4s / 聖霧12s / 飛針7.5s',
          reason: '增加冷卻時間，降低無限制連續施放的情況。'
        },
        {
          target: '基礎碰撞傷害',
          before: '18 碰撞攻擊',
          after: '14 碰撞攻擊 (-22%)',
          reason: '戰士碰撞傷害降低，更看重近距離技能時機。'
        }
      ],
      summary: '單次剪裁與飛針威脅大幅提升，技能冷卻真空期更分明。'
    },
    {
      id: 'lanzuan_v26',
      characterId: 'lanzuan',
      characterName: '藍鑽',
      characterTitle: '情感法師',
      type: 'adjust',
      category: 'damage',
      headline: '藍色光球射速大幅提升至 460px/s，波長傷害與終極爆發增強，冷卻+1秒',
      changes: [
        {
          target: '藍球子彈飛行速度',
          before: '320 px/s',
          after: '460 px/s (+44%)',
          reason: '改善遠程手感與命中體驗。'
        },
        {
          target: '藍色波長每秒傷害 / 情感崩潰爆發',
          before: '9 傷害/s / 130 爆發',
          after: '12 傷害/s (+33%) / 135 爆發',
          reason: '提高法術單次威脅性。'
        },
        {
          target: '光球召喚與情感力場冷卻 (CD)',
          before: '12.0s / 25.0s',
          after: '13.0s (+1.0s) / 26.0s (+1.0s)',
          reason: '法師技能冷卻統一增加 1 秒。'
        }
      ],
      summary: '遠程子彈高速穿梭，傷害補強與冷卻循環更均衡。'
    },
    {
      id: 'tanks_v26',
      characterId: 'oba',
      characterName: '全體坦克陣營',
      characterTitle: '奧巴 / 小石頭 / 綠鑽 / 虛空獸',
      type: 'buff',
      category: 'stats',
      headline: '全體坦克生命值統一增加 7 點，碰撞傷害降低，回歸承傷與控場核心',
      changes: [
        {
          target: '全體坦克生命值上限 (HP)',
          before: '奧巴 470 / 石頭 450 / 綠鑽 450 / 虛空獸 460',
          after: '奧巴 477 / 石頭 457 / 綠鑽 457 / 虛空獸 467 (+7 HP)',
          reason: '坦克生存能力全面提升，承擔更多的陣型前排牽制職責。'
        },
        {
          target: '全體坦克基礎碰撞傷害',
          before: '奧巴 20 / 石頭 18 / 綠鑽 17 / 虛空獸 18',
          after: '奧巴 16 (-20%) / 石頭 14 (-22%) / 綠鑽 13 (-23%) / 虛空獸 14 (-22%)',
          reason: '坦克定位回歸承受傷害、干擾戰場，不再具備過高單人爆發傷害。'
        }
      ],
      summary: '全體坦克生存力強化，降低碰撞傷害，建立堅不可摧的防線。'
    },
    {
      id: 'warriors_v26',
      characterId: 'huangzuan',
      characterName: '全體戰士陣營',
      characterTitle: '黃鑽 / 咪咪 / 剪刀手 / 吞噬魔祖',
      type: 'adjust',
      category: 'damage',
      headline: '戰士碰撞傷害降低，保持近戰持續作戰特色，側重技能命中與連招時機',
      changes: [
        {
          target: '戰士碰撞攻擊傷害',
          before: '黃鑽 12 / 咪咪 14 / 剪刀手 18 / 吞噬魔祖 18',
          after: '黃鑽 10 (-16%) / 咪咪 11 (-21%) / 剪刀手 14 (-22%) / 吞噬魔祖 15 (-17%)',
          reason: '戰士碰撞傷害降低，無法單純依賴幾次高速碰撞迅速擊倒對手。'
        },
        {
          target: '黃鑽超速衝撞速度加成',
          before: '每層超速 +1.5 碰撞傷害',
          after: '每層超速 +1.1 碰撞傷害 (-26%)',
          reason: '降低高速衝撞帶來的過高單次爆發，依賴旋轉與衝刺時機。'
        }
      ],
      summary: '戰士傷害來源更側重技能命中與連招時機，兼具近身壓迫與技術門檻。'
    },
    {
      id: 'mages_v26',
      characterId: 'huotong',
      characterName: '全體法師陣營',
      characterTitle: '火瞳 / 粉鑽 / 白鑽 / 蟾蜍',
      type: 'adjust',
      category: 'cooldown',
      headline: '法師技能冷卻統一增加 1 秒，遠程彈速與護盾反傷機制調校',
      changes: [
        {
          target: '法師主要技能冷卻 (CD)',
          before: '火瞳滾燙3.5s/反彈8s / 蟾蜍光環7s / 粉鑽圓盾8s / 白鑽分身16s',
          after: '火瞳滾燙4.5s/反彈9s / 蟾蜍光環8s / 粉鑽圓盾9s / 白鑽分身17s (+1.0s)',
          reason: '法師技能冷卻時間增加 1 秒，控制高爆發連續施放，考驗技能循環。'
        },
        {
          target: '粉鑽粉色圓盾飛行速度',
          before: '300 px/s',
          after: '420 px/s (+40%)',
          reason: '遠程彈道速度提升，大幅改善技能手感與命中體驗。'
        },
        {
          target: '蟾蜍禁錮光環單次脈衝傷害',
          before: '8 魔法傷害',
          after: '10 魔法傷害 (+25%)',
          reason: '提高單次技能威脅性。'
        }
      ],
      summary: '全體法師彈速與單發威力獲得增強，冷卻+1秒使走位規劃更富策略性。'
    }
  ]
};

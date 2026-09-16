import { FloatingText, CombatTextType } from '../types/game';

/**
 * Clean any accidental Unicode emoji characters from a string
 */
export function stripEmojis(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .trim();
}

export type DamageArtCategory =
  | 'crit'
  | 'flame'
  | 'magic'
  | 'true_damage'
  | 'physical'
  | 'energy'
  | 'heal'
  | 'shield'
  | 'immune'
  | 'status';

export interface ParsedCombatText {
  isNumeric: boolean;
  valueStr: string;
  numValue: number;
  subTag?: string;
  category: DamageArtCategory;
  isCrit: boolean;
  fullCleanText: string;
}

/**
 * Parse raw combat text string into structured art components
 */
export function parseCombatText(ft: FloatingText): ParsedCombatText {
  if (ft.parsed) return ft.parsed;
  const clean = stripEmojis(ft.text);

  // Check if critical
  const isCrit = Boolean(
    ft.isCrit ||
    clean.includes('超載暴擊') ||
    clean.includes('暴擊') ||
    clean.includes('CRIT') ||
    clean.includes('OVERDRIVE') ||
    (ft.damageValue !== undefined && ft.damageValue >= 28 && ft.damageType === 'physical')
  );

  // Check if immunity
  if (clean.includes('無敵') || clean.includes('IMMUNE')) {
    const res: ParsedCombatText = {
      isNumeric: false,
      valueStr: '',
      numValue: 0,
      subTag: 'IMMUNE',
      category: 'immune',
      isCrit: false,
      fullCleanText: '虛空無敵'
    };
    ft.parsed = res;
    return res;
  }

  // Check if shield block / parry
  if (clean.includes('格擋') || clean.includes('抵消') || clean.includes('BLOCK')) {
    const res: ParsedCombatText = {
      isNumeric: false,
      valueStr: '',
      numValue: 0,
      subTag: 'BLOCK',
      category: 'shield',
      isCrit: false,
      fullCleanText: clean.replace(/[\[\]]/g, '').trim()
    };
    ft.parsed = res;
    return res;
  }

  // Check for numeric damage or energy pattern: e.g. "-28", "-15.5", "+15", "+8"
  const numMatch = clean.match(/([+-]?\d+(?:\.\d+)?)/);
  const hasBrackets = clean.match(/\[(.*?)\]/);
  const subTag = hasBrackets ? hasBrackets[1].trim() : undefined;

  let isNumeric = Boolean(numMatch);
  let numValue = ft.damageValue ?? (numMatch ? Math.abs(parseFloat(numMatch[1])) : 0);
  let valueStr = numMatch ? numMatch[1] : '';

  // Determine category
  let category: DamageArtCategory = 'physical';

  if (isCrit) {
    category = 'crit';
  } else if (clean.includes('真傷') || clean.includes('真實傷害') || clean.includes('獵痕') || ft.damageType === 'true') {
    category = 'true_damage';
  } else if (ft.damageType === 'flame' || clean.includes('燃燒') || clean.includes('爆燃') || clean.includes('火')) {
    category = 'flame';
  } else if (ft.damageType === 'magic' || clean.includes('魔法') || clean.includes('死光') || clean.includes('撕咬') || clean.includes('虛空')) {
    category = 'magic';
  } else if (ft.damageType === 'heal' || clean.includes('治癒') || clean.includes('回復')) {
    category = 'heal';
  } else if (ft.damageType === 'energy' || clean.includes('能量') || clean.includes('拼刀') || clean.includes('彈衝') || clean.includes('瞬衝')) {
    category = 'energy';
  } else if (ft.damageType === 'status' || (!isNumeric && numValue === 0)) {
    category = 'status';
    isNumeric = false;
  }

  // Simplify and streamline sub-tags to prevent visual clutter
  let cleanSubTag: string | undefined = undefined;
  if (isCrit) {
    cleanSubTag = '暴擊';
  } else if (subTag && numValue > 6) {
    if (subTag.includes('分攤')) cleanSubTag = '分攤';
    else if (subTag.includes('減傷')) cleanSubTag = '減傷';
    else if (subTag.includes('金身')) cleanSubTag = '金身';
    else if (subTag.includes('尖刺')) cleanSubTag = '尖刺';
    else if (subTag.includes('爆燃')) cleanSubTag = '爆燃';
    else if (subTag.includes('滾燙')) cleanSubTag = '滾燙';
    else if (subTag.includes('連擊')) cleanSubTag = subTag;
    else cleanSubTag = subTag.length > 5 ? subTag.slice(0, 4) : subTag;
  }

  const res: ParsedCombatText = {
    isNumeric,
    valueStr,
    numValue,
    subTag: cleanSubTag,
    category,
    isCrit,
    fullCleanText: clean.replace(/\[.*?\]/g, '').trim()
  };
  ft.parsed = res;
  return res;
}

/**
 * Palette configurations for custom vector combat art
 */
const ART_THEMES: Record<
  DamageArtCategory,
  {
    primary: string;
    secondary: string;
    accent: string;
    darkContour: string;
    glow: string;
    gradient: [string, string, string];
    badgeBg: string;
    badgeBorder: string;
    label: string;
  }
> = {
  crit: {
    primary: '#facc15',
    secondary: '#f97316',
    accent: '#ef4444',
    darkContour: '#0f051d',
    glow: 'rgba(250, 204, 21, 0.85)',
    gradient: ['#ffffff', '#fde047', '#e11d48'],
    badgeBg: 'rgba(30, 10, 15, 0.90)',
    badgeBorder: 'rgba(251, 191, 36, 0.85)',
    label: 'CRITICAL'
  },
  flame: {
    primary: '#ff5722',
    secondary: '#ea580c',
    accent: '#fef08a',
    darkContour: '#1a0505',
    glow: 'rgba(249, 115, 22, 0.8)',
    gradient: ['#fffbeb', '#f97316', '#dc2626'],
    badgeBg: 'rgba(35, 12, 8, 0.88)',
    badgeBorder: 'rgba(249, 115, 22, 0.75)',
    label: 'FLAME'
  },
  magic: {
    primary: '#c084fc',
    secondary: '#a855f7',
    accent: '#f5d0fe',
    darkContour: '#130424',
    glow: 'rgba(192, 132, 252, 0.8)',
    gradient: ['#ffffff', '#e879f9', '#9333ea'],
    badgeBg: 'rgba(28, 10, 42, 0.88)',
    badgeBorder: 'rgba(192, 132, 252, 0.75)',
    label: 'MAGIC'
  },
  true_damage: {
    primary: '#fb7185',
    secondary: '#f43f5e',
    accent: '#ffffff',
    darkContour: '#1c050c',
    glow: 'rgba(244, 63, 94, 0.85)',
    gradient: ['#ffffff', '#fb7185', '#e11d48'],
    badgeBg: 'rgba(38, 8, 18, 0.90)',
    badgeBorder: 'rgba(251, 113, 133, 0.85)',
    label: 'TRUE DMG'
  },
  physical: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    accent: '#94a3b8',
    darkContour: '#070b14',
    glow: 'rgba(148, 163, 184, 0.65)',
    gradient: ['#ffffff', '#f1f5f9', '#94a3b8'],
    badgeBg: 'rgba(15, 23, 42, 0.88)',
    badgeBorder: 'rgba(148, 163, 184, 0.6)',
    label: 'PHYSICAL'
  },
  energy: {
    primary: '#38bdf8',
    secondary: '#0284c7',
    accent: '#fef08a',
    darkContour: '#041526',
    glow: 'rgba(56, 189, 248, 0.85)',
    gradient: ['#ffffff', '#38bdf8', '#0284c7'],
    badgeBg: 'rgba(8, 25, 45, 0.88)',
    badgeBorder: 'rgba(56, 189, 248, 0.75)',
    label: 'ENERGY'
  },
  heal: {
    primary: '#4ade80',
    secondary: '#22c55e',
    accent: '#bbf7d0',
    darkContour: '#041c0d',
    glow: 'rgba(74, 222, 128, 0.8)',
    gradient: ['#ffffff', '#86efac', '#16a34a'],
    badgeBg: 'rgba(10, 32, 18, 0.88)',
    badgeBorder: 'rgba(74, 222, 128, 0.75)',
    label: 'HEAL'
  },
  shield: {
    primary: '#fef08a',
    secondary: '#facc15',
    accent: '#ffffff',
    darkContour: '#1c1905',
    glow: 'rgba(250, 204, 21, 0.85)',
    gradient: ['#ffffff', '#fef08a', '#eab308'],
    badgeBg: 'rgba(32, 28, 10, 0.90)',
    badgeBorder: 'rgba(250, 204, 21, 0.8)',
    label: 'GUARD'
  },
  immune: {
    primary: '#e9d5ff',
    secondary: '#c084fc',
    accent: '#ffffff',
    darkContour: '#1a082e',
    glow: 'rgba(192, 132, 252, 0.9)',
    gradient: ['#ffffff', '#f3e8ff', '#a855f7'],
    badgeBg: 'rgba(28, 12, 45, 0.92)',
    badgeBorder: 'rgba(192, 132, 252, 0.85)',
    label: 'IMMUNE'
  },
  status: {
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#ffffff',
    darkContour: '#070e22',
    glow: 'rgba(99, 102, 241, 0.7)',
    gradient: ['#ffffff', '#a5b4fc', '#6366f1'],
    badgeBg: 'rgba(15, 23, 42, 0.88)',
    badgeBorder: 'rgba(99, 102, 241, 0.7)',
    label: 'TACTIC'
  }
};

/**
 * Draw custom vector emblems for each combat category
 */
export function drawCustomVectorEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  category: DamageArtCategory,
  time: number
) {
  const theme = ART_THEMES[category];
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = theme.primary;
  ctx.fillStyle = theme.primary;
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 8;

  switch (category) {
    case 'crit': {
      // 8-point dynamic comic action starburst
      const rOuter = size;
      const rInner = size * 0.42;
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const a = (i * Math.PI) / 8 - Math.PI / 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, rOuter);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, theme.primary);
      grad.addColorStop(1, theme.secondary);
      ctx.fillStyle = grad;
      ctx.fill();

      // Sharp central diamond
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.45);
      ctx.lineTo(size * 0.3, 0);
      ctx.lineTo(0, size * 0.45);
      ctx.lineTo(-size * 0.3, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'flame': {
      // Custom 3-prong stylized vector flame
      ctx.beginPath();
      ctx.moveTo(0, size);
      ctx.quadraticCurveTo(-size * 0.9, size * 0.2, -size * 0.5, -size * 0.3);
      ctx.quadraticCurveTo(-size * 0.1, -size * 0.1, -size * 0.2, -size);
      ctx.quadraticCurveTo(size * 0.5, -size * 0.4, size * 0.2, 0);
      ctx.quadraticCurveTo(size * 0.9, size * 0.3, 0, size);
      ctx.closePath();

      const fGrad = ctx.createLinearGradient(0, size, 0, -size);
      fGrad.addColorStop(0, theme.accent);
      fGrad.addColorStop(0.5, theme.primary);
      fGrad.addColorStop(1, theme.secondary);
      ctx.fillStyle = fGrad;
      ctx.fill();

      // Inner glowing core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.35, size * 0.28, size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'magic': {
      // Arcane occult diamond with starlight flares
      const rot = time * 2;
      ctx.rotate(rot);

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.45, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.45, 0);
      ctx.closePath();
      ctx.fillStyle = theme.primary;
      ctx.fill();

      // Cross flare lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-size * 0.9, 0);
      ctx.lineTo(size * 0.9, 0);
      ctx.moveTo(0, -size * 0.9);
      ctx.lineTo(0, size * 0.9);
      ctx.stroke();
      break;
    }

    case 'true_damage': {
      // Armor-piercing dagger / geometric puncture diamond
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.1);
      ctx.lineTo(size * 0.5, -size * 0.2);
      ctx.lineTo(size * 0.25, size * 0.9);
      ctx.lineTo(0, size * 1.1);
      ctx.lineTo(-size * 0.25, size * 0.9);
      ctx.lineTo(-size * 0.5, -size * 0.2);
      ctx.closePath();

      const tdGrad = ctx.createLinearGradient(0, -size, 0, size);
      tdGrad.addColorStop(0, '#ffffff');
      tdGrad.addColorStop(0.5, theme.primary);
      tdGrad.addColorStop(1, theme.secondary);
      ctx.fillStyle = tdGrad;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size * 0.7);
      ctx.stroke();
      break;
    }

    case 'physical': {
      // Razor-sharp dual cross-slash blades
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, -size * 0.8);
      ctx.lineTo(size * 0.8, size * 0.8);
      ctx.moveTo(size * 0.8, -size * 0.8);
      ctx.lineTo(-size * 0.8, size * 0.8);
      ctx.stroke();

      // Central slash diamond
      ctx.fillStyle = theme.primary;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.35);
      ctx.lineTo(size * 0.35, 0);
      ctx.lineTo(0, size * 0.35);
      ctx.lineTo(-size * 0.35, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'energy': {
      // Cybernetic high-voltage dual bolt
      ctx.beginPath();
      ctx.moveTo(size * 0.2, -size * 0.95);
      ctx.lineTo(-size * 0.5, -size * 0.1);
      ctx.lineTo(size * 0.05, -size * 0.1);
      ctx.lineTo(-size * 0.2, size * 0.95);
      ctx.lineTo(size * 0.5, size * 0.05);
      ctx.lineTo(-size * 0.05, size * 0.05);
      ctx.closePath();

      const eGrad = ctx.createLinearGradient(0, -size, 0, size);
      eGrad.addColorStop(0, '#ffffff');
      eGrad.addColorStop(0.5, theme.primary);
      eGrad.addColorStop(1, theme.secondary);
      ctx.fillStyle = eGrad;
      ctx.fill();
      break;
    }

    case 'heal': {
      // Emerald radiant cross
      ctx.fillStyle = theme.primary;
      const w = size * 0.38;
      const h = size * 0.95;
      ctx.beginPath();
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillRect(-h / 2, -w / 2, h, w);

      // Diamond halo
      ctx.strokeStyle = '#bbf7d0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'shield': {
      // Fortified heraldic shield crest
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.9);
      ctx.lineTo(size * 0.8, -size * 0.6);
      ctx.lineTo(size * 0.65, size * 0.3);
      ctx.lineTo(0, size * 0.95);
      ctx.lineTo(-size * 0.65, size * 0.3);
      ctx.lineTo(-size * 0.8, -size * 0.6);
      ctx.closePath();
      const sGrad = ctx.createLinearGradient(0, -size, 0, size);
      sGrad.addColorStop(0, '#ffffff');
      sGrad.addColorStop(0.6, theme.primary);
      sGrad.addColorStop(1, theme.secondary);
      ctx.fillStyle = sGrad;
      ctx.fill();

      // Inner chevron
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-size * 0.35, -size * 0.2);
      ctx.lineTo(0, size * 0.2);
      ctx.lineTo(size * 0.35, -size * 0.2);
      ctx.stroke();
      break;
    }

    case 'immune': {
      // Hexagonal kinetic barrier emblem
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * size * 0.9;
        const py = Math.sin(a) * size * 0.9;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      break;
    }

    case 'status':
    default: {
      // Tactical chevron badge
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, -size * 0.5);
      ctx.lineTo(0, size * 0.5);
      ctx.lineTo(size * 0.8, -size * 0.5);
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = theme.primary;
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

/**
 * Draw background visual effects behind large hits (Impact star, shockwave ring)
 * Softened and simplified to eliminate screen clutter
 */
function drawImpactBackdrop(
  ctx: CanvasRenderingContext2D,
  age: number,
  numValue: number,
  category: DamageArtCategory,
  isCrit: boolean
) {
  // Only true crits or massive hits (>= 35) warrant a faint backdrop effect
  if (!isCrit && numValue < 35) return;
  if (age > 0.12) return;

  const progress = age / 0.12;
  const fade = 1 - progress;
  const theme = ART_THEMES[category];
  const maxR = (16 + Math.min(20, numValue * 0.4)) * (isCrit ? 1.15 : 1.0);

  ctx.save();
  ctx.globalAlpha = fade * 0.35; // Softened subtle shockwave

  // Expanding shockwave ring (Zero shadowBlur, delicate thin line)
  ctx.strokeStyle = isCrit ? '#fde047' : theme.primary;
  ctx.lineWidth = Math.max(0.8, 1.6 * (1 - progress));
  ctx.beginPath();
  ctx.arc(0, 0, maxR * progress, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Main Entry Point: Renders a floating combat text using high-fidelity custom vector game art
 * Exquisite Polish: Punchy elastic pop & parabolic drift for damage, buoyant neon cyber-electric aura for energy consumption.
 */
export function renderCustomDamageArt(
  ctx: CanvasRenderingContext2D,
  ft: FloatingText,
  nowTime: number
) {
  const age = Math.max(0, ft.maxLife - ft.life);
  const lifeProgress = age / ft.maxLife;

  const parsed = parseCombatText(ft);
  const theme = ART_THEMES[parsed.category];

  // Base opacity: vivid, crisp, and high-visibility
  let maxAlpha = 0.90;
  if (parsed.isCrit) {
    maxAlpha = 0.98;
  } else if (parsed.category === 'energy') {
    maxAlpha = 0.94;
  } else if (parsed.numValue <= 6 && parsed.isNumeric) {
    maxAlpha = 0.78;
  } else if (parsed.category === 'immune') {
    maxAlpha = 0.88;
  }

  // Smooth fade-out curve: stays solid and readable for first 65% of life, then dissolves smoothly
  let fadeAlpha = 1.0;
  if (lifeProgress > 0.65) {
    const fadeProg = (lifeProgress - 0.65) / 0.35;
    fadeAlpha = Math.pow(Math.max(0, 1 - fadeProg), 1.6);
  }
  const finalAlpha = Math.max(0, Math.min(1, (ft.alpha ?? 1.0) * maxAlpha * fadeAlpha));
  if (finalAlpha <= 0.02) return;

  ctx.save();
  ctx.globalAlpha = finalAlpha;

  // Branch into dedicated high-craft renderers
  if (parsed.category === 'energy') {
    renderEnergyConsumptionArt(ctx, ft, parsed, theme, age, lifeProgress, nowTime);
  } else if (parsed.isNumeric && parsed.valueStr) {
    renderNumericDamageArt(ctx, ft, parsed, theme, age, lifeProgress, nowTime);
  } else {
    renderCombatStatusArt(ctx, ft, parsed, theme, age, lifeProgress, nowTime);
  }

  ctx.restore();
}

/**
 * Exquisite Energy Consumption Art:
 * Tactical neon-cyan electric identity, buoyant rising drift, electric ionization shockwave ring,
 * cybernetic lightning glyph, and frosted glass skill tag.
 */
function renderEnergyConsumptionArt(
  ctx: CanvasRenderingContext2D,
  ft: FloatingText,
  parsed: ParsedCombatText,
  theme: typeof ART_THEMES['energy'],
  age: number,
  lifeProgress: number,
  nowTime: number
) {
  // 1. Energetic initial pop with elastic recoil (first 0.12s)
  let popMultiplier = 1.0;
  if (age < 0.12) {
    const popT = age / 0.12;
    popMultiplier = 1.0 + 0.32 * Math.sin(popT * Math.PI) * Math.pow(1 - popT, 0.45);
  }

  // Smooth scale dissolution in final 25%
  let fadeScale = 1.0;
  if (lifeProgress > 0.75) {
    const dissolve = (lifeProgress - 0.75) / 0.25;
    fadeScale = 1.0 - dissolve * 0.15;
  }

  const currentScale = popMultiplier * fadeScale;

  ctx.translate(ft.x, ft.y);
  ctx.scale(currentScale, currentScale);

  // 2. Initial Electric Ionization Shockwave Ring (first 0.14s)
  if (age < 0.14) {
    const ringProg = age / 0.14;
    const ringR = 8 + ringProg * 22;
    ctx.save();
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.55 * (1 - ringProg)})`;
    ctx.lineWidth = 1.5 * (1 - ringProg);
    ctx.beginPath();
    ctx.arc(0, 0, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Cyber Electric Bolt Glyph + Energy Amount Layout
  const numValue = parsed.numValue || (parsed.valueStr ? Math.abs(parseFloat(parsed.valueStr)) : 20);
  const costText = `-${numValue}`;
  
  const fontSize = 13;
  const fontStack = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif";
  ctx.font = `900 ${fontSize}px ${fontStack}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const textMetrics = ctx.measureText(costText);
  const numW = textMetrics.width;
  const boltSize = 8;
  const gap = 3;
  const totalContentW = boltSize + gap + numW;
  const startX = -totalContentW / 2;

  // 3a. Vector Electric Bolt Glyph with Cyan Neon Aura
  ctx.save();
  ctx.translate(startX + boltSize * 0.5, 0);
  ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
  ctx.shadowBlur = 8;
  drawCustomVectorEmblem(ctx, 0, 0, boltSize, 'energy', nowTime);
  ctx.restore();

  // 3b. Pass 1: Crisp Midnight Slate Contour Outline
  const textX = startX + boltSize + gap;
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = 'rgba(2, 10, 24, 0.95)';
  ctx.lineJoin = 'round';
  ctx.strokeText(costText, textX, 0);

  // 3c. Pass 2: Radiant Electric Cyan Gradient Fill
  const grad = ctx.createLinearGradient(0, -fontSize * 0.5, 0, fontSize * 0.5);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#67e8f9');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillText(costText, textX, 0);

  // 3d. Pass 3: Specular Glass Top Sheen
  ctx.save();
  ctx.beginPath();
  ctx.rect(textX - 2, -fontSize * 0.5, numW + 4, fontSize * 0.42);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillText(costText, textX, 0);
  ctx.restore();

  // 4. Floating Skill Name Cyber Pill (if skill tag present)
  if (parsed.subTag) {
    const badgeY = fontSize * 0.65 + 6;
    ctx.font = "bold 9px -apple-system, BlinkMacSystemFont, sans-serif";
    const badgeMetrics = ctx.measureText(parsed.subTag);
    const bW = badgeMetrics.width + 8;
    const bH = 12;
    const bX = -bW / 2;

    // Translucent Cyan Cybernetic Container
    ctx.save();
    ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(8, 25, 45, 0.88)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    const r = 3.0;
    ctx.moveTo(bX + r, badgeY - bH / 2);
    ctx.lineTo(bX + bW - r, badgeY - bH / 2);
    ctx.quadraticCurveTo(bX + bW, badgeY - bH / 2, bX + bW, badgeY - bH / 2 + r);
    ctx.lineTo(bX + bW, badgeY + bH / 2 - r);
    ctx.quadraticCurveTo(bX + bW, badgeY + bH / 2, bX + bW - r, badgeY + bH / 2);
    ctx.lineTo(bX + r, badgeY + bH / 2);
    ctx.quadraticCurveTo(bX, badgeY + bH / 2, bX, badgeY + bH / 2 - r);
    ctx.lineTo(bX, badgeY - bH / 2 + r);
    ctx.quadraticCurveTo(bX, badgeY - bH / 2, bX + r, badgeY - bH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = '#7dd3fc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(parsed.subTag, 0, badgeY);
    ctx.restore();
  }

  // 5. Tiny Floating Electric Spark Particles
  const sparkPhase = (nowTime * 3) % (Math.PI * 2);
  const sparkY1 = -8 - Math.sin(sparkPhase) * 3;
  const sparkX1 = startX - 4 + Math.cos(sparkPhase) * 2;
  ctx.fillStyle = 'rgba(103, 232, 249, 0.85)';
  ctx.beginPath();
  ctx.arc(sparkX1, sparkY1, 1.2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Exquisite Numeric Life Reduction (Damage) Art:
 * Punchy elastic spring entry, visceral impact micro-vibration, element-specific vector emblems & gradients,
 * razor-sharp dark outline, and specular highlight sheen.
 */
function renderNumericDamageArt(
  ctx: CanvasRenderingContext2D,
  ft: FloatingText,
  parsed: ParsedCombatText,
  theme: typeof ART_THEMES['physical'],
  age: number,
  lifeProgress: number,
  nowTime: number
) {
  // 1. Dynamic Pop with Elastic Recoil Curve (first 0.14s)
  let popMultiplier = 1.0;
  if (age < 0.14) {
    const popT = age / 0.14;
    const peakOvershoot = parsed.isCrit
      ? 0.54
      : parsed.numValue >= 30
      ? 0.40
      : parsed.numValue >= 12
      ? 0.28
      : 0.18;
    popMultiplier = 1.0 + peakOvershoot * Math.sin(popT * Math.PI) * Math.pow(1 - popT, 0.4);
  }

  // Smooth scale dissolution in final 25% of life
  let fadeScale = 1.0;
  if (lifeProgress > 0.75) {
    const dissolve = (lifeProgress - 0.75) / 0.25;
    fadeScale = 1.0 - dissolve * 0.14;
  }

  let baseScale = 1.0;
  if (parsed.isCrit) baseScale = 1.16;
  else if (parsed.numValue <= 6) baseScale = 0.94;
  else if (parsed.numValue >= 30) baseScale = 1.10;

  const currentScale = baseScale * popMultiplier * fadeScale;

  // 2. Visceral Impact Micro-Shake (for Crits and Heavy Hits >= 25 in first 0.08s)
  let shakeX = 0;
  if (age < 0.08 && (parsed.isCrit || parsed.numValue >= 25)) {
    const shakeDecay = 1 - age / 0.08;
    shakeX = Math.sin(age * 120) * (parsed.isCrit ? 2.8 : 1.6) * shakeDecay;
  }

  ctx.translate(ft.x + shakeX, ft.y);
  ctx.scale(currentScale, currentScale);

  // 3. Impact Shockwave Backdrop on Crits / Heavy Hits
  if (parsed.isCrit || parsed.numValue >= 28) {
    drawImpactBackdrop(ctx, age, parsed.numValue, parsed.category, parsed.isCrit);
  }

  // 4. Dynamic Typography Scaling by Impact Tier
  const fontSize = parsed.isCrit
    ? 18
    : parsed.numValue <= 6
    ? 11
    : parsed.numValue <= 18
    ? 13
    : parsed.numValue <= 35
    ? 15
    : 17;

  const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.font = `900 ${fontSize}px ${fontStack}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const numText = parsed.valueStr;
  const textMetrics = ctx.measureText(numText);
  const numWidth = textMetrics.width;

  // 5. Draw Left Vector Emblem for Crits & Elemental Attacks
  const shouldDrawEmblem = parsed.isCrit || parsed.category === 'flame' || parsed.category === 'magic' || parsed.category === 'true_damage';
  if (shouldDrawEmblem) {
    const emblemSize = parsed.isCrit ? 8 : 6.5;
    const emblemX = -numWidth / 2 - emblemSize - 3;
    drawCustomVectorEmblem(ctx, emblemX, 0, emblemSize, parsed.category, nowTime);
  }

  // 6. Pass 1: Razor-Sharp Deep Dark Contour Outline (Solid Legibility Over Any FX)
  ctx.lineWidth = parsed.isCrit ? 3.0 : 2.4;
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.95)';
  ctx.lineJoin = 'round';
  ctx.strokeText(numText, 0, 0);

  // 7. Pass 2: High-Vibrancy Thematic Gradient Fill
  const grad = ctx.createLinearGradient(0, -fontSize * 0.5, 0, fontSize * 0.5);
  grad.addColorStop(0, theme.gradient[0]);
  grad.addColorStop(0.45, theme.gradient[1]);
  grad.addColorStop(1, theme.gradient[2]);
  ctx.fillStyle = grad;
  ctx.fillText(numText, 0, 0);

  // 8. Pass 3: Specular Top Bevel Sheen (3D Enamel Finish)
  ctx.save();
  ctx.beginPath();
  ctx.rect(-numWidth / 2 - 2, -fontSize * 0.5, numWidth + 4, fontSize * 0.40);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.fillText(numText, 0, 0);
  ctx.restore();

  // 9. Sub-Tag Minimal Badge (e.g. [暴擊], [連擊], [分攤], [減傷])
  if (parsed.subTag) {
    const badgeY = fontSize * 0.62 + 5;
    ctx.font = "bold 8.5px -apple-system, BlinkMacSystemFont, sans-serif";
    const badgeMetrics = ctx.measureText(parsed.subTag);
    const bW = badgeMetrics.width + 6;
    const bH = 11;
    const bX = -bW / 2;

    // Themed Translucent Rounded Container
    ctx.fillStyle = theme.badgeBg;
    ctx.strokeStyle = theme.badgeBorder;
    ctx.lineWidth = 0.7;

    ctx.beginPath();
    const r = 2.5;
    ctx.moveTo(bX + r, badgeY - bH / 2);
    ctx.lineTo(bX + bW - r, badgeY - bH / 2);
    ctx.quadraticCurveTo(bX + bW, badgeY - bH / 2, bX + bW, badgeY - bH / 2 + r);
    ctx.lineTo(bX + bW, badgeY + bH / 2 - r);
    ctx.quadraticCurveTo(bX + bW, badgeY + bH / 2, bX + bW - r, badgeY + bH / 2);
    ctx.lineTo(bX + r, badgeY + bH / 2);
    ctx.quadraticCurveTo(bX, badgeY + bH / 2, bX, badgeY + bH / 2 - r);
    ctx.lineTo(bX, badgeY - bH / 2 + r);
    ctx.quadraticCurveTo(bX, badgeY - bH / 2, bX + r, badgeY - bH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = theme.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(parsed.subTag, 0, badgeY);
  }
}

/**
 * Status Action Banner Renderer (Immunity, Shield Block, Tacticals)
 */
function renderCombatStatusArt(
  ctx: CanvasRenderingContext2D,
  ft: FloatingText,
  parsed: ParsedCombatText,
  theme: typeof ART_THEMES['status'],
  age: number,
  lifeProgress: number,
  nowTime: number
) {
  let popMultiplier = 1.0;
  if (age < 0.10) {
    const popProg = age / 0.10;
    popMultiplier = 1.0 + Math.sin(popProg * Math.PI) * 0.18;
  }

  ctx.translate(ft.x, ft.y);
  ctx.scale(popMultiplier, popMultiplier);

  const bannerText = parsed.fullCleanText || ft.text;
  ctx.font = "bold 9.5px -apple-system, BlinkMacSystemFont, sans-serif";
  const textMetrics = ctx.measureText(bannerText);

  const iconSize = 7.5;
  const paddingX = 6;
  const bannerH = 15;
  const bannerW = textMetrics.width + iconSize * 2 + paddingX * 2 + 2;
  const bX = -bannerW / 2;
  const bY = -bannerH / 2;

  // Outer Frosted Glass Container
  ctx.fillStyle = theme.badgeBg;
  ctx.strokeStyle = theme.badgeBorder;
  ctx.lineWidth = 0.8;

  ctx.beginPath();
  const cr = 3.0;
  ctx.moveTo(bX + cr, bY);
  ctx.lineTo(bX + bannerW - cr, bY);
  ctx.quadraticCurveTo(bX + bannerW, bY, bX + bannerW, bY + cr);
  ctx.lineTo(bX + bannerW, bY + bannerH - cr);
  ctx.quadraticCurveTo(bX + bannerW, bY + bannerH, bX + bannerW - cr, bY + bannerH);
  ctx.lineTo(bX + cr, bY + bannerH);
  ctx.quadraticCurveTo(bX, bY + bannerH, bX, bY + bannerH - cr);
  ctx.lineTo(bX, bY + cr);
  ctx.quadraticCurveTo(bX, bY, bX + cr, bY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left Vector Icon
  const iconX = bX + paddingX + iconSize * 0.5;
  drawCustomVectorEmblem(ctx, iconX, 0, iconSize, parsed.category, nowTime);

  // Banner Text
  ctx.fillStyle = theme.primary;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(bannerText, iconX + iconSize + 3, 0);
}

/**
 * Smart Combat Text Manager: Anti-Clumping, Combo Aggregation & Capping
 * 1. Merges rapid tick damages on the same target (same damageType within 0.35s) into one popping number
 * 2. Distributes distinct hits with neat subtle vertical-lateral offsets
 * 3. Enforces a maximum screen cap (8 texts max) to eliminate lag and clutter
 */
export function pushFloatingTextWithAntiClump(
  activeList: FloatingText[],
  incomingItems: FloatingText[]
): FloatingText[] {
  if (!incomingItems || incomingItems.length === 0) return activeList;

  for (const newItem of incomingItems) {
    // 1. Rapid damage tick aggregation (e.g. burn ticks, laser beam ticks, clone hits)
    if (newItem.damageValue && newItem.damageValue > 0 && newItem.targetId) {
      const recent = activeList.find(
        ft => ft.targetId === newItem.targetId &&
              ft.damageType === newItem.damageType &&
              (ft.maxLife - ft.life) < 0.35 &&
              !ft.isCrit && !newItem.isCrit
      );

      if (recent && recent.damageValue !== undefined) {
        // Aggregate damage value
        recent.damageValue += newItem.damageValue;
        recent.stackCount = (recent.stackCount || 1) + 1;
        const roundedVal = Math.round(recent.damageValue * 10) / 10;

        // Update display text with combo count
        const tag = recent.stackCount > 1 ? `${recent.stackCount}連擊` : (recent.tag || '');
        recent.text = `-${roundedVal}${tag ? ` [${tag}]` : ''}`;

        // Refresh life slightly and give a gentle pop bounce
        recent.life = Math.min(recent.maxLife, recent.life + 0.16);
        recent.parsed = undefined; // invalidate cached parse
        parseCombatText(recent);
        continue;
      }
    }

    // 2. Anti-Clumping Spatial Staggering:
    const nearby = activeList.filter(ft => Math.hypot(ft.x - newItem.x, ft.y - newItem.y) < 32);
    const isEnergy = newItem.damageType === 'energy' || newItem.text.includes('能量') || (newItem.tag && newItem.tag.includes('瞬衝'));
    const isCrit = Boolean(newItem.isCrit);

    // Subtle gentle offsets (no chaotic spraying)
    const SLOTS = [
      { dx: 0, dy: -4, vx: 0, vy: isEnergy ? -30 : (isCrit ? -48 : -38) },
      { dx: -12, dy: -8, vx: -8, vy: isEnergy ? -31 : (isCrit ? -50 : -40) },
      { dx: 12, dy: -8, vx: 8, vy: isEnergy ? -31 : (isCrit ? -50 : -40) },
      { dx: -16, dy: -4, vx: -12, vy: isEnergy ? -28 : (isCrit ? -46 : -36) },
      { dx: 16, dy: -4, vx: 12, vy: isEnergy ? -28 : (isCrit ? -46 : -36) },
    ];

    const slot = SLOTS[nearby.length % SLOTS.length];
    const finalX = newItem.x + slot.dx;
    const finalY = newItem.y + slot.dy;
    const finalVx = newItem.vx !== undefined ? newItem.vx : slot.vx;
    const finalVy = newItem.vy !== undefined ? newItem.vy : slot.vy;
    const defaultLife = isEnergy ? 0.75 : (isCrit ? 0.95 : 0.85);

    const preppedItem: FloatingText = {
      ...newItem,
      x: finalX,
      y: finalY,
      vx: finalVx,
      vy: finalVy,
      life: newItem.life || defaultLife,
      maxLife: newItem.maxLife || defaultLife,
    };

    // Pre-cache parsed combat text once
    parseCombatText(preppedItem);

    // 3. Screen Cap Management (max 9 concurrent texts to prevent clutter)
    if (activeList.length >= 9) {
      let oldestIdx = -1;
      let minLife = Infinity;
      for (let i = 0; i < activeList.length; i++) {
        if (!activeList[i].isCrit && activeList[i].life < minLife) {
          minLife = activeList[i].life;
          oldestIdx = i;
        }
      }
      if (oldestIdx >= 0) {
        activeList[oldestIdx].life = Math.min(activeList[oldestIdx].life, 0.05); // fade out immediately
      }
    }

    activeList.push(preppedItem);
  }

  return activeList;
}

/**
 * Update kinematics and calculate smooth fade-out curves for floating texts.
 * - Damage texts: Parabolic arc with downward gravity deceleration.
 * - Energy texts: Weightless buoyant upward drift with graceful deceleration.
 */
export function updateAndDecayFloatingTexts(
  texts: FloatingText[],
  dt: number
): FloatingText[] {
  const remaining: FloatingText[] = [];

  for (let i = 0; i < texts.length; i++) {
    const ft = texts[i];
    ft.life -= dt;
    if (ft.life <= 0) continue;

    const isEnergy = ft.damageType === 'energy' || ft.text.includes('能量') || (ft.parsed && ft.parsed.category === 'energy');

    if (isEnergy) {
      // Buoyant zero-gravity upward drift: smooth deceleration
      ft.x += (ft.vx || 0) * dt;
      ft.y += ft.vy * dt;
      if (ft.vx) ft.vx *= Math.pow(0.88, dt * 60);
      ft.vy *= Math.pow(0.92, dt * 60);
    } else {
      // Physical damage: punchy upward pop with gentle gravity trajectory
      const gravity = 46; // px/s²
      ft.vy += gravity * dt;
      ft.x += (ft.vx || 0) * dt;
      ft.y += ft.vy * dt;
      if (ft.vx) ft.vx *= Math.pow(0.90, dt * 60);
    }

    // High quality fade-out curve:
    // 0% - 65%: Full solid presence
    // 65% - 100%: Smooth cubic fade-out
    const progress = (ft.maxLife - ft.life) / ft.maxLife;
    if (progress <= 0.65) {
      ft.alpha = 1.0;
    } else {
      const fadeProg = (progress - 0.65) / 0.35;
      ft.alpha = Math.pow(Math.max(0, 1 - fadeProg), 1.6);
    }

    remaining.push(ft);
  }

  return remaining;
}

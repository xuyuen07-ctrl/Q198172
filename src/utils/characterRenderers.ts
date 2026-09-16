import { CharacterId, CombatPuppet } from '../types/game';

/**
 * High-definition 3D Character Aesthetics Renderers
 * Provides premium, arcade-quality visual models for all 10 champions
 */

// Helper for drawing 3D faceted diamond table & borders
function drawFacetedDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colors: {
    top: string;
    left: string;
    right: string;
    bot: string;
    table: string;
    border: string;
    innerBorder: string;
  }
) {
  const topV = { x, y: y - size };
  const rightV = { x: x + size * 0.95, y };
  const botV = { x, y: y + size };
  const leftV = { x: x - size * 0.95, y };

  const inTop = { x, y: y - size * 0.44 };
  const inRight = { x: x + size * 0.42, y };
  const inBot = { x, y: y + size * 0.44 };
  const inLeft = { x: x - size * 0.42, y };

  // 1. Facet background fills
  ctx.fillStyle = colors.top;
  ctx.beginPath();
  ctx.moveTo(topV.x, topV.y);
  ctx.lineTo(rightV.x, rightV.y);
  ctx.lineTo(inRight.x, inRight.y);
  ctx.lineTo(inTop.x, inTop.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.left;
  ctx.beginPath();
  ctx.moveTo(topV.x, topV.y);
  ctx.lineTo(leftV.x, leftV.y);
  ctx.lineTo(inLeft.x, inLeft.y);
  ctx.lineTo(inTop.x, inTop.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.right;
  ctx.beginPath();
  ctx.moveTo(rightV.x, rightV.y);
  ctx.lineTo(botV.x, botV.y);
  ctx.lineTo(inBot.x, inBot.y);
  ctx.lineTo(inRight.x, inRight.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = colors.bot;
  ctx.beginPath();
  ctx.moveTo(leftV.x, leftV.y);
  ctx.lineTo(botV.x, botV.y);
  ctx.lineTo(inBot.x, inBot.y);
  ctx.lineTo(inLeft.x, inLeft.y);
  ctx.closePath();
  ctx.fill();

  // Inner table fill
  ctx.fillStyle = colors.table;
  ctx.beginPath();
  ctx.moveTo(inTop.x, inTop.y);
  ctx.lineTo(inRight.x, inRight.y);
  ctx.lineTo(inBot.x, inBot.y);
  ctx.lineTo(inLeft.x, inLeft.y);
  ctx.closePath();
  ctx.fill();

  // 2. Bevel facet edges
  ctx.strokeStyle = colors.innerBorder;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(topV.x, topV.y);
  ctx.lineTo(inTop.x, inTop.y);
  ctx.moveTo(rightV.x, rightV.y);
  ctx.lineTo(inRight.x, inRight.y);
  ctx.moveTo(botV.x, botV.y);
  ctx.lineTo(inBot.x, inBot.y);
  ctx.moveTo(leftV.x, leftV.y);
  ctx.lineTo(inLeft.x, inLeft.y);
  ctx.stroke();

  // 3. Inner table border
  ctx.beginPath();
  ctx.moveTo(inTop.x, inTop.y);
  ctx.lineTo(inRight.x, inRight.y);
  ctx.lineTo(inBot.x, inBot.y);
  ctx.lineTo(inLeft.x, inLeft.y);
  ctx.closePath();
  ctx.stroke();

  // 4. Outer border
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(topV.x, topV.y);
  ctx.lineTo(rightV.x, rightV.y);
  ctx.lineTo(botV.x, botV.y);
  ctx.lineTo(leftV.x, leftV.y);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Shared High-Definition 3D Specular Glint
 * Produces unified arcade glass / crystal / brushed-metal luster across characters
 */
function drawStandardSpecularGlint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  tint: string = '#ffffff'
) {
  ctx.save();
  // Primary Specular Crescent
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.arc(x - radius * 0.28, y - radius * 0.28, radius * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // Pinpoint Brilliant Sparkle
  ctx.fillStyle = tint;
  ctx.shadowColor = tint;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(x - radius * 0.32, y - radius * 0.32, Math.max(1, radius * 0.05), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: OBA (奧巴) - CYBERNETIC KINETIC POWER GAUNTLETS (雙極動能離子拳套)
 * ---------------------------------------------------------------------------
 */
function drawCyberneticGauntlets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  consecutiveHits: number = 0
) {
  const speed = Math.hypot(vx, vy);
  let aimAngle = -Math.PI * 0.5;
  if (targetX !== undefined && targetY !== undefined) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  } else if (speed > 12) {
    aimAngle = Math.atan2(vy, vx);
  } else {
    aimAngle = -Math.PI * 0.5 + Math.sin(time * 2.2) * 0.12;
  }

  const isOverdrive = consecutiveHits >= 3;
  const punchFreq = speed > 15 ? 18 : 9;
  const perpAngle = aimAngle + Math.PI * 0.5;

  // Left and Right fist parameters
  const fistDist = radius * 1.05;
  const punchReach = radius * (speed > 15 ? 0.42 : 0.22) + (isOverdrive ? radius * 0.15 : 0);

  for (let side = -1; side <= 1; side += 2) {
    const punchPhase = Math.sin(time * punchFreq + (side === 1 ? Math.PI : 0));
    const thrustDist = Math.max(0, punchPhase) * punchReach;

    // Base position flanking the champion sphere
    const baseX = x + Math.cos(perpAngle) * (side * fistDist);
    const baseY = y + Math.sin(perpAngle) * (side * fistDist);

    // Thrust vector along aim direction
    const fx = baseX + Math.cos(aimAngle) * thrustDist;
    const fy = baseY + Math.sin(aimAngle) * thrustDist;

    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(aimAngle + Math.PI * 0.5);

    const fW = radius * 0.36;
    const fH = radius * 0.46;

    // 1. Kinetic Mach Shockwave Rings when punching forward
    if (punchPhase > 0.6) {
      const ringAlpha = (punchPhase - 0.6) / 0.4;
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.8})`;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, -fH * 0.7, fW * 0.9, fH * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Forearm Armor Bracer (Heavy Cobalt Plating)
    ctx.save();
    const bracerGrad = ctx.createLinearGradient(-fW * 0.5, 0, fW * 0.5, 0);
    bracerGrad.addColorStop(0, '#0f172a');
    bracerGrad.addColorStop(0.3, '#1e3a8a');
    bracerGrad.addColorStop(0.7, '#2563eb');
    bracerGrad.addColorStop(1, '#60a5fa');
    ctx.fillStyle = bracerGrad;
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.roundRect(-fW * 0.45, -fH * 0.1, fW * 0.9, fH * 0.55, 3);
    ctx.fill();
    ctx.stroke();

    // Golden rivet reinforcements
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-fW * 0.3, fH * 0.15, 1.3, 0, Math.PI * 2);
    ctx.arc(fW * 0.3, fH * 0.15, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Segmented Knuckle Fist Head (Heavy punch striking surface)
    ctx.save();
    const fistGrad = ctx.createLinearGradient(-fW * 0.5, -fH * 0.6, fW * 0.5, 0);
    fistGrad.addColorStop(0, isOverdrive ? '#f59e0b' : '#38bdf8');
    fistGrad.addColorStop(0.4, isOverdrive ? '#dc2626' : '#1d4ed8');
    fistGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = fistGrad;
    ctx.strokeStyle = isOverdrive ? '#fef08a' : '#bfdbfe';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = isOverdrive ? '#f59e0b' : '#38bdf8';
    ctx.shadowBlur = isOverdrive ? 12 : 8;

    ctx.beginPath();
    ctx.moveTo(-fW * 0.45, -fH * 0.05);
    ctx.lineTo(-fW * 0.5, -fH * 0.45);
    ctx.lineTo(-fW * 0.25, -fH * 0.6);
    ctx.lineTo(fW * 0.25, -fH * 0.6);
    ctx.lineTo(fW * 0.5, -fH * 0.45);
    ctx.lineTo(fW * 0.45, -fH * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Knuckle segment groove dividers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-fW * 0.18, -fH * 0.05);
    ctx.lineTo(-fW * 0.18, -fH * 0.55);
    ctx.moveTo(fW * 0.18, -fH * 0.05);
    ctx.lineTo(fW * 0.18, -fH * 0.55);
    ctx.stroke();

    // 4. Plasma Kinetic Knuckle Core Emitters
    const coreColor = isOverdrive ? '#fef08a' : '#67e8f9';
    ctx.fillStyle = coreColor;
    ctx.shadowColor = coreColor;
    ctx.shadowBlur = 6;
    for (let k = -1; k <= 1; k++) {
      ctx.beginPath();
      ctx.arc(k * (fW * 0.26), -fH * 0.42, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Wrist Plasma Arc Discharge
    if (isOverdrive || speed > 15) {
      ctx.strokeStyle = isOverdrive ? '#fef08a' : '#67e8f9';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-fW * 0.35, fH * 0.35);
      ctx.lineTo(Math.sin(time * 35 + side) * 3, fH * 0.48);
      ctx.lineTo(fW * 0.35, fH * 0.35);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }
}

/** 1. OBA (奧巴) - 物理戰士／近戰碰撞 */
export function drawObaFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  consecutiveHits: number = 0
) {
  ctx.save();
  const crestSize = radius * 0.52;

  // 1. WEAPON: CYBERNETIC POWER GAUNTLETS
  drawCyberneticGauntlets(ctx, x, y, radius, time, vx, vy, targetX, targetY, consecutiveHits);

  // Dual Cybernetic Shoulder Armor Carapaces
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = Math.max(1.5, radius * 0.08);
  ctx.shadowColor = '#3b82f6';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.68, Math.PI * 0.22, Math.PI * 0.78);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.68, Math.PI * 1.22, Math.PI * 1.78);
  ctx.stroke();

  // Armor seam panel lines
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.58, Math.PI * 0.28, Math.PI * 0.72);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.58, Math.PI * 1.28, Math.PI * 1.72);
  ctx.stroke();

  // Golden Aegis Wings V-Crest
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x - crestSize * 0.7, y - crestSize * 0.25);
  ctx.lineTo(x, y + crestSize * 0.35);
  ctx.lineTo(x + crestSize * 0.7, y - crestSize * 0.25);
  ctx.stroke();

  // Secondary golden inner chevron
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - crestSize * 0.45, y - crestSize * 0.45);
  ctx.lineTo(x, y + crestSize * 0.15);
  ctx.lineTo(x + crestSize * 0.45, y - crestSize * 0.45);
  ctx.stroke();

  // Central Kinetic Reactor Turbine
  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, crestSize * 0.5);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, '#67e8f9');
  coreGrad.addColorStop(0.7, '#0284c7');
  coreGrad.addColorStop(1, '#0f172a');

  ctx.fillStyle = coreGrad;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(x, y - crestSize * 0.46);
  ctx.lineTo(x + crestSize * 0.42, y);
  ctx.lineTo(x, y + crestSize * 0.46);
  ctx.lineTo(x - crestSize * 0.42, y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Kinetic Turbine Rotating Blades
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 3);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  for (let b = 0; b < 4; b++) {
    const angle = (b * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * (crestSize * 0.32), Math.sin(angle) * (crestSize * 0.32));
    ctx.stroke();
  }
  ctx.restore();

  // Combat Visor Optic
  const visorW = radius * 0.45;
  const visorY = y - radius * 0.32;
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 8;
  ctx.fillRect(x - visorW * 0.5, visorY, visorW, 2.5);

  // Visor laser scan glint
  const scanOffset = Math.sin(time * 4) * (visorW * 0.4);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + scanOffset, visorY + 1.2, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#67e8f9');
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: HUOTONG (火桶) - VOLCANIC MORTAR CANNONS & EXHAUST STACKS
 * ---------------------------------------------------------------------------
 */
function drawVolcanicHeavyCannons(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  isHotBody: boolean = false
) {
  const speed = Math.hypot(vx, vy);
  // Recoil displacement along motion or breathing
  const recoilDist = (isHotBody ? 5 : 2.5) * Math.abs(Math.sin(time * (speed > 10 ? 14 : 6)));

  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    // Mount position on top flanks of the furnace barrel
    const mountX = x + side * (radius * 0.72);
    const mountY = y - radius * 0.45;
    const barrelAngle = -Math.PI * 0.5 + side * 0.28;

    ctx.translate(mountX, mountY);
    ctx.rotate(barrelAngle);

    const bW = radius * 0.28;
    const bLen = radius * 0.58 + (isHotBody ? 4 : 0);

    // 1. Recoil Slide (moves backwards into sleeve then returns)
    ctx.translate(0, recoilDist);

    // 2. Heavy Cast-Iron Cannon Barrel
    const barrelGrad = ctx.createLinearGradient(-bW * 0.5, 0, bW * 0.5, 0);
    barrelGrad.addColorStop(0, '#1c1917');
    barrelGrad.addColorStop(0.35, '#292524');
    barrelGrad.addColorStop(0.7, '#44403c');
    barrelGrad.addColorStop(1, '#78716c');

    ctx.fillStyle = barrelGrad;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.roundRect(-bW * 0.5, -bLen, bW, bLen, 2);
    ctx.fill();
    ctx.stroke();

    // 3. Brass Reinforcement Collars
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 0.8;
    ctx.fillRect(-bW * 0.55, -bLen * 0.65, bW * 1.1, bLen * 0.16);
    ctx.strokeRect(-bW * 0.55, -bLen * 0.65, bW * 1.1, bLen * 0.16);

    // Muzzle Crown Ring
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-bW * 0.58, -bLen, bW * 1.16, bLen * 0.12);

    // 4. Magma Cannon Bore (Glowing interior)
    const boreGrad = ctx.createRadialGradient(0, -bLen, 0.5, 0, -bLen, bW * 0.45);
    boreGrad.addColorStop(0, '#ffffff');
    boreGrad.addColorStop(0.3, '#fef08a');
    boreGrad.addColorStop(0.7, '#ea580c');
    boreGrad.addColorStop(1, '#450a0a');

    ctx.fillStyle = boreGrad;
    ctx.beginPath();
    ctx.ellipse(0, -bLen, bW * 0.42, bW * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Fire Exhaust Flame Tongues (When Hot Body or high speed)
    if (isHotBody || speed > 12) {
      const flameLen = (radius * (isHotBody ? 0.65 : 0.35)) * (0.8 + Math.sin(time * 24 + side) * 0.2);
      ctx.save();
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 14;

      const flameGrad = ctx.createLinearGradient(0, -bLen, 0, -bLen - flameLen);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#fef08a');
      flameGrad.addColorStop(0.65, '#f97316');
      flameGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-bW * 0.38, -bLen);
      ctx.quadraticCurveTo(-bW * 0.5, -bLen - flameLen * 0.5, 0, -bLen - flameLen);
      ctx.quadraticCurveTo(bW * 0.5, -bLen - flameLen * 0.5, bW * 0.38, -bLen);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 6. Drifting hot ember spark particles
    for (let e = 0; e < 2; e++) {
      const ePhase = (time * 3 + e * 0.5 + side * 0.2) % 1;
      const ex = (Math.sin(time * 8 + e) * bW * 0.5);
      const ey = -bLen - ePhase * (radius * 0.6);
      ctx.fillStyle = e % 2 === 0 ? '#fef08a' : '#f97316';
      ctx.beginPath();
      ctx.arc(ex, ey, (1 - ePhase) * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

/** 2. HUOTONG (火桶) - 坦克遊走／持續干擾 */
export function drawHuotongFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  isHotBody: boolean = false
) {
  ctx.save();
  const hoopW = radius * 0.88;
  const hoopH = radius * 0.22;

  // 1. WEAPON: VOLCANIC HEAVY MORTAR CANNONS & EXHAUST PIPES
  drawVolcanicHeavyCannons(ctx, x, y, radius, time, vx, vy, isHotBody);

  // Basalt Magma Fissures
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.6, y - radius * 0.1);
  ctx.lineTo(x - radius * 0.3, y + radius * 0.15);
  ctx.lineTo(x - radius * 0.4, y + radius * 0.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + radius * 0.55, y - radius * 0.2);
  ctx.lineTo(x + radius * 0.25, y + radius * 0.05);
  ctx.lineTo(x + radius * 0.45, y + radius * 0.4);
  ctx.stroke();

  // Heavy Cast-Iron Hoops (Top and Bottom)
  ctx.fillStyle = '#290808';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2.0;

  ctx.beginPath();
  ctx.ellipse(x, y - radius * 0.36, hoopW * 0.85, hoopH * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.36, hoopW * 0.85, hoopH * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Forged Rivets (6 Hexagonal Bolts)
  const rivetOffsets = [-hoopW * 0.55, -hoopW * 0.18, hoopW * 0.18, hoopW * 0.55];
  rivetOffsets.forEach(rx => {
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x + rx, y - radius * 0.36, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + rx, y + radius * 0.36, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Blast-Furnace Hatch Door & Roaring Fire Core
  const fireGrad = ctx.createRadialGradient(x, y + radius * 0.05, 0, x, y + radius * 0.05, radius * 0.46);
  fireGrad.addColorStop(0, '#ffffff');
  fireGrad.addColorStop(0.25, '#fef08a');
  fireGrad.addColorStop(0.55, '#f97316');
  fireGrad.addColorStop(0.85, '#dc2626');
  fireGrad.addColorStop(1, '#450a0a');

  ctx.fillStyle = fireGrad;
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 16;

  // Dynamic flicking flame silhouette
  const flicker = Math.sin(time * 12) * (radius * 0.06);
  ctx.beginPath();
  ctx.moveTo(x, y - radius * 0.44 + flicker);
  ctx.bezierCurveTo(x + radius * 0.32, y - radius * 0.15, x + radius * 0.36, y + radius * 0.22, x, y + radius * 0.38);
  ctx.bezierCurveTo(x - radius * 0.36, y + radius * 0.22, x - radius * 0.32, y - radius * 0.15, x, y - radius * 0.44 + flicker);
  ctx.fill();

  // Furnace Grate Bars
  ctx.strokeStyle = 'rgba(69, 10, 10, 0.85)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.15, y - radius * 0.18);
  ctx.lineTo(x - radius * 0.15, y + radius * 0.24);
  ctx.moveTo(x, y - radius * 0.22);
  ctx.lineTo(x, y + radius * 0.28);
  ctx.moveTo(x + radius * 0.15, y - radius * 0.18);
  ctx.lineTo(x + radius * 0.15, y + radius * 0.24);
  ctx.stroke();

  // White-hot center spark
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y + radius * 0.06, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#fef08a');
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: HAILAISE (海萊瑟) - CELESTIAL VOID AMETHYST SCEPTER (星界虛空法杖)
 * ---------------------------------------------------------------------------
 */
function drawCelestialVoidStaff(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  magicEnergy: number = 0
) {
  const staffX = x + radius * 1.15;
  const staffY = y - radius * 0.15 + Math.sin(time * 2.4) * 4.5;
  const staffAngle = 0.18 + Math.sin(time * 1.8) * 0.08;

  ctx.save();
  ctx.translate(staffX, staffY);
  ctx.rotate(staffAngle);

  const sLen = radius * 1.55;
  const sW = Math.max(2.8, radius * 0.09);

  // 1. Slender Twisted Cosmic Silver-Violet Shaft
  const shaftGrad = ctx.createLinearGradient(-sW * 0.5, -sLen * 0.45, sW * 0.5, sLen * 0.55);
  shaftGrad.addColorStop(0, '#f5d0fe');
  shaftGrad.addColorStop(0.3, '#c084fc');
  shaftGrad.addColorStop(0.7, '#7e22ce');
  shaftGrad.addColorStop(1, '#3b0764');

  ctx.fillStyle = shaftGrad;
  ctx.strokeStyle = '#e9d5ff';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(-sW * 0.5, -sLen * 0.45, sW, sLen, sW * 0.5);
  ctx.fill();
  ctx.stroke();

  // Spiral starlight rune ribbing along shaft
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.0;
  for (let r = 0; r < 4; r++) {
    const ry = -sLen * 0.3 + r * (sLen * 0.22);
    ctx.beginPath();
    ctx.ellipse(0, ry, sW * 0.8, sW * 0.4, 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Crescent Star-Cradle Crown
  const crownY = -sLen * 0.48;
  const crownR = radius * 0.26;

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, crownY, crownR, Math.PI * 0.2, Math.PI * 1.35);
  ctx.stroke();

  // Secondary inner crescent tip
  ctx.strokeStyle = '#f5d0fe';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, crownY, crownR * 0.72, Math.PI * 0.3, Math.PI * 1.25);
  ctx.stroke();

  // 3. Levitating 8-Facet Royal Purple Amethyst Gem
  const gemY = crownY - crownR * 0.15 + Math.sin(time * 4) * 2;
  const gemR = radius * 0.22;

  ctx.save();
  ctx.translate(0, gemY);
  ctx.rotate(time * 0.8);

  const gemGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, gemR);
  gemGrad.addColorStop(0, '#ffffff');
  gemGrad.addColorStop(0.3, '#f5d0fe');
  gemGrad.addColorStop(0.65, '#a855f7');
  gemGrad.addColorStop(1, '#581c87');

  ctx.fillStyle = gemGrad;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 14;

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    const d = i % 2 === 0 ? gemR : gemR * 0.65;
    const px = Math.cos(ang) * d;
    const py = Math.sin(ang) * d;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 4. Dual Concentric Gyroscopic Orbiting Rings
  ctx.save();
  ctx.translate(0, gemY);
  for (let ring = 0; ring < 2; ring++) {
    const rAngle = (ring === 0 ? time * 2.8 : -time * 2.2);
    ctx.save();
    ctx.rotate(rAngle);
    ctx.strokeStyle = ring === 0 ? 'rgba(245, 208, 254, 0.85)' : 'rgba(251, 191, 36, 0.75)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.ellipse(0, 0, gemR * 1.45, gemR * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Small starlight bead on ring
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gemR * 1.45, 0, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 5. Starlight Emission Ray and floating sparkle motes
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 6;
  for (let p = 0; p < 3; p++) {
    const pPhase = (time * 1.8 + p * 0.33) % 1;
    const px = Math.sin(time * 5 + p * 2) * (gemR * 0.8);
    const py = gemY - gemR * 0.8 - pPhase * (radius * 0.55);
    ctx.beginPath();
    ctx.arc(px, py, (1 - pPhase) * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

/** 3. HAILAISE (海萊瑟) - 刺客法師／幻影移位 */
export function drawHailaiseFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  magicEnergy: number = 0
) {
  ctx.save();
  const starR = radius * 0.52;

  // 1. WEAPON: CELESTIAL VOID AMETHYST SCEPTER
  drawCelestialVoidStaff(ctx, x, y, radius, time, vx, vy, targetX, targetY, magicEnergy);

  // Celestial Stardust Flecks
  ctx.fillStyle = '#f5d0fe';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 4;
  for (let i = 0; i < 6; i++) {
    const a = i * (Math.PI / 3) + time * 0.3;
    const dist = radius * (0.42 + 0.2 * Math.sin(i * 2 + time));
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * dist, y + Math.sin(a) * dist, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mystic Transmutation Rune Ring
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.65)';
  ctx.lineWidth = 1.3;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x, y, starR * 0.9, 0, Math.PI * 2);
  ctx.stroke();

  // 12 Astrological Tick Marks
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - time * 0.4;
    const r1 = starR * 0.85;
    const r2 = starR * 0.96;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
    ctx.stroke();
  }

  // 8-Point Arcane Celestial Star
  const starGrad = ctx.createRadialGradient(x, y, 0, x, y, starR);
  starGrad.addColorStop(0, '#ffffff');
  starGrad.addColorStop(0.3, '#f5d0fe');
  starGrad.addColorStop(0.65, '#c084fc');
  starGrad.addColorStop(1, '#6b21a8');

  ctx.fillStyle = starGrad;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 14;

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + time * 0.6;
    const r = i % 2 === 0 ? starR : starR * 0.42;
    const sx = x + Math.cos(angle) * r;
    const sy = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#f5d0fe';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Mystic Amethyst Pupil / Core
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#f5d0fe');
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: LINGYINSI (靈隱寺) - SPIRITUAL CELESTIAL RECURVE BOW (玄光靈影晶弓)
 * ---------------------------------------------------------------------------
 */
function drawSpiritualRecurveBow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  clonesCount: number = 0
) {
  const speed = Math.hypot(vx, vy);
  let aimAngle = -Math.PI * 0.5;
  if (targetX !== undefined && targetY !== undefined) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  } else if (speed > 10) {
    aimAngle = Math.atan2(vy, vx);
  } else {
    aimAngle = -Math.PI * 0.5 + Math.sin(time * 2.0) * 0.15;
  }

  // Flanking mount offset (bow hovers beside the sniper)
  const perpAngle = aimAngle - Math.PI * 0.5;
  const bowDist = radius * 1.18;
  const bowX = x + Math.cos(perpAngle) * bowDist;
  const bowY = y + Math.sin(perpAngle) * bowDist;

  ctx.save();
  ctx.translate(bowX, bowY);
  ctx.rotate(aimAngle + Math.PI * 0.5);

  const bowLen = radius * 1.55;
  const bowSpan = radius * 0.58;

  // Drawback breathing (string pulls backward toward shooter)
  const isCharging = speed > 10 || clonesCount > 0;
  const drawBack = (isCharging ? 6 : 3) + Math.sin(time * 6) * 2;

  // 1. Upper & Lower Recurve Crystal Limbs
  ctx.save();
  const limbGrad = ctx.createLinearGradient(0, -bowLen * 0.5, 0, bowLen * 0.5);
  limbGrad.addColorStop(0, '#ffffff');
  limbGrad.addColorStop(0.25, '#38bdf8');
  limbGrad.addColorStop(0.5, '#0284c7');
  limbGrad.addColorStop(0.75, '#38bdf8');
  limbGrad.addColorStop(1, '#ffffff');

  ctx.strokeStyle = limbGrad;
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;

  // Graceful recurve curve
  ctx.beginPath();
  ctx.moveTo(bowSpan * 0.15, -bowLen * 0.5);
  ctx.bezierCurveTo(bowSpan * 0.95, -bowLen * 0.28, bowSpan * 0.45, 0, bowSpan * 0.2, 0);
  ctx.bezierCurveTo(bowSpan * 0.45, 0, bowSpan * 0.95, bowLen * 0.28, bowSpan * 0.15, bowLen * 0.5);
  ctx.stroke();

  // Central Golden Bow Riser / Handgrip
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(bowSpan * 0.2, -bowLen * 0.15);
  ctx.lineTo(bowSpan * 0.2, bowLen * 0.15);
  ctx.stroke();

  // Golden stabilizer weight rod
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bowSpan * 0.2, 0);
  ctx.lineTo(bowSpan * 0.65, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bowSpan * 0.65, 0, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Luminous Spiritual Bowstring
  ctx.save();
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.95)';
  ctx.lineWidth = 1.3;
  ctx.shadowColor = '#bae6fd';
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.moveTo(bowSpan * 0.15, -bowLen * 0.5);
  ctx.lineTo(-drawBack, 0);
  ctx.lineTo(bowSpan * 0.15, bowLen * 0.5);
  ctx.stroke();
  ctx.restore();

  // 3. Nocked Celestial Light Arrow
  ctx.save();
  const arrowLen = radius * 1.35;
  const arrowX = -drawBack;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;

  // Arrow shaft
  ctx.beginPath();
  ctx.moveTo(arrowX, 0);
  ctx.lineTo(arrowX + arrowLen, 0);
  ctx.stroke();

  // Diamond Crystal Arrowhead
  const headX = arrowX + arrowLen;
  const headSize = radius * 0.18;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(headX, 0);
  ctx.lineTo(headX - headSize * 0.8, -headSize * 0.45);
  ctx.lineTo(headX - headSize * 0.5, 0);
  ctx.lineTo(headX - headSize * 0.8, headSize * 0.45);
  ctx.closePath();
  ctx.fill();

  // Arrow feather fletchings
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(arrowX + 2, -4);
  ctx.lineTo(arrowX + 8, 0);
  ctx.lineTo(arrowX + 2, 4);
  ctx.stroke();

  // 4. Concentric Shockwave Rings on clone or charge
  if (clonesCount > 0) {
    const ringPhase = (time * 5) % 1;
    ctx.strokeStyle = `rgba(56, 189, 248, ${1 - ringPhase})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(headX, 0, ringPhase * radius * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/** 4. LINGYINSI (靈隱寺) - 射手召喚／分身牽制 */
export function drawLingyinsiFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  clonesCount: number = 0
) {
  ctx.save();
  const coreR = radius * 0.54;

  // 1. WEAPON: SPIRITUAL CELESTIAL RECURVE BOW
  drawSpiritualRecurveBow(ctx, x, y, radius, time, vx, vy, targetX, targetY, clonesCount);

  // Tactical HUD Bracket Ring
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, coreR * 0.92, 0, Math.PI * 2);
  ctx.stroke();

  // 4 Corner Targeting L-Brackets
  const bDist = coreR * 0.98;
  const bLen = coreR * 0.24;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 8;

  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    const bx = x + Math.cos(a) * bDist;
    const by = y + Math.sin(a) * bDist;
    ctx.beginPath();
    ctx.arc(bx, by, bLen * 0.5, a - 0.6, a + 0.6);
    ctx.stroke();
  }

  // 4 Precision Crosshair Spikes
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + time * 0.35;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (coreR * 0.28), y + Math.sin(a) * (coreR * 0.28));
    ctx.lineTo(x + Math.cos(a) * (coreR * 0.88), y + Math.sin(a) * (coreR * 0.88));
    ctx.stroke();
  }

  // 4 Orbiting Psionic Prism Shards
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 - time * 0.8;
    const px = x + Math.cos(a) * (coreR * 0.65);
    const py = y + Math.sin(a) * (coreR * 0.65);
    ctx.fillStyle = '#e0f2fe';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Precision Diamond Sniper Eye
  const markGrad = ctx.createRadialGradient(x, y, 0, x, y, coreR * 0.45);
  markGrad.addColorStop(0, '#ffffff');
  markGrad.addColorStop(0.3, '#bae6fd');
  markGrad.addColorStop(0.7, '#0ea5e9');
  markGrad.addColorStop(1, '#0369a1');

  ctx.fillStyle = markGrad;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(x, y - coreR * 0.46);
  ctx.lineTo(x + coreR * 0.46, y);
  ctx.lineTo(x, y + coreR * 0.46);
  ctx.lineTo(x - coreR * 0.46, y);
  ctx.closePath();
  ctx.fill();

  // Pinpoint White Laser Aim
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#bae6fd');
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: CHANSHI (禪師) - NINE-RING SACRED VAJRA KHAKKHARA (九環降魔錫杖)
 * ---------------------------------------------------------------------------
 */
function drawNineRingVajraStaff(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  bellShieldTimer: number = 0,
  healingTimer: number = 0
) {
  const staffX = x + radius * 1.16;
  const staffY = y + Math.sin(time * 2.2) * 4;
  const staffTilt = 0.12 + Math.sin(time * 1.5) * 0.06;

  ctx.save();
  ctx.translate(staffX, staffY);
  ctx.rotate(staffTilt);

  const sLen = radius * 1.62;
  const sW = Math.max(3.0, radius * 0.09);

  // 1. Sacred Golden Sandalwood Shaft
  const shaftGrad = ctx.createLinearGradient(-sW * 0.5, 0, sW * 0.5, 0);
  shaftGrad.addColorStop(0, '#78350f');
  shaftGrad.addColorStop(0.35, '#b45309');
  shaftGrad.addColorStop(0.7, '#f59e0b');
  shaftGrad.addColorStop(1, '#fef08a');

  ctx.fillStyle = shaftGrad;
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.roundRect(-sW * 0.5, -sLen * 0.42, sW, sLen, 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Sanskrit Mantra Inscriptions on Staff
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let m = 0; m < 5; m++) {
    const my = -sLen * 0.25 + m * (sLen * 0.16);
    ctx.fillRect(-sW * 0.3, my, sW * 0.6, 2.0);
  }

  // 2. Ornate Golden Pagoda / Lotus Finial Crown
  const crownY = -sLen * 0.45;
  const crownW = radius * 0.48;
  const crownH = radius * 0.46;

  ctx.save();
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 10;

  // Central Lotus Base Plate
  ctx.beginPath();
  ctx.ellipse(0, crownY, sW * 1.4, sW * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Central Stupa Spire Spike
  ctx.beginPath();
  ctx.moveTo(-sW * 0.6, crownY);
  ctx.lineTo(0, crownY - crownH * 0.85);
  ctx.lineTo(sW * 0.6, crownY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sacred Mani Pearl Finial Orb
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, crownY - crownH * 0.88, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // 3 Loops: Left Loop, Center Ring, Right Loop
  const loopOffsets = [-crownW * 0.38, 0, crownW * 0.38];
  loopOffsets.forEach(lo => {
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(lo, crownY - crownH * 0.35, crownW * 0.2, crownH * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3. Nine Golden Khakkhara Prayer Rings (3 on each loop with physics sway)
  const ringAngles = [-0.4, 0, 0.4];
  let ringCounter = 0;
  loopOffsets.forEach(lo => {
    ringAngles.forEach(ra => {
      ringCounter++;
      const sway = Math.sin(time * 5 + ringCounter * 0.7) * 0.28;
      const rHangX = lo + Math.sin(ra + sway) * (crownW * 0.18);
      const rHangY = crownY - crownH * 0.35 + Math.cos(ra + sway) * (crownH * 0.28);

      ctx.save();
      ctx.translate(rHangX, rHangY);
      ctx.rotate(sway);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 2.6, 0, Math.PI * 2);
      ctx.stroke();

      // Gleam on ring
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-0.8, -0.8, 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  });

  // 4. Bell Shield or Healing Resonant Waves
  if (bellShieldTimer > 0 || healingTimer > 0) {
    const wavePhase = (time * 3) % 1;
    ctx.strokeStyle = `rgba(254, 240, 138, ${1 - wavePhase})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, crownY - crownH * 0.35, (crownW * 0.6) * (0.8 + wavePhase * 1.5), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/** 5. CHANSHI (禪師) - 聖僧金身／護盾減速 */
export function drawChanshiFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  bellShieldTimer: number = 0,
  healingTimer: number = 0
) {
  ctx.save();
  const zenR = radius * 0.54;

  // 1. WEAPON: NINE-RING SACRED VAJRA KHAKKHARA
  drawNineRingVajraStaff(ctx, x, y, radius, time, vx, vy, bellShieldTimer, healingTimer);

  // 8-Petaled Sacred Lotus Flower (八瓣金蓮)
  const petalCount = 8;
  ctx.fillStyle = 'rgba(254, 240, 138, 0.32)';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < petalCount; i++) {
    const a = (i * Math.PI * 2) / petalCount + time * 0.25;
    const px = x + Math.cos(a) * (zenR * 0.7);
    const py = y + Math.sin(a) * (zenR * 0.7);
    ctx.beginPath();
    ctx.arc(px, py, zenR * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Dharmachakra (8-Spoke Wheel of Dharma 轉法輪)
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 10;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + time * 0.25;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (zenR * 0.28), y + Math.sin(a) * (zenR * 0.28));
    ctx.lineTo(x + Math.cos(a) * (zenR * 0.9), y + Math.sin(a) * (zenR * 0.9));
    ctx.stroke();

    // Sacred Golden Prayer Beads at spoke tips
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * (zenR * 0.92), y + Math.sin(a) * (zenR * 0.92), 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Sacred Golden Nirvana Core
  const zenCoreGrad = ctx.createRadialGradient(x, y, 0, x, y, zenR * 0.44);
  zenCoreGrad.addColorStop(0, '#ffffff');
  zenCoreGrad.addColorStop(0.3, '#fef08a');
  zenCoreGrad.addColorStop(0.7, '#eab308');
  zenCoreGrad.addColorStop(1, '#854d0e');

  ctx.fillStyle = zenCoreGrad;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, zenR * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Holy Mani Pearl & Vajra Seal
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x, y - zenR * 0.22);
  ctx.lineTo(x + zenR * 0.22, y);
  ctx.lineTo(x, y + zenR * 0.22);
  ctx.lineTo(x - zenR * 0.22, y);
  ctx.closePath();
  ctx.fill();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#fef08a');
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: HUANGZUAN (黃鑽) - TWIN HIGH-VOLTAGE LIGHTNING PRISM DAGGERS
 * ---------------------------------------------------------------------------
 */
function drawLightningPrismDaggers(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  speedStacks: number = 0
) {
  const speed = Math.hypot(vx, vy);
  let aimAngle = -Math.PI * 0.5;
  if (targetX !== undefined && targetY !== undefined) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  } else if (speed > 10) {
    aimAngle = Math.atan2(vy, vx);
  }

  const isHyper = speedStacks > 3 || speed > 15;
  const jitterAmp = isHyper ? 3.0 : 1.2;
  const perpAngle = aimAngle + Math.PI * 0.5;
  const daggerDist = radius * 1.15;

  for (let side = -1; side <= 1; side += 2) {
    const jitterX = Math.sin(time * 35 + side * 4) * jitterAmp;
    const jitterY = Math.cos(time * 35 + side * 4) * jitterAmp;

    const dx = x + Math.cos(perpAngle) * (side * daggerDist) + jitterX;
    const dy = y + Math.sin(perpAngle) * (side * daggerDist) + jitterY;

    ctx.save();
    ctx.translate(dx, dy);
    // Aiming orientation: when sprinting, points sharply forward; when idle, slants aggressively
    const bladeAngle = aimAngle + (isHyper ? 0 : side * 0.25);
    ctx.rotate(bladeAngle + Math.PI * 0.5);

    const dW = radius * 0.24;
    const dLen = radius * 0.68 + (isHyper ? 4 : 0);

    // 1. Faceted Canary Diamond Blade
    const bladeGrad = ctx.createLinearGradient(-dW * 0.5, 0, dW * 0.5, 0);
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.3, '#fef08a');
    bladeGrad.addColorStop(0.7, '#eab308');
    bladeGrad.addColorStop(1, '#a16207');

    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = isHyper ? 14 : 8;

    ctx.beginPath();
    ctx.moveTo(0, -dLen * 0.6); // Sharp needle tip
    ctx.lineTo(dW * 0.5, -dLen * 0.1);
    ctx.lineTo(dW * 0.35, dLen * 0.4);
    ctx.lineTo(0, dLen * 0.3);
    ctx.lineTo(-dW * 0.35, dLen * 0.4);
    ctx.lineTo(-dW * 0.5, -dLen * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Fuller Spine Ridge
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, -dLen * 0.58);
    ctx.lineTo(0, dLen * 0.28);
    ctx.stroke();

    // 2. High-Voltage Electric Arc from Dagger to Core
    if (isHyper || (time * 10) % 2 < 1) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.4;

      // Draw zigzag lightning to center
      const midX = -side * (radius * 0.5);
      const midY = (Math.sin(time * 40) * 8);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(midX * 0.4 + (Math.sin(time * 50) * 4), midY * 0.4);
      ctx.lineTo(midX * 0.8, midY * 0.8 + (Math.cos(time * 50) * 4));
      ctx.lineTo(-side * daggerDist, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}

/** 6. HUANGZUAN (黃鑽) - 速度麻痺／領域爆發 */
export function drawHuangzuanFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  speedStacks: number = 0
) {
  ctx.save();
  const dR = radius * 0.58;

  // 1. WEAPON: TWIN HIGH-VOLTAGE LIGHTNING PRISM DAGGERS
  drawLightningPrismDaggers(ctx, x, y, radius, time, vx, vy, targetX, targetY, speedStacks);

  // 16-Facet Canary Brilliant Diamond Geometry
  drawFacetedDiamond(ctx, x, y, dR, {
    top: 'rgba(255, 255, 255, 0.65)',
    left: 'rgba(250, 255, 120, 0.48)',
    right: 'rgba(234, 252, 10, 0.38)',
    bot: 'rgba(110, 135, 0, 0.52)',
    table: 'rgba(255, 255, 255, 0.45)',
    border: '#ffffff',
    innerBorder: 'rgba(234, 252, 10, 0.95)'
  });

  // Central Electric High-Voltage Lightning Bolt
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(x + 1.5, y - dR * 0.32);
  ctx.lineTo(x - dR * 0.22, y + dR * 0.04);
  ctx.lineTo(x + 0.8, y + dR * 0.04);
  ctx.lineTo(x - 2, y + dR * 0.42);
  ctx.lineTo(x + dR * 0.22, y - 0.5);
  ctx.lineTo(x + 1.5, y - 0.5);
  ctx.closePath();
  ctx.fill();

  // Dual Electric Sparks
  const sparkPhase = (time * 6) % 1;
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(x - dR * 0.18, y - dR * 0.12 + sparkPhase * 6, 1.6, 0, Math.PI * 2);
  ctx.arc(x + dR * 0.16, y + dR * 0.1 - sparkPhase * 6, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Brilliant Specular Diamond Glint
  const glintX = x - dR * 0.25;
  const glintY = y - dR * 0.55;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(glintX, glintY, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: LANZUAN (藍鑽) - SAPPHIRE SCEPTER & ORBITING EMOTION CRYSTALS
 * ---------------------------------------------------------------------------
 */
function drawSapphireScepterAndOrbitals(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  emotionFieldActive: boolean = false
) {
  const staffX = x + radius * 1.14;
  const staffY = y - radius * 0.12 + Math.sin(time * 2.0) * 4;
  const staffTilt = 0.16 + Math.sin(time * 1.6) * 0.05;

  ctx.save();
  ctx.translate(staffX, staffY);
  ctx.rotate(staffTilt);

  const sLen = radius * 1.58;
  const sW = Math.max(3.0, radius * 0.09);

  // 1. Platinum and Sapphire Shaft
  const shaftGrad = ctx.createLinearGradient(-sW * 0.5, 0, sW * 0.5, 0);
  shaftGrad.addColorStop(0, '#0369a1');
  shaftGrad.addColorStop(0.35, '#0284c7');
  shaftGrad.addColorStop(0.7, '#38bdf8');
  shaftGrad.addColorStop(1, '#e0f2fe');

  ctx.fillStyle = shaftGrad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.roundRect(-sW * 0.5, -sLen * 0.44, sW, sLen, 2);
  ctx.fill();
  ctx.stroke();

  // Undulating oceanic ribbons wrapping shaft
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
  ctx.lineWidth = 1.2;
  for (let w = 0; w < 3; w++) {
    const wy = -sLen * 0.3 + w * (sLen * 0.25);
    ctx.beginPath();
    ctx.ellipse(0, wy, sW * 1.1, sW * 0.4, 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Astrolabe Scepter Head Crown
  const headY = -sLen * 0.48;
  const headR = radius * 0.24;

  ctx.save();
  ctx.translate(0, headY);

  // Platinum Outer Filigree Rings
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, headR, 0, Math.PI * 2);
  ctx.stroke();

  // Central Glowing Royal Sapphire Pearl
  const pearlGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, headR * 0.65);
  pearlGrad.addColorStop(0, '#ffffff');
  pearlGrad.addColorStop(0.3, '#38bdf8');
  pearlGrad.addColorStop(0.7, '#0284c7');
  pearlGrad.addColorStop(1, '#0c4a6e');

  ctx.fillStyle = pearlGrad;
  ctx.beginPath();
  ctx.arc(0, 0, headR * 0.62, 0, Math.PI * 2);
  ctx.fill();

  // 3. Three Orbiting Mini Sapphire Crystal Shards
  for (let c = 0; c < 3; c++) {
    const cAng = time * 2.5 + (c * Math.PI * 2) / 3;
    const cDist = headR * 1.55;
    const cx = Math.cos(cAng) * cDist;
    const cy = Math.sin(cAng) * (cDist * 0.45);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(cAng);

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(2.2, 0);
    ctx.lineTo(0, 3.5);
    ctx.lineTo(-2.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 4. Acoustic Emotion Shockwave (if active)
  if (emotionFieldActive) {
    const ePhase = (time * 2.5) % 1;
    ctx.strokeStyle = `rgba(56, 189, 248, ${1 - ePhase})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, headR * (1 + ePhase * 2), 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/** 7. LANZUAN (藍鑽) - 護盾光環／減速干擾 */
export function drawLanzuanFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  emotionFieldActive: boolean = false
) {
  ctx.save();
  const dR = radius * 0.58;

  // 1. WEAPON: SAPPHIRE SCEPTER & ORBITING EMOTION CRYSTALS
  drawSapphireScepterAndOrbitals(ctx, x, y, radius, time, vx, vy, emotionFieldActive);

  // 16-Facet Imperial Royal Sapphire Diamond Geometry
  drawFacetedDiamond(ctx, x, y, dR, {
    top: 'rgba(255, 255, 255, 0.7)',
    left: 'rgba(186, 230, 253, 0.52)',
    right: 'rgba(56, 189, 248, 0.42)',
    bot: 'rgba(7, 89, 133, 0.55)',
    table: 'rgba(224, 242, 254, 0.5)',
    border: '#ffffff',
    innerBorder: 'rgba(56, 189, 248, 0.95)'
  });

  // Concentric Harmonic Emotion Waves
  const waveCount = 2;
  for (let i = 0; i < waveCount; i++) {
    const phase = ((time * 0.8 + i * 0.5) % 1);
    const waveR = dR * (0.2 + phase * 0.65);
    ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, 0.7 - phase * 0.7)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, waveR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Central Sapphire Star Core
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, dR * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top-Left Diamond Specular Glint
  const glintX = x - dR * 0.25;
  const glintY = y - dR * 0.55;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(glintX, glintY, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: FENZUAN (粉鑽) - ROSE AEGIS SHIELD & MERCY CRYSTAL WAND
 * ---------------------------------------------------------------------------
 */
function drawRoseAegisAndMercyWand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  shieldActive: boolean = false
) {
  // Left: Rose Diamond Aegis Shield
  const shieldX = x - radius * 1.15;
  const shieldY = y + Math.sin(time * 2.2) * 4;
  ctx.save();
  ctx.translate(shieldX, shieldY);
  ctx.rotate(-0.15 + Math.sin(time * 1.8) * 0.08);

  const sR = radius * 0.38 + (shieldActive ? 4 : 0);

  // Faceted Translucent Pink Diamond Buckler
  const sGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, sR);
  sGrad.addColorStop(0, '#ffffff');
  sGrad.addColorStop(0.3, '#fbcfe8');
  sGrad.addColorStop(0.7, '#f472b6');
  sGrad.addColorStop(1, '#db2777');

  ctx.fillStyle = sGrad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = shieldActive ? 16 : 8;

  // Hexagonal faceted shield plate
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    const px = Math.cos(ang) * sR;
    const py = Math.sin(ang) * sR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shield Crystalline Lattice Seams
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ang) * sR, Math.sin(ang) * sR);
    ctx.stroke();
  }

  // Heart diamond boss in shield center
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right: Mercy Crystal Wand
  const wandX = x + radius * 1.15;
  const wandY = y - radius * 0.12 + Math.cos(time * 2.2) * 4;
  ctx.save();
  ctx.translate(wandX, wandY);
  ctx.rotate(0.2 + Math.sin(time * 1.8) * 0.08);

  const wLen = radius * 1.45;
  const wW = Math.max(2.8, radius * 0.08);

  // Wand Shaft (Rose Gold & Pearl)
  const wGrad = ctx.createLinearGradient(-wW * 0.5, 0, wW * 0.5, 0);
  wGrad.addColorStop(0, '#be185d');
  wGrad.addColorStop(0.35, '#f472b6');
  wGrad.addColorStop(0.7, '#fbcfe8');
  wGrad.addColorStop(1, '#ffffff');

  ctx.fillStyle = wGrad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.roundRect(-wW * 0.5, -wLen * 0.42, wW, wLen, 2);
  ctx.fill();
  ctx.stroke();

  // Wand Crown: Blooming Heart Diamond Blossom
  const bY = -wLen * 0.46;
  ctx.save();
  ctx.translate(0, bY);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 12;

  // Heart gem finial
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.bezierCurveTo(-7, -7, -11, 0, 0, 11);
  ctx.bezierCurveTo(11, 0, 7, -7, 0, 2);
  ctx.closePath();
  ctx.fill();

  // Floating love sparkle motes
  for (let p = 0; p < 2; p++) {
    const pPhase = (time * 2 + p * 0.5) % 1;
    const px = Math.sin(time * 6 + p) * 6;
    const py = -pPhase * 16;
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(px, py, (1 - pPhase) * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

/** 8. FENZUAN (粉鑽) - 輔助治療／泡泡保護 */
export function drawFenzuanFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  shieldActive: boolean = false
) {
  ctx.save();
  const dR = radius * 0.58;

  // 1. WEAPON: ROSE AEGIS SHIELD & MERCY CRYSTAL WAND
  drawRoseAegisAndMercyWand(ctx, x, y, radius, time, vx, vy, shieldActive);

  // 16-Facet Rose Pink Brilliant Diamond Geometry
  drawFacetedDiamond(ctx, x, y, dR, {
    top: 'rgba(255, 255, 255, 0.72)',
    left: 'rgba(252, 231, 243, 0.55)',
    right: 'rgba(244, 114, 182, 0.45)',
    bot: 'rgba(157, 23, 77, 0.55)',
    table: 'rgba(253, 242, 248, 0.52)',
    border: '#ffffff',
    innerBorder: 'rgba(244, 114, 182, 0.95)'
  });

  // Blooming Crystalline Lotus Heart Gem
  const heartR = dR * 0.24;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(x, y - heartR);
  ctx.lineTo(x + heartR * 0.85, y);
  ctx.lineTo(x, y + heartR);
  ctx.lineTo(x - heartR * 0.85, y);
  ctx.closePath();
  ctx.fill();

  // Gentle Pink Protective Core
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.arc(x, y, heartR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Top-Left Diamond Specular Glint
  const glintX = x - dR * 0.25;
  const glintY = y - dR * 0.55;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(glintX, glintY, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * ---------------------------------------------------------------------------
 * WEAPON SUITE: BAIZUAN (白鑽) - TWIN PRISMATIC REFRACTION MIRROR GLAIVES
 * ---------------------------------------------------------------------------
 */
function drawPrismaticMirrorGlaives(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  shiningActive: boolean = false,
  rayActive: boolean = false
) {
  const isSurge = shiningActive || rayActive;
  const orbitSpeed = isSurge ? 6.5 : 2.6;
  const orbitDist = radius * (isSurge ? 1.62 : 1.48);

  const bladePositions: { x: number; y: number }[] = [];

  for (let i = 0; i < 2; i++) {
    const dir = i === 0 ? 1 : -1;
    const bAngle = time * orbitSpeed * dir + (i === 0 ? 0 : Math.PI);
    const bx = x + Math.cos(bAngle) * orbitDist;
    const by = y + Math.sin(bAngle) * (orbitDist * 0.8);
    bladePositions.push({ x: bx, y: by });

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(bAngle + (i === 0 ? Math.PI * 0.5 : -Math.PI * 0.5));

    const gW = radius * 0.28;
    const gLen = radius * 0.82;

    // Prismatic Diamond Mirror Glaive Blade
    const glaiveGrad = ctx.createLinearGradient(-gW * 0.5, 0, gW * 0.5, 0);
    glaiveGrad.addColorStop(0, '#ffffff');
    glaiveGrad.addColorStop(0.2, '#e0f2fe');
    glaiveGrad.addColorStop(0.5, '#f1f5f9');
    glaiveGrad.addColorStop(0.8, '#fbcfe8');
    glaiveGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = glaiveGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = isSurge ? '#67e8f9' : '#ffffff';
    ctx.shadowBlur = isSurge ? 18 : 10;

    // Double-edged curved diamond crescent blade
    ctx.beginPath();
    ctx.moveTo(0, -gLen * 0.55); // Top needle tip
    ctx.bezierCurveTo(gW * 0.65, -gLen * 0.2, gW * 0.65, gLen * 0.2, 0, gLen * 0.55);
    ctx.bezierCurveTo(-gW * 0.4, gLen * 0.2, -gW * 0.4, -gLen * 0.2, 0, -gLen * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Prism Refraction Seam
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, -gLen * 0.5);
    ctx.lineTo(0, gLen * 0.5);
    ctx.stroke();

    // Starburst Glint on blade tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -gLen * 0.52, 2.0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. Dynamic Laser Refraction Chord connecting the two mirror glaives
  if (bladePositions.length === 2) {
    ctx.save();
    ctx.strokeStyle = isSurge ? 'rgba(255, 255, 255, 0.95)' : 'rgba(186, 230, 253, 0.65)';
    ctx.lineWidth = isSurge ? 2.5 : 1.2;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = isSurge ? 16 : 8;
    ctx.beginPath();
    ctx.moveTo(bladePositions[0].x, bladePositions[0].y);
    ctx.lineTo(bladePositions[1].x, bladePositions[1].y);
    ctx.stroke();
    ctx.restore();
  }
}

/** 9. BAIZUAN (白鑽) - 分身迷惑／致盲硬控 */
export function drawBaizuanFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number,
  shiningActive: boolean = false,
  rayActive: boolean = false
) {
  ctx.save();
  const dR = radius * 0.58;

  // 1. WEAPON: TWIN PRISMATIC REFRACTION MIRROR GLAIVES
  drawPrismaticMirrorGlaives(ctx, x, y, radius, time, vx, vy, shiningActive, rayActive);

  // 16-Facet Pure White Diamond Geometry with Prismatic Rainbow Hints
  drawFacetedDiamond(ctx, x, y, dR, {
    top: 'rgba(255, 255, 255, 0.85)',
    left: 'rgba(241, 245, 249, 0.65)',
    right: 'rgba(226, 232, 240, 0.55)',
    bot: 'rgba(148, 163, 184, 0.6)',
    table: 'rgba(255, 255, 255, 0.75)',
    border: '#ffffff',
    innerBorder: 'rgba(255, 255, 255, 0.95)'
  });

  // Chromatic dispersion rainbow fringes on edge
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - dR * 0.95, y);
  ctx.lineTo(x, y - dR);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
  ctx.beginPath();
  ctx.moveTo(x + dR * 0.95, y);
  ctx.lineTo(x, y + dR);
  ctx.stroke();

  // Central Supernova 8-Point Star Core
  const starCoreR = dR * 0.28;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(x, y - starCoreR);
  ctx.lineTo(x + starCoreR * 0.35, y - starCoreR * 0.35);
  ctx.lineTo(x + starCoreR, y);
  ctx.lineTo(x + starCoreR * 0.35, y + starCoreR * 0.35);
  ctx.lineTo(x, y + starCoreR);
  ctx.lineTo(x - starCoreR * 0.35, y + starCoreR * 0.35);
  ctx.lineTo(x - starCoreR, y);
  ctx.lineTo(x - starCoreR * 0.35, y - starCoreR * 0.35);
  ctx.closePath();
  ctx.fill();

  // Dual Supernova Specular Glints
  const glint1X = x - dR * 0.26;
  const glint1Y = y - dR * 0.58;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(glint1X, glint1Y, 2.8, 0, Math.PI * 2);
  ctx.fill();

  const glint2X = x + dR * 0.24;
  const glint2Y = y + dR * 0.54;
  ctx.beginPath();
  ctx.arc(glint2X, glint2Y, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 10. XUKONGSHOU (虛空獸) - 暗影突襲／撕咬位移 */
export function drawXukongshouFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  isBiting: boolean
) {
  ctx.save();

  // 1. Bioluminescent Neon-Purple Void Fissures
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 8;

  // Left forehead fissure
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.65, y - radius * 0.42);
  ctx.lineTo(x - radius * 0.4, y - radius * 0.3);
  ctx.lineTo(x - radius * 0.48, y - radius * 0.12);
  ctx.lineTo(x - radius * 0.24, y - radius * 0.04);
  ctx.stroke();

  // Right forehead fissure
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.68, y - radius * 0.38);
  ctx.lineTo(x + radius * 0.44, y - radius * 0.24);
  ctx.lineTo(x + radius * 0.54, y - radius * 0.04);
  ctx.lineTo(x + radius * 0.32, y + radius * 0.08);
  ctx.stroke();

  // 2. Dual Sinister Demonic Predator Eyes
  const eyeY = y - radius * 0.26;
  const eyeSpacing = radius * 0.32;
  const eyeW = radius * 0.18;
  const eyeH = radius * 0.1;

  for (let i = -1; i <= 1; i += 2) {
    const eyeX = x + i * eyeSpacing;
    ctx.save();
    ctx.translate(eyeX, eyeY);
    ctx.rotate(i * -0.2);

    // Glowing red-violet eye socket
    ctx.fillStyle = '#7e22ce';
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();

    // White-hot predator slit pupil
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, eyeW * 0.35, eyeH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Gaping Void Maw with Razor-Sharp 3D Fangs
  const mouthW = Math.max(4, radius * (isBiting ? 1.48 : 1.28));
  const mouthH = Math.max(2, radius * (isBiting ? 0.98 : 0.68));
  const mouthCenterY = y + radius * 0.14;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x - mouthW * 0.5, mouthCenterY);
  ctx.quadraticCurveTo(x, mouthCenterY - mouthH * 0.45, x + mouthW * 0.5, mouthCenterY);
  ctx.quadraticCurveTo(x, mouthCenterY + mouthH * 0.65, x - mouthW * 0.5, mouthCenterY);
  ctx.closePath();

  // Abyss interior
  ctx.fillStyle = '#000000';
  ctx.fill();

  const mouthCoreGrad = ctx.createRadialGradient(x, mouthCenterY, 1, x, mouthCenterY, Math.max(2, mouthW * 0.46));
  mouthCoreGrad.addColorStop(0, '#9333ea');
  mouthCoreGrad.addColorStop(0.45, 'rgba(126, 34, 206, 0.6)');
  mouthCoreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = mouthCoreGrad;
  ctx.fill();

  // Glowing Lip Border
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2.0;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 10;
  ctx.stroke();

  // Upper Fangs (5 Sharp Downward Fangs)
  const upperTeeth = 5;
  ctx.fillStyle = '#f3e8ff';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 6;
  for (let t = 0; t < upperTeeth; t++) {
    const tx = x - mouthW * 0.38 + (t * (mouthW * 0.76)) / (upperTeeth - 1);
    const topY = mouthCenterY - mouthH * 0.18;
    const toothLen = mouthH * (t === 1 || t === 3 ? 0.46 : 0.32);
    ctx.beginPath();
    ctx.moveTo(tx - 2.8, topY);
    ctx.lineTo(tx + 2.8, topY);
    ctx.lineTo(tx, topY + toothLen);
    ctx.closePath();
    ctx.fill();
  }

  // Lower Fangs (4 Upward Fangs)
  const lowerTeeth = 4;
  for (let t = 0; t < lowerTeeth; t++) {
    const tx = x - mouthW * 0.28 + (t * (mouthW * 0.56)) / (lowerTeeth - 1);
    const botY = mouthCenterY + mouthH * 0.28;
    const toothLen = mouthH * (t === 1 || t === 2 ? 0.44 : 0.30);
    ctx.beginPath();
    ctx.moveTo(tx - 2.8, botY);
    ctx.lineTo(tx + 2.8, botY);
    ctx.lineTo(tx, botY - toothLen);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#c084fc');
  ctx.restore();
}

/**
 * Draw Fan (凡) Features:
 * - Lightweight hunter sphere with dark slate gray (#334155 / #1e293b), silver-white (#e2e8f0), and golden yellow (#eab308).
 * - Meticulous hunter armor seams and golden trim facets.
 * - Golden energy core in the center with radiant glow.
 * - Orbiting silver-white particles floating gracefully around.
 * - Overclock golden speed surge aura.
 */
export function drawFanFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  fanOverclockActive: boolean = false,
  fanIsRolling: boolean = false
) {
  ctx.save();

  // 1. Hunter Armor Metallic Plating & Seams
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)'; // Silver-white seams
  ctx.lineWidth = 1.2;

  // Angular visor / sight lines
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.75, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.75, Math.PI * 0.65, Math.PI * 1.35);
  ctx.stroke();

  // Diagonal armor facets
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)'; // Gold trim
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.6, y - radius * 0.35);
  ctx.lineTo(x - radius * 0.25, y - radius * 0.55);
  ctx.lineTo(x + radius * 0.25, y - radius * 0.55);
  ctx.lineTo(x + radius * 0.6, y - radius * 0.35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - radius * 0.6, y + radius * 0.35);
  ctx.lineTo(x - radius * 0.25, y + radius * 0.55);
  ctx.lineTo(x + radius * 0.25, y + radius * 0.55);
  ctx.lineTo(x + radius * 0.6, y + radius * 0.35);
  ctx.stroke();
  ctx.restore();

  // 2. Central Golden Energy Core
  const pulseSpeed = fanOverclockActive ? 12 : 4;
  const corePulse = 0.88 + Math.sin(time * pulseSpeed) * 0.12;
  const coreRadius = Math.max(3.5, radius * 0.28 * corePulse);

  ctx.save();
  ctx.shadowColor = fanOverclockActive ? '#facc15' : '#eab308';
  ctx.shadowBlur = fanOverclockActive ? 18 : 10;

  // Outer core ring
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius + 2.5, 0, Math.PI * 2);
  ctx.stroke();

  // Core jewel gradient
  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, '#fef08a');
  coreGrad.addColorStop(0.8, '#eab308');
  coreGrad.addColorStop(1, '#ca8a04');

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
  ctx.fill();

  // Crosshair glint in core
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x - coreRadius * 0.8, y);
  ctx.lineTo(x + coreRadius * 0.8, y);
  ctx.moveTo(x, y - coreRadius * 0.8);
  ctx.lineTo(x, y + coreRadius * 0.8);
  ctx.stroke();
  ctx.restore();

  // 3. Floating Silver-White Micro-Particles orbiting around core
  ctx.save();
  const particleCount = 4;
  for (let i = 0; i < particleCount; i++) {
    const orbitR = radius * (0.52 + (i % 2) * 0.22);
    const orbitAngle = time * (1.8 + i * 0.4) * (i % 2 === 0 ? 1 : -1) + (i * Math.PI * 2) / particleCount;
    const px = x + Math.cos(orbitAngle) * orbitR;
    const py = y + Math.sin(orbitAngle) * orbitR;

    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#e2e8f0';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Overclock Visual FX
  if (fanOverclockActive) {
    ctx.save();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 3, time * 8, time * 8 + Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Rolling Foresight Silver Shimmer
  if (fanIsRolling) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#fef08a');
  ctx.restore();
}

/**
 * Draw Tunshimozu (吞噬魔族) Features:
 * - Demonic Growth Colossus: Void chitinous carapace, demonic curved crest horns, and abyssal runes.
 * - Central Demonic Void Eye: Pulsing singularity eye that contracts during devouring and glows radiantly.
 * - Dynamic Demonic Growth Veins: Intensity scales with growthStacks (0~50).
 */
export function drawTunshimozuFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  growthStacks: number = 0,
  isGluttonyBurstReady: boolean = true,
  devourImploding: boolean = false
) {
  ctx.save();

  const growthRatio = Math.min(1.0, growthStacks / 50);
  const tiers = Math.floor(growthStacks / 10);

  // 0. Demonic Gravitational Aura (魔軀威壓光環 - 每階擴展)
  if (growthStacks >= 10) {
    ctx.save();
    const auraPulse = 0.92 + Math.sin(time * 3.5) * 0.08;
    const auraR = radius * (1.12 + growthRatio * 0.38) * auraPulse;
    const auraGrad = ctx.createRadialGradient(x, y, radius * 0.7, x, y, auraR);
    auraGrad.addColorStop(0, 'rgba(88, 28, 135, 0.35)');
    auraGrad.addColorStop(0.65, `rgba(168, 85, 247, ${0.12 + growthRatio * 0.18})`);
    auraGrad.addColorStop(1, 'rgba(15, 2, 30, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y, auraR, 0, Math.PI * 2);
    ctx.fill();

    // Subtle dark distortion rings rotating around the colossus
    if (tiers >= 3) {
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.18 + growthRatio * 0.22})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.18, time * 1.5, time * 1.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // 1. Demonic Horns / Spikes on Upper Crest (scales dynamically with growth)
  const hornLength = radius * (0.38 + growthRatio * 0.42);
  ctx.save();

  // Horn Body Gradient (Obsidian to Royal Purple to Violet Peak)
  const leftHornGrad = ctx.createLinearGradient(x - radius * 0.5, y, x - radius * 0.6 - hornLength * 0.4, y - radius * 0.85 - hornLength);
  leftHornGrad.addColorStop(0, '#0f021e');
  leftHornGrad.addColorStop(0.5, '#4c1d95');
  leftHornGrad.addColorStop(1, '#c084fc');

  ctx.fillStyle = leftHornGrad;
  ctx.strokeStyle = tiers >= 4 ? '#f0abfc' : '#a855f7';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#9333ea';
  ctx.shadowBlur = 8 + growthRatio * 8;

  // Left Horn (Curved Demonic Horn)
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.62, y - radius * 0.22);
  ctx.quadraticCurveTo(x - radius * 0.88, y - radius * 0.65 - hornLength * 0.45, x - radius * 0.5 - hornLength * 0.42, y - radius * 0.85 - hornLength);
  ctx.quadraticCurveTo(x - radius * 0.38, y - radius * 0.65, x - radius * 0.28, y - radius * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Horn Body Gradient
  const rightHornGrad = ctx.createLinearGradient(x + radius * 0.5, y, x + radius * 0.6 + hornLength * 0.4, y - radius * 0.85 - hornLength);
  rightHornGrad.addColorStop(0, '#0f021e');
  rightHornGrad.addColorStop(0.5, '#4c1d95');
  rightHornGrad.addColorStop(1, '#c084fc');

  ctx.fillStyle = rightHornGrad;
  // Right Horn
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.62, y - radius * 0.22);
  ctx.quadraticCurveTo(x + radius * 0.88, y - radius * 0.65 - hornLength * 0.45, x + radius * 0.5 + hornLength * 0.42, y - radius * 0.85 - hornLength);
  ctx.quadraticCurveTo(x + radius * 0.38, y - radius * 0.65, x + radius * 0.28, y - radius * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tier 2+: Secondary Lateral Sharp Horn Spikes (第2階以上生長側角)
  if (tiers >= 2) {
    const subHornLen = hornLength * 0.45;
    ctx.fillStyle = '#2e1065';
    // Left side spike
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.72, y - radius * 0.1);
    ctx.lineTo(x - radius * 0.88 - subHornLen * 0.6, y - radius * 0.3 - subHornLen * 0.5);
    ctx.lineTo(x - radius * 0.65, y - radius * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right side spike
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.72, y - radius * 0.1);
    ctx.lineTo(x + radius * 0.88 + subHornLen * 0.6, y - radius * 0.3 - subHornLen * 0.5);
    ctx.lineTo(x + radius * 0.65, y - radius * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Tier 4+: Radiant Violet Arc between Horn Tips (第4階以上魔能電弧)
  if (tiers >= 4) {
    const tipLx = x - radius * 0.5 - hornLength * 0.42;
    const tipLy = y - radius * 0.85 - hornLength;
    const tipRx = x + radius * 0.5 + hornLength * 0.42;
    const tipRy = y - radius * 0.85 - hornLength;

    ctx.save();
    ctx.strokeStyle = '#f5d0fe';
    ctx.shadowColor = '#d946ef';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(tipLx, tipLy);
    const midArcX = x + Math.sin(time * 28) * 8;
    const midArcY = (tipLy + tipRy) / 2 - 12 + Math.cos(time * 24) * 6;
    ctx.quadraticCurveTo(midArcX, midArcY, tipRx, tipRy);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // 2. Chitinous Carapace Plates & Demonic Veins
  ctx.save();
  const veinPulse = 0.7 + Math.sin(time * 4) * 0.3;
  ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + growthRatio * 0.5 * veinPulse})`;
  ctx.lineWidth = 1.5 + growthRatio * 1.0;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 6 + growthRatio * 10;

  // Upper brow furrow
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.62, y - radius * 0.28);
  ctx.lineTo(x - radius * 0.22, y - radius * 0.14);
  ctx.lineTo(x, y - radius * 0.22);
  ctx.lineTo(x + radius * 0.22, y - radius * 0.14);
  ctx.lineTo(x + radius * 0.62, y - radius * 0.28);
  ctx.stroke();

  // Lower jaw / demonic mandible seams
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.56, y + radius * 0.28);
  ctx.lineTo(x - radius * 0.26, y + radius * 0.48);
  ctx.lineTo(x, y + radius * 0.4);
  ctx.lineTo(x + radius * 0.26, y + radius * 0.48);
  ctx.lineTo(x + radius * 0.56, y + radius * 0.28);
  ctx.stroke();

  // Additional carapace panel ribs for high tiers
  if (tiers >= 2) {
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.45, y);
    ctx.lineTo(x - radius * 0.2, y + radius * 0.16);
    ctx.moveTo(x + radius * 0.45, y);
    ctx.lineTo(x + radius * 0.2, y + radius * 0.16);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Central Demonic Void Eye (Singularity Core)
  const eyePulseSpeed = devourImploding ? 16 : isGluttonyBurstReady ? 4 : 2;
  const eyePulse = 0.88 + Math.sin(time * eyePulseSpeed) * 0.12;
  const eyeRadius = Math.max(5, radius * (0.28 + growthRatio * 0.1) * eyePulse);

  ctx.save();
  ctx.shadowColor = isGluttonyBurstReady ? '#d946ef' : '#9333ea';
  ctx.shadowBlur = isGluttonyBurstReady ? 16 : 8;

  // Eye Sclera / Demonic Void Gradient Ring
  const eyeGrad = ctx.createRadialGradient(x, y, 0, x, y, eyeRadius);
  eyeGrad.addColorStop(0, isGluttonyBurstReady ? '#fdf4ff' : '#e9d5ff');
  eyeGrad.addColorStop(0.25, '#c084fc');
  eyeGrad.addColorStop(0.65, '#7e22ce');
  eyeGrad.addColorStop(1, '#2e1065');

  ctx.fillStyle = eyeGrad;
  ctx.beginPath();
  ctx.arc(x, y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Outer Iris Ring
  ctx.strokeStyle = isGluttonyBurstReady ? '#fae8ff' : '#c084fc';
  ctx.lineWidth = isGluttonyBurstReady ? 1.8 : 1.2;
  ctx.stroke();

  // Vertical Slit Pupil (Dilates and contracts)
  ctx.fillStyle = '#0a0114';
  ctx.beginPath();
  const pupilW = eyeRadius * (devourImploding ? 0.45 : 0.26);
  const pupilH = eyeRadius * 0.84;
  ctx.ellipse(x, y, pupilW, pupilH, 0, 0, Math.PI * 2);
  ctx.fill();

  // Demonic Pupil Highlight Glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - eyeRadius * 0.18, y - eyeRadius * 0.26, Math.max(1, eyeRadius * 0.18), 0, Math.PI * 2);
  ctx.fill();

  // Inward Contraction Rays when absorbing shard
  if (devourImploding) {
    ctx.strokeStyle = 'rgba(245, 208, 254, 0.9)';
    ctx.lineWidth = 1.2;
    for (let rIdx = 0; rIdx < 6; rIdx++) {
      const rayAng = time * 14 + (rIdx * Math.PI * 2) / 6;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(rayAng) * (eyeRadius * 1.2), y + Math.sin(rayAng) * (eyeRadius * 1.2));
      ctx.lineTo(x + Math.cos(rayAng) * (eyeRadius * 0.35), y + Math.sin(rayAng) * (eyeRadius * 0.35));
      ctx.stroke();
    }
  }
  ctx.restore();

  // 4. Orbiting Demonic Void Runes (Rotating Diamond Glyphs - 2 to 6 runes)
  const runeCount = 2 + Math.min(4, tiers);
  ctx.save();

  for (let i = 0; i < runeCount; i++) {
    const angle = time * 2.2 + (i * Math.PI * 2) / runeCount;
    const orbDist = radius * 0.8;
    const rx = x + Math.cos(angle) * orbDist;
    const ry = y + Math.sin(angle) * orbDist;
    const runeSize = 2.4 + growthRatio * 1.6;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(time * 3 + i);
    ctx.fillStyle = '#f0abfc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;

    // Diamond Rune Glyph
    ctx.beginPath();
    ctx.moveTo(0, -runeSize * 1.3);
    ctx.lineTo(runeSize * 0.8, 0);
    ctx.lineTo(0, runeSize * 1.3);
    ctx.lineTo(-runeSize * 0.8, 0);
    ctx.closePath();
    ctx.fill();

    // Central core dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, runeSize * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 5. Devouring Singularity Vortex Implosion Effect (when absorbing shard)
  if (devourImploding) {
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 121, 249, 0.9)';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([4, 4]);
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.55, -time * 14, -time * 14 + Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#f0abfc');
  ctx.restore();
}

/**
 * 13. Mimi (愛心者・咪咪) - Visual Aesthetics Renderer
 * Cute 3D Feline Marksman & Heart Controller with cat ears, luminous whiskers, heart gem & claws
 */
export function drawMimiFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  clawAnimTimer: number = 0,
  lifeStacks: number = 0,
  attackStacks: number = 0
) {
  ctx.save();

  const isAttackingClaw = clawAnimTimer > 0;
  const totalStacks = lifeStacks + attackStacks;

  // 1. Cat Ears (Luminous 3D feline ears atop sphere)
  const earTwitchL = Math.sin(time * 3.2) * 0.06;
  const earTwitchR = Math.cos(time * 3.8) * 0.06;

  // Left Ear
  ctx.save();
  ctx.translate(x - radius * 0.52, y - radius * 0.65);
  ctx.rotate(-0.35 + earTwitchL);
  const leftEarGrad = ctx.createLinearGradient(0, radius * 0.4, 0, -radius * 0.45);
  leftEarGrad.addColorStop(0, '#be185d');
  leftEarGrad.addColorStop(0.5, '#ec4899');
  leftEarGrad.addColorStop(1, '#f472b6');
  ctx.fillStyle = leftEarGrad;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.28, radius * 0.3);
  ctx.quadraticCurveTo(-radius * 0.15, -radius * 0.42, 0, -radius * 0.52);
  ctx.quadraticCurveTo(radius * 0.22, -radius * 0.35, radius * 0.24, radius * 0.3);
  ctx.closePath();
  ctx.fill();

  // Inner Left Ear Fluff (Soft warm pink)
  ctx.fillStyle = '#fce7f3';
  ctx.beginPath();
  ctx.moveTo(-radius * 0.18, radius * 0.22);
  ctx.quadraticCurveTo(-radius * 0.08, -radius * 0.28, 0, -radius * 0.38);
  ctx.quadraticCurveTo(radius * 0.14, -radius * 0.22, radius * 0.16, radius * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Right Ear
  ctx.save();
  ctx.translate(x + radius * 0.52, y - radius * 0.65);
  ctx.rotate(0.35 + earTwitchR);
  const rightEarGrad = ctx.createLinearGradient(0, radius * 0.4, 0, -radius * 0.45);
  rightEarGrad.addColorStop(0, '#be185d');
  rightEarGrad.addColorStop(0.5, '#ec4899');
  rightEarGrad.addColorStop(1, '#f472b6');
  ctx.fillStyle = rightEarGrad;
  ctx.beginPath();
  ctx.moveTo(radius * 0.28, radius * 0.3);
  ctx.quadraticCurveTo(radius * 0.15, -radius * 0.42, 0, -radius * 0.52);
  ctx.quadraticCurveTo(-radius * 0.22, -radius * 0.35, -radius * 0.24, radius * 0.3);
  ctx.closePath();
  ctx.fill();

  // Inner Right Ear Fluff
  ctx.fillStyle = '#fce7f3';
  ctx.beginPath();
  ctx.moveTo(radius * 0.18, radius * 0.22);
  ctx.quadraticCurveTo(radius * 0.08, -radius * 0.28, 0, -radius * 0.38);
  ctx.quadraticCurveTo(-radius * 0.14, -radius * 0.22, -radius * 0.16, radius * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. Forehead Heart Gem Crest (Luminous Love Gem)
  ctx.save();
  const heartScale = (radius * 0.24) / 16;
  const heartPulse = 1.0 + Math.sin(time * 4) * 0.08;
  const hx = x;
  const hy = y - radius * 0.38;
  ctx.translate(hx, hy);
  ctx.scale(heartScale * heartPulse, heartScale * heartPulse);
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 12;

  const heartGrad = ctx.createLinearGradient(0, -10, 0, 10);
  heartGrad.addColorStop(0, '#ffffff');
  heartGrad.addColorStop(0.35, '#f472b6');
  heartGrad.addColorStop(1, '#db2777');
  ctx.fillStyle = heartGrad;
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(-8, -6, -14, 0, 0, 12);
  ctx.bezierCurveTo(14, 0, 8, -6, 0, 4);
  ctx.closePath();
  ctx.fill();

  // Heart Gem highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(-3, 1, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Feline Eyes (Expressive anime cat eyes with pink tint & heart glints)
  const eyeOffsetX = radius * 0.34;
  const eyeOffsetY = y - radius * 0.04;
  const eyeRadius = radius * 0.2;

  // Left Eye
  ctx.save();
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.ellipse(x - eyeOffsetX, eyeOffsetY, eyeRadius * 0.85, eyeRadius * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  // Iris gradient
  const leftIris = ctx.createLinearGradient(x - eyeOffsetX, eyeOffsetY - eyeRadius, x - eyeOffsetX, eyeOffsetY + eyeRadius);
  leftIris.addColorStop(0, '#ec4899');
  leftIris.addColorStop(1, '#f43f5e');
  ctx.fillStyle = leftIris;
  ctx.beginPath();
  ctx.ellipse(x - eyeOffsetX, eyeOffsetY, eyeRadius * 0.68, eyeRadius * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#500724';
  ctx.beginPath();
  ctx.ellipse(x - eyeOffsetX, eyeOffsetY, eyeRadius * 0.45, eyeRadius * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  // Heart-shaped highlight glint in left eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - eyeOffsetX - eyeRadius * 0.22, eyeOffsetY - eyeRadius * 0.32, eyeRadius * 0.24, 0, Math.PI * 2);
  ctx.arc(x - eyeOffsetX + eyeRadius * 0.18, eyeOffsetY + eyeRadius * 0.22, eyeRadius * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Eye
  ctx.save();
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.ellipse(x + eyeOffsetX, eyeOffsetY, eyeRadius * 0.85, eyeRadius * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  // Iris gradient
  const rightIris = ctx.createLinearGradient(x + eyeOffsetX, eyeOffsetY - eyeRadius, x + eyeOffsetX, eyeOffsetY + eyeRadius);
  rightIris.addColorStop(0, '#ec4899');
  rightIris.addColorStop(1, '#f43f5e');
  ctx.fillStyle = rightIris;
  ctx.beginPath();
  ctx.ellipse(x + eyeOffsetX, eyeOffsetY, eyeRadius * 0.68, eyeRadius * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#500724';
  ctx.beginPath();
  ctx.ellipse(x + eyeOffsetX, eyeOffsetY, eyeRadius * 0.45, eyeRadius * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();
  // Heart-shaped highlight glint in right eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + eyeOffsetX - eyeRadius * 0.22, eyeOffsetY - eyeRadius * 0.32, eyeRadius * 0.24, 0, Math.PI * 2);
  ctx.arc(x + eyeOffsetX + eyeRadius * 0.18, eyeOffsetY + eyeRadius * 0.22, eyeRadius * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Little Feline Nose & Cute Mouth ('w')
  ctx.save();
  // Tiny pink heart nose
  ctx.fillStyle = '#f472b6';
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  const noseY = y + radius * 0.2;
  ctx.moveTo(x, noseY + radius * 0.05);
  ctx.lineTo(x - radius * 0.07, noseY);
  ctx.lineTo(x + radius * 0.07, noseY);
  ctx.closePath();
  ctx.fill();

  // Cute cat 'w' mouth line
  ctx.strokeStyle = '#be185d';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Left curve
  ctx.arc(x - radius * 0.07, noseY + radius * 0.07, radius * 0.07, 0.2, Math.PI * 0.85);
  // Right curve
  ctx.arc(x + radius * 0.07, noseY + radius * 0.07, radius * 0.07, 0.15, Math.PI * 0.8);
  ctx.stroke();
  ctx.restore();

  // 5. Sleek Luminous Cat Whiskers
  ctx.save();
  ctx.strokeStyle = 'rgba(253, 242, 248, 0.85)';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 6;
  ctx.lineCap = 'round';

  const whiskerBaseY = y + radius * 0.16;
  const whiskerLen = radius * 0.52;

  // Left Whiskers (3 whiskers)
  [-0.14, 0, 0.14].forEach(pitch => {
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.44, whiskerBaseY + pitch * radius * 0.4);
    ctx.lineTo(x - radius * 0.44 - whiskerLen, whiskerBaseY + (pitch - 0.08) * radius * 0.7);
    ctx.stroke();
  });

  // Right Whiskers (3 whiskers)
  [-0.14, 0, 0.14].forEach(pitch => {
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.44, whiskerBaseY + pitch * radius * 0.4);
    ctx.lineTo(x + radius * 0.44 + whiskerLen, whiskerBaseY + (pitch - 0.08) * radius * 0.7);
    ctx.stroke();
  });
  ctx.restore();

  // 6. Dynamic Claw Slash Glow (When Mimi attacks with Cat Claw)
  if (isAttackingClaw) {
    ctx.save();
    ctx.strokeStyle = '#f43f5e';
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.4;
    for (let c = -1; c <= 1; c++) {
      ctx.beginPath();
      const slashAngle = time * 8 + c * 0.35;
      const r1 = radius * 0.9;
      const r2 = radius * 1.35;
      ctx.arc(x, y, (r1 + r2) / 2, slashAngle, slashAngle + 0.6);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 7. Mimi's Hope Orbiting Heart Motes (if stacks accumulated)
  if (totalStacks > 0) {
    const heartMoteCount = Math.min(6, 1 + Math.floor(totalStacks / 15));
    ctx.save();
    for (let i = 0; i < heartMoteCount; i++) {
      const orbAngle = time * 2.0 + (i * Math.PI * 2) / heartMoteCount;
      const orbDist = radius * 1.18;
      const ox = x + Math.cos(orbAngle) * orbDist;
      const oy = y + Math.sin(orbAngle) * orbDist;

      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(0.35, 0.35);
      ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#10b981';
      ctx.shadowColor = i % 2 === 0 ? '#f472b6' : '#34d399';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(-6, -6, -10, 0, 0, 10);
      ctx.bezierCurveTo(10, 0, 6, -6, 0, 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#f472b6');
  ctx.restore();
}

/**
 * 14. Jiandaoshou (剪刀手) - Visual Aesthetics Renderer
 * Special Scissors Hand ball: Black, white and silver sphere body with a fixed large scissor mounted on top/side,
 * glowing silver-white magical core, fine silver ambient particles, and opening scissor blades when using skills.
 */
export function drawJiandaoshouFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  snipAnimTimer: number = 0,
  coreGlowTimer: number = 0,
  isMistActive: boolean = false,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number
) {
  ctx.save();

  const speed = Math.hypot(vx, vy);

  // 1. DYNAMIC ATTACK WEAPON ORIENTATION & KINEMATICS (手持巨剪主要攻擊手段)
  // Scissor dynamically aims directly toward enemy, or along movement trajectory, or forward guard stance
  let aimAngle = -Math.PI / 4;
  if (targetX !== undefined && targetY !== undefined) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  } else if (speed > 10) {
    aimAngle = Math.atan2(vy, vx);
  } else {
    aimAngle = -0.45 + Math.sin(time * 3.2) * 0.08;
  }

  // Multi-Phase Scissor Attack Kinematics (蓄力張刃 -> 疾速突刺交錯咬合 -> 後座震顫回位)
  const isSnipping = snipAnimTimer > 0;
  const attackProgress = isSnipping ? Math.max(0, Math.min(1, 1 - (snipAnimTimer / 0.38))) : 0;

  let scissorBladeSpread = 0.12; // Neutral guard angle (~7 degrees)
  let lungeDist = 0;             // Forward lunge displacement
  let attackShake = 0;           // Impact vibration
  let crossCutIntensity = 0;     // Razor crossover flash intensity (0~1)
  let motionTrailAlpha = 0;      // Blade motion blur intensity

  if (isSnipping) {
    if (attackProgress < 0.28) {
      // Phase 1: 蓄勢張刃 (Wind-up & Flare Open)
      const t = attackProgress / 0.28;
      // Scissor coils back slightly before striking
      lungeDist = -radius * 0.25 * Math.sin(t * Math.PI);
      // Dual blades flare open dramatically (up to ~50 degrees / 0.88 rad)
      scissorBladeSpread = 0.12 + 0.76 * Math.sin(t * Math.PI * 0.5);
      motionTrailAlpha = t * 0.4;
    } else if (attackProgress < 0.68) {
      // Phase 2: 疾速突刺・雙刃交錯咬合剪斷 (Explosive Thrust & Crossover Bite)
      const t = (attackProgress - 0.28) / 0.40;
      // Powerful forward kinetic lunge towards the target (reaching +1.25x radius extension!)
      lungeDist = radius * 1.25 * Math.sin(t * Math.PI);
      // Accelerated snap shut: cubic acceleration plunging through zero to a sharp crossover bite (-0.08 rad)
      const snapCurve = Math.pow(t, 2.4);
      scissorBladeSpread = 0.88 * (1 - snapCurve) - 0.08 * Math.sin(t * Math.PI);
      // Motion blur is strongest during this snapping motion
      motionTrailAlpha = Math.sin(t * Math.PI) * 0.85;
      // Cross-cut flash erupts when blades meet and cross (t around 0.5 ~ 0.85)
      crossCutIntensity = Math.sin(Math.max(0, Math.min(1, (t - 0.3) / 0.55)) * Math.PI);
    } else {
      // Phase 3: 衝擊後座震顫與流暢回防 (Impact Recoil Shake & Elastic Settle)
      const t = (attackProgress - 0.68) / 0.32;
      // High-frequency damped elastic oscillation
      attackShake = Math.sin(t * Math.PI * 6) * (1 - t) * radius * 0.12;
      lungeDist = attackShake;
      // Blades smoothly relax from crossover back to alert guard stance
      scissorBladeSpread = -0.08 * (1 - t) + 0.12 * t;
      crossCutIntensity = (1 - t) * 0.3;
      motionTrailAlpha = (1 - t) * 0.2;
    }
  } else {
    // Idle subtle breathing motion
    scissorBladeSpread = 0.12 + Math.sin(time * 3.5) * 0.02;
  }

  // Hand / weapon side mount placement (positioned beside the sphere's hand flank)
  const handOffsetAngle = aimAngle + Math.PI * 0.36;
  const handDist = radius * 0.76;
  const handX = x + Math.cos(handOffsetAngle) * handDist;
  const handY = y + Math.sin(handOffsetAngle) * handDist;

  // Lunge position along attack aim vector
  const mountX = handX + Math.cos(aimAngle) * lungeDist;
  const mountY = handY + Math.sin(aimAngle) * lungeDist;

  // 1a. ARTICULATED GAUNTLET / HAND CLASP (手邊機械護腕與突刺連桿結構)
  ctx.save();
  ctx.translate(handX, handY);
  ctx.rotate(aimAngle);

  // Mechanical forearm / extension piston to weapon mount
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.3, 0);
  ctx.lineTo(lungeDist * 0.6, 0);
  ctx.stroke();

  // Internal pneumatic / magic piston rod (silver-white extension shaft)
  if (lungeDist > 0) {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(lungeDist * 0.9, 0);
    ctx.stroke();
  }

  // Silver gauntlet ring clasp
  const gauntletGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 0.24);
  gauntletGrad.addColorStop(0, '#f8fafc');
  gauntletGrad.addColorStop(0.5, '#94a3b8');
  gauntletGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = gauntletGrad;
  ctx.shadowColor = '#cbd5e1';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.19, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Gauntlet core gem (pulses brilliantly during attack)
  ctx.fillStyle = isMistActive ? '#ffffff' : (isSnipping ? '#fef08a' : '#e2e8f0');
  ctx.shadowColor = isSnipping ? '#fef08a' : '#ffffff';
  ctx.shadowBlur = isMistActive || isSnipping ? 12 : 4;
  ctx.beginPath();
  ctx.arc(0, 0, radius * (isSnipping ? 0.10 : 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 1b. MAGICAL CONDUIT LINE (從中央核心流向手邊剪刀的能量光脈)
  ctx.save();
  ctx.strokeStyle = isMistActive || isSnipping ? 'rgba(254, 240, 138, 0.85)' : 'rgba(226, 232, 240, 0.45)';
  ctx.lineWidth = isSnipping ? 2.4 : 1.6;
  ctx.shadowColor = isSnipping ? '#fef08a' : '#ffffff';
  ctx.shadowBlur = isSnipping ? 10 : 6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const midPulse = Math.sin(time * 6) * (isSnipping ? 6 : 3);
  ctx.quadraticCurveTo((x + mountX) * 0.5 + Math.cos(time * 4) * midPulse, (y + mountY) * 0.5 + Math.sin(time * 4) * midPulse, mountX, mountY);
  ctx.stroke();
  ctx.restore();

  // 1c. THE LETHAL SCISSORS WEAPON (身側手持的大型剪刀攻擊武器)
  ctx.save();
  ctx.translate(mountX, mountY);
  // Rotate so scissor blades point along aimAngle
  ctx.rotate(aimAngle - Math.PI / 2);

  const pivotRadius = radius * 0.25;
  const bladeLen = radius * 2.05;
  const bladeBaseW = radius * 0.30;

  // 1c-1. DYNAMIC BLADE MOTION BLUR TRAILS (高速揮砍殘影扇面)
  if (motionTrailAlpha > 0.05) {
    ctx.save();
    // Swept ghost arc wedge between open spread and current blade spread
    const trailGradA = ctx.createRadialGradient(0, 0, bladeLen * 0.3, 0, 0, bladeLen);
    trailGradA.addColorStop(0, `rgba(255, 255, 255, 0)`);
    trailGradA.addColorStop(0.6, `rgba(241, 245, 249, ${motionTrailAlpha * 0.35})`);
    trailGradA.addColorStop(1, `rgba(255, 255, 255, ${motionTrailAlpha * 0.65})`);

    ctx.fillStyle = trailGradA;
    // Left blade sweep fan
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, bladeLen, -Math.PI / 2 - 0.88, -Math.PI / 2 - scissorBladeSpread);
    ctx.closePath();
    ctx.fill();

    // Right blade sweep fan
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, bladeLen, -Math.PI / 2 + scissorBladeSpread, -Math.PI / 2 + 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Scissor handle / finger loops (gothic silver loops gripped by gauntlet)
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.8;
  ctx.shadowColor = isMistActive || isSnipping ? '#f8fafc' : 'rgba(148, 163, 184, 0.6)';
  ctx.shadowBlur = isMistActive || isSnipping ? 10 : 4;

  // Left loop
  ctx.beginPath();
  ctx.ellipse(-radius * 0.28, radius * 0.40, radius * 0.19, radius * 0.30, -0.28, 0, Math.PI * 2);
  ctx.stroke();

  // Right loop
  ctx.beginPath();
  ctx.ellipse(radius * 0.15, radius * 0.46, radius * 0.19, radius * 0.30, 0.28, 0, Math.PI * 2);
  ctx.stroke();

  // Inner loop gold filigree accents
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.ellipse(-radius * 0.28, radius * 0.40, radius * 0.11, radius * 0.20, -0.28, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.15, radius * 0.46, radius * 0.11, radius * 0.20, 0.28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 1c-2. BLADE A (Left Blade)
  ctx.save();
  ctx.rotate(-scissorBladeSpread);

  const bladeGradA = ctx.createLinearGradient(0, 0, -radius * 0.22, -bladeLen);
  bladeGradA.addColorStop(0, '#334155');
  bladeGradA.addColorStop(0.2, '#64748b');
  bladeGradA.addColorStop(0.55, '#cbd5e1');
  bladeGradA.addColorStop(0.85, '#f8fafc');
  bladeGradA.addColorStop(1, '#ffffff');

  ctx.fillStyle = bladeGradA;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.3;
  if (isMistActive || isSnipping) {
    ctx.shadowColor = isSnipping ? '#fef08a' : '#ffffff';
    ctx.shadowBlur = isSnipping ? 16 : 10;
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-bladeBaseW, -radius * 0.3);
  ctx.quadraticCurveTo(-bladeBaseW * 0.95, -bladeLen * 0.72, -1, -bladeLen);
  ctx.lineTo(bladeBaseW * 0.24, -radius * 0.52);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Razor cutting edge bevel highlight (hyper-reflective white)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.2);
  ctx.lineTo(-1, -bladeLen);
  ctx.stroke();

  // Inlaid fuller groove with golden holy script
  ctx.strokeStyle = isSnipping ? '#fef08a' : 'rgba(226, 232, 240, 0.85)';
  ctx.lineWidth = isSnipping ? 1.2 : 0.8;
  ctx.beginPath();
  ctx.moveTo(-bladeBaseW * 0.4, -radius * 0.4);
  ctx.lineTo(-bladeBaseW * 0.28, -bladeLen * 0.68);
  ctx.stroke();

  // Edge glint travelling along blade during attack windup
  if (isSnipping && attackProgress < 0.35) {
    const glintY = -radius * 0.3 - (bladeLen - radius * 0.3) * (attackProgress / 0.35);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-1, glintY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 1c-3. BLADE B (Right Blade)
  ctx.save();
  ctx.rotate(scissorBladeSpread);

  const bladeGradB = ctx.createLinearGradient(0, 0, radius * 0.22, -bladeLen);
  bladeGradB.addColorStop(0, '#1e293b');
  bladeGradB.addColorStop(0.2, '#475569');
  bladeGradB.addColorStop(0.55, '#cbd5e1');
  bladeGradB.addColorStop(0.85, '#f8fafc');
  bladeGradB.addColorStop(1, '#ffffff');

  ctx.fillStyle = bladeGradB;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.3;
  if (isMistActive || isSnipping) {
    ctx.shadowColor = isSnipping ? '#fef08a' : '#ffffff';
    ctx.shadowBlur = isSnipping ? 16 : 10;
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(bladeBaseW, -radius * 0.3);
  ctx.quadraticCurveTo(bladeBaseW * 0.95, -bladeLen * 0.72, 1, -bladeLen);
  ctx.lineTo(-bladeBaseW * 0.24, -radius * 0.52);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Razor cutting edge bevel highlight
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.2);
  ctx.lineTo(1, -bladeLen);
  ctx.stroke();

  // Inlaid fuller groove
  ctx.strokeStyle = isSnipping ? '#fef08a' : 'rgba(226, 232, 240, 0.85)';
  ctx.lineWidth = isSnipping ? 1.2 : 0.8;
  ctx.beginPath();
  ctx.moveTo(bladeBaseW * 0.4, -radius * 0.4);
  ctx.lineTo(bladeBaseW * 0.28, -bladeLen * 0.68);
  ctx.stroke();

  // Glint on Blade B
  if (isSnipping && attackProgress < 0.35) {
    const glintY = -radius * 0.3 - (bladeLen - radius * 0.3) * (attackProgress / 0.35);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(1, glintY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 1c-4. SNIP ATTACK DYNAMIC CUTTING SLASH ARCS & CROSS-CUT FLARE (剪切攻擊時的弧光與交會爆光)
  if (crossCutIntensity > 0.05) {
    ctx.save();
    // 1. Dual converging blade tip crescent light ribbons
    const arcRadius = bladeLen * 1.04;
    ctx.strokeStyle = `rgba(255, 255, 255, ${crossCutIntensity * 0.95})`;
    ctx.lineWidth = 3.2;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, arcRadius, -Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45);
    ctx.stroke();

    // Golden inner razor contour arc
    ctx.strokeStyle = `rgba(254, 240, 138, ${crossCutIntensity * 0.9})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, arcRadius - 2, -Math.PI / 2 - 0.35, -Math.PI / 2 + 0.35);
    ctx.stroke();

    // 2. High-intensity cross-cut razor flare at tip intersection point
    const tipCutX = 0;
    const tipCutY = -bladeLen;
    const cutFlareR = radius * 0.48 * crossCutIntensity;

    const flareGrad = ctx.createRadialGradient(tipCutX, tipCutY, 0, tipCutX, tipCutY, cutFlareR);
    flareGrad.addColorStop(0, '#ffffff');
    flareGrad.addColorStop(0.35, '#fef08a');
    flareGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.4)');
    flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(tipCutX, tipCutY, cutFlareR, 0, Math.PI * 2);
    ctx.fill();

    // 3. 4-pointed radiant razor starburst beam at intersection
    const starLen = radius * 0.75 * crossCutIntensity;
    ctx.strokeStyle = `rgba(255, 255, 255, ${crossCutIntensity})`;
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    // Horizontal cross ray
    ctx.moveTo(tipCutX - starLen, tipCutY);
    ctx.lineTo(tipCutX + starLen, tipCutY);
    // Vertical ray along cutting vector
    ctx.moveTo(tipCutX, tipCutY - starLen * 0.6);
    ctx.lineTo(tipCutX, tipCutY + starLen * 0.6);
    ctx.stroke();

    // Diagonal razor shear incision rays
    ctx.strokeStyle = `rgba(254, 240, 138, ${crossCutIntensity * 0.85})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tipCutX - starLen * 0.7, tipCutY - starLen * 0.4);
    ctx.lineTo(tipCutX + starLen * 0.7, tipCutY + starLen * 0.4);
    ctx.moveTo(tipCutX - starLen * 0.7, tipCutY + starLen * 0.4);
    ctx.lineTo(tipCutX + starLen * 0.7, tipCutY - starLen * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  // 1c-5. GOLDEN PIVOT RIVET (Center Hinge with concentric filigree & power core)
  ctx.save();
  const rivetGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, pivotRadius);
  rivetGrad.addColorStop(0, '#fef9c3');
  rivetGrad.addColorStop(0.4, '#fde047');
  rivetGrad.addColorStop(0.8, '#eab308');
  rivetGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = rivetGrad;
  ctx.shadowColor = isSnipping ? '#fde047' : '#fbbf24';
  ctx.shadowBlur = isSnipping ? 14 : 8;
  ctx.beginPath();
  ctx.arc(0, 0, pivotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Engraved concentric gold ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(0, 0, pivotRadius * 0.65, 0, Math.PI * 2);
  ctx.stroke();

  // Central radiant crystal diamond
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, pivotRadius * (isSnipping ? 0.42 : 0.35), 0, Math.PI * 2);
  ctx.fill();

  // Hinge star flash during cross-cut
  if (crossCutIntensity > 0.2) {
    ctx.strokeStyle = `rgba(254, 240, 138, ${crossCutIntensity})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-pivotRadius * 1.6, 0);
    ctx.lineTo(pivotRadius * 1.6, 0);
    ctx.moveTo(0, -pivotRadius * 1.6);
    ctx.lineTo(0, pivotRadius * 1.6);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore(); // Restore scissor mount

  // 2. BALL BODY GOTHIC SILVER-BLACK OVERLAY & MAGICAL CONTOURS
  ctx.save();
  const rimGrad = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius);
  rimGrad.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
  rimGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.45)');
  rimGrad.addColorStop(1, 'rgba(226, 232, 240, 0.6)');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Delicate silver celestial contour curves
  ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 0.85, radius * 0.45, time * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. CENTRAL SILVER-WHITE MAGICAL CORE (中央有銀白色魔法核心)
  ctx.save();
  const isCoreFlashing = coreGlowTimer > 0;
  const corePulse = 1.0 + Math.sin(time * 5) * 0.12 + (isCoreFlashing ? 0.35 : 0);
  const coreR = radius * 0.32 * corePulse;

  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, coreR);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.35, isCoreFlashing ? '#fef08a' : '#f8fafc');
  coreGrad.addColorStop(0.7, '#cbd5e1');
  coreGrad.addColorStop(1, 'rgba(203, 213, 225, 0)');

  ctx.fillStyle = coreGrad;
  ctx.shadowColor = isCoreFlashing ? '#fef08a' : (isMistActive ? '#ffffff' : '#e2e8f0');
  ctx.shadowBlur = isCoreFlashing ? 22 : 12;
  ctx.beginPath();
  ctx.arc(x, y, coreR, 0, Math.PI * 2);
  ctx.fill();

  // 4-pointed diamond star sparkle inside the core
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 0.8);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const starSize = coreR * 0.85;
  ctx.moveTo(0, -starSize);
  ctx.quadraticCurveTo(0, 0, starSize, 0);
  ctx.quadraticCurveTo(0, 0, 0, starSize);
  ctx.quadraticCurveTo(0, 0, -starSize, 0);
  ctx.quadraticCurveTo(0, 0, 0, -starSize);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // 4. ORBITING FINE SILVER PARTICLES (核心周圍有細小銀色粒子)
  ctx.save();
  const particleCount = 5;
  for (let i = 0; i < particleCount; i++) {
    const angle = time * 2.2 + (i * Math.PI * 2) / particleCount;
    const orbDist = radius * 0.55 + Math.sin(time * 3 + i) * 3;
    const px = x + Math.cos(angle) * orbDist;
    const py = y + Math.sin(angle) * orbDist * 0.7; // elliptical orbit
    const pSize = 1.2 + Math.sin(time * 4 + i) * 0.5;

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#e2e8f0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 5. MIST CENTER RADIANCE (剪刀手位於霧中心時，剪刀與球體產生銀白色光芒)
  if (isMistActive) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#f8fafc');
  ctx.restore();
}

/**
 * 蒂納 (Dina) 專屬外觀特徵與【三相光環】武器渲染
 * - 武器｜三相光環:
 *   1. 白光 (銀白色)
 *   2. 暗光 (黑紫色)
 *   3. 融合光 (黑白交錯)
 *   三道光平時環繞蒂納旋轉，光刃屬於技能視覺系統，不具有獨立碰撞體積
 * - 核心光暗雙極天體球 (銀白與黑紫太極流線交融)
 * - 中央光暗星稜鏡水晶
 * - 完美吸收 (perfectAbsorb) 金紫神聖共振光環
 * - 核心之力 (corePower) 位移銀藍氣流光暈
 */
export function drawDinaFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  haloRotationAngle: number = 0,
  darkLightState: string = 'EMPTY',
  perfectAbsorb: boolean = false,
  corePowerActive: boolean = false,
  availableWhiteCount: number = 0
) {
  ctx.save();

  // 0. 核心之力啟動時的位移推進氣浪 (Displacement Aura)
  if (corePowerActive) {
    ctx.save();
    const pulse = 1.0 + Math.sin(time * 12) * 0.15;
    ctx.strokeStyle = 'rgba(224, 231, 255, 0.7)';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.85 * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(165, 180, 252, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 1. 光暗雙極天體球體內部紋理 (Light & Dark Duality Hemisphere Split)
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
  ctx.clip();

  // 暗極底色 (Deep Void Dark Indigo)
  const darkHemisphere = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  darkHemisphere.addColorStop(0, '#1e1b4b');
  darkHemisphere.addColorStop(0.5, '#0f172a');
  darkHemisphere.addColorStop(1, '#020617');
  ctx.fillStyle = darkHemisphere;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

  // 光極半月弧形 (Radiant Light Crescent)
  ctx.save();
  const lightHemisphere = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  lightHemisphere.addColorStop(0, '#ffffff');
  lightHemisphere.addColorStop(0.6, '#e2e8f0');
  lightHemisphere.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = lightHemisphere;

  ctx.beginPath();
  // S-Curve yin-yang fluid boundary
  ctx.moveTo(x, y - radius);
  ctx.bezierCurveTo(x - radius * 0.55, y - radius * 0.5, x - radius * 0.55, y + radius * 0.5, x, y + radius);
  ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI * 1.5, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 光暗交界能量紫光流線 (Prismatic energy seam)
  ctx.save();
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.bezierCurveTo(x - radius * 0.55, y - radius * 0.5, x - radius * 0.55, y + radius * 0.5, x, y + radius);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // end clip

  // 2. 雙眸 (Serene Celestial Eyes: Left eye radiant starlight, Right eye abyssal violet)
  const eyeOffset = radius * 0.28;
  const eyeY = y - radius * 0.05;

  // 左眼 (光之眼 - Radiant Silver Light)
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x - eyeOffset, eyeY, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(x - eyeOffset, eyeY, radius * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 右眼 (暗之眼 - Abyssal Violet Dark)
  ctx.save();
  ctx.fillStyle = '#c084fc';
  ctx.shadowColor = '#7e22ce';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x + eyeOffset, eyeY, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + eyeOffset, eyeY, radius * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. 中央光暗稜鏡水晶徽記 (Central Star Prism Gem)
  ctx.save();
  ctx.translate(x, y - radius * 0.35);
  const gemSize = radius * 0.18;
  const prismGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, gemSize);
  prismGrad.addColorStop(0, '#ffffff');
  prismGrad.addColorStop(0.5, '#c084fc');
  prismGrad.addColorStop(1, '#581c87');
  ctx.fillStyle = prismGrad;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, -gemSize);
  ctx.lineTo(gemSize * 0.7, 0);
  ctx.lineTo(0, gemSize);
  ctx.lineTo(-gemSize * 0.7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. 武器｜三相光環 (Tri-Phase Halo: White, Dark, and Fusion Light Blades)
  // 平時環繞蒂納旋轉，不具有獨立碰撞體積
  ctx.save();
  const baseAngle = haloRotationAngle || (time * 2.2);
  const haloDist = radius * 1.62;

  // 完美吸收狀態下的金紫共振環 (Perfect Absorb Cosmic Resonance Ring)
  if (perfectAbsorb) {
    ctx.save();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(x, y, haloDist, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 4.1 白光刃 (White Light Blade: 銀白色)
  const angle1 = baseAngle;
  const bx1 = x + Math.cos(angle1) * haloDist;
  const by1 = y + Math.sin(angle1) * haloDist;
  ctx.save();
  ctx.translate(bx1, by1);
  ctx.rotate(angle1 + Math.PI * 0.5);
  // 銀白羽翼光刃
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 12;
  const whiteBladeGrad = ctx.createLinearGradient(-4, -10, 4, 10);
  whiteBladeGrad.addColorStop(0, '#ffffff');
  whiteBladeGrad.addColorStop(0.5, '#e0e7ff');
  whiteBladeGrad.addColorStop(1, '#c7d2fe');
  ctx.fillStyle = whiteBladeGrad;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(5, -2, 0, 11);
  ctx.quadraticCurveTo(-1.5, 0, 0, -11);
  ctx.fill();
  // 核心星芒
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4.2 暗光刃 (Dark Light Blade: 黑紫色)
  const angle2 = baseAngle + (Math.PI * 2) / 3;
  const bx2 = x + Math.cos(angle2) * haloDist;
  const by2 = y + Math.sin(angle2) * haloDist;
  ctx.save();
  ctx.translate(bx2, by2);
  ctx.rotate(angle2 + Math.PI * 0.5);
  // 黑紫深淵弧刃
  const isDarkReady = darkLightState === 'READY' || darkLightState === 'CHARGING';
  ctx.shadowColor = isDarkReady ? '#d946ef' : '#7e22ce';
  ctx.shadowBlur = isDarkReady ? 16 : 10;
  const darkBladeGrad = ctx.createLinearGradient(-4, -10, 4, 10);
  darkBladeGrad.addColorStop(0, '#c084fc');
  darkBladeGrad.addColorStop(0.4, '#581c87');
  darkBladeGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = darkBladeGrad;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(5, -2, 0, 11);
  ctx.quadraticCurveTo(-1.5, 0, 0, -11);
  ctx.fill();
  // 暗極黑洞微核
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, 0, 2.0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  // 4.3 融合光刃 (Fusion Light Blade: 黑白交錯)
  const angle3 = baseAngle + (Math.PI * 4) / 3;
  const bx3 = x + Math.cos(angle3) * haloDist;
  const by3 = y + Math.sin(angle3) * haloDist;
  ctx.save();
  ctx.translate(bx3, by3);
  ctx.rotate(angle3 + Math.PI * 0.5);
  // 黑白交錯螺旋雙刃 (Black and White Intertwined)
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 12;
  // 白翼側
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(4, -2, 0, 11);
  ctx.lineTo(0, -11);
  ctx.fill();
  // 黑紫側
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(-4, 2, 0, 11);
  ctx.lineTo(0, -11);
  ctx.fill();
  // 雙極融合星環
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // end halo save

  // 5. 飄逸星屑微粒 (Orbiting Starlight Sparkles)
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const pAng = time * 1.5 + (i * Math.PI * 2) / 3;
    const pDist = radius * 1.25 + Math.sin(time * 3 + i) * 3;
    const px = x + Math.cos(pAng) * pDist;
    const py = y + Math.sin(pAng) * pDist;
    ctx.fillStyle = i === 0 ? '#ffffff' : i === 1 ? '#c084fc' : '#e0e7ff';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, py, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Unified 3D Specular Highlight
  drawStandardSpecularGlint(ctx, x, y, radius, '#f8fafc');
  ctx.restore();
}

/**
 * 輔助繪製仙靈白劍模型
 */
function drawCelestialImmortalSword(
  ctx: CanvasRenderingContext2D,
  length: number,
  width: number,
  glowColor: string = '#38bdf8',
  isGrandArray: boolean = false
) {
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = isGrandArray ? 14 : 8;

  // 劍刃主體 (兩側對稱雙刃)
  const halfW = width * 0.5;
  const tipL = length * 0.75;
  const hiltL = length * 0.25;

  // 劍刃漸層 (純白中透冰藍仙光)
  const bladeGrad = ctx.createLinearGradient(-halfW, 0, halfW, 0);
  bladeGrad.addColorStop(0, '#e0f2fe');
  bladeGrad.addColorStop(0.5, '#ffffff');
  bladeGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = bladeGrad;

  ctx.beginPath();
  ctx.moveTo(0, tipL); // 劍尖
  ctx.lineTo(halfW, 0); // 劍刃右緣
  ctx.lineTo(halfW * 0.7, -hiltL * 0.2);
  ctx.lineTo(-halfW * 0.7, -hiltL * 0.2);
  ctx.lineTo(-halfW, 0); // 劍刃左緣
  ctx.closePath();
  ctx.fill();

  // 劍脊中線光華 (Ridge Line)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = isGrandArray ? 1.4 : 0.8;
  ctx.beginPath();
  ctx.moveTo(0, tipL - 2);
  ctx.lineTo(0, -hiltL * 0.2);
  ctx.stroke();

  // 劍格 (護手 Crossguard)
  const guardW = width * 1.5;
  const guardGrad = ctx.createLinearGradient(-guardW, 0, guardW, 0);
  guardGrad.addColorStop(0, '#0284c7');
  guardGrad.addColorStop(0.5, '#38bdf8');
  guardGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = guardGrad;
  ctx.beginPath();
  ctx.roundRect(-guardW * 0.5, -hiltL * 0.28, guardW, halfW * 0.9, 2);
  ctx.fill();

  // 護手核心寶石 (Gemstone)
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.arc(0, -hiltL * 0.24, halfW * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-0.5, -hiltL * 0.24 - 0.5, halfW * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 劍柄 (Hilt Grip)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-halfW * 0.35, -hiltL, halfW * 0.7, hiltL * 0.75);

  // 劍首 (Pommel)
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, -hiltL, halfW * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // 劍穗微光 (Tassel Glow)
  if (isGrandArray) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -hiltL);
    ctx.quadraticCurveTo(halfW, -hiltL - 6, 0, -hiltL - 10);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 〈劍仙〉專屬外觀特徵渲染
 * - 仙靈白玉球體與劍意道紋
 * - 武器｜仙靈白劍：三把白色仙劍常態環繞球體旋轉運轉
 * - 被動三｜百萬劍陣：三把大型仙劍身後扇形威武排列，綻放劍陣神輝
 * - 被動二｜退劍緩行：仙靈位移殘影與縹緲劍氣
 */
export function drawJianxianFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  orbitAngle: number = 0,
  arrayActive: boolean = false,
  arrayDuration: number = 0,
  retreatTimer: number = 0,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();

  // 1. 退劍位移殘影 (Retreat displacement ethereal afterimage)
  if (retreatTimer > 0) {
    ctx.save();
    const alpha = Math.min(1.0, retreatTimer / 0.35);
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.5 * alpha})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // 仙靈羽化霧氣擴散環
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 2. 球體內部道家仙紋與白玉劍魄 (Inner Sphere Celestial Texture)
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius - 0.5, 0, Math.PI * 2);
  ctx.clip();

  // 底色：純白玉髓漸層
  const jadeGrad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
  jadeGrad.addColorStop(0, '#ffffff');
  jadeGrad.addColorStop(0.5, '#f0f9ff');
  jadeGrad.addColorStop(0.85, '#e0f2fe');
  jadeGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = jadeGrad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

  // 旋轉太極劍道流光紋 (Rotating sword intent swirls)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 0.8);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 1.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.62, Math.PI, Math.PI * 2.2);
  ctx.stroke();

  // 中央八角劍心晶魄 (Eight-point Celestial Sword Heart)
  const coreR = radius * 0.38;
  const heartGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
  heartGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  heartGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.8)');
  heartGrad.addColorStop(1, 'rgba(2, 132, 199, 0.2)');
  ctx.fillStyle = heartGrad;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    const dist = i % 2 === 0 ? coreR : coreR * 0.45;
    const px = Math.cos(ang) * dist;
    const py = Math.sin(ang) * dist;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // 劍眼中心純藍靈石
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore(); // end clip

  // 3. 武器與技能視覺呈現
  if (arrayActive) {
    // ==========================================
    // 百萬劍陣模式 (Passive 3: Million Sword Array)
    // 三把大型仙劍身後扇形跟隨護體，綻放劍陣神輝
    // ==========================================
    const facingAngle = Math.hypot(vx, vy) > 20 ? Math.atan2(vy, vx) : (time * 0.5);
    const behindAngle = facingAngle + Math.PI;

    // 劍陣八卦符文底座 (Ground Runic Ring)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 1.2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.85, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 身後三把大型仙劍 (左、中、右)
    const swordAngles = [-0.38, 0, 0.38];
    const swordOffsets = [radius * 1.45, radius * 1.6, radius * 1.45];
    const swordScales = [0.95, 1.1, 0.95];

    for (let i = 0; i < 3; i++) {
      const angleOffset = swordAngles[i];
      const dist = swordOffsets[i];
      const swordCenterAngle = behindAngle + angleOffset;
      const sx = x + Math.cos(swordCenterAngle) * dist;
      const sy = y + Math.sin(swordCenterAngle) * dist;

      ctx.save();
      ctx.translate(sx, sy);
      // 劍尖指向前方 (facingAngle 方向)
      ctx.rotate(facingAngle - Math.PI * 0.5 + angleOffset * 0.35);

      // 大型仙劍繪製
      const swordLen = (radius * 1.35) * swordScales[i];
      const swordW = (radius * 0.45) * swordScales[i];
      drawCelestialImmortalSword(ctx, swordLen, swordW, '#0ea5e9', true);

      // 劍陣能量光暈微粒
      const pPulse = 0.5 + Math.sin(time * 8 + i * 2) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pPulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(0, swordLen * 0.5, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  } else {
    // ==========================================
    // 常態模式：三把仙靈白劍環繞球體旋轉運轉
    // ==========================================
    const orbitDist = radius * 1.58;
    for (let i = 0; i < 3; i++) {
      const swordAngle = orbitAngle + (i * Math.PI * 2) / 3;
      const sx = x + Math.cos(swordAngle) * orbitDist;
      const sy = y + Math.sin(swordAngle) * orbitDist;

      ctx.save();
      ctx.translate(sx, sy);
      // 沿軌道切線稍微偏向外側，仙姿飄逸
      ctx.rotate(swordAngle + Math.PI * 0.5 + 0.25);

      const swordLen = radius * 0.95;
      const swordW = radius * 0.32;
      drawCelestialImmortalSword(ctx, swordLen, swordW, '#38bdf8', false);

      // 劍尖軌跡星芒 (Trailing sword tip star)
      const tipDist = swordLen * 0.7;
      const tx = Math.cos(swordAngle) * tipDist;
      const ty = Math.sin(swordAngle) * tipDist;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tx * 0.2, ty * 0.2, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // 4. 周圍微小仙靈劍意星屑 (Floating sword sparkles)
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const pAng = time * 2.0 + (i * Math.PI * 2) / 3;
    const pDist = radius * 1.28 + Math.sin(time * 4 + i) * 2;
    const px = x + Math.cos(pAng) * pDist;
    const py = y + Math.sin(pAng) * pDist;
    ctx.fillStyle = i === 0 ? '#ffffff' : '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(px, py, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 5. 統一 3D 球體高光
  drawStandardSpecularGlint(ctx, x, y, radius, '#ffffff');
  ctx.restore();
}

/**
 * 龍神 (Longshen) 專屬特徵繪製
 * 武器／特徵｜龍神之軀
 * 龍神以球體型態戰鬥，技能發動時出現龍角、龍鱗、龍翼與火焰能量。變身期間完整化為飛行龍形。
 */
export function drawLongshenFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  formActive: boolean = false,
  formDuration: number = 0,
  swoopActive: boolean = false,
  strikeAnimTimer: number = 0,
  flameActive: boolean = false,
  flameAngle: number = 0,
  wingPhase: number = 0,
  vx: number = 0,
  vy: number = 0,
  targetX?: number,
  targetY?: number
) {
  ctx.save();

  // 計算面向角度：優先根據運動速度，其次根據目標座標
  const speed = Math.hypot(vx, vy);
  let facingAngle = 0;
  if (speed > 12) {
    facingAngle = Math.atan2(vy, vx);
  } else if (targetX !== undefined && targetY !== undefined) {
    facingAngle = Math.atan2(targetY - y, targetX - x);
  } else {
    facingAngle = -Math.PI * 0.25;
  }

  if (formActive) {
    // =========================================================================
    // 【變身模式】完整化為翺翔飛行東方神龍真形 (Flying Dragon Divine Form)
    // =========================================================================
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(facingAngle);

    const flapAngle = Math.sin((wingPhase || time * 12)) * 0.38;
    const bodyWave = Math.sin(time * 9);

    // 1. 蜿蜒神龍身軀 (Sinuous Articulated Dragon Body Segments)
    const segmentCount = 6;
    const bodyPoints: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i <= segmentCount; i++) {
      const segT = i / segmentCount;
      const segX = -i * (radius * 0.72);
      const segY = Math.sin(time * 8 - i * 0.85) * (radius * 0.32);
      const segR = radius * (1.05 - segT * 0.65);
      bodyPoints.push({ x: segX, y: segY, r: segR });
    }

    // 1.1 龍尾赤焰翎鬃 (Dragon Tail Flaming Fin)
    const tailPt = bodyPoints[segmentCount];
    ctx.save();
    ctx.translate(tailPt.x, tailPt.y);
    const tailWave = Math.sin(time * 11) * 0.25;
    ctx.rotate(tailWave);

    const tailGrad = ctx.createLinearGradient(0, 0, -radius * 1.4, 0);
    tailGrad.addColorStop(0, '#f59e0b');
    tailGrad.addColorStop(0.4, '#dc2626');
    tailGrad.addColorStop(0.8, '#fef08a');
    tailGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = tailGrad;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;

    // 三束烈焰尾鬃
    ctx.beginPath();
    ctx.moveTo(0, -tailPt.r * 0.5);
    ctx.quadraticCurveTo(-radius * 0.8, -tailPt.r * 1.6, -radius * 1.4, 0);
    ctx.quadraticCurveTo(-radius * 0.8, tailPt.r * 1.6, 0, tailPt.r * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 1.2 連接身軀各節（金紅龍鱗與金色腹甲）
    for (let i = segmentCount - 1; i >= 0; i--) {
      const pt1 = bodyPoints[i + 1];
      const pt0 = bodyPoints[i];
      const midX = (pt0.x + pt1.x) / 2;
      const midY = (pt0.y + pt1.y) / 2;

      // 龍軀背棘鬃毛 (Dorsal Spine Fins)
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(midX, midY - pt0.r * 0.85);
      ctx.lineTo(midX - radius * 0.2, midY - pt0.r * 1.45);
      ctx.lineTo(midX - radius * 0.35, midY - pt0.r * 0.7);
      ctx.closePath();
      ctx.fill();

      // 龍軀體節
      const segGrad = ctx.createRadialGradient(pt0.x, pt0.y, 0, pt0.x, pt0.y, pt0.r);
      segGrad.addColorStop(0, '#fef08a');
      segGrad.addColorStop(0.25, '#f59e0b');
      segGrad.addColorStop(0.65, '#dc2626');
      segGrad.addColorStop(0.9, '#991b1b');
      segGrad.addColorStop(1, '#450a0a');

      ctx.fillStyle = segGrad;
      ctx.beginPath();
      ctx.arc(pt0.x, pt0.y, pt0.r, 0, Math.PI * 2);
      ctx.fill();

      // 金色鱗甲弧線
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(pt0.x, pt0.y, pt0.r * 0.7, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();

      // 金黃腹甲 (Underbelly Ridge)
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(pt0.x, pt0.y + pt0.r * 0.45, pt0.r * 0.45, 0, Math.PI);
      ctx.stroke();
    }

    // 2. 翺翔神龍之翼 (Majestic Fiery Dragon Wings)
    const wingX = -radius * 0.3;
    const wingY = 0;

    // 上羽翼 (Top/Right Wing)
    ctx.save();
    ctx.translate(wingX, wingY - radius * 0.5);
    ctx.rotate(-0.4 + flapAngle);
    drawDragonWing(ctx, radius, true, time);
    ctx.restore();

    // 下羽翼 (Bottom/Left Wing)
    ctx.save();
    ctx.translate(wingX, wingY + radius * 0.5);
    ctx.rotate(0.4 - flapAngle);
    drawDragonWing(ctx, radius, false, time);
    ctx.restore();

    // 3. 蒼勁前爪 (Front Dragon Claws)
    drawDragonClaw(ctx, radius * 0.2, -radius * 0.9, radius, -0.6);
    drawDragonClaw(ctx, radius * 0.2, radius * 0.9, radius, 0.6);

    // 4. 威武龍首 (Majestic Dragon Head)
    ctx.save();
    ctx.translate(radius * 0.6, 0);

    // 4.1 龍首基座漸層
    const headGrad = ctx.createRadialGradient(radius * 0.2, -radius * 0.1, 2, 0, 0, radius * 1.15);
    headGrad.addColorStop(0, '#fef08a');
    headGrad.addColorStop(0.25, '#f59e0b');
    headGrad.addColorStop(0.65, '#dc2626');
    headGrad.addColorStop(0.9, '#991b1b');
    headGrad.addColorStop(1, '#450a0a');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    // 雕琢威武龍面輪廓：上顎、額骨、下顎
    ctx.moveTo(radius * 0.9, -radius * 0.18);
    ctx.quadraticCurveTo(radius * 0.7, -radius * 0.75, -radius * 0.4, -radius * 0.85);
    ctx.quadraticCurveTo(-radius * 0.8, 0, -radius * 0.4, radius * 0.85);
    ctx.quadraticCurveTo(radius * 0.7, radius * 0.75, radius * 0.9, radius * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // 4.2 鹿角狀神龍雙金角 (Majestic Branched Golden Dragon Horns)
    drawDragonAntler(ctx, -radius * 0.2, -radius * 0.65, radius, -1.2, time);
    drawDragonAntler(ctx, -radius * 0.2, radius * 0.65, radius, 1.2, time);

    // 4.3 飄逸赤金龍鬃 (Flowing Crown Dragon Mane)
    ctx.save();
    for (let m = 0; m < 5; m++) {
      const mAngle = -Math.PI * 0.65 + (m * Math.PI * 1.3) / 4;
      const mx = Math.cos(mAngle) * (radius * 0.75);
      const my = Math.sin(mAngle) * (radius * 0.75);
      ctx.fillStyle = m % 2 === 0 ? '#fef08a' : '#f97316';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - radius * 0.8, my + Math.sin(time * 8 + m) * 4);
      ctx.lineTo(mx - radius * 0.35, my * 0.7);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 4.4 威嚴金色龍瞳 (Blazing Golden Dragon Eyes)
    ctx.save();
    // 上眼
    drawDragonEye(ctx, radius * 0.38, -radius * 0.32, radius * 0.28, time);
    // 下眼
    drawDragonEye(ctx, radius * 0.38, radius * 0.32, radius * 0.28, time);
    ctx.restore();

    // 4.5 靈動龍鬚 (Flowing Golden Dragon Whiskers)
    drawDragonWhisker(ctx, radius * 0.75, -radius * 0.25, radius * 2.2, -0.2, time, 0);
    drawDragonWhisker(ctx, radius * 0.75, radius * 0.25, radius * 2.2, 0.2, time, 1);

    // 4.6 龍吻金芒獠牙 (Dragon Mouth Core Glow & Fangs)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(radius * 0.85, 0, radius * 0.22, 0, Math.PI * 2);
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 12;
    ctx.fill();

    // 上下尖銳龍牙
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(radius * 0.82, -radius * 0.16);
    ctx.lineTo(radius * 0.94, -radius * 0.05);
    ctx.lineTo(radius * 0.74, -radius * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(radius * 0.82, radius * 0.16);
    ctx.lineTo(radius * 0.94, radius * 0.05);
    ctx.lineTo(radius * 0.74, radius * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // end Dragon Head

    ctx.restore(); // end transformed dragon
  } else {
    // =========================================================================
    // 【常態模式】球體型態戰鬥（龍神之軀：龍角、龍鱗、龍翼與火焰能量）
    // =========================================================================
    ctx.save();

    // 1. 周身金紅烈焰龍威能量流環 (Dragon Aura Energy Streamers)
    const auraPulse = Math.sin(time * 7) * 2;
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 14;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 4 + auraPulse, time * 2, time * 2 + Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 2 - auraPulse * 0.5, -time * 3, -time * 3 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. 身側金焰微張龍羽翼 (Flanking Dragon Winglets)
    // 當高速移動、俯衝 (龍搖) 或攻擊時，雙翼展開幅度增加
    const wingFlap = Math.sin(time * 8) * 0.18;
    const wingSpread = (swoopActive ? 0.45 : speed > 40 ? 0.3 : 0.15) + wingFlap;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(facingAngle);

    // 左龍翼 (翼尖向後展開)
    ctx.save();
    ctx.translate(-radius * 0.2, -radius * 0.9);
    ctx.rotate(-Math.PI * 0.4 - wingSpread);
    drawSphereDragonWinglet(ctx, radius, true, time);
    ctx.restore();

    // 右龍翼
    ctx.save();
    ctx.translate(-radius * 0.2, radius * 0.9);
    ctx.rotate(Math.PI * 0.4 + wingSpread);
    drawSphereDragonWinglet(ctx, radius, false, time);
    ctx.restore();

    // 3. 神龍雙角 (Curved Majestic Antler Horns)
    // 自球體斜上方霸氣伸出
    ctx.save();
    drawSphereDragonHorn(ctx, radius * 0.2, -radius * 0.75, radius, -0.85, time);
    drawSphereDragonHorn(ctx, radius * 0.2, radius * 0.75, radius, 0.85, time);
    ctx.restore();

    // 4. 赤焰背鬃 (Dorsal Spine Mane Tufts)
    ctx.save();
    for (let m = 0; m < 4; m++) {
      const mAng = Math.PI - 0.5 + m * 0.35;
      const mx = Math.cos(mAng) * (radius * 0.95);
      const my = Math.sin(mAng) * (radius * 0.95);
      ctx.fillStyle = m % 2 === 0 ? '#fef08a' : '#f97316';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - radius * 0.45, my + Math.sin(time * 6 + m) * 3);
      ctx.lineTo(mx * 0.8, my * 0.8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 5. 球面覆蓋：金紅龍鱗浮雕甲紋 (Spherical Dragon Scales Pattern)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
    ctx.clip();

    // 鱗甲交錯弧線 (Concentric scale rows)
    const scaleRows = 3;
    for (let rIdx = 1; rIdx <= scaleRows; rIdx++) {
      const scaleR = radius * (0.35 + rIdx * 0.22);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 1.3;
      for (let s = 0; s < 5; s++) {
        const sAngle = -Math.PI * 0.6 + s * 0.3 + (rIdx % 2) * 0.15;
        const sx = Math.cos(sAngle) * scaleR;
        const sy = Math.sin(sAngle) * scaleR;
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 0.22, 0, Math.PI);
        ctx.stroke();
      }
    }
    ctx.restore(); // end scale clip

    // 6. 龍神威嚴金瞳 (Dragon Eyes on Front Face)
    ctx.save();
    const eyeDist = radius * 0.45;
    const eyeSpread = radius * 0.38;
    const eyeX = eyeDist;
    const eyeY1 = -eyeSpread;
    const eyeY2 = eyeSpread;

    drawDragonEye(ctx, eyeX, eyeY1, radius * 0.22, time);
    drawDragonEye(ctx, eyeX, eyeY2, radius * 0.22, time);
    ctx.restore();

    // 7. 飄逸金色長龍鬚 (Long Whiskers flowing from snout)
    drawDragonWhisker(ctx, radius * 0.85, -radius * 0.25, radius * 1.8, -0.15, time, 0);
    drawDragonWhisker(ctx, radius * 0.85, radius * 0.25, radius * 1.8, 0.15, time, 1);

    // 8. 俯衝 (龍搖) 專屬空氣錐形激波 (Swoop Shockwave Visuals)
    if (swoopActive) {
      ctx.save();
      const shockLen = radius * 1.6;
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(radius * 1.2, 0);
      ctx.lineTo(-shockLen, -radius * 1.5);
      ctx.moveTo(radius * 1.2, 0);
      ctx.lineTo(-shockLen, radius * 1.5);
      ctx.stroke();

      // 錐形半透明激波面
      const coneGrad = ctx.createLinearGradient(radius * 1.2, 0, -shockLen, 0);
      coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      coneGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
      coneGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(radius * 1.2, 0);
      ctx.lineTo(-shockLen, -radius * 1.5);
      ctx.lineTo(-shockLen, radius * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 9. 龍普近身打擊爪芒 (Dragon Strike Claw Slash)
    if (strikeAnimTimer > 0) {
      ctx.save();
      const slashAlpha = Math.min(1.0, strikeAnimTimer / 0.35);
      ctx.strokeStyle = `rgba(254, 240, 138, ${slashAlpha})`;
      ctx.lineWidth = 3.0;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 14;
      for (let c = -1; c <= 1; c++) {
        const cOffset = c * 7;
        ctx.beginPath();
        ctx.moveTo(radius * 1.1, cOffset - 12);
        ctx.quadraticCurveTo(radius * 1.8, cOffset, radius * 1.2, cOffset + 14);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 10. 龍炎蓄力吻部火光 (Dragon Flame Breath Charging Maw)
    if (flameActive) {
      ctx.save();
      const chargeGrad = ctx.createRadialGradient(radius * 0.95, 0, 0, radius * 0.95, 0, radius * 0.8);
      chargeGrad.addColorStop(0, '#ffffff');
      chargeGrad.addColorStop(0.3, '#fef08a');
      chargeGrad.addColorStop(0.7, '#f97316');
      chargeGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = chargeGrad;
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(radius * 0.95, 0, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // end facing translate
    ctx.restore(); // end sphere mode
  }

  // 統一 3D 光學球體高光
  drawStandardSpecularGlint(ctx, x, y, radius, '#ffffff');
  ctx.restore();
}

/**
 * 輔助繪製：神龍飛行大羽翼
 */
function drawDragonWing(ctx: CanvasRenderingContext2D, radius: number, isTop: boolean, time: number) {
  const sign = isTop ? -1 : 1;
  const wingLen = radius * 2.3;
  const wingW = radius * 1.4;

  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;

  // 翼膜漸層
  const wingGrad = ctx.createLinearGradient(0, 0, -wingLen * 0.7, sign * wingW);
  wingGrad.addColorStop(0, '#fef08a');
  wingGrad.addColorStop(0.3, '#f59e0b');
  wingGrad.addColorStop(0.7, '#dc2626');
  wingGrad.addColorStop(1, 'rgba(153, 27, 27, 0.75)');

  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.5, sign * wingW * 1.1, -wingLen, sign * wingW * 0.8);
  ctx.quadraticCurveTo(-wingLen * 0.7, sign * wingW * 0.5, -wingLen * 0.8, sign * wingW * 0.25);
  ctx.quadraticCurveTo(-wingLen * 0.4, sign * wingW * 0.2, 0, 0);
  ctx.closePath();
  ctx.fill();

  // 翼骨金芒
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.5, sign * wingW * 1.1, -wingLen, sign * wingW * 0.8);
  ctx.stroke();

  // 次級翼肋條
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.4, sign * wingW * 0.65);
  ctx.lineTo(-wingLen * 0.7, sign * wingW * 0.5);
  ctx.moveTo(-radius * 0.25, sign * wingW * 0.35);
  ctx.lineTo(-wingLen * 0.55, sign * wingW * 0.2);
  ctx.stroke();

  // 關節尖爪
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-radius * 0.5, sign * wingW * 1.1, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 輔助繪製：球體模式下的側身龍羽翼微張
 */
function drawSphereDragonWinglet(ctx: CanvasRenderingContext2D, radius: number, isTop: boolean, time: number) {
  const sign = isTop ? -1 : 1;
  const wingLen = radius * 1.35;
  const wingW = radius * 0.75;

  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;

  const wingGrad = ctx.createLinearGradient(0, 0, -wingLen, sign * wingW);
  wingGrad.addColorStop(0, '#fef08a');
  wingGrad.addColorStop(0.4, '#f97316');
  wingGrad.addColorStop(1, 'rgba(220, 38, 38, 0.6)');

  ctx.fillStyle = wingGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.3, sign * wingW * 1.2, -wingLen, sign * wingW * 0.7);
  ctx.quadraticCurveTo(-wingLen * 0.6, sign * wingW * 0.3, 0, 0);
  ctx.closePath();
  ctx.fill();

  // 翼主骨
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.3, sign * wingW * 1.2, -wingLen, sign * wingW * 0.7);
  ctx.stroke();

  ctx.restore();
}

/**
 * 輔助繪製：神龍蒼勁龍爪
 */
function drawDragonClaw(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, angle: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const clawLen = radius * 0.55;
  const clawW = radius * 0.22;

  // 龍掌肌肉
  ctx.fillStyle = '#dc2626';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(0, 0, clawW, clawLen * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 四指鋒利龍鉤爪
  ctx.fillStyle = '#fef08a';
  for (let i = -1.5; i <= 1.5; i += 1.0) {
    const toeAng = (i * 0.25);
    const tx = Math.sin(toeAng) * clawW * 0.8;
    const ty = clawLen * 0.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + Math.sin(toeAng) * (radius * 0.35), ty + radius * 0.38);
    ctx.lineTo(tx + 2, ty + 2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 輔助繪製：變身龍首鹿角狀雙角
 */
function drawDragonAntler(ctx: CanvasRenderingContext2D, ax: number, ay: number, radius: number, rot: number, time: number) {
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(rot);

  const hornLen = radius * 1.6;
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.8;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12;

  // 主幹弧線
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.4, -hornLen * 0.6, -radius * 0.1, -hornLen);
  ctx.stroke();

  // 第一分叉枝
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.22, -hornLen * 0.45);
  ctx.quadraticCurveTo(-radius * 0.55, -hornLen * 0.55, -radius * 0.7, -hornLen * 0.75);
  ctx.stroke();

  // 第二分叉枝
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.16, -hornLen * 0.72);
  ctx.lineTo(-radius * 0.45, -hornLen * 0.95);
  ctx.stroke();

  // 角尖烈火神芒
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-radius * 0.1, -hornLen, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 輔助繪製：球體模式下的霸氣龍角
 */
function drawSphereDragonHorn(ctx: CanvasRenderingContext2D, hx: number, hy: number, radius: number, rot: number, time: number) {
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(rot);

  const hornLen = radius * 1.1;
  const hornGrad = ctx.createLinearGradient(0, 0, 0, -hornLen);
  hornGrad.addColorStop(0, '#991b1b');
  hornGrad.addColorStop(0.3, '#dc2626');
  hornGrad.addColorStop(0.7, '#f59e0b');
  hornGrad.addColorStop(1, '#fef08a');

  ctx.strokeStyle = hornGrad;
  ctx.lineWidth = 2.6;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-radius * 0.25, -hornLen * 0.5, 0, -hornLen);
  ctx.stroke();

  // 側分枝
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.12, -hornLen * 0.45);
  ctx.lineTo(-radius * 0.45, -hornLen * 0.65);
  ctx.stroke();

  ctx.restore();
}

/**
 * 輔助繪製：龍神金色龍瞳
 */
function drawDragonEye(ctx: CanvasRenderingContext2D, ex: number, ey: number, eyeRadius: number, time: number) {
  ctx.save();
  ctx.translate(ex, ey);

  // 眉骨陰影
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(0, -eyeRadius * 0.2, eyeRadius * 1.25, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#7f1d1d';
  ctx.stroke();

  // 金色眼白／眼眶
  const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeRadius);
  eyeGrad.addColorStop(0, '#ffffff');
  eyeGrad.addColorStop(0.35, '#fef08a');
  eyeGrad.addColorStop(0.75, '#f59e0b');
  eyeGrad.addColorStop(1, '#dc2626');

  ctx.fillStyle = eyeGrad;
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(0, 0, eyeRadius * 1.2, eyeRadius * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 垂直龍類細瞳
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(0, 0, eyeRadius * 0.25, eyeRadius * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // 高光反光點
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-eyeRadius * 0.25, -eyeRadius * 0.2, eyeRadius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 輔助繪製：飄逸長龍鬚
 */
function drawDragonWhisker(
  ctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  length: number,
  baseAngle: number,
  time: number,
  phaseOffset: number
) {
  ctx.save();
  ctx.translate(wx, wy);
  ctx.rotate(baseAngle);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(0, 0);

  const steps = 6;
  const segLen = length / steps;
  for (let i = 1; i <= steps; i++) {
    const curX = i * segLen;
    const waveY = Math.sin(time * 7 + phaseOffset * 1.8 + i * 0.8) * (i * 3.5);
    ctx.lineTo(curX, waveY);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * 蜘蛛 (Zhizhu) - 專屬球體特徵繪製
 * 特徵｜蛛后核心：
 * - 多節黑色漆黑蛛肢 (8隻多關節活動蛛肢，動態爬行律動)
 * - 環繞式劇毒能量光環與漂浮酸液微粒
 * - 8點多眼陣列 (雙主複眼緋紅璀璨 + 六側副眼毒翠微光)
 * - 毒牙螯肢 (Chelicerae & Venom Fangs)：釋放毒牙印記時向前突刺並滴落翡翠酸液
 * - 蛛后毒爆 (Spider Queen Poison Burst)：引爆時擴散劇毒衝擊波紋
 */
export function drawZhizhuFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  venomFangAnimTimer: number = 0,
  burstAnimTimer: number = 0,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();

  const speed = Math.hypot(vx, vy);
  const facingAngle = speed > 1.5 ? Math.atan2(vy, vx) : -Math.PI * 0.25;

  // 1. 蛛后毒爆劇毒衝擊波 (Poison Burst Detonation Ring)
  if (burstAnimTimer > 0) {
    ctx.save();
    const burstProgress = Math.max(0, Math.min(1, 1 - burstAnimTimer / 0.45));
    const burstRadius = radius + burstProgress * 32;
    const burstAlpha = Math.max(0, 1 - burstProgress);

    ctx.strokeStyle = `rgba(16, 185, 129, ${burstAlpha * 0.9})`;
    ctx.lineWidth = 2.8 * (1 - burstProgress * 0.5);
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x, y, burstRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 8道向外放射毒刺
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + burstProgress * 0.8;
      const r1 = burstRadius - 6;
      const r2 = burstRadius + 8;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. 環繞式毒液能量光環 (Circling Venomous Energy Aura)
  const pulse = Math.sin(time * 5) * 1.5;
  const venomAuraR = radius + 3.5 + pulse;
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = '#059669';
  ctx.shadowBlur = 10;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(x, y, venomAuraR, time * 2.2, time * 2.2 + Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 漂浮毒素孢子微粒
  for (let i = 0; i < 4; i++) {
    const a = time * 2.5 + (i * Math.PI * 2) / 4;
    const pr = venomAuraR + Math.sin(time * 6 + i) * 2;
    const px = x + Math.cos(a) * pr;
    const py = y + Math.sin(a) * pr;
    ctx.fillStyle = i % 2 === 0 ? '#34d399' : '#10b981';
    ctx.shadowColor = '#059669';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. 繪製 8 隻多節黑色多關節蛛肢 (8 Articulated Chitin Legs)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(facingAngle);

  // 左右各 4 隻腿，角度從胸部對稱伸出
  const legAngles = [
    { baseAngle: -0.65, side: -1, index: 0 },
    { baseAngle: -1.15, side: -1, index: 1 },
    { baseAngle: -1.75, side: -1, index: 2 },
    { baseAngle: -2.35, side: -1, index: 3 },
    { baseAngle: 0.65, side: 1, index: 4 },
    { baseAngle: 1.15, side: 1, index: 5 },
    { baseAngle: 1.75, side: 1, index: 6 },
    { baseAngle: 2.35, side: 1, index: 7 }
  ];

  for (const leg of legAngles) {
    ctx.save();
    // 爬行時肢體上下伸展微動動畫
    const walkPhase = Math.sin(time * 12 + leg.index * 1.5) * (speed > 2 ? 0.22 : 0.08);
    const ang = leg.baseAngle + walkPhase;

    const rootDist = radius * 0.72;
    const rx = Math.cos(ang) * rootDist;
    const ry = Math.sin(ang) * rootDist;

    // 關節1：基節至腿節 (Coxa to Femur) - 向上向外
    const joint1Len = radius * 0.65;
    const joint1Ang = ang + leg.side * 0.35;
    const j1x = rx + Math.cos(joint1Ang) * joint1Len;
    const j1y = ry + Math.sin(joint1Ang) * joint1Len;

    // 關節2：脛節向外向下彎折 (Femur to Tibia)
    const joint2Len = radius * 0.75;
    const joint2Ang = joint1Ang + leg.side * 0.85;
    const j2x = j1x + Math.cos(joint2Ang) * joint2Len;
    const j2y = j1y + Math.sin(joint2Ang) * joint2Len;

    // 關節3：跗節末端銳利尖爪 (Tarsus Claws)
    const clawLen = radius * 0.45;
    const clawAng = joint2Ang + leg.side * 0.5;
    const tipX = j2x + Math.cos(clawAng) * clawLen;
    const tipY = j2y + Math.sin(clawAng) * clawLen;

    // 繪製漆黑甲殼節肢 (Chitin Segments)
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(j1x, j1y);
    ctx.lineTo(j2x, j2y);
    ctx.stroke();

    // 尖爪部分漸變為劇毒翡翠色
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(j2x, j2y);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // 關節微光點
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(j1x, j1y, 1.2, 0, Math.PI * 2);
    ctx.arc(j2x, j2y, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 4. 背甲劇毒翡翠蛛網紋章 (Venom Arachnid Carapace Rune)
  ctx.save();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 6;
  // 蛛網同心菱形
  for (let r = 1; r <= 3; r++) {
    const cr = radius * 0.22 * r;
    ctx.beginPath();
    ctx.moveTo(-cr * 0.6, -cr * 0.4);
    ctx.lineTo(cr * 0.2, -cr * 0.5);
    ctx.lineTo(cr * 0.5, 0);
    ctx.lineTo(cr * 0.2, cr * 0.5);
    ctx.lineTo(-cr * 0.6, cr * 0.4);
    ctx.closePath();
    ctx.stroke();
  }
  // 紋章中軸脊線
  ctx.beginPath();
  ctx.moveTo(-radius * 0.65, 0);
  ctx.lineTo(radius * 0.5, 0);
  ctx.stroke();
  ctx.restore();

  // 5. 螯肢毒牙 (Chelicerae & Venom Fangs)
  const fangLunge = venomFangAnimTimer > 0 ? (venomFangAnimTimer / 0.25) * 6 : 0;
  const fangBaseX = radius * 0.75 + fangLunge;
  const fangYOffset = radius * 0.28;

  ctx.save();
  // 雙側毒牙
  for (const side of [-1, 1]) {
    const fy = side * fangYOffset;
    ctx.save();
    ctx.translate(fangBaseX, fy);
    ctx.rotate(side * 0.25);

    // 毒牙尖端
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(0, -side * 2.5);
    ctx.lineTo(radius * 0.38, 0);
    ctx.lineTo(0, side * 2.5);
    ctx.closePath();
    ctx.fill();

    // 牙尖劇毒翡翠塗層
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(radius * 0.1, -side * 1.2);
    ctx.lineTo(radius * 0.38, 0);
    ctx.lineTo(radius * 0.1, side * 1.2);
    ctx.stroke();

    // 滴落的毒液液滴 (Droplet)
    if (venomFangAnimTimer > 0) {
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(radius * 0.44, 0, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();

  // 6. 8點多複眼結構 (8 Multi-Cluster Arachnid Eyes)
  // 前中主眼 (AME) x2 - 緋紅明亮
  const eyeX = radius * 0.52;
  for (const ey of [-radius * 0.16, radius * 0.16]) {
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(eyeX, ey, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔光斑
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX + 0.6, ey - 0.4, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 側眼與後眼 (ALE, PME, PLE) x6 - 毒翠微芒
  const sideEyes = [
    { x: radius * 0.42, y: -radius * 0.36, r: 1.4 },
    { x: radius * 0.42, y: radius * 0.36, r: 1.4 },
    { x: radius * 0.28, y: -radius * 0.46, r: 1.2 },
    { x: radius * 0.28, y: radius * 0.46, r: 1.2 },
    { x: radius * 0.15, y: -radius * 0.52, r: 1.0 },
    { x: radius * 0.15, y: radius * 0.52, r: 1.0 }
  ];

  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 6;
  for (const se of sideEyes) {
    ctx.beginPath();
    ctx.arc(se.x, se.y, se.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // facing transform

  // 7. 3D 光學高光 (Unified Specular Glint)
  drawStandardSpecularGlint(ctx, x, y, radius, '#ffffff');

  ctx.restore();
}

/**
 * 辛 (Xin): 雙相魔劍 (Dual-Phase Magic Sword)
 * 職業：形態戰士 / 0碰撞傷害 / 沉重金屬裝甲球體 / 浮游魔劍 / 蓄力斬擊
 */
export function drawXinFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  options: {
    facingAngle?: number;
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
    xinLockTargetDist?: number;
    xinLockSkillType?: string | null;
    xinSwordOrbitAngle?: number;
    xinExpAbsorbTimer?: number;
    xinUpgradeAnimTimer?: number;
    xinSwordVibrate?: number;
    speed?: number;
  } = {}
) {
  const form = options.xinForm || 'balance';
  const level = Math.max(1, Math.min(6, options.xinLevel || 1));
  const facing = options.facingAngle ?? 0;
  const isChargingSky = (options.xinSkySlashChargeTimer || 0) > 0;
  const isChargingDash = (options.xinShadowDashChargeTimer || 0) > 0;
  const isDashing = !!options.xinShadowDashing;
  const isBasicSlashing = (options.xinBasicSlashAnimTimer || 0) > 0;
  const isUpgrading = (options.xinUpgradeAnimTimer || 0) > 0;
  const isAbsorbingExp = (options.xinExpAbsorbTimer || 0) > 0;

  ctx.save();

  // -------------------------------------------------------------
  // 1. 地面光環與形態底陣 (Form Aura Decal & Base Ground Halo)
  // -------------------------------------------------------------
  ctx.save();
  if (form === 'light') {
    // 統御形態【光之魔劍】: 金色烈陽日冕光環
    const pulse = Math.sin(time * 4) * 2;
    const auraR = radius + 9 + pulse;
    const auraGrad = ctx.createRadialGradient(x, y, radius * 0.75, x, y, auraR);
    auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    auraGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.18)');
    auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y, auraR, 0, Math.PI * 2);
    ctx.fill();

    // 柔和日冕光芒
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 8; i++) {
      const rayAng = (i * Math.PI) / 4 + time * 0.6;
      const r1 = radius + 3;
      const r2 = radius + 8 + (i % 2 === 0 ? 3 : 1);
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(rayAng) * r1, y + Math.sin(rayAng) * r1);
      ctx.lineTo(x + Math.cos(rayAng) * r2, y + Math.sin(rayAng) * r2);
      ctx.stroke();
    }
  } else if (form === 'dark') {
    // 狂暴形態【暗之魔劍】: 狂暴暗焰與深紫暗紅暈染
    const pulse = Math.sin(time * 6) * 2.5;
    const auraR = radius + 10 + pulse;
    const auraGrad = ctx.createRadialGradient(x, y, radius * 0.75, x, y, auraR);
    auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.42)');
    auraGrad.addColorStop(0.65, 'rgba(126, 34, 206, 0.22)');
    auraGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y, auraR, 0, Math.PI * 2);
    ctx.fill();

    // 撕裂電芒微刺
    ctx.strokeStyle = 'rgba(233, 213, 255, 0.6)';
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 6; i++) {
      const sparkAng = (i * Math.PI) / 3 - time * 1.8;
      const r1 = radius + 2;
      const r2 = radius + 7 + Math.sin(time * 12 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(sparkAng) * r1, y + Math.sin(sparkAng) * r1);
      ctx.lineTo(x + Math.cos(sparkAng) * r2, y + Math.sin(sparkAng) * r2);
      ctx.stroke();
    }
  } else {
    // 初始平衡魔劍: 雙極雙色太極光軌 (白金 & 深紫)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, time * 1.2, time * 1.2 + Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, time * 1.2 + Math.PI, time * 1.2 + Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 2. 聖光護盾 (若有神聖護盾值)
  // -------------------------------------------------------------
  if ((options.xinShieldAmount || 0) > 0) {
    ctx.save();
    const shieldR = radius + 9 + Math.sin(time * 5) * 1.2;
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    // 圓潤六角形護盾光環
    for (let h = 0; h < 6; h++) {
      const hAng = (h * Math.PI) / 3 + time * 0.4;
      const hx = x + Math.cos(hAng) * shieldR;
      const hy = y + Math.sin(hAng) * shieldR;
      if (h === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'rgba(251, 191, 36, 0.10)';
    ctx.fill();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 3. 重型不對稱金屬裝甲板層 (Segmented Metallic Armor Plates)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(x, y);

  // 沉重金屬裝甲板輪廓與陰影刻線 (Asymmetrical Armor Panels)
  // (1) 上方主護甲 (Main Brow Armor Plate)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.94, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.lineTo(radius * 0.42, -radius * 0.38);
  ctx.lineTo(0, -radius * 0.48);
  ctx.lineTo(-radius * 0.42, -radius * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // (2) 左側護甲 (Left Flank Plate)
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.94, Math.PI * 0.72, Math.PI * 1.08);
  ctx.lineTo(-radius * 0.46, 0);
  ctx.lineTo(-radius * 0.42, radius * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // (3) 右側護甲 (Right Flank Plate)
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.94, -Math.PI * 0.08, Math.PI * 0.28);
  ctx.lineTo(radius * 0.44, radius * 0.28);
  ctx.lineTo(radius * 0.46, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // (4) 下方防護厚甲 (Ventral Heavy Reinforced Plate)
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.94, Math.PI * 0.35, Math.PI * 0.65);
  ctx.lineTo(radius * 0.22, radius * 0.48);
  ctx.lineTo(0, radius * 0.52);
  ctx.lineTo(-radius * 0.22, radius * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // -------------------------------------------------------------
  // 4. 裝甲間細小能量裂縫 (Energy Fissures / Seams)
  // -------------------------------------------------------------
  const fissurePulse = Math.sin(time * 5) * 0.2 + 0.8;
  let fissureColor = 'rgba(254, 240, 138, 0.45)';
  let fissureShadow = '#fbbf24';

  if (form === 'light') {
    fissureColor = isChargingSky || isChargingDash || isUpgrading ? 'rgba(255, 255, 255, 0.95)' : `rgba(254, 240, 138, ${0.75 * fissurePulse})`;
    fissureShadow = '#f59e0b';
  } else if (form === 'dark') {
    fissureColor = isChargingSky || isChargingDash || isUpgrading ? 'rgba(248, 113, 113, 0.95)' : `rgba(220, 38, 38, ${0.75 * fissurePulse})`;
    fissureShadow = '#7f1d1d';
  } else {
    // 平衡形態冷白/淡金裂縫
    fissureColor = isChargingSky || isChargingDash || isUpgrading ? 'rgba(255, 255, 255, 0.9)' : `rgba(226, 232, 240, ${0.45 * fissurePulse})`;
    fissureShadow = '#94a3b8';
  }

  ctx.strokeStyle = fissureColor;
  ctx.shadowColor = fissureShadow;
  ctx.shadowBlur = isChargingSky || isUpgrading ? 8 : 4;
  ctx.lineWidth = isChargingSky || isUpgrading ? 1.6 : 1.0;

  // 裂縫紋理 (從核心向外延伸穿過裝甲縫隙)
  ctx.beginPath();
  // 上方縫隙
  ctx.moveTo(0, -radius * 0.42);
  ctx.lineTo(0, -radius * 0.85);
  // 左上縫隙
  ctx.moveTo(-radius * 0.32, -radius * 0.26);
  ctx.lineTo(-radius * 0.65, -radius * 0.58);
  // 右上縫隙
  ctx.moveTo(radius * 0.32, -radius * 0.26);
  ctx.lineTo(radius * 0.65, -radius * 0.58);
  // 左下縫隙
  ctx.moveTo(-radius * 0.32, radius * 0.28);
  ctx.lineTo(-radius * 0.65, radius * 0.62);
  // 右下縫隙
  ctx.moveTo(radius * 0.32, radius * 0.28);
  ctx.lineTo(radius * 0.65, radius * 0.62);
  ctx.stroke();

  // -------------------------------------------------------------
  // 5. 中央略微突出雙相能量核心 (Central Raised Dual-Phase Core)
  // -------------------------------------------------------------
  const coreOuterR = radius * 0.44;
  const coreInnerR = radius * 0.34;

  // 外圈金屬立體凸起底座 (Embossed Metal Bezel Ring)
  const bezelGrad = ctx.createLinearGradient(-coreOuterR, -coreOuterR, coreOuterR, coreOuterR);
  bezelGrad.addColorStop(0, '#64748b');
  bezelGrad.addColorStop(0.5, '#334155');
  bezelGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bezelGrad;
  ctx.beginPath();
  ctx.arc(0, 0, coreOuterR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // 核心發光晶石 (Inner Energy Core)
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreInnerR);
  if (form === 'light') {
    // 統御形態：高亮金白能量光芒
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.35, '#fef08a');
    coreGrad.addColorStop(0.75, '#f59e0b');
    coreGrad.addColorStop(1, '#78350f');
    ctx.shadowColor = '#f59e0b';
  } else if (form === 'dark') {
    // 狂暴形態：深紫／暗黑／暗紅
    coreGrad.addColorStop(0, '#fecaca');
    coreGrad.addColorStop(0.3, '#dc2626');
    coreGrad.addColorStop(0.65, '#581c87');
    coreGrad.addColorStop(1, '#180828');
    ctx.shadowColor = '#9333ea';
  } else {
    // 初始平衡形態：冷白／淡金微光
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, '#f8fafc');
    coreGrad.addColorStop(0.8, '#cbd5e1');
    coreGrad.addColorStop(1, '#334155');
    ctx.shadowColor = '#94a3b8';
  }

  ctx.shadowBlur = isChargingSky || isChargingDash || isUpgrading ? 14 : 7;
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, coreInnerR, 0, Math.PI * 2);
  ctx.fill();

  // 核心雙相劍印浮雕 (Dual-Phase Sword Ingot Inset)
  ctx.fillStyle = form === 'dark' ? '#180828' : '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -coreInnerR * 0.7);
  ctx.lineTo(coreInnerR * 0.35, 0);
  ctx.lineTo(0, coreInnerR * 0.7);
  ctx.lineTo(-coreInnerR * 0.35, 0);
  ctx.closePath();
  ctx.fill();

  // -------------------------------------------------------------
  // 6. 經驗吸收動畫 (Exp Absorb Ring: 快速收縮進核心)
  // -------------------------------------------------------------
  if (isAbsorbingExp) {
    const p = (options.xinExpAbsorbTimer || 0) / 0.35; // 1 -> 0
    const shrinkR = coreInnerR + (radius * 0.75) * p;
    ctx.strokeStyle = form === 'dark' ? 'rgba(248, 113, 113, 0.85)' : 'rgba(254, 240, 138, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = form === 'dark' ? '#ef4444' : '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, shrinkR, 0, Math.PI * 2);
    ctx.stroke();

    // 核心吸收光爆
    if (p < 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, coreInnerR * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // -------------------------------------------------------------
  // 7. 升級爆發動畫 (Level Up Burst: 能量環擴散)
  // -------------------------------------------------------------
  if (isUpgrading) {
    const upProg = 1 - (options.xinUpgradeAnimTimer || 0) / 0.35; // 0 -> 1
    const expandR = coreInnerR + (radius * 1.1) * upProg;
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.9 * (1 - upProg)})`;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, expandR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // -------------------------------------------------------------
  // 8. 等級進階晶鑽 (Level 1~6 Diamond Sockets on Brow Plate)
  // -------------------------------------------------------------
  const pipRadius = radius * 0.84;
  const startAng = -Math.PI * 0.72;
  const stepAng = (Math.PI * 0.44) / 5;

  for (let l = 0; l < 6; l++) {
    const pAng = startAng + l * stepAng;
    const px = Math.cos(pAng) * pipRadius;
    const py = Math.sin(pAng) * pipRadius;
    const isActive = l < level;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(pAng + Math.PI / 4);

    if (isActive) {
      ctx.fillStyle = form === 'light' ? '#fbbf24' : form === 'dark' ? '#c084fc' : '#38bdf8';
      ctx.shadowColor = form === 'light' ? '#f59e0b' : form === 'dark' ? '#a855f7' : '#0284c7';
      ctx.shadowBlur = 5;
      ctx.fillRect(-1.8, -1.8, 3.6, 3.6);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(-1.8, -1.8, 3.6, 3.6);
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(-1.4, -1.4, 2.8, 2.8);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.4;
      ctx.strokeRect(-1.4, -1.4, 2.8, 2.8);
    }
    ctx.restore();
  }

  // 恢復球體中心坐標系
  ctx.restore();

  // -------------------------------------------------------------
  // 9. 瞄準指示與蓄力縮小環 (Aiming Vector & Concentric Charge Rings)
  // -------------------------------------------------------------
  if ((isChargingSky || isChargingDash) && options.xinLockAimAngle !== undefined) {
    const aimAng = options.xinLockAimAngle;
    const aimColor = form === 'light' ? '#f59e0b' : form === 'dark' ? '#c084fc' : '#38bdf8';
    const aimGlow = form === 'light' ? '#fbbf24' : form === 'dark' ? '#9333ea' : '#0284c7';
    const aimLen = isChargingSky ? 360 : 270;

    ctx.save();
    // 1. 地面雙軌空間裂痕導向 (Spatial Corridor Laser)
    const cosA = Math.cos(aimAng);
    const sinA = Math.sin(aimAng);
    const perpX = -sinA;
    const perpY = cosA;
    const laneW = isChargingSky ? 14 : 9;

    // 兩側微光軌道
    ctx.strokeStyle = form === 'light' ? 'rgba(254, 240, 138, 0.45)' : form === 'dark' ? 'rgba(192, 132, 252, 0.45)' : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(x + perpX * laneW, y + perpY * laneW);
    ctx.lineTo(x + cosA * aimLen + perpX * laneW, y + sinA * aimLen + perpY * laneW);
    ctx.moveTo(x - perpX * laneW, y - perpY * laneW);
    ctx.lineTo(x + cosA * aimLen - perpX * laneW, y + sinA * aimLen - perpY * laneW);
    ctx.stroke();

    // 中央高亮實時引導光線 (帶有向目標流動的能量脈衝)
    const pulseOffset = (time * 180) % 24;
    ctx.strokeStyle = aimColor;
    ctx.lineWidth = isChargingSky ? 2.4 : 1.8;
    ctx.setLineDash([12, 12]);
    ctx.lineDashOffset = -pulseOffset;
    ctx.shadowColor = aimGlow;
    ctx.shadowBlur = isChargingSky ? 12 : 8;
    ctx.beginPath();
    ctx.moveTo(x + cosA * (radius + 15), y + sinA * (radius + 15));
    ctx.lineTo(x + cosA * aimLen, y + sinA * aimLen);
    ctx.stroke();
    ctx.setLineDash([]);

    // 終點鎖定準心符印 (Targeting Crosshair Reticle)
    const targetX = x + cosA * (options.xinLockTargetDist ? Math.min(aimLen, options.xinLockTargetDist) : aimLen);
    const targetY = y + sinA * (options.xinLockTargetDist ? Math.min(aimLen, options.xinLockTargetDist) : aimLen);
    const reticleR = isChargingSky ? 14 : 10;
    ctx.strokeStyle = form === 'light' ? '#fde047' : form === 'dark' ? '#f472b6' : '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(targetX, targetY, reticleR, 0, Math.PI * 2);
    ctx.stroke();

    // 準心微型十字
    ctx.beginPath();
    ctx.moveTo(targetX - reticleR * 1.3, targetY);
    ctx.lineTo(targetX + reticleR * 1.3, targetY);
    ctx.moveTo(targetX, targetY - reticleR * 1.3);
    ctx.lineTo(targetX, targetY + reticleR * 1.3);
    ctx.stroke();

    // 裂空劍痕蓄力環逐漸縮小 (Concentric Charge Ring Shrinking)
    if (isChargingSky) {
      const chargeRatio = (options.xinSkySlashChargeTimer || 0) / 0.45; // 1 -> 0
      const ringR = (radius + 8) + 26 * chargeRatio;
      ctx.strokeStyle = `rgba(254, 240, 138, ${0.9 - chargeRatio * 0.35})`;
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // 內層第二重收縮能量圈
      const innerRingR = (radius + 4) + 14 * chargeRatio;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 - chargeRatio * 0.2})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, innerRingR, 0, Math.PI * 2);
      ctx.stroke();

      // 能量吸向魔劍指向性符號
      for (let c = 0; c < 5; c++) {
        const cAng = aimAng - Math.PI * 0.45 + c * (Math.PI * 0.9) / 4;
        const cr1 = ringR;
        const cr2 = ringR - 8;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(cAng) * cr1, y + Math.sin(cAng) * cr1);
        ctx.lineTo(x + Math.cos(cAng) * cr2, y + Math.sin(cAng) * cr2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 9.5. 揮舞斬擊光弧 (Sword Slash Arc Trail)
  // -------------------------------------------------------------
  if (isBasicSlashing && options.xinLockAimAngle !== undefined) {
    const slashP = 1 - (options.xinBasicSlashAnimTimer || 0) / 0.14; // 0 -> 1
    const aimAng = options.xinLockAimAngle;
    const arcRadius = radius + 25;
    const startSwing = aimAng - 0.65;
    const endSwing = aimAng - 0.65 + slashP * 1.3;

    ctx.save();
    // 斬擊光流漸變
    const arcGrad = ctx.createLinearGradient(
      x + Math.cos(startSwing) * arcRadius,
      y + Math.sin(startSwing) * arcRadius,
      x + Math.cos(endSwing) * arcRadius,
      y + Math.sin(endSwing) * arcRadius
    );
    if (form === 'light') {
      arcGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
      arcGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.85)');
      arcGrad.addColorStop(1, '#ffffff');
    } else if (form === 'dark') {
      arcGrad.addColorStop(0, 'rgba(147, 51, 234, 0)');
      arcGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.85)');
      arcGrad.addColorStop(1, '#ffffff');
    } else {
      arcGrad.addColorStop(0, 'rgba(148, 163, 184, 0)');
      arcGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.8)');
      arcGrad.addColorStop(1, '#ffffff');
    }

    ctx.strokeStyle = arcGrad;
    ctx.lineWidth = 4.5 * (1 - slashP * 0.35);
    ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#c084fc' : '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x, y, arcRadius, startSwing, endSwing);
    ctx.stroke();

    // 鋒芒純白核心細刃
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(x, y, arcRadius, Math.max(startSwing, endSwing - 0.45), endSwing);
    ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 9.6. 逐影衝刺音錐氣浪 (Supersonic Piercing Sonic Wave)
  // -------------------------------------------------------------
  if (isDashing && options.xinLockAimAngle !== undefined) {
    const dashAng = options.xinLockAimAngle;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(dashAng);

    // 衝刺音錐前錐氣浪
    ctx.strokeStyle = form === 'dark' ? 'rgba(192, 132, 252, 0.75)' : (form === 'light' ? 'rgba(254, 240, 138, 0.8)' : 'rgba(224, 231, 255, 0.7)');
    ctx.lineWidth = 2.0;
    ctx.shadowColor = form === 'dark' ? '#9333ea' : '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(radius + 16, 0);
    ctx.lineTo(-radius * 0.6, radius + 8);
    ctx.moveTo(radius + 16, 0);
    ctx.lineTo(-radius * 0.6, -(radius + 8));
    ctx.stroke();

    ctx.restore();
  }

  // -------------------------------------------------------------
  // 10. 浮游環繞式雙相魔劍 (Floating Orbiting Magic Sword)
  // -------------------------------------------------------------
  // 計算魔劍位置與姿態：
  // 距離球體表面 20~35px (半徑21，距離中心約 43~52px)
  let targetDist = radius + 23;
  let targetAngle = options.xinSwordOrbitAngle ?? (time * 2.0);
  let targetSwordRot = targetAngle + Math.PI / 2 + 0.25;

  if (isChargingSky && options.xinLockAimAngle !== undefined) {
    // 裂空斬擊蓄力：魔劍停止環繞，移動至前方鎖定方向
    targetAngle = options.xinLockAimAngle;
    targetDist = radius + 25;
    targetSwordRot = targetAngle + Math.PI / 2;
  } else if (isChargingDash && options.xinLockAimAngle !== undefined) {
    // 逐影破陣蓄力：魔劍前移開道
    targetAngle = options.xinLockAimAngle;
    targetDist = radius + 22;
    targetSwordRot = targetAngle + Math.PI / 2;
  } else if (isDashing && options.xinLockAimAngle !== undefined) {
    // 衝刺突進中：魔劍保持在球體正前方作為破陣先鋒
    targetAngle = options.xinLockAimAngle;
    targetDist = radius + 22;
    targetSwordRot = targetAngle + Math.PI / 2;
  } else if (isBasicSlashing && options.xinLockAimAngle !== undefined) {
    // 普攻快速揮砍：平滑前移並短暫橫斬
    const slashP = 1 - (options.xinBasicSlashAnimTimer || 0) / 0.14; // 0 -> 1
    const swingArc = (slashP - 0.5) * 0.9;
    targetAngle = options.xinLockAimAngle + swingArc;
    targetDist = radius + 25;
    targetSwordRot = targetAngle + Math.PI / 2 + swingArc * 0.6;
  }

  let swordX = x + Math.cos(targetAngle) * targetDist;
  let swordY = y + Math.sin(targetAngle) * targetDist;

  // 蓄力微震動 (Sword Vibration)
  if (options.xinSwordVibrate && options.xinSwordVibrate > 0) {
    const perpAng = targetAngle + Math.PI / 2;
    const vibDist = Math.sin(time * 75) * options.xinSwordVibrate;
    swordX += Math.cos(perpAng) * vibDist;
    swordY += Math.sin(perpAng) * vibDist;
  }

  // 繪製從核心連接至魔劍的能量流 (Energy flow during skills/charging)
  if (isChargingSky || isChargingDash || isBasicSlashing) {
    ctx.save();
    ctx.strokeStyle = form === 'light' ? 'rgba(254, 240, 138, 0.75)' : form === 'dark' ? 'rgba(248, 113, 113, 0.75)' : 'rgba(226, 232, 240, 0.6)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#dc2626' : '#94a3b8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(swordX, swordY);
    ctx.stroke();
    ctx.restore();
  }

  // 繪製魔劍實體
  ctx.save();
  ctx.translate(swordX, swordY);
  ctx.rotate(targetSwordRot);

  const swordLen = 32;
  const bladeW = 8.5;

  // 劍體能量光暈
  ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#7f1d1d' : '#94a3b8';
  ctx.shadowBlur = isChargingSky || isBasicSlashing ? 14 : 7;

  // 劍刃漸變顏色 (Form Specific Blade Styling)
  const bladeGrad = ctx.createLinearGradient(-bladeW * 0.5, 0, bladeW * 0.5, 0);
  if (form === 'light') {
    // 光形態：金白能量包裹，光刃輪廓純淨銳利
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.35, '#fef08a');
    bladeGrad.addColorStop(0.75, '#f59e0b');
    bladeGrad.addColorStop(1, '#b45309');
  } else if (form === 'dark') {
    // 暗形態：黑紫能量繚繞，劍身暗紅骨架
    bladeGrad.addColorStop(0, '#fecaca');
    bladeGrad.addColorStop(0.3, '#7f1d1d');
    bladeGrad.addColorStop(0.7, '#3b0764');
    bladeGrad.addColorStop(1, '#180828');
  } else {
    // 初始形態：黑鐵／銀灰色，帶有暗金能量流
    bladeGrad.addColorStop(0, '#cbd5e1');
    bladeGrad.addColorStop(0.35, '#94a3b8');
    bladeGrad.addColorStop(0.65, '#475569');
    bladeGrad.addColorStop(1, '#1e293b');
  }

  // (1) 魔劍雙刃 (具有雕琢鋒刃與戰損刻痕)
  ctx.fillStyle = bladeGrad;
  ctx.beginPath();
  ctx.moveTo(0, -swordLen * 0.65); // 鋒利劍尖
  ctx.lineTo(bladeW * 0.48, -swordLen * 0.15); // 右側鋒口
  ctx.lineTo(bladeW * 0.42, -swordLen * 0.05); // 戰損缺刻細節
  ctx.lineTo(bladeW * 0.48, swordLen * 0.05);
  ctx.lineTo(bladeW * 0.38, swordLen * 0.34);
  ctx.lineTo(0, swordLen * 0.40); // 劍底
  ctx.lineTo(-bladeW * 0.38, swordLen * 0.34);
  ctx.lineTo(-bladeW * 0.48, swordLen * 0.05);
  ctx.lineTo(-bladeW * 0.42, -swordLen * 0.05); // 戰損缺刻細節
  ctx.lineTo(-bladeW * 0.48, -swordLen * 0.15);
  ctx.closePath();
  ctx.fill();

  // (2) 劍脊血槽與能量符印 (Central Fuller Channel)
  ctx.strokeStyle = form === 'light' ? '#ffffff' : form === 'dark' ? '#ef4444' : '#fef08a';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(0, -swordLen * 0.58);
  ctx.lineTo(0, swordLen * 0.35);
  ctx.stroke();

  // (3) 翼型劍格護手 (Crossguard)
  ctx.fillStyle = form === 'light' ? '#f59e0b' : form === 'dark' ? '#3b0764' : '#1e293b';
  ctx.strokeStyle = form === 'light' ? '#fef08a' : form === 'dark' ? '#ef4444' : '#64748b';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-bladeW * 0.85, swordLen * 0.36);
  ctx.lineTo(-bladeW * 0.2, swordLen * 0.34);
  ctx.lineTo(0, swordLen * 0.32);
  ctx.lineTo(bladeW * 0.2, swordLen * 0.34);
  ctx.lineTo(bladeW * 0.85, swordLen * 0.36);
  ctx.lineTo(bladeW * 0.75, swordLen * 0.44);
  ctx.lineTo(-bladeW * 0.75, swordLen * 0.44);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // (4) 劍柄與劍首能量結晶 (Hilt & Pommel Core Gem)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-bladeW * 0.14, swordLen * 0.44, bladeW * 0.28, swordLen * 0.18);

  // 劍首能量結晶 (與核心同款寶石)
  ctx.fillStyle = form === 'light' ? '#fef08a' : form === 'dark' ? '#ef4444' : '#94a3b8';
  ctx.shadowColor = form === 'light' ? '#fbbf24' : form === 'dark' ? '#dc2626' : '#cbd5e1';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(0, swordLen * 0.65, bladeW * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // sword transform

  // -------------------------------------------------------------
  // 11. 3D 金屬微反射光學高光 (Fine Metallic Specular Reflection)
  // -------------------------------------------------------------
  drawStandardSpecularGlint(ctx, x, y, radius, '#ffffff');

  ctx.restore();
}

/**
 * 傀儡師 (Kuileishi - Puppeteer) 專屬高階 3D 角色外觀渲染
 * 特色：
 * 1. 命運傀儡線：周圍漂浮 3 條發光傀儡線，輕盈靈動飄逸
 * 2. 精密機巧木紋與關節縫線：呈現傀儡大師的特殊工藝
 * 3. 核心紫水晶法晶：中央八角形璀璨紫晶與流動符文光脈
 * 4. 傀儡共鳴層數 (1~3)：周圍環繞三枚共鳴法球，3層滿額進入「終幕待命」炫彩共鳴環
 */
export function drawKuileishiFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  options: {
    resonanceStacks?: number;
    finaleStandby?: boolean;
    tetherAnimTimer?: number;
    aegisTimer?: number;
    puppetsCount?: number;
    targetX?: number;
    targetY?: number;
    vx?: number;
    vy?: number;
  } = {}
) {
  ctx.save();

  const resonance = options.resonanceStacks || 0;
  const isStandby = options.finaleStandby || false;

  // 計算目標眼神凝視方向 (指向敵人或速度方向)
  let aimAngle = time * 0.3;
  if (options.targetX !== undefined && options.targetY !== undefined) {
    aimAngle = Math.atan2(options.targetY - y, options.targetX - x);
  } else if (options.vx && options.vy && Math.hypot(options.vx, options.vy) > 10) {
    aimAngle = Math.atan2(options.vy, options.vx);
  }

  // -------------------------------------------------------------
  // 1. 懸浮提線十字木架 (Floating Marionette Control Crossbar)
  // -------------------------------------------------------------
  ctx.save();
  const crossTilt = Math.sin(time * 1.5) * 0.12;
  const crossY = y - radius * 0.62;
  const crossLength = radius * 1.35;
  const crossWidth = radius * 0.28;

  ctx.translate(x, crossY);
  ctx.rotate(crossTilt);

  // 十字架木質主體陰影
  ctx.fillStyle = '#270e06';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.0;

  // 橫樑 (Horizontal bar)
  ctx.beginPath();
  ctx.roundRect(-crossLength * 0.5, -crossWidth * 0.5, crossLength, crossWidth, 3);
  ctx.fill();
  ctx.stroke();

  // 縱樑 (Vertical bar)
  ctx.beginPath();
  ctx.roundRect(-crossWidth * 0.5, -crossLength * 0.45, crossWidth, crossLength * 0.9, 3);
  ctx.fill();
  ctx.stroke();

  // 十字中心黃銅榫接箍扣
  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#d97706';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(0, 0, crossWidth * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // 4 個末端提線黃銅線軸與懸垂命運線
  const pegPositions = [
    [-crossLength * 0.46, 0],
    [crossLength * 0.46, 0],
    [0, -crossLength * 0.4],
    [0, crossLength * 0.4]
  ];

  ctx.restore(); // 恢復坐標系以繪製自木架垂懸至球體的命運線

  for (let p = 0; p < pegPositions.length; p++) {
    const [lx, ly] = pegPositions[p];
    // 經旋轉轉換後的全局端點坐標
    const cosT = Math.cos(crossTilt);
    const sinT = Math.sin(crossTilt);
    const pegGlobalX = x + (lx * cosT - ly * sinT);
    const pegGlobalY = crossY + (lx * sinT + ly * cosT);

    // 提線微軸釘
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(pegGlobalX, pegGlobalY, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 懸垂至球體外環的精細命運絲線
    const ringAngle = (p * Math.PI) / 2 + Math.PI / 4;
    const anchorX = x + Math.cos(ringAngle) * (radius * 0.85);
    const anchorY = y + Math.sin(ringAngle) * (radius * 0.85);

    ctx.save();
    ctx.strokeStyle = p % 2 === 0 ? 'rgba(232, 121, 249, 0.65)' : 'rgba(192, 132, 252, 0.5)';
    ctx.lineWidth = 0.9;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(pegGlobalX, pegGlobalY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 2. 命運機關星盤與刻紋齒輪環 (Clockwork Gear Ring & Runed Dial)
  // -------------------------------------------------------------
  ctx.save();
  const gearR = radius * 0.80;
  const gearSpin = time * 0.6;
  const teeth = 12;

  // 外圈黃銅微齒輪
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < teeth; i++) {
    const gAngle = gearSpin + (i * Math.PI * 2) / teeth;
    const gx1 = x + Math.cos(gAngle) * (gearR - 1.5);
    const gy1 = y + Math.sin(gAngle) * (gearR - 1.5);
    const gx2 = x + Math.cos(gAngle) * (gearR + 2.2);
    const gy2 = y + Math.sin(gAngle) * (gearR + 2.2);
    ctx.beginPath();
    ctx.moveTo(gx1, gy1);
    ctx.lineTo(gx2, gy2);
    ctx.stroke();
  }

  // 齒輪基底環
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(x, y, gearR, 0, Math.PI * 2);
  ctx.stroke();

  // 內層球節嵌合深色雕刻與紫晶魔力紋理
  ctx.strokeStyle = 'rgba(88, 28, 135, 0.7)';
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const x1 = x + Math.cos(ang) * (radius * 0.28);
    const y1 = y + Math.sin(ang) * (radius * 0.28);
    const x2 = x + Math.cos(ang) * (radius * 0.78);
    const y2 = y + Math.sin(ang) * (radius * 0.78);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 關節固定金屬圓釘
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x2, y2, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 3. 古典悲喜半面瓷假面 (Classical Porcelain Marionette Half-Mask)
  // -------------------------------------------------------------
  ctx.save();
  // 假面位於前上方半球，展現古典威尼斯面具優雅流線
  ctx.save();
  ctx.beginPath();
  ctx.arc(x - radius * 0.1, y - radius * 0.12, radius * 0.52, -Math.PI * 0.85, Math.PI * 0.15);
  ctx.quadraticCurveTo(x + radius * 0.4, y + radius * 0.2, x - radius * 0.1, y + radius * 0.35);
  ctx.closePath();

  // 面具高級象牙白瓷漸層
  const maskGrad = ctx.createLinearGradient(x - radius * 0.5, y - radius * 0.5, x + radius * 0.3, y + radius * 0.3);
  maskGrad.addColorStop(0, '#ffffff');
  maskGrad.addColorStop(0.5, '#f5f3ff');
  maskGrad.addColorStop(0.85, '#e9d5ff');
  maskGrad.addColorStop(1, '#c084fc');

  ctx.fillStyle = maskGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 6;
  ctx.fill();

  // 假面外緣金箔描邊 (Gold Filigree Trim)
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.75)';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // 4. 傀儡師靈魂凝視眼眶 (Marionette Amethyst Eye)
  // 雙眼位置自適應凝視目標方位
  const eyeOffsetX = Math.cos(aimAngle) * (radius * 0.08);
  const eyeOffsetY = Math.sin(aimAngle) * (radius * 0.08);

  const leftEyeX = x - radius * 0.22 + eyeOffsetX;
  const leftEyeY = y - radius * 0.14 + eyeOffsetY;
  const rightEyeX = x + radius * 0.14 + eyeOffsetX;
  const rightEyeY = y - radius * 0.14 + eyeOffsetY;

  // 繪製雙眸 (古典木偶眼窩與深紫光瞳)
  [ [leftEyeX, leftEyeY], [rightEyeX, rightEyeY] ].forEach(([ex, ey], idx) => {
    ctx.save();
    // 杏仁狀木偶眼眶
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(ex, ey, radius * 0.11, radius * 0.07, aimAngle * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 發光紫曜虹膜
    ctx.fillStyle = isStandby ? '#f43f5e' : '#c084fc';
    ctx.shadowColor = isStandby ? '#f43f5e' : '#a855f7';
    ctx.shadowBlur = isStandby ? 10 : 5;
    ctx.beginPath();
    ctx.arc(ex + Math.cos(aimAngle) * 1.5, ey + Math.sin(aimAngle) * 1.5, radius * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔高光鑽石白光點
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - 0.7, ey - 0.7, 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 左眼下方古典淚滴印記 (Marionette Commedia Teardrop Jewel)
    if (idx === 0) {
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.moveTo(ex, ey + 4.5);
      ctx.lineTo(ex - 1.3, ey + 8.5);
      ctx.lineTo(ex + 1.3, ey + 8.5);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.restore();

  // -------------------------------------------------------------
  // 5. 命運傀儡線 (三條周身流轉漂浮的發光半透明魔絲)
  // -------------------------------------------------------------
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const baseAngle = (i * Math.PI * 2) / 3 + time * 1.6;
    const wave1 = Math.sin(time * 3.5 + i * 2) * 3;
    const wave2 = Math.cos(time * 4.2 + i * 2.5) * 4;

    const sx = x + Math.cos(baseAngle) * (radius * 0.85);
    const sy = y + Math.sin(baseAngle) * (radius * 0.85);

    const cp1x = x + Math.cos(baseAngle + 0.3) * (radius + 5 + wave1);
    const cp1y = y + Math.sin(baseAngle + 0.3) * (radius + 5 + wave1);
    const cp2x = x + Math.cos(baseAngle + 0.6) * (radius + 9 + wave2);
    const cp2y = y + Math.sin(baseAngle + 0.6) * (radius + 9 + wave2);
    const ex = x + Math.cos(baseAngle + 0.9) * (radius + 6 + wave1 * 0.5);
    const ey = y + Math.sin(baseAngle + 0.9) * (radius + 6 + wave1 * 0.5);

    ctx.strokeStyle = i === 0 ? 'rgba(244, 114, 182, 0.88)' : (i === 1 ? 'rgba(192, 132, 252, 0.8)' : 'rgba(232, 121, 249, 0.75)');
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
    ctx.stroke();

    // 絲線末端懸浮光點
    ctx.fillStyle = '#faf5ff';
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 6. 中央八角命運紫晶魔核 (Central Enchanted Amethyst Gem)
  // -------------------------------------------------------------
  ctx.save();
  const coreR = radius * 0.34;
  const coreGrad = ctx.createRadialGradient(x - 1.2, y - 1.2, 0, x, y, coreR);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.2, '#f5d0fe');
  coreGrad.addColorStop(0.6, isStandby ? '#f43f5e' : '#9333ea');
  coreGrad.addColorStop(1, '#2e1065');

  ctx.fillStyle = coreGrad;
  ctx.shadowColor = isStandby ? '#f43f5e' : '#c084fc';
  ctx.shadowBlur = isStandby ? 18 : 10;

  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI * 2) / 8 + time * 0.7;
    const px = x + Math.cos(a) * coreR;
    const py = y + Math.sin(a) * coreR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // 金色刻面鑲嵌爪環 (Gold Filigree Prongs)
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // 晶體內核微縮十字法印
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x - coreR * 0.45, y);
  ctx.lineTo(x + coreR * 0.45, y);
  ctx.moveTo(x, y - coreR * 0.45);
  ctx.lineTo(x, y + coreR * 0.45);
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 7. 傀儡共鳴層數法球 (Resonance Orbs: 1~3層) 與 終幕待命星芒陣 (Finale Standby Matrix)
  // -------------------------------------------------------------
  if (resonance > 0) {
    ctx.save();
    const orbDist = radius + 11;
    const orbSpin = time * (isStandby ? 4.2 : 1.8);

    for (let r = 0; r < 3; r++) {
      const active = r < resonance;
      const angle = orbSpin + (r * Math.PI * 2) / 3;
      const ox = x + Math.cos(angle) * orbDist;
      const oy = y + Math.sin(angle) * orbDist;

      if (active) {
        // 發光共鳴球
        ctx.fillStyle = isStandby ? '#fb7185' : '#e879f9';
        ctx.shadowColor = isStandby ? '#f43f5e' : '#c084fc';
        ctx.shadowBlur = isStandby ? 14 : 8;
        ctx.beginPath();
        ctx.arc(ox, oy, isStandby ? 3.6 : 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 內部白色高光核心
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox - 0.8, oy - 0.8, isStandby ? 1.5 : 1.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(147, 51, 234, 0.25)';
        ctx.beginPath();
        ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 終幕共鳴待命 (Finale Standby)：三顆共鳴球連成發光魔三角法陣環
    if (isStandby) {
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      for (let r = 0; r < 3; r++) {
        const angle = orbSpin + (r * Math.PI * 2) / 3;
        const ox = x + Math.cos(angle) * orbDist;
        const oy = y + Math.sin(angle) * orbDist;
        if (r === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.stroke();

      // 三角陣核心外擴魔力微光波
      ctx.strokeStyle = `rgba(253, 164, 175, ${0.4 + Math.sin(time * 8) * 0.3})`;
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(x, y, orbDist + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 8. 傀儡護幕主體守護微光 (Puppeteer Shield Glow when Aegis active)
  // -------------------------------------------------------------
  if (options.aegisTimer && options.aegisTimer > 0) {
    ctx.save();
    const alpha = Math.min(1.0, options.aegisTimer / 1.5);
    ctx.strokeStyle = `rgba(192, 132, 252, ${0.85 * alpha})`;
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 14;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(x, y, radius + 5, time * 2.5, time * 2.5 + Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 9. 光學高光
  drawStandardSpecularGlint(ctx, x, y, radius, '#e9d5ff');

  ctx.restore();
}

/**
 * 獨立召喚戰鬥傀儡 (Combat Puppet) 實體渲染
 * 特色：
 * 1. 精緻實木球體雕紋 (radius: 13px)
 * 2. 命運傀儡線：自傀儡師本體牽引至傀儡之發光魔線
 * 3. 3 條獨立生命條 Overhead 指示器 (外殼 / 關節 / 核心)
 * 4. 受損階段外觀外殼碎裂與核心外露特效
 * 5. 護幕展開時木盾結界與終幕交叉突進斬光影
 */
export function drawCombatPuppet(
  ctx: CanvasRenderingContext2D,
  puppet: CombatPuppet,
  masterX: number,
  masterY: number,
  time: number
) {
  ctx.save();
  const px = puppet.x;
  const py = puppet.y;
  const r = puppet.radius;

  // -------------------------------------------------------------
  // A. 命運傀儡線 (Connecting Fate Thread from Master to Puppet)
  // -------------------------------------------------------------
  ctx.save();
  const isLineFlashing = puppet.lineFlashTimer > 0;
  const lineAlpha = isLineFlashing ? 0.95 : 0.65;
  const midX = (masterX + px) / 2 + Math.sin(time * 5 + puppet.id.charCodeAt(0)) * 5;
  const midY = (masterY + py) / 2 + Math.cos(time * 5 + puppet.id.charCodeAt(0)) * 5;

  ctx.strokeStyle = isLineFlashing ? 'rgba(255, 255, 255, 0.95)' : `rgba(192, 132, 252, ${lineAlpha})`;
  ctx.lineWidth = isLineFlashing ? 2.0 : 1.2;
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = isLineFlashing ? 10 : 5;
  ctx.beginPath();
  ctx.moveTo(masterX, masterY);
  ctx.quadraticCurveTo(midX, midY, px, py);
  ctx.stroke();

  // 傀儡線上滑動流轉的魔力微粒
  const travelT = ((time * 2.2 + (puppet.id.charCodeAt(0) % 5) * 0.2) % 1);
  const flowX = (1 - travelT) * (1 - travelT) * masterX + 2 * (1 - travelT) * travelT * midX + travelT * travelT * px;
  const flowY = (1 - travelT) * (1 - travelT) * masterY + 2 * (1 - travelT) * travelT * midY + travelT * travelT * py;

  ctx.fillStyle = '#faf5ff';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(flowX, flowY, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // -------------------------------------------------------------
  // B. 終幕交叉斬擊突進殘影 (Finale Dash Trail)
  // -------------------------------------------------------------
  if (puppet.finaleDashTimer > 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(px - puppet.vx * 0.08, py - puppet.vy * 0.08);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.restore();
  }

  // 攻擊斬擊弧光 (Slash Attack Crescent Effect)
  if (puppet.slashAnimTimer > 0) {
    ctx.save();
    const slashAngle = Math.atan2(puppet.vy, puppet.vx) || 0;
    const slashProgress = 1 - (puppet.slashAnimTimer / 0.25);
    const slashSweep = (slashProgress - 0.5) * 1.8;

    ctx.strokeStyle = 'rgba(232, 121, 249, 0.95)';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, r + 9, slashAngle + slashSweep - 0.6, slashAngle + slashSweep + 0.6);
    ctx.stroke();

    // 刀光外緣銳利亮白色
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(px, py, r + 9, slashAngle + slashSweep - 0.25, slashAngle + slashSweep + 0.25);
    ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // C. 傀儡球體本體 (14px Wood Sphere & Joint Mechanism)
  // -------------------------------------------------------------
  ctx.save();
  const isHitFlashing = puppet.hitFlashTimer > 0;

  // 依據損壞階段階梯渲染球體表面
  // Segment 1: 完美厚實木殼
  // Segment 2: 木殼碎裂，露出紫金機械關節
  // Segment 3: 機甲崩解，核心魔法光核劇烈顯現
  const puppetGrad = ctx.createRadialGradient(px - r * 0.35, py - r * 0.35, 1, px, py, r);
  if (isHitFlashing) {
    puppetGrad.addColorStop(0, '#ffffff');
    puppetGrad.addColorStop(1, '#e9d5ff');
  } else if (puppet.currentSegment === 1) {
    // 完好木偶外殼 (橡木與青銅雕花)
    puppetGrad.addColorStop(0, '#fef08a');
    puppetGrad.addColorStop(0.3, '#d97706');
    puppetGrad.addColorStop(0.75, '#78350f');
    puppetGrad.addColorStop(1, '#451a03');
  } else if (puppet.currentSegment === 2) {
    // 木殼碎裂，紫光魔力關節
    puppetGrad.addColorStop(0, '#e9d5ff');
    puppetGrad.addColorStop(0.35, '#9333ea');
    puppetGrad.addColorStop(0.75, '#581c87');
    puppetGrad.addColorStop(1, '#1e1b4b');
  } else {
    // 核心裸露，亮粉紫高能狀態
    puppetGrad.addColorStop(0, '#ffffff');
    puppetGrad.addColorStop(0.35, '#f43f5e');
    puppetGrad.addColorStop(0.8, '#881337');
    puppetGrad.addColorStop(1, '#0f0728');
  }

  ctx.fillStyle = puppetGrad;
  ctx.shadowColor = puppet.currentSegment === 3 ? '#f43f5e' : '#78350f';
  ctx.shadowBlur = puppet.currentSegment === 3 ? 12 : 5;
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fill();

  // 傀儡球體邊緣雕花箍環
  ctx.strokeStyle = puppet.currentSegment === 1 ? '#92400e' : '#c084fc';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 傀儡球體雕刻關節十字紋
  ctx.strokeStyle = puppet.currentSegment === 3 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 27, 75, 0.7)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(px - r * 0.7, py);
  ctx.lineTo(px + r * 0.7, py);
  ctx.moveTo(px, py - r * 0.7);
  ctx.lineTo(px, py + r * 0.7);
  ctx.stroke();

  // 傀儡中央微型靈魂晶石 (Puppet Core Gem)
  ctx.fillStyle = puppet.currentSegment === 3 ? '#ffffff' : '#c084fc';
  ctx.shadowColor = '#e879f9';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(px, py, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // 受損破片裂痕 (Segment 2 / 3 視覺碎紋)
  if (puppet.currentSegment >= 2) {
    ctx.strokeStyle = '#fae8ff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px - 4, py - 6);
    ctx.lineTo(px - 1, py - 2);
    ctx.lineTo(px + 4, py - 4);
    ctx.stroke();
  }
  ctx.restore();

  // -------------------------------------------------------------
  // D. 傀儡護幕前方守護盾 (Puppet Aegis Guardian Shield)
  // -------------------------------------------------------------
  if (puppet.shieldActiveTimer > 0) {
    ctx.save();
    const shieldAngle = Math.atan2(puppet.vy, puppet.vx) || 0;
    const shieldDist = r + 6;
    const sx = px + Math.cos(shieldAngle) * shieldDist;
    const sy = py + Math.sin(shieldAngle) * shieldDist;

    // 半透明三層法陣弧形木盾
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.9)';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, r + 7, shieldAngle - 0.7, shieldAngle + 0.7);
    ctx.stroke();

    // 內層紫色流光防護符紋
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.9)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, r + 5, shieldAngle - 0.55, shieldAngle + 0.55);
    ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // E. 3 條獨立生命條 (3-Segment Overhead Health Indicators)
  // 1: 木質外殼(20 HP, 金橙) / 2: 關節魔力(20 HP, 亮紫) / 3: 核心魔晶(20 HP, 亮粉)
  // -------------------------------------------------------------
  ctx.save();
  const barW = 7;
  const barH = 2.6;
  const gap = 1.6;
  const totalW = barW * 3 + gap * 2;
  const startX = px - totalW / 2;
  const startY = py - r - 8;

  // 底色背板
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(startX - 1.5, startY - 1, totalW + 3, barH + 2);

  for (let s = 1; s <= 3; s++) {
    const segX = startX + (s - 1) * (barW + gap);
    let fillRatio = 0;
    let segColor = '#d97706'; // 外殼

    if (s === 1) {
      segColor = '#f59e0b'; // 木殼
      if (puppet.currentSegment === 1) {
        fillRatio = Math.max(0, Math.min(1, puppet.segmentHp / 20));
      } else {
        fillRatio = 0; // 已被破壞
      }
    } else if (s === 2) {
      segColor = '#a855f7'; // 關節
      if (puppet.currentSegment === 1) {
        fillRatio = 1; // 尚存完好
      } else if (puppet.currentSegment === 2) {
        fillRatio = Math.max(0, Math.min(1, puppet.segmentHp / 20));
      } else {
        fillRatio = 0; // 已破壞
      }
    } else if (s === 3) {
      segColor = '#f43f5e'; // 核心
      if (puppet.currentSegment < 3) {
        fillRatio = 1; // 尚存完好
      } else {
        fillRatio = Math.max(0, Math.min(1, puppet.segmentHp / 20));
      }
    }

    // 槽底
    ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.fillRect(segX, startY, barW, barH);

    // 有效血條填充
    if (fillRatio > 0) {
      ctx.fillStyle = segColor;
      ctx.shadowColor = segColor;
      ctx.shadowBlur = 3;
      ctx.fillRect(segX, startY, barW * fillRatio, barH);
    }
  }
  ctx.restore();

  ctx.restore();
}

/**
 * 一拳尹雄｜一拳英雄 (Yinyong) 視覺渲染器
 * 核心視覺規則：
 * 1. 球體：完整球型，主色黑色＋深灰色 (#090d16, #0f172a, #1e293b)。
 * 2. 表面：強壯拳擊風格、肌肉線條、重型手臂結構、暗紅色能量裂紋。
 * 3. 中央：紅橙色核心 (#ea580c ~ #f97316 ~ #ffffff)。
 * 4. 左右：大型拳頭 (視覺部件，無獨立碰撞體，不改變球體碰撞半徑與傷害)。
 * 5. 蓄力進程 (0~22s)：
 *    - 0~5s: 拳頭微弱紅光，核心發亮，少量紅色粒子。
 *    - 5~14s: 手臂能量裂紋變亮，拳頭能量增加。
 *    - 14~21s: 能量快速集中，拳頭產生壓縮波，身體周圍紅色怒氣。
 *    - 21~22s: 能量極限集中，拳頭高亮紅白金光，核心橙紅高亮，裂紋完全亮起。
 * 6. 身後宣告 (2.5s)：在目標身後，拳頭對準目標持續壓縮，最後0.5s強烈壓縮波。
 * 7. 一拳必殺：拳頭向前爆發，巨大拳擊輪廓、紅黑衝擊波。
 * 8. 越挫越勇 (0~10層)：每層裂紋變亮、拳頭能量增強，10層完整怒氣光環。
 * 9. 不死之血：回滿生命爆發波。
 */
export function drawYinyongFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  options: {
    state?: 'READY' | 'SEARCHING' | 'CHARGING' | 'TELEPORTING' | 'DECLARING' | 'PUNCHING' | 'SUCCESS' | 'MISS' | 'COOLDOWN' | 'FAIL_RECOVERY';
    chargeTimer?: number;
    maxCharge?: number;
    declareTimer?: number;
    punchAnimTimer?: number;
    missAnimTimer?: number;
    rageStacks?: number;
    boundlessActive?: boolean;
    immortalAnimTimer?: number;
    targetX?: number;
    targetY?: number;
    vx?: number;
    vy?: number;
  } = {}
) {
  ctx.save();

  const state = options.state || 'READY';
  const chargeTimer = options.chargeTimer ?? 0;
  const maxCharge = options.maxCharge || 22.0;
  const chargeProgress = Math.min(1.0, Math.max(0, chargeTimer / maxCharge));
  const rageStacks = Math.min(10, Math.max(0, options.rageStacks ?? 0));
  const declareTimer = options.declareTimer ?? 0;
  const isDeclaring = state === 'DECLARING' || declareTimer > 0;
  const isPunching = state === 'PUNCHING' || (options.punchAnimTimer ?? 0) > 0;
  const punchTimer = options.punchAnimTimer ?? 0;
  const isMissing = state === 'MISS' || (options.missAnimTimer ?? 0) > 0;
  const isImmortalBurst = (options.immortalAnimTimer ?? 0) > 0;

  // 計算朝向目標的角度 (面向目標或速度方向)
  let aimAngle = 0;
  if (options.targetX !== undefined && options.targetY !== undefined) {
    aimAngle = Math.atan2(options.targetY - y, options.targetX - x);
  } else if (options.vx && options.vy && Math.hypot(options.vx, options.vy) > 10) {
    aimAngle = Math.atan2(options.vy, options.vx);
  }

  // -------------------------------------------------------------
  // 1. 越挫越勇 & 高階蓄力 怒氣光環 (Rage Aura)
  // -------------------------------------------------------------
  const hasRageAura = rageStacks > 0 || chargeTimer >= 14 || isDeclaring;
  if (hasRageAura) {
    ctx.save();
    const auraIntensity = Math.min(1.0, (rageStacks / 10) * 0.7 + (chargeTimer >= 14 ? 0.3 : 0));
    const pulse = 1.0 + Math.sin(time * 8) * 0.08 * auraIntensity;
    const auraRadius = radius * (1.18 + auraIntensity * 0.28) * pulse;

    const auraGrad = ctx.createRadialGradient(x, y, radius * 0.8, x, y, auraRadius);
    if (rageStacks >= 10) {
      // 10層滿層：毀滅級烈焰怒氣環
      auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      auraGrad.addColorStop(0.55, 'rgba(185, 28, 28, 0.35)');
      auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    } else {
      auraGrad.addColorStop(0, `rgba(239, 68, 68, ${0.15 + auraIntensity * 0.25})`);
      auraGrad.addColorStop(0.7, `rgba(185, 28, 28, ${0.08 + auraIntensity * 0.15})`);
      auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    // 怒氣外緣尖銳焰舌
    if (rageStacks >= 5 || chargeTimer >= 14) {
      const flameCount = 8;
      ctx.strokeStyle = rageStacks >= 10 ? 'rgba(254, 202, 202, 0.6)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < flameCount; i++) {
        const fa = (i / flameCount) * Math.PI * 2 + time * 2;
        const flen = radius * (0.2 + 0.15 * Math.sin(time * 12 + i));
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(fa) * radius, y + Math.sin(fa) * radius);
        ctx.lineTo(x + Math.cos(fa) * (radius + flen), y + Math.sin(fa) * (radius + flen));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 2. 球體主體底色 (黑色＋深灰色 3D 質感)
  // -------------------------------------------------------------
  ctx.save();
  const sphereGrad = ctx.createRadialGradient(
    x - radius * 0.32,
    y - radius * 0.32,
    radius * 0.15,
    x,
    y,
    radius
  );
  sphereGrad.addColorStop(0, '#334155'); // 頂部受光暗藍灰
  sphereGrad.addColorStop(0.4, '#1e293b'); // 中間石墨深灰
  sphereGrad.addColorStop(0.85, '#0f172a'); // 暗部墨黑
  sphereGrad.addColorStop(1, '#020617'); // 邊緣極深黑

  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // 邊緣精緻暗金紅微光切邊
  ctx.strokeStyle = isDeclaring || chargeTimer >= 21
    ? 'rgba(239, 68, 68, 0.85)'
    : rageStacks > 0
    ? `rgba(220, 38, 38, ${0.4 + (rageStacks / 10) * 0.4})`
    : 'rgba(51, 65, 85, 0.6)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 3. 肌肉線條與拳擊重型手臂裝甲結構 (Muscular Boxing Contours)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(aimAngle);

  // 肌肉胸肌與背肌輪廓線 (深邃陰影刻線)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  // 胸肌弧線
  ctx.arc(0, -radius * 0.28, radius * 0.48, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, radius * 0.28, radius * 0.48, Math.PI + 0.2, Math.PI * 2 - 0.2);
  ctx.stroke();

  // 肩部重型三角肌裝甲外殼弧線
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.82, -Math.PI * 0.45, -Math.PI * 0.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.82, Math.PI * 0.1, Math.PI * 0.45);
  ctx.stroke();

  ctx.restore();

  // -------------------------------------------------------------
  // 4. 暗紅色能量裂紋 (Energy Cracks)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(aimAngle);

  // 根據蓄力進度與暴怒層數計算裂紋亮度與光暈
  let crackAlpha = 0.35 + (rageStacks / 10) * 0.35;
  let crackColor = '#b91c1c';
  if (chargeTimer >= 21 || isDeclaring) {
    crackColor = '#fecaca'; // 紅白極限
    crackAlpha = 0.95;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
  } else if (chargeTimer >= 14) {
    crackColor = '#ef4444';
    crackAlpha = 0.85;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 6;
  } else if (chargeTimer >= 5) {
    crackColor = '#dc2626';
    crackAlpha = 0.65;
  }

  ctx.strokeStyle = crackColor;
  ctx.globalAlpha = crackAlpha;
  ctx.lineWidth = 1.2;

  // 裂紋分支 1: 朝向右上拳臂
  ctx.beginPath();
  ctx.moveTo(radius * 0.2, 0);
  ctx.lineTo(radius * 0.45, -radius * 0.25);
  ctx.lineTo(radius * 0.65, -radius * 0.22);
  ctx.lineTo(radius * 0.82, -radius * 0.4);
  ctx.stroke();

  // 裂紋分支 2: 朝向右下拳臂
  ctx.beginPath();
  ctx.moveTo(radius * 0.2, 0);
  ctx.lineTo(radius * 0.45, radius * 0.25);
  ctx.lineTo(radius * 0.65, radius * 0.22);
  ctx.lineTo(radius * 0.82, radius * 0.4);
  ctx.stroke();

  // 裂紋分支 3: 朝背部延伸
  ctx.beginPath();
  ctx.moveTo(-radius * 0.18, 0);
  ctx.lineTo(-radius * 0.45, -radius * 0.2);
  ctx.lineTo(-radius * 0.72, -radius * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius * 0.18, 0);
  ctx.lineTo(-radius * 0.45, radius * 0.2);
  ctx.lineTo(-radius * 0.72, radius * 0.15);
  ctx.stroke();

  ctx.restore();

  // -------------------------------------------------------------
  // 5. 中央紅橙色核心 (Central Red-Orange Core)
  // -------------------------------------------------------------
  ctx.save();
  const coreR = radius * 0.26;
  let corePulse = 1.0;
  if (chargeTimer >= 21 || isDeclaring) {
    corePulse = 1.0 + Math.sin(time * 24) * 0.16;
  } else if (chargeTimer >= 14) {
    corePulse = 1.0 + Math.sin(time * 12) * 0.10;
  } else if (chargeTimer >= 5) {
    corePulse = 1.0 + Math.sin(time * 6) * 0.05;
  }

  const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, coreR * corePulse);
  if (chargeTimer >= 21 || isDeclaring) {
    coreGrad.addColorStop(0, '#ffffff'); // 紅白核心
    coreGrad.addColorStop(0.3, '#fef08a'); // 金色能量環
    coreGrad.addColorStop(0.7, '#f97316'); // 烈橙
    coreGrad.addColorStop(1, '#ef4444');
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
  } else if (chargeTimer >= 14) {
    coreGrad.addColorStop(0, '#ffedd5');
    coreGrad.addColorStop(0.4, '#f97316');
    coreGrad.addColorStop(1, '#dc2626');
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
  } else if (chargeTimer >= 5) {
    coreGrad.addColorStop(0, '#f97316');
    coreGrad.addColorStop(0.7, '#ea580c');
    coreGrad.addColorStop(1, '#991b1b');
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 4;
  } else {
    // 平常狀態：核心低亮度
    coreGrad.addColorStop(0, '#ea580c');
    coreGrad.addColorStop(0.6, '#9a3412');
    coreGrad.addColorStop(1, '#451a03');
  }

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(x, y, coreR * corePulse, 0, Math.PI * 2);
  ctx.fill();

  // 核心外緣精密金屬固定扣環
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, coreR * corePulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------
  // 6. 原地極限蓄勢聚氣陣 (Stationary Punch Stance Array)
  // -------------------------------------------------------------
  if (state === 'CHARGING') {
    ctx.save();
    const chargeRingRadius = radius * (1.35 + 0.1 * Math.sin(time * 6));
    const ringAlpha = 0.35 + chargeProgress * 0.45;
    
    // 原地定錨力場光環
    ctx.strokeStyle = chargeProgress > 0.95 ? 'rgba(254, 240, 138, 0.9)' : `rgba(239, 68, 68, ${ringAlpha})`;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, chargeRingRadius, time * 2, time * 2 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 匯聚向核心的氣流旋渦弧線
    const vortexCount = 3;
    ctx.strokeStyle = `rgba(249, 115, 22, ${0.4 + chargeProgress * 0.4})`;
    ctx.lineWidth = 1.2;
    for (let v = 0; v < vortexCount; v++) {
      const vAngle = (v / vortexCount) * Math.PI * 2 + time * 4;
      const startDist = chargeRingRadius * 1.25;
      const endDist = radius * 0.9;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(vAngle) * startDist, y + Math.sin(vAngle) * startDist);
      ctx.quadraticCurveTo(
        x + Math.cos(vAngle + 0.5) * (startDist * 0.8),
        y + Math.sin(vAngle + 0.5) * (startDist * 0.8),
        x + Math.cos(vAngle + 1.1) * endDist,
        y + Math.sin(vAngle + 1.1) * endDist
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 7. 左右大型重裝鐵拳 (Visual Heavy Boxing Gauntlets & Fists)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(aimAngle);

  // 拳頭配置：位於球體左右兩側 (垂直於朝向目標的角度)
  // 蓄力狀態：採取原地沉穩聚氣拳架，左前右後
  const fistRadius = radius * 0.44;
  const fistSideDist = radius * (state === 'CHARGING' ? 0.92 + Math.sin(time * 5) * 0.04 : 0.95);

  let rightFistForward = radius * 0.15;
  let leftFistForward = -radius * 0.05;

  if (state === 'CHARGING') {
    // 原地蓄力時：左拳穩架於前方防守，右重拳深蓄於側後蓄勢爆發
    leftFistForward = radius * 0.22 + Math.sin(time * 6) * 1.2;
    rightFistForward = -radius * 0.12 + chargeProgress * (radius * 0.28);
  } else if (isPunching) {
    // 拳頭向前爆發 (0.25~0.4s 動畫)
    const punchProgress = Math.max(0, Math.min(1, punchTimer / 0.35));
    const thrustDist = Math.sin(punchProgress * Math.PI) * radius * 1.8;
    rightFistForward += thrustDist;
  } else if (isDeclaring) {
    // 宣告最後 0.5s 快速聚能，拳頭高頻微震動
    const vibration = declareTimer <= 0.5 ? Math.sin(time * 40) * 1.6 : Math.sin(time * 15) * 0.6;
    rightFistForward += vibration;
    leftFistForward += -vibration;
  } else if (isMissing) {
    // 失敗落空後坐力收回
    rightFistForward -= radius * 0.2;
  }

  // 繪製重型拳擊拳套 (Heavy Boxing Glove with Knuckle Armor & Wrist Brace)
  const drawGauntletFist = (fx: number, fy: number, isMain: boolean) => {
    ctx.save();
    ctx.translate(fx, fy);

    // 拳頭聚能光影
    let fistGlowColor = '#ef4444';
    let fistGlowBlur = 0;
    if (chargeTimer >= 21 || isDeclaring) {
      fistGlowColor = isMain ? '#ffffff' : '#f87171';
      fistGlowBlur = isMain ? 16 : 9;
    } else if (chargeTimer >= 14) {
      fistGlowColor = '#f97316';
      fistGlowBlur = isMain ? 10 : 5;
    } else if (chargeTimer >= 5 || state === 'CHARGING') {
      fistGlowColor = '#dc2626';
      fistGlowBlur = isMain ? (4 + chargeProgress * 6) : 3;
    }

    if (fistGlowBlur > 0) {
      ctx.shadowColor = fistGlowColor;
      ctx.shadowBlur = fistGlowBlur;
    }

    // 1. 後方重裝金屬護腕 (Wrist Brace / Forearm Guard)
    ctx.save();
    ctx.fillStyle = chargeTimer >= 21 || isDeclaring ? '#991b1b' : '#1e293b';
    ctx.strokeStyle = chargeTimer >= 21 || isDeclaring ? '#facc15' : '#475569';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(-fistRadius * 0.95, -fistRadius * 0.55, fistRadius * 0.45, fistRadius * 1.1, 2);
    ctx.fill();
    ctx.stroke();

    // 護腕緊固鎖扣線
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-fistRadius * 0.72, -fistRadius * 0.45);
    ctx.lineTo(-fistRadius * 0.72, fistRadius * 0.45);
    ctx.stroke();
    ctx.restore();

    // 2. 拳頭本體 (深色流線 3D 金屬拳套)
    const fistGrad = ctx.createRadialGradient(
      -fistRadius * 0.2,
      -fistRadius * 0.2,
      fistRadius * 0.1,
      0,
      0,
      fistRadius
    );
    if (isMain && (chargeTimer >= 21 || isDeclaring)) {
      // 21~22秒極限蓄力：赤紅白熾金拳意
      fistGrad.addColorStop(0, '#ffffff');
      fistGrad.addColorStop(0.3, '#fee2e2');
      fistGrad.addColorStop(0.7, '#ef4444');
      fistGrad.addColorStop(1, '#7f1d1d');
    } else if (isMain && chargeTimer >= 14) {
      fistGrad.addColorStop(0, '#ffedd5');
      fistGrad.addColorStop(0.4, '#ea580c');
      fistGrad.addColorStop(0.85, '#991b1b');
      fistGrad.addColorStop(1, '#450a0a');
    } else if (isMain && state === 'CHARGING') {
      // 蓄力期間逐漸燃起赤紅拳意
      fistGrad.addColorStop(0, chargeProgress > 0.5 ? '#fca5a5' : '#64748b');
      fistGrad.addColorStop(0.45, chargeProgress > 0.5 ? '#dc2626' : '#334155');
      fistGrad.addColorStop(0.88, '#0f172a');
      fistGrad.addColorStop(1, '#020617');
    } else {
      fistGrad.addColorStop(0, '#475569');
      fistGrad.addColorStop(0.45, '#1e293b');
      fistGrad.addColorStop(0.9, '#0f172a');
      fistGrad.addColorStop(1, '#020617');
    }

    ctx.fillStyle = fistGrad;
    ctx.beginPath();
    ctx.arc(0, 0, fistRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. 拇指扣合護片 (Thumb Guard Clamp)
    ctx.fillStyle = chargeTimer >= 14 || isDeclaring ? '#dc2626' : '#334155';
    ctx.beginPath();
    ctx.ellipse(-fistRadius * 0.15, fistRadius * 0.65, fistRadius * 0.35, fistRadius * 0.22, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // 4. 四連硬化指節拳鋒護板 (Four Knuckle Guard Plates)
    const knuckleCount = 4;
    const kSpan = fistRadius * 1.2;
    for (let k = 0; k < knuckleCount; k++) {
      const ky = -kSpan * 0.5 + (k / (knuckleCount - 1)) * kSpan;
      const kx = fistRadius * 0.72 - Math.abs(ky) * 0.15;
      const kRad = fistRadius * 0.20;

      ctx.beginPath();
      ctx.arc(kx, ky, kRad, 0, Math.PI * 2);
      ctx.fillStyle = isMain && (chargeTimer >= 21 || isDeclaring)
        ? '#fef08a'
        : (isMain && chargeTimer >= 14)
        ? '#f97316'
        : (isMain && state === 'CHARGING')
        ? (chargeProgress > (k / 4) ? '#ef4444' : '#64748b')
        : '#475569';
      ctx.fill();

      // 指節鋼甲外框
      ctx.strokeStyle = isMain && (chargeTimer >= 21 || isDeclaring) ? '#ffffff' : '#1e293b';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // 5. 拳背中央能量晶核 (Fist Back Energy Core)
    const gemR = fistRadius * 0.26;
    ctx.fillStyle = isMain && (chargeTimer >= 21 || isDeclaring)
      ? '#ffffff'
      : (isMain && chargeTimer >= 14)
      ? '#ef4444'
      : (isMain && state === 'CHARGING')
      ? '#f97316'
      : '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, gemR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // 6. 拳甲暗金邊框
    ctx.strokeStyle = chargeTimer >= 21 || isDeclaring
      ? '#facc15'
      : rageStacks > 0
      ? 'rgba(239, 68, 68, 0.75)'
      : 'rgba(51, 65, 85, 0.9)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(0, 0, fistRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 7. 蓄力期間主力拳環繞的電離聚氣粒子
    if (isMain && state === 'CHARGING' && chargeProgress > 0.2) {
      ctx.save();
      const sparkCount = 3 + Math.floor(chargeProgress * 4);
      ctx.strokeStyle = chargeProgress > 0.85 ? '#ffffff' : '#f87171';
      ctx.lineWidth = 1.2;
      for (let s = 0; s < sparkCount; s++) {
        const sa = time * 8 + (s / sparkCount) * Math.PI * 2;
        const sDist = fistRadius * (1.15 + 0.25 * Math.sin(time * 12 + s));
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * sDist, Math.sin(sa) * sDist);
        ctx.lineTo(Math.cos(sa + 0.3) * (sDist * 0.8), Math.sin(sa + 0.3) * (sDist * 0.8));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  // 左拳 (輔助拳，沉穩戒備)
  drawGauntletFist(leftFistForward, -fistSideDist, false);
  // 右拳 (主力決勝重拳，凝聚 22 秒必殺拳意)
  drawGauntletFist(rightFistForward, fistSideDist, true);

  // 宣告身後最後 0.5s：拳頭周圍向內壓縮波
  if (isDeclaring && declareTimer <= 0.5) {
    const compT = (0.5 - declareTimer) / 0.5;
    const compRadius = radius * (1.6 - compT * 0.8);
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(rightFistForward, fistSideDist, compRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 一拳必殺命中瞬間：巨大拳擊輪廓與紅黑衝擊波 (0.25~0.4s)
  if (isPunching) {
    ctx.save();
    const blastT = Math.min(1.0, punchTimer / 0.35);
    const blastRadius = radius * (1.2 + blastT * 2.2);

    // 巨大拳擊輪廓 (Outline)
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.9 * (1 - blastT)})`;
    ctx.lineWidth = 3.0;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(rightFistForward + radius * 0.8, fistSideDist, blastRadius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    // 圓形紅黑壓縮爆發波
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * (1 - blastT)})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(rightFistForward + radius * 0.8, fistSideDist, blastRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  // -------------------------------------------------------------
  // 7. 不死之血回滿生命爆發視覺波 (Immortal Blood Life Wave)
  // -------------------------------------------------------------
  if (isImmortalBurst) {
    ctx.save();
    const burstT = Math.min(1.0, (options.immortalAnimTimer ?? 0) / 0.8);
    const waveRadius = radius * (1.0 + (1 - burstT) * 2.5);
    ctx.strokeStyle = `rgba(239, 68, 68, ${burstT * 0.9})`;
    ctx.lineWidth = 3.0;
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 內層翠綠/金黃生命復甦光暈
    ctx.strokeStyle = `rgba(250, 204, 21, ${burstT * 0.8})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y, waveRadius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 8. 光學高光 (3D Physical Specular Glint)
  // -------------------------------------------------------------
  drawStandardSpecularGlint(ctx, x, y, radius, '#fee2e2');

  ctx.restore();
}

/**
 * 繪製一拳無界 (Boundless Punch Domain) 黑紅圓形領域
 * 特色：
 * 1. 雙方免傷期間展開黑紅圓形領域 (半徑約 135px)
 * 2. 邊緣紅色符文、黑色粒子、緩慢旋轉的能量紋路
 * 3. 4秒結束時領域由外向內破碎，能量回流尹雄核心
 */
export function drawYinyongBoundlessDomain(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  time: number,
  durationLeft: number = 4.0,
  isCollapsing: boolean = false
) {
  ctx.save();

  const domainRadius = 135;
  const progressRatio = Math.max(0, Math.min(1.0, durationLeft / 4.0));
  const currentRadius = isCollapsing
    ? domainRadius * progressRatio
    : domainRadius;

  // 領域中心黑紅漸層結界
  const domainGrad = ctx.createRadialGradient(
    centerX,
    centerY,
    currentRadius * 0.2,
    centerX,
    centerY,
    currentRadius
  );
  domainGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
  domainGrad.addColorStop(0.7, 'rgba(185, 28, 28, 0.2)');
  domainGrad.addColorStop(0.95, 'rgba(239, 68, 68, 0.35)');
  domainGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

  ctx.fillStyle = domainGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
  ctx.fill();

  // 旋轉符文與能量紋路環
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(time * 0.4);

  // 邊緣紅色結界環
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 符文刻記點 (Runes)
  const runeCount = 12;
  ctx.fillStyle = '#fecaca';
  for (let i = 0; i < runeCount; i++) {
    const ra = (i / runeCount) * Math.PI * 2;
    const rx = Math.cos(ra) * currentRadius;
    const ry = Math.sin(ra) * currentRadius;
    ctx.beginPath();
    ctx.arc(rx, ry, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 內旋能量波紋線
    if (i % 2 === 0) {
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius * 0.75, ra, ra + 0.3);
      ctx.stroke();
    }
  }

  ctx.restore();

  // 領域中心微縮「無界」符號光環
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, currentRadius * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * 曼麥亞・軍子 (Manyaiya Junko) 專屬視覺渲染
 * - 異瞳 (右眼天龍金紅，左眼凡人青銀)
 * - 異瞳覺醒 (雙眼烈芒、光尾、移速光弧)
 * - 神聖符文白繃帶動態飄帶
 * - 記憶斷片緋紅裂隙與環繞晶片 (0~3層)
 * - 神之騎士完全體：雙持神之從刃、神聖緋紅氣場、弒國突進流光
 */
export interface ManyaiyaRenderOptions {
  memoryFragments?: number;
  isEyeAwakened?: boolean;
  awakenTimer?: number;
  isKnightActive?: boolean;
  knightDuration?: number;
  isDashing?: boolean;
  dashesRemaining?: number;
  pullTimer?: number;
  targetX?: number;
  targetY?: number;
  vx?: number;
  vy?: number;
}

export function drawManyaiyaFeatures(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  options: ManyaiyaRenderOptions = {}
) {
  const {
    memoryFragments = 0,
    isEyeAwakened = false,
    isKnightActive = false,
    isDashing = false,
    targetX,
    targetY,
    vx = 0,
    vy = 0
  } = options;

  ctx.save();

  // 判定朝向角度 (優先朝向目標，其次朝向運動速度)
  let aimAngle = 0;
  if (targetX !== undefined && targetY !== undefined && (targetX !== x || targetY !== y)) {
    aimAngle = Math.atan2(targetY - y, targetX - x);
  } else if (Math.hypot(vx, vy) > 10) {
    aimAngle = Math.atan2(vy, vx);
  }

  // -------------------------------------------------------------
  // 1. 完全體神聖緋紅神威領域光環 (Holy Knight Divine Aura)
  // -------------------------------------------------------------
  if (isKnightActive) {
    ctx.save();
    const auraPulse = Math.sin(time * 6) * 3;
    const knightRadius = radius * 1.45 + auraPulse;

    const auraGrad = ctx.createRadialGradient(x, y, radius * 0.8, x, y, knightRadius);
    auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
    auraGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y, knightRadius, 0, Math.PI * 2);
    ctx.fill();

    // 外環旋轉神聖天龍符文光圈
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -time * 40;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 2. 記憶斷片裂隙 (Memory Fragment Crimson Cracks on Sphere)
  // -------------------------------------------------------------
  if (memoryFragments > 0 || isEyeAwakened || isKnightActive) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(aimAngle);

    const crackCount = isKnightActive ? 3 : Math.min(3, memoryFragments);
    ctx.strokeStyle = isEyeAwakened || isKnightActive ? '#ef4444' : 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = isEyeAwakened ? 8 : 4;

    for (let c = 0; c < crackCount; c++) {
      const crackAngle = -0.5 + c * 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(crackAngle) * (radius * 0.2), Math.sin(crackAngle) * (radius * 0.2));
      ctx.lineTo(Math.cos(crackAngle + 0.1) * (radius * 0.55), Math.sin(crackAngle + 0.1) * (radius * 0.55));
      ctx.lineTo(Math.cos(crackAngle - 0.1) * (radius * 0.85), Math.sin(crackAngle - 0.1) * (radius * 0.85));
      ctx.stroke();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 3. 環繞記憶晶片 (Orbiting Crimson Memory Crystal Shards)
  // -------------------------------------------------------------
  if (memoryFragments >= 3 || isEyeAwakened || isKnightActive) {
    ctx.save();
    const shardCount = 3;
    const orbitR = radius * 1.35;
    for (let i = 0; i < shardCount; i++) {
      const shardAngle = time * 3.5 + (i * Math.PI * 2) / shardCount;
      const sx = x + Math.cos(shardAngle) * orbitR;
      const sy = y + Math.sin(shardAngle) * orbitR;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(shardAngle + Math.PI / 2);

      // 菱形緋紅記憶晶核
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#fee2e2';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -4.5);
      ctx.lineTo(2.8, 0);
      ctx.lineTo(0, 4.5);
      ctx.lineTo(-2.8, 0);
      ctx.closePath();
      ctx.fill();

      // 晶核白光中心
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // 4. 雙持神之從刃 (Manifested Dual Godblades in Knight Form)
  // -------------------------------------------------------------
  if (isKnightActive) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(aimAngle);

    const bladeSpacing = radius * 1.2;
    const bladeLength = radius * 1.6;
    const bladeWidth = radius * 0.28;

    const drawSingleBlade = (sideY: number, isRight: boolean) => {
      ctx.save();
      ctx.translate(isDashing ? radius * 0.3 : 0, sideY);

      // 神刃微幅浮動
      const bladeBob = Math.sin(time * 8 + (isRight ? 0 : Math.PI)) * 2;
      ctx.translate(0, bladeBob);

      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;

      // 劍身漸層：白金鋒刃至緋紅劍脊
      const bladeGrad = ctx.createLinearGradient(0, -bladeWidth * 0.5, 0, bladeWidth * 0.5);
      bladeGrad.addColorStop(0, '#ffffff');
      bladeGrad.addColorStop(0.5, '#f8fafc');
      bladeGrad.addColorStop(0.8, '#ef4444');
      bladeGrad.addColorStop(1, '#991b1b');

      ctx.fillStyle = bladeGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0;

      ctx.beginPath();
      // 尖銳雙向流線從刃
      ctx.moveTo(bladeLength * 0.6, 0); // 劍尖
      ctx.lineTo(bladeLength * 0.2, bladeWidth * 0.5);
      ctx.lineTo(-bladeLength * 0.4, bladeWidth * 0.35);
      ctx.lineTo(-bladeLength * 0.4, -bladeWidth * 0.35);
      ctx.lineTo(bladeLength * 0.2, -bladeWidth * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 劍脊赤紅記憶血槽
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-bladeLength * 0.3, 0);
      ctx.lineTo(bladeLength * 0.45, 0);
      ctx.stroke();

      // 劍柄神聖繃帶飄帶
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-bladeLength * 0.4, 0);
      const trailWave = Math.sin(time * 12 + sideY) * 3;
      ctx.quadraticCurveTo(-bladeLength * 0.6, sideY > 0 ? 4 : -4, -bladeLength * 0.8, trailWave);
      ctx.stroke();

      ctx.restore();
    };

    // 左右兩柄從刃
    drawSingleBlade(-bladeSpacing, false);
    drawSingleBlade(bladeSpacing, true);

    ctx.restore();
  }

  // -------------------------------------------------------------
  // 5. 異瞳雙眼 (天龍金紅右眼 + 凡人青銀左眼)
  // -------------------------------------------------------------
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(aimAngle);

  const eyeSpacing = radius * 0.32;
  const eyeForward = radius * 0.25;
  const eyeR = radius * 0.18;

  const isBlazing = isEyeAwakened || isKnightActive;

  // A. 左眼：凡人青銀記憶之眼 (Cyan / Silver)
  const leftEyeX = eyeForward;
  const leftEyeY = -eyeSpacing;

  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = isBlazing ? 14 : 4;
  ctx.beginPath();
  ctx.arc(leftEyeX, leftEyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  // 青銀瞳心
  ctx.fillStyle = isBlazing ? '#ffffff' : '#bae6fd';
  ctx.beginPath();
  ctx.arc(leftEyeX + 1, leftEyeY, eyeR * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // 覺醒時青銀青炎眼尾流光
  if (isBlazing) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(leftEyeX, leftEyeY);
    ctx.quadraticCurveTo(leftEyeX - radius * 0.4, leftEyeY - 4, leftEyeX - radius * 0.7, leftEyeY - 8 + Math.sin(time * 15) * 3);
    ctx.stroke();
  }
  ctx.restore();

  // B. 右眼：天龍金紅天龍之眼 (Gold / Crimson)
  const rightEyeX = eyeForward;
  const rightEyeY = eyeSpacing;

  ctx.save();
  ctx.fillStyle = '#dc2626';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = isBlazing ? 16 : 4;
  ctx.beginPath();
  ctx.arc(rightEyeX, rightEyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  // 金紅龍瞳垂直瞳孔
  ctx.fillStyle = isBlazing ? '#ffffff' : '#fef08a';
  ctx.beginPath();
  ctx.ellipse(rightEyeX + 1, rightEyeY, eyeR * 0.35, eyeR * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // 覺醒時金紅炎芒眼尾流光
  if (isBlazing) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(rightEyeX, rightEyeY);
    ctx.quadraticCurveTo(rightEyeX - radius * 0.4, rightEyeY + 4, rightEyeX - radius * 0.7, rightEyeY + 8 + Math.cos(time * 15) * 3);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();

  ctx.restore();
}






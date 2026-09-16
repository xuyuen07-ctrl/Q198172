/**
 * High-Definition Character Outfits & Exclusive Attire Canvas Renderers
 * Provides bespoke, ultra-detailed clothing, armor vestments, collars, belts,
 * and decorative regalia tailored to each of the 21 champions.
 */

import { CharacterId } from '../types/game';

interface OutfitRenderOptions {
  time?: number;
  vx?: number;
  vy?: number;
  isHotBody?: boolean;
  fanOverclockActive?: boolean;
  growthStacks?: number;
  xinForm?: 'neutral' | 'light' | 'dark';
  xinLevel?: number;
}

/**
 * 1. 奧巴 (OBA) - 【雷霆動力泰坦防彈裝甲衣】
 * 軍工重裝戰術防彈胸甲、液壓緩震肩甲（黃黑警示斜紋）、高壓散熱格柵與戰術胸帶
 */
export function drawObaAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = Math.max(-3, Math.min(3, -vx * 0.015));
  const swayY = Math.max(-3, Math.min(3, -vy * 0.015));

  // --- A. Heavy Tactical Kevlar Ballistic Vest Body ---
  const vestW = radius * 0.88;
  const vestTop = y - radius * 0.45 + swayY;
  const vestH = radius * 0.82;

  // Vest Shadow / Base Underlayer
  ctx.fillStyle = '#0f172a'; // Deep ballistic nylon
  ctx.beginPath();
  ctx.moveTo(x - vestW * 0.5 + swayX, vestTop);
  ctx.lineTo(x + vestW * 0.5 + swayX, vestTop);
  ctx.lineTo(x + vestW * 0.42 + swayX, vestTop + vestH);
  ctx.lineTo(x - vestW * 0.42 + swayX, vestTop + vestH);
  ctx.closePath();
  ctx.fill();

  // Carbon Fiber Weave Texture Lines
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const ly = vestTop + (vestH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(x - vestW * 0.44 + swayX, ly);
    ctx.lineTo(x + vestW * 0.44 + swayX, ly);
    ctx.stroke();
  }

  // --- B. Dual Reinforced Shoulder Pauldrons with Hazard Striping ---
  const pSize = radius * 0.42;
  for (let side = -1; side <= 1; side += 2) {
    const px = x + side * (radius * 0.72) + swayX * 0.5;
    const py = y - radius * 0.25 + swayY * 0.5;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((side * Math.PI) / 8);

    // Dark Titanium Shoulder Base Plate
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-pSize * 0.45, -pSize * 0.35, pSize * 0.9, pSize * 0.7, 3);
    ctx.fill();
    ctx.stroke();

    // Hazard Stripes (Yellow / Dark Slate)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-pSize * 0.4, -pSize * 0.3, pSize * 0.8, pSize * 0.6, 2);
    ctx.clip();
    ctx.fillStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a';
    for (let h = -pSize; h <= pSize; h += 6) {
      ctx.beginPath();
      ctx.moveTo(h, -pSize);
      ctx.lineTo(h + 8, pSize);
      ctx.stroke();
    }
    ctx.restore();

    // Hydraulic Piston Shock-Absorber
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-pSize * 0.15, pSize * 0.35, pSize * 0.3, 3);
    ctx.restore();
  }

  // --- C. Titanium Reinforced High Neck Gorget / Collar ---
  const gorgetW = radius * 0.48;
  const gorgetY = y - radius * 0.52 + swayY;
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x - gorgetW * 0.5 + swayX, gorgetY, gorgetW, radius * 0.2, [4, 4, 1, 1]);
  ctx.fill();
  ctx.stroke();

  // Status LED Line on Collar
  ctx.strokeStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 4;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - gorgetW * 0.35 + swayX, gorgetY + radius * 0.1);
  ctx.lineTo(x + gorgetW * 0.35 + swayX, gorgetY + radius * 0.1);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // --- D. Tactical Power Belt & Quick-Release Buckle ---
  const beltY = y + radius * 0.34 + swayY;
  const beltW = radius * 0.8;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x - beltW * 0.5 + swayX, beltY, beltW, radius * 0.14);

  // Central Gold Alloy Buckle
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.fillRect(x - 5 + swayX, beltY - 1, 10, radius * 0.16);
  ctx.strokeRect(x - 5 + swayX, beltY - 1, 10, radius * 0.16);

  // Side Capacitor Ammo Pouches
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - beltW * 0.45 + swayX, beltY + 1, 5, radius * 0.12);
  ctx.fillRect(x + beltW * 0.45 - 5 + swayX, beltY + 1, 5, radius * 0.12);

  ctx.restore();
}

/**
 * 2. 火瞳 (HUOTONG) - 【黑曜熔爐耐火鍛造師重風衣】
 * 焦黑耐火大風衣翻領、雙排防爆黃銅鉚釘、胸前熱力壓力儀表、雙肩高壓蒸氣煙囪
 */
export function drawHuotongAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  isHotBody: boolean = false
) {
  ctx.save();
  const swayX = Math.max(-3, Math.min(3, -vx * 0.015));

  // --- A. Heavy Fireproof Scorched Leather Greatcoat Silhouette ---
  const coatW = radius * 0.94;
  const coatTop = y - radius * 0.42;
  const coatH = radius * 0.86;

  // Molten Crimson Underliner (Peking lining)
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.1, coatW * 0.52, coatH * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Basalt-Leather Outer Overcoat (Split Front Lapels)
  ctx.fillStyle = '#1c1917'; // Scorched obsidian leather
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.4;

  // Left Lapel
  ctx.beginPath();
  ctx.moveTo(x - coatW * 0.48, coatTop);
  ctx.lineTo(x - 4 + swayX, coatTop + radius * 0.28);
  ctx.lineTo(x - 8 + swayX, coatTop + coatH);
  ctx.lineTo(x - coatW * 0.42, coatTop + coatH * 0.85);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Lapel
  ctx.beginPath();
  ctx.moveTo(x + coatW * 0.48, coatTop);
  ctx.lineTo(x + 4 + swayX, coatTop + radius * 0.28);
  ctx.lineTo(x + 8 + swayX, coatTop + coatH);
  ctx.lineTo(x + coatW * 0.42, coatTop + coatH * 0.85);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Double-Breasted Brass Rivet Buttons (4 pairs)
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  for (let r = 0; r < 4; r++) {
    const by = coatTop + radius * 0.22 + r * (radius * 0.15);
    // Left rivet
    ctx.beginPath();
    ctx.arc(x - radius * 0.22 + swayX, by, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right rivet
    ctx.beginPath();
    ctx.arc(x + radius * 0.22 + swayX, by, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // --- B. Central Furnace Heat Pressure Gauge Meter ---
  const gaugeR = radius * 0.2;
  const gaugeY = y + radius * 0.05;
  ctx.fillStyle = '#292524';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + swayX, gaugeY, gaugeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dial Face & Needle
  ctx.fillStyle = isHotBody ? '#fef08a' : '#fed7aa';
  ctx.beginPath();
  ctx.arc(x + swayX, gaugeY, gaugeR * 0.72, 0, Math.PI * 2);
  ctx.fill();

  // Gauge Jittering Needle
  const needleAngle = -Math.PI * 0.7 + (isHotBody ? 1.2 : 0.6) + Math.sin(time * 12) * 0.15;
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + swayX, gaugeY);
  ctx.lineTo(x + swayX + Math.cos(needleAngle) * (gaugeR * 0.65), gaugeY + Math.sin(needleAngle) * (gaugeR * 0.65));
  ctx.stroke();

  // Dual Steam Release Ports on Shoulders
  for (let side = -1; side <= 1; side += 2) {
    const sx = x + side * (radius * 0.68);
    const sy = y - radius * 0.42;
    ctx.fillStyle = '#44403c';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.fillRect(sx - 3, sy - 5, 6, 7);
    ctx.strokeRect(sx - 3, sy - 5, 6, 7);

    // Warm Steam Puff Particles
    if (isHotBody || Math.sin(time * 6 + side) > 0.3) {
      ctx.fillStyle = 'rgba(254, 215, 170, 0.5)';
      ctx.beginPath();
      ctx.arc(sx + side * 2, sy - 8 - (time * 10) % 6, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * 3. 海萊斯 (HAILAISE) - 【星穹虛空大祭司秘法神袍】
 * 星雲絲綢奧術長袍、高聳星宿立領披巾、黃道十二星圖刺繡、紫晶星月項鍊
 */
export function drawHailaiseAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.012;

  // --- A. Flowing Cosmic Silk Robes Silhouette ---
  const robeW = radius * 0.92;
  const robeTop = y - radius * 0.45;
  const robeH = radius * 0.9;

  // Galaxy Nebula Fabric Gradient
  const robeGrad = ctx.createLinearGradient(x, robeTop, x, robeTop + robeH);
  robeGrad.addColorStop(0, '#2e1065'); // Deep midnight violet
  robeGrad.addColorStop(0.5, '#4c1d95'); // Royal astral purple
  robeGrad.addColorStop(1, '#090514'); // Void black

  ctx.fillStyle = robeGrad;
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(x - robeW * 0.45, robeTop);
  ctx.bezierCurveTo(x - robeW * 0.55, y, x - robeW * 0.48, robeTop + robeH, x + swayX, robeTop + robeH);
  ctx.bezierCurveTo(x + robeW * 0.48, robeTop + robeH, x + robeW * 0.55, y, x + robeW * 0.45, robeTop);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Floating Star-dust Gold Hemline Embroidery
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.arc(x, robeTop + robeH * 0.85, radius * 0.42, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- B. High Arcane Stole / Starlight Cowl Lapels ---
  ctx.fillStyle = '#6b21a8';
  ctx.strokeStyle = '#d8b4fe';
  ctx.lineWidth = 1.2;

  // Left Lapel Stole
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.35, robeTop - 2);
  ctx.lineTo(x - 3 + swayX, y + radius * 0.25);
  ctx.lineTo(x - radius * 0.18 + swayX, y + radius * 0.28);
  ctx.lineTo(x - radius * 0.42, robeTop + radius * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Lapel Stole
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.35, robeTop - 2);
  ctx.lineTo(x + 3 + swayX, y + radius * 0.25);
  ctx.lineTo(x + radius * 0.18 + swayX, y + radius * 0.28);
  ctx.lineTo(x + radius * 0.42, robeTop + radius * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // --- C. Amethyst Crescent Star Brooch & Choker ---
  const broochY = robeTop + radius * 0.16;
  ctx.fillStyle = '#e879f9';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x + swayX, broochY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Silver Crescent Rim around Brooch
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX + 1, broochY, 5.5, -Math.PI * 0.4, Math.PI * 0.6);
  ctx.stroke();

  // Micro Constellation Dots on Robe Front
  ctx.fillStyle = '#f5d0fe';
  const dots = [
    { dx: -radius * 0.2, dy: radius * 0.1 },
    { dx: radius * 0.22, dy: radius * 0.14 },
    { dx: -radius * 0.12, dy: radius * 0.35 },
    { dx: radius * 0.15, dy: radius * 0.38 }
  ];
  dots.forEach(d => {
    ctx.beginPath();
    ctx.arc(x + d.dx + swayX * 0.6, y + d.dy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * 4. 靈隱寺 (LINGYINSI) - 【風行翠羽遊俠輕裝戰袍】
 * 精靈遊俠翡翠獵袍、金絲流風雲紋滾邊、左肩雕鷹羽肩鎧、鞣皮箭袋斜跨帶
 */
export function drawLingyinsiAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Forest Jade Ranger Tunic (翡翠綠修身獵袍) ---
  const tunicW = radius * 0.88;
  const tunicTop = y - radius * 0.44;
  const tunicH = radius * 0.84;

  const tunicGrad = ctx.createLinearGradient(x, tunicTop, x, tunicTop + tunicH);
  tunicGrad.addColorStop(0, '#047857'); // Emerald green
  tunicGrad.addColorStop(0.6, '#065f46');
  tunicGrad.addColorStop(1, '#022c22'); // Deep forest shadow

  ctx.fillStyle = tunicGrad;
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x - tunicW * 0.5, tunicTop, tunicW, tunicH, [radius * 0.2, radius * 0.2, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Gold Thread Wind Filigree Wave along Center
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x + swayX, tunicTop);
  ctx.quadraticCurveTo(x + 5 + swayX, y - radius * 0.1, x + swayX, y + radius * 0.15);
  ctx.quadraticCurveTo(x - 5 + swayX, y + radius * 0.25, x + swayX, tunicTop + tunicH);
  ctx.stroke();

  // --- B. Leather Quiver Bandolier Harness Cross-Strap ---
  ctx.strokeStyle = '#78350f'; // Dark saddle leather
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.48, tunicTop + radius * 0.1);
  ctx.lineTo(x + radius * 0.42, tunicTop + tunicH * 0.8);
  ctx.stroke();

  // Silver Arrow-Feather Brooch on Strap
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  const pinX = x - radius * 0.08 + swayX;
  const pinY = y - radius * 0.06;
  ctx.beginPath();
  ctx.ellipse(pinX, pinY, 4, 2.5, Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // --- C. Left Falcon-Feather Shoulder Guard (翠羽肩飾) ---
  const spX = x - radius * 0.46;
  const spY = y - radius * 0.28;
  ctx.fillStyle = '#059669';
  ctx.strokeStyle = '#6ee7b7';
  ctx.lineWidth = 1.2;
  for (let f = 0; f < 3; f++) {
    ctx.save();
    ctx.translate(spX - f * 3, spY + f * 4);
    ctx.rotate(-Math.PI * 0.2 + f * 0.15);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Soft Emerald Wind Tassels trailing bottom
  const tasselSway = Math.sin(time * 4) * 3;
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 4 + swayX, tunicTop + tunicH);
  ctx.lineTo(x - 6 + swayX + tasselSway, tunicTop + tunicH + 7);
  ctx.moveTo(x + 4 + swayX, tunicTop + tunicH);
  ctx.lineTo(x + 6 + swayX + tasselSway, tunicTop + tunicH + 7);
  ctx.stroke();

  ctx.restore();
}

/**
 * 5. 禪師 (CHANSHI) - 【金剛明王九環盤龍金絲袈裟】
 * 右袒式明黃藏青織錦袈裟、斜披盤龍大披帛、大沉香念珠串、降魔護心鏡
 */
export function drawChanshiAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.012;

  // --- A. Golden Saffron Under-Robe (右袒僧袍基底) ---
  ctx.fillStyle = '#f59e0b'; // Saffron monk yellow
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();

  // --- B. Diagonal Crimson Dragon Kasaya Stole (斜披深紅盤龍金絲袈裟) ---
  const kasayaGrad = ctx.createLinearGradient(x - radius * 0.6, y - radius * 0.6, x + radius * 0.6, y + radius * 0.6);
  kasayaGrad.addColorStop(0, '#991b1b'); // Royal cinnabar
  kasayaGrad.addColorStop(0.5, '#b91c1c');
  kasayaGrad.addColorStop(1, '#7f1d1d');

  ctx.fillStyle = kasayaGrad;
  ctx.strokeStyle = '#fde047'; // Pure gold thread trim
  ctx.lineWidth = 2.0;

  // Diagonal drape from left shoulder to right waist
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.65, y - radius * 0.35);
  ctx.quadraticCurveTo(x - radius * 0.1, y - radius * 0.45, x + radius * 0.25, y - radius * 0.2);
  ctx.lineTo(x + radius * 0.65, y + radius * 0.35);
  ctx.lineTo(x + radius * 0.35, y + radius * 0.65);
  ctx.quadraticCurveTo(x - radius * 0.1, y + radius * 0.2, x - radius * 0.55, y + radius * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Golden Cloud / Dragon Brocade Grid Embroidery
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.3, y - radius * 0.15);
  ctx.lineTo(x + radius * 0.4, y + radius * 0.35);
  ctx.moveTo(x - radius * 0.15, y - radius * 0.3);
  ctx.lineTo(x + radius * 0.45, y + radius * 0.15);
  ctx.stroke();

  // --- C. Sandalwood Prayer Beads Necklace (沉香念珠串) ---
  const beadCount = 9;
  for (let b = 0; b < beadCount; b++) {
    const angle = Math.PI * 0.2 + (b * Math.PI * 0.6) / (beadCount - 1);
    const bx = x + Math.cos(angle) * (radius * 0.54) + swayX * 0.4;
    const by = y - radius * 0.08 + Math.sin(angle) * (radius * 0.42);

    ctx.fillStyle = b === 4 ? '#f59e0b' : '#78350f'; // Center master bead is golden
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, b === 4 ? 3.2 : 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // --- D. Demon-Quelling Bronze Heart Mirror (八角降魔護心鏡) ---
  const mirrorY = y + radius * 0.12;
  ctx.fillStyle = '#b45309';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  const octR = radius * 0.18;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const px = x + Math.cos(a) * octR + swayX;
    const py = mirrorY + Math.sin(a) * octR;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center Sanskrit Swastika / Vajra Glyph Dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + swayX, mirrorY, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 6. 黃鑽 (HUANGZUAN) - 【超導迅雷刺客納米疾行風衣】
 * 啞光黑納米潛水服、金色高導電雷紋微電路、立領防風面罩、背部脈衝噴氣道
 */
export function drawHuangzuanAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Sleek Nanoweave Stealth Bodysuit ---
  ctx.fillStyle = '#18181b'; // Matte stealth obsidian
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();

  // High-Aerodynamic Windproof Cowl / Ninja Collar
  const cowlW = radius * 0.65;
  const cowlY = y - radius * 0.45;
  ctx.fillStyle = '#27272a';
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x - cowlW * 0.5 + swayX, cowlY, cowlW, radius * 0.28, [5, 5, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Electroluminescent Eye-Slit Visor
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8;
  ctx.fillRect(x - cowlW * 0.35 + swayX, cowlY + radius * 0.1, cowlW * 0.7, 2.5);
  ctx.shadowBlur = 0;

  // --- B. Gold Conductive Micro-Circuit Lightning Veins ---
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 6;

  // Left chest lightning circuit
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.45, cowlY + radius * 0.25);
  ctx.lineTo(x - radius * 0.25 + swayX, y + radius * 0.05);
  ctx.lineTo(x - radius * 0.35 + swayX, y + radius * 0.2);
  ctx.lineTo(x - radius * 0.15 + swayX, y + radius * 0.42);
  ctx.stroke();

  // Right chest lightning circuit
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.45, cowlY + radius * 0.25);
  ctx.lineTo(x + radius * 0.25 + swayX, y + radius * 0.05);
  ctx.lineTo(x + radius * 0.35 + swayX, y + radius * 0.2);
  ctx.lineTo(x + radius * 0.15 + swayX, y + radius * 0.42);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // --- C. Dual Micro Plasma Pulse Thruster Vents on Shoulder Back ---
  for (let side = -1; side <= 1; side += 2) {
    const tx = x + side * (radius * 0.65);
    const ty = y - radius * 0.15;
    ctx.fillStyle = '#3f3f46';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(tx, ty, 4, 2.5, (side * Math.PI) / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Blue-Yellow Thruster Flame Spark
    const sparkR = 1.5 + Math.sin(time * 18 + side) * 0.8;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(tx + side * 2, ty - 3, sparkR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 7. 藍鑽 (LANZUAN) - 【瀚海星圖大賢者天藍法袍】
 * 天鵝絨深海法袍、潮汐銀浪刺繡、璇璣星盤圓弧肩飾、波紋水藍光織領巾
 */
export function drawLanzuanAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Deep-Sea Sapphire Velvet Robe ---
  const robeGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  robeGrad.addColorStop(0, '#0284c7'); // Ocean blue
  robeGrad.addColorStop(0.6, '#0369a1');
  robeGrad.addColorStop(1, '#082f49'); // Abyssal navy

  ctx.fillStyle = robeGrad;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Silver Wave Folds Embroidery along Lower Hem
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.2;
  const waveY = y + radius * 0.32;
  ctx.beginPath();
  for (let w = -3; w <= 3; w++) {
    const wx = x + w * (radius * 0.18) + swayX;
    const wy = waveY + Math.sin(time * 3 + w) * 2;
    if (w === -3) ctx.moveTo(wx, wy);
    else ctx.quadraticCurveTo(wx - 4, wy - 3, wx, wy);
  }
  ctx.stroke();

  // --- B. Rotating Brass Astrolabe Collar & Star Pendant ---
  const astrolabeR = radius * 0.32;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.save();
  ctx.translate(x + swayX, y - radius * 0.15);
  ctx.rotate(time * 0.8);
  ctx.beginPath();
  ctx.arc(0, 0, astrolabeR, 0, Math.PI * 2);
  ctx.stroke();
  // Astrolabe Inner Axis Cross
  ctx.beginPath();
  ctx.moveTo(-astrolabeR, 0);
  ctx.lineTo(astrolabeR, 0);
  ctx.moveTo(0, -astrolabeR);
  ctx.lineTo(0, astrolabeR);
  ctx.stroke();
  ctx.restore();

  // Center Oceanic Pearl
  ctx.fillStyle = '#bae6fd';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x + swayX, y - radius * 0.15, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- C. Translucent Water Gossamer Scarf Ends (飄逸水靈絲巾) ---
  const scarfSway = Math.sin(time * 3.5) * 4;
  ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.2 + swayX, y - radius * 0.1);
  ctx.quadraticCurveTo(x - radius * 0.45 + scarfSway, y + radius * 0.15, x - radius * 0.35 + scarfSway, y + radius * 0.45);
  ctx.lineTo(x - radius * 0.25 + scarfSway, y + radius * 0.42);
  ctx.quadraticCurveTo(x - radius * 0.3 + scarfSway, y + radius * 0.15, x - radius * 0.1 + swayX, y - radius * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * 8. 粉鑽 (FENZUAN) - 【聖靈薔薇守護天使禮服】
 * 櫻粉雙層荷葉蕾絲金邊聖殿禮服、天使羽翼金飾護心鎧、心形粉紅碧璽、薄紗披肩
 */
export function drawFenzuanAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.012;

  // --- A. Petal-Shaped Silk Liturgical Gown ---
  const gownGrad = ctx.createRadialGradient(x, y - radius * 0.2, radius * 0.1, x, y, radius * 0.8);
  gownGrad.addColorStop(0, '#fdf2f8'); // Pearl white blush
  gownGrad.addColorStop(0.5, '#f472b6'); // Rose pink
  gownGrad.addColorStop(1, '#9d174d'); // Deep ruby velvet

  ctx.fillStyle = gownGrad;
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White Lace Ruffle Collar (雙層荷葉蕾絲高領)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  const collarY = y - radius * 0.42;
  ctx.beginPath();
  for (let p = -3; p <= 3; p++) {
    const px = x + p * 5 + swayX;
    ctx.arc(px, collarY, 3, 0, Math.PI);
  }
  ctx.fill();
  ctx.stroke();

  // --- B. Angel Wings Gilded Breastplate (天使羽翼胸飾) ---
  const wingY = y - radius * 0.12;
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.2;

  // Left Angel Wing Feather
  ctx.beginPath();
  ctx.moveTo(x - 2 + swayX, wingY);
  ctx.quadraticCurveTo(x - radius * 0.35 + swayX, wingY - 8, x - radius * 0.52, wingY + 4);
  ctx.quadraticCurveTo(x - radius * 0.25 + swayX, wingY + 2, x - 2 + swayX, wingY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Angel Wing Feather
  ctx.beginPath();
  ctx.moveTo(x + 2 + swayX, wingY);
  ctx.quadraticCurveTo(x + radius * 0.35 + swayX, wingY - 8, x + radius * 0.52, wingY + 4);
  ctx.quadraticCurveTo(x + radius * 0.25 + swayX, wingY + 2, x + 2 + swayX, wingY + 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // --- C. Heart-Shaped Pink Tourmaline Gem (心形粉紅碧璽) ---
  ctx.fillStyle = '#ec4899';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 8;
  const gemY = wingY + 2;
  ctx.beginPath();
  ctx.moveTo(x + swayX, gemY + 5);
  ctx.bezierCurveTo(x - 6 + swayX, gemY - 2, x - 6 + swayX, gemY - 7, x + swayX, gemY - 4);
  ctx.bezierCurveTo(x + 6 + swayX, gemY - 7, x + 6 + swayX, gemY - 2, x + swayX, gemY + 5);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Gilded Rosebud Petal Embroidery along Waist
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX, y + radius * 0.28, radius * 0.35, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();

  ctx.restore();
}

/**
 * 9. 白鑽 (BAIZUAN) - 【純白稜鏡大審判官聖殿重袍】
 * 純白幾何折線祭司法袍、銀質幾何立體肩鎧、折光八面體鑽石聖胸針
 */
export function drawBaizuanAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Pure White High Inquisitor Cassock ---
  const cassockGrad = ctx.createLinearGradient(x, y - radius * 0.6, x, y + radius * 0.6);
  cassockGrad.addColorStop(0, '#ffffff');
  cassockGrad.addColorStop(0.5, '#f8fafc');
  cassockGrad.addColorStop(1, '#cbd5e1');

  ctx.fillStyle = cassockGrad;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Angular Faceted Mantlet Trim (幾何折線立領銀袍)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x + swayX, y - radius * 0.45);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x + radius * 0.32, y + radius * 0.35);
  ctx.lineTo(x + swayX, y + radius * 0.5);
  ctx.lineTo(x - radius * 0.32, y + radius * 0.35);
  ctx.closePath();
  ctx.stroke();

  // Dual Mirror-Plated Angular Pauldrons
  for (let side = -1; side <= 1; side += 2) {
    const px = x + side * (radius * 0.65);
    const py = y - radius * 0.22;
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px, py - 6);
    ctx.lineTo(px + side * 6, py);
    ctx.lineTo(px, py + 6);
    ctx.lineTo(px - side * 4, py);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- B. Octahedral Refractive Diamond Brooch (八面體折光聖徽) ---
  const gemY = y - radius * 0.05;
  const gemSize = radius * 0.2;
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#fbbf24'];
  const rainbowCycle = Math.floor((time * 2) % 4);

  ctx.fillStyle = colors[rainbowCycle];
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x + swayX, gemY - gemSize);
  ctx.lineTo(x + gemSize * 0.8 + swayX, gemY);
  ctx.lineTo(x + swayX, gemY + gemSize);
  ctx.lineTo(x - gemSize * 0.8 + swayX, gemY);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.restore();
}

/**
 * 10. 虛空獸 (XUKONGSHOU) - 【深淵噬界重裝生物異骨甲】
 * 黑紫硬化幾丁質外骨骼胸排、放射狀虛空骨刺、深淵黑洞奇點心臟
 */
export function drawXukongshouAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Chitinous Bio-Armor Segments (層疊節肢硬殼) ---
  ctx.fillStyle = '#090514'; // Abyss black
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;

  const segmentCount = 4;
  for (let s = 0; s < segmentCount; s++) {
    const sy = y - radius * 0.35 + s * (radius * 0.2);
    const sw = radius * (0.75 - s * 0.08);

    ctx.beginPath();
    ctx.moveTo(x - sw * 0.5, sy);
    ctx.lineTo(x + swayX, sy + radius * 0.1);
    ctx.lineTo(x + sw * 0.5, sy);
    ctx.lineTo(x + sw * 0.45, sy + radius * 0.16);
    ctx.lineTo(x + swayX, sy + radius * 0.24);
    ctx.lineTo(x - sw * 0.45, sy + radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- B. Triple Void Bone Spines on Dorsal Ridge (背脊骨刺) ---
  ctx.fillStyle = '#581c87';
  ctx.strokeStyle = '#d8b4fe';
  ctx.lineWidth = 1.2;
  for (let i = -1; i <= 1; i++) {
    const sx = x + i * (radius * 0.38) + swayX;
    const sy = y - radius * 0.48;
    ctx.beginPath();
    ctx.moveTo(sx - 3, sy + 6);
    ctx.lineTo(sx, sy - 8);
    ctx.lineTo(sx + 3, sy + 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- C. Swirling Singularity Black Hole Core (深淵黑洞核心) ---
  const holeR = radius * 0.18;
  const holeGrad = ctx.createRadialGradient(x + swayX, y, 0, x + swayX, y, holeR);
  holeGrad.addColorStop(0, '#000000');
  holeGrad.addColorStop(0.7, '#6b21a8');
  holeGrad.addColorStop(1, '#c084fc');

  ctx.fillStyle = holeGrad;
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x + swayX, y, holeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * 11. 凡 (FAN) - 【暗夜幽靈特工狙擊戰術風衣】
 * 灰黑迷彩高立領風衣、雙聯重型穿甲彈藥斜帶、特工全息夜視鏡、快拆武裝帶
 */
export function drawFanAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  fanOverclockActive: boolean = false
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Weathered Charcoal Tactical Trenchcoat ---
  const coatW = radius * 0.88;
  const coatTop = y - radius * 0.44;
  const coatH = radius * 0.84;

  ctx.fillStyle = '#1c1917'; // Matte sniper coat
  ctx.strokeStyle = fanOverclockActive ? '#facc15' : '#78716c';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.roundRect(x - coatW * 0.5, coatTop, coatW, coatH, [4, 4, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // High Popped Tactical Collar with Throat Mic
  const collarW = radius * 0.54;
  ctx.fillStyle = '#292524';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.2;
  ctx.fillRect(x - collarW * 0.5 + swayX, coatTop - 2, collarW, radius * 0.22);
  ctx.strokeRect(x - collarW * 0.5 + swayX, coatTop - 2, collarW, radius * 0.22);

  // --- B. Heavy Armor-Piercing Magnum Cartridge Bandolier (彈藥斜背帶) ---
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.45, coatTop + radius * 0.12);
  ctx.lineTo(x + radius * 0.45, coatTop + coatH * 0.82);
  ctx.stroke();

  // Brass Magnum Cartridge Bullets (4 bullets strapped)
  for (let c = 0; c < 4; c++) {
    const t = 0.2 + c * 0.18;
    const bx = x - radius * 0.45 + t * (radius * 0.9);
    const by = coatTop + radius * 0.12 + t * (coatH * 0.7);

    ctx.fillStyle = '#eab308'; // Brass cartridge
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 0.8;
    ctx.fillRect(bx - 1.5, by - 2.5, 3, 5);
    ctx.strokeRect(bx - 1.5, by - 2.5, 3, 5);
  }

  // --- C. Golden Agent Honor Medal & Holo Monocle ---
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(x - radius * 0.22 + swayX, coatTop + radius * 0.32, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Left Eye Red / Gold HUD Targeting Lens
  ctx.strokeStyle = fanOverclockActive ? '#ef4444' : '#f59e0b';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = fanOverclockActive ? '#ef4444' : '#f59e0b';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(x - radius * 0.15 + swayX, coatTop + radius * 0.1, 4.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * 12. 吞噬魔祖 (TUNSHIMOZU) - 【原初暴食邪神吞天魔鎧】
 * 暴食骨齒巨口胸腔、骷髏魔頭肩鎧、怨魂鎖鏈、黑曜魔石紋理
 */
export function drawTunshimozuAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  growthStacks: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Primordial Maw Carapace Body ---
  ctx.fillStyle = '#0f051d'; // Fiend black
  ctx.strokeStyle = '#831843';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // --- B. Jagged Bone-Teeth Soul Cage (胸腔暴食骨齒巨口) ---
  const mawY = y + radius * 0.08;
  const mawW = radius * 0.58;
  ctx.fillStyle = '#4c0519'; // Gaping throat
  ctx.beginPath();
  ctx.ellipse(x + swayX, mawY, mawW * 0.5, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sharp Upper and Lower Bone Teeth
  ctx.fillStyle = '#fef2f2';
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 0.8;
  for (let t = -3; t <= 3; t++) {
    const tx = x + t * (mawW * 0.12) + swayX;
    // Top tooth
    ctx.beginPath();
    ctx.moveTo(tx - 2, mawY - radius * 0.16);
    ctx.lineTo(tx, mawY - 2);
    ctx.lineTo(tx + 2, mawY - radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Bottom tooth
    ctx.beginPath();
    ctx.moveTo(tx - 2, mawY + radius * 0.16);
    ctx.lineTo(tx, mawY + 2);
    ctx.lineTo(tx + 2, mawY + radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- C. Dual Screaming Skull Pauldrons (骷髏魔頭肩鎧) ---
  for (let side = -1; side <= 1; side += 2) {
    const skX = x + side * (radius * 0.68);
    const skY = y - radius * 0.28;
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(skX, skY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Blue Soulfire in Skull Eye Sockets
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(skX - 2, skY - 1, 1.2, 0, Math.PI * 2);
    ctx.arc(skX + 2, skY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 13. 咪咪 (MIMI) - 【幻夜靈貓忍客短羽織】
 * 暗夜深紫短羽織、櫻花肉墊金線印、雙金鈴赤紅粗繩結、毛茸白絨圍脖
 */
export function drawMimiAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Midnight Purple Haori Kimono (和風羽織) ---
  const haoriGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  haoriGrad.addColorStop(0, '#581c87'); // Deep violet
  haoriGrad.addColorStop(0.5, '#7e22ce');
  haoriGrad.addColorStop(1, '#3b0764');

  ctx.fillStyle = haoriGrad;
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White Fluffy Fur Collar Neck Ruff (白絨毛圍脖)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 1;
  const collarY = y - radius * 0.38;
  ctx.beginPath();
  for (let f = -4; f <= 4; f++) {
    const fx = x + f * 5 + swayX;
    ctx.arc(fx, collarY, 4, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();

  // --- B. Red Braided Cord Bow & Dual Golden Bells (赤紅繩結與雙金鈴) ---
  const bellY = collarY + 6;

  // Crimson Shimenawa Knot Bow
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // Left loop
  ctx.ellipse(x - 6 + swayX, bellY - 2, 5, 2.8, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Right loop
  ctx.beginPath();
  ctx.ellipse(x + 6 + swayX, bellY - 2, 5, 2.8, Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Twin Jingle Bells
  for (let side = -1; side <= 1; side += 2) {
    const bx = x + side * 4 + swayX;
    const by = bellY + 4;
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bell Slit
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(bx, by + 1, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- C. Golden Cat Paw Print Emblem on Back ---
  const pawY = y + radius * 0.18;
  ctx.fillStyle = '#fbcfe8';
  // Central pad
  ctx.beginPath();
  ctx.ellipse(x + swayX, pawY, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // 3 Toe beans
  for (let t = -1; t <= 1; t++) {
    ctx.beginPath();
    ctx.arc(x + t * 4 + swayX, pawY - 4.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 14. 剪刀手 (JIANDAOSHOU) - 【蒸汽工匠紳士雙排扣燕尾禮服】
 * 維多利亞炭黑燕尾服、挺拔襯衫領結、黃銅懷表鏈、皮革工具胸帶
 */
export function drawJiandaoshouAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Victorian Pinstriped Formal Tailcoat Silhouette ---
  const coatW = radius * 0.88;
  const coatTop = y - radius * 0.44;
  const coatH = radius * 0.84;

  ctx.fillStyle = '#1c1917'; // Charcoal wool tailcoat
  ctx.strokeStyle = '#b91c1c'; // Wine red trim
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x - coatW * 0.5, coatTop, coatW, coatH, [4, 4, 1, 1]);
  ctx.fill();
  ctx.stroke();

  // Crisp White Wingtip Shirt Collar (白襯衫立領)
  const shirtY = coatTop + radius * 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.2 + swayX, shirtY);
  ctx.lineTo(x + swayX, shirtY + radius * 0.15);
  ctx.lineTo(x + radius * 0.2 + swayX, shirtY);
  ctx.closePath();
  ctx.fill();

  // Burgundy Silk Bowtie (紅絲絨領結)
  ctx.fillStyle = '#991b1b';
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 5 + swayX, shirtY + 3);
  ctx.lineTo(x + 5 + swayX, shirtY + 7);
  ctx.lineTo(x + 5 + swayX, shirtY + 3);
  ctx.lineTo(x - 5 + swayX, shirtY + 7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // --- B. Brass Pocket Watch Chain (黃銅齒輪懷表金鏈) ---
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX, y + radius * 0.15, radius * 0.28, Math.PI * 0.1, Math.PI * 0.6);
  ctx.stroke();

  // Small Pocket Watch Dial
  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + radius * 0.22 + swayX, y + radius * 0.22, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * 15. 蒂娜 (DINA) - 【日蝕雙相晨昏神女禮袍】
 * 左金右藍陰陽對稱晚禮服、日輪月魄雙生浮雕束腰、星河半透明天衣飄帛
 */
export function drawDinaAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Dual-Aspect Split Gown (Half Gold, Half Midnight Indigo) ---
  // Left Half: Solar Gold
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();

  // Right Half: Lunar Indigo
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.fill();

  // Center Seam Gold Starlight Filigree
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + swayX, y - radius * 0.75);
  ctx.lineTo(x + swayX, y + radius * 0.75);
  ctx.stroke();

  // --- B. Solar-Lunar Interlocking Corset (晨昏雙生浮雕束腰) ---
  const corsetY = y + radius * 0.08;
  const corsetW = radius * 0.58;
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x - corsetW * 0.5 + swayX, corsetY, corsetW, radius * 0.22, 3);
  ctx.fill();
  ctx.stroke();

  // Left Sunburst / Right Crescent Moon Emblem on Corset
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x - 5 + swayX, corsetY + radius * 0.11, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(x + 5 + swayX, corsetY + radius * 0.11, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Semi-translucent Celestial Celestial Stole (星河天衣飄帶)
  const floatWave = Math.sin(time * 3) * 5;
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.65, y - radius * 0.2);
  ctx.bezierCurveTo(x - radius * 0.9, y + floatWave, x - radius * 0.6, y + radius * 0.55 + floatWave, x - radius * 0.35, y + radius * 0.7);
  ctx.stroke();

  ctx.restore();
}

/**
 * 16. 劍仙 (JIANXIAN) - 【九霄青蓮飄渺太極仙真羽衣】
 * 天青流雲廣袖仙袍、重瓣青蓮金繡、太極八卦白玉佩、朱漆養劍仙葫
 */
export function drawJianxianAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Azure Sky & Pure Cloud Daoist Robe (天青月白流雲道袍) ---
  const robeGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  robeGrad.addColorStop(0, '#f0fdf4'); // Cloud mist white
  robeGrad.addColorStop(0.5, '#0284c7'); // Azure sky blue
  robeGrad.addColorStop(1, '#0c4a6e');

  ctx.fillStyle = robeGrad;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right-Crossing White Silk Lapels (交叉白玉道襟)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.35, y - radius * 0.45);
  ctx.lineTo(x + 2 + swayX, y + radius * 0.1);
  ctx.lineTo(x + radius * 0.35, y - radius * 0.45);
  ctx.stroke();

  // Golden Embroidered Azure Lotus Petals on Left Sleeve
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.2;
  const lotusX = x - radius * 0.35 + swayX;
  const lotusY = y + radius * 0.25;
  ctx.beginPath();
  ctx.ellipse(lotusX, lotusY, 5, 2.5, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.ellipse(lotusX + 3, lotusY - 2, 4, 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // --- B. Tai Chi Bagua White Jade Pendant (太極八卦白玉佩) ---
  const jadeY = y + radius * 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX, jadeY, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Red Silk Tassel Ribbon (朱砂紅絲劍穗流蘇)
  const tasselWave = Math.sin(time * 5) * 3;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + swayX, jadeY + 4.5);
  ctx.lineTo(x + swayX + tasselWave, jadeY + 12);
  ctx.stroke();

  // --- C. Mini Zhu-Qi Spiritual Wine Gourd (朱漆養劍葫蘆) ---
  const gourdX = x + radius * 0.42 + swayX;
  const gourdY = y + radius * 0.28;
  ctx.fillStyle = '#b91c1c';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  // Lower chamber
  ctx.beginPath();
  ctx.arc(gourdX, gourdY, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Upper chamber
  ctx.beginPath();
  ctx.arc(gourdX, gourdY - 4.5, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * 17. 龍神 (LONGSHEN) - 【九五至尊真龍焚天皇龍戰袍】
 * 赤金龍鱗帝王重甲、逆鱗盤龍護心鎧、怒目龍首肩鎧、真火烈焰戰袍
 */
export function drawLongshenAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Imperial Scale Armor Robe (赤金龍鱗戰甲) ---
  const robeGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  robeGrad.addColorStop(0, '#b45309'); // Imperial Gold
  robeGrad.addColorStop(0.5, '#b91c1c'); // Dragonblood Crimson
  robeGrad.addColorStop(1, '#450a0a');

  ctx.fillStyle = robeGrad;
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Golden Dragon Scales Pattern (金絲龍鱗紋)
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 1;
  for (let row = 0; row < 3; row++) {
    const ry = y - radius * 0.15 + row * (radius * 0.16);
    for (let c = -2; c <= 2; c++) {
      const cx = x + c * (radius * 0.18) + (row % 2 === 0 ? 0 : radius * 0.09) + swayX;
      ctx.beginPath();
      ctx.arc(cx, ry, 3.5, 0, Math.PI);
      ctx.stroke();
    }
  }

  // --- B. Imperial Dragon-Head Roaring Pauldrons (怒目龍首肩甲) ---
  for (let side = -1; side <= 1; side += 2) {
    const dx = x + side * (radius * 0.68);
    const dy = y - radius * 0.3;
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;

    // Dragon head shape
    ctx.beginPath();
    ctx.ellipse(dx, dy, 6, 4.5, (side * Math.PI) / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Flaming Pearl in Mouth
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(dx + side * 4, dy + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- C. Golden Dragon-Pearl Heartplate (盤龍吐珠護心鏡) ---
  const heartY = y + radius * 0.1;
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x + swayX, heartY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * 18. 蜘蛛 (ZHIZHU) - 【幽夜黑寡婦毒網絲絨宮廷胸衣長裙】
 * 暗夜哥德蕾絲深V胸衣、劇毒翠綠寶石、蛛網銀線骨架、毒針黑曜頸圈
 */
export function drawZhizhuAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Midnight Black Velvet Corset (黑寡婦絲絨宮廷束胸) ---
  ctx.fillStyle = '#09090b'; // Obsidian velvet
  ctx.strokeStyle = '#059669'; // Poison emerald trim
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Silver Spiderweb Filigree Ribbing across Chest
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // Radial spokes
  ctx.moveTo(x + swayX, y - radius * 0.1);
  ctx.lineTo(x - radius * 0.45, y - radius * 0.35);
  ctx.moveTo(x + swayX, y - radius * 0.1);
  ctx.lineTo(x + radius * 0.45, y - radius * 0.35);
  ctx.moveTo(x + swayX, y - radius * 0.1);
  ctx.lineTo(x - radius * 0.38, y + radius * 0.35);
  ctx.moveTo(x + swayX, y - radius * 0.1);
  ctx.lineTo(x + radius * 0.38, y + radius * 0.35);
  ctx.stroke();

  // Connecting Web Arcs
  ctx.beginPath();
  ctx.arc(x + swayX, y - radius * 0.1, radius * 0.22, Math.PI * 0.1, Math.PI * 0.9);
  ctx.arc(x + swayX, y - radius * 0.1, radius * 0.35, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // --- B. Poison Emerald Heart Pendant & Choker (凝毒翠綠寶石項鍊) ---
  const chokY = y - radius * 0.4;
  ctx.fillStyle = '#10b981';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  // Teardrop shape
  ctx.moveTo(x + swayX, chokY - 3);
  ctx.quadraticCurveTo(x + 4 + swayX, chokY + 4, x + swayX, chokY + 7);
  ctx.quadraticCurveTo(x - 4 + swayX, chokY + 4, x + swayX, chokY - 3);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * 19. 辛 (XIN) - 【雙相魔劍遊俠神聖暗影聖騎士板甲】
 * 左聖光白銀、右暗影黑曜撞色胸甲、雙翼肩甲、聖暗雙相能量護喉
 */
export function drawXinAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  xinForm: 'neutral' | 'light' | 'dark' = 'neutral'
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Asymmetric Dual-Aspect Breastplate ---
  // Left Half: Holy Silver Knight Plate
  ctx.fillStyle = xinForm === 'dark' ? '#334155' : '#f8fafc';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, Math.PI * 0.5, Math.PI * 1.5);
  ctx.fill();
  ctx.stroke();

  // Right Half: Shadow Obsidian Blade Armor
  ctx.fillStyle = xinForm === 'light' ? '#475569' : '#0f172a';
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.fill();
  ctx.stroke();

  // Holy Cross Engraving on Left Chest
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x - radius * 0.28 + swayX, y - radius * 0.15, 3, 10);
  ctx.fillRect(x - radius * 0.34 + swayX, y - radius * 0.11, 10, 3);

  // Void Rune Mark on Right Chest
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.22 + swayX, y - radius * 0.15);
  ctx.lineTo(x + radius * 0.32 + swayX, y - radius * 0.02);
  ctx.lineTo(x + radius * 0.24 + swayX, y + radius * 0.1);
  ctx.stroke();

  // Heavy Armored Gorget Throat Shield (護喉甲)
  const gorgetY = y - radius * 0.46;
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x - radius * 0.26 + swayX, gorgetY, radius * 0.52, radius * 0.2, 3);
  ctx.fill();
  ctx.stroke();

  // Dual Aspect Energy Core in Center
  ctx.fillStyle = xinForm === 'light' ? '#facc15' : xinForm === 'dark' ? '#a855f7' : '#e0e7ff';
  ctx.beginPath();
  ctx.arc(x + swayX, gorgetY + radius * 0.1, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 20. 傀儡師 (KUILEISHI) - 【哥德提線大師夜宴燕尾絨服】
 * 紫羅蘭天鵝絨長大衣、純白維多利亞蕾絲胸褶（Jabot）、黃銅牽線齒輪胸盒、陶瓷哭笑面具
 */
export function drawKuileishiAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Gothic Deep Violet Swallowtail Coat Silhouette ---
  const coatGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  coatGrad.addColorStop(0, '#4c1d95'); // Royal violet velvet
  coatGrad.addColorStop(0.6, '#311068');
  coatGrad.addColorStop(1, '#1e083c');

  ctx.fillStyle = coatGrad;
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.76, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Layered Pure White Victorian Lace Jabot (維多利亞蕾絲褶胸巾)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d8b4fe';
  ctx.lineWidth = 0.8;
  const jabotTop = y - radius * 0.44;
  for (let layer = 0; layer < 3; layer++) {
    const ly = jabotTop + layer * (radius * 0.12);
    const lw = radius * (0.34 - layer * 0.06);
    ctx.beginPath();
    ctx.moveTo(x - lw * 0.5 + swayX, ly);
    ctx.quadraticCurveTo(x + swayX, ly + radius * 0.12, x + lw * 0.5 + swayX, ly);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- B. Brass Mechanical Thread-Spool Gear Chestbox (黃銅牽線齒輪胸盒) ---
  const boxY = y + radius * 0.08;
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x - 8 + swayX, boxY, 16, 10, 2);
  ctx.fill();
  ctx.stroke();

  // Center Spinning Brass Spool
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX, boxY + 5, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Luminescent Puppet Mana Threads emanating from box
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.75)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x - 4 + swayX, boxY + 8);
  ctx.lineTo(x - radius * 0.5, y + radius * 0.45);
  ctx.moveTo(x + 4 + swayX, boxY + 8);
  ctx.lineTo(x + radius * 0.5, y + radius * 0.45);
  ctx.stroke();

  // --- C. Porcelain Comedy/Tragedy Doll Brooch (陶瓷哭笑木偶胸針) ---
  const broochX = x - radius * 0.28 + swayX;
  const broochY = y - radius * 0.25;
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#9333ea';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(broochX, broochY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tiny Mask Smile
  ctx.strokeStyle = '#4c1d95';
  ctx.beginPath();
  ctx.arc(broochX, broochY + 0.5, 1.8, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * 21. 一拳尹雄 (YINYONG) - 【極真霸拳宗師戰意武道服】
 * 重磅純棉墨黑短打道服、赤炎暗繡滾邊、百戰世界純金冠軍腰帶、赤白戰氣拳擊綁帶
 */
export function drawYinyongAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0
) {
  ctx.save();
  const swayX = -vx * 0.015;

  // --- A. Master's Heavy Cotton Martial Gi (墨黑短打武道袍) ---
  const giGrad = ctx.createLinearGradient(x, y - radius * 0.5, x, y + radius * 0.5);
  giGrad.addColorStop(0, '#18181b'); // Solid black cotton
  giGrad.addColorStop(0.5, '#27272a');
  giGrad.addColorStop(1, '#09090b');

  ctx.fillStyle = giGrad;
  ctx.strokeStyle = '#dc2626'; // Flaming red seam
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // V-Neck Open Chest Lapels showing Master's Muscular Physique
  ctx.fillStyle = '#fbcfe8'; // Skin tone shadow
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.28 + swayX, y - radius * 0.45);
  ctx.lineTo(x + swayX, y - radius * 0.05);
  ctx.lineTo(x + radius * 0.28 + swayX, y - radius * 0.45);
  ctx.closePath();
  ctx.fill();

  // Red Flame Embroidered Collar Borders
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.32 + swayX, y - radius * 0.45);
  ctx.lineTo(x + swayX, y - radius * 0.02);
  ctx.lineTo(x + radius * 0.32 + swayX, y - radius * 0.45);
  ctx.stroke();

  // --- B. Heavy Gold World Champion Title Belt (百戰純金冠軍金腰帶) ---
  const beltY = y + radius * 0.18;
  const beltW = radius * 0.82;
  const beltH = radius * 0.24;

  // Heavy Black Leather Belt Strap
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.2;
  ctx.fillRect(x - beltW * 0.5 + swayX, beltY, beltW, beltH);
  ctx.strokeRect(x - beltW * 0.5 + swayX, beltY, beltW, beltH);

  // Massive Sculpted Gold Center Plate
  const plateW = radius * 0.42;
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 8;
  ctx.fillRect(x - plateW * 0.5 + swayX, beltY - 2, plateW, beltH + 4);
  ctx.strokeRect(x - plateW * 0.5 + swayX, beltY - 2, plateW, beltH + 4);
  ctx.shadowBlur = 0;

  // Central Pigeon-Blood Ruby Gemstone on Belt
  ctx.fillStyle = '#dc2626';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x + swayX, beltY + beltH * 0.5, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Side Gold Title Medallions
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(x - beltW * 0.32 + swayX, beltY + beltH * 0.5, 2.5, 0, Math.PI * 2);
  ctx.arc(x + beltW * 0.32 + swayX, beltY + beltH * 0.5, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 22. 曼麥亞・軍子 (MANYAIA JUNKO) - 【天龍神從聖縛作戰裝束】
 * 神聖符文白繃帶、暗銀從刃輕鎧、金紅天龍符印與深青記憶晶痕
 */
export function drawManyaiyaAttire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  vx: number = 0,
  vy: number = 0,
  options: OutfitRenderOptions = {}
) {
  ctx.save();
  const swayX = -vx * 0.012;
  const swayY = -vy * 0.012;

  // 1. 周身纏繞流動的白色神聖符文繃帶 (Flowing Holy Bandages)
  const ribbonCount = 3;
  for (let i = 0; i < ribbonCount; i++) {
    const angleOffset = (i * Math.PI * 2) / ribbonCount;
    const wave = Math.sin(time * 4 + i * 2.1) * 3;
    const ribbonAngle = time * 1.5 + angleOffset;

    ctx.save();
    ctx.strokeStyle = i === 1 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(226, 232, 240, 0.85)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;

    ctx.beginPath();
    const startX = x + Math.cos(ribbonAngle) * (radius * 0.65) + swayX;
    const startY = y + Math.sin(ribbonAngle) * (radius * 0.65) + swayY;
    const cpX = x + Math.cos(ribbonAngle + 0.5) * (radius * 1.1) + wave;
    const cpY = y + Math.sin(ribbonAngle + 0.5) * (radius * 1.1) - wave;
    const endX = x + Math.cos(ribbonAngle + 1.1) * (radius * 1.35) - vx * 0.025;
    const endY = y + Math.sin(ribbonAngle + 1.1) * (radius * 1.35) - vy * 0.025;

    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    ctx.stroke();

    // 繃帶末端小菱形配重聖金屬符頭
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(endX, endY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. 胸前與腰側的暗銀從刃輕型胸甲 (Dark Silver Blade Armor Plating)
  const plateW = radius * 0.6;
  const plateH = radius * 0.45;
  const plateY = y - radius * 0.15 + swayY;

  const armorGrad = ctx.createLinearGradient(x - plateW * 0.5, plateY, x + plateW * 0.5, plateY + plateH);
  armorGrad.addColorStop(0, '#334155');
  armorGrad.addColorStop(0.5, '#1e293b');
  armorGrad.addColorStop(1, '#0f172a');

  ctx.fillStyle = armorGrad;
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // 輕鎧斜角流線幾何
  ctx.moveTo(x - plateW * 0.5 + swayX, plateY);
  ctx.lineTo(x + plateW * 0.5 + swayX, plateY);
  ctx.lineTo(x + plateW * 0.35 + swayX, plateY + plateH);
  ctx.lineTo(x - plateW * 0.35 + swayX, plateY + plateH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. 胸甲中央神聖從刃十字徽記與記憶血晶 (Sacred Cross Insignia & Blood Memory Core)
  ctx.save();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.4;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(x + swayX - 4, plateY + plateH * 0.5);
  ctx.lineTo(x + swayX + 4, plateY + plateH * 0.5);
  ctx.moveTo(x + swayX, plateY + plateH * 0.5 - 4);
  ctx.lineTo(x + swayX, plateY + plateH * 0.5 + 4);
  ctx.stroke();

  // 中央緋紅記憶微核
  ctx.fillStyle = '#fee2e2';
  ctx.beginPath();
  ctx.arc(x + swayX, plateY + plateH * 0.5, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * Universal Master Function to Draw Character Exclusive Clothes & Attire
 */
export function drawCharacterExclusiveOutfit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  charId: CharacterId,
  options: OutfitRenderOptions = {}
) {
  const time = options.time ?? Date.now() * 0.001;
  const vx = options.vx ?? 0;
  const vy = options.vy ?? 0;

  switch (charId) {
    case 'oba':
      drawObaAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'huotong':
      drawHuotongAttire(ctx, x, y, radius, time, vx, vy, options.isHotBody);
      break;
    case 'hailaise':
      drawHailaiseAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'lingyinsi':
      drawLingyinsiAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'chanshi':
      drawChanshiAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'huangzuan':
      drawHuangzuanAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'lanzuan':
      drawLanzuanAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'fenzuan':
      drawFenzuanAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'baizuan':
      drawBaizuanAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'xukongshou':
      drawXukongshouAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'fan':
      drawFanAttire(ctx, x, y, radius, time, vx, vy, options.fanOverclockActive);
      break;
    case 'tunshimozu':
      drawTunshimozuAttire(ctx, x, y, radius, time, vx, vy, options.growthStacks);
      break;
    case 'mimi':
      drawMimiAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'jiandaoshou':
      drawJiandaoshouAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'dina':
      drawDinaAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'jianxian':
      drawJianxianAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'longshen':
      drawLongshenAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'zhizhu':
      drawZhizhuAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'xin':
      drawXinAttire(ctx, x, y, radius, time, vx, vy, options.xinForm);
      break;
    case 'kuileishi':
      drawKuileishiAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'yinyong':
      drawYinyongAttire(ctx, x, y, radius, time, vx, vy);
      break;
    case 'manyaiya':
      drawManyaiyaAttire(ctx, x, y, radius, time, vx, vy, options);
      break;
  }
}

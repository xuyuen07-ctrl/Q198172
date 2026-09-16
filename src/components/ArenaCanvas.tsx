import React, { useEffect, useRef } from 'react';
import { BallState, FloatingText, Particle, Projectile } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ARENA_WIDTH, ARENA_HEIGHT } from '../utils/physics';
import { renderCustomDamageArt } from '../utils/damageRenderer';
import {
  drawChampionSphere,
  drawCustomParticle,
  drawProjectile,
  drawLingyinsiClone,
  drawOrbitingGreenOrbs,
  drawChanshiAura,
  drawHuangzuanField,
  drawLanzuanWavelengthAura,
  drawLanzuanBlueOrb,
  drawLanzuanEmotionField,
  drawFenzuanField,
  drawBaizuanShining,
  drawBaizuanDeathRay,
  drawBaizuanClone,
  drawVoidRift,
  drawVoidHuntTargetMark,
  drawVoidBiteTether,
  drawVoidTrapCage,
  drawFanArrowVisuals,
  drawFanAttackRangeCircle,
  drawEnergyShard,
  drawDevourParticleStream,
  drawMimiGrowthPack,
  drawMimiClawSlash,
  drawJiandaoshouMist,
  drawLongshenFlameDomain,
  drawLongshenFlameCone,
  drawLongshenFlamePreview,
  drawLongshenStrikeSlash,
  drawSpiderWebZone,
  drawSpiderMini,
  drawCombatPuppet,
  drawYinyongBoundlessDomain
} from '../utils/renderer';

interface ArenaCanvasProps {
  p1: BallState;
  p2: BallState;
  projectiles?: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  onPointerSteer?: (vec: { x: number; y: number } | null) => void;
  isP1Manual: boolean;
  onInitialized?: () => void;
}

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  p1,
  p2,
  projectiles = [],
  particles,
  floatingTexts,
  onPointerSteer,
  isP1Manual,
  onInitialized
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const hasNotifiedInitRef = useRef(false);

  // Notify when BattleArena is successfully mounted & ready
  useEffect(() => {
    if (canvasRef.current && !hasNotifiedInitRef.current) {
      hasNotifiedInitRef.current = true;
      onInitialized?.();
    }
  }, [onInitialized]);

  // Mouse / Touch Steering Handler for Manual Mode
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isP1Manual || !onPointerSteer) return;
    isDraggingRef.current = true;
    updatePointerDirection(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isP1Manual || !onPointerSteer || !isDraggingRef.current) return;
    updatePointerDirection(e);
  };

  const handlePointerUp = () => {
    if (!isP1Manual || !onPointerSteer) return;
    isDraggingRef.current = false;
    onPointerSteer(null);
  };

  const updatePointerDirection = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onPointerSteer) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = ARENA_WIDTH / rect.width;
    const scaleY = ARENA_HEIGHT / rect.height;

    // Direct 1:1 Fixed Map Coordinates (No Camera Wobble / Pan Offset)
    const worldX = (e.clientX - rect.left) * scaleX;
    const worldY = (e.clientY - rect.top) * scaleY;

    const dx = worldX - p1.x;
    const dy = worldY - p1.y;
    const len = Math.hypot(dx, dy);

    if (len > 5) {
      onPointerSteer({ x: dx / len, y: dy / len });
    } else {
      onPointerSteer(null);
    }
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = ARENA_WIDTH * dpr;
    canvas.height = ARENA_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // 1. Draw Arena Background (Rock-solid Fixed Arena Camera, No Disorienting Zoom/Pan/Shake)
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Save Context for Arena
    ctx.save();
    // Clip to Arena Boundaries
    ctx.beginPath();
    ctx.rect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
    ctx.clip();

    // Dark stadium floor gradient
    const bgGrad = ctx.createRadialGradient(
      ARENA_WIDTH / 2,
      ARENA_HEIGHT / 2,
      50,
      ARENA_WIDTH / 2,
      ARENA_HEIGHT / 2,
      ARENA_WIDTH / 1.4
    );
    bgGrad.addColorStop(0, '#131826');
    bgGrad.addColorStop(0.7, '#0b0f19');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Subtle tactical grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= ARENA_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ARENA_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ARENA_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ARENA_WIDTH, y);
      ctx.stroke();
    }

    // Center Arena Markings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Center divider line
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(ARENA_WIDTH / 2, 20);
    ctx.lineTo(ARENA_WIDTH / 2, ARENA_HEIGHT - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Outer Arena Border with glowing edge
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, ARENA_WIDTH - 4, ARENA_HEIGHT - 4);

    // Inner Corner accents
    drawCornerAccents(ctx);

    // 1.5 Draw Floor Auras & Persistent AoE zones before entities
    const nowTime = performance.now() * 0.001;
    if (p1.characterId === 'chanshi') {
      drawChanshiAura(ctx, p1.x, p1.y, nowTime, 100);
    }
    if (p2.characterId === 'chanshi') {
      drawChanshiAura(ctx, p2.x, p2.y, nowTime, 100);
    }

    if (p1.characterId === 'huangzuan') {
      if (p1.huangzuanFieldActive) {
        drawHuangzuanField(ctx, p1.x, p1.y, nowTime, 115, false, 0);
      } else if (p1.huangzuanFieldCollapseTimer && p1.huangzuanFieldCollapseTimer > 0) {
        drawHuangzuanField(ctx, p1.x, p1.y, nowTime, 115, true, 1 - p1.huangzuanFieldCollapseTimer / 0.35);
      }
    }
    if (p2.characterId === 'huangzuan') {
      if (p2.huangzuanFieldActive) {
        drawHuangzuanField(ctx, p2.x, p2.y, nowTime, 115, false, 0);
      } else if (p2.huangzuanFieldCollapseTimer && p2.huangzuanFieldCollapseTimer > 0) {
        drawHuangzuanField(ctx, p2.x, p2.y, nowTime, 115, true, 1 - p2.huangzuanFieldCollapseTimer / 0.35);
      }
    }

    // Lanzuan Wavelength & Emotion Field
    if (p1.characterId === 'lanzuan') {
      drawLanzuanWavelengthAura(ctx, p1.x, p1.y, nowTime, 110);
      if (p1.lanzuanEmotionFieldActive) {
        drawLanzuanEmotionField(ctx, p1.x, p1.y, nowTime, 140, false, 0);
      } else if (p1.lanzuanEmotionCollapseTimer && p1.lanzuanEmotionCollapseTimer > 0) {
        drawLanzuanEmotionField(ctx, p1.x, p1.y, nowTime, 140, true, 1 - p1.lanzuanEmotionCollapseTimer / 0.35);
      }
    }
    if (p2.characterId === 'lanzuan') {
      drawLanzuanWavelengthAura(ctx, p2.x, p2.y, nowTime, 110);
      if (p2.lanzuanEmotionFieldActive) {
        drawLanzuanEmotionField(ctx, p2.x, p2.y, nowTime, 140, false, 0);
      } else if (p2.lanzuanEmotionCollapseTimer && p2.lanzuanEmotionCollapseTimer > 0) {
        drawLanzuanEmotionField(ctx, p2.x, p2.y, nowTime, 140, true, 1 - p2.lanzuanEmotionCollapseTimer / 0.35);
      }
    }

    // Fenzuan Damage Reduction Field (Passive 2: 85px)
    if (p1.characterId === 'fenzuan' && p1.fenzuanFieldActive) {
      drawFenzuanField(ctx, p1.x, p1.y, nowTime, 85);
    }
    if (p2.characterId === 'fenzuan' && p2.fenzuanFieldActive) {
      drawFenzuanField(ctx, p2.x, p2.y, nowTime, 85);
    }

    // Baizuan Shining Radiant Aura (Passive 2: 115px)
    if (p1.characterId === 'baizuan' && p1.baizuanShiningActive) {
      drawBaizuanShining(ctx, p1.x, p1.y, nowTime, 115);
    }
    if (p2.characterId === 'baizuan' && p2.baizuanShiningActive) {
      drawBaizuanShining(ctx, p2.x, p2.y, nowTime, 115);
    }

    // Void Rifts (Xukongshou Passive 2: 虛空裂縫)
    if (p1.xukongshouRift) {
      drawVoidRift(ctx, p1.xukongshouRift, nowTime);
    }
    if (p2.xukongshouRift) {
      drawVoidRift(ctx, p2.xukongshouRift, nowTime);
    }

    // Spider Web Zones (蜘蛛 被動二: 獵網束縛 100px 直徑蛛網黏滯區域)
    if (p1.spiderWebZones && p1.spiderWebZones.length > 0) {
      for (const zone of p1.spiderWebZones) {
        drawSpiderWebZone(ctx, zone, nowTime);
      }
    }
    if (p2.spiderWebZones && p2.spiderWebZones.length > 0 && p2.spiderWebZones !== p1.spiderWebZones) {
      for (const zone of p2.spiderWebZones) {
        drawSpiderWebZone(ctx, zone, nowTime);
      }
    }

    // Energy Shards (Tunshimozu: 能量碎片)
    if (p1.energyShards && p1.energyShards.length > 0) {
      for (const shard of p1.energyShards) {
        drawEnergyShard(ctx, shard, nowTime);
      }
    }
    if (p2.energyShards && p2.energyShards.length > 0 && p2.energyShards !== p1.energyShards) {
      for (const shard of p2.energyShards) {
        drawEnergyShard(ctx, shard, nowTime);
      }
    }

    // Mimi Growth Packs (愛心者・咪咪: 咪咪希望 成長包)
    if (p1.mimiGrowthPacks && p1.mimiGrowthPacks.length > 0) {
      for (const pack of p1.mimiGrowthPacks) {
        drawMimiGrowthPack(ctx, pack, nowTime);
      }
    }
    if (p2.mimiGrowthPacks && p2.mimiGrowthPacks.length > 0 && p2.mimiGrowthPacks !== p1.mimiGrowthPacks) {
      for (const pack of p2.mimiGrowthPacks) {
        drawMimiGrowthPack(ctx, pack, nowTime);
      }
    }

    // Mimi Claw Slash FX (貓咪衝爪 爪擊特效)
    if (p1.characterId === 'mimi' && (p1.mimiClawAnimTimer ?? 0) > 0 && p1.mimiClawTargetX !== undefined && p1.mimiClawTargetY !== undefined) {
      const slashProgress = Math.max(0, Math.min(1, 1 - (p1.mimiClawAnimTimer ?? 0) / 0.35));
      drawMimiClawSlash(ctx, p1.mimiClawTargetX, p1.mimiClawTargetY, slashProgress);
    }
    if (p2.characterId === 'mimi' && (p2.mimiClawAnimTimer ?? 0) > 0 && p2.mimiClawTargetX !== undefined && p2.mimiClawTargetY !== undefined) {
      const slashProgress = Math.max(0, Math.min(1, 1 - (p2.mimiClawAnimTimer ?? 0) / 0.35));
      drawMimiClawSlash(ctx, p2.mimiClawTargetX, p2.mimiClawTargetY, slashProgress);
    }

    // Dina White Light Energy Nodes (蒂納 被動一: 戰場浮游白光能量點)
    const drawWhiteEnergyNode = (energy: any, time: number) => {
      if (!energy || (energy.state !== 'AVAILABLE' && energy.state !== 'RESERVED_FOR_ABSORPTION')) return;
      ctx.save();
      const pulse = 1.0 + Math.sin(time * 6 + (energy.createdAt || 0) * 0.01) * 0.2;
      const ex = energy.x ?? 0;
      const ey = energy.y ?? 0;
      if (ex === 0 && ey === 0) {
        ctx.restore();
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#e0e7ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ex, ey, 4.0 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(199, 210, 254, 0.7)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(ex, ey, 8.0 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    if (p1.dinaWhiteEnergies) {
      for (const e of p1.dinaWhiteEnergies) drawWhiteEnergyNode(e, nowTime);
    }
    if (p2.dinaWhiteEnergies && p2.dinaWhiteEnergies !== p1.dinaWhiteEnergies) {
      for (const e of p2.dinaWhiteEnergies) drawWhiteEnergyNode(e, nowTime);
    }

    // Devour Particle Inflow Streamers (Tunshimozu Passive 1: 吞噬能量收縮流束)
    if (p1.characterId === 'tunshimozu' && (p1.devourImplosionAnimTimer ?? 0) > 0 && p1.devourLastShardX !== undefined && p1.devourLastShardY !== undefined) {
      const p1Progress = Math.max(0, Math.min(1, 1 - (p1.devourImplosionAnimTimer ?? 0) / 0.45));
      drawDevourParticleStream(ctx, p1.devourLastShardX, p1.devourLastShardY, p1.x, p1.y, p1.radius, p1Progress, nowTime);
    }
    if (p2.characterId === 'tunshimozu' && (p2.devourImplosionAnimTimer ?? 0) > 0 && p2.devourLastShardX !== undefined && p2.devourLastShardY !== undefined) {
      const p2Progress = Math.max(0, Math.min(1, 1 - (p2.devourImplosionAnimTimer ?? 0) / 0.45));
      drawDevourParticleStream(ctx, p2.devourLastShardX, p2.devourLastShardY, p2.x, p2.y, p2.radius, p2Progress, nowTime);
    }

    // Jiandaoshou Holy Mist Sanctuary (剪刀手 被動二: 聖霧守護 130px 半徑領域)
    if (p1.characterId === 'jiandaoshou' && p1.jiandaoshouMistActive) {
      drawJiandaoshouMist(ctx, p1.x, p1.y, nowTime, 130);
    }
    if (p2.characterId === 'jiandaoshou' && p2.jiandaoshouMistActive) {
      drawJiandaoshouMist(ctx, p2.x, p2.y, nowTime, 130);
    }

    // Longshen Divine Flame Domain (龍神 被動四: 龍身 160px 烈焰領域)
    if (p1.characterId === 'longshen' && p1.longshenFormActive) {
      drawLongshenFlameDomain(ctx, p1.x, p1.y, nowTime, 160);
    }
    if (p2.characterId === 'longshen' && p2.longshenFormActive) {
      drawLongshenFlameDomain(ctx, p2.x, p2.y, nowTime, 160);
    }

    // Longshen Dragon Flame Cone (龍神 被動三: 龍炎 240px 90度扇形狂暴龍炎)
    if (p1.characterId === 'longshen' && p1.longshenFlameActive) {
      drawLongshenFlameCone(ctx, p1.x, p1.y, p1.longshenFlameAngle ?? 0, nowTime, 240);
    }
    if (p2.characterId === 'longshen' && p2.longshenFlameActive) {
      drawLongshenFlameCone(ctx, p2.x, p2.y, p2.longshenFlameAngle ?? 0, nowTime, 240);
    }

    // Longshen Dragon Flame Preview Indicator (龍神 被動三: 龍炎 觸發前0.5秒半透明紅色扇形預警指示器)
    const getLongshenTargetAngle = (source: BallState, enemy: BallState) => {
      let targetX = enemy.x;
      let targetY = enemy.y;
      let minDist = Math.hypot(enemy.x - source.x, enemy.y - source.y);

      if (enemy.clones) {
        for (const c of enemy.clones) {
          if (c.hp > 0) {
            const d = Math.hypot(c.x - source.x, c.y - source.y);
            if (d < minDist) {
              minDist = d;
              targetX = c.x;
              targetY = c.y;
            }
          }
        }
      }
      if (enemy.lanzuanOrb && enemy.lanzuanOrb.hp > 0) {
        const d = Math.hypot(enemy.lanzuanOrb.x - source.x, enemy.lanzuanOrb.y - source.y);
        if (d < minDist) {
          minDist = d;
          targetX = enemy.lanzuanOrb.x;
          targetY = enemy.lanzuanOrb.y;
        }
      }
      if (enemy.baizuanClone && enemy.baizuanClone.hp > 0) {
        const d = Math.hypot(enemy.baizuanClone.x - source.x, enemy.baizuanClone.y - source.y);
        if (d < minDist) {
          minDist = d;
          targetX = enemy.baizuanClone.x;
          targetY = enemy.baizuanClone.y;
        }
      }
      return Math.atan2(targetY - source.y, targetX - source.x);
    };

    const p1FlameCd = p1.longshenFlameCooldown ?? 99;
    if (
      p1.characterId === 'longshen' &&
      !p1.longshenFlameActive &&
      p2.hp > 0 &&
      ((p1FlameCd > 0 && p1FlameCd <= 0.5) || (p1FlameCd === 0 && Math.hypot(p2.x - p1.x, p2.y - p1.y) <= 260))
    ) {
      const angle = getLongshenTargetAngle(p1, p2);
      drawLongshenFlamePreview(ctx, p1.x, p1.y, angle, nowTime, p1FlameCd, 240);
    }

    const p2FlameCd = p2.longshenFlameCooldown ?? 99;
    if (
      p2.characterId === 'longshen' &&
      !p2.longshenFlameActive &&
      p1.hp > 0 &&
      ((p2FlameCd > 0 && p2FlameCd <= 0.5) || (p2FlameCd === 0 && Math.hypot(p1.x - p2.x, p1.y - p2.y) <= 260))
    ) {
      const angle = getLongshenTargetAngle(p2, p1);
      drawLongshenFlamePreview(ctx, p2.x, p2.y, angle, nowTime, p2FlameCd, 240);
    }

    // Longshen Strike Slash (龍神 被動二: 龍普 近身打擊爪芒)
    if (p1.characterId === 'longshen' && (p1.longshenStrikeAnimTimer ?? 0) > 0 && p1.longshenStrikeTargetX !== undefined && p1.longshenStrikeTargetY !== undefined) {
      const progress = Math.max(0, 1 - (p1.longshenStrikeAnimTimer ?? 0) / 0.35);
      drawLongshenStrikeSlash(ctx, p1.longshenStrikeTargetX, p1.longshenStrikeTargetY, nowTime, progress);
    }
    if (p2.characterId === 'longshen' && (p2.longshenStrikeAnimTimer ?? 0) > 0 && p2.longshenStrikeTargetX !== undefined && p2.longshenStrikeTargetY !== undefined) {
      const progress = Math.max(0, 1 - (p2.longshenStrikeAnimTimer ?? 0) / 0.35);
      drawLongshenStrikeSlash(ctx, p2.longshenStrikeTargetX, p2.longshenStrikeTargetY, nowTime, progress);
    }

    // Fan Attack Range Circle (凡: 專屬攻擊範圍圈 - 300px / 318px)
    if (p1.characterId === 'fan') {
      const range1 = p1.fanHasRangeBoost ? 318 : 300;
      let nearestTarget1: { x: number; y: number; dist: number } | null = null;
      const distToP2 = Math.hypot(p2.x - p1.x, p2.y - p1.y) - p2.radius;
      if (distToP2 <= range1) {
        nearestTarget1 = { x: p2.x, y: p2.y, dist: distToP2 };
      }
      if (p2.characterId === 'lingyinsi' && p2.clones) {
        for (const c of p2.clones) {
          if (c.hp > 0) {
            const d = Math.hypot(c.x - p1.x, c.y - p1.y) - c.radius;
            if (d <= range1 && (!nearestTarget1 || d < nearestTarget1.dist)) {
              nearestTarget1 = { x: c.x, y: c.y, dist: d };
            }
          }
        }
      }
      if (p2.characterId === 'lanzuan' && p2.lanzuanOrb && p2.lanzuanOrb.hp > 0) {
        const d = Math.hypot(p2.lanzuanOrb.x - p1.x, p2.lanzuanOrb.y - p1.y) - p2.lanzuanOrb.radius;
        if (d <= range1 && (!nearestTarget1 || d < nearestTarget1.dist)) {
          nearestTarget1 = { x: p2.lanzuanOrb.x, y: p2.lanzuanOrb.y, dist: d };
        }
      }
      if (p2.characterId === 'baizuan' && p2.baizuanClone && p2.baizuanClone.hp > 0) {
        const d = Math.hypot(p2.baizuanClone.x - p1.x, p2.baizuanClone.y - p1.y) - p2.baizuanClone.radius;
        if (d <= range1 && (!nearestTarget1 || d < nearestTarget1.dist)) {
          nearestTarget1 = { x: p2.baizuanClone.x, y: p2.baizuanClone.y, dist: d };
        }
      }
      drawFanAttackRangeCircle(
        ctx,
        p1.x,
        p1.y,
        nowTime,
        range1,
        !!p1.fanHasRangeBoost,
        !!p1.fanOverclockActive,
        !!nearestTarget1,
        nearestTarget1?.x,
        nearestTarget1?.y
      );
    }

    if (p2.characterId === 'fan') {
      const range2 = p2.fanHasRangeBoost ? 318 : 300;
      let nearestTarget2: { x: number; y: number; dist: number } | null = null;
      const distToP1 = Math.hypot(p1.x - p2.x, p1.y - p2.y) - p1.radius;
      if (distToP1 <= range2) {
        nearestTarget2 = { x: p1.x, y: p1.y, dist: distToP1 };
      }
      if (p1.characterId === 'lingyinsi' && p1.clones) {
        for (const c of p1.clones) {
          if (c.hp > 0) {
            const d = Math.hypot(c.x - p2.x, c.y - p2.y) - c.radius;
            if (d <= range2 && (!nearestTarget2 || d < nearestTarget2.dist)) {
              nearestTarget2 = { x: c.x, y: c.y, dist: d };
            }
          }
        }
      }
      if (p1.characterId === 'lanzuan' && p1.lanzuanOrb && p1.lanzuanOrb.hp > 0) {
        const d = Math.hypot(p1.lanzuanOrb.x - p2.x, p1.lanzuanOrb.y - p2.y) - p1.lanzuanOrb.radius;
        if (d <= range2 && (!nearestTarget2 || d < nearestTarget2.dist)) {
          nearestTarget2 = { x: p1.lanzuanOrb.x, y: p1.lanzuanOrb.y, dist: d };
        }
      }
      if (p1.characterId === 'baizuan' && p1.baizuanClone && p1.baizuanClone.hp > 0) {
        const d = Math.hypot(p1.baizuanClone.x - p2.x, p1.baizuanClone.y - p2.y) - p1.baizuanClone.radius;
        if (d <= range2 && (!nearestTarget2 || d < nearestTarget2.dist)) {
          nearestTarget2 = { x: p1.baizuanClone.x, y: p1.baizuanClone.y, dist: d };
        }
      }
      drawFanAttackRangeCircle(
        ctx,
        p2.x,
        p2.y,
        nowTime,
        range2,
        !!p2.fanHasRangeBoost,
        !!p2.fanOverclockActive,
        !!nearestTarget2,
        nearestTarget2?.x,
        nearestTarget2?.y
      );
    }

    // 2. Draw Active Projectiles (with Fan's exclusive golden-silver arrow VFX & particle trails)
    projectiles.forEach(proj => {
      if (proj.type === 'fan_hunter_arrow') {
        drawFanArrowVisuals(ctx, proj, nowTime);
      } else {
        drawProjectile(ctx, proj);
      }
    });

    // 3. Draw Lingyinsi Clones, Lanzuan Blue Orb, & Baizuan Mirror Clones
    if (p1.characterId === 'lingyinsi' && p1.clones && p1.clones.length > 0) {
      p1.clones.forEach(clone => {
        if (clone.hp > 0) drawLingyinsiClone(ctx, clone, p1.x, p1.y);
      });
    }
    if (p2.characterId === 'lingyinsi' && p2.clones && p2.clones.length > 0) {
      p2.clones.forEach(clone => {
        if (clone.hp > 0) drawLingyinsiClone(ctx, clone, p2.x, p2.y);
      });
    }

    if (p1.lanzuanOrb && p1.lanzuanOrb.hp > 0) {
      drawLanzuanBlueOrb(ctx, p1.lanzuanOrb, nowTime);
    }
    if (p2.lanzuanOrb && p2.lanzuanOrb.hp > 0) {
      drawLanzuanBlueOrb(ctx, p2.lanzuanOrb, nowTime);
    }

    if (p1.baizuanClone && p1.baizuanClone.hp > 0) {
      drawBaizuanClone(ctx, p1.baizuanClone, nowTime);
    }
    if (p2.baizuanClone && p2.baizuanClone.hp > 0) {
      drawBaizuanClone(ctx, p2.baizuanClone, nowTime);
    }

    // Spider Mini Summons (蜘蛛 被動三: 狂暴小蜘蛛)
    if (p1.spiderMiniSummons && p1.spiderMiniSummons.length > 0) {
      for (const mini of p1.spiderMiniSummons) {
        if (mini.hp > 0) drawSpiderMini(ctx, mini, nowTime);
      }
    }
    if (p2.spiderMiniSummons && p2.spiderMiniSummons.length > 0 && p2.spiderMiniSummons !== p1.spiderMiniSummons) {
      for (const mini of p2.spiderMiniSummons) {
        if (mini.hp > 0) drawSpiderMini(ctx, mini, nowTime);
      }
    }

    // 3.8 Combat Puppets (傀儡師 被動一: 戰鬥傀儡與命運傀儡線)
    const drawPuppetsForOwner = (owner: BallState) => {
      if (owner.characterId === 'kuileishi' && owner.puppets && owner.puppets.length > 0) {
        for (const puppet of owner.puppets) {
          if (puppet.hp <= 0 || puppet.currentSegment > 3) continue;
          ctx.save();
          const isAegis = (owner.puppetAegisTimer ?? 0) > 0 || (puppet.shieldActiveTimer ?? 0) > 0;
          const isLineFlashing = (puppet.lineFlashTimer ?? 0) > 0;

          // Glowing curved destiny puppet thread
          ctx.strokeStyle = isAegis
            ? 'rgba(232, 121, 249, 0.95)'
            : isLineFlashing
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(192, 132, 252, 0.65)';
          ctx.lineWidth = isAegis || isLineFlashing ? 2.2 : 1.3;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = isAegis ? 12 : 6;

          const midX = (owner.x + puppet.x) / 2;
          const midY = (owner.y + puppet.y) / 2 + Math.sin(nowTime * 4 + puppet.x * 0.01) * 8;

          ctx.beginPath();
          ctx.moveTo(owner.x, owner.y);
          ctx.quadraticCurveTo(midX, midY, puppet.x, puppet.y);
          ctx.stroke();

          // Energy pulse along the thread
          const threadProgress = ((nowTime * 2 + (puppet.currentSegment * 0.33)) % 1);
          const t1 = 1 - threadProgress;
          const pulseX = t1 * t1 * owner.x + 2 * t1 * threadProgress * midX + threadProgress * threadProgress * puppet.x;
          const pulseY = t1 * t1 * owner.y + 2 * t1 * threadProgress * midY + threadProgress * threadProgress * puppet.y;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#f5d0fe';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Draw the puppet
          drawCombatPuppet(ctx, puppet, owner.x, owner.y, nowTime);
        }
      }
    };

    drawPuppetsForOwner(p1);
    drawPuppetsForOwner(p2);

    // Tether thread between Puppeteer and tethered enemy
    const drawTetherBetweenBalls = (source: BallState, target: BallState) => {
      if (source.characterId === 'kuileishi' && (target.isTetheredByPuppeteer || (target.tetheredByPuppeteerTimer ?? 0) > 0)) {
        ctx.save();
        ctx.strokeStyle = 'rgba(232, 121, 249, 0.85)';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 14;
        ctx.setLineDash([8, 4]);

        const dashOffset = -nowTime * 60;
        ctx.lineDashOffset = dashOffset;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 曼麥亞・軍子: 聖帶・斷憶縛界 聖潔符文白繃帶鎖鏈 (Sacred Holy Bandage Tether)
      if (source.characterId === 'manyaiya' && (source.junkoTetherPulling || (source.junkoTetherPullTimer ?? 0) > 0)) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.0;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;

        // 雙重白繃帶波紋交織
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.hypot(dx, dy);
        const steps = 12;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const nx = source.x + dx * t;
          const ny = source.y + dy * t;
          const wave = Math.sin(t * Math.PI * 4 + nowTime * 15) * 4 * (1 - Math.abs(t - 0.5) * 1.5);
          const perpX = -dy / dist;
          const perpY = dx / dist;
          ctx.lineTo(nx + perpX * wave, ny + perpY * wave);
        }
        ctx.stroke();

        // 繃帶金紅天龍符文結點
        ctx.fillStyle = '#ef4444';
        for (let k = 1; k < 4; k++) {
          const kt = k / 4;
          const kx = source.x + dx * kt;
          const ky = source.y + dy * kt;
          ctx.beginPath();
          ctx.arc(kx, ky, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    };

    drawTetherBetweenBalls(p1, p2);
    drawTetherBetweenBalls(p2, p1);

    // Yinyong Boundless Domain (被動四: 一拳無界領域)
    const drawBoundlessForBall = (ball: BallState) => {
      if (ball.characterId === 'yinyong' && (ball.yinyongBoundlessActive || (ball.yinyongBoundlessDuration ?? 0) > 0)) {
        drawYinyongBoundlessDomain(
          ctx,
          ball.x,
          ball.y,
          nowTime,
          ball.yinyongBoundlessDuration ?? 0,
          (ball.yinyongBoundlessCollapseTimer ?? 0) > 0
        );
      }
    };
    drawBoundlessForBall(p1);
    drawBoundlessForBall(p2);

    // Yinyong Teleport Afterimage (瞬間突襲紅黑殘像 0.15s)
    const drawAfterimageForBall = (ball: BallState) => {
      if (ball.characterId === 'yinyong' && (ball.yinyongAfterimageTimer ?? 0) > 0 && ball.yinyongAfterimageX !== undefined && ball.yinyongAfterimageY !== undefined) {
        ctx.save();
        const alpha = Math.min(0.7, (ball.yinyongAfterimageTimer / 0.15) * 0.7);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#0f172a';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ball.yinyongAfterimageX, ball.yinyongAfterimageY, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    };
    drawAfterimageForBall(p1);
    drawAfterimageForBall(p2);

    // 4. Draw Particles with Custom Particle Renderer
    particles.forEach(p => {
      drawCustomParticle(ctx, p);
    });

    // 5. Draw Both Balls
    drawBall(ctx, p1, p2);
    drawBall(ctx, p2, p1);

    // Baizuan White Death Ray (Passive 3: 300px beam rendered on foreground so beam strikes target ball visibly)
    if (p1.characterId === 'baizuan' && p1.baizuanRayActive) {
      drawBaizuanDeathRay(ctx, p1.x, p1.y, p1.baizuanRayAngle || 0, 300, nowTime);
    }
    if (p2.characterId === 'baizuan' && p2.baizuanRayActive) {
      drawBaizuanDeathRay(ctx, p2.x, p2.y, p2.baizuanRayAngle || 0, 300, nowTime);
    }

    // 6. Draw Orbiting Green Orbs (Passive 3: 聚集回金集)
    if (p1.characterId === 'lingyinsi' && p1.greenOrbsActive && p1.greenOrbs && p1.greenOrbs.length > 0) {
      drawOrbitingGreenOrbs(ctx, p1.x, p1.y, p1.greenOrbs, p1.greenOrbsOrbitAngle || 0);
    }
    if (p2.characterId === 'lingyinsi' && p2.greenOrbsActive && p2.greenOrbs && p2.greenOrbs.length > 0) {
      drawOrbitingGreenOrbs(ctx, p2.x, p2.y, p2.greenOrbs, p2.greenOrbsOrbitAngle || 0);
    }

    // 6.5 Draw Xukongshou Bite Tether, Target Lock Marks, and Void Trap Cages
    if (p1.xukongshouBiteActive) {
      drawVoidBiteTether(ctx, p1.x, p1.y, p2.x, p2.y, nowTime);
    }
    if (p2.xukongshouBiteActive) {
      drawVoidBiteTether(ctx, p2.x, p2.y, p1.x, p1.y, nowTime);
    }

    if (p1.isLockedByVoidHunt) {
      drawVoidHuntTargetMark(ctx, p1.x, p1.y, p1.radius, p1.lockedByVoidHuntTimer || 0, nowTime);
    }
    if (p2.isLockedByVoidHunt) {
      drawVoidHuntTargetMark(ctx, p2.x, p2.y, p2.radius, p2.lockedByVoidHuntTimer || 0, nowTime);
    }

    if (p1.isTrappedInVoid) {
      drawVoidTrapCage(ctx, p1.x, p1.y, p1.radius, nowTime);
    }
    if (p2.isTrappedInVoid) {
      drawVoidTrapCage(ctx, p2.x, p2.y, p2.radius, nowTime);
    }

    // 7. Draw Floating Combat Texts (Custom Vector Art Damage & Combat Emblems - Zero Emojis)
    floatingTexts.forEach(ft => {
      renderCustomDamageArt(ctx, ft, nowTime);
    });

    // Restore Dynamic Camera Context
    ctx.restore();

    // Viewport Overlays (Rendered in stationary screen space)
    ctx.save();
    // Crisp viewport frame border
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, ARENA_WIDTH - 3, ARENA_HEIGHT - 3);
    drawCornerAccents(ctx);
    ctx.restore();
  }, [p1, p2, projectiles, particles, floatingTexts, isP1Manual]);


  return (
    <div id="arena-container" className="relative w-full max-w-4xl mx-auto flex items-center justify-center select-none p-1 rounded-2xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-slate-700/60 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
      {/* Decorative Cyber Corner Accents on Container */}
      <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-400 pointer-events-none rounded-tl" />
      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-red-400 pointer-events-none rounded-tr" />
      <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-500 pointer-events-none rounded-bl" />
      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 pointer-events-none rounded-br" />

      {/* Dual Side Glow Bars (P1 Blue / P2 Red) */}
      <div className="absolute top-8 bottom-8 -left-0.5 w-[2px] bg-gradient-to-b from-blue-400 via-sky-400 to-blue-600 shadow-[0_0_8px_rgba(56,189,248,0.8)] pointer-events-none opacity-80" />
      <div className="absolute top-8 bottom-8 -right-0.5 w-[2px] bg-gradient-to-b from-red-400 via-rose-500 to-red-600 shadow-[0_0_8px_rgba(244,63,94,0.8)] pointer-events-none opacity-80" />

      <canvas
        ref={canvasRef}
        id="arena-canvas"
        className={`w-full aspect-[800/520] rounded-xl shadow-inner border border-slate-800/80 bg-slate-950 ${
          isP1Manual ? 'cursor-crosshair active:cursor-grabbing' : 'cursor-default'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

function drawCornerAccents(ctx: CanvasRenderingContext2D) {
  const size = 18;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(6, 6 + size);
  ctx.lineTo(6, 6);
  ctx.lineTo(6 + size, 6);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(ARENA_WIDTH - 6 - size, 6);
  ctx.lineTo(ARENA_WIDTH - 6, 6);
  ctx.lineTo(ARENA_WIDTH - 6, 6 + size);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(6, ARENA_HEIGHT - 6 - size);
  ctx.lineTo(6, ARENA_HEIGHT - 6);
  ctx.lineTo(6 + size, ARENA_HEIGHT - 6);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(ARENA_WIDTH - 6 - size, ARENA_HEIGHT - 6);
  ctx.lineTo(ARENA_WIDTH - 6, ARENA_HEIGHT - 6);
  ctx.lineTo(ARENA_WIDTH - 6, ARENA_HEIGHT - 6 - size);
  ctx.stroke();
}

function drawBall(ctx: CanvasRenderingContext2D, ball: BallState, otherBall?: BallState) {
  const config = CHARACTERS[ball.characterId] || CHARACTERS.oba;

  // 1. Draw Motion Trail
  if (ball.trail.length > 1) {
    for (let i = 0; i < ball.trail.length; i++) {
      const pt = ball.trail[i];
      ctx.save();
      ctx.globalAlpha = pt.alpha * 0.35;
      ctx.fillStyle = config.accentColor;
      ctx.beginPath();
      const trailR = Math.max(0.5, ball.radius * Math.max(0.08, 1 - (i / ball.trail.length) * 0.85));
      ctx.arc(pt.x, pt.y, trailR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 1.5 Draw Needle Slowdown Effect on ball (Passive 3 聖針連射 減速光環)
  if (ball.isSlowedByNeedle && (ball.slowedByNeedleTimer ?? 0) > 0) {
    const slowTime = performance.now() * 0.001;
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 6, slowTime * 2, slowTime * 2 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4 frosty needle ice points orbiting
    for (let i = 0; i < 4; i++) {
      const a = slowTime * 2.5 + (i * Math.PI) / 2;
      const px = ball.x + Math.cos(a) * (ball.radius + 6);
      const py = ball.y + Math.sin(a) * (ball.radius + 6);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Draw Unified 3D Champion Sphere
  drawChampionSphere(ctx, ball.x, ball.y, ball.radius, ball.characterId, {
    time: performance.now() * 0.001,
    hasChargedBounce: ball.hasChargedBounce,
    hasExplosiveBounce: ball.hasExplosiveBounceReady,
    isHotBody: ball.isHotBodyActive,
    shieldActiveTimer: ball.shieldActiveTimer,
    hitFlashTimer: ball.hitFlashTimer,
    magicEnergy: ball.magicEnergy,
    hailaiseShield: ball.hailaiseShield,
    hailaiseMaxShield: ball.hailaiseMaxShield,
    hailaiseBombCooldown: ball.hailaiseBombCooldown,
    hasTriggeredPossession: ball.hasTriggeredPossession,
    consecutiveHits: ball.consecutiveHits,
    clonesCount: (ball.clones || []).filter(c => c.hp > 0).length,
    greenOrbsActive: ball.greenOrbsActive,
    chanshiSuperArmorTimer: ball.chanshiSuperArmorTimer,
    chanshiBellShieldTimer: ball.chanshiBellShieldTimer,
    chanshiHealingAnimTimer: ball.chanshiHealingAnimTimer,
    chanshiGoldenBodyUsed: ball.chanshiGoldenBodyUsed,
    isSlowedByChanshi: ball.isSlowedByChanshi,
    huangzuanSpeedStacks: ball.huangzuanSpeedStacks,
    huangzuanSpeedCooldown: ball.huangzuanSpeedCooldown,
    huangzuanFieldActive: ball.huangzuanFieldActive,
    huangzuanFieldDuration: ball.huangzuanFieldDuration,
    isParalyzed: ball.isParalyzed,
    paralysisTimer: ball.paralysisTimer,
    isSlowedByLanzuan: ball.isSlowedByLanzuan,
    lanzuanEmotionFieldActive: ball.lanzuanEmotionFieldActive,
    fenzuanFieldActive: ball.fenzuanFieldActive,
    isProtectedByFenzuanField: ball.isProtectedByFenzuanField,
    fenzuanBubbleActive: ball.fenzuanBubbleActive,
    baizuanCloneActive: !!ball.baizuanClone && ball.baizuanClone.hp > 0,
    baizuanShiningActive: ball.baizuanShiningActive,
    baizuanRayActive: ball.baizuanRayActive,
    isBlanchedAndImmobilized: ball.isBlanchedAndImmobilized,
    blanchedTimer: ball.blanchedTimer,
    xukongshouBiteActive: ball.xukongshouBiteActive,
    xukongshouBiteDuration: ball.xukongshouBiteDuration,
    xukongshouBiteAngle: ball.xukongshouBiteAngle,
    isInvulnerable: ball.isInvulnerable,
    isBittenByVoidBeast: ball.isBittenByVoidBeast,
    isTrappedInVoid: ball.isTrappedInVoid,
    isLockedByVoidHunt: ball.isLockedByVoidHunt,
    lockedByVoidHuntTimer: ball.lockedByVoidHuntTimer,
    isPhantomDash: ball.isPhantomDash,
    fanHunterMarks: ball.fanHunterMarks,
    fanRollCooldown: ball.fanRollCooldown,
    fanIsRolling: ball.fanIsRolling,
    fanHasRangeBoost: ball.fanHasRangeBoost,
    fanOverclockActive: ball.fanOverclockActive,
    growthStacks: ball.growthStacks,
    isGluttonyBurstReady: (ball.gluttonyBurstCooldown ?? 0) <= 0,
    devourImploding: (ball.devourImplosionAnimTimer ?? 0) > 0,
    mimiClawAnimTimer: ball.mimiClawAnimTimer,
    mimiLifeStacks: ball.mimiLifeStacks,
    mimiAttackStacks: ball.mimiAttackStacks,
    isBleedingByMimi: ball.isBleedingByMimi,
    bleedTimer: ball.bleedTimer,
    isCharmedByMimi: ball.isCharmedByMimi,
    charmedByMimiTimer: ball.charmedByMimiTimer,
    jiandaoshouSnipAnimTimer: ball.jiandaoshouSnipAnimTimer,
    jiandaoshouCoreGlowTimer: ball.jiandaoshouCoreGlowTimer,
    jiandaoshouMistActive: ball.jiandaoshouMistActive,
    isSlowedByNeedle: ball.isSlowedByNeedle,
    slowedByNeedleTimer: ball.slowedByNeedleTimer,
    dinaHaloRotationAngle: ball.dinaHaloRotationAngle,
    dinaDarkLightState: ball.dinaDarkLightState,
    dinaPerfectAbsorb: ball.dinaPerfectAbsorb,
    dinaCorePowerActive: ball.dinaCorePowerActive,
    dinaWhiteEnergyCount: (ball.dinaWhiteEnergies || []).filter(e => e.state === 'AVAILABLE').length,
    jianxianOrbitSwordAngle: ball.jianxianOrbitSwordAngle,
    jianxianArrayActive: ball.jianxianArrayActive,
    jianxianArrayDuration: ball.jianxianArrayDuration,
    jianxianRetreatAnimTimer: ball.jianxianRetreatAnimTimer,
    isSlowedByJianxian: ball.isSlowedByJianxian,
    slowedByJianxianTimer: ball.slowedByJianxianTimer,
    longshenFormActive: ball.longshenFormActive,
    longshenFormDuration: ball.longshenFormDuration,
    longshenSwoopActive: ball.longshenSwoopActive,
    longshenStrikeAnimTimer: ball.longshenStrikeAnimTimer,
    longshenFlameActive: ball.longshenFlameActive,
    longshenFlameAngle: ball.longshenFlameAngle,
    longshenFormWingPhase: ball.longshenFormWingPhase,
    spiderVenomFangAnimTimer: ball.spiderVenomFangAnimTimer,
    spiderBurstAnimTimer: ball.spiderBurstAnimTimer,
    spiderPoisonMarkTimer: ball.spiderPoisonMarkTimer,
    isSlowedBySpiderWeb: ball.isSlowedBySpiderWeb,
    xinForm: ball.xinForm,
    xinLevel: ball.xinLevel,
    xinFormEnergy: ball.xinFormEnergy,
    xinShieldAmount: ball.xinShieldAmount,
    xinShadowDashing: ball.xinShadowDashing,
    xinShadowDashAnimTimer: ball.xinShadowDashAnimTimer,
    xinSkySlashChargeTimer: ball.xinSkySlashChargeTimer,
    xinShadowDashChargeTimer: ball.xinShadowDashChargeTimer,
    xinBasicSlashAnimTimer: ball.xinBasicSlashAnimTimer,
    xinLockAimAngle: ball.xinLockAimAngle,
    xinSwordOrbitAngle: ball.xinSwordOrbitAngle,
    xinExpAbsorbTimer: ball.xinExpAbsorbTimer,
    xinUpgradeAnimTimer: ball.xinUpgradeAnimTimer,
    xinSwordVibrate: ball.xinSwordVibrate,
    puppetResonance: ball.puppetResonance,
    puppetAegisTimer: ball.puppetAegisTimer,
    puppetSubstituteCooldown: ball.puppetSubstituteCooldown,
    puppetTetherAnimTimer: ball.puppetTetherAnimTimer,
    isTetheredByPuppeteer: ball.isTetheredByPuppeteer,
    puppetFinaleStandby: ball.puppetFinaleStandby,
    yinyongState: ball.yinyongState,
    yinyongChargeTimer: ball.yinyongChargeTimer,
    yinyongMaxCharge: ball.yinyongMaxCharge,
    yinyongDeclareTimer: ball.yinyongDeclareTimer,
    yinyongPunchAnimTimer: ball.yinyongPunchAnimTimer,
    yinyongMissAnimTimer: ball.yinyongMissAnimTimer,
    yinyongRageStacks: ball.yinyongRageStacks,
    yinyongBoundlessActive: ball.yinyongBoundlessActive,
    yinyongBoundlessDuration: ball.yinyongBoundlessDuration,
    yinyongImmortalAnimTimer: ball.yinyongImmortalAnimTimer,
    yinyongAfterimageTimer: ball.yinyongAfterimageTimer,
    yinyongFacingAngle: ball.yinyongFacingAngle,
    junkoMemoryFragments: otherBall?.characterId === 'manyaiya'
      ? (otherBall.junkoMemoryFragments?.[ball.id] ?? 0)
      : (ball.characterId === 'manyaiya'
          ? Math.max(0, ...Object.values(ball.junkoMemoryFragments ?? {}))
          : 0),
    junkoEyeAwakened: ball.junkoEyeAwakened,
    junkoEyeAwakenTimer: ball.junkoEyeAwakenTimer,
    junkoHolyKnightActive: ball.junkoHolyKnightActive,
    junkoHolyKnightDuration: ball.junkoHolyKnightDuration,
    junkoIsDashing: ball.junkoIsDashing,
    junkoDashesRemaining: ball.junkoDashesRemaining,
    junkoTetherPullTimer: ball.junkoTetherPullTimer,
    isBoundByJunko: ball.isBoundByJunko,
    isSnaredByJunko: ball.isSnaredByJunko,
    isSlowedByJunko: ball.isSlowedByJunko,
    junkoVulnerableStacks: ball.junkoVulnerableStacks,
    targetX: otherBall?.x,
    targetY: otherBall?.y,
    vx: ball.vx,
    vy: ball.vy,
    showDetails: true
  });

  // 3. Directional Visor / Velocity Needle
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > 10) {
    const angle = Math.atan2(ball.vy, ball.vx);
    const tipX = ball.x + Math.cos(angle) * (ball.radius * 0.7);
    const tipY = ball.y + Math.sin(angle) * (ball.radius * 0.7);

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3.5 Tactical Effects: Tactical Shield Aura & Dash Effect
  if ((ball.tacticalShieldTimer ?? 0) > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Rotating shield pulse ring
    const shieldAngle = (Date.now() * 0.005) % (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 10, shieldAngle, shieldAngle + Math.PI * 1.2);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  if ((ball.tacticalDashTimer ?? 0) > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  // 3.6 Overdrive Ready Golden Breathing Aura Ring (當能量達 100 滿值準備發動超載時的黃金色呼吸光環)
  const isOverdriveReady = (ball.isOverdrive || (ball.energy ?? 0) >= (ball.maxEnergy ?? 100)) && ball.hp > 0;
  if (isOverdriveReady) {
    ctx.save();
    const time = performance.now() * 0.001;
    // 柔和呼吸波動週期 (約 3.4 rad/s，優雅而充滿能量感)
    const breath = (Math.sin(time * 3.4) + 1) * 0.5; // 0 ~ 1
    const outerAuraR = ball.radius + 5.5 + breath * 3.5;
    const innerAuraR = ball.radius + 3.0 + breath * 1.5;

    // 1. 底層金光暈 (Subtle golden atmospheric halo)
    const haloGrad = ctx.createRadialGradient(ball.x, ball.y, ball.radius, ball.x, ball.y, outerAuraR + 5);
    haloGrad.addColorStop(0, 'rgba(250, 204, 21, 0.28)');
    haloGrad.addColorStop(0.65, `rgba(234, 179, 8, ${0.12 + breath * 0.12})`);
    haloGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, outerAuraR + 5, 0, Math.PI * 2);
    ctx.fillStyle = haloGrad;
    ctx.fill();

    // 2. 主呼吸金光環 (Main pulsating golden ring)
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, outerAuraR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(250, 204, 21, ${0.65 + breath * 0.35})`;
    ctx.lineWidth = 2.2 + breath * 0.8;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10 + breath * 8;
    ctx.stroke();

    // 3. 內層高亮精緻金芯環 (Inner radiant core ring)
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, innerAuraR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.75 + breath * 0.25})`;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 4;
    ctx.stroke();

    // 4. 三顆微型黃金流光星點 (Orbiting Golden Spark Nodes) 沿光環緩慢旋轉，展現蓄能飽滿
    const orbitAngle = time * 2.4;
    for (let i = 0; i < 3; i++) {
      const sparkAngle = orbitAngle + (i * Math.PI * 2) / 3;
      const sx = ball.x + Math.cos(sparkAngle) * outerAuraR;
      const sy = ball.y + Math.sin(sparkAngle) * outerAuraR;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.restore();
  }

  // 4. Mini Overhead HP & Energy Bar, Name, and Status Badges (Strict Stacking to Prevent Overlap)
  const isXin = ball.characterId === 'xin';
  const hpBarW = Math.max(46, ball.radius * 2.2);
  const hpBarH = 4.0;
  const energyBarH = 2.5;
  const xinExpBarH = 2.2;
  const hpBarX = ball.x - hpBarW / 2;

  // Stacking from bottom to top: Ball -> (Xin EXP Bar if Xin) -> Energy Bar -> HP Bar -> Player Name -> Status Badges
  const xinExpBarY = isXin ? ball.y - ball.radius - 8 : 0;
  const energyBarY = isXin ? xinExpBarY - energyBarH - 2.5 : ball.y - ball.radius - 8;
  const hpBarY = energyBarY - hpBarH - 2.5;
  const nameY = hpBarY - 6; // Name sits cleanly 6px above HP bar

  const hpPercent = Math.max(0, ball.hp / ball.maxHp);
  const energyPercent = Math.max(0, Math.min(1, (ball.energy ?? 100) / (ball.maxEnergy ?? 100)));

  ctx.save();
  // Xin Overhead Soul Crystal EXP Bar (僅辛可見，顯示 Lv.1~Lv.6 與 0~100 經驗及 6 等分刻線)
  if (isXin) {
    const level = ball.xinLevel || 1;
    const exp = Math.min(100, Math.max(0, ball.xinExp || 0));
    const isMax = level >= 6;
    const form = ball.xinForm || 'balance';
    const progress = isMax ? 1 : exp / 100;

    // 1. 底槽與微邊框
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(hpBarX - 1, xinExpBarY - 0.5, hpBarW + 2, xinExpBarH + 1);

    // 2. 形態配色漸層
    let colorStart = '#38bdf8';
    let colorEnd = '#818cf8';
    if (form === 'dark') {
      colorStart = '#9333ea';
      colorEnd = '#c084fc';
    } else if (form === 'light') {
      colorStart = '#f59e0b';
      colorEnd = '#fbbf24';
    }
    if (isMax) {
      colorStart = '#facc15';
      colorEnd = '#fef08a';
    }

    // 3. 經驗流光條填色
    const fillW = hpBarW * progress;
    if (fillW > 0) {
      const grad = ctx.createLinearGradient(hpBarX, xinExpBarY, hpBarX + fillW, xinExpBarY);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);
      ctx.fillStyle = grad;
      ctx.shadowColor = colorEnd;
      ctx.shadowBlur = 4;
      ctx.fillRect(hpBarX, xinExpBarY, fillW, xinExpBarH);
      ctx.shadowBlur = 0;
    }

    // 4. 六階晶鑽刻度細線 (5 條等分刻度線)
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.lineWidth = 0.8;
    for (let s = 1; s <= 5; s++) {
      const segX = hpBarX + (hpBarW / 6) * s;
      ctx.beginPath();
      ctx.moveTo(segX, xinExpBarY);
      ctx.lineTo(segX, xinExpBarY + xinExpBarH);
      ctx.stroke();
    }

    // 5. 左側微型等級標記
    ctx.font = "bold 7.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isMax ? '#fef08a' : colorEnd;
    ctx.fillText(isMax ? 'MAX' : `Lv.${level}`, hpBarX - 2.5, xinExpBarY + xinExpBarH / 2);
  }

  // Energy Bar Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(hpBarX - 1, energyBarY - 0.5, hpBarW + 2, energyBarH + 1);

  // Energy Bar Fill
  if (ball.isOverdrive) {
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 6;
  } else if (energyPercent >= 0.8) {
    ctx.fillStyle = '#38bdf8';
  } else if (energyPercent >= 0.3) {
    ctx.fillStyle = '#0284c7';
  } else {
    ctx.fillStyle = '#64748b';
  }
  ctx.fillRect(hpBarX, energyBarY, hpBarW * energyPercent, energyBarH);

  // HP Bar Background & Outer Frame
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(hpBarX - 1, hpBarY - 1, hpBarW + 2, hpBarH + 2);

  // HP Bar Fill
  ctx.fillStyle = hpPercent > 0.4 ? config.accentColor : '#ef4444';
  ctx.fillRect(hpBarX, hpBarY, hpBarW * hpPercent, hpBarH);

  // Player Name Label (Strictly positioned above HP bar with clean background and no overlap)
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  // Text dark outline for 100% legibility against any background
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.strokeText(ball.name, ball.x, nameY);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(ball.name, ball.x, nameY);

  // Overhead Status Badges (Custom Vector Art Pills - No Emojis, stacked cleanly above Name)
  interface StatusBadgeItem {
    type: 'overdrive' | 'shield' | 'dash' | 'paralyzed' | 'armor' | 'slow' | 'immune' | 'dragon_form' | 'longshen_awe' | 'longshen_burn';
    text: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
  const badges: StatusBadgeItem[] = [];

  // Special Charging / Rush Immunity Badges
  if (ball.characterId === 'mimi' && (ball.mimiClawAnimTimer ?? 0) > 0) {
    badges.push({
      type: 'immune',
      text: '貓爪免撞',
      color: '#f472b6',
      bgColor: 'rgba(50, 10, 30, 0.9)',
      borderColor: 'rgba(244, 114, 182, 0.8)'
    });
  }
  if (ball.characterId === 'xukongshou' && (ball.xukongshouHuntActive || ball.isPhantomDash)) {
    badges.push({
      type: 'immune',
      text: '虛空極速',
      color: '#c084fc',
      bgColor: 'rgba(40, 10, 60, 0.9)',
      borderColor: 'rgba(192, 132, 252, 0.8)'
    });
  }
  if (ball.characterId === 'fan' && ball.fanIsRolling) {
    badges.push({
      type: 'immune',
      text: '翻滾閃避',
      color: '#cbd5e1',
      bgColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: 'rgba(203, 213, 225, 0.8)'
    });
  }

  if (ball.isOverdrive) {
    badges.push({
      type: 'overdrive',
      text: '超載',
      color: '#facc15',
      bgColor: 'rgba(30, 27, 75, 0.85)',
      borderColor: 'rgba(250, 204, 21, 0.6)'
    });
  }
  if ((ball.tacticalShieldTimer ?? 0) > 0) {
    badges.push({
      type: 'shield',
      text: '護盾',
      color: '#fef08a',
      bgColor: 'rgba(20, 30, 45, 0.85)',
      borderColor: 'rgba(254, 240, 138, 0.6)'
    });
  }
  if ((ball.tacticalDashTimer ?? 0) > 0) {
    badges.push({
      type: 'dash',
      text: '瞬衝減傷',
      color: '#38bdf8',
      bgColor: 'rgba(8, 28, 48, 0.85)',
      borderColor: 'rgba(56, 189, 248, 0.6)'
    });
  }
  if (ball.isParalyzed) {
    badges.push({
      type: 'paralyzed',
      text: '麻痺',
      color: '#fbbf24',
      bgColor: 'rgba(40, 25, 10, 0.85)',
      borderColor: 'rgba(251, 191, 36, 0.6)'
    });
  }
  if ((ball.chanshiSuperArmorTimer && ball.chanshiSuperArmorTimer > 0) || (ball.characterId === 'longshen' && ball.longshenSwoopActive)) {
    badges.push({
      type: 'armor',
      text: '霸體',
      color: '#eab308',
      bgColor: 'rgba(40, 30, 5, 0.85)',
      borderColor: 'rgba(234, 179, 8, 0.6)'
    });
  }
  if (ball.characterId === 'longshen' && ball.longshenFormActive) {
    badges.push({
      type: 'dragon_form',
      text: '真龍真形',
      color: '#f59e0b',
      bgColor: 'rgba(45, 25, 5, 0.9)',
      borderColor: 'rgba(245, 158, 11, 0.7)'
    });
  }
  if (ball.longshenAweTimer && ball.longshenAweTimer > 0) {
    badges.push({
      type: 'longshen_awe',
      text: '龍威壓制+20%',
      color: '#fbbf24',
      bgColor: 'rgba(45, 20, 5, 0.85)',
      borderColor: 'rgba(251, 191, 36, 0.7)'
    });
  }
  if (ball.longshenBurnTimer && ball.longshenBurnTimer > 0) {
    badges.push({
      type: 'longshen_burn',
      text: '龍炎灼燒',
      color: '#f97316',
      bgColor: 'rgba(45, 15, 5, 0.85)',
      borderColor: 'rgba(249, 115, 22, 0.7)'
    });
  }
  if (ball.isSlowedByChanshi || ball.isSlowedByLanzuan || ball.isSlowedByNeedle || (ball.longshenSlowTimer && ball.longshenSlowTimer > 0)) {
    badges.push({
      type: 'slow',
      text: '減速',
      color: '#38bdf8',
      bgColor: 'rgba(15, 23, 42, 0.85)',
      borderColor: 'rgba(56, 189, 248, 0.6)'
    });
  }
  if (ball.characterId === 'jiandaoshou' && ball.jiandaoshouMistActive) {
    badges.push({
      type: 'immune',
      text: '聖霧防護',
      color: '#fef08a',
      bgColor: 'rgba(30, 41, 59, 0.85)',
      borderColor: 'rgba(254, 240, 138, 0.6)'
    });
  }

  if (badges.length > 0) {
    ctx.font = 'bold 9px ui-sans-serif, system-ui, -apple-system, sans-serif';
    // Start strictly above player name top edge (name baseline is nameY, text height ~11px)
    let badgeCenterY = nameY - 14;

    for (const badge of badges) {
      const textWidth = ctx.measureText(badge.text).width;
      const pillH = 13;
      const iconW = 10;
      const paddingX = 4;
      const pillW = textWidth + iconW + paddingX * 2;
      const pillX = ball.x - pillW / 2;
      const pillY = badgeCenterY - pillH / 2;

      // 膠囊底座
      ctx.fillStyle = badge.bgColor;
      ctx.strokeStyle = badge.borderColor;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      const br = 3;
      ctx.moveTo(pillX + br, pillY);
      ctx.lineTo(pillX + pillW - br, pillY);
      ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + br);
      ctx.lineTo(pillX + pillW, pillY + pillH - br);
      ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - br, pillY + pillH);
      ctx.lineTo(pillX + br, pillY + pillH);
      ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - br);
      ctx.lineTo(pillX, pillY + br);
      ctx.quadraticCurveTo(pillX, pillY, pillX + br, pillY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 繪製自定義微型向量圖示 (Custom Vector Art Icons)
      const iconCenterX = pillX + paddingX + 4;
      const iconCenterY = badgeCenterY;

      ctx.save();
      ctx.strokeStyle = badge.color;
      ctx.fillStyle = badge.color;
      ctx.lineWidth = 1.0;

      if (badge.type === 'overdrive' || badge.type === 'paralyzed') {
        // 閃電向量圖示
        ctx.beginPath();
        ctx.moveTo(iconCenterX + 1, iconCenterY - 4);
        ctx.lineTo(iconCenterX - 2.5, iconCenterY);
        ctx.lineTo(iconCenterX, iconCenterY);
        ctx.lineTo(iconCenterX - 1, iconCenterY + 4);
        ctx.lineTo(iconCenterX + 2.5, iconCenterY - 0.5);
        ctx.lineTo(iconCenterX, iconCenterY - 0.5);
        ctx.closePath();
        ctx.fill();
      } else if (badge.type === 'shield' || badge.type === 'immune') {
        // 護盾/免疫向量圖示
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY - 4);
        ctx.lineTo(iconCenterX + 3.2, iconCenterY - 2.5);
        ctx.lineTo(iconCenterX + 2.5, iconCenterY + 1.5);
        ctx.lineTo(iconCenterX, iconCenterY + 4);
        ctx.lineTo(iconCenterX - 2.5, iconCenterY + 1.5);
        ctx.lineTo(iconCenterX - 3.2, iconCenterY - 2.5);
        ctx.closePath();
        ctx.stroke();
      } else if (badge.type === 'dash') {
        // 雙重疾速衝刺箭頭 (Chevrons)
        ctx.beginPath();
        ctx.moveTo(iconCenterX - 3.5, iconCenterY - 3);
        ctx.lineTo(iconCenterX - 1, iconCenterY);
        ctx.lineTo(iconCenterX - 3.5, iconCenterY + 3);
        ctx.moveTo(iconCenterX, iconCenterY - 3);
        ctx.lineTo(iconCenterX + 2.5, iconCenterY);
        ctx.lineTo(iconCenterX, iconCenterY + 3);
        ctx.stroke();
      } else if (badge.type === 'armor') {
        // 霸體金剛六角形
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * 60 * Math.PI) / 180;
          const px = iconCenterX + Math.cos(a) * 3.5;
          const py = iconCenterY + Math.sin(a) * 3.5;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (badge.type === 'slow') {
        // 減速冰晶菱形十字
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY - 3.5);
        ctx.lineTo(iconCenterX, iconCenterY + 3.5);
        ctx.moveTo(iconCenterX - 3.5, iconCenterY);
        ctx.lineTo(iconCenterX + 3.5, iconCenterY);
        ctx.moveTo(iconCenterX - 2, iconCenterY - 2);
        ctx.lineTo(iconCenterX + 2, iconCenterY + 2);
        ctx.moveTo(iconCenterX - 2, iconCenterY + 2);
        ctx.lineTo(iconCenterX + 2, iconCenterY - 2);
        ctx.stroke();
      } else if (badge.type === 'dragon_form' || badge.type === 'longshen_burn' || badge.type === 'longshen_awe') {
        // 龍火/龍威微型烈焰向量符號
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY - 4);
        ctx.quadraticCurveTo(iconCenterX + 3.2, iconCenterY - 1, iconCenterX + 2, iconCenterY + 3.5);
        ctx.quadraticCurveTo(iconCenterX, iconCenterY + 2, iconCenterX - 2, iconCenterY + 3.5);
        ctx.quadraticCurveTo(iconCenterX - 3.2, iconCenterY - 1, iconCenterX, iconCenterY - 4);
        ctx.fill();
      }
      ctx.restore();

      // 文字標籤
      ctx.fillStyle = badge.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 2;
      ctx.fillText(badge.text, iconCenterX + 5.5, badgeCenterY);

      // Clean vertical offset without overlapping
      badgeCenterY -= 15;
    }
  }

  ctx.restore();
}

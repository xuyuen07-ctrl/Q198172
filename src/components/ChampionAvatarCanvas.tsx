import React, { useEffect, useRef } from 'react';
import { CharacterConfig, CharacterId } from '../types/game';
import { drawChampionSphere } from '../utils/renderer';

interface ChampionAvatarCanvasProps {
  characterId?: CharacterId;
  character?: CharacterConfig;
  size?: number;
  className?: string;
  isAnimated?: boolean;
  hasChargedBounce?: boolean;
  hasExplosiveBounce?: boolean;
  isHotBody?: boolean;
  consecutiveHits?: number;
  growthStacks?: number;
  fanOverclockActive?: boolean;
}

export const ChampionAvatarCanvas: React.FC<ChampionAvatarCanvasProps> = ({
  characterId,
  character,
  size = 120,
  className = '',
  isAnimated = true,
  hasChargedBounce = false,
  hasExplosiveBounce = false,
  isHotBody = false,
  consecutiveHits = 0,
  growthStacks,
  fanOverclockActive = false
}) => {
  const targetCharId: CharacterId = characterId || character?.id || 'oba';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      
      const time = isAnimated ? performance.now() * 0.001 : 0;
      const radius = size * 0.38;
      const centerX = size / 2;
      const centerY = size / 2;

      drawChampionSphere(ctx, centerX, centerY, radius, targetCharId, {
        time,
        hasChargedBounce,
        hasExplosiveBounce,
        isHotBody,
        consecutiveHits,
        growthStacks: targetCharId === 'tunshimozu' ? (growthStacks ?? 20) : 0,
        fanOverclockActive,
        showDetails: true
      });

      if (isAnimated) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetCharId, size, isAnimated, hasChargedBounce, hasExplosiveBounce, isHotBody, consecutiveHits, growthStacks, fanOverclockActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`select-none pointer-events-none ${className}`}
    />
  );
};

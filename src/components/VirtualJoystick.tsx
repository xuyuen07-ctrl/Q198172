import React, { useRef, useState } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number } | null) => void;
  label?: string;
  color?: string;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  label = '操縱搖桿',
  color = '#3b82f6'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const radius = 45; // Max radius

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsActive(true);
    updatePosition(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isActive) return;
    updatePosition(e);
  };

  const handlePointerUp = () => {
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(null);
  };

  const updatePosition = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      setKnobPos({ x: 0, y: 0 });
      onMove(null);
      return;
    }

    const clampedDist = Math.min(dist, radius);
    const nx = dx / dist;
    const ny = dy / dist;

    setKnobPos({ x: nx * clampedDist, y: ny * clampedDist });
    onMove({ x: nx, y: ny });
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={containerRef}
        className="w-24 h-24 rounded-full bg-slate-900/90 border-2 border-slate-700 relative flex items-center justify-center touch-none select-none shadow-inner"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Center indicator */}
        <div className="w-2 h-2 rounded-full bg-slate-600 pointer-events-none" />

        {/* Knob */}
        <div
          className="w-10 h-10 rounded-full shadow-lg pointer-events-none absolute transition-transform"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            backgroundColor: color,
            border: '2px solid rgba(255, 255, 255, 0.6)'
          }}
        />
      </div>
      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
    </div>
  );
};

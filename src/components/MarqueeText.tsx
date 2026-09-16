import React, { useRef, useState, useEffect } from 'react';

interface MarqueeTextProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: number; // pixels per second
  forceMarquee?: boolean;
}

/**
 * MarqueeText: Automatically detects if text overflows its container.
 * When overflowing, it activates a smooth ping-pong ticker so incomplete
 * or cut-off text is fully readable on mobile screens without breaking layouts.
 */
export const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  className = '',
  containerClassName = '',
  speed = 22,
  forceMarquee = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [overflowPx, setOverflowPx] = useState<number>(0);

  useEffect(() => {
    const updateOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const diff = contentWidth - containerWidth;

      if (diff > 2 || forceMarquee) {
        setOverflowPx(Math.max(diff > 0 ? diff : 20, 0));
      } else {
        setOverflowPx(0);
      }
    };

    updateOverflow();

    // Use ResizeObserver for instant responsive re-measurements
    let ro: ResizeObserver | null = null;
    let rafId: number | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = window.requestAnimationFrame(updateOverflow);
      });
      ro.observe(containerRef.current);
      if (contentRef.current) {
        ro.observe(contentRef.current);
      }
    }

    window.addEventListener('resize', updateOverflow);
    return () => {
      window.removeEventListener('resize', updateOverflow);
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
    };
  }, [children, forceMarquee]);

  const isOverflowing = overflowPx > 0;
  // Dynamic duration: minimum 4s, scales with distance
  const durationSec = Math.max(4.2, 3 + overflowPx / speed);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden min-w-0 max-w-full inline-flex items-center ${containerClassName}`}
      style={{
        maskImage: isOverflowing
          ? 'linear-gradient(to right, black 93%, transparent 100%)'
          : 'none',
        WebkitMaskImage: isOverflowing
          ? 'linear-gradient(to right, black 93%, transparent 100%)'
          : 'none'
      }}
    >
      <span
        ref={contentRef}
        className={`inline-block whitespace-nowrap ${isOverflowing ? 'animate-marquee-pingpong' : ''} ${className}`}
        style={
          isOverflowing
            ? ({
                '--marquee-overflow': `${overflowPx}px`,
                '--marquee-duration': `${durationSec.toFixed(1)}s`
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </span>
    </div>
  );
};

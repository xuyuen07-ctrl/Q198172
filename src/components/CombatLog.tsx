import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { CombatEvent } from '../types/game';
import { ScrollText, Flame, Shield, Sparkles } from 'lucide-react';
import { stripEmojis } from '../utils/damageRenderer';

interface CombatLogProps {
  events: CombatEvent[];
  onClear?: () => void;
}

export const CombatLog: React.FC<CombatLogProps> = ({ events, onClear }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-slate-900/85 border border-slate-800/90 rounded-2xl p-3 flex flex-col h-48 backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Subtle Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />

      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wider">
            戰鬥即時紀錄 (Combat Feed)
          </span>
          <span className="text-[10px] bg-slate-800 text-sky-400 border border-slate-700 px-2 py-0.2 rounded-full font-mono font-bold">
            {events.length}
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            清空
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        id="combat-log-stream"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y space-y-1.5 pr-1 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-700"
      >
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
            等待兩球相遇碰撞激發被動技能...
          </div>
        ) : (
          events.map((evt) => {
            const isPassive = evt.type === 'passive_trigger';
            const isP1Attacker = evt.attackerId === 'p1';

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -14, y: 2 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] }}
                className={`p-1.5 rounded-lg text-xs flex items-center justify-between gap-2 border transition-colors ${
                  isPassive
                    ? 'bg-amber-950/35 border-amber-500/40 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.12)]'
                    : isP1Attacker
                    ? 'bg-blue-950/25 border-blue-900/50 text-blue-100'
                    : 'bg-red-950/25 border-red-900/50 text-red-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    [{evt.timestamp.toFixed(1)}s]
                  </span>
                  {isPassive ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                  ) : isP1Attacker ? (
                    <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : (
                    <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  )}
                  <span className="truncate">{stripEmojis(evt.text)}</span>
                </div>

                {evt.badge && (
                  <span className="px-1.5 py-0.2 bg-amber-400/20 border border-amber-400/40 rounded text-[10px] font-mono font-bold text-amber-300 shrink-0">
                    {stripEmojis(evt.badge)}
                  </span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

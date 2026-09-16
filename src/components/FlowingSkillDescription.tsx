import React, { useMemo } from 'react';

interface FlowingSkillDescriptionProps {
  text: string;
  accentColor?: string;
  className?: string;
  isShimmering?: boolean;
  waveIndex?: number;
}

/**
 * Parses skill description string into chunks with highlighted numbers, percentages,
 * conditions, and combat status effects, with smooth cyber flow highlights!
 */
export const FlowingSkillDescription: React.FC<FlowingSkillDescriptionProps> = ({
  text,
  accentColor = '#38bdf8',
  className = '',
  isShimmering = false,
  waveIndex = 0
}) => {
  // Defensive guard against empty/undefined text
  const safeText = text || '';

  // Regex to detect values, percentages, cooldowns, and keywords
  const formattedSegments = useMemo(() => {
    if (!safeText) return null;

    const regex = /(\d+(?:\.\d+)?%?|\d+(?:\.\d+)?(?:秒|HP|px|XP|能|傷)|\d+~\d+點?|【[^】]+】|「[^」]+」|霸體|反彈|反傷|禁錮|免傷|減傷|穿透|死光|克隆|鏡面|鏡像|光環|蓄力|分身|無敵|神盾|麻痺|定身|法陣|飛彈|光圈|泡泡尖刺|金身|金鐘罩|龍威壓制|龍威|龍神|真龍|雙重裂爪|真龍焚滅領域|蛛毒印記|蛛毒|毒牙|蛛網|小蜘蛛|毒液風暴|雙相|魔劍|裂空劍痕|逐影破陣|神聖護盾|光之統御|暗之狂暴|魅惑|流血|撕咬|潛行|真實傷害|縫合線|聖霧|白光|暗光|三相融合|極光共鳴|仙劍|百萬劍陣|萬劍歸宗|折射隱光|過載|電弧|破甲|暴擊|瞬移|衝刺|斬殺|吸血)/g;
    const parts = safeText.split(regex).filter(Boolean);

    return parts.map((part, i) => {
      const segKey = `seg-${i}-${part.slice(0, 5)}`;
      const isBracketed = part.startsWith('【') && part.endsWith('】');
      const isQuoted = part.startsWith('「') && part.endsWith('」');
      const isValue = /^\d+(?:\.\d+)?%?$/.test(part) || /^\d+(?:\.\d+)?(?:秒|HP|px|XP|能|傷)$/.test(part) || /^\d+~\d+點?$/.test(part);

      if (isBracketed) {
        return (
          <span
            key={segKey}
            className="inline-block align-baseline px-1.5 py-0.5 mx-0.5 my-0.5 rounded font-mono font-bold text-[10px] tracking-wide border shadow-xs"
            style={{
              backgroundColor: `${accentColor}1c`,
              borderColor: `${accentColor}50`,
              color: accentColor,
              boxShadow: `0 0 6px ${accentColor}20`
            }}
          >
            {part}
          </span>
        );
      }

      if (isQuoted) {
        return (
          <span
            key={segKey}
            className="inline-block align-baseline px-1 py-0.5 mx-0.5 my-0.5 rounded font-bold text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 shadow-xs"
          >
            {part}
          </span>
        );
      }

      if (isValue) {
        return (
          <span
            key={segKey}
            className="font-mono font-black text-amber-300 px-0.5 tracking-tight drop-shadow-[0_0_4px_rgba(251,191,36,0.35)]"
          >
            {part}
          </span>
        );
      }

      // Check if it's one of the combat keywords
      const isKeyword = /(霸體|反彈|反傷|禁錮|免傷|減傷|穿透|死光|克隆|鏡面|鏡像|光環|蓄力|分身|無敵|神盾|麻痺|定身|法陣|飛彈|光圈|泡泡尖刺|金身|金鐘罩|龍威壓制|龍威|龍神|真龍|雙重裂爪|真龍焚滅領域|蛛毒印記|蛛毒|毒牙|蛛網|小蜘蛛|毒液風暴|雙相|魔劍|裂空劍痕|逐影破陣|神聖護盾|光之統御|暗之狂暴|魅惑|流血|撕咬|潛行|真實傷害|縫合線|聖霧|白光|暗光|三相融合|極光共鳴|仙劍|百萬劍陣|萬劍歸宗|折射隱光|過載|電弧|破甲|暴擊|瞬移|衝刺|斬殺|吸血)/.test(part);
      if (isKeyword) {
        return (
          <span
            key={segKey}
            className="font-bold text-sky-300 px-0.5 underline decoration-sky-400/50 decoration-dotted underline-offset-2"
          >
            {part}
          </span>
        );
      }

      return <span key={segKey} className="text-slate-200">{part}</span>;
    });
  }, [safeText, accentColor]);

  const waveClass =
    waveIndex === 0
      ? 'wave-flow-in-1'
      : waveIndex === 1
      ? 'wave-flow-in-2'
      : waveIndex === 2
      ? 'wave-flow-in-3'
      : '';

  return (
    <div
      className={`relative text-[11.5px] sm:text-xs leading-[1.65] transition-all duration-200 ${waveClass} ${className}`}
    >
      <div className={`relative z-10 break-words ${isShimmering ? 'text-flow-shimmer' : ''}`}>
        {formattedSegments}
      </div>
    </div>
  );
};

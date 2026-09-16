import React, { useState } from 'react';
import { CURRENT_BALANCE_PATCH, BalanceChangeItem } from '../data/balancePatch';
import { CHARACTERS } from '../data/characters';
import { CharacterId } from '../types/game';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import {
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Shield,
  Swords,
  Crosshair,
  Clock,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface BalancePatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (charId: CharacterId) => void;
}

export const BalancePatchModal: React.FC<BalancePatchModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'buff' | 'nerf' | 'adjust'>('all');

  if (!isOpen) return null;

  const patch = CURRENT_BALANCE_PATCH;

  const filteredChanges = patch.changes.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.type === selectedCategory;
  });

  const buffCount = patch.changes.filter(c => c.type === 'buff').length;
  const nerfCount = patch.changes.filter(c => c.type === 'nerf').length;
  const adjustCount = patch.changes.filter(c => c.type === 'adjust').length;

  return (
    <div
      id="balance-patch-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4 bg-black/85 backdrop-blur-md flex items-center justify-center min-h-full animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="balance-patch-modal-content"
        className="relative w-full max-w-5xl h-[94vh] sm:h-auto sm:max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-sky-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold shrink-0">
                  {patch.version}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 font-mono truncate">
                  <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                  {patch.date}
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-100 mt-0.5 truncate">
                {patch.title}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-balance-modal"
            onClick={onClose}
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="關閉公告"
            aria-label="關閉平衡公告"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Overview Banner & Key Highlights */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-slate-950/60 border-b border-slate-800 space-y-2 sm:space-y-3 shrink-0">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {patch.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-28 sm:max-h-none overflow-y-auto overscroll-contain">
            {patch.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar - Horizontally scrollable on mobile */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-0.5 hidden xs:block" />
            <button
              id="filter-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              全部 ({patch.changes.length})
            </button>
            <button
              id="filter-adjust"
              onClick={() => setSelectedCategory('adjust')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                selectedCategory === 'adjust'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-400/80 hover:text-sky-300 hover:bg-sky-950/40'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>機制調整 ({adjustCount})</span>
            </button>
            <button
              id="filter-buff"
              onClick={() => setSelectedCategory('buff')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                selectedCategory === 'buff'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>加強 ({buffCount})</span>
            </button>
            <button
              id="filter-nerf"
              onClick={() => setSelectedCategory('nerf')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap ${
                selectedCategory === 'nerf'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              <span>削弱 ({nerfCount})</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden md:inline shrink-0">
            點擊「在場中測試」可直接套用該英雄出戰
          </span>
        </div>

        {/* Main List of Character Changes - Mobile Smooth Scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3 sm:space-y-4">
          {filteredChanges.map(item => {
            const char = CHARACTERS[item.characterId];
            const isBuff = item.type === 'buff';
            const isNerf = item.type === 'nerf';

            return (
              <div
                key={item.id}
                id={`patch-card-${item.characterId}`}
                className={`rounded-xl border p-3 sm:p-4 transition-all duration-200 ${
                  isBuff
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70'
                    : isNerf
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/40 hover:border-rose-500/70'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/20 border-sky-500/40 hover:border-sky-500/70'
                }`}
              >
                {/* Character Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {char && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 shadow">
                        <ChampionAvatarCanvas character={char} size={36} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-100">
                          {item.characterName}
                        </h3>
                        <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                          {item.characterTitle}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                            isBuff
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isNerf
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}
                        >
                          {isBuff && <TrendingUp className="w-2.5 h-2.5" />}
                          {isNerf && <TrendingDown className="w-2.5 h-2.5" />}
                          {!isBuff && !isNerf && <RefreshCw className="w-2.5 h-2.5" />}
                          {isBuff ? '增強' : isNerf ? '削弱' : '平衡調校'}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-amber-300/90 font-medium mt-0.5 leading-snug">
                        {item.headline}
                      </p>
                    </div>
                  </div>

                  {onSelectCharacter && char && (
                    <button
                      id={`btn-select-${item.characterId}`}
                      onClick={() => {
                        onSelectCharacter(item.characterId);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white active:bg-sky-700 border border-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-sm min-h-[36px] flex items-center justify-center"
                    >
                      在場中測試出戰
                    </button>
                  )}
                </div>

                {/* Change Details Grid */}
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.changes.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2 sm:p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 text-[11px] sm:text-xs">
                          {c.target}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                        <div className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 line-through text-[10px] sm:text-[11px] border border-slate-800">
                          {c.before}
                        </div>
                        <span className="text-slate-500 font-sans text-xs">➔</span>
                        <div
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] sm:text-[11px] border ${
                            isBuff
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              : isNerf
                              ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                              : 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                          }`}
                        >
                          {c.after}
                        </div>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug">
                        {c.reason}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Designer Notes Summary */}
                <div className="mt-2.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-[10px] sm:text-[11px] text-slate-400 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold text-slate-300 mr-1">設計師觀點：</span>
                    {item.summary}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <span className="text-[11px] text-center sm:text-left text-slate-400">
            全角色數值、彈道手感與技能冷卻均已即時套用生效
          </span>
          <button
            id="btn-confirm-balance-modal"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold transition-all cursor-pointer shadow min-h-[40px] flex items-center justify-center"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

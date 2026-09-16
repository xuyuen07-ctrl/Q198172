import React, { useState, useMemo } from 'react';
import { TournamentBeltState, ChampionBeltRecord, BeltHistoryEntry } from '../types/tournament';
import { CHARACTERS } from '../data/characters';
import { ChampionBeltBadge } from './ChampionBeltBadge';
import { ChampionAvatarCanvas } from './ChampionAvatarCanvas';
import { CharacterId } from '../types/game';
import { getChampionRecentRivals, getChampionRecentRivalries } from '../utils/beltManager';
import {
  Trophy,
  Crown,
  Shield,
  Sparkles,
  Award,
  History,
  Clock,
  X,
  Download,
  CheckCircle,
  Swords,
  Calendar,
  Zap,
  Flame,
  AlertCircle
} from 'lucide-react';

interface ChampionBeltModalProps {
  isOpen?: boolean;
  beltState: TournamentBeltState;
  onClose: () => void;
  onSelectChampionAsPlayer?: (id: CharacterId) => void;
}

export const ChampionBeltModal: React.FC<ChampionBeltModalProps> = ({
  isOpen = true,
  beltState,
  onClose,
  onSelectChampionAsPlayer
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'history'>('overview');
  const [leaderboardView, setLeaderboardView] = useState<'hall_of_fame' | 'all_contenders'>('hall_of_fame');

  // Expanded hero ID for viewing individual defense logs
  const [selectedHeroId, setSelectedHeroId] = useState<CharacterId | null>(() => {
    return beltState.currentHolderId || null;
  });

  const currentHolder = beltState.currentHolderId ? CHARACTERS[beltState.currentHolderId] : null;

  // Sort champion records by reignDays descending
  const sortedRecords = useMemo(() => {
    return Object.values(beltState.records)
      .filter(r => (r.totalChampionships || 0) > 0 || (r.reignDays || 0) > 0 || (r.totalDefenses || 0) > 0)
      .sort((a, b) => {
        // Sort by reignDays desc, then totalDefenses desc
        if (b.reignDays !== a.reignDays) return b.reignDays - a.reignDays;
        return (b.totalDefenses || 0) - (a.totalDefenses || 0);
      });
  }, [beltState.records]);

  // Sort all contenders by win rate, championships, then total wins
  const sortedAllContenders = useMemo(() => {
    return Object.values(beltState.records).sort((a, b) => {
      // current holder always at top
      if (a.characterId === beltState.currentHolderId) return -1;
      if (b.characterId === beltState.currentHolderId) return 1;
      // then by championships
      if ((b.totalChampionships || 0) !== (a.totalChampionships || 0)) {
        return (b.totalChampionships || 0) - (a.totalChampionships || 0);
      }
      // then by win rate
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      // then by wins
      return (b.wins || 0) - (a.wins || 0);
    });
  }, [beltState.records, beltState.currentHolderId]);

  // Determine which hero record to inspect for detailed defense history
  const activeRecord: ChampionBeltRecord | null = useMemo(() => {
    if (selectedHeroId && beltState.records[selectedHeroId]) {
      return beltState.records[selectedHeroId];
    }
    if (sortedRecords.length > 0) {
      return sortedRecords[0];
    }
    return null;
  }, [selectedHeroId, beltState.records, sortedRecords]);

  // Format date and time
  const formatDateTime = (timestamp: number) => {
    const d = new Date(timestamp);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  };

  // Screenshot export action
  const handleDownloadScreenshot = () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 920;
        canvas.height = 620;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Gradient background
          const grad = ctx.createLinearGradient(0, 0, 920, 620);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#090d16');
          grad.addColorStop(1, '#020617');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 920, 620);

          // Golden border
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 4;
          ctx.strokeRect(16, 16, 888, 588);

          // Title
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('WWE 世界重量級金腰帶名人堂與衛冕戰史', 40, 65);

          // Subtitle
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px sans-serif';
          ctx.fillText('WWE Official Championship Lineage & Defenses Record', 40, 95);

          // Current Champion box
          if (currentHolder) {
            const currentRec = beltState.records[currentHolder.id];
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(40, 120, 840, 180);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2;
            ctx.strokeRect(40, 120, 840, 180);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('【現任世界冠軍王者 (Current Champion)】', 60, 155);

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText(`${currentHolder.name} (${currentHolder.title})`, 60, 200);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 20px sans-serif';
            const reignInfo = `統治天數: ${beltState.currentReignDays} 天 | 本屆連續衛冕: ${currentRec?.currentReignDefenses || 0} 次 | 累計奪冠: ${currentRec?.totalChampionships || 1} 度王者`;
            ctx.fillText(reignInfo, 60, 240);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '15px sans-serif';
            ctx.fillText(`生涯戰績: ${currentRec?.wins || 0}勝 ${currentRec?.losses || 0}敗 (勝率 ${currentRec?.winRate || 0}%) | 生涯累計衛冕: ${currentRec?.totalDefenses || 0} 次`, 60, 275);
          }

          // Footer
          ctx.fillStyle = '#64748b';
          ctx.font = '12px sans-serif';
          ctx.fillText(`戰史紀錄時間: ${new Date().toLocaleString()} · 零鏡頭震動 2D 競技場純物理即時模擬`, 40, 580);

          // Download as PNG
          const link = document.createElement('a');
          link.download = `wwe-championship-belt-${activeRecord?.characterId || 'record'}-${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      } catch (err) {
        console.warn('Screenshot generation error:', err);
      } finally {
        setDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md flex items-center justify-center min-h-full animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl max-h-[94vh] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-amber-500/50 p-3.5 sm:p-6 shadow-2xl shadow-amber-500/20 text-slate-100 flex flex-col overflow-hidden my-auto">
        {/* Background ambient lighting */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-100 flex items-center gap-1.5 sm:gap-2">
                <span>WWE 世界重量級金腰帶名人堂</span>
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                WWE 摔角頭銜賽制：壓上金腰帶方為衛冕戰 · 唯有防衛成功累計衛冕次數
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Download Screenshot Action Button */}
            <button
              id="btn-belt-download-screenshot"
              onClick={handleDownloadScreenshot}
              disabled={downloading}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                downloadSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border-amber-500/50 text-amber-300 hover:text-amber-200'
              }`}
              title="下載世界金腰帶戰史回顧截圖 (PNG)"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xs:inline">已下載</span>
                </>
              ) : (
                <>
                  <Download className={`w-3.5 h-3.5 text-amber-400 ${downloading ? 'animate-bounce' : ''}`} />
                  <span className="hidden xs:inline">{downloading ? '生成中...' : '下載戰史圖'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-2.5 pb-1 border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>冠軍霸主與榜單</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>頭銜防衛戰史時間軸</span>
            {activeRecord && activeRecord.history.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-400 text-[10px] font-mono">
                {activeRecord.history.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>WWE 摔角冠軍規則</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mobile-scroll-y space-y-4 py-3 sm:py-4 pr-1 relative z-10">
          {activeTab === 'overview' && (
            <>
              {/* Current Belt Holder Showcase Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-amber-950/20 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-[11px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    現任 WWE 世界重量級冠軍 (Current Champion)
                  </span>

                  {currentHolder && (
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                      王朝進行中 (Active Reign)
                    </span>
                  )}
                </div>

                {currentHolder ? (
                  <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/30 bg-slate-950 shrink-0 relative">
                          <ChampionAvatarCanvas characterId={currentHolder.id} size={80} />
                          <div className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/90 border border-amber-400 shadow">
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </div>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="text-xs text-amber-400 font-serif italic">{currentHolder.title}</div>
                          <h4 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2 flex-wrap">
                            <span>{currentHolder.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                              {beltState.records[currentHolder.id]?.totalChampionships || 1}度世界王者
                            </span>
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <span>生涯戰績：</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {beltState.records[currentHolder.id]?.wins || 0}勝
                            </span>
                            <span className="font-mono text-rose-400 font-bold">
                              {beltState.records[currentHolder.id]?.losses || 0}敗
                            </span>
                            <span className="text-slate-500 font-mono">
                              (勝率 {beltState.records[currentHolder.id]?.winRate || 0}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* WWE Defenses & Reign Stats Badge */}
                      <div className="flex flex-col items-center sm:items-end gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 w-full sm:w-auto">
                        <ChampionBeltBadge
                          size="lg"
                          reignDays={beltState.currentReignDays}
                          currentReignDefenses={beltState.currentReignDefenses}
                          championshipCount={beltState.records[currentHolder.id]?.totalChampionships}
                          showDays={false}
                          animate={true}
                        />
                        <div className="text-center sm:text-right w-full">
                          <div className="text-[11px] font-bold text-slate-400">當前金腰帶統治天數</div>
                          <div className="text-2xl font-mono font-black text-amber-400 flex items-baseline justify-center sm:justify-end gap-1">
                            <span>{beltState.currentReignDays}</span>
                            <span className="text-xs font-serif text-slate-300">天</span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-end gap-3 text-xs text-slate-300 mt-1">
                            <span className="bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300 font-bold">
                              本屆連續衛冕: <span className="font-mono">{beltState.currentReignDefenses || 0}</span> 次
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              生涯累計衛冕: {beltState.records[currentHolder.id]?.totalDefenses || 0} 次
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Champion Recent Rivalries Indicator (Last 3 Opponents Faced) */}
                    {(() => {
                      const currentRec = beltState.records[currentHolder.id];
                      const recentRivals = getChampionRecentRivals(currentRec);
                      const recentRivalries = getChampionRecentRivalries(currentRec);
                      const slots = [0, 1, 2];

                      return (
                        <div className="mt-3.5 pt-3 border-t border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              <Swords className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                <span>近期宿敵交鋒 (Recent Rivalries)</span>
                                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                                  最近 3 場對手
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                王者歷經的近 3 位擂台挑戰者與衛冕防衛對手紀錄
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {slots.map(slotIdx => {
                              const entry = recentRivalries[slotIdx];
                              const rivalId = entry?.opponentId || recentRivals[slotIdx];
                              if (rivalId) {
                                const rivalChar = CHARACTERS[rivalId];
                                const isWin = entry ? entry.result === 'win' : true;
                                return (
                                  <div
                                    key={`rival-slot-${slotIdx}-${rivalId}`}
                                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 transition-colors shadow-sm"
                                    title={`${rivalChar?.name || rivalId}: ${entry?.note || (isWin ? '衛冕戰勝出' : '遭其擊敗')}`}
                                  >
                                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                                      <ChampionAvatarCanvas characterId={rivalId} size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-200 leading-tight">
                                        {rivalChar?.name || rivalId}
                                      </span>
                                      <span className="text-[9px] text-slate-400 leading-tight">
                                        {slotIdx === 0 ? '最新交手' : slotIdx === 1 ? '上上一戰' : '第三戰'}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                        isWin
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      }`}
                                    >
                                      {isWin ? '勝' : '敗'}
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={`rival-empty-${slotIdx}`}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-700/70 bg-slate-950/40 text-slate-500 text-[11px]"
                                >
                                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                                  <span>待定挑戰者 #{slotIdx + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <div className="flex justify-center">
                      <ChampionBeltBadge size="lg" showDays={false} />
                    </div>
                    <h4 className="text-base font-bold text-slate-300">WWE 世界金腰帶目前處於空缺王座</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      開啟 1v1 單挑或啟動錦標淘汰賽！獲勝登頂的英雄將獲頒加冕為新任世界重量級冠軍，並開啟首次衛冕防衛戰征程！
                    </p>
                  </div>
                )}
              </div>

              {/* Champion Leaderboard Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                    <button
                      onClick={() => setLeaderboardView('hall_of_fame')}
                      className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                        leaderboardView === 'hall_of_fame'
                          ? 'bg-amber-500 text-slate-950 shadow font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                      <span>金腰帶名人堂 ({sortedRecords.length})</span>
                    </button>
                    <button
                      onClick={() => setLeaderboardView('all_contenders')}
                      className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                        leaderboardView === 'all_contenders'
                          ? 'bg-indigo-600 text-white shadow font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Swords className="w-3 h-3" />
                      <span>挑戰者全聯盟天梯 ({sortedAllContenders.length})</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {leaderboardView === 'hall_of_fame' ? '按統治天數與衛冕次數排行' : '含非冠軍選手獨立生涯統計'}
                  </span>
                </div>

                {leaderboardView === 'hall_of_fame' ? (
                  sortedRecords.length > 0 ? (
                  <div className="space-y-1.5">
                    {sortedRecords.map((rec, idx) => {
                      const hero = CHARACTERS[rec.characterId];
                      const isCurrentHolder = beltState.currentHolderId === rec.characterId;
                      const isSelected = activeRecord?.characterId === rec.characterId;

                      return (
                        <div
                          key={rec.characterId}
                          onClick={() => {
                            setSelectedHeroId(rec.characterId);
                            setActiveTab('history');
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                              : isCurrentHolder
                              ? 'bg-amber-950/20 border-amber-500/40'
                              : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-5 text-center font-mono font-black text-xs shrink-0 ${
                              idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                            }`}>
                              #{idx + 1}
                            </span>

                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                              <ChampionAvatarCanvas characterId={rec.characterId} size={40} />
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-black text-slate-200 flex items-center gap-1.5 flex-wrap">
                                <span>{hero?.name || rec.characterId}</span>
                                {isCurrentHolder && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                                    現任冠軍
                                  </span>
                                )}
                                <span className="text-[10px] text-amber-400 font-mono">
                                  {rec.totalChampionships || 1}度王者
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>本屆連續衛冕: <strong className="text-amber-300 font-mono">{rec.currentReignDefenses || 0}</strong> 次</span>
                                <span>•</span>
                                <span>生涯總衛冕: <strong className="text-sky-300 font-mono">{rec.totalDefenses || 0}</strong> 次</span>
                              </div>
                              {/* Mini Rivalry Stack Indicator */}
                              {(() => {
                                const rowRivals = getChampionRecentRivals(rec);
                                if (rowRivals.length === 0) return null;
                                return (
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[9px] text-slate-400 flex items-center gap-0.5 font-medium">
                                      <Swords className="w-2.5 h-2.5 text-amber-400" />
                                      近期宿敵:
                                    </span>
                                    <div className="flex items-center -space-x-1.5">
                                      {rowRivals.slice(0, 3).map((rId, i) => {
                                        const rChar = CHARACTERS[rId];
                                        return (
                                          <div
                                            key={`${rec.characterId}-rival-${rId}-${i}`}
                                            className="w-4 h-4 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shadow-sm"
                                            title={`近期宿敵 #${i + 1}: ${rChar?.name || rId}`}
                                          >
                                            <ChampionAvatarCanvas characterId={rId} size={16} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <span className="text-[9px] text-amber-400/80 font-mono">
                                      ({rowRivals.length}/3)
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-xs font-mono font-black text-amber-400">
                                {rec.reignDays} <span className="text-[10px] font-serif text-slate-400">天</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                統治天數
                              </div>
                            </div>

                            {onSelectChampionAsPlayer && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectChampionAsPlayer(rec.characterId);
                                  onClose();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-sky-300 border border-slate-700 transition-colors cursor-pointer shrink-0"
                                title="指派為代表角色"
                              >
                                代表出戰
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                    尚未有英雄登頂王座！趕緊參與比賽贏得第一條 WWE 世界金腰帶吧。
                  </div>
                )
              ) : (
                /* All Contenders View (Including non-champions) */
                <div className="space-y-1.5">
                  {sortedAllContenders.map((rec, idx) => {
                    const hero = CHARACTERS[rec.characterId];
                    const isCurrentHolder = beltState.currentHolderId === rec.characterId;
                    const hasWonTitle = (rec.totalChampionships || 0) > 0;

                    return (
                      <div
                        key={`contender-${rec.characterId}`}
                        onClick={() => {
                          setSelectedHeroId(rec.characterId);
                          setActiveTab('history');
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isCurrentHolder
                            ? 'bg-amber-950/30 border-amber-500/50 shadow-sm'
                            : hasWonTitle
                            ? 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-5 text-center font-mono font-black text-xs shrink-0 ${
                            idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            #{idx + 1}
                          </span>

                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shadow">
                              <ChampionAvatarCanvas characterId={rec.characterId} size={40} />
                            </div>
                            {isCurrentHolder && (
                              <div className="absolute -top-1 -right-1">
                                <ChampionBeltBadge size="sm" showDays={false} animate={true} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-sm text-slate-100 truncate">
                                {hero?.name || rec.characterId}
                              </span>
                              {isCurrentHolder ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[9px] flex items-center gap-0.5 shrink-0">
                                  <Crown className="w-2.5 h-2.5 fill-slate-950" />
                                  現任王者
                                </span>
                              ) : hasWonTitle ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[9px] font-bold shrink-0">
                                  前任 {rec.totalChampionships} 度王者
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono text-[9px] font-semibold shrink-0">
                                  一級挑戰者
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                              <span>勝率: <strong className={`font-mono ${rec.winRate >= 50 ? 'text-emerald-400' : 'text-slate-300'}`}>{rec.winRate.toFixed(1)}%</strong></span>
                              <span>•</span>
                              <span>戰績: <strong className="text-slate-200 font-mono">{rec.wins}勝 {rec.losses}敗</strong></span>
                              <span>•</span>
                              <span>連勝: <strong className="text-sky-300 font-mono">{rec.currentWinStreak}</strong> (最佳 {rec.maxWinStreak})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono font-bold text-slate-300">
                              {rec.totalMatches || (rec.wins + rec.losses)} 場
                            </div>
                            <div className="text-[10px] text-slate-500">
                              總出賽
                            </div>
                          </div>

                          {onSelectChampionAsPlayer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectChampionAsPlayer(rec.characterId);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-sky-300 border border-slate-700 transition-colors cursor-pointer shrink-0"
                              title="指派為代表角色"
                            >
                              出戰
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    WWE 頭銜防衛戰史時間軸
                  </span>
                  {activeRecord && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {CHARACTERS[activeRecord.characterId]?.name || activeRecord.characterId}
                    </span>
                  )}
                </div>

                {sortedRecords.length > 1 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400">切換檢視英雄：</span>
                    <select
                      value={activeRecord?.characterId || ''}
                      onChange={e => setSelectedHeroId(e.target.value as CharacterId)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {sortedRecords.map(r => (
                        <option key={r.characterId} value={r.characterId}>
                          {CHARACTERS[r.characterId]?.name || r.characterId} (統治 {r.reignDays}天 · 衛冕 {r.currentReignDefenses || 0}次)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Active Hero Recent 3 Rivals Highlight Bar */}
              {activeRecord && (() => {
                const activeRivalries = getChampionRecentRivalries(activeRecord);
                const activeRivals = getChampionRecentRivals(activeRecord);
                if (activeRivals.length === 0) return null;

                return (
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span>{CHARACTERS[activeRecord.characterId]?.name || activeRecord.characterId} 最近 3 位宿敵交鋒：</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeRivals.slice(0, 3).map((rId, i) => {
                        const rChar = CHARACTERS[rId];
                        const rEntry = activeRivalries[i];
                        const isWin = rEntry ? rEntry.result === 'win' : true;
                        return (
                          <div
                            key={`hist-rival-${rId}-${i}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                          >
                            <div className="w-4 h-4 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
                              <ChampionAvatarCanvas characterId={rId} size={16} />
                            </div>
                            <span className="font-bold text-slate-200">{rChar?.name || rId}</span>
                            <span className={`text-[10px] font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({isWin ? '勝' : '敗'})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* List of Defense and Coronation events */}
              {activeRecord && activeRecord.history && activeRecord.history.length > 0 ? (
                <div className="space-y-2">
                  {activeRecord.history.map((item, idx) => {
                    const opponentHero = item.opponentId ? CHARACTERS[item.opponentId] : null;
                    const isDefenseWin = item.resultType === 'defense_success' || item.isDefense;
                    const isTitleWon = item.resultType === 'title_won';
                    const isTitleLost = item.resultType === 'title_lost';

                    return (
                      <div
                        key={`${item.date}-${idx}`}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isDefenseWin
                            ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-500/70'
                            : isTitleWon
                            ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-500/70'
                            : 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                        }`}
                      >
                        {/* Left: Event type & Timestamp */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div className={`p-2 rounded-xl shrink-0 border ${
                            isDefenseWin
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : isTitleWon
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          }`}>
                            {isDefenseWin ? (
                              <Shield className="w-4 h-4" />
                            ) : isTitleWon ? (
                              <Crown className="w-4 h-4" />
                            ) : (
                              <Flame className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-black ${
                                isDefenseWin ? 'text-amber-300' : isTitleWon ? 'text-emerald-300' : 'text-rose-300'
                              }`}>
                                {isDefenseWin
                                  ? `AND STILL! 第 ${item.defenseNumber || 1} 次衛冕成功`
                                  : isTitleWon
                                  ? `AND NEW! 加冕第 ${item.championshipNumber || 1} 度世界冠軍`
                                  : '丟失金腰帶 (Dethroned)'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                #{activeRecord.history.length - idx} 場次
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>時間：{formatDateTime(item.date)}</span>
                            </div>
                            {item.note && (
                              <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Center: Defeated Opponent Identification */}
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 shrink-0">
                          <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="text-xs text-slate-400">
                            {isTitleLost ? '遭挑戰者擊破：' : '對戰對手：'}
                          </span>
                          {item.opponentId ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                                <ChampionAvatarCanvas characterId={item.opponentId} size={20} />
                              </div>
                              <span className="text-xs font-bold text-slate-200">
                                {opponentHero?.name || item.opponentId}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">無對手紀錄</span>
                          )}
                        </div>

                        {/* Right: Days Earned Badge */}
                        <div className="text-right shrink-0">
                          <div className={`text-xs font-mono font-black ${item.daysEarned > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                            {item.daysEarned > 0 ? `+${item.daysEarned} 天` : '0 天'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {isDefenseWin ? '衛冕統治天數' : isTitleWon ? '新王加冕起算' : '統治終止'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
                  目前尚無 WWE 頭銜防衛戰戰史。參與 1v1 單挑或淘汰賽決賽即可生成詳細戰史！
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900/80 border border-amber-500/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm border-b border-slate-800 pb-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>WWE 職業摔角冠軍頭銜衛冕規則 (WWE Championship Defense Rules)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>1. 什麼是「冠軍衛冕賽 (Title Defense)」？</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      當賽事中包含現任金腰帶持有者時，該場對決為壓上頭銜的「頭銜防衛戰 (Title on the Line)」。若現任冠軍獲勝，即宣佈 <strong className="text-amber-300">「AND STILL CHAMPION!」</strong>，該次防衛才計為一次正式的成功衛冕！
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-emerald-400" />
                      <span>2. 奪冠非衛冕：幾度世界冠軍 vs 衛冕次數</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      挑戰者擊敗冠軍或贏得空缺王座時，屬於「新王加冕 (Title Won)」，奪冠次數加 1 (如 1度王者、2度王者)。在新王加冕當下，其本屆衛冕次數起算為 <strong className="text-sky-300">0 次</strong>（因為尚未進行防衛戰），直到首次防衛成功才算第 1 次衛冕！
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span>3. 冠軍易主 (AND NEW CHAMPION)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      若現任冠軍在頭銜賽事中落敗，金腰帶將立即移交給挑戰者！前任冠軍的連續統治紀錄立即中斷並定格歷史，新冠軍將戴上金腰帶開啟全新的防衛征程。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>4. 統治天數 (Reign Days) 的計算</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      在 WWE 中，統治天數是衡量偉大王朝的關鍵指標（如 Roman Reigns 破千天統治）。每次成功衛冕或新王加冕均會依據戰事規模與連勝給予 <strong className="text-amber-300">18 ~ 80 天</strong> 的虛擬統治天數加成！
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-indigo-400" />
                      <span>5. 不是冠軍的選手如何運作？（一級挑戰者體系）</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      所有尚未奪得腰帶的選手均歸為「一級挑戰者 (Top Contender)」，享有完全獨立的生涯戰績庫（勝率、勝負、總傷輸出、連勝）。在非頭銜對決中進行「挑戰權資格戰」，向全聯盟證明實力以獲得向現任霸主叫陣的資格！曾奪冠的選手則名列「傳奇前任王者」，其歷史衛冕天數將永久記錄。
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>6. 現任冠軍參加錦標賽時的完整判定？</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      現任冠軍自動享有賽會「第一種子 (Seed #1)」席位！冠軍出賽的<strong>每一輪次均為壓上金腰帶的法定頭銜防衛戰</strong>。若冠軍一路獲勝奪得錦標賽冠軍，每一輪均計為一次成功衛冕（衛冕次數連續 +1、統治天數大幅累加）！若中途任何一輪爆冷落敗，金腰帶當場易主給擊敗冠軍的黑馬，新王接過腰帶並帶著金腰帶在後續賽程中繼續接受挑戰！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 sm:pt-4 border-t border-slate-800 flex items-center justify-between relative z-10 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>WWE 官方摔角金腰帶頭銜規則・實時物理同步記錄</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

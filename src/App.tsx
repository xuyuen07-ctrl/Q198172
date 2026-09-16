import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BallState, CharacterId, CombatEvent, FloatingText, GameSettings, GameStatus, Particle, Projectile } from './types/game';
import { TournamentMatch, TournamentSize, TournamentState, TournamentBeltState, AutoNextMatchConfig } from './types/tournament';
import { CHARACTERS } from './data/characters';
import { createInitialBall, updatePhysics, executeTacticalDash, executeTacticalShield } from './utils/physics';
import { soundEngine } from './utils/audio';
import { pushFloatingTextWithAntiClump, updateAndDecayFloatingTexts } from './utils/damageRenderer';
import { createTournament, simulateMatch, applyMatchResult, fastForwardAllReadyAiMatches, fastForwardAllReadyAiMatchesWithHistory } from './utils/tournamentManager';
import { loadBeltState, awardChampionshipBelt, recordMatchOutcome, batchRecordMatchOutcomes, resetAllBeltRecords, isTitleDefenseMatch, resolveTitleMatchOutcome, processTournamentMatch, batchProcessTournamentMatches } from './utils/beltManager';
import { ArenaCanvas } from './components/ArenaCanvas';
import { BattleHUD } from './components/BattleHUD';
import { PassiveSkillCard } from './components/PassiveSkillCard';
import { CombatLog } from './components/CombatLog';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { GameOverModal } from './components/GameOverModal';
import { VirtualJoystick } from './components/VirtualJoystick';
import { RoleClassificationModal } from './components/RoleClassificationModal';
import { TournamentBracketView } from './components/TournamentBracketView';
import { TournamentChampionModal } from './components/TournamentChampionModal';
import { ChampionBeltModal } from './components/ChampionBeltModal';
import { BalancePatchModal } from './components/BalancePatchModal';
import { MainMenu } from './components/MainMenu';
import { BattleRecordsPage } from './components/BattleRecordsPage';
import { WrestlingIntroModal } from './components/WrestlingIntroModal';
import {
  Info,
  Play,
  RefreshCw,
  Zap,
  Shield,
  Flame,
  Swords,
  Sparkles,
  Wind,
  BookOpen,
  Trophy,
  Award,
  RotateCcw,
  Sliders,
  Home,
  ChevronLeft,
  X,
  Activity
} from 'lucide-react';

export default function App() {
  // Mode: 'duel' (1v1 Classic) vs 'tournament' (Knockout Bracket)
  const [gameMode, setGameMode] = useState<'duel' | 'tournament'>('duel');

  // Duel Settings
  const [settings, setSettings] = useState<GameSettings>({
    p1Char: 'oba',
    p2Char: 'huotong',
    p1Control: 'auto',
    p2Control: 'auto',
    gameSpeed: 1,
    soundEnabled: true,
    isTitleMatchEnabled: false,
    isTournamentTitleMatchEnabled: false
  });

  // Tournament State
  const [tournament, setTournament] = useState<TournamentState>(() => {
    const loadedBelt = loadBeltState();
    return createTournament(8, 'oba', 'auto', undefined, loadedBelt.currentHolderId);
  });
  const [activeTournamentMatchId, setActiveTournamentMatchId] = useState<string | null>(null);

  // Champion Belt State (Persistent across tournaments with fake defense days)
  const [beltState, setBeltState] = useState<TournamentBeltState>(() => loadBeltState());
  const [showBeltModal, setShowBeltModal] = useState<boolean>(false);

  // Game state - initial state is ready until player locks in
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [matchTime, setMatchTime] = useState<number>(0);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);

  // Entities
  const [p1State, setP1State] = useState<BallState>(() =>
    createInitialBall('p1', CHARACTERS[settings.p1Char], settings.p1Control === 'auto')
  );
  const [p2State, setP2State] = useState<BallState>(() =>
    createInitialBall('p2', CHARACTERS[settings.p2Char], settings.p2Control === 'auto')
  );

  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [combatEvents, setCombatEvents] = useState<CombatEvent[]>([]);

  // Navigation Screen Hierarchy: 'menu' (Home Lobby) -> 'arena' (Active Match) | 'tournament_bracket' | 'records'
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'arena' | 'tournament_bracket' | 'records'>('menu');

  // Modals
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [selectModalInitialSide, setSelectModalInitialSide] = useState<'p1' | 'p2'>('p1');
  const [showHandbookModal, setShowHandbookModal] = useState<boolean>(false);
  const [handbookModalMode, setHandbookModalMode] = useState<'rules' | 'roles' | 'mechanics' | 'patch'>('rules');
  const [showBalancePatchModal, setShowBalancePatchModal] = useState<boolean>(false);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(false);
  // Mobile battle view tab: 'passives' (被動監控), 'log' (即時日誌), 'help' (戰鬥機制)
  const [mobileArenaTab, setMobileArenaTab] = useState<'passives' | 'log' | 'help'>('passives');

  // Unified Handbook & Combat Rules Opener
  const handleOpenGuide = useCallback((mode: 'rules' | 'roles' | 'mechanics' | 'patch' = 'rules') => {
    setHandbookModalMode(mode);
    setShowHandbookModal(true);
  }, []);

  // Tournament Auto-Next Match Configuration (10～3秒 自動開賽系統)
  const [autoNextConfig, setAutoNextConfig] = useState<AutoNextMatchConfig>(() => {
    try {
      const saved = localStorage.getItem('tournament_auto_next_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          enabled: Boolean(parsed.enabled),
          seconds: Math.max(3, Math.min(10, Number(parsed.seconds) || 5)),
          action: parsed.action === 'enter' ? 'enter' : 'simulate'
        };
      }
    } catch {
      // ignore
    }
    return {
      enabled: false,
      seconds: 5,
      action: 'simulate'
    };
  });

  const handleUpdateAutoNextConfig: React.Dispatch<React.SetStateAction<AutoNextMatchConfig>> = useCallback((action) => {
    setAutoNextConfig(prev => {
      const updated = typeof action === 'function' ? action(prev) : { ...prev, ...action };
      try {
        localStorage.setItem('tournament_auto_next_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // User input vectors (ref based for instant response in requestAnimationFrame)
  const p1InputRef = useRef<{ x: number; y: number } | null>(null);
  const p2InputRef = useRef<{ x: number; y: number } | null>(null);
  const keysDownRef = useRef<Record<string, boolean>>({});

  // Refs for animation loop
  const p1Ref = useRef<BallState>(p1State);
  const p2Ref = useRef<BallState>(p2State);
  const projectilesRef = useRef<Projectile[]>(projectiles);
  const particlesRef = useRef<Particle[]>(particles);
  const floatingTextsRef = useRef<FloatingText[]>(floatingTexts);
  const combatEventsRef = useRef<CombatEvent[]>(combatEvents);
  const matchTimeRef = useRef<number>(matchTime);
  const gameStatusRef = useRef<GameStatus>(gameStatus);
  const settingsRef = useRef<GameSettings>(settings);
  const gameModeRef = useRef<'duel' | 'tournament'>(gameMode);
  const matchOutcomeRecordedRef = useRef<boolean>(false);
  const activeTournamentMatchIdRef = useRef<string | null>(activeTournamentMatchId);
  activeTournamentMatchIdRef.current = activeTournamentMatchId;
  const tournamentRef = useRef<TournamentState>(tournament);
  tournamentRef.current = tournament;
  const lastRecordedMatchSummaryRef = useRef<string | null>(null);

  // Battle arena DOM ref and one-time auto-scroll flag for battle entry
  const battleArenaRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollToArenaRef = useRef<boolean>(false);

  // Smoothly scroll and position so that the entire Battle Arena (HUD + Arena Canvas) is in view
  const scrollToBattleArena = useCallback((force: boolean = false) => {
    if (!force && !shouldAutoScrollToArenaRef.current) return;
    shouldAutoScrollToArenaRef.current = false;

    const performScroll = () => {
      // Prioritize the top of the active battle area (HUD or arena screen)
      const battleHud = document.getElementById('battle-hud');
      const arenaScreen = document.getElementById('arena-main-screen');
      const arenaEl = document.getElementById('battle-arena') || battleArenaRef.current || document.getElementById('arena-container');
      
      const targetEl = battleHud || arenaScreen || arenaEl;
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Position battle HUD / arena gracefully near the top with 4px margin
        const targetY = Math.max(0, rect.top + scrollTop - 4);
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    };

    // Run across animation frames and after DOM repaints (especially when modals unmount)
    requestAnimationFrame(performScroll);
    setTimeout(performScroll, 50);
    setTimeout(performScroll, 180);
    setTimeout(performScroll, 350);
  }, []);

  // Sync refs
  useEffect(() => {
    p1Ref.current = p1State;
    p2Ref.current = p2State;
    projectilesRef.current = projectiles;
    particlesRef.current = particles;
    floatingTextsRef.current = floatingTexts;
    combatEventsRef.current = combatEvents;
    matchTimeRef.current = matchTime;
    gameStatusRef.current = gameStatus;
    settingsRef.current = settings;
    gameModeRef.current = gameMode;
  });

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    setSettings(prev => {
      const next = !prev.soundEnabled;
      soundEngine.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  // Speed toggle (1x -> 1.5x -> 2x -> 1x)
  const handleToggleSpeed = useCallback(() => {
    setSettings(prev => {
      const speeds = [1, 1.5, 2];
      const nextIdx = (speeds.indexOf(prev.gameSpeed) + 1) % speeds.length;
      return { ...prev, gameSpeed: speeds[nextIdx] };
    });
  }, []);

  // Initialize or Restart Match
  const resetMatch = useCallback((customSettings?: GameSettings) => {
    const current = customSettings || settingsRef.current;
    const initialP1 = createInitialBall('p1', CHARACTERS[current.p1Char], current.p1Control === 'auto');
    const initialP2 = createInitialBall('p2', CHARACTERS[current.p2Char], current.p2Control === 'auto');

    setP1State(initialP1);
    setP2State(initialP2);
    p1Ref.current = initialP1;
    p2Ref.current = initialP2;

    setProjectiles([]);
    projectilesRef.current = [];

    setParticles([]);
    particlesRef.current = [];

    setFloatingTexts([]);
    floatingTextsRef.current = [];

    setCombatEvents([]);
    combatEventsRef.current = [];

    setMatchTime(0);
    matchTimeRef.current = 0;

    setWinner(null);
    setGameStatus('playing');
    gameStatusRef.current = 'playing';
    matchOutcomeRecordedRef.current = false;
    lastRecordedMatchSummaryRef.current = null;

    p1InputRef.current = null;
    p2InputRef.current = null;
  }, []);

  // Pause / Resume
  const handleTogglePlay = useCallback(() => {
    setGameStatus(prev => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused' || prev === 'ready') return 'playing';
      return prev;
    });
  }, []);

  // Tactical combat triggers (P1)
  const handleTriggerP1Dash = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    executeTacticalDash(
      p1Ref.current,
      p2Ref.current,
      matchTimeRef.current,
      floatingTextsRef.current,
      combatEventsRef.current,
      particlesRef.current
    );
  }, []);

  const handleTriggerP1Shield = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    executeTacticalShield(
      p1Ref.current,
      matchTimeRef.current,
      floatingTextsRef.current,
      combatEventsRef.current,
      particlesRef.current
    );
  }, []);

  // Keyboard controls listener (WASD for P1, Arrows for P2, J/K for tactical skills)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      keysDownRef.current[e.key.toLowerCase()] = true;
      keysDownRef.current[e.code] = true;

      // Quick hotkeys
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key.toLowerCase() === 'r') {
        shouldAutoScrollToArenaRef.current = true;
        resetMatch();
        scrollToBattleArena();
      } else if (e.key.toLowerCase() === 'j') {
        if (settingsRef.current.p1Control === 'manual') {
          handleTriggerP1Dash();
        }
      } else if (e.key.toLowerCase() === 'k') {
        if (settingsRef.current.p1Control === 'manual') {
          handleTriggerP1Shield();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key.toLowerCase()] = false;
      keysDownRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTogglePlay, resetMatch, handleTriggerP1Dash, handleTriggerP1Shield]);

  // Main Game Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const rawDt = Math.min((time - lastTime) / 1000, 0.05); // clamp max dt
      lastTime = time;

      if (gameStatusRef.current === 'playing') {
        const effectiveDt = rawDt * settingsRef.current.gameSpeed;
        matchTimeRef.current += effectiveDt;
        setMatchTime(matchTimeRef.current);

        // Calculate Keyboard vector inputs
        if (settingsRef.current.p1Control === 'manual') {
          let x = 0;
          let y = 0;
          const k = keysDownRef.current;
          if (k['w'] || k['KeyW']) y -= 1;
          if (k['s'] || k['KeyS']) y += 1;
          if (k['a'] || k['KeyA']) x -= 1;
          if (k['d'] || k['KeyD']) x += 1;

          if (x !== 0 || y !== 0) {
            p1InputRef.current = { x, y };
          }
        }

        if (settingsRef.current.p2Control === 'manual') {
          let x = 0;
          let y = 0;
          const k = keysDownRef.current;
          if (k['arrowup']) y -= 1;
          if (k['arrowdown']) y += 1;
          if (k['arrowleft']) x -= 1;
          if (k['arrowright']) x += 1;

          if (x !== 0 || y !== 0) {
            p2InputRef.current = { x, y };
          }
        }

        // Run Physics Step
        const stepResult = updatePhysics(
          p1Ref.current,
          p2Ref.current,
          projectilesRef.current,
          effectiveDt,
          p1InputRef.current,
          p2InputRef.current,
          matchTimeRef.current
        );

        p1Ref.current = stepResult.p1;
        p2Ref.current = stepResult.p2;
        projectilesRef.current = stepResult.projectiles;
        setP1State(stepResult.p1);
        setP2State(stepResult.p2);
        setProjectiles(stepResult.projectiles);

        // Update & decay particles
        const currentParticles = [...particlesRef.current, ...stepResult.particles];
        const updatedParticles: Particle[] = [];
        for (const p of currentParticles) {
          p.life -= effectiveDt;
          p.x += p.vx * effectiveDt;
          p.y += p.vy * effectiveDt;
          p.alpha = Math.max(0, p.life / p.maxLife);
          if (p.life > 0) {
            updatedParticles.push(p);
          }
        }
        if (updatedParticles.length > 120) {
          updatedParticles.splice(0, updatedParticles.length - 120);
        }
        particlesRef.current = updatedParticles;
        setParticles(updatedParticles);

        // Update & decay floating texts with anti-clump
        const decayedFCT = updateAndDecayFloatingTexts(floatingTextsRef.current, effectiveDt);
        const mergedFCT = stepResult.floatingTexts.length > 0
          ? pushFloatingTextWithAntiClump(decayedFCT, stepResult.floatingTexts)
          : decayedFCT;

        floatingTextsRef.current = mergedFCT;
        setFloatingTexts(mergedFCT);

        // Append combat events
        if (stepResult.combatEvents.length > 0) {
          const newEvents = [...combatEventsRef.current, ...stepResult.combatEvents].slice(-60);
          combatEventsRef.current = newEvents;
          setCombatEvents(newEvents);
        }

        // Check Victory
        if (stepResult.winner) {
          setWinner(stepResult.winner);
          setGameStatus('gameover');
          gameStatusRef.current = 'gameover';

          // Record match outcome once into career records
          if (!matchOutcomeRecordedRef.current) {
            matchOutcomeRecordedRef.current = true;
            const wCharId = stepResult.winner === 'p1' ? p1Ref.current.characterId : p2Ref.current.characterId;
            const lCharId = stepResult.winner === 'p1' ? p2Ref.current.characterId : p1Ref.current.characterId;
            const duration = Math.max(3, Math.round(matchTimeRef.current * 10) / 10);
            const wDamage = stepResult.winner === 'p1' ? p1Ref.current.damageDealt : p2Ref.current.damageDealt;
            const lDamage = stepResult.winner === 'p1' ? p2Ref.current.damageDealt : p1Ref.current.damageDealt;

            if (gameModeRef.current === 'duel') {
              const isTitleEnabled = settingsRef.current.isTitleMatchEnabled !== false;
              setBeltState(prev => {
                let next = recordMatchOutcome(prev, wCharId, lCharId, duration, {
                  winnerDamage: wDamage,
                  loserDamage: lDamage,
                  matchType: 'duel',
                  isTitleMatch: isTitleEnabled
                });
                // Check if this 1v1 match is an official WWE Title Defense / Coronation match
                const titleCheck = isTitleDefenseMatch(prev, wCharId, lCharId, false, false, isTitleEnabled);
                if (titleCheck.isTitleMatch) {
                  const matchTitleName = titleCheck.isCoronationMatch
                    ? 'WWE 世界重量級金腰帶・1v1 新王加冕賽'
                    : 'WWE 世界重量級金腰帶・1v1 單挑頭銜防衛賽';
                  const titleRes = resolveTitleMatchOutcome(
                    next,
                    wCharId,
                    lCharId,
                    'duel',
                    matchTitleName
                  );
                  next = titleRes.nextState;
                }
                return next;
              });
            } else if (gameModeRef.current === 'tournament' && activeTournamentMatchIdRef.current) {
              const currentTourMatch = tournamentRef.current.matches.find(m => m.id === activeTournamentMatchIdRef.current);
              if (currentTourMatch) {
                const isTourTitleEnabled = (settingsRef.current.isTournamentTitleMatchEnabled ?? settingsRef.current.isTitleMatchEnabled) !== false;
                setBeltState(prev => {
                  const processRes = processTournamentMatch(
                    prev,
                    currentTourMatch,
                    wCharId,
                    lCharId,
                    duration,
                    tournamentRef.current.title,
                    tournamentRef.current.size,
                    isTourTitleEnabled
                  );
                  lastRecordedMatchSummaryRef.current = processRes.summary;
                  return processRes.nextState;
                });
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // === Tournament Action Handlers ===

  // Launch a specific match from the tournament bracket into the arena
  const handleEnterTournamentMatch = useCallback((matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId);
    if (!match || !match.p1CharId || !match.p2CharId) return;

    const isP1Player = !!tournament.playerCharId && match.p1CharId === tournament.playerCharId;
    const isP2Player = !!tournament.playerCharId && match.p2CharId === tournament.playerCharId;

    const newSettings: GameSettings = {
      p1Char: match.p1CharId,
      p2Char: match.p2CharId,
      p1Control: isP1Player ? tournament.playerControl : 'auto',
      p2Control: isP2Player ? tournament.playerControl : 'auto',
      gameSpeed: settings.gameSpeed,
      soundEnabled: settings.soundEnabled
    };

    setSettings(newSettings);
    settingsRef.current = newSettings;
    setActiveTournamentMatchId(matchId);
    setTournament(prev => ({
      ...prev,
      currentMatchId: matchId,
      stage: 'fighting'
    }));

    shouldAutoScrollToArenaRef.current = true;
    resetMatch(newSettings);
    setCurrentScreen('arena');
    setGameStatus('paused');
    gameStatusRef.current = 'paused';
    setShowIntroModal(true);
  }, [tournament, settings.gameSpeed, settings.soundEnabled, resetMatch]);

  // Fast simulate an individual tournament match
  const handleSimulateTournamentMatch = useCallback((matchId: string) => {
    const match = tournament.matches.find(m => m.id === matchId);
    if (!match || !match.p1CharId || !match.p2CharId) return;

    const sim = simulateMatch(match.p1CharId, match.p2CharId);
    let matchSummary = sim.summary;

    setBeltState(prev => {
      const res = processTournamentMatch(
        prev,
        match,
        sim.winnerId,
        sim.loserId,
        sim.matchTime,
        tournament.title,
        tournament.size
      );
      matchSummary = res.summary;
      return res.nextState;
    });

    const updatedTour = applyMatchResult(
      tournament,
      matchId,
      sim.winnerId,
      sim.loserId,
      sim.matchTime,
      sim.p1Damage,
      sim.p2Damage,
      matchSummary
    );

    setTournament(updatedTour);
  }, [tournament]);

  // Fast forward all AI vs AI ready matches
  const handleFastForwardAi = useCallback(() => {
    let currentTour = { ...tournament };
    let simulatedCount = 0;
    const completedMatches: {
      match: TournamentMatch;
      winnerId: CharacterId;
      loserId: CharacterId;
      matchDurationSeconds: number;
    }[] = [];

    while (true) {
      const targetMatch = currentTour.matches.find(
        m => m.status === 'ready' && m.p1CharId && m.p2CharId && !m.isPlayerMatch
      );

      if (!targetMatch || !targetMatch.p1CharId || !targetMatch.p2CharId) {
        break;
      }

      const sim = simulateMatch(targetMatch.p1CharId, targetMatch.p2CharId);
      completedMatches.push({
        match: targetMatch,
        winnerId: sim.winnerId,
        loserId: sim.loserId,
        matchDurationSeconds: sim.matchTime
      });

      currentTour = applyMatchResult(
        currentTour,
        targetMatch.id,
        sim.winnerId,
        sim.loserId,
        sim.matchTime,
        sim.p1Damage,
        sim.p2Damage,
        sim.summary
      );

      simulatedCount++;
      if (simulatedCount > 30) break;
    }

    if (completedMatches.length > 0) {
      setBeltState(prev => {
        const { nextState, summaries } = batchProcessTournamentMatches(
          prev,
          completedMatches,
          currentTour.title,
          currentTour.size
        );
        currentTour = {
          ...currentTour,
          matches: currentTour.matches.map(m => summaries[m.id] ? { ...m, summary: summaries[m.id] } : m)
        };
        return nextState;
      });
    }

    setTournament(currentTour);
  }, [tournament]);

  // Create a brand new tournament
  const handleNewTournament = useCallback((size: TournamentSize = 8) => {
    const newTour = createTournament(size, settings.p1Char, tournament.playerControl, undefined, beltState.currentHolderId);
    setTournament(newTour);
    setActiveTournamentMatchId(null);
    setWinner(null);
    setGameStatus('ready');
  }, [settings.p1Char, tournament.playerControl, beltState.currentHolderId]);

  // Toggle player control inside tournament (manual vs auto)
  const handleToggleTournamentPlayerControl = useCallback(() => {
    setTournament(prev => {
      const nextControl = prev.playerControl === 'manual' ? 'auto' : 'manual';
      return { ...prev, playerControl: nextControl };
    });
  }, []);

  // Post-match continue in tournament mode (advances winner and returns to bracket)
  const handleContinueAfterTournamentMatch = useCallback(() => {
    if (!activeTournamentMatchId || !winner) {
      setTournament(prev => ({ ...prev, stage: 'bracket' }));
      setCurrentScreen('tournament_bracket');
      return;
    }

    const winnerCharId = winner === 'p1' ? p1State.characterId : p2State.characterId;
    const loserCharId = winner === 'p1' ? p2State.characterId : p1State.characterId;
    const duration = Math.max(3, Math.round(matchTime * 10) / 10);
    const summary = lastRecordedMatchSummaryRef.current || `${CHARACTERS[winnerCharId]?.name || winnerCharId} 戰勝 ${CHARACTERS[loserCharId]?.name || loserCharId}！`;

    const updatedTour = applyMatchResult(
      tournament,
      activeTournamentMatchId,
      winnerCharId,
      loserCharId,
      duration,
      p1State.damageDealt,
      p2State.damageDealt,
      summary
    );

    setTournament(updatedTour);
    setActiveTournamentMatchId(null);
    setWinner(null);
    setGameStatus('ready');
    gameStatusRef.current = 'ready';
    setCurrentScreen('tournament_bracket');
  }, [activeTournamentMatchId, winner, p1State, p2State, tournament, matchTime]);

  // Select champion from Hall of Fame / Legend Tab as tournament representative
  const handleSelectChampionAsPlayer = useCallback((charId: CharacterId) => {
    setSettings(prev => ({ ...prev, p1Char: charId }));
    setTournament(prev => ({ ...prev, playerCharId: charId }));
  }, []);

  // Reset career stats back to initial baseline
  const handleResetBeltRecords = useCallback(() => {
    const fresh = resetAllBeltRecords();
    setBeltState(fresh);
  }, []);

  // === Sequential Screen Navigation Handlers ===

  // Auto-scroll when entering the arena screen and BattleArena is mounted
  useEffect(() => {
    if (currentScreen === 'arena' && shouldAutoScrollToArenaRef.current) {
      scrollToBattleArena();
    }
  }, [currentScreen, scrollToBattleArena]);

  // Start 1v1 Classic Duel from Main Menu
  const handleStartDuel = useCallback(() => {
    shouldAutoScrollToArenaRef.current = true;
    resetMatch(settings);
    setGameMode('duel');
    setCurrentScreen('arena');
    setGameStatus('paused');
    gameStatusRef.current = 'paused';
    setShowIntroModal(true);
  }, [resetMatch, settings]);

  // Enter Tournament Bracket View from Main Menu
  const handleEnterTournament = useCallback(() => {
    setGameMode('tournament');
    setTournament(prev => ({ ...prev, stage: 'bracket' }));
    setCurrentScreen('tournament_bracket');
  }, []);

  // Return to Main Menu from Arena or Bracket
  const handleReturnToMenu = useCallback(() => {
    // 每場比賽的冠軍賽狀態獨立判定，返回主選單重設為一般比賽
    setSettings(prev => ({ ...prev, isTitleMatchEnabled: false, isTournamentTitleMatchEnabled: false }));
    settingsRef.current = { ...settingsRef.current, isTitleMatchEnabled: false, isTournamentTitleMatchEnabled: false };
    setGameStatus('ready');
    gameStatusRef.current = 'ready';
    setCurrentScreen('menu');
    setShowSelectModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Return to Tournament Bracket from Arena
  const handleReturnToBracket = useCallback(() => {
    setGameStatus('ready');
    gameStatusRef.current = 'ready';
    setTournament(prev => ({ ...prev, stage: 'bracket' }));
    setActiveTournamentMatchId(null);
    setCurrentScreen('tournament_bracket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Open Character Select Modal from Menu or HUD
  const handleOpenCharacterSelect = useCallback((side: 'p1' | 'p2' = 'p1') => {
    setSelectModalInitialSide(side);
    setShowSelectModal(true);
  }, []);

  const activeTournamentMatch = activeTournamentMatchId
    ? tournament.matches.find(m => m.id === activeTournamentMatchId)
    : null;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-start p-3 sm:p-5 select-none font-sans overflow-x-hidden relative">
      {/* 1. MAIN MENU SCREEN (Sequential Home Lobby) */}
      {currentScreen === 'menu' && (
        <MainMenu
          gameMode={gameMode}
          onSelectGameMode={(mode) => setGameMode(mode)}
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            settingsRef.current = newSettings;
            setTournament(prev => ({
              ...prev,
              playerCharId: newSettings.p1Char
            }));
          }}
          tournament={tournament}
          beltState={beltState}
          onUpdateTournamentSize={handleNewTournament}
          onToggleTournamentControl={handleToggleTournamentPlayerControl}
          onOpenCharacterSelect={handleOpenCharacterSelect}
          onOpenHandbook={() => handleOpenGuide('rules')}
          onOpenHelpDrawer={() => handleOpenGuide('rules')}
          onOpenBeltModal={() => setShowBeltModal(true)}
          onOpenBalancePatch={() => setShowBalancePatchModal(true)}
          onOpenRecords={() => {
            setCurrentScreen('records');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartDuel={handleStartDuel}
          onEnterTournament={handleEnterTournament}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onSelectChampionAsPlayer={handleSelectChampionAsPlayer}
          onResetBeltStats={handleResetBeltRecords}
        />
      )}

      {/* 2. TOURNAMENT BRACKET SCREEN */}
      {currentScreen === 'tournament_bracket' && (
        <div className="w-full max-w-5xl flex flex-col gap-3">
          <TournamentBracketView
            tournament={tournament}
            beltState={beltState}
            autoNextConfig={autoNextConfig}
            onUpdateAutoNextConfig={handleUpdateAutoNextConfig}
            onSelectMatch={matchId => {
              setTournament(prev => ({ ...prev, currentMatchId: matchId }));
            }}
            onEnterMatch={handleEnterTournamentMatch}
            onSimulateMatch={handleSimulateTournamentMatch}
            onFastForwardAi={handleFastForwardAi}
            onNewTournament={handleNewTournament}
            onTogglePlayerControl={handleToggleTournamentPlayerControl}
            onSwitchToDuelMode={() => {
              setGameMode('duel');
              handleReturnToMenu();
            }}
            onReturnToMenu={handleReturnToMenu}
            onOpenBeltModal={() => setShowBeltModal(true)}
            onOpenCharacterSelect={() => handleOpenCharacterSelect('p1')}
            onOpenHandbook={() => handleOpenGuide('rules')}
            onOpenHelpDrawer={() => handleOpenGuide('rules')}
            onOpenRecords={() => {
              setCurrentScreen('records');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* 3. INDEPENDENT BATTLE RECORDS PAGE */}
      {currentScreen === 'records' && (
        <div className="w-full max-w-5xl flex flex-col gap-3">
          <BattleRecordsPage
            beltState={beltState}
            onReturnToMenu={handleReturnToMenu}
            onOpenBeltModal={() => setShowBeltModal(true)}
            onResetBeltStats={handleResetBeltRecords}
            onSelectChampionAsPlayer={handleSelectChampionAsPlayer}
            onEnterTournament={handleEnterTournament}
            onStartDuel={handleStartDuel}
          />
        </div>
      )}

      {/* 3. ACTIVE ARENA SCREEN (Live 1v1 Battle or Tournament Match) */}
      {currentScreen === 'arena' && (
        <main id="arena-main-screen" className="w-full max-w-4xl flex flex-col gap-3 flex-1">
          {/* Active Tournament Match Banner */}
          {gameMode === 'tournament' && activeTournamentMatch && (
            <div className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-indigo-950/90 border border-amber-500/40 text-xs shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="font-black text-amber-300 shrink-0 text-xs">
                  {activeTournamentMatch.roundName}
                </span>
                <span className="text-slate-500 shrink-0">｜</span>
                <span className="font-bold text-slate-200 truncate">
                  {CHARACTERS[p1State.characterId]?.name} VS {CHARACTERS[p2State.characterId]?.name}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono hidden xs:inline">
                爭奪榮譽冠軍
              </span>
            </div>
          )}

          {/* Battle HUD (Health, Status Indicators, and Unified Match Bar) */}
          <BattleHUD
            p1={p1State}
            p2={p2State}
            matchTime={matchTime}
            gameStatus={gameStatus}
            gameSpeed={settings.gameSpeed}
            soundEnabled={settings.soundEnabled}
            gameMode={gameMode}
            roundName={activeTournamentMatch?.roundName}
            onTogglePlay={handleTogglePlay}
            onRestart={() => {
              shouldAutoScrollToArenaRef.current = true;
              resetMatch();
              scrollToBattleArena();
            }}
            onToggleSpeed={handleToggleSpeed}
            onToggleSound={handleToggleSound}
            onOpenSettings={() => {
              if (gameMode === 'duel') {
                handleOpenCharacterSelect('p1');
              } else {
                handleReturnToBracket();
              }
            }}
            onReturnToMenu={handleReturnToMenu}
            onReturnToBracket={handleReturnToBracket}
            onOpenHandbook={() => handleOpenGuide('rules')}
            onOpenHelpDrawer={() => handleOpenGuide('rules')}
            isP1Manual={settings.p1Control === 'manual'}
            onTriggerP1Dash={handleTriggerP1Dash}
            onTriggerP1Shield={handleTriggerP1Shield}
            isTitleMatch={gameMode === 'duel' ? !!settings.isTitleMatchEnabled : (!!settings.isTournamentTitleMatchEnabled && activeTournamentMatch?.roundName === '總冠軍決賽')}
            onReplayIntro={() => {
              setGameStatus('paused');
              gameStatusRef.current = 'paused';
              setShowIntroModal(true);
            }}
          />

          {/* 2D Rigid Body Arena Canvas */}
          <div
            id="battle-arena"
            ref={battleArenaRef}
            className="relative shrink-0 scroll-mt-2"
          >
            <ArenaCanvas
              p1={p1State}
              p2={p2State}
              projectiles={projectiles}
              particles={particles}
              floatingTexts={floatingTexts}
              isP1Manual={settings.p1Control === 'manual'}
              onPointerSteer={(vec) => {
                p1InputRef.current = vec;
              }}
              onInitialized={scrollToBattleArena}
            />

            {/* Touch Joystick Overlay if Manual mode active on mobile */}
            {settings.p1Control === 'manual' && (
              <div className="md:hidden absolute bottom-3 left-3 z-20">
                <VirtualJoystick
                  onMove={(v) => {
                    p1InputRef.current = v;
                  }}
                  label="藍方方向"
                  color="#3b82f6"
                />
              </div>
            )}

            {/* Mobile Ergonomic Tactical Action Buttons for P1 when manual */}
            {settings.p1Control === 'manual' && settings.p2Control !== 'manual' && (
              <div className="md:hidden absolute bottom-3 right-3 z-20 flex items-end gap-2.5 select-none touch-none">
                {/* Shield Tactical Button (護盾) */}
                <button
                  id="btn-mobile-tactical-shield"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    handleTriggerP1Shield();
                  }}
                  disabled={(p1State.energy ?? 0) < 25 || (p1State.tacticalCooldown ?? 0) > 0 || gameStatus !== 'playing'}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-950/95 via-yellow-950/90 to-amber-900/90 border-2 border-amber-500/80 active:scale-90 disabled:opacity-40 disabled:pointer-events-none text-amber-200 flex flex-col items-center justify-center shadow-lg shadow-amber-500/25 transition-transform cursor-pointer relative backdrop-blur-md"
                  title="消耗 25 能量發動戰術護盾"
                >
                  <Shield className="w-5 h-5 text-amber-300 drop-shadow" />
                  <span className="text-[10px] font-black text-amber-200 mt-0.5">護盾</span>
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black font-mono shadow">
                    25⚡
                  </span>
                  {(p1State.tacticalCooldown ?? 0) > 0 && (
                    <div className="absolute inset-0 rounded-2xl bg-slate-950/70 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {(p1State.tacticalCooldown ?? 0).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </button>

                {/* Dash Tactical Button (瞬衝) */}
                <button
                  id="btn-mobile-tactical-dash"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    handleTriggerP1Dash();
                  }}
                  disabled={(p1State.energy ?? 0) < 30 || (p1State.tacticalCooldown ?? 0) > 0 || gameStatus !== 'playing'}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-950/95 via-sky-950/90 to-blue-900/90 border-2 border-sky-400 active:scale-90 disabled:opacity-40 disabled:pointer-events-none text-sky-100 flex flex-col items-center justify-center shadow-lg shadow-sky-500/30 transition-transform cursor-pointer relative backdrop-blur-md"
                  title="消耗 30 能量發動戰術瞬衝"
                >
                  <Wind className="w-6 h-6 text-sky-300 drop-shadow animate-pulse" />
                  <span className="text-[11px] font-black text-sky-200 mt-0.5">瞬衝</span>
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-sky-400 text-slate-950 text-[8.5px] font-black font-mono shadow">
                    30⚡
                  </span>
                  {(p1State.tacticalCooldown ?? 0) > 0 && (
                    <div className="absolute inset-0 rounded-2xl bg-slate-950/70 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="text-xs font-mono font-bold text-sky-300">
                        {(p1State.tacticalCooldown ?? 0).toFixed(1)}s
                      </span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {settings.p2Control === 'manual' && (
              <div className="md:hidden absolute bottom-3 right-3 z-20">
                <VirtualJoystick
                  onMove={(v) => {
                    p2InputRef.current = v;
                  }}
                  label="紅方方向"
                  color="#ef4444"
                />
              </div>
            )}
          </div>

          {/* Mobile Tabbed Content Switcher (md:hidden) */}
          <div className="md:hidden flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md gap-1 shrink-0">
            <button
              onClick={() => setMobileArenaTab('passives')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileArenaTab === 'passives'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>被動監控</span>
            </button>

            <button
              onClick={() => setMobileArenaTab('log')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                mobileArenaTab === 'log'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>戰鬥日誌</span>
              {combatEvents.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-sky-400 text-slate-950 font-mono text-[9px] font-black">
                  {Math.min(combatEvents.length, 99)}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileArenaTab('help')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileArenaTab === 'help'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>機制說明</span>
            </button>
          </div>

          {/* Mobile Conditional Content based on selected mobileArenaTab */}
          <div className="md:hidden">
            {mobileArenaTab === 'passives' && (
              <div className="space-y-3">
                {/* P1 3-Passives List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-100">{p1State.name}</span>
                      <span className="text-blue-400 font-black">三大被動</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      自動運作
                    </span>
                  </div>
                  <div className="space-y-2">
                    {CHARACTERS[p1State.characterId]?.passives.map((skill, idx) => (
                      <PassiveSkillCard
                        key={skill.id}
                        skill={skill}
                        ball={p1State}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>

                {/* P2 3-Passives List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-slate-100">{p2State.name}</span>
                      <span className="text-red-400 font-black">三大被動</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/80 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      自動運作
                    </span>
                  </div>
                  <div className="space-y-2">
                    {CHARACTERS[p2State.characterId]?.passives.map((skill, idx) => (
                      <PassiveSkillCard
                        key={skill.id}
                        skill={skill}
                        ball={p2State}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mobileArenaTab === 'log' && (
              <CombatLog
                events={combatEvents}
                onClear={() => {
                  setCombatEvents([]);
                  combatEventsRef.current = [];
                }}
              />
            )}

            {mobileArenaTab === 'help' && (
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-2.5 shadow-md">
                <div className="flex items-center gap-1.5 font-bold text-sky-300 border-b border-slate-800 pb-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  <span>戰鬥機制指南與戰術操作</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="text-amber-300 font-bold">⚡ 能量與超載：</span>
                    碰撞獲得能量。滿 100 進入超載模式，移速提升 25%、碰撞傷害提升 30%！
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="text-sky-300 font-bold">🛡️ 戰術技能：</span>
                    手動模式下點擊右下角按鈕可施放「瞬衝（30⚡）」或「護盾（25⚡）」。
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="text-emerald-300 font-bold">🎯 被動技能連鎖：</span>
                    每位英雄皆配有三大專屬被動技能，於戰鬥過程中依條件自動觸發。
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Dual Passives & Combat Log View (hidden on mobile) */}
          <div className="hidden md:flex md:flex-col md:gap-4">
            {/* Dual Passive Skills Monitoring Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* P1 3-Passives List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-slate-100">{p1State.name}</span>
                    <span className="text-blue-400 font-black">四大專屬被動</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    自動運作
                  </span>
                </div>
                <div className="space-y-2">
                  {CHARACTERS[p1State.characterId]?.passives.map((skill, idx) => (
                    <PassiveSkillCard
                      key={skill.id}
                      skill={skill}
                      ball={p1State}
                      index={idx}
                    />
                  ))}
                </div>
              </div>

              {/* P2 4-Passives List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-slate-100">{p2State.name}</span>
                    <span className="text-red-400 font-black">四大專屬被動</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/80 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    自動運作
                  </span>
                </div>
                <div className="space-y-2">
                  {CHARACTERS[p2State.characterId]?.passives.map((skill, idx) => (
                    <PassiveSkillCard
                      key={skill.id}
                      skill={skill}
                      ball={p2State}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Combat Event Stream Log */}
            <CombatLog
              events={combatEvents}
              onClear={() => {
                setCombatEvents([]);
                combatEventsRef.current = [];
              }}
            />
          </div>
        </main>
      )}

      {/* Character / Setup Selection Modal */}
      {showSelectModal && (
        <CharacterSelectModal
          settings={settings}
          initialSide={selectModalInitialSide}
          initialMode={gameMode === 'tournament' ? 'tournament' : 'duel'}
          tournamentSize={tournament.size}
          tournamentRoster={tournament.roster}
          tournamentPlayerChar={tournament.playerCharId}
          onConfirmTournamentSetup={(roster, playerCharId, size) => {
            const freshTournament = createTournament(size, playerCharId, tournament.playerControl, roster, beltState.currentHolderId);
            setTournament(freshTournament);
            setGameMode('tournament');
            setCurrentScreen('tournament_bracket');
            setShowSelectModal(false);
          }}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            settingsRef.current = newSettings;
            // Also sync tournament player character
            setTournament(prev => ({
              ...prev,
              playerCharId: newSettings.p1Char
            }));
          }}
          onStartMatch={() => {
            setShowSelectModal(false);
            shouldAutoScrollToArenaRef.current = true;
            resetMatch(settings);
            setCurrentScreen('arena');
            setGameStatus('paused');
            gameStatusRef.current = 'paused';
            setShowIntroModal(true);
          }}
          onClose={() => {
            setShowSelectModal(false);
          }}
        />
      )}

      {/* Wrestling Style Fighter Introduction & Announcer Modal */}
      {showIntroModal && (
        <WrestlingIntroModal
          p1={p1State}
          p2={p2State}
          isTitleMatch={gameMode === 'duel' ? !!settings.isTitleMatchEnabled : (!!settings.isTournamentTitleMatchEnabled && activeTournamentMatch?.roundName === '總冠軍決賽')}
          beltState={beltState}
          gameMode={gameMode}
          tournamentRoundName={activeTournamentMatch?.roundName}
          soundEnabled={settings.soundEnabled}
          onFinishIntro={() => {
            setShowIntroModal(false);
            setGameStatus('playing');
            gameStatusRef.current = 'playing';
            scrollToBattleArena(true);
          }}
        />
      )}

      {/* Game Over Summary Modal */}
      {gameStatus === 'gameover' && winner && (
        <GameOverModal
          p1={p1State}
          p2={p2State}
          winnerId={winner}
          matchTime={matchTime}
          onRematch={() => {
            // 每場比賽的冠軍賽狀態獨立判定，不會因上一場比賽的設定而自動延續
            setSettings(prev => ({ ...prev, isTitleMatchEnabled: false, isTournamentTitleMatchEnabled: false }));
            settingsRef.current = { ...settingsRef.current, isTitleMatchEnabled: false, isTournamentTitleMatchEnabled: false };
            shouldAutoScrollToArenaRef.current = true;
            resetMatch();
            setGameStatus('playing');
            gameStatusRef.current = 'playing';
            scrollToBattleArena(true);
          }}
          onChangeSetup={() => {
            if (gameMode === 'tournament') {
              handleReturnToBracket();
            } else {
              setShowSelectModal(true);
            }
          }}
          onReturnToMenu={handleReturnToMenu}
          isTournamentMatch={gameMode === 'tournament' && !!activeTournamentMatchId}
          tournamentRoundName={activeTournamentMatch?.roundName}
          onContinueTournament={handleContinueAfterTournamentMatch}
          beltState={beltState}
          onOpenBeltModal={() => setShowBeltModal(true)}
          autoNextConfig={autoNextConfig}
        />
      )}

      {/* Tournament Grand Champion Celebration Modal */}
      {gameMode === 'tournament' && tournament.stage === 'champion' && (
        <TournamentChampionModal
          tournament={tournament}
          beltState={beltState}
          onNewTournament={() => handleNewTournament(tournament.size)}
          onViewBracket={() => {
            setTournament(prev => ({ ...prev, stage: 'bracket' }));
            setCurrentScreen('tournament_bracket');
          }}
          onSwitchToDuel={() => {
            setGameMode('duel');
            handleReturnToMenu();
          }}
          onOpenBeltModal={() => setShowBeltModal(true)}
        />
      )}

      {/* Persistent World Championship Belt & Hall of Fame Modal */}
      <ChampionBeltModal
        isOpen={showBeltModal}
        onClose={() => setShowBeltModal(false)}
        beltState={beltState}
      />

      {/* Balance Patch Announcement Modal */}
      <BalancePatchModal
        isOpen={showBalancePatchModal}
        onClose={() => setShowBalancePatchModal(false)}
        onSelectCharacter={charId => {
          setSettings(prev => ({
            ...prev,
            p1Char: charId
          }));
          settingsRef.current = {
            ...settingsRef.current,
            p1Char: charId
          };
          // Also set tournament player character if in tournament mode
          setTournament(prev => ({
            ...prev,
            playerCharId: charId
          }));
          setShowSelectModal(true);
        }}
      />

      {/* Handbook & Skill Compendium Modal */}
      <RoleClassificationModal
        isOpen={showHandbookModal}
        onClose={() => setShowHandbookModal(false)}
        initialMode={handbookModalMode}
        onSelectCharacter={id => {
          setShowSelectModal(true);
        }}
      />

      {/* Footer info */}
      <footer className="w-full max-w-4xl py-2 mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
        <span>固定 2D 競技場・零鏡頭震動・純物理即時模擬</span>
        <div className="flex items-center gap-3">
          <span>空白鍵: 暫停/繼續</span>
          <span>R 鍵: 重新開始</span>
          <span>WASD / 方向鍵: 玩家引導</span>
        </div>
      </footer>
    </div>
  );
}

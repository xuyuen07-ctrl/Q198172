/**
 * Wrestling Intro Voice Synthesizer & Sound FX
 * Uses Web Speech API (speechSynthesis) if available and Web Audio API synthesized WWE stadium gongs and brass horns
 */

class WrestlingIntroAnnouncer {
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  /**
   * Play realistic wrestling ring bell ("DING! DING! DING!")
   */
  public playRingBell(ctx: AudioContext | null) {
    if (this.isMuted || !ctx) return;
    try {
      const now = ctx.currentTime;
      [0, 0.28, 0.56].forEach((offset) => {
        const t = now + offset;
        // High pure bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, t); // A6
        osc.frequency.exponentialRampToValueAtTime(1750, t + 0.4);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.46);

        // Metallic harmonic
        const harm = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(3520, t);
        harmGain.gain.setValueAtTime(0.15, t);
        harmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        harm.connect(harmGain);
        harmGain.connect(ctx.destination);
        harm.start(t);
        harm.stop(t + 0.26);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Play dynamic stage advance transition chime / whoosh
   */
  public playTransitionChime(ctx: AudioContext | null) {
    if (this.isMuted || !ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // ignore
    }
  }

  /**
   * Play epic stadium brass fanfare fanfare
   */
  public playStadiumHorn(ctx: AudioContext | null, isChampion: boolean = false) {
    if (this.isMuted || !ctx) return;
    try {
      const t = ctx.currentTime;
      const chords = isChampion
        ? [220, 277.18, 329.63, 440] // A Major
        : [196, 246.94, 293.66, 392]; // G Major

      // Deep stadium bass surge
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(isChampion ? 110 : 98, t);
      sub.frequency.exponentialRampToValueAtTime(isChampion ? 55 : 49, t + 0.9);
      subGain.gain.setValueAtTime(0.4, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(t);
      sub.stop(t + 1.0);

      // Brass horns
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, t + idx * 0.04 + 0.7);

        gain.gain.setValueAtTime(0.18, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.85);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Speak announcement using browser Web Speech API (Chinese/Taiwan or localized fallback)
   */
  public speak(text: string, rate: number = 1.05, pitch: number = 1.0) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.95;

      const voices = window.speechSynthesis.getVoices();
      // Look for suitable Chinese/Taiwan/Cantonese voices, else standard
      const zhVoice = voices.find(v => v.lang.includes('zh-TW') || v.lang.includes('zh-HK') || v.lang.includes('zh-CN') || v.lang.includes('zh'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Web speech not available or blocked
    }
  }
}

export const wrestlingAnnouncer = new WrestlingIntroAnnouncer();

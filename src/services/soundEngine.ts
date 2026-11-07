/**
 * SHUBH DEEP — Dedicated Background Music & Audio Engine
 * Single Source: /audio/diwali-song.mp3
 * Default Volume: 30% (0.3)
 * Behavior:
 * 1. Immediate Autoplay on website load.
 * 2. If rejected by browser policy (e.g. Chrome/Safari zero-MEI), registers a reliable
 *    first-interaction fallback (click, touchstart, touchend, pointerdown, keydown).
 * 3. Does NOT pretend autoplay succeeded if blocked.
 * 4. Continuous singleton playback across all website sections without restarting.
 * 5. Reactive state subscription for the Navbar Sound On / Sound Off control.
 * 6. Web Audio API auspicious sound effects (Temple Bell & Diya Light Strike) layered over music.
 */

type SoundStateListener = (isPlaying: boolean) => void;

class SoundEngine {
  private bgAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPlayPending: boolean = false;
  private userManuallyMuted: boolean = false;
  private listeners: Set<SoundStateListener> = new Set();
  private unlockAttached: boolean = false;

  // Web Audio Context for Bell & Diya Chimes
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  /**
   * Initializes the single background music instance.
   */
  private initAudioElement(): HTMLAudioElement | null {
    if (this.bgAudio) return this.bgAudio;
    if (typeof window === 'undefined') return null;

    try {
      // Standard public URL: /audio/diwali-song.mp3
      const audioUrl = new URL('/audio/diwali-song.mp3', window.location.origin).href;

      this.bgAudio = new Audio(audioUrl);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.3; // Strictly 30%
      this.bgAudio.preload = 'auto';

      this.bgAudio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notifyListeners();
      });

      this.bgAudio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.bgAudio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.bgAudio.addEventListener('error', (e) => {
        console.warn('[SoundEngine] Background audio loading/playback error:', e);
        this.isPlaying = false;
        this.notifyListeners();
      });

      return this.bgAudio;
    } catch (err) {
      console.warn('[SoundEngine] Could not initialize audio element:', err);
      return null;
    }
  }

  /**
   * Safely play the audio element with volume 0.3 and race-condition prevention.
   */
  public async safePlay(): Promise<boolean> {
    const audio = this.initAudioElement();
    if (!audio) return false;

    // If already playing, return true
    if (this.isPlaying && !audio.paused) {
      return true;
    }

    if (this.isPlayPending) {
      return false;
    }

    this.isPlayPending = true;

    try {
      audio.volume = 0.3; // Strictly 30% default volume
      await audio.play();
      this.isPlaying = true;
      this.userManuallyMuted = false;
      this.notifyListeners();
      return true;
    } catch (err: any) {
      this.isPlaying = false;
      this.notifyListeners();
      // Returns false cleanly; does NOT pretend autoplay succeeded
      return false;
    } finally {
      this.isPlayPending = false;
    }
  }

  /**
   * Attempt unmuted autoplay immediately on website entry.
   * If rejected by browser policy (NotAllowedError), registers interaction fallback.
   */
  public async attemptAutoplay(): Promise<boolean> {
    if (this.userManuallyMuted) return false;

    const audio = this.initAudioElement();
    if (!audio) return false;

    const success = await this.safePlay();

    if (success) {
      console.log('[SoundEngine] Autoplay succeeded immediately on page load.');
      return true;
    } else {
      console.log('[SoundEngine] Autoplay was blocked by browser policy. Registering first-interaction fallback.');
      this.registerFirstInteractionFallback();
      return false;
    }
  }

  /**
   * Register reliable first-interaction fallback listeners across pointer, touch, and keyboard.
   */
  private registerFirstInteractionFallback() {
    if (this.unlockAttached || typeof window === 'undefined') return;
    this.unlockAttached = true;

    const events = ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'];

    const handleInteraction = async () => {
      if (this.userManuallyMuted) {
        this.removeInteractionListeners(events, handleInteraction);
        return;
      }

      const played = await this.safePlay();
      if (played) {
        console.log('[SoundEngine] Background music unlocked and playing after first user interaction.');
        this.removeInteractionListeners(events, handleInteraction);
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { capture: true, passive: true });
      document.addEventListener(evt, handleInteraction, { capture: true, passive: true });
    });
  }

  private removeInteractionListeners(events: string[], handler: () => void) {
    if (typeof window === 'undefined') return;
    events.forEach((evt) => {
      window.removeEventListener(evt, handler, { capture: true });
      document.removeEventListener(evt, handler, { capture: true });
    });
    this.unlockAttached = false;
  }

  /**
   * Subscribe to playback status changes
   */
  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isPlaying);
      } catch (err) {
        console.error('[SoundEngine] Error in audio state listener:', err);
      }
    });
  }

  /**
   * Toggle music playback (Sound On / Sound Off)
   */
  public toggle(): boolean {
    const audio = this.initAudioElement();
    if (!audio) return false;

    if (this.isPlaying && !audio.paused) {
      // User explicitly clicked Mute
      this.userManuallyMuted = true;
      audio.pause();
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    } else {
      // User explicitly clicked Unmute
      this.userManuallyMuted = false;
      this.playTempleBell();
      this.safePlay();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // ==========================================================================
  // AUSPICIOUS SOUND EFFECTS (TEMPLE BELL & DIYA MATCH STRIKE)
  // Layered on top of music without interrupting it
  // ==========================================================================

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTempleBell() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const partials = [
        { freq: 440, gain: 0.35, decay: 3.2 },
        { freq: 587, gain: 0.28, decay: 2.8 },
        { freq: 880, gain: 0.22, decay: 2.2 },
        { freq: 1174, gain: 0.15, decay: 1.8 },
        { freq: 1760, gain: 0.08, decay: 1.2 },
      ];

      partials.forEach(({ freq, gain, decay }) => {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + decay);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(gain * 0.4, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // Graceful fallback
    }
  }

  public playDiyaLightStrike() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      // Soft match friction
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);

      // Warm singing chime
      const chimeFreqs = [587.33, 880, 1174.66];
      chimeFreqs.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.04);

        g.gain.setValueAtTime(0.001, now + 0.04);
        g.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(g);
        g.connect(this.masterGain);

        osc.start(now + 0.04);
        osc.stop(now + 2.2);
      });
    } catch {
      // Graceful fallback
    }
  }
}

export const soundEngine = new SoundEngine();

/**
 * SHUBH DEEP — Audio Engine & Background Music Manager
 * Features:
 * 1. Immediate Autoplay on Entry: Attempts unmuted playback of `/audio/diwali-song.mp3` at 30% volume.
 * 2. Interaction-based Unlock: If modern browser policies block autoplay, hooks the very first user gesture
 *    (tap, click, keydown, pointerdown) to instantly start seamless playback.
 * 3. Singleton Audio Instance: Zero duplication, continuous looping across all page sections.
 * 4. Reactive State Subscription: Synchronizes navbar Sound Toggle with real-time audio playback status.
 * 5. Web Audio Sound Effects: Auspicious temple bell & diya match-strike layered smoothly over music.
 * 6. Graceful Synthetic Fallback: Seamless tanpura drone if external media is unavailable.
 */

type SoundStateListener = (isPlaying: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Background Song Audio Element (Singleton)
  private bgMusic: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private userManuallyMuted: boolean = false;
  private listeners: Set<SoundStateListener> = new Set();
  private unlockAttached: boolean = false;

  // Synthetic Tanpura Drone Fallback
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initMusicElement();
    }
  }

  /**
   * Initializes the singleton HTML5 Audio element for /audio/diwali-song.mp3
   */
  private initMusicElement() {
    if (this.bgMusic) return;

    try {
      const basePath = import.meta.env.BASE_URL || '/';
      const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
      const audioUrl = `${cleanBase}audio/diwali-song.mp3`;

      this.bgMusic = new Audio(audioUrl);
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.3; // 30% default volume
      this.bgMusic.preload = 'auto';

      // Keep state synchronized
      this.bgMusic.addEventListener('play', () => {
        this.isPlaying = true;
        this.notifyListeners();
      });

      this.bgMusic.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.bgMusic.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notifyListeners();
      });

      this.bgMusic.addEventListener('error', (e) => {
        console.warn('[SoundEngine] Background audio element encountered an error:', e);
      });
    } catch (err) {
      console.warn('[SoundEngine] Audio element initialization skipped:', err);
    }
  }

  /**
   * Initialize Web Audio Context for Bell & Diya Chimes
   */
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

  /**
   * Attempt immediate unmuted autoplay on page entry.
   * If blocked by browser autoplay policy (NotAllowedError), prepares
   * the earliest interaction unlock on pointerdown/touchstart/click/keydown.
   */
  public async attemptAutoplay(): Promise<boolean> {
    this.initMusicElement();
    if (!this.bgMusic || this.userManuallyMuted) return false;

    // Ensure volume is strictly 30%
    this.bgMusic.volume = 0.3;

    try {
      // Direct standard play attempt
      const playPromise = this.bgMusic.play();

      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.notifyListeners();
        console.log('[SoundEngine] Autoplay with sound succeeded immediately.');
        return true;
      }
      return false;
    } catch (err: any) {
      console.log(
        `[SoundEngine] Autoplay blocked by browser policy (${err?.name || 'NotAllowedError'}). Attaching first-interaction listener.`
      );
      this.isPlaying = false;
      this.notifyListeners();

      // Setup earliest permitted interaction unlock
      this.attachInteractionUnlock();
      return false;
    }
  }

  /**
   * Sets up listeners on window for the earliest user interaction to unlock audio.
   */
  private attachInteractionUnlock() {
    if (this.unlockAttached || typeof window === 'undefined') return;
    this.unlockAttached = true;

    const unlockHandler = async () => {
      // Remove listeners immediately so it only executes once
      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((eventName) => {
        window.removeEventListener(eventName, unlockHandler, { capture: true });
      });
      this.unlockAttached = false;

      // If user hasn't explicitly clicked Mute, start playback
      if (!this.userManuallyMuted && this.bgMusic && this.bgMusic.paused) {
        this.initContext();
        try {
          this.bgMusic.volume = 0.3;
          await this.bgMusic.play();
          this.isPlaying = true;
          this.notifyListeners();
          console.log('[SoundEngine] Audio unlocked and playing via user interaction.');
        } catch (playErr) {
          console.warn('[SoundEngine] Interaction unlock attempt failed:', playErr);
        }
      }
    };

    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((eventName) => {
      window.addEventListener(eventName, unlockHandler, { capture: true, once: true });
    });
  }

  /**
   * Subscribe to playback status changes
   */
  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener);
    // Initial call
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
        console.error('[SoundEngine] Listener notification error:', err);
      }
    });
  }

  /**
   * Toggle music playback (Sound On / Sound Off)
   */
  public toggle(): boolean {
    this.initMusicElement();

    if (this.isPlaying) {
      // Mute / Pause
      this.userManuallyMuted = true;
      if (this.bgMusic) {
        this.bgMusic.pause();
      }
      this.stopSyntheticDrone();
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    } else {
      // Unmute / Play
      this.userManuallyMuted = false;
      this.initContext();
      this.playTempleBell();

      if (this.bgMusic) {
        this.bgMusic.volume = 0.3;
        this.bgMusic
          .play()
          .then(() => {
            this.isPlaying = true;
            this.notifyListeners();
          })
          .catch((err) => {
            console.warn('[SoundEngine] Play failed, activating synthetic fallback drone:', err);
            this.startSyntheticDrone();
            this.isPlaying = true;
            this.notifyListeners();
          });
      } else {
        this.startSyntheticDrone();
        this.isPlaying = true;
        this.notifyListeners();
      }
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // ==========================================================================
  // SACRED SOUND EFFECTS (TEMPLE BELL & DIYA MATCH STRIKE)
  // Layered on top of music without interrupting it
  // ==========================================================================

  /**
   * Auspicious Traditional Temple Bell (Ghantha)
   */
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

  /**
   * Sound effect for lighting the sacred Diya:
   * Gentle acoustic match-strike followed by warm golden chime
   */
  public playDiyaLightStrike() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      // Soft match-strike friction (bandpass filtered noise burst)
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

      // Followed by warm singing chime (D5, A5, D6 harmonic chord)
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

  // ==========================================================================
  // SYNTHETIC TANPURA DRONE (FALLBACK IF AUDIO FILE FAILS)
  // ==========================================================================
  private startSyntheticDrone() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (this.droneOscillators.length > 0) return;

      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.1, now + 2.0);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(2.5, now);

      this.droneGain.connect(filter);
      filter.connect(this.masterGain);

      const droneNotes = [
        { freq: 73.41, type: 'triangle' as OscillatorType, detune: 0 },
        { freq: 110.0, type: 'sine' as OscillatorType, detune: -3 },
        { freq: 146.83, type: 'triangle' as OscillatorType, detune: 4 },
        { freq: 220.0, type: 'sine' as OscillatorType, detune: -2 },
        { freq: 293.66, type: 'sine' as OscillatorType, detune: 2 },
      ];

      this.droneOscillators = droneNotes.map(({ freq, type, detune }) => {
        const osc = this.ctx!.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);
        osc.connect(this.droneGain!);
        osc.start(now);
        return osc;
      });

      this.lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.25, now);
      lfoGain.gain.setValueAtTime(0.03, now);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.droneGain.gain);
      this.lfo.start(now);
    } catch {
      // Fallback
    }
  }

  private stopSyntheticDrone() {
    try {
      if (!this.ctx || !this.droneGain) return;
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);

      const oscillatorsToStop = [...this.droneOscillators];
      const lfoToStop = this.lfo;

      setTimeout(() => {
        oscillatorsToStop.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        if (lfoToStop) {
          try {
            lfoToStop.stop();
            lfoToStop.disconnect();
          } catch {}
        }
      }, 1100);

      this.droneOscillators = [];
      this.lfo = null;
    } catch {
      // Fallback
    }
  }
}

export const soundEngine = new SoundEngine();

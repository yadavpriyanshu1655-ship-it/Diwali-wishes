/**
 * SHUBH DEEP — Web Audio Synthesizer Engine
 * Pure Web Audio API implementation of traditional Indian acoustic sounds:
 * 1. Temple Bell (घंटा / Ghantha) with authentic bronze partials and strike decay.
 * 2. Tanpura Acoustic Drone (तंबूरा) tuned to traditional Sa-Pa (D3/A3) with harmonic resonance.
 * 3. Sacred Diya Light Strike (घर्षण एवं सुवर्ण ध्वनि) with match friction and warm singing chime.
 * 
 * Works 100% offline, zero external audio asset dependencies, zero network requests.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Sound effect for lighting the sacred Diya:
   * A gentle acoustic match-strike followed by an auspicious golden chime
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

      // Followed by warm singing bell chime (D5, A5, D6 harmonic chord)
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
      // Graceful fallback if audio is disabled
    }
  }

  /**
   * Strike an auspicious traditional temple bell (Ghantha)
   */
  public playTempleBell() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Traditional bronze bell partial frequencies relative to ~520Hz fundamental
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
        gainNode.gain.linearRampToValueAtTime(gain * 0.5, now + 0.015);
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
   * Start warm meditative Tanpura acoustic drone
   */
  public startAmbientDrone() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (this.droneOscillators.length > 0) return;

      const now = this.ctx.currentTime;

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.12, now + 2.0);

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

      this.isMuted = false;
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Stop warm meditative Tanpura acoustic drone
   */
  public stopAmbientDrone() {
    try {
      if (!this.ctx || !this.droneGain) return;
      const now = this.ctx.currentTime;

      this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

      const oscillatorsToStop = [...this.droneOscillators];
      const lfoToStop = this.lfo;

      setTimeout(() => {
        oscillatorsToStop.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Stopped
          }
        });
        if (lfoToStop) {
          try {
            lfoToStop.stop();
            lfoToStop.disconnect();
          } catch {
            // Stopped
          }
        }
      }, 1300);

      this.droneOscillators = [];
      this.lfo = null;
      this.isMuted = true;
    } catch {
      // Graceful fallback
    }
  }

  public toggleMute(): boolean {
    if (this.isMuted) {
      this.playTempleBell();
      this.startAmbientDrone();
      return false;
    } else {
      this.stopAmbientDrone();
      return true;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();

// LinkPulse Audio Engine: Background Beat Looper + AI Speech Synthesis + UI SFX

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isMusicMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechSafetyTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initBgAudio();
    }
  }

  public initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private initBgAudio() {
    if (typeof window === "undefined") return;
    if (!this.bgAudio) {
      this.bgAudio = new Audio("/bg-music.mp3");
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.35;
      this.bgAudio.preload = "auto";
    }
  }

  // --- Background Loop Track (/bg-music.mp3) ---
  public playBgMusic() {
    if (typeof window === "undefined" || this.isMusicMuted) return;
    this.initBgAudio();
    if (!this.bgAudio) return;

    this.bgAudio.volume = 0.35;
    const playPromise = this.bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy: unlock on first interaction
        const unlock = () => {
          if (!this.isMusicMuted && this.bgAudio) {
            this.bgAudio.play().catch(() => {});
          }
          window.removeEventListener("click", unlock);
          window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("click", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
      });
    }
  }

  public stopBgMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  public pauseBgMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.isMusicMuted) {
      this.pauseBgMusic();
    } else {
      this.playBgMusic();
    }
    return !this.isMusicMuted;
  }

  public isMuted(): boolean {
    return this.isMusicMuted;
  }

  public setMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.pauseBgMusic();
    } else {
      this.playBgMusic();
    }
  }

  // Aliases for compatibility
  public startAmbient() {
    this.playBgMusic();
  }

  public stopAmbient() {
    this.stopBgMusic();
  }

  // --- Quick UI Click / Chime Sounds ---
  public playClick() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  public playSuccess() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [1046.5, 1567.98].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  public playError() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // --- Web Speech API Text-to-Speech ---
  public speak(text: string, onEnd?: () => void) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = 0.95;
      utterance.pitch = 0.92;
      utterance.volume = 1.0;

      let hasFinished = false;
      const finish = () => {
        if (!hasFinished) {
          hasFinished = true;
          this.currentUtterance = null;
          if (this.speechSafetyTimer) {
            clearTimeout(this.speechSafetyTimer);
            this.speechSafetyTimer = null;
          }
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Chrome GC bug fallback timer: estimated duration + 800ms
      const wordCount = text.split(/\s+/).length;
      const estDurationMs = Math.max(2000, (wordCount / 2.3) * 1000);
      this.speechSafetyTimer = setTimeout(finish, estDurationMs + 800);

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (this.speechSafetyTimer) {
      clearTimeout(this.speechSafetyTimer);
      this.speechSafetyTimer = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.currentUtterance = null;
  }
}

export const sounds = new SoundEngine();
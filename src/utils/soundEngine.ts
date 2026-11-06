import { EdgeTTS } from 'edge-tts-universal/browser';
import { OFFLINE_VOICE_CLIPS } from './kidExplanations';

export type NarratorVoiceId = 'fa-IR-DilaraNeural' | 'fa-IR-FaridNeural';

type SpeakingListener = (speaking: boolean, currentText: string) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private blobUrlCache = new Map<string, string>();
  private listeners = new Set<SpeakingListener>();
  private speakSeq = 0;

  public soundEnabled = true;
  public voiceEnabled = true;
  public narratorVoice: NarratorVoiceId = 'fa-IR-DilaraNeural';
  public customCheerUrl: string | undefined;

  public get enabled(): boolean {
    return this.soundEnabled;
  }
  public set enabled(val: boolean) {
    this.soundEnabled = val;
  }

  public subscribeSpeaking(fn: SpeakingListener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notifySpeaking(speaking: boolean, text = '') {
    this.listeners.forEach((fn) => fn(speaking, text));
  }

  public stopSpeech() {
    this.speakSeq++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.notifySpeaking(false, '');
  }

  private getCtx(): AudioContext | null {
    if (!this.soundEnabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playAudioElement(url: string, seq: number, displayText: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (seq !== this.speakSeq) return resolve(false);
      const audio = new Audio(url);
      this.currentAudio = audio;
      this.notifySpeaking(true, displayText);

      let settled = false;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.notifySpeaking(false, '');
        }
        resolve(ok);
      };

      audio.onended = () => finish(true);
      audio.onerror = () => finish(false);
      audio.play().catch(() => finish(false));
    });
  }

  /**
   * Speaks any Persian text out loud using:
   * 1. Exact offline bundled neural MP3 (./voices/<clipKey>.mp3) when matching
   * 2. Electron desktop neural TTS (msedge-tts + permanent disk cache)
   * 3. Browser neural TTS (edge-tts-universal/browser + memory cache)
   * 4. Offline bundled category MP3 fallback (./voices/<clipKey>.mp3)
   * 5. Browser SpeechSynthesis (fa-IR)
   */
  public async speakPersian(text: string, fallbackClipKey?: string): Promise<void> {
    if (!this.voiceEnabled || !text) return;

    this.stopSpeech();
    const seq = this.speakSeq;

    // 1. If exact match to a bundled offline clip & default Dilara voice, try instant local MP3 first!
    if (
      fallbackClipKey &&
      this.narratorVoice === 'fa-IR-DilaraNeural' &&
      OFFLINE_VOICE_CLIPS[fallbackClipKey] === text
    ) {
      const okLocal = await this.playAudioElement(`./voices/${fallbackClipKey}.mp3`, seq, text);
      if (okLocal || seq !== this.speakSeq) return;
    }

    // 2. Check memory cache
    const cacheKey = `${this.narratorVoice}::${text}`;
    const memUrl = this.blobUrlCache.get(cacheKey);
    if (memUrl) {
      const okMem = await this.playAudioElement(memUrl, seq, text);
      if (okMem || seq !== this.speakSeq) return;
    }

    // 3. Electron Desktop IPC Neural Persian TTS (works 100% cleanly on Windows + caches on disk!)
    const desktopApi = (window as unknown as {
      desktopAPI?: {
        synthesizePersian?: (t: string, v: string) => Promise<string | null>;
      };
    }).desktopAPI;

    if (desktopApi?.synthesizePersian) {
      try {
        this.notifySpeaking(true, text);
        const dataUrl = await desktopApi.synthesizePersian(text, this.narratorVoice);
        if (seq !== this.speakSeq) return;
        if (dataUrl) {
          this.blobUrlCache.set(cacheKey, dataUrl);
          const okDesk = await this.playAudioElement(dataUrl, seq, text);
          if (okDesk || seq !== this.speakSeq) return;
        }
      } catch {
        // Proceed to next fallback
      }
    }

    // 4. Browser Native Neural TTS (EdgeTTS WebSocket)
    try {
      this.notifySpeaking(true, text);
      const tts = new EdgeTTS(text, this.narratorVoice, {
        rate: '-4%',
        pitch: '+3Hz',
      });
      const res = await tts.synthesize();
      if (seq !== this.speakSeq) return;
      if (res?.audio && res.audio.size > 400) {
        const objUrl = URL.createObjectURL(res.audio);
        this.blobUrlCache.set(cacheKey, objUrl);
        const okWeb = await this.playAudioElement(objUrl, seq, text);
        if (okWeb || seq !== this.speakSeq) return;
      }
    } catch {
      // Proceed to offline bundled MP3 fallback
    }

    // 5. Offline Bundled Category MP3 Fallback (100% offline inside .exe & Offline-Web.zip!)
    if (fallbackClipKey) {
      const okFallbackMp3 = await this.playAudioElement(
        `./voices/${fallbackClipKey}.mp3`,
        seq,
        OFFLINE_VOICE_CLIPS[fallbackClipKey] || text
      );
      if (okFallbackMp3 || seq !== this.speakSeq) return;
    }

    // 6. OS SpeechSynthesis fallback if a Persian voice is installed
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const voices = window.speechSynthesis.getVoices();
        const faVoice = voices.find((v) => v.lang.toLowerCase().startsWith('fa'));
        if (faVoice) {
          const utter = new SpeechSynthesisUtterance(text);
          utter.voice = faVoice;
          utter.lang = 'fa-IR';
          utter.rate = 0.95;
          this.notifySpeaking(true, text);
          utter.onend = () => this.notifySpeaking(false, '');
          utter.onerror = () => this.notifySpeaking(false, '');
          window.speechSynthesis.speak(utter);
          return;
        }
      } catch {
        // Ignore
      }
    }

    this.notifySpeaking(false, '');
  }

  public async speakClipKey(clipKey: string): Promise<void> {
    const text = OFFLINE_VOICE_CLIPS[clipKey];
    if (!text) return;
    return this.speakPersian(text, clipKey);
  }

  public playPop(pitch = 520) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.65, now + 0.09);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playSnap() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSwitchClick(isOn: boolean) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(isOn ? 620 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 920 : 280, now + 0.045);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playWireSpark() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [580, 880, 1180].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.03);
      gain.gain.setValueAtTime(0.14, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.1);
    });
  }

  public playMotorWhir() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(210, now + 0.35);
    osc.frequency.linearRampToValueAtTime(175, now + 0.75);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.88);
  }

  public playDoorbell() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [659.25, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.28);
      gain.gain.setValueAtTime(0.28, now + idx * 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.28 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.28);
      osc.stop(now + idx * 0.28 + 0.6);
    });
  }

  public playShortCircuitWarning() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.28);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playPourLiquid() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [320, 410, 490, 580, 660].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.075);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + i * 0.075 + 0.06);
      gain.gain.setValueAtTime(0.15, now + i * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.075);
      osc.stop(now + i * 0.075 + 0.08);
    });
  }

  public playFizzEruption() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 1.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.65));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(2400, now + 0.4);
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  public playMagnetClink(attracted: boolean) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (attracted) {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1046, now);
      osc.frequency.exponentialRampToValueAtTime(1568, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playMusicalGlass(noteIndex: number) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
    const freq = scale[noteIndex % scale.length];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playVictoryFanfare() {
    const ctx = this.getCtx();
    if (ctx) {
      const now = ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.5];
      melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.11);
        gain.gain.setValueAtTime(0.24, now + i * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + (i === 3 ? 0.6 : 0.22));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.11);
        osc.stop(now + i * 0.11 + (i === 3 ? 0.65 : 0.25));
      });
    }

    if (this.customCheerUrl && this.voiceEnabled) {
      try {
        const audio = new Audio(this.customCheerUrl);
        audio.volume = 0.95;
        setTimeout(() => {
          audio.play().catch(() => {});
        }, 450);
      } catch {
        // Ignore
      }
    }
  }
}

export const soundEngine = new SoundEngine();

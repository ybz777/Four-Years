import type { Category } from '../game/types';

type Family =
  | 'intimacy'
  | 'party'
  | 'money'
  | 'housing'
  | 'academic'
  | 'career'
  | 'dating'
  | 'danger'
  | 'serious'
  | 'health'
  | 'social'
  | 'ceremony'
  | 'warm'
  | 'life';

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let bed: GainNode | null = null;
let generation = 0;
let timer = 0;

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function unlockAudio(): void {
  audio();
}

export function stopScene(): void {
  generation += 1;
  window.clearTimeout(timer);
  bed?.disconnect();
  bed = null;
}

function hash(text: string): number {
  let n = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    n ^= text.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}

function burst(ac: AudioContext): AudioBuffer {
  if (noise && noise.sampleRate === ac.sampleRate) return noise;
  const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  noise = buf;
  return buf;
}

function tone(
  ac: AudioContext,
  dest: AudioNode,
  time: number,
  freq: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  slide?: number,
): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), time + dur);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(vol, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function noiseHit(ac: AudioContext, dest: AudioNode, time: number, dur: number, vol: number, freq: number): void {
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const gain = ac.createGain();
  src.buffer = burst(ac);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, time);
  filter.Q.value = 0.7;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(filter).connect(gain).connect(dest);
  src.start(time);
  src.stop(time + dur);
}

function ohYeah(ac: AudioContext, dest: AudioNode, time: number, vol: number): void {
  const osc = ac.createOscillator();
  const filter = ac.createBiquadFilter();
  const gain = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(174, time);
  osc.frequency.exponentialRampToValueAtTime(220, time + 0.16);
  osc.frequency.exponentialRampToValueAtTime(349, time + 0.42);
  osc.frequency.exponentialRampToValueAtTime(262, time + 0.78);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(640, time);
  filter.frequency.linearRampToValueAtTime(1500, time + 0.4);
  filter.Q.value = 5;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(vol, time + 0.08);
  gain.gain.exponentialRampToValueAtTime(vol * 0.7, time + 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
  osc.connect(filter).connect(gain).connect(dest);
  osc.start(time);
  osc.stop(time + 0.95);
  tone(ac, dest, time + 0.34, 523, 0.28, 'sine', vol * 0.35);
}

function familyFor(eventId: string, categories: Category[]): Family {
  if (eventId === 'intimacy') return 'intimacy';
  if (eventId === 'party') return 'party';
  if (eventId === 'ceremony' || eventId === 'ending') return 'ceremony';
  if (eventId === 'getting-home' || eventId === 'night-walk' || eventId === 'public-incident' || eventId === 'medical-crisis' || eventId === 'death') return 'danger';
  if (eventId === 'pregnancy-decision' || eventId === 'prenatal' || eventId === 'clinic-sti' || eventId === 'breakup') return 'serious';
  if (categories.includes('money')) return 'money';
  if (categories.includes('housing')) return 'housing';
  if (categories.includes('academic')) return 'academic';
  if (categories.includes('career') || categories.includes('work')) return 'career';
  if (categories.includes('dating')) return 'dating';
  if (categories.includes('risk')) return 'danger';
  if (categories.includes('health')) return 'health';
  if (categories.includes('social')) return 'social';
  if (categories.includes('warm')) return 'warm';
  return 'life';
}

function renderBed(ac: AudioContext, dest: AudioNode, family: Family, seed: number, time: number): number {
  const step = (seed % 5) - 2;
  const lift = 2 ** (step / 12);
  const note = (freq: number) => freq * lift;
  if (family === 'intimacy') {
    ohYeah(ac, dest, time, 0.07);
    return 2.4;
  }
  if (family === 'party') {
    for (let i = 0; i < 4; i += 1) tone(ac, dest, time + i * 0.48, note(140), 0.12, 'sine', 0.08, 48);
    noiseHit(ac, dest, time, 0.05, 0.04, 6000);
    noiseHit(ac, dest, time + 0.96, 0.05, 0.03, 7000);
    tone(ac, dest, time + 0.2, note(523), 0.12, 'square', 0.03);
    tone(ac, dest, time + 1.15, note(659), 0.14, 'square', 0.03);
    return 1.95;
  }
  if (family === 'money') {
    tone(ac, dest, time, note(880), 0.08, 'square', 0.05);
    tone(ac, dest, time + 0.09, note(1320), 0.1, 'square', 0.04);
    tone(ac, dest, time + 0.7, note(660 + (seed % 3) * 40), 0.16, 'triangle', 0.05);
    return 1.7;
  }
  if (family === 'housing') {
    tone(ac, dest, time, note(196), 0.22, 'sawtooth', 0.04, note(140));
    tone(ac, dest, time + 0.28, note(330), 0.12, 'square', 0.04);
    noiseHit(ac, dest, time + 0.55, 0.08, 0.05, 220);
    return 1.8;
  }
  if (family === 'academic') {
    const scale = [523, 587, 659, 698, 784];
    for (let i = 0; i < 4; i += 1) {
      const freq = scale[(seed + i * 2) % scale.length] ?? 523;
      tone(ac, dest, time + i * 0.34, note(freq), 0.22, 'sine', 0.05);
    }
    return 1.7;
  }
  if (family === 'career') {
    tone(ac, dest, time, note(392), 0.4, 'triangle', 0.04);
    tone(ac, dest, time, note(494), 0.4, 'sine', 0.03);
    tone(ac, dest, time + 0.45, note(587), 0.35, 'triangle', 0.045);
    return 1.6;
  }
  if (family === 'dating') {
    tone(ac, dest, time, note(440), 0.45, 'sine', 0.045);
    tone(ac, dest, time + 0.12, note(554), 0.4, 'sine', 0.03);
    tone(ac, dest, time + 0.55, note(659), 0.35, 'triangle', 0.04);
    return 1.8;
  }
  if (family === 'danger') {
    tone(ac, dest, time, note(110), 0.45, 'sine', 0.07);
    tone(ac, dest, time + 0.5, note(98), 0.5, 'sine', 0.06);
    noiseHit(ac, dest, time + 0.15, 0.12, 0.03, 180);
    return 1.8;
  }
  if (family === 'serious') {
    tone(ac, dest, time, note(220), 0.7, 'sine', 0.04);
    tone(ac, dest, time + 0.15, note(277), 0.6, 'sine', 0.025);
    return 2.1;
  }
  if (family === 'health') {
    noiseHit(ac, dest, time, 0.18, 0.04, 900);
    tone(ac, dest, time + 0.28, note(392), 0.2, 'triangle', 0.04, note(300));
    return 1.5;
  }
  if (family === 'social') {
    tone(ac, dest, time, note(392), 0.18, 'triangle', 0.045);
    tone(ac, dest, time + 0.02, note(494), 0.16, 'triangle', 0.03);
    tone(ac, dest, time + 0.36, note(587), 0.2, 'sine', 0.04);
    return 1.5;
  }
  if (family === 'ceremony') {
    tone(ac, dest, time, note(523), 0.35, 'triangle', 0.05);
    tone(ac, dest, time + 0.2, note(659), 0.35, 'triangle', 0.045);
    tone(ac, dest, time + 0.4, note(784), 0.5, 'triangle', 0.05);
    return 2.2;
  }
  if (family === 'warm') {
    tone(ac, dest, time, note(349), 0.5, 'sine', 0.04);
    tone(ac, dest, time + 0.08, note(440), 0.45, 'sine', 0.03);
    tone(ac, dest, time + 0.5, note(523), 0.4, 'triangle', 0.035);
    return 1.8;
  }
  tone(ac, dest, time, note(330 + (seed % 4) * 20), 0.28, 'sine', 0.04);
  tone(ac, dest, time + 0.32, note(415), 0.24, 'triangle', 0.035);
  return 1.6;
}

export function playScene(eventId: string, categories: Category[]): void {
  stopScene();
  const gen = generation;
  const ac = audio();
  const dest = ac.createGain();
  dest.gain.value = 0.9;
  dest.connect(ac.destination);
  bed = dest;
  const family = familyFor(eventId, categories);
  const seed = hash(eventId);
  const loop = () => {
    if (gen !== generation) return;
    const dur = renderBed(ac, dest, family, seed, ac.currentTime + 0.04);
    timer = window.setTimeout(loop, Math.max(280, dur * 1000 - 30));
  };
  loop();
}

function clickTick(ac: AudioContext, dest: AudioNode, time: number, pitch: number): void {
  noiseHit(ac, dest, time, 0.04, 0.06, 1800);
  tone(ac, dest, time, pitch, 0.07, 'triangle', 0.06);
}

export function playChoice(input: {
  eventId: string;
  choiceId: string;
  wild?: boolean;
  serious?: boolean;
  fatal?: boolean;
}): void {
  const ac = audio();
  const dest = ac.destination;
  const time = ac.currentTime + 0.01;
  const pitch = 480 + (hash(input.choiceId) % 7) * 40;
  clickTick(ac, dest, time, pitch);
  if (input.fatal || input.eventId === 'death') {
    stopScene();
    tone(ac, dest, time + 0.05, 196, 0.9, 'sine', 0.07);
    tone(ac, dest, time + 0.2, 146, 1.1, 'sine', 0.06);
    return;
  }
  if (input.eventId === 'intimacy' && (input.choiceId === 'protected' || input.choiceId === 'unprotected')) {
    ohYeah(ac, dest, time + 0.04, 0.11);
    return;
  }
  if (input.choiceId === 'drive') {
    tone(ac, dest, time + 0.05, 90, 0.35, 'sawtooth', 0.05, 55);
    return;
  }
  if (input.wild) {
    tone(ac, dest, time + 0.04, 420, 0.28, 'sine', 0.06, 880);
    return;
  }
  if (input.serious) {
    tone(ac, dest, time + 0.04, 220, 0.32, 'sine', 0.05);
    return;
  }
  tone(ac, dest, time + 0.04, 523, 0.16, 'triangle', 0.045);
  tone(ac, dest, time + 0.1, 659, 0.18, 'sine', 0.035);
}

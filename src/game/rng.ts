export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  chance(p: number): boolean;
  pick<T>(items: readonly T[]): T;
  range(min: number, max: number): number;
  state(): number;
}

function build(start: number): Rng {
  let a = start >>> 0;
  if (a === 0) a = 0x6d2b79f5;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min: number, max: number) {
      return min + Math.floor(next() * (max - min + 1));
    },
    chance(p: number) {
      return next() < p;
    },
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(next() * items.length)] as T;
    },
    range(min: number, max: number) {
      return min + next() * (max - min);
    },
    state() {
      return a >>> 0;
    },
  };
}

export function makeRng(seed: number): Rng {
  return build(seed);
}

export function restoreRng(state: number): Rng {
  return build(state);
}

export function weightedPick<T>(items: readonly T[], weight: (item: T) => number, rng: Rng): T {
  let total = 0;
  const weights = items.map((item) => {
    const w = Math.max(0, weight(item));
    total += w;
    return w;
  });
  if (total <= 0) return items[items.length - 1] as T;
  let roll = rng.next() * total;
  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i] ?? 0;
    if (roll <= 0) return items[i] as T;
  }
  return items[items.length - 1] as T;
}

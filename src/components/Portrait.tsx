import { lookSrc } from '../art/looks';
import type { GameState, PortraitSpec } from '../game/types';

export type Mood = 'ok' | 'strained' | 'bright' | 'worn' | 'solemn';

export function moodOf(state: GameState | null, dead = false): Mood {
  if (dead || state?.death) return 'solemn';
  if (!state) return 'ok';
  if (state.stats.health < 35 || state.stats.stress > 78) return 'worn';
  if (state.stats.happiness > 72 && state.stats.stress < 45) return 'bright';
  if (state.stats.stress > 60 || state.stats.happiness < 40) return 'strained';
  return 'ok';
}

export function Portrait({
  spec,
  mood = 'ok',
  size = 168,
  label = 'Portrait',
}: {
  spec: PortraitSpec;
  mood?: Mood;
  size?: number;
  label?: string;
}) {
  return (
    <img
      className={`portrait mood-${mood}`}
      src={lookSrc(spec)}
      width={size}
      height={size}
      alt={label}
      style={{ width: size, height: size }}
    />
  );
}

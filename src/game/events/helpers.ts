import { firstName } from '../names';
import { pronouns } from '../text';
import type { CastRole, GameState } from '../types';
import type { Choice, GameEvent, Outcome } from './types';

export function ev(event: GameEvent): GameEvent {
  return event;
}

export function say(
  id: string,
  label: string,
  text: string,
  outcome: Partial<Outcome> = {},
  meta?: {
    wild?: boolean;
    serious?: boolean;
    detail?: string;
    disabled?: Choice['disabled'];
  },
): Choice {
  return {
    id,
    label,
    detail: meta?.detail,
    wild: meta?.wild,
    serious: meta?.serious,
    disabled: meta?.disabled,
    resolve: () => ({ text, ...outcome }),
  };
}

export function who(state: GameState, role: CastRole) {
  const person = state.cast[role];
  return {
    person,
    name: firstName(person.name),
    p: pronouns(person.pronouns),
  };
}

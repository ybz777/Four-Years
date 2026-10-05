import type { GameEvent } from './events/types';
import type { GameState, PortraitSpec } from './types';

export interface SceneFigure {
  name: string;
  portrait: PortraitSpec;
  you?: boolean;
}

const UNNAMED = new Set([
  'lecture-nod',
  'career-fair',
  'club-fair',
  'future-leaders',
  'career-center',
]);

function mentioned(blob: string, fullName: string): boolean {
  const first = fullName.split(' ')[0] ?? '';
  if (first.length < 2) return false;
  const escaped = first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`).test(blob);
}

function strangerPortrait(seed: number, id: string): PortraitSpec {
  let n = seed >>> 0;
  for (let i = 0; i < id.length; i += 1) n = (Math.imul(n, 33) ^ id.charCodeAt(i)) >>> 0;
  return {
    skin: n % 6,
    hair: (n >>> 3) % 6,
    hairColor: (n >>> 6) % 6,
    face: (n >>> 9) % 3,
    shirt: (n >>> 11) % 7,
    accessory: (n >>> 14) % 5,
  };
}

export function peoplePresent(state: GameState, event: GameEvent | null): SceneFigure[] {
  if (!event) return [];
  const speaker = event.speaker?.(state) ?? null;
  const choiceText = event.choices(state).map((choice) => `${choice.label} ${choice.detail ?? ''}`).join('\n');
  const blob = [event.title, event.narration(state), speaker?.name ?? '', speaker?.line ?? '', choiceText].join('\n');
  const named = Object.values(state.cast).filter((person) => mentioned(blob, person.name));
  const lead = named[0];
  const other: SceneFigure | null = lead
    ? { name: lead.name, portrait: lead.portrait }
    : UNNAMED.has(event.id)
      ? { name: 'Someone nearby', portrait: strangerPortrait(state.seed, event.id) }
      : speaker?.portrait
        ? { name: speaker.name, portrait: speaker.portrait }
        : null;
  if (!other) return [];
  return [
    { name: state.character.name, portrait: state.character.portrait, you: true },
    other,
  ];
}

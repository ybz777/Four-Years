import type { GameState, TraitId } from './types';

export interface TraitDef {
  id: TraitId;
  name: string;
  blurb: string;
  stressMul: number;
  study: number;
  socialMul: number;
  spendMul: number;
  startStress: number;
  startHappiness: number;
  startSkills: number;
}

export const TRAITS: TraitDef[] = [
  {
    id: 'night-owl',
    name: 'Night owl',
    blurb: 'Your best ideas arrive after the library should have closed.',
    stressMul: 1,
    study: 1,
    socialMul: 1,
    spendMul: 1,
    startStress: 2,
    startHappiness: 0,
    startSkills: 0,
  },
  {
    id: 'people-pleaser',
    name: 'People pleaser',
    blurb: 'You say yes, then meet yourself later, tired.',
    stressMul: 1.12,
    study: -1,
    socialMul: 1.15,
    spendMul: 1.05,
    startStress: 4,
    startHappiness: 2,
    startSkills: 0,
  },
  {
    id: 'ambitious',
    name: 'Ambitious',
    blurb: 'You want a life that looks like a plan. Plans keep moving.',
    stressMul: 1.08,
    study: 2,
    socialMul: 1,
    spendMul: 1,
    startStress: 4,
    startHappiness: 0,
    startSkills: 2,
  },
  {
    id: 'anxious',
    name: 'Anxious',
    blurb: 'You prepare for disasters. Some of them happen. Some you invented.',
    stressMul: 1.28,
    study: 2,
    socialMul: 0.9,
    spendMul: 1,
    startStress: 10,
    startHappiness: -4,
    startSkills: 0,
  },
  {
    id: 'charming',
    name: 'Charming',
    blurb: 'People remember you. You are still not sure for what.',
    stressMul: 0.95,
    study: 0,
    socialMul: 1.25,
    spendMul: 1.08,
    startStress: -2,
    startHappiness: 4,
    startSkills: 0,
  },
  {
    id: 'blunt',
    name: 'Blunt',
    blurb: 'You tell the truth a half-second before the room is ready.',
    stressMul: 0.92,
    study: 0,
    socialMul: 0.88,
    spendMul: 1,
    startStress: -2,
    startHappiness: 0,
    startSkills: 1,
  },
  {
    id: 'frugal',
    name: 'Frugal',
    blurb: 'You can smell a fee. You still sometimes pay it.',
    stressMul: 1,
    study: 0,
    socialMul: 0.95,
    spendMul: 0.72,
    startStress: 0,
    startHappiness: 0,
    startSkills: 0,
  },
  {
    id: 'impulsive',
    name: 'Impulsive',
    blurb: 'Some of your best stories start with a terrible idea.',
    stressMul: 1,
    study: -1,
    socialMul: 1.05,
    spendMul: 1.12,
    startStress: 0,
    startHappiness: 3,
    startSkills: 0,
  },
  {
    id: 'bookish',
    name: 'Bookish',
    blurb: 'The library is not an escape. It is a habitat.',
    stressMul: 0.96,
    study: 3,
    socialMul: 0.9,
    spendMul: 0.95,
    startStress: 0,
    startHappiness: 1,
    startSkills: 2,
  },
  {
    id: 'resilient',
    name: 'Resilient',
    blurb: 'You bend further than people expect, and you notice when you do.',
    stressMul: 0.78,
    study: 1,
    socialMul: 1,
    spendMul: 1,
    startStress: -4,
    startHappiness: 2,
    startSkills: 0,
  },
  {
    id: 'competitive',
    name: 'Competitive',
    blurb: 'A curve is a story, and you would like a better part.',
    stressMul: 1.1,
    study: 2,
    socialMul: 0.92,
    spendMul: 1,
    startStress: 4,
    startHappiness: 0,
    startSkills: 1,
  },
  {
    id: 'lonely',
    name: 'Easily lonely',
    blurb: 'A full room can still leave you looking for one person.',
    stressMul: 1.08,
    study: 0,
    socialMul: 1.05,
    spendMul: 1,
    startStress: 4,
    startHappiness: -3,
    startSkills: 0,
  },
  {
    id: 'optimistic',
    name: 'Optimistic',
    blurb: 'You keep a little daylight even when the week is counterfeit.',
    stressMul: 0.9,
    study: 0,
    socialMul: 1.08,
    spendMul: 1,
    startStress: -3,
    startHappiness: 8,
    startSkills: 0,
  },
  {
    id: 'cynical',
    name: 'Cynical',
    blurb: 'You see the brochure and the invoice at the same time.',
    stressMul: 0.94,
    study: 1,
    socialMul: 0.86,
    spendMul: 0.96,
    startStress: 2,
    startHappiness: -2,
    startSkills: 1,
  },
  {
    id: 'caretaker',
    name: 'Caretaker',
    blurb: 'You notice who is not okay. It costs you, and it matters.',
    stressMul: 1.1,
    study: -1,
    socialMul: 1.12,
    spendMul: 1.04,
    startStress: 3,
    startHappiness: 2,
    startSkills: 0,
  },
];

const BY_ID = new Map(TRAITS.map((trait) => [trait.id, trait]));

export function traitById(id: TraitId): TraitDef {
  const trait = BY_ID.get(id);
  if (!trait) throw new Error(`Unknown trait ${id}`);
  return trait;
}

export function traitList(ids: readonly TraitId[]): TraitDef[] {
  return ids.map((id) => traitById(id));
}

export function hasTrait(state: GameState, id: TraitId): boolean {
  return state.character.traitIds.includes(id);
}

export function stressMultiplier(ids: readonly TraitId[]): number {
  return traitList(ids).reduce((acc, trait) => acc * trait.stressMul, 1);
}

export function socialMultiplier(ids: readonly TraitId[]): number {
  return traitList(ids).reduce((acc, trait) => acc * trait.socialMul, 1);
}

export function spendMultiplier(ids: readonly TraitId[]): number {
  return traitList(ids).reduce((acc, trait) => acc * trait.spendMul, 1);
}

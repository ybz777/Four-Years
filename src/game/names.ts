import { LOOKS, portraitFor } from '../art/looks';
import type { PortraitSpec, PronounId } from './types';
import type { Rng } from './rng';

export interface RolledPerson {
  name: string;
  pronouns: PronounId;
  portrait: PortraitSpec;
}

export function rollPerson(rng: Rng, taken: Set<string>, usedLooks: Set<string> = new Set()): RolledPerson {
  const open = LOOKS.filter((look) => !usedLooks.has(look.id));
  const pool = open.length > 0 ? open : LOOKS;
  const look = rng.pick(pool);
  usedLooks.add(look.id);
  let name = `${rng.pick(look.first)} ${rng.pick(look.last)}`;
  for (let attempt = 0; attempt < 8 && taken.has(name); attempt += 1) {
    name = `${rng.pick(look.first)} ${rng.pick(look.last)}`;
  }
  if (taken.has(name)) name = `${name} ${rng.int(2, 9)}`;
  taken.add(name);
  return { name, pronouns: look.pronouns, portrait: portraitFor(look) };
}

export function firstName(full: string): string {
  return full.split(' ')[0] ?? full;
}

import { backgroundById } from './backgrounds';
import { majorById, MAJORS } from './majors';
import { rollPerson } from './names';
import { makeRng } from './rng';
import { TRAITS } from './traits';
import type { BackgroundId, LifeDraft, MajorId, PortraitSpec, PronounId, TraitId } from './types';

export function luckFor(seed: number): number {
  return makeRng(seed ^ 0x85ebca6b).int(-4, 4);
}

export function carFor(backgroundId: BackgroundId, seed: number): boolean {
  const rng = makeRng((seed ^ 0x9e3779b9) >>> 0);
  return rng.chance(backgroundById(backgroundId).carChance);
}

export function rollLife(seed = (Date.now() ^ (Math.floor(Math.random() * 0xffffffff))) >>> 0): LifeDraft {
  const rng = makeRng(seed);
  const traits = [...TRAITS];
  const picked: TraitId[] = [];
  while (picked.length < 3) {
    const index = rng.int(0, traits.length - 1);
    const trait = traits.splice(index, 1)[0];
    if (trait) picked.push(trait.id);
  }
  const major = rng.pick(MAJORS).id;
  const backgrounds: BackgroundId[] = ['low', 'lower-middle', 'middle', 'upper-middle', 'wealthy'];
  const backgroundId = rng.pick(backgrounds);
  const person = rollPerson(rng, new Set());
  return {
    name: person.name,
    pronouns: person.pronouns,
    majorId: major,
    backgroundId,
    traitIds: [picked[0] as TraitId, picked[1] as TraitId, picked[2] as TraitId],
    seed,
    portrait: person.portrait,
    hasCar: carFor(backgroundId, seed),
    luck: luckFor(seed),
  };
}

export function shuffleTraits(draft: LifeDraft): LifeDraft {
  const rng = makeRng((Math.floor(Math.random() * 0xffffffff) ^ draft.seed) >>> 0);
  const pool = TRAITS.filter((trait) => !draft.traitIds.includes(trait.id));
  const next = rng.pick(pool);
  const slot = rng.int(0, 2);
  const traitIds: [TraitId, TraitId, TraitId] = [...draft.traitIds];
  traitIds[slot] = next.id;
  return { ...draft, traitIds };
}

export function withMajor(draft: LifeDraft, majorId: MajorId): LifeDraft {
  return { ...draft, majorId };
}

export function withBackground(draft: LifeDraft, backgroundId: BackgroundId): LifeDraft {
  return { ...draft, backgroundId, hasCar: carFor(backgroundId, draft.seed) };
}

export function withPronouns(draft: LifeDraft, pronouns: PronounId): LifeDraft {
  return { ...draft, pronouns };
}

export function withName(draft: LifeDraft, name: string): LifeDraft {
  return { ...draft, name };
}

export function withPortrait(draft: LifeDraft, portrait: PortraitSpec): LifeDraft {
  return { ...draft, portrait };
}

export function majorBlurb(id: MajorId): string {
  return majorById(id).blurb;
}

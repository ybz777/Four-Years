import { clamp } from './rng';
import { yearName } from './text';
import { socialMultiplier, spendMultiplier, stressMultiplier } from './traits';
import type { Effect, GameState, RelChange, Tone } from './types';

export function tuneEffect(state: GameState, effect: Effect): Effect {
  const next: Effect = { ...effect };
  if ((next.stress ?? 0) > 0) next.stress = (next.stress ?? 0) * stressMultiplier(state.character.traitIds);
  if ((next.stress ?? 0) < 0 && stressMultiplier(state.character.traitIds) < 1) {
    next.stress = (next.stress ?? 0) * 1.08;
  }
  if ((next.social ?? 0) > 0) next.social = (next.social ?? 0) * socialMultiplier(state.character.traitIds);
  if ((next.money ?? 0) < 0) next.money = (next.money ?? 0) * spendMultiplier(state.character.traitIds);
  return next;
}

export function applyEffect(state: GameState, raw: Effect | undefined): void {
  if (!raw) return;
  const effect = tuneEffect(state, raw);
  const stats = state.stats;
  if (effect.energy) stats.energy = clamp(stats.energy + effect.energy, 0, 100);
  if (effect.stress) stats.stress = clamp(stats.stress + effect.stress, 0, 100);
  if (effect.health) stats.health = clamp(stats.health + effect.health, 0, 100);
  if (effect.happiness) stats.happiness = clamp(stats.happiness + effect.happiness, 0, 100);
  if (effect.social) stats.social = clamp(stats.social + effect.social, 0, 100);
  if (effect.reputation) stats.reputation = clamp(stats.reputation + effect.reputation, 0, 100);
  if (effect.skills) stats.skills = clamp(stats.skills + effect.skills, 0, 100);
  if (effect.network) stats.network = clamp(stats.network + effect.network, 0, 100);
  if (effect.money) state.money += effect.money;
  if (effect.debt) state.debt = Math.max(0, state.debt + effect.debt);
  if (effect.termScore) state.termScore = clamp(state.termScore + effect.termScore, 0, 100);
  if (stats.health <= 0) {
    stats.health = 10;
    if (!state.queue.includes('medical-crisis') && !state.seen.includes('medical-crisis')) {
      state.queue.push('medical-crisis');
    }
  }
}

export function applyRelations(state: GameState, changes: RelChange[] | undefined): void {
  if (!changes) return;
  for (const change of changes) {
    const person = state.cast[change.who];
    if (change.known) person.known = true;
    if (change.archetype) person.archetype = change.archetype;
    if (change.affection) person.affection = clamp(person.affection + change.affection, -100, 100);
    if (change.trust) person.trust = clamp(person.trust + change.trust, -100, 100);
    if (change.memory) {
      person.memories.push(change.memory);
      if (person.memories.length > 4) person.memories.shift();
    }
  }
}

export function addMemory(state: GameState, text: string, tone: Tone, highlight = false): void {
  state.memories.push({
    year: state.time.year,
    term: state.time.term,
    yearLabel: yearName(state.time.year),
    text,
    tone,
    highlight,
  });
  if (state.memories.length > 32) {
    const idx = state.memories.findIndex((memory) => !memory.highlight);
    if (idx >= 0) state.memories.splice(idx, 1);
    else state.memories.shift();
  }
}

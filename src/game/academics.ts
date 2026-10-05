import { addMemory } from './effects';
import { majorById } from './majors';
import { clamp, type Rng } from './rng';
import { gpaText, termLabel, yearName } from './text';
import { hasTrait, traitList } from './traits';
import type { GameState } from './types';

export function scoreToGpa(score: number): number {
  const g = (clamp(score, 0, 100) / 100) * 4.15 - 0.15;
  return clamp(Math.round(g * 100) / 100, 0, 4);
}

export function beginTerm(state: GameState): void {
  const major = majorById(state.character.majorId);
  let score = 87 - major.difficulty;
  for (const trait of traitList(state.character.traitIds)) score += trait.study;
  score += state.character.luck * 0.35;
  if (state.stats.stress > 74) score -= 5;
  if (state.stats.health < 40) score -= 4;
  if (state.pregnant) score -= 3;
  if (state.job?.load === 'heavy') score -= 4;
  if (state.job?.load === 'medium') score -= 2;
  if (hasTrait(state, 'night-owl') && state.stats.energy < 30) score -= 2;
  state.termScore = clamp(score, 35, 96);
}

export type TermStatus = 'ok' | 'probation' | 'dismissed';

export function resolveTerm(state: GameState, rng: Rng): TermStatus {
  let score = state.termScore + rng.int(-2, 2) + state.character.luck * 0.25;
  if (state.job?.load === 'heavy') score -= 5;
  else if (state.job?.load === 'medium') score -= 2;
  if (state.job?.research) score += 3;
  if (state.stats.stress > 82) score -= 4;
  if (state.stats.energy < 20) score -= 3;
  const gpa = scoreToGpa(score);
  const credits = 15;
  state.qualityPoints += gpa * credits;
  state.credits += credits;
  state.gpa = Math.round((state.qualityPoints / state.credits) * 100) / 100;
  const label = `${yearName(state.time.year)} ${termLabel(state.time.term)}`;
  state.terms.push({ label, gpa });
  state.banner = `${label} GPA ${gpaText(gpa)} · Cumulative ${gpaText(state.gpa)}`;
  if (gpa >= 3.7) {
    addMemory(state, `${label} ended at a ${gpaText(gpa)}. You did not announce it. You did sleep.`, 'warm', true);
  } else if (gpa < 2) {
    addMemory(state, `${label} landed at a ${gpaText(gpa)}. The number sat in the portal like a weather report.`, 'brutal', true);
  }

  let status: TermStatus = 'ok';
  if (gpa < 1.35) {
    if (state.probation) status = 'dismissed';
    else {
      state.probation = true;
      status = 'probation';
      state.queue.push('probation-letter');
    }
  } else if (state.probation && gpa >= 2.5) {
    state.probation = false;
  }
  return status;
}

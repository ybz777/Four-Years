import type { Archetype, GameState } from './types';
import { dollars, gpaText } from './text';

export function conditionLine(state: GameState): string {
  if (state.death) return 'The week stops here.';
  if (state.stats.health < 32) return 'You feel genuinely unwell.';
  if (state.pregnant) return 'You are carrying more than a schedule.';
  if (state.child) return 'A future person is already rearranging the plan.';
  if (state.stats.stress > 82 && state.money < 150) return 'Broke, and buzzing with it.';
  if (state.stats.stress > 82) return 'Your jaw hurts from not unclenching.';
  if (state.money < 40) return 'Your account is mostly a rumor.';
  if (state.probation) return 'The university is watching your grades with a polite expression.';
  if (state.stats.happiness > 76 && state.stats.stress < 42) return 'For a moment, it feels like the brochure.';
  if (state.stage === 'dating' || state.stage === 'serious') return 'Someone texts you back on purpose.';
  if (state.job) return 'You work. The syllabus does not care.';
  if (state.stats.happiness < 34) return 'The weeks taste like cardboard.';
  if (state.stats.energy < 25) return 'You are upright. That is the achievement.';
  return 'You are enrolled, which is not the same thing as okay.';
}

export function bondWord(affection: number): string {
  if (affection > 70) return 'Close';
  if (affection > 40) return 'Warm';
  if (affection > 12) return 'Familiar';
  if (affection > -12) return 'Unsteady';
  return 'Strained';
}

export function archetypeLabel(archetype: Archetype): string {
  switch (archetype) {
    case 'genuine':
      return 'Actually your friend';
    case 'casual':
      return 'Around, pleasantly';
    case 'network':
      return 'Would love to connect';
    case 'party':
      return 'Knows you after dark';
    case 'academic':
      return 'Study ally';
    case 'romantic':
      return 'Romantic';
    case 'manipulative':
      return 'Keeps needing things';
    case 'mentor':
      return 'Mentor';
    case 'awkward':
      return 'Awkward, ongoing';
    case 'roommate':
      return 'Roommate';
    case 'former':
      return 'Former';
    default:
      return 'Someone';
  }
}

export function describeDeltas(before: GameState, after: GameState): string[] {
  const lines: string[] = [];
  const money = Math.round(after.money - before.money);
  if (Math.abs(money) >= 1) lines.push(money > 0 ? `Money +${dollars(money)}` : `Money −${dollars(money)}`);
  const debt = Math.round(after.debt - before.debt);
  if (Math.abs(debt) >= 1) lines.push(debt > 0 ? `Debt +${dollars(debt)}` : `Debt −${dollars(-debt)}`);
  const pairs: [keyof GameState['stats'], string][] = [
    ['stress', 'Stress'],
    ['energy', 'Energy'],
    ['health', 'Health'],
    ['happiness', 'Mood'],
    ['social', 'Social'],
    ['skills', 'Skill'],
    ['network', 'Network'],
    ['reputation', 'Reputation'],
  ];
  for (const [key, label] of pairs) {
    const delta = Math.round(after.stats[key] - before.stats[key]);
    if (Math.abs(delta) >= 2) lines.push(`${label} ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`);
  }
  const grades = Math.round(after.termScore - before.termScore);
  if (Math.abs(grades) >= 2 && after.time.term !== 'summer') {
    lines.push(grades > 0 ? 'Grades lift' : 'Grades slip');
  }
  if (before.gpa !== after.gpa && after.gpa !== null) lines.push(`GPA ${gpaText(after.gpa)}`);
  if (!before.job && after.job) lines.push(after.job.title);
  if (before.job && !after.job) lines.push('You stop working');
  if (before.stage !== after.stage && after.stage === 'dating') lines.push('You are seeing someone');
  if (before.stage !== after.stage && after.stage === 'ex') lines.push('A relationship ends');
  return lines.slice(0, 5);
}

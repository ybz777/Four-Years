import type { Focus, GameTime, Term } from './types';
import { yearName } from './text';

export interface BeatTemplate {
  term: Term;
  week: number;
  label: string;
  focus: Focus;
  span: number;
}

export const YEAR_TEMPLATE: BeatTemplate[] = [
  { term: 'fall', week: 1, label: 'Move-in week', focus: 'arrival', span: 1 },
  { term: 'fall', week: 6, label: 'September', focus: 'life', span: 5 },
  { term: 'fall', week: 10, label: 'Midterms', focus: 'midterm', span: 4 },
  { term: 'fall', week: 15, label: 'Finals', focus: 'finals', span: 5 },
  { term: 'spring', week: 4, label: 'February', focus: 'life', span: 7 },
  { term: 'spring', week: 9, label: 'March', focus: 'midterm', span: 5 },
  { term: 'spring', week: 15, label: 'May', focus: 'finals', span: 6 },
  { term: 'summer', week: 7, label: 'Summer', focus: 'summer', span: 12 },
];

export interface Beat extends BeatTemplate {
  year: 1 | 2 | 3 | 4;
}

export const CALENDAR: Beat[] = [];

for (let year = 1; year <= 4; year += 1) {
  for (const beat of YEAR_TEMPLATE) {
    if (year === 4 && beat.focus === 'summer') continue;
    CALENDAR.push({ ...beat, year: year as 1 | 2 | 3 | 4 });
  }
}

export function ageFor(year: number, term: Term): number {
  if (year === 1 && term === 'fall') return 18;
  if (year === 1) return 19;
  if (year === 2 && term === 'fall') return 19;
  if (year === 2) return 20;
  if (year === 3 && term === 'fall') return 20;
  if (year === 3) return 21;
  if (year === 4 && term === 'fall') return 21;
  return 22;
}

export function toTime(beat: Beat): GameTime {
  return {
    year: beat.year,
    term: beat.term,
    week: beat.week,
    label: beat.label,
    focus: beat.focus,
    age: ageFor(beat.year, beat.term),
    span: beat.span,
  };
}

export function dateLine(time: GameTime): string {
  return `${yearName(time.year)} · ${time.label} · Week ${time.week}`;
}

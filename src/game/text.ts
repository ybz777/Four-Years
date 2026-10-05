import type { PronounId } from './types';

export function dollars(n: number): string {
  const rounded = Math.round(Math.abs(n));
  const body = `$${rounded.toLocaleString('en-US')}`;
  return n < 0 ? `−${body}` : body;
}

export function gpaText(gpa: number | null): string {
  if (gpa === null || Number.isNaN(gpa)) return '—';
  return gpa.toFixed(2);
}

export interface PronounSet {
  sub: string;
  obj: string;
  pos: string;
  cap: string;
}

export function pronouns(id: PronounId): PronounSet {
  if (id === 'she') return { sub: 'she', obj: 'her', pos: 'her', cap: 'She' };
  if (id === 'he') return { sub: 'he', obj: 'him', pos: 'his', cap: 'He' };
  return { sub: 'they', obj: 'them', pos: 'their', cap: 'They' };
}

export function yearName(year: number): string {
  return ['', 'Freshman', 'Sophomore', 'Junior', 'Senior'][year] ?? 'College';
}

export function termLabel(term: string): string {
  if (term === 'fall') return 'Fall';
  if (term === 'spring') return 'Spring';
  if (term === 'summer') return 'Summer';
  return 'Winter';
}

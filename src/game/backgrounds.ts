import type { BackgroundId } from './types';

export interface BackgroundDef {
  id: BackgroundId;
  name: string;
  blurb: string;
  aid: number;
  parentShare: number;
  rentHelp: number;
  allowance: number;
  weeklySpend: number;
  startCash: number;
  emergency: number;
  carChance: number;
  connections: number;
  startSkills: number;
  startStress: number;
  unpaidEase: number;
}

export const BACKGROUNDS: BackgroundDef[] = [
  {
    id: 'low',
    name: 'Low income',
    blurb: 'Aid helps. It does not introduce itself to your landlord. You will work, and that work will teach you things a classroom will take credit for.',
    aid: 0.78,
    parentShare: 0,
    rentHelp: 0,
    allowance: 0,
    weeklySpend: 78,
    startCash: 280,
    emergency: 0.06,
    carChance: 0.14,
    connections: 0,
    startSkills: 10,
    startStress: 12,
    unpaidEase: 0.08,
  },
  {
    id: 'lower-middle',
    name: 'Lower middle class',
    blurb: 'Your family helps when they can, which is a different calendar from the one the bursar uses.',
    aid: 0.5,
    parentShare: 0.08,
    rentHelp: 0.05,
    allowance: 20,
    weeklySpend: 96,
    startCash: 900,
    emergency: 0.16,
    carChance: 0.32,
    connections: 2,
    startSkills: 6,
    startStress: 8,
    unpaidEase: 0.18,
  },
  {
    id: 'middle',
    name: 'Middle class',
    blurb: 'Enough of a net to feel it catch you, and holes wide enough to fall through while explaining that you are fine.',
    aid: 0.36,
    parentShare: 0.3,
    rentHelp: 0.15,
    allowance: 55,
    weeklySpend: 130,
    startCash: 2400,
    emergency: 0.28,
    carChance: 0.5,
    connections: 4,
    startSkills: 3,
    startStress: 4,
    unpaidEase: 0.4,
  },
  {
    id: 'upper-middle',
    name: 'Upper middle class',
    blurb: 'Comfort with a ceiling. Unpaid summers get easier. So does the story that you did it all yourself.',
    aid: 0.1,
    parentShare: 0.55,
    rentHelp: 0.45,
    allowance: 160,
    weeklySpend: 185,
    startCash: 6200,
    emergency: 0.5,
    carChance: 0.72,
    connections: 8,
    startSkills: 2,
    startStress: 2,
    unpaidEase: 0.72,
  },
  {
    id: 'wealthy',
    name: 'Wealthy',
    blurb: 'Emergencies have a phone number. Purpose does not. Money will not attend class, sit the interview, or make anyone actually like you.',
    aid: 0,
    parentShare: 0.9,
    rentHelp: 0.85,
    allowance: 420,
    weeklySpend: 260,
    startCash: 12000,
    emergency: 0.82,
    carChance: 0.88,
    connections: 12,
    startSkills: 0,
    startStress: 0,
    unpaidEase: 0.9,
  },
];

const BY_ID = new Map(BACKGROUNDS.map((background) => [background.id, background]));

export function backgroundById(id: BackgroundId): BackgroundDef {
  const background = BY_ID.get(id);
  if (!background) throw new Error(`Unknown background ${id}`);
  return background;
}

import { backgroundById } from './backgrounds';
import { clamp } from './rng';
import { dollars } from './text';
import type { GameState } from './types';

const TUITION = 27600;
const FEES = 2140;
const DORM = 9600;
const MEAL = 5400;

export function postAnnualBill(state: GameState): string {
  const background = backgroundById(state.character.backgroundId);
  if (state.time.year > 1) {
    const interest = Math.round(state.debt * 0.055);
    state.debt += interest;
  }
  const housing = state.housing.kind === 'dorm' ? DORM + MEAL : 0;
  const gross = TUITION + FEES + housing;
  const aid = Math.round(gross * background.aid);
  const afterAid = gross - aid;
  const parent = Math.round(afterAid * background.parentShare);
  const due = afterAid - parent;
  let pocket = 0;
  if (due > 0 && state.money > due + background.weeklySpend * 6) {
    pocket = due;
    state.money -= due;
  } else if (due > 0) {
    state.debt += due;
  }
  const owed = due - pocket;
  return `The fall ledger posts ${dollars(gross)}. Aid covers ${dollars(aid)}. Family covers ${dollars(parent)}. ${
    owed > 0 ? `${dollars(owed)} learns your name as debt.` : 'You pay the remainder before it can introduce itself.'
  }`;
}

export function applyWeeks(state: GameState, weeks: number): string | null {
  if (weeks <= 0) return null;
  const background = backgroundById(state.character.backgroundId);
  let burn = background.weeklySpend * weeks;
  let income = background.allowance * weeks;
  if (state.housing.kind === 'apartment') {
    const help = background.rentHelp;
    const weeklyRent = state.housing.rent / 4;
    burn += weeklyRent * (1 - help) * weeks;
  }
  if (state.pregnant) burn += 48 * weeks;
  if (state.job) {
    income += state.job.weekly * weeks;
    state.stats.stress = clamp(state.stats.stress + state.job.stress * weeks * 0.28, 0, 100);
    state.stats.skills = clamp(state.stats.skills + state.job.skill * weeks * 0.2, 0, 100);
    const drain = state.job.load === 'heavy' ? 0.85 : state.job.load === 'medium' ? 0.45 : 0.2;
    state.stats.energy = clamp(state.stats.energy - drain * weeks, 0, 100);
    if (state.job.research) state.research = true;
  } else {
    state.stats.energy = clamp(state.stats.energy + weeks * 0.45, 0, 100);
  }
  state.money += income - burn;
  state.weeksLived += weeks;
  let note: string | null = null;
  if (state.money < -500) {
    const moved = Math.round(-state.money);
    state.debt += moved + 35;
    state.money = 0;
    state.stats.stress = clamp(state.stats.stress + 7, 0, 100);
    note = 'A card declines. The balance moves somewhere that charges interest for the privilege.';
  }
  const pressure = state.money < 120 ? 0.55 : state.money > 4000 ? -0.12 : -0.05;
  state.stats.stress = clamp(state.stats.stress + pressure * weeks, 0, 100);
  const mood = state.stats.stress > 78 ? -0.4 : 0.08;
  state.stats.happiness = clamp(state.stats.happiness + mood * weeks, 0, 100);
  if (state.stats.health < 100 && state.stats.health > 0) {
    state.stats.health = clamp(state.stats.health + 0.3 * weeks, 0, 100);
  }
  return note;
}

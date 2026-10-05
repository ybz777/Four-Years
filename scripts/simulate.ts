import { choose, continueGame, currentChoices, startGame } from '../src/game/engine';
import { rollLife } from '../src/game/create';
function play(seed: number, style: 'steady' | 'chaos' | 'careful') {
  let state = startGame(rollLife(seed));
  for (let step = 0; step < 80; step += 1) {
    if (state.phase === 'ending' || state.phase === 'dead') break;
    if (state.phase === 'outcome') {
      state = continueGame(state);
      continue;
    }
    const choices = currentChoices(state).filter((choice) => !choice.disabled?.(state));
    if (!choices.length) break;
    let choice = choices[0]!;
    if (style === 'chaos') {
      const wild = choices.find((item) => item.wild);
      const serious = choices.find((item) => item.serious);
      choice = wild ?? serious ?? choices[choices.length - 1]!;
    } else if (style === 'careful') {
      choice = choices.find((item) => !item.wild && !item.serious) ?? choices[0]!;
    } else {
      const pool = choices.filter((item) => !item.wild);
      const index = seed + step;
      choice = pool[index % pool.length] ?? choices[0]!;
    }
    state = choose(state, choice.id);
  }
  return state;
}

function main() {
  const tallies: Record<string, number> = {};
  const byStyle: Record<string, Record<string, number>> = {};
  let deaths = 0;
  let stuck = 0;
  let violent = 0;
  let pursued = 0;
  let admits = 0;
  let offers = 0;
  const byBg: Record<string, { n: number; debt: number; gpa: number; employed: number; grad: number }> = {};
  for (let i = 1; i <= 40; i += 1) {
    for (const style of ['steady', 'careful', 'chaos'] as const) {
      const state = play(i * 97 + style.length * 13, style);
      const key = state.ending?.kind ?? state.phase;
      tallies[key] = (tallies[key] ?? 0) + 1;
      byStyle[style] = byStyle[style] ?? {};
      byStyle[style][key] = (byStyle[style][key] ?? 0) + 1;
      if (state.death) deaths += 1;
      if (state.seen.some((id) => id === 'public-incident' || id === 'night-walk')) violent += 1;
      if (state.gradIntent > 0) pursued += 1;
      if (state.outlook?.grad) admits += 1;
      if (state.outlook?.offer) offers += 1;
      if (state.phase !== 'ending' && state.phase !== 'dead') stuck += 1;
      const bg = state.character.backgroundId;
      const row = byBg[bg] ?? { n: 0, debt: 0, gpa: 0, employed: 0, grad: 0 };
      row.n += 1;
      row.debt += state.debt;
      row.gpa += state.gpa ?? 0;
      if (state.ending?.kind === 'employed') row.employed += 1;
      if (state.ending?.kind === 'gradschool') row.grad += 1;
      byBg[bg] = row;
    }
  }
  console.log('endings', tallies, 'deaths', deaths, 'stuck', stuck, 'sawViolence', violent, 'pursuedGrad', pursued, 'admits', admits, 'offers', offers);
  console.log('byStyle', byStyle);
  for (const [bg, row] of Object.entries(byBg)) {
    console.log(bg, 'avgDebt', Math.round(row.debt / row.n), 'avgGpa', (row.gpa / row.n).toFixed(2), 'jobRate', (row.employed / row.n).toFixed(2), 'gradRate', (row.grad / row.n).toFixed(2));
  }
}

main();

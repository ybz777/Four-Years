import { beginTerm, resolveTerm } from './academics';
import { backgroundById } from './backgrounds';
import { CALENDAR, toTime } from './calendar';
import { carFor, luckFor } from './create';
import { addMemory, applyEffect, applyRelations } from './effects';
import { applyWeeks, postAnnualBill } from './economy';
import { EVENTS, fallbackEvent } from './events';
import type { GameEvent, Outcome } from './events/types';
import {
  assess,
  buildDeathEnding,
  buildEnding,
  ceremonyEvent,
  crossroadsEvent,
  dismissalLetter,
} from './finale';
import { assignApartment, assignDorm } from './housing';
import { ambientWeather, seasonFor } from './locations';
import { MAJORS } from './majors';
import { rollPerson } from './names';
import { describeDeltas } from './presentation';
import { clamp, makeRng, restoreRng, weightedPick, type Rng } from './rng';
import { traitList } from './traits';
import type { Archetype, Cast, CastRole, GameState, LifeDraft, Person, PortraitSpec } from './types';

const MAP = new Map<string, GameEvent>(EVENTS.map((event) => [event.id, event]));
MAP.set(ceremonyEvent.id, ceremonyEvent);
MAP.set(crossroadsEvent.id, crossroadsEvent);
MAP.set(fallbackEvent.id, fallbackEvent);

export function getEvent(id: string): GameEvent {
  const event = MAP.get(id);
  if (!event) throw new Error(`Missing event ${id}`);
  return event;
}

function makePerson(
  rng: Rng,
  taken: Set<string>,
  usedLooks: Set<string>,
  role: CastRole,
  archetype: Archetype,
  known: boolean,
  affection: number,
  trust: number,
): Person {
  const rolled = rollPerson(rng, taken, usedLooks);
  return {
    name: rolled.name,
    pronouns: rolled.pronouns,
    role,
    archetype,
    affection,
    trust,
    known,
    memories: [],
    portrait: rolled.portrait,
  };
}

function makeCast(rng: Rng, playerName: string, playerLook?: string): Cast {
  const taken = new Set<string>([playerName]);
  const usedLooks = new Set<string>();
  if (playerLook) usedLooks.add(playerLook);
  return {
    roommate: makePerson(rng, taken, usedLooks, 'roommate', 'roommate', true, 12, 8),
    friend: makePerson(rng, taken, usedLooks, 'friend', 'genuine', true, 24, 18),
    network: makePerson(rng, taken, usedLooks, 'network', 'network', true, 10, 2),
    interest: makePerson(rng, taken, usedLooks, 'interest', 'awkward', false, 0, 0),
    mentor: makePerson(rng, taken, usedLooks, 'mentor', 'mentor', true, 8, 6),
  };
}

function blankState(draft: LifeDraft, rng: Rng): GameState {
  const background = backgroundById(draft.backgroundId);
  const traits = traitList(draft.traitIds);
  const stress = clamp(
    34 + background.startStress + traits.reduce((sum, trait) => sum + trait.startStress, 0),
    0,
    100,
  );
  const happiness = clamp(
    58 + traits.reduce((sum, trait) => sum + trait.startHappiness, 0) - Math.max(0, background.startStress - 4),
    0,
    100,
  );
  const portrait: PortraitSpec = draft.portrait;
  return {
    version: 1,
    seed: draft.seed,
    rng: rng.state(),
    phase: 'play',
    finale: 'none',
    beatIndex: 0,
    time: toTime(CALENDAR[0]!),
    character: {
      name: draft.name.trim() || 'Alex Morgan',
      pronouns: draft.pronouns,
      majorId: draft.majorId,
      backgroundId: draft.backgroundId,
      traitIds: [...draft.traitIds],
      portrait,
      hasCar: draft.hasCar,
      luck: draft.luck,
    },
    stats: {
      energy: 72,
      stress,
      health: 82,
      happiness,
      social: 42,
      reputation: 36,
      skills: clamp(8 + background.startSkills + traits.reduce((sum, trait) => sum + trait.startSkills, 0), 0, 100),
      network: clamp(8 + background.connections, 0, 100),
    },
    money: background.startCash,
    debt: 0,
    gpa: null,
    credits: 0,
    qualityPoints: 0,
    termScore: 80,
    terms: [],
    probation: false,
    housing: assignDorm(rng),
    job: null,
    jobsHeld: [],
    cast: makeCast(rng, draft.name, draft.portrait.look),
    stage: 'none',
    flags: {},
    seen: [],
    recent: [],
    lastCategories: [],
    queue: [],
    currentEventId: 'move-in',
    sceneLocation: 'dorm',
    sceneWeather: 'golden',
    outcome: null,
    memories: [],
    internships: [],
    projects: 0,
    applications: 0,
    interviews: 0,
    ghosts: 0,
    offers: 0,
    gradIntent: 0,
    recommendations: 0,
    research: false,
    pregnant: false,
    child: false,
    record: false,
    clubs: [],
    ties: 0,
    hospitalizations: 0,
    banner: null,
    upkeepNote: null,
    weeksLived: 0,
    outlook: null,
    ending: null,
    death: null,
  };
}

function eligible(event: GameEvent, state: GameState, respectRecent: boolean): boolean {
  if (event.weight <= 0) return false;
  if (event.once && state.seen.includes(event.id)) return false;
  if (respectRecent && state.recent.includes(event.id)) return false;
  if (event.years && !event.years.includes(state.time.year)) return false;
  if (event.terms && !event.terms.includes(state.time.term)) return false;
  if (event.when && !event.when(state)) return false;
  return true;
}

function adjustedWeight(event: GameEvent, state: GameState): number {
  let weight = event.weight;
  const primary = event.categories[0];
  if (primary && state.lastCategories.includes(primary)) weight *= 0.42;
  if (state.money < 120 && event.categories.includes('money')) weight *= 1.35;
  if (state.housing.kind === 'apartment' && event.categories.includes('housing')) weight *= 1.2;
  if (state.time.year >= 3 && event.categories.includes('career')) weight *= 1.25;
  if ((state.stage === 'dating' || state.stage === 'serious') && event.categories.includes('dating')) weight *= 1.3;
  if (state.pregnant && event.categories.includes('risk')) weight *= 0.45;
  return weight;
}

function enterEvent(state: GameState, event: GameEvent, rng: Rng): void {
  state.currentEventId = event.id;
  if (event.once && !state.seen.includes(event.id)) state.seen.push(event.id);
  state.recent.push(event.id);
  state.recent = state.recent.slice(-5);
  const primary = event.categories[0];
  if (primary) {
    state.lastCategories.unshift(primary);
    state.lastCategories = state.lastCategories.slice(0, 3);
  }
  const location = typeof event.location === 'function' ? event.location(state) : event.location;
  state.sceneLocation = location;
  if (typeof event.weather === 'function') state.sceneWeather = event.weather(state, rng);
  else if (event.weather) state.sceneWeather = event.weather;
  else state.sceneWeather = ambientWeather(seasonFor(state.time.term, state.time.week), location, rng);
}

function takeQueued(state: GameState): GameEvent | null {
  while (state.queue.length) {
    const id = state.queue.shift();
    if (!id) break;
    const event = MAP.get(id);
    if (!event) continue;
    if (event.once && state.seen.includes(event.id)) continue;
    return event;
  }
  return null;
}

function pickEvent(state: GameState, rng: Rng): GameEvent {
  const queued = takeQueued(state);
  if (queued) return queued;
  let pool = EVENTS.filter((event) => eligible(event, state, true));
  if (!pool.length) pool = EVENTS.filter((event) => eligible(event, state, false));
  const focused = pool.filter((event) => event.focuses?.includes(state.time.focus));
  if (focused.length) pool = focused;
  else pool = pool.filter((event) => !event.focuses || event.focuses.includes(state.time.focus));
  if (!pool.length) return fallbackEvent;
  return weightedPick(pool, (event) => adjustedWeight(event, state), rng);
}

function applyOutcome(state: GameState, outcome: Outcome): void {
  if (outcome.fatal) {
    state.death = outcome.fatal;
    if (outcome.memory) addMemory(state, outcome.memory, outcome.tone ?? 'serious', true);
    return;
  }
  applyEffect(state, outcome.effects);
  applyRelations(state, outcome.rel);
  if (outcome.memory) addMemory(state, outcome.memory, outcome.tone ?? 'serious', Boolean(outcome.highlight));
  if (outcome.flags) {
    for (const [key, value] of Object.entries(outcome.flags)) {
      if (key === 'rentBump' && typeof value === 'number') state.housing.rent += value;
      state.flags[key] = value;
    }
  }
  if (outcome.queue) {
    for (const id of outcome.queue) {
      if (id && !state.queue.includes(id)) state.queue.push(id);
    }
  }
  if ('job' in outcome) {
    state.job = outcome.job ?? null;
    if (state.job && !state.jobsHeld.includes(state.job.title)) state.jobsHeld.push(state.job.title);
  }
  if (outcome.stage) state.stage = outcome.stage;
  if (outcome.pregnant) state.pregnant = true;
  if (outcome.clearPregnant) state.pregnant = false;
  if (outcome.child) state.child = true;
  if (outcome.internship) {
    state.internships.push({ ...outcome.internship, year: state.time.year });
  }
  if (outcome.projects) state.projects += outcome.projects;
  if (outcome.applications) state.applications += outcome.applications;
  if (outcome.interviews) state.interviews += outcome.interviews;
  if (outcome.ghosts) state.ghosts += outcome.ghosts;
  if (outcome.offers) state.offers += outcome.offers;
  if (outcome.gradIntent) state.gradIntent += outcome.gradIntent;
  if (outcome.recommendations) state.recommendations += outcome.recommendations;
  if (outcome.research) state.research = true;
  if (outcome.record) state.record = true;
  if (outcome.club && !state.clubs.includes(outcome.club)) state.clubs.push(outcome.club);
  if (outcome.ties) state.ties += outcome.ties;
  if (outcome.hospitalizations) state.hospitalizations += outcome.hospitalizations;
  if (outcome.majorId) {
    state.character.majorId = outcome.majorId;
    state.flags.declaredMajor = outcome.majorId;
  }
  if (state.money < -400) {
    const moved = Math.round(-state.money);
    state.debt += moved + 25;
    state.money = 0;
    state.stats.stress = clamp(state.stats.stress + 4, 0, 100);
  }
}

function openFinale(state: GameState, rng: Rng): void {
  state.outlook = assess(state, rng);
  state.flags.graduated = state.outlook.graduated;
  if (!state.outlook.graduated) state.flags.didNotGraduate = true;
  state.finale = 'ceremony';
  state.phase = 'play';
  state.outcome = null;
  enterEvent(state, ceremonyEvent, rng);
}

export function startGame(draft: LifeDraft): GameState {
  const safe: LifeDraft = {
    ...draft,
    name: draft.name.trim() || 'Alex Morgan',
    hasCar: carFor(draft.backgroundId, draft.seed),
    luck: luckFor(draft.seed),
  };
  const rng = makeRng(safe.seed);
  const state = blankState(safe, rng);
  applyWeeks(state, state.time.span);
  state.banner = postAnnualBill(state);
  beginTerm(state);
  const event = pickEvent(state, rng);
  enterEvent(state, event, rng);
  state.rng = rng.state();
  return state;
}

export function choose(state: GameState, choiceId: string): GameState {
  if (state.phase !== 'play' || state.death) return state;
  const event = getEvent(state.currentEventId);
  const choice = event.choices(state).find((item) => item.id === choiceId);
  if (!choice || choice.disabled?.(state)) return state;
  const next = structuredClone(state);
  next.banner = null;
  const rng = restoreRng(next.rng);
  const outcome = choice.resolve({ state: next, rng });
  applyOutcome(next, outcome);
  next.outcome = {
    title: event.title,
    text: outcome.fatal?.text ?? outcome.text,
    deltas: outcome.fatal ? [] : describeDeltas(state, next),
  };
  next.phase = 'outcome';
  if (outcome.ending && !outcome.fatal) {
    next.ending = buildEnding(next, rng, outcome.ending);
    if (next.finale === 'none') next.finale = 'crossroads';
  }
  next.rng = rng.state();
  return next;
}

export function continueGame(state: GameState): GameState {
  if (state.phase !== 'outcome') return state;
  const next = structuredClone(state);
  const rng = restoreRng(next.rng);

  if (next.death) {
    next.ending = next.ending ?? buildDeathEnding(next, rng);
    next.phase = 'dead';
    next.rng = rng.state();
    return next;
  }

  if (next.finale === 'dismissed') {
    next.phase = 'ending';
    next.rng = rng.state();
    return next;
  }

  if (next.currentEventId === 'crossroads') {
    if (!next.ending) next.ending = buildEnding(next, rng, { kind: 'uncertain' });
    next.phase = 'ending';
    next.rng = rng.state();
    return next;
  }

  if (next.currentEventId === 'ceremony') {
    next.currentEventId = 'crossroads';
    next.finale = 'crossroads';
    next.phase = 'play';
    next.outcome = null;
    next.upkeepNote = null;
    enterEvent(next, crossroadsEvent, rng);
    next.rng = rng.state();
    return next;
  }

  const termKey = `${next.time.year}-${next.time.term}`;
  if (next.time.focus === 'finals' && next.flags.resolvedTerm !== termKey) {
    const status = resolveTerm(next, rng);
    next.flags.resolvedTerm = termKey;
    if (status === 'dismissed' && next.time.year < 4) {
      next.flags.dismissed = true;
      next.finale = 'dismissed';
      next.ending = buildEnding(next, rng, { kind: 'dismissed' });
      next.outcome = {
        title: 'A letter from the registrar',
        text: dismissalLetter(),
        deltas: [],
      };
      next.currentEventId = 'dismissal-letter';
      next.phase = 'outcome';
      next.rng = rng.state();
      return next;
    }
    if (status === 'dismissed') next.flags.didNotGraduate = true;
  }

  const onLast = next.beatIndex >= CALENDAR.length - 1;
  if (onLast && next.queue.length) {
    const queued = takeQueued(next);
    if (queued) {
      next.phase = 'play';
      next.outcome = null;
      enterEvent(next, queued, rng);
      next.rng = rng.state();
      return next;
    }
  }

  if (onLast) {
    openFinale(next, rng);
    next.rng = rng.state();
    return next;
  }

  const carriedBanner = next.time.focus === 'finals' ? next.banner : null;
  next.beatIndex += 1;
  const beat = CALENDAR[next.beatIndex];
  if (!beat) {
    openFinale(next, rng);
    next.rng = rng.state();
    return next;
  }
  next.time = toTime(beat);
  if (beat.year >= 2 && beat.term === 'fall' && beat.week === 1 && next.housing.kind === 'dorm') {
    next.housing = assignApartment(rng);
  }
  const note = applyWeeks(next, beat.span);
  next.upkeepNote = note;
  if (beat.term === 'fall' && beat.week === 1) {
    const bill = postAnnualBill(next);
    next.banner = carriedBanner ? `${carriedBanner} ${bill}` : bill;
    beginTerm(next);
  } else if (beat.term === 'spring' && beat.week === 4) {
    next.banner = carriedBanner;
    beginTerm(next);
  } else {
    next.banner = carriedBanner;
  }
  if (next.character.majorId === 'undeclared' && next.time.year >= 3 && !next.flags.forcedMajor) {
    const options = MAJORS.filter((major) => major.id !== 'undeclared');
    const picked = rng.pick(options);
    next.character.majorId = picked.id;
    next.flags.forcedMajor = true;
    addMemory(
      next,
      `The registrar assigned you ${picked.name} through a portal you do not remember opening.`,
      'absurd',
      true,
    );
  }
  const event = pickEvent(next, rng);
  enterEvent(next, event, rng);
  next.phase = 'play';
  next.outcome = null;
  next.rng = rng.state();
  return next;
}

export function currentChoices(state: GameState) {
  if (state.phase !== 'play') return [];
  return getEvent(state.currentEventId).choices(state);
}

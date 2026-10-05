import { backgroundById } from './backgrounds';
import { majorById } from './majors';
import { clamp, type Rng } from './rng';
import { dollars, gpaText, pronouns, yearName } from './text';
import { UNI } from './world';
import { ev, say, who } from './events/helpers';
import type { Choice, GameEvent } from './events/types';
import type { Ending, EndingKind, EndingPayload, GameState, GradAdmit, Offer, Outlook } from './types';

const EMPLOYERS = [
  'Northline Systems',
  'Brass & Harbor',
  'Fieldnote Analytics',
  'Little Lantern Studio',
  'Kindred Health',
  'Vellum & Co.',
  'Brightparcel',
  'Second Shift Labs',
  'Halcyon Foods',
  'Paperroute Media',
  'Municipal Credit Union',
  'Helioform',
];

const SCHOOLS = ['Hale University', 'St. Ivo', 'Marrow Institute', 'Calder University', 'the state graduate school'];

export function relationshipCount(state: GameState): number {
  let count = state.ties;
  for (const person of Object.values(state.cast)) {
    if (person.known && person.affection >= 20) count += 1;
  }
  return count;
}

export function assess(state: GameState, rng: Rng): Outlook {
  const major = majorById(state.character.majorId);
  const background = backgroundById(state.character.backgroundId);
  const gpa = state.gpa ?? 0;
  const graduated = !state.flags.dismissed && gpa >= 2 && state.credits >= 105;
  let score = gpa * 18;
  score += state.stats.skills * 0.34;
  score += state.stats.network * 0.28;
  score += state.stats.reputation * 0.1;
  score += state.internships.length * 15;
  score += state.internships.filter((job) => job.paid).length * 6;
  score += state.projects * 6;
  score += Math.min(state.applications, 24) * 0.5;
  score += Math.max(0, Math.min(state.applications - 24, 50)) * 0.08;
  score += state.interviews * 4;
  score += state.ghosts * -0.12;
  score += background.connections;
  score += Math.min(state.jobsHeld.length, 4) * 4;
  score += state.recommendations * 5;
  score += major.market * 16;
  score += state.character.luck * 1.5;
  if (state.record) score -= 18;
  if (state.probation) score -= 6;
  if (state.flags.rescinded) score -= 4;
  const marketRoll = rng.next();
  const market: Outlook['market'] = marketRoll < 0.3 ? 'bleak' : marketRoll > 0.82 ? 'open' : 'ordinary';
  if (market === 'bleak') score -= 11;
  if (market === 'open') score += 7;
  score += rng.int(-6, 6);

  let offer: Offer | null = null;
  if (graduated && score >= 104) {
    offer = {
      employer: rng.pick(EMPLOYERS),
      role: rng.pick(major.roles),
      shaky: score < 118,
    };
  }

  let grad: GradAdmit | null = null;
  const gradFloor = Math.min(major.gradMin, 3.2);
  if (graduated && state.gradIntent >= 1 && gpa >= gradFloor - 0.1) {
    let chance = 0.22 + (gpa - gradFloor) * 0.85;
    if (state.research) chance += 0.2;
    chance += state.recommendations * 0.14;
    chance += Math.min(state.gradIntent, 3) * 0.08;
    if (state.recommendations < 1 && !state.research && gpa < 3.5) chance -= 0.18;
    if (gpa < 3.05) chance -= 0.2;
    chance = clamp(chance, 0.05, 0.86);
    if (rng.chance(chance)) {
      const program = rng.pick(major.programs);
      const funded = (state.research || gpa >= 3.6) && rng.chance(0.62);
      grad = {
        school: rng.pick(SCHOOLS),
        degree: program.degree,
        program: program.name,
        funded,
      };
    }
  }

  return { score, market, graduated, offer, grad };
}

function pickLines(state: GameState, year: number): string[] {
  const all = state.memories.filter((memory) => memory.year === year);
  const ranked = [...all].sort((a, b) => Number(b.highlight) - Number(a.highlight));
  const keep = new Set(ranked.slice(0, 3));
  const lines = all.filter((memory) => keep.has(memory)).map((memory) => memory.text);
  if (lines.length) return lines;
  return [`${yearName(year)} passed through you. Not all of it left a sentence.`];
}

export function chaptersFor(state: GameState): { year: string; lines: string[] }[] {
  const max = Math.min(4, Math.max(1, state.time.year));
  const chapters = [];
  for (let year = 1; year <= max; year += 1) {
    chapters.push({ year: yearName(year), lines: pickLines(state, year) });
  }
  return chapters;
}

function messageFor(kind: EndingKind, rng: Rng, state: GameState): string {
  const lines: Record<EndingKind, string[]> = {
    employed: [
      'You spent four years trying to figure out what you were doing.\n\nApparently, that was enough.',
      'The offer was not a coronation. It was a door. You walked through it owing money and carrying people.',
      'Nobody handed you a life. You assembled one from shifts, grades, favors, and a few hours that were actually beautiful.',
    ],
    gradschool: [
      'You did not escape the question of what to do with your life. You enrolled in a longer version of it.',
      'More school is not a prize and not a failure. It is a room you chose with your eyes at least partly open.',
      'You stayed in the building after the building changed its name. The questions got narrower. You did not.',
    ],
    unemployed: [
      'The applications went somewhere. You were not invited to know where.',
      'You graduated into a market that had learned to say no in an automated font. The no is not a verdict on the years.',
      'Everyone says these are the best years of your life. You have the degree, the debt, and a portal that is still thinking about it.',
    ],
    uncertain: [
      'Not every life resolves on a lawn. Yours walked off still becoming.',
      'You did not get the ending the brochure sold. You got a direction, a Monday, and the people who picked up.',
      'There is a path here. It does not have a job title yet. That is allowed to be terrifying and still be a path.',
    ],
    dismissed: [
      'The university wished you well in language copied from a brochure.',
      'Calder closed the file. You are still a person in a week. That part did not require their permission.',
    ],
    death: [
      'You entered at eighteen. The story kept only some of its hours.',
      'These were not all the years. They were the ones you got.',
    ],
  };
  const choice = rng.pick(lines[kind]);
  if (state.child && kind !== 'death') {
    return `${choice}\n\nA smaller life had already started rearranging the plan.`;
  }
  return choice;
}

export function buildEnding(state: GameState, rng: Rng, payload: EndingPayload): Ending {
  const major = majorById(state.character.majorId);
  const kind = payload.kind;
  let role = payload.role;
  let employer = payload.employer;
  let program = payload.program;
  let detail = payload.detail;
  let outcome = '';

  if (kind === 'employed') {
    role = role ?? state.outlook?.offer?.role ?? rng.pick(major.roles);
    employer = employer ?? state.outlook?.offer?.employer ?? rng.pick(EMPLOYERS);
    outcome = `${role} at ${employer}`;
    detail = detail ?? (state.outlook?.offer?.shaky
      ? 'The offer is real and not luxurious. It is a job.'
      : 'You have a start. The loans did not clap.');
  } else if (kind === 'gradschool') {
    const admit = state.outlook?.grad;
    program = program ?? (admit ? `${admit.degree} in ${admit.program}, ${admit.school}` : `${major.programs[0]?.degree ?? "Master's"} in ${major.name}`);
    outcome = program;
    detail = detail ?? (admit?.funded
      ? 'The offer is funded, which is a kind of mercy.'
      : 'The acceptance is real. So is the bill that comes with it.');
  } else if (kind === 'unemployed') {
    outcome = 'Still applying';
    detail = detail ?? `${state.applications} applications. ${state.ghosts} silences you bothered to count.`;
  } else if (kind === 'uncertain') {
    outcome = payload.role ?? 'An unnamed path';
    detail = detail ?? 'Not a failure. Not a finish line.';
  } else if (kind === 'dismissed') {
    outcome = 'Left before graduation';
    detail = detail ?? `${UNI.name} ended the enrollment. The week after still arrived.`;
  } else {
    outcome = state.death?.reason ?? 'The years stopped';
    detail = state.death?.text;
  }

  const headlines: Record<EndingKind, string> = {
    employed: 'Walked away with a job.',
    gradschool: 'Entered graduate school.',
    unemployed: 'No offer came.',
    uncertain: 'An uncertain path.',
    dismissed: 'Asked to leave.',
    death: 'The years stopped.',
  };

  let postscript: string | undefined;
  if (state.flags.pregnancyPath === 'adoption') {
    postscript = 'You carried a pregnancy and chose adoption. It stayed with you as a fact, not a twist.';
  } else if (state.flags.pregnancyPath === 'end') {
    postscript = 'You made a private medical decision and did not owe the campus a performance of it.';
  } else if (state.child) {
    postscript = 'Parenthood showed up before the five-year plan did. The plan moved.';
  }
  if (state.record) {
    postscript = `${postscript ? `${postscript} ` : ''}A charge from a reckless night still sits in the background of forms.`;
  }

  const ageEnd = kind === 'death' ? state.time.age : kind === 'dismissed' ? state.time.age : 22;

  return {
    kind,
    headline: payload.headline ?? headlines[kind],
    outcome,
    role,
    employer,
    program,
    detail,
    gpa: state.gpa,
    debt: Math.max(0, Math.round(state.debt)),
    money: Math.round(state.money),
    major: major.name,
    ageStart: 18,
    ageEnd,
    relationships: relationshipCount(state),
    internships: state.internships.length,
    applications: state.applications,
    weeks: state.weeksLived,
    credits: state.credits,
    chapters: chaptersFor(state),
    message: messageFor(kind, rng, state),
    postscript,
    seed: state.seed,
    child: state.child,
  };
}

export function buildDeathEnding(state: GameState, rng: Rng): Ending {
  return buildEnding(state, rng, {
    kind: 'death',
    detail: state.death?.text,
  });
}

export function dismissalLetter(): string {
  return `${UNI.name} writes to say you are no longer enrolled. The paragraph wishes you a vibrant future and attaches a link about returning "when the time is right."\n\nThe shifts, the rent, and the exam you walked into already tired are not mentioned. The four years stop short of four.`;
}

export const ceremonyEvent: GameEvent = ev({
  id: 'ceremony',
  title: 'Commencement',
  weight: 0,
  categories: ['warm'],
  when: () => false,
  location: (s) => (s.outlook?.graduated ? 'graduation' : 'quad'),
  weather: (s) => (s.outlook?.graduated ? 'golden' : 'rain'),
  narration: (s) => {
    const p = pronouns(s.character.pronouns);
    if (!s.outlook?.graduated) {
      return `The list goes up, on a lawn and in a portal. Your name is not on the walk.\n\nCalder sends a paragraph about journeys. ${p.cap} are ${s.time.age}, holding a life that did not fit the ceremony. The quad is still beautiful, which feels rude and also true.`;
    }
    const gpa = gpaText(s.gpa);
    return `You entered ${UNI.name} at 18. The lawn is full of gowns and people pretending not to cry about money.\n\nYou are 22. Your GPA is ${gpa}. The debt is ${dollars(s.debt)}. Someone in the crowd is looking for you like you matter, because you do.`;
  },
  choices: (s) => {
    const friend = who(s, 'friend');
    if (!s.outlook?.graduated) {
      return [
        say('stay', 'Stand at the edge anyway', 'You watch other people become graduates. It hurts in a clean way. When it is over, the grass is trampled and you are still in your life.', {
          effects: { happiness: -2, stress: 2 },
          memory: 'You stood at the edge of a graduation that was not yours.',
          tone: 'serious',
          highlight: true,
        }, { serious: true }),
        say('call', `Call ${friend.name}`, `${friend.name} does not give you a speech. They ask where you are. That is the whole rescue.`, {
          effects: { happiness: 3, stress: -2 },
          rel: [{ who: 'friend', affection: 6, memory: 'They answered when the ceremony did not include you.' }],
          memory: `${friend.name} picked up when graduation did not.`,
          tone: 'warm',
          highlight: true,
        }),
        say('leave', 'Leave campus', 'You walk out past the banners. Find your forever, they say, to someone else. You find the bus.', {
          effects: { stress: -1, happiness: -1 },
          memory: 'You left campus without a ceremony.',
          tone: 'serious',
        }),
      ];
    }
    return [
      say('walk', 'Walk', 'Your name is said. It sounds smaller than the years and exactly the right size. You cross the stage owing money and carrying a life.', {
        effects: { happiness: 6, stress: -4 },
        memory: 'You walked at commencement.',
        tone: 'warm',
        highlight: true,
      }),
      say('find', `Find ${friend.name} in the crowd`, `The hats all look the same until they don't. ${friend.name} is crying in a way that makes you laugh. For a minute the future is just a person who stayed.`, {
        effects: { happiness: 8, stress: -5, social: 2 },
        rel: [{ who: 'friend', affection: 6, memory: 'They found you at graduation.' }],
        memory: 'At graduation, someone found you in the crowd.',
        tone: 'warm',
        highlight: true,
      }),
      say('library', 'Skip it and sit in the library', 'The ceremony booms somewhere behind the stacks. You sit where you actually lived. It is a private graduation, witnessed by a chair.', {
        effects: { happiness: 4, stress: -3 },
        memory: 'You skipped the pomp and sat in the library one last time.',
        tone: 'warm',
        highlight: true,
      }, { wild: true }),
    ];
  },
});

export const crossroadsEvent: GameEvent = ev({
  id: 'crossroads',
  title: 'What now',
  weight: 0,
  categories: ['career'],
  when: () => false,
  location: (s) => (s.outlook?.graduated ? 'graduation' : 'street'),
  weather: 'golden',
  narration: (s) => {
    const outlook = s.outlook;
    if (!outlook?.graduated) {
      return `The ceremony is over for other people. You have a degree-shaped absence, a balance of ${dollars(s.debt)}, and a week that still expects you to eat.\n\nThe market is ${outlook?.market ?? 'ordinary'}. The next move is not a brand. It is a choice.`;
    }
    const bits = [];
    if (outlook.offer) {
      bits.push(`${outlook.offer.employer} is offering you a seat as a ${outlook.offer.role}${outlook.offer.shaky ? ', real and not fancy' : ''}.`);
    }
    if (outlook.grad) {
      bits.push(`${outlook.grad.school} has a ${outlook.grad.funded ? 'funded ' : ''}${outlook.grad.degree} in ${outlook.grad.program}.`);
    }
    if (!bits.length) {
      bits.push(`No offer is sitting on the table. ${s.applications} applications know your name, or at least your email.`);
    }
    const market =
      outlook.market === 'bleak'
        ? 'The market is tight and pretending it is a meritocracy.'
        : outlook.market === 'open'
          ? 'The market is, suspiciously, a little open.'
          : 'The market is ordinary, which means crowded.';
    return `You are 22. The gown is off. ${market}\n\n${bits.join(' ')}`;
  },
  choices: (s) => {
    const outlook = s.outlook;
    const background = backgroundById(s.character.backgroundId);
    const major = majorById(s.character.majorId);
    const choices: Choice[] = [];
    if (outlook?.offer && outlook.graduated) {
      choices.push(
        say('job', `Take the job at ${outlook.offer.employer}`, `You say yes. The title is ${outlook.offer.role}. It will not love you back. It will pay you, and you will learn what the work actually is.`, {
          ending: { kind: 'employed' },
          memory: `You accepted a job at ${outlook.offer.employer}.`,
          tone: 'warm',
          highlight: true,
        }),
      );
    }
    if (outlook?.grad && outlook.graduated) {
      const cost = outlook.grad.funded ? 'The funding makes it possible.' : background.unpaidEase > 0.5
        ? 'It is not funded. Your family can help, and the debt will still have your name on it.'
        : 'It is not funded. Saying yes means borrowing against a future that has not agreed to anything.';
      choices.push(
        say('grad', `Enter ${outlook.grad.degree} study`, `${cost} You choose the longer room. Graduate school is not a trophy. It is a direction.`, {
          ending: {
            kind: 'gradschool',
            detail: cost,
          },
          memory: `You entered a ${outlook.grad.degree} program in ${outlook.grad.program}.`,
          tone: 'serious',
          highlight: true,
        }),
      );
    }
    if (outlook?.graduated && outlook.offer && !outlook.grad) {
      choices.push(
        say('decline', 'Turn the job down', 'You decline. The courage and the fear are the same size. What follows is not a montage. It is applications, again, and a life that is yours on purpose.', {
          ending: { kind: 'uncertain', role: 'Between things, on purpose', detail: 'You had an offer and set it down.' },
          memory: 'You turned down a job and kept looking.',
          tone: 'serious',
        }),
      );
    }
    if (outlook?.graduated && !outlook.offer) {
      choices.push(
        say('keep', 'Keep applying', 'You keep the spreadsheet. Coffee, portals, a careful letter once a day. The ending of college is not the ending of the search.', {
          ending: { kind: 'unemployed', detail: `${s.applications} applications behind you, and the habit of sending another.` },
          memory: 'Graduation turned into more applications.',
          tone: 'serious',
          highlight: true,
        }),
      );
      choices.push({
        id: 'last',
        label: 'Send one more cold email',
        wild: true,
        resolve: ({ rng }) => {
          const close = (outlook?.score ?? 0) >= 90 || s.internships.length > 0;
          if (close && rng.chance(0.48)) {
            const employer = rng.pick(EMPLOYERS);
            const role = rng.pick(major.roles);
            return {
              text: `${employer} writes back. Not a dream. A ${role} seat, slightly embarrassed to exist. You read it twice to make sure it is not a newsletter.`,
              ending: { kind: 'employed', employer, role, detail: 'A last email opened a door the portal would not.' },
              memory: `A last-minute note from ${employer} turned into a job.`,
              tone: 'warm',
              highlight: true,
            };
          }
          return {
            text: 'The email joins the others. A person may read it in a quarter. You close the laptop and make dinner. The search continues without a soundtrack.',
            ending: { kind: 'unemployed', detail: 'Even the last email needed time you do not control.' },
            memory: 'The last cold email did not save the month.',
            tone: 'serious',
          };
        },
      });
    }
    if (!outlook?.graduated) {
      choices.push(
        say('search', 'Look for work without the diploma', 'You apply to the jobs that will talk to you. Some will not. A few only need you to show up and learn. It is narrower, and it is not nothing.', {
          ending: { kind: 'uncertain', role: 'Working without the diploma', detail: 'The degree stopped. The need for a wage did not.' },
          memory: 'You started looking for work without a diploma in hand.',
          tone: 'serious',
          highlight: true,
        }),
      );
    }
    choices.push(
      say('home', 'Go home and regroup', 'Home is not a failure state. It is a roof, a kitchen, and a place to hear yourself think. You will leave again, or you will build there. Tonight you are fed.', {
        ending: { kind: 'uncertain', role: 'Home, for now', detail: 'You went back to regroup. The story calls this uncertain. You call it a week you can survive.' },
        memory: 'You went home after college to figure out the next true thing.',
        tone: 'warm',
        highlight: true,
      }),
    );
    if (background.id === 'wealthy' || background.id === 'upper-middle') {
      choices.push(
        say('family', 'Take the family offer', 'There is a desk with your last name near it. The work is real enough to be boring, which is how you know it is work. It is also a net. You walk in with your eyes open about whose it is.', {
          ending: {
            kind: 'employed',
            employer: 'the family office',
            role: 'Coordinator',
            detail: 'A family offer is still a job, and still not the same as a self made of nothing.',
          },
          memory: 'You took the family offer and did not pretend it was only merit.',
          tone: 'serious',
          highlight: true,
        }),
      );
    }
    choices.push(
      say('studio', 'Invent a path with no title yet', 'You give it a name so the fear has somewhere to sit. Freelance, a studio, a year of making. The IRS will have questions. So will you. You start anyway.', {
        ending: { kind: 'uncertain', role: 'A path without a title', detail: 'You stepped off the recruiter path and into something you have to explain at dinner.' },
        memory: 'You left commencement toward a path that did not have a title yet.',
        tone: 'absurd',
        highlight: true,
      }, { wild: true }),
    );
    return choices;
  },
});

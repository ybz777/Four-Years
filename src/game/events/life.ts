import { backgroundById } from '../backgrounds';
import { JOBS } from '../jobs';
import { majorById } from '../majors';
import { dollars } from '../text';
import { hasTrait } from '../traits';
import { ORGS } from './career';
import { ev, say, who } from './helpers';
import type { GameEvent } from './types';

export const lifeEvents: GameEvent[] = [
  ev({
    id: 'ordinary-week',
    title: 'The week, unbranded',
    weight: 3,
    categories: ['academic', 'work'],
    focuses: ['life', 'midterm'],
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : s.stats.stress > 60 ? 'library' : 'quad'),
    narration: (s) => {
      const job = s.job ? `The shift schedule has opinions.` : `Nobody is offering you a shift, which is its own kind of bill.`;
      return `No one is emailing you a plot. There is a week, and you are in it.\n\n${job} The readings are not going to become shorter out of respect.`;
    },
    choices: (s) => {
      const choices = [
        say('study', 'Give the week to the work', 'You do the unglamorous thing. Pages, problems, a desk. At the end of it you are tired in a way that feels like proof.', {
          effects: { termScore: 6, energy: -6, stress: 2, skills: 1 },
          tone: 'warm',
        }),
        say('rest', 'Sleep like you mean it', 'You let the week be smaller. Your body receives this as news. One assignment slips. Your hands stop shaking, which was not on the rubric and mattered.', {
          effects: { energy: 14, stress: -8, health: 4, termScore: -2, happiness: 3 },
          tone: 'warm',
          memory: 'You chose sleep in a week that wanted a performance.',
        }),
        say('friend', `See ${who(s, 'friend').name}`, `You spend an evening being a person with ${who(s, 'friend').name}. It costs a little money and returns a self you recognize.`, {
          effects: { happiness: 5, social: 4, stress: -4, money: -12, termScore: -1 },
          rel: [{ who: 'friend', affection: 5, memory: 'You made time that was not productive.' }],
          tone: 'warm',
        }),
      ];
      if (s.job) {
        choices.push(
          say('extra', 'Pick up extra shifts', `You trade the week for ${dollars(Math.round(s.job.weekly * 1.4))}. The money is real. The reading notices your absence.`, {
            effects: { money: Math.round(s.job.weekly * 1.4), stress: 5, energy: -8, termScore: -4, skills: 1 },
            memory: 'You worked extra and the courses felt it.',
            tone: 'serious',
          }),
        );
      } else {
        const job = s.character.hasCar ? JOBS.delivery : hasTrait(s, 'bookish') ? JOBS.tutor : JOBS.dining;
        const allowed = job.id !== 'tutor' || (s.gpa ?? 3) >= 3.1;
        const chosen = allowed ? job : JOBS.campus;
        choices.push(
          say('hire', `Take hours as a ${chosen.title.toLowerCase()}`, `You say yes to ${chosen.title.toLowerCase()}. The pay is modest. The schedule is a second syllabus. You are, at least, no longer only a person who owes.`, {
            effects: { stress: 4, energy: -4, skills: 1 },
            job: chosen,
            memory: `You started working as a ${chosen.title.toLowerCase()}.`,
            tone: 'serious',
            highlight: true,
          }),
        );
      }
      return choices;
    },
  }),
  ev({
    id: 'summer-fork',
    title: 'The summer question',
    weight: 7,
    categories: ['work', 'career'],
    focuses: ['summer'],
    location: 'quad',
    weather: 'golden',
    narration: (s) => {
      const bg = backgroundById(s.character.backgroundId);
      const lease = s.housing.kind === 'apartment'
        ? `${s.housing.company ?? 'The lease'} does not go home for the summer. The rent remains, cheerful and lunar.`
        : `The dorms close. Your belongings fit into a story about going home, whether or not home is simple.`;
      const ease = bg.unpaidEase > 0.6 ? 'An unpaid summer is financially possible for you. That is not the same as it being meaningless.' : 'An unpaid summer would be a luxury you do not currently own.';
      return `Summer opens like a second chance and a bill.\n\n${lease} ${ease}`;
    },
    choices: (s) => {
      const major = majorById(s.character.majorId);
      const bg = backgroundById(s.character.backgroundId);
      return [
        {
          id: 'intern',
          label: 'Chase a paid internship',
          detail: 'Depends on your record, your major, and luck.',
          resolve: ({ rng }) => {
            const score =
              (s.gpa ?? 2.7) * 18 +
              s.stats.skills * 0.25 +
              s.stats.network * 0.2 +
              s.internships.length * 10 +
              bg.connections +
              major.market * 12 +
              s.character.luck * 2 +
              (s.time.year === 1 ? -18 : 0);
            const org = rng.pick(ORGS);
            const paid = rng.int(2800, 6400);
            if (score + rng.int(-8, 10) > 78) {
              return {
                text: `${org} says yes. The pay is ${dollars(paid)} for the summer, which is not wealth and is not a joke. You do actual tasks. Someone learns your name. In August you are tired in a new way.`,
                effects: { money: paid, skills: 12, stress: 6, energy: -6, network: 6, reputation: 4 },
                internship: { title: major.roles[0] ?? 'Summer intern', org, paid: true },
                memory: `You spent a summer at ${org}.`,
                tone: 'warm',
                highlight: true,
              };
            }
            if (score > 62 && rng.chance(0.5)) {
              return {
                text: `You get a small yes from ${org}, paid poorly and supervised kindly. ${dollars(1800)} and a project you can talk about without lying. Not the poster. A start.`,
                effects: { money: 1800, skills: 8, stress: 4, network: 4 },
                internship: { title: 'Summer intern', org, paid: true },
                memory: `A modest summer internship at ${org} still counted.`,
                tone: 'warm',
                highlight: true,
              };
            }
            return {
              text: `You chase it. The portal thanks you for your interest in tones ranging from warm to automated. No one offers a seat. You pick up work instead and try not to narrate the summer as a failure of character. It was a market.`,
              effects: { money: 1100, stress: 6, happiness: -3, skills: 3 },
              ghosts: 4,
              applications: 10,
              memory: 'The summer internship search ended in shifts, not a title.',
              tone: 'brutal',
              highlight: true,
            };
          },
        },
        say('work', 'Work the unglamorous job', 'You take hours and stack them. Nobody writes a caption. In August your account is less frightening and your hands know a job. That is a kind of resume the fair does not laminate.', {
          effects: { money: s.character.backgroundId === 'wealthy' ? 1600 : 2800, skills: 5, stress: 5, energy: -6, reputation: 1 },
          job: s.character.hasCar ? JOBS.delivery : JOBS.retail,
          memory: 'You worked a plain summer job and kept yourself afloat.',
          tone: 'warm',
          highlight: true,
        }),
        say('home', 'Go home', s.housing.kind === 'apartment'
          ? 'You go home and the lease stays in Harborbend like a pet you still feed. Family is complicated and, some nights, exactly enough. You work a local shift and sleep in a room that remembers you.'
          : 'You go home. The town is smaller than your stress. You work, you eat at the table, you remember who you were before the portal. It is not a strategy. It is a repair.', {
          effects: { money: 700, stress: -8, happiness: 4, energy: 8, skills: 2 },
          flags: { summerHome: s.time.year },
          memory: 'You went home for the summer.',
          tone: 'warm',
          highlight: true,
        }),
        say('unpaid', 'Take the unpaid "opportunity"', bg.unpaidEase > 0.45
          ? 'You can afford the symbolism, barely or easily depending on the month. The work teaches you something. The credit line teaches you something else. You try to keep them separate when you tell the story.'
          : 'You take it anyway. August arrives with a title and a deeper hole. You learned the work. You also learned that exposure is a word people use when they mean you.', {
          effects: {
            skills: 9,
            network: 5,
            stress: bg.unpaidEase > 0.45 ? 4 : 12,
            money: bg.unpaidEase > 0.45 ? -200 : -900,
            happiness: bg.unpaidEase > 0.45 ? 1 : -5,
          },
          internship: { title: 'Unpaid intern', org: 'Vellum & Co.', paid: false },
          memory: 'You spent a summer unpaid, and the resume did not mention the cost.',
          tone: 'serious',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'february',
    title: 'February',
    weight: 3,
    categories: ['warm', 'money'],
    focuses: ['life'],
    terms: ['spring'],
    location: 'dorm',
    weather: 'snow',
    narration: (s) => {
      const home = backgroundById(s.character.backgroundId);
      return `February in Harborbend is a gray that has given up. The heating in ${s.housing.building} is a rumor with a radiator.\n\n${home.id === 'wealthy' ? 'Your family texts about a trip you are not sure you want to need.' : 'Someone at home asks if you are eating, which is a love language and an audit.'}`;
    },
    choices: (s) => [
      say('call', 'Call home and tell the truth', 'You do not perform thriving. The call is uneven and real. Afterward the room is the same temperature and you are slightly less alone in it.', {
        effects: { happiness: 4, stress: -4 },
        memory: 'You called home in February and skipped the brochure.',
        tone: 'warm',
        highlight: true,
      }),
      say('friend-cook', `Cook with ${who(s, 'friend').name}`, 'You make a bad soup that improves with loyalty. Winter shrinks to a kitchen. You laugh at nothing. It counts.', {
        effects: { happiness: 6, social: 4, stress: -5, money: -8, health: 2 },
        rel: [{ who: 'friend', affection: 6, memory: 'February soup.' }],
        ties: 1,
        memory: 'You cooked a bad soup with a friend and winter loosened.',
        tone: 'warm',
        highlight: true,
      }),
      say('grind', 'Use the gray as cover and work', 'You disappear into the semester. February will not remember you. Your GPA might. Your friends send a meme you answer too late.', {
        effects: { termScore: 5, stress: 3, social: -2, energy: -4 },
        rel: [{ who: 'friend', affection: -2 }],
        tone: 'serious',
      }),
    ],
  }),
  ev({
    id: 'morning',
    title: 'A morning that does not ask for anything',
    weight: 2,
    once: true,
    categories: ['warm'],
    focuses: ['life', 'summer'],
    location: 'quad',
    weather: 'clear',
    narration: () =>
      `You wake up before the alarm, which is suspicious. The campus is rinsed. Someone is playing a piano badly in a practice room with the window open, and the badness is beautiful.\n\nFor a few minutes you are not a GPA, a balance, or a candidate. You are a person in a morning.`,
    choices: () => [
      say('walk', 'Take the long way', 'You take it. Birds, brick, your own breath. You arrive slightly late and oddly unwilling to apologize to the day.', {
        effects: { happiness: 7, stress: -7, energy: 3 },
        memory: 'There was a morning on campus that felt like a life.',
        tone: 'warm',
        highlight: true,
      }),
      say('note', 'Write it down so you do not lose it', 'You write three sentences in a notes app you usually reserve for panic. Later, on a bad week, you will find them and believe yourself.', {
        effects: { happiness: 5, stress: -4 },
        memory: 'You wrote down a good morning so a bad week could not have all the evidence.',
        tone: 'warm',
        highlight: true,
      }),
    ],
  }),
];

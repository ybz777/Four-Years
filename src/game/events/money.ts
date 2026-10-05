import { backgroundById } from '../backgrounds';
import { JOBS } from '../jobs';
import { dollars } from '../text';
import { ev, say } from './helpers';
import type { GameEvent } from './types';

export const moneyEvents: GameEvent[] = [
  ev({
    id: 'water-bottle',
    title: 'You forgot your water bottle',
    weight: 4,
    categories: ['money'],
    focuses: ['life', 'midterm', 'finals'],
    location: 'store',
    narration: () =>
      `The lecture hall is dry as a policy. Your water bottle is in a room you are not in.\n\nThe campus store cooler hums beside a handwritten card: bottled water, $4.79. The fountain is a hike and a rumor.`,
    choices: () => [
      say('buy', 'Buy the water', 'You pay $4.79 for something that fell from the sky last week. You are hydrated and a little insulted.', {
        effects: { money: -4.79, health: 2, happiness: -1 },
        tone: 'funny',
        memory: 'You bought a $4.79 bottle of water.',
      }),
      say('walk', 'Walk twenty minutes to a cheaper store', 'The corner shop off campus sells the same water for $1.29. You spend the time and a little dignity. Your legs file it under exercise.', {
        effects: { money: -1.29, energy: -6, health: 2, stress: 1 },
        tone: 'warm',
      }),
      {
        id: 'fountain',
        label: 'Drink from the water fountain',
        detail: 'Free. The fountain has a personality.',
        resolve: ({ rng }) => {
          if (rng.chance(0.14)) {
            return {
              text: 'The fountain tastes like a pipe that has known things. By evening you are intimate with the campus clinic\'s bathroom. The water was free. The night was not.',
              effects: { health: -14, energy: -8, stress: 4, happiness: -3 },
              memory: 'The free fountain collected a toll.',
              tone: 'funny',
            };
          }
          return {
            text: 'You drink. It is cold and slightly metallic and costs nothing. A small victory, unposted.',
            effects: { health: 1, happiness: 2, stress: -1 },
            tone: 'warm',
          };
        },
      },
      say('thirst', 'Stay thirsty', 'You are a martyr for a principle the bursar will never hear about. Your headache arrives on time.', {
        effects: { health: -3, stress: 2, happiness: -1 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'textbook',
    title: 'Required',
    weight: 4,
    categories: ['money', 'academic'],
    focuses: ['life'],
    terms: ['fall', 'spring'],
    location: 'store',
    narration: (s) => {
      const price = s.character.backgroundId === 'wealthy' ? 86 : 64;
      return `The bookstore has shrink-wrapped a paperback that also exists as a PDF the professor "cannot technically recommend."\n\nRequired text: ${dollars(price)}. Used: almost the same, plus someone else's despair in the margins.`;
    },
    choices: (s) => {
      const price = s.character.backgroundId === 'wealthy' ? 86 : 64;
      return [
        say('buy', `Buy it for ${dollars(price)}`, 'You own the book. The first chapter is a definition of a word you already use. Still, you can follow along, which is not nothing.', {
          effects: { money: -price, termScore: 4, stress: 2 },
          tone: 'serious',
        }),
        say('pdf', 'Find a dubious PDF', 'The scan is crooked and missing chapter nine. You learn around the hole. Your conscience and your wallet split the difference.', {
          effects: { termScore: 2, stress: 2, money: 0, happiness: -1 },
          memory: 'You did not buy the required book.',
          tone: 'funny',
        }),
        say('library', 'Camp the library copy', 'Two-hour checkout. You take notes like a person stealing fire. It works if you actually go back.', {
          effects: { termScore: 3, energy: -4, stress: 3 },
          tone: 'warm',
        }),
        say('skip', 'Decide you will "figure it out"', 'You will not figure it out. The exam is written by someone who has read the book.', {
          effects: { termScore: -6, stress: -1 },
          tone: 'brutal',
        }),
      ];
    },
  }),
  ev({
    id: 'laptop-dies',
    title: 'The laptop makes a sound',
    weight: 3,
    once: true,
    categories: ['money', 'academic'],
    focuses: ['life', 'midterm'],
    years: [1, 2, 3],
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'dorm'),
    narration: () =>
      `Your laptop clicks, sighs, and becomes a very expensive cutting board.\n\nThe campus store repair desk offers a look of practiced sorrow and a number that is not sorrow.`,
    choices: (s) => {
      const bg = backgroundById(s.character.backgroundId);
      return [
        {
          id: 'replace',
          label: 'Replace it',
          detail: 'Fast. Expensive. Debt is standing by.',
          disabled: () => null,
          resolve: ({ rng }) => {
            const cost = 740;
            if (s.money > cost + 200) {
              return {
                text: `You buy a refurbished machine for ${dollars(cost)}. It is uglier than the dead one and alive, which is the feature that matters.`,
                effects: { money: -cost, stress: 4, termScore: 1 },
                memory: 'Your laptop died and you replaced it.',
                tone: 'serious' as const,
              };
            }
            if (rng.chance(bg.emergency)) {
              return {
                text: `You cannot cover ${dollars(cost)}. You call home expecting nothing useful and receive, this once, a wire. The relief is so sharp it embarrasses you.`,
                effects: { money: 0, stress: -4, happiness: 3 },
                flags: { familyLaptop: true },
                memory: 'Your family caught you when the laptop died.',
                tone: 'warm' as const,
                highlight: true,
              };
            }
            return {
              text: `The card can do ${dollars(cost)} only by becoming a different kind of problem. You put the laptop on credit. It boots. So does the interest.`,
              effects: { debt: cost + 40, stress: 8, termScore: 1 },
              memory: 'A dead laptop joined your debt.',
              tone: 'brutal' as const,
              highlight: true,
            };
          },
        },
        say('library', 'Use the library computers', 'You book seats, you lose files, you learn the particular humility of a two-hour login. Your grades dip and do not collapse.', {
          effects: { termScore: -3, stress: 5, energy: -4, skills: 1 },
          memory: 'You finished the month on library computers.',
          tone: 'serious',
          highlight: true,
        }),
        say('borrow', 'Borrow until you can think', 'A classmate lends you a machine with a sticker that says NO FOOD and a desktop photo of a dog. You are careful with both.', {
          effects: { termScore: -1, social: 3, stress: 3 },
          ties: 1,
          rel: [{ who: 'friend', affection: 5, trust: 4, memory: 'They lent you a laptop.' }],
          tone: 'warm',
        }),
      ];
    },
  }),
  ev({
    id: 'printing',
    title: 'The printer demands tribute',
    weight: 3,
    categories: ['money'],
    focuses: ['life', 'midterm', 'finals'],
    location: 'library',
    narration: () =>
      `Your professor wants a hard copy "to be kind to their eyes." The library printer wants $0.12 a page and a blood oath.\n\nPage twelve jams. The queue behind you has become a community.`,
    choices: () => [
      say('pay', 'Pay and print', 'Five dollars later you hold a warm essay. A stranger helps you clear the jam. For thirty seconds, campus is a village.', {
        effects: { money: -5, termScore: 2, social: 2 },
        tone: 'warm',
      }),
      say('email', 'Email it and risk the policy', 'You send a PDF with a polite sentence. The professor replies that this is not what they asked, and then accepts it. Power is inconsistent.', {
        effects: { termScore: 1, stress: 2, reputation: -1 },
        tone: 'funny',
      }),
      say('rewrite', 'Cut it until it is shorter', 'You print six pages instead of fourteen. The argument gets better by accident. The printer still jams, out of principle.', {
        effects: { money: -2, termScore: 3, skills: 1 },
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'scholarship',
    title: 'A letter you did not expect',
    weight: 4,
    once: true,
    categories: ['money', 'warm'],
    focuses: ['life'],
    years: [1, 2],
    when: (s) => s.character.backgroundId === 'low' || s.character.backgroundId === 'lower-middle',
    location: 'dorm',
    narration: (s) => {
      const amount = s.character.backgroundId === 'low' ? 4500 : 2200;
      return `An email from Calder Financial Aid uses your full name correctly, which is how you know it is real.\n\nA departmental grant: ${dollars(amount)}. Not a miracle. A door held for one semester.`;
    },
    choices: (s) => {
      const amount = s.character.backgroundId === 'low' ? 4500 : 2200;
      return [
        say('debt', 'Put it against the debt', 'The balance shrinks by a number you can feel. You do not celebrate loudly. You eat a real dinner.', {
          effects: { debt: -amount, stress: -8, happiness: 6 },
          memory: `A grant cut ${dollars(amount)} off what you owed.`,
          tone: 'warm',
          highlight: true,
        }),
        say('cash', 'Keep it as breathing room', 'You leave the loans alone and put the money where the next emergency can find it. The emergency, sensing this, waits.', {
          effects: { money: amount, stress: -6, happiness: 5 },
          memory: `A grant gave you ${dollars(amount)} of air.`,
          tone: 'warm',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'family-wire',
    title: 'The account blinks red',
    weight: 4,
    categories: ['money'],
    focuses: ['life', 'summer', 'midterm'],
    when: (s) => s.money < 90 && s.flags.brokeYear !== s.time.year,
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'dorm'),
    narration: (s) =>
      `Rent, food, and a fee you do not remember agreeing to have arranged a meeting in your bank app.\n\nYou are at ${dollars(s.money)}. The group chat is discussing a birthday dinner you cannot attend without performing a crime against your future.`,
    choices: (s) => {
      const bg = backgroundById(s.character.backgroundId);
      return [
        {
          id: 'call',
          label: 'Call home',
          resolve: ({ rng }) => {
            const help = Math.round(400 + bg.emergency * 2200);
            if (rng.chance(bg.emergency)) {
              return {
                text: `You call. There is a pause that costs everyone something. Then ${dollars(help)} arrives with a text that says "we love you" and does not mention the pause. You sit on the floor anyway.`,
                effects: { money: help, stress: -6, happiness: 2 },
                memory: 'Your family sent money, and it was not simple.',
                tone: 'serious',
                highlight: true,
                flags: { brokeYear: s.time.year },
              };
            }
            return {
              text: 'You call. They love you in complete sentences and cannot move the number. You tell them you are fine, which is a kind of fiction you both agree to hold.',
              effects: { stress: 6, happiness: -3 },
              memory: 'You called home. The money was not there.',
              tone: 'brutal',
              highlight: true,
              flags: { brokeYear: s.time.year },
            };
          },
        },
        say('shift', s.job ? 'Pick up every extra shift' : 'Take the first job that answers', s.job
          ? 'You work until your shoes hurt. The account climbs out of the red by its fingernails.'
          : 'You take hours at the dining hall. The hairnet is humbling. The paycheck is a fact.', {
          effects: { money: s.job ? 260 : 180, stress: 7, energy: -8, termScore: -3, skills: 1 },
          job: s.job ?? JOBS.dining,
          memory: 'You worked your way through a bad week.',
          tone: 'serious',
          flags: { brokeYear: s.time.year },
        }),
        say('cut', 'Cancel the life that costs money', 'You eat rice, skip the dinner, and walk. It is dreary and effective. A friend notices and does not make it a thing.', {
          effects: { money: 40, happiness: -4, stress: 3, health: -2 },
          rel: [{ who: 'friend', affection: 3, memory: 'They noticed you were cutting everything.' }],
          tone: 'brutal',
          flags: { brokeYear: s.time.year },
        }),
        say('card', 'Let the card take it', 'The purchase goes through. Somewhere an interest rate wakes up, stretches, and gets to work.', {
          effects: { debt: 320, stress: 5, happiness: 1 },
          tone: 'serious',
          flags: { brokeYear: s.time.year },
        }),
      ];
    },
  }),
  ev({
    id: 'meal-deal',
    title: 'The eleven-dollar student meal',
    weight: 3,
    categories: ['money', 'health'],
    focuses: ['life'],
    location: 'dining',
    narration: () =>
      `The dining hall poster says FUEL YOUR FUTURE. The future, today, is a chicken bowl for $11.40 that arrived tired.\n\nYour stomach is not interested in the brand voice.`,
    choices: () => [
      say('buy', 'Buy the bowl', 'It is food. It is not an experience. You stop being angry at inanimate objects, which is growth.', {
        effects: { money: -11.4, health: 3, energy: 4, happiness: -1 },
        tone: 'funny',
      }),
      say('cook', 'Cook the sad groceries you have', 'Pasta, egg, hot sauce, pride. The apartment smells like a person who is trying. You feel oddly fond of yourself.', {
        effects: { money: -3, health: 2, happiness: 3, energy: -2 },
        tone: 'warm',
        memory: 'You cooked instead of paying campus prices.',
      }),
      {
        id: 'skip-meal',
        label: 'Skip it',
        resolve: ({ rng }) => {
          const muffin = rng.chance(0.3);
          return {
            text: muffin
              ? 'You skip dinner and then buy a $7 coffee and a sad muffin at 10 p.m., which is a more expensive way to be hungry.'
              : 'You drink water and call it a plan. By morning you are unfun and functional.',
            effects: { health: -4, happiness: -3, stress: 2, money: muffin ? -9 : 0 },
            tone: 'brutal' as const,
          };
        },
      },
    ],
  }),
];

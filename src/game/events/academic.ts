import { majorById } from '../majors';
import { hasTrait } from '../traits';
import { ev, say, who } from './helpers';
import type { GameEvent } from './types';

export const academicEvents: GameEvent[] = [
  ev({
    id: 'lecture-nod',
    title: 'The lecture continues',
    weight: 4,
    categories: ['academic'],
    focuses: ['life', 'midterm'],
    location: 'lecture',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      return `The professor is halfway through ${major.exam.replace(/^an? /, 'the ')}. Around you, people nod with the confidence of those who will look this up later.\n\nYou understand the shape of the idea and almost none of the middle.`;
    },
    choices: () => [
      say('notes', 'Take honest notes', 'You write "I do not get this yet" in the margin, which is the first true sentence of the day. Later, it helps.', {
        effects: { termScore: 5, stress: 2, energy: -4 },
        memory: 'You stopped pretending you understood the lecture.',
        tone: 'warm',
      }),
      say('nod', 'Nod and hope', 'You perform comprehension. The performance is convincing. Your notes are a drawing of a rectangle.', {
        effects: { termScore: -4, stress: 3, social: 2 },
        tone: 'funny',
      }),
      say('office', 'Go to office hours after', 'The professor is less frightening in a chair. One example, said slowly, unlocks an hour of class.', {
        effects: { termScore: 7, stress: -2, reputation: 2 },
        rel: [{ who: 'mentor', affection: 4, trust: 3, memory: 'You actually came to office hours.' }],
        memory: 'Office hours were more useful than pride.',
        tone: 'warm',
      }),
      say('leave', 'Leave and get coffee', 'You miss the part that would have been on the exam. The coffee is seven dollars and tastes like a decision.', {
        effects: { money: -7, termScore: -6, happiness: 2, energy: 4 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'vague-spec',
    title: 'The assignment',
    weight: 4,
    categories: ['academic'],
    focuses: ['life'],
    location: 'library',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      if (s.character.majorId === 'cs' || s.character.majorId === 'engineering') {
        return `The project spec is ${major.project}. A classmate posts, "Are we allowed to use AI?" The professor replies, "Use good judgment."\n\nThis is not a spec. This is a vibe with a due date.`;
      }
      return `You have been assigned ${major.project}. The rubric rewards both "be original" and "follow the template exactly."\n\nSomeone in the group chat has already started a slide titled Synergy.`;
    },
    choices: (s) => {
      const tech = s.character.majorId === 'cs' || s.character.majorId === 'engineering';
      return [
        say('build', tech ? 'Build the plain version' : 'Do the assignment', 'You make the thing the professor can grade. It is not legendary. It exists, which is a genre.', {
          effects: { termScore: 6, skills: 4, energy: -6, stress: 3 },
          projects: 1,
          memory: tech ? 'You shipped a project the spec barely described.' : 'You turned in the project anyway.',
          tone: 'warm',
        }),
        say('ai', tech ? 'Let a chatbot write the first draft' : 'Let a tool draft it', tech
          ? 'The draft compiles and misunderstands the assignment in a fluent voice. You spend the night becoming its editor.'
          : 'The draft sounds like a person who has never been cold. You rewrite it until it has your fingerprints.', {
          effects: { termScore: 2, skills: 2, stress: 4, energy: -5 },
          projects: 1,
          tone: 'funny',
          memory: 'You learned that a machine can be confidently wrong.',
        }),
        say('group', 'Wait for the group', 'The group is also waiting. Two hours before the deadline, four people discover a shared calendar.', {
          effects: { termScore: -5, stress: 7, social: 2 },
          tone: 'funny',
        }),
        say('dance', 'Email an alternate proposal', 'You suggest the project could be an interpretive dance. You do this sober, which is the unsettling part.', {
          effects: { reputation: 1, stress: 2 },
          tone: 'absurd',
          memory: 'You asked if the paper could be a dance.',
          highlight: true,
        }, { wild: true }),
      ];
    },
  }),
  ev({
    id: 'group-project',
    title: 'Three people and a deadline',
    weight: 5,
    categories: ['academic', 'social'],
    focuses: ['midterm', 'life'],
    location: 'library',
    narration: (s) => {
      const n = who(s, 'network');
      return `The group project has four members. One of them is ${n.name}, who says "totally, I'll own that" and then becomes a rumor.\n\nThe deadline is a place you are all going to arrive, just not together.`;
    },
    speaker: (s) => {
      const n = who(s, 'network');
      return {
        name: n.name,
        line: "I'll do the slides tonight. Super pumped.",
        portrait: n.person.portrait,
      };
    },
    choices: () => [
      say('carry', 'Do the project yourself', 'You carry it. The grade is fine. Your opinion of teamwork is not. In the reflection you write "we collaborated," because the form has no box for the truth.', {
        effects: { termScore: 7, stress: 8, energy: -8, skills: 3, happiness: -3 },
        projects: 1,
        rel: [{ who: 'network', affection: -6, trust: -12, memory: 'They let you carry the project.' }],
        memory: 'You did the group project. The group was you.',
        tone: 'brutal',
        highlight: true,
      }),
      say('split', 'Force a real split', 'You send a list. Names next to tasks. It is unromantic and it works. Two people actually do their part.', {
        effects: { termScore: 5, stress: 3, reputation: 2 },
        projects: 1,
        rel: [{ who: 'network', trust: -4, affection: -2 }],
        memory: 'You made a group project behave like a project.',
        tone: 'warm',
      }),
      say('snitch', 'Tell the professor', 'The professor sighs the sigh of someone who has met students before. They offer a peer eval. It changes the grade a little and the air a lot.', {
        effects: { termScore: 3, stress: 4, reputation: -1 },
        rel: [{ who: 'network', affection: -10, trust: -8, memory: 'You told the professor.' }],
        tone: 'serious',
      }),
      say('same', 'Vanish too', 'You all receive the grade you collectively earned, which is a C with the confidence of a B. Nobody texts about it.', {
        effects: { termScore: -7, stress: -2, happiness: -2 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'midterm-wall',
    title: 'Midterm week',
    weight: 5,
    categories: ['academic'],
    focuses: ['midterm'],
    location: 'library',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      const job = s.job ? ` Your shift at ${s.job.title.toLowerCase()} does not observe midterms.` : '';
      return `Midterms arrive as ${major.exam}.${job}\n\nThe library smells like dry-erase markers and fear that has learned to whisper.`;
    },
    choices: (s) => [
      say('study', 'Cancel everything and study', 'You give the week to the exam. It is not noble. It is a trade, and the trade mostly works.', {
        effects: { termScore: 8, energy: -10, stress: 6, social: -4, happiness: -2 },
        memory: 'You disappeared into midterms and came back with a grade.',
        tone: 'serious',
      }),
      say('balance', 'Study in human portions', 'You sleep, you review, you eat something that is not a granola bar. The exam is hard and fair.', {
        effects: { termScore: 5, energy: -3, stress: 2 },
        tone: 'warm',
      }),
      ...(s.job
        ? [say('shifts', 'Keep every shift', 'You work. You glance at notes on the bus. The exam notices.', {
            effects: { termScore: -6, money: Math.round(s.job.weekly * 0.8), stress: 7, energy: -8 },
            memory: 'Work ate the midterm.',
            tone: 'brutal',
          })]
        : [say('help', 'Study with someone', 'You and a classmate teach each other the parts you each pretended to know. It is clumsier than a video and more useful.', {
            effects: { termScore: 6, social: 5, stress: -2 },
            ties: 1,
            rel: [{ who: 'friend', affection: 4, memory: 'You studied together.' }],
            tone: 'warm',
          })]),
      say('fate', 'Accept your fate', 'You walk in underprepared and oddly calm. The curve is either mercy or a rumor.', {
        effects: { termScore: s.character.luck >= 2 ? 4 : -8, stress: -3, happiness: 1 },
        tone: 'absurd',
        memory: 'You took a midterm on vibes.',
      }, { wild: true }),
    ],
  }),
  ev({
    id: 'office-hours',
    title: 'A chair across from a desk',
    weight: 3,
    categories: ['academic', 'warm'],
    focuses: ['midterm', 'life'],
    location: 'office',
    narration: (s) => {
      const m = who(s, 'mentor');
      const last = m.person.name.split(' ').slice(-1)[0];
      return `Prof. ${last}'s office has a plant that is trying. The door is open, which still feels like a trap.\n\n${m.p.cap} looks up like you are a person and not a roster number.`;
    },
    speaker: (s) => {
      const m = who(s, 'mentor');
      const last = m.person.name.split(' ').slice(-1)[0];
      return {
        name: `Prof. ${last}`,
        line: 'Tell me where it stopped making sense.',
        portrait: m.person.portrait,
      };
    },
    choices: () => [
      say('honest', 'Admit you are lost', 'You say the true sentence. The professor does not flinch. Twenty minutes later the chapter has a door in it.', {
        effects: { termScore: 6, stress: -6, happiness: 4 },
        rel: [{ who: 'mentor', affection: 8, trust: 8, known: true, memory: 'You told the truth in office hours.' }],
        recommendations: 0,
        memory: 'A professor met you where the lecture lost you.',
        tone: 'warm',
        highlight: true,
      }),
      say('rec', 'Ask about research', 'The conversation tilts from the exam to the work. It is not a promise. It is a path with your name near it.', {
        effects: { termScore: 2, skills: 3, network: 4 },
        research: true,
        gradIntent: 1,
        rel: [{ who: 'mentor', affection: 6, trust: 5, memory: 'You asked about their research.' }],
        memory: 'You asked a professor what the work actually is.',
        tone: 'warm',
      }),
      say('perform', 'Pretend you have a small question', 'You ask something safe. You leave with a polite answer and the same fog.', {
        effects: { termScore: 1, stress: 2 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'interpretive-dance',
    title: 'Thirty pages',
    weight: 3,
    once: true,
    categories: ['academic'],
    focuses: ['life', 'midterm'],
    years: [1, 2, 3, 4],
    location: 'dorm',
    narration: () =>
      `Your professor assigns a thirty-page paper. The prompt is serious. Your soul makes a small, unhelpful sound.\n\nThe document is named Final_Final_REAL.docx before it contains a single sentence.`,
    choices: (s) => [
      say('write', 'Start writing', 'You write badly, then less badly. Page thirty arrives like a bus: late, loud, sufficient.', {
        effects: { termScore: 7, energy: -8, stress: 5, skills: 2 },
        memory: 'You wrote the thirty pages.',
        tone: 'warm',
      }),
      say('hours', 'Take a draft to office hours', 'The professor crosses out your opening and somehow this feels like kindness. The paper gets a spine.', {
        effects: { termScore: 8, stress: -2, reputation: 2 },
        rel: [{ who: 'mentor', affection: 5, trust: 4 }],
        tone: 'warm',
      }),
      {
        id: 'dance',
        label: 'Propose interpretive dance instead',
        wild: true,
        detail: 'This can go strangely well, or into a file with your name on it.',
        resolve: ({ rng }) => {
          const delight = rng.chance(hasTrait(s, 'impulsive') ? 0.38 : 0.24);
          if (delight) {
            return {
              text: 'There is a long pause. Then the professor says, "Only if the dance has footnotes." You perform three minutes of sincere nonsense in an empty classroom. They laugh, horrified at themselves, and let you write eight pages instead of thirty. You will never be able to explain this at dinner.',
              effects: { termScore: 6, happiness: 8, reputation: 4, stress: -4 },
              memory: 'A professor accepted the dance.',
              tone: 'absurd',
              highlight: true,
            };
          }
          if (rng.chance(0.35)) {
            return {
              text: 'The professor forwards your email to the department with the subject line "please advise." You write the thirty pages anyway, now with an audience. The paper is fine. The legend is better, and slightly damaging.',
              effects: { termScore: 2, reputation: -3, stress: 6, happiness: 2 },
              memory: 'The dance email entered a file.',
              tone: 'absurd',
              highlight: true,
            };
          }
          return {
            text: 'The reply is two sentences. The paper is still thirty pages. Your joke has been graded as a request and denied. You begin writing, humbled by your own bit.',
            effects: { termScore: 3, stress: 4, happiness: -2 },
            memory: 'The professor declined the dance.',
            tone: 'funny',
          };
        },
      },
    ],
  }),
  ev({
    id: 'finals-night',
    title: 'Finals',
    weight: 5,
    categories: ['academic'],
    focuses: ['finals'],
    location: 'library',
    weather: 'night',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      return `Finals week at Calder has a color, and it is the blue-white of a screen at 2 a.m. ${major.exam[0]?.toUpperCase()}${major.exam.slice(1)} is tomorrow.\n\nYour body files a complaint your mind does not have time to read.`;
    },
    choices: () => [
      say('sleep', 'Sleep, then face it', 'You close the book while you still know your name. In the morning the material is smaller than your fear of it.', {
        effects: { termScore: 5, energy: 10, stress: -6, health: 3 },
        memory: 'You slept before the final.',
        tone: 'warm',
        highlight: true,
      }),
      say('grind', 'Study until the doors complain', 'You learn a surprising amount and forget what weather is. The exam goes well. The afternoon does not.', {
        effects: { termScore: 8, energy: -14, stress: 8, health: -4 },
        memory: 'You studied through the night and paid for it after.',
        tone: 'serious',
      }),
      say('friend', 'Quiz each other', 'You and a friend trade questions until the answers sound like English again. Nobody is impressive. Everybody is less alone.', {
        effects: { termScore: 6, social: 5, stress: -3, energy: -4 },
        rel: [{ who: 'friend', affection: 6, trust: 4, memory: 'You survived finals in the same room.' }],
        ties: 1,
        tone: 'warm',
      }),
      say('skip', 'Decide the final is a suggestion', 'It is not a suggestion. The grade book is humorless about this.', {
        effects: { termScore: -12, stress: -2, happiness: -4 },
        memory: 'You let a final happen without you.',
        tone: 'brutal',
      }),
    ],
  }),
  ev({
    id: 'energy-drinks',
    title: 'Sleep is a rumor',
    weight: 4,
    categories: ['academic', 'risk'],
    focuses: ['finals'],
    location: 'dorm',
    weather: 'night',
    narration: () =>
      `You are so tired the words on the page trade places when you blink. A row of energy drinks in the campus store glows like a bad idea with a price tag.\n\nThe exam is in nine hours. Your body would like to resign.`,
    choices: () => [
      say('sleep', 'Sleep', 'You choose the ancient technology. You wake up still tired and strangely more yourself.', {
        effects: { termScore: 4, energy: 12, stress: -5, health: 2 },
        tone: 'warm',
      }),
      say('steady', 'One coffee and a plan', 'You study the half you can hold. It is enough to look like a student and not a cautionary slide.', {
        effects: { termScore: 5, money: -7, energy: -2, stress: 2 },
        tone: 'serious',
      }),
      {
        id: 'five',
        label: 'Drink five energy drinks',
        wild: true,
        detail: 'Your heart will have notes.',
        resolve: ({ rng }) => {
          if (rng.chance(0.18)) {
            return {
              text: 'Your heart starts keeping a different time. A stranger in the library walks you to the clinic. The exam happens without you. You are embarrassed, and also still here, which the nurse seems to consider the point.',
              effects: { health: -22, stress: 10, termScore: -8, money: -60, energy: -10 },
              hospitalizations: 1,
              memory: 'Five energy drinks ended in the clinic.',
              tone: 'serious',
              highlight: true,
            };
          }
          if (rng.chance(0.45)) {
            return {
              text: 'You vibrate through the exam and write two brilliant paragraphs and one that is just the word "therefore" used as a lifestyle. The grade is better than your pulse.',
              effects: { termScore: 6, health: -8, energy: 6, stress: 6, happiness: 2 },
              memory: 'You caffeinated your way through a final.',
              tone: 'absurd',
              highlight: true,
            };
          }
          return {
            text: 'You are awake in the way a fire alarm is awake. The exam is a smear. Your hands shake on the walk home. Nothing mystical happens. You just feel awful.',
            effects: { termScore: -3, health: -10, stress: 8, energy: -6 },
            tone: 'brutal',
          };
        },
      },
      {
        id: 'fate',
        label: 'Simply accept your fate',
        wild: true,
        resolve: ({ state, rng }) => {
          const mercy = rng.chance(0.42) || state.character.luck > 2;
          return mercy
            ? {
                text: 'You sleep like a person who has made peace with mediocrity. The exam is curved so hard the class group chat calls it a religious event. You pass on the strength of other people\'s panic.',
                effects: { termScore: 5, energy: 8, stress: -8, happiness: 6 },
                memory: 'You accepted your fate and the curve accepted you.',
                tone: 'absurd',
                highlight: true,
              }
            : {
                text: 'You accept your fate. Your fate, it turns out, prepared. The exam is specific, cruel, and unrelated to vibes.',
                effects: { termScore: -9, energy: 6, stress: 4, happiness: -3 },
                memory: 'Fate was not in a generous mood.',
                tone: 'funny',
              };
        },
      },
    ],
  }),
  ev({
    id: 'dropped-exam',
    title: 'A small mercy',
    weight: 2,
    once: true,
    categories: ['academic', 'warm'],
    focuses: ['midterm', 'finals'],
    location: 'lecture',
    narration: () =>
      `The professor stands at the front and looks almost guilty. "I am dropping the lowest exam," they say. A person near you makes a sound usually reserved for sports.\n\nIt will not fix a semester. It will fix a Tuesday.`,
    choices: () => [
      say('relief', 'Take the mercy', 'A number you have been carrying gets smaller. You do not become a new person. You do unclench.', {
        effects: { termScore: 6, stress: -8, happiness: 6 },
        memory: 'A professor dropped the lowest exam.',
        tone: 'warm',
        highlight: true,
      }),
      say('push', 'Use the room to study harder', 'Mercy makes you bold instead of sleepy. You go back to the library while the feeling is still warm.', {
        effects: { termScore: 8, stress: -2, energy: -4 },
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'declare-major',
    title: 'The portal wants a noun',
    weight: 5,
    once: true,
    categories: ['academic'],
    focuses: ['life'],
    years: [1, 2],
    when: (s) => s.character.majorId === 'undeclared',
    location: 'office',
    narration: () =>
      `Undeclared is an honest description of your life. Calder would prefer a dropdown menu.\n\nAn advisor smiles with the warmth of a person who has this meeting eight more times today. "What do you love?" they ask, as if love files paperwork.`,
    choices: () => {
      const options = ['psychology', 'communications', 'business', 'history', 'art', 'cs'] as const;
      return [
        ...options.slice(0, 4).map((id) => {
          const major = majorById(id);
          return say(
            id,
            `Declare ${major.name}`,
            `You choose ${major.name}. The advisor looks relieved, which is not the same as you being sure. The portal accepts you. ${major.blurb}`,
            {
              memory: `You declared ${major.name}.`,
              tone: 'serious',
              highlight: true,
              majorId: id,
            },
          );
        }),
        say('wait', 'Stay undeclared a while longer', 'You keep the blank. It feels like freedom and also like a form you will be chased about.', {
          effects: { stress: 2, happiness: 2 },
          tone: 'warm',
        }),
      ];
    },
  }),
  ev({
    id: 'probation-letter',
    title: 'A letter with a smile',
    weight: 0,
    once: true,
    categories: ['academic'],
    when: () => false,
    location: 'dorm',
    narration: () =>
      `The subject line is "Checking in!" The body is academic probation.\n\nCalder wishes you a vibrant remainder of the term and attaches a PDF about resources. One of the resources is a workshop that conflicts with the job paying your rent.`,
    choices: () => [
      say('plan', 'Make an actual plan', 'You sit with the number instead of the exclamation point. The next exams get a calendar. It is not glamorous. It is a rope.', {
        effects: { termScore: 6, stress: 4, happiness: -2 },
        memory: 'Probation arrived dressed as a check-in.',
        tone: 'serious',
        highlight: true,
      }),
      say('ignore', 'Archive the email', 'The email fits perfectly in a folder called Later. Later is not a strategy. The GPA remains in the room.', {
        effects: { stress: 6, termScore: -2, happiness: -3 },
        tone: 'brutal',
      }),
      say('advisor', 'See an advisor', 'They are kinder than the email. They cannot take the class for you. They do help you drop the one that is already on fire.', {
        effects: { termScore: 4, stress: -3, network: 2 },
        tone: 'warm',
      }),
    ],
  }),
];

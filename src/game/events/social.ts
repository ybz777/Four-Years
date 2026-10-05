import { ev, say, who } from './helpers';
import type { GameEvent } from './types';

export const socialEvents: GameEvent[] = [
  ev({
    id: 'club-fair',
    title: 'Free pizza, theoretically',
    weight: 4,
    once: true,
    categories: ['social'],
    focuses: ['life'],
    years: [1, 2],
    location: 'quad',
    weather: 'golden',
    narration: () =>
      `The quad is a marketplace of folding tables. Future Leaders Society. The Young Professionals Network. Entrepreneurship Society. Consulting Club. Blockchain Innovation Club. Pre-Whatever Society.\n\nEvery table promises community. Most of them promise a LinkedIn post. One of them still has pizza.`,
    choices: () => [
      say('pizza', 'Join the club with the pizza', 'You join the Future Leaders Society because the pizza is real and the meeting is on a night you are free. The constitution is two sentences. The group chat is already muted by someone else.', {
        effects: { social: 4, happiness: 3, network: 2, stress: 1 },
        club: 'Future Leaders Society',
        ties: 1,
        memory: 'You joined a club for the free pizza.',
        tone: 'funny',
        highlight: true,
      }),
      say('real', 'Join the one that does something', 'The tutoring collective meets in a ugly room and does not have a backdrop. They need people. You stay. It is not content. It is useful.', {
        effects: { social: 3, skills: 3, reputation: 3, network: 2, energy: -3 },
        club: 'Harbor Tutoring Collective',
        ties: 1,
        memory: 'You joined a club that actually met.',
        tone: 'warm',
        highlight: true,
      }),
      say('none', 'Take a flyer and leave', 'You leave with three QR codes and no new friends. The quad is beautiful anyway. You had forgotten to look up.', {
        effects: { happiness: 2, stress: -2 },
        tone: 'warm',
      }),
      say('all', 'Sign every sheet', 'Your inbox becomes a small weather system. You are vice president of nothing and cc’d on everything. One club will later ask you to "hop on a quick call."', {
        effects: { network: 5, stress: 5, social: 2, happiness: -1 },
        club: 'several clubs, spiritually',
        memory: 'You joined every club and belonged to none.',
        tone: 'absurd',
      }, { wild: true }),
    ],
  }),
  ev({
    id: 'future-leaders',
    title: 'The networking summit',
    weight: 4,
    categories: ['social', 'career'],
    focuses: ['life'],
    years: [2, 3, 4],
    location: 'career',
    narration: () =>
      `You attend the Future Leaders Networking Summit in a room that has been carpeted within an inch of its life. Name tags. A bowl of candy. A slide that says ELEVATE YOUR CIRCLE.\n\nYou arrived eleven minutes late. The free pizza has achieved its destiny without you.`,
    choices: () => [
      say('mingle', 'Do the circuit', 'You shake four hands and remember one name. Someone says "we should grab coffee" in a tone that means never. You gain a connection and lose an afternoon.', {
        effects: { network: 4, energy: -5, stress: 2, happiness: -1 },
        ties: 1,
        memory: 'The summit gave you one connection and no pizza.',
        tone: 'funny',
        highlight: true,
      }),
      say('leave', 'Leave and study', 'You escape before the icebreaker. The library is quieter than ambition. Your resume does not improve. Your chapter does.', {
        effects: { termScore: 4, stress: -2, network: -1 },
        tone: 'warm',
      }),
      say('honest', 'Tell someone the event is empty', 'A stranger laughs in recognition. You talk for twenty minutes about nothing strategic. It is the only networking that works.', {
        effects: { social: 5, happiness: 4, network: 2 },
        ties: 1,
        memory: 'You skipped the script and met a person.',
        tone: 'warm',
        highlight: true,
      }),
    ],
  }),
  ev({
    id: 'quad-light',
    title: 'The light does something',
    weight: 3,
    once: true,
    categories: ['warm'],
    focuses: ['life'],
    location: 'quad',
    weather: 'golden',
    narration: (s) => {
      const friend = who(s, 'friend');
      return `You are cutting across the quad because you are late, and then you are not late, because the light has laid itself down in the grass like it paid tuition.\n\n${friend.name} is on the steps, squinting, already smiling as if they saved you a seat in the afternoon.`;
    },
    speaker: (s) => {
      const friend = who(s, 'friend');
      return { name: friend.name, line: 'Sit down. The email can wait. The light will not.', portrait: friend.person.portrait };
    },
    choices: () => [
      say('stay', 'Sit down', 'You sit. Nothing is optimized. A dog goes by. Your friend says your name the way people do when they mean it. For ten minutes the brochure is accidentally telling the truth.', {
        effects: { happiness: 8, stress: -8, social: 3, energy: 2 },
        rel: [{ who: 'friend', affection: 8, trust: 5, memory: 'You sat in the light and did not check your phone.' }],
        memory: 'There was an afternoon on the quad that was simply good.',
        tone: 'warm',
        highlight: true,
      }),
      say('photo', 'Try to photograph it', 'The photo is almost right and therefore wrong. You put the phone away and look with your eyes, like an amateur at being alive.', {
        effects: { happiness: 5, stress: -4 },
        memory: 'You tried to keep the light and then just looked at it.',
        tone: 'warm',
        highlight: true,
      }),
      say('go', 'Keep walking. You are late.', 'You are on time to a thing that does not remember you. The light continues without an audience. You think about it in the stairwell.', {
        effects: { termScore: 2, happiness: -1, stress: 1 },
        tone: 'serious',
      }),
    ],
  }),
  ev({
    id: 'rain-friend',
    title: 'The library in the rain',
    weight: 3,
    once: true,
    categories: ['warm', 'social'],
    focuses: ['life', 'midterm'],
    location: 'library',
    weather: 'rain',
    narration: (s) => {
      const friend = who(s, 'friend');
      return `Rain makes a job of the windows. You meant to outline a chapter. ${friend.name} sits down without asking and slides you a coffee they cannot really afford either.\n\nNeither of you is impressive tonight. That seems to be the point.`;
    },
    choices: () => [
      say('stay-talk', 'Close the laptop', 'You talk until the rain thins. It is not advice. It is company. You walk out into a cleaner air and a worse outline, and you would not undo it.', {
        effects: { happiness: 7, stress: -7, social: 4, termScore: -1 },
        rel: [{ who: 'friend', affection: 10, trust: 8, memory: 'A rainy night in the library, laptops closed.' }],
        memory: 'A friend sat with you in the library while it rained.',
        tone: 'warm',
        highlight: true,
      }),
      say('both', 'Study, but together', 'You work in the same quiet. Occasionally one of you snorts at a sentence. The chapter gets finished. So does a loneliness you did not want to name.', {
        effects: { termScore: 4, happiness: 4, stress: -3, social: 2 },
        rel: [{ who: 'friend', affection: 5, trust: 4 }],
        tone: 'warm',
      }),
      say('rush', 'Take the coffee and keep grinding', 'You thank them and stay inside the assignment. They understand. They also look, for a second, like a person who hoped for more than thanks.', {
        effects: { termScore: 5, happiness: -2, stress: 2 },
        rel: [{ who: 'friend', affection: -3, memory: 'You took the coffee and not the hour.' }],
        tone: 'serious',
      }),
    ],
  }),
  ev({
    id: 'referral',
    title: 'Long time no see',
    weight: 4,
    once: true,
    categories: ['social', 'career'],
    focuses: ['life'],
    years: [2, 3, 4],
    location: 'cafe',
    narration: (s) => {
      const n = who(s, 'network');
      return `You have not heard from ${n.name} in months. The silence was not mysterious. It was complete.\n\nTonight the phone lights up anyway.`;
    },
    speaker: (s) => {
      const n = who(s, 'network');
      return {
        name: n.name,
        line: 'Hey!! Long time no see. Could you refer me for that internship? You are literally the best.',
        portrait: n.person.portrait,
      };
    },
    choices: (s) => {
      const n = who(s, 'network');
      return [
        {
          id: 'help',
          label: 'Send the referral',
          resolve: ({ rng }) => {
            if (rng.chance(0.55)) {
              return {
                text: `You write the note. ${n.name} gets an interview and forgets to tell you until a story post appears: "grateful for my people." You are not tagged. You are, technically, one of the people.`,
                effects: { network: 2, happiness: -3, stress: 2, reputation: 1 },
                rel: [{ who: 'network', affection: 6, trust: -8, memory: 'You referred them. They posted around you.' }],
                memory: `${n.name} reappeared to ask for a referral.`,
                tone: 'brutal',
                highlight: true,
              };
            }
            return {
              text: `You send the referral. ${n.name} does not get the job, and for once they tell you the truth about it. The coffee they owe you remains theoretical. The honesty is new.`,
              effects: { network: 1, happiness: 1 },
              rel: [{ who: 'network', affection: 3, trust: 4, memory: 'You referred them and they actually reported back.' }],
              memory: `You referred ${n.name} after months of silence.`,
              tone: 'serious',
            };
          },
        },
        say('ignore', 'Leave it on read', `${n.name} will tell a mutual friend that you changed. You have. You also have a boundary. Both facts can sit in the same week.`, {
          effects: { stress: -2, reputation: -2, happiness: 1 },
          rel: [{ who: 'network', affection: -8, trust: -4, memory: 'You did not answer the referral text.' }],
          memory: `You ignored ${n.name}'s sudden friendship.`,
          tone: 'serious',
        }),
        say('why', 'Ask where they went', `${n.name} sends three voice notes and no answer. The request remains at the bottom, wearing a smile. You understand the shape of the relationship with unpleasant clarity.`, {
          effects: { stress: 2, social: 1 },
          rel: [{ who: 'network', affection: -2, trust: -6, memory: 'You asked why they disappeared. They pivoted.' }],
          tone: 'funny',
          memory: `You asked ${n.name} why they disappeared. They changed the subject to your network.`,
        }),
        say('coffee', 'Make them buy the coffee first', `They buy the $7 coffee with the face of a person paying a toll. You hear them out. You send a modest referral. You drink the coffee slowly. It is the most honest transaction you have had all term.`, {
          effects: { happiness: 3, money: 0, network: 1 },
          rel: [{ who: 'network', affection: 2, trust: 1, memory: 'They bought the coffee. You still knew what it was.' }],
          memory: `${n.name} bought you coffee and still wanted the favor.`,
          tone: 'funny',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'notes-ask',
    title: 'Can you send the notes',
    weight: 3,
    categories: ['social', 'academic'],
    focuses: ['life', 'midterm'],
    location: 'lecture',
    narration: (s) => {
      const n = who(s, 'network');
      return `${n.name} slides into the seat they do not usually occupy. They laugh at something you did not say.\n\n"Did you catch lecture? My notes app crashed," they say, to a notes app that has never been opened.`;
    },
    choices: (s) => {
      const n = who(s, 'network');
      return [
        say('send', 'Send the notes', `You send them. It costs you nothing visible. ${n.name} says you are a lifesaver, which is a large title for a PDF.`, {
          effects: { social: 2, stress: 1 },
          rel: [{ who: 'network', affection: 3, trust: -2, memory: 'They needed the notes again.' }],
          tone: 'funny',
        }),
        say('no', 'Say no, cleanly', `"I can't this time." The sentence stands up by itself. ${n.name} finds another lifesaver before the hour is over.`, {
          effects: { stress: -2, happiness: 1 },
          rel: [{ who: 'network', affection: -4, memory: 'You did not send the notes.' }],
          tone: 'warm',
        }),
        say('trade', 'Trade for something real', 'You ask them to explain the discussion section you missed. They actually can. The exchange is so fair you both get suspicious.', {
          effects: { termScore: 3, social: 2 },
          rel: [{ who: 'network', trust: 4, affection: 2, memory: 'You made the notes a trade.' }],
          tone: 'warm',
        }),
      ];
    },
  }),
  ev({
    id: 'party',
    title: 'A house near campus',
    weight: 4,
    categories: ['social', 'risk'],
    focuses: ['life'],
    terms: ['fall', 'spring'],
    location: 'party',
    weather: 'night',
    narration: (s) => {
      const friend = who(s, 'friend');
      return `The house is too warm and the music has opinions. ${friend.name} texted "come if you want," which is the only honest invitation of the term.\n\nA plastic cup is pressed toward you by someone whose name is already lost to the hallway.`;
    },
    choices: () => [
      say('drink', 'Stay and drink', 'You drink enough to sand the week down. People are funnier. So are your decisions. The night will want a ride home, and that is a separate question.', {
        effects: { happiness: 4, social: 5, stress: -4, energy: -8, health: -4, money: -12 },
        queue: ['getting-home'],
        flags: { drank: true },
        ties: 1,
        memory: 'You drank at a house party and the night kept going.',
        tone: 'serious',
      }),
      say('sober', 'Stay and do not drink', 'You hold a cup of something honest and watch your friends become louder. Someone cries in the kitchen and you are useful. You get home with your name intact.', {
        effects: { social: 4, happiness: 3, stress: -2, energy: -4, reputation: 2 },
        rel: [{ who: 'friend', affection: 5, trust: 6, memory: 'You stayed sober and still stayed.' }],
        ties: 1,
        memory: 'You went to the party and kept your head.',
        tone: 'warm',
        highlight: true,
      }),
      say('study', 'Skip it and study', 'The bass reaches your room anyway. You finish a problem set while other people finish a story. Both are ways to spend a Thursday.', {
        effects: { termScore: 4, social: -2, stress: 2, happiness: -1 },
        tone: 'serious',
      }),
      {
        id: 'pill',
        label: 'Take what a stranger hands you',
        serious: true,
        detail: 'You do not know what it is.',
        resolve: ({ rng }) => {
          if (rng.chance(0.045)) {
            const text =
              'What you took was stronger than the party, and stronger than you. The night ends in an ambulance and does not start again. There is no joke here. There is a silence where the rest of the years would have been.';
            return {
              text,
              fatal: { reason: 'overdose', text },
              tone: 'serious',
              highlight: true,
              memory: 'A night at a party ended everything.',
            };
          }
          if (rng.chance(0.22)) {
            return {
              text: 'The room tilts further than a room should. Voices arrive from far away. Someone — you will not remember who — gets you to a hospital. You do not die. You also do not get the night back, or the easy story about it.',
              effects: { health: -36, stress: 12, happiness: -8, energy: -16 },
              hospitalizations: 1,
              memory: 'A stranger\'s pill ended the night in a hospital.',
              tone: 'serious',
              highlight: true,
            };
          }
          if (rng.chance(0.45)) {
            return {
              text: 'You spend the night ill and frightened in a bathroom while the music continues, indifferent. A friend finds you. In the morning your body is yours again, and you are done pretending that was a story worth having.',
              effects: { health: -16, stress: 8, happiness: -6, energy: -12 },
              rel: [{ who: 'friend', affection: 4, trust: 3, memory: 'They found you when the party went wrong.' }],
              memory: 'You took something unknown and spent the night sick.',
              tone: 'serious',
              highlight: true,
            };
          }
          return {
            text: 'Mostly, you lose time. The morning is thick and ashamed. Nothing cinematic happened. That is not the same as nothing.',
            effects: { health: -8, stress: 5, happiness: -4, energy: -10, termScore: -2 },
            memory: 'You took something at a party and lost the night.',
            tone: 'serious',
          };
        },
      },
      say('dj', 'Appoint yourself the DJ', 'You possess one (1) song and a laptop. For nine minutes the house is united in confusion. Then someone takes the aux back, gently, like removing a knife from a child. You will be discussed.', {
        effects: { social: 4, reputation: 2, happiness: 5, stress: -2 },
        memory: 'You DJed a party with one song.',
        tone: 'absurd',
        highlight: true,
      }, { wild: true }),
    ],
  }),
  ev({
    id: 'linkedin',
    title: 'Thrilled to announce',
    weight: 3,
    categories: ['social', 'career'],
    focuses: ['life'],
    years: [2, 3, 4],
    location: 'cafe',
    narration: (s) => {
      const n = who(s, 'network');
      return `${n.name} has posted a photo of a lanyard. "Humbled and excited to share that I will be joining a team this summer as a Something Associate (incoming)!"\n\nSixty people are proud. You are holding a sandwich you cannot afford and a feeling you do not want to name.`;
    },
    choices: (s) => {
      const n = who(s, 'network');
      return [
        say('scroll', 'Scroll and close it', 'You let the feeling pass through like weather. Their summer is not your verdict. You still check the post twice. Fine.', {
          effects: { stress: 2, happiness: -2 },
          tone: 'serious',
        }),
        say('apply', 'Use the sting as fuel', 'You update the resume before the sandwich is gone. It is not jealousy if it becomes a document. It is also jealousy.', {
          effects: { stress: 3, skills: 1, network: 1 },
          applications: 6,
          memory: 'Someone else\'s announcement sent you back to the applications.',
          tone: 'serious',
        }),
        say('text', 'Text them something true', `You write "happy for you" and, unusually, mean a percentage of it. ${n.name} replies with a voice note that is 80% LinkedIn. Still, they say your name.`, {
          effects: { social: 2, happiness: 1, network: 2 },
          rel: [{ who: 'network', affection: 3, memory: 'You congratulated them and almost meant it.' }],
          tone: 'warm',
        }),
        say('post', 'Post your own humble announcement', 'You announce that you are "excited to lean into growth." You have announced a mood. Three relatives like it. A recruiter does not.', {
          effects: { network: 1, happiness: -1, reputation: -1 },
          memory: 'You posted a LinkedIn announcement about a feeling.',
          tone: 'absurd',
          highlight: true,
        }, { wild: true }),
      ];
    },
  }),
  ev({
    id: 'mentor-kind',
    title: 'Your name, said correctly',
    weight: 3,
    once: true,
    categories: ['warm', 'academic'],
    focuses: ['life', 'midterm'],
    years: [2, 3, 4],
    location: 'office',
    narration: (s) => {
      const m = who(s, 'mentor');
      const last = m.person.name.split(' ').slice(-1)[0];
      return `You are almost out the door of Prof. ${last}'s office when ${m.p.sub} says your name the way a person does when they have been paying attention.\n\n"This is hard," ${m.p.sub} says. "You are not behind. You are inside it."`;
    },
    choices: () => [
      say('hear', 'Let it land', 'You do not deflect. The sentence stays with you on the stairs, which is as far as some kindness needs to travel.', {
        effects: { happiness: 7, stress: -6, termScore: 2 },
        rel: [{ who: 'mentor', affection: 8, trust: 8, memory: 'They told you that you were inside it, not behind.' }],
        memory: 'A professor said your name and meant that you were doing all right.',
        tone: 'warm',
        highlight: true,
      }),
      say('ask', 'Ask what they would do next', 'They do not hand you a destiny. They hand you a next step small enough to finish this week. You finish it.', {
        effects: { skills: 3, termScore: 4, stress: -3, network: 2 },
        gradIntent: 1,
        rel: [{ who: 'mentor', affection: 6, trust: 6 }],
        tone: 'warm',
      }),
    ],
  }),
];

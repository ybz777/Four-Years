import { backgroundById } from '../backgrounds';
import { majorById } from '../majors';
import { ev, say, who } from './helpers';
import type { GameEvent } from './types';

const ORGS = [
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

export const careerEvents: GameEvent[] = [
  ev({
    id: 'career-fair',
    title: 'The career fair',
    weight: 5,
    categories: ['career'],
    focuses: ['life', 'midterm'],
    years: [2, 3, 4],
    terms: ['fall', 'spring'],
    location: 'career',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      return `The gym has been converted into hope with tablecloths. A banner says MEET YOUR FUTURE. Recruiters smile in identical lanyards.\n\nYou say "${major.name}" and watch the smile become a QR code. "Apply online," they say, warmly, as if the sentence were a gift.`;
    },
    choices: () => [
      say('circuit', 'Do the whole circuit', 'You collect pens, mints, and twelve instructions to apply online. One person actually looks at your resume. They nod like a door that is not locked, exactly, but is not open.', {
        effects: { network: 4, stress: 3, energy: -5, reputation: 1 },
        applications: 8,
        ties: 1,
        memory: 'The career fair told you to apply online.',
        tone: 'funny',
        highlight: true,
      }),
      say('one', 'Talk to one person like a human', 'You skip the pitch. You ask what they actually do on Tuesdays. The recruiter looks relieved and tells you. You leave with a name, not a destiny.', {
        effects: { network: 6, stress: -1, skills: 1 },
        ties: 1,
        memory: 'One recruiter talked to you like a person.',
        tone: 'warm',
        highlight: true,
      }),
      say('leave', 'Leave and work on a project', 'The gym is a mirage. A finished project is a fact. You spend the hour making something you can point at.', {
        effects: { skills: 4, stress: 1, termScore: 1 },
        projects: 1,
        tone: 'serious',
      }),
    ],
  }),
  ev({
    id: 'career-center',
    title: 'The career center',
    weight: 3,
    once: true,
    categories: ['career'],
    focuses: ['life'],
    years: [3, 4],
    location: 'office',
    narration: () =>
      `The career center has a bowl of candy and a portal. Your appointment begins twelve minutes late and ends with a handout titled Elevating Your Narrative.\n\nThe counselor is kind. The handout was written in 2014 and is not ashamed.`,
    choices: () => [
      say('listen', 'Take the useful third of the advice', 'Buried in the synergy there is a true thing: your resume is a list of duties, not decisions. You rewrite three bullets. They start to sound like you did something.', {
        effects: { skills: 3, stress: -2, reputation: 2 },
        memory: 'The career center was mostly a PDF. Three bullets were real.',
        tone: 'warm',
      }),
      say('mock', 'Book a mock interview', 'A stranger asks you to tell them about yourself. You hear the answer fail in real time, which is a gift you did not want and needed.', {
        effects: { skills: 4, stress: 4, network: 1 },
        interviews: 1,
        memory: 'A mock interview showed you the flinch.',
        tone: 'serious',
      }),
      say('portal', 'Smile and return to the portal', 'You leave with a mint and the same twelve tabs. The candy is good. The future is not in the candy.', {
        effects: { stress: 2, happiness: -1 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'entry-level',
    title: 'Entry level',
    weight: 4,
    categories: ['career'],
    focuses: ['life', 'midterm'],
    years: [3, 4],
    location: 'library',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      const role = major.roles[0] ?? 'Associate';
      return `The posting is titled ${role} I. It is entry level. It requires three years of experience, a portfolio, and "a passion for excellence."\n\nThe wage is polite. The adjectives are not.`;
    },
    choices: (s) => [
      say('apply', 'Apply anyway', 'You apply as the person you are, not the person in the ad. The portal accepts the file. Acceptance, here, means the file did not bounce.', {
        effects: { stress: 3, energy: -3 },
        applications: 4,
        memory: 'You applied to an entry-level job that wanted a veteran.',
        tone: 'funny',
        highlight: true,
      }),
      {
        id: 'pad',
        label: 'Pad the resume',
        wild: true,
        detail: 'Someone may notice.',
        resolve: ({ rng }) => {
          if (rng.chance(0.22)) {
            return {
              text: 'A human reads it. A human notices. The rejection is specific, which is almost an honor. Your reputation in one small inbox is "do not."',
              effects: { reputation: -6, stress: 6, happiness: -3 },
              applications: 1,
              memory: 'A padded resume got caught.',
              tone: 'brutal',
              highlight: true,
            };
          }
          if (rng.chance(0.35)) {
            return {
              text: 'The padding buys a screen. You are not ready for the screen. You learn this live, in a video box, while your own face watches you.',
              effects: { stress: 5, skills: 1, reputation: -1 },
              applications: 1,
              interviews: 1,
              memory: 'An inflated resume got you an interview you felt in your teeth.',
              tone: 'serious',
            };
          }
          return {
            text: 'The portal swallows the prettier version of you and says nothing. The silence is the same silence honest people receive. You have spent a piece of integrity on a null result.',
            effects: { stress: 3, happiness: -2 },
            applications: 1,
            ghosts: 1,
            memory: 'You padded a resume and the void did not care.',
            tone: 'serious',
          };
        },
      },
      say('project', 'Build the thing they want instead', `You spend the week on a small, real ${s.character.majorId === 'art' ? 'piece' : 'project'}. It will not satisfy the posting. It will satisfy a better conversation later.`, {
        effects: { skills: 5, energy: -6, stress: 2 },
        projects: 1,
        memory: 'You answered a ridiculous posting by making something.',
        tone: 'warm',
      }),
      say('skip', 'Close the tab', 'You refuse the theater. The tab dies. The rent does not. Still, you keep an hour of your life.', {
        effects: { stress: -2, happiness: 1 },
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'ai-market',
    title: 'The junior seat',
    weight: 4,
    categories: ['career'],
    focuses: ['life'],
    years: [3, 4],
    location: 'cafe',
    narration: (s) => {
      const major = s.character.majorId;
      const line =
        major === 'cs' || major === 'engineering'
          ? 'A posting for junior developers has been rewritten overnight. The new sentence is "AI-assisted." The old sentence, the job, is gone.'
          : major === 'art' || major === 'communications'
            ? 'A studio wants a junior who can "direct the tools." The tools are doing the part you went into debt to learn. The directing pays like an internship that lost its nerve.'
            : 'An entry role you have been watching vanishes into "the team is leveraging automation." The email wishes you a vibrant search.';
      return `${line}\n\nEveryone at the next table is discussing it in the tone of people who would like to be early rather than replaced.`;
    },
    choices: () => [
      say('learn', 'Learn the tool without worshipping it', 'You spend a week seeing what it can do and where it invents. The skill is real. The panic is not a plan. You keep both in view.', {
        effects: { skills: 5, stress: 3, energy: -4 },
        memory: 'You learned the new tools without handing them your whole job.',
        tone: 'serious',
        highlight: true,
      }),
      say('spray', 'Apply to forty more jobs', 'You become a person who applies. The applications leave. A few automated replies thank you for your vibrant interest. Your soul files a complaint.', {
        effects: { stress: 7, happiness: -4, energy: -6 },
        applications: 40,
        ghosts: 12,
        memory: 'You applied to forty jobs and the void applied back.',
        tone: 'brutal',
        highlight: true,
      }),
      say('mentor', 'Ask your professor what they are seeing', 'They do not pretend the market is a moral test. They tell you which skills are still human and which line on your resume is decoration. You leave angrier and clearer.', {
        effects: { stress: -2, skills: 2, network: 2 },
        gradIntent: 1,
        rel: [{ who: 'mentor', affection: 4, trust: 4, memory: 'You asked them about the market honestly.' }],
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'leetcode',
    title: 'The puzzle that ate the month',
    weight: 3,
    categories: ['career', 'academic'],
    focuses: ['life', 'midterm'],
    years: [2, 3, 4],
    when: (s) => s.character.majorId === 'cs' || s.character.majorId === 'engineering',
    location: 'library',
    weather: 'night',
    narration: (s) => {
      const friend = who(s, 'friend');
      return `${friend.name} says the puzzles are "kind of relaxing." On the screen, a problem asks you to invent a tree as if that were a personality.\n\nSomewhere a company believes this is the same skill as doing the job.`;
    },
    choices: () => [
      say('practice', 'Practice, with a timer and a limit', 'You do an hour, then stop, like a person with a life. A few patterns stick. You do not become the sort of monk the forums recommend.', {
        effects: { skills: 4, stress: 3, energy: -4, termScore: -1 },
        memory: 'You practiced interviews without letting them eat the month.',
        tone: 'serious',
      }),
      say('obsess', 'Let it become the personality', 'You grind until your dreams have indices. You get faster. You also forget a friend\'s birthday, which does not appear in the solution.', {
        effects: { skills: 8, stress: 8, happiness: -5, social: -4, energy: -8 },
        rel: [{ who: 'friend', affection: -4, memory: 'The puzzles ate your attention.' }],
        memory: 'Interview prep swallowed a month.',
        tone: 'brutal',
        highlight: true,
      }),
      say('refuse', 'Refuse the puzzle cult', 'You put the time into a project a human can use. If a company needs you to invert a binary tree on a whiteboard, they may not be your company. This is either wisdom or cope. You choose it anyway.', {
        effects: { skills: 3, happiness: 2, stress: -2 },
        projects: 1,
        tone: 'warm',
        memory: 'You skipped the puzzle grind and built something instead.',
      }),
    ],
  }),
  ev({
    id: 'ghosted',
    title: 'We were impressed by the volume',
    weight: 4,
    categories: ['career'],
    focuses: ['life', 'summer'],
    years: [3, 4],
    when: (s) => s.applications >= 4 || s.time.year === 4,
    location: 'dorm',
    narration: () =>
      `The email arrives at 6:12 a.m., which is a cruel hour for a form letter.\n\n"We were impressed by the volume of talented applicants." They do not say your name in the sentence that matters. The role has been filled, or vanished, or was never a role so much as a net.`,
    choices: () => [
      say('log', 'Log it and keep going', 'You add a tick to a private count. The count is not your worth. It is data. You send two more applications before breakfast and then you eat.', {
        effects: { stress: 3, happiness: -2 },
        applications: 2,
        ghosts: 1,
        memory: 'A rejection praised the volume of applicants.',
        tone: 'serious',
      }),
      say('break', 'Take the day off the portal', 'You close the laptop and walk until your thoughts change temperature. The email will be there tomorrow. So, unfortunately, will you.', {
        effects: { stress: -4, happiness: 2, energy: 4 },
        ghosts: 1,
        tone: 'warm',
        memory: 'You let a rejection sit for a day.',
      }),
      say('mentor-note', 'Forward it to your mentor', 'They reply with one line: "This is the market, not a verdict." It does not get you a job. It gets you through a Tuesday.', {
        effects: { stress: -3, happiness: 3 },
        ghosts: 1,
        rel: [{ who: 'mentor', affection: 3, trust: 3, memory: 'You showed them the rejection.' }],
        tone: 'warm',
        highlight: true,
      }),
    ],
  }),
  ev({
    id: 'unpaid',
    title: 'Great exposure',
    weight: 4,
    categories: ['career', 'money'],
    focuses: ['summer', 'life'],
    years: [2, 3],
    location: 'office',
    narration: (s) => {
      const org = 'Little Lantern Studio';
      const bg = backgroundById(s.character.backgroundId);
      return `${org} would love to have you. The role is unpaid, remote-in-theory, and rich in exposure. Exposure, you notice, does not swipe at a register.\n\n${bg.id === 'wealthy' || bg.id === 'upper-middle' ? 'Your family could cover the summer. That is a fact, not a personality.' : 'Taking it means the dining-hall job goes, and the dining-hall job is how you eat.'}`;
    },
    choices: (s) => {
      const bg = backgroundById(s.character.backgroundId);
      const painful = bg.unpaidEase < 0.5;
      return [
        say('take', 'Take the unpaid role', painful
          ? 'You take it. The work is real and the fridge gets theoretical. You learn the job and the particular anger of being useful for free. By August you have a line on a resume and a new respect for your own limits.'
          : 'You take it. The work is real. Someone at home makes the summer possible, and you try not to narrate that as grit. You leave with a skill and a debt to the truth.', {
          effects: { skills: 10, network: 6, stress: painful ? 10 : 4, happiness: painful ? -4 : 1, money: painful ? -500 : -120, reputation: 3 },
          internship: { title: 'Unpaid associate', org: 'Little Lantern Studio', paid: false },
          flags: { tookUnpaid: true },
          memory: 'You took an unpaid summer and called it what it was.',
          tone: 'serious',
          highlight: true,
        }),
        say('refuse', 'Keep the paid work', 'You decline with a polite sentence and an impolite feeling. The paid hours are less glamorous and more edible. Your skills grow slower. Your account does not panic.', {
          effects: { money: 900, skills: 3, stress: -2 },
          memory: 'You turned down unpaid exposure and kept the paycheck.',
          tone: 'warm',
          highlight: true,
        }),
        say('negotiate', 'Ask for a stipend', 'You ask. There is a pause, then a bus voucher and the word "unfortunately." You have your answer. You also have the rare feeling of having named a price.', {
          effects: { reputation: 2, stress: 2, money: 40, skills: 1 },
          memory: 'You asked an unpaid internship to pay you. They offered a voucher.',
          tone: 'funny',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'grad-talk',
    title: 'Have you thought about graduate school',
    weight: 6,
    once: true,
    categories: ['career', 'academic'],
    focuses: ['life', 'midterm'],
    years: [2, 3, 4],
    location: 'office',
    narration: (s) => {
      const m = who(s, 'mentor');
      const last = m.person.name.split(' ').slice(-1)[0];
      const major = majorById(s.character.majorId);
      return `Prof. ${last} asks it casually, which is how serious questions dress. Graduate school. A ${major.programs[0]?.degree ?? "master's"} in ${major.programs[0]?.name ?? major.name}.\n\nIt is not an escape from the market. It is a different bill, a different room, and more years of becoming.`;
    },
    choices: () => [
      say('yes', 'Say you have been thinking about it', 'You have, even if the thought was only a shape. The professor tells you what a real application needs: grades, a person who will write honestly, and a question you can stand.', {
        effects: { stress: 2, skills: 1 },
        gradIntent: 2,
        recommendations: 1,
        rel: [{ who: 'mentor', affection: 5, trust: 6, memory: 'You talked about graduate school seriously.' }],
        memory: 'A professor asked about graduate school and you did not dodge.',
        tone: 'serious',
        highlight: true,
      }),
      say('research', 'Ask to try the work first', 'They put you on a small piece of the real work. It is slower than a fantasy and more interesting. You find out whether you like the life or only the title.', {
        effects: { skills: 4, stress: 3, energy: -4, termScore: 1 },
        research: true,
        gradIntent: 1,
        recommendations: 1,
        memory: 'You tried research before you tried an application.',
        tone: 'warm',
        highlight: true,
      }),
      say('no', 'Say you want a job, plainly', 'They do not flinch. Not every mind needs another degree to be a mind. They offer to look at your resume instead. The offer is ordinary and huge.', {
        effects: { stress: -2, network: 2 },
        rel: [{ who: 'mentor', trust: 4, memory: 'You said you wanted work, not more school.' }],
        memory: 'You told a professor you were aiming at a job.',
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'recommendation',
    title: 'Would you write for me',
    weight: 3,
    once: true,
    categories: ['career'],
    focuses: ['life'],
    years: [3, 4],
    when: (s) => s.gradIntent > 0 || s.applications > 0 || s.time.year === 4,
    location: 'office',
    narration: (s) => {
      const m = who(s, 'mentor');
      const last = m.person.name.split(' ').slice(-1)[0];
      return `You ask Prof. ${last} for a letter. The pause is the length of their memory of you.\n\nLetters are not favors exactly. They are a person putting their name next to yours in a room you cannot enter.`;
    },
    choices: (s) => {
      const known = s.cast.mentor.affection >= 8 || s.research;
      return [
        say('ask', 'Ask directly', known
          ? 'They say yes, and they mean a real letter, not a template with your name poured in. You leave the office lighter by one future.'
          : 'They say they can write that you attended. You hear the difference. It is fair. It is also a small cold front.', {
          effects: { stress: known ? -4 : 3, happiness: known ? 4 : -1 },
          recommendations: known ? 1 : 0,
          rel: [{ who: 'mentor', affection: known ? 4 : -1, trust: known ? 4 : 1, memory: known ? 'They agreed to write a real letter.' : 'They could only write a thin letter.' }],
          memory: known ? 'A professor agreed to recommend you.' : 'You asked for a letter before you had given them a reason.',
          tone: known ? 'warm' : 'serious',
          highlight: true,
        }),
        say('earn', 'Ask what they would need to say yes', 'They tell you. It is specific: come to the work, or come to office hours, or stop disappearing. You do one of those things. The letter gets truer.', {
          effects: { stress: 2, skills: 2, termScore: 2 },
          recommendations: 1,
          research: s.research || s.character.majorId === 'biology' || s.character.majorId === 'psychology',
          rel: [{ who: 'mentor', affection: 6, trust: 6, memory: 'You asked how to earn the letter.' }],
          memory: 'You earned a recommendation instead of requesting a miracle.',
          tone: 'warm',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'senior-grind',
    title: 'How many doors',
    weight: 8,
    once: true,
    categories: ['career'],
    focuses: ['life', 'midterm'],
    years: [4],
    terms: ['fall', 'spring'],
    location: 'library',
    weather: 'night',
    narration: (s) => {
      const major = majorById(s.character.majorId);
      return `Senior year. The portal is a second campus. ${major.name} is on the resume in a font that is trying to be calm.\n\nYou can send a careful few, a tiring many, or a blizzard. The market may not read them in that order.`;
    },
    choices: () => [
      say('few', 'A careful twelve', 'You write like a person. Twelve applications, each with a sentence that could only be yours. It is slower. It is also readable.', {
        effects: { stress: 4, energy: -5, skills: 2 },
        applications: 12,
        interviews: 1,
        memory: 'You sent twelve careful applications.',
        tone: 'warm',
        highlight: true,
      }),
      say('many', 'Forty, and then touch grass', 'You build a system and then obey it. Forty go out. Your eyes dry. A friend drags you outside before you become a cover letter.', {
        effects: { stress: 7, energy: -8, happiness: -2, social: 1 },
        applications: 40,
        ghosts: 8,
        interviews: 1,
        rel: [{ who: 'friend', affection: 3, memory: 'They pulled you out of the portal.' }],
        memory: 'You applied to forty jobs in senior year.',
        tone: 'serious',
        highlight: true,
      }),
      say('blizzard', 'One hundred. Become the blizzard.', 'You apply until the word "excited" leaves your body. The last thirty are copies of a person you do not quite respect. Statistically, maybe one is read.', {
        effects: { stress: 12, happiness: -8, energy: -12, health: -4 },
        applications: 100,
        ghosts: 30,
        memory: 'You applied to a hundred jobs and felt each one less.',
        tone: 'brutal',
        highlight: true,
      }),
      say('people', 'Stop applying and ask humans', 'You write three actual people: a mentor, a boss, a friend of a shift. One of them answers with a name. The portal remains hungry. You feed it less.', {
        effects: { network: 8, stress: 2, skills: 1 },
        applications: 5,
        interviews: 1,
        ties: 1,
        memory: 'You asked people instead of only asking a portal.',
        tone: 'warm',
        highlight: true,
      }),
    ],
  }),
  ev({
    id: 'almost-offer',
    title: 'We are pleased',
    weight: 3,
    once: true,
    categories: ['career'],
    focuses: ['life', 'midterm', 'finals'],
    years: [4],
    when: (s) => s.applications >= 8 || s.internships.length > 0 || s.stats.network > 30,
    location: 'quad',
    narration: () =>
      `The subject line is "Next steps." Your hands do a small undignified thing. The first paragraph is warm. The second paragraph is a scheduling link. The third, sent four hours later, says the role has been "repaused."\n\nYou learn a new verb for no.`,
    choices: () => [
      {
        id: 'wait',
        label: 'Reply with dignity and wait',
        resolve: ({ rng }) => {
          if (rng.chance(0.45)) {
            return {
              text: 'They unpause. It is not an apology so much as a calendar. You have an interview. You prepare like a person who has already been ghosted once and intends to be ready anyway.',
              effects: { stress: 4, happiness: 4, skills: 1 },
              interviews: 1,
              offers: 0,
              memory: 'An offer-shaped email vanished, then became an interview.',
              tone: 'serious',
              highlight: true,
            };
          }
          return {
            text: 'The repause is permanent. You reply once, kindly, and then you stop performing patience for a company that lost its own thread. The sting is real. It is also information.',
            effects: { stress: 6, happiness: -5 },
            ghosts: 1,
            flags: { rescinded: true },
            memory: 'A near-offer was repaused into nothing.',
            tone: 'brutal',
            highlight: true,
          };
        },
      },
      say('vent', 'Tell your friend before you reply', 'They let you be furious in complete sentences. Then you send the calm email. The order matters.', {
        effects: { stress: -2, happiness: -1, social: 2 },
        ghosts: 1,
        flags: { rescinded: true },
        rel: [{ who: 'friend', affection: 4, memory: 'They heard the almost-offer die.' }],
        memory: 'You almost had an offer. Then the company repaused itself.',
        tone: 'serious',
        highlight: true,
      }),
    ],
  }),
];

export { ORGS };

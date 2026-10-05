import { backgroundById } from '../backgrounds';
import { firstName } from '../names';
import { ev, say, who } from './helpers';
import type { Choice, GameEvent } from './types';

export const personalEvents: GameEvent[] = [
  ev({
    id: 'meet-someone',
    title: 'The seat beside you',
    weight: 4,
    once: true,
    categories: ['dating'],
    focuses: ['life'],
    years: [1, 2, 3],
    when: (s) => s.stage === 'none' || s.stage === 'ex',
    location: 'lecture',
    narration: (s) => {
      const p = who(s, 'interest');
      return `The lecture is ordinary. The person beside you is not performing it. ${p.name} lends you a pen that actually works and makes a face when the slide says "synergy."\n\nAfter class the hallway is a decision.`;
    },
    speaker: (s) => {
      const p = who(s, 'interest');
      return { name: p.name, line: 'Do you actually understand that, or are we all acting?', portrait: p.person.portrait };
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('coffee', 'Get coffee and tell the truth', `You admit you understood about forty percent. ${p.name} laughs like a person who has been waiting to be a person. The coffee is too expensive. The hour is not.`, {
          effects: { happiness: 6, social: 4, money: -8, stress: -3 },
          stage: 'talking',
          rel: [{ who: 'interest', affection: 14, trust: 8, known: true, archetype: 'romantic', memory: 'Coffee after class. Nobody performed.' }],
          memory: `You met ${p.name} in a lecture and did not pretend.`,
          tone: 'warm',
          highlight: true,
        }),
        say('number', 'Trade numbers and play it cool', `You are slightly smooth and slightly fake. ${p.name} texts that night anyway. The coolness does not survive the thread.`, {
          effects: { happiness: 4, social: 3, stress: 2 },
          stage: 'talking',
          rel: [{ who: 'interest', affection: 8, trust: 4, known: true, archetype: 'romantic', memory: 'You traded numbers.' }],
          memory: `You and ${p.name} started texting.`,
          tone: 'warm',
        }),
        say('leave', 'Smile and leave', 'You protect the afternoon. The pen remains theirs. Sometimes a moment is complete at the size of a hallway.', {
          effects: { happiness: 1, stress: -1 },
          rel: [{ who: 'interest', affection: 2, known: true, memory: 'A nice almost.' }],
          tone: 'warm',
        }),
      ];
    },
  }),
  ev({
    id: 'awkward-date',
    title: 'A first date',
    weight: 5,
    once: true,
    categories: ['dating'],
    focuses: ['life'],
    when: (s) => s.stage === 'talking',
    location: 'cafe',
    narration: (s) => {
      const p = who(s, 'interest');
      return `${p.name} is already there, early, which you will think about later. The cafe charges seven dollars for a latte and provides one candle, for ambiance.\n\nYou are both trying so hard to be easy that the trying shows.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('honest', 'Drop the bit', `You say you are nervous. ${p.name} says "thank god" and becomes funnier immediately. The date gets smaller and better.`, {
          effects: { happiness: 7, stress: -4, social: 2, money: -16 },
          stage: 'dating',
          rel: [{ who: 'interest', affection: 12, trust: 10, memory: 'The first date got honest.' }],
          memory: `Your first date with ${p.name} survived being awkward.`,
          tone: 'warm',
          highlight: true,
        }),
        say('resume', 'Talk about your internship goals', `${p.name} nods with the expression of a person being pitched. You hear yourself say "leverage." The candle does not save you.`, {
          effects: { happiness: -2, stress: 3, money: -14, network: 1 },
          stage: 'talking',
          rel: [{ who: 'interest', affection: -4, trust: -2, memory: 'The date became a coffee chat.' }],
          tone: 'funny',
          memory: 'You took a date and gave a presentation.',
        }),
        say('walk', 'Suggest a walk instead', 'You abandon the seven-dollar theater and walk until the conversation finds a subject that is not a major. Their hand bumps yours. Neither of you apologizes.', {
          effects: { happiness: 6, stress: -3, money: -4 },
          stage: 'dating',
          rel: [{ who: 'interest', affection: 10, trust: 7, memory: 'You left the cafe and the date began.' }],
          memory: `You and ${p.name} walked instead of performing dinner.`,
          tone: 'warm',
          highlight: true,
        }),
      ];
    },
  }),
  ev({
    id: 'conflict',
    title: 'A small fight that is not small',
    weight: 4,
    categories: ['dating'],
    focuses: ['life'],
    when: (s) => s.stage === 'dating' || s.stage === 'serious',
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'street'),
    weather: 'rain',
    narration: (s) => {
      const p = who(s, 'interest');
      return `${p.name} says you have been somewhere else for weeks. They are not wrong. You have been inside a portal, a shift, a fear you called "busy."\n\nThe rain makes the argument feel more important than it is, which is already quite important.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('listen', 'Listen all the way through', `You do not build a defense. ${p.name} finishes. What remains is workable. You are both tired and still choosing the same sidewalk.`, {
          effects: { stress: -4, happiness: 3, energy: -3 },
          rel: [{ who: 'interest', affection: 6, trust: 8, memory: 'You listened during the fight.' }],
          memory: `You and ${p.name} fought and stayed in the conversation.`,
          tone: 'warm',
          highlight: true,
        }),
        say('defend', 'Explain your schedule like a case', 'You are correct about the calendar and wrong about the night. They go home early. The righteousness does not keep you company.', {
          effects: { stress: 6, happiness: -4 },
          rel: [{ who: 'interest', affection: -8, trust: -6, memory: 'You won an argument and lost the evening.' }],
          tone: 'brutal',
        }),
        say('space', 'Ask for a night apart', 'The pause is clean. In the morning the texts are careful and kind. Not every repair is instant. This one starts.', {
          effects: { stress: -1, happiness: 1 },
          rel: [{ who: 'interest', trust: 3, affection: 1, memory: 'You asked for space without disappearing.' }],
          tone: 'serious',
        }),
      ];
    },
  }),
  ev({
    id: 'intimacy',
    title: 'A private decision',
    weight: 4,
    once: true,
    categories: ['dating', 'health'],
    focuses: ['life'],
    when: (s) => (s.stage === 'dating' || s.stage === 'serious') && !s.flags.intimacyTalk,
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'dorm'),
    weather: 'night',
    narration: (s) => {
      const p = who(s, 'interest');
      return `You and ${p.name} are alone, and the night could become physical. You talk about it, which is less cinematic than silence and more like the adults you are intermittently being.\n\nNothing has to happen. If it does, it will have consequences, the ordinary and serious kind.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      const bg = backgroundById(s.character.backgroundId);
      return [
        say('wait', 'Not tonight', `You say so. ${p.name} says okay and means it, which tells you something more useful than the other options. You stay anyway, talking, shoulders touching, fully clothed in your plans.`, {
          effects: { happiness: 4, stress: -3 },
          flags: { intimacyTalk: true },
          rel: [{ who: 'interest', trust: 10, affection: 6, memory: 'You said not tonight and were met kindly.' }],
          memory: `You and ${p.name} chose to wait, and the night was still close.`,
          tone: 'warm',
          highlight: true,
        }, { serious: true }),
        {
          id: 'protected',
          label: 'Be together, and use protection',
          serious: true,
          resolve: ({ rng }) => {
            const pregnant = rng.chance(0.03);
            const sti = rng.chance(0.03);
            const queue: string[] = [];
            if (pregnant) queue.push('pregnancy-decision');
            if (sti) queue.push('clinic-sti');
            return {
              text: pregnant
                ? `You are careful. Careful is not a spell. Weeks later a test says pregnant, and the word rearranges the room. ${p.name} needs to be told. You will not do this as a joke, because it is not one.`
                : sti
                  ? `You were careful. A test later comes back positive for an infection that is treatable and still not small. There will be a clinic, and a conversation with ${p.name}.`
                  : `You are careful with each other. In the morning there is no plot twist, only the shy fact of having been close. ${p.name} makes terrible coffee. It is a good morning.`,
              effects: { happiness: pregnant || sti ? -2 : 6, stress: pregnant || sti ? 8 : -4, social: 1 },
              flags: { intimacyTalk: true },
              pregnant,
              queue,
              stage: 'serious',
              rel: [{ who: 'interest', affection: 8, trust: 6, memory: 'You were intimate and tried to be careful.' }],
              memory: pregnant
                ? `A pregnancy test changed the term.`
                : `You and ${p.name} became closer, carefully.`,
              tone: pregnant || sti ? 'serious' : 'warm',
              highlight: true,
            };
          },
        },
        {
          id: 'unprotected',
          label: 'Be together, and skip protection',
          serious: true,
          detail: 'Pregnancy and infection are real possibilities.',
          resolve: ({ rng }) => {
            const pregnant = rng.chance(0.38);
            const sti = rng.chance(0.2);
            const queue: string[] = [];
            if (pregnant) queue.push('pregnancy-decision');
            if (sti) queue.push('clinic-sti');
            return {
              text: pregnant
                ? `The night is what you chose. The weeks after are a test you did not study for. It is positive. ${p.name} is part of this whether the conversation is easy or not. This will not be a punchline.`
                : sti
                  ? `You wake into a consequence that is medical, not moral theater. A test is positive. It can be treated. It still has to be said out loud, to ${p.name} and to a clinician.`
                  : `Nothing measurable happens. That is luck, not a strategy, and you both know it in the morning when the conversation gets quieter and more adult.`,
              effects: {
                happiness: pregnant ? -4 : sti ? -3 : 3,
                stress: pregnant ? 14 : sti ? 10 : 4,
                health: sti ? -6 : 0,
              },
              flags: { intimacyTalk: true },
              pregnant,
              queue,
              stage: 'serious',
              rel: [{ who: 'interest', affection: pregnant ? 2 : 4, trust: pregnant ? -2 : 1, memory: 'You were intimate without protection.' }],
              memory: pregnant ? 'A pregnancy became part of the story.' : 'You took a risk together and have to live with what it means.',
              tone: 'serious',
              highlight: pregnant || sti,
            };
          },
        },
        say('clinic-first', 'Go get contraception before anything else', `You make it unromantic on purpose. A clinic visit, a boring form, a plan. ${p.name} comes with you. The night can wait. The respect does not.`, {
          effects: { stress: -2, happiness: 3, money: bg.id === 'low' ? -15 : -40, health: 1 },
          flags: { intimacyTalk: true },
          rel: [{ who: 'interest', trust: 12, affection: 6, memory: 'You handled contraception like a plan, not a vibe.' }],
          memory: `You and ${p.name} went to a clinic before you went further.`,
          tone: 'serious',
          highlight: true,
        }, { serious: true }),
      ];
    },
  }),
  ev({
    id: 'pregnancy-decision',
    title: 'The test',
    weight: 0,
    once: true,
    categories: ['dating', 'health'],
    when: () => false,
    location: 'clinic',
    narration: (s) => {
      const p = who(s, 'interest');
      const together = s.stage === 'dating' || s.stage === 'serious';
      return together
        ? `A clinician speaks plainly. You are pregnant. ${p.name} is in the waiting room, or is not, depending on the last month — but the fact does not care about your timing.\n\nYou have real choices. None of them is a bit.`
        : `A clinician speaks plainly. You are pregnant. The father of this fact may or may not be a person you still talk to. The decision is yours, and it will take up space either way.\n\nYou have real choices. None of them is a bit.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      const bg = backgroundById(s.character.backgroundId);
      const together = (s.stage === 'dating' || s.stage === 'serious') && p.person.affection > 10;
      const continueText = together
        ? `${p.name} sits with you and does not flinch, which is not the same as this being easy. You choose to continue the pregnancy. Appointments replace a kind of freedom. So does a terrifying tenderness.`
        : `You choose to continue the pregnancy. Some people around you rise to it. Some vanish into "let me know if you need anything." You learn quickly which is which. The future gets heavier and more specific.`;
      const choices: Choice[] = [
        {
          id: 'continue',
          label: 'Continue the pregnancy',
          serious: true,
          resolve: ({ rng }) => {
            const help = rng.chance(bg.emergency);
            return {
              text: help
                ? `${continueText} Your family, imperfectly, sends money for the first appointments.`
                : `${continueText} The first bills arrive without ceremony.`,
              effects: { stress: 10, happiness: 2, energy: -6, money: help ? 600 : -200, debt: help ? 400 : 1600, health: -4 },
              child: true,
              pregnant: true,
              flags: { pregnancyPath: 'continue' },
              queue: ['prenatal'],
              memory: 'You decided to continue a pregnancy.',
              tone: 'serious',
              highlight: true,
              rel: together ? [{ who: 'interest', affection: 8, trust: 6, memory: 'They stayed in the room for the decision.' }] : [],
            };
          },
        },
        say('adoption', 'Continue, and plan an adoption', 'You choose to carry the pregnancy and to place the child for adoption. People will have opinions they did not earn. The decision is serious, loving in a way that does not look like a movie, and it stays with you.', {
          effects: { stress: 12, happiness: -2, energy: -6, debt: 900, health: -3 },
          pregnant: true,
          clearPregnant: false,
          flags: { pregnancyPath: 'adoption' },
          queue: ['prenatal'],
          memory: 'You chose adoption. It was not simple, and it was yours.',
          tone: 'serious',
          highlight: true,
          rel: together ? [{ who: 'interest', affection: 3, trust: 4, memory: 'You made an adoption plan together.' }] : [],
        }, { serious: true }),
        say('end', 'End the pregnancy', 'You make an appointment. It is medical, quiet, and yours. Afterward you are sore, tired, and allowed to feel more than one thing. A friend brings food and does not ask you to narrate it.', {
          effects: { stress: 8, happiness: -4, health: -6, energy: -8, money: bg.id === 'low' ? -80 : -420 },
          clearPregnant: true,
          pregnant: false,
          flags: { pregnancyPath: 'end' },
          memory: 'You ended a pregnancy and kept going.',
          tone: 'serious',
          highlight: true,
          rel: [
            { who: 'friend', affection: 6, trust: 6, memory: 'They brought food and did not demand a story.' },
            ...(together ? [{ who: 'interest' as const, affection: p.person.trust > 20 ? 4 : -6, trust: p.person.trust > 20 ? 4 : -8, memory: 'The pregnancy ended. The relationship had to tell the truth.' }] : []),
          ],
        }, { serious: true }),
      ];
      return choices;
    },
  }),
  ev({
    id: 'prenatal',
    title: 'An ordinary appointment',
    weight: 0,
    once: true,
    categories: ['health', 'dating'],
    when: () => false,
    location: 'clinic',
    narration: (s) => {
      const p = who(s, 'interest');
      const withYou = (s.stage === 'dating' || s.stage === 'serious') && p.person.affection > 20;
      return withYou
        ? `The clinic is beige and kind. ${p.name} holds the paperwork like it might escape. Nothing about this is a subplot. A nurse asks how you are sleeping, and means it.`
        : `The clinic is beige and kind. You hold your own paperwork. A nurse asks how you are sleeping, and for a moment you tell the truth.`;
    },
    choices: (s) => [
      say('go', 'Go, and tell the truth', 'You ask the questions you were going to google at 1 a.m. The answers are plain. You leave with a next date and a body that is doing something enormous without asking your schedule.', {
        effects: { stress: -3, health: 2, energy: -4, money: -30 },
        memory: 'A prenatal visit made the future feel factual.',
        tone: 'serious',
        highlight: true,
        rel: s.cast.interest.affection > 20 ? [{ who: 'friend', affection: 2 }] : [],
      }, { serious: true }),
      say('friend', 'Ask your friend to come', 'They sit in a bad chair and do not check their phone. Afterward you eat something salty on a curb. It is not a solution. It is a person.', {
        effects: { stress: -5, happiness: 4, health: 1, social: 2 },
        rel: [{ who: 'friend', affection: 8, trust: 6, memory: 'They came to the appointment.' }],
        memory: 'A friend came with you to the clinic and stayed.',
        tone: 'warm',
        highlight: true,
      }, { serious: true }),
    ],
  }),
  ev({
    id: 'clinic-sti',
    title: 'The clinic, afterward',
    weight: 0,
    once: true,
    categories: ['health', 'dating'],
    when: () => false,
    location: 'clinic',
    narration: (s) => {
      const p = who(s, 'interest');
      return `The result is an infection, not a character judgment. The clinician is matter-of-fact and kind. There is a prescription. There is also ${p.name}, who deserves the truth in a complete sentence.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      const bg = backgroundById(s.character.backgroundId);
      const cost = bg.id === 'low' || bg.id === 'lower-middle' ? 25 : 140;
      return [
        say('tell', 'Tell them and get treated', `You say it cleanly. ${p.name} is scared, then practical. You both get treated. The relationship has a new fact in it and does not automatically end.`, {
          effects: { health: 6, stress: 4, money: -cost, happiness: -2 },
          flags: { sti: true },
          rel: [{ who: 'interest', trust: 6, affection: 1, memory: 'You told them about the infection and dealt with it.' }],
          memory: 'An STI was treated, and you told the truth.',
          tone: 'serious',
          highlight: true,
        }, { serious: true }),
        say('hide', 'Get treated and say nothing', 'The medicine works. The omission sits in the conversation every time you almost have it. Your body recovers faster than your stomach does.', {
          effects: { health: 4, stress: 8, money: -cost, happiness: -4 },
          flags: { sti: true },
          rel: [{ who: 'interest', trust: -6, memory: 'You kept a medical truth to yourself.' }],
          memory: 'You treated an infection and hid it.',
          tone: 'serious',
        }, { serious: true }),
      ];
    },
  }),
  ev({
    id: 'breakup',
    title: 'The end of the us',
    weight: 3,
    once: true,
    categories: ['dating'],
    focuses: ['life', 'summer'],
    when: (s) => s.stage === 'dating' || s.stage === 'serious',
    location: 'street',
    weather: 'overcast',
    narration: (s) => {
      const p = who(s, 'interest');
      return `${p.name} says it, or you do. The difference matters less than the quiet after.\n\nYour phone is suddenly a dangerous object. The campus looks overacted, all those people with somewhere to be.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('kind', 'End it kindly', `You do not perform a villain. ${p.name} does not either. You will see them in a hallway and survive it. Tonight you go home and let it hurt the right amount.`, {
          effects: { happiness: -8, stress: 8, energy: -6, social: -2 },
          stage: 'ex',
          rel: [{ who: 'interest', affection: -4, archetype: 'former', memory: 'You broke up without cruelty.' }],
          memory: `You and ${p.name} broke up. It was clean and it still hurt.`,
          tone: 'serious',
          highlight: true,
        }, { serious: true }),
        say('messy', 'Say the thing you cannot unsay', 'You are precise and unkind. It feels like power for an hour and like a stone after that. Friends pick sides badly, which is to say they pick you and still look sad.', {
          effects: { happiness: -10, stress: 10, reputation: -2, social: -3 },
          stage: 'ex',
          rel: [{ who: 'interest', affection: -20, trust: -15, archetype: 'former', memory: 'The breakup was cruel.' }],
          memory: `The breakup with ${p.name} got ugly.`,
          tone: 'brutal',
          highlight: true,
        }),
        say('friend', 'Go straight to your friend', `${firstName(s.cast.friend.name)} does not say "everything happens for a reason." They sit on the floor and let you be repetitive. It is the best thing anyone does for you this month.`, {
          effects: { happiness: -4, stress: 4, social: 2 },
          stage: 'ex',
          rel: [
            { who: 'interest', affection: -6, archetype: 'former', memory: 'The relationship ended.' },
            { who: 'friend', affection: 8, trust: 6, memory: 'They sat on the floor with you after.' },
          ],
          memory: `After ${p.name}, your friend showed up without a speech.`,
          tone: 'warm',
          highlight: true,
        }, { serious: true }),
      ];
    },
  }),
  ev({
    id: 'reconciliation',
    title: 'A text you recognize',
    weight: 3,
    once: true,
    categories: ['dating'],
    focuses: ['life'],
    when: (s) => s.stage === 'ex' && s.cast.interest.affection > 5 && !s.pregnant,
    location: 'cafe',
    narration: (s) => {
      const p = who(s, 'interest');
      return `${p.name} asks if you want to walk. Not "get back together." Walk. The campus is full of people who think they are in a different story.\n\nYou know the sound of their jacket.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('try', 'Try again, slower', `You do not rewind. You start a smaller version. ${p.name} is still ${p.name}. Some of the old hurt comes along and sits in the back, quieter if you do not pretend it left.`, {
          effects: { happiness: 5, stress: 3 },
          stage: 'dating',
          rel: [{ who: 'interest', affection: 10, trust: 4, archetype: 'romantic', memory: 'You tried again, slower.' }],
          memory: `You and ${p.name} tried again.`,
          tone: 'warm',
          highlight: true,
        }),
        say('walk-only', 'Take the walk and not the reunion', 'The walk is good. At the end you hug like people who survived something. You go separate ways and the night is oddly clean.', {
          effects: { happiness: 3, stress: -2 },
          rel: [{ who: 'interest', affection: 4, trust: 3, memory: 'A kind walk, and no reunion.' }],
          memory: `You and ${p.name} walked and did not rewind.`,
          tone: 'warm',
          highlight: true,
        }),
        say('no', 'Say no', 'You do not owe the past a sequel. The no is shaky and correct. You sleep better than you expect.', {
          effects: { stress: -3, happiness: 1 },
          rel: [{ who: 'interest', affection: -2, memory: 'You declined a reunion.' }],
          tone: 'serious',
        }),
      ];
    },
  }),
  ev({
    id: 'long-distance',
    title: 'Summer has a map',
    weight: 6,
    categories: ['dating'],
    focuses: ['summer'],
    when: (s) => s.stage === 'dating' || s.stage === 'serious',
    location: 'bus',
    narration: (s) => {
      const p = who(s, 'interest');
      return `${p.name} is going home, or to a job in a city that is not this one. You are standing at a bus stop holding a suitcase and a theory about loyalty.\n\nLong distance is a lot of phone and a lot of ordinary missing.`;
    },
    choices: (s) => {
      const p = who(s, 'interest');
      return [
        say('try', 'Try the distance', `You try. Some calls are real. Some are two tired people performing fine. In August you are still together, slightly scuffed, which is a kind of success.`, {
          effects: { happiness: 2, stress: 4, social: -1 },
          rel: [{ who: 'interest', affection: 4, trust: 5, memory: 'You tried long distance.' }],
          memory: `You and ${p.name} tried long distance for a summer.`,
          tone: 'serious',
          highlight: true,
        }),
        say('end', 'End it before the bus', `You do it in person, which is the decent version. The bus still leaves. You feel emptied out and, underneath that, a terrible relief.`, {
          effects: { happiness: -6, stress: 5 },
          stage: 'ex',
          rel: [{ who: 'interest', affection: -4, archetype: 'former', memory: 'You ended it at the bus stop.' }],
          memory: `You and ${p.name} ended it when summer started.`,
          tone: 'serious',
          highlight: true,
        }),
        say('vague', 'Say "we\'ll see"', `We'll see becomes a summer of almost. By August neither of you is wrong, and neither of you is held. The ambiguity costs more than a decision.`, {
          effects: { stress: 6, happiness: -3 },
          stage: 'ex',
          rel: [{ who: 'interest', affection: -6, trust: -4, archetype: 'awkward', memory: 'The summer was a maybe that expired.' }],
          memory: `You and ${p.name} let the relationship blur out over summer.`,
          tone: 'brutal',
        }),
      ];
    },
  }),
  ev({
    id: 'quiet-love',
    title: 'Nothing is wrong',
    weight: 3,
    once: true,
    categories: ['warm', 'dating'],
    focuses: ['life'],
    when: (s) => s.stage === 'serious',
    location: 'apartment',
    weather: 'rain',
    narration: (s) => {
      const p = who(s, 'interest');
      return `Nothing dramatic is available. ${p.name} is reading on the floor. Rain. A cheap lamp. Your laundry is a third presence.\n\nYou understand, with a clarity that almost embarrasses you, that you are happy in a way that will not photograph.`;
    },
    choices: () => [
      say('stay', 'Stay on the floor', 'You stay. The chapter can wait. This is one of the hours you will mean when a stranger later asks if college was worth it, and you will not have a simple answer, only this.', {
        effects: { happiness: 8, stress: -8, energy: 2 },
        rel: [{ who: 'interest', affection: 8, trust: 6, memory: 'A quiet night that was enough.' }],
        memory: 'There was a quiet night with someone you loved, and nothing was wrong.',
        tone: 'warm',
        highlight: true,
      }),
      say('say-it', 'Say the tender thing out loud', 'You say it. They look up, wrecked in a small way, and say it back. The laundry remains. So does the sentence.', {
        effects: { happiness: 9, stress: -5 },
        stage: 'serious',
        rel: [{ who: 'interest', affection: 10, trust: 8, memory: 'You said it out loud.' }],
        memory: 'You said you loved them on an ordinary night.',
        tone: 'warm',
        highlight: true,
      }),
    ],
  }),
  ev({
    id: 'flu',
    title: 'The flu joins the group chat',
    weight: 3,
    categories: ['health'],
    focuses: ['life', 'midterm'],
    location: 'dorm',
    narration: () =>
      `It starts as a sore throat and becomes a personality. The lecture will not wait. Your body has already voted.`,
    choices: () => [
      say('rest', 'Miss class and sleep', 'You send the email, drink water, and let a day go. The notes can be borrowed. The fever cannot.', {
        effects: { health: 10, energy: 6, termScore: -2, stress: -2 },
        memory: 'You got the flu and actually rested.',
        tone: 'serious',
      }),
      say('go', 'Go anyway', 'You attend, heroic and contagious. The exam review slides past your fever. A classmate leans away, correctly.', {
        effects: { health: -8, termScore: 1, stress: 4, energy: -8, reputation: -1 },
        tone: 'brutal',
      }),
      say('clinic', 'Go to the clinic', 'They give you what there is to give, which is fluids, a note, and the advice to stop bargaining with a virus. You listen.', {
        effects: { health: 12, money: -25, stress: -3, termScore: -1 },
        tone: 'warm',
      }),
    ],
  }),
  ev({
    id: 'food-poison',
    title: 'The eleven-dollar lesson',
    weight: 3,
    categories: ['health', 'money'],
    focuses: ['life'],
    location: 'dining',
    narration: () =>
      `The student meal was eleven dollars and, it turns out, a gamble. By midnight you are negotiating with a bathroom and your own choices.\n\nTomorrow's quiz has not heard about this.`,
    choices: () => [
      say('sick', 'Stay down', 'You miss the quiz and keep your dignity in a narrow sense. The professor is human about it. Your stomach remains a critic.', {
        effects: { health: -8, energy: -10, termScore: -3, happiness: -3 },
        memory: 'Campus food took you out of commission.',
        tone: 'funny',
      }),
      say('quiz', 'Take the quiz pale and shining', 'You fill in bubbles with a shaking hand. It is not your best work. It is present, which the syllabus worships.', {
        effects: { health: -12, termScore: 1, stress: 5, energy: -8 },
        tone: 'brutal',
      }),
    ],
  }),
  ev({
    id: 'medical-crisis',
    title: 'Something is wrong',
    weight: 0.22,
    once: true,
    categories: ['health'],
    focuses: ['life', 'midterm', 'finals', 'summer'],
    location: 'clinic',
    narration: () =>
      `This is not a cold. The pain is specific and rude, and the campus clinic sends you onward without the usual pamphlet energy.\n\nA hospital at night is a bright, serious country.`,
    choices: () => [
      {
        id: 'go',
        label: 'Go to the hospital',
        serious: true,
        resolve: ({ state, rng }) => {
          const bg = backgroundById(state.character.backgroundId);
          const bill = 2400 + rng.int(0, 2200);
          const help = rng.chance(bg.emergency);
          if (rng.chance(0.04)) {
            const text = 'They move quickly. It is not enough. A medical emergency ends the four years in a bright room, with people trying. There is no moral hidden in it. It is simply what happened.';
            return { text, fatal: { reason: 'medical emergency', text }, tone: 'serious', highlight: true };
          }
          return {
            text: help
              ? `It is serious and survivable. You spend two days in a room that beeps. The bill is ${bill.toLocaleString('en-US')} dollars before your family catches part of it. You leave thinner, frightened, and still enrolled.`
              : `It is serious and survivable. You spend two days in a room that beeps. The bill is ugly. Your courses will have to make room. You leave thinner, frightened, and still here.`,
            effects: { health: 18, stress: 8, energy: -12, debt: help ? Math.round(bill * 0.35) : bill, happiness: -4, termScore: -4 },
            hospitalizations: 1,
            memory: 'A hospital stay cut through the semester.',
            tone: 'serious',
            highlight: true,
            rel: [{ who: 'friend', affection: 5, memory: 'They came to the hospital.' }],
          };
        },
      },
      {
        id: 'wait',
        label: 'Wait and see',
        serious: true,
        resolve: ({ rng }) => {
          if (rng.chance(0.12)) {
            const text = 'Waiting was the wrong bet. By the time you are in a room that can help, the emergency has outrun it. The years stop here, not as a lesson, as a loss.';
            return { text, fatal: { reason: 'medical emergency', text }, tone: 'serious', highlight: true };
          }
          return {
            text: 'You wait. It gets worse, then, mercifully, it becomes a problem a doctor can still catch. The delay costs you pain and a sharper bill. You were lucky. You should not need to be.',
            effects: { health: 8, stress: 10, debt: 3200, energy: -14, termScore: -6 },
            hospitalizations: 1,
            memory: 'You waited too long on a medical emergency and still made it.',
            tone: 'serious',
            highlight: true,
          };
        },
      },
    ],
  }),
  ev({
    id: 'getting-home',
    title: 'The car is right there',
    weight: 0,
    categories: ['risk'],
    when: () => false,
    location: 'street',
    weather: 'night',
    narration: (s) => {
      const friend = who(s, 'friend');
      return s.character.hasCar
        ? `You have been drinking. Your car is outside, familiar as a bad idea. The street is wet. ${friend.name} is somewhere in the house, or not.\n\nThe night is asking a question you already know the answer to.`
        : `You have been drinking. Someone you half know is heading out and offers a ride in a voice that has had as much as you have. The walk home is forty minutes of dark sidewalk.\n\nThe night is asking a question you already know the answer to.`;
    },
    choices: (s) => {
      const friend = who(s, 'friend');
      const driveLabel = s.character.hasCar ? 'Drive yourself' : 'Get in with them';
      return [
        say('ride', 'Call a rideshare', 'It costs money you will resent in the morning and thank by noon. You get home. The story ends at the door, which is the best ending available.', {
          effects: { money: -22, stress: -4, happiness: 1 },
          memory: 'You paid for a ride instead of driving drunk.',
          tone: 'serious',
          highlight: true,
        }, { serious: true, detail: 'Costs a fare. You get home.', disabled: (state) => (state.money >= 22 ? null : 'You do not have the fare.') }),
        say('friend', `Call ${friend.name}`, `${friend.name} comes, annoyed and glad, which is what care looks like at 1 a.m. You owe them breakfast and a better story.`, {
          effects: { social: 2, stress: -3, happiness: 2 },
          rel: [{ who: 'friend', affection: 6, trust: 5, memory: 'They picked you up when you should not have driven.' }],
          memory: `${friend.name} came to get you.`,
          tone: 'warm',
          highlight: true,
        }, {
          serious: true,
          disabled: (state) => (state.cast.friend.affection >= 18 ? null : `${friend.name} is not picking up for you.`),
        }),
        say('walk', 'Walk', 'Forty minutes. A podcast you do not hear. You arrive cold and intact. Your shoes will remember the puddle. You will remember that you chose the long way.', {
          effects: { energy: -8, stress: -2, health: 1, happiness: 1 },
          memory: 'You walked home instead of gambling.',
          tone: 'warm',
        }, { serious: true }),
        {
          id: 'drive',
          label: driveLabel,
          serious: true,
          detail: 'This can end in a crash, an arrest, or worse.',
          resolve: ({ rng }) => {
            const roll = rng.next();
            if (roll < 0.1) {
              const text = s.character.hasCar
                ? 'The street is shorter than your reaction. There is an impact, then a long bright confusion, then nothing you return from. A drunk drive ends the years. People will be left holding the ordinary objects of your life.'
                : 'The car leaves the road. You are in it. There is noise, then a silence the party will hear about for the rest of its life. You do not come back from it.';
              return { text, fatal: { reason: 'drunk driving crash', text }, tone: 'serious', highlight: true };
            }
            if (roll < 0.34) {
              return {
                text: 'Metal, a ditch, a stranger\'s voice on a phone. You live. Someone else\'s car does not. The hospital is bright and the shame is brighter. In the morning a bill and a fact are waiting: you did this.',
                effects: { health: -28, stress: 16, happiness: -12, money: -300, debt: 1800, energy: -10 },
                hospitalizations: 1,
                record: true,
                memory: 'A drunk drive ended in a crash. You lived. That is not the same as it being fine.',
                tone: 'serious',
                highlight: true,
              };
            }
            if (roll < 0.62) {
              return {
                text: 'Lights. A careful voice. You are arrested before anyone is killed, which is mercy wearing a uniform. The night becomes paperwork, a fine, and a line on your future that recruiters are allowed to see.',
                effects: { stress: 14, happiness: -10, money: -400, debt: 900, reputation: -6 },
                record: true,
                memory: 'A drunk drive became an arrest.',
                tone: 'serious',
                highlight: true,
              };
            }
            return {
              text: 'You make it to the door. The fact does not make it fine. Your hands shake on the keys. You sit on the floor and understand, too late and still in time, that you will not do this again if you want a life.',
              effects: { stress: 12, happiness: -8, health: -4 },
              memory: 'You drove drunk and got home. The luck felt like guilt.',
              tone: 'serious',
              highlight: true,
            };
          },
        },
      ];
    },
  }),
  ev({
    id: 'night-walk',
    title: 'The long way home',
    weight: 0.28,
    once: true,
    categories: ['risk'],
    focuses: ['life', 'midterm'],
    location: 'street',
    weather: 'night',
    narration: () =>
      `The library closes and the good streets are the long ones. You take the short one. It is late, quiet, and ordinary, until a violent stranger steps into your path and asks a question that is not really a question.\n\nThere is no story about who they are that would make this fair. It is just happening.`,
    choices: () => [
      say('give', 'Give the wallet and leave', 'You hand it over. They leave. You shake for an hour and still have your life, which is the whole point of the trade. The cards can be replaced. You call someone.', {
        effects: { money: -60, stress: 10, happiness: -6, health: -2 },
        rel: [{ who: 'friend', affection: 3, memory: 'They answered when you called from the street.' }],
        memory: 'A stranger threatened you on the walk home. You got away.',
        tone: 'serious',
        highlight: true,
      }, { serious: true }),
      say('cross', 'Keep moving and get to light', 'You do not run like a movie. You move, fast, toward a lit corner and other people. The stranger does not follow. Your heart does, for several blocks.', {
        effects: { stress: 8, happiness: -4, energy: -6 },
        memory: 'You got away from a violent stranger by getting to light.',
        tone: 'serious',
        highlight: true,
      }, { serious: true }),
      {
        id: 'fight',
        label: 'Stand your ground and fight',
        serious: true,
        resolve: ({ rng }) => {
          const roll = rng.next();
          if (roll < 0.14) {
            const text = 'The fight lasts seconds and goes the wrong way. A violent night on an ordinary street ends your life. There is no lesson tidy enough to put here. You were walking home.';
            return { text, fatal: { reason: 'violent assault', text }, tone: 'serious', highlight: true };
          }
          if (roll < 0.55) {
            return {
              text: 'You fight. It is brief and ugly and you lose the important parts: blood, a tooth\'s worth of pain, the walk you thought you were on. A passerby calls for help. You will heal. You will also flinch at that corner for a long time.',
              effects: { health: -30, stress: 14, happiness: -10, money: -80 },
              hospitalizations: 1,
              memory: 'A violent stranger hurt you on the way home.',
              tone: 'serious',
              highlight: true,
            };
          }
          return {
            text: 'Adrenaline makes you loud and lucky. They run. You are not a hero. You are a person panting under a streetlight, amazed to be unfinished.',
            effects: { stress: 8, health: -6, happiness: -2 },
            memory: 'You got away from a violent stranger.',
            tone: 'serious',
            highlight: true,
          };
        },
      },
    ],
  }),
  ev({
    id: 'public-incident',
    title: 'A sound you do not recognize',
    weight: 0.3,
    once: true,
    categories: ['risk'],
    focuses: ['life', 'summer'],
    location: 'quad',
    weather: 'night',
    narration: () =>
      `Calder is holding one of its crowded nights — lights, a speaker, too many bodies on the lawn. The sound that cuts through is wrong in a way your body understands before you do.\n\nPeople move. Someone falls. You do not get a clear picture, and you do not need one. The university will later call it an incident.`,
    choices: () => [
      {
        id: 'down',
        label: 'Get down and stay down',
        serious: true,
        resolve: ({ rng }) => {
          if (rng.chance(0.035)) {
            const text = 'You do what you can think of. It is not a strategy so much as a hope. The incident reaches you anyway. The crowded night ends, and so do the years. People will argue about it forever. You will not.';
            return { text, fatal: { reason: 'a violent incident at a public event', text }, tone: 'serious', highlight: true };
          }
          return {
            text: 'You stay low until the noise becomes sirens and instructions. A stranger\'s hand finds your shoulder, not unkind. Hours later you are outside, shaking, alive, listening to an email compose itself somewhere in an office.',
            effects: { stress: 16, happiness: -10, energy: -8, health: -4 },
            memory: 'A violent incident tore through a crowded campus night. You got out.',
            tone: 'serious',
            highlight: true,
          };
        },
      },
      {
        id: 'run',
        label: 'Run with the crowd',
        serious: true,
        resolve: ({ rng }) => {
          if (rng.chance(0.06)) {
            const text = 'The crowd becomes a current. You go down in it and do not get back up. A public night at Calder ends your life in the confusion. There is nothing clean to say except that you were there, and then you were not.';
            return { text, fatal: { reason: 'a violent incident at a public event', text }, tone: 'serious', highlight: true };
          }
          if (rng.chance(0.35)) {
            return {
              text: 'You run and fall and tear something that will heal badly for a while. Strangers pull you up. The rest of the term has a flinch in it. You are here.',
              effects: { health: -18, stress: 14, happiness: -8, energy: -10 },
              hospitalizations: 1,
              memory: 'You were hurt in the panic of a campus incident.',
              tone: 'serious',
              highlight: true,
            };
          }
          return {
            text: 'You run until your lungs argue. A block away the world is obscenely normal: a pizza place, a couple laughing. You sit on a curb and call the person you call.',
            effects: { stress: 12, happiness: -8, energy: -8 },
            rel: [{ who: 'friend', affection: 4, memory: 'They answered after the incident.' }],
            memory: 'You got away from a violent night on campus.',
            tone: 'serious',
            highlight: true,
          };
        },
      },
      {
        id: 'toward',
        label: 'Move toward the sound to help',
        serious: true,
        resolve: ({ rng }) => {
          if (rng.chance(0.16)) {
            const text = 'You go toward it because someone might need you. The danger is not impressed by the reason. You die in a crowded place, trying. The people who love you will hold that sentence carefully.';
            return { text, fatal: { reason: 'a violent incident at a public event', text }, tone: 'serious', highlight: true };
          }
          return {
            text: 'You get a person up and moving. Later you will not want this described as bravery. It was three seconds of doing the next thing. Your ears ring for days. A stranger hugs you and leaves.',
            effects: { stress: 14, health: -8, happiness: -4, reputation: 4 },
            memory: 'During a campus incident, you helped someone move.',
            tone: 'serious',
            highlight: true,
          };
        },
      },
    ],
  }),
];

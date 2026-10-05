import { ev, say, who } from './helpers';
import type { GameEvent } from './types';

function managementCopy(quirk: string, slogan: string | null, company: string | null): { title: string; body: string } {
  const ad = slogan ?? 'A Higher Standard of Living';
  const name = company ?? 'management';
  if (quirk === 'elevator') {
    return {
      title: 'The elevator has been aware',
      body: `A banner in the lobby still says "${ad}." The elevator has been dead for nineteen days. Over the buttons, a paper sign: "We're aware :)"\n\n${name} would like you to experience elevated living from the stairs.`,
    };
  }
  if (quirk === 'pool') {
    return {
      title: 'Resort-style, theoretically',
      body: `"${ad}." The pool has been closed since move-in. A single leaf floats in the covered water like a guest who did not get the email.\n\nThe amenity calendar lists "poolside community" as upcoming, which is a tense with no date.`,
    };
  }
  if (quirk === 'fees') {
    return {
      title: 'A fee with a friendly name',
      body: `${name} emails a note called "Community Care Update." Inside it: a $186 "residency optimization fee," due Friday, explained as "enhancements."\n\nThe enhancement is not specified. The smile in the email is.`,
    };
  }
  if (quirk === 'deposit') {
    return {
      title: 'The deposit remembers you',
      body: `"${ad}." Your move-in photos show a stain that predates your birth. ${name} has emailed to say the security deposit is "under review."\n\nReviews, here, are a place money goes to become theoretical.`,
    };
  }
  return {
    title: 'Laundry, a saga',
    body: `The laundry room in the building takes quarters, hope, and one of your socks as a sacrifice. A sign says the machines were "recently refreshed."\n\nThe refresh did not include finishing a cycle.`,
  };
}

export const housingEvents: GameEvent[] = [
  ev({
    id: 'move-in',
    title: 'Move-in day',
    weight: 6,
    once: true,
    categories: ['housing', 'warm'],
    focuses: ['arrival'],
    years: [1],
    location: 'dorm',
    weather: 'golden',
    narration: (s) => {
      const room = who(s, 'roommate');
      return `Calder's banners say find your forever. Forever, today, is ${s.housing.building}, a cinderblock room with a window that sticks and a view of a loading dock they call a grove.\n\nYour roommate ${room.name} is already there, labeling drawers with a sincerity that moves you and frightens you in equal measure.`;
    },
    speaker: (s) => {
      const room = who(s, 'roommate');
      return {
        name: room.name,
        line: 'I made a chore wheel. We can ignore it. I just needed to make it.',
        portrait: room.person.portrait,
      };
    },
    choices: () => [
        say('kind', 'Put the chore wheel on the wall', 'You tape it up. You will not obey it perfectly. The gesture still changes the room. By midnight you know how they take their coffee and what they are afraid of, which is more than the brochure offered.', {
        effects: { happiness: 6, social: 4, stress: -3 },
        rel: [{ who: 'roommate', affection: 12, trust: 8, known: true, memory: 'You hung the chore wheel.' }],
        ties: 1,
        memory: 'Move-in day. A roommate, a stuck window, an actual hello.',
        tone: 'warm',
        highlight: true,
      }),
      say('space', 'Be polite and keep your distance', 'You are friendly in the way of people sharing an elevator. It is not unkind. It is a closed door with a smile on it.', {
        effects: { stress: 2, social: 1, happiness: 1 },
        rel: [{ who: 'roommate', affection: 2, trust: 1, known: true }],
        memory: 'You moved into the dorm and kept your distance.',
        tone: 'serious',
      }),
      say('parents', 'Let your family linger', 'They make the bed too tightly and ask if you are eating. When they leave, the room gets larger and worse. You sit on the floor until it becomes yours.', {
        effects: { happiness: 3, stress: 4, money: 40 },
        memory: 'Your family left, and the room was finally yours.',
        tone: 'warm',
        highlight: true,
      }),
      say('party', 'Follow the noise down the hall', 'Someone has a speaker and no sense of the RA. You meet six people and remember two names. One of them might matter.', {
        effects: { social: 6, energy: -5, happiness: 4, stress: -2 },
        ties: 1,
        rel: [{ who: 'friend', affection: 6, known: true, memory: 'You met in the hallway on move-in night.' }],
        memory: 'You followed the noise on the first night.',
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'leftovers',
    title: 'The leftovers',
    weight: 4,
    once: true,
    categories: ['housing', 'social'],
    focuses: ['life'],
    when: (s) => s.housing.kind === 'dorm' || s.time.year <= 2,
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'dorm'),
    narration: (s) => {
      const room = who(s, 'roommate');
      return `Your leftovers are gone. The container is in the sink, smug, rinsed as if rinsing were an apology.\n\n${room.name} is on the couch wearing headphones and the face of a person who knows.`;
    },
    choices: (s) => {
      const room = who(s, 'roommate');
      return [
        say('talk', 'Talk to them', `You say it plainly. ${room.name} winces, replaces the meal, and tells you about a week that ate them. It is not nothing. It is also your food.`, {
          effects: { stress: -2, happiness: 1 },
          rel: [{ who: 'roommate', affection: 4, trust: 6, memory: 'You talked about the leftovers instead of starting a war.' }],
          tone: 'warm',
        }),
        say('label', 'Label everything, grimly', 'You become a person with tape and a marker. THIEF BAIT. The fridge turns into a legal system. It works.', {
          effects: { stress: 2, happiness: -1 },
          rel: [{ who: 'roommate', affection: -2, trust: 2, memory: 'The food got names.' }],
          memory: 'You labeled your food like evidence.',
          tone: 'funny',
        }),
        say('revenge', 'Eat their food in retaliation', 'Justice is a yogurt that was not yours. It tastes like a mistake you would make again. The cold war begins, dairy-based.', {
          effects: { happiness: 2, stress: 3 },
          rel: [{ who: 'roommate', affection: -8, trust: -6, memory: 'A retaliatory yogurt.' }],
          tone: 'funny',
          memory: 'You answered theft with yogurt.',
        }),
        {
          id: 'investigation',
          label: 'Start a campus-wide investigation',
          wild: true,
          resolve: ({ rng }) => {
            if (rng.chance(0.28)) {
              return {
                text: `The flyers are a joke that escapes. "MISSING: one pasta, last seen happy." People add their own losses. A dining-hall worker confesses to a black market in abandoned tupperware. ${room.name} laughs so hard the grudge dies. You are, briefly, famous in a four-block radius.`,
                effects: { reputation: 6, happiness: 8, social: 6, stress: -3 },
                rel: [{ who: 'roommate', affection: 10, trust: 4, memory: 'The pasta investigation became a bit you shared.' }],
                ties: 2,
                memory: 'A missing-pasta investigation took over the building.',
                tone: 'absurd',
                highlight: true,
              };
            }
            return {
              text: `You paper the lobby. The RA schedules a mediation titled Restorative Practices. ${room.name} looks at you like you have summoned a god. The pasta is not returned. Your reputation as a person is "complicated."`,
              effects: { reputation: -2, stress: 5, happiness: -2 },
              rel: [{ who: 'roommate', affection: -6, trust: -4, memory: 'You escalated leftovers to the RA.' }],
              memory: 'You opened an investigation into leftovers.',
              tone: 'absurd',
              highlight: true,
            };
          },
        },
      ];
    },
  }),
  ev({
    id: 'apartment-august',
    title: 'Premium college living',
    weight: 6,
    categories: ['housing'],
    focuses: ['arrival'],
    years: [2, 3, 4],
    location: 'apartment',
    weather: 'golden',
    narration: (s) => {
      const company = s.housing.company ?? 'a management company';
      const slogan = s.housing.slogan ?? 'Live Well';
      return `The ad said "${slogan}." The key works on the third try. ${s.housing.building}, operated by ${company}, is a bedroom that a brochure would call a junior suite if it were feeling brave.\n\nA cheerful email welcomes you to the community and mentions a move-in charge you already paid, in case you had forgotten the taste.`;
    },
    choices: (s) => [
      say('settle', 'Unpack and drop the expectations', 'You put a plant on the windowsill. The room does not become the ad. It does become a place your shoes know. That is enough for August.', {
        effects: { happiness: 4, stress: -2, money: -80 },
        memory: `You moved into ${s.housing.building}. The ad was lying. The plant was trying.`,
        tone: 'warm',
        highlight: true,
      }),
      say('fight-fee', 'Dispute the move-in charge', 'You write a precise email. They reply with a warmer email that changes nothing. You have, however, entered the correspondence.', {
        effects: { stress: 4, money: 0, reputation: 1 },
        flags: { disputedFee: true },
        tone: 'funny',
        memory: 'You disputed a move-in charge and received a smile.',
      }),
      say('photos', 'Photograph every scratch', 'You document the stain, the crack, the mystery screw. Future-you, fighting for a deposit, will love present-you. Present-you just wanted to sit down.', {
        effects: { stress: 2, skills: 1 },
        flags: { moveInPhotos: true },
        memory: 'You photographed the apartment like a crime scene.',
        tone: 'serious',
      }),
      say('tour', 'Believe the amenity tour', 'The model unit has a fruit bowl. Your unit has a view of a dumpster and "character." You laugh, because the alternative is a noise.', {
        effects: { happiness: -2, stress: 2, social: 2 },
        tone: 'funny',
      }),
    ],
  }),
  ev({
    id: 'management',
    title: 'Management is delighted',
    weight: 5,
    categories: ['housing'],
    focuses: ['life', 'midterm'],
    when: (s) => s.housing.kind === 'apartment',
    location: 'apartment',
    narration: (s) => managementCopy(s.housing.quirk, s.housing.slogan, s.housing.company).body,
    choices: (s) => {
      return [
        say('request', 'Submit another maintenance request', 'You file it. You receive a ticket number and a survey about how the filing experience felt. The thing that is broken remains broken. You are now in a relationship with a portal.', {
          effects: { stress: 4, energy: -2 },
          flags: { maintenanceTickets: (Number(s.flags.maintenanceTickets) || 0) + 1 },
          memory: `${s.housing.company ?? 'Management'} sent you a ticket number and no repair.`,
          tone: 'funny',
        }),
        say('call', 'Call and listen to the hold music', 'The hold music is titled Aspire. A person named Blake says they have escalated your essence. Nothing arrives except a follow-up email asking you to rate Blake.', {
          effects: { stress: 5, energy: -3, happiness: -2 },
          tone: 'absurd',
          memory: 'You spent an afternoon on hold with your landlord.',
        }),
        say('adapt', s.housing.quirk === 'elevator' ? 'Take the stairs and release the dream' : 'Stop expecting the amenity', 'You adapt. This is either maturity or defeat, and the stairs do not care which. Your calves become ideological.', {
          effects: { stress: -3, health: 2, happiness: -1 },
          tone: 'warm',
        }),
        {
          id: 'tech',
          label: s.housing.quirk === 'elevator' ? 'Become the unofficial elevator technician' : 'Write the three-thousand-word review',
          wild: true,
          resolve: ({ rng }) => {
            if (s.housing.quirk === 'elevator' && rng.chance(0.34)) {
              return {
                text: 'You watch a video you should not trust, pry a panel you do not own, and by accident reseat a fuse. The elevator groans back to life. The building treats you like a saint. Management treats you like a liability. Both are correct.',
                effects: { reputation: 8, happiness: 7, stress: 4, social: 5 },
                ties: 2,
                memory: 'You fixed the elevator. Management was not grateful. The building was.',
                tone: 'absurd',
                highlight: true,
              };
            }
            if (rng.chance(0.4)) {
              return {
                text: `Your review of ${s.housing.company ?? 'the company'} is precise, funny, and spiritually a curse. It spreads. A local reporter calls it "a portrait of student housing." Your sink is not fixed. Your sentence is.`,
                effects: { reputation: 5, happiness: 4, stress: 2 },
                memory: 'You wrote the review the building deserved.',
                tone: 'absurd',
                highlight: true,
              };
            }
            return {
              text: 'You escalate from resident to folk hero to person who has voided a clause. A certified letter arrives. The letter is more maintained than the building. You back down, wiser, poorer in spirit.',
              effects: { stress: 8, money: -120, happiness: -3 },
              memory: 'A housing stunt summoned a certified letter.',
              tone: 'brutal',
            };
          },
        },
      ];
    },
  }),
  ev({
    id: 'renewal',
    title: 'Renewal season',
    weight: 4,
    once: true,
    categories: ['housing', 'money'],
    focuses: ['life'],
    terms: ['spring'],
    years: [2, 3],
    when: (s) => s.housing.kind === 'apartment',
    location: 'apartment',
    narration: (s) => {
      const bump = 140 + (s.housing.quirk === 'pool' ? 80 : 0);
      return `${s.housing.company ?? 'Management'} hopes you have loved your home. To continue loving it, the rent will increase by $${bump} a month.\n\nThe email calls this "an adjustment in line with the vibrancy of the corridor." The corridor is a parking lot.`;
    },
    choices: (s) => {
      const bump = 140 + (s.housing.quirk === 'pool' ? 80 : 0);
      return [
        say('sign', 'Sign it. Moving is also expensive.', 'You sign. The vibrancy does not appear. Your budget gets a new hole shaped exactly like a marketing adjective.', {
          effects: { stress: 5, happiness: -3 },
          flags: { rentBump: bump },
          memory: `Rent went up $${bump} because the corridor was vibrant.`,
          tone: 'brutal',
          highlight: true,
        }),
        say('hunt', 'Look for a cheaper place', 'You tour two apartments. One smells like a secret. The other is fine and far. You lose a weekend and gain a small reduction in despair.', {
          effects: { energy: -6, stress: 3, money: -40 },
          flags: { rentBump: Math.round(bump / 2) },
          memory: 'You hunted for a lease that was merely bad.',
          tone: 'serious',
        }),
        {
          id: 'photos',
          label: 'Fight, using the photos',
          disabled: (state) => (state.flags.moveInPhotos ? null : 'You never documented the place.'),
          resolve: () => ({
            text: 'You attach the move-in photos to a calm email. A human, possibly by accident, replies. They cut the increase in half and fix a latch. You feel the rare joy of a paper trail.',
            effects: { stress: -2, happiness: 5 },
            flags: { rentBump: Math.round(bump / 2) },
            memory: 'Move-in photos talked a landlord down.',
            tone: 'warm' as const,
            highlight: true,
          }),
        },
      ];
    },
  }),
  ev({
    id: 'cheerful-email',
    title: 'We hope this note finds you well',
    weight: 3,
    once: true,
    categories: ['housing'],
    focuses: ['life'],
    when: (s) => s.housing.kind === 'apartment',
    location: 'apartment',
    weather: 'rain',
    narration: (s) =>
      `${s.housing.company ?? 'Management'} sends a weekend email with a sunflower emoji. The water will be shut off from 8 a.m. to 6 p.m. on Monday, and also they have lost a master key, so locks will be changed, and also the fire alarm test is the same day.\n\nThey hope you will enjoy a self-guided wellness walk.`,
    choices: () => [
      say('plan', 'Plan around it like an adult', 'You fill jugs. You warn your roommate. Monday is annoying and survivable. You are briefly competent, which you file under evidence.', {
        effects: { stress: 2, skills: 1, happiness: 1 },
        rel: [{ who: 'roommate', trust: 3, memory: 'You handled the outage without a meltdown.' }],
        tone: 'warm',
      }),
      say('reply-all', 'Reply-all with the truth', 'You hit reply-all. Two hundred residents exhale through you. The company sends a follow-up thanking the community for its passion. The water is still off.', {
        effects: { reputation: 3, stress: 3, social: 2 },
        memory: 'You reply-alled the truth to the whole building.',
        tone: 'funny',
        highlight: true,
      }),
        say('ignore', 'Ignore it and suffer stylishly', 'You learn about the outage at the sink, in a towel. The wellness walk happens whether you consent or not.', {
          effects: { stress: 5, happiness: -3 },
          tone: 'funny',
        }),
    ],
  }),
  ev({
    id: 'package-theft',
    title: 'The package room',
    weight: 3,
    once: true,
    categories: ['housing', 'money'],
    focuses: ['life'],
    when: (s) => s.housing.kind === 'apartment' || s.housing.kind === 'dorm',
    location: (s) => (s.housing.kind === 'apartment' ? 'apartment' : 'dorm'),
    narration: (s) =>
      `The tracking number says delivered. The package room says nothing, because it is a closet with a camera that faces a fern.\n\n${s.housing.company ?? 'The front desk'} suggests you "check with neighbors," as if your headphones have joined a book club.`,
    choices: () => [
      say('claim', 'File a claim', 'You file. Weeks later a coupon appears for five dollars off a future order from the company that lost your order. The loop is elegant.', {
        effects: { stress: 3, money: -28 },
        memory: 'A package became a coupon.',
        tone: 'funny',
      }),
      say('replace', 'Reorder it and eat the cost', 'You buy it again. The second one arrives. You hide it in a desk like a dragon. This is what security means now.', {
        effects: { money: -46, stress: 2, happiness: -1 },
        tone: 'serious',
      }),
      say('let-go', 'Let it go', 'You release the headphones into the folklore of the building. Your budget survives. Your playlists do not.', {
        effects: { happiness: -2, stress: -1 },
        tone: 'warm',
      }),
    ],
  }),
];

import { academicEvents } from './academic';
import { careerEvents } from './career';
import { housingEvents } from './housing';
import { lifeEvents } from './life';
import { moneyEvents } from './money';
import { personalEvents } from './personal';
import { socialEvents } from './social';
import { ev, say } from './helpers';
import type { GameEvent } from './types';

/**
 * Drop new events into a category file and add them to EVENTS.
 * The week picker handles weighting, years, and saves.
 */
export const EVENTS: GameEvent[] = [
  ...academicEvents,
  ...moneyEvents,
  ...housingEvents,
  ...socialEvents,
  ...personalEvents,
  ...careerEvents,
  ...lifeEvents,
];

const seenIds = new Set<string>();
for (const event of EVENTS) {
  if (seenIds.has(event.id)) throw new Error(`Duplicate event id: ${event.id}`);
  seenIds.add(event.id);
}

export const fallbackEvent: GameEvent = ev({
  id: 'fallback-week',
  title: 'An unmarked week',
  weight: 0,
  categories: ['academic'],
  when: () => false,
  location: 'quad',
  narration: () => 'The week arrives without a speech. You still have to spend it.',
  choices: () => [
    say('study', 'Study', 'You put your head down and do the work in front of you.', {
      effects: { termScore: 4, energy: -4, stress: 1 },
      tone: 'serious',
    }),
    say('rest', 'Rest', 'You let the week be small. Your body takes the offer.', {
      effects: { energy: 10, stress: -6, health: 2, termScore: -1 },
      tone: 'warm',
    }),
    say('people', 'See someone', 'You spend the time with a person instead of a portal.', {
      effects: { happiness: 4, social: 3, stress: -3 },
      tone: 'warm',
    }),
  ],
});

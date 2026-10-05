import type { LocationId, Season, Term, Weather } from './types';
import type { Rng } from './rng';

export const LOCATION_NAMES: Record<LocationId, string> = {
  quad: 'The Quad',
  dorm: 'Dorm room',
  library: 'Library',
  lecture: 'Lecture hall',
  dining: 'Dining hall',
  store: 'Campus store',
  apartment: 'Apartment',
  career: 'Career fair',
  party: 'A house near campus',
  street: 'College street',
  cafe: 'Corner cafe',
  graduation: 'Graduation lawn',
  clinic: 'Campus clinic',
  office: 'Office hours',
  bus: 'The bus stop',
};

export function seasonFor(term: Term, week: number): Season {
  if (term === 'fall') return week >= 14 ? 'winter' : 'fall';
  if (term === 'spring') return week <= 5 ? 'winter' : 'spring';
  return 'summer';
}

export function ambientWeather(season: Season, location: LocationId, rng: Rng): Weather {
  if (location === 'party' || location === 'street') return 'night';
  if (season === 'winter') return rng.pick<Weather>(['snow', 'overcast', 'clear', 'night']);
  if (season === 'fall') return rng.pick<Weather>(['golden', 'clear', 'rain', 'overcast']);
  if (season === 'spring') return rng.pick<Weather>(['rain', 'clear', 'golden', 'overcast']);
  return rng.pick<Weather>(['golden', 'clear', 'clear', 'rain']);
}

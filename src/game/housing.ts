import type { Rng } from './rng';
import type { Housing, HousingQuirk } from './types';

interface Company {
  name: string;
  slogan: string;
  quirk: HousingQuirk;
  rent: number;
  buildings: string[];
}

export const COMPANIES: Company[] = [
  {
    name: 'CampusPrime Residential',
    slogan: 'Premium College Living',
    quirk: 'elevator',
    rent: 1180,
    buildings: ['The Marlowe', 'Quadline Flats'],
  },
  {
    name: 'Elevate Student Living',
    slogan: 'Experience Elevated Student Living',
    quirk: 'elevator',
    rent: 1260,
    buildings: ['Elevate on Third', 'The Lookout'],
  },
  {
    name: 'UrbanNest Communities',
    slogan: 'Where Ambition Roosts',
    quirk: 'fees',
    rent: 1095,
    buildings: ['Nest House', 'UrbanNest West'],
  },
  {
    name: 'Luxury Student Housing Group',
    slogan: 'Because You Deserve Quartz',
    quirk: 'pool',
    rent: 1410,
    buildings: ['Quartz Commons', 'The Amenity'],
  },
  {
    name: 'PrimeCampus Management',
    slogan: 'A Higher Standard of Lease',
    quirk: 'deposit',
    rent: 1040,
    buildings: ['PrimeCampus Court', 'Leasehold Hall'],
  },
];

const HALLS = ['Larkspur Hall', 'East Wren', 'The Lowers', 'Cinder House', 'North Lamp'];

export function assignDorm(rng: Rng): Housing {
  return {
    kind: 'dorm',
    building: rng.pick(HALLS),
    company: null,
    slogan: null,
    quirk: 'laundry',
    rent: 0,
  };
}

export function assignApartment(rng: Rng): Housing {
  const company = rng.pick(COMPANIES);
  return {
    kind: 'apartment',
    building: rng.pick(company.buildings),
    company: company.name,
    slogan: company.slogan,
    quirk: company.quirk,
    rent: company.rent + rng.int(-50, 90),
  };
}

import type { PortraitSpec, PronounId } from '../game/types';

export interface Look {
  id: string;
  pronouns: PronounId;
  first: string[];
  last: string[];
  skin: number;
  hair: number;
  hairColor: number;
  face: number;
  shirt: number;
  accessory: number;
}

export const LOOKS: Look[] = [
  { id: '01', pronouns: 'she', skin: 1, hair: 2, hairColor: 1, face: 0, shirt: 2, accessory: 0, first: ['Elena', 'Sofia', 'Lucia', 'Giulia', 'Chiara'], last: ['Rossi', 'Marino', 'Esposito', 'Romano', 'Conti'] },
  { id: '02', pronouns: 'he', skin: 0, hair: 1, hairColor: 0, face: 1, shirt: 1, accessory: 0, first: ['Haru', 'Kenji', 'Jun', 'Wei', 'Minho'], last: ['Sato', 'Takahashi', 'Chen', 'Park', 'Kobayashi'] },
  { id: '03', pronouns: 'she', skin: 5, hair: 1, hairColor: 0, face: 0, shirt: 0, accessory: 2, first: ['Imani', 'Amara', 'Zora', 'Kemi', 'Ife'], last: ['Okoye', 'Abebe', 'Osei', 'Kamara', 'Diop'] },
  { id: '04', pronouns: 'he', skin: 2, hair: 1, hairColor: 2, face: 0, shirt: 2, accessory: 0, first: ['Luca', 'Marco', 'Enzo', 'Alessio', 'Nico'], last: ['Ferrara', 'Greco', 'Bianchi', 'Costa', 'Moretti'] },
  { id: '05', pronouns: 'she', skin: 4, hair: 3, hairColor: 0, face: 0, shirt: 3, accessory: 2, first: ['Aisha', 'Jamila', 'Tiana', 'Nala', 'Keisha'], last: ['Owusu', 'Boateng', 'Adeyemi', 'Mensah', 'Nwosu'] },
  { id: '06', pronouns: 'he', skin: 0, hair: 5, hairColor: 0, face: 1, shirt: 6, accessory: 0, first: ['Yuto', 'Hao', 'Dae', 'Riku', 'Sungho'], last: ['Kim', 'Suzuki', 'Choi', 'Yamamoto', 'Wu'] },
  { id: '07', pronouns: 'she', skin: 0, hair: 2, hairColor: 3, face: 0, shirt: 1, accessory: 1, first: ['Hannah', 'Claire', 'Grace', 'Ruth', 'Willa'], last: ['Brennan', 'Walsh', 'Keller', 'Hart', 'Bennett'] },
  { id: '08', pronouns: 'he', skin: 2, hair: 1, hairColor: 0, face: 1, shirt: 4, accessory: 0, first: ['Rohan', 'Arjun', 'Kabir', 'Dev', 'Vikram'], last: ['Mehta', 'Kapoor', 'Banerjee', 'Desai', 'Nair'] },
  { id: '09', pronouns: 'she', skin: 0, hair: 2, hairColor: 0, face: 2, shirt: 5, accessory: 0, first: ['Hana', 'Mei', 'Yuna', 'Sora', 'Hyejin'], last: ['Nguyen', 'Cho', 'Lin', 'Watanabe', 'Huang'] },
  { id: '10', pronouns: 'he', skin: 5, hair: 3, hairColor: 0, face: 1, shirt: 3, accessory: 0, first: ['Andre', 'Marcus', 'Malik', 'Isaiah', 'Jelani'], last: ['Diallo', 'Okonkwo', 'Adebayo', 'Okeke', 'Asante'] },
  { id: '11', pronouns: 'she', skin: 4, hair: 3, hairColor: 0, face: 0, shirt: 5, accessory: 2, first: ['Nia', 'Zuri', 'Amina', 'Eshe', 'Makena'], last: ['Traore', 'Bah', 'Conteh', 'Jalloh', 'Sow'] },
  { id: '12', pronouns: 'she', skin: 3, hair: 2, hairColor: 0, face: 2, shirt: 3, accessory: 0, first: ['Priya', 'Ananya', 'Meera', 'Kavya', 'Leela'], last: ['Patel', 'Shah', 'Singh', 'Iyer', 'Reddy'] },
  { id: '13', pronouns: 'she', skin: 0, hair: 4, hairColor: 0, face: 2, shirt: 2, accessory: 0, first: ['Jiyeon', 'Aiko', 'Linh', 'Mina', 'Eunji'], last: ['Pham', 'Ito', 'Zhang', 'Lee', 'Tanaka'] },
  { id: '14', pronouns: 'she', skin: 0, hair: 2, hairColor: 2, face: 0, shirt: 3, accessory: 0, first: ['Nora', 'Iris', 'June', 'Freya', 'Elise'], last: ['Adler', 'Lind', 'Frost', 'Berg', 'Vogel'] },
  { id: '15', pronouns: 'he', skin: 5, hair: 5, hairColor: 0, face: 1, shirt: 6, accessory: 0, first: ['Darius', 'Kwame', 'Jabari', 'Omari', 'Elijah'], last: ['Harris', 'Jackson', 'Robinson', 'Brooks', 'Green'] },
  { id: '16', pronouns: 'he', skin: 3, hair: 5, hairColor: 0, face: 1, shirt: 1, accessory: 0, first: ['Vivek', 'Nikhil', 'Aditya', 'Sameer', 'Rahul'], last: ['Sharma', 'Gupta', 'Joshi', 'Rao', 'Malhotra'] },
  { id: '17', pronouns: 'he', skin: 2, hair: 1, hairColor: 0, face: 1, shirt: 1, accessory: 0, first: ['Diego', 'Andres', 'Santiago', 'Emilio', 'Javier'], last: ['Navarro', 'Santos', 'Vasquez', 'Morales', 'Delgado'] },
  { id: '18', pronouns: 'he', skin: 0, hair: 1, hairColor: 3, face: 0, shirt: 6, accessory: 0, first: ['Miles', 'Owen', 'Noah', 'Elliot', 'Felix'], last: ['Ellis', 'Quinn', 'Kaplan', 'Moreau', 'Hayes'] },
];

const BY_SKIN: string[][] = [
  ['01', '02', '07', '09'],
  ['01', '02', '06', '07'],
  ['04', '08', '06', '09'],
  ['04', '05', '08', '01'],
  ['03', '05', '10', '08'],
  ['03', '10', '05', '04'],
];

const LOOK_IDS = new Set(LOOKS.map((look) => look.id));

export function portraitFor(look: Look): PortraitSpec {
  return {
    look: look.id,
    skin: look.skin,
    hair: look.hair,
    hairColor: look.hairColor,
    face: look.face,
    shirt: look.shirt,
    accessory: look.accessory,
  };
}

export function lookId(spec: PortraitSpec): string {
  if (spec.look && LOOK_IDS.has(spec.look)) return spec.look;
  const row = BY_SKIN[spec.skin % BY_SKIN.length] ?? BY_SKIN[0];
  if (spec.accessory % 5 === 1 && spec.skin % 6 <= 2) return '07';
  const index = (spec.hair + spec.hairColor * 2 + spec.face + spec.shirt) % row.length;
  return row[index] ?? '01';
}

export function lookSrc(spec: PortraitSpec): string {
  return `/art/people/look-${lookId(spec)}.png`;
}

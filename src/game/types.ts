export type PronounId = 'she' | 'he' | 'they';

export type Term = 'fall' | 'spring' | 'summer';

export type Focus = 'arrival' | 'life' | 'midterm' | 'finals' | 'summer';

export type Phase = 'play' | 'outcome' | 'ending' | 'dead';

export type Stage = 'none' | 'talking' | 'dating' | 'serious' | 'ex';

export type Tone = 'funny' | 'brutal' | 'warm' | 'absurd' | 'serious';

export type Weather = 'clear' | 'golden' | 'rain' | 'overcast' | 'night' | 'snow';

export type Season = 'fall' | 'winter' | 'spring' | 'summer';

export type LocationId =
  | 'quad'
  | 'dorm'
  | 'library'
  | 'lecture'
  | 'dining'
  | 'store'
  | 'apartment'
  | 'career'
  | 'party'
  | 'street'
  | 'cafe'
  | 'graduation'
  | 'clinic'
  | 'office'
  | 'bus';

export type Category =
  | 'housing'
  | 'money'
  | 'academic'
  | 'social'
  | 'dating'
  | 'health'
  | 'risk'
  | 'career'
  | 'work'
  | 'warm';

export type MajorId =
  | 'cs'
  | 'engineering'
  | 'business'
  | 'psychology'
  | 'biology'
  | 'communications'
  | 'art'
  | 'economics'
  | 'history'
  | 'political-science'
  | 'undeclared';

export type BackgroundId = 'low' | 'lower-middle' | 'middle' | 'upper-middle' | 'wealthy';

export type TraitId =
  | 'night-owl'
  | 'people-pleaser'
  | 'ambitious'
  | 'anxious'
  | 'charming'
  | 'blunt'
  | 'frugal'
  | 'impulsive'
  | 'bookish'
  | 'resilient'
  | 'competitive'
  | 'lonely'
  | 'optimistic'
  | 'cynical'
  | 'caretaker';

export type Archetype =
  | 'genuine'
  | 'casual'
  | 'network'
  | 'party'
  | 'academic'
  | 'romantic'
  | 'manipulative'
  | 'mentor'
  | 'awkward'
  | 'roommate'
  | 'former';

export type CastRole = 'roommate' | 'friend' | 'network' | 'interest' | 'mentor';

export type EndingKind = 'employed' | 'gradschool' | 'unemployed' | 'uncertain' | 'dismissed' | 'death';

export type JobLoad = 'light' | 'medium' | 'heavy';

export type HousingQuirk = 'elevator' | 'fees' | 'pool' | 'deposit' | 'laundry';

export interface PortraitSpec {
  skin: number;
  hair: number;
  hairColor: number;
  face: number;
  shirt: number;
  accessory: number;
  look?: string;
}

export interface Character {
  name: string;
  pronouns: PronounId;
  majorId: MajorId;
  backgroundId: BackgroundId;
  traitIds: TraitId[];
  portrait: PortraitSpec;
  hasCar: boolean;
  luck: number;
}

export interface Stats {
  energy: number;
  stress: number;
  health: number;
  happiness: number;
  social: number;
  reputation: number;
  skills: number;
  network: number;
}

export interface Person {
  name: string;
  pronouns: PronounId;
  role: CastRole;
  archetype: Archetype;
  affection: number;
  trust: number;
  known: boolean;
  memories: string[];
  portrait: PortraitSpec;
}

export interface Cast {
  roommate: Person;
  friend: Person;
  network: Person;
  interest: Person;
  mentor: Person;
}

export interface Housing {
  kind: 'dorm' | 'apartment' | 'home';
  building: string;
  company: string | null;
  slogan: string | null;
  quirk: HousingQuirk;
  rent: number;
}

export interface Job {
  id: string;
  title: string;
  weekly: number;
  stress: number;
  skill: number;
  load: JobLoad;
  research?: boolean;
}

export interface Internship {
  title: string;
  org: string;
  paid: boolean;
  year: number;
}

export interface Memory {
  year: number;
  term: Term;
  yearLabel: string;
  text: string;
  tone: Tone;
  highlight: boolean;
}

export interface TermResult {
  label: string;
  gpa: number;
}

export interface GameTime {
  year: 1 | 2 | 3 | 4;
  term: Term;
  week: number;
  label: string;
  focus: Focus;
  age: number;
  span: number;
}

export interface Offer {
  employer: string;
  role: string;
  shaky: boolean;
}

export interface GradAdmit {
  school: string;
  degree: string;
  program: string;
  funded: boolean;
}

export interface Outlook {
  score: number;
  market: 'bleak' | 'ordinary' | 'open';
  graduated: boolean;
  offer: Offer | null;
  grad: GradAdmit | null;
}

export interface Ending {
  kind: EndingKind;
  headline: string;
  outcome: string;
  role?: string;
  employer?: string;
  program?: string;
  detail?: string;
  gpa: number | null;
  debt: number;
  money: number;
  major: string;
  ageStart: number;
  ageEnd: number;
  relationships: number;
  internships: number;
  applications: number;
  weeks: number;
  credits: number;
  chapters: { year: string; lines: string[] }[];
  message: string;
  postscript?: string;
  seed: number;
  child: boolean;
}

export interface OutcomeView {
  title: string;
  text: string;
  deltas: string[];
}

export interface GameState {
  version: 1;
  seed: number;
  rng: number;
  phase: Phase;
  finale: 'none' | 'ceremony' | 'crossroads' | 'dismissed';
  beatIndex: number;
  time: GameTime;
  character: Character;
  stats: Stats;
  money: number;
  debt: number;
  gpa: number | null;
  credits: number;
  qualityPoints: number;
  termScore: number;
  terms: TermResult[];
  probation: boolean;
  housing: Housing;
  job: Job | null;
  jobsHeld: string[];
  cast: Cast;
  stage: Stage;
  flags: Record<string, string | number | boolean>;
  seen: string[];
  recent: string[];
  lastCategories: Category[];
  queue: string[];
  currentEventId: string;
  sceneLocation: LocationId;
  sceneWeather: Weather;
  outcome: OutcomeView | null;
  memories: Memory[];
  internships: Internship[];
  projects: number;
  applications: number;
  interviews: number;
  ghosts: number;
  offers: number;
  gradIntent: number;
  recommendations: number;
  research: boolean;
  pregnant: boolean;
  child: boolean;
  record: boolean;
  clubs: string[];
  ties: number;
  hospitalizations: number;
  banner: string | null;
  upkeepNote: string | null;
  weeksLived: number;
  outlook: Outlook | null;
  ending: Ending | null;
  death: { reason: string; text: string } | null;
}

export interface Effect {
  energy?: number;
  stress?: number;
  health?: number;
  happiness?: number;
  social?: number;
  reputation?: number;
  skills?: number;
  network?: number;
  money?: number;
  debt?: number;
  termScore?: number;
}

export interface RelChange {
  who: CastRole;
  affection?: number;
  trust?: number;
  memory?: string;
  known?: boolean;
  archetype?: Archetype;
}

export interface EndingPayload {
  kind: EndingKind;
  headline?: string;
  role?: string;
  detail?: string;
  employer?: string;
  program?: string;
  lastChance?: boolean;
  familyFirm?: boolean;
}

export interface LifeDraft {
  name: string;
  pronouns: PronounId;
  majorId: MajorId;
  backgroundId: BackgroundId;
  traitIds: [TraitId, TraitId, TraitId];
  seed: number;
  portrait: PortraitSpec;
  hasCar: boolean;
  luck: number;
}

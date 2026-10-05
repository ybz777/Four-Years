import type { Rng } from '../rng';
import type {
  Category,
  Effect,
  EndingPayload,
  Focus,
  GameState,
  Job,
  LocationId,
  MajorId,
  PortraitSpec,
  RelChange,
  Stage,
  Term,
  Tone,
  Weather,
} from '../types';

export interface EventContext {
  state: GameState;
  rng: Rng;
}

export interface Outcome {
  text: string;
  effects?: Effect;
  memory?: string;
  tone?: Tone;
  highlight?: boolean;
  flags?: Record<string, string | number | boolean>;
  queue?: string[];
  job?: Job | null;
  rel?: RelChange[];
  fatal?: { reason: string; text: string };
  stage?: Stage;
  pregnant?: boolean;
  child?: boolean;
  clearPregnant?: boolean;
  internship?: { title: string; org: string; paid: boolean };
  projects?: number;
  applications?: number;
  interviews?: number;
  ghosts?: number;
  offers?: number;
  gradIntent?: number;
  recommendations?: number;
  research?: boolean;
  record?: boolean;
  club?: string;
  ties?: number;
  hospitalizations?: number;
  ending?: EndingPayload;
  majorId?: MajorId;
}

export interface Choice {
  id: string;
  label: string;
  detail?: string;
  wild?: boolean;
  serious?: boolean;
  disabled?: (state: GameState) => string | null;
  resolve: (ctx: EventContext) => Outcome;
}

export interface GameEvent {
  id: string;
  title: string;
  weight: number;
  once?: boolean;
  categories: Category[];
  focuses?: Focus[];
  years?: number[];
  terms?: Term[];
  when?: (state: GameState) => boolean;
  location: LocationId | ((state: GameState) => LocationId);
  weather?: Weather | ((state: GameState, rng: Rng) => Weather);
  narration: (state: GameState) => string;
  speaker?: (state: GameState) => { name: string; line: string; portrait?: PortraitSpec } | null;
  choices: (state: GameState) => Choice[];
}

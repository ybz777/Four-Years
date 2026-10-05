import type { MajorId } from './types';

export interface MajorDef {
  id: MajorId;
  name: string;
  blurb: string;
  difficulty: number;
  market: number;
  gradMin: number;
  exam: string;
  project: string;
  roles: string[];
  programs: { degree: string; name: string }[];
}

export const MAJORS: MajorDef[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    blurb: 'The department calls it a way of thinking. The job posts want three years of it already.',
    difficulty: 7,
    market: 0.12,
    gradMin: 3.35,
    exam: 'a data-structures exam with one question that is actually five',
    project: 'a program specified only as "make it elegant"',
    roles: ['Junior developer', 'QA analyst', 'Implementation associate', 'IT analyst'],
    programs: [
      { degree: "Master's", name: 'Computer Science' },
      { degree: 'PhD', name: 'Computer Science' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    blurb: 'Problem sets that do not care about your shift, your sleep, or your sense of self.',
    difficulty: 8,
    market: 0.38,
    gradMin: 3.3,
    exam: 'a thermodynamics exam that hums like a threat',
    project: 'a design review where the bridge works and the group does not',
    roles: ['Design engineer', 'Field engineer', 'Quality associate', 'Project coordinator'],
    programs: [
      { degree: "Master's", name: 'Engineering' },
      { degree: 'PhD', name: 'Engineering' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    blurb: 'A major about people, taught mostly through slide decks about synergy.',
    difficulty: 4,
    market: 0.22,
    gradMin: 3.25,
    exam: 'a case study in which every answer is "it depends" and only one depends correctly',
    project: 'a group pitch with too many buzzwords and one useful sentence',
    roles: ['Operations coordinator', 'Sales development rep', 'Analyst', 'Account associate'],
    programs: [
      { degree: "Master's", name: 'Business Administration' },
      { degree: "Master's", name: 'Finance' },
    ],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    blurb: 'You learn why everyone is like this. You remain, inconveniently, like this.',
    difficulty: 5,
    market: 0.02,
    gradMin: 3.4,
    exam: 'a methods exam about whether the study you invented would pass a review board',
    project: 'a research writeup on a question people answer while lying',
    roles: ['Research coordinator', 'Case aide', 'HR coordinator', 'Behavioral technician'],
    programs: [
      { degree: "Master's", name: 'Psychology' },
      { degree: 'PhD', name: 'Psychology' },
      { degree: 'Professional', name: 'Social Work' },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    blurb: 'Memorize the cell. Then memorize the tuition. Both divide faster than you do.',
    difficulty: 7,
    market: -0.05,
    gradMin: 3.4,
    exam: 'an exam that asks you to redraw a pathway from memory and faith',
    project: 'a lab report where the data is shy and the conclusion cannot be',
    roles: ['Lab technician', 'Clinical research assistant', 'Quality associate', 'Medical scribe'],
    programs: [
      { degree: "Master's", name: 'Biology' },
      { degree: 'PhD', name: 'Biology' },
      { degree: 'Professional', name: 'Public Health' },
    ],
  },
  {
    id: 'communications',
    name: 'Communications',
    blurb: 'You get very good at saying something. A portal then asks you to prove you exist.',
    difficulty: 4,
    market: 0.05,
    gradMin: 3.2,
    exam: 'a theory exam about messages, audiences, and the group chat you muted',
    project: 'a campaign for a client who is, spiritually, a student club',
    roles: ['Communications coordinator', 'Social media associate', 'Junior producer', 'Account coordinator'],
    programs: [
      { degree: "Master's", name: 'Communications' },
      { degree: "Master's", name: 'Journalism' },
    ],
  },
  {
    id: 'art',
    name: 'Art',
    blurb: 'Critique is brutal and, on the good days, the most honest hour on campus.',
    difficulty: 3,
    market: -0.28,
    gradMin: 3.15,
    exam: 'a critique that is not an exam and is worse',
    project: 'a body of work that does not fit in a slide deck, which you still must make',
    roles: ['Studio assistant', 'Junior designer', 'Gallery assistant', 'Production assistant'],
    programs: [
      { degree: 'MFA', name: 'Studio Art' },
      { degree: "Master's", name: 'Art Education' },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    blurb: 'Incentives, models, and a career fair where everyone nods at the same time.',
    difficulty: 6,
    market: 0.18,
    gradMin: 3.35,
    exam: 'a problem set that was elegant until the last question grew teeth',
    project: 'a paper on a market that has never met your landlord',
    roles: ['Research assistant', 'Analyst', 'Consulting associate', 'Policy aide'],
    programs: [
      { degree: "Master's", name: 'Economics' },
      { degree: 'PhD', name: 'Economics' },
      { degree: 'Professional', name: 'Public Policy' },
    ],
  },
  {
    id: 'history',
    name: 'History',
    blurb: 'You can explain how the present got here. The rent is still due on Friday.',
    difficulty: 5,
    market: -0.18,
    gradMin: 3.3,
    exam: 'an essay exam with three hours and a prompt the size of a century',
    project: 'a research paper that starts as a question and ends as a pile of notes',
    roles: ['Research assistant', 'Archives assistant', 'Editorial assistant', 'Program coordinator'],
    programs: [
      { degree: "Master's", name: 'History' },
      { degree: 'PhD', name: 'History' },
      { degree: "Master's", name: 'Education' },
    ],
  },
  {
    id: 'political-science',
    name: 'Political Science',
    blurb: 'Institutions, theories, and a student government that is somehow less functional.',
    difficulty: 5,
    market: -0.06,
    gradMin: 3.3,
    exam: 'an exam about power that does not mention your group project',
    project: 'a policy memo nobody in power requested',
    roles: ['Legislative aide', 'Research associate', 'Organizer', 'Paralegal'],
    programs: [
      { degree: "Master's", name: 'Political Science' },
      { degree: 'Professional', name: 'Public Policy' },
      { degree: 'Professional', name: 'Law' },
    ],
  },
  {
    id: 'undeclared',
    name: 'Undeclared',
    blurb: 'An honest major. The university treats it like a clerical error with a dining plan.',
    difficulty: 4,
    market: -0.35,
    gradMin: 3.5,
    exam: 'a gen-ed exam in a subject you may never see again',
    project: 'a reflection essay, which is a kind of dare',
    roles: ['Coordinator', 'Assistant', 'Customer specialist'],
    programs: [{ degree: "Master's", name: 'Liberal Studies' }],
  },
];

const BY_ID = new Map(MAJORS.map((major) => [major.id, major]));

export function majorById(id: MajorId): MajorDef {
  const major = BY_ID.get(id);
  if (!major) throw new Error(`Unknown major ${id}`);
  return major;
}

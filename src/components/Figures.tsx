import { lookSrc } from '../art/looks';
import type { SceneFigure } from '../game/presence';

export function Figures({ people }: { people: SceneFigure[] }) {
  if (people.length === 0) return null;
  return (
    <div className="figures" aria-hidden="true">
      {people.map((person) => (
        <img
          key={`${person.you ? 'you' : 'them'}-${person.name}`}
          className={person.you ? 'figure you' : 'figure'}
          src={lookSrc(person.portrait)}
          alt=""
        />
      ))}
    </div>
  );
}

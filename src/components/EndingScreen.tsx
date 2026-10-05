import { dollars, gpaText } from '../game/text';
import type { Ending } from '../game/types';
import { Painting } from './Painting';

export function EndingScreen({ ending, onRestart }: { ending: Ending; onRestart: () => void }) {
  const dead = ending.kind === 'death';
  return (
    <div className="stage">
      <Painting
        location={dead ? 'street' : ending.kind === 'gradschool' ? 'library' : ending.kind === 'employed' ? 'quad' : 'graduation'}
        season={dead ? 'winter' : 'summer'}
        weather={dead ? 'night' : ending.kind === 'unemployed' ? 'rain' : 'golden'}
        year={4}
      />
      <div className="grain" />
      <div className="vignette" />
      <div className="dock">
        <article className="card scroll">
          <p className="ending-kicker">Four Years</p>
          <h2 className="ending-title">{ending.headline}</h2>
          <p className="prose">
            You entered college at {ending.ageStart}. {dead ? `You were ${ending.ageEnd}.` : `You left at ${ending.ageEnd}.`}
          </p>
          <dl className="facts">
            <div><dt>Major</dt><dd>{ending.major}</dd></div>
            <div><dt>GPA</dt><dd>{gpaText(ending.gpa)}</dd></div>
            <div><dt>Debt</dt><dd>{dollars(ending.debt)}</dd></div>
            <div><dt>Relationships</dt><dd>{ending.relationships}</dd></div>
            <div><dt>Internships</dt><dd>{ending.internships}</dd></div>
            <div><dt>Applications</dt><dd>{ending.applications}</dd></div>
          </dl>
          <p className="kicker">Final outcome</p>
          <p className="prose">{ending.outcome}</p>
          {ending.detail && <p className="blurb">{ending.detail}</p>}
          <p className="kicker">Major events</p>
          {ending.chapters.map((chapter) => (
            <section key={chapter.year} className="chapter">
              <h3>{chapter.year}</h3>
              <ul>
                {chapter.lines.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </section>
          ))}
          <p className="kicker">Final message</p>
          <p className="message">{ending.message}</p>
          {ending.postscript && <p className="blurb">{ending.postscript}</p>}
          <p className="help">Life no. {ending.seed}</p>
          <button className="primary" onClick={onRestart}>Live another life</button>
        </article>
      </div>
    </div>
  );
}

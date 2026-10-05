import { BACKGROUNDS } from '../game/backgrounds';
import {
  rollLife,
  shuffleTraits,
  withBackground,
  withMajor,
  withName,
  withPronouns,
} from '../game/create';
import { MAJORS } from '../game/majors';
import { traitById } from '../game/traits';
import type { BackgroundId, LifeDraft, MajorId, PronounId } from '../game/types';
import { Painting } from './Painting';
import { Portrait } from './Portrait';

export function CreateScreen({
  draft,
  onChange,
  onBegin,
  onBack,
}: {
  draft: LifeDraft;
  onChange: (draft: LifeDraft) => void;
  onBegin: () => void;
  onBack: () => void;
}) {
  const major = MAJORS.find((item) => item.id === draft.majorId) ?? MAJORS[0]!;
  const background = BACKGROUNDS.find((item) => item.id === draft.backgroundId) ?? BACKGROUNDS[2]!;
  return (
    <div className="stage">
      <Painting location="quad" season="fall" weather="clear" year={1} />
      <div className="grain" />
      <div className="vignette" />
      <div className="dossier">
        <aside className="identity">
          <Portrait spec={draft.portrait} size={180} label={`${draft.name}'s portrait`} />
          <h2>{draft.name}</h2>
          <p className="blurb">{background.name}. {major.name}.</p>
          <p className="blurb">{draft.hasCar ? 'There is a car with your name near it.' : 'You will be walking, or begging rides.'}</p>
          <p className="help">Life no. {draft.seed}</p>
          <div className="row">
            <button className="ghost" onClick={() => onChange(rollLife())}>Reroll the life</button>
            <button className="ghost" onClick={onBack}>Back</button>
          </div>
        </aside>
        <section className="form scroll">
          <h2>Who is walking in?</h2>
          <p className="blurb">The satire is the system, not a single real person. Change the name. The years will still surprise you.</p>
          <label className="field">
            <span>Name</span>
            <input value={draft.name} onChange={(event) => onChange(withName(draft, event.target.value))} />
          </label>
          <div className="field">
            <span>Pronouns</span>
            <div className="segmented">
              {(['they', 'she', 'he'] as PronounId[]).map((id) => (
                <button key={id} className={draft.pronouns === id ? 'on' : ''} onClick={() => onChange(withPronouns(draft, id))}>
                  {id === 'they' ? 'they/them' : id === 'she' ? 'she/her' : 'he/him'}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span>Economic background</span>
            <div className="pills">
              {BACKGROUNDS.map((item) => (
                <button
                  key={item.id}
                  className={draft.backgroundId === item.id ? 'on' : ''}
                  onClick={() => onChange(withBackground(draft, item.id as BackgroundId))}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <p className="blurb">{background.blurb}</p>
          </div>
          <div className="field">
            <span>Major</span>
            <div className="majors">
              {MAJORS.map((item) => (
                <button key={item.id} className={draft.majorId === item.id ? 'on' : ''} onClick={() => onChange(withMajor(draft, item.id as MajorId))}>
                  {item.name}
                </button>
              ))}
            </div>
            <p className="blurb">{major.blurb}</p>
          </div>
          <div className="field">
            <span>Traits</span>
            <div className="pills">
              {draft.traitIds.map((id) => (
                <span key={id} className="trait" style={{ padding: '8px 12px', borderRadius: 999 }}>
                  {traitById(id).name}
                </span>
              ))}
            </div>
            {draft.traitIds.map((id) => (
              <p key={id} className="blurb"><strong>{traitById(id).name}.</strong> {traitById(id).blurb}</p>
            ))}
            <button className="ghost" onClick={() => onChange(shuffleTraits(draft))}>Shuffle one trait</button>
          </div>
          <button className="primary" disabled={!draft.name.trim()} onClick={onBegin}>Start freshman year</button>
        </section>
      </div>
    </div>
  );
}

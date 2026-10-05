import { useEffect, useState } from 'react';
import { playChoice, playScene, stopScene, unlockAudio } from '../audio/cues';
import { dateLine } from '../game/calendar';
import { choose, continueGame, getEvent } from '../game/engine';
import { LOCATION_NAMES, seasonFor } from '../game/locations';
import { peoplePresent } from '../game/presence';
import { archetypeLabel, bondWord, conditionLine } from '../game/presentation';
import { clearGame } from '../game/save';
import { dollars, gpaText } from '../game/text';
import type { GameState } from '../game/types';
import { EndingScreen } from './EndingScreen';
import { Figures } from './Figures';
import { Painting } from './Painting';
import { Portrait, moodOf } from './Portrait';

function continueLabel(state: GameState): string {
  if (state.death) return 'Read the years';
  if (state.finale === 'dismissed') return 'See the story';
  if (state.currentEventId === 'crossroads') return 'See the story';
  if (state.currentEventId === 'ceremony') return 'Face what comes next';
  return 'Continue';
}

export function PlayScreen({
  state,
  onChange,
  onExit,
}: {
  state: GameState;
  onChange: (state: GameState) => void;
  onExit: () => void;
}) {
  const [journal, setJournal] = useState(false);
  const [tab, setTab] = useState<'people' | 'years'>('people');
  const [abandon, setAbandon] = useState(false);

  useEffect(() => {
    if (state.phase === 'ending' || state.phase === 'dead') {
      playScene(state.death ? 'death' : 'ending', state.death ? ['risk'] : ['warm']);
      return () => stopScene();
    }
    if (state.phase !== 'play') return undefined;
    try {
      const scene = getEvent(state.currentEventId);
      playScene(scene.id, scene.categories);
    } catch {
      stopScene();
    }
    return () => stopScene();
  }, [state.phase, state.currentEventId, state.death]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (state.phase !== 'play' || journal) return;
      const index = Number(event.key) - 1;
      if (index < 0 || index > 8) return;
      const eventDef = getEvent(state.currentEventId);
      const choice = eventDef.choices(state)[index];
      if (!choice || choice.disabled?.(state)) return;
      unlockAudio();
      const next = choose(state, choice.id);
      playChoice({
        eventId: eventDef.id,
        choiceId: choice.id,
        wild: choice.wild,
        serious: choice.serious,
        fatal: Boolean(next.death),
      });
      onChange(next);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, journal, onChange]);

  if ((state.phase === 'ending' || state.phase === 'dead') && state.ending) {
    return (
      <EndingScreen
        ending={state.ending}
        onRestart={() => {
          clearGame();
          onExit();
        }}
      />
    );
  }

  const sceneEvent = (state.phase === 'play' || state.phase === 'outcome') && state.currentEventId !== 'dismissal-letter'
    ? getEvent(state.currentEventId)
    : null;
  const event = state.phase === 'play' ? sceneEvent : null;
  const figures = peoplePresent(state, sceneEvent);
  const speaker = event?.speaker?.(state) ?? null;
  const paragraphs = (event?.narration(state) ?? '').split('\n\n');
  const choices = event?.choices(state) ?? [];
  const people = Object.values(state.cast).filter((person) => person.known);

  return (
    <div className="stage">
      <Painting
        location={state.sceneLocation}
        season={seasonFor(state.time.term, state.time.week)}
        weather={state.sceneWeather}
        year={state.time.year}
        slogan={state.housing.slogan}
      />
      <div className="grain" />
      <div className="vignette" />
      <Figures people={figures} />
      <header className="topbar">
        <div className="brand">
          <Portrait spec={state.character.portrait} mood={moodOf(state)} size={64} label={state.character.name} />
          <div>
            <h1>Four Years</h1>
            <p className="when">{dateLine(state.time)} · Age {state.time.age}</p>
          </div>
        </div>
        <div>
          <div className="stats">
            <span className="chip">{dollars(state.money)}</span>
            <span className="chip">GPA {gpaText(state.gpa)}</span>
            {state.debt > 0 && <span className="chip">Debt {dollars(state.debt)}</span>}
            <button className="icon-btn" onClick={() => setJournal(true)}>Journal</button>
          </div>
          <p className="condition">{conditionLine(state)}</p>
        </div>
      </header>
      <div className="dock">
        <article className="card">
          <p className="kicker">{LOCATION_NAMES[state.sceneLocation]}</p>
          {state.phase === 'outcome' && state.outcome ? (
            <>
              <h2>{state.outcome.title}</h2>
              {state.outcome.text.split('\n\n').map((paragraph) => <p className="prose" key={paragraph}>{paragraph}</p>)}
              {state.outcome.deltas.length > 0 && (
                <div className="deltas">
                  {state.outcome.deltas.map((delta) => <span className="delta" key={delta}>{delta}</span>)}
                </div>
              )}
              <button className="primary" onClick={() => { unlockAudio(); onChange(continueGame(state)); }}>{continueLabel(state)}</button>
            </>
          ) : (
            <>
              <h2>{event?.title}</h2>
              {state.banner && <p className="banner">{state.banner}</p>}
              {state.upkeepNote && <p className="upkeep">{state.upkeepNote}</p>}
              <div className="prose">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {speaker && (
                <blockquote className="quote">
                  {speaker.portrait && <Portrait spec={speaker.portrait} size={56} label="" />}
                  <div>
                    <cite>{speaker.name}</cite>
                    <p>{speaker.line}</p>
                  </div>
                </blockquote>
              )}
              <div className="choices">
                {choices.map((choice, index) => {
                  const reason = choice.disabled?.(state) ?? null;
                  return (
                    <button
                      key={choice.id}
                      className={`choice${choice.wild ? ' wild' : ''}${choice.serious ? ' serious' : ''}`}
                      disabled={Boolean(reason)}
                      onClick={() => {
                        if (!event) return;
                        unlockAudio();
                        const next = choose(state, choice.id);
                        playChoice({
                          eventId: event.id,
                          choiceId: choice.id,
                          wild: choice.wild,
                          serious: choice.serious,
                          fatal: Boolean(next.death),
                        });
                        onChange(next);
                      }}
                    >
                      <strong>{index + 1}. {choice.label}</strong>
                      {(choice.detail || reason) && <small>{reason ?? choice.detail}</small>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </article>
      </div>
      {journal && (
        <div className="overlay" onClick={() => setJournal(false)}>
          <aside className="overlay-card" onClick={(event) => event.stopPropagation()}>
            <div className="tabs">
              <button className={tab === 'people' ? 'primary' : 'ghost'} onClick={() => setTab('people')}>People</button>
              <button className={tab === 'years' ? 'primary' : 'ghost'} onClick={() => setTab('years')}>Years</button>
              <button className="ghost" onClick={() => setJournal(false)}>Close</button>
            </div>
            {tab === 'people' ? (
              people.map((person) => (
                <div className="person" key={person.name}>
                  <Portrait spec={person.portrait} size={56} label="" />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{archetypeLabel(person.archetype)} · {bondWord(person.affection)}</p>
                    {person.memories[person.memories.length - 1] && <p>{person.memories[person.memories.length - 1]}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div>
                {state.memories.length === 0 && <p className="blurb">Nothing has insisted on being remembered yet.</p>}
                {state.memories.map((memory) => (
                  <p key={`${memory.year}-${memory.text}`}><strong>{memory.yearLabel}.</strong> {memory.text}</p>
                ))}
                <p className="help">Life no. {state.seed}</p>
              </div>
            )}
            {abandon ? (
              <div className="row">
                <button
                  className="danger"
                  onClick={() => {
                    clearGame();
                    onExit();
                  }}
                >
                  Abandon this life
                </button>
                <button className="ghost" onClick={() => setAbandon(false)}>Keep going</button>
              </div>
            ) : (
              <button className="ghost" onClick={() => setAbandon(true)}>Leave this life</button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

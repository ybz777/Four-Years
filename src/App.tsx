import { useState } from 'react';
import { unlockAudio } from './audio/cues';
import { CreateScreen } from './components/CreateScreen';
import { PlayScreen } from './components/PlayScreen';
import { TitleScreen } from './components/TitleScreen';
import { rollLife } from './game/create';
import { startGame } from './game/engine';
import { clearGame, loadGame, saveGame } from './game/save';
import type { GameState, LifeDraft } from './game/types';

type Screen = 'title' | 'create' | 'play';

export function App() {
  const [save, setSave] = useState<GameState | null>(() => loadGame());
  const [screen, setScreen] = useState<Screen>('title');
  const [draft, setDraft] = useState<LifeDraft | null>(null);

  function begin() {
    if (!draft || !draft.name.trim()) return;
    unlockAudio();
    clearGame();
    const next = startGame(draft);
    saveGame(next);
    setSave(next);
    setScreen('play');
  }

  return (
    <>
      {screen === 'title' && (
        <TitleScreen
          save={save}
          onNew={() => {
            setDraft(rollLife());
            setScreen('create');
          }}
          onContinue={() => save && setScreen('play')}
        />
      )}
      {screen === 'create' && draft && (
        <CreateScreen
          draft={draft}
          onChange={setDraft}
          onBegin={begin}
          onBack={() => setScreen('title')}
        />
      )}
      {screen === 'play' && save && (
        <PlayScreen
          state={save}
          onChange={(next) => {
            setSave(next);
            saveGame(next);
          }}
          onExit={() => {
            setSave(null);
            setScreen('title');
          }}
        />
      )}
    </>
  );
}

import { unlockAudio } from '../audio/cues';
import { dateLine } from '../game/calendar';
import type { GameState } from '../game/types';
import { Painting } from './Painting';

export function TitleScreen({
  save,
  onContinue,
  onNew,
}: {
  save: GameState | null;
  onContinue: () => void;
  onNew: () => void;
}) {
  return (
    <div className="stage">
      <Painting location="quad" season="fall" weather="golden" year={1} />
      <div className="grain" />
      <div className="vignette" />
      <div className="poster">
        <p className="kicker" style={{ color: '#f6efe2' }}>Calder University · Harborbend</p>
        <h1 className="poster-title">Four Years</h1>
        <p className="tagline">Everyone says these are the best years of your life.</p>
        <p className="deck">
          A randomized, satirical life through college, money, housing, work, friendship, and whatever the market does next.
          Not a biography. A thousand ways it can go.
        </p>
        <div className="actions">
          <button className="primary" onClick={onNew}>Begin a life</button>
          {save && (
            <button className="ghost continue-save" onClick={() => { unlockAudio(); onContinue(); }}>
              Continue · {dateLine(save.time)}
            </button>
          )}
        </div>
        <p className="note">
          Wealth changes the walls, not the ending. The years can include debt, sex, drinking, violence, and rare death.
          None of it is required. All of it can happen.
        </p>
      </div>
    </div>
  );
}

import type { GameState } from './types';

const KEY = 'four-years-save-v1';

export function saveGame(state: GameState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;
    if (!data || data.version !== 1 || !data.character || !data.time) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  localStorage.removeItem(KEY);
}

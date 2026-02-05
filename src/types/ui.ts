import type { DeckData } from './deck';

// UI状態関連の型定義

export interface UIState {
  loading: boolean;
  error: string | null;
  processingProgress: { current: number; total: number } | null;
}

export interface AppState {
  deckList: DeckData[];
  ui: UIState;
}

export interface AppActions {
  setDeckList: (decks: DeckData[]) => void;
  addDecks: (decks: DeckData[]) => void;
  removeDeck: (id: string) => void;
  updateDeck: (id: string, updates: Partial<Pick<DeckData, 'playerName' | 'deckName'>>) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: { current: number; total: number } | null) => void;
}
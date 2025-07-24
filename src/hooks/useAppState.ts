import { useState } from "react";

interface DeckData {
  id: string;
  code: string;
  playerName?: string;
  imageUrl: string;
  addedAt: Date;
}

interface UIState {
  loading: boolean;
  error: string | null;
  processingProgress: { current: number; total: number } | null;
}

interface AppState {
  deckList: DeckData[];
  ui: UIState;
}

interface AppActions {
  setDeckList: (decks: DeckData[]) => void;
  addDecks: (decks: DeckData[]) => void;
  removeDeck: (id: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: { current: number; total: number } | null) => void;
}

const initialAppState: AppState = {
  deckList: [],
  ui: {
    loading: false,
    error: null,
    processingProgress: null,
  },
};

export const useAppState = (): [AppState, AppActions] => {
  const [appState, setAppState] = useState<AppState>(initialAppState);

  const setDeckList = (decks: DeckData[]) => {
    setAppState((prev) => ({
      ...prev,
      deckList: decks,
    }));
  };

  const addDecks = (decks: DeckData[]) => {
    setAppState((prev) => ({
      ...prev,
      deckList: [...decks, ...prev.deckList],
    }));
  };

  const removeDeck = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      deckList: prev.deckList.filter((deck) => deck.id !== id),
    }));
  };

  const clearAll = () => {
    setAppState((prev) => ({
      ...prev,
      deckList: [],
    }));
  };

  const setLoading = (loading: boolean) => {
    setAppState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        loading,
      },
    }));
  };

  const setError = (error: string | null) => {
    setAppState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        error,
      },
    }));
  };

  const setProgress = (progress: { current: number; total: number } | null) => {
    setAppState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        processingProgress: progress,
      },
    }));
  };

  const actions: AppActions = {
    setDeckList,
    addDecks,
    removeDeck,
    clearAll,
    setLoading,
    setError,
    setProgress,
  };

  return [appState, actions];
};

export type { DeckData, AppState, AppActions };

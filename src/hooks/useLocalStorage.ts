import type { DeckData } from "../types";
import { STORAGE_KEYS } from "../constants";

export const useLocalStorage = () => {
  // localStorageからデータを読み込む
  const loadDeckList = (): DeckData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(
          (deck: {
            id: string;
            code: string;
            playerName?: string;
            imageUrl: string;
            addedAt: string;
          }) => ({
            ...deck,
            addedAt: new Date(deck.addedAt),
          })
        );
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return [];
  };

  // localStorageにデータを保存する
  const saveDeckList = (decks: DeckData[]) => {
    try {
      const serialized = decks.map((deck) => ({
        ...deck,
        addedAt: deck.addedAt.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(serialized));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  return {
    loadDeckList,
    saveDeckList,
  };
};
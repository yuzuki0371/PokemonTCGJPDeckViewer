import type { DeckData, AppError } from "../types";
import { ErrorType, createAppError, isQuotaExceededError } from "../types";
import { STORAGE_KEYS, ERROR_MESSAGES } from "../constants";

interface UseLocalStorageResult {
  loadDeckList: () => { data: DeckData[]; error: AppError | null };
  saveDeckList: (decks: DeckData[]) => AppError | null;
}

export const useLocalStorage = (): UseLocalStorageResult => {
  // localStorageからデータを読み込む
  const loadDeckList = (): { data: DeckData[]; error: AppError | null } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DECK_LIST);
      if (stored) {
        const parsed = JSON.parse(stored);
        const data = parsed.map(
          (deck: { id: string; code: string; playerName?: string; imageUrl: string; addedAt: string }) => ({
            ...deck,
            addedAt: new Date(deck.addedAt),
          })
        );
        return { data, error: null };
      }
      return { data: [], error: null };
    } catch (error) {
      const appError = handleLoadError(error);
      console.error("Failed to load from localStorage:", error);
      return { data: [], error: appError };
    }
  };

  // localStorageにデータを保存する
  const saveDeckList = (decks: DeckData[]): AppError | null => {
    try {
      const serialized = decks.map(deck => ({
        ...deck,
        addedAt: deck.addedAt.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEYS.DECK_LIST, JSON.stringify(serialized));
      return null;
    } catch (error) {
      const appError = handleSaveError(error);
      console.error("Failed to save to localStorage:", error);
      return appError;
    }
  };

  return {
    loadDeckList,
    saveDeckList,
  };
};

// エラーハンドリングヘルパー関数
const handleLoadError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error instanceof SyntaxError) {
      return createAppError(ErrorType.PARSE_ERROR, ERROR_MESSAGES.STORAGE_PARSE_FAILED, error);
    }
  }

  return createAppError(
    ErrorType.STORAGE_ERROR,
    ERROR_MESSAGES.STORAGE_LOAD_FAILED,
    error instanceof Error ? error : undefined
  );
};

const handleSaveError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (isQuotaExceededError(error)) {
      return createAppError(ErrorType.QUOTA_EXCEEDED, ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED, error);
    }
  }

  return createAppError(
    ErrorType.STORAGE_ERROR,
    ERROR_MESSAGES.STORAGE_SAVE_FAILED,
    error instanceof Error ? error : undefined
  );
};

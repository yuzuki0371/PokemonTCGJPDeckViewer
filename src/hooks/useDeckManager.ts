import type { DeckData, AppState, AppActions, FormState, FormActions, BulkProcessResult, AppError } from "../types";
import { ErrorType, createAppError, isNetworkError } from "../types";
import { ERROR_MESSAGES } from "../constants";
import {
  parseBulkInputLine,
  checkDuplicate,
  createDeckData,
  generateResultMessage
} from "../utils/deckUtils";


export const useDeckManager = (
  appState: AppState,
  appActions: AppActions,
  formState: FormState,
  formActions: FormActions,
  saveDeckList: (decks: DeckData[]) => AppError | null
) => {





  // フォーム送信のメインハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.isBulkMode) {
      if (!formState.bulkMode.input.trim()) {
        appActions.setError(ERROR_MESSAGES.DECK_CODE_REQUIRED);
        return;
      }

      await handleBulkSubmit();
    } else {
      if (!formState.singleMode.deckCode.trim()) {
        appActions.setError(ERROR_MESSAGES.DECK_CODE_REQUIRED);
        return;
      }

      await handleSingleSubmit();
    }
  };

  // 単体追加処理
  const handleSingleSubmit = async () => {
    const trimmedCode = formState.singleMode.deckCode.trim();

    // 重複チェック
    if (appState.deckList.some((deck) => deck.code === trimmedCode)) {
      appActions.setError(ERROR_MESSAGES.DECK_CODE_DUPLICATE);
      return;
    }

    appActions.setLoading(true);
    appActions.setError(null);

    try {
      const newDeck = createDeckData(
        trimmedCode,
        formState.singleMode.playerName
      );
      if (newDeck) {
        const updatedList = [newDeck, ...appState.deckList];
        appActions.setDeckList(updatedList);
        const saveError = saveDeckList(updatedList);
        if (saveError) {
          appActions.setError(saveError.message);
        } else {
          formActions.resetSingleForm();
        }
      }
    } catch (error) {
      const appError = handleDeckFetchError(error);
      appActions.setError(appError.message);
    } finally {
      appActions.setLoading(false);
    }
  };

  // 一括追加処理
  const handleBulkSubmit = async () => {
    const lines = formState.bulkMode.input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      appActions.setError(ERROR_MESSAGES.BULK_NO_DATA);
      return;
    }

    appActions.setLoading(true);
    appActions.setError(null);
    appActions.setProgress({ current: 0, total: lines.length });

    const result: BulkProcessResult = {
      newDecks: [],
      duplicates: [],
      errors: [],
    };

    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        appActions.setProgress({ current: i + 1, total: lines.length });

        const parsed = parseBulkInputLine(line);

        if (!parsed.code) {
          result.errors.push(`行 ${i + 1}: デッキコードが見つかりません`);
          continue;
        }

        // 重複チェック
        if (checkDuplicate(parsed.code, appState.deckList, result.newDecks)) {
          result.duplicates.push(parsed.code);
          continue;
        }

        const newDeck = createDeckData(parsed.code, parsed.playerName);
        if (newDeck) {
          result.newDecks.push(newDeck);
        }

        // 処理間隔を設ける（UI更新のため）
        if (i < lines.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // デッキリストの更新
      if (result.newDecks.length > 0) {
        const updatedList = [...result.newDecks, ...appState.deckList];
        appActions.setDeckList(updatedList);
        const saveError = saveDeckList(updatedList);
        if (saveError) {
          appActions.setError(saveError.message);
          return;
        }
      }

      // 結果メッセージの処理
      const message = generateResultMessage(result);

      if (
        result.newDecks.length === 0 &&
        (result.duplicates.length > 0 || result.errors.length > 0)
      ) {
        appActions.setError(
          message || ERROR_MESSAGES.BULK_NO_DECKS_ADDED
        );
      } else if (result.duplicates.length > 0 || result.errors.length > 0) {
        appActions.setError(message);
      } else {
        formActions.resetBulkForm();
      }
    } catch (error) {
      const appError = handleBulkProcessError(error);
      appActions.setError(appError.message);
    } finally {
      appActions.setLoading(false);
      appActions.setProgress(null);
    }
  };

  // デッキ削除処理
  const handleRemoveDeck = (id: string) => {
    const updatedList = appState.deckList.filter((deck) => deck.id !== id);
    appActions.removeDeck(id);
    const saveError = saveDeckList(updatedList);
    if (saveError) {
      appActions.setError(saveError.message);
    }
  };

  // 全削除処理
  const handleClearAll = () => {
    appActions.clearAll();
    const saveError = saveDeckList([]);
    if (saveError) {
      appActions.setError(saveError.message);
    } else {
      formActions.resetForm();
      appActions.setError(null);
    }
  };

  return {
    handleSubmit,
    handleRemoveDeck,
    handleClearAll,
  };
};

// エラーハンドリングヘルパー関数
const handleDeckFetchError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (isNetworkError(error)) {
      return createAppError(
        ErrorType.NETWORK_ERROR,
        ERROR_MESSAGES.NETWORK_CONNECTION_ERROR,
        error
      );
    }
    
    // その他のエラー
    return createAppError(
      ErrorType.VALIDATION_ERROR,
      ERROR_MESSAGES.DECK_FETCH_FAILED,
      error
    );
  }
  
  // 不明なエラー
  return createAppError(
    ErrorType.VALIDATION_ERROR,
    ERROR_MESSAGES.DECK_FETCH_FAILED
  );
};

const handleBulkProcessError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return createAppError(
      ErrorType.VALIDATION_ERROR,
      ERROR_MESSAGES.BULK_PROCESS_FAILED,
      error
    );
  }
  
  return createAppError(
    ErrorType.VALIDATION_ERROR,
    ERROR_MESSAGES.BULK_PROCESS_FAILED
  );
};
import type { DeckData, AppState, AppActions } from "./useAppState";
import type { FormState, FormActions } from "./useFormState";
import { generateDeckUrls } from "../constants";

interface ParsedLine {
  playerName?: string;
  code: string;
}

interface BulkProcessResult {
  newDecks: DeckData[];
  duplicates: string[];
  errors: string[];
}

export const useDeckManager = (
  appState: AppState,
  appActions: AppActions,
  formState: FormState,
  formActions: FormActions,
  saveDeckList: (decks: DeckData[]) => void
) => {

  // 単一デッキデータの生成
  const addSingleDeck = (
    code: string,
    playerName?: string
  ): DeckData | null => {
    const trimmedCode = code.trim();
    const trimmedPlayerName = playerName?.trim();

    if (!trimmedCode) return null;

    // 重複チェック
    if (appState.deckList.some((deck) => deck.code === trimmedCode)) {
      return null;
    }

    const imageUrl = generateDeckUrls(trimmedCode).view;
    return {
      id: `${Date.now()}-${Math.random()}`,
      code: trimmedCode,
      playerName: trimmedPlayerName || undefined,
      imageUrl,
      addedAt: new Date(),
    };
  };

  // 一括入力の行解析
  const parseBulkInputLine = (line: string): ParsedLine => {
    let playerName: string | undefined;
    let code: string;

    // タブ区切りかどうかチェック（Excelからのコピー）
    if (line.includes("\t")) {
      const parts = line.split("\t");
      playerName = parts[0]?.trim();
      code = parts[1]?.trim() || "";
    } else {
      // 他の区切り文字で分割を試す
      const parts = line.split(/[,;\s]+/);
      if (parts.length >= 2) {
        playerName = parts[0]?.trim();
        code = parts[1]?.trim() || "";
      } else {
        // 単一のデッキコードとして処理
        code = parts[0]?.trim() || "";
      }
    }

    return { playerName, code };
  };

  // 重複チェック
  const checkDuplicate = (code: string, newDecks: DeckData[]): boolean => {
    return (
      appState.deckList.some((deck) => deck.code === code) ||
      newDecks.some((deck) => deck.code === code)
    );
  };

  // 結果メッセージの生成
  const generateResultMessage = (result: BulkProcessResult): string => {
    const { newDecks, duplicates, errors } = result;
    let message = "";
    
    if (newDecks.length > 0) {
      message += `${newDecks.length}件を追加しました。`;
    }
    if (duplicates.length > 0) {
      message += ` ${duplicates.length}件のデッキコードは既に追加済みのためスキップしました。`;
    }
    if (errors.length > 0) {
      message += ` ${errors.length}件でエラーが発生しました。`;
    }

    return message;
  };

  // フォーム送信のメインハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.isBulkMode) {
      if (!formState.bulkMode.input.trim()) {
        appActions.setError("デッキコードを入力してください");
        return;
      }

      await handleBulkSubmit();
    } else {
      if (!formState.singleMode.deckCode.trim()) {
        appActions.setError("デッキコードを入力してください");
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
      appActions.setError("このデッキコードは既に追加されています");
      return;
    }

    appActions.setLoading(true);
    appActions.setError(null);

    try {
      const newDeck = addSingleDeck(
        trimmedCode,
        formState.singleMode.playerName
      );
      if (newDeck) {
        const updatedList = [newDeck, ...appState.deckList];
        appActions.setDeckList(updatedList);
        saveDeckList(updatedList);
        formActions.resetSingleForm();
      }
    } catch {
      appActions.setError("デッキレシピの取得に失敗しました");
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
      appActions.setError("有効なデータが見つかりません");
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
        if (checkDuplicate(parsed.code, result.newDecks)) {
          result.duplicates.push(parsed.code);
          continue;
        }

        const newDeck = addSingleDeck(parsed.code, parsed.playerName);
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
        saveDeckList(updatedList);
      }

      // 結果メッセージの処理
      const message = generateResultMessage(result);

      if (
        result.newDecks.length === 0 &&
        (result.duplicates.length > 0 || result.errors.length > 0)
      ) {
        appActions.setError(
          message || "追加できるデッキが見つかりませんでした"
        );
      } else if (result.duplicates.length > 0 || result.errors.length > 0) {
        appActions.setError(message);
      } else {
        formActions.resetBulkForm();
      }
    } catch {
      appActions.setError("一括処理中にエラーが発生しました");
    } finally {
      appActions.setLoading(false);
      appActions.setProgress(null);
    }
  };

  // デッキ削除処理
  const handleRemoveDeck = (id: string) => {
    appActions.removeDeck(id);
    saveDeckList(appState.deckList.filter((deck) => deck.id !== id));
  };

  // 全削除処理
  const handleClearAll = () => {
    appActions.clearAll();
    saveDeckList([]);
    formActions.resetForm();
    appActions.setError(null);
  };

  return {
    handleSubmit,
    handleRemoveDeck,
    handleClearAll,
  };
};
import type { DeckData } from "../hooks/useAppState";
import { generateDeckUrls } from "../constants";

// 入力解析の結果型
export interface ParsedLine {
  playerName?: string;
  code: string;
}

// 一括処理結果型
export interface BulkProcessResult {
  newDecks: DeckData[];
  duplicates: string[];
  errors: string[];
}

// 一括入力の行解析
export const parseBulkInputLine = (line: string): ParsedLine => {
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
export const checkDuplicate = (
  code: string,
  existingDecks: DeckData[],
  newDecks: DeckData[]
): boolean => {
  return (
    existingDecks.some((deck) => deck.code === code) ||
    newDecks.some((deck) => deck.code === code)
  );
};

// デッキデータ生成
export const createDeckData = (
  code: string,
  playerName?: string
): DeckData | null => {
  const trimmedCode = code.trim();
  const trimmedPlayerName = playerName?.trim();

  if (!trimmedCode) return null;

  const imageUrl = generateDeckUrls(trimmedCode).view;
  return {
    id: `${Date.now()}-${Math.random()}`,
    code: trimmedCode,
    playerName: trimmedPlayerName || undefined,
    imageUrl,
    addedAt: new Date(),
  };
};

// 結果メッセージの生成
export const generateResultMessage = (result: BulkProcessResult): string => {
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
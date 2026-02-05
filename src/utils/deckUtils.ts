import type { DeckData, ParsedLine, BulkProcessResult } from "../types";
import { generateDeckUrls } from "../constants";

// 一括入力の行解析
export const parseBulkInputLine = (line: string): ParsedLine => {
  let playerName: string | undefined;
  let deckName: string | undefined;
  let code: string;

  // タブ区切りかどうかチェック（Excelからのコピー）
  if (line.includes("\t")) {
    const parts = line.split("\t");
    if (parts.length >= 3) {
      // 3列: プレイヤー名、デッキコード、デッキ名
      playerName = parts[0]?.trim();
      code = parts[1]?.trim() || "";
      deckName = parts[2]?.trim();
    } else {
      // 2列: プレイヤー名、デッキコード
      playerName = parts[0]?.trim();
      code = parts[1]?.trim() || "";
    }
  } else {
    // 他の区切り文字で分割を試す
    const parts = line.split(/[,;\s]+/);
    if (parts.length >= 3) {
      // 3要素: プレイヤー名、デッキコード、デッキ名
      playerName = parts[0]?.trim();
      code = parts[1]?.trim() || "";
      deckName = parts[2]?.trim();
    } else if (parts.length >= 2) {
      playerName = parts[0]?.trim();
      code = parts[1]?.trim() || "";
    } else {
      // 単一のデッキコードとして処理
      code = parts[0]?.trim() || "";
    }
  }

  return { playerName, deckName, code };
};

// デッキデータ生成
export const createDeckData = (
  code: string,
  playerName?: string,
  deckName?: string
): DeckData | null => {
  const trimmedCode = code.trim();
  const trimmedPlayerName = playerName?.trim();
  const trimmedDeckName = deckName?.trim();

  if (!trimmedCode) return null;

  const imageUrl = generateDeckUrls(trimmedCode).view;
  return {
    id: `${Date.now()}-${Math.random()}`,
    code: trimmedCode,
    playerName: trimmedPlayerName || undefined,
    deckName: trimmedDeckName || undefined,
    imageUrl,
    addedAt: new Date(),
  };
};

// デッキ一覧をタブ区切りテキストに変換（Excel貼り付け用）
export const generateDeckListTsv = (deckList: DeckData[]): string => {
  return deckList
    .map((deck) => `${deck.playerName || ""}\t${deck.code}\t${deck.deckName || ""}`)
    .join("\n");
};

// 結果メッセージの生成
export const generateResultMessage = (result: BulkProcessResult): string => {
  const { newDecks, errors } = result;
  let message = "";

  if (newDecks.length > 0) {
    message += `${newDecks.length}件を追加しました。`;
  }
  if (errors.length > 0) {
    message += ` ${errors.length}件でエラーが発生しました。`;
  }

  return message;
};
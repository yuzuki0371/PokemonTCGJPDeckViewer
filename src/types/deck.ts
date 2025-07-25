// デッキ関連の型定義

export interface DeckData {
  id: string;
  code: string;
  playerName?: string;
  imageUrl: string;
  addedAt: Date;
}

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
// エラーメッセージ定数

export const ERROR_MESSAGES = {
  // デッキ関連エラー
  DECK_FETCH_FAILED: 'デッキレシピの取得に失敗しました',
  DECK_CODE_REQUIRED: 'デッキコードを入力してください',
  DECK_CODE_INVALID: '無効なデッキコードです',

  // 一括処理エラー
  BULK_NO_DATA: '有効なデータが見つかりません',
  BULK_PROCESS_FAILED: '一括処理中にエラーが発生しました',
  BULK_NO_DECKS_ADDED: '追加できるデッキが見つかりませんでした',

  // ストレージエラー
  STORAGE_QUOTA_EXCEEDED:
    'ストレージ容量が不足しています。不要なデータを削除してください',
  STORAGE_SAVE_FAILED: 'データの保存に失敗しました',
  STORAGE_LOAD_FAILED: 'データの読み込みに失敗しました',
  STORAGE_PARSE_FAILED: '保存されたデータの形式が正しくありません',

  // ネットワークエラー
  NETWORK_CONNECTION_ERROR:
    'ネットワーク接続エラーです。インターネット接続を確認してください',
  NETWORK_TIMEOUT_ERROR:
    '接続がタイムアウトしました。しばらく時間をおいて再試行してください',

  // バリデーションエラー
  VALIDATION_EMPTY_INPUT: '入力内容が空です',
  VALIDATION_INVALID_FORMAT: '入力形式が正しくありません',
} as const

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  DECK_ADDED: 'デッキレシピを追加しました',
  DECKS_BULK_ADDED: 'デッキレシピを一括追加しました',
  ALL_DECKS_CLEARED: 'すべてのデッキをクリアしました',
} as const

// UI メッセージ
export const UI_MESSAGES = {
  LOADING_SINGLE: '追加中...',
  LOADING_BULK: '一括追加中...',
  PROCESSING: '処理中...',
} as const

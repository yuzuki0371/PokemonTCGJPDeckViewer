import { useCallback } from 'react'
import type { FormState, FormActions, AppActions } from '../types'

interface FormInputProps {
  // フォーム状態
  formState: FormState
  formActions: FormActions
  
  // UI状態
  loading: boolean
  error: string | null
  processingProgress: { current: number; total: number } | null
  
  // アプリケーション状態操作
  appActions: Pick<AppActions, 'setError'>
  
  // イベントハンドラー
  onSubmit: (e: React.FormEvent) => void
  onClearAll: () => void
  
  // 条件
  hasDecks: boolean
}

export const FormInput = ({
  formState,
  formActions,
  loading,
  error,
  processingProgress,
  appActions,
  onSubmit,
  onClearAll,
  hasDecks
}: FormInputProps) => {
  
  // モード切り替えハンドラー
  const handleSingleModeSwitch = useCallback(() => {
    formActions.setSingleMode();
    appActions.setError(null);
  }, [formActions, appActions]);

  const handleBulkModeSwitch = useCallback(() => {
    formActions.setBulkMode();
    appActions.setError(null);
  }, [formActions, appActions]);
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleSingleModeSwitch}
            className={`px-4 py-2 rounded-md transition-colors ${
              !formState.isBulkMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            単体入力
          </button>
          <button
            type="button"
            onClick={handleBulkModeSwitch}
            className={`px-4 py-2 rounded-md transition-colors ${
              formState.isBulkMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            一括入力
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {!formState.isBulkMode ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                プレイヤー名（任意）
              </label>
              <input
                type="text"
                id="playerName"
                value={formState.singleMode.playerName}
                onChange={(e) => formActions.updateSingleForm("playerName", e.target.value)}
                placeholder="プレイヤー名を入力してください"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="deckCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                デッキコード
              </label>
              <input
                type="text"
                id="deckCode"
                value={formState.singleMode.deckCode}
                onChange={(e) => formActions.updateSingleForm("deckCode", e.target.value)}
                placeholder="デッキコードを入力してください"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="bulkInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              プレイヤー名＆デッキコード（一括入力）
            </label>
            <textarea
              id="bulkInput"
              value={formState.bulkMode.input}
              onChange={(e) => formActions.updateBulkInput(e.target.value)}
              placeholder="Excelからコピー＆ペーストできます&#10;&#10;例（Excelのコピー）：&#10;田中太郎	ABC123&#10;佐藤花子	DEF456&#10;山田次郎	GHI789&#10;&#10;例（手入力）：&#10;田中太郎 ABC123&#10;佐藤花子,DEF456&#10;GHI789（プレイヤー名なし）"
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <p>
                ※
                Excelの「プレイヤー名」「デッキコード」の2列をコピー＆ペーストできます
              </p>
              <p>
                ※
                手入力の場合はスペース、カンマ、セミコロンで区切ってください
              </p>
              <p>※ デッキコードのみの入力も可能です</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {processingProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>処理中...</span>
              <span>
                {processingProgress.current} /{" "}
                {processingProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (processingProgress.current /
                      processingProgress.total) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? formState.isBulkMode
                ? "一括追加中..."
                : "追加中..."
              : formState.isBulkMode
              ? "デッキレシピを一括追加"
              : "デッキレシピを追加"}
          </button>
          
          {hasDecks && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              すべてクリア
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
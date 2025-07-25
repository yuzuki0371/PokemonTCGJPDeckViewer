import { useState } from 'react'
import { generateDeckUrls } from '../constants'
import type { ModalState, ModalActions } from '../types'

interface ImageModalProps {
  // モーダル状態
  modalState: ModalState
  modalActions: ModalActions
  
  // ナビゲーション制御
  hasMultipleDecks: boolean
  totalDecks: number
  
  // イベントハンドラー
  onBackdropClick: (e: React.MouseEvent) => void
}

export const ImageModal = ({
  modalState,
  modalActions,
  hasMultipleDecks,
  totalDecks,
  onBackdropClick
}: ImageModalProps) => {
  const [imageError, setImageError] = useState(false)

  if (!modalState.enlargedImage) {
    return null
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handlePrevClick = () => {
    modalActions.navigateModal('prev')
    setImageError(false) // 画像切り替え時にエラー状態をリセット
  }

  const handleNextClick = () => {
    modalActions.navigateModal('next')
    setImageError(false) // 画像切り替え時にエラー状態をリセット
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        {/* 閉じるボタン */}
        <button
          onClick={modalActions.closeModal}
          className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
          title="閉じる (ESC)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 前の画像ボタン */}
        {hasMultipleDecks && (
          <button
            onClick={handlePrevClick}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            title="前の画像 (↑ / ←)"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* 次の画像ボタン */}
        {hasMultipleDecks && (
          <button
            onClick={handleNextClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            title="次の画像 (↓ / →)"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* 画像表示 */}
        {!imageError ? (
          <img
            src={modalState.enlargedImage.url}
            alt={`デッキコード: ${modalState.enlargedImage.deckCode}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onError={handleImageError}
          />
        ) : (
          <div
            className="p-8 bg-gray-200 text-center text-gray-600 rounded-lg"
            style={{ minHeight: '300px' }}
          >
            <div className="flex items-center justify-center h-full">
              <div>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">画像を読み込めませんでした</p>
              </div>
            </div>
          </div>
        )}

        {/* 情報表示エリア */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
          <div className="text-center">
            {/* 現在位置表示 */}
            {hasMultipleDecks && (
              <div className="text-xs text-gray-300 mb-2">
                {modalState.enlargedImage.index + 1} / {totalDecks}
              </div>
            )}

            {/* プレイヤー名 */}
            {modalState.enlargedImage.playerName && (
              <div className="text-lg font-semibold mb-1">
                {modalState.enlargedImage.playerName}
              </div>
            )}

            {/* デッキコード */}
            <div className="text-sm">
              デッキコード:{' '}
              <a
                href={generateDeckUrls(modalState.enlargedImage.deckCode).confirm}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-300 hover:text-blue-100 hover:underline"
              >
                {modalState.enlargedImage.deckCode}
              </a>
            </div>

            {/* キーボードショートカット表示 */}
            {hasMultipleDecks && (
              <div className="text-xs text-gray-400 mt-2">
                ↑↓ または ←→ で画像切替、ESC で閉じる
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
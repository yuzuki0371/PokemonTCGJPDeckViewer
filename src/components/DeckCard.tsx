import { useState, memo, useCallback } from 'react'
import type { DeckData, ModalActions, ViewMode, CardSize } from '../types'
import { generateDeckUrls } from '../constants'

interface DeckCardProps {
  deck: DeckData
  deckList: DeckData[]
  modalActions: ModalActions
  onRemove: (id: string) => void
  viewMode: ViewMode
  cardSize: CardSize
}

const DeckCardComponent = ({ deck, deckList, modalActions, onRemove, viewMode }: DeckCardProps) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleImageClick = useCallback(() => {
    const index = deckList.findIndex((d) => d.id === deck.id);
    modalActions.openModal(deck, index);
  }, [deck, deckList, modalActions])

  const handleRemoveClick = useCallback(() => {
    onRemove(deck.id)
  }, [deck.id, onRemove])

  // 画像表示部分（共通）
  const renderImage = (className: string) => {
    if (!imageError) {
      return (
        <img
          src={deck.imageUrl}
          alt={`デッキコード: ${deck.code}`}
          className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
          onClick={handleImageClick}
          onError={handleImageError}
        />
      )
    }
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
        style={{ minHeight: viewMode === 'list' ? '100%' : '150px' }}
        onClick={handleImageClick}
      >
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-8 w-8 text-gray-400 mb-2"
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
          <p className="text-xs">読み込み失敗</p>
        </div>
      </div>
    )
  }

  // 削除ボタン（共通）
  const renderDeleteButton = (positionClass: string) => (
    <button
      onClick={handleRemoveClick}
      className={`${positionClass} bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md`}
      title="削除"
    >
      <svg
        className="w-3 h-3"
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
  )

  // リスト表示
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-row overflow-hidden">
        {/* 左: サムネイル画像 */}
        <div className="relative w-48 flex-shrink-0">
          {renderImage('w-full h-full object-cover')}
        </div>

        {/* 右: 情報表示エリア */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="flex-1">
            {deck.playerName && (
              <div
                className="text-base font-semibold text-gray-800 mb-2 truncate"
                title={deck.playerName}
              >
                {deck.playerName}
              </div>
            )}
            <div className="text-sm text-gray-600 mb-1">
              <span className="truncate" title={deck.code}>
                コード:{' '}
                <a
                  href={generateDeckUrls(deck.code).confirm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  {deck.code}
                </a>
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {deck.addedAt.toLocaleDateString('ja-JP')}
            </div>
          </div>

          {/* 削除ボタン */}
          <div className="flex justify-end mt-2">
            {renderDeleteButton('')}
          </div>
        </div>
      </div>
    )
  }

  // グリッド表示（既存レイアウト）
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        {renderImage('w-full h-auto')}
        {renderDeleteButton('absolute top-1 right-1')}
      </div>

      <div className="p-3">
        {deck.playerName && (
          <div
            className="text-sm font-semibold text-gray-800 mb-1 truncate"
            title={deck.playerName}
          >
            {deck.playerName}
          </div>
        )}
        <div className="text-xs text-gray-600 mb-1">
          <p className="truncate" title={deck.code}>
            コード:{' '}
            <a
              href={generateDeckUrls(deck.code).confirm}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {deck.code}
            </a>
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {deck.addedAt.toLocaleDateString('ja-JP')}
        </div>
      </div>
    </div>
  )
}

// React.memo で最適化し、propsの変更時のみ再レンダリング
export const DeckCard = memo(DeckCardComponent, (prevProps, nextProps) => {
  // deck の内容が同じ場合は再レンダリングを防ぐ
  return (
    prevProps.deck.id === nextProps.deck.id &&
    prevProps.deck.code === nextProps.deck.code &&
    prevProps.deck.playerName === nextProps.deck.playerName &&
    prevProps.deck.imageUrl === nextProps.deck.imageUrl &&
    prevProps.deck.addedAt.getTime() === nextProps.deck.addedAt.getTime() &&
    prevProps.modalActions === nextProps.modalActions &&
    prevProps.onRemove === nextProps.onRemove &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.cardSize === nextProps.cardSize
  );
});

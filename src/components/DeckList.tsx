import { useState, useCallback } from 'react'
import type { DeckData, ModalActions, ViewSettings, ViewSettingsActions, AppActions } from '../types'
import { DeckCard } from './DeckCard'
import { ViewToggle } from './ViewToggle'
import { GRID_SIZE_CLASSES, LIST_LAYOUT_CLASS } from '../constants'
import { generateDeckListTsv } from '../utils/deckUtils'

interface DeckListProps {
  deckList: DeckData[]
  modalActions: ModalActions
  onUpdateDeck: AppActions['updateDeck']
  onRemove: (id: string) => void
  viewSettings: ViewSettings
  viewSettingsActions: ViewSettingsActions
}

export const DeckList = ({
  deckList,
  modalActions,
  onUpdateDeck,
  onRemove,
  viewSettings,
  viewSettingsActions
}: DeckListProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const tsv = generateDeckListTsv(deckList)
    await navigator.clipboard.writeText(tsv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [deckList])

  if (deckList.length === 0) {
    return null
  }

  // レイアウトクラスの決定
  const layoutClasses = viewSettings.viewMode === 'grid'
    ? `grid gap-4 ${GRID_SIZE_CLASSES[viewSettings.cardSize]}`
    : LIST_LAYOUT_CLASS

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            デッキレシピ一覧 ({deckList.length}件)
          </h2>
          <button
            onClick={handleCopy}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            title="プレイヤー名・デッキコード・デッキ名をタブ区切りでコピー（Excel貼り付け用）"
          >
            {copied ? 'コピー済み' : '一覧をコピー'}
          </button>
        </div>
        <ViewToggle settings={viewSettings} actions={viewSettingsActions} />
      </div>

      <div className={layoutClasses}>
        {deckList.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            deckList={deckList}
            modalActions={modalActions}
            onUpdateDeck={onUpdateDeck}
            onRemove={onRemove}
            viewMode={viewSettings.viewMode}
            cardSize={viewSettings.cardSize}
          />
        ))}
      </div>
    </div>
  )
}

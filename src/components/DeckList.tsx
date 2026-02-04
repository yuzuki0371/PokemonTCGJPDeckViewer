import type { DeckData, ModalActions, ViewSettings, ViewSettingsActions } from '../types'
import { DeckCard } from './DeckCard'
import { ViewToggle } from './ViewToggle'
import { GRID_SIZE_CLASSES, LIST_LAYOUT_CLASS } from '../constants'

interface DeckListProps {
  deckList: DeckData[]
  modalActions: ModalActions
  onRemove: (id: string) => void
  viewSettings: ViewSettings
  viewSettingsActions: ViewSettingsActions
}

export const DeckList = ({
  deckList,
  modalActions,
  onRemove,
  viewSettings,
  viewSettingsActions
}: DeckListProps) => {
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
        <h2 className="text-2xl font-semibold text-gray-800">
          デッキレシピ一覧 ({deckList.length}件)
        </h2>
        <ViewToggle settings={viewSettings} actions={viewSettingsActions} />
      </div>

      <div className={layoutClasses}>
        {deckList.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            deckList={deckList}
            modalActions={modalActions}
            onRemove={onRemove}
            viewMode={viewSettings.viewMode}
            cardSize={viewSettings.cardSize}
          />
        ))}
      </div>
    </div>
  )
}

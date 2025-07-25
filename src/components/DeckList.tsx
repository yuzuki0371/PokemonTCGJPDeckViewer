import type { DeckData, ModalActions } from '../types'
import { DeckCard } from './DeckCard'
import { GRID_CLASSES } from '../constants'

interface DeckListProps {
  deckList: DeckData[]
  modalActions: ModalActions
  onRemove: (id: string) => void
}

export const DeckList = ({ deckList, modalActions, onRemove }: DeckListProps) => {
  if (deckList.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          デッキレシピ一覧 ({deckList.length}件)
        </h2>
      </div>

      <div className={`grid gap-4 ${GRID_CLASSES}`}>
        {deckList.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            deckList={deckList}
            modalActions={modalActions}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}
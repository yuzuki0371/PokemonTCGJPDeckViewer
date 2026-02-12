import { useState, useCallback } from "react";
import type {
  DeckData,
  ModalActions,
  ViewSettings,
  ViewSettingsActions,
  AppActions,
  FilterState,
  FilterActions,
} from "../types";
import { DeckCard } from "./DeckCard";
import { ViewToggle } from "./ViewToggle";
import { GRID_SIZE_CLASSES, LIST_LAYOUT_CLASS } from "../constants";
import { UI_MESSAGES } from "../constants/messages";
import { generateDeckListTsv } from "../utils/deckUtils";

interface DeckListProps {
  deckList: DeckData[];
  totalDeckCount: number;
  filterState: FilterState;
  filterActions: FilterActions;
  modalActions: ModalActions;
  onUpdateDeck: AppActions["updateDeck"];
  onRemove: (id: string) => void;
  viewSettings: ViewSettings;
  viewSettingsActions: ViewSettingsActions;
}

export const DeckList = ({
  deckList,
  totalDeckCount,
  filterState,
  filterActions,
  modalActions,
  onUpdateDeck,
  onRemove,
  viewSettings,
  viewSettingsActions,
}: DeckListProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const tsv = generateDeckListTsv(deckList);
    await navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [deckList]);

  if (totalDeckCount === 0) {
    return null;
  }

  const isFiltering = filterState.filterText.trim() !== "";
  const countLabel = isFiltering ? `(${deckList.length}/${totalDeckCount}件)` : `(${totalDeckCount}件)`;

  // レイアウトクラスの決定
  const layoutClasses =
    viewSettings.viewMode === "grid" ? `grid gap-4 ${GRID_SIZE_CLASSES[viewSettings.cardSize]}` : LIST_LAYOUT_CLASS;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">デッキレシピ一覧 {countLabel}</h2>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              copied
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
            }`}
            title="プレイヤー名・デッキコード・デッキ名をタブ区切りでコピー（Excel貼り付け用）"
          >
            {copied ? "コピー済み" : "一覧をコピー"}
          </button>
          <ViewToggle settings={viewSettings} actions={viewSettingsActions} />
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={filterState.filterText}
          onChange={e => filterActions.setFilterText(e.target.value)}
          placeholder={UI_MESSAGES.FILTER_PLACEHOLDER}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {isFiltering && (
          <button
            onClick={filterActions.clearFilter}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            title="フィルターをクリア"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {deckList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{UI_MESSAGES.FILTER_NO_RESULTS}</div>
      ) : (
        <div className={layoutClasses}>
          {deckList.map(deck => (
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
      )}
    </div>
  );
};

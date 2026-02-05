import { useEffect, useCallback } from "react";
import { useFormState } from "./hooks/useFormState";
import { useAppState } from "./hooks/useAppState";
import { useModalState } from "./hooks/useModalState";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDeckManager } from "./hooks/useDeckManager";
import { useViewSettings } from "./hooks/useViewSettings";
import { FormInput } from "./components/FormInput";
import { ImageModal } from "./components/ImageModal";
import { DeckList } from "./components/DeckList";
import { DeckNameSummary } from "./components/DeckNameSummary";
import { EmptyState } from "./components/EmptyState";
import { Footer } from "./components/Footer";
import type { TabMode } from "./types";

function App() {
  const [formState, formActions] = useFormState();
  const [appState, appActions] = useAppState();
  const [modalState, modalActions] = useModalState(appState.deckList);
  const [viewSettings, viewSettingsActions] = useViewSettings();
  const { loadDeckList, saveDeckList } = useLocalStorage();
  const { handleSubmit, handleUpdateDeck, handleRemoveDeck, handleClearAll } = useDeckManager(
    appState,
    appActions,
    formState,
    formActions,
    saveDeckList
  );

  // コールバックをuseCallbackでラップして最適化
  const memoizedHandleUpdateDeck = useCallback(handleUpdateDeck, [handleUpdateDeck]);
  const memoizedHandleRemoveDeck = useCallback(handleRemoveDeck, [handleRemoveDeck]);
  const memoizedHandleClearAll = useCallback(handleClearAll, [handleClearAll]);

  // 初期化時にlocalStorageからデータを読み込む
  useEffect(() => {
    const { data, error } = loadDeckList();
    appActions.setDeckList(data);
    if (error) {
      appActions.setError(error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 max-w-7xl py-8 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ポケモンカード デッキビューアー
          </h1>
          <p className="text-gray-600">
            デッキコードを入力してデッキレシピの画像を表示します
          </p>
        </div>

        <FormInput
          formState={formState}
          formActions={formActions}
          loading={appState.ui.loading}
          error={appState.ui.error}
          processingProgress={appState.ui.processingProgress}
          appActions={appActions}
          onSubmit={handleSubmit}
          onClearAll={memoizedHandleClearAll}
          hasDecks={appState.deckList.length > 0}
        />

        {appState.deckList.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 border-b border-gray-200">
              {([
                { key: 'deckList' as TabMode, label: 'デッキ一覧' },
                { key: 'summary' as TabMode, label: 'デッキ集計' },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => viewSettingsActions.setActiveTab(key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    viewSettings.activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {viewSettings.activeTab === 'deckList' && (
          <DeckList
            deckList={appState.deckList}
            modalActions={modalActions}
            onUpdateDeck={memoizedHandleUpdateDeck}
            onRemove={memoizedHandleRemoveDeck}
            viewSettings={viewSettings}
            viewSettingsActions={viewSettingsActions}
          />
        )}

        {viewSettings.activeTab === 'summary' && appState.deckList.length > 0 && (
          <DeckNameSummary deckList={appState.deckList} />
        )}

        {appState.deckList.length === 0 && <EmptyState />}

        <ImageModal
          modalState={modalState}
          modalActions={modalActions}
          onUpdateDeck={memoizedHandleUpdateDeck}
          hasMultipleDecks={appState.deckList.length > 1}
          totalDecks={appState.deckList.length}
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;

import { useEffect } from "react";
import { useFormState } from "./hooks/useFormState";
import { useAppState, type DeckData } from "./hooks/useAppState";
import { useModalState } from "./hooks/useModalState";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DeckCard } from "./components/DeckCard";
import { FormInput } from "./components/FormInput";
import { ImageModal } from "./components/ImageModal";

function App() {
  const [formState, formActions] = useFormState();
  const [appState, appActions] = useAppState();
  const [modalState, modalActions] = useModalState(appState.deckList);
  const { loadDeckList, saveDeckList } = useLocalStorage();

  // 初期化時にlocalStorageからデータを読み込む
  useEffect(() => {
    const savedDecks = loadDeckList();
    appActions.setDeckList(savedDecks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSingleDeck = (
    code: string,
    playerName?: string
  ): DeckData | null => {
    const trimmedCode = code.trim();
    const trimmedPlayerName = playerName?.trim();

    if (!trimmedCode) return null;

    // 重複チェック
    if (appState.deckList.some((deck) => deck.code === trimmedCode)) {
      return null;
    }

    const imageUrl = `https://www.pokemon-card.com/deck/deckView.php/deckID/${trimmedCode}`;
    return {
      id: `${Date.now()}-${Math.random()}`,
      code: trimmedCode,
      playerName: trimmedPlayerName || undefined,
      imageUrl,
      addedAt: new Date(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.isBulkMode) {
      if (!formState.bulkMode.input.trim()) {
        appActions.setError("デッキコードを入力してください");
        return;
      }

      await handleBulkSubmit();
    } else {
      if (!formState.singleMode.deckCode.trim()) {
        appActions.setError("デッキコードを入力してください");
        return;
      }

      await handleSingleSubmit();
    }
  };

  const handleSingleSubmit = async () => {
    const trimmedCode = formState.singleMode.deckCode.trim();

    // 重複チェック
    if (appState.deckList.some((deck) => deck.code === trimmedCode)) {
      appActions.setError("このデッキコードは既に追加されています");
      return;
    }

    appActions.setLoading(true);
    appActions.setError(null);

    try {
      const newDeck = addSingleDeck(
        trimmedCode,
        formState.singleMode.playerName
      );
      if (newDeck) {
        const updatedList = [newDeck, ...appState.deckList];
        appActions.setDeckList(updatedList);
        saveDeckList(updatedList);
        formActions.resetSingleForm();
      }
    } catch {
      appActions.setError("デッキレシピの取得に失敗しました");
    } finally {
      appActions.setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    const lines = formState.bulkMode.input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      appActions.setError("有効なデータが見つかりません");
      return;
    }

    appActions.setLoading(true);
    appActions.setError(null);
    appActions.setProgress({ current: 0, total: lines.length });

    const newDecks: DeckData[] = [];
    const duplicates: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        appActions.setProgress({ current: i + 1, total: lines.length });

        let playerName: string | undefined;
        let code: string;

        // タブ区切りかどうかチェック（Excelからのコピー）
        if (line.includes("\t")) {
          const parts = line.split("\t");
          playerName = parts[0]?.trim();
          code = parts[1]?.trim() || "";
        } else {
          // 他の区切り文字で分割を試す
          const parts = line.split(/[,;\s]+/);
          if (parts.length >= 2) {
            playerName = parts[0]?.trim();
            code = parts[1]?.trim() || "";
          } else {
            // 単一のデッキコードとして処理
            code = parts[0]?.trim() || "";
          }
        }

        if (!code) {
          errors.push(`行 ${i + 1}: デッキコードが見つかりません`);
          continue;
        }

        // 既存のリストまたは今回追加予定のリストに重複がないかチェック
        const isDuplicate =
          appState.deckList.some((deck) => deck.code === code) ||
          newDecks.some((deck) => deck.code === code);

        if (isDuplicate) {
          duplicates.push(code);
          continue;
        }

        const newDeck = addSingleDeck(code, playerName);
        if (newDeck) {
          newDecks.push(newDeck);
        }

        // 処理間隔を設ける（UI更新のため）
        if (i < lines.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (newDecks.length > 0) {
        const updatedList = [...newDecks, ...appState.deckList];
        appActions.setDeckList(updatedList);
        saveDeckList(updatedList);
      }

      let message = "";
      if (newDecks.length > 0) {
        message += `${newDecks.length}件を追加しました。`;
      }
      if (duplicates.length > 0) {
        message += ` ${duplicates.length}件のデッキコードは既に追加済みのためスキップしました。`;
      }
      if (errors.length > 0) {
        message += ` ${errors.length}件でエラーが発生しました。`;
      }

      if (
        newDecks.length === 0 &&
        (duplicates.length > 0 || errors.length > 0)
      ) {
        appActions.setError(
          message || "追加できるデッキが見つかりませんでした"
        );
      } else if (duplicates.length > 0 || errors.length > 0) {
        appActions.setError(message);
      } else {
        formActions.resetBulkForm();
      }
    } catch {
      appActions.setError("一括処理中にエラーが発生しました");
    } finally {
      appActions.setLoading(false);
      appActions.setProgress(null);
    }
  };

  const handleRemoveDeck = (id: string) => {
    appActions.removeDeck(id);
    saveDeckList(appState.deckList.filter((deck) => deck.id !== id));
  };

  const handleClearAll = () => {
    appActions.clearAll();
    saveDeckList([]);
    formActions.resetForm();
    appActions.setError(null);
  };

  const handleSingleModeSwitch = () => {
    formActions.setSingleMode();
    appActions.setError(null);
  };

  const handleBulkModeSwitch = () => {
    formActions.setBulkMode();
    appActions.setError(null);
  };

  const handleImageClick = (deck: DeckData) => {
    const index = appState.deckList.findIndex((d) => d.id === deck.id);
    modalActions.openModal(deck, index);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modalActions.closeModal();
    }
  };

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
          onSubmit={handleSubmit}
          onSingleModeSwitch={handleSingleModeSwitch}
          onBulkModeSwitch={handleBulkModeSwitch}
          onClearAll={handleClearAll}
          hasDecks={appState.deckList.length > 0}
        />

        {appState.deckList.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                デッキレシピ一覧 ({appState.deckList.length}件)
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {appState.deckList.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onImageClick={handleImageClick}
                  onRemove={handleRemoveDeck}
                />
              ))}
            </div>
          </div>
        )}

        {appState.deckList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              デッキコードを入力してデッキレシピを追加してください
            </p>
          </div>
        )}

        <ImageModal
          modalState={modalState}
          modalActions={modalActions}
          hasMultipleDecks={appState.deckList.length > 1}
          totalDecks={appState.deckList.length}
          onBackdropClick={handleModalBackdropClick}
        />
      </div>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <div className="text-left">
            <p className="text-sm text-gray-600">
              © 2025 yuzuki0371. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              本ウェブサイトに掲載されているポケモントカードゲームに関する画像情報の著作権は、（株）クリーチャーズ、（株）ポケモンに帰属します。
              <br />
              本ウェブサイトは、（株）クリーチャーズ、（株）ポケモンによって制作、推奨、支援、または関連付けられたものではありません。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

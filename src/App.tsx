import { useEffect } from "react";
import { useFormState } from "./hooks/useFormState";
import { useAppState, type DeckData } from "./hooks/useAppState";
import { useModalState } from "./hooks/useModalState";

function App() {
  const [formState, formActions] = useFormState();
  const [appState, appActions] = useAppState();
  const [modalState, modalActions] = useModalState(appState.deckList);

  // localStorage保存用のキー
  const STORAGE_KEY = "pokemonTcgDeckList";

  // localStorageからデータを読み込む
  const loadFromStorage = (): DeckData[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(
          (deck: {
            id: string;
            code: string;
            playerName?: string;
            imageUrl: string;
            addedAt: string;
          }) => ({
            ...deck,
            addedAt: new Date(deck.addedAt),
          })
        );
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return [];
  };

  // localStorageにデータを保存する
  const saveToStorage = (decks: DeckData[]) => {
    try {
      const serialized = decks.map((deck) => ({
        ...deck,
        addedAt: deck.addedAt.toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  // 初期化時にlocalStorageからデータを読み込む
  useEffect(() => {
    const savedDecks = loadFromStorage();
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
        saveToStorage(updatedList);
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
        saveToStorage(updatedList);
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
    saveToStorage(appState.deckList.filter((deck) => deck.id !== id));
  };

  const handleClearAll = () => {
    appActions.clearAll();
    saveToStorage([]);
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={(e) =>
                      formActions.updateSingleForm("playerName", e.target.value)
                    }
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
                    onChange={(e) =>
                      formActions.updateSingleForm("deckCode", e.target.value)
                    }
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

            {appState.ui.error && (
              <div className="text-red-600 text-sm">{appState.ui.error}</div>
            )}

            {appState.ui.processingProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>処理中...</span>
                  <span>
                    {appState.ui.processingProgress.current} /{" "}
                    {appState.ui.processingProgress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (appState.ui.processingProgress.current /
                          appState.ui.processingProgress.total) *
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
                disabled={appState.ui.loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {appState.ui.loading
                  ? formState.isBulkMode
                    ? "一括追加中..."
                    : "追加中..."
                  : formState.isBulkMode
                  ? "デッキレシピを一括追加"
                  : "デッキレシピを追加"}
              </button>

              {appState.deckList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                >
                  すべてクリア
                </button>
              )}
            </div>
          </form>
        </div>

        {appState.deckList.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                デッキレシピ一覧 ({appState.deckList.length}件)
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {appState.deckList.map((deck) => (
                <div
                  key={deck.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={deck.imageUrl}
                      alt={`デッキコード: ${deck.code}`}
                      className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(deck)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const errorDiv =
                          target.nextElementSibling as HTMLElement;
                        if (errorDiv) errorDiv.style.display = "block";
                      }}
                    />
                    <div
                      className="hidden p-4 bg-gray-100 text-center text-gray-500"
                      style={{ minHeight: "150px" }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div>
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
                          <p className="text-sm">画像を読み込めませんでした</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDeck(deck.id)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md"
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
                        コード:{" "}
                        <a
                          href={`https://www.pokemon-card.com/deck/confirm.html/deckID/${deck.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          {deck.code}
                        </a>
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {deck.addedAt.toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                </div>
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

        {/* 画像拡大モーダル */}
        {modalState.enlargedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleModalBackdropClick}
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
              {appState.deckList.length > 1 && (
                <button
                  onClick={() => modalActions.navigateModal("prev")}
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
              {appState.deckList.length > 1 && (
                <button
                  onClick={() => modalActions.navigateModal("next")}
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

              <img
                src={modalState.enlargedImage.url}
                alt={`デッキコード: ${modalState.enlargedImage.deckCode}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  if (errorDiv) errorDiv.style.display = "block";
                }}
              />

              <div
                className="hidden p-8 bg-gray-200 text-center text-gray-600 rounded-lg"
                style={{ minHeight: "300px" }}
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

              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <div className="text-center">
                  {/* 現在位置表示 */}
                  {appState.deckList.length > 1 && (
                    <div className="text-xs text-gray-300 mb-2">
                      {modalState.enlargedImage.index + 1} /{" "}
                      {appState.deckList.length}
                    </div>
                  )}

                  {modalState.enlargedImage.playerName && (
                    <div className="text-lg font-semibold mb-1">
                      {modalState.enlargedImage.playerName}
                    </div>
                  )}
                  <div className="text-sm">
                    デッキコード:{" "}
                    <a
                      href={`https://www.pokemon-card.com/deck/confirm.html/deckID/${modalState.enlargedImage.deckCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-300 hover:text-blue-100 hover:underline"
                    >
                      {modalState.enlargedImage.deckCode}
                    </a>
                  </div>

                  {/* キーボードショートカット表示 */}
                  {appState.deckList.length > 1 && (
                    <div className="text-xs text-gray-400 mt-2">
                      ↑↓ または ←→ で画像切替、ESC で閉じる
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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

import { useState, useRef, useEffect, memo, useCallback } from "react";
import type { DeckData, ModalActions, ViewMode, CardSize, AppActions } from "../types";
import { generateDeckUrls } from "../constants";
import { EditableField } from "./EditableField";
import { DeckImage } from "./DeckImage";
import { DeleteButton } from "./DeleteButton";

interface DeckCardProps {
  deck: DeckData;
  deckList: DeckData[];
  modalActions: ModalActions;
  onUpdateDeck: AppActions["updateDeck"];
  onRemove: (id: string) => void;
  viewMode: ViewMode;
  cardSize: CardSize;
}

type EditableFieldName = "playerName" | "deckName";

const DeckCardComponent = ({ deck, deckList, modalActions, onUpdateDeck, onRemove, viewMode }: DeckCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [editingField, setEditingField] = useState<EditableFieldName | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageClick = useCallback(() => {
    const index = deckList.findIndex(d => d.id === deck.id);
    modalActions.openModal(deck, index);
  }, [deck, deckList, modalActions]);

  const handleRemoveClick = useCallback(() => {
    onRemove(deck.id);
  }, [deck.id, onRemove]);

  const startEditing = useCallback(
    (field: EditableFieldName) => {
      setEditingField(field);
      setEditValue(deck[field] || "");
    },
    [deck]
  );

  const saveEdit = useCallback(() => {
    if (editingField) {
      const trimmed = editValue.trim();
      onUpdateDeck(deck.id, { [editingField]: trimmed || undefined });
      setEditingField(null);
    }
  }, [editingField, editValue, deck.id, onUpdateDeck]);

  const cancelEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit]
  );

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-row overflow-hidden">
        {/* 左: サムネイル画像 */}
        <div className="relative w-48 shrink-0">
          <DeckImage
            imageUrl={deck.imageUrl}
            deckCode={deck.code}
            className="w-full h-full object-cover"
            viewMode={viewMode}
            imageError={imageError}
            onError={handleImageError}
            onClick={handleImageClick}
          />
        </div>

        {/* 右: 情報表示エリア */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="flex-1">
            <EditableField
              value={deck.playerName}
              placeholder="プレイヤー名を追加"
              textClass="text-base font-semibold text-gray-800"
              containerClass="mb-1"
              isEditing={editingField === "playerName"}
              editValue={editValue}
              inputRef={inputRef}
              onStartEditing={() => startEditing("playerName")}
              onChange={setEditValue}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
            />
            <EditableField
              value={deck.deckName}
              placeholder="デッキ名を追加"
              textClass="text-sm text-gray-700"
              containerClass="mb-2"
              isEditing={editingField === "deckName"}
              editValue={editValue}
              inputRef={inputRef}
              onStartEditing={() => startEditing("deckName")}
              onChange={setEditValue}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
            />
            <div className="text-sm text-gray-600 mb-1">
              <span className="truncate" title={deck.code}>
                コード:{" "}
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
            <div className="text-sm text-gray-400">{deck.addedAt.toLocaleDateString("ja-JP")}</div>
          </div>

          {/* 削除ボタン */}
          <div className="flex justify-end mt-2">
            <DeleteButton positionClass="" onClick={handleRemoveClick} />
          </div>
        </div>
      </div>
    );
  }

  // グリッド表示（既存レイアウト）
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <DeckImage
          imageUrl={deck.imageUrl}
          deckCode={deck.code}
          className="w-full h-auto"
          viewMode={viewMode}
          imageError={imageError}
          onError={handleImageError}
          onClick={handleImageClick}
        />
        <DeleteButton positionClass="absolute top-1 right-1" onClick={handleRemoveClick} />
      </div>

      <div className="p-3">
        <EditableField
          value={deck.playerName}
          placeholder="プレイヤー名を追加"
          textClass="text-sm font-semibold text-gray-800"
          containerClass="mb-1"
          isEditing={editingField === "playerName"}
          editValue={editValue}
          inputRef={inputRef}
          onStartEditing={() => startEditing("playerName")}
          onChange={setEditValue}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
        />
        <EditableField
          value={deck.deckName}
          placeholder="デッキ名を追加"
          textClass="text-xs text-gray-700"
          containerClass="mb-1"
          isEditing={editingField === "deckName"}
          editValue={editValue}
          inputRef={inputRef}
          onStartEditing={() => startEditing("deckName")}
          onChange={setEditValue}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
        />
        <div className="text-xs text-gray-600 mb-1">
          <p className="truncate" title={deck.code}>
            コード:{" "}
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
        <div className="text-xs text-gray-400">{deck.addedAt.toLocaleDateString("ja-JP")}</div>
      </div>
    </div>
  );
};

// React.memo で最適化し、propsの変更時のみ再レンダリング
export const DeckCard = memo(DeckCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.deck.id === nextProps.deck.id &&
    prevProps.deck.code === nextProps.deck.code &&
    prevProps.deck.playerName === nextProps.deck.playerName &&
    prevProps.deck.deckName === nextProps.deck.deckName &&
    prevProps.deck.imageUrl === nextProps.deck.imageUrl &&
    prevProps.deck.addedAt.getTime() === nextProps.deck.addedAt.getTime() &&
    prevProps.deckList === nextProps.deckList &&
    prevProps.modalActions === nextProps.modalActions &&
    prevProps.onUpdateDeck === nextProps.onUpdateDeck &&
    prevProps.onRemove === nextProps.onRemove &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.cardSize === nextProps.cardSize
  );
});

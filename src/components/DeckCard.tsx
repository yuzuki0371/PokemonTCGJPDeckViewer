import { useState, useRef, useEffect, memo, useCallback } from "react";
import type { DeckData, ModalActions, ViewMode, CardSize, AppActions } from "../types";
import { generateDeckUrls } from "../constants";

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

// --- Sub-components ---

interface EditableFieldProps {
  value: string | undefined;
  placeholder: string;
  textClass: string;
  containerClass: string;
  isEditing: boolean;
  editValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onStartEditing: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const EditableField = ({
  value,
  placeholder,
  textClass,
  containerClass,
  isEditing,
  editValue,
  inputRef,
  onStartEditing,
  onChange,
  onBlur,
  onKeyDown,
}: EditableFieldProps) => {
  const handleKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onStartEditing();
    }
  };

  if (isEditing) {
    return (
      <div className={containerClass}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`${textClass} w-full bg-blue-50 border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>
    );
  }

  if (value) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`${containerClass} cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors`}
        onClick={onStartEditing}
        onKeyDown={handleKeyActivate}
        title="クリックして編集"
      >
        <div className={`${textClass} truncate`} title={value}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${containerClass} cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors`}
      onClick={onStartEditing}
      onKeyDown={handleKeyActivate}
    >
      <div className={`${textClass} text-gray-300 italic`}>{placeholder}</div>
    </div>
  );
};

interface DeckImageProps {
  imageUrl: string;
  deckCode: string;
  className: string;
  viewMode: ViewMode;
  imageError: boolean;
  onError: () => void;
  onClick: () => void;
}

const DeckImage = ({ imageUrl, deckCode, className, viewMode, imageError, onError, onClick }: DeckImageProps) => {
  const handleKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  if (!imageError) {
    return (
      <img
        src={imageUrl}
        alt={`デッキコード: ${deckCode}`}
        className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={onClick}
        onKeyDown={handleKeyActivate}
        onError={onError}
        tabIndex={0}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`${className} bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
      style={{ minHeight: viewMode === "list" ? "100%" : "150px" }}
      onClick={onClick}
      onKeyDown={handleKeyActivate}
    >
      <div className="text-center text-gray-500">
        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  );
};

interface DeleteButtonProps {
  positionClass: string;
  onClick: () => void;
}

const DeleteButton = ({ positionClass, onClick }: DeleteButtonProps) => (
  <button
    onClick={onClick}
    className={`${positionClass} bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md`}
    title="削除"
  >
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

// --- Main component ---

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
        <div className="relative w-48 flex-shrink-0">
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
  // deck の内容が同じ場合は再レンダリングを防ぐ
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

import type { ViewMode } from "../types";

export interface DeckImageProps {
  imageUrl: string;
  deckCode: string;
  className: string;
  viewMode: ViewMode;
  imageError: boolean;
  onError: () => void;
  onClick: () => void;
}

export const DeckImage = ({
  imageUrl,
  deckCode,
  className,
  viewMode,
  imageError,
  onError,
  onClick,
}: DeckImageProps) => {
  if (!imageError) {
    return (
      <button
        type="button"
        className={`${className} block cursor-pointer p-0 bg-transparent border-0`}
        onClick={onClick}
        aria-label="デッキ画像を拡大表示"
      >
        <img
          src={imageUrl}
          alt={`デッキコード: ${deckCode}`}
          className="w-full hover:opacity-90 transition-opacity"
          onError={onError}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${className} bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
      style={{ minHeight: viewMode === "list" ? "100%" : "150px" }}
      onClick={onClick}
      aria-label="デッキ画像を拡大表示（読み込み失敗）"
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
    </button>
  );
};

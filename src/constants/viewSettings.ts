import type { ViewSettings } from '../types/viewSettings';

// サイズ別グリッドクラス
export const GRID_SIZE_CLASSES = {
  small: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7',
  medium: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  large: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
} as const;

// リスト表示クラス
export const LIST_LAYOUT_CLASS = 'flex flex-col gap-3';

// localStorage キー
export const VIEW_SETTINGS_STORAGE_KEY = 'pokemonTcgViewSettings';

// デフォルト設定
export const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  viewMode: 'grid',
  cardSize: 'medium'
};

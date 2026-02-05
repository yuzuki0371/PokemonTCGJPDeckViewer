// 表示モード
export type ViewMode = 'grid' | 'list';

// カードサイズ
export type CardSize = 'small' | 'medium' | 'large';

// タブモード
export type TabMode = 'deckList' | 'summary';

// 表示設定の状態
export interface ViewSettings {
  viewMode: ViewMode;
  cardSize: CardSize;
  activeTab: TabMode;
}

// 表示設定のアクション
export interface ViewSettingsActions {
  setViewMode: (mode: ViewMode) => void;
  setCardSize: (size: CardSize) => void;
  setActiveTab: (tab: TabMode) => void;
}

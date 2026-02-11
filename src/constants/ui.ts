// UI関連の設定定数

export const UI_CONFIG = {
  // 一括処理の進捗更新間隔（ミリ秒）
  BULK_PROCESS_DELAY: 100,

  // レスポンシブグリッドの設定
  GRID_BREAKPOINTS: {
    MOBILE: 'grid-cols-1',
    SMALL_TABLET: 'sm:grid-cols-1',
    TABLET: 'md:grid-cols-2',
    SMALL_PC: 'lg:grid-cols-3',
    MEDIUM_PC: 'xl:grid-cols-4',
    LARGE_PC: '2xl:grid-cols-5',
  },
} as const

// グリッドクラス名の組み合わせ
export const GRID_CLASSES = [
  UI_CONFIG.GRID_BREAKPOINTS.MOBILE,
  UI_CONFIG.GRID_BREAKPOINTS.SMALL_TABLET,
  UI_CONFIG.GRID_BREAKPOINTS.TABLET,
  UI_CONFIG.GRID_BREAKPOINTS.SMALL_PC,
  UI_CONFIG.GRID_BREAKPOINTS.MEDIUM_PC,
  UI_CONFIG.GRID_BREAKPOINTS.LARGE_PC,
].join(' ')

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ポケモンカードゲームのデッキコードを入力し、公式サイトのデッキレシピ画像を表示するReact 19 + TypeScript + Viteアプリケーション。単体入力とExcelコピー対応の一括入力をサポート。

## Key Commands

- `npm run dev` - 開発サーバー起動 (http://localhost:5173/PokemonTCGJPDeckViewer/)
- `npm run build` - 本番ビルド (TypeScript compile + Vite build)
- `npm run lint` - ESLintチェック
- `npm run format` - Prettierでコードフォーマット
- `npm run format:check` - フォーマットチェック（CI向け）
- `npm run preview` - ビルド後のプレビュー

Node.jsバージョンは`.mise.toml`で管理（mise使用）。

### GitHub Actions
- **CI** (`ci.yml`): mainへのPR時に自動実行。`npm run lint` → `npm run format:check` → `tsc -b`（lint・フォーマット・型チェック）
- **Deploy** (`deploy.yml`): mainブランチへのpush時に自動実行。`npm ci` → `npm run build` → GitHub Pagesへデプロイ

両ワークフローとも`jdx/mise-action`で`.mise.toml`のNode.jsバージョンを使用。

## Architecture

### Layered Architecture
```
View Layer (src/App.tsx, src/components/)
    ↓
Business Logic Layer (src/hooks/)
    ↓
Infrastructure Layer (src/utils/, src/types/, src/constants/)
    ↓
Browser APIs (localStorage, window events)
```

### Data Flow
```
User Input (Forms)
  → useFormState (入力状態管理)
  → useDeckManager (バリデーション + ビジネスロジック)
  → useAppState (状態更新)
  → useLocalStorage (永続化)
  → filterDeckList (useFilterStateによるフィルタリング)
  → Component re-renders
```

### Hooks Pattern
全てのhooksは `[State, Actions]` タプルを返す設計パターンに従う:
- `useAppState` - アプリ全体の状態（デッキリスト、UI状態）。`updateDeck`でインライン編集対応
- `useFormState` - フォーム入力状態（単体/一括モード、playerName/deckName/deckCode）
- `useModalState` - モーダル表示状態、ナビゲーション、`updateModalImage`でモーダル内編集対応
- `useViewSettings` - 表示設定（グリッド/リスト、カードサイズ、タブ切り替え）+ localStorage永続化
- `useFilterState` - フィルターテキスト状態管理。App.tsxで`filterDeckList()`と組み合わせてデッキ一覧をフィルタリング
- `useDeckManager` - デッキ追加・更新・削除の全操作を集約。`handleUpdateDeck`でインライン編集の永続化を担当
- `useLocalStorage` - localStorage操作、Date型のシリアライズ対応

### URL Generation
デッキコードからポケモンカード公式URLを生成（`generateDeckUrls()`）:
- View URL: `deck/deckView.php/deckID/{deckCode}` (画像表示用)
- Details URL: `deck/confirm.html/deckID/{deckCode}` (外部リンク用)

### Bulk Input Parsing
`parseBulkInputLine()`が以下の形式に対応：
- 3列: `プレイヤー名\tデッキコード\tデッキ名` (Excel 3列対応)
- 2列: `プレイヤー名\tデッキコード` (Excel 2列対応)
- 1列: デッキコードのみ
- 区切り文字: タブ/カンマ/セミコロン/スペース

### Tab Navigation
App.tsxで「デッキ一覧」と「デッキ集計」のタブ切り替えUI。`ViewSettings.activeTab`（`TabMode = 'deckList' | 'summary'`）で管理し、localStorageに永続化。デッキがある場合のみタブ表示。

### Deck Name Summary
`DeckNameSummary`コンポーネントがデッキ名ごとの集計テーブルを表示。`aggregateDeckNames()`（`src/utils/deckUtils.ts`）で件数・割合(%)を算出。デッキ名未設定は「未設定」にまとめ、件数降順ソート。デッキ名クリックでフィルターテキストにセットしデッキ一覧タブに切り替え（「未設定」はクリック対象外）。

### Filter
`DeckList`コンポーネント内にフィルターテキストボックスを配置。`filterDeckList()`（`src/utils/deckUtils.ts`）でプレイヤー名・デッキ名の大文字小文字無視の部分一致フィルタリング。フィルタリング結果は`DeckList`、`DeckNameSummary`、`ImageModal`で共有（App.tsxの`filteredDeckList`）。

### Clipboard Export
`generateDeckListTsv()`でデッキ一覧をタブ区切りテキストに変換し、クリップボードにコピー。Excelにそのまま貼り付け可能。列順は一括入力と同じ（プレイヤー名/デッキコード/デッキ名）。

### Inline Editing
DeckCardとImageModalでプレイヤー名・デッキ名のインライン編集が可能:
- クリックで編集モード開始、Enter/blurで保存、Escapeでキャンセル
- 空欄時はプレースホルダー表示（クリックで入力開始）
- モーダル表示中はEnterキーでデッキ名編集を開始可能
- モーダル編集中はキーボードショートカット（矢印キー/ESC）を無効化（`useModalState`内でINPUT/TEXTAREA検出）
- モーダルでのデッキ名編集時にオートコンプリート候補を表示（`aggregateDeckNames()`で件数降順、最大10件）。↑↓キーで選択、Enter/クリックで確定

### Error Handling
- 型付き`AppError`オブジェクト（`ErrorType` enum: NETWORK_ERROR, STORAGE_ERROR, VALIDATION_ERROR等）
- `createAppError()`, `isQuotaExceededError()`, `isNetworkError()`ヘルパー
- エラーメッセージは`src/constants/messages.ts`の`ERROR_MESSAGES`で一元管理

## Configuration Notes

- **Vite**: Base path `/PokemonTCGJPDeckViewer/` (GitHub Pages用)
- **Tailwind CSS v3**: v4から互換性問題でダウングレード済み
- **TypeScript**: ES2022ターゲット、strictモード
- **ESLint**: Flat config（eslint.config.js）、TypeScript + React Hooks推奨ルール、eslint-config-prettierで競合ルール無効化
- **Prettier**: コードフォーマッター（`.prettierrc.json`）、セミコロンなし・シングルクォート
- **mise**: Node.jsバージョン管理（`.mise.toml`）、GitHub Actionsと共有
- **localStorage keys**: `pokemonTcgDeckList`（デッキリスト）、`pokemonTcgViewSettings`（表示設定）

## Development Guidelines

- **新しいURL/キー/設定** → `src/constants/`に追加し、`index.ts`でre-export
- **新しい型定義** → `src/types/`にドメイン別で追加し、`index.ts`でre-export
- **ビジネスロジック** → `useDeckManager`または専用hookを通す
- **ユーティリティ関数** → 副作用なしの純粋関数として`src/utils/`に配置
- **新しいhook** → `[State, Actions]`タプルを返すパターンに従う
- **コンポーネント最適化** → presentationalコンポーネントは`React.memo()`、イベントハンドラーは`useCallback()`を使用
- **useEffect内でのsetState** → ESLintルール`react-hooks/set-state-in-effect`で禁止。refベースのパターンで代替

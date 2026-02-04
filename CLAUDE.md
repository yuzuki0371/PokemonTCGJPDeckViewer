# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ポケモンカードゲームのデッキコードを入力し、公式サイトのデッキレシピ画像を表示するReact 19 + TypeScript + Viteアプリケーション。単体入力とExcelコピー対応の一括入力をサポート。

## Key Commands

- `npm run dev` - 開発サーバー起動 (http://localhost:5173/PokemonTCGJPDeckViewer/)
- `npm run build` - 本番ビルド (TypeScript compile + Vite build)
- `npm run lint` - ESLintチェック
- `npm run preview` - ビルド後のプレビュー

デプロイはmainブランチへのプッシュでGitHub Actionsが自動実行。

## Architecture

### Layered Architecture
```
View Layer (src/App.tsx, src/components/)
    ↓
Business Logic Layer (src/hooks/)
    ↓
Infrastructure Layer (src/utils/, src/types/, src/constants/)
```

### Data Flow
User Input → FormState → DeckManager → AppState → localStorage → UI Update

### Hooks Pattern
全てのhooksは `[State, Actions]` タプルを返す設計パターンに従う:
- `useAppState` - アプリ全体の状態（デッキリスト、UI状態）
- `useFormState` - フォーム入力状態（単体/一括モード）
- `useModalState` - モーダル表示状態とナビゲーション
- `useViewSettings` - 表示設定（グリッド/リスト、カードサイズ）+ localStorage永続化
- `useDeckManager` - デッキ追加・削除の全操作を集約
- `useLocalStorage` - localStorage操作、Date型のシリアライズ対応

### URL Generation
デッキコードからポケモンカード公式URLを生成（`generateDeckUrls()`）:
- View URL: `deck/deckView.php/deckID/{deckCode}` (画像表示用)
- Details URL: `deck/confirm.html/deckID/{deckCode}` (外部リンク用)

### Bulk Input Parsing
`parseBulkInputLine()`が以下の形式に対応：
- タブ区切り: `プレイヤー名\tデッキコード` (Excel対応)
- 区切り文字: カンマ/セミコロン/スペース
- 改行区切り: 1行1コード

## Configuration Notes

- **Vite**: Base path `/PokemonTCGJPDeckViewer/` (GitHub Pages用)
- **Tailwind CSS v3**: v4から互換性問題でダウングレード済み
- **localStorage keys**: `STORAGE_KEYS`で管理（デッキリスト、表示設定）

## Development Guidelines

- **新しいURL/キー/設定** → `src/constants/`に追加し、`index.ts`でre-export
- **新しい型定義** → `src/types/`にドメイン別で追加し、`index.ts`でre-export
- **ビジネスロジック** → `useDeckManager`または専用hookを通す
- **ユーティリティ関数** → 副作用なしの純粋関数として`src/utils/`に配置
- **新しいhook** → `[State, Actions]`タプルを返すパターンに従う

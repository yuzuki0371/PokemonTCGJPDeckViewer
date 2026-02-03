# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ポケモンカードゲームのデッキコードを入力し、公式サイトのデッキレシピ画像を表示するReact 19 + TypeScript + Viteアプリケーション。単体入力とExcelコピー対応の一括入力をサポート。

## Key Commands

- `npm run dev` - 開発サーバー起動 (http://localhost:5173)
- `npm run build` - 本番ビルド (TypeScript compile + Vite build)
- `npm run lint` - ESLintチェック
- `npm run preview` - ビルド後のプレビュー

デプロイはmainブランチへのプッシュでGitHub Actionsが自動実行。

## Architecture

### Layered Architecture
```
View Layer (src/App.tsx, src/components/)
    ↓
Business Logic Layer (src/hooks/useDeckManager.ts, useAppState.ts, useFormState.ts, useModalState.ts)
    ↓
Infrastructure Layer (src/hooks/useLocalStorage.ts, src/utils/, src/types/, src/constants/)
```

### Data Flow
User Input → FormState → DeckManager → AppState → localStorage → UI Update

### Key Files
- `src/hooks/useDeckManager.ts` - デッキ追加・削除の全操作を集約。フォーム送信は必ずここを通す
- `src/utils/deckUtils.ts` - 純粋関数のユーティリティ（入力パース、データ生成、メッセージ生成）
- `src/constants/index.ts` - URL生成(`generateDeckUrls()`)、ストレージキー、エラーメッセージ
- `src/hooks/useLocalStorage.ts` - localStorage操作。Date型のシリアライズ/デシリアライズ対応

### URL Generation
デッキコードからポケモンカード公式URLを生成：
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
- **localStorage key**: `STORAGE_KEYS.DECK_LIST` で管理

## Development Guidelines

- **新しいURL/キー/設定** → `src/constants/index.ts`に追加
- **新しい型定義** → `src/types/`にドメイン別で追加
- **ビジネスロジック** → `useDeckManager`または専用hookを通す
- **ユーティリティ関数** → 副作用なしの純粋関数として`src/utils/`に配置

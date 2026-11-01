# CLAUDE.md

## Project Overview

ポケモンカードゲームのデッキコードを入力し、公式サイトのデッキレシピ画像を表示するReact 19 + TypeScript + Vite+アプリケーション。単体入力とExcelコピー対応の一括入力をサポート。デッキ一覧と表示設定はlocalStorageに保存する（サーバーなし）。

## Deploy

Cloudflare PagesのGitHub直接連携でデプロイ。mainブランチへのpush時にCloudflareが自動ビルド・デプロイする。

- ビルドコマンド: `pnpm build`
- 出力ディレクトリ: `dist`
- Node.jsバージョン: `.node-version` 参照

## CI

- mainへのPRでは`check`（`pnpm check`）・`react-doctor`（GitHub Actions）・`Cloudflare Pages`（プレビュービルド）がrulesetの必須チェック。`pnpm check`が通ってもCloudflareのビルドだけ失敗することがあるので、依存更新時は`pnpm build`も確認する
- mainのマージ方法はmerge commitのみ

## Configuration Notes

- **Vite+**: Vite / Oxlint / Oxfmt を統合したツールチェーン（`vite-plus`、CLIは`vp`）。設定は`vite.config.ts`に集約し、`defineConfig`は`vite-plus`からimportする
  - **Git hooks**: `vp hooks`で管理。pre-commit（`.vite-hooks/pre-commit`）で`vp staged`を実行し、`vite.config.ts`の`staged`に従いステージ済みファイルのフォーマットのみチェック。`prepare`スクリプト（`vp config`）でインストールされる。一時的にスキップする場合は`VP_GIT_HOOKS=0`
- **pnpm**（`pnpm-workspace.yaml`）:
  - `vite`の`npm:`エイリアス（`@voidzero-dev/vite-plus-core`）、catalog、overridesは使わない。Dependabotが`npm:`エイリアスを更新できず、`vite-plus`とvite-plus-coreのバージョンがずれてビルドが壊れるため。vite-plus-coreは`vite-plus`の依存として同じバージョンで入る
    - `@vitejs/plugin-react` / `@tailwindcss/vite`のpeer依存`vite`には本家viteが入る（vite-plus-coreとは別物）
    - viteのクライアント型は`vite-plus/client`を参照する（`src/vite-env.d.ts`）
  - `minimumReleaseAge`（7日）を設定。公開直後のバージョンはインストールできない

## Development Guidelines

- **新しいURL/キー/設定** → `src/constants/`に追加し、`index.ts`でre-export
- **新しい型定義** → `src/types/`にドメイン別で追加し、`index.ts`でre-export
- **ビジネスロジック** → `useDeckManager`または専用hookを通す
- **ユーティリティ関数** → 副作用なしの純粋関数として`src/utils/`に配置
- **新しいhook** → `[State, Actions]`タプルを返すパターンに従う
- **コンポーネント最適化** → presentationalコンポーネントは`React.memo()`、イベントハンドラーは`useCallback()`を使用
- **useEffect内でのsetState** → 禁止（`react-hooks/set-state-in-effect`相当）。`vite.config.ts`のlintルールでは有効化していないため、レビューで注意しrefベースのパターンで代替
- **クリック可能な非ボタン要素** → `role="button"` / `tabIndex={0}` / `onKeyDown`（Enter/Space）を付与してアクセシビリティを確保
- **render\* インライン関数** → コンポーネント外の名前付きコンポーネントに分離（React reconciliationの安定性のため）

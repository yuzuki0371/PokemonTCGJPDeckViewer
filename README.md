# PokemonTCGJPDeckViewer

[![CI](https://github.com/yuzuki0371/PokemonTCGJPDeckViewer/actions/workflows/ci.yml/badge.svg)](https://github.com/yuzuki0371/PokemonTCGJPDeckViewer/actions/workflows/ci.yml)
[![Cloudflare Pages](https://img.shields.io/website?url=https%3A%2F%2Fpokemontcgjpdeckviewer.pages.dev&label=Cloudflare%20Pages)](https://pokemontcgjpdeckviewer.pages.dev)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/static/v1?label=TypeScript&message=7%2E0&color=3178C6&logo=typescript&logoColor=white)
![Vite+](https://img.shields.io/badge/Vite%2B-1-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/static/v1?label=Node%2Ejs&message=24&color=339933&logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-12-FF5500?logo=pnpm&logoColor=white)

![GitHub License](https://img.shields.io/github/license/yuzuki0371/PokemonTCGJPDeckViewer)
![GitHub last commit](https://img.shields.io/github/last-commit/yuzuki0371/PokemonTCGJPDeckViewer)
![GitHub repo size](https://img.shields.io/github/repo-size/yuzuki0371/PokemonTCGJPDeckViewer)

ポケモンカードゲームのデッキコードを入力して、公式サイトのデッキレシピ画像を表示するWebアプリケーションです。

## 機能

- **単体入力**: プレイヤー名・デッキ名（任意）とデッキコードを1件ずつ入力
- **一括入力**: 複数のデッキを一度に入力（1行1件）
  - Excelからのコピー＆ペースト（タブ区切り）に対応。「プレイヤー名・デッキコード・デッキ名」の3列、または「プレイヤー名・デッキコード」の2列
  - 手入力の場合はスペース・カンマ・セミコロン区切りに対応。デッキコードのみの行も可
- **一覧コピー**: デッキ一覧をタブ区切り（プレイヤー名・デッキコード・デッキ名）でクリップボードにコピーし、Excelに貼り付け可能
- **フィルター検索**: プレイヤー名・デッキ名でデッキ一覧をリアルタイム絞り込み（部分一致/完全一致の切り替え対応）
- **デッキ集計**: 「デッキ集計」タブでデッキ名ごとの件数・割合を表示、デッキ名クリックで一覧をフィルター
- **表示切り替え**: グリッド表示/リスト表示、カードサイズ（小・中・大）を切り替え
- **インライン編集**: プレイヤー名・デッキ名をクリックしてその場で編集、デッキ名は既存名のオートコンプリート候補付き
- **画像拡大表示**: クリックで画像を拡大、矢印キーで画像間を移動、Enterキーでデッキ名編集
- **削除**: デッキを個別に削除、または「すべてクリア」で一括削除
- **データの保存**: デッキ一覧と表示設定はブラウザ（localStorage）に保存され、再訪時に復元
- **ページトップへ戻るボタン**: スクロール時に画面右下に表示、クリックでスムーズスクロール

## 技術スタック

- React 19 + TypeScript
- [Vite+](https://viteplus.dev/) (開発・ビルド・lint・フォーマットの統合ツールチェーン。Vite / Oxlint / Oxfmt を同梱)
- Tailwind CSS v4 (スタイリング)
- pnpm (パッケージマネージャー)
- Cloudflare Pages (デプロイ)

## セットアップ

### 前提条件

- Node.js 24（`.node-version` で指定。`package.json` の `devEngines` により、条件を満たさない場合はpnpmが自動でダウンロード）
- [pnpm](https://pnpm.io/) （パッケージマネージャー）

### インストール

```bash
git clone https://github.com/yuzuki0371/PokemonTCGJPDeckViewer.git
cd PokemonTCGJPDeckViewer
pnpm install
```

## 開発

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

### その他のコマンド

- `pnpm build` - 本番用ビルド
- `pnpm check` - フォーマット・コード検査・型チェックを一括実行
- `pnpm lint` - コード検査（型チェック含む）
- `pnpm format` - コードフォーマット
- `pnpm format:check` - フォーマットのチェック
- `pnpm preview` - ビルド後のプレビュー
- `pnpm typecheck` - TypeScriptの型チェック
- `pnpm doctor` - react-doctorによるReactアンチパターン検出

## 使用方法

### 単体入力モード

1. プレイヤー名・デッキ名を入力（任意）
2. デッキコードを入力
3. 「デッキレシピを追加」ボタンをクリック

### 一括入力モード

1. 「一括入力」を選択
2. 1行に1件ずつ、以下のいずれかの形式で入力：
   - `プレイヤー名	デッキコード	デッキ名`（タブ区切り、Excelからのコピー）
   - `プレイヤー名	デッキコード`（タブ区切り）
   - `プレイヤー名 デッキコード デッキ名`（スペース・カンマ・セミコロン区切り）
   - `デッキコード`のみ
3. 「デッキレシピを一括追加」ボタンをクリック

### 画像表示

- 追加されたデッキが「デッキ一覧」タブに表示されます
- 画像をクリックすると拡大表示されます
- 拡大表示中は矢印キー（↑↓←→）で他の画像に移動、Enterキーでデッキ名を編集できます
- ESCキーで拡大表示を閉じることができます

## レスポンシブデザイン

グリッド表示の列数は、画面幅とカードサイズに応じて変わります。

| 画面幅         | 小  | 中  | 大  |
| -------------- | --- | --- | --- |
| < 640px        | 2列 | 1列 | 1列 |
| ≥ 640px (sm)   | 3列 | 1列 | 1列 |
| ≥ 768px (md)   | 4列 | 2列 | 1列 |
| ≥ 1024px (lg)  | 5列 | 3列 | 2列 |
| ≥ 1280px (xl)  | 6列 | 4列 | 3列 |
| ≥ 1536px (2xl) | 7列 | 5列 | 3列 |

## CI / デプロイ

### CI（プルリクエスト時）

`main`ブランチへのプルリクエスト時にGitHub Actionsで以下のチェックが自動実行されます：

1. Vite+によるフォーマット・コード検査・型チェック（`pnpm check`）
2. react-doctorによるReactアンチパターン検出

上記に加えてCloudflare Pagesのプレビュービルドも実行されます。

### 依存関係の更新

Dependabotが毎週月曜にReact・Vite+・Tailwind CSS関連のパッケージと、GitHub Actionsのreact-doctorの更新PRを作成します（メジャーアップデートは対象外、公開から7日経過したバージョンのみ）。

### 自動デプロイ

Cloudflare PagesのGitHub直接連携により、`main`ブランチへのプッシュ時にCloudflareが自動でビルド・デプロイします。

| 設定項目          | 値           |
| ----------------- | ------------ |
| ビルドコマンド    | `pnpm build` |
| 出力ディレクトリ  | `dist`       |
| Node.jsバージョン | `24`         |

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 参考リンク

- [ポケモンカードゲーム公式サイト](https://www.pokemon-card.com/)
- [デッキ表示ページ](https://www.pokemon-card.com/deck/)

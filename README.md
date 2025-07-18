# PokemonTCGJPDeckViewer

[![Deploy to GitHub Pages](https://github.com/yuzuki0371/PokemonTCGJPDeckViewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/yuzuki0371/PokemonTCGJPDeckViewer/actions/workflows/deploy.yml)
![GitHub License](https://img.shields.io/github/license/yuzuki0371/PokemonTCGJPDeckViewer)

ポケモンカードゲームのデッキコードを入力して、公式サイトのデッキレシピ画像を表示するWebアプリケーションです。

## 機能

- **単体入力**: 1つずつデッキコードを入力
- **一括入力**: 複数のデッキコードを一度に入力
  - Excel形式（タブ区切り）でのコピー＆ペーストに対応
  - カンマ、セミコロン、スペース、改行区切りに対応
  - プレイヤー名も同時に入力可能
- **レスポンシブ表示**: デバイスサイズに応じてグリッド表示を調整
- **画像拡大表示**: クリックで画像を拡大、矢印キーで画像間を移動
- **重複検出**: 同じデッキコードの重複追加を防止

## 技術スタック

- React 19 + TypeScript
- Vite (開発・ビルドツール)
- Tailwind CSS (スタイリング)
- GitHub Pages (デプロイ)

## セットアップ

### 前提条件

Node.js 18以上が必要です。

### インストール

```bash
git clone https://github.com/yuzuki0371/PokemonTCGJPDeckViewer.git
cd PokemonTCGJPDeckViewer
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

### その他のコマンド

- `npm run build` - 本番用ビルド
- `npm run lint` - ESLintによるコード検査
- `npm run preview` - ビルド後のプレビュー

## 使用方法

### 単体入力モード

1. デッキコードを入力
2. プレイヤー名を入力（オプション）
3. 「追加」ボタンをクリック

### 一括入力モード

1. 「一括入力」タブを選択
2. 以下のいずれかの形式でデッキコードを入力：
   - `デッキコード1,デッキコード2,デッキコード3`
   - `プレイヤー名1	デッキコード1` (タブ区切り)
   - 各行に1つずつ
3. 「一括追加」ボタンをクリック

### 画像表示

- 追加されたデッキが自動的にグリッド表示されます
- 画像をクリックすると拡大表示されます
- 拡大表示中は矢印キー（↑↓←→）で他の画像に移動できます
- ESCキーで拡大表示を閉じることができます

## レスポンシブデザイン

- モバイル (< 640px): 1列
- タブレット (≥ 768px): 2列
- PC (≥ 1024px): 3列
- 大画面 (≥ 1280px): 4列
- 超大画面 (≥ 1536px): 5列

## デプロイ

このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

### 自動デプロイ

- `main`ブランチにプッシュすると自動的にビルドとデプロイが実行されます
- GitHub Actionsワークフローが以下の処理を行います：
  1. 依存関係のインストール
  2. TypeScriptコンパイルとViteビルド
  3. GitHub Pagesへのデプロイ

### 手動デプロイ

GitHub Actionsのワークフロー画面から手動でデプロイを実行することも可能です。

### 初回セットアップ

1. GitHubリポジトリの設定で「Pages」を選択
2. Source を「GitHub Actions」に設定

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 参考リンク

- [ポケモンカードゲーム公式サイト](https://www.pokemon-card.com/)
- [デッキ表示ページ](https://www.pokemon-card.com/deck/)
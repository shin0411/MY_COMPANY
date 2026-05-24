# 同人税務サバイバルキット 2026

副業同人作家のための無料Web確定申告サポートツール。`MY_COMPANY` AI経営チームが企画・承認した商材のサンプル実装です。

## 機能

- **📒 経費仕訳シミュレーター** — キーワードから14勘定科目を自動判定
- **💴 所得税概算ツール** — 売上・経費・控除から所得税/住民税/個人事業税を試算
- **✅ イベント別経費チェックリスト** — コミケ等5テンプレ、CSV/PDF出力対応
- **❓ 同人税務 Q&A データベース** — 40問+、カテゴリ/全文検索

## 特徴

- バックエンドゼロ、入力データはブラウザ内完結（サーバ送信なし）
- 登録不要、ログイン不要、広告なし、トラッキングなし
- ライト/ダーク両モード、システム連動切替
- localStorage で入力データを自動保存
- 印刷/PDF対応のレイアウト
- 完全レスポンシブ

## 技術スタック

- **Next.js 16.2.6** (App Router, 静的エクスポート)
- **React 19.2.4**
- **TailwindCSS 4** (`@theme inline` 構成、`@custom-variant dark` でクラスベース)
- **TypeScript 5**
- **Noto Sans JP** (next/font)

## ローカル開発

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 静的サイト書き出し → out/
```

## デプロイ

`DEPLOY.md` を参照。Vercel / Cloudflare Pages / Netlify / GitHub Pages すべて対応。

## ディレクトリ構成

```
web/
├── app/
│   ├── layout.tsx           ルートレイアウト、ナビ、フッター、ダークモード初期化
│   ├── page.tsx             ホーム
│   ├── shiwake/page.tsx     経費仕訳シミュレーター
│   ├── shotoku/page.tsx     所得税概算ツール
│   ├── checklist/page.tsx   イベント別経費チェックリスト
│   ├── qa/page.tsx          Q&A データベース
│   └── globals.css          グローバルCSS（@theme, ダーク、印刷）
├── components/
│   └── ThemeToggle.tsx      テーマ切替（light/dark/system）
├── lib/
│   ├── shiwake-rules.ts     勘定科目14件＋キーワード判定
│   ├── tax-calc.ts          所得税・住民税・個人事業税の計算
│   ├── events-data.ts       イベントテンプレ5種
│   ├── qa-data.ts           Q&A 40問+
│   └── use-local-storage.ts useState互換のlocalStorageフック
├── DEPLOY.md                デプロイ手順
├── MARKETING.md             マーケティング素材
└── README.md                このファイル
```

## ライセンス

MIT License。フォーク・改変・商用利用すべて自由。ただし税務情報の正確性については利用者の責任とします。

## 免責

本ツールは情報提供を目的とした「参考値」を表示するもので、税理士法上の税務代理・税務相談には該当しません。実際の確定申告は税理士または税務署にご相談ください。本計算結果による損害について一切の責任を負いません。

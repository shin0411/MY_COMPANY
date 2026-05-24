# デプロイガイド

本ツールは **静的サイト** として書き出されるため、無料ホスティング各種にデプロイできます。設定 1〜2 分です。

## 推奨デプロイ先（おすすめ順）

1. **Vercel** — Next.js 公式運営、設定ほぼ不要、独自ドメイン無料
2. **Cloudflare Pages** — CDN速度が圧倒的、無制限帯域
3. **Netlify** — 老舗、設定がシンプル
4. **GitHub Pages** — 完全無料、リポジトリ公開が前提

---

## A. Vercel（推奨）

### 手順

1. https://vercel.com にGitHubアカウントでサインアップ
2. 「New Project」→ `shin0411/MY_COMPANY` を Import
3. **Configure Project** で以下を設定:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `web` ← **重要**
   - **Build Command**: `npm run build`（デフォルトでOK）
   - **Output Directory**: `out` ← 静的エクスポート用
   - **Install Command**: `npm install`
4. 「Deploy」クリック

数分で `xxx.vercel.app` ドメインで公開。本番URLは Settings → Domains から独自ドメイン設定可能（無料）。

### 自動デプロイ

`claude/happy-archimedes-KTJNR` ブランチに push するたびに自動再デプロイされます。

### 独自ドメイン例

`doujin-tax.example.com` のような独自ドメインを使う場合:

1. Vercel: Settings → Domains → 追加
2. DNS で CNAME `cname.vercel-dns.com` を設定
3. 数分でSSL証明書も自動発行

---

## B. Cloudflare Pages

### 手順

1. https://pages.cloudflare.com にサインアップ
2. 「Connect to Git」→ GitHubの `MY_COMPANY` を選択
3. **Build settings**:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `cd web && npm install && npm run build`
   - **Build output directory**: `web/out`
   - **Root directory**: 空欄
4. 「Save and Deploy」

`xxx.pages.dev` ドメインで公開。

---

## C. Netlify

### 手順

1. https://www.netlify.com にサインアップ
2. 「Add new site」→「Import an existing project」→ GitHub
3. `MY_COMPANY` を選択
4. **Build settings**:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `web/out`
5. 「Deploy site」

`xxx.netlify.app` ドメインで公開。

---

## D. GitHub Pages

GitHub Pages は静的サイト専用。少し設定が必要ですが完全無料です。

### 手順

1. `web/next.config.ts` の `basePath` を設定:

```ts
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: "/MY_COMPANY",  // ← GitHubリポジトリ名
  assetPrefix: "/MY_COMPANY/",
};
```

2. `.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: web/package-lock.json
      - run: npm ci
        working-directory: web
      - run: npm run build
        working-directory: web
      - run: touch web/out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/out
      - uses: actions/deploy-pages@v4
        id: deployment
```

3. GitHub リポジトリ Settings → Pages → Source を「GitHub Actions」に設定

4. `main` ブランチに push すると自動デプロイ

`https://shin0411.github.io/MY_COMPANY/` で公開。

---

## ローカル動作確認

デプロイ前にローカルで確認:

```bash
cd web
npm install
npm run dev
# http://localhost:3000 でアクセス
```

ビルドを試す:

```bash
npm run build
# out/ ディレクトリに静的ファイル生成
npx serve out
# http://localhost:3000 で配信
```

---

## デプロイ後にやること

### 1. Google Search Console 登録

検索エンジン経由の流入を計測する。

1. https://search.google.com/search-console
2. プロパティ追加 → URL を入力
3. HTMLタグ認証 → `app/layout.tsx` の `<head>` に追加:

```tsx
<head>
  <meta name="google-site-verification" content="認証コード" />
</head>
```

### 2. アクセス解析（プライバシー重視）

ユーザーのプライバシーを守りつつ計測:

**選択肢A: Cloudflare Web Analytics**（推奨）
- 無料、Cookieなし、JS軽量
- Vercel/Netlifyでも併用可

**選択肢B: Plausible / Umami**
- セルフホスト or 有料SaaS、Cookieなし、GDPR準拠

**選択肢C: 計測しない**
- 「データを取らない」を売りにするのもアリ

Googleアナリティクスは「サーバ送信ゼロ」のメッセージと矛盾するので避ける。

### 3. サイトマップ

SEO用に `app/sitemap.ts` を追加:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://your-domain.example.com";
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1 },
    { url: `${base}/shiwake/`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/shotoku/`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/checklist/`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/qa/`, lastModified: new Date(), priority: 0.8 },
  ];
}
```

### 4. OGP画像の作成

`web/public/og.png` に 1200×630px の画像を配置し、`app/layout.tsx` の metadata で参照:

```ts
openGraph: {
  images: [{ url: "/og.png", width: 1200, height: 630 }],
}
```

---

## トラブルシューティング

### ビルドが失敗する

- Node 22 以上を使用（package.json の engines を確認）
- `web/` ディレクトリ内で実行しているか確認
- `npm ci` で依存をクリーンインストール

### 静的エクスポートで動的な機能が動かない

- `output: "export"` は API Route が使えない（すべてクライアントサイド）
- すべての処理は `'use client'` コンポーネント内で完結させる
- 動的データが必要になったら Vercel など SSR可能なホストへ移行

### フォントが豆腐になる

- Noto Sans JP のサブセット指定が `["latin"]` だが、CJK は別経路で取得されている
- 念のため `app/layout.tsx` に明示的に CJK サブセットを追加することも検討

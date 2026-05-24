# MY_COMPANY

SaaS/IT スタートアップを運営するための **AI 経営チーム** プロジェクトです。Claude Code のサブエージェント機能を活用し、CEO・CFO・CTO などの経営層から、企画・営業・マーケ・開発・管理部門まで、**計18名の専門エージェント** を実装しています。

**目玉機能: 商材企画ワークフロー** — 「新商材を企画して」と依頼すると、企画部4名が起案 → 経営層4名がレビュー → 承認された案だけがあなたに届きます（生煮え案は非開示）。

## クイックスタート

### 必要なもの

- [Claude Code](https://claude.ai/code) (CLI、Desktop、Web、IDE 拡張のいずれか)
- このリポジトリをローカルにクローン

### 起動

```bash
git clone <this-repo>
cd MY_COMPANY
claude
```

Claude Code はリポジトリ内の `.claude/agents/` を自動で読み込み、14名のサブエージェントが利用可能になります。

### 試してみる

```
@ceo 来期のミッションを再定義したい。今は何を意識すべき？

@cfo ARRが3億円・成長率150%の場合、シリーズBで狙うべきバリュエーションは？

@product-manager リテンション率を上げる新機能のPRDを書いて。

新商材を企画して                ← 企画部→経営層レビューが裏で走り、
                                   承認済み案だけが返ってくる
```

## チーム構成

| 部門 | エージェント |
|------|--------------|
| 経営層 | `ceo`, `coo`, `cfo`, `cto` |
| 企画部 | `planning-lead`, `market-research`, `business-development`, `product-planning` |
| 営業・マーケティング | `sales-lead`, `marketing-lead`, `customer-success` |
| 開発・エンジニアリング | `engineering-manager`, `product-manager`, `ux-designer`, `qa-engineer` |
| 管理部門 | `hr-lead`, `accounting-lead`, `legal-lead` |

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## カスタマイズ

各エージェントの定義は `.claude/agents/<name>.md` にあります。フェーズ・業種・カルチャーに合わせて自由に編集してください。

## ライセンス

社内利用を想定したテンプレートです。フォーク・改変は自由にどうぞ。

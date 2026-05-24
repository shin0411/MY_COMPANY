"use client";

import { useState, useMemo } from "react";
import {
  EXPENSE_CATEGORIES,
  suggestCategory,
  type ExpenseCategory,
} from "@/lib/shiwake-rules";

export default function ShiwakePage() {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const suggestions = useMemo(() => suggestCategory(query), [query]);
  const selected: ExpenseCategory | null = selectedId
    ? EXPENSE_CATEGORIES.find((c) => c.id === selectedId) ?? null
    : suggestions[0] ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-pink-600 text-sm font-medium mb-1">📒 経費仕訳シミュレーター</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          経費の勘定科目を判定
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          支出の名称（例: コミケ参加費、ねこのしっぽ、BOOTH手数料）を入力すると、
          適切な勘定科目を提案します。
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-6">
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          支出の名称・キーワード
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedId(null);
          }}
          placeholder="例: ねこのしっぽ、コミケ参加費、BOOTH手数料、新幹線代"
          className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />

        <label className="block text-sm font-medium text-zinc-700 mt-4 mb-2">
          金額（円・任意）
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="例: 8000"
          className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />
      </div>

      {query && suggestions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-zinc-700 mb-2">
            候補（クリックで選択）
          </h2>
          <div className="grid gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`text-left p-3 border-2 rounded-lg transition-all ${
                  selected?.id === s.id
                    ? "border-pink-400 bg-pink-50"
                    : "border-zinc-200 bg-white hover:border-pink-300"
                }`}
              >
                <div className="font-medium text-sm">{s.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">→ {s.account}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {query && suggestions.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900">
          一致する候補が見つかりませんでした。下の一覧から手動で選択するか、別のキーワードでお試しください。
        </div>
      )}

      {selected && (
        <div className="bg-white border-2 border-pink-300 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-xl font-bold">{selected.label}</h2>
            <span className="text-sm text-zinc-500">提案勘定科目</span>
          </div>
          <div className="text-2xl font-bold text-pink-600 mb-4">
            {selected.account}
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed mb-4">
            {selected.description}
          </p>

          {amount && Number(amount) > 0 && (
            <div className="bg-zinc-50 rounded-lg p-3 mb-4">
              <div className="text-xs text-zinc-500 mb-1">仕訳イメージ</div>
              <div className="font-mono text-sm">
                <div className="flex justify-between">
                  <span>（借方）{selected.account}</span>
                  <span>{Number(amount).toLocaleString()}円</span>
                </div>
                <div className="flex justify-between">
                  <span>（貸方）現金 / 普通預金 / 事業主借</span>
                  <span>{Number(amount).toLocaleString()}円</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-zinc-600 mb-3">
            <strong>例:</strong> {selected.examples.join(" / ")}
          </div>

          {selected.caution && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              ⚠️ <strong>注意:</strong> {selected.caution}
            </div>
          )}
        </div>
      )}

      <details className="bg-white border border-zinc-200 rounded-2xl p-5 mb-6">
        <summary className="cursor-pointer font-medium text-sm">
          すべての勘定科目を一覧表示（{EXPENSE_CATEGORIES.length}件）
        </summary>
        <div className="mt-4 grid gap-2">
          {EXPENSE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedId(c.id);
                setQuery(c.label);
              }}
              className="text-left p-3 border border-zinc-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors"
            >
              <div className="font-medium text-sm">{c.label}</div>
              <div className="text-xs text-zinc-500">→ {c.account}</div>
            </button>
          ))}
        </div>
      </details>

      <p className="text-xs text-zinc-500">
        ※ 表示される勘定科目は一般的な例です。最終的な仕訳は事業形態や帳簿の運用方針により異なる場合があります。
      </p>
    </div>
  );
}

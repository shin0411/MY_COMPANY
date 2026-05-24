"use client";

import { useState, useMemo } from "react";
import { QA_DATA, QA_CATEGORIES, type QA } from "@/lib/qa-data";

const ALL_CATEGORY = "すべて" as const;
type FilterCategory = typeof ALL_CATEGORY | (typeof QA_CATEGORIES)[number];

export default function QAPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterCategory>(ALL_CATEGORY);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QA_DATA.filter((qa) => {
      if (category !== ALL_CATEGORY && qa.category !== category) return false;
      if (!q) return true;
      return (
        qa.question.toLowerCase().includes(q) ||
        qa.answer.toLowerCase().includes(q) ||
        qa.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<QA["category"], QA[]>();
    for (const qa of filtered) {
      const list = map.get(qa.category) ?? [];
      list.push(qa);
      map.set(qa.category, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sky-600 text-sm font-medium mb-1">❓ 同人税務 Q&amp;A データベース</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          同人特有の疑問を、{QA_DATA.length}問で解決
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          「FANBOXの収入はいつ計上？」「赤字でも申告必要？」など、
          同人作家がつまずきやすい税務の疑問を体系化。
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-4">
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          キーワードで検索
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: FANBOX、赤字、インボイス、青色申告"
          className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 mb-3"
        />

        <div className="flex gap-1.5 flex-wrap">
          <CategoryChip
            active={category === ALL_CATEGORY}
            onClick={() => setCategory(ALL_CATEGORY)}
          >
            すべて ({QA_DATA.length})
          </CategoryChip>
          {QA_CATEGORIES.map((c) => {
            const count = QA_DATA.filter((q) => q.category === c).length;
            return (
              <CategoryChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c} ({count})
              </CategoryChip>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-zinc-600 mb-4">
        {filtered.length}件ヒット
        {query && <span> （キーワード: 「{query}」）</span>}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-900">
          一致するQ&amp;Aが見つかりませんでした。別のキーワードか「すべて」カテゴリで再検索してください。
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-sm font-bold text-sky-700 mb-3 sticky top-14 bg-zinc-50 py-1">
                # {cat}（{items.length}件）
              </h2>
              <div className="space-y-2">
                {items.map((qa) => (
                  <QAItem key={qa.id} qa={qa} query={query} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-500 mt-8 leading-relaxed">
        ※ 本Q&amp;Aは情報提供を目的としており、税務代理行為や個別の税務相談には該当しません。
        個別事案については必ず税理士・税務署にご相談ください。
        2026年度の税制を前提としています。
      </p>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full transition-colors ${
        active
          ? "bg-sky-600 text-white"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

function QAItem({ qa, query }: { qa: QA; query: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open || query.trim().length > 0}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-sky-300 transition-colors"
    >
      <summary className="cursor-pointer p-4 font-medium text-sm flex items-start gap-2 list-none">
        <span className="text-sky-600 flex-shrink-0">Q.</span>
        <span className="flex-1">{qa.question}</span>
        <span className="text-zinc-400 text-xs flex-shrink-0 mt-0.5">
          {open || query.trim().length > 0 ? "−" : "+"}
        </span>
      </summary>
      <div className="px-4 pb-4 pt-0">
        <div className="border-t border-zinc-100 pt-3 text-sm text-zinc-700 leading-relaxed">
          <span className="text-pink-600 font-medium">A.</span> {qa.answer}
        </div>
        <div className="mt-3 flex gap-1 flex-wrap">
          {qa.tags.map((t) => (
            <span
              key={t}
              className="text-xs text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </details>
  );
}

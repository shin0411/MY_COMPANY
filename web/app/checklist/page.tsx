"use client";

import { useState, useMemo } from "react";
import { EVENT_TEMPLATES, type ExpenseItem } from "@/lib/events-data";
import { useLocalStorage } from "@/lib/use-local-storage";

type ItemState = {
  checked: boolean;
  amount: string;
  memo: string;
};

type AllStates = Record<string, Record<string, ItemState>>;

export default function ChecklistPage() {
  const [eventId, setEventId] = useState(EVENT_TEMPLATES[0].id);
  const event = EVENT_TEMPLATES.find((e) => e.id === eventId)!;
  const [eventDate, setEventDate] = useLocalStorage<string>("checklist:date", "");
  const [states, setStates, resetAll] = useLocalStorage<AllStates>(
    "checklist:states",
    {},
  );

  const currentState = states[eventId] ?? {};

  const updateItem = (itemId: string, patch: Partial<ItemState>) => {
    setStates((s) => ({
      ...s,
      [eventId]: {
        ...s[eventId],
        [itemId]: {
          checked: s[eventId]?.[itemId]?.checked ?? false,
          amount: s[eventId]?.[itemId]?.amount ?? "",
          memo: s[eventId]?.[itemId]?.memo ?? "",
          ...patch,
        },
      },
    }));
  };

  const totals = useMemo(() => {
    const items = event.items;
    let checked = 0;
    let total = 0;
    for (const item of items) {
      const st = currentState[item.id];
      if (st?.checked) {
        checked++;
        const a = Number(st.amount) || 0;
        total += a;
      }
    }
    return { checked, total, percentage: (checked / items.length) * 100 };
  }, [currentState, event.items]);

  const exportCSV = () => {
    const header = [
      "イベント名",
      "日付",
      "項目",
      "勘定科目",
      "金額",
      "メモ",
      "チェック済",
    ];
    const rows: string[][] = [];
    for (const item of event.items) {
      const st = currentState[item.id];
      if (!st?.checked) continue;
      rows.push([
        event.name,
        eventDate,
        item.label,
        item.account,
        st.amount || "0",
        st.memo || "",
        "✓",
      ]);
    }
    const csv = [header, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = eventDate || new Date().toISOString().slice(0, 10);
    a.download = `${event.id}_${dateStr}_経費.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printPage = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6 no-print">
        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">
          ✅ イベント別経費チェックリスト
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          経費の取りこぼしをゼロに
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          イベント参加時の典型的な経費項目をチェックリスト化。
          チェック＋金額入力で集計し、CSV／印刷PDFで出力できます。データは自動保存されます。
        </p>
      </header>

      <h1 className="hidden print:block text-xl font-bold mb-3">
        {event.emoji} {event.name} 経費一覧 {eventDate && `(${eventDate})`}
      </h1>

      <div className="no-print bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              イベントテンプレート
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {EVENT_TEMPLATES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.emoji} {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              イベント日付（任意）
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">{event.description}</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-sm text-emerald-900 dark:text-emerald-200">
            進捗: <strong>{totals.checked} / {event.items.length}</strong>
          </div>
          <div className="text-sm text-emerald-900 dark:text-emerald-200">
            合計: <strong className="font-mono text-lg">{totals.total.toLocaleString()}円</strong>
          </div>
        </div>
        <div className="w-full h-2 bg-white dark:bg-zinc-800 rounded-full overflow-hidden no-print">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${totals.percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {event.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            state={currentState[item.id]}
            onUpdate={(patch) => updateItem(item.id, patch)}
          />
        ))}
      </div>

      <div className="flex gap-3 flex-wrap no-print">
        <button
          onClick={exportCSV}
          disabled={totals.checked === 0}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          📥 CSVでダウンロード
        </button>
        <button
          onClick={printPage}
          disabled={totals.checked === 0}
          className="px-5 py-2.5 bg-zinc-700 hover:bg-zinc-800 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          🖨️ 印刷 / PDF保存
        </button>
        <button
          onClick={() =>
            setStates((s) => ({ ...s, [eventId]: {} }))
          }
          className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium transition-colors"
        >
          このイベントをリセット
        </button>
        <button
          onClick={() => {
            if (window.confirm("すべてのイベントのデータを削除します。よろしいですか？")) {
              resetAll();
            }
          }}
          className="px-5 py-2.5 bg-white dark:bg-zinc-800 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
        >
          全データ削除
        </button>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-6 no-print">
        ※ 入力データはお使いのブラウザの localStorage に保存されます。同じブラウザで開けば次回も表示されます。
      </p>
    </div>
  );
}

function ItemRow({
  item,
  state,
  onUpdate,
}: {
  item: ExpenseItem;
  state: ItemState | undefined;
  onUpdate: (patch: Partial<ItemState>) => void;
}) {
  const checked = state?.checked ?? false;
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border-2 rounded-xl p-4 transition-colors ${
        checked
          ? "border-emerald-300 dark:border-emerald-700"
          : "border-zinc-200 dark:border-zinc-800 print:hidden"
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onUpdate({ checked: e.target.checked })}
          className="mt-1 size-4 accent-emerald-500"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{item.label}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            勘定科目: <span className="font-mono">{item.account}</span>
            {item.note && <span className="ml-2">— {item.note}</span>}
          </div>
        </div>
        {checked && state?.amount && (
          <div className="text-sm font-mono font-medium hidden print:block">
            {Number(state.amount).toLocaleString()}円
          </div>
        )}
      </label>

      {checked && (
        <div className="mt-3 ml-7 grid sm:grid-cols-2 gap-3 no-print">
          <div>
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">金額（円）</label>
            <input
              type="number"
              value={state?.amount ?? ""}
              onChange={(e) => onUpdate({ amount: e.target.value })}
              placeholder="0"
              className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">メモ</label>
            <input
              type="text"
              value={state?.memo ?? ""}
              onChange={(e) => onUpdate({ memo: e.target.value })}
              placeholder="例: ねこのしっぽ 通常入稿"
              className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      )}

      {checked && state?.memo && (
        <div className="mt-2 ml-7 text-xs text-zinc-600 dark:text-zinc-400 hidden print:block">
          メモ: {state.memo}
        </div>
      )}
    </div>
  );
}

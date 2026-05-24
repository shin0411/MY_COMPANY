"use client";

import { useState, useMemo } from "react";
import { EVENT_TEMPLATES, type ExpenseItem } from "@/lib/events-data";

type ItemState = {
  checked: boolean;
  amount: string;
  memo: string;
};

export default function ChecklistPage() {
  const [eventId, setEventId] = useState(EVENT_TEMPLATES[0].id);
  const event = EVENT_TEMPLATES.find((e) => e.id === eventId)!;
  const [eventDate, setEventDate] = useState("");
  const [states, setStates] = useState<Record<string, Record<string, ItemState>>>({});

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-emerald-600 text-sm font-medium mb-1">
          ✅ イベント別経費チェックリスト
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          経費の取りこぼしをゼロに
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          イベント参加時の典型的な経費項目をチェックリスト化。
          チェック＋金額入力で集計し、CSVで出力できます。
        </p>
      </header>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              イベントテンプレート
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {EVENT_TEMPLATES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.emoji} {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              イベント日付（任意）
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3">{event.description}</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-sm text-emerald-900">
            進捗: <strong>{totals.checked} / {event.items.length}</strong>
          </div>
          <div className="text-sm text-emerald-900">
            合計: <strong className="font-mono text-lg">{totals.total.toLocaleString()}円</strong>
          </div>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
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

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={exportCSV}
          disabled={totals.checked === 0}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          📥 CSVでダウンロード
        </button>
        <button
          onClick={() =>
            setStates((s) => ({ ...s, [eventId]: {} }))
          }
          className="px-5 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg font-medium transition-colors"
        >
          このイベントをリセット
        </button>
      </div>

      <p className="text-xs text-zinc-500 mt-6">
        ※ 入力データはお使いのブラウザのメモリ内のみで処理されます。ページを閉じるとリセットされます。長期保存したい場合はCSV出力をご利用ください。
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
      className={`bg-white border-2 rounded-xl p-4 transition-colors ${
        checked ? "border-emerald-300" : "border-zinc-200"
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
          <div className="text-xs text-zinc-500 mt-0.5">
            勘定科目: <span className="font-mono">{item.account}</span>
            {item.note && <span className="ml-2">— {item.note}</span>}
          </div>
        </div>
      </label>

      {checked && (
        <div className="mt-3 ml-7 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-600 mb-1">金額（円）</label>
            <input
              type="number"
              value={state?.amount ?? ""}
              onChange={(e) => onUpdate({ amount: e.target.value })}
              placeholder="0"
              className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-600 mb-1">メモ</label>
            <input
              type="text"
              value={state?.memo ?? ""}
              onChange={(e) => onUpdate({ memo: e.target.value })}
              placeholder="例: ねこのしっぽ 通常入稿"
              className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

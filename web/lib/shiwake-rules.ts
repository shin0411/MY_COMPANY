export type ExpenseCategory = {
  id: string;
  label: string;
  account: string;
  description: string;
  examples: string[];
  keywords: string[];
  caution?: string;
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "printing",
    label: "印刷費",
    account: "仕入高 または 外注工賃",
    description:
      "同人誌・グッズの印刷代。頒布を前提とする場合は仕入高（売上原価）として計上するのが原則。在庫として残った分は期末棚卸資産になる点に注意。",
    examples: ["同人誌のオフセット印刷代", "缶バッジ製造費", "アクキー製造費"],
    keywords: ["印刷", "プリント", "オフセット", "オンデマンド", "栗山", "ねこのしっぽ", "ポプルス", "緑陽社"],
    caution: "頒布せずに残った在庫は棚卸資産（資産計上）。年末に必ず棚卸を実施。",
  },
  {
    id: "event_circle",
    label: "イベント参加費（サークル参加）",
    account: "販売促進費 または 雑費",
    description:
      "コミケ・コミティア等のサークル参加費。販売活動のための直接費用なので販売促進費として処理する解釈が一般的。",
    examples: ["コミケサークル参加費", "コミティア参加費", "オンリーイベント参加費"],
    keywords: ["サークル", "参加費", "コミケ", "コミティア", "オンリー", "ブース"],
  },
  {
    id: "travel_event",
    label: "イベント遠征費（交通費）",
    account: "旅費交通費",
    description:
      "イベント参加のための交通費。「事業のための移動」を証明できる範囲（移動経路、目的）を記録しておくこと。観光目的との混合は按分。",
    examples: ["東京⇔大阪の新幹線代", "会場までのタクシー代", "ガソリン代の按分"],
    keywords: ["新幹線", "電車", "バス", "飛行機", "タクシー", "ガソリン", "高速", "交通"],
    caution: "観光と混合した場合は事業利用分のみ計上（按分）。",
  },
  {
    id: "lodging",
    label: "イベント遠征費（宿泊）",
    account: "旅費交通費",
    description:
      "遠征時のホテル代。前日入りなど事業に直接関係する範囲で計上可能。",
    examples: ["コミケ参加のための前泊ホテル代"],
    keywords: ["ホテル", "宿泊", "宿", "民泊", "Airbnb"],
  },
  {
    id: "consignment_fee",
    label: "委託販売手数料",
    account: "支払手数料",
    description:
      "とらのあな、メロンブックス、BOOTH等の委託販売・出品手数料。売上から差し引かれて入金されるケースが多いが、総額計上が原則。",
    examples: ["とらのあな委託手数料", "BOOTHおまかせ梱包手数料", "メロンブックス取扱料"],
    keywords: ["とらのあな", "メロンブックス", "BOOTH", "ブース", "委託", "手数料"],
    caution: "売上は手数料控除前の総額で計上、手数料を経費として別計上するのが原則。",
  },
  {
    id: "platform_fee",
    label: "プラットフォーム手数料（電子）",
    account: "支払手数料",
    description: "FANBOX、Fantia、Skeb等のプラットフォーム手数料。",
    examples: ["FANBOX手数料10%", "Fantia手数料", "Skeb手数料"],
    keywords: ["FANBOX", "Fantia", "Skeb", "pixiv", "Patreon"],
  },
  {
    id: "shipping",
    label: "送料・梱包資材",
    account: "荷造運賃",
    description: "通販で発送する際の送料、梱包材費用。",
    examples: ["クリックポスト代", "宅急便コンパクト", "プチプチ", "ダンボール"],
    keywords: ["送料", "クリックポスト", "ゆうパック", "宅急便", "梱包", "プチプチ", "ダンボール"],
  },
  {
    id: "material",
    label: "材料費・原材料費",
    account: "仕入高 または 消耗品費",
    description:
      "ハンドメイドグッズの材料、原稿執筆用の画材など。頒布物に直接関わるものは仕入高、間接的なものは消耗品費。",
    examples: ["レジン材料", "アクセサリーパーツ", "原稿用紙", "コピックインク"],
    keywords: ["レジン", "パーツ", "材料", "画材", "インク", "コピック", "原稿用紙"],
  },
  {
    id: "tool_subscription",
    label: "ツール・サブスク料金",
    account: "通信費 または 諸会費",
    description:
      "Photoshop、Clip Studio、Pixiv FANBOX (作家側ではなく利用側)、Adobe CC等。月額/年額契約のクリエイティブツール。",
    examples: ["Adobe CC", "Clip Studio Paint", "プロアカウント費用"],
    keywords: ["Adobe", "Photoshop", "Clip Studio", "クリスタ", "サブスク", "月額"],
  },
  {
    id: "reference_book",
    label: "資料費",
    account: "新聞図書費 または 取材費",
    description:
      "創作の資料となる書籍・雑誌・参考画集。明確に「資料」と説明できる範囲のみ計上。",
    examples: ["設定資料集", "技法書", "参考写真集", "解説書"],
    keywords: ["書籍", "本", "資料", "画集", "雑誌", "図書"],
    caution: "趣味目的との区別が曖昧なものはトラブルになりやすい。明確な創作関連性を記録。",
  },
  {
    id: "communication",
    label: "通信費",
    account: "通信費",
    description: "インターネット回線、スマホ代の事業利用分（按分）。",
    examples: ["プロバイダ料金", "スマホ通信費の事業按分"],
    keywords: ["プロバイダ", "回線", "通信", "スマホ", "携帯"],
    caution: "プライベート利用と按分（例: 事業利用30%）が必要。",
  },
  {
    id: "office",
    label: "事務用品費",
    account: "消耗品費",
    description: "プリンターインク、用紙、ファイル、文房具など事務消耗品。",
    examples: ["プリンターインク", "コピー用紙", "ファイル", "文房具"],
    keywords: ["インク", "用紙", "コピー", "ファイル", "文房具"],
  },
  {
    id: "tax_consult",
    label: "税理士・税務相談費用",
    account: "支払手数料",
    description:
      "税理士へのスポット相談料。事業所得として申告する場合は経費計上可能。",
    examples: ["税理士スポット相談料", "確定申告代行費用"],
    keywords: ["税理士", "相談", "申告代行"],
    caution: "報酬支払時は源泉徴収（10.21%）が必要なケースあり。",
  },
];

export function suggestCategory(input: string): ExpenseCategory[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];

  const scored = EXPENSE_CATEGORIES.map((cat) => {
    let score = 0;
    for (const kw of cat.keywords) {
      if (q.includes(kw.toLowerCase())) score += 3;
    }
    if (cat.label.toLowerCase().includes(q)) score += 2;
    for (const ex of cat.examples) {
      if (ex.toLowerCase().includes(q) || q.includes(ex.toLowerCase()))
        score += 1;
    }
    return { cat, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.cat);
}

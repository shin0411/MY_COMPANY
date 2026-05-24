export type ExpenseItem = {
  id: string;
  label: string;
  account: string;
  note?: string;
};

export type EventTemplate = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  items: ExpenseItem[];
};

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "comiket",
    name: "コミックマーケット",
    emoji: "📚",
    description:
      "夏冬コミの参加に伴う典型的な経費項目。サークル参加・遠征・搬入を含む。",
    items: [
      { id: "circle_fee", label: "サークル参加費", account: "販売促進費" },
      { id: "circlems_fee", label: "Circle.ms 会員費", account: "諸会費" },
      { id: "catalog", label: "サークルカタログ", account: "新聞図書費" },
      { id: "printing", label: "同人誌印刷費", account: "仕入高" },
      { id: "goods", label: "グッズ製造費", account: "仕入高" },
      { id: "shipping_in", label: "搬入送料（事前搬入）", account: "荷造運賃" },
      { id: "shipping_back", label: "搬出送料（残部返送）", account: "荷造運賃" },
      { id: "travel", label: "交通費（往復）", account: "旅費交通費" },
      { id: "hotel", label: "宿泊費（前泊・後泊）", account: "旅費交通費" },
      { id: "taxi", label: "会場までのタクシー", account: "旅費交通費" },
      { id: "meal", label: "差し入れ・打ち上げ代", account: "接待交際費", note: "事業関係者のみ。記録残す。" },
      { id: "supplies", label: "ブース備品（敷布・POP・お品書き等）", account: "消耗品費" },
      { id: "change", label: "釣り銭準備（経費ではない）", account: "—", note: "経費ではないが管理上記録" },
    ],
  },
  {
    id: "comitia",
    name: "コミティア",
    emoji: "🎨",
    description: "オリジナル創作中心の即売会。装飾や同人誌印刷を含む。",
    items: [
      { id: "circle_fee", label: "サークル参加費", account: "販売促進費" },
      { id: "printing", label: "同人誌印刷費", account: "仕入高" },
      { id: "supplies", label: "ブース装飾・POP", account: "消耗品費" },
      { id: "travel", label: "交通費", account: "旅費交通費" },
      { id: "shipping", label: "搬入・搬出送料", account: "荷造運賃" },
    ],
  },
  {
    id: "only",
    name: "オンリーイベント",
    emoji: "💕",
    description: "ジャンル特化のオンリーイベント参加経費。",
    items: [
      { id: "circle_fee", label: "サークル参加費", account: "販売促進費" },
      { id: "printing", label: "同人誌・グッズ製造費", account: "仕入高" },
      { id: "novelty", label: "ノベルティ製造費", account: "広告宣伝費" },
      { id: "supplies", label: "ブース備品", account: "消耗品費" },
      { id: "travel", label: "交通費", account: "旅費交通費" },
      { id: "hotel", label: "宿泊費", account: "旅費交通費" },
    ],
  },
  {
    id: "online",
    name: "オンライン頒布（BOOTH・とらのあな・メロン等）",
    emoji: "📦",
    description:
      "通販プラットフォーム経由の頒布に伴う恒常的経費。月次〜年次で集計。",
    items: [
      { id: "printing", label: "印刷費（在庫補充）", account: "仕入高" },
      { id: "shipping", label: "発送送料", account: "荷造運賃" },
      { id: "packaging", label: "梱包資材（プチプチ・封筒等）", account: "荷造運賃" },
      { id: "platform_fee", label: "BOOTH/とら/メロン手数料", account: "支払手数料" },
      { id: "platform_shipping", label: "BOOTHおまかせ梱包手数料", account: "支払手数料" },
      { id: "warehouse", label: "BOOTH倉庫保管料", account: "支払手数料" },
      { id: "trans", label: "委託先への発送料", account: "荷造運賃" },
    ],
  },
  {
    id: "digital",
    name: "デジタル販売（FANBOX・Fantia・Gumroad）",
    emoji: "💻",
    description: "デジタルコンテンツの月次サブスク・販売に伴う経費。",
    items: [
      { id: "platform_fee", label: "プラットフォーム手数料（10〜15%）", account: "支払手数料" },
      { id: "tool_sub", label: "Clip Studio / Adobe CC", account: "通信費" },
      { id: "cloud", label: "クラウドストレージ（Dropbox等）", account: "通信費" },
      { id: "reference", label: "参考資料・画集", account: "新聞図書費" },
      { id: "model", label: "3Dモデル / ブラシ素材購入", account: "消耗品費" },
    ],
  },
];

export function getEventById(id: string): EventTemplate | undefined {
  return EVENT_TEMPLATES.find((e) => e.id === id);
}

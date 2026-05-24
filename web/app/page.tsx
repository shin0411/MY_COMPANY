import Link from "next/link";

const tools = [
  {
    href: "/shiwake/",
    emoji: "📒",
    title: "経費仕訳シミュレーター",
    desc: "コミケ参加費、印刷費、委託手数料など、同人活動の経費を入力すると勘定科目を自動判定します。",
    accent:
      "from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/30 border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600",
  },
  {
    href: "/shotoku/",
    emoji: "💴",
    title: "所得税概算ツール",
    desc: "売上と経費・各種控除を入力すると、所得税・住民税の参考額を概算します。雑所得 / 事業所得の判定もガイド。",
    accent:
      "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600",
  },
  {
    href: "/checklist/",
    emoji: "✅",
    title: "イベント別経費チェックリスト",
    desc: "コミケ / コミティア / オンリー / オンライン頒布ごとに、漏れがちな経費項目をチェック。CSV出力・印刷PDF対応。",
    accent:
      "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600",
  },
  {
    href: "/qa/",
    emoji: "❓",
    title: "同人税務 Q&A データベース",
    desc: "「FANBOXの収入は？」「赤字でも申告必要？」など、同人特有の疑問40問以上を税理士監修ベースで解説。",
    accent:
      "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/30 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-600",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      <section className="text-center mb-12 md:mb-16">
        <p className="text-pink-600 dark:text-pink-400 font-medium text-sm mb-3">
          副業同人作家のための確定申告サポート
        </p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
          同人税務、<br className="md:hidden" />
          <span className="text-pink-600 dark:text-pink-400">サバイバル</span>キット
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          「経費どう仕訳けるの？」「赤字でも申告するの？」<br />
          freee を契約するほどでもない、本より深く、税理士より気軽に。<br />
          <strong className="text-zinc-900 dark:text-zinc-100">4つのツールで確定申告を1日で終わらせる。</strong>
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
          <span aria-hidden>🔒</span>
          入力データはブラウザ内完結、サーバ送信ゼロ
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`block rounded-2xl p-6 bg-gradient-to-br border-2 transition-all hover:shadow-md ${t.accent}`}
          >
            <div className="text-3xl mb-2">{t.emoji}</div>
            <h2 className="text-lg font-bold mb-2">{t.title}</h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{t.desc}</p>
            <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              ツールを開く →
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-16 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="font-bold mb-3">使い方</h2>
        <ol className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-decimal list-inside">
          <li>
            まずは <strong>イベント別チェックリスト</strong> で領収書の取りこぼしがないか確認
          </li>
          <li>
            <strong>経費仕訳シミュレーター</strong> で各支出の勘定科目を判定
          </li>
          <li>
            <strong>所得税概算ツール</strong> で納税額の目処を立てる
          </li>
          <li>
            判断に迷ったら <strong>Q&amp;A データベース</strong> を検索
          </li>
        </ol>
      </section>

      <section className="mt-8 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
        <h2 className="font-bold mb-2 text-amber-900 dark:text-amber-300">⚠️ ご利用上の注意</h2>
        <ul className="text-sm text-amber-900 dark:text-amber-200 space-y-1 list-disc list-inside">
          <li>
            すべての計算結果は <strong>参考値</strong> です。実際の申告は税務署または税理士の指導のもとで行ってください。
          </li>
          <li>2026年度の税制を前提としています。改正対応は順次反映します。</li>
          <li>個別の税務相談はお受けできません。</li>
        </ul>
      </section>
    </div>
  );
}

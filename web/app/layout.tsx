import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "同人税務サバイバルキット 2026 | 副業同人作家のための無料確定申告ツール",
  description:
    "副業同人作家のための確定申告サポート無料ツール。経費仕訳・所得税概算・税務Q&A・イベント別チェックリストの4機能。データはブラウザ内完結、サーバ送信ゼロ、登録不要、広告なし。",
  keywords: [
    "同人作家",
    "確定申告",
    "FANBOX",
    "Fantia",
    "Skeb",
    "BOOTH",
    "コミケ",
    "経費",
    "青色申告",
    "税務",
  ],
  openGraph: {
    title: "同人税務サバイバルキット 2026",
    description: "副業同人作家のための無料確定申告サポートツール。仕訳・所得税概算・Q&A・経費チェックリスト。",
    type: "website",
    locale: "ja_JP",
  },
};

const themeInitScript = `
  try {
    var t = localStorage.getItem('theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${notoJP.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="no-print border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-pink-600 dark:text-pink-400">同人</span>税務
              <span className="text-zinc-400 dark:text-zinc-500 text-sm font-normal ml-2">
                サバイバルキット 2026
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <nav className="flex gap-1 text-sm">
                <NavLink href="/shiwake/">仕訳</NavLink>
                <NavLink href="/shotoku/">所得税</NavLink>
                <NavLink href="/checklist/">チェックリスト</NavLink>
                <NavLink href="/qa/">Q&amp;A</NavLink>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <p>
              本サービスは情報提供を目的とした<strong>参考値</strong>を表示するものであり、税理士法上の税務代理・税務相談には該当しません。
              個別の判断は必ず税理士・税務署にご相談ください。本計算結果による損害について一切の責任を負いません。
            </p>
            <p>
              入力データはお使いのブラウザ内のみで処理され、外部サーバには一切送信されません。
            </p>
            <p>
              関連リンク:
              <a
                href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/index.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline hover:text-pink-600 dark:hover:text-pink-400"
              >
                国税庁タックスアンサー
              </a>
            </p>
            <p className="pt-2">
              &copy; 2026 同人税務サバイバルキット — MIT License
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md hover:bg-pink-50 dark:hover:bg-pink-950 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
    >
      {children}
    </Link>
  );
}

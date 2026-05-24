import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "同人税務サバイバルキット 2026",
  description:
    "副業同人作家のための確定申告サポートツール。経費仕訳・所得税概算・税務Q&A・イベント別チェックリストを無料で。データはブラウザ内完結、サーバ送信ゼロ。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${notoJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-pink-600">同人</span>税務
              <span className="text-zinc-400 text-sm font-normal ml-2">
                サバイバルキット 2026
              </span>
            </Link>
            <nav className="flex gap-1 text-sm">
              <NavLink href="/shiwake/">仕訳</NavLink>
              <NavLink href="/shotoku/">所得税</NavLink>
              <NavLink href="/checklist/">チェックリスト</NavLink>
              <NavLink href="/qa/">Q&amp;A</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-white py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 text-xs text-zinc-500 space-y-1">
            <p>
              本サービスは情報提供を目的とした<strong>参考値</strong>を表示するものであり、税務代理行為や税務相談には該当しません。
              個別の判断は必ず税理士にご相談ください。
            </p>
            <p>
              入力データはお使いのブラウザ内のみで処理され、外部サーバには一切送信されません。
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
      className="px-3 py-1.5 rounded-md hover:bg-pink-50 hover:text-pink-700 transition-colors"
    >
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Formula 1 api",
  description:
    "This is the website for the (unofficial) Formula 1 api. Race results, practice results, qualifying, starting grids... from 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <header className="border-b border-neutral-700">
        <div className="py-6 px-4">
          <Link href="/" className="text-xl font-bold text-white">
            Formula 1 api
          </Link>
        </div>
      </header>
      <div>{children}</div>
    </main>
  );
}

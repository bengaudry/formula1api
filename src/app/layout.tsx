import type { Metadata } from "next";
import NextLink from "next/link"
import { Inter } from "next/font/google";
import "./globals.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={inter.className + " text-zinc-100 bg-zinc-950"}>
        <header className="border-b border-zinc-700">
          <div className="py-6 px-4 flex flex-row items-center justify-between">
            <NextLink href="/" className="flex flex-row items-center gap-2 text-lg">
              <div className="w-8 sm:w-10 md:w-12 aspect-square bg-red-500 rounded-md" />
              <span className="inline-block sm:hidden text-zinc-400">F1 api</span>
              <span className="hidden sm:inline-block md:hidden text-zinc-400">
                F1 (unofficial) api
              </span>
              <span className="hidden md:inline-block text-zinc-400">
                Formula 1 (unofficial) api
              </span>
            </NextLink>
            <div className="flex flex-row items-center gap-2">
              <Link
                href="/search"
                variant="secondary"
                className="aspect-square md:aspect-auto flex flex-row items-center gap-2"
              >
                <Icon name="search" />
                <span className="hidden md:inline-block">Search</span>
              </Link>
              <NavMenu />
            </div>
          </div>
        </header>
        <main className="px-2 py-4 max-w-screen-xl mx-auto">{children}</main>
      </body>
    </html>
  );
}

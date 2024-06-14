import NextLink from "next/link";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-zinc-700 sticky top-0 bg-zinc-950/50 backdrop-blur-lg">
        <div className="py-6 px-4 flex flex-row items-center justify-between">
          <NextLink
            href="/"
            className="flex flex-row items-center gap-2 text-lg"
          >
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
              href="/admin"
              variant="outline"
              className="aspect-square md:aspect-auto flex flex-row items-center gap-2"
            >
              <Icon name="admin" />
              <span className="hidden md:inline-block">Admin</span>
            </Link>
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
    </>
  );
}

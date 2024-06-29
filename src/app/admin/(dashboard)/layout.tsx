"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export default ({ children }: { children: React.ReactNode }) => {
  const links: Array<{ name: string; href: string; external?: boolean }> = [
    { name: "Overview", href: "/" },
    { name: "Drivers", href: "/drivers" },
    { name: "Teams", href: "/teams" },
    { name: "Run crawler", href: "/run-crawler" },
    {
      name: "Vercel storage",
      href: "https://vercel.com/ben-gaudrys-projects/formula1api/stores/blob/store_7RhYN72GJ1eLxnGF/browser",
      external: true,
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <header className="border-b py-4 border-zinc-700 bg-zinc-900">
        <h2 className="text-lg font-medium px-4">Dashboard</h2>
        <div className="mt-2 flex overflow-x-scroll px-4">
          {links.map(({ name, href, external }) => {
            const active =
              pathname === `/admin${href}` ||
              (href === "/" && pathname === "/admin");

            return (
              <Link
                href={external ? href : `/admin${href}`}
                className={`
                  hover:bg-zinc-800 hover:text-white ${
                    active ? "text-white" : "text-zinc-500"
                  } whitespace-nowrap transition-colors px-3 py-1 rounded-md text-sm`}
                target={external ? "_blank" : "_self"}
              >
                {name}
                {external && (
                  <Icon
                    name="exit"
                    className="inline-block translate-y-0.5 ml-4 text-sm"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="p-4 w-full h-full overflow-y-scroll">{children}</main>
    </div>
  );
};

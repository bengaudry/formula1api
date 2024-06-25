"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default ({ children }: { children: React.ReactNode }) => {
  const links = [
    { name: "Overview", href: "/" },
    { name: "Drivers", href: "/drivers" },
    { name: "Teams", href: "/teams" },
    { name: "Run crawler", href: "/run-crawler" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex flex-row items-center w-screen h-screen overflow-hidden">
      <aside className="h-full w-72 border-r py-4 border-zinc-800">
        <h2 className="text-lg font-medium px-4">Dashboard</h2>
        <div className="mt-4 flex flex-col pr-4">
          {links.map(({ name, href }) => {
            const active = pathname === `/admin${href}`;
            return (
              <Link
                href={`/admin${href}`}
                className={`${
                  active ? "bg-blue-800/80" : "bg-transparent hover:bg-zinc-100/10"
                } block w-full h-fit px-4 py-1 rounded-r-full transition-colors border-2 border-transparent`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </aside>
      <main className="p-4 w-full h-full overflow-y-scroll">{children}</main>
    </div>
  );
};

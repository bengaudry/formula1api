import { Link } from "@/components/ui/button";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center w-screen h-screen overflow-hidden">
      <aside className="h-full w-72 border-r p-4 border-zinc-800">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/admin/dashboard" variant="outline" className="w-full">
            Overview
          </Link>
          <Link
            href="/admin/dashboard/drivers"
            variant="outline"
            className="w-full"
          >
            Drivers
          </Link>
          <Link
            href="/admin/dashboard/teams"
            variant="outline"
            className="w-full"
          >
            Teams
          </Link>
          <Link
            href="/admin/dashboard/explorer"
            variant="outline"
            className="w-full"
          >
            Explorer
          </Link>
          <Link
            href="/admin/dashboard/run-crawler"
            variant="outline"
            className="w-full"
          >
            Run crawler
          </Link>
        </div>
      </aside>
      <main className="p-4 w-full h-full overflow-y-scroll">{children}</main>
    </div>
  );
};

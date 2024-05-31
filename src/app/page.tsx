import { Link } from "@/components/ui/button";

export default () => (
  <div>
    <header className="fixed w-full inset-0 bottom-auto border-b border-b-zinc-800">
      <div className="max-w-screen-lg mx-center py-3 px-6 h-20 flex items-center">
        <div className="flex items-center gap-2">
          <span className="block w-10 aspect-square bg-red-500 shadow-inner shadow-black/50 rounded-md" />
          <span className="text-lg font-medium">
            Formula 1 (unofficial) API
          </span>
        </div>
      </div>
    </header>

    <main className="pt-28 px-4">
      <h3 className="text-2xl font-semibold mb-2">Api playground</h3>
      <div className="flex flex-col gap-2 max-w-48">
          <Link href="/playground/search" variant="outline">Search -&gt;</Link>
          <Link href="/playground/race-results">Race results -&gt;</Link>
          <Link href="/playground/sprint-results">Sprint results -&gt;</Link>
          <Link href="/playground/compare">Compare results -&gt;</Link>
      </div>
    </main>
    {/* <RaceResults /> */}
  </div>
);

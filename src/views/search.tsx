"use client";
import Link from "next/link";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Search() {
  const [query, setQuery] = useState("");
  const { data, fetchData, isLoading, requestDuration } = useFetch<{
    id: number;
    href: string;
    location: string;
    sprint: boolean;
    images: Array<string>;
    start_date: string;
    end_date: string;
    month: string;
    isOver: boolean;
    gp_name: string;
  }>();

  return (
    <div>
      <form
        className="flex flex-row items-center justify-center py-4 gap-2 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          fetchData(`/api/find-grand-prix?year=2024&query=${query}`);
        }}
      >
        <Input
          placeholder="Location (try china, miami, imola...)"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
        <Button type="submit" disabled={query.length < 3 || isLoading}>
          {isLoading ? "..." : "Search"}
        </Button>
      </form>

      {data && !isLoading && (
        <div className="px-4">
          <span className="text-zinc-400 text-sm">
            Found in {requestDuration / 1000} s
          </span>
          <Link
            href={`/playground/race-results?year=${2024}&location=${
              data.location
            }`}
            target="_blank"
            className="block bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 rounded-md px-6 py-3"
          >
            <span className="text-lg font-semibold">{data.gp_name}</span>
            <br />
            <span className="capitalize text-zinc-400">
              {data.start_date}-{data.end_date} {data.month}
            </span>
            <br />
            <span className="capitalize text-zinc-400">{data.location}</span>
            {data.sprint && (
              <span className="block bg-zinc-700 w-fit px-4 py-1 rounded-full mt-2">
                Sprint
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

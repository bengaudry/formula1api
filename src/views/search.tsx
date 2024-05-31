"use client";
import { TextInput } from "@/components/form/input";
import Link from "next/link";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

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
        <TextInput
          placeholder="Location (try china, miami, imola...)"
          value={query}
          onChange={({ target }) => setQuery(target.value)}
        />
        <button
          className="bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 py-2 px-4 rounded-md"
          type="submit"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <span className="block text-center text-neutral-400 mx-auto">
          Loading...
        </span>
      )}

      {data ? (
        <div className="px-4">
          <span className="text-neutral-400 text-sm">
            Found in {requestDuration / 1000} s
          </span>
          <Link
            href={data.href}
            target="_blank"
            className="block bg-neutral-800 rounded-xl px-6 py-3"
          >
            <span className="text-lg font-semibold">{data.gp_name}</span>
            <br />
            <span className="capitalize text-neutral-400">
              {data.start_date}-{data.end_date} {data.month}
            </span>
            <br />
            <span className="capitalize text-neutral-400">{data.location}</span>
            {data.sprint && (
              <span className="block bg-neutral-700 w-fit px-4 py-1 rounded-full mt-2">
                Sprint
              </span>
            )}
          </Link>
        </div>
      ) : (
        !isLoading && (
          <span className="text-center text-neutral-400 block mx-auto">
            No data found
          </span>
        )
      )}
    </div>
  );
}

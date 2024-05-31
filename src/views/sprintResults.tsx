"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SprintResults() {
  const params = useSearchParams();
  const query = params.get("query") ?? null;

  const [data, setData] = useState<
    RaceResults | null | { isOver: false; name: string }
  >(null);
  const [selectedLocation, setSelectedLocation] = useState(query ?? "china");
  const [selectedYear, setSelectedYear] = useState(2024);

  async function fetchSeasonStructure(year: number) {
    const response = await fetch(`/api/season-structure?year=${year}`);
    if (!response.ok) throw new Error("Failed to fetch season structure");
    return response.json();
  }

  async function fetchRaceResults(year: number, location: string) {
    const response = await fetch(
      `/api/weekend-data/sprint-results?year=${year}&location=${location}`
    );
    if (!response.ok) throw new Error("Failed to fetch race results");
    return response.json();
  }

  async function getRaceData() {
    try {
      const seasonStructure: SeasonStructure = await fetchSeasonStructure(
        selectedYear
      );

      const fLocation = selectedLocation.toLowerCase().replaceAll(" ", "-");

      const weekend = seasonStructure.grands_prix.find(({ keywords }) =>
        keywords.includes(fLocation)
      );

      if (!weekend) throw new Error("Location not found");

      if (weekend.isOver) {
        const raceResults = await fetchRaceResults(
          selectedYear,
          weekend.location
        );
        if ("error" in raceResults) throw new Error(raceResults.error);
        setData(raceResults);
      } else
        setData({
          isOver: weekend.isOver,
          name: weekend.location.replaceAll("-", " "),
        });
    } catch (error) {
      setData(null);
    }
  }

  useEffect(() => {
    getRaceData();
  }, []);

  return (
    <div className="py-6">
      <div className="w-full flex justify-center items-center my-4 gap-2 px-6">
        <Input
          placeholder="Location (try china, miami...)"
          value={selectedLocation}
          onChange={({ target }) => setSelectedLocation(target.value)}
          onBlur={getRaceData}
        />
        <Select onValueChange={(val) => setSelectedYear(parseInt(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024" defaultChecked>
              2024
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!data || "isOver" in data ? (
        <p className="text-center">
          {!data ? (
            <>
              This session does not exist in our database. Maybe it is not a
              sprint weekend format.
              <br />
              Try{" "}
              <Link
                href={`/playground/race-results?query=${selectedLocation}`}
                className="underline"
              >
                race results api
              </Link>
            </>
          ) : (
            <>
              The results for <span className="capitalize">{data?.name}</span>{" "}
              are not available yet
            </>
          )}
        </p>
      ) : (
        <>
          <header className="py-3 px-6 text-center">
            <h1 className="text-2xl font-bold max-w-screen-md mx-auto overflow-visible">
              {data?.session_name}
            </h1>
            <p className="text-zinc-400">{data?.circuit}</p>
          </header>

          <ul className="max-w-screen-md mx-auto px-2">
            {data?.results.map(
              (
                { position, car, teamColor, driver, laps, points, time },
                idx
              ) => (
                <li
                  key={idx}
                  className={`grid grid-cols-12 gap-2 ${
                    idx % 2 === 0 ? "bg-zinc-800" : ""
                  } px-4 py-1 rounded-md`}
                >
                  <span className="col-span-1 md:col-span-1">
                    {position ?? "-"}
                  </span>
                  <span
                    className="col-span-2 md:col-span-1 flex items-center"
                    title={`${driver.firstName} ${driver.lastName}`}
                  >
                    <span
                      className={`inline-block h-full w-2 rounded-full mr-1`}
                      style={{ backgroundColor: teamColor }}
                    />
                    {driver.abbr}
                  </span>
                  <span className="hidden md:inline-block md:col-span-5 whitespace-nowrap overflow-hidden">
                    {car}
                  </span>
                  <span className="col-span-5 md:col-span-3 whitespace-nowrap overflow-hidden">
                    {time}
                  </span>
                  <span className="col-span-2 md:col-span-1">{laps}</span>
                  <span className="col-span-2 md:col-span-1">
                    {points > 0 && "+"}
                    {points}
                  </span>
                </li>
              )
            )}
          </ul>
        </>
      )}
    </div>
  );
}

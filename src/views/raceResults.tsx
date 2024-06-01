"use client";
import { RaceResultsDisplayer } from "@/components/playground";
import { Input } from "@/components/ui/input";
import { YearSelector } from "@/components/YearSelector";
import { useFetch } from "@/hooks/useFetch";
import {
  fetchRaceResults,
  fetchSeasonStructure,
} from "@/lib/playground/common";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SprintLink = ({
  weekendDetails,
  location,
}: {
  weekendDetails: any;
  location?: string;
}) => (
  <>
    {weekendDetails.sprint && (
      <Link
        href={
          location
            ? `/playground/sprint-results?query=${location}`
            : "/playground/sprint-results"
        }
        className="text-center mx-auto underline w-full"
      >
        See sprint results
      </Link>
    )}
  </>
);

export function RaceResults() {
  const params = useSearchParams();
  const query = params.get("query") ?? null;

  const [selectedLocation, setSelectedLocation] = useState<string>(query ?? "");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [weekendDetails, setWeekendDetails] = useState<any>(null);
  const { data, fetchData, isLoading, error } = useFetch<RaceResults>();

  async function getRaceData() {
    try {
      const seasonStructure: SeasonStructure = await fetchSeasonStructure(
        parseInt(selectedYear)
      );

      const fLocation = selectedLocation.toLowerCase().replaceAll(" ", "-");

      const weekend = seasonStructure.grands_prix.find(({ keywords }) =>
        keywords.includes(fLocation)
      );

      if (!weekend) throw new Error("Location not found");
      setWeekendDetails(weekend);
      fetchData(
        `/api/weekend-data/${
          weekend.sprint ? "sprint" : "race"
        }-results?year=${selectedYear}&location=${weekend.location}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRaceData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold">Race results</h2>
      <div className="w-full flex justify-center items-center my-4 gap-2">
        <Input
          type="text"
          placeholder="Location (try monaco, imola...)"
          value={selectedLocation}
          onChange={({ target }) => setSelectedLocation(target.value)}
          onBlur={getRaceData}
        />
        <YearSelector year={selectedYear} onChangeYear={setSelectedYear} />
      </div>
      {JSON.stringify(error)}
      {!data || error ? (
        <p className="text-center text-zinc-400">
          {weekendDetails && !weekendDetails.isOver ? (
            <p>
              {weekendDetails.gp_name ?? "This session"} has not happened yet.
              <span className="block mt-1">
                Date : {weekendDetails.start_date}-{weekendDetails.end_date}/
                {weekendDetails.month}
              </span>
            </p>
          ) : (
            query &&
            query.length > 0 &&
            "This session does not exist in our database"
          )}
        </p>
      ) : (
        <>
          <header className="py-3 text-center">
            <h1 className="text-2xl font-bold overflow-visible">
              {data?.session_name}
            </h1>
            <p className="text-zinc-400">{data?.circuit}</p>
            <SprintLink
              weekendDetails={weekendDetails}
              location={weekendDetails?.location}
            />
          </header>
          {data && !("isOver" in data) && <RaceResultsDisplayer data={data} />}
        </>
      )}
    </>
  );
}

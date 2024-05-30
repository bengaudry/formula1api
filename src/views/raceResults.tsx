"use client";
import { RaceResultsDisplayer } from "@/components/playground";
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

  const [data, setData] = useState<
    RaceResults | null | { isOver: false; name: string }
  >(null);
  const [selectedLocation, setSelectedLocation] = useState(query ?? "monaco");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [wekeendDetails, setWeekendDetails] = useState<any>(null);

  async function getRaceData() {
    try {
      const seasonStructure: SeasonStructure = await fetchSeasonStructure(
        selectedYear
      );

      const fLocation = selectedLocation.toLowerCase().replaceAll(" ", "-");

      const weekend = seasonStructure.weekends.find(({ keywords }) =>
        keywords.includes(fLocation)
      );

      if (!weekend) throw new Error("Location not found");
      setWeekendDetails(weekend);
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
        <input
          type="text"
          placeholder="Location (try monaco, imola...)"
          value={selectedLocation}
          onChange={({ target }) => setSelectedLocation(target.value)}
          onBlur={getRaceData}
          className="bg-black border border-neutral-600 rounded-md px-4 py-2 w-full max-w-96"
        />
        <select className="bg-neutral-800 rounded-md py-2 px-6">
          <option selected>2024</option>
        </select>
      </div>
      {!data || "isOver" in data ? (
        <p className="text-center">
          {!data ? (
            "This session does not exist in our database"
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
            <p className="text-neutral-400">{data?.circuit}</p>
            <SprintLink
              weekendDetails={wekeendDetails}
              location={wekeendDetails?.location}
            />
          </header>
          {data && !("isOver" in data) && <RaceResultsDisplayer data={data} />}
        </>
      )}
    </div>
  );
}

"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Container, Section, Bar } from "@column-resizer/react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YearSelector } from "@/components/YearSelector";

function ResizableColumnsContainer({
  location,
  year,
}: {
  location?: string;
  year?: string;
}) {
  const [fp1Data, setfp1Data] = useState<FreePractice | null>(null);
  const [fp2Data, setfp2Data] = useState<FreePractice | null>(null);
  const [fp3Data, setfp3Data] = useState<FreePractice | null>(null);
  const [qualifyingData, setQualifyingData] = useState<Qualifying | null>(null);

  const [showTeams, setShowTeams] = useState(false);
  const [yearQuery, setYearQuery] = useState(year);
  const [locationQuery, setLocationQuery] = useState(location);

  useEffect(() => {
    function fetchData<T>(
      apiName: string,
      callback: Dispatch<SetStateAction<T | null>>
    ) {
      fetch(
        `/api/weekend-data/${apiName}?year=${yearQuery}&location=${locationQuery
          ?.toLowerCase()
          .replaceAll(" ", "-")}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((json) => {
          console.log("data :", json);
          callback(json as T);
        })
        .catch((err) => {
          console.error(err);
          callback(null);
          return;
        });
    }
    fetchData("fp1-results", setfp1Data);
    fetchData("fp2-results", setfp2Data);
    fetchData("fp3-results", setfp3Data);
    fetchData("race-qualifying", setQualifyingData);
  }, [locationQuery, yearQuery]);

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <label className="flex flex-row items-center text-zinc-400 gap-2 w-fit">
          <span>Show teams</span>
          <Checkbox
            onCheckedChange={(c) => setShowTeams(c as boolean)}
            checked={showTeams}
          />
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={locationQuery}
            onChange={({ target }) => setLocationQuery(target.value)}
          />
          <YearSelector year={yearQuery} onChangeYear={setYearQuery} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] overflow-x-auto">
          <Container className="w-full border border-zinc-700 rounded-lg overflow-hidden">
            <Section minSize={50}>
              <ul className="flex flex-col w-full h-max whitespace-nowrap">
                <li className="px-2 py-1 bg-zinc-700">Practice 1</li>
                {fp1Data?.results?.map(
                  ({ car, driver, position, teamColor, time }) => (
                    <li className="flex flex-row items-center gap-1 whitespace-nowrap px-2">
                      <div>
                        <span
                          className="inline-block h-5 w-2 mr-1 rounded-full"
                          style={{ backgroundColor: teamColor }}
                        />
                        {driver.abbr}
                      </div>
                      {time} {showTeams && <>- {car}</>}
                    </li>
                  )
                )}
              </ul>
            </Section>
            <Bar
              size={5}
              className="bg-zinc-500 hover:bg-zinc-300 hover:scale-x-150 transition-all duration-150"
              style={{ cursor: "e-resize" }}
            />
            <Section minSize={100}>
              <ul className="flex flex-col w-full h-max whitespace-nowrap">
                <li className="px-2 py-1 bg-zinc-700">Practice 2</li>
                {fp2Data?.results?.map(
                  ({ car, driver, position, teamColor, time }) => (
                    <li className="flex flex-row items-center gap-1 whitespace-nowrap px-2">
                      <div>
                        <span
                          className="inline-block h-5 w-2 mr-1 rounded-full"
                          style={{ backgroundColor: teamColor }}
                        />
                        {driver.abbr}
                      </div>
                      {time} {showTeams && <>- {car}</>}
                    </li>
                  )
                )}
              </ul>
            </Section>
            <Bar
              size={5}
              className="bg-zinc-500 hover:bg-zinc-300 hover:scale-x-150 transition-all duration-150"
              style={{ cursor: "e-resize" }}
            />
            <Section minSize={100}>
              <ul className="flex flex-col w-full h-max whitespace-nowrap">
                <li className="px-2 py-1 bg-zinc-700">Practice 3</li>
                {fp3Data?.results?.map(
                  ({ car, driver, position, teamColor, time }) => (
                    <li className="flex flex-row items-center gap-1 whitespace-nowrap px-2">
                      <div>
                        <span
                          className="inline-block h-5 w-2 mr-1 rounded-full"
                          style={{ backgroundColor: teamColor }}
                        />
                        {driver.abbr}
                      </div>
                      {time} {showTeams && <>- {car}</>}
                    </li>
                  )
                )}
              </ul>
            </Section>
            <Bar
              size={5}
              className="bg-zinc-500 hover:bg-zinc-300 hover:scale-x-150 transition-all duration-150"
              style={{ cursor: "e-resize" }}
            />
            <Section minSize={100}>
              <ul className="flex flex-col w-full h-max whitespace-nowrap">
                <li className="px-2 py-1 bg-zinc-700">Qualifying</li>
                {qualifyingData?.results?.map(
                  ({ car, driver, position, teamColor, times }) => (
                    <li className="flex flex-row items-center gap-1 whitespace-nowrap px-2">
                      <div>
                        <span
                          className="inline-block h-5 w-2 mr-1 rounded-full"
                          style={{ backgroundColor: teamColor }}
                        />
                        {driver.abbr}
                      </div>
                      {times.q3 ?? times.q2 ?? times.q1 ?? "No time"}{" "}
                      {showTeams && <>- {car}</>}
                    </li>
                  )
                )}
              </ul>
            </Section>
          </Container>
        </div>
      </div>
    </>
  );
}

export function WeekendTimes() {
  const params = useSearchParams();
  const location = params.get("location");
  const year = params.get("year");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparative times table</h1>
      <ResizableColumnsContainer
        location={location ?? undefined}
        year={year ?? undefined}
      />
    </div>
  );
}

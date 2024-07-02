import { extractDriverInfo, parseUrlContent } from "../lib/common";
import { writeData } from "../lib/export";
import { URL_BASE } from "../lib/constants";

interface RaceResult {
  position: number | null;
  driver: Driver;
  car: string;
  laps: number;
  time: string;
  points: number;
}

interface Params {
  year: number | string;
  id: string;
  location: string;
  isSprint?: boolean;
}

export async function fetchRaceResults({
  year,
  id,
  location,
  isSprint,
}: Params) {
  try {
    const url = `${URL_BASE}/${year}/races/${id}/${location}/${
      isSprint ? "sprint-results" : "race-result"
    }.html`;

    console.info("[results.ts] -> Fetching ", url);

    const { $, sessionName, circuit, tableRows } = await parseUrlContent(url);

    const sprintInSessName = sessionName.toLocaleLowerCase().includes("sprint");
    console.info(sessionName, sprintInSessName, isSprint);
    if (!sprintInSessName && isSprint)
      return { error: "No sprint results found" };
    if (sprintInSessName && !isSprint)
      return { error: "Race results are not available yet" };

    const results: RaceResult[] = [];

    tableRows.each((_, row) => {
      const rawPosition = $(row).find("td:nth-child(2)").text().trim();
      const position = rawPosition === "NC" ? null : parseInt(rawPosition);
      const number = parseInt($(row).find("td:nth-child(3)").text().trim(), 10);
      const rawDriver = $(row)
        .find("td:nth-child(4)")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const driver = { ...extractDriverInfo(rawDriver), number };
      const car = $(row).find("td:nth-child(5)").text().trim();
      const laps = parseInt($(row).find("td:nth-child(6)").text().trim());
      const time = $(row).find("td:nth-child(7)").text().trim();
      const points = parseInt($(row).find("td:nth-child(7)").text().trim());

      results.push({
        position,
        driver,
        car,
        laps,
        time,
        points,
      });
    });

    console.info("[results.ts] -> Writing data with url ", url);

    await writeData(results, {
      id,
      dataType: `${isSprint ? "sprint" : "race"}-results`,
      year,
      url,
      sessionName,
      circuit,
      location,
      fileName: `${isSprint ? "sprint" : "race"}_results`,
    });
    return results;
  } catch (error) {
    console.error("Error in crawler `results.ts` :", error);
    return { error };
  }
}

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
      isSprint ? "sprint-qualifying" : "qualifying"
    }.html`;

    const { $, sessionName, circuit, tableRows } = await parseUrlContent(url);

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

    writeData(results, {
      id,
      dataType: `${isSprint ? "sprint" : "race"}-results`,
      year,
      sessionName,
      circuit,
      location,
      fileName: `${isSprint ? "sprint" : "race"}_results`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

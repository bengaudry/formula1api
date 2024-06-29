import {
  extractDriverInfo,
  findSessionInfo,
  getTeamColor,
  parseUrlContent,
} from "../lib/common";
import { writeData } from "../lib/export";
import { URL_BASE } from "../lib/constants";

interface QualifyingResult {
  position: number;
  driver: Driver;
  car: string;
  teamColor: string;
  times: { q1: string; q2: string; q3: string };
  laps: number;
}

interface Params {
  year: number | string;
  id: string;
  location: string;
  isSprint?: boolean;
}

export async function fetchQualifyingResults({
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

    const sprintInSessName = sessionName.toLocaleLowerCase().includes("sprint");
    if (!sprintInSessName && isSprint) return null;
    if (sprintInSessName && !isSprint) return null;

    const results: QualifyingResult[] = [];

    tableRows.each((_, row) => {
      const position = parseInt(
        $(row).find("td:nth-child(2)").text().trim(),
        10
      );
      const number = parseInt($(row).find("td:nth-child(3)").text().trim(), 10);
      const rawDriver = $(row)
        .find("td:nth-child(4)")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const driver = { ...extractDriverInfo(rawDriver), number };
      const car = $(row).find("td:nth-child(5)").text().trim();
      const teamColor = getTeamColor(car) ?? "";
      const times = {
        q1: $(row).find("td:nth-child(6)").text().trim() ?? null,
        q2: $(row).find("td:nth-child(7)").text().trim() ?? null,
        q3: $(row).find("td:nth-child(8)").text().trim() ?? null,
      };
      const laps = parseInt($(row).find("td:nth-child(9)").text().trim(), 10);

      results.push({ position, driver, car, teamColor, times, laps });
    });

    writeData(results, {
      id,
      dataType: isSprint ? "sprint-qualifying" : "race-qualifying",
      year,
      url,
      sessionName,
      circuit,
      location,
      fileName: `${isSprint ? "sprint" : "race"}_qualifying`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

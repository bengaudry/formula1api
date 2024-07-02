import { extractDriverInfo, parseUrlContent } from "../lib/common";
import { writeData } from "../lib/export";
import { URL_BASE } from "../lib/constants";

interface Grid {
  position: number | null;
  driver: Driver;
  car: string;
  time: string;
}

interface Params {
  year: number | string;
  id: string;
  location: string;
  isSprint?: boolean;
}

export async function fetchGrid({ year, id, location, isSprint }: Params) {
  try {
    const url = `${URL_BASE}/${year}/races/${id}/${location}/${
      isSprint ? "sprint-grid" : "starting-grid"
    }.html`;

    const { $, sessionName, circuit, tableRows } = await parseUrlContent(url);

    const sprintInSessName = sessionName.toLocaleLowerCase().includes("sprint");
    if (!sprintInSessName && isSprint)
      return { error: "No sprint results found" };
    if (sprintInSessName && !isSprint)
      return { error: "Race results are not available yet" };

    const results: Grid[] = [];

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
      const time = $(row).find("td:nth-child(6)").text().trim();

      results.push({
        position,
        driver,
        car,
        time,
      });
    });

    await writeData(results, {
      id,
      url,
      dataType: `${isSprint ? "sprint" : "race"}-grid`,
      year,
      sessionName,
      circuit,
      location,
      fileName: `${isSprint ? "sprint" : "race"}_grid`,
    });
    return results;
  } catch (error) {
    console.error("Error in crawler `grid.ts` :", error);
    return { error };
  }
}

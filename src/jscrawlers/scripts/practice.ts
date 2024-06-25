import * as cheerio from "cheerio";
import { extractDriverInfo, parseUrlContent } from "../lib/common";
import { writeData } from "../lib/export";
import { URL_BASE } from "../lib/constants";

interface PracticeResult {
  position: number;
  driver: Driver;
  car: string;
  time: string;
  gap: string;
  laps: number;
}

interface FetchPracticeParams {
  year: number | string;
  id: string;
  location: string;
  practiceNb: 1 | 2 | 3;
}

export async function fetchPracticeResults({
  year,
  id,
  location,
  practiceNb,
}: FetchPracticeParams) {
  try {
    const url = `${URL_BASE}/${year}/races/${id}/${location}/practice-${practiceNb}.html`;

    const { $, sessionName, circuit, tableRows } = await parseUrlContent(url);

    const results: PracticeResult[] = [];

    tableRows.each((_, row) => {
      const position = parseInt(
        $(row).find("td:nth-child(2)").text().trim(),
        10
      );
      const number = parseInt(
        $(row).find("td:nth-child(3)").text().trim(),
        10
      );
      const rawDriver = $(row)
        .find("td:nth-child(4)")
        .text()
        .trim()
        .replace(/\s+/g, " ");
      const driver = { ...extractDriverInfo(rawDriver), number };
      const car = $(row).find("td:nth-child(5)").text().trim();
      const time = $(row).find("td:nth-child(6)").text().trim();
      const gap = $(row).find("td:nth-child(7)").text().trim();
      const laps = parseInt(
        $(row).find("td:nth-child(8)").text().trim(),
        10
      );

      results.push({ position, driver, car, time, gap, laps });
    });

    writeData(results, {
      id,
      dataType: `fp${practiceNb}`,
      year,
      sessionName,
      circuit,
      location,
      fileName: `fp${practiceNb}_results.json`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

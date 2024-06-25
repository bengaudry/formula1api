import axios from "axios";
import * as cheerio from "cheerio";

export function cutGpName(sessionName: string): string {
  return sessionName.split(" ").slice(0, -3).join(" ");
}

export function findSessionInfo($: cheerio.CheerioAPI) {
  const sessionName = $("h1.ResultsArchiveTitle")
    .text()
    .replace(/\n/g, "")
    .replace(/ {2,}/g, " ")
    .trim();
  const circuit = $("span.circuit-info").text().trim();
  const tableRows = $("table.resultsarchive-table tbody tr");

  if (!tableRows) {
    throw new Error("Error: Unable to find table in session information.");
  }

  return {
    sessionName: sessionName.replaceAll(/\s+/g, " "),
    circuit,
    tableRows,
  };
}

export function getDriverInfo(
  $: cheerio.CheerioAPI,
  driverCol: cheerio.Element,
  carNbCol: cheerio.Element
): { firstName: string; lastName: string; abbr: string; number: number } {
  const [firstName, lastName, abbr] = $(driverCol).text().trim().split("\n");
  return {
    firstName,
    lastName,
    abbr,
    number: parseInt($(carNbCol).text().trim()),
  };
}

/**
 * Takes a driver raw name from the f1 website like "Lewis Hamilton HAM" and returns a json object with the info
 */
export function extractDriverInfo(rawDriverName: string): {
  firstName: string;
  lastName: string;
  abbr: string;
} {
  const parts = rawDriverName.split(" ");
  const abbr = parts.pop()!;
  const lastName = parts.pop()!;
  const firstName = parts.join(" ");
  return { firstName, lastName, abbr };
}

export async function parseUrlContent(url: string) {
  console.info("FETCHING URL :", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.text();
  const $ = cheerio.load(data);
  const sessInfo = findSessionInfo($);

  return { $, ...sessInfo };
}

const TEAM_COLORS = {
  Ferrari: "rgb(232,0,32)",
  "McLaren Mercedes": "rgb(255,128,0)",
  Mercedes: "rgb(39,244,210)",
  "Red Bull Racing Honda RBPT": "rgb(54,113,198)",
  "RB Honda RBPT": "rgb(102,146,255)",
  "Williams Mercedes": "rgb(100,196,255)",
  "Alpine Renault": "rgb(0,147,204)",
  "Aston Martin Aramco Mercedes": "rgb(34,153,113)",
  "Kick Sauber Ferrari": "rgb(82,226,82)",
  "Haas Ferrari": "rgb(182,186,189)",
} as const;

export function getTeamColor(team: string) {
  if (!(team in TEAM_COLORS)) return null;
  // @ts-ignore
  return TEAM_COLORS[team] || null;
}

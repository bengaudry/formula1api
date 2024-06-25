import { NextRequest, NextResponse } from "next/server";
import { fetchPracticeResults } from "@/jscrawlers/scripts/practice";
import { fetchQualifyingResults } from "@/jscrawlers/scripts/qualifying";
import { fetchGrid } from "@/jscrawlers/scripts/grid";
import { fetchRaceResults } from "@/jscrawlers/scripts/results";

function extractPracticeNb(crawlerType: Crawler) {
  if (crawlerType.startsWith("fp")) {
    const nb = parseInt(crawlerType.replace("fp", ""));
    return [1, 2, 3].includes(nb) ? (nb as 1 | 2 | 3) : undefined;
  }
  return;
}

async function fetchFullWeekend(
  { year, location, id }: { year: string; location: string; id: string },
  resolve: (val: any) => void,
  reject: (val: any) => void
) {
  Array.from<1 | 2 | 3>([1, 2, 3]).map(async (practiceNb) => {
    const practiceResults = await fetchPracticeResults({
      year,
      id,
      location,
      practiceNb,
    });
  });

  const qualiResults = await fetchQualifyingResults({ year, id, location });
  if (!qualiResults) return resolve(null);

  const gridResults = await fetchGrid({ year, id, location });
  if (!gridResults) return resolve(null);

  const raceResults = await fetchRaceResults({ year, id, location });
  if (!raceResults) return resolve(null);
}

async function fetchDataWithCrawler(
  crawler: Crawler,
  { year, location, id }: { year: string; location: string; id: string }
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (["fp1", "fp2", "fp3"].includes(crawler)) {
        const practiceNb = extractPracticeNb(crawler);
        if (!practiceNb) return reject("Practice number is not valid");

        const results = await fetchPracticeResults({
          year: year,
          id: id,
          location: location,
          practiceNb,
        });
        if (!results) return resolve(null);
        return resolve(results);
      }

      if (["sprint-qualifying", "race-qualifying"].includes(crawler)) {
        const results = await fetchQualifyingResults({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      }

      if (["race-grid", "sprint-grid"].includes(crawler)) {
        const results = await fetchGrid({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      }

      if (["race-results", "sprint-results"].includes(crawler)) {
        const results = await fetchRaceResults({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      }

      if (crawler === "full-weekend") {
        await fetchFullWeekend({ year, id, location }, resolve, reject);
        return resolve("Generated data successfully");
      }

      throw new Error("Invalid crawler");
    } catch (err) {
      reject(err);
    }
  });
}

// Fonction pour gérer les requêtes POST
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const crawlerType = params.get("crawler") as Crawler | undefined;
    const year = params.get("year");
    const location = params.get("location");
    const id = params.get("id");

    if (!crawlerType || !year || !location || !id) {
      return NextResponse.json(
        {
          error: "Missing parameters (expected : year, location, id, crawler)",
        },
        { status: 400 }
      );
    }

    const results = await fetchDataWithCrawler(crawlerType, {
      year,
      location,
      id,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchPracticeResults } from "@/crawlers/scripts/practice";
import { fetchQualifyingResults } from "@/crawlers/scripts/qualifying";
import { fetchGrid } from "@/crawlers/scripts/grid";
import { fetchRaceResults } from "@/crawlers/scripts/results";

const extractPracticeNb = (crawlerType: Crawler) => {
  if (crawlerType.startsWith("fp")) {
    const nb = parseInt(crawlerType.replace("fp", ""));
    return [1, 2, 3].includes(nb) ? (nb as 1 | 2 | 3) : undefined;
  }
  return;
};

async function fetchFullWeekend(params: {
  year: string;
  location: string;
  id: string;
}) {
  Array.from<1 | 2 | 3>([1, 2, 3]).map(
    (practiceNb) =>
      new Promise(async (_, reject) => {
        const practiceResults = await fetchPracticeResults({
          ...params,
          practiceNb,
        });
        if (!practiceResults) reject();
      })
  );

  const qualiResults = await fetchQualifyingResults(params);
  if (!qualiResults) return;

  const gridResults = await fetchGrid(params);
  if (!gridResults) return;

  const raceResults = await fetchRaceResults(params);
  if (!raceResults) return;
}

async function fetchSprintWeekend(params: {
  year: string;
  location: string;
  id: string;
}): Promise<{ error: string } | undefined> {
  // Practice session data
  const practiceResults = await fetchPracticeResults({
    ...params,
    practiceNb: 1,
  });
  if (!practiceResults) return { error: `Practice 1 data not found` };

  // Sprint data
  const sprintQualiResults = await fetchQualifyingResults({
    ...params,
    isSprint: true,
  });
  if (!sprintQualiResults) return { error: `Sprint qualifying data not found` };

  const sprintGridResults = await fetchGrid({
    ...params,
    isSprint: true,
  });
  if (!sprintGridResults) return { error: `Sprint grid not found` };

  const sprintResults = await fetchRaceResults({
    ...params,
    isSprint: true,
  });
  if (!sprintResults) return { error: `Sprint results not found` };

  // Race data
  const qualiResults = await fetchQualifyingResults(params);
  if (!qualiResults) return { error: `Race qualifying data not found` };

  const gridResults = await fetchGrid(params);
  if (!gridResults) return { error: `Race grid not found` };

  const raceResults = await fetchRaceResults(params);
  if (!raceResults) return { error: `Race results not found` };
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
      } else if (["sprint-qualifying", "race-qualifying"].includes(crawler)) {
        const results = await fetchQualifyingResults({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      } else if (["race-grid", "sprint-grid"].includes(crawler)) {
        const results = await fetchGrid({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      } else if (["race-results", "sprint-results"].includes(crawler)) {
        const results = await fetchRaceResults({
          year: year,
          id: id,
          location: location,
          isSprint: crawler.split("-")[0] === "sprint",
        });
        if (!results) return resolve(null);
        return resolve("Generated data successfully");
      } else if (crawler === "full-weekend") {
        const data = await fetchFullWeekend({ year, id, location });
        // if (data && "error" in data) return resolve(data.error);
        return resolve("Generated data successfully");
      } else if (crawler === "sprint-weekend") {
        const data = await fetchSprintWeekend({ year, id, location });
        if (data && "error" in data) return resolve(data.error);
        return resolve("Generated data successfully");
      } else reject("Crawler is not valid.");
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
      { error: "Internal server err", details: error },
      { status: 500 }
    );
  }
}

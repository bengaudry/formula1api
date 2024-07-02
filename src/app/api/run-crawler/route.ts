import { NextRequest, NextResponse } from "next/server";
import {
  fetchPracticeResults,
  fetchQualifyingResults,
  fetchGrid,
  fetchRaceResults,
} from "@/crawlers/scripts";

const extractPracticeNb = (crawlerType: string): 1 | 2 | 3 | undefined => {
  const practiceNb = parseInt(crawlerType.replace("fp", ""));
  return [1, 2, 3].includes(practiceNb) ? (practiceNb as 1 | 2 | 3) : undefined;
};

const fetchFullWeekend = async ({
  year,
  location,
  id,
}: {
  year: string;
  location: string;
  id: string;
}) => {
  for (const practiceNb of [1, 2, 3] as const) {
    const practiceResults = await fetchPracticeResults({
      year,
      location,
      id,
      practiceNb,
    });
    if (!Array.isArray(practiceResults) && "error" in practiceResults)
      throw new Error(practiceResults.error as string);
  }

  const qualiResults = await fetchQualifyingResults({ year, location, id });
  if (!Array.isArray(qualiResults) && "error" in qualiResults)
    throw new Error(qualiResults.error as string);

  const gridResults = await fetchGrid({ year, location, id });
  if (!Array.isArray(gridResults) && "error" in gridResults)
    throw new Error(gridResults.error as string);

  const raceResults = await fetchRaceResults({ year, location, id });
  if (!Array.isArray(raceResults) && "error" in raceResults)
    throw new Error(raceResults.error as string);
};

const fetchSprintWeekend = async (params: {
  year: string;
  location: string;
  id: string;
}) => {
  const practiceResults = await fetchPracticeResults({
    ...params,
    practiceNb: 1,
  });
  if (!practiceResults) throw new Error("Practice 1 data not found");

  const sprintQualiResults = await fetchQualifyingResults({
    ...params,
    isSprint: true,
  });
  if (!sprintQualiResults) throw new Error("Sprint qualifying data not found");

  const sprintGridResults = await fetchGrid({
    ...params,
    isSprint: true,
  });
  if (!sprintGridResults) throw new Error("Sprint grid not found");

  const sprintResults = await fetchRaceResults({
    ...params,
    isSprint: true,
  });
  if (!sprintResults) throw new Error("Sprint results not found");

  const qualiResults = await fetchQualifyingResults(params);
  if (!qualiResults) throw new Error("Race qualifying data not found");

  const gridResults = await fetchGrid(params);
  if (!gridResults) throw new Error("Race grid not found");

  const raceResults = await fetchRaceResults(params);
  if (!raceResults) throw new Error("Race results not found");
};

const generateMessage = (dataType: string) =>
  `[fetchDataWithCrawler()] -> ${dataType} data stored successfully
  `;

const fetchDataWithCrawler = async (
  crawler: string,
  params: { year: string; location: string; id: string }
) => {
  try {
    if (crawler.startsWith("fp")) {
      const practiceNb = extractPracticeNb(crawler);
      if (!practiceNb) throw new Error("Practice number is not valid");

      const results = await fetchPracticeResults({
        ...params,
        practiceNb,
      });
      return results
      //  ? `Practice ${practiceNb}` : null;
    }

    const isSprint = crawler.startsWith("sprint");
    if (crawler.includes("qualifying")) {
      const results = await fetchQualifyingResults({
        ...params,
        isSprint,
      });
      return results
      // ? generateMessage("Qualifying") : null;
    }

    if (crawler.includes("grid")) {
      const results = await fetchGrid({ ...params, isSprint });
      return results
        // ? generateMessage(`${isSprint ? "Sprint" : "Race"} grid`)
        // : null;
    }

    if (crawler.includes("results")) {
      const results = await fetchRaceResults({ ...params, isSprint });
      return results
        // ? generateMessage(`${isSprint ? "Sprint" : "Race"} results`)
        // : null;
    }

    if (crawler === "full-weekend") {
      await fetchFullWeekend(params);
    }

    if (crawler === "sprint-weekend") {
      await fetchSprintWeekend(params);
    }

    throw new Error("Crawler is not valid.");
  } catch (error) {
    throw new Error(
      typeof error === "string"
        ? error
        : // @ts-ignore
        "message" in error
        ? error.message
        : // @ts-ignore
          error.toString()
    );
  }
};

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const crawlerType = params.get("crawler");
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
  } catch (details) {
    console.error("Error while fetching data (in route.ts) :", details);
    return NextResponse.json(
      { error: "Internal server error", details },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchPracticeResults } from "@/jscrawlers/scripts/practice";
import { fetchQualifyingResults } from "@/jscrawlers/scripts/qualifying";

function extractPracticeNb(crawlerType: Crawler) {
  if (crawlerType.startsWith("fp")) {
    const nb = parseInt(crawlerType.replace("fp", ""));
    return [1, 2, 3].includes(nb) ? (nb as 1 | 2 | 3) : undefined;
  }
  return;
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
        return resolve(results);
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

    // console.log("exec dir :", execDir);

    // const cmdout = exec(cmd, { cwd: execDir });
    // cmdout
    //   .then((value) => console.log("VALUE :", value))
    //   .catch((err) => console.error("ERRRRROR :", err));
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

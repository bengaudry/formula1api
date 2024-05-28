import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<RaceResults | { error: string }>> {
  const params = req.nextUrl.searchParams;
  try {
    const year = params.get("year");
    const location = params.get("location");

    if (!year || !location) throw new Error("Parameter missing");

    const dataDir = path.join(process.cwd(), "src", "data");
    const fileContent = await fs.readFile(
      path.join(
        dataDir,
        Array.isArray(year) ? year.join("") : year,
        Array.isArray(location) ? location.join("") : location,
        "race_results.json"
      ),
      "utf-8"
    );
    const data = JSON.parse(fileContent);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 200 }
    );
  }
}

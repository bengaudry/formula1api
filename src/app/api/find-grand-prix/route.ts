import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  try {
    const year = params.get("year");
    const query = params.get("query");

    if (!year || !query) {
      throw new Error("Required parameters are missing");
    }

    const dataDir = path.join(process.cwd(), "src", "data");
    const fileContent = await fs.readFile(
      path.join(dataDir, year, "season_structure.json"),
      "utf-8"
    );
    const structure: SeasonStructure = JSON.parse(fileContent);

    const idx = structure.grands_prix.findIndex(({ keywords }) =>
      keywords.includes(query)
    );

    if (idx === -1) {
      throw new Error("No grand prix corresponding to the query");
    }

    return NextResponse.json(structure.grands_prix[idx], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "No data found", details: err },
      { status: 400 }
    );
  }
}

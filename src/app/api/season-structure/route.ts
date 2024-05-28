import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<SeasonStructure | { error: string }>> {
  const params = req.nextUrl.searchParams;
  try {
    const year = params.get("year");

    if (!year) throw new Error("Parameter missing");

    const dataDir = path.join(process.cwd(), "src", "data");
    const fileContent = await fs.readFile(
      path.join(
        dataDir,
        year,
        "season_structure.json"
      ),
      "utf-8"
    );
    const data: SeasonStructure = JSON.parse(fileContent);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 200 }
    );
  }
}

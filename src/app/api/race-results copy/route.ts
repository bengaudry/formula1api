import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const year = "2024";
  const location = "australia";
  try {
    const dataDir = path.join(process.cwd(), "src", "app", "api", "data");
    const fileContent = await fs.readFile(
      path.join(dataDir, year, location, "race_results.json"),
      "utf-8"
    );
    const data = JSON.parse(fileContent);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: err },
      { status: 200 }
    );
  }
}

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function fetchWeekendData<T>(
  apiName: F1DataType | string,
  params: URLSearchParams
): Promise<NextResponse<T> | NextResponse<{ error: any }>> {
  try {
    const year = params.get("year");
    const location = params.get("location");

    if (!year || !location)
      throw new Error(
        "Parameter missing : please provide either id or year and location"
      );

    const dataDir = path.join(process.cwd(), "src", "data");
    const fileContent = await fs.readFile(
      path.join(
        dataDir,
        year,
        location,
        `${apiName.replaceAll("-", "_")}.json`
      ),
      "utf-8"
    );
    const data = JSON.parse(fileContent);
    if (!data || "error" in data) throw new Error();
    return NextResponse.json(data, { status: 200 }) as NextResponse<T>;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: err },
      { status: 200 }
    );
  }
}
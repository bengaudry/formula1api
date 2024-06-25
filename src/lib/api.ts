import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

const crawlerNameToFileName = (crawler: string) => {
  return `${crawler.replaceAll("-", "_")}.json`;
};

const exitWithError = (error: string, status: number = 500) => {
  return NextResponse.json({ error }, { status });
};

export async function fetchWeekendData<T>(
  apiName: F1DataType | string,
  params: URLSearchParams
): Promise<NextResponse<T> | NextResponse<{ error: any }>> {
  try {
    const year = params.get("year");
    const location = params.get("location");

    if (!year || !location)
      return exitWithError(
        "Parameter missing : please provide either id or year and location"
      );

    const l = await list();
    if (!l || l.blobs.length <= 0) return exitWithError("No data found");

    const { blobs } = l;
    const pathName = `${year}/${location}/${crawlerNameToFileName(apiName)}`;
    const blob = blobs.find((b) => b.pathname === pathName);

    if (!blob) return exitWithError("Data not found");

    const req = await fetch(blob?.url);
    if (!req.ok) return exitWithError("Error in data (No body provided)");
    const data = await req.json();

    return NextResponse.json(data, { status: 200 }) as NextResponse<T>;
  } catch (err) {
    return exitWithError("Failed to fetch data");
  }
}

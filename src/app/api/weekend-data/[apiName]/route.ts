import { NextRequest, NextResponse } from "next/server";
import { fetchWeekendData } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { apiName: string } }
): Promise<NextResponse<RaceGrid | { error: string }>> {
  const { searchParams } = req.nextUrl;

  return fetchWeekendData(params.apiName as string, searchParams);
}

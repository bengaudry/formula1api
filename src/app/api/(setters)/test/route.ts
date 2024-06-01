import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const dataDir = path.join(process.cwd(), "src", "data");
  const body = req.body;
  if (!body)
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  const fileContent = JSON.parse(JSON.stringify(body));

  const response = fs.writeFileSync(
    path.join(dataDir, "test.json"),
    fileContent
  );
  return NextResponse.json(response, { status: 200 });
}

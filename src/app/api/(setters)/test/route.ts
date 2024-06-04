import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { exec } from "child_process";
import { promises as fs } from "fs";

const execAsync = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("err :", err);
        reject(err);
      }

      if (stderr) {
        console.error("stderr :", err);
        reject(err);
      }

      if (stdout) {
        console.info("stdout :", stdout);
        resolve(stdout);
      }
    });
  });
};

export async function POST(req: NextRequest) {
  console.log("executing");
  const dataDir = path.join(process.cwd(), "src", "data");
  const body = await req.json();
  console.log("body :", body);
  if (!body)
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  const fileContent = JSON.stringify(body);

  console.log("fileContent :", fileContent);

  await fs.writeFile(
    path.join(dataDir, "test.json"),
    JSON.parse(fileContent)
  );

  return NextResponse.json(null, { status: 200 });
}

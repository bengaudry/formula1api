import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { exec } from "node:child_process";
import { cwd } from "process";

// Fonction pour gérer les requêtes POST
export async function GET(req: NextRequest) {
  console.info(cwd());
  try {
    const params = req.nextUrl.searchParams;
    const crawlerType = params.get("crawler");
    const year = params.get("year");
    const location = params.get("location");
    const id = params.get("id");

    if (!crawlerType || !year || !location || !id) {
      return NextResponse.json({ error: "Missing parameters (expected : year, location, id, crawler)" }, { status: 400 });
    }

    exec("python full_weekend.py 2024 canada 1237", { cwd: path.join(cwd(), "../crawlers") }, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.error("!! Node couldn't execute the command !!");
        console.log(err);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.info(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

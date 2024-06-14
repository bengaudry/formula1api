import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { exec } from "node:child_process";
import { cwd } from "process";

// Fonction pour gérer les requêtes POST
export async function GET(req: NextRequest) {
  console.info("Current working directory", cwd());
  try {
    const params = req.nextUrl.searchParams;
    const crawlerType = params.get("crawler");
    const year = params.get("year");
    const location = params.get("location");
    const id = params.get("id");

    if (!crawlerType || !year || !location || !id) {
      return NextResponse.json(
        {
          error: "Missing parameters (expected : year, location, id, crawler)",
        },
        { status: 400 }
      );
    }

    const execDir = path.join(cwd(), "src", "crawlers");
    console.info("exec dir :", execDir);

    exec(
      "python full_weekend.py 2024 canada 1237",
      { cwd: execDir },
      (err, stdout, stderr) => {
        // the *entire* stdout (buffered)
        console.info(`stdout: ${stdout}`);
        console.info(`stderr: ${stderr}`);

        if (err) {
          // node couldn't execute the command
          console.error("!! Node couldn't execute the command !!");
          console.log(err);
          return NextResponse.json(
            { error: "Internal Server Error", details: err },
            { status: 500 }
          );
        }

        if (stderr && stderr !== "") {
          // node couldn't execute the command
          console.error("!! Node couldn't execute the command (stderr) !!");
          return NextResponse.json(
            { error: "Internal Server Error", details: stderr },
            { status: 500 }
          );
        }
      }
    );

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}

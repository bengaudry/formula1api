import { NextRequest, NextResponse } from "next/server";
import path from "path";
import * as fs from "fs";

// Fonction utilitaire pour vérifier les clés d'un objet
function keysin(keys: Array<string>, obj: any): [string | null, boolean] {
  let i = 0;
  while (i < keys.length) {
    console.log(keys[i], typeof keys[i]);
    if (!Object.keys(obj).includes(keys[i])) return [keys[i], false];
    i++;
  }
  return [null, true];
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Fonction pour gérer les requêtes POST
export async function POST(req: NextRequest) {
  const dataDir = path.join(process.cwd(), "src", "data");

  try {
    const body = await req.json();
    if (!body) {
      console.error("No body provided");
      return NextResponse.json({ error: "No body provided" }, { status: 400 });
    }

    const team = body;

    const [errorKey, objectValidity] = keysin(
      ["id", "name", "teamPrincipal", "chassis", "powerUnit", "color"],
      team
    );
    if (!objectValidity) {
      console.error("Object unvalid (info missing)", errorKey);
      return NextResponse.json({ error: "Info missing" }, { status: 400 });
    }

    const teamsFilePath = path.join(dataDir, "teams.json");

    if (!fs.existsSync(teamsFilePath)) {
      fs.mkdirSync(teamsFilePath);
    }

    // Fetch previous drivers
    const prevDrivers = JSON.parse(
      fs.readFileSync(teamsFilePath, {
        encoding: "utf8",
        flag: "r",
      })
    );

    console.log("prevDrivers", prevDrivers);
    prevDrivers.push(team);

    await fs.promises.writeFile(
      teamsFilePath,
      JSON.stringify(prevDrivers, (key, value) => {
        if (key === "name" || key === "lastName")
          return capitalizeFirstLetter(value);
        if (key === "abbr" || key === "nationality") return value.toUpperCase();
        return value;
      })
    );

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

"use server";
import { put } from "@vercel/blob";
import path from "path";
import { cwd } from "process";
import * as fs from "fs";
import { cutGpName } from "./common";

async function createPathIfNotExisting(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

type Metadata = {
  id: string;
  dataType: F1DataType;
  year: string | number;
  url: string;
  location: string;
  sessionName: string;
  circuit: string;
  fileName: string;
};

export async function writeData(data: any, metadata: Metadata) {
  const { year, location, sessionName, fileName } =
    metadata;
  const dataDir = path.join(cwd(), "src", "data");
  const fileDir = path.join(dataDir, year.toString(), location);
  createPathIfNotExisting(fileDir);

  const gpName = cutGpName(sessionName);
  const obj = {
    ...metadata,
    gpName,
    results: data,
  };
  const jsonContent = JSON.stringify(obj, null, 2);
  fs.writeFileSync(path.join(fileDir, fileName), jsonContent);

  const blob = await put(
    `${year}/${location}/${fileName}.json`,
    JSON.stringify(obj),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    }
  );

  console.log("blob :", blob);
}

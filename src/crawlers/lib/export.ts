"use server";
import { put, PutBlobResult } from "@vercel/blob";
import { cutGpName } from "./common";

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
  try {
    const { year, location, sessionName, fileName } = metadata;

    console.log("[writeData()] -> Passed url :", metadata.url);

    const gpName = cutGpName(sessionName);
    const obj = {
      ...metadata,
      gpName,
      results: data,
    };

    console.log("[writeData()] -> Passed metadata :\n", metadata);
    console.log("[writeData()] -> Passed obj      :\n", data);

    const jsonContent = JSON.stringify(obj, null, 2);
    const blob = await put(
      `${year}/${location}/${fileName}.json`,
      jsonContent,
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      }
    );

    console.log("blob :", blob);
    return blob;
  } catch (err) {
    const strError = "ERROR WHILE ADDING TO DATABASE : " + err;
    console.error(strError);
    throw new Error(strError);
  }
}

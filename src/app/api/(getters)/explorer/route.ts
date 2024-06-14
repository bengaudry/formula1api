import { NextRequest, NextResponse } from "next/server";
import nodepath from "path";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  try {
    const dataDir = nodepath.join(process.cwd(), "src", "data");

    const dirContent: Array<{ name: string; path: string }> = await fs.readdir(
      dataDir,
      {
        encoding: "utf-8",
        recursive: true,
        withFileTypes: true,
      }
    );

    type DirContent = Array<{
      name: string;
      path: string;
      type: "file" | "folder";
      content: DirContent;
    }>;

    const fileRegex = /^[\w,\s-]+\.[A-Za-z]{3,4}$/;
    const dirContentRec: DirContent = [];
    dirContent.map(({ name, path }) => {
      const fPath = path;
      const matchingFilesOrFolders = dirContent.filter(({ path }) =>
        path.includes(fPath)
      );
      dirContentRec.push({
        name: name,
        path: nodepath.join(path, name),
        type: fileRegex.test(name) ? "file" : "folder",
        content: matchingFilesOrFolders,
      });
    });

    const folders = dirContentRec.filter(({ type }) => type === "folder");
    const files = dirContentRec.filter(({ type }) => type === "file");

    const finalData: DirContent = [];
    folders.map((folder) => {
      const matchingFiles = files.filter(({ path }) =>
        path.includes(folder.path)
      );
      finalData.push({
        name: folder.name,
        path: folder.path,
        type: "folder",
        content: matchingFiles,
      });
    });

    console.log("dir content :", dirContent);

    return NextResponse.json(finalData, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "No data found", details: err },
      { status: 400 }
    );
  }
}

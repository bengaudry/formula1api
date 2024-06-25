import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ExportJsonParams {
  data: any;
  id: string;
  location: string;
  circuit: string;
  sessionName: string;
  dataType: string;
  exportName: string;
  year: number;
}

export function exportJson({
  data,
  id,
  location,
  circuit,
  sessionName,
  dataType,
  exportName,
  year
}: ExportJsonParams): void {
  const finalData = {
    id: uuidv4(),
    weekendid: id,
    year: year,
    location: location,
    circuit: circuit,
    session_name: sessionName,
    session_type: dataType,
    results: data,
  };

  // Convert data to json
  const resultsJson = JSON.stringify(finalData, null, 4);

  const dirPath = path.join(__dirname, `../data/${year}/${location}`);
  const filePath = path.join(dirPath, `${exportName}.json`);

  // Create folders if needed
  fs.mkdirSync(dirPath, { recursive: true });

  // Write data to json file
  fs.writeFileSync(filePath, resultsJson, 'utf8');
}

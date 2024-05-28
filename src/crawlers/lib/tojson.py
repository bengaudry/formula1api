import os
import json
import uuid

def exportJson(
  data: any,
  id: str,
  location: str,
  circuit: str,
  session_name: str,
  data_type: str,
  exportname: str,
  year: int,
):
  final_data = {
    "id": str(uuid.uuid4()),
    "weekendid": id,
    "year": year,
    "location": location,
    "circuit": circuit,
    "session_name": session_name,
    "session_type": data_type,
    "results": data,
  }
  
  # Convert data to json
  results_json = json.dumps(final_data, indent=4)
  
  path = f"../data/{year}/{location}"
  filename = f"{exportname}.json"
  
  # Create folders if needed
  os.makedirs(path, exist_ok=True)
  
  # Writes data in json file
  with open(os.path.join(path, filename), "w") as file:
    file.write(results_json)

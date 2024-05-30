import os
import json
from .common import cut_gp_name

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
    "id": f"{id}_{data_type}",
    "weekendid": id,
    "data_type": data_type,
    "year": year,
    "location": location,
    "gp_name": cut_gp_name(session_name),
    "session_name": session_name,
    "circuit": circuit,
    "results": data,
  }
  
  # Convert data to json
  results_json = json.dumps(final_data, indent=4)
  
  path = f"../../../data/{year}/{location}"
  filename = f"{exportname}.json"
  
  # Create folders if needed
  os.makedirs(path, exist_ok=True)
  
  # Writes data in json file
  with open(os.path.join(path, filename), "w") as file:
    file.write(results_json)

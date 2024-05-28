import sys
from lib.tojson import exportJson
from lib.common import parse_url_content, get_driver_info

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]
  practiceNb = sys.argv[4]

  # Formula 1 webpage for practice results
  url = f"https://www.formula1.com/en/results.html/{year}/races/{id}/{location}/practice-{practiceNb}.html"

  session_name, circuit_name, table = parse_url_content(url)

  results = []
  for row in table.find('tbody').find_all('tr'):
      columns = row.find_all('td')
      result = {
          "position": None if columns[1].text.strip() == "NC" else int(columns[1].text.strip()),
          "driver": get_driver_info(columns[3], columns[2]),
          "car": columns[4].text.strip(),
          "time": columns[5].text.strip(),
          "gap": columns[6].text.strip() if columns[6].text.strip() else None,
          "laps": int(columns[7].text.strip())
      }
      results.append(result)
  
  exportJson(
    data=results,
    id=id,
    location=location,
    circuit=circuit_name,
    session_name=session_name,
    data_type=f"fp{practiceNb}",
    exportname=f"fp{practiceNb}_results", 
    year=year
  )
  
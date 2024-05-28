import sys
from lib.tojson import exportJson
from lib.common import parse_url_content, get_driver_info, team_color

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]
  sprint = False if len(sys.argv) < 5 else sys.argv[4] == "sprint"
  
  # Formula 1 webpage for race results
  url = f"https://www.formula1.com/en/results.html/{year}/races/{id}/{location}/{"sprint-results" if sprint else "race-result"}.html"

  session_name, circuit_name, table = parse_url_content(url)

  results = []
  for row in table.find('tbody').find_all('tr'):
      columns = row.find_all('td')
      result = {
        "position": None if columns[1].text.strip() == "NC" else int(columns[1].text.strip()),
      "driver": get_driver_info(columns[3], columns[2]),
        "car": columns[4].text.strip(),
        "teamColor": team_color(columns[4].text.strip()),
        "laps": int(columns[5].text.strip()),
        "time": columns[6].text.strip(),
        "points": int(columns[7].text.strip()),
      }
      results.append(result)

  exportJson(
    data=results,
    id=id,
    location=location,
    circuit=circuit_name,
    session_name=session_name,
    data_type="sprint-results" if sprint else "race-results",
    exportname="sprint_results" if sprint else "race_results", 
    year=year
  )

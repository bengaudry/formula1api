# Generates for each season (each year) a season_structure.json file
# containing all data about every grand prix of the season

# Run with ./generate_season_metadata.py -a for all gp since 2017
# or with ./generate_season_metadata.py -y <year> for a specific year

from datetime import datetime
import json
import os
import requests
import sys
from bs4 import BeautifulSoup

FILE_NAME="season_structure.json"
FIRST_CRAWLABLE_FORMULA_ONE_GRAND_PRIX_YEAR=2017
BASE_F1_URL="https://www.formula1.com"

def generate_keywords(gp_name):
  # Dictionary mapping Grand Prix names to their alternative names
  gp_keywords = {
    "australia": ["albert-park", "australian", "australia", "melbourne"],
    "bahrain": ["sakhir", "bahrain"],
    "china": ["shanghai", "chinese", "china"],
    "azerbaijan": ["baku", "bakku", "azerbaijan"],
    "spain": ["catalunya", "spanish", "spain"],
    "monaco": ["monaco", "monte-carlo"],
    "canadian": ["montreal", "canadian", "canada"],
    "french": ["paul-ricard", "french", "france"],
    "austria": ["red-bull-ring", "austrian", "austria"],
    "united-kingdom": ["silverstone", "british", "britain", "united-kingdom", "england"],
    "german": ["hockenheim", "german", "germany"],
    "hungary": ["hungaroring", "hungarian", "hungary"],
    "belgium": ["spa", "spa-francorchamps", "belgian", "belgium"],
    "italy": ["monza", "italian", "italy"],
    "singapore": ["marina-bay", "singapore"],
    "malaysia": ["malaysia"],
    "russia": ["sochi", "russian", "russia"],
    "japan": ["suzuka", "japanese", "japan"],
    "mexico": ["mexico-city", "mexican", "mexico"],
    "united-states": ["cota", "austin", "united-states", "usa"],
    "brazil": ["interlagos", "brazilian", "brazil"],
    "abu-dhabi": ["yas-marina", "abu-dhabi", "uae"],
    "emilia-romagna": ["imola", "emilia-romagna"],
    "portuguese": ["portimao", "portuguese", "portugal"],
    "styria": ["styrian", "styria", "austria"],
    "70th-anniversary": ["70th-anniversary"],
    "tuscany": ["mugello", "tuscan", "tuscany"],
    "germany": ["nurburgring", "eifel", "germany"],
    "saudi-arabia": ["jeddah", "djedda", "djeddah", "saudi-arabian", "saudi-arabia"],
    "qatar": ["losail", "qatar"],
    "miami": ["miami"],
    "las-vegas": ["las-vegas"],
    "netherlands": ["zandvoort", "dutch", "netherlands"],
  }

  # Normalize the input for case-insensitive matching
  gp_name = gp_name.lower().replace(" ", "-")

  # Retrieve the keywords list from the dictionary, defaulting to the input name if not found
  keywords = gp_keywords.get(gp_name, [gp_name])

  return keywords

# Example usage
keywords = generate_keywords("emilia-romagna")
print(keywords)  # Output: ["imola", "emilia-romagna"]


def generate_years_list(start_year=FIRST_CRAWLABLE_FORMULA_ONE_GRAND_PRIX_YEAR):
    current_year = datetime.now().year
    return list(range(start_year, current_year + 1))

def crawl_metadata_by_year (year: int):
  url = f"{BASE_F1_URL}/en/racing/{year}.html"
  print(f"url : {url}")

  # Get page content
  response = requests.get(url)
  response.raise_for_status()  # Checks response success

  # Parse page content with BeautifulSoup
  soup = BeautifulSoup(response.content, 'html.parser')
  grands_prix = []
  
  cards=soup.find_all('a', class_='event-item-wrapper event-item-link')
  if not cards:
    raise ValueError("No card found")
  
  for card in cards:
    # Filter all unwanted stuff (events, pre testing, esport...)
    if (card and "ROUND" in card.get("data-roundtext", [])):
      location = card.get("data-racecountryname").lower().replace(" ", "-")
      keywords = generate_keywords(location)
      grands_prix.append({
        "id": int(card.get("data-meetingkey")),
        "href": f"{BASE_F1_URL}{card.get("href")}",
        "location": location,
        "keywords": [location] if len(keywords) <= 1 else keywords,
        "sprint": False,
        "year": year,
        "start_date": card.find("span", class_="start-date").text,
        "end_date": card.find("span", class_="end-date").text,
        "month": card.find("span", class_="month-wrapper").text,
        "isOver": "completed" in card.find("div", class_="race-card").get("class", []),
        "gp_name": card.find("div", class_="event-title").text.strip()
    })
    
  return grands_prix

def crawl_and_export(year: int):
  metadata = crawl_metadata_by_year(year)
  print(f"Found {len(metadata)} grand prix")
  path = f"../data/{year}"
  # Create folders if needed
  os.makedirs(path, exist_ok=True)
  # Writes data in json file
  with open(os.path.join(path, FILE_NAME), "w") as file:
    file.write(json.dumps(metadata, indent=4))
        
if __name__ == "__main__":
  if (len(sys.argv) not in [2, 3]):
    exit(1)
  
  if (sys.argv[1] == "-a"):
    print(f"Generating for every grand prix since {FIRST_CRAWLABLE_FORMULA_ONE_GRAND_PRIX_YEAR}\n")
    years = generate_years_list()
    for year in years:
      print(f"\nYear {year}")
      crawl_and_export(year)
    exit(0)

        
  if (sys.argv[1] == "-y"):
    year = int(sys.argv[2])
    crawl_and_export(year)
    exit(0)
    
  exit(1)
    
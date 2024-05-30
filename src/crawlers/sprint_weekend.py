import sys
from lib.callcrawler import call_crawlers, call_crawler

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]
  
  call_crawlers(
    ["qualifying.py", "race_result.py", "starting_grid.py"],
    year, location, id, sprint=True
  )
  
  call_crawlers(
    ["qualifying.py", "race_result.py", "starting_grid.py"],
    year, location, id
  )
  
  call_crawler(
    "practice.py", f"{year} {location} {id} 1"
  )
  
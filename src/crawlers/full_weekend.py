import sys
from lib.callcrawler import call_crawlers

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]
  
  call_crawlers(
    ["allpractices.py", "qualifying.py", "starting_grid.py", "race_result.py"],
    year, location, id
  )

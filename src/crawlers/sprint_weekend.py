import sys
from lib.callcrawler import call_crawlers, call_crawler

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]
  
  call_crawlers(
    ["qualifying.py", "race_result.py"],
    year, location, id, sprint=True
  )
  
  call_crawler(
    "practice.py", f"{year} {location} 1 {id}"
  )
  
  call_crawlers(
    ["qualifying.py", "race_result.py"],
    year, location, id
  )
  
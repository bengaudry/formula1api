import re

def cutGpName (sessionName: str):
  words = sessionName.split(" ")
  return words[0:-3].join("")
    

def find_session_info (soup):
  session_name = soup.find('h1', class_='ResultsArchiveTitle').text.replace('\n', '').replace('  ', ' ').strip()
  circuit_name = soup.find('span', class_='circuit-info').text.strip()
  table = soup.find('table', class_='resultsarchive-table')
  return re.sub(r'\s+', ' ', session_name), circuit_name, table
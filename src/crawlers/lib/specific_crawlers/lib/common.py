import requests
from bs4 import BeautifulSoup
import re


def cut_gp_name(sessionName: str):
    words = sessionName.split(" ")
    return " ".join(words[:-3])


def find_session_info (soup):
  session_name = soup.find('h1', class_='ResultsArchiveTitle').text.replace('\n', '').replace('  ', ' ').strip()
  circuit_name = soup.find('span', class_='circuit-info').text.strip()
  table = soup.find('table', class_='resultsarchive-table')
  return re.sub(r'\s+', ' ', session_name), circuit_name, table


def get_driver_info (driver_col, car_nb_col):
  driver_info = driver_col.text.strip().split('\n')
  return {
    "firstName": driver_info[0],
    "lastName": driver_info[1],
    "abbr": driver_info[2],
    "number": int(car_nb_col.text.strip()),
  }


def parse_url_content(url: str):
  print(f"url : {url}")

  # Get page content
  response = requests.get(url)
  response.raise_for_status()  # Checks response success

  # Parse page content with BeautifulSoup
  soup = BeautifulSoup(response.content, 'html.parser')
  session_name, circuit_name, table = find_session_info(soup)
    
  if (
    table is None
    or session_name is None
    or circuit_name is None
  ):
    print("Error: Unable to find session information.")
    exit(1)
  
  return session_name, circuit_name, table
  
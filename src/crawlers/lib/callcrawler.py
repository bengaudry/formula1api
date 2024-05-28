import subprocess
import os
import sys


def print_crawler_result(exit_code, command):
    if exit_code != 0:
        print(f"Error: Command '{command}' failed with exit code {exit_code}\n")
    else:
        print(f"Command '{command}' executed successfully.\n")

      
def call_crawler(crawler, args):
    print(f"Calling crawler {crawler}...")
    # Chemin absolu vers le dossier specific_crawlers
    specific_crawlers_dir = os.path.join(os.path.dirname(__file__), "specific_crawlers")
    crawler_path = os.path.join(specific_crawlers_dir, crawler)
    
    # Vérification de l'existence du fichier
    if not os.path.exists(crawler_path):
        print(f"Error: Crawler script '{crawler}' not found in '{specific_crawlers_dir}'")
        return
    
    # Si le fichier est un script Python, utiliser l'interpréteur Python
    if crawler.endswith('.py'):
        command = f"{sys.executable} {crawler_path} {args}"
    else:
        command = f"{crawler_path} {args}"
    
    try:
        initial_dir = os.getcwd()
        os.chdir(specific_crawlers_dir)
        exit_code = subprocess.call(command)
        os.chdir(initial_dir)
    except Exception as e:
        exit_code = -1
        print(f"Exception occurred: {e}")
    
    print_crawler_result(exit_code, command)


def call_crawlers (crawlers, year, location, id, sprint=False):
  for crawler in crawlers:
    call_crawler(crawler, f"{year} {location} {id} {"sprint" if sprint else ""}")

# Example usage:
# call_crawlers(['crawler1', 'crawler2'], '2024', 'NYC', '1234', sprint=True)

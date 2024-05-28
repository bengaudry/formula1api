import sys
import subprocess

if __name__ == "__main__":
  year = sys.argv[1]
  location = sys.argv[2]
  id = sys.argv[3]

  for practiceNb in range(1, 3+1):
    # Construct the command
    command = f"practice.py {year} {location} {id} {practiceNb}"

    # Execute the command and capture the exit code
    exit_code = subprocess.call(command, shell=True)

    # Check if there was an error
    if exit_code != 0:
        print(f"Error: Command '{command}' failed with exit code {exit_code}")
    else:
        print(f"Command {command} executed successfully.")
        
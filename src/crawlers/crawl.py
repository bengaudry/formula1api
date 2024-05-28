import subprocess

seasons_structures = [
  {
    "year": 2024,
    "weekends": [
      {
        "location": "bahrain",
        "id": 1229,
        "sprint": False,
      },
     {
        "location": "saudi-arabia",
        "id": 1230,
        "sprint": False,
      },
     {
        "location": "australia",
        "id": 1231,
        "sprint": False,
      },
     {
        "location": "japan",
        "id": 1232,
        "sprint": False,
      },
      {
        "location": "china",
        "id": 1233,
        "sprint": True,
      },
      {
        "location": "miami",
        "id": 1234,
        "sprint": True,
      },
      {
        "location": "emilia-romagna",
        "id": 1235,
        "sprint": False,
      },
      {
        "location": "monaco",
        "id": 1236,
        "sprint": False,
      }
    ] 
  }
]

for season in seasons_structures:
  for gp in season["weekends"]:
    print(f'gp: {gp}')
    if gp["sprint"]:
      command = "sprint_weekend"
    else:
      command = "full_weekend"
    fullcommand = f"{command}.py {season['year']} {gp['location']} {gp['id']}"
    print(fullcommand)
    subprocess.call(fullcommand, shell=True)
    print("\n")



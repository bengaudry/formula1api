type F1DataType = "fp1"
| "fp2"
| "fp3"
| "sprint-qualifying"
| "race-qualifying"
| "sprint-results"
| "race-results";

type F1ApiData = {
  id: string;
  weekendid: string;
  session_type: F1DataType
  year: string;
  location: string;
  gp_name: string;
  session_name: string;
  circuit: string;
};

type RaceResults = F1ApiData & {
  results: Array<{
    position: number;
    driver: {
      firstName: string;
      lastName: string;
      abbr: string;
      number: number;
    };
    car: string;
    teamColor: string;
    laps: number;
    time: string;
    points: number;
  }>;
};

type SeasonStructure = {
  year: number;
  weekends: Array<{
    location: string;
    keywords: Array<string>;
    id: number;
    sprint: boolean;
    isOver: boolean;
  }>;
};

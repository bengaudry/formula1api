type F1DataType =
  | "fp1"
  | "fp2"
  | "fp3"
  | "sprint-qualifying"
  | "race-qualifying"
  | "race-grid"
  | "sprint-grid"
  | "sprint-results"
  | "race-results";

type Driver = {
  firstName: string;
  lastName: string;
  abbr: string;
  number: number;
};

type F1ApiData = {
  id: string;
  weekendid: string;
  session_type: F1DataType;
  year: string;
  location: string;
  gp_name: string;
  session_name: string;
  circuit: string;
};

type RaceResults = F1ApiData & {
  results: Array<{
    position: number;
    driver: Driver;
    car: string;
    teamColor: string;
    laps: number;
    time: string;
    points: number;
  }>;
};

type RaceGrid = F1ApiData & {
  results: Array<{
    position: number;
    driver: Driver;
    car: string;
    teamColor: string;
    time: string;
  }>;
};

type FreePractice = F1ApiData & {
  results: Array<{
    position: number;
    driver: Driver;
    car: string;
    teamColor: string;
    time: string;
  }>;
};

type Qualifying = F1ApiData & {
  results: Array<{
    position: number;
    driver: Driver;
    car: string;
    teamColor: string;
    times: {
      q1: string | null;
      q2: string | null;
      q3: string | null;
    };
    laps: 18;
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

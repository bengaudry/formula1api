type RaceResults = {
  weekendid: string;
  year: string;
  location: string;
  circuit: string;
  session_name: string;
  type: string;
  results: Array<{
    position: number;
    driver: {
      firstName: string;
      lastName: string;
      abbr: string;
      number: number;
    };
    car: string;
    laps: number;
    time: string;
    points: number;
  }>;
};

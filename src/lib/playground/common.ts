export async function fetchSeasonStructure(year: number) {
  const response = await fetch(`/api/season-structure?year=${year}`);
  if (!response.ok) throw new Error("Failed to fetch season structure");
  return response.json();
}

export async function fetchRaceResults(
  year: number,
  location: string,
  sprint?: boolean
) {
  const response = await fetch(
    `/api/weekend-data/${
      sprint ? "sprint" : "race"
    }-results?year=${year}&location=${location}`
  );
  if (!response.ok) throw new Error("Failed to fetch race results");
  return response.json();
}
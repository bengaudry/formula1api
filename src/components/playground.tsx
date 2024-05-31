export function RaceResultsDisplayer({ data }: { data: RaceResults }) {
  return (
    <ul className="max-w-screen-md mx-auto px-2">
      {data.results.map(
        ({ position, car, teamColor, driver, laps, points, time }, idx) => (
          <li
            key={idx}
            className={`grid grid-cols-12 gap-2 ${
              idx % 2 === 0 ? "bg-zinc-800" : ""
            } px-4 py-1 rounded-md`}
          >
            <span className="col-span-1 md:col-span-1">{position ?? "-"}</span>
            <span
              className="col-span-2 md:col-span-1 flex items-center"
              title={`${driver.firstName} ${driver.lastName}`}
            >
              <span
                className={`inline-block h-full w-2 rounded-full mr-1`}
                style={{ backgroundColor: teamColor }}
              />
              {driver.abbr}
            </span>
            <span className="hidden md:inline-block md:col-span-5 whitespace-nowrap overflow-hidden">
              {car}
            </span>
            <span className="col-span-5 md:col-span-3 whitespace-nowrap overflow-hidden">
              {time}
            </span>
            <span className="col-span-2 md:col-span-1">{laps}</span>
            <span className="col-span-2 md:col-span-1">
              {points > 0 && "+"}
              {points}
            </span>
          </li>
        )
      )}
    </ul>
  );
}

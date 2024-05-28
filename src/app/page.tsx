"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<RaceResults | null>(null);

  useEffect(() => {
    fetch("api/race-results?year=2024&location=monaco")
      .then((data) => data.json())
      .then((json) => {
        if ("error" in json) throw new Error(json.error);
        setData(json);
      });
  }, []);

  return (
    <div className="py-6">
      <header className="p-3 text-center">
        <h1 className="text-2xl font-bold">{data?.session_name}</h1>
        <p className="text-neutral-400">{data?.circuit}</p>
      </header>
      <ul className="max-w-screen-md mx-auto">
        {data?.results.map(
          ({ position, car, driver, laps, points, time }, idx) => (
            <li
              key={idx}
              className={`grid grid-cols-12 gap-2 ${
                idx % 2 === 0 ? "bg-neutral-800" : ""
              } px-2`}
            >
              <span className="col-span-1 md:col-span-1">
                {position ?? "-"}
              </span>
              <span className="col-span-2 md:col-span-1">{driver.abbr}</span>
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
    </div>
  );
}

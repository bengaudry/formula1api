"use client";
import { Button, Link } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { capitalizeFirstLetter } from "@/lib/str";
import { useState } from "react";

export default () => {
  const [crawlerType, setCrawlerType] = useState<Crawler>("full-weekend");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [location, setLocation] = useState("");
  const [identifier, setIdentifier] = useState<number>(-1);

  const { fetchData, isLoading, error } = useFetch<undefined>();

  const crawlers: Crawler[] = [
    "fp1",
    "fp2",
    "fp3",
    "full-weekend",
    "race-grid",
    "race-qualifying",
    "race-results",
    "sprint-grid",
    "sprint-qualifying",
    "sprint-results",
    "sprint-weekend",
  ];

  const handleRun = () => {
    fetchData(
      `/api/run-crawler?crawler=${crawlerType}&year=${year}&location=${location}&id=${identifier}`,
      { method: "GET" }
    );
  };

  const handleSelectChange = (val: string) => {
    // @ts-ignore
    if (crawlers.includes(val)) {
      setCrawlerType(val as Crawler);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Run crawler</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRun();
        }}
        className="flex flex-col gap-2 max-w-screen-sm"
      >
        <Input
          value={location}
          onChange={({ target }) => setLocation(target.value)}
          placeholder="Location (ex: monza)"
        />
        <div className="flex items-center gap-2">
          <Input
            value={year}
            onChange={({ target }) => setYear(target.value)}
            placeholder="Year"
          />
          <Input
            value={identifier < 0 ? "" : identifier}
            onChange={({ target }) => setIdentifier(parseInt(target.value))}
            placeholder="Identifier (ex: 1226)"
          />
        </div>

        <Select defaultValue={crawlerType} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a crawler" />
          </SelectTrigger>
          <SelectContent>
            {crawlers.map((crawler, idx) => (
              <SelectItem
                value={crawler}
                key={idx}
                defaultChecked={crawler === crawlerType}
              >
                {capitalizeFirstLetter(crawler)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? "..." : "Run crawler"}
        </Button>
      </form>

      <Link
        href={`https://www.formula1.com/en/racing/${
          year && year !== "" ? year : new Date().getFullYear()
        }`}
        target="_blank"
      >
        Formula 1 schedule
        <Icon name="arrow-right" className="ml-2 underline-0" />
      </Link>

      <p>{JSON.stringify(error)}</p>
    </>
  );
};

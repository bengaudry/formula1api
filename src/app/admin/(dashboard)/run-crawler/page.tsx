"use client";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { capitalizeFirstLetter } from "@/lib/str";
import { Button, Link } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";

export default () => {
  const [crawlerType, setCrawlerType] = useState<Crawler>("full-weekend");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [location, setLocation] = useState("");
  const [identifier, setIdentifier] = useState<number>(-1);

  const [outputPanelOpened, setOutputPanelOpened] = useState(false);

  const { data, fetchData, isLoading, error } = useFetch<undefined>();

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

  useEffect(() => {
    if (isLoading) setOutputPanelOpened(true);
  }, [isLoading]);

  return (
    <div className="relative h-screen">
      <h2 className="text-xl font-semibold mb-4">Run crawler</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRun();
        }}
        className="flex flex-col gap-2 max-w-screen-sm"
      >
        <Input
          required
          value={location}
          onChange={({ target }) => setLocation(target.value)}
          placeholder="Location (ex: monza)"
        />
        <div className="flex items-center gap-2">
          <Input
            required
            value={year}
            onChange={({ target }) => setYear(target.value)}
            placeholder="Year"
          />
          <Input
            required
            value={identifier < 0 ? "" : identifier}
            onChange={({ target }) => setIdentifier(parseInt(target.value))}
            placeholder="Identifier (ex: 1226)"
          />
        </div>

        <Select
          required
          defaultValue={crawlerType}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a crawler" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Full weekend</SelectLabel>
              {crawlers
                .filter((c) => c === "full-weekend" || c === "sprint-weekend")
                .map((crawler, idx) => (
                  <SelectItem
                    value={crawler}
                    key={idx}
                    defaultChecked={crawler === crawlerType}
                  >
                    {capitalizeFirstLetter(crawler)}
                  </SelectItem>
                ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Free practices</SelectLabel>
              {crawlers
                .filter((c) => c.startsWith("fp"))
                .map((crawler, idx) => (
                  <SelectItem
                    value={crawler}
                    key={idx}
                    defaultChecked={crawler === crawlerType}
                  >
                    {capitalizeFirstLetter(crawler)}
                  </SelectItem>
                ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Race</SelectLabel>
              {crawlers
                .filter((c) => c.startsWith("race"))
                .map((crawler, idx) => (
                  <SelectItem
                    value={crawler}
                    key={idx}
                    defaultChecked={crawler === crawlerType}
                  >
                    {capitalizeFirstLetter(crawler)}
                  </SelectItem>
                ))}
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Sprint</SelectLabel>
              {crawlers
                .filter((c) => c.startsWith("sprint") && c !== "sprint-weekend")
                .map((crawler, idx) => (
                  <SelectItem
                    value={crawler}
                    key={idx}
                    defaultChecked={crawler === crawlerType}
                  >
                    {capitalizeFirstLetter(crawler)}
                  </SelectItem>
                ))}
            </SelectGroup>
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

      <div
        className={`flex flex-col absolute bottom-16 right-0 w-full border-t border-zinc-800 h-80 ${
          outputPanelOpened ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <header className="flex flex-row items-center w-full justify-between h-12">
          <span className="font-medium">Command output</span>
          <button
            onClick={() => setOutputPanelOpened((op) => !op)}
            className="grid place-content-center hover:bg-zinc-800 w-7 h-7 aspect-square rounded-md"
          >
            <Icon
              name="angle-small-up"
              className={`block ${
                outputPanelOpened ? "rotate-180 -translate-y-0.5" : "rotate-0"
              } transition-transform w-full h-full origin-center`}
            />
          </button>
        </header>

        <div className={`overflow-hidden h-full`}>
          <textarea
            value={data ? JSON.stringify(data) : error ?? "No output"}
            readOnly
            className={`bg-transparent text-zinc-500 h-full w-full outline-none border-0`}
          />
        </div>
      </div>
    </div>
  );
};

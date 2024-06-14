"use client";
import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";

export default () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    fetch("/api/explorer")
      .then((raw) => raw.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2>Explorer</h2>
      <ul className="flex flex-col gap-1">
        {data?.map(
          ({
            name,
            type,
            content
          }: {
            name: string;
            path: string;
            type: "file" | "folder";
            content: Array<{ name: string }>;
          }) => (
            <>
              <p className="flex gap-1 items-center">
                <Icon name={type === "folder" ? "folder" : "file"} />
                {name}
              </p>
              <ul className="flex flex-col">
                {content.map(({name}) => (
                  <li>{name}</li>
                ))}
              </ul>
            </>
          )
        )}
      </ul>
    </>
  );
};

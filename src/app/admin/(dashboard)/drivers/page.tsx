"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [carNb, setCarNb] = useState<number>();
  const [nationality, setNationality] = useState("");

  useEffect(() => {
    if (lastName.length >= 3 && abbr === "") {
      setAbbr(lastName.slice(0, 3).toUpperCase());
    }
  }, [lastName]);

  const handleSubmit = () => {
    if (!name || !lastName || !abbr || !carNb || !nationality) return;
    if (
      name === "" ||
      lastName === "" ||
      abbr === "" ||
      carNb <= 0 ||
      nationality === ""
    )
      return;

    const driver = {
      name,
      lastName,
      abbr,
      carNb,
      nationality,
    };

    fetch("/api/create-team-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    }).catch(console.error);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Drivers</h2>

      <form
        className="flex flex-col gap-2"
        onSubmit={({ preventDefault }) => preventDefault()}
      >
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={({ target }) => setLastName(target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Abbr"
            value={abbr}
            onChange={({ target }) => setAbbr(target.value)}
          />
          <Input
            placeholder="Number"
            type="number"
            value={carNb}
            onChange={({ target }) => setCarNb(parseInt(target.value))}
          />
          <Input
            placeholder="Nationality"
            value={nationality}
            onChange={({ target }) => setNationality(target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

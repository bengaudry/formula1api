"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default () => {
  const [name, setName] = useState("");
  const [teamPrincipal, setTeamPrincipal] = useState("");
  const [powerUnit, setPowerUnit] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = () => {
    if (!name || !teamPrincipal || !powerUnit || !color) return;
    if (name === "" || teamPrincipal === "" || powerUnit === "" || color === "")
      return;

    const team = {
      name,
      teamPrincipal,
      powerUnit,
      color,
    };

    fetch("/api/create-team-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    }).catch(console.error);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Teams</h2>

      <form
        className="flex flex-col gap-2 max-w-screen-sm"
        onSubmit={({ preventDefault }) => preventDefault()}
      >
        <Input
          placeholder="Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <Input
          placeholder="Team principal (ex: Fred Vasseur)"
          value={teamPrincipal}
          onChange={({ target }) => setTeamPrincipal(target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Power unit"
            value={powerUnit}
            onChange={({ target }) => setPowerUnit(target.value)}
          />
          <Input
            placeholder="color"
            type="color"
            value={color}
            onChange={({ target }) => setColor(target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="mt-2">
          Submit
        </Button>
      </form>
    </>
  );
};

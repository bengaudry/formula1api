"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default () => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    console.log("body", JSON.stringify(text));
    fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(text),
    })
      .then((raw) => raw.json())
      .then(() => console.log("success"))
      .catch(console.error);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Drivers</h2>
      <textarea
        className="bg-zinc-800 w-full min-h-96"
        defaultValue={text}
        onChange={({ target }) => setText(target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

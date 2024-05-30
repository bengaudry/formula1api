import React, { useState } from "react";

interface DriverTimeProps {
  driver: {
    id: number;
    abbr: string;
    time: string;
  };
}

function DriverTime({ driver }: DriverTimeProps) {
  return (
    <div className="p-2 border rounded bg-gray-100">
      <span className="font-semibold">{driver.abbr}</span>: {driver.time}
    </div>
  );
}

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
}

function CollapsiblePanel({ title, children }: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border rounded">
      <div
        className="p-4 bg-blue-500 text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </div>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

interface DriverTimesPanelProps {
  session: string;
  data: any;
}

export function DriverTimesPanel({ session, data }: DriverTimesPanelProps) {
  if (!data) return null;

  return (
    <CollapsiblePanel title={session}>
      <div className="grid grid-rows-1 gap-2">
        {data.map((driver: any) => (
          <DriverTime key={driver.id} driver={driver} />
        ))}
      </div>
    </CollapsiblePanel>
  );
}
